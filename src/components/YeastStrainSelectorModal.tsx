import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  Check,
  FlaskConical,
  Search,
  ShieldCheck,
  Sparkles,
  Thermometer,
  X
} from 'lucide-react';
import { TankId } from '../types';
import { GlobalTankSelection, useEnologyUi } from '../context/EnologyUiContext';
import { useFlexibleProtocol } from '../data/masterProtocolConfig';
import {
  YEAST_STRAINS_DATABASE,
  YeastBrand,
  YeastCategory,
  YeastH2sRisk,
  YeastYanDemand,
  computeYeastAcidityAndGlycerolImpact,
  computeYeastAdjustedSnaPlan,
  getYeastStrainById,
  recommendYeastStrainsForGoal
} from '../data/yeastStrainsData';

export interface YeastStrainSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTankId?: TankId;
}

type GoalRecommendationKey =
  | 'classic_sardasht_red'
  | 'velvety_reserve_red'
  | 'natural_acidity_boost'
  | 'zero_h2s_safety'
  | 'aromatic_saignee_rose'
  | 'stuck_fermentation_rescue';

type GoalFilterChoice = GoalRecommendationKey | 'none';

const YEAST_BRAND_LIST: YeastBrand[] = [
  'Lallemand',
  'Laffort',
  'Fermentis',
  'Enartis',
  'Anchor',
  'Maurivin',
  'Red Star',
  'Renaissance',
  'Chr. Hansen'
];

const YEAST_CATEGORY_LABELS_FA: Record<YeastCategory, string> = {
  structured_red: 'قرمز ساختارمند و تاننی',
  silky_premium_red: 'قرمز مخملی و ذخیره (Reserve)',
  fruity_red_rose: 'قرمز و رُزه میوه‌ای',
  aromatic_rose_white: 'رُزه و سفید معطر (تیول/استر)',
  high_abv_restart: 'تحمل الکل بالا و ری‌استارت',
  heritage_classic: 'کلاسیک اروپایی و ঐতিحی',
  biotech_zero_h2s_bioacid: 'بیوتکنولوژی (Zero-H2S / اسیدزا)'
};

const GOAL_CHIPS: { id: GoalFilterChoice; labelFa: string }[] = [
  { id: 'none', labelFa: 'همه ۳۶ سویه' },
  { id: 'classic_sardasht_red', labelFa: 'قرمز ساختارمند و کهنه‌پذیر رشه' },
  { id: 'zero_h2s_safety', labelFa: 'تخمیر فوق‌ایمن بدون بوی گوگرد (Zero-H2S)' },
  { id: 'velvety_reserve_red', labelFa: 'قرمز میوه‌ای و نرم (کاهش مالیک بدون MLF)' },
  { id: 'aromatic_saignee_rose', labelFa: 'رُزه معطر و خنک (Saignée Rosé)' },
  { id: 'stuck_fermentation_rescue', labelFa: 'شیرینی بالا / ری‌استارت تخمیر متوقف' },
  { id: 'natural_acidity_boost', labelFa: 'تعدیل اسیدیته اقلیم گرم (اسیدزایی زیستی)' }
];

const CATEGORY_KEYS: YeastCategory[] = [
  'structured_red',
  'silky_premium_red',
  'fruity_red_rose',
  'aromatic_rose_white',
  'high_abv_restart',
  'heritage_classic',
  'biotech_zero_h2s_bioacid'
];

