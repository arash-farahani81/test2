import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateFermentationProgress,
  calculateAlcoholByVolume,
  brixToSpecificGravity,
  specificGravityToBrix,
  getCapTemperatureAlertLevel,
  analyzeLogEntryHealth,
  compareRealLogsWithBenchmark,
  predictFermentationCompletion,
  calculateRecentLogVelocity,
  calculateVelocity,
  detectQuickLogTypoShield
} from './trackingCalculations.ts';
import { computeVesselTwinState } from '../components/LivingTankVisualTwin.tsx';
import { getGlobalActiveTimersSnapshot } from '../components/ProcessRoadmapTracker.tsx';
import {
  computeSensoryRadarPolygonPoints,
  buildVintagePassportSummary
} from '../components/PhotoDiaryAndVintagePanel.tsx';
import type { FermentationLogEntry } from '../types/tracking.ts';
import type { ChemicalAddition } from '../types/database.ts';

test('predictFermentationCompletion: estimates remaining days accurately without double-counting kinetic slowdown (Fix 3)', () => {
  const sampleLogs: FermentationLogEntry[] = [
    {
      id: 'l-1',
      tankId: 'tank-a',
      dayNumber: 0,
      dateTime: '۱۴۰۳/۰۷/۲۵',
      stageTitle: 'روز ۰',
      brix: 22.0,
      sg: 1.092,
      tempCap: 22.0,
      tempRoom: 20.0,
      ph: 3.52,
      pigeageDone: true
    },
    {
      id: 'l-2',
      tankId: 'tank-a',
      dayNumber: 2,
      dateTime: '۱۴۰۳/۰۷/۲۷',
      stageTitle: 'روز ۲ - SG 1.083',
      brix: 20.2,
      sg: 1.083,
      tempCap: 23.5,
      tempRoom: 21.0,
      ph: 3.52,
      pigeageDone: true
    },
    {
      id: 'l-3',
      tankId: 'tank-a',
      dayNumber: 4,
      dateTime: '۱۴۰۳/۰۷/۲۹',
      stageTitle: 'روز ۴ - SG 1.060',
      brix: 14.8,
      sg: 1.060,
      tempCap: 25.0,
      tempRoom: 22.0,
      ph: 3.52,
      pigeageDone: true
    }
  ];

  const prediction = predictFermentationCompletion(sampleLogs, 'tank-a');

  assert.equal(prediction.currentSG, 1.060);
  assert.equal(prediction.targetSG, 0.993);
  assert.equal(prediction.sgRemaining, 0.067);
  assert.ok(prediction.estimatedRemainingDays > 3 && prediction.estimatedRemainingDays < 8);
  assert.equal(prediction.kineticStatus, 'normal');

  // Test Temperature override kinetic impact
  const warmPrediction = predictFermentationCompletion(sampleLogs, 'tank-a', 0.993, 28.0);
  assert.ok(warmPrediction.estimatedRemainingDays < prediction.estimatedRemainingDays);
  assert.equal(warmPrediction.isOutOfModelBounds, false);

  // Cardinal Temperature Curve: extreme heat (32.0C) slows yeast below 22C baseline and sets isOutOfModelBounds = true
  const thermalShockPred = predictFermentationCompletion(sampleLogs, 'tank-a', 0.993, 32.0);
  assert.ok(thermalShockPred.tempKineticFactor <= 0.35);
  assert.equal(thermalShockPred.isOutOfModelBounds, true);
  assert.ok(thermalShockPred.estimatedRemainingDays > warmPrediction.estimatedRemainingDays);

  // Verify tail-phase logs (< 1.030) do not double-count F_depletion = 0.55 on observed velocity
  const tailLogs: FermentationLogEntry[] = [
    {
      id: 't-1',
      tankId: 'tank-a',
      dayNumber: 5,
      dateTime: '۱۴۰۳/۰۷/۳۰ - ۱۲:۰۰',
      stageTitle: 'روز ۵',
      brix: 6.5,
      sg: 1.026,
      tempCap: 24.0,
      tempRoom: 21.0,
      ph: 3.54,
      pigeageDone: true
    },
    {
      id: 't-2',
      tankId: 'tank-a',
      dayNumber: 6,
      dateTime: '۱۴۰۳/۰۸/۰۱ - ۱۲:۰۰',
      stageTitle: 'روز ۶',
      brix: 4.5,
      sg: 1.018,
      tempCap: 24.0,
      tempRoom: 21.0,
      ph: 3.54,
      pigeageDone: true
    }
  ];
  const tailPred = predictFermentationCompletion(tailLogs, 'tank-a');
  assert.ok(tailPred.effectiveVelocityPerDay >= 0.008);
});

