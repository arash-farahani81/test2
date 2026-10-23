import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Circle,
  PlayCircle,
  PauseCircle,
  Clock,
  Timer,
  Sliders,
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  Sparkles,
  FlaskConical,
  Thermometer,
  RotateCcw,
  CheckSquare,
  ChevronDown,
  ChevronUp,
  Info,
  ShieldAlert,
  Flame,
  Layers,
  Wine,
  Database,
  Activity,
  Plus,
  Save,
  FileSpreadsheet,
  FileText,
  Trash2,
  Compass,
  MapPin,
  Calendar,
  Zap
} from 'lucide-react';
import { useLocalStorageState } from '../utils/useLocalStorage.ts';
import { enologyDb } from '../db/enologyDatabase.ts';
import { useFlexibleProtocol, type DynamicProtocolPlan } from '../data/masterProtocolConfig.ts';
import { useEnologyUi } from '../context/EnologyUiContext.tsx';
import {
  formatDoseForEquipment,
  getRoadmapStepEquipmentGuide
} from '../utils/equipmentAdapterEngine.ts';
import { getCurrentPersianDateTimeStr } from '../utils/persianDate.ts';
import { normalizeEnologyNumericInput } from '../utils/enologyUtils.ts';
import { QuickTenSecondLogModal } from './QuickTenSecondLogModal.tsx';
import type { TankId, FermentationLogEntry } from '../types/tracking.ts';
import type { ChemicalAddition, LabAnalysisRecord } from '../types/database.ts';

import { ZERO_TO_HUNDRED_STEPS, getStepLabTools, type ProcessStep, type StepLabToolLink } from "../data/roadmapStepsData.ts";
import { getSmartAdditivePresets } from '../data/smartLoggingPresets.ts';
export { ZERO_TO_HUNDRED_STEPS, getStepLabTools, type ProcessStep, type StepLabToolLink };

export interface ProcessRoadmapTrackerProps {
  onNavigateToTracking?: () => void;
  onNavigateToTestingGuide?: (
    testId?: string,
    subTab?: 'calculators-sops' | 'troubleshooting-crises' | 'saved-history'
  ) => void;
  onNavigateToCalculators?: (testId?: string) => void;
  onNavigateToLabTool?: (
    testId: string,
    subTab?: 'calculators-sops' | 'troubleshooting-crises' | 'saved-history'
  ) => void;
}

function roundSum(a: number, b: number): number {
  return Math.round((a + b) * 100) / 100;
}

export interface WorkshopTimerConfig {
  id: string;
  stepIds: number[];
  title: string;
  mode: 'countdown' | 'stopwatch';
  defaultMinutes: number;
  flexibleWindow: string;
  stationNote: string;
  isCustom?: boolean;
}

export const WORKSHOP_TIMERS_CONFIG: WorkshopTimerConfig[] = [
  {
    id: 'timer-destem-crush',
    stepIds: [3, 4],
    title: 'کرنومتر باز خوشه‌زدایی و کراش انگور (بررسی زمان صرف‌شده)',
    mode: 'stopwatch',
    defaultMinutes: 0,
    flexibleWindow: 'بسته به سرعت تیم کارگاه',
    stationNote: 'گام ۳ و ۴: پایش زمان واقعی تخلیه، خوشه‌زدایی و کراش ۴۰۰ کیلوگرم انگور رشه'
  },
  {
    id: 'timer-rose-maceration',
    stepIds: [6],
    title: 'ماسراسیون سرد رُزه پیش از سانیه',
    mode: 'countdown',
    defaultMinutes: 180,
    flexibleWindow: 'بازه مجاز: ۱۲۰ تا ۲۱۰ دقیقه (شرط خروج: تایید رنگ یاقوتی روشن)',
    stationNote: 'گام ۶: استخراج رنگ یاقوتی/مرجانی از پوست انگور رشه پیش از خون‌گیری'
  },
  {
    id: 'timer-so2-pectinase',
    stepIds: [8],
    title: 'فاصله سولفیت تا تزریق آنزیم پکتیک',
    mode: 'countdown',
    defaultMinutes: 15,
    flexibleWindow: 'بازه مجاز: ۱۵ تا ۳۰ دقیقه',
    stationNote: 'گام ۸: جلوگیری از غیرفعال شدن آنزیم پکتولیتیک توسط غلظت موضعی بالای SO2'
  },
  {
    id: 'timer-pectinase-rest',
    stepIds: [8, 10],
    title: 'استراحت آنزیم پکتولیتیک تا تست الکل',
    mode: 'countdown',
    defaultMinutes: 450,
    flexibleWindow: 'بازه مجاز: ۳۶۰ تا ۵۴۰ دقیقه (شرط خروج: منفی شدن تست الکل پکتین)',
    stationNote: 'گام ۸ تا ۱۰: استراحت مطلق بدون تزریق تانن تا شکست کامل پکتین و تست الکل'
  },
  {
    id: 'timer-tartaric-equilibration',
    stepIds: [12],
    title: 'تعادل یونی تست ۳ لیوانی اسید تارتاریک',
    mode: 'countdown',
    defaultMinutes: 60,
    flexibleWindow: 'بازه مجاز: ۴۵ تا ۹۰ دقیقه',
    stationNote: 'گام ۱۲: زمان تعادل بافری پتاسیم و رسوب اولیه بی‌تارتارات پیش از قرائت نهایی pH'
  },
  {
    id: 'timer-yeast-goferm',
    stepIds: [13, 14],
    title: 'آب‌دهی مخمر در Go-Ferm (۲۰ دقیقه) و گام هم‌دمایی (۸ دقیقه)',
    mode: 'countdown',
    defaultMinutes: 20,
    flexibleWindow: 'بازه مجاز: ۱۵ تا ۲۵ دقیقه آب‌دهی / ۸ تا ۱۲ دقیقه هم‌دمایی',
    stationNote: 'گام ۱۳ و ۱۴: بیدارسازی مخمر در Go-Ferm ۴۳°C و گام‌های هم‌دمایی با شیره'
  },
  {
    id: 'timer-ascorbic-bottling',
    stepIds: [42],
    title: 'اکسیژن‌زدایی ویتامین C پیش از بطری‌گذاری',
    mode: 'countdown',
    defaultMinutes: 30,
    flexibleWindow: 'بازه مجاز: ۳۰ تا ۶۰ دقیقه پیش از پر کردن بطری',
    stationNote: 'گام ۴۲: زمان واکنش ال-اسید اسکوربیک با اکسیژن محلول پیش از شروع پر کردن بطری‌ها'
  }
];

// Alias for backward compatibility
export const CELLAR_COUNTDOWN_TIMERS = WORKSHOP_TIMERS_CONFIG;
export const WORKSHOP_TIMERS: WorkshopTimerConfig[] = WORKSHOP_TIMERS_CONFIG;

export interface GlobalActiveTimerItem {
  id: string;
  title: string;
  stepIds: number[];
  mode: 'countdown' | 'stopwatch';
  elapsedSec: number;
  totalDurationSec: number;
  remainingSec: number;
  formattedTime: string;
  isCompletedCountdown: boolean;
}

export function getGlobalActiveTimersSnapshot(params: {
  runningMap: Record<string, boolean>;
  elapsedMap: Record<string, number>;
  customTimers?: WorkshopTimerConfig[];
  durationOverridesMin?: Record<string, number>;
}): GlobalActiveTimerItem[] {
  const allTimers = [...WORKSHOP_TIMERS, ...(params.customTimers ?? [])];
  return allTimers
    .filter((t) => params.runningMap[t.id] === true)
    .map((t) => {
      const elapsedSec = Math.max(0, Math.floor(params.elapsedMap[t.id] ?? 0));
      const durationMin =
        params.durationOverridesMin?.[t.id] ?? t.defaultMinutes;
      const totalDurationSec = Math.max(60, Math.round(durationMin * 60));
      const remainingSec =
        t.mode === 'countdown'
          ? Math.max(0, totalDurationSec - elapsedSec)
          : elapsedSec;
      const displaySec = t.mode === 'countdown' ? remainingSec : elapsedSec;
      const formattedTime = formatSecondsMMSS(displaySec);
      const isCompletedCountdown =
        t.mode === 'countdown' && remainingSec <= 0;
      return {
        id: t.id,
        title: t.title,
        stepIds: t.stepIds,
        mode: t.mode,
        elapsedSec,
        totalDurationSec,
        remainingSec,
        formattedTime,
        isCompletedCountdown
      };
    })
    .sort((a, b) => {
      if (a.isCompletedCountdown !== b.isCompletedCountdown) {
        return a.isCompletedCountdown ? -1 : 1;
      }
      return a.remainingSec - b.remainingSec;
    });
}

function playTimerCompletionChime() {
  try {
    if (typeof window === 'undefined') return;
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    [523.25, 659.25, 783.99].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.16);
      gain.gain.setValueAtTime(0.12, now + idx * 0.16);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.16 + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.16);
      osc.stop(now + idx * 0.16 + 0.36);
    });
  } catch {
    // Ignore audio context restrictions
  }
}

