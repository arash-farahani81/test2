import type {
  ChemicalAddition,
  FermentationLogEntry,
  LabAnalysisRecord,
  TankId,
  WineBatch
} from '../types/index.ts';
import {
  MASTER_PROTOCOL_CONFIG,
  getCurrentDynamicProtocolPlan,
  getEffectiveProtocolPlanForBatch,
  type DynamicProtocolPlan
} from '../data/masterProtocolConfig.ts';
import {
  calculateDynamicSGTriggers,
  getContinuousTargetFreeSO2ByPH
} from './enologyUtils.ts';
import {
  calculateRecentLogVelocity,
  sortFermentationLogs
} from './trackingCalculations.ts';

export type MilestoneState =
  | 'pending'
  | 'due'
  | 'missed'
  | 'closed'
  | 'completed'
  | 'skipped';

export type MilestoneTriggerType = 'sg' | 'day' | 'event';

export interface MilestoneTankRow {
  tankId: TankId;
  tankLabelFa: string;
  doseValue: string;
  doseUnit: string;
  compoundFa: string;
  volumeContextFa: string;
  doseAmountTextFa: string;
  isCompletedForTank: boolean;
  additionsToRecord: Array<Omit<ChemicalAddition, 'id'>>;
}

export interface RightNowMilestone {
  id: string;
  roadmapStepIds: number[];
  titleFa: string;
  whyFa: string;
  howToExecuteFa: string;
  scienceNoteFa: string;
  confidenceLabelFa: string;
  triggerType: MilestoneTriggerType;
  triggerSG?: number;
  windowCloseSG?: number;
  triggerDay?: number;
  windowCloseDay?: number;
  state: MilestoneState;
  stateBadgeFa: string;
  closedReasonFa?: string;
  canMarkDone: boolean;
  estimatedHoursUntilDue?: { min: number; max: number };
  skippedReasonFa?: string;
  snoozedUntilMs?: number;
  tankRows: MilestoneTankRow[];
}

export interface SgAnomalyAlert {
  hasAnomaly: boolean;
  previousSG: number;
  currentSG: number;
  titleFa: string;
  descriptionFa: string;
}

export interface RightNowQueueResult {
  sgAnomaly: SgAnomalyAlert | null;
  primaryAction: RightNowMilestone | null;
  overdueActions: RightNowMilestone[];
  closedActions: RightNowMilestone[];
  upcomingActions: RightNowMilestone[];
  allMilestones: RightNowMilestone[];
}

export interface DeadlineCountdownItem {
  id: 'dap_window' | 'bactiless_contact' | 'post_dryness_so2';
  titleFa: string;
  rangeTextFa: string;
  color: 'emerald' | 'amber' | 'rose' | 'gray';
  urgencyLevel: 'safe' | 'warning' | 'critical' | 'closed';
  explanationFa: string;
}

export interface BottlingGateCheckItem {
  id: string;
  titleFa: string;
  isBlocking: boolean;
  status: 'passed' | 'blocked_red' | 'advisory_amber';
  dataStatus?: 'verified' | 'incomplete_data' | 'failed';
  detailFa: string;
  whyFa: string;
}

export interface BottlingReadinessResult {
  blockingItems: BottlingGateCheckItem[];
  advisoryItems: BottlingGateCheckItem[];
  allBlockingPassed: boolean;
  canStartBottling: boolean;
  executionMode: 'safe_ready' | 'override_with_risk' | 'blocked';
  overriddenBlockerIds: string[];
  overrideWarningFa?: string;
  riskOverrideReason?: string;
  overrideAudit?: {
    overriddenAtMs: number;
    reason: string;
    overriddenBlockerIds: string[];
    tankId: TankId;
    batchId?: string;
  };
  so2AgeHours?: number;
}

function getStateBadgeFa(state: MilestoneState): string {
  switch (state) {
    case 'pending':
      return 'در انتظار';
    case 'due':
      return 'موعد رسیده';
    case 'missed':
      return 'جاافتاده — همین الان بزنید';
    case 'closed':
      return 'پنجره بسته شد';
    case 'completed':
      return 'انجام شد';
    case 'skipped':
      return 'رد شد';
  }
}

function formatNowFa(): string {
  try {
    return new Intl.DateTimeFormat('fa-IR', {
      dateStyle: 'short',
      timeStyle: 'short'
    }).format(new Date());
  } catch {
    return '۱۴۰۵/۰۷/۲۵ - ۰۸:۰۰';
  }
}

function isMilestoneCompletedByAdditions(
  milestoneId: string,
  tankAdditions: ChemicalAddition[],
  completedRoadmapStepIds: number[],
  roadmapStepIds: number[]
): boolean {
  if (
    completedRoadmapStepIds.length > 0 &&
    roadmapStepIds.length > 0 &&
    roadmapStepIds.every((id) => completedRoadmapStepIds.includes(id))
  ) {
    return true;
  }

  for (const add of tankAdditions) {
    if (add.isDeleted) continue;
    if (add.milestoneId !== undefined) {
      if (add.milestoneId === milestoneId) return true;
      continue;
    }
    const text = `${add.stageTitle} ${add.purpose} ${add.compoundName}`;
    switch (milestoneId) {
      case 'crush-kms':
        if (
          (add.compoundType === 'kms' ||
            add.pubchemCid === 24446 ||
            /kms|متابیسولفیت|متابی‌سولفیت/i.test(text)) &&
          (add.referenceVolumeL === 150 || text.includes('کراش') || text.includes('اولیه'))
        ) {
          return true;
        }
        break;
      case 'saignee-rose':
        if (
          (add.compoundType === 'kms' || add.pubchemCid === 24446 || text.includes('KMS')) &&
          (text.includes('سانیه') || text.includes('خون‌گیری') || text.includes('+15'))
        ) {
          return true;
        }
        break;
      case 'pectic-enzyme':
        if (add.compoundType === 'enzyme' || text.includes('پکتین') || text.includes('آنزیم')) {
          return true;
        }
        break;
      case 'yeast-inoculation':
        if (
          add.compoundType === 'yeast' ||
          add.compoundType === 'go_ferm' ||
          text.includes('مخمر') ||
          text.includes('RC-212')
        ) {
          return true;
        }
        break;
      case 'sna-1':
        if (
          (add.compoundType === 'fermaid_o' || /fermaid\s*o/i.test(text)) &&
          (text.includes('SNA-1') ||
            text.includes('نوبت اول') ||
            text.includes('روز ۲') ||
            (add.sgAtAddition !== undefined && add.sgAtAddition >= 1.072))
        ) {
          return true;
        }
        break;
      case 'sna-2-dap':
        if (text.includes('SNA-2') || text.includes('نوبت دوم')) {
          return true;
        }
        if (
          tankAdditions.some((a) => !a.isDeleted && a.compoundType === 'fermaid_k') &&
          tankAdditions.some((a) => !a.isDeleted && a.compoundType === 'dap')
        ) {
          return true;
        }
        break;
      case 'phase2-tannin':
        if (
          text.includes('فاز ۲') ||
          text.includes('فاز 2') ||
          text.includes('1.060') ||
          (add.compoundType === 'tannin_red' &&
            !text.includes('فاز ۱') &&
            !text.includes('فاز 1') &&
            !text.includes('روز ۰') &&
            !text.includes('ساعت ۱۱') &&
            add.sgAtAddition !== undefined &&
            add.sgAtAddition <= 1.065 &&
            add.sgAtAddition >= 1.052)
        ) {
          return true;
        }
        break;
      case 'sna-3-organic':
        if (
          (add.compoundType === 'fermaid_o' || /fermaid\s*o/i.test(text)) &&
          (text.includes('SNA-3') ||
            text.includes('نوبت سوم') ||
            text.includes('نهایی') ||
            (add.sgAtAddition !== undefined && add.sgAtAddition < 1.068))
        ) {
          return true;
        }
        break;
      case 'pressing':
        if (text.includes('پرسینگ') || text.includes('جداسازی پوست')) {
          return true;
        }
        break;
      case 'racking-1-gross-lees':
        if (text.includes('سیفون اول') || text.includes('دُرد درشت')) {
          return true;
        }
        break;
      case 'day11-bactiless-kms-lock':
        if (
          add.compoundType === 'bactiless' ||
          /bactiless|ب[ا]?کتی[‌]?لس/i.test(text) ||
          text.includes('روز ۱۱')
        ) {
          return true;
        }
        break;
      case 'day21-bactiless-racking':
        if (text.includes('روز ۲۱') || text.includes('سیفون باکتی')) {
          return true;
        }
        break;
      case 'day65-cold-stab':
        if (
          add.compoundType === 'kht' ||
          text.includes('کرم تارتار') ||
          text.includes('پایدارسازی سرد')
        ) {
          return true;
        }
        break;
      case 'day100-bottling':
        if (
          add.compoundType === 'ascorbic' ||
          text.includes('بطری‌گذاری') ||
          text.includes('اسکوربیک')
        ) {
          return true;
        }
        break;
    }
  }

  return false;
}

