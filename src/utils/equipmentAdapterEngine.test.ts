import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_EQUIPMENT_PROFILE_PRO,
  EQUIPMENT_PRESET_ARTISAN_HOME,
  EQUIPMENT_PRESET_MINIMAL_PLUS
} from '../types/index.ts';
import {
  evaluateEquipmentCapabilities,
  formatDoseForEquipment,
  getMilestoneEquipmentAdaptation,
  getRoadmapStepEquipmentGuide,
  getLabToolEquipmentCompatibility
} from './equipmentAdapterEngine.ts';

test('evaluateEquipmentCapabilities computes capabilities and missing reagents across all 3 standard presets', () => {
  const proSummary = evaluateEquipmentCapabilities(DEFAULT_EQUIPMENT_PROFILE_PRO, 96);
  assert.equal(proSummary.shortBadgeFa, 'حرفه‌ای کامل');
  assert.equal(proSummary.defaultHydrometerCalibrationTemp, 20);
  assert.equal(proSummary.primarySugarInputMode, 'hydrometer_sg');
  assert.equal(proSummary.effectiveTankCount, 2);
  assert.equal(proSummary.produceRoseSaignee, true);
  assert.equal(proSummary.agingCarboyUnitL, 20);
  assert.equal(proSummary.redCarboysPerTankCount, 5);
  assert.equal(proSummary.totalRedCarboysCount, 10);
  assert.equal(proSummary.canMeasureFreeSo2Directly, true);
  assert.equal(proSummary.canMeasureTaDirectly, true);
  assert.equal(proSummary.canMeasurePhDirectly, true);
  assert.equal(proSummary.missingReagentsListFa.length, 0);
  assert.equal(proSummary.activeSubstitutionsCount, 0);

  const artisanSummary = evaluateEquipmentCapabilities(EQUIPMENT_PRESET_ARTISAN_HOME, 96);
  assert.equal(artisanSummary.shortBadgeFa, 'کارگاه خانگی');
  assert.equal(artisanSummary.effectiveTankCount, 1);
  assert.equal(artisanSummary.produceRoseSaignee, false);
  assert.equal(artisanSummary.canMeasureFreeSo2Directly, false);
  assert.equal(artisanSummary.canMeasureTaDirectly, true);
  assert.equal(artisanSummary.canMeasurePhDirectly, true);
  assert.ok(artisanSummary.missingReagentsListFa.includes('سولفات مس'));
  assert.ok(artisanSummary.missingReagentsListFa.includes('اسید اسکوربیک'));

  const minimalSummary = evaluateEquipmentCapabilities(
    {
      ...EQUIPMENT_PRESET_MINIMAL_PLUS,
      densityInstrument: 'hydrometer_15_5c',
      agingVesselType: 'demijohn_5l_10l'
    },
    96
  );
  assert.equal(minimalSummary.shortBadgeFa, 'مینیمال ارتقاءیافته');
  assert.equal(minimalSummary.defaultHydrometerCalibrationTemp, 15.5);
  assert.equal(minimalSummary.agingCarboyUnitL, 10);
  assert.equal(minimalSummary.redCarboysPerTankCount, 10);
  assert.equal(minimalSummary.totalRedCarboysCount, 10);
  assert.ok(minimalSummary.missingReagentsListFa.includes('Fermaid O'));
  assert.ok(minimalSummary.missingReagentsListFa.includes('کیتوزان (Bactiless)'));
  assert.ok(minimalSummary.activeSubstitutionsCount >= 5);
});

