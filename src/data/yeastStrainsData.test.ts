import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  YEAST_STRAINS_DATABASE,
  getYeastStrainById,
  computeYeastAdjustedSnaPlan,
  computeYeastAcidityAndGlycerolImpact,
  recommendYeastStrainsForGoal,
  type YeastBrand
} from './yeastStrainsData.ts';
import { getCapTemperatureAlertLevel } from '../utils/trackingCalculations.ts';
import { evaluateEnologicalScenario } from '../utils/enologyTroubleshooting.ts';
import { evaluateRightNowQueue } from '../utils/rightNowEngine.ts';

describe('yeastStrainsData — 36-Strain Global Yeast Bioprocess Engine', () => {
  it('contains 36 unique strains across all 9 global brands', () => {
    assert.equal(YEAST_STRAINS_DATABASE.length, 36);
    const uniqueIds = new Set(YEAST_STRAINS_DATABASE.map((s) => s.id));
    assert.equal(uniqueIds.size, 36);

    const expectedBrands: YeastBrand[] = [
      'Lallemand',
      'Laffort',
      'Fermentis',
      'Enartis',
      'Anchor',
      'Maurivin',
      'Red Star',
      'Renaissance',
      'Chr. Hansen'
    ];
    const presentBrands = new Set(YEAST_STRAINS_DATABASE.map((s) => s.brand));
    for (const brand of expectedBrands) {
      assert.equal(
        presentBrands.has(brand),
        true,
        `Expected brand ${brand} to be present in YEAST_STRAINS_DATABASE`
      );
    }
  });

  it('falls back to RC-212 for red and Rhône 4600 for rosé in getYeastStrainById', () => {
    const defaultRed = getYeastStrainById(undefined, false);
    assert.equal(defaultRed.id, 'lalvin-rc-212');

    const defaultRose = getYeastStrainById('unknown-strain-id', true);
    assert.equal(defaultRose.id, 'lalvin-rhone-4600');
  });

  it('computes lower targetYAN and SNA doses for FX10 (0.80) than BM 45 (1.25)', () => {
    const fx10Plan = computeYeastAdjustedSnaPlan({
      strainId: 'laffort-zymaflore-fx10',
      volumeL: 132,
      brix: 22.0,
      initialSG: 1.092,
      naturalYAN: 100
    });
    const bm45Plan = computeYeastAdjustedSnaPlan({
      strainId: 'lalvin-bm-45',
      volumeL: 132,
      brix: 22.0,
      initialSG: 1.092,
      naturalYAN: 100
    });

    assert.ok(fx10Plan.targetYAN < bm45Plan.targetYAN);
    assert.ok(fx10Plan.neededYAN < bm45Plan.neededYAN);
    assert.ok(fx10Plan.fermaidO_1 < bm45Plan.fermaidO_1);
    assert.ok(fx10Plan.fermaidK_2 < bm45Plan.fermaidK_2);
    assert.ok(fx10Plan.dap_2 < bm45Plan.dap_2);
  });

  it('predicts biological acidification for Level2 Laktia and malic degradation for 71B', () => {
    const laktiaImpact = computeYeastAcidityAndGlycerolImpact({
      strainId: 'lallemand-level2-laktia',
      initialPH: 3.62,
      initialTA: 5.8,
      defaultMaxGlycerinGL: 4.5
    });
    assert.equal(laktiaImpact.hasBiologicalAcidification, true);
    assert.ok(laktiaImpact.predictedFinalPH < 3.62);
    assert.ok(laktiaImpact.predictedFinalTA > 5.8);

    const strain71bImpact = computeYeastAcidityAndGlycerolImpact({
      strainId: 'lalvin-71b',
      initialPH: 3.45,
      initialTA: 7.4,
      defaultMaxGlycerinGL: 4.5
    });
    assert.equal(strain71bImpact.hasHighMalicDegradation, true);
    assert.ok(strain71bImpact.predictedFinalPH > 3.45);
  });

  it('returns only zero_biotech H2S strains for zero_h2s_safety goal', () => {
    const zeroH2sStrains = recommendYeastStrainsForGoal('zero_h2s_safety');
    assert.ok(zeroH2sStrains.length >= 4);
    for (const s of zeroH2sStrains) {
      assert.equal(s.h2sRiskLevel, 'zero_biotech');
    }
  });

  it('adapts cap temperature alert level to strain thermal limits (FX10 vs BM 45)', () => {
    const fx10Alert = getCapTemperatureAlertLevel(29.2, false, 1.050, 'laffort-zymaflore-fx10');
    assert.equal(fx10Alert, 'caution');

    const bm45Alert = getCapTemperatureAlertLevel(29.2, false, 1.050, 'lalvin-bm-45');
    assert.equal(bm45Alert, 'danger');
  });

  it('includes malic acid consumption warning in evaluateEnologicalScenario for Lalvin 71B at pH 3.55', () => {
    const eval71b = evaluateEnologicalScenario({
      batchVolumeL: 132,
      currentSG: 1.040,
      currentBrix: 10,
      tempCapC: 24,
      ph: 3.55,
      ta: 6.2,
      freeSO2: 20,
      yeastStrainId: 'lalvin-71b'
    });
    const hasMalicAction = eval71b.actions.some(
      (a) => a.category === 'pH_Acid' && a.title.includes('مصرف اسید مالیک')
    );
    assert.equal(hasMalicAction, true);
  });

  it('scales SNA-2 DAP and Fermaid K doses in evaluateRightNowQueue by tank yeast strain (BM 45 vs FX10)', () => {
    const queue = evaluateRightNowQueue({
      logs: [
        {
          id: 'log-a',
          tankId: 'tank-a',
          dayNumber: 4,
          dateTime: '1405/07/05 - 08:00',
          sg: 1.058,
          brix: 14.3,
          tempCap: 25,
          tempRoom: 20,
          ph: 3.45,
          ta: 6.5,
          freeSO2: 15,
          notes: ''
        } as unknown as Parameters<typeof evaluateRightNowQueue>[0]['logs'][number]
      ],
      additions: [],
      activeTankId: 'tank-a',
      selectedYeastByTank: {
        'tank-a': 'lalvin-bm-45',
        'tank-b': 'laffort-zymaflore-fx10'
      }
    });

    const sna2Milestone = queue.allMilestones.find((m) => m.id === 'sna-2-dap');
    assert.ok(sna2Milestone, 'Expected sna-2-dap milestone to exist');

    const tankARow = sna2Milestone.tankRows.find((r) => r.tankId === 'tank-a');
    const tankBRow = sna2Milestone.tankRows.find((r) => r.tankId === 'tank-b');
    assert.ok(tankARow && tankBRow);

    const tankAFermaidK = tankARow.additionsToRecord[0]?.amount ?? 0;
    const tankBFermaidK = tankBRow.additionsToRecord[0]?.amount ?? 0;
    const tankADap = tankARow.additionsToRecord[1]?.amount ?? 0;
    const tankBDap = tankBRow.additionsToRecord[1]?.amount ?? 0;

    assert.ok(tankAFermaidK > tankBFermaidK, `Expected BM 45 Fermaid K (${tankAFermaidK}) > FX10 (${tankBFermaidK})`);
    assert.ok(tankADap > tankBDap, `Expected BM 45 DAP (${tankADap}) > FX10 (${tankBDap})`);
  });
});

