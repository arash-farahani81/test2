import {
  calculateKMS,
  calculateTartaricAddition,
  estimateAcidOrBaseFromPHShift,
  calculateCoolingDryIceKg,
  calculateMolecularSO2,
  calculateKHCO3Deacidification,
  calculateDeacidificationOptions,
  getEffectiveLiquidVolume,
  getTargetFreeSO2ByPH,
  getContinuousTargetFreeSO2ByPH,
  calculateH2O2SulfiteRemoval,
  calculateStagedH2O2Plan,
  calculateRefractometerCorrection
} from './enologyUtils.ts';

export interface ScenarioInput {
  batchVolumeL: number;
  currentSG: number;
  currentBrix: number;
  tempCapC: number;
  ph: number;
  ta: number; // g/L
  freeSO2: number; // mg/L
  dayNumber?: number;
  isRose?: boolean;
  isUnpressedMash?: boolean; // If true on red must with skins, applies 0.80 liquid-phase yield factor for water-soluble dosing
  isUnpressedRedMust?: boolean; // Alias for isUnpressedMash
  issues?: {
    isStuckFermentation?: boolean;
    hasH2S?: boolean;
    hasVolatileAcidity?: boolean;
    hasDryCap?: boolean;
    hasBitterSeeds?: boolean;
    hasCloudiness?: boolean;
  };
}

export interface CorrectiveAction {
  title: string;
  category: 'pH_Acid' | 'Temperature' | 'SG_Ferment' | 'SO2_Oxidation' | 'OffOdor_Spoilage' | 'Tannin_Fining';
  severity: 'normal' | 'caution' | 'warning' | 'danger';
  diagnosis: string;
  solutionSummary: string;
  calculatedRecipe?: {
    item: string;
    amount: string;
    unit: string;
    instruction: string;
  }[];
  steps: string[];
  alertTier?: 'critical' | 'attention' | 'info';
  canSnooze?: boolean;
  confidenceBadge?: 'stoichiometric' | 'rule_of_thumb' | 'empirical_unverified';
  confidenceLabelFa?: string;
  progressiveLayers?: {
    layer1ActionFa: string;
    layer2WhyFa: string;
    layer3ScienceFa: string;
  };
}

export interface EnologyEvaluationResult {
  overallHealthScore: number; // 0 to 100
  overallStatusText: string;
  overallStatusColor: 'emerald' | 'amber' | 'rose' | 'blue';
  criticalWarningsCount: number;
  actions: CorrectiveAction[];
  visibleActions: CorrectiveAction[];
  hiddenActionsCount: number;
  infoActions: CorrectiveAction[];
  hasInvalidVolume?: boolean;
}

/**
 * Comprehensive Evaluator & Corrector for all Winery Scenarios & Input Parameters
 * Upgraded with Protocol v2 Multi-Tier TA, Potassium Buffering Paradox (No-MLF rule),
 * Stage-Aware Temperatures, Dynamic pH-Dependent Free SO2 & H2O2 Neutralization,
 * Physical Contradiction Detection, and Complete Issue Handlers.
 */
