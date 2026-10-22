/**
 * Pure calculation helpers for enological testing, laboratory SOPs, and winery calculations
 */
import type {
  ChemicalAddition,
  StructuredCompoundType,
  TankId
} from '../types/index.ts';
import { MASTER_PROTOCOL_CONFIG } from '../data/masterProtocolConfig.ts';

/**
 * Checks whether a given volume is already the pure liquid-phase volume from the Master Protocol
 * (e.g., 132 L per tank after Saignée, 264 L total, 150 L initial liquid per tank, 300 L total, 32 L Rosé).
 * Helps prevent operators from accidentally applying the mash-to-liquid yield discount twice on 132 L.
 */
export function isAlreadyLiquidVolume(volumeL: number): boolean {
  const rounded = Math.round(volumeL);
  return (
    rounded === MASTER_PROTOCOL_CONFIG.volumes.redLiquidFermentPerTankL || // 132 L
    rounded === MASTER_PROTOCOL_CONFIG.volumes.redLiquidFermentTotalL || // 264 L
    rounded === MASTER_PROTOCOL_CONFIG.volumes.initialLiquidPerTankL || // 150 L
    rounded === MASTER_PROTOCOL_CONFIG.volumes.initialLiquidL || // 300 L
    rounded === MASTER_PROTOCOL_CONFIG.volumes.roseClarifiedFermentL // 32 L
  );
}

/**
 * Returns the effective liquid-phase volume in liters.
 * During red wine maceration (unpressed mash with skins/cap: 157 L total mash = 132 L liquid + 25 L cap),
 * the true liquid-to-mash ratio is 132 / 157 = 0.8408 (~0.84 yield factor vs. 1.0 for pressed wine or Rosé).
 */
export type VolumeBasis = 'liquid_phase' | 'gross_mash';

export function getEffectiveLiquidVolume(
  volumeL: number,
  isUnpressedRedMustOrBasis: boolean | VolumeBasis = false,
  mashYieldFactor: number = 0.84
): number {
  if (volumeL <= 0) return 0;
  const isGrossMash = isUnpressedRedMustOrBasis === true || isUnpressedRedMustOrBasis === 'gross_mash';
  const factor = isGrossMash ? (mashYieldFactor > 0 && mashYieldFactor <= 1 ? mashYieldFactor : 0.84) : 1.0;
  return Math.round(volumeL * factor * 100) / 100;
}

/**
 * Calculates pure Potassium Metabisulfite (KMS) required in grams
 * Formula: KMS (g) = ((Target Free SO2 - Current Free SO2) * Effective Liquid Volume in Liters) / 576
 */
export function calculateKMS(
  volumeL: number,
  currentSO2: number,
  targetSO2: number,
  isUnpressedRedMust: boolean | VolumeBasis = false,
  mashYieldFactor: number = 0.84
): number {
  if (volumeL <= 0) return 0;
  const effectiveVol = getEffectiveLiquidVolume(volumeL, isUnpressedRedMust, mashYieldFactor);
  const diff = Math.max(0, targetSO2 - currentSO2);
  return Math.round(((diff * effectiveVol) / 576) * 100) / 100;
}

const HYDROMETER_CALIBRATION_POINTS: ReadonlyArray<readonly [number, number]> = [
  [10, -0.0016],
  [12, -0.0013],
  [14, -0.0010],
  [16, -0.0007],
  [18, -0.0004],
  [20, 0.0000],
  [22, 0.0004],
  [24, 0.0009],
  [26, 0.0014],
  [28, 0.0020],
  [30, 0.0026],
  [32, 0.0032]
];

/**
 * Normalizes Persian/Arabic digits, decimal separators, and shorthand integer SG readings (e.g., 1083 -> 1.083).
 */
export function normalizeEnologyNumericInput(
  raw: string | number,
  mode: 'sg' | 'general' = 'general'
): number | null {
  let parsed: number;
  if (typeof raw === 'number') {
    if (!Number.isFinite(raw)) return null;
    parsed = raw;
  } else {
    const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
    const arabicDigits = '٠١٢٣٤٥٦٧٨٩';
    let cleaned = String(raw);
    for (let i = 0; i < 10; i++) {
      cleaned = cleaned
        .replace(new RegExp(persianDigits[i], 'g'), String(i))
        .replace(new RegExp(arabicDigits[i], 'g'), String(i));
    }
    cleaned = cleaned.replace(/\s+/g, '');
    if (!cleaned || cleaned.includes('/') || !/^[+-]?\d+(?:[.,٫،]\d+)*$/.test(cleaned)) {
      return null;
    }
    cleaned = cleaned.replace(/[٫،]/g, ',');
    if (cleaned.includes(',') && cleaned.includes('.')) {
      cleaned = cleaned.replace(/,/g, '');
    } else if (cleaned.includes(',')) {
      const commaCount = (cleaned.match(/,/g) || []).length;
      if (
        commaCount > 1 ||
        (mode === 'general' && /^[+-]?\d{1,3}(,\d{3})+$/.test(cleaned))
      ) {
        cleaned = cleaned.replace(/,/g, '');
      } else {
        cleaned = cleaned.replace(/,/g, '.');
      }
    }
    if ((cleaned.match(/\./g) || []).length > 1) {
      return null;
    }
    parsed = Number.parseFloat(cleaned);
    if (Number.isNaN(parsed) || !Number.isFinite(parsed)) return null;
  }

  if (mode === 'sg' && Number.isInteger(parsed) && parsed >= 980 && parsed <= 1150) {
    return Math.round((parsed / 1000) * 10000) / 10000;
  }
  return parsed;
}

/**
 * Hydrometer temperature correction calibrated at 20°C or 15.5°C using piecewise linear interpolation.
 * Properly yields negative corrections for all temperatures below calibration point (e.g., 19°C -> -0.0002 at 20°C).
 */
