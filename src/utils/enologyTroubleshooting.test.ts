import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateEnologicalScenario } from './enologyTroubleshooting.ts';
import {
  resolveEffectiveTankSelection,
  resolvePrimaryTankId,
  resolveTargetTankIds,
  getAvailableTankSelections,
  getGlossaryItem
} from '../context/EnologyUiContext.tsx';

test('evaluateEnologicalScenario: detects low pH and recommends empirical buffer KHCO3 (or exact 1.33 g/L stoichiometric KHCO3 on TA) and 0.84 yield factor', () => {
  const result = evaluateEnologicalScenario({
    batchVolumeL: 100,
    currentSG: 1.092,
    currentBrix: 22.0,
    tempCapC: 24.0,
    ph: 3.10, // low pH (phMin is 3.45 for red -> 0.35 deficit -> 3.5 * 1.20 typicalBufferGrams = 420 g in 100L)
    ta: 8.5,
    freeSO2: 30,
    isUnpressedRedMust: false
  });

  assert.equal(result.actions.some((a) => a.category === 'pH_Acid'), true);
  const phAction = result.actions.find((a) => a.category === 'pH_Acid');
  assert.equal(phAction?.severity, 'danger');
  assert.equal(phAction?.calculatedRecipe?.[0].item, 'پتاسیم بیکربنات (KHCO3)');
  assert.equal(phAction?.calculatedRecipe?.[0].amount, '420');

  // With unpressed red must (84% effective liquid volume -> 84L * 3.5 * 1.20 g/L = 352.8 g)
  const resultUnpressed = evaluateEnologicalScenario({
    batchVolumeL: 100,
    currentSG: 1.092,
    currentBrix: 22.0,
    tempCapC: 24.0,
    ph: 3.10,
    ta: 8.5,
    freeSO2: 30,
    isUnpressedRedMust: true
  });
  const phActionUnpressed = resultUnpressed.actions.find((a) => a.category === 'pH_Acid');
  assert.equal(phActionUnpressed?.calculatedRecipe?.[0].amount, '352.8');
});

test('evaluateEnologicalScenario: detects high pH and recommends Tartaric acid & KMS', () => {
  const result = evaluateEnologicalScenario({
    batchVolumeL: 175,
    currentSG: 1.050,
    currentBrix: 12.0,
    tempCapC: 25.0,
    ph: 3.72, // high pH
    ta: 5.2,
    freeSO2: 20
  });

  assert.equal(result.actions.some((a) => a.category === 'pH_Acid'), true);
  const phAction = result.actions.find((a) => a.category === 'pH_Acid');
  assert.equal(phAction?.severity, 'danger');
  assert.equal(phAction?.calculatedRecipe?.[0].item, 'اسید تارتاریک خالص (Tartaric Acid)');
});

test('evaluateEnologicalScenario: detects temperature spike > 29.5C and recommends ice bottles & dry ice with SG and 65% efficiency (Fix 5)', () => {
  const result = evaluateEnologicalScenario({
    batchVolumeL: 200,
    currentSG: 1.060,
    currentBrix: 14.5,
    tempCapC: 30.5, // extreme heat spike (target 26.5C -> delta 4.0C)
    ph: 3.52,
    ta: 6.8,
    freeSO2: 30
  });

  assert.equal(result.actions.some((a) => a.category === 'Temperature'), true);
  const tempAction = result.actions.find((a) => a.category === 'Temperature');
  assert.equal(tempAction?.severity, 'danger');
  assert.equal(tempAction?.calculatedRecipe?.[0].item, 'بطری‌های یخ استریل ۱.۵ لیتری');
  // 200 * 1.060 * 3.9 * 4.0 / (571 * 0.65) = 8.91 kg
  assert.equal(tempAction?.calculatedRecipe?.[1].amount, '8.91');
});

test('evaluateEnologicalScenario: handles stuck fermentation and off-odors', () => {
  const result = evaluateEnologicalScenario({
    batchVolumeL: 132,
    currentSG: 1.040,
    currentBrix: 10.0,
    tempCapC: 22.0,
    ph: 3.52,
    ta: 6.5,
    freeSO2: 25,
    issues: {
      isStuckFermentation: true,
      hasH2S: true
    }
  });

  assert.equal(result.actions.some((a) => a.category === 'SG_Ferment'), true);
  assert.equal(result.actions.some((a) => a.category === 'OffOdor_Spoilage'), true);
  assert.equal(result.criticalWarningsCount >= 2, true);
});