test('calculateVelocity, calculateRecentLogVelocity cross-midnight 2h span, and lag phase stuck guard (Fix 4)', () => {
  const sameDayLogs: FermentationLogEntry[] = [
    {
      id: 'sd-1',
      tankId: 'tank-a',
      dayNumber: 1,
      dateTime: '۱۴۰۳/۰۷/۲۶ - ۰۸:۰۰',
      stageTitle: 'روز ۱ صبح',
      brix: 21.8,
      sg: 1.090,
      tempCap: 21.0,
      tempRoom: 20.0,
      ph: 3.52,
      pigeageDone: true
    },
    {
      id: 'sd-2',
      tankId: 'tank-a',
      dayNumber: 1,
      dateTime: '۱۴۰۳/۰۷/۲۶ - ۲۰:۰۰',
      stageTitle: 'روز ۱ شب',
      brix: 20.5,
      sg: 1.084,
      tempCap: 22.0,
      tempRoom: 20.5,
      ph: 3.52,
      pigeageDone: true
    }
  ];

  // 0.006 SG drop over 12 hours (0.5 day) = 0.012 SG/day
  const vel = calculateVelocity(sameDayLogs);
  assert.equal(vel, 0.012);

  // Day 3 23:00 to Day 4 01:00 -> 2 hours (2/24 = 0.0833 day) span instead of 1 full day
  const crossMidnightLogs: FermentationLogEntry[] = [
    {
      id: 'cm-1',
      tankId: 'tank-a',
      dayNumber: 3,
      dateTime: '۱۴۰۳/۰۷/۲۸ - ۲۳:۰۰',
      stageTitle: 'روز ۳ شب',
      brix: 17.5,
      sg: 1.070,
      tempCap: 24.0,
      tempRoom: 21.0,
      ph: 3.52,
      pigeageDone: true
    },
    {
      id: 'cm-2',
      tankId: 'tank-a',
      dayNumber: 4,
      dateTime: '۱۴۰۳/۰۷/۲۹ - ۰۱:۰۰',
      stageTitle: 'روز ۴ بامداد',
      brix: 17.0,
      sg: 1.068,
      tempCap: 24.5,
      tempRoom: 21.0,
      ph: 3.52,
      pigeageDone: true
    }
  ];
  const cmVel = calculateRecentLogVelocity(crossMidnightLogs);
  // 0.002 / (2 / 24) = 0.024 SG/day
  assert.equal(Math.round(cmVel.recentVelocityPerDay * 1000) / 1000, 0.024);

  // Lag phase guard: Day 0 -> Day 1 with minimal drop (1.092 -> 1.090) must NOT report 'stuck'
  const lagLogs: FermentationLogEntry[] = [
    {
      id: 'lag-0',
      tankId: 'tank-a',
      dayNumber: 0,
      dateTime: '۱۴۰۳/۰۷/۲۵ - ۱۰:۰۰',
      stageTitle: 'روز ۰',
      brix: 22.0,
      sg: 1.092,
      tempCap: 20.0,
      tempRoom: 20.0,
      ph: 3.52,
      pigeageDone: false
    },
    {
      id: 'lag-1',
      tankId: 'tank-a',
      dayNumber: 1,
      dateTime: '۱۴۰۳/۰۷/۲۶ - ۱۰:۰۰',
      stageTitle: 'روز ۱',
      brix: 21.8,
      sg: 1.090,
      tempCap: 21.0,
      tempRoom: 20.0,
      ph: 3.52,
      pigeageDone: true
    }
  ];
  const lagPred = predictFermentationCompletion(lagLogs, 'tank-a');
  assert.equal(lagPred.kineticStatus, 'normal');
  assert.ok(lagPred.kineticStatusFa.includes('فاز لَگ'));

  const pred = predictFermentationCompletion(sameDayLogs, 'tank-a');
  assert.ok(Number.isFinite(pred.effectiveVelocityPerDay) && pred.effectiveVelocityPerDay > 0);
  assert.ok(Number.isFinite(pred.estimatedRemainingDays));
});

test('calculateFermentationProgress: returns 0% at start and 100% at finish', () => {
  assert.equal(calculateFermentationProgress(1.092, 1.092, 0.993), 0);
  assert.equal(calculateFermentationProgress(0.993, 1.092, 0.993), 100);
  const halfSG = 1.092 - (1.092 - 0.993) / 2;
  assert.equal(calculateFermentationProgress(halfSG, 1.092, 0.993), 50);
});

test('calculateAlcoholByVolume: computes non-linear ABV for standard drops (Fix 8)', () => {
  // Non-linear high-gravity equation: 1.092 -> 0.993 is 13.8% ABV (vs 13.0% linear)
  const abv = calculateAlcoholByVolume(1.092, 0.993);
  assert.equal(abv, 13.8);

  // Partial drop: 1.092 -> 1.050 is 6.2% ABV
  const partial = calculateAlcoholByVolume(1.092, 1.050);
  assert.equal(partial, 6.2);
});

test('brixToSpecificGravity and specificGravityToBrix conversions', () => {
  const sg22 = brixToSpecificGravity(22.0);
  assert.ok(sg22 >= 1.090 && sg22 <= 1.094);

  const brixZero = specificGravityToBrix(0.993);
  assert.equal(brixZero, 0);

  const brixAtPressing = specificGravityToBrix(1.008);
  assert.ok(brixAtPressing >= 2.0 && brixAtPressing <= 3.0);
});

test('getCapTemperatureAlertLevel detects stage-aware danger thresholds (30.0C for Red, 19.5C for Rose, >24.0C for Finished Wine)', () => {
  assert.equal(getCapTemperatureAlertLevel(22.0), 'normal');
  assert.equal(getCapTemperatureAlertLevel(27.5), 'caution');
  assert.equal(getCapTemperatureAlertLevel(28.8), 'warning');
  assert.equal(getCapTemperatureAlertLevel(30.0), 'danger');
  assert.equal(getCapTemperatureAlertLevel(19.6, true, 1.060), 'danger');
  assert.equal(getCapTemperatureAlertLevel(25.0, false, 0.993), 'danger');
});