export function correctHydrometer(
  measuredSG: number,
  tempC: number,
  calibrationTempC: 20 | 15.5 = 20
): { trueSG: number; delta: number; isAbove32CWarning?: boolean; warningFa?: string } {
  let delta = 0;

  if (tempC <= HYDROMETER_CALIBRATION_POINTS[0][0]) {
    delta = HYDROMETER_CALIBRATION_POINTS[0][1];
  } else if (tempC > 32) {
    delta = 0.0032 + (tempC - 32) * 0.0003;
  } else if (tempC >= HYDROMETER_CALIBRATION_POINTS[HYDROMETER_CALIBRATION_POINTS.length - 1][0]) {
    delta = HYDROMETER_CALIBRATION_POINTS[HYDROMETER_CALIBRATION_POINTS.length - 1][1];
  } else {
    for (let i = 0; i < HYDROMETER_CALIBRATION_POINTS.length - 1; i++) {
      const [t0, d0] = HYDROMETER_CALIBRATION_POINTS[i];
      const [t1, d1] = HYDROMETER_CALIBRATION_POINTS[i + 1];
      if (tempC >= t0 && tempC <= t1) {
        const fraction = (tempC - t0) / (t1 - t0);
        delta = d0 + fraction * (d1 - d0);
        break;
      }
    }
  }

  if (calibrationTempC === 15.5) {
    // Note: +0.0008 is a linear approximation calibrated for the 18–24 °C sample range
    delta += 0.0008;
  }

  const roundedDelta = Math.round(delta * 10000) / 10000;
  const trueSG = Math.round((measuredSG + roundedDelta) * 10000) / 10000;

  if (tempC > 32) {
    return {
      trueSG,
      delta: roundedDelta,
      isAbove32CWarning: true,
      warningFa: 'نمونه را خنک کنید؛ فرمول فقط تا ۳۲ °C دقیق است'
    };
  }

  return { trueSG, delta: roundedDelta };
}

/**
 * Scales winery mass & volume based on grape weight (baseline: 400kg)
 */
export function calculateScaleVolumes(grapeKg: number) {
  if (grapeKg <= 0) {
    return {
      mashVolume: 0,
      liquidVolume: 0,
      saigneeVolume: 0,
      roseFinalVolume: 0,
      redFinalVolume: 0,
    };
  }
  const factor = grapeKg / MASTER_PROTOCOL_CONFIG.metadata.grapeWeightKg;
  return {
    mashVolume: Math.round(MASTER_PROTOCOL_CONFIG.volumes.totalCrushedMashL * factor),
    liquidVolume: Math.round(MASTER_PROTOCOL_CONFIG.volumes.initialLiquidL * factor),
    saigneeVolume: Math.round(MASTER_PROTOCOL_CONFIG.volumes.saigneeRoseRawL * factor),
    roseFinalVolume: Math.round(MASTER_PROTOCOL_CONFIG.volumes.roseFinalBottlingL * factor),
    redFinalVolume: Math.round(
      MASTER_PROTOCOL_CONFIG.volumes.postPressFreeRunConservativePerTankL * 2 * factor
    ),
  };
}

/**
 * Titratable Acidity (TA) test by NaOH titration
 * Formula: TA (g/L as Tartaric Acid) = (V_NaOH (mL) * N_NaOH * 75) / V_sample (mL)
 * (75 is the milliequivalent weight of tartaric acid * 1000 / 2 = 150 / 2 = 75)
 */
export function calculateTitratableAcidity(
  vNaOH_mL: number,
  nNaOH: number = 0.1,
  vSample_mL: number = 5
): number {
  if (vSample_mL <= 0 || vNaOH_mL <= 0) return 0;
  const ta = (vNaOH_mL * nNaOH * 75) / vSample_mL;
  return Math.round(ta * 100) / 100;
}

/**
 * Calculates Tartaric Acid addition to reach target TA
 * Formula: Tartaric Acid (g) = (Target TA - Current TA) * Effective Liquid Volume (L)
 */
export function calculateTartaricAddition(
  currentTA: number,
  targetTA: number,
  volumeL: number,
  isUnpressedRedMust: boolean | VolumeBasis = false,
  mashYieldFactor: number = 0.84
): number {
  if (volumeL <= 0) return 0;
  const effectiveVol = getEffectiveLiquidVolume(volumeL, isUnpressedRedMust, mashYieldFactor);
  const diff = Math.max(0, targetTA - currentTA);
  return Math.round(diff * effectiveVol * 10) / 10;
}

/**
 * Empirical pH-shift bench-trial range estimator decoupled from TA stoichiometry.
 * Wine/must buffering capacity (β) varies between 30 and 55 mEq/(L·pH) (average ~42 mEq/(L·pH)),
 * so pH shift alone CANNOT determine an exact stoichiometric dose without bench trials or ΔTA.
 */
export function estimateAcidOrBaseFromPHShift(
  currentPH: number,
  targetPH: number,
  effectiveVolumeL: number
): {
  mode: 'acidification' | 'deacidification' | 'none';
  reagentFa: string;
  lowBufferGrams: number;
  typicalBufferGrams: number;
  highBufferGrams: number;
  isEmpiricalEstimateOnly: true;
  warningFa: string;
} {
  const vol = Math.max(0, effectiveVolumeL);
  if (currentPH > targetPH && vol > 0) {
    const steps = (currentPH - targetPH) / 0.1;
    return {
      mode: 'acidification',
      reagentFa: 'اسید تارتاریک L(+)',
      lowBufferGrams: Math.round(steps * 0.75 * vol * 10) / 10,
      typicalBufferGrams: Math.round(steps * 1.00 * vol * 10) / 10,
      highBufferGrams: Math.round(steps * 1.35 * vol * 10) / 10,
      isEmpiricalEstimateOnly: true,
      warningFa:
        'تخمین تجربی بر پایه ظرفیت بافری میانگین (صرفاً برای شروع تست ۳ لیوانی — غیرقابل تزریق مستقیم بدون سنجش TA!)'
    };
  }
  if (currentPH < targetPH && vol > 0) {
    const steps = (targetPH - currentPH) / 0.1;
    return {
      mode: 'deacidification',
      reagentFa: 'بیکربنات پتاسیم (KHCO3)',
      lowBufferGrams: Math.round(steps * 0.90 * vol * 10) / 10,
      typicalBufferGrams: Math.round(steps * 1.20 * vol * 10) / 10,
      highBufferGrams: Math.round(steps * 1.50 * vol * 10) / 10,
      isEmpiricalEstimateOnly: true,
      warningFa:
        'تخمین تجربی بر پایه ظرفیت بافری میانگین (صرفاً برای شروع تست ۳ لیوانی — استوکیومتری دقیق نیازمند ΔTA است!)'
    };
  }
  return {
    mode: 'none',
    reagentFa: 'بدون نیاز به اصلاح',
    lowBufferGrams: 0,
    typicalBufferGrams: 0,
    highBufferGrams: 0,
    isEmpiricalEstimateOnly: true,
    warningFa: ''
  };
}

