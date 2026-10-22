import React, { useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  FlaskConical,
  Gauge,
  Info,
  Thermometer
} from 'lucide-react';
import type {
  ChemicalAddition,
  FermentationLogEntry,
  LabAnalysisRecord,
  TankId
} from '../types/index.ts';
import { enologyDb } from '../db/enologyDatabase.ts';
import {
  calculateMolecularSO2,
  getContinuousTargetFreeSO2ByPH
} from '../utils/enologyUtils.ts';
import {
  calculateRecentLogVelocity,
  getCapTemperatureAlertLevel,
  predictFermentationCompletion,
  sortFermentationLogs
} from '../utils/trackingCalculations.ts';
import {
  evaluateRightNowQueue,
  type RightNowMilestone
} from '../utils/rightNowEngine.ts';
import { useEnologyUi } from '../context/EnologyUiContext.tsx';
import { LivingTankVisualTwin } from './LivingTankVisualTwin.tsx';

export interface BandedFermentationChartAndSO2PanelProps {
  tankId: TankId;
  logs: FermentationLogEntry[];
  additions: ChemicalAddition[];
  labAnalyses: LabAnalysisRecord[];
  onSelectMilestone?: (milestoneId: string) => void;
}

const STAGE_SEGMENT_COLORS = [
  'bg-amber-500',
  'bg-rose-500',
  'bg-emerald-500',
  'bg-sky-500',
  'bg-purple-500'
] as const;

const SG_MILESTONE_IDS = [
  'sna-1',
  'sna-2-dap',
  'phase2-tannin',
  'sna-3-organic',
  'pressing'
] as const;

export const BandedFermentationChartAndSO2Panel: React.FC<
  BandedFermentationChartAndSO2PanelProps
