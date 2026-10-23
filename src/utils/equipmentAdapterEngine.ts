import type { CellarEquipmentProfile } from '../types/index.ts';
import {
  calculateStockSolutionPlan,
  type ScalePrecisionGrams,
  type StockCompoundCategory
} from './enologyUtils.ts';

export type EquipmentProfileInput = Omit<
  CellarEquipmentProfile,
  'presetId' | 'densityInstrument' | 'pressingMethod' | 'inertGasSystem'
> & {
  presetId: CellarEquipmentProfile['presetId'] | 'minimal_traditional_plus';
  densityInstrument:
    | CellarEquipmentProfile['densityInstrument']
    | 'hydrometer_20c'
    | 'hydrometer_15_5c'
    | 'both_hydro_and_refract'
    | 'none_sensory';
  pressingMethod:
    | CellarEquipmentProfile['pressingMethod']
    | 'mechanical_basket_press'
    | 'bladder_press'
    | 'mesh_bag_gravity_hand';
  inertGasSystem:
    | CellarEquipmentProfile['inertGasSystem']
    | 'co2_cylinder'
    | 'dry_ice_pellets'
    | 'none_topup_marbles';
  redTankConfiguration?: 'dual_split_tanks' | 'single_tank';
  produceRoseSaignee?: boolean;
  agingVesselType?: 'carboy_20l' | 'demijohn_5l_10l' | 'stainless_keg';
  scalePrecisionGrams?: ScalePrecisionGrams;
  hasPrecisionScale?: boolean;
  hasGraduatedSyringes?: boolean;
  hasPaperChromatography?: boolean;
  hasClinitestRsKit?: boolean;
  coldStabMethod?: 'dedicated_fridge' | 'winter_ambient_balcony' | 'skip_cold_stab';
  availableReagents?: Partial<{
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
  }>;
};

export interface EquipmentCapabilitiesSummary {
  presetTitleFa: string;
  shortBadgeFa: string;
  defaultHydrometerCalibrationTemp: 20 | 15.5;
  primarySugarInputMode: 'hydrometer_sg' | 'refractometer_brix' | 'sensory_timeline';
  effectiveTankCount: 1 | 2;
  produceRoseSaignee: boolean;
  agingCarboyUnitL: 20 | 10 | 50;
  redCarboysPerTankCount: number;
  totalRedCarboysCount: number;
  canMeasureFreeSo2Directly: boolean;
  canMeasureTaDirectly: boolean;
  canMeasurePhDirectly: boolean;
  missingReagentsListFa: string[];
  activeSubstitutionsCount: number;
}

export interface EquipmentAdaptedDosePlan {
  executionMode: 'stock_syringe' | 'direct_weigh';
  primaryDoseTextFa: string;
  instructionFa: string;
  stockPlan: ReturnType<typeof calculateStockSolutionPlan>;
}

export interface MilestoneEquipmentAdaptation {
  isApplicable: boolean;
  equipmentBadgeFa: string;
  adaptedHowToFa: string;
  substitutionWarningFa?: string;
}

function resolveReagents(profile: EquipmentProfileInput) {
  const isMinimalPreset =
    profile.presetId === 'minimal_plus_kit' || profile.presetId === 'minimal_traditional_plus';
  const ar = profile.availableReagents;

  return {
    hasKms: ar?.hasKms ?? true,
    hasTartaricAcid: ar?.hasTartaricAcid ?? true,
    hasPecticEnzyme: ar?.hasPecticEnzyme ?? !isMinimalPreset,
    hasGoFerm: ar?.hasGoFerm ?? !isMinimalPreset,
    hasFermaidO: ar?.hasFermaidO ?? profile.reagents.hasFermaidOAndK,
    hasFermaidKOrDap: ar?.hasFermaidKOrDap ?? profile.reagents.hasFermaidOAndK,
    hasEnologicalTannins: ar?.hasEnologicalTannins ?? !isMinimalPreset,
    hasBactilessChitosan: ar?.hasBactilessChitosan ?? profile.reagents.hasBactilessOrLysozyme,
    hasPotassiumBitartrateKht:
      ar?.hasPotassiumBitartrateKht ?? profile.presetId === 'full_sardasht_pro',
    hasCopperSulfate: ar?.hasCopperSulfate ?? profile.reagents.hasCopperSulfate,
    hasAscorbicAcid: ar?.hasAscorbicAcid ?? profile.reagents.hasAscorbicAcid
  };
}