export function evaluateRightNowQueue(options: {
  logs: FermentationLogEntry[];
  additions: ChemicalAddition[];
  activeTankId?: TankId;
  completedRoadmapStepIds?: number[];
  snoozedUntilMsByStepId?: Record<string, number>;
  skippedReasonsByStepId?: Record<string, string>;
  nowMs?: number;
  plan?: DynamicProtocolPlan;
  batch?: WineBatch;
  batchId?: string;
  excludeDemo?: boolean;
}): RightNowQueueResult {
  const plan = getEffectiveProtocolPlanForBatch(options.batch, options.plan);
  const activeTankId: TankId = options.activeTankId ?? 'tank-a';
  const completedStepIds = options.completedRoadmapStepIds ?? [];
  const snoozedMap = options.snoozedUntilMsByStepId ?? {};
  const skippedMap = options.skippedReasonsByStepId ?? {};
  const nowMs = options.nowMs ?? Date.now();

  const activeBatchId = options.batchId ?? options.batch?.id ?? 'batch-rasha-1403';
  const hasExplicitBatchFilter = Boolean(options.batchId || options.batch?.id);
  const rejectOrphanRecords = Boolean(
    hasExplicitBatchFilter && options.excludeDemo === true
  );
  const hasRealUserData = Boolean(
    options.excludeDemo ||
      options.batch?.isDemo === false ||
      options.logs.some(
        (l) =>
          !l.isDeleted &&
          !l.isBenchmark &&
          !l.isDemo &&
          (!l.batchId ? !rejectOrphanRecords : l.batchId === activeBatchId)
      ) ||
      options.additions.some(
        (a) =>
          !a.isDeleted &&
          !a.isDemo &&
          (!a.batchId ? !rejectOrphanRecords : a.batchId === activeBatchId)
      )
  );

  const isRecordMatchingActiveBatch = (recordBatchId?: string, recordTankId?: TankId): boolean => {
    if (!hasExplicitBatchFilter) return true;
    if (!recordBatchId) {
      return !rejectOrphanRecords;
    }
    if (recordBatchId === activeBatchId) return true;
    // In default factory demo mode only, allow companion demo rose batch records when viewing batch-rasha-1403
    if (
      !hasRealUserData &&
      activeBatchId === 'batch-rasha-1403' &&
      recordTankId === 'tank-rose' &&
      recordBatchId === 'batch-rose-1403'
    ) {
      return true;
    }
    return false;
  };

  const filteredLogs = options.logs.filter((l) => {
    if (l.isDeleted) return false;
    if (!isRecordMatchingActiveBatch(l.batchId, l.tankId)) {
      return false;
    }
    if (hasRealUserData && (l.isDemo === true || l.isBenchmark === true)) {
      return false;
    }
    return true;
  });

  const activeLogsAll = filteredLogs.filter((l) => l.tankId === activeTankId);
  const nonBenchmarkLogs = activeLogsAll.filter((l) => !l.isBenchmark);
  const effectiveTankLogs = sortFermentationLogs(
    nonBenchmarkLogs.length > 0 ? nonBenchmarkLogs : activeLogsAll
  );

  const activeAdditions = options.additions.filter((a) => {
    if (a.isDeleted) return false;
    if (!isRecordMatchingActiveBatch(a.batchId, a.tankId)) {
      return false;
    }
    if (hasRealUserData && a.isDemo === true) {
      return false;
    }
    return true;
  });

  // Check SG anomaly on active tank
  let sgAnomaly: SgAnomalyAlert | null = null;
  if (effectiveTankLogs.length >= 2) {
    const prevLog = effectiveTankLogs[effectiveTankLogs.length - 2];
    const latestLog = effectiveTankLogs[effectiveTankLogs.length - 1];
    if (latestLog.sg > prevLog.sg + 0.002) {
      sgAnomaly = {
        hasAnomaly: true,
        previousSG: prevLog.sg,
        currentSG: latestLog.sg,
        titleFa: 'تخمیر متوقف یا اشتباه ثبت؟',
        descriptionFa:
          'افزایش غیرمنتظرهٔ SG نسبت به ثبت قبلی؛ احتمال خطای قرائت، چسبیدن حباب گاز CO2 به هیدرومتر، عدم تصحیح دمای نمونه یا رکود تخمیر را بررسی کنید.'
      };
    }
  }

  const dynTriggers = calculateDynamicSGTriggers(plan.triggers.initialSG, {
    pressingPoint: plan.triggers.pressingSG,
    drynessPoint: activeTankId === 'tank-rose' ? 0.991 : plan.triggers.drynessSG
  });

  const latestLog = effectiveTankLogs[effectiveTankLogs.length - 1];
  const currentSG = latestLog ? latestLog.sg : dynTriggers.initialSG;
  const currentDay = latestLog ? latestLog.dayNumber : 0;

  const velocityInfo = calculateRecentLogVelocity(
    effectiveTankLogs,
    dynTriggers.initialSG
  );
  const velocityPerDay =
    velocityInfo.hasObservedVelocity && velocityInfo.recentVelocityPerDay > 0.001
      ? velocityInfo.recentVelocityPerDay
      : 0.015;
  const lagBufferHours =
    currentDay <= 1 && !velocityInfo.hasObservedVelocity ? 24 : 0;

  const { volumes, dosages } = plan;

  const initialLiquidPerTankL = volumes.initialLiquidPerTankL;
  const redLiquidPerTankL = volumes.redLiquidFermentPerTankL;
  const saigneeTotalL = volumes.saigneeTotalL;
  const roseFermentL = volumes.roseClarifiedFermentL;
  const rosePostRackingL = volumes.rosePostRackingL;
  const roseFinalBottlingL = volumes.roseFinalBottlingL;
  const rack1PerTankL = volumes.rack1PerTankL;
  const freeRunPerTankL = Math.round((rack1PerTankL / 96) * 100);
  const finalRedPerTankL = Math.round(volumes.finalRedTotalL / 2);

  const crushKmsG = dosages.crushKmsPerTankG;
  const postSaigneeKmsG = dosages.postSaigneeKmsPerTankG;
  const pecticEnzymeRedG = dosages.pecticEnzymeRedPerTankG;
  const pecticEnzymeRoseG = dosages.pecticEnzymeRoseG;
  const yeastRedG = dosages.yeastRedPerTankG;
  const yeastRoseG = dosages.yeastRoseG;
  const goFermRedG = dosages.goFermRedPerTankG;
  const goFermRoseG = dosages.goFermRoseG;
  const fermaidO1RedG = dosages.fermaidO1RedPerTankG;
  const fermaidO1RoseG = dosages.fermaidO1RoseG;
  const zincRoseG = dosages.zincRoseG;
  const fermaidK2RedG = dosages.fermaidK2RedPerTankG;
  const fermaidK2RoseG = dosages.fermaidK2RoseG;
  const dapRedG = dosages.dap2RedPerTankG;
  const dap2RoseG = dosages.dap2RoseG;
  const zincRedG = dosages.zincRedPerTankG;
  const redTanninPhase2G = dosages.redTanninPhase2PerTankG;
  const fermaidO3RedG = dosages.fermaidO3RedPerTankG;
  const fermaidO3RoseG = dosages.fermaidO3RoseG;
  const bactilessRedG = dosages.bactilessRedPerTankG;
  const bactilessRoseG = dosages.bactilessRoseG;
  const day11KmsG = dosages.day11KmsPerTankG;
  const rosePostFermKmsG = dosages.rosePostFermKmsG;
  const khtRedG = dosages.khtColdStabRedPerTankG;
  const khtColdStabRoseG = dosages.khtColdStabRoseG;
  const preBottlingKmsG = dosages.preBottlingKmsPerTankG;
  const rosePreBottlingKmsG = dosages.rosePreBottlingKmsG;
  const ascorbicRedG = dosages.ascorbicRedPerTankG;
  const ascorbicRoseG = dosages.ascorbicRoseG;

  const timestampFa = formatNowFa();
  const batchId = activeBatchId;
  const roseBatchId =
    hasExplicitBatchFilter || hasRealUserData ? activeBatchId : 'batch-rose-1403';

  interface MilestoneBlueprint {
    id: string;
    roadmapStepIds: number[];
    titleFa: string;
    whyFa: string;
    howToExecuteFa: string;
    scienceNoteFa: string;
    confidenceLabelFa: string;
    triggerType: MilestoneTriggerType;
    triggerSG?: number;
    windowCloseSG?: number;
    triggerDay?: number;
    windowCloseDay?: number;
    closedReasonFa?: string;
    buildTankRows: () => MilestoneTankRow[];
  }

  const makeRedTanksRows = (
    milestoneId: string,
    stepIds: number[],
    buildForTank: (tankId: 'tank-a' | 'tank-b', labelFa: string) => {
      doseValue: string;
      doseUnit: string;
      compoundFa: string;
      volumeContextFa: string;
      doseAmountTextFa: string;
      additionsToRecord: Array<Omit<ChemicalAddition, 'id'>>;
    }
  ): MilestoneTankRow[] => {
    const pairs: Array<['tank-a' | 'tank-b', string]> =
      options.batch?.tankCount === 1
        ? [['tank-a', 'مخزن A']]
        : [
            ['tank-a', 'مخزن A'],
            ['tank-b', 'مخزن B']
          ];
    return pairs.map(([tId, labelFa]) => {
      const tankAdds = activeAdditions.filter((a) => a.tankId === tId);
      const isCompletedForTank = isMilestoneCompletedByAdditions(
        milestoneId,
        tankAdds,
        completedStepIds,
        stepIds
      );
      const built = buildForTank(tId, labelFa);
      return {
        tankId: tId,
        tankLabelFa: labelFa,
        doseValue: built.doseValue,
        doseUnit: built.doseUnit,
        compoundFa: built.compoundFa,
        volumeContextFa: built.volumeContextFa,
        doseAmountTextFa: built.doseAmountTextFa,
        isCompletedForTank,
        additionsToRecord: built.additionsToRecord.map((item) => ({
          ...item,
          batchId: item.batchId || activeBatchId,
          milestoneId: item.milestoneId ?? milestoneId,
          dayNumber: item.dayNumber ?? latestLog?.dayNumber,
          timestampMs: item.timestampMs ?? nowMs
        }))
      };
    });
  };

  const appendRoseTankRow = (
    rows: MilestoneTankRow[],
    milestoneId: string,
    stepIds: number[],
    doseAmountTextFa: string,
    additionsToRecord: Array<Omit<ChemicalAddition, 'id'>>,
    structuredMeta?: {
      doseValue: string;
      doseUnit: string;
      compoundFa: string;
      volumeContextFa: string;
    }
  ): MilestoneTankRow[] => {
    if (options.batch?.tankCount === 1 && activeTankId !== 'tank-rose') {
      return rows;
    }
    const roseAdds = activeAdditions.filter((a) => a.tankId === 'tank-rose');
    const roseDone = isMilestoneCompletedByAdditions(
      milestoneId,
      roseAdds,
      completedStepIds,
      stepIds
    );
    rows.push({
      tankId: 'tank-rose',
      tankLabelFa: 'گالن رُزه',
      doseValue: structuredMeta?.doseValue ?? '',
      doseUnit: structuredMeta?.doseUnit ?? 'g',
      compoundFa: structuredMeta?.compoundFa ?? '',
      volumeContextFa: structuredMeta?.volumeContextFa ?? '',
      doseAmountTextFa,
      isCompletedForTank: roseDone,
      additionsToRecord: additionsToRecord.map((item) => ({
        ...item,
        batchId: item.batchId || roseBatchId,
        milestoneId: item.milestoneId ?? milestoneId,
        dayNumber: item.dayNumber ?? latestLog?.dayNumber,
        timestampMs: item.timestampMs ?? nowMs
      }))
    });
    return rows;
  };

  const blueprints: MilestoneBlueprint[] = [
    {
      id: 'crush-kms',
      roadmapStepIds: [5],
      titleFa: 'کراش و سولفیت‌زنی اولیه (۲۵ mg/L SO₂)',
      whyFa: 'حذف مخمرهای وحشی (Kloeckera) و مهار آنزیم پلی‌فنول اکسیداز در لحظه له کردن انگور.',
      howToExecuteFa: `در هر مخزن ${crushKmsG} گرم KMS را در ۵۰۰ میلی‌لیتر آب سرد حل کرده و لایه‌به‌لایه روی توده انگور اسپری کنید.`,
      scienceNoteFa: `KMS = (25 mg/L × ${initialLiquidPerTankL} L) ÷ 570 = ${crushKmsG} g`,
      confidenceLabelFa: 'محاسبهٔ استوکیومتری قطعی',
      triggerType: 'sg',
      triggerSG: dynTriggers.initialSG,
      windowCloseSG: dynTriggers.sna1,
      closedReasonFa: 'تخمیر فعال آغاز شده است؛ افزودن سولفیت در حین تخمیر مخمر را مسموم و تولید H2S می‌کند.',
      buildTankRows: () =>
        makeRedTanksRows('crush-kms', [5], (tId, labelFa) => ({
          doseValue: `${crushKmsG}`,
          doseUnit: 'g',
          compoundFa: 'متابیسولفیت پتاسیم (KMS)',
          volumeContextFa: `برای ${initialLiquidPerTankL} لیتر`,
          doseAmountTextFa: `${crushKmsG} g KMS برای ${initialLiquidPerTankL} L (${labelFa})`,
          additionsToRecord: [
            {
              batchId,
              tankId: tId,
              timestamp: timestampFa,
              stageTitle: 'روز ۰ - کراش و سولفیت‌زنی اولیه (25 mg/L SO2)',
              compoundName: 'پتاسیم متابی‌سولفیت (KMS)',
              pubchemCid: 24446,
              compoundType: 'kms',
              referenceVolumeL: initialLiquidPerTankL,
              calculatedSO2MgL: 25,
              sgAtAddition: currentSG,
              amount: crushKmsG,
              unit: 'g',
              purpose: `سولفیتاسیون اولیه ۲۵ ppm در ${initialLiquidPerTankL} لیتر فاز مایع اولیه`
            }
          ]
        }))
    },
    {
      id: 'saignee-rose',
      roadmapStepIds: [6, 7, 8],
      titleFa: 'خون‌گیری سانیه رُزه و تکمیل سولفیت (+۱۵ mg/L SO₂)',
      whyFa: 'افزایش نسبت پوست به آب‌انگور در مخازن قرمز و رساندن سولفیت پایه به ۴۰ mg/L در ۱۳۲ لیتر باقی‌مانده.',
      howToExecuteFa: `پس از ۳.۵ ساعت خیساندن سرد، از هر مخزن ۱۸ لیتر آب‌انگور زلال برای رُزه جدا کنید و سپس ${postSaigneeKmsG} گرم KMS به هر مخزن قرمز بیفزایید.`,
      scienceNoteFa: `KMS = (15 mg/L × ${redLiquidPerTankL} L) ÷ 570 = ${postSaigneeKmsG} g`,
      confidenceLabelFa: 'محاسبهٔ استوکیومتری قطعی',
      triggerType: 'day',
      triggerDay: 0,
      windowCloseSG: dynTriggers.sna1,
      closedReasonFa: 'پنجرهٔ خون‌گیری پیش از تخمیر بسته شده است.',
      buildTankRows: () =>
        makeRedTanksRows('saignee-rose', [6, 7, 8], (tId, labelFa) => ({
          doseValue: `${postSaigneeKmsG}`,
          doseUnit: 'g',
          compoundFa: 'متابیسولفیت پتاسیم (KMS)',
          volumeContextFa: `برای ${redLiquidPerTankL} لیتر`,
          doseAmountTextFa: `${postSaigneeKmsG} g KMS برای ${redLiquidPerTankL} L (${labelFa})`,
          additionsToRecord: [
            {
              batchId,
              tankId: tId,
              timestamp: timestampFa,
              stageTitle: 'روز ۰ - تکمیل سولفیت پس از خون‌گیری سانیه (+15 mg/L SO2)',
              compoundName: 'پتاسیم متابی‌سولفیت (KMS)',
              pubchemCid: 24446,
              compoundType: 'kms',
              referenceVolumeL: redLiquidPerTankL,
              calculatedSO2MgL: 14.8,
              sgAtAddition: currentSG,
              amount: postSaigneeKmsG,
              unit: 'g',
              purpose: `تکمیل دوز سولفیت در ${redLiquidPerTankL} لیتر فاز مایع پس از خون‌گیری سانیه`
            }
          ]
        }))
    },
    {
      id: 'pectic-enzyme',
      roadmapStepIds: [8, 9],
      titleFa: 'تزریق آنزیم پکتولیتیک و استخراج آنتوسیانین',
      whyFa: 'پوست ضخیم انگور رشه سردشت بدون شکستن زنجیره پکتین رنگ یاقوتی و پلی‌فنول‌های خود را کامل آزاد نمی‌کند.',
      howToExecuteFa: `حداقل ۱۵ دقیقه پس از سولفیت‌زنی صبر کنید، سپس ${pecticEnzymeRedG} گرم آنزیم پکتیناز را در آب سرد بدون کلر حل کرده و به هر مخزن اضافه کنید.`,
      scienceNoteFa: `0.055 g/L × ${redLiquidPerTankL} L = ${pecticEnzymeRedG} g Endo-Polygalacturonase`,
      confidenceLabelFa: 'محاسبهٔ استوکیومتری قطعی',
      triggerType: 'day',
      triggerDay: 0,
      windowCloseSG: dynTriggers.sna1,
      closedReasonFa: 'پنجرهٔ آنزیم‌زنی پیش از تخمیر به پایان رسیده است.',
      buildTankRows: () =>
        appendRoseTankRow(
          makeRedTanksRows('pectic-enzyme', [8, 9], (tId, labelFa) => ({
            doseValue: `${pecticEnzymeRedG}`,
            doseUnit: 'g',
            compoundFa: 'آنزیم پکتیناز',
            volumeContextFa: `برای ${redLiquidPerTankL} لیتر`,
            doseAmountTextFa: `${pecticEnzymeRedG} g آنزیم پکتیناز برای ${redLiquidPerTankL} L (${labelFa})`,
            additionsToRecord: [
              {
                batchId,
                tankId: tId,
                timestamp: timestampFa,
                stageTitle: 'روز ۰ - آنزیم‌زنی و استخراج رنگ',
                compoundName: 'آنزیم پکتیناز (Endo-Polygalacturonase)',
                compoundType: 'enzyme',
                referenceVolumeL: redLiquidPerTankL,
                sgAtAddition: currentSG,
                amount: pecticEnzymeRedG,
                unit: 'g',
                purpose: 'شکستن پکتین دیواره سلولی ضخیم انگور رشه و آزادسازی آنتوسیانین'
              }
            ]
          })),
          'pectic-enzyme',
          [8, 9],
          `${pecticEnzymeRoseG} g آنزیم پکتیناز برای ${saigneeTotalL} L (گالن رُزه)`,
          [
            {
              batchId: roseBatchId,
              tankId: 'tank-rose',
              timestamp: timestampFa,
              stageTitle: 'روز ۰ - آنزیم‌زنی و شفاف‌سازی رُزه (Débourbage)',
              compoundName: 'آنزیم پکتیناز (Endo-Polygalacturonase)',
              compoundType: 'enzyme',
              referenceVolumeL: saigneeTotalL,
              sgAtAddition: currentSG,
              amount: pecticEnzymeRoseG,
              unit: 'g',
              purpose: `شکستن پکتین و زلال‌سازی سرد در ${saigneeTotalL} لیتر شیره سانیه رُزه`
            }
          ],
          {
            doseValue: `${pecticEnzymeRoseG}`,
            doseUnit: 'g',
            compoundFa: 'آنزیم پکتیناز',
            volumeContextFa: `برای ${saigneeTotalL} لیتر`
          }
        )
    },
    {
      id: 'yeast-inoculation',
      roadmapStepIds: [13, 14],
      titleFa: 'آبرسانی مخمر Lalvin RC-212 با محافظ غشایی Go-Ferm',
      whyFa: 'تضمین غلبهٔ کامل مخمر انتخابی مقاوم به الکل و تامین استرول‌های غشایی از ساعت اول تخمیر.',
      howToExecuteFa: `${goFermRedG} گرم Go-Ferm را در آب ۴۳ درجه حل کنید، در ۳۸ درجه ${yeastRedG} گرم مخمر RC-212 را بپاشید و پس از هم‌دماسازی پله‌ای (ΔT < 5°C) به مخزن تزریق کنید.`,
      scienceNoteFa: `Yeast = 0.25 g/L (${yeastRedG} g) + Go-Ferm = 0.30 g/L (${goFermRedG} g) در ${redLiquidPerTankL} L`,
      confidenceLabelFa: 'محاسبهٔ استوکیومتری قطعی',
      triggerType: 'day',
      triggerDay: 0,
      windowCloseSG: dynTriggers.sna2,
      closedReasonFa: 'تخمیر از مرحلهٔ تلقیح اولیه عبور کرده است.',
      buildTankRows: () =>
        appendRoseTankRow(
          makeRedTanksRows('yeast-inoculation', [13, 14], (tId, labelFa) => ({
            doseValue: `${yeastRedG} + ${goFermRedG}`,
            doseUnit: 'g',
            compoundFa: 'مخمر RC-212 + Go-Ferm',
            volumeContextFa: `برای ${redLiquidPerTankL} لیتر`,
            doseAmountTextFa: `${yeastRedG} g مخمر RC-212 + ${goFermRedG} g Go-Ferm برای ${redLiquidPerTankL} L (${labelFa})`,
            additionsToRecord: [
              {
                batchId,
                tankId: tId,
                timestamp: timestampFa,
                stageTitle: 'روز ۰ - تلقیح مخمر Lalvin RC-212',
                compoundName: 'مخمر خشک فعال Lalvin RC-212',
                compoundType: 'yeast',
                referenceVolumeL: redLiquidPerTankL,
                sgAtAddition: currentSG,
                amount: yeastRedG,
                unit: 'g',
                purpose: `تلقیح مخمر انتخابی (0.25 g/L) در ${redLiquidPerTankL} لیتر`
              },
              {
                batchId,
                tankId: tId,
                timestamp: timestampFa,
                stageTitle: 'روز ۰ - محافظ غشایی Go-Ferm Protect',
                compoundName: 'Go-Ferm Protect Evolution',
                compoundType: 'go_ferm',
                referenceVolumeL: redLiquidPerTankL,
                sgAtAddition: currentSG,
                amount: goFermRedG,
                unit: 'g',
                purpose: `تامین استرول و ریزمغذی آبرسانی مخمر (0.30 g/L) در ${redLiquidPerTankL} لیتر`
              }
            ]
          })),
          'yeast-inoculation',
          [13, 14],
          `${yeastRoseG} g مخمر RC-212 + ${goFermRoseG} g Go-Ferm برای ${roseFermentL} L (گالن رُزه)`,
          [
            {
              batchId: roseBatchId,
              tankId: 'tank-rose',
              timestamp: timestampFa,
              stageTitle: 'روز ۰ - تلقیح مخمر رُزه Lalvin RC-212',
              compoundName: 'مخمر خشک فعال Lalvin RC-212',
              compoundType: 'yeast',
              referenceVolumeL: roseFermentL,
              sgAtAddition: currentSG,
              amount: yeastRoseG,
              unit: 'g',
              purpose: `تلقیح مخمر رُزه در ${roseFermentL} لیتر آب‌انگور شفاف`
            },
            {
              batchId: roseBatchId,
              tankId: 'tank-rose',
              timestamp: timestampFa,
              stageTitle: 'روز ۰ - محافظ غشایی Go-Ferm رُزه',
              compoundName: 'Go-Ferm Protect Evolution',
              compoundType: 'go_ferm',
              referenceVolumeL: roseFermentL,
              sgAtAddition: currentSG,
              amount: goFermRoseG,
              unit: 'g',
              purpose: `تامین استرول آبرسانی مخمر رُزه در ${roseFermentL} لیتر`
            }
          ],
          {
            doseValue: `${yeastRoseG} + ${goFermRoseG}`,
            doseUnit: 'g',
            compoundFa: 'مخمر RC-212 + Go-Ferm',
            volumeContextFa: `برای ${roseFermentL} لیتر`
          }
        )
    },
    {
      id: 'sna-1',
      roadmapStepIds: [16],
      titleFa: `تغذیه نوبت اول مخمر (SNA-1 در SG = ${dynTriggers.sna1.toFixed(3)})`,
      whyFa: 'تامین اسیدهای آمینه آلی (Fermaid O) در پایان فاز رشد لگاریتمی بدون ایجاد جهش حرارتی ناگهانی.',
      howToExecuteFa: `${fermaidO1RedG} گرم Fermaid O را در نمونه شیره حل کرده و همراه با پیژاژ کامل در مخزن پخش کنید.`,
      scienceNoteFa: `SG_SNA1 = SG0 - 0.10 × (SG0 - 1.000) = ${dynTriggers.sna1.toFixed(3)} | 0.25 g/L Fermaid O`,
      confidenceLabelFa: 'محاسبهٔ استوکیومتری قطعی',
      triggerType: 'sg',
      triggerSG: dynTriggers.sna1,
      windowCloseSG: dynTriggers.oneThirdCeiling,
      closedReasonFa: `پنجرهٔ SNA-1 پس از عبور از سقف ۱/۳ قند (SG ${dynTriggers.oneThirdCeiling.toFixed(3)}) بسته شد؛ به سراغ نوبت SNA-3 بروید.`,
      buildTankRows: () =>
        appendRoseTankRow(
          makeRedTanksRows('sna-1', [16], (tId, labelFa) => ({
            doseValue: `${fermaidO1RedG}`,
            doseUnit: 'g',
            compoundFa: 'Fermaid O',
            volumeContextFa: `برای ${redLiquidPerTankL} لیتر`,
            doseAmountTextFa: `${fermaidO1RedG} g Fermaid O برای ${redLiquidPerTankL} L (${labelFa})`,
            additionsToRecord: [
              {
                batchId,
                tankId: tId,
                timestamp: timestampFa,
                stageTitle: `روز ۲ - تغذیه نوبت اول (SNA-1 در SG = ${dynTriggers.sna1.toFixed(3)})`,
                compoundName: 'نیتروژن آلی (Fermaid O)',
                compoundType: 'fermaid_o',
                referenceVolumeL: redLiquidPerTankL,
                sgAtAddition: currentSG,
                amount: fermaidO1RedG,
                unit: 'g',
                purpose: `تامین نیتروژن آلی اسیدهای آمینه (0.25 g/L در ${redLiquidPerTankL} لیتر)`
              }
            ]
          })),
          'sna-1',
          [16],
          `${fermaidO1RoseG} g Fermaid O + ${zincRoseG} g سولفات روی برای ${roseFermentL} L (گالن رُزه)`,
          [
            {
              batchId: roseBatchId,
              tankId: 'tank-rose',
              timestamp: timestampFa,
              stageTitle: `روز ۲ - تغذیه نوبت اول رُزه (SNA-1 در SG = ${dynTriggers.sna1.toFixed(3)})`,
              compoundName: 'نیتروژن آلی (Fermaid O)',
              compoundType: 'fermaid_o',
              referenceVolumeL: roseFermentL,
              sgAtAddition: currentSG,
              amount: fermaidO1RoseG,
              unit: 'g',
              purpose: `تامین نیتروژن آلی رُزه در ${roseFermentL} لیتر`
            },
            {
              batchId: roseBatchId,
              tankId: 'tank-rose',
              timestamp: timestampFa,
              stageTitle: `روز ۲ - ریزمغذی روی رُزه (SNA-1 در SG = ${dynTriggers.sna1.toFixed(3)})`,
              compoundName: 'سولفات روی هپتاهیدرات (ZnSO4·7H2O)',
              compoundType: 'zinc',
              referenceVolumeL: roseFermentL,
              sgAtAddition: currentSG,
              amount: zincRoseG,
              unit: 'g',
              purpose: `تامین کوفاکتور روی برای سنتز استرهای میوه‌ای رُزه در ${roseFermentL} لیتر`
            }
          ],
          {
            doseValue: `${fermaidO1RoseG} + ${zincRoseG}`,
            doseUnit: 'g',
            compoundFa: 'Fermaid O + سولفات روی',
            volumeContextFa: `برای ${roseFermentL} لیتر`
          }
        )
    },
    {
      id: 'sna-2-dap',
      roadmapStepIds: [17],
      titleFa: `تغذیه نوبت دوم و آخرین مهلت DAP (SNA-2 در SG = ${dynTriggers.sna2.toFixed(3)})`,
      whyFa: 'رساندن نیتروژن به اوج جمعیت مخمر پیش از بسته شدن حامل‌های غشایی آمونیوم در الکل ۶٪ (SG 1.062).',
      howToExecuteFa: `${fermaidK2RedG} گرم Fermaid K + ${dapRedG} گرم DAP + ${zincRedG} گرم سولفات روی را حل کرده و پس از هوادهی ملایم تزریق کنید.`,
      scienceNoteFa: `پنجره مجاز DAP فقط تا سقف ۱/۳ مصرف قند (SG ≥ ${dynTriggers.oneThirdCeiling.toFixed(3)}) باز است.`,
      confidenceLabelFa: 'محاسبهٔ استوکیومتری قطعی',
      triggerType: 'sg',
      triggerSG: dynTriggers.sna2,
      windowCloseSG: dynTriggers.oneThirdCeiling,
      closedReasonFa:
        'پنجرهٔ DAP بسته شد؛ مصرف نیتروژن معدنی پس از یک‌سوم قند (SG 1.062) ممنوع است و فقط Fermaid O مجاز است.',
      buildTankRows: () =>
        appendRoseTankRow(
          makeRedTanksRows('sna-2-dap', [17], (tId, labelFa) => ({
            doseValue: `${fermaidK2RedG} + ${dapRedG} + ${zincRedG}`,
            doseUnit: 'g',
            compoundFa: 'Fermaid K + DAP + سولفات روی',
            volumeContextFa: `برای ${redLiquidPerTankL} لیتر`,
            doseAmountTextFa: `${fermaidK2RedG} g Fermaid K + ${dapRedG} g DAP + ${zincRedG} g Zinc برای ${redLiquidPerTankL} L (${labelFa})`,
            additionsToRecord: [
              {
                batchId,
                tankId: tId,
                timestamp: timestampFa,
                stageTitle: `روز ۳ - تغذیه نوبت دوم (SNA-2 در SG = ${dynTriggers.sna2.toFixed(3)})`,
                compoundName: 'مکمل مخمر Fermaid K',
                compoundType: 'fermaid_k',
                referenceVolumeL: redLiquidPerTankL,
                sgAtAddition: currentSG,
                amount: fermaidK2RedG,
                unit: 'g',
                purpose: `تامین نیتروژن ترکیبی و تیامین در ${redLiquidPerTankL} لیتر`
              },
              {
                batchId,
                tankId: tId,
                timestamp: timestampFa,
                stageTitle: `روز ۳ - تغذیه نوبت دوم (SNA-2 در SG = ${dynTriggers.sna2.toFixed(3)})`,
                compoundName: 'دی‌آمونیوم فسفات (DAP)',
                pubchemCid: 24261,
                compoundType: 'dap',
                referenceVolumeL: redLiquidPerTankL,
                sgAtAddition: currentSG,
                amount: dapRedG,
                unit: 'g',
                purpose: `آخرین مهلت مجاز تزریق آمونیوم معدنی پیش از SG ${dynTriggers.oneThirdCeiling.toFixed(3)}`
              },
              {
                batchId,
                tankId: tId,
                timestamp: timestampFa,
                stageTitle: `روز ۳ - ریزمغذی روی (SNA-2 در SG = ${dynTriggers.sna2.toFixed(3)})`,
                compoundName: 'سولفات روی هپتاهیدرات (ZnSO4·7H2O)',
                compoundType: 'zinc',
                referenceVolumeL: redLiquidPerTankL,
                sgAtAddition: currentSG,
                amount: zincRedG,
                unit: 'g',
                purpose: 'کوفاکتور آنزیم الکل دهیدروژناز (ADH1) در سقف ایمن ۲ mg/L'
              }
            ]
          })),
          'sna-2-dap',
          [17],
          `${fermaidK2RoseG} g Fermaid K + ${dap2RoseG} g DAP برای ${roseFermentL} L (گالن رُزه)`,
          [
            {
              batchId: roseBatchId,
              tankId: 'tank-rose',
              timestamp: timestampFa,
              stageTitle: `روز ۳ - تغذیه نوبت دوم رُزه (SNA-2 در SG = ${dynTriggers.sna2.toFixed(3)})`,
              compoundName: 'مکمل مخمر Fermaid K',
              compoundType: 'fermaid_k',
              referenceVolumeL: roseFermentL,
              sgAtAddition: currentSG,
              amount: fermaidK2RoseG,
              unit: 'g',
              purpose: `تامین نیتروژن ترکیبی رُزه در ${roseFermentL} لیتر`
            },
            {
              batchId: roseBatchId,
              tankId: 'tank-rose',
              timestamp: timestampFa,
              stageTitle: `روز ۳ - تغذیه نوبت دوم رُزه (SNA-2 در SG = ${dynTriggers.sna2.toFixed(3)})`,
              compoundName: 'دی‌آمونیوم فسفات (DAP)',
              pubchemCid: 24261,
              compoundType: 'dap',
              referenceVolumeL: roseFermentL,
              sgAtAddition: currentSG,
              amount: dap2RoseG,
              unit: 'g',
              purpose: `آخرین مهلت مجاز تزریق آمونیوم معدنی رُزه پیش از SG ${dynTriggers.oneThirdCeiling.toFixed(3)}`
            }
          ],
          {
            doseValue: `${fermaidK2RoseG} + ${dap2RoseG}`,
            doseUnit: 'g',
            compoundFa: 'Fermaid K + DAP',
            volumeContextFa: `برای ${roseFermentL} لیتر`
          }
        )
    },
    {
      id: 'phase2-tannin',
      roadmapStepIds: [18],
      titleFa: `تثبیت آنتوسیانین با تانن فاز ۲ و جمع‌آوری هسته (SG = ${dynTriggers.phase2Tannin.toFixed(3)})`,
      whyFa: 'تشکیل پیوند کووالانسی رنگدانه–تانن در حضور استالدهید و جلوگیری از استخراج تانن تلخ هسته.',
      howToExecuteFa: `هسته‌های ته‌نشین‌شده در کف مخزن را خارج کرده و ${redTanninPhase2G} گرم تانن انولوژیک قرمز را به هر مخزن اضافه کنید.`,
      scienceNoteFa: `0.10 g/L × ${redLiquidPerTankL} L = ${redTanninPhase2G} g Condensed Grape Tannin`,
      confidenceLabelFa: 'محاسبهٔ استوکیومتری قطعی',
      triggerType: 'sg',
      triggerSG: dynTriggers.phase2Tannin,
      windowCloseSG: 1.020,
      closedReasonFa: 'فاز استخراج الکلی میانی به پایان رسیده است.',
      buildTankRows: () =>
        makeRedTanksRows('phase2-tannin', [18], (tId, labelFa) => ({
          doseValue: `${redTanninPhase2G}`,
          doseUnit: 'g',
          compoundFa: 'تانن انولوژیک قرمز',
          volumeContextFa: `برای ${redLiquidPerTankL} لیتر`,
          doseAmountTextFa: `${redTanninPhase2G} g تانن قرمز برای ${redLiquidPerTankL} L (${labelFa})`,
          additionsToRecord: [
            {
              batchId,
              tankId: tId,
              timestamp: timestampFa,
              stageTitle: `روز ۳.۵ - تانن فاز ۲ و تثبیت رنگ (SG = ${dynTriggers.phase2Tannin.toFixed(3)})`,
              compoundName: 'تانن انولوژیک قرمز (Condensed Tannin)',
              compoundType: 'tannin_red',
              referenceVolumeL: redLiquidPerTankL,
              sgAtAddition: currentSG,
              amount: redTanninPhase2G,
              unit: 'g',
              purpose: 'تثبیت کمپلکس آنتوسیانین–تانن و ساختاردهی میانی کام'
            }
          ]
        }))
    },
    {
      id: 'sna-3-organic',
      roadmapStepIds: [19],
      titleFa: `تغذیه نوبت سوم ۱۰۰٪ ارگانیک (SNA-3 در SG = ${dynTriggers.sna3.toFixed(3)})`,
      whyFa: 'جلوگیری از توقف تخمیر در نیمه دوم و پیشگیری از تولید H2S بدون هیچ‌گونه نمک آمونیوم.',
      howToExecuteFa: `صرفاً ${fermaidO3RedG} گرم Fermaid O خالص را در نمونه شراب حل و به هر مخزن اضافه کنید (DAP و Fermaid K مطلقاً ممنوع!).`,
      scienceNoteFa: `SG_SNA3 = ${dynTriggers.sna3.toFixed(3)} (~38% افت قند) | ${plan.params.fermaidO3RedRateGL.toFixed(2)} g/L Fermaid O (0g DAP)`,
      confidenceLabelFa: 'محاسبهٔ استوکیومتری قطعی',
      triggerType: 'sg',
      triggerSG: dynTriggers.sna3,
      windowCloseSG: 1.030,
      closedReasonFa: 'پنجرهٔ جذب اسیدهای آمینه در پایان تخمیر بسته شده است.',
      buildTankRows: () =>
        appendRoseTankRow(
          makeRedTanksRows('sna-3-organic', [19], (tId, labelFa) => ({
            doseValue: `${fermaidO3RedG}`,
            doseUnit: 'g',
            compoundFa: 'Fermaid O',
            volumeContextFa: `برای ${redLiquidPerTankL} لیتر`,
            doseAmountTextFa: `${fermaidO3RedG} g Fermaid O برای ${redLiquidPerTankL} L (${labelFa})`,
            additionsToRecord: [
              {
                batchId,
                tankId: tId,
                timestamp: timestampFa,
                stageTitle: `روز ۴ - تغذیه نوبت سوم ۱۰۰٪ ارگانیک (SNA-3 در SG = ${dynTriggers.sna3.toFixed(3)})`,
                compoundName: 'نیتروژن آلی (Fermaid O)',
                compoundType: 'fermaid_o',
                referenceVolumeL: redLiquidPerTankL,
                sgAtAddition: currentSG,
                amount: fermaidO3RedG,
                unit: 'g',
                purpose: 'تغذیه نهایی ۱۰۰٪ ارگانیک جهت اتمام قند بدون باقیمانده آمونیوم'
              }
            ]
          })),
          'sna-3-organic',
          [19],
          `${fermaidO3RoseG} g Fermaid O برای ${roseFermentL} L (گالن رُزه)`,
          [
            {
              batchId: roseBatchId,
              tankId: 'tank-rose',
              timestamp: timestampFa,
              stageTitle: `روز ۴ - تغذیه نوبت سوم ۱۰۰٪ ارگانیک رُزه (SNA-3 در SG = ${dynTriggers.sna3.toFixed(3)})`,
              compoundName: 'نیتروژن آلی (Fermaid O)',
              compoundType: 'fermaid_o',
              referenceVolumeL: roseFermentL,
              sgAtAddition: currentSG,
              amount: fermaidO3RoseG,
              unit: 'g',
              purpose: `تغذیه نهایی ۱۰۰٪ ارگانیک رُزه در ${roseFermentL} لیتر`
            }
          ],
          {
            doseValue: `${fermaidO3RoseG}`,
            doseUnit: 'g',
            compoundFa: 'Fermaid O',
            volumeContextFa: `برای ${roseFermentL} لیتر`
          }
        )
    },
    {
      id: 'pressing',
      roadmapStepIds: [21, 22],
      titleFa: `نقطه طلایی پرسینگ و جداسازی شراب آب‌آزاد (SG = ${dynTriggers.pressingPoint.toFixed(3)})`,
      whyFa: 'جداسازی پوست پیش از صفر شدن گاز CO2 تا کلاهک غرق نشود و تانن‌های خشن به شراب نفوذ نکنند.',
      howToExecuteFa: 'ابتدا شراب آب‌آزاد (Free-Run) را با سیفون به گالن‌های شیشه‌ای منتقل کنید و تفاله را با فشار ملایم (< 1.2 bar) در گالن جداگانه پرس نمایید.',
      scienceNoteFa: 'حفظ ۲۰ گرم بر لیتر قند باقی‌مانده هنگام پرسینگ، سپر محافظ طبیعی CO2 را در گالن‌ها بازسازی می‌کند.',
      confidenceLabelFa: 'محاسبهٔ استوکیومتری قطعی',
      triggerType: 'sg',
      triggerSG: dynTriggers.pressingPoint,
      windowCloseSG: 0.996,
      closedReasonFa: 'تخمیر به خشکی رسیده است؛ فوراً جداسازی تفاله را انجام دهید.',
      buildTankRows: () =>
        makeRedTanksRows('pressing', [21, 22], (_tId, labelFa) => ({
          doseValue: `${freeRunPerTankL}`,
          doseUnit: 'L',
          compoundFa: 'شراب آب‌آزاد',
          volumeContextFa: `از ${redLiquidPerTankL} لیتر فاز مایع`,
          doseAmountTextFa: `جداسازی آب‌آزاد و پرس ملایم (${labelFa})`,
          additionsToRecord: []
        }))
    },
    {
      id: 'racking-1-gross-lees',
      roadmapStepIds: [25, 26],
      titleFa: 'سیفون اول (جداسازی دُرد درشت ۲۴ ساعته) و تست مس',
      whyFa: 'حذف سلول‌های مرده و تفاله سنگین ظرف ۲۴ تا ۴۸ ساعت پس از خشکی کامل (SG ≤ 0.993) برای جلوگیری از بوی احیایی H2S.',
      howToExecuteFa: 'شراب شفاف را از روی لایه دُرد غلیظ کف گالن سیفون کنید و در صورت وجود بوی گوگرد، تست ۵ لیوانی سولفات مس را اجرا نمایید.',
      scienceNoteFa: 'جداسازی Gross Lees در روز ۱۰ از اتولیز بدبوی مرکاپتان‌ها جلوگیری می‌کند.',
      confidenceLabelFa: 'محاسبهٔ استوکیومتری قطعی',
      triggerType: 'day',
      triggerSG: 0.994,
      triggerDay: 10,
      windowCloseDay: 15,
      closedReasonFa: 'مهلت سیفون اول گذشته است؛ هرچه سریع‌تر دُرد درشت را جدا کنید.',
      buildTankRows: () =>
        appendRoseTankRow(
          makeRedTanksRows('racking-1-gross-lees', [25, 26], (_tId, labelFa) => ({
            doseValue: `${rack1PerTankL}`,
            doseUnit: 'L',
            compoundFa: 'شراب صاف (سیفون اول)',
            volumeContextFa: `برای ${rack1PerTankL} لیتر`,
            doseAmountTextFa: `سیفون به حجم خالص ${rack1PerTankL} L (${labelFa})`,
            additionsToRecord: []
          })),
          'racking-1-gross-lees',
          [25, 26],
          `سیفون به حجم خالص ${rosePostRackingL} L (گالن رُزه)`,
          [],
          {
            doseValue: `${rosePostRackingL}`,
            doseUnit: 'L',
            compoundFa: 'شراب صاف رُزه (سیفون اول)',
            volumeContextFa: `برای ${rosePostRackingL} لیتر`
          }
        )
    },
    {
      id: 'day11-bactiless-kms-lock',
      roadmapStepIds: [27],
      titleFa: 'قفل ضدباکتری بدون مالولاکتیک (Bactiless + KMS روز ۱۱)',
      whyFa: 'حذف کامل باکتری‌های اسید لاکتیک (Oenococcus) و استوباکتر برای حفظ طراوت اسید طبیعی انگور رشه و جلوگیری از پرش pH.',
      howToExecuteFa: `در هر مخزن (${rack1PerTankL} لیتر شراب صاف پس از سیفون اول) ابتدا ${bactilessRedG} گرم Bactiless و سپس ${day11KmsG} گرم KMS تزریق کنید.`,
      scienceNoteFa: `Bactiless = 0.30 g/L (${bactilessRedG} g) | KMS = (40 mg/L × ${rack1PerTankL} L) ÷ 570 = ${day11KmsG} g`,
      confidenceLabelFa: 'محاسبهٔ استوکیومتری قطعی',
      triggerType: 'day',
      triggerSG: 0.994,
      triggerDay: 11,
      windowCloseDay: 20,
      closedReasonFa: 'پنجرهٔ تثبیت اولیه روز ۱۱ گذشته است؛ فوراً سطح Free SO2 را بررسی کنید.',
      buildTankRows: () =>
        appendRoseTankRow(
          makeRedTanksRows('day11-bactiless-kms-lock', [27], (tId, labelFa) => ({
            doseValue: `${bactilessRedG} + ${day11KmsG}`,
            doseUnit: 'g',
            compoundFa: 'باکتیلس + KMS',
            volumeContextFa: `برای ${rack1PerTankL} لیتر`,
            doseAmountTextFa: `${bactilessRedG} g Bactiless + ${day11KmsG} g KMS برای ${rack1PerTankL} L (${labelFa})`,
            additionsToRecord: [
              {
                batchId,
                tankId: tId,
                timestamp: timestampFa,
                stageTitle: 'روز ۱۱ - قفل کیتوزان ضدباکتری (Bactiless No-MLF Lock)',
                compoundName: 'کیتوزان قارچی (Bactiless)',
                compoundType: 'bactiless',
                referenceVolumeL: rack1PerTankL,
                sgAtAddition: currentSG,
                amount: bactilessRedG,
                unit: 'g',
                purpose: `حذف باکتری‌های اسید لاکتیک و استیک (0.30 g/L در ${rack1PerTankL} لیتر)`
              },
              {
                batchId,
                tankId: tId,
                timestamp: timestampFa,
                stageTitle: 'روز ۱۱ - تثبیت سولفیت پس از تخمیر (40 mg/L SO2)',
                compoundName: 'پتاسیم متابی‌سولفیت (KMS)',
                pubchemCid: 24446,
                compoundType: 'kms',
                referenceVolumeL: rack1PerTankL,
                calculatedSO2MgL: 40,
                sgAtAddition: currentSG,
                amount: day11KmsG,
                unit: 'g',
                purpose: `تثبیت شراب خشک با ۴۰ ppm سولفیت در ${rack1PerTankL} لیتر شراب صاف`
              }
            ]
          })),
          'day11-bactiless-kms-lock',
          [27],
          `${bactilessRoseG} g Bactiless + ${rosePostFermKmsG} g KMS برای ${rosePostRackingL} L (گالن رُزه)`,
          [
            {
              batchId: roseBatchId,
              tankId: 'tank-rose',
              timestamp: timestampFa,
              stageTitle: 'روز ۱۱ - قفل کیتوزان ضدباکتری رُزه (Bactiless No-MLF Lock)',
              compoundName: 'کیتوزان قارچی (Bactiless)',
              compoundType: 'bactiless',
              referenceVolumeL: rosePostRackingL,
              sgAtAddition: currentSG,
              amount: bactilessRoseG,
              unit: 'g',
              purpose: `حذف باکتری‌های اسید لاکتیک و حفظ اسید مالیک رُزه در ${rosePostRackingL} لیتر`
            },
            {
              batchId: roseBatchId,
              tankId: 'tank-rose',
              timestamp: timestampFa,
              stageTitle: 'روز ۱۱ - تثبیت سولفیت پس از تخمیر رُزه',
              compoundName: 'پتاسیم متابی‌سولفیت (KMS)',
              pubchemCid: 24446,
              compoundType: 'kms',
              referenceVolumeL: rosePostRackingL,
              calculatedSO2MgL: 45,
              sgAtAddition: currentSG,
              amount: rosePostFermKmsG,
              unit: 'g',
              purpose: `تثبیت شراب رُزه خشک در ${rosePostRackingL} لیتر`
            }
          ],
          {
            doseValue: `${bactilessRoseG} + ${rosePostFermKmsG}`,
            doseUnit: 'g',
            compoundFa: 'باکتیلس + KMS',
            volumeContextFa: `برای ${rosePostRackingL} لیتر`
          }
        )
    },
    {
      id: 'day21-bactiless-racking',
      roadmapStepIds: [28],
      titleFa: 'سیفون جداسازی رسوب Bactiless (روز ۲۱ — پایان ۱۰ روز تماس)',
      whyFa: 'خارج کردن باکتری‌های لیزشده و فیبر کیتوزان ته‌نشین‌شده پس از ۱۰ روز تماس کامل.',
      howToExecuteFa: 'شراب زلال را بدون برهم زدن رسوب کف گالن به ظرف تمیز پرشده از گاز CO2 سیفون کرده و گلوگاه را کاملاً لب‌به‌لب (Top-up) کنید.',
      scienceNoteFa: 'تماس ۵ تا ۱۰ روزه با Bactiless برای حذف کامل باکتری‌های گرم‌مثبت کافی است.',
      confidenceLabelFa: 'محاسبهٔ استوکیومتری قطعی',
      triggerType: 'day',
      triggerDay: 21,
      windowCloseDay: 28,
      closedReasonFa: 'پنجرهٔ ۱۰ روزهٔ تماس باکتی‌لس به پایان رسیده است.',
      buildTankRows: () =>
        appendRoseTankRow(
          makeRedTanksRows('day21-bactiless-racking', [28], (_tId, labelFa) => ({
            doseValue: `${rack1PerTankL}`,
            doseUnit: 'L',
            compoundFa: 'سیفون جداسازی باکتیلس',
            volumeContextFa: `برای ${rack1PerTankL} لیتر`,
            doseAmountTextFa: `سیفون از روی رسوب باکتی‌لس (${labelFa})`,
            additionsToRecord: []
          })),
          'day21-bactiless-racking',
          [28],
          'سیفون از روی رسوب باکتیلس (گالن رُزه)',
          [],
          {
            doseValue: `${rosePostRackingL}`,
            doseUnit: 'L',
            compoundFa: 'سیفون جداسازی باکتیلس رُزه',
            volumeContextFa: `برای ${rosePostRackingL} لیتر`
          }
        )
    },
    {
      id: 'day65-cold-stab',
      roadmapStepIds: [37],
      titleFa: 'پایدارسازی سرد ۱۴ روزه (۰ تا +۲ درجه) و بذرپاشی کرم تارتار',
      whyFa: 'رسوب دادن پتاسیم و بی‌تارتارات مازاد در کارگاه تا در یخچال مصرف‌کننده کریستال شیشه‌ای ته بطری تشکیل نشود.',
      howToExecuteFa: `دمای شراب را به ۰ تا +۲ درجه برسانید و ${khtRedG} گرم بی‌تارتارات پتاسیم (KHT) به هر مخزن اضافه و هم بزنید.`,
      scienceNoteFa: `0.20 g/L KHT × ${finalRedPerTankL} L = ${khtRedG} g Contact Seeding`,
      confidenceLabelFa: 'محاسبهٔ استوکیومتری قطعی',
      triggerType: 'day',
      triggerDay: 65,
      windowCloseDay: 80,
      closedReasonFa: 'پنجرهٔ استاندارد پایدارسازی سرد روز ۶۵ گذشته است.',
      buildTankRows: () =>
        appendRoseTankRow(
          makeRedTanksRows('day65-cold-stab', [37], (tId, labelFa) => ({
            doseValue: `${khtRedG}`,
            doseUnit: 'g',
            compoundFa: 'بی‌تارتارات پتاسیم (KHT)',
            volumeContextFa: `برای ${finalRedPerTankL} لیتر`,
            doseAmountTextFa: `${khtRedG} g KHT برای ${finalRedPerTankL} L (${labelFa})`,
            additionsToRecord: [
              {
                batchId,
                tankId: tId,
                timestamp: timestampFa,
                stageTitle: 'روز ۶۵ - بذرپاشی کرم تارتار و پایدارسازی سرد',
                compoundName: 'بی‌تارتارات پتاسیم (KHT / کرم تارتار)',
                compoundType: 'kht',
                referenceVolumeL: finalRedPerTankL,
                sgAtAddition: currentSG,
                amount: khtRedG,
                unit: 'g',
                purpose: `نطفه‌گذاری کریستال تارتارات در دمای ۰ تا ۲ درجه (${finalRedPerTankL} لیتر)`
              }
            ]
          })),
          'day65-cold-stab',
          [37],
          `${khtColdStabRoseG} g KHT برای ${rosePostRackingL} L (گالن رُزه)`,
          [
            {
              batchId: roseBatchId,
              tankId: 'tank-rose',
              timestamp: timestampFa,
              stageTitle: 'روز ۶۵ - بذرپاشی کرم تارتار و پایدارسازی سرد رُزه',
              compoundName: 'بی‌تارتارات پتاسیم (KHT / کرم تارتار)',
              compoundType: 'kht',
              referenceVolumeL: rosePostRackingL,
              sgAtAddition: currentSG,
              amount: khtColdStabRoseG,
              unit: 'g',
              purpose: `نطفه‌گذاری کریستال تارتارات رُزه در ${rosePostRackingL} لیتر`
            }
          ],
          {
            doseValue: `${khtColdStabRoseG}`,
            doseUnit: 'g',
            compoundFa: 'بی‌تارتارات پتاسیم (KHT)',
            volumeContextFa: `برای ${rosePostRackingL} لیتر`
          }
        )
    },
    {
      id: 'day100-bottling',
      roadmapStepIds: [41, 42, 44, 45, 46],
      titleFa: 'تنظیم نهایی سولفیت، اسید اسکوربیک و بطری‌گذاری استریل (روز ۹۹–۱۰۰)',
      whyFa: 'قفل کردن اکسیژن محلول هنگام پر کردن بطری و تضمین پایداری آروماتیک بلندمدت.',
      howToExecuteFa: `در روز ۹۹ (۲۴ ساعت پیش از بطریگیری) ابتدا ${preBottlingKmsG} گرم KMS تزریق کنید تا سولفیت آزاد بالای ۳۵ mg/L تثبیت شود؛ سپس در روز ۱۰۰ (۳۰ دقیقه پیش از پر کردن بطری) ${ascorbicRedG} گرم اسید اسکوربیک اضافه نمایید.`,
      scienceNoteFa: `Ascorbic = 0.04 g/L (${ascorbicRedG} g) + Pre-bottling KMS = ${preBottlingKmsG} g`,
      confidenceLabelFa: 'محاسبهٔ استوکیومتری قطعی',
      triggerType: 'day',
      triggerDay: 99,
      windowCloseDay: 120,
      closedReasonFa: 'چرخهٔ ۱۰۰ روزه به پایان رسیده است.',
      buildTankRows: () =>
        appendRoseTankRow(
          makeRedTanksRows('day100-bottling', [41, 42, 44, 45, 46], (tId, labelFa) => ({
            doseValue: `${preBottlingKmsG} + ${ascorbicRedG}`,
            doseUnit: 'g',
            compoundFa: 'KMS + اسید اسکوربیک',
            volumeContextFa: `برای ${finalRedPerTankL} لیتر`,
            doseAmountTextFa: `${preBottlingKmsG} g KMS + ${ascorbicRedG} g اسکوربیک برای ${finalRedPerTankL} L (${labelFa})`,
            additionsToRecord: [
              {
                batchId,
                tankId: tId,
                timestamp: timestampFa,
                stageTitle: 'روز ۹۹ - تنظیم سولفیت پیش از بطری‌گذاری',
                compoundName: 'پتاسیم متابی‌سولفیت (KMS)',
                pubchemCid: 24446,
                compoundType: 'kms',
                referenceVolumeL: finalRedPerTankL,
                sgAtAddition: currentSG,
                amount: preBottlingKmsG,
                unit: 'g',
                purpose: `تنظیم نهایی Free SO2 پیش از بطری‌گذاری در ${finalRedPerTankL} لیتر`
              },
              {
                batchId,
                tankId: tId,
                timestamp: timestampFa,
                stageTitle: 'روز ۱۰۰ - آنتی‌اکسیدان اسید اسکوربیک پیش از بطری‌گذاری',
                compoundName: 'اسید اسکوربیک خوراکی (L-Ascorbic Acid)',
                compoundType: 'ascorbic',
                referenceVolumeL: finalRedPerTankL,
                sgAtAddition: currentSG,
                amount: ascorbicRedG,
                unit: 'g',
                purpose: `حذف فوری اکسیژن محلول هنگام بطری‌گذاری (${finalRedPerTankL} لیتر)`
              }
            ]
          })),
          'day100-bottling',
          [41, 42, 44, 45, 46],
          `${rosePreBottlingKmsG} g KMS + ${ascorbicRoseG} g اسکوربیک برای ${roseFinalBottlingL} L (گالن رُزه)`,
          [
            {
              batchId: roseBatchId,
              tankId: 'tank-rose',
              timestamp: timestampFa,
              stageTitle: 'روز ۹۹ - تنظیم سولفیت پیش از بطری‌گذاری رُزه',
              compoundName: 'پتاسیم متابی‌سولفیت (KMS)',
              pubchemCid: 24446,
              compoundType: 'kms',
              referenceVolumeL: roseFinalBottlingL,
              sgAtAddition: currentSG,
              amount: rosePreBottlingKmsG,
              unit: 'g',
              purpose: `تنظیم نهایی Free SO2 رُزه پیش از بطری‌گذاری در ${roseFinalBottlingL} لیتر`
            },
            {
              batchId: roseBatchId,
              tankId: 'tank-rose',
              timestamp: timestampFa,
              stageTitle: 'روز ۱۰۰ - آنتی‌اکسیدان اسید اسکوربیک پیش از بطری‌گذاری رُزه',
              compoundName: 'اسید اسکوربیک خوراکی (L-Ascorbic Acid)',
              compoundType: 'ascorbic',
              referenceVolumeL: roseFinalBottlingL,
              sgAtAddition: currentSG,
              amount: ascorbicRoseG,
              unit: 'g',
              purpose: `حذف فوری اکسیژن محلول رُزه هنگام بطری‌گذاری (${roseFinalBottlingL} لیتر)`
            }
          ],
          {
            doseValue: `${rosePreBottlingKmsG} + ${ascorbicRoseG}`,
            doseUnit: 'g',
            compoundFa: 'KMS + اسید اسکوربیک',
            volumeContextFa: `برای ${roseFinalBottlingL} لیتر`
          }
        )
    }
  ];

  const redOnlyMilestoneIds = new Set([
    'crush-kms',
    'saignee-rose',
    'phase2-tannin',
    'pressing'
  ]);
  const effectiveBlueprints =
    activeTankId === 'tank-rose'
      ? blueprints.filter((bp) => !redOnlyMilestoneIds.has(bp.id))
      : blueprints;

  const allMilestones: RightNowMilestone[] = effectiveBlueprints.map((bp) => {
    const tankRows = bp.buildTankRows();
    const activeRow =
      tankRows.find((r) => r.tankId === activeTankId) ?? tankRows[0];
    const isCompleted = activeRow ? activeRow.isCompletedForTank : false;
    const skippedReasonFa = skippedMap[bp.id];
    const snoozedUntilMs = snoozedMap[bp.id];

    let state: MilestoneState = 'pending';
    let estimatedHoursUntilDue: { min: number; max: number } | undefined;

    if (skippedReasonFa) {
      state = 'skipped';
    } else if (isCompleted) {
      state = 'completed';
    } else if (bp.triggerType === 'sg' && bp.triggerSG !== undefined) {
      const closeSG = bp.windowCloseSG;
      const isClosed =
        closeSG !== undefined && currentSG < closeSG;

      if (isClosed) {
        state = 'closed';
      } else if (bp.id === 'crush-kms') {
        if (currentDay === 0 && currentSG >= bp.triggerSG - 0.004) {
          state = 'due';
        } else {
          state = 'missed';
        }
      } else if (
        currentSG <= bp.triggerSG + 0.002 &&
        currentSG >= bp.triggerSG - 0.003
      ) {
        state = 'due';
      } else if (currentSG < bp.triggerSG - 0.003) {
        state = 'missed';
      } else {
        state = 'pending';
        const deltaSG = Math.max(0, currentSG - bp.triggerSG);
        const baseHours = (deltaSG / velocityPerDay) * 24 + lagBufferHours;
        const min = Math.max(1, Math.round(baseHours * 0.8));
        const max = Math.max(min + 1, Math.round(baseHours * 1.25));
        estimatedHoursUntilDue = { min, max };
      }
    } else if (bp.triggerType === 'day') {
      if (bp.triggerDay === 0) {
        if (bp.windowCloseSG !== undefined && currentSG <= bp.windowCloseSG) {
          state = 'closed';
        } else if (currentDay === 0) {
          state = 'due';
        } else {
          state = 'missed';
        }
      } else {
        const reqDay = bp.triggerDay ?? 0;
        if (
          bp.triggerSG !== undefined &&
          currentSG > bp.triggerSG + 0.003 &&
          currentDay < reqDay
        ) {
          state = 'pending';
          const deltaSG = Math.max(0, currentSG - bp.triggerSG);
          const baseHours = (deltaSG / velocityPerDay) * 24 + lagBufferHours;
          const min = Math.max(1, Math.round(baseHours * 0.8));
          const max = Math.max(min + 1, Math.round(baseHours * 1.25));
          estimatedHoursUntilDue = { min, max };
        } else if (bp.windowCloseDay !== undefined && currentDay > bp.windowCloseDay) {
          state = 'closed';
        } else if (currentDay > reqDay + 2) {
          state = 'missed';
        } else if (currentDay >= reqDay || (bp.triggerSG !== undefined && currentSG <= bp.triggerSG)) {
          state = 'due';
        } else {
          state = 'pending';
          const deltaDays = Math.max(1, reqDay - currentDay);
          const baseHours = deltaDays * 24;
          estimatedHoursUntilDue = {
            min: Math.round(baseHours * 0.8),
            max: Math.round(baseHours * 1.25)
          };
        }
      }
    }

    const canMarkDone =
      state === 'due' || state === 'missed' || state === 'pending';

    return {
      id: bp.id,
      roadmapStepIds: bp.roadmapStepIds,
      titleFa: bp.titleFa,
      whyFa: bp.whyFa,
      howToExecuteFa: bp.howToExecuteFa,
      scienceNoteFa: bp.scienceNoteFa,
      confidenceLabelFa: bp.confidenceLabelFa,
      triggerType: bp.triggerType,
      triggerSG: bp.triggerSG,
      windowCloseSG: bp.windowCloseSG,
      triggerDay: bp.triggerDay,
      windowCloseDay: bp.windowCloseDay,
      state,
      stateBadgeFa: getStateBadgeFa(state),
      closedReasonFa: state === 'closed' ? bp.closedReasonFa : undefined,
      canMarkDone: state !== 'closed' && state !== 'completed' && state !== 'skipped' && canMarkDone,
      estimatedHoursUntilDue,
      skippedReasonFa,
      snoozedUntilMs,
      tankRows
    };
  });

  const nonSnoozedActionable = allMilestones.filter(
    (m) =>
      (m.state === 'due' || m.state === 'missed') &&
      !(m.snoozedUntilMs !== undefined && m.snoozedUntilMs > nowMs)
  );
  // Prioritize 'missed' urgent catch-up (with sna-2-dap prioritized before sna-1) or 'due' milestones
  const missedActionable = nonSnoozedActionable.filter((m) => m.state === 'missed');
  const dueActionable = nonSnoozedActionable.filter((m) => m.state === 'due');
  const primaryAction =
    missedActionable.find((m) => m.id === 'sna-2-dap') ??
    missedActionable[0] ??
    dueActionable.find((m) => m.id === 'sna-2-dap') ??
    dueActionable[0] ??
    null;

  const overdueActions = allMilestones.filter((m) => m.state === 'missed');
  const closedActions = allMilestones.filter((m) => m.state === 'closed');
  const upcomingActions = allMilestones
    .filter((m) => m.state === 'pending')
    .slice(0, 2);

  return {
    sgAnomaly,
    primaryAction,
    overdueActions,
    closedActions,
    upcomingActions,
    allMilestones
  };
}

