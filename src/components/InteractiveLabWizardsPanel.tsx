import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FlaskConical,
  Pause,
  Play,
  RotateCcw,
  Save,
  Timer
} from 'lucide-react';
import type { LabAnalysisRecord, TankId } from '../types/index.ts';
import { enologyDb } from '../db/enologyDatabase.ts';
import {
  calculateFreeSO2Ripper,
  calculateMolecularSO2,
  calculateTitratableAcidity,
  correctHydrometer,
  getContinuousTargetFreeSO2ByPH
} from '../utils/enologyUtils.ts';
import { useEnologyUi } from '../context/EnologyUiContext.tsx';
import { getCurrentPersianDateTimeStr } from '../utils/persianDate.ts';

export interface InteractiveLabWizardsPanelProps {
  onAnalysisSaved?: (record: LabAnalysisRecord) => void;
  selectedWizardOverride?: 'ripper_so2' | 'ph_meter' | 'ta_titration' | 'mlf_chromatography' | 'hydrometer_temp';
}

type LabWizardId =
  | 'ripper_so2'
  | 'ph_meter'
  | 'ta_titration'
  | 'mlf_chromatography'
  | 'hydrometer_temp';

const WIZARD_TABS: ReadonlyArray<{
  id: LabWizardId;
  labelFa: string;
  totalSteps: number;
}> = [
  { id: 'ripper_so2', labelFa: '۱. ویزارد تیتراسیون SO₂ آزاد (ریپر)', totalSteps: 5 },
  { id: 'ph_meter', labelFa: '۲. ویزارد کالیبراسیون و سنجش pH', totalSteps: 4 },
  { id: 'ta_titration', labelFa: '۳. ویزارد اسیدیته کل (TA)', totalSteps: 4 },
  {
    id: 'mlf_chromatography',
    labelFa: '۴. ویزارد کروماتوگرافی مالیک (پیش از بطری)',
    totalSteps: 4
  },
  {
    id: 'hydrometer_temp',
    labelFa: '۵. ویزارد اصلاح دمای هیدرومتر',
    totalSteps: 3
  }
];

function formatFaDate(): string {
  return getCurrentPersianDateTimeStr();
}

export const InteractiveLabWizardsPanel: React.FC<
  InteractiveLabWizardsPanelProps
