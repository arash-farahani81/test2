import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getEffectiveLiquidVolume,
  isAlreadyLiquidVolume,
  calculateKMS,
  normalizeEnologyNumericInput,
  correctHydrometer,
  calculateScaleVolumes,
  calculateTitratableAcidity,
  calculateTartaricAddition,
  estimateAcidOrBaseFromPHShift,
  calculateKHCO3Deacidification,
  calculateDeacidificationOptions,
  calculateFreeSO2Ripper,
  calculateMolecularSO2,
  calculateRefractometerCorrection,
  calculateSNAAmounts,
  calculateBenchFiningGrams,
  calculateCoolingDryIceKg,
  getTargetFreeSO2ByPH,
  getContinuousTargetFreeSO2ByPH,
  calculateStockSolutionPlan,
  calculateDynamicSGTriggers,
  calculateH2O2SulfiteRemoval,
  calculateStagedH2O2Plan,
  buildCalculatorDirectAdditions,
  computeGraduatedSyringeMetrics
} from './enologyUtils.ts';
import {
  IDEAL_DEFAULT_PROTOCOL_PARAMS,
  CLASSIC_V32_PROTOCOL_PARAMS,
  computeDynamicProtocolPlan,
  getEffectiveProtocolPlanForBatch
} from '../data/masterProtocolConfig.ts';

test('getEffectiveLiquidVolume uses 0.84 true liquid-to-mash ratio (132L / 157L), VolumeBasis, custom mashYieldFactor, and isAlreadyLiquidVolume', () => {
  assert.equal(getEffectiveLiquidVolume(100, false), 100);
  assert.equal(getEffectiveLiquidVolume(100, 'liquid_phase'), 100);
  assert.equal(getEffectiveLiquidVolume(100, true), 84);
  assert.equal(getEffectiveLiquidVolume(100, 'gross_mash'), 84);
  assert.equal(getEffectiveLiquidVolume(100, 'gross_mash', 0.80), 80);
  assert.equal(getEffectiveLiquidVolume(157, true), 131.88);
  assert.equal(isAlreadyLiquidVolume(132), true);
  assert.equal(isAlreadyLiquidVolume(264), true);
  assert.equal(isAlreadyLiquidVolume(32), true);
  assert.equal(isAlreadyLiquidVolume(157), false);
});

test('calculateKMS returns accurate potassium metabisulfite in grams and supports unpressed red must & mashYieldFactor', () => {
  const kms = calculateKMS(100, 18, 35);
  assert.equal(kms, 2.95);
  assert.equal(calculateKMS(100, 35, 35), 0);
  assert.equal(calculateKMS(100, 40, 35), 0);
  // With unpressed red must (84L effective liquid): (17 * 84) / 576 = 2.479 -> 2.48
  assert.equal(calculateKMS(100, 18, 35, true), 2.48);
  assert.equal(calculateKMS(100, 18, 35, 'gross_mash', 0.80), 2.36);
});

test('correctHydrometer uses piecewise linear interpolation across 20C calibration table (including negative delta at 19C)', () => {
  const at20 = correctHydrometer(1.0060, 20);
  assert.equal(at20.trueSG, 1.0060);
  assert.equal(at20.delta, 0);

  // At 19C (between 18C -> -0.0004 and 20C -> 0.0000), delta must be -0.0002 (negative!)
  const at19 = correctHydrometer(1.0060, 19);
  assert.equal(at19.delta, -0.0002);
  assert.equal(at19.trueSG, 1.0058);

  const at28 = correctHydrometer(1.0060, 28);
  assert.equal(at28.trueSG, 1.0080);
  assert.equal(at28.delta, 0.0020);

  const at10 = correctHydrometer(1.0060, 10);
  assert.equal(at10.trueSG, 1.0044);
});

test('calculateScaleVolumes calculates accurate mass and volume balance', () => {
  const base400 = calculateScaleVolumes(400);
  assert.equal(base400.mashVolume, 350);
  assert.equal(base400.liquidVolume, 300);
  assert.equal(base400.saigneeVolume, 36);
  assert.equal(base400.roseFinalVolume, 29);
  assert.equal(base400.redFinalVolume, 200);
});

test('calculateTitratableAcidity calculates TA accurately', () => {
  const ta = calculateTitratableAcidity(4.2, 0.1, 5);
  assert.equal(ta, 6.3);

  const ta15 = calculateTitratableAcidity(12, 0.1, 15);
  assert.equal(ta15, 6.0);
});

