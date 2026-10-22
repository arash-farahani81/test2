import React, { useState } from 'react';
import {
  Sliders,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Scale,
  FlaskConical,
  Thermometer,
  RefreshCw
} from 'lucide-react';
import {
  useFlexibleProtocol,
  FLEXIBLE_PARAM_METADATA,
  IDEAL_DEFAULT_PROTOCOL_PARAMS,
  type DynamicProtocolPlan,
  type FlexibleProtocolParams
} from '../data/masterProtocolConfig.ts';

interface FlexibleProtocolCustomizerBarProps {
  onSyncToCalculators?: (plan: DynamicProtocolPlan) => void;
  defaultExpanded?: boolean;
  compact?: boolean;
}

export const FlexibleProtocolCustomizerBar: React.FC<FlexibleProtocolCustomizerBarProps> = ({
  onSyncToCalculators,
  defaultExpanded = false
}) => {
  const {
    params,
    plan,
    updateParam,
    applyPreset,
    resetParamToIdeal,
    resetAllToIdeal,
    isModifiedFromIdeal
  } = useFlexibleProtocol();

  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);
  const [activeCategory, setActiveCategory] = useState<
    'all' | 'harvest' | 'volumes' | 'dosages' | 'thresholds'
  >('all');
  const [syncSuccess, setSyncSuccess] = useState(false);

  const filteredMeta =
    activeCategory === 'all'
      ? FLEXIBLE_PARAM_METADATA
      : FLEXIBLE_PARAM_METADATA.filter((m) => m.category === activeCategory);

  const handleSyncClick = () => {
    if (onSyncToCalculators) {
      onSyncToCalculators(plan);
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 3000);
    }
  };

  return (
    <div className="bg-surface border border-line rounded-xl p-5 text-ink shadow-sm font-['Vazirmatn',sans-serif] no-print space-y-4">
      {/* Top Header & Quick Preset Bar */}
      <div className="space-y-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-paper border border-line text-ink-soft shrink-0 mt-0.5">
              <Sliders className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-ink">
                  موتور پارامتریک و انعطاف‌پذیر مستر پروتکل (Ideal Default + Full User Flexibility)
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-md font-bold bg-paper border border-line text-ink-soft">
                  {params.presetId === 'conservative_ideal'
                    ? 'پیش‌فرض ایده‌آل علمی (محافظه‌کارانه نسخه ۲)'
                    : params.presetId === 'classic_v32'
                    ? 'پروفایل کلاسیک مستر پروتکل (نسخه ۳.۲)'
                    : 'پروفایل شخصی‌سازی‌شده اپراتور (Custom)'}
                </span>
              </div>
              <p className="text-xs text-ink-soft leading-relaxed">
                تمامی پارامترها به صورت پیش‌فرض روی <strong className="text-ink">مقادیر ایده‌آل علمی و محافظه‌کارانه</strong> تنظیم شده‌اند، اما می‌توانید هر عدد را متناسب با شرایط واقعی کارگاه خود تغییر دهید و با یک کلیک به مقدار ایده‌آل بازگردانید.
              </p>
            </div>
          </div>

          {/* Preset & Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => applyPreset('conservative_ideal')}
              className={`px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-all ${
                params.presetId === 'conservative_ideal'
                  ? 'bg-wine text-white font-bold'
                  : 'bg-paper border border-line text-ink hover:bg-stone-200/60 font-bold'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>پیش‌فرض ایده‌آل علمی (۹۳L/مخزن)</span>
            </button>

            <button
              type="button"
              onClick={() => applyPreset('classic_v32')}
              className={`px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-all ${
                params.presetId === 'classic_v32'
                  ? 'bg-wine text-white font-bold'
                  : 'bg-paper border border-line text-ink hover:bg-stone-200/60 font-bold'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>کلاسیک نسخه ۳.۲ (۱۰۰L/مخزن)</span>
            </button>

            {isModifiedFromIdeal && (
              <button
                type="button"
                onClick={resetAllToIdeal}
                className="px-3 py-1.5 rounded-xl bg-paper border border-line text-ink-soft hover:text-ink text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                title="بازگرداندن تمامی متغیرها به مقادیر ایده‌آل پیشنهادی"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>بازنشانی کامل به ایده‌آل</span>
              </button>
            )}

            {onSyncToCalculators && (
              <button
                type="button"
                onClick={handleSyncClick}
                className="px-3 py-1.5 rounded-xl bg-wine text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>همگام‌سازی با ماشین‌حساب‌ها</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsExpanded((prev) => !prev)}
              className="px-3 py-1.5 rounded-xl bg-paper border border-line text-ink-soft hover:text-ink text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <span>{isExpanded ? 'بستن پنل تنظیمات' : `شخصی‌سازی پارامترها (${FLEXIBLE_PARAM_METADATA.length})`}</span>
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {syncSuccess && (
          <div className="p-2.5 rounded-xl bg-emerald-50 border border-ok/30 text-ok text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>ورودی تمام ماشین‌حساب‌ها با پارامترهای پروتکل فعال شما همگام‌سازی شد!</span>
          </div>
        )}

        {/* Live Computed Protocol Snapshot Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-2 border-t border-line text-xs">
          <div className="bg-paper/70 border border-line rounded-lg p-3">
            <span className="text-xs text-ink-soft block">انگور و قند اولیه:</span>
            <strong className="text-sm font-bold text-ink ltr-metric block mt-0.5">
              {params.grapeWeightKg}kg · {params.initialBrix}°Bx ({params.initialSG.toFixed(3)})
            </strong>
          </div>
          <div className="bg-paper/70 border border-line rounded-lg p-3">
            <span className="text-xs text-ink-soft block">فاز مایع تخمیر قرمز:</span>
            <strong className="text-sm font-bold text-ink ltr-metric block mt-0.5">
              {plan.volumes.redLiquidFermentPerTankL}L × 2 = {plan.volumes.redLiquidFermentTotalL}L
            </strong>
          </div>
          <div className="bg-paper/70 border border-line rounded-lg p-3">
            <span className="text-xs text-ink-soft block">آبشار پس از پرس (هر مخزن):</span>
            <strong className="text-sm font-bold text-ink ltr-metric block mt-0.5">
              {plan.volumes.freeRunPerTankL}L → {plan.volumes.rack1PerTankL}L → {plan.volumes.finalRedPerTankL}L
            </strong>
          </div>
          <div className="bg-paper/70 border border-line rounded-lg p-3">
            <span className="text-xs text-ink-soft block">شراب رُزه و پرس سنگین:</span>
            <strong className="text-sm font-bold text-ink ltr-metric block mt-0.5">
              رُزه {plan.volumes.roseFinalBottlingL}L | پرس {plan.volumes.heavyPressTotalL}L
            </strong>
          </div>
          <div className="bg-paper/70 border border-line rounded-lg p-3">
            <span className="text-xs text-ink-soft block">نیتروژن شیمیایی / زیستی:</span>
            <strong className="text-sm font-bold text-ink ltr-metric block mt-0.5">
              {plan.nitrogen.suppliedChemicalYANRedMgL} / {plan.nitrogen.suppliedBioEquivalentYANRedMgL} mg/L
            </strong>
          </div>
          <div className="bg-paper/70 border border-line rounded-lg p-3">
            <span className="text-xs text-ink-soft block">کل محصول نهایی (۷۵۰mL):</span>
            <strong className="text-sm font-bold text-ink ltr-metric block mt-0.5">
              {plan.volumes.totalBottles750ml} بطری ({plan.volumes.redBottles750ml} قرمز + {plan.volumes.roseBottles750ml} رُزه)
            </strong>
          </div>
        </div>
      </div>

      {/* Expandable Parameter Customization Grid */}
      {isExpanded && (
        <div className="p-4 sm:p-5 bg-paper/50 border border-line rounded-xl text-ink space-y-4">
          {/* Category Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-line">
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => setActiveCategory('all')}
                className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer transition-colors ${
                  activeCategory === 'all'
                    ? 'bg-wine text-white'
                    : 'bg-surface text-ink border border-line hover:bg-paper'
                }`}
              >
                همه متغیرها ({FLEXIBLE_PARAM_METADATA.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('harvest')}
                className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer transition-colors flex items-center gap-1 ${
                  activeCategory === 'harvest'
                    ? 'bg-wine text-white'
                    : 'bg-surface text-ink border border-line hover:bg-paper'
                }`}
              >
                <Scale className="w-3.5 h-3.5" />
                <span>۱. برداشت، قند و pH</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('volumes')}
                className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer transition-colors flex items-center gap-1 ${
                  activeCategory === 'volumes'
                    ? 'bg-wine text-white'
                    : 'bg-surface text-ink border border-line hover:bg-paper'
                }`}
              >
                <FlaskConical className="w-3.5 h-3.5" />
                <span>۲. موازنه حجم و آبشار پرسینگ</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('dosages')}
                className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer transition-colors flex items-center gap-1 ${
                  activeCategory === 'dosages'
                    ? 'bg-wine text-white'
                    : 'bg-surface text-ink border border-line hover:bg-paper'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>۳. دوزهای شیمیایی و ریزمغذی</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('thresholds')}
                className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer transition-colors flex items-center gap-1 ${
                  activeCategory === 'thresholds'
                    ? 'bg-wine text-white'
                    : 'bg-surface text-ink border border-line hover:bg-paper'
                }`}
              >
                <Thermometer className="w-3.5 h-3.5" />
                <span>۴. آستانه‌های دما و پرسینگ</span>
              </button>
            </div>

            <span className="text-xs text-ink-soft">
              هر تغییر بلافاصله در حافظه مرورگر ذخیره شده و جدول ۱۹ ردیفه BOM و موازنه حجم را بازمحاسبه می‌کند.
            </span>
          </div>

          {/* Parameter Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredMeta.map((meta) => {
              const currentValue = params[meta.key];
              const isIdeal = currentValue === IDEAL_DEFAULT_PROTOCOL_PARAMS[meta.key];

              return (
                <div
                  key={meta.key}
                  className={`p-3.5 rounded-xl border transition-all space-y-2 text-xs ${
                    isIdeal
                      ? 'bg-surface border-line'
                      : 'bg-amber-50/50 border-warn/60 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <label className="font-bold text-ink leading-snug">
                      {meta.labelFa}
                    </label>
                    <span className="px-2 py-0.5 rounded bg-paper border border-line text-ink-soft font-mono text-xs font-bold shrink-0">
                      ایده‌آل: {meta.idealValue} {meta.unit}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        type="number"
                        min={meta.min}
                        max={meta.max}
                        step={meta.step}
                        value={currentValue}
                        onChange={(e) => {
                          const parsed = parseFloat(e.target.value);
                          if (!Number.isNaN(parsed)) {
                            updateParam(
                              meta.key,
                              parsed as FlexibleProtocolParams[typeof meta.key]
                            );
                          }
                        }}
                        className="w-full rounded-lg border border-line bg-surface px-3 py-1.5 text-sm font-bold font-mono tabular-nums text-ink accent-[#6e1f2f] focus:border-wine focus:outline-none"
                      />
                    </div>
                    <span className="text-xs font-mono font-bold text-ink-soft shrink-0">
                      {meta.unit}
                    </span>
                    {!isIdeal && (
                      <button
                        type="button"
                        onClick={() => resetParamToIdeal(meta.key)}
                        className="px-2 py-1.5 rounded-lg bg-paper border border-line text-ink-soft hover:text-ink text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0 transition-colors"
                        title={`بازگرداندن به مقدار ایده‌آل (${meta.idealValue})`}
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>ایده‌آل</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-ink-soft">
                    <span>{meta.noteFa}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
