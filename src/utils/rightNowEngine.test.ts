import test from 'node:test';
import assert from 'node:assert/strict';
import {
  evaluateRightNowQueue,
  evaluateDeadlineCountdowns,
  evaluateBottlingReadinessGate
} from './rightNowEngine.ts';
import { INITIAL_TRACKING_DATA } from '../data/seedTrackingData.ts';
import {
  computeDynamicProtocolPlan,
  IDEAL_DEFAULT_PROTOCOL_PARAMS
} from '../data/masterProtocolConfig.ts';
import type {
  ChemicalAddition,
  FermentationLogEntry,
  LabAnalysisRecord
} from '../types/index.ts';

test('evaluateRightNowQueue: detects threshold-crossing missed SNA-1 when SG jumps from 1.092 to 1.078', () => {
  const logs: FermentationLogEntry[] = [
    {
      id: 'log-0',
      tankId: 'tank-a',
      dayNumber: 0,
      dateTime: '۱۴۰۵/۰۷/۲۴ - ۰۸:۰۰',
      timestampMs: 1000,
      stageTitle: 'شروع',
      brix: 22.0,
      sg: 1.092,
      tempCap: 21.0,
      tempRoom: 20.0,
      ph: 3.52,
      pigeageDone: false,
      isBenchmark: false
    },
    {
      id: 'log-2',
      tankId: 'tank-a',
      dayNumber: 2,
      dateTime: '۱۴۰۵/۰۷/۲۶ - ۰۸:۰۰',
      timestampMs: 173800000,
      stageTitle: 'روز ۲',
      brix: 19.0,
      sg: 1.078, // Jumped past 1.083 without logging at 1.083
      tempCap: 24.5,
      tempRoom: 21.0,
      ph: 3.51,
      pigeageDone: true,
      isBenchmark: false
    }
  ];

  const queue = evaluateRightNowQueue({
    logs,
    additions: [],
    activeTankId: 'tank-a',
    completedRoadmapStepIds: [5, 6, 7, 8, 9, 13, 14]
  });

  const sna1 = queue.allMilestones.find((m) => m.id === 'sna-1');
  assert.ok(sna1, 'sna-1 milestone must exist');
  assert.equal(sna1.state, 'missed');
  assert.equal(sna1.canMarkDone, true);
  assert.equal(queue.primaryAction?.id, 'sna-1');
});

test('evaluateRightNowQueue: locks sna-2-dap as closed (canMarkDone: false) when SG drops below 1.062 ceiling', () => {
  const logs: FermentationLogEntry[] = [
    {
      id: 'log-0',
      tankId: 'tank-a',
      dayNumber: 0,
      dateTime: '۱۴۰۵/۰۷/۲۴ - ۰۸:۰۰',
      stageTitle: 'شروع',
      brix: 22.0,
      sg: 1.092,
      tempCap: 21.0,
      tempRoom: 20.0,
      ph: 3.52,
      pigeageDone: false,
      isBenchmark: false
    },
    {
      id: 'log-4',
      tankId: 'tank-a',
      dayNumber: 4,
      dateTime: '۱۴۰۵/۰۷/۲۸ - ۰۸:۰۰',
      stageTitle: 'روز ۴',
      brix: 15.0,
      sg: 1.060, // Below 1.062 1/3 sugar ceiling!
      tempCap: 26.0,
      tempRoom: 21.0,
      ph: 3.50,
      pigeageDone: true,
      isBenchmark: false
    }
  ];

  const queue = evaluateRightNowQueue({
    logs,
    additions: [],
    activeTankId: 'tank-a'
  });

  const sna2 = queue.allMilestones.find((m) => m.id === 'sna-2-dap');
  assert.ok(sna2, 'sna-2-dap milestone must exist');
  assert.equal(sna2.state, 'closed');
  assert.equal(sna2.canMarkDone, false);
  assert.ok(sna2.closedReasonFa?.includes('پنجرهٔ DAP بسته شد'));
});

test('evaluateRightNowQueue: detects SG anomaly when currentSG > previousSG + 0.002 and separates bactiless + kms in day11', () => {
  const logs: FermentationLogEntry[] = [
    {
      id: 'log-1',
      tankId: 'tank-a',
      dayNumber: 2,
      dateTime: '۱۴۰۵/۰۷/۲۶ - ۰۸:۰۰',
      stageTitle: 'روز ۲',
      brix: 18.0,
      sg: 1.072,
      tempCap: 25.0,
      tempRoom: 21.0,
      ph: 3.52,
      pigeageDone: true,
      isBenchmark: false
    },
    {
      id: 'log-2',
      tankId: 'tank-a',
      dayNumber: 3,
      dateTime: '۱۴۰۵/۰۷/۲۷ - ۰۸:۰۰',
      stageTitle: 'روز ۳',
      brix: 19.5,
      sg: 1.080, // Anomaly: SG rose by +0.008!
      tempCap: 25.0,
      tempRoom: 21.0,
      ph: 3.52,
      pigeageDone: true,
      isBenchmark: false
    }
  ];

  const queue = evaluateRightNowQueue({ logs, additions: [], activeTankId: 'tank-a' });
  assert.ok(queue.sgAnomaly, 'Must detect SG rise anomaly');
  assert.equal(queue.sgAnomaly.hasAnomaly, true);
  assert.equal(queue.sgAnomaly.previousSG, 1.072);
  assert.equal(queue.sgAnomaly.currentSG, 1.080);

  const day11 = queue.allMilestones.find((m) => m.id === 'day11-bactiless-kms-lock');
  assert.ok(day11);
  const tankARow = day11.tankRows.find((r) => r.tankId === 'tank-a');
  assert.ok(tankARow);
  assert.equal(tankARow.additionsToRecord.length, 2);
  assert.equal(tankARow.additionsToRecord[0].compoundType, 'bactiless');
  assert.equal(tankARow.additionsToRecord[1].compoundType, 'kms');
});

test('evaluateDeadlineCountdowns: emits critical post_dryness_so2 alert when SG <= 0.995 without post-ferm KMS', () => {
  const dryLogs: FermentationLogEntry[] = [
    {
      id: 'log-dry',
      tankId: 'tank-a',
      dayNumber: 10,
      dateTime: '۱۴۰۵/۰۸/۰۴ - ۰۸:۰۰',
      stageTitle: 'خشکی کامل',
      brix: 0,
      sg: 0.993,
      tempCap: 20.0,
      tempRoom: 18.0,
      ph: 3.52,
      pigeageDone: false,
      isBenchmark: false
    }
  ];

  const countdowns = evaluateDeadlineCountdowns({
    logs: dryLogs,
    additions: [],
    tankId: 'tank-a'
  });

  const postDryAlert = countdowns.find((c) => c.id === 'post_dryness_so2');
  assert.ok(postDryAlert, 'Must emit post_dryness_so2 alert when wine is dry without KMS');
  assert.equal(postDryAlert.color, 'rose');
  assert.equal(postDryAlert.urgencyLevel, 'critical');
});