function formatSecondsMMSS(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const hrs = Math.floor(s / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;
  if (hrs > 0) {
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr || !timeStr.includes(':')) return 14 * 60 + 30;
  const [h, m] = timeStr.split(':').map(Number);
  if (isNaN(h) || isNaN(m)) return 14 * 60 + 30;
  return h * 60 + m;
}

function formatMinutesToTime(totalMins: number): string {
  const normalizedMins = ((Math.round(totalMins) % 1440) + 1440) % 1440;
  const h = Math.floor(normalizedMins / 60);
  const m = normalizedMins % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function getDynamicStepDoseSummary(stepId: number, plan: DynamicProtocolPlan): string | null {
  const { volumes: v, dosages: d, triggers: t, params: p } = plan;
  switch (stepId) {
    case 4:
      return `توده کراش کل: ${v.totalCrushedMashL}L (${v.crushedMashPerTankL}L در هر مخزن A و B؛ ${v.initialLiquidPerTankL}L فاز مایع اولیه در هر مخزن) | بریکس هدف: ${p.initialBrix}°Bx، SG₀ = ${t.initialSG.toFixed(3)}، pH هدف: ${p.targetRedPH}`;
    case 5:
      return `دوز اول سولفیت کراش (${p.crushSO2TargetMgL} mg/L): دقیقاً ${d.crushKmsPerTankG} گرم KMS در هر مخزن (${v.initialLiquidPerTankL}L مایع)`;
    case 7:
      return `خون‌گیری سانیه رُزه: مجموعاً ${v.saigneeTotalL}L شیره رُزه (${v.saigneePerTankL}L از مخزن A + ${v.saigneePerTankL}L از مخزن B)`;
    case 8:
      return `تکمیل سولفیت قرمز (تا ${p.postSaigneeRedSO2TargetMgL} mg/L): ${d.postSaigneeKmsPerTankG} گرم KMS + ۱۵ دقیقه بعد ${d.pecticEnzymeRedPerTankG} گرم آنزیم پکتولیتیک در هر مخزن (${v.redLiquidFermentPerTankL}L مایع خالص / ${v.redMashAfterSaigneePerTankL}L مش کل)`;
    case 9:
      return `شفاف‌سازی رُزه (${v.saigneeTotalL}L): ${d.pecticEnzymeRoseG} گرم آنزیم پکتیک + ۲ ساعت بعد ${d.bentoniteRoseG} گرم بنتونیت`;
    case 11:
      return `تانن‌های فاز ۱ قرمز (در ${v.redLiquidFermentPerTankL}L مایع هر مخزن): ${d.whiteTanninRedPhase1PerTankG} گرم تانن سفید + ${d.redTanninPhase1PerTankG} گرم تانن قرمز`;
    case 12:
      return `قفل pH قرمز روی ${p.targetRedPH} در ${v.redLiquidFermentPerTankL}L مایع هر مخزن (با سقف اسیدیته TA ≤ 7.2 g/L)`;
    case 13:
      return `بیدارسازی مخمر هر مخزن قرمز (${v.redLiquidFermentPerTankL}L): ${d.goFermRedPerTankG} گرم Go-Ferm + ${d.yeastRedPerTankG} گرم مخمر Lalvin RC-212`;
    case 16:
      return `تریگر پویا SNA-1 در SG = ${t.sna1.toFixed(3)}: تزریق ${d.fermaidO1RedPerTankG} گرم Fermaid O در هر مخزن قرمز (${v.redLiquidFermentPerTankL}L)`;
    case 17:
      return `تریگر پویا SNA-2 در SG = ${t.sna2.toFixed(3)} (سقف DAP: ${t.oneThirdCeiling.toFixed(3)}): تزریق ${d.fermaidK2RedPerTankG}g Fermaid K + ${d.dap2RedPerTankG}g DAP + ${d.zincRedPerTankG}g روی در هر مخزن قرمز`;
    case 18:
      return `تریگر تانن فاز ۲ در SG = ${t.phase2Tannin.toFixed(3)}: تزریق ${d.redTanninPhase2PerTankG} گرم تانن قرمز در هر مخزن (${v.redLiquidFermentPerTankL}L) + جمع‌آوری هسته‌ها`;
    case 19:
      return `تریگر نهایی SNA-3 در SG = ${t.sna3.toFixed(3)}: صرفاً ${d.fermaidO3RedPerTankG} گرم Fermaid O ۱۰۰٪ ارگانیک در هر مخزن (0g DAP / Fermaid K)`;
    case 21:
    case 22:
      return `پرسینگ در SG = ${t.pressingSG.toFixed(3)}: تفکیک ${v.freeRunPerTankL}L شراب آب‌آزاد در هر بچ (${v.freeRunTotalL}L کل) از ${v.heavyPressTotalL}L شراب پرس سنگین (${v.heavyPressPerTankL}L هر مخزن)`;
    case 25:
      return `سیفون اول دُرد سنگین (روز ۱۰): انتقال ${v.rack1PerTankL} لیتر شراب صاف هر بچ (${v.rack1TotalL}L کل) به گالن‌های لب‌به‌لب`;
    case 27:
      return `قفل بیولوژیکی روز ۱۱ (در ${v.rack1PerTankL}L هر بچ): تزریق ${d.bactilessRedPerTankG} گرم Bactiless + ${d.day11KmsPerTankG} گرم KMS در هر بچ قرمز`;
    case 28:
      return `سیفون روز ۲۱ از روی باکتیلس: ${v.rack2PerTankL} لیتر شراب زلال در هر بچ (${v.rack2TotalL}L کل)`;
    case 29:
      return `سیفون Débourbage رُزه: برداشت ${v.roseClarifiedFermentL} لیتر شیره رُزه شفاف از ${v.saigneeTotalL} لیتر اولیه`;
    case 30:
      return `تزریق ${d.whiteTanninRoseFermentG} گرم تانن سفید در ${v.roseClarifiedFermentL}L شیره رُزه + تنظیم pH روی ${p.targetRosePH}`;
    case 31:
      return `تلقیح مخمر رُزه (${v.roseClarifiedFermentL}L): ${d.yeastRoseG} گرم مخمر RC-212 + ${d.goFermRoseG} گرم Go-Ferm`;
    case 32:
      return `تغذیه ۳ پله‌ای رُزه (${v.roseClarifiedFermentL}L): SNA-1 (${t.sna1.toFixed(3)}): ${d.fermaidO1RoseG}g Fermaid O + ${d.zincRoseG}g روی | SNA-2 (${t.sna2.toFixed(3)}): ${d.fermaidK2RoseG}g Fermaid K + ${d.dap2RoseG}g DAP | SNA-3 (${t.sna3.toFixed(3)}): ${d.fermaidO3RoseG}g Fermaid O ارگانیک`;
    case 33:
      return `پایان تخمیر رُزه (${v.rosePostRackingL}L صاف): تزریق ${d.bactilessRoseG} گرم Bactiless + ${d.rosePostFermKmsG} گرم KMS`;
    case 36:
      return `تانن فینیشینگ روز ۶۰: ${d.redTanninFinishingPerTankG} گرم تانن قرمز در هر بچ (${v.finalRedPerTankL}L) و ${d.whiteTanninRoseFinishingG} گرم تانن سفید در رُزه (${v.roseFinalBottlingL}L)`;
    case 37:
      return `بذرپاشی کریستالی کرم تارتار (0.20 g/L در +1°C): ${d.khtColdStabRedPerTankG} گرم برای هر بچ قرمز (${v.finalRedPerTankL}L) و ${d.khtColdStabRoseG} گرم برای رُزه`;
    case 38:
      return `حجم خالص پس از سیفون سرد روز ۸۰: ${v.finalRedPerTankL}L در هر بچ قرمز (${v.finalRedTotalL}L کل = ${v.redBottles750ml} بطری) + ${v.roseFinalBottlingL}L رُزه (${v.roseBottles750ml} بطری) = مجموعاً ${v.totalBottles750ml} بطری ۷۵۰mL`;
    case 39:
      return `سقف گلیسیرین روز ۸۵: حداکثر تا ${d.glycerinRedMaxPerTankG} گرم در هر بچ قرمز (${v.finalRedPerTankL}L) و تا ${d.glycerinRoseMaxG} گرم در رُزه (${v.roseFinalBottlingL}L)`;
    case 41:
      return `تنظیم Free SO2 پیش از بطری: حدود ${d.preBottlingKmsPerTankG} گرم KMS در هر بچ قرمز (${v.finalRedPerTankL}L) و ${d.rosePreBottlingKmsG} گرم در رُزه (${v.roseFinalBottlingL}L)`;
    case 42:
      return `تزریق ویتامین C (ال-اسید اسکوربیک ۳۰ دقیقه قبل بطری): ${d.ascorbicRedPerTankG} گرم در هر بچ قرمز (${v.finalRedPerTankL}L) و ${d.ascorbicRoseG} گرم در رُزه (${v.roseFinalBottlingL}L)`;
    default:
      return null;
  }
}

export const ProcessRoadmapTracker: React.FC<ProcessRoadmapTrackerProps> = ({
  onNavigateToTracking,
  onNavigateToTestingGuide,
  onNavigateToLabTool
}) => {
  const {
    effectiveSingleTankId,
    setGlobalTankSelection,
    activeBatch,
    tankCount,
    roadmapHighlightStepNumber,
    clearRoadmapHighlightStep,
    notifyDataChanged,
    scalePrecision,
    equipmentProfile,
    equipmentCapabilities,
    openEquipmentModal,
    activeTankYeastStrain,
    openYeastSelectorModal
  } = useEnologyUi();
  const { params: flexParams, plan: flexPlan, isModifiedFromIdeal } = useFlexibleProtocol();
  const [showFlexibleCustomizer, setShowFlexibleCustomizer] = useState<boolean>(false);
  const [showTimerHub, setShowTimerHub] = useState<boolean>(false);
  const [isQuickLogModalOpen, setIsQuickLogModalOpen] = useState<boolean>(false);
  const [rightNowRefreshKey, setRightNowRefreshKey] = useState<number>(0);

  const batchKeySuffix =
    activeBatch?.id && activeBatch.id !== 'batch-rasha-1403'
      ? `_${activeBatch.id}`
      : '';

  // Dynamic Event-Driven Anchor Clock State (Day 0)
  const [anchorTime, setAnchorTime] = useLocalStorageState<string>(`enology_day0_anchor_time${batchKeySuffix}`, '14:30');
  const [saigneeOffsetHours, setSaigneeOffsetHours] = useLocalStorageState<number>(`enology_day0_saignee_offset_hours${batchKeySuffix}`, 3.0);
  const [enzymeOffsetHours, setEnzymeOffsetHours] = useLocalStorageState<number>(`enology_day0_enzyme_offset_hours${batchKeySuffix}`, 7.5);

  // Custom Workshop Timers State
  const [customTimers, setCustomTimers] = useLocalStorageState<WorkshopTimerConfig[]>('enology_custom_workshop_timers', []);
  const [newCustomTitle, setNewCustomTitle] = useState('');
  const [newCustomMins, setNewCustomMins] = useState(15);
  const [newCustomStepId, setNewCustomStepId] = useState(1);

  // Multi-Mode Workshop Timers Execution State (Persisted across tab switches - BUG-103)
  const [timerDurations, setTimerDurations] = useLocalStorageState<
    Record<string, number>
  >(
    'enology_timer_durations_v1',
    Object.fromEntries(
      WORKSHOP_TIMERS_CONFIG.map((t) => [t.id, t.defaultMinutes * 60])
    )
  );
  const [timerElapsed, setTimerElapsed] = useLocalStorageState<Record<string, number>>('enology_timer_elapsed_v1', {});
  const [timerRunning, setTimerRunning] = useLocalStorageState<Record<string, boolean>>('enology_timer_running_v1', {});
  const [timerChimed, setTimerChimed] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleOpenTimerHub = () => {
      setShowTimerHub(true);
    };
    window.addEventListener('enology-open-timer-hub', handleOpenTimerHub);
    return () =>
      window.removeEventListener('enology-open-timer-hub', handleOpenTimerHub);
  }, []);

  // Combine static and custom timers
  const allTimers = [...WORKSHOP_TIMERS_CONFIG, ...customTimers];

  useEffect(() => {
    const anyRunning = Object.values(timerRunning).some(Boolean);
    if (!anyRunning) return;

    const interval = setInterval(() => {
      setTimerElapsed((prevElapsed) => {
        const nextElapsed = { ...prevElapsed };
        allTimers.forEach((t) => {
          if (timerRunning[t.id]) {
            const current = nextElapsed[t.id] || 0;
            const updated = current + 1;
            nextElapsed[t.id] = updated;

            if (t.mode === 'countdown') {
              const duration = timerDurations[t.id] ?? t.defaultMinutes * 60;
              if (updated >= duration && !timerChimed[t.id]) {
                playTimerCompletionChime();
                setTimerChimed((prevChimed) => ({ ...prevChimed, [t.id]: true }));
              }
            }
          }
        });
        return nextElapsed;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerRunning, timerDurations, timerChimed, customTimers]);

  const toggleTimerRun = (timerId: string) => {
    setTimerRunning((prev) => ({ ...prev, [timerId]: !prev[timerId] }));
  };

  const resetTimer = (timerId: string) => {
    setTimerRunning((prev) => ({ ...prev, [timerId]: false }));
    setTimerElapsed((prev) => ({ ...prev, [timerId]: 0 }));
    setTimerChimed((prev) => ({ ...prev, [timerId]: false }));
  };

  const adjustTimerMinutes = (timerId: string, deltaMins: number) => {
    const defaultSecs =
      ([...WORKSHOP_TIMERS_CONFIG, ...customTimers].find((t) => t.id === timerId)
        ?.defaultMinutes ?? 15) * 60;
    setTimerDurations((prev) => {
      const currentSecs = prev[timerId] ?? defaultSecs;
      const newSecs = Math.max(60, currentSecs + deltaMins * 60);
      return { ...prev, [timerId]: newSecs };
    });
    const elapsed = timerElapsed[timerId] || 0;
    const newDur = (timerDurations[timerId] ?? defaultSecs) + deltaMins * 60;
    if (newDur > elapsed) {
      setTimerChimed((prev) => ({ ...prev, [timerId]: false }));
    }
  };

  const setTimerExactMinutes = (timerId: string, mins: number) => {
    const validMins = Math.max(1, mins);
    setTimerDurations((prev) => ({ ...prev, [timerId]: validMins * 60 }));
    const elapsed = timerElapsed[timerId] || 0;
    if (validMins * 60 > elapsed) {
      setTimerChimed((prev) => ({ ...prev, [timerId]: false }));
    }
  };

  const handleAddCustomTimer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomTitle.trim()) return;
    const id = `custom-timer-${Date.now()}`;
    const newTimer: WorkshopTimerConfig = {
      id,
      stepIds: [newCustomStepId],
      title: newCustomTitle.trim(),
      mode: 'countdown',
      defaultMinutes: Math.max(1, newCustomMins),
      flexibleWindow: `تایمر سفارشی کارگاه (${newCustomMins} دقیقه)`,
      stationNote: `ایجادشده توسط اپراتور برای گام ${newCustomStepId}`,
      isCustom: true
    };
    setCustomTimers((prev) => [...prev, newTimer]);
    setTimerDurations((prev) => ({ ...prev, [id]: newCustomMins * 60 }));
    setNewCustomTitle('');
    showToast(`تایمر سفارشی "${newTimer.title}" با موفقیت ساخته شد.`);
  };

  const handleDeleteCustomTimer = (id: string) => {
    setCustomTimers((prev) => prev.filter((t) => t.id !== id));
    resetTimer(id);
  };

  const setCurrentTimeAsAnchor = () => {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    setAnchorTime(`${h}:${m}`);
    showToast(`ساعت فعلی (${h}:${m}) به عنوان مرجع اتمام کراش و شروع زمان‌بندی روز صفر ثبت شد.`);
  };

  // Day 0 Dynamic Clock Calculations
  const produceRoseSaignee =
    equipmentCapabilities.produceRoseSaignee ?? equipmentProfile.producesRoseSaignee;
  const scalePrecisionGrams = scalePrecision;
  const [hideDisabledRoseSteps, setHideDisabledRoseSteps] = useState<boolean>(
    () => !produceRoseSaignee
  );
  useEffect(() => {
    setHideDisabledRoseSteps(!produceRoseSaignee);
  }, [produceRoseSaignee]);

  const ROSE_SPECIFIC_STEP_NUMBERS = new Set([6, 7, 10]);

  const anchorMins = parseTimeToMinutes(anchorTime);
  const saigneeMins = anchorMins + saigneeOffsetHours * 60;
  const enzymeMins = saigneeMins + 15;
  const tanninMins = enzymeMins + enzymeOffsetHours * 60;
  const acidMins = tanninMins + 90;
  const yeastMins = acidMins + 180;

  const day0Milestones = [
    {
      stepId: 5,
      title: 'پایان کراش و تزریق سولفیت اول',
      offsetLabel: 'مرجع اتمام کراش (ساعت ۰۰:۰۰)',
      clockTime: formatMinutesToTime(anchorMins),
      note: 'تزریق 6.52g KMS در ۵۰۰mL آب برای هر مخزن'
    },
    {
      stepId: 6,
      title: 'خون‌گیری سانیه رُزه',
      offsetLabel: `پایان کراش + ${saigneeOffsetHours} ساعت`,
      clockTime: formatMinutesToTime(saigneeMins),
      note: 'ماسراسیون سرد رُزه و کشیدن ۳۶L شیره در بستر یخ خشک'
    },
    {
      stepId: 8,
      title: 'تزریق سولفیت تکمیلی و آنزیم پکتیک قرمز',
      offsetLabel: 'سانیه + ۱۵ دقیقه',
      clockTime: formatMinutesToTime(enzymeMins),
      note: 'تزریق 3.43g KMS و ۱۵ دقیقه بعد 7.26g آنزیم پکتولیتیک'
    },
    {
      stepId: 10,
      title: 'تست الکل پکتین و تزریق تانن فاز ۱',
      offsetLabel: `آنزیم + ${enzymeOffsetHours} ساعت`,
      clockTime: formatMinutesToTime(tanninMins),
      note: 'استراحت آنزیم، تست الکل و تزریق تانن‌های سفید و قرمز'
    },
    {
      stepId: 12,
      title: 'تست ۳ لیوانی اسید تارتاریک (۱ ساعت تعادل)',
      offsetLabel: 'تانن + ۱.۵ ساعت',
      clockTime: formatMinutesToTime(acidMins),
      note: 'سنجش اولیه pH و ۱ ساعت تعادل اسید تارتاریک پیش از قفل pH'
    },
    {
      stepId: 13,
      title: 'بیدارسازی مخمر با Go-Ferm و هم‌دمایی ۳ مرحله‌ای',
      offsetLabel: 'اسید + ۳ ساعت',
      clockTime: formatMinutesToTime(yeastMins),
      note: '۲۰ دقیقه آب‌دهی Go-Ferm در ۴۳°C + هم‌دمایی و تلقیح نهایی'
    }
  ];

  const [currentStepId, setCurrentStepId] = useLocalStorageState<number>(`enology_active_roadmap_step${batchKeySuffix}`, 1);
  const [completedSteps, setCompletedSteps] = useLocalStorageState<number[]>(`enology_completed_roadmap_steps${batchKeySuffix}`, []);

  const activePhaseNumber = (() => {
    const firstUncompleted = ZERO_TO_HUNDRED_STEPS.find(
      (s) => !completedSteps.includes(s.id)
    );
    return firstUncompleted?.phaseId ?? 1;
  })();

  const [filterPhase, setFilterPhase] = useState<number | 'all'>(() => activePhaseNumber);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [focusedStepHaloNumber, setFocusedStepHaloNumber] = useState<
    number | null
  >(null);

  useEffect(() => {
    if (roadmapHighlightStepNumber !== null && roadmapHighlightStepNumber !== undefined) {
      const targetStep = ZERO_TO_HUNDRED_STEPS.find(
        (s) => s.id === roadmapHighlightStepNumber
      );
      if (targetStep) {
        setCurrentStepId(targetStep.id);
        setFilterPhase(targetStep.phaseId);
        setFocusedStepHaloNumber(targetStep.id);
        setTimeout(() => {
          document
            .getElementById('roadmap-step-card-' + targetStep.id)
            ?.scrollIntoView?.({ behavior: 'smooth', block: 'center' });
        }, 80);
        setTimeout(() => setFocusedStepHaloNumber(null), 2500);
      }
      clearRoadmapHighlightStep();
    }
  }, [roadmapHighlightStepNumber, setCurrentStepId, clearRoadmapHighlightStep]);

  const activeTimerCount = Object.values(timerRunning).filter(Boolean).length;

  // In-step quick logging form states synced with global tank selection (BUG-74)
  const [quickTankState, setQuickTankState] = useState<TankId>(effectiveSingleTankId);
  useEffect(() => {
    if (tankCount === 1 && effectiveSingleTankId === 'tank-b') {
      setQuickTankState('tank-a');
    } else {
      setQuickTankState(effectiveSingleTankId);
    }
  }, [effectiveSingleTankId, tankCount]);
  const quickTank = quickTankState;
  const setQuickTank = (nextTank: TankId) => {
    setQuickTankState(nextTank);
    setGlobalTankSelection(nextTank);
  };
  const [quickDay, setQuickDay] = useState<number>(1);
  const [quickSG, setQuickSG] = useState<number>(1.083);
  const [quickBrix, setQuickBrix] = useState<number>(20.0);
  const [quickTempCap, setQuickTempCap] = useState<number>(23.0);
  const [quickTempRoom, setQuickTempRoom] = useState<number>(21.0);
  const [quickPH, setQuickPH] = useState<number>(3.52);
  const [quickTA, setQuickTA] = useState<number>(6.8);
  const [quickPhTouched, setQuickPhTouched] = useState<boolean>(false);
  const [quickTaTouched, setQuickTaTouched] = useState<boolean>(false);
  const [quickNote, setQuickNote] = useState<string>('');

  // Chemical addition quick state
  const [selectedRoadmapChemPresetId, setSelectedRoadmapChemPresetId] = useState<string>('');
  const [chemName, setChemName] = useState<string>('متابی‌سولفیت پتاسیم (KMS)');
  const [chemAmount, setChemAmount] = useState<string>('6.52g');
  const [chemPurpose, setChemPurpose] = useState<string>('کنترل میکروبی و آنتی‌اکسیدانی اولیه');

  const applyRoadmapChemPreset = (presetId: string, targetTank: TankId) => {
    setSelectedRoadmapChemPresetId(presetId);
    if (!presetId) return;
    const found = getSmartAdditivePresets(flexPlan, targetTank).find((p) => p.id === presetId);
    if (found) {
      setChemName(found.compoundName);
      setChemAmount(`${found.amount}${found.unit}`);
      setChemPurpose(found.purpose);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const currentStep = ZERO_TO_HUNDRED_STEPS.find((s) => s.id === currentStepId) || ZERO_TO_HUNDRED_STEPS[0];
  const nextStep = ZERO_TO_HUNDRED_STEPS.find((s) => s.id === currentStepId + 1);
  const activeStepLabTools = getStepLabTools(currentStep.id);
  const activeStepDynamicSummary = getDynamicStepDoseSummary(currentStep.id, flexPlan);
  const activeStepTimers = allTimers.filter((t) => t.stepIds.includes(currentStep.id));

  // Sync quick form default values when active step or flexible protocol plan changes
  useEffect(() => {
    const { dosages: d, triggers: t, params: p } = flexPlan;
    if (currentStepId === 4) {
      setQuickDay(0);
      setQuickBrix(p.initialBrix);
      setQuickSG(t.initialSG);
      setQuickPH(p.targetRedPH);
    } else if (currentStepId === 5) {
      setChemName('متابی‌سولفیت پتاسیم (KMS - دوز اول کراش)');
      setChemAmount(`${d.crushKmsPerTankG}g`);
      setChemPurpose(`سولفیتاسیون اولیه ${p.crushSO2TargetMgL} mg/L در کراش`);
    } else if (currentStepId === 8) {
      setChemName('KMS پس از سانیه + آنزیم پکتولیتیک');
      setChemAmount(`${d.postSaigneeKmsPerTankG}g KMS + ${d.pecticEnzymeRedPerTankG}g آنزیم`);
      setChemPurpose('تکمیل سولفیت قرمز و شکست پکتین پوست رشه');
    } else if (currentStepId === 11) {
      setChemName('تانن فاز ۱ (سفید + قرمز)');
      setChemAmount(`${roundSum(d.whiteTanninRedPhase1PerTankG, d.redTanninPhase1PerTankG)}g`);
      setChemPurpose(`${d.whiteTanninRedPhase1PerTankG}g سفید + ${d.redTanninPhase1PerTankG}g قرمز`);
    } else if (currentStepId === 13) {
      setChemName('مخمر Lalvin RC-212 + Go-Ferm');
      setChemAmount(`${roundSum(d.yeastRedPerTankG, d.goFermRedPerTankG)}g`);
      setChemPurpose(`${d.yeastRedPerTankG}g مخمر + ${d.goFermRedPerTankG}g Go-Ferm`);
    } else if (currentStepId === 16) {
      setChemName('مکمل Fermaid O (تغذیه SNA-1)');
      setChemAmount(`${d.fermaidO1RedPerTankG}g`);
      setChemPurpose(`تغذیه نیتروژن آلی مرحله اول در SG = ${t.sna1.toFixed(3)}`);
    } else if (currentStepId === 17) {
      setChemName('تغذیه SNA-2 (Fermaid K + DAP + روی)');
      setChemAmount(`${roundSum(d.fermaidK2RedPerTankG, d.dap2RedPerTankG + d.zincRedPerTankG)}g`);
      setChemPurpose(`${d.fermaidK2RedPerTankG}g Fermaid K + ${d.dap2RedPerTankG}g DAP + ${d.zincRedPerTankG}g روی در SG = ${t.sna2.toFixed(3)}`);
    } else if (currentStepId === 18) {
      setChemName('تانن فاز ۲ قرمز (تثبیت رنگ)');
      setChemAmount(`${d.redTanninPhase2PerTankG}g`);
      setChemPurpose(`تثبیت کووالانسی رنگ در SG = ${t.phase2Tannin.toFixed(3)}`);
    } else if (currentStepId === 19) {
      setChemName('تغذیه نهایی SNA-3 (صرفاً Fermaid O ۱۰۰٪ ارگانیک)');
      setChemAmount(`${d.fermaidO3RedPerTankG}g`);
      setChemPurpose(`سقف نهایی نیتروژن ۱۰۰٪ ارگانیک در SG = ${t.sna3.toFixed(3)} (0g DAP)`);
    } else if (currentStepId === 27) {
      setChemName('مکمل Bactiless + KMS (قفل بیولوژیکی روز ۱۱)');
      setChemAmount(`${roundSum(d.bactilessRedPerTankG, d.day11KmsPerTankG)}g`);
      setChemPurpose(`${d.bactilessRedPerTankG}g Bactiless + ${d.day11KmsPerTankG}g KMS`);
    } else if (currentStepId === 30) {
      setQuickTank('tank-rose');
      setChemName('تانن سفید شراب رُزه');
      setChemAmount(`${d.whiteTanninRoseFermentG}g`);
      setChemPurpose('حفاظت آنتی‌اکسیدانی و تثبیت رنگ رُزه');
    } else if (currentStepId === 36) {
      setChemName('تانن فینیشینگ (پیش از سرمازدایی)');
      setChemAmount(`${d.redTanninFinishingPerTankG}g`);
      setChemPurpose('تثبیت ساختار و رسوب کلوئیدهای ناپایدار روز ۶۰');
    } else if (currentStepId === 37) {
      setChemName('کریستال بذرپاشی کرم تارتار (Contact Seeding)');
      setChemAmount(`${d.khtColdStabRedPerTankG}g`);
      setChemPurpose('بذرپاشی کریستالی 0.20 g/L در +1°C');
    } else if (currentStepId === 41) {
      setChemName('KMS تنظیم Free SO2 قبل از بطری');
      setChemAmount(`${d.preBottlingKmsPerTankG}g`);
      setChemPurpose('قفل Free SO2 روی 35 mg/L پیش از بطری‌گذاری');
    } else if (currentStepId === 42) {
      setChemName('ال-اسید اسکوربیک (ویتامین C اکسیژن‌خوار)');
      setChemAmount(`${d.ascorbicRedPerTankG}g`);
      setChemPurpose('حذف اکسیژن محلول ۳۰ دقیقه پیش از بطری‌گذاری');
    } else if (currentStep.defaultChemicalName) {
      setChemName(currentStep.defaultChemicalName);
    }
    setSelectedRoadmapChemPresetId('');
  }, [currentStepId, flexPlan, currentStep.defaultChemicalName]);

  const totalStepsCount = ZERO_TO_HUNDRED_STEPS.length;
  const completedCount = completedSteps.length;
  const progressPercent = Math.round((completedCount / totalStepsCount) * 100);

  const toggleStepCompleted = (id: number) => {
    if (completedSteps.includes(id)) {
      setCompletedSteps(completedSteps.filter((s) => s !== id));
    } else {
      setCompletedSteps([...completedSteps, id]);
      if (id === currentStepId && id < totalStepsCount) {
        setCurrentStepId(id + 1);
      }
    }
  };

  const handleSelectStep = (id: number) => {
    setCurrentStepId(id);
  };

  const handleOpenLabTool = (testId: string, subTab: 'calculators-sops' | 'troubleshooting-crises' = 'calculators-sops') => {
    if (onNavigateToLabTool) {
      onNavigateToLabTool(testId, subTab);
    } else if (onNavigateToTestingGuide) {
      onNavigateToTestingGuide();
    }
  };

  // Submit Daily Log entry directly from Roadmap
  const handleSaveStepDailyLog = (e: React.FormEvent) => {
    e.preventDefault();
    const nowMs = Date.now();
    const resolvedBatchId =
      activeBatch?.id ?? (quickTank === 'tank-rose' ? 'batch-rose-1403' : 'batch-rasha-1403');
    const newEntry: FermentationLogEntry = {
      id: `log-roadmap-${nowMs}`,
      batchId: resolvedBatchId,
      tankId: quickTank,
      dateTime: getCurrentPersianDateTimeStr(nowMs),
      timestampMs: nowMs,
      dayNumber: quickDay,
      stageTitle: `گام ${currentStep.id}: ${currentStep.title}`,
      sg: Number(quickSG),
      brix: Number(quickBrix),
      tempCap: Number(quickTempCap),
      tempRoom: Number(quickTempRoom),
      ph: Number(quickPH),
      phMeasured: quickPhTouched,
      ta: Number(quickTA),
      taMeasured: quickTaTouched,
      pigeageDone: true,
      pigeageCount: 3,
      operationNote: quickNote || `ثبت مستقیم از گام ${currentStep.id}: ${currentStep.title}`,
      isTriggerPoint: true,
      isBenchmark: false
    };

    enologyDb.addLog(newEntry);
    notifyDataChanged();
    if (!completedSteps.includes(currentStep.id)) {
      setCompletedSteps([...completedSteps, currentStep.id]);
    }
    showToast(`اطلاعات روزانه با موفقیت در لاگ‌شیت و دیتابیس ثبت شد. گام ${currentStep.id} تیک خورد.`);
    if (nextStep) setCurrentStepId(nextStep.id);
  };

  // Submit Chemical Addition directly from Roadmap
  const handleSaveStepChemical = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount =
      normalizeEnologyNumericInput(chemAmount, 'general') ??
      normalizeEnologyNumericInput(
        chemAmount.replace(/[^\d۰-۹٠-٩.,٫،/-]+.*$/, '').trim(),
        'general'
      );
    if (parsedAmount === null || parsedAmount <= 0) {
      showToast('مقدار افزودنی نامعتبر است؛ لطفاً عدد صحیح را وارد کنید.');
      return;
    }
    const resolvedBatchId =
      activeBatch?.id ?? (quickTank === 'tank-rose' ? 'batch-rose-1403' : 'batch-rasha-1403');
    const referenceVolumeL =
      quickTank === 'tank-rose'
        ? flexPlan.volumes.roseClarifiedFermentL
        : currentStep.id >= 25
        ? flexPlan.volumes.rack1PerTankL
        : flexPlan.volumes.redLiquidFermentPerTankL;
    const rawName = chemName || currentStep.defaultChemicalName || 'افزودنی انولوژی';
    const isCombinedBactilessKms =
      /bactiless|بکتی‌لس|بکتیلس|باکتیلس/i.test(rawName) &&
      /kms|k2s2o5|سولفیت/i.test(rawName);

    if (isCombinedBactilessKms) {
      const bactilessAmt = flexPlan.dosages.bactilessRedPerTankG;
      const kmsAmt = flexPlan.dosages.day11KmsPerTankG;
      enologyDb.addAddition({
        batchId: resolvedBatchId,
        tankId: quickTank,
        timestamp: getCurrentPersianDateTimeStr(),
        stageTitle: `گام ${currentStep.id}: ${currentStep.title}`,
        compoundName: 'Bactiless (کیتوزان قفل بیولوژیکی روز ۱۱)',
        compoundType: 'bactiless',
        referenceVolumeL,
        amount: bactilessAmt,
        unit: 'g',
        purpose: chemPurpose || currentStep.keyAction,
        operatorNote: `ثبت زنده از نقشه راه - گام ${currentStep.id} (بخش ۱: باکتی‌لس)`
      });
      enologyDb.addAddition({
        batchId: resolvedBatchId,
        tankId: quickTank,
        timestamp: getCurrentPersianDateTimeStr(),
        stageTitle: `گام ${currentStep.id}: ${currentStep.title}`,
        compoundName: 'متابی‌سولفیت پتاسیم (KMS قفل روز ۱۱)',
        compoundType: 'kms',
        pubchemCid: 24446,
        referenceVolumeL,
        amount: kmsAmt,
        unit: 'g',
        purpose: chemPurpose || currentStep.keyAction,
        operatorNote: `ثبت زنده از نقشه راه - گام ${currentStep.id} (بخش ۲: KMS)`
      });
    } else {
      const lower = rawName.toLowerCase();
      const inferredType =
        lower.includes('kms') || lower.includes('متابی') || lower.includes('سولفیت')
          ? 'kms'
          : lower.includes('bactiless') || lower.includes('بکتی') || lower.includes('باکتی')
          ? 'bactiless'
          : lower.includes('fermaid o')
          ? 'fermaid_o'
          : lower.includes('fermaid k')
          ? 'fermaid_k'
          : lower.includes('dap')
          ? 'dap'
          : lower.includes('تانن سفید')
          ? 'tannin_white'
          : lower.includes('تانن')
          ? 'tannin_red'
          : lower.includes('کرم تارتار') || lower.includes('kht')
          ? 'kht'
          : lower.includes('اسکوربیک')
          ? 'ascorbic'
          : lower.includes('آنزیم') || lower.includes('پکتین')
          ? 'enzyme'
          : lower.includes('بنتونیت')
          ? 'bentonite'
          : lower.includes('مخمر') || lower.includes('rc-212')
          ? 'yeast'
          : lower.includes('go-ferm')
          ? 'go_ferm'
          : 'other';

      enologyDb.addAddition({
        batchId: resolvedBatchId,
        tankId: quickTank,
        timestamp: getCurrentPersianDateTimeStr(),
        stageTitle: `گام ${currentStep.id}: ${currentStep.title}`,
        compoundName: rawName,
        compoundType: inferredType,
        pubchemCid: inferredType === 'kms' ? 24446 : undefined,
        referenceVolumeL,
        amount: parsedAmount,
        unit: 'g',
        purpose: chemPurpose || currentStep.keyAction,
        operatorNote: `ثبت زنده از نقشه راه - گام ${currentStep.id}`
      });
    }
    notifyDataChanged();

    if (!completedSteps.includes(currentStep.id)) {
      setCompletedSteps([...completedSteps, currentStep.id]);
    }
    showToast(`افزودنی (${chemName}) با موفقیت در لاگ‌شیت ۳ ثبت شد و گام ${currentStep.id} انجام شد.`);
    if (nextStep) setCurrentStepId(nextStep.id);
  };

  const filteredSteps = ZERO_TO_HUNDRED_STEPS.filter((step) => {
    const stepNum = (step as { stepNumber?: number }).stepNumber ?? step.id;
    if (
      !produceRoseSaignee &&
      hideDisabledRoseSteps &&
      ROSE_SPECIFIC_STEP_NUMBERS.has(stepNum)
    ) {
      return false;
    }
    const matchesPhase = filterPhase === 'all' || step.phaseId === filterPhase;
    const query = searchQuery.trim().toLowerCase();
    const matchesQuery =
      !query ||
      step.title.toLowerCase().includes(query) ||
      step.keyAction.toLowerCase().includes(query) ||
      step.timeOrTrigger.toLowerCase().includes(query);
    return matchesPhase && matchesQuery;
  });

  return (
    <div className="space-y-6 font-['Vazirmatn',sans-serif]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 left-5 z-50 bg-surface text-ink border border-line border-r-4 border-r-emerald-600 px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Roadmap Equipment Summary Bar */}
      <div
        data-testid="roadmap-equipment-summary-bar"
        className="rounded-2xl border border-line bg-surface p-3 mb-3 flex flex-wrap items-center justify-between gap-2 text-xs"
      >
        <div className="flex flex-wrap items-center gap-2 text-ink">
          <span className="font-bold">
            نقشه راه منطبق با تجهیزات شما: {equipmentCapabilities.presetTitleFa}
          </span>
          <span className="px-2 py-0.5 rounded-lg bg-paper border border-line font-mono text-ink-soft ltr-metric">
            ظروف سیفون: {equipmentCapabilities.totalRedCarboysCount} ×{' '}
            {equipmentCapabilities.agingCarboyUnitL}L
          </span>
          <span className="px-2 py-0.5 rounded-lg bg-paper border border-line font-mono text-ink-soft ltr-metric">
            ترازو: {scalePrecisionGrams}g
          </span>
          <span className="px-2 py-0.5 rounded-lg bg-paper border border-line font-mono text-wine font-bold ltr-metric">
            {`مخمر فعال: ${activeTankYeastStrain.code} (YAN ×${activeTankYeastStrain.yanMultiplier})`}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {!produceRoseSaignee && (
            <button
              type="button"
              data-testid="toggle-hide-rose-steps"
              onClick={() => setHideDisabledRoseSteps((v) => !v)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-colors cursor-pointer ${
                hideDisabledRoseSteps
                  ? 'bg-wine text-white border-wine'
                  : 'bg-paper hover:bg-stone-200/60 text-ink border-line'
              }`}
            >
              {hideDisabledRoseSteps
                ? 'نمایش گامهای غیرفعال رُزه'
                : 'مخفی کردن گامهای رُزه سانیه'}
            </button>
          )}
          <button
            type="button"
            onClick={openYeastSelectorModal}
            className="px-3 py-1.5 rounded-lg bg-wine text-white text-xs font-bold transition-colors cursor-pointer"
          >
            انتخاب مخمر
          </button>
          <button
            type="button"
            onClick={openEquipmentModal}
            className="px-3 py-1.5 rounded-lg bg-paper hover:bg-stone-200/60 text-ink border border-line text-xs font-bold transition-colors cursor-pointer"
          >
            ویرایش تجهیزات
          </button>
        </div>
      </div>

      {/* 5-Stage Connected Phase Stepper Bar at Top (کراش ← تخمیر ← پرس ← پس از تخمیر ← بطری‌گذاری) */}
      <div className="bg-surface border border-line rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            <Layers className="w-4 h-4 text-wine shrink-0" />
            <h2 className="text-sm sm:text-base font-bold text-ink">
              نوار پیشرفت ۵ مرحله‌ای نقشه راه (کراش ← تخمیر ← پرس ← پس از تخمیر ← بطری‌گذاری)
            </h2>
            <span className="text-xs font-mono tabular-nums bg-emerald-50 text-emerald-900 border border-emerald-300 px-2.5 py-0.5 rounded-full font-bold">
              پیشرفت کل: {progressPercent}٪ ({completedCount} از {totalStepsCount} گام)
            </span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => setFilterPhase(activePhaseNumber)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                filterPhase === activePhaseNumber
                  ? 'bg-wine text-white shadow-xs'
                  : 'bg-paper text-ink border border-line hover:bg-surface'
              }`}
            >
              فاز فعال فعلی (فاز {activePhaseNumber})
            </button>
            <button
              type="button"
              onClick={() => setFilterPhase('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                filterPhase === 'all'
                  ? 'bg-wine text-white shadow-xs'
                  : 'bg-paper text-ink border border-line hover:bg-surface'
              }`}
            >
              نمایش همه فازها (All)
            </button>
            <button
              type="button"
              onClick={() => setShowTimerHub((prev) => !prev)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                showTimerHub || Object.values(timerRunning).some(Boolean)
                  ? 'bg-wine text-white border-wine'
                  : 'bg-paper hover:bg-surface border-line text-ink'
              }`}
            >
              <Timer className="w-3.5 h-3.5" />
              <span>تایمرهای کارگاه ({allTimers.length})</span>
              {showTimerHub ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            {onNavigateToTracking && (
              <button
                type="button"
                onClick={onNavigateToTracking}
                className="px-3 py-1.5 rounded-lg bg-paper hover:bg-surface border border-line text-ink text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>مشاهده دفتر ثبت و نمودارهای مخازن</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
          {[
            {
              stageIndex: 1,
              phaseIds: [1],
              primaryPhaseId: 1,
              titleFa: '۱. کراش',
              subtitleFa: 'پذیرش، سانیه و آنزیم (روز ۰)'
            },
            {
              stageIndex: 2,
              phaseIds: [2],
              primaryPhaseId: 2,
              titleFa: '۲. تخمیر',
              subtitleFa: 'تلقیح، کلاهک و تغذیه SNA'
            },
            {
              stageIndex: 3,
              phaseIds: [3],
              primaryPhaseId: 3,
              titleFa: '۳. پرس',
              subtitleFa: 'پرسینگ و قفل بیولوژیکی'
            },
            {
              stageIndex: 4,
              phaseIds: [4, 5],
              primaryPhaseId: 5,
              titleFa: '۴. پس از تخمیر',
              subtitleFa: 'رُزه، بلوغ و سرمازدایی'
            },
            {
              stageIndex: 5,
              phaseIds: [6],
              primaryPhaseId: 6,
              titleFa: '۵. بطری‌گذاری',
              subtitleFa: 'فیلتراسیون، چوب‌پنبه و موم'
            }
          ].map((stage, idx, arr) => {
            const stageSteps = ZERO_TO_HUNDRED_STEPS.filter((s) =>
              stage.phaseIds.includes(s.phaseId)
            );
            const stageDoneCount = stageSteps.filter((s) =>
              completedSteps.includes(s.id)
            ).length;
            const stageTotal = stageSteps.length || 1;
            const stagePct = Math.round((stageDoneCount / stageTotal) * 100);
            const isStageCompleted = stageDoneCount === stageTotal;
            const isStageActive =
              stage.phaseIds.includes(activePhaseNumber) ||
              (typeof filterPhase === 'number' &&
                stage.phaseIds.includes(filterPhase));

            return (
              <button
                key={stage.stageIndex}
                type="button"
                onClick={() => setFilterPhase(stage.primaryPhaseId)}
                className={`p-3 rounded-xl border text-right transition-all cursor-pointer flex flex-col justify-between gap-2 relative ${
                  isStageActive
                    ? 'bg-paper border-wine ring-1 ring-wine/30 shadow-xs'
                    : isStageCompleted
                    ? 'bg-emerald-50/70 border-emerald-300'
                    : 'bg-paper border-line hover:bg-surface'
                }`}
              >
                <div className="flex items-center justify-between gap-1.5">
                  <span className="text-xs font-bold text-ink flex items-center gap-1">
                    {isStageCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    ) : isStageActive ? (
                      <PlayCircle className="w-4 h-4 text-wine shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-ink-soft shrink-0" />
                    )}
                    <span>{stage.titleFa}</span>
                  </span>
                  <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-surface border border-line text-ink">
                    {stageDoneCount}/{stageTotal} ({stagePct}٪)
                  </span>
                </div>
                <p className="text-xs text-ink-soft truncate">
                  {stage.subtitleFa}
                </p>
                <div className="w-full h-1.5 bg-line rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      isStageCompleted
                        ? 'bg-emerald-700'
                        : isStageActive
                        ? 'bg-wine'
                        : 'bg-amber-600'
                    }`}
                    style={{ width: `${stagePct}%` }}
                  />
                </div>
                {idx < arr.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="hidden sm:inline-block absolute -left-2.5 top-1/2 -translate-y-1/2 text-ink-soft text-xs font-bold z-10"
                  >
                    ←
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 10-Second Wet-Hands Daily Logger Modal */}
      <QuickTenSecondLogModal
        isOpen={isQuickLogModalOpen}
        initialTankId={quickTank}
        onClose={() => setIsQuickLogModalOpen(false)}
        onLogSaved={() => {
          setRightNowRefreshKey((k) => k + 1);
          showToast('ثبت ۱۰ ثانیه‌ای روزانه با موفقیت در دفتر مخزن ذخیره شد.');
        }}
      />

      {/* Interactive Day-0 Event Anchor & Cellar Multi-Mode Timer System */}
      {showTimerHub && (
        <div className="bg-surface text-ink rounded-2xl border border-line shadow-sm p-4 sm:p-5 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-wine/10 border border-wine/30 text-wine flex items-center justify-center shrink-0">
                <Timer className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-ink">
                  سیستم زمان‌بندی شناور و تایمرهای منعطف کارگاهی
                </h3>
                <p className="text-xs text-ink-soft">
                  تنظیم زمان‌بندی شناور روز صفر بر اساس لحظه واقعی پایان کراش + تایمرهای هوشمند چندحالته با قابلیت تغییر زمان، تایمر سفارشی و حالت اضافه زمان (Overtime)
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowTimerHub(false)}
              className="text-xs text-ink-soft hover:text-ink self-end sm:self-center cursor-pointer px-2.5 py-1 rounded-lg bg-paper border border-line"
            >
              بستن پنل زمان‌بندی
            </button>
          </div>

          {/* 1. DYNAMIC EVENT-DRIVEN ANCHOR TIME & SHIFTED CLOCK SCHEDULE */}
          <div className="bg-paper rounded-xl border border-line p-4 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-line pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-wine shrink-0" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-ink">
                    ثبت لحظه واقعی پایان کراش / شروع مرجع زمان‌بندی روز صفر
                  </h4>
                  <p className="text-xs text-ink-soft">
                    محاسبه خودکار و پویای زمان‌بندی مایلستون‌های روز صفر بر اساس ساعت واقعی پایان کراش کارگاه شما
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap shrink-0">
                <button
                  type="button"
                  onClick={setCurrentTimeAsAnchor}
                  className="px-3 py-1.5 rounded-lg bg-wine hover:opacity-95 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>ثبت ساعت فعلی به عنوان لحظه واقعی اتمام کراش / شروع زمانبندی روز صفر</span>
                </button>

                <div className="flex items-center gap-1.5 bg-surface border border-line px-2.5 py-1 rounded-lg">
                  <span className="text-xs text-ink font-bold">ساعت مرجع دستی:</span>
                  <input
                    type="time"
                    value={anchorTime}
                    onChange={(e) => setAnchorTime(e.target.value)}
                    className="bg-paper border border-line text-ink font-mono text-xs font-bold rounded px-2 py-0.5 focus:outline-none focus:border-wine"
                  />
                </div>
              </div>
            </div>

            {/* Adjustable Offsets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-surface p-3 rounded-lg border border-line text-xs">
              <div className="flex items-center justify-between gap-2">
                <label className="text-ink font-bold flex items-center gap-1">
                  <span>ماسراسیون سرد رُزه تا سانیه:</span>
                  <span className="text-wine font-mono">({saigneeOffsetHours} ساعت)</span>
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="range"
                    min="2.0"
                    max="3.5"
                    step="0.25"
                    value={saigneeOffsetHours}
                    onChange={(e) => setSaigneeOffsetHours(Number(e.target.value))}
                    className="w-24 accent-wine cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-2">
                <label className="text-ink font-bold flex items-center gap-1">
                  <span>استراحت آنزیم تا تست الکل و تانن:</span>
                  <span className="text-wine font-mono">({enzymeOffsetHours} ساعت)</span>
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="range"
                    min="6.0"
                    max="9.0"
                    step="0.5"
                    value={enzymeOffsetHours}
                    onChange={(e) => setEnzymeOffsetHours(Number(e.target.value))}
                    className="w-24 accent-wine cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Shifted Real-World Clock Schedule Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {day0Milestones.map((ms) => (
                <div
                  key={ms.stepId}
                  onClick={() => setCurrentStepId(ms.stepId)}
                  className={`p-2.5 rounded-lg border text-right transition-all cursor-pointer ${
                    currentStepId === ms.stepId
                      ? 'bg-surface border-wine ring-1 ring-wine/30'
                      : 'bg-surface border-line hover:bg-paper'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-ink-soft">گام {ms.stepId}</span>
                    <span className="text-xs font-mono font-bold text-wine bg-paper px-2 py-0.5 rounded border border-line">
                      {ms.clockTime}
                    </span>
                  </div>
                  <h5 className="text-xs font-bold text-ink truncate">{ms.title}</h5>
                  <p className="text-xs text-ink-soft mt-0.5 font-mono">{ms.offsetLabel}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 2. MULTI-MODE WORKSHOP TIMERS LIST */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-wine" />
                <h4 className="text-xs sm:text-sm font-bold text-ink">
                  تایمرهای هوشمند چندحالته ایستگاه‌ها (دارای کنترل زنده و زمان اضافه Overtime)
                </h4>
              </div>

              {/* Custom Timer Input Form */}
              <form onSubmit={handleAddCustomTimer} className="flex items-center gap-1.5 flex-wrap">
                <input
                  type="text"
                  value={newCustomTitle}
                  onChange={(e) => setNewCustomTitle(e.target.value)}
                  placeholder="عنوان تایمر سفارشی..."
                  className="bg-paper border border-line text-xs text-ink rounded-lg px-2.5 py-1 focus:outline-none focus:border-wine w-36"
                />
                <input
                  type="number"
                  min="1"
                  max="1440"
                  value={newCustomMins}
                  onChange={(e) => setNewCustomMins(Number(e.target.value))}
                  placeholder="دقیقه"
                  className="bg-paper border border-line text-xs text-ink font-mono font-bold rounded-lg px-2 py-1 focus:outline-none focus:border-wine w-16 text-center"
                />
                <button
                  type="submit"
                  className="px-3 py-1 rounded-lg bg-wine hover:opacity-95 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>ساخت تایمر/کرنومتر سفارشی کارگاه</span>
                </button>
              </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {allTimers.map((t) => {
                const isRunning = Boolean(timerRunning[t.id]);
                const elapsed = timerElapsed[t.id] || 0;
                const duration = timerDurations[t.id] ?? t.defaultMinutes * 60;
                const isStopwatch = t.mode === 'stopwatch';

                const remaining = duration - elapsed;
                const isOvertime = !isStopwatch && remaining < 0;
                const isJustFinished = !isStopwatch && remaining === 0 && elapsed > 0;
                const overtimeSecs = Math.abs(remaining);

                const currentDurationMins = Math.round(duration / 60);
                const isLinkedToCurrent = t.stepIds.includes(currentStep.id);

                return (
                  <div
                    key={t.id}
                    className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
                      isOvertime
                        ? 'bg-red-50 border-danger ring-1 ring-danger/30'
                        : isJustFinished
                        ? 'bg-emerald-50 border-emerald-400'
                        : isRunning
                        ? 'bg-amber-50 border-amber-300'
                        : isLinkedToCurrent
                        ? 'bg-paper border-wine'
                        : 'bg-paper border-line'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-1.5">
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-surface text-ink border border-line">
                          گام {t.stepIds.join(' و ')} • {isStopwatch ? 'کرنومتر باز' : `${currentDurationMins} دقیقه`}
                        </span>
                        {t.isCustom ? (
                          <button
                            type="button"
                            onClick={() => handleDeleteCustomTimer(t.id)}
                            className="text-ink-soft hover:text-danger text-xs p-0.5 cursor-pointer"
                            title="حذف تایمر سفارشی"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <span className="text-xs text-ink-soft bg-surface px-1.5 py-0.5 rounded border border-line">
                            {t.flexibleWindow}
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-ink leading-snug pt-0.5">{t.title}</h4>
                      <p className="text-xs text-ink-soft leading-relaxed">{t.stationNote}</p>
                    </div>

                    <div className="space-y-2 pt-1">
                      {/* Timer Display */}
                      <div className="flex items-baseline justify-between bg-surface p-2 rounded-lg border border-line">
                        {isStopwatch ? (
                          <div className="flex items-center justify-between w-full">
                            <span className="text-xs text-ink-soft">زمان صرف‌شده (کرنومتر):</span>
                            <span className="font-mono tabular-nums text-lg font-bold text-ink">
                              {formatSecondsMMSS(elapsed)}
                            </span>
                          </div>
                        ) : isOvertime ? (
                          <div className="flex items-center justify-between w-full">
                            <span className="text-xs font-bold text-danger">
                              موعد پیشنهادی فرا رسید!
                            </span>
                            <span className="font-mono tabular-nums text-base font-bold text-danger">
                              +{formatSecondsMMSS(overtimeSecs)} گذشته
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between w-full">
                            <span className="text-xs text-ink-soft">زمان باقی‌مانده:</span>
                            <span className="font-mono tabular-nums text-lg font-bold text-ink">
                              {formatSecondsMMSS(remaining)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Quick duration adjustments */}
                      {!isStopwatch && (
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1 justify-between text-xs">
                            <span className="text-ink-soft">تغییر زمان:</span>
                            <div className="flex items-center gap-1">
                              {[-15, -5, 5, 15, 30].map((delta) => (
                                <button
                                  key={delta}
                                  type="button"
                                  onClick={() => adjustTimerMinutes(t.id, delta)}
                                  className="px-1.5 py-0.5 rounded bg-surface hover:bg-paper text-ink text-xs font-mono cursor-pointer border border-line"
                                >
                                  {delta > 0 ? `+${delta}m` : `${delta}m`}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs text-ink-soft">تنظیم دقیق دقیقه:</span>
                            <input
                              type="number"
                              min="1"
                              max="1440"
                              value={currentDurationMins}
                              onChange={(e) => setTimerExactMinutes(t.id, Number(e.target.value))}
                              className="w-16 bg-surface border border-line rounded px-1.5 py-0.5 text-xs font-mono text-ink font-bold text-center focus:outline-none focus:border-wine"
                            />
                          </div>
                        </div>
                      )}

                      {/* Quick preset switch for Timer 6 (Go-Ferm yeast) */}
                      {t.id === 'timer-yeast-goferm' && (
                        <div className="flex items-center gap-1 pt-0.5">
                          <button
                            type="button"
                            onClick={() => setTimerExactMinutes(t.id, 20)}
                            className={`flex-1 py-1 rounded text-xs font-bold cursor-pointer border ${
                              currentDurationMins === 20 ? 'bg-wine text-white border-wine' : 'bg-surface text-ink-soft border-line'
                            }`}
                          >
                            آب‌دهی (۲۰m)
                          </button>
                          <button
                            type="button"
                            onClick={() => setTimerExactMinutes(t.id, 8)}
                            className={`flex-1 py-1 rounded text-xs font-bold cursor-pointer border ${
                              currentDurationMins === 8 ? 'bg-wine text-white border-wine' : 'bg-surface text-ink-soft border-line'
                            }`}
                          >
                            هم‌دمایی (۸m)
                          </button>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex items-center gap-1.5 pt-1">
                        <button
                          type="button"
                          onClick={() => toggleTimerRun(t.id)}
                          className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold cursor-pointer flex items-center justify-center gap-1 transition-all ${
                            isRunning
                              ? 'bg-amber-600 hover:bg-amber-700 text-white'
                              : 'bg-wine hover:opacity-95 text-white'
                          }`}
                        >
                          {isRunning ? (
                            <>
                              <PauseCircle className="w-3.5 h-3.5" />
                              <span>توقف</span>
                            </>
                          ) : (
                            <>
                              <PlayCircle className="w-3.5 h-3.5" />
                              <span>شروع تایمر</span>
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => resetTimer(t.id)}
                          className="py-1.5 px-2.5 rounded-lg bg-surface hover:bg-paper border border-line text-ink text-xs font-bold cursor-pointer flex items-center gap-1"
                          title="ریست تایمر"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>ریست</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Active Step Status Dashboard */}
      <div className="bg-surface text-ink rounded-2xl border border-line shadow-sm p-5 sm:p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-wine text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                ایستگاه فعال کارگاه
              </span>
              <span className="bg-paper text-ink border border-line text-xs font-bold px-2.5 py-0.5 rounded-full">
                {currentStep.phaseName}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-ink flex items-center gap-2 pt-1 flex-wrap">
              <span>گام جاری شما:</span>
              <span className="text-wine font-mono">گام شماره {currentStep.id}</span>
              <span className="text-ink-soft font-bold text-base sm:text-lg">({currentStep.title})</span>
            </h3>
            <p className="text-xs text-ink-soft">
              موقعیت زمانی / تریگر هیدرومتر: <strong className="text-ink">{currentStep.timeOrTrigger}</strong>
            </p>
          </div>

          {/* Quick Prev / Complete / Next / Log in this step */}
          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <button
              type="button"
              onClick={() => setIsQuickLogModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-paper hover:bg-surface border border-line text-ink text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 text-wine" />
              <span>ثبت در این مرحله</span>
            </button>

            <button
              type="button"
              disabled={currentStepId <= 1}
              onClick={() => setCurrentStepId(currentStepId - 1)}
              className="px-3 py-2 rounded-xl bg-paper hover:bg-surface disabled:opacity-30 text-ink text-xs font-bold transition-all cursor-pointer flex items-center gap-1 border border-line"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>گام قبلی</span>
            </button>

            <button
              type="button"
              onClick={() => toggleStepCompleted(currentStep.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-xs ${
                completedSteps.includes(currentStep.id)
                  ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                  : 'bg-wine hover:opacity-95 text-white'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{completedSteps.includes(currentStep.id) ? 'تکمیل شد (تیک خورده)' : 'علامت‌گذاری به عنوان انجام شد'}</span>
            </button>

            <button
              type="button"
              disabled={currentStepId >= totalStepsCount}
              onClick={() => setCurrentStepId(currentStepId + 1)}
              className="px-3 py-2 rounded-xl bg-paper hover:bg-surface disabled:opacity-30 text-ink text-xs font-bold transition-all cursor-pointer flex items-center gap-1 border border-line"
            >
              <span>گام بعدی</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="w-full bg-paper h-2.5 rounded-full overflow-hidden border border-line">
          <div
            className="bg-wine h-full transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* CURRENT ACTIVE STEP INSTRUCTION, CONTEXTUAL CALCULATOR DEEP-LINKS & QUICK LOGGING CARD */}
      <div className="bg-surface rounded-2xl border border-line p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-3">
          <div className="flex items-center gap-2">
            <PlayCircle className="w-5 h-5 text-wine shrink-0" />
            <h3 className="text-base font-bold text-ink">
              دستورالعمل اجرایی کامل گام فعلی شما (گام {currentStep.id}): {currentStep.title}
            </h3>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-paper text-ink border border-line shrink-0">
            دمای مجاز: {currentStep.targetTemp}
          </span>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-ink leading-relaxed">
          <div className="bg-paper p-4 rounded-xl border border-line">
            <strong className="text-ink block font-bold mb-1.5 flex items-center gap-1.5">
              <CheckSquare className="w-4 h-4 text-emerald-700" />
              <span>اقدام عملیاتی دقیق این مرحله:</span>
            </strong>
            <p className="text-ink font-medium leading-relaxed">
              {currentStep.keyAction}
            </p>
          </div>

          {activeStepDynamicSummary && (
            <div className="bg-emerald-50/90 border border-emerald-300 p-3.5 rounded-xl text-xs text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold block text-emerald-950 mb-0.5">
                    مقادیر محاسبه‌شده پویا بر اساس تنظیمات فعلی کارگاه شما ({flexParams.grapeWeightKg} کیلوگرم انگور — پروفایل {flexParams.presetId === 'conservative_ideal' ? 'توصیه بهینه' : flexParams.presetId === 'classic_v32' ? 'سند کلاسیک v3.2' : 'سفارشی'}):
                  </strong>
                  <span className="font-bold text-emerald-900 leading-relaxed">{activeStepDynamicSummary}</span>
                </div>
              </div>
            </div>
          )}

          {activeStepTimers.length > 0 && (
            <div className="bg-paper text-ink p-3.5 rounded-xl border border-line space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-ink flex items-center gap-1.5">
                  <Timer className="w-4 h-4 text-wine" />
                  <span>تایمر عملیاتی ویژه گام {currentStep.id}:</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowTimerHub(true)}
                  className="text-xs text-wine hover:underline font-bold cursor-pointer"
                >
                  مشاهده تمام تایمرهای کارگاه
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {activeStepTimers.map((t) => {
                  const elapsed = timerElapsed[t.id] || 0;
                  const duration = timerDurations[t.id] ?? t.defaultMinutes * 60;
                  const isRunning = Boolean(timerRunning[t.id]);
                  const remaining = duration - elapsed;
                  const isOvertime = t.mode === 'countdown' && remaining < 0;

                  return (
                    <div
                      key={t.id}
                      className="bg-surface p-3 rounded-lg border border-line flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="text-xs font-bold text-ink">{t.title}</div>
                        <div className="text-xs text-ink-soft mt-0.5">{t.stationNote}</div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`font-mono tabular-nums text-base font-bold ${isOvertime ? 'text-danger' : 'text-ink'}`}>
                          {t.mode === 'stopwatch'
                            ? formatSecondsMMSS(elapsed)
                            : isOvertime
                            ? `+${formatSecondsMMSS(Math.abs(remaining))}`
                            : formatSecondsMMSS(remaining)}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleTimerRun(t.id)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                            isRunning ? 'bg-amber-600 text-white' : 'bg-wine text-white'
                          }`}
                        >
                          {isRunning ? 'توقف' : 'شروع'}
                        </button>
                        <button
                          type="button"
                          onClick={() => resetTimer(t.id)}
                          className="p-1.5 rounded-lg bg-paper text-ink border border-line hover:bg-surface cursor-pointer"
                          title="ریست"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {currentStep.criticalWarning && (
            <div className="bg-red-50 border border-danger/30 p-3.5 rounded-xl text-xs text-ink flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-danger shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold block text-danger mb-0.5">هشدار و نکته خط قرمز کارگاهی:</strong>
                <span>{currentStep.criticalWarning}</span>
              </div>
            </div>
          )}

          {/* CONTEXTUAL LAB / CALCULATOR DEEP-LINK BUTTONS FOR THIS STEP */}
          {activeStepLabTools.length > 0 && (
            <div className="bg-paper border border-line p-3.5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-ink">
                <FlaskConical className="w-4 h-4 text-wine shrink-0" />
                <div>
                  <strong className="font-bold block">ابزار مهندسی و دستورالعمل آزمایشگاهی (SOP) مرتبط با گام {currentStep.id}:</strong>
                  <span className="text-xs text-ink-soft">
                    جهت محاسبه دقیق دوز یا مشاهده روش گام‌به‌گام آزمایش این مرحله کلیک کنید
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap shrink-0">
                {activeStepLabTools.map((tool) => (
                  <button
                    key={tool.testId}
                    type="button"
                    onClick={() => handleOpenLabTool(tool.testId, 'calculators-sops')}
                    className="px-3.5 py-2 rounded-xl bg-wine hover:opacity-95 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <span>{tool.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* IN-STEP INTERACTIVE QUICK LOGGING FORM */}
          {currentStep.requiresDataEntry && (
            <div className="bg-amber-50/90 border-2 border-amber-300 p-4 rounded-2xl space-y-3 mt-3 shadow-xs">
              <div className="flex items-center justify-between gap-2 border-b border-amber-200/80 pb-2">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-amber-900" />
                  <span className="font-bold text-amber-950 text-xs sm:text-sm">
                    ثبت سریع لاگ روزانه / افزودنی برای گام {currentStep.id}
                  </span>
                </div>
                <span className="text-xs bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded">
                  اتصال مستقیم به لاگ‌شیت و پایگاه داده
                </span>
              </div>

              {/* FORM TYPE: DAILY FERMENTATION LOG */}
              {currentStep.defaultDataEntryType === 'daily' && (
                <form onSubmit={handleSaveStepDailyLog} className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5 text-xs">
                  <div>
                    <label className="block text-stone-700 font-bold mb-1">انتخاب مخزن:</label>
                    <select
                      value={quickTank}
                      onChange={(e) => setQuickTank(e.target.value as TankId)}
                      className="w-full bg-white border border-stone-300 rounded-lg p-1.5 font-bold"
                    >
                      <option value="tank-a">مخزن A (قرمز ۱۳۲L)</option>
                      {tankCount !== 1 && (
                        <option value="tank-b">مخزن B (قرمز ۱۳۲L)</option>
                      )}
                      <option value="tank-rose">گالن رُزه (۳۲L)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-700 font-bold mb-1">روز تخمیر:</label>
                    <input
                      type="number"
                      value={quickDay}
                      onChange={(e) => setQuickDay(Number(e.target.value))}
                      className="w-full bg-white border border-stone-300 rounded-lg p-1.5 font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-bold mb-1">وزن مخصوص (SG):</label>
                    <input
                      type="number"
                      step="0.001"
                      value={quickSG}
                      onChange={(e) => setQuickSG(Number(e.target.value))}
                      className="w-full bg-white border border-stone-300 rounded-lg p-1.5 font-mono font-bold text-rose-900"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-bold mb-1">درجه بریکس (°Bx):</label>
                    <input
                      type="number"
                      step="0.1"
                      value={quickBrix}
                      onChange={(e) => setQuickBrix(Number(e.target.value))}
                      className="w-full bg-white border border-stone-300 rounded-lg p-1.5 font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-bold mb-1">دمای کلاهک (°C):</label>
                    <input
                      type="number"
                      step="0.5"
                      value={quickTempCap}
                      onChange={(e) => setQuickTempCap(Number(e.target.value))}
                      className="w-full bg-white border border-stone-300 rounded-lg p-1.5 font-mono font-bold text-amber-900"
                    />
                  </div>

                  <div className="col-span-2 sm:col-span-2 lg:col-span-1 flex items-end">
                    <button
                      type="submit"
                      className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>ثبت در لاگ‌شیت</span>
                    </button>
                  </div>
                </form>
              )}

              {/* FORM TYPE: INITIAL ANALYSIS */}
              {currentStep.defaultDataEntryType === 'initial' && (
                <form onSubmit={handleSaveStepDailyLog} className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2.5 text-xs">
                  <div>
                    <label className="block text-stone-700 font-bold mb-1">بریکس اولیه (°Bx):</label>
                    <input
                      type="number"
                      step="0.1"
                      value={quickBrix}
                      onChange={(e) => setQuickBrix(Number(e.target.value))}
                      className="w-full bg-white border border-stone-300 rounded-lg p-1.5 font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-bold mb-1">SG اولیه (20°C):</label>
                    <input
                      type="number"
                      step="0.001"
                      value={quickSG}
                      onChange={(e) => setQuickSG(Number(e.target.value))}
                      className="w-full bg-white border border-stone-300 rounded-lg p-1.5 font-mono font-bold text-rose-900"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-bold mb-1">pH اولیه:</label>
                    <input
                      type="number"
                      step="0.01"
                      value={quickPH}
                      onChange={(e) => {
                        setQuickPH(Number(e.target.value));
                        setQuickPhTouched(true);
                      }}
                      className="w-full bg-white border border-stone-300 rounded-lg p-1.5 font-mono font-bold text-emerald-900"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-bold mb-1">اسیدیته TA (g/L):</label>
                    <input
                      type="number"
                      step="0.1"
                      value={quickTA}
                      onChange={(e) => {
                        setQuickTA(Number(e.target.value));
                        setQuickTaTouched(true);
                      }}
                      className="w-full bg-white border border-stone-300 rounded-lg p-1.5 font-mono font-bold text-amber-900"
                    />
                  </div>

                  <div className="col-span-2 sm:col-span-4 lg:col-span-1 flex items-end">
                    <button
                      type="submit"
                      className="w-full py-2 bg-rose-800 hover:bg-rose-900 text-white font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>ثبت آنالیز پایه</span>
                    </button>
                  </div>
                </form>
              )}

              {/* FORM TYPE: CHEMICAL ADDITION */}
              {currentStep.defaultDataEntryType === 'chemical' && (
                <form onSubmit={handleSaveStepChemical} className="space-y-2.5 text-xs">
                  <div className="bg-white/90 border border-amber-300 rounded-xl p-2.5">
                    <label className="block text-amber-950 font-bold mb-1">
                      تغییر یا انتخاب سریع ماده افزودنی از کاتالوگ پروتکل (پر کردن خودکار نام و دوز):
                    </label>
                    <select
                      value={selectedRoadmapChemPresetId}
                      onChange={(e) => applyRoadmapChemPreset(e.target.value, quickTank)}
                      className="w-full bg-amber-50/70 border border-amber-300 rounded-lg p-1.5 font-bold text-stone-900"
                    >
                      <option value="">— دوز پیش‌فرض گام {currentStep.id} (یا انتخاب سایر مواد از لیست) —</option>
                      {Array.from(
                        new Set(
                          getSmartAdditivePresets(flexPlan, quickTank).map((p) => p.categoryLabelFa)
                        )
                      ).map((catLabel) => (
                        <optgroup key={catLabel} label={catLabel}>
                          {getSmartAdditivePresets(flexPlan, quickTank)
                            .filter((p) => p.categoryLabelFa === catLabel)
                            .map((preset) => (
                              <option key={preset.id} value={preset.id}>
                                {preset.labelFa}
                              </option>
                            ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                    <div>
                      <label className="block text-stone-700 font-bold mb-1">نام ماده افزودنی:</label>
                      <input
                        type="text"
                        value={chemName || currentStep.defaultChemicalName || ''}
                        onChange={(e) => setChemName(e.target.value)}
                        className="w-full bg-white border border-stone-300 rounded-lg p-1.5 font-bold"
                        placeholder="مثلاً متابی‌سولفیت پتاسیم"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-700 font-bold mb-1">مقدار / دوز تزریق (g):</label>
                      <input
                        type="text"
                        value={chemAmount}
                        onChange={(e) => setChemAmount(e.target.value)}
                        className="w-full bg-white border border-stone-300 rounded-lg p-1.5 font-mono font-bold text-rose-900"
                        placeholder="6.52g"
                      />
                      {(() => {
                        const numericChemG = Number.parseFloat(
                          String(chemAmount).replace(/[^0-9.]/g, '')
                        );
                        if (!Number.isFinite(numericChemG) || numericChemG <= 0) {
                          return null;
                        }
                        const roadmapChemPlan = formatDoseForEquipment({
                          targetDoseGrams: numericChemG,
                          compoundNameFa: chemName,
                          compoundCategory: /kms|سولفیت/i.test(chemName)
                            ? 'kms'
                            : /مخمر|fermaid|go-ferm/i.test(chemName)
                              ? 'fermaid_or_yeast'
                              : 'general',
                          profile: equipmentProfile
                        });
                        if (roadmapChemPlan.executionMode !== 'stock_syringe') {
                          return null;
                        }
                        return (
                          <div className="text-xs font-medium text-wine ltr-metric mt-1">
                            معادل سرنگ استوک (ترازوی {scalePrecisionGrams}g):{' '}
                            {roadmapChemPlan.primaryDoseTextFa}
                          </div>
                        );
                      })()}
                    </div>

                    <div>
                      <label className="block text-stone-700 font-bold mb-1">مخزن هدف:</label>
                      <select
                        value={quickTank}
                        onChange={(e) => {
                          const nextTank = e.target.value as TankId;
                          setQuickTank(nextTank);
                          if (selectedRoadmapChemPresetId) {
                            applyRoadmapChemPreset(selectedRoadmapChemPresetId, nextTank);
                          }
                        }}
                        className="w-full bg-white border border-stone-300 rounded-lg p-1.5 font-bold"
                      >
                        <option value="tank-a">مخزن A (قرمز {flexPlan.volumes.redLiquidFermentPerTankL}L)</option>
                        {tankCount !== 1 && (
                          <option value="tank-b">مخزن B (قرمز {flexPlan.volumes.redLiquidFermentPerTankL}L)</option>
                        )}
                        <option value="tank-rose">گالن رُزه ({flexPlan.volumes.roseClarifiedFermentL}L)</option>
                      </select>
                    </div>

                    <div className="flex items-end">
                      <button
                        type="submit"
                        className="w-full py-2 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>ثبت در لاگ‌شیت ۳</span>
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* NEXT STEP PREVIEW BOX */}
          {nextStep && (
            <div className="bg-emerald-50/80 border border-emerald-200 p-3.5 rounded-xl text-xs text-emerald-950 flex items-start justify-between gap-3">
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-emerald-900">
                    مرحله بعدی شما (گام {nextStep.id}): {nextStep.title}
                  </span>
                  <span className="text-emerald-800 text-xs mt-0.5 block">
                    موقعیت: {nextStep.timeOrTrigger} • {nextStep.nextStepPreview}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setCurrentStepId(nextStep.id)}
                className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1"
              >
                <span>پرش به گام بعدی</span>
                <ArrowLeft className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* FILTER & SEARCH BAR FOR ALL 46 STEPS */}
      <div className="bg-surface p-4 sm:p-5 rounded-2xl border border-line shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-wine" />
            <h3 className="text-xs sm:text-sm font-bold text-ink">
              لیست جامع تمامی ۴۶ گام پروسه از صفر تا صد
            </h3>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجو در مراحل، دوزها یا دماها..."
              className="bg-paper border border-line text-xs rounded-lg pr-3 pl-3 py-1.5 text-ink focus:outline-none focus:border-wine flex-1 md:w-52"
            />

            <div className="flex items-center gap-1 flex-wrap">
              {[
                { id: 'all', label: 'همه فازها' },
                { id: 1, label: 'فاز ۱ (روز ۰)' },
                { id: 2, label: 'فاز ۲ (تخمیر قرمز)' },
                { id: 3, label: 'فاز ۳ (پرسینگ و گوگرد)' },
                { id: 4, label: 'فاز ۴ (شراب رُزه)' },
                { id: 5, label: 'فاز ۵ (سرما و آمیزه)' },
                { id: 6, label: 'فاز ۶ (بطری و موم)' }
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setFilterPhase(p.id as number | 'all')}
                  className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                    filterPhase === p.id
                      ? 'bg-wine text-white'
                      : 'bg-paper text-ink-soft border border-line hover:bg-surface'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* FULL CHRONOLOGICAL ROADMAP TABLE / LIST */}
        <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1 pt-2">
          {filteredSteps.map((step) => {
            const stepNum = (step as { stepNumber?: number }).stepNumber ?? step.id;
            const isCompleted = completedSteps.includes(step.id);
            const isActive = step.id === currentStepId;
            const stepTools = getStepLabTools(step.id);
            const stepDynSummary = getDynamicStepDoseSummary(step.id, flexPlan);
            const stepEquipGuide = getRoadmapStepEquipmentGuide(
              stepNum,
              equipmentProfile
            );
            const isDisabledRoseStep =
              !produceRoseSaignee &&
              ROSE_SPECIFIC_STEP_NUMBERS.has(stepNum);

            return (
              <div
                key={step.id}
                id={`roadmap-step-card-${stepNum}`}
                className={`p-3.5 rounded-xl border transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-3 ${
                  focusedStepHaloNumber === step.id
                    ? 'ring-2 ring-wine bg-wine/5 shadow-md duration-500'
                    : isActive
                      ? 'bg-paper border-wine shadow-xs ring-1 ring-wine/30'
                      : isCompleted
                        ? 'bg-emerald-50/40 border-emerald-200/80 opacity-90'
                        : 'bg-surface border-line hover:bg-paper'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    onClick={() => toggleStepCompleted(step.id)}
                    className="mt-0.5 cursor-pointer text-ink-soft hover:text-emerald-700 transition-colors"
                    title={isCompleted ? 'علامت‌گذاری به عنوان انجام نشده' : 'علامت‌گذاری به عنوان انجام شده'}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                    ) : (
                      <Circle className="w-5 h-5 text-ink-soft" />
                    )}
                  </button>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-wine bg-paper border border-line px-2 py-0.5 rounded">
                        گام {stepNum}
                      </span>
                      <h4
                        onClick={() => handleSelectStep(step.id)}
                        className="text-xs sm:text-sm font-bold text-ink hover:text-wine cursor-pointer"
                      >
                        {step.title}
                      </h4>
                      {isActive && (
                        <span className="text-xs bg-wine text-white font-bold px-2 py-0.5 rounded-full">
                          موقعیت فعلی شما
                        </span>
                      )}
                      {isDisabledRoseStep && (
                        <span className="text-xs bg-amber-500/15 text-warn border border-amber-500/40 font-bold px-2 py-0.5 rounded-full">
                          غیرفعال در پروفایل شما (تولید ۱۰۰٪ شراب قرمز بدون سانیه)
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-ink-soft leading-relaxed">
                      موقعیت/تریگر: <strong className="text-ink">{step.timeOrTrigger}</strong> • دما: <strong className="text-ink">{step.targetTemp}</strong>
                    </p>
                    <p className="text-xs text-ink leading-relaxed font-normal">
                      {step.keyAction}
                    </p>
                    {stepDynSummary && (
                      <div className="text-xs font-bold text-emerald-900 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg inline-block mt-1">
                        مقدار پویا ({flexParams.grapeWeightKg}kg): {stepDynSummary}
                      </div>
                    )}
                    {stepEquipGuide && (
                      <div
                        data-testid={`roadmap-step-equip-guide-${stepNum}`}
                        className="rounded-xl border border-line bg-paper p-3 mt-2.5 text-xs text-ink"
                      >
                        <span className="font-bold text-wine">
                          روش اجرا با تجهیزات کارگاه شما ({stepEquipGuide.badgeFa}):
                        </span>
                        <p className="mt-1 text-ink">{stepEquipGuide.instructionFa}</p>
                        {stepEquipGuide.warningFa && (
                          <div className="mt-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 p-2 text-xs text-ink">
                            جایگزین علمی ماده ناموجود: {stepEquipGuide.warningFa}
                          </div>
                        )}
                      </div>
                    )}
                    {[13, 14, 16, 17, 19].includes(stepNum) && (
                      <div
                        data-testid={`roadmap-step-yeast-note-${stepNum}`}
                        className="rounded-xl border border-wine/30 bg-paper p-2.5 mt-2 text-xs text-ink"
                      >
                        {`پروفایل مخمر انتخابی مخزن (${activeTankYeastStrain.nameFa}): دمای آبرسانی ${activeTankYeastStrain.rehydrationTempC}°C • بازه تخمیر بهینه ${activeTankYeastStrain.tempOptMinC}–${activeTankYeastStrain.tempOptMaxC}°C • ضریب نیتروژن ×${activeTankYeastStrain.yanMultiplier} • گلیسیرین درونزاد ${activeTankYeastStrain.glycerolYieldGL} g/L`}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end lg:self-center flex-wrap">
                  {stepTools.map((tool) => (
                    <button
                      key={tool.testId}
                      type="button"
                      onClick={() => handleOpenLabTool(tool.testId, 'calculators-sops')}
                      className="px-2.5 py-1.5 rounded-lg bg-paper hover:bg-surface text-ink border border-line text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                    >
                      <span>{tool.shortLabel}</span>
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => {
                      handleSelectStep(step.id);
                      setIsQuickLogModalOpen(true);
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-paper hover:bg-surface border border-line text-ink text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5 text-wine" />
                    <span>ثبت در این مرحله</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectStep(step.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      isActive
                        ? 'bg-wine text-white'
                        : 'bg-paper hover:bg-surface border border-line text-ink'
                    }`}
                  >
                    <span>{isActive ? 'نمایش کامل' : 'انتخاب گام'}</span>
                  </button>
                </div>
              </div>
            );
          })}

          {filteredSteps.length === 0 && (
            <p className="text-xs text-ink-soft py-6 text-center">
              هیچ گامی با عبارت جستجو یا فیلتر فعلی یافت نشد.
            </p>
          )}
        </div>
      </div>

      {/* Floating Active Timers Chip (`چیپ شناور تایمرها`) */}
      <button
        type="button"
        onClick={() => setShowTimerHub((prev) => !prev)}
        className={`fixed bottom-20 left-4 z-30 md:bottom-6 px-4 py-2.5 rounded-2xl border text-xs font-bold shadow-lg transition-all cursor-pointer flex items-center gap-2 no-print ${
          activeTimerCount > 0
            ? 'bg-wine text-white border-wine'
            : 'bg-surface text-ink border-line hover:bg-paper'
        }`}
      >
        <Timer className="w-4 h-4 shrink-0" />
        <span>
          {activeTimerCount > 0
            ? activeTimerCount + ' تایمر فعال'
            : 'تایمرهای کارگاهی'}
        </span>
      </button>
    </div>
  );
};