/**
 * Returns all 3 stoichiometric deacidification options for a given TA reduction (g/L) and effective liquid volume (L):
 * - Pure stoichiometric KHCO3: 1.33 g/L per 1.0 g/L Tartaric Acid (2 * 100.115 / 150.09 = 1.334)
 * - KHCO3 with Cold Stabilization KHT precipitation: 1.00 g/L per 1.0 g/L TA
 * - Calcium Carbonate (CaCO3): 0.67 g/L per 1.0 g/L TA (100.09 / 150.09 = 0.667)
 */
export function calculateDeacidificationOptions(
  deltaTA_gL: number,
  effectiveVolumeL: number
): {
  khco3StoichiometricGrams: number;
  khco3WithColdStabGrams: number;
  caco3Grams: number;
} {
  if (deltaTA_gL <= 0 || effectiveVolumeL <= 0) {
    return {
      khco3StoichiometricGrams: 0,
      khco3WithColdStabGrams: 0,
      caco3Grams: 0
    };
  }
  const {
    khco3GramsPerGL_TA,
    khco3WithColdStabGramsPerGL_TA,
    caco3GramsPerGL_TA
  } = MASTER_PROTOCOL_CONFIG.stoichiometry;

  return {
    khco3StoichiometricGrams: Math.round(deltaTA_gL * khco3GramsPerGL_TA * effectiveVolumeL * 10) / 10,
    khco3WithColdStabGrams: Math.round(deltaTA_gL * khco3WithColdStabGramsPerGL_TA * effectiveVolumeL * 10) / 10,
    caco3Grams: Math.round(deltaTA_gL * caco3GramsPerGL_TA * effectiveVolumeL * 10) / 10
  };
}

/**
 * Calculates Potassium Bicarbonate (KHCO3) deacidification dosage in grams.
 * Note: True stoichiometry (1.33 g/L KHCO3 per 1.0 g/L TA reduction) requires `deltaTA_gL`.
 * When `deltaTA_gL` is not provided, returns an empirical starting estimate for a 3-glass bench trial.
 */
export function calculateKHCO3Deacidification(
  currentPH: number,
  targetMinPH: number,
  volumeL: number,
  isUnpressedRedMust: boolean | VolumeBasis = false,
  deltaTA_gL?: number,
  mashYieldFactor: number = 0.84
): number {
  if (volumeL <= 0) return 0;
  const effectiveVol = getEffectiveLiquidVolume(volumeL, isUnpressedRedMust, mashYieldFactor);
  const khco3Rate = MASTER_PROTOCOL_CONFIG.stoichiometry.khco3GramsPerGL_TA; // 1.33 g/L

  if (deltaTA_gL !== undefined && deltaTA_gL > 0) {
    return Math.round(deltaTA_gL * khco3Rate * effectiveVol * 10) / 10;
  }

  if (currentPH >= targetMinPH) return 0;
  return estimateAcidOrBaseFromPHShift(currentPH, targetMinPH, effectiveVol).typicalBufferGrams;
}

/**
 * Free SO2 Ripper Titration test
 * Formula: Free SO2 (mg/L or ppm) = (V_I2 (mL) * N_I2 * 32 * 1000) / V_sample (mL)
 * (32 is the equivalent weight of SO2)
 */
export function calculateFreeSO2Ripper(
  vI2_mL: number,
  nI2: number = 0.02,
  vSample_mL: number = 25
): number {
  if (vSample_mL <= 0 || vI2_mL <= 0) return 0;
  const freeSO2 = (vI2_mL * nI2 * 32 * 1000) / vSample_mL;
  return Math.round(freeSO2 * 10) / 10;
}

/**
 * Molecular (active antimicrobial) SO2 from Free SO2 and pH
 * Formula: Molecular SO2 = Free SO2 / (1 + 10^(pH - 1.81))
 * Standard target: 0.8 mg/L for red wines (or 0.5-0.8), preventing Brettanomyces & spoilage
 */
export function calculateMolecularSO2(freeSO2_ppm: number, pH: number): number {
  if (freeSO2_ppm <= 0 || pH <= 0) return 0;
  const denominator = 1 + Math.pow(10, pH - 1.81);
  const molecular = freeSO2_ppm / denominator;
  return Math.round(molecular * 100) / 100;
}

/**
 * Refractometer alcohol correction during fermentation (Sean Terrill Cubic Equation).
 * In Sean Terrill's polynomial, all Original Brix (ob) terms are negative and all Current Brix (cb) terms are positive:
 * SG = 1.001843 - 0.002318474*OB - 0.000007775*OB^2 - 0.000000034*OB^3
 *               + 0.00574*CB + 0.00003344*CB^2 + 0.000000086*CB^3
 */
export function calculateRefractometerCorrection(
  origBrix: number,
  currentRefractometerBrix: number
): {
  trueBrix: number;
  trueSG: number;
  abv: number;
  isWortEmpiricalApproximation: true;
  disclaimerFa: string;
} {
  const disclaimerFa =
    'تخمین تجربی اپتیکی (کالیبرهشده با چگالی اولیه؛ برای تصمیمگیریهای حساس SNA و پرسینگ صرفاً به هیدرومتر استناد شود)';
  if (origBrix <= 0) {
    return { trueBrix: 0, trueSG: 1.0, abv: 0, isWortEmpiricalApproximation: true, disclaimerFa };
  }
  const ob = origBrix;
  const cb = currentRefractometerBrix;

  const origSG = Math.round((1 + ob / (258.6 - ob * 0.88)) * 10000) / 10000;

  const terrillAt = (o: number, c: number) =>
    1.001843 -
    0.002318474 * o -
    0.000007775 * Math.pow(o, 2) -
    0.000000034 * Math.pow(o, 3) +
    0.00574 * c +
    0.00003344 * Math.pow(c, 2) +
    0.000000086 * Math.pow(c, 3);

  const calibratedSG = cb >= ob ? origSG : terrillAt(ob, cb) + (origSG - terrillAt(ob, ob));
  const roundedSG = Math.max(0.985, Math.round(calibratedSG * 10000) / 10000);

  if (cb >= ob) {
    return {
      trueBrix: Math.round(ob * 10) / 10,
      trueSG: roundedSG,
      abv: 0,
      isWortEmpiricalApproximation: true,
      disclaimerFa
    };
  }

  // True brix approximate from SG
  const trueBrix = Math.max(0, Math.round(((roundedSG - 1.0) / 0.004) * 10) / 10);

  const rawAbv =
    roundedSG >= origSG || origSG >= 1.775
      ? 0
      : ((76.08 * (origSG - roundedSG)) / (1.775 - origSG)) * (roundedSG / 0.794);
  const abv = Math.max(0, Math.round(rawAbv * 10) / 10);

  return { trueBrix, trueSG: roundedSG, abv, isWortEmpiricalApproximation: true, disclaimerFa };
}

