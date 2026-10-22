/**
 * Single Source of Truth (SSOT) Configuration & Flexible Parameterized Protocol Engine
 * for Rasha Sardasht 400kg Master Enology Protocol
 * Document Code: SOP-OENO-1405-RS400
 */
import { useState, useEffect, useCallback, useMemo } from 'react';
import type { ProtocolMaterial, VolumeBalance } from './protocolData.ts';

export interface TemperatureThresholdConfig {
  optimalMin: number;
  optimalMax: number;
  caution?: number;
  warningCeiling: number;
  crisisDanger: number;
}

export interface MasterProtocolConfig {
  metadata: {
    code: string;
    vintageYear: number;
    grapeWeightKg: number;
    targetInitialBrix: number;
    targetInitialSG: number;
    redFinalSG: number;
    roseFinalSG: number;
  };
  volumes: {
    totalCrushedMashL: number;
    crushedMashPerTankL: number;
    initialLiquidL: number;
    initialLiquidPerTankL: number;
    saigneeRoseRawL: number;
    saigneePerTankL: number;
    roseClarifiedFermentL: number;
    rosePostRackingL: number;
    roseFinalBottlingL: number;
    redMashAfterSaigneePerTankL: number;
    redLiquidFermentPerTankL: number;
    redLiquidFermentTotalL: number;
    redMashToLiquidYieldFactor: number;
    postPressFreeRunConservativePerTankL: number;
    postPressFreeRunRangePerTankL: { min: number; max: number };
    postPressRack1PerTankL: number;
    postPressRack2PerTankL: number;
    postPressColdStabPerTankL: number;
    postPressHeavyPressTotalL: number;
    postPressHeavyPressPerTankL: number;
  };
  temperatures: {
    redActiveMaceration: TemperatureThresholdConfig;
    roseActiveFermentation: TemperatureThresholdConfig;
    postPressingLiquidFinishing: {
      optimalMin: number;
      optimalMax: number;
      coldRiskBelow: number;
      warmWarningAbove: number;
    };
    finishedWineAging: {
      optimalMin: number;
      optimalMax: number;
      warningAbove: number;
      dangerAbove: number;
    };
  };
  stoichiometry: {
    kmsActiveSO2Fraction: number; // 0.576 (576 mg SO2 per g of KMS)
    h2o2_3PercentMlPerMgSO2: number; // 0.0177 mL of 3% w/v H2O2 (30 mg/mL) per mg SO2
    khco3GramsPerGL_TA: number; // 1.33 g/L stoichiometric KHCO3 per 1.0 g/L Tartaric Acid
    khco3WithColdStabGramsPerGL_TA: number; // 1.00 g/L effective with KHT cold precipitation
    k2co3GramsPerGL_TA: number; // 0.92 g/L for Potassium Carbonate (K2CO3)
    caco3GramsPerGL_TA: number; // 0.67 g/L for Calcium Carbonate (CaCO3)
    totalSO2LegalCeilingMgL: number; // 150 mg/L
    yeastEndogenousSO2MgL: number; // 15 mg/L
    sgTriggerTolerance: number; // 0.0025 SG units
    dapNitrogenMgPerG: number; // 212 mg N/g
    fermaidKNitrogenMgPerG: number; // 100 mg N/g
    fermaidOChemicalNitrogenMgPerG: number; // 40 mg N/g
    fermaidOBioEquivalentNitrogenMgPerG: number; // 120 mg N eq/g
    zincSulfateHeptahydrateSafeRateGPerL: number; // 0.002 g/L (2 mg/L = 0.45 mg/L Zn2+)
    yanTargetMultiplierMedium: number; // 1.05 (252 mg N/L at 240 g/L sugar)
    yanScaleBaselineMgL: number; // 152 mg N/L baseline deficit at 22 Brix (252 - 100)
  };
}

export const MASTER_PROTOCOL_CONFIG: MasterProtocolConfig = {
  metadata: {
    code: 'SOP-OENO-1405-RS400',
    vintageYear: 1405,
    grapeWeightKg: 400,
    targetInitialBrix: 22.0,
    targetInitialSG: 1.092,
    redFinalSG: 0.993,
    roseFinalSG: 0.991
  },
  volumes: {
    totalCrushedMashL: 350,
    crushedMashPerTankL: 175,
    initialLiquidL: 300,
    initialLiquidPerTankL: 150,
    saigneeRoseRawL: 36,
    saigneePerTankL: 18,
    roseClarifiedFermentL: 32,
    rosePostRackingL: 30,
    roseFinalBottlingL: 29,
    redMashAfterSaigneePerTankL: 157,
    redLiquidFermentPerTankL: 132,
    redLiquidFermentTotalL: 264,
    redMashToLiquidYieldFactor: 0.84,
    postPressFreeRunConservativePerTankL: 100,
    postPressFreeRunRangePerTankL: { min: 95, max: 110 },
    postPressRack1PerTankL: 96,
    postPressRack2PerTankL: 94,
    postPressColdStabPerTankL: 93,
    postPressHeavyPressTotalL: 28,
    postPressHeavyPressPerTankL: 14
  },
  temperatures: {
    redActiveMaceration: {
      optimalMin: 20.0,
      optimalMax: 28.5,
      caution: 28.5,
      warningCeiling: 30.0,
      crisisDanger: 32.0
    },
    roseActiveFermentation: {
      optimalMin: 16.0,
      optimalMax: 18.0,
      warningCeiling: 19.0,
      crisisDanger: 19.5
    },
    postPressingLiquidFinishing: {
      optimalMin: 21.0,
      optimalMax: 22.5,
      coldRiskBelow: 18.5,
      warmWarningAbove: 26.0
    },
    finishedWineAging: {
      optimalMin: 14.0,
      optimalMax: 16.0,
      warningAbove: 20.0,
      dangerAbove: 24.0
    }
  },
  stoichiometry: {
    kmsActiveSO2Fraction: 0.576,
    h2o2_3PercentMlPerMgSO2: 0.0177,
    khco3GramsPerGL_TA: 1.33,
    khco3WithColdStabGramsPerGL_TA: 1.00,
    k2co3GramsPerGL_TA: 0.92,
    caco3GramsPerGL_TA: 0.67,
    totalSO2LegalCeilingMgL: 150,
    yeastEndogenousSO2MgL: 15,
    sgTriggerTolerance: 0.0025,
    dapNitrogenMgPerG: 212,
    fermaidKNitrogenMgPerG: 100,
    fermaidOChemicalNitrogenMgPerG: 40,
    fermaidOBioEquivalentNitrogenMgPerG: 120,
    zincSulfateHeptahydrateSafeRateGPerL: 0.002,
    yanTargetMultiplierMedium: 1.05,
    yanScaleBaselineMgL: 152
  }
};

// ============================================================================
// PHASE 2A: FLEXIBLE PARAMETERIZED PROTOCOL ENGINE
// ============================================================================

export type FlexibleProtocolPresetId = 'conservative_ideal' | 'classic_v32' | 'custom';

export interface FlexibleProtocolParams {
  presetId: FlexibleProtocolPresetId;
  // 1. Harvest & Must Base
  grapeWeightKg: number;
  initialBrix: number;
  initialSG: number;
  naturalMustYANMgL: number;
  targetRedPH: number;
  targetRosePH: number;
  // 2. Volume & Yield Cascade (at 400kg base)
  mashYieldPer400KgL: number;
  initialLiquidPer400KgL: number;
  saigneeTotalL: number;
  roseClarifiedFermentL: number;
  rosePostRackingL: number;
  roseFinalBottlingL: number;
  redMashLiquidYieldFactor: number;
  postPressFreeRunPerTankL: number;
  postPressRack1PerTankL: number;
  postPressRack2PerTankL: number;
  postPressFinalPerTankL: number;
  heavyPressTotalL: number;
  // 3. Chemical & Nutrient Dose Rates (g/L or mg/L)
  crushSO2TargetMgL: number;
  postSaigneeRedSO2TargetMgL: number;
  pecticEnzymeRedRateGL: number;
  pecticEnzymeRoseRateGL: number;
  yeastRateGL: number;
  goFermMultiplier: number;
  fermaidO1RedRateGL: number;
  fermaidO1RoseRateGL: number;
  fermaidK2RedRateGL: number;
  fermaidK2RoseRateGL: number;
  dap2RedRateGL: number;
  dap2RoseRateGL: number;
  zincSafeRateGL: number;
  fermaidO3RedRateGL: number;
  fermaidO3RoseRateGL: number;
  bactilessRedRateGL: number;
  bactilessRoseRateGL: number;
  day11KmsRateGL: number;
  redMaxGlycerinGL: number;
  roseMaxGlycerinGL: number;
  ascorbicRateGL: number;
  // 4. Process & Thermal Thresholds
  pressingTargetSG: number;
  redCapWarningTempC: number;
  redCapDangerTempC: number;
}