export function evaluateDeadlineCountdowns(options: {
  logs: FermentationLogEntry[];
  additions: ChemicalAddition[];
  labAnalyses?: LabAnalysisRecord[];
  tankId?: TankId;
  plan?: DynamicProtocolPlan;
  batch?: WineBatch;
  batchId?: string;
  excludeDemo?: boolean;
}): DeadlineCountdownItem[] {
  const tankId: TankId = options.tankId ?? 'tank-a';
  const isRose = tankId === 'tank-rose';
  const plan = getEffectiveProtocolPlanForBatch(options.batch, options.plan);
  const dynTriggers = calculateDynamicSGTriggers(plan.triggers.initialSG, {
    pressingPoint: plan.triggers.pressingSG,
    drynessPoint: isRose ? 0.991 : plan.triggers.drynessSG
  });

  const activeBatchId = options.batchId ?? options.batch?.id ?? 'batch-rasha-1403';
  const hasExplicitBatchFilter = Boolean(options.batchId || options.batch?.id);
  const rejectOrphanRecords = Boolean(
    hasExplicitBatchFilter && options.excludeDemo === true
  );
  const hasRealUserData = Boolean(
    options.excludeDemo ||
      options.batch?.isDemo === false ||
      options.logs.some(
        (l) =>
          !l.isDeleted &&
          !l.isBenchmark &&
          !l.isDemo &&
          (!l.batchId ? !rejectOrphanRecords : l.batchId === activeBatchId)
      ) ||
      options.additions.some(
        (a) =>
          !a.isDeleted &&
          !a.isDemo &&
          (!a.batchId ? !rejectOrphanRecords : a.batchId === activeBatchId)
      )
  );

  const isRecordMatchingActiveBatch = (recordBatchId?: string, recordTankId?: TankId): boolean => {
    if (!hasExplicitBatchFilter) return true;
    if (!recordBatchId) {
      return !rejectOrphanRecords;
    }
    if (recordBatchId === activeBatchId) return true;
    if (
      !hasRealUserData &&
      activeBatchId === 'batch-rasha-1403' &&
      recordTankId === 'tank-rose' &&
      recordBatchId === 'batch-rose-1403'
    ) {
      return true;
    }
    return false;
  };

  const tankLogsAll = options.logs.filter((l) => {
    if (l.isDeleted || l.tankId !== tankId) return false;
    if (!isRecordMatchingActiveBatch(l.batchId, l.tankId)) {
      return false;
    }
    if (hasRealUserData && (l.isDemo === true || l.isBenchmark === true)) {
      return false;
    }
    return true;
  });
  const realTankLogs = tankLogsAll.filter((l) => !l.isBenchmark);
  const sortedLogs = sortFermentationLogs(
    realTankLogs.length > 0 ? realTankLogs : tankLogsAll
  );
  const latestLog = sortedLogs[sortedLogs.length - 1];
  const currentSG = latestLog ? latestLog.sg : dynTriggers.initialSG;
  const currentDay = latestLog ? latestLog.dayNumber : 0;
  const currentPH = latestLog ? latestLog.ph : 3.52;

  const tankAdditions = options.additions.filter((a) => {
    if (a.isDeleted || a.tankId !== tankId) return false;
    if (!isRecordMatchingActiveBatch(a.batchId, a.tankId)) {
      return false;
    }
    if (hasRealUserData && a.isDemo === true) {
      return false;
    }
    return true;
  });

  const items: DeadlineCountdownItem[] = [];

  // 1. DAP 1/3 Sugar Break Window (SG 1.062)
  const sna2Done = isMilestoneCompletedByAdditions(
    'sna-2-dap',
    tankAdditions,
    [],
    [17]
  );
  if (!sna2Done && currentSG > 1.010) {
    const oneThirdCeiling = dynTriggers.oneThirdCeiling;
    if (currentSG < oneThirdCeiling) {
      items.push({
        id: 'dap_window',
        titleFa: 'پنجرهٔ قانونی تغذیه DAP (سقف ۱/۳ مصرف قند)',
        rangeTextFa: 'پنجره بسته شد',
        color: 'gray',
        urgencyLevel: 'closed',
        explanationFa: `چگالی به ${currentSG.toFixed(3)} رسیده و از مرز ${oneThirdCeiling.toFixed(3)} عبور کرده است؛ افزودن DAP یا Fermaid K در الکل بالای ۶٪ ممنوع است (صرفاً Fermaid O مجاز است).`
      });
    } else {
      const velInfo = calculateRecentLogVelocity(
        sortedLogs,
        dynTriggers.initialSG
      );
      const vel =
        velInfo.hasObservedVelocity && velInfo.recentVelocityPerDay > 0.001
          ? velInfo.recentVelocityPerDay
          : 0.015;
      const lagBufferHours =
        currentDay <= 1 && !velInfo.hasObservedVelocity ? 24 : 0;
      const baseHours = ((currentSG - oneThirdCeiling) / vel) * 24 + lagBufferHours;
      const minH = Math.max(1, Math.round(baseHours * 0.8));
      const maxH = Math.max(minH + 1, Math.round(baseHours * 1.25));

      const color: DeadlineCountdownItem['color'] =
        baseHours > 24 ? 'emerald' : baseHours >= 6 ? 'amber' : 'rose';
      const urgencyLevel: DeadlineCountdownItem['urgencyLevel'] =
        baseHours > 24 ? 'safe' : baseHours >= 6 ? 'warning' : 'critical';

      items.push({
        id: 'dap_window',
        titleFa: 'مهلت باقی‌مانده تا بسته شدن پنجرهٔ DAP (SG 1.062)',
        rangeTextFa: `حدود ${minH} تا ${maxH} ساعت تا بسته شدن پنجرهٔ DAP`,
        color,
        urgencyLevel,
        explanationFa: `بر اساس سرعت افت چگالی فعلی (${vel.toFixed(3)} SG/day)، پنجرهٔ مجاز نیتروژن معدنی در SG = ${oneThirdCeiling.toFixed(3)} بسته می‌شود.`
      });
    }
  }

  // 2. Bactiless 5-10 Day Contact Window
  const bactilessAdd = tankAdditions.find(
    (a) =>
      a.compoundType === 'bactiless' ||
      /bactiless|ب[ا]?کتی[‌]?لس/i.test(`${a.stageTitle} ${a.purpose} ${a.compoundName}`)
  );
  const racking21Done = isMilestoneCompletedByAdditions(
    'day21-bactiless-racking',
    tankAdditions,
    [],
    [28]
  );
  if (bactilessAdd && !racking21Done) {
    let elapsedDays = 0;
    if (bactilessAdd.dayNumber !== undefined) {
      elapsedDays = Math.max(0, currentDay - bactilessAdd.dayNumber);
    } else if (
      bactilessAdd.timestampMs !== undefined &&
      latestLog?.timestampMs !== undefined &&
      latestLog.timestampMs >= bactilessAdd.timestampMs
    ) {
      elapsedDays = Math.max(
        0,
        Math.round((latestLog.timestampMs - bactilessAdd.timestampMs) / (1000 * 60 * 60 * 24))
      );
    } else {
      const addDayMatch = bactilessAdd.stageTitle.match(/روز\s*([۰-۹0-9]+)/);
      let addDay = 11;
      if (addDayMatch) {
        const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
        const ascii = addDayMatch[1].replace(/[۰-۹]/g, (d) => String(persianDigits.indexOf(d)));
        const parsed = Number.parseInt(ascii, 10);
        if (!Number.isNaN(parsed)) addDay = parsed;
      } else if (/یازدهم/.test(bactilessAdd.stageTitle)) {
        addDay = 11;
      } else if (/دوازدهم/.test(bactilessAdd.stageTitle)) {
        addDay = 12;
      } else if (/دهم/.test(bactilessAdd.stageTitle)) {
        addDay = 10;
      }
      elapsedDays = Math.max(0, currentDay - addDay);
    }
    const color: DeadlineCountdownItem['color'] =
      elapsedDays > 10 ? 'rose' : elapsedDays >= 5 ? 'amber' : 'emerald';
    const urgencyLevel: DeadlineCountdownItem['urgencyLevel'] =
      elapsedDays > 10 ? 'critical' : elapsedDays >= 5 ? 'warning' : 'safe';

    items.push({
      id: 'bactiless_contact',
      titleFa: 'پنجرهٔ تماس کیتوزان (Bactiless) تا سیفون',
      rangeTextFa: `روز ${elapsedDays} از ۱۰ تماس؛ سیفون از ۵ تا ۱۰ روز پس از افزودن`,
      color,
      urgencyLevel,
      explanationFa:
        'کیتوزان قارچی پس از ۵ تا ۱۰ روز دیواره سلولی باکتری‌ها را کامل لیز کرده و باید پیش از ایجاد طعم گس از شراب سیفون شود.'
    });
  }

  // 3. Post-Dryness Unprotected Wine Alert (SG <= 0.995)
  if (latestLog && latestLog.sg <= 0.995) {
    const targetSO2 = getContinuousTargetFreeSO2ByPH(currentPH, isRose);
    const hasPostFermKms = tankAdditions.some(
      (a) =>
        (a.compoundType === 'kms' || a.pubchemCid === 24446 || a.compoundName.includes('KMS')) &&
        ((a.sgAtAddition !== undefined && a.sgAtAddition <= 1.000) ||
          a.stageTitle.includes('روز ۱۱') ||
          a.stageTitle.includes('پس از تخمیر') ||
          a.stageTitle.includes('بطری'))
    );
    const hasAdequateFreeSO2 =
      latestLog.freeSO2 !== undefined && latestLog.freeSO2 >= targetSO2.min;

    if (!hasPostFermKms && !hasAdequateFreeSO2) {
      items.push({
        id: 'post_dryness_so2',
        titleFa: 'هشدار فوری: شراب خشک بدون سپر محافظ سولفیت (Free SO₂)',
        rangeTextFa: 'اقدام فوری — حفاظت سولفیتی صفر پس از توقف CO₂',
        color: 'rose',
        urgencyLevel: 'critical',
        explanationFa: `تخمیر به خشکی رسیده است (SG = ${latestLog.sg.toFixed(3)}) و دیگر لایه محافظ گاز CO2 تولید نمی‌شود. برای pH = ${currentPH.toFixed(2)} حداقل ${targetSO2.min} mg/L سولفیت آزاد (هدف: ${targetSO2.target} mg/L) الزامی است.`
      });
    }
  }

  return items;
}