/**
 * Staggered Nutrient Addition (SNA) calculations based on batch volume, must Brix, and Specific Gravity (SG).
 * - Sugar (g/L) = Brix * 10 * SG (converts % w/w Brix to % w/v g/L using SG).
 * - Uses Rasha Master Protocol Station 3 strain multipliers: low = 0.75, medium = 0.90 (216 mg N/L at 22 Brix), high = 1.10.
 * - Closed-form nitrogen mass balance: at 116 mg N/L deficit, DAP (0.15 g/L = 31.8 mg N/L) + Fermaid K (0.25 g/L = 25.0 mg N/L)
 *   + Fermaid O (0.50 g/L total = 20.0 mg N/L chemical or 60.0 mg N/L Lallemand 3x bio-equivalent) = 116.8 mg N eq/L.
 */
export function calculateSNAAmounts(
  volumeL: number,
  brix: number = 22,
  sgOrStrain: number | 'low' | 'medium' | 'high' = 'medium',
  naturalYAN: number = 100,
  sgOptional?: number,
  isUnpressedRedMust: boolean | VolumeBasis = false,
  mashYieldFactor: number = 0.84,
  customRates?: {
    fermaidO1RateGL?: number;
    fermaidK2RateGL?: number;
    dap2RateGL?: number;
    fermaidO3RateGL?: number;
    zincRateGL?: number;
  }
) {
  const effectiveVolumeL = getEffectiveLiquidVolume(Math.max(0, volumeL), isUnpressedRedMust, mashYieldFactor);
  const explicitSG = typeof sgOrStrain === 'number' ? sgOrStrain : sgOptional;
  const effectiveBrix =
    explicitSG && explicitSG > 0 && brix === 22 && Math.abs(explicitSG - 1.092) >= 0.004
      ? Math.max(0, Math.round(261.3 * (1 - 1 / explicitSG) * 10) / 10)
      : Math.max(0, brix);

  const strainMultiplier =
    sgOrStrain === 'low' ? 0.75 : sgOrStrain === 'high' ? 1.10 : 1.05;

  const initialSG =
    explicitSG && explicitSG > 0
      ? explicitSG
      : effectiveBrix > 0
      ? Math.round((1 + effectiveBrix / (258.6 - effectiveBrix * 0.88)) * 1000) / 1000
      : 1.0;

  // Sugar (g/L) = Brix * 10 * SG
  const sugarGPerL = Math.round(effectiveBrix * 10 * initialSG * 10) / 10;
  const sugarGL = Math.round(sugarGPerL);
  const targetYAN = Math.round(sugarGL * strainMultiplier);
  const neededYAN = Math.max(0, targetYAN - naturalYAN);

  // Baseline Needed YAN at 22 Brix (SG 1.092 -> Sugar 240 g/L -> Target 252 -> Needed 152 mg N/L)
  const baselineNeededYAN = 152;
  const yanScale = neededYAN > 0 ? neededYAN / baselineNeededYAN : 0;

  const fermaidO1Rate = customRates?.fermaidO1RateGL ?? 0.25;
  const fermaidK2Rate = customRates?.fermaidK2RateGL ?? 0.25;
  const dap2Rate = customRates?.dap2RateGL ?? 0.15;
  const fermaidO3Rate = customRates?.fermaidO3RateGL ?? 0.30;
  const zincRate =
    customRates?.zincRateGL ??
    MASTER_PROTOCOL_CONFIG.stoichiometry.zincSulfateHeptahydrateSafeRateGPerL;

  // Step 1: 24h post-inoculation / 10% sugar break (SG ~ 1.083) - 100% Organic Fermaid O
  const fermaidO_1 = Math.round(fermaidO1Rate * yanScale * effectiveVolumeL * 100) / 100;
  // Step 2: 24-25% sugar drop (SG ~ 1.070, before 1/3 sugar ceiling 1.062) - All Fermaid K & DAP + safe micro-Zinc
  const fermaidK_2 = Math.round(fermaidK2Rate * yanScale * effectiveVolumeL * 100) / 100;
  const dap_2 = Math.round(Math.min(0.30, dap2Rate * yanScale) * effectiveVolumeL * 100) / 100;
  const zinc_2 = Math.round(zincRate * effectiveVolumeL * 100) / 100;
  // Step 3: ~38% sugar drop (SG ~ 1.057) - Strictly 100% Organic Nitrogen (Fermaid O), 0g Fermaid K / DAP
  const fermaidO_3 = Math.round(fermaidO3Rate * yanScale * effectiveVolumeL * 100) / 100;

  const fermaidOGPerL = effectiveVolumeL > 0 ? (fermaidO_1 + fermaidO_3) / effectiveVolumeL : 0;
  const fermaidKGPerL = effectiveVolumeL > 0 ? fermaidK_2 / effectiveVolumeL : 0;
  const dapGPerL = effectiveVolumeL > 0 ? dap_2 / effectiveVolumeL : 0;

  const suppliedChemicalYAN_mgL =
    effectiveVolumeL > 0
      ? Math.round((fermaidOGPerL * 40 + fermaidKGPerL * 100 + dapGPerL * 212) * 10) / 10
      : 0;

  const suppliedBioEquivalentYAN_mgL =
    effectiveVolumeL > 0
      ? Math.round((fermaidOGPerL * 120 + fermaidKGPerL * 100 + dapGPerL * 212) * 10) / 10
      : 0;

  const additionalFermaidOForPureChemicalParityG = Math.max(
    0,
    Math.round(((neededYAN - suppliedChemicalYAN_mgL) / 40) * effectiveVolumeL * 100) / 100
  );

  return {
    initialSG,
    effectiveVolumeL,
    sugarGL,
    sugarGPerL,
    targetYAN,
    neededYAN,
    fermaidO_1,
    fermaidK_2,
    dap_2,
    zinc_2,
    fermaidO_3,
    fermaidK_3: 0,
    suppliedChemicalYAN_mgL,
    suppliedBioEquivalentYAN_mgL,
    additionalFermaidOForPureChemicalParityG,
    zincNoteFa:
      'با توجه به حضور ریزمغذی روی در Go-Ferm و Fermaid K، دوز سولفات روی خالص (ZnSO4·7H2O) روی سقف ایمن ۲ mg/L (معادل ۰.۴۵ mg/L یون روی عنصری) قفل شده است.'
  };
}

