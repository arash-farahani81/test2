import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import type { TankId, WineBatch } from '../types/index.ts';
import { enologyDb } from '../db/enologyDatabase.ts';

export type GlobalTankSelection = 'tank-a' | 'tank-b' | 'tank-rose' | 'both-red';

export type AppFiveTabView = 'today' | 'tanks' | 'lab' | 'roadmap' | 'more';

export interface LabDeepLinkRequest {
  testId: string;
  subTab?: 'calculators-sops' | 'troubleshooting-crises' | 'saved-history';
  prefillTankId?: TankId;
  prefillSG?: number;
  prefillPH?: number;
  prefillSO2?: number;
  prefillTA?: number;
  prefillTempC?: number;
  prefillVolumeL?: number;
  returnToTab?: AppFiveTabView;
  timestampMs?: number;
}

export interface EnologyGlossaryItem {
  key: string;
  termFa: string;
  termEn: string;
  shortTooltipFa: string;
  formulaOrRangeFa?: string;
  whyItMattersFa: string;
}

export const ENOLOGY_GLOSSARY_DICTIONARY: Record<string, EnologyGlossaryItem> = {
  sg: {
    key: 'sg',
    termFa: 'چگالی ویژه (SG)',
    termEn: 'Specific Gravity',
    shortTooltipFa: 'نسبت چگالی شیره یا شراب به آب خالص در دمای مرجع ۲۰ درجه سانتی‌گراد.',
    formulaOrRangeFa: 'شروع: ~1.092 | پرسینگ: 1.008–1.010 | خشکی کامل: ≤ 0.994',
    whyItMattersFa:
      'با مصرف قند توسط مخمر و تولید الکل، چگالی مایع روزانه کاهش می‌یابد و تمام زمان‌بندی‌های تغذیه (SNA) و پرسینگ بر اساس آن تعیین می‌شود.'
  },
  brix: {
    key: 'brix',
    termFa: 'درجه بریکس (°Bx)',
    termEn: 'Degrees Brix',
    shortTooltipFa: 'درصد وزنی قندهای محلول در شیره انگور پیش از شروع تخمیر.',
    formulaOrRangeFa: 'هدف رشه سردشت: ۲۲.۰°Bx (معادل ~۱۲.۹٪ الکل بالقوه)',
    whyItMattersFa:
      'عیار قند اولیه انگور، پتانسیل الکلی شراب و نیاز مخمر به نیتروژن (YAN) را مشخص می‌کند.'
  },
  ph: {
    key: 'ph',
    termFa: 'اسیدیته فعال (pH)',
    termEn: 'Active Acidity (pH)',
    shortTooltipFa: 'معیار لگاریتمی تمرکز یون هیدروژن فعال در شیره و شراب.',
    formulaOrRangeFa: 'محدوده هدف قرمز: ۳.۴۵ تا ۳.۵۵ | رُزه: ۳.۲۰ تا ۳.۳۸',
    whyItMattersFa:
      'مستقیماً درصد سولفیت مولکولی فعال (ضدعفونی‌کننده)، پایداری رنگ قرمز (آنتوسیانین) و مقاومت در برابر فساد باکتریایی را کنترل می‌کند.'
  },
  ta: {
    key: 'ta',
    termFa: 'اسیدیته کل قابل تیتر (TA)',
    termEn: 'Titratable Acidity',
    shortTooltipFa: 'مجموع اسیدهای آلی شراب (تارتاریک، مالیک، سیتریک) بر حسب گرم بر لیتر اسید تارتاریک.',
    formulaOrRangeFa: 'محدوده هدف قرمز: ۶.۰ تا ۶.۸ g/L | رُزه: ۶.۵ تا ۷.۵ g/L',
    whyItMattersFa:
      'طراوت، شادابی طعمی و تعادل حسی شراب در دهان را رقم می‌زند و در برابر حس الکل و تانن توازن ایجاد می‌کند.'
  },
  free_so2: {
    key: 'free_so2',
    termFa: 'سولفیت آزاد (Free SO₂)',
    termEn: 'Free Sulfur Dioxide',
    shortTooltipFa: 'بخش غیرمتصل و فعال دی‌اکسید گوگرد در شراب که خاصیت آنتی‌اکسیدانی و ضدباکتری دارد.',
    formulaOrRangeFa: 'در pH = 3.52: هدف ۳۸ تا ۴۲ mg/L (بر اساس جدول پیوسته pH)',
    whyItMattersFa:
      'تنها بخش آزاد SO₂ است که از قهوه‌ای شدن شراب (اکسیداسیون) و فعالیت باکتری سرکه (استوباکتر) جلوگیری می‌کند.'
  },
  molecular_so2: {
    key: 'molecular_so2',
    termFa: 'سولفیت مولکولی (Molecular SO₂)',
    termEn: 'Molecular SO₂',
    shortTooltipFa: 'کسر گازی و نفوذپذیر از سولفیت آزاد که قادر به عبور از غشای سلولی میکروب‌هاست.',
    formulaOrRangeFa: 'شراب قرمز: ≥ 0.60 mg/L | شراب رُزه/سفید: ≥ 0.80 mg/L',
    whyItMattersFa:
      'با بالا رفتن pH، درصد سولفیت مولکولی به شدت افت می‌کند؛ بنابراین در pH بالاتر به سولفیت آزاد بیشتری نیاز است.'
  },
  total_so2: {
    key: 'total_so2',
    termFa: 'سولفیت کل تجمعی (Total SO₂)',
    termEn: 'Total Sulfur Dioxide',
    shortTooltipFa: 'مجموع سولفیت آزاد و سولفیت متصل به استالدهید، قندها و رنگدانه‌ها.',
    formulaOrRangeFa: 'سقف قانونی OIV قرمز خشک: ۱۵۰ mg/L | رُزه خشک: ۲۰۰ mg/L',
    whyItMattersFa:
      'رعایت سقف قانونی سولفیت کل مانع از بوی تند گوگرد، سوزش گلو و رنگ‌پریدگی دائمی شراب می‌شود.'
  },
  yan: {
    key: 'yan',
    termFa: 'نیتروژن قابل جذب مخمر (YAN)',
    termEn: 'Yeast Assimilable Nitrogen',
    shortTooltipFa: 'مجموع نیتروژن آمینواسیدی ارگانیک (FAN) و یون آمونیوم معدنی قابل مصرف توسط مخمر.',
    formulaOrRangeFa: 'هدف برای ۲۲°Bx و مخمر کم‌نیاز: ~۱۹۸ mg N/L',
    whyItMattersFa:
      'کمبود YAN عامل اصلی توقف تخمیر و تولید بوی تخم‌مرغ گندیده (گاز H₂S) توسط مخمر گرسنه است.'
  },
  sna: {
    key: 'sna',
    termFa: 'تغذیه پله‌ای مخمر (SNA)',
    termEn: 'Staggered Nutrient Addition',
    shortTooltipFa: 'تزریق مرحله‌ای مکمل‌های نیتروژنی (Fermaid O، Fermaid K و DAP) در نقاط مشخص افت SG.',
    formulaOrRangeFa: 'نوبت ۱: SG 1.083 | نوبت ۲: SG 1.067 | نوبت ۳: SG 1.057 (سقف ۱/۳ افت قند)',
    whyItMattersFa:
      'از شوک جمعیتی و جهش حرارتی مخمر در روز اول جلوگیری کرده و سلامت غشای سلولی را تا پایان تخمیر حفظ می‌کند.'
  },
  saignee: {
    key: 'saignee',
    termFa: 'خون‌گیری شیره (Saignée)',
    termEn: 'Saignée / Must Bleed-off',
    shortTooltipFa: 'جداسازی بخشی از شیره صاف صورتی پس از ۱۲ تا ۲۴ ساعت خیساندن سرد پوست.',
    formulaOrRangeFa: 'پروتکل ۴۰۰ کیلوگرم: ۱۸ لیتر از هر مخزن قرمز (مجموعاً ۳۶ لیتر برای گالن رُزه)',
    whyItMattersFa:
      'هم نسبت پوست به مایع را در مخازن قرمز بالا می‌برد (شراب قرمز غلیظ‌تر) و هم یک شراب رُزه معطر جانبی تولید می‌کند.'
  },
  pigeage: {
    key: 'pigeage',
    termFa: 'غوطه‌ورسازی کلاهک پوست (Pigeage)',
    termEn: 'Punch-down (Pigeage)',
    shortTooltipFa: 'فرو بردن ملایم لایه فشرده پوست‌های شناور به درون شیره در حال تخمیر.',
    formulaOrRangeFa: 'فاز اوج تخمیر: ۴ نوبت در شبانه‌روز (هر ۶ ساعت یک‌بار)',
    whyItMattersFa:
      'گرمای حبس‌شده در کلاهک را دفع می‌کند، رنگ و تانن پوست را استخراج می‌نماید و مانع خشک شدن کلاهک و رشد باکتری سرکه می‌شود.'
  },
  mlf: {
    key: 'mlf',
    termFa: 'تخمیر مالولاکتیک (MLF)',
    termEn: 'Malolactic Fermentation',
    shortTooltipFa: 'فرآیند باکتریایی تبدیل اسید مالیک دوکربوکسیلیک به اسید لاکتیک تک‌کربوکسیلیک.',
    formulaOrRangeFa: 'در انگور کم‌اسید رشه: مهار کامل با کیتوزان (Bactiless) + حفظ SO₂',
    whyItMattersFa:
      'در انگورهای مناطق گرم که اسیدیته طبیعی پایینی دارند، انجام MLF باعث جهش خطرناک pH بالای ۳.۸ و بی‌دفاع شدن شراب می‌شود.'
  },
  kms: {
    key: 'kms',
    termFa: 'متابی‌سولفیت پتاسیم (KMS)',
    termEn: 'Potassium Metabisulfite (K₂S₂O₅)',
    shortTooltipFa: 'نمک کریستالی سفید که منبع استاندارد آزادسازی گاز SO₂ در شراب‌سازی است.',
    formulaOrRangeFa: 'بازده استوکیومتری عملی: ۵۷.۶٪ (گرم KMS = لیتر × ppm هدف ÷ ۵۷۶)',
    whyItMattersFa:
      'ابزار اصلی کنترل اکسیداسیون، مهار مخمرهای وحشی در روز کراش و تثبیت شراب پیش از بطری‌گذاری است.'
  },
  bactiless: {
    key: 'bactiless',
    termFa: 'کیتوزان قارچی (Bactiless)',
    termEn: 'Fungal Chitosan (Bactiless)',
    shortTooltipFa: 'پلیمر زیست‌تخریب‌پذیر غیرحساسیت‌زا برای حذف فیزیکی باکتری‌های اسید لاکتیک و استیک.',
    formulaOrRangeFa: 'دوز استاندارد روز ۱۱: ۰.۳۰ گرم بر لیتر (۱۰ روز تماس و سپس سیفون)',
    whyItMattersFa:
      'بدون افزایش سولفیت کل، باکتری‌های عامل تخمیر مالولاکتیک ناخواسته و فساد سرکه‌ای را از شراب پاکسازی می‌کند.'
  },
  cold_stab: {
    key: 'cold_stab',
    termFa: 'تثبیت سرمایی تارتارات (Cold Stab)',
    termEn: 'Tartrate Cold Stabilization',
    shortTooltipFa: 'سرد کردن شراب به همراه بذر بی‌تارتارات پتاسیم (KHT) برای رسوب دادن نمک‌های اشباع.',
    formulaOrRangeFa: 'دمای -۲ تا +۲ درجه سانتی‌گراد به مدت ۱۴ روز (روز ۶۵ تا ۸۰)',
    whyItMattersFa:
      'مانع از تشکیل رسوب بلوری (الماس شراب) در کف بطری پس از عرضه و نگهداری در یخچال می‌شود.'
  }
};