test('analyzeLogEntryHealth evaluates ideal parameters and prescribes 100% Organic Fermaid O at SNA-3 (Fix 2)', () => {
  const mockLog: FermentationLogEntry = {
    id: 'log-test-1',
    tankId: 'tank-a',
    dayNumber: 2,
    dateTime: '۱۴۰۳/۰۷/۲۶ - ۰۸:۰۰',
    stageTitle: 'روز ۲ - تریگر SNA-1 (SG=1.083)',
    brix: 20.2,
    sg: 1.083,
    tempCap: 23.5,
    tempRoom: 21.0,
    ph: 3.52,
    ta: 6.8,
    pigeageDone: true,
    pigeageCount: 4,
    operationNote: 'تزریق مکمل SNA-1',
    isTriggerPoint: true
  };

  const analysis = analyzeLogEntryHealth(mockLog, 'tank-a');
  assert.equal(analysis.isIdeal, true);
  assert.ok(analysis.healthScore >= 90);
  assert.ok(analysis.detailedDescription.length > 30);
  assert.ok(analysis.recommendedAction.includes('SNA-1'));
  // Includes Temp, pH, SG/Brix, and TA (since mockLog.ta = 6.8 is defined)
  assert.equal(analysis.parameters.length, 4);

  // Test SNA-3 at SG 1.057: must NOT recommend Fermaid K
  const sna3Log: FermentationLogEntry = {
    ...mockLog,
    id: 'log-test-sna3',
    dayNumber: 4,
    sg: 1.057,
    brix: 14.2,
    tempCap: 26.5
  };
  const sna3Analysis = analyzeLogEntryHealth(sna3Log, 'tank-a');
  assert.ok(!sna3Analysis.recommendedAction.includes('Fermaid K'), 'SNA-3 must not recommend Fermaid K');
  assert.ok(sna3Analysis.recommendedAction.includes('Fermaid O'), 'SNA-3 must recommend 100% organic Fermaid O');

  // Test finished wine (SG <= 0.995) stage-aware temperature & Free SO2 evaluation
  const finishedWarmLog: FermentationLogEntry = {
    ...mockLog,
    id: 'log-test-finished-warm',
    dayNumber: 12,
    sg: 0.993,
    brix: 0,
    tempCap: 24.5, // Too warm for finished wine (should be 14-16C)
    ta: 9.5, // High TA
    freeSO2: 15 // Low Free SO2 for pH 3.52
  };
  const finishedAnalysis = analyzeLogEntryHealth(finishedWarmLog, 'tank-a');
  assert.equal(finishedAnalysis.parameters.length, 5);
  assert.equal(finishedAnalysis.isIdeal, false);
  assert.ok(finishedAnalysis.healthScore < 65);
  assert.ok(finishedAnalysis.detailedDescription.includes('Clinitest'));

  // Test duplicate-dosing guard when SNA-1 is already recorded in additions history
  const recordedAdditions: ChemicalAddition[] = [
    {
      id: 'add-sna1',
      batchId: 'batch-rasha-1403',
      tankId: 'tank-a',
      timestamp: '۱۴۰۵/۰۷/۲۶ - ۰۷:۳۰',
      stageTitle: 'تریگر SNA-1 (SG=1.083)',
      compoundName: 'Fermaid O (SNA-1)',
      amount: 33,
      unit: 'g',
      purpose: 'تغذیه اول'
    }
  ];
  const dupGuardAnalysis = analyzeLogEntryHealth(mockLog, 'tank-a', recordedAdditions);
  assert.ok(dupGuardAnalysis.recommendedAction.includes('قبلاً در دفتر ثبت افزودنیهای این مخزن ثبت شده است'));

  // Test SNA-2 (1.070) vs 1/3 sugar break ceiling (1.062) distinction
  const sna2Analysis = analyzeLogEntryHealth({ ...mockLog, sg: 1.070 }, 'tank-a');
  assert.ok(sna2Analysis.parameters[0].note.includes('SNA-2'));
  const oneThirdAnalysis = analyzeLogEntryHealth({ ...mockLog, sg: 1.062 }, 'tank-a');
  assert.ok(oneThirdAnalysis.parameters[0].note.includes('۱/۳'));
});