/**
 * Bench fining scaling from test trial rate (g/L) to full cellar tank
 */
export function calculateBenchFiningGrams(doseG_per_L: number, tankVolume_L: number): number {
  if (doseG_per_L <= 0 || tankVolume_L <= 0) return 0;
  return Math.round(doseG_per_L * tankVolume_L * 100) / 100;
}

/**
 * Dry ice calculation for urgent cooling of must/cap
 * Specific heat of must ~ 3.9 kJ/kg*°C, Must mass = Volume (L) * SG (kg/L, default 1.080),
 * Dry ice sublimation heat ~ 571 kJ/kg, Heat transfer efficiency ~ 65% (0.65)
 */
export function calculateCoolingDryIceKg(
  volumeL: number,
  currentTempC: number,
  targetTempC: number = 26,
  sg: number = 1.080,
  efficiency: number = 0.65
): number {
  if (volumeL <= 0 || currentTempC <= targetTempC) return 0;
  const effectiveSG = sg > 0 ? sg : 1.080;
  const effectiveEfficiency = efficiency > 0 && efficiency <= 1 ? efficiency : 0.65;
  const deltaT = currentTempC - targetTempC;
  const heatToExtractKJ = volumeL * effectiveSG * 3.9 * deltaT;
  const dryIceKg = heatToExtractKJ / (571 * effectiveEfficiency);
  return Math.round(dryIceKg * 100) / 100;
}

/**
 * Returns the pH-dependent Target Free SO2 (mg/L) range and target value
 * required to maintain 0.6–0.8 mg/L Molecular SO2 antimicrobial protection.
 */
export function getTargetFreeSO2ByPH(
  ph: number,
  isRose: boolean = false
): { min: number; max: number; target: number } {
  void isRose;
  if (ph <= 3.30) return { min: 20, max: 26, target: 24 };
  if (ph <= 3.40) return { min: 24, max: 32, target: 28 };
  if (ph <= 3.50) return { min: 30, max: 40, target: 35 };
  if (ph <= 3.60) return { min: 37, max: 49, target: 42 };
  const clampedPH = Math.min(4.2, ph);
  const hhRatio =
    (1 + Math.pow(10, clampedPH - 1.81)) / (1 + Math.pow(10, 3.60 - 1.81));
  return {
    min: Math.round(37 * hhRatio),
    max: Math.round(49 * hhRatio),
    target: Math.round(42 * hhRatio)
  };
}

/**
 * Continuous Henderson-Hasselbalch Free SO2 target (pKa1 = 1.81) eliminating step-table jumps:
 * Free SO2 = Molecular SO2 * (1 + 10^(pH - 1.81))
 */
export function getContinuousTargetFreeSO2ByPH(
  ph: number,
  isRose: boolean = false,
  targetMolecularMgL?: number
): {
  min: number;
  max: number;
  target: number;
  targetMolecularMgL: number;
  formulaText: string;
} {
  const clampedPH = Math.max(2.8, Math.min(4.2, Number.isFinite(ph) ? ph : 3.5));
  const factor = 1 + Math.pow(10, clampedPH - 1.81);
  const effectiveTargetMolecular =
    targetMolecularMgL !== undefined && targetMolecularMgL > 0
      ? targetMolecularMgL
      : isRose
      ? 0.75
      : 0.65;
  const minMolecular = isRose ? 0.60 : 0.55;
  const maxMolecular = isRose ? 0.85 : 0.80;

  const min = Math.round(Math.max(18, minMolecular * factor) * 10) / 10;
  const target = Math.round(Math.max(22, effectiveTargetMolecular * factor) * 10) / 10;
  const max = Math.round(Math.max(target, maxMolecular * factor) * 10) / 10;

  return {
    min,
    max,
    target,
    targetMolecularMgL: effectiveTargetMolecular,
    formulaText: `Free SO2 = ${effectiveTargetMolecular} × (1 + 10^(pH - 1.81))`
  };
}

export type ScalePrecisionGrams = 1 | 0.1 | 0.01;
export type StockCompoundCategory =
  | 'zinc'
  | 'kms'
  | 'copper'
  | 'tartaric'
  | 'fermaid_or_yeast'
  | 'general';

/**
 * Precision Scale & Stock Solution Assistant for micro-doses (e.g., 0.26g Zinc Sulfate on 0.1g or 1g scale).
 */