export function getGlossaryItem(key: string): EnologyGlossaryItem | undefined {
  const normalized = key.trim().toLowerCase().replace(/[\s-]+/g, '_');
  return ENOLOGY_GLOSSARY_DICTIONARY[normalized] ?? ENOLOGY_GLOSSARY_DICTIONARY[key];
}

/**
 * Pure helper: adapts tank selection when batch has tankCount === 1.
 * When tankCount === 1, 'tank-b' and 'both-red' automatically adapt to 'tank-a'.
 */
export function resolveEffectiveTankSelection(
  selection: GlobalTankSelection,
  tankCount: 1 | 2 = 2
): GlobalTankSelection {
  if (tankCount === 1 && (selection === 'tank-b' || selection === 'both-red')) {
    return 'tank-a';
  }
  return selection;
}

/**
 * Pure helper: maps GlobalTankSelection to a single primary TankId
 * for calculators/charts that require a concrete TankId.
 */
export function resolvePrimaryTankId(
  selection: GlobalTankSelection,
  tankCount: 1 | 2 = 2
): TankId {
  const effective = resolveEffectiveTankSelection(selection, tankCount);
  if (effective === 'both-red') {
    return 'tank-a';
  }
  return effective;
}

/**
 * Pure helper: maps GlobalTankSelection to the array of concrete TankIds
 * targeted by batch/tank operations (e.g., logging or recording additions to both red tanks).
 */