test('compareRealLogsWithBenchmark handles empty, active, and catastrophic single-day spike logs (Fix 7)', () => {
  const benchmarkLogs: FermentationLogEntry[] = [
    {
      id: 'b-1',
      tankId: 'tank-a',
      dayNumber: 0,
      dateTime: '۱۴۰۳/۰۷/۲۵',
      stageTitle: 'روز ۰',
      brix: 22.0,
      sg: 1.092,
      tempCap: 20.0,
      tempRoom: 19.5,
      ph: 3.52,
      pigeageDone: true,
      isBenchmark: true
    },
    {
      id: 'b-2',
      tankId: 'tank-a',
      dayNumber: 2,
      dateTime: '۱۴۰۳/۰۷/۲۷',
      stageTitle: 'روز ۲',
      brix: 19.8,
      sg: 1.083,
      tempCap: 23.2,
      tempRoom: 21.0,
      ph: 3.52,
      pigeageDone: true,
      isBenchmark: true
    },
    {
      id: 'b-5',
      tankId: 'tank-a',
      dayNumber: 5,
      dateTime: '۱۴۰۳/۰۷/۳۰',
      stageTitle: 'روز ۵',
      brix: 9.5,
      sg: 1.035,
      tempCap: 26.0,
      tempRoom: 21.5,
      ph: 3.54,
      pigeageDone: true,
      isBenchmark: true
    }
  ];

  // Case 1: No real logs yet
  const emptyRes = compareRealLogsWithBenchmark([], benchmarkLogs, 'tank-a');
  assert.equal(emptyRes.hasRealLogs, false);
  assert.equal(emptyRes.alignmentScore, 0);
  assert.equal(emptyRes.statusBadge, 'منحنی الگوی مرجع ایده‌آل');

  // Case 2: Real logs present with minor deviation
  const realLogs: FermentationLogEntry[] = [
    {
      id: 'r-1',
      tankId: 'tank-a',
      dayNumber: 2,
      dateTime: '۱۴۰۳/۰۷/۲۷',
      stageTitle: 'روز ۲ کارگاه من',
      brix: 19.8,
      sg: 1.083,
      tempCap: 24.5, // 1.3 C higher
      tempRoom: 21.0,
      ph: 3.52,
      pigeageDone: true,
      isBenchmark: false
    }
  ];

  const realRes = compareRealLogsWithBenchmark(realLogs, benchmarkLogs, 'tank-a');
  assert.equal(realRes.hasRealLogs, true);
  assert.equal(realRes.tempDelta, 1.3);
  assert.equal(realRes.sgDelta, 0);
  assert.ok(realRes.alignmentScore > 80);

  // Case 3: Catastrophic single-day spike (35C on day 5) should pull alignmentScore down sharply via weighted max penalty
  const spikeLogs: FermentationLogEntry[] = [
    { ...benchmarkLogs[0], id: 's-0', isBenchmark: false },
    { ...benchmarkLogs[1], id: 's-2', isBenchmark: false },
    { ...benchmarkLogs[2], id: 's-5', isBenchmark: false, tempCap: 35.0 }
  ];
  const spikeRes = compareRealLogsWithBenchmark(spikeLogs, benchmarkLogs, 'tank-a');
  assert.ok(
    spikeRes.alignmentScore <= 40,
    `Expected weighted max penalty to drop alignmentScore <= 40 on catastrophic spike, got ${spikeRes.alignmentScore}`
  );
});