test('evaluateEnologicalScenario: detects extreme high/low TA and Potassium Buffering Paradox (High pH + High TA)', () => {
  // 1. Extreme High TA (TA = 20 g/L)
  const highTaRes = evaluateEnologicalScenario({
    batchVolumeL: 132,
    currentSG: 1.040,
    currentBrix: 10.0,
    tempCapC: 24.0,
    ph: 3.48,
    ta: 20.0,
    freeSO2: 20
  });
  const highTaAction = highTaRes.actions.find((a) => a.category === 'pH_Acid');
  assert.ok(highTaAction, 'Must detect extreme high TA');
  assert.equal(highTaAction.severity, 'danger');
  assert.ok(highTaRes.overallHealthScore <= 75);

  // 2. Severe Low TA (TA = 4.0 g/L)
  const lowTaRes = evaluateEnologicalScenario({
    batchVolumeL: 100,
    currentSG: 1.050,
    currentBrix: 12.5,
    tempCapC: 24.0,
    ph: 3.50,
    ta: 4.0,
    freeSO2: 20
  });
  const lowTaAction = lowTaRes.actions.find((a) => a.category === 'pH_Acid');
  assert.ok(lowTaAction, 'Must detect severe low TA');
  assert.equal(lowTaAction.severity, 'danger');

  // 3. High pH + High TA Potassium Buffering Paradox (pH = 3.68, TA = 7.4 g/L)
  const paradoxRes = evaluateEnologicalScenario({
    batchVolumeL: 132,
    currentSG: 1.020,
    currentBrix: 5.0,
    tempCapC: 24.0,
    ph: 3.68,
    ta: 7.4,
    freeSO2: 20
  });
  const paradoxAction = paradoxRes.actions.find((a) => a.category === 'pH_Acid');
  assert.ok(paradoxAction, 'Must detect Potassium Buffering Paradox');
  assert.ok(paradoxAction.title.includes('پارادوکس'));
  assert.ok(paradoxAction.calculatedRecipe?.[0].amount.includes('0'));
});

test('evaluateEnologicalScenario: stage-aware finished wine temperature and Rose ester boil-off protection', () => {
  // Finished wine (SG = 0.993) at 25°C -> oxidation / microbial danger
  const finishedWarm = evaluateEnologicalScenario({
    batchVolumeL: 100,
    currentSG: 0.993,
    currentBrix: 0,
    tempCapC: 25.0,
    ph: 3.52,
    ta: 6.4,
    freeSO2: 42
  });
  const tempAct = finishedWarm.actions.find((a) => a.category === 'Temperature');
  assert.ok(tempAct, 'Finished wine at 25C must trigger temperature danger');
  assert.equal(tempAct.severity, 'danger');

  // Rose active fermentation at 23°C -> aromatic ester boil-off danger
  const roseWarm = evaluateEnologicalScenario({
    batchVolumeL: 32,
    currentSG: 1.060,
    currentBrix: 15.0,
    tempCapC: 23.0,
    ph: 3.32,
    ta: 6.8,
    freeSO2: 15,
    isRose: true
  });
  const roseTempAct = roseWarm.actions.find((a) => a.category === 'Temperature');
  assert.ok(roseTempAct, 'Rose fermentation at 23C must trigger ester loss danger');
  assert.equal(roseTempAct.severity, 'danger');
});

test('evaluateEnologicalScenario: detects Free SO2 overdose and prescribes staged 3% H2O2 neutralization (<= 25 mg/L first stage), plus issue handlers', () => {
  const so2Overdose = evaluateEnologicalScenario({
    batchVolumeL: 100,
    currentSG: 0.993,
    currentBrix: 0,
    tempCapC: 15.0,
    ph: 3.52,
    ta: 6.4,
    freeSO2: 95,
    issues: {
      hasDryCap: true,
      hasBitterSeeds: true,
      hasCloudiness: true
    }
  });

  const so2Act = so2Overdose.actions.find((a) => a.category === 'SO2_Oxidation');
  assert.ok(so2Act, 'Must detect Free SO2 overdose (95 mg/L)');
  assert.equal(so2Act.severity, 'danger');
  assert.ok(so2Act.calculatedRecipe?.[0].item.includes('H2O2'));
  // First-stage safe max for 25 mg/L reduction in 100L: 25 * 0.0177 * 100 = 44.25 mL
  assert.equal(so2Act.calculatedRecipe?.[0].amount, '44.25');
  assert.ok(so2Act.diagnosis.includes('اثبات‌کننده نقض سقف قانونی Total SO2 نیست'));

  assert.ok(so2Overdose.actions.some((a) => a.title.includes('خشک شدن سطح کلاهک')));
  assert.ok(so2Overdose.actions.some((a) => a.title.includes('تانن‌های گس و تلخ هسته')));
  assert.ok(so2Overdose.actions.some((a) => a.title.includes('کدورت پایدار')));
  assert.equal(so2Overdose.visibleActions.length, 3, 'visibleActions must be capped at top 3 non-info alerts');
  assert.equal(so2Overdose.hiddenActionsCount, 1);
  assert.ok(so2Overdose.visibleActions[0].progressiveLayers?.layer1ActionFa);
});