export function calculateStockSolutionPlan(
  targetDoseGrams: number,
  scalePrecisionGrams: ScalePrecisionGrams = 0.1,
  compoundCategory: StockCompoundCategory = 'general'
): {
  needsStockSolution: boolean;
  canUseStockSolution: boolean;
  targetDoseGrams: number;
  scalePrecisionGrams: ScalePrecisionGrams;
  stockMassGrams: number;
  stockVolumeMl: number;
  syringeVolumeMl: number;
  roundedDirectGrams: number;
  directWeighErrorPct: number;
  instructionFa: string;
  stabilityNoteFa: string;
} {
  const safeTarget = Math.max(0, targetDoseGrams);
  const needsStockSolution = safeTarget > 0 && safeTarget < 10 * scalePrecisionGrams;
  const canUseStockSolution = compoundCategory !== 'fermaid_or_yeast';

  let stockMassGrams = Math.max(scalePrecisionGrams * 10, 1.0);
  if (safeTarget >= stockMassGrams) {
    stockMassGrams = Math.ceil(safeTarget / scalePrecisionGrams) * scalePrecisionGrams;
  }
  const stockVolumeMl = 100;
  const syringeVolumeMl =
    safeTarget > 0
      ? Math.round((safeTarget / (stockMassGrams / stockVolumeMl)) * 10) / 10
      : 0;

  const roundedDirectGrams =
    safeTarget > 0
      ? Math.round(
          Math.max(
            scalePrecisionGrams,
            Math.round(safeTarget / scalePrecisionGrams) * scalePrecisionGrams
          ) * 100
        ) / 100
      : 0;

  const directWeighErrorPct =
    safeTarget > 0
      ? Math.round((Math.abs(roundedDirectGrams - safeTarget) / safeTarget) * 100)
      : 0;

  const instructionFa = !canUseStockSolution
    ? `مخمر و مغذی‌های ارگانیک (Fermaid / Go-Ferm) نباید به صورت محلول استوک نگهداری شوند؛ مقدار ${roundedDirectGrams} گرم را مستقیماً وزن و تازه مصرف کنید.`
    : `${stockMassGrams} گرم را وزن کرده و در ${stockVolumeMl} میلی‌لیتر آب مقطر حل کنید؛ سپس ${syringeVolumeMl} میلی‌لیتر از آن را با سرنگ بردارید.`;

  let stabilityNoteFa =
    'محلول استوک تازه را در ظرف شیشه‌ای تمیز با آب مقطر تهیه کنید.';
  if (compoundCategory === 'fermaid_or_yeast') {
    stabilityNoteFa =
      'ممنوعیت استوک: مخمر و مغذی‌های مخمری (Fermaid O/K, Go-Ferm) سوسپانسیون زیستی هستند و قابلیت نگهداری به صورت محلول استوک را ندارند.';
  } else if (compoundCategory === 'kms') {
    stabilityNoteFa =
      'هشدار پایداری KMS: محلول متابی‌سولفیت پتاسیم به سرعت گاز SO2 آزاد کرده و اکسید می‌شود؛ حتماً در همان روز تهیه و مصرف گردد.';
  } else if (compoundCategory === 'zinc' || compoundCategory === 'copper' || compoundCategory === 'tartaric') {
    stabilityNoteFa =
      'پایداری بالا: محلول استوک املاح معدنی (سولفات روی، سولفات مس) و اسید تارتاریک در بطری دربسته و جای خنک تا ۶ ماه پایدار است.';
  }

  return {
    needsStockSolution,
    canUseStockSolution,
    targetDoseGrams: safeTarget,
    scalePrecisionGrams,
    stockMassGrams,
    stockVolumeMl,
    syringeVolumeMl,
    roundedDirectGrams,
    directWeighErrorPct,
    instructionFa,
    stabilityNoteFa
  };
}

/**
 * Calculates dynamic Specific Gravity (SG) trigger thresholds based on actual initial must SG0:
 * Formula: SG_trigger = SG0 - f * (SG0 - 1.000)
 * - f = 0.10: SNA-1 (10% sugar drop, Fermaid O; 1.083 at SG0=1.092)
 * - f = 0.24: SNA-2 (~24% sugar drop, Fermaid K + DAP + Zinc; 1.070 at SG0=1.092 naturally without overrides)
 * - f = 0.33: 1/3 Sugar Break Ceiling (strictly last legal window for inorganic DAP / Fermaid K; 1.062 at SG0=1.092)
 * - f = 0.35: Phase 2 Red Color Tannin & seed removal (~35% sugar drop; 1.060 at SG0=1.092)
 * - f = 0.38: SNA-3 Final Organic Nitrogen Ceiling (100% Organic Fermaid O; 1.057 at SG0=1.092)
 */
export function calculateDynamicSGTriggers(
  initialSG: number = 1.092,
  overrides?: { pressingPoint?: number; drynessPoint?: number }
): {
  initialSG: number;
  sna1: number;
  sna2: number;
  oneThirdCeiling: number;
  phase2Tannin: number;
  sna3: number;
  pressingPoint: number;
  drynessPoint: number;
} {
  const sg0 = !Number.isFinite(initialSG) || initialSG <= 0 ? 1.092 : Math.max(1.020, initialSG);
  const span = sg0 - 1.000;
  const pressingPoint = Math.round((overrides?.pressingPoint ?? 1.008) * 1000) / 1000;
  const drynessPoint = Math.round((overrides?.drynessPoint ?? 0.993) * 1000) / 1000;
  return {
    initialSG: Math.round(sg0 * 1000) / 1000,
    sna1: Math.round((sg0 - 0.10 * span) * 1000) / 1000,
    sna2: Math.round((sg0 - 0.24 * span) * 1000) / 1000,
    oneThirdCeiling: Math.round((sg0 - 0.33 * span) * 1000) / 1000,
    phase2Tannin: Math.round((sg0 - 0.35 * span) * 1000) / 1000,
    sna3: Math.round((sg0 - 0.38 * span) * 1000) / 1000,
    pressingPoint,
    drynessPoint
  };
}

/**
 * Calculates 3% w/v Food-Grade Hydrogen Peroxide (H2O2, 30 mg/mL) volume in mL required to oxidize excess Free SO2.
 * Stoichiometry: SO2 (64.06 g/mol) + H2O2 (34.01 g/mol) -> H2SO4
 * 1 mg SO2 requires 34.01 / 64.06 = 0.5309 mg pure H2O2.
 * In a 3% w/v solution (30 mg/mL): 0.5309 / 30 = 0.0177 mL of 3% H2O2 per mg SO2.
 */
export function calculateH2O2SulfiteRemoval(
  volumeL: number,
  currentSO2: number,
  targetSO2: number = 35
): number {
  const effectiveTarget = Math.max(10, targetSO2);
  if (volumeL <= 0 || currentSO2 <= effectiveTarget) return 0;
  const excessSO2 = currentSO2 - effectiveTarget;
  const ml3Percent = excessSO2 * 0.0177 * volumeL;
  return Math.round(ml3Percent * 100) / 100;
}

/**
 * Staged H2O2 Sulfite Reduction Plan per AWRI Guidelines:
 * - Never reduce Free SO2 below 10 mg/L (clamps effectiveTargetSO2 >= 10)
 * - Maximum safe reduction per stage is 25 mg/L SO2
 * - Recommends 50% conservative trial step 1 and >3.5x dilution (<1% H2O2) before slow addition
 */