export const YeastStrainSelectorModal: React.FC<YeastStrainSelectorModalProps> = ({
  isOpen,
  onClose,
  initialTankId
}) => {
  const {
    selectedTank,
    availableTankOptions,
    selectedYeastByTank,
    getYeastStrainForTank,
    setSelectedYeastForTank,
    activeBatch
  } = useEnologyUi();

  const { params } = useFlexibleProtocol();

  const defaultRedMashVolumeL = Math.round(((params.grapeWeightKg || 400) * 0.865) / 2 - 16) || 157;
  const defaultRoseVolumeL = 32;

  const resolveInitialTarget = (): GlobalTankSelection => {
    if (initialTankId) return initialTankId;
    return selectedTank;
  };

  const [targetTank, setTargetTank] = useState<GlobalTankSelection>(resolveInitialTarget);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<YeastBrand | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<YeastCategory | 'all'>('all');
  const [selectedGoal, setSelectedGoal] = useState<GoalFilterChoice>('none');

  const currentAssignedStrain = useMemo(() => {
    const checkTank: TankId = targetTank === 'both-red' ? 'tank-a' : targetTank;
    return getYeastStrainForTank(checkTank);
  }, [targetTank, getYeastStrainForTank, selectedYeastByTank]);

  const [previewStrainId, setPreviewStrainId] = useState<string>(currentAssignedStrain.id);
  const [previewMustBrix, setPreviewMustBrix] = useState<number>(params.initialBrix || 24);
  const [previewVolumeL, setPreviewVolumeL] = useState<number>(
    targetTank === 'tank-rose' ? defaultRoseVolumeL : defaultRedMashVolumeL
  );
  const [hasFermaidK, setHasFermaidK] = useState<boolean>(true);

  useEffect(() => {
    if (!isOpen) return;
    const nextTarget: GlobalTankSelection = initialTankId ?? selectedTank;
    setTargetTank(nextTarget);
    const checkTank: TankId = nextTarget === 'both-red' ? 'tank-a' : nextTarget;
    const assigned = getYeastStrainForTank(checkTank);
    setPreviewStrainId(assigned.id);
    setPreviewMustBrix(params.initialBrix || 24);
    setPreviewVolumeL(
      nextTarget === 'tank-rose' ? defaultRoseVolumeL : defaultRedMashVolumeL
    );
  }, [
    isOpen,
    initialTankId,
    selectedTank,
    getYeastStrainForTank,
    params.initialBrix,
    defaultRoseVolumeL,
    defaultRedMashVolumeL
  ]);

  const handleSelectTargetVessel = (nextVessel: GlobalTankSelection) => {
    setTargetTank(nextVessel);
    const checkTank: TankId = nextVessel === 'both-red' ? 'tank-a' : nextVessel;
    const strain = getYeastStrainForTank(checkTank);
    setPreviewStrainId(strain.id);
    setPreviewVolumeL(
      nextVessel === 'tank-rose' ? defaultRoseVolumeL : defaultRedMashVolumeL
    );
  };

  const hasTankB = useMemo(
    () => availableTankOptions.some((t) => t.id === 'tank-b') || availableTankOptions.length > 2,
    [availableTankOptions]
  );
  const hasRoseTank = useMemo(
    () =>
      availableTankOptions.some((t) => t.id === 'tank-rose') ||
      activeBatch?.targetStyle === 'rose',
    [availableTankOptions, activeBatch?.targetStyle]
  );

  const filteredStrains = useMemo(() => {
    const baseList =
      selectedGoal !== 'none'
        ? recommendYeastStrainsForGoal(selectedGoal)
        : YEAST_STRAINS_DATABASE;

    const q = searchQuery.trim().toLowerCase();
    return baseList.filter((strain) => {
      if (selectedBrand !== 'all' && strain.brand !== selectedBrand) return false;
      if (selectedCategory !== 'all' && strain.category !== selectedCategory) return false;
      if (!q) return true;
      const haystack = [
        strain.code,
        strain.brand,
        strain.nameEn,
        strain.nameFa,
        strain.species,
        strain.aromaProfileFa,
        strain.sardashtEngineeringNoteFa,
        strain.h2sRiskLevel === 'zero_biotech' ? 'no-h2s zero-h2s' : ''
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [selectedGoal, selectedBrand, selectedCategory, searchQuery]);

  const isRosePreview = targetTank === 'tank-rose';
  const previewStrain = useMemo(
    () => getYeastStrainById(previewStrainId, isRosePreview),
    [previewStrainId, isRosePreview]
  );

  const snaPlan = useMemo(() => {
    const approxSG = Number(
      (1 + previewMustBrix / (258.6 - (previewMustBrix / 258.2) * 227.1)).toFixed(4)
    );
    return computeYeastAdjustedSnaPlan({
      strainId: previewStrain.id,
      isRose: isRosePreview,
      volumeL: previewVolumeL,
      brix: previewMustBrix,
      initialSG: approxSG
    });
  }, [previewStrain.id, isRosePreview, previewVolumeL, previewMustBrix]);

  const acidityImpact = useMemo(
    () =>
      computeYeastAcidityAndGlycerolImpact({
        strainId: previewStrain.id,
        isRose: isRosePreview,
        initialTA: typeof activeBatch?.initialTA === 'number' ? activeBatch.initialTA : 5.4,
        initialPH: typeof activeBatch?.initialPH === 'number' ? activeBatch.initialPH : 3.72,
        defaultMaxGlycerinGL: 7.0
      }),
    [previewStrain.id, isRosePreview, activeBatch?.initialTA, activeBatch?.initialPH]
  );

  const targetTankLabelFa = useMemo(() => {
    if (targetTank === 'tank-a') return 'مخزن قرمز A';
    if (targetTank === 'tank-b') return 'مخزن قرمز B';
    if (targetTank === 'tank-rose') return 'گالن رُزه (Saignée)';
    return 'هر دو مخزن قرمز (A+B)';
  }, [targetTank]);

  if (!isOpen) return null;

  const tankAStrain = getYeastStrainForTank('tank-a');
  const tankBStrain = getYeastStrainForTank('tank-b');
  const tankRoseStrain = getYeastStrainForTank('tank-rose');

  const formatYanLabelFa = (level: YeastYanDemand) =>
    level === 'low' ? 'کم' : level === 'medium' ? 'متوسط' : 'بالا';

  const formatH2sLabelFa = (risk: YeastH2sRisk) =>
    risk === 'zero_biotech'
      ? 'صفر زیستی'
      : risk === 'very_low'
        ? 'بسیار کم'
        : risk === 'low'
          ? 'کم'
          : risk === 'medium'
            ? 'متوسط'
            : 'بالا';

  return (
    <div
      data-testid="yeast-strain-selector-modal"
      dir="rtl"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 font-['Vazirmatn',sans-serif]"
      onClick={onClose}
    >
      <div
        className="bg-surface text-ink border border-line rounded-2xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-4 sm:px-6 py-3.5 bg-paper border-b border-line flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-wine/10 text-wine border border-wine/20 flex items-center justify-center shrink-0">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-bold text-ink truncate">
                دانشنامه مهندسی و انتخابگر ۳۶ سویه مخمر شراب‌سازی جهانی (Global Oenological Yeast Atlas)
              </h2>
              <p className="text-xs text-ink-soft truncate">
                کالیبراسیون خودکار دوز تلقیح، نیتروژن قابل جذب (YAN)، سقف دمای کلاهک، اسیدیته و ریسک H2S به تفکیک هر مخزن
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="بستن پنجره انتخاب مخمر"
            className="p-1.5 rounded-lg border border-line bg-surface text-ink-soft hover:text-ink cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Section 1: Target Vessel & Goal Recommender Bar */}
          <div className="bg-paper border border-line rounded-xl p-3.5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-ink flex items-center gap-1.5">
                <FlaskConical className="w-3.5 h-3.5 text-wine" />
                <span>انتخاب مخزن هدف برای تخصیص سویه مخمر:</span>
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleSelectTargetVessel('tank-a')}
                  className={`px-3 py-1.5 rounded-lg text-xs border transition-colors cursor-pointer flex items-center gap-1.5 ${
                    targetTank === 'tank-a'
                      ? 'bg-wine text-white border-wine font-bold'
                      : 'bg-surface text-ink border-line hover:border-wine font-medium'
                  }`}
                >
                  <span>مخزن قرمز A</span>
                  <span className="ltr-metric px-1.5 py-0.5 rounded bg-black/15 text-xs">
                    {tankAStrain.code}
                  </span>
                </button>

                {hasTankB && (
                  <button
                    type="button"
                    onClick={() => handleSelectTargetVessel('tank-b')}
                    className={`px-3 py-1.5 rounded-lg text-xs border transition-colors cursor-pointer flex items-center gap-1.5 ${
                      targetTank === 'tank-b'
                        ? 'bg-wine text-white border-wine font-bold'
                        : 'bg-surface text-ink border-line hover:border-wine font-medium'
                    }`}
                  >
                    <span>مخزن قرمز B</span>
                    <span className="ltr-metric px-1.5 py-0.5 rounded bg-black/15 text-xs">
                      {tankBStrain.code}
                    </span>
                  </button>
                )}

                {hasTankB && (
                  <button
                    type="button"
                    onClick={() => handleSelectTargetVessel('both-red')}
                    className={`px-3 py-1.5 rounded-lg text-xs border transition-colors cursor-pointer flex items-center gap-1.5 ${
                      targetTank === 'both-red'
                        ? 'bg-wine text-white border-wine font-bold'
                        : 'bg-surface text-ink border-line hover:border-wine font-medium'
                    }`}
                  >
                    <span>هر دو مخزن قرمز (A+B)</span>
                    <span className="ltr-metric px-1.5 py-0.5 rounded bg-black/15 text-xs">
                      {tankAStrain.id === tankBStrain.id
                        ? tankAStrain.code
                        : `${tankAStrain.code} / ${tankBStrain.code}`}
                    </span>
                  </button>
                )}

                {hasRoseTank && (
                  <button
                    type="button"
                    onClick={() => handleSelectTargetVessel('tank-rose')}
                    className={`px-3 py-1.5 rounded-lg text-xs border transition-colors cursor-pointer flex items-center gap-1.5 ${
                      targetTank === 'tank-rose'
                        ? 'bg-wine text-white border-wine font-bold'
                        : 'bg-surface text-ink border-line hover:border-wine font-medium'
                    }`}
                  >
                    <span>گالن رُزه (Saignée)</span>
                    <span className="ltr-metric px-1.5 py-0.5 rounded bg-black/15 text-xs">
                      {tankRoseStrain.code}
                    </span>
                  </button>
                )}
              </div>
            </div>

            {/* 6 Quick Goal Recommendation Chips */}
            <div className="pt-2 border-t border-line space-y-1.5">
              <div className="text-xs font-bold text-ink-soft flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-wine" />
                <span>پیشنهادگر هوشمند بر اساس هدف شراب‌سازی (Goal-Based Recommender):</span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {GOAL_CHIPS.map((chip) => {
                  const active = selectedGoal === chip.id;
                  return (
                    <button
                      key={chip.id}
                      type="button"
                      onClick={() => {
                        setSelectedGoal(chip.id);
                        if (chip.id !== 'none') {
                          const recs = recommendYeastStrainsForGoal(chip.id);
                          if (recs.length > 0) {
                            setPreviewStrainId(recs[0].id);
                          }
                        }
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs border transition-colors cursor-pointer ${
                        active
                          ? 'bg-wine text-white border-wine font-bold'
                          : 'bg-surface text-ink-soft border-line hover:text-ink hover:border-wine font-medium'
                      }`}
                    >
                      {chip.labelFa}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 2: Search, Brand & Category Filters */}
          <div className="bg-paper border border-line rounded-xl p-3.5 space-y-2.5">
            <div className="relative">
              <Search className="w-4 h-4 text-ink-soft absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجوی کد مخمر، برند، گونه یا ویژگی معطر... (مثلاً EC-1118، Laffort، Lachancea، No-H2S)"
                className="w-full pr-9 pl-3 py-2 rounded-lg border border-line bg-surface text-xs text-ink placeholder:text-ink-soft focus:outline-none focus:border-wine"
              />
            </div>

            {/* Brand filter pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-bold text-ink-soft ml-1">برند:</span>
              <button
                type="button"
                onClick={() => setSelectedBrand('all')}
                className={`px-2.5 py-1 rounded-md text-xs border cursor-pointer ${
                  selectedBrand === 'all'
                    ? 'bg-wine text-white border-wine font-bold'
                    : 'bg-surface text-ink-soft border-line hover:text-ink'
                }`}
              >
                همه برندها
              </button>
              {YEAST_BRAND_LIST.map((brand) => (
                <button
                  key={brand}
                  type="button"
                  onClick={() => setSelectedBrand(brand)}
                  className={`px-2.5 py-1 rounded-md text-xs border cursor-pointer ltr-metric ${
                    selectedBrand === brand
                      ? 'bg-wine text-white border-wine font-bold'
                      : 'bg-surface text-ink-soft border-line hover:text-ink'
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>

            {/* Category filter pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-bold text-ink-soft ml-1">طبقه مهندسی:</span>
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`px-2.5 py-1 rounded-md text-xs border cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-wine text-white border-wine font-bold'
                    : 'bg-surface text-ink-soft border-line hover:text-ink'
                }`}
              >
                همه طبقه‌ها
              </button>
              {CATEGORY_KEYS.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-md text-xs border cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-wine text-white border-wine font-bold'
                      : 'bg-surface text-ink-soft border-line hover:text-ink'
                  }`}
                >
                  {YEAST_CATEGORY_LABELS_FA[cat]}
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Split Grid: 36-Strain Interactive List + Live Bioprocess Engineering Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            {/* Left/Top Column: Strain Cards List */}
            <div className="lg:col-span-7 space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
              <div className="flex items-center justify-between text-xs text-ink-soft px-1">
                <span>
                  سویه‌های منطبق:{' '}
                  <strong className="text-ink ltr-metric">{filteredStrains.length}</strong> از ۳۶ سویه جهانی
                </span>
                <span>برای پیش‌نمایش استوکیومتری روی کارت سویه کلیک کنید</span>
              </div>

              {filteredStrains.map((strain) => {
                const isPreviewSelected = previewStrain.id === strain.id;
                const isAssignedA = tankAStrain.id === strain.id;
                const isAssignedB = hasTankB && tankBStrain.id === strain.id;
                const isAssignedRose = hasRoseTank && tankRoseStrain.id === strain.id;

                return (
                  <div
                    key={strain.id}
                    data-testid={`yeast-card-${strain.id}`}
                    onClick={() => setPreviewStrainId(strain.id)}
                    className={`rounded-xl border p-3 transition-colors cursor-pointer space-y-2 ${
                      isPreviewSelected
                        ? 'border-wine bg-wine/5 shadow-xs'
                        : 'border-line bg-surface hover:border-wine/50'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="ltr-metric text-sm font-bold text-ink">
                          {strain.code}
                        </span>
                        <span className="ltr-metric px-2 py-0.5 rounded-md bg-paper border border-line text-xs font-medium text-ink">
                          {strain.brand}
                        </span>
                        <span className="ltr-metric text-xs text-ink-soft italic">
                          {strain.species}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-paper border border-line text-xs text-ink-soft">
                          {YEAST_CATEGORY_LABELS_FA[strain.category]}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-1">
                        {isAssignedA && (
                          <span className="px-2 py-0.5 rounded-full bg-ok/15 text-ok border border-ok/30 text-xs font-bold inline-flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            <span>فعال در مخزن A</span>
                          </span>
                        )}
                        {isAssignedB && (
                          <span className="px-2 py-0.5 rounded-full bg-ok/15 text-ok border border-ok/30 text-xs font-bold inline-flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            <span>فعال در مخزن B</span>
                          </span>
                        )}
                        {isAssignedRose && (
                          <span className="px-2 py-0.5 rounded-full bg-wine/15 text-wine border border-wine/30 text-xs font-bold inline-flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            <span>فعال در رُزه</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-ink-soft leading-relaxed line-clamp-2">
                      {strain.aromaProfileFa} — {strain.sardashtEngineeringNoteFa}
                    </p>

                    <div className="flex flex-wrap items-center gap-1.5 text-xs">
                      <span className="px-2 py-0.5 rounded bg-paper border border-line text-ink ltr-metric">
                        ABV تا {strain.alcoholTolerancePct}%
                      </span>
                      <span className="px-2 py-0.5 rounded bg-paper border border-line text-ink ltr-metric inline-flex items-center gap-1">
                        <Thermometer className="w-3 h-3 text-wine" />
                        <span>
                          {strain.tempOptMinC}–{strain.tempOptMaxC}°C
                        </span>
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded border ${
                          strain.yanDemandLevel === 'high'
                            ? 'bg-warn/10 text-warn border-warn/30 font-bold'
                            : 'bg-paper text-ink border-line'
                        }`}
                      >
                        نیاز نیتروژن: {formatYanLabelFa(strain.yanDemandLevel)}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded border ${
                          strain.h2sRiskLevel === 'zero_biotech' || strain.h2sRiskLevel === 'very_low'
                            ? 'bg-ok/10 text-ok border-ok/30 font-bold'
                            : strain.h2sRiskLevel === 'high'
                              ? 'bg-danger/10 text-danger border-danger/30 font-bold'
                              : 'bg-paper text-ink border-line'
                        }`}
                      >
                        ریسک H2S: {formatH2sLabelFa(strain.h2sRiskLevel)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right/Bottom Column: Selected Strain Deep-Dive & Live Stoichiometric Preview */}
            <div
              data-testid="yeast-live-engineering-preview"
              className="lg:col-span-5 bg-paper border border-line rounded-xl p-4 space-y-3.5"
            >
              <div className="border-b border-line pb-2.5 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-ink flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-wine" />
                    <span>پرونده بیوپروسس: {previewStrain.nameFa}</span>
                  </h3>
                  <span className="ltr-metric px-2 py-0.5 rounded bg-wine text-white text-xs font-bold">
                    {previewStrain.code}
                  </span>
                </div>
                <p className="text-xs text-ink leading-relaxed">{previewStrain.aromaProfileFa}</p>
              </div>

              {/* Sensory Descriptors & Rasha Compatibility */}
              <div className="space-y-2 text-xs">
                <div className="flex flex-wrap items-center gap-1">
                  <span className="font-bold text-ink">پروفایل معطر و حسی:</span>
                  <span className="px-2 py-0.5 rounded-md bg-surface border border-line text-ink-soft">
                    {previewStrain.originFa}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-surface border border-line text-ink-soft ltr-metric">
                    تناسب رشه: {previewStrain.sardashtFitScore}/100
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-surface border border-line text-ink leading-relaxed">
                  <strong className="text-wine">تطابق با انگور رشه سردشت: </strong>
                  {previewStrain.sardashtEngineeringNoteFa}
                </div>
                <div className="p-2.5 rounded-lg bg-warn/10 border border-warn/30 text-ink leading-relaxed flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-warn shrink-0 mt-0.5" />
                  <span>
                    <strong className="font-bold">نکته حیاتی کارگاهی: </strong>
                    {previewStrain.requiresHighSterolsGoFerm
                      ? 'این سویه نیازمند بازآوری با Go-Ferm جهت تقویت استرول غشای سلولی و تحمل الکل بالا است.'
                      : 'تغذیه نیتروژن مرحله‌ای (SNA) را حتماً پیش از عبور از سقف ۱/۳ افت قند تکمیل کنید.'}
                  </span>
                </div>
              </div>

              {/* Live Bioprocess Calculator Box */}
              <div className="bg-surface border border-line rounded-xl p-3 space-y-3">
                <div className="text-xs font-bold text-ink border-b border-line pb-2 flex items-center justify-between">
                  <span>شبیه‌ساز زنده استوکیومتری تغذیه (SNA) و اسیدیته</span>
                  <span className="text-ink-soft font-normal">{targetTankLabelFa}</span>
                </div>

                {/* Calculator Inputs */}
                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  <label className="space-y-1">
                    <span className="text-ink-soft block">حجم مخزن (L)</span>
                    <input
                      type="number"
                      min={5}
                      max={2000}
                      step={1}
                      value={previewVolumeL}
                      onChange={(e) =>
                        setPreviewVolumeL(Math.max(5, Number(e.target.value) || 132))
                      }
                      className="w-full px-2.5 py-1.5 rounded-lg border border-line bg-paper text-ink ltr-metric font-bold"
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-ink-soft block">بریکس اولیه (°Bx)</span>
                    <input
                      type="number"
                      min={16}
                      max={32}
                      step={0.5}
                      value={previewMustBrix}
                      onChange={(e) =>
                        setPreviewMustBrix(Math.max(16, Number(e.target.value) || 24))
                      }
                      className="w-full px-2.5 py-1.5 rounded-lg border border-line bg-paper text-ink ltr-metric font-bold"
                    />
                  </label>
                </div>

                <label className="flex items-center gap-2 text-xs text-ink cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasFermaidK}
                    onChange={(e) => setHasFermaidK(e.target.checked)}
                    className="rounded border-line text-wine focus:ring-wine"
                  />
                  <span>دارای مغذی کمپلکس (Fermaid K)</span>
                </label>

                {/* Live Output Metrics */}
                <div className="space-y-2 pt-1 border-t border-line text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-ink-soft">دوز تلقیح مخمر خشک:</span>
                    <span className="ltr-metric font-bold text-ink">
                      {snaPlan.yeastGrams} g ({Math.round(previewStrain.recommendedDoseGL * 100)} g/hL) + Go-Ferm:{' '}
                      {snaPlan.goFermGrams} g در {Math.round(snaPlan.goFermGrams * 20)} mL آب{' '}
                      {previewStrain.rehydrationTempC}°C
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="text-ink-soft">نیاز نیتروژن (YAN Target):</span>
                    <span className="ltr-metric font-bold text-ink">
                      {snaPlan.targetYAN} mg N/L (کسری تخمینی: {snaPlan.neededYAN} mg N/L)
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-paper border border-line space-y-1">
                    <div className="font-bold text-ink">برنامه تغذیه مرحله‌ای (SNA):</div>
                    <div className="ltr-metric text-ink">
                      نوبت اول {snaPlan.fermaidO_1}g Fermaid O | نوبت دوم {snaPlan.dap_2}g DAP +{' '}
                      {hasFermaidK ? `${snaPlan.fermaidK_2}g Fermaid K` : `${snaPlan.fermaidO_3}g Fermaid O`}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="text-ink-soft">اثر زیستی بر اسیدیته و pH:</span>
                    <span className="ltr-metric font-bold text-ink">
                      تغییر اسید مالیک {-previewStrain.malicConsumptionPct}% (TA:{' '}
                      {acidityImpact.predictedFinalTA} g/L, pH: {acidityImpact.predictedFinalPH})
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="text-ink-soft">تولید گلیسرول و حس دهانی:</span>
                    <span className="ltr-metric font-bold text-ink">
                      ~{previewStrain.glycerolYieldGL} g/L | تولید SO2 درون‌زاد: ~
                      {previewStrain.endogenousSo2MgL} mg/L
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Action Bar */}
        <div className="px-4 sm:px-6 py-3.5 bg-paper border-t border-line flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-ink-soft">
            سویه انتخابی برای <strong className="text-ink">{targetTankLabelFa}</strong>:{' '}
            <strong className="text-wine ltr-metric">{previewStrain.code}</strong> (
            {previewStrain.brand})
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl border border-line bg-surface text-xs font-bold text-ink-soft hover:text-ink cursor-pointer"
            >
              انصراف
            </button>
            <button
              type="button"
              data-testid="confirm-select-yeast-btn"
              onClick={() => {
                setSelectedYeastForTank(targetTank, previewStrain.id);
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-wine text-white text-xs font-bold hover:opacity-95 transition-opacity cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>
                تثبیت سویه {previewStrain.code} برای {targetTankLabelFa} و بازمحاسبه پروتکل
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