test('evaluateBottlingReadinessGate: blocks when < 3 dry logs or < 7 days span, and unlocks when all 4 blocking items pass or riskOverrideReason is provided', () => {
  const nowMs = Date.now();
  const shortDryLogs: FermentationLogEntry[] = [
    {
      id: 'd1',
      tankId: 'tank-a',
      dayNumber: 10,
      dateTime: '۱۴۰۵/۰۸/۰۴',
      timestampMs: nowMs - 48 * 3600 * 1000,
      stageTitle: 'روز ۱۰',
      brix: 0,
      sg: 0.993,
      tempCap: 16,
      tempRoom: 15,
      ph: 3.50,
      freeSO2: 40,
      pigeageDone: false,
      isBenchmark: false
    },
    {
      id: 'd2',
      tankId: 'tank-a',
      dayNumber: 12,
      dateTime: '۱۴۰۵/۰۸/۰۶',
      timestampMs: nowMs - 2 * 3600 * 1000,
      stageTitle: 'روز ۱۲',
      brix: 0,
      sg: 0.993,
      tempCap: 16,
      tempRoom: 15,
      ph: 3.50,
      freeSO2: 40,
      pigeageDone: false,
      isBenchmark: false
    }
  ];

  const blockedGate = evaluateBottlingReadinessGate({
    logs: shortDryLogs,
    additions: [],
    labAnalyses: [],
    tankId: 'tank-a',
    nowMs
  });
  assert.equal(blockedGate.allBlockingPassed, false);
  assert.equal(blockedGate.canStartBottling, false);

  // Unlock via riskOverrideReason
  const overriddenGate = evaluateBottlingReadinessGate({
    logs: shortDryLogs,
    additions: [],
    labAnalyses: [],
    tankId: 'tank-a',
    riskOverrideReason: 'بطری‌گذاری آزمایشی با مسئولیت شخصی',
    nowMs
  });
  assert.equal(overriddenGate.allBlockingPassed, false);
  assert.equal(overriddenGate.canStartBottling, true);

  // Unlock by satisfying all 4 blocking checks (3 consecutive dry logs over >= 7 days, recent SO2, Bactiless lock, clarity confirmed)
  const stableDryLogs: FermentationLogEntry[] = [
    ...shortDryLogs,
    {
      id: 'd3',
      tankId: 'tank-a',
      dayNumber: 18, // 18 - 10 = 8 days span (>= 7 days)
      dateTime: '۱۴۰۵/۰۸/۱۲',
      timestampMs: nowMs - 1 * 3600 * 1000,
      stageTitle: 'روز ۱۸',
      brix: 0,
      sg: 0.993,
      tempCap: 15,
      tempRoom: 15,
      ph: 3.50,
      freeSO2: 40,
      pigeageDone: false,
      isBenchmark: false
    }
  ];
  const additions: ChemicalAddition[] = [
    {
      id: 'bact-1',
      batchId: 'batch-rasha-1403',
      tankId: 'tank-a',
      timestamp: '۱۴۰۵/۰۸/۰۵',
      stageTitle: 'روز ۱۱',
      compoundName: 'Bactiless',
      compoundType: 'bactiless',
      amount: 28.8,
      unit: 'g',
      purpose: 'قفل مالولاکتیک'
    }
  ];
  const analyses: LabAnalysisRecord[] = [];

  const passedGate = evaluateBottlingReadinessGate({
    logs: stableDryLogs,
    additions,
    labAnalyses: analyses,
    tankId: 'tank-a',
    manualConfirmations: { clarityConfirmed: true },
    nowMs
  });
  assert.equal(passedGate.allBlockingPassed, true);
  assert.equal(passedGate.canStartBottling, true);
});

