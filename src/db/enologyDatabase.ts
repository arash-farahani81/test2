import { z } from 'zod';
import {
  type WineBatch,
  type ChemicalAddition,
  type LabAnalysisRecord,
  type SavedCalculation,
  type EnologyDatabaseExport,
  type FermentationLogEntry,
  type TankId,
  WineBatchSchema,
  FermentationLogEntrySchema,
  ChemicalAdditionSchema,
  LabAnalysisRecordSchema,
  SavedCalculationSchema,
  EnologyDatabaseExportSchema
} from '../types/index.ts';
import { INITIAL_TRACKING_DATA } from '../data/seedTrackingData.ts';
import {
  MASTER_PROTOCOL_CONFIG,
  onFlexibleProtocolSync,
  type FlexibleProtocolParams
} from '../data/masterProtocolConfig.ts';

const DB_STORAGE_KEY_BATCHES = 'enology_db_batches_v1';
const DB_STORAGE_KEY_LOGS = 'enology_db_logs_v1';
const DB_STORAGE_KEY_ADDITIONS = 'enology_db_additions_v1';
const DB_STORAGE_KEY_ANALYSES = 'enology_db_lab_analyses_v1';
const DB_STORAGE_KEY_CALCS = 'enology_db_saved_calculations_v1';
const DB_STORAGE_KEY_BACKUP_META = 'enology_last_backup_meta_v1';

export interface CumulativeSO2Ledger {
  tankId: TankId;
  batchId?: string;
  addedFromKmsMgL: number;
  totalKmsMassGrams: number;
  finalVolumeEquivalentMgL: number;
  skippedInvalidUnitCount: number;
  endogenousYeastMgL: number;
  estimatedTotalSO2MgL: number;
  legalCeilingMgL: number;
  remainingBudgetMgL: number;
  isOverBudget: boolean;
  accountingBasisFa: string;
  estimatedBoundAndVolatilizedRatio: number;
  measuredTotalSO2MgL?: number;
  stageBreakdown: Array<{
    id: string;
    stageTitle: string;
    amountGrams: number;
    referenceVolumeL: number;
    contributedMgL: number;
    formulaText: string;
    isDemo?: boolean;
  }>;
}

function mirrorToIndexedDB(storeKey: string, data: unknown): void {
  if (typeof indexedDB === 'undefined') return;
  try {
    const req = indexedDB.open('enology_studio_idb_v1', 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains('kv_mirror')) {
        db.createObjectStore('kv_mirror');
      }
    };
    req.onsuccess = () => {
      try {
        const db = req.result;
        const tx = db.transaction('kv_mirror', 'readwrite');
        tx.objectStore('kv_mirror').put(data, storeKey);
      } catch {
        // Ignore non-critical IndexedDB transaction errors
      }
    };
  } catch {
    // Ignore IndexedDB errors in restricted environments
  }
}

function generateId(prefix: string): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export const DEFAULT_BATCHES: WineBatch[] = [
  {
    id: 'batch-rasha-1403',
    name: 'بچ شماره ۱: انگور رشه سردشت (۴۰۰ کیلوگرم استاندارد)',
    grapeVariety: 'انگور سیاه رشه دیم سردشت (Vitis vinifera cv. Rasha)',
    vintageYear: MASTER_PROTOCOL_CONFIG.metadata.vintageYear,
    initialWeightKg: MASTER_PROTOCOL_CONFIG.metadata.grapeWeightKg,
    targetStyle: 'red',
    status: 'active_fermentation',
    startDate: '۱۴۰۵/۰۷/۲۴',
    notes: 'پروتکل مستر ۴۰۰ کیلوگرمی استاندارد انولوژی با ۳۶ لیتر خون‌گیری برای شراب رُزه سانیه (Saignée) و ۳۱۴ لیتر توده قرمز (۲۶۴ لیتر فاز مایع).',
    isDemo: true
  },
  {
    id: 'batch-rose-1403',
    name: 'بچ شماره ۲: شراب رُزه سانیه رشه سردشت (۳۲ لیتر شفاف)',
    grapeVariety: 'انگور سیاه رشه سردشت (آب‌انگور زلال خون‌گیری‌شده Saignée)',
    vintageYear: MASTER_PROTOCOL_CONFIG.metadata.vintageYear,
    initialWeightKg: 40,
    targetStyle: 'rose',
    status: 'active_fermentation',
    startDate: '۱۴۰۵/۰۷/۲۵',
    notes: 'جداسازی پیش از تخمیر پس از ۳.۵ ساعت خیساندن سرد با پوست، شفاف‌سازی ۲۴ ساعته در سرما (۳۶L ← ۳۲L) و تخمیر آروماتیک در ۱۶–۱۸ درجه سانتی‌گراد.',
    isDemo: true
  }
];

export const DEFAULT_CHEMICAL_ADDITIONS: ChemicalAddition[] = [
  {
    id: 'add-1',
    batchId: 'batch-rasha-1403',
    tankId: 'tank-a',
    timestamp: '۱۴۰۵/۰۷/۲۴ - ۰۰:۰۰',
    stageTitle: 'روز ۰ - کراش و سولفیت‌زنی اولیه (25 mg/L SO2)',
    compoundName: 'پتاسیم متابی‌سولفیت (KMS)',
    pubchemCid: 24446,
    amount: 6.52,
    unit: 'g',
    purpose: 'سولفیتاسیون اولیه ۲۵ ppm در ۱۵۰ لیتر آب‌انگور جهت مهار مخمرهای وحشی و اکسیداسیون آنزیمی',
    operatorNote: 'در ۵۰۰ میلی‌لیتر آب سرد حل و لایه‌به‌لایه روی توده کراش‌شده اسپری شد.',
    compoundType: 'kms',
    referenceVolumeL: 150,
    calculatedSO2MgL: 24.8,
    isDemo: true
  },
  {
    id: 'add-2',
    batchId: 'batch-rasha-1403',
    tankId: 'tank-a',
    timestamp: '۱۴۰۵/۰۷/۲۴ - ۰۳:۳۰',
    stageTitle: 'روز ۰ - تکمیل سولفیت پس از خون‌گیری سانیه (+15 mg/L SO2)',
    compoundName: 'پتاسیم متابی‌سولفیت (KMS)',
    pubchemCid: 24446,
    amount: 3.43,
    unit: 'g',
    purpose: 'رساندن دوز کل سولفیت به ۴۰ mg/L در ۱۳۲ لیتر فاز مایع باقی‌مانده پس از جداسازی ۱۸ لیتر رُزه',
    operatorNote: '۱۵ دقیقه پیش از تزریق آنزیم پکتولیتیک افزوده و هم زده شد.',
    compoundType: 'kms',
    referenceVolumeL: 132,
    calculatedSO2MgL: 14.8,
    isDemo: true
  },
  {
    id: 'add-3',
    batchId: 'batch-rasha-1403',
    tankId: 'tank-a',
    timestamp: '۱۴۰۵/۰۷/۲۴ - ۰۳:۴۵',
    stageTitle: 'روز ۰ - آنزیم‌زنی و استخراج رنگ',
    compoundName: 'آنزیم پکتیناز (Endo-Polygalacturonase)',
    pubchemCid: undefined,
    amount: 7.26,
    unit: 'g',
    purpose: 'شکستن پکتین دیواره سلولی ضخیم انگور رشه (0.055 g/L در ۱۳۲ لیتر) و آزادسازی آنتوسیانین',
    operatorNote: 'در آب سرد بدون کلر به آرامی حل شد؛ زمان استراحت ۷.۵ ساعت در ۲۰ درجه.',
    compoundType: 'enzyme',
    referenceVolumeL: 132,
    isDemo: true
  },
  {
    id: 'add-4',
    batchId: 'batch-rasha-1403',
    tankId: 'tank-a',
    timestamp: '۱۴۰۵/۰۷/۲۴ - ۱۶:۳۰',
    stageTitle: 'روز ۰ - تلقیح مخمر و محافظ غشایی',
    compoundName: 'مخمر خشک فعال Lalvin RC-212 + Go-Ferm Protect',
    amount: 72.6,
    unit: 'g',
    purpose: 'تلقیح ۳۳.۰۰ گرم مخمر RC-212 (0.25 g/L) همراه با ۳۹.۶۰ گرم Go-Ferm (0.30 g/L) برای ۱۳۲ لیتر',
    operatorNote: 'آبرسانی در آب ۳۸ درجه و هم‌دماسازی پله‌ای (اختلاف دمای کمتر از ۵ درجه با مش).',
    compoundType: 'yeast',
    referenceVolumeL: 132,
    isDemo: true
  },
  {
    id: 'add-5',
    batchId: 'batch-rasha-1403',
    tankId: 'tank-a',
    timestamp: '۱۴۰۵/۰۷/۲۶ - ۰۸:۰۰',
    stageTitle: 'روز ۲ - تغذیه نوبت اول (SNA-1 در SG = 1.083)',
    compoundName: 'نیتروژن آلی (Fermaid O)',
    amount: 33.0,
    unit: 'g',
    purpose: 'تامین نیتروژن آلی اسیدهای آمینه (0.25 g/L در ۱۳۲ لیتر) بدون ایجاد پیک حرارتی ناگهانی',
    operatorNote: 'پس از هوادهی ملایم در نمونه شراب حل و با پیژاژ پخش شد.',
    compoundType: 'fermaid_o',
    referenceVolumeL: 132,
    isDemo: true
  },
  {
    id: 'add-6',
    batchId: 'batch-rasha-1403',
    tankId: 'tank-a',
    timestamp: '۱۴۰۵/۰۷/۲۷ - ۰۸:۰۰',
    stageTitle: 'روز ۳ - تغذیه نوبت دوم در ۱/۳ مصرف قند (SNA-2 در SG = 1.070)',
    compoundName: 'Fermaid K (33.00g) + DAP (19.80g) + سولفات روی (1.58g)',
    pubchemCid: 24261,
    amount: 54.38,
    unit: 'g',
    purpose: 'آخرین مهلت مجاز تزریق نیتروژن معدنی DAP و Fermaid K پیش از بسته شدن حامل‌های غشایی مخمر در الکل ۶٪',
    operatorNote: 'شامل ۳۳.۰۰g فرمید K + ۱۹.۸۰g دی‌آمونیوم فسفات + ۱.۵۸g سولفات روی هپتاهیدرات.',
    compoundType: 'fermaid_k',
    referenceVolumeL: 132,
    isDemo: true
  }
];