test('BUG-02, BUG-07, BUG-08, BUG-17, BUG-18, BUG-19, BUG-23, BUG-24, BUG-25, BUG-26: provenance SO2, DAP closed warning, planOverride, smooth 16C kinetic factor, post-press temp alert, 30-min velocity span, benchmark addition isolation, tank filter, and Brix/SG zero point', () => {
  // BUG-02: freeSO2Measured === false sets status = 'good', appends provenance note, and does not deduct score
  const unmeasuredSo2Log: FermentationLogEntry = {
    id: 'unmeas-so2',
    tankId: 'tank-a',
    dayNumber: 12,
    dateTime: '۱۴۰۵/۰۸/۰۶',
    stageTitle: 'شراب خشک',
    brix: 0,
    sg: 0.993,
    tempCap: 15.0,
    tempRoom: 15.0,
    ph: 3.52,
    freeSO2: 10, // Would normally deduct 24 points as 'danger' if measured today
    freeSO2Measured: false,
    pigeageDone: false
  };
  const unmeasAnalysis = analyzeLogEntryHealth(unmeasuredSo2Log, 'tank-a');
  const so2Param = unmeasAnalysis.parameters.find((p) => p.paramName.includes('Free SO2'));
  assert.equal(so2Param?.status, 'good');
  assert.ok(so2Param?.note.includes('انتقالی — امروز اندازهگیری نشده'));
  assert.equal(unmeasAnalysis.healthScore, 100);

  // BUG-07 & BUG-08: SG gap / closed DAP window warning when sg <= oneThirdCeiling and SNA-2 is not done, and planOverride in predictFermentationCompletion
  const highOgLog: FermentationLogEntry = {
    id: 'gap-dap',
    tankId: 'tank-a',
    dayNumber: 4,
    dateTime: '۱۴۰۵/۰۷/۲۹',
    stageTitle: 'روز ۴',
    brix: 15.0,
    sg: 1.060,
    tempCap: 24.0,
    tempRoom: 21.0,
    ph: 3.52,
    pigeageDone: true
  };
  const customHighOgPlan = predictFermentationCompletion([], 'tank-a', undefined, undefined, 1.110);
  assert.equal(customHighOgPlan.currentSG, 1.110);
  const gapAnalysis = analyzeLogEntryHealth(highOgLog, 'tank-a', [], {
    params: {} as never,
    scaleFactor: 1,
    volumes: { freeRunTotalL: 200, heavyPressTotalL: 28 } as never,
    triggers: {
      initialSG: 1.110,
      sna1: 1.099,
      sna2: 1.084,
      oneThirdCeiling: 1.074,
      phase2Tannin: 1.072,
      sna3: 1.068,
      pressingSG: 1.008,
      drynessSG: 0.993
    },
    dosages: {
      fermaidO1RedPerTankG: 33,
      fermaidK2RedPerTankG: 33,
      dap2RedPerTankG: 19.8,
      zincRedPerTankG: 0.26,
      redTanninPhase2PerTankG: 13.2,
      fermaidO3RedPerTankG: 39.6
    } as never,
    nitrogen: {} as never,
    dynamicMaterials: [],
    dynamicVolumeBalances: []
  });
  assert.ok(gapAnalysis.recommendedAction.includes('1.074'));
  assert.ok(gapAnalysis.recommendedAction.includes('Fermaid O'));

  // BUG-17: Smooth tempKineticFactor across 16.0C boundary (< 5% change between 15.99C and 16.01C)
  const sampleLogs: FermentationLogEntry[] = [
    {
      id: 'k-1',
      tankId: 'tank-a',
      dayNumber: 2,
      dateTime: '۱۴۰۵/۰۷/۲۷',
      stageTitle: 'روز ۲',
      brix: 18,
      sg: 1.075,
      tempCap: 16.0,
      tempRoom: 16.0,
      ph: 3.52,
      pigeageDone: true
    }
  ];
  const pred1599 = predictFermentationCompletion(sampleLogs, 'tank-a', 0.993, 15.99);
  const pred1601 = predictFermentationCompletion(sampleLogs, 'tank-a', 0.993, 16.01);
  const ratio16 = pred1599.tempKineticFactor / pred1601.tempKineticFactor;
  assert.ok(ratio16 >= 0.95 && ratio16 <= 1.05, `Expected smooth transition at 16C, got ratio ${ratio16}`);

  // BUG-18: Post-press liquid phase temperature alert (0.995 < SG <= 1.008)
  assert.equal(getCapTemperatureAlertLevel(17.5, false, 1.004), 'warning');
  assert.equal(getCapTemperatureAlertLevel(27.0, false, 1.004), 'warning');
  assert.equal(getCapTemperatureAlertLevel(21.5, false, 1.004), 'normal');
  assert.equal(getCapTemperatureAlertLevel(19.5, false, 1.004), 'caution');

  // BUG-19: 1-hour interval (0.0417 days >= 0.02 min span) is not clamped to 0.08 days
  const oneHourLogs: FermentationLogEntry[] = [
    {
      id: 'h1',
      tankId: 'tank-a',
      dayNumber: 2,
      dateTime: '۱۴۰۵/۰۷/۲۷ - ۱۰:۰۰',
      timestampMs: 1_000_000_000,
      stageTitle: 'ساعت ۱۰',
      brix: 20,
      sg: 1.080,
      tempCap: 24,
      tempRoom: 21,
      ph: 3.52,
      pigeageDone: true
    },
    {
      id: 'h2',
      tankId: 'tank-a',
      dayNumber: 2,
      dateTime: '۱۴۰۵/۰۷/۲۷ - ۱۱:۰۰',
      timestampMs: 1_000_000_000 + 3600 * 1000, // 1 hour later
      stageTitle: 'ساعت ۱۱',
      brix: 19.8,
      sg: 1.079, // 0.001 drop in 1 hour = 0.024 SG/day
      tempCap: 24,
      tempRoom: 21,
      ph: 3.52,
      pigeageDone: true
    }
  ];
  const oneHourVel = calculateRecentLogVelocity(oneHourLogs);
  assert.equal(Math.round(oneHourVel.recentVelocityPerDay * 1000) / 1000, 0.024);

  // BUG-23: Benchmark log ignores real recordedAdditions
  const benchSna1Log: FermentationLogEntry = {
    ...highOgLog,
    id: 'bench-sna1',
    dayNumber: 2,
    sg: 1.083,
    isBenchmark: true
  };
  const benchAnalysis = analyzeLogEntryHealth(benchSna1Log, 'tank-a', [
    {
      id: 'real-sna1',
      batchId: 'batch-rasha-1403',
      tankId: 'tank-a',
      timestamp: '۱۴۰۵/۰۷/۲۶',
      stageTitle: 'SNA-1',
      compoundName: 'Fermaid O (SNA-1)',
      amount: 33,
      unit: 'g',
      purpose: 'تغذیه اول'
    }
  ]);
  assert.ok(!benchAnalysis.recommendedAction.includes('قبلاً در دفتر ثبت افزودنیهای این مخزن ثبت شده است'));

  // BUG-24: calculateVelocity filters by tankId when provided
  const mixedTankLogs: FermentationLogEntry[] = [
    ...oneHourLogs,
    {
      ...oneHourLogs[1],
      id: 'tank-b-log',
      tankId: 'tank-b',
      timestampMs: 1_000_000_000 + 7200 * 1000,
      sg: 1.050
    }
  ];
  assert.equal(calculateVelocity(mixedTankLogs, 'tank-a'), 0.024);

  // BUG-25 & BUG-26: brixToSpecificGravity(0) === 1.000 and specificGravityToBrix(1.000) === 0
  assert.equal(brixToSpecificGravity(0), 1.000);
  assert.equal(specificGravityToBrix(1.000), 0);
  assert.equal(specificGravityToBrix(0.998), 0);

  // Micro-Task 1 Audit Fixes:
  // 1. Rosé-aware analyzeLogEntryHealth at SG 1.060 (no red Phase 2 tannin or seed removal instructions)
  const roseMidLog: FermentationLogEntry = {
    id: 'rose-mid',
    tankId: 'tank-rose',
    dayNumber: 4,
    dateTime: '۱۴۰۵/۰۷/۲۸',
    stageTitle: 'تخمیر سرد رُزه',
    brix: 14.8,
    sg: 1.060,
    tempCap: 15.0,
    tempRoom: 14.5,
    ph: 3.38,
    pigeageDone: false,
    isBenchmark: false
  };
  const roseHealth = analyzeLogEntryHealth(roseMidLog, 'tank-rose');
  assert.ok(roseHealth.detailedDescription.includes('رُزه'));
  assert.ok(!roseHealth.recommendedAction.includes('تانن قرمز فاز ۲'));

  // 2. Day-matched compareRealLogsWithBenchmark (Day 2 real log compares against Day 2 benchmark, not final Day 100 benchmark)
  const realDay2: FermentationLogEntry[] = [
    {
      id: 'real-d2',
      tankId: 'tank-a',
      dayNumber: 2,
      dateTime: '۱۴۰۵/۰۷/۲۶',
      stageTitle: 'روز ۲',
      brix: 20.0,
      sg: 1.080,
      tempCap: 24.0,
      tempRoom: 21.0,
      ph: 3.52,
      pigeageDone: true,
      isBenchmark: false
    }
  ];
  const benchMulti: FermentationLogEntry[] = [
    {
      id: 'bench-d2',
      tankId: 'tank-a',
      dayNumber: 2,
      dateTime: '۱۴۰۵/۰۷/۲۶',
      stageTitle: 'معیار روز ۲',
      brix: 20.4,
      sg: 1.082,
      tempCap: 24.0,
      tempRoom: 21.0,
      ph: 3.52,
      pigeageDone: true,
      isBenchmark: true
    },
    {
      id: 'bench-d100',
      tankId: 'tank-a',
      dayNumber: 100,
      dateTime: '۱۴۰۵/۱۱/۰۵',
      stageTitle: 'معیار روز ۱۰۰',
      brix: 0,
      sg: 0.992,
      tempCap: 12.0,
      tempRoom: 12.0,
      ph: 3.52,
      pigeageDone: false,
      isBenchmark: true
    }
  ];
  const dayComparison = compareRealLogsWithBenchmark(realDay2, benchMulti, 'tank-a');
  assert.equal(dayComparison.sgDelta, -0.002, 'Day 2 real SG 1.080 vs Day 2 benchmark SG 1.082 must yield -0.002');
});