/**
 * Ideal Recommended Defaults (Audited Scientific Protocol v2 — Conservative Realistic Cascade & Exact Stoichiometry)
 */
export const IDEAL_DEFAULT_PROTOCOL_PARAMS: FlexibleProtocolParams = {
  presetId: 'conservative_ideal',
  grapeWeightKg: 400,
  initialBrix: 22.0,
  initialSG: 1.092,
  naturalMustYANMgL: 100,
  targetRedPH: 3.52,
  targetRosePH: 3.32,
  mashYieldPer400KgL: 350,
  initialLiquidPer400KgL: 300,
  saigneeTotalL: 36,
  roseClarifiedFermentL: 32,
  rosePostRackingL: 30,
  roseFinalBottlingL: 29,
  redMashLiquidYieldFactor: 0.84,
  postPressFreeRunPerTankL: 100,
  postPressRack1PerTankL: 96,
  postPressRack2PerTankL: 94,
  postPressFinalPerTankL: 93,
  heavyPressTotalL: 28,
  crushSO2TargetMgL: 25,
  postSaigneeRedSO2TargetMgL: 40,
  pecticEnzymeRedRateGL: 0.055,
  pecticEnzymeRoseRateGL: 0.040,
  yeastRateGL: 0.25,
  goFermMultiplier: 1.20,
  fermaidO1RedRateGL: 0.25,
  fermaidO1RoseRateGL: 0.20,
  fermaidK2RedRateGL: 0.25,
  fermaidK2RoseRateGL: 0.18,
  dap2RedRateGL: 0.15,
  dap2RoseRateGL: 0.10,
  zincSafeRateGL: 0.002,
  fermaidO3RedRateGL: 0.30,
  fermaidO3RoseRateGL: 0.23,
  bactilessRedRateGL: 0.30,
  bactilessRoseRateGL: 0.25,
  day11KmsRateGL: 0.070,
  redMaxGlycerinGL: 3.5,
  roseMaxGlycerinGL: 1.5,
  ascorbicRateGL: 0.040,
  pressingTargetSG: 1.008,
  redCapWarningTempC: 28.5,
  redCapDangerTempC: 30.0
};

/**
 * Classic v3.2 Master Protocol Preset (110L -> 105L -> 100L Free-run Cascade & Commercial Blend Zinc)
 */
export const CLASSIC_V32_PROTOCOL_PARAMS: FlexibleProtocolParams = {
  ...IDEAL_DEFAULT_PROTOCOL_PARAMS,
  presetId: 'classic_v32',
  redMashLiquidYieldFactor: 0.84,
  postPressFreeRunPerTankL: 110,
  postPressRack1PerTankL: 105,
  postPressRack2PerTankL: 102,
  postPressFinalPerTankL: 100,
  heavyPressTotalL: 24,
  zincSafeRateGL: 0.012,
  day11KmsRateGL: 0.078,
  ascorbicRateGL: 0.035,
  redCapDangerTempC: 29.5
};

export interface FlexibleParamMetaItem {
  key: Exclude<keyof FlexibleProtocolParams, 'presetId'>;
  labelFa: string;
  unit: string;
  idealValue: number;
  classicValue: number;
  min: number;
  max: number;
  step: number;
  category: 'harvest' | 'volumes' | 'dosages' | 'thresholds';
  noteFa: string;
}

export const FLEXIBLE_PARAM_METADATA: ReadonlyArray<FlexibleParamMetaItem> = [
  {
    key: 'grapeWeightKg',
    labelFa: 'وزن کل انگور ورودی',
    unit: 'kg',
    idealValue: 400,
    classicValue: 400,
    min: 20,
    max: 5000,
    step: 10,
    category: 'harvest',
    noteFa: 'مبنای استاندارد مستر پروتکل رشه سردشت (توزیع متقارن در دو مخزن A و B)'
  },
  {
    key: 'initialBrix',
    labelFa: 'بریکس اولیه آب‌انگور (Brix₀)',
    unit: '°Bx',
    idealValue: 22.0,
    classicValue: 22.0,
    min: 18.0,
    max: 28.0,
    step: 0.2,
    category: 'harvest',
    noteFa: 'تعیین‌کننده قند واقعی (% w/v) و بودجه نیتروژن YAN'
  },
  {
    key: 'initialSG',
    labelFa: 'وزن مخصوص اولیه در ۲۰°C (SG₀)',
    unit: 'SG',
    idealValue: 1.092,
    classicValue: 1.092,
    min: 1.070,
    max: 1.120,
    step: 0.001,
    category: 'harvest',
    noteFa: 'مبنای محاسبه پویا برای نقاط تریگر تغذیه SNA و تانن فاز ۲'
  },
  {
    key: 'naturalMustYANMgL',
    labelFa: 'نیتروژن طبیعی انگور رشه (Natural YAN)',
    unit: 'mg N/L',
    idealValue: 100,
    classicValue: 100,
    min: 40,
    max: 250,
    step: 5,
    category: 'harvest',
    noteFa: 'میانگین نیتروژن بومی تاکستان‌های دیم سردشت'
  },
  {
    key: 'targetRedPH',
    labelFa: 'pH هدف شراب قرمز',
    unit: 'pH',
    idealValue: 3.52,
    classicValue: 3.52,
    min: 3.30,
    max: 3.65,
    step: 0.01,
    category: 'harvest',
    noteFa: 'توازن بهینه پایداری میکروبی SO2 و ساختار بدون تخمیر مالولاکتیک'
  },
  {
    key: 'targetRosePH',
    labelFa: 'pH هدف شراب رُزه سانیه',
    unit: 'pH',
    idealValue: 3.32,
    classicValue: 3.32,
    min: 3.15,
    max: 3.45,
    step: 0.01,
    category: 'harvest',
    noteFa: 'حفظ طراوت اسیدی و رنگ یاقوتی روشن در رُزه'
  },
  {
    key: 'redMashLiquidYieldFactor',
    labelFa: 'ضریب حجم مایع به مش پس از سانیه',
    unit: 'نسبت',
    idealValue: 0.84,
    classicValue: 0.84,
    min: 0.75,
    max: 0.90,
    step: 0.01,
    category: 'volumes',
    noteFa: 'در ۱۵۷ لیتر مش پس از سانیه، ۱۳۲ لیتر مایع خالص وجود دارد (132/157 = 0.8408)'
  },
  {
    key: 'saigneeTotalL',
    labelFa: 'حجم خون‌گیری سانیه رُزه (کل دو مخزن)',
    unit: 'L',
    idealValue: 36,
    classicValue: 36,
    min: 0,
    max: 80,
    step: 2,
    category: 'volumes',
    noteFa: '۱۲٪ فاز مایع اولیه (۱۸ لیتر از مخزن A + ۱۸ لیتر از مخزن B)'
  },
  {
    key: 'postPressFreeRunPerTankL',
    labelFa: 'حجم شراب آب‌آزاد هر مخزن (روز ۶)',
    unit: 'L/مخزن',
    idealValue: 100,
    classicValue: 110,
    min: 85,
    max: 115,
    step: 1,
    category: 'volumes',
    noteFa: 'بازده واقعی محافظه‌کارانه بدون فشار مکانیکی: ~۱۰۰ لیتر در هر مخزن (بازه ۹۵ تا ۱۱۰L)'
  },
  {
    key: 'postPressRack1PerTankL',
    labelFa: 'حجم سیفون اول دُرد سنگین (روز ۱۰)',
    unit: 'L/مخزن',
    idealValue: 96,
    classicValue: 105,
    min: 80,
    max: 110,
    step: 1,
    category: 'volumes',
    noteFa: 'حجم شراب صاف انتقالی به گالن‌های لب‌به‌لب پیش از تزریق باکتیلس'
  },
  {
    key: 'postPressFinalPerTankL',
    labelFa: 'حجم نهایی شراب قرمز پس از سرمازدایی (روز ۸۰)',
    unit: 'L/مخزن',
    idealValue: 93,
    classicValue: 100,
    min: 75,
    max: 105,
    step: 1,
    category: 'volumes',
    noteFa: 'حجم خالص بطری‌گذاری تراز اول پس از رسوب تارتارات'
  },
  {
    key: 'heavyPressTotalL',
    labelFa: 'حجم کل شراب پرس سنگین (مجموع دو مخزن)',
    unit: 'L کل',
    idealValue: 28,
    classicValue: 24,
    min: 10,
    max: 40,
    step: 2,
    category: 'volumes',
    noteFa: 'نگهداری مجزا برای Top-up یا تست آمیزش ۳ لیوانی روز ۸۶'
  },
  {
    key: 'zincSafeRateGL',
    labelFa: 'دوز مکمل روی در SNA-2 (ZnSO4 / Wyeast)',
    unit: 'g/L',
    idealValue: 0.002,
    classicValue: 0.012,
    min: 0.000,
    max: 0.015,
    step: 0.001,
    category: 'dosages',
    noteFa: '۰.۰۰۲ g/L برای سولفات روی خالص ۷ آبه (۰.۴۵ mg/L Zn²⁺)؛ ۰.۰۱۲ g/L برای مخلوط تجاری Wyeast'
  },
  {
    key: 'day11KmsRateGL',
    labelFa: 'نرخ متابی‌سولفیت تثبیت روز ۱۱ (همراه باکتیلس)',
    unit: 'g/L',
    idealValue: 0.070,
    classicValue: 0.078,
    min: 0.050,
    max: 0.100,
    step: 0.002,
    category: 'dosages',
    noteFa: '۰.۰۷۰ g/L معادل ۱.۴۰ گرم در هر گالن ۲۰ لیتری (~40 mg/L SO2)'
  },
  {
    key: 'ascorbicRateGL',
    labelFa: 'نرخ اسید اسکوربیک پیش از بطری‌گذاری (روز ۱۰۰)',
    unit: 'g/L',
    idealValue: 0.040,
    classicValue: 0.035,
    min: 0.000,
    max: 0.060,
    step: 0.005,
    category: 'dosages',
    noteFa: '۰.۰۴۰ g/L (مشروط به Free SO2 ≥ 30 mg/L؛ در شراب رُزه بسیار مفید و در شراب قرمز غنی از تانن اختیاری و قابل تنظیم روی صفر است)'
  },
  {
    key: 'pressingTargetSG',
    labelFa: 'وزن مخصوص نقطه طلایی پرسینگ قرمز',
    unit: 'SG',
    idealValue: 1.008,
    classicValue: 1.008,
    min: 1.002,
    max: 1.015,
    step: 0.001,
    category: 'thresholds',
    noteFa: 'جداسازی پوست پیش از استخراج تانن‌های تلخ هسته در الکل بالا'
  },
  {
    key: 'redCapDangerTempC',
    labelFa: 'سقف بحران حرارتی کلاهک قرمز',
    unit: '°C',
    idealValue: 30.0,
    classicValue: 29.5,
    min: 28.5,
    max: 32.0,
    step: 0.5,
    category: 'thresholds',
    noteFa: 'آستانه شوک حرارتی غشای مخمر RC-212 و الزام خنک‌سازی اضطراری'
  }
];