test('Part 4 Audit Remediation: No Demo Leakage in Bottling Gate, Deterministic Milestone Matching, Dynamic Dosage Scaling, and Latest Ripper & Bactiless+SO2 Synergy', () => {
  // 1. No Demo Leakage in Bottling Gate
  const demoGate = evaluateBottlingReadinessGate({
    logs: INITIAL_TRACKING_DATA,
    additions: [],
    labAnalyses: [],
    tankId: 'tank-a',
    manualConfirmations: { clarityConfirmed: true }
  });
  const drynessItem = demoGate.blockingItems.find((i) => i.id === 'dryness_stability');
  assert.ok(drynessItem);
  assert.equal(drynessItem.status, 'blocked_red', 'Demo/benchmark logs must not pass dryness_stability');
  assert.equal(demoGate.allBlockingPassed, false);

  // 2. Deterministic Milestone Matching (Phase 1 tannin does not mark phase2-tannin; "0.25 g/L" does not mark crush-kms)
  const realLogs: FermentationLogEntry[] = [
    {
      id: 'r-0',
      tankId: 'tank-a',
      dayNumber: 0,
      dateTime: '۱۴۰۵/۰۷/۲۴ - ۱۰:۰۰',
      stageTitle: 'شروع',
      brix: 22.0,
      sg: 1.092,
      tempCap: 21,
      tempRoom: 20,
      ph: 3.52,
      pigeageDone: false,
      isBenchmark: false,
      isDemo: false
    }
  ];
  const trickyAdditions: ChemicalAddition[] = [
    {
      id: 'add-p1-tannin',
      batchId: 'batch-rasha-1403',
      tankId: 'tank-a',
      timestamp: '۱۴۰۵/۰۷/۲۴ - ۱۱:۰۰',
      stageTitle: 'روز ۰ - تانن فاز ۱',
      compoundName: 'تانن قرمز',
      compoundType: 'tannin_red',
      sgAtAddition: 1.092,
      amount: 13.2,
      unit: 'g',
      purpose: 'افزودن 0.25 g/L مخمر و تانن فاز ۱',
      isDemo: false
    }
  ];
  const queueTricky = evaluateRightNowQueue({
    logs: realLogs,
    additions: trickyAdditions,
    activeTankId: 'tank-a'
  });
  const phase2Tannin = queueTricky.allMilestones.find((m) => m.id === 'phase2-tannin');
  const crushKms = queueTricky.allMilestones.find((m) => m.id === 'crush-kms');
  assert.ok(phase2Tannin && crushKms);
  assert.notEqual(phase2Tannin.state, 'completed', 'Phase 1 red tannin must NOT mark phase2-tannin as completed');
  assert.notEqual(crushKms.state, 'completed', '"0.25 g/L" in purpose must NOT mark crush-kms as completed');

  // 3. Dynamic Dosage Scaling for 100kg plan (1/4 of 400kg) + single tank support
  const plan100 = computeDynamicProtocolPlan({
    ...IDEAL_DEFAULT_PROTOCOL_PARAMS,
    grapeWeightKg: 100
  });
  const queue100 = evaluateRightNowQueue({
    logs: realLogs,
    additions: [],
    activeTankId: 'tank-a',
    plan: plan100,
    batch: {
      id: 'batch-100kg',
      name: 'بچ ۱۰۰ کیلویی',
      grapeVariety: 'رشه',
      vintageYear: 1405,
      initialWeightKg: 100,
      targetStyle: 'red',
      status: 'active_fermentation',
      startDate: '۱۴۰۵/۰۷/۲۴',
      notes: '',
      tankCount: 1,
      isDemo: false
    }
  });
  const sna2_100 = queue100.allMilestones.find((m) => m.id === 'sna-2-dap');
  const coldStab_100 = queue100.allMilestones.find((m) => m.id === 'day65-cold-stab');
  const bottling_100 = queue100.allMilestones.find((m) => m.id === 'day100-bottling');
  assert.ok(sna2_100 && coldStab_100 && bottling_100);
  assert.equal(sna2_100.tankRows.length, 1, 'Single-tank batch should only generate 1 red tank row');
  const dapAdd100 = sna2_100.tankRows[0].additionsToRecord.find((a) => a.compoundType === 'dap');
  const khtAdd100 = coldStab_100.tankRows[0].additionsToRecord.find((a) => a.compoundType === 'kht');
  const preBottleKms100 = bottling_100.tankRows[0].additionsToRecord.find((a) => a.compoundType === 'kms');
  assert.ok(dapAdd100 && khtAdd100 && preBottleKms100);
  assert.equal(dapAdd100.amount, plan100.dosages.dap2RedPerTankG);
  assert.ok(dapAdd100.amount < 10, '100kg DAP dose must scale down to ~4.95g, not fallback 19.8g');
  assert.equal(khtAdd100.amount, plan100.dosages.khtColdStabRedPerTankG);
  assert.ok(khtAdd100.amount < 10, '100kg KHT dose must scale down to ~4.65g, not fallback 18.6g');
  assert.equal(preBottleKms100.amount, plan100.dosages.preBottlingKmsPerTankG);
  assert.ok(preBottleKms100.amount < 1.5, '100kg pre-bottling KMS must scale down, not fallback 2.45g');
  assert.equal(dapAdd100.milestoneId, 'sna-2-dap');
  assert.equal(dapAdd100.batchId, 'batch-100kg');

  // 4. Latest Ripper Selection & Bactiless + SO2 Synergy
  const nowMs = 5000;
  const threeDryRealLogs: FermentationLogEntry[] = [
    {
      id: 'dl-1',
      tankId: 'tank-a',
      dayNumber: 10,
      dateTime: '۱۴۰۵/۰۸/۰۴',
      timestampMs: 1000,
      stageTitle: 'خشک ۱',
      brix: 0,
      sg: 0.993,
      tempCap: 16,
      tempRoom: 15,
      ph: 3.50,
      pigeageDone: false,
      isBenchmark: false
    },
    {
      id: 'dl-2',
      tankId: 'tank-a',
      dayNumber: 14,
      dateTime: '۱۴۰۵/۰۸/۰۸',
      timestampMs: 1500,
      stageTitle: 'خشک ۲',
      brix: 0,
      sg: 0.993,
      tempCap: 16,
      tempRoom: 15,
      ph: 3.50,
      pigeageDone: false,
      isBenchmark: false
    },
    {
      id: 'dl-3',
      tankId: 'tank-a',
      dayNumber: 18,
      dateTime: '۱۴۰۵/۰۸/۱۲',
      timestampMs: 2000,
      stageTitle: 'خشک ۳',
      brix: 0,
      sg: 0.993,
      tempCap: 16,
      tempRoom: 15,
      ph: 3.50,
      pigeageDone: false,
      isBenchmark: false
    }
  ];
  const bactilessOnlyAdd: ChemicalAddition[] = [
    {
      id: 'bact-only',
      batchId: 'batch-rasha-1403',
      tankId: 'tank-a',
      timestamp: '۱۴۰۵/۰۸/۰۵',
      stageTitle: 'روز ۱۱',
      compoundName: 'Bactiless',
      compoundType: 'bactiless',
      amount: 28.8,
      unit: 'g',
      purpose: 'قفل مالولاکتیک',
      isDemo: false
    }
  ];

  // Without adequate Free SO2 (only old 15 mg/L ripper), both free_so2_target AND malic_mlf_stability must fail
  const gateLowSO2 = evaluateBottlingReadinessGate({
    logs: threeDryRealLogs,
    additions: bactilessOnlyAdd,
    labAnalyses: [
      {
        id: 'rip-old',
        batchId: 'batch-rasha-1403',
        tankId: 'tank-a',
        date: '۱۴۰۵/۰۸/۰۵',
        timestampMs: 1000,
        testType: 'ripper_so2',
        targetAnalyte: 'Free SO2',
        measuredValue: 15,
        unit: 'mg/L',
        actionTaken: ''
      }
    ],
    tankId: 'tank-a',
    manualConfirmations: { clarityConfirmed: true },
    nowMs
  });
  const malicLowSO2 = gateLowSO2.blockingItems.find((i) => i.id === 'malic_mlf_stability');
  assert.ok(malicLowSO2);
  assert.equal(malicLowSO2.status, 'blocked_red', 'Bactiless without adequate Free SO2 must NOT pass malic_mlf_stability');

  // With a newer Ripper record (timestampMs: 2000, 38 mg/L) Listed AFTER the old one, it must pick 38 mg/L and pass both SO2 and conditional Bactiless malic check
  const gateNewerRipper = evaluateBottlingReadinessGate({
    logs: threeDryRealLogs,
    additions: bactilessOnlyAdd,
    labAnalyses: [
      {
        id: 'rip-old',
        batchId: 'batch-rasha-1403',
        tankId: 'tank-a',
        date: '۱۴۰۵/۰۸/۰۵',
        timestampMs: 1000,
        testType: 'ripper_so2',
        targetAnalyte: 'Free SO2',
        measuredValue: 15,
        unit: 'mg/L',
        actionTaken: ''
      },
      {
        id: 'rip-new',
        batchId: 'batch-rasha-1403',
        tankId: 'tank-a',
        date: '۱۴۰۵/۰۸/۱۲',
        timestampMs: 2000,
        testType: 'ripper_so2',
        targetAnalyte: 'Free SO2',
        measuredValue: 38,
        unit: 'mg/L',
        actionTaken: ''
      }
    ],
    tankId: 'tank-a',
    manualConfirmations: { clarityConfirmed: true, clinitestPassed: true },
    nowMs
  });
  const so2ItemNew = gateNewerRipper.blockingItems.find((i) => i.id === 'free_so2_target');
  const malicItemNew = gateNewerRipper.blockingItems.find((i) => i.id === 'malic_mlf_stability');
  assert.ok(so2ItemNew && malicItemNew);
  assert.equal(so2ItemNew.status, 'passed', 'Must select chronologically latest Ripper record (38 mg/L)');
  assert.equal(malicItemNew.status, 'passed', 'Bactiless + adequate Free SO2 at pH 3.50 must pass malic_mlf_stability');
  assert.ok(malicItemNew.detailFa.includes('تایید مشروط (پروتکل No-MLF)'));
  assert.equal(gateNewerRipper.allBlockingPassed, true);

  // 5. Conservative so2AgeHours fallback when old log has freeSO2: 42 WITHOUT timestampMs
  const oldImportedLogsWithoutTimestamp: FermentationLogEntry[] = [
    {
      id: 'imp-1',
      tankId: 'tank-a',
      dayNumber: 10,
      dateTime: '۱۴۰۳/۰۸/۰۱',
      stageTitle: 'خشک ۱',
      brix: 0,
      sg: 0.993,
      tempCap: 16,
      tempRoom: 15,
      ph: 3.50,
      freeSO2: 42,
      pigeageDone: false,
      isBenchmark: false
    },
    {
      id: 'imp-2',
      tankId: 'tank-a',
      dayNumber: 14,
      dateTime: '۱۴۰۳/۰۸/۰۵',
      stageTitle: 'خشک ۲',
      brix: 0,
      sg: 0.993,
      tempCap: 16,
      tempRoom: 15,
      ph: 3.50,
      freeSO2: 42,
      pigeageDone: false,
      isBenchmark: false
    },
    {
      id: 'imp-3',
      tankId: 'tank-a',
      dayNumber: 18,
      dateTime: '۱۴۰۳/۰۸/۰۹',
      stageTitle: 'خشک ۳',
      brix: 0,
      sg: 0.993,
      tempCap: 16,
      tempRoom: 15,
      ph: 3.50,
      freeSO2: 42,
      pigeageDone: false,
      isBenchmark: false
    }
  ];
  const gateNoTimestamp = evaluateBottlingReadinessGate({
    logs: oldImportedLogsWithoutTimestamp,
    additions: bactilessOnlyAdd,
    labAnalyses: [],
    tankId: 'tank-a',
    manualConfirmations: { clarityConfirmed: true, clinitestPassed: true },
    nowMs: Date.now()
  });
  assert.notEqual(gateNoTimestamp.so2AgeHours, 0, 'so2AgeHours must NOT fall back to 0 when timestampMs is missing on an old log');
  assert.equal(gateNoTimestamp.so2AgeHours, Number.POSITIVE_INFINITY);
  const recentFreeSo2Check = gateNoTimestamp.blockingItems.find(
    (i) => i.id === 'free_so2_target' || i.id === 'recent_free_so2'
  );
  assert.ok(recentFreeSo2Check);
  assert.equal(recentFreeSo2Check.status, 'blocked_red', 'Old log without timestampMs must remain blocked_red on pre-bottling SO2 gate');
});