export function evaluateEnologicalScenario(input: ScenarioInput): EnologyEvaluationResult {
  const hasInvalidVolume =
    !input.batchVolumeL || input.batchVolumeL <= 0 || !Number.isFinite(input.batchVolumeL);
  const vol = hasInvalidVolume ? 0 : input.batchVolumeL;
  const isRose = Boolean(input.isRose);
  const isUnpressedRedMust = Boolean((input.isUnpressedMash || input.isUnpressedRedMust) && !isRose);
  const effectiveLiquidVol = hasInvalidVolume ? 0 : getEffectiveLiquidVolume(vol, isUnpressedRedMust);
  const actions: CorrectiveAction[] = [];
  let score = 100;

  if (hasInvalidVolume) {
    score -= 40;
    actions.push({
      title: 'خطای ورودی: حجم مخزن نامعتبر یا وارد نشده است (توقف محاسبه دوز)',
      category: 'SG_Ferment',
      severity: 'danger',
      alertTier: 'critical',
      canSnooze: false,
      confidenceBadge: 'stoichiometric',
      confidenceLabelFa: 'نگهبان ایمنی حجم',
      diagnosis:
        'حجم مخزن صفر، منفی یا نامعتبر وارد شده است. محاسبه دوز گرم/میلی‌لیتر مواد شیمیایی بدون حجم معتبر متوقف شد تا از اوردوز یا خطای توزین جلوگیری شود.',
      solutionSummary: 'لطفاً ابتدا حجم معتبر مخزن (> 0 لیتر) را وارد نمایید.',
      calculatedRecipe: [
        {
          item: 'محاسبه دوز مواد افزودنی',
          amount: '0',
          unit: 'گرم',
          instruction: 'محاسبه متوقف شد — ابتدا حجم معتبر مخزن را وارد کنید'
        }
      ],
      steps: [
        'حجم واقعی فاز مایع یا توده مش مخزن (بر حسب لیتر، بزرگ‌تر از صفر) را در فیلد حجم وارد کنید.',
        'از محاسبه فرضی روی حجم پیش‌فرض ۱۳۲ لیتر خودداری شد تا دوز اشتباه به مخزن تزریق نگردد.'
      ]
    });
  }

  // Target values based on Rasha Sardasht Master Protocol v2
  const phMin = isRose ? 3.25 : 3.45;
  const phMax = isRose ? 3.42 : 3.60;
  const taMin = isRose ? 6.0 : 5.8;
  const taMax = isRose ? 7.5 : 7.2;

  // ----------------------------------------------------
  // 0. PHYSICAL CONTRADICTIONS & SENSOR SANITY CHECKS
  // ----------------------------------------------------
  if (input.currentSG < 0.985 || input.currentSG > 1.150) {
    score -= 35;
    actions.push({
      title: 'خطای فیزیکی یا کالیبراسیون هیدرومتر (SG خارج از محدوده طبیعی)',
      category: 'SG_Ferment',
      severity: 'danger',
      diagnosis: `وزن مخصوص واردشده (${input.currentSG.toFixed(3)}) خارج از بازه فیزیکی شیره انگور و شراب (0.985 تا 1.150) است.`,
      solutionSummary: 'بررسی سلامت شناور هیدرومتر، چرخش برای حذف حباب‌های CO2 و تصحیح دمای نمونه در ۲۰°C.',
      steps: [
        'نمونه را ابتدا ۲ دقیقه هم بزنید تا گاز CO2 محلول که باعث بالا رفتن کاذب هیدرومتر می‌شود خارج گردد.',
        'مطمئن شوید هیدرومتر به دیواره استوانه مدرج نچسبیده و کف استوانه گیر نکرده است.',
        'عدد خوانده‌شده را با جدول تصحیح دمای ۲۰ درجه سانتی‌گراد (SOP-TEST-01) اصلاح نمایید.'
      ]
    });
  }

  if (input.ph < 2.5 || input.ph > 4.5) {
    score -= 35;
    actions.push({
      title: 'خطای سنسور یا الکترود پی‌اچ‌متر (pH غیرممکن بیولوژیکی)',
      category: 'pH_Acid',
      severity: 'danger',
      diagnosis: `مقدار pH ثبت‌شده (${input.ph.toFixed(2)}) خارج از محدوده بیولوژیکی شیره انگور و شراب (2.50 تا 4.50) است و نشان‌دهنده عدم کالیبراسیون یا خرابی الکترود است.`,
      solutionSummary: 'کالیبراسیون مجدد دو نقطه‌ای پی‌اچ‌متر با بافرهای ۴.۰۱ و ۷.۰۰ و شستشو با محلول اسید سیتریک ۲٪ (بطری شماره ۴).',
      steps: [
        'الکترود پی‌اچ‌متر را با محلول استوک شماره ۴ (اسید سیتریک ۲٪) شستشو دهید تا رسوبات تارتارات و پروتئین پاک شوند.',
        'کالیبراسیون دو نقطه‌ای با بافرهای تازه در دمای ۲۰ درجه انجام دهید.',
        'الکترود را هرگز در آب مقطر نگهداری نکنید (فقط در محلول 3M KCl).'
      ]
    });
  }

  const expectedBrixFromSG =
    input.currentSG <= 0.995
      ? 0
      : Math.max(0, Math.round(261.3 * (1 - 1 / input.currentSG) * 10) / 10);

  if (
    input.currentSG >= 0.985 &&
    input.currentSG < 1.080 &&
    input.currentBrix > 0 &&
    Math.abs(input.currentBrix - expectedBrixFromSG) > 3.5
  ) {
    const terrillEst = calculateRefractometerCorrection(22.0, input.currentBrix);
    actions.push({
      title: 'تناقض فیزیکی بین عدد بریکس و وزن مخصوص (خطای شکست نور الکل در رفراکتومتر)',
      category: 'SG_Ferment',
      severity: 'normal',
      alertTier: 'info',
      canSnooze: true,
      confidenceBadge: 'empirical_unverified',
      confidenceLabelFa: 'تخمین اپتیکی تجربی',
      diagnosis: `در وزن مخصوص فعلی (SG = ${input.currentSG.toFixed(3)})، بریکس معادل واقعی حدود ${expectedBrixFromSG}° Bx است اما عدد ${input.currentBrix}° Bx وارد شده است. در حضور الکل، ضریب شکست نور تغییر کرده و رفراکتومتر عدد کاذب بالا نشان می‌دهد.`,
      solutionSummary: `در حین تخمیر صرفاً به هیدرومتر استناد کنید یا از ماشین‌حساب تصحیح خطای الکل رفراکتومتر (SOP-TEST-06؛ تخمین تِریل: SG ≈ ${terrillEst.trueSG.toFixed(3)} و بریکس واقعی ≈ ${terrillEst.trueBrix}° Bx) استفاده نمایید.`,
      steps: [
        'توجه داشته باشید که رفراکتومتر نوری پس از شروع تخمیر به دلیل حضور اتانول، عدد بریکس را ۵ تا ۸ درجه بالاتر از واقعیت نشان می‌دهد.',
        'برای تبدیل عدد رفراکتومتر به SG واقعی، به ابزار SOP-TEST-06 مراجعه کنید یا مستقیماً از هیدرومتر در استوانه مدرج استفاده نمایید.'
      ]
    });
  }

  // ----------------------------------------------------
  // 1. pH, TITRATABLE ACIDITY (TA) & POTASSIUM BUFFERING PARADOX
  // ----------------------------------------------------
  const isHighPhHighTaParadox = !isRose
    ? input.ph > 3.55 && input.ta >= 7.2
    : input.ph > 3.42 && input.ta >= 7.5;
  const isContradictoryLowPhLowTa = input.ph < phMin && input.ta > 0 && input.ta < taMin;
  const isLowTA = !isContradictoryLowPhLowTa && input.ta > 0 && input.ta < taMin;

  if (isContradictoryLowPhLowTa) {
    score -= 18;
    actions.push({
      title: 'تناقض آزمایشگاهی: pH پایین هم‌زمان با اسیدیته کل (TA) پایین',
      category: 'pH_Acid',
      severity: 'warning',
      confidenceBadge: 'empirical_unverified',
      confidenceLabelFa: 'نیازمند بازبینی سنسور/تیتراسیون',
      diagnosis: `ثبت هم‌زمان pH پایین (${input.ph.toFixed(2)} < ${phMin}) و اسیدیته قابل تیتر پایین (TA = ${input.ta.toFixed(1)} g/L < ${taMin} g/L) از نظر شیمیایی در آب‌انگور طبیعی متناقض است و اغلب ناشی از خطای کالیبراسیون الکترود پی‌اچ‌متر یا انقضای محلول سود ۰.۱ نرمال است.`,
      solutionSummary: 'توقف هرگونه افزودن اسید تارتاریک یا پتاسیم بیکربنات؛ کالیبراسیون مجدد دو نقطه‌ای پی‌اچ‌متر (بافرهای ۴.۰۱ و ۷.۰۰) و تکرار تیتراسیون با محلول 0.1N NaOH تازه.',
      steps: [
        'پیش از هرگونه اصلاح شیمیایی (اسیدزنی یا اسیدزدایی)، الکترود پی‌اچ‌متر را با بافرهای استاندارد ۴.۰۱ و ۷.۰۰ در دمای ۲۰ درجه کالیبره کنید.',
        'غلظت محلول سود (0.1N NaOH) و حجم دقیق نمونه (۵ میلی‌لیتر) را کنترل کرده و تیتراسیون TA را مجدداً انجام دهید.',
        'تنها پس از رفع تناقض سنسور، اقدام به تنظیم اسیدیته نمایید.'
      ]
    });
  } else if (input.ph < phMin) {
    const isSevere = input.ph < 3.20;
    score -= isSevere ? 25 : 12;

    // Potassium Bicarbonate: every 0.1 pH unit increase (or 1.0 g/L TA neutralization) requires 1.33 g/L stoichiometric KHCO3
    const totalKHCO3_Grams = calculateKHCO3Deacidification(input.ph, phMin, vol, isUnpressedRedMust);
    const bufferEst = estimateAcidOrBaseFromPHShift(input.ph, phMin, effectiveLiquidVol);

    actions.push({
      title: isSevere ? 'اصلاح اضطراری pH پایین و اسیدیته شدید' : 'اصلاح pH پایین و تنظیم بالانس طعمی',
      category: 'pH_Acid',
      severity: isSevere ? 'danger' : 'warning',
      diagnosis: `مقدار pH نمونه (${input.ph.toFixed(2)}) کمتر از محدوده استاندارد (${phMin}–${phMax}) است. اسیدیته ترش و تند بوده و تعادل حسی را برهم می‌زند.`,
      solutionSummary: `اصلاح اسیدیته با پتاسیم بیکربنات (KHCO3: تخمین تجربی اولیه جهت تست ۳ لیوانی در بازه ظرفیت بافری ${bufferEst.lowBufferGrams} تا ${bufferEst.highBufferGrams} گرم؛ استوکیومتری دقیق ۱.۳۳ گرم بر لیتر نیازمند ΔTA در فاز مایع مؤثر ${effectiveLiquidVol}L است) یا تثبیت سرما جهت رسوب بی‌تارتارات پتاسیم.`,
      calculatedRecipe: [
        {
          item: 'پتاسیم بیکربنات (KHCO3)',
          amount: `${totalKHCO3_Grams}`,
          unit: 'گرم',
          instruction: `تخمین تجربی اولیه جهت تست ۳ لیوانی (بازه ظرفیت بافری ${bufferEst.lowBufferGrams}–${bufferEst.highBufferGrams} گرم با میانگین ${bufferEst.typicalBufferGrams} گرم؛ استوکیومتری دقیق نیازمند ΔTA است).`
        }
      ],
      steps: [
        `توجه علمی: به دلیل تفاوت ظرفیت بافری شراب (۳۰ تا ۵۵ mEq/L·pH)، دوز مبتنی بر اختلاف pH (${totalKHCO3_Grams} گرم؛ بازه بافری ${bufferEst.lowBufferGrams} تا ${bufferEst.highBufferGrams} گرم) صرفاً یک تخمین تجربی اولیه جهت تست ۳ لیوانی است و استوکیومتری دقیق نیازمند ΔTA است.`,
        'ابتدا تست ۳ لیوانی ۱۰۰ میلی‌لیتری را اجرا کرده و سپس محلول تاییدشده را به آرامی به شربت اضافه کنید تا گاز CO2 خارج شود.',
        'پس از ۱۲ ساعت، pH و TA را مجدداً اندازه‌گیری کنید.',
        'در فاز نهایی، نگهداری در دمای سرما (۰ تا +۲ درجه) رسوب کریستال‌های بی‌تارتارات را کامل می‌کند.'
      ]
    });
  } else if (isHighPhHighTaParadox) {
    const isCriticalParadox = input.ph > 3.68 || input.ta > 8.5;
    score -= isCriticalParadox ? 30 : 22;
    const paradoxSO2Target = getTargetFreeSO2ByPH(Math.max(input.ph, 3.60), isRose);
    const kmsForParadox = calculateKMS(vol, input.freeSO2, paradoxSO2Target.target, isUnpressedRedMust);

    actions.push({
      title: 'پارادوکس اشباع پتاسیم و قانون سقف اسید (بدون مالولاکتیک)',
      category: 'pH_Acid',
      severity: isCriticalParadox ? 'danger' : 'warning',
      diagnosis: `هم‌زمان هم pH بالا (${input.ph.toFixed(2)}) و هم اسیدیته کل بالا (TA = ${input.ta.toFixed(1)} g/L ≥ سقف ۷.۲–۷.۵ g/L) مشاهده می‌شود! این پدیده ناشی از استخراج بالای یون پتاسیم (K⁺) از پوست انگور رشه و بافر شدن محیط است. از آنجا که در این پروتکل تخمیر مالولاکتیک (MLF) با باکتیلس قفل شده است، افزودن اسید تارتاریک بیشتر شراب را به شدت ترش و غیرقابل نوشیدن می‌کند!`,
      solutionSummary: `توقف مطلق افزودن اسید تارتاریک (رعایت سقف مطلق TA ≤ 7.5 g/L و حداکثر ۲.۵ g/L = ۳۳۰ گرم در مخزن ۱۳۲L)، پذیرش pH نهایی تا ۳.۶۰ و جبران حفاظت میکروبی با تنظیم سولفیت آزاد روی ${paradoxSO2Target.target} mg/L (بازه ${paradoxSO2Target.min}–${paradoxSO2Target.max} mg/L) + سرمازدایی ۱۴ روزه.`,
      calculatedRecipe: [
        {
          item: 'اسید تارتاریک خالص (Tartaric Acid)',
          amount: '0 (ممنوع - عبور از سقف TA)',
          unit: 'گرم',
          instruction: 'به دلیل قفل بودن مالولاکتیک و رسیدن TA به سقف مجاز، هیچ اسیدی اضافه نکنید!'
        },
        {
          item: 'افزایش دوز متابی‌سولفیت (KMS) متناسب با pH 3.6',
          amount: `${kmsForParadox}`,
          unit: 'گرم',
          instruction: `جهت رساندن سولفیت آزاد به ${paradoxSO2Target.target} mg/L و تامین ۰.۶–۰.۸ mg/L سولفیت مولکولی`
        }
      ],
      steps: [
        'افزودن اسید تارتاریک را فوراً متوقف کنید؛ هرگز از سقف TA = 7.5 g/L (یا سقف ۲.۵ گرم بر لیتر اسید افزودنی = ۳۳۰ گرم در ۱۳۲ لیتر) عبور نکنید.',
        `مقدار pH نهایی در محدوده ۳.۵۵ تا ۳.۶۰ را بپذیرید و به جای اسیدزنی، سطح سولفیت آزاد (Free SO2) را طبق جدول pH روی ${paradoxSO2Target.min} تا ${paradoxSO2Target.max} mg/L نگه دارید.`,
        'در روز ۶۵، پایدارسازی سرد ۱۴ روزه (۰ تا +۲ درجه با بذرپاشی ۰.۲۰ g/L کرم تارتار) را اجرا کنید تا پتاسیم مازاد به صورت بی‌تارتارات پتاسیم (KHT) رسوب کند.'
      ]
    });
  } else if (input.ph > phMax) {
    const phExcess = Math.round((input.ph - phMax) * 100) / 100;
    const isSevereLowTA = isLowTA && input.ta < 4.8;
    const isCritical = input.ph > 3.68 || isSevereLowTA;
    score -= (input.ph > 3.68 ? 30 : 15) + (isLowTA ? (isSevereLowTA ? 15 : 8) : 0);

    // Tartaric Acid: 1.0 g/L lowers pH by ~0.1 unit and increases TA by 1.0 g/L
    const tartaricGramsPerL = (phExcess / 0.1) * 1.0;
    const totalTartaricGrams = Math.round(tartaricGramsPerL * effectiveLiquidVol * 10) / 10;
    const acidBufferEst = estimateAcidOrBaseFromPHShift(input.ph, phMax, effectiveLiquidVol);
    const pHTarget = getTargetFreeSO2ByPH(input.ph, isRose);

    const targetTA = isRose ? 6.8 : 6.5;
    const taTartaricGrams = isLowTA
      ? calculateTartaricAddition(input.ta, targetTA, vol, isUnpressedRedMust)
      : 0;
    const recommendedTartaricGrams = isLowTA
      ? Math.max(totalTartaricGrams, taTartaricGrams)
      : totalTartaricGrams;

    actions.push({
      title: isCritical
        ? 'هشدار بحرانی: pH بالا و خطر آلودگی میکروبی'
        : 'اصلاح pH بالا با افزودن اسید تارتاریک',
      category: 'pH_Acid',
      severity: isCritical ? 'danger' : 'warning',
      diagnosis: isLowTA
        ? `مقدار pH نمونه (${input.ph.toFixed(2)}) بالاتر از حد مجاز (${phMax}) و هم‌زمان اسیدیته کل (TA = ${input.ta.toFixed(1)} g/L) کمتر از بازه استاندارد (${taMin}–${taMax} g/L) است. رنگ سرخ یاقوتی تضعیف شده و کارایی سولفیت آزاد (SO2) کاهش شدید می‌یابد.`
        : `مقدار pH نمونه (${input.ph.toFixed(2)}) بالاتر از حد مجاز (${phMax}) است. رنگ سرخ یاقوتی تضعیف شده و کارایی سولفیت آزاد (SO2) کاهش شدید می‌یابد.`,
      solutionSummary: isLowTA
        ? `اصلاح یکپارچه pH و کمبود TA با اسید تارتاریک خالص دارویی (دوز استوکیومتری کمبود TA = ${taTartaricGrams} گرم برای رسیدن به TA = ${targetTA} g/L؛ بازه ظرفیت بافری اصلاح pH: ${acidBufferEst.lowBufferGrams} تا ${acidBufferEst.highBufferGrams} گرم — نسخه واحد بدون دوباره‌کاری) و افزایش دوز محافظتی KMS بر اساس فاز مایع مؤثر.`
        : `اسیدی‌سازی با اسید تارتاریک خالص دارویی (تخمین تجربی اولیه جهت تست ۳ لیوانی در بازه بافری ${acidBufferEst.lowBufferGrams} تا ${acidBufferEst.highBufferGrams} گرم؛ استوکیومتری دقیق نیازمند ΔTA و رعایت سقف TA ≤ 7.5 g/L است) و افزایش دوز محافظتی KMS بر اساس فاز مایع مؤثر.`,
      calculatedRecipe: [
        {
          item: 'اسید تارتاریک خالص (Tartaric Acid)',
          amount: `${recommendedTartaricGrams}`,
          unit: 'گرم',
          instruction: isLowTA
            ? `نسخه واحد اصلاح هم‌زمان pH و TA (استوکیومتری ΔTA: ${taTartaricGrams} گرم جهت رسیدن به ${targetTA} g/L؛ بازه ظرفیت بافری pH: ${acidBufferEst.lowBufferGrams}–${acidBufferEst.highBufferGrams} گرم)`
            : `تخمین تجربی اولیه جهت تست ۳ لیوانی (بازه ظرفیت بافری ${acidBufferEst.lowBufferGrams}–${acidBufferEst.highBufferGrams} گرم؛ استوکیومتری دقیق نیازمند ΔTA و رعایت سقف ۲.۵ گرم بر لیتر است)`
        },
        {
          item: 'افزایش دوز متابی‌سولفیت (KMS)',
          amount: `${calculateKMS(vol, input.freeSO2, Math.max(38, pHTarget.target), isUnpressedRedMust)}`,
          unit: 'گرم',
          instruction: `جهت جبران افت کارایی SO2 مولکولی در pH بالا (هدف: ${Math.max(38, pHTarget.target)} mg/L)`
        }
      ],
      steps: [
        `توجه علمی: مقدار ${recommendedTartaricGrams} گرم (بازه بافری ${acidBufferEst.lowBufferGrams} تا ${acidBufferEst.highBufferGrams} گرم${isLowTA ? ` و دوز استوکیومتری ΔTA برابر ${taTartaricGrams} گرم` : ''}) جهت اصلاح یکپارچه اسیدیته محاسبه شده است (مشروط به عدم عبور TA از ۷.۵ گرم بر لیتر).`,
        'پس از تایید در تست ۳ لیوانی، محلول را به صورت یکنواخت به مخزن افزوده و مخلوط نمایید.',
        `به دلیل pH بالاتر، دوز سولفیت آزاد هدف را روی ${pHTarget.min}–${pHTarget.max} mg/L تنظیم کنید.`,
        'دمای کلاهک و ظروف را تحت کنترل دقیق نگه دارید تا آلودگی باکتریایی رخ ندهد.'
      ]
    });
  }

  // Multi-Tier Titratable Acidity (TA) Evaluation (only emit standalone low-TA when pH <= phMax to prevent duplicate Tartaric Acid recipes)
  if (isLowTA && input.ph <= phMax) {
    const isSevereLowTA = input.ta < 4.8;
    score -= isSevereLowTA ? 32 : 15;
    const targetTA = isRose ? 6.8 : 6.5;
    const tartaricNeeded = calculateTartaricAddition(input.ta, targetTA, vol, isUnpressedRedMust);

    actions.push({
      title: isSevereLowTA
        ? 'کمبود بحرانی اسیدیته کل (TA < 4.8 g/L) و خطر فساد میکروبی'
        : 'کمبود ملایم اسیدیته کل (TA پایین) و طعم تخت شراب',
      category: 'pH_Acid',
      severity: isSevereLowTA ? 'danger' : 'warning',
      diagnosis: `اسیدیته کل فعلی (TA = ${input.ta.toFixed(1)} g/L) کمتر از بازه استاندارد (${taMin}–${taMax} g/L) است. کمبود اسید باعث طعم تخت (Flat)، بی‌روح شدن میوه‌ای شراب و افزایش آسیب‌پذیری میکروبی می‌شود.`,
      solutionSummary: `افزودن دقیق ${tartaricNeeded} گرم اسید تارتاریک خالص L(+) بر اساس حجم مایع مؤثر (${effectiveLiquidVol}L) جهت رساندن TA به ${targetTA} g/L.`,
      calculatedRecipe: [
        {
          item: 'اسید تارتاریک خالص (Tartaric Acid)',
          amount: `${tartaricNeeded}`,
          unit: 'گرم',
          instruction: isSevereLowTA
            ? 'در ۲ مرحله به فاصله ۱۲ ساعت تزریق شود و پس از مرحله اول pH و طعم چک گردد'
            : `حل‌شده در شیره/شراب جهت رسیدن به TA = ${targetTA} g/L`
        }
      ],
      steps: [
        'ابتدا تست ۳ لیوانی اسید تارتاریک را با محلول استوک شماره ۱ (۱۰٪ اسید تارتاریک) روی نمونه ۱۰۰ میلی‌لیتری انجام دهید.',
        `مقدار ${tartaricNeeded} گرم اسید تارتاریک را در ۲ لیتر از شیره/شراب حل کرده و به مخزن اضافه کنید.`,
        'پس از ۱۲ ساعت همگن‌سازی، مجدداً تیتراسیون TA با سود ۰.۱ نرمال و خوانش pH را تکرار نمایید.'
      ]
    });
  } else if (input.ta > taMax && !(isHighPhHighTaParadox && input.ta <= 9.0)) {
    const targetBaseTA = isRose ? 7.0 : 6.8;
    const taExcess = Math.max(0.1, Math.round((input.ta - targetBaseTA) * 100) / 100);
    const deacidOptions = calculateDeacidificationOptions(taExcess, effectiveLiquidVol);
    const khco3Grams = deacidOptions.khco3StoichiometricGrams;
    const khco3ColdStabGrams = deacidOptions.khco3WithColdStabGrams;
    const caco3Grams = deacidOptions.caco3Grams;

    if (input.ta > 12.0) {
      // Extreme / Anomalous TA (> 12.0 g/L, e.g., TA = 20 g/L)
      score -= 55;
      actions.push({
        title: 'خطای بحرانی اسیدیته کل (TA غیرطبیعی / اوردوز اسید / خطای تیتراسیون آزمایشگاهی)',
        category: 'pH_Acid',
        severity: 'danger',
        diagnosis: `مقدار اسیدیته کل ثبت‌شده (TA = ${input.ta.toFixed(1)} g/L) به شکل غیرطبیعی و بحرانی بالاتر از سقف مجاز (${taMax} g/L) است! این عدد نشان‌دهنده یکی از ۳ علت ریشه‌ای زیر است: (۱) خطای ۱۰ برابری نرمالیته سود در تیتراسیون آزمایشگاهی (استفاده از سود ۱.۰ نرمال به جای ۰.۱ نرمال یا خطای حجم نمونه ۵mL)، (۲) اوردوز شدید توزین اسید تارتاریک هنگام اسیدزنی، یا (۳) فساد شدید باکتری سرکه (Acetobacter) و تبدیل الکل به اسید استیک.`,
        solutionSummary: `تکرار فوری تیتراسیون با محلول استاندارد 0.1N NaOH تازه؛ و در صورت تایید اوردوز واقعی اسید، اسیدزدایی اضطراری با کربنات کلسیم (CaCO3: ۰.۶۷ گرم بر لیتر به ازای هر ۱ g/L کاهش TA) یا پتاسیم بیکربنات (KHCO3: استوکیومتری ۱.۳۳ گرم بر لیتر یا ۱.۰۰ گرم بر لیتر همراه با سرمازدایی).`,
        calculatedRecipe: [
          {
            item: 'کربنات کلسیم خالص انولوژیک (CaCO3)',
            amount: `${caco3Grams}`,
            unit: 'گرم',
            instruction: `معادل 0.67 g/L به ازای هر 1.0 g/L اسید مازاد در ${effectiveLiquidVol}L مایع (مناسب کاهش اسیدیته‌های شدید)`
          },
          {
            item: 'پتاسیم بیکربنات (KHCO3 - استوکیومتری خالص ۱.۳۳ g/L)',
            amount: `${khco3Grams}`,
            unit: 'گرم',
            instruction: `معادل 1.33 g/L استوکیومتری خالص (${khco3ColdStabGrams} گرم با احتساب رسوب سرمازدایی ۱.۰۰ g/L) در ${effectiveLiquidVol}L مایع`
          }
        ],
        steps: [
          'گام اول (کنترل خطای آزمایشگاه): فرمول TA = (V_NaOH × N_NaOH × 75) / V_sample را چک کنید. مطمئن شوید سود مصرفی دقیقاً 0.1N است و حجم نمونه دقیقاً ۵ میلی‌لیتر بوده است.',
          'گام دوم (بررسی بوی سرکه): اگر نمونه بوی تند سرکه یا لاک ناخن می‌دهد، افزایش TA ناشی از اسید استیک فرار (VA) است و با کربنات اصلاح نمی‌شود؛ فوراً پروتکل مهار استوباکتر (KMS + سرمایش) را اجرا کنید.',
          `گام سوم (اصلاح اوردوز اسید تارتاریک): اگر اسید تارتاریک بیش از حد ریخته شده، تست لیوانی اسیدزدایی را با ${caco3Grams} گرم کربنات کلسیم (CaCO3) یا ${khco3Grams} گرم پتاسیم بیکربنات انجام داده و سپس ۱۴ روز در دمای ۰ تا +۲ درجه سرمازدایی کنید.`
        ]
      });
    } else if (input.ta > 9.0) {
      // High Danger TA (9.0 < TA <= 12.0 g/L)
      score -= 35;
      const cappedKHCO3 = Math.round(Math.min(2.5, taExcess * 1.33) * effectiveLiquidVol * 10) / 10;
      actions.push({
        title: `هشدار قرمز: اسیدیته کل بسیار بالا (TA = ${input.ta.toFixed(1)} g/L) و طعم ترش گزنده`,
        category: 'pH_Acid',
        severity: 'danger',
        diagnosis: `اسیدیته کل (${input.ta.toFixed(1)} g/L) بسیار بالاتر از سقف پروتکل (${taMax} g/L) است. از آنجا که تخمیر مالولاکتیک (MLF) در این پروتکل انجام نمی‌شود، این حجم از اسید باعث ترشی تند و گزندگی شدید در کام می‌گردد.`,
        solutionSummary: 'اسیدزدایی شیمیایی کنترل‌شده با کربنات کلسیم (CaCO3) یا پتاسیم بیکربنات (KHCO3) به همراه سرمازدایی ۱۴ روزه در ۰ تا +۲ درجه.',
        calculatedRecipe: [
          {
            item: 'کربنات کلسیم خالص (CaCO3)',
            amount: `${caco3Grams}`,
            unit: 'گرم',
            instruction: '۰.۶۷ گرم بر لیتر به ازای هر ۱.۰ g/L کاهش TA'
          },
          {
            item: 'پتاسیم بیکربنات (KHCO3 - با سقف ایمن)',
            amount: `${cappedKHCO3}`,
            unit: 'گرم',
            instruction: '۱.۳۳ گرم بر لیتر استوکیومتری به ازای هر ۱.۰ g/L کاهش TA (حداکثر مجاز ۲.۵ g/L در هر مرحله)'
          }
        ],
        steps: [
          'ابتدا در ۳ لیوان ۱۰۰ میلی‌لیتری، دوزهای پلکانی KHCO3 یا CaCO3 را تست کنید.',
          'محلول را به آرامی تزریق کنید (توجه: واکنش با اسید گاز CO2 و کف شدید تولید می‌کند؛ فضای خالی ظرف را رعایت کنید).',
          'سپس در روز ۶۵، پایدارسازی سرد (۰ تا +۲ درجه به مدت ۱۴ روز) را جهت رسوب کریستال‌های تارتارات اجرا نمایید.'
        ]
      });
    } else {
      // Warning High TA (taMax < TA <= 9.0 g/L)
      score -= 18;
      actions.push({
        title: 'اسیدیته کل بالا (TA > سقف پروتکل) و نیاز به تعادل‌بخشی بدون مالولاکتیک',
        category: 'pH_Acid',
        severity: 'warning',
        diagnosis: `اسیدیته کل (${input.ta.toFixed(1)} g/L) بالاتر از محدوده بهینه (${taMin}–${taMax} g/L) است. به دلیل حذف عمدی تخمیر مالولاکتیک (No-MLF Protocol)، اسید مالیک و تارتاریک به اسید لاکتیک تبدیل نمی‌شوند و باید با سرمازدایی یا بیکربنات ملایم متعادل شوند.`,
        solutionSummary: `عدم افزودن هرگونه اسید تارتاریک جدید + اجرای پایدارسازی سرد ۱۴ روزه (۰ تا +۲ درجه) که ۱.۰ تا ۱.۵ g/L از TA را به صورت طبیعی رسوب می‌دهد، یا استفاده ملایم از ${khco3Grams} گرم KHCO3 (${khco3ColdStabGrams} گرم با سرمازدایی).`,
        calculatedRecipe: [
          {
            item: 'پتاسیم بیکربنات ملایم (KHCO3 - اختیاری پس از سرمازدایی)',
            amount: `${khco3Grams}`,
            unit: 'گرم',
            instruction: `معادل ۱.۳۳ گرم بر لیتر استوکیومتری (${khco3ColdStabGrams} گرم با سرمازدایی) به ازای هر ۱.۰ g/L کاهش TA در ${effectiveLiquidVol}L مایع`
          }
        ],
        steps: [
          'هیچ اسید تارتاریک یا سیتریک جدیدی به مخزن اضافه نکنید.',
          'در ایستگاه پایدارسازی سرد (روز ۶۵ تا ۸۰)، دمای شراب را به ۰ تا +۲ درجه برسانید و ۰.۲۰ g/L کرم تارتار بزنید تا ۱ تا ۱.۵ گرم بر لیتر اسید به صورت طبیعی رسوب کند.',
          'در روز ۸۵، در صورت باقی ماندن تیزی اسید، با تست ۳ لیوانی گلیسیرین (۱.۵ تا ۳.۵ g/L) یا دوز ملایم KHCO3 تعادل طعمی را تنظیم کنید.'
        ]
      });
    }
  }

  // ----------------------------------------------------
  // 2. STAGE-AWARE TEMPERATURE CONTROL & COOLING
  // ----------------------------------------------------
  if (input.currentSG <= 0.995) {
    // Stage 4: Post-Fermentation / Finished Wine Aging (Optimal: 14.0–16.0 °C, or 0–2 °C in cold stab)
    if (input.tempCapC > 20.0) {
      const isDangerFinishedTemp = input.tempCapC > 24.0;
      score -= isDangerFinishedTemp ? 38 : 20;
      actions.push({
        title: 'خطر گرمایش شراب تمام‌شده (اکسیداسیون و فعالیت باکتری سرکه در فاز نگهداری)',
        category: 'Temperature',
        severity: isDangerFinishedTemp ? 'danger' : 'warning',
        diagnosis: `تخمیر الکلی به پایان رسیده است (SG = ${input.currentSG.toFixed(3)} ≤ 0.995) و دیگر لایه محافظ گاز CO2 تولید نمی‌شود. نگهداری شراب تمام‌شده در دمای ${input.tempCapC}°C (به جای دمای استاندارد ۱۴ تا ۱۶ درجه) سرعت اکسیداسیون فنولی، تبخیر سولفیت آزاد و رشد باکتری‌های سرکه (Acetobacter) را ۳ برابر می‌کند!`,
        solutionSummary: 'انتقال فوری گالن‌ها به محیط خنک ۱۴ تا ۱۵ درجه سانتی‌گراد، لب‌به‌لب کردن کامل گلوگاه (Top-up) و کنترل سطح سولفیت آزاد متناسب با pH.',
        steps: [
          'فوراً دمای اتاق نگهداری یا یخچال کارگاه را روی ۱۴ تا ۱۵ درجه سانتی‌گراد تنظیم کنید.',
          'فضای خالی بالای گالن‌های شیشه‌ای را با شراب ذخیره (Top-up) کاملاً لب‌به‌لب کنید تا اکسیژن به صفر برسد.',
          'سطح سولفیت آزاد (Free SO2) را اندازه‌گیری کنید؛ در دمای بالا سولفیت آزاد به سرعت مصرف و اکسید می‌شود.'
        ]
      });
    }
  } else if (!isRose && input.currentSG > 0.995 && input.currentSG <= 1.008) {
    // Stage 3: Post-Pressing Liquid Finishing for Red Wine (Optimal: 21.0–22.5 °C)
    if (input.tempCapC < 18.5) {
      score -= 20;
      actions.push({
        title: 'هشدار سرمایش پس از پرسینگ و خطر توقف تخمیر در فاز مایع (بحران ۴)',
        category: 'Temperature',
        severity: 'warning',
        diagnosis: `در فاز پایانی تخمیر مایع پس از پرسینگ (SG = ${input.currentSG.toFixed(3)})، دمای مایع به ${input.tempCapC}°C افت کرده است. سرد شدن شراب زیر ۱۸.۵ درجه در حضور ۱۲.۵٪ الکل باعث به خواب رفتن مخمرها و باقی ماندن قند احیاکننده (Stuck Fermentation) می‌شود.`,
        solutionSummary: 'تثبیت دمای گالن‌ها روی ۲۱ تا ۲۲.۵ درجه سانتی‌گراد و معلق‌سازی ملایم دُرد نرم تا رسیدن به خشکی مطلق (SG ≤ 0.993).',
        steps: [
          'گالن‌های شراب آب‌آزاد و پرس را در محیط ۲۱ تا ۲۲.۵ درجه سانتی‌گراد قرار دهید تا ۳۰ گرم قند باقی‌مانده ظرف ۲ تا ۴ روز کامل مصرف شود.',
          'با میله استیل ضدعفونی‌شده، دُرد نرم مخمری کف گالن را روزی یک بار به آرامی معلق کنید.'
        ]
      });
    } else if (input.tempCapC > 26.0) {
      const isDangerPostPress = input.tempCapC >= 29.0;
      score -= isDangerPostPress ? 30 : 15;
      actions.push({
        title: 'افزایش بیش از حد دمای فاز مایع پس از پرسینگ',
        category: 'Temperature',
        severity: isDangerPostPress ? 'danger' : 'warning',
        diagnosis: `دمای شراب پس از جداسازی پوست (${input.tempCapC}°C) بالاتر از دمای هدف ۲۲ درجه است و موجب تبخیر استرهای ظریف میوه‌ای می‌گردد.`,
        solutionSummary: 'کاهش دمای محیط به ۲۰–۲۲ درجه سانتی‌گراد تا اتمام آرام قند باقی‌مانده.',
        steps: [
          'تهویه محیط را تنظیم کنید تا دمای مایع داخل گالن‌ها روی ۲۱ تا ۲۲ درجه سانتی‌گراد تثبیت شود.'
        ]
      });
    }
  } else if (isRose) {
    // Stage 2: Active Rosé Fermentation (Optimal: 16.0–19.0 °C)
    if (input.tempCapC > 18.5) {
      const isExtremeRose = input.tempCapC >= 19.5;
      const tempDiff = Math.round((input.tempCapC - 18.0) * 10) / 10;
      score -= isExtremeRose ? 35 : 18;
      actions.push({
        title: isExtremeRose
          ? 'خط قرمز گرمایش شراب رُزه! خطر پریدن استرهای فرار میوه‌ای'
          : 'افزایش دمای تخمیر رُزه و نیاز به خنک‌سازی',
        category: 'Temperature',
        severity: isExtremeRose ? 'danger' : 'warning',
        diagnosis: `دمای تخمیر رُزه (${input.tempCapC}°C) به میزان ${tempDiff}°C از سقف استاندارد ۱۸ درجه فراتر رفته است. در دمای بالای ۱۹.۵ درجه، استرهای گل‌فام و توت‌فرنگی رُزه با جریان گاز CO2 تبخیر می‌شوند.`,
        solutionSummary: 'قرار دادن گالن‌های رُزه در تشت آب سرد یا استفاده از بطری یخ جهت بازگرداندن دما به ۱۶–۱۸ درجه.',
        calculatedRecipe: [
          {
            item: 'بطری‌های یخ استریل ۱.۵ لیتری (در تشت آب اطراف گالن)',
            amount: `${Math.max(1, Math.ceil((tempDiff * vol) / 60))}`,
            unit: 'عدد',
            instruction: 'قرارگیری در تشت آب خنک دور گالن شیشه‌ای رُزه'
          }
        ],
        steps: [
          'گالن‌های ۲۰ لیتری رُزه را داخل تشت آب خنک (۱۴–۱۵ درجه) قرار دهید تا دمای مایع به ۱۶ تا ۱۸ درجه برگردد.',
          'هرگز یخ خشک را مستقیم کف گالن شیشه‌ای نیندازید (خطر ترکیدن شیشه در اثر شوک -78°C).'
        ]
      });
    } else if (input.tempCapC < 14.0) {
      const isSevereColdRose = input.tempCapC < 11.0;
      score -= isSevereColdRose ? 25 : 12;
      actions.push({
        title: 'سرد شدن بیش از حد شیره رُزه و خطر توقف فعالیت مخمر',
        category: 'Temperature',
        severity: isSevereColdRose ? 'danger' : 'caution',
        diagnosis: `دمای شیره رُزه (${input.tempCapC}°C) کمتر از آستانه فعالیت بهینه مخمر (۱۶–۱۹ درجه) است و می‌تواند تخمیر را متوقف کند.`,
        solutionSummary: 'انتقال گالن رُزه به محیط ۱۷–۱۸ درجه سانتی‌گراد.',
        steps: [
          'گالن رُزه را از محیط سرد خارج کرده و دمای مایع را به ۱۶ تا ۱۸ درجه سانتی‌گراد برسانید.'
        ]
      });
    }
  } else {
    // Stage 1: Active Red Maceration (!isRose && currentSG > 1.008)
    // Peak extraction 20.0–29.0 °C, Max Allowed Ceiling 30.0 °C, Crisis at >= 32.0 °C
    if (input.tempCapC >= 32.0) {
      const tempDiff = Math.round((input.tempCapC - 28.5) * 10) / 10;
      const iceBottlesNeeded = Math.max(4, Math.ceil((tempDiff * vol) / 100));
      score -= 45;
      actions.push({
        title: 'بحران ۱: شوک حرارتی مرگبار مخمر (T ≥ 32°C) و خطر جهش اسیدیته فرار (سرکه)!',
        category: 'Temperature',
        severity: 'danger',
        diagnosis: `دمای مرکز کلاهک (${input.tempCapC}°C) از مرز بحرانی ۳۲.۰ درجه عبور کرده است! در این دما در حضور الکل، غشای فسفولیپیدی مخمر RC-212 متلاشی شده، تخمیر متوقف (Stuck) می‌گردد و باکتری‌های سرکه به سرعت تکثیر می‌شوند.`,
        solutionSummary: 'مداخله اورژانسی زیر ۱۵ دقیقه: غوطه‌ورسازی ۴ بطری ۱.۵ لیتری یخ ضدعفونی‌شده زیر کلاهک + تزریق یخ خشک در کاسه استیل شناور.',
        calculatedRecipe: [
          {
            item: 'بطری‌های یخ استریل ۱.۵ لیتری',
            amount: `${iceBottlesNeeded}`,
            unit: 'عدد',
            instruction: 'مستغرق در ۱۵ سانتی‌متری زیر کلاهک در مرکز مخزن (هر بطری ~500-700 kJ گرما جذب می‌کند)'
          },
          {
            item: 'یخ خشک در صورت نیاز فوری',
            amount: `${calculateCoolingDryIceKg(vol, input.tempCapC, 26.5, input.currentSG || 1.080)}`,
            unit: 'کیلوگرم',
            instruction: 'با احتساب چگالی شیره (SG) و راندمان انتقال حرارت ۶۵٪ تصعید گاز CO2 (در کاسه استیل شناور)'
          }
        ],
        steps: [
          `بلافاصله ${iceBottlesNeeded} عدد بطری ۱.۵ لیتری یخ‌زده که برچسب آن‌ها جدا و با محلول سولفیت اسیدی (بطری شماره ۳) ضدعفونی شده‌اند را زیر کلاهک قرار دهید.`,
          'پس از ۲۰ دقیقه، Pigeage عمیق انجام دهید تا لایه داغ مرکز کلاهک با مایع خنک زیرین همگن شود.',
          'در صورت استفاده از یخ خشک، قطعات را داخل یک کاسه استیل ضدزنگ شناور قرار دهید و تهویه کف‌کش کارگاه را با حداکثر دور روشن کنید.'
        ]
      });
    } else if (input.tempCapC > 30.0) {
      const tempDiff = Math.round((input.tempCapC - 28.5) * 10) / 10;
      const iceBottlesNeeded = Math.max(3, Math.ceil((tempDiff * vol) / 100));
      score -= 22;
      actions.push({
        title: 'عبور دمای کلاهک از سقف مجاز ۳۰.۰ درجه و نیاز به خنک‌سازی فوری با بطری یخ',
        category: 'Temperature',
        severity: 'danger',
        diagnosis: `دمای مرکز کلاهک (${input.tempCapC}°C) از سقف مجاز پروتکل (۳۰.۰°C) فراتر رفته است. تداوم این دما باعث استرس حرارتی مخمر، تبخیر آرومای میوه‌ای و استخراج تانن‌های خشن هسته می‌شود.`,
        solutionSummary: 'غوطه‌ورسازی ۳ تا ۴ بطری ۱.۵ لیتری یخ ضدعفونی‌شده در زیر کلاهک (کاهش ~۱ درجه به ازای هر بطری در مخزن ۱۵۷ لیتری) و Pigeage پس از ۲۰ دقیقه.',
        calculatedRecipe: [
          {
            item: 'بطری‌های یخ استریل ۱.۵ لیتری',
            amount: `${iceBottlesNeeded}`,
            unit: 'عدد',
            instruction: 'مستغرق زیر کلاهک در مرکز مخزن (هر بطری ۱.۵ لیتری ۵۰۰ تا ۷۰۰ کیلوژول گرما جذب می‌کند)'
          },
          {
            item: 'یخ خشک در صورت نیاز فوری',
            amount: `${calculateCoolingDryIceKg(vol, input.tempCapC, 26.5, input.currentSG || 1.080)}`,
            unit: 'کیلوگرم',
            instruction: 'با احتساب چگالی شیره (SG) و راندمان انتقال حرارت ۶۵٪ تصعید گاز CO2'
          }
        ],
        steps: [
          `بلافاصله ${iceBottlesNeeded} عدد بطری ۱.۵ لیتری یخ ضدعفونی‌شده با محلول استوک شماره ۳ را در عمق ۱۵ سانتی‌متری زیر کلاهک قرار دهید.`,
          '۲۰ دقیقه صبر کرده و سپس کلاهک را غوطه‌ور (Pigeage) کنید تا دما به بازه ایمن ۲۶ تا ۲۸ درجه برگردد.',
          'دمای محیط کارگاه را روی ۱۸–۲۰ درجه تنظیم نمایید.'
        ]
      });
    } else if (input.tempCapC > 29.0) {
      score -= 10;
      actions.push({
        title: 'نزدیک شدن دمای کلاهک به سقف ۳۰.۰ درجه (بازه هشدار ۲۹ تا ۳۰ درجه)',
        category: 'Temperature',
        severity: 'warning',
        diagnosis: `دمای مرکز کلاهک (${input.tempCapC}°C) در اوج استخراج پلی‌فنولی قرار دارد اما به سقف مجاز ۳۰.۰ درجه نزدیک شده است.`,
        solutionSummary: 'آماده‌سازی بطری‌های یخ ۱.۵ لیتری ضدعفونی‌شده و انجام غوطه‌ورسازی کلاهک (Pigeage) جهت پخش حرارت.',
        calculatedRecipe: [
          {
            item: 'بطری‌های یخ استریل ۱.۵ لیتری',
            amount: '2',
            unit: 'عدد',
            instruction: 'در صورت عبور دما از ۲۹.۵ درجه زیر کلاهک قرار گیرد'
          }
        ],
        steps: [
          '۲ عدد بطری یخ ۱.۵ لیتری را با محلول سولفیت اسیدی (بطری شماره ۳) ضدعفونی و آماده نگه دارید.',
          'یک نوبت Pigeage انجام دهید تا گرمای متمرکز در کلاهک پوست با فاز مایع خنک‌تر تبادل یابد.'
        ]
      });
    } else if (input.tempCapC < 18.0) {
      const isColdDanger = input.tempCapC < 14.0;
      score -= isColdDanger ? 25 : 10;
      actions.push({
        title: isColdDanger
          ? 'سرمایش شدید مخزن قرمز و خطر توقف بیولوژیکی مخمر'
          : 'سرد شدن بیش از حد و خطر کُند شدن فعالیت مخمر',
        category: 'Temperature',
        severity: isColdDanger ? 'danger' : 'caution',
        diagnosis: `دمای کلاهک (${input.tempCapC}°C) کمتر از محدوده فعال‌سازی و استخراج رنگ مخمر RC-212 (۲۰–۲۸.۵ درجه) است.`,
        solutionSummary: 'انتقال ظروف به محیط گرم‌تر (۲۰–۲۲ درجه) یا استفاده از کمربند حرارتی کنترل‌شده.',
        steps: [
          'دمای اتاق تخمیر را به ۲۰–۲۲ درجه سانتی‌گراد برسانید.',
          'همزدن ملایم لایه‌های زیرین جهت بیداری مجدد مخمرهای ته‌نشین‌شده.'
        ]
      });
    }
  }

  // ----------------------------------------------------
  // 3. SG & BRIX & FERMENTATION SPEED
  // ----------------------------------------------------
  if (input.issues?.isStuckFermentation) {
    score -= 40;
    actions.push({
      title: 'بحرانی: توقف تخمیر (Stuck Fermentation - بحران ۴)',
      category: 'SG_Ferment',
      severity: 'danger',
      diagnosis: `وزن مخصوص در عدد ${input.currentSG.toFixed(3)} به مدت بیش از ۳۶ ساعت ثابت مانده و قند باقی‌مانده بالاست. مخمرها دچار شوک حرارتی/الکل یا کمبود استرول شده‌اند.`,
      solutionSummary: 'اجرای پروتکل ۲ مرحله‌ای راه‌اندازی مجدد (احیای حرارتی ۲۲–۲۳ درجه + استارتر پیش‌رونده مخمر مقاوم EC-1118 با Go-Ferm و Fermaid O).',
      calculatedRecipe: [
        {
          item: 'مخمر مقاوم Lalvin EC-1118',
          amount: `${Math.round(0.25 * vol * 10) / 10}`,
          unit: 'گرم',
          instruction: 'آب‌دهی در آب ۴۰ درجه با محافظ سلولی Go-Ferm و سازگارکنندگی پله‌ای با الکل'
        },
        {
          item: 'مغذی Go-Ferm Protect',
          amount: `${Math.round(0.30 * vol * 10) / 10}`,
          unit: 'گرم',
          instruction: 'حل‌شده در آب ۴۳ درجه پیش از افزودن مخمر EC-1118'
        },
        {
          item: 'مکمل ارگانیک Fermaid O (سم‌زدایی مخزن)',
          amount: `${Math.round(0.18 * vol * 10) / 10}`,
          unit: 'گرم',
          instruction: 'افزودن مستقیم به شراب متوقف‌شده جهت جذب اسیدهای چرب سمی'
        }
      ],
      steps: [
        'گام اول (احیای حرارتی): دمای شراب را به ۲۲–۲۳ درجه برسانید و دُرد نرم کف ظرف را با میله استیل ضدعفونی‌شده به آرامی معلق کنید.',
        'گام دوم (اگر ظرف ۴۸ ساعت راه نیفتاد): دوز Fermaid O را به مخزن اضافه کنید تا پوسته مخمر اسیدهای چرب بازدارنده را جذب کند.',
        'در یک ظرف ۵ لیتری، Go-Ferm را در آب ۴۳ درجه حل کرده، در ۴۰ درجه مخمر EC-1118 را اضافه کنید و پس از ۲۰ دقیقه، هر ۲ ساعت حجم استارتر را با شراب مخزن دو برابر کنید (1.5L → 3L → 6L) و سپس به کل مخزن تزریق نمایید.'
      ]
    });
  } else if (input.currentBrix > 24.5 && (input.dayNumber === 0 || input.dayNumber === 1 || input.currentSG >= 1.095)) {
    score -= 15;
    actions.push({
      title: 'بریکس اولیه بالا و خطر استرس اسمزی مخمر',
      category: 'SG_Ferment',
      severity: 'warning',
      diagnosis: `بریکس اولیه (${input.currentBrix}° Bx) بالاتر از حد هدف (۲۲.۰° Bx) است. این امر موجب فشار اسمزی بر مخمر و الکل نهایی بالای ۱۴.۵٪ می‌شود.`,
      solutionSummary: 'اصلاح با افزودن آب مقطر اسیدی‌شده جهت کاهش بریکس به ۲۲.۰° Bx و محاسبه تریگرهای پویا بر اساس SG0 واقعی.',
      steps: [
        'افزودن مقدار مشخصی آب مقطر خنک که با اسید تارتاریک به pH=3.52 تنظیم شده است.',
        'استفاده از دوز کامل مکمل YAN با مقیاس‌پذیری پویا (SOP-TEST-05) جهت تقویت تحمل الکلی مخمر.',
        'پایش دقیق دمای تخمیر زیر ۳۰ درجه و محاسبه نقاط تریگر SNA با فرمول پویا SG_trigger = SG0 - f*(SG0 - 1.000).'
      ]
    });
  } else if (input.currentBrix > 0 && input.currentBrix < 20.0 && input.dayNumber === 0) {
    score -= 10;
    const brixDeficit = Math.round((22.0 - input.currentBrix) * 10) / 10;
    const sugarNeededGrams = Math.round(brixDeficit * 10.8 * effectiveLiquidVol);

    actions.push({
      title: 'بریکس اولیه پایین و پتانسیل الکل کم',
      category: 'SG_Ferment',
      severity: 'caution',
      diagnosis: `بریکس اولیه (${input.currentBrix}° Bx) کمتر از استانداردهای انگور رشه سردشت است. الکل نهایی کمتر از ۱۱.۵٪ خواهد شد و بدنه‌ی شراب ضعیف می‌گردد.`,
      solutionSummary:
        'چاپتالیزاسیون (غنی‌سازی با شکر خالص خوراکی به میزان ۱۰.۸ گرم بر لیتر به ازای هر ۱.۰ درجه بریکس کسری — توجه: ۱۷ گرم بر لیتر معادل ۱٪ الکل بالقوه یا ~۱.۶ درجه بریکس است) جهت رسیدن به ۲۲.۰° Bx.',
      calculatedRecipe: [
        {
          item: 'شکر خالص تصفیه‌شده خوراکی',
          amount: `${sugarNeededGrams}`,
          unit: 'گرم',
          instruction:
            'چاپتالیزاسیون (غنی‌سازی با شکر خالص خوراکی به میزان ۱۰.۸ گرم بر لیتر به ازای هر ۱.۰ درجه بریکس کسری — توجه: ۱۷ گرم بر لیتر معادل ۱٪ الکل بالقوه یا ~۱.۶ درجه بریکس است) جهت رسیدن به ۲۲.۰° Bx'
        }
      ],
      steps: [
        `چاپتالیزاسیون (غنی‌سازی با شکر خالص خوراکی به میزان ۱۰.۸ گرم بر لیتر به ازای هر ۱.۰ درجه بریکس کسری — توجه: ۱۷ گرم بر لیتر معادل ۱٪ الکل بالقوه یا ~۱.۶ درجه بریکس است) جهت رسیدن به ۲۲.۰° Bx: مقدار ${sugarNeededGrams} گرم شکر را در مقداری شربت گرم حل کنید.`,
        'محلول را به مخزن افزوده و کاملاً یکنواخت هم بزنید.',
        'بریکس و SG0 جدید را مجدداً اندازه‌گیری کرده و عدد پایه جدید ثبت کنید.'
      ]
    });
  }

  // ----------------------------------------------------
  // 4. OFF-ODORS, CAP MANAGEMENT & FINING ISSUES
  // ----------------------------------------------------
  if (input.issues?.hasH2S) {
    score -= 25;
    actions.push({
      title: 'تشخیص بوی گوگرد / تخم‌مرغ گندیده (H2S - بحران ۲)',
      category: 'OffOdor_Spoilage',
      severity: 'danger',
      diagnosis: 'مخمر دچار گرسنگی نیتروژنی (YAN) شده یا گوگرد عنصری سم‌پاشی باغ را به گاز سولفید هیدروژن (H2S) احیا کرده است.',
      solutionSummary: 'هوادهی پاششی فوری (۲۰ بار با پارچ استیل) + تزریق نیتروژن ارگانیک (Fermaid O) یا اجرای تست ۵ لیوانی سولفات مس و اسکوربیک در روز دهم.',
      calculatedRecipe: [
        {
          item: 'مکمل تغذیه‌ای ارگانیک Fermaid O',
          amount: `${Math.round(0.15 * effectiveLiquidVol * 10) / 10}`,
          unit: 'گرم',
          instruction: 'حل‌شده در آب ولرم (در صورت عبور از SG 1.062 مصرف DAP مطلقاً ممنوع است!)'
        },
        {
          item: 'محلول استوک ۰.۱٪ سولفات مس (بطری شماره ۲)',
          amount: `${Math.round(0.25 * effectiveLiquidVol * 10) / 10}`,
          unit: 'میلی‌لیتر',
          instruction:
            'معادل دوز 0.25 mg/L سولفات مس ۵ آبه (CuSO4·5H2O) که برابر با 0.064 mg/L یون مس عنصری (Cu²⁺) است (بسیار کمتر از سقف قانونی 1.0 mg/L OIV) پس از تایید در تست ۵ لیوانی (SOP-TEST-08)'
        }
      ],
      steps: [
        'فوراً با پارچ استیل تمیز، ۲۰ بار مایع را از شیر پایین بردارید و از ارتفاع ۳۰ سانتی‌متری روی کلاهک بپاشید (Splash Aeration).',
        'اگر قبل از SG = 1.057 هستید نوبت SNA را تزریق کنید؛ اگر از 1.057 عبور کرده‌اید صرفاً از Fermaid O ارگانیک استفاده نمایید.',
        'اگر بوی گوگرد تا پایان تخمیر باقی ماند، در روز دهم تست ۵ لیوانی مس و اسید اسکوربیک (SOP-TEST-08) را انجام دهید تا سولفید مس (CuS) رسوب کند و با Bactiless کیلیت شود.'
      ]
    });
  }

  if (input.issues?.hasVolatileAcidity) {
    score -= 30;
    const vaTargetSO2 = getTargetFreeSO2ByPH(input.ph, isRose);
    actions.push({
      title: 'خط قرمز: بوی اسید استیک / سرکه و استات اتیل (Volatile Acidity)',
      category: 'OffOdor_Spoilage',
      severity: 'danger',
      diagnosis: 'باکتری‌های هوازی اسید استیک (Acetobacter) به دلیل تماس اکسیژن با کلاهک شناور خشک یا فضای خالی گالن فعال شده‌اند.',
      solutionSummary: 'غوطه‌ورسازی کامل کلاهک، حذف ۱۰۰٪ فضای خالی، خنک‌سازی زیر ۱۴ درجه و تزریق KMS + کیتوزان (Bactiless).',
      calculatedRecipe: [
        {
          item: 'متابی‌سولفیت پتاسیم (KMS)',
          amount: `${calculateKMS(vol, input.freeSO2, Math.max(42, vaTargetSO2.target), isUnpressedRedMust)}`,
          unit: 'گرم',
          instruction: 'تزریق جهت سرکوب فوری باکتری‌های استیک بر اساس فاز مایع مؤثر'
        },
        {
          item: 'کیتوزان قارچی (Bactiless)',
          amount: `${Math.round(0.30 * effectiveLiquidVol * 10) / 10}`,
          unit: 'گرم',
          instruction: 'معادل 0.30 g/L در فاز پس از تخمیر جهت لیز کردن دیواره سلولی باکتری‌ها'
        }
      ],
      steps: [
        'کلاهک شناور را فوراً مستغرق کرده و فضای بالای مخزن را با گاز CO2 یا آرگون پوشش دهید.',
        'در شراب پس از تخمیر، گالن‌ها را کاملاً لب‌به‌لب (Top-up) کرده و دما را به ۱۲–۱۴ درجه کاهش دهید.',
        'با تزریق KMS و ۰.۳۰ گرم بر لیتر Bactiless، باکتری‌های استیک و مالولاکتیک را به طور کامل حذف نمایید.'
      ]
    });
  }

  if (input.issues?.hasDryCap) {
    score -= 22;
    actions.push({
      title: 'خشک شدن سطح کلاهک پوست (خطر رشد استوباکتر و مگس سرکه)',
      category: 'OffOdor_Spoilage',
      severity: 'warning',
      diagnosis: 'باقی ماندن کلاهک پوست در مجاورت هوا برای بیش از ۸ ساعت باعث خشک شدن سطح آن، رشد باکتری‌های سرکه (Acetobacter) و اکسیداسیون رنگدانه‌ها می‌شود.',
      solutionSummary: 'غوطه‌ورسازی منظم ۴ نوبته (Pigeage هر ۶ ساعت در اوج تخمیر)، خیس کردن کلاهک و پاشش گاز CO2 روی سطح.',
      steps: [
        'در صورت مشاهده لایه سفید یا بوی سرکه روی ۱ سانتی‌متر بالایی کلاهک، ابتدا آن لایه نازک را با کفگیر استریل برداشته و دور بریزید.',
        'کلاهک را به آرامی به زیر شیره فرو ببرید (Pigeage) تا کاملاً با شراب تازه خیس و خنک شود.',
        'دیواره داخلی مخزن در بالای سطح کلاهک را با دستمال آغشته به محلول سولفیت اسیدی (بطری شماره ۳) پاک کنید و درب مخزن را با قفل هوا ببندید.'
      ]
    });
  }

  if (input.issues?.hasBitterSeeds) {
    score -= 18;
    const finingGelatinOrAlbuminG = Math.round(0.08 * effectiveLiquidVol * 100) / 100;
    actions.push({
      title: 'آزاد شدن تانن‌های گس و تلخ هسته انگور (عصاره کاتچین هسته)',
      category: 'Tannin_Fining',
      severity: 'warning',
      diagnosis: 'با افزایش الکل بالای ۶٪ (SG ≤ 1.060) یا له شدن مکانیکی هسته‌ها، لایه مومی هسته انگور حل شده و تانن‌های مونومری تلخ و فلزی وارد شراب شده‌اند.',
      solutionSummary: 'جمع‌آوری فوری هسته‌های کف مخزن شیب‌دار (در SG 1.060)، توقف کوبش خشن کلاهک، پرسینگ به‌موقع در SG 1.008 و گرد کردن طعم در روز ۸۵.',
      calculatedRecipe: [
        {
          item: 'سفیده تخم‌مرغ تازه یا آلبومین انولوژیک (در صورت گسی شدید پس از تخمیر)',
          amount: `${finingGelatinOrAlbuminG}`,
          unit: 'گرم',
          instruction: `معادل 0.08 g/L در ${effectiveLiquidVol}L شراب قرمز (صرفاً پس از تست لیوانی)`
        },
        {
          item: 'گلیسیرین خوراکی خالص (در ایستگاه فینیشینگ روز ۸۵)',
          amount: `${Math.round(2.5 * effectiveLiquidVol)}`,
          unit: 'گرم',
          instruction: 'معادل ۲.۵ گرم بر لیتر پس از تایید در تست ۳ لیوانی گلیسیرین ۱۰٪ (SOP-TEST-08)'
        }
      ],
      steps: [
        'در حین تخمیر قرمز (به‌ویژه در SG = 1.060)، با کفگیر مشبک استیل هسته‌های رهاشده در کف مخزن را جمع‌آوری و خارج کنید.',
        'غوطه‌ورسازی کلاهک را صرفاً با فشار عمودی ملایم دست یا پدل انجام دهید و از ساییدن پوست و هسته به دیواره مخزن خودداری کنید.',
        'اگر در SG = 1.008 تا 1.010 گسی تانن به سقف مطلوب رسید، بلافاصله پرسینگ و جداسازی پوست را انجام دهید.'
      ]
    });
  }

  if (input.issues?.hasCloudiness) {
    score -= 14;
    const enzymeDoseG = Math.round(0.05 * effectiveLiquidVol * 100) / 100;
    const bentoniteDoseG = Math.round(0.20 * effectiveLiquidVol * 100) / 100;
    actions.push({
      title: 'کدورت پایدار شراب (پکتین باقی‌مانده، پروتئین ناپایدار یا دُرد معلق)',
      category: 'Tannin_Fining',
      severity: 'caution',
      diagnosis: 'کدورت شراب ناشی از پکتین شکسته نشده انگور رشه، پروتئین‌های حساس به دما (به‌ویژه در رُزه) یا گاز CO2 محلول است که مانع ته‌نشینی ذرات دُرد نرم می‌شود.',
      solutionSummary: 'اجرای تست الکل ۹۶٪ پکتین (۵mL شراب + ۱۰mL الکل)، گاززدایی و شفاف‌سازی با آنزیم پکتولیتیک یا ژل بنتونیت + سرمایش.',
      calculatedRecipe: [
        {
          item: 'پودر آنزیم پکتولیتیک (در صورت مثبت بودن تست الکل پکتین)',
          amount: `${enzymeDoseG}`,
          unit: 'گرم',
          instruction: `معادل 0.05 g/L حل‌شده در آب سرد بدون کف برای ${effectiveLiquidVol}L`
        },
        {
          item: 'بنتونیت انولوژیک هیدراته‌شده (در صورت کدورت پروتئینی/معلق)',
          amount: `${bentoniteDoseG}`,
          unit: 'گرم',
          instruction: `معادل 0.20 g/L پاشیده‌شده در آب ۵۰ درجه به مدت ۵ ساعت برای ${effectiveLiquidVol}L`
        }
      ],
      steps: [
        'ابتدا ۵ میلی‌لیتر از شراب صاف را با ۱۰ میلی‌لیتر الکل طبی ۹۶٪ مخلوط کنید؛ اگر رشته‌های ژله‌ای تشکیل شد، پکتین عامل کدورت است و باید آنزیم پکتیک بزنید.',
        'اگر تست پکتین منفی بود، با تست لیوانی بنتونیت (SOP-TEST-08) دوز دقیق زلال‌سازی را تعیین کرده و در دمای ۰ تا ۴ درجه ته‌نشین نمایید.'
      ]
    });
  }

  // ----------------------------------------------------
  // 5. STAGE-AWARE FREE SO2, DYNAMIC pH TABLE & OVERDOSE NEUTRALIZATION
  // ----------------------------------------------------
  const pHTargetSO2 = getContinuousTargetFreeSO2ByPH(input.ph, isRose);
  const isPostFermentationStage =
    input.currentSG <= 0.995 ||
    (input.dayNumber !== undefined && input.dayNumber > 7 && input.currentSG <= 0.997);

  if (!isPostFermentationStage) {
    // Active Fermentation Stage (SG > 1.000): Free SO2 > 40 mg/L is toxic to yeast or indicates Ripper titration interference!
    if (input.freeSO2 > 40) {
      const isDangerActiveSO2 = input.freeSO2 > 55;
      score -= isDangerActiveSO2 ? 35 : 18;
      actions.push({
        title: 'مسمومیت سولفیتی مخمر در حین تخمیر فعال و خطر تولید H2S',
        category: 'SO2_Oxidation',
        severity: isDangerActiveSO2 ? 'danger' : 'warning',
        diagnosis: `سطح سولفیت آزاد ثبت‌شده در حین تخمیر فعال (${input.freeSO2} mg/L در SG = ${input.currentSG.toFixed(3)}) بیش از حد بالاست! سولفیت آزاد واقعی بالای ۴۰ mg/L آنزیم‌های گلیکولیز مخمر را مهار کرده و خطر تولید H2S را افزایش می‌دهد؛ با این حال توجه علمی داشته باشید که در تخمیر فعال قرمز (SG > 1.000)، آنتوسیانین‌ها، آلدهیدها و ترکیبات احیاکننده با ید در تیتراسیون ریپر (Ripper) تداخل داشته و باعث خوانش کاذب و متورم Free SO2 می‌شوند.`,
        solutionSummary:
          'توقف مطلق هرگونه افزودن KMS جدید، بررسی احتمال خطای کاذب تیتراسیون ریپر (Ripper Interference) در حضور آنتوسیانین‌ها و قندهای احیاکننده (توجه: هوادهی پاششی قادر به پراندن SO2 محلول/متصل از شیره نیست)، حفظ دمای ۲۳–۲۵ °C و تقویت مخمر با نیتروژن ارگانیک Fermaid O.',
        steps: [
          'مطلقاً هیچ متابی‌سولفیت پتاسیم (KMS) جدیدی تا پایان کامل تخمیر الکلی (SG ≤ 0.993) اضافه نکنید!',
          'توجه آزمایشگاهی: در حین تخمیر فعال قرمز، تیتراسیون یدومتری ریپر به دلیل واکنش ید با فنول‌ها، آنتوسیانین‌ها و اسیدهای احیاکننده عدد کاذب بالا نشان می‌دهد و هوادهی پاششی نیز قادر به خارج کردن SO2 از شیره نیست.',
          'دمای مخزن را روی ۲۳ تا ۲۵ درجه سانتی‌گراد نگه دارید و در صورت کندی تخمیر، مخمر را با مکمل ارگانیک Fermaid O تقویت نمایید.'
        ]
      });
    }
  } else {
    // Post-Fermentation Stage (currentSG <= 1.000)
    const overdoseWarningThreshold = Math.max(60, Math.round(pHTargetSO2.max + 5));
    const overdoseDangerThreshold = Math.max(75, Math.round(pHTargetSO2.max + 15));

    if (input.freeSO2 < pHTargetSO2.min) {
      const isDangerLowSO2 = input.freeSO2 < 15;
      score -= isDangerLowSO2 ? 28 : 16;
      const kmsNeeded = calculateKMS(vol, input.freeSO2, pHTargetSO2.target, isUnpressedRedMust);
      const currentMolSO2 = calculateMolecularSO2(input.freeSO2, input.ph);

      actions.push({
        title: isDangerLowSO2
          ? 'خطر بحرانی اکسیداسیون و فساد میکروبی (افت شدید سولفیت آزاد)'
          : 'افت سولفیت آزاد (SO2) نسبت به جدول pH و خطر اکسیداسیون',
        category: 'SO2_Oxidation',
        severity: isDangerLowSO2 ? 'danger' : 'warning',
        diagnosis: `در اسیدیته فعلی شراب (pH = ${input.ph.toFixed(2)})، برای دستیابی به سطح ضدعفونی‌کننده ۰.۶ تا ۰.۸ mg/L سولفیت مولکولی، سطح سولفیت آزاد باید در بازه ${pHTargetSO2.min} تا ${pHTargetSO2.max} mg/L (هدف: ${pHTargetSO2.target} mg/L) باشد؛ اما سولفیت آزاد فعلی فقط ${input.freeSO2} mg/L (سولفیت مولکولی: ${currentMolSO2} mg/L) است.`,
        solutionSummary: `تزریق دقیق ${kmsNeeded} گرم متابی‌سولفیت پتاسیم (KMS) جهت رسیدن به ${pHTargetSO2.target} mg/L (با رعایت سقف قانونی سولفیت کل Total SO2 ≤ 150 mg/L و قفل ایمنی اسید اسکوربیک).`,
        calculatedRecipe: [
          {
            item: 'متابی‌سولفیت پتاسیم (KMS)',
            amount: `${kmsNeeded}`,
            unit: 'گرم',
            instruction: `حل‌شده در ۱۰۰mL آب مقطر سرد برای رساندن Free SO2 از ${input.freeSO2} به ${pHTargetSO2.target} mg/L در ${effectiveLiquidVol}L`
          }
        ],
        steps: [
          `مقدار ${kmsNeeded} گرم پودر KMS را در آب مقطر سرد حل کرده و به آرامی از کف ظرف تزریق و همگن کنید.`,
          'قانون قفل ایمنی ویتامین C: هرگز اسید اسکوربیک (ویتامین C) را به شرابی که سولفیت آزاد آن زیر ۳۰–۳۵ mg/L است اضافه نکنید؛ زیرا اسید اسکوربیک در غیاب SO2 تولید آب‌اکسیژنه (H2O2) کرده و شراب را به سرعت قهوه‌ای می‌کند!',
          'کنترل بودجه سولفیت کل (Total SO2): مجموع سولفیت تزریق‌شده در کل چرخه (کراش + پس از تخمیر + بطری‌گذاری + تولید مخمر) نباید از سقف قانونی 150 mg/L تجاوز کند.'
        ]
      });
    } else if (input.freeSO2 > overdoseWarningThreshold) {
      const isDangerHighSO2 = input.freeSO2 > overdoseDangerThreshold;
      score -= isDangerHighSO2 ? 38 : 20;
      const stagedPlan = calculateStagedH2O2Plan(effectiveLiquidVol, input.freeSO2, pHTargetSO2.target);
      const h2o2MlNeeded = stagedPlan.totalTheoretical3PercentMl;

      actions.push({
        title: 'اوردوز سولفیت آزاد (رنگ‌پریدگی آنتوسیانین و بوی کبریت سوخته — پروتکل پلکانی H2O2)',
        category: 'SO2_Oxidation',
        severity: isDangerHighSO2 ? 'danger' : 'warning',
        diagnosis: `سولفیت آزاد فعلی (${input.freeSO2} mg/L) بسیار بالاتر از محدوده هدف جدول pH (${pHTargetSO2.min}–${pHTargetSO2.max} mg/L) است! یون بی‌سولفیت مازاد به کربن C4 آنتوسیانین‌ها حمله کرده و باعث بی‌رنگ شدن (Bleaching) موقت شراب، بوی تند گوگرد/کبریت سوخته و سوزش گلو می‌شود (توجه: بالا بودن Free SO2 به تنهایی اثبات‌کننده نقض سقف قانونی Total SO2 نیست و ارزیابی سقف قانونی نیازمند سنجش Total SO2 یا دفتر حسابداری تجمعی است).`,
        solutionSummary: `کاهش پلکانی و ایمن سولفیت آزاد از ${input.freeSO2} به ${stagedPlan.effectiveTargetSO2} mg/L (کف ایمن ≥ 10 mg/L): حداکثر مجاز مرحله اول ${stagedPlan.maxCurrentStep3PercentMl} میلی‌لیتر محلول ۳٪ H2O2 (برای کاهش ≤ 25 mg/L، دوز محافظه‌کارانه ۵۰٪ = ${stagedPlan.recommendedSafeTrialStep1Ml} mL؛ کل تئوری ${h2o2MlNeeded} mL در ${stagedPlan.stagesRequired} مرحله) پس از رقیق‌سازی زیر ۱٪ و تست ۳ لیوانی.`,
        calculatedRecipe: [
          {
            item: 'محلول آب‌اکسیژنه خوراکی ۳٪ (3% Food-Grade H2O2) — سقف ایمن مرحله اول (≤ 25 mg/L)',
            amount: `${stagedPlan.maxCurrentStep3PercentMl}`,
            unit: 'میلی‌لیتر',
            instruction: `حداکثر مجاز مرحله اول برای کاهش ${stagedPlan.currentStepReductionMgL} mg/L (دوز شروع محافظه‌کارانه ۵۰٪ = ${stagedPlan.recommendedSafeTrialStep1Ml} mL؛ کل تئوری ${h2o2MlNeeded} mL در ${stagedPlan.stagesRequired} مرحله با کف ایمن ≥ 10 mg/L)`
          }
        ],
        steps: [
          'استوکیومتری دقیق واکنش: هر ۱ mg/L سولفیت آزاد برای اکسید شدن به سولفات نیازمند ۰.۵۳۰۹ mg آب‌اکسیژنه خالص (معادل ۰.۰۱۷۷ میلی‌لیتر محلول ۳٪ خوراکی در هر لیتر شراب) است؛ هرگز Free SO2 را زیر کف ایمن ۱۰ mg/L کاهش ندهید.',
          `قانون تزریق پلکانی AWRI (حداکثر ۲۵ mg/L کاهش در هر مرحله): در مرحله اول حداکثر ${stagedPlan.maxCurrentStep3PercentMl} میلی‌لیتر (توصیه محافظه‌کارانه ۵۰٪ = ${stagedPlan.recommendedSafeTrialStep1Ml} میلی‌لیتر) را ابتدا در تست ۳ لیوانی ۱۰۰ میلی‌لیتری بررسی کنید.`,
          `رقیق‌سازی زیر ۱٪ پیش از تزریق: دوز مرحله اول را حداقل ۳.۵ برابر با آب مقطر رقیق کنید (حجم محلول رقیق‌شده < 1%: حدود ${stagedPlan.dilutedUnder1PercentTotalVolumeMl} میلی‌لیتر) و به آرامی حین همزدن اضافه کرده و پس از ۶ ساعت Free SO2 را مجدداً تیتر نمایید.`
        ]
      });
    }
  }

  // ----------------------------------------------------
  // OVERALL HEALTH EVALUATION & PROGRESSIVE DISCLOSURE
  // ----------------------------------------------------
  const enrichedActions: CorrectiveAction[] = actions.map((action) => {
    const alertTier: 'critical' | 'attention' | 'info' =
      action.alertTier === 'info' || action.severity === 'normal'
        ? 'info'
        : action.severity === 'danger'
        ? 'critical'
        : 'attention';
    const canSnooze = alertTier !== 'critical';

    let confidenceBadge = action.confidenceBadge;
    let confidenceLabelFa = action.confidenceLabelFa;
    if (!confidenceBadge) {
      if (
        action.solutionSummary.includes('تخمین تجربی') ||
        action.category === 'Tannin_Fining'
      ) {
        confidenceBadge = 'rule_of_thumb';
        confidenceLabelFa = 'قاعدهٔ سرانگشتی تجربی';
      } else {
        confidenceBadge = 'stoichiometric';
        confidenceLabelFa = 'محاسبهٔ استوکیومتری قطعی';
      }
    }

    const sanitizedRecipes =
      hasInvalidVolume && action.calculatedRecipe
        ? action.calculatedRecipe.map((r) => ({
            ...r,
            amount: '0',
            instruction: 'محاسبه متوقف شد — ابتدا حجم معتبر مخزن را وارد کنید'
          }))
        : action.calculatedRecipe;

    const firstRecipe = sanitizedRecipes?.[0];
    const layer1ActionFa = firstRecipe
      ? `${firstRecipe.amount} ${firstRecipe.unit} ${firstRecipe.item} (${action.solutionSummary})`
      : action.solutionSummary;

    return {
      ...action,
      calculatedRecipe: sanitizedRecipes,
      alertTier,
      canSnooze,
      confidenceBadge,
      confidenceLabelFa,
      progressiveLayers: {
        layer1ActionFa,
        layer2WhyFa: action.diagnosis,
        layer3ScienceFa: action.steps.join(' | ')
      }
    };
  });

  const infoActions = enrichedActions.filter((a) => a.alertTier === 'info');
  const severityRank: Record<CorrectiveAction['severity'], number> = {
    danger: 0,
    warning: 1,
    caution: 2,
    normal: 3
  };
  const sortedNonInfo = enrichedActions
    .filter((a) => a.alertTier !== 'info')
    .sort((a, b) => severityRank[a.severity] - severityRank[b.severity]);

  const criticalNonInfoCount = sortedNonInfo.filter((a) => a.severity === 'danger').length;
  const visibleLimit = Math.max(3, criticalNonInfoCount);
  const visibleActions = sortedNonInfo.slice(0, visibleLimit);
  const hiddenActionsCount = Math.max(0, sortedNonInfo.length - visibleLimit);

  const finalScore = Math.max(0, Math.min(100, score));
  const criticalWarningsCount = enrichedActions.filter((a) => a.severity === 'danger').length;

  let overallStatusText = 'تمام پارامترها و شرایط کارگاهی در محدوده ایده‌آل و ایمن قرار دارند.';
  let overallStatusColor: 'emerald' | 'amber' | 'rose' | 'blue' = 'emerald';

  if (criticalWarningsCount > 0) {
    overallStatusText = `توجه: ${criticalWarningsCount} خطای بحرانی کشف شد! نیازمند اقدام و مداخله فوری کارگاهی.`;
    overallStatusColor = 'rose';
  } else if (sortedNonInfo.length > 0) {
    overallStatusText = `شرایط نسبتاً مطلوب است؛ ${sortedNonInfo.length} دستورالعمل اصلاحی جهت بهینه‌سازی پیشنهاد گردید.`;
    overallStatusColor = 'amber';
  }

  return {
    overallHealthScore: finalScore,
    overallStatusText,
    overallStatusColor,
    criticalWarningsCount,
    actions: enrichedActions,
    visibleActions,
    hiddenActionsCount,
    infoActions,
    hasInvalidVolume
  };
}