export interface DynamicProtocolPlan {
  params: FlexibleProtocolParams;
  scaleFactor: number;
  volumes: {
    totalCrushedMashL: number;
    crushedMashPerTankL: number;
    initialLiquidL: number;
    initialLiquidPerTankL: number;
    saigneeTotalL: number;
    saigneePerTankL: number;
    roseClarifiedFermentL: number;
    rosePostRackingL: number;
    roseFinalBottlingL: number;
    roseBottles750ml: number;
    redMashAfterSaigneePerTankL: number;
    redLiquidFermentPerTankL: number;
    redLiquidFermentTotalL: number;
    freeRunPerTankL: number;
    freeRunTotalL: number;
    rack1PerTankL: number;
    rack1TotalL: number;
    rack2PerTankL: number;
    rack2TotalL: number;
    finalRedPerTankL: number;
    finalRedTotalL: number;
    redBottles750ml: number;
    heavyPressTotalL: number;
    heavyPressPerTankL: number;
    totalBottles750ml: number;
  };
  triggers: {
    initialSG: number;
    sna1: number;
    sna2: number;
    oneThirdCeiling: number;
    phase2Tannin: number;
    sna3: number;
    pressingSG: number;
    drynessSG: number;
  };
  dosages: {
    crushKmsPerTankG: number;
    postSaigneeKmsPerTankG: number;
    day11KmsPerTankG: number;
    preBottlingKmsPerTankG: number;
    rosePostFermKmsG: number;
    rosePreBottlingKmsG: number;
    heavyPressKmsG: number;
    totalWineKmsG: number;
    pecticEnzymeRedPerTankG: number;
    pecticEnzymeRoseG: number;
    pecticEnzymeTotalG: number;
    whiteTanninRedPhase1PerTankG: number;
    whiteTanninRoseFermentG: number;
    whiteTanninRoseFinishingG: number;
    whiteTanninTotalG: number;
    redTanninPhase1PerTankG: number;
    redTanninPhase2PerTankG: number;
    redTanninFinishingPerTankG: number;
    redTanninTotalG: number;
    yeastRedPerTankG: number;
    yeastRoseG: number;
    yeastTotalG: number;
    goFermRedPerTankG: number;
    goFermRoseG: number;
    goFermTotalG: number;
    fermaidO1RedPerTankG: number;
    fermaidO1RoseG: number;
    fermaidO3RedPerTankG: number;
    fermaidO3RoseG: number;
    fermaidOTotalG: number;
    fermaidK2RedPerTankG: number;
    fermaidK2RoseG: number;
    fermaidKTotalG: number;
    dap2RedPerTankG: number;
    dap2RoseG: number;
    dapTotalG: number;
    zincRedPerTankG: number;
    zincRoseG: number;
    zincTotalG: number;
    bentoniteRoseG: number;
    bactilessRedPerTankG: number;
    bactilessRoseG: number;
    bactilessHeavyPressG: number;
    bactilessTotalG: number;
    khtColdStabRedPerTankG: number;
    khtColdStabRoseG: number;
    khtColdStabHeavyPressG: number;
    khtTotalG: number;
    glycerinRedMaxPerTankG: number;
    glycerinRoseMaxG: number;
    glycerinTotalMaxG: number;
    ascorbicRedPerTankG: number;
    ascorbicRoseG: number;
    ascorbicTotalG: number;
  };
  nitrogen: {
    sugarGPerL: number;
    targetYANMgL: number;
    neededYANMgL: number;
    suppliedChemicalYANRedMgL: number;
    suppliedBioEquivalentYANRedMgL: number;
    baseBioEquivalentYANMgL: number;
    unmetBioEquivalentYANMgL: number;
    yanAccountingBasisFa: string;
  };
  dynamicMaterials: ProtocolMaterial[];
  dynamicVolumeBalances: VolumeBalance[];
}

function round1(val: number): number {
  return Math.round(val * 10) / 10;
}

function round2(val: number): number {
  return Math.round(val * 100) / 100;
}

function round3(val: number): number {
  return Math.round(val * 1000) / 1000;
}

/**
 * Pure calculation engine that computes the entire winery mass/volume cascade,
 * dynamic SG triggers, nitrogen budget, and 20-row chemical BOM from FlexibleProtocolParams.
 */
