import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Award,
  Bell,
  Calendar,
  Camera,
  Check,
  CheckCircle2,
  Copy,
  Download,
  GitCompare,
  Plus,
  Printer,
  Smartphone,
  Sparkles,
  Star,
  Trash2,
  Wine
} from 'lucide-react';
import type {
  ChemicalAddition,
  FermentationLogEntry,
  TankId
} from '../types/index.ts';
import { enologyDb } from '../db/enologyDatabase.ts';
import {
  calculateAlcoholByVolume,
  sortFermentationLogs
} from '../utils/trackingCalculations.ts';
import { useLocalStorageState } from '../utils/useLocalStorage.ts';
import { useEnologyUi } from '../context/EnologyUiContext.tsx';
import { getCurrentPersianDateTimeStr } from '../utils/persianDate.ts';

export interface PhotoDiaryAndVintagePanelProps {
  tankId?: TankId;
}

export interface PhotoDiaryEntry {
  id: string;
  batchId: string;
  tankId: TankId;
  timestamp: string;
  dayNumber: number;
  category: 'hydrometer' | 'cap' | 'color' | 'sediment';
  dataUrlJpeg: string;
  sizeKb: number;
  quickTags: string[];
  note: string;
}

export type TastingCheckpointKey =
  | 'day_10'
  | 'post_racking'
  | 'bottling'
  | 'month_3'
  | 'month_6'
  | 'month_12';

export interface ScheduledTastingRecord {
  checkpoint: TastingCheckpointKey;
  appearance: number; // 1 to 5
  aroma: number; // 1 to 5
  palate: number; // 1 to 5
  acidity?: number; // 1 to 5
  tannin?: number; // 1 to 5
  body?: number; // 1 to 5
  balance?: number; // 1 to 5
  wineColorHex?: string;
  wineColorLabelFa?: string;
  quickTags: string[];
  note: string;
  updatedAtFa: string;
}

export const STANDARD_WINE_COLOR_SWATCHES: ReadonlyArray<{
  id: string;
  labelFa: string;
  hex: string;
}> = [
  { id: 'pale-salmon', labelFa: 'سالمون کمرنگ (رزه جوان)', hex: '#F4A698' },
  { id: 'provence-rose', labelFa: 'رزه پرووانس کلاسیک', hex: '#E88378' },
  { id: 'copper-rose', labelFa: 'رزه مسی / پیازداغی', hex: '#D4725C' },
  { id: 'ruby-saignee', labelFa: 'یاقوتی روشن (Saignée)', hex: '#B8293D' },
  { id: 'young-purple', labelFa: 'ارغوانی جوان (رشه تازه)', hex: '#6B123B' },
  { id: 'medium-ruby', labelFa: 'یاقوتی متوسط', hex: '#8A1538' },
  { id: 'deep-ruby', labelFa: 'یاقوتی تیره (رشه سردشت)', hex: '#580F24' },
  { id: 'garnet', labelFa: 'لعل (Garnet — بلوغ با بلوط)', hex: '#6E1E1E' },
  { id: 'deep-garnet', labelFa: 'لعل تیره', hex: '#4A1215' },
  { id: 'tawny', labelFa: 'آجری / کهربایی تیره (کهنه‌شده)', hex: '#7A3018' }
];

export function computeSensoryRadarPolygonPoints(
  scores: {
    aroma: number;
    acidity: number;
    tannin: number;
    body: number;
    balance: number;
  },
  centerX = 110,
  centerY = 110,
  maxRadius = 78
): {
  polygonPoints: string;
  vertices: Array<{
    axisKey: 'aroma' | 'acidity' | 'tannin' | 'body' | 'balance';
    labelFa: string;
    score: number;
    x: number;
    y: number;
    labelX: number;
    labelY: number;
  }>;
} {
  const axes: ReadonlyArray<{
    axisKey: 'aroma' | 'acidity' | 'tannin' | 'body' | 'balance';
    labelFa: string;
    angleDeg: number;
  }> = [
    { axisKey: 'aroma', labelFa: 'عطر و بو', angleDeg: -90 },
    { axisKey: 'acidity', labelFa: 'اسیدیته', angleDeg: -18 },
    { axisKey: 'tannin', labelFa: 'تانن', angleDeg: 54 },
    { axisKey: 'body', labelFa: 'بادی و غلظت', angleDeg: 126 },
    { axisKey: 'balance', labelFa: 'تعادل و پایان', angleDeg: 198 }
  ];

  const vertices = axes.map((ax) => {
    const rawScore = scores[ax.axisKey] ?? 3;
    const clamped = Math.min(5, Math.max(1, rawScore));
    const rad = (ax.angleDeg * Math.PI) / 180;
    const r = (clamped / 5) * maxRadius;
    const x = Number((centerX + r * Math.cos(rad)).toFixed(1));
    const y = Number((centerY + r * Math.sin(rad)).toFixed(1));
    const labelX = Number((centerX + (maxRadius + 20) * Math.cos(rad)).toFixed(1));
    const labelY = Number((centerY + (maxRadius + 20) * Math.sin(rad)).toFixed(1));
    return {
      axisKey: ax.axisKey,
      labelFa: ax.labelFa,
      score: clamped,
      x,
      y,
      labelX,
      labelY
    };
  });

  return {
    polygonPoints: vertices.map((v) => `${v.x},${v.y}`).join(' '),
    vertices
  };
}

export interface VintagePassportSummary {
  batchNameFa: string;
  vintageYear: number;
  varietyAndOriginFa: string;
  tankLabelFa: string;
  initialSG: string;
  finalSG: string;
  abvPct: string;
  fermentationDays: number;
  finalPh: string;
  finalTaGL: string;
  totalSo2AddedMgL: number;
  oakProfileFa: string;
  bottles750mlCount: number;
  sensoryScoreOutOf5: string;
  wineColorHex: string;
  wineColorLabelFa: string;
}

export function buildVintagePassportSummary(params: {
  tankId: TankId | 'tank-1' | 'tank-2';
  batchNameFa?: string;
  vintageYear?: number;
  initialSG?: number;
  logs: FermentationLogEntry[];
  additions: ChemicalAddition[];
  totalSo2AddedMgL: number;
  avgScoreOutOf5: string;
  wineColorHex?: string;
  wineColorLabelFa?: string;
}): VintagePassportSummary {
  const sorted = sortFermentationLogs(
    params.logs.filter((l) => !l.isBenchmark)
  );
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  const initSG = params.initialSG ?? first?.sg ?? 1.092;
  const finSG = last?.sg ?? 0.994;
  const abv = calculateAlcoholByVolume(initSG, finSG);
  const finalVolumeL = params.tankId === 'tank-rose' ? 30 : 93;
  const bottles750mlCount = Math.floor(finalVolumeL / 0.75);

  const oakAdditions = params.additions.filter(
    (a) =>
      (a.compoundType as string | undefined) === 'oak_chips' ||
      (a.compoundType as string | undefined) === 'oak' ||
      a.compoundName.includes('بلوط')
  );
  const oakProfileFa =
    oakAdditions.length > 0
      ? 'بلوط فرانسوی مدیوم‌تُست (۱.۲ g/L)'
      : params.tankId === 'tank-rose'
        ? 'بدون بلوط (Unoaked Rosé)'
        : 'بلوط فرانسوی مدیوم‌تُست (پروتکل روز ۲۵)';

  const tankLabelFa =
    params.tankId === 'tank-a' || params.tankId === 'tank-1'
      ? 'مخزن ۱ (قرمز اصلی A — ۱۰۰ لیتر نهایی)'
      : params.tankId === 'tank-b' || params.tankId === 'tank-2'
        ? 'مخزن ۲ (قرمز اصلی B — ۱۰۰ لیتر نهایی)'
        : 'مخزن رزه (Saignée — ۳۰ لیتر نهایی)';

  return {
    batchNameFa: params.batchNameFa ?? 'بچ فعلی رشه سردشت (۱۴۰۳/۱۴۰۵)',
    vintageYear: params.vintageYear ?? 1403,
    varietyAndOriginFa: 'انگور سیاه رشه سردشت (تاکستان‌های دیم ارتفاعات سردشت)',
    tankLabelFa,
    initialSG: initSG.toFixed(3),
    finalSG: finSG.toFixed(3),
    abvPct: abv.toFixed(1),
    fermentationDays: last?.dayNumber ?? 8,
    finalPh: (last?.ph ?? first?.ph ?? 3.52).toFixed(2),
    finalTaGL: (last?.ta ?? first?.ta ?? 6.7).toFixed(1),
    totalSo2AddedMgL: params.totalSo2AddedMgL,
    oakProfileFa,
    bottles750mlCount,
    sensoryScoreOutOf5: params.avgScoreOutOf5,
    wineColorHex:
      params.wineColorHex ??
      (params.tankId === 'tank-rose' ? '#B8293D' : '#580F24'),
    wineColorLabelFa:
      params.wineColorLabelFa ??
      (params.tankId === 'tank-rose'
        ? 'یاقوتی روشن (Saignée)'
        : 'یاقوتی تیره (رشه سردشت)')
  };
}

