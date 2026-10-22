import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Eye,
  FlaskConical,
  Lock,
  Plus,
  RotateCcw,
  Scale,
  ShieldAlert,
  Sparkles,
  Trash2,
  Unlock,
  XCircle
} from 'lucide-react';
import type {
  ChemicalAddition,
  StructuredCompoundType,
  TankId
} from '../types/index.ts';
import { enologyDb } from '../db/enologyDatabase.ts';
import { useFlexibleProtocol } from '../data/masterProtocolConfig.ts';
import {
  calculateStockSolutionPlan,
  type ScalePrecisionGrams,
  type StockCompoundCategory
} from '../utils/enologyUtils.ts';
import { sortFermentationLogs } from '../utils/trackingCalculations.ts';
import {
  evaluateBottlingReadinessGate,
  evaluateDeadlineCountdowns,
  evaluateRightNowQueue,
  type RightNowMilestone
} from '../utils/rightNowEngine.ts';
import { useLocalStorageState as useLocalStorage } from '../utils/useLocalStorage.ts';
import {
  GlossaryTerm,
  useEnologyUi,
  type GlobalTankSelection
} from '../context/EnologyUiContext.tsx';
import { BatchOnboardingWizardModal } from './BatchOnboardingWizardModal.tsx';
import { LivingTankVisualTwin } from './LivingTankVisualTwin.tsx';

export interface RightNowActionCenterProps {
  activeTankId?: TankId;
  onTankChange?: (tankId: TankId) => void;
  onDataChanged?: () => void;
  onOpenQuickLogModal?: () => void;
  compact?: boolean;
}

interface PendingConfirmSession {
  milestone: RightNowMilestone;
  targetTankIds: TankId[];
  additions: Array<Omit<ChemicalAddition, 'id'>>;
  calculatedAmounts: number[];
  explicitAdditionConfirmed: boolean;
  overrideOverBudgetConfirmed: boolean;
}

interface UndoSession {
  milestoneTitleFa: string;
  createdAdditionIds: string[];
  addedStepIds: number[];
  expiresAtMs: number;
  remainingSec: number;
}

function mapCompoundToStockCategory(
  compoundType?: StructuredCompoundType
): StockCompoundCategory {
  if (compoundType === 'zinc') return 'zinc';
  if (compoundType === 'copper') return 'copper';
  if (compoundType === 'tartaric') return 'tartaric';
  if (compoundType === 'kms') return 'kms';
  if (
    compoundType === 'fermaid_o' ||
    compoundType === 'fermaid_k' ||
    compoundType === 'yeast' ||
    compoundType === 'go_ferm'
  ) {
    return 'fermaid_or_yeast';
  }
  return 'general';
}