export function computeDynamicProtocolPlan(
  overrides?: Partial<FlexibleProtocolParams>
): DynamicProtocolPlan {
  const params: FlexibleProtocolParams = {
    ...IDEAL_DEFAULT_PROTOCOL_PARAMS,
    ...(overrides || {})
  };

  const scaleFactor = Math.max(0.05, params.grapeWeightKg / 400);

  // 1. Volumes Cascade
  const totalCrushedMashL = round1(params.mashYieldPer400KgL * scaleFactor);
  const crushedMashPerTankL = round1(totalCrushedMashL / 2);
  const initialLiquidL = round1(params.initialLiquidPer400KgL * scaleFactor);
  const initialLiquidPerTankL = round1(initialLiquidL / 2);
  const saigneeTotalL = round1(params.saigneeTotalL * scaleFactor);
  const saigneePerTankL = round1(saigneeTotalL / 2);
  const roseClarifiedFermentL = round1(params.roseClarifiedFermentL * scaleFactor);
  const rosePostRackingL = round1(params.rosePostRackingL * scaleFactor);
  const roseFinalBottlingL = round1(params.roseFinalBottlingL * scaleFactor);
  const roseBottles750ml = Math.floor((roseFinalBottlingL * 1000) / 750);

  const redMashAfterSaigneePerTankL = round1(Math.max(10, crushedMashPerTankL - saigneePerTankL));
  const isCustomYieldFactor =
    params.redMashLiquidYieldFactor !== IDEAL_DEFAULT_PROTOCOL_PARAMS.redMashLiquidYieldFactor;
  const redLiquidFermentPerTankL = isCustomYieldFactor
    ? round1(Math.max(10, redMashAfterSaigneePerTankL * params.redMashLiquidYieldFactor))
    : round1(Math.max(10, initialLiquidPerTankL - saigneePerTankL));
  const redLiquidFermentTotalL = round1(redLiquidFermentPerTankL * 2);

  const freeRunPerTankL = round1(params.postPressFreeRunPerTankL * scaleFactor);
  const freeRunTotalL = round1(freeRunPerTankL * 2);
  const rack1PerTankL = round1(params.postPressRack1PerTankL * scaleFactor);
  const rack1TotalL = round1(rack1PerTankL * 2);
  const rack2PerTankL = round1(params.postPressRack2PerTankL * scaleFactor);
  const rack2TotalL = round1(rack2PerTankL * 2);
  const finalRedPerTankL = round1(params.postPressFinalPerTankL * scaleFactor);
  const finalRedTotalL = round1(finalRedPerTankL * 2);
  const redBottles750ml = Math.floor((finalRedTotalL * 1000) / 750);

  const heavyPressTotalL = round1(params.heavyPressTotalL * scaleFactor);
  const heavyPressPerTankL = round1(heavyPressTotalL / 2);
  const totalBottles750ml = redBottles750ml + roseBottles750ml;

  // 2. Dynamic SG Triggers
  const sg0 =
    !Number.isFinite(params.initialSG) || params.initialSG <= 0
      ? 1.092
      : Math.max(1.020, params.initialSG);
  const span = sg0 - 1.000;
  const triggers = {
    initialSG: round3(sg0),
    sna1: round3(sg0 - 0.10 * span),
    sna2: round3(sg0 - 0.24 * span),
    oneThirdCeiling: round3(sg0 - 0.33 * span),
    phase2Tannin: round3(sg0 - 0.35 * span),
    sna3: round3(sg0 - 0.38 * span),
    pressingSG: round3(params.pressingTargetSG),
    drynessSG: 0.993
  };

  // 3. Nitrogen Mass Balance
  const sugarGPerL = round1(params.initialBrix * 10 * sg0);
  const targetYANMgL = Math.round(Math.round(sugarGPerL) * 1.05);
  const neededYANMgL = Math.max(0, targetYANMgL - params.naturalMustYANMgL);
  const yanScale = neededYANMgL / 152; // 152 mg N/L is the 22 Brix / 1.092 SG baseline deficit

  // 4. Dosages
  // KMS at crush: 6.52g at 150L & 25 mg/L target (scaled proportionally)
  const crushKmsPerTankG = round2(6.52 * (initialLiquidPerTankL / 150) * (params.crushSO2TargetMgL / 25));
  const postSaigneeKmsPerTankG = round2(
    3.43 * (redLiquidFermentPerTankL / 132) * (params.postSaigneeRedSO2TargetMgL / 40)
  );
  const day11KmsPerTankG = round2(params.day11KmsRateGL * rack1PerTankL);
  const preBottlingKmsPerTankG = round2(0.030 * finalRedPerTankL);
  const rosePostFermKmsG = round2(0.078 * rosePostRackingL);
  const rosePreBottlingKmsG = round2(0.030 * roseFinalBottlingL);
  const heavyPressKmsG = round2(0.078 * heavyPressTotalL);
  const totalWineKmsG = round2(
    (crushKmsPerTankG + postSaigneeKmsPerTankG + day11KmsPerTankG + preBottlingKmsPerTankG) * 2 +
      rosePostFermKmsG +
      rosePreBottlingKmsG +
      heavyPressKmsG
  );

  const pecticEnzymeRedPerTankG = round2(params.pecticEnzymeRedRateGL * redLiquidFermentPerTankL);
  const pecticEnzymeRoseG = round2(params.pecticEnzymeRoseRateGL * saigneeTotalL);
  const pecticEnzymeTotalG = round2(pecticEnzymeRedPerTankG * 2 + pecticEnzymeRoseG);

  const whiteTanninRedPhase1PerTankG = round2(0.030 * redLiquidFermentPerTankL);
  const whiteTanninRoseFermentG = round2(0.035 * roseClarifiedFermentL);
  const whiteTanninRoseFinishingG = round2(0.015 * roseFinalBottlingL);
  const whiteTanninTotalG = round2(
    whiteTanninRedPhase1PerTankG * 2 + whiteTanninRoseFermentG + whiteTanninRoseFinishingG
  );

  const redTanninPhase1PerTankG = round2(0.100 * redLiquidFermentPerTankL);
  const redTanninPhase2PerTankG = round2(0.100 * redLiquidFermentPerTankL);
  const redTanninFinishingPerTankG = round2(0.025 * finalRedPerTankL);
  const redTanninTotalG = round2(
    (redTanninPhase1PerTankG + redTanninPhase2PerTankG + redTanninFinishingPerTankG) * 2
  );

  const yeastRedPerTankG = round2(params.yeastRateGL * redLiquidFermentPerTankL);
  const yeastRoseG = round2(params.yeastRateGL * roseClarifiedFermentL);
  const yeastTotalG = round2(yeastRedPerTankG * 2 + yeastRoseG);

  const goFermRedPerTankG = round2(yeastRedPerTankG * params.goFermMultiplier);
  const goFermRoseG = round2(yeastRoseG * params.goFermMultiplier);
  const goFermTotalG = round2(goFermRedPerTankG * 2 + goFermRoseG);

  const fermaidO1RedPerTankG = round2(params.fermaidO1RedRateGL * yanScale * redLiquidFermentPerTankL);
  const fermaidO1RoseG = round2(params.fermaidO1RoseRateGL * yanScale * roseClarifiedFermentL);
  const fermaidO3RedPerTankG = round2(params.fermaidO3RedRateGL * yanScale * redLiquidFermentPerTankL);
  const fermaidO3RoseG = round2(params.fermaidO3RoseRateGL * yanScale * roseClarifiedFermentL);
  const fermaidOTotalG = round2(
    (fermaidO1RedPerTankG + fermaidO3RedPerTankG) * 2 + fermaidO1RoseG + fermaidO3RoseG
  );

  const fermaidK2RedPerTankG = round2(params.fermaidK2RedRateGL * yanScale * redLiquidFermentPerTankL);
  const fermaidK2RoseG = round2(params.fermaidK2RoseRateGL * yanScale * roseClarifiedFermentL);
  const fermaidKTotalG = round2(fermaidK2RedPerTankG * 2 + fermaidK2RoseG);

  const dap2RedPerTankG = round2(params.dap2RedRateGL * yanScale * redLiquidFermentPerTankL);
  const dap2RoseG = round2(params.dap2RoseRateGL * yanScale * roseClarifiedFermentL);
  const dapTotalG = round2(dap2RedPerTankG * 2 + dap2RoseG);

  const zincRedPerTankG = round2(params.zincSafeRateGL * redLiquidFermentPerTankL);
  const zincRoseG = round2(
    (params.presetId === 'classic_v32' ? 0.015 : params.zincSafeRateGL) * roseClarifiedFermentL
  );
  const zincTotalG = round2(zincRedPerTankG * 2 + zincRoseG);

  const bentoniteRoseG = round2(0.20 * saigneeTotalL);

  const bactilessRedPerTankG = round2(params.bactilessRedRateGL * rack1PerTankL);
  const bactilessRoseG = round2(params.bactilessRoseRateGL * rosePostRackingL);
  const bactilessHeavyPressG = round2(params.bactilessRedRateGL * heavyPressTotalL);
  const bactilessTotalG = round2(bactilessRedPerTankG * 2 + bactilessRoseG + bactilessHeavyPressG);

  const khtColdStabRedPerTankG = round2(0.20 * finalRedPerTankL);
  const khtColdStabRoseG = round2(0.20 * rosePostRackingL);
  const khtColdStabHeavyPressG = round2(0.20 * heavyPressTotalL);
  const khtTotalG = round2(khtColdStabRedPerTankG * 2 + khtColdStabRoseG + khtColdStabHeavyPressG);

  const glycerinRedMaxPerTankG = round1(params.redMaxGlycerinGL * finalRedPerTankL);
  const glycerinRoseMaxG = round1(params.roseMaxGlycerinGL * roseFinalBottlingL);
  const glycerinTotalMaxG = round1(glycerinRedMaxPerTankG * 2 + glycerinRoseMaxG);

  const ascorbicRedPerTankG = round2(params.ascorbicRateGL * finalRedPerTankL);
  const ascorbicRoseG = round2(params.ascorbicRateGL * roseFinalBottlingL);
  const ascorbicTotalG = round2(ascorbicRedPerTankG * 2 + ascorbicRoseG + 1.0); // +1.0g for Stock #2B

  const suppliedChemicalYANRedMgL =
    redLiquidFermentPerTankL > 0
      ? round1(
          (((fermaidO1RedPerTankG + fermaidO3RedPerTankG) *
            MASTER_PROTOCOL_CONFIG.stoichiometry.fermaidOChemicalNitrogenMgPerG +
            fermaidK2RedPerTankG * MASTER_PROTOCOL_CONFIG.stoichiometry.fermaidKNitrogenMgPerG +
            dap2RedPerTankG * MASTER_PROTOCOL_CONFIG.stoichiometry.dapNitrogenMgPerG) /
            redLiquidFermentPerTankL)
        )
      : 0;

  const suppliedBioEquivalentYANRedMgL =
    redLiquidFermentPerTankL > 0
      ? round1(
          (((fermaidO1RedPerTankG + fermaidO3RedPerTankG) *
            MASTER_PROTOCOL_CONFIG.stoichiometry.fermaidOBioEquivalentNitrogenMgPerG +
            fermaidK2RedPerTankG * MASTER_PROTOCOL_CONFIG.stoichiometry.fermaidKNitrogenMgPerG +
            dap2RedPerTankG * MASTER_PROTOCOL_CONFIG.stoichiometry.dapNitrogenMgPerG) /
            redLiquidFermentPerTankL)
        )
      : 0;

  const baseBioEquivalentYANMgL = round1(
    (params.fermaidO1RedRateGL + params.fermaidO3RedRateGL) *
      MASTER_PROTOCOL_CONFIG.stoichiometry.fermaidOBioEquivalentNitrogenMgPerG +
      params.fermaidK2RedRateGL * MASTER_PROTOCOL_CONFIG.stoichiometry.fermaidKNitrogenMgPerG +
      params.dap2RedRateGL * MASTER_PROTOCOL_CONFIG.stoichiometry.dapNitrogenMgPerG
  );

  const unmetBioEquivalentYANMgL = Math.max(
    0,
    round1(neededYANMgL - suppliedBioEquivalentYANRedMgL)
  );

  const yanAccountingBasisFa = `کسری نیتروژن هدف (${neededYANMgL} mg N/L) بر پایه ضریب مقیاس YAN تامین میشود: نیتروژن شیمیایی مستقیم = ${suppliedChemicalYANRedMgL} mg N/L، نیتروژن معادل زیستی (با ضریب ۳ برابری اسیدهای آمینه Fermaid O) = ${suppliedBioEquivalentYANRedMgL} mg N eq/L (نرخ پایه پروتکل: ${baseBioEquivalentYANMgL} mg N eq/L) و کسری پوشش‌داده‌نشده (Unmet Bio-Equivalent Deficit) = ${unmetBioEquivalentYANMgL} mg N eq/L.`;

  const dynamicVolumeBalances: VolumeBalance[] = [
    {
      stage: 'مادهٔ اولیه',
      volume: `${params.grapeWeightKg} کیلوگرم انگور دست‌چین`,
      description: `بریکس هدف: ${params.initialBrix}، وزن مخصوص اولیه در ۲۰ درجه: SG₀ = ${triggers.initialSG.toFixed(3)}`
    },
    {
      stage: 'حجم کل تودهٔ کراش‌شده',
      volume: `حدود ${totalCrushedMashL} لیتر`,
      description: `تقسیم متقارن: ${crushedMashPerTankL} لیتر در مخزن A و ${crushedMashPerTankL} لیتر در مخزن B`
    },
    {
      stage: 'حجم کل فاز مایع اولیه (V_initial)',
      volume: `${initialLiquidL} لیتر مایع خالص`,
      description: `${initialLiquidPerTankL} لیتر مایع در مخزن A + ${initialLiquidPerTankL} لیتر مایع در مخزن B`
    },
    {
      stage: 'خون‌گیری سانیه برای رُزه (ساعت ۰۳:۰۰)',
      volume: `${saigneeTotalL} لیتر شیرهٔ رُزه`,
      description: `${saigneePerTankL}L از مخزن A + ${saigneePerTankL}L از مخزن B (پس از Débourbage: ${roseClarifiedFermentL}L تخمیری ← ${roseFinalBottlingL}L رُزه نهایی = ${roseBottles750ml} بطری ۷۵۰mL)`
    },
    {
      stage: 'حجم مایع قرمز پس از سانیه (V_red-ferm)',
      volume: `${redLiquidFermentTotalL} لیتر مایع کل`,
      description: `${redLiquidFermentPerTankL}L در مخزن A + ${redLiquidFermentPerTankL}L در مخزن B (حجم مش هر مخزن = ${redMashAfterSaigneePerTankL}L؛ ضریب مایع به مش = ${params.redMashLiquidYieldFactor})`
    },
    {
      stage: `موازنه در ایستگاه پرسینگ (روز ۶ در SG = ${triggers.pressingSG.toFixed(3)})`,
      volume: `${freeRunTotalL}L آب‌آزاد + ${heavyPressTotalL}L پرس سنگین`,
      description: `${freeRunPerTankL}L آب‌آزاد در هر مخزن + ${heavyPressPerTankL}L پرس سنگین در هر مخزن`
    },
    {
      stage: 'سیفون دُرد سنگین مخمر (روز ۱۰) و سیفون باکتیلس (روز ۲۱)',
      volume: `${rack1PerTankL}L (روز ۱۰) ← ${rack2PerTankL}L (روز ۲۱) در هر مخزن`,
      description: `مجموعاً ${rack1TotalL} لیتر شراب قرمز صاف در روز ۱۰ و ${rack2TotalL} لیتر پس از سیفون باکتیلس در روز ۲۱`
    },
    {
      stage: 'محصول نهایی تراز اول قرمز پس از سرمازدایی (روز ۸۰ تا ۱۰۰)',
      volume: `${finalRedPerTankL} لیتر در هر مخزن`,
      description: `مجموعاً ${finalRedTotalL} لیتر = ${redBottles750ml} بطری ۷۵۰ میلی‌لیتری (کل بطری‌های پروژه با رُزه: ${totalBottles750ml} بطری)`
    }
  ];

  const dynamicMaterials: ProtocolMaterial[] = [
    {
      row: '۱',
      name: 'پرکربنات سدیم (شویندهٔ قلیایی)',
      totalAmount: `${Math.round(400 * scaleFactor)} g`,
      doseRate: '4 g/L آب گرم',
      tankA: '—',
      tankB: '—',
      roseShare: '—',
      purpose: 'شستشوی اولیهٔ ظروف و شیلنگ‌ها پیش از ضدعفونی'
    },
    {
      row: '۲',
      name: 'جوش‌شیرین خوراکی (مشروط)',
      totalAmount: `${Math.round(400 * scaleFactor)} g`,
      doseRate: '2 g/L آب سرد (مشروط)',
      tankA: '—',
      tankB: '—',
      roseShare: '—',
      purpose: 'فقط در صورت سم‌پاشی دیرهنگام گوگرد در باغ'
    },
    {
      row: '۳',
      name: 'اسید سیتریک خوراکی',
      totalAmount: `${Math.round(300 * scaleFactor)} g`,
      doseRate: 'طبق فرمول',
      tankA: '—',
      tankB: '—',
      roseShare: '—',
      purpose: 'آبکشی، ساخت محلول ضدعفونی، الکترود و چوب‌پنبه'
    },
    {
      row: '۴',
      name: 'متابی‌سولفیت پتاسیم (K2S2O5)',
      totalAmount: `${totalWineKmsG.toFixed(2)} g (شراب) + 200 g (ضدعفونی)`,
      doseRate: `کراش: ${params.crushSO2TargetMgL} mg/L SO2\nپس از سانیه: ${params.postSaigneeRedSO2TargetMgL} mg/L\nروز ۱۱: ${params.day11KmsRateGL.toFixed(3)} g/L\nبطری: ~0.030 g/L`,
      tankA: `کراش (${initialLiquidPerTankL}L): ${crushKmsPerTankG.toFixed(2)} g\nساعت ۳.۵ (${redLiquidFermentPerTankL}L): ${postSaigneeKmsPerTankG.toFixed(2)} g\nروز ۱۱ (${rack1PerTankL}L): ${day11KmsPerTankG.toFixed(2)} g\nروز ۹۹ (${finalRedPerTankL}L): ~${preBottlingKmsPerTankG.toFixed(2)} g`,
      tankB: `کراش (${initialLiquidPerTankL}L): ${crushKmsPerTankG.toFixed(2)} g\nساعت ۳.۵ (${redLiquidFermentPerTankL}L): ${postSaigneeKmsPerTankG.toFixed(2)} g\nروز ۱۱ (${rack1PerTankL}L): ${day11KmsPerTankG.toFixed(2)} g\nروز ۹۹ (${finalRedPerTankL}L): ~${preBottlingKmsPerTankG.toFixed(2)} g`,
      roseShare: `پایان تخمیر (${rosePostRackingL}L): ${rosePostFermKmsG.toFixed(2)} g\nروز ۹۹ (${roseFinalBottlingL}L): ~${rosePreBottlingKmsG.toFixed(2)} g\n(پرس سنگین ${heavyPressTotalL}L: ${heavyPressKmsG.toFixed(2)} g)`,
      purpose: 'مهار اکسیداسیون، قفل مالولاکتیک و تنظیم سولفیت آزاد نهایی بر اساس pH'
    },
    {
      row: '۵',
      name: 'پودر آنزیم پکتولیتیک',
      totalAmount: `${pecticEnzymeTotalG.toFixed(2)} g`,
      doseRate: `قرمز: ${params.pecticEnzymeRedRateGL.toFixed(3)} g/L\nرُزه: ${params.pecticEnzymeRoseRateGL.toFixed(3)} g/L`,
      tankA: `${pecticEnzymeRedPerTankG.toFixed(2)} g (در ${redLiquidFermentPerTankL}L)`,
      tankB: `${pecticEnzymeRedPerTankG.toFixed(2)} g (در ${redLiquidFermentPerTankL}L)`,
      roseShare: `${pecticEnzymeRoseG.toFixed(2)} g (در ${saigneeTotalL}L)`,
      purpose: 'شکستن پکتین دیوارهٔ سلولی پوست رشه و شفاف‌سازی رُزه'
    },
    {
      row: '۶',
      name: 'تانن شراب سفید (گالیک)',
      totalAmount: `${whiteTanninTotalG.toFixed(2)} g`,
      doseRate: 'قرمز: 0.030 g/L\nرُزه: 0.035 + 0.015 g/L',
      tankA: `${whiteTanninRedPhase1PerTankG.toFixed(2)} g (در ${redLiquidFermentPerTankL}L)`,
      tankB: `${whiteTanninRedPhase1PerTankG.toFixed(2)} g (در ${redLiquidFermentPerTankL}L)`,
      roseShare: `شروع (${roseClarifiedFermentL}L): ${whiteTanninRoseFermentG.toFixed(2)} g\nروز ۸۵ (${roseFinalBottlingL}L): ${whiteTanninRoseFinishingG.toFixed(2)} g`,
      purpose: 'رسوب پروتئین‌های ناپایدار و مهار آنزیم لاکاز/تیروزیناز'
    },
    {
      row: '۷',
      name: 'تانن مخصوص شراب قرمز',
      totalAmount: `${redTanninTotalG.toFixed(2)} g`,
      doseRate: 'فاز ۱ و ۲: 0.10 g/L\nفینیشینگ: 0.025 g/L',
      tankA: `ساعت ۱۱ (${redLiquidFermentPerTankL}L): ${redTanninPhase1PerTankG.toFixed(2)} g\nدر SG ${triggers.phase2Tannin.toFixed(3)}: ${redTanninPhase2PerTankG.toFixed(2)} g\nروز ۸۵ (${finalRedPerTankL}L): ${redTanninFinishingPerTankG.toFixed(2)} g`,
      tankB: `ساعت ۱۱ (${redLiquidFermentPerTankL}L): ${redTanninPhase1PerTankG.toFixed(2)} g\nدر SG ${triggers.phase2Tannin.toFixed(3)}: ${redTanninPhase2PerTankG.toFixed(2)} g\nروز ۸۵ (${finalRedPerTankL}L): ${redTanninFinishingPerTankG.toFixed(2)} g`,
      roseShare: 'صفر (مطلقاً در رُزه ریخته نشود)',
      purpose: 'تثبیت کووالانسی آنتوسیانین‌های رنگ و ساختار مخملی'
    },
    {
      row: '۸',
      name: 'اسید تارتاریک خوراکی L(+)',
      totalAmount: `ذخیره: ${Math.round(600 * scaleFactor)} g`,
      doseRate: 'طبق تست ۳ لیوانی و کنترل TA',
      tankA: `~ ${Math.round(150 * scaleFactor)}–${Math.round(250 * scaleFactor)} g (هدف pH = ${params.targetRedPH})`,
      tankB: `~ ${Math.round(150 * scaleFactor)}–${Math.round(250 * scaleFactor)} g (هدف pH = ${params.targetRedPH})`,
      roseShare: `~ ${Math.round(50 * scaleFactor)}–${Math.round(80 * scaleFactor)} g (هدف pH = ${params.targetRosePH})`,
      purpose: `تنظیم pH قرمز روی ${params.targetRedPH} و رُزه روی ${params.targetRosePH} با رعایت سقف TA`
    },
    {
      row: '۹',
      name: 'مخمر Lalvin RC-212 (و Rhône 4600 / ICV D47 برای رُزه)',
      totalAmount: `${yeastTotalG.toFixed(2)} g (+ 15 g EC-1118 رزرو)`,
      doseRate: `${params.yeastRateGL.toFixed(2)} g/L`,
      tankA: `${yeastRedPerTankG.toFixed(2)} g (در ${redLiquidFermentPerTankL}L)`,
      tankB: `${yeastRedPerTankG.toFixed(2)} g (در ${redLiquidFermentPerTankL}L)`,
      roseShare: `${yeastRoseG.toFixed(2)} g (در ${roseClarifiedFermentL}L)`,
      purpose: 'تخمیر الکلی با استخراج بالای پلی‌فنول در قرمز و حفظ استرهای گل‌فام در رُزه'
    },
    {
      row: '۱۰',
      name: 'مغذی Go-Ferm',
      totalAmount: `${goFermTotalG.toFixed(2)} g`,
      doseRate: `${round2(params.yeastRateGL * params.goFermMultiplier).toFixed(2)} g/L (${params.goFermMultiplier} × مخمر)`,
      tankA: `${goFermRedPerTankG.toFixed(2)} g`,
      tankB: `${goFermRedPerTankG.toFixed(2)} g`,
      roseShare: `${goFermRoseG.toFixed(2)} g`,
      purpose: 'غنی‌سازی غشای سلولی مخمر با استرول‌ها در آب ۴۳ درجه'
    },
    {
      row: '۱۱',
      name: 'مغذی Fermaid O (۱۰۰٪ نیتروژن ارگانیک)',
      totalAmount: `${fermaidOTotalG.toFixed(2)} g`,
      doseRate: `مرحله ۱: ${params.fermaidO1RedRateGL} g/L\nمرحله ۳: ${params.fermaidO3RedRateGL} g/L (۱۰۰٪ ارگانیک)`,
      tankA: `در SG ${triggers.sna1.toFixed(3)}: ${fermaidO1RedPerTankG.toFixed(2)} g\nدر SG ${triggers.sna3.toFixed(3)}: ${fermaidO3RedPerTankG.toFixed(2)} g`,
      tankB: `در SG ${triggers.sna1.toFixed(3)}: ${fermaidO1RedPerTankG.toFixed(2)} g\nدر SG ${triggers.sna3.toFixed(3)}: ${fermaidO3RedPerTankG.toFixed(2)} g`,
      roseShare: `در SG ${triggers.sna1.toFixed(3)}: ${fermaidO1RoseG.toFixed(2)} g\nدر SG ${triggers.sna3.toFixed(3)}: ${fermaidO3RoseG.toFixed(2)} g`,
      purpose: 'تامین اسیدهای آمینهٔ ۱۰۰٪ ارگانیک پایدار در مرحله ۱ و مرحله ۳ (۱/۲ افت قند)'
    },
    {
      row: '۱۲',
      name: 'مغذی Fermaid K',
      totalAmount: `${fermaidKTotalG.toFixed(2)} g`,
      doseRate: `فقط مرحله ۲ (۱/۳ قند): ${params.fermaidK2RedRateGL} g/L`,
      tankA: `فقط در SG ${triggers.sna2.toFixed(3)}: ${fermaidK2RedPerTankG.toFixed(2)} g`,
      tankB: `فقط در SG ${triggers.sna2.toFixed(3)}: ${fermaidK2RedPerTankG.toFixed(2)} g`,
      roseShare: `فقط در SG ${triggers.sna2.toFixed(3)}: ${fermaidK2RoseG.toFixed(2)} g`,
      purpose: 'تامین تیامین، منیزیم و نیتروژن ترکیبی در اوج تکثیر (ممنوع در ۱/۲ قند)'
    },
    {
      row: '۱۳',
      name: 'دی‌آمونیم فسفات (DAP)',
      totalAmount: `${dapTotalG.toFixed(2)} g`,
      doseRate: `قرمز: ${params.dap2RedRateGL} g/L\nرُزه: ${params.dap2RoseRateGL} g/L`,
      tankA: `فقط در SG ${triggers.sna2.toFixed(3)}: ${dap2RedPerTankG.toFixed(2)} g`,
      tankB: `فقط در SG ${triggers.sna2.toFixed(3)}: ${dap2RedPerTankG.toFixed(2)} g`,
      roseShare: `فقط در SG ${triggers.sna2.toFixed(3)}: ${dap2RoseG.toFixed(2)} g`,
      purpose: 'تامین نیتروژن معدنی سریع در اوج تکثیر سلولی (۱/۳ قند) جهت مهار H2S'
    },
    {
      row: '۱۴',
      name: 'مکمل روی (ZnSO4·7H2O / Wyeast)',
      totalAmount: `${zincTotalG.toFixed(2)} g`,
      doseRate: `${params.zincSafeRateGL.toFixed(3)} g/L (${params.zincSafeRateGL <= 0.003 ? 'سقف ایمن سولفات روی خالص' : 'مخلوط مغذی تجاری'})`,
      tankA: `در SG ${triggers.sna2.toFixed(3)}: ${zincRedPerTankG.toFixed(2)} g`,
      tankB: `در SG ${triggers.sna2.toFixed(3)}: ${zincRedPerTankG.toFixed(2)} g`,
      roseShare: `در SG ${triggers.sna1.toFixed(3)}: ${zincRoseG.toFixed(2)} g`,
      purpose: 'تقویت کوفاکتور روی (Zn²⁺) برای آنزیم الکل دهیدروژناز'
    },
    {
      row: '۱۵',
      name: 'بنتونیت انولوژیک',
      totalAmount: `${bentoniteRoseG.toFixed(2)} g`,
      doseRate: '0.20 g/L (در رُزه)',
      tankA: 'صفر',
      tankB: 'صفر',
      roseShare: `${bentoniteRoseG.toFixed(2)} g (ساعت ۰۵:۳۰ در ${saigneeTotalL}L)`,
      purpose: 'کمک‌لخته‌ساز برای رسوب دادن ذرات کدر و گوگرد معلق در رُزه'
    },
    {
      row: '۱۶',
      name: 'سولفات مس ۵ آبه (CuSO4·5H2O)',
      totalAmount: '1.00 g',
      doseRate: 'محلول استوک ۰.۱٪ (1 mg/mL)',
      tankA: `در صورت نیاز: ${round1(0.25 * rack1PerTankL)}–${round1(0.50 * rack1PerTankL)} mL استوک ۲`,
      tankB: `در صورت نیاز: ${round1(0.25 * rack1PerTankL)}–${round1(0.50 * rack1PerTankL)} mL استوک ۲`,
      roseShare: `در صورت نیاز: ${round1(0.25 * rosePostRackingL)} mL استوک ۲`,
      purpose: 'ساخت ۱ لیتر محلول استوک ۲ جهت تست ۴/۵ لیوانی و حذف H2S (دوز 0.25 mg/L سولفات مس ۵ آبه معادل 0.064 mg/L مس عنصری Cu²⁺)'
    },
    {
      row: '۱۷',
      name: 'Bactiless (کیتوزان لالمند)',
      totalAmount: `${bactilessTotalG.toFixed(2)} g`,
      doseRate: `قرمز: ${params.bactilessRedRateGL} g/L\nرُزه: ${params.bactilessRoseRateGL} g/L`,
      tankA: `${bactilessRedPerTankG.toFixed(2)} g (روز ۱۱ در ${rack1PerTankL}L)`,
      tankB: `${bactilessRedPerTankG.toFixed(2)} g (روز ۱۱ در ${rack1PerTankL}L)`,
      roseShare: `${bactilessRoseG.toFixed(2)} g (در ${rosePostRackingL}L رُزه)\n(+ ${bactilessHeavyPressG.toFixed(2)} g برای ${heavyPressTotalL}L پرس)`,
      purpose: 'لیز کردن غشای باکتریهای مالولاکتیک/استیک (دوز شوک درمانی/قفل کامل: 0.20–0.30 g/L؛ دوز نگهدارنده برچسب: 0.04–0.10 g/L)'
    },
    {
      row: '۱۸',
      name: 'بی‌تارتارات پتاسیم (کرم تارتار)',
      totalAmount: `${khtTotalG.toFixed(2)} g`,
      doseRate: '0.20 g/L (4.0 g در هر گالن ۲۰ لیتری)',
      tankA: `${khtColdStabRedPerTankG.toFixed(2)} g (روز ۶۵ در ${finalRedPerTankL}L)`,
      tankB: `${khtColdStabRedPerTankG.toFixed(2)} g (روز ۶۵ در ${finalRedPerTankL}L)`,
      roseShare: `${khtColdStabRoseG.toFixed(2)} g (در ${rosePostRackingL}L رُزه)\n(+ ${khtColdStabHeavyPressG.toFixed(2)} g در پرس)`,
      purpose: 'بذرپاشی کریستالی استاتیک ۱۴ روزه در +1 °C با دوز 0.20 g/L (در روش صنعتی همزدن پیوسته ۲۴ ساعته: ۱ تا ۴ g/L)'
    },
    {
      row: '۱۹',
      name: 'گلیسیرین خوراکی خالص (مشروط به تست)',
      totalAmount: `حداکثر ${glycerinTotalMaxG.toFixed(1)} g (${Math.round(glycerinTotalMaxG / 1.26)} mL)`,
      doseRate: `قرمز: تا ${params.redMaxGlycerinGL} g/L\nرُزه: تا ${params.roseMaxGlycerinGL} g/L`,
      tankA: `تا ${glycerinRedMaxPerTankG.toFixed(1)} g (${Math.round(glycerinRedMaxPerTankG / 1.26)} mL در ${finalRedPerTankL}L)`,
      tankB: `تا ${glycerinRedMaxPerTankG.toFixed(1)} g (${Math.round(glycerinRedMaxPerTankG / 1.26)} mL در ${finalRedPerTankL}L)`,
      roseShare: `تا ${glycerinRoseMaxG.toFixed(1)} g (${round1(glycerinRoseMaxG / 1.26)} mL در ${roseFinalBottlingL}L)`,
      purpose: 'گرد کردن حس دهانی پس از تایید در تست حسی ۳ لیوانی روز ۸۵'
    },
    {
      row: '۲۰',
      name: 'ال-اسید اسکوربیک (ویتامین C)',
      totalAmount: `${ascorbicTotalG.toFixed(2)} g`,
      doseRate: `${params.ascorbicRateGL.toFixed(3)} g/L (${Math.round(params.ascorbicRateGL * 1000)} mg/L)`,
      tankA: `${ascorbicRedPerTankG.toFixed(2)} g (۳۰ دقیقه قبل از بطری در ${finalRedPerTankL}L)`,
      tankB: `${ascorbicRedPerTankG.toFixed(2)} g (۳۰ دقیقه قبل از بطری در ${finalRedPerTankL}L)`,
      roseShare: `${ascorbicRoseG.toFixed(2)} g (در ${roseFinalBottlingL}L) + 1.00 g استوک ۲B`,
      purpose: 'حذف اکسیژن محلول گلوگاه بطری در لحظهٔ بطری‌گذاری (مشروط به Free SO2 ≥ 30 mg/L)'
    }
  ];

  return {
    params,
    scaleFactor,
    volumes: {
      totalCrushedMashL,
      crushedMashPerTankL,
      initialLiquidL,
      initialLiquidPerTankL,
      saigneeTotalL,
      saigneePerTankL,
      roseClarifiedFermentL,
      rosePostRackingL,
      roseFinalBottlingL,
      roseBottles750ml,
      redMashAfterSaigneePerTankL,
      redLiquidFermentPerTankL,
      redLiquidFermentTotalL,
      freeRunPerTankL,
      freeRunTotalL,
      rack1PerTankL,
      rack1TotalL,
      rack2PerTankL,
      rack2TotalL,
      finalRedPerTankL,
      finalRedTotalL,
      redBottles750ml,
      heavyPressTotalL,
      heavyPressPerTankL,
      totalBottles750ml
    },
    triggers,
    dosages: {
      crushKmsPerTankG,
      postSaigneeKmsPerTankG,
      day11KmsPerTankG,
      preBottlingKmsPerTankG,
      rosePostFermKmsG,
      rosePreBottlingKmsG,
      heavyPressKmsG,
      totalWineKmsG,
      pecticEnzymeRedPerTankG,
      pecticEnzymeRoseG,
      pecticEnzymeTotalG,
      whiteTanninRedPhase1PerTankG,
      whiteTanninRoseFermentG,
      whiteTanninRoseFinishingG,
      whiteTanninTotalG,
      redTanninPhase1PerTankG,
      redTanninPhase2PerTankG,
      redTanninFinishingPerTankG,
      redTanninTotalG,
      yeastRedPerTankG,
      yeastRoseG,
      yeastTotalG,
      goFermRedPerTankG,
      goFermRoseG,
      goFermTotalG,
      fermaidO1RedPerTankG,
      fermaidO1RoseG,
      fermaidO3RedPerTankG,
      fermaidO3RoseG,
      fermaidOTotalG,
      fermaidK2RedPerTankG,
      fermaidK2RoseG,
      fermaidKTotalG,
      dap2RedPerTankG,
      dap2RoseG,
      dapTotalG,
      zincRedPerTankG,
      zincRoseG,
      zincTotalG,
      bentoniteRoseG,
      bactilessRedPerTankG,
      bactilessRoseG,
      bactilessHeavyPressG,
      bactilessTotalG,
      khtColdStabRedPerTankG,
      khtColdStabRoseG,
      khtColdStabHeavyPressG,
      khtTotalG,
      glycerinRedMaxPerTankG,
      glycerinRoseMaxG,
      glycerinTotalMaxG,
      ascorbicRedPerTankG,
      ascorbicRoseG,
      ascorbicTotalG
    },
    nitrogen: {
      sugarGPerL,
      targetYANMgL,
      neededYANMgL,
      suppliedChemicalYANRedMgL,
      suppliedBioEquivalentYANRedMgL,
      baseBioEquivalentYANMgL,
      unmetBioEquivalentYANMgL,
      yanAccountingBasisFa
    },
    dynamicMaterials,
    dynamicVolumeBalances
  };
}