export interface HistoricalVintageEntry {
  id: string;
  titleFa: string;
  vintageYear: number;
  initialBrix: number;
  phRangeText: string;
  taGL: number;
  yanMgL: number;
  fermentationDays: number;
  finalAbvPct: number;
  totalAddedSo2MgL: number;
  avgTastingScore: string;
}

const IDB_DB_NAME = 'enology_photo_diary_idb_v1';
const IDB_STORE_NAME = 'photos';
const IDB_FALLBACK_LS_KEY = 'enology_photo_diary_fallback_v1';

const TASTING_CHECKPOINTS: ReadonlyArray<{
  key: TastingCheckpointKey;
  labelFa: string;
}> = [
  { key: 'day_10', labelFa: 'روز ۱۰ — پیش از سیفون دُرد سنگین' },
  { key: 'post_racking', labelFa: 'روز ۲۱ — پس از سیفون باکتی‌لس' },
  { key: 'bottling', labelFa: 'روز ۱۰۰ — بطری‌گیری' },
  { key: 'month_3', labelFa: '۳ ماه پس از بطری' },
  { key: 'month_6', labelFa: '۶ ماه پس از بطری' },
  { key: 'month_12', labelFa: '۱۲ ماه — یک‌سالگی' }
];

const QUICK_SENSORY_FAULT_TAGS = [
  'میوه‌ای و یاقوتی تمیز',
  'بوی گوگرد (H2S)',
  'بوی سرکه / استات',
  'تانن مخملی',
  'گسی هسته خام',
  'اکسیداسیون جزئی'
] as const;

function openPhotoIdb(): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    if (typeof indexedDB === 'undefined') {
      resolve(null);
      return;
    }
    try {
      const req = indexedDB.open(IDB_DB_NAME, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(IDB_STORE_NAME)) {
          db.createObjectStore(IDB_STORE_NAME, { keyPath: 'id' });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

async function getAllPhotosFromIdb(): Promise<PhotoDiaryEntry[]> {
  const db = await openPhotoIdb();
  if (!db) {
    if (typeof localStorage === 'undefined') return [];
    try {
      const raw = localStorage.getItem(IDB_FALLBACK_LS_KEY);
      return raw ? (JSON.parse(raw) as PhotoDiaryEntry[]) : [];
    } catch {
      return [];
    }
  }
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(IDB_STORE_NAME, 'readonly');
      const store = tx.objectStore(IDB_STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => resolve((req.result as PhotoDiaryEntry[]) ?? []);
      req.onerror = () => resolve([]);
    } catch {
      resolve([]);
    }
  });
}

async function savePhotoToIdb(
  entry: PhotoDiaryEntry
): Promise<{ success: boolean; error?: string }> {
  const db = await openPhotoIdb();
  if (!db) {
    if (typeof localStorage === 'undefined') {
      return { success: false, error: 'فضای ذخیره‌سازی در دسترس نیست.' };
    }
    try {
      const existing = await getAllPhotosFromIdb();
      localStorage.setItem(
        IDB_FALLBACK_LS_KEY,
        JSON.stringify([entry, ...existing].slice(0, 15))
      );
      return { success: true };
    } catch {
      return { success: false, error: 'سقف حافظه مرورگر تکمیل شده است.' };
    }
  }
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(IDB_STORE_NAME, 'readwrite');
      tx.objectStore(IDB_STORE_NAME).put(entry);
      tx.oncomplete = () => resolve({ success: true });
      tx.onerror = () =>
        resolve({ success: false, error: 'خطا در ذخیره‌سازی IndexedDB.' });
    } catch {
      resolve({ success: false, error: 'خطا در تراکنش IndexedDB.' });
    }
  });
}

async function deletePhotoFromIdb(
  id: string
): Promise<{ success: boolean; error?: string }> {
  if (typeof localStorage !== 'undefined') {
    try {
      const raw = localStorage.getItem(IDB_FALLBACK_LS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as PhotoDiaryEntry[];
        if (Array.isArray(parsed)) {
          localStorage.setItem(
            IDB_FALLBACK_LS_KEY,
            JSON.stringify(parsed.filter((p) => p.id !== id))
          );
        }
      }
    } catch {
      // ignore localStorage fallback cleanup error
    }
  }
  const db = await openPhotoIdb();
  if (!db) return { success: true };
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(IDB_STORE_NAME, 'readwrite');
      tx.objectStore(IDB_STORE_NAME).delete(id);
      tx.oncomplete = () => resolve({ success: true });
      tx.onerror = () =>
        resolve({ success: false, error: 'خطا در حذف تصویر از IndexedDB.' });
    } catch {
      resolve({ success: false, error: 'خطا در تراکنش حذف IndexedDB.' });
    }
  });
}