export const RightNowActionCenter: React.FC<RightNowActionCenterProps> = ({
  activeTankId: externalTankId,
  onTankChange,
  onDataChanged,
  onOpenQuickLogModal,
  compact = false
}) => {
  const { plan } = useFlexibleProtocol();
  const {
    globalTankSelection,
    setGlobalTankSelection,
    effectiveSingleTankId,
    tankCount,
    activeBatch,
    setActiveBatchId,
    scalePrecision,
    setScalePrecision,
    navigateToLabTest,
    openQuickLog,
    dataVersion,
    notifyDataChanged
  } = useEnologyUi();

  const currentTankId: TankId = externalTankId ?? effectiveSingleTankId;
  const batchKeySuffix =
    activeBatch?.id && activeBatch.id !== 'batch-rasha-1403'
      ? `_${activeBatch.id}`
      : '';

  const [refreshTick, setRefreshTick] = useState(0);
  const [completedSteps, setCompletedSteps] = useLocalStorage<number[]>(
    `enology_completed_roadmap_steps${batchKeySuffix}`,
    [1, 2, 3]
  );
  const [snoozedUntilMsByStepId, setSnoozedUntilMsByStepId] = useLocalStorage<
    Record<string, number>
  >(`enology_rightnow_snoozed_v1${batchKeySuffix}`, {});
  const [skippedReasonsByStepId, setSkippedReasonsByStepId] = useLocalStorage<
    Record<string, string>
  >(`enology_rightnow_skipped_v1${batchKeySuffix}`, {});
  const [showAllDetails, setShowAllDetails] = useLocalStorage<boolean>(
    'enology_show_all_details_v1',
    false
  );
  const [bottlingConfirmations, setBottlingConfirmations] = useLocalStorage<{
    clarityConfirmed?: boolean;
    coldStabConfirmedOrSkipped?: boolean;
    warmTestPassed?: boolean;
    sanitationConfirmed?: boolean;
    malicRiskAccepted?: boolean;
    rsConfirmed?: boolean;
  }>(`enology_bottling_gate_confirmations_v1${batchKeySuffix}`, {});

  const [showLayer2Why, setShowLayer2Why] = useState(false);
  const [showLayer3Science, setShowLayer3Science] = useState(false);
  const [showAllDeadlinesToggle, setShowAllDeadlinesToggle] = useState(false);
  const [skippingMilestoneId, setSkippingMilestoneId] = useState<string | null>(
    null
  );
  const [skipReasonInput, setSkipReasonInput] = useState('');
  const [confirmSession, setConfirmSession] =
    useState<PendingConfirmSession | null>(null);
  const [undoSession, setUndoSession] = useState<UndoSession | null>(null);
  const [showBottlingGate, setShowBottlingGate] = useState(false);
  const [expandedBottlingWhyId, setExpandedBottlingWhyId] = useState<
    string | null
  >(null);
  const [riskOverrideReason, setRiskOverrideReason] = useState('');
  const [bottlingUnlockedNotice, setBottlingUnlockedNotice] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [confirmingRealBatchReset, setConfirmingRealBatchReset] = useState(false);

  // Sync externalTankId prop if provided
  useEffect(() => {
    if (externalTankId && externalTankId !== effectiveSingleTankId && globalTankSelection !== 'both-red') {
      setGlobalTankSelection(externalTankId);
    }
  }, [externalTankId, effectiveSingleTankId, globalTankSelection, setGlobalTankSelection]);

  // BUG-51: Re-evaluate queue automatically when the earliest snooze window expires
  useEffect(() => {
    const now = Date.now();
    const futureExpiries = Object.values(snoozedUntilMsByStepId).filter(
      (ms) => typeof ms === 'number' && ms > now
    );
    if (futureExpiries.length === 0) return;
    const nextExpiryMs = Math.min(...futureExpiries);
    const delayMs = Math.max(500, nextExpiryMs - now + 50);
    const timer = setTimeout(() => {
      setRefreshTick((t) => t + 1);
    }, delayMs);
    return () => clearTimeout(timer);
  }, [snoozedUntilMsByStepId, refreshTick]);

  // Countdown timer for 10-second Undo banner
  useEffect(() => {
    if (!undoSession) return;
    const timer = setInterval(() => {
      const rem = Math.ceil((undoSession.expiresAtMs - Date.now()) / 1000);
      if (rem <= 0) {
        setUndoSession(null);
      } else {
        setUndoSession((prev) => (prev ? { ...prev, remainingSec: rem } : null));
      }
    }, 250);
    return () => clearInterval(timer);
  }, [undoSession]);

  const logs = useMemo(
    () => enologyDb.getLogs(undefined, false, activeBatch?.id),
    [refreshTick, dataVersion, activeBatch?.id]
  );
  const additions = useMemo(
    () => enologyDb.getAdditions(undefined, false, activeBatch?.id),
    [refreshTick, dataVersion, activeBatch?.id]
  );
  const labAnalyses = useMemo(
    () => enologyDb.getLabAnalyses(undefined, false, activeBatch?.id),
    [refreshTick, dataVersion, activeBatch?.id]
  );
  const batches = useMemo(
    () => enologyDb.getBatches(),
    [refreshTick, dataVersion]
  );
  const hasDemo = useMemo(
    () => enologyDb.hasDemoData(),
    [refreshTick, dataVersion]
  );
  const currentBatch = activeBatch ?? batches[0];

  const queue = useMemo(
    () =>
      evaluateRightNowQueue({
        logs,
        additions,
        activeTankId: currentTankId,
        completedRoadmapStepIds: completedSteps,
        snoozedUntilMsByStepId,
        skippedReasonsByStepId,
        plan,
        batch: currentBatch,
        excludeDemo: !hasDemo
      }),
    [
      logs,
      additions,
      currentTankId,
      completedSteps,
      snoozedUntilMsByStepId,
      skippedReasonsByStepId,
      plan,
      currentBatch,
      hasDemo
    ]
  );

  const deadlineCountdowns = useMemo(
    () =>
      evaluateDeadlineCountdowns({
        logs,
        additions,
        labAnalyses,
        tankId: currentTankId,
        plan,
        batch: currentBatch,
        excludeDemo: !hasDemo
      }),
    [logs, additions, labAnalyses, currentTankId, plan, currentBatch, hasDemo]
  );

  const bottlingGate = useMemo(
    () =>
      evaluateBottlingReadinessGate({
        logs,
        additions,
        labAnalyses,
        batch: currentBatch,
        tankId: currentTankId,
        manualConfirmations: bottlingConfirmations,
        riskOverrideReason
      }),
    [
      logs,
      additions,
      labAnalyses,
      currentBatch,
      currentTankId,
      bottlingConfirmations,
      riskOverrideReason
    ]
  );

  // Latest and previous log for the active tank (for status header, safety check, and trend arrows)
  const tankSortedLogs = useMemo(() => {
    const filtered = logs.filter(
      (l) =>
        l.tankId === currentTankId &&
        !l.isBenchmark &&
        !l.isDeleted &&
        (hasDemo ? true : !l.isDemo)
    );
    return sortFermentationLogs(filtered);
  }, [logs, currentTankId, hasDemo]);

  const latestLog = tankSortedLogs[tankSortedLogs.length - 1];
  const previousLog =
    tankSortedLogs.length >= 2 ? tankSortedLogs[tankSortedLogs.length - 2] : null;

  const latestDay = latestLog ? latestLog.dayNumber : 0;
  const latestSG = latestLog
    ? latestLog.sg
    : currentTankId === 'tank-rose'
    ? 1.088
    : 1.092;
  const latestTempCap = latestLog
    ? latestLog.tempCap
    : currentTankId === 'tank-rose'
    ? 15.0
    : 22.0;
  const latestPH = latestLog
    ? latestLog.ph
    : currentTankId === 'tank-rose'
    ? 3.32
    : 3.52;

  const sgDelta = previousLog
    ? Math.round((latestSG - previousLog.sg) * 1000) / 1000
    : 0;
  const tempDelta = previousLog
    ? Math.round((latestTempCap - previousLog.tempCap) * 10) / 10
    : 0;
  const phDelta = previousLog
    ? Math.round((latestPH - previousLog.ph) * 100) / 100
    : 0;

  // Hero Priority 1: Safety Danger Detection (Cap Temp critical OR Post-Dryness SO2 critical)
  const isRoseTank = currentTankId === 'tank-rose';
  const isCapTempCritical = isRoseTank
    ? latestTempCap >= 19.5 && latestSG > 1.0
    : latestTempCap >= 30.0;
  const postDrynessDeadline = deadlineCountdowns.find(
    (d) => d.id === 'post_dryness_so2'
  );
  const isPostDrynessSo2Critical =
    postDrynessDeadline?.urgencyLevel === 'critical' ||
    (latestSG <= 0.995 && postDrynessDeadline?.urgencyLevel === 'warning');
  const hasSafetyDanger = isCapTempCritical || isPostDrynessSo2Critical;

  // Conditional Deadline Filtering (Section 3A.4)
  const hasBactilessAddition = useMemo(
    () =>
      additions.some(
        (a) =>
          a.tankId === currentTankId &&
          !a.isDeleted &&
          (hasDemo ? true : !a.isDemo) &&
          (a.compoundType === 'bactiless' ||
            a.compoundName.toLowerCase().includes('bactiless') ||
            a.compoundName.includes('بکتیلس') ||
            a.compoundName.includes('کیتوزان'))
      ),
    [additions, currentTankId, hasDemo]
  );

  const visibleDeadlines = useMemo(() => {
    if (showAllDeadlinesToggle) return deadlineCountdowns;
    return deadlineCountdowns.filter((item) => {
      if (item.id === 'dap_window') {
        // Only show during active fermentation before or just at 1.062
        return latestSG >= 1.055;
      }
      if (item.id === 'bactiless_contact') {
        // Only show when Bactiless has been added
        return hasBactilessAddition;
      }
      if (item.id === 'post_dryness_so2') {
        return latestSG <= 1.010 || item.urgencyLevel !== 'safe';
      }
      return true;
    });
  }, [deadlineCountdowns, showAllDeadlinesToggle, latestSG, hasBactilessAddition]);

  const primaryAction = queue.primaryAction;

  // 1-Sentence Status Summary Phrase
  const statusPhraseFa = useMemo(() => {
    if (hasSafetyDanger) {
      return isCapTempCritical
        ? `هشدار ایمنی فوری: دمای کلاهک (${latestTempCap}°C) در محدوده خطر شوک حرارتی است`
        : 'هشدار ایمنی فوری: شراب خشک شده و نیازمند تزریق محافظ سولفیت (KMS) است';
    }
    if (queue.sgAnomaly?.hasAnomaly) {
      return 'ناهنجاری در قرائت چگالی (SG نسبت به ثبت قبلی افزایش یافته است)';
    }
    if (primaryAction) {
      return `${primaryAction.stateBadgeFa}: ${primaryAction.titleFa}`;
    }
    return 'همه‌چیز طبق برنامه است — تخمیر و دما در مسیر طبیعی قرار دارند';
  }, [hasSafetyDanger, isCapTempCritical, latestTempCap, queue.sgAnomaly, primaryAction]);

  const handleGlobalTankChange = (selection: GlobalTankSelection) => {
    setGlobalTankSelection(selection);
    const resolvedSingle: TankId =
      selection === 'both-red' ? 'tank-a' : selection;
    onTankChange?.(resolvedSingle);
  };

  const handleTriggerQuickLog = () => {
    if (onOpenQuickLogModal) {
      onOpenQuickLogModal();
    } else {
      openQuickLog(globalTankSelection);
    }
  };

  const handleStartRealBatch = () => {
    const created = enologyDb.startRealBatchMode();
    if (created) {
      setActiveBatchId(created.id);
    }
    setCompletedSteps([]);
    setConfirmingRealBatchReset(false);
    setRefreshTick((t) => t + 1);
    notifyDataChanged();
    onDataChanged?.();
  };

  const openConfirmSheet = (
    milestone: RightNowMilestone,
    targetTankIds: TankId[]
  ) => {
    const selectedRows = milestone.tankRows.filter((r) =>
      targetTankIds.includes(r.tankId)
    );
    const additionsToCreate = selectedRows.flatMap((r) =>
      r.additionsToRecord.map((item) => ({ ...item }))
    );
    setConfirmSession({
      milestone,
      targetTankIds,
      additions: additionsToCreate,
      calculatedAmounts: additionsToCreate.map((item) => item.amount),
      explicitAdditionConfirmed: additionsToCreate.length === 0,
      overrideOverBudgetConfirmed: false
    });
  };

  const handleCommitAdditions = () => {
    if (!confirmSession) return;
    const createdIds: string[] = [];
    for (const add of confirmSession.additions) {
      const saved = enologyDb.addAddition({
        ...add,
        isDemo: false
      });
      createdIds.push(saved.id);
    }

    const stepIdsToAdd = confirmSession.milestone.roadmapStepIds.filter(
      (id) => !completedSteps.includes(id)
    );
    if (stepIdsToAdd.length > 0) {
      setCompletedSteps([...completedSteps, ...stepIdsToAdd]);
    }

    setUndoSession({
      milestoneTitleFa: confirmSession.milestone.titleFa,
      createdAdditionIds: createdIds,
      addedStepIds: stepIdsToAdd,
      expiresAtMs: Date.now() + 10000,
      remainingSec: 10
    });
    setConfirmSession(null);
    setRefreshTick((t) => t + 1);
    notifyDataChanged();
    onDataChanged?.();
  };

  const handleUndoLastCommit = () => {
    if (!undoSession) return;
    for (const id of undoSession.createdAdditionIds) {
      enologyDb.softDeleteAddition(id);
    }
    if (undoSession.addedStepIds.length > 0) {
      setCompletedSteps(
        completedSteps.filter((id) => !undoSession.addedStepIds.includes(id))
      );
    }
    setUndoSession(null);
    setRefreshTick((t) => t + 1);
    notifyDataChanged();
    onDataChanged?.();
  };

  const handleSnooze2Hours = (milestoneId: string) => {
    setSnoozedUntilMsByStepId({
      ...snoozedUntilMsByStepId,
      [milestoneId]: Date.now() + 2 * 3600 * 1000
    });
  };

  const handleConfirmSkip = (milestoneId: string) => {
    const trimmed = skipReasonInput.trim();
    if (!trimmed) return;
    setSkippedReasonsByStepId({
      ...skippedReasonsByStepId,
      [milestoneId]: trimmed
    });
    setSkippingMilestoneId(null);
    setSkipReasonInput('');
  };

  const passedBlockingCount = bottlingGate.blockingItems.filter(
    (i) => i.status === 'passed'
  ).length;
  const isNearOrAtBottlingWindow = latestSG <= 0.996 || latestDay >= 60;

  // Preserve unused state handlers for compatibility
  void handleGlobalTankChange;
  void showLayer2Why;
  void setShowLayer2Why;
  void showLayer3Science;
  void setShowLayer3Science;

  return (
    <section
      aria-label="مرکز تصمیم‌گیری و اقدام فوری امروز"
      className="space-y-4 pb-20 font-['Vazirmatn',sans-serif] text-ink"
    >
      {/* 1. Edge State — Demo Mode Watermark & One-Tap Start Real Batch Banner */}
      {hasDemo && (
        <div className="bg-amber-50/70 text-ink border border-warn rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <Sparkles className="w-5 h-5 text-warn shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-ink">
                در حال دیدن دادهٔ نمونه هستید — برای شروع بچ واقعی اقدام کنید
              </p>
              <p className="text-xs text-ink-soft mt-1">
                پیش از شروع شراب‌گیری واقعی، با یک کلیک داده‌های نمونه را پاک کنید تا دفتر ثبت و بودجه SO₂ شما از صفر شروع شود.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <button
              type="button"
              onClick={() => setIsOnboardingOpen(true)}
              className="px-3.5 py-2 rounded-lg bg-wine text-white text-xs font-bold flex items-center gap-1.5 shrink-0 cursor-pointer transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>راه‌اندازی بچ جدید (ویزارد ۵ مرحله‌ای شروع فصل)</span>
            </button>
            {confirmingRealBatchReset ? (
              <div className="flex items-center gap-1.5 bg-red-50 border border-danger rounded-lg px-2.5 py-1.5">
                <span className="text-xs font-medium text-ink">
                  حذف داده‌های نمونه قطعی است؟
                </span>
                <button
                  type="button"
                  onClick={handleStartRealBatch}
                  className="px-2.5 py-1 rounded bg-danger text-white text-xs font-bold cursor-pointer"
                >
                  بله، حذف و شروع
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmingRealBatchReset(false)}
                  className="px-2 py-1 rounded bg-surface border border-line text-ink-soft text-xs font-medium cursor-pointer"
                >
                  انصراف
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmingRealBatchReset(true)}
                className="px-3.5 py-2 rounded-lg bg-surface hover:bg-paper border border-line text-ink text-xs font-medium flex items-center gap-1.5 shrink-0 cursor-pointer transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5 text-ink-soft" />
                <span>شروع بچ واقعی (حذف داده‌های نمونه)</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 2. Minimal Single Clean Status Line (No duplicate tank/batch toolbar or decorative emojis) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1 py-1 border-b border-line">
        <p className="text-sm font-medium text-ink flex items-center gap-2 flex-wrap">
          <Activity className="w-4 h-4 text-ok shrink-0" />
          <span>
            {'روز ' +
              latestDay +
              ' — SG ' +
              latestSG.toFixed(3) +
              ' — ' +
              statusPhraseFa}
          </span>
        </p>
        <div className="flex items-center gap-3 text-xs text-ink-soft flex-wrap">
          <div className="flex items-center gap-2">
            <span>واژه‌نامه:</span>
            <GlossaryTerm termKey="kms" labelOverride="KMS" />
            <GlossaryTerm termKey="sna" labelOverride="SNA" />
            <GlossaryTerm termKey="yan" labelOverride="YAN" />
            <GlossaryTerm termKey="pigeage" labelOverride="Pigeage" />
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={showAllDetails}
            onClick={() => setShowAllDetails(!showAllDetails)}
            className={`px-2.5 py-1 rounded-lg border text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors ${
              showAllDetails
                ? 'bg-wine text-white border-wine'
                : 'bg-surface text-ink-soft border-line hover:text-ink'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>نمایش همه جزئیات</span>
          </button>
        </div>
      </div>

      {/* 3. 10-Second Undo Banner */}
      {undoSession && (
        <div className="bg-surface text-ink border border-ok rounded-xl p-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <CheckCircle2 className="w-4 h-4 text-ok shrink-0" />
            <span>«{undoSession.milestoneTitleFa}» در دفتر ثبت شد.</span>
          </div>
          <button
            type="button"
            onClick={handleUndoLastCommit}
            className="px-3 py-1.5 rounded-lg bg-wine text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>ثبت شد — بازگردانی ({undoSession.remainingSec} ثانیه)</span>
          </button>
        </div>
      )}

      {/* 4. Hero Priority 1: True Safety Emergency Card (Strictly uses --color-danger) */}
      {hasSafetyDanger && (
        <div className="border-2 border-danger bg-red-50 text-ink rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-6 h-6 text-danger shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-xs font-medium text-danger">
                اولویت ۱ ایمنی کارگاه
              </p>
              <h3 className="text-lg font-bold text-ink">
                {isCapTempCritical
                  ? `خطر بحرانی دمای کلاهک (${latestTempCap}°C) — ریسک توقف تخمیر و مرگ مخمر`
                  : `شراب به خشکی رسیده (SG ${latestSG.toFixed(3)}) — خطر فوری اکسیداسیون بدون سولفیت آزاد`}
              </h3>
              <p className="text-sm text-ink-soft leading-relaxed">
                {isCapTempCritical
                  ? 'فوراً با بطری‌های یخ استریل یا یخ خشک خوراکی دمای مرکز کلاهک را به زیر ۲۶ درجه (در رُزه زیر ۱۷ درجه) کاهش دهید.'
                  : 'پس از اتمام تخمیر الکلی، لایه محافظ CO₂ از بین می‌رود؛ فوراً آزمایش ریپر SO₂ را انجام داده و دوز محافظ KMS را تزریق نمایید.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() =>
              navigateToLabTest({
                testId: isCapTempCritical ? 'dry_ice_cooling' : 'ripper_so2',
                subTab: 'calculators-sops',
                prefillTankId: currentTankId,
                prefillSG: latestSG,
                prefillPH: latestPH,
                prefillTempC: latestTempCap
              })
            }
            className="min-h-[48px] px-5 py-2.5 rounded-lg bg-danger text-white text-sm font-bold shrink-0 cursor-pointer"
          >
            انجام آزمایش و محاسبه دوز
          </button>
        </div>
      )}

      {/* 5. Hero Priority 2: SG Rise Anomaly Alert */}
      {queue.sgAnomaly?.hasAnomaly && (
        <div className="border border-warn bg-amber-50/60 text-ink rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-warn shrink-0 mt-0.5" />
            <div>
              <h3 className="text-base font-bold text-ink">
                {queue.sgAnomaly.titleFa} (SG قبلی: {queue.sgAnomaly.previousSG.toFixed(3)} ← فعلی: {queue.sgAnomaly.currentSG.toFixed(3)})
              </h3>
              <p className="text-sm text-ink-soft mt-0.5">
                {queue.sgAnomaly.descriptionFa}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleTriggerQuickLog}
            className="px-4 py-2 rounded-lg bg-wine text-white text-xs font-bold shrink-0 cursor-pointer"
          >
            اصلاح آخرین ثبت هیدرومتر
          </button>
        </div>
      )}

      {/* 6. Flat 1-Level Hero Card (No nested card-in-card, calm cellar-instrument surface) */}
      <section
        className={
          primaryAction?.state === 'missed'
            ? 'bg-amber-50/60 border border-warn text-ink rounded-xl p-5'
            : 'bg-surface border border-line text-ink rounded-xl p-5'
        }
      >
        {primaryAction ? (
          <div>
            <p className="text-sm font-medium text-ink-soft">
              {primaryAction.stateBadgeFa}
            </p>
            <h2 className="mt-1 text-2xl font-bold text-ink">
              {primaryAction.titleFa}
            </h2>

            {primaryAction.confidenceLabelFa &&
              primaryAction.confidenceLabelFa !== 'محاسبهٔ استوکیومتری قطعی' && (
                <p className="mt-1 text-xs font-medium text-warn">
                  {primaryAction.confidenceLabelFa}
                </p>
              )}

            {/* Flat Tank Dose Rows */}
            <ul className="mt-4 divide-y divide-line">
              {primaryAction.tankRows.map((r) => (
                <li
                  key={r.tankId}
                  className="flex items-baseline justify-between py-3 gap-4"
                >
                  <div>
                    <span className="text-base font-medium text-ink">
                      {r.tankLabelFa}
                    </span>
                    <span className="block text-sm text-ink-soft">
                      {r.compoundFa} ({r.volumeContextFa})
                      {r.isCompletedForTank ? ' — ثبت‌شده' : ''}
                    </span>
                  </div>
                  <span className="ltr-metric text-3xl font-bold text-ink">
                    {r.doseValue}{' '}
                    <small className="text-base font-normal text-ink-soft">
                      {r.doseUnit}
                    </small>
                  </span>
                </li>
              ))}
            </ul>

            {/* Why & How / Science + Stock Solution Assistant inside <details> */}
            <details
              className="mt-3 border-t border-line pt-3"
              open={showAllDetails || undefined}
            >
              <summary className="cursor-pointer text-sm font-medium text-ink-soft hover:text-ink">
                چرا و چطور؟ (دستور اجرا و مبنای علمی)
              </summary>
              <div className="mt-3 space-y-2.5 text-sm text-ink">
                <p className="leading-relaxed">
                  <span className="font-medium text-ink">دستور اجرا: </span>
                  {primaryAction.howToExecuteFa}
                </p>
                <p className="leading-relaxed text-ink-soft">
                  <span className="font-medium text-ink">علت انولوژیکی: </span>
                  {primaryAction.whyFa}
                </p>
                <p className="text-xs font-mono text-ink-soft ltr-metric">
                  {primaryAction.scienceNoteFa}
                </p>

                {/* Precision Scale Selector & Stock Solution Assistant */}
                <div className="pt-2 border-t border-line space-y-2">
                  <div className="flex items-center gap-2 flex-wrap text-xs text-ink-soft">
                    <Scale className="w-3.5 h-3.5 text-ink-soft" />
                    <span>دقت ترازو:</span>
                    {([1, 0.1, 0.01] as ScalePrecisionGrams[]).map((prec) => (
                      <button
                        key={prec}
                        type="button"
                        onClick={() => setScalePrecision(prec)}
                        className={`px-2 py-0.5 rounded border font-mono cursor-pointer ${
                          scalePrecision === prec
                            ? 'bg-wine text-white border-wine font-bold'
                            : 'bg-paper text-ink-soft border-line hover:text-ink'
                        }`}
                      >
                        {prec}g
                      </button>
                    ))}
                  </div>

                  {(() => {
                    const activeRow =
                      primaryAction.tankRows.find(
                        (r) => r.tankId === currentTankId
                      ) ?? primaryAction.tankRows[0];
                    if (!activeRow) return null;
                    const microPlans = activeRow.additionsToRecord
                      .map((add) => ({
                        add,
                        stock: calculateStockSolutionPlan(
                          add.amount,
                          scalePrecision,
                          mapCompoundToStockCategory(add.compoundType)
                        )
                      }))
                      .filter((item) => item.stock.needsStockSolution);

                    if (microPlans.length === 0) return null;

                    return (
                      <div className="space-y-1.5 pt-1 text-xs text-ink">
                        <p className="font-medium text-warn flex items-center gap-1.5">
                          <FlaskConical className="w-3.5 h-3.5" />
                          <span>
                            دستیار محلول استوک و سرنگ (مخصوص ترازوی {scalePrecision} گرمی شما)
                          </span>
                        </p>
                        {microPlans.map(({ add, stock }) => (
                          <div key={add.compoundName} className="space-y-0.5">
                            <p className="font-medium text-ink">
                              • {add.compoundName} (مقدار دقیق: {add.amount} گرم):{' '}
                              <span className="text-ink-soft">
                                {stock.instructionFa}
                              </span>
                            </p>
                            <p className="text-ink-soft">
                              حالت توزین مستقیم گردشده: {stock.roundedDirectGrams} گرم (خطای گرد کردن: {stock.directWeighErrorPct}٪) | {stock.stabilityNoteFa}
                            </p>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </details>

            {/* Primary & Secondary Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 mt-4 pt-3 border-t border-line">
              <button
                type="button"
                onClick={() =>
                  openConfirmSheet(
                    primaryAction,
                    globalTankSelection === 'both-red' && tankCount === 2
                      ? ['tank-a', 'tank-b']
                      : [currentTankId]
                  )
                }
                className="bg-wine hover:opacity-95 text-white min-h-[48px] px-5 rounded-lg font-bold text-sm flex items-center gap-2 cursor-pointer transition-opacity"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {globalTankSelection === 'both-red' && tankCount === 2
                    ? 'انجام شد (و ثبت شود برای هر دو مخزن A و B)'
                    : 'انجام شد (و ثبت شود)'}
                </span>
              </button>

              {globalTankSelection !== 'both-red' &&
                primaryAction.tankRows.some(
                  (r) => r.tankId === 'tank-a' && !r.isCompletedForTank
                ) &&
                primaryAction.tankRows.some(
                  (r) => r.tankId === 'tank-b' && !r.isCompletedForTank
                ) && (
                  <button
                    type="button"
                    onClick={() =>
                      openConfirmSheet(primaryAction, ['tank-a', 'tank-b'])
                    }
                    className="min-h-[48px] px-4 rounded-lg bg-paper hover:bg-line/50 border border-line text-ink text-sm font-medium flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4 text-ok" />
                    <span>هر دو مخزن A و B انجام شد</span>
                  </button>
                )}

              <button
                type="button"
                onClick={() => handleSnooze2Hours(primaryAction.id)}
                className="min-h-[48px] px-4 rounded-lg bg-paper hover:bg-line/50 border border-line text-ink-soft hover:text-ink text-sm font-medium flex items-center gap-1.5 cursor-pointer"
              >
                <Clock className="w-4 h-4" />
                <span>بعداً (۲ ساعت)</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  setSkippingMilestoneId(
                    skippingMilestoneId === primaryAction.id
                      ? null
                      : primaryAction.id
                  )
                }
                className="min-h-[48px] px-4 rounded-lg bg-paper hover:bg-line/50 border border-line text-ink-soft hover:text-ink text-sm font-medium flex items-center gap-1.5 cursor-pointer"
              >
                <XCircle className="w-4 h-4" />
                <span>رد کردن</span>
              </button>
            </div>

            {/* Inline Skip Reason Form */}
            {skippingMilestoneId === primaryAction.id && (
              <div className="mt-3 pt-3 border-t border-line space-y-2">
                <p className="text-xs font-medium text-ink">
                  علت رد کردن این مرحله را انتخاب یا وارد کنید (در گزارش نهایی ثبت می‌شود):
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'YAN آزمایش‌شده بالاست',
                    'قبلاً دستی انجام شده',
                    'پروتکل سفارشی'
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setSkipReasonInput(preset)}
                      className="px-2.5 py-1 rounded-lg bg-paper border border-line hover:border-ink-soft text-xs font-medium text-ink cursor-pointer"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={skipReasonInput}
                    onChange={(e) => setSkipReasonInput(e.target.value)}
                    placeholder="توضیح دلیل رد کردن..."
                    className="flex-1 bg-paper border border-line rounded-lg px-3 py-2 text-xs text-ink"
                  />
                  <button
                    type="button"
                    disabled={!skipReasonInput.trim()}
                    onClick={() => handleConfirmSkip(primaryAction.id)}
                    className="px-3.5 py-2 rounded-lg bg-wine disabled:opacity-40 text-white text-xs font-bold cursor-pointer"
                  >
                    ثبت و رد مرحله
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Hero Priority 5: All Clear Calm State on Surface */
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-ok shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-ok">وضعیت پایدار</p>
              <h2 className="mt-0.5 text-xl font-bold text-ink">
                همه‌چیز طبق برنامه است — تخمیر و دما در مسیر طبیعی قرار دارند.
              </h2>
              <p className="text-sm text-ink-soft mt-1">
                هیچ اقدام عقب‌افتاده یا فوری برای همین لحظه وجود ندارد؛ مراحل بعدی بر اساس افت چگالی (SG) و روز تخمیر در بخش «مراحل پیش‌رو» نمایش داده شده‌اند.
              </p>
            </div>
          </div>
        )}

        {/* Pre-Commit Confirmation Sheet & 150 mg/L Ceiling Lock */}
        {confirmSession && (() => {
          const perTankSo2Summary = confirmSession.targetTankIds.map((tId) => {
            const ledger = enologyDb.getCumulativeSO2Ledger(
              tId,
              undefined,
              1.5,
              undefined,
              !hasDemo,
              activeBatch?.id
            );
            const kmsForTank = confirmSession.additions.filter(
              (a) => a.compoundType === 'kms' && a.tankId === tId
            );
            const addedSo2 = kmsForTank.reduce((acc, a) => {
              const refVol =
                a.referenceVolumeL && a.referenceVolumeL > 0
                  ? a.referenceVolumeL
                  : 132;
              const mgL = a.unit === 'g' ? (a.amount * 576) / refVol : a.amount;
              return acc + Math.round(mgL * 10) / 10;
            }, 0);
            const projectedTotal =
              Math.round((ledger.estimatedTotalSO2MgL + addedSo2) * 10) / 10;
            return {
              tankId: tId,
              ledger,
              addedSo2: Math.round(addedSo2 * 10) / 10,
              projectedTotal,
              isOverCeiling:
                addedSo2 > 0 && projectedTotal > ledger.legalCeilingMgL
            };
          });

          const worstTankSo2 =
            perTankSo2Summary.reduce(
              (worst, curr) =>
                curr.projectedTotal > worst.projectedTotal ? curr : worst,
              perTankSo2Summary[0]
            ) ?? {
              tankId: currentTankId,
              ledger: enologyDb.getCumulativeSO2Ledger(
                currentTankId,
                undefined,
                1.5,
                undefined,
                !hasDemo,
                activeBatch?.id
              ),
              addedSo2: 0,
              projectedTotal: 0,
              isOverCeiling: false
            };

          const currentLedger = worstTankSo2.ledger;
          const addedSo2FromConfirm = worstTankSo2.addedSo2;
          const projectedTotalSo2 = worstTankSo2.projectedTotal;
          const isProjectedOverCeiling = perTankSo2Summary.some(
            (s) => s.isOverCeiling
          );

          const explicitDestinationLabelFa =
            confirmSession.targetTankIds.length > 1
              ? 'هر دو مخزن قرمز A و B'
              : confirmSession.targetTankIds[0] === 'tank-a'
              ? 'مخزن A'
              : confirmSession.targetTankIds[0] === 'tank-b'
              ? 'مخزن B'
              : 'گالن رُزه';

          return (
            <div className="mt-4 pt-4 border-t border-line space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-base font-bold text-ink flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-warn" />
                  <span>برگ تأیید نهایی پیش از ثبت در دفتر (Pre-Commit Sheet)</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setConfirmSession(null)}
                  className="text-xs font-medium text-ink-soft hover:text-ink cursor-pointer"
                >
                  انصراف
                </button>
              </div>

              <div className="space-y-2.5">
                {confirmSession.additions.length === 0 ? (
                  <p className="text-sm text-ink-soft bg-paper p-3 rounded-lg border border-line">
                    این مرحله عملیاتی فیزیکی است (بدون افزودنی شیمیایی) و به عنوان «انجام شد» در نقشه راه علامت‌گذاری می‌شود.
                  </p>
                ) : (
                  confirmSession.additions.map((add, idx) => {
                    const refVol = add.referenceVolumeL ?? 132;
                    const calcAmount =
                      confirmSession.calculatedAmounts[idx] ?? add.amount;
                    const so2MgL =
                      add.compoundType === 'kms'
                        ? Math.round(((add.amount * 576) / refVol) * 10) / 10
                        : null;
                    const singleTankLabel =
                      add.tankId === 'tank-a'
                        ? 'مخزن A'
                        : add.tankId === 'tank-b'
                        ? 'مخزن B'
                        : 'گالن رُزه';
                    return (
                      <div
                        key={`${add.tankId}-${add.compoundName}-${idx}`}
                        className="bg-paper border border-line rounded-lg p-3 space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span className="font-medium text-ink text-sm">
                            ۱. نام و نوع ترکیب: {add.compoundName}{' '}
                            {add.compoundType ? `(${add.compoundType.toUpperCase()})` : ''}
                          </span>
                          <span className="text-xs text-ink-soft">
                            {add.purpose}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-2 flex-wrap text-xs text-ink-soft">
                          <span>
                            ۲. بچ هدف:{' '}
                            <strong className="font-medium text-ink">
                              {currentBatch?.name ?? 'بچ شراب رشه سردشت'}
                            </strong>
                          </span>
                          <span>
                            مخزن مقصد:{' '}
                            <strong className="font-medium text-ink">
                              {singleTankLabel} ({explicitDestinationLabelFa})
                            </strong>
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          <div className="bg-surface border border-line rounded-lg px-3 py-1.5 flex items-center justify-between">
                            <span className="text-xs text-ink-soft">
                              ۳. مقدار محاسبه‌شده:
                            </span>
                            <span className="font-mono font-medium text-ink ltr-metric">
                              {calcAmount} {add.unit}
                            </span>
                          </div>
                          <div className="bg-surface border border-line rounded-lg px-3 py-1 flex items-center justify-between gap-2">
                            <label className="text-xs font-medium text-ink">
                              مقدار واقعاً افزوده‌شده:
                            </label>
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                step="0.01"
                                value={add.amount}
                                onChange={(e) => {
                                  const val = Number.parseFloat(e.target.value);
                                  if (Number.isNaN(val) || val < 0) return;
                                  const next = [...confirmSession.additions];
                                  next[idx] = { ...next[idx], amount: val };
                                  setConfirmSession({
                                    ...confirmSession,
                                    additions: next
                                  });
                                }}
                                className="w-20 bg-paper border border-line rounded px-2 py-1 text-xs font-mono font-bold text-ink text-center tabular-nums"
                              />
                              <span className="text-xs font-medium text-ink-soft">
                                {add.unit}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-2 flex-wrap text-xs text-ink-soft pt-0.5">
                          <span>
                            ۴. حجم مرجع محاسبه:{' '}
                            <strong className="font-mono font-medium text-ink">
                              {refVol} L
                            </strong>{' '}
                            (فاز مایع مؤثر مخزن)
                          </span>
                          {so2MgL !== null && (
                            <span className="text-ink font-mono ltr-metric">
                              {add.amount} g × 576 ÷ {refVol} L = +{so2MgL} mg/L SO₂
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}

                {confirmSession.additions.length > 0 && (
                  <label className="flex items-center gap-2 bg-paper border border-line rounded-lg p-2.5 text-xs font-medium text-ink cursor-pointer">
                    <input
                      type="checkbox"
                      checked={confirmSession.explicitAdditionConfirmed}
                      onChange={(e) =>
                        setConfirmSession({
                          ...confirmSession,
                          explicitAdditionConfirmed: e.target.checked
                        })
                      }
                    />
                    <span>
                      تأیید می‌کنم این مقدار به مخزن انتخاب‌شده ({explicitDestinationLabelFa}) اضافه شده است
                    </span>
                  </label>
                )}
              </div>

              {addedSo2FromConfirm > 0 && (
                <div className="bg-paper border border-line rounded-lg p-2.5 text-xs flex items-center justify-between flex-wrap gap-2">
                  <span className="text-ink-soft">تأثیر بر بودجه تجمعی سولفیت کل (Total SO₂):</span>
                  <span
                    className={`font-mono font-medium ${
                      isProjectedOverCeiling ? 'text-danger' : 'text-ok'
                    }`}
                  >
                    +{addedSo2FromConfirm} mg/L ← مجموع جدید: {projectedTotalSo2} از {currentLedger.legalCeilingMgL} mg/L
                  </span>
                </div>
              )}

              {isProjectedOverCeiling && (
                <div className="bg-red-50 border border-danger rounded-lg p-3 space-y-2 text-xs text-ink">
                  <p className="font-bold text-danger">
                    هشدار قفل سقف قانونی سولفیت ({currentLedger.legalCeilingMgL} mg/L):
                  </p>
                  <p className="text-xs leading-relaxed text-ink-soft">
                    ثبت این مقدار باعث عبور سولفیت تجمعی اسمی از سقف استاندارد OIV ({projectedTotalSo2} &gt; {currentLedger.legalCeilingMgL} mg/L) می‌شود. لطفاً مقدار گرم KMS را کاهش دهید یا عبور آگاهانه را تأیید نمایید.
                  </p>
                  <label className="flex items-center gap-2 text-xs font-medium text-ink cursor-pointer">
                    <input
                      type="checkbox"
                      checked={confirmSession.overrideOverBudgetConfirmed}
                      onChange={(e) =>
                        setConfirmSession({
                          ...confirmSession,
                          overrideOverBudgetConfirmed: e.target.checked
                        })
                      }
                    />
                    <span>با آگاهی از عبور از سقف اسمی ۱۵۰ mg/L، ثبت این دوز را تأیید می‌کنم.</span>
                  </label>
                </div>
              )}

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmSession(null)}
                  className="px-3.5 py-2 rounded-lg bg-paper border border-line text-ink-soft text-xs font-medium cursor-pointer"
                >
                  لغو
                </button>
                <button
                  type="button"
                  disabled={
                    !confirmSession.explicitAdditionConfirmed ||
                    (isProjectedOverCeiling &&
                      !confirmSession.overrideOverBudgetConfirmed)
                  }
                  onClick={handleCommitAdditions}
                  className="px-4 py-2 rounded-lg bg-wine disabled:opacity-40 text-white text-xs font-bold cursor-pointer"
                >
                  تأیید و ثبت در دفتر
                </button>
              </div>
            </div>
          );
        })()}
      </section>

      {/* 7. Separated Actionable Overdue vs. Closed Windows & Upcoming Actions Strip */}
      {!compact &&
        (queue.overdueActions.length > 0 ||
          queue.closedActions.length > 0 ||
          queue.upcomingActions.length > 0) && (
          <div className="bg-surface border border-line rounded-xl p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Actionable Overdue Items (state === 'missed') */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-warn">
                  اقدامات عقب‌افتاده (هنوز قابل انجام) ({queue.overdueActions.length})
                </h3>
                {queue.overdueActions.length === 0 ? (
                  <p className="text-xs text-ink-soft">
                    هیچ اقدام عقب‌افتادهٔ قابل اجرایی وجود ندارد.
                  </p>
                ) : (
                  <ul className="divide-y divide-line">
                    {queue.overdueActions.slice(0, 3).map((item) => (
                      <li
                        key={item.id}
                        className="py-2.5 flex items-center justify-between gap-2 text-xs"
                      >
                        <span className="font-medium text-ink">
                          {item.titleFa}
                        </span>
                        <button
                          type="button"
                          disabled={!item.canMarkDone}
                          onClick={() => openConfirmSheet(item, [currentTankId])}
                          className="px-3 py-1.5 rounded-lg bg-wine text-white font-bold text-xs disabled:opacity-40 disabled:cursor-not-allowed shrink-0 cursor-pointer"
                        >
                          ثبت جبرانی
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Next Up (Pending Milestones) */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-ink">
                  مراحل پیش‌رو (Next Up)
                </h3>
                <ul className="divide-y divide-line">
                  {queue.upcomingActions.map((item) => (
                    <li
                      key={item.id}
                      className="py-2.5 flex items-center justify-between gap-2 text-xs"
                    >
                      <div>
                        <span className="font-medium text-ink block">
                          {item.titleFa}
                        </span>
                        <span className="text-xs text-ink-soft">
                          {item.triggerSG !== undefined
                            ? `تریگر چگالی: SG ≤ ${item.triggerSG.toFixed(3)}`
                            : `تریگر زمان: روز ${item.triggerDay}`}
                        </span>
                      </div>
                      {item.estimatedHoursUntilDue && (
                        <span className="text-xs text-ink-soft font-mono shrink-0">
                          ~{item.estimatedHoursUntilDue.min} تا{' '}
                          {item.estimatedHoursUntilDue.max} ساعت دیگر
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Closed Windows (state === 'closed', non-executable) */}
            {queue.closedActions.length > 0 && (
              <div className="pt-3 border-t border-line space-y-2">
                <h3 className="text-sm font-bold text-ink-soft flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    پنجره‌های اقدام بسته‌شده (غیرقابل اجرا — تغییر مسیر تصمیم‌گیری) ({queue.closedActions.length})
                  </span>
                </h3>
                <ul className="divide-y divide-line">
                  {queue.closedActions.map((item) => (
                    <li key={item.id} className="py-2 text-xs space-y-0.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium text-ink">
                          {item.titleFa}
                        </span>
                        <span className="text-xs text-ink-soft">
                          پنجره بسته شد
                        </span>
                      </div>
                      {item.closedReasonFa && (
                        <p className="text-xs text-ink-soft leading-relaxed">
                          {item.closedReasonFa}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

      {/* 8. Conditional Closing-Window Deadline Countdowns Strip */}
      {(visibleDeadlines.length > 0 || deadlineCountdowns.length > 0) && (
        <div className="bg-surface border border-line rounded-xl p-4 space-y-2.5">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h3 className="text-sm font-bold text-ink flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-ink-soft" />
              <span>پنجره‌های حساس زمانی و شمارشگر مهلت‌های حیاتی</span>
            </h3>
            <div className="flex items-center gap-2">
              {visibleDeadlines.length < deadlineCountdowns.length && (
                <button
                  type="button"
                  onClick={() => setShowAllDeadlinesToggle((v) => !v)}
                  className="text-xs font-medium text-wine hover:underline cursor-pointer"
                >
                  {showAllDeadlinesToggle
                    ? 'فقط پنجره‌های مرتبط با مرحله فعلی'
                    : `نمایش هر ${deadlineCountdowns.length} پنجره زمانی`}
                </button>
              )}
              <span className="text-xs text-ink-soft">
                زمان‌ها تخمینی بوده و با هر ثبت جدید بازمحاسبه می‌شوند.
              </span>
            </div>
          </div>
          {visibleDeadlines.length === 0 ? (
            <div className="text-xs text-ink-soft flex items-center justify-between pt-1">
              <span>در چگالی فعلی، هیچ پنجره بحرانی باز یا در حال بسته‌شدن وجود ندارد.</span>
              <button
                type="button"
                onClick={() => setShowAllDeadlinesToggle(true)}
                className="text-xs font-medium text-wine underline cursor-pointer"
              >
                مشاهده همه پنجره‌ها
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {visibleDeadlines.map((item) => {
                const borderStyles =
                  item.urgencyLevel === 'critical'
                    ? 'border-danger bg-red-50'
                    : item.urgencyLevel === 'warning'
                    ? 'border-warn bg-amber-50/60'
                    : 'border-line bg-paper';
                return (
                  <div
                    key={item.id}
                    className={`border rounded-lg p-3 text-ink ${borderStyles}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-medium">{item.titleFa}</span>
                      <span className="text-xs font-medium text-ink-soft">
                        {item.rangeTextFa}
                      </span>
                    </div>
                    <p className="text-xs text-ink-soft mt-1 leading-relaxed">
                      {item.explanationFa}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Living Tank Visual Twin (Compact Strip above Measurements) */}
      <LivingTankVisualTwin
        activeTankId={currentTankId}
        onSelectTank={(tId) => {
          setGlobalTankSelection(tId);
          onTankChange?.(tId);
        }}
        compact
      />

      {/* 9. Latest Measurements Strip with Trend Arrows & Quick Lab Deep-Link */}
      <div className="bg-surface border border-line rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="text-xs font-medium text-ink-soft">
            آخرین اندازه‌گیری‌های مخزن:
          </span>

          <span className="px-3 py-1 rounded-lg bg-paper border border-line text-xs font-medium text-ink font-mono ltr-metric">
            {'SG: ' +
              latestSG.toFixed(3) +
              ' (' +
              (sgDelta < -0.0005
                ? `↓ ${Math.abs(sgDelta).toFixed(3)}`
                : sgDelta > 0.0005
                ? `↑ +${sgDelta.toFixed(3)}`
                : '→ 0.000') +
              ')'}
          </span>

          <span
            className={`px-3 py-1 rounded-lg border text-xs font-medium font-mono ltr-metric ${
              isCapTempCritical
                ? 'bg-red-50 border-danger text-danger'
                : 'bg-paper border-line text-ink'
            }`}
          >
            {'Cap: ' +
              latestTempCap.toFixed(1) +
              '°C (' +
              (tempDelta < -0.05
                ? `↓ ${Math.abs(tempDelta).toFixed(1)}`
                : tempDelta > 0.05
                ? `↑ +${tempDelta.toFixed(1)}`
                : '→ 0.0') +
              ')'}
          </span>

          <span className="px-3 py-1 rounded-lg bg-paper border border-line text-xs font-medium text-ink font-mono ltr-metric">
            {'pH: ' +
              latestPH.toFixed(2) +
              ' (' +
              (phDelta < -0.005
                ? `↓ ${Math.abs(phDelta).toFixed(2)}`
                : phDelta > 0.005
                ? `↑ +${phDelta.toFixed(2)}`
                : '→ 0.00') +
              ')'}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() =>
              navigateToLabTest({
                testId: 'hydrometer_temp',
                subTab: 'calculators-sops',
                prefillTankId: currentTankId,
                prefillSG: latestSG,
                prefillPH: latestPH,
                prefillTempC: latestTempCap
              })
            }
            className="px-3.5 py-2 rounded-lg bg-paper hover:bg-line/50 border border-line text-ink text-xs font-medium flex items-center gap-1.5 cursor-pointer"
          >
            <FlaskConical className="w-3.5 h-3.5 text-ink-soft" />
            <span>بررسی در آزمایشگاه</span>
          </button>
        </div>
      </div>

      {/* 10. Compact Bottling Readiness Safety Gate Card */}
      {!compact && (
        <div
          className={`rounded-xl p-4 border ${
            isNearOrAtBottlingWindow
              ? 'bg-amber-50/60 border-warn'
              : 'bg-surface border-line'
          }`}
        >
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setShowBottlingGate((v) => !v)}
              className="flex items-center gap-2 text-sm font-bold text-ink cursor-pointer flex-wrap text-right"
            >
              {bottlingGate.canStartBottling ? (
                <Unlock className="w-4 h-4 text-ok shrink-0" />
              ) : (
                <Lock className="w-4 h-4 text-ink-soft shrink-0" />
              )}
              <span>
                {'دروازهٔ آمادگی بطری‌گذاری: ' +
                  passedBlockingCount +
                  ' از ۴ مورد مسدودکننده تکمیل'}
              </span>
              <span className="text-xs font-medium text-ink-soft">
                —{' '}
                {bottlingGate.allBlockingPassed
                  ? 'آماده بطری‌گذاری ایمن'
                  : bottlingGate.executionMode === 'override_with_risk'
                  ? 'عبور با مسئولیت شخصی (شروط علمی همچنان ردشده)'
                  : `${4 - passedBlockingCount} مورد مسدودکننده باقی‌مانده`}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setShowBottlingGate((v) => !v)}
              className="text-xs font-medium text-wine hover:underline cursor-pointer"
            >
              {showBottlingGate ? 'بستن چک‌لیست' : 'باز کردن چک‌لیست ۸گانه'}
            </button>
          </div>

          {(showBottlingGate || showAllDetails) && (
            <div className="mt-3 pt-3 border-t border-line space-y-3">
              {bottlingGate.executionMode === 'override_with_risk' && (
                <div className="bg-red-50 text-ink border border-danger rounded-lg p-3 space-y-1 text-xs">
                  <div className="font-bold text-danger flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>
                      {bottlingGate.overrideWarningFa ??
                        'هشدار بحرانی: مجوز بطری‌گیری تنها با پذیرش ریسک شخصی باز شده است؛ شروط علمی مسدودکننده همچنان ردشده هستند.'}
                    </span>
                  </div>
                  {bottlingGate.overriddenBlockerIds &&
                    bottlingGate.overriddenBlockerIds.length > 0 && (
                      <div className="text-xs text-ink-soft font-mono">
                        شروط علمی ردشده (Overridden Blockers):{' '}
                        {bottlingGate.overriddenBlockerIds.join(' ، ')}
                      </div>
                    )}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 4 Blocking Items */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-ink">
                    الف) ۴ شرط الزامی و مسدودکننده (جلوگیری از انفجار بطری و فساد):
                  </h3>
                  {bottlingGate.blockingItems.map((item) => {
                    const dataStatusLabel =
                      item.dataStatus === 'verified'
                        ? 'تأییدشده'
                        : item.dataStatus === 'incomplete_data'
                        ? 'دادهٔ ناقص'
                        : 'ردشده';

                    return (
                      <div
                        key={item.id}
                        className="p-3 rounded-lg border border-line bg-paper text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-medium text-ink">{item.titleFa}</span>
                            <span
                              className={`text-xs font-medium ${
                                item.status === 'passed' ? 'text-ok' : 'text-danger'
                              }`}
                            >
                              ({dataStatusLabel})
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedBottlingWhyId(
                                expandedBottlingWhyId === item.id ? null : item.id
                              )
                            }
                            className="text-xs underline font-medium text-ink-soft hover:text-ink cursor-pointer shrink-0"
                          >
                            چرا؟
                          </button>
                        </div>
                        <p className="text-xs text-ink-soft">{item.detailFa}</p>
                        {(showAllDetails || expandedBottlingWhyId === item.id) && (
                          <p className="text-xs bg-surface p-2 rounded border border-line text-ink-soft">
                            {item.whyFa}
                          </p>
                        )}
                        {item.id === 'dryness_stability' && (
                          <label className="flex items-center gap-1.5 pt-1 text-xs font-medium text-ink cursor-pointer">
                            <input
                              type="checkbox"
                              checked={Boolean(bottlingConfirmations.rsConfirmed)}
                              onChange={(e) =>
                                setBottlingConfirmations({
                                  ...bottlingConfirmations,
                                  rsConfirmed: e.target.checked
                                })
                              }
                            />
                            <span>
                              تأیید آزمایش قند باقی‌مانده Clinitest &lt; 2 g/L
                            </span>
                          </label>
                        )}
                        {item.id === 'malic_mlf_stability' &&
                          item.status !== 'passed' && (
                            <label className="flex items-center gap-1.5 pt-1 text-xs font-medium text-ink cursor-pointer">
                              <input
                                type="checkbox"
                                checked={Boolean(
                                  bottlingConfirmations.malicRiskAccepted
                                )}
                                onChange={(e) =>
                                  setBottlingConfirmations({
                                    ...bottlingConfirmations,
                                    malicRiskAccepted: e.target.checked
                                  })
                                }
                              />
                              <span>
                                فیلتراسیون استریل انجام شده یا ریسک مالیک را می‌پذیرم
                              </span>
                            </label>
                          )}
                        {item.id === 'visual_clarity_degas' && (
                          <label className="flex items-center gap-1.5 pt-1 text-xs font-medium text-ink cursor-pointer">
                            <input
                              type="checkbox"
                              checked={Boolean(
                                bottlingConfirmations.clarityConfirmed
                              )}
                              onChange={(e) =>
                                setBottlingConfirmations({
                                  ...bottlingConfirmations,
                                  clarityConfirmed: e.target.checked
                                })
                              }
                            />
                            <span>
                              تست چراغ‌قوه انجام شد: شراب کاملاً زلال و بدون حباب CO₂ است
                            </span>
                          </label>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* 4 Advisory Items */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-ink">
                    ب) ۴ شرط توصیه‌شده و کنترلی (کیفیت و پایداری ظاهری):
                  </h3>
                  {bottlingGate.advisoryItems.map((item) => {
                    const dataStatusLabel =
                      item.dataStatus === 'verified'
                        ? 'تأییدشده'
                        : item.dataStatus === 'incomplete_data'
                        ? 'دادهٔ ناقص'
                        : 'ردشده';
                    return (
                      <div
                        key={item.id}
                        className="p-3 rounded-lg border border-line bg-paper text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-medium text-ink">{item.titleFa}</span>
                            <span className="text-xs font-medium text-ink-soft">
                              ({dataStatusLabel})
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedBottlingWhyId(
                                expandedBottlingWhyId === item.id ? null : item.id
                              )
                            }
                            className="text-xs underline font-medium text-ink-soft hover:text-ink cursor-pointer shrink-0"
                          >
                            چرا؟
                          </button>
                        </div>
                        <p className="text-xs text-ink-soft">{item.detailFa}</p>
                        {(showAllDetails || expandedBottlingWhyId === item.id) && (
                          <p className="text-xs bg-surface p-2 rounded border border-line text-ink-soft">
                            {item.whyFa}
                          </p>
                        )}
                        {item.id === 'cold_stabilization' && (
                          <label className="flex items-center gap-1.5 pt-1 text-xs font-medium text-ink cursor-pointer">
                            <input
                              type="checkbox"
                              checked={Boolean(
                                bottlingConfirmations.coldStabConfirmedOrSkipped
                              )}
                              onChange={(e) =>
                                setBottlingConfirmations({
                                  ...bottlingConfirmations,
                                  coldStabConfirmedOrSkipped: e.target.checked
                                })
                              }
                            />
                            <span>پایدارسازی سرد انجام شد (یا رسوب کریستال را می‌پذیرم)</span>
                          </label>
                        )}
                        {item.id === 'warm_bottle_test' && (
                          <label className="flex items-center gap-1.5 pt-1 text-xs font-medium text-ink cursor-pointer">
                            <input
                              type="checkbox"
                              checked={Boolean(
                                bottlingConfirmations.warmTestPassed
                              )}
                              onChange={(e) =>
                                setBottlingConfirmations({
                                  ...bottlingConfirmations,
                                  warmTestPassed: e.target.checked
                                })
                              }
                            />
                            <span>تست ۴۸ ساعته بطری شاهد در ۲۵°C بدون حباب پاس شد</span>
                          </label>
                        )}
                        {item.id === 'bottle_cork_sanitation' && (
                          <label className="flex items-center gap-1.5 pt-1 text-xs font-medium text-ink cursor-pointer">
                            <input
                              type="checkbox"
                              checked={Boolean(
                                bottlingConfirmations.sanitationConfirmed
                              )}
                              onChange={(e) =>
                                setBottlingConfirmations({
                                  ...bottlingConfirmations,
                                  sanitationConfirmed: e.target.checked
                                })
                              }
                            />
                            <span>بطری‌ها و چوب‌پنبه‌ها ضدعفونی و آماده شده‌اند</span>
                          </label>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottling Action Bar & Risk Override */}
              <div className="bg-paper border border-line rounded-lg p-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {!bottlingGate.allBlockingPassed && (
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="text-xs font-medium text-ink shrink-0">
                      ادامه با پذیرش ریسک شخصی:
                    </span>
                    <input
                      type="text"
                      value={riskOverrideReason}
                      onChange={(e) => setRiskOverrideReason(e.target.value)}
                      placeholder="علت عبور از قفل ایمنی بطری را بنویسید..."
                      className="flex-1 bg-surface border border-line rounded-lg px-3 py-1.5 text-xs text-ink"
                    />
                  </div>
                )}
                <button
                  type="button"
                  disabled={!bottlingGate.canStartBottling}
                  onClick={() => setBottlingUnlockedNotice(true)}
                  className="px-4 py-2 rounded-lg bg-wine disabled:opacity-40 text-white text-xs font-bold cursor-pointer shrink-0"
                >
                  {bottlingGate.allBlockingPassed
                    ? 'شروع بطری‌گیری ایمن'
                    : 'ادامه با پذیرش ریسک و شروع بطری‌گیری'}
                </button>
              </div>

              {bottlingUnlockedNotice && (
                <div className="bg-paper border border-ok text-ok rounded-lg p-2.5 text-xs font-medium">
                  مجوز شروع بطری‌گیری صادر شد. می‌توانید دوز نهایی KMS و اسید اسکوربیک روز ۹۹–۱۰۰ را ثبت نمایید.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 11. Single Large Thumb-Zone Floating Action Button (No double '+') */}
      <button
        type="button"
        onClick={handleTriggerQuickLog}
        className="fixed bottom-20 left-4 right-4 md:left-8 md:right-auto md:bottom-8 z-30 min-h-[52px] px-6 rounded-xl bg-wine text-white text-base font-bold shadow-lg flex items-center justify-center gap-2 cursor-pointer"
      >
        <Plus className="w-5 h-5" />
        <span>ثبت اندازه‌گیری</span>
      </button>

      {/* 12. 5-Step Batch Onboarding Wizard Modal */}
      <BatchOnboardingWizardModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onBatchCreated={() => {
          setCompletedSteps([]);
          setRefreshTick((t) => t + 1);
          notifyDataChanged();
          onDataChanged?.();
        }}
      />
    </section>
  );
};

