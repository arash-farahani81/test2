import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity,
  Plus,
  Trash2,
  Thermometer,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Info,
  TrendingDown,
  Droplets,
  FileSpreadsheet,
  Printer,
  Sparkles,
  ShieldAlert,
  Zap,
  Compass,
  X,
  FlaskConical,
  Layers,
  Filter,
  FileText,
  Clock,
  Timer,
  Sliders,
  Gauge,
  Beaker,
  ClipboardCheck,
  BookOpen,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import type { FermentationLogEntry, TankId } from '../types/tracking.ts';
import type {
  ChemicalAddition,
  LabAnalysisRecord,
  StructuredCompoundType
} from '../types/database.ts';
import { BandedFermentationChartAndSO2Panel } from './BandedFermentationChartAndSO2Panel.tsx';
import { PhotoDiaryAndVintagePanel } from './PhotoDiaryAndVintagePanel.tsx';
import { exportDocxReport } from '../utils/exportDocxReport.ts';
import {
  calculateFermentationProgress,
  calculateAlcoholByVolume,
  brixToSpecificGravity,
  specificGravityToBrix,
  analyzeLogEntryHealth,
  compareRealLogsWithBenchmark,
  predictFermentationCompletion,
  sortFermentationLogs,
  calculateVelocity
} from '../utils/trackingCalculations.ts';
import { evaluateEnologicalScenario } from '../utils/enologyTroubleshooting.ts';
import { calculateDynamicSGTriggers, getTargetFreeSO2ByPH } from '../utils/enologyUtils.ts';
import { enologyDb } from '../db/enologyDatabase.ts';
import { useLocalStorageState } from '../utils/useLocalStorage.ts';
import { RASHA_PROTOCOL } from '../data/protocolData.ts';
import {
  useFlexibleProtocol,
  getEffectiveProtocolPlanForBatch
} from '../data/masterProtocolConfig.ts';
import {
  getSmartAdditivePresets,
  getSmartDailyStagePresets,
  getSmartLabPresets
} from '../data/smartLoggingPresets.ts';
import { useEnologyUi } from '../context/EnologyUiContext.tsx';
import { getCurrentPersianDateTimeStr } from '../utils/persianDate.ts';

interface FermentationTrackerProps {
  onNavigateToTestingGuide?: (
    testId?: string,
    subTab?: 'calculators-sops' | 'troubleshooting-crises' | 'saved-history'
  ) => void;
  onDataChanged?: () => void;
}

type LogbookTab = 'daily-logs' | 'chemical-additions' | 'lab-analyses' | 'sensory-eval';

interface DetectedTriggerInfo {
  id: string;
  title: string;
  description: string;
  warning?: string;
  hasChemicalDose: boolean;
  additionsToRecord: Array<{
    compoundName: string;
    compoundType?: StructuredCompoundType;
    amount: number;
    unit: 'g' | 'g/hL' | 'mg/L' | 'mL' | 'kg';
    stageTitle: string;
    purpose: string;
    pubchemCid?: number;
  }>;
}