test('analyzeLogEntryHealth: BUG-01 does not penalize score for unmeasured TA and notes unmeasured pH on Free SO2', () => {
  const unmeasuredTaPhLog: FermentationLogEntry = {
    id: 'bug01-log',
    tankId: 'tank-a',
    dayNumber: 3,
    dateTime: '۱۴۰۵/۰۷/۲۷',
    stageTitle: 'روز ۳',
    brix: 17.5,
    sg: 1.070,
    tempCap: 24.0,
    tempRoom: 21.0,
    ph: 3.75,
    phMeasured: false,
    ta: 8.8,
    taMeasured: false,
    freeSO2: 28,
    freeSO2Measured: true,
    pigeageDone: true,
    isBenchmark: false
  };

  const health = analyzeLogEntryHealth(unmeasuredTaPhLog, 'tank-a');
  assert.equal(health.healthScore, 100, 'Unmeasured TA (8.8) and unmeasured pH (3.75) must not penalize healthScore');

  const taParam = health.parameters.find((p) => p.paramName.includes('TA'));
  assert.ok(taParam, 'TA parameter must exist');
  assert.equal(taParam.status, 'good');
  assert.ok(taParam.note.includes('انتقالی — امروز اندازهگیری نشده'));

  const so2Param = health.parameters.find((p) => p.paramName.includes('Free SO2'));
  assert.ok(so2Param, 'Free SO2 parameter must exist');
  assert.ok(so2Param.note.includes('(بر مبنای pH هدف؛ pH واقعی امروز سنجش نشده)'));
});

test('Ideas 4 & 5: predictFermentationCompletion populates nextCriticalStation and detectQuickLogTypoShield catches SG transpositions and temp jumps', () => {
  // Idea 4a: Red tank-a at SG = 1.076 -> next station is sna-2-dap at 1.070
  const redLogs: FermentationLogEntry[] = [
    {
      id: 'r-0',
      tankId: 'tank-a',
      dayNumber: 1,
      dateTime: '۱۴۰۵/۰۷/۲۵',
      stageTitle: 'روز ۱',
      brix: 21.0,
      sg: 1.088,
      tempCap: 23.0,
      tempRoom: 21.0,
      ph: 3.52,
      pigeageDone: true
    },
    {
      id: 'r-1',
      tankId: 'tank-a',
      dayNumber: 2,
      dateTime: '۱۴۰۵/۰۷/۲۶',
      stageTitle: 'روز ۲',
      brix: 18.4,
      sg: 1.076,
      tempCap: 24.0,
      tempRoom: 21.0,
      ph: 3.52,
      pigeageDone: true
    }
  ];
  const redPred = predictFermentationCompletion(redLogs, 'tank-a');
  assert.ok(redPred.nextCriticalStation, 'Red tank at 1.076 must have nextCriticalStation');
  assert.equal(redPred.nextCriticalStation.id, 'sna-2-dap');
  assert.equal(redPred.nextCriticalStation.targetSG, 1.070);
  assert.equal(redPred.nextCriticalStation.sgDeltaRemaining, 0.006);
  assert.ok(redPred.nextCriticalStation.estimatedHours >= 1);

  // Idea 4b: Rosé tank-rose at SG = 1.061 -> skips phase2-tannin and targets sna-3-organic at 1.057
  const roseLogs: FermentationLogEntry[] = [
    {
      id: 'rs-0',
      tankId: 'tank-rose',
      dayNumber: 2,
      dateTime: '۱۴۰۵/۰۷/۲۶',
      stageTitle: 'روز ۲',
      brix: 17.5,
      sg: 1.072,
      tempCap: 16.5,
      tempRoom: 16.0,
      ph: 3.32,
      pigeageDone: false
    },
    {
      id: 'rs-1',
      tankId: 'tank-rose',
      dayNumber: 3,
      dateTime: '۱۴۰۵/۰۷/۲۷',
      stageTitle: 'روز ۳',
      brix: 15.0,
      sg: 1.061,
      tempCap: 17.0,
      tempRoom: 16.0,
      ph: 3.32,
      pigeageDone: false
    }
  ];
  const rosePred = predictFermentationCompletion(roseLogs, 'tank-rose');
  assert.ok(rosePred.nextCriticalStation, 'Rosé tank at 1.061 must have nextCriticalStation');
  assert.equal(rosePred.nextCriticalStation.id, 'sna-3-organic');
  assert.equal(rosePred.nextCriticalStation.targetSG, 1.057);

  // Idea 5a: Digit transposition upward jump (1.080 typed when previousSG = 1.018 -> suggests 1.008)
  const jumpTypo = detectQuickLogTypoShield({
    measuredSG: 1.080,
    trueSG: 1.080,
    previousSG: 1.018,
    daysElapsed: 1
  });
  assert.ok(jumpTypo, 'Must detect upward SG jump typo');
  assert.equal(jumpTypo.field, 'sg');
  assert.equal(jumpTypo.suggestedValue, 1.008);

  // Idea 5b: Extreme 1-day drop transposition (1.008 typed when previousSG = 1.088 -> suggests 1.080)
  const plungeTypo = detectQuickLogTypoShield({
    measuredSG: 1.008,
    trueSG: 1.008,
    previousSG: 1.088,
    daysElapsed: 1
  });
  assert.ok(plungeTypo, 'Must detect extreme 1-day SG plunge typo');
  assert.equal(plungeTypo.field, 'sg');
  assert.equal(plungeTypo.suggestedValue, 1.080);

  // Idea 5c: Temperature jump (34C when previousTempCap = 24C -> suggests 24C)
  const tempTypo = detectQuickLogTypoShield({
    measuredSG: 1.060,
    trueSG: 1.060,
    previousSG: 1.070,
    previousTempCap: 24,
    tempCap: 34,
    daysElapsed: 1
  });
  assert.ok(tempTypo, 'Must detect cap temperature jump typo');
  assert.equal(tempTypo.field, 'tempCap');
  assert.equal(tempTypo.suggestedValue, 24);
});