test('calculateTartaricAddition and estimateAcidOrBaseFromPHShift decouple TA stoichiometry from pH buffering', () => {
  const add = calculateTartaricAddition(5.2, 6.5, 175);
  assert.equal(add, 227.5);
  // 175 * 0.84 = 147L * 1.3 g/L = 191.1g
  assert.equal(calculateTartaricAddition(5.2, 6.5, 175, true), 191.1);
  assert.equal(calculateTartaricAddition(6.8, 6.5, 175), 0);

  const acidShift = estimateAcidOrBaseFromPHShift(3.70, 3.50, 100);
  assert.equal(acidShift.mode, 'acidification');
  assert.equal(acidShift.lowBufferGrams, 150);
  assert.equal(acidShift.typicalBufferGrams, 200);
  assert.equal(acidShift.highBufferGrams, 270);
  assert.equal(acidShift.isEmpiricalEstimateOnly, true);

  const baseShift = estimateAcidOrBaseFromPHShift(3.20, 3.40, 100);
  assert.equal(baseShift.mode, 'deacidification');
  assert.equal(baseShift.lowBufferGrams, 180);
  assert.equal(baseShift.typicalBufferGrams, 240);
  assert.equal(baseShift.highBufferGrams, 300);
  assert.equal(baseShift.isEmpiricalEstimateOnly, true);
});

test('calculateKHCO3Deacidification delegates pH fallback to typicalBufferGrams and uses exact 1.33 g/L stoichiometric constant when deltaTA_gL is provided', () => {
  // Without deltaTA_gL: delegates to estimateAcidOrBaseFromPHShift(3.20, 3.40, 100).typicalBufferGrams -> 240g
  assert.equal(calculateKHCO3Deacidification(3.20, 3.40, 100, false), 240);
  // With 0.84 yield factor (84L): 2 * 1.20 * 84 = 201.6g
  assert.equal(calculateKHCO3Deacidification(3.20, 3.40, 100, true), 201.6);
  // With explicit deltaTA_gL = 1.5 g/L on 100L -> 1.5 * 1.33 * 100 = 199.5g
  assert.equal(calculateKHCO3Deacidification(3.20, 3.40, 100, false, 1.5), 199.5);
  assert.equal(calculateKHCO3Deacidification(3.50, 3.40, 100, false), 0);

  const opts = calculateDeacidificationOptions(1.0, 100);
  assert.equal(opts.khco3StoichiometricGrams, 133);
  assert.equal(opts.khco3WithColdStabGrams, 100);
  assert.equal(opts.caco3Grams, 67);
});

test('calculateFreeSO2Ripper and Molecular SO2 calculate accurately', () => {
  const freeSO2 = calculateFreeSO2Ripper(1.4, 0.02, 25);
  assert.equal(freeSO2, 35.8);

  const molSO2 = calculateMolecularSO2(35.8, 3.55);
  assert.ok(molSO2 > 0.6 && molSO2 < 0.7);
});

test('calculateRefractometerCorrection uses anchored Sean Terrill cubic polynomial (trueSG = 1.092 at OB=22, CB=22) and flags empirical wort approximation', () => {
  const unfermented = calculateRefractometerCorrection(22, 22);
  assert.equal(unfermented.trueSG, 1.092);
  assert.equal(unfermented.trueBrix, 22);
  assert.equal(unfermented.abv, 0);
  assert.equal(unfermented.isWortEmpiricalApproximation, true);

  const midFerment = calculateRefractometerCorrection(22, 11);
  assert.ok(midFerment.trueSG > 1.000 && midFerment.trueSG < 1.025);
  assert.ok(midFerment.trueBrix < 11);
  assert.ok(midFerment.abv > 9);
});

