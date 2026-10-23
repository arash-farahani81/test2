export type YeastBrand =
  | 'Lallemand'
  | 'Laffort'
  | 'Fermentis'
  | 'Enartis'
  | 'Anchor'
  | 'Maurivin'
  | 'Red Star'
  | 'Renaissance'
  | 'Chr. Hansen';

export type YeastCategory =
  | 'structured_red'
  | 'silky_premium_red'
  | 'fruity_red_rose'
  | 'aromatic_rose_white'
  | 'high_abv_restart'
  | 'heritage_classic'
  | 'biotech_zero_h2s_bioacid';

export type YeastYanDemand = 'low' | 'medium' | 'high';

export type YeastH2sRisk = 'zero_biotech' | 'very_low' | 'low' | 'medium' | 'high';

export type YeastKillerFactor = 'k2_positive' | 'neutral' | 'sensitive' | 'non_sacch';

export interface YeastStrainProfile {
  id: string;
  code: string;
  nameEn: string;
  nameFa: string;
  brand: YeastBrand;
  species: string;
  category: YeastCategory;
  recommendedStyles: Array<'red' | 'rose' | 'restart'>;
  originFa: string;
  tempMinC: number;
  tempOptMinC: number;
  tempOptMaxC: number;
  tempWarningC: number;
  tempDangerC: number;
  tempMaxC: number;
  alcoholTolerancePct: number;
  recommendedDoseGL: number;
  rehydrationTempC: number;
  yanDemandLevel: YeastYanDemand;
  yanMultiplier: number;
  requiresHighSterolsGoFerm: boolean;
  h2sRiskLevel: YeastH2sRisk;
  endogenousSo2MgL: number;
  so2BindingLevel: 'very_low' | 'low' | 'medium';
  malicConsumptionPct: number;
  lacticAcidProductionGL: number;
  expectedPhShift: number;
  glycerolYieldGL: number;
  polysaccharideRelease: 'low' | 'medium' | 'high' | 'extreme_hsp12';
  killerFactor: YeastKillerFactor;
  aromaProfileFa: string;
  sardashtFitScore: number;
  sardashtEngineeringNoteFa: string;
}

export interface YeastAdjustedSnaPlan {
  strain: YeastStrainProfile;
  sugarGPerL: number;
  naturalYAN: number;
  targetYAN: number;
  neededYAN: number;
  yanScale: number;
  yeastGrams: number;
  goFermGrams: number;
  fermaidO_1: number;
  fermaidK_2: number;
  dap_2: number;
  zinc_2: number;
  fermaidO_3: number;
}

export interface YeastAcidityAndGlycerolImpact {
  strain: YeastStrainProfile;
  predictedFinalPH: number;
  predictedTaDeltaGL: number;
  predictedFinalTA: number;
  endogenousGlycerolGL: number;
  recommendedExogenousGlycerinCapGL: number;
  hasBiologicalAcidification: boolean;
  hasHighMalicDegradation: boolean;
  acidityGuidanceFa: string;
  glycerolGuidanceFa: string;
}

export type YeastGoalId =
  | 'classic_sardasht_red'
  | 'velvety_reserve_red'
  | 'natural_acidity_boost'
  | 'zero_h2s_safety'
  | 'aromatic_saignee_rose'
  | 'stuck_fermentation_rescue';

const round2 = (val: number): number => Math.round(val * 100) / 100;