test('Idea 1: computeVesselTwinState computes stage-aware liquid volume, pomace cap, color stage, and CO2 bubble kinetics', () => {
  // 1. Active red fermentation (SG = 1.065 on tank-a)
  const activeRedLogs: FermentationLogEntry[] = [
    {
      id: 'vt-red-1',
      tankId: 'tank-a',
      dayNumber: 1,
      dateTime: '۱۴۰۵/۰۷/۲۵',
      stageTitle: 'روز ۱',
      brix: 21.0,
      sg: 1.088,
      tempCap: 23.0,
      tempRoom: 21.0,
      ph: 3.52,
      pigeageDone: true
    },
    {
      id: 'vt-red-2',
      tankId: 'tank-a',
      dayNumber: 3,
      dateTime: '۱۴۰۵/۰۷/۲۷',
      stageTitle: 'روز ۳',
      brix: 15.8,
      sg: 1.065,
      tempCap: 25.0,
      tempRoom: 21.5,
      ph: 3.52,
      pigeageDone: true
    }
  ];
  const activeRedTwin = computeVesselTwinState({
    tankId: 'tank-a',
    logs: activeRedLogs
  });
  assert.equal(activeRedTwin.hasPomaceCap, true);
  assert.equal(activeRedTwin.currentLiquidVolumeL, 132);
  assert.ok(activeRedTwin.bubbleCount > 0);
  assert.equal(activeRedTwin.liquidColorHex, '#6E1F2F');

  // 2. Post-pressing dry red wine (SG = 0.992, dayNumber = 12 on tank-a)
  const dryRedLogs: FermentationLogEntry[] = [
    ...activeRedLogs,
    {
      id: 'vt-red-dry',
      tankId: 'tank-a',
      dayNumber: 12,
      dateTime: '۱۴۰۵/۰۸/۰۶',
      stageTitle: 'روز ۱۲',
      brix: 0,
      sg: 0.992,
      tempCap: 15.5,
      tempRoom: 15.0,
      ph: 3.52,
      pigeageDone: false
    }
  ];
  const dryRedTwin = computeVesselTwinState({
    tankId: 'tank-a',
    logs: dryRedLogs
  });
  assert.equal(dryRedTwin.hasPomaceCap, false);
  assert.equal(dryRedTwin.currentLiquidVolumeL, 96);
  assert.equal(dryRedTwin.bubbleCount, 0);

  // 3. Rosé tank (tank-rose)
  const roseLogs: FermentationLogEntry[] = [
    {
      id: 'vt-rose-1',
      tankId: 'tank-rose',
      dayNumber: 4,
      dateTime: '۱۴۰۵/۰۷/۲۸',
      stageTitle: 'روز ۴',
      brix: 12.0,
      sg: 1.048,
      tempCap: 16.5,
      tempRoom: 16.0,
      ph: 3.32,
      pigeageDone: false
    }
  ];
  const roseTwin = computeVesselTwinState({
    tankId: 'tank-rose',
    logs: roseLogs
  });
  assert.equal(roseTwin.hasPomaceCap, false);
  assert.ok(
    roseTwin.liquidColorHex === '#D96B52' ||
      roseTwin.liquidColorHex === '#E88D72'
  );
});