export const DEFAULT_LAB_ANALYSES: LabAnalysisRecord[] = [
  {
    id: 'lab-1',
    batchId: 'batch-rasha-1403',
    tankId: 'tank-a',
    date: '۱۴۰۵/۰۷/۲۴',
    testType: 'ph_meter',
    targetAnalyte: 'pH آبمیوه اولیه',
    measuredValue: 3.52,
    unit: 'pH Units',
    actionTaken: 'در محدوده بهینه (۳.۴۵ تا ۳.۵۵). نیازی به افزایش اسید تارتاریک قبل از تخمیر ندارد.',
    notes: 'دستگاه با بافرهای ۴.۰۱ و ۷.۰۰ کالیبره شد.',
    isDemo: true
  },
  {
    id: 'lab-2',
    batchId: 'batch-rasha-1403',
    tankId: 'tank-a',
    date: '۱۴۰۵/۰۷/۲۴',
    testType: 'ta_titration',
    targetAnalyte: 'اسیدیته کل قابل تیتر (TA)',
    pubchemCid: 875,
    measuredValue: 6.8,
    unit: 'g/L Tartaric',
    actionTaken: 'اسیدیته انگور رشه سردشت کاملاً متعادل و مطلوب است.',
    notes: 'تیتراسیون با هیدروکسید سدیم ۰.۱ نرمال تا نقطه خنثی pH=8.2.',
    isDemo: true
  },
  {
    id: 'lab-3',
    batchId: 'batch-rasha-1403',
    tankId: 'tank-a',
    date: '۱۴۰۵/۰۷/۲۵',
    testType: 'ripper_so2',
    targetAnalyte: 'Free SO2 (دی‌اکسید گوگرد آزاد)',
    pubchemCid: 1119,
    measuredValue: 24,
    unit: 'mg/L (ppm)',
    actionTaken: 'میزان SO2 آزاد با توجه به واکنش با اجزای انگور افت کرده و در روز ۱ مناسب است.',
    notes: 'روش ریپر با محلول ید ۰.۰۲ نرمال و شناساگر نشاسته.',
    isDemo: true
  }
];

/**
 * Robust Client Database Engine with in-memory sync, LocalStorage, and IndexedDB backup
 */
class EnologyDatabaseService {
  private batches: WineBatch[] = [];
  private logs: FermentationLogEntry[] = [];
  private additions: ChemicalAddition[] = [];
  private analyses: LabAnalysisRecord[] = [];
  private calculations: SavedCalculation[] = [];
  private isInitialized = false;
  private hasLocalMutations = false;
  private storageErrorsByKey: Record<string, string> = {};
  private lastStorageError: string | null = null;
  private corruptedKeysRecovered: string[] = [];
  private lastBackupMs: number | null = null;
  private changesSinceBackup = 0;