export function evaluateEquipmentCapabilities(
  profile: EquipmentProfileInput,
  postRackRedVolumePerTankL: number = 96
): EquipmentCapabilitiesSummary {
  let presetTitleFa = 'پروفایل تجهیزات شخصی‌سازی‌شده کارگاه';
  let shortBadgeFa = 'شخصی‌سازی‌شده';

  if (profile.presetId === 'full_sardasht_pro') {
    presetTitleFa = 'پروفایل حرفه‌ای کامل سردشت (آزمایشگاهی و کارگاهی)';
    shortBadgeFa = 'حرفه‌ای کامل';
  } else if (profile.presetId === 'standard_artisan_home') {
    presetTitleFa = 'پروفایل کارگاه خانگی استاندارد (نیمه‌حرفه‌ای)';
    shortBadgeFa = 'کارگاه خانگی';
  } else if (
    profile.presetId === 'minimal_traditional_plus' ||
    profile.presetId === 'minimal_plus_kit'
  ) {
    presetTitleFa = 'پروفایل مینیمال و سنتی ارتقاءیافته';
    shortBadgeFa = 'مینیمال ارتقاءیافته';
  }

  const defaultHydrometerCalibrationTemp: 20 | 15.5 =
    profile.densityInstrument === 'hydrometer_15_5c' ? 15.5 : 20;

  const primarySugarInputMode: 'hydrometer_sg' | 'refractometer_brix' | 'sensory_timeline' =
    profile.densityInstrument === 'refractometer_only'
      ? 'refractometer_brix'
      : profile.densityInstrument === 'none_sensory'
        ? 'sensory_timeline'
        : 'hydrometer_sg';

  const effectiveTankCount: 1 | 2 = profile.redTankConfiguration
    ? profile.redTankConfiguration === 'single_tank'
      ? 1
      : 2
    : profile.redTankConfig === 'single_primary' ||
        profile.redTankConfig === 'small_30_60l_barrels' ||
        profile.primaryTankCount === 1
      ? 1
      : 2;

  const produceRoseSaignee = profile.produceRoseSaignee ?? profile.producesRoseSaignee;

  const agingCarboyUnitL: 20 | 10 | 50 = profile.agingVesselType
    ? profile.agingVesselType === 'demijohn_5l_10l'
      ? 10
      : profile.agingVesselType === 'stainless_keg'
        ? 50
        : 20
    : profile.agingVesselConfig === 'partial_headspace_vessels' ||
        profile.redTankConfig === 'small_30_60l_barrels'
      ? 10
      : profile.agingVesselConfig === 'oak_barrel_or_ss'
        ? 50
        : 20;

  const redCarboysPerTankCount = Math.max(1, Math.ceil(postRackRedVolumePerTankL / agingCarboyUnitL));
  const totalRedCarboysCount = redCarboysPerTankCount * effectiveTankCount;

  const canMeasureFreeSo2Directly = profile.so2Instrument !== 'none';
  const canMeasureTaDirectly = profile.taInstrument !== 'none';
  const canMeasurePhDirectly = profile.phInstrument !== 'none';

  const r = resolveReagents(profile);
  const missingReagentsListFa: string[] = [];
  if (!r.hasKms) missingReagentsListFa.push('متابیسولفیت پتاسیم (KMS)');
  if (!r.hasTartaricAcid) missingReagentsListFa.push('اسید تارتاریک');
  if (!r.hasPecticEnzyme) missingReagentsListFa.push('آنزیم پکتولیتیک');
  if (!r.hasGoFerm) missingReagentsListFa.push('Go-Ferm');
  if (!r.hasFermaidO) missingReagentsListFa.push('Fermaid O');
  if (!r.hasFermaidKOrDap) missingReagentsListFa.push('Fermaid K / DAP');
  if (!r.hasEnologicalTannins) missingReagentsListFa.push('تانن انولوژیک');
  if (!r.hasBactilessChitosan) missingReagentsListFa.push('کیتوزان (Bactiless)');
  if (!r.hasPotassiumBitartrateKht) missingReagentsListFa.push('کرم تارتار (KHT)');
  if (!r.hasCopperSulfate) missingReagentsListFa.push('سولفات مس');
  if (!r.hasAscorbicAcid) missingReagentsListFa.push('اسید اسکوربیک');

  let equipmentFallbacks = 0;
  if (profile.inertGasSystem === 'none_topup_marbles' || profile.inertGasSystem === 'none') {
    equipmentFallbacks += 1;
  }
  if (
    profile.pressingMethod === 'mesh_bag_gravity_hand' ||
    profile.pressingMethod === 'nylon_straining_bag_manual'
  ) {
    equipmentFallbacks += 1;
  }
  const hasDedicatedFridge = profile.coldStabMethod
    ? profile.coldStabMethod === 'dedicated_fridge'
    : profile.coldStabilizationMethod === 'fridge_or_winter_balcony';
  if (!hasDedicatedFridge) {
    equipmentFallbacks += 1;
  }
  if (profile.so2Instrument === 'none') {
    equipmentFallbacks += 1;
  }

  const activeSubstitutionsCount = missingReagentsListFa.length + equipmentFallbacks;

  return {
    presetTitleFa,
    shortBadgeFa,
    defaultHydrometerCalibrationTemp,
    primarySugarInputMode,
    effectiveTankCount,
    produceRoseSaignee,
    agingCarboyUnitL,
    redCarboysPerTankCount,
    totalRedCarboysCount,
    canMeasureFreeSo2Directly,
    canMeasureTaDirectly,
    canMeasurePhDirectly,
    missingReagentsListFa,
    activeSubstitutionsCount
  };
}