test('Idea 3: getGlobalActiveTimersSnapshot returns empty array when idle and formats MM:SS / HH:MM:SS and completion state', () => {
  // 1. Empty when no timers are marked running
  const idleTimers = getGlobalActiveTimersSnapshot({
    runningMap: { 'timer-so2-pectinase': false },
    elapsedMap: { 'timer-so2-pectinase': 120 }
  });
  assert.equal(idleTimers.length, 0);

  // 2. Running countdown timers with MM:SS, HH:MM:SS, and completed state
  const activeSnapshot = getGlobalActiveTimersSnapshot({
    runningMap: {
      'timer-so2-pectinase': true, // default 15 min (900 sec)
      'timer-rose-maceration': true, // default 180 min (10800 sec)
      'timer-yeast-goferm': true // default 20 min (1200 sec)
    },
    elapsedMap: {
      'timer-so2-pectinase': 300, // 600 sec remaining -> 10:00
      'timer-rose-maceration': 3600, // 7200 sec remaining -> 02:00:00
      'timer-yeast-goferm': 1250 // >= 1200 sec -> 0 remaining, isCompletedCountdown = true
    }
  });
  assert.equal(activeTimersLength(activeSnapshot), 3);
  // Completed countdown sorts first
  assert.equal(activeSnapshot[0].id, 'timer-yeast-goferm');
  assert.equal(activeSnapshot[0].remainingSec, 0);
  assert.equal(activeSnapshot[0].formattedTime, '00:00');
  assert.equal(activeSnapshot[0].isCompletedCountdown, true);

  // Next is lowest remainingSec ('timer-so2-pectinase' with 600s -> '10:00')
  assert.equal(activeSnapshot[1].id, 'timer-so2-pectinase');
  assert.equal(activeSnapshot[1].remainingSec, 600);
  assert.equal(activeSnapshot[1].formattedTime, '10:00');
  assert.equal(activeSnapshot[1].isCompletedCountdown, false);

  // Next is 'timer-rose-maceration' with 7200s -> '02:00:00'
  assert.equal(activeSnapshot[2].id, 'timer-rose-maceration');
  assert.equal(activeSnapshot[2].remainingSec, 7200);
  assert.equal(activeSnapshot[2].formattedTime, '02:00:00');
  assert.equal(activeSnapshot[2].isCompletedCountdown, false);
});

function activeTimersLength(arr: unknown[]): number {
  return arr.length;
}

test('computeSensoryRadarPolygonPoints: computes 5 vertices clamped to [1, 5] and valid SVG polygonPoints string (Idea 6)', () => {
  const res = computeSensoryRadarPolygonPoints(
    {
      aroma: 5,
      acidity: 4,
      tannin: 6, // clamps to 5
      body: 0, // clamps to 1
      balance: 4
    },
    100,
    100,
    50
  );

  assert.equal(res.vertices.length, 5);
  // Top vertex (-90 deg) with score 5 -> x = 100, y = 50
  assert.equal(res.vertices[0].axisKey, 'aroma');
  assert.equal(res.vertices[0].score, 5);
  assert.equal(res.vertices[0].x, 100);
  assert.equal(res.vertices[0].y, 50);

  // Clamped tannin = 5, clamped body = 1
  assert.equal(res.vertices[2].score, 5);
  assert.equal(res.vertices[3].score, 1);
  assert.equal(res.polygonPoints.split(' ').length, 5);
});

test('buildVintagePassportSummary: computes ABV, bottle yield (124 for Tank 1, 40 for Rosé), oak profile, and color swatch (Idea 7)', () => {
  const logs: FermentationLogEntry[] = [
    {
      id: 'vp-1',
      tankId: 'tank-a',
      dateTime: '1405-07-01',
      stageTitle: 'روز ۱',
      dayNumber: 1,
      sg: 1.092,
      brix: 22.0,
      tempCap: 23,
      tempRoom: 20,
      ph: 3.55,
      ta: 6.6,
      pigeageDone: true,
      isBenchmark: false
    },
    {
      id: 'vp-2',
      tankId: 'tank-a',
      dateTime: '1405-07-10',
      stageTitle: 'روز ۱۰',
      dayNumber: 10,
      sg: 0.994,
      brix: -1.5,
      tempCap: 21,
      tempRoom: 19,
      ph: 3.51,
      ta: 6.7,
      pigeageDone: false,
      isBenchmark: false
    }
  ];

  const additions: ChemicalAddition[] = [
    {
      id: 'add-oak-1',
      tankId: 'tank-a',
      dayNumber: 25,
      compoundName: 'چیپس بلوط فرانسوی'
    } as unknown as ChemicalAddition
  ];

  const redPassport = buildVintagePassportSummary({
    tankId: 'tank-1',
    batchNameFa: 'رشه سردشت ۱۴۰۵',
    vintageYear: 1405,
    logs,
    additions,
    totalSo2AddedMgL: 105,
    avgScoreOutOf5: '4.6 / 5',
    wineColorHex: '#6E1E1E',
    wineColorLabelFa: 'لعل (Garnet — بلوغ با بلوط)'
  });

  assert.equal(redPassport.initialSG, '1.092');
  assert.equal(redPassport.finalSG, '0.994');
  assert.equal(redPassport.bottles750mlCount, 124);
  assert.equal(redPassport.oakProfileFa, 'بلوط فرانسوی مدیوم‌تُست (۱.۲ g/L)');
  assert.equal(redPassport.wineColorHex, '#6E1E1E');

  const rosePassport = buildVintagePassportSummary({
    tankId: 'tank-rose',
    logs: [],
    additions: [],
    totalSo2AddedMgL: 95,
    avgScoreOutOf5: '4.4 / 5'
  });

  assert.equal(rosePassport.bottles750mlCount, 40);
  assert.equal(rosePassport.oakProfileFa, 'بدون بلوط (Unoaked Rosé)');
  assert.equal(rosePassport.wineColorHex, '#B8293D');
});