export function evaluateBottlingReadinessGate(options: {
  logs: FermentationLogEntry[];
  additions: ChemicalAddition[];
  labAnalyses: LabAnalysisRecord[];
  batch?: WineBatch;
  batchId?: string;
  excludeDemo?: boolean;
  tankId?: TankId;
  requireRsLabConfirmation?: boolean;
  manualConfirmations?: {
    clarityConfirmed?: boolean;
    coldStabConfirmedOrSkipped?: boolean;
    warmTestPassed?: boolean;
    sanitationConfirmed?: boolean;
    malicRiskAccepted?: boolean;
    clinitestPassed?: boolean;
    rsConfirmed?: boolean;
  };
  riskOverrideReason?: string;
  nowMs?: number;
}): BottlingReadinessResult {
  const tankId: TankId = options.tankId ?? 'tank-a';
  const isRose = tankId === 'tank-rose';
  const nowMs = options.nowMs ?? Date.now();
  const confirmations = options.manualConfirmations ?? {};
  const activeBatchId = options.batchId ?? options.batch?.id;
  const hasExplicitBatchFilter = Boolean(activeBatchId);
  const rejectOrphanRecords = Boolean(
    hasExplicitBatchFilter && options.excludeDemo === true
  );

  const matchesBatch = (recordBatchId?: string): boolean => {
    if (!hasExplicitBatchFilter) return true;
    if (!recordBatchId) return !rejectOrphanRecords;
    return recordBatchId === activeBatchId;
  };

  const tankLogsAll = options.logs.filter((l) => !l.isDeleted && l.tankId === tankId);
  const realLogs = tankLogsAll.filter(
    (l) => !l.isBenchmark && !l.isDemo && matchesBatch(l.batchId)
  );
  const sortedLogs = sortFermentationLogs(realLogs);

  const tankAdditions = options.additions.filter(
    (a) => !a.isDeleted && !a.isDemo && a.tankId === tankId && matchesBatch(a.batchId)
  );
  const tankAnalyses = options.labAnalyses.filter(
    (a) => !a.isDeleted && !a.isDemo && a.tankId === tankId && matchesBatch(a.batchId)
  );

  // Blocking Check 1: Complete Dryness & Stable SG <= 0.995 across >= 3 consecutive logs spanning >= 7 days
  const lastThreeLogs = sortedLogs.slice(-3);
  const hasThreeDryLogs =
    lastThreeLogs.length >= 3 && lastThreeLogs.every((l) => l.sg <= 0.995);
  let daySpan = 0;
  let sgSpread = 1;
  if (lastThreeLogs.length >= 3) {
    daySpan = lastThreeLogs[2].dayNumber - lastThreeLogs[0].dayNumber;
    const sgs = lastThreeLogs.map((l) => l.sg);
    sgSpread = Math.max(...sgs) - Math.min(...sgs);
  }
  const rsLabRecords = tankAnalyses.filter((a) =>
    /clinitest|قند باقی|residual sugar|\brs\b/i.test(`${a.targetAnalyte} ${a.notes ?? ''}`)
  );
  const hasExplicitHighRsFailure = rsLabRecords.some(
    (a) => typeof a.measuredValue === 'number' && a.measuredValue >= 2.0
  );
  const hasRsConfirmed =
    !hasExplicitHighRsFailure &&
    (Boolean(confirmations.clinitestPassed || confirmations.rsConfirmed) ||
      rsLabRecords.some(
        (a) => typeof a.measuredValue === 'number' && a.measuredValue < 2.0
      ));
  const drynessSgStable = hasThreeDryLogs && daySpan >= 7 && sgSpread <= 0.0015;
  const drynessDataStatus: BottlingGateCheckItem['dataStatus'] =
    !drynessSgStable || hasExplicitHighRsFailure
      ? 'failed'
      : hasRsConfirmed
      ? 'verified'
      : 'incomplete_data';
  const drynessPassed =
    drynessSgStable &&
    !hasExplicitHighRsFailure &&
    (!options.requireRsLabConfirmation || hasRsConfirmed);

  const latestLog = sortedLogs[sortedLogs.length - 1];
  const currentPH = latestLog ? latestLog.ph : 3.52;
  const contSO2Target = getContinuousTargetFreeSO2ByPH(currentPH, isRose);
  const so2UpperCeiling = contSO2Target.max;

  // Blocking Check 2: Recent Free SO2 within 48h meeting continuous pH target (both min and max ceiling)
  const ripperRecords = [...tankAnalyses]
    .filter((a) => a.testType === 'ripper_so2' && typeof a.measuredValue === 'number')
    .sort((a, b) => {
      if (
        a.timestampMs !== undefined &&
        b.timestampMs !== undefined &&
        a.timestampMs !== b.timestampMs
      ) {
        return b.timestampMs - a.timestampMs;
      }
      if (
        a.dayNumber !== undefined &&
        b.dayNumber !== undefined &&
        a.dayNumber !== b.dayNumber
      ) {
        return b.dayNumber - a.dayNumber;
      }
      return (b.timestampMs ?? 0) - (a.timestampMs ?? 0);
    });
  const latestRipper = ripperRecords[0];
  const hasMeasuredLogSo2 =
    latestLog?.freeSO2 !== undefined && latestLog.freeSO2Measured !== false;
  const useLogSo2InsteadOfRipper =
    hasMeasuredLogSo2 &&
    (!latestRipper ||
      ((latestLog.timestampMs ?? -1) > (latestRipper.timestampMs ?? -1) &&
        latestLog.timestampMs !== undefined));

  const measuredFreeSO2 = useLogSo2InsteadOfRipper
    ? latestLog?.freeSO2
    : typeof latestRipper?.measuredValue === 'number'
    ? latestRipper.measuredValue
    : hasMeasuredLogSo2
    ? latestLog?.freeSO2
    : undefined;
  const so2TimestampMs = useLogSo2InsteadOfRipper
    ? latestLog?.timestampMs
    : latestRipper
    ? latestRipper.timestampMs
    : hasMeasuredLogSo2
    ? latestLog?.timestampMs
    : undefined;
  const so2DayNumber = useLogSo2InsteadOfRipper
    ? latestLog?.dayNumber
    : latestRipper
    ? latestRipper.dayNumber
    : hasMeasuredLogSo2
    ? latestLog?.dayNumber
    : undefined;
  const todayFa = formatNowFa().split(' ')[0];
  const so2DateStr = useLogSo2InsteadOfRipper
    ? latestLog?.dateTime ?? ''
    : latestRipper
    ? latestRipper.date
    : hasMeasuredLogSo2
    ? latestLog?.dateTime ?? ''
    : '';
  const matchesTodayDate = Boolean(todayFa && so2DateStr.includes(todayFa));
  const so2AgeHours =
    so2TimestampMs !== undefined
      ? Math.max(0, (nowMs - so2TimestampMs) / (1000 * 60 * 60))
      : so2DayNumber !== undefined &&
        latestLog?.dayNumber !== undefined &&
        so2DayNumber >= latestLog.dayNumber - 2 &&
        matchesTodayDate
      ? Math.max(0, (latestLog.dayNumber - so2DayNumber) * 24)
      : Number.POSITIVE_INFINITY;

  const isOverSo2Ceiling =
    measuredFreeSO2 !== undefined && measuredFreeSO2 > so2UpperCeiling;
  const isBelowSo2Min =
    measuredFreeSO2 === undefined || measuredFreeSO2 < contSO2Target.min;
  const so2Passed =
    measuredFreeSO2 !== undefined &&
    !isBelowSo2Min &&
    !isOverSo2Ceiling &&
    so2AgeHours <= 48;

  const hasPhLabRecord = tankAnalyses.some((a) => a.testType === 'ph_meter');
  const isPhMeasured =
    (latestLog !== undefined && latestLog.phMeasured !== false) || hasPhLabRecord;
  const so2DataStatus: BottlingGateCheckItem['dataStatus'] = !so2Passed
    ? 'failed'
    : isPhMeasured
    ? 'verified'
    : 'incomplete_data';
  const unmeasuredPhNoteFa = !isPhMeasured
    ? ' (توجه: pH فعلی تخمینی/انتقالی است و مستقیماً اندازه‌گیری نشده است)'
    : '';

  // Blocking Check 3: Malic / MLF Stability
  const hasBactilessLock = tankAdditions.some(
    (a) =>
      a.compoundType === 'bactiless' ||
      /bactiless|ب[ا]?کتی[‌]?لس/i.test(`${a.stageTitle} ${a.purpose} ${a.compoundName}`)
  );
  const hasChromatographyDepleted = tankAnalyses.some(
    (a) =>
      a.testType === 'mlf_chromatography' &&
      (a.malicResult === 'depleted' || String(a.measuredValue).includes('depleted'))
  );
  const hasEndOfProcessMalicVerification =
    hasChromatographyDepleted ||
    Boolean(confirmations.malicRiskAccepted) ||
    (hasBactilessLock && so2Passed && currentPH <= 3.60);
  const isHarvestLowMalicOnly =
    !hasEndOfProcessMalicVerification && options.batch?.malicStatus === 'low';
  const malicPassed = hasEndOfProcessMalicVerification;

  const isConditionalBactilessMalicPass =
    malicPassed &&
    hasBactilessLock &&
    !hasChromatographyDepleted &&
    !confirmations.malicRiskAccepted;

  const malicDataStatus: BottlingGateCheckItem['dataStatus'] = malicPassed
    ? 'verified'
    : isHarvestLowMalicOnly
    ? 'incomplete_data'
    : 'failed';

  // Blocking Check 4: Visual Clarity & Zero Gas Bubbles
  const clarityPassed = Boolean(confirmations.clarityConfirmed);

  const blockingItems: BottlingGateCheckItem[] = [
    {
      id: 'dryness_stability',
      titleFa:
        '۱. خشکی کامل، ثبات چگالی (SG ≤ 0.995 در ۳ ثبت متوالی طی حداقل ۷ روز) و قند باقی‌مانده (Clinitest / RS < 2 g/L)',
      isBlocking: true,
      status: drynessPassed ? 'passed' : 'blocked_red',
      dataStatus: drynessDataStatus,
      detailFa: drynessPassed
        ? `تایید شد: ۳ ثبت متوالی در بازهٔ ${daySpan} روز روی SG ≤ 0.995 ثابت مانده است${
            hasRsConfirmed
              ? ' و تست قند باقی‌مانده آزمایشگاهی (Clinitest / RS < 2 g/L) نیز تایید شد.'
              : ' (وضعیت داده: incomplete_data — ثبات SG تایید شد اما تست شیمیایی Clinitest / RS < 2 g/L هنوز ثبت نشده است).'
          }`
        : hasExplicitHighRsFailure
        ? 'مسدود: نتیجه آزمایش قند باقی‌مانده (Clinitest / RS ≥ 2.0 g/L) نشان‌دهنده وجود قند تخمیرنشده است (خطر ترکیدن بطری).'
        : !drynessSgStable
        ? `مسدود: نیازمند حداقل ۳ ثبت متوالی SG ≤ 0.995 در بازهٔ حداقل ۷ روز و قند باقی‌مانده RS < 2 g/L با تست Clinitest (فعلی: ${lastThreeLogs.length} ثبت، بازهٔ ${daySpan} روز).`
        : 'مسدود: ثبات چگالی SG احراز شده اما تایید آزمایشگاهی قند باقی‌مانده (Clinitest / RS < 2 g/L) الزامی است.',
      whyFa: 'بطری کردن شراب با قند تخمیرنشده باعث تخمیر مجدد در بطری، پریدن چوب‌پنبه و ترکیدن شیشه می‌شود.'
    },
    {
      id: 'free_so2_target',
      titleFa: `۲. سولفیت آزاد کافی متناسب با pH (${contSO2Target.min}–${contSO2Target.max} mg/L در ۴۸ ساعت اخیر)`,
      isBlocking: true,
      status: so2Passed ? 'passed' : 'blocked_red',
      dataStatus: so2DataStatus,
      detailFa: so2Passed
        ? `تایید شد: سولفیت آزاد فعلی (${measuredFreeSO2} mg/L) در محدودهٔ هدف pH = ${currentPH.toFixed(2)} قرار دارد.${unmeasuredPhNoteFa}`
        : isOverSo2Ceiling
        ? `مسدود: سولفیت آزاد فعلی (${measuredFreeSO2} mg/L > سقف ${so2UpperCeiling} mg/L)؛ سولفیت آزاد بیش از سقف هدف است (خطر رنگپریدگی و بوی تند گوگرد).${unmeasuredPhNoteFa}`
        : `مسدود: سولفیت آزاد فعلی (${measuredFreeSO2 ?? 'ثبت‌نشده'} mg/L) کمتر از حداقل مجاز ${contSO2Target.min} mg/L برای pH = ${currentPH.toFixed(2)} است یا بیش از ۴۸ ساعت از سنجش گذشته است.${unmeasuredPhNoteFa}`,
      whyFa: 'سولفیت مولکولی زیر ۰.۶ mg/L نمی‌تواند شراب داخل بطری را محافظت کند و اوردوز بالای سقف مجاز باعث رنگ‌پریدگی و بوی تند گوگرد می‌شود.'
    },
    {
      id: 'malic_mlf_stability',
      titleFa: '۳. پایداری اسید مالیک (قفل Bactiless، کروماتوگرافی کاغذی یا پذیرش ریسک)',
      isBlocking: true,
      status: malicPassed ? 'passed' : 'blocked_red',
      dataStatus: malicDataStatus,
      detailFa: malicPassed
        ? isConditionalBactilessMalicPass
          ? 'تایید مشروط (پروتکل No-MLF): قفل کیتوزان (Bactiless) به همراه سپر سولفیت آزاد کافی ثبت شده است (توجه: کیتوزان بار باکتریایی را کاهش میدهد اما اسید مالیک را حذف نمیکند؛ حفظ دائمی Free SO2 الزامی است).'
          : 'تایید شد: پایداری میکروبی مالولاکتیک در پایان فرآیند احراز گردیده است.'
        : isHarvestLowMalicOnly
        ? 'مسدود (داده ناقص — incomplete_data): اسید مالیک صرفاً در برداشت اولیه کم برآورد شده (malicStatus = low) و تایید پایانی ندارد؛ انجام تست کروماتوگرافی کاغذی، قفل Bactiless به همراه Free SO2 کافی یا تایید دستی پذیرش ریسک پیش از بطری‌گذاری الزامی است.'
        : 'مسدود: وضعیت اسید مالیک مشخص نیست؛ قفل Bactiless روز ۱۱ (همراه با Free SO2 کافی و pH ≤ 3.60)، تست کروماتوگرافی یا تایید دستی الزامی است.',
      whyFa: 'شروع ناخواستهٔ تخمیر مالولاکتیک داخل بطری باعث کدورت، گازدار شدن و بوی کرهٔ فاسد می‌گردد.'
    },
    {
      id: 'visual_clarity_degas',
      titleFa: '۴. شفافیت نوری با چراغ‌قوه و نبود حباب گاز CO₂',
      isBlocking: true,
      status: clarityPassed ? 'passed' : 'blocked_red',
      dataStatus: clarityPassed ? 'verified' : 'failed',
      detailFa: clarityPassed
        ? 'تایید شد: شفافیت بصری و گاززدایی کامل توسط اپراتور تایید شد.'
        : 'مسدود: لطفاً شفافیت شراب را با نور چراغ‌قوه در لیوان بررسی و تیک تایید را فعال کنید.',
      whyFa: 'پروتئین یا پکتین معلق پس از بطری‌گذاری ته‌نشین شده و لجن ناخوشایند در کف بطری ایجاد می‌کند.'
    }
  ];

  // Advisory Checks (5 to 8)
  const hasKhtAdd = tankAdditions.some((a) => a.compoundType === 'kht');
  const coldStabDone = hasKhtAdd || Boolean(confirmations.coldStabConfirmedOrSkipped);
  const warmTestDone = Boolean(confirmations.warmTestPassed);
  const ascorbicSafe = (measuredFreeSO2 ?? 0) >= 30;
  const sanitationDone = Boolean(confirmations.sanitationConfirmed);

  const advisoryItems: BottlingGateCheckItem[] = [
    {
      id: 'cold_stabilization',
      titleFa: '۵. پایدارسازی سرد ۱۴ روزه (۰ تا +۲ درجه با کرم تارتار)',
      isBlocking: false,
      status: coldStabDone ? 'passed' : 'advisory_amber',
      detailFa: coldStabDone
        ? 'پایدارسازی سرد یا معافیت آن ثبت شده است.'
        : 'توصیه‌شده: در صورت عدم سرمازدایی، ممکن است در یخچال کریستال بی‌خطر تارتارات رسوب کند.',
      whyFa: 'جلوگیری از تشکیل الماس‌های شراب (کریستال بی‌تارتارات پتاسیم) در دمای یخچال.'
    },
    {
      id: 'warm_bottle_test',
      titleFa: '۶. تست بطری شاهد ۴۸ ساعته در دمای ۲۵ درجه',
      isBlocking: false,
      status: warmTestDone ? 'passed' : 'advisory_amber',
      detailFa: warmTestDone
        ? 'تست پایداری حرارتی ۴۸ ساعته بدون کدورت یا حباب تایید شد.'
        : 'توصیه‌شده: یک نمونه را ۴۸ ساعت در دمای اتاق نگه دارید تا از عدم تشکیل حباب اطمینان حاصل شود.',
      whyFa: 'شبیه‌سازی شرایط نگهداری بطری برای کشف زودهنگام هرگونه فعالیت مخمری یا پروتئینی.'
    },
    {
      id: 'ascorbic_so2_lock',
      titleFa: '۷. قفل ایمنی اسید اسکوربیک (Free SO₂ ≥ 30 mg/L پیش از تزریق ویتامین C)',
      isBlocking: false,
      status: ascorbicSafe ? 'passed' : 'advisory_amber',
      detailFa: ascorbicSafe
        ? `ایمن: سولفیت آزاد (${measuredFreeSO2} mg/L ≥ 30 mg/L) برای افزودن اسید اسکوربیک کافی است.`
        : 'هشدار: تا زمانی که سولفیت آزاد زیر ۳۰ mg/L است، اسید اسکوربیک اضافه نکنید (خطر تولید H2O2).',
      whyFa: 'اسید اسکوربیک در غیاب سولفیت آزاد کافی، اکسیژن را به آب‌اکسیژنه تبدیل کرده و شراب را اکسید می‌کند.'
    },
    {
      id: 'bottle_cork_sanitation',
      titleFa: '۸. ضدعفونی بطری‌ها و چوب‌پنبه‌ها با محلول سولفیت اسیدی و پرج CO₂',
      isBlocking: false,
      status: sanitationDone ? 'passed' : 'advisory_amber',
      detailFa: sanitationDone
        ? 'ضدعفونی خط بطری‌گذاری و چوب‌پنبه‌ها تایید شد.'
        : 'توصیه‌شده: پیش از شروع پر کردن، بطری‌ها را با محلول استوک شماره ۳ آبکشی و خشک نمایید.',
      whyFa: 'جلوگیری از آلودگی کپکی (TCA) و اکسیداسیون گلوگاه بطری.'
    }
  ];

  const allBlockingPassed = blockingItems.every((item) => item.status === 'passed');
  const failedBlockerIds = blockingItems
    .filter((item) => item.status !== 'passed')
    .map((item) => item.id);
  const trimmedReason = options.riskOverrideReason?.trim() ?? '';
  const hasOverride = trimmedReason.length > 0;
  const overriddenBlockerIds = !allBlockingPassed && hasOverride ? failedBlockerIds : [];
  const executionMode: BottlingReadinessResult['executionMode'] = allBlockingPassed
    ? 'safe_ready'
    : hasOverride
    ? 'override_with_risk'
    : 'blocked';
  const overrideWarningFa =
    executionMode === 'override_with_risk'
      ? `هشدار مسئولیت اپراتور: بطری‌گذاری با وجود ${overriddenBlockerIds.length} مانع قرمز (${overriddenBlockerIds.join(', ')}) به صورت استثنا باز شد. دلیل ثبت‌شده: ${trimmedReason}`
      : undefined;
  const overrideAudit =
    executionMode === 'override_with_risk'
      ? {
          overriddenAtMs: nowMs,
          reason: trimmedReason,
          overriddenBlockerIds,
          tankId,
          batchId: activeBatchId
        }
      : undefined;

  return {
    blockingItems,
    advisoryItems,
    allBlockingPassed,
    canStartBottling: allBlockingPassed || hasOverride,
    executionMode,
    overriddenBlockerIds,
    overrideWarningFa,
    riskOverrideReason: options.riskOverrideReason,
    overrideAudit,
    so2AgeHours
  };
}

