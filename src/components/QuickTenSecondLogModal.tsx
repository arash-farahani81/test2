import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Droplets,
  FlaskConical,
  Info,
  Minus,
  Plus,
  RotateCcw,
  Save,
  Sparkles,
  Thermometer,
  X
} from 'lucide-react';
import type {
  ChemicalAddition,
  FermentationLogEntry,
  LabAnalysisRecord,
  StructuredCompoundType,
  TankId
} from '../types/index.ts';
import { enologyDb } from '../db/enologyDatabase.ts';
import {
  calculateRefractometerCorrection,
  correctHydrometer,
  normalizeEnologyNumericInput
} from '../utils/enologyUtils.ts';
import {
  detectQuickLogTypoShield,
  predictFermentationCompletion,
  sortFermentationLogs,
  specificGravityToBrix
} from '../utils/trackingCalculations.ts';
import { evaluateRightNowQueue } from '../utils/rightNowEngine.ts';
import { useLocalStorageState } from '../utils/useLocalStorage.ts';
import {
  getEffectiveProtocolPlanForBatch,
  useFlexibleProtocol
} from '../data/masterProtocolConfig.ts';
import { getCurrentPersianDateTimeStr } from '../utils/persianDate.ts';
import {
  resolveTargetTankIds,
  useEnologyUi,
  type GlobalTankSelection
} from '../context/EnologyUiContext.tsx';
import { formatDoseForEquipment } from '../utils/equipmentAdapterEngine.ts';

export type QuickSheetPresetMode = 'measurement' | 'addition' | 'lab';

export interface HydrometerCylinderMetrics {
  clampedSG: number;
  normalizedRatio: number;
  stemOffsetY: number;
  meniscusY: number;
  nextStationMarkerY: number | null;
  liquidColorHex: string;
  vernierTicks: Array<{
    sg: number;
    xPct: number;
    isMajor: boolean;
    isMedium: boolean;
  }>;
}

export function computeHydrometerCylinderMetrics(params: {
  currentSG: number;
  nextTargetSG?: number | null;
  isRose?: boolean;
}): HydrometerCylinderMetrics {
  const clampedSG = Math.min(
    1.11,
    Math.max(0.99, Number.isFinite(params.currentSG) ? params.currentSG : 1.083)
  );
  const normalizedRatio =
    Math.round(((clampedSG - 0.99) / 0.12) * 1000) / 1000;
  const meniscusY = 56;
  const stemOffsetY = Math.round((0.5 - normalizedRatio) * 52 * 10) / 10;

  let nextStationMarkerY: number | null = null;
  if (
    params.nextTargetSG !== undefined &&
    params.nextTargetSG !== null &&
    params.nextTargetSG >= 0.99 &&
    params.nextTargetSG <= 1.11
  ) {
    const targetRatio = (params.nextTargetSG - 0.99) / 0.12;
    nextStationMarkerY = Math.round((118 - targetRatio * 84) * 10) / 10;
  }

  const liquidColorHex = params.isRose
    ? clampedSG >= 1.08
      ? '#D96B52'
      : '#E88D72'
    : clampedSG >= 1.08
      ? '#4A153B'
      : clampedSG >= 1.02
        ? '#6E1F2F'
        : '#7A1C24';

  const vernierTicks: Array<{
    sg: number;
    xPct: number;
    isMajor: boolean;
    isMedium: boolean;
  }> = [];
  for (let i = 0; i <= 60; i++) {
    const sg = Math.round((0.99 + i * 0.002) * 1000) / 1000;
    const thousandths = Math.round(sg * 1000);
    const isMajor = thousandths % 10 === 0;
    const isMedium = !isMajor && thousandths % 5 === 0;
    const xPct = Math.round(((sg - 0.99) / 0.12) * 1000) / 10;
    vernierTicks.push({ sg, xPct, isMajor, isMedium });
  }

  return {
    clampedSG,
    normalizedRatio,
    stemOffsetY,
    meniscusY,
    nextStationMarkerY,
    liquidColorHex,
    vernierTicks
  };
}

export interface QuickTenSecondLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTankId?: TankId;
  initialMode?: QuickSheetPresetMode;
  onLogSaved?: (savedEntry: FermentationLogEntry) => void;
  inlineMode?: boolean;
}

const QUICK_SENSORY_TAGS = [
  'بوی گوگرد (H2S)',
  'بوی سرکه',
  'فوم زیاد',
  'کلاهک خشک',
  'تخمیر آرام و تمیز'
] as const;

const QUICK_COMPOUND_PRESETS: Array<{
  type: StructuredCompoundType;
  nameFa: string;
  unit: ChemicalAddition['unit'];
  defaultDoseG: number;
  defaultRedG: number;
  defaultRoseG: number;
  purposeFa: string;
}> = [
  {
    type: 'kms',
    nameFa: 'پتاسیم متابی‌سولفیت (KMS)',
    unit: 'g',
    defaultDoseG: 6.72,
    defaultRedG: 6.72,
    defaultRoseG: 2.34,
    purposeFa: 'حفاظت آنتی‌اکسیدانی و ضدباکتری (SO₂)'
  },
  {
    type: 'fermaid_o',
    nameFa: 'مکمل ارگانیک Fermaid O',
    unit: 'g',
    defaultDoseG: 33.0,
    defaultRedG: 33.0,
    defaultRoseG: 6.4,
    purposeFa: 'تغذیه نیتروژن ارگانیک مخمر (SNA)'
  },
  {
    type: 'fermaid_k',
    nameFa: 'مکمل ترکیبی Fermaid K',
    unit: 'g',
    defaultDoseG: 33.0,
    defaultRedG: 33.0,
    defaultRoseG: 5.76,
    purposeFa: 'تغذیه نیتروژن و تیامین مخمر (SNA)'
  },
  {
    type: 'dap',
    nameFa: 'دی‌آمونیم فسفات (DAP)',
    unit: 'g',
    defaultDoseG: 19.8,
    defaultRedG: 19.8,
    defaultRoseG: 2.56,
    purposeFa: 'تأمین نیتروژن معدنی در فاز رشد لگاریتمی'
  },
  {
    type: 'bactiless',
    nameFa: 'کیتوزان قارچی (Bactiless)',
    unit: 'g',
    defaultDoseG: 28.8,
    defaultRedG: 28.8,
    defaultRoseG: 6.2,
    purposeFa: 'قفل بیولوژیک باکتری‌های مالولاکتیک و استیک'
  },
  {
    type: 'tannin_red',
    nameFa: 'تانن انولوژیک قرمز',
    unit: 'g',
    defaultDoseG: 13.2,
    defaultRedG: 13.2,
    defaultRoseG: 0,
    purposeFa: 'تثبیت رنگ آنتوسیانین و ساختار پلی‌فنولی'
  },
  {
    type: 'tartaric',
    nameFa: 'اسید تارتاریک خوراکی',
    unit: 'g',
    defaultDoseG: 66.0,
    defaultRedG: 66.0,
    defaultRoseG: 16.0,
    purposeFa: 'اصلاح اسیدیته کل (TA) و کاهش pH'
  },
  {
    type: 'kht',
    nameFa: 'بی‌تارتارات پتاسیم (KHT — بذر تارتارات)',
    unit: 'g',
    defaultDoseG: 18.6,
    defaultRedG: 18.6,
    defaultRoseG: 6.0,
    purposeFa: 'هسته‌زایی تثبیت سرمایی (Cold Stabilization)'
  }
];

const QUICK_LAB_PRESETS: Array<{
  testType: LabAnalysisRecord['testType'];
  titleFa: string;
  analyte: string;
  unit: string;
  defaultVal: string;
}> = [
  {
    testType: 'ripper_so2',
    titleFa: 'سولفیت آزاد (Ripper Free SO₂)',
    analyte: 'Free SO2',
    unit: 'mg/L',
    defaultVal: '38'
  },
  {
    testType: 'ph_meter',
    titleFa: 'اسیدیته فعال (pH Meter)',
    analyte: 'pH',
    unit: 'pH',
    defaultVal: '3.52'
  },
  {
    testType: 'ta_titration',
    titleFa: 'اسیدیته کل قابل تیتر (TA)',
    analyte: 'Tartaric Acid',
    unit: 'g/L',
    defaultVal: '6.5'
  },
  {
    testType: 'mlf_chromatography',
    titleFa: 'کروماتوگرافی کاغذی اسید مالیک (MLF)',
    analyte: 'Malic / Lactic Acid',
    unit: 'وضعیت',
    defaultVal: 'depleted'
  }
];

interface PostSaveSummary {
  mode: QuickSheetPresetMode;
  savedEntry?: FermentationLogEntry;
  createdLogIds: string[];
  createdAdditionIds: string[];
  createdLabIds: string[];
  previousSG: number;
  sgDrop: number;
  drynessRangeDays: { min: number; max: number };
  primaryActionTitleFa: string | null;
  primaryActionDoseFa: string | null;
  primaryActionStateBadgeFa: string | null;
  learningFeedbackFa: string;
  expiresAtMs: number;
  remainingUndoSec: number;
}