test('calculateSNAAmounts uses unified 1.05 medium multiplier (252 mg N/L), 152 mg N/L baseline, 0.30 g/L Fermaid O3 rate, and safe micro-Zinc', () => {
  const sna = calculateSNAAmounts(132, 22, 'medium');
  // 22 Brix -> SG 1.092 -> Sugar = 22 * 10 * 1.092 = 240.2 g/L
  assert.equal(sna.initialSG, 1.092);
  assert.equal(sna.sugarGPerL, 240.2);
  assert.equal(sna.sugarGL, 240);
  assert.equal(sna.targetYAN, 252); // 240 * 1.05 = 252 mg N/L
  assert.equal(sna.neededYAN, 152); // 252 - 100 = 152 mg N/L
  // Step 3 (38% sugar drop) must strictly be 0g Fermaid K (no inorganic ammonium)
  assert.equal(sna.fermaidK_3, 0);
  assert.equal(sna.fermaidO_1, 33);
  assert.equal(sna.fermaidK_2, 33);
  assert.equal(sna.dap_2, 19.8);
  assert.equal(sna.fermaidO_3, 39.6);
  // Safe micro-zinc (0.002 g/L * 132L = 0.26g)
  assert.equal(sna.zinc_2, 0.26);
  assert.equal(sna.suppliedChemicalYAN_mgL, 78.8);
  assert.equal(sna.suppliedBioEquivalentYAN_mgL, 122.8);
  assert.equal(sna.additionalFermaidOForPureChemicalParityG, 241.56);

  // Dynamic YAN scaling: high strain (1.10) requires higher dosages than low strain (0.75)
  const snaHigh = calculateSNAAmounts(132, 24, 'high');
  const snaLow = calculateSNAAmounts(132, 20, 'low');
  assert.ok(snaHigh.fermaidO_1 > snaLow.fermaidO_1);
  assert.ok(snaHigh.fermaidK_2 > snaLow.fermaidK_2);
  assert.ok(snaHigh.fermaidO_3 > snaLow.fermaidO_3);

  // Effective liquid volume for unpressed red must (0.84 yield factor on 157L = 131.88L)
  const snaUnpressed = calculateSNAAmounts(157, 22, 'medium', 100, undefined, true);
  assert.equal(snaUnpressed.effectiveVolumeL, 131.88);

  // Custom flexible rates override (e.g., Classic v3.2 zinc rate 0.012 g/L and custom Fermaid O1 0.30 g/L)
  const snaCustom = calculateSNAAmounts(100, 22, 'medium', 100, undefined, false, 0.84, {
    fermaidO1RateGL: 0.30,
    fermaidK2RateGL: 0.20,
    dap2RateGL: 0.12,
    fermaidO3RateGL: 0.25,
    zincRateGL: 0.012
  });
  assert.equal(snaCustom.fermaidO_1, 30);
  assert.equal(snaCustom.fermaidK_2, 20);
  assert.equal(snaCustom.dap_2, 12);
  assert.equal(snaCustom.zinc_2, 1.2);
});

test('calculateCoolingDryIceKg accounts for must SG, 3.9 kJ/kg*°C specific heat, and 65% heat transfer efficiency', () => {
  const dryIce = calculateCoolingDryIceKg(175, 29.5, 26, 1.092, 0.65);
  assert.equal(dryIce, 7.03);
  assert.equal(calculateCoolingDryIceKg(175, 25, 26), 0);
  assert.equal(calculateBenchFiningGrams(0.2, 100), 20);
});

test('getTargetFreeSO2ByPH returns accurate pH-dependent Free SO2 targets (Protocol v2)', () => {
  assert.deepEqual(getTargetFreeSO2ByPH(3.28, true), { min: 20, max: 26, target: 24 });
  assert.deepEqual(getTargetFreeSO2ByPH(3.38), { min: 24, max: 32, target: 28 });
  assert.deepEqual(getTargetFreeSO2ByPH(3.48), { min: 30, max: 40, target: 35 });
  assert.deepEqual(getTargetFreeSO2ByPH(3.52), { min: 37, max: 49, target: 42 });
  assert.deepEqual(getTargetFreeSO2ByPH(3.60), { min: 37, max: 49, target: 42 });
  assert.deepEqual(getTargetFreeSO2ByPH(3.65), { min: 41, max: 55, target: 47 });
});

