import React, { useEffect, useMemo, useState } from 'react';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  FlaskConical,
  PackageCheck,
  Scale,
  Sliders,
  Sparkles,
  Thermometer,
  X
} from 'lucide-react';
import {
  DEFAULT_EQUIPMENT_PROFILE_PRO,
  EQUIPMENT_PRESET_ARTISAN_HOME,
  EQUIPMENT_PRESET_MINIMAL_PLUS,
  type CellarEquipmentProfile
} from '../types/index.ts';
import {
  evaluateEquipmentCapabilities,
  type EquipmentProfileInput
} from '../utils/equipmentAdapterEngine.ts';
import {
  useEnologyUi,
  type ScalePrecisionGrams
} from '../context/EnologyUiContext.tsx';

export interface EquipmentOnboardingWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ExtendedReagentsDraft {
  hasKms: boolean;
  hasTartaricAcid: boolean;
  hasPecticEnzyme: boolean;
  hasGoFerm: boolean;
  hasFermaidO: boolean;
  hasFermaidKOrDap: boolean;
  hasEnologicalTannins: boolean;
  hasBactilessChitosan: boolean;
  hasPotassiumBitartrateKht: boolean;
  hasCopperSulfate: boolean;
  hasAscorbicAcid: boolean;
}

interface WizardDraftState {
  profile: CellarEquipmentProfile;
  densityModeUi:
    | 'both'
    | 'hydrometer_only'
    | 'hydrometer_15_5c'
    | 'refractometer_only'
    | 'none_sensory';
  scalePrecisionGrams: ScalePrecisionGrams;
  hasPrecisionScale: boolean;
  hasGraduatedSyringes: boolean;
  hasGraduatedCylinder100ml: boolean;
  hasClinitestRsKit: boolean;
  agingVesselUi: 'carboy_20l' | 'demijohn_5l_10l' | 'stainless_keg';
  reagents11: ExtendedReagentsDraft;
}

function buildInitialDraft(
  profile: CellarEquipmentProfile,
  scalePrecision: ScalePrecisionGrams
): WizardDraftState {
  const isMinimal = profile.presetId === 'minimal_plus_kit';
  const isPro = profile.presetId === 'full_sardasht_pro';

  return {
    profile: {
      ...profile,
      reagents: { ...profile.reagents }
    },
    densityModeUi: profile.densityInstrument,
    scalePrecisionGrams: profile.hasPrecisionScale001g ? scalePrecision : 1,
    hasPrecisionScale: profile.hasPrecisionScale001g,
    hasGraduatedSyringes: true,
    hasGraduatedCylinder100ml: !isMinimal,
    hasClinitestRsKit: isPro,
    agingVesselUi:
      profile.agingVesselConfig === 'partial_headspace_vessels'
        ? 'demijohn_5l_10l'
        : profile.agingVesselConfig === 'oak_barrel_or_ss'
          ? 'stainless_keg'
          : 'carboy_20l',
    reagents11: {
      hasKms: true,
      hasTartaricAcid: true,
      hasPecticEnzyme: !isMinimal,
      hasGoFerm: !isMinimal,
      hasFermaidO: profile.reagents.hasFermaidOAndK,
      hasFermaidKOrDap: profile.reagents.hasFermaidOAndK,
      hasEnologicalTannins: !isMinimal,
      hasBactilessChitosan: profile.reagents.hasBactilessOrLysozyme,
      hasPotassiumBitartrateKht: isPro,
      hasCopperSulfate: profile.reagents.hasCopperSulfate,
      hasAscorbicAcid: profile.reagents.hasAscorbicAcid
    }
  };
}

export const EquipmentOnboardingWizardModal: React.FC<
  EquipmentOnboardingWizardModalProps