export const FermentationTracker: React.FC<FermentationTrackerProps> = ({
  onNavigateToTestingGuide,
  onDataChanged
}) => {
  const ui = useEnologyUi();
  const {
    effectiveSingleTankId,
    setGlobalTankSelection,
    activeBatch,
    tankCount,
    dataVersion,
    notifyDataChanged
  } = ui;
  const { params: flexParams, plan: flexPlan, isModifiedFromIdeal } = useFlexibleProtocol();
  const batchPlan = useMemo(
    () => getEffectiveProtocolPlanForBatch(activeBatch, flexPlan),
    [activeBatch, flexPlan]
  );
  const [showFlexibleCustomizer, setShowFlexibleCustomizer] = useState<boolean>(false);

  const [tankId, setTankId] = useLocalStorageState<TankId>('enology_tracking_selected_tank', effectiveSingleTankId || 'tank-a');
  const currentBatchId =
    activeBatch?.id ?? (tankId === 'tank-rose' ? 'batch-rose-1403' : 'batch-rasha-1403');
  const defaultRefVol =
    tankId === 'tank-rose'
      ? batchPlan.volumes.roseClarifiedFermentL
      : batchPlan.volumes.redLiquidFermentPerTankL;

  useEffect(() => {
    if (effectiveSingleTankId && effectiveSingleTankId !== tankId) {
      setTankId(effectiveSingleTankId);
    } else if (tankCount === 1 && tankId === 'tank-b') {
      setTankId('tank-a');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveSingleTankId, tankCount]);

  const [logs, setLogs] = useState<FermentationLogEntry[]>(() =>
    enologyDb.getLogs(undefined, false, activeBatch?.id)
  );
  const [additions, setAdditions] = useState<ChemicalAddition[]>(() =>
    enologyDb.getAdditions(undefined, false, activeBatch?.id)
  );
  const [labAnalyses, setLabAnalyses] = useState<LabAnalysisRecord[]>(() =>
    enologyDb.getLabAnalyses(undefined, false, activeBatch?.id)
  );

  useEffect(() => {
    setLogs(enologyDb.getLogs(undefined, false, activeBatch?.id));
    setAdditions(enologyDb.getAdditions(undefined, false, activeBatch?.id));
    setLabAnalyses(enologyDb.getLabAnalyses(undefined, false, activeBatch?.id));
  }, [dataVersion, activeBatch?.id]);

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddChemicalModal, setShowAddChemicalModal] = useState(false);
  const [showAddLabModal, setShowAddLabModal] = useState(false);

  // Selection & View Modes
  const [selectedLogId, setSelectedLogId] = useLocalStorageState<string | null>('enology_tracking_selected_log_id', null);
  const [activeChart, setActiveChart] = useLocalStorageState<'sg' | 'temp' | 'ph' | 'all'>('enology_tracking_active_chart', 'sg');
  const [logDisplayMode, setLogDisplayMode] = useLocalStorageState<'all' | 'real' | 'benchmark'>('enology_log_display_mode', 'all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Unified Status Card & Progressive Disclosure
  const [localShowAllDetails, setLocalShowAllDetails] = useLocalStorageState<boolean>('enology_advisor_show_all', false);
  const showAllDetails = (ui as any)?.showAllDetails ?? localShowAllDetails;
  const setShowAllDetails = (ui as any)?.setShowAllDetails ?? setLocalShowAllDetails;

  const [expandedStatusRows, setExpandedStatusRows] = useState<{
    diagnosis: boolean;
    benchmark: boolean;
    prediction: boolean;
  }>({
    diagnosis: true,
    benchmark: false,
    prediction: false
  });

  const toggleStatusRow = (row: 'diagnosis' | 'benchmark' | 'prediction') => {
    setExpandedStatusRows((prev) => ({ ...prev, [row]: !prev[row] }));
  };

  const isRowExpanded = (row: 'diagnosis' | 'benchmark' | 'prediction') => {
    return showAllDetails || expandedStatusRows[row];
  };

  // Zone C: 4-Tab Unified Logbook State
  const [logbookTab, setLogbookTab] = useLocalStorageState<LogbookTab>('enology_logbook_active_tab', 'daily-logs');
  const [filterAdditionsByTank, setFilterAdditionsByTank] = useLocalStorageState<boolean>('enology_filter_additions_tank', true);
  const [filterLabByTank, setFilterLabByTank] = useLocalStorageState<boolean>('enology_filter_lab_tank', true);

  // Prediction Tool Simulation State
  const [simTemp, setSimTemp] = useLocalStorageState<number>('enology_prediction_sim_temp', 24.0);
  const [targetSGChoice, setTargetSGChoice] = useLocalStorageState<number>('enology_prediction_target_sg', tankId === 'tank-rose' ? 0.991 : 0.993);

  // Daily Log Form State (Persisted to LocalStorage)
  const [formDate, setFormDate] = useLocalStorageState<string>(
    'enology_form_date',
    getCurrentPersianDateTimeStr()
  );
  useEffect(() => {
    if (!formDate) {
      setFormDate(getCurrentPersianDateTimeStr());
    }
  }, [formDate, setFormDate]);
  const [formDay, setFormDay] = useLocalStorageState<number>('enology_form_day', 1);
  const [formStage, setFormStage] = useLocalStorageState<string>('enology_form_stage', '');
  const [formBrix, setFormBrix] = useLocalStorageState<number>('enology_form_brix', 20.0);
  const [formSG, setFormSG] = useLocalStorageState<number>('enology_form_sg', 1.083);
  const [formTempCap, setFormTempCap] = useLocalStorageState<number>('enology_form_temp_cap', 23.0);
  const [formTempRoom, setFormTempRoom] = useLocalStorageState<number>('enology_form_temp_room', 21.0);
  const [formPH, setFormPH] = useLocalStorageState<number>('enology_form_ph', 3.52);
  const [formTA, setFormTA] = useLocalStorageState<number>('enology_form_ta', 6.8);
  const [formFreeSO2, setFormFreeSO2] = useLocalStorageState<number | undefined>('enology_form_free_so2', undefined);
  const [formPigeage, setFormPigeage] = useLocalStorageState<boolean>('enology_form_pigeage', true);
  const [formPigeageCount, setFormPigeageCount] = useLocalStorageState<number>('enology_form_pigeage_count', 3);
  const [formNote, setFormNote] = useLocalStorageState<string>('enology_form_note', '');
  const [formIsTrigger, setFormIsTrigger] = useLocalStorageState<boolean>('enology_form_is_trigger', true);
  const [autoRecordTriggerAddition, setAutoRecordTriggerAddition] = useState<boolean>(true);
  const [formPhTouched, setFormPhTouched] = useState(false);
  const [formTaTouched, setFormTaTouched] = useState(false);

  // Chemical Addition Modal Form State
  const [selectedChemPresetId, setSelectedChemPresetId] = useState<string>('fermaid-o-sna1');
  const [chemTankId, setChemTankId] = useState<TankId>(tankId);
  const [chemTimestamp, setChemTimestamp] = useState<string>('');
  const [chemStageTitle, setChemStageTitle] = useState<string>('تغذیه مرحله‌ای / اصلاح شیمیایی');
  const [chemCompoundName, setChemCompoundName] = useState<string>('Fermaid O (نیتروژن ارگانیک)');
  const [chemCompoundType, setChemCompoundType] = useState<StructuredCompoundType>('fermaid_o');
  const [chemReferenceVolumeL, setChemReferenceVolumeL] = useState<number>(defaultRefVol);
  useEffect(() => {
    setChemReferenceVolumeL(defaultRefVol);
  }, [defaultRefVol]);
  const [chemPubchemCid, setChemPubchemCid] = useState<number | undefined>(undefined);
  const [chemAmount, setChemAmount] = useState<number>(33.0);
  const [chemUnit, setChemUnit] = useState<'g' | 'g/hL' | 'mg/L' | 'mL' | 'kg'>('g');
  const [chemPurpose, setChemPurpose] = useState<string>('تامین اسیدهای آمینه ارگانیک مخمر');
  const [chemNote, setChemNote] = useState<string>('');
  const [chemLotNumber, setChemLotNumber] = useState<string>('');
  const [pendingAdditionConfirm, setPendingAdditionConfirm] = useState<boolean>(false);
  const [undoAdditionId, setUndoAdditionId] = useState<string | null>(null);
  const [undoDeletedRecord, setUndoDeletedRecord] = useState<{
    type: 'log' | 'addition' | 'lab';
    id: string;
    label: string;
  } | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const undoDeleteTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Daily Log & Lab Analysis Preset Selector State
  const [selectedDailyPresetId, setSelectedDailyPresetId] = useState<string>('');
  const [selectedLabPresetId, setSelectedLabPresetId] = useState<string>('lab-ripper-so2');

  // Lab Analysis Modal Form State
  const [labTankId, setLabTankId] = useState<TankId>(tankId);
  const [labDate, setLabDate] = useState<string>('');
  const [labTestType, setLabTestType] = useState<LabAnalysisRecord['testType']>('ripper_so2');
  const [labAnalyte, setLabAnalyte] = useState<string>('سولفیت آزاد (Free SO2)');
  const [labValue, setLabValue] = useState<string>('32');
  const [labUnit, setLabUnit] = useState<string>('mg/L (ppm)');
  const [labActionTaken, setLabActionTaken] = useState<string>('در محدوده ایمن؛ نیازی به تزریق KMS نیست');
  const [labNotes, setLabNotes] = useState<string>('');

  // Organoleptic Sensory Evaluation Form State (Tab 4)
  const [sensoryClarity, setSensoryClarity] = useState<number>(5);
  const [sensoryAroma, setSensoryAroma] = useState<number>(4);
  const [sensoryAcidity, setSensoryAcidity] = useState<number>(4);
  const [sensoryTannin, setSensoryTannin] = useState<number>(4);
  const [sensoryOverall, setSensoryOverall] = useState<number>(4);
  const [sensoryFaults, setSensoryFaults] = useState<string[]>([]);
  const [sensoryNotes, setSensoryNotes] = useState<string>('');

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      if (undoDeleteTimerRef.current) clearTimeout(undoDeleteTimerRef.current);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
      toastTimerRef.current = null;
    }, 3500);
  };

  // Group and sort logs
  const allTankLogs = sortFermentationLogs(
    logs.filter((l) => l.tankId === tankId)
  );

  const benchmarkLogs = allTankLogs.filter((l) => l.isBenchmark === true);
  const realLogs = allTankLogs.filter((l) => l.isBenchmark !== true);

  const benchmarkComparison = compareRealLogsWithBenchmark(realLogs, benchmarkLogs, tankId);

  // Active logs for table display based on mode
  const currentTankLogs = (() => {
    if (logDisplayMode === 'real') {
      return realLogs.length > 0 ? realLogs : [];
    }
    if (logDisplayMode === 'benchmark') {
      return benchmarkLogs;
    }
    // 'all' mode
    return realLogs.length > 0 ? allTankLogs : benchmarkLogs;
  })();

  // Pure single-series logs for kinetic velocity & completion prediction (never mix benchmark & real)
  const operationalTankLogs = (() => {
    if (logDisplayMode === 'real') return realLogs;
    if (logDisplayMode === 'benchmark') return benchmarkLogs;
    return realLogs.length > 0 ? realLogs : benchmarkLogs;
  })();

  const initialLog = operationalTankLogs[0] || currentTankLogs[0];
  const latestLog = realLogs.length > 0
    ? realLogs[realLogs.length - 1]
    : currentTankLogs[currentTankLogs.length - 1] || currentTankLogs[0];
  const selectedLog = currentTankLogs.find((l) => l.id === selectedLogId) || latestLog;

  // Filtered Chemical Additions & Lab Analyses
  const displayedAdditions = filterAdditionsByTank
    ? additions.filter((a) => a.tankId === tankId)
    : additions;

  const displayedLabAnalyses = filterLabByTank
    ? labAnalyses.filter((a) => a.tankId === tankId)
    : labAnalyses;

  // Reference targets & Dynamic SG0 Triggers
  const targetInitialSG = initialLog ? initialLog.sg : (flexParams.initialSG || 1.092);
  const dynamicTriggers = calculateDynamicSGTriggers(targetInitialSG, {
    pressingPoint: flexPlan.triggers.pressingSG,
    drynessPoint: flexPlan.triggers.drynessSG
  });
  const targetFinalSG = tankId === 'tank-rose' ? 0.991 : flexPlan.triggers.drynessSG;
  const targetOptimalPH = tankId === 'tank-rose' ? flexParams.targetRosePH : flexParams.targetRedPH;

  const currentProgress = latestLog
    ? calculateFermentationProgress(latestLog.sg, targetInitialSG, targetFinalSG)
    : 0;

  const currentABV = latestLog
    ? calculateAlcoholByVolume(initialLog ? initialLog.sg : targetInitialSG, latestLog.sg)
    : 0;

  // Calculate Fermentation Velocity (with same-day timestampMs protection on unmixed series)
  const velocity = calculateVelocity(operationalTankLogs);

  // Smart Trigger Detector for Add Daily Log Modal (Dynamic based on SG0 and FlexibleProtocolPlan)
  const detectTriggerWindow = (sgVal: number, currentTank: TankId): DetectedTriggerInfo | null => {
    const isRose = currentTank === 'tank-rose';
    const d = flexPlan.dosages;
    const v = flexPlan.volumes;

    if (sgVal >= dynamicTriggers.sna1 - 0.003 && sgVal <= dynamicTriggers.sna1 + 0.003) {
      return {
        id: 'sna-1',
        title: `تریگر SNA-1 شناسایی شد (افت ۱۰٪ قند — SG ~ ${dynamicTriggers.sna1.toFixed(3)})`,
        description: isRose
          ? `تزریق تغذیه مرحله اول رُزه (${v.roseClarifiedFermentL}L): ${d.fermaidO1RoseG.toFixed(2)} g Fermaid O + ${d.zincRoseG.toFixed(2)} g Zinc (Wyeast) جهت جبران روی جذب‌شده توسط بنتونیت.`
          : `تزریق تغذیه مرحله اول قرمز (${v.redLiquidFermentPerTankL}L): ${d.fermaidO1RedPerTankG.toFixed(2)} g Fermaid O حل‌شده در آب ولرم پس از گاززدایی کلاهک.`,
        hasChemicalDose: true,
        additionsToRecord: isRose
          ? [
              {
                compoundName: 'Fermaid O (SNA-1 رُزه)',
                compoundType: 'fermaid_o',
                amount: d.fermaidO1RoseG,
                unit: 'g',
                stageTitle: `تریگر ۱ (SNA-1 در SG ${dynamicTriggers.sna1.toFixed(3)})`,
                purpose: `تغذیه نیتروژن آلی مرحله اول رُزه (${d.fermaidO1RoseG.toFixed(2)} g Fermaid O)`
              },
              {
                compoundName: 'مکمل روی (Wyeast Zinc - SNA-1 رُزه)',
                compoundType: 'zinc',
                amount: d.zincRoseG,
                unit: 'g',
                stageTitle: `تریگر ۱ (SNA-1 در SG ${dynamicTriggers.sna1.toFixed(3)})`,
                purpose: `جبران کاتیون روی جذب‌شده در شفاف‌سازی بنتونیت رُزه (${d.zincRoseG.toFixed(2)} g Zinc)`
              }
            ]
          : [
              {
                compoundName: 'مغذی مخمر Fermaid O (SNA-1)',
                compoundType: 'fermaid_o',
                amount: d.fermaidO1RedPerTankG,
                unit: 'g',
                stageTitle: `تریگر ۱ (SNA-1 در SG ${dynamicTriggers.sna1.toFixed(3)})`,
                purpose: `تغذیه نیتروژن آلی مرحله اول پس از افت ۱۰٪ قند (${d.fermaidO1RedPerTankG.toFixed(2)} g Fermaid O)`
              }
            ]
      };
    }

    if (sgVal >= dynamicTriggers.sna2 - 0.003 && sgVal <= dynamicTriggers.sna2 + 0.003) {
      return {
        id: 'sna-2',
        title: `تریگر SNA-2 شناسایی شد (افت ۲۵٪ قند — SG ~ ${dynamicTriggers.sna2.toFixed(3)} / سقف DAP: ${dynamicTriggers.oneThirdCeiling.toFixed(3)})`,
        description: isRose
          ? `تزریق تغذیه مرحله دوم رُزه (${v.roseClarifiedFermentL}L): ${d.fermaidK2RoseG.toFixed(2)} g Fermaid K + ${d.dap2RoseG.toFixed(2)} g DAP.`
          : `تزریق تغذیه مرحله دوم قرمز (${v.redLiquidFermentPerTankL}L): ${d.fermaidK2RedPerTankG.toFixed(2)} g Fermaid K + ${d.dap2RedPerTankG.toFixed(2)} g DAP + ${d.zincRedPerTankG.toFixed(2)} g Zinc.`,
        warning: `این آخرین پنجره مجاز برای مصرف DAP و Fermaid K است (سقف مطلق ۱/۳ قند = SG ${dynamicTriggers.oneThirdCeiling.toFixed(3)}). پس از این مرحله نیتروژن معدنی ممنوع است.`,
        hasChemicalDose: true,
        additionsToRecord: isRose
          ? [
              {
                compoundName: 'Fermaid K (SNA-2 رُزه)',
                compoundType: 'fermaid_k',
                amount: d.fermaidK2RoseG,
                unit: 'g',
                stageTitle: `تریگر ۲ (SNA-2 در SG ${dynamicTriggers.sna2.toFixed(3)})`,
                purpose: `تغذیه کمپلکس مرحله دوم رُزه در اوج تکثیر سلولی (${d.fermaidK2RoseG.toFixed(2)} g Fermaid K)`
              },
              {
                compoundName: 'دی‌آمونیوم فسفات DAP (SNA-2 رُزه)',
                compoundType: 'dap',
                amount: d.dap2RoseG,
                unit: 'g',
                pubchemCid: 24261,
                stageTitle: `تریگر ۲ (SNA-2 در SG ${dynamicTriggers.sna2.toFixed(3)})`,
                purpose: `تامین نیتروژن معدنی رُزه در ۱/۳ افت قند (${d.dap2RoseG.toFixed(2)} g DAP)`
              }
            ]
          : [
              {
                compoundName: 'Fermaid K (SNA-2 قرمز)',
                compoundType: 'fermaid_k',
                amount: d.fermaidK2RedPerTankG,
                unit: 'g',
                stageTitle: `تریگر ۲ (SNA-2 در SG ${dynamicTriggers.sna2.toFixed(3)})`,
                purpose: `تغذیه کمپلکس مرحله دوم قرمز در اوج تکثیر سلولی (${d.fermaidK2RedPerTankG.toFixed(2)} g Fermaid K)`
              },
              {
                compoundName: 'دی‌آمونیوم فسفات DAP (SNA-2 قرمز)',
                compoundType: 'dap',
                amount: d.dap2RedPerTankG,
                unit: 'g',
                pubchemCid: 24261,
                stageTitle: `تریگر ۲ (SNA-2 در SG ${dynamicTriggers.sna2.toFixed(3)})`,
                purpose: `تامین نیتروژن معدنی قرمز در ۱/۳ افت قند (${d.dap2RedPerTankG.toFixed(2)} g DAP)`
              },
              {
                compoundName: 'مکمل روی (Wyeast Zinc - SNA-2 قرمز)',
                compoundType: 'zinc',
                amount: d.zincRedPerTankG,
                unit: 'g',
                stageTitle: `تریگر ۲ (SNA-2 در SG ${dynamicTriggers.sna2.toFixed(3)})`,
                purpose: `کوآنزیم الکل دهیدروژناز و پیشگیری از H2S (${d.zincRedPerTankG.toFixed(2)} g Zinc)`
              }
            ]
      };
    }

    if (!isRose && sgVal >= dynamicTriggers.phase2Tannin - 0.001 && sgVal <= dynamicTriggers.phase2Tannin + 0.002) {
      return {
        id: 'tannin-2',
        title: `تریگر تانن فاز ۲ و جمع‌آوری هسته (SG ~ ${dynamicTriggers.phase2Tannin.toFixed(3)})`,
        description: `تزریق ${d.redTanninPhase2PerTankG.toFixed(2)} g تانن شراب قرمز (فاز ۲) در ${v.redLiquidFermentPerTankL} لیتر برای تثبیت کووالانسی رنگ + جمع‌آوری هسته‌های ته‌نشین‌شده از کف مخزن شیب‌دار.`,
        hasChemicalDose: true,
        additionsToRecord: [
          {
            compoundName: 'تانن شراب قرمز (فاز ۲)',
            compoundType: 'tannin_red',
            amount: d.redTanninPhase2PerTankG,
            unit: 'g',
            stageTitle: `تریگر رنگ فاز ۲ (در SG ${dynamicTriggers.phase2Tannin.toFixed(3)})`,
            purpose: `تثبیت کووالانسی آنتوسیانین‌های رنگ و ساختار مخملی (${d.redTanninPhase2PerTankG.toFixed(2)} g تانن شراب قرمز فاز ۲)`
          }
        ]
      };
    }

    if (sgVal >= dynamicTriggers.sna3 - 0.003 && sgVal <= dynamicTriggers.sna3 + 0.001) {
      return {
        id: 'sna-3',
        title: `تریگر نهایی SNA-3 شناسایی شد (افت ۱/۲ قند — SG ~ ${dynamicTriggers.sna3.toFixed(3)} — ۱۰۰٪ ارگانیک)`,
        description: isRose
          ? `تزریق تغذیه پایانی رُزه (${v.roseClarifiedFermentL}L): صرفاً ${d.fermaidO3RoseG.toFixed(2)} g Fermaid O (۱۰۰٪ نیتروژن ارگانیک — 0g DAP / Fermaid K).`
          : `تزریق تغذیه پایانی قرمز (${v.redLiquidFermentPerTankL}L): صرفاً ${d.fermaidO3RedPerTankG.toFixed(2)} g Fermaid O (۱۰۰٪ نیتروژن ارگانیک — 0g DAP / Fermaid K).`,
        warning: 'ممنوعیت مطلق بیوشیمیایی: در این سطح الکل (۶ تا ۷٪)، افزودن Fermaid K و DAP اکیداً ممنوع است (باعث رشد برتانومایسس و تشکیل اتیل کاربامات می‌شود).',
        hasChemicalDose: true,
        additionsToRecord: [
          {
            compoundName: 'مغذی مخمر Fermaid O (۱۰۰٪ ارگانیک - SNA-3)',
            compoundType: 'fermaid_o',
            amount: isRose ? d.fermaidO3RoseG : d.fermaidO3RedPerTankG,
            unit: 'g',
            stageTitle: `تریگر ۳ پایانی (SNA-3 در SG ${dynamicTriggers.sna3.toFixed(3)})`,
            purpose: isRose
              ? `سوخت استقامت نیمه قند رُزه با ۱۰۰٪ نیتروژن ارگانیک (${d.fermaidO3RoseG.toFixed(2)} g Fermaid O)`
              : `سوخت استقامت نیمه قند قرمز با ۱۰۰٪ نیتروژن ارگانیک (${d.fermaidO3RedPerTankG.toFixed(2)} g Fermaid O)`
          }
        ]
      };
    }

    if (!isRose && sgVal >= 1.006 && sgVal <= 1.009) {
      return {
        id: 'pressing-point',
        title: `نقطه طلایی پرسینگ شناسایی شد (SG = ${dynamicTriggers.pressingPoint.toFixed(3)} / بازه 1.006 تا 1.009)!`,
        description: `توقف کامل غوطه‌ورسازی (Pigeage)، خنک‌سازی فوری مخزن به 22°C، و جداسازی پوست: تفکیک ${v.freeRunPerTankL} لیتر شراب آب‌آزاد (Free-Run) در ظرف دوم زیر قفل هوا + ${v.heavyPressPerTankL} لیتر شراب پرس سنگین (Heavy Press) در گالن مجزا.`,
        hasChemicalDose: false,
        additionsToRecord: []
      };
    }

    if (sgVal <= 0.994) {
      return {
        id: 'dryness-point',
        title: 'خشکی کامل شراب (SG ≤ 0.994) شناسایی شد!',
        description: 'تایید قند احیاکننده زیر 2 g/L با قرص Clinitest ← خنک‌سازی به 15°C به مدت ۳۰ ساعت برای رسوب دُرد سنگین ← سیفون از روی دُرد غلیظ (Gross Lees) ← اجرای تست ۵ لیوانی سولفات مس (استوک ۲) و تزریق باکتیلس + KMS.',
        hasChemicalDose: false,
        additionsToRecord: []
      };
    }

    return null;
  };

  const detectedModalTrigger = detectTriggerWindow(Number(formSG), tankId);

  // Smart Operational Recommendation
  const getRecommendation = () => {
    if (!latestLog) return null;
    if (latestLog.tempCap >= 29.5) {
      return {
        level: 'danger',
        title: 'هشدار فوق بحرانی دمای کلاهک (۲۹.۵°C)!',
        text: 'دما به نقطه شکست غشای مخمر RC-212 رسیده است. فوراً ۳ بطری ۱.۵ لیتری آب یخ‌زده درون کلاهک قرار دهید و اتاق را خنک کنید.'
      };
    }
    if (latestLog.tempCap >= 28.5) {
      return {
        level: 'warning',
        title: 'هشدار سقف دمای کلاهک (۲۸.۵°C)',
        text: 'دمای کلاهک به آستانه خطر رسیده است. غوطه‌ورسازی ملایم انجام دهید یا بطری یخ زیر کلاهک قرار دهید.'
      };
    }
    if (latestLog.sg <= 0.994) {
      return {
        level: 'success',
        title: 'تخمیر کامل و خشکی تضمین‌شده (SG ≤ 0.994)',
        text: 'قندهای تخمیرپذیر کاملاً مصرف شده‌اند. Clinitest < 2 g/L را تایید کنید، ۳۰ ساعت در ۱۵ درجه سرد کنید، از روی دُرد سنگین سیفون زده و تست ۵ لیوانی سولفات مس را اجرا نمایید.'
      };
    }
    if (!(tankId === 'tank-rose') && latestLog.sg <= 1.009 && latestLog.sg >= 1.006) {
      return {
        level: 'success',
        title: 'نقطه طلایی پرسینگ (SG = 1.008 — بازه 1.006 تا 1.009)',
        text: `پیژاژ را متوقف کنید، مخزن را به 22°C خنک کرده و ${flexPlan.volumes.freeRunPerTankL} لیتر شراب آب‌آزاد (Free-Run) را از ${flexPlan.volumes.heavyPressPerTankL} لیتر پرس سنگین تفکیک نمایید.`
      };
    }
    return {
      level: 'normal',
      title: 'تخمیر طبیعی و در حال پیشرفت',
      text: `وزن مخصوص ${latestLog.sg} و بریکس ${latestLog.brix}°Bx در دمای مطلوب ${latestLog.tempCap}°C قرار دارند.`
    };
  };

  const recommendation = getRecommendation();

  const getCurrentPersianDateStr = () => getCurrentPersianDateTimeStr();

  // Helper to open Add Daily Log Modal with pre-filled smart data
  const handleOpenAddModal = () => {
    const nextDay = realLogs.length > 0
      ? realLogs[realLogs.length - 1].dayNumber + 1
      : 1;

    const nowStr = getCurrentPersianDateStr();
    const defaultSG = latestLog ? Math.max(0.992, Math.round((latestLog.sg - 0.012) * 1000) / 1000) : 1.083;

    setFormDate(nowStr);
    setFormDay(nextDay);
    setFormStage(`روز ${nextDay}: اندازه‌گیری واقعی کارگاه`);
    setFormSG(defaultSG);
    setFormBrix(specificGravityToBrix(defaultSG));
    setFormTempCap(latestLog ? latestLog.tempCap : 23.0);
    setFormTempRoom(latestLog ? latestLog.tempRoom : 21.0);
    setFormPH(latestLog ? latestLog.ph : targetOptimalPH);
    setFormTA(latestLog?.ta || 6.8);
    setFormFreeSO2(latestLog?.freeSO2);
    setFormPigeage(tankId !== 'tank-rose');
    setFormPigeageCount(3);
    setFormNote('');
    setFormIsTrigger(Boolean(detectTriggerWindow(defaultSG, tankId)));
    setAutoRecordTriggerAddition(true);
    setSelectedDailyPresetId('');
    setFormPhTouched(false);
    setFormTaTouched(false);
    setShowAddModal(true);
  };

  const inferStructuredCompoundType = (name: string, cid?: number): StructuredCompoundType => {
    const lower = name.toLowerCase();
    if (cid === 24446 || lower.includes('kms') || lower.includes('متابی') || lower.includes('سولفیت')) return 'kms';
    if (lower.includes('bactiless') || lower.includes('بکتی')) return 'bactiless';
    if (lower.includes('fermaid o')) return 'fermaid_o';
    if (lower.includes('fermaid k')) return 'fermaid_k';
    if (lower.includes('dap') || lower.includes('آمونیاک')) return 'dap';
    if (lower.includes('zinc') || lower.includes('روی')) return 'zinc';
    if (lower.includes('تانن سفید')) return 'tannin_white';
    if (lower.includes('تانن')) return 'tannin_red';
    if (lower.includes('آنزیم') || lower.includes('پکتین')) return 'enzyme';
    if (lower.includes('تارتاریک')) return 'tartaric';
    if (lower.includes('بی‌کربنات') || lower.includes('khco3')) return 'khco3';
    if (lower.includes('کربنات کلسیم') || lower.includes('caco3')) return 'caco3';
    if (lower.includes('مس') || lower.includes('copper')) return 'copper';
    if (lower.includes('کرم تارتار') || lower.includes('kht')) return 'kht';
    if (lower.includes('گلیسیرین')) return 'glycerin';
    if (lower.includes('اسکوربیک') || lower.includes('ویتامین c')) return 'ascorbic';
    if (lower.includes('پراکسید') || lower.includes('h2o2')) return 'h2o2';
    if (lower.includes('go-ferm')) return 'go_ferm';
    if (lower.includes('مخمر') || lower.includes('rc-212')) return 'yeast';
    if (lower.includes('بنتونیت')) return 'bentonite';
    return 'other';
  };

  const applyChemicalPreset = (presetId: string, targetTank: TankId) => {
    setSelectedChemPresetId(presetId);
    setPendingAdditionConfirm(false);
    const defaultVol =
      targetTank === 'tank-rose'
        ? batchPlan.volumes.roseClarifiedFermentL
        : batchPlan.volumes.redLiquidFermentPerTankL;
    setChemReferenceVolumeL(defaultVol);
    if (!presetId) return;
    const presets = getSmartAdditivePresets(batchPlan, targetTank);
    const found = presets.find((p) => p.id === presetId);
    if (found) {
      setChemStageTitle(found.stageTitle);
      setChemCompoundName(found.compoundName);
      setChemPubchemCid(found.pubchemCid);
      setChemAmount(found.amount);
      setChemUnit(found.unit);
      setChemPurpose(found.purpose);
      setChemCompoundType(inferStructuredCompoundType(found.compoundName, found.pubchemCid));
      if (found.id.includes('crush')) {
        setChemReferenceVolumeL(batchPlan.volumes.initialLiquidPerTankL);
      } else if (found.id.includes('day11')) {
        setChemReferenceVolumeL(batchPlan.volumes.rack1PerTankL);
      } else if (found.id.includes('bottling')) {
        setChemReferenceVolumeL(
          targetTank === 'tank-rose'
            ? batchPlan.volumes.roseFinalBottlingL
            : batchPlan.volumes.finalRedPerTankL
        );
      }
    }
  };

  const applyDailyStagePreset = (presetId: string) => {
    setSelectedDailyPresetId(presetId);
    if (!presetId) return;
    const presets = getSmartDailyStagePresets(flexPlan, tankId);
    const found = presets.find((p) => p.id === presetId);
    if (found) {
      setFormDay(found.dayNumber);
      setFormStage(found.stageTitle);
      setFormSG(found.sg);
      setFormBrix(found.brix);
      setFormTempCap(found.tempCap);
      setFormTempRoom(found.tempRoom);
      setFormPH(found.ph);
      setFormTA(found.ta);
      setFormFreeSO2(found.freeSO2);
      setFormPigeage(found.pigeageDone);
      setFormPigeageCount(found.pigeageCount);
      setFormNote(found.note);
      setFormIsTrigger(found.isTrigger || Boolean(detectTriggerWindow(found.sg, tankId)));
      setAutoRecordTriggerAddition(true);
    }
  };

  const applyLabPreset = (presetId: string, targetTank: TankId) => {
    setSelectedLabPresetId(presetId);
    if (!presetId) return;
    const presets = getSmartLabPresets(flexPlan, targetTank);
    const found = presets.find((p) => p.id === presetId);
    if (found) {
      setLabTestType(found.testType);
      setLabAnalyte(found.analyte);
      setLabValue(found.defaultValue);
      setLabUnit(found.unit);
      setLabActionTaken(found.actionTaken);
      setLabNotes(found.notes);
    }
  };

  const handleOpenAddChemicalModal = () => {
    setChemTankId(tankId);
    setChemTimestamp(getCurrentPersianDateStr());
    setChemNote('');
    setChemLotNumber('');
    applyChemicalPreset('fermaid-o-sna1', tankId);
    setShowAddChemicalModal(true);
  };

  const handleOpenAddLabModal = () => {
    setLabTankId(tankId);
    setLabDate(getCurrentPersianDateStr());
    applyLabPreset('lab-ripper-so2', tankId);
    setShowAddLabModal(true);
  };

  const handleBrixChange = (val: number) => {
    if (!Number.isFinite(val)) return;
    setFormBrix(val);
    const newSG = brixToSpecificGravity(val);
    setFormSG(newSG);
    if (detectTriggerWindow(newSG, tankId)) {
      setFormIsTrigger(true);
      setAutoRecordTriggerAddition(true);
    }
  };

  const handleSGChange = (val: number) => {
    if (!Number.isFinite(val)) return;
    setFormSG(val);
    setFormBrix(specificGravityToBrix(val));
    if (detectTriggerWindow(val, tankId)) {
      setFormIsTrigger(true);
      setAutoRecordTriggerAddition(true);
    }
  };

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    const nowMs = Date.now();
    const triggerMatch = detectTriggerWindow(Number(formSG), tankId);
    const shouldMarkTrigger = formIsTrigger || Boolean(triggerMatch && autoRecordTriggerAddition);

    const newEntry: FermentationLogEntry = {
      id: `log-${tankId}-real-${nowMs}`,
      batchId: currentBatchId,
      tankId,
      dayNumber: formDay,
      dateTime: formDate || 'ثبت واقعی کارگاه',
      timestampMs: nowMs,
      stageTitle:
        formStage ||
        (triggerMatch ? triggerMatch.title.split(' شناسایی')[0] : `روز ${formDay} - داده واقعی`),
      brix: Number(formBrix),
      sg: Number(formSG),
      tempCap: Number(formTempCap),
      tempRoom: Number(formTempRoom),
      ph: Number(formPH),
      phMeasured: formPhTouched,
      ta: formTA ? Number(formTA) : undefined,
      taMeasured: formTaTouched,
      freeSO2: formFreeSO2 !== undefined && formFreeSO2 !== null && formFreeSO2 >= 0 ? Number(formFreeSO2) : undefined,
      freeSO2Measured: formFreeSO2 !== undefined && formFreeSO2 >= 0,
      pigeageDone: formPigeage,
      pigeageCount: formPigeage ? formPigeageCount : 0,
      operationNote:
        formNote ||
        (triggerMatch && autoRecordTriggerAddition ? triggerMatch.description : ''),
      isTriggerPoint: shouldMarkTrigger,
      isBenchmark: false
    };

    enologyDb.addLog(newEntry);
    setLogs(enologyDb.getLogs(undefined, false, activeBatch?.id));

    // If a dosing trigger matched and auto-record is checked, record the ChemicalAddition(s) in enologyDb
    if (triggerMatch && autoRecordTriggerAddition && triggerMatch.additionsToRecord.length > 0) {
      triggerMatch.additionsToRecord.forEach((addItem) => {
        enologyDb.addAddition({
          batchId: currentBatchId,
          tankId,
          dayNumber: formDay,
          timestampMs: nowMs,
          timestamp: formDate || getCurrentPersianDateStr(),
          stageTitle: addItem.stageTitle,
          compoundName: addItem.compoundName,
          compoundType:
            addItem.compoundType ??
            inferStructuredCompoundType(addItem.compoundName, addItem.pubchemCid),
          referenceVolumeL: defaultRefVol,
          sgAtAddition: Number(formSG),
          pubchemCid: addItem.pubchemCid,
          amount: addItem.amount,
          unit: addItem.unit,
          purpose: addItem.purpose,
          operatorNote: `ثبت خودکار همزمان با لاگ روزانه (SG = ${formSG}${formPigeage ? `، پیژاژ ${formPigeageCount} بار` : ''})`
        });
      });
      setAdditions(enologyDb.getAdditions(undefined, false, activeBatch?.id));
      showToast('لاگ روزانه و دوز شیمیایی نقطه تریگر به صورت همزمان در دیتابیس ثبت شدند.');
    } else {
      showToast('اندازه‌گیری واقعی کارگاه با موفقیت در پایگاه داده ثبت شد.');
    }

    notifyDataChanged();
    onDataChanged?.();
    setShowAddModal(false);
    setSelectedLogId(newEntry.id);
  };

  const handleAddChemicalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingAdditionConfirm) {
      setPendingAdditionConfirm(true);
      return;
    }
    const resolvedBatchId =
      activeBatch?.id ?? (chemTankId === 'tank-rose' ? 'batch-rose-1403' : 'batch-rasha-1403');
    const created = enologyDb.addAddition({
      batchId: resolvedBatchId,
      tankId: chemTankId,
      dayNumber: latestLog?.dayNumber ?? formDay,
      timestampMs: Date.now(),
      timestamp: chemTimestamp || getCurrentPersianDateStr(),
      stageTitle: chemStageTitle,
      compoundName: chemCompoundName,
      compoundType: chemCompoundType,
      referenceVolumeL: Number(chemReferenceVolumeL) > 0 ? Number(chemReferenceVolumeL) : defaultRefVol,
      sgAtAddition: latestLog?.sg,
      pubchemCid: chemPubchemCid,
      amount: Number(chemAmount),
      unit: chemUnit,
      purpose: chemPurpose,
      operatorNote: chemNote || undefined,
      lotNumber: chemLotNumber || undefined,
      isDemo: false
    });
    setAdditions(enologyDb.getAdditions(undefined, false, activeBatch?.id));
    setPendingAdditionConfirm(false);
    setShowAddChemicalModal(false);
    setLogbookTab('chemical-additions');
    setUndoAdditionId(created.id);
    setTimeout(() => {
      setUndoAdditionId((curr) => (curr === created.id ? null : curr));
    }, 10000);
    notifyDataChanged();
    onDataChanged?.();
    showToast('افزودنی شیمیایی جدید با موفقیت در لاگ‌شیت ۳ ثبت شد.');
  };

  const handleUndoRecentAddition = () => {
    if (!undoAdditionId) return;
    enologyDb.softDeleteAddition(undoAdditionId);
    setAdditions(enologyDb.getAdditions(undefined, false, activeBatch?.id));
    setUndoAdditionId(null);
    notifyDataChanged();
    onDataChanged?.();
    showToast('ثبت افزودنی با موفقیت بازگردانی (Undo) شد.');
  };

  const triggerUndoableDelete = (record: {
    type: 'log' | 'addition' | 'lab';
    id: string;
    label: string;
  }) => {
    setUndoDeletedRecord(record);
    if (undoDeleteTimerRef.current) {
      clearTimeout(undoDeleteTimerRef.current);
    }
    undoDeleteTimerRef.current = setTimeout(() => {
      setUndoDeletedRecord((curr) => (curr?.id === record.id ? null : curr));
      undoDeleteTimerRef.current = null;
    }, 10000);
  };

  const handleRestoreDeletedRecord = () => {
    if (!undoDeletedRecord) return;
    if (undoDeleteTimerRef.current) {
      clearTimeout(undoDeleteTimerRef.current);
      undoDeleteTimerRef.current = null;
    }
    if (undoDeletedRecord.type === 'log') {
      enologyDb.restoreLog(undoDeletedRecord.id);
      setLogs(enologyDb.getLogs(undefined, false, activeBatch?.id));
    } else if (undoDeletedRecord.type === 'addition') {
      enologyDb.restoreAddition(undoDeletedRecord.id);
      setAdditions(enologyDb.getAdditions(undefined, false, activeBatch?.id));
    } else if (undoDeletedRecord.type === 'lab') {
      enologyDb.restoreLabAnalysis(undoDeletedRecord.id);
      setLabAnalyses(enologyDb.getLabAnalyses(undefined, false, activeBatch?.id));
    }
    setUndoDeletedRecord(null);
    notifyDataChanged();
    onDataChanged?.();
    showToast('رکورد حذف‌شده با موفقیت بازیابی شد.');
  };

  const handleDeleteAddition = (id: string) => {
    enologyDb.softDeleteAddition(id);
    setAdditions(enologyDb.getAdditions(undefined, false, activeBatch?.id));
    triggerUndoableDelete({ type: 'addition', id, label: 'رکورد افزودنی شیمیایی' });
    notifyDataChanged();
    onDataChanged?.();
    showToast('رکورد افزودنی شیمیایی حذف شد (امکان بازگردانی تا ۱۰ ثانیه).');
  };

  const handleAddLabSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const resolvedBatchId =
      activeBatch?.id ?? (labTankId === 'tank-rose' ? 'batch-rose-1403' : 'batch-rasha-1403');
    enologyDb.addLabAnalysis({
      batchId: resolvedBatchId,
      tankId: labTankId,
      dayNumber: latestLog?.dayNumber ?? formDay,
      timestampMs: Date.now(),
      date: labDate || getCurrentPersianDateStr(),
      testType: labTestType,
      targetAnalyte: labAnalyte,
      measuredValue: labValue,
      unit: labUnit,
      actionTaken: labActionTaken || undefined,
      notes: labNotes || undefined
    });
    setLabAnalyses(enologyDb.getLabAnalyses(undefined, false, activeBatch?.id));
    setShowAddLabModal(false);
    setLogbookTab('lab-analyses');
    notifyDataChanged();
    onDataChanged?.();
    showToast('نتیجه تست آزمایشگاهی با موفقیت در پایگاه داده ثبت شد.');
  };

  const handleDeleteLabAnalysis = (id: string) => {
    enologyDb.softDeleteLabAnalysis(id);
    setLabAnalyses(enologyDb.getLabAnalyses(undefined, false, activeBatch?.id));
    triggerUndoableDelete({ type: 'lab', id, label: 'رکورد تست آزمایشگاهی' });
    notifyDataChanged();
    onDataChanged?.();
    showToast('رکورد تست آزمایشگاهی حذف شد (امکان بازگردانی تا ۱۰ ثانیه).');
  };

  const handleDeleteLog = (id: string) => {
    enologyDb.softDeleteLog(id);
    setLogs(enologyDb.getLogs(undefined, false, activeBatch?.id));
    if (selectedLogId === id) setSelectedLogId(null);
    triggerUndoableDelete({ type: 'log', id, label: 'رکورد لاگ روزانه' });
    notifyDataChanged();
    onDataChanged?.();
    showToast('رکورد لاگ روزانه حذف شد (امکان بازگردانی تا ۱۰ ثانیه).');
  };

  const handleClearRealLogs = () => {
    if (
      typeof window !== 'undefined' &&
      !window.confirm('آیا از پاک‌سازی لاگ‌های واقعی این مخزن مطمئن هستید؟')
    ) {
      return;
    }
    enologyDb.clearRealLogs(tankId, activeBatch?.id);
    setLogs(enologyDb.getLogs(undefined, false, activeBatch?.id));
    setSelectedLogId(null);
    notifyDataChanged();
    onDataChanged?.();
    showToast('داده‌های واقعی این مخزن پاک شدند و برنامه به منحنی مرجع ایده‌آل بازگشت.');
  };

  const handleResetData = () => {
    if (
      typeof window !== 'undefined' &&
      !window.confirm('آیا از بازنشانی کل داده‌های پایش به مقادیر پیش‌فرض مطمئن هستید؟')
    ) {
      return;
    }
    enologyDb.resetLogsToDefault();
    setLogs(enologyDb.getLogs(undefined, false, activeBatch?.id));
    setSelectedLogId(null);
    notifyDataChanged();
    onDataChanged?.();
    showToast('کل داده‌های پایش به مقادیر پیش‌فرض پایگاه داده بازنشانی شدند.');
  };

  const handleExportCSV = () => {
    const headers = [
      'نوع رکورد',
      'شناسه مخزن',
      'شماره روز',
      'تاریخ و ساعت',
      'مرحله / تریگر',
      'وزن مخصوص (SG)',
      'بریکس (°Bx)',
      'دمای کلاهک (°C)',
      'دمای اتاق (°C)',
      'pH',
      'غوطه‌ورسازی',
      'توضیحات'
    ];

    const rows = currentTankLogs.map((l) => [
      l.isBenchmark ? 'الگوی مرجع ایده‌آل' : 'ثبت واقعی کارگاه',
      l.tankId,
      l.dayNumber,
      `"${l.dateTime}"`,
      `"${l.stageTitle}"`,
      l.sg,
      l.brix,
      l.tempCap,
      l.tempRoom,
      l.ph,
      l.pigeageDone ? `بله (${l.pigeageCount || 1} بار)` : 'خیر',
      `"${l.operationNote || ''}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `enology_logsheet_${tankId}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportDocx = async () => {
    try {
      showToast('در حال آماده‌سازی و ساخت گزارش Word (DOCX) طبق مستر پروتکل...');
      await exportDocxReport({
        tankId,
        batchId: activeBatch?.id,
        logs,
        additions: enologyDb.getAdditions(undefined, false, activeBatch?.id),
        analyses: enologyDb.getLabAnalyses(undefined, false, activeBatch?.id),
        batchName:
          activeBatch?.name ??
          (tankId === 'tank-rose'
            ? 'بچ شماره ۲: رزه سینه‌ای رشه سردشت (۳۶ لیتر)'
            : 'بچ شماره ۱: انگور رشه سردشت (۴۰۰ کیلوگرم استاندارد)'),
        vintageYear: activeBatch?.vintageYear ?? 1403
      });
      showToast('فایل DOCX گزارش جامع با موفقیت دانلود شد.');
    } catch (err) {
      console.error(err);
      showToast('خطا در تولید فایل Word.');
    }
  };

  // SVG dimensions & effective day spacing helper (prevents vertical overlaps on same-day logs)
  const chartW = 680;
  const chartH = 225;
  const paddingX = 50;
  const paddingY = 35;
  const plotW = chartW - 2 * paddingX;

  const computeEffectiveDays = (entries: FermentationLogEntry[]): number[] => {
    const countsByDay = new Map<number, number>();
    entries.forEach((e) => {
      countsByDay.set(e.dayNumber, (countsByDay.get(e.dayNumber) || 0) + 1);
    });
    const seenByDay = new Map<number, number>();
    return entries.map((e) => {
      const totalOnDay = countsByDay.get(e.dayNumber) || 1;
      const idxOnDay = seenByDay.get(e.dayNumber) || 0;
      seenByDay.set(e.dayNumber, idxOnDay + 1);
      if (totalOnDay <= 1) return e.dayNumber;
      return e.dayNumber + (idxOnDay / totalOnDay) * 0.65;
    });
  };

  const benchEffectiveDays = computeEffectiveDays(benchmarkLogs);
  const realEffectiveDays = computeEffectiveDays(realLogs);

  const tankLabel =
    tankId === 'tank-a'
      ? `مخزن قرمز A (${flexPlan.volumes.redLiquidFermentPerTankL}L)`
      : tankId === 'tank-b'
      ? `مخزن قرمز B (${flexPlan.volumes.redLiquidFermentPerTankL}L)`
      : `مخزن رُزه (${flexPlan.volumes.roseClarifiedFermentL}L)`;

  return (
    <div className="space-y-6 font-['Vazirmatn',sans-serif]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-surface text-ink px-5 py-2.5 rounded-full shadow-lg text-xs font-bold flex items-center gap-2 border border-line">
          <Sparkles className="w-4 h-4 text-emerald-700" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 10-Second Soft-Delete Undo Banner */}
      {undoDeletedRecord && (
        <div className="bg-amber-50 text-amber-950 px-4 py-2.5 rounded-xl border border-amber-300 shadow-xs flex items-center justify-between gap-3 text-xs font-bold">
          <span>
            {undoDeletedRecord.label} حذف شد. تا ۱۰ ثانیه امکان بازگردانی وجود دارد.
          </span>
          <button
            type="button"
            onClick={handleRestoreDeletedRecord}
            className="px-3 py-1 rounded-lg bg-surface hover:bg-paper border border-amber-300 text-amber-950 font-bold cursor-pointer flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>بازگردانی (Undo)</span>
          </button>
        </div>
      )}

      {/* ===================================================================== */}
      {/* ZONE A: CONTROL BAR, TANK SWITCHER, QUICK MODALS & 5 KPI CARDS        */}
      {/* ===================================================================== */}
      <div className="bg-surface text-ink p-5 rounded-2xl border border-line shadow-sm space-y-4">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-bold text-ink">
                پایش روزانه، نمودارهای سینتیک و دفتر کل ثبت‌های کارگاه
              </h2>
              <span className="text-xs text-ink-soft">·</span>
              <span className="text-xs font-bold text-emerald-800">
                {realLogs.length > 0
                  ? `داده‌های واقعی فعال (${realLogs.length} لاگ در ${tankLabel})`
                  : 'نمایش منحنی الگوی مرجع ایده‌آل (منتظر اولین ثبت واقعی)'}
              </span>
            </div>
            <p className="text-xs text-ink-soft">
              پایش همزمان وزن مخصوص (SG)، دمای کلاهک و pH همراه با تشخیص خودکار نقاط تریگر تغذیه (SNA) و دفتر کل ۴ تبی مخزن
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap no-print">
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="px-3.5 py-2 bg-wine hover:opacity-95 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>ثبت لاگ روزانه تخمیر</span>
            </button>

            <button
              type="button"
              onClick={handleOpenAddChemicalModal}
              className="px-3.5 py-2 bg-paper hover:bg-surface border border-line text-ink rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap"
            >
              <Beaker className="w-3.5 h-3.5 text-wine" />
              <span>ثبت افزودنی شیمیایی</span>
            </button>

            <button
              type="button"
              onClick={handleOpenAddLabModal}
              className="px-3.5 py-2 bg-paper hover:bg-surface border border-line text-ink rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap"
            >
              <FlaskConical className="w-3.5 h-3.5 text-wine" />
              <span>ثبت تست آزمایشگاه</span>
            </button>

            {onNavigateToTestingGuide && (
              <button
                type="button"
                onClick={() => onNavigateToTestingGuide()}
                className="px-3 py-2 bg-paper hover:bg-surface text-ink rounded-xl text-xs font-bold flex items-center gap-1.5 border border-line cursor-pointer transition-colors whitespace-nowrap"
                title="مشاهده راهنمای گام‌به‌گام انجام تست‌ها و ماشین‌حساب‌های آزمایشگاهی"
              >
                <BookOpen className="w-3.5 h-3.5 text-wine" />
                <span>آزمایشگاه و ماشین‌حساب‌ها</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleExportDocx}
              className="px-3 py-2 bg-paper hover:bg-surface text-ink rounded-xl text-xs font-bold flex items-center gap-1.5 border border-line cursor-pointer transition-colors whitespace-nowrap"
              title="خروجی گزارش جامع با فرمت Word (DOCX)"
            >
              <FileText className="w-3.5 h-3.5 text-wine" />
              <span>گزارش Word (DOCX)</span>
            </button>

            <button
              type="button"
              onClick={handleExportCSV}
              className="px-3 py-2 bg-paper hover:bg-surface text-ink rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-line cursor-pointer whitespace-nowrap"
              title="خروجی فایل اکسل با فرمت CSV"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
              <span>اکسل (CSV)</span>
            </button>

            {realLogs.length > 0 && (
              <button
                type="button"
                onClick={handleClearRealLogs}
                className="px-3 py-2 bg-red-50 hover:bg-red-100 text-danger rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-danger/30 cursor-pointer whitespace-nowrap"
                title="پاک‌سازی داده‌های واقعی این مخزن و بازگشت به منحنی ایده‌آل"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>پاک‌سازی لاگ‌های واقعی</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleResetData}
              className="px-2.5 py-2 bg-paper hover:bg-surface text-ink-soft hover:text-ink rounded-xl text-xs font-semibold flex items-center gap-1 border border-line cursor-pointer whitespace-nowrap"
              title="بازنشانی کل داده‌ها"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>بازنشانی</span>
            </button>
          </div>
        </div>

        {/* Tank Selector Tabs & Display Mode Filter */}
        <div className="flex items-center justify-between gap-2 pt-3 border-t border-line flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-ink-soft ml-1">انتخاب مخزن پایش:</span>
            <button
              type="button"
              onClick={() => {
                setTankId('tank-a');
                setGlobalTankSelection('tank-a');
                setSelectedLogId(null);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                tankId === 'tank-a'
                  ? 'bg-wine text-white shadow-xs'
                  : 'bg-paper text-ink hover:bg-surface border border-line'
              }`}
            >
              <span>مخزن قرمز A (بچ اول {flexPlan.volumes.redLiquidFermentPerTankL}L)</span>
              <span className="text-xs bg-black/10 px-1.5 py-0.5 rounded font-mono tabular-nums">
                {logs.filter((l) => l.tankId === 'tank-a').length}
              </span>
            </button>
            {tankCount !== 1 && (
              <button
                type="button"
                onClick={() => {
                  setTankId('tank-b');
                  setGlobalTankSelection('tank-b');
                  setSelectedLogId(null);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  tankId === 'tank-b'
                    ? 'bg-wine text-white shadow-xs'
                    : 'bg-paper text-ink hover:bg-surface border border-line'
                }`}
              >
                <span>مخزن قرمز B (بچ دوم {flexPlan.volumes.redLiquidFermentPerTankL}L)</span>
                <span className="text-xs bg-black/10 px-1.5 py-0.5 rounded font-mono tabular-nums">
                  {logs.filter((l) => l.tankId === 'tank-b').length}
                </span>
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setTankId('tank-rose');
                setGlobalTankSelection('tank-rose');
                setSelectedLogId(null);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                tankId === 'tank-rose'
                  ? 'bg-wine text-white shadow-xs'
                  : 'bg-paper text-ink hover:bg-surface border border-line'
              }`}
            >
              <span>مخزن شراب رُزه ({flexPlan.volumes.roseClarifiedFermentL}L)</span>
              <span className="text-xs bg-black/10 px-1.5 py-0.5 rounded font-mono tabular-nums">
                {logs.filter((l) => l.tankId === 'tank-rose').length}
              </span>
            </button>
          </div>

          {/* Display Mode Filters */}
          <div className="flex items-center gap-1 bg-paper p-1 rounded-xl border border-line text-xs">
            <span className="text-ink-soft px-2 text-xs font-semibold flex items-center gap-1">
              <Filter className="w-3 h-3" />
              <span>فیلتر نمایش:</span>
            </span>
            <button
              type="button"
              onClick={() => setLogDisplayMode('all')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                logDisplayMode === 'all' ? 'bg-wine text-white' : 'text-ink-soft hover:text-ink'
              }`}
            >
              همه ({allTankLogs.length})
            </button>
            <button
              type="button"
              onClick={() => setLogDisplayMode('real')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                logDisplayMode === 'real' ? 'bg-wine text-white' : 'text-ink-soft hover:text-ink'
              }`}
            >
              فقط واقعی من ({realLogs.length})
            </button>
            <button
              type="button"
              onClick={() => setLogDisplayMode('benchmark')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                logDisplayMode === 'benchmark' ? 'bg-wine text-white' : 'text-ink-soft hover:text-ink'
              }`}
            >
              فقط مرجع ایده‌آل ({benchmarkLogs.length})
            </button>
          </div>
        </div>
      </div>

      {/* 5 KPI Cards */}
      {latestLog && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          <div className="bg-surface p-4 rounded-2xl border border-line shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-paper text-wine border border-line flex items-center justify-center shrink-0">
              <TrendingDown className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-ink-soft font-semibold">وزن مخصوص و بریکس</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg sm:text-xl font-bold text-ink font-mono tabular-nums">
                  {latestLog.sg}
                </span>
                <span className="text-xs text-ink-soft font-mono tabular-nums">({latestLog.brix}°Bx)</span>
              </div>
            </div>
          </div>

          <div className="bg-surface p-4 rounded-2xl border border-line shadow-xs flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                latestLog.tempCap >= 29.5
                  ? 'bg-red-50 text-danger border-danger/30'
                  : latestLog.tempCap >= 28.5
                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                  : 'bg-paper text-ink border-line'
              }`}
            >
              <Thermometer className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-ink-soft font-semibold">دمای فعلی کلاهک</p>
              <div className="flex items-baseline gap-1.5">
                <span
                  className={`text-lg sm:text-xl font-bold font-mono tabular-nums ${
                    latestLog.tempCap >= 28.5 ? 'text-danger' : 'text-ink'
                  }`}
                >
                  {latestLog.tempCap}°C
                </span>
                <span className="text-xs text-ink-soft font-mono tabular-nums">(اتاق: {latestLog.tempRoom}°)</span>
              </div>
            </div>
          </div>

          <div className="bg-surface p-4 rounded-2xl border border-line shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-paper text-wine border border-line flex items-center justify-center shrink-0">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-ink-soft font-semibold">شاخص اسیدیته pH</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg sm:text-xl font-bold text-ink font-mono tabular-nums">
                  {latestLog.ph}
                </span>
                <span className="text-xs text-ink-soft font-mono tabular-nums">
                  (هدف: {targetOptimalPH})
                </span>
              </div>
            </div>
          </div>

          <div className="bg-surface p-4 rounded-2xl border border-line shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-ink-soft font-semibold">پیشرفت تخمیر</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg sm:text-xl font-bold text-emerald-900 font-mono tabular-nums">
                  {currentProgress}٪
                </span>
                <span className="text-xs text-ink-soft">
                  {currentProgress >= 100 ? 'کاملاً خشک' : 'فعال'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-surface p-4 rounded-2xl border border-line shadow-xs flex items-center gap-3 col-span-2 lg:col-span-1">
            <div className="w-10 h-10 rounded-xl bg-paper text-wine border border-line flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-ink-soft font-semibold">الکل تقریبی حاصله</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg sm:text-xl font-bold text-wine font-mono tabular-nums">
                  {currentABV}٪
                </span>
                <span className="text-xs text-ink-soft">ABV</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Zone A: Live Cumulative OIV SO2 Ledger Strip */}
      {(() => {
        const so2RefVolL = tankId === 'tank-rose' ? flexPlan.volumes.roseClarifiedFermentL : flexPlan.volumes.redLiquidFermentPerTankL;
        const so2Ledger = enologyDb.getCumulativeSO2Ledger(
          tankId,
          so2RefVolL,
          undefined,
          undefined,
          !enologyDb.hasDemoData(),
          activeBatch?.id
        );
        const isCaution = so2Ledger.remainingBudgetMgL < 25 && !so2Ledger.isOverBudget;
        return (
          <div className="bg-surface text-ink p-3.5 rounded-2xl border border-line shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-paper text-wine flex items-center justify-center shrink-0 border border-line">
                <FlaskConical className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-xs sm:text-sm text-ink">
                    دفتر کل سولفیت تجمعی (Live OIV Total SO₂ Ledger)
                  </h4>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      so2Ledger.isOverBudget
                        ? 'bg-red-50 text-danger border border-danger/30'
                        : isCaution
                        ? 'bg-amber-50 text-amber-900 border border-amber-300'
                        : 'bg-emerald-50 text-emerald-900 border border-emerald-300'
                    }`}
                  >
                    {so2Ledger.isOverBudget
                      ? 'عبور از سقف OIV'
                      : isCaution
                      ? 'نزدیک به سقف مجاز'
                      : 'محدوده ایمن OIV'}
                  </span>
                </div>
                <p className="text-xs text-ink-soft mt-0.5">
                  حجم مبنا: {so2RefVolL} لیتر | سقف قانونی OIV: {so2Ledger.legalCeilingMgL} mg/L (نرخ پیوند و تبخیر تخمینی: {Math.round(so2Ledger.estimatedBoundAndVolatilizedRatio * 100)}٪)
                </p>
                <p className="text-xs text-ink-soft mt-0.5">
                  {so2Ledger.accountingBasisFa}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 text-xs font-mono tabular-nums">
              <div className="bg-paper px-3 py-1.5 rounded-xl border border-line text-right shrink-0">
                <span className="text-xs text-ink-soft block font-sans">تزریق KMS</span>
                <strong className="text-ink font-bold">{so2Ledger.addedFromKmsMgL} mg/L</strong>
              </div>
              <div className="bg-paper px-3 py-1.5 rounded-xl border border-line text-right shrink-0">
                <span className="text-xs text-ink-soft block font-sans">درون‌زای مخمر</span>
                <strong className="text-ink font-bold">{so2Ledger.endogenousYeastMgL} mg/L</strong>
              </div>
              <div className="bg-paper px-3 py-1.5 rounded-xl border border-line text-right shrink-0">
                <span className="text-xs text-ink-soft block font-sans">کل تجمعی</span>
                <strong className="text-wine font-bold">{so2Ledger.estimatedTotalSO2MgL} mg/L</strong>
              </div>
              <div className="bg-paper px-3 py-1.5 rounded-xl border border-line text-right shrink-0">
                <span className="text-xs text-ink-soft block font-sans">حاشیه باقی‌مانده</span>
                <strong className="text-emerald-800 font-bold">{so2Ledger.remainingBudgetMgL} mg/L</strong>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Operational Recommendation / Crisis Alert Banner */}
      {recommendation && (
        <div
          className={`p-4 rounded-2xl border flex items-start gap-3.5 transition-all ${
            recommendation.level === 'danger'
              ? 'bg-red-50 border-danger text-ink shadow-xs'
              : recommendation.level === 'warning'
              ? 'bg-amber-50 border-amber-300 text-amber-950'
              : recommendation.level === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
              : 'bg-surface border-line text-ink'
          }`}
        >
          {recommendation.level === 'danger' ? (
            <ShieldAlert className="w-6 h-6 text-danger shrink-0 mt-0.5" />
          ) : recommendation.level === 'warning' ? (
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          ) : recommendation.level === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          ) : (
            <Compass className="w-5 h-5 text-ink-soft shrink-0 mt-0.5" />
          )}
          <div className="text-xs sm:text-sm space-y-1">
            <strong className="font-bold block">{recommendation.title}</strong>
            <p className="leading-relaxed opacity-95">{recommendation.text}</p>
            {velocity !== null && (
              <p className="text-xs font-mono tabular-nums font-semibold pt-1 border-t border-black/10 mt-1">
                سرعت تخمیر اخیر: افت {velocity} واحد SG در هر روز تخمیر (نرمال مطلوب: 0.008 تا 0.018)
              </p>
            )}
          </div>
        </div>
      )}

      {/* 10-Second Undo Banner for Chemical Additions (Idea 11) */}
      {undoAdditionId && (
        <div className="bg-surface text-ink border border-emerald-300 rounded-2xl p-3 shadow-xs flex items-center justify-between gap-3">
          <span className="text-xs font-bold text-emerald-900">
            افزودنی شیمیایی با موفقیت ثبت شد. در صورت اشتباه می‌توانید تا ۱۰ ثانیه آن را بازگردانی کنید.
          </span>
          <button
            type="button"
            onClick={handleUndoRecentAddition}
            className="px-3.5 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>افزودنی ثبت شد — بازگردانی (۱۰ ثانیه)</span>
          </button>
        </div>
      )}

      {/* ===================================================================== */}
      {/* UNIFIED STATUS CARD (Top of Tank Dashboard — 3 Collapsible Rows)       */}
      {/* ===================================================================== */}
      {(() => {
        const activeLog = selectedLog || latestLog;
        const analysis = activeLog ? analyzeLogEntryHealth(activeLog, tankId, additions, flexPlan) : null;
        void getTargetFreeSO2ByPH;
        const scenarioEval = activeLog ? evaluateEnologicalScenario({
          batchVolumeL: (tankId === 'tank-rose' ? flexPlan.volumes.roseClarifiedFermentL : flexPlan.volumes.redLiquidFermentPerTankL),
          currentSG: activeLog.sg,
          currentBrix: activeLog.brix,
          tempCapC: activeLog.tempCap,
          ph: activeLog.phMeasured === false ? (tankId === 'tank-rose' ? flexPlan.params.targetRosePH : flexPlan.params.targetRedPH) : activeLog.ph,
          ta: activeLog.taMeasured === false ? (tankId === 'tank-rose' ? 6.8 : 6.5) : (activeLog.ta || 6.8),
          freeSO2: activeLog.freeSO2 !== undefined && activeLog.freeSO2Measured !== false ? activeLog.freeSO2 : 0,
          dayNumber: activeLog.dayNumber,
          isRose: tankId === 'tank-rose'
        }) : null;
        const prediction = predictFermentationCompletion(operationalTankLogs, tankId, targetSGChoice, simTemp);

        return (
          <div className="bg-surface rounded-xl border border-line shadow-xs overflow-hidden space-y-0">
            {/* Header: Title, Health Score Badge, and Expand/Collapse All Button */}
            <div className="bg-paper text-ink border-b border-line p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-surface text-wine border border-line flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-ink text-sm sm:text-base">
                      کارت وضعیت جامع مخزن ({tankLabel})
                    </h3>
                    {analysis && (
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                        analysis.statusColor === 'emerald'
                          ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                          : analysis.statusColor === 'amber'
                          ? 'bg-amber-50 text-amber-900 border-amber-300'
                          : 'bg-red-50 text-danger border-danger'
                      }`}>
                        {analysis.statusBadge} ({analysis.healthScore}٪)
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-ink-soft mt-0.5">
                    تشخیص بیوشیمیایی لاگ فعال، تطبیق با الگوی ایده‌آل و پیش‌بینی سینتیک اتمام تخمیر
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowAllDetails(!showAllDetails)}
                className="text-xs font-bold text-ink bg-surface hover:bg-paper px-3 py-1.5 rounded-xl border border-line transition-colors cursor-pointer self-start sm:self-center shrink-0 flex items-center gap-1.5"
              >
                {showAllDetails ? (
                  <>
                    <ChevronUp className="w-3.5 h-3.5 text-wine" />
                    <span>بستن همه بخش‌ها</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3.5 h-3.5 text-ink-soft" />
                    <span>نمایش یکجای هر ۳ بخش</span>
                  </>
                )}
              </button>
            </div>

            <div className="divide-y divide-line">
              {/* ----------------------------------------------------------- */}
              {/* ROW 1: DIAGNOSIS (تشخیص و عیب‌یابی لاگ انتخابی)              */}
              {/* ----------------------------------------------------------- */}
              <div className="transition-colors">
                <button
                  type="button"
                  onClick={() => toggleStatusRow('diagnosis')}
                  className="w-full text-right p-4 sm:p-4.5 flex items-center justify-between gap-3 bg-stone-50/80 hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="w-2 h-2 rounded-full bg-rose-600" />
                    <strong className="text-stone-900 font-bold text-xs sm:text-sm">
                      ۱. تشخیص وضعیت فعلی (Diagnosis)
                    </strong>
                    {activeLog && (
                      <span className="text-stone-500 text-xs">
                        — لاگ {activeLog.stageTitle} (روز {activeLog.dayNumber})
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {analysis && (
                      <span className={`text-xs font-bold px-2 py-0.5 rounded border ${
                        analysis.statusColor === 'emerald'
                          ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                          : analysis.statusColor === 'amber'
                          ? 'bg-amber-50 text-amber-900 border-amber-300'
                          : 'bg-rose-50 text-rose-900 border-rose-300'
                      }`}>
                        نمره سلامت: {analysis.healthScore}٪
                      </span>
                    )}
                    {isRowExpanded('diagnosis') ? (
                      <ChevronUp className="w-4 h-4 text-stone-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-stone-500" />
                    )}
                  </div>
                </button>

                {isRowExpanded('diagnosis') && activeLog && analysis && (
                  <div className="p-4 sm:p-5 space-y-3.5 text-xs bg-white">
                    {/* Parameter Evaluation Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {analysis.parameters.map((param, i) => (
                        <div key={i} className="bg-stone-50 p-2.5 rounded-xl border border-stone-200 space-y-1">
                          <div className="flex items-center justify-between font-bold">
                            <span className="text-stone-700 text-xs">{param.paramName}:</span>
                            <span className="font-mono tabular-nums text-stone-900">{param.value}</span>
                          </div>
                          <div className="text-xs text-stone-500 flex justify-between">
                            <span>هدف:</span>
                            <span className="font-mono">{param.targetRange}</span>
                          </div>
                          <p className="text-xs text-stone-700 pt-1 border-t border-stone-200 leading-normal">
                            {param.note}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="bg-rose-50/60 border border-rose-200 p-3 rounded-xl space-y-1 text-stone-800">
                      <strong className="font-bold text-rose-950 block">تشخیص بیوشیمیایی تخمیر:</strong>
                      <p className="leading-relaxed">{analysis.detailedDescription}</p>
                    </div>

                    <div className="bg-emerald-50/80 border border-emerald-200 p-3 rounded-xl space-y-1 text-emerald-950">
                      <strong className="font-bold block">توصیه و اقدام اجرایی بعدی:</strong>
                      <p className="font-bold leading-relaxed">{analysis.recommendedAction}</p>
                    </div>

                    {scenarioEval && scenarioEval.actions.length > 0 && (
                      <div className="bg-amber-50/80 border border-amber-300 p-3.5 rounded-xl space-y-2.5">
                        <div className="flex items-center justify-between border-b border-amber-200 pb-1.5">
                          <strong className="font-bold text-amber-950">
                            فرمول اصلاحی اختصاصی ({scenarioEval.actions.length} مورد):
                          </strong>
                          <span className="text-xs font-mono text-amber-900">
                            حجم: {(tankId === 'tank-rose' ? flexPlan.volumes.roseClarifiedFermentL : flexPlan.volumes.redLiquidFermentPerTankL)}L
                          </span>
                        </div>

                        {scenarioEval.actions.map((act, aIdx) => (
                          <div key={aIdx} className="bg-white p-2.5 rounded-lg border border-amber-200 space-y-1.5">
                            <div className="flex items-center justify-between">
                              <strong className="text-stone-900 font-bold">{act.title}</strong>
                              <span className="text-xs font-bold text-rose-800">
                                {act.severity === 'danger' ? 'مداخله فوری' : 'هشدار انحراف'}
                              </span>
                            </div>
                            {act.calculatedRecipe && act.calculatedRecipe.length > 0 && (
                              <div className="bg-stone-50 p-2 rounded border border-stone-200 space-y-1">
                                {act.calculatedRecipe.map((rec, rIdx) => (
                                  <div key={rIdx} className="flex justify-between items-center text-rose-950 font-bold">
                                    <span>• {rec.item}:</span>
                                    <span className="font-mono tabular-nums font-bold text-rose-900">
                                      {rec.amount} {rec.unit}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ----------------------------------------------------------- */}
              {/* ROW 2: BENCHMARK (مقایسه با الگوی مرجع)                       */}
              {/* ----------------------------------------------------------- */}
              <div className="transition-colors">
                <button
                  type="button"
                  onClick={() => toggleStatusRow('benchmark')}
                  className="w-full text-right p-4 sm:p-4.5 flex items-center justify-between gap-3 bg-stone-50/80 hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="w-2 h-2 rounded-full bg-indigo-600" />
                    <strong className="text-stone-900 font-bold text-xs sm:text-sm">
                      ۲. مقایسه با الگوی مرجع (Benchmark)
                    </strong>
                    <span className="text-indigo-800 text-xs">
                      {benchmarkComparison.statusBadge}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {benchmarkComparison.hasRealLogs && (
                      <>
                        <span className="font-mono tabular-nums font-bold bg-indigo-50 text-indigo-900 border border-indigo-200 text-xs px-2 py-0.5 rounded-lg">
                          مصرف قند: {benchmarkComparison.sugarDepletionPct}٪
                        </span>
                        <span className="font-mono tabular-nums font-bold bg-wine text-white text-xs px-2.5 py-0.5 rounded-lg">
                          انطباق: {benchmarkComparison.alignmentScore}٪
                        </span>
                      </>
                    )}
                    {isRowExpanded('benchmark') ? (
                      <ChevronUp className="w-4 h-4 text-stone-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-stone-500" />
                    )}
                  </div>
                </button>

                {isRowExpanded('benchmark') && (
                  <div className="p-4 sm:p-5 space-y-3.5 text-xs bg-white">
                    {benchmarkComparison.hasRealLogs ? (
                      <>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                          <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                            <span className="text-stone-500 block text-xs">انحراف SG با الگو:</span>
                            <strong className="font-mono tabular-nums text-sm font-bold text-stone-900">
                              {benchmarkComparison.sgDelta > 0 ? `+${benchmarkComparison.sgDelta}` : benchmarkComparison.sgDelta}
                            </strong>
                          </div>
                          <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                            <span className="text-stone-500 block text-xs">انحراف دمای کلاهک:</span>
                            <strong className="font-mono tabular-nums text-sm font-bold text-rose-800">
                              {benchmarkComparison.tempDelta > 0 ? `+${benchmarkComparison.tempDelta}` : benchmarkComparison.tempDelta}°C
                            </strong>
                          </div>
                          <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                            <span className="text-stone-500 block text-xs">انحراف بریکس:</span>
                            <strong className="font-mono tabular-nums text-sm font-bold text-indigo-900">
                              {benchmarkComparison.brixDelta > 0 ? `+${benchmarkComparison.brixDelta}` : benchmarkComparison.brixDelta}°Bx
                            </strong>
                          </div>
                          <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                            <span className="text-stone-500 block text-xs">انحراف اسیدیته (pH):</span>
                            <strong className="font-mono tabular-nums text-sm font-bold text-purple-900">
                              {benchmarkComparison.phDelta > 0 ? `+${benchmarkComparison.phDelta}` : benchmarkComparison.phDelta}
                            </strong>
                          </div>
                        </div>

                        <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-stone-800 space-y-1">
                          <strong className="font-bold text-indigo-950 block">تحلیل مقایسه‌ای:</strong>
                          <p className="leading-relaxed">{benchmarkComparison.comparisonDetails}</p>
                        </div>

                        <div className="bg-paper text-ink p-3 rounded-xl border border-line space-y-1">
                          <strong className="font-bold block text-wine">راهکار انطباق کامل با الگو:</strong>
                          <p className="leading-relaxed text-ink">{benchmarkComparison.actionableGuidance}</p>
                        </div>
                      </>
                    ) : (
                      <div className="bg-paper p-4 rounded-xl border border-line text-ink-soft space-y-1 leading-relaxed">
                        <strong className="text-ink block">هنوز داده واقعی ثبت نشده است</strong>
                        <p>{benchmarkComparison.comparisonDetails}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ----------------------------------------------------------- */}
              {/* ROW 3: PREDICTION (پیش‌بینی پایان و شبیه‌ساز حرارتی)          */}
              {/* ----------------------------------------------------------- */}
              <div className="transition-colors">
                <button
                  type="button"
                  onClick={() => toggleStatusRow('prediction')}
                  className="w-full text-right p-4 sm:p-4.5 flex items-center justify-between gap-3 bg-paper/70 hover:bg-paper transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    <strong className="text-ink font-bold text-xs sm:text-sm">
                      ۳. پیش‌بینی زمان پایان تخمیر (Prediction)
                    </strong>
                    <span className="text-ink-soft text-xs">
                      {prediction.kineticStatusFa}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono tabular-nums font-bold bg-surface text-ink border border-line text-xs px-2.5 py-0.5 rounded-lg">
                      {prediction.estimatedRemainingDays <= 0 ? 'تکمیل شده' : `${prediction.estimatedRemainingDays} روز باقی‌مانده`}
                    </span>
                    {isRowExpanded('prediction') ? (
                      <ChevronUp className="w-4 h-4 text-ink-soft" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-ink-soft" />
                    )}
                  </div>
                </button>

                {isRowExpanded('prediction') && (
                  <div className="p-4 sm:p-5 space-y-3.5 text-xs bg-surface">
                    <div className="flex items-center justify-between gap-2 bg-paper text-ink border border-line p-3 rounded-xl flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <Timer className="w-4 h-4 text-wine" />
                        <span className="font-bold">هدف نقطه پایانی تخمیر:</span>
                      </div>
                      <div className="flex items-center gap-1 bg-surface p-1 rounded-lg border border-line text-xs">
                        <button
                          type="button"
                          onClick={() => setTargetSGChoice(tankId === 'tank-rose' ? 0.991 : 0.993)}
                          className={`px-2 py-0.5 rounded font-bold cursor-pointer ${
                            targetSGChoice <= 1.000 ? 'bg-wine text-white' : 'text-ink-soft'
                          }`}
                        >
                          خشکی ({tankId === 'tank-rose' ? '0.991' : '0.993'})
                        </button>
                        <button
                          type="button"
                          onClick={() => setTargetSGChoice(1.008)}
                          className={`px-2 py-0.5 rounded font-bold cursor-pointer ${
                            targetSGChoice === 1.008 ? 'bg-wine text-white' : 'text-ink-soft'
                          }`}
                        >
                          پرسینگ (1.008)
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                      <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 space-y-1">
                        <span className="text-stone-500 text-xs flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-rose-700" />
                          <span>زمان باقی‌مانده:</span>
                        </span>
                        <div className="text-lg font-bold font-mono tabular-nums text-rose-900">
                          {prediction.estimatedRemainingDays <= 0 ? 'تکمیل شده!' : `${prediction.estimatedRemainingDays} روز`}
                        </div>
                        <span className="text-xs font-mono text-stone-500 block">
                          (~ {prediction.estimatedRemainingHours} ساعت)
                        </span>
                        {prediction.estimatedDaysRange && prediction.estimatedRemainingDays > 0 && (
                          <span className="text-xs font-bold text-indigo-800 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded block mt-1">
                            بازه عدم‌قطعیت: {prediction.estimatedDaysRange.min} تا {prediction.estimatedDaysRange.max} روز
                          </span>
                        )}
                      </div>

                      <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 space-y-1">
                        <span className="text-stone-500 text-xs flex items-center gap-1">
                          <TrendingDown className="w-3.5 h-3.5 text-amber-700" />
                          <span>سرعت افت قند:</span>
                        </span>
                        <div className="text-lg font-bold font-mono tabular-nums text-amber-900">
                          {prediction.recentVelocityPerDay}
                        </div>
                        <span className="text-xs text-stone-500 block">
                          واحد SG در روز (باقی‌مانده: {prediction.sgRemaining.toFixed(3)})
                        </span>
                      </div>

                      <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 space-y-1">
                        <span className="text-stone-500 text-xs flex items-center gap-1">
                          <Gauge className="w-3.5 h-3.5 text-emerald-700" />
                          <span>وضعیت بیولوژیکی:</span>
                        </span>
                        <div className="font-bold text-emerald-900">
                          {prediction.kineticStatusFa}
                        </div>
                        <p className="text-xs text-stone-600 leading-normal">
                          {prediction.kineticAdviceFa}
                        </p>
                      </div>

                      <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 space-y-1">
                        <span className="text-stone-500 text-xs flex items-center gap-1">
                          <Thermometer className="w-3.5 h-3.5 text-blue-700" />
                          <span>ضریب شتاب دمایی ({simTemp}°C):</span>
                        </span>
                        <div className="text-lg font-bold font-mono tabular-nums text-blue-900">
                          {prediction.tempKineticFactor}x
                        </div>
                        <p className="text-xs text-stone-600 leading-normal">
                          {prediction.tempImpactDescription}
                        </p>
                      </div>
                    </div>

                    {prediction.isOutOfModelBounds && (
                      <div className="p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-950 text-xs font-bold flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                        <div>
                          <span className="block font-bold">هشدار خروج از دامنه خطی مدل سینتیک آرنیوس/Q10:</span>
                          <span>{prediction.tempImpactDescription}</span>
                        </div>
                      </div>
                    )}

                    {/* Interactive What-If Temperature Slider */}
                    <div className="bg-stone-100 p-3.5 rounded-xl border border-stone-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-stone-800 flex items-center gap-1.5">
                          <Sliders className="w-3.5 h-3.5 text-rose-700" />
                          <span>شبیه‌ساز دمای کارگاه (What-If):</span>
                        </label>
                        <strong className="font-mono tabular-nums text-rose-800 text-sm">{simTemp}°C</strong>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-stone-500 font-mono">18°C</span>
                        <input
                          type="range"
                          min="18"
                          max="30"
                          step="0.5"
                          value={simTemp}
                          onChange={(e) => setSimTemp(parseFloat(e.target.value))}
                          className="w-full h-2 bg-stone-300 rounded-lg appearance-none cursor-pointer accent-rose-700"
                        />
                        <span className="text-xs text-stone-500 font-mono">30°C</span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-stone-600 pt-1">
                        <span>تاثیر تغییر دما بر زمان پایان تخمیر</span>
                        {latestLog && (
                          <button
                            type="button"
                            onClick={() => setSimTemp(latestLog.tempCap)}
                            className="text-rose-800 font-bold underline cursor-pointer"
                          >
                            بازنشانی به {latestLog.tempCap}°C
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Dual SO2 Budget vs Free SO2 Gauge + Banded Fermentation SVG Chart (Ideas 3 & 8) */}
      <BandedFermentationChartAndSO2Panel
        tankId={tankId}
        logs={logs}
        additions={additions}
        labAnalyses={labAnalyses}
      />

      {/* ===================================================================== */}
      {/* ZONE B: FULL-WIDTH ANALYTICAL FERMENTATION CHARTS                     */}
      {/* ===================================================================== */}
      <div className="w-full bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-rose-700" />
                <h3 className="font-bold text-stone-900 text-sm sm:text-base">
                  نمودارهای تحلیلی روند تخمیر ({tankLabel})
                </h3>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                خط نقطه‌چین ارغوانی: الگوی مرجع ایده‌آل | خط ممتد قرمز: داده‌های واقعی ثبت‌شده شما
              </p>
            </div>

            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl flex-wrap">
              <button
                type="button"
                onClick={() => setActiveChart('sg')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all whitespace-nowrap ${
                  activeChart === 'sg' ? 'bg-white text-rose-900 shadow-xs' : 'text-stone-600'
                }`}
              >
                افت قند (SG/Brix)
              </button>
              <button
                type="button"
                onClick={() => setActiveChart('temp')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all whitespace-nowrap ${
                  activeChart === 'temp' ? 'bg-white text-rose-900 shadow-xs' : 'text-stone-600'
                }`}
              >
                پروفایل دما
              </button>
              <button
                type="button"
                onClick={() => setActiveChart('ph')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all whitespace-nowrap ${
                  activeChart === 'ph' ? 'bg-white text-rose-900 shadow-xs' : 'text-stone-600'
                }`}
              >
                پایداری pH
              </button>
              <button
                type="button"
                onClick={() => setActiveChart('all')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all whitespace-nowrap ${
                  activeChart === 'all' ? 'bg-white text-rose-900 shadow-xs' : 'text-stone-600'
                }`}
              >
                نمای ۳ نمودار
              </button>
            </div>
          </div>

          {/* Selected Point Inspection Card */}
          {selectedLog && (
            <div className="bg-stone-50 border border-stone-200/90 p-3 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-stone-900 text-sm">{selectedLog.stageTitle}</span>
                  <span className="text-stone-400">·</span>
                  <span className="font-mono text-stone-600 text-xs">{selectedLog.dateTime}</span>
                  <span className="text-stone-400">·</span>
                  <span className={`text-xs font-bold ${
                    selectedLog.isBenchmark ? 'text-purple-800' : 'text-emerald-800'
                  }`}>
                    {selectedLog.isBenchmark ? 'الگوی مرجع' : 'ثبت واقعی کارگاه'}
                  </span>
                  {selectedLog.isTriggerPoint && (
                    <span className="text-amber-800 font-bold text-xs">
                      · نقطه تریگر طلایی
                    </span>
                  )}
                </div>
                <p className="text-stone-600 leading-relaxed">
                  {selectedLog.operationNote || 'ثبت عادی بدون رویداد خاص'}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0 font-mono tabular-nums text-xs bg-white p-2.5 rounded-lg border border-stone-200">
                <div>
                  <span className="text-stone-400 block text-xs font-['Vazirmatn']">SG / Brix</span>
                  <strong className="text-rose-900">{selectedLog.sg}</strong> ({selectedLog.brix}°)
                </div>
                <div>
                  <span className="text-stone-400 block text-xs font-['Vazirmatn']">دمای کلاهک</span>
                  <strong className={selectedLog.tempCap >= 28.5 ? 'text-rose-700' : 'text-stone-800'}>
                    {selectedLog.tempCap}°C
                  </strong>
                </div>
                <div>
                  <span className="text-stone-400 block text-xs font-['Vazirmatn']">pH / TA</span>
                  <strong className="text-purple-900">{selectedLog.ph}</strong>
                  {selectedLog.ta && ` (${selectedLog.ta})`}
                </div>
                <div>
                  <span className="text-stone-400 block text-xs font-['Vazirmatn']">پیژاژ</span>
                  <span className={selectedLog.pigeageDone ? 'text-emerald-700 font-bold' : 'text-stone-400'}>
                    {selectedLog.pigeageDone ? `${selectedLog.pigeageCount || 1} بار` : 'ندارد'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* SVG Chart Container */}
          <div className="overflow-x-auto pt-1">
            {currentTankLogs.length > 0 ? (
              <div className="min-w-[560px] bg-stone-50/70 p-3.5 rounded-xl border border-stone-200/80">
                {activeChart !== 'all' ? (
                  <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-auto overflow-visible font-['Vazirmatn',sans-serif]">
                    {/* Grid lines */}
                    <line x1={paddingX} y1={paddingY} x2={chartW - 20} y2={paddingY} stroke="#E2E8F0" strokeDasharray="3 3" />
                    <line x1={paddingX} y1={chartH / 2} x2={chartW - 20} y2={chartH / 2} stroke="#E2E8F0" strokeDasharray="3 3" />
                    <line x1={paddingX} y1={chartH - paddingY} x2={chartW - 20} y2={chartH - paddingY} stroke="#CBD5E1" strokeWidth="1.5" />

                    {/* CHART 1: SG & BRIX DECAY */}
                    {activeChart === 'sg' && (() => {
                      const minSG = 0.990;
                      const maxSG = 1.095;
                      const maxDay = Math.max(
                        ...benchEffectiveDays,
                        ...realEffectiveDays,
                        9
                      );

                      const getX = (day: number) => paddingX + (day / maxDay) * plotW;
                      const getSGY = (sgVal: number) =>
                        chartH - paddingY - ((sgVal - minSG) / (maxSG - minSG)) * (chartH - 2 * paddingY);

                      const benchPts = benchmarkLogs.map((l, idx) => ({
                        x: getX(benchEffectiveDays[idx]),
                        y: getSGY(l.sg),
                        log: l
                      }));
                      const benchPath = benchPts.reduce(
                        (acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
                        ''
                      );

                      const realPts = realLogs.map((l, idx) => ({
                        x: getX(realEffectiveDays[idx]),
                        y: getSGY(l.sg),
                        log: l
                      }));
                      const realPath = realPts.reduce(
                        (acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
                        ''
                      );
                      const realArea = realPts.length > 0
                        ? `${realPath} L ${realPts[realPts.length - 1].x} ${chartH - paddingY} L ${realPts[0].x} ${chartH - paddingY} Z`
                        : '';

                      const yPressing = getSGY(dynamicTriggers.pressingPoint);
                      const ySNA1 = getSGY(dynamicTriggers.sna1);
                      const ySNA2 = getSGY(dynamicTriggers.sna2);
                      const yDry = getSGY(0.993);

                      return (
                        <g>
                          <defs>
                            <linearGradient id="realSgGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#BE123C" stopOpacity="0.25" />
                              <stop offset="100%" stopColor="#BE123C" stopOpacity="0.0" />
                            </linearGradient>
                          </defs>

                          {/* Chart Legend Top Right */}
                          <g transform={`translate(${chartW - 220}, ${paddingY - 20})`}>
                            <line x1="0" y1="0" x2="20" y2="0" stroke="#8B5CF6" strokeDasharray="4 4" strokeWidth="2" />
                            <circle cx="10" cy="0" r="3" fill="#8B5CF6" />
                            <text x="28" y="3" fill="#6B21A8" fontSize="9" fontWeight="bold">
                              منحنی مرجع ایده‌آل (Benchmark)
                            </text>

                            <line x1="0" y1="14" x2="20" y2="14" stroke="#BE123C" strokeWidth="3" />
                            <circle cx="10" cy="14" r="3.5" fill="#BE123C" />
                            <text x="28" y="17" fill="#BE123C" fontSize="9" fontWeight="bold">
                              داده‌های واقعی کارگاه شما
                            </text>
                          </g>

                          {/* Dynamic Trigger Lines */}
                          <line x1={paddingX} y1={yPressing} x2={chartW - 20} y2={yPressing} stroke="#E11D48" strokeDasharray="4 4" strokeWidth="1.5" />
                          <text x={paddingX + 160} y={yPressing - 6} fill="#E11D48" fontSize="10" textAnchor="middle" fontWeight="bold">
                            نقطه طلایی پرسینگ (SG = {dynamicTriggers.pressingPoint.toFixed(3)} / 2.8°Bx)
                          </text>

                          <line x1={paddingX} y1={ySNA1} x2={chartW - 20} y2={ySNA1} stroke="#B45309" strokeDasharray="4 4" strokeWidth="1" />
                          <text x={paddingX + 160} y={ySNA1 - 6} fill="#B45309" fontSize="10" textAnchor="middle" fontWeight="bold">
                            تریگر SNA-1 (SG = {dynamicTriggers.sna1.toFixed(3)} / افت ۱۰٪ قند)
                          </text>

                          <line x1={paddingX} y1={ySNA2} x2={chartW - 20} y2={ySNA2} stroke="#D97706" strokeDasharray="3 3" strokeWidth="1" />
                          <text x={paddingX + 160} y={ySNA2 - 5} fill="#B45309" fontSize="9" textAnchor="middle" fontWeight="bold">
                            تریگر SNA-2 و سقف DAP (SG = {dynamicTriggers.sna2.toFixed(3)})
                          </text>

                          <line x1={paddingX} y1={yDry} x2={chartW - 20} y2={yDry} stroke="#059669" strokeDasharray="3 3" strokeWidth="1" />
                          <text x={paddingX + 160} y={yDry - 6} fill="#059669" fontSize="10" textAnchor="middle" fontWeight="bold">
                            خشکی کامل (SG ≤ 0.993)
                          </text>

                          {/* Ideal Benchmark Curve */}
                          <path d={benchPath} fill="none" stroke="#8B5CF6" strokeWidth="2.5" strokeDasharray="5 4" strokeLinecap="round" strokeLinejoin="round" />
                          {benchPts.map((p, idx) => {
                            const isSameDaySecond = idx > 0 && benchmarkLogs[idx - 1].dayNumber === p.log.dayNumber;
                            return (
                              <g key={`bench-${idx}`} className="cursor-pointer" onClick={() => setSelectedLogId(p.log.id)}>
                                <circle cx={p.x} cy={p.y} r="4" fill="#F3E8FF" stroke="#8B5CF6" strokeWidth="2" />
                                {realPts.length === 0 && (
                                  <text
                                    x={p.x}
                                    y={isSameDaySecond ? p.y + 15 : p.y - 10}
                                    fill="#6B21A8"
                                    fontSize="10"
                                    textAnchor="middle"
                                    fontWeight="bold"
                                  >
                                    {p.log.sg}
                                  </text>
                                )}
                              </g>
                            );
                          })}

                          {/* Real User Curve */}
                          {realPts.length > 0 && (
                            <>
                              <path d={realArea} fill="url(#realSgGradient)" />
                              <path d={realPath} fill="none" stroke="#BE123C" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                              {realPts.map((p, idx) => {
                                const isSelected = selectedLog?.id === p.log.id;
                                const isSameDaySecond = idx > 0 && realLogs[idx - 1].dayNumber === p.log.dayNumber;
                                return (
                                  <g key={`real-${idx}`} className="cursor-pointer" onClick={() => setSelectedLogId(p.log.id)}>
                                    <circle
                                      cx={p.x}
                                      cy={p.y}
                                      r={isSelected ? 7 : 5}
                                      fill={isSelected ? '#F43F5E' : '#BE123C'}
                                      stroke="#FFFFFF"
                                      strokeWidth="2.5"
                                    />
                                    <text
                                      x={p.x}
                                      y={isSameDaySecond ? p.y + 15 : p.y - 10}
                                      fill="#0F172A"
                                      fontSize="10"
                                      textAnchor="middle"
                                      fontWeight="bold"
                                    >
                                      {p.log.sg}
                                    </text>
                                  </g>
                                );
                              })}
                            </>
                          )}

                          {/* X-axis Day Labels */}
                          {Array.from({ length: Math.ceil(maxDay) + 1 }).map((_, d) => (
                            <text key={d} x={getX(d)} y={chartH - paddingY + 16} fill="#64748B" fontSize="9" textAnchor="middle">
                              {`روز ${d}`}
                            </text>
                          ))}

                          {/* Y-axis Labels */}
                          <text x={paddingX - 10} y={paddingY + 4} fill="#64748B" fontSize="10" textAnchor="end">1.095</text>
                          <text x={paddingX - 10} y={chartH / 2 + 4} fill="#64748B" fontSize="10" textAnchor="end">1.045</text>
                          <text x={paddingX - 10} y={chartH - paddingY + 4} fill="#64748B" fontSize="10" textAnchor="end">0.990</text>
                        </g>
                      );
                    })()}

                    {/* CHART 2: CAP TEMP PROFILE */}
                    {activeChart === 'temp' && (() => {
                      const minT = 14;
                      const maxT = 31;
                      const maxDay = Math.max(
                        ...benchEffectiveDays,
                        ...realEffectiveDays,
                        9
                      );

                      const getX = (day: number) => paddingX + (day / maxDay) * plotW;
                      const getTY = (tVal: number) =>
                        chartH - paddingY - ((tVal - minT) / (maxT - minT)) * (chartH - 2 * paddingY);

                      const benchPts = benchmarkLogs.map((l, idx) => ({ x: getX(benchEffectiveDays[idx]), y: getTY(l.tempCap), log: l }));
                      const benchPath = benchPts.reduce((acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), '');

                      const realPts = realLogs.map((l, idx) => ({ x: getX(realEffectiveDays[idx]), y: getTY(l.tempCap), log: l }));
                      const realPath = realPts.reduce((acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), '');

                      const yDanger = getTY(29.5);
                      const ySafeCeiling = getTY(28.5);

                      return (
                        <g>
                          <line x1={paddingX} y1={yDanger} x2={chartW - 20} y2={yDanger} stroke="#DC2626" strokeDasharray="4 4" strokeWidth="2" />
                          <text x={paddingX + 180} y={yDanger - 6} fill="#DC2626" fontSize="10" textAnchor="middle" fontWeight="bold">
                            خط قرمز بحران کارگاه (۲۹.۵°C - مرگ مخمر RC-212)
                          </text>

                          <line x1={paddingX} y1={ySafeCeiling} x2={chartW - 20} y2={ySafeCeiling} stroke="#F59E0B" strokeDasharray="3 3" strokeWidth="1" />
                          <text x={paddingX + 180} y={ySafeCeiling - 4} fill="#D97706" fontSize="9" textAnchor="middle" fontWeight="bold">
                            سقف مجاز کلاهک (۲۸.۵°C)
                          </text>

                          <path d={benchPath} fill="none" stroke="#8B5CF6" strokeWidth="2" strokeDasharray="4 4" />
                          {benchPts.map((p, idx) => (
                            <circle key={`bt-${idx}`} cx={p.x} cy={p.y} r="3.5" fill="#F3E8FF" stroke="#8B5CF6" strokeWidth="1.5" />
                          ))}

                          {realPts.length > 0 && (
                            <>
                              <path d={realPath} fill="none" stroke="#BE123C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                              {realPts.map((p, idx) => {
                                const isSelected = selectedLog?.id === p.log.id;
                                const isSameDaySecond = idx > 0 && realLogs[idx - 1].dayNumber === p.log.dayNumber;
                                return (
                                  <g key={`rt-${idx}`} className="cursor-pointer" onClick={() => setSelectedLogId(p.log.id)}>
                                    <circle
                                      cx={p.x}
                                      cy={p.y}
                                      r={isSelected ? 6.5 : 4.5}
                                      fill={isSelected ? '#F43F5E' : '#BE123C'}
                                      stroke="#FFFFFF"
                                      strokeWidth="2"
                                    />
                                    <text
                                      x={p.x}
                                      y={isSameDaySecond ? p.y + 14 : p.y - 8}
                                      fill="#881337"
                                      fontSize="10"
                                      textAnchor="middle"
                                      fontWeight="bold"
                                    >
                                      {p.log.tempCap}°
                                    </text>
                                  </g>
                                );
                              })}
                            </>
                          )}

                          {Array.from({ length: Math.ceil(maxDay) + 1 }).map((_, d) => (
                            <text key={d} x={getX(d)} y={chartH - paddingY + 16} fill="#64748B" fontSize="9" textAnchor="middle">
                              {`روز ${d}`}
                            </text>
                          ))}

                          <text x={paddingX - 10} y={yDanger + 4} fill="#DC2626" fontSize="10" textAnchor="end" fontWeight="bold">29.5°</text>
                          <text x={paddingX - 10} y={chartH / 2 + 4} fill="#64748B" fontSize="10" textAnchor="end">22°C</text>
                          <text x={paddingX - 10} y={chartH - paddingY + 4} fill="#64748B" fontSize="10" textAnchor="end">14°C</text>
                        </g>
                      );
                    })()}

                    {/* CHART 3: PH STABILITY */}
                    {activeChart === 'ph' && (() => {
                      const minPH = 3.20;
                      const maxPH = 3.65;
                      const maxDay = Math.max(
                        ...benchEffectiveDays,
                        ...realEffectiveDays,
                        9
                      );

                      const getX = (day: number) => paddingX + (day / maxDay) * plotW;
                      const getPY = (phVal: number) =>
                        chartH - paddingY - ((phVal - minPH) / (maxPH - minPH)) * (chartH - 2 * paddingY);

                      const benchPts = benchmarkLogs.map((l, idx) => ({ x: getX(benchEffectiveDays[idx]), y: getPY(l.ph), log: l }));
                      const benchPath = benchPts.reduce((acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), '');

                      const realPts = realLogs
                        .map((l, idx) => ({ x: getX(realEffectiveDays[idx]), y: getPY(l.ph), log: l }))
                        .filter((pt) => pt.log.phMeasured !== false);
                      const realPath = realPts.reduce((acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), '');

                      const yTarget = getPY(targetOptimalPH);

                      return (
                        <g>
                          <line x1={paddingX} y1={yTarget} x2={chartW - 20} y2={yTarget} stroke="#7C3AED" strokeDasharray="3 3" strokeWidth="1.5" />
                          <text x={paddingX + 180} y={yTarget - 5} fill="#7C3AED" fontSize="10" textAnchor="middle" fontWeight="bold">
                            هدف استاندارد این مخزن (pH = {targetOptimalPH})
                          </text>

                          <path d={benchPath} fill="none" stroke="#8B5CF6" strokeWidth="2" strokeDasharray="4 4" />
                          {benchPts.map((p, idx) => (
                            <circle key={`bph-${idx}`} cx={p.x} cy={p.y} r="3.5" fill="#F3E8FF" stroke="#8B5CF6" strokeWidth="1.5" />
                          ))}

                          {realPts.length > 0 && (
                            <>
                              <path d={realPath} fill="none" stroke="#6D28D9" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                              {realPts.map((p, idx) => {
                                const isSelected = selectedLog?.id === p.log.id;
                                const isSameDaySecond = idx > 0 && realPts[idx - 1].log.dayNumber === p.log.dayNumber;
                                return (
                                  <g key={`rph-${idx}`} className="cursor-pointer" onClick={() => setSelectedLogId(p.log.id)}>
                                    <circle
                                      cx={p.x}
                                      cy={p.y}
                                      r={isSelected ? 6.5 : 4.5}
                                      fill={isSelected ? '#A855F7' : '#6D28D9'}
                                      stroke="#FFFFFF"
                                      strokeWidth="2"
                                    />
                                    <text
                                      x={p.x}
                                      y={isSameDaySecond ? p.y + 14 : p.y - 8}
                                      fill="#6D28D9"
                                      fontSize="10"
                                      textAnchor="middle"
                                      fontWeight="bold"
                                    >
                                      {p.log.ph}
                                    </text>
                                  </g>
                                );
                              })}
                            </>
                          )}

                          {Array.from({ length: Math.ceil(maxDay) + 1 }).map((_, d) => (
                            <text key={d} x={getX(d)} y={chartH - paddingY + 16} fill="#64748B" fontSize="9" textAnchor="middle">
                              {`روز ${d}`}
                            </text>
                          ))}

                          <text x={paddingX - 10} y={paddingY + 4} fill="#64748B" fontSize="10" textAnchor="end">3.65</text>
                          <text x={paddingX - 10} y={yTarget + 4} fill="#7C3AED" fontSize="10" textAnchor="end" fontWeight="bold">{targetOptimalPH}</text>
                          <text x={paddingX - 10} y={chartH - paddingY + 4} fill="#64748B" fontSize="10" textAnchor="end">3.20</text>
                        </g>
                      );
                    })()}
                  </svg>
                ) : (
                  /* ALL CHARTS SYNCED VIEW */
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {(() => {
                      const maxSyncDay = Math.max(...benchEffectiveDays, ...realEffectiveDays, 9);
                      const getSyncX = (day: number) => 20 + (day / maxSyncDay) * 260;

                      return (
                        <>
                          <div className="bg-white p-3 rounded-xl border border-stone-200">
                            <h4 className="text-xs font-bold text-stone-800 mb-2 flex items-center justify-between">
                              <span>روند افت SG و بریکس</span>
                              <span className="text-rose-800 font-mono text-xs">{latestLog.sg}</span>
                            </h4>
                            <svg viewBox="0 0 300 120" className="w-full h-auto font-['Vazirmatn',sans-serif]">
                              {(() => {
                                const minSG = 0.990, maxSG = 1.095;
                                const bPts = benchmarkLogs.map((l, i) => ({
                                  x: getSyncX(benchEffectiveDays[i]),
                                  y: 110 - ((l.sg - minSG) / (maxSG - minSG)) * 95
                                }));
                                const rPts = realLogs.map((l, i) => ({
                                  x: getSyncX(realEffectiveDays[i]),
                                  y: 110 - ((l.sg - minSG) / (maxSG - minSG)) * 95
                                }));
                                const bD = bPts.reduce((a, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${a} L ${p.x} ${p.y}`), '');
                                const rD = rPts.reduce((a, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${a} L ${p.x} ${p.y}`), '');
                                return (
                                  <>
                                    {bPts.length > 0 && (
                                      <>
                                        <path d={bD} fill="none" stroke="#8B5CF6" strokeWidth="2" strokeDasharray="3 3" />
                                        {bPts.map((p, idx) => (
                                          <circle key={`bsg-${idx}`} cx={p.x} cy={p.y} r="2.5" fill="#8B5CF6" />
                                        ))}
                                      </>
                                    )}
                                    {rPts.length > 0 && (
                                      <>
                                        <path d={rD} fill="none" stroke="#BE123C" strokeWidth="2.5" />
                                        {rPts.map((p, idx) => (
                                          <circle key={`rsg-${idx}`} cx={p.x} cy={p.y} r="3" fill="#BE123C" />
                                        ))}
                                      </>
                                    )}
                                  </>
                                );
                              })()}
                            </svg>
                          </div>

                          <div className="bg-white p-3 rounded-xl border border-stone-200">
                            <h4 className="text-xs font-bold text-stone-800 mb-2 flex items-center justify-between">
                              <span>پروفایل دمای کلاهک</span>
                              <span className="text-rose-800 font-mono text-xs">{latestLog.tempCap}°C</span>
                            </h4>
                            <svg viewBox="0 0 300 120" className="w-full h-auto font-['Vazirmatn',sans-serif]">
                              {(() => {
                                const minT = 14, maxT = 31;
                                const bPts = benchmarkLogs.map((l, i) => ({
                                  x: getSyncX(benchEffectiveDays[i]),
                                  y: 110 - ((l.tempCap - minT) / (maxT - minT)) * 95
                                }));
                                const rPts = realLogs.map((l, i) => ({
                                  x: getSyncX(realEffectiveDays[i]),
                                  y: 110 - ((l.tempCap - minT) / (maxT - minT)) * 95
                                }));
                                const bD = bPts.reduce((a, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${a} L ${p.x} ${p.y}`), '');
                                const rD = rPts.reduce((a, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${a} L ${p.x} ${p.y}`), '');
                                return (
                                  <>
                                    <line x1="20" y1={110 - ((29.5 - minT) / (maxT - minT)) * 95} x2="280" y2={110 - ((29.5 - minT) / (maxT - minT)) * 95} stroke="#DC2626" strokeDasharray="3 3" />
                                    {bPts.length > 0 && (
                                      <>
                                        <path d={bD} fill="none" stroke="#8B5CF6" strokeWidth="2" strokeDasharray="3 3" />
                                        {bPts.map((p, idx) => (
                                          <circle key={`bt-${idx}`} cx={p.x} cy={p.y} r="2.5" fill="#8B5CF6" />
                                        ))}
                                      </>
                                    )}
                                    {rPts.length > 0 && (
                                      <>
                                        <path d={rD} fill="none" stroke="#DC2626" strokeWidth="2.5" />
                                        {rPts.map((p, idx) => (
                                          <circle key={`rt-${idx}`} cx={p.x} cy={p.y} r="3" fill="#DC2626" />
                                        ))}
                                      </>
                                    )}
                                  </>
                                );
                              })()}
                            </svg>
                          </div>

                          <div className="bg-white p-3 rounded-xl border border-stone-200">
                            <h4 className="text-xs font-bold text-stone-800 mb-2 flex items-center justify-between">
                              <span>پایداری شاخص pH</span>
                              <span className="text-purple-800 font-mono text-xs">{latestLog.ph}</span>
                            </h4>
                            <svg viewBox="0 0 300 120" className="w-full h-auto font-['Vazirmatn',sans-serif]">
                              {(() => {
                                const minP = 3.20, maxP = 3.65;
                                const bPts = benchmarkLogs.map((l, i) => ({
                                  x: getSyncX(benchEffectiveDays[i]),
                                  y: 110 - ((l.ph - minP) / (maxP - minP)) * 95
                                }));
                                const rPts = realLogs
                                  .map((l, i) => ({
                                    x: getSyncX(realEffectiveDays[i]),
                                    y: 110 - ((l.ph - minP) / (maxP - minP)) * 95,
                                    log: l
                                  }))
                                  .filter((pt) => pt.log.phMeasured !== false);
                                const bD = bPts.reduce((a, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${a} L ${p.x} ${p.y}`), '');
                                const rD = rPts.reduce((a, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${a} L ${p.x} ${p.y}`), '');
                                return (
                                  <>
                                    {bPts.length > 0 && (
                                      <>
                                        <path d={bD} fill="none" stroke="#8B5CF6" strokeWidth="2" strokeDasharray="3 3" />
                                        {bPts.map((p, idx) => (
                                          <circle key={`bph-${idx}`} cx={p.x} cy={p.y} r="2.5" fill="#8B5CF6" />
                                        ))}
                                      </>
                                    )}
                                    {rPts.length > 0 && (
                                      <>
                                        <path d={rD} fill="none" stroke="#6D28D9" strokeWidth="2.5" />
                                        {rPts.map((p, idx) => (
                                          <circle key={`rph-${idx}`} cx={p.x} cy={p.y} r="3" fill="#6D28D9" />
                                        ))}
                                      </>
                                    )}
                                  </>
                                );
                              })()}
                            </svg>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-center text-stone-500 py-8 text-xs font-medium">
                هیچ رکوردی برای این حالت فیلتر یافت نشد.
              </p>
            )}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* ZONE C: 4-TAB UNIFIED TANK LOGBOOK («دفتر کل ثبت‌های مخزن و کارگاه»)  */}
      {/* ===================================================================== */}
      <div className="bg-surface p-5 sm:p-6 rounded-xl border border-line shadow-xs space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-line pb-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="font-bold text-ink text-base sm:text-lg">
                دفتر کل ثبت‌های مخزن و کارگاه (Unified Tank Logbook)
              </h3>
              <button
                type="button"
                onClick={() => ui.setActiveFiveTab('more')}
                className="text-xs font-bold text-wine bg-paper hover:bg-surface border border-line px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>مشاهده و چاپ چک‌لیست‌های مستر پروتکل (تب «بیشتر»)</span>
              </button>
            </div>
            <p className="text-xs text-ink-soft mt-0.5">
              دسترسی یکپارچه به ۴ بخش ثبت‌ها، افزودنی‌ها، آزمایش‌ها و چشایی و عکس‌ها
            </p>
          </div>

          {/* 4 Logbook Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setLogbookTab('daily-logs')}
              className={`px-3 py-2.5 rounded-xl font-bold flex items-center justify-between gap-2 cursor-pointer transition-all whitespace-nowrap border ${
                logbookTab === 'daily-logs'
                  ? 'bg-wine text-white border-wine shadow-xs'
                  : 'bg-paper text-ink border-line hover:bg-surface'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" />
                <span>۱. لاگ‌شیت پایش روزانه</span>
              </span>
              <span className="font-mono tabular-nums text-xs px-1.5 py-0.5 rounded bg-black/15">
                {currentTankLogs.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setLogbookTab('chemical-additions')}
              className={`px-3 py-2.5 rounded-xl font-bold flex items-center justify-between gap-2 cursor-pointer transition-all whitespace-nowrap border ${
                logbookTab === 'chemical-additions'
                  ? 'bg-wine text-white border-wine shadow-xs'
                  : 'bg-paper text-ink border-line hover:bg-surface'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Beaker className="w-3.5 h-3.5" />
                <span>۲. افزودنی‌های شیمیایی</span>
              </span>
              <span className="font-mono tabular-nums text-xs px-1.5 py-0.5 rounded bg-black/15">
                {displayedAdditions.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setLogbookTab('lab-analyses')}
              className={`px-3 py-2.5 rounded-xl font-bold flex items-center justify-between gap-2 cursor-pointer transition-all whitespace-nowrap border ${
                logbookTab === 'lab-analyses'
                  ? 'bg-wine text-white border-wine shadow-xs'
                  : 'bg-paper text-ink border-line hover:bg-surface'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <FlaskConical className="w-3.5 h-3.5" />
                <span>۳. تست‌های آزمایشگاهی</span>
              </span>
              <span className="font-mono tabular-nums text-xs px-1.5 py-0.5 rounded bg-black/15">
                {displayedLabAnalyses.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setLogbookTab('sensory-eval')}
              className={`px-3 py-2.5 rounded-xl font-bold flex items-center justify-between gap-2 cursor-pointer transition-all whitespace-nowrap border ${
                logbookTab === 'sensory-eval'
                  ? 'bg-wine text-white border-wine shadow-xs'
                  : 'bg-paper text-ink border-line hover:bg-surface'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>۴. ارزیابی حسی و کنترل کیفیت</span>
              </span>
              <span className="font-mono tabular-nums text-xs px-1.5 py-0.5 rounded bg-black/15">
                5 محور
              </span>
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------------------- */}
        {/* LOGBOOK TAB 1: DAILY FERMENTATION LOGS TABLE                        */}
        {/* ------------------------------------------------------------------- */}
        {logbookTab === 'daily-logs' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-bold text-ink text-sm">
                  جدول سوابق ثبت‌شده اندازه‌گیری‌های روزانه ({currentTankLogs.length} رکورد در نمای {tankLabel})
                </h4>
                <p className="text-xs text-ink-soft">
                  با کلیک روی هر سطر، نقطه مربوطه روی نمودار بالا و در پنل عیب‌یابی انتخاب می‌شود
                </p>
              </div>

              <div className="flex items-center gap-2 no-print flex-wrap">
                <button
                  type="button"
                  onClick={handleOpenAddModal}
                  className="px-3.5 py-1.5 rounded-xl bg-wine hover:opacity-90 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>ثبت لاگ روزانه جدید</span>
                </button>
                <button
                  type="button"
                  onClick={handleExportDocx}
                  className="px-3.5 py-1.5 rounded-xl bg-paper hover:bg-surface text-ink border border-line text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-wine" />
                  <span>دانلود Word (DOCX)</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-xl bg-paper hover:bg-surface text-ink-soft border border-line text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-ink-soft" />
                  <span>چاپ فرم لاگ‌شیت</span>
                </button>
              </div>
            </div>

            <div className="border border-line rounded-xl overflow-hidden overflow-x-auto">
              <table className="w-full text-right text-xs border-collapse">
                <thead className="bg-paper text-ink font-bold border-b border-line">
                  <tr>
                    <th className="py-2.5 px-3 w-28 text-center border-l border-line">نوع رکورد</th>
                    <th className="py-2.5 px-3 min-w-[120px] border-l border-line">تاریخ و ساعت</th>
                    <th className="py-2.5 px-3 min-w-[140px] border-l border-line">مرحله / تریگر</th>
                    <th className="py-2.5 px-3 w-20 text-center border-l border-line">هیدرومتر (SG)</th>
                    <th className="py-2.5 px-3 w-16 text-center border-l border-line">بریکس</th>
                    <th className="py-2.5 px-3 w-20 text-center border-l border-line">دمای کلاهک</th>
                    <th className="py-2.5 px-3 w-16 text-center border-l border-line">دمای اتاق</th>
                    <th className="py-2.5 px-3 w-16 text-center border-l border-line">pH</th>
                    <th className="py-2.5 px-3 w-24 text-center border-l border-line">غوطه‌ورسازی</th>
                    <th className="py-2.5 px-3 min-w-[200px] border-l border-line">توضیحات و رویداد ویژه</th>
                    <th className="py-2.5 px-2.5 w-12 text-center no-print">حذف</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {currentTankLogs.map((item, idx) => (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedLogId(item.id)}
                      className={`hover:bg-rose-50/40 transition-colors cursor-pointer ${
                        selectedLog?.id === item.id
                          ? 'bg-rose-50/80 font-bold'
                          : item.isTriggerPoint
                          ? 'bg-amber-50/70 font-semibold'
                          : idx % 2 === 1
                          ? 'bg-stone-50'
                          : 'bg-white'
                      }`}
                    >
                      <td className="py-2.5 px-2.5 text-center border-l border-stone-200">
                        <span className={`text-xs font-bold ${
                          item.isBenchmark ? 'text-purple-800' : 'text-emerald-800'
                        }`}>
                          {item.isBenchmark ? 'الگوی مرجع' : 'ثبت واقعی'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-stone-900 border-l border-stone-200 font-mono tabular-nums text-xs">
                        {item.dateTime}
                      </td>
                      <td className="py-2.5 px-3 text-stone-800 border-l border-stone-200">
                        <span>
                          {item.isTriggerPoint ? '' : ''}
                          {item.stageTitle}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-rose-900 border-l border-stone-200 font-mono tabular-nums">
                        {item.sg}
                      </td>
                      <td className="py-2.5 px-3 text-center text-stone-700 border-l border-stone-200 font-mono tabular-nums">
                        {item.brix}°
                      </td>
                      <td
                        className={`py-2.5 px-3 text-center font-mono tabular-nums font-bold border-l border-stone-200 ${
                          item.tempCap >= 28.5 ? 'text-rose-700 bg-rose-50' : 'text-stone-800'
                        }`}
                      >
                        {item.tempCap}°C
                      </td>
                      <td className="py-2.5 px-3 text-center text-stone-600 border-l border-stone-200 font-mono tabular-nums">
                        {item.tempRoom}°C
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-purple-900 border-l border-stone-200 font-mono tabular-nums">
                        {item.ph}
                      </td>
                      <td className="py-2.5 px-3 text-center text-stone-700 border-l border-stone-200 text-xs">
                        {item.pigeageDone ? (
                          <span className="text-emerald-700 font-bold">انجام شد ({item.pigeageCount || 1})</span>
                        ) : (
                          <span className="text-stone-400">—</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-stone-600 text-xs leading-relaxed border-l border-stone-200">
                        {(item.ta !== undefined || item.freeSO2 !== undefined) && (
                          <div className="flex flex-wrap items-center gap-1.5 mb-1">
                            {item.ta !== undefined && (
                              <span className="bg-stone-100 text-stone-800 border border-stone-200 px-1.5 py-0.5 rounded font-mono font-bold text-xs">
                                TA: {item.ta} g/L
                              </span>
                            )}
                            {item.freeSO2 !== undefined && (
                              <span className="bg-rose-50 text-rose-900 border border-rose-200 px-1.5 py-0.5 rounded font-mono font-bold text-xs">
                                Free SO₂: {item.freeSO2} mg/L
                              </span>
                            )}
                          </div>
                        )}
                        <div>{item.operationNote || '—'}</div>
                      </td>
                      <td className="py-2.5 px-2.5 text-center no-print">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteLog(item.id);
                          }}
                          className="text-stone-400 hover:text-rose-600 p-1 cursor-pointer transition-colors"
                          title="حذف این رکورد"
                          aria-label={`حذف رکورد ${item.stageTitle}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------- */}
        {/* LOGBOOK TAB 2: CHEMICAL ADDITIONS LOGSHEET (لاگ‌شیت ۳)              */}
        {/* ------------------------------------------------------------------- */}
        {logbookTab === 'chemical-additions' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-bold text-stone-900 text-sm">
                  سوابق افزودنی‌های شیمیایی، مخمر و مغذی‌های SNA (لاگ‌شیت ۳ مستر پروتکل)
                </h4>
                <p className="text-xs text-stone-500">
                  ثبت دقیق زمان، دوز وزنی و هدف بیوشیمیایی کلیه مواد افزوده‌شده به مخازن
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs">
                  <button
                    type="button"
                    onClick={() => setFilterAdditionsByTank(true)}
                    className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer ${
                      filterAdditionsByTank ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
                    }`}
                  >
                    فقط مخزن فعلی ({additions.filter((a) => a.tankId === tankId).length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterAdditionsByTank(false)}
                    className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer ${
                      !filterAdditionsByTank ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
                    }`}
                  >
                    همه مخازن ({additions.length})
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleOpenAddChemicalModal}
                  className="px-3.5 py-1.5 rounded-xl bg-wine hover:opacity-90 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>ثبت افزودنی شیمیایی جدید</span>
                </button>
              </div>
            </div>

            {/* Live Cumulative SO2 Ledger & OIV Ceiling Card */}
            {(() => {
              const so2VolL =
                tankId === 'tank-rose'
                  ? flexPlan.volumes.rosePostRackingL
                  : flexPlan.volumes.rack1PerTankL;
              const so2Ledger = enologyDb.getCumulativeSO2Ledger(
                tankId,
                so2VolL,
                undefined,
                undefined,
                !enologyDb.hasDemoData(),
                activeBatch?.id
              );
              const isCaution = so2Ledger.remainingBudgetMgL < 25 && !so2Ledger.isOverBudget;
              return (
                <div
                  className={`p-4 rounded-xl border-2 text-xs space-y-2.5 ${
                    so2Ledger.isOverBudget
                      ? 'bg-rose-50 border-rose-400 text-rose-950'
                      : isCaution
                      ? 'bg-amber-50 border-amber-400 text-amber-950'
                      : 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-rose-800 shrink-0" />
                      <strong className="font-bold text-xs sm:text-sm">
                        دفتر کل زنده گوگرد تجمعی (Total SO₂ Ledger) و سقف قانونی OIV — {tankLabel} (حجم مرجع صافی: {so2VolL}L)
                      </strong>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        so2Ledger.isOverBudget
                          ? 'bg-rose-700 text-white'
                          : isCaution
                          ? 'bg-amber-600 text-white'
                          : 'bg-emerald-700 text-white'
                      }`}
                    >
                      {so2Ledger.isOverBudget
                        ? 'عبور از سقف OIV'
                        : isCaution
                        ? 'نزدیک به سقف مجاز'
                        : 'در محدوده کاملاً ایمن OIV'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1">
                    <div className="bg-white/90 p-2.5 rounded-lg border border-black/10">
                      <span className="text-xs text-stone-500 block">SO₂ حاصله از تزریق KMS</span>
                      <strong className="font-mono text-sm font-bold text-stone-900">
                        {so2Ledger.addedFromKmsMgL} mg/L
                      </strong>
                    </div>
                    <div className="bg-white/90 p-2.5 rounded-lg border border-black/10">
                      <span className="text-xs text-stone-500 block">تولید درون‌زای مخمر</span>
                      <strong className="font-mono text-sm font-bold text-stone-900">
                        {so2Ledger.endogenousYeastMgL} mg/L
                      </strong>
                    </div>
                    <div className="bg-white/90 p-2.5 rounded-lg border border-black/10">
                      <span className="text-xs text-stone-500 block">کل SO₂ تجمعی تخمینی</span>
                      <strong className="font-mono text-sm font-bold text-rose-900">
                        {so2Ledger.estimatedTotalSO2MgL} mg/L
                      </strong>
                    </div>
                    <div className="bg-white/90 p-2.5 rounded-lg border border-black/10">
                      <span className="text-xs text-stone-500 block">سقف قانونی OIV</span>
                      <strong className="font-mono text-sm font-bold text-stone-800">
                        {so2Ledger.legalCeilingMgL} mg/L
                      </strong>
                    </div>
                    <div className="bg-white/90 p-2.5 rounded-lg border border-black/10 col-span-2 sm:col-span-1">
                      <span className="text-xs text-stone-500 block">حاشیه امنیت باقی‌مانده</span>
                      <strong className="font-mono text-sm font-bold text-emerald-800">
                        {so2Ledger.remainingBudgetMgL} mg/L
                      </strong>
                    </div>
                  </div>
                  <p className="text-xs opacity-85 pt-1 border-t border-black/10">
                    <strong>مبنای حسابداری OIV (تخمین پیوند/تبخیر {Math.round(so2Ledger.estimatedBoundAndVolatilizedRatio * 100)}٪): </strong>
                    {so2Ledger.accountingBasisFa}
                  </p>
                </div>
              );
            })()}

            <div className="border border-line rounded-xl overflow-hidden overflow-x-auto">
              <table className="w-full text-right text-xs border-collapse">
                <thead className="bg-paper text-ink font-bold border-b border-line">
                  <tr>
                    <th className="py-2.5 px-3 border-l border-line">مخزن</th>
                    <th className="py-2.5 px-3 border-l border-line">تاریخ و ساعت</th>
                    <th className="py-2.5 px-3 border-l border-line">مرحله فرآیند</th>
                    <th className="py-2.5 px-3 border-l border-line">نام ترکیب / ماده</th>
                    <th className="py-2.5 px-3 text-center border-l border-line">مقدار و واحد</th>
                    <th className="py-2.5 px-3 border-l border-line">هدف انولوژیک و یادداشت اپراتور</th>
                    <th className="py-2.5 px-2.5 w-12 text-center">حذف</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {displayedAdditions.map((add, idx) => (
                    <tr key={add.id} className={idx % 2 === 1 ? 'bg-stone-50' : 'bg-white'}>
                      <td className="py-2.5 px-3 font-bold text-stone-800 border-l border-stone-200">
                        {add.tankId === 'tank-a' ? 'مخزن قرمز A' : add.tankId === 'tank-b' ? 'مخزن قرمز B' : 'مخزن رُزه'}
                      </td>
                      <td className="py-2.5 px-3 font-mono tabular-nums text-stone-700 border-l border-stone-200">
                        {add.timestamp}
                      </td>
                      <td className="py-2.5 px-3 text-stone-800 font-semibold border-l border-stone-200">
                        {add.stageTitle}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-amber-900 border-l border-stone-200">
                        <div>{add.compoundName}</div>
                        {add.lotNumber && (
                          <span className="text-xs font-mono bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded border border-stone-200 mt-1 inline-block">
                            LOT: {add.lotNumber}
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono tabular-nums font-bold text-rose-900 border-l border-stone-200">
                        {add.amount} {add.unit}
                      </td>
                      <td className="py-2.5 px-3 text-stone-600 border-l border-stone-200 leading-relaxed">
                        <div>{add.purpose}</div>
                        {add.operatorNote && (
                          <div className="text-xs text-stone-500 mt-0.5">یادداشت: {add.operatorNote}</div>
                        )}
                      </td>
                      <td className="py-2.5 px-2.5 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteAddition(add.id)}
                          className="text-stone-400 hover:text-rose-600 p-1 cursor-pointer"
                          title="حذف این افزودنی"
                          aria-label={`حذف افزودنی ${add.compoundName}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------- */}
        {/* LOGBOOK TAB 3: LAB ANALYSES RECORDS                                 */}
        {/* ------------------------------------------------------------------- */}
        {logbookTab === 'lab-analyses' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-bold text-stone-900 text-sm">
                  سوابق تست‌های آزمایشگاهی (ریپر SO2، تیتراسیون TA، pH، رفرکتومتر و مالولاکتیک)
                </h4>
                <p className="text-xs text-stone-500">
                  بایگانی رسمی نتایج آزمایشگاهی و اقدامات اصلاحی انجام‌شده روی هر مخزن
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs">
                  <button
                    type="button"
                    onClick={() => setFilterLabByTank(true)}
                    className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer ${
                      filterLabByTank ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
                    }`}
                  >
                    فقط مخزن فعلی ({labAnalyses.filter((a) => a.tankId === tankId).length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterLabByTank(false)}
                    className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer ${
                      !filterLabByTank ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
                    }`}
                  >
                    همه مخازن ({labAnalyses.length})
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleOpenAddLabModal}
                  className="px-3.5 py-1.5 rounded-xl bg-wine hover:opacity-90 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>ثبت نتیجه آزمایشگاه</span>
                </button>
              </div>
            </div>

            <div className="border border-line rounded-xl overflow-hidden overflow-x-auto">
              <table className="w-full text-right text-xs border-collapse">
                <thead className="bg-paper text-ink font-bold border-b border-line">
                  <tr>
                    <th className="py-2.5 px-3 border-l border-line">مخزن</th>
                    <th className="py-2.5 px-3 border-l border-line">تاریخ آزمایش</th>
                    <th className="py-2.5 px-3 border-l border-line">نوع آزمون</th>
                    <th className="py-2.5 px-3 border-l border-line">پارامتر هدف</th>
                    <th className="py-2.5 px-3 text-center border-l border-line">مقدار اندازه‌گیری‌شده</th>
                    <th className="py-2.5 px-3 border-l border-line">اقدام اصلاحی و یادداشت</th>
                    <th className="py-2.5 px-2.5 w-12 text-center">حذف</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {displayedLabAnalyses.map((lab, idx) => (
                    <tr key={lab.id} className={idx % 2 === 1 ? 'bg-stone-50' : 'bg-white'}>
                      <td className="py-2.5 px-3 font-bold text-stone-800 border-l border-stone-200">
                        {lab.tankId === 'tank-a' ? 'مخزن قرمز A' : lab.tankId === 'tank-b' ? 'مخزن قرمز B' : 'مخزن رُزه'}
                      </td>
                      <td className="py-2.5 px-3 font-mono tabular-nums text-stone-700 border-l border-stone-200">
                        {lab.date}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-stone-800 border-l border-stone-200">
                        {lab.testType}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-emerald-900 border-l border-stone-200">
                        {lab.targetAnalyte}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono tabular-nums font-bold text-rose-900 border-l border-stone-200">
                        {lab.measuredValue} {lab.unit}
                      </td>
                      <td className="py-2.5 px-3 text-stone-600 border-l border-stone-200 leading-relaxed">
                        <div>{lab.actionTaken || '—'}</div>
                        {lab.notes && <div className="text-xs text-stone-500 mt-0.5">{lab.notes}</div>}
                      </td>
                      <td className="py-2.5 px-2.5 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteLabAnalysis(lab.id)}
                          className="text-stone-400 hover:text-rose-600 p-1 cursor-pointer"
                          title="حذف این نتیجه آزمایش"
                          aria-label={`حذف تست ${lab.targetAnalyte}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------- */}
        {/* LOGBOOK TAB 4: ORGANOLEPTIC SENSORY EVALUATION (ارزیابی حسی ۵ محوره) */}
        {/* ------------------------------------------------------------------- */}
        {logbookTab === 'sensory-eval' && (() => {
          const baseScore = ((sensoryClarity + sensoryAroma + sensoryAcidity + sensoryTannin + sensoryOverall) / 25) * 100;
          const faultPenalty = sensoryFaults.length * 15;
          const finalOrganolepticScore = Math.max(0, Math.round(baseScore - faultPenalty));

          const toggleFault = (f: string) => {
            setSensoryFaults((prev) => (prev.includes(f) ? prev.filter((item) => item !== f) : [...prev, f]));
          };

          const handleSaveSensoryEvaluation = (e: React.FormEvent) => {
            e.preventDefault();
            const faultText = sensoryFaults.length > 0 ? `عیوب شناسایی‌شده: ${sensoryFaults.join('، ')}` : 'فاقد عیب بویایی/چشایی';
            enologyDb.addLabAnalysis({
              batchId: currentBatchId,
              tankId,
              dayNumber: latestLog?.dayNumber ?? formDay,
              timestampMs: Date.now(),
              date: getCurrentPersianDateStr(),
              testType: 'sensory_eval',
              targetAnalyte: 'ارزیابی حسی و کنترل کیفیت ارگانولپتیک (۵ محوره)',
              measuredValue: finalOrganolepticScore,
              unit: 'امتیاز از ۱۰۰',
              actionTaken: faultText,
              notes: `شفافیت:${sensoryClarity}/5 | عطر:${sensoryAroma}/5 | اسیدیته:${sensoryAcidity}/5 | تانن:${sensoryTannin}/5 | کیفیت کل:${sensoryOverall}/5${sensoryNotes ? ` — ${sensoryNotes}` : ''}`
            });
            setLabAnalyses(enologyDb.getLabAnalyses(undefined, false, activeBatch?.id));
            notifyDataChanged();
            onDataChanged?.();
            showToast(`ارزیابی حسی مخزن (${finalOrganolepticScore}/100) با موفقیت در سوابق آزمایشگاه ثبت شد.`);
          };

          return (
            <div className="space-y-5">
              <PhotoDiaryAndVintagePanel tankId={tankId} />

              <form onSubmit={handleSaveSensoryEvaluation} className="space-y-4 text-xs">
                <div className="bg-paper p-4 rounded-xl border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-ink text-sm">
                    فرم ارزیابی حسی و کنترل کیفیت ارگانولپتیک ({tankLabel})
                  </h4>
                  <p className="text-ink-soft mt-0.5">
                    امتیازدهی ۵ محوره (۱ تا ۵) به همراه پایش زودهنگام عیوب فرار (H2S، استیک اسید، اکسیداسیون و برتانومایسس)
                  </p>
                </div>
                <div className="bg-surface text-ink border border-line px-4 py-2.5 rounded-xl flex items-center gap-3 shrink-0">
                  <span className="text-ink-soft">امتیاز کل ارگانولپتیک:</span>
                  <strong className={`text-lg font-mono tabular-nums font-bold ${
                    finalOrganolepticScore >= 80 ? 'text-emerald-700' : finalOrganolepticScore >= 60 ? 'text-amber-700' : 'text-danger'
                  }`}>
                    {finalOrganolepticScore} / 100
                  </strong>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {[
                  { label: '۱. شفافیت و درخشش رنگ', val: sensoryClarity, setter: setSensoryClarity },
                  { label: '۲. شدت و خلوص عطر میوه‌ای', val: sensoryAroma, setter: setSensoryAroma },
                  { label: '۳. تعادل اسیدیته و طراوت', val: sensoryAcidity, setter: setSensoryAcidity },
                  { label: '۴. نرمی و ساختار تانن دهانی', val: sensoryTannin, setter: setSensoryTannin },
                  { label: '۵. هارمونی و کیفیت کلی', val: sensoryOverall, setter: setSensoryOverall }
                ].map((axis, idx) => (
                  <div key={idx} className="bg-surface p-3.5 rounded-xl border border-line space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-ink">{axis.label}</span>
                      <strong className="font-mono text-wine font-bold">{axis.val} / 5</strong>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      value={axis.val}
                      onChange={(e) => axis.setter(Number(e.target.value))}
                      className="w-full accent-wine cursor-pointer"
                    />
                  </div>
                ))}
              </div>

              <div className="bg-paper p-4 rounded-xl border border-line space-y-2.5">
                <label className="font-bold text-ink block">
                  غربالگری عیوب بویایی و میکروبی (هر عیب ۱۵ امتیاز کسر می‌کند):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                  {[
                    { id: 'H2S (بوی تخم‌مرغ گندیده / گوگرد احیاشده)', hint: 'نیاز فوری به هوادهی یا تست ۵ لیوانی سولفات مس' },
                    { id: 'VA / استیک اسید (بوی سرکه یا لاک‌پاک‌کن)', hint: 'نیاز به قفل باکتیلس، KMS و حذف فضای خالی گالن' },
                    { id: 'اکسیداسیون / استالدهید (بوی سیب لک‌دار)', hint: 'نیاز به تنظیم Free SO2 روی 35 mg/L و اسید اسکوربیک' },
                    { id: 'برتانومایسس (بوی چرم خیس / فنول فرار)', hint: 'ممنوعیت مطلق DAP/Fermaid K و رعایت SO2 مولکولی 0.8' }
                  ].map((fault) => {
                    const checked = sensoryFaults.includes(fault.id);
                    return (
                      <label
                        key={fault.id}
                        className={`p-2.5 rounded-lg border cursor-pointer transition-all flex items-start gap-2 ${
                          checked ? 'bg-wine text-white border-wine' : 'bg-surface text-ink border-line'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleFault(fault.id)}
                          className="mt-0.5 accent-amber-400"
                        />
                        <div>
                          <div className="font-bold">{fault.id}</div>
                          <div className={`text-xs mt-0.5 ${checked ? 'text-white/85' : 'text-ink-soft'}`}>
                            {fault.hint}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <input
                  type="text"
                  value={sensoryNotes}
                  onChange={(e) => setSensoryNotes(e.target.value)}
                  placeholder="یادداشت تکمیلی چشایی (نت‌های گیلاس سیاه، انار، گسی تانن، پیشنهاد گلیسیرین روز ۸۵ و...)"
                  className="flex-1 rounded-xl border border-line bg-surface px-3.5 py-2.5 text-xs focus:border-wine focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-wine hover:opacity-90 text-white font-bold cursor-pointer flex items-center justify-center gap-2 shrink-0"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>ثبت ارزیابی حسی در دیتابیس آزمایشگاه</span>
                </button>
              </div>
            </form>
            </div>
          );
        })()}

      </div>

      {/* ===================================================================== */}
      {/* MODAL 1: ADD DAILY LOG ENTRY (+ SMART TRIGGER DETECTOR)               */}
      {/* ===================================================================== */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-300 space-y-4 font-['Vazirmatn',sans-serif]">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-stone-900 text-base">
                  ثبت اندازه‌گیری واقعی کارگاه ({tankLabel})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-stone-400 hover:text-stone-700 text-sm font-bold cursor-pointer p-1"
                title="بستن"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddLog} className="space-y-3.5 text-xs">
              {/* SMART STAGE & TRIGGER AUTO-FILL SELECTOR */}
              <div className="bg-rose-50/90 border border-rose-200 p-3 rounded-xl space-y-1.5">
                <label className="block text-rose-950 font-bold text-xs">
                  انتخاب هوشمند مرحله و تریگر از پروتکل (پر کردن خودکار فرم):
                </label>
                <select
                  value={selectedDailyPresetId}
                  onChange={(e) => applyDailyStagePreset(e.target.value)}
                  className="w-full p-2 rounded-lg border border-rose-300 bg-white font-bold text-stone-900 text-xs focus:ring-2 focus:ring-rose-800 outline-none"
                >
                  <option value="">— ورود دستی یا انتخاب سریع ایستگاه/تریگر استاندارد —</option>
                  {getSmartDailyStagePresets(flexPlan, tankId).map((preset) => (
                    <option key={preset.id} value={preset.id}>
                      {preset.labelFa}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">تاریخ و ساعت پایش:</label>
                  <input
                    type="text"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    placeholder="۱۴۰۳/۰۷/۲۶ - ۰۸:۰۰"
                    className="w-full p-2 rounded-lg border border-stone-300 font-mono text-xs focus:ring-2 focus:ring-rose-800 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">شماره روز تخمیر:</label>
                  <input
                    type="number"
                    value={formDay}
                    onChange={(e) => setFormDay(Number(e.target.value))}
                    min="0"
                    max="100"
                    className="w-full p-2 rounded-lg border border-stone-300 font-mono tabular-nums text-xs focus:ring-2 focus:ring-rose-800 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">عنوان مرحله / رویداد کارگاه:</label>
                <input
                  type="text"
                  value={formStage}
                  onChange={(e) => setFormStage(e.target.value)}
                  placeholder="مثال: روز ۳ - نوبت صبح"
                  className="w-full p-2 rounded-lg border border-stone-300 text-xs focus:ring-2 focus:ring-rose-800 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3 bg-stone-50 p-3 rounded-xl border border-stone-200">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">درجه بریکس (°Bx):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formBrix}
                    onChange={(e) => handleBrixChange(Number(e.target.value))}
                    className="w-full p-2 rounded-lg border border-stone-300 font-mono tabular-nums text-xs focus:ring-2 focus:ring-rose-800 outline-none bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">وزن مخصوص (SG):</label>
                  <input
                    type="number"
                    step="0.001"
                    value={formSG}
                    onChange={(e) => handleSGChange(Number(e.target.value))}
                    className="w-full p-2 rounded-lg border border-stone-300 font-mono tabular-nums text-xs focus:ring-2 focus:ring-rose-800 outline-none bg-white font-bold text-rose-900"
                    required
                  />
                </div>
              </div>

              {/* SMART TRIGGER DETECTOR BANNER */}
              {detectedModalTrigger && (
                <div className="p-3.5 rounded-xl bg-amber-50 border-2 border-amber-400 text-amber-950 space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-rose-900">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{detectedModalTrigger.title}</span>
                  </div>
                  <p className="text-xs leading-relaxed text-stone-800">
                    {detectedModalTrigger.description}
                  </p>
                  {detectedModalTrigger.warning && (
                    <p className="text-xs font-bold text-rose-800 bg-rose-100/70 p-2 rounded-lg border border-rose-200">
                      {detectedModalTrigger.warning}
                    </p>
                  )}
                  <label className="flex items-start gap-2 pt-1 cursor-pointer font-bold text-stone-900">
                    <input
                      type="checkbox"
                      checked={autoRecordTriggerAddition}
                      onChange={(e) => {
                        setAutoRecordTriggerAddition(e.target.checked);
                        setFormIsTrigger(e.target.checked);
                      }}
                      className="w-4 h-4 accent-rose-800 mt-0.5 shrink-0"
                    />
                    <span>
                      علامت‌گذاری به عنوان نقطه تریگر و ثبت همزمان این دوز در جدول افزودنی‌های شیمیایی
                    </span>
                  </label>
                </div>
              )}

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">دمای کلاهک (°C):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formTempCap}
                    onChange={(e) => setFormTempCap(Number(e.target.value))}
                    className={`w-full p-2 rounded-lg border font-mono tabular-nums text-xs outline-none ${
                      formTempCap >= 28.5 ? 'border-rose-500 bg-rose-50 text-rose-900 font-bold' : 'border-stone-300'
                    }`}
                    required
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">دمای اتاق (°C):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formTempRoom}
                    onChange={(e) => setFormTempRoom(Number(e.target.value))}
                    className="w-full p-2 rounded-lg border border-stone-300 font-mono tabular-nums text-xs outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">شاخص pH:</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formPH}
                    onChange={(e) => {
                      setFormPH(Number(e.target.value));
                      setFormPhTouched(true);
                    }}
                    className="w-full p-2 rounded-lg border border-stone-300 font-mono tabular-nums text-xs outline-none font-bold text-purple-900"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">اسیدیته کل TA (g/L):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formTA || ''}
                    onChange={(e) => {
                      setFormTA(Number(e.target.value));
                      setFormTaTouched(true);
                    }}
                    placeholder="6.8"
                    className="w-full p-2 rounded-lg border border-stone-300 font-mono tabular-nums text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">سولفیت آزاد Free SO₂ (mg/L):</label>
                  <input
                    type="number"
                    step="1"
                    value={formFreeSO2 ?? ''}
                    onChange={(e) => setFormFreeSO2(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="32"
                    className="w-full p-2 rounded-lg border border-stone-300 font-mono tabular-nums text-xs outline-none text-rose-900 font-bold"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="pigeageCheck"
                  checked={formPigeage}
                  onChange={(e) => setFormPigeage(e.target.checked)}
                  className="w-4 h-4 accent-rose-800 cursor-pointer"
                />
                <label htmlFor="pigeageCheck" className="text-stone-800 font-bold cursor-pointer">
                  غوطه‌ورسازی (Pigeage) انجام شد
                </label>
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">یادداشت کارگاهی / افزوده تخصصی:</label>
                <textarea
                  value={formNote}
                  onChange={(e) => setFormNote(e.target.value)}
                  placeholder="توضیحات بوی اولیه، وضعیت حباب، تزریق مواد مغذی و..."
                  className="w-full p-2 rounded-lg border border-stone-300 text-xs focus:ring-2 focus:ring-rose-800 outline-none h-16 resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-bold cursor-pointer"
                >
                  انصراف
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-800 hover:bg-rose-900 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>ثبت لاگ واقعی</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 2: ADD CHEMICAL ADDITION                                        */}
      {/* ===================================================================== */}
      {showAddChemicalModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-300 space-y-4 font-['Vazirmatn',sans-serif]">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Beaker className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-stone-900 text-base">
                  ثبت افزودنی شیمیایی یا مغذی جدید (لاگ‌شیت ۳)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddChemicalModal(false)}
                className="text-stone-400 hover:text-stone-700 cursor-pointer p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddChemicalSubmit} className="space-y-3 text-xs">
              {/* SMART CHEMICAL & NUTRIENT CATALOG PRESET SELECTOR */}
              <div className="bg-amber-50 border border-amber-300 p-3 rounded-xl space-y-1.5">
                <label className="block text-amber-950 font-bold text-xs">
                  انتخاب سریع ماده افزودنی یا مغذی از کاتالوگ مستر پروتکل (با دوز محاسبه‌شده خودکار):
                </label>
                <select
                  value={selectedChemPresetId}
                  onChange={(e) => applyChemicalPreset(e.target.value, chemTankId)}
                  className="w-full p-2 rounded-lg border border-amber-400 bg-white font-bold text-stone-900 text-xs focus:ring-2 focus:ring-amber-700 outline-none"
                >
                  <option value="">— ورود دستی / افزودنی سفارشی —</option>
                  {Array.from(
                    new Set(
                      getSmartAdditivePresets(flexPlan, chemTankId).map((p) => p.categoryLabelFa)
                    )
                  ).map((catLabel) => (
                    <optgroup key={catLabel} label={catLabel}>
                      {getSmartAdditivePresets(flexPlan, chemTankId)
                        .filter((p) => p.categoryLabelFa === catLabel)
                        .map((preset) => (
                          <option key={preset.id} value={preset.id}>
                            {preset.labelFa}
                          </option>
                        ))}
                    </optgroup>
                  ))}
                </select>
                <p className="text-xs text-amber-900">
                  با انتخاب هر ترکیب، نام علمی، ایستگاه تزریق، مقدار دقیق متناسب با مخزن ({chemTankId === 'tank-rose' ? `${flexPlan.volumes.roseClarifiedFermentL}L رُزه` : `${flexPlan.volumes.redLiquidFermentPerTankL}L قرمز`}) و هدف بیوشیمیایی به صورت خودکار پر می‌شود.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">مخزن هدف:</label>
                  <select
                    value={chemTankId}
                    onChange={(e) => {
                      const nextTank = e.target.value as TankId;
                      setChemTankId(nextTank);
                      if (selectedChemPresetId) {
                        applyChemicalPreset(selectedChemPresetId, nextTank);
                      }
                    }}
                    className="w-full p-2 rounded-lg border border-stone-300 bg-white font-bold"
                  >
                    <option value="tank-a">مخزن قرمز A ({flexPlan.volumes.redLiquidFermentPerTankL}L)</option>
                    {tankCount !== 1 && (
                      <option value="tank-b">مخزن قرمز B ({flexPlan.volumes.redLiquidFermentPerTankL}L)</option>
                    )}
                    <option value="tank-rose">مخزن شراب رُزه ({flexPlan.volumes.roseClarifiedFermentL}L)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-700 font-bold mb-1">تاریخ و ساعت تزریق:</label>
                  <input
                    type="text"
                    value={chemTimestamp}
                    onChange={(e) => setChemTimestamp(e.target.value)}
                    className="w-full p-2 rounded-lg border border-stone-300 font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">مرحله فرآیند / ایستگاه:</label>
                <input
                  type="text"
                  value={chemStageTitle}
                  onChange={(e) => setChemStageTitle(e.target.value)}
                  className="w-full p-2 rounded-lg border border-stone-300"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block text-stone-700 font-bold mb-1">نام ترکیب / افزودنی:</label>
                  <input
                    type="text"
                    value={chemCompoundName}
                    onChange={(e) => {
                      setChemCompoundName(e.target.value);
                      setChemCompoundType(inferStructuredCompoundType(e.target.value, chemPubchemCid));
                      setPendingAdditionConfirm(false);
                    }}
                    className="w-full p-2 rounded-lg border border-stone-300 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-bold mb-1">مقدار و واحد:</label>
                  <div className="flex gap-1">
                    <input
                      type="number"
                      step="0.01"
                      value={chemAmount}
                      onChange={(e) => {
                        setChemAmount(parseFloat(e.target.value) || 0);
                        setPendingAdditionConfirm(false);
                      }}
                      className="w-full p-2 rounded-lg border border-stone-300 font-mono tabular-nums font-bold"
                      required
                    />
                    <select
                      value={chemUnit}
                      onChange={(e) => {
                        setChemUnit(e.target.value as typeof chemUnit);
                        setPendingAdditionConfirm(false);
                      }}
                      className="p-2 rounded-lg border border-stone-300 bg-white font-mono"
                    >
                      <option value="g">g</option>
                      <option value="mL">mL</option>
                      <option value="mg/L">mg/L</option>
                      <option value="kg">kg</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">نوع ساختاریافته ترکیب:</label>
                  <select
                    value={chemCompoundType}
                    onChange={(e) => {
                      setChemCompoundType(e.target.value as StructuredCompoundType);
                      setPendingAdditionConfirm(false);
                    }}
                    className="w-full p-2 rounded-lg border border-stone-300 bg-white font-bold"
                  >
                    <option value="kms">سولفیت (KMS — متابی‌سولفیت پتاسیم)</option>
                    <option value="bactiless">باکتی‌لس (Bactiless — چیتوسان)</option>
                    <option value="fermaid_o">فرمید O (Fermaid O — نیتروژن آلی)</option>
                    <option value="fermaid_k">فرمید K (Fermaid K)</option>
                    <option value="dap">فسفات دی‌آمونیم (DAP)</option>
                    <option value="zinc">سولفات روی (Zinc)</option>
                    <option value="tannin_red">تانن قرمز</option>
                    <option value="tannin_white">تانن سفید</option>
                    <option value="enzyme">آنزیم پکتولیتیک</option>
                    <option value="tartaric">اسید تارتاریک</option>
                    <option value="khco3">بی‌کربنات پتاسیم (KHCO₃)</option>
                    <option value="caco3">کربنات کلسیم (CaCO₃)</option>
                    <option value="copper">سولفات مس</option>
                    <option value="kht">کرم تارتار (KHT)</option>
                    <option value="glycerin">گلیسیرین</option>
                    <option value="ascorbic">اسید اسکوربیک (ویتامین C)</option>
                    <option value="h2o2">پراکسید هیدروژن (H₂O₂)</option>
                    <option value="yeast">مخمر شراب</option>
                    <option value="go_ferm">مغذی بیدارسازی (Go-Ferm)</option>
                    <option value="bentonite">بنتونیت</option>
                    <option value="other">سایر</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-700 font-bold mb-1">حجم مایع مرجع این مرحله (لیتر):</label>
                  <input
                    type="number"
                    step="0.5"
                    value={chemReferenceVolumeL}
                    onChange={(e) => {
                      setChemReferenceVolumeL(parseFloat(e.target.value) || 132);
                      setPendingAdditionConfirm(false);
                    }}
                    className="w-full p-2 rounded-lg border border-stone-300 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">هدف بیوشیمیایی / انولوژیک:</label>
                <input
                  type="text"
                  value={chemPurpose}
                  onChange={(e) => setChemPurpose(e.target.value)}
                  className="w-full p-2 rounded-lg border border-stone-300"
                  required
                />
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">شماره لات / رهگیری کیفی (Lot Number - اختیاری):</label>
                <input
                  type="text"
                  value={chemLotNumber}
                  onChange={(e) => setChemLotNumber(e.target.value)}
                  placeholder="e.g. LOT-RS-1403-09"
                  className="w-full p-2 rounded-lg border border-stone-300 font-mono text-xs uppercase"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">یادداشت اپراتور (اختیاری):</label>
                <input
                  type="text"
                  value={chemNote}
                  onChange={(e) => setChemNote(e.target.value)}
                  className="w-full p-2 rounded-lg border border-stone-300"
                />
              </div>

              {/* Pre-Commit Confirmation Box inside Modal (Idea 11) */}
              {pendingAdditionConfirm && (() => {
                const refVol = Number(chemReferenceVolumeL) > 0 ? Number(chemReferenceVolumeL) : 132;
                const ledger = enologyDb.getCumulativeSO2Ledger(
                  chemTankId,
                  refVol,
                  1.5,
                  undefined,
                  !enologyDb.hasDemoData(),
                  activeBatch?.id
                );
                const addedSo2 =
                  chemCompoundType === 'kms'
                    ? Math.round(
                        ((chemUnit === 'g' ? (Number(chemAmount) * 576) / refVol : Number(chemAmount)) *
                          10)
                      ) / 10
                    : 0;
                const newTotalSo2 =
                  Math.round((ledger.estimatedTotalSO2MgL + addedSo2) * 10) / 10;
                const overCeiling = newTotalSo2 > ledger.legalCeilingMgL;

                return (
                  <div className="bg-amber-50 border-2 border-amber-500 rounded-xl p-3 space-y-1.5 text-stone-900">
                    <div className="font-bold text-amber-950">
                      تأیید نهایی پیش از ثبت در دفتر (Pre-Commit Check):
                    </div>
                    <div>
                      ترکیب: <strong>{chemCompoundName}</strong> | مقدار:{' '}
                      <strong className="font-mono">
                        {chemAmount} {chemUnit}
                      </strong>{' '}
                      | حجم مرجع: <strong className="font-mono">{refVol} L</strong>
                    </div>
                    {chemCompoundType === 'kms' && (
                      <div
                        className={`font-mono font-bold ${
                          overCeiling ? 'text-rose-700' : 'text-emerald-800'
                        }`}
                      >
                        تأثیر سولفیت: +{addedSo2} mg/L ← بودجه تجمعی جدید: {newTotalSo2} از{' '}
                        {ledger.legalCeilingMgL} mg/L
                        {overCeiling && ' (هشدار: عبور از سقف قانونی ۱۵۰ mg/L!)'}
                      </div>
                    )}
                  </div>
                );
              })()}

              <div className="flex items-center justify-between pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => {
                    setPendingAdditionConfirm(false);
                    setShowAddChemicalModal(false);
                  }}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-bold cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>
                    {pendingAdditionConfirm
                      ? 'تأیید نهایی و ثبت قطعی در لاگ‌شیت ۳'
                      : 'بررسی و ثبت در لاگ‌شیت ۳'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 3: ADD LAB ANALYSIS RECORD                                      */}
      {/* ===================================================================== */}
      {showAddLabModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-300 space-y-4 font-['Vazirmatn',sans-serif]">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <FlaskConical className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-stone-900 text-base">
                  ثبت نتیجه تست آزمایشگاهی جدید
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddLabModal(false)}
                className="text-stone-400 hover:text-stone-700 cursor-pointer p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddLabSubmit} className="space-y-3 text-xs">
              {/* SMART LAB ANALYSIS PRESET SELECTOR */}
              <div className="bg-emerald-50 border border-emerald-300 p-3 rounded-xl space-y-1.5">
                <label className="block text-emerald-950 font-bold text-xs">
                  انتخاب سریع آزمون استاندارد آزمایشگاهی (پر کردن خودکار مشخصات تست):
                </label>
                <select
                  value={selectedLabPresetId}
                  onChange={(e) => applyLabPreset(e.target.value, labTankId)}
                  className="w-full p-2 rounded-lg border border-emerald-400 bg-white font-bold text-stone-900 text-xs focus:ring-2 focus:ring-emerald-700 outline-none"
                >
                  <option value="">— ورود دستی مشخصات آزمون —</option>
                  {getSmartLabPresets(flexPlan, labTankId).map((preset) => (
                    <option key={preset.id} value={preset.id}>
                      {preset.labelFa}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">مخزن هدف:</label>
                  <select
                    value={labTankId}
                    onChange={(e) => {
                      const nextTank = e.target.value as TankId;
                      setLabTankId(nextTank);
                      if (selectedLabPresetId) {
                        applyLabPreset(selectedLabPresetId, nextTank);
                      }
                    }}
                    className="w-full p-2 rounded-lg border border-stone-300 bg-white font-bold"
                  >
                    <option value="tank-a">مخزن قرمز A ({flexPlan.volumes.redLiquidFermentPerTankL}L)</option>
                    {tankCount !== 1 && (
                      <option value="tank-b">مخزن قرمز B ({flexPlan.volumes.redLiquidFermentPerTankL}L)</option>
                    )}
                    <option value="tank-rose">مخزن شراب رُزه ({flexPlan.volumes.roseClarifiedFermentL}L)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-700 font-bold mb-1">تاریخ آزمایش:</label>
                  <input
                    type="text"
                    value={labDate}
                    onChange={(e) => setLabDate(e.target.value)}
                    className="w-full p-2 rounded-lg border border-stone-300 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">نوع آزمون استاندارد:</label>
                  <select
                    value={labTestType}
                    onChange={(e) => setLabTestType(e.target.value as LabAnalysisRecord['testType'])}
                    className="w-full p-2 rounded-lg border border-stone-300 bg-white"
                  >
                    <option value="ripper_so2">تیتراسیون ریپر (Free SO2)</option>
                    <option value="ta_titration">تیتراسیون اسیدیته کل (TA)</option>
                    <option value="ph_meter">سنجش الکترود pH</option>
                    <option value="refractometer_correction">رفرکتومتر / Clinitest</option>
                    <option value="mlf_chromatography">کروماتوگرافی کاغذی (MLF)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-700 font-bold mb-1">پارامتر اندازه‌گیری‌شده:</label>
                  <input
                    type="text"
                    value={labAnalyte}
                    onChange={(e) => setLabAnalyte(e.target.value)}
                    className="w-full p-2 rounded-lg border border-stone-300 font-bold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">مقدار قرائت‌شده:</label>
                  <input
                    type="text"
                    value={labValue}
                    onChange={(e) => setLabValue(e.target.value)}
                    className="w-full p-2 rounded-lg border border-stone-300 font-mono tabular-nums font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-bold mb-1">واحد سنجش:</label>
                  <input
                    type="text"
                    value={labUnit}
                    onChange={(e) => setLabUnit(e.target.value)}
                    className="w-full p-2 rounded-lg border border-stone-300 font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">اقدام اصلاحی انجام‌شده:</label>
                <input
                  type="text"
                  value={labActionTaken}
                  onChange={(e) => setLabActionTaken(e.target.value)}
                  className="w-full p-2 rounded-lg border border-stone-300"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">یادداشت تکمیلی:</label>
                <input
                  type="text"
                  value={labNotes}
                  onChange={(e) => setLabNotes(e.target.value)}
                  className="w-full p-2 rounded-lg border border-stone-300"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setShowAddLabModal(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-bold cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>ثبت نتیجه آزمایش</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