test('calculateDynamicSGTriggers scales SNA and tannin triggers dynamically by initial SG0 without hardcoded overrides', () => {
  const ref = calculateDynamicSGTriggers(1.092);
  assert.equal(ref.sna1, 1.083);
  assert.equal(ref.sna2, 1.070);
  assert.equal(ref.oneThirdCeiling, 1.062);
  assert.equal(ref.phase2Tannin, 1.060);
  assert.equal(ref.sna3, 1.057);

  const low = calculateDynamicSGTriggers(1.084);
  assert.equal(low.sna1, 1.076);
  assert.equal(low.sna2, 1.064);
  assert.equal(low.oneThirdCeiling, 1.056);

  const high = calculateDynamicSGTriggers(1.100);
  assert.equal(high.sna1, 1.090);
  assert.equal(high.sna2, 1.076);
  assert.equal(high.oneThirdCeiling, 1.067);

  const withOverrides = calculateDynamicSGTriggers(1.092, {
    pressingPoint: 1.010,
    drynessPoint: 0.991
  });
  assert.equal(withOverrides.pressingPoint, 1.010);
  assert.equal(withOverrides.drynessPoint, 0.991);
});

test('calculateH2O2SulfiteRemoval and calculateStagedH2O2Plan enforce 10 mg/L floor, 25 mg/L step cap, 50% trial dose, and <1% dilution volume', () => {
  // 50 mg/L excess SO2 in 100L: 50 * 0.0177 * 100 = 88.5 mL
  assert.equal(calculateH2O2SulfiteRemoval(100, 85, 35), 88.5);
  assert.equal(calculateH2O2SulfiteRemoval(100, 30, 35), 0);
  // Clamping targetSO2 < 10 to 10 mg/L: (35 - 10) * 0.0177 * 100 = 44.25 mL
  assert.equal(calculateH2O2SulfiteRemoval(100, 35, 0), 44.25);

  const staged = calculateStagedH2O2Plan(100, 85, 5);
  assert.equal(staged.effectiveTargetSO2, 10);
  assert.equal(staged.totalExcessSO2MgL, 75);
  assert.ok(staged.currentStepReductionMgL <= 25);
  assert.equal(staged.currentStepReductionMgL, 25);
  assert.equal(staged.maxCurrentStep3PercentMl, 44.25);
  assert.equal(staged.recommendedSafeTrialStep1Ml, 22.13);
  assert.equal(staged.dilutedUnder1PercentTotalVolumeMl, 154.9);
  assert.ok(staged.dilutedUnder1PercentTotalVolumeMl > staged.maxCurrentStep3PercentMl * 3);
  assert.equal(staged.stagesRequired, 3);
  assert.equal(staged.requiresReMeasurementBeforeNextStage, true);
});

test('computeDynamicProtocolPlan computes exact volumes, dosages, and SO2 ledger for Conservative Ideal vs Classic v3.2 and custom scaling', () => {
  const idealPlan = computeDynamicProtocolPlan(IDEAL_DEFAULT_PROTOCOL_PARAMS);
  assert.equal(idealPlan.scaleFactor, 1);
  assert.equal(idealPlan.volumes.totalCrushedMashL, 350);
  assert.equal(idealPlan.volumes.initialLiquidL, 300);
  assert.equal(idealPlan.volumes.saigneeTotalL, 36);
  assert.equal(idealPlan.volumes.roseClarifiedFermentL, 32);
  assert.equal(idealPlan.volumes.redLiquidFermentPerTankL, 132);
  assert.equal(idealPlan.volumes.redMashAfterSaigneePerTankL, 157);
  assert.equal(idealPlan.volumes.finalRedTotalL, 186);
  assert.equal(idealPlan.volumes.roseFinalBottlingL, 29);
  assert.equal(idealPlan.volumes.totalBottles750ml, 286);
  // Conservative ideal KMS (6.52g at crush per tank -> 25 ppm, 3.43g post-saignee -> 40 ppm, 6.72g day11 at 96L)
  assert.equal(idealPlan.dosages.crushKmsPerTankG, 6.52);
  assert.equal(idealPlan.dosages.postSaigneeKmsPerTankG, 3.43);
  assert.equal(idealPlan.dosages.day11KmsPerTankG, 6.72);
  assert.equal(idealPlan.dosages.totalWineKmsG, 44.31);
  // Safe micro-dose zinc (0.002 g/L * 132L = 0.26g)
  assert.equal(idealPlan.dosages.zincRedPerTankG, 0.26);

  // Classic v3.2 preset check (105L rack1 -> 8.19g day11 KMS, 1.58g zinc)
  const classicPlan = computeDynamicProtocolPlan(CLASSIC_V32_PROTOCOL_PARAMS);
  assert.equal(classicPlan.volumes.freeRunPerTankL, 110);
  assert.equal(classicPlan.volumes.rack1PerTankL, 105);
  assert.equal(classicPlan.dosages.day11KmsPerTankG, 8.19);
  assert.equal(classicPlan.dosages.zincRedPerTankG, 1.58);
  assert.equal(classicPlan.dosages.totalWineKmsG, 47.36);

  // Custom 800kg scaling check (2x scale factor)
  const scaled800 = computeDynamicProtocolPlan({
    ...IDEAL_DEFAULT_PROTOCOL_PARAMS,
    presetId: 'custom',
    grapeWeightKg: 800
  });
  assert.equal(scaled800.scaleFactor, 2);
  assert.equal(scaled800.volumes.totalCrushedMashL, 700);
  assert.equal(scaled800.volumes.redLiquidFermentPerTankL, 264);
  assert.equal(scaled800.dosages.yeastTotalG, 148);
});