export function resolveTargetTankIds(
  selection: GlobalTankSelection,
  tankCount: 1 | 2 = 2
): TankId[] {
  const effective = resolveEffectiveTankSelection(selection, tankCount);
  if (effective === 'both-red') {
    return tankCount === 1 ? ['tank-a'] : ['tank-a', 'tank-b'];
  }
  return [effective];
}

export interface TankSelectionOption {
  id: GlobalTankSelection;
  labelFa: string;
  shortLabelFa: string;
  isCombinedRed?: boolean;
}

export function getAvailableTankSelections(
  tankCount: 1 | 2 = 2,
  targetStyle: WineBatch['targetStyle'] = 'red'
): TankSelectionOption[] {
  if (targetStyle === 'rose') {
    return [
      {
        id: 'tank-rose',
        labelFa: 'گالن رُزه (Saignée)',
        shortLabelFa: 'رُزه'
      }
    ];
  }
  if (tankCount === 1) {
    return [
      {
        id: 'tank-a',
        labelFa: 'مخزن قرمز (تک‌مخزنه)',
        shortLabelFa: 'مخزن قرمز'
      },
      {
        id: 'tank-rose',
        labelFa: 'گالن رُزه (Saignée)',
        shortLabelFa: 'رُزه'
      }
    ];
  }
  return [
    {
      id: 'tank-a',
      labelFa: 'مخزن قرمز A',
      shortLabelFa: 'مخزن A'
    },
    {
      id: 'tank-b',
      labelFa: 'مخزن قرمز B',
      shortLabelFa: 'مخزن B'
    },
    {
      id: 'both-red',
      labelFa: 'هر دو مخزن قرمز (A + B)',
      shortLabelFa: 'هر دو قرمز (A+B)',
      isCombinedRed: true
    },
    {
      id: 'tank-rose',
      labelFa: 'گالن رُزه (Saignée)',
      shortLabelFa: 'رُزه'
    }
  ];
}