export const YEAST_STRAINS_DATABASE: ReadonlyArray<YeastStrainProfile> = [
  // ==========================================================================
  // 1. STRUCTURED RED (10 STRAINS)
  // ==========================================================================
  {
    id: 'lalvin-rc-212',
    code: 'RC-212',
    nameEn: 'Lalvin Bourgovin RC-212',
    nameFa: 'لالوین بورگوین RC-212 (مرجع استاندارد رشه سردشت)',
    brand: 'Lallemand',
    species: 'Saccharomyces cerevisiae',
    category: 'structured_red',
    recommendedStyles: ['red'],
    originFa: 'بورگوندی فرانسه (انتخاب کمیته BIVB)',
    tempMinC: 16,
    tempOptMinC: 20,
    tempOptMaxC: 28,
    tempWarningC: 28.5,
    tempDangerC: 30.0,
    tempMaxC: 30,
    alcoholTolerancePct: 16,
    recommendedDoseGL: 0.25,
    rehydrationTempC: 37,
    yanDemandLevel: 'medium',
    yanMultiplier: 1.05,
    requiresHighSterolsGoFerm: true,
    h2sRiskLevel: 'medium',
    endogenousSo2MgL: 8,
    so2BindingLevel: 'low',
    malicConsumptionPct: -12,
    lacticAcidProductionGL: 0,
    expectedPhShift: 0,
    glycerolYieldGL: 8.2,
    polysaccharideRelease: 'medium',
    killerFactor: 'neutral',
    aromaProfileFa: 'توت سیاه رسیده، آلبالو، ادویه گرم و ساختار تاننی ابریشمی',
    sardashtFitScore: 98,
    sardashtEngineeringNoteFa:
      'سویه مرجع پروتکل رشه سردشت برای مخازن قرمز؛ تثبیت عالی رنگ آنتوسیانین با پلی‌فنول‌های پوست ضخیم رشه به شرط رعایت دقیق تغذیه مرحله‌ای SNA.'
  },
  {
    id: 'lalvin-icv-d254',
    code: 'ICV D254',
    nameEn: 'Lalvin ICV D254',
    nameFa: 'لالوین ICV D254 (حجم دهانی خامه‌ای و سیدر)',
    brand: 'Lallemand',
    species: 'Saccharomyces cerevisiae',
    category: 'structured_red',
    recommendedStyles: ['red'],
    originFa: 'دره رون فرانسه (انستیتو ICV)',
    tempMinC: 16,
    tempOptMinC: 22,
    tempOptMaxC: 28,
    tempWarningC: 28.5,
    tempDangerC: 30.0,
    tempMaxC: 30,
    alcoholTolerancePct: 16,
    recommendedDoseGL: 0.25,
    rehydrationTempC: 37,
    yanDemandLevel: 'medium',
    yanMultiplier: 1.0,
    requiresHighSterolsGoFerm: true,
    h2sRiskLevel: 'low',
    endogenousSo2MgL: 10,
    so2BindingLevel: 'low',
    malicConsumptionPct: -10,
    lacticAcidProductionGL: 0,
    expectedPhShift: 0,
    glycerolYieldGL: 9.5,
    polysaccharideRelease: 'high',
    killerFactor: 'neutral',
    aromaProfileFa: 'آلو سیاه پخته، شکلات تلخ، شیرین‌بیان و بافت بسیار پرحجم',
    sardashtFitScore: 96,
    sardashtEngineeringNoteFa:
      'آزادسازی بالای پلی‌ساکارید و گلیسرول ۹.۵ g/L که گسی تانن‌های انگور رشه سردشت را بدون نیاز به MLF گرد و مخملی می‌کند.'
  },
  {
    id: 'lalvin-icv-d80',
    code: 'ICV D80',
    nameEn: 'Lalvin ICV D80',
    nameFa: 'لالوین ICV D80 (تانن غنی و کهنه‌پذیری طولانی)',
    brand: 'Lallemand',
    species: 'Saccharomyces cerevisiae',
    category: 'structured_red',
    recommendedStyles: ['red'],
    originFa: 'کوت-روتی رون شمالی فرانسه (ICV)',
    tempMinC: 16,
    tempOptMinC: 20,
    tempOptMaxC: 27,
    tempWarningC: 27.5,
    tempDangerC: 29.0,
    tempMaxC: 29,
    alcoholTolerancePct: 16,
    recommendedDoseGL: 0.25,
    rehydrationTempC: 37,
    yanDemandLevel: 'high',
    yanMultiplier: 1.2,
    requiresHighSterolsGoFerm: true,
    h2sRiskLevel: 'medium',
    endogenousSo2MgL: 12,
    so2BindingLevel: 'low',
    malicConsumptionPct: -10,
    lacticAcidProductionGL: 0,
    expectedPhShift: 0,
    glycerolYieldGL: 9.2,
    polysaccharideRelease: 'medium',
    killerFactor: 'k2_positive',
    aromaProfileFa: 'میوه سیاه فشرده، نت دودی، فلفل سیاه و ساختار قدرتمند',
    sardashtFitScore: 91,
    sardashtEngineeringNoteFa:
      'مناسب انگور رشه با بریکس بالا و بلوط؛ به دلیل نیاز نیتروژنی بالا (۱.۲۰x) تغذیه کامل Fermaid O و K الزامی است.'
  },
  {
    id: 'lalvin-bm-45',
    code: 'BM 45',
    nameEn: 'Lalvin BM 45',
    nameFa: 'لالوین BM 45 (سنگفرش برونلو — پلی‌ساکارید فوق‌بالا)',
    brand: 'Lallemand',
    species: 'Saccharomyces cerevisiae',
    category: 'structured_red',
    recommendedStyles: ['red'],
    originFa: 'مونتالچینو توسکانی ایتالیا',
    tempMinC: 16,
    tempOptMinC: 20,
    tempOptMaxC: 26,
    tempWarningC: 27.0,
    tempDangerC: 28.5,
    tempMaxC: 29,
    alcoholTolerancePct: 15,
    recommendedDoseGL: 0.25,
    rehydrationTempC: 37,
    yanDemandLevel: 'high',
    yanMultiplier: 1.25,
    requiresHighSterolsGoFerm: true,
    h2sRiskLevel: 'high',
    endogenousSo2MgL: 18,
    so2BindingLevel: 'medium',
    malicConsumptionPct: -10,
    lacticAcidProductionGL: 0,
    expectedPhShift: 0,
    glycerolYieldGL: 10.2,
    polysaccharideRelease: 'high',
    killerFactor: 'k2_positive',
    aromaProfileFa: 'مربای تمشک، رز خشک، ادویه شیرین و شیرینی ظاهری بالا',
    sardashtFitScore: 88,
    sardashtEngineeringNoteFa:
      'تولید مانوپروتئین و گلیسرول استثنایی (۱۰.۲ g/L)، اما به دلیل نیاز بالای نیتروژن و ریسک H2S، پیشنهاد می‌شود نسخه ارتقایافته BM 4x4 استفاده شود.'
  },
  {
    id: 'lalvin-bm-4x4',
    code: 'BM 4x4',
    nameEn: 'Lalvin BM 4x4',
    nameFa: 'لالوین BM 4x4 (سینرژی BM45 با ایمنی تخمیر بالا)',
    brand: 'Lallemand',
    species: 'Saccharomyces cerevisiae',
    category: 'structured_red',
    recommendedStyles: ['red'],
    originFa: 'ایتالیا / فرانسه (بلند هم‌افزای دو سویه)',
    tempMinC: 16,
    tempOptMinC: 20,
    tempOptMaxC: 27,
    tempWarningC: 28.0,
    tempDangerC: 29.5,
    tempMaxC: 30,
    alcoholTolerancePct: 16,
    recommendedDoseGL: 0.25,
    rehydrationTempC: 37,
    yanDemandLevel: 'medium',
    yanMultiplier: 1.1,
    requiresHighSterolsGoFerm: true,
    h2sRiskLevel: 'low',
    endogenousSo2MgL: 12,
    so2BindingLevel: 'low',
    malicConsumptionPct: -10,
    lacticAcidProductionGL: 0,
    expectedPhShift: 0,
    glycerolYieldGL: 9.8,
    polysaccharideRelease: 'high',
    killerFactor: 'k2_positive',
    aromaProfileFa: 'گیلاس سیاه، وانیل طبیعی، بافت مخملی و پایداری رنگ عالی',
    sardashtFitScore: 95,
    sardashtEngineeringNoteFa:
      'جایگزین هوشمند و ایمن برای BM 45 در رشه سردشت؛ همان نرمی پلی‌ساکاریدی را با سینتیک پایدارتر و ریسک H2S پایین فراهم می‌کند.'
  },
  {
    id: 'lalvin-icv-d21',
    code: 'ICV D21',
    nameEn: 'Lalvin ICV D21',
    nameFa: 'لالوین ICV D21 (طراوت اسیدی و مهار نت‌های پختگی)',
    brand: 'Lallemand',
    species: 'Saccharomyces cerevisiae',
    category: 'structured_red',
    recommendedStyles: ['red'],
    originFa: 'لانگدوک فرانسه (ICV)',
    tempMinC: 16,
    tempOptMinC: 20,
    tempOptMaxC: 28,
    tempWarningC: 29.0,
    tempDangerC: 30.5,
    tempMaxC: 31,
    alcoholTolerancePct: 16,
    recommendedDoseGL: 0.25,
    rehydrationTempC: 37,
    yanDemandLevel: 'low',
    yanMultiplier: 0.9,
    requiresHighSterolsGoFerm: true,
    h2sRiskLevel: 'very_low',
    endogenousSo2MgL: 8,
    so2BindingLevel: 'low',
    malicConsumptionPct: -5,
    lacticAcidProductionGL: 0,
    expectedPhShift: -0.04,
    glycerolYieldGL: 8.5,
    polysaccharideRelease: 'high',
    killerFactor: 'k2_positive',
    aromaProfileFa: 'میوه قرمز و سیاه تازه، طراوت دهانی و تانن ابریشمی',
    sardashtFitScore: 97,
    sardashtEngineeringNoteFa:
      'فوق‌العاده برای انگور رشه سردشت با رسیدگی کامل؛ حس اسیدیته و طراوت میوه را حفظ کرده و با نیاز نیتروژنی کم (۰.۹۰x) بسیار کم‌خطر است.'
  },
  {
    id: 'lalvin-clos',
    code: 'Clos',
    nameEn: 'Lalvin Clos',
    nameFa: 'لالوین Clos (پریورات اسپانیا — تحمل دما و الکل ۱۷٪)',
    brand: 'Lallemand',
    species: 'Saccharomyces cerevisiae',
    category: 'structured_red',
    recommendedStyles: ['red'],
    originFa: 'پریورات کاتالونیا اسپانیا',
    tempMinC: 14,
    tempOptMinC: 20,
    tempOptMaxC: 30,
    tempWarningC: 30.0,
    tempDangerC: 32.0,
    tempMaxC: 32,
    alcoholTolerancePct: 17,
    recommendedDoseGL: 0.25,
    rehydrationTempC: 37,
    yanDemandLevel: 'medium',
    yanMultiplier: 1.0,
    requiresHighSterolsGoFerm: true,
    h2sRiskLevel: 'low',
    endogenousSo2MgL: 10,
    so2BindingLevel: 'low',
    malicConsumptionPct: -10,
    lacticAcidProductionGL: 0,
    expectedPhShift: 0,
    glycerolYieldGL: 10.5,
    polysaccharideRelease: 'high',
    killerFactor: 'k2_positive',
    aromaProfileFa: 'میوه سیاه معدنی، بنفشه و ساختار دهانی عظیم (۱۰.۵ g/L گلیسرول)',
    sardashtFitScore: 94,
    sardashtEngineeringNoteFa:
      'انتخاب ایده‌آل برای چین‌های دیرهنگام رشه سردشت با قند بالا یا کارگاه‌هایی که کنترل خنک‌کننده کلاهک محدودی دارند.'
  },
  {
    id: 'enoferm-rp15',
    code: 'RP15 Rockpile',
    nameEn: 'Enoferm RP15 Rockpile',
    nameFa: 'انوفرم RP15 راک‌پایل (تخصصی زینفاندل و شیراز پرقدرت)',
    brand: 'Lallemand',
    species: 'Saccharomyces cerevisiae',
    category: 'structured_red',
    recommendedStyles: ['red'],
    originFa: 'سونوما کالیفرنیا (Rockpile)',
    tempMinC: 17,
    tempOptMinC: 22,
    tempOptMaxC: 28,
    tempWarningC: 29.0,
    tempDangerC: 30.5,
    tempMaxC: 31,
    alcoholTolerancePct: 17,
    recommendedDoseGL: 0.25,
    rehydrationTempC: 37,
    yanDemandLevel: 'medium',
    yanMultiplier: 1.0,
    requiresHighSterolsGoFerm: true,
    h2sRiskLevel: 'low',
    endogenousSo2MgL: 10,
    so2BindingLevel: 'low',
    malicConsumptionPct: -10,
    lacticAcidProductionGL: 0,
    expectedPhShift: 0,
    glycerolYieldGL: 8.8,
    polysaccharideRelease: 'medium',
    killerFactor: 'k2_positive',
    aromaProfileFa: 'تمشک سیاه، توت‌فرنگی رسیده، کاکائو و تانن مخملی',
    sardashtFitScore: 92,
    sardashtEngineeringNoteFa:
      'سینتیک تخمیر آرام و یکنواخت بدون جهش ناگهانی دما؛ مناسب شراب‌های قرمز پرمایه با الکل ۱۵ تا ۱۷ درصد.'
  },
  {
    id: 'enoferm-bdx',
    code: 'BDX Bordeaux',
    nameEn: 'Enoferm BDX (Pasteur Red)',
    nameFa: 'انوفرم BDX بوردو (ساختار کلاسیک و استخراج رنگ عمیق)',
    brand: 'Lallemand',
    species: 'Saccharomyces cerevisiae',
    category: 'structured_red',
    recommendedStyles: ['red'],
    originFa: 'بوردو فرانسه (انستیتو پاستور)',
    tempMinC: 18,
    tempOptMinC: 22,
    tempOptMaxC: 28,
    tempWarningC: 29.0,
    tempDangerC: 30.5,
    tempMaxC: 31,
    alcoholTolerancePct: 16,
    recommendedDoseGL: 0.25,
    rehydrationTempC: 37,
    yanDemandLevel: 'medium',
    yanMultiplier: 1.0,
    requiresHighSterolsGoFerm: true,
    h2sRiskLevel: 'medium',
    endogenousSo2MgL: 12,
    so2BindingLevel: 'low',
    malicConsumptionPct: -10,
    lacticAcidProductionGL: 0,
    expectedPhShift: 0,
    glycerolYieldGL: 8.0,
    polysaccharideRelease: 'medium',
    killerFactor: 'sensitive',
    aromaProfileFa: 'انگور فرنگی سیاه، برگ توتون، سدر و تانن کلاسیک بوردو',
    sardashtFitScore: 89,
    sardashtEngineeringNoteFa:
      'استخراج رنگ عمیق از پوست انگور رشه؛ به دلیل حساسیت به فاکتور کشنده (Killer Sensitive) تلقیح تمیز پس از سولفیت‌دهی روز صفر ضروری است.'
  },
  {
    id: 'enoferm-syrah',
    code: 'Enoferm Syrah',
    nameEn: 'Enoferm Syrah',
    nameFa: 'انوفرم سیراه (بنفشه، فلفل سیاه و گلیسرول بالا)',
    brand: 'Lallemand',
    species: 'Saccharomyces cerevisiae',
    category: 'structured_red',
    recommendedStyles: ['red'],
    originFa: 'دره رون فرانسه',
    tempMinC: 16,
    tempOptMinC: 20,
    tempOptMaxC: 28,
    tempWarningC: 29.5,
    tempDangerC: 31.5,
    tempMaxC: 32,
    alcoholTolerancePct: 16,
    recommendedDoseGL: 0.25,
    rehydrationTempC: 37,
    yanDemandLevel: 'medium',
    yanMultiplier: 1.05,
    requiresHighSterolsGoFerm: true,
    h2sRiskLevel: 'low',
    endogenousSo2MgL: 14,
    so2BindingLevel: 'low',
    malicConsumptionPct: -10,
    lacticAcidProductionGL: 0,
    expectedPhShift: 0,
    glycerolYieldGL: 9.8,
    polysaccharideRelease: 'high',
    killerFactor: 'k2_positive',
    aromaProfileFa: 'گل بنفشه، توت سیاه، فلفل سیاه و حجم دهانی غنی',
    sardashtFitScore: 93,
    sardashtEngineeringNoteFa:
      'بسیار هم‌خوان با تیپ آروماتیک فلفلی-میوه‌ای انگور رشه کوهستانی سردشت و تولید گلیسرول بالا (۹.۸ g/L).'
  },

  // ==========================================================================
  // 2. SILKY PREMIUM RED (7 STRAINS)
  // ==========================================================================
  {
    id: 'laffort-zymaflore-fx10',
    code: 'Zymaflore FX10',
    nameEn: 'Laffort Zymaflore FX10',
    nameFa: 'لافورت زیمافلور FX10 (گرند کرو بوردو — تانن فوق‌ابریشمی HSP12)',
    brand: 'Laffort',
    species: 'Saccharomyces cerevisiae',
    category: 'silky_premium_red',
    recommendedStyles: ['red'],
    originFa: 'مارگو بوردو فرانسه (پژوهشگاه لافورت)',
    tempMinC: 18,
    tempOptMinC: 22,
    tempOptMaxC: 30,
    tempWarningC: 31.0,
    tempDangerC: 33.5,
    tempMaxC: 35,
    alcoholTolerancePct: 16,
    recommendedDoseGL: 0.2,
    rehydrationTempC: 37,
    yanDemandLevel: 'low',
    yanMultiplier: 0.8,
    requiresHighSterolsGoFerm: true,
    h2sRiskLevel: 'very_low',
    endogenousSo2MgL: 6,
    so2BindingLevel: 'very_low',
    malicConsumptionPct: -8,
    lacticAcidProductionGL: 0,
    expectedPhShift: 0,
    glycerolYieldGL: 9.6,
    polysaccharideRelease: 'extreme_hsp12',
    killerFactor: 'k2_positive',
    aromaProfileFa: 'کاسیس، تمشک سیاه، ابریشم خالص دهانی و پایان طولانی',
    sardashtFitScore: 99,
    sardashtEngineeringNoteFa:
      'بالاترین امتیاز تطابق (۹۹/۱۰۰) برای رشه سردشت بدون MLF: بیان ژن پروتئین شیرین HSP12 گسی تانن‌ها را کاملاً گرد کرده و نیاز نیتروژنی بسیار کمی (۰.۸۰x) دارد.'
  },
  {
    id: 'laffort-zymaflore-xpure',
    code: 'Zymaflore XPURE',
    nameEn: 'Laffort Zymaflore XPURE',
    nameFa: 'لافورت زیمافلور XPURE (تخمیر فوق‌خالص بدون H2S و SO2)',
    brand: 'Laffort',
    species: 'Saccharomyces cerevisiae',
    category: 'silky_premium_red',
    recommendedStyles: ['red'],
    originFa: 'بوردو فرانسه (اصلاح غیرتراریخته لافورت)',
    tempMinC: 16,
    tempOptMinC: 20,
    tempOptMaxC: 28,
    tempWarningC: 29.0,
    tempDangerC: 30.5,
    tempMaxC: 32,
    alcoholTolerancePct: 16,
    recommendedDoseGL: 0.2,
    rehydrationTempC: 37,
    yanDemandLevel: 'medium',
    yanMultiplier: 0.95,
    requiresHighSterolsGoFerm: true,
    h2sRiskLevel: 'zero_biotech',
    endogenousSo2MgL: 4,
    so2BindingLevel: 'very_low',
    malicConsumptionPct: -8,
    lacticAcidProductionGL: 0,
    expectedPhShift: 0,
    glycerolYieldGL: 8.6,
    polysaccharideRelease: 'medium',
    killerFactor: 'k2_positive',
    aromaProfileFa: 'بیان خالص تروآر رشه سردشت، آلبالو تازه و شفافیت آروماتیک',
    sardashtFitScore: 96,
    sardashtEngineeringNoteFa:
      'تولید استالدهید و SO2 درون‌زا نزدیک به صفر؛ باعث می‌شود دوز KMS روز ۱۱ بیشترین سهم SO2 آزاد و مولکولی فعال را ایجاد کند.'
  },
  {
    id: 'laffort-zymaflore-rx60',
    code: 'Zymaflore RX60',
    nameEn: 'Laffort Zymaflore RX60',
    nameFa: 'لافورت زیمافلور RX60 (تخصصی سیراه و قرمزهای ادویه‌ای)',
    brand: 'Laffort',
    species: 'Saccharomyces cerevisiae',
    category: 'silky_premium_red',
    recommendedStyles: ['red'],
    originFa: 'دره رون فرانسه (لافورت)',
    tempMinC: 18,
    tempOptMinC: 22,
    tempOptMaxC: 28,
    tempWarningC: 29.0,
    tempDangerC: 30.5,
    tempMaxC: 32,
    alcoholTolerancePct: 16.5,
    recommendedDoseGL: 0.2,
    rehydrationTempC: 37,
    yanDemandLevel: 'high',
    yanMultiplier: 1.15,
    requiresHighSterolsGoFerm: true,
    h2sRiskLevel: 'low',
    endogenousSo2MgL: 10,
    so2BindingLevel: 'low',
    malicConsumptionPct: -10,
    lacticAcidProductionGL: 0,
    expectedPhShift: 0,
    glycerolYieldGL: 9.0,
    polysaccharideRelease: 'high',
    killerFactor: 'k2_positive',
    aromaProfileFa: 'فلفل سیاه، بنفشه، توت سیاه و ساختار پلی‌فنولی منسجم',
    sardashtFitScore: 92,
    sardashtEngineeringNoteFa:
      'تحمل الکلی ۱۶.۵٪ و استخراج عالی پیش‌سازهای آروماتیک پوست رشه؛ نیازمند تغذیه دقیق در ۱/۳ افت قند.'
  },
  {
    id: 'laffort-zymaflore-f15',
    code: 'Zymaflore F15',
    nameEn: 'Laffort Zymaflore F15',
    nameFa: 'لافورت زیمافلور F15 (تثبیت رنگ و میوه‌های قرمز تازه)',
    brand: 'Laffort',
    species: 'Saccharomyces cerevisiae',
    category: 'silky_premium_red',
    recommendedStyles: ['red'],
    originFa: 'پومرول و سنت-امیلیون بوردو',
    tempMinC: 18,
    tempOptMinC: 22,
    tempOptMaxC: 28,
    tempWarningC: 29.5,
    tempDangerC: 31.5,
    tempMaxC: 32,
    alcoholTolerancePct: 16,
    recommendedDoseGL: 0.2,
    rehydrationTempC: 37,
    yanDemandLevel: 'medium',
    yanMultiplier: 1.0,
    requiresHighSterolsGoFerm: true,
    h2sRiskLevel: 'very_low',
    endogenousSo2MgL: 8,
    so2BindingLevel: 'low',
    malicConsumptionPct: -10,
    lacticAcidProductionGL: 0,
    expectedPhShift: 0,
    glycerolYieldGL: 8.8,
    polysaccharideRelease: 'high',
    killerFactor: 'k2_positive',
    aromaProfileFa: 'آلو قرمز، گیلاس سیاه، شیرینی میوه‌ای و تانن نرم',
    sardashtFitScore: 93,
    sardashtEngineeringNoteFa:
      'سینتیک بسیار منظم و آزادسازی زودهنگام پلی‌ساکاریدها برای تثبیت کمپلکس آنتوسیانین-تانن در ۵ روز اول خیساندن.'
  },
  {
    id: 'laffort-zymaflore-rb2',
    code: 'Zymaflore RB2',
    nameEn: 'Laffort Zymaflore RB2',
    nameFa: 'لافورت زیمافلور RB2 (ظرافت پینو نوآر و گیلاس روشن)',
    brand: 'Laffort',
    species: 'Saccharomyces cerevisiae',
    category: 'silky_premium_red',
    recommendedStyles: ['red'],
    originFa: 'کوت-دور بورگوندی فرانسه',
    tempMinC: 16,
    tempOptMinC: 20,
    tempOptMaxC: 27,
    tempWarningC: 28.5,
    tempDangerC: 30.5,
    tempMaxC: 31,
    alcoholTolerancePct: 15,
    recommendedDoseGL: 0.2,
    rehydrationTempC: 37,
    yanDemandLevel: 'low',
    yanMultiplier: 0.8,
    requiresHighSterolsGoFerm: true,
    h2sRiskLevel: 'low',
    endogenousSo2MgL: 8,
    so2BindingLevel: 'low',
    malicConsumptionPct: -8,
    lacticAcidProductionGL: 0,
    expectedPhShift: 0,
    glycerolYieldGL: 8.2,
    polysaccharideRelease: 'medium',
    killerFactor: 'k2_positive',
    aromaProfileFa: 'آلبالو، توت‌فرنگی جنگلی، ظرافت گل‌فام و تانن ظریف',
    sardashtFitScore: 95,
    sardashtEngineeringNoteFa:
      'رقیب مستقیم RC-212 از برند لافورت با نیاز نیتروژنی کمتر (۰.۸۰x) و ریسک H2S پایین‌تر برای سبک‌های ظریف رشه.'
  },
  {
    id: 'fermentis-safoeno-hd-s135',
    code: 'SafOeno HD S135',
    nameEn: 'Fermentis SafOeno HD S135',
    nameFa: 'فرمنتیس SafOeno HD S135 (استخراج پلی‌فنولی و تعادل قرمز)',
    brand: 'Fermentis',
    species: 'Saccharomyces cerevisiae',
    category: 'silky_premium_red',
    recommendedStyles: ['red'],
    originFa: 'فرانسه (Lesaffre / Fermentis)',
    tempMinC: 15,
    tempOptMinC: 18,
    tempOptMaxC: 26,
    tempWarningC: 28.0,
    tempDangerC: 30.0,
    tempMaxC: 32,
    alcoholTolerancePct: 15.5,
    recommendedDoseGL: 0.2,
    rehydrationTempC: 35,
    yanDemandLevel: 'low',
    yanMultiplier: 0.8,
    requiresHighSterolsGoFerm: false,
    h2sRiskLevel: 'low',
    endogenousSo2MgL: 6,
    so2BindingLevel: 'very_low',
    malicConsumptionPct: -8,
    lacticAcidProductionGL: 0,
    expectedPhShift: 0,
    glycerolYieldGL: 9.0,
    polysaccharideRelease: 'high',
    killerFactor: 'k2_positive',
    aromaProfileFa: 'میوه‌های جنگلی تیره، ادویه ملایم و کام بسیار گرد',
    sardashtFitScore: 94,
    sardashtEngineeringNoteFa:
      'فناوری E2U فرمنتیس با استرول ذاتی بالا و نیاز نیتروژنی کم؛ بسیار مناسب کارگاه‌هایی که Go-Ferm در دسترس ندارند.'
  },
  {
    id: 'fermentis-safoeno-hd-s62',
    code: 'SafOeno HD S62',
    nameEn: 'Fermentis SafOeno HD S62',
    nameFa: 'فرمنتیس SafOeno HD S62 (پلی‌ساکارید بالا و شراب‌های ذخیره)',
    brand: 'Fermentis',
    species: 'Saccharomyces cerevisiae',
    category: 'silky_premium_red',
    recommendedStyles: ['red'],
    originFa: 'فرانسه (Fermentis)',
    tempMinC: 16,
    tempOptMinC: 20,
    tempOptMaxC: 28,
    tempWarningC: 28.5,
    tempDangerC: 30.0,
    tempMaxC: 32,
    alcoholTolerancePct: 15.5,
    recommendedDoseGL: 0.2,
    rehydrationTempC: 35,
    yanDemandLevel: 'low',
    yanMultiplier: 0.85,
    requiresHighSterolsGoFerm: false,
    h2sRiskLevel: 'low',
    endogenousSo2MgL: 6,
    so2BindingLevel: 'low',
    malicConsumptionPct: -10,
    lacticAcidProductionGL: 0,
    expectedPhShift: 0,
    glycerolYieldGL: 9.2,
    polysaccharideRelease: 'high',
    killerFactor: 'k2_positive',
    aromaProfileFa: 'میوه سیاه رسیده، موکا و دهان‌مزه پرحجم',
    sardashtFitScore: 93,
    sardashtEngineeringNoteFa:
      'تولید گلیسرول ۹.۲ g/L و سازگاری عالی با چیپس بلوط فرانسوی در فاز پایانی بلوغ رشه سردشت.'
  },

  // ==========================================================================
  // 3. FRUITY RED & ROSE (4 STRAINS)
  // ==========================================================================
  {
    id: 'lalvin-71b',
    code: 'Lalvin 71B-1122',
    nameEn: 'Lalvin 71B-1122',
    nameFa: 'لالوین 71B-1122 (کاهش‌دهنده اسید مالیک — استرهای میوه‌ای)',
    brand: 'Lallemand',
    species: 'Saccharomyces cerevisiae',
    category: 'fruity_red_rose',
    recommendedStyles: ['red', 'rose'],
    originFa: 'ناربون فرانسه (INRA)',
    tempMinC: 15,
    tempOptMinC: 16,
    tempOptMaxC: 24,
    tempWarningC: 26.0,
    tempDangerC: 28.5,
    tempMaxC: 30,
    alcoholTolerancePct: 14,
    recommendedDoseGL: 0.25,
    rehydrationTempC: 37,
    yanDemandLevel: 'low',
    yanMultiplier: 0.8,
    requiresHighSterolsGoFerm: false,
    h2sRiskLevel: 'very_low',
    endogenousSo2MgL: 6,
    so2BindingLevel: 'low',
    malicConsumptionPct: -32,
    lacticAcidProductionGL: 0,
    expectedPhShift: 0.1,
    glycerolYieldGL: 7.2,
    polysaccharideRelease: 'medium',
    killerFactor: 'sensitive',
    aromaProfileFa: 'توت‌فرنگی تازه، گیلاس، موز ملایم و نوشایی زودرس',
    sardashtFitScore: 84,
    sardashtEngineeringNoteFa:
      'حدود ۳۰ تا ۳۵ درصد اسید مالیک را طی تخمیر الکلی مصرف می‌کند (تخمیر مالوائتانولیک). فقط زمانی استفاده شود که TA اولیه بالای ۷.۵ g/L و pH زیر ۳.۴۰ باشد؛ در غیر این صورت باعث افت اسیدیته و افزایش pH می‌شود.'
  },
  {
    id: 'lalvin-icv-gre',
    code: 'Lalvin ICV GRE',
    nameEn: 'Lalvin ICV GRE',
    nameFa: 'لالوین ICV GRE (میوه‌ای تازه با خیساندن کوتاه)',
    brand: 'Lallemand',
    species: 'Saccharomyces cerevisiae',
    category: 'fruity_red_rose',
    recommendedStyles: ['red', 'rose'],
    originFa: 'دره رون جنوبی فرانسه (گرناش)',
    tempMinC: 15,
    tempOptMinC: 17,
    tempOptMaxC: 25,
    tempWarningC: 26.5,
    tempDangerC: 28.0,
    tempMaxC: 29,
    alcoholTolerancePct: 15,
    recommendedDoseGL: 0.25,
    rehydrationTempC: 37,
    yanDemandLevel: 'medium',
    yanMultiplier: 0.95,
    requiresHighSterolsGoFerm: true,
    h2sRiskLevel: 'low',
    endogenousSo2MgL: 8,
    so2BindingLevel: 'low',
    malicConsumptionPct: -10,
    lacticAcidProductionGL: 0,
    expectedPhShift: 0,
    glycerolYieldGL: 8.0,
    polysaccharideRelease: 'medium',
    killerFactor: 'k2_positive',
    aromaProfileFa: 'انار، توت قرمز، آلبالو تازه و تانن ملایم',
    sardashtFitScore: 91,
    sardashtEngineeringNoteFa:
      'عالی برای شراب قرمز سبک یا پرس زودهنگام (SG 1.015) جهت جلوگیری از استخراج تانن‌های تلخ هسته.'
  },
  {
    id: 'lalvin-persy',
    code: 'Lalvin Persy',
    nameEn: 'Lalvin Persy',
    nameFa: 'لالوین Persy (میوه‌ای مدرن با ریسک صفر H2S)',
    brand: 'Lallemand',
    species: 'Saccharomyces cerevisiae',
    category: 'fruity_red_rose',
    recommendedStyles: ['red', 'rose'],
    originFa: 'استرالیا / لالماند (انتخاب کلاسیک مدرن)',
    tempMinC: 15,
    tempOptMinC: 18,
    tempOptMaxC: 26,
    tempWarningC: 27.0,
    tempDangerC: 28.5,
    tempMaxC: 30,
    alcoholTolerancePct: 16,
    recommendedDoseGL: 0.25,
    rehydrationTempC: 37,
    yanDemandLevel: 'low',
    yanMultiplier: 0.8,
    requiresHighSterolsGoFerm: true,
    h2sRiskLevel: 'zero_biotech',
    endogenousSo2MgL: 4,
    so2BindingLevel: 'very_low',
    malicConsumptionPct: -8,
    lacticAcidProductionGL: 0,
    expectedPhShift: 0,
    glycerolYieldGL: 8.2,
    polysaccharideRelease: 'medium',
    killerFactor: 'neutral',
    aromaProfileFa: 'توت سیاه و قرمز شفاف، بدون هیچ نت گوگردی مزاحم',
    sardashtFitScore: 95,
    sardashtEngineeringNoteFa:
      'عدم تولید سولفید هیدروژن حتی در شرایط فقر نیتروژن؛ تضمین سلامت حسی و بهره‌وری بالای SO2 آزاد پس از تخمیر.'
  },
  {
    id: 'enartisferm-red-fruit',
    code: 'EnartisFerm Red Fruit',
    nameEn: 'EnartisFerm Red Fruit',
    nameFa: 'انارتیس‌فرم Red Fruit (انفجار عطر توت و بنفشه)',
    brand: 'Enartis',
    species: 'Saccharomyces cerevisiae',
    category: 'fruity_red_rose',
    recommendedStyles: ['red', 'rose'],
    originFa: 'ایتالیا (Enartis)',
    tempMinC: 16,
    tempOptMinC: 18,
    tempOptMaxC: 26,
    tempWarningC: 28.5,
    tempDangerC: 30.5,
    tempMaxC: 32,
    alcoholTolerancePct: 15.5,
    recommendedDoseGL: 0.2,
    rehydrationTempC: 37,
    yanDemandLevel: 'high',
    yanMultiplier: 1.15,
    requiresHighSterolsGoFerm: true,
    h2sRiskLevel: 'medium',
    endogenousSo2MgL: 16,
    so2BindingLevel: 'low',
    malicConsumptionPct: -10,
    lacticAcidProductionGL: 0,
    expectedPhShift: 0,
    glycerolYieldGL: 10.2,
    polysaccharideRelease: 'high',
    killerFactor: 'k2_positive',
    aromaProfileFa: 'تمشک، توت‌فرنگی، بنفشه و شیرینی گلیسرولی (۱۰.۲ g/L)',
    sardashtFitScore: 91,
    sardashtEngineeringNoteFa:
      'تولید گلیسرول بسیار بالا (۱۰.۲ g/L) و عطر خیره‌کننده میوه‌های قرمز؛ نیازمند تامین دقیق نیتروژن آلی (Fermaid O).'
  },

  // ==========================================================================
  // 4. AROMATIC ROSE & WHITE (7 STRAINS)
  // ==========================================================================
  {
    id: 'lalvin-rhone-4600',
    code: 'Lalvin Rhône 4600',
    nameEn: 'Lalvin Rhône 4600',
    nameFa: 'لالوین رون 4600 (مرجع استاندارد رُزه سنیه سردشت)',
    brand: 'Lallemand',
    species: 'Saccharomyces cerevisiae',
    category: 'aromatic_rose_white',
    recommendedStyles: ['rose'],
    originFa: 'کوت-دو-رون فرانسه (ICV)',
    tempMinC: 13,
    tempOptMinC: 15,
    tempOptMaxC: 18,
    tempWarningC: 18.5,
    tempDangerC: 19.5,
    tempMaxC: 22,
    alcoholTolerancePct: 15,
    recommendedDoseGL: 0.25,
    rehydrationTempC: 37,
    yanDemandLevel: 'low',
    yanMultiplier: 0.8,
    requiresHighSterolsGoFerm: true,
    h2sRiskLevel: 'very_low',
    endogenousSo2MgL: 8,
    so2BindingLevel: 'low',
    malicConsumptionPct: -5,
    lacticAcidProductionGL: 0,
    expectedPhShift: 0,
    glycerolYieldGL: 8.4,
    polysaccharideRelease: 'high',
    killerFactor: 'k2_positive',
    aromaProfileFa: 'توت‌فرنگی تازه، هلو سفید، گریپ‌فروت صورتی و حجم دهانی گرد',
    sardashtFitScore: 99,
    sardashtEngineeringNoteFa:
      'سویه مرجع پروتکل رُزه سنیه (۳۴ لیتر شفاف): استرهای میوه‌ای را حفظ کرده و با پلی‌ساکارید بالا از نازک شدن بدنه رُزه جلوگیری می‌کند.'
  },
  {
    id: 'lalvin-icv-d47',
    code: 'Lalvin ICV D47',
    nameEn: 'Lalvin ICV D47',
    nameFa: 'لالوین ICV D47 (رُزه کرمی، مرکبات و گل‌های بهاری)',
    brand: 'Lallemand',
    species: 'Saccharomyces cerevisiae',
    category: 'aromatic_rose_white',
    recommendedStyles: ['rose'],
    originFa: 'کوت-دو-رون فرانسه (ICV)',
    tempMinC: 10,
    tempOptMinC: 15,
    tempOptMaxC: 20,
    tempWarningC: 19.0,
    tempDangerC: 20.5,
    tempMaxC: 28,
    alcoholTolerancePct: 15,
    recommendedDoseGL: 0.25,
    rehydrationTempC: 37,
    yanDemandLevel: 'low',
    yanMultiplier: 0.78,
    requiresHighSterolsGoFerm: true,
    h2sRiskLevel: 'low',
    endogenousSo2MgL: 10,
    so2BindingLevel: 'low',
    malicConsumptionPct: -5,
    lacticAcidProductionGL: 0,
    expectedPhShift: 0,
    glycerolYieldGL: 8.0,
    polysaccharideRelease: 'high',
    killerFactor: 'k2_positive',
    aromaProfileFa: 'مرکبات، گل بهارنارنج، میوه هسته‌دار و بافت ابریشمی',
    sardashtFitScore: 97,
    sardashtEngineeringNoteFa:
      'گزینه جایگزین شماره ۱ در پروتکل رُزه سردشت؛ فعالیت عالی بتا-گلوکوزیداز برای آزادسازی ترپن‌های معطر.'
  },
  {
    id: 'lalvin-qa23',
    code: 'Lalvin QA23',
    nameEn: 'Lalvin QA23',
    nameFa: 'لالوین QA23 (آزادسازی تیول‌های گرمسیری و تخمیر بسیار امن)',
    brand: 'Lallemand',
    species: 'Saccharomyces cerevisiae bayanus',
    category: 'aromatic_rose_white',
    recommendedStyles: ['rose'],
    originFa: 'پرتغال (دانشگاه UTAD)',
    tempMinC: 14,
    tempOptMinC: 15,
    tempOptMaxC: 20,
    tempWarningC: 19.5,
    tempDangerC: 21.0,
    tempMaxC: 28,
    alcoholTolerancePct: 16,
    recommendedDoseGL: 0.25,
    rehydrationTempC: 37,
    yanDemandLevel: 'low',
    yanMultiplier: 0.75,
    requiresHighSterolsGoFerm: false,
    h2sRiskLevel: 'very_low',
    endogenousSo2MgL: 8,
    so2BindingLevel: 'low',
    malicConsumptionPct: -5,
    lacticAcidProductionGL: 0,
    expectedPhShift: 0,
    glycerolYieldGL: 7.0,
    polysaccharideRelease: 'medium',
    killerFactor: 'k2_positive',
    aromaProfileFa: 'پشن‌فروت، گریپ‌فروت، انار تازه و پایان ترد',
    sardashtFitScore: 95,
    sardashtEngineeringNoteFa:
      'نیاز نیتروژنی و اکسیژنی بسیار پایین (۰.۷۵x)؛ بهترین انتخاب برای آب‌انگور رُزه بسیار زلال‌شده که کدورت پایینی دارد.'
  },
  {
    id: 'laffort-zymaflore-x5',
    code: 'Zymaflore X5 / ROSÉ',
    nameEn: 'Laffort Zymaflore X5',
    nameFa: 'لافورت زیمافلور X5 (رُزه پروانس — تیول و طراوت مرکباتی)',
    brand: 'Laffort',
    species: 'Saccharomyces cerevisiae',
    category: 'aromatic_rose_white',
    recommendedStyles: ['rose'],
    originFa: 'بوردو / پروانس فرانسه (لافورت)',
    tempMinC: 13,
    tempOptMinC: 14,
    tempOptMaxC: 18,
    tempWarningC: 18.5,
    tempDangerC: 19.5,
    tempMaxC: 20,
    alcoholTolerancePct: 16,
    recommendedDoseGL: 0.2,
    rehydrationTempC: 37,
    yanDemandLevel: 'high',
    yanMultiplier: 1.15,
    requiresHighSterolsGoFerm: true,
    h2sRiskLevel: 'low',
    endogenousSo2MgL: 10,
    so2BindingLevel: 'low',
    malicConsumptionPct: -5,
    lacticAcidProductionGL: 0,
    expectedPhShift: 0,
    glycerolYieldGL: 7.4,
    polysaccharideRelease: 'medium',
    killerFactor: 'k2_positive',
    aromaProfileFa: 'مرکبات تازه، توت‌فرنگی وحشی، گل سفید و طراوت بالا',
    sardashtFitScore: 94,
    sardashtEngineeringNoteFa:
      'شدت آروماتیک خیره‌کننده در دمای ۱۵ تا ۱۷ درجه؛ نیازمند تغذیه کامل نیتروژن آلی در ابتدای تخمیر.'
  },
  {
    id: 'fermentis-safoeno-ck-s102',
    code: 'SafOeno CK S102',
    nameEn: 'Fermentis SafOeno CK S102',
    nameFa: 'فرمنتیس SafOeno CK S102 (رُزه معطر استری و توت قرمز)',
    brand: 'Fermentis',
    species: 'Saccharomyces cerevisiae',
    category: 'aromatic_rose_white',
    recommendedStyles: ['rose'],
    originFa: 'فرانسه (Fermentis)',
    tempMinC: 12,
    tempOptMinC: 14,
    tempOptMaxC: 18,
    tempWarningC: 18.5,
    tempDangerC: 20.0,
    tempMaxC: 22,
    alcoholTolerancePct: 14.5,
    recommendedDoseGL: 0.2,
    rehydrationTempC: 35,
    yanDemandLevel: 'medium',
    yanMultiplier: 0.95,
    requiresHighSterolsGoFerm: false,
    h2sRiskLevel: 'low',
    endogenousSo2MgL: 8,
    so2BindingLevel: 'low',
    malicConsumptionPct: -5,
    lacticAcidProductionGL: 0,
    expectedPhShift: 0,
    glycerolYieldGL: 7.2,
    polysaccharideRelease: 'medium',
    killerFactor: 'k2_positive',
    aromaProfileFa: 'آب‌نبات توت‌فرنگی، تمشک، هلو و رایحه گل‌فام',
    sardashtFitScore: 93,
    sardashtEngineeringNoteFa:
      'تولید بالای استرهای ایزوآمیل استات و فنیل‌اتیل استات در دمای خنک (۱۴ تا ۱۷ درجه).'
  },
  {
    id: 'anchor-alchemy-i',
    code: 'Anchor Alchemy I',
    nameEn: 'Anchor Alchemy I',
    nameFa: 'آنکور آلکمی ۱ (بلند مهندسی استرالیا — تیول و استر هم‌افزا)',
    brand: 'Anchor',
    species: 'Saccharomyces cerevisiae',
    category: 'aromatic_rose_white',
    recommendedStyles: ['rose'],
    originFa: 'آفریقای جنوبی / انستیتو AWRI استرالیا',
    tempMinC: 13,
    tempOptMinC: 14,
    tempOptMaxC: 18,
    tempWarningC: 19.0,
    tempDangerC: 20.5,
    tempMaxC: 22,
    alcoholTolerancePct: 15.5,
    recommendedDoseGL: 0.25,
    rehydrationTempC: 37,
    yanDemandLevel: 'medium',
    yanMultiplier: 1.0,
    requiresHighSterolsGoFerm: true,
    h2sRiskLevel: 'low',
    endogenousSo2MgL: 8,
    so2BindingLevel: 'low',
    malicConsumptionPct: -5,
    lacticAcidProductionGL: 0,
    expectedPhShift: 0,
    glycerolYieldGL: 7.5,
    polysaccharideRelease: 'medium',
    killerFactor: 'k2_positive',
    aromaProfileFa: 'گل رز، گریپ‌فروت یاقوتی، انار و توت‌فرنگی',
    sardashtFitScore: 96,
    sardashtEngineeringNoteFa:
      'فرموله شده با همکاری انستیتو AWRI؛ سینتیک بسیار مطمئن در دمای سرد ۱۵ درجه بدون توقف تخمیر.'
  },
  {
    id: 'anchor-alchemy-iv',
    code: 'Anchor Alchemy IV',
    nameEn: 'Anchor Alchemy IV',
    nameFa: 'آنکور آلکمی ۴ (بلند هم‌افزا برای قرمز میوه‌ای و رُزه پررنگ)',
    brand: 'Anchor',
    species: 'Saccharomyces cerevisiae',
    category: 'aromatic_rose_white',
    recommendedStyles: ['red', 'rose'],
    originFa: 'آفریقای جنوبی / AWRI استرالیا',
    tempMinC: 16,
    tempOptMinC: 20,
    tempOptMaxC: 27,
    tempWarningC: 28.0,
    tempDangerC: 29.5,
    tempMaxC: 30,
    alcoholTolerancePct: 15.5,
    recommendedDoseGL: 0.25,
    rehydrationTempC: 37,
    yanDemandLevel: 'medium',
    yanMultiplier: 1.0,
    requiresHighSterolsGoFerm: true,
    h2sRiskLevel: 'low',
    endogenousSo2MgL: 8,
    so2BindingLevel: 'low',
    malicConsumptionPct: -8,
    lacticAcidProductionGL: 0,
    expectedPhShift: 0,
    glycerolYieldGL: 8.4,
    polysaccharideRelease: 'medium',
    killerFactor: 'k2_positive',
    aromaProfileFa: 'آلبالو، تمشک سیاه، گل سرخ و ساختار متوازن',
    sardashtFitScore: 94,
    sardashtEngineeringNoteFa:
      'سویه دوگانه عالی هم برای تخمیر قرمز میوه‌ای و هم رُزه سنیه در کارگاه‌هایی که می‌خواهند یک سویه واحد بخرند.'
  },

  // ==========================================================================
  // 5. HIGH ABV & STUCK FERMENTATION RESTART (4 STRAINS)
  // ==========================================================================
  {
    id: 'lalvin-ec-1118',
    code: 'Lalvin EC-1118',
    nameEn: 'Lalvin Prise de Mousse EC-1118',
    nameFa: 'لالوین EC-1118 (قهرمان شامپاین — احیای تخمیر متوقف تا ۱۸٪ الکل)',
    brand: 'Lallemand',
    species: 'Saccharomyces cerevisiae bayanus',
    category: 'high_abv_restart',
    recommendedStyles: ['restart', 'red', 'rose'],
    originFa: 'شامپاین فرانسه',
    tempMinC: 10,
    tempOptMinC: 14,
    tempOptMaxC: 28,
    tempWarningC: 30.0,
    tempDangerC: 32.0,
    tempMaxC: 34,
    alcoholTolerancePct: 18,
    recommendedDoseGL: 0.3,
    rehydrationTempC: 37,
    yanDemandLevel: 'low',
    yanMultiplier: 0.75,
    requiresHighSterolsGoFerm: false,
    h2sRiskLevel: 'very_low',
    endogenousSo2MgL: 8,
    so2BindingLevel: 'very_low',
    malicConsumptionPct: -5,
    lacticAcidProductionGL: 0,
    expectedPhShift: 0,
    glycerolYieldGL: 6.2,
    polysaccharideRelease: 'low',
    killerFactor: 'k2_positive',
    aromaProfileFa: 'خنثی، تمیز و بدون پوشاندن عطر ذاتی انگور',
    sardashtFitScore: 92,
    sardashtEngineeringNoteFa:
      'بیمه‌نامه کارگاه برای راه‌اندازی مجدد تخمیرهای متوقف‌شده (Stuck Fermentation) و تخمیر کامل قندهای بالا تا خشکی مطلق.'
  },
  {
    id: 'lalvin-k1-v1116',
    code: 'Lalvin K1-V1116',
    nameEn: 'Lalvin ICV K1-V1116',
    nameFa: 'لالوین K1-V1116 (مقاوم به تنش، گرما و غلبه بر مخمرهای وحشی)',
    brand: 'Lallemand',
    species: 'Saccharomyces cerevisiae',
    category: 'high_abv_restart',
    recommendedStyles: ['restart', 'rose', 'red'],
    originFa: 'مون‌پلیه فرانسه (ICV)',
    tempMinC: 10,
    tempOptMinC: 15,
    tempOptMaxC: 28,
    tempWarningC: 30.0,
    tempDangerC: 32.5,
    tempMaxC: 35,
    alcoholTolerancePct: 18,
    recommendedDoseGL: 0.25,
    rehydrationTempC: 37,
    yanDemandLevel: 'low',
    yanMultiplier: 0.78,
    requiresHighSterolsGoFerm: false,
    h2sRiskLevel: 'low',
    endogenousSo2MgL: 10,
    so2BindingLevel: 'low',
    malicConsumptionPct: -5,
    lacticAcidProductionGL: 0,
    expectedPhShift: 0,
    glycerolYieldGL: 6.5,
    polysaccharideRelease: 'low',
    killerFactor: 'k2_positive',
    aromaProfileFa: 'استرهای گل‌فام تازه و میوه روشن (در دمای زیر ۱۸ درجه)',
    sardashtFitScore: 91,
    sardashtEngineeringNoteFa:
      'فاکتور کشنده K2 بسیار قوی برای سرکوب مخمرهای وحشی بومی روی پوست انگورهای باران‌خورده یا آسیب‌دیده.'
  },
  {
    id: 'uvaferm-43',
    code: 'Uvaferm 43 Restart',
    nameEn: 'Lallemand Uvaferm 43',
    nameFa: 'اووافرم ۴۳ (فوق‌تخصصی فروکتوفیل برای نجات تخمیر متوقف)',
    brand: 'Lallemand',
    species: 'Saccharomyces cerevisiae bayanus',
    category: 'high_abv_restart',
    recommendedStyles: ['restart', 'red'],
    originFa: 'دره رون فرانسه (Inter-Rhône)',
    tempMinC: 13,
    tempOptMinC: 18,
    tempOptMaxC: 30,
    tempWarningC: 31.0,
    tempDangerC: 33.0,
    tempMaxC: 35,
    alcoholTolerancePct: 18.5,
    recommendedDoseGL: 0.35,
    rehydrationTempC: 37,
    yanDemandLevel: 'low',
    yanMultiplier: 0.75,
    requiresHighSterolsGoFerm: true,
    h2sRiskLevel: 'very_low',
    endogenousSo2MgL: 6,
    so2BindingLevel: 'very_low',
    malicConsumptionPct: -5,
    lacticAcidProductionGL: 0,
    expectedPhShift: 0,
    glycerolYieldGL: 6.8,
    polysaccharideRelease: 'low',
    killerFactor: 'k2_positive',
    aromaProfileFa: 'کاملاً خنثی، حفظ ساختار پلی‌فنولی و پایان کاملاً خشک',
    sardashtFitScore: 94,
    sardashtEngineeringNoteFa:
      'بالاترین میل ترکیبی با فروکتوز (Fructophilic)؛ قوی‌ترین سویه جهان برای مصرف آخرین گرم‌های قند باقی‌مانده در الکل بالا.'
  },
  {
    id: 'fermentis-safoeno-bc-s103',
    code: 'SafOeno BC S103',
    nameEn: 'Fermentis SafOeno BC S103',
    nameFa: 'فرمنتیس SafOeno BC S103 (تخمیر ایمن شرایط سخت بدون H2S)',
    brand: 'Fermentis',
    species: 'Saccharomyces cerevisiae bayanus',
    category: 'high_abv_restart',
    recommendedStyles: ['restart', 'red', 'rose'],
    originFa: 'شامپاین فرانسه (Fermentis)',
    tempMinC: 10,
    tempOptMinC: 15,
    tempOptMaxC: 28,
    tempWarningC: 30.5,
    tempDangerC: 32.5,
    tempMaxC: 35,
    alcoholTolerancePct: 18,
    recommendedDoseGL: 0.25,
    rehydrationTempC: 35,
    yanDemandLevel: 'low',
    yanMultiplier: 0.75,
    requiresHighSterolsGoFerm: false,
    h2sRiskLevel: 'zero_biotech',
    endogenousSo2MgL: 5,
    so2BindingLevel: 'very_low',
    malicConsumptionPct: -5,
    lacticAcidProductionGL: 0,
    expectedPhShift: 0,
    glycerolYieldGL: 6.8,
    polysaccharideRelease: 'low',
    killerFactor: 'k2_positive',
    aromaProfileFa: 'تمیز، شفاف و بدون تولید استالدهید یا گوگرد',
    sardashtFitScore: 93,
    sardashtEngineeringNoteFa:
      'نسخه مدرن‌تر و کم‌گوگردتر نسبت به EC-1118 برای احیای تخمیر یا تخمیرهای با قند بسیار بالا.'
  },

  // ==========================================================================
  // 6. HERITAGE CLASSIC (2 STRAINS)
  // ==========================================================================
  {
    id: 'maurivin-awri-796',
    code: 'Maurivin AWRI 796',
    nameEn: 'Maurivin AWRI 796',
    nameFa: 'موریوین AWRI 796 (استاندارد طلایی شیراز و کبرنه استرالیا)',
    brand: 'Maurivin',
    species: 'Saccharomyces cerevisiae',
    category: 'heritage_classic',
    recommendedStyles: ['red'],
    originFa: 'انستیتو تحقیقات شراب استرالیا (AWRI)',
    tempMinC: 15,
    tempOptMinC: 20,
    tempOptMaxC: 28,
    tempWarningC: 29.0,
    tempDangerC: 30.5,
    tempMaxC: 31,
    alcoholTolerancePct: 15.5,
    recommendedDoseGL: 0.25,
    rehydrationTempC: 37,
    yanDemandLevel: 'low',
    yanMultiplier: 0.8,
    requiresHighSterolsGoFerm: true,
    h2sRiskLevel: 'low',
    endogenousSo2MgL: 10,
    so2BindingLevel: 'low',
    malicConsumptionPct: -10,
    lacticAcidProductionGL: 0,
    expectedPhShift: 0,
    glycerolYieldGL: 8.0,
    polysaccharideRelease: 'medium',
    killerFactor: 'k2_positive',
    aromaProfileFa: 'توت سیاه، اکالیپتوس ملایم، ادویه و ساختار تاننی اصیل',
    sardashtFitScore: 92,
    sardashtEngineeringNoteFa:
      'سویه کلاسیک انستیتو AWRI استرالیا با مصرف نیتروژن بهینه و استخراج عالی رنگ در اقلیم‌های گرم و کوهستانی.'
  },
  {
    id: 'red-star-premier-rouge',
    code: 'Red Star Premier Rouge',
    nameEn: 'Red Star Premier Rouge (Pasteur Red)',
    nameFa: 'رد استار Premier Rouge (پاستور رد کلاسیک)',
    brand: 'Red Star',
    species: 'Saccharomyces cerevisiae',
    category: 'heritage_classic',
    recommendedStyles: ['red'],
    originFa: 'پاریس / بوردو فرانسه (کلکسیون پاستور)',
    tempMinC: 17,
    tempOptMinC: 20,
    tempOptMaxC: 28,
    tempWarningC: 28.5,
    tempDangerC: 30.0,
    tempMaxC: 30,
    alcoholTolerancePct: 15,
    recommendedDoseGL: 0.25,
    rehydrationTempC: 37,
    yanDemandLevel: 'medium',
    yanMultiplier: 1.1,
    requiresHighSterolsGoFerm: true,
    h2sRiskLevel: 'medium',
    endogenousSo2MgL: 12,
    so2BindingLevel: 'low',
    malicConsumptionPct: -10,
    lacticAcidProductionGL: 0,
    expectedPhShift: 0,
    glycerolYieldGL: 8.4,
    polysaccharideRelease: 'medium',
    killerFactor: 'neutral',
    aromaProfileFa: 'گیلاس پخته، توت سیاه و ساختار سنتی شراب قرمز',
    sardashtFitScore: 88,
    sardashtEngineeringNoteFa:
      'سویه سنتی و پرکاربرد خانگی؛ برای جلوگیری از تولید H2S حتماً تغذیه دو مرحله‌ای SNA رعایت شود.'
  },

  // ==========================================================================
  // 7. BIOTECH ZERO-H2S & BIO-ACIDIFICATION (2 STRAINS)
  // ==========================================================================
  {
    id: 'renaissance-avante',
    code: 'Renaissance Avante (Zero-H2S)',
    nameEn: 'Renaissance Avante',
    nameFa: 'رنسانس آوانته (فناوری عدم تولید H2S — ایمنی ۱۰۰٪ در برابر بوی تخم‌مرغ گندیده)',
    brand: 'Renaissance',
    species: 'Saccharomyces cerevisiae',
    category: 'biotech_zero_h2s_bioacid',
    recommendedStyles: ['red', 'rose'],
    originFa: 'کانادا (Renaissance Yeast — انتخاب کلاسیک غیرتراریخته)',
    tempMinC: 13,
    tempOptMinC: 18,
    tempOptMaxC: 28,
    tempWarningC: 29.0,
    tempDangerC: 30.5,
    tempMaxC: 31,
    alcoholTolerancePct: 17,
    recommendedDoseGL: 0.25,
    rehydrationTempC: 37,
    yanDemandLevel: 'low',
    yanMultiplier: 0.8,
    requiresHighSterolsGoFerm: true,
    h2sRiskLevel: 'zero_biotech',
    endogenousSo2MgL: 6,
    so2BindingLevel: 'very_low',
    malicConsumptionPct: -10,
    lacticAcidProductionGL: 0,
    expectedPhShift: 0,
    glycerolYieldGL: 9.0,
    polysaccharideRelease: 'high',
    killerFactor: 'neutral',
    aromaProfileFa: 'توت سیاه خالص، آلبالو، گل بنفشه و بدون کوچک‌ترین نقص گوگردی',
    sardashtFitScore: 98,
    sardashtEngineeringNoteFa:
      'به دلیل غیرفعال بودن طبیعی مسیر سولفیت ردوکتاز، حتی بدون سولفات مس یا در انگورهای گوگردپاشی‌شده دیرهنگام، مطلقاً H2S تولید نمی‌کند.'
  },
  {
    id: 'lallemand-level2-laktia',
    code: 'Level2 Laktia / Concerto (+RC-212)',
    nameEn: 'Lallemand Level2 Laktia / Chr. Hansen Concerto (Sequential)',
    nameFa: 'لاکتیا / کنسرتو + RC-212 (اسیدی‌سازی زیستی طبیعی با تولید اسید لاکتیک)',
    brand: 'Chr. Hansen',
    species: 'Lachancea thermotolerans + S. cerevisiae',
    category: 'biotech_zero_h2s_bioacid',
    recommendedStyles: ['red', 'rose'],
    originFa: 'دانمارک / فرانسه (Chr. Hansen & Lallemand)',
    tempMinC: 16,
    tempOptMinC: 18,
    tempOptMaxC: 25,
    tempWarningC: 26.5,
    tempDangerC: 28.0,
    tempMaxC: 28,
    alcoholTolerancePct: 15.5,
    recommendedDoseGL: 0.25,
    rehydrationTempC: 25,
    yanDemandLevel: 'medium',
    yanMultiplier: 1.0,
    requiresHighSterolsGoFerm: true,
    h2sRiskLevel: 'very_low',
    endogenousSo2MgL: 6,
    so2BindingLevel: 'low',
    malicConsumptionPct: -5,
    lacticAcidProductionGL: 2.5,
    expectedPhShift: -0.22,
    glycerolYieldGL: 10.5,
    polysaccharideRelease: 'high',
    killerFactor: 'non_sacch',
    aromaProfileFa: 'انار ترش‌وشیرین، آلبالو، طراوت لاکتیکی نرم و گلیسرول ۱۰.۵ g/L',
    sardashtFitScore: 98,
    sardashtEngineeringNoteFa:
      'انقلاب بیوتکنولوژی برای انگور رشه سردشت که ذاتاً pH بالایی دارد: بخشی از قند را به ۲.۵ g/L اسید لاکتیک پایدار تبدیل کرده، pH را حدود ۰.۲۲ واحد کاهش می‌دهد و نیاز به اسید تارتاریک خارجی را به حداقل می‌رساند.'
  }
];