test('normalizeEnologyNumericInput, 15.5C/32C correctHydrometer, getContinuousTargetFreeSO2ByPH, and calculateStockSolutionPlan', () => {
  assert.equal(normalizeEnologyNumericInput('۱٫۰۸۳', 'sg'), 1.083);
  assert.equal(normalizeEnologyNumericInput('۱۰۸۳', 'sg'), 1.083);
  assert.equal(normalizeEnologyNumericInput(993, 'sg'), 0.993);
  assert.equal(normalizeEnologyNumericInput('1,234.5', 'general'), 1234.5);
  assert.equal(normalizeEnologyNumericInput('1/2', 'general'), null);
  assert.equal(normalizeEnologyNumericInput('12abc', 'general'), null);
  assert.equal(normalizeEnologyNumericInput('abc', 'general'), null);

  const cal15 = correctHydrometer(1.080, 20, 15.5);
  assert.equal(cal15.delta, 0.0008);
  assert.equal(cal15.trueSG, 1.0808);

  const hotSample = correctHydrometer(1.080, 35, 20);
  assert.equal(hotSample.isAbove32CWarning, true);
  assert.equal(hotSample.delta, 0.0041);
  assert.equal(hotSample.trueSG, 1.0841);
  assert.ok(hotSample.warningFa?.includes('۳۲ °C'));

  const highPHSO2 = getTargetFreeSO2ByPH(3.85);
  assert.ok(highPHSO2.target > 52, 'getTargetFreeSO2ByPH(3.85) should scale with Henderson-Hasselbalch above 52 mg/L');
  assert.equal(highPHSO2.target, 74);

  // DAP cap at <= 0.30 g/L and explicit SG brix sync
  const highYanSna = calculateSNAAmounts(100, 28, 'high', 20);
  assert.ok(highYanSna.dap_2 <= 30, 'DAP must be capped at 0.30 g/L (30g in 100L)');
  assert.equal(highYanSna.dap_2, 30);

  const sgOnlySna = calculateSNAAmounts(100, 22, 1.110, 100);
  assert.ok(sgOnlySna.sugarGL > 260, 'Explicit SG 1.110 with default brix 22 should compute effectiveBrix from SG');

  const cont350 = getContinuousTargetFreeSO2ByPH(3.50, false);
  const cont351 = getContinuousTargetFreeSO2ByPH(3.51, false);
  assert.ok(cont351.target > cont350.target);
  assert.ok(cont351.target - cont350.target < 2.0, 'Continuous HH curve must not have 7 mg/L step jumps');
  assert.ok(cont350.formulaText.includes('10^(pH - 1.81)'));

  const zincStock = calculateStockSolutionPlan(0.26, 0.1, 'zinc');
  assert.equal(zincStock.needsStockSolution, true);
  assert.equal(zincStock.canUseStockSolution, true);
  assert.equal(zincStock.stockMassGrams, 1);
  assert.equal(zincStock.stockVolumeMl, 100);
  assert.equal(zincStock.syringeVolumeMl, 26);

  const fermaidStock = calculateStockSolutionPlan(0.5, 0.1, 'fermaid_or_yeast');
  assert.equal(fermaidStock.canUseStockSolution, false);

  // Monotonic continuity of getTargetFreeSO2ByPH across 3.60 -> 3.65 -> 3.70 (Audit Item 1.10)
  const so2At360 = getTargetFreeSO2ByPH(3.60);
  const so2At365 = getTargetFreeSO2ByPH(3.65);
  const so2At370 = getTargetFreeSO2ByPH(3.70);
  assert.ok(so2At360.target <= so2At365.target && so2At365.target <= so2At370.target, 'target Free SO2 must be monotonically non-decreasing across 3.60 -> 3.65 -> 3.70');
  assert.ok(so2At360.min <= so2At365.min && so2At365.min <= so2At370.min, 'min Free SO2 must be monotonically non-decreasing across 3.60 -> 3.65 -> 3.70');
  assert.ok(so2At360.max <= so2At365.max && so2At365.max <= so2At370.max, 'max Free SO2 must be monotonically non-decreasing across 3.60 -> 3.65 -> 3.70');

  // YAN scaling transparency fields in computeDynamicProtocolPlan (Audit Item 1.4)
  const dynPlan = computeDynamicProtocolPlan(IDEAL_DEFAULT_PROTOCOL_PARAMS);
  assert.ok(dynPlan.nitrogen.baseBioEquivalentYANMgL > 0);
  assert.ok(dynPlan.nitrogen.yanAccountingBasisFa.includes('نیتروژن معادل زیستی'));
});