const FLEXIBLE_PROTOCOL_STORAGE_KEY = 'enology_flexible_protocol_params_v1';
const FLEXIBLE_PROTOCOL_SYNC_EVENT = 'enology-flexible-protocol-sync';

function loadStoredFlexibleParams(): FlexibleProtocolParams {
  if (typeof window === 'undefined') {
    return IDEAL_DEFAULT_PROTOCOL_PARAMS;
  }
  try {
    const raw = window.localStorage.getItem(FLEXIBLE_PROTOCOL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...IDEAL_DEFAULT_PROTOCOL_PARAMS,
        ...parsed
      };
    }
  } catch (err) {
    console.warn('Error reading flexible protocol params from localStorage:', err);
  }
  return IDEAL_DEFAULT_PROTOCOL_PARAMS;
}

export function getCurrentDynamicProtocolPlan(): DynamicProtocolPlan {
  return computeDynamicProtocolPlan(loadStoredFlexibleParams());
}

function sanitizeProtocolParamsSnapshot(
  snapshot?: Record<string, number | string> | null
): Partial<FlexibleProtocolParams> | null {
  if (!snapshot || typeof snapshot !== 'object') return null;
  const sanitized: Record<string, number | string> = {};
  for (const [k, val] of Object.entries(snapshot)) {
    if (k === 'presetId') {
      if (val === 'conservative_ideal' || val === 'classic_v32' || val === 'custom') {
        sanitized[k] = val;
      }
    } else if (typeof val === 'number' && Number.isFinite(val)) {
      sanitized[k] = val;
    }
  }
  return Object.keys(sanitized).length > 0 ? (sanitized as Partial<FlexibleProtocolParams>) : null;
}