export function getYeastStrainById(
  strainId?: string,
  isRose: boolean = false
): YeastStrainProfile {
  if (strainId) {
    const match = YEAST_STRAINS_DATABASE.find((s) => s.id === strainId);
    if (match) return match;
  }
  const fallbackId = isRose ? 'lalvin-rhone-4600' : 'lalvin-rc-212';
  return (
    YEAST_STRAINS_DATABASE.find((s) => s.id === fallbackId) ??
    YEAST_STRAINS_DATABASE[0]
  );
}

export function computeYeastAdjustedSnaPlan(params: {
  strainId?: string;
  isRose?: boolean;
  volumeL: number;
  brix: number;
  initialSG: number;
  naturalYAN?: number;
}): YeastAdjustedSnaPlan {
  const strain = getYeastStrainById(params.strainId, Boolean(params.isRose));
  const safeVolumeL = Math.max(0, params.volumeL);
  const naturalYAN = params.naturalYAN ?? 100;
  const sugarGPerL = Math.round(params.brix * 10 * params.initialSG * 10) / 10;
  const targetYAN = Math.round(Math.round(sugarGPerL) * strain.yanMultiplier);
  const neededYAN = Math.max(0, targetYAN - naturalYAN);
  const yanScale = neededYAN / 152;

  const yeastGrams = round2(strain.recommendedDoseGL * safeVolumeL);
  const goFermGrams = round2(yeastGrams * 1.2);

  // Baseline 400kg Rasha Sardasht SNA rates scaled by volumeL and yanScale
  const fermaidO_1 = round2(0.15 * safeVolumeL * yanScale);
  const fermaidK_2 = round2(0.2 * safeVolumeL * yanScale);
  const dap_2 = round2(0.18 * safeVolumeL * yanScale);
  const zinc_2 = round2(0.015 * safeVolumeL * Math.min(1.25, Math.max(0.5, yanScale)));
  const fermaidO_3 = round2(0.15 * safeVolumeL * yanScale);

  return {
    strain,
    sugarGPerL,
    naturalYAN,
    targetYAN,
    neededYAN,
    yanScale: round2(yanScale),
    yeastGrams,
    goFermGrams,
    fermaidO_1,
    fermaidK_2,
    dap_2,
    zinc_2,
    fermaidO_3
  };
}