test('BUG-01, BUG-06, BUG-09, BUG-10, BUG-11, BUG-21, BUG-32: Henderson-Hasselbalch strict monotonicity, comma thousand separators, batch snapshot priority, classic_v32 0.84 yield factor, and SG0 clamping', () => {
  // BUG-01 & BUG-21: Strictly increasing across 3.66, 3.69, 3.70, 3.75, 3.80, 3.85 and within 5% of HH
  const testPhs = [3.66, 3.69, 3.70, 3.75, 3.80, 3.85];
  const targets = testPhs.map((p) => getTargetFreeSO2ByPH(p).target);
  for (let i = 0; i < targets.length - 1; i++) {
    assert.ok(
      targets[i] < targets[i + 1],
      `Expected getTargetFreeSO2ByPH(${testPhs[i]}).target (${targets[i]}) < getTargetFreeSO2ByPH(${testPhs[i + 1]}).target (${targets[i + 1]})`
    );
  }
  for (const p of testPhs) {
    const tbl = getTargetFreeSO2ByPH(p);
    const cont = getContinuousTargetFreeSO2ByPH(p, false);
    const pctDiff = Math.abs(tbl.target - cont.target) / cont.target;
    assert.ok(pctDiff <= 0.05, `At pH ${p}, table target ${tbl.target} must be within 5% of HH ${cont.target}`);
  }

  // BUG-06: Thousand separator in general mode vs decimal comma vs SG shorthand
  assert.equal(normalizeEnologyNumericInput('1,234', 'general'), 1234);
  assert.equal(normalizeEnologyNumericInput('1,000,000', 'general'), 1000000);
  assert.equal(normalizeEnologyNumericInput('3,5', 'general'), 3.5);
  assert.equal(normalizeEnologyNumericInput('1,083', 'sg'), 1.083);

  // BUG-32: Clamping low positive initialSG (1.015 -> 1.020) while <= 0 falls back to 1.092
  assert.equal(calculateDynamicSGTriggers(1.015).initialSG, 1.020);
  assert.equal(calculateDynamicSGTriggers(0).initialSG, 1.092);

  // BUG-09: getEffectiveProtocolPlanForBatch prioritizes batch.protocolParamsSnapshot over explicitPlan by default
  const global400Plan = computeDynamicProtocolPlan(IDEAL_DEFAULT_PROTOCOL_PARAMS);
  const batchWith200KgSnapshot = {
    protocolParamsSnapshot: {
      ...IDEAL_DEFAULT_PROTOCOL_PARAMS,
      grapeWeightKg: 200
    }
  };
  const resolvedPlan = getEffectiveProtocolPlanForBatch(batchWith200KgSnapshot, global400Plan);
  assert.equal(resolvedPlan.params.grapeWeightKg, 200);
  assert.equal(resolvedPlan.volumes.redLiquidFermentPerTankL, 66);

  // BUG-10 & BUG-11: CLASSIC_V32_PROTOCOL_PARAMS uses redMashLiquidYieldFactor = 0.84 and editing grapeWeightKg does not drop 6.4L
  assert.equal(CLASSIC_V32_PROTOCOL_PARAMS.redMashLiquidYieldFactor, 0.84);
  const classic400 = computeDynamicProtocolPlan(CLASSIC_V32_PROTOCOL_PARAMS);
  const classic400Custom = computeDynamicProtocolPlan({
    ...CLASSIC_V32_PROTOCOL_PARAMS,
    presetId: 'custom',
    grapeWeightKg: 400
  });
  assert.equal(classic400.volumes.redLiquidFermentPerTankL, 132);
  assert.equal(classic400Custom.volumes.redLiquidFermentPerTankL, 132);
});