> = ({ onAnalysisSaved, selectedWizardOverride }) => {
  const { activeBatch, effectiveSingleTankId, tankCount, notifyDataChanged } =
    useEnologyUi();

  const [activeWizard, setActiveWizard] = useState<LabWizardId>(
    selectedWizardOverride ?? 'ripper_so2'
  );
  const [tankId, setTankId] = useState<TankId>(
    effectiveSingleTankId ?? 'tank-a'
  );
  const [step, setStep] = useState<number>(1);
  const [savedBannerText, setSavedBannerText] = useState<string | null>(null);

  useEffect(() => {
    if (tankCount === 1 && effectiveSingleTankId === 'tank-b') {
      setTankId('tank-a');
      setRipperPH(3.52);
    } else if (effectiveSingleTankId) {
      setTankId(effectiveSingleTankId);
      setRipperPH(effectiveSingleTankId === 'tank-rose' ? 3.32 : 3.52);
    }
  }, [effectiveSingleTankId, tankCount]);

  useEffect(() => {
    if (selectedWizardOverride) {
      setActiveWizard(selectedWizardOverride);
      setStep(1);
    }
  }, [selectedWizardOverride]);

  // Ripper SO2 State
  const [hasAscorbic, setHasAscorbic] = useState<boolean>(false);
  const [ripperTimerSec, setRipperTimerSec] = useState<number>(15);
  const [ripperTimerRunning, setRipperTimerRunning] = useState<boolean>(false);
  const [iodineMl, setIodineMl] = useState<number>(1.25);
  const [ripperPH, setRipperPH] = useState<number>(3.52);

  // pH Meter Wizard State
  const [measuredPH, setMeasuredPH] = useState<number>(3.52);

  // TA Titration Wizard State
  const [naohMl, setNaohMl] = useState<number>(4.5);

  // Malic Chromatography State
  const [malicResult, setMalicResult] = useState<
    'present' | 'partial' | 'depleted'
  >('depleted');

  // Hydrometer Wizard State
  const [hydroCalTemp, setHydroCalTemp] = useState<20 | 15.5>(20);
  const [hydroMeasuredSG, setHydroMeasuredSG] = useState<number>(1.083);
  const [hydroSampleTempC, setHydroSampleTempC] = useState<number>(24.0);

  // 15-Second Endpoint Color-Stability Timer for Ripper Step 4
  useEffect(() => {
    if (!ripperTimerRunning) return;
    const t = setInterval(() => {
      setRipperTimerSec((prev) => {
        if (prev <= 1) {
          setRipperTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [ripperTimerRunning]);

  const currentWizardMeta =
    WIZARD_TABS.find((w) => w.id === activeWizard) ?? WIZARD_TABS[0];
  const isRose = tankId === 'tank-rose';

  const handleSelectWizard = (id: LabWizardId) => {
    setActiveWizard(id);
    setStep(1);
    setSavedBannerText(null);
  };

  // Calculations
  const ripperFreeSO2 = useMemo(
    () => calculateFreeSO2Ripper(iodineMl, 0.02, 25),
    [iodineMl]
  );
  const ripperMolecularSO2 = useMemo(
    () => calculateMolecularSO2(ripperFreeSO2, ripperPH),
    [ripperFreeSO2, ripperPH]
  );
  const ripperTargetWindow = useMemo(
    () => getContinuousTargetFreeSO2ByPH(ripperPH, isRose),
    [ripperPH, isRose]
  );

  const calculatedTA = useMemo(
    () => calculateTitratableAcidity(naohMl, 0.1, 5),
    [naohMl]
  );

  const hydroCorrected = useMemo(
    () =>
      correctHydrometer(hydroMeasuredSG, hydroSampleTempC, hydroCalTemp),
    [hydroMeasuredSG, hydroSampleTempC, hydroCalTemp]
  );

  const resolvedBatchId =
    activeBatch?.id ?? (isRose ? 'batch-rose-1403' : 'batch-rasha-1403');

  const handleSaveRipperRecord = () => {
    const record = enologyDb.addLabAnalysis({
      batchId: resolvedBatchId,
      tankId,
      date: formatFaDate(),
      testType: 'ripper_so2',
      targetAnalyte: 'سولفیت آزاد (Free SO₂ — ویزارد ریپر)',
      measuredValue: ripperFreeSO2,
      unit: 'mg/L (ppm)',
      methodReliability: hasAscorbic
        ? 'ascorbic_interference'
        : isRose
        ? 'high'
        : 'low_red_ripper',
      actionTaken:
        ripperFreeSO2 >= ripperTargetWindow.min
          ? `در پنجره هدف پیوسته pH=${ripperPH.toFixed(2)} (${ripperTargetWindow.min}–${ripperTargetWindow.max} mg/L)`
          : `کمتر از حداقل هدف (${ripperTargetWindow.min} mg/L)؛ نیازمند شارژ KMS`,
      notes: `حجم ید 0.02N: ${iodineMl.toFixed(2)} mL | SO₂ مولکولی: ${ripperMolecularSO2.toFixed(2)} mg/L`
    });
    setSavedBannerText(
      `نتیجه تست ریپر (${ripperFreeSO2} mg/L) با موفقیت در دفتر آزمایشگاه ثبت شد.`
    );
    notifyDataChanged();
    onAnalysisSaved?.(record);
  };

  const handleSavePhRecord = () => {
    const record = enologyDb.addLabAnalysis({
      batchId: resolvedBatchId,
      tankId,
      date: formatFaDate(),
      testType: 'ph_meter',
      targetAnalyte: 'اسیدیته فعال (pH دو نقطه‌ای)',
      measuredValue: measuredPH,
      unit: 'pH',
      methodReliability: 'high',
      actionTaken: 'ثبت از ویزارد کالیبراسیون ۲ نقطه‌ای (7.00 و 4.01)',
      notes: `قرائت در ۲۰°C پس از شستشوی الکترود در اسید سیتریک ۲٪`
    });
    setSavedBannerText(
      `قرائت pH (${measuredPH.toFixed(2)}) با موفقیت در دفتر آزمایشگاه ثبت شد.`
    );
    notifyDataChanged();
    onAnalysisSaved?.(record);
  };

  const handleSaveTaRecord = () => {
    const record = enologyDb.addLabAnalysis({
      batchId: resolvedBatchId,
      tankId,
      date: formatFaDate(),
      testType: 'ta_titration',
      targetAnalyte: 'اسیدیته قابل تیتراسیون (TA)',
      measuredValue: calculatedTA,
      unit: 'g/L Tartaric',
      methodReliability: 'high',
      actionTaken: `حجم سود مصرفی 0.1N: ${naohMl.toFixed(1)} mL برای 5 mL نمونه گاززدایی‌شده`,
      notes: 'ثبت از ویزارد گام‌به‌گام تیتراسیون TA تا pH=8.2'
    });
    setSavedBannerText(
      `نتیجه تیتراسیون TA (${calculatedTA} g/L) در دفتر آزمایشگاه ثبت شد.`
    );
    notifyDataChanged();
    onAnalysisSaved?.(record);
  };

  const handleSaveMalicRecord = () => {
    const labelMap = {
      present: 'مالیک موجود (واکنش‌پذیر)',
      partial: 'مالیک جزئی',
      depleted: 'تمام‌شده — ایمن برای بطری‌گیری'
    };
    const record = enologyDb.addLabAnalysis({
      batchId: resolvedBatchId,
      tankId,
      date: formatFaDate(),
      testType: 'mlf_chromatography',
      targetAnalyte: 'وضعیت اسید مالیک (کروماتوگرافی کاغذی)',
      measuredValue: labelMap[malicResult],
      unit: 'کیفی',
      malicResult,
      methodReliability: 'high',
      actionTaken:
        malicResult === 'depleted'
          ? 'اسید مالیک مصرف شده و ایمن برای بطری‌گیری است'
          : 'اسید مالیک فعال وجود دارد؛ قفل بیولوژیک باکتی‌لس + سولفیت آزاد حفظ شود',
      notes: 'ثبت از ویزارد ۴ مرحله‌ای کروماتوگرافی کاغذی پیش از بطری‌گیری'
    });
    setSavedBannerText(
      `نتیجه کروماتوگرافی مالیک (${labelMap[malicResult]}) در دفتر آزمایشگاه ثبت شد.`
    );
    notifyDataChanged();
    onAnalysisSaved?.(record);
  };

  const handleSaveHydroRecord = () => {
    const record = enologyDb.addLabAnalysis({
      batchId: resolvedBatchId,
      tankId,
      date: formatFaDate(),
      testType: 'refractometer_correction',
      targetAnalyte: `وزن مخصوص اصلاح‌شده هیدرومتر (کالیبراسیون ${hydroCalTemp}°C)`,
      measuredValue: Number(hydroCorrected.trueSG.toFixed(4)),
      unit: 'SG',
      methodReliability: 'high',
      actionTaken: `قرائت خام ${hydroMeasuredSG.toFixed(3)} در دمای نمونه ${hydroSampleTempC}°C`,
      notes: `ضریب تصحیح دما: ${hydroCorrected.delta >= 0 ? '+' : ''}${hydroCorrected.delta.toFixed(4)}`
    });
    setSavedBannerText(
      `وزن مخصوص اصلاح‌شده (${hydroCorrected.trueSG.toFixed(4)}) در دفتر آزمایشگاه ثبت شد.`
    );
    notifyDataChanged();
    onAnalysisSaved?.(record);
  };

  return (
    <section
      aria-label="ویزاردهای گام‌به‌گام آزمایشگاه کارگاهی"
      className="bg-surface text-ink rounded-xl border border-line p-4 sm:p-5 shadow-xs space-y-4 font-['Vazirmatn',sans-serif]"
    >
      {/* Top Bar: Title & Tank Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-line pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-paper border border-line text-wine flex items-center justify-center shrink-0">
            <FlaskConical className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-ink">
              ویزاردهای تعاملی و گام‌به‌گام آزمایشگاه (یک دستور در هر صفحه + تایمر نقطه پایان)
            </h3>
            <p className="text-xs text-ink-soft">
              اجرای بدون خطای ۵ تست کلیدی با هشدارهای تداخل رنگ قرمز و اسید اسکوربیک و ثبت مستقیم در دفتر آزمایشگاه
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-paper p-1 rounded-xl border border-line self-start lg:self-auto">
          {(
            [
              ['tank-a', 'مخزن قرمز A'],
              ['tank-b', 'مخزن قرمز B'],
              ['tank-rose', 'گالن رُزه']
            ] as const
          )
            .filter(([tId]) => !(tankCount === 1 && tId === 'tank-b'))
            .map(([tId, label]) => (
            <button
              key={tId}
              type="button"
              onClick={() => {
                setTankId(tId);
                setRipperPH(tId === 'tank-rose' ? 3.32 : 3.52);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                tankId === tId
                  ? 'bg-wine text-white'
                  : 'text-ink-soft hover:text-ink'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Wizard Selector Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {WIZARD_TABS.map((w) => (
          <button
            key={w.id}
            type="button"
            onClick={() => handleSelectWizard(w.id)}
            className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap border cursor-pointer transition-all ${
              activeWizard === w.id
                ? 'bg-wine text-white border-wine shadow-xs'
                : 'bg-paper text-ink border-line hover:bg-stone-200/60'
            }`}
          >
            {w.labelFa}
          </button>
        ))}
      </div>

      {/* Step Progress Header */}
      <div className="flex items-center justify-between bg-paper border border-line rounded-xl px-3.5 py-2 text-xs">
        <span className="font-bold text-ink">
          {currentWizardMeta.labelFa} — گام {step} از{' '}
          {currentWizardMeta.totalSteps}
        </span>
        <div className="flex items-center gap-1">
          {Array.from({ length: currentWizardMeta.totalSteps }, (_, i) => i + 1).map(
            (sNum) => (
              <button
                key={sNum}
                type="button"
                onClick={() => setStep(sNum)}
                className={`w-6 h-6 rounded-full text-xs font-mono font-bold cursor-pointer ${
                  step === sNum
                    ? 'bg-wine text-white'
                    : step > sNum
                    ? 'bg-emerald-700 text-white'
                    : 'bg-surface border border-line text-ink-soft'
                }`}
              >
                {sNum}
              </button>
            )
          )}
        </div>
      </div>

      {savedBannerText && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl p-3 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{savedBannerText}</span>
        </div>
      )}

      {/* =================================================================== */}
      {/* WIZARD 1: RIPPER FREE SO2 (5 STEPS)                                 */}
      {/* =================================================================== */}
      {activeWizard === 'ripper_so2' && (
        <div className="bg-paper border border-line rounded-xl p-4 space-y-3">
          {step === 1 && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-ink">
                گام ۱: برداشت دقیق ۲۵ میلی‌لیتر نمونه شراب صاف و بررسی تداخل‌ها
              </h4>
              <p className="text-xs text-ink-soft leading-relaxed">
                با پیپت حباب‌دار دقیقاً <strong>25.0 mL</strong> نمونه شراب صاف را داخل ارلن‌مایر ۲۵۰ میلی‌لیتری بریزید. برای مشاهده بهتر تغییر رنگ در شراب قرمز، یک کاغذ سفید و چراغ قوه زیر ارلن قرار دهید.
              </p>
              <label className="flex items-center gap-2 text-xs font-bold text-ink cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={hasAscorbic}
                  onChange={(e) => setHasAscorbic(e.target.checked)}
                  className="accent-[#6e1f2f]"
                />
                <span>
                  آیا به این مخزن اسید اسکوربیک (ویتامین C) اضافه کرده‌اید؟ (تداخل مثبت با ید)
                </span>
              </label>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-ink">
                گام ۲: افزودن ۵ میلی‌لیتر محلول اسیدی‌کننده
              </h4>
              <p className="text-xs text-ink-soft leading-relaxed">
                <strong>5 mL</strong> اسید سولفوریک ۱:۳ (یا محلول غلیظ اسید سیتریک/تارتاریک آزمایشگاهی) به نمونه اضافه کنید تا pH محیط زیر ۱.۰ قفل شود و فقط سولفیت آزاد وارد واکنش گردد.
              </p>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-ink">
                گام ۳: افزودن ۲ میلی‌لیتر معرف نشاسته ۱٪ (Starch Indicator)
              </h4>
              <p className="text-xs text-ink-soft leading-relaxed">
                <strong>2 mL</strong> محلول نشاسته ۱٪ تازه به ارلن اضافه کرده و به آرامی بچرخانید. بلافاصله تیتراسیون گام ۴ را شروع کنید تا SO₂ آزاد در هوا متصاعد نشود.
              </p>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-ink">
                گام ۴: تیتراسیون قطره‌قطره با ید 0.02N و تایمر پایداری ۱۵ ثانیه‌ای نقطه پایان
              </h4>
              <p className="text-xs text-ink-soft leading-relaxed">
                محلول ید <strong>0.02 N</strong> را قطره‌قطره از بورت اضافه کنید تا رنگ آبی/بنفش تیره در شراب ظاهر شود. به محض دیدن تغییر رنگ، تایمر ۱۵ ثانیه‌ای زیر را بزنید؛ اگر رنگ تا ۱۵ ثانیه محو نشد، نقطه پایان قطعی است!
              </p>
              <div className="bg-surface border border-line rounded-xl p-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Timer className="w-5 h-5 text-wine" />
                  <span className="text-base font-mono font-bold text-ink">
                    {ripperTimerSec} ثانیه
                  </span>
                  {ripperTimerSec === 0 && (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-xs font-bold">
                      نقطه پایان ۱۵ ثانیه‌ای تأیید شد </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (ripperTimerSec === 0) setRipperTimerSec(15);
                      setRipperTimerRunning((r) => !r);
                    }}
                    className="min-h-[44px] px-4 rounded-xl bg-wine hover:opacity-90 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    {ripperTimerRunning ? (
                      <>
                        <Pause className="w-4 h-4" />
                        <span>توقف</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        <span>شروع تایمر ۱۵ ثانیه</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRipperTimerRunning(false);
                      setRipperTimerSec(15);
                    }}
                    className="min-h-[44px] px-3 rounded-xl bg-paper border border-line hover:bg-stone-200/60 text-ink text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>ریست</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-ink">
                گام ۵: ثبت میلی‌لیتر ید مصرفی، بررسی قابلیت اعتماد روش و ذخیره در دفتر آزمایشگاه
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-surface border border-line rounded-xl p-3 space-y-2">
                  <label className="block text-xs font-bold text-ink-soft">
                    حجم ید 0.02N مصرف‌شده (mL):
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setIodineMl((v) =>
                          Math.max(0, Math.round((v - 0.05) * 100) / 100)
                        )
                      }
                      className="min-h-[44px] px-3 rounded-xl bg-paper border border-line text-ink font-mono font-bold text-xs cursor-pointer"
                    >
                      -0.05
                    </button>
                    <input
                      type="number"
                      step="0.05"
                      value={iodineMl}
                      onChange={(e) =>
                        setIodineMl(
                          Math.max(0, Number.parseFloat(e.target.value) || 0)
                        )
                      }
                      className="flex-1 min-h-[44px] bg-paper border border-line rounded-xl text-center font-mono font-bold text-base text-ink"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setIodineMl((v) => Math.round((v + 0.05) * 100) / 100)
                      }
                      className="min-h-[44px] px-3 rounded-xl bg-paper border border-line text-ink font-mono font-bold text-xs cursor-pointer"
                    >
                      +0.05
                    </button>
                  </div>
                </div>

                <div className="bg-surface border border-line rounded-xl p-3 space-y-2">
                  <label className="block text-xs font-bold text-ink-soft">
                    pH فعلی نمونه (برای هدف پیوسته SO₂):
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={ripperPH}
                    onChange={(e) =>
                      setRipperPH(Number.parseFloat(e.target.value) || 3.52)
                    }
                    className="w-full min-h-[44px] bg-paper border border-line rounded-xl text-center font-mono font-bold text-base text-ink"
                  />
                </div>
              </div>

              {/* Result Box */}
              <div className="bg-surface border border-line rounded-xl p-3 text-xs space-y-1">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span>
                    سولفیت آزاد (Free SO₂ = V × 25.6):{' '}
                    <strong className="font-mono text-base text-emerald-800">
                      {ripperFreeSO2} mg/L
                    </strong>
                  </span>
                  <span>
                    SO₂ مولکولی فعال:{' '}
                    <strong className="font-mono text-wine">
                      {ripperMolecularSO2.toFixed(2)} mg/L
                    </strong>
                  </span>
                </div>
                <div className="text-ink-soft">
                  پنجره هدف پیوسته برای pH {ripperPH.toFixed(2)}: از{' '}
                  <strong>{ripperTargetWindow.min}</strong> تا{' '}
                  <strong>{ripperTargetWindow.max} mg/L</strong> (بهینه:{' '}
                  {ripperTargetWindow.target} mg/L)
                </div>
              </div>

              {/* Method Reliability Warnings (Idea 7) */}
              {!isRose && (
                <div className="bg-amber-50 border border-amber-300 rounded-xl p-2.5 text-xs text-amber-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>
                    در شراب قرمز رنگ نقطهٔ پایان را می‌پوشاند؛ عدد را با احتیاط ببینید (قابلیت اعتماد روش: پایین در قرمز).
                  </span>
                </div>
              )}
              {hasAscorbic && (
                <div className="bg-red-50 border border-red-300 rounded-xl p-2.5 text-xs font-bold text-danger flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-danger shrink-0" />
                  <span>اگر اسکوربیک اسید زده‌اید، عدد بالاتر از واقع است.</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleSaveRipperRecord}
                className="w-full min-h-[46px] rounded-xl bg-wine hover:opacity-90 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>ثبت در دفتر آزمایشگاه</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* =================================================================== */}
      {/* WIZARD 2: PH CALIBRATION & MEASUREMENT (4 STEPS)                    */}
      {/* =================================================================== */}
      {activeWizard === 'ph_meter' && (
        <div className="bg-paper border border-line rounded-xl p-4 space-y-3 text-xs">
          {step === 1 && (
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-ink">
                گام ۱: شستشوی الکترود با آب مقطر و محلول استوک اسید سیتریک ۲٪
              </h4>
              <p className="text-ink-soft leading-relaxed">
                حباب شیشه‌ای الکترود pHمتر را با آب مقطر بشویید، در صورت وجود رسوب تارتارات ۵ دقیقه در محلول استوک شماره ۴ (اسید سیتریک ۲٪) قرار دهید و با دستمال بدون پرز خشک کنید.
              </p>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-ink">
                گام ۲: کالیبراسیون نقطه اول در بافر مرجع pH 7.00 (در دمای ۲۰°C)
              </h4>
              <p className="text-ink-soft leading-relaxed">
                الکترود را در ظرف کوچک حاوی بافر <strong>pH 7.00</strong> قرار دهید، ۳۰ ثانیه صبر کنید تا عدد تثبیت شود و دکمه CAL نقطه اول را فشار دهید.
              </p>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-ink">
                گام ۳: کالیبراسیون نقطه دوم در بافر pH 4.01 و تأیید شیب الکترود
              </h4>
              <p className="text-ink-soft leading-relaxed">
                پس از آبکشی با آب مقطر، الکترود را در بافر <strong>pH 4.01</strong> قرار دهید. شیب کالیبراسیون (Slope) باید بین <strong>95% تا 102%</strong> باشد.
              </p>
            </div>
          )}
          {step === 4 && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-ink">
                گام ۴: قرائت pH نمونه شراب در ۲۰°C و ثبت در دفتر آزمایشگاه
              </h4>
              <div className="flex items-center gap-2 max-w-xs">
                <button
                  type="button"
                  onClick={() =>
                    setMeasuredPH((p) => Math.round((p - 0.01) * 100) / 100)
                  }
                  className="min-h-[44px] px-3.5 rounded-xl bg-surface border border-line text-ink font-mono font-bold cursor-pointer"
                >
                  -0.01
                </button>
                <input
                  type="number"
                  step="0.01"
                  value={measuredPH}
                  onChange={(e) =>
                    setMeasuredPH(Number.parseFloat(e.target.value) || 3.52)
                  }
                  className="flex-1 min-h-[44px] bg-surface border border-line rounded-xl text-center font-mono font-bold text-base text-ink"
                />
                <button
                  type="button"
                  onClick={() =>
                    setMeasuredPH((p) => Math.round((p + 0.01) * 100) / 100)
                  }
                  className="min-h-[44px] px-3.5 rounded-xl bg-surface border border-line text-ink font-mono font-bold cursor-pointer"
                >
                  +0.01
                </button>
              </div>
              <button
                type="button"
                onClick={handleSavePhRecord}
                className="w-full min-h-[46px] rounded-xl bg-wine hover:opacity-90 text-white font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>ثبت در دفتر آزمایشگاه</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* =================================================================== */}
      {/* WIZARD 3: TA TITRATION (4 STEPS)                                    */}
      {/* =================================================================== */}
      {activeWizard === 'ta_titration' && (
        <div className="bg-paper border border-line rounded-xl p-4 space-y-3 text-xs">
          {step === 1 && (
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-ink">
                گام ۱: گاززدایی کامل نمونه از CO₂ و برداشت ۵ میلی‌لیتر
              </h4>
              <p className="text-ink-soft leading-relaxed">
                نمونه شراب را به مدت ۲ دقیقه به شدت تکان دهید (یا حرارت ملایم دهید و به ۲۰°C برگردانید) تا گاز کربنیک محلول خارج شود؛ سپس دقیقاً <strong>5.0 mL</strong> برداشت کنید.
              </p>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-ink">
                گام ۲: رقیق‌سازی با آب مقطر خنثی و آماده‌سازی pHمتر (نقطه پایان pH = 8.20)
              </h4>
              <p className="text-ink-soft leading-relaxed">
                ۵۰ میلی‌لیتر آب مقطر خنثی به بشر اضافه کنید و الکترود pHمتر کالیبره‌شده را داخل آن قرار دهید تا نقطه پایان دقیق <strong>pH = 8.20</strong> بدون خطای دید رنگ قرمز مشخص شود.
              </p>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-ink">
                گام ۳: تیتراسیون با محلول سود استاندارد 0.1N (NaOH)
              </h4>
              <p className="text-ink-soft leading-relaxed">
                محلول NaOH 0.1N را قطره‌قطره اضافه کرده و هم بزنید تا نمایشگر pHمتر دقیقاً روی <strong>8.20</strong> ثابت بماند.
              </p>
            </div>
          )}
          {step === 4 && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-ink">
                گام ۴: ورود حجم سود مصرفی (هر ۱ میلی‌لیتر = ۱.۵ گرم بر لیتر اسید تارتاریک)
              </h4>
              <div className="flex items-center gap-2 max-w-xs">
                <button
                  type="button"
                  onClick={() =>
                    setNaohMl((v) =>
                      Math.max(0, Math.round((v - 0.1) * 10) / 10)
                    )
                  }
                  className="min-h-[44px] px-3.5 rounded-xl bg-surface border border-line text-ink font-mono font-bold cursor-pointer"
                >
                  -0.1
                </button>
                <input
                  type="number"
                  step="0.1"
                  value={naohMl}
                  onChange={(e) =>
                    setNaohMl(Math.max(0, Number.parseFloat(e.target.value) || 0))
                  }
                  className="flex-1 min-h-[44px] bg-surface border border-line rounded-xl text-center font-mono font-bold text-base text-ink"
                />
                <button
                  type="button"
                  onClick={() =>
                    setNaohMl((v) => Math.round((v + 0.1) * 10) / 10)
                  }
                  className="min-h-[44px] px-3.5 rounded-xl bg-surface border border-line text-ink font-mono font-bold cursor-pointer"
                >
                  +0.1
                </button>
              </div>
              <div className="bg-surface border border-line rounded-xl p-3 font-bold text-emerald-800">
                اسیدیته قابل تیتراسیون محاسبه‌شده: TA = {calculatedTA} g/L (معادل اسید تارتاریک)
              </div>
              <button
                type="button"
                onClick={handleSaveTaRecord}
                className="w-full min-h-[46px] rounded-xl bg-wine hover:opacity-90 text-white font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>ثبت در دفتر آزمایشگاه</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* =================================================================== */}
      {/* WIZARD 4: MALIC ACID CHROMATOGRAPHY (4 STEPS)                       */}
      {/* =================================================================== */}
      {activeWizard === 'mlf_chromatography' && (
        <div className="bg-paper border border-line rounded-xl p-4 space-y-3 text-xs">
          {step === 1 && (
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-ink">
                گام ۱: لکه‌گذاری استانداردهای تارتاریک، مالیک، لاکتیک و نمونه شراب روی کاغذ کروماتوگرافی
              </h4>
              <p className="text-ink-soft leading-relaxed">
                با لوله مویین روی خط مبدأ کاغذ کروماتوگرافی، قطره‌های کوچکی از محلول‌های استاندارد اسید مالیک، لاکتیک و نمونه شراب مخزن را لکه‌گذاری کرده و اجازه دهید خشک شوند.
              </p>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-ink">
                گام ۲: قرار دادن کاغذ در تانک حلال کروماتوگرافی (Elution)
              </h4>
              <p className="text-ink-soft leading-relaxed">
                کاغذ را به صورت استوانه‌ای در جار حاوی حلال کروماتوگرافی قرار داده و درب ظرف را ببندید تا جبهه حلال تا ۲ سانتی‌متری لبه بالایی صعود کند.
              </p>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-ink">
                گام ۳: خشک کردن کاغذ در فضای دارای تهویه تا ظهور لکه‌های زرد روی زمینه آبی
              </h4>
              <p className="text-ink-soft leading-relaxed">
                کاغذ را خارج کرده و در محیط دارای تهویه آویزان کنید تا بخار اسید فرمیک خارج شده و لکه‌های زرد اسیدی روی زمینه آبی بروموکرزول ظاهر شوند.
              </p>
            </div>
          )}
          {step === 4 && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-ink">
                گام ۴: تفسیر لکه اسید مالیک و ثبت در دروازه ایمنی بطری‌گیری
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {(
                  [
                    ['depleted', 'تمام‌شده — ایمن برای بطری‌گیری'],
                    ['partial', 'جزئی (در حال کاهش)'],
                    ['present', 'مالیک موجود (نیازمند قفل باکتی‌لس/KMS)']
                  ] as const
                ).map(([val, label]) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setMalicResult(val)}
                    className={`p-3 rounded-xl border font-bold cursor-pointer ${
                      malicResult === val
                        ? 'bg-wine text-white border-wine'
                        : 'bg-surface text-ink border-line hover:bg-stone-200/60'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={handleSaveMalicRecord}
                className="w-full min-h-[46px] rounded-xl bg-wine hover:opacity-90 text-white font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>ثبت در دفتر آزمایشگاه</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* =================================================================== */}
      {/* WIZARD 5: HYDROMETER TEMP CORRECTION (3 STEPS)                      */}
      {/* =================================================================== */}
      {activeWizard === 'hydrometer_temp' && (
        <div className="bg-paper border border-line rounded-xl p-4 space-y-3 text-xs">
          {step === 1 && (
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-ink">
                گام ۱: چرخاندن هیدرومتر در استوانه مدرج برای جداسازی حباب‌های CO₂
              </h4>
              <p className="text-ink-soft leading-relaxed">
                پیش از قرائت عدد، هیدرومتر را یک دور در استوانه بچرخانید تا حباب‌های گاز CO₂ چسبیده به بدنه جدا شوند و خطای شناوری کاذب ایجاد نکنند؛ سپس از زیر منیسک مایع قرائت کنید.
              </p>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-ink">
                گام ۲: انتخاب دمای کالیبراسیون هیدرومتر شما (۲۰°C یا ۱۵.۵°C)
              </h4>
              <div className="flex items-center gap-2">
                {([20, 15.5] as const).map((cal) => (
                  <button
                    key={cal}
                    type="button"
                    onClick={() => setHydroCalTemp(cal)}
                    className={`px-4 py-2 rounded-xl font-mono font-bold border cursor-pointer ${
                      hydroCalTemp === cal
                        ? 'bg-wine text-white border-wine'
                        : 'bg-surface text-ink border-line'
                    }`}
                  >
                    کالیبراسیون {cal} °C
                  </button>
                ))}
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-ink">
                گام ۳: ورود SG خوانده‌شده و دمای نمونه در استوانه
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-surface border border-line rounded-xl p-3 space-y-1.5">
                  <label className="block font-bold text-ink-soft">
                    SG خوانده‌شده:
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    value={hydroMeasuredSG}
                    onChange={(e) =>
                      setHydroMeasuredSG(
                        Number.parseFloat(e.target.value) || 1.083
                      )
                    }
                    className="w-full min-h-[44px] bg-paper border border-line rounded-xl text-center font-mono font-bold text-base text-ink"
                  />
                </div>
                <div className="bg-surface border border-line rounded-xl p-3 space-y-1.5">
                  <label className="block font-bold text-ink-soft">
                    دمای نمونه در استوانه (°C):
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={hydroSampleTempC}
                    onChange={(e) =>
                      setHydroSampleTempC(
                        Number.parseFloat(e.target.value) || 20
                      )
                    }
                    className="w-full min-h-[44px] bg-paper border border-line rounded-xl text-center font-mono font-bold text-base text-ink"
                  />
                </div>
              </div>

              <div className="bg-surface border border-line rounded-xl p-3 font-bold text-emerald-800">
                SG واقعی اصلاح‌شده: {hydroCorrected.trueSG.toFixed(4)} (تصحیح:{' '}
                {hydroCorrected.delta >= 0 ? '+' : ''}
                {hydroCorrected.delta.toFixed(4)})
              </div>

              {hydroCorrected.isAbove32CWarning && (
                <div className="bg-amber-50 border border-amber-300 rounded-xl p-2.5 text-amber-900 font-bold">
                  {hydroCorrected.warningFa}
                </div>
              )}

              <button
                type="button"
                onClick={handleSaveHydroRecord}
                className="w-full min-h-[46px] rounded-xl bg-wine hover:opacity-90 text-white font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>ثبت در دفتر آزمایشگاه</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Step Footer Navigation */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          disabled={step <= 1}
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          className="px-4 py-2 rounded-xl bg-paper border border-line hover:bg-stone-200/60 disabled:opacity-40 text-ink text-xs font-bold flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowRight className="w-4 h-4" />
          <span>گام قبل</span>
        </button>

        {step < currentWizardMeta.totalSteps && (
          <button
            type="button"
            onClick={() =>
              setStep((s) => Math.min(currentWizardMeta.totalSteps, s + 1))
            }
            className="px-5 py-2 rounded-xl bg-wine hover:opacity-90 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <span>گام بعد</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}
      </div>
    </section>
  );
};