export function calculateStagedH2O2Plan(
  volumeL: number,
  currentSO2: number,
  targetSO2: number = 35
): {
  effectiveTargetSO2: number;
  totalExcessSO2MgL: number;
  maxSingleStepReductionMgL: number;
  currentStepReductionMgL: number;
  totalTheoretical3PercentMl: number;
  maxCurrentStep3PercentMl: number;
  recommendedSafeTrialStep1Ml: number;
  dilutedUnder1PercentTotalVolumeMl: number;
  stagesRequired: number;
  requiresReMeasurementBeforeNextStage: true;
} {
  const effectiveTargetSO2 = Math.max(10, targetSO2);
  const totalExcessSO2MgL = Math.max(0, Math.round((currentSO2 - effectiveTargetSO2) * 10) / 10);
  const maxSingleStepReductionMgL = 25;
  const currentStepReductionMgL = Math.min(maxSingleStepReductionMgL, totalExcessSO2MgL);
  const totalTheoretical3PercentMl = calculateH2O2SulfiteRemoval(volumeL, currentSO2, effectiveTargetSO2);
  const maxCurrentStep3PercentMl =
    Math.round(currentStepReductionMgL * 0.0177 * Math.max(0, volumeL) * 100) / 100;
  const recommendedSafeTrialStep1Ml = Math.round(maxCurrentStep3PercentMl * 0.50 * 100) / 100;
  const dilutedUnder1PercentTotalVolumeMl = Math.round(maxCurrentStep3PercentMl * 3.5 * 10) / 10;
  const stagesRequired = totalExcessSO2MgL > 0 ? Math.ceil(totalExcessSO2MgL / maxSingleStepReductionMgL) : 0;

  return {
    effectiveTargetSO2,
    totalExcessSO2MgL,
    maxSingleStepReductionMgL,
    currentStepReductionMgL,
    totalTheoretical3PercentMl,
    maxCurrentStep3PercentMl,
    recommendedSafeTrialStep1Ml,
    dilutedUnder1PercentTotalVolumeMl,
    stagesRequired,
    requiresReMeasurementBeforeNextStage: true
  };
}

export type CalculatorDirectDoseKind =
  | 'kms_so2'
  | 'tartaric_ta'
  | 'khco3_ta'
  | 'ph_shift'
  | 'sna_1'
  | 'sna_2'
  | 'sna_3'
  | 'fining_bentonite'
  | 'copper_stock_ml'
  | 'post_press_day11_lock'
  | 'finishing_glycerin';