test('evaluateEnologicalScenario: zero score penalty on refractometer informational alert and conflict resolution on contradictory pH/TA', () => {
  // 1. Refractometer discrepancy during fermentation should be an informational alert with 0 score penalty
  const refracRes = evaluateEnologicalScenario({
    batchVolumeL: 132,
    currentSG: 1.020, // expected Brix ~ 5.1, but currentBrix is 11.0 (alcohol refraction error)
    currentBrix: 11.0,
    tempCapC: 24.0,
    ph: 3.52,
    ta: 6.5,
    freeSO2: 20,
    dayNumber: 4
  });
  assert.equal(refracRes.overallHealthScore, 100, 'Refractometer informational alert must not subtract health score');
  assert.equal(refracRes.infoActions.length, 1);
  assert.equal(refracRes.infoActions[0].alertTier, 'info');
  assert.equal(refracRes.infoActions[0].canSnooze, true);
  assert.ok(refracRes.infoActions[0].solutionSummary.includes('تخمین تِریل'));

  // 2. Contradictory Low pH + Low TA must emit a single unified sensor/titration check action (not both KHCO3 and Tartaric)
  const contraRes = evaluateEnologicalScenario({
    batchVolumeL: 132,
    currentSG: 1.050,
    currentBrix: 12.5,
    tempCapC: 24.0,
    ph: 3.20, // < phMin (3.45)
    ta: 4.5, // < taMin (5.8)
    freeSO2: 20,
    dayNumber: 3
  });
  const phAcidActions = contraRes.actions.filter((a) => a.category === 'pH_Acid');
  assert.equal(phAcidActions.length, 1, 'Must emit only one unified pH_Acid warning on contradictory low pH + low TA');
  assert.ok(phAcidActions[0].title.includes('تناقض آزمایشگاهی'));
});

test('evaluateEnologicalScenario: Chaptalization 10.8 g/L stoichiometry, sluggish Day 8 KMS guard, high-pH SO2 threshold, unified Tartaric Acid, and >=4 danger visibleActions', () => {
  // 1. Chaptalization at 18.5 °Bx in 132 L -> Math.round(3.5 * 10.8 * 132) = 4990 g
  const chaptalRes = evaluateEnologicalScenario({
    batchVolumeL: 132,
    currentSG: 1.076,
    currentBrix: 18.5,
    tempCapC: 20.0,
    ph: 3.52,
    ta: 6.5,
    freeSO2: 25,
    dayNumber: 0
  });
  const chaptalAction = chaptalRes.actions.find((a) => a.title.includes('بریکس اولیه پایین'));
  assert.ok(chaptalAction);
  assert.equal(chaptalAction.calculatedRecipe?.[0].amount, '4990');

  // 2. Sluggish fermentation on dayNumber: 8 with currentSG: 1.040 and freeSO2: 12 must NOT recommend adding KMS
  const sluggishDay8Res = evaluateEnologicalScenario({
    batchVolumeL: 132,
    currentSG: 1.040,
    currentBrix: 10.0,
    tempCapC: 23.0,
    ph: 3.52,
    ta: 6.5,
    freeSO2: 12,
    dayNumber: 8
  });
  const kmsActionOnSluggish = sluggishDay8Res.actions.find((a) => a.category === 'SO2_Oxidation');
  assert.equal(kmsActionOnSluggish, undefined, 'Sluggish active fermentation at SG 1.040 on Day 8 must not recommend KMS');

  // 3. High-pH wine (ph: 3.85, currentSG: 0.992, freeSO2: 70) is NOT flagged as an SO2 overdose requiring H2O2
  const highPhWineRes = evaluateEnologicalScenario({
    batchVolumeL: 100,
    currentSG: 0.992,
    currentBrix: 0,
    tempCapC: 15.0,
    ph: 3.85,
    ta: 6.2,
    freeSO2: 70,
    dayNumber: 20
  });
  const so2OverdoseOnHighPh = highPhWineRes.actions.find((a) => a.category === 'SO2_Oxidation');
  assert.equal(so2OverdoseOnHighPh, undefined, 'High-pH wine at 70 mg/L Free SO2 must not be flagged for H2O2 overdose');

  // 4. Simultaneous ph: 3.72 and ta: 5.0 emits a single unified Tartaric Acid action
  const highPhLowTaRes = evaluateEnologicalScenario({
    batchVolumeL: 100,
    currentSG: 1.050,
    currentBrix: 12.5,
    tempCapC: 24.0,
    ph: 3.72,
    ta: 5.0,
    freeSO2: 25
  });
  const tartaricActions = highPhLowTaRes.actions.filter((a) => a.category === 'pH_Acid');
  assert.equal(tartaricActions.length, 1, 'Simultaneous high pH and low TA must emit a single unified pH_Acid action');

  // 5. When 4 danger alerts occur simultaneously (plus warning alerts), all 4 danger alerts are visible and NEVER hidden behind the top-3 cap
  const fourDangerRes = evaluateEnologicalScenario({
    batchVolumeL: 100,
    currentSG: 1.040,
    currentBrix: 10.0,
    tempCapC: 33.0, // danger #1: thermal shock
    ph: 3.75, // danger #2: critical high pH
    ta: 6.5,
    freeSO2: 20,
    issues: {
      isStuckFermentation: true, // danger #3: stuck fermentation
      hasH2S: true, // danger #4: H2S
      hasDryCap: true // warning #1: dry cap (should be hidden when 4 danger alerts fill visibleActions)
    }
  });
  assert.equal(fourDangerRes.criticalWarningsCount, 4);
  assert.equal(fourDangerRes.visibleActions.length, 4);
  assert.equal(
    fourDangerRes.visibleActions.every((a) => a.severity === 'danger'),
    true,
    'All 4 danger alerts must be included in visibleActions'
  );
  assert.equal(fourDangerRes.hiddenActionsCount, 1);
});