test('Audit Stage 1 Bottling Gate: tests free_so2_target across all 4 states (below min, inside window, above max 85 mg/L, stale) and structured override_with_risk mode', () => {
  const nowMs = 1_000_000_000;
  const makeDryLogs = (freeSO2?: number, tsMs?: number, phMeasured: boolean = true): FermentationLogEntry[] => [
    {
      id: 's1',
      tankId: 'tank-a',
      dayNumber: 10,
      dateTime: '۱۴۰۵/۰۸/۰۱',
      timestampMs: tsMs !== undefined ? tsMs - 8 * 24 * 3600 * 1000 : undefined,
      stageTitle: 'خشک ۱',
      brix: 0,
      sg: 0.993,
      tempCap: 15,
      tempRoom: 15,
      ph: 3.50,
      phMeasured,
      freeSO2,
      pigeageDone: false,
      isBenchmark: false
    },
    {
      id: 's2',
      tankId: 'tank-a',
      dayNumber: 14,
      dateTime: '۱۴۰۵/۰۸/۰۵',
      timestampMs: tsMs !== undefined ? tsMs - 4 * 24 * 3600 * 1000 : undefined,
      stageTitle: 'خشک ۲',
      brix: 0,
      sg: 0.993,
      tempCap: 15,
      tempRoom: 15,
      ph: 3.50,
      phMeasured,
      freeSO2,
      pigeageDone: false,
      isBenchmark: false
    },
    {
      id: 's3',
      tankId: 'tank-a',
      dayNumber: 18,
      dateTime: '۱۴۰۵/۰۸/۰۹',
      timestampMs: tsMs,
      stageTitle: 'خشک ۳',
      brix: 0,
      sg: 0.993,
      tempCap: 15,
      tempRoom: 15,
      ph: 3.50,
      phMeasured,
      freeSO2,
      pigeageDone: false,
      isBenchmark: false
    }
  ];

  // State 1: Below min (15 mg/L at pH 3.50) -> blocked_red
  const belowMinGate = evaluateBottlingReadinessGate({
    logs: makeDryLogs(15, nowMs - 2 * 3600 * 1000),
    additions: [],
    labAnalyses: [],
    tankId: 'tank-a',
    nowMs
  });
  const so2Below = belowMinGate.blockingItems.find((i) => i.id === 'free_so2_target');
  assert.equal(so2Below?.status, 'blocked_red');
  assert.equal(so2Below?.dataStatus, 'failed');
  assert.equal(belowMinGate.executionMode, 'blocked');

  // State 2: Inside window (36 mg/L at pH 3.50, 2h old) -> passed & verified
  const insideGate = evaluateBottlingReadinessGate({
    logs: makeDryLogs(36, nowMs - 2 * 3600 * 1000, true),
    additions: [],
    labAnalyses: [],
    tankId: 'tank-a',
    nowMs
  });
  const so2Inside = insideGate.blockingItems.find((i) => i.id === 'free_so2_target');
  assert.equal(so2Inside?.status, 'passed');
  assert.equal(so2Inside?.dataStatus, 'verified');

  // State 3: Above max ceiling (85 mg/L at pH 3.50) -> blocked_red with bleaching/pungency warning
  const aboveMaxGate = evaluateBottlingReadinessGate({
    logs: makeDryLogs(85, nowMs - 2 * 3600 * 1000),
    additions: [],
    labAnalyses: [],
    tankId: 'tank-a',
    nowMs
  });
  const so2Above = aboveMaxGate.blockingItems.find((i) => i.id === 'free_so2_target');
  assert.equal(so2Above?.status, 'blocked_red', '85 mg/L Free SO2 must be blocked above ceiling');
  assert.equal(so2Above?.dataStatus, 'failed');
  assert.ok(so2Above?.detailFa.includes('سولفیت آزاد بیش از سقف هدف است'));

  // State 4: Stale (> 48h old: 72h old) -> blocked_red
  const staleGate = evaluateBottlingReadinessGate({
    logs: makeDryLogs(36, nowMs - 72 * 3600 * 1000),
    additions: [],
    labAnalyses: [],
    tankId: 'tank-a',
    nowMs
  });
  const so2Stale = staleGate.blockingItems.find((i) => i.id === 'free_so2_target');
  assert.equal(so2Stale?.status, 'blocked_red');
  assert.equal(so2Stale?.dataStatus, 'failed');

  // Structured Exception Override: keeps individual blockers as blocked_red, sets executionMode: 'override_with_risk' and overriddenBlockerIds
  const overrideGate = evaluateBottlingReadinessGate({
    logs: makeDryLogs(85, nowMs - 2 * 3600 * 1000),
    additions: [],
    labAnalyses: [],
    tankId: 'tank-a',
    riskOverrideReason: 'تایید آزمایشگاه مرجع خارج از کارگاه',
    nowMs
  });
  assert.equal(overrideGate.allBlockingPassed, false);
  assert.equal(overrideGate.canStartBottling, true);
  assert.equal(overrideGate.executionMode, 'override_with_risk');
  assert.ok(overrideGate.overriddenBlockerIds.includes('free_so2_target'));
  assert.ok(overrideGate.overrideWarningFa?.includes('مانع قرمز'));
  const overriddenSo2Item = overrideGate.blockingItems.find((i) => i.id === 'free_so2_target');
  assert.equal(overriddenSo2Item?.status, 'blocked_red', 'Individual failed check must remain blocked_red under override');
  assert.ok(overrideGate.overrideAudit);
  assert.equal(overrideGate.overrideAudit?.reason, 'تایید آزمایشگاه مرجع خارج از کارگاه');
  assert.ok(overrideGate.overrideAudit?.overriddenBlockerIds.includes('free_so2_target'));
});