export function formatDoseForEquipment(params: {
  targetDoseGrams: number;
  compoundNameFa: string;
  compoundCategory?: StockCompoundCategory;
  profile: EquipmentProfileInput;
}): EquipmentAdaptedDosePlan {
  const scalePrecisionGrams: ScalePrecisionGrams =
    params.profile.scalePrecisionGrams ?? (params.profile.hasPrecisionScale001g ? 0.01 : 1);
  const hasPrecisionScale =
    params.profile.hasPrecisionScale ?? params.profile.hasPrecisionScale001g;
  const hasGraduatedSyringes = params.profile.hasGraduatedSyringes ?? true;

  const stockPlan = calculateStockSolutionPlan(
    params.targetDoseGrams,
    scalePrecisionGrams,
    params.compoundCategory ?? 'general'
  );

  const useStockSyringe =
    (!hasPrecisionScale || stockPlan.needsStockSolution) &&
    stockPlan.canUseStockSolution &&
    hasGraduatedSyringes;

  return {
    executionMode: useStockSyringe ? 'stock_syringe' : 'direct_weigh',
    primaryDoseTextFa: useStockSyringe
      ? `${stockPlan.syringeVolumeMl} mL از محلول استوک (${stockPlan.stockMassGrams}g در ${stockPlan.stockVolumeMl}mL)`
      : `${params.targetDoseGrams} g (توزین مستقیم)`,
    instructionFa: useStockSyringe
      ? stockPlan.instructionFa
      : `مقدار ${params.targetDoseGrams} گرم ${params.compoundNameFa} را مستقیماً با ترازوی دیجیتال (دقت ${scalePrecisionGrams} گرم) وزن کنید.`,
    stockPlan
  };
}