> = ({ tankId, logs, additions, labAnalyses, onSelectMilestone }) => {
  const { activeBatch } = useEnologyUi();
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string | null>(
    null
  );
  const [visibleLayers, setVisibleLayers] = useState<Array<'sg' | 'temp' | 'so2'>>(['sg', 'so2']);

  const toggleLayer = (layer: 'sg' | 'temp' | 'so2') => {
    setVisibleLayers((prev) =>
      prev.includes(layer)
        ? prev.length > 1
          ? prev.filter((l) => l !== layer)
          : prev
        : [...prev, layer]
    );
  };

  const isRose = tankId === 'tank-rose';
  const tankLogs = useMemo(
    () => sortFermentationLogs(logs.filter((l) => l.tankId === tankId)),
    [logs, tankId]
  );

  const benchmarkLogs = useMemo(
    () => tankLogs.filter((l) => l.isBenchmark === true),
    [tankLogs]
  );
  const realLogs = useMemo(
    () => tankLogs.filter((l) => l.isBenchmark !== true),
    [tankLogs]
  );
  const activeSeriesLogs = realLogs.length > 0 ? realLogs : benchmarkLogs;
  const latestLog = activeSeriesLogs[activeSeriesLogs.length - 1];

  // =========================================================================
  // PART A: DUAL SO2 BUDGET BAR & MEASURED FREE SO2 GAUGE (Idea 8)
  // =========================================================================
  const hasDemo = useMemo(() => enologyDb.hasDemoData(), [logs, additions]);
  const so2Ledger = useMemo(
    () =>
      enologyDb.getCumulativeSO2Ledger(
        tankId,
        undefined,
        1.5,
        undefined,
        !hasDemo,
        activeBatch?.id
      ),
    [tankId, additions, hasDemo, activeBatch?.id]
  );

  const latestMeasuredPhLog = [...realLogs]
    .reverse()
    .find((l) => l.phMeasured !== false && Number.isFinite(l.ph));
  const currentPH = latestMeasuredPhLog?.ph ?? (isRose ? 3.32 : 3.52);
  const continuousSo2Target = useMemo(
    () => getContinuousTargetFreeSO2ByPH(currentPH, isRose),
    [currentPH, isRose]
  );

  const latestMeasuredFreeSO2 = useMemo(() => {
    const tankRipper = [...labAnalyses]
      .filter((a) => a.tankId === tankId && a.testType === 'ripper_so2')
      .sort((a, b) => (b.timestampMs ?? 0) - (a.timestampMs ?? 0))[0];
    if (tankRipper) {
      const val = Number.parseFloat(String(tankRipper.measuredValue));
      if (Number.isFinite(val)) {
        return { value: val, dateFa: tankRipper.date, sourceFa: 'تست ریپر آزمایشگاه' };
      }
    }
    const logWithSo2 = [...realLogs]
      .reverse()
      .find(
        (l) =>
          l.freeSO2Measured !== false &&
          l.freeSO2 !== undefined &&
          l.freeSO2 > 0
      );
    if (logWithSo2 && logWithSo2.freeSO2 !== undefined) {
      return {
        value: logWithSo2.freeSO2,
        dateFa: logWithSo2.dateTime,
        sourceFa: 'ثبت روزانه مخزن'
      };
    }
    return null;
  }, [labAnalyses, tankId, realLogs]);

  const molecularSO2 = useMemo(() => {
    if (!latestMeasuredFreeSO2) return null;
    return calculateMolecularSO2(latestMeasuredFreeSO2.value, currentPH);
  }, [latestMeasuredFreeSO2, currentPH]);

  // =========================================================================
  // PART B: KINETIC VELOCITY, PREDICTION FAN, 3 STATUS PILLS & MILESTONES
  // =========================================================================
  const velocityInfo = useMemo(
    () => calculateRecentLogVelocity(activeSeriesLogs, activeBatch?.initialSG),
    [activeSeriesLogs, activeBatch?.initialSG]
  );
  const prediction = useMemo(
    () =>
      predictFermentationCompletion(
        activeSeriesLogs,
        tankId,
        undefined,
        undefined,
        activeBatch?.initialSG
      ),
    [activeSeriesLogs, tankId, activeBatch?.initialSG]
  );

  const rightNowQueue = useMemo(
    () =>
      evaluateRightNowQueue({
        logs,
        additions,
        activeTankId: tankId,
        batch: activeBatch
      }),
    [logs, additions, tankId, activeBatch]
  );

  const sgMilestones = useMemo(
    () =>
      rightNowQueue.allMilestones.filter((m) =>
        (SG_MILESTONE_IDS as readonly string[]).includes(m.id)
      ),
    [rightNowQueue]
  );

  // Check if latest real SG point lies within the [0.70x, 1.40x] time-stretched benchmark band
  const isInsideReferenceBand = useMemo(() => {
    if (!latestLog || benchmarkLogs.length < 2) return true;
    const sg = latestLog.sg;
    if (sg <= 0.995) return true;
    const day = latestLog.dayNumber;
    // Find benchmark day for this SG via interpolation
    let benchDayAtSG = day;
    for (let i = 0; i < benchmarkLogs.length - 1; i++) {
      const b1 = benchmarkLogs[i];
      const b2 = benchmarkLogs[i + 1];
      if (sg <= b1.sg && sg >= b2.sg) {
        const spanSG = Math.max(0.0001, b1.sg - b2.sg);
        const ratio = (b1.sg - sg) / spanSG;
        benchDayAtSG = b1.dayNumber + ratio * (b2.dayNumber - b1.dayNumber);
        break;
      }
    }
    const minFastDay = benchDayAtSG * 0.7 - 0.5;
    const maxSlowDay = benchDayAtSG * 1.4 + 1.0;
    return day >= minFastDay && day <= maxSlowDay;
  }, [latestLog, benchmarkLogs]);

  const currentTempCap = latestLog?.tempCap ?? (isRose ? 16.5 : 23.5);
  const currentSG = latestLog?.sg ?? 1.092;
  const tempAlertLevel = getCapTemperatureAlertLevel(
    currentTempCap,
    isRose,
    currentSG
  );

  const isStuckRisk =
    currentSG > 1.01 &&
    latestLog !== undefined &&
    latestLog.dayNumber >= 2 &&
    velocityInfo.recentVelocityPerDay < 0.003;

  // 3 Simple Status Pills (Idea 3)
  const speedPillLabel: 'کند' | 'عادی' | 'تند' =
    velocityInfo.recentVelocityPerDay < 0.006
      ? 'کند'
      : velocityInfo.recentVelocityPerDay > 0.022
      ? 'تند'
      : 'عادی';

  const tempPillLabel: 'پایین' | 'خوب' | 'بالا' =
    currentSG <= 0.995
      ? currentTempCap <= 20
        ? 'خوب'
        : 'بالا'
      : (isRose && currentTempCap < 13) || (!isRose && currentTempCap < 18)
      ? 'پایین'
      : tempAlertLevel === 'warning' || tempAlertLevel === 'danger'
      ? 'بالا'
      : 'خوب';

  const healthPillLabel: 'سالم' | 'نیاز به توجه' =
    isInsideReferenceBand && !isStuckRisk && tempAlertLevel !== 'danger'
      ? 'سالم'
      : 'نیاز به توجه';

  const contextualOneSentenceReasonFa =
    healthPillLabel === 'سالم'
      ? `افت ${velocityInfo.recentVelocityPerDay.toFixed(3)} در روز؛ در دمای ${currentTempCap} °C عادی و سالم است.`
      : isStuckRisk
      ? `افت ${velocityInfo.recentVelocityPerDay.toFixed(3)} در روز کند شده است؛ دما (${currentTempCap} °C) و هوادهی/تغذیه مخمر را بررسی کنید.`
      : `دمای ${currentTempCap} °C یا سرعت افت (${velocityInfo.recentVelocityPerDay.toFixed(3)} در روز) نیازمند پایش کارگاهی است.`;

  // =========================================================================
  // SVG COORDINATE HELPERS FOR BANDED SG CHART & TEMP STRIP
  // =========================================================================
  const svgWidth = 720;
  const svgHeight = 250;
  const padLeft = 48;
  const padRight = 24;
  const padTop = 20;
  const padBottom = 30;
  const plotW = svgWidth - padLeft - padRight;
  const plotH = svgHeight - padTop - padBottom;

  const maxDayOnAxis = useMemo(() => {
    const maxLogDay = Math.max(
      10,
      ...tankLogs.map((l) => l.dayNumber),
      (latestLog?.dayNumber ?? 0) +
        (currentSG > 1.0 ? Math.min(14, prediction.estimatedDaysRange.max) : 0)
    );
    return Math.ceil(maxLogDay * 1.15);
  }, [tankLogs, latestLog, currentSG, prediction.estimatedDaysRange.max]);

  const sgMin = 0.988;
  const sgMax = 1.098;

  const dayToX = (day: number): number => {
    const clamped = Math.max(0, Math.min(maxDayOnAxis, day));
    return padLeft + (clamped / Math.max(1, maxDayOnAxis)) * plotW;
  };

  const sgToY = (sg: number): number => {
    const clamped = Math.max(sgMin, Math.min(sgMax, sg));
    const ratio = (sgMax - clamped) / (sgMax - sgMin);
    return padTop + ratio * plotH;
  };

  // Shaded Reference Band Polygon Points ([0.70x fast, 1.40x slow])
  const referenceBandPolygonPoints = useMemo(() => {
    const refSeries = benchmarkLogs.length >= 2 ? benchmarkLogs : activeSeriesLogs;
    if (refSeries.length < 2) return '';
    const fastEdge = refSeries.map(
      (pt) => `${dayToX(pt.dayNumber * 0.7).toFixed(1)},${sgToY(pt.sg).toFixed(1)}`
    );
    const slowEdgeReversed = [...refSeries]
      .reverse()
      .map(
        (pt) =>
          `${dayToX(pt.dayNumber * 1.4).toFixed(1)},${sgToY(pt.sg).toFixed(1)}`
      );
    return [...fastEdge, ...slowEdgeReversed].join(' ');
  }, [benchmarkLogs, activeSeriesLogs, maxDayOnAxis]);

  const benchmarkPolylinePoints = useMemo(
    () =>
      benchmarkLogs
        .map((pt) => `${dayToX(pt.dayNumber).toFixed(1)},${sgToY(pt.sg).toFixed(1)}`)
        .join(' '),
    [benchmarkLogs, maxDayOnAxis]
  );

  const realPolylinePoints = useMemo(
    () =>
      activeSeriesLogs
        .map((pt) => `${dayToX(pt.dayNumber).toFixed(1)},${sgToY(pt.sg).toFixed(1)}`)
        .join(' '),
    [activeSeriesLogs, maxDayOnAxis]
  );

  // Interpolate X position on active curve for each SG milestone
  const getDayAtSG = (targetSgVal: number): number => {
    const series = activeSeriesLogs.length >= 2 ? activeSeriesLogs : benchmarkLogs;
    for (let i = 0; i < series.length - 1; i++) {
      const p1 = series[i];
      const p2 = series[i + 1];
      if (targetSgVal <= p1.sg && targetSgVal >= p2.sg) {
        const span = Math.max(0.0001, p1.sg - p2.sg);
        const ratio = (p1.sg - targetSgVal) / span;
        return p1.dayNumber + ratio * (p2.dayNumber - p1.dayNumber);
      }
    }
    const startSG =
      activeBatch?.initialSG ?? activeSeriesLogs[0]?.sg ?? 1.092;
    return Math.max(
      1,
      ((startSG - targetSgVal) / Math.max(0.02, startSG - 0.992)) * 8
    );
  };

  const selectedMilestone: RightNowMilestone | undefined = sgMilestones.find(
    (m) => m.id === selectedMilestoneId
  );

  return (
    <div className="space-y-4 font-['Vazirmatn',sans-serif]">
      {/* Living Tank Visual Twin Widget */}
      <LivingTankVisualTwin activeTankId={tankId} />

      {/* Layer Toggle Chips */}
      <div className="flex items-center gap-2 flex-wrap bg-surface p-2 rounded-xl border border-line">
        <span className="text-xs font-bold text-ink-soft px-1">لایه‌های نمایش:</span>
        <button
          type="button"
          onClick={() => toggleLayer('sg')}
          className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            visibleLayers.includes('sg')
              ? 'bg-wine text-white shadow-xs'
              : 'bg-paper text-ink border border-line hover:bg-stone-200/60'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>نمودار SG و مراحل</span>
          {visibleLayers.includes('sg') && (
            <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded-full">فعال</span>
          )}
        </button>
        <button
          type="button"
          onClick={() => toggleLayer('temp')}
          className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            visibleLayers.includes('temp')
              ? 'bg-wine text-white shadow-xs'
              : 'bg-paper text-ink border border-line hover:bg-stone-200/60'
          }`}
        >
          <Thermometer className="w-4 h-4" />
          <span>نوار دمای کلاهک</span>
          {visibleLayers.includes('temp') && (
            <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded-full">فعال</span>
          )}
        </button>
        <button
          type="button"
          onClick={() => toggleLayer('so2')}
          className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            visibleLayers.includes('so2')
              ? 'bg-wine text-white shadow-xs'
              : 'bg-paper text-ink border border-line hover:bg-stone-200/60'
          }`}
        >
          <FlaskConical className="w-4 h-4" />
          <span>بودجه و گیج SO2</span>
          {visibleLayers.includes('so2') && (
            <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded-full">فعال</span>
          )}
        </button>
      </div>

      {/* =================================================================== */}
      {/* PART A: DUAL SO2 ADDED-BUDGET BAR vs MEASURED FREE SO2 GAUGE        */}
      {/* =================================================================== */}
      {visibleLayers.includes('so2') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Card 1: Nominal Added SO2 Stacked Bar (افزودهشده — محاسبهای) */}
        <div className="bg-surface text-ink rounded-xl border border-line p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-wine shrink-0" />
              <h4 className="text-xs sm:text-sm font-bold text-ink">
                ۱. بودجه تجمعی سولفیت کل (افزوده‌شده — محاسبه‌ای)
              </h4>
            </div>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${
                so2Ledger.isOverBudget
                  ? 'bg-red-50 text-danger border border-red-200'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}
            >
              {so2Ledger.estimatedTotalSO2MgL} / {so2Ledger.legalCeilingMgL} mg/L
            </span>
          </div>

          {/* Segmented Horizontal Progress Bar up to legalCeilingMgL */}
          <div className="space-y-1.5">
            <div className="h-4 w-full bg-paper rounded-full overflow-hidden flex border border-line relative">
              {so2Ledger.stageBreakdown.map((stage, idx) => {
                const widthPct = Math.min(
                  100,
                  Math.max(
                    2,
                    (stage.contributedMgL / so2Ledger.legalCeilingMgL) * 100
                  )
                );
                const colorClass =
                  STAGE_SEGMENT_COLORS[idx % STAGE_SEGMENT_COLORS.length];
                return (
                  <div
                    key={stage.id}
                    style={{ width: `${widthPct}%` }}
                    title={`${stage.stageTitle}: +${stage.contributedMgL} mg/L (${stage.formulaText})`}
                    className={`${colorClass} h-full border-r border-white/60 transition-all`}
                  />
                );
              })}
              {/* Endogenous Yeast SO2 Segment (15 mg/L) */}
              <div
                style={{
                  width: `${
                    (so2Ledger.endogenousYeastMgL / so2Ledger.legalCeilingMgL) *
                    100
                  }%`
                }}
                title={`تولید درون‌زای مخمر: +${so2Ledger.endogenousYeastMgL} mg/L`}
                className="bg-stone-400 h-full"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-ink-soft">
              <span>
                مجموع KMS افزوده‌شده: {so2Ledger.addedFromKmsMgL} mg/L + مخمر درون‌زا:{' '}
                {so2Ledger.endogenousYeastMgL} mg/L
              </span>
              <span className="text-emerald-800 font-bold">
                باقی‌مانده تا سقف OIV: {so2Ledger.remainingBudgetMgL} mg/L
              </span>
            </div>
          </div>

          {/* Transparent Per-Stage Formula Breakdown */}
          <div className="bg-paper border border-line rounded-xl p-2.5 space-y-1 max-h-28 overflow-y-auto text-xs">
            {so2Ledger.stageBreakdown.length === 0 ? (
              <div className="text-ink-soft">
                هنوز تزریق سولفیت (KMS) واقعی برای این مخزن ثبت نشده است.
              </div>
            ) : (
              so2Ledger.stageBreakdown.map((st, idx) => (
                <div
                  key={st.id}
                  className="flex items-center justify-between gap-2 text-ink"
                >
                  <span className="truncate">
                    {idx + 1}. {st.stageTitle}:
                  </span>
                  <span className="font-mono text-wine font-bold shrink-0">
                    {st.formulaText}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Mandatory Honest Scientific Label */}
          <p className="text-xs text-ink-soft leading-relaxed flex items-start gap-1.5">
            <Info className="w-3.5 h-3.5 text-wine shrink-0 mt-0.5" />
            <span>
              تخمین حداکثر سولفیت افزوده‌شده؛ مقدار واقعی در شراب کمتر است (بخشی به استالدئید و آنتوسیانین متصل می‌شود).
            </span>
          </p>
        </div>

        {/* Card 2: Measured Free SO2 Gauge vs Continuous pH Target */}
        <div className="bg-surface text-ink rounded-xl border border-line p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-emerald-700 shrink-0" />
              <h4 className="text-xs sm:text-sm font-bold text-ink">
                ۲. SO₂ آزاد اندازه‌گیری‌شده در برابر هدف پیوسته pH ({currentPH.toFixed(2)})
              </h4>
            </div>
            {latestMeasuredFreeSO2 ? (
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  latestMeasuredFreeSO2.value >= continuousSo2Target.min
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}
              >
                {latestMeasuredFreeSO2.value >= continuousSo2Target.min
                  ? 'در محدوده ایمن'
                  : 'نیازمند شارژ KMS'}
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-paper text-ink-soft border border-line">
                اندازه‌گیری نشده
              </span>
            )}
          </div>

          {/* Continuous Henderson-Hasselbalch Target Window */}
          <div className="bg-paper border border-line rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-ink-soft">
                پنجره هدف پیوسته برای pH = {currentPH.toFixed(2)}:
              </span>
              <span className="font-mono font-bold text-emerald-800">
                {continuousSo2Target.min} تا {continuousSo2Target.max} mg/L (هدف بهینه:{' '}
                {continuousSo2Target.target} mg/L)
              </span>
            </div>

            {/* Visual Target Band Gauge (0 to 80 mg/L scale) */}
            <div className="h-3.5 w-full bg-stone-200/80 rounded-full relative overflow-hidden border border-line">
              <div
                style={{
                  left: `${Math.min(100, (continuousSo2Target.min / 80) * 100)}%`,
                  width: `${Math.min(
                    100,
                    ((continuousSo2Target.max - continuousSo2Target.min) / 80) * 100
                  )}%`
                }}
                className="absolute top-0 bottom-0 bg-emerald-500/35 border-x border-emerald-600"
                title="پنجره ایمن سولفیت آزاد"
              />
              {latestMeasuredFreeSO2 && (
                <div
                  style={{
                    left: `${Math.min(98, Math.max(2, (latestMeasuredFreeSO2.value / 80) * 100))}%`
                  }}
                  className="absolute top-0 bottom-0 w-2 bg-wine rounded-full shadow"
                  title={`مقدار اندازه‌گیری‌شده: ${latestMeasuredFreeSO2.value} mg/L`}
                />
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-ink-soft flex-wrap gap-2">
              {latestMeasuredFreeSO2 ? (
                <>
                  <span>
                    آخرین قرائت ({latestMeasuredFreeSO2.sourceFa} —{' '}
                    {latestMeasuredFreeSO2.dateFa}):{' '}
                    <strong className="text-ink font-mono">
                      {latestMeasuredFreeSO2.value} mg/L
                    </strong>
                  </span>
                  {molecularSO2 !== null && (
                    <span className="font-mono text-wine font-bold">
                      SO₂ مولکولی فعال: {molecularSO2.toFixed(2)} mg/L
                    </span>
                  )}
                </>
              ) : (
                <span>
                  هنوز تست ریپر (Free SO₂) ثبت نشده است؛ پیش از بطری‌گذاری یا سیفون اندازه‌گیری شود.
                </span>
              )}
            </div>
          </div>

          <div className="text-xs font-mono text-ink-soft">
            فرمول پیوسته هندرسون-هاسلباخ: {continuousSo2Target.formulaText}
          </div>
        </div>
      </div>
      )}

      {/* =================================================================== */}
      {/* PART B: BANDED FERMENTATION SVG CHART, MILESTONES & TEMP STRIP      */}
      {/* =================================================================== */}
      {(visibleLayers.includes('sg') || visibleLayers.includes('temp')) && (
      <div className="bg-surface border border-line rounded-xl p-4 shadow-xs space-y-3">
        {/* Top Row: 3 Simple Status Pills + 1-Sentence Reason (Idea 3) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-line">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-ink flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-wine" />
              <span>نمودار باند مرجع تخمیر، نشانگرهای تغذیه و مخروط پیش‌بینی خشکی</span>
            </span>

            {/* Pill 1: Speed */}
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                speedPillLabel === 'عادی'
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                  : 'bg-amber-50 text-amber-900 border-amber-300'
              }`}
            >
              سرعت: {speedPillLabel}
            </span>

            {/* Pill 2: Temp */}
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                tempPillLabel === 'خوب'
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                  : tempPillLabel === 'پایین'
                  ? 'bg-sky-50 text-sky-900 border-sky-300'
                  : 'bg-rose-50 text-rose-900 border-rose-300'
              }`}
            >
              دما: {tempPillLabel}
            </span>

            {/* Pill 3: Overall Status */}
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${
                healthPillLabel === 'سالم'
                  ? 'bg-emerald-600 text-white border-emerald-700'
                  : 'bg-amber-500 text-stone-950 border-amber-600'
              }`}
            >
              {healthPillLabel === 'سالم' ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <AlertTriangle className="w-3.5 h-3.5" />
              )}
              <span>وضعیت: {healthPillLabel}</span>
            </span>
          </div>

          <div className="text-xs font-bold text-ink bg-paper px-3 py-1.5 rounded-xl border border-line">
            {contextualOneSentenceReasonFa}
          </div>
        </div>

        {/* Next Station ETA Countdown Chip (Idea 4) */}
        {prediction.nextCriticalStation && (
          <div className="rounded-lg border border-line bg-paper px-3 py-2 text-xs text-ink flex items-center justify-between gap-2 flex-wrap">
            <span className="font-bold">
              ایستگاه حساس بعدی: {prediction.nextCriticalStation.titleFa}
            </span>
            <span className="ltr-metric font-bold text-wine">
              SG {prediction.nextCriticalStation.targetSG.toFixed(3)} (~
              {prediction.nextCriticalStation.estimatedHoursRange.min}–
              {prediction.nextCriticalStation.estimatedHoursRange.max} h)
            </span>
          </div>
        )}

        {/* Main SG SVG Chart */}
        {visibleLayers.includes('sg') && (
        <>
        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-auto min-w-[540px] bg-paper/60 rounded-xl border border-line"
            role="img"
            aria-label="نمودار باند سلامت تخمیر و نشانگرهای تغذیه"
          >
            {/* Horizontal SG Grid Lines */}
            {[1.09, 1.07, 1.05, 1.03, 1.01, 0.993].map((sgTick) => {
              const y = sgToY(sgTick);
              return (
                <g key={sgTick}>
                  <line
                    x1={padLeft}
                    y1={y}
                    x2={svgWidth - padRight}
                    y2={y}
                    stroke={sgTick === 0.993 ? '#10b981' : '#e7e5e4'}
                    strokeDasharray={sgTick === 0.993 ? '4 3' : undefined}
                    strokeWidth={sgTick === 0.993 ? 1.5 : 1}
                  />
                  <text
                    x={padLeft - 6}
                    y={y + 4}
                    textAnchor="end"
                    className="fill-stone-500 text-xs font-mono"
                  >
                    {sgTick.toFixed(3)}
                  </text>
                </g>
              );
            })}

            {/* 1. Shaded Reference Corridor ([0.70x fast, 1.40x slow]) */}
            {referenceBandPolygonPoints && (
              <polygon
                points={referenceBandPolygonPoints}
                fill="rgba(16, 185, 129, 0.14)"
                stroke="rgba(16, 185, 129, 0.35)"
                strokeWidth="1"
              />
            )}

            {/* 2. Ideal Benchmark Centerline (Dashed) */}
            {benchmarkPolylinePoints && (
              <polyline
                fill="none"
                stroke="#6366f1"
                strokeWidth="1.75"
                strokeDasharray="5 4"
                points={benchmarkPolylinePoints}
              />
            )}

            {/* 3. Prediction Fan (Cone of Uncertainty to Dryness) */}
            {latestLog && currentSG > 1.0 && (() => {
              const startX = dayToX(latestLog.dayNumber);
              const startY = sgToY(latestLog.sg);
              const targetY = sgToY(prediction.targetSG);
              const minX = dayToX(
                latestLog.dayNumber + prediction.estimatedDaysRange.min
              );
              const maxX = dayToX(
                latestLog.dayNumber + prediction.estimatedDaysRange.max
              );
              const midX = dayToX(
                latestLog.dayNumber + prediction.estimatedRemainingDays
              );
              return (
                <g>
                  <polygon
                    points={`${startX},${startY} ${minX},${targetY} ${maxX},${targetY}`}
                    fill="rgba(245, 158, 11, 0.18)"
                    stroke="rgba(245, 158, 11, 0.45)"
                    strokeDasharray="3 3"
                  />
                  <line
                    x1={startX}
                    y1={startY}
                    x2={midX}
                    y2={targetY}
                    stroke="#d97706"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                  />
                </g>
              );
            })()}

            {/* 4. Real SG Curve Polyline */}
            {realPolylinePoints && (
              <polyline
                fill="none"
                stroke="#be123c"
                strokeWidth="3"
                points={realPolylinePoints}
              />
            )}

            {/* 5. Interactive Milestone Markers on Curve (/ ◯ / ) */}
            {sgMilestones.map((m) => {
              if (m.triggerSG === undefined) return null;
              const mDay = getDayAtSG(m.triggerSG);
              const cx = dayToX(mDay);
              const cy = sgToY(m.triggerSG);
              const isDone = m.state === 'completed';
              const isMissedOrClosed =
                m.state === 'missed' || m.state === 'closed';
              const fill = isDone
                ? '#059669'
                : isMissedOrClosed
                ? '#d97706'
                : '#1e293b';
              const symbol = isDone ? '+' : isMissedOrClosed ? '!' : '•';

              return (
                <g
                  key={m.id}
                  onClick={() => {
                    setSelectedMilestoneId(
                      selectedMilestoneId === m.id ? null : m.id
                    );
                    onSelectMilestone?.(m.id);
                  }}
                  className="cursor-pointer"
                >
                  <circle
                    cx={cx}
                    cy={cy}
                    r={10}
                    fill={fill}
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                  <text
                    x={cx}
                    y={cy + 3.5}
                    textAnchor="middle"
                    className="fill-white text-xs font-bold select-none"
                  >
                    {symbol}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend & Prediction Range Badge */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-ink-soft">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-xs bg-emerald-500/30 border border-emerald-600 inline-block" />
              <span>باند سلامت تخمیر (۳۰٪ سریع‌تر تا ۴۰٪ کندتر)</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-1 bg-rose-700 inline-block" />
              <span>منحنی واقعی مخزن</span>
            </span>
            <span className="text-ink-soft">
              (روی نشانگرهای دایره‌ای روی منحنی کلیک کنید تا جزئیات دوز را ببینید)
            </span>
          </div>
          {currentSG > 1.0 && (
            <span className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-300 text-amber-900 font-bold">
              خشکی: {prediction.estimatedDaysRange.min} تا{' '}
              {prediction.estimatedDaysRange.max} روز دیگر
            </span>
          )}
        </div>

        {/* Clicked Milestone Detail Popover Card */}
        {selectedMilestone && (
          <div className="bg-paper text-ink rounded-xl p-3 border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-wine text-white font-bold text-xs">
                  {selectedMilestone.stateBadgeFa}
                </span>
                <span className="font-bold text-ink">
                  {selectedMilestone.titleFa}
                </span>
                {selectedMilestone.triggerSG !== undefined && (
                  <span className="font-mono text-ink-soft">
                    (SG = {selectedMilestone.triggerSG.toFixed(3)})
                  </span>
                )}
              </div>
              <div className="text-ink-soft mt-1">
                {selectedMilestone.tankRows.find((r) => r.tankId === tankId)
                  ?.doseAmountTextFa ?? selectedMilestone.howToExecuteFa}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSelectedMilestoneId(null)}
              className="text-ink-soft hover:text-ink text-xs self-end sm:self-center cursor-pointer"
            >
              بستن ×
            </button>
          </div>
        )}
        </>
        )}

        {/* 3. Separate Compact Temperature Strip SVG below Main Chart */}
        {visibleLayers.includes('temp') && (
        <div className={`space-y-1 ${visibleLayers.includes('sg') ? 'pt-2 border-t border-stone-200' : ''}`}>
          <div className="flex items-center justify-between text-xs text-stone-600">
            <span className="font-bold flex items-center gap-1">
              <Thermometer className="w-3.5 h-3.5 text-rose-600" />
              <span>
                نوار اختصاصی دمای کلاهک و محیط (باند بهینه:{' '}
                {isRose ? '16 تا 18 °C' : '20 تا 28.5 °C'})
              </span>
            </span>
            <span className="font-mono">
              آخرین دمای کلاهک: {currentTempCap}°C | محیط:{' '}
              {latestLog?.tempRoom ?? 21}°C
            </span>
          </div>
          <svg
            viewBox={`0 0 ${svgWidth} 90`}
            className="w-full h-[90px] bg-stone-50/70 rounded-xl border border-stone-200"
            role="img"
            aria-label="نمودار نوار دمای کلاهک و اتاق"
          >
            {(() => {
              const tMin = 10;
              const tMax = 34;
              const tempToY = (t: number) => {
                const c = Math.max(tMin, Math.min(tMax, t));
                return 10 + ((tMax - c) / (tMax - tMin)) * 68;
              };
              const optHigh = isRose ? 18 : 28.5;
              const optLow = isRose ? 16 : 20;
              const bandTop = tempToY(optHigh);
              const bandBottom = tempToY(optLow);
              const capPts = activeSeriesLogs
                .map(
                  (l) =>
                    `${dayToX(l.dayNumber).toFixed(1)},${tempToY(
                      l.tempCap
                    ).toFixed(1)}`
                )
                .join(' ');
              const roomPts = activeSeriesLogs
                .map(
                  (l) =>
                    `${dayToX(l.dayNumber).toFixed(1)},${tempToY(
                      l.tempRoom
                    ).toFixed(1)}`
                )
                .join(' ');

              return (
                <g>
                  <rect
                    x={padLeft}
                    y={bandTop}
                    width={plotW}
                    height={Math.max(4, bandBottom - bandTop)}
                    fill="rgba(16, 185, 129, 0.14)"
                  />
                  <text
                    x={padLeft - 6}
                    y={bandTop + 4}
                    textAnchor="end"
                    className="fill-stone-500 text-xs font-mono"
                  >
                    {optHigh}°
                  </text>
                  <text
                    x={padLeft - 6}
                    y={bandBottom + 4}
                    textAnchor="end"
                    className="fill-stone-500 text-xs font-mono"
                  >
                    {optLow}°
                  </text>
                  {roomPts && (
                    <polyline
                      fill="none"
                      stroke="#64748b"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                      points={roomPts}
                    />
                  )}
                  {capPts && (
                    <polyline
                      fill="none"
                      stroke="#e11d48"
                      strokeWidth="2.2"
                      points={capPts}
                    />
                  )}
                </g>
              );
            })()}
          </svg>
        </div>
        )}
      </div>
      )}
    </div>
  );
};