test('Deep Audit Section 4 Scenarios: 1.1 RS Failure, 1.2 Exact Upper SO2 Ceiling & Unmeasured pH, 1.3 Harvest Low-Malic Incomplete Block, 1.4 Unmet YAN, 1.6 Batch Snapshot Isolation, 1.8 Cross-Batch & Rosé Isolation, 1.9 Yield Factor & Zinc Rose', () => {
  const nowMs = 2_000_000_000;
  const threeDryLogs: FermentationLogEntry[] = [
    {
      id: 'dry-1',
      batchId: 'batch-new',
      tankId: 'tank-a',
      dayNumber: 10,
      dateTime: '۱۴۰۵/۰۸/۰۱',
      timestampMs: nowMs - 9 * 24 * 3600 * 1000,
      stageTitle: 'خشک ۱',
      brix: 0,
      sg: 0.993,
      tempCap: 15,
      tempRoom: 15,
      ph: 3.50,
      phMeasured: false,
      freeSO2: 36,
      pigeageDone: false,
      isBenchmark: false,
      isDemo: false
    },
    {
      id: 'dry-2',
      batchId: 'batch-new',
      tankId: 'tank-a',
      dayNumber: 14,
      dateTime: '۱۴۰۵/۰۸/۰۵',
      timestampMs: nowMs - 5 * 24 * 3600 * 1000,
      stageTitle: 'خشک ۲',
      brix: 0,
      sg: 0.993,
      tempCap: 15,
      tempRoom: 15,
      ph: 3.50,
      phMeasured: false,
      freeSO2: 36,
      pigeageDone: false,
      isBenchmark: false,
      isDemo: false
    },
    {
      id: 'dry-3',
      batchId: 'batch-new',
      tankId: 'tank-a',
      dayNumber: 18,
      dateTime: '۱۴۰۵/۰۸/۰۹',
      timestampMs: nowMs - 2 * 3600 * 1000,
      stageTitle: 'خشک ۳',
      brix: 0,
      sg: 0.993,
      tempCap: 15,
      tempRoom: 15,
      ph: 3.50,
      phMeasured: false,
      freeSO2: 36,
      pigeageDone: false,
      isBenchmark: false,
      isDemo: false
    }
  ];

  // 1. Item 1.1: Explicit high RS lab analysis (>= 2.0 g/L) must block dryness_stability even when SG <= 0.995
  const highRsGate = evaluateBottlingReadinessGate({
    logs: threeDryLogs,
    additions: [],
    labAnalyses: [
      {
        id: 'rs-high',
        batchId: 'batch-new',
        tankId: 'tank-a',
        date: '۱۴۰۵/۰۸/۰۹',
        timestampMs: nowMs - 3600 * 1000,
        testType: 'refractometer_correction',
        targetAnalyte: 'قند باقی‌مانده (Clinitest / RS)',
        measuredValue: 3.2,
        unit: 'g/L',
        actionTaken: '',
        isDemo: false
      }
    ],
    batchId: 'batch-new',
    excludeDemo: true,
    tankId: 'tank-a',
    nowMs
  });
  const drynessHighRs = highRsGate.blockingItems.find((i) => i.id === 'dryness_stability');
  assert.equal(drynessHighRs?.status, 'blocked_red');
  assert.equal(drynessHighRs?.dataStatus, 'failed');

  // 2. Item 1.2 & 1.3: Unmeasured pH sets so2DataStatus = 'incomplete_data', and harvest-only malicStatus = 'low' stays blocked_red with dataStatus = 'incomplete_data'
  const harvestLowMalicGate = evaluateBottlingReadinessGate({
    logs: threeDryLogs,
    additions: [],
    labAnalyses: [],
    batch: {
      id: 'batch-new',
      name: 'بچ جدید',
      grapeVariety: 'رشه',
      vintageYear: 1405,
      initialWeightKg: 400,
      targetStyle: 'red',
      status: 'aging',
      startDate: '۱۴۰۵/۰۷/۲۰',
      notes: '',
      malicStatus: 'low',
      isDemo: false
    },
    excludeDemo: true,
    tankId: 'tank-a',
    manualConfirmations: { clarityConfirmed: true },
    nowMs
  });
  const so2UnmeasuredPh = harvestLowMalicGate.blockingItems.find((i) => i.id === 'free_so2_target');
  const malicHarvestOnly = harvestLowMalicGate.blockingItems.find((i) => i.id === 'malic_mlf_stability');
  assert.equal(so2UnmeasuredPh?.status, 'passed');
  assert.equal(so2UnmeasuredPh?.dataStatus, 'incomplete_data', 'Carried-forward unmeasured pH must mark free_so2_target as incomplete_data');
  assert.equal(malicHarvestOnly?.status, 'blocked_red', 'Harvest-only malicStatus=low without end-of-process verification must remain blocked_red');
  assert.equal(malicHarvestOnly?.dataStatus, 'incomplete_data');

  // Exact upper ceiling check at pH 3.50 (contSO2Target.max = 43 mg/L -> 50 mg/L must be blocked_red)
  const overExactMaxGate = evaluateBottlingReadinessGate({
    logs: threeDryLogs.map((l) => ({ ...l, freeSO2: 50, phMeasured: true })),
    additions: [],
    labAnalyses: [],
    batchId: 'batch-new',
    excludeDemo: true,
    tankId: 'tank-a',
    nowMs
  });
  const so2Over50 = overExactMaxGate.blockingItems.find((i) => i.id === 'free_so2_target');
  assert.equal(so2Over50?.status, 'blocked_red', '50 mg/L (> 43 mg/L max at pH 3.50) must be blocked');

  // 3. Items 1.4 & 1.9: unmetBioEquivalentYANMgL, redMashLiquidYieldFactor, and zincRoseG
  const defaultPlan = computeDynamicProtocolPlan(IDEAL_DEFAULT_PROTOCOL_PARAMS);
  assert.equal(defaultPlan.nitrogen.baseBioEquivalentYANMgL, 122.8);
  assert.equal(defaultPlan.nitrogen.unmetBioEquivalentYANMgL, 29.2);

  const customYieldAndZincPlan = computeDynamicProtocolPlan({
    ...IDEAL_DEFAULT_PROTOCOL_PARAMS,
    redMashLiquidYieldFactor: 0.75,
    zincSafeRateGL: 0.012
  });
  assert.equal(
    customYieldAndZincPlan.volumes.redLiquidFermentPerTankL,
    117.8,
    '157 L mash * 0.75 yield factor must equal 117.8 L'
  );
  assert.equal(
    customYieldAndZincPlan.dosages.zincRoseG,
    0.38,
    'zincRoseG must use params.zincSafeRateGL (0.012 * 32 = 0.38g), not hardcoded 0.015'
  );

  // 4. Item 1.6: Batch protocolParamsSnapshot isolation in evaluateRightNowQueue
  const snapshotQueue = evaluateRightNowQueue({
    logs: [],
    additions: [],
    activeTankId: 'tank-a',
    batch: {
      id: 'batch-snap-100',
      name: 'بچ ۱۰۰ کیلویی اسنپ‌شات',
      grapeVariety: 'رشه',
      vintageYear: 1405,
      initialWeightKg: 100,
      targetStyle: 'red',
      status: 'active_fermentation',
      startDate: '۱۴۰۵/۰۷/۲۵',
      notes: '',
      tankCount: 1,
      isDemo: false,
      protocolParamsSnapshot: {
        ...IDEAL_DEFAULT_PROTOCOL_PARAMS,
        grapeWeightKg: 100
      }
    },
    excludeDemo: true
  });
  const crushMilestone = snapshotQueue.allMilestones.find((m) => m.id === 'crush-kms');
  assert.ok(crushMilestone);
  assert.equal(
    crushMilestone.tankRows[0].additionsToRecord[0].amount,
    1.63,
    'Batch with 100kg protocolParamsSnapshot must compute 1.63g crush KMS even without explicit plan prop'
  );

  // 5. Item 1.8: Cross-batch & orphan isolation (including tank-rose)
  const crossBatchQueue = evaluateRightNowQueue({
    logs: [
      {
        id: 'old-rose-log',
        batchId: 'batch-old',
        tankId: 'tank-rose',
        dayNumber: 5,
        dateTime: '۱۴۰۴/۰۷/۲۵',
        stageTitle: 'بچ قدیمی رزه',
        brix: 10,
        sg: 1.040,
        tempCap: 15,
        tempRoom: 15,
        ph: 3.40,
        pigeageDone: false,
        isBenchmark: false,
        isDemo: false
      }
    ],
    additions: [
      {
        id: 'old-rose-add',
        batchId: 'batch-old',
        tankId: 'tank-rose',
        milestoneId: 'sna-1',
        timestamp: '۱۴۰۴/۰۷/۲۲',
        stageTitle: 'تغذیه اول رزه بچ قدیم',
        compoundName: 'Fermaid O',
        compoundType: 'fermaid_o',
        amount: 8,
        unit: 'g',
        purpose: 'تست عدم نشت',
        isDemo: false
      }
    ],
    activeTankId: 'tank-rose',
    batchId: 'batch-new',
    excludeDemo: true
  });
  const sna1RoseRow = crossBatchQueue.allMilestones
    .find((m) => m.id === 'sna-1')
    ?.tankRows.find((r) => r.tankId === 'tank-rose');
  assert.ok(sna1RoseRow);
  assert.equal(
    sna1RoseRow.isCompletedForTank,
    false,
    'tank-rose addition from batch-old must NOT mark sna-1 completed in batch-new'
  );
  assert.equal(
    sna1RoseRow.additionsToRecord[0].batchId,
    'batch-new',
    'tank-rose additionsToRecord must use activeBatchId (batch-new), not hardcoded batch-rose-1403'
  );
});

