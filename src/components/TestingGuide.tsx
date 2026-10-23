import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  FlaskConical,
  Calculator,
  Thermometer,
  Scale,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Layers,
  ChevronDown,
  ChevronUp,
  FileCheck,
  Flame,
  Gauge,
  ArrowRight,
  Database,
  Save,
  Trash2,
  ExternalLink,
  History,
  Wrench,
  Activity,
  ShieldAlert,
  PlusCircle,
  RotateCcw
} from 'lucide-react';
import { enologyDb } from '../db/enologyDatabase.ts';
import type { SavedCalculation } from '../types/database.ts';
import { useLocalStorageState } from '../utils/useLocalStorage.ts';
import { evaluateEnologicalScenario } from '../utils/enologyTroubleshooting.ts';
import { RASHA_PROTOCOL } from '../data/protocolData.ts';
import {
  useFlexibleProtocol,
  computeDynamicProtocolPlan,
  type DynamicProtocolPlan
} from '../data/masterProtocolConfig.ts';
import { InteractiveLabWizardsPanel } from './InteractiveLabWizardsPanel.tsx';
import { useEnologyUi } from '../context/EnologyUiContext.tsx';
import { getLabToolEquipmentCompatibility } from '../utils/equipmentAdapterEngine.ts';
import {
  calculateTitratableAcidity,
  calculateTartaricAddition,
  calculateKHCO3Deacidification,
  calculateDeacidificationOptions,
  calculateFreeSO2Ripper,
  calculateMolecularSO2,
  correctHydrometer,
  calculateKMS,
  calculateRefractometerCorrection,
  calculateSNAAmounts,
  calculateBenchFiningGrams,
  calculateCoolingDryIceKg,
  getEffectiveLiquidVolume,
  isAlreadyLiquidVolume,
  getTargetFreeSO2ByPH,
  calculateDynamicSGTriggers,
  calculateH2O2SulfiteRemoval,
  estimateAcidOrBaseFromPHShift,
  calculateStagedH2O2Plan,
  calculateStockSolutionPlan,
  computeGraduatedSyringeMetrics,
  buildCalculatorDirectAdditions,
  type CalculatorDirectDoseKind
} from '../utils/enologyUtils.ts';
import { getCurrentPersianDateTimeStr } from '../utils/persianDate.ts';

export type LabHubSubTab = 'calculators-sops' | 'troubleshooting-crises' | 'saved-history';

export interface TestingGuideProps {
  onNavigateToTracking?: () => void;
  initialSelectedTest?: string;
  initialActiveSubTab?: LabHubSubTab;
}

function mapTestIdToSopFilter(testId?: string): string {
  if (!testId || testId === 'all') return 'all';
  if (testId.startsWith('sop-')) return testId;
  switch (testId) {
    case 'hydrometer_temp':
      return 'sop-01';
    case 'ta_titration':
    case 'tartaric_addition':
      return 'sop-02';
    case 'ph_meter':
    case 'ph_adjustment':
      return 'sop-03';
    case 'ripper_so2':
    case 'kms':
      return 'sop-04';
    case 'yan':
      return 'sop-05';
    case 'refractometer_correction':
      return 'sop-06';
    case 'dry_ice_cooling':
      return 'sop-07';
    case 'bench_fining':
    case 'mlf_chromatography':
      return 'sop-08';
    case 'dryness_check':
      return 'sop-09';
    default:
      return 'all';
  }
}