export function getTankSelectionLabelFa(
  selection: GlobalTankSelection,
  tankCount: 1 | 2 = 2
): string {
  const effective = resolveEffectiveTankSelection(selection, tankCount);
  if (effective === 'tank-rose') return 'گالن رُزه (Saignée)';
  if (effective === 'both-red') return 'هر دو مخزن قرمز (A + B)';
  if (effective === 'tank-b') return 'مخزن قرمز B';
  return tankCount === 1 ? 'مخزن قرمز (تک‌مخزنه)' : 'مخزن قرمز A';
}

export type FontScaleMode = 'normal' | 'large' | 'xlarge';
export type ScalePrecisionGrams = 1 | 0.1 | 0.01;

export interface EnologyUiContextValue {
  // Batch state
  batches: WineBatch[];
  activeBatchId: string;
  activeBatch: WineBatch | undefined;
  setActiveBatchId: (batchId: string) => void;
  tankCount: 1 | 2;
  hasDemoData: boolean;

  // Global tank selection ('tank-a' | 'tank-b' | 'tank-rose' | 'both-red')
  selectedTank: GlobalTankSelection;
  setSelectedTank: (selection: GlobalTankSelection) => void;
  globalTankSelection: GlobalTankSelection;
  setGlobalTankSelection: (selection: GlobalTankSelection) => void;
  primaryTankId: TankId;
  effectiveSingleTankId: TankId;
  targetTankIds: TankId[];
  isBothRedSelected: boolean;
  availableTankOptions: TankSelectionOption[];
  selectedTankLabelFa: string;

  // 5-Tab Workspace Navigation
  activeFiveTab: AppFiveTabView;
  setActiveFiveTab: (tab: AppFiveTabView) => void;
  activeTab: AppFiveTabView;
  setActiveTab: (tab: AppFiveTabView) => void;

  // Display & Accessibility Settings
  fontScale: FontScaleMode;
  setFontScale: (scale: FontScaleMode) => void;
  scalePrecision: ScalePrecisionGrams;
  setScalePrecision: (precision: ScalePrecisionGrams) => void;

  // Deep-link from Tank/Today/Alert to Lab Calculator/Crisis or Roadmap Step
  labDeepLink: LabDeepLinkRequest | null;
  navigateToLabTest: (
    request: string | LabDeepLinkRequest,
    options?: Partial<LabDeepLinkRequest>
  ) => void;
  clearLabDeepLink: () => void;
  roadmapHighlightStepNumber: number | null;
  navigateToRoadmapStep: (stepNumber: number) => void;
  clearRoadmapHighlightStep: () => void;

  // Global Modals (10s Quick Log & 5-Step Batch Onboarding)
  isQuickLogOpen: boolean;
  quickLogTankOverride: GlobalTankSelection | null;
  openQuickLog: (tankOverride?: GlobalTankSelection) => void;
  closeQuickLog: () => void;
  isOnboardingOpen: boolean;
  openOnboardingWizard: () => void;
  closeOnboardingWizard: () => void;

  // Interactive Glossary Drawer / Popover
  activeGlossaryKey: string | null;
  activeGlossaryItem: EnologyGlossaryItem | null;
  openGlossaryTerm: (key: string) => void;
  closeGlossaryTerm: () => void;