test('BUG-03, BUG-13, BUG-14, BUG-15, BUG-16, BUG-22, BUG-27, BUG-30: unmeasured Free SO2 block, Day 0 lag buffer, sna-2-dap missed priority, batch-scoped hasRealUserData, strict phase2-tannin SG window, consistent 1.062 close boundary, and Bactiless spelling variants', () => {
  const nowMs = 3_000_000_000;

  // BUG-03: Carried-forward unmeasured Free SO2 (freeSO2Measured: false) must NOT pass free_so2_target in Bottling Readiness Gate
  const carriedSo2Logs: FermentationLogEntry[] = [10, 14, 18].map((day, idx) => ({
    id: `cso2-${idx}`,
    tankId: 'tank-a',
    dayNumber: day,
    dateTime: '۱۴۰۵/۰۸/۱۰',
    timestampMs: nowMs - (3 - idx) * 24 * 3600 * 1000,
    stageTitle: `روز ${day}`,
    brix: 0,
    sg: 0.993,
    tempCap: 15,
    tempRoom: 15,
    ph: 3.50,
    phMeasured: true,
    freeSO2: 40,
    freeSO2Measured: false,
    pigeageDone: false,
    isBenchmark: false,
    isDemo: false
  }));
  const carriedSo2Gate = evaluateBottlingReadinessGate({
    logs: carriedSo2Logs,
    additions: [],
    labAnalyses: [],
    tankId: 'tank-a',
    nowMs
  });
  const so2Check = carriedSo2Gate.blockingItems.find((i) => i.id === 'free_so2_target');
  assert.equal(so2Check?.status, 'blocked_red', 'Unmeasured carried-forward freeSO2 must not pass pre-bottling SO2 gate');

  // BUG-13 & BUG-30: Day 0 lag buffer (+24h) when no observed velocity exists
  const day0Queue = evaluateRightNowQueue({
    logs: [],
    additions: [],
    activeTankId: 'tank-a'
  });
  const sna1Day0 = day0Queue.allMilestones.find((m) => m.id === 'sna-1');
  assert.ok(sna1Day0?.estimatedHoursUntilDue);
  assert.ok(
    sna1Day0.estimatedHoursUntilDue.min >= 25,
    `Expected Day 0 sna-1 ETA min >= 25h with 24h lag buffer, got ${sna1Day0.estimatedHoursUntilDue.min}`
  );
  const day0Countdowns = evaluateDeadlineCountdowns({
    logs: [],
    additions: [],
    tankId: 'tank-a'
  });
  const dapCountdownDay0 = day0Countdowns.find((c) => c.id === 'dap_window');
  assert.ok(dapCountdownDay0?.rangeTextFa.includes('58 تا 90'));

  // BUG-14 & BUG-22: At SG = 1.062 (exact 1/3 sugar break ceiling), both sna-1 and sna-2-dap are 'missed' (not closed), and primaryAction prioritizes sna-2-dap over sna-1
  const at1062Logs: FermentationLogEntry[] = [
    {
      id: 'l-1062',
      tankId: 'tank-a',
      dayNumber: 3,
      dateTime: '۱۴۰۵/۰۷/۲۷',
      stageTitle: 'روز ۳',
      brix: 15.2,
      sg: 1.062,
      tempCap: 25,
      tempRoom: 21,
      ph: 3.52,
      pigeageDone: true,
      isBenchmark: false,
      isDemo: false
    }
  ];
  const queueAt1062 = evaluateRightNowQueue({
    logs: at1062Logs,
    additions: [],
    activeTankId: 'tank-a',
    completedRoadmapStepIds: [5, 6, 7, 8, 9, 13, 14]
  });
  const sna1At1062 = queueAt1062.allMilestones.find((m) => m.id === 'sna-1');
  const sna2At1062 = queueAt1062.allMilestones.find((m) => m.id === 'sna-2-dap');
  assert.equal(sna1At1062?.state, 'missed');
  assert.equal(sna2At1062?.state, 'missed');
  assert.equal(
    queueAt1062.primaryAction?.id,
    'sna-2-dap',
    'sna-2-dap must be prioritized ahead of sna-1 when both are missed near 1/3 sugar ceiling'
  );

  // BUG-15: Real logs in batch-2 do not wipe out demo logs when viewing demo batch-rasha-1403
  const mixedBatchLogs: FermentationLogEntry[] = [
    {
      id: 'demo-log',
      batchId: 'batch-rasha-1403',
      tankId: 'tank-a',
      dayNumber: 2,
      dateTime: '۱۴۰۳/۰۷/۲۶',
      stageTitle: 'دمو روز ۲',
      brix: 20,
      sg: 1.083,
      tempCap: 24,
      tempRoom: 21,
      ph: 3.52,
      pigeageDone: true,
      isBenchmark: false,
      isDemo: true
    },
    {
      id: 'real-other-batch',
      batchId: 'batch-custom-2',
      tankId: 'tank-a',
      dayNumber: 5,
      dateTime: '۱۴۰۵/۰۷/۳۰',
      stageTitle: 'واقعی بچ ۲',
      brix: 10,
      sg: 1.040,
      tempCap: 25,
      tempRoom: 21,
      ph: 3.50,
      pigeageDone: true,
      isBenchmark: false,
      isDemo: false
    }
  ];
  const demoBatchQueue = evaluateRightNowQueue({
    logs: mixedBatchLogs,
    additions: [],
    activeTankId: 'tank-a',
    batchId: 'batch-rasha-1403',
    completedRoadmapStepIds: [5, 6, 7, 8, 9, 13, 14]
  });
  assert.equal(
    demoBatchQueue.allMilestones.find((m) => m.id === 'sna-1')?.state,
    'due',
    'Demo log at SG 1.083 in batch-rasha-1403 must remain active even when batch-custom-2 has real logs'
  );

  // BUG-16: Generic tannin_red addition without explicit phase 2 text or sgAtAddition in [1.052, 1.065] does NOT complete phase2-tannin
  const genericTanninQueue = evaluateRightNowQueue({
    logs: at1062Logs,
    additions: [
      {
        id: 'tannin-no-sg',
        batchId: 'batch-rasha-1403',
        tankId: 'tank-a',
        timestamp: '۱۴۰۵/۰۷/۲۴',
        stageTitle: 'افزودن تانن',
        compoundName: 'تانن قرمز',
        compoundType: 'tannin_red',
        amount: 13.2,
        unit: 'g',
        purpose: 'تثبیت اولیه رنگ'
      }
    ],
    activeTankId: 'tank-a'
  });
  assert.notEqual(
    genericTanninQueue.allMilestones.find((m) => m.id === 'phase2-tannin')?.state,
    'completed'
  );

  // BUG-27: Persian spelling 'باکتیلس' (with Alef) matches day11-bactiless-kms-lock and bactiless_contact
  const bactilessAlefAdds: ChemicalAddition[] = [
    {
      id: 'bact-alef',
      batchId: 'batch-rasha-1403',
      tankId: 'tank-a',
      dayNumber: 11,
      timestamp: '۱۴۰۵/۰۸/۰۵',
      stageTitle: 'تثبیت میکروبی',
      compoundName: 'کیتوزان باکتیلس',
      amount: 28.8,
      unit: 'g',
      purpose: 'قفل مالولاکتیک'
    }
  ];
  const bactilessQueue = evaluateRightNowQueue({
    logs: [{ ...at1062Logs[0], dayNumber: 15, sg: 0.993 }],
    additions: bactilessAlefAdds,
    activeTankId: 'tank-a'
  });
  assert.equal(
    bactilessQueue.allMilestones.find((m) => m.id === 'day11-bactiless-kms-lock')?.state,
    'completed'
  );
  const bactilessCountdowns = evaluateDeadlineCountdowns({
    logs: [{ ...at1062Logs[0], dayNumber: 15, sg: 0.993 }],
    additions: bactilessAlefAdds,
    tankId: 'tank-a'
  });
  assert.ok(bactilessCountdowns.some((c) => c.id === 'bactiless_contact'));

  // Micro-Task 1 Audit Fixes:
  // 1. Verify roadmapStepIds match ZERO_TO_HUNDRED_STEPS (e.g. pressing = [21, 22], day100-bottling = [41, 42, 44, 45, 46])
  assert.deepEqual(
    bactilessQueue.allMilestones.find((m) => m.id === 'pressing')?.roadmapStepIds,
    [21, 22]
  );
  assert.deepEqual(
    bactilessQueue.allMilestones.find((m) => m.id === 'day100-bottling')?.roadmapStepIds,
    [41, 42, 44, 45, 46]
  );
  // 2. Verify day100-bottling howToExecuteFa instructs Day 99 KMS before Day 100 Ascorbic Acid
  const bottlingHowTo = bactilessQueue.allMilestones.find((m) => m.id === 'day100-bottling')?.howToExecuteFa ?? '';
  assert.ok(bottlingHowTo.indexOf('روز ۹۹') < bottlingHowTo.indexOf('روز ۱۰۰'));

  // 3. Verify tank-rose filters out Red-only skin/cap milestones and populates tank-rose rows with both Fermaid O + Zinc in SNA-1
  const roseQueue = evaluateRightNowQueue({
    logs: [],
    additions: [],
    activeTankId: 'tank-rose'
  });
  assert.ok(!roseQueue.allMilestones.some((m) => m.id === 'crush-kms'));
  assert.ok(!roseQueue.allMilestones.some((m) => m.id === 'saignee-rose'));
  assert.ok(!roseQueue.allMilestones.some((m) => m.id === 'phase2-tannin'));
  assert.ok(!roseQueue.allMilestones.some((m) => m.id === 'pressing'));
  const roseSna1 = roseQueue.allMilestones.find((m) => m.id === 'sna-1');
  const roseSna1Row = roseSna1?.tankRows.find((r) => r.tankId === 'tank-rose');
  assert.ok(roseSna1Row, 'SNA-1 must have a tank-rose row');
  assert.equal(roseSna1Row.additionsToRecord.length, 2, 'tank-rose SNA-1 row must include both Fermaid O and Zinc');

  // 4. Verify legacy Fermaid O addition without compoundType completes sna-1 and sna-3-organic
  const legacySnaQueue = evaluateRightNowQueue({
    logs: [{ ...at1062Logs[0], sg: 1.055 }],
    additions: [
      {
        id: 'leg-sna1',
        batchId: 'batch-rasha-1403',
        tankId: 'tank-a',
        timestamp: '۱۴۰۵/۰۷/۲۶',
        stageTitle: 'گام ۱۶: تغذیه نوبت اول (SNA-1)',
        compoundName: 'Fermaid O',
        amount: 33,
        unit: 'g',
        purpose: 'تغذیه مخمر'
      },
      {
        id: 'leg-sna3',
        batchId: 'batch-rasha-1403',
        tankId: 'tank-a',
        timestamp: '۱۴۰۵/۰۷/۲۸',
        stageTitle: 'گام ۱۹: تغذیه نوبت سوم (SNA-3)',
        compoundName: 'Fermaid O',
        amount: 26.4,
        unit: 'g',
        purpose: 'تغذیه نهایی'
      }
    ],
    activeTankId: 'tank-a'
  });
  assert.equal(legacySnaQueue.allMilestones.find((m) => m.id === 'sna-1')?.state, 'completed');
  assert.equal(legacySnaQueue.allMilestones.find((m) => m.id === 'sna-3-organic')?.state, 'completed');
});