test('formatDoseForEquipment switches between direct_weigh and stock_syringe based on scale precision', () => {
  const directPlan = formatDoseForEquipment({
    targetDoseGrams: 3.43,
    compoundNameFa: 'متابیسولفیت پتاسیم (KMS)',
    compoundCategory: 'kms',
    profile: DEFAULT_EQUIPMENT_PROFILE_PRO
  });
  assert.equal(directPlan.executionMode, 'direct_weigh');
  assert.ok(directPlan.primaryDoseTextFa.includes('3.43 g'));

  const syringePlan = formatDoseForEquipment({
    targetDoseGrams: 3.43,
    compoundNameFa: 'متابیسولفیت پتاسیم (KMS)',
    compoundCategory: 'kms',
    profile: {
      ...EQUIPMENT_PRESET_MINIMAL_PLUS,
      scalePrecisionGrams: 1,
      hasPrecisionScale: false,
      hasGraduatedSyringes: true
    }
  });
  assert.equal(syringePlan.executionMode, 'stock_syringe');
  assert.ok(syringePlan.primaryDoseTextFa.includes('mL از محلول استوک'));
  assert.equal(syringePlan.stockPlan.needsStockSolution, true);
});

test('getMilestoneEquipmentAdaptation and getRoadmapStepEquipmentGuide adapt instructions and substitutions', () => {
  // 1. Saignee disabled when produceRoseSaignee === false
  const saigneeDisabled = getMilestoneEquipmentAdaptation(
    'saignee-rose',
    EQUIPMENT_PRESET_ARTISAN_HOME
  );
  assert.equal(saigneeDisabled.isApplicable, false);
  assert.equal(saigneeDisabled.equipmentBadgeFa, 'غیرفعال در پروفایل شما');

  // 2. Pressing with mesh_bag_gravity_hand
  const meshPress = getMilestoneEquipmentAdaptation('pressing', {
    ...EQUIPMENT_PRESET_MINIMAL_PLUS,
    pressingMethod: 'mesh_bag_gravity_hand'
  });
  assert.equal(meshPress.isApplicable, true);
  assert.ok(meshPress.equipmentBadgeFa.includes('کیسه توری'));
  assert.ok(meshPress.adaptedHowToFa.includes('کیسه توری استریل'));

  // 3. Boiled yeast hulls substitution when hasFermaidO === false
  const snaNoFermaidO = getMilestoneEquipmentAdaptation('sna-1', {
    ...EQUIPMENT_PRESET_MINIMAL_PLUS,
    availableReagents: { hasFermaidO: false }
  });
  assert.equal(snaNoFermaidO.isApplicable, true);
  assert.ok(snaNoFermaidO.substitutionWarningFa?.includes('Yeast Hulls'));

  // 4. Roadmap step delegation (step 21 -> pressing, step 1 -> null)
  const step21Guide = getRoadmapStepEquipmentGuide(21, EQUIPMENT_PRESET_MINIMAL_PLUS);
  assert.ok(step21Guide !== null);
  assert.ok(step21Guide.badgeFa.includes('کیسه توری'));
  assert.equal(getRoadmapStepEquipmentGuide(1, DEFAULT_EQUIPMENT_PROFILE_PRO), null);
});

test('getLabToolEquipmentCompatibility distinguishes supported vs fallback tools for EQUIPMENT_PRESET_ARTISAN_HOME', () => {
  const hydroCompat = getLabToolEquipmentCompatibility('test-hydro', EQUIPMENT_PRESET_ARTISAN_HOME);
  assert.equal(hydroCompat.isDirectlySupported, true);
  assert.equal(hydroCompat.badgeFa, 'قابل اجرا با تجهیزات شما ✓');

  const refractCompat = getLabToolEquipmentCompatibility(
    'test-refract',
    EQUIPMENT_PRESET_ARTISAN_HOME
  );
  assert.equal(refractCompat.isDirectlySupported, false);
  assert.equal(refractCompat.badgeFa, 'حالت شبیه‌ساز / جایگزین بدون کیت');

  const so2Compat = getLabToolEquipmentCompatibility('test-so2', EQUIPMENT_PRESET_ARTISAN_HOME);
  assert.equal(so2Compat.isDirectlySupported, false);
  assert.equal(so2Compat.badgeFa, 'حالت شبیه‌ساز / جایگزین بدون کیت');

  const mlfCompat = getLabToolEquipmentCompatibility(
    'mlf_chromatography',
    EQUIPMENT_PRESET_ARTISAN_HOME
  );
  assert.equal(mlfCompat.isDirectlySupported, false);
});