test('Idea 2: buildCalculatorDirectAdditions constructs structured additions for kms_so2, sna_2, and post_press_day11_lock', () => {
  // 1. kms_so2
  const kmsItems = buildCalculatorDirectAdditions({
    kind: 'kms_so2',
    batchId: 'batch-rasha-1403',
    tankId: 'tank-a',
    timestamp: '۱۴۰۵/۰۸/۰۵ - ۱۰:۰۰',
    referenceVolumeL: 96,
    primaryAmount: 5.83,
    calculatedSO2MgL: 35
  });
  assert.equal(kmsItems.length, 1);
  assert.equal(kmsItems[0].compoundType, 'kms');
  assert.equal(kmsItems[0].pubchemCid, 24446);
  assert.equal(kmsItems[0].referenceVolumeL, 96);
  assert.equal(kmsItems[0].calculatedSO2MgL, 35);
  assert.equal(kmsItems[0].isDemo, false);

  // 2. sna_2
  const sna2Items = buildCalculatorDirectAdditions({
    kind: 'sna_2',
    batchId: 'batch-rasha-1403',
    tankId: 'tank-a',
    timestamp: '۱۴۰۵/۰۷/۲۷ - ۱۴:۰۰',
    referenceVolumeL: 132,
    primaryAmount: 33,
    secondaryAmount: 19.8,
    tertiaryAmount: 0.26
  });
  assert.equal(sna2Items.length, 3);
  assert.deepEqual(
    sna2Items.map((i) => i.compoundType),
    ['fermaid_k', 'dap', 'zinc']
  );
  for (const item of sna2Items) {
    assert.equal(item.milestoneId, 'sna-2-dap');
    assert.equal(item.referenceVolumeL, 132);
    assert.equal(item.isDemo, false);
  }

  // 3. post_press_day11_lock
  const day11Items = buildCalculatorDirectAdditions({
    kind: 'post_press_day11_lock',
    batchId: 'batch-rasha-1403',
    tankId: 'tank-a',
    timestamp: '۱۴۰۵/۰۸/۰۶ - ۰۹:۰۰',
    referenceVolumeL: 96,
    primaryAmount: 28.8,
    secondaryAmount: 6.72
  });
  assert.equal(day11Items.length, 2);
  assert.deepEqual(
    day11Items.map((i) => i.compoundType),
    ['bactiless', 'kms']
  );
  for (const item of day11Items) {
    assert.equal(item.milestoneId, 'day11-bactiless-kms-lock');
    assert.equal(item.referenceVolumeL, 96);
    assert.equal(item.isDemo, false);
  }
});

test('computeGraduatedSyringeMetrics: auto-selects barrelCapacityMl (1, 5, 50) and computes plungerX, fillRatio, and 6 majorTicks (Golden Idea 5)', () => {
  const s1 = computeGraduatedSyringeMetrics(0.65);
  assert.equal(s1.barrelCapacityMl, 1);
  assert.equal(s1.plungerX, Math.round((34 + s1.liquidWidth) * 10) / 10);
  assert.ok(s1.fillRatio >= 0 && s1.fillRatio <= 1);
  assert.equal(s1.majorTicks.length, 6);
  assert.equal(s1.majorTicks[0].ml, 0);
  assert.equal(s1.majorTicks[5].ml, 1);

  const s5 = computeGraduatedSyringeMetrics(3.8);
  assert.equal(s5.barrelCapacityMl, 5);
  assert.equal(s5.plungerX, Math.round((34 + s5.liquidWidth) * 10) / 10);
  assert.equal(s5.majorTicks.length, 6);
  assert.equal(s5.majorTicks[5].ml, 5);

  const s50 = computeGraduatedSyringeMetrics(26.2);
  assert.equal(s50.barrelCapacityMl, 50);
  assert.equal(s50.plungerX, Math.round((34 + s50.liquidWidth) * 10) / 10);
  assert.equal(s50.majorTicks.length, 6);
  assert.equal(s50.majorTicks[5].ml, 50);
});