export function getMilestoneEquipmentAdaptation(
  milestoneId: string,
  profile: EquipmentProfileInput
): MilestoneEquipmentAdaptation {
  const r = resolveReagents(profile);
  const produceRose = profile.produceRoseSaignee ?? profile.producesRoseSaignee;

  if (milestoneId === 'saignee-rose') {
    if (!produceRose) {
      return {
        isApplicable: false,
        equipmentBadgeFa: 'غیرفعال در پروفایل شما',
        adaptedHowToFa:
          'در پروفایل تجهیزات شما تولید شراب رُزه سانیه غیرفعال شده است؛ تمام ۳۰۰ لیتر فاز مایع در مخازن قرمز باقی می‌ماند.'
      };
    }
    return {
      isApplicable: true,
      equipmentBadgeFa: 'سانیه رُزه فعال (۳۴ لیتر)',
      adaptedHowToFa:
        '۱۰ درصد فاز مایع (۳۴ لیتر کل) را بلافاصله پس از کراشینگ برای شراب رُزه جدا کرده و به مخزن اختصاصی رُزه منتقل کنید.'
    };
  }

  if (milestoneId === 'pectic-enzyme') {
    if (!r.hasPecticEnzyme) {
      return {
        isApplicable: true,
        equipmentBadgeFa: 'جایگزین بدون آنزیم پکتولیتیک',
        adaptedHowToFa:
          'در غیاب آنزیم پکتولیتیک، استخراج رنگ و آب‌انگور را با افزایش زمان خیساندن سرد و پیژاژ فیزیکی منظم جبران کنید.',
        substitutionWarningFa:
          'فاقد آنزیم پکتولیتیک: زمان خیساندن سرد پوست را ۴ ساعت افزایش دهید و در ۳ روز اول تخمیر، پیژاژ را منظم‌تر انجام دهید تا رنگ پوست رشه استخراج شود.'
      };
    }
  }

  if (milestoneId === 'yeast-inoculation') {
    if (!r.hasGoFerm) {
      return {
        isApplicable: true,
        equipmentBadgeFa: 'آبرسانی مستقیم مخمر (بدون Go-Ferm)',
        adaptedHowToFa:
          'آبرسانی مخمر بدون Go-Ferm: مخمر RC-212 را در ۱۰ برابر وزن خود آب ۳۸ درجه حل کرده و طی ۲۰ دقیقه در ۲ مرحله با افزودن آب‌انگور هم‌دما کنید (ΔT < 5°C).',
        substitutionWarningFa:
          'فاقد Go-Ferm: از افزودن DAP یا Fermaid K به آب آبرسانی مخمر جداً خودداری کنید (سمیت مستقیم برای غشای مخمر).'
      };
    }
  }

  if (milestoneId === 'sna-1' || milestoneId === 'sna-3-organic') {
    if (!r.hasFermaidO) {
      return {
        isApplicable: true,
        equipmentBadgeFa: 'جایگزین طبیعی مخمر جوشانده (Yeast Hulls)',
        adaptedHowToFa:
          'به دلیل عدم دسترسی به Fermaid O، از مخمر نانوایی جوشانده‌شده (غیرفعال) برای تأمین آمینواسید و استرول‌های غشایی استفاده کنید.',
        substitutionWarningFa:
          'فاقد Fermaid O در موجودی: به عنوان جایگزین نیتروژن آلی و استرول، ۰.۳۰ گرم بر لیتر مخمر نانوایی خالص را در کمی آب به مدت ۱۰ دقیقه بجوشانید (Yeast Hulls غیرفعال) و پس از خنک شدن به مخزن اضافه کنید.'
      };
    }
  }

  if (milestoneId === 'phase2-tannin') {
    if (!r.hasEnologicalTannins) {
      return {
        isApplicable: true,
        equipmentBadgeFa: 'استخراج تانن طبیعی پوست (بدون تانن افزودنی)',
        adaptedHowToFa:
          'در غیاب تانن انولوژیک، استخراج ساختار فنولیک را از طریق مدیریت کلاهک و حذف هسته‌های تلخ کف مخزن انجام دهید.',
        substitutionWarningFa:
          'فاقد تانن انولوژیک در موجودی: صرفاً هسته‌های ته‌نشین‌شده کف مخزن را خارج کنید و دما را روی ۲۶–۲۸ درجه نگه دارید تا تانن طبیعی پوست رشه استخراج شود.'
      };
    }
  }

  if (milestoneId === 'pressing') {
    if (
      profile.pressingMethod === 'mesh_bag_gravity_hand' ||
      profile.pressingMethod === 'nylon_straining_bag_manual'
    ) {
      return {
        isApplicable: true,
        equipmentBadgeFa: 'کیسه توری استریل و آبگیری ثقلی/دستی',
        adaptedHowToFa:
          'پومیس را داخل کیسه توری استریل (Nylon Straining Bag) ریخته و با آبگیری ثقلی/دستی ملایم بدون له کردن هسته شراب آزاد و پرس ملایم را جدا کنید.'
      };
    }
    if (
      profile.pressingMethod === 'bladder_press' ||
      profile.pressingMethod === 'pneumatic_or_bladder'
    ) {
      return {
        isApplicable: true,
        equipmentBadgeFa: 'پرس بادی تا ۱.۲ بار',
        adaptedHowToFa:
          'آب‌انگور آزاد (Free-run) را جدا کرده و سپس با پرس بادی تا ۱.۲ بار بدون شکستن هسته‌ها پرس ملایم انجام دهید.'
      };
    }
    return {
      isApplicable: true,
      equipmentBadgeFa: 'پرس سبدی مکانیکی ملایم',
      adaptedHowToFa:
        'ابتدا شراب آزاد (Free-run) را سیفون کرده و سپس تفاله را در پرس سبدی مکانیکی ملایم (بدون خرد شدن هسته‌ها) پرس کنید.'
    };
  }

  if (milestoneId === 'racking-1-gross-lees' || milestoneId === 'day21-bactiless-racking') {
    const vesselUnitL =
      profile.agingVesselType === 'demijohn_5l_10l' ||
      profile.agingVesselConfig === 'partial_headspace_vessels'
        ? 10
        : profile.agingVesselType === 'stainless_keg' ||
            profile.agingVesselConfig === 'oak_barrel_or_ss'
          ? 50
          : 20;
    const vesselLabelFa =
      vesselUnitL === 10
        ? 'دمیجان‌های ۱۰ لیتری (10L)'
        : vesselUnitL === 50
          ? 'مخازن استیل ۵۰ لیتری (50L)'
          : 'کاربوی‌های ۲۰ لیتری (20L)';
    const transferLabelFa =
      profile.transferAndBottlingMethod === 'gravity_siphon_decant_only'
        ? 'سیفون ثقلی با شلنگ غذایی'
        : 'پمپ دیافراگمی ملایم';

    if (
      profile.inertGasSystem === 'none_topup_marbles' ||
      profile.inertGasSystem === 'none'
    ) {
      return {
        isApplicable: true,
        equipmentBadgeFa: `${transferLabelFa} به ${vesselLabelFa} (بدون کپسول CO2)`,
        adaptedHowToFa: `شراب شفاف را با ${transferLabelFa} از روی دُرد به ${vesselLabelFa} منتقل کنید. در غیاب کپسول CO2، با شراب رزرو (Top-up) یا تیله‌های شیشه‌ای استریل فضای خالی گلوگاه را کاملاً حذف کنید.`,
        substitutionWarningFa:
          'فاقد کپسول گاز خنثی: شلنگ سیفون را تا کف کاربوی مقصد ببرید تا پاشش اکسیژنی رخ ندهد و با Top-up یا تیله شیشه‌ای استریل فضای خالی را به صفر برسانید.'
      };
    }

    return {
      isApplicable: true,
      equipmentBadgeFa: `${transferLabelFa} به ${vesselLabelFa} با پوشش گاز خنثی`,
      adaptedHowToFa: `پیش از انتقال، ${vesselLabelFa} را با گاز خنثی پرج کنید و شراب را با ${transferLabelFa} بدون پاشش و با حذف کامل فضای خالی منتقل نمایید.`
    };
  }

  if (milestoneId === 'day11-bactiless-kms-lock') {
    if (!r.hasBactilessChitosan) {
      return {
        isApplicable: true,
        equipmentBadgeFa: 'قفل ضد-MLF با KMS و سرمای محیطی',
        adaptedHowToFa:
          'در غیاب کیتوزان (Bactiless)، مهار باکتری‌های لاکتیک را با تنظیم دقیق سولفیت مولکولی، رکینگ تمیز و کاهش دما اجرا کنید.',
        substitutionWarningFa:
          'فاقد کیتوزان (Bactiless): برای قفل مالولاکتیک بدون باکتیلس، سولفیت مولکولی را با KMS روی ۰.۸۰ mg/L قفل کنید، دُرد را کامل سیفون نمایید و دما را زیر ۱۴ درجه نگه دارید.'
      };
    }
  }

  if (milestoneId === 'day65-cold-stab') {
    const coldMethod =
      profile.coldStabMethod ??
      (profile.coldStabilizationMethod === 'fridge_or_winter_balcony'
        ? 'dedicated_fridge'
        : profile.coldStabilizationMethod === 'natural_winter_cellar'
          ? 'winter_ambient_balcony'
          : 'skip_cold_stab');

    if (coldMethod === 'skip_cold_stab') {
      return {
        isApplicable: false,
        equipmentBadgeFa: 'حذف تثبیت سرد در پروفایل شما',
        adaptedHowToFa:
          'به دلیل عدم دسترسی به یخچال یا سرمای زمستانی، مرحله تثبیت سرد رد می‌شود؛ بطری‌ها را پیش از مصرف بالای ۱۰ درجه نگهداری کنید.',
        substitutionWarningFa:
          'بدون تثبیت سرد: احتمال تشکیل بلورهای بی‌ضرر الماس شراب (پتاسیم بی‌تارتارات) در صورت نگهداری بطری در یخچال وجود دارد.'
      };
    }

    if (coldMethod === 'winter_ambient_balcony') {
      return {
        isApplicable: true,
        equipmentBadgeFa: 'سرمای طبیعی زمستان / بالکن سرپوشیده',
        adaptedHowToFa: `کاربوی‌ها را به مدت ۱۴ تا ۲۱ روز در سرمای طبیعی زمستان/بالکن (منفی ۲ تا مثبت ۴ درجه) قرار دهید${
          r.hasPotassiumBitartrateKht
            ? ' و با بذر پودر کرم تارتار (KHT) هسته‌زایی را تسریع کنید.'
            : ' تا بلورهای تارتارات به صورت طبیعی ته‌نشین شوند.'
        }`,
        ...(!r.hasPotassiumBitartrateKht
          ? {
              substitutionWarningFa:
                'فاقد کرم تارتار (KHT): زمان نگهداری در سرما را حداقل به ۲۱ روز افزایش دهید تا رسوب طبیعی کامل شود.'
            }
          : {})
      };
    }

    return {
      isApplicable: true,
      equipmentBadgeFa: 'یخچال اختصاصی تثبیت سرد (-2°C تا +2°C)',
      adaptedHowToFa: `کاربوی‌ها را در دمای منفی ۲ تا مثبت ۲ درجه سانتی‌گراد قرار دهید${
        r.hasPotassiumBitartrateKht
          ? ' و بذر KHT اضافه کنید.'
          : ' و به مدت ۱۴ تا ۲۱ روز تا رسوب کامل بی‌تارتارات صبر کنید.'
      }`,
      ...(!r.hasPotassiumBitartrateKht
        ? {
            substitutionWarningFa:
              'فاقد کرم تارتار (KHT): در غیاب بذر KHT، مدت تثبیت سرد را به ۱۸ تا ۲۱ روز افزایش دهید.'
          }
        : {})
    };
  }

  if (milestoneId === 'day100-bottling') {
    const isGravity = profile.transferAndBottlingMethod === 'gravity_siphon_decant_only';
    return {
      isApplicable: true,
      equipmentBadgeFa: isGravity
        ? 'بطری‌گیری ثقلی بدون فیلتر غشایی'
        : 'فیلتراسیون ۰.۴۵ میکرون و بطری‌گیری',
      adaptedHowToFa: isGravity
        ? 'بطری‌گیری را با سیفون ثقلی و لوله پرکن دستی پس از شفافیت طبیعی کامل (بدون فیلتر کارتریجی) اجرا کنید.'
        : 'شراب را از فیلتر کارتریجی ۰.۴۵ میکرون عبور داده و با تزریق گاز خنثی بطری‌گیری نمایید.',
      ...(!r.hasAscorbicAcid
        ? {
            substitutionWarningFa:
              'فاقد اسید اسکوربیک: صرفاً سولفیت آزاد (Free SO2) را ۲۴ ساعت قبل از بطری‌گیری روی هدف نهایی تنظیم کنید و از هوادهی حین پر کردن بطری پرهیز نمایید.'
          }
        : {})
    };
  }

  return {
    isApplicable: true,
    equipmentBadgeFa: 'منطبق با تجهیزات کارگاه',
    adaptedHowToFa: 'طبق دستورالعمل استاندارد پروتکل و دقت ترازوی کارگاه شما اجرا شود.'
  };
}