test('Step 2 Prerequisite: structured doseValue, doseUnit, compoundFa, and volumeContextFa are populated on red and rose tank rows for sna-1, sna-2-dap, day11-bactiless-kms-lock, and pressing', () => {
  const redQueue = evaluateRightNowQueue({
    logs: [],
    additions: [],
    activeTankId: 'tank-a'
  });

  const targetIds = ['sna-1', 'sna-2-dap', 'day11-bactiless-kms-lock', 'pressing'] as const;
  for (const id of targetIds) {
    const milestone = redQueue.allMilestones.find((m) => m.id === id);
    assert.ok(milestone, `Milestone ${id} must exist in redQueue`);
    assert.ok(milestone.tankRows.length > 0, `Milestone ${id} must have tankRows`);

    for (const row of milestone.tankRows) {
      assert.ok(row.doseValue && row.doseValue.trim().length > 0, `${id} (${row.tankId}) doseValue must be non-empty`);
      assert.ok(row.doseUnit && row.doseUnit.trim().length > 0, `${id} (${row.tankId}) doseUnit must be non-empty`);
      assert.ok(row.compoundFa && row.compoundFa.trim().length > 0, `${id} (${row.tankId}) compoundFa must be non-empty`);
      assert.ok(row.volumeContextFa && row.volumeContextFa.trim().length > 0, `${id} (${row.tankId}) volumeContextFa must be non-empty`);
      assert.ok(row.doseAmountTextFa && row.doseAmountTextFa.trim().length > 0, `${id} (${row.tankId}) doseAmountTextFa must remain populated`);
    }

    const tankA = milestone.tankRows.find((r) => r.tankId === 'tank-a');
    assert.ok(tankA, `${id} must include tank-a row`);
    if (id !== 'pressing') {
      const tankRose = milestone.tankRows.find((r) => r.tankId === 'tank-rose');
      assert.ok(tankRose, `${id} must include tank-rose row`);
    }
  }

  const sna1A = redQueue.allMilestones.find((m) => m.id === 'sna-1')?.tankRows.find((r) => r.tankId === 'tank-a');
  assert.equal(sna1A?.doseValue, '33');
  assert.equal(sna1A?.doseUnit, 'g');
  assert.equal(sna1A?.compoundFa, 'Fermaid O');

  const sna2A = redQueue.allMilestones.find((m) => m.id === 'sna-2-dap')?.tankRows.find((r) => r.tankId === 'tank-a');
  assert.equal(sna2A?.doseValue, '33 + 19.8 + 0.26');
  assert.equal(sna2A?.doseUnit, 'g');
  assert.equal(sna2A?.compoundFa, 'Fermaid K + DAP + سولفات روی');

  const day11A = redQueue.allMilestones.find((m) => m.id === 'day11-bactiless-kms-lock')?.tankRows.find((r) => r.tankId === 'tank-a');
  assert.equal(day11A?.doseValue, '28.8 + 6.72');
  assert.equal(day11A?.doseUnit, 'g');
  assert.equal(day11A?.compoundFa, 'باکتیلس + KMS');

  const pressingA = redQueue.allMilestones.find((m) => m.id === 'pressing')?.tankRows.find((r) => r.tankId === 'tank-a');
  assert.equal(pressingA?.doseValue, '100');
  assert.equal(pressingA?.doseUnit, 'L');
  assert.equal(pressingA?.compoundFa, 'شراب آب‌آزاد');
});