export function buildCalculatorDirectAdditions(params: {
  kind: CalculatorDirectDoseKind;
  batchId: string;
  tankId: TankId;
  timestamp: string;
  currentSG?: number;
  referenceVolumeL: number;
  primaryAmount: number;
  secondaryAmount?: number;
  tertiaryAmount?: number;
  calculatedSO2MgL?: number;
  phShiftMode?: 'acidification' | 'deacidification' | 'none';
  noteFa?: string;
}): Array<Omit<ChemicalAddition, 'id'>> {
  if (params.primaryAmount <= 0 || params.referenceVolumeL <= 0) {
    return [];
  }

  const round2 = (val: number) => Math.round(val * 100) / 100;
  const baseFields = {
    batchId: params.batchId,
    tankId: params.tankId,
    timestamp: params.timestamp,
    sgAtAddition: params.currentSG,
    referenceVolumeL: params.referenceVolumeL,
    isDemo: false
  };

  switch (params.kind) {
    case 'kms_so2':
      return [
        {
          ...baseFields,
          compoundName: 'پتاسیم متابیسولفیت (KMS)',
          compoundType: 'kms' as StructuredCompoundType,
          pubchemCid: 24446,
          amount: round2(params.primaryAmount),
          unit: 'g',
          calculatedSO2MgL: params.calculatedSO2MgL,
          stageTitle: 'ثبت مستقیم از ماشین‌حساب سولفیت (SOP-TEST-04)',
          purpose:
            params.noteFa ||
            'تنظیم سولفیت آزاد بر اساس pH و حجم مایع مؤثر'
        }
      ];

    case 'tartaric_ta':
      return [
        {
          ...baseFields,
          compoundName: 'اسید تارتاریک خوراکی L(+)',
          compoundType: 'tartaric' as StructuredCompoundType,
          pubchemCid: 875,
          amount: round2(params.primaryAmount),
          unit: 'g',
          stageTitle: 'ثبت مستقیم از ماشین‌حساب اسیدیته کل (SOP-TEST-02)',
          purpose:
            params.noteFa ||
            'افزایش اسیدیته قابل تیتر (TA) به محدوده هدف'
        }
      ];

    case 'khco3_ta':
      return [
        {
          ...baseFields,
          compoundName: 'بی‌کربنات پتاسیم (KHCO3)',
          compoundType: 'khco3' as StructuredCompoundType,
          amount: round2(params.primaryAmount),
          unit: 'g',
          stageTitle: 'ثبت مستقیم اسیدزدایی از ماشین‌حساب TA (SOP-TEST-02)',
          purpose:
            params.noteFa ||
            'کاهش اسیدیته کل (TA) بر پایه استوکیومتری'
        }
      ];

    case 'ph_shift': {
      if (params.phShiftMode === 'none') return [];
      const isAcid = params.phShiftMode === 'acidification';
      return [
        {
          ...baseFields,
          compoundName: isAcid
            ? 'اسید تارتاریک خوراکی L(+)'
            : 'بی‌کربنات پتاسیم (KHCO3)',
          compoundType: (isAcid ? 'tartaric' : 'khco3') as StructuredCompoundType,
          amount: round2(params.primaryAmount),
          unit: 'g',
          stageTitle: 'ثبت مستقیم از ماشین‌حساب تنظیم pH (SOP-TEST-03)',
          purpose:
            params.noteFa || 'تنظیم pH پس از تایید تست ۳ لیوانی'
        }
      ];
    }

    case 'sna_1':
      return [
        {
          ...baseFields,
          compoundName: 'نیتروژن آلی (Fermaid O)',
          compoundType: 'fermaid_o' as StructuredCompoundType,
          amount: round2(params.primaryAmount),
          unit: 'g',
          milestoneId: 'sna-1',
          stageTitle: 'تغذیه نوبت اول مخمر (SNA-1)',
          purpose: 'تامین نیتروژن آلی اسیدهای آمینه در نوبت اول تغذیه'
        }
      ];

    case 'sna_2': {
      const items: Array<Omit<ChemicalAddition, 'id'>> = [
        {
          ...baseFields,
          compoundName: 'مکمل مخمر Fermaid K',
          compoundType: 'fermaid_k' as StructuredCompoundType,
          amount: round2(params.primaryAmount),
          unit: 'g',
          milestoneId: 'sna-2-dap',
          stageTitle: 'تغذیه نوبت دوم مخمر (SNA-2 در ۱/۳ افت قند)',
          purpose: 'تامین نیتروژن ترکیبی و تیامین در SNA-2'
        },
        {
          ...baseFields,
          compoundName: 'دی‌آمونیوم فسفات (DAP)',
          compoundType: 'dap' as StructuredCompoundType,
          pubchemCid: 24261,
          amount: round2(params.secondaryAmount ?? 0),
          unit: 'g',
          milestoneId: 'sna-2-dap',
          stageTitle: 'تغذیه نوبت دوم مخمر (SNA-2 در ۱/۳ افت قند)',
          purpose: 'تامین آمونیوم معدنی پیش از سقف ۱/۳ قند'
        },
        {
          ...baseFields,
          compoundName: 'سولفات روی هپتاهیدرات (ZnSO4·7H2O)',
          compoundType: 'zinc' as StructuredCompoundType,
          amount: round2(params.tertiaryAmount ?? 0),
          unit: 'g',
          milestoneId: 'sna-2-dap',
          stageTitle: 'تغذیه نوبت دوم مخمر (SNA-2 در ۱/۳ افت قند)',
          purpose: 'تامین کوفاکتور روی در سقف ایمن ۲ mg/L'
        }
      ];
      return items.filter((item) => item.amount > 0);
    }

    case 'sna_3':
      return [
        {
          ...baseFields,
          compoundName: 'نیتروژن آلی (Fermaid O)',
          compoundType: 'fermaid_o' as StructuredCompoundType,
          amount: round2(params.primaryAmount),
          unit: 'g',
          milestoneId: 'sna-3-organic',
          stageTitle: 'تغذیه نوبت سوم ۱۰۰٪ ارگانیک (SNA-3)',
          purpose: 'تغذیه نهایی ۱۰۰٪ ارگانیک بدون نمک آمونیوم'
        }
      ];

    case 'fining_bentonite':
      return [
        {
          ...baseFields,
          compoundName: 'بنتونیت انولوژیک (Bentonite)',
          compoundType: 'bentonite' as StructuredCompoundType,
          amount: round2(params.primaryAmount),
          unit: 'g',
          stageTitle: 'ثبت مستقیم از ماشین‌حساب زلال‌سازی (SOP-TEST-08)',
          purpose: 'شفاف‌سازی و حذف پروتئین‌های ناپایدار پس از تست لیوانی'
        }
      ];

    case 'copper_stock_ml':
      return [
        {
          ...baseFields,
          compoundName: 'محلول استوک ۰.۱٪ سولفات مس (CuSO4·5H2O)',
          compoundType: 'copper' as StructuredCompoundType,
          amount: round2(params.primaryAmount),
          unit: 'mL',
          stageTitle: 'اصلاح بوی احیایی H2S با استوک سولفات مس (SOP-TEST-08)',
          purpose: 'حذف سولفید هیدروژن پس از تایید تست ۵ لیوانی'
        }
      ];

    case 'post_press_day11_lock': {
      const items: Array<Omit<ChemicalAddition, 'id'>> = [
        {
          ...baseFields,
          compoundName: 'کیتوزان قارچی (Bactiless)',
          compoundType: 'bactiless' as StructuredCompoundType,
          amount: round2(params.primaryAmount),
          unit: 'g',
          milestoneId: 'day11-bactiless-kms-lock',
          stageTitle: 'روز ۱۱ - قفل کیتوزان ضدباکتری (Bactiless No-MLF Lock)',
          purpose: 'حذف باکتری‌های مالولاکتیک و استیک'
        },
        {
          ...baseFields,
          compoundName: 'پتاسیم متابیسولفیت (KMS)',
          compoundType: 'kms' as StructuredCompoundType,
          pubchemCid: 24446,
          amount: round2(params.secondaryAmount ?? 0),
          unit: 'g',
          calculatedSO2MgL: params.calculatedSO2MgL ?? 40,
          milestoneId: 'day11-bactiless-kms-lock',
          stageTitle: 'روز ۱۱ - تثبیت سولفیت پس از تخمیر',
          purpose: 'تثبیت شراب خشک پس از سیفون اول'
        }
      ];
      return items.filter((item) => item.amount > 0);
    }

    case 'finishing_glycerin':
      return [
        {
          ...baseFields,
          compoundName: 'گلیسیرین خوراکی خالص (Food-Grade Glycerin)',
          compoundType: 'glycerin' as StructuredCompoundType,
          amount: round2(params.primaryAmount),
          unit: 'g',
          stageTitle: 'روز ۸۵ - اصلاح حس دهانی با گلیسیرین (SOP-TEST-08)',
          purpose: 'گرد کردن ساختار تانن پس از تست ۳ لیوانی'
        }
      ];

    default:
      return [];
  }
}

export interface GraduatedSyringeMetrics {
  volumeMl: number;
  barrelCapacityMl: 1 | 5 | 10 | 20 | 50 | 100;
  fillRatio: number;
  liquidWidth: number;
  plungerX: number;
  majorTicks: Array<{ ml: number; x: number }>;
}

export function computeGraduatedSyringeMetrics(
  syringeVolumeMl: number
): GraduatedSyringeMetrics {
  const volumeMl = Math.max(
    0,
    Math.round((Number.isFinite(syringeVolumeMl) ? syringeVolumeMl : 0) * 100) /
      100
  );
  let barrelCapacityMl: 1 | 5 | 10 | 20 | 50 | 100;
  if (volumeMl <= 1) {
    barrelCapacityMl = 1;
  } else if (volumeMl <= 5) {
    barrelCapacityMl = 5;
  } else if (volumeMl <= 10) {
    barrelCapacityMl = 10;
  } else if (volumeMl <= 20) {
    barrelCapacityMl = 20;
  } else if (volumeMl <= 50) {
    barrelCapacityMl = 50;
  } else {
    barrelCapacityMl = 100;
  }

  const fillRatio = Math.min(1, Math.max(0, volumeMl / barrelCapacityMl));
  const liquidWidth = Math.round(fillRatio * 140 * 10) / 10;
  const plungerX = Math.round((34 + liquidWidth) * 10) / 10;

  const majorTicks: Array<{ ml: number; x: number }> = [];
  for (let i = 0; i <= 5; i++) {
    majorTicks.push({
      ml: Math.round(barrelCapacityMl * (i / 5) * 10) / 10,
      x: Math.round((34 + 140 * (i / 5)) * 10) / 10
    });
  }

  return {
    volumeMl,
    barrelCapacityMl,
    fillRatio,
    liquidWidth,
    plungerX,
    majorTicks
  };
}