export function getEffectiveProtocolPlanForBatch(
  batch?: { protocolParamsSnapshot?: Record<string, number | string> } | null,
  explicitPlan?: DynamicProtocolPlan,
  preferExplicit: boolean = false
): DynamicProtocolPlan {
  const sanitizedSnapshot = sanitizeProtocolParamsSnapshot(batch?.protocolParamsSnapshot);
  if (!preferExplicit && sanitizedSnapshot) {
    return computeDynamicProtocolPlan(sanitizedSnapshot);
  }
  if (explicitPlan) {
    return explicitPlan;
  }
  if (sanitizedSnapshot) {
    return computeDynamicProtocolPlan(sanitizedSnapshot);
  }
  return getCurrentDynamicProtocolPlan();
}

export type FlexibleProtocolSyncListener = (params: FlexibleProtocolParams) => void;
const flexibleProtocolSyncListeners = new Set<FlexibleProtocolSyncListener>();

export function onFlexibleProtocolSync(listener: FlexibleProtocolSyncListener): () => void {
  flexibleProtocolSyncListeners.add(listener);
  return () => {
    flexibleProtocolSyncListeners.delete(listener);
  };
}

export function notifyFlexibleProtocolSync(next: FlexibleProtocolParams): void {
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(FLEXIBLE_PROTOCOL_STORAGE_KEY, JSON.stringify(next));
    } catch (err) {
      console.warn('Error saving flexible protocol params:', err);
    }
  }
  for (const listener of flexibleProtocolSyncListeners) {
    try {
      listener(next);
    } catch (err) {
      console.warn('Error in flexible protocol sync listener:', err);
    }
  }
  if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
    try {
      window.dispatchEvent(new CustomEvent(FLEXIBLE_PROTOCOL_SYNC_EVENT, { detail: next }));
    } catch (err) {
      console.warn('Error dispatching flexible protocol sync event:', err);
    }
  }
}