  // Data synchronization counter across components
  dataVersion: number;
  notifyDataChanged: () => void;
}

const STORAGE_KEY_ACTIVE_BATCH_ID = 'enology_global_active_batch_id';
const STORAGE_KEY_UI_ACTIVE_BATCH = 'enology_ui_active_batch_v1';
const STORAGE_KEY_SELECTED_TANK = 'enology_global_selected_tank';
const STORAGE_KEY_ACTIVE_FIVE_TAB = 'enology_global_active_five_tab';
const STORAGE_KEY_FONT_SCALE = 'enology_global_font_scale';
const STORAGE_KEY_SCALE_PRECISION = 'enology_global_scale_precision';
const STORAGE_KEY_SCALE_PRECISION_LEGACY = 'enology_scale_precision_g';

function readStorageString<T extends string>(key: string, fallback: T): T {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return fallback;
  }
  try {
    const raw = localStorage.getItem(key);
    return raw ? (raw as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorageString(key: string, value: string): void {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return;
  }
  try {
    localStorage.setItem(key, value);
  } catch {
    window.dispatchEvent(
      new CustomEvent('enology-storage-error', {
        detail: 'ذخیره تنظیمات UI ناموفق بود؛ حافظه مرورگر پر یا مسدود است.'
      })
    );
  }
}

const EnologyUiContext = createContext<EnologyUiContextValue | null>(null);

export const EnologyUiProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [dataVersion, setDataVersion] = useState<number>(0);
  const [batches, setBatches] = useState<WineBatch[]>(() => enologyDb.getBatches());

  const [activeBatchIdState, setActiveBatchIdState] = useState<string>(() => {
    const saved = readStorageString(STORAGE_KEY_ACTIVE_BATCH_ID, '');
    const initialBatches = enologyDb.getBatches();
    if (saved && initialBatches.some((b) => b.id === saved)) {
      return saved;
    }
    const realBatch = initialBatches.find((b) => !b.isDemo);
    return realBatch?.id ?? initialBatches[0]?.id ?? 'batch-rasha-1403';
  });

  const [rawSelectedTank, setRawSelectedTank] = useState<GlobalTankSelection>(() => {
    const saved = readStorageString<GlobalTankSelection>(
      STORAGE_KEY_SELECTED_TANK,
      'tank-a'
    );
    if (
      saved === 'tank-a' ||
      saved === 'tank-b' ||
      saved === 'tank-rose' ||
      saved === 'both-red'
    ) {
      return saved;
    }
    return 'tank-a';
  });

  const [activeFiveTabState, setActiveFiveTabState] = useState<AppFiveTabView>(() => {
    const saved = readStorageString<AppFiveTabView>(
      STORAGE_KEY_ACTIVE_FIVE_TAB,
      'today'
    );
    if (
      saved === 'today' ||
      saved === 'tanks' ||
      saved === 'lab' ||
      saved === 'roadmap' ||
      saved === 'more'
    ) {
      return saved;
    }
    return 'today';
  });

  const [fontScaleState, setFontScaleState] = useState<FontScaleMode>(() => {
    const saved = readStorageString<FontScaleMode>(STORAGE_KEY_FONT_SCALE, 'normal');
    if (saved === 'normal' || saved === 'large' || saved === 'xlarge') {
      return saved;
    }
    return 'normal';
  });

  const [scalePrecisionState, setScalePrecisionState] = useState<ScalePrecisionGrams>(() => {
    const savedPrimary = readStorageString<string>(STORAGE_KEY_SCALE_PRECISION, '');
    const savedLegacy = readStorageString<string>(STORAGE_KEY_SCALE_PRECISION_LEGACY, '');
    const raw = savedPrimary || savedLegacy || '0.01';
    const parsed = Number.parseFloat(raw);
    return Number.isFinite(parsed) && (parsed === 1 || parsed === 0.1 || parsed === 0.01)
      ? parsed
      : 0.01;
  });

  const [labDeepLink, setLabDeepLink] = useState<LabDeepLinkRequest | null>(null);
  const [roadmapHighlightStepNumber, setRoadmapHighlightStepNumber] = useState<
    number | null
  >(null);

  const [isQuickLogOpen, setIsQuickLogOpen] = useState<boolean>(false);
  const [quickLogTankOverride, setQuickLogTankOverride] =
    useState<GlobalTankSelection | null>(null);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [activeGlossaryKey, setActiveGlossaryKey] = useState<string | null>(null);

  const notifyDataChanged = useCallback(() => {
    const latestBatches = enologyDb.getBatches();
    setBatches(latestBatches);
    setDataVersion((v) => v + 1);
  }, []);

  // Hydrate from IndexedDB on first mount if needed
  useEffect(() => {
    let mounted = true;
    enologyDb
      .hydrateFromIndexedDBIfNeeded()
      .then((hydrated) => {
        if (mounted && hydrated) {
          notifyDataChanged();
        }
      })
      .catch(() => {
        // ignore hydration errors
      });
    return () => {
      mounted = false;
    };
  }, [notifyDataChanged]);

  const activeBatch = useMemo(() => {
    return (
      batches.find((b) => b.id === activeBatchIdState) ??
      batches.find((b) => !b.isDemo) ??
      batches[0]
    );
  }, [batches, activeBatchIdState]);

  const activeBatchId = activeBatch?.id ?? activeBatchIdState;
  const tankCount: 1 | 2 = activeBatch?.tankCount === 1 ? 1 : 2;
  const hasDemoData = useMemo(() => enologyDb.hasDemoData(), [dataVersion, batches]);

  // Auto-adapt selectedTank when tankCount === 1 or targetStyle === 'rose'
  const selectedTank = useMemo<GlobalTankSelection>(() => {
    if (activeBatch?.targetStyle === 'rose') {
      return 'tank-rose';
    }
    return resolveEffectiveTankSelection(rawSelectedTank, tankCount);
  }, [rawSelectedTank, tankCount, activeBatch?.targetStyle]);

  useEffect(() => {
    if (selectedTank !== rawSelectedTank) {
      setRawSelectedTank(selectedTank);
      writeStorageString(STORAGE_KEY_SELECTED_TANK, selectedTank);
    }
  }, [selectedTank, rawSelectedTank]);

  const setActiveBatchId = useCallback((batchId: string) => {
    setActiveBatchIdState(batchId);
    writeStorageString(STORAGE_KEY_ACTIVE_BATCH_ID, batchId);
    writeStorageString(STORAGE_KEY_UI_ACTIVE_BATCH, batchId);
    const targetBatch = enologyDb.getBatchById(batchId);
    if (targetBatch?.tankCount === 1) {
      setRawSelectedTank((prev) => {
        const adapted = resolveEffectiveTankSelection(prev, 1);
        writeStorageString(STORAGE_KEY_SELECTED_TANK, adapted);
        return adapted;
      });
    }
  }, []);

  const setSelectedTank = useCallback(
    (selection: GlobalTankSelection) => {
      const adapted = resolveEffectiveTankSelection(selection, tankCount);
      setRawSelectedTank(adapted);
      writeStorageString(STORAGE_KEY_SELECTED_TANK, adapted);
    },
    [tankCount]
  );

  const setActiveFiveTab = useCallback((tab: AppFiveTabView) => {
    setActiveFiveTabState(tab);
    writeStorageString(STORAGE_KEY_ACTIVE_FIVE_TAB, tab);
  }, []);

  const setFontScale = useCallback((scale: FontScaleMode) => {
    setFontScaleState(scale);
    writeStorageString(STORAGE_KEY_FONT_SCALE, scale);
  }, []);

  const setScalePrecision = useCallback((val: ScalePrecisionGrams) => {
    setScalePrecisionState(val);
    const serialized = JSON.stringify(val);
    writeStorageString(STORAGE_KEY_SCALE_PRECISION, serialized);
    writeStorageString(STORAGE_KEY_SCALE_PRECISION_LEGACY, serialized);
    if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
      window.dispatchEvent(
        new CustomEvent('enology-localstorage-sync', {
          detail: {
            key: 'enology_scale_precision_g',
            serialized: JSON.stringify(val),
            value: val
          }
        })
      );
    }
  }, []);

  // Keep scalePrecisionState in sync if updated via useLocalStorageState('enology_scale_precision_g')
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleSync = (e: Event) => {
      const customEvent = e as CustomEvent<{ key?: string; value?: unknown }>;
      if (
        customEvent.detail?.key === STORAGE_KEY_SCALE_PRECISION_LEGACY ||
        customEvent.detail?.key === STORAGE_KEY_SCALE_PRECISION
      ) {
        const num = Number(customEvent.detail.value);
        if (num === 1 || num === 0.1 || num === 0.01) {
          setScalePrecisionState(num);
          writeStorageString(STORAGE_KEY_SCALE_PRECISION, String(num));
          writeStorageString(STORAGE_KEY_SCALE_PRECISION_LEGACY, String(num));
        }
      }
    };
    window.addEventListener('enology-localstorage-sync', handleSync);
    return () => window.removeEventListener('enology-localstorage-sync', handleSync);
  }, []);

  const primaryTankId = useMemo(
    () => resolvePrimaryTankId(selectedTank, tankCount),
    [selectedTank, tankCount]
  );

  const targetTankIds = useMemo(
    () => resolveTargetTankIds(selectedTank, tankCount),
    [selectedTank, tankCount]
  );

  const isBothRedSelected = selectedTank === 'both-red' && tankCount === 2;

  const availableTankOptions = useMemo(
    () => getAvailableTankSelections(tankCount, activeBatch?.targetStyle ?? 'red'),
    [tankCount, activeBatch?.targetStyle]
  );

  const selectedTankLabelFa = useMemo(
    () => getTankSelectionLabelFa(selectedTank, tankCount),
    [selectedTank, tankCount]
  );

  const navigateToLabTest = useCallback(
    (
      request: string | LabDeepLinkRequest,
      options?: Partial<LabDeepLinkRequest>
    ) => {
      const normalizedRequest: LabDeepLinkRequest =
        typeof request === 'string'
          ? {
              ...options,
              testId: request,
              subTab: options?.subTab ?? 'calculators-sops',
              prefillTankId: options?.prefillTankId ?? primaryTankId,
              returnToTab: options?.returnToTab ?? activeFiveTabState,
              timestampMs: Date.now()
            }
          : {
              ...request,
              ...options,
              subTab: options?.subTab ?? request.subTab ?? 'calculators-sops',
              prefillTankId: options?.prefillTankId ?? request.prefillTankId ?? primaryTankId,
              returnToTab: options?.returnToTab ?? request.returnToTab ?? activeFiveTabState,
              timestampMs: options?.timestampMs ?? request.timestampMs ?? Date.now()
            };
      setLabDeepLink(normalizedRequest);
      setActiveFiveTab('lab');
    },
    [primaryTankId, activeFiveTabState, setActiveFiveTab]
  );

  const clearLabDeepLink = useCallback(() => {
    setLabDeepLink(null);
  }, []);

  const navigateToRoadmapStep = useCallback(
    (stepNumber: number) => {
      setRoadmapHighlightStepNumber(stepNumber);
      setActiveFiveTab('roadmap');
    },
    [setActiveFiveTab]
  );

  const clearRoadmapHighlightStep = useCallback(() => {
    setRoadmapHighlightStepNumber(null);
  }, []);

  const openQuickLog = useCallback((tankOverride?: GlobalTankSelection) => {
    setQuickLogTankOverride(tankOverride ?? null);
    setIsQuickLogOpen(true);
  }, []);

  const closeQuickLog = useCallback(() => {
    setIsQuickLogOpen(false);
    setQuickLogTankOverride(null);
  }, []);

  const openOnboardingWizard = useCallback(() => {
    setIsOnboardingOpen(true);
  }, []);

  const closeOnboardingWizard = useCallback(() => {
    setIsOnboardingOpen(false);
  }, []);

  const openGlossaryTerm = useCallback((key: string) => {
    setActiveGlossaryKey(key);
  }, []);

  const closeGlossaryTerm = useCallback(() => {
    setActiveGlossaryKey(null);
  }, []);

  const activeGlossaryItem = useMemo(
    () => (activeGlossaryKey ? getGlossaryItem(activeGlossaryKey) ?? null : null),
    [activeGlossaryKey]
  );

  const value = useMemo<EnologyUiContextValue>(
    () => ({
      batches,
      activeBatchId,
      activeBatch,
      setActiveBatchId,
      tankCount,
      hasDemoData,
      selectedTank,
      setSelectedTank,
      globalTankSelection: selectedTank,
      setGlobalTankSelection: setSelectedTank,
      primaryTankId,
      effectiveSingleTankId: primaryTankId,
      targetTankIds,
      isBothRedSelected,
      availableTankOptions,
      selectedTankLabelFa,
      activeFiveTab: activeFiveTabState,
      setActiveFiveTab,
      activeTab: activeFiveTabState,
      setActiveTab: setActiveFiveTab,
      fontScale: fontScaleState,
      setFontScale,
      scalePrecision: scalePrecisionState,
      setScalePrecision,
      labDeepLink,
      navigateToLabTest,
      clearLabDeepLink,
      roadmapHighlightStepNumber,
      navigateToRoadmapStep,
      clearRoadmapHighlightStep,
      isQuickLogOpen,
      quickLogTankOverride,
      openQuickLog,
      closeQuickLog,
      isOnboardingOpen,
      openOnboardingWizard,
      closeOnboardingWizard,
      activeGlossaryKey,
      activeGlossaryItem,
      openGlossaryTerm,
      closeGlossaryTerm,
      dataVersion,
      notifyDataChanged
    }),
    [
      batches,
      activeBatchId,
      activeBatch,
      setActiveBatchId,
      tankCount,
      hasDemoData,
      selectedTank,
      setSelectedTank,
      primaryTankId,
      targetTankIds,
      isBothRedSelected,
      availableTankOptions,
      selectedTankLabelFa,
      activeFiveTabState,
      setActiveFiveTab,
      fontScaleState,
      setFontScale,
      scalePrecisionState,
      setScalePrecision,
      labDeepLink,
      navigateToLabTest,
      clearLabDeepLink,
      roadmapHighlightStepNumber,
      navigateToRoadmapStep,
      clearRoadmapHighlightStep,
      isQuickLogOpen,
      quickLogTankOverride,
      openQuickLog,
      closeQuickLog,
      isOnboardingOpen,
      openOnboardingWizard,
      closeOnboardingWizard,
      activeGlossaryKey,
      activeGlossaryItem,
      openGlossaryTerm,
      closeGlossaryTerm,
      dataVersion,
      notifyDataChanged
    ]
  );

  return (
    <EnologyUiContext.Provider value={value}>
      {children}
    </EnologyUiContext.Provider>
  );
};