  constructor() {
    this.init();
    onFlexibleProtocolSync((params) => {
      this.syncActiveBatchProtocolSnapshot(params);
    });
    if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
      window.addEventListener('enology-flexible-protocol-sync', (e: Event) => {
        const customEvent = e as CustomEvent<FlexibleProtocolParams>;
        if (customEvent.detail) {
          this.syncActiveBatchProtocolSnapshot(customEvent.detail);
        }
      });
    }
  }

  private preserveCorruptRawValue(key: string, rawValue: string) {
    this.corruptedKeysRecovered.push(key);
    if (typeof localStorage === 'undefined') return;
    try {
      const dateSuffix = new Date().toISOString().slice(0, 10);
      localStorage.setItem(`corrupt_${key}_${dateSuffix}`, rawValue);
    } catch {
      // Ignore storage failure when preserving corrupt payload
    }
  }

  private handleStorageSetItem(key: string, serialized: string) {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(key, serialized);
      delete this.storageErrorsByKey[key];
      this.lastStorageError = Object.values(this.storageErrorsByKey)[0] ?? null;
    } catch (e) {
      const errMsg =
        'ذخیره نشد؛ حافظهٔ مرورگر پر است یا مسدود شده است. همین الان فایل پشتیبان بگیرید.';
      this.storageErrorsByKey[key] = errMsg;
      this.lastStorageError = Object.values(this.storageErrorsByKey)[0] ?? errMsg;
      if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
        window.dispatchEvent(
          new CustomEvent('enology-storage-error', { detail: this.lastStorageError })
        );
      }
      console.error(`Error persisting ${key}`, e);
    }
  }

  private loadBackupMeta() {
    if (typeof localStorage === 'undefined') return;
    try {
      const raw = localStorage.getItem(DB_STORAGE_KEY_BACKUP_META);
      if (raw) {
        const parsed = JSON.parse(raw) as { lastBackupMs?: unknown; changesSinceBackup?: unknown };
        this.lastBackupMs = typeof parsed.lastBackupMs === 'number' ? parsed.lastBackupMs : null;
        this.changesSinceBackup =
          typeof parsed.changesSinceBackup === 'number' ? parsed.changesSinceBackup : 0;
      }
    } catch {
      this.lastBackupMs = null;
      this.changesSinceBackup = 0;
    }
  }

  private persistBackupMeta() {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(
        DB_STORAGE_KEY_BACKUP_META,
        JSON.stringify({
          lastBackupMs: this.lastBackupMs,
          changesSinceBackup: this.changesSinceBackup
        })
      );
    } catch {
      // Ignore backup meta persistence failure
    }
  }

  private incrementChangesSinceBackup() {
    this.changesSinceBackup += 1;
    this.persistBackupMeta();
  }

  private parseArrayWithSalvage<T>(
    key: string,
    rawJson: string,
    itemSchema: z.ZodType<T>,
    fallback: T[]
  ): T[] {
    try {
      const parsed: unknown = JSON.parse(rawJson);
      const full = z.array(itemSchema).safeParse(parsed);
      if (full.success) {
        return full.data;
      }
      this.preserveCorruptRawValue(key, rawJson);
      if (Array.isArray(parsed)) {
        const salvaged: T[] = [];
        for (const item of parsed) {
          const r = itemSchema.safeParse(item);
          if (r.success) {
            salvaged.push(r.data);
          }
        }
        if (salvaged.length > 0) {
          return salvaged;
        }
      }
      return [...fallback];
    } catch {
      this.preserveCorruptRawValue(key, rawJson);
      return [...fallback];
    }
  }

  public async hydrateFromIndexedDBIfNeeded(): Promise<boolean> {
    if (typeof indexedDB === 'undefined') return false;

    const needsBatches =
      (typeof localStorage !== 'undefined' && !localStorage.getItem(DB_STORAGE_KEY_BATCHES)) ||
      this.corruptedKeysRecovered.includes(DB_STORAGE_KEY_BATCHES);
    const needsLogs =
      (typeof localStorage !== 'undefined' &&
        !localStorage.getItem(DB_STORAGE_KEY_LOGS) &&
        !localStorage.getItem('enology_fermentation_logs_v2')) ||
      this.corruptedKeysRecovered.includes(DB_STORAGE_KEY_LOGS);
    const needsAdditions =
      (typeof localStorage !== 'undefined' && !localStorage.getItem(DB_STORAGE_KEY_ADDITIONS)) ||
      this.corruptedKeysRecovered.includes(DB_STORAGE_KEY_ADDITIONS);
    const needsAnalyses =
      (typeof localStorage !== 'undefined' && !localStorage.getItem(DB_STORAGE_KEY_ANALYSES)) ||
      this.corruptedKeysRecovered.includes(DB_STORAGE_KEY_ANALYSES);
    const needsCalcs =
      (typeof localStorage !== 'undefined' && !localStorage.getItem(DB_STORAGE_KEY_CALCS)) ||
      this.corruptedKeysRecovered.includes(DB_STORAGE_KEY_CALCS);

    if (!needsBatches && !needsLogs && !needsAdditions && !needsAnalyses && !needsCalcs) {
      return false;
    }

    return new Promise<boolean>((resolve) => {
      try {
        const req = indexedDB.open('enology_studio_idb_v1', 1);
        req.onupgradeneeded = () => {
          const db = req.result;
          if (!db.objectStoreNames.contains('kv_mirror')) {
            db.createObjectStore('kv_mirror');
          }
        };
        req.onerror = () => resolve(false);
        req.onsuccess = () => {
          try {
            const db = req.result;
            if (!db.objectStoreNames.contains('kv_mirror')) {
              resolve(false);
              return;
            }
            const tx = db.transaction('kv_mirror', 'readonly');
            const store = tx.objectStore('kv_mirror');
            let hydratedAny = false;

            const readKey = <T>(
              key: string,
              shouldHydrate: boolean,
              schema: z.ZodType<T>,
              onValid: (items: T[]) => void
            ): Promise<void> =>
              new Promise((res) => {
                if (!shouldHydrate) {
                  res();
                  return;
                }
                try {
                  const getReq = store.get(key);
                  getReq.onsuccess = () => {
                    if (this.hasLocalMutations) {
                      res();
                      return;
                    }
                    const val = getReq.result;
                    if (Array.isArray(val) && val.length > 0) {
                      const parsed = z.array(schema).safeParse(val);
                      if (parsed.success && parsed.data.length > 0) {
                        onValid(parsed.data);
                        hydratedAny = true;
                      }
                    }
                    res();
                  };
                  getReq.onerror = () => res();
                } catch {
                  res();
                }
              });

            const mergeIfSalvaged = <T extends { id: string }>(
              key: string,
              current: T[],
              idbItems: T[]
            ): T[] => {
              if (!this.corruptedKeysRecovered.includes(key) || current.length === 0) {
                return idbItems;
              }
              const map = new Map<string, T>();
              for (const item of current) {
                map.set(item.id, item);
              }
              for (const idbItem of idbItems) {
                if (!map.has(idbItem.id)) {
                  map.set(idbItem.id, idbItem);
                }
              }
              return Array.from(map.values());
            };

            void Promise.all([
              readKey(DB_STORAGE_KEY_BATCHES, needsBatches, WineBatchSchema, (items) => {
                this.batches = mergeIfSalvaged(DB_STORAGE_KEY_BATCHES, this.batches, items);
                this.handleStorageSetItem(DB_STORAGE_KEY_BATCHES, JSON.stringify(this.batches));
              }),
              readKey(DB_STORAGE_KEY_LOGS, needsLogs, FermentationLogEntrySchema, (items) => {
                this.logs = mergeIfSalvaged(DB_STORAGE_KEY_LOGS, this.logs, items);
                this.handleStorageSetItem(DB_STORAGE_KEY_LOGS, JSON.stringify(this.logs));
              }),
              readKey(DB_STORAGE_KEY_ADDITIONS, needsAdditions, ChemicalAdditionSchema, (items) => {
                this.additions = mergeIfSalvaged(DB_STORAGE_KEY_ADDITIONS, this.additions, items);
                this.handleStorageSetItem(DB_STORAGE_KEY_ADDITIONS, JSON.stringify(this.additions));
              }),
              readKey(DB_STORAGE_KEY_ANALYSES, needsAnalyses, LabAnalysisRecordSchema, (items) => {
                this.analyses = mergeIfSalvaged(DB_STORAGE_KEY_ANALYSES, this.analyses, items);
                this.handleStorageSetItem(DB_STORAGE_KEY_ANALYSES, JSON.stringify(this.analyses));
              }),
              readKey(DB_STORAGE_KEY_CALCS, needsCalcs, SavedCalculationSchema, (items) => {
                this.calculations = mergeIfSalvaged(DB_STORAGE_KEY_CALCS, this.calculations, items);
                this.handleStorageSetItem(DB_STORAGE_KEY_CALCS, JSON.stringify(this.calculations));
              })
            ]).then(() => resolve(hydratedAny));
          } catch {
            resolve(false);
          }
        };
      } catch {
        resolve(false);
      }
    });
  }

  private init() {
    if (this.isInitialized) return;

    this.loadBackupMeta();

    // Load Batches with Row-Level Zod Salvage
    const savedBatches =
      typeof localStorage !== 'undefined' ? localStorage.getItem(DB_STORAGE_KEY_BATCHES) : null;
    if (savedBatches) {
      this.batches = this.parseArrayWithSalvage(
        DB_STORAGE_KEY_BATCHES,
        savedBatches,
        WineBatchSchema,
        DEFAULT_BATCHES
      );
    } else {
      this.batches = [...DEFAULT_BATCHES];
    }

    // Load Fermentation Logs with Row-Level Zod Salvage
    const savedLogs =
      typeof localStorage !== 'undefined'
        ? localStorage.getItem(DB_STORAGE_KEY_LOGS) || localStorage.getItem('enology_fermentation_logs_v2')
        : null;
    if (savedLogs) {
      this.logs = this.parseArrayWithSalvage(
        DB_STORAGE_KEY_LOGS,
        savedLogs,
        FermentationLogEntrySchema,
        INITIAL_TRACKING_DATA
      );
    } else {
      this.logs = [...INITIAL_TRACKING_DATA];
    }

    // Load Chemical Additions with Row-Level Zod Salvage
    const savedAdditions =
      typeof localStorage !== 'undefined' ? localStorage.getItem(DB_STORAGE_KEY_ADDITIONS) : null;
    if (savedAdditions) {
      this.additions = this.parseArrayWithSalvage(
        DB_STORAGE_KEY_ADDITIONS,
        savedAdditions,
        ChemicalAdditionSchema,
        DEFAULT_CHEMICAL_ADDITIONS
      );
    } else {
      this.additions = [...DEFAULT_CHEMICAL_ADDITIONS];
    }

    // Load Lab Analyses with Row-Level Zod Salvage
    const savedAnalyses =
      typeof localStorage !== 'undefined' ? localStorage.getItem(DB_STORAGE_KEY_ANALYSES) : null;
    if (savedAnalyses) {
      this.analyses = this.parseArrayWithSalvage(
        DB_STORAGE_KEY_ANALYSES,
        savedAnalyses,
        LabAnalysisRecordSchema,
        DEFAULT_LAB_ANALYSES
      );
    } else {
      this.analyses = [...DEFAULT_LAB_ANALYSES];
    }

    // Load Saved Calculations with Row-Level Zod Salvage
    const savedCalcs =
      typeof localStorage !== 'undefined' ? localStorage.getItem(DB_STORAGE_KEY_CALCS) : null;
    if (savedCalcs) {
      this.calculations = this.parseArrayWithSalvage(
        DB_STORAGE_KEY_CALCS,
        savedCalcs,
        SavedCalculationSchema,
        []
      );
    } else {
      this.calculations = [];
    }

    this.isInitialized = true;
    void this.hydrateFromIndexedDBIfNeeded();
  }

  public getStorageDiagnostics(): { lastStorageError: string | null; corruptedKeysRecovered: string[] } {
    return {
      lastStorageError: this.lastStorageError,
      corruptedKeysRecovered: [...this.corruptedKeysRecovered]
    };
  }

  // --- Batches ---
  public getBatches(): WineBatch[] {
    return [...this.batches];
  }

  public getBatchById(id: string): WineBatch | undefined {
    return this.batches.find((b) => b.id === id);
  }

  public addBatch(batch: Omit<WineBatch, 'id'>): WineBatch {
    this.hasLocalMutations = true;
    const newBatch: WineBatch = {
      ...batch,
      id: generateId('batch'),
      updatedAtMs: batch.updatedAtMs ?? Date.now()
    };
    this.batches.unshift(newBatch);
    this.persistBatches();
    this.incrementChangesSinceBackup();
    return newBatch;
  }

  public updateBatch(id: string, updates: Partial<WineBatch>): WineBatch | null {
    const idx = this.batches.findIndex((b) => b.id === id);
    if (idx === -1) return null;
    this.hasLocalMutations = true;
    this.batches[idx] = { ...this.batches[idx], ...updates, updatedAtMs: Date.now() };
    this.persistBatches();
    this.incrementChangesSinceBackup();
    return this.batches[idx];
  }

  public updateBatchProtocolSnapshot(
    batchId: string,
    params: FlexibleProtocolParams
  ): WineBatch | null {
    return this.updateBatch(batchId, {
      protocolParamsSnapshot: { ...params }
    });
  }

  public syncActiveBatchProtocolSnapshot(params: FlexibleProtocolParams): WineBatch | null {
    const storedActiveBatchId =
      typeof localStorage !== 'undefined'
        ? localStorage.getItem('enology_ui_active_batch_v1')
        : null;
    const targetBatch =
      (storedActiveBatchId
        ? this.batches.find((b) => b.id === storedActiveBatchId)
        : undefined) ??
      this.batches.find((b) => !b.isDemo) ??
      this.batches[0];
    if (!targetBatch) return null;
    return this.updateBatchProtocolSnapshot(targetBatch.id, params);
  }

  private persistBatches() {
    mirrorToIndexedDB(DB_STORAGE_KEY_BATCHES, this.batches);
    this.handleStorageSetItem(DB_STORAGE_KEY_BATCHES, JSON.stringify(this.batches));
  }

  // --- Demo Mode Cleanup ---
  public hasDemoData(): boolean {
    return (
      this.batches.some((b) => b.isDemo === true) ||
      this.additions.some((a) => !a.isDeleted && a.isDemo === true)
    );
  }

  public startRealBatchMode(newBatch?: Omit<WineBatch, 'id'>): WineBatch | null {
    this.hasLocalMutations = true;
    this.batches = this.batches.filter((b) => b.isDemo !== true);
    this.additions = this.additions.filter((a) => a.isDemo !== true);
    this.analyses = this.analyses.filter((a) => a.isDemo !== true);
    this.logs = this.logs.filter((l) => l.isBenchmark === true || l.isDemo !== true);

    let createdBatch: WineBatch | null = null;
    if (newBatch) {
      createdBatch = {
        ...newBatch,
        isDemo: false,
        id: generateId('batch'),
        updatedAtMs: newBatch.updatedAtMs ?? Date.now()
      };
      this.batches.unshift(createdBatch);
    } else if (this.batches.length === 0) {
      createdBatch = {
        id: generateId('batch'),
        name: 'بچ واقعی شماره ۱: انگور رشه سردشت',
        grapeVariety: 'انگور سیاه رشه سردشت',
        vintageYear: MASTER_PROTOCOL_CONFIG.metadata.vintageYear,
        initialWeightKg: MASTER_PROTOCOL_CONFIG.metadata.grapeWeightKg,
        targetStyle: 'red',
        status: 'active_fermentation',
        startDate: new Intl.DateTimeFormat('fa-IR').format(new Date()),
        isDemo: false,
        updatedAtMs: Date.now()
      };
      this.batches.unshift(createdBatch);
    }

    this.persistBatches();
    this.persistLogs();
    this.persistAdditions();
    this.persistAnalyses();
    this.incrementChangesSinceBackup();

    return createdBatch ?? this.batches[0] ?? null;
  }

  // --- Orphan Records Inspection & Reassignment ---
  public getOrphanRecordsSummary(): {
    orphanLogsCount: number;
    orphanAdditionsCount: number;
    orphanAnalysesCount: number;
  } {
    const validBatchIds = new Set(this.batches.map((b) => b.id));
    const orphanLogsCount = this.logs.filter(
      (l) => !l.isDeleted && !l.isBenchmark && (!l.batchId || !validBatchIds.has(l.batchId))
    ).length;
    const orphanAdditionsCount = this.additions.filter(
      (a) => !a.isDeleted && (!a.batchId || !validBatchIds.has(a.batchId))
    ).length;
    const orphanAnalysesCount = this.analyses.filter(
      (a) => !a.isDeleted && (!a.batchId || !validBatchIds.has(a.batchId))
    ).length;

    return {
      orphanLogsCount,
      orphanAdditionsCount,
      orphanAnalysesCount
    };
  }

  public assignOrphanRecordsToBatch(targetBatchId: string): void {
    const validBatchIds = new Set(this.batches.map((b) => b.id));
    const now = Date.now();
    let changed = false;

    this.logs = this.logs.map((l) => {
      if (!l.isDeleted && !l.isBenchmark && (!l.batchId || !validBatchIds.has(l.batchId))) {
        changed = true;
        return { ...l, batchId: targetBatchId, updatedAtMs: now };
      }
      return l;
    });

    this.additions = this.additions.map((a) => {
      if (!a.isDeleted && (!a.batchId || !validBatchIds.has(a.batchId))) {
        changed = true;
        return { ...a, batchId: targetBatchId, updatedAtMs: now };
      }
      return a;
    });

    this.analyses = this.analyses.map((a) => {
      if (!a.isDeleted && (!a.batchId || !validBatchIds.has(a.batchId))) {
        changed = true;
        return { ...a, batchId: targetBatchId, updatedAtMs: now };
      }
      return a;
    });

    if (changed) {
      this.hasLocalMutations = true;
      this.persistLogs();
      this.persistAdditions();
      this.persistAnalyses();
      this.incrementChangesSinceBackup();
    }
  }

  private matchesBatch(itemBatchId: string | undefined, batchId: string): boolean {
    const isDefaultDemoBatch =
      batchId === 'batch-rasha-1403' ||
      batchId === 'batch-rose-1403' ||
      this.batches.find((b) => b.id === batchId)?.isDemo === true;
    return itemBatchId === batchId || (!itemBatchId && isDefaultDemoBatch);
  }

  // --- Fermentation Logs ---
  public getLogs(tankId?: TankId, includeDeleted: boolean = false, batchId?: string): FermentationLogEntry[] {
    let visibleLogs = includeDeleted ? this.logs : this.logs.filter((l) => !l.isDeleted);
    if (batchId) {
      visibleLogs = visibleLogs.filter(
        (l) => l.isBenchmark === true || this.matchesBatch(l.batchId, batchId)
      );
    }
    if (!tankId) return [...visibleLogs];
    return visibleLogs.filter((l) => l.tankId === tankId).sort((a, b) => a.dayNumber - b.dayNumber);
  }

  public addLog(entry: FermentationLogEntry): FermentationLogEntry[] {
    this.hasLocalMutations = true;
    const now = Date.now();
    const fallbackBatch =
      this.batches.find(
        (b) => (entry.tankId === 'tank-rose' ? b.targetStyle === 'rose' : b.targetStyle !== 'rose') && !b.isDemo
      ) ??
      this.batches.find((b) =>
        entry.tankId === 'tank-rose' ? b.targetStyle === 'rose' : b.targetStyle !== 'rose'
      );
    const resolvedBatchId =
      entry.batchId ??
      fallbackBatch?.id ??
      (entry.tankId === 'tank-rose' ? 'batch-rose-1403' : 'batch-rasha-1403');
    const enriched: FermentationLogEntry = {
      ...entry,
      batchId: resolvedBatchId,
      timestampMs: entry.timestampMs ?? now,
      updatedAtMs: entry.updatedAtMs ?? now
    };
    this.logs.push(enriched);
    this.persistLogs();
    this.incrementChangesSinceBackup();
    return this.getLogs();
  }

  public updateLog(id: string, entry: Partial<FermentationLogEntry>): FermentationLogEntry[] {
    const idx = this.logs.findIndex((l) => l.id === id);
    if (idx !== -1) {
      this.hasLocalMutations = true;
      this.logs[idx] = { ...this.logs[idx], ...entry, updatedAtMs: Date.now() };
      this.persistLogs();
      this.incrementChangesSinceBackup();
    }
    return this.getLogs();
  }

  public softDeleteLog(id: string): FermentationLogEntry[] {
    const idx = this.logs.findIndex((l) => l.id === id);
    if (idx !== -1) {
      this.hasLocalMutations = true;
      this.logs[idx] = { ...this.logs[idx], isDeleted: true, updatedAtMs: Date.now() };
      this.persistLogs();
      this.incrementChangesSinceBackup();
    }
    return this.getLogs();
  }

  public restoreLog(id: string): FermentationLogEntry[] {
    const idx = this.logs.findIndex((l) => l.id === id);
    if (idx !== -1) {
      this.hasLocalMutations = true;
      this.logs[idx] = { ...this.logs[idx], isDeleted: false, updatedAtMs: Date.now() };
      this.persistLogs();
      this.incrementChangesSinceBackup();
    }
    return this.getLogs();
  }

  public deleteLog(id: string): FermentationLogEntry[] {
    this.hasLocalMutations = true;
    this.logs = this.logs.filter((l) => l.id !== id);
    this.persistLogs();
    this.incrementChangesSinceBackup();
    return this.getLogs();
  }

  public clearRealLogs(tankId?: TankId, batchId?: string): FermentationLogEntry[] {
    this.hasLocalMutations = true;
    this.logs = this.logs.filter((l) => {
      if (l.isBenchmark === true) return true;
      if (tankId && l.tankId !== tankId) return true;
      if (batchId && !this.matchesBatch(l.batchId, batchId)) return true;
      return false;
    });
    this.persistLogs();
    this.incrementChangesSinceBackup();
    return this.getLogs(undefined, false, batchId);
  }

  public resetLogsToDefault(): FermentationLogEntry[] {
    this.hasLocalMutations = true;
    this.logs = [...INITIAL_TRACKING_DATA];
    this.persistLogs();
    return this.getLogs();
  }

  private persistLogs() {
    mirrorToIndexedDB(DB_STORAGE_KEY_LOGS, this.logs);
    this.handleStorageSetItem(DB_STORAGE_KEY_LOGS, JSON.stringify(this.logs));
  }

  // --- Chemical Additions ---
  public getAdditions(tankId?: TankId, includeDeleted: boolean = false, batchId?: string): ChemicalAddition[] {
    let visibleAdditions = includeDeleted ? this.additions : this.additions.filter((a) => !a.isDeleted);
    if (batchId) {
      visibleAdditions = visibleAdditions.filter((a) => this.matchesBatch(a.batchId, batchId));
    }
    if (!tankId) return [...visibleAdditions];
    return visibleAdditions.filter((a) => a.tankId === tankId);
  }

  public addAddition(addition: Omit<ChemicalAddition, 'id'>): ChemicalAddition {
    this.hasLocalMutations = true;
    const now = Date.now();
    const newAddition: ChemicalAddition = {
      ...addition,
      id: generateId('add'),
      timestampMs: addition.timestampMs ?? now,
      updatedAtMs: addition.updatedAtMs ?? now
    };
    this.additions.unshift(newAddition);
    this.persistAdditions();
    this.incrementChangesSinceBackup();
    return newAddition;
  }

  public softDeleteAddition(id: string): ChemicalAddition[] {
    const idx = this.additions.findIndex((a) => a.id === id);
    if (idx !== -1) {
      this.hasLocalMutations = true;
      this.additions[idx] = { ...this.additions[idx], isDeleted: true, updatedAtMs: Date.now() };
      this.persistAdditions();
      this.incrementChangesSinceBackup();
    }
    return this.getAdditions();
  }

  public restoreAddition(id: string): ChemicalAddition[] {
    const idx = this.additions.findIndex((a) => a.id === id);
    if (idx !== -1) {
      this.hasLocalMutations = true;
      this.additions[idx] = { ...this.additions[idx], isDeleted: false, updatedAtMs: Date.now() };
      this.persistAdditions();
      this.incrementChangesSinceBackup();
    }
    return this.getAdditions();
  }

  public deleteAddition(id: string): ChemicalAddition[] {
    this.hasLocalMutations = true;
    this.additions = this.additions.filter((a) => a.id !== id);
    this.persistAdditions();
    this.incrementChangesSinceBackup();
    return this.getAdditions();
  }

  private persistAdditions() {
    mirrorToIndexedDB(DB_STORAGE_KEY_ADDITIONS, this.additions);
    this.handleStorageSetItem(DB_STORAGE_KEY_ADDITIONS, JSON.stringify(this.additions));
  }

  // --- Lab Analyses ---
  public getLabAnalyses(tankId?: TankId, includeDeleted: boolean = false, batchId?: string): LabAnalysisRecord[] {
    let visibleAnalyses = includeDeleted ? this.analyses : this.analyses.filter((a) => !a.isDeleted);
    if (batchId) {
      visibleAnalyses = visibleAnalyses.filter((a) => this.matchesBatch(a.batchId, batchId));
    }
    if (!tankId) return [...visibleAnalyses];
    return visibleAnalyses.filter((a) => a.tankId === tankId);
  }

  public addLabAnalysis(analysis: Omit<LabAnalysisRecord, 'id'>): LabAnalysisRecord {
    this.hasLocalMutations = true;
    const now = Date.now();
    const newRecord: LabAnalysisRecord = {
      ...analysis,
      id: generateId('lab'),
      timestampMs: analysis.timestampMs ?? now,
      updatedAtMs: analysis.updatedAtMs ?? now
    };
    this.analyses.unshift(newRecord);
    this.persistAnalyses();
    this.incrementChangesSinceBackup();
    return newRecord;
  }

  public softDeleteLabAnalysis(id: string): LabAnalysisRecord[] {
    const idx = this.analyses.findIndex((a) => a.id === id);
    if (idx !== -1) {
      this.hasLocalMutations = true;
      this.analyses[idx] = { ...this.analyses[idx], isDeleted: true, updatedAtMs: Date.now() };
      this.persistAnalyses();
      this.incrementChangesSinceBackup();
    }
    return this.getLabAnalyses();
  }

  public restoreLabAnalysis(id: string): LabAnalysisRecord[] {
    const idx = this.analyses.findIndex((a) => a.id === id);
    if (idx !== -1) {
      this.hasLocalMutations = true;
      this.analyses[idx] = { ...this.analyses[idx], isDeleted: false, updatedAtMs: Date.now() };
      this.persistAnalyses();
      this.incrementChangesSinceBackup();
    }
    return this.getLabAnalyses();
  }

  public deleteLabAnalysis(id: string): LabAnalysisRecord[] {
    this.hasLocalMutations = true;
    this.analyses = this.analyses.filter((a) => a.id !== id);
    this.persistAnalyses();
    this.incrementChangesSinceBackup();
    return this.getLabAnalyses();
  }

  private persistAnalyses() {
    mirrorToIndexedDB(DB_STORAGE_KEY_ANALYSES, this.analyses);
    this.handleStorageSetItem(DB_STORAGE_KEY_ANALYSES, JSON.stringify(this.analyses));
  }

  // --- Saved Calculations ---
  public getSavedCalculations(): SavedCalculation[] {
    return [...this.calculations];
  }

  public saveCalculation(calc: Omit<SavedCalculation, 'id' | 'timestamp'>): SavedCalculation {
    this.hasLocalMutations = true;
    const newCalc: SavedCalculation = {
      ...calc,
      id: generateId('calc'),
      timestamp: new Intl.DateTimeFormat('fa-IR', {
        dateStyle: 'medium',
        timeStyle: 'short'
      }).format(new Date())
    };
    this.calculations.unshift(newCalc);
    this.persistCalculations();
    this.incrementChangesSinceBackup();
    return newCalc;
  }

  public deleteCalculation(id: string): SavedCalculation[] {
    this.hasLocalMutations = true;
    this.calculations = this.calculations.filter((c) => c.id !== id);
    this.persistCalculations();
    this.incrementChangesSinceBackup();
    return [...this.calculations];
  }

  private persistCalculations() {
    mirrorToIndexedDB(DB_STORAGE_KEY_CALCS, this.calculations);
    this.handleStorageSetItem(DB_STORAGE_KEY_CALCS, JSON.stringify(this.calculations));
  }

  // --- Cumulative SO2 Budget Ledger ---
  public getCumulativeSO2Ledger(
    tankId: TankId,
    batchVolumeL?: number,
    residualSugarGL: number = 1.5,
    measuredTotalSO2MgL?: number,
    excludeDemo: boolean = false,
    batchId?: string
  ): CumulativeSO2Ledger {
    const defaultVol =
      tankId === 'tank-rose'
        ? MASTER_PROTOCOL_CONFIG.volumes.roseClarifiedFermentL
        : MASTER_PROTOCOL_CONFIG.volumes.redLiquidFermentPerTankL;
    const effectiveVol = batchVolumeL && batchVolumeL > 0 ? batchVolumeL : defaultVol;

    const targetBatchId =
      batchId ??
      (excludeDemo
        ? this.batches.find(
            (b) =>
              (tankId === 'tank-rose' ? b.targetStyle === 'rose' : b.targetStyle !== 'rose') &&
              !b.isDemo
          )?.id
        : (
            this.batches.find(
              (b) =>
                (tankId === 'tank-rose' ? b.targetStyle === 'rose' : b.targetStyle !== 'rose') &&
                !b.isDemo
            ) ??
            this.batches.find((b) =>
              tankId === 'tank-rose' ? b.targetStyle === 'rose' : b.targetStyle !== 'rose'
            )
          )?.id);

    const effectiveQueryBatchId = targetBatchId ?? (excludeDemo ? '__NONE__' : undefined);

    const tankAdditions = this.getAdditions(tankId, false, effectiveQueryBatchId).filter((add) => {
      if (add.isDeleted === true) return false;
      if (excludeDemo && add.isDemo === true) return false;
      return true;
    });

    const kmsMgPerGram = Math.round(MASTER_PROTOCOL_CONFIG.stoichiometry.kmsActiveSO2Fraction * 1000);
    const kmsMgPerGhL = Math.round((kmsMgPerGram / 100) * 100) / 100;
    const kmsMgPerMl10Pct = Math.round((kmsMgPerGram / 10) * 10) / 10;

    let addedFromKmsMgL = 0;
    let totalKmsMassGrams = 0;
    let skippedInvalidUnitCount = 0;
    const stageBreakdown: CumulativeSO2Ledger['stageBreakdown'] = [];

    for (const add of tankAdditions) {
      let isKms = false;
      if (add.compoundType !== undefined) {
        isKms = add.compoundType === 'kms';
      } else {
        const isPureBactiless =
          /bactiless|بکتی‌لس|بکتیلس/i.test(add.compoundName) &&
          !/kms|k2s2o5|متابی‌سولفیت|متابیسولفیت/i.test(add.compoundName);
        isKms =
          !isPureBactiless &&
          (add.pubchemCid === 24446 ||
            add.compoundName.includes('سولفیت') ||
            add.compoundName.includes('KMS') ||
            add.compoundName.includes('K2S2O5'));
      }

      if (!isKms) continue;

      const volForStage =
        add.referenceVolumeL !== undefined && add.referenceVolumeL > 0
          ? add.referenceVolumeL
          : add.stageTitle.includes('150') ||
            add.stageTitle.includes('۱۵۰') ||
            add.purpose.includes('150') ||
            add.purpose.includes('۱۵۰')
          ? MASTER_PROTOCOL_CONFIG.volumes.initialLiquidPerTankL
          : effectiveVol;

      if (add.unit === 'mg/L') {
        const contributedMgL = Math.round(add.amount * 10) / 10;
        const rawGrams = (add.amount * volForStage) / kmsMgPerGram;
        const equivalentGrams = Math.round(rawGrams * 100) / 100;
        addedFromKmsMgL += add.amount;
        totalKmsMassGrams += rawGrams;
        stageBreakdown.push({
          id: add.id,
          stageTitle: add.stageTitle,
          amountGrams: equivalentGrams,
          referenceVolumeL: volForStage,
          contributedMgL,
          formulaText: `${add.amount} mg/L (${volForStage} L) = ${contributedMgL} mg/L`,
          isDemo: add.isDemo
        });
      } else if (add.unit === 'g') {
        const rawMgL = (add.amount * kmsMgPerGram) / volForStage;
        const contributedMgL = Math.round(rawMgL * 10) / 10;
        addedFromKmsMgL += rawMgL;
        totalKmsMassGrams += add.amount;
        stageBreakdown.push({
          id: add.id,
          stageTitle: add.stageTitle,
          amountGrams: add.amount,
          referenceVolumeL: volForStage,
          contributedMgL,
          formulaText: `${add.amount} g × ${kmsMgPerGram} ÷ ${volForStage} L = ${contributedMgL} mg/L`,
          isDemo: add.isDemo
        });
      } else if (add.unit === 'kg') {
        const grams = add.amount * 1000;
        const rawMgL = (grams * kmsMgPerGram) / volForStage;
        const contributedMgL = Math.round(rawMgL * 10) / 10;
        addedFromKmsMgL += rawMgL;
        totalKmsMassGrams += grams;
        stageBreakdown.push({
          id: add.id,
          stageTitle: add.stageTitle,
          amountGrams: Math.round(grams * 100) / 100,
          referenceVolumeL: volForStage,
          contributedMgL,
          formulaText: `${add.amount} kg (${grams} g) × ${kmsMgPerGram} ÷ ${volForStage} L = ${contributedMgL} mg/L`,
          isDemo: add.isDemo
        });
      } else if (add.unit === 'g/hL') {
        const grams = (add.amount / 100) * volForStage;
        const rawMgL = add.amount * kmsMgPerGhL;
        const contributedMgL = Math.round(rawMgL * 10) / 10;
        addedFromKmsMgL += rawMgL;
        totalKmsMassGrams += grams;
        stageBreakdown.push({
          id: add.id,
          stageTitle: add.stageTitle,
          amountGrams: Math.round(grams * 100) / 100,
          referenceVolumeL: volForStage,
          contributedMgL,
          formulaText: `${add.amount} g/hL × ${kmsMgPerGhL} = ${contributedMgL} mg/L`,
          isDemo: add.isDemo
        });
      } else if (add.unit === 'mL') {
        const grams = add.amount * 0.1;
        const rawMgL = (add.amount * kmsMgPerMl10Pct) / volForStage;
        const contributedMgL = Math.round(rawMgL * 10) / 10;
        addedFromKmsMgL += rawMgL;
        totalKmsMassGrams += grams;
        stageBreakdown.push({
          id: add.id,
          stageTitle: add.stageTitle,
          amountGrams: Math.round(grams * 100) / 100,
          referenceVolumeL: volForStage,
          contributedMgL,
          formulaText: `${add.amount} mL (محلول ۱۰٪ = ${Math.round(grams * 100) / 100} g) × ${kmsMgPerGram} ÷ ${volForStage} L = ${contributedMgL} mg/L`,
          isDemo: add.isDemo
        });
      } else {
        skippedInvalidUnitCount += 1;
      }
    }

    const roundedAdded = Math.round(addedFromKmsMgL * 10) / 10;
    const roundedTotalKmsMassGrams = Math.round(totalKmsMassGrams * 100) / 100;
    const finalVolumeEquivalentMgL = Math.round(((totalKmsMassGrams * kmsMgPerGram) / effectiveVol) * 10) / 10;
    const endogenousYeastMgL = MASTER_PROTOCOL_CONFIG.stoichiometry.yeastEndogenousSO2MgL;
    const estimatedTotalSO2MgL = Math.round((roundedAdded + endogenousYeastMgL) * 10) / 10;
    const legalCeilingMgL =
      tankId === 'tank-rose'
        ? residualSugarGL >= 5
          ? 250
          : 200
        : residualSugarGL >= 5
        ? 200
        : 150;
    const effectiveComparisonTotal = measuredTotalSO2MgL !== undefined ? measuredTotalSO2MgL : estimatedTotalSO2MgL;
    const remainingBudgetMgL = Math.max(0, Math.round((legalCeilingMgL - effectiveComparisonTotal) * 10) / 10);

    return {
      tankId,
      batchId: targetBatchId,
      addedFromKmsMgL: roundedAdded,
      totalKmsMassGrams: roundedTotalKmsMassGrams,
      finalVolumeEquivalentMgL,
      skippedInvalidUnitCount,
      endogenousYeastMgL,
      estimatedTotalSO2MgL,
      legalCeilingMgL,
      remainingBudgetMgL,
      isOverBudget: effectiveComparisonTotal > legalCeilingMgL,
      accountingBasisFa:
        'حسابداری اسمی سولفیت افزودهشده (Nominal Added SO2 Accounting — متفاوت از Total SO2 آزمایشگاهی)',
      estimatedBoundAndVolatilizedRatio: 0.35,
      measuredTotalSO2MgL,
      stageBreakdown
    };
  }

  // --- Backup Health Status ---
  public getBackupHealthStatus(): {
    status: 'green' | 'amber' | 'red';
    daysSinceBackup: number | null;
    unsavedChangesCount: number;
    labelFa: string;
  } {
    const daysSinceBackup =
      this.lastBackupMs !== null
        ? Math.floor((Date.now() - this.lastBackupMs) / (1000 * 60 * 60 * 24))
        : null;
    const unsavedChangesCount = this.changesSinceBackup;

    if (daysSinceBackup === null || daysSinceBackup >= 7) {
      return {
        status: 'red',
        daysSinceBackup,
        unsavedChangesCount,
        labelFa: 'پشتیبانگیری نشده یا بیش از ۷ روز گذشته'
      };
    }

    if (daysSinceBackup >= 3 || unsavedChangesCount > 10) {
      return {
        status: 'amber',
        daysSinceBackup,
        unsavedChangesCount,
        labelFa: 'نیازمند پشتیبانگیری جدید'
      };
    }

    return {
      status: 'green',
      daysSinceBackup,
      unsavedChangesCount,
      labelFa: 'آخرین پشتیبان: بهروز'
    };
  }

  // --- Database Stats & Health ---
  public getDatabaseSummary() {
    return {
      totalBatches: this.batches.length,
      totalFermentationLogs: this.logs.length,
      totalChemicalAdditions: this.additions.length,
      totalLabAnalyses: this.analyses.length,
      totalSavedCalculations: this.calculations.length,
      totalRecords:
        this.batches.length +
        this.logs.length +
        this.additions.length +
        this.analyses.length +
        this.calculations.length,
      lastUpdated: new Date().toISOString()
    };
  }

  // --- Export Full Database (JSON) ---
  public buildExportDatabaseJSON(): string {
    let flexibleProtocolParams: Record<string, number | string> | undefined;
    if (typeof localStorage !== 'undefined') {
      try {
        const rawFlex = localStorage.getItem('enology_flexible_protocol_params_v1');
        if (rawFlex) {
          const parsedFlex: unknown = JSON.parse(rawFlex);
          if (parsedFlex && typeof parsedFlex === 'object' && !Array.isArray(parsedFlex)) {
            flexibleProtocolParams = parsedFlex as Record<string, number | string>;
          }
        }
      } catch {
        // Ignore flexible protocol snapshot read errors
      }
    }

    const exportData: EnologyDatabaseExport = {
      version: '3.3.0',
      exportedAt: new Date().toISOString(),
      batches: this.batches,
      fermentationLogs: this.logs,
      chemicalAdditions: this.additions,
      labAnalyses: this.analyses,
      savedCalculations: this.calculations,
      ...(flexibleProtocolParams ? { flexibleProtocolParams } : {})
    };
    return JSON.stringify(exportData, null, 2);
  }

  public confirmBackupCompleted(): void {
    this.lastBackupMs = Date.now();
    this.changesSinceBackup = 0;
    this.persistBackupMeta();
  }

  public exportDatabaseJSON(confirmImmediately: boolean = true): string {
    const json = this.buildExportDatabaseJSON();
    if (confirmImmediately) {
      this.confirmBackupCompleted();
    }
    return json;
  }

  // --- Export Logs to CSV ---
  public exportLogsToCSV(tankId?: TankId, batchId?: string): string {
    const entries = this.getLogs(tankId, false, batchId);
    const headers = [
      'شناسه (ID)',
      'مخزن (Tank)',
      'روز (Day)',
      'تاریخ و ساعت (Date Time)',
      'مرحله (Stage)',
      'بریکس (Brix)',
      'دانسیته ویژه (SG)',
      'دمای کلاهک (Temp Cap °C)',
      'دمای محیط (Temp Room °C)',
      'pH',
      'اسیدیته کل (TA g/L)',
      'سولفیت آزاد (Free SO2 ppm)',
      'پیژاژ (Pigeage)',
      'تعداد پیژاژ',
      'توضیحات و اقدامات (Notes)'
    ];

    const rows = entries.map((e) => [
      `"${e.id}"`,
      `"${e.tankId}"`,
      e.dayNumber,
      `"${e.dateTime}"`,
      `"${e.stageTitle}"`,
      e.brix,
      e.sg,
      e.tempCap,
      e.tempRoom,
      e.ph,
      e.ta ?? '',
      e.freeSO2 ?? '',
      e.pigeageDone ? 'انجام شد' : 'خیر',
      e.pigeageCount ?? 0,
      `"${(e.operationNote || '').replace(/"/g, '""')}"`
    ]);

    // Add UTF-8 BOM so Excel opens Persian text cleanly
    return '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }

  // --- Preview Database Import (JSON) ---
  public previewDatabaseImport(jsonString: string): {
    valid: boolean;
    messageFa: string;
    summary?: {
      batchesCount: number;
      logsCount: number;
      additionsCount: number;
      analysesCount: number;
      dateRangeFa: string;
    };
  } {
    try {
      const parsedObj: unknown = JSON.parse(jsonString);
      const result = EnologyDatabaseExportSchema.safeParse(parsedObj);

      if (!result.success) {
        return {
          valid: false,
          messageFa: 'فایل پشتیبان نامعتبر است: ساختار داده با پروتکل کارخانه همخوانی ندارد.'
        };
      }

      const logs = result.data.fermentationLogs;
      const batches = result.data.batches;
      let dateRangeFa = 'بدون تاریخ';
      if (logs.length > 0) {
        const firstDate = logs[0].dateTime;
        const lastDate = logs[logs.length - 1].dateTime;
        dateRangeFa = firstDate === lastDate ? firstDate : `${firstDate} تا ${lastDate}`;
      } else if (batches.length > 0) {
        dateRangeFa = batches[0].startDate;
      }

      return {
        valid: true,
        messageFa: 'فایل پشتیبان معتبر است و آماده بارگذاری می‌باشد.',
        summary: {
          batchesCount: batches.length,
          logsCount: logs.length,
          additionsCount: result.data.chemicalAdditions.length,
          analysesCount: result.data.labAnalyses.length,
          dateRangeFa
        }
      };
    } catch {
      return {
        valid: false,
        messageFa: 'فایل پشتیبان نامعتبر است: ساختار داده با پروتکل کارخانه همخوانی ندارد.'
      };
    }
  }

  // --- Import Database (JSON) with Zod Validation ---
  public importDatabaseJSON(
    jsonString: string,
    mode: 'replace' | 'merge' = 'replace'
  ): { success: boolean; message: string } {
    try {
      const parsedObj: unknown = JSON.parse(jsonString);
      const result = EnologyDatabaseExportSchema.safeParse(parsedObj);

      if (!result.success) {
        return {
          success: false,
          message: 'فایل پشتیبان نامعتبر است: ساختار داده با پروتکل کارخانه همخوانی ندارد.'
        };
      }

      const mergeById = <T extends { id: string }>(existing: T[], incoming: T[]): T[] => {
        const map = new Map<string, T>();
        for (const item of existing) {
          map.set(item.id, item);
        }
        for (const incomingItem of incoming) {
          const existingItem = map.get(incomingItem.id);
          if (!existingItem) {
            map.set(incomingItem.id, incomingItem);
            continue;
          }
          const existingTime =
            (existingItem as { updatedAtMs?: number; timestampMs?: number }).updatedAtMs ??
            (existingItem as { timestampMs?: number }).timestampMs ??
            0;
          const incomingTime =
            (incomingItem as { updatedAtMs?: number; timestampMs?: number }).updatedAtMs ??
            (incomingItem as { timestampMs?: number }).timestampMs ??
            0;

          if (existingTime > incomingTime) {
            map.set(incomingItem.id, existingItem);
          } else if (
            (existingItem as { isDeleted?: boolean }).isDeleted === true &&
            (incomingItem as { isDeleted?: boolean }).isDeleted !== true &&
            incomingTime <= existingTime
          ) {
            map.set(incomingItem.id, existingItem);
          } else {
            map.set(incomingItem.id, incomingItem);
          }
        }
        return Array.from(map.values());
      };

      this.hasLocalMutations = true;
      if (mode === 'merge') {
        this.batches = mergeById(this.batches, result.data.batches);
        this.logs = mergeById(this.logs, result.data.fermentationLogs);
        this.additions = mergeById(this.additions, result.data.chemicalAdditions);
        this.analyses = mergeById(this.analyses, result.data.labAnalyses);
        this.calculations = mergeById(this.calculations, result.data.savedCalculations);
        if (
          result.data.flexibleProtocolParams &&
          typeof localStorage !== 'undefined' &&
          !localStorage.getItem('enology_flexible_protocol_params_v1')
        ) {
          this.handleStorageSetItem(
            'enology_flexible_protocol_params_v1',
            JSON.stringify(result.data.flexibleProtocolParams)
          );
        }
        this.incrementChangesSinceBackup();
      } else {
        this.batches = result.data.batches;
        this.logs = result.data.fermentationLogs;
        this.additions = result.data.chemicalAdditions;
        this.analyses = result.data.labAnalyses;
        this.calculations = result.data.savedCalculations;
        if (result.data.flexibleProtocolParams) {
          this.handleStorageSetItem(
            'enology_flexible_protocol_params_v1',
            JSON.stringify(result.data.flexibleProtocolParams)
          );
        }
      }

      this.persistBatches();
      this.persistLogs();
      this.persistAdditions();
      this.persistAnalyses();
      this.persistCalculations();

      return {
        success: true,
        message:
          mode === 'merge'
            ? `پایگاه داده با موفقیت ادغام شد (${this.logs.length} لاگ، ${this.batches.length} بچ)`
            : `پایگاه داده با موفقیت بازنشانی و بارگذاری شد (${result.data.fermentationLogs.length} لاگ، ${result.data.batches.length} بچ)`
      };
    } catch {
      return {
        success: false,
        message: 'فایل پشتیبان نامعتبر است: ساختار داده با پروتکل کارخانه همخوانی ندارد.'
      };
    }
  }

  // --- Full Factory Reset ---
  public resetToFactoryDefaults() {
    this.hasLocalMutations = true;
    this.batches = [...DEFAULT_BATCHES];
    this.logs = [...INITIAL_TRACKING_DATA];
    this.additions = [...DEFAULT_CHEMICAL_ADDITIONS];
    this.analyses = [...DEFAULT_LAB_ANALYSES];
    this.calculations = [];

    this.persistBatches();
    this.persistLogs();
    this.persistAdditions();
    this.persistAnalyses();
    this.persistCalculations();
    this.incrementChangesSinceBackup();
  }
}

export const enologyDb = new EnologyDatabaseService();