/**
 * React hook for reading and customizing the Flexible Parameterized Enology Protocol
 * with Ideal Recommended Defaults, Classic v3.2 preset support, and 1-click reset.
 */
export function useFlexibleProtocol() {
  const [params, setParamsState] = useState<FlexibleProtocolParams>(loadStoredFlexibleParams);

  const persistAndBroadcast = useCallback(
    (
      nextOrUpdater:
        | FlexibleProtocolParams
        | ((prev: FlexibleProtocolParams) => FlexibleProtocolParams)
    ) => {
      setParamsState((prev) => {
        const next =
          typeof nextOrUpdater === 'function' ? nextOrUpdater(prev) : nextOrUpdater;
        notifyFlexibleProtocolSync(next);
        return next;
      });
    },
    []
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleSync = (e: Event) => {
      const customEvent = e as CustomEvent<FlexibleProtocolParams>;
      if (customEvent.detail) {
        setParamsState(customEvent.detail);
      }
    };
    window.addEventListener(FLEXIBLE_PROTOCOL_SYNC_EVENT, handleSync);
    return () => window.removeEventListener(FLEXIBLE_PROTOCOL_SYNC_EVENT, handleSync);
  }, []);

  const updateParam = useCallback(
    <K extends Exclude<keyof FlexibleProtocolParams, 'presetId'>>(
      key: K,
      value: FlexibleProtocolParams[K]
    ) => {
      persistAndBroadcast((prev) => ({
        ...prev,
        [key]: value,
        presetId: 'custom'
      }));
    },
    [persistAndBroadcast]
  );

  const updateParams = useCallback(
    (partial: Partial<Omit<FlexibleProtocolParams, 'presetId'>>) => {
      persistAndBroadcast((prev) => ({
        ...prev,
        ...partial,
        presetId: 'custom'
      }));
    },
    [persistAndBroadcast]
  );

  const applyPreset = useCallback(
    (presetId: 'conservative_ideal' | 'classic_v32') => {
      const target =
        presetId === 'classic_v32' ? CLASSIC_V32_PROTOCOL_PARAMS : IDEAL_DEFAULT_PROTOCOL_PARAMS;
      persistAndBroadcast({ ...target });
    },
    [persistAndBroadcast]
  );

  const resetParamToIdeal = useCallback(
    <K extends Exclude<keyof FlexibleProtocolParams, 'presetId'>>(key: K) => {
      persistAndBroadcast((prev) => {
        const next: FlexibleProtocolParams = {
          ...prev,
          [key]: IDEAL_DEFAULT_PROTOCOL_PARAMS[key]
        };
        const allMatchIdeal = FLEXIBLE_PARAM_METADATA.every(
          (m) => next[m.key] === IDEAL_DEFAULT_PROTOCOL_PARAMS[m.key]
        );
        next.presetId = allMatchIdeal ? 'conservative_ideal' : 'custom';
        return next;
      });
    },
    [persistAndBroadcast]
  );

  const resetAllToIdeal = useCallback(() => {
    persistAndBroadcast({ ...IDEAL_DEFAULT_PROTOCOL_PARAMS });
  }, [persistAndBroadcast]);

  const isModifiedFromIdeal = useMemo(
    () =>
      FLEXIBLE_PARAM_METADATA.some(
        (m) => params[m.key] !== IDEAL_DEFAULT_PROTOCOL_PARAMS[m.key]
      ),
    [params]
  );

  const plan = useMemo(() => computeDynamicProtocolPlan(params), [params]);

  return {
    params,
    plan,
    updateParam,
    updateParams,
    applyPreset,
    resetParamToIdeal,
    resetAllToIdeal,
    isModifiedFromIdeal
  };
}