export function useEnologyUi(): EnologyUiContextValue {
  const ctx = useContext(EnologyUiContext);
  if (ctx) {
    return ctx;
  }
  console.warn('useEnologyUi called outside <EnologyUiProvider>; using fallback state.');
  // Safe fallback when rendered outside provider (e.g. standalone unit tests)
  const fallbackBatches = enologyDb.getBatches();
  const fallbackBatch =
    fallbackBatches.find((b) => !b.isDemo) ?? fallbackBatches[0];
  const fallbackTankCount: 1 | 2 = fallbackBatch?.tankCount === 1 ? 1 : 2;
  return {
    batches: fallbackBatches,
    activeBatchId: fallbackBatch?.id ?? 'batch-rasha-1403',
    activeBatch: fallbackBatch,
    setActiveBatchId: () => {},
    tankCount: fallbackTankCount,
    hasDemoData: enologyDb.hasDemoData(),
    selectedTank: 'tank-a',
    setSelectedTank: () => {},
    globalTankSelection: 'tank-a',
    setGlobalTankSelection: () => {},
    primaryTankId: 'tank-a',
    effectiveSingleTankId: 'tank-a',
    targetTankIds: ['tank-a'],
    isBothRedSelected: false,
    availableTankOptions: getAvailableTankSelections(fallbackTankCount),
    selectedTankLabelFa: getTankSelectionLabelFa('tank-a', fallbackTankCount),
    activeFiveTab: 'today',
    setActiveFiveTab: () => {},
    activeTab: 'today',
    setActiveTab: () => {},
    fontScale: 'normal',
    setFontScale: () => {},
    scalePrecision: 0.01,
    setScalePrecision: () => {},
    labDeepLink: null,
    navigateToLabTest: () => {},
    clearLabDeepLink: () => {},
    roadmapHighlightStepNumber: null,
    navigateToRoadmapStep: () => {},
    clearRoadmapHighlightStep: () => {},
    isQuickLogOpen: false,
    quickLogTankOverride: null,
    openQuickLog: () => {},
    closeQuickLog: () => {},
    isOnboardingOpen: false,
    openOnboardingWizard: () => {},
    closeOnboardingWizard: () => {},
    activeGlossaryKey: null,
    activeGlossaryItem: null,
    openGlossaryTerm: () => {},
    closeGlossaryTerm: () => {},
    dataVersion: 0,
    notifyDataChanged: () => {}
  };
}

export interface GlossaryTermProps {
  termKey: string;
  labelOverride?: string;
  className?: string;
}

/**
 * Accessible inline glossary trigger pill/underline that explains technical enology terms
 * in plain Persian either via popover or global glossary sheet.
 */
export const GlossaryTerm: React.FC<GlossaryTermProps> = ({
  termKey,
  labelOverride,
  className = ''
}) => {
  const item = getGlossaryItem(termKey);
  const { openGlossaryTerm } = useEnologyUi();

  if (!item) {
    return <span className={className}>{labelOverride ?? termKey}</span>;
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        openGlossaryTerm(item.key);
      }}
      title={`${item.termFa} (${item.termEn}): ${item.shortTooltipFa}`}
      className={`inline-flex items-center gap-1 border-b border-dotted border-amber-500/70 text-amber-900 dark:text-amber-300 hover:border-amber-600 cursor-help transition-colors ${className}`}
    >
      <span>{labelOverride ?? item.termFa}</span>
      <span
        aria-hidden="true"
        className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-amber-500/15 text-xs font-bold text-amber-700 dark:text-amber-300"
      >
        ؟
      </span>
    </button>
  );
};