export function computeYeastAcidityAndGlycerolImpact(params: {
  strainId?: string;
  isRose?: boolean;
  initialPH: number;
  initialTA: number;
  defaultMaxGlycerinGL: number;
}): YeastAcidityAndGlycerolImpact {
  const strain = getYeastStrainById(params.strainId, Boolean(params.isRose));

  // Malic degradation reduces TA (~0.035 g/L per 1% malic consumed on typical ~2.2 g/L malic must)
  const malicTaShift = (strain.malicConsumptionPct / 100) * 2.2;
  const predictedTaDeltaGL = round2(strain.lacticAcidProductionGL + malicTaShift);
  const predictedFinalTA = round2(Math.max(3.5, params.initialTA + predictedTaDeltaGL));
  const predictedFinalPH = round2(
    Math.min(4.2, Math.max(2.9, params.initialPH + strain.expectedPhShift))
  );

  const endogenousGlycerolGL = strain.glycerolYieldGL;
  // Baseline RC-212 yields ~8.2 g/L endogenous glycerol; higher-glycerol strains reduce exogenous glycerin need
  const glycerolExcessOverBaseline = Math.max(0, endogenousGlycerolGL - 8.2);
  const recommendedExogenousGlycerinCapGL = round2(
    Math.max(0, params.defaultMaxGlycerinGL - glycerolExcessOverBaseline * 0.8)
  );

  const hasBiologicalAcidification =
    strain.lacticAcidProductionGL > 0.5 || strain.expectedPhShift <= -0.1;
  const hasHighMalicDegradation = strain.malicConsumptionPct <= -25;

  let acidityGuidanceFa =
    'تغییر اسیدیته و pH در محدوده استاندارد تخمیر ساکارومایسس؛ تنظیم اسید تارتاریک طبق هدف روز صفر انجام شود.';
  if (hasBiologicalAcidification) {
    acidityGuidanceFa = `اسیدی‌سازی زیستی فعال (${strain.code}): تولید حدود ${strain.lacticAcidProductionGL} g/L اسید لاکتیک و کاهش طبیعی pH به میزان ${Math.abs(strain.expectedPhShift)} واحد؛ دوز اسید تارتاریک روز صفر را کاهش دهید.`;
  } else if (hasHighMalicDegradation) {
    acidityGuidanceFa = `مصرف بالای اسید مالیک (${Math.abs(strain.malicConsumptionPct)}٪ توسط ${strain.code}): افزایش احتمالی pH حدود +${strain.expectedPhShift} واحد؛ در صورت بالا بودن pH اولیه، اسید تارتاریک را دقیق تنظیم کنید.`;
  }

  const glycerolGuidanceFa =
    endogenousGlycerolGL >= 9.5
      ? `تولید گلیسرول طبیعی بسیار بالا (${endogenousGlycerolGL} g/L)؛ سقف گلیسیرین خوراکی کمکی به ${recommendedExogenousGlycerinCapGL} g/L کاهش یافت.`
      : `تولید گلیسرول درون‌زا ${endogenousGlycerolGL} g/L؛ سقف مجاز گلیسیرین کمکی پس از بلوغ ${recommendedExogenousGlycerinCapGL} g/L است.`;

  return {
    strain,
    predictedFinalPH,
    predictedTaDeltaGL,
    predictedFinalTA,
    endogenousGlycerolGL,
    recommendedExogenousGlycerinCapGL,
    hasBiologicalAcidification,
    hasHighMalicDegradation,
    acidityGuidanceFa,
    glycerolGuidanceFa
  };
}