const ROADMAP_STEP_TO_MILESTONE_MAP: Record<number, string> = {
  5: 'crush-kms',
  6: 'saignee-rose',
  8: 'pectic-enzyme',
  13: 'yeast-inoculation',
  16: 'sna-1',
  17: 'sna-2-dap',
  18: 'phase2-tannin',
  19: 'sna-3-organic',
  21: 'pressing',
  22: 'pressing',
  25: 'racking-1-gross-lees',
  27: 'day11-bactiless-kms-lock',
  28: 'day21-bactiless-racking',
  37: 'day65-cold-stab',
  44: 'day100-bottling',
  45: 'day100-bottling'
};

export function getRoadmapStepEquipmentGuide(
  stepNumber: number,
  profile: EquipmentProfileInput
): { badgeFa: string; instructionFa: string; warningFa?: string } | null {
  const milestoneId = ROADMAP_STEP_TO_MILESTONE_MAP[stepNumber];
  if (!milestoneId) {
    return null;
  }
  const m = getMilestoneEquipmentAdaptation(milestoneId, profile);
  return {
    badgeFa: m.equipmentBadgeFa,
    instructionFa: m.adaptedHowToFa,
    ...(m.substitutionWarningFa ? { warningFa: m.substitutionWarningFa } : {})
  };
}

