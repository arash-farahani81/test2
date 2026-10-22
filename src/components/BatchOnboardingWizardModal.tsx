import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FlaskConical,
  Scale,
  Sparkles,
  Wine,
  X
} from 'lucide-react';
import type { WineBatch } from '../types/index.ts';
import { enologyDb } from '../db/enologyDatabase.ts';
import {
  IDEAL_DEFAULT_PROTOCOL_PARAMS,
  computeDynamicProtocolPlan,
  useFlexibleProtocol
} from '../data/masterProtocolConfig.ts';
import {
  brixToSpecificGravity,
  specificGravityToBrix
} from '../utils/trackingCalculations.ts';
import { normalizeEnologyNumericInput } from '../utils/enologyUtils.ts';
import { getCurrentPersianDateTimeStr } from '../utils/persianDate.ts';
import { useEnologyUi } from '../context/EnologyUiContext.tsx';

export interface BatchOnboardingWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBatchCreated?: (batch: WineBatch) => void;
}

export const BatchOnboardingWizardModal: React.FC<
  BatchOnboardingWizardModalProps
> = ({ isOpen, onClose, onBatchCreated }) => {
  const { params, updateParam } = useFlexibleProtocol();
  const { setActiveBatchId, setScalePrecision, notifyDataChanged } = useEnologyUi();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Step 1: Grape Weight & Tank Count
  const [batchName, setBatchName] = useState<string>(
    'بچ واقعی انگور رشه سردشت (فصل جدید)'
  );
  const [grapeWeightKg, setGrapeWeightKg] = useState<number>(
    params.grapeWeightKg || 400
  );
  const [grapeWeightInput, setGrapeWeightInput] = useState<string>(
    String(params.grapeWeightKg || 400)
  );
  const [tankCount, setTankCount] = useState<1 | 2>(2);

  // Step 2: Sugar Source & Mutual Brix/SG Lock
  const [sugarSource, setSugarSource] = useState<
    'hydrometer' | 'refractometer'
  >('hydrometer');
  const [manualBothSugar, setManualBothSugar] = useState<boolean>(false);
  const [initialSG, setInitialSG] = useState<number>(1.092);
  const [initialSgInput, setInitialSgInput] = useState<string>('1.092');
  const [initialBrix, setInitialBrix] = useState<number>(22.0);
  const [initialBrixInput, setInitialBrixInput] = useState<string>('22.0');

  // Step 3: Initial Acidity (pH & TA — Safe empty defaults with gray reference placeholders)
  const [phKnown, setPhKnown] = useState<boolean>(true);
  const [initialPHInput, setInitialPHInput] = useState<string>('');
  const [taKnown, setTaKnown] = useState<boolean>(true);
  const [initialTAInput, setInitialTAInput] = useState<string>('');

  const parsedInitialPH = useMemo(() => {
    if (!phKnown || !initialPHInput.trim()) return null;
    const n = Number.parseFloat(initialPHInput);
    return Number.isFinite(n) && n >= 2.5 && n <= 4.8 ? n : null;
  }, [phKnown, initialPHInput]);

  const parsedInitialTA = useMemo(() => {
    if (!taKnown || !initialTAInput.trim()) return null;
    const n = Number.parseFloat(initialTAInput);
    return Number.isFinite(n) && n >= 2.0 && n <= 16.0 ? n : null;
  }, [taKnown, initialTAInput]);

  const initialPHNum = parsedInitialPH ?? 3.52;
  const initialTANum = parsedInitialTA ?? 6.8;

  // Step 4: Malic Acid Status
  const [malicStatus, setMalicStatus] = useState<
    'low' | 'medium' | 'high' | 'unknown'
  >('unknown');

  // Step 5: MLF Policy
  const [mlfPolicy, setMlfPolicy] = useState<'no_mlf' | 'spontaneous' | 'inoculated'>(
    'no_mlf'
  );

  // Estimated liquid volume per tank
  const estimatedLiquidPerTankL = useMemo(() => {
    const raw = (grapeWeightKg / 400) * 132 * (2 / tankCount);
    return Math.round(raw * 10) / 10;
  }, [grapeWeightKg, tankCount]);

  const isMicroBatchAutoStock =
    estimatedLiquidPerTankL < 20 || grapeWeightKg < 50;

  // Auto-enable 0.1g Stock Solution precision when tank volume < 20 L (Idea 6 & Idea 9)
  useEffect(() => {
    if (!isOpen || !isMicroBatchAutoStock) return;
    setScalePrecision(0.1);
  }, [isOpen, isMicroBatchAutoStock, setScalePrecision]);

  const handleSgInputChange = (val: number) => {
    const clamped = Math.max(1.04, Math.min(1.14, val));
    setInitialSG(clamped);
    setInitialSgInput(clamped.toFixed(3));
    if (!manualBothSugar) {
      const nextBrix = specificGravityToBrix(clamped);
      setInitialBrix(nextBrix);
      setInitialBrixInput(nextBrix.toFixed(1));
    }
  };

  const handleBrixInputChange = (val: number) => {
    const clamped = Math.max(12, Math.min(32, val));
    setInitialBrix(clamped);
    setInitialBrixInput(clamped.toFixed(1));
    if (!manualBothSugar) {
      const nextSg = brixToSpecificGravity(clamped);
      setInitialSG(nextSg);
      setInitialSgInput(nextSg.toFixed(3));
    }
  };

  const expectedSgFromBrix = useMemo(
    () => brixToSpecificGravity(initialBrix),
    [initialBrix]
  );
  const hasSugarDiscrepancy =
    manualBothSugar && Math.abs(initialSG - expectedSgFromBrix) > 0.003;

  // Personalized Protocol Preview Plan
  const previewPlan = useMemo(
    () =>
      computeDynamicProtocolPlan({
        ...IDEAL_DEFAULT_PROTOCOL_PARAMS,
        ...params,
        grapeWeightKg: Math.max(20, grapeWeightKg),
        initialBrix,
        initialSG,
        targetRedPH: parsedInitialPH !== null ? parsedInitialPH : 3.52
      }),
    [params, grapeWeightKg, initialBrix, initialSG, parsedInitialPH]
  );

  const handleCompleteOnboarding = () => {
    const validWeight = Math.max(20, Math.min(5000, grapeWeightKg));
    const effectivePH = parsedInitialPH !== null ? parsedInitialPH : 3.52;
    const effectiveTA = parsedInitialTA !== null ? parsedInitialTA : 6.8;

    const flexParamsSnapshot: Record<string, number | string> = {
      ...IDEAL_DEFAULT_PROTOCOL_PARAMS,
      ...params,
      grapeWeightKg: validWeight,
      initialBrix,
      initialSG,
      targetRedPH: effectivePH
    };

    updateParam('grapeWeightKg', validWeight);
    updateParam('initialBrix', initialBrix);
    updateParam('initialSG', initialSG);
    updateParam('targetRedPH', effectivePH);

    const tankAdjustFactor = 2 / tankCount;
    const redLiquidL =
      Math.round(
        previewPlan.volumes.redLiquidFermentPerTankL * tankAdjustFactor * 10
      ) / 10;

    const nowMs = Date.now();
    const dateStr = getCurrentPersianDateTimeStr(nowMs);
    const startDateOnly = dateStr.split(' - ')[0] || '۱۴۰۵/۰۷/۲۶';

    const createdBatch = enologyDb.startRealBatchMode({
      name: batchName.trim() || 'بچ واقعی انگور رشه سردشت',
      grapeVariety: 'انگور رشه سردشت (Rasha Sardasht)',
      vintageYear: 1405,
      initialWeightKg: validWeight,
      targetStyle: 'red',
      status: 'active_fermentation',
      startDate: startDateOnly,
      notes: `کراش کل: ${previewPlan.volumes.totalCrushedMashL}L | سانیه رُزه: ${previewPlan.volumes.saigneeTotalL}L | قرمز: ${redLiquidL * tankCount}L`,
      isDemo: false,
      tankCount,
      sugarSource,
      initialBrix,
      initialSG,
      initialPH: parsedInitialPH !== null ? parsedInitialPH : 'unknown',
      initialTA: parsedInitialTA !== null ? parsedInitialTA : 'unknown',
      malicStatus,
      mlfPolicy,
      protocolParamsSnapshot: { ...flexParamsSnapshot }
    });

    enologyDb.addLog({
      id: `log-onboard-a-${nowMs}`,
      batchId: createdBatch?.id,
      tankId: 'tank-a',
      dayNumber: 0,
      dateTime: dateStr,
      timestampMs: nowMs,
      stageTitle: 'روز ۰ — پذیرش و کراش انگور (شروع بچ واقعی)',
      brix: initialBrix,
      sg: initialSG,
      measuredSG: initialSG,
      tempSample: 20,
      tempCap: 20.0,
      tempRoom: 20.0,
      ph: effectivePH,
      phMeasured: parsedInitialPH !== null,
      ta: effectiveTA,
      taMeasured: parsedInitialTA !== null,
      pigeageDone: false,
      pigeageCount: 0,
      operationNote: `ثبت اولیه ویزارد راه‌اندازی بچ (${validWeight} کیلوگرم انگور، ${tankCount} مخزن)`,
      isTriggerPoint: true,
      isBenchmark: false,
      isDemo: false
    });

    if (tankCount === 2) {
      enologyDb.addLog({
        id: `log-onboard-b-${nowMs + 1}`,
        batchId: createdBatch?.id,
        tankId: 'tank-b',
        dayNumber: 0,
        dateTime: dateStr,
        timestampMs: nowMs + 1,
        stageTitle: 'روز ۰ — پذیرش و کراش انگور (شروع بچ واقعی)',
        brix: initialBrix,
        sg: initialSG,
        measuredSG: initialSG,
        tempSample: 20,
        tempCap: 20.0,
        tempRoom: 20.0,
        ph: effectivePH,
        phMeasured: parsedInitialPH !== null,
        ta: effectiveTA,
        taMeasured: parsedInitialTA !== null,
        pigeageDone: false,
        pigeageCount: 0,
        operationNote: `ثبت اولیه ویزارد راه‌اندازی بچ (${validWeight} کیلوگرم انگور، مخزن B)`,
        isTriggerPoint: true,
        isBenchmark: false,
        isDemo: false
      });
    }

    // BUG-107: Initialize Day 0 log entry for Rosé Saignée tank when saigneeTotalL > 0
    if (previewPlan.volumes.saigneeTotalL > 0) {
      const rosePh =
        parsedInitialPH !== null
          ? Math.max(2.9, Math.round((parsedInitialPH - 0.15) * 100) / 100)
          : 3.32;
      enologyDb.addLog({
        id: `log-onboard-rose-${nowMs + 2}`,
        batchId: createdBatch?.id,
        tankId: 'tank-rose',
        dayNumber: 0,
        dateTime: dateStr,
        timestampMs: nowMs + 2,
        stageTitle: 'روز ۰ — خون‌گیری سانیه رُزه (شروع بچ واقعی)',
        brix: initialBrix,
        sg: initialSG,
        measuredSG: initialSG,
        tempSample: 20,
        tempCap: 16.0,
        tempRoom: 18.0,
        ph: rosePh,
        phMeasured: parsedInitialPH !== null,
        ta: effectiveTA,
        taMeasured: parsedInitialTA !== null,
        pigeageDone: false,
        pigeageCount: 0,
        operationNote: `ثبت اولیه گالن رُزه سانیه (${previewPlan.volumes.saigneeTotalL} لیتر)`,
        isTriggerPoint: true,
        isBenchmark: false,
        isDemo: false
      });
    }

    if (createdBatch) {
      setActiveBatchId(createdBatch.id);
      notifyDataChanged();
      onBatchCreated?.(createdBatch);
    } else {
      notifyDataChanged();
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="ویزارد ۵ مرحله‌ای راه‌اندازی بچ جدید"
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 font-['Vazirmatn',sans-serif]"
    >
      <div className="bg-surface text-ink border border-line rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="bg-surface px-5 py-4 border-b border-line flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-paper border border-line text-wine flex items-center justify-center shrink-0">
              <Wine className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-ink">
                ویزارد ۵ مرحله‌ای راه‌اندازی بچ جدید و شخصی‌سازی پروتکل
              </h3>
              <p className="text-xs text-ink-soft">
                گام {step} از ۵ — تنظیم مقیاس، قفل متقابل بریکس/SG، اسیدیته و سیاست مالولاکتیک
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-paper border border-line hover:bg-stone-200/60 text-ink-soft hover:text-ink flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stepper Indicator */}
        <div className="px-5 pt-3 pb-2 border-b border-line flex items-center justify-between gap-1 text-xs bg-paper/50">
          {[
            [1, '۱. وزن و مخزن'],
            [2, '۲. قند اولیه (SG/Brix)'],
            [3, '۳. اسیدیته (pH/TA)'],
            [4, '۴. اسید مالیک'],
            [5, '۵. پیش‌نمایش و شروع']
          ].map(([num, label]) => (
            <button
              key={num}
              type="button"
              onClick={() => setStep(num as 1 | 2 | 3 | 4 | 5)}
              className={`px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                step === num
                  ? 'bg-wine text-white font-bold'
                  : step > (num as number)
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-surface border border-line text-ink-soft'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="p-5 space-y-4">
          {/* STEP 1: Grape Weight & Tank Count */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-ink-soft mb-1">
                  نام بچ شراب‌گیری:
                </label>
                <input
                  type="text"
                  value={batchName}
                  onChange={(e) => setBatchName(e.target.value)}
                  className="w-full bg-paper border border-line rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-ink font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-paper border border-line rounded-xl p-3.5 space-y-2">
                  <label className="block text-xs font-bold text-ink">
                    مقدار کل انگور ورودی (۲۰ تا ۵۰۰۰ کیلوگرم):
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      inputMode="decimal"
                      value={grapeWeightInput}
                      onChange={(e) => {
                        const raw = e.target.value;
                        setGrapeWeightInput(raw);
                        const parsed = normalizeEnologyNumericInput(
                          raw,
                          'general'
                        );
                        if (parsed !== null && parsed > 0) {
                          setGrapeWeightKg(Math.min(5000, parsed));
                        }
                      }}
                      onBlur={() => {
                        const clamped = Math.max(
                          20,
                          Math.min(5000, grapeWeightKg || 20)
                        );
                        setGrapeWeightKg(clamped);
                        setGrapeWeightInput(String(clamped));
                      }}
                      className="flex-1 bg-surface border border-line rounded-xl px-3 py-2 text-lg font-mono font-bold text-ink text-center"
                    />
                    <span className="text-xs font-bold text-ink-soft">kg</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {[20, 50, 100, 200, 400, 1000].map((presetKg) => (
                      <button
                        key={presetKg}
                        type="button"
                        onClick={() => {
                          setGrapeWeightKg(presetKg);
                          setGrapeWeightInput(String(presetKg));
                        }}
                        className={`px-2 py-1 rounded-lg text-xs font-mono font-bold cursor-pointer ${
                          grapeWeightKg === presetKg
                            ? 'bg-wine text-white'
                            : 'bg-surface border border-line text-ink hover:bg-stone-200/60'
                        }`}
                      >
                        {presetKg}kg
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-paper border border-line rounded-xl p-3.5 space-y-2">
                  <label className="block text-xs font-bold text-ink">
                    تعداد مخازن تخمیر قرمز:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {([1, 2] as const).map((cnt) => (
                      <button
                        key={cnt}
                        type="button"
                        onClick={() => setTankCount(cnt)}
                        className={`py-2.5 rounded-xl text-xs font-bold border cursor-pointer ${
                          tankCount === cnt
                            ? 'bg-wine text-white border-wine'
                            : 'bg-surface text-ink border-line'
                        }`}
                      >
                        {cnt === 1 ? '۱ مخزن یکپارچه' : '۲ مخزن متقارن (A و B)'}
                      </button>
                    ))}
                  </div>
                  <div className="text-xs text-ink-soft pt-1">
                    حجم مایع تخمینی هر مخزن:{' '}
                    <strong className="font-mono text-emerald-800">
                      {estimatedLiquidPerTankL} لیتر
                    </strong>
                  </div>
                </div>
              </div>

              {isMicroBatchAutoStock && (
                <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-emerald-900">
                  <Scale className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-emerald-900">
                      حالت میکرو-بچ و محلول استوک خودکار فعال شد
                    </div>
                    <p className="mt-0.5 leading-relaxed">
                      حجم مخزن کمتر از ۲۰ لیتر است؛ حالت «محلول استوک» (ایده ۹) برای توزین دقیق دوزهای کوچک به صورت خودکار فعال شد.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Sugar Source & Mutual Brix/SG Lock */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-ink">
                  ابزار سنجش قند اولیه آب‌انگور:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSugarSource('hydrometer');
                      setManualBothSugar(false);
                      const nextBrix = specificGravityToBrix(initialSG);
                      setInitialBrix(nextBrix);
                      setInitialBrixInput(nextBrix.toFixed(1));
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer ${
                      sugarSource === 'hydrometer' && !manualBothSugar
                        ? 'bg-wine text-white border-wine'
                        : 'bg-paper text-ink border-line'
                    }`}
                  >
                    هیدرومتر (SG مرجع)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSugarSource('refractometer');
                      setManualBothSugar(false);
                      const nextSg = brixToSpecificGravity(initialBrix);
                      setInitialSG(nextSg);
                      setInitialSgInput(nextSg.toFixed(3));
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer ${
                      sugarSource === 'refractometer' && !manualBothSugar
                        ? 'bg-wine text-white border-wine'
                        : 'bg-paper text-ink border-line'
                    }`}
                  >
                    رفراکتومتر (Brix مرجع)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-paper border border-line rounded-xl p-3.5 space-y-2">
                  <label className="block text-xs font-bold text-ink">
                    وزن مخصوص اولیه در ۲۰°C (SG₀):
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
                    disabled={sugarSource === 'refractometer' && !manualBothSugar}
                    value={initialSgInput}
                    onChange={(e) => {
                      const raw = e.target.value;
                      setInitialSgInput(raw);
                      const parsed = normalizeEnologyNumericInput(raw, 'sg');
                      if (
                        parsed !== null &&
                        parsed >= 1.04 &&
                        parsed <= 1.14
                      ) {
                        setInitialSG(parsed);
                        if (!manualBothSugar) {
                          const nextBrix = specificGravityToBrix(parsed);
                          setInitialBrix(nextBrix);
                          setInitialBrixInput(nextBrix.toFixed(1));
                        }
                      }
                    }}
                    onBlur={() => {
                      const parsed = normalizeEnologyNumericInput(
                        initialSgInput,
                        'sg'
                      );
                      handleSgInputChange(parsed ?? initialSG);
                    }}
                    className="w-full bg-surface disabled:opacity-60 border border-line rounded-xl px-3 py-2 text-lg font-mono font-bold text-ink text-center"
                  />
                </div>

                <div className="bg-paper border border-line rounded-xl p-3.5 space-y-2">
                  <label className="block text-xs font-bold text-ink">
                    بریکس اولیه آب‌انگور (°Bx):
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
                    disabled={sugarSource === 'hydrometer' && !manualBothSugar}
                    value={initialBrixInput}
                    onChange={(e) => {
                      const raw = e.target.value;
                      setInitialBrixInput(raw);
                      const parsed = normalizeEnologyNumericInput(
                        raw,
                        'general'
                      );
                      if (parsed !== null && parsed >= 12 && parsed <= 32) {
                        setInitialBrix(parsed);
                        if (!manualBothSugar) {
                          const nextSg = brixToSpecificGravity(parsed);
                          setInitialSG(nextSg);
                          setInitialSgInput(nextSg.toFixed(3));
                        }
                      }
                    }}
                    onBlur={() => {
                      const parsed = normalizeEnologyNumericInput(
                        initialBrixInput,
                        'general'
                      );
                      handleBrixInputChange(parsed ?? initialBrix);
                    }}
                    className="w-full bg-surface disabled:opacity-60 border border-line rounded-xl px-3 py-2 text-lg font-mono font-bold text-ink text-center"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs text-ink-soft cursor-pointer">
                <input
                  type="checkbox"
                  checked={manualBothSugar}
                  onChange={(e) => setManualBothSugar(e.target.checked)}
                  className="accent-[#6e1f2f]"
                />
                <span>ورود دستی هر دو عدد (غیرفعال کردن قفل متقابل بریکس و SG)</span>
              </label>

              {hasSugarDiscrepancy && (
                <div className="bg-red-50 border border-red-300 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-danger">
                  <AlertTriangle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">
                      هشدار عدم تطابق فیزیکی بریکس ({initialBrix}°Bx) و چگالی ({initialSG.toFixed(3)}):
                    </div>
                    <p className="mt-1 leading-relaxed text-ink">
                      بریکس {initialBrix}°Bx از نظر فیزیکی معادل SG ≈ {expectedSgFromBrix.toFixed(3)} است. برای جلوگیری از خطای محاسبه نیتروژن (YAN) و تریگرهای تغذیه، یکی از ابزارها را به عنوان مرجع قفل کنید.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Initial Acidity (pH & TA) */}
          {step === 3 && (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 bg-paper border border-line rounded-xl px-3.5 py-2.5 text-xs">
                <span className="text-ink font-bold">
                  اسیدیته اولیه را در صورت اندازه‌گیری وارد کنید (پیشنهاد مرجع: pH {initialPHNum.toFixed(2)} | TA {initialTANum.toFixed(1)} g/L):
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      setPhKnown(true);
                      setTaKnown(true);
                      setInitialPHInput('3.52');
                      setInitialTAInput('6.8');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-wine text-white text-xs font-bold cursor-pointer"
                  >
                    پر کردن با مقادیر نمونه
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPhKnown(false);
                      setTaKnown(false);
                      setInitialPHInput('');
                      setInitialTAInput('');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-surface hover:bg-stone-200/60 border border-line text-ink text-xs font-bold cursor-pointer"
                  >
                    هنوز اندازه نگرفتم (نامعلوم)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-paper border border-line rounded-xl p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-ink">
                      pH اولیه شیره:
                    </label>
                    <label className="flex items-center gap-1.5 text-xs text-ink-soft cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!phKnown}
                        onChange={(e) => {
                          setPhKnown(!e.target.checked);
                          if (e.target.checked) setInitialPHInput('');
                        }}
                        className="accent-[#6e1f2f]"
                      />
                      <span>هنوز اندازه نگرفتم (نامعلوم)</span>
                    </label>
                  </div>
                  {phKnown ? (
                    <input
                      type="number"
                      step="0.01"
                      placeholder="پیشنهاد مرجع: ۳.۵۲"
                      value={initialPHInput}
                      onChange={(e) => setInitialPHInput(e.target.value)}
                      className="w-full bg-surface border border-line rounded-xl px-3 py-2 text-lg font-mono font-bold text-ink text-center placeholder:text-ink-soft placeholder:text-xs"
                    />
                  ) : (
                    <div className="bg-surface border border-line rounded-xl p-3 text-xs text-ink-soft">
                      مقدار پیش‌فرض ایمن (3.52) موقتاً استفاده می‌شود تا pHمتر کالیبره شود.
                    </div>
                  )}
                </div>

                <div className="bg-paper border border-line rounded-xl p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-ink">
                      اسیدیته قابل تیتراسیون (TA — g/L):
                    </label>
                    <label className="flex items-center gap-1.5 text-xs text-ink-soft cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!taKnown}
                        onChange={(e) => {
                          setTaKnown(!e.target.checked);
                          if (e.target.checked) setInitialTAInput('');
                        }}
                        className="accent-[#6e1f2f]"
                      />
                      <span>هنوز اندازه نگرفتم (نامعلوم)</span>
                    </label>
                  </div>
                  {taKnown ? (
                    <input
                      type="number"
                      step="0.1"
                      placeholder="پیشنهاد مرجع: ۶.۸"
                      value={initialTAInput}
                      onChange={(e) => setInitialTAInput(e.target.value)}
                      className="w-full bg-surface border border-line rounded-xl px-3 py-2 text-lg font-mono font-bold text-ink text-center placeholder:text-ink-soft placeholder:text-xs"
                    />
                  ) : (
                    <div className="bg-surface border border-line rounded-xl p-3 text-xs text-ink-soft">
                      وضعیت TA «نامعلوم» ثبت می‌شود؛ سیستم تا پیش از تیتراسیون توصیه کور اسیدافزایی نخواهد کرد.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Malic Acid Status */}
          {step === 4 && (
            <div className="space-y-3">
              <div className="text-xs font-bold text-ink">
                وضعیت اسید مالیک انگور ورودی را انتخاب کنید:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {(
                  [
                    [
                      'low',
                      'کم (انگور کاملاً رسیده مناطق گرم)',
                      'ریسک تخمیر مالولاکتیک ناخواسته در بطری پایین است.'
                    ],
                    [
                      'medium',
                      'متوسط (تاکستان کوهستانی استاندارد)',
                      'حفظ طراوت میوه‌ای با قفل باکتی‌لس و KMS در روز ۱۱.'
                    ],
                    [
                      'high',
                      'بالا (برداشت زودهنگام یا اقلیم سرد)',
                      'پیشنهاد اسیدزدایی با KHCO₃ در سرمازدایی یا استفاده از مخمر با قابلیت تجزیه بخشی از مالیک'
                    ],
                    [
                      'unknown',
                      'اندازه نگرفتم (نامعلوم)',
                      'دروازهٔ ایمنی بطری‌گیری (ایده ۱۰) تست کروماتوگرافی مالیک یا فیلتراسیون استریل را پیش از بطری‌گیری الزامی خواهد کرد.'
                    ]
                  ] as const
                ).map(([val, titleFa, descFa]) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setMalicStatus(val)}
                    className={`text-right rounded-xl p-3.5 border transition-all cursor-pointer ${
                      malicStatus === val
                        ? 'bg-wine text-white border-wine'
                        : 'bg-paper border-line text-ink hover:bg-stone-200/60'
                    }`}
                  >
                    <div className="text-xs font-bold">
                      {titleFa}
                    </div>
                    <p className={`text-xs mt-1 leading-relaxed ${malicStatus === val ? 'text-white/90' : 'text-ink-soft'}`}>
                      {descFa}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: MLF Policy & Personalized Protocol Preview */}
          {step === 5 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-ink">
                  سیاست تخمیر مالولاکتیک (MLF Policy):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setMlfPolicy('no_mlf')}
                    className={`text-right p-3 rounded-xl border text-xs cursor-pointer ${
                      mlfPolicy === 'no_mlf'
                        ? 'bg-wine border-wine text-white font-bold'
                        : 'bg-paper border-line text-ink'
                    }`}
                  >
                    بدون MLF (باکتری ندارم — قفل با باکتی‌لس و KMS پس از خشکی)
                  </button>
                  <button
                    type="button"
                    onClick={() => setMlfPolicy('spontaneous')}
                    className={`text-right p-3 rounded-xl border text-xs cursor-pointer ${
                      mlfPolicy === 'spontaneous'
                        ? 'bg-wine border-wine text-white font-bold'
                        : 'bg-paper border-line text-ink'
                    }`}
                  >
                    تخمیر مالولاکتیک خودبه‌خودی (تعویق KMS و باکتی‌لس تا اتمام مالیک)
                  </button>
                  <button
                    type="button"
                    onClick={() => setMlfPolicy('inoculated')}
                    className={`text-right p-3 rounded-xl border text-xs cursor-pointer ${
                      mlfPolicy === 'inoculated'
                        ? 'bg-wine border-wine text-white font-bold'
                        : 'bg-paper border-line text-ink'
                    }`}
                  >
                    تلقیح باکتری مالولاکتیک انتخابی (Inoculated MLF — کشت Oenococcus oeni)
                  </button>
                </div>
              </div>

              {/* Personalized Protocol Preview Card */}
              <div className="bg-paper border border-line rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-ink">
                  <Sparkles className="w-4 h-4 text-wine shrink-0" />
                  <span>
                    پیش‌نمایش پروتکل شخصی‌سازی‌شده برای {grapeWeightKg} کیلوگرم انگور ({tankCount}{' '}
                    مخزن)
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="bg-surface border border-line rounded-xl p-2.5">
                    <div className="text-xs text-ink-soft">توده کراش کل:</div>
                    <div className="font-mono font-bold text-ink mt-0.5">
                      {previewPlan.volumes.totalCrushedMashL} L
                    </div>
                  </div>
                  <div className="bg-surface border border-line rounded-xl p-2.5">
                    <div className="text-xs text-ink-soft">
                      فاز مایع هر مخزن قرمز:
                    </div>
                    <div className="font-mono font-bold text-emerald-800 mt-0.5">
                      {estimatedLiquidPerTankL} L
                    </div>
                  </div>
                  <div className="bg-surface border border-line rounded-xl p-2.5">
                    <div className="text-xs text-ink-soft">شیره سانیه رُزه:</div>
                    <div className="font-mono font-bold text-wine mt-0.5">
                      {previewPlan.volumes.saigneeTotalL} L
                    </div>
                  </div>
                </div>

                <div className="text-xs space-y-1 bg-surface border border-line rounded-xl p-3">
                  <div className="font-bold text-ink">
                    نقاط تریگر چگالی پویا (بر مبنای SG₀ = {initialSG.toFixed(3)}):
                  </div>
                  <div className="font-mono text-xs text-ink-soft flex flex-wrap gap-3 pt-1">
                    <span>SNA-1: {previewPlan.triggers.sna1.toFixed(3)}</span>
                    <span>SNA-2: {previewPlan.triggers.sna2.toFixed(3)}</span>
                    <span>
                      سقف ۱/۳ قند (DAP): {previewPlan.triggers.oneThirdCeiling.toFixed(3)}
                    </span>
                    <span>SNA-3: {previewPlan.triggers.sna3.toFixed(3)}</span>
                    <span>پرسینگ: {previewPlan.triggers.pressingSG.toFixed(3)}</span>
                  </div>
                </div>

                <div className="text-xs space-y-1 bg-surface border border-line rounded-xl p-3">
                  <div className="font-bold text-ink flex items-center gap-1.5">
                    <FlaskConical className="w-3.5 h-3.5 text-wine" />
                    <span>مقادیر کلیدی محاسبه‌شده برای هر مخزن قرمز:</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-xs font-mono text-ink">
                    <span>
                      KMS کراش:{' '}
                      {Math.round(
                        previewPlan.dosages.crushKmsPerTankG * (2 / tankCount) * 100
                      ) / 100}{' '}
                      g
                    </span>
                    <span>
                      مخمر RC-212:{' '}
                      {Math.round(
                        previewPlan.dosages.yeastRedPerTankG * (2 / tankCount) * 100
                      ) / 100}{' '}
                      g
                    </span>
                    <span>
                      Fermaid O (SNA-1):{' '}
                      {Math.round(
                        previewPlan.dosages.fermaidO1RedPerTankG * (2 / tankCount) * 100
                      ) / 100}{' '}
                      g
                    </span>
                    <span>
                      Fermaid K (SNA-2):{' '}
                      {Math.round(
                        previewPlan.dosages.fermaidK2RedPerTankG * (2 / tankCount) * 100
                      ) / 100}{' '}
                      g
                    </span>
                    <span>
                      DAP (SNA-2):{' '}
                      {Math.round(
                        previewPlan.dosages.dap2RedPerTankG * (2 / tankCount) * 100
                      ) / 100}{' '}
                      g
                    </span>
                    <span>
                      Bactiless (روز ۱۱):{' '}
                      {Math.round(
                        previewPlan.dosages.bactilessRedPerTankG * (2 / tankCount) * 100
                      ) / 100}{' '}
                      g
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer Navigation Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-line">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3 | 4 | 5)}
                className="px-4 py-2 rounded-xl bg-paper border border-line hover:bg-stone-200/60 text-ink text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowRight className="w-4 h-4" />
                <span>مرحله قبل</span>
              </button>
            ) : (
              <div />
            )}

            {step < 5 ? (
              <button
                type="button"
                onClick={() => setStep((s) => (s + 1) as 1 | 2 | 3 | 4 | 5)}
                className="px-5 py-2.5 rounded-xl bg-wine hover:opacity-90 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <span>مرحله بعد</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCompleteOnboarding}
                className="px-5 py-2.5 rounded-xl bg-wine hover:opacity-90 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>شروع فصل و ساخت بچ واقعی (حذف داده‌های نمونه)</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