export function compressImageToJpeg1280(
  file: File
): Promise<{ dataUrl: string; sizeKb: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('خطا در خواندن فایل تصویر'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('فرمت تصویر نامعتبر است'));
      img.onload = () => {
        const maxDim = 1280;
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width >= height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('خطا در پردازش گرافیکی تصویر'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        const sizeKb = Math.round((dataUrl.length * 0.75) / 1024);
        resolve({ dataUrl, sizeKb });
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

function formatIcsDateTimeLocal(baseDate: Date, addDays: number, hour: number): string {
  const d = new Date(baseDate.getTime());
  d.setDate(d.getDate() + addDays);
  d.setHours(hour, 0, 0, 0);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(
    d.getHours()
  )}0000`;
}

export function exportWorkshopCalendarICS(startDateIso: string): string {
  const baseDate = startDateIso ? new Date(`${startDateIso}T08:00:00`) : new Date();
  const events: Array<{
    uid: string;
    dtStart: string;
    dtEnd: string;
    rrule?: string;
    summary: string;
    description: string;
  }> = [
    {
      uid: 'pigeage-morning@enology-studio',
      dtStart: formatIcsDateTimeLocal(baseDate, 1, 8),
      dtEnd: formatIcsDateTimeLocal(baseDate, 1, 9),
      rrule: 'RRULE:FREQ=DAILY;COUNT=6',
      summary: 'پیژاژ نوبت صبح (۰۸:۰۰) و ثبت SG و دمای کلاهک',
      description: 'غوطه‌ورسازی ملایم کلاهک پوست و قرائت هیدرومتر در دمای اصلاح‌شده.'
    },
    {
      uid: 'pigeage-afternoon@enology-studio',
      dtStart: formatIcsDateTimeLocal(baseDate, 1, 15),
      dtEnd: formatIcsDateTimeLocal(baseDate, 1, 16),
      rrule: 'RRULE:FREQ=DAILY;COUNT=6',
      summary: 'پیژاژ نوبت عصر (۱۵:۰۰) و کنترل دمای زیر کلاهک',
      description: 'خیساندن کلاهک برای جلوگیری از رشد باکتری استیک و پایش دما زیر ۲۸.۵°C.'
    },
    {
      uid: 'pigeage-night@enology-studio',
      dtStart: formatIcsDateTimeLocal(baseDate, 1, 22),
      dtEnd: formatIcsDateTimeLocal(baseDate, 1, 23),
      rrule: 'RRULE:FREQ=DAILY;COUNT=6',
      summary: 'پیژاژ نوبت شب (۲۲:۰۰) و بازرسی قفل هوا',
      description: 'غوطه‌ورسازی نهایی شبانه کلاهک در روزهای ۱ تا ۶ تخمیر فعال.'
    },
    {
      uid: 'day2-sna1@enology-studio',
      dtStart: formatIcsDateTimeLocal(baseDate, 2, 10),
      dtEnd: formatIcsDateTimeLocal(baseDate, 2, 11),
      summary: 'روز ۲: بررسی تریگر تغذیه اول SNA-1 (SG ~ 1.083)',
      description: 'تزریق Fermaid O نوبت اول پس از گاززدایی کلاهک.'
    },
    {
      uid: 'day3-sna2-dap@enology-studio',
      dtStart: formatIcsDateTimeLocal(baseDate, 3, 10),
      dtEnd: formatIcsDateTimeLocal(baseDate, 3, 11),
      summary: 'روز ۳: تریگر تغذیه دوم SNA-2 و مهلت قانونی DAP (SG ~ 1.070 تا 1.062)',
      description: 'آخرین مهلت مصرف DAP و Fermaid K پیش از بسته شدن پنجره ۱/۳ افت قند در SG=1.062.'
    },
    {
      uid: 'day4-tannin-sna3@enology-studio',
      dtStart: formatIcsDateTimeLocal(baseDate, 4, 10),
      dtEnd: formatIcsDateTimeLocal(baseDate, 4, 11),
      summary: 'روز ۴: تانن فاز ۲ و تغذیه نهایی ارگانیک SNA-3 (SG ~ 1.060 / 1.057)',
      description: 'تزریق تانن قرمز فاز ۲ و Fermaid O صددرصد ارگانیک (ممنوعیت مطلق DAP).'
    },
    {
      uid: 'day6-pressing@enology-studio',
      dtStart: formatIcsDateTimeLocal(baseDate, 6, 10),
      dtEnd: formatIcsDateTimeLocal(baseDate, 6, 12),
      summary: 'روز ۶: نقطه طلایی پرسینگ و جداسازی شراب آب‌آزاد (SG = 1.008)',
      description: 'توقف پیژاژ، خنک‌سازی به ۲۲ درجه و جداسازی ۲۲۰L شراب آب‌آزاد از پرس سنگین.'
    },
    {
      uid: 'day10-racking1@enology-studio',
      dtStart: formatIcsDateTimeLocal(baseDate, 10, 10),
      dtEnd: formatIcsDateTimeLocal(baseDate, 10, 12),
      summary: 'روز ۱۰: سیفون اول از روی دُرد سنگین (Gross Lees) و تست مس',
      description: 'انتقال شراب خشک‌شده به ظروف لب‌به‌لب زیر قفل هوا پس از ۳۰ ساعت تهویه سرد.'
    },
    {
      uid: 'day11-bactiless-lock@enology-studio',
      dtStart: formatIcsDateTimeLocal(baseDate, 11, 10),
      dtEnd: formatIcsDateTimeLocal(baseDate, 11, 11),
      summary: 'روز ۱۱: قفل بیولوژیکی باکتی‌لس (Bactiless) + سولفیت KMS',
      description: 'تزریق چیتوسان باکتی‌لس با تعلیق جداگانه و سپس KMS برای حذف باکتری‌های مالولاکتیک.'
    },
    {
      uid: 'day21-bactiless-rack2@enology-studio',
      dtStart: formatIcsDateTimeLocal(baseDate, 21, 10),
      dtEnd: formatIcsDateTimeLocal(baseDate, 21, 12),
      summary: 'روز ۲۱: سیفون دوم و خروج کامل از روی رسوب باکتی‌لس (پایان پنجره ۱۰ روزه)',
      description: 'جدا کردن شراب شفاف از رسوب دیواره سلولی باکتی‌لس.'
    },
    {
      uid: 'day65-cold-stab@enology-studio',
      dtStart: formatIcsDateTimeLocal(baseDate, 65, 10),
      dtEnd: formatIcsDateTimeLocal(baseDate, 65, 11),
      summary: 'روز ۶۵: شروع تثبیت سرد تارتارات (۰ تا ۲ درجه) + بذرپاشی کرم تارتار',
      description: 'بذرپاشی کریستالی KHT برای جلوگیری از رسوب شیشه‌ای در بطری.'
    },
    {
      uid: 'day80-tartrate-rack@enology-studio',
      dtStart: formatIcsDateTimeLocal(baseDate, 80, 10),
      dtEnd: formatIcsDateTimeLocal(baseDate, 80, 12),
      summary: 'روز ۸۰: سیفون سرد از روی کریستال‌های بی‌تارتارات پتاسیم',
      description: 'سیفون در دمای سرد پیش از گرم شدن مجدد شراب.'
    },
    {
      uid: 'day98-prebottling-lab@enology-studio',
      dtStart: formatIcsDateTimeLocal(baseDate, 98, 10),
      dtEnd: formatIcsDateTimeLocal(baseDate, 98, 12),
      summary: 'روز ۹۸: تست کروماتوگرافی مالیک و تیتراسیون ریپر سولفیت آزاد پیش از بطری',
      description: 'تکمیل چک‌لیست دروازه ایمنی بطری‌گیری.'
    },
    {
      uid: 'day100-bottling@enology-studio',
      dtStart: formatIcsDateTimeLocal(baseDate, 100, 9),
      dtEnd: formatIcsDateTimeLocal(baseDate, 100, 14),
      summary: 'روز ۱۰۰: دروازه ایمنی بطری‌گیری، تزریق اسید اسکوربیک و چوب‌پنبه‌گذاری',
      description: 'بطری‌گیری نهایی پس از سبز شدن تمام آیتم‌های قفل ایمنی.'
    }
  ];

  const escapeIcs = (s: string) =>
    s
      .replace(/\\/g, '\\\\')
      .replace(/;/g, '\\;')
      .replace(/,/g, '\\,')
      .replace(/\n/g, '\\n');

  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Enology Studio//Rasha Sardasht Protocol//FA',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-TIMEZONE:Asia/Tehran'
  ];

  for (const ev of events) {
    lines.push('BEGIN:VEVENT');
    lines.push(`UID:${ev.uid}`);
    lines.push(`DTSTART;TZID=Asia/Tehran:${ev.dtStart}`);
    lines.push(`DTEND;TZID=Asia/Tehran:${ev.dtEnd}`);
    if (ev.rrule) {
      lines.push(ev.rrule);
    }
    lines.push(`SUMMARY:${escapeIcs(ev.summary)}`);
    lines.push(`DESCRIPTION:${escapeIcs(ev.description)}`);
    lines.push('BEGIN:VALARM');
    lines.push('TRIGGER:-PT15M');
    lines.push('ACTION:DISPLAY');
    lines.push(`DESCRIPTION:${escapeIcs(ev.summary)}`);
    lines.push('END:VALARM');
    lines.push('END:VEVENT');
  }

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

export const PhotoDiaryAndVintagePanel: React.FC<
  PhotoDiaryAndVintagePanelProps
> = ({ tankId = 'tank-a' }) => {
  const { activeBatch } = useEnologyUi();
  const [photos, setPhotos] = useState<PhotoDiaryEntry[]>([]);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [photoCategory, setPhotoCategory] = useState<
    'hydrometer' | 'cap' | 'color' | 'sediment'
  >('cap');
  const [photoNote, setPhotoNote] = useState<string>('');
  const [photoTags, setPhotoTags] = useState<string[]>([]);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);

  // Scheduled Tasting Checkpoints (Idea 15)
  const batchKeySuffix =
    activeBatch?.id && activeBatch.id !== 'batch-rasha-1403'
      ? `_${activeBatch.id}`
      : '';
  const [activeCheckpoint, setActiveCheckpoint] =
    useState<TastingCheckpointKey>('day_10');
  const [tastingsByCheckpoint, setTastingsByCheckpoint] = useLocalStorageState<
    Record<string, ScheduledTastingRecord>
  >(`enology_scheduled_tastings_v1${batchKeySuffix}`, {
    day_10: {
      checkpoint: 'day_10',
      appearance: 4,
      aroma: 5,
      palate: 4,
      quickTags: ['میوه‌ای و یاقوتی تمیز'],
      note: 'رنگ یاقوتی تیره، عطر آلبالو و انار تازه بدون بوی گوگرد.',
      updatedAtFa: '۱۴۰۵/۰۸/۰۵'
    }
  });

  // Historical Vintage Comparison State (Idea 15)
  const [historicalVintages, setHistoricalVintages] = useLocalStorageState<
    HistoricalVintageEntry[]
  >('enology_historical_vintages_v1', [
    {
      id: 'vintage-1402-ref',
      titleFa: 'وینتیج مرجع ۱۴۰۲ (رشه سردشت)',
      vintageYear: 1402,
      initialBrix: 21.8,
      phRangeText: '3.54 → 3.51',
      taGL: 6.6,
      yanMgL: 195,
      fermentationDays: 8,
      finalAbvPct: 13.6,
      totalAddedSo2MgL: 92,
      avgTastingScore: '4.5 / 5'
    }
  ]);

  // PWA 2nd-Visit Install Prompt & Calendar Start Date (Idea 16)
  const [visitCount, setVisitCount] = useLocalStorageState<number>(
    'enology_visit_count_v1',
    1
  );
  const [pwaDismissed, setPwaDismissed] = useLocalStorageState<boolean>(
    'enology_pwa_banner_dismissed_v1',
    false
  );
  const [calendarStartDate, setCalendarStartDate] = useState<string>(() =>
    new Date().toISOString().slice(0, 10)
  );

  const hasIncrementedRef = useRef(false);
  useEffect(() => {
    if (!hasIncrementedRef.current) {
      hasIncrementedRef.current = true;
      setVisitCount((c) => c + 1);
    }
    getAllPhotosFromIdb().then((list) => setPhotos(list));
  }, []);

  const tankLogs = useMemo(
    () =>
      sortFermentationLogs(
        enologyDb
          .getLogs(tankId, false, activeBatch?.id)
          .filter((l) => !l.isBenchmark)
      ),
    [tankId, activeBatch?.id]
  );
  const latestLog = tankLogs[tankLogs.length - 1];

  // Check if active fermentation needs Pigeage reminder
  const showPigeageReminder = useMemo(() => {
    if (tankId === 'tank-rose') return false;
    if (!latestLog) return true;
    if (latestLog.sg <= 1.005) return false;
    if (!latestLog.pigeageDone) return true;
    if (
      latestLog.timestampMs &&
      Date.now() - latestLog.timestampMs > 6 * 3600 * 1000
    ) {
      return true;
    }
    return false;
  }, [tankId, latestLog]);

  const displayedPhotos = useMemo(
    () =>
      photos.filter(
        (p) =>
          p.tankId === tankId &&
          (!activeBatch?.id || !p.batchId || p.batchId === activeBatch.id)
      ),
    [photos, tankId, activeBatch?.id]
  );

  const currentTasting = tastingsByCheckpoint[activeCheckpoint] ?? {
    checkpoint: activeCheckpoint,
    appearance: 4,
    aroma: 4,
    palate: 4,
    quickTags: [],
    note: '',
    updatedAtFa: 'ثبت نشده'
  };

  const updateCurrentTasting = (patch: Partial<ScheduledTastingRecord>) => {
    const nowFa = getCurrentPersianDateTimeStr().split(' ')[0] || '۱۴۰۵/۰۷/۲۶';
    setTastingsByCheckpoint({
      ...tastingsByCheckpoint,
      [activeCheckpoint]: {
        ...currentTasting,
        ...patch,
        updatedAtFa: nowFa
      }
    });
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoError(null);
    if (!file.type.startsWith('image/') || file.size > 10 * 1024 * 1024) {
      setPhotoError('فقط فایل تصویری تا حداکثر ۱۰ مگابایت مجاز است.');
      e.target.value = '';
      return;
    }
    setIsCompressing(true);
    try {
      const { dataUrl, sizeKb } = await compressImageToJpeg1280(file);
      const dateFa = getCurrentPersianDateTimeStr();
      const newPhoto: PhotoDiaryEntry = {
        id: `photo-${Date.now()}`,
        batchId:
          activeBatch?.id ??
          (tankId === 'tank-rose' ? 'batch-rose-1403' : 'batch-rasha-1403'),
        tankId,
        timestamp: dateFa,
        dayNumber: latestLog?.dayNumber ?? 1,
        category: photoCategory,
        dataUrlJpeg: dataUrl,
        sizeKb,
        quickTags: photoTags,
        note: photoNote.trim() || 'ثبت تصویری وضعیت مخزن'
      };
      const res = await savePhotoToIdb(newPhoto);
      if (res.success) {
        setPhotos((prev) => [newPhoto, ...prev]);
        setPhotoNote('');
        setPhotoTags([]);
      } else {
        setPhotoError(res.error || 'خطا در ذخیره‌سازی تصویر.');
      }
    } catch {
      setPhotoError('خطا در پردازش یا فشرده‌سازی تصویر.');
    } finally {
      setIsCompressing(false);
      e.target.value = '';
    }
  };

  const handleDeletePhoto = async (id: string) => {
    const res = await deletePhotoFromIdb(id);
    if (res.success) {
      setPhotos((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleExportPhotosJson = () => {
    const payload = JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        photoCount: photos.length,
        photos
      },
      null,
      2
    );
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `enology-photo-archive-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadIcs = () => {
    const icsContent = exportWorkshopCalendarICS(calendarStartDate);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rasha-winery-schedule.ics';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Compute current active batch summary for Side-by-Side Vintage Comparison
  const currentBatchMetrics = useMemo(() => {
    const batches = enologyDb.getBatches();
    const b = activeBatch ?? batches[0];
    const allTankLogs = sortFermentationLogs(
      enologyDb.getLogs(tankId, false, b?.id).filter((l) => !l.isBenchmark)
    );
    const first = allTankLogs[0];
    const last = allTankLogs[allTankLogs.length - 1];
    const initSG = b?.initialSG ?? first?.sg ?? 1.092;
    const initBx = b?.initialBrix ?? first?.brix ?? 22.0;
    const abv = last ? calculateAlcoholByVolume(initSG, last.sg) : 13.8;
    const so2Ledger = enologyDb.getCumulativeSO2Ledger(
      tankId,
      undefined,
      undefined,
      undefined,
      false,
      b?.id
    );
    const tastingValues = Object.values(tastingsByCheckpoint);
    const avgScore =
      tastingValues.length > 0
        ? (
            tastingValues.reduce(
              (acc, t) => acc + (t.appearance + t.aroma + t.palate) / 3,
              0
            ) / tastingValues.length
          ).toFixed(1)
        : '4.3';

    return {
      titleFa: b?.name ?? 'بچ فعلی رشه سردشت (۱۴۰۳/۱۴۰۵)',
      vintageYear: b?.vintageYear ?? 1403,
      initialBrix: initBx,
      phRangeText: `${first?.ph ?? 3.52} → ${last?.ph ?? 3.52}`,
      taGL: last?.ta ?? 6.7,
      yanMgL: 252,
      fermentationDays: last?.dayNumber ?? 8,
      finalAbvPct: abv,
      totalAddedSo2MgL: so2Ledger.addedFromKmsMgL,
      avgTastingScore: `${avgScore} / 5`
    };
  }, [tankId, activeBatch, tastingsByCheckpoint]);

  const [showVintagePassport, setShowVintagePassport] = useState(false);
  const [passportCopied, setPassportCopied] = useState(false);

  const radarData = useMemo(
    () =>
      computeSensoryRadarPolygonPoints({
        aroma: currentTasting.aroma ?? 4,
        acidity: currentTasting.acidity ?? 4,
        tannin: currentTasting.tannin ?? (tankId === 'tank-rose' ? 2 : 4),
        body: currentTasting.body ?? 4,
        balance: currentTasting.balance ?? 4
      }),
    [currentTasting, tankId]
  );

  const vintagePassport = useMemo(() => {
    const batches = enologyDb.getBatches();
    const b = activeBatch ?? batches[0];
    const logs = enologyDb.getLogs(tankId, false, b?.id);
    const additions = enologyDb.getAdditions(tankId, false, b?.id);
    return buildVintagePassportSummary({
      tankId,
      batchNameFa: b?.name ?? currentBatchMetrics.titleFa,
      vintageYear: b?.vintageYear ?? currentBatchMetrics.vintageYear,
      initialSG: b?.initialSG,
      logs,
      additions,
      totalSo2AddedMgL: currentBatchMetrics.totalAddedSo2MgL,
      avgScoreOutOf5: currentBatchMetrics.avgTastingScore,
      wineColorHex: currentTasting.wineColorHex,
      wineColorLabelFa: currentTasting.wineColorLabelFa
    });
  }, [tankId, activeBatch, currentBatchMetrics, currentTasting]);

  return (
    <div className="space-y-4 font-['Vazirmatn',sans-serif]">
      {/* =================================================================== */}
      {/* IDEA 16: PWA 2ND-VISIT INSTALL PROMPT & IN-APP REMINDER + .ICS      */}
      {/* =================================================================== */}
      {visitCount >= 2 && !pwaDismissed && (
        <div className="bg-surface text-ink border border-line rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5 text-xs">
            <Smartphone className="w-5 h-5 text-ink-soft shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-ink">
                نصب روی صفحهٔ اصلی گوشی (PWA): سرداب اغلب آنتن ندارد؛ برنامه را روی صفحهٔ اصلی نصب کنید تا ۱۰۰٪ آفلاین کار کند.
              </div>
              <p className="text-ink-soft mt-0.5">
                در آیفون دکمه Share ← Add to Home Screen و در اندروید گزینه Install App را بزنید تا تمام محاسبه‌گرها و دفتر ثبت بدون اینترنت باز شوند.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setPwaDismissed(true)}
            className="px-3 py-1.5 rounded-xl bg-paper border border-line hover:bg-stone-200/60 text-xs font-bold text-ink shrink-0 cursor-pointer"
          >
            متوجه شدم
          </button>
        </div>
      )}

      {/* Honest In-App Reminder Banner & .ics Workshop Calendar Exporter (Idea 16) */}
      <div className="bg-surface text-ink border border-line rounded-xl p-4 space-y-3">
        {showPigeageReminder && (
          <div className="bg-amber-50/70 border border-warn/40 rounded-xl p-3 flex items-start gap-2.5 text-xs text-ink">
            <Bell className="w-4 h-4 text-warn shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-ink">
                یادآور داخل برنامه: پیژاژ نوبت عصر/اخیر هنوز ثبت نشده است.
              </div>
              <p className="mt-0.5 leading-relaxed text-ink-soft">
                یادآوری صادقانه: مرورگرهای وب بدون سرور نمی‌توانند هنگام بسته بودن برنامه به طور مطمئن اعلان محلی زمان‌بندی کنند؛ برای زنگ خوردن حتمی گوشی، خروجی تقویم (.ics) زیر را دانلود و به تقویم گوشی اضافه کنید.
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs">
            <Calendar className="w-4 h-4 text-ink-soft shrink-0" />
            <div>
              <div className="font-bold text-ink">
                تولید فایل تقویم استاندارد کارگاه (.ics) با زنگ هشدار گوشی (Apple / Google Calendar)
              </div>
              <div className="text-xs text-ink-soft">
                شامل ۳ نوبت پیژاژ روزانه (۰۸:۰۰، ۱۵:۰۰، ۲۲:۰۰) + ۱۱ نقطه حیاتی SNA، پرسینگ، باکتی‌لس، سرمازدایی و بطری‌گیری
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <input
              type="date"
              value={calendarStartDate}
              onChange={(e) => setCalendarStartDate(e.target.value)}
              className="bg-paper border border-line rounded-xl px-2.5 py-1.5 text-xs font-mono text-ink"
            />
            <button
              type="button"
              onClick={handleDownloadIcs}
              className="px-3.5 py-2 rounded-xl bg-wine text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>دانلود تقویم کارگاه (.ics)</span>
            </button>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* IDEA 15 PART 1: SCHEDULED TASTING CHECKPOINTS (1-5 SCALES)          */}
      {/* =================================================================== */}
      <div className="bg-surface border border-line rounded-xl p-4 space-y-3 shadow-xs text-ink">
        <div className="flex items-center justify-between gap-2 flex-wrap border-b border-line pb-2.5">
          <div className="flex items-center gap-2">
            <Wine className="w-4 h-4 text-ink-soft" />
            <h4 className="text-xs sm:text-sm font-bold text-ink">
              قالب چشایی در نقاط ثابت پروتکل (مقیاس ساده ۱ تا ۵)
            </h4>
          </div>
          <span className="text-xs text-ink-soft">
            آخرین بروزرسانی این ایستگاه: {currentTasting.updatedAtFa}
          </span>
        </div>

        {/* 6 Checkpoint Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {TASTING_CHECKPOINTS.map((cp) => (
            <button
              key={cp.key}
              type="button"
              onClick={() => setActiveCheckpoint(cp.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap border cursor-pointer ${
                activeCheckpoint === cp.key
                  ? 'bg-wine text-white border-wine'
                  : 'bg-paper text-ink border-line hover:bg-stone-200/60'
              }`}
            >
              {cp.labelFa}
            </button>
          ))}
        </div>

        {/* 3 Simple 1-to-5 Scales: Appearance, Aroma, Palate */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {(
            [
              ['appearance', 'ظاهر و شفافیت: ۱ تا ۵', currentTasting.appearance],
              ['aroma', 'بو و آروما: ۱ تا ۵', currentTasting.aroma],
              ['palate', 'دهان و تانن: ۱ تا ۵', currentTasting.palate]
            ] as const
          ).map(([fieldKey, labelFa, val]) => (
            <div
              key={fieldKey}
              className="bg-paper border border-line rounded-xl p-3 space-y-2"
            >
              <div className="flex items-center justify-between font-bold text-ink">
                <span>{labelFa}</span>
                <span className="font-mono font-bold text-ink">
                  {val} / 5
                </span>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() =>
                      updateCurrentTasting({ [fieldKey]: star } as Partial<ScheduledTastingRecord>)
                    }
                    className={`flex-1 py-1.5 rounded-lg font-mono font-bold text-xs border cursor-pointer flex items-center justify-center gap-0.5 ${
                      val >= star
                        ? 'bg-wine text-white border-wine'
                        : 'bg-surface text-ink-soft border-line'
                    }`}
                  >
                    <Star className="w-3 h-3 fill-current" />
                    <span>{star}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 5-Axis Sensory Radar & 10-Swatch Wine Color Studio */}
        <div
          data-testid="sensory-radar-studio"
          className="bg-paper border border-line rounded-xl p-3.5 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center"
        >
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-ink text-xs flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-wine" />
                <span>پروفایل ۵ محوری حسی و طیف رنگ استاندارد شراب</span>
              </span>
              <span className="text-xs font-mono text-ink-soft">
                {currentTasting.wineColorLabelFa ??
                  (tankId === 'tank-rose'
                    ? 'یاقوتی روشن (Saignée)'
                    : 'یاقوتی تیره (رشه سردشت)')}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {(
                [
                  ['acidity', 'اسیدیته (Acidity)', currentTasting.acidity ?? 4],
                  [
                    'tannin',
                    'تانن (Tannin)',
                    currentTasting.tannin ?? (tankId === 'tank-rose' ? 2 : 4)
                  ],
                  ['body', 'بادی و غلظت (Body)', currentTasting.body ?? 4],
                  [
                    'balance',
                    'تعادل و پایان (Balance)',
                    currentTasting.balance ?? 4
                  ]
                ] as const
              ).map(([axisField, axisLabel, axisVal]) => (
                <div
                  key={axisField}
                  className="bg-surface border border-line rounded-lg p-2 flex items-center justify-between gap-2"
                >
                  <span className="text-xs font-bold text-ink">{axisLabel}</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() =>
                          updateCurrentTasting({
                            [axisField]: num
                          } as Partial<ScheduledTastingRecord>)
                        }
                        className={`w-6 h-6 rounded font-mono text-xs font-bold border cursor-pointer ${
                          axisVal >= num
                            ? 'bg-wine text-white border-wine'
                            : 'bg-paper text-ink-soft border-line'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-1.5">
              <div className="text-xs font-bold text-ink-soft">
                انتخاب طیف رنگ استاندارد شراب (۱۰ رنگ مرجع OIV):
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {STANDARD_WINE_COLOR_SWATCHES.map((swatch) => {
                  const selectedHex =
                    currentTasting.wineColorHex ??
                    (tankId === 'tank-rose' ? '#B8293D' : '#580F24');
                  const isSelected = selectedHex === swatch.hex;
                  return (
                    <button
                      key={swatch.id}
                      type="button"
                      title={swatch.labelFa}
                      data-testid={`wine-color-swatch-${swatch.id}`}
                      onClick={() =>
                        updateCurrentTasting({
                          wineColorHex: swatch.hex,
                          wineColorLabelFa: swatch.labelFa
                        })
                      }
                      className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-xs cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-surface border-wine text-ink font-bold shadow-xs'
                          : 'bg-surface/60 border-line text-ink-soft hover:border-ink-soft'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-white/40 shrink-0"
                        style={{ backgroundColor: swatch.hex }}
                      />
                      <span>{swatch.labelFa}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col items-center justify-center bg-surface border border-line rounded-xl p-2">
            <svg
              viewBox="0 0 220 220"
              className="w-48 h-48 overflow-visible"
              aria-label="نمودار راداری ۵ محوری چشایی"
            >
              {[0.2, 0.6, 1].map((scale) => {
                const ring = computeSensoryRadarPolygonPoints(
                  {
                    aroma: 5 * scale,
                    acidity: 5 * scale,
                    tannin: 5 * scale,
                    body: 5 * scale,
                    balance: 5 * scale
                  },
                  110,
                  110,
                  78
                );
                return (
                  <polygon
                    key={scale}
                    points={ring.polygonPoints}
                    fill="none"
                    stroke="currentColor"
                    className="text-line"
                    strokeWidth="1"
                    strokeDasharray={scale < 1 ? '2 2' : undefined}
                  />
                );
              })}
              {radarData.vertices.map((v) => {
                const outer = computeSensoryRadarPolygonPoints(
                  { aroma: 5, acidity: 5, tannin: 5, body: 5, balance: 5 },
                  110,
                  110,
                  78
                ).vertices.find((ov) => ov.axisKey === v.axisKey);
                return (
                  <g key={v.axisKey}>
                    <line
                      x1={110}
                      y1={110}
                      x2={outer?.x ?? v.x}
                      y2={outer?.y ?? v.y}
                      stroke="currentColor"
                      className="text-line"
                      strokeWidth="1"
                    />
                    <text
                      x={v.labelX}
                      y={v.labelY}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-current text-ink text-xs font-bold"
                    >
                      {v.labelFa}
                    </text>
                  </g>
                );
              })}
              <polygon
                data-testid="sensory-radar-polygon"
                points={radarData.polygonPoints}
                fill={
                  currentTasting.wineColorHex ??
                  (tankId === 'tank-rose' ? '#B8293D' : '#580F24')
                }
                fillOpacity={0.28}
                stroke={
                  currentTasting.wineColorHex ??
                  (tankId === 'tank-rose' ? '#B8293D' : '#580F24')
                }
                strokeWidth="2"
              />
              {radarData.vertices.map((v) => (
                <circle
                  key={`dot-${v.axisKey}`}
                  cx={v.x}
                  cy={v.y}
                  r="3.5"
                  fill={
                    currentTasting.wineColorHex ??
                    (tankId === 'tank-rose' ? '#B8293D' : '#580F24')
                  }
                />
              ))}
            </svg>
          </div>
        </div>

        {/* Quick Sensory Tags & Note for Checkpoint */}
        <div className="flex flex-wrap gap-1.5">
          {QUICK_SENSORY_FAULT_TAGS.map((tag) => {
            const active = currentTasting.quickTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  const next = active
                    ? currentTasting.quickTags.filter((t) => t !== tag)
                    : [...currentTasting.quickTags, tag];
                  updateCurrentTasting({ quickTags: next });
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold border cursor-pointer ${
                  active
                    ? 'bg-wine text-white border-wine'
                    : 'bg-paper text-ink-soft border-line'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>

        <input
          type="text"
          value={currentTasting.note}
          onChange={(e) => updateCurrentTasting({ note: e.target.value })}
          placeholder="یادداشت چشایی این ایستگاه (مثلاً تعادل اسید، بافت تانن، عطر میوه)..."
          className="w-full bg-paper border border-line rounded-xl px-3 py-2 text-xs text-ink"
        />
      </div>

      {/* =================================================================== */}
      {/* IDEA 15 PART 2: INDEXEDDB PHOTO DIARY (1280px JPEG 0.7)             */}
      {/* =================================================================== */}
      <div className="bg-surface border border-line rounded-xl p-4 space-y-3 shadow-xs text-ink">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line pb-2.5">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-ink-soft" />
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-ink">
                آلبوم تصویری مخزن در IndexedDB (فشرده‌سازی خودکار 1280px JPEG 0.7)
              </h4>
              <p className="text-xs text-ink-soft">
                عکس‌ها خارج از سقف ۵ مگابایتی localStorage در IndexedDB ذخیره می‌شوند تا حافظهٔ اصلی هرگز پر نشود.
              </p>
            </div>
          </div>

          {displayedPhotos.length > 0 && (
            <button
              type="button"
              onClick={handleExportPhotosJson}
              className="px-3 py-1.5 rounded-xl bg-paper border border-line hover:bg-stone-200/60 text-ink text-xs font-bold flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <Download className="w-3.5 h-3.5" />
              <span>خروجی آرشیو عکس‌ها (JSON مجزا)</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs items-end">
          <div>
            <label className="block font-bold text-ink mb-1">
              دسته‌بندی عکس:
            </label>
            <select
              value={photoCategory}
              onChange={(e) =>
                setPhotoCategory(
                  e.target.value as 'hydrometer' | 'cap' | 'color' | 'sediment'
                )
              }
              className="w-full bg-paper border border-line rounded-xl px-3 py-2 font-bold text-ink"
            >
              <option value="cap">وضعیت کلاهک و فوم تخمیر</option>
              <option value="hydrometer">قرائت منیسک هیدرومتر</option>
              <option value="color">رنگ و شفافیت در لیوان</option>
              <option value="sediment">ضخامت دُرد و کریستال تارتارات</option>
            </select>
          </div>
          <div>
            <label className="block font-bold text-ink mb-1">
              توضیح کوتاه عکس:
            </label>
            <input
              type="text"
              value={photoNote}
              onChange={(e) => setPhotoNote(e.target.value)}
              placeholder="مثلاً کلاهک روز ۳ پیش از پیژاژ..."
              className="w-full bg-paper border border-line rounded-xl px-3 py-2 text-ink"
            />
          </div>
          <label className="px-4 py-2 rounded-xl bg-wine text-white font-bold flex items-center justify-center gap-2 cursor-pointer">
            <Camera className="w-4 h-4" />
            <span>
              {isCompressing
                ? 'در حال فشرده‌سازی 1280px...'
                : 'افزودن عکس از دوربین / گالری'}
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </label>
        </div>

        {photoError && (
          <div className="bg-red-50 border border-danger text-ink rounded-xl p-2.5 text-xs font-bold">
            {photoError}
          </div>
        )}

        {displayedPhotos.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {displayedPhotos.map((ph) => (
              <div
                key={ph.id}
                className="border border-line rounded-xl overflow-hidden bg-paper text-xs"
              >
                <img
                  src={ph.dataUrlJpeg}
                  alt={ph.note}
                  className="w-full h-28 object-cover"
                />
                <div className="p-2 space-y-1">
                  <div className="font-bold text-ink truncate">
                    {ph.note}
                  </div>
                  <div className="flex items-center justify-between text-ink-soft font-mono">
                    <span>روز {ph.dayNumber}</span>
                    <span>{ph.sizeKb} KB</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeletePhoto(ph.id)}
                    className="text-danger font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>حذف</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* =================================================================== */}
      {/* IDEA 15 PART 3: SIDE-BY-SIDE VINTAGE COMPARISON                     */}
      {/* =================================================================== */}
      <div className="bg-surface border border-line rounded-xl p-4 space-y-3 shadow-xs text-ink">
        <div className="flex items-center justify-between gap-2 flex-wrap border-b border-line pb-2.5">
          <div className="flex items-center gap-2">
            <GitCompare className="w-4 h-4 text-ink-soft" />
            <h4 className="text-xs sm:text-sm font-bold text-ink">
              مقایسهٔ کنار هم سال‌ها و بچ‌ها (Vintage Comparison)
            </h4>
          </div>
          <button
            type="button"
            onClick={() =>
              setHistoricalVintages((prev) => [
                ...prev,
                {
                  id: `vintage-${Date.now()}`,
                  titleFa: `بچ آرشیوی ${1401 + prev.length}`,
                  vintageYear: 1401 + prev.length,
                  initialBrix: 22.2,
                  phRangeText: '3.50 → 3.48',
                  taGL: 6.9,
                  yanMgL: 210,
                  fermentationDays: 9,
                  finalAbvPct: 13.9,
                  totalAddedSo2MgL: 88,
                  avgTastingScore: '4.6 / 5'
                }
              ])
            }
            className="px-3 py-1.5 rounded-lg bg-paper border border-line hover:bg-stone-200/60 text-ink text-xs font-bold flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>افزودن ستون وینتیج مرجع</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs border-collapse">
            <thead>
              <tr className="bg-stone-100 text-stone-700 border-b border-stone-200">
                <th className="p-2.5 font-bold">شاخص کلیدی</th>
                <th className="p-2.5 font-bold text-rose-900 bg-rose-50/60">
                  {currentBatchMetrics.titleFa} (بچ فعال)
                </th>
                {historicalVintages.map((hv) => (
                  <th key={hv.id} className="p-2.5 font-bold">
                    {hv.titleFa}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              <tr>
                <td className="p-2 font-bold text-stone-700">بریکس اولیه (°Bx)</td>
                <td className="p-2 font-mono font-bold bg-rose-50/40">
                  {currentBatchMetrics.initialBrix} °Bx
                </td>
                {historicalVintages.map((hv) => (
                  <td key={hv.id} className="p-2 font-mono">
                    {hv.initialBrix} °Bx
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-2 font-bold text-stone-700">pH اولیه ← نهایی</td>
                <td className="p-2 font-mono font-bold bg-rose-50/40">
                  {currentBatchMetrics.phRangeText}
                </td>
                {historicalVintages.map((hv) => (
                  <td key={hv.id} className="p-2 font-mono">
                    {hv.phRangeText}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-2 font-bold text-stone-700">اسیدیته کل (TA g/L)</td>
                <td className="p-2 font-mono font-bold bg-rose-50/40">
                  {currentBatchMetrics.taGL} g/L
                </td>
                {historicalVintages.map((hv) => (
                  <td key={hv.id} className="p-2 font-mono">
                    {hv.taGL} g/L
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-2 font-bold text-stone-700">نیتروژن YAN (mg/L)</td>
                <td className="p-2 font-mono font-bold bg-rose-50/40">
                  {currentBatchMetrics.yanMgL} mg/L
                </td>
                {historicalVintages.map((hv) => (
                  <td key={hv.id} className="p-2 font-mono">
                    {hv.yanMgL} mg/L
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-2 font-bold text-stone-700">مدت تخمیر (روز)</td>
                <td className="p-2 font-mono font-bold bg-rose-50/40">
                  {currentBatchMetrics.fermentationDays} روز
                </td>
                {historicalVintages.map((hv) => (
                  <td key={hv.id} className="p-2 font-mono">
                    {hv.fermentationDays} روز
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-2 font-bold text-stone-700">الکل نهایی (% ABV)</td>
                <td className="p-2 font-mono font-bold bg-rose-50/40">
                  {currentBatchMetrics.finalAbvPct.toFixed(1)}%
                </td>
                {historicalVintages.map((hv) => (
                  <td key={hv.id} className="p-2 font-mono">
                    {hv.finalAbvPct.toFixed(1)}%
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-2 font-bold text-stone-700">
                  جمع SO₂ افزوده‌شده (mg/L)
                </td>
                <td className="p-2 font-mono font-bold bg-rose-50/40">
                  {currentBatchMetrics.totalAddedSo2MgL} mg/L
                </td>
                {historicalVintages.map((hv) => (
                  <td key={hv.id} className="p-2 font-mono">
                    {hv.totalAddedSo2MgL} mg/L
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-2 font-bold text-stone-700">
                  میانگین امتیاز چشایی (از ۵)
                </td>
                <td className="p-2 font-mono font-bold text-emerald-800 bg-rose-50/40">
                  {currentBatchMetrics.avgTastingScore}
                </td>
                {historicalVintages.map((hv) => (
                  <td key={hv.id} className="p-2 font-mono font-bold">
                    {hv.avgTastingScore}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* =================================================================== */}
      {/* IDEA 7: LUXURY VINTAGE PASSPORT & BOTTLE INFOGRAPHIC CARD GENERATOR */}
      {/* =================================================================== */}
      <div
        data-testid="vintage-passport-section"
        className="bg-surface border border-line rounded-2xl p-4 space-y-4 text-xs"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line pb-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-wine" />
            <div>
              <h4 className="font-bold text-ink text-sm">
                شناسنامه رسمی وینتج و کارت مشخصات بطری (Vintage Passport)
              </h4>
              <p className="text-xs text-ink-soft">
                خلاصه جامع آزمایشگاهی، دوزینگ SO2، بلوغ بلوط و پروفایل حسی جهت آرشیو یا چاپ پشت بطری
              </p>
            </div>
          </div>
          <button
            type="button"
            data-testid="toggle-vintage-passport-btn"
            onClick={() => setShowVintagePassport((prev) => !prev)}
            className="px-3.5 py-2 rounded-xl font-bold bg-wine text-white hover:opacity-95 cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Award className="w-4 h-4" />
            <span>
              {showVintagePassport
                ? 'بستن شناسنامه بطری'
                : 'مشاهده و چاپ شناسنامه بطری'}
            </span>
          </button>
        </div>

        {showVintagePassport && (
          <div
            data-testid="vintage-passport-card"
            className="bg-paper border-2 border-wine/40 rounded-2xl p-5 space-y-4 shadow-sm"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-3">
              <div className="space-y-1">
                <div className="text-xs font-mono tracking-widest text-wine font-bold uppercase">
                  DOMAINE RASHA SARDASHT — SOP-OENO-1405-RS400
                </div>
                <h5 className="text-base font-bold text-ink">
                  {vintagePassport.batchNameFa} — وینتج {vintagePassport.vintageYear}
                </h5>
                <div className="text-xs text-ink-soft">
                  {vintagePassport.varietyAndOriginFa} | {vintagePassport.tankLabelFa}
                </div>
              </div>
              <div className="flex items-center gap-2 bg-surface border border-line rounded-xl px-3 py-2 self-start">
                <span
                  className="w-5 h-5 rounded-full border border-white/50 shrink-0"
                  style={{ backgroundColor: vintagePassport.wineColorHex }}
                />
                <div>
                  <div className="text-xs text-ink-soft">طیف رنگ ثبت‌شده</div>
                  <div className="text-xs font-bold text-ink">
                    {vintagePassport.wineColorLabelFa}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
              <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="bg-surface border border-line rounded-xl p-2.5">
                  <div className="text-xs text-ink-soft">چگالی اولیه (OG)</div>
                  <div className="font-mono font-bold text-sm text-ink ltr-metric">
                    SG {vintagePassport.initialSG}
                  </div>
                </div>
                <div className="bg-surface border border-line rounded-xl p-2.5">
                  <div className="text-xs text-ink-soft">چگالی نهایی (FG)</div>
                  <div className="font-mono font-bold text-sm text-ink ltr-metric">
                    SG {vintagePassport.finalSG}
                  </div>
                </div>
                <div className="bg-surface border border-line rounded-xl p-2.5">
                  <div className="text-xs text-ink-soft">الکل حجمی (ABV)</div>
                  <div className="font-mono font-bold text-sm text-wine ltr-metric">
                    {vintagePassport.abvPct}% vol
                  </div>
                </div>
                <div className="bg-surface border border-line rounded-xl p-2.5">
                  <div className="text-xs text-ink-soft">طول دوره تخمیر</div>
                  <div className="font-mono font-bold text-sm text-ink">
                    {vintagePassport.fermentationDays} روز
                  </div>
                </div>
                <div className="bg-surface border border-line rounded-xl p-2.5">
                  <div className="text-xs text-ink-soft">تعادل اسیدی (pH / TA)</div>
                  <div className="font-mono font-bold text-sm text-ink ltr-metric">
                    pH {vintagePassport.finalPh} | {vintagePassport.finalTaGL} g/L
                  </div>
                </div>
                <div className="bg-surface border border-line rounded-xl p-2.5">
                  <div className="text-xs text-ink-soft">کل SO2 افزوده‌شده</div>
                  <div className="font-mono font-bold text-sm text-ink ltr-metric">
                    {vintagePassport.totalSo2AddedMgL} mg/L
                  </div>
                </div>
                <div className="bg-surface border border-line rounded-xl p-2.5">
                  <div className="text-xs text-ink-soft">رژیم بلوغ و بلوط</div>
                  <div className="font-bold text-xs text-ink">
                    {vintagePassport.oakProfileFa}
                  </div>
                </div>
                <div className="bg-surface border border-line rounded-xl p-2.5">
                  <div className="text-xs text-ink-soft">تعداد بطری ۷۵۰mL</div>
                  <div className="font-mono font-bold text-sm text-ok">
                    {vintagePassport.bottles750mlCount} بطری
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col items-center justify-center bg-surface border border-line rounded-xl p-3">
                <div className="text-xs font-bold text-ink mb-1">
                  امضای حسی ۵ محوری (امتیاز کل: {vintagePassport.sensoryScoreOutOf5})
                </div>
                <svg
                  viewBox="0 0 220 220"
                  className="w-36 h-36 overflow-visible"
                  aria-label="پیش‌نمایش رادار حسی شناسنامه"
                >
                  <polygon
                    points={
                      computeSensoryRadarPolygonPoints(
                        { aroma: 5, acidity: 5, tannin: 5, body: 5, balance: 5 },
                        110,
                        110,
                        78
                      ).polygonPoints
                    }
                    fill="none"
                    stroke="currentColor"
                    className="text-line"
                    strokeWidth="1"
                  />
                  <polygon
                    points={radarData.polygonPoints}
                    fill={vintagePassport.wineColorHex}
                    fillOpacity={0.32}
                    stroke={vintagePassport.wineColorHex}
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-line">
              <button
                type="button"
                onClick={() => {
                  const summaryText = [
                    `شناسنامه وینتج: ${vintagePassport.batchNameFa} (${vintagePassport.vintageYear})`,
                    `مخزن: ${vintagePassport.tankLabelFa}`,
                    `SG اولیه: ${vintagePassport.initialSG} | SG نهایی: ${vintagePassport.finalSG} | الکل: ${vintagePassport.abvPct}%`,
                    `pH نهایی: ${vintagePassport.finalPh} | اسیدیته کل: ${vintagePassport.finalTaGL} g/L`,
                    `کل SO2 افزوده‌شده: ${vintagePassport.totalSo2AddedMgL} mg/L | بلوط: ${vintagePassport.oakProfileFa}`,
                    `رنگ: ${vintagePassport.wineColorLabelFa} | تعداد بطری: ${vintagePassport.bottles750mlCount} عدد`
                  ].join('\n');
                  navigator.clipboard?.writeText(summaryText);
                  setPassportCopied(true);
                  setTimeout(() => setPassportCopied(false), 2500);
                }}
                className="px-3 py-1.5 rounded-xl font-bold bg-surface border border-line text-ink hover:bg-paper cursor-pointer flex items-center gap-1.5"
              >
                {passportCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-ok" />
                    <span>کپی شد</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>کپی متن شناسنامه</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-3.5 py-1.5 rounded-xl font-bold bg-wine text-white hover:opacity-95 cursor-pointer flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>چاپ شناسنامه (Print)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