const StockSolutionSyringeSvg: React.FC<{
  volumeMl: number;
  labelFa: string;
  subtitleFa?: string;
  liquidColorHex?: string;
}> = ({ volumeMl, labelFa, subtitleFa, liquidColorHex }) => {
  const metrics = computeGraduatedSyringeMetrics(volumeMl);
  return (
    <div className="rounded-xl border border-line bg-paper p-3 mt-2 text-xs space-y-1.5">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className="font-bold text-ink">{labelFa}</span>
        <span className="ltr-metric font-bold text-wine">
          {metrics.volumeMl} mL / {metrics.barrelCapacityMl} mL
        </span>
      </div>
      {subtitleFa && <p className="text-ink-soft leading-relaxed">{subtitleFa}</p>}
      <svg
        viewBox="0 0 230 52"
        data-testid="stock-solution-syringe-svg"
        className="w-full h-14 overflow-visible"
        aria-label={labelFa}
      >
        {/* Needle tip & hub */}
        <line
          x1="8"
          y1="24"
          x2="26"
          y2="24"
          stroke="#6b625a"
          strokeWidth="1.8"
        />
        <rect
          x="26"
          y="19"
          width="8"
          height="10"
          rx="1.5"
          fill="#e4dccd"
          stroke="#6b625a"
          strokeWidth="1.2"
        />
        {/* Barrel body */}
        <rect
          x="34"
          y="10"
          width="140"
          height="28"
          rx="3"
          fill="#fbf9f4"
          stroke="#6b625a"
          strokeWidth="1.5"
        />
        {/* Filled liquid column */}
        <rect
          x="34"
          y="11"
          width={metrics.liquidWidth}
          height="26"
          fill={liquidColorHex ?? '#6e1f2f'}
          fillOpacity="0.78"
          style={{ transition: 'width 260ms ease' }}
        />
        {/* Rubber plunger stopper & rod */}
        <rect
          x={metrics.plungerX}
          y="10"
          width="6"
          height="28"
          rx="1.5"
          fill="#1f1a17"
          style={{ transition: 'x 260ms ease' }}
        />
        <line
          x1={metrics.plungerX + 6}
          y1="24"
          x2="214"
          y2="24"
          stroke="#6b625a"
          strokeWidth="3"
        />
        <rect
          x="214"
          y="13"
          width="5"
          height="22"
          rx="2"
          fill="#6b625a"
        />
        {/* Graduation ticks */}
        {metrics.majorTicks.map((t) => (
          <g key={t.ml}>
            <line
              x1={t.x}
              y1="10"
              x2={t.x}
              y2="17"
              stroke="#1f1a17"
              strokeWidth="1.2"
            />
            <text
              x={t.x}
              y="48"
              textAnchor="middle"
              className="text-xs fill-current text-ink-soft font-mono"
            >
              {t.ml}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

export const TestingGuide: React.FC<TestingGuideProps> = ({
  onNavigateToTracking,
  initialSelectedTest = 'all',
  initialActiveSubTab = 'calculators-sops'
}) => {
  const {
    labDeepLink,
    clearLabDeepLink,
    setActiveFiveTab,
    activeBatch,
    activeBatchId,
    targetTankIds,
    selectedTankLabelFa,
    scalePrecision,
    notifyDataChanged,
    equipmentProfile,
    equipmentCapabilities,
    openEquipmentModal,
    activeTankYeastStrain,
    openYeastSelectorModal
  } = useEnologyUi();
  const [onlyMyEquipmentTools, setOnlyMyEquipmentTools] = useState<boolean>(false);
  const [activeSubTab, setActiveSubTab] = useState<LabHubSubTab>(initialActiveSubTab);
  const [selectedFilter, setSelectedFilter] = useState<string>(() =>
    mapTestIdToSopFilter(initialSelectedTest)
  );
  const [focusedHaloTestId, setFocusedHaloTestId] = useState<string | null>(null);
  const [selectedWizardOverride, setSelectedWizardOverride] = useState<
    'ripper_so2' | 'ph_meter' | 'ta_titration' | 'mlf_chromatography' | 'hydrometer_temp' | undefined
  >(undefined);
  const [savedCalculations, setSavedCalculations] = useState<SavedCalculation[]>(() =>
    enologyDb.getSavedCalculations()
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [ledgerUndoToast, setLedgerUndoToast] = useState<{
    createdIds: string[];
    summaryFa: string;
    remainingSec: number;
  } | null>(null);
  const [showAllTsAlerts, setShowAllTsAlerts] = useState<boolean>(false);
  const [expandedTsScienceIds, setExpandedTsScienceIds] = useState<Record<number, boolean>>({});

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!ledgerUndoToast || ledgerUndoToast.remainingSec <= 0) return;
    const timer = setInterval(() => {
      setLedgerUndoToast((prev) => {
        if (!prev) return null;
        if (prev.remainingSec <= 1) return null;
        return { ...prev, remainingSec: prev.remainingSec - 1 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [ledgerUndoToast]);

  const handleDirectLogToTankLedger = (
    kind: CalculatorDirectDoseKind,
    config: {
      referenceVolumeL: number;
      primaryAmount: number;
      secondaryAmount?: number;
      tertiaryAmount?: number;
      calculatedSO2MgL?: number;
      phShiftMode?: 'acidification' | 'deacidification' | 'none';
      labelFa: string;
    }
  ) => {
    const createdIds: string[] = [];
    const nowStr = getCurrentPersianDateTimeStr();
    for (const tId of targetTankIds) {
      const additionsToSave = buildCalculatorDirectAdditions({
        kind,
        batchId: activeBatchId,
        tankId: tId,
        timestamp: nowStr,
        referenceVolumeL: config.referenceVolumeL,
        primaryAmount: config.primaryAmount,
        secondaryAmount: config.secondaryAmount,
        tertiaryAmount: config.tertiaryAmount,
        calculatedSO2MgL: config.calculatedSO2MgL,
        phShiftMode: config.phShiftMode
      });
      for (const item of additionsToSave) {
        const saved = enologyDb.addAddition(item);
        createdIds.push(saved.id);
      }
    }
    if (createdIds.length > 0) {
      notifyDataChanged();
      setLedgerUndoToast({
        createdIds,
        summaryFa:
          config.labelFa + ' در دفتر ' + selectedTankLabelFa + ' ثبت شد.',
        remainingSec: 10
      });
    }
  };

  const handleUndoDirectLedgerLog = () => {
    if (!ledgerUndoToast) return;
    for (const id of ledgerUndoToast.createdIds) {
      enologyDb.softDeleteAddition(id);
    }
    notifyDataChanged();
    setLedgerUndoToast(null);
    setToastMessage('ثبت افزودنی از دفتر مخزن واگرد (حذف) شد.');
  };

  const returnFromLabDeepLink = () => {
    const returnTab = labDeepLink?.returnToTab ?? 'today';
    clearLabDeepLink();
    setActiveFiveTab(returnTab);
  };

  // Collapsible SOP sections inside each of the 9 calculator cards
  const [expandedTests, setExpandedTests] = useState<Record<string, boolean>>({
    'sop-01': false,
    'sop-02': false,
    'sop-03': false,
    'sop-04': false,
    'sop-05': false,
    'sop-06': false,
    'sop-07': false,
    'sop-08': false,
    'sop-09': false,
  });

  useEffect(() => {
    if (initialSelectedTest) {
      const mapped = mapTestIdToSopFilter(initialSelectedTest);
      setSelectedFilter(mapped);
      if (mapped !== 'all') {
        setActiveSubTab('calculators-sops');
        setExpandedTests((prev) => ({ ...prev, [mapped]: true }));
      }
    }
  }, [initialSelectedTest]);

  useEffect(() => {
    if (initialActiveSubTab) {
      setActiveSubTab(initialActiveSubTab);
    }
  }, [initialActiveSubTab]);

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

  const reloadSavedCalcs = () => {
    setSavedCalculations(enologyDb.getSavedCalculations());
  };

  const handleDeleteSavedCalc = (id: string) => {
    enologyDb.deleteCalculation(id);
    reloadSavedCalcs();
    showToast('محاسبه از پایگاه داده حذف شد.');
  };

  const toggleExpand = (id: string) => {
    setExpandedTests((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const { params: flexParams, plan: flexPlan } = useFlexibleProtocol();

  const toggleAllSops = (open: boolean) => {
    setExpandedTests({
      'sop-01': open,
      'sop-02': open,
      'sop-03': open,
      'sop-04': open,
      'sop-05': open,
      'sop-06': open,
      'sop-07': open,
      'sop-08': open,
      'sop-09': open,
    });
  };

  // ============================================================================
  // 1. State for Calculator 1 (SOP-01): Hydrometer & Brix & Refractometer
  // ============================================================================
  const [hydroMeasuredSG, setHydroMeasuredSG] = useLocalStorageState<number>('enology_calc_hydro_sg', 1.006);
  const [hydroTemp, setHydroTemp] = useLocalStorageState<number>('enology_calc_hydro_temp', 28);
  const [refractOrigBrix, setRefractOrigBrix] = useLocalStorageState<number>('enology_calc_refract_orig_brix', 22);
  const [refractReadingBrix, setRefractReadingBrix] = useLocalStorageState<number>('enology_calc_refract_curr_brix', 11.5);

  const hydroCorrection = correctHydrometer(hydroMeasuredSG, hydroTemp);
  const refractCorrection = calculateRefractometerCorrection(refractOrigBrix, refractReadingBrix);

  const handleSaveHydro = () => {
    enologyDb.saveCalculation({
      calculatorType: 'hydrometer_temp',
      title: `تصحیح دمای هیدرومتر (${hydroTemp}°C و SG ${hydroMeasuredSG})`,
      inputs: {
        'دانسیته خوانده‌شده (SG)': hydroMeasuredSG,
        'دمای نمونه (°C)': hydroTemp
      },
      results: {
        'دانسیته تصحیح‌شده نهایی (20°C)': hydroCorrection.trueSG,
        'میزان انحراف دمایی (ΔSG)': hydroCorrection.delta
      },
      notes: 'کالیبراسیون استاندارد انولوژی در ۲۰ درجه سانتی‌گراد (SOP-TEST-01)'
    });
    reloadSavedCalcs();
    showToast('نتیجه تصحیح دمای هیدرومتر در پایگاه داده ثبت شد.');
  };

  const handleSaveRefract = () => {
    enologyDb.saveCalculation({
      calculatorType: 'refractometer_correction',
      title: `اصلاح خطای رفرکتومتر (بریکس اولیه ${refractOrigBrix}، فعلی ${refractReadingBrix})`,
      inputs: {
        'بریکس اولیه (Brix₀)': refractOrigBrix,
        'قرائت فعلی رفرکتومتر': refractReadingBrix
      },
      results: {
        'بریکس واقعی': `${refractCorrection.trueBrix} °Bx`,
        'وزن مخصوص واقعی (SG)': refractCorrection.trueSG,
        'الکل تخمینی (ABV)': `${refractCorrection.abv}%`
      },
      notes: 'اصلاح ضریب شکست نور در حضور اتانول به روش Boulton/Terrill (SOP-TEST-01)'
    });
    reloadSavedCalcs();
    showToast('نتیجه اصلاح رفرکتومتر در پایگاه داده ثبت شد.');
  };

  // ============================================================================
  // 2. State for Calculator 2 (SOP-02): Titratable Acidity (TA) & Tartaric
  // ============================================================================
  const [taNaOHVol, setTaNaOHVol] = useLocalStorageState<number>('enology_calc_ta_naoh_vol', 4.2);
  const [taNaOHNorm, setTaNaOHNorm] = useLocalStorageState<number>('enology_calc_ta_naoh_norm', 0.1);
  const [taSampleVol, setTaSampleVol] = useLocalStorageState<number>('enology_calc_ta_sample_vol', 5);
  const [taTarget, setTaTarget] = useLocalStorageState<number>('enology_calc_ta_target', 6.5);
  const [taBatchVolume, setTaBatchVolume] = useLocalStorageState<number>('enology_calc_ta_batch_vol', 132);
  const [taUnpressedMash, setTaUnpressedMash] = useLocalStorageState<boolean>('enology_calc_ta_unpressed', false);

  const currentTA = calculateTitratableAcidity(taNaOHVol, taNaOHNorm, taSampleVol);
  const tartaricNeeded = calculateTartaricAddition(currentTA, taTarget, taBatchVolume, taUnpressedMash);
  const effectiveTaLiquidVol = getEffectiveLiquidVolume(
    taBatchVolume,
    taUnpressedMash,
    flexParams.redMashLiquidYieldFactor
  );
  const taDeacidOptions = calculateDeacidificationOptions(
    Math.max(0, currentTA - taTarget),
    effectiveTaLiquidVol
  );

  const handleSaveTA = () => {
    enologyDb.saveCalculation({
      calculatorType: 'tartaric_addition',
      title: `تیتراسیون اسیدیته کل (TA = ${currentTA} g/L) برای حجم ${taBatchVolume} لیتر`,
      inputs: {
        'حجم سود مصرفی (mL)': taNaOHVol,
        'نرمالیته سود (N)': taNaOHNorm,
        'حجم نمونه (mL)': taSampleVol,
        'TA هدف (g/L)': taTarget,
        'حجم مخزن (L)': taBatchVolume
      },
      results: {
        'اسیدیته فعلی (TA)': `${currentTA} g/L`,
        'اسید تارتاریک مورد نیاز': `${tartaricNeeded} g`
      },
      notes: 'تیتراسیون اسیدیته کل و اصلاح با اسید تارتاریک خوراکی L(+) (SOP-TEST-02)'
    });
    reloadSavedCalcs();
    showToast('نتیجه تیتراسیون TA و دوز اسید تارتاریک در پایگاه داده ذخیره شد.');
  };

  // ============================================================================
  // 3. State for Calculator 3 (SOP-03): pH, Acidification & Deacidification
  // ============================================================================
  const [samplePH, setSamplePH] = useLocalStorageState<number>('enology_calc_ph_sample', 3.65);
  const [targetPH, setTargetPH] = useLocalStorageState<number>('enology_calc_ph_target', 3.52);
  const [phBatchVolume, setPhBatchVolume] = useLocalStorageState<number>('enology_calc_ph_vol', 132);
  const [phUnpressedMash, setPhUnpressedMash] = useLocalStorageState<boolean>('enology_calc_ph_unpressed', false);

  const effectivePhVol = getEffectiveLiquidVolume(
    phBatchVolume,
    phUnpressedMash,
    flexParams.redMashLiquidYieldFactor
  );
  // Acidification: 1.0 g/L Tartaric Acid per 0.1 pH unit drop
  const phDropNeeded = Math.max(0, samplePH - targetPH);
  const tartaricForPH = Math.round(phDropNeeded * 10 * effectivePhVol * 10) / 10;
  // Deacidification: Exact 1.33 g/L stoichiometric KHCO3 per 0.1 pH unit increase (or 1.0 g/L TA reduction)
  const phRiseNeeded = Math.max(0, targetPH - samplePH);
  const khco3ForPH = calculateKHCO3Deacidification(samplePH, targetPH, phBatchVolume, phUnpressedMash);
  const deacidOptions = calculateDeacidificationOptions(phRiseNeeded * 10, effectivePhVol);
  const phShiftEstimate = estimateAcidOrBaseFromPHShift(samplePH, targetPH, effectivePhVol);

  const handleSavePH = () => {
    enologyDb.saveCalculation({
      calculatorType: 'ph_adjustment',
      title: `تنظیم pH از ${samplePH} به ${targetPH} برای حجم مؤثر ${effectivePhVol} لیتر`,
      inputs: {
        'pH فعلی نمونه': samplePH,
        'pH هدف': targetPH,
        'حجم کل (L)': phBatchVolume,
        'حجم مایع مؤثر (L)': effectivePhVol
      },
      results:
        phRiseNeeded > 0
          ? {
              'نوع اصلاح': 'اسیدزدایی استوکیومتری (افزایش pH)',
              'بی‌کربنات پتاسیم خالص (1.33 g/L)': `${deacidOptions.khco3StoichiometricGrams} g`,
              'بی‌کربنات پتاسیم با سرمازدایی (1.00 g/L)': `${deacidOptions.khco3WithColdStabGrams} g`,
              'کربنات کلسیم (0.67 g/L)': `${deacidOptions.caco3Grams} g`
            }
          : {
              'نوع اصلاح': 'اسیدزایی (کاهش pH)',
              'اسید تارتاریک پیشنهادی': `${tartaricForPH} g`
            },
      notes: 'محاسبه استوکیومتری تغییر pH (1.0 g/L تارتاریک یا 1.33 g/L بی‌کربنات پتاسیم به ازای هر 0.1 واحد pH) (SOP-TEST-03)'
    });
    reloadSavedCalcs();
    showToast('محاسبه تنظیم pH در پایگاه داده ذخیره شد.');
  };

  // ============================================================================
  // 4. State for Calculator 4 (SOP-04): Free SO2 Ripper, Molecular SO2 & KMS
  // ============================================================================
  const [ripperI2Vol, setRipperI2Vol] = useLocalStorageState<number>('enology_calc_ripper_i2_vol', 1.4);
  const [ripperI2Norm, setRipperI2Norm] = useLocalStorageState<number>('enology_calc_ripper_i2_norm', 0.02);
  const [ripperSampleVol, setRipperSampleVol] = useLocalStorageState<number>('enology_calc_ripper_sample_vol', 25);
  const [winePHForSO2, setWinePHForSO2] = useLocalStorageState<number>('enology_calc_so2_ph', 3.52);
  const [kmsCurrentSO2, setKmsCurrentSO2] = useLocalStorageState<number>('enology_calc_kms_current_so2', 18);
  const [kmsTargetSO2, setKmsTargetSO2] = useLocalStorageState<number>('enology_calc_kms_target_so2', 35);
  const [kmsVolume, setKmsVolume] = useLocalStorageState<number>('enology_calc_kms_vol', 105);
  const [kmsUnpressedMash, setKmsUnpressedMash] = useLocalStorageState<boolean>('enology_calc_kms_unpressed', false);
  const [useRipperForKMS, setUseRipperForKMS] = useLocalStorageState<boolean>('enology_calc_kms_use_ripper', false);

  const calculatedFreeSO2 = calculateFreeSO2Ripper(ripperI2Vol, ripperI2Norm, ripperSampleVol);
  const activeCurrentSO2 = useRipperForKMS ? calculatedFreeSO2 : kmsCurrentSO2;
  const calculatedMolSO2 = calculateMolecularSO2(activeCurrentSO2, winePHForSO2);
  const neededKMS = calculateKMS(kmsVolume, activeCurrentSO2, kmsTargetSO2, kmsUnpressedMash);

  const handleSaveKMS = () => {
    enologyDb.saveCalculation({
      calculatorType: 'kms',
      title: `محاسبه متابی‌سولفیت (KMS) و SO2 مولکولی برای حجم ${kmsVolume} لیتر`,
      inputs: {
        'حجم مخزن (لیتر)': kmsVolume,
        'سولفیت آزاد فعلی (mg/L)': activeCurrentSO2,
        'سولفیت هدف (mg/L)': kmsTargetSO2,
        'pH شراب': winePHForSO2,
        'توده کراش‌شده با پوست': kmsUnpressedMash ? 'بله (ضریب ۰.۸)' : 'خیر'
      },
      results: {
        'سولفیت مولکولی فعال': `${calculatedMolSO2} mg/L`,
        'مقدار خالص پودر KMS': `${neededKMS} گرم`
      },
      notes: 'محاسبه استاندارد SO2 آزاد و مولکولی با بازده ۵۷.۶٪ پودر متابی‌سولفیت پتاسیم (SOP-TEST-04)'
    });
    reloadSavedCalcs();
    showToast('نتیجه محاسبه متابی‌سولفیت پتاسیم (KMS) در پایگاه داده ذخیره شد.');
  };

  // ============================================================================
  // 5. State for Calculator 5 (SOP-05): YAN Nitrogen Budget & 3-Stage SNA
  // ============================================================================
  const [snaBrix, setSnaBrix] = useLocalStorageState<number>('enology_calc_yan_brix', 22);
  const [snaVolume, setSnaVolume] = useLocalStorageState<number>('enology_calc_yan_vol', 132);
  const [snaNaturalYAN, setSnaNaturalYAN] = useLocalStorageState<number>('enology_calc_yan_natural', 100);
  const [snaStrainDemand, setSnaStrainDemand] = useLocalStorageState<'low' | 'medium' | 'high'>(
    'enology_calc_yan_strain',
    'medium'
  );
  const [snaUnpressedMash, setSnaUnpressedMash] = useLocalStorageState<boolean>('enology_calc_yan_unpressed', false);

  const snaResults = calculateSNAAmounts(
    snaVolume,
    snaBrix,
    snaStrainDemand,
    snaNaturalYAN,
    undefined,
    snaUnpressedMash,
    flexParams.redMashLiquidYieldFactor,
    {
      fermaidO1RateGL: flexParams.fermaidO1RedRateGL,
      fermaidK2RateGL: flexParams.fermaidK2RedRateGL,
      dap2RateGL: flexParams.dap2RedRateGL,
      fermaidO3RateGL: flexParams.fermaidO3RedRateGL,
      zincRateGL: flexParams.zincSafeRateGL,
      yanMultiplierOverride: activeTankYeastStrain.yanMultiplier
    }
  );

  const handleSaveYAN = () => {
    enologyDb.saveCalculation({
      calculatorType: 'yan',
      title: `بودجه‌بندی نیتروژن YAN برای بریکس ${snaBrix} و حجم ${snaResults.effectiveVolumeL} لیتر`,
      inputs: {
        'بریکس اولیه': snaBrix,
        'نیتروژن طبیعی آب‌انگور (mg N/L)': snaNaturalYAN,
        'حجم کل (لیتر)': snaVolume,
        'حجم مایع مؤثر (لیتر)': snaResults.effectiveVolumeL
      },
      results: {
        'قند اولیه (% w/v)': `${snaResults.sugarGPerL} g/L`,
        'نیاز کل YAN': `${snaResults.targetYAN} mg N/L`,
        'کمبود YAN': `${snaResults.neededYAN} mg N/L`,
        'نیتروژن شیمیایی / زیستی': `${snaResults.suppliedChemicalYAN_mgL} / ${snaResults.suppliedBioEquivalentYAN_mgL} mg/L`,
        'SNA-1 (SG 1.083)': `${snaResults.fermaidO_1}g Fermaid O`,
        'SNA-2 (SG 1.070)': `${snaResults.fermaidK_2}g Fermaid K + ${snaResults.dap_2}g DAP + ${snaResults.zinc_2}g Zinc`,
        'SNA-3 (SG 1.057)': `${snaResults.fermaidO_3}g Fermaid O (100% Organic)`
      },
      notes: 'تغذیه ۳ مرحله‌ای پله‌ای مخمر RC-212 با رعایت حذف کامل DAP در نیمه قند (SOP-TEST-05)'
    });
    reloadSavedCalcs();
    showToast('بودجه‌بندی تغذیه YAN در پایگاه داده ذخیره شد.');
  };

  // ============================================================================
  // 6. State for Calculator 6 (SOP-06): Cap Temp & Dry Ice / Ice Bottles Cooling
  // ============================================================================
  const [capTempCurrent, setCapTempCurrent] = useLocalStorageState<number>('enology_calc_cool_curr_temp', 29.5);
  const [capTempTarget, setCapTempTarget] = useLocalStorageState<number>('enology_calc_cool_target_temp', 26.5);
  const [coolingBatchVol, setCoolingBatchVol] = useLocalStorageState<number>('enology_calc_cool_vol', 132);

  const dryIceNeededKg = calculateCoolingDryIceKg(coolingBatchVol, capTempCurrent, capTempTarget);
  // Each 1.5L frozen water bottle absorbs ~500 kJ (melting latent heat + warming to 20°C)
  const totalHeatKj = Math.max(0, coolingBatchVol * 3.9 * (capTempCurrent - capTempTarget));
  const iceBottlesNeeded = Math.ceil(totalHeatKj / 500);

  const handleSaveCooling = () => {
    enologyDb.saveCalculation({
      calculatorType: 'dry_ice_cooling',
      title: `خنک‌سازی اضطراری کلاهک از ${capTempCurrent}°C به ${capTempTarget}°C (${coolingBatchVol}L)`,
      inputs: {
        'دمای فعلی کلاهک (°C)': capTempCurrent,
        'دمای هدف (°C)': capTempTarget,
        'حجم مخزن (L)': coolingBatchVol
      },
      results: {
        'بار حرارتی مازاد (Q)': `${Math.round(totalHeatKj)} kJ`,
        'یخ خشک مورد نیاز': `${dryIceNeededKg} kg`,
        'معادل بطری یخ ۱.۵ لیتری': `${iceBottlesNeeded} عدد`
      },
      notes: 'مدیریت بحران حرارتی کلاهک و جلوگیری از شوک حرارتی مخمر (SOP-TEST-06)'
    });
    reloadSavedCalcs();
    showToast('محاسبه خنک‌سازی حرارتی کلاهک در پایگاه داده ذخیره شد.');
  };

  // ============================================================================
  // 7. State for Calculator 7 (SOP-07): Dryness & Residual Sugar Verification
  // ============================================================================
  const [drynessSG, setDrynessSG] = useLocalStorageState<number>('enology_calc_dryness_sg', 0.993);
  const [drynessStableDays, setDrynessStableDays] = useLocalStorageState<number>('enology_calc_dryness_days', 3);
  const [drynessRS, setDrynessRS] = useLocalStorageState<number>('enology_calc_dryness_rs', 1.5);

  const isDryConfirmed = drynessSG <= 0.995 && drynessStableDays >= 2 && drynessRS < 2.0;

  const handleSaveDryness = () => {
    enologyDb.saveCalculation({
      calculatorType: 'dryness_check',
      title: `تست خشکی نهایی شراب (SG ${drynessSG} | قند باقی‌مانده ${drynessRS} g/L)`,
      inputs: {
        'وزن مخصوص در ۲۰°C': drynessSG,
        'ثبات متوالی هیدرومتر (روز)': drynessStableDays,
        'قند احیاکننده (Clinitest g/L)': drynessRS
      },
      results: {
        'وضعیت خشکی مطلق': isDryConfirmed ? 'تایید نهایی (آماده سیفون و سرمایش)' : 'تخمیر ناتمام (ادامه پایش در ۲۲ درجه)',
        'ریسک تخمیر مجدد در بطری': drynessRS < 2.0 ? 'صفر (ایمن)' : 'بالا (خطرناک)'
      },
      notes: 'ارزیابی سه شرط پایان تخمیر الکلی پیش از سیفون روز دهم (SOP-TEST-07)'
    });
    reloadSavedCalcs();
    showToast('نتیجه تست خشکی شراب در پایگاه داده ذخیره شد.');
  };

  // ============================================================================
  // 8. State for Calculator 8 (SOP-08): Bench Fining (Bentonite) & Copper Trial
  // ============================================================================
  const [finingTrialRate, setFiningTrialRate] = useLocalStorageState<number>('enology_calc_fining_rate', 0.2); // g/L
  const [finingTankVol, setFiningTankVol] = useLocalStorageState<number>('enology_calc_fining_vol', 36);
  const [copperDoseMgL, setCopperDoseMgL] = useLocalStorageState<number>('enology_calc_copper_dose', 0.25); // mg/L
  const [copperTankVol, setCopperTankVol] = useLocalStorageState<number>('enology_calc_copper_vol', 105);

  const finingGramsNeeded = calculateBenchFiningGrams(finingTrialRate, finingTankVol);
  const bentoniteSlurry5PercentMl = Math.round((finingGramsNeeded / 0.05) * 10) / 10;
  // Stock #2 is 0.1% CuSO4 (1.0 mg/mL)
  const copperStock2Ml = Math.round(copperDoseMgL * copperTankVol * 10) / 10;

  const handleSaveFining = () => {
    enologyDb.saveCalculation({
      calculatorType: 'bench_fining',
      title: `تست فینینگ بنتونیت (${finingTrialRate} g/L) و محلول استوک مس (${copperDoseMgL} mg/L)`,
      inputs: {
        'دوز بهینه بنتونیت (g/L)': finingTrialRate,
        'حجم مخزن فینینگ (L)': finingTankVol,
        'دوز مس انتخابی (mg/L)': copperDoseMgL,
        'حجم مخزن شراب صاف (L)': copperTankVol
      },
      results: {
        'پودر خشک بنتونیت': `${finingGramsNeeded} g (معادل ${bentoniteSlurry5PercentMl} mL دوغاب ۵٪)`,
        'حجم محلول استوک ۲ سولفات مس (۰.۱٪)': `${copperStock2Ml} mL`
      },
      notes: 'تبدیل تست سریالی لوله آزمایشگاهی به مقیاس مخزن (SOP-TEST-08)'
    });
    reloadSavedCalcs();
    showToast('محاسبه فینینگ بنتونیت و استوک مس در پایگاه داده ذخیره شد.');
  };

  // ============================================================================
  // 9. State for Calculator 9 (SOP-09): Batch Mass & Volume Scaling (400kg Base)
  // ============================================================================
  const [grapeWeight, setGrapeWeight] = useLocalStorageState<number>('enology_calc_grape_weight', 400);

  const scaledPlan = computeDynamicProtocolPlan({
    ...flexParams,
    grapeWeightKg: grapeWeight
  });

  const scaledBatch = {
    mashVolume: scaledPlan.volumes.totalCrushedMashL,
    liquidVolume: scaledPlan.volumes.initialLiquidL,
    saigneeVolume: scaledPlan.volumes.saigneeTotalL,
    roseFermentVolume: scaledPlan.volumes.roseClarifiedFermentL,
    roseFinalVolume: scaledPlan.volumes.roseFinalBottlingL,
    roseBottles: scaledPlan.volumes.roseBottles750ml,
    redFermVolume: scaledPlan.volumes.redLiquidFermentTotalL,
    redPerTankVolume: scaledPlan.volumes.redLiquidFermentPerTankL,
    freeRunRed: scaledPlan.volumes.freeRunTotalL,
    heavyPressRed: scaledPlan.volumes.heavyPressTotalL,
    rackedRedDay10: scaledPlan.volumes.rack1TotalL,
    redFinalVolume: scaledPlan.volumes.finalRedTotalL,
    redBottles: scaledPlan.volumes.redBottles750ml,
  };

  const handleSaveBatchScaling = () => {
    enologyDb.saveCalculation({
      calculatorType: 'batch_scaling',
      title: `موازنه جرم و حجم برای ${grapeWeight} کیلوگرم انگور رشه سردشت`,
      inputs: {
        'وزن انگور ورودی (کیلوگرم)': grapeWeight,
        'پروفایل فعال': flexParams.presetId === 'classic_v32' ? 'کلاسیک نسخه ۳.۲' : 'ایده‌آل محافظه‌کارانه نسخه ۲'
      },
      results: {
        'حجم کل مش': `${scaledBatch.mashVolume} L`,
        'فاز مایع پس از سانیه': `${scaledBatch.redFermVolume} L (${scaledBatch.redPerTankVolume}L در هر مخزن)`,
        'شراب قرمز نهایی': `${scaledBatch.redFinalVolume} L (${scaledBatch.redBottles} بطری)`,
        'شراب رُزه سینه‌ای': `${scaledBatch.roseFinalVolume} L (${scaledBatch.roseBottles} بطری)`,
        'تعداد کل بطری‌ها': `${scaledBatch.redBottles + scaledBatch.roseBottles} بطری`
      },
      notes: 'موازنه مهندسی جرم و حجم بر اساس بازده استاندارد انگور دیم رشه سردشت (SOP-TEST-09)'
    });
    reloadSavedCalcs();
    showToast('موازنه جرم و حجم در پایگاه داده ذخیره شد.');
  };

  // ============================================================================
  // Interactive Scenario & Crisis Troubleshooter State (Sub-Tab 2)
  // ============================================================================
  const [tsVol, setTsVol] = useLocalStorageState<number>('enology_calc_ts_vol', 132);
  const [tsSG, setTsSG] = useLocalStorageState<number>('enology_calc_ts_sg', 1.060);
  const [tsBrix, setTsBrix] = useLocalStorageState<number>('enology_calc_ts_brix', 14.5);
  const [tsTemp, setTsTemp] = useLocalStorageState<number>('enology_calc_ts_temp', 28.5);
  const [tsPH, setTsPH] = useLocalStorageState<number>('enology_calc_ts_ph', 3.65);
  const [tsTA, setTsTA] = useLocalStorageState<number>('enology_calc_ts_ta', 6.2);
  const [tsSO2, setTsSO2] = useLocalStorageState<number>('enology_calc_ts_so2', 20);
  const [tsUnpressed, setTsUnpressed] = useLocalStorageState<boolean>('enology_calc_ts_unpressed', false);
  const [tsStuck, setTsStuck] = useLocalStorageState<boolean>('enology_calc_ts_stuck', false);
  const [tsH2S, setTsH2S] = useLocalStorageState<boolean>('enology_calc_ts_h2s', false);
  const [tsVA, setTsVA] = useLocalStorageState<boolean>('enology_calc_ts_va', false);
  const [tsDryCap, setTsDryCap] = useLocalStorageState<boolean>('enology_calc_ts_dry_cap', false);
  const [tsBitterSeeds, setTsBitterSeeds] = useLocalStorageState<boolean>('enology_calc_ts_bitter_seeds', false);
  const [tsCloudy, setTsCloudy] = useLocalStorageState<boolean>('enology_calc_ts_cloudy', false);
  const [tsIsRose, setTsIsRose] = useLocalStorageState<boolean>('enology_calc_ts_is_rose', false);
  const [postPressActualVol, setPostPressActualVol] = useLocalStorageState<number>('enology_calc_post_press_vol', 96);
  const [blendPressPct, setBlendPressPct] = useLocalStorageState<number>('enology_calc_blend_press_pct', 3);
  const [glycerinDoseGL, setGlycerinDoseGL] = useLocalStorageState<number>('enology_calc_glycerin_dose', 2.5);
  const postPressBactilessG = Math.round(0.3 * postPressActualVol * 100) / 100;
  const postPressKmsG = Math.round(0.07 * postPressActualVol * 100) / 100;

  useEffect(() => {
    if (!labDeepLink) return;
    if (labDeepLink.subTab) {
      setActiveSubTab(labDeepLink.subTab);
    }
    if (labDeepLink.testId) {
      const mappedSop = mapTestIdToSopFilter(labDeepLink.testId);
      setSelectedFilter(mappedSop);
      if (mappedSop !== 'all') {
        setExpandedTests((prev) => ({ ...prev, [mappedSop]: true }));
        setFocusedHaloTestId(mappedSop);
        setTimeout(() => {
          document
            .getElementById('lab-test-card-' + mappedSop)
            ?.scrollIntoView?.({ behavior: 'smooth', block: 'center' });
        }, 80);
        setTimeout(() => setFocusedHaloTestId(null), 2500);
      }
      if (
        labDeepLink.testId === 'ripper_so2' ||
        labDeepLink.testId === 'kms' ||
        labDeepLink.testId === 'sop-04'
      ) {
        setSelectedWizardOverride('ripper_so2');
      } else if (
        labDeepLink.testId === 'ta_titration' ||
        labDeepLink.testId === 'tartaric_addition' ||
        labDeepLink.testId === 'sop-02'
      ) {
        setSelectedWizardOverride('ta_titration');
      } else if (
        labDeepLink.testId === 'ph_meter' ||
        labDeepLink.testId === 'ph_adjustment' ||
        labDeepLink.testId === 'sop-03'
      ) {
        setSelectedWizardOverride('ph_meter');
      } else if (
        labDeepLink.testId === 'mlf_chromatography' ||
        labDeepLink.testId === 'sop-08'
      ) {
        setSelectedWizardOverride('mlf_chromatography');
      } else if (
        labDeepLink.testId === 'hydrometer_temp' ||
        labDeepLink.testId === 'dryness_check' ||
        labDeepLink.testId === 'sop-01' ||
        labDeepLink.testId === 'sop-07'
      ) {
        setSelectedWizardOverride('hydrometer_temp');
      }
    }
    if (labDeepLink.prefillSG !== undefined) {
      setTsSG(labDeepLink.prefillSG);
      setHydroMeasuredSG(labDeepLink.prefillSG);
      setDrynessSG(labDeepLink.prefillSG);
    }
    if (labDeepLink.prefillPH !== undefined) {
      setTsPH(labDeepLink.prefillPH);
      setSamplePH(labDeepLink.prefillPH);
      setWinePHForSO2(labDeepLink.prefillPH);
    }
    if (labDeepLink.prefillSO2 !== undefined) {
      setTsSO2(labDeepLink.prefillSO2);
      setKmsCurrentSO2(labDeepLink.prefillSO2);
    }
    if (labDeepLink.prefillTA !== undefined) {
      setTsTA(labDeepLink.prefillTA);
    }
    if (labDeepLink.prefillTempC !== undefined) {
      setTsTemp(labDeepLink.prefillTempC);
      setCapTempCurrent(labDeepLink.prefillTempC);
      setHydroTemp(labDeepLink.prefillTempC);
    }
    if (labDeepLink.prefillVolumeL !== undefined) {
      setTsVol(labDeepLink.prefillVolumeL);
      setKmsVolume(labDeepLink.prefillVolumeL);
      setPhBatchVolume(labDeepLink.prefillVolumeL);
      setTaBatchVolume(labDeepLink.prefillVolumeL);
      setCoolingBatchVol(labDeepLink.prefillVolumeL);
    }
  }, [
    labDeepLink,
    setTsPH,
    setTsSG,
    setTsSO2,
    setTsTA,
    setTsTemp,
    setTsVol,
    setHydroMeasuredSG,
    setDrynessSG,
    setSamplePH,
    setWinePHForSO2,
    setKmsCurrentSO2,
    setCapTempCurrent,
    setHydroTemp,
    setKmsVolume,
    setPhBatchVolume,
    setTaBatchVolume,
    setCoolingBatchVol
  ]);

  const dynamicTriggers = calculateDynamicSGTriggers(snaResults.initialSG, {
    pressingPoint: flexPlan.triggers.pressingSG,
    drynessPoint: flexPlan.triggers.drynessSG
  });
  const pHBasedSO2Target = useMemo(() => getTargetFreeSO2ByPH(winePHForSO2), [winePHForSO2]);
  const effectiveKmsVol = getEffectiveLiquidVolume(
    kmsVolume,
    kmsUnpressedMash,
    flexParams.redMashLiquidYieldFactor
  );
  const h2o2NeutralizationMl = calculateH2O2SulfiteRemoval(
    effectiveKmsVol,
    activeCurrentSO2,
    kmsTargetSO2
  );
  const stagedH2O2Plan = useMemo(
    () => calculateStagedH2O2Plan(effectiveKmsVol, activeCurrentSO2, kmsTargetSO2),
    [effectiveKmsVol, activeCurrentSO2, kmsTargetSO2]
  );
  const liveSO2LedgerTankA = enologyDb.getCumulativeSO2Ledger(
    'tank-a',
    flexPlan.volumes.initialLiquidPerTankL,
    1.5,
    undefined,
    !enologyDb.hasDemoData(),
    activeBatch?.id
  );

  const handleSyncPlanToCalculators = (plan: DynamicProtocolPlan) => {
    setRefractOrigBrix(plan.params.initialBrix);
    setTaBatchVolume(plan.volumes.redLiquidFermentPerTankL);
    setTaUnpressedMash(false);
    setTargetPH(plan.params.targetRedPH);
    setPhBatchVolume(plan.volumes.redLiquidFermentPerTankL);
    setPhUnpressedMash(false);
    setKmsVolume(plan.volumes.rack1PerTankL);
    setKmsUnpressedMash(false);
    setWinePHForSO2(plan.params.targetRedPH);
    setSnaBrix(plan.params.initialBrix);
    setSnaVolume(plan.volumes.redLiquidFermentPerTankL);
    setSnaNaturalYAN(plan.params.naturalMustYANMgL);
    setSnaUnpressedMash(false);
    setCoolingBatchVol(plan.volumes.redLiquidFermentPerTankL);
    setFiningTankVol(plan.volumes.saigneeTotalL);
    setCopperTankVol(plan.volumes.rack1PerTankL);
    setGrapeWeight(plan.params.grapeWeightKg);
    setPostPressActualVol(plan.volumes.rack1PerTankL);
    setTsVol(plan.volumes.redLiquidFermentPerTankL);
    setTsUnpressed(false);
    showToast('تمامی ماشین‌حساب‌ها با مقادیر پروتکل انعطاف‌پذیر فعال همگام‌سازی شدند.');
  };

  const renderDoubleDiscountGuard = (
    volumeL: number,
    isChecked: boolean,
    onUncheck: () => void,
    onSetMashVolume: (mashL: number) => void
  ) => {
    if (!isChecked || !isAlreadyLiquidVolume(volumeL)) return null;
    return (
      <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 text-xs space-y-2">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-bold">
              هشدار مهندسی جلوگیری از کسر مضاعف حجم (Double-Discount Guard):
            </strong>
            <span>
              عدد واردشده (<strong>{volumeL} لیتر</strong>) در مستر پروتکل از پیش حجم فاز مایع خالص است (در ۱۵۷ لیتر مش پس از سانیه، ۱۳۲ لیتر مایع و ۲۵ لیتر کلاهک وجود دارد). تیک زدن گزینه «توده کراش‌شده با پوست» ضریب <strong>{flexParams.redMashLiquidYieldFactor}</strong> را مجدداً روی حجم مایع اعمال می‌کند!
            </span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 pr-6">
          <button
            type="button"
            onClick={onUncheck}
            className="px-2.5 py-1 rounded-lg bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold cursor-pointer"
          >
            لغو تیک (محاسبه روی {volumeL} لیتر مایع خالص)
          </button>
          <button
            type="button"
            onClick={() => onSetMashVolume(flexPlan.volumes.redMashAfterSaigneePerTankL)}
            className="px-2.5 py-1 rounded-lg bg-white hover:bg-amber-100 text-amber-950 border border-amber-400 text-xs font-bold cursor-pointer"
          >
            تغییر ورودی به حجم کل مش ({flexPlan.volumes.redMashAfterSaigneePerTankL} لیتر)
          </button>
        </div>
      </div>
    );
  };

  const troubleshootingResult = useMemo(
    () =>
      evaluateEnologicalScenario({
        batchVolumeL: tsVol,
        currentSG: tsSG,
        currentBrix: tsBrix,
        tempCapC: tsTemp,
        ph: tsPH,
        ta: tsTA,
        freeSO2: tsSO2,
        isRose: tsIsRose,
        isUnpressedMash: tsUnpressed,
        equipmentProfile,
        issues: {
          isStuckFermentation: tsStuck,
          hasH2S: tsH2S,
          hasVolatileAcidity: tsVA,
          hasDryCap: tsDryCap,
          hasBitterSeeds: tsBitterSeeds,
          hasCloudiness: tsCloudy
        }
      }),
    [
      tsVol,
      tsSG,
      tsBrix,
      tsTemp,
      tsPH,
      tsTA,
      tsSO2,
      tsIsRose,
      tsUnpressed,
      equipmentProfile,
      tsStuck,
      tsH2S,
      tsVA,
      tsDryCap,
      tsBitterSeeds,
      tsCloudy
    ]
  );

  const handleSaveTroubleshooting = () => {
    enologyDb.saveCalculation({
      calculatorType: 'troubleshooting_scenario',
      title: `دستورالعمل عیب‌یابی و اصلاح کارگاهی برای حجم ${tsVol} لیتر`,
      inputs: {
        'حجم (L)': tsVol,
        'وزن مخصوص SG': tsSG,
        'دمای کلاهک (°C)': tsTemp,
        'اسیدیته pH': tsPH,
        'اسیدیته کل TA': tsTA,
        'سولفیت آزاد': tsSO2,
        'توقف تخمیر': tsStuck ? 'بله' : 'خیر',
        'بوی H2S': tsH2S ? 'بله' : 'خیر',
        'بوی سرکه': tsVA ? 'بله' : 'خیر'
      },
      results: {
        'نمره سلامت': `${troubleshootingResult.overallHealthScore}/100`,
        'تعداد مداخلات فوری': troubleshootingResult.actions.length,
        'وضعیت': troubleshootingResult.overallStatusText
      },
      notes: 'برنامه‌ریزی جامع مداخله و فرمولاسیون نجات بچ در انولوژی'
    });
    reloadSavedCalcs();
    showToast('دستورالعمل عیب‌یابی و پروتکل اصلاحی با موفقیت در پایگاه داده ذخیره شد.');
  };

  const testCategories = [
    { id: 'all', label: 'همه ابزارها و SOPها (۹ مورد)' },
    { id: 'sop-01', label: '۱. هیدرومتر و رفرکتومتر' },
    { id: 'sop-02', label: '۲. تیتراسیون اسیدیته (TA)' },
    { id: 'sop-03', label: '۳. کالیبراسیون و تنظیم pH' },
    { id: 'sop-04', label: '۴. سولفیت آزاد، مولکولی و KMS' },
    { id: 'sop-05', label: '۵. بودجه نیتروژن YAN و SNA' },
    { id: 'sop-06', label: '۶. دمای کلاهک و خنک‌سازی' },
    { id: 'sop-07', label: '۷. تست خشکی و قند باقی‌مانده' },
    { id: 'sop-08', label: '۸. فینینگ بنتونیت و استوک مس' },
    { id: 'sop-09', label: '۹. موازنه جرم و مقیاس‌پذیری بچ' },
  ];

  const shouldShowSopCard = (sopId: string): boolean => {
    if (selectedFilter !== 'all' && selectedFilter !== sopId) return false;
    if (!onlyMyEquipmentTools) return true;
    const compat = getLabToolEquipmentCompatibility(sopId, equipmentProfile);
    return (
      compat.isDirectlySupported ||
      sopId === 'sop-09' ||
      sopId === 'sop-06' ||
      sopId === 'test-scale' ||
      sopId === 'test-cooling'
    );
  };

  const renderSopCompatBadge = (sopId: string) => {
    const toolCompat = getLabToolEquipmentCompatibility(sopId, equipmentProfile);
    return (
      <span
        data-testid={`sop-compat-badge-${sopId}`}
        className={`px-2 py-0.5 rounded-md text-xs font-bold border ${
          toolCompat.isDirectlySupported
            ? 'border-emerald-500/40 bg-emerald-500/10 text-ok'
            : 'border-amber-500/40 bg-amber-500/10 text-warn'
        }`}
      >
        {toolCompat.badgeFa}
      </span>
    );
  };

  const renderSopFallbackBox = (sopId: string) => {
    const toolCompat = getLabToolEquipmentCompatibility(sopId, equipmentProfile);
    if (toolCompat.isDirectlySupported) return null;
    return (
      <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 mb-3 text-xs text-ink">
        <span className="font-bold">روش جایگزین بدون کیت آزمایشگاهی: </span>
        <span>{toolCompat.fallbackGuidanceFa}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto my-4 font-['Vazirmatn',sans-serif]">
      {/* Deep-Link Referral Return Banner */}
      {labDeepLink && (
        <div className="bg-surface text-ink p-4 rounded-xl border border-line shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-paper border border-line flex items-center justify-center text-wine shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-ink">
                آزمایش و بررسی از طریق هشدار ارجاع شده است
              </h3>
              <p className="text-xs text-ink-soft mt-0.5">
                پارامترهای مخزن به‌صورت خودکار در ابزار آزمایشگاهی و عیب‌یاب بارگذاری شدند. پس از اتمام بررسی می‌توانید با یک کلیک بازگردید.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={returnFromLabDeepLink}
            className="min-h-[44px] px-4 py-2 rounded-xl bg-wine hover:opacity-95 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-all shrink-0"
          >
            <span>
              {'بازگشت به ' +
                ((labDeepLink?.returnToTab ?? 'today') === 'today'
                  ? 'امروز'
                  : 'صفحه قبلی')}
            </span>
            <ArrowRight className="w-4 h-4 rotate-180" />
          </button>
        </div>
      )}

      {/* Clean Light Sub-Tab Bar & Protocol Sync Action */}
      <div className="bg-surface text-ink p-4 rounded-xl border border-line shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-ink text-sm font-bold">
            <Calculator className="w-4 h-4 text-wine shrink-0" />
            <span>آزمایشگاه، ۹ ماشین‌حساب تخصصی، راهنمای SOP و عیب‌یاب کارگاهی</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleSyncPlanToCalculators(flexPlan)}
              className="px-3 py-1.5 rounded-lg bg-paper hover:bg-stone-200/60 text-ink border border-line text-xs font-bold cursor-pointer transition-colors"
            >
              همگام‌سازی مقادیر با پروتکل فعال
            </button>
            {onNavigateToTracking && (
              <button
                type="button"
                onClick={onNavigateToTracking}
                className="px-3 py-1.5 rounded-lg bg-wine text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all whitespace-nowrap"
              >
                <span>مشاهده و ثبت در پایش روزانه</span>
                <ArrowRight className="w-3.5 h-3.5 rotate-180" />
              </button>
            )}
          </div>
        </div>

        {/* 3 Primary Sub-Tabs */}
        <div className="pt-2 border-t border-line grid grid-cols-1 md:grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setActiveSubTab('calculators-sops')}
            className={`px-4 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer border ${
              activeSubTab === 'calculators-sops'
                ? 'bg-wine text-white border-wine shadow-xs'
                : 'bg-paper text-ink-soft hover:text-ink border-line'
            }`}
          >
            <Calculator className="w-4 h-4 shrink-0" />
            <span>۱. ماشین‌حساب‌های مهندسی و روش انجام آزمایش‌ها (۹ ابزار و SOP)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('troubleshooting-crises')}
            className={`px-4 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer border ${
              activeSubTab === 'troubleshooting-crises'
                ? 'bg-wine text-white border-wine shadow-xs'
                : 'bg-paper text-ink-soft hover:text-ink border-line'
            }`}
          >
            <Wrench className="w-4 h-4 shrink-0" />
            <span>۲. عیب‌یاب هوشمند سناریوها و مدیریت ۶ بحران کارگاهی</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('saved-history')}
            className={`px-4 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer border ${
              activeSubTab === 'saved-history'
                ? 'bg-wine text-white border-wine shadow-xs'
                : 'bg-paper text-ink-soft hover:text-ink border-line'
            }`}
          >
            <Database className="w-4 h-4 shrink-0" />
            <span>۳. تاریخچه محاسبات ذخیره‌شده در دیتابیس</span>
            <span
              className={`px-2 py-0.5 rounded-md text-xs font-mono tabular-nums border ${
                activeSubTab === 'saved-history'
                  ? 'bg-white/20 text-white border-white/30'
                  : 'bg-surface text-ink border-line'
              }`}
            >
              {savedCalculations.length}
            </span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 10-Second Direct Tank Ledger Undo Banner (Idea 2) */}
      {ledgerUndoToast && (
        <div className="p-3.5 rounded-xl bg-surface border-2 border-wine text-ink text-xs font-bold flex items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-ok shrink-0" />
            <span>{ledgerUndoToast.summaryFa}</span>
          </div>
          <button
            type="button"
            onClick={handleUndoDirectLedgerLog}
            className="px-3 py-1.5 rounded-lg bg-wine text-white hover:opacity-95 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>واگرد ({ledgerUndoToast.remainingSec}s)</span>
          </button>
        </div>
      )}

      {/* ===================================================================== */}
      {/* SUB-TAB 1: 9 ENGINEERING CALCULATORS & STEP-BY-STEP LABORATORY SOPS   */}
      {/* ===================================================================== */}
      {activeSubTab === 'calculators-sops' && (
        <div className="space-y-6">
          {/* 2x2 Question-Based Entry Cards */}
          <div className="bg-surface p-4 sm:p-5 rounded-xl border border-line shadow-xs space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="text-sm sm:text-base font-bold text-ink flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-wine" />
                <span>ورود سریع پرسش‌محور به آزمایشگاه</span>
              </h3>
              <span className="text-xs font-bold text-ink-soft">
                انتخاب هم‌زمان راهنمای گام‌به‌گام + ماشین‌حساب مرتبط
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedWizardOverride('ripper_so2');
                  setSelectedFilter('sop-04');
                  setExpandedTests((prev) => ({ ...prev, 'sop-04': true }));
                }}
                className={`min-h-[64px] p-3.5 rounded-xl border text-right transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  selectedWizardOverride === 'ripper_so2'
                    ? 'bg-wine text-white border-wine shadow-xs'
                    : 'bg-paper hover:bg-stone-200/50 text-ink border-line'
                }`}
              >
                <div>
                  <div className="text-sm font-bold">سولفیت کافی است؟</div>
                  <div className={`text-xs mt-0.5 ${selectedWizardOverride === 'ripper_so2' ? 'text-white/80' : 'text-ink-soft'}`}>
                    تست Ripper و SO2 مولکولی
                  </div>
                </div>
                <FlaskConical className={`w-5 h-5 shrink-0 ${selectedWizardOverride === 'ripper_so2' ? 'text-white' : 'text-wine'}`} />
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedWizardOverride('ta_titration');
                  setSelectedFilter('sop-02');
                  setExpandedTests((prev) => ({ ...prev, 'sop-02': true, 'sop-03': true }));
                }}
                className={`min-h-[64px] p-3.5 rounded-xl border text-right transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  selectedWizardOverride === 'ta_titration' || selectedWizardOverride === 'ph_meter'
                    ? 'bg-wine text-white border-wine shadow-xs'
                    : 'bg-paper hover:bg-stone-200/50 text-ink border-line'
                }`}
              >
                <div>
                  <div className="text-sm font-bold">اسیدیته درست است؟</div>
                  <div className={`text-xs mt-0.5 ${selectedWizardOverride === 'ta_titration' || selectedWizardOverride === 'ph_meter' ? 'text-white/80' : 'text-ink-soft'}`}>
                    تست TA، pH و کالیبراسیون
                  </div>
                </div>
                <Scale className={`w-5 h-5 shrink-0 ${selectedWizardOverride === 'ta_titration' || selectedWizardOverride === 'ph_meter' ? 'text-white' : 'text-wine'}`} />
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedWizardOverride('hydrometer_temp');
                  setSelectedFilter('sop-07');
                  setExpandedTests((prev) => ({ ...prev, 'sop-01': true, 'sop-07': true }));
                }}
                className={`min-h-[64px] p-3.5 rounded-xl border text-right transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  selectedWizardOverride === 'hydrometer_temp'
                    ? 'bg-wine text-white border-wine shadow-xs'
                    : 'bg-paper hover:bg-stone-200/50 text-ink border-line'
                }`}
              >
                <div>
                  <div className="text-sm font-bold">تخمیر تمام شده؟</div>
                  <div className={`text-xs mt-0.5 ${selectedWizardOverride === 'hydrometer_temp' ? 'text-white/80' : 'text-ink-soft'}`}>
                    هیدرومتر، دمای نمونه و بررسی خشکی
                  </div>
                </div>
                <Gauge className={`w-5 h-5 shrink-0 ${selectedWizardOverride === 'hydrometer_temp' ? 'text-white' : 'text-wine'}`} />
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedWizardOverride('mlf_chromatography');
                  setSelectedFilter('sop-03');
                  setExpandedTests((prev) => ({ ...prev, 'sop-03': true }));
                }}
                className={`min-h-[64px] p-3.5 rounded-xl border text-right transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  selectedWizardOverride === 'mlf_chromatography'
                    ? 'bg-wine text-white border-wine shadow-xs'
                    : 'bg-paper hover:bg-stone-200/50 text-ink border-line'
                }`}
              >
                <div>
                  <div className="text-sm font-bold">مالولاکتیک شروع شده؟</div>
                  <div className={`text-xs mt-0.5 ${selectedWizardOverride === 'mlf_chromatography' ? 'text-white/80' : 'text-ink-soft'}`}>
                    کروماتوگرافی کاغذی اسید مالیک
                  </div>
                </div>
                <Activity className={`w-5 h-5 shrink-0 ${selectedWizardOverride === 'mlf_chromatography' ? 'text-white' : 'text-wine'}`} />
              </button>
            </div>
          </div>

          {/* Interactive Step-by-Step Laboratory Wizards (Idea 7) */}
          <InteractiveLabWizardsPanel
            selectedWizardOverride={selectedWizardOverride}
            onAnalysisSaved={() =>
              showToast('نتیجهٔ آزمایش با موفقیت در دفتر آزمایشگاه ثبت شد!')
            }
          />

          {/* Equipment Kit Status Bar */}
          <div
            data-testid="lab-equipment-profile-bar"
            className="bg-surface p-3.5 rounded-xl border border-line shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs"
          >
            <div className="flex items-center gap-2 text-ink font-bold flex-wrap">
              <FlaskConical className="w-4 h-4 text-wine shrink-0" />
              <span>
                پروفایل تجهیزات آزمایشگاه: {equipmentCapabilities.presetTitleFa} (
                {equipmentCapabilities.shortBadgeFa})
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                data-testid="toggle-only-my-equipment-tools"
                onClick={() => setOnlyMyEquipmentTools((prev) => !prev)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-colors cursor-pointer ${
                  onlyMyEquipmentTools
                    ? 'bg-wine text-white border-wine'
                    : 'bg-paper hover:bg-stone-200/60 text-ink border-line'
                }`}
              >
                {onlyMyEquipmentTools
                  ? 'نمایش همه ابزارها و راهنماهای جایگزین'
                  : 'فقط ابزارهای منطبق با تجهیزات من'}
              </button>
              <button
                type="button"
                onClick={() => openEquipmentModal()}
                className="px-3 py-1.5 rounded-lg bg-paper hover:bg-stone-200/60 text-ink border border-line text-xs font-bold transition-colors cursor-pointer"
              >
                ویرایش تجهیزات
              </button>
            </div>
          </div>

          {/* Category Filter Bar + Expand/Collapse All SOPs */}
          <div className="bg-surface p-4 rounded-xl border border-line shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs font-bold text-ink">
                فیلتر سریع ابزارهای محاسباتی و آزمایشگاهی:
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleAllSops(true)}
                  className="px-2.5 py-1 rounded-lg bg-paper hover:bg-stone-200/60 text-ink border border-line text-xs font-bold transition-colors cursor-pointer"
                >
                  باز کردن همه راهنماهای SOP
                </button>
                <button
                  type="button"
                  onClick={() => toggleAllSops(false)}
                  className="px-2.5 py-1 rounded-lg bg-paper hover:bg-stone-200/60 text-ink border border-line text-xs font-bold transition-colors cursor-pointer"
                >
                  بستن همه راهنماهای SOP
                </button>
              </div>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {testCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedFilter(cat.id)}
                  className={`px-3 py-1.5 rounded-lg font-bold shrink-0 transition-all cursor-pointer whitespace-nowrap border ${
                    selectedFilter === cat.id
                      ? 'bg-wine text-white border-wine shadow-xs'
                      : 'bg-paper text-ink-soft hover:text-ink border-line'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* ----------------------------------------------------------------- */}
          {/* TOOL 1 (SOP-01): Hydrometer, Brix & Refractometer Calibration     */}
          {/* ----------------------------------------------------------------- */}
          {shouldShowSopCard('sop-01') && (
            <div
              id="lab-test-card-sop-01"
              className={`bg-surface rounded-xl border border-line shadow-xs overflow-hidden ${
                focusedHaloTestId === 'sop-01'
                  ? 'ring-2 ring-wine bg-wine/5 shadow-md transition-all duration-500'
                  : ''
              }`}
            >
              <div className="p-4 sm:p-5 bg-paper border-b border-line text-ink flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-surface border border-line flex items-center justify-center text-wine font-bold shrink-0">
                    <Gauge className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-ink-soft font-mono font-bold">
                      <span>SOP-TEST-01</span>
                      <span>·</span>
                      <span>SG_True(20°C) = SG_Measured + ΔSG</span>
                      {renderSopCompatBadge('sop-01')}
                    </div>
                    <h3 className="font-bold text-sm sm:text-base text-ink mt-0.5">
                      ۱. سنجش وزن مخصوص (SG)، بریکس و تصحیح دمایی هیدرومتر / رفرکتومتر
                    </h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleExpand('sop-01')}
                  className="px-3 py-1.5 rounded-xl bg-surface hover:bg-stone-200/60 text-ink border border-line text-xs font-bold flex items-center gap-1.5 self-start sm:self-center cursor-pointer transition-colors whitespace-nowrap"
                >
                  <BookOpen className="w-3.5 h-3.5 text-wine" />
                  <span>{expandedTests['sop-01'] ? 'بستن راهنمای آزمایشگاهی' : 'نمایش راهنمای گام‌به‌گام آزمایشگاهی و نکات علمی'}</span>
                  {expandedTests['sop-01'] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              <div className="p-5 sm:p-6 space-y-5">
                {/* TOP HALF: Interactive Calculator (Always Visible) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left: Hydrometer Temp Correction */}
                  <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-3 text-xs">
                    <h4 className="font-bold text-stone-900 text-xs sm:text-sm flex items-center justify-between border-b border-stone-200 pb-2">
                      <span>الف) تصحیح دمای هیدرومتر (کالیبره‌شده در ۲۰°C)</span>
                      <span className="font-mono text-xs text-rose-800">کالیبراسیون ۲۰°C</span>
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-stone-700 font-bold mb-1">
                          قرائت هیدرومتر (SG):
                        </label>
                        <input
                          type="number"
                          step="0.001"
                          value={hydroMeasuredSG}
                          onChange={(e) => setHydroMeasuredSG(parseFloat(e.target.value) || 1.0)}
                          className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-bold font-mono tabular-nums text-stone-900 focus:border-rose-700 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-700 font-bold mb-1">
                          دمای نمونه مایع (°C):
                        </label>
                        <input
                          type="number"
                          step="0.5"
                          value={hydroTemp}
                          onChange={(e) => setHydroTemp(parseFloat(e.target.value) || 20)}
                          className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-bold font-mono tabular-nums text-stone-900 focus:border-rose-700 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="p-3 bg-surface border border-line text-ink rounded-xl space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-ink-soft">ضریب تصحیح انبساط دمایی (ΔSG):</span>
                        <span className="font-mono tabular-nums font-bold text-ink">
                          {hydroCorrection.delta >= 0 ? `+${hydroCorrection.delta}` : hydroCorrection.delta}
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-t border-line pt-1.5">
                        <span className="font-bold text-ink">وزن مخصوص واقعی (SG در ۲۰°C):</span>
                        <span className="text-lg font-bold font-mono tabular-nums text-wine">
                          {hydroCorrection.trueSG.toFixed(4)}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs p-2.5 rounded-lg border bg-white border-stone-200">
                      <strong>تفسیر کارگاهی: </strong>
                      {hydroCorrection.trueSG >= 1.0075 && hydroCorrection.trueSG <= 1.0085 ? (
                        <span className="text-emerald-700 font-bold">
                          نقطه طلایی پرسینگ (1.0080)! آماده‌سازی فوری پرس و جداسازی تفاله.
                        </span>
                      ) : hydroCorrection.trueSG > 1.0085 ? (
                        <span className="text-blue-700 font-bold">
                          در حال تخمیر روی پوسته‌ها. هنوز به نقطه پرسینگ نرسیده است.
                        </span>
                      ) : (
                        <span className="text-amber-700 font-bold">
                          زیر 1.0080 (تخمیر عمیق یا فاز بدون تفاله).
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={handleSaveHydro}
                      className="w-full py-2 px-3 rounded-lg bg-wine hover:opacity-95 text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5 text-white" />
                      <span>ذخیره نتیجه هیدرومتر در پایگاه داده</span>
                    </button>
                  </div>

                  {/* Right: Refractometer in Presence of Alcohol */}
                  <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-3 text-xs">
                    <h4 className="font-bold text-stone-900 text-xs sm:text-sm flex items-center justify-between border-b border-stone-200 pb-2">
                      <span>ب) اصلاح خطای شکست رفرکتومتر در حضور الکل</span>
                      <span className="font-mono text-xs text-rose-800">Boulton / Terrill</span>
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-stone-700 font-bold mb-1">
                          بریکس اولیه آب‌انگور (Brix₀):
                        </label>
                        <input
                          type="number"
                          step="0.5"
                          value={refractOrigBrix}
                          onChange={(e) => setRefractOrigBrix(parseFloat(e.target.value) || 0)}
                          className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-bold font-mono tabular-nums text-stone-900 focus:border-rose-700 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-700 font-bold mb-1">
                          قرائت رفرکتومتر (Brix فعلی):
                        </label>
                        <input
                          type="number"
                          step="0.2"
                          value={refractReadingBrix}
                          onChange={(e) => setRefractReadingBrix(parseFloat(e.target.value) || 0)}
                          className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-bold font-mono tabular-nums text-stone-900 focus:border-rose-700 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="p-3 bg-surface border border-line text-ink rounded-xl space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-ink-soft">بریکس واقعی بدون اثر الکل:</span>
                        <span className="font-mono tabular-nums font-bold text-ink">
                          {refractCorrection.trueBrix}° Brix
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-t border-line pt-1.5">
                        <span className="font-bold text-ink">وزن مخصوص واقعی (SG):</span>
                        <span className="font-mono tabular-nums font-bold text-wine">
                          {refractCorrection.trueSG.toFixed(4)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-t border-line pt-1.5">
                        <span className="text-ink-soft">الکل تولید شده تا این لحظه (ABV):</span>
                        <span className="font-mono tabular-nums font-bold text-ink">
                          {refractCorrection.abv}٪
                        </span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-950 leading-relaxed">
                      <strong>سلب مسئولیت علمی (AWRI/OIV): </strong>
                      {refractCorrection.disclaimerFa}
                    </div>

                    <button
                      type="button"
                      onClick={handleSaveRefract}
                      className="w-full py-2 px-3 rounded-lg bg-wine hover:opacity-95 text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5 text-white" />
                      <span>ذخیره نتیجه رفرکتومتر در پایگاه داده</span>
                    </button>
                  </div>
                </div>

                {/* BOTTOM HALF: Collapsible Step-by-Step Laboratory SOP */}
                {expandedTests['sop-01'] && (
                  <div className="pt-4 border-t border-stone-200 space-y-5">
                    {renderSopFallbackBox('sop-01')}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="p-3.5 bg-rose-50/60 rounded-xl border border-rose-200/80 space-y-1.5">
                        <h4 className="font-bold text-rose-950 flex items-center gap-1.5">
                          <Info className="w-4 h-4 text-rose-700" />
                          <span>هدف و محدوده‌های بحرانی</span>
                        </h4>
                        <ul className="list-disc list-inside space-y-1 text-stone-800 leading-relaxed">
                          <li>تعیین بریکس اولیه آب‌انگور (بریکس هدف: ۲۲ معادل SG 1.092).</li>
                          <li>پایش افت روزانه وزن مخصوص (سرعت نرمال: ۰.۰۱۰ تا ۰.۰۲۵ کاهش SG در روز).</li>
                          <li>تعیین نقاط عطف SNA: مرحله ۱ در SG 1.083، افت یک‌سوم قند در SG 1.070 و افت نصف در SG 1.057.</li>
                          <li><strong>نقطه طلایی پرسینگ:</strong> دقیقاً در وزن مخصوص واقعی ۱.۰۰۸۰.</li>
                        </ul>
                      </div>

                      <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
                        <h4 className="font-bold text-stone-900 flex items-center gap-1.5">
                          <FileCheck className="w-4 h-4 text-stone-700" />
                          <span>ابزارها و پیش‌نیازها</span>
                        </h4>
                        <ul className="list-disc list-inside space-y-1 text-stone-700 leading-relaxed">
                          <li>استوانه مدرج شیشه‌ای ۲۵۰ میلی‌لیتری تمیز و خشک.</li>
                          <li>هیدرومتر دقیق با بازه 1.000–1.120 (یا هیدرومتر باریک 0.990–1.030 برای مراحل پایانی).</li>
                          <li>دماسنج میله‌ای دیجیتال کالیبره شده با دقت ۰.۱ درجه.</li>
                          <li>رفرکتومتر اپتیکال یا دیجیتال (فقط برای آب انگور خام یا با تصحیح اثر الکل).</li>
                        </ul>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-bold text-stone-900 text-xs sm:text-sm">
                        دستورالعمل اجرایی ۵ مرحله‌ای برای اپراتور:
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
                        <div className="border border-stone-200 p-3 rounded-xl bg-white space-y-1.5">
                          <span className="text-xs font-bold text-rose-800">گام ۱ · نمونه‌گیری و فیلتر</span>
                          <p className="text-stone-600 leading-relaxed">
                            ۲۰۰ میلی‌لیتر از مایع زلال زیر کلاهک کشیده و از توری عبور دهید تا پالپ و هسته وارد استوانه نشود.
                          </p>
                        </div>

                        <div className="border border-amber-200 p-3 rounded-xl bg-amber-50/50 space-y-1.5">
                          <span className="text-xs font-bold text-amber-800">گام ۲ (مهم) · گاززدایی (Degassing)</span>
                          <p className="text-stone-700 leading-relaxed">
                            نمونه را ۳۰ ثانیه در یک ارلن یا ظرف دردار محکم تکان دهید تا گاز CO2 خارج شود. حباب‌های چسبیده هیدرومتر را بالا رانده و خطا ایجاد می‌کنند!
                          </p>
                        </div>

                        <div className="border border-stone-200 p-3 rounded-xl bg-white space-y-1.5">
                          <span className="text-xs font-bold text-rose-800">گام ۳ · غوطه‌وری هیدرومتر</span>
                          <p className="text-stone-600 leading-relaxed">
                            استوانه را پر کرده و هیدرومتر را به آرامی با یک چرخش انگشتی ملایم رها کنید تا حباب‌های جانبی جدا شوند.
                          </p>
                        </div>

                        <div className="border border-stone-200 p-3 rounded-xl bg-white space-y-1.5">
                          <span className="text-xs font-bold text-rose-800">گام ۴ · قرائت خط هلالی (Meniscus)</span>
                          <p className="text-stone-600 leading-relaxed">
                            چشم را هم‌سطح سطح مایع بگیرید و پایین‌ترین قوس هلالی مایع را دقیقاً با ۴ رقم اعشار بخوانید (مثلاً 1.0060).
                          </p>
                        </div>

                        <div className="border border-stone-200 p-3 rounded-xl bg-white space-y-1.5">
                          <span className="text-xs font-bold text-rose-800">گام ۵ · سنجش دما و تصحیح</span>
                          <p className="text-stone-600 leading-relaxed">
                            بلافاصله دمای مایع داخل استوانه را با دماسنج بخوانید و در ماشین‌حساب بالا وارد کنید تا وزن مخصوص کالیبره ۲۰ درجه به دست آید.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Reference Table from Master Protocol */}
                    <div className="space-y-2">
                      <h4 className="font-bold text-stone-900 text-xs">
                        جدول مرجع تصحیح دمای هیدرومتر (کالیبره‌شده در 20°C — مثال برای قرائت 1.0060):
                      </h4>
                      <div className="overflow-x-auto border border-stone-200 rounded-xl">
                        <table className="w-full text-xs text-right">
                          <thead className="bg-stone-100 text-stone-800 font-bold border-b border-stone-200">
                            <tr>
                              <th className="p-2.5">دمای شیره</th>
                              <th className="p-2.5">ضریب تصحیح (ΔSG)</th>
                              <th className="p-2.5">مثال: اگر هیدرومتر عدد ۱.۰۰۶۰ را نشان دهد</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-stone-100">
                            {RASHA_PROTOCOL.hydrometerTable.map((row, idx) => (
                              <tr key={idx} className={row.temp.includes('28') ? 'bg-emerald-50 font-bold text-emerald-950' : ''}>
                                <td className="p-2 font-mono tabular-nums">{row.temp}</td>
                                <td className="p-2 font-mono tabular-nums dir-ltr text-right">{row.deltaSG}</td>
                                <td className="p-2">{row.example}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------------- */}
          {/* TOOL 2 (SOP-02): Titratable Acidity (TA) & Tartaric Addition      */}
          {/* ----------------------------------------------------------------- */}
          {shouldShowSopCard('sop-02') && (
            <div
              id="lab-test-card-sop-02"
              className={`bg-surface rounded-xl border border-line shadow-xs overflow-hidden ${
                focusedHaloTestId === 'sop-02'
                  ? 'ring-2 ring-wine bg-wine/5 shadow-md transition-all duration-500'
                  : ''
              }`}
            >
              <div className="p-4 sm:p-5 bg-paper border-b border-line text-ink flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-surface border border-line flex items-center justify-center text-wine font-bold shrink-0">
                    <FlaskConical className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-ink-soft font-mono font-bold">
                      <span>SOP-TEST-02</span>
                      <span>·</span>
                      <span>TA (g/L) = (V_NaOH × N × 75) / V_sample</span>
                      {renderSopCompatBadge('sop-02')}
                    </div>
                    <h3 className="font-bold text-sm sm:text-base text-ink mt-0.5">
                      ۲. تیتراسیون اسیدیته کل قابل تیتر (TA) و محاسبه اسید تارتاریک تکمیلی
                    </h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleExpand('sop-02')}
                  className="px-3 py-1.5 rounded-xl bg-surface hover:bg-stone-200/60 text-ink border border-line text-xs font-bold flex items-center gap-1.5 self-start sm:self-center cursor-pointer transition-colors whitespace-nowrap"
                >
                  <BookOpen className="w-3.5 h-3.5 text-wine" />
                  <span>{expandedTests['sop-02'] ? 'بستن راهنمای آزمایشگاهی' : 'نمایش راهنمای گام‌به‌گام آزمایشگاهی و نکات علمی'}</span>
                  {expandedTests['sop-02'] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              <div className="p-5 sm:p-6 space-y-5">
                {/* TOP HALF: Interactive Calculator */}
                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
                    <div>
                      <label className="block text-stone-700 font-bold mb-1">
                        سود مصرفی (V_NaOH mL):
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={taNaOHVol}
                        onChange={(e) => setTaNaOHVol(parseFloat(e.target.value) || 0)}
                        className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-bold font-mono tabular-nums text-stone-900 focus:border-amber-700 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-700 font-bold mb-1">
                        نرمالیته سود (N):
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={taNaOHNorm}
                        onChange={(e) => setTaNaOHNorm(parseFloat(e.target.value) || 0.1)}
                        className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-bold font-mono tabular-nums text-stone-900 focus:border-amber-700 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-700 font-bold mb-1">
                        حجم نمونه شراب (mL):
                      </label>
                      <input
                        type="number"
                        step="1"
                        value={taSampleVol}
                        onChange={(e) => setTaSampleVol(parseFloat(e.target.value) || 5)}
                        className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-bold font-mono tabular-nums text-stone-900 focus:border-amber-700 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-700 font-bold mb-1">
                        اسیدیته هدف (g/L):
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={taTarget}
                        onChange={(e) => setTaTarget(parseFloat(e.target.value) || 6.5)}
                        className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-bold font-mono tabular-nums text-stone-900 focus:border-amber-700 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-700 font-bold mb-1">
                        حجم مخزن مورد نظر (L):
                      </label>
                      <input
                        type="number"
                        step="5"
                        value={taBatchVolume}
                        onChange={(e) => setTaBatchVolume(parseFloat(e.target.value) || 132)}
                        className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-bold font-mono tabular-nums text-stone-900 focus:border-amber-700 focus:outline-none"
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer text-stone-800 text-xs font-bold bg-white p-2.5 rounded-lg border border-stone-200">
                    <input
                      type="checkbox"
                      checked={taUnpressedMash}
                      onChange={(e) => setTaUnpressedMash(e.target.checked)}
                      className="w-4 h-4 accent-amber-700 rounded"
                    />
                    <span>
                      توده قرمز کراش‌شده با پوست پیش از پرسینگ (ضریب مایع به مش {flexParams.redMashLiquidYieldFactor} — حجم مؤثر مایع: {getEffectiveLiquidVolume(taBatchVolume, taUnpressedMash, flexParams.redMashLiquidYieldFactor)} لیتر)
                    </span>
                  </label>
                  {renderDoubleDiscountGuard(
                    taBatchVolume,
                    taUnpressedMash,
                    () => setTaUnpressedMash(false),
                    (mashL) => setTaBatchVolume(mashL)
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-surface border border-line text-ink rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-ink-soft text-xs">اسیدیته کل محاسبه شده (TA):</span>
                        <span className="text-xl font-bold font-mono tabular-nums text-wine">
                          {currentTA} g/L
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-t border-line pt-2">
                        <span className="text-ink-soft text-xs">ارزیابی وضعیت:</span>
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded border ${
                            currentTA >= 5.5 && currentTA <= 7.2
                              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                              : currentTA < 5.5
                              ? 'bg-rose-50 text-rose-900 border-rose-200'
                              : 'bg-amber-50 text-amber-900 border-amber-200'
                          }`}
                        >
                          {currentTA >= 5.5 && currentTA <= 7.2
                            ? 'ایده‌آل و متعادل (سقف مجاز ≤ 7.2 g/L)'
                            : currentTA < 5.5
                            ? 'کمبود اسید (نیاز به اصلاح با اسید تارتاریک)'
                            : 'اسیدیته بالا (عبور از سقف حسی ۷.۲ گرم بر لیتر)'}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 bg-white border border-stone-200 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-stone-700 text-xs font-bold">
                          اسید تارتاریک مورد نیاز ({getEffectiveLiquidVolume(taBatchVolume, taUnpressedMash)}L مایع):
                        </span>
                        <span className="text-lg font-bold font-mono tabular-nums text-rose-800">
                          {tartaricNeeded} گرم
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        {tartaricNeeded > 0
                          ? `برای افزایش اسیدیته از ${currentTA} به ${taTarget} g/L، مقدار ${tartaricNeeded} گرم اسید تارتاریک خوراکی L(+) را در آب ولرم حل کرده و همراه با غوطه‌ورسازی به مخزن اضافه کنید.`
                          : 'اسیدیته فعلی برابر یا بیشتر از مقدار هدف است؛ نیازی به افزودن اسید تارتاریک نیست.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSaveTA}
                      className="flex-1 min-w-[220px] py-2 px-3 rounded-lg bg-surface hover:bg-paper text-ink border border-line text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5 text-wine" />
                      <span>ذخیره نتیجه تیتراسیون TA و اسید تارتاریک در پایگاه داده</span>
                    </button>

                    {tartaricNeeded > 0 ? (
                      <button
                        type="button"
                        onClick={() =>
                          handleDirectLogToTankLedger('tartaric_ta', {
                            referenceVolumeL: effectiveTaLiquidVol,
                            primaryAmount: tartaricNeeded,
                            labelFa: tartaricNeeded + ' گرم اسید تارتاریک'
                          })
                        }
                        className="bg-wine text-white hover:opacity-95 px-3.5 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-opacity cursor-pointer"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>
                          + ثبت مستقیم {tartaricNeeded} g اسید تارتاریک در دفتر{' '}
                          {selectedTankLabelFa}
                        </span>
                      </button>
                    ) : taDeacidOptions.khco3StoichiometricGrams > 0 ? (
                      <button
                        type="button"
                        onClick={() =>
                          handleDirectLogToTankLedger('khco3_ta', {
                            referenceVolumeL: effectiveTaLiquidVol,
                            primaryAmount: taDeacidOptions.khco3StoichiometricGrams,
                            labelFa:
                              taDeacidOptions.khco3StoichiometricGrams +
                              ' گرم KHCO3'
                          })
                        }
                        className="bg-wine text-white hover:opacity-95 px-3.5 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-opacity cursor-pointer"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>
                          + ثبت مستقیم {taDeacidOptions.khco3StoichiometricGrams}{' '}
                          g بیکربنات پتاسیم در دفتر {selectedTankLabelFa}
                        </span>
                      </button>
                    ) : null}
                  </div>
                </div>

                {/* BOTTOM HALF: Collapsible SOP */}
                {expandedTests['sop-02'] && (
                  <div className="pt-4 border-t border-stone-200 space-y-5">
                    {renderSopFallbackBox('sop-02')}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200/80 space-y-1.5">
                        <h4 className="font-bold text-amber-950 flex items-center gap-1.5">
                          <Info className="w-4 h-4 text-amber-700" />
                          <span>محدوده‌های هدف انولوژی</span>
                        </h4>
                        <ul className="list-disc list-inside space-y-1 text-stone-800 leading-relaxed">
                          <li><strong>شراب قرمز رشه:</strong> 5.5 تا 7.0 g/L (هدف بهینه: 6.2–6.5 g/L؛ سقف مجاز: 7.2 g/L).</li>
                          <li><strong>شراب رُزه سردشت:</strong> 6.0 تا 7.5 g/L (نیاز به طراوت اسیدی بالاتر).</li>
                          <li>اگر اسیدیته کمتر از 5.0 g/L باشد، شراب بی‌روح و مستعد اکسیداسیون و آلودگی باکتریایی خواهد بود.</li>
                        </ul>
                      </div>

                      <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
                        <h4 className="font-bold text-stone-900 flex items-center gap-1.5">
                          <FileCheck className="w-4 h-4 text-stone-700" />
                          <span>معرف‌ها و شیشه‌آلات</span>
                        </h4>
                        <ul className="list-disc list-inside space-y-1 text-stone-700 leading-relaxed">
                          <li>محلول استاندارد هیدروکسید سدیم (NaOH 0.1 N).</li>
                          <li>شناساگر فنل‌فتالئین ۱٪ یا pH متر کالیبره‌شده (نقطه پایان pH 8.20).</li>
                          <li>پیپت حباب‌دار ۵ میلی‌لیتر و بورت مدرج یا سرنگ دقیق ۵ یا ۱۰ میلی‌لیتر.</li>
                          <li>آب مقطر خنثی شده و بشر ۱۰۰ میلی‌لیتر.</li>
                        </ul>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-bold text-stone-900 text-xs sm:text-sm">
                        دستورالعمل اجرایی آزمایش برای اپراتور:
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                        <div className="border border-stone-200 p-3 rounded-xl bg-white space-y-1.5">
                          <span className="text-xs font-bold text-amber-800">گام ۱ · برداشت و گاززدایی</span>
                          <p className="text-stone-600 leading-relaxed">
                            دقیقاً ۵ میلی‌لیتر نمونه فیلترشده را پیپت کرده، با ۵۰ میلی‌لیتر آب مقطر مخلوط و ۳۰ ثانیه بجوشانید تا CO2 فرار کند (کربنیک اسید عدد را کاذب بالا می‌برد).
                          </p>
                        </div>

                        <div className="border border-stone-200 p-3 rounded-xl bg-white space-y-1.5">
                          <span className="text-xs font-bold text-amber-800">گام ۲ · افزودن شناساگر</span>
                          <p className="text-stone-600 leading-relaxed">
                            پس از سرد شدن نمونه تا دمای اتاق، ۳ قطره شناساگر فنل‌فتالئین اضافه کنید (یا الکترود pH متر را درون بشر قرار دهید).
                          </p>
                        </div>

                        <div className="border border-stone-200 p-3 rounded-xl bg-white space-y-1.5">
                          <span className="text-xs font-bold text-amber-800">گام ۳ · تیتراسیون با NaOH</span>
                          <p className="text-stone-600 leading-relaxed">
                            محلول سود 0.1 N را قطره‌قطره اضافه کرده و بشر را به صورت دورانی تکان دهید تا اولین تغییر رنگ صورتی ملایم به مدت ۳۰ ثانیه پایدار بماند (یا pH به 8.20 برسد).
                          </p>
                        </div>

                        <div className="border border-stone-200 p-3 rounded-xl bg-white space-y-1.5">
                          <span className="text-xs font-bold text-amber-800">گام ۴ · محاسبه در فرمول</span>
                          <p className="text-stone-600 leading-relaxed">
                            حجم سود مصرفی را از بورت بخوانید. برای ۵ میلی‌لیتر نمونه با سود 0.1 N، فرمول ساده برابر است با: <code className="font-bold text-rose-800">V_NaOH × 1.5</code>.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------------- */}
          {/* TOOL 3 (SOP-03): pH Meter Calibration & Bidirectional Adjustment   */}
          {/* ----------------------------------------------------------------- */}
          {shouldShowSopCard('sop-03') && (
            <div
              id="lab-test-card-sop-03"
              className={`bg-surface rounded-xl border border-line shadow-xs overflow-hidden ${
                focusedHaloTestId === 'sop-03'
                  ? 'ring-2 ring-wine bg-wine/5 shadow-md transition-all duration-500'
                  : ''
              }`}
            >
              <div className="p-4 sm:p-5 bg-paper border-b border-line text-ink flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-surface border border-line flex items-center justify-center text-wine font-bold shrink-0">
                    <Gauge className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-ink-soft font-mono font-bold">
                      <span>SOP-TEST-03</span>
                      <span>·</span>
                      <span>Δ0.1 pH / Δ1.0 g/L TA: 1.0 g/L Tartaric | 1.33 g/L KHCO3</span>
                      {renderSopCompatBadge('sop-03')}
                    </div>
                    <h3 className="font-bold text-sm sm:text-base text-ink mt-0.5">
                      ۳. کالیبراسیون pH سنج و محاسبه دوطرفه اسیدزایی (تارتاریک) یا اسیدزدایی استوکیومتری (KHCO3 / CaCO3)
                    </h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleExpand('sop-03')}
                  className="px-3 py-1.5 rounded-xl bg-surface hover:bg-stone-200/60 text-ink border border-line text-xs font-bold flex items-center gap-1.5 self-start sm:self-center cursor-pointer transition-colors whitespace-nowrap"
                >
                  <BookOpen className="w-3.5 h-3.5 text-wine" />
                  <span>{expandedTests['sop-03'] ? 'بستن راهنمای آزمایشگاهی' : 'نمایش راهنمای گام‌به‌گام آزمایشگاهی و نکات علمی'}</span>
                  {expandedTests['sop-03'] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              <div className="p-5 sm:p-6 space-y-5">
                {/* TOP HALF: Interactive Calculator */}
                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block text-stone-700 font-bold mb-1">
                        pH قرائت‌شده نمونه:
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={samplePH}
                        onChange={(e) => setSamplePH(parseFloat(e.target.value) || 3.5)}
                        className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-bold font-mono tabular-nums text-stone-900 focus:border-emerald-700 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-700 font-bold mb-1">
                        pH هدف انولوژی (قرمز {flexParams.targetRedPH} / رُزه {flexParams.targetRosePH}):
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={targetPH}
                        onChange={(e) => setTargetPH(parseFloat(e.target.value) || 3.52)}
                        className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-bold font-mono tabular-nums text-stone-900 focus:border-emerald-700 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-700 font-bold mb-1">
                        حجم مخزن در حال پردازش (L):
                      </label>
                      <input
                        type="number"
                        step="5"
                        value={phBatchVolume}
                        onChange={(e) => setPhBatchVolume(parseFloat(e.target.value) || 132)}
                        className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-bold font-mono tabular-nums text-stone-900 focus:border-emerald-700 focus:outline-none"
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer text-stone-800 text-xs font-bold bg-white p-2.5 rounded-lg border border-stone-200">
                    <input
                      type="checkbox"
                      checked={phUnpressedMash}
                      onChange={(e) => setPhUnpressedMash(e.target.checked)}
                      className="w-4 h-4 accent-emerald-700 rounded"
                    />
                    <span>
                      توده قرمز کراش‌شده با پوست پیش از پرسینگ (ضریب مایع به مش {flexParams.redMashLiquidYieldFactor} — حجم مؤثر مایع: {effectivePhVol} لیتر)
                    </span>
                  </label>
                  {renderDoubleDiscountGuard(
                    phBatchVolume,
                    phUnpressedMash,
                    () => setPhUnpressedMash(false),
                    (mashL) => setPhBatchVolume(mashL)
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-surface border border-line text-ink rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-ink-soft text-xs">ارزیابی ریسک میکروبی و تخمیری:</span>
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded border ${
                            samplePH < 3.25
                              ? 'bg-amber-50 text-amber-900 border-amber-200'
                              : samplePH <= 3.55
                              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                              : samplePH <= 3.65
                              ? 'bg-amber-50 text-amber-900 border-amber-200'
                              : 'bg-rose-50 text-rose-900 border-rose-200'
                          }`}
                        >
                          {samplePH < 3.25
                            ? 'اسیدیته بیش‌ازحد: خطر کندی تخمیر (نیاز به KHCO3)'
                            : samplePH <= 3.55
                            ? 'امن و بهینه'
                            : samplePH <= 3.65
                            ? 'هشدار زرد: آسیب‌پذیری متوسط'
                            : 'بحرانی قرمز: ریسک بالای فساد میکروبی'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-t border-line pt-2 text-xs">
                        <span className="text-ink-soft">
                          {phRiseNeeded > 0 ? 'افزایش pH مورد نیاز:' : 'افت pH مورد نیاز:'}
                        </span>
                        <span className="font-mono tabular-nums font-bold text-wine">
                          {(phRiseNeeded > 0 ? phRiseNeeded : phDropNeeded).toFixed(2)} واحد
                        </span>
                      </div>
                    </div>

                    <div className="p-4 bg-white border border-stone-200 rounded-xl space-y-2 text-xs">
                      {phRiseNeeded > 0 ? (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="text-stone-700 font-bold">
                              ۱. بی‌کربنات پتاسیم خالص (1.33 g/L — {effectivePhVol}L):
                            </span>
                            <span className="text-lg font-bold font-mono tabular-nums text-amber-700">
                              {khco3ForPH} گرم
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-stone-100 text-xs">
                            <div className="bg-stone-50 p-2 rounded-lg border border-stone-200">
                              <span className="text-stone-500 block">۲. KHCO3 با سرمازدایی (1.00 g/L):</span>
                              <strong className="font-mono text-stone-900">{deacidOptions.khco3WithColdStabGrams} گرم</strong>
                            </div>
                            <div className="bg-stone-50 p-2 rounded-lg border border-stone-200">
                              <span className="text-stone-500 block">۳. کربنات کلسیم CaCO3 (0.67 g/L):</span>
                              <strong className="font-mono text-stone-900">{deacidOptions.caco3Grams} گرم</strong>
                            </div>
                          </div>
                          <p className="text-xs text-stone-600 leading-relaxed">
                            {`استوکیومتری خنثی‌سازی ۱.۰ g/L اسید تارتاریک (یا افزایش ۰.۱ واحد pH): ۱.۳۳ g/L بی‌کربنات پتاسیم خالص (با سرمازدایی و رسوب کرم تارتار KHT: ۱.۰۰ g/L مؤثر؛ کربنات کلسیم CaCO3: ۰.۶۷ g/L).`}
                          </p>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="text-stone-700 font-bold">
                              تارتاریک پیشنهادی جهت کاهش pH ({effectivePhVol}L):
                            </span>
                            <span className="text-lg font-bold font-mono tabular-nums text-emerald-700">
                              {tartaricForPH} گرم
                            </span>
                          </div>
                          <p className="text-xs text-stone-600 leading-relaxed">
                            {tartaricForPH > 0
                              ? `به دلیل خاصیت بافری آب انگور، افزودن حدود ${tartaricForPH} گرم اسید تارتاریک (معادل ${(phDropNeeded * 10).toFixed(1)} g/L) توصیه می‌شود. حتماً پیش از تزریق کل دوز، تست ۳ لیوانی با محلول استوک شماره ۱ (۱۰٪ تارتاریک) انجام شود.`
                              : 'pH دقیقاً منطبق بر مقدار هدف است؛ نیازی به اصلاح اسیدی یا قلیایی نیست.'}
                          </p>
                        </>
                      )}

                      {phShiftEstimate.mode !== 'none' && (
                        <div className="mt-2 pt-2 border-t border-stone-200 space-y-1.5 text-xs">
                          <div className="font-bold text-stone-800">
                            بازه تخمینی ظرفیت بافری ({phShiftEstimate.reagentFa}):
                          </div>
                          <div className="grid grid-cols-3 gap-1.5 text-center font-mono">
                            <div className="bg-stone-50 p-1.5 rounded border border-stone-200">
                              <span className="block text-xs font-sans text-stone-500">بافر ضعیف</span>
                              <strong>{phShiftEstimate.lowBufferGrams} g</strong>
                            </div>
                            <div className="bg-emerald-50 p-1.5 rounded border border-emerald-200 text-emerald-950">
                              <span className="block text-xs font-sans text-emerald-700">بافر متعارف</span>
                              <strong>{phShiftEstimate.typicalBufferGrams} g</strong>
                            </div>
                            <div className="bg-amber-50 p-1.5 rounded border border-amber-200 text-amber-950">
                              <span className="block text-xs font-sans text-amber-800">بافر قوی رشه</span>
                              <strong>{phShiftEstimate.highBufferGrams} g</strong>
                            </div>
                          </div>
                          <p className="text-xs text-amber-900 bg-amber-50/70 p-2 rounded border border-amber-200 leading-relaxed">
                            {phShiftEstimate.warningFa}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSavePH}
                      className="flex-1 min-w-[220px] py-2 px-3 rounded-lg bg-surface hover:bg-paper text-ink border border-line text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5 text-wine" />
                      <span>ذخیره محاسبه تنظیم pH در پایگاه داده</span>
                    </button>

                    {phShiftEstimate.typicalBufferGrams > 0 && (
                      <button
                        type="button"
                        onClick={() =>
                          handleDirectLogToTankLedger('ph_shift', {
                            referenceVolumeL: effectivePhVol,
                            primaryAmount: phShiftEstimate.typicalBufferGrams,
                            phShiftMode: phShiftEstimate.mode,
                            labelFa:
                              phShiftEstimate.typicalBufferGrams +
                              ' گرم ' +
                              phShiftEstimate.reagentFa
                          })
                        }
                        className="bg-wine text-white hover:opacity-95 px-3.5 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-opacity cursor-pointer"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>
                          + ثبت مستقیم دوز میانگین (
                          {phShiftEstimate.typicalBufferGrams} g{' '}
                          {phShiftEstimate.reagentFa}) در دفتر{' '}
                          {selectedTankLabelFa}
                        </span>
                      </button>
                    )}
                  </div>
                </div>

                {/* BOTTOM HALF: Collapsible SOP */}
                {expandedTests['sop-03'] && (
                  <div className="pt-4 border-t border-stone-200 space-y-5">
                    {renderSopFallbackBox('sop-03')}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200/80 space-y-1.5">
                        <h4 className="font-bold text-emerald-950 flex items-center gap-1.5">
                          <Info className="w-4 h-4 text-emerald-700" />
                          <span>نقش حیاتی شاخص pH در انولوژی</span>
                        </h4>
                        <ul className="list-disc list-inside space-y-1 text-stone-800 leading-relaxed">
                          <li><strong>قرمز رشه هدف:</strong> 3.45 تا 3.55 (قفل طلایی مستر پروتکل: 3.52).</li>
                          <li><strong>اگر pH بالای 3.65 رود:</strong> کارایی گوگرد دی‌اکسید (SO2) به شدت سقوط کرده و باکتری‌های فاسدکننده (برتانومایسس، استیک) فعال می‌شوند.</li>
                          <li><strong>اگر pH زیر 3.25 افت کند:</strong> تخمیر کند یا متوقف می‌شود و نیاز به اسیدزدایی با بی‌کربنات پتاسیم (KHCO3) دارد.</li>
                        </ul>
                      </div>

                      <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
                        <h4 className="font-bold text-stone-900 flex items-center gap-1.5">
                          <FileCheck className="w-4 h-4 text-stone-700" />
                          <span>ملزومات کالیبراسیون استاندارد</span>
                        </h4>
                        <ul className="list-disc list-inside space-y-1 text-stone-700 leading-relaxed">
                          <li>pH متر دیجیتال آزمایشگاهی با رزولوشن 0.01.</li>
                          <li>محلول بافر استاندارد pH 7.00 و pH 4.01 تازه در دمای ۲۰–۲۵ درجه.</li>
                          <li>محلول ذخیره الکترود: کلرید پتاسیم ۳ مولار (KCl 3M). هرگز الکترود را در آب مقطر خشک نکنید!</li>
                          <li>پیپت شستشو با آب مقطر و دستمال بدون پرز (Kimwipes).</li>
                        </ul>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-bold text-stone-900 text-xs sm:text-sm">
                        دستورالعمل کالیبراسیون و سنجش نمونه برای اپراتور:
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                        <div className="border border-stone-200 p-3 rounded-xl bg-white space-y-1.5">
                          <span className="text-xs font-bold text-emerald-800">گام ۱ · شستشو و بافر ۷.۰۰</span>
                          <p className="text-stone-600 leading-relaxed">
                            الکترود را از محلول KCl خارج کرده، با آب مقطر بشویید و بدون مالش با دستمال خشک کنید. در بافر ۷.۰۰ غوطه‌ور کرده و پس از ثبات، کلید CAL یا Offset را بزنید.
                          </p>
                        </div>

                        <div className="border border-stone-200 p-3 rounded-xl bg-white space-y-1.5">
                          <span className="text-xs font-bold text-emerald-800">گام ۲ · تنظیم شیب با بافر ۴.۰۱</span>
                          <p className="text-stone-600 leading-relaxed">
                            مجدداً الکترود را شسته و در بافر ۴.۰۱ قرار دهید. پس از تثبیت عدد، شیب (Slope) را تایید کنید. شیب باید بین ۹۵٪ تا ۱۰۵٪ باشد، در غیر این صورت الکترود جرم‌گرفته است.
                          </p>
                        </div>

                        <div className="border border-stone-200 p-3 rounded-xl bg-white space-y-1.5">
                          <span className="text-xs font-bold text-emerald-800">گام ۳ · قرائت نمونه شراب</span>
                          <p className="text-stone-600 leading-relaxed">
                            الکترود شسته را درون نمونه زلال ۵۰ میلی‌لیتری قرار دهید. محلول را به آرامی هم زده و حداقل ۴۵ ثانیه تا تثبیت عدد دیجیتال صبر کنید.
                          </p>
                        </div>

                        <div className="border border-stone-200 p-3 rounded-xl bg-white space-y-1.5">
                          <span className="text-xs font-bold text-emerald-800">گام ۴ · شستشو و بازگشت به KCl</span>
                          <p className="text-stone-600 leading-relaxed">
                            بلافاصله الکترود را با آب مقطر شسته (و در صورت رسوب رنگ با محلول استوک ۴ سیتریک ۲٪ تمیز کرده) و در کلاهک حاوی محلول KCl 3M قرار دهید.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------------- */}
          {/* TOOL 4 (SOP-04): Free SO2 Ripper, Molecular SO2 & KMS Calculator   */}
          {/* ----------------------------------------------------------------- */}
          {shouldShowSopCard('sop-04') && (
            <div
              id="lab-test-card-sop-04"
              className={`bg-surface rounded-xl border border-line shadow-xs overflow-hidden ${
                focusedHaloTestId === 'sop-04'
                  ? 'ring-2 ring-wine bg-wine/5 shadow-md transition-all duration-500'
                  : ''
              }`}
            >
              <div className="p-4 sm:p-5 bg-paper border-b border-line text-ink flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-surface border border-line flex items-center justify-center text-wine font-bold shrink-0">
                    <FlaskConical className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-ink-soft font-mono font-bold">
                      <span>SOP-TEST-04</span>
                      <span>·</span>
                      <span>KMS (g) = (ΔSO2 × V) / 570 (بازده ۵۷٪ سولفیت فعال)</span>
                      {renderSopCompatBadge('sop-04')}
                    </div>
                    <h3 className="font-bold text-sm sm:text-base text-ink mt-0.5">
                      ۴. سنجش سولفیت آزاد به روش ریپر، SO2 مولکولی و محاسبه‌گر متابی‌سولفیت (KMS)
                    </h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleExpand('sop-04')}
                  className="px-3 py-1.5 rounded-xl bg-surface hover:bg-stone-200/60 text-ink border border-line text-xs font-bold flex items-center gap-1.5 self-start sm:self-center cursor-pointer transition-colors whitespace-nowrap"
                >
                  <BookOpen className="w-3.5 h-3.5 text-wine" />
                  <span>{expandedTests['sop-04'] ? 'بستن راهنمای آزمایشگاهی' : 'نمایش راهنمای گام‌به‌گام آزمایشگاهی و نکات علمی'}</span>
                  {expandedTests['sop-04'] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              <div className="p-5 sm:p-6 space-y-5">
                {/* TOP HALF: Interactive Superset Calculator (Ripper + Direct KMS + Unpressed Mash) */}
                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-4">
                  {/* Section A: Ripper Titration */}
                  <div className="bg-white p-3.5 rounded-xl border border-stone-200 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-2">
                      <span className="text-xs font-bold text-stone-900">
                        الف) محاسبه سولفیت آزاد از تیتراسیون یدومتری ریپر (Ripper Titration):
                      </span>
                      <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-rose-800">
                        <input
                          type="checkbox"
                          checked={useRipperForKMS}
                          onChange={(e) => setUseRipperForKMS(e.target.checked)}
                          className="w-4 h-4 accent-rose-700 rounded"
                        />
                        <span>استفاده از عدد تیتراسیون ریپر به عنوان سولفیت فعلی در محاسبه KMS</span>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                      <div>
                        <label className="block text-stone-700 font-bold mb-1">
                          حجم ید مصرفی (V_I2 mL):
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={ripperI2Vol}
                          onChange={(e) => setRipperI2Vol(parseFloat(e.target.value) || 0)}
                          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm font-bold font-mono tabular-nums text-stone-900 focus:border-rose-700 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-700 font-bold mb-1">
                          نرمالیته محلول ید (N):
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={ripperI2Norm}
                          onChange={(e) => setRipperI2Norm(parseFloat(e.target.value) || 0.02)}
                          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm font-bold font-mono tabular-nums text-stone-900 focus:border-rose-700 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-700 font-bold mb-1">
                          حجم نمونه شراب (mL):
                        </label>
                        <input
                          type="number"
                          step="1"
                          value={ripperSampleVol}
                          onChange={(e) => setRipperSampleVol(parseFloat(e.target.value) || 25)}
                          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm font-bold font-mono tabular-nums text-stone-900 focus:border-rose-700 focus:outline-none"
                        />
                      </div>
                      <div className="bg-stone-100 p-2.5 rounded-lg border border-stone-200 flex flex-col justify-center">
                        <span className="text-xs text-stone-600">سولفیت آزاد ریپر:</span>
                        <strong className="text-base font-bold font-mono tabular-nums text-rose-900">
                          {calculatedFreeSO2} mg/L (ppm)
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Section B: KMS Dosage & Molecular SO2 */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <label className="block text-stone-700 font-bold mb-1">
                        حجم شراب / مخزن (لیتر):
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={kmsVolume}
                        onChange={(e) => setKmsVolume(parseFloat(e.target.value) || 0)}
                        className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-bold font-mono tabular-nums text-stone-900 focus:border-rose-700 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-700 font-bold mb-1">
                        سولفیت آزاد فعلی (mg/L):
                      </label>
                      <input
                        type="number"
                        min="0"
                        disabled={useRipperForKMS}
                        value={activeCurrentSO2}
                        onChange={(e) => setKmsCurrentSO2(parseFloat(e.target.value) || 0)}
                        className="w-full rounded-lg border border-stone-300 bg-white disabled:bg-stone-100 px-3 py-2 text-sm font-bold font-mono tabular-nums text-stone-900 focus:border-rose-700 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-700 font-bold mb-1">
                        سولفیت آزاد هدف (mg/L):
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={kmsTargetSO2}
                        onChange={(e) => setKmsTargetSO2(parseFloat(e.target.value) || 0)}
                        className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-bold font-mono tabular-nums text-stone-900 focus:border-rose-700 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-700 font-bold mb-1">
                        pH فعلی شراب:
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={winePHForSO2}
                        onChange={(e) => setWinePHForSO2(parseFloat(e.target.value) || 3.52)}
                        className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-bold font-mono tabular-nums text-stone-900 focus:border-rose-700 focus:outline-none"
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer text-stone-800 text-xs font-bold bg-white p-2.5 rounded-lg border border-stone-200">
                    <input
                      type="checkbox"
                      checked={kmsUnpressedMash}
                      onChange={(e) => setKmsUnpressedMash(e.target.checked)}
                      className="w-4 h-4 accent-rose-700 rounded"
                    />
                    <span>
                      توده قرمز کراش‌شده پیش از پرسینگ (ضریب مایع به مش {flexParams.redMashLiquidYieldFactor} — حجم مؤثر مایع: {getEffectiveLiquidVolume(kmsVolume, kmsUnpressedMash, flexParams.redMashLiquidYieldFactor)} لیتر)
                    </span>
                  </label>
                  {renderDoubleDiscountGuard(
                    kmsVolume,
                    kmsUnpressedMash,
                    () => setKmsUnpressedMash(false),
                    (mashL) => setKmsVolume(mashL)
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3.5 bg-surface border border-line text-ink rounded-xl space-y-1">
                      <span className="text-ink-soft text-xs">سولفیت آزاد مبنا:</span>
                      <div className="text-xl font-bold font-mono tabular-nums text-ink">
                        {activeCurrentSO2} ppm (mg/L)
                      </div>
                    </div>

                    <div className="p-3.5 bg-surface border border-line text-ink rounded-xl space-y-1">
                      <span className="text-ink-soft text-xs">سولفیت مولکولی فعال (در pH {winePHForSO2}):</span>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold font-mono tabular-nums text-wine">
                          {calculatedMolSO2} mg/L
                        </span>
                        <span className="text-xs text-ink-soft">(هدف: 0.6–0.8 mg/L)</span>
                      </div>
                    </div>

                    <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl space-y-1">
                      <span className="text-rose-950 font-bold text-xs">
                        مقدار پودر خالص KMS مورد نیاز:
                      </span>
                      <div className="text-xl font-bold font-mono tabular-nums text-rose-900">
                        {neededKMS} گرم
                      </div>
                      {activeCurrentSO2 > kmsTargetSO2 && (
                        <div className="text-xs text-rose-900 pt-1.5 border-t border-rose-200 space-y-1">
                          <div className="font-bold text-rose-800">
                            پروتکل پلکانی ایمن AWRI جهت خنثی‌سازی مازاد ({stagedH2O2Plan.totalExcessSO2MgL} mg/L کل | در {stagedH2O2Plan.stagesRequired} مرحله، کف ایمن ≥ ۱۰ mg/L):
                          </div>
                          <div className="grid grid-cols-1 gap-1 bg-white/80 p-2 rounded-lg border border-rose-200 font-mono text-xs">
                            <div>
                              • سقف مجاز گام اول (≤ ۲۵ mg/L): <strong>{stagedH2O2Plan.currentStepReductionMgL} mg/L</strong> ← حداکثر <strong>{stagedH2O2Plan.maxCurrentStep3PercentMl} mL</strong> H₂O₂ ۳٪ (کل تئوری: {h2o2NeutralizationMl} mL)
                            </div>
                            <div className="text-emerald-900 font-bold">
                              • دوز شروع محافظه‌کارانه ۵۰٪ (Bench-Trial Step 1): <strong>{stagedH2O2Plan.recommendedSafeTrialStep1Ml} mL</strong>
                            </div>
                            <div className="text-amber-900">
                              • حجم کل محلول رقیق‌شده زیر ۱٪ با آب مقطر پیش از تزریق قطره ای: حداقل <strong>{stagedH2O2Plan.dilutedUnder1PercentTotalVolumeMl} mL</strong>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Protocol v2: pH-to-Free-SO2 Lookup Table, Auto-Target Button, Total SO2 Budget & Ascorbic Safety Interlock */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
                    <div className="bg-white p-3.5 rounded-xl border border-stone-200 space-y-2.5 text-xs">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-bold text-stone-900">
                          جدول هدف سولفیت آزاد بر اساس pH (جهت ۰.۶–۰.۸ mg/L مولکولی):
                        </span>
                        <button
                          type="button"
                          onClick={() => setKmsTargetSO2(pHBasedSO2Target.target)}
                          className="px-2.5 py-1 rounded-lg bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold transition-colors cursor-pointer"
                        >
                          اعمال خودکار هدف ({pHBasedSO2Target.target} mg/L برای pH {winePHForSO2})
                        </button>
                      </div>
                      <div className="overflow-x-auto border border-stone-200 rounded-lg">
                        <table className="w-full text-xs text-right">
                          <thead className="bg-stone-100 text-stone-800 font-bold">
                            <tr>
                              <th className="p-1.5">بازه pH شراب</th>
                              <th className="p-1.5">بازه Free SO2 (mg/L)</th>
                              <th className="p-1.5">هدف پیشنهادی</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-stone-100 font-mono tabular-nums">
                            <tr className={winePHForSO2 <= 3.30 ? 'bg-rose-50 font-bold text-rose-900' : ''}>
                              <td className="p-1.5">≤ 3.30 (رُزه ایده‌آل)</td>
                              <td className="p-1.5">20 – 26 mg/L</td>
                              <td className="p-1.5">24 mg/L</td>
                            </tr>
                            <tr className={winePHForSO2 > 3.30 && winePHForSO2 <= 3.40 ? 'bg-rose-50 font-bold text-rose-900' : ''}>
                              <td className="p-1.5">3.31 – 3.40</td>
                              <td className="p-1.5">24 – 32 mg/L</td>
                              <td className="p-1.5">28 mg/L</td>
                            </tr>
                            <tr className={winePHForSO2 > 3.40 && winePHForSO2 <= 3.50 ? 'bg-rose-50 font-bold text-rose-900' : ''}>
                              <td className="p-1.5">3.41 – 3.50</td>
                              <td className="p-1.5">30 – 40 mg/L</td>
                              <td className="p-1.5">35 mg/L</td>
                            </tr>
                            <tr className={winePHForSO2 > 3.50 && winePHForSO2 <= 3.60 ? 'bg-rose-50 font-bold text-rose-900' : ''}>
                              <td className="p-1.5">3.51 – 3.60 (قرمز رشه)</td>
                              <td className="p-1.5">37 – 49 mg/L</td>
                              <td className="p-1.5">42 mg/L</td>
                            </tr>
                            <tr className={winePHForSO2 > 3.60 ? 'bg-rose-50 font-bold text-rose-900' : ''}>
                              <td className="p-1.5">&gt; 3.60 (بافر پتاسیم)</td>
                              <td className="p-1.5">47 – 63 mg/L</td>
                              <td className="p-1.5">52 mg/L</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="bg-white p-3.5 rounded-xl border border-stone-200 space-y-2.5 text-xs flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-stone-900">
                            دفتر کل تجمعی سولفیت کل (Cumulative SO2 Ledger ≤ 150 mg/L):
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded font-mono font-bold text-xs ${
                              liveSO2LedgerTankA.isOverBudget
                                ? 'bg-rose-100 text-rose-900'
                                : 'bg-emerald-100 text-emerald-900'
                            }`}
                          >
                            ثبت‌شده مخزن A: {liveSO2LedgerTankA.estimatedTotalSO2MgL} / {liveSO2LedgerTankA.legalCeilingMgL} mg/L
                          </span>
                        </div>
                        <p className="text-xs text-stone-600 leading-relaxed">
                          تزریق خارجی ثبت‌شده از KMS در دیتابیس: <strong>{liveSO2LedgerTankA.addedFromKmsMgL} mg/L</strong> + تولید درون‌زاد مخمر: <strong>{liveSO2LedgerTankA.endogenousYeastMgL} mg/L</strong> | ظرفیت مجاز باقی‌مانده تا سقف قانونی: <strong>{liveSO2LedgerTankA.remainingBudgetMgL} mg/L</strong>.
                        </p>
                      </div>

                      <div
                        className={`p-2.5 rounded-lg border text-xs font-bold flex items-start gap-2 ${
                          activeCurrentSO2 >= 30
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                            : 'bg-amber-50 border-amber-300 text-amber-950'
                        }`}
                      >
                        <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-rose-700" />
                        <div>
                          <span className="block font-bold">
                            قفل ایمنی اسید اسکوربیک (ویتامین C — دوز 0.040 g/L معادل 0.80g در ۲۰L):
                          </span>
                          {activeCurrentSO2 >= 30 ? (
                            <span>
                              سطح سولفیت آزاد فعلی ({activeCurrentSO2} mg/L ≥ 30) کافی است؛ تزریق اسید اسکوربیک ۳۰ دقیقه قبل از بطری‌گذاری ایمن است.
                            </span>
                          ) : (
                            <span>
                              هشدار! سولفیت آزاد فعلی ({activeCurrentSO2} mg/L) زیر ۳۰ mg/L است! هرگز قبل از رساندن Free SO2 به سطح هدف، ویتامین C اضافه نکنید (خطر تولید آب‌اکسیژنه و قهوه‌ای شدن فوری شراب!).
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSaveKMS}
                      className="flex-1 min-w-[220px] py-2 px-3 rounded-lg bg-surface hover:bg-paper text-ink border border-line text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5 text-wine" />
                      <span>ذخیره نتیجه KMS و SO2 در پایگاه داده</span>
                    </button>

                    <button
                      type="button"
                      disabled={neededKMS <= 0}
                      onClick={() =>
                        handleDirectLogToTankLedger('kms_so2', {
                          referenceVolumeL: effectiveKmsVol,
                          primaryAmount: neededKMS,
                          calculatedSO2MgL: Math.max(
                            0,
                            kmsTargetSO2 - activeCurrentSO2
                          ),
                          labelFa: neededKMS + ' گرم KMS'
                        })
                      }
                      className="bg-wine text-white hover:opacity-95 px-3.5 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-opacity disabled:opacity-40 cursor-pointer"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>
                        + ثبت مستقیم {neededKMS} g متابیسولفیت (KMS) در دفتر{' '}
                        {selectedTankLabelFa}
                      </span>
                    </button>
                  </div>

                  {neededKMS > 0 && (() => {
                    const kmsStockPlan = calculateStockSolutionPlan(
                      neededKMS,
                      scalePrecision,
                      'kms'
                    );
                    return (
                      <StockSolutionSyringeSvg
                        volumeMl={kmsStockPlan.syringeVolumeMl}
                        labelFa="سرنگ مدرج محلول استوک KMS (۱۰٪)"
                        subtitleFa={kmsStockPlan.instructionFa}
                        liquidColorHex="#6e1f2f"
                      />
                    );
                  })()}
                </div>

                {/* BOTTOM HALF: Collapsible SOP */}
                {expandedTests['sop-04'] && (
                  <div className="pt-4 border-t border-stone-200 space-y-5">
                    {renderSopFallbackBox('sop-04')}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="p-3.5 bg-rose-50/60 rounded-xl border border-rose-200/80 space-y-1.5">
                        <h4 className="font-bold text-rose-950 flex items-center gap-1.5">
                          <Info className="w-4 h-4 text-rose-700" />
                          <span>مفهوم کلیدی SO2 مولکولی</span>
                        </h4>
                        <p className="text-stone-800 leading-relaxed">
                          فقط بخش مولکولی SO2 توانایی نفوذ به دیواره سلولی باکتری‌ها و مخمرهای فاسدکننده (مانند Brettanomyces) را دارد. نسبت SO2 مولکولی مستقیماً به pH بستگی دارد: در pH 3.3 مقدار 0.8 mg/L با 25 ppm سولفیت آزاد تامین می‌شود، اما در pH 3.6 به بیش از 50 ppm نیاز است!
                        </p>
                      </div>

                      <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
                        <h4 className="font-bold text-stone-900 flex items-center gap-1.5">
                          <FileCheck className="w-4 h-4 text-stone-700" />
                          <span>معرف‌های روش ریپر</span>
                        </h4>
                        <ul className="list-disc list-inside space-y-1 text-stone-700 leading-relaxed">
                          <li>محلول ید استاندارد 0.02 N (یا 0.01 N).</li>
                          <li>اسید سولفوریک رقیق (۱ بخش اسید غلیظ + ۳ بخش آب) یا اسید فسفریک ۲۵٪.</li>
                          <li>محلول شناساگر نشاسته ۱٪ تازه (ایجاد رنگ آبی با ید آزاد).</li>
                          <li>بی‌کربنات سدیم (حدود ۰.۵ گرم) جهت ایجاد پتوی محافظ گاز CO2 در ارلن.</li>
                        </ul>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-bold text-stone-900 text-xs sm:text-sm">
                        دستورالعمل اجرایی تیتراسیون ریپر برای اپراتور:
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                        <div className="border border-stone-200 p-3 rounded-xl bg-white space-y-1.5">
                          <span className="text-xs font-bold text-rose-800">گام ۱ · آماده‌سازی بستر اسیدی</span>
                          <p className="text-stone-600 leading-relaxed">
                            در ارلن ۲۵۰ میلی‌لیتری، ۵ میلی‌لیتر اسید سولفوریک رقیق و ۲ میلی‌لیتر شناساگر نشاسته و کمی جوش‌شیرین بریزید تا کف CO2 تشکیل شود.
                          </p>
                        </div>

                        <div className="border border-stone-200 p-3 rounded-xl bg-white space-y-1.5">
                          <span className="text-xs font-bold text-rose-800">گام ۲ · برداشت سریع نمونه</span>
                          <p className="text-stone-600 leading-relaxed">
                            ۲۵ میلی‌لیتر شراب زلال را با پیپت برداشته و نوک پیپت را زیر سطح مایع اسیدی تخلیه کنید تا تماس با اکسیژن هوا به صفر برسد.
                          </p>
                        </div>

                        <div className="border border-stone-200 p-3 rounded-xl bg-white space-y-1.5">
                          <span className="text-xs font-bold text-rose-800">گام ۳ · تیتراسیون فوری با ید</span>
                          <p className="text-stone-600 leading-relaxed">
                            بلافاصله با ید 0.02 N شروع به تیتر کردن کنید تا اولین رنگ آبی/بنفش پایدار به مدت ۱۵ ثانیه تشکیل شود.
                          </p>
                        </div>

                        <div className="border border-stone-200 p-3 rounded-xl bg-white space-y-1.5">
                          <span className="text-xs font-bold text-rose-800">گام ۴ · قرائت و فرمول</span>
                          <p className="text-stone-600 leading-relaxed">
                            حجم ید مصرفی را بخوانید. فرمول سولفیت آزاد برای ۲۵ میلی‌لیتر نمونه و ید 0.02 N برابر است با: <code className="font-bold text-rose-800">V_I2 × 25.6 ppm</code>.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------------- */}
          {/* TOOL 5 (SOP-05): YAN Budget & 3-Stage SNA Calculator              */}
          {/* ----------------------------------------------------------------- */}
          {shouldShowSopCard('sop-05') && (
            <div
              id="lab-test-card-sop-05"
              className={`bg-surface rounded-xl border border-line shadow-xs overflow-hidden ${
                focusedHaloTestId === 'sop-05'
                  ? 'ring-2 ring-wine bg-wine/5 shadow-md transition-all duration-500'
                  : ''
              }`}
            >
              <div className="p-4 sm:p-5 bg-paper border-b border-line text-ink flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-surface border border-line flex items-center justify-center text-wine font-bold shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-ink-soft font-mono font-bold">
                      <span>SOP-TEST-05</span>
                      <span>·</span>
                      <span>Sugar(g/L) = Brix × 10 × SG | Target YAN = Sugar × 1.05</span>
                      {renderSopCompatBadge('sop-05')}
                    </div>
                    <h3 className="font-bold text-sm sm:text-base text-ink mt-0.5">
                      ۵. بودجه‌بندی نیتروژن قابل جذب (YAN) و برنامه تغذیه ۳ مرحله‌ای (SNA)
                    </h3>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-center">
                  <a
                    href="https://pubchem.ncbi.nlm.nih.gov/compound/24261"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1.5 rounded-xl bg-surface hover:bg-stone-200/60 text-ink border border-line text-xs font-mono flex items-center gap-1 transition-colors whitespace-nowrap"
                    title="مشاهده اطلاعات ساختاری DAP در PubChem"
                  >
                    <span>PubChem CID: 24261 (DAP)</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <button
                    type="button"
                    onClick={() => toggleExpand('sop-05')}
                    className="px-3 py-1.5 rounded-xl bg-surface hover:bg-stone-200/60 text-ink border border-line text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-wine" />
                    <span>{expandedTests['sop-05'] ? 'بستن راهنمای آزمایشگاهی' : 'نمایش راهنمای گام‌به‌گام آزمایشگاهی و نکات علمی'}</span>
                    {expandedTests['sop-05'] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="p-5 sm:p-6 space-y-5">
                {/* TOP HALF: Interactive Calculator */}
                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-4">
                  <div
                    data-testid="yan-calc-active-yeast-banner"
                    className="rounded-xl border border-line bg-paper p-3 mb-3 flex flex-wrap items-center justify-between gap-2 text-xs text-ink"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold">
                        {`سویه مخمر فعال مخزن: ${activeTankYeastStrain.nameFa} (${activeTankYeastStrain.brand})`}
                      </span>
                      <span className="ltr-metric font-bold text-wine">
                        ضریب YAN: ×{activeTankYeastStrain.yanMultiplier} | دوز تلقیح: {activeTankYeastStrain.recommendedDoseGL} g/L در {activeTankYeastStrain.rehydrationTempC}°C
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={openYeastSelectorModal}
                      className="rounded-lg bg-wine text-white px-3 py-1.5 text-xs font-bold cursor-pointer"
                    >
                      تغییر سویه مخمر (۳۶ سویه)
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                    <div>
                      <label className="block text-stone-700 font-bold mb-1">
                        بریکس اولیه آب‌انگور (Brix₀):
                      </label>
                      <input
                        type="number"
                        min="16"
                        max="30"
                        step="0.5"
                        value={snaBrix}
                        onChange={(e) => setSnaBrix(parseFloat(e.target.value) || 22)}
                        className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-bold font-mono tabular-nums text-stone-900 focus:border-purple-700 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-700 font-bold mb-1">
                        حجم مخزن تخمیر (L):
                      </label>
                      <input
                        type="number"
                        min="10"
                        step="5"
                        value={snaVolume}
                        onChange={(e) => setSnaVolume(parseFloat(e.target.value) || 132)}
                        className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-bold font-mono tabular-nums text-stone-900 focus:border-purple-700 focus:outline-none"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-stone-700 font-bold">نیتروژن بومی (Natural YAN):</label>
                        <span className="text-xs font-mono text-emerald-800 bg-emerald-50 px-1.5 rounded border border-emerald-200">
                          ایده‌آل: 100
                        </span>
                      </div>
                      <input
                        type="number"
                        min="20"
                        max="250"
                        step="5"
                        value={snaNaturalYAN}
                        onChange={(e) => setSnaNaturalYAN(parseFloat(e.target.value) || 100)}
                        className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-bold font-mono tabular-nums text-stone-900 focus:border-purple-700 focus:outline-none"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-stone-700 font-bold">نیاز استرین مخمر:</label>
                        <span className="text-xs font-mono text-emerald-800 bg-emerald-50 px-1.5 rounded border border-emerald-200">
                          ایده‌آل: RC-212
                        </span>
                      </div>
                      <select
                        value={snaStrainDemand}
                        onChange={(e) =>
                          setSnaStrainDemand(e.target.value as 'low' | 'medium' | 'high')
                        }
                        className="w-full rounded-lg border border-stone-300 bg-white px-2.5 py-2 text-xs font-bold text-stone-900 focus:border-purple-700 focus:outline-none"
                      >
                        <option value="low">کم‌مصرف (×0.85 — EC-1118)</option>
                        <option value="medium">متوسط به بالا (×1.05 — RC-212 ایده‌آل)</option>
                        <option value="high">پرمصرف (×1.25 — Rhône 4600)</option>
                      </select>
                    </div>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer text-stone-800 text-xs font-bold bg-white p-2.5 rounded-lg border border-stone-200">
                    <input
                      type="checkbox"
                      checked={snaUnpressedMash}
                      onChange={(e) => setSnaUnpressedMash(e.target.checked)}
                      className="w-4 h-4 accent-purple-700 rounded"
                    />
                    <span>
                      توده قرمز کراش‌شده با پوست پیش از پرسینگ (ضریب مایع به مش ۰.۸۴ — حجم مؤثر مایع: {snaResults.effectiveVolumeL} لیتر)
                    </span>
                  </label>
                  {renderDoubleDiscountGuard(
                    snaVolume,
                    snaUnpressedMash,
                    () => setSnaUnpressedMash(false),
                    (mashL) => setSnaVolume(mashL)
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 p-3 bg-surface border border-line text-ink rounded-xl text-xs">
                    <div className="text-center p-1">
                      <span className="block text-xs text-ink-soft">وزن مخصوص اولیه و قند واقعی (% w/v):</span>
                      <strong className="font-mono tabular-nums text-sm text-ink">
                        SG {snaResults.initialSG} · {snaResults.sugarGPerL} g/L
                      </strong>
                    </div>
                    <div className="text-center p-1 sm:border-x border-line">
                      <span className="block text-xs text-ink-soft">کل YAN هدف / کمبود:</span>
                      <strong className="font-mono tabular-nums text-sm text-wine">
                        {snaResults.targetYAN} / کمبود {snaResults.neededYAN} mg/L
                      </strong>
                    </div>
                    <div className="text-center p-1 sm:border-l border-line">
                      <span className="block text-xs text-ink-soft">نیتروژن شیمیایی تجمعی:</span>
                      <strong className="font-mono tabular-nums text-sm text-ink">
                        {snaResults.suppliedChemicalYAN_mgL} mg N/L
                      </strong>
                    </div>
                    <div className="text-center p-1">
                      <span className="block text-xs text-ink-soft">معادل زیستی لالمند (Bio-Eq):</span>
                      <strong className="font-mono tabular-nums text-sm text-ink">
                        {snaResults.suppliedBioEquivalentYAN_mgL} mg N eq/L
                      </strong>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3.5 bg-white border border-stone-200 rounded-xl space-y-2">
                      <div className="font-bold text-purple-900 border-b border-stone-200 pb-1.5 flex items-center justify-between">
                        <span>نوبت ۱ (در SG {dynamicTriggers.sna1.toFixed(3)})</span>
                        <span className="text-xs text-stone-500">ارگانیک خالص</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-stone-700">Fermaid O:</span>
                        <strong className="text-stone-900 font-mono tabular-nums text-sm">{snaResults.fermaidO_1} g</strong>
                      </div>
                    </div>

                    <div className="p-3.5 bg-white border border-stone-200 rounded-xl space-y-2">
                      <div className="font-bold text-purple-900 border-b border-stone-200 pb-1.5 flex items-center justify-between">
                        <span>نوبت ۲ (در SG {dynamicTriggers.sna2.toFixed(3)} - ۱/۳ قند)</span>
                        <span className="text-xs text-stone-500">اوج تکثیر</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-stone-700">Fermaid K:</span>
                          <strong className="text-stone-900 font-mono tabular-nums text-sm">{snaResults.fermaidK_2} g</strong>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-stone-700">DAP (دی‌آمونیوم فسفات):</span>
                          <strong className="text-stone-900 font-mono tabular-nums text-sm">{snaResults.dap_2} g</strong>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-stone-700">سولفات روی خالص (2 mg/L):</span>
                          <strong className="text-stone-900 font-mono tabular-nums text-sm">
                            {snaResults.zinc_2} g (یا {(0.012 * snaResults.effectiveVolumeL).toFixed(2)}g Wyeast)
                          </strong>
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 bg-white border border-stone-200 rounded-xl space-y-2">
                      <div className="font-bold text-purple-900 border-b border-stone-200 pb-1.5 flex items-center justify-between">
                        <span>نوبت ۳ (در SG {dynamicTriggers.sna3.toFixed(3)} - ۱/۲ قند)</span>
                        <span className="text-xs text-emerald-700 font-bold">۱۰۰٪ ارگانیک</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-stone-700">Fermaid O (ارگانیک):</span>
                          <strong className="text-stone-900 font-mono tabular-nums text-sm">{snaResults.fermaidO_3} g</strong>
                        </div>
                        <div className="flex justify-between items-center text-xs text-rose-700 font-bold">
                          <span>Fermaid K / DAP:</span>
                          <span className="font-mono">0 g (ممنوع در ۱/۲ قند)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-purple-50 border border-purple-200 text-xs text-purple-950 space-y-1">
                    <div>
                      <strong>نکته استوکیومتری روی و حسابداری دوگانه نیتروژن: </strong>
                      {snaResults.zincNoteFa} همچنین اسیدهای آمینه ارگانیک Fermaid O دارای ۴۰ mg N/g نیتروژن شیمیایی مستقیم ({snaResults.suppliedChemicalYAN_mgL} mg N/L) و ۱۲۰ mg N eq/g کارایی بیولوژیکی ({snaResults.suppliedBioEquivalentYAN_mgL} mg N eq/L با ضریب 3x) هستند.
                    </div>
                    {snaResults.additionalFermaidOForPureChemicalParityG > 0 && (
                      <div className="text-purple-900 font-semibold">
                        • مابه‌التفاوت Fermaid O در صورت ملاک قرار دادن نیتروژن شیمیایی خالص (۱x بدون ضریب 3x لالمند):{' '}
                        <strong className="font-mono">{snaResults.additionalFermaidOForPureChemicalParityG} g</strong> اضافی در کل بچ ({snaResults.effectiveVolumeL}L).
                      </div>
                    )}
                  </div>

                  {/* Protocol v2: Dynamic SG0 Trigger Calculator & Reference Table */}
                  <div className="bg-white p-3.5 rounded-xl border border-purple-200 space-y-2.5 text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-bold text-purple-950">
                        محاسبه‌گر پویا نقاط تریگر وزن مخصوص بر اساس SG₀ واقعی: <code className="font-mono text-purple-800">SG_trigger = SG₀ - f × (SG₀ - 1.000)</code>
                      </span>
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-bold">
                        SG₀ فعلی شما: {dynamicTriggers.initialSG.toFixed(3)}
                      </span>
                    </div>
                    <div className="overflow-x-auto border border-stone-200 rounded-lg">
                      <table className="w-full text-xs text-right">
                        <thead className="bg-stone-100 text-stone-800 font-bold">
                          <tr>
                            <th className="p-2">ایستگاه تغذیه / استخراج (ضریب افت قند f)</th>
                            <th className="p-2">SG₀ = 1.084 (۲۰.۵°Bx)</th>
                            <th className="p-2">SG₀ = 1.092 (۲۲.۰°Bx مرجع)</th>
                            <th className="p-2">SG₀ = 1.100 (۲۳.۸°Bx)</th>
                            <th className="p-2 bg-purple-50 text-purple-950">تریگر پویا بچ شما</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100 font-mono tabular-nums">
                          <tr>
                            <td className="p-2 font-sans font-bold text-stone-800">۱. تریگر SNA-1 (افت ۱۰٪ قند — f = 0.10)</td>
                            <td className="p-2">1.076</td>
                            <td className="p-2">1.083</td>
                            <td className="p-2">1.090</td>
                            <td className="p-2 bg-purple-50 font-bold text-purple-900">{dynamicTriggers.sna1.toFixed(3)}</td>
                          </tr>
                          <tr>
                            <td className="p-2 font-sans font-bold text-stone-800">۲. تریگر SNA-2 (افت ۲۴٪ قند — f = 0.24)</td>
                            <td className="p-2">1.064</td>
                            <td className="p-2">1.070</td>
                            <td className="p-2">1.076</td>
                            <td className="p-2 bg-purple-50 font-bold text-purple-900">{dynamicTriggers.sna2.toFixed(3)}</td>
                          </tr>
                          <tr>
                            <td className="p-2 font-sans font-bold text-rose-800">۳. سقف ۱/۳ قند (آخرین مهلت مجاز DAP — f = 0.33)</td>
                            <td className="p-2">1.056</td>
                            <td className="p-2">1.062</td>
                            <td className="p-2">1.067</td>
                            <td className="p-2 bg-purple-50 font-bold text-rose-800">{dynamicTriggers.oneThirdCeiling.toFixed(3)}</td>
                          </tr>
                          <tr>
                            <td className="p-2 font-sans font-bold text-stone-800">۴. تانن فاز ۲ و حذف هسته (f = 0.35) / SNA-3 ارگانیک (f = 0.38)</td>
                            <td className="p-2">1.055 / 1.052</td>
                            <td className="p-2">1.060 / 1.057</td>
                            <td className="p-2">1.065 / 1.062</td>
                            <td className="p-2 bg-purple-50 font-bold text-emerald-800">
                              {dynamicTriggers.phase2Tannin.toFixed(3)} / {dynamicTriggers.sna3.toFixed(3)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={handleSaveYAN}
                      className="w-full py-2 px-3 rounded-lg bg-surface hover:bg-paper text-ink border border-line text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5 text-wine" />
                      <span>ذخیره برنامه تغذیه نیتروژن YAN در پایگاه داده</span>
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleDirectLogToTankLedger('sna_1', {
                            referenceVolumeL: snaResults.effectiveVolumeL,
                            primaryAmount: snaResults.fermaidO_1,
                            labelFa:
                              'SNA-1 (' +
                              snaResults.fermaidO_1 +
                              ' گرم Fermaid O)'
                          })
                        }
                        className="bg-wine text-white hover:opacity-95 px-3 py-2 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-opacity cursor-pointer"
                      >
                        <PlusCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>
                          + ثبت SNA-1 ({snaResults.fermaidO_1} g Fermaid O) در
                          دفتر {selectedTankLabelFa}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDirectLogToTankLedger('sna_2', {
                            referenceVolumeL: snaResults.effectiveVolumeL,
                            primaryAmount: snaResults.fermaidK_2,
                            secondaryAmount: snaResults.dap_2,
                            tertiaryAmount: snaResults.zinc_2,
                            labelFa:
                              'بسته کامل SNA-2 (' +
                              snaResults.fermaidK_2 +
                              'g K + ' +
                              snaResults.dap_2 +
                              'g DAP)'
                          })
                        }
                        className="bg-wine text-white hover:opacity-95 px-3 py-2 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-opacity cursor-pointer"
                      >
                        <PlusCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>
                          + ثبت SNA-2 ({snaResults.fermaidK_2}g K +{' '}
                          {snaResults.dap_2}g DAP + {snaResults.zinc_2}g Zn) در
                          دفتر {selectedTankLabelFa}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDirectLogToTankLedger('sna_3', {
                            referenceVolumeL: snaResults.effectiveVolumeL,
                            primaryAmount: snaResults.fermaidO_3,
                            labelFa:
                              'SNA-3 (' +
                              snaResults.fermaidO_3 +
                              ' گرم Fermaid O)'
                          })
                        }
                        className="bg-wine text-white hover:opacity-95 px-3 py-2 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-opacity cursor-pointer"
                      >
                        <PlusCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>
                          + ثبت SNA-3 ({snaResults.fermaidO_3} g Fermaid O) در
                          دفتر {selectedTankLabelFa}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* BOTTOM HALF: Collapsible SOP */}
                {expandedTests['sop-05'] && (
                  <div className="pt-4 border-t border-stone-200 space-y-5">
                    {renderSopFallbackBox('sop-05')}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="p-3.5 bg-purple-50/60 rounded-xl border border-purple-200/80 space-y-1.5">
                        <h4 className="font-bold text-purple-950 flex items-center gap-1.5">
                          <Info className="w-4 h-4 text-purple-700" />
                          <span>منطق علمی تغذیه مرحله‌ای (SNA)</span>
                        </h4>
                        <p className="text-stone-800 leading-relaxed">
                          افزودن یکباره تمام نیتروژن در روز صفر اشتباه است؛ این کار باعث تکثیر انفجاری اولیه سلول‌ها، تولید شدید حرارت، تخلیه زودهنگام مواد غذایی و استاپ در پایان تخمیر می‌شود. تقسیم دوز به ۳ نوبت کلیدی بر پایه افت قند (Brix Break) سلامت تخمیر را تضمین می‌کند.
                        </p>
                      </div>

                      <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
                        <h4 className="font-bold text-stone-900 flex items-center gap-1.5">
                          <FileCheck className="w-4 h-4 text-stone-700" />
                          <span>مکمل‌های تخصصی</span>
                        </h4>
                        <ul className="list-disc list-inside space-y-1 text-stone-700 leading-relaxed">
                          <li><strong>فرومید O (Fermaid O):</strong> نیتروژن کاملاً ارگانیک از عصاره مخمر غیرفعال.</li>
                          <li><strong>فرومید K (Fermaid K):</strong> نیتروژن ارگانیک + مواد معدنی، تیامین و اسیدهای چرب حیاتی.</li>
                          <li><strong>دی‌آمونیوم فسفات (DAP):</strong> نیتروژن معدنی سریع‌الجذب (فقط در اوج تکثیر در ۱/۳ قند).</li>
                          <li><strong>سولفات روی (ZnSO4 / Servomyces):</strong> کوفاکتور آنزیم الکل‌دهیدروژناز (۰.۰۱۲ g/L).</li>
                        </ul>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-bold text-stone-900 text-xs sm:text-sm">
                        زمان‌بندی ۳ نوبت طلایی تغذیه مرحله‌ای (SNA):
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div className="border border-stone-200 p-3.5 rounded-xl bg-white space-y-1.5">
                          <span className="text-xs font-bold text-purple-800">
                            نوبت اول: در SG 1.083 (۲۴ ساعت پس از تلقیح)
                          </span>
                          <h5 className="font-bold text-stone-900">فاز لگاریتمی شروع</h5>
                          <p className="text-stone-600 leading-relaxed">
                            هنگامی که اولین نشانه‌های کلاهک بالا آمد: تزریق دوز ارگانیک <strong className="text-purple-900">Fermaid O (0.25 g/L)</strong> حل‌شده در آب ولرم پس از گاززدایی کلاهک.
                          </p>
                        </div>

                        <div className="border border-stone-200 p-3.5 rounded-xl bg-white space-y-1.5">
                          <span className="text-xs font-bold text-purple-800">
                            نوبت دوم: افت ۱/۳ قند (SG ~ 1.070)
                          </span>
                          <h5 className="font-bold text-stone-900">اوج مصرف نیتروژن (پایان نیتروژن معدنی)</h5>
                          <p className="text-stone-600 leading-relaxed">
                            نقطه اوج حرارت و متابولیسم: ترکیب <strong className="text-purple-900">Fermaid K (0.25 g/L) + DAP (0.15 g/L) + سولفات روی (0.012 g/L)</strong>.
                          </p>
                        </div>

                        <div className="border border-stone-200 p-3.5 rounded-xl bg-white space-y-1.5">
                          <span className="text-xs font-bold text-purple-800">
                            نوبت سوم: افت ۱/۲ قند (SG ~ 1.057)
                          </span>
                          <h5 className="font-bold text-stone-900">سوخت نهایی استقامت (۱۰۰٪ نیتروژن ارگانیک)</h5>
                          <p className="text-stone-600 leading-relaxed">
                            در الکل ۶–۷٪ مخمر قادر به انتقال آمونیوم معدنی (DAP/Fermaid K) نیست؛ صرفاً <strong className="text-purple-900">Fermaid O (0.30 g/L — ۱۰۰٪ نیتروژن ارگانیک)</strong> تزریق شود تا نیتروژن آزاد برای برتانومایسس و اتیل کاربامات باقی نماند.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------------- */}
          {/* TOOL 6 (SOP-06): Cap Temperature & Thermal Cooling Calculator     */}
          {/* ----------------------------------------------------------------- */}
          {shouldShowSopCard('sop-06') && (
            <div
              id="lab-test-card-sop-06"
              className={`bg-surface rounded-xl border border-line shadow-xs overflow-hidden ${
                focusedHaloTestId === 'sop-06'
                  ? 'ring-2 ring-wine bg-wine/5 shadow-md transition-all duration-500'
                  : ''
              }`}
            >
              <div className="p-4 sm:p-5 bg-paper border-b border-line text-ink flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-surface border border-line flex items-center justify-center text-wine font-bold shrink-0">
                    <Thermometer className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-ink-soft font-mono font-bold">
                      <span>SOP-TEST-06</span>
                      <span>·</span>
                      <span>Q = m × Cp × ΔT (Cp = 3.9 kJ/kg·°C)</span>
                      {renderSopCompatBadge('sop-06')}
                    </div>
                    <h3 className="font-bold text-sm sm:text-base text-ink mt-0.5">
                      ۶. پایش حرارتی مغز کلاهک و محاسبه یخ خشک یا بطری یخ خنک‌کننده
                    </h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleExpand('sop-06')}
                  className="px-3 py-1.5 rounded-xl bg-surface hover:bg-stone-200/60 text-ink border border-line text-xs font-bold flex items-center gap-1.5 self-start sm:self-center cursor-pointer transition-colors whitespace-nowrap"
                >
                  <BookOpen className="w-3.5 h-3.5 text-wine" />
                  <span>{expandedTests['sop-06'] ? 'بستن راهنمای آزمایشگاهی' : 'نمایش راهنمای گام‌به‌گام آزمایشگاهی و نکات علمی'}</span>
                  {expandedTests['sop-06'] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              <div className="p-5 sm:p-6 space-y-5">
                {/* TOP HALF: Interactive Calculator */}
                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block text-stone-700 font-bold mb-1">
                        دمای فعلی مغز کلاهک (°C):
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={capTempCurrent}
                        onChange={(e) => setCapTempCurrent(parseFloat(e.target.value) || 28)}
                        className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-bold font-mono tabular-nums text-stone-900 focus:border-rose-700 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-700 font-bold mb-1">
                        دمای هدف خنک‌سازی (°C):
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        value={capTempTarget}
                        onChange={(e) => setCapTempTarget(parseFloat(e.target.value) || 26)}
                        className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-bold font-mono tabular-nums text-stone-900 focus:border-rose-700 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-700 font-bold mb-1">
                        حجم شیره مخزن (L):
                      </label>
                      <input
                        type="number"
                        step="5"
                        value={coolingBatchVol}
                        onChange={(e) => setCoolingBatchVol(parseFloat(e.target.value) || 132)}
                        className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-bold font-mono tabular-nums text-stone-900 focus:border-rose-700 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-surface border border-line text-ink rounded-xl space-y-1">
                      <span className="text-ink-soft text-xs">وضعیت ایمنی حرارتی کلاهک:</span>
                      <div
                        className={`text-sm sm:text-base font-bold ${
                          capTempCurrent >= 29.5
                            ? 'text-danger'
                            : capTempCurrent >= 28.5
                            ? 'text-amber-800'
                            : 'text-emerald-800'
                        }`}
                      >
                        {capTempCurrent >= 29.5
                          ? '× بحران حرارتی قرمز (≥ 29.5°C — خطر مرگ مخمر!)'
                          : capTempCurrent >= 28.5
                          ? '▲ آستانه هشدار زرد (≥ 28.5°C — نیازمند خنک‌سازی)'
                          : '● بازه بهینه و کاملاً ایمن (20–28°C)'}
                      </div>
                    </div>

                    <div className="p-4 bg-white border border-stone-200 rounded-xl space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold text-stone-800">
                        <span>یخ خشک خوراکی (Dry Ice):</span>
                        <span className="text-lg font-bold font-mono tabular-nums text-rose-800">
                          {dryIceNeededKg} کیلوگرم
                        </span>
                      </div>
                      <p className="text-xs text-stone-500">
                        گرمای نهان تصعید: ۵۷۱ kJ/kg (همراه با ایجاد پتوی محافظ CO2)
                      </p>
                    </div>

                    <div className="p-4 bg-white border border-stone-200 rounded-xl space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold text-stone-800">
                        <span>یا بطری ۱.۵ لیتری یخ ضدعفونی‌شده:</span>
                        <span className="text-lg font-bold font-mono tabular-nums text-blue-800">
                          {iceBottlesNeeded} عدد بطری
                        </span>
                      </div>
                      <p className="text-xs text-stone-500">
                        هر بطری ۱.۵ لیتری یخ حدود ۵۰۰ kJ گرما از زیر کلاهک جذب می‌کند
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSaveCooling}
                    className="w-full py-2 px-3 rounded-lg bg-wine hover:opacity-95 text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5 text-white" />
                    <span>ذخیره محاسبه خنک‌سازی کلاهک در پایگاه داده</span>
                  </button>
                </div>

                {/* BOTTOM HALF: Collapsible SOP */}
                {expandedTests['sop-06'] && (
                  <div className="pt-4 border-t border-stone-200 space-y-4 text-xs">
                    {renderSopFallbackBox('sop-06')}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3.5 bg-rose-50/60 rounded-xl border border-rose-200/80 space-y-1.5">
                        <h4 className="font-bold text-rose-950 flex items-center gap-1.5">
                          <Flame className="w-4 h-4 text-rose-700" />
                          <span>آستانه‌های حرارتی مرگبار مخمر RC-212</span>
                        </h4>
                        <ul className="list-disc list-inside space-y-1 text-stone-800 leading-relaxed">
                          <li><strong>بازه مطلوب:</strong> ۲۴ تا ۲۸ درجه سانتی‌گراد (استخراج بهینه رنگ و تانن بدون طعم پختگی).</li>
                          <li><strong>آستانه هشدار زرد (28.5 °C):</strong> غوطه‌ورسازی فوری کلاهک و خنک‌سازی فضا.</li>
                          <li><strong>آستانه بحران قرمز (≥ 29.5 °C):</strong> غشای فسفولیپیدی مخمر در حضور الکل تخریب شده و توقف تخمیر و جهش اسیدیته فرار (سرکه) رخ می‌دهد. اقدام فوری در کمتر از ۱۵ دقیقه الزامی است!</li>
                        </ul>
                      </div>

                      <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
                        <h4 className="font-bold text-stone-900 flex items-center gap-1.5">
                          <FileCheck className="w-4 h-4 text-stone-700" />
                          <span>روش صحیح ثبت دماسنج عمقی</span>
                        </h4>
                        <p className="text-stone-700 leading-relaxed">
                          تنها اندازه گرفتن دمای اتاق یا لایه سطحی کافی نیست! میله دماسنج استیل باید به عمق ۱۵ تا ۲۵ سانتی‌متری مغز کلاهک فشرده پوسته‌ها نفوذ کند و ۶۰ ثانیه ثابت بماند. اختلاف دمای کلاهک با مایع زیرین گاهی تا ۵ درجه سانتی‌گراد می‌رسد!
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------------- */}
          {/* TOOL 7 (SOP-07): Dryness & Residual Sugar Verification            */}
          {/* ----------------------------------------------------------------- */}
          {shouldShowSopCard('sop-07') && (
            <div
              id="lab-test-card-sop-07"
              className={`bg-surface rounded-xl border border-line shadow-xs overflow-hidden ${
                focusedHaloTestId === 'sop-07'
                  ? 'ring-2 ring-wine bg-wine/5 shadow-md transition-all duration-500'
                  : ''
              }`}
            >
              <div className="p-4 sm:p-5 bg-paper border-b border-line text-ink flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-surface border border-line flex items-center justify-center text-wine font-bold shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-ink-soft font-mono font-bold">
                      <span>SOP-TEST-07</span>
                      <span>·</span>
                      <span>SG(20°C) ≤ 0.993 &amp; Residual Sugar &lt; 2.0 g/L</span>
                      {renderSopCompatBadge('sop-07')}
                    </div>
                    <h3 className="font-bold text-sm sm:text-base text-ink mt-0.5">
                      ۷. تست خشکی نهایی شراب (Dryness) و پایش قندهای احیاکننده (Clinitest)
                    </h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleExpand('sop-07')}
                  className="px-3 py-1.5 rounded-xl bg-surface hover:bg-stone-200/60 text-ink border border-line text-xs font-bold flex items-center gap-1.5 self-start sm:self-center cursor-pointer transition-colors whitespace-nowrap"
                >
                  <BookOpen className="w-3.5 h-3.5 text-wine" />
                  <span>{expandedTests['sop-07'] ? 'بستن راهنمای آزمایشگاهی' : 'نمایش راهنمای گام‌به‌گام آزمایشگاهی و نکات علمی'}</span>
                  {expandedTests['sop-07'] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              <div className="p-5 sm:p-6 space-y-5">
                {/* TOP HALF: Interactive Dryness Evaluator */}
                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block text-stone-700 font-bold mb-1">
                        وزن مخصوص نهایی در ۲۰°C (SG):
                      </label>
                      <input
                        type="number"
                        step="0.001"
                        value={drynessSG}
                        onChange={(e) => setDrynessSG(parseFloat(e.target.value) || 0.993)}
                        className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-bold font-mono tabular-nums text-stone-900 focus:border-teal-700 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-700 font-bold mb-1">
                        تعداد روزهای ثبات کامل SG:
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={drynessStableDays}
                        onChange={(e) => setDrynessStableDays(parseFloat(e.target.value) || 0)}
                        className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-bold font-mono tabular-nums text-stone-900 focus:border-teal-700 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-700 font-bold mb-1">
                        قند احیاکننده (Clinitest / Fehling g/L):
                      </label>
                      <input
                        type="number"
                        step="0.2"
                        value={drynessRS}
                        onChange={(e) => setDrynessRS(parseFloat(e.target.value) || 0)}
                        className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-bold font-mono tabular-nums text-stone-900 focus:border-teal-700 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-surface border border-line text-ink rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <span className="text-xs text-ink-soft">حکم آزمایشگاهی پایان تخمیر الکلی:</span>
                      <div className={`text-sm sm:text-base font-bold ${isDryConfirmed ? 'text-emerald-800' : 'text-amber-800'}`}>
                        {isDryConfirmed
                          ? '● خشکی مطلق تایید شد (SG ≤ 0.995 و قند < 2.0 g/L) — مجاز به ۳۰ ساعت سرمایش ۱۵ درجه و سیفون روز دهم'
                          : '▲ تخمیر هنوز به خشکی مطلق نرسیده است — دمای ۲۲–۲۳ درجه حفظ شود و از سرمایش یا سولفیت‌زنی خودداری گردد'}
                      </div>
                    </div>
                    <span className="font-mono tabular-nums text-xs px-3 py-1 rounded-lg bg-paper border border-line text-ink shrink-0">
                      RS: {drynessRS} g/L
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleSaveDryness}
                    className="w-full py-2 px-3 rounded-lg bg-wine hover:opacity-95 text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5 text-white" />
                    <span>ذخیره نتیجه تست خشکی نهایی در پایگاه داده</span>
                  </button>
                </div>

                {/* BOTTOM HALF: Collapsible SOP */}
                {expandedTests['sop-07'] && (
                  <div className="pt-4 border-t border-stone-200 space-y-3 text-xs">
                    {renderSopFallbackBox('sop-07')}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="border border-stone-200 p-3.5 rounded-xl bg-white space-y-1">
                        <span className="font-bold text-teal-900 block">معیار ۱ · وزن مخصوص زیر ۱.۰۰۰</span>
                        <p className="text-stone-600 leading-relaxed">
                          چون چگالی الکل خالص ۰.۷۸۹ است، با مصرف تمام قندها، SG نهایی در ۲۰ درجه باید به بازه <strong>0.992 تا 0.994</strong> برسد.
                        </p>
                      </div>
                      <div className="border border-stone-200 p-3.5 rounded-xl bg-white space-y-1">
                        <span className="font-bold text-teal-900 block">معیار ۲ · ثبات متوالی هیدرومتر</span>
                        <p className="text-stone-600 leading-relaxed">
                          قرائت هیدرومتر باید طی ۲ تا ۳ روز متوالی در همان دما هیچ تغییری نکند (عدم تولید حباب‌های ریز CO2 در نمونه).
                        </p>
                      </div>
                      <div className="border border-stone-200 p-3.5 rounded-xl bg-white space-y-1">
                        <span className="font-bold text-teal-900 block">معیار ۳ · تست شیمیایی قند (Clinitest)</span>
                        <p className="text-stone-600 leading-relaxed">
                          تست قرص کلینیتست یا محلول فهلینگ A و B باید قند باقی‌مانده کمتر از <strong>2.0 g/L</strong> را نشان دهد تا خطر کدورت، گازدار شدن یا بالا زدن چوب‌پنبه در بطری به صفر برسد.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------------- */}
          {/* TOOL 8 (SOP-08): Bench Fining (Bentonite) & Copper Sulfate Stock  */}
          {/* ----------------------------------------------------------------- */}
          {shouldShowSopCard('sop-08') && (
            <div
              id="lab-test-card-sop-08"
              className={`bg-surface rounded-xl border border-line shadow-xs overflow-hidden ${
                focusedHaloTestId === 'sop-08'
                  ? 'ring-2 ring-wine bg-wine/5 shadow-md transition-all duration-500'
                  : ''
              }`}
            >
              <div className="p-4 sm:p-5 bg-paper border-b border-line text-ink flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-surface border border-line flex items-center justify-center text-wine font-bold shrink-0">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-ink-soft font-mono font-bold">
                      <span>SOP-TEST-08</span>
                      <span>·</span>
                      <span>Bench Fining &amp; CuSO4 Stock #2 (1.0 mg/mL)</span>
                      {renderSopCompatBadge('sop-08')}
                    </div>
                    <h3 className="font-bold text-sm sm:text-base text-ink mt-0.5">
                      ۸. تست سریالی فینینگ بنتونیت و محاسبه‌گر محلول استوک سولفات مس (حذف H2S)
                    </h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleExpand('sop-08')}
                  className="px-3 py-1.5 rounded-xl bg-surface hover:bg-stone-200/60 text-ink border border-line text-xs font-bold flex items-center gap-1.5 self-start sm:self-center cursor-pointer transition-colors whitespace-nowrap"
                >
                  <BookOpen className="w-3.5 h-3.5 text-wine" />
                  <span>{expandedTests['sop-08'] ? 'بستن راهنمای آزمایشگاهی' : 'نمایش راهنمای گام‌به‌گام آزمایشگاهی و نکات علمی'}</span>
                  {expandedTests['sop-08'] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              <div className="p-5 sm:p-6 space-y-5">
                {/* TOP HALF: Interactive Calculator */}
                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                    {/* Left: Bentonite Scaling */}
                    <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-3">
                      <h4 className="font-bold text-stone-900 border-b border-stone-200 pb-2">
                        الف) تبدیل دوز آزمایشی بنتونیت به کل حجم مخزن (مثلاً ۳۶L رُزه):
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-stone-700 font-bold mb-1">
                            دوز بهینه انتخابی (g/L):
                          </label>
                          <input
                            type="number"
                            step="0.05"
                            value={finingTrialRate}
                            onChange={(e) => setFiningTrialRate(parseFloat(e.target.value) || 0.2)}
                            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm font-bold font-mono tabular-nums text-stone-900 focus:border-indigo-700 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-stone-700 font-bold mb-1">
                            حجم کل شراب در مخزن (L):
                          </label>
                          <input
                            type="number"
                            step="2"
                            value={finingTankVol}
                            onChange={(e) => setFiningTankVol(parseFloat(e.target.value) || 36)}
                            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm font-bold font-mono tabular-nums text-stone-900 focus:border-indigo-700 focus:outline-none"
                          />
                        </div>
                      </div>
                      <div className="p-3 bg-paper border border-line text-ink rounded-xl space-y-1">
                        <div className="flex justify-between">
                          <span className="text-ink-soft">وزن پودر خشک بنتونیت:</span>
                          <strong className="font-mono tabular-nums text-base text-wine">{finingGramsNeeded} گرم</strong>
                        </div>
                        <div className="flex justify-between border-t border-line pt-1 text-xs">
                          <span className="text-ink-soft">معادل حجم دوغاب ۵٪ هیدراته:</span>
                          <span className="font-mono tabular-nums font-bold text-ink">{bentoniteSlurry5PercentMl} mL</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Copper Sulfate Stock #2 Scaling */}
                    <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-3">
                      <h4 className="font-bold text-stone-900 border-b border-stone-200 pb-2">
                        ب) محاسبه حجم محلول استوک ۲ سولفات مس ۰.۱٪ (ایستگاه ۵ - روز ۱۰):
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-stone-700 font-bold mb-1">
                            دوز مس تاییدشده در تست (mg/L):
                          </label>
                          <input
                            type="number"
                            step="0.05"
                            min="0"
                            max="1.0"
                            value={copperDoseMgL}
                            onChange={(e) => setCopperDoseMgL(parseFloat(e.target.value) || 0.25)}
                            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm font-bold font-mono tabular-nums text-stone-900 focus:border-indigo-700 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-stone-700 font-bold mb-1">
                            حجم شراب صاف (L):
                          </label>
                          <input
                            type="number"
                            step="5"
                            value={copperTankVol}
                            onChange={(e) => setCopperTankVol(parseFloat(e.target.value) || 105)}
                            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm font-bold font-mono tabular-nums text-stone-900 focus:border-indigo-700 focus:outline-none"
                          />
                        </div>
                      </div>
                      <div className="p-3 bg-paper border border-line text-ink rounded-xl space-y-1">
                        <div className="flex justify-between">
                          <span className="text-ink-soft">حجم برداشت از بطری استوک ۲ (1 mg/mL):</span>
                          <strong className="font-mono tabular-nums text-base text-wine">{copperStock2Ml} mL</strong>
                        </div>
                        <div className="text-xs text-ink-soft border-t border-line pt-1">
                          تزریق پیش از افزودن باکتیلس در روز ۱۱ تا مس اضافی توسط کیتوزان جذب و حذف شود (۱۰mL در هر گالن ۲۰L برای دوز 0.5 mg/L).
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Protocol v2: Day 85/86 Bench Trials for Heavy Press Blending (0%, 3%, 5%) & 10% Glycerin Stock Solution */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs pt-2">
                    <div className="bg-white p-4 rounded-xl border border-indigo-200 space-y-3">
                      <h4 className="font-bold text-indigo-950 border-b border-indigo-100 pb-2">
                        ج) تست ۳ لیوانی آمیزش شراب پرس سنگین در روز ۸۶ (۰٪، ۳٪ و ۵٪ در ۱۰۰mL):
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-stone-700 font-bold mb-1">
                            درصد آمیزش منتخب (%):
                          </label>
                          <input
                            type="number"
                            step="0.5"
                            min="0"
                            max="15"
                            value={blendPressPct}
                            onChange={(e) => setBlendPressPct(parseFloat(e.target.value) || 0)}
                            className="w-full rounded-lg border border-stone-300 px-3 py-1.5 text-sm font-bold font-mono tabular-nums text-stone-900"
                          />
                        </div>
                        <div className="bg-indigo-50 p-2.5 rounded-lg border border-indigo-200 flex flex-col justify-center">
                          <span className="text-xs text-indigo-800">حجم پرس سنگین در {copperTankVol}L:</span>
                          <strong className="text-sm font-bold font-mono tabular-nums text-indigo-950">
                            {Math.round(((blendPressPct / 100) * copperTankVol) * 100) / 100} لیتر ({Math.round(((blendPressPct / 100) * 20) * 100) / 100}L در گالن ۲۰L)
                          </strong>
                        </div>
                      </div>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        <strong>روش تست ۳ لیوانی ۱۰۰ میلی‌لیتری:</strong> لیوان ۱ (شاهد ۰٪: ۱۰۰mL شراب آب‌آزاد)، لیوان ۲ (۳٪: ۹۷mL آب‌آزاد + ۳.۰mL شراب پرس)، لیوان ۳ (۵٪: ۹۵mL آب‌آزاد + ۵.۰mL شراب پرس). فقط در صورتی که شراب پرس ساختار و پیچیدگی را بدون تلخی ارتقا دهد آمیزش کنید.
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-indigo-200 space-y-3">
                      <h4 className="font-bold text-indigo-950 border-b border-indigo-100 pb-2">
                        د) تست ۳ لیوانی محلول استوک ۱۰٪ گلیسیرین در روز ۸۵ (چگالی 1.26 g/mL):
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-stone-700 font-bold mb-1">
                            دوز گلیسیرین تاییدشده (g/L):
                          </label>
                          <input
                            type="number"
                            step="0.5"
                            min="0"
                            max="5"
                            value={glycerinDoseGL}
                            onChange={(e) => setGlycerinDoseGL(parseFloat(e.target.value) || 0)}
                            className="w-full rounded-lg border border-stone-300 px-3 py-1.5 text-sm font-bold font-mono tabular-nums text-stone-900"
                          />
                        </div>
                        <div className="bg-indigo-50 p-2.5 rounded-lg border border-indigo-200 flex flex-col justify-center">
                          <span className="text-xs text-indigo-800">سهم هر گالن ۲۰ لیتری:</span>
                          <strong className="text-sm font-bold font-mono tabular-nums text-indigo-950">
                            {Math.round(glycerinDoseGL * 20 * 10) / 10} گرم ({Math.round(((glycerinDoseGL * 20) / 1.26) * 10) / 10} mL)
                          </strong>
                        </div>
                      </div>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        <strong>ساخت استوک ۱۰٪ گلیسیرین:</strong> ۱۰ گرم گلیسیرین را با آب مقطر به حجم ۱۰۰mL برسانید. در ۳ لیوان ۱۰۰mL شراب، مقادیر ۰، ۱.۵mL (معادل 1.5 g/L) و ۳.۵mL (معادل 3.5 g/L) تست کنید. <strong>اختلاط ۲ مرحله‌ای:</strong> گلیسیرین ویسکوز را ابتدا در ۵۰۰mL شراب گرم‌شده تا ۲۷°C کاملاً حل کرده و سپس به گالن اضافه کنید.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={handleSaveFining}
                      className="w-full py-2 px-3 rounded-lg bg-surface hover:bg-paper text-ink border border-line text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5 text-wine" />
                      <span>ذخیره محاسبه فینینگ بنتونیت و استوک مس در پایگاه داده</span>
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleDirectLogToTankLedger('fining_bentonite', {
                            referenceVolumeL: finingTankVol,
                            primaryAmount: finingGramsNeeded,
                            labelFa: finingGramsNeeded + ' گرم بنتونیت'
                          })
                        }
                        className="bg-wine text-white hover:opacity-95 px-3 py-2 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-opacity cursor-pointer"
                      >
                        <PlusCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>
                          + ثبت مستقیم {finingGramsNeeded} g زلال‌ساز در دفتر{' '}
                          {selectedTankLabelFa}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDirectLogToTankLedger('copper_stock_ml', {
                            referenceVolumeL: copperTankVol,
                            primaryAmount: copperStock2Ml,
                            labelFa: copperStock2Ml + ' میلی‌لیتر استوک مس'
                          })
                        }
                        className="bg-wine text-white hover:opacity-95 px-3 py-2 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-opacity cursor-pointer"
                      >
                        <PlusCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>
                          + ثبت مستقیم {copperStock2Ml} mL استوک مس در دفتر{' '}
                          {selectedTankLabelFa}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDirectLogToTankLedger('post_press_day11_lock', {
                            referenceVolumeL: postPressActualVol,
                            primaryAmount: postPressBactilessG,
                            secondaryAmount: postPressKmsG,
                            labelFa:
                              'بسته روز ۱۱ (' +
                              postPressBactilessG +
                              'g باکتیلس + ' +
                              postPressKmsG +
                              'g KMS)'
                          })
                        }
                        className="bg-wine text-white hover:opacity-95 px-3 py-2 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-opacity cursor-pointer"
                      >
                        <PlusCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>
                          + ثبت بسته روز ۱۱ ({postPressBactilessG}g باکتیلس +{' '}
                          {postPressKmsG}g KMS) در دفتر {selectedTankLabelFa}
                        </span>
                      </button>
                    </div>

                    {copperStock2Ml > 0 && (
                      <StockSolutionSyringeSvg
                        volumeMl={copperStock2Ml}
                        labelFa="سرنگ مدرج محلول استوک ۰.۱٪ سولفات مس (۱ mg/mL)"
                        subtitleFa="تزریق دقیق بر اساس نتیجه تست ۵ لیوانی"
                        liquidColorHex="#2563eb"
                      />
                    )}
                  </div>
                </div>

                {/* BOTTOM HALF: Collapsible SOP */}
                {expandedTests['sop-08'] && (
                  <div className="pt-4 border-t border-stone-200 space-y-3 text-xs">
                    {renderSopFallbackBox('sop-08')}
                    <div className="p-3.5 bg-indigo-50/60 rounded-xl border border-indigo-200 space-y-1.5">
                      <h4 className="font-bold text-indigo-950">پروتکل تست سریالی بنتونیت و تست ۴ لیوانی مس/اسکوربیک:</h4>
                      <p className="text-stone-800 leading-relaxed">
                        <strong>۱. بنتونیت رُزه (ساعت ۰۰:۰۰ روز صفر):</strong> ۷.۲۰ گرم بنتونیت را روی سطح ۱۵۰ میلی‌لیتر آب گرم ۵۰ درجه بپاشید و ۵.۵ ساعت استراحت دهید تا ژل ۴.۸٪ تشکیل شود و در ساعت ۰۵:۳۰ به ۳۶ لیتر شیره رُزه اضافه کنید. در تست سریالی لوله آزمایشگاهی می‌توانید دوزهای 0.2، 0.4، 0.6 و 0.8 گرم بر لیتر را در ۴ لوله ۱۰۰ میلی‌لیتری مقایسه نمایید.
                      </p>
                      <p className="text-stone-800 leading-relaxed">
                        <strong>۲. تست ۴ لیوانی حذف بوی گوگرد (روز ۱۰):</strong> لیوان ۱ (شاهد)، لیوان ۲ (۰.۰۲۵ mL استوک مس معادل 0.25 mg/L)، لیوان ۳ (۰.۰۵۰ mL استوک مس معادل 0.50 mg/L)، لیوان ۴ (۰.۳۰ mL استوک ۲B اسید اسکوربیک + ۰.۰۲۵ mL استوک مس برای شکستن دی‌سولفیدها).
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------------- */}
          {/* TOOL 9 (SOP-09): Batch Mass & Volume Scaling Calculator (400kg)   */}
          {/* ----------------------------------------------------------------- */}
          {shouldShowSopCard('sop-09') && (
            <div
              id="lab-test-card-sop-09"
              className={`bg-surface rounded-xl border border-line shadow-xs overflow-hidden ${
                focusedHaloTestId === 'sop-09'
                  ? 'ring-2 ring-wine bg-wine/5 shadow-md transition-all duration-500'
                  : ''
              }`}
            >
              <div className="p-4 sm:p-5 bg-paper border-b border-line text-ink flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-surface border border-line flex items-center justify-center text-wine font-bold shrink-0">
                    <Scale className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-ink-soft font-mono font-bold">
                      <span>SOP-TEST-09</span>
                      <span>·</span>
                      <span>مبنای مرجع: ۴۰۰ کیلوگرم انگور دست‌چین رشه سردشت</span>
                      {renderSopCompatBadge('sop-09')}
                    </div>
                    <h3 className="font-bold text-sm sm:text-base text-ink mt-0.5">
                      ۹. موازنه مهندسی جرم و حجم و مقیاس‌پذیری بچ (Batch Mass &amp; Volume Scaling)
                    </h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleExpand('sop-09')}
                  className="px-3 py-1.5 rounded-xl bg-surface hover:bg-stone-200/60 text-ink border border-line text-xs font-bold flex items-center gap-1.5 self-start sm:self-center cursor-pointer transition-colors whitespace-nowrap"
                >
                  <BookOpen className="w-3.5 h-3.5 text-wine" />
                  <span>{expandedTests['sop-09'] ? 'بستن راهنمای موازنه حجمی' : 'نمایش جدول کامل موازنه جرم و حجم مستر پروتکل'}</span>
                  {expandedTests['sop-09'] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              <div className="p-5 sm:p-6 space-y-5">
                {/* TOP HALF: Interactive Scaling Calculator */}
                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-4">
                  <div className="max-w-md text-xs">
                    <label className="block text-stone-700 font-bold mb-1">
                      وزن کل انگور ورودی به کارگاه (کیلوگرم):
                    </label>
                    <input
                      type="number"
                      min="50"
                      max="10000"
                      step="50"
                      value={grapeWeight}
                      onChange={(e) => setGrapeWeight(parseFloat(e.target.value) || 0)}
                      className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-bold font-mono tabular-nums text-stone-900 focus:border-amber-700 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="bg-white p-3 rounded-xl border border-stone-200">
                      <span className="text-stone-500 block text-xs">حجم توده کراش‌شده (Must):</span>
                      <strong className="text-sm sm:text-base font-bold font-mono tabular-nums text-stone-900">
                        {scaledBatch.mashVolume} لیتر
                      </strong>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-stone-200">
                      <span className="text-stone-500 block text-xs">فاز مایع اولیه کل (V_initial):</span>
                      <strong className="text-sm sm:text-base font-bold font-mono tabular-nums text-stone-900">
                        {scaledBatch.liquidVolume} لیتر
                      </strong>
                    </div>
                    <div className="bg-rose-50/80 p-3 rounded-xl border border-rose-200">
                      <span className="text-rose-800 block text-xs">خون‌گیری سانیه رُزه (۱۲٪ مایع):</span>
                      <strong className="text-sm sm:text-base font-bold font-mono tabular-nums text-rose-950">
                        {scaledBatch.saigneeVolume}L ← {scaledBatch.roseFermentVolume}L زلال
                      </strong>
                    </div>
                    <div className="bg-rose-50/80 p-3 rounded-xl border border-rose-200">
                      <span className="text-rose-800 block text-xs">محصول نهایی رُزه (روز ۱۰۰):</span>
                      <strong className="text-sm sm:text-base font-bold font-mono tabular-nums text-rose-950">
                        {scaledBatch.roseFinalVolume} L ({scaledBatch.roseBottles} بطری)
                      </strong>
                    </div>
                    <div className="bg-amber-50/80 p-3 rounded-xl border border-amber-200">
                      <span className="text-amber-900 block text-xs">مایع قرمز پس از سانیه (V_red-ferm):</span>
                      <strong className="text-sm sm:text-base font-bold font-mono tabular-nums text-amber-950">
                        {scaledBatch.redFermVolume} L ({scaledBatch.redPerTankVolume}L در هر مخزن)
                      </strong>
                    </div>
                    <div className="bg-amber-50/80 p-3 rounded-xl border border-amber-200">
                      <span className="text-amber-900 block text-xs">آب‌آزاد قرمز (Free-run روز ۶):</span>
                      <strong className="text-sm sm:text-base font-bold font-mono tabular-nums text-amber-950">
                        {scaledBatch.freeRunRed} لیتر
                      </strong>
                    </div>
                    <div className="bg-stone-100 p-3 rounded-xl border border-stone-300">
                      <span className="text-stone-700 block text-xs">شراب پرس سنگین (Heavy Press):</span>
                      <strong className="text-sm sm:text-base font-bold font-mono tabular-nums text-stone-900">
                        {scaledBatch.heavyPressRed} لیتر
                      </strong>
                    </div>
                    <div className="bg-emerald-50/80 p-3 rounded-xl border border-emerald-200">
                      <span className="text-emerald-900 block text-xs">محصول نهایی قرمز تراز اول:</span>
                      <strong className="text-sm sm:text-base font-bold font-mono tabular-nums text-emerald-950">
                        {scaledBatch.redFinalVolume} L ({scaledBatch.redBottles} بطری)
                      </strong>
                    </div>
                  </div>

                  {/* Protocol v2: Realistic Post-Pressing Volume Cascade & Per-Liter / Per-20L-Carboy Dosing Calculator */}
                  <div className="bg-white p-4 rounded-xl border border-amber-200 space-y-3 text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-2">
                      <div>
                        <h4 className="font-bold text-stone-900">
                          آبشار واقعی حجم پس از پرسینگ (در هر مخزن ۱۳۲L) و جدول دوزینگ بر پایه لیتر و گالن ۲۰ لیتری:
                        </h4>
                        <p className="text-xs text-stone-600">
                          مسیر واقعی هر مخزن قرمز: ۱۳۲L مایع تخمیری ← ~۱۰۰L شراب آب‌آزاد (بازه ۹۵ تا ۱۰۸L) ← ۹۶L سیفون اول (روز ۱۰) ← ۹۴L سیفون باکتیلس (روز ۲۱) ← ۹۳L سیفون سرد (روز ۸۰) + ۲۸L پرس سنگین مجموع دو مخزن (در ۲ گالن ۱۵ لیتری).
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <label className="font-bold text-stone-700">حجم واقعی اندازه‌گیری‌شده (V_actual L):</label>
                        <input
                          type="number"
                          min="10"
                          max="500"
                          value={postPressActualVol}
                          onChange={(e) => setPostPressActualVol(parseFloat(e.target.value) || 96)}
                          className="w-20 rounded-lg border border-amber-400 bg-amber-50/50 px-2.5 py-1 text-sm font-bold font-mono tabular-nums text-stone-900"
                        />
                      </div>
                    </div>

                    <div className="overflow-x-auto border border-stone-200 rounded-lg">
                      <table className="w-full text-xs text-right">
                        <thead className="bg-stone-100 text-stone-800 font-bold">
                          <tr>
                            <th className="p-2">ماده افزودنی (پس از پرسینگ)</th>
                            <th className="p-2">دوز واحد در هر لیتر (g/L یا mL/L)</th>
                            <th className="p-2 bg-amber-50 text-amber-950">سهم دقیق هر گالن ۲۰ لیتری</th>
                            <th className="p-2 bg-emerald-50 text-emerald-950">کل دوز برای {postPressActualVol} لیتر</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100 font-mono tabular-nums">
                          <tr>
                            <td className="p-2 font-sans font-bold text-stone-800">۱. متابی‌سولفیت تثبیت روز ۱۱ (KMS)</td>
                            <td className="p-2">0.070 g/L</td>
                            <td className="p-2 bg-amber-50 font-bold text-amber-950">1.40 g</td>
                            <td className="p-2 bg-emerald-50 font-bold text-emerald-900">{(0.070 * postPressActualVol).toFixed(2)} g</td>
                          </tr>
                          <tr>
                            <td className="p-2 font-sans font-bold text-stone-800">۲. کیتوزان باکتیلس روز ۱۱ (تعلیق در ۱۲۰mL شراب برای ۲۰L)</td>
                            <td className="p-2">0.300 g/L</td>
                            <td className="p-2 bg-amber-50 font-bold text-amber-950">6.00 g</td>
                            <td className="p-2 bg-emerald-50 font-bold text-emerald-900">{(0.300 * postPressActualVol).toFixed(2)} g</td>
                          </tr>
                          <tr>
                            <td className="p-2 font-sans font-bold text-stone-800">۳. استوک سولفات مس ۰.۱٪ (۰.۵ یا ۱.۰ mg/L)</td>
                            <td className="p-2">0.50 / 1.00 mL/L</td>
                            <td className="p-2 bg-amber-50 font-bold text-amber-950">10 mL / 20 mL</td>
                            <td className="p-2 bg-emerald-50 font-bold text-emerald-900">{(0.50 * postPressActualVol).toFixed(1)} / {(1.00 * postPressActualVol).toFixed(1)} mL</td>
                          </tr>
                          <tr>
                            <td className="p-2 font-sans font-bold text-stone-800">۴. تانن فینیشینگ قرمز (روز ۸۵) / تانن سفید رُزه</td>
                            <td className="p-2">0.025 g/L / 0.015 g/L</td>
                            <td className="p-2 bg-amber-50 font-bold text-amber-950">0.50 g / 0.30 g</td>
                            <td className="p-2 bg-emerald-50 font-bold text-emerald-900">{(0.025 * postPressActualVol).toFixed(2)} g / {(0.015 * postPressActualVol).toFixed(2)} g</td>
                          </tr>
                          <tr>
                            <td className="p-2 font-sans font-bold text-stone-800">۵. گلیسیرین سقف قرمز (۳.۵g/L) / رُزه (۱.۵g/L)</td>
                            <td className="p-2">3.50 g/L (2.8mL) / 1.50 g/L (1.2mL)</td>
                            <td className="p-2 bg-amber-50 font-bold text-amber-950">70g (56mL) / 30g (24mL)</td>
                            <td className="p-2 bg-emerald-50 font-bold text-emerald-900">{Math.round(3.5 * postPressActualVol)}g ({Math.round(2.8 * postPressActualVol)}mL)</td>
                          </tr>
                          <tr>
                            <td className="p-2 font-sans font-bold text-stone-800">۶. KMS پیش از بطری (روز ۹۹) + اسید اسکوربیک (روز ۱۰۰)</td>
                            <td className="p-2">0.035 g/L KMS + 0.040 g/L Vit C</td>
                            <td className="p-2 bg-amber-50 font-bold text-amber-950">0.70 g KMS + 0.80 g Vit C</td>
                            <td className="p-2 bg-emerald-50 font-bold text-emerald-900">{(0.035 * postPressActualVol).toFixed(2)}g KMS + {(0.040 * postPressActualVol).toFixed(2)}g Vit C</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSaveBatchScaling}
                    className="w-full py-2 px-3 rounded-lg bg-wine hover:opacity-95 text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5 text-white" />
                    <span>ذخیره مقادیر موازنه جرم و حجم در پایگاه داده</span>
                  </button>
                </div>

                {/* BOTTOM HALF: Collapsible Reference Balance Table */}
                {expandedTests['sop-09'] && (
                  <div className="pt-4 border-t border-stone-200 space-y-3 text-xs">
                    {renderSopFallbackBox('sop-09')}
                    <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl text-stone-800 leading-relaxed">
                      <strong>قاعده طلایی کالیبراسیون حجمی: </strong>
                      {RASHA_PROTOCOL.goldenRule}
                    </div>
                    <div className="overflow-x-auto border border-stone-200 rounded-xl">
                      <table className="w-full text-xs text-right">
                        <thead className="bg-stone-100 text-stone-800 font-bold border-b border-stone-200">
                          <tr>
                            <th className="p-2.5">ایستگاه فرآیند</th>
                            <th className="p-2.5">حجم / وزن مرجع (۴۰۰kg)</th>
                            <th className="p-2.5">توضیحات مهندسی و تفکیک مخازن A و B</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                          {RASHA_PROTOCOL.volumeBalances.map((vb, idx) => (
                            <tr key={idx}>
                              <td className="p-2.5 font-bold text-stone-900">{vb.stage}</td>
                              <td className="p-2.5 font-mono tabular-nums font-bold text-rose-900">{vb.volume}</td>
                              <td className="p-2.5 text-stone-700">{vb.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* SUB-TAB 2: INTERACTIVE SCENARIO EVALUATOR & 5 EMERGENCY CRISIS SOPS   */}
      {/* ===================================================================== */}
      {activeSubTab === 'troubleshooting-crises' && (
        <div className="space-y-6">
          {/* Interactive Scenario & Troubleshooting Evaluator */}
          <div className="bg-surface p-6 rounded-xl border border-line shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-wine text-white rounded-xl">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-ink text-base sm:text-lg">
                    الف) عیب‌یاب هوشمند و سیستم سناریوپردازی اصلاح تمام شرایط کارگاهی
                  </h3>
                  <p className="text-xs text-ink-soft">
                    بررسی کلیه شرایط و پارامترها (pH، دما، توقف تخمیر، بوهای نامطبوع) و ارائه فرمول دقیق دوز اصلاحی و دستورالعمل نجات بچ
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono text-wine font-bold">
                موتور تصمیم‌یار انولوژی
              </span>
            </div>

            {/* Symptom-Based Troubleshooting Chips (عیب‌یابی علامت‌محور) */}
            <div className="bg-paper p-3.5 rounded-xl border border-line space-y-2.5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-bold text-ink flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-wine" />
                  <span>عیب‌یابی علامت‌محور (انتخاب سریع علائم مشاهده‌شده):</span>
                </span>
                <span className="text-xs text-ink-soft">
                  با لمس هر علامت، پروتکل نجات و فرمول اصلاحی بلافاصله محاسبه می‌شود
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setTsH2S(!tsH2S)}
                  className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                    tsH2S
                      ? 'bg-wine text-white border-wine shadow-xs'
                      : 'bg-surface text-ink border-line hover:bg-stone-200/50'
                  }`}
                >
                  <span>بوی تخم‌مرغ گندیده (H2S)</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${tsH2S ? 'bg-white/20 text-white' : 'bg-paper text-ink-soft'}`}>
                    {tsH2S ? 'فعال' : 'غیرفعال'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setTsStuck(!tsStuck)}
                  className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                    tsStuck
                      ? 'bg-wine text-white border-wine shadow-xs'
                      : 'bg-surface text-ink border-line hover:bg-stone-200/50'
                  }`}
                >
                  <span>تخمیر کند شد / ایستاد</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${tsStuck ? 'bg-white/20 text-white' : 'bg-paper text-ink-soft'}`}>
                    {tsStuck ? 'فعال' : 'غیرفعال'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setTsVA(!tsVA)}
                  className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                    tsVA
                      ? 'bg-wine text-white border-wine shadow-xs'
                      : 'bg-surface text-ink border-line hover:bg-stone-200/50'
                  }`}
                >
                  <span>بوی سرکه / استون (VA)</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${tsVA ? 'bg-white/20 text-white' : 'bg-paper text-ink-soft'}`}>
                    {tsVA ? 'فعال' : 'غیرفعال'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setTsDryCap(!tsDryCap)}
                  className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                    tsDryCap
                      ? 'bg-wine text-white border-wine shadow-xs'
                      : 'bg-surface text-ink border-line hover:bg-stone-200/50'
                  }`}
                >
                  <span>سطح کلاهک خشک شد</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${tsDryCap ? 'bg-white/20 text-white' : 'bg-paper text-ink-soft'}`}>
                    {tsDryCap ? 'فعال' : 'غیرفعال'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setTsBitterSeeds(!tsBitterSeeds)}
                  className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                    tsBitterSeeds
                      ? 'bg-wine text-white border-wine shadow-xs'
                      : 'bg-surface text-ink border-line hover:bg-stone-200/50'
                  }`}
                >
                  <span>طعم گس و تلخ هسته</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${tsBitterSeeds ? 'bg-white/20 text-white' : 'bg-paper text-ink-soft'}`}>
                    {tsBitterSeeds ? 'فعال' : 'غیرفعال'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setTsCloudy(!tsCloudy)}
                  className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                    tsCloudy
                      ? 'bg-wine text-white border-wine shadow-xs'
                      : 'bg-surface text-ink border-line hover:bg-stone-200/50'
                  }`}
                >
                  <span>کدورت و ابری بودن</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${tsCloudy ? 'bg-white/20 text-white' : 'bg-paper text-ink-soft'}`}>
                    {tsCloudy ? 'فعال' : 'غیرفعال'}
                  </span>
                </button>
              </div>
            </div>

            {/* Live Scenario Inputs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-stone-700 font-bold mb-1">حجم مخزن (L):</label>
                <input
                  type="number"
                  min="10"
                  value={tsVol}
                  onChange={(e) => setTsVol(parseFloat(e.target.value) || 132)}
                  className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm font-bold font-mono tabular-nums text-stone-900 focus:border-rose-700 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-stone-700 font-bold mb-1">وزن مخصوص (SG):</label>
                <input
                  type="number"
                  step="0.001"
                  value={tsSG}
                  onChange={(e) => setTsSG(parseFloat(e.target.value) || 1.060)}
                  className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm font-bold font-mono tabular-nums text-stone-900 focus:border-rose-700 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-stone-700 font-bold mb-1">دمای کلاهک (°C):</label>
                <input
                  type="number"
                  step="0.5"
                  value={tsTemp}
                  onChange={(e) => setTsTemp(parseFloat(e.target.value) || 28.5)}
                  className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm font-bold font-mono tabular-nums text-stone-900 focus:border-rose-700 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-stone-700 font-bold mb-1">اسیدیته (pH):</label>
                <input
                  type="number"
                  step="0.01"
                  value={tsPH}
                  onChange={(e) => setTsPH(parseFloat(e.target.value) || 3.52)}
                  className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm font-bold font-mono tabular-nums text-stone-900 focus:border-rose-700 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-stone-700 font-bold mb-1">اسیدیته قابل تیتر (TA g/L):</label>
                <input
                  type="number"
                  step="0.1"
                  value={tsTA}
                  onChange={(e) => setTsTA(parseFloat(e.target.value) || 6.2)}
                  className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm font-bold font-mono tabular-nums text-stone-900 focus:border-rose-700 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-stone-700 font-bold mb-1">سولفیت آزاد (Free SO2 mg/L):</label>
                <input
                  type="number"
                  value={tsSO2}
                  onChange={(e) => setTsSO2(parseFloat(e.target.value) || 0)}
                  className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm font-bold font-mono tabular-nums text-stone-900 focus:border-rose-700 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-stone-700 font-bold mb-1">بریکس خوانده‌شده (Brix):</label>
                <input
                  type="number"
                  step="0.5"
                  value={tsBrix}
                  onChange={(e) => setTsBrix(parseFloat(e.target.value) || 0)}
                  className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm font-bold font-mono tabular-nums text-stone-900 focus:border-rose-700 focus:outline-none"
                />
              </div>
              <div className="col-span-2 sm:col-span-4 flex flex-wrap items-center gap-3 pt-2">
                <label className="flex items-center gap-1.5 cursor-pointer text-stone-800 font-bold">
                  <input
                    type="checkbox"
                    checked={tsStuck}
                    onChange={(e) => setTsStuck(e.target.checked)}
                    className="w-4 h-4 accent-rose-700 rounded"
                  />
                  <span>توقف/کُند شدن تخمیر</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-stone-800 font-bold">
                  <input
                    type="checkbox"
                    checked={tsH2S}
                    onChange={(e) => setTsH2S(e.target.checked)}
                    className="w-4 h-4 accent-rose-700 rounded"
                  />
                  <span>بوی تخم‌مرغ گندیده (H2S)</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-stone-800 font-bold">
                  <input
                    type="checkbox"
                    checked={tsVA}
                    onChange={(e) => setTsVA(e.target.checked)}
                    className="w-4 h-4 accent-rose-700 rounded"
                  />
                  <span>بوی سرکه/لاک (VA)</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-stone-800 font-bold">
                  <input
                    type="checkbox"
                    checked={tsDryCap}
                    onChange={(e) => setTsDryCap(e.target.checked)}
                    className="w-4 h-4 accent-rose-700 rounded"
                  />
                  <span>خشکی سطح کلاهک پوست</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-stone-800 font-bold">
                  <input
                    type="checkbox"
                    checked={tsBitterSeeds}
                    onChange={(e) => setTsBitterSeeds(e.target.checked)}
                    className="w-4 h-4 accent-rose-700 rounded"
                  />
                  <span>تلخی و گسی هسته انگور</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-stone-800 font-bold">
                  <input
                    type="checkbox"
                    checked={tsCloudy}
                    onChange={(e) => setTsCloudy(e.target.checked)}
                    className="w-4 h-4 accent-rose-700 rounded"
                  />
                  <span>کدورت پایدار (پکتین/پروتئین)</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-pink-900 font-bold bg-pink-50 px-2.5 py-1 rounded-lg border border-pink-200">
                  <input
                    type="checkbox"
                    checked={tsIsRose}
                    onChange={(e) => setTsIsRose(e.target.checked)}
                    className="w-4 h-4 accent-pink-700 rounded"
                  />
                  <span>بچ شراب رُزه (Rosé)</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-rose-900 font-bold bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                  <input
                    type="checkbox"
                    checked={tsUnpressed}
                    onChange={(e) => setTsUnpressed(e.target.checked)}
                    className="w-4 h-4 accent-rose-700 rounded"
                  />
                  <span>توده کراش‌شده با پوست/کلاهک (ضریب فاز مایع {flexParams.redMashLiquidYieldFactor})</span>
                </label>
              </div>
              <div className="col-span-2 sm:col-span-4">
                {renderDoubleDiscountGuard(
                  tsVol,
                  tsUnpressed,
                  () => setTsUnpressed(false),
                  (mashL) => setTsVol(mashL)
                )}
              </div>
            </div>

            {/* Diagnostic Output Results */}
            <div className="bg-stone-50 rounded-xl border border-stone-200 p-4 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2.5 rounded-xl text-white ${
                      troubleshootingResult.overallStatusColor === 'emerald'
                        ? 'bg-emerald-600'
                        : troubleshootingResult.overallStatusColor === 'amber'
                        ? 'bg-amber-600'
                        : 'bg-rose-700'
                    }`}
                  >
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-500">ارزیابی هومئوستاز بچ و آنالیز خطاها</div>
                    <div className="text-sm sm:text-base font-bold text-stone-900">
                      {troubleshootingResult.overallStatusText}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-stone-600">نمره سلامت کلی:</span>
                  <span
                    className={`text-lg font-bold font-mono tabular-nums px-3 py-1 rounded-xl border ${
                      troubleshootingResult.overallHealthScore >= 85
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                        : troubleshootingResult.overallHealthScore >= 65
                        ? 'bg-amber-100 text-amber-900 border-amber-300'
                        : 'bg-rose-100 text-rose-900 border-rose-300'
                    }`}
                  >
                    {troubleshootingResult.overallHealthScore} / 100
                  </span>
                </div>
              </div>

              {/* Informational Alerts (Zero Health Score Penalty — Idea 14) */}
              {troubleshootingResult.infoActions &&
                troubleshootingResult.infoActions.length > 0 && (
                  <div className="bg-sky-50 border border-sky-300 rounded-xl p-3.5 space-y-2 text-xs text-sky-950">
                    <div className="font-bold text-sky-900 flex items-center gap-1.5">
                      <Info className="w-4 h-4 text-sky-700 shrink-0" />
                      <span>نکات اطلاعاتی (بدون کسر امتیاز سلامت):</span>
                    </div>
                    {troubleshootingResult.infoActions.map((infoAct, iIdx) => (
                      <div key={iIdx} className="bg-white/90 border border-sky-200 rounded-lg p-2.5 space-y-1">
                        <div className="font-bold text-sky-950">{infoAct.title}</div>
                        <p className="text-xs leading-relaxed">{infoAct.solutionSummary}</p>
                      </div>
                    ))}
                  </div>
                )}

              {troubleshootingResult.visibleActions.length === 0 ? (
                <div className="p-4 bg-emerald-100/70 text-emerald-950 rounded-xl text-xs font-bold flex items-center gap-2 border border-emerald-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                  <span>
                    هیچ خطایی در مقادیر وارد شده یافت نشد. تمام پارامترها کاملاً بر طبق الگوی مرجع استخراج و تخمیر رشه سردشت تنظیم گردیده‌اند.
                  </span>
                </div>
              ) : (
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <h4 className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>
                        دستورالعمل‌های اصلاحی و دوزهای محاسباتی انولوژی (نمایش{' '}
                        {showAllTsAlerts
                          ? troubleshootingResult.actions.filter((a) => a.alertTier !== 'info').length
                          : troubleshootingResult.visibleActions.length}{' '}
                        مورد اولویت‌دار):
                      </span>
                    </h4>
                    {troubleshootingResult.hiddenActionsCount > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowAllTsAlerts((v) => !v)}
                        className="px-3 py-1 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold cursor-pointer"
                      >
                        {showAllTsAlerts
                          ? 'نمایش ۳ هشدار اولویت‌دار اول'
                          : `مشاهده همهٔ هشدارها (+${troubleshootingResult.hiddenActionsCount} مورد دیگر)`}
                      </button>
                    )}
                  </div>

                  {(showAllTsAlerts
                    ? troubleshootingResult.actions.filter((a) => a.alertTier !== 'info')
                    : troubleshootingResult.visibleActions
                  ).map((act, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border space-y-3 ${
                        act.severity === 'danger'
                          ? 'bg-rose-50/90 border-rose-300 text-rose-950'
                          : act.severity === 'warning'
                          ? 'bg-amber-50/90 border-amber-300 text-amber-950'
                          : 'bg-blue-50/90 border-blue-300 text-blue-950'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 border-b border-stone-200/60 pb-2">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <strong className="text-sm font-bold block">{act.title}</strong>
                            {act.confidenceBadge &&
                              act.confidenceBadge !== 'stoichiometric' &&
                              act.confidenceLabelFa && (
                                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/90 text-stone-800 border border-stone-300">
                                  {act.confidenceLabelFa}
                                </span>
                              )}
                          </div>
                          {/* Layer 1 Action & Layer 2 Why (Idea 13) */}
                          <p className="text-xs font-bold leading-relaxed">
                            {act.progressiveLayers?.layer1ActionFa ?? act.solutionSummary}
                          </p>
                          <p className="text-xs leading-relaxed opacity-90">
                            {act.progressiveLayers?.layer2WhyFa ?? act.diagnosis}
                          </p>
                        </div>
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded border shrink-0 ${
                            act.severity === 'danger'
                              ? 'bg-rose-200 text-rose-900 border-rose-400'
                              : 'bg-amber-200 text-amber-900 border-amber-400'
                          }`}
                        >
                          {act.severity === 'danger' ? 'مداخله فوری' : 'نیازمند اصلاح'}
                        </span>
                      </div>

                      {act.calculatedRecipe && act.calculatedRecipe.length > 0 && (
                        <div className="bg-white/80 p-3 rounded-lg border border-stone-200/80 space-y-1.5 text-xs">
                          <strong className="text-stone-900 block text-xs">فرمول اصلاحی و دوز خالص شیمیایی:</strong>
                          {act.calculatedRecipe.map((rec, rIdx) => (
                            <div key={rIdx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-stone-800">
                              <span className="font-bold">• {rec.item}:</span>
                              <span className="font-mono tabular-nums font-bold text-rose-900 text-sm">
                                {rec.amount} {rec.unit}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="space-y-1 text-xs">
                        <strong className="block text-xs text-stone-900">گام‌های اجرایی در کارگاه:</strong>
                        <ol className="list-decimal list-inside space-y-1 text-xs leading-relaxed opacity-95">
                          {act.steps.map((st, sIdx) => (
                            <li key={sIdx}>{st}</li>
                          ))}
                        </ol>
                      </div>

                      {/* Layer 3 Expandable Science & Formula Details (Idea 13) */}
                      {act.progressiveLayers && (
                        <div className="pt-1">
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedTsScienceIds((prev) => ({
                                ...prev,
                                [idx]: !prev[idx]
                              }))
                            }
                            className="text-xs font-bold underline cursor-pointer opacity-85 hover:opacity-100"
                          >
                            {expandedTsScienceIds[idx]
                              ? 'بستن جزئیات علمی و استوکیومتری (لایه ۳)'
                              : 'مشاهده مبنای علمی و استوکیومتری (لایه ۳)'}
                          </button>
                          {expandedTsScienceIds[idx] && (
                            <div className="mt-1.5 bg-white/90 border border-stone-300 rounded-lg p-2.5 text-xs font-mono text-stone-800">
                              {act.progressiveLayers.layer3ScienceFa}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={handleSaveTroubleshooting}
                className="w-full py-2.5 px-4 rounded-xl bg-wine hover:opacity-95 text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4 text-white" />
                <span>ذخیره دستورالعمل مداخله و عیب‌یابی در دیتابیس انولوژی</span>
              </button>
            </div>
          </div>

          {/* 5 Master Protocol Crisis Management SOPs */}
          <div className="bg-surface p-6 rounded-xl border border-line shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 border-b border-line pb-3">
              <div className="p-2 bg-wine text-white rounded-xl">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-ink text-base sm:text-lg">
                  ب) پروتکل‌های واکنش سریع و مدیریت ۵ بحران کارگاهی (مستر پروتکل رشه سردشت)
                </h3>
                <p className="text-xs text-ink-soft">
                  دستورالعمل‌های قطعی و گام‌به‌گام برای مهار بحران‌های حرارتی، بوی H2S، فوران CO2، توقف تخمیر و بالا زدن چوب‌پنبه
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {RASHA_PROTOCOL.crises.map((crisis) => (
                <div
                  key={crisis.id}
                  className="p-4 rounded-xl border border-line bg-paper space-y-2.5 text-xs"
                >
                  <h4 className="text-sm font-bold text-ink">{crisis.title}</h4>
                  <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-950">
                    <strong>خطر بیوشیمیایی: </strong>
                    <span>{crisis.danger}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-surface border border-line text-ink leading-relaxed">
                    <strong className="text-ink block mb-1">پروتکل اجرایی واکنش سریع:</strong>
                    <p>{crisis.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5 Standard Stock Solutions Reference */}
          <div className="bg-surface p-6 rounded-xl border border-line shadow-xs space-y-4">
            <h3 className="font-bold text-ink text-sm sm:text-base border-b border-line pb-2">
              ج) فرمول ساخت ۵ محلول استوک آزمایشگاهی و ضدعفونی (ایستگاه صفر مستر پروتکل)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {RASHA_PROTOCOL.stockSolutions.map((st, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-line bg-paper space-y-1.5">
                  <div className="flex items-center justify-between">
                    <strong className="text-ink text-sm">{st.num}: {st.title}</strong>
                    <span className="font-mono text-xs text-wine font-bold">{st.concentration}</span>
                  </div>
                  <p className="text-ink leading-relaxed">
                    <strong>روش ساخت: </strong>{st.formula}
                  </p>
                  <p className="text-ink-soft leading-relaxed">
                    <strong>کاربرد دقیق: </strong>{st.usage}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* SUB-TAB 3: SAVED CALCULATIONS HISTORY IN DATABASE                     */}
      {/* ===================================================================== */}
      {activeSubTab === 'saved-history' && (
        <div className="bg-surface rounded-xl border border-line p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line pb-3">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-wine" />
              <h3 className="text-base font-bold text-ink">
                تاریخچه محاسبات ثبت‌شده در پایگاه داده انولوژی ({savedCalculations.length} مورد)
              </h3>
            </div>
            <span className="text-xs text-ink-soft font-mono">
              ذخیره‌سازی پایدار در Enology Database
            </span>
          </div>

          {savedCalculations.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <Database className="w-8 h-8 text-stone-400 mx-auto" />
              <p className="text-sm font-bold text-stone-700">
                هنوز هیچ محاسبه‌ای در پایگاه داده ذخیره نشده است.
              </p>
              <p className="text-xs text-stone-500">
                با زدن دکمه «ذخیره در پایگاه داده» در هر یک از ۹ ماشین‌حساب یا عیب‌یاب سناریو، نتایج خود را بایگانی کنید.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {savedCalculations.map((calc) => (
                <div
                  key={calc.id}
                  className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <strong className="text-stone-900 text-sm">{calc.title}</strong>
                      <span className="text-xs text-stone-500 font-mono">{calc.timestamp}</span>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs text-stone-600">
                      {Object.entries(calc.inputs).map(([k, v]) => (
                        <span key={k} className="bg-stone-200/70 px-2 py-0.5 rounded text-stone-800">
                          {k}: <strong className="font-mono tabular-nums">{v}</strong>
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs text-stone-700">
                      {Object.entries(calc.results).map(([k, v]) => (
                        <span key={k} className="bg-white px-2.5 py-1 rounded-lg border border-stone-200 shadow-2xs">
                          {k}: <strong className="text-emerald-800 font-mono tabular-nums">{v}</strong>
                        </span>
                      ))}
                    </div>

                    {calc.notes && (
                      <p className="text-xs text-stone-500">{calc.notes}</p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteSavedCalc(calc.id)}
                    className="text-stone-400 hover:text-rose-600 p-2 rounded-lg hover:bg-white border border-transparent hover:border-stone-200 transition-colors cursor-pointer self-end sm:self-center"
                    title="حذف از پایگاه داده"
                    aria-label={`حذف محاسبه ${calc.title}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