test('EnologyUiContext helpers: supports both-red selection and tankCount === 1 auto-adaptation', () => {
  // 2-tank batch ('both-red' active)
  assert.equal(resolveEffectiveTankSelection('both-red', 2), 'both-red');
  assert.equal(resolvePrimaryTankId('both-red', 2), 'tank-a');
  assert.deepEqual(resolveTargetTankIds('both-red', 2), ['tank-a', 'tank-b']);
  assert.equal(getAvailableTankSelections(2, 'red').length, 4);

  // 1-tank batch auto-adaptation ('tank-b' and 'both-red' adapt to 'tank-a')
  assert.equal(resolveEffectiveTankSelection('tank-b', 1), 'tank-a');
  assert.equal(resolveEffectiveTankSelection('both-red', 1), 'tank-a');
  assert.equal(resolvePrimaryTankId('tank-b', 1), 'tank-a');
  assert.deepEqual(resolveTargetTankIds('both-red', 1), ['tank-a']);
  assert.deepEqual(
    getAvailableTankSelections(1, 'red').map((o) => o.id),
    ['tank-a', 'tank-rose']
  );

  // Glossary lookup
  const sgTerm = getGlossaryItem('sg');
  assert.ok(sgTerm);
  assert.ok(sgTerm.termFa.includes('چگالی'));
});

test('evaluateEnologicalScenario: batchVolumeL: 0 triggers hasInvalidVolume: true and halts silent 132 L dose calculation (Audit Item 1.7)', () => {
  const zeroVolRes = evaluateEnologicalScenario({
    batchVolumeL: 0,
    currentSG: 1.092,
    currentBrix: 22.0,
    tempCapC: 24.0,
    ph: 3.10,
    ta: 8.5,
    freeSO2: 15
  });

  assert.equal(zeroVolRes.hasInvalidVolume, true);
  const volGuardAction = zeroVolRes.actions.find((a) =>
    a.title.includes('حجم مخزن نامعتبر یا وارد نشده است')
  );
  assert.ok(volGuardAction, 'Must emit critical invalid volume guard action');
  assert.equal(volGuardAction.severity, 'danger');
  assert.equal(volGuardAction.alertTier, 'critical');

  // Verify no action silently computes doses for 132 L when batchVolumeL is 0
  for (const act of zeroVolRes.actions) {
    for (const rec of act.calculatedRecipe ?? []) {
      assert.equal(rec.amount, '0', 'All calculated recipes must be 0 when batchVolumeL <= 0');
      assert.equal(
        rec.instruction,
        'محاسبه متوقف شد — ابتدا حجم معتبر مخزن را وارد کنید'
      );
    }
  }
});

test('BUG-04: evaluateEnologicalScenario does NOT recommend post-fermentation KMS addition at SG = 1.000 during late active fermentation', () => {
  const sg1000Res = evaluateEnologicalScenario({
    batchVolumeL: 100,
    currentSG: 1.000,
    currentBrix: 0,
    tempCapC: 22.0,
    ph: 3.52,
    ta: 6.4,
    freeSO2: 15,
    dayNumber: 6
  });
  const so2ActionsAt1000 = sg1000Res.actions.filter((a) => a.category === 'SO2_Oxidation');
  assert.equal(
    so2ActionsAt1000.length,
    0,
    'SG = 1.000 on Day 6 still has ~10-15 g/L residual sugar and must NOT recommend KMS sulfiting'
  );
});