export const QuickTenSecondLogModal: React.FC<QuickTenSecondLogModalProps> = ({
  isOpen,
  onClose,
  initialTankId = 'tank-a',
  initialMode = 'measurement',
  onLogSaved,
  inlineMode = false
}) => {
  const { plan } = useFlexibleProtocol();
  const {
    globalTankSelection,
    setGlobalTankSelection,
    tankCount,
    activeBatch,
    quickLogTankOverride,
    notifyDataChanged,
    scalePrecision,
    equipmentProfile,
    equipmentCapabilities
  } = useEnologyUi();

  const [mode, setMode] = useState<QuickSheetPresetMode>(initialMode);
  const [tankSelection, setTankSelection] = useState<GlobalTankSelection>(
    quickLogTankOverride ?? initialTankId
  );
  const [calibrationTemp, setCalibrationTemp] = useLocalStorageState<20 | 15.5>(
    'enology_hydrometer_cal_temp',
    20
  );

  // concrete primary tank for reading defaults
  const tankId: TankId =
    tankSelection === 'both-red'
      ? 'tank-a'
      : tankSelection === 'tank-b' && tankCount === 1
      ? 'tank-a'
      : tankSelection;

  // Measurement Mode States (Safe empty-default for rawSGInput)
  const [rawSGInput, setRawSGInput] = useState<string>('');
  const [lastSG, setLastSG] = useState<number>(1.083);
  const [tempSample, setTempSample] = useState<number>(20);
  const [tempCap, setTempCap] = useState<number>(23.0);
  const [tempRoom, setTempRoom] = useState<number>(21.0);
  const [tempRoomInput, setTempRoomInput] = useState<string>('21');
  const [pigeageDone, setPigeageDone] = useState<boolean>(true);

  // Optional Collapsible Accordion Toggles in 'measurement' mode
  const [openPhTaSection, setOpenPhTaSection] = useState<boolean>(false);
  const [openFreeSo2Section, setOpenFreeSo2Section] = useState<boolean>(false);
  const [openRefractSection, setOpenRefractSection] = useState<boolean>(false);
  const [openTagsNoteSection, setOpenTagsNoteSection] = useState<boolean>(false);

  const [phInput, setPhInput] = useState<string>('3.52');
  const [taInput, setTaInput] = useState<string>('');
  const [freeSo2Input, setFreeSo2Input] = useState<string>('');
  const [refractBrixInput, setRefractBrixInput] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [operationNote, setOperationNote] = useState<string>('');

  // Explicit Provenance Tracking Flags (Audit Section 2 & 5.3)
  const [hasExplicitPhInput, setHasExplicitPhInput] = useState<boolean>(false);
  const [hasExplicitTaInput, setHasExplicitTaInput] = useState<boolean>(false);
  const [hasExplicitSo2Input, setHasExplicitSo2Input] = useState<boolean>(false);
  const [hasExplicitRoomTempInput, setHasExplicitRoomTempInput] =
    useState<boolean>(false);

  // Addition Mode States (Safe empty-default for rawAdditionAmount)
  const [selectedCompoundType, setSelectedCompoundType] =
    useState<StructuredCompoundType>('kms');
  const [rawAdditionAmount, setRawAdditionAmount] = useState<string>('');
  const [additionLotNumber, setAdditionLotNumber] = useState<string>('');
  const [additionNote, setAdditionNote] = useState<string>('');

  // Lab Mode States (Safe empty-default for rawLabValue)
  const [selectedLabTestType, setSelectedLabTestType] =
    useState<LabAnalysisRecord['testType']>('ripper_so2');
  const [rawLabValue, setRawLabValue] = useState<string>('');
  const [labNote, setLabNote] = useState<string>('');

  const [postSaveSummary, setPostSaveSummary] =
    useState<PostSaveSummary | null>(null);

  // 10-second Undo countdown timer
  useEffect(() => {
    if (!postSaveSummary || postSaveSummary.remainingUndoSec <= 0) return;
    const timer = setInterval(() => {
      const rem = Math.max(
        0,
        Math.ceil((postSaveSummary.expiresAtMs - Date.now()) / 1000)
      );
      setPostSaveSummary((prev) =>
        prev ? { ...prev, remainingUndoSec: rem } : null
      );
    }, 250);
    return () => clearInterval(timer);
  }, [postSaveSummary]);

  const batchPlan = useMemo(
    () => getEffectiveProtocolPlanForBatch(activeBatch, plan),
    [activeBatch, plan]
  );

  const loadLatestTankDefaults = (targetTank: TankId) => {
    const tankLogs = sortFermentationLogs(
      enologyDb.getLogs(targetTank, false, activeBatch?.id)
    );
    const latest = tankLogs[tankLogs.length - 1];
    if (latest) {
      const prevRaw =
        latest.measuredSG !== undefined ? latest.measuredSG : latest.sg;
      setLastSG(Math.round(prevRaw * 1000) / 1000);
      setRawSGInput('');
      setTempSample(latest.tempSample ?? latest.tempCap ?? 20);
      setTempCap(latest.tempCap);
      setTempRoom(latest.tempRoom);
      setTempRoomInput(String(latest.tempRoom));
      setPhInput(latest.ph.toFixed(2));
      setTaInput(latest.ta !== undefined ? String(latest.ta) : '');
      setFreeSo2Input(
        latest.freeSO2 !== undefined ? String(latest.freeSO2) : ''
      );
      setPigeageDone(latest.pigeageDone);
    } else {
      setLastSG(targetTank === 'tank-rose' ? 1.088 : 1.092);
      setRawSGInput('');
      setTempSample(20);
      setTempCap(targetTank === 'tank-rose' ? 15.0 : 23.0);
      const defRoom = targetTank === 'tank-rose' ? 15.0 : 21.0;
      setTempRoom(defRoom);
      setTempRoomInput(String(defRoom));
      setPhInput(targetTank === 'tank-rose' ? '3.32' : '3.52');
      setTaInput('');
      setFreeSo2Input('');
      setPigeageDone(targetTank !== 'tank-rose');
    }
    setHasExplicitPhInput(false);
    setHasExplicitTaInput(false);
    setHasExplicitSo2Input(false);
    setHasExplicitRoomTempInput(false);
    setSelectedTags([]);
    setOperationNote('');
    setRefractBrixInput('');
    setRawAdditionAmount('');
    setRawLabValue('');
  };

  useEffect(() => {
    if (isOpen) {
      const nextSelection =
        quickLogTankOverride ?? initialTankId ?? globalTankSelection;
      const resolvedTank: TankId =
        nextSelection === 'both-red' ? 'tank-a' : nextSelection;
      setTankSelection(nextSelection);
      setMode(initialMode);
      setCalibrationTemp(
        equipmentCapabilities.defaultHydrometerCalibrationTemp
      );
      if (equipmentCapabilities.primarySugarInputMode === 'refractometer_brix') {
        setOpenRefractSection(true);
      }
      loadLatestTankDefaults(resolvedTank);
      setPostSaveSummary(null);
    }
  }, [
    isOpen,
    initialTankId,
    initialMode,
    quickLogTankOverride,
    equipmentCapabilities.defaultHydrometerCalibrationTemp,
    equipmentCapabilities.primarySugarInputMode
  ]);

  // BUG-62: Escape key handler when modal is open
  useEffect(() => {
    if (!isOpen || inlineMode || typeof document === 'undefined') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, inlineMode, onClose]);

  const handleSelectTank = (nextSelection: GlobalTankSelection) => {
    setTankSelection(nextSelection);
    setGlobalTankSelection(nextSelection);
    const resolved: TankId =
      nextSelection === 'both-red' ? 'tank-a' : nextSelection;
    loadLatestTankDefaults(resolved);
    setPostSaveSummary(null);
  };

  // Safe validation for Measurement Mode
  const parsedEnteredSG = useMemo(() => {
    if (!rawSGInput.trim()) return null;
    const parsed = normalizeEnologyNumericInput(rawSGInput, 'sg');
    return parsed !== null && parsed > 0 ? parsed : null;
  }, [rawSGInput]);

  const hasValidSGInput = parsedEnteredSG !== null;

  // Live SG used for preview/steppers (uses entered SG if present, else lastSG for preview reference)
  const normalizedRawSG = parsedEnteredSG ?? lastSG;

  // Live Hydrometer temperature correction
  const hydrometerResult = useMemo(
    () => correctHydrometer(normalizedRawSG, tempSample, calibrationTemp),
    [normalizedRawSG, tempSample, calibrationTemp]
  );

  const trueSG = hydrometerResult.trueSG;
  const equivalentBrix = useMemo(
    () => specificGravityToBrix(trueSG),
    [trueSG]
  );

  // Optional Refractometer Sean Terrill correction
  const refractResult = useMemo(() => {
    if (!refractBrixInput.trim()) return null;
    const val = normalizeEnologyNumericInput(refractBrixInput, 'general');
    if (val === null || val <= 0) return null;
    return calculateRefractometerCorrection(activeBatch?.initialBrix ?? 22.0, val);
  }, [refractBrixInput, activeBatch?.initialBrix]);

  // Soft validation warnings (Never blocks saving once SG is entered!)
  const isSgOutOfNormalRange =
    hasValidSGInput && (trueSG < 0.98 || trueSG > 1.13);
  const isTempCapOutOfNormalRange = tempCap < 5 || tempCap > 42;

  const existingTankLogs = useMemo(() => {
    const real = sortFermentationLogs(
      enologyDb
        .getLogs(tankId, false, activeBatch?.id)
        .filter((l) => !l.isBenchmark)
    );
    if (real.length > 0) return real;
    return sortFermentationLogs(
      enologyDb.getLogs(tankId, false, activeBatch?.id)
    );
  }, [tankId, activeBatch?.id, isOpen, postSaveSummary]);

  const latestRealOrBenchLog = existingTankLogs[existingTankLogs.length - 1];
  const nextDayNumber = latestRealOrBenchLog
    ? Math.max(0, latestRealOrBenchLog.dayNumber + 1)
    : 1;

  const predictionPreview = useMemo(() => {
    const simulatedLog: FermentationLogEntry = {
      id: 'preview-log',
      tankId,
      dayNumber: nextDayNumber,
      dateTime: '',
      stageTitle: 'پیش‌نمایش لحظه‌ای',
      brix: equivalentBrix,
      sg: Math.round(trueSG * 1000) / 1000,
      tempCap,
      tempRoom,
      ph: normalizeEnologyNumericInput(phInput, 'general') ?? 3.52,
      pigeageDone
    };
    return predictFermentationCompletion(
      [...existingTankLogs, simulatedLog],
      tankId,
      undefined,
      tempCap,
      activeBatch?.initialSG,
      batchPlan
    );
  }, [
    existingTankLogs,
    tankId,
    nextDayNumber,
    equivalentBrix,
    trueSG,
    tempCap,
    tempRoom,
    phInput,
    pigeageDone,
    activeBatch?.initialSG,
    batchPlan
  ]);

  const hydrometerMetrics = useMemo(
    () =>
      computeHydrometerCylinderMetrics({
        currentSG: hasValidSGInput ? trueSG : lastSG,
        nextTargetSG: predictionPreview?.nextCriticalStation?.targetSG ?? null,
        isRose: tankId === 'tank-rose'
      }),
    [
      hasValidSGInput,
      trueSG,
      lastSG,
      predictionPreview?.nextCriticalStation?.targetSG,
      tankId
    ]
  );

  const handleVernierSgChange = (nextSgVal: number) => {
    const clamped = Math.min(1.11, Math.max(0.99, nextSgVal));
    setRawSGInput(clamped.toFixed(3));
    if (
      typeof navigator !== 'undefined' &&
      typeof navigator.vibrate === 'function'
    ) {
      try {
        navigator.vibrate(4);
      } catch {
        // ignore haptic error
      }
    }
  };

  const typoShieldAlert = useMemo(() => {
    if (!hasValidSGInput) return null;
    return detectQuickLogTypoShield({
      measuredSG: normalizedRawSG,
      trueSG,
      previousSG: latestRealOrBenchLog?.sg,
      previousTempCap: latestRealOrBenchLog?.tempCap,
      tempCap,
      daysElapsed: latestRealOrBenchLog
        ? Math.max(0.5, nextDayNumber - latestRealOrBenchLog.dayNumber)
        : 1
    });
  }, [
    hasValidSGInput,
    normalizedRawSG,
    trueSG,
    latestRealOrBenchLog,
    tempCap,
    nextDayNumber
  ]);

  // BUG-02, BUG-63 & BUG-73: Dynamic reference volume per tank & exact batchPlan.dosages lookup
  const getReferenceVolumeForTank = (
    tId: TankId,
    compType: StructuredCompoundType = selectedCompoundType
  ): number => {
    if (tId === 'tank-rose') {
      if (compType === 'kht') return batchPlan.volumes.roseFinalBottlingL;
      if (compType === 'bactiless' || (compType === 'kms' && lastSG <= 1.002)) {
        return batchPlan.volumes.rosePostRackingL;
      }
      return batchPlan.volumes.roseClarifiedFermentL;
    }
    const tankAdjust = 2 / tankCount;
    const baseRedVol =
      compType === 'kht'
        ? batchPlan.volumes.rack2PerTankL
        : compType === 'bactiless'
        ? batchPlan.volumes.rack1PerTankL
        : lastSG > 1.008
        ? batchPlan.volumes.redLiquidFermentPerTankL
        : batchPlan.volumes.rack1PerTankL;
    return Math.round(baseRedVol * tankAdjust * 10) / 10;
  };

  // Addition Preset & Safe Empty Validation
  const currentCompoundPreset = useMemo(() => {
    const base =
      QUICK_COMPOUND_PRESETS.find((c) => c.type === selectedCompoundType) ??
      QUICK_COMPOUND_PRESETS[0];
    const d = batchPlan.dosages;
    const v = batchPlan.volumes;
    const isRose = tankId === 'tank-rose';
    const tankAdjust = isRose ? 1 : 2 / tankCount;

    let rawDoseG: number;
    switch (base.type) {
      case 'kms':
        rawDoseG = isRose
          ? d.rosePostFermKmsG
          : (lastSG > 1.085 ? d.crushKmsPerTankG : d.day11KmsPerTankG) * tankAdjust;
        break;
      case 'fermaid_o':
        rawDoseG = isRose
          ? d.fermaidO1RoseG
          : (lastSG < 1.065 ? d.fermaidO3RedPerTankG : d.fermaidO1RedPerTankG) * tankAdjust;
        break;
      case 'fermaid_k':
        rawDoseG = isRose
          ? d.fermaidK2RoseG
          : d.fermaidK2RedPerTankG * tankAdjust;
        break;
      case 'dap':
        rawDoseG = isRose ? d.dap2RoseG : d.dap2RedPerTankG * tankAdjust;
        break;
      case 'bactiless':
        rawDoseG = isRose
          ? d.bactilessRoseG
          : d.bactilessRedPerTankG * tankAdjust;
        break;
      case 'tannin_red':
        rawDoseG = isRose
          ? d.whiteTanninRoseFermentG
          : d.redTanninPhase2PerTankG * tankAdjust;
        break;
      case 'tartaric':
        rawDoseG = isRose
          ? base.defaultRoseG * (v.roseClarifiedFermentL / 32)
          : base.defaultRedG * (v.redLiquidFermentPerTankL / 132) * tankAdjust;
        break;
      case 'kht':
        rawDoseG = isRose
          ? d.khtColdStabRoseG
          : d.khtColdStabRedPerTankG * tankAdjust;
        break;
      default:
        rawDoseG = (isRose ? base.defaultRoseG : base.defaultRedG) * tankAdjust;
    }

    const scaledDoseG = Math.round(rawDoseG * 100) / 100;
    return {
      ...base,
      defaultDoseG: scaledDoseG
    };
  }, [selectedCompoundType, batchPlan, tankId, tankCount, lastSG]);
  const parsedAdditionAmount = useMemo(() => {
    if (!rawAdditionAmount.trim()) return null;
    const val = normalizeEnologyNumericInput(rawAdditionAmount, 'general');
    return val !== null && val > 0 ? val : null;
  }, [rawAdditionAmount]);

  // Lab Preset & Safe Empty Validation
  const currentLabPreset = useMemo(
    () =>
      QUICK_LAB_PRESETS.find((l) => l.testType === selectedLabTestType) ??
      QUICK_LAB_PRESETS[0],
    [selectedLabTestType]
  );
  const hasValidLabInput = useMemo(() => {
    if (!rawLabValue.trim()) return false;
    if (selectedLabTestType === 'mlf_chromatography') return true;
    const val = normalizeEnologyNumericInput(rawLabValue, 'general');
    return val !== null && val >= 0;
  }, [rawLabValue, selectedLabTestType]);

  const toggleQuickTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const adjustPh = (delta: number) => {
    const current = normalizeEnologyNumericInput(phInput, 'general') ?? 3.52;
    const next = Math.max(
      2.5,
      Math.min(4.8, Math.round((current + delta) * 100) / 100)
    );
    setPhInput(next.toFixed(2));
    setHasExplicitPhInput(true);
  };

  const targetTankIds = useMemo(
    () => resolveTargetTankIds(tankSelection, tankCount),
    [tankSelection, tankCount]
  );

  const getFormattedNowDate = (nowMs: number): string =>
    getCurrentPersianDateTimeStr(nowMs);

  const handleSaveMeasurement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasValidSGInput) return;

    const existingLogs = sortFermentationLogs(
      enologyDb.getLogs(tankId, false, activeBatch?.id).filter((l) => !l.isBenchmark)
    );
    const latest = existingLogs[existingLogs.length - 1];
    const previousSG = latest ? latest.sg : 1.092;

    const finalSG = Math.round(trueSG * 1000) / 1000;
    const finalBrix = specificGravityToBrix(finalSG);
    const parsedPh = normalizeEnologyNumericInput(phInput, 'general');
    const isValidPH = hasExplicitPhInput && parsedPh !== null && Number.isFinite(parsedPh);
    const parsedTa = normalizeEnologyNumericInput(taInput, 'general');
    const isValidTA = hasExplicitTaInput && parsedTa !== null && Number.isFinite(parsedTa);
    const parsedFreeSo2 = normalizeEnologyNumericInput(freeSo2Input, 'general');
    const isValidSO2 = hasExplicitSo2Input && parsedFreeSo2 !== null && Number.isFinite(parsedFreeSo2);

    const nowMs = Date.now();
    const dateStr = getFormattedNowDate(nowMs);

    const combinedNoteParts: string[] = [];
    if (selectedTags.length > 0) {
      combinedNoteParts.push(`[تگ‌ها: ${selectedTags.join('، ')}]`);
    }
    if (operationNote.trim()) {
      combinedNoteParts.push(operationNote.trim());
    }

    const currentBatch =
      activeBatch ??
      enologyDb.getBatches().find((b) => !b.isDemo) ??
      enologyDb.getBatches()[0];

    const createdLogIds: string[] = [];
    let primarySavedEntry: FermentationLogEntry | undefined;

    for (let idx = 0; idx < targetTankIds.length; idx++) {
      const tId = targetTankIds[idx];
      const tankLogs = sortFermentationLogs(
        enologyDb.getLogs(tId, false, activeBatch?.id).filter((l) => !l.isBenchmark)
      );
      const tankLatest = tankLogs[tankLogs.length - 1];
      const tankNextDayNumber = tankLatest ? Math.max(0, tankLatest.dayNumber + 1) : 1;
      const tankInheritedPh = isValidPH
        ? Math.round(parsedPh * 100) / 100
        : (tankLatest?.ph ?? (tId === 'tank-rose' ? 3.32 : 3.52));
      const tankInheritedTa = isValidTA
        ? parsedTa
        : (tankLatest?.ta ?? (tId === 'tank-rose' ? 7.0 : 6.7));
      const tankInheritedSo2 = isValidSO2 ? parsedFreeSo2 : tankLatest?.freeSO2;

      const entryTimestampMs = nowMs + idx;
      const entryId = `log-quick-${tId}-${entryTimestampMs}-${idx}`;
      const newEntry: FermentationLogEntry = {
        id: entryId,
        batchId: currentBatch?.id,
        tankId: tId,
        dayNumber: tankNextDayNumber,
        dateTime: dateStr,
        timestampMs: entryTimestampMs,
        stageTitle: `ثبت سریع روز ${tankNextDayNumber}`,
        sg: finalSG,
        measuredSG: Math.round(normalizedRawSG * 1000) / 1000,
        tempSample,
        brix: finalBrix,
        tempCap: Math.round(tempCap * 10) / 10,
        tempRoom: Math.round(tempRoom * 10) / 10,
        tempRoomMeasured: hasExplicitRoomTempInput,
        ph: tankInheritedPh,
        phMeasured: isValidPH,
        ta: tankInheritedTa,
        taMeasured: isValidTA,
        freeSO2: tankInheritedSo2,
        freeSO2Measured: isValidSO2,
        pigeageDone,
        pigeageCount: pigeageDone ? 3 : 0,
        quickTags: selectedTags,
        operationNote:
          combinedNoteParts.join(' — ') ||
          `ثبت ۱۰ ثانیه‌ای (SG قرائت‌شده: ${normalizedRawSG.toFixed(3)} در ${tempSample}°C)`,
        isTriggerPoint: false,
        isBenchmark: false,
        isDemo: false
      };

      enologyDb.addLog(newEntry);
      createdLogIds.push(entryId);
      if (!primarySavedEntry) primarySavedEntry = newEntry;
    }

    const updatedTankLogs = enologyDb.getLogs(tankId, false, currentBatch?.id);
    const prediction = predictFermentationCompletion(
      updatedTankLogs,
      tankId,
      undefined,
      undefined,
      currentBatch?.initialSG
    );
    const queue = evaluateRightNowQueue({
      logs: enologyDb.getLogs(undefined, false, currentBatch?.id),
      additions: enologyDb.getAdditions(undefined, false, currentBatch?.id),
      activeTankId: tankId,
      batch: currentBatch,
      excludeDemo: !enologyDb.hasDemoData(),
      equipmentProfile
    });

    const primary = queue.primaryAction;
    const activeTankRow =
      primary?.tankRows.find((r) => r.tankId === tankId) ??
      primary?.tankRows[0];
    const sgDrop = Math.round((previousSG - finalSG) * 1000) / 1000;

    let learningFeedbackFa = `ثبت شد. افت ${sgDrop.toFixed(3)} نسبت به ثبت قبلی — سرعت تخمیر طبیعی است.`;
    if (finalSG <= 1.000) {
      learningFeedbackFa =
        'ثبت شد. چگالی از ۱.۰۰۰ عبور کرده و تولید گاز CO₂ به حداقل رسیده است — مراقب نفوذ اکسیژن باشید.';
    } else if (sgDrop >= 0.015) {
      learningFeedbackFa = `ثبت شد. افت پرشتاب ${sgDrop.toFixed(3)} نشان‌دهنده اوج فاز لگاریتمی مخمر است — دمای کلاهک را زیر ۲۸ درجه نگه دارید.`;
    } else if (sgDrop <= 0.001) {
      learningFeedbackFa =
        'ثبت شد. افت چگالی نسبت به ثبت قبلی ناچیز است — دمای مخزن و نیاز مخمر به هوادهی/تغذیه را بررسی کنید.';
    }

    setPostSaveSummary({
      mode: 'measurement',
      savedEntry: primarySavedEntry,
      createdLogIds,
      createdAdditionIds: [],
      createdLabIds: [],
      previousSG,
      sgDrop,
      drynessRangeDays: prediction.estimatedDaysRange,
      primaryActionTitleFa: primary ? primary.titleFa : null,
      primaryActionDoseFa: activeTankRow
        ? activeTankRow.doseAmountTextFa
        : null,
      primaryActionStateBadgeFa: primary ? primary.stateBadgeFa : null,
      learningFeedbackFa,
      expiresAtMs: Date.now() + 10000,
      remainingUndoSec: 10
    });

    notifyDataChanged();
    if (primarySavedEntry) {
      onLogSaved?.(primarySavedEntry);
    }
  };

  const handleSaveAddition = (e: React.FormEvent) => {
    e.preventDefault();
    if (parsedAdditionAmount === null) return;

    const nowMs = Date.now();
    const dateStr = getFormattedNowDate(nowMs);
    const currentBatch =
      activeBatch ??
      enologyDb.getBatches().find((b) => !b.isDemo) ??
      enologyDb.getBatches()[0];

    const batchTankLogs = sortFermentationLogs(
      enologyDb.getLogs(tankId, false, currentBatch?.id)
    );
    const latestBatchSG =
      batchTankLogs[batchTankLogs.length - 1]?.sg ?? lastSG;

    const createdAdditionIds: string[] = [];
    for (let idx = 0; idx < targetTankIds.length; idx++) {
      const tId = targetTankIds[idx];
      const refVol = getReferenceVolumeForTank(tId, currentCompoundPreset.type);
      const saved = enologyDb.addAddition({
        batchId: currentBatch?.id ?? 'batch-rasha-1403',
        tankId: tId,
        timestamp: dateStr,
        timestampMs: nowMs + idx,
        stageTitle: 'ثبت سریع افزودنی کارگاهی',
        compoundName: currentCompoundPreset.nameFa,
        compoundType: currentCompoundPreset.type,
        amount: parsedAdditionAmount,
        unit: currentCompoundPreset.unit,
        purpose: currentCompoundPreset.purposeFa,
        referenceVolumeL: refVol,
        sgAtAddition: latestBatchSG,
        lotNumber: additionLotNumber.trim() || undefined,
        operatorNote: additionNote.trim() || undefined,
        isDemo: false
      });
      createdAdditionIds.push(saved.id);
    }

    const queue = evaluateRightNowQueue({
      logs: enologyDb.getLogs(undefined, false, currentBatch?.id),
      additions: enologyDb.getAdditions(undefined, false, currentBatch?.id),
      activeTankId: tankId,
      batch: currentBatch,
      excludeDemo: !enologyDb.hasDemoData(),
      equipmentProfile
    });
    const primary = queue.primaryAction;
    const activeTankRow =
      primary?.tankRows.find((r) => r.tankId === tankId) ??
      primary?.tankRows[0];

    setPostSaveSummary({
      mode: 'addition',
      createdLogIds: [],
      createdAdditionIds,
      createdLabIds: [],
      previousSG: lastSG,
      sgDrop: 0,
      drynessRangeDays: { min: 1, max: 3 },
      primaryActionTitleFa: primary ? primary.titleFa : null,
      primaryActionDoseFa: activeTankRow
        ? activeTankRow.doseAmountTextFa
        : null,
      primaryActionStateBadgeFa: primary ? primary.stateBadgeFa : null,
      learningFeedbackFa: `ثبت شد. افزودنی «${currentCompoundPreset.nameFa}» به مقدار ${parsedAdditionAmount} ${currentCompoundPreset.unit} در دفتر شیمیایی و حسابداری SO₂ ثبت گردید.`,
      expiresAtMs: Date.now() + 10000,
      remainingUndoSec: 10
    });

    notifyDataChanged();
  };

  const handleSaveLabAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasValidLabInput) return;

    const nowMs = Date.now();
    const dateStr = getFormattedNowDate(nowMs);
    const currentBatch =
      activeBatch ??
      enologyDb.getBatches().find((b) => !b.isDemo) ??
      enologyDb.getBatches()[0];

    const numericVal = normalizeEnologyNumericInput(rawLabValue, 'general');
    const measuredValue: number | string =
      selectedLabTestType === 'mlf_chromatography'
        ? rawLabValue.trim()
        : (numericVal ?? rawLabValue.trim());

    const createdLabIds: string[] = [];
    for (const tId of targetTankIds) {
      const saved = enologyDb.addLabAnalysis({
        batchId: currentBatch?.id ?? 'batch-rasha-1403',
        tankId: tId,
        date: dateStr,
        timestampMs: nowMs,
        testType: selectedLabTestType,
        targetAnalyte: currentLabPreset.analyte,
        measuredValue,
        unit: currentLabPreset.unit,
        malicResult:
          selectedLabTestType === 'mlf_chromatography'
            ? rawLabValue.trim() === 'depleted'
              ? 'depleted'
              : rawLabValue.trim() === 'partial'
              ? 'partial'
              : 'present'
            : undefined,
        notes: labNote.trim() || 'ثبت سریع از شیت آزمایشگاه',
        isDemo: false
      });
      createdLabIds.push(saved.id);
    }

    setPostSaveSummary({
      mode: 'lab',
      createdLogIds: [],
      createdAdditionIds: [],
      createdLabIds,
      previousSG: lastSG,
      sgDrop: 0,
      drynessRangeDays: { min: 1, max: 3 },
      primaryActionTitleFa: null,
      primaryActionDoseFa: null,
      primaryActionStateBadgeFa: null,
      learningFeedbackFa: `ثبت شد. نتیجه آزمایش «${currentLabPreset.titleFa}» (${measuredValue} ${currentLabPreset.unit}) در پرونده کنترل کیفیت و دروازه بطری‌گذاری لحاظ شد.`,
      expiresAtMs: Date.now() + 10000,
      remainingUndoSec: 10
    });

    notifyDataChanged();
  };

  const handleUndoSavedRecord = () => {
    if (!postSaveSummary) return;
    for (const logId of postSaveSummary.createdLogIds) {
      enologyDb.softDeleteLog(logId);
    }
    for (const addId of postSaveSummary.createdAdditionIds) {
      enologyDb.softDeleteAddition(addId);
    }
    for (const labId of postSaveSummary.createdLabIds) {
      enologyDb.deleteLabAnalysis(labId);
    }
    setPostSaveSummary(null);
    notifyDataChanged();
  };

  if (!isOpen) return null;

  const tankButtons: Array<{ id: GlobalTankSelection; labelFa: string }> =
    tankCount === 1
      ? [
          { id: 'tank-a', labelFa: 'مخزن قرمز (الف)' },
          { id: 'tank-rose', labelFa: 'گالن رُزه' }
        ]
      : [
          { id: 'tank-a', labelFa: 'مخزن قرمز A' },
          { id: 'tank-b', labelFa: 'مخزن قرمز B' },
          { id: 'tank-rose', labelFa: 'گالن رُزه' },
          { id: 'both-red', labelFa: 'هر دو قرمز (A+B)' }
        ];

  const contentCard = (
    <div
      className={`bg-surface text-ink border border-line rounded-2xl shadow-2xl overflow-hidden font-['Vazirmatn',sans-serif] ${
        inlineMode ? 'w-full' : 'w-full max-w-xl max-h-[92vh] overflow-y-auto'
      }`}
    >
      {/* Header */}
      <div className="bg-paper px-4 py-3.5 border-b border-line space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-wine/10 border border-wine/30 text-wine flex items-center justify-center shrink-0">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-ink">
                شیت یکپارچه ثبت کارگاهی (مخصوص دست خیس)
              </h3>
              <p className="text-xs text-ink-soft">
                بدون مقدار پیش‌فرض خطرناک • اصلاح خودکار دما و پیش‌بینی لحظه‌ای
              </p>
            </div>
          </div>
          {!inlineMode && (
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] min-w-[44px] rounded-xl bg-surface hover:bg-paper border border-line text-ink-soft hover:text-ink flex items-center justify-center cursor-pointer"
              aria-label="بستن پنجره ثبت سریع"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* 3 Preset Modes Switcher in One Shared Sheet (Section 3B.1) */}
        <div
          role="tablist"
          aria-label="انتخاب نوع ثبت کارگاهی"
          className="grid grid-cols-3 gap-1.5 bg-surface p-1 rounded-xl border border-line"
        >
          {(
            [
              ['measurement', 'ثبت اندازه‌گیری روزانه'],
              ['addition', 'ثبت سریع افزودنی'],
              ['lab', 'ثبت سریع آزمایش']
            ] as const
          ).map(([mId, mLabel]) => (
            <button
              key={mId}
              type="button"
              role="tab"
              aria-selected={mode === mId}
              onClick={() => {
                setMode(mId);
                setPostSaveSummary(null);
              }}
              className={`py-2 px-2 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                mode === mId
                  ? 'bg-wine text-white shadow-xs'
                  : 'text-ink-soft hover:text-ink hover:bg-paper'
              }`}
            >
              {mLabel}
            </button>
          ))}
        </div>
      </div>

      {/* Body: Either Post-Save Summary Sheet OR Active Mode Form */}
      {postSaveSummary ? (
        <div className="p-4 sm:p-5 space-y-4">
          <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                <span>با موفقیت در دفتر کارگاه ثبت شد!</span>
              </div>

              {/* 10-Second Undo Button */}
              {postSaveSummary.remainingUndoSec > 0 && (
                <button
                  type="button"
                  onClick={handleUndoSavedRecord}
                  className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>
                    بازگردانی (Undo — {postSaveSummary.remainingUndoSec} ثانیه)
                  </span>
                </button>
              )}
            </div>

            {/* 1-Sentence Contextual Learning Feedback */}
            <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 text-xs text-amber-950 font-bold flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>{postSaveSummary.learningFeedbackFa}</span>
            </div>

            {postSaveSummary.mode === 'measurement' &&
              postSaveSummary.savedEntry && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs">
                  <div className="bg-surface border border-line rounded-xl p-3">
                    <div className="text-ink-soft">
                      چگالی نهایی اصلاح‌شده (True SG):
                    </div>
                    <div className="text-base font-mono font-bold text-ink mt-0.5">
                      {postSaveSummary.savedEntry.sg.toFixed(3)}
                    </div>
                    <div className="text-emerald-800 font-bold mt-1">
                      افت امروز: {postSaveSummary.sgDrop.toFixed(3)} (نسبت به{' '}
                      {postSaveSummary.previousSG.toFixed(3)})
                    </div>
                  </div>
                  <div className="bg-surface border border-line rounded-xl p-3">
                    <div className="text-ink-soft">
                      پیش‌بینی رسیدن به خشکی کامل:
                    </div>
                    <div className="text-sm font-bold text-wine mt-1">
                      تخمین خشکی: {postSaveSummary.drynessRangeDays.min} تا{' '}
                      {postSaveSummary.drynessRangeDays.max} روز دیگر
                    </div>
                    <div className="text-xs text-ink-soft mt-1">
                      دمای کلاهک: {postSaveSummary.savedEntry.tempCap}°C | دمای
                      نمونه: {postSaveSummary.savedEntry.tempSample}°C
                    </div>
                  </div>
                </div>
              )}
          </div>

          {/* Active Milestone Card in Post-Save Summary */}
          {postSaveSummary.mode !== 'lab' && (
            <div className="bg-paper border border-line rounded-2xl p-4 space-y-2">
              <div className="text-xs font-bold text-ink-soft">
                وضعیت اقدام فوری «همین الان» پس از این ثبت:
              </div>
              {postSaveSummary.primaryActionTitleFa ? (
                <div className="bg-surface border border-line rounded-xl p-3 space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-950 text-xs font-bold">
                      {postSaveSummary.primaryActionStateBadgeFa}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-ink">
                      {postSaveSummary.primaryActionTitleFa}
                    </span>
                  </div>
                  {postSaveSummary.primaryActionDoseFa && (
                    <p className="text-xs text-wine font-bold">
                      مقدار دوز مخزن: {postSaveSummary.primaryActionDoseFa}
                    </p>
                  )}
                </div>
              ) : (
                <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3 text-xs font-bold text-emerald-900">
                  هیچ اقدام فوری لازم نیست </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                loadLatestTankDefaults(tankId);
                setPostSaveSummary(null);
              }}
              className="min-h-[48px] px-4 rounded-xl bg-paper hover:bg-surface border border-line text-ink text-xs font-bold cursor-pointer"
            >
              ثبت رکورد دیگر
            </button>
            {!inlineMode && (
              <button
                type="button"
                onClick={onClose}
                className="min-h-[48px] px-5 rounded-xl bg-wine hover:opacity-95 text-white text-xs font-bold cursor-pointer"
              >
                بستن و بازگشت به میز کار
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="p-4 sm:p-5 space-y-4">
          {/* Shared Tank Selector across all 3 modes */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-ink">
              انتخاب مخزن هدف:
            </label>
            <div
              className={`grid gap-2 ${
                tankButtons.length === 2 ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'
              }`}
            >
              {tankButtons.map((btn) => (
                <button
                  key={btn.id}
                  type="button"
                  onClick={() => handleSelectTank(btn.id)}
                  className={`min-h-[44px] rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    tankSelection === btn.id
                      ? 'bg-wine text-white border-wine shadow-xs'
                      : 'bg-paper text-ink border-line hover:bg-surface'
                  }`}
                >
                  {btn.labelFa}
                </button>
              ))}
            </div>
          </div>

          {/* MODE 1: MEASUREMENT ('ثبت اندازه‌گیری روزانه') */}
          {mode === 'measurement' && (
            <form onSubmit={handleSaveMeasurement} className="space-y-4">
              {/* Core Field 1 & 2: SG Input (Safe Empty Default + Gray Placeholder + Explicit Fill Chip) & Sample Temp */}
              <div className="bg-paper border border-line rounded-2xl p-3.5 space-y-3">
                <div className="text-xs text-ink-soft font-medium">
                  {equipmentCapabilities.primarySugarInputMode ===
                  'refractometer_brix'
                    ? 'ابزار اصلی کارگاه شما: رفراکتومتر بریکس (تبدیل خودکار تِریل به SG فعال است)'
                    : equipmentCapabilities.primarySugarInputMode ===
                      'sensory_timeline'
                    ? 'حالت بدون هیدرومتر: انتخابگر بصری مرحله تخمیر فعال است'
                    : `ابزار اصلی کارگاه شما: هیدرومتر کالیبره ${calibrationTemp}°C`}
                </div>

                {equipmentCapabilities.primarySugarInputMode ===
                  'refractometer_brix' && (
                  <div
                    data-testid="primary-refractometer-brix-box"
                    className="rounded-xl border border-wine/40 bg-paper p-3 mb-3 space-y-2"
                  >
                    <label
                      htmlFor="primary-refract-brix-input"
                      className="block text-xs font-bold text-ink"
                    >
                      قرائت رفراکتومتر (°Brix) — تبدیل خودکار تِریل به SG:
                    </label>
                    <input
                      id="primary-refract-brix-input"
                      type="text"
                      inputMode="decimal"
                      placeholder="مثلاً 12.5"
                      value={refractBrixInput}
                      onChange={(e) => {
                        const val = e.target.value;
                        setRefractBrixInput(val);
                        const parsed = normalizeEnologyNumericInput(
                          val,
                          'general'
                        );
                        if (parsed !== null && parsed > 0) {
                          const corr = calculateRefractometerCorrection(
                            batchPlan.params.initialBrix,
                            parsed
                          );
                          setRawSGInput(corr.trueSG.toFixed(3));
                        }
                      }}
                      className="w-full min-h-[46px] bg-surface border border-wine/50 rounded-xl px-3 text-center text-base font-mono font-bold text-ink"
                    />
                    {refractResult && (
                      <div className="text-xs ltr-metric font-bold text-wine">
                        {`True SG = ${refractResult.trueSG.toFixed(3)} | ABV ~${refractResult.abv.toFixed(1)}%`}
                      </div>
                    )}
                  </div>
                )}

                {equipmentCapabilities.primarySugarInputMode ===
                  'sensory_timeline' && (
                  <div
                    data-testid="sensory-sg-estimator-strip"
                    className="rounded-xl border border-line bg-paper p-3 mb-3 space-y-2"
                  >
                    <div className="text-xs font-bold text-ink">
                      تخمین سریع چگالی بر اساس مشاهدات حباب CO2 و طعم (ویژه کارگاه بدون هیدرومتر):
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {[
                        { labelFa: 'شروع / فاز لگ (شیرین)', sg: '1.085' },
                        { labelFa: 'اوج حباب طوفانی', sg: '1.068' },
                        { labelFa: 'نیمه راه تخمیر', sg: '1.045' },
                        { labelFa: 'نقطه پرسینگ (کمشیرین)', sg: '1.008' },
                        { labelFa: 'خشک و بدون حباب', sg: '0.993' }
                      ].map((stage) => (
                        <button
                          key={stage.sg}
                          type="button"
                          onClick={() => setRawSGInput(stage.sg)}
                          className={`px-2.5 py-2 rounded-lg border text-xs font-bold flex items-center justify-between gap-2 cursor-pointer transition-colors ${
                            rawSGInput === stage.sg
                              ? 'bg-wine text-white border-wine'
                              : 'bg-surface text-ink border-line hover:bg-paper'
                          }`}
                        >
                          <span>{stage.labelFa}</span>
                          <span className="ltr-metric font-mono">
                            {stage.sg}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <label
                    htmlFor="quick-sg-input"
                    className="text-xs sm:text-sm font-bold text-ink"
                  >
                    ۱. قرائت خام هیدرومتر (SG):
                  </label>
                  <button
                    type="button"
                    onClick={() => setRawSGInput(lastSG.toFixed(3))}
                    className="px-2.5 py-1 rounded-lg bg-surface hover:bg-paper border border-line text-xs font-bold text-wine cursor-pointer"
                  >
                    {'استفاده از مقدار قبلی (' + lastSG.toFixed(3) + ')'}
                  </button>
                </div>

                <div className="flex items-stretch gap-3">
                  {/* Live Floating Hydrometer & Meniscus Cylinder SVG (Golden Idea 2) */}
                  <svg
                    viewBox="0 0 76 152"
                    data-testid="live-hydrometer-cylinder-svg"
                    className="w-20 h-36 shrink-0 rounded-xl border border-line bg-paper p-1.5"
                    aria-label="شبیه‌ساز زنده شناوری هیدرومتر و منیسک"
                  >
                    {/* Graduated glass cylinder walls */}
                    <rect
                      x="18"
                      y="12"
                      width="40"
                      height="126"
                      rx="6"
                      fill="none"
                      stroke="currentColor"
                      className="text-line"
                      strokeWidth="1.5"
                    />
                    {/* Wine liquid column from meniscusY down to 136 */}
                    <rect
                      x="19.5"
                      y={hydrometerMetrics.meniscusY}
                      width="37"
                      height={136 - hydrometerMetrics.meniscusY}
                      rx="4"
                      fill={hydrometerMetrics.liquidColorHex}
                      fillOpacity="0.82"
                    />
                    {/* Curved concave meniscus path */}
                    <path
                      d="M 18 54 Q 38 60 58 54"
                      fill="none"
                      stroke={hydrometerMetrics.liquidColorHex}
                      strokeWidth="2.5"
                    />
                    {/* Floating Hydrometer Group */}
                    <g
                      data-testid="hydrometer-floating-stem"
                      style={{
                        transform: `translateY(${hydrometerMetrics.stemOffsetY}px)`,
                        transition:
                          'transform 220ms cubic-bezier(0.22, 1, 0.36, 1)'
                      }}
                    >
                      {/* Narrow upper stem */}
                      <rect
                        x="35"
                        y="18"
                        width="6"
                        height="58"
                        rx="3"
                        fill="#FAF6F0"
                        stroke="#78716C"
                        strokeWidth="1"
                      />
                      {/* Scale ticks on stem */}
                      <line
                        x1="35"
                        y1="30"
                        x2="41"
                        y2="30"
                        stroke="#7A1C32"
                        strokeWidth="1"
                      />
                      <text
                        x="33"
                        y="32"
                        textAnchor="end"
                        className="fill-current text-ink-soft font-mono"
                        fontSize="6"
                      >
                        1.000
                      </text>
                      <line
                        x1="35"
                        y1="48"
                        x2="41"
                        y2="48"
                        stroke="#7A1C32"
                        strokeWidth="1"
                      />
                      <text
                        x="33"
                        y="50"
                        textAnchor="end"
                        className="fill-current text-ink-soft font-mono"
                        fontSize="6"
                      >
                        1.040
                      </text>
                      <line
                        x1="35"
                        y1="66"
                        x2="41"
                        y2="66"
                        stroke="#7A1C32"
                        strokeWidth="1"
                      />
                      <text
                        x="33"
                        y="68"
                        textAnchor="end"
                        className="fill-current text-ink-soft font-mono"
                        fontSize="6"
                      >
                        1.080
                      </text>
                      {/* Weighted body & lead bulb */}
                      <ellipse
                        cx="38"
                        cy="88"
                        rx="7.5"
                        ry="14"
                        fill="#FAF6F0"
                        stroke="#78716C"
                        strokeWidth="1"
                      />
                      <circle cx="38" cy="105" r="4.5" fill="#44403C" />
                    </g>
                    {/* Next-Station Golden Marker */}
                    {hydrometerMetrics.nextStationMarkerY !== null && (
                      <g data-testid="hydrometer-next-station-marker">
                        <line
                          x1="14"
                          y1={hydrometerMetrics.nextStationMarkerY}
                          x2="62"
                          y2={hydrometerMetrics.nextStationMarkerY}
                          stroke="#a8661a"
                          strokeDasharray="3 2"
                          strokeWidth="1.5"
                        />
                        <text
                          x="73"
                          y={hydrometerMetrics.nextStationMarkerY + 2}
                          textAnchor="end"
                          fill="#a8661a"
                          fontSize="7"
                          fontWeight="bold"
                        >
                          هدف
                        </text>
                      </g>
                    )}
                  </svg>

                  {/* SG Numeric Input & tactile steppers */}
                  <div className="flex-1 flex flex-col justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleVernierSgChange(normalizedRawSG - 0.002)
                        }
                        className="min-h-[48px] px-3 rounded-xl bg-surface hover:bg-paper border border-line text-ink font-mono font-bold text-sm cursor-pointer"
                      >
                        -0.002
                      </button>
                      <input
                        id="quick-sg-input"
                        type="text"
                        inputMode="decimal"
                        placeholder={'آخرین مقدار شما: ' + lastSG.toFixed(3)}
                        value={rawSGInput}
                        onChange={(e) => setRawSGInput(e.target.value)}
                        onBlur={() => {
                          const norm = normalizeEnologyNumericInput(
                            rawSGInput,
                            'sg'
                          );
                          if (norm !== null) {
                            setRawSGInput(norm.toFixed(3));
                          }
                        }}
                        className="flex-1 min-h-[52px] bg-surface border-2 border-wine/60 rounded-xl px-2 text-center text-xl font-mono font-bold text-ink placeholder:text-ink-soft placeholder:text-xs"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          handleVernierSgChange(normalizedRawSG + 0.002)
                        }
                        className="min-h-[48px] px-3 rounded-xl bg-surface hover:bg-paper border border-line text-ink font-mono font-bold text-sm cursor-pointer"
                      >
                        +0.002
                      </button>
                    </div>

                    {/* Tactile Vernier Scrubber (Golden Idea 3) */}
                    <div
                      data-testid="sg-vernier-scrubber"
                      className="bg-surface border border-line rounded-xl p-2 space-y-1"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-ink-soft">
                          خطکش لمسی تنظیم سریع SG:
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() =>
                              handleVernierSgChange(
                                hydrometerMetrics.clampedSG - 0.001
                              )
                            }
                            className="px-2 py-0.5 rounded bg-paper border border-line font-mono text-xs font-bold text-ink cursor-pointer"
                          >
                            -0.001
                          </button>
                          <span className="font-mono font-bold text-wine ltr-metric">
                            {hydrometerMetrics.clampedSG.toFixed(3)}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleVernierSgChange(
                                hydrometerMetrics.clampedSG + 0.001
                              )
                            }
                            className="px-2 py-0.5 rounded bg-paper border border-line font-mono text-xs font-bold text-ink cursor-pointer"
                          >
                            +0.001
                          </button>
                        </div>
                      </div>
                      <input
                        type="range"
                        min={0.99}
                        max={1.11}
                        step={0.001}
                        value={hydrometerMetrics.clampedSG}
                        onChange={(e) =>
                          handleVernierSgChange(
                            Number.parseFloat(e.target.value)
                          )
                        }
                        className="w-full accent-wine cursor-pointer"
                        aria-label="خطکش لمسی وزن مخصوص"
                      />
                      <svg
                        viewBox="0 0 300 28"
                        className="w-full h-7 overflow-visible"
                        aria-hidden="true"
                      >
                        {hydrometerMetrics.vernierTicks.map((t) => {
                          const x = (t.xPct / 100) * 284 + 8;
                          const isNearActive =
                            Math.abs(t.sg - hydrometerMetrics.clampedSG) <=
                            0.0025;
                          const h = t.isMajor ? 11 : t.isMedium ? 7 : 4;
                          const showLabel =
                            t.sg === 0.99 ||
                            t.sg === 1.02 ||
                            t.sg === 1.05 ||
                            t.sg === 1.08 ||
                            t.sg === 1.11;
                          return (
                            <g key={t.sg}>
                              <line
                                x1={x}
                                y1={2}
                                x2={x}
                                y2={2 + h}
                                stroke={isNearActive ? '#7A1C32' : '#A8A29E'}
                                strokeWidth={
                                  isNearActive ? '2' : t.isMajor ? '1.3' : '0.9'
                                }
                              />
                              {showLabel && (
                                <text
                                  x={x}
                                  y={24}
                                  textAnchor="middle"
                                  fontSize="7.5"
                                  className="fill-current text-ink-soft font-mono"
                                >
                                  {t.sg.toFixed(3)}
                                </text>
                              )}
                            </g>
                          );
                        })}
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Core Field 2: Sample Temperature (دمای نمونه) */}
                <div className="pt-2 border-t border-line space-y-2">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-xs font-bold text-ink flex items-center gap-1.5">
                      <Thermometer className="w-4 h-4 text-wine" />
                      <span>۲. دمای نمونه (داخل استوانه هیدرومتر):</span>
                    </span>
                    <div className="flex items-center gap-1 bg-surface px-2 py-1 rounded-lg border border-line text-xs">
                      <span className="text-ink-soft">کالیبراسیون:</span>
                      {([20, 15.5] as const).map((cal) => (
                        <button
                          key={cal}
                          type="button"
                          onClick={() => setCalibrationTemp(cal)}
                          className={`px-2 py-0.5 rounded font-mono font-bold cursor-pointer ${
                            calibrationTemp === cal
                              ? 'bg-wine text-white'
                              : 'text-ink-soft hover:text-ink'
                          }`}
                        >
                          {cal} °C
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setTempSample((t) => Math.round((t - 0.5) * 10) / 10)
                      }
                      className="min-h-[48px] px-4 rounded-xl bg-surface hover:bg-paper border border-line text-ink font-mono font-bold text-xs sm:text-sm cursor-pointer"
                    >
                      -0.5 °C
                    </button>
                    <input
                      type="number"
                      step="0.5"
                      inputMode="decimal"
                      value={tempSample}
                      onChange={(e) => {
                        const v = normalizeEnologyNumericInput(
                          e.target.value,
                          'general'
                        );
                        if (v !== null) setTempSample(v);
                      }}
                      className="flex-1 min-h-[48px] bg-surface border border-line rounded-xl px-3 text-center text-base font-mono font-bold text-ink"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setTempSample((t) => Math.round((t + 0.5) * 10) / 10)
                      }
                      className="min-h-[48px] px-4 rounded-xl bg-surface hover:bg-paper border border-line text-ink font-mono font-bold text-xs sm:text-sm cursor-pointer"
                    >
                      +0.5 °C
                    </button>
                  </div>

                  {/* Live Preview Box right below SG: True SG AND Equivalent Brix */}
                  <div className="bg-surface border border-line rounded-xl p-2.5 text-xs text-ink font-bold space-y-1.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span>
                        {'SG تصحیح‌شده: ' +
                          trueSG.toFixed(4) +
                          ' (' +
                          (hydrometerResult.delta >= 0 ? '+' : '') +
                          hydrometerResult.delta.toFixed(4) +
                          ')'}
                      </span>
                      <span className="text-wine font-mono">
                        {'Brix معادل: ' + equivalentBrix.toFixed(1) + ' °Bx'}
                      </span>
                    </div>
                    {predictionPreview.nextCriticalStation && (
                      <div className="pt-1.5 border-t border-line flex items-center gap-1.5 text-xs text-ink-soft font-bold">
                        <Clock className="w-3.5 h-3.5 text-wine shrink-0" />
                        <span>
                          ایستگاه حساس بعدی:{' '}
                          {predictionPreview.nextCriticalStation.badgeTextFa}{' '}
                          (فاصله: ΔSG ={' '}
                          {predictionPreview.nextCriticalStation.sgDeltaRemaining.toFixed(
                            3
                          )}
                          )
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Smart Real-Time Typo & Transposition Shield Banner */}
                  {typoShieldAlert && (
                    <div className="rounded-xl border border-amber-500/50 bg-amber-500/10 p-3 text-xs text-ink space-y-2">
                      <div className="flex items-center gap-2 font-bold text-warn">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        <span>{typoShieldAlert.titleFa}</span>
                      </div>
                      <p className="leading-relaxed">
                        {typoShieldAlert.messageFa}
                      </p>
                      {typoShieldAlert.suggestedValue !== undefined &&
                        typoShieldAlert.suggestedLabelFa && (
                          <button
                            type="button"
                            onClick={() => {
                              if (
                                typoShieldAlert.suggestedValue === undefined
                              ) {
                                return;
                              }
                              if (typoShieldAlert.field === 'sg') {
                                setRawSGInput(
                                  typoShieldAlert.suggestedValue.toFixed(3)
                                );
                              } else if (typoShieldAlert.field === 'tempCap') {
                                setTempCap(typoShieldAlert.suggestedValue);
                              }
                            }}
                            className="bg-wine text-white px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer"
                          >
                            {typoShieldAlert.suggestedLabelFa}
                          </button>
                        )}
                    </div>
                  )}

                  {/* >32 °C Hydrometer Cooling Warning */}
                  {hydrometerResult.isAbove32CWarning && (
                    <div className="bg-amber-50 border border-amber-300 rounded-xl p-2.5 text-xs font-bold text-amber-950 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                      <span>
                        {hydrometerResult.warningFa ??
                          'نمونه را خنک کنید؛ فرمول فقط تا ۳۲ °C دقیق است'}
                      </span>
                    </div>
                  )}

                  {/* Soft Validation Warning for SG */}
                  {isSgOutOfNormalRange && (
                    <div className="bg-amber-50 border border-amber-300 rounded-xl p-2.5 text-xs text-amber-950 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                      <span>
                        هشدار نرم: مقدار SG ({trueSG.toFixed(3)}) خارج از بازه
                        متعارف شراب‌سازی (0.980 تا 1.130) است، اما دکمه ذخیره
                        فعال است.
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Core Field 3 (دمای کلاهک) & Core Field 4 (پیژاژ انجام شد؟) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-paper border border-line rounded-2xl p-3 space-y-2">
                  <label className="block text-xs font-bold text-ink">
                    ۳. دمای کلاهک (Cap °C):
                  </label>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        setTempCap((t) => Math.round((t - 0.5) * 10) / 10)
                      }
                      className="min-h-[48px] px-3 rounded-xl bg-surface hover:bg-paper border border-line text-ink font-mono font-bold text-xs cursor-pointer"
                    >
                      -0.5 °C
                    </button>
                    <input
                      type="number"
                      step="0.5"
                      inputMode="decimal"
                      value={tempCap}
                      onChange={(e) => {
                        const v = normalizeEnologyNumericInput(
                          e.target.value,
                          'general'
                        );
                        if (v !== null) setTempCap(v);
                      }}
                      className="flex-1 min-h-[48px] bg-surface border border-line rounded-xl px-2 text-center text-base font-mono font-bold text-ink"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setTempCap((t) => Math.round((t + 0.5) * 10) / 10)
                      }
                      className="min-h-[48px] px-3 rounded-xl bg-surface hover:bg-paper border border-line text-ink font-mono font-bold text-xs cursor-pointer"
                    >
                      +0.5 °C
                    </button>
                  </div>
                  <div className="bg-surface border border-line rounded-xl px-2.5 py-1.5 space-y-1">
                    <div className="flex items-center justify-between text-xs text-ink-soft font-mono">
                      <span>10°C</span>
                      <span className="font-bold text-wine ltr-metric">
                        {tempCap.toFixed(1)} °C
                      </span>
                      <span>35°C</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={35}
                      step={0.5}
                      value={Math.min(35, Math.max(10, tempCap))}
                      onChange={(e) => {
                        setTempCap(Number.parseFloat(e.target.value));
                        if (
                          typeof navigator !== 'undefined' &&
                          typeof navigator.vibrate === 'function'
                        ) {
                          try {
                            navigator.vibrate(4);
                          } catch {
                            // ignore haptic error
                          }
                        }
                      }}
                      className="w-full accent-wine cursor-pointer"
                      aria-label="خطکش لمسی دمای کلاهک"
                    />
                  </div>
                  {isTempCapOutOfNormalRange && (
                    <div className="bg-amber-50 border border-amber-300 rounded-lg p-2 text-xs text-amber-950">
                      هشدار نرم: دمای کلاهک ({tempCap}°C) خارج از بازه ۵ تا ۴۲
                      درجه است (ذخیره مجاز است).
                    </div>
                  )}
                </div>

                <div className="bg-paper border border-line rounded-2xl p-3 flex flex-col justify-between">
                  <span className="text-xs font-bold text-ink">
                    ۴. پیژاژ انجام شد؟
                  </span>
                  <button
                    type="button"
                    onClick={() => setPigeageDone((v) => !v)}
                    className={`mt-2 min-h-[48px] w-full rounded-xl font-bold text-xs sm:text-sm border flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      pigeageDone
                        ? 'bg-emerald-700 text-white border-emerald-700'
                        : 'bg-surface text-ink-soft border-line'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {pigeageDone
                        ? 'بله — پیژاژ و خیساندن کلاهک انجام شد'
                        : 'خیر — بدون پیژاژ'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Clean Collapsible Accordion Chips for Optional Sections (Section 3B.3) */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-ink-soft">
                  بخش‌های تکمیلی (اختیاری — برای باز کردن کلیک کنید):
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setOpenPhTaSection((v) => !v)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1 cursor-pointer ${
                      openPhTaSection
                        ? 'bg-wine text-white border-wine font-bold'
                        : 'bg-paper text-ink border-line hover:bg-surface'
                    }`}
                  >
                    <span>pH و TA</span>
                    <span className="opacity-80 font-normal">
                      ({equipmentCapabilities.canMeasurePhDirectly
                        ? 'کیت pH فعال'
                        : 'فاقد کیت — اختیاری'})
                    </span>
                    {openPhTaSection ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setOpenFreeSo2Section((v) => !v)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1 cursor-pointer ${
                      openFreeSo2Section
                        ? 'bg-wine text-white border-wine font-bold'
                        : 'bg-paper text-ink border-line hover:bg-surface'
                    }`}
                  >
                    <span>سولفیت آزاد</span>
                    <span className="opacity-80 font-normal">
                      ({equipmentCapabilities.canMeasureFreeSo2Directly
                        ? 'کیت SO2 فعال'
                        : 'فاقد کیت ریپر — اختیاری'})
                    </span>
                    {openFreeSo2Section ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setOpenRefractSection((v) => !v)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1 cursor-pointer ${
                      openRefractSection
                        ? 'bg-wine text-white border-wine font-bold'
                        : 'bg-paper text-ink border-line hover:bg-surface'
                    }`}
                  >
                    <span>رفراکتومتر</span>
                    {openRefractSection ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setOpenTagsNoteSection((v) => !v)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1 cursor-pointer ${
                      openTagsNoteSection
                        ? 'bg-wine text-white border-wine font-bold'
                        : 'bg-paper text-ink border-line hover:bg-surface'
                    }`}
                  >
                    <span>برچسب‌ها و یادداشت</span>
                    {openTagsNoteSection ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* Collapsible 1: pH, TA & Room Temp */}
                {openPhTaSection && (
                  <div className="bg-paper border border-line rounded-2xl p-3 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div>
                        <label className="block text-xs font-bold text-ink mb-1">
                          اسیدیته فعال (pH):
                        </label>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => adjustPh(-0.02)}
                            className="min-h-[40px] px-2 rounded-lg bg-surface border border-line text-ink font-mono text-xs cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <input
                            type="text"
                            inputMode="decimal"
                            value={phInput}
                            onChange={(e) => {
                              setPhInput(e.target.value);
                              setHasExplicitPhInput(
                                e.target.value.trim().length > 0
                              );
                            }}
                            className="flex-1 min-h-[40px] bg-surface border border-line rounded-lg px-2 text-center text-sm font-mono font-bold text-ink"
                          />
                          <button
                            type="button"
                            onClick={() => adjustPh(0.02)}
                            className="min-h-[40px] px-2 rounded-lg bg-surface border border-line text-ink font-mono text-xs cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-ink mb-1">
                          اسیدیته کل (TA g/L):
                        </label>
                        <input
                          type="text"
                          inputMode="decimal"
                          value={taInput}
                          onChange={(e) => {
                            setTaInput(e.target.value);
                            setHasExplicitTaInput(
                              e.target.value.trim().length > 0
                            );
                          }}
                          placeholder="مثلاً 6.5"
                          className="w-full min-h-[40px] bg-surface border border-line rounded-lg px-2 text-center text-sm font-mono font-bold text-ink"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-ink mb-1">
                          دمای کارگاه (Room °C):
                        </label>
                        <input
                          type="text"
                          inputMode="decimal"
                          value={tempRoomInput}
                          onChange={(e) => {
                            const raw = e.target.value;
                            setTempRoomInput(raw);
                            if (!raw.trim()) {
                              setHasExplicitRoomTempInput(false);
                              return;
                            }
                            const v = normalizeEnologyNumericInput(
                              raw,
                              'general'
                            );
                            if (v !== null) {
                              setTempRoom(v);
                              setHasExplicitRoomTempInput(true);
                            }
                          }}
                          placeholder="مثلاً 21.0"
                          className="w-full min-h-[40px] bg-surface border border-line rounded-lg px-2 text-center text-sm font-mono font-bold text-ink"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Collapsible 2: Free SO2 */}
                {openFreeSo2Section && (
                  <div className="bg-paper border border-line rounded-2xl p-3 space-y-1.5">
                    <label className="block text-xs font-bold text-ink">
                      سولفیت آزاد اندازه‌گیری‌شده (Free SO₂ بر حسب mg/L):
                    </label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={freeSo2Input}
                      onChange={(e) => {
                        setFreeSo2Input(e.target.value);
                        setHasExplicitSo2Input(e.target.value.trim().length > 0);
                      }}
                      placeholder="مثلاً 38 (اختیاری)"
                      className="w-full min-h-[44px] bg-surface border border-line rounded-xl px-3 text-xs font-mono text-ink"
                    />
                  </div>
                )}

                {/* Collapsible 3: Refractometer */}
                {openRefractSection && (
                  <div className="bg-paper border border-line rounded-2xl p-3 space-y-2">
                    <label className="block text-xs font-bold text-ink">
                      قرائت رفراکتومتر نوری (اصلاح خطای الکل Sean Terrill):
                    </label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={refractBrixInput}
                      onChange={(e) => setRefractBrixInput(e.target.value)}
                      placeholder="مثلاً 10.5 (بریکس ظاهری رفراکتومتر)"
                      className="w-full min-h-[44px] bg-surface border border-line rounded-xl px-3 text-xs font-mono text-ink"
                    />
                    {refractResult && (
                      <div className="bg-surface border border-line rounded-xl p-2.5 text-xs text-ink space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-ink-soft">
                          <Info className="w-4 h-4 shrink-0" />
                          <span>
                            توضیح اطلاعاتی: الکل ضریب شکست نور را تغییر می‌دهد —
                            بدون کسر امتیاز
                          </span>
                        </div>
                        <div>
                          تخمین Sean Terrill: SG واقعی ≈{' '}
                          <span className="font-mono font-bold text-wine">
                            {refractResult.trueSG.toFixed(3)}
                          </span>{' '}
                          | الکل تخمینی ≈{' '}
                          <span className="font-mono font-bold text-wine">
                            {refractResult.abv.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Collapsible 4: Quick Sensory Tags & Note */}
                {openTagsNoteSection && (
                  <div className="bg-paper border border-line rounded-2xl p-3 space-y-2">
                    <label className="block text-xs font-bold text-ink">
                      برچسب‌های حسی سریع و یادداشت روزانه:
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {QUICK_SENSORY_TAGS.map((tag) => {
                        const active = selectedTags.includes(tag);
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => toggleQuickTag(tag)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer transition-all ${
                              active
                                ? 'bg-wine text-white border-wine font-bold'
                                : 'bg-surface text-ink border-line hover:bg-paper'
                            }`}
                          >
                            {tag}
                          </button>
                        );
                      })}
                    </div>
                    <input
                      type="text"
                      value={operationNote}
                      onChange={(e) => setOperationNote(e.target.value)}
                      placeholder="یادداشت تکمیلی کارگاه (اختیاری)..."
                      className="w-full min-h-[44px] bg-surface border border-line rounded-xl px-3 text-xs text-ink"
                    />
                  </div>
                )}

                {/* Provenance Preview Notice when pH is not explicitly measured today */}
                <div className="bg-paper border border-line rounded-xl px-3 py-2 text-xs flex items-center justify-between gap-2 flex-wrap">
                  <span
                    className={
                      hasExplicitPhInput
                        ? 'text-emerald-800 font-bold'
                        : 'text-ink-soft font-medium'
                    }
                  >
                    {hasExplicitPhInput
                      ? `pH: اندازه‌گیری‌شدهٔ امروز (${phInput})`
                      : 'pH: ثبت‌نشده امروز (استفاده از آخرین مقدار فقط برای حفظ پیوستگی رکورد)'}
                  </span>
                  {!hasExplicitPhInput && (
                    <button
                      type="button"
                      onClick={() => {
                        setOpenPhTaSection(true);
                        setHasExplicitPhInput(true);
                      }}
                      className="text-wine hover:underline font-bold cursor-pointer"
                    >
                      تأیید یا ویرایش pH امروز
                    </button>
                  )}
                </div>
              </div>

              {/* Submit Button (Disabled ONLY when SG input is empty; never blocked by soft range warnings) */}
              <button
                type="submit"
                disabled={!hasValidSGInput}
                className="w-full min-h-[52px] rounded-2xl bg-wine hover:opacity-95 disabled:bg-paper disabled:text-ink-soft disabled:border disabled:border-line disabled:cursor-not-allowed text-white text-sm font-bold flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-all"
              >
                <Save className="w-5 h-5" />
                <span>
                  {hasValidSGInput
                    ? 'ذخیره فوری در دفتر مخزن (۱۰ ثانیه‌ای)'
                    : 'ابتدا مقدار SG امروز را وارد یا انتخاب کنید'}
                </span>
              </button>
            </form>
          )}

          {/* MODE 2: ADDITION ('ثبت سریع افزودنی') */}
          {mode === 'addition' && (
            <form onSubmit={handleSaveAddition} className="space-y-4">
              <div className="bg-paper border border-line rounded-2xl p-3.5 space-y-3">
                <label className="block text-xs font-bold text-ink">
                  ۱. انتخاب ماده افزودنی شراب‌سازی:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {QUICK_COMPOUND_PRESETS.map((item) => (
                    <button
                      key={item.type}
                      type="button"
                      onClick={() => {
                        setSelectedCompoundType(item.type);
                        setRawAdditionAmount('');
                      }}
                      className={`p-2.5 rounded-xl border text-right text-xs font-bold cursor-pointer transition-all ${
                        selectedCompoundType === item.type
                          ? 'bg-wine text-white border-wine font-bold'
                          : 'bg-surface text-ink border-line hover:bg-paper'
                      }`}
                    >
                      {item.nameFa}
                    </button>
                  ))}
                </div>

                {/* Safe Empty Input + Gray Placeholder + Explicit Chip */}
                <div className="pt-2 border-t border-line space-y-2">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <label
                      htmlFor="quick-addition-amount"
                      className="text-xs font-bold text-ink"
                    >
                      ۲. مقدار توزین‌شده ({currentCompoundPreset.unit}):
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setRawAdditionAmount(
                          String(currentCompoundPreset.defaultDoseG)
                        )
                      }
                      className="px-2.5 py-1 rounded-lg bg-surface hover:bg-paper border border-line text-xs font-bold text-wine cursor-pointer"
                    >
                      {'استفاده از مقدار قبلی/پروتکل (' +
                        currentCompoundPreset.defaultDoseG +
                        ' ' +
                        currentCompoundPreset.unit +
                        ')'}
                    </button>
                  </div>
                  <input
                    id="quick-addition-amount"
                    type="text"
                    inputMode="decimal"
                    placeholder={
                      'آخرین مقدار شما: ' +
                      currentCompoundPreset.defaultDoseG +
                      ' ' +
                      currentCompoundPreset.unit
                    }
                    value={rawAdditionAmount}
                    onChange={(e) => setRawAdditionAmount(e.target.value)}
                    className="w-full min-h-[52px] bg-surface border-2 border-wine/60 rounded-xl px-3 text-center text-xl font-mono font-bold text-ink placeholder:text-ink-soft placeholder:text-xs"
                  />

                  {(() => {
                    if (
                      currentCompoundPreset.unit !== 'g' ||
                      parsedAdditionAmount === null ||
                      parsedAdditionAmount <= 0
                    ) {
                      return null;
                    }
                    const additionDosePlan = formatDoseForEquipment({
                      targetDoseGrams: parsedAdditionAmount,
                      compoundNameFa: currentCompoundPreset.nameFa,
                      compoundCategory:
                        selectedCompoundType === 'kms'
                          ? 'kms'
                          : selectedCompoundType === 'zinc'
                          ? 'zinc'
                          : selectedCompoundType === 'fermaid_o' ||
                            selectedCompoundType === 'fermaid_k' ||
                            selectedCompoundType === 'yeast' ||
                            selectedCompoundType === 'go_ferm'
                          ? 'fermaid_or_yeast'
                          : 'general',
                      profile: equipmentProfile
                    });
                    if (additionDosePlan.executionMode !== 'stock_syringe') {
                      return null;
                    }
                    return (
                      <div
                        data-testid="quick-addition-stock-syringe-hint"
                        className="rounded-xl border border-wine/30 bg-paper p-2.5 mt-2 text-xs text-ink"
                      >
                        {`راهنمای سرنگ استوک (متناسب با ترازوی ${scalePrecision}g شما): ${additionDosePlan.primaryDoseTextFa} — ${additionDosePlan.instructionFa}`}
                      </div>
                    );
                  })()}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <input
                    type="text"
                    value={additionLotNumber}
                    onChange={(e) => setAdditionLotNumber(e.target.value)}
                    placeholder="شماره بچ/لات ماده (اختیاری)..."
                    className="min-h-[42px] bg-surface border border-line rounded-xl px-3 text-xs text-ink"
                  />
                  <input
                    type="text"
                    value={additionNote}
                    onChange={(e) => setAdditionNote(e.target.value)}
                    placeholder="یادداشت اپراتور (اختیاری)..."
                    className="min-h-[42px] bg-surface border border-line rounded-xl px-3 text-xs text-ink"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={parsedAdditionAmount === null}
                className="w-full min-h-[52px] rounded-2xl bg-wine hover:opacity-95 disabled:bg-paper disabled:text-ink-soft disabled:border disabled:border-line disabled:cursor-not-allowed text-white text-sm font-bold flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-all"
              >
                <Sparkles className="w-5 h-5" />
                <span>
                  {parsedAdditionAmount !== null
                    ? 'ثبت فوری افزودنی در دفتر شیمیایی'
                    : 'ابتدا مقدار گرم افزودنی را وارد یا انتخاب کنید'}
                </span>
              </button>
            </form>
          )}

          {/* MODE 3: LAB ('ثبت سریع آزمایش') */}
          {mode === 'lab' && (
            <form onSubmit={handleSaveLabAnalysis} className="space-y-4">
              <div className="bg-paper border border-line rounded-2xl p-3.5 space-y-3">
                <label className="block text-xs font-bold text-ink">
                  ۱. انتخاب نوع آزمایش کنترل کیفیت:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {QUICK_LAB_PRESETS.map((item) => (
                    <button
                      key={item.testType}
                      type="button"
                      onClick={() => {
                        setSelectedLabTestType(item.testType);
                        setRawLabValue('');
                      }}
                      className={`p-2.5 rounded-xl border text-right text-xs font-bold cursor-pointer transition-all ${
                        selectedLabTestType === item.testType
                          ? 'bg-wine text-white border-wine font-bold'
                          : 'bg-surface text-ink border-line hover:bg-paper'
                      }`}
                    >
                      {item.titleFa}
                    </button>
                  ))}
                </div>

                {/* Safe Empty Input + Gray Placeholder + Explicit Chip */}
                <div className="pt-2 border-t border-line space-y-2">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <label
                      htmlFor="quick-lab-value"
                      className="text-xs font-bold text-ink"
                    >
                      ۲. نتیجه آزمایش ({currentLabPreset.unit}):
                    </label>
                    <button
                      type="button"
                      onClick={() => setRawLabValue(currentLabPreset.defaultVal)}
                      className="px-2.5 py-1 rounded-lg bg-surface hover:bg-paper border border-line text-xs font-bold text-wine cursor-pointer"
                    >
                      {'استفاده از مقدار قبلی/هدف (' +
                        currentLabPreset.defaultVal +
                        ')'}
                    </button>
                  </div>
                  <input
                    id="quick-lab-value"
                    type="text"
                    inputMode={
                      selectedLabTestType === 'mlf_chromatography'
                        ? 'text'
                        : 'decimal'
                    }
                    placeholder={
                      'آخرین مقدار شما: ' +
                      currentLabPreset.defaultVal +
                      ' ' +
                      currentLabPreset.unit
                    }
                    value={rawLabValue}
                    onChange={(e) => setRawLabValue(e.target.value)}
                    className="w-full min-h-[52px] bg-surface border-2 border-wine/60 rounded-xl px-3 text-center text-xl font-mono font-bold text-ink placeholder:text-ink-soft placeholder:text-xs"
                  />
                </div>

                <input
                  type="text"
                  value={labNote}
                  onChange={(e) => setLabNote(e.target.value)}
                  placeholder="توضیحات آزمایشگاهی (اختیاری)..."
                  className="w-full min-h-[42px] bg-surface border border-line rounded-xl px-3 text-xs text-ink"
                />
              </div>

              <button
                type="submit"
                disabled={!hasValidLabInput}
                className="w-full min-h-[52px] rounded-2xl bg-wine hover:opacity-95 disabled:bg-paper disabled:text-ink-soft disabled:border disabled:border-line disabled:cursor-not-allowed text-white text-sm font-bold flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-all"
              >
                <FlaskConical className="w-5 h-5" />
                <span>
                  {hasValidLabInput
                    ? 'ثبت فوری نتیجه در پرونده آزمایشگاه'
                    : 'ابتدا نتیجه آزمایش را وارد یا انتخاب کنید'}
                </span>
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );

  if (inlineMode) {
    return contentCard;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="شیت یکپارچه ثبت کارگاهی"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
    >
      {contentCard}
    </div>
  );
};