export function recommendYeastStrainsForGoal(
  goal: YeastGoalId
): YeastStrainProfile[] {
  switch (goal) {
    case 'classic_sardasht_red':
      return YEAST_STRAINS_DATABASE.filter((s) =>
        [
          'lalvin-rc-212',
          'lalvin-icv-d21',
          'lalvin-icv-d254',
          'lalvin-bm-4x4',
          'enoferm-syrah',
          'maurivin-awri-796'
        ].includes(s.id)
      ).sort((a, b) => b.sardashtFitScore - a.sardashtFitScore);

    case 'velvety_reserve_red':
      return YEAST_STRAINS_DATABASE.filter(
        (s) =>
          s.recommendedStyles.includes('red') &&
          (s.polysaccharideRelease === 'extreme_hsp12' ||
            s.polysaccharideRelease === 'high') &&
          s.glycerolYieldGL >= 9.0
      ).sort((a, b) => b.sardashtFitScore - a.sardashtFitScore);

    case 'natural_acidity_boost':
      return YEAST_STRAINS_DATABASE.filter(
        (s) => s.expectedPhShift < 0 || s.lacticAcidProductionGL > 0
      ).sort((a, b) => a.expectedPhShift - b.expectedPhShift);

    case 'zero_h2s_safety':
      return YEAST_STRAINS_DATABASE.filter(
        (s) => s.h2sRiskLevel === 'zero_biotech'
      ).sort((a, b) => b.sardashtFitScore - a.sardashtFitScore);

    case 'aromatic_saignee_rose':
      return YEAST_STRAINS_DATABASE.filter(
        (s) => s.category === 'aromatic_rose_white'
      ).sort((a, b) => b.sardashtFitScore - a.sardashtFitScore);

    case 'stuck_fermentation_rescue':
      return YEAST_STRAINS_DATABASE.filter(
        (s) => s.category === 'high_abv_restart'
      ).sort((a, b) => b.alcoholTolerancePct - a.alcoholTolerancePct);
  }
}