export function getLabToolEquipmentCompatibility(
  testId: string,
  profile: EquipmentProfileInput
): { isDirectlySupported: boolean; badgeFa: string; fallbackGuidanceFa: string } {
  const normalized = testId.trim();

  if (normalized === 'test-hydro' || normalized === 'hydrometer_temp') {
    const isDirectlySupported =
      profile.densityInstrument !== 'refractometer_only' &&
      profile.densityInstrument !== 'none_sensory';
    return {
      isDirectlySupported,
      badgeFa: isDirectlySupported
        ? 'قابل اجرا با تجهیزات شما ✓'
        : 'حالت شبیه‌ساز / جایگزین بدون کیت',
      fallbackGuidanceFa: isDirectlySupported
        ? 'هیدرومتر شما فعال است؛ دمای نمونه را وارد کنید تا خطای انبساط حرارتی اصلاح شود.'
        : 'در غیاب هیدرومتر، از تب تصحیح الکل رفراکتومتر یا تقویم حسی تخمیر استفاده کنید.'
    };
  }

  if (normalized === 'test-refract' || normalized === 'refractometer_correction') {
    const isDirectlySupported =
      profile.densityInstrument === 'refractometer_only' ||
      profile.densityInstrument === 'both' ||
      profile.densityInstrument === 'both_hydro_and_refract';
    return {
      isDirectlySupported,
      badgeFa: isDirectlySupported
        ? 'قابل اجرا با تجهیزات شما ✓'
        : 'حالت شبیه‌ساز / جایگزین بدون کیت',
      fallbackGuidanceFa: isDirectlySupported
        ? 'رفراکتومتر نوری فعال است؛ بریکس اولیه و فعلی را برای محاسبه SG واقعی وارد کنید.'
        : 'شما هیدرومتر مستقیم دارید؛ نیازی به تقریب رفراکتومتر در حین تخمیر نیست.'
    };
  }

  if (normalized === 'test-ph' || normalized === 'ph_meter') {
    const isDirectlySupported = profile.phInstrument !== 'none';
    return {
      isDirectlySupported,
      badgeFa: isDirectlySupported
        ? 'قابل اجرا با تجهیزات شما ✓'
        : 'حالت شبیه‌ساز / جایگزین بدون کیت',
      fallbackGuidanceFa: isDirectlySupported
        ? 'دستگاه pH متر یا کاغذ دقیق شما فعال است؛ پیش از خوانش، کالیبراسیون بافر ۴.۰۱ و ۷.۰۰ را بررسی کنید.'
        : 'در غیاب pH متر، برای انگور رشه سردشت مقدار پیش‌فرض ایمن pH = 3.55 تا 3.65 را در محاسبه سولفیت مولکولی لحاظ کنید.'
    };
  }

  if (normalized === 'test-ta' || normalized === 'ta_titration') {
    const isDirectlySupported = profile.taInstrument !== 'none';
    return {
      isDirectlySupported,
      badgeFa: isDirectlySupported
        ? 'قابل اجرا با تجهیزات شما ✓'
        : 'حالت شبیه‌ساز / جایگزین بدون کیت',
      fallbackGuidanceFa: isDirectlySupported
        ? 'کیت تیتراسیون اسیدیته کل (TA) در کارگاه شما موجود است.'
        : 'در غیاب بورت NaOH، ارزیابی توازن اسیدی را بر پایه pH و چشایی حسی انجام دهید و از اسیدافزایی کور پرهیز کنید.'
    };
  }

  if (normalized === 'test-so2' || normalized === 'ripper_so2') {
    const isDirectlySupported = profile.so2Instrument !== 'none';
    return {
      isDirectlySupported,
      badgeFa: isDirectlySupported
        ? 'قابل اجرا با تجهیزات شما ✓'
        : 'حالت شبیه‌ساز / جایگزین بدون کیت',
      fallbackGuidanceFa: isDirectlySupported
        ? 'کیت اندازه‌گیری سولفیت آزاد در پروفایل کارگاه شما فعال است.'
        : 'در غیاب کیت تیتراسیون ریپر، از دفتر کل تجمعی سولفیت (تخمین استوکیومتری بر پایه KMS افزوده‌شده) استفاده کنید.'
    };
  }

  if (normalized === 'mlf_chromatography' || normalized === 'test-mlf') {
    const isDirectlySupported = Boolean(
      profile.hasPaperChromatography ?? profile.hasPaperChromatographyMLF
    );
    return {
      isDirectlySupported,
      badgeFa: isDirectlySupported
        ? 'قابل اجرا با تجهیزات شما ✓'
        : 'حالت شبیه‌ساز / جایگزین بدون کیت',
      fallbackGuidanceFa: isDirectlySupported
        ? 'کیت کروماتوگرافی کاغذی اسید مالیک/لاکتیک در کارگاه شما فعال است.'
        : 'در غیاب کروماتوگرافی کاغذی، به قفل پیشگیرانه روز ۱۱ (KMS + سیفون دُرد + دمای زیر ۱۴ درجه) تکیه کنید.'
    };
  }

  if (normalized === 'test-dryness' || normalized === 'dryness_check') {
    const isDirectlySupported = Boolean(
      profile.hasClinitestRsKit || profile.densityInstrument !== 'none_sensory'
    );
    return {
      isDirectlySupported,
      badgeFa: isDirectlySupported
        ? 'قابل اجرا با تجهیزات شما ✓'
        : 'حالت شبیه‌ساز / جایگزین بدون کیت',
      fallbackGuidanceFa: isDirectlySupported
        ? 'بررسی خشکی با ثبات ۳ روزه SG زیر ۰.۹۹۵ و چشایی قابل انجام است.'
        : 'بدون هیدرومتر و قرص کلینی‌تست، پایان تخمیر را با قطع کامل حباب قفل هوا و تست چشایی خشک تأیید کنید.'
    };
  }

  return {
    isDirectlySupported: true,
    badgeFa: 'قابل اجرا با تجهیزات شما ✓',
    fallbackGuidanceFa: 'این ابزار محاسباتی با تجهیزات کارگاه شما کاملاً سازگار است.'
  };
}