> = ({ isOpen, onClose }) => {
  const {
    equipmentProfile,
    scalePrecision,
    isEquipmentOnboardingCompleted,
    saveEquipmentProfile
  } = useEnologyUi();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [draft, setDraft] = useState<WizardDraftState>(() =>
    buildInitialDraft(equipmentProfile, scalePrecision)
  );

  useEffect(() => {
    if (isOpen) {
      setDraft(buildInitialDraft(equipmentProfile, scalePrecision));
      setStep(1);
    }
  }, [isOpen, equipmentProfile, scalePrecision]);

  const adapterInput = useMemo<EquipmentProfileInput>(() => {
    return {
      ...draft.profile,
      densityInstrument: draft.densityModeUi,
      scalePrecisionGrams: draft.scalePrecisionGrams,
      hasPrecisionScale: draft.hasPrecisionScale,
      hasGraduatedSyringes: draft.hasGraduatedSyringes,
      hasPaperChromatography: draft.profile.hasPaperChromatographyMLF,
      hasClinitestRsKit: draft.hasClinitestRsKit,
      agingVesselType: draft.agingVesselUi,
      produceRoseSaignee: draft.profile.producesRoseSaignee,
      availableReagents: draft.reagents11
    };
  }, [draft]);

  const draftCapabilities = useMemo(
    () => evaluateEquipmentCapabilities(adapterInput),
    [adapterInput]
  );

  if (!isOpen) {
    return null;
  }

  const handleSelectPreset = (
    preset: CellarEquipmentProfile,
    saveImmediately: boolean = false
  ) => {
    const nextScale: ScalePrecisionGrams = preset.hasPrecisionScale001g ? 0.01 : 1;
    const nextDraft = buildInitialDraft(preset, nextScale);
    setDraft(nextDraft);
    if (saveImmediately) {
      saveEquipmentProfile(
        {
          ...preset,
          reagents: { ...preset.reagents },
          scalePrecisionGrams: nextScale,
          hasPrecisionScale: preset.hasPrecisionScale001g
        },
        true
      );
      onClose();
    }
  };

  const updateProfileField = <K extends keyof CellarEquipmentProfile>(
    key: K,
    value: CellarEquipmentProfile[K]
  ) => {
    setDraft((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        [key]: value,
        presetId: 'custom'
      }
    }));
  };

  const toggleReagent11 = (key: keyof ExtendedReagentsDraft) => {
    setDraft((prev) => {
      const nextReagents11 = {
        ...prev.reagents11,
        [key]: !prev.reagents11[key]
      };
      const nextCoreReagents: CellarEquipmentProfile['reagents'] = {
        ...prev.profile.reagents,
        hasBactilessOrLysozyme: nextReagents11.hasBactilessChitosan,
        hasFermaidOAndK:
          nextReagents11.hasFermaidO || nextReagents11.hasFermaidKOrDap,
        hasAscorbicAcid: nextReagents11.hasAscorbicAcid,
        hasCopperSulfate: nextReagents11.hasCopperSulfate
      };
      return {
        ...prev,
        reagents11: nextReagents11,
        profile: {
          ...prev.profile,
          presetId: 'custom',
          reagents: nextCoreReagents
        }
      };
    });
  };

  const handleConfirmAndSave = () => {
    saveEquipmentProfile(
      {
        ...draft.profile,
        reagents: { ...draft.profile.reagents },
        scalePrecisionGrams: draft.scalePrecisionGrams,
        hasPrecisionScale: draft.hasPrecisionScale,
        produceRoseSaignee: draft.profile.producesRoseSaignee,
        availableReagents: draft.reagents11
      },
      true
    );
    onClose();
  };

  const stepTabs: { id: 1 | 2 | 3 | 4 | 5 | 6; labelFa: string }[] = [
    { id: 1, labelFa: '۱. قند و ترازو' },
    { id: 2, labelFa: '۲. کیت‌های آزمایشگاه' },
    { id: 3, labelFa: '۳. مخازن و گالن‌ها' },
    { id: 4, labelFa: '۴. دما، پرس و سیفون' },
    { id: 5, labelFa: '۵. مواد موجود' },
    { id: 6, labelFa: '۶. پیش‌نمایش و تأیید' }
  ];

  const reagentCards: {
    key: keyof ExtendedReagentsDraft;
    titleFa: string;
    roleFa: string;
  }[] = [
    {
      key: 'hasKms',
      titleFa: 'متابیسولفیت پتاسیم (KMS)',
      roleFa: 'آنتی‌اکسیدان و ضدعفونی‌کننده اصلی'
    },
    {
      key: 'hasTartaricAcid',
      titleFa: 'اسید تارتاریک خوراکی',
      roleFa: 'تنظیم اسیدیته (TA) و کاهش pH شیره'
    },
    {
      key: 'hasPecticEnzyme',
      titleFa: 'آنزیم پکتولیتیک',
      roleFa: 'افزایش آب‌دهی و شفافیت شیره'
    },
    {
      key: 'hasGoFerm',
      titleFa: 'مغذی آبرسانی مخمر (Go-Ferm)',
      roleFa: 'تقویت غشای مخمر در استارتر اولیه'
    },
    {
      key: 'hasFermaidO',
      titleFa: 'مغذی نیتروژن آلی (Fermaid O)',
      roleFa: 'تغذیه مرحله ۱ و ۳ بدون شوک حرارتی'
    },
    {
      key: 'hasFermaidKOrDap',
      titleFa: 'مغذی Fermaid K / دی‌آمونیم فسفات (DAP)',
      roleFa: 'تأمین نیتروژن معدنی در اوج تخمیر'
    },
    {
      key: 'hasEnologicalTannins',
      titleFa: 'تانن انولوژیک (قرمز/سفید)',
      roleFa: 'تثبیت رنگ آنتوسیانین و ساختار دهانی'
    },
    {
      key: 'hasBactilessChitosan',
      titleFa: 'کیتوزان (Bactiless)',
      roleFa: 'قفل بیولوژیک باکتری‌های مالولاکتیک در روز ۱۱'
    },
    {
      key: 'hasPotassiumBitartrateKht',
      titleFa: 'پودر کرم تارتار (KHT)',
      roleFa: 'بذر هسته‌زایی در تثبیت سرد (روز ۶۵)'
    },
    {
      key: 'hasCopperSulfate',
      titleFa: 'سولفات مس (محلول ۱٪)',
      roleFa: 'رفع بوی گوگرد و تخم‌مرغ گندیده (H2S)'
    },
    {
      key: 'hasAscorbicAcid',
      titleFa: 'اسید اسکوربیک (ویتامین C)',
      roleFa: 'هم‌افزایی ضد اکسیداسیون پیش از بطری‌گیری'
    }
  ];

  return (
    <div
      data-testid="equipment-onboarding-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 overflow-y-auto font-['Vazirmatn',sans-serif]"
      dir="rtl"
    >
      <div className="bg-surface border border-line rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-paper border-b border-line px-4 sm:px-6 py-4 flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-wine shrink-0" />
              <h2 className="text-base sm:text-lg font-bold text-ink">
                پیکربندی تجهیزات و موجودی کارگاه شراب‌سازی (شخصی‌سازی هوشمند کل برنامه)
              </h2>
            </div>
            <p className="text-xs text-ink-soft leading-relaxed">
              بر اساس ابزارها، مخازن، دقت ترازو و مواد شیمیایی موجود در کارگاه شما، تمام فرمول‌ها، واحد دوزها (گرم یا میلی‌لیتر محلول استوک با سرنگ)، دروازه بطری‌گیری و ۴۶ گام نقشه راه به صورت خودکار بازآرایی می‌شوند.
            </p>
          </div>
          {isEquipmentOnboardingCompleted && (
            <button
              type="button"
              onClick={onClose}
              aria-label="بستن"
              className="p-1.5 rounded-lg text-ink-soft hover:text-ink hover:bg-surface border border-transparent hover:border-line cursor-pointer shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Quick-Preset Strip */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-ink flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-wine shrink-0" />
              <span>انتخاب سریع از ۳ تیپ استاندارد کارگاهی (یا شخصی‌سازی گام‌به‌گام در پایین):</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                {
                  preset: DEFAULT_EQUIPMENT_PROFILE_PRO,
                  titleFa: 'حرفه‌ای کامل سردشت',
                  descFa: 'هیدرومتر + رفراکتومتر، ترازوی ۰.۰۱ گرم، کیت SO2/TA/pH، ۲ مخزن قرمز + رُزه و تمام معرف‌ها'
                },
                {
                  preset: EQUIPMENT_PRESET_ARTISAN_HOME,
                  titleFa: 'کارگاه خانگی استاندارد',
                  descFa: 'هیدرومتر، ترازوی دقیق، pH متر، تک‌مخزن قرمز (بدون رُزه)، سیفون ثقلی و خنک‌سازی با بطری یخ'
                },
                {
                  preset: EQUIPMENT_PRESET_MINIMAL_PLUS,
                  titleFa: 'مینیمال و سنتی ارتقاءیافته',
                  descFa: 'هیدرومتر، ترازوی آشپزخانه ۱ گرمی + سرنگ استوک، کاغذ pH، کیسه توری پرس دستی و جایگزین‌های طبیعی'
                }
              ].map((card) => {
                const isSelected = draft.profile.presetId === card.preset.presetId;
                return (
                  <div
                    key={card.preset.presetId}
                    className={`rounded-xl border p-3.5 flex flex-col justify-between gap-3 transition-colors ${
                      isSelected
                        ? 'border-wine bg-wine/5'
                        : 'border-line bg-paper'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-ink">
                          {card.titleFa}
                        </span>
                        {isSelected && (
                          <span className="px-2 py-0.5 rounded-md bg-wine text-white text-xs font-bold">
                            فعال
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-ink-soft leading-relaxed">
                        {card.descFa}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleSelectPreset(card.preset, false)}
                        className="flex-1 py-1.5 px-2 rounded-lg border border-line bg-surface hover:border-wine text-xs font-bold text-ink cursor-pointer"
                      >
                        انتخاب و شخصی‌سازی
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSelectPreset(card.preset, true)}
                        className="flex-1 py-1.5 px-2 rounded-lg bg-wine text-white text-xs font-bold hover:opacity-95 cursor-pointer"
                      >
                        اعمال فوری و شروع کار
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 6-Step Progress Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-1.5 bg-paper p-1.5 rounded-xl border border-line">
            {stepTabs.map((t) => {
              const active = step === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setStep(t.id)}
                  className={`py-2 px-2 rounded-lg text-xs font-bold transition-colors cursor-pointer truncate ${
                    active
                      ? 'bg-wine text-white'
                      : 'text-ink-soft hover:text-ink hover:bg-surface'
                  }`}
                >
                  {t.labelFa}
                </button>
              );
            })}
          </div>

          {/* Step 1: Sugar & Scale */}
          {step === 1 && (
            <div className="space-y-4 bg-paper border border-line rounded-xl p-4">
              <div className="flex items-center gap-2 text-sm font-bold text-ink border-b border-line pb-2.5">
                <Scale className="w-4 h-4 text-wine shrink-0" />
                <span>گام ۱: ابزار سنجش قند/دانسیته و دقت ترازوی توزین</span>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-ink">
                  ابزار اندازه‌گیری قند و پیشرفت تخمیر:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(
                    [
                      {
                        id: 'both',
                        core: 'both',
                        label: 'هیدرومتر (۲۰°C) + رفراکتومتر نوری (هر دو موجود)'
                      },
                      {
                        id: 'hydrometer_only',
                        core: 'hydrometer_only',
                        label: 'فقط هیدرومتر شیشه‌ای کالیبره ۲۰°C'
                      },
                      {
                        id: 'hydrometer_15_5c',
                        core: 'hydrometer_only',
                        label: 'هیدرومتر شیشه‌ای کالیبره ۱۵.۵°C (60°F)'
                      },
                      {
                        id: 'refractometer_only',
                        core: 'refractometer_only',
                        label: 'فقط رفراکتومتر نوری (نیازمند فرمول تصحیح الکل)'
                      },
                      {
                        id: 'none_sensory',
                        core: 'hydrometer_only',
                        label: 'فاقد ابزار قندسنج (مدیریت حسی و تقویمی)'
                      }
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setDraft((prev) => ({
                          ...prev,
                          densityModeUi: opt.id,
                          profile: {
                            ...prev.profile,
                            densityInstrument: opt.core,
                            presetId: 'custom'
                          }
                        }));
                      }}
                      className={`p-3 rounded-xl border text-right text-xs font-bold transition-colors cursor-pointer ${
                        draft.densityModeUi === opt.id
                          ? 'border-wine bg-wine/10 text-ink'
                          : 'border-line bg-surface text-ink-soft hover:text-ink'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="block text-xs font-bold text-ink">
                  دقت ترازوی دیجیتال کارگاه:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {(
                    [
                      {
                        val: 0.01 as ScalePrecisionGrams,
                        label: '۰.۰۱ گرم (ترازوی زرگری دقیق)'
                      },
                      {
                        val: 0.1 as ScalePrecisionGrams,
                        label: '۰.۱ گرم (ترازوی آزمایشگاهی/قهوه)'
                      },
                      {
                        val: 1 as ScalePrecisionGrams,
                        label: '۱ گرم (ترازوی آشپزخانه — نیازمند محلول استوک)'
                      }
                    ]
                  ).map((opt) => (
                    <button
                      key={opt.val}
                      type="button"
                      onClick={() => {
                        setDraft((prev) => ({
                          ...prev,
                          scalePrecisionGrams: opt.val,
                          hasPrecisionScale: opt.val !== 1,
                          profile: {
                            ...prev.profile,
                            hasPrecisionScale001g: opt.val === 0.01,
                            presetId: 'custom'
                          }
                        }));
                      }}
                      className={`p-3 rounded-xl border text-xs font-bold cursor-pointer ${
                        draft.scalePrecisionGrams === opt.val
                          ? 'border-wine bg-wine/10 text-ink'
                          : 'border-line bg-surface text-ink-soft hover:text-ink'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                <label className="flex items-center gap-2 bg-surface border border-line rounded-xl p-3 text-xs font-bold text-ink cursor-pointer">
                  <input
                    type="checkbox"
                    checked={draft.hasPrecisionScale}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        hasPrecisionScale: e.target.checked,
                        profile: {
                          ...prev.profile,
                          hasPrecisionScale001g: e.target.checked,
                          presetId: 'custom'
                        }
                      }))
                    }
                  />
                  <span>ترازوی دیجیتال سالم و کالیبره</span>
                </label>

                <label className="flex items-center gap-2 bg-surface border border-line rounded-xl p-3 text-xs font-bold text-ink cursor-pointer">
                  <input
                    type="checkbox"
                    checked={draft.hasGraduatedSyringes}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        hasGraduatedSyringes: e.target.checked
                      }))
                    }
                  />
                  <span>سرنگ‌های مدرج ۱، ۵ و ۱۰ میلی‌لیتری</span>
                </label>

                <label className="flex items-center gap-2 bg-surface border border-line rounded-xl p-3 text-xs font-bold text-ink cursor-pointer">
                  <input
                    type="checkbox"
                    checked={draft.hasGraduatedCylinder100ml}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        hasGraduatedCylinder100ml: e.target.checked
                      }))
                    }
                  />
                  <span>مزور / استوانه مدرج ۱۰۰ میلی‌لیتری</span>
                </label>
              </div>
            </div>
          )}

          {/* Step 2: Lab Kits */}
          {step === 2 && (
            <div className="space-y-4 bg-paper border border-line rounded-xl p-4">
              <div className="flex items-center gap-2 text-sm font-bold text-ink border-b border-line pb-2.5">
                <FlaskConical className="w-4 h-4 text-wine shrink-0" />
                <span>گام ۲: کیت‌ها و تجهیزات آزمایشگاهی (pH، اسیدیته کل و سولفیت آزاد)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-ink">
                    ابزار سنجش اسیدیته فعال (pH):
                  </label>
                  {(
                    [
                      { id: 'digital_001', label: 'pH متر دیجیتال کالیبره (۰.۰۱)' },
                      { id: 'strips_or_pocket', label: 'کاغذ pH بازه باریک شراب / قلمی ساده' },
                      { id: 'none', label: 'فاقد ابزار سنجش pH' }
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => updateProfileField('phInstrument', opt.id)}
                      className={`w-full p-2.5 rounded-xl border text-right text-xs font-bold cursor-pointer ${
                        draft.profile.phInstrument === opt.id
                          ? 'border-wine bg-wine/10 text-ink'
                          : 'border-line bg-surface text-ink-soft hover:text-ink'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-ink">
                    ابزار سنجش اسیدیته کل (TA):
                  </label>
                  {(
                    [
                      { id: 'naoh_burette', label: 'بورت تیتراسیون با سود ۰.۱ نرمال' },
                      { id: 'colorimetric_kit', label: 'کیت قطره‌ای تغییر رنگ (Drop Kit)' },
                      { id: 'none', label: 'فاقد کیت سنجش TA' }
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => updateProfileField('taInstrument', opt.id)}
                      className={`w-full p-2.5 rounded-xl border text-right text-xs font-bold cursor-pointer ${
                        draft.profile.taInstrument === opt.id
                          ? 'border-wine bg-wine/10 text-ink'
                          : 'border-line bg-surface text-ink-soft hover:text-ink'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-ink">
                    ابزار سنجش سولفیت آزاد (Free SO2):
                  </label>
                  {(
                    [
                      { id: 'ripper_iodine', label: 'کیت تیتراسیون یدومتری ریپر (Ripper)' },
                      { id: 'aeration_oxidation', label: 'دستگاه تقطیر هوادهی-اکسیداسیون (A/O)' },
                      { id: 'none', label: 'فاقد کیت SO2 (محاسبه از دفتر کل KMS)' }
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => updateProfileField('so2Instrument', opt.id)}
                      className={`w-full p-2.5 rounded-xl border text-right text-xs font-bold cursor-pointer ${
                        draft.profile.so2Instrument === opt.id
                          ? 'border-wine bg-wine/10 text-ink'
                          : 'border-line bg-surface text-ink-soft hover:text-ink'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                <label className="flex items-center gap-2 bg-surface border border-line rounded-xl p-3 text-xs font-bold text-ink cursor-pointer">
                  <input
                    type="checkbox"
                    checked={draft.profile.hasPaperChromatographyMLF}
                    onChange={(e) =>
                      updateProfileField(
                        'hasPaperChromatographyMLF',
                        e.target.checked
                      )
                    }
                  />
                  <span>کیت کروماتوگرافی کاغذی اسید مالیک / لاکتیک (MLF)</span>
                </label>

                <label className="flex items-center gap-2 bg-surface border border-line rounded-xl p-3 text-xs font-bold text-ink cursor-pointer">
                  <input
                    type="checkbox"
                    checked={draft.hasClinitestRsKit}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        hasClinitestRsKit: e.target.checked
                      }))
                    }
                  />
                  <span>قرص Clinitest یا کیت سنجش قند باقی‌مانده (RS)</span>
                </label>
              </div>
            </div>
          )}

          {/* Step 3: Tanks & Carboys */}
          {step === 3 && (
            <div className="space-y-4 bg-paper border border-line rounded-xl p-4">
              <div className="flex items-center gap-2 text-sm font-bold text-ink border-b border-line pb-2.5">
                <Sliders className="w-4 h-4 text-wine shrink-0" />
                <span>گام ۳: آرایش مخازن تخمیر، گالن‌های ایجینگ، شراب رُزه و گاز خنثی</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-ink">
                    آرایش مخازن تخمیر قرمز:
                  </label>
                  {(
                    [
                      {
                        id: 'dual_220l_split',
                        tanks: 2 as const,
                        label: 'دو مخزن مجزا (مخزن A و B — تفکیک ریسک)'
                      },
                      {
                        id: 'single_primary',
                        tanks: 1 as const,
                        label: 'تک‌مخزن یکپارچه (۱ مخزن قرمز)'
                      },
                      {
                        id: 'small_30_60l_barrels',
                        tanks: 1 as const,
                        label: 'بشکه کوچک ۳۰ تا ۶۰ لیتری خانگی'
                      }
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setDraft((prev) => ({
                          ...prev,
                          profile: {
                            ...prev.profile,
                            redTankConfig: opt.id,
                            primaryTankCount: opt.tanks,
                            presetId: 'custom'
                          }
                        }));
                      }}
                      className={`w-full p-2.5 rounded-xl border text-right text-xs font-bold cursor-pointer ${
                        draft.profile.redTankConfig === opt.id
                          ? 'border-wine bg-wine/10 text-ink'
                          : 'border-line bg-surface text-ink-soft hover:text-ink'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-ink">
                    ظروف ایجینگ پس از پرسینگ:
                  </label>
                  {(
                    [
                      {
                        ui: 'carboy_20l',
                        core: 'carboys_132l_no_headspace',
                        label: 'کاربوی / گالن شیشه‌ای ۲۰ لیتری'
                      },
                      {
                        ui: 'demijohn_5l_10l',
                        core: 'partial_headspace_vessels',
                        label: 'دمیجان / گالن‌های ۵ و ۱۰ لیتری'
                      },
                      {
                        ui: 'stainless_keg',
                        core: 'oak_barrel_or_ss',
                        label: 'مخزن استیل ۵۰ لیتری / بشکه بلوط'
                      }
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.ui}
                      type="button"
                      onClick={() =>
                        setDraft((prev) => ({
                          ...prev,
                          agingVesselUi: opt.ui,
                          profile: {
                            ...prev.profile,
                            agingVesselConfig: opt.core,
                            presetId: 'custom'
                          }
                        }))
                      }
                      className={`w-full p-2.5 rounded-xl border text-right text-xs font-bold cursor-pointer ${
                        draft.agingVesselUi === opt.ui
                          ? 'border-wine bg-wine/10 text-ink'
                          : 'border-line bg-surface text-ink-soft hover:text-ink'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-ink">
                    سیستم محافظت گاز خنثی (فضای خالی):
                  </label>
                  {(
                    [
                      {
                        id: 'co2_cylinder_or_dry_ice',
                        label: 'کپسول CO2 / آرگون یا یخ خشک خوراکی'
                      },
                      {
                        id: 'argon_or_wine_saver',
                        label: 'اسپری آرگون / پمپ وکیوم دستی'
                      },
                      {
                        id: 'none',
                        label: 'فاقد گاز خنثی (استفاده از Top-up و تیله شیشه‌ای)'
                      }
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => updateProfileField('inertGasSystem', opt.id)}
                      className={`w-full p-2.5 rounded-xl border text-right text-xs font-bold cursor-pointer ${
                        draft.profile.inertGasSystem === opt.id
                          ? 'border-wine bg-wine/10 text-ink'
                          : 'border-line bg-surface text-ink-soft hover:text-ink'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex items-center justify-between gap-3 bg-surface border border-line rounded-xl p-3.5 text-xs font-bold text-ink cursor-pointer">
                <span>
                  تولید شراب رُزه سانیه جانبی (۳۴ تا ۳۶ لیتر) در کنار شراب قرمز اصلی
                </span>
                <input
                  type="checkbox"
                  checked={draft.profile.producesRoseSaignee}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      profile: {
                        ...prev.profile,
                        producesRoseSaignee: e.target.checked,
                        roseTankVolumeL: e.target.checked ? 34 : 0,
                        presetId: 'custom'
                      }
                    }))
                  }
                />
              </label>
            </div>
          )}

          {/* Step 4: Temperature, Pressing & Racking */}
          {step === 4 && (
            <div className="space-y-4 bg-paper border border-line rounded-xl p-4">
              <div className="flex items-center gap-2 text-sm font-bold text-ink border-b border-line pb-2.5">
                <Thermometer className="w-4 h-4 text-wine shrink-0" />
                <span>گام ۴: کنترل دما، تثبیت سرد، روش پرسینگ و سیفون/بطری‌گیری</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-ink">
                    سیستم خنک‌کاری مخزن حین تخمیر:
                  </label>
                  {(
                    [
                      {
                        id: 'glycol_or_split_ac',
                        label: 'چیلر گلیکول / کولر گازی اسپلیت مستقیم'
                      },
                      {
                        id: 'ice_bottles_and_wet_towel',
                        label: 'بطری‌های یخ استریل + حوله خیس و پنکه'
                      },
                      {
                        id: 'ambient_only',
                        label: 'فقط دمای طبیعی محیط کارگاه'
                      }
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => updateProfileField('coolingSystem', opt.id)}
                      className={`w-full p-2.5 rounded-xl border text-right text-xs font-bold cursor-pointer ${
                        draft.profile.coolingSystem === opt.id
                          ? 'border-wine bg-wine/10 text-ink'
                          : 'border-line bg-surface text-ink-soft hover:text-ink'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-ink">
                    روش تثبیت سرد تارتارات (روز ۶۵ تا ۷۹):
                  </label>
                  {(
                    [
                      {
                        id: 'fridge_or_winter_balcony',
                        label: 'یخچال اختصاصی تثبیت سرد (-2°C تا +2°C)'
                      },
                      {
                        id: 'natural_winter_cellar',
                        label: 'سرمای طبیعی شب‌های زمستان / بالکن سرپوشیده'
                      },
                      {
                        id: 'none_warm_climate',
                        label: 'حذف تثبیت سرد (نگهداری بطری در دمای بالای ۱۰ درجه)'
                      }
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() =>
                        updateProfileField('coldStabilizationMethod', opt.id)
                      }
                      className={`w-full p-2.5 rounded-xl border text-right text-xs font-bold cursor-pointer ${
                        draft.profile.coldStabilizationMethod === opt.id
                          ? 'border-wine bg-wine/10 text-ink'
                          : 'border-line bg-surface text-ink-soft hover:text-ink'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-ink">
                    روش پرسینگ و جداسازی تفاله (SG 1.008):
                  </label>
                  {(
                    [
                      {
                        id: 'basket_press_mesh',
                        label: 'پرس سبدی مکانیکی ملایم (Basket Press)'
                      },
                      {
                        id: 'nylon_straining_bag_manual',
                        label: 'کیسه توری استریل و آبگیری ثقلی/دستی ملایم'
                      },
                      {
                        id: 'pneumatic_or_bladder',
                        label: 'پرس بادی / پنوماتیک (حداکثر ۱.۲ بار)'
                      }
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => updateProfileField('pressingMethod', opt.id)}
                      className={`w-full p-2.5 rounded-xl border text-right text-xs font-bold cursor-pointer ${
                        draft.profile.pressingMethod === opt.id
                          ? 'border-wine bg-wine/10 text-ink'
                          : 'border-line bg-surface text-ink-soft hover:text-ink'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-ink">
                    روش سیفون (Racking) و بطری‌گیری نهایی:
                  </label>
                  {(
                    [
                      {
                        id: 'pump_and_045_cartridge',
                        label: 'پمپ ملایم + فیلتراسیون کارتریجی ۰.۴۵ میکرون'
                      },
                      {
                        id: 'gravity_siphon_decant_only',
                        label: 'سیفون ثقلی با شلنگ غذایی و شفافیت طبیعی (بدون فیلتر)'
                      }
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() =>
                        updateProfileField('transferAndBottlingMethod', opt.id)
                      }
                      className={`w-full p-2.5 rounded-xl border text-right text-xs font-bold cursor-pointer ${
                        draft.profile.transferAndBottlingMethod === opt.id
                          ? 'border-wine bg-wine/10 text-ink'
                          : 'border-line bg-surface text-ink-soft hover:text-ink'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Available Reagents */}
          {step === 5 && (
            <div className="space-y-4 bg-paper border border-line rounded-xl p-4">
              <div className="flex items-center justify-between gap-2 border-b border-line pb-2.5 flex-wrap">
                <div className="flex items-center gap-2 text-sm font-bold text-ink">
                  <PackageCheck className="w-4 h-4 text-wine shrink-0" />
                  <span>گام ۵: موجودی مواد شیمیایی و افزودنی‌های انولوژیک کارگاه</span>
                </div>
                <span className="text-xs text-ink-soft">
                  هر ماده‌ای که در کارگاه ندارید را غیرفعال کنید تا دستورالعمل جایگزین علمی فعال شود
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {reagentCards.map((item) => {
                  const isAvailable = draft.reagents11[item.key];
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => toggleReagent11(item.key)}
                      className={`p-3 rounded-xl border text-right transition-colors cursor-pointer flex flex-col justify-between gap-2 ${
                        isAvailable
                          ? 'border-line bg-surface'
                          : 'border-warn bg-amber-50/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 w-full">
                        <span className="text-xs font-bold text-ink">
                          {item.titleFa}
                        </span>
                        <input
                          type="checkbox"
                          checked={isAvailable}
                          readOnly
                          className="pointer-events-none mt-0.5"
                        />
                      </div>
                      <div className="flex items-center justify-between gap-2 w-full">
                        <span className="text-xs text-ink-soft">{item.roleFa}</span>
                        <span
                          className={`px-2 py-0.5 rounded-md text-xs font-bold shrink-0 inline-flex items-center gap-1 ${
                            isAvailable
                              ? 'bg-emerald-100 text-ok'
                              : 'bg-amber-100 text-warn'
                          }`}
                        >
                          {isAvailable ? (
                            <>
                              <Check className="w-3 h-3 shrink-0" />
                              <span>موجود در کارگاه</span>
                            </>
                          ) : (
                            <span>ناموجود — فعال‌سازی پروتکل جایگزین علمی</span>
                          )}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 6: Live Adaptation Summary */}
          {step === 6 && (
            <div className="space-y-4 bg-paper border border-line rounded-xl p-4">
              <div className="flex items-center gap-2 text-sm font-bold text-ink border-b border-line pb-2.5">
                <Sparkles className="w-4 h-4 text-wine shrink-0" />
                <span>گام ۶: پیش‌نمایش بازآرایی هوشمند برنامه بر اساس تجهیزات شما</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <div className="bg-surface border border-line rounded-xl p-3 space-y-1">
                  <div className="text-xs text-ink-soft">عنوان پروفایل فعال:</div>
                  <div className="text-xs font-bold text-ink">
                    {draftCapabilities.presetTitleFa}
                  </div>
                </div>

                <div className="bg-surface border border-line rounded-xl p-3 space-y-1">
                  <div className="text-xs text-ink-soft">حالت ورودی قند و دمای مرجع:</div>
                  <div className="text-xs font-bold text-ink">
                    {draftCapabilities.primarySugarInputMode === 'refractometer_brix'
                      ? 'رفراکتومتر (بریکس با تصحیح الکل)'
                      : draftCapabilities.primarySugarInputMode === 'sensory_timeline'
                        ? 'تقویم حسی تخمیر (بدون هیدرومتر)'
                        : `هیدرومتر استاندارد (${draftCapabilities.defaultHydrometerCalibrationTemp}°C)`}
                  </div>
                </div>

                <div className="bg-surface border border-line rounded-xl p-3 space-y-1">
                  <div className="text-xs text-ink-soft">تعداد مخازن قرمز و وضعیت رُزه:</div>
                  <div className="text-xs font-bold text-ink">
                    {draftCapabilities.effectiveTankCount} مخزن قرمز •{' '}
                    {draftCapabilities.produceRoseSaignee
                      ? 'همراه با رُزه سانیه'
                      : 'بدون رُزه سانیه'}
                  </div>
                </div>

                <div className="bg-surface border border-line rounded-xl p-3 space-y-1">
                  <div className="text-xs text-ink-soft">ظروف ایجینگ مورد نیاز:</div>
                  <div className="text-xs font-bold text-ink ltr-metric">
                    {draftCapabilities.totalRedCarboysCount} ×{' '}
                    {draftCapabilities.agingCarboyUnitL}L
                  </div>
                </div>

                <div className="bg-surface border border-line rounded-xl p-3 space-y-1">
                  <div className="text-xs text-ink-soft">حالت توزین دوزهای زیر ۵ گرم:</div>
                  <div className="text-xs font-bold text-ink">
                    {draft.scalePrecisionGrams === 0.01
                      ? 'توزین مستقیم گرم (ترازوی ۰.۰۱g)'
                      : 'محلول استوک و سرنگ مدرج (mL)'}
                  </div>
                </div>

                <div className="bg-surface border border-line rounded-xl p-3 space-y-1">
                  <div className="text-xs text-ink-soft">پروتکل‌های جایگزین فعال‌شده:</div>
                  <div className="text-xs font-bold text-wine">
                    {draftCapabilities.activeSubstitutionsCount} تطبیق علمی فعال
                  </div>
                </div>
              </div>

              {draftCapabilities.missingReagentsListFa.length > 0 && (
                <div className="bg-amber-50/80 border border-warn rounded-xl p-3.5 space-y-1.5">
                  <div className="text-xs font-bold text-warn">
                    مواد ناموجود که برنامه برای آن‌ها دستورالعمل جایگزین علمی فعال می‌کند:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {draftCapabilities.missingReagentsListFa.map((item) => (
                      <span
                        key={item}
                        className="px-2.5 py-1 rounded-lg bg-surface border border-warn text-xs font-bold text-ink"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-paper border-t border-line px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={step === 1}
              onClick={() =>
                setStep((s) => (s > 1 ? ((s - 1) as 1 | 2 | 3 | 4 | 5 | 6) : s))
              }
              className="px-3 py-2 rounded-xl border border-line bg-surface text-xs font-bold text-ink disabled:opacity-40 inline-flex items-center gap-1 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
              <span>مرحله قبل</span>
            </button>
            {step < 6 && (
              <button
                type="button"
                onClick={() =>
                  setStep((s) => (s < 6 ? ((s + 1) as 1 | 2 | 3 | 4 | 5 | 6) : s))
                }
                className="px-3 py-2 rounded-xl border border-line bg-surface text-xs font-bold text-ink inline-flex items-center gap-1 cursor-pointer"
              >
                <span>مرحله بعد</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isEquipmentOnboardingCompleted && (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-line bg-surface text-xs font-bold text-ink-soft hover:text-ink cursor-pointer"
              >
                بستن
              </button>
            )}
            <button
              type="button"
              onClick={handleConfirmAndSave}
              className="px-4 py-2 rounded-xl bg-wine text-white text-xs font-bold hover:opacity-95 inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4 shrink-0" />
              <span>ذخیره پروفایل تجهیزات و بازآرایی برنامه</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
