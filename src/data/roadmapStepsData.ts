export interface ProcessStep {
  id: number;
  phaseId: number;
  phaseName: string;
  title: string;
  timeOrTrigger: string;
  targetTemp: string;
  keyAction: string;
  criticalWarning?: string;
  nextStepPreview: string;
  category: 'prep' | 'crush' | 'fermentation' | 'pressing' | 'racking' | 'aging' | 'bottling';
  requiresDataEntry?: boolean;
  defaultDataEntryType?: 'daily' | 'initial' | 'chemical';
  defaultChemicalName?: string;
}

export const ZERO_TO_HUNDRED_STEPS: ProcessStep[] = [
  // PHASE 1: PREPARATION & DAY ZERO (Steps 1 to 14)
  {
    id: 1,
    phaseId: 1,
    phaseName: 'فاز ۱: آماده‌سازی و پذیرش (روز ۰)',
    title: 'کالیبراسیون حجمی مخازن ۲۰۰L و گالن‌های ۲۰L با آب',
    timeOrTrigger: 'پیش از کراش - روز ۰',
    targetTemp: 'دمای محیط',
    keyAction: 'علامت‌گذاری خطوط حجمی هر ۵ لیتر روی مخازن A و B و خط ۲۰ لیتر روی گلوگاه گالن‌ها با ماژیک صنعتی ضدآب.',
    criticalWarning: 'بدون کالیبراسیون اولیه، محاسبات دوزهای بعدی بر حسب گرم بر لیتر غیرممکن خواهد شد.',
    nextStepPreview: 'شستشوی مشروط قلیایی/اسیدی خوشه‌ها برای حذف گوگرد باغ.',
    category: 'prep'
  },
  {
    id: 2,
    phaseId: 1,
    phaseName: 'فاز ۱: آماده‌سازی و پذیرش (روز ۰)',
    title: 'شستشوی مشروط خوشه‌ها (حذف S⁰ سم‌پاشی باغ) و خشک‌سازی با پنکه',
    timeOrTrigger: 'پیش از کراش - روز ۰',
    targetTemp: '15–18 °C',
    keyAction: 'در صورت وجود آثار گوگرد باغ: تشت ۱ (2 g/L جوش‌شیرین) به مدت ۱-۲ دقیقه ← تشت ۲ (1 g/L اسید سیتریک) به مدت ۳۰ ثانیه ← آبکشی با آب خالص. سپس ۲ تا ۳ ساعت خشک‌سازی کامل جلوی پنکه صنعتی.',
    criticalWarning: 'ورود رطوبت شستشو به مخزن، بریکس را رقیق می‌کند؛ حتماً ۱۰۰٪ خشک شود.',
    nextStepPreview: 'خوشه‌زدایی دستی و کراش ملایم بدون شکستن هسته.',
    category: 'prep'
  },
  {
    id: 3,
    phaseId: 1,
    phaseName: 'فاز ۱: آماده‌سازی و پذیرش (روز ۰)',
    title: 'خوشه‌زدایی دستی، حذف ۱۰۰٪ دمبرگ‌های سبز و کراش ملایم',
    timeOrTrigger: 'روز ۰',
    targetTemp: '16–18 °C',
    keyAction: 'حذف کامل چوب‌های سبز، دمبرگ‌ها و حبه‌های نارس. کراش ملایم حبه‌ها به طوری که فقط پوست شکافته شود و هسته‌ها نشکنند.',
    criticalWarning: 'دمبرگ سبز و هستهٔ شکسته‌شده باعث ورود متوکسی‌پیرازین (طعم فلفل سبز) و گسی خشن فلزی می‌شوند.',
    nextStepPreview: 'شیب‌دار کردن مخازن و ثبت آنالیز پایه.',
    category: 'crush'
  },
  {
    id: 4,
    phaseId: 1,
    phaseName: 'فاز ۱: آماده‌سازی و پذیرش (روز ۰)',
    title: 'شیب‌دار کردن ۵ درجه‌ای مخازن A و B + ثبت آنالیز پایه (لاگ شیت ۱)',
    timeOrTrigger: 'روز ۰ - کراش',
    targetTemp: '16–18 °C',
    keyAction: 'قرار دادن گوهٔ چوبی ۲ سانتی زیر یک سمت مخزن. تقسیم متقارن توده (۱۷۵L در A و ۱۷۵L در B). سنجش و ثبت بریکس اولیه (۲۲)، SG اولیه (1.092)، pH اولیه (3.52) و TA اولیه (6.8 g/L).',
    nextStepPreview: 'تزریق اول سولفیت (KMS) حین کراش.',
    category: 'crush',
    requiresDataEntry: true,
    defaultDataEntryType: 'initial'
  },
  {
    id: 5,
    phaseId: 1,
    phaseName: 'فاز ۱: آماده‌سازی و پذیرش (روز ۰)',
    title: 'تزریق اول سولفیت (25 mg/L SO₂) حین کراش',
    timeOrTrigger: 'ساعت ۰۰:۰۰ (روز ۰)',
    targetTemp: '16–18 °C',
    keyAction: 'تزریق 6.52 g متابی‌سولفیت پتاسیم (KMS) در ۵۰۰mL آب سرد برای مخزن A و 6.52 g برای مخزن B و یک بار همزدن ملایم.',
    criticalWarning: 'مهار آنزیم‌های اکسیدکننده لکودپوکسیداز بدون بی‌رنگ کردن بیش از حد شیره رُزه.',
    nextStepPreview: 'ماسراسیون سرد رُزه و تست پتانسیل رنگ.',
    category: 'crush',
    requiresDataEntry: true,
    defaultDataEntryType: 'chemical',
    defaultChemicalName: 'متابی‌سولفیت پتاسیم (KMS - دوز اول)'
  },
  {
    id: 6,
    phaseId: 1,
    phaseName: 'فاز ۱: آماده‌سازی و پذیرش (روز ۰)',
    title: 'ماسراسیون سرد ۲.۵ تا ۳ ساعته رُزه و تست پتانسیل رنگ',
    timeOrTrigger: 'ساعت ۰۰:۰۰ تا ۰۳:۰۰',
    targetTemp: '16–18 °C',
    keyAction: 'تماس پوست با شیره جهت استخراج رنگ یاقوتی/مرجانی روشن. پایش رنگ در ساعت ۰۲:۰۰، ۰۲:۳۰ و ۰۳:۰۰ با تست چشمی روی کاغذ سفید + تست ۳۰ ثانیه‌ای ۱۰mL شیره صاف با ۰.۱g اسید تارتاریک و ۲ قطره آب‌اکسیژنه ۳٪.',
    nextStepPreview: 'خون‌گیری سانیه (Saignée) ۳۶ لیتر شیره رُزه.',
    category: 'fermentation'
  },
  {
    id: 7,
    phaseId: 1,
    phaseName: 'فاز ۱: آماده‌سازی و پذیرش (روز ۰)',
    title: 'خون‌گیری سانیه (Saignée) ۳۶ لیتر شیره رُزه در بستر یخ خشک/CO₂',
    timeOrTrigger: 'ساعت ۰۳:۰۰ تا ۰۳:۳۰',
    targetTemp: '17–18 °C',
    keyAction: 'تزریق ۳۵ گرم یخ خشک در کف دو گالن ۲۰L رُزه. کشیدن ۱۸ لیتر آب‌آزاد از مخزن A و ۱۸ لیتر از مخزن B (مجموعاً ۳۶ لیتر شیره رُزه) با سبد استیل و شیلنگ سیفون.',
    criticalWarning: 'درپوش گالن حاوی یخ خشک را هرگز کیپ نکنید (خطر انفجار).',
    nextStepPreview: 'تکمیل سولفیت قرمز + تزریق آنزیم پکتولیتیک.',
    category: 'crush'
  },
  {
    id: 8,
    phaseId: 1,
    phaseName: 'فاز ۱: آماده‌سازی و پذیرش (روز ۰)',
    title: 'تکمیل سولفیت قرمز (40 mg/L) + تزریق ۷.۲۶g آنزیم پکتولیتیک',
    timeOrTrigger: 'ساعت ۰۳:۳۰ تا ۰۳:۴۵',
    targetTemp: '19–20 °C',
    keyAction: 'تزریق 3.43 g KMS به هر مخزن قرمز (۱۳۲L) ← ۱۵ دقیقه بعد تزریق 7.26 g آنزیم پکتولیتیک (حل‌شده در ۱۵۰mL آب سرد بدون ایجاد کف) + زیر و رو کردن کلاهک.',
    criticalWarning: '۷.۵ ساعت استراحت مطلق بدون تزریق تانن تا آنزیم پکتین دیواره پوست رشه را بشکند.',
    nextStepPreview: 'آنزیم‌دهی و Débourbage بنتونیت رُزه در سرما.',
    category: 'fermentation',
    requiresDataEntry: true,
    defaultDataEntryType: 'chemical',
    defaultChemicalName: 'آنزیم پکتولیتیک Lallzyme EX'
  },
  {
    id: 9,
    phaseId: 1,
    phaseName: 'فاز ۱: آماده‌سازی و پذیرش (روز ۰)',
    title: 'آنزیم‌دهی و Débourbage بنتونیت رُزه (۷.۲۰g) در سرما',
    timeOrTrigger: 'ساعت ۰۳:۳۰ تا ۲۶:۰۰',
    targetTemp: '4–8 °C (یخچال)',
    keyAction: 'ساعت ۰۳:۳۰: تزریق 1.44 g آنزیم پکتیک به ۳۶L رُزه (۲ ساعت) ← ساعت ۰۵:۳۰: تزریق 7.20 g ژل بنتونیت هیدراته‌شده و انتقال به یخچال (۲۰.۵ ساعت).',
    nextStepPreview: 'تست الکل پکتین مخازن قرمز.',
    category: 'prep'
  },
  {
    id: 10,
    phaseId: 1,
    phaseName: 'فاز ۱: آماده‌سازی و پذیرش (روز ۰)',
    title: 'تست الکل پکتین مخازن قرمز',
    timeOrTrigger: 'ساعت ۱۰:۳۰ (روز ۰)',
    targetTemp: '20 °C',
    keyAction: 'مخلوط کردن 5 mL شیره صاف مخزن + 10 mL اتانول ۹۶٪ در لوله آزمایش. عدم تشکیل لخته ژله‌ای پس از ۵ دقیقه = شکست کامل پکتین.',
    nextStepPreview: 'تزریق تانن‌های فاز ۱ در مخازن قرمز.',
    category: 'fermentation'
  },
  {
    id: 11,
    phaseId: 1,
    phaseName: 'فاز ۱: آماده‌سازی و پذیرش (روز ۰)',
    title: 'تزریق تانن‌های فاز ۱ در مخازن قرمز (سفید + قرمز)',
    timeOrTrigger: 'ساعت ۱۱:۰۰ (روز ۰)',
    targetTemp: '20 °C',
    keyAction: 'تزریق 3.96 g تانن سفید + 13.20 g تانن قرمز (حل‌شده در ۲۵۰mL آب گرم ۳۵ درجه) برای هر مخزن ۱۳۲ لیتری + زیر و رو کردن کلاهک.',
    nextStepPreview: 'تست ۳ لیوانی اسید تارتاریک و اصلاح pH.',
    category: 'fermentation',
    requiresDataEntry: true,
    defaultDataEntryType: 'chemical',
    defaultChemicalName: 'تانن فاز ۱ (سفید + قرمز)'
  },
  {
    id: 12,
    phaseId: 1,
    phaseName: 'فاز ۱: آماده‌سازی و پذیرش (روز ۰)',
    title: 'تست ۳ لیوانی اسید تارتاریک و قفل روی pH = 3.52',
    timeOrTrigger: 'ساعت ۱۱:۱۵ تا ۱۲:۳۰',
    targetTemp: '20 °C',
    keyAction: 'اندازه‌گیری pH و TA اولیه. تست ۳ لیوانی با استوک ۱۰٪ اسید تارتاریک (۱ ساعت زمان تعادل یونی) ← تزریق اسید تارتاریک محاسبه‌شده (~200–260g در هر مخزن) برای قفل روی pH 3.52 (TA ≤ 7.2 g/L).',
    nextStepPreview: 'آب‌دهی و بیدارسازی مخمر RC-212 با Go-Ferm.',
    category: 'fermentation',
    requiresDataEntry: true,
    defaultDataEntryType: 'chemical',
    defaultChemicalName: 'اسید تارتاریک (اصلاح اسیدیته)'
  },
  {
    id: 13,
    phaseId: 1,
    phaseName: 'فاز ۱: آماده‌سازی و پذیرش (روز ۰)',
    title: 'آب‌دهی و بیدارسازی مخمر RC-212 با Go-Ferm در ۴۳ درجه',
    timeOrTrigger: 'ساعت ۱۵:۳۰ تا ۱۶:۰۰',
    targetTemp: '43 °C → 37 °C',
    keyAction: 'حل کردن 39.60 g پودر Go-Ferm در ۸۰۰mL آب ۴۳ درجه برای هر مخزن ← در ۳۹-۴۰ درجه پاشیدن 33.00 g مخمر RC-212 (۲۰ دقیقه استراحت).',
    nextStepPreview: 'هم‌دمایی ۳ مرحله‌ای و تلقیح مخمر به مخازن.',
    category: 'fermentation',
    requiresDataEntry: true,
    defaultDataEntryType: 'chemical',
    defaultChemicalName: 'مخمر Lalvin RC-212 + مکمل Go-Ferm Protect'
  },
  {
    id: 14,
    phaseId: 1,
    phaseName: 'فاز ۱: آماده‌سازی و پذیرش (روز ۰)',
    title: 'هم‌دمایی ۳ مرحله‌ای (اختلاف < ۳°C) و تلقیح به مخازن قرمز',
    timeOrTrigger: 'ساعت ۱۶:۰۰ تا ۱۶:۳۰',
    targetTemp: 'اختلاف دما < 3 °C',
    keyAction: 'افزودن شیره مخزن به ظرف مخمر در ۳ مرحله به فاصله ۸ دقیقه: +500mL (30.5°C) ← +900mL (26.0°C) ← +1500mL (22.5°C) و تلقیح نهایی به مخزن در ساعت ۱۶:۲۵.',
    criticalWarning: 'جلوگیری از شوک سرمایی و فلج شدن غشای سلولی مخمر.',
    nextStepPreview: 'شروع فاز ۲: پایش روزانه تخمیر قرمز و تغذیه SNA-1.',
    category: 'fermentation'
  },

  // PHASE 2: RED FERMENTATION & SNA STAGGERED NUTRITION (Steps 15 to 21)
  {
    id: 15,
    phaseId: 2,
    phaseName: 'فاز ۲: تخمیر اصلی قرمز و تغذیه پله‌ای (روز ۱ تا ۶)',
    title: 'پایش روزانه SG، دمای مرکز کلاهک (سقف ۲۸.۵°C) و Pigeage (لاگ شیت ۲)',
    timeOrTrigger: 'روز ۱ تا ۶ (روزانه ۲ تا ۴ نوبت)',
    targetTemp: '20–28.5 °C (سقف 29.0)',
    keyAction: 'اندازه‌گیری SG با هیدرومتر (ممنوعیت رفراکتومتر). اندازه‌گیری دمای ۱۵ سانت زیر کلاهک. ۴ نوبت Pigeage روزانه. خط قرمز دما: 29.5°C با ۲ عدد بطری یخ شناور.',
    nextStepPreview: 'تغذیه مرحله ۱ (SNA-1) در SG = 1.083.',
    category: 'fermentation',
    requiresDataEntry: true,
    defaultDataEntryType: 'daily'
  },
  {
    id: 16,
    phaseId: 2,
    phaseName: 'فاز ۲: تخمیر اصلی قرمز و تغذیه پله‌ای (روز ۱ تا ۶)',
    title: 'تغذیه مرحله ۱ (SNA-1) در SG = 1.083 (افت ۱۰٪ قند)',
    timeOrTrigger: 'SG = 1.083 (حدود روز ۲)',
    targetTemp: '22–24 °C',
    keyAction: 'گاززدایی ۲ دقیقه ای کلاهک + تزریق 33.00 g Fermaid O حل‌شده در ۵۰۰mL آب ولرم برای هر مخزن قرمز.',
    nextStepPreview: 'تغذیه مرحله ۲ (SNA-2) در SG = 1.070 همراه با هوادهی پاششی.',
    category: 'fermentation',
    requiresDataEntry: true,
    defaultDataEntryType: 'chemical',
    defaultChemicalName: 'مکمل Fermaid O (تغذیه SNA-1)'
  },
  {
    id: 17,
    phaseId: 2,
    phaseName: 'فاز ۲: تخمیر اصلی قرمز و تغذیه پله‌ای (روز ۱ تا ۶)',
    title: 'تغذیه مرحله ۲ (SNA-2) در SG = 1.070 (افت ۲۵٪ قند) + هوادهی',
    timeOrTrigger: 'SG = 1.070 (حدود روز ۳)',
    targetTemp: '25–26 °C',
    keyAction: 'گاززدایی + تزریق 33.00 g Fermaid K + 19.80 g DAP + 1.58 g مکمل روی (Wyeast) برای هر مخزن + هوادهی پاششی با پارچ استیل (پایان مطلق نیتروژن معدنی).',
    criticalWarning: 'تامین کل نیتروژن معدنی (DAP و Fermaid K) و کاتیون روی Zn²⁺ در اوج تقسیم سلولی جهت مهار H2S.',
    nextStepPreview: 'تزریق تانن فاز ۲ و جمع‌آوری هسته‌ها در SG = 1.060.',
    category: 'fermentation',
    requiresDataEntry: true,
    defaultDataEntryType: 'chemical',
    defaultChemicalName: 'تغذیه SNA-2 (Fermaid K + DAP + روی)'
  },
  {
    id: 18,
    phaseId: 2,
    phaseName: 'فاز ۲: تخمیر اصلی قرمز و تغذیه پله‌ای (روز ۱ تا ۶)',
    title: 'تزریق تانن فاز ۲ (در SG = 1.060) + جمع‌آوری هسته‌ها از کف',
    timeOrTrigger: 'SG = 1.060 (افت ۳۲٪ قند - روز ۴)',
    targetTemp: '26.5–27.5 °C',
    keyAction: 'تزریق 13.20 g تانن قرمز (حل‌شده در آب گرم) + جمع‌آوری هسته‌های جداشده از کف مخزن شیب‌دار با ملاقه پلاستیکی/سیلیکونی لبه‌صاف.',
    nextStepPreview: 'تغذیه مرحله ۳ (SNA-3) در SG = 1.057.',
    category: 'fermentation',
    requiresDataEntry: true,
    defaultDataEntryType: 'chemical',
    defaultChemicalName: 'تانن فاز ۲ قرمز (تثبیت رنگ)'
  },
  {
    id: 19,
    phaseId: 2,
    phaseName: 'فاز ۲: تخمیر اصلی قرمز و تغذیه پله‌ای (روز ۱ تا ۶)',
    title: 'تغذیه مرحله ۳ (SNA-3) در SG = 1.057 (افت ۳۶٪ قند) — سقف نهایی!',
    timeOrTrigger: 'SG = 1.057 (حدود عصر روز ۴)',
    targetTemp: '27–28 °C',
    keyAction: 'گاززدایی + تزریق صرفاً 39.60 g نیتروژن ۱۰۰٪ ارگانیک Fermaid O برای هر مخزن. پایان مطلق تغذیه نیتروژنی!',
    criticalWarning: 'در SG 1.057 (الکل ۶-۷٪) غشای پلاسمایی مخمر قادر به جذب یون آمونیوم معدنی نیست؛ تزریق هرگونه DAP یا Fermaid K در این مرحله مطلقاً ممنوع است تا نیتروژن آزاد برای برتانومایسس باقی نماند.',
    nextStepPreview: 'پنجره استخراج پلی‌فنول و رسیدن به نقطه طلایی پرسینگ.',
    category: 'fermentation',
    requiresDataEntry: true,
    defaultDataEntryType: 'chemical',
    defaultChemicalName: 'تغذیه نهایی SNA-3 (صرفاً Fermaid O ۱۰۰٪ ارگانیک)'
  },
  {
    id: 20,
    phaseId: 2,
    phaseName: 'فاز ۲: تخمیر اصلی قرمز و تغذیه پله‌ای (روز ۱ تا ۶)',
    title: 'پنجره استخراج پلی‌فنول و چشیدن نرمی تانن',
    timeOrTrigger: 'SG 1.045 → 1.012 (روز ۵ تا ظهر ۶)',
    targetTemp: '27.5–28.5 °C (پیک ۳۶ ساعته)',
    keyAction: 'غوطه‌ورسازی ملایم کلاهک بدون له کردن پوست. چشیدن نمونه هر ۸ ساعت برای ارزیابی بافت و نرمی تانن روی زبان.',
    nextStepPreview: 'نقطه طلایی پرسینگ در SG = 1.008 (عصر روز ۶).',
    category: 'fermentation'
  },
  {
    id: 21,
    phaseId: 2,
    phaseName: 'فاز ۲: تخمیر اصلی قرمز و تغذیه پله‌ای (روز ۱ تا ۶)',
    title: 'نقطه طلایی پرسینگ قرمز در SG = 1.008 (عصر روز ۶)',
    timeOrTrigger: 'SG = 1.008 (بازه 1.006 تا 1.009)',
    targetTemp: 'کاهش فوری به 22 °C',
    keyAction: 'توقف کامل Pigeage! خنک‌سازی فوری مخزن با بطری یخ به ۲۲ درجه و آماده‌سازی برای جداسازی پوست.',
    nextStepPreview: 'فاز ۳: پرسینگ، تفکیک شراب آب‌آزاد و تخمیر مایع.',
    category: 'pressing'
  },

  // PHASE 3: PRESSING, LIQUID FERMENTATION & COPPER/BACTILESS (Steps 22 to 28)
  {
    id: 22,
    phaseId: 3,
    phaseName: 'فاز ۳: پرسینگ، تخمیر فاز مایع و جراحی گوگرد (روز ۶ تا ۲۱)',
    title: 'تفکیک ۲۲۰L شراب آب‌آزاد (Free-Run) از ۲۴L شراب پرس سنگین',
    timeOrTrigger: 'عصر روز ۶',
    targetTemp: '22 °C',
    keyAction: 'کشیدن ۱۱۰ لیتر شراب آب‌آزاد از مخزن A و ۱۱۰ لیتر از مخزن B (۲۲۰L کل). پرسینگ مکانیکی تفاله‌ها و جمع‌آوری ۲۴L پرس سنگین در گالن‌های مجزا.',
    criticalWarning: 'شراب پرس سنگین هرگز نباید وارد شراب اصلی شود (در گالن مجزا نگهداری شود).',
    nextStepPreview: 'تکمیل تخمیر قند باقی‌مانده (33 g/L) در فاز مایع.',
    category: 'pressing'
  },
  {
    id: 23,
    phaseId: 3,
    phaseName: 'فاز ۳: پرسینگ، تخمیر فاز مایع و جراحی گوگرد (روز ۶ تا ۲۱)',
    title: 'تکمیل تخمیر فاز مایع (مصرف 33 g/L قند باقی‌مانده)',
    timeOrTrigger: 'روز ۶ تا ۹',
    targetTemp: '22–23 °C (زیر قفل هوا)',
    keyAction: 'نگهداری ۱۱۰L شراب آب‌آزاد هر بچ در ظروف دوم زیر قفل هوا تا مخمرها قند باقی‌مانده و اکسیژن پرسینگ را بلعیده و CO2 تولید کنند.',
    nextStepPreview: 'تایید خشکی مطلق و سیفون دُرد سنگین.',
    category: 'fermentation',
    requiresDataEntry: true,
    defaultDataEntryType: 'daily'
  },
  {
    id: 24,
    phaseId: 3,
    phaseName: 'فاز ۳: پرسینگ، تخمیر فاز مایع و جراحی گوگرد (روز ۶ تا ۲۱)',
    title: 'تایید خشکی مطلق (SG = 0.993 و قند < 2 g/L)',
    timeOrTrigger: 'روز ۹ (ثبات ۲۴ ساعته)',
    targetTemp: 'کاهش به 15–16 °C',
    keyAction: 'ثبات SG روی 0.992–0.994 + تایید قند زیر 2 g/L با قرص Clinitest یا محلول فهلینگ. ۳۰ ساعت سرما در ۱۵-۱۶ درجه برای رسوب دُرد سنگین.',
    nextStepPreview: 'سیفون دُرد سنگین به گالن‌های ۲۰L و ۵L لب‌به‌لب (روز ۱۰).',
    category: 'racking',
    requiresDataEntry: true,
    defaultDataEntryType: 'daily'
  },
  {
    id: 25,
    phaseId: 3,
    phaseName: 'فاز ۳: پرسینگ، تخمیر فاز مایع و جراحی گوگرد (روز ۶ تا ۲۱)',
    title: 'سیفون دُرد سنگین به گالن‌های لب‌به‌لب (۱۰۵L هر بچ) - روز ۱۰',
    timeOrTrigger: 'روز ۱۰',
    targetTemp: '15–16 °C',
    keyAction: 'سیفون ۱۰۵ لیتر شراب صاف هر بچ به ۵ گالن ۲۰L + ۱ گالن ۵L لب‌به‌لب و دور ریختن ۵ لیتر لجن غلیظ کف.',
    nextStepPreview: 'اجرای تست ۵ لیوانی مس و اسکوربیک اسید.',
    category: 'racking'
  },
  {
    id: 26,
    phaseId: 3,
    phaseName: 'فاز ۳: پرسینگ، تخمیر فاز مایع و جراحی گوگرد (روز ۶ تا ۲۱)',
    title: 'اجرای تست ۵ لیوانی مس/اسکوربیک جهت شناسایی H2S و دی‌سولفید',
    timeOrTrigger: 'روز ۱۰ (بلافاصله پس از سیفون)',
    targetTemp: '18–20 °C',
    keyAction: 'چیدمان ۵ لیوان: ۱ (شاهد)، ۲A (مس 0.25mg/L)، ۲B (مس 0.50mg/L)، ۲C (مس 1.00mg/L)، ۳ (ویتامین C + سولفیت + مس برای دی‌سولفید). تزریق دوز برنده با سرنگ از استوک ۲.',
    criticalWarning: 'استفاده از لوله یا سکه مسی ممنوع است؛ صرفاً محلول کالیبره‌شده ۰.۱٪ سولفات مس.',
    nextStepPreview: 'قفل بیولوژیکی ۱۰ روزه با Bactiless و KMS.',
    category: 'racking',
    requiresDataEntry: true,
    defaultDataEntryType: 'chemical',
    defaultChemicalName: 'سولفات مس (تست H2S و دی‌سولفید)'
  },
  {
    id: 27,
    phaseId: 3,
    phaseName: 'فاز ۳: پرسینگ، تخمیر فاز مایع و جراحی گوگرد (روز ۶ تا ۲۱)',
    title: 'قفل بیولوژیکی ۱۰ روزه با Bactiless و KMS (روز ۱۱ تا ۲۱)',
    timeOrTrigger: 'روز ۱۱ (۲۴h پس از تست مس)',
    targetTemp: '15–16 °C',
    keyAction: 'تزریق 31.50 g Bactiless + 8.19 g KMS در ۱۰۵L هر بچ با قانون تقسیم ۵۲۵mL (100mL در گالن ۲۰L و 25mL در گالن ۵L). ۱۰ روز استراحت.',
    criticalWarning: 'لیز غشای باکتری‌های مالولاکتیک/سرکه + کیلیت کردن و رسوب دادن کامل مس اضافی.',
    nextStepPreview: 'سیفون روز ۲۱ از روی باکتیلس.',
    category: 'racking',
    requiresDataEntry: true,
    defaultDataEntryType: 'chemical',
    defaultChemicalName: 'مکمل Bactiless + KMS (قفل بیولوژیکی)'
  },
  {
    id: 28,
    phaseId: 3,
    phaseName: 'فاز ۳: پرسینگ، تخمیر فاز مایع و جراحی گوگرد (روز ۶ تا ۲۱)',
    title: 'سیفون روز ۲۱ از روی باکتیلس (۱۰۲L خالص هر بچ)',
    timeOrTrigger: 'روز ۲۱',
    targetTemp: '14–15 °C',
    keyAction: 'سیفون ۱۰۲ لیتر شراب زلال هر بچ به ۵ گالن ۲۰L لب‌به‌لب + ۲ لیتر در بطری‌های یدکی جهت Top-up.',
    nextStepPreview: 'فاز ۵: استراحت لب‌به‌لب و سرمازدایی تارتارات.',
    category: 'racking'
  },

  // PHASE 4: ROSE SAIGNEE COMPLETE PROCESS (Steps 29 to 34)
  {
    id: 29,
    phaseId: 4,
    phaseName: 'فاز ۴: پروسه کامل رُزه سانیه (روز ۱ تا ۶۵)',
    title: 'سیفون Débourbage رُزه (۳۲L شیره زلال) + گرم‌سازی فعال تا ۱۸°C',
    timeOrTrigger: 'ساعت ۲۶:۰۰ (روز ۱)',
    targetTemp: '6 → 18 °C',
    keyAction: 'سیفون ۳۲L شیره زلال بالایی به دو گالن ۲۰L (دور ریختن ۴L لجن). قرار دادن گالن‌ها در تشت آب ۲۴ درجه به مدت ۲ ساعت تا رسیدن به ۱۸ درجه.',
    nextStepPreview: 'تزریق تانن سفید + تنظیم pH اولیه رُزه.',
    category: 'prep'
  },
  {
    id: 30,
    phaseId: 4,
    phaseName: 'فاز ۴: پروسه کامل رُزه سانیه (روز ۱ تا ۶۵)',
    title: 'تزریق ۱.۱۲g تانن سفید + تنظیم pH اولیه رُزه روی 3.35–3.40',
    timeOrTrigger: 'ساعت ۲۸:۰۰ (روز ۱)',
    targetTemp: '18 °C',
    keyAction: 'تزریق 1.12 g تانن سفید + تنظیم pH اولیه روی 3.35–3.40 با اسید تارتاریک (~40–65g) با سقف TA ≤ 7.0 g/L (تا پس از سرمازدایی pH نهایی روی 3.28-3.32 قفل شود).',
    nextStepPreview: 'آب‌دهی و تلقیح مخمر رُزه در ساعت ۲۹:۰۰.',
    category: 'fermentation',
    requiresDataEntry: true,
    defaultDataEntryType: 'chemical',
    defaultChemicalName: 'تانن سفید + اسید تارتاریک رُزه'
  },
  {
    id: 31,
    phaseId: 4,
    phaseName: 'فاز ۴: پروسه کامل رُزه سانیه (روز ۱ تا ۶۵)',
    title: 'تلقیح مخمر RC-212 هم‌دماشده به ۳۲ لیتر شیره رُزه',
    timeOrTrigger: 'ساعت ۲۹:۰۰ (روز ۱)',
    targetTemp: '18–19 °C',
    keyAction: 'آب‌دهی 8.00 g مخمر با 9.60 g Go-Ferm در ۲۰۰mL آب ۴۳ درجه + هم‌دمایی ۳ مرحله‌ای (+150, +250, +400mL شیره) و تلقیح به گالن‌ها.',
    nextStepPreview: 'تخمیر خنک رُزه و تغذیه SNA با مکمل روی.',
    category: 'fermentation'
  },
  {
    id: 32,
    phaseId: 4,
    phaseName: 'فاز ۴: پروسه کامل رُزه سانیه (روز ۱ تا ۶۵)',
    title: 'تخمیر خنک رُزه (16-18°C) و تغذیه پله‌ای + روی (لاگ شیت ۳)',
    timeOrTrigger: 'SG 1.083, 1.070, 1.057',
    targetTemp: '16–18 °C',
    keyAction: 'SNA-1 (SG 1.083): 6.40g Fermaid O + 0.48g Wyeast Zn؛ SNA-2 (SG 1.070): 5.76g Fermaid K + 3.20g DAP؛ SNA-3 (SG 1.057): صرفاً 7.36g نیتروژن ۱۰۰٪ ارگانیک Fermaid O.',
    nextStepPreview: 'پایان تخمیر رُزه و قفل باکتیلس.',
    category: 'fermentation',
    requiresDataEntry: true,
    defaultDataEntryType: 'daily'
  },
  {
    id: 33,
    phaseId: 4,
    phaseName: 'فاز ۴: پروسه کامل رُزه سانیه (روز ۱ تا ۶۵)',
    title: 'پایان تخمیر رُزه (SG 0.992) و قفل باکتیلس (۱۰ روز)',
    timeOrTrigger: 'SG 0.992 (خشکی کامل)',
    targetTemp: '14–15 °C',
    keyAction: '۳۰ ساعت سرما در ۱۴ درجه ← سیفون ۳۰L رُزه صاف ← تست مس ← تزریق 7.50 g Bactiless + 2.34 g KMS (100mL در ۲۰L، 25mL در ۵L) ← ۱۰ روز تماس.',
    nextStepPreview: 'سیفون از روی باکتیلس و نگهداری ساکن.',
    category: 'racking'
  },
  {
    id: 34,
    phaseId: 4,
    phaseName: 'فاز ۴: پروسه کامل رُزه سانیه (روز ۱ تا ۶۵)',
    title: 'سیفون باکتیلس و نگهداری ساکن در گالن‌های لب‌به‌لب',
    timeOrTrigger: '۱۰ روز پس از باکتیلس',
    targetTemp: '14 °C',
    keyAction: 'سیفون از روی باکتیلس به گالن‌های ۲۰L و ۵L لب‌به‌لب و نگهداری کاملاً ساکن در تاریکی با کنترل Top-up دوره‌ای.',
    nextStepPreview: 'پایدارسازی سرد رُزه همراه با شراب قرمز در روز ۶۵.',
    category: 'aging'
  },

  // PHASE 5: MATURATION, COLD STABILIZATION & GLYCERIN (Steps 35 to 39)
  {
    id: 35,
    phaseId: 5,
    phaseName: 'فاز ۵: آمیزه، سرمازدایی تارتارات و فینیشینگ (روز ۲۱ تا ۹۵)',
    title: 'نگهداری لب‌به‌لب و Top-up دوره‌ای (روز ۲۱ تا ۶۰)',
    timeOrTrigger: 'روز ۲۱ تا ۶۰',
    targetTemp: '14–15 °C (تاریکی)',
    keyAction: 'پر نگه داشتن گالن‌های ۲۰L تا زیر درپوش با شراب یدکی بطری‌های کوچک هر ۱۰ روز یک‌بار. ممنوعیت استفاده از روغن پارافین!',
    nextStepPreview: 'تزریق تانن فینیشینگ در روز ۶۰ (پیش از سرمازدایی).',
    category: 'aging'
  },
  {
    id: 36,
    phaseId: 5,
    phaseName: 'فاز ۵: آمیزه، سرمازدایی تارتارات و فینیشینگ (روز ۲۱ تا ۹۵)',
    title: 'تزریق تانن فینیشینگ (روز ۶۰) — ۵ روز پیش از سرمازدایی',
    timeOrTrigger: 'روز ۶۰',
    targetTemp: '14–15 °C',
    keyAction: 'تزریق 2.50 g تانن قرمز در ۱۰۰L هر بچ قرمز و 0.44 g تانن سفید در ۲۹L رُزه جهت رسوب دادن کامل کلوئیدهای ناپایدار در سرمازدایی بعدی.',
    criticalWarning: 'تزریق تانن پیش از سرمازدایی ۱۰۰٪ خطر کدورت بعدی بطری را حذف می‌کند.',
    nextStepPreview: 'پایدارسازی سرد ۱۴ روزه با بذرپاشی کریستالی (روز ۶۵).',
    category: 'aging',
    requiresDataEntry: true,
    defaultDataEntryType: 'chemical',
    defaultChemicalName: 'تانن فینیشینگ (پیش از سرمازدایی)'
  },
  {
    id: 37,
    phaseId: 5,
    phaseName: 'فاز ۵: آمیزه، سرمازدایی تارتارات و فینیشینگ (روز ۲۱ تا ۹۵)',
    title: 'پایدارسازی سرد ۱۴ روزه در 0 تا +2°C با بذرپاشی کرم تارتار',
    timeOrTrigger: 'روز ۶۵ تا ۸۰',
    targetTemp: '0 تا +2 °C',
    keyAction: 'انتقال به محیط 0 تا +2 °C ← به محض رسیدن دما به +1 °C، بذرپاشی کریستالی (Contact Seeding) با 0.20 g/L کرم تارتار (20g در ۵ گالن ۲۰L هر بچ). ۱۴ روز تماس.',
    criticalWarning: 'دمای بالای صفر (+1 °C) از یخ‌زدگی و شکستن گالن‌های شیشه‌ای جلوگیری می‌کند.',
    nextStepPreview: 'سیفون در حالت سرد در روز ۸۰.',
    category: 'aging',
    requiresDataEntry: true,
    defaultDataEntryType: 'chemical',
    defaultChemicalName: 'کریستال بذرپاشی کرم تارتار (Contact Seeding)'
  },
  {
    id: 38,
    phaseId: 5,
    phaseName: 'فاز ۵: آمیزه، سرمازدایی تارتارات و فینیشینگ (روز ۲۱ تا ۹۵)',
    title: 'سیفون در حالت سرد از روی کریستال‌های تارتارات (روز ۸۰)',
    timeOrTrigger: 'روز ۸۰ (پایان سرمازدایی)',
    targetTemp: '0 تا +2 °C (قبل گرم شدن)',
    keyAction: 'سیفون شراب زلال در حالت سرد از روی کریستال‌های تارتارات. حجم خالص: ۱۰۰L هر بچ قرمز (۲۰۰L کل = ۲۶۶ بطری) و ۲۹L رُزه.',
    nextStepPreview: 'تست حسی ۳ لیوانی گلیسیرین در روز ۸۵.',
    category: 'racking'
  },
  {
    id: 39,
    phaseId: 5,
    phaseName: 'فاز ۵: آمیزه، سرمازدایی تارتارات و فینیشینگ (روز ۲۱ تا ۹۵)',
    title: 'تست حسی ۳ لیوانی گلیسیرین و همگن‌سازی (روز ۸۵)',
    timeOrTrigger: 'روز ۸۵ (دمای ۱۸-۱۹ درجه)',
    targetTemp: '18–19 °C',
    keyAction: 'تست ۳ لیوانی: شاهد، 2.0 g/L و 3.5 g/L. حل کردن گلیسیرین برنده (تا 350g/278mL در ۱۰۰L قرمز و 43.5g در ۲۹L رُزه) در ۲ لیتر شراب ولرم ۲۶ درجه و توزیع در گالن‌ها. ۱۵ روز استراحت (Marrying).',
    nextStepPreview: 'فاز ۶: بطری‌گذاری ضد-اکسیداسیون و ایجینگ.',
    category: 'aging',
    requiresDataEntry: true,
    defaultDataEntryType: 'chemical',
    defaultChemicalName: 'گلیسیرین خوراکی (بهبود بافت و نرمی دهانی)'
  },

  // PHASE 6: ANTI-OXIDATIVE BOTTLING & AGING (Steps 40 to 46)
  {
    id: 40,
    phaseId: 6,
    phaseName: 'فاز ۶: بطری‌گذاری ضد-اکسیداسیون و ایجینگ (روز ۹۹ تا ۱۰۳)',
    title: 'تجمیع همگن در مخزن پرکن ۲۰۰L در بستر ۵۰g یخ خشک/CO₂',
    timeOrTrigger: 'روز ۹۹ (۲۴h قبل از بطری)',
    targetTemp: '18–20 °C',
    keyAction: 'انتقال ۵ گالن هر بچ به مخزن پرکن ۲۰۰L ضدعفونی‌شده حاوی ۵۰g یخ خشک/CO2. همگن‌سازی کامل و تثبیت دما روی ۱۸-۲۰ درجه.',
    criticalWarning: 'هرگز شراب سرد ۱۰ یا ۱۲ درجه را بطری نکنید (منبسط شده و چوب‌پنبه را بیرون می‌زند!).',
    nextStepPreview: 'تنظیم دقیق Free SO₂ روی ۳۵ mg/L.',
    category: 'bottling'
  },
  {
    id: 41,
    phaseId: 6,
    phaseName: 'فاز ۶: بطری‌گذاری ضد-اکسیداسیون و ایجینگ (روز ۹۹ تا ۱۰۳)',
    title: 'اندازه‌گیری Free SO₂ و تنظیم روی ۳۵ mg/L در قرمز و ۳۰ mg/L در رُزه',
    timeOrTrigger: 'روز ۹۹ (۲۴h قبل از بطری)',
    targetTemp: '18–20 °C',
    keyAction: 'سنجش Free SO₂ با ریپر ← محاسبه KMS لازم: [(Target - Measured) × Volume] / 570 ← تزریق ~3.00g KMS در ۱۰۰L قرمز و ~0.87g در ۲۹L رُزه.',
    nextStepPreview: 'تزریق ال-اسید اسکوربیک (ویتامین C) ۳۰ دقیقه قبل از بطری.',
    category: 'bottling',
    requiresDataEntry: true,
    defaultDataEntryType: 'chemical',
    defaultChemicalName: 'KMS تنظیم Free SO2 قبل از بطری'
  },
  {
    id: 42,
    phaseId: 6,
    phaseName: 'فاز ۶: بطری‌گذاری ضد-اکسیداسیون و ایجینگ (روز ۹۹ تا ۱۰۳)',
    title: 'تزریق ال-اسید اسکوربیک (ویتامین C) — ۳۰ دقیقه پیش از بطری',
    timeOrTrigger: 'روز ۱۰۰ (۳۰ تا ۶۰ min قبل بطری)',
    targetTemp: '18–20 °C',
    keyAction: 'تزریق 3.50 g ال-اسید اسکوربیک خالص (35 mg/L) به ۱۰۰L قرمز و 1.02 g به ۲۹L رُزه و همزدن ملایم بدون کف.',
    criticalWarning: 'ویتامین C اکسیژن‌خوار لحظه‌ای است؛ فقط ۳۰ دقیقه قبل از بطری‌گیری اضافه شود.',
    nextStepPreview: 'ضدعفونی بطری‌ها و بخاردهی سرد چوب‌پنبه‌ها.',
    category: 'bottling',
    requiresDataEntry: true,
    defaultDataEntryType: 'chemical',
    defaultChemicalName: 'ال-اسید اسکوربیک (ویتامین C اکسیژن‌خوار)'
  },
  {
    id: 43,
    phaseId: 6,
    phaseName: 'فاز ۶: بطری‌گذاری ضد-اکسیداسیون و ایجینگ (روز ۹۹ تا ۱۰۳)',
    title: 'ضدعفونی بطری‌ها و بخاردهی سرد چوب‌پنبه‌ها در سطل SO₂',
    timeOrTrigger: 'روز ۱۰۰ (روز بطری)',
    targetTemp: 'دمای محیط',
    keyAction: 'چرخاندن محلول سولفیت اسیدی در بطری‌ها (تخلیه بدون آبکشی شهری). بخاردهی چوب‌پنبه‌های خشک بالای ۱L آب + 5g KMS + 5g سیتریک در سطل دردار (۳۰ دقیقه).',
    criticalWarning: 'ممنوعیت مطلق خیساندن چوب‌پنبه در آب گرم/جوش (لایه پارافین شسته می‌شود!).',
    nextStepPreview: 'پر کردن از کف، هوازدایی با یخ خشک و نخ نایلونی.',
    category: 'bottling'
  },
  {
    id: 44,
    phaseId: 6,
    phaseName: 'فاز ۶: بطری‌گذاری ضد-اکسیداسیون و ایجینگ (روز ۹۹ تا ۱۰۳)',
    title: 'پر کردن از کف، ذره یخ خشک ۰.۱۵g و نخ نایلونی 0.40mm',
    timeOrTrigger: 'روز ۱۰۰ (عملیات بطری)',
    targetTemp: '18–20 °C',
    keyAction: 'پر کردن از کف با شیلنگ سوپاپ‌دار (فضای خالی Ullage ۱۲-۱۵mm) ← انداختن دانه برنج یخ خشک (0.15g) در گلوگاه ← عبور نخ نایلونی 0.40mm هنگام کوبیدن چوب‌پنبه جهت تخلیه فشار و بیرون کشیدن نخ.',
    nextStepPreview: 'استراحت عمودی ۷۲ ساعته بطری‌ها.',
    category: 'bottling'
  },
  {
    id: 45,
    phaseId: 6,
    phaseName: 'فاز ۶: بطری‌گذاری ضد-اکسیداسیون و ایجینگ (روز ۹۹ تا ۱۰۳)',
    title: 'استراحت عمودی/ایستاده ۷۲ ساعته بطری‌ها در ۱۸°C',
    timeOrTrigger: 'روز ۱۰۰ تا ۱۰۳ (۷۲ ساعت)',
    targetTemp: '18 °C',
    keyAction: 'قرار دادن بطری‌ها به صورت ۱۰۰٪ عمودی/ایستاده به مدت ۷۲ ساعت تا چوب‌پنبه فشرده‌شده انبساط یافته و به شیشه گلوگاه قفل شود.',
    criticalWarning: 'خواباندن فوری بطری باعث نشت شراب از کنار چوب‌پنبه می‌شود.',
    nextStepPreview: 'موم‌بندی بن‌ماری و انتقال به انبار ایجینگ.',
    category: 'bottling'
  },
  {
    id: 46,
    phaseId: 6,
    phaseName: 'فاز ۶: بطری‌گذاری ضد-اکسیداسیون و ایجینگ (روز ۹۹ تا ۱۰۳)',
    title: 'موم‌بندی بن‌ماری (۸۰°C) و انتقال به انبار ایجینگ ۱۲-۱۵°C',
    timeOrTrigger: 'روز ۱۰۳ (ساعت ۷۲)',
    targetTemp: '80 °C (موم) / 12–15 °C (انبار)',
    keyAction: 'ذوب ۱۰۴۰g موم عسل + ۱۹۵g پارافین + ۶۵g روغن نارگیل در بن‌ماری ۸۰ درجه ← فرو بردن سر بطری تا ۱.۵ سانتی‌متر زیر لبه ← نگهداری افقی/عمودی در انبار ۱۲-۱۵ درجه در تاریکی.',
    nextStepPreview: 'پایان موفقیت‌آمیز پروسه! شروع بلوغ آروماتیک در بطری.',
    category: 'bottling'
  }
];

export interface StepLabToolLink {
  testId: string;
  label: string;
  shortLabel: string;
}

export function getStepLabTools(stepId: number): StepLabToolLink[] {
  if (stepId === 1) {
    return [
      {
        testId: 'sop-09',
        label: '🧮 باز کردن ماشین‌حساب و SOP این مرحله (موازنه جرم، حجم و کالیبراسیون — SOP-09)',
        shortLabel: '🧮 ماشین‌حساب موازنه و کالیبراسیون (SOP-09)'
      }
    ];
  }
  if ([4, 15, 20, 21, 23].includes(stepId)) {
    return [
      {
        testId: 'sop-01',
        label: '🧮 باز کردن ماشین‌حساب و SOP این مرحله (تصحیح دمای هیدرومتر و بریکس — SOP-01)',
        shortLabel: '🧮 ماشین‌حساب هیدرومتر و SG (SOP-01)'
      }
    ];
  }
  if ([12, 30].includes(stepId)) {
    return [
      {
        testId: 'sop-03',
        label: '🧮 باز کردن ماشین‌حساب و SOP این مرحله (تنظیم pH و تست ۳ لیوانی اسید تارتاریک — SOP-03)',
        shortLabel: '🧮 ماشین‌حساب pH و اسید تارتاریک (SOP-03)'
      },
      {
        testId: 'sop-02',
        label: '🧪 باز کردن ماشین‌حساب و SOP تیتراسیون اسیدیته کل (TA — SOP-02)',
        shortLabel: '🧪 تیتراسیون TA (SOP-02)'
      }
    ];
  }
  if ([5, 8, 27, 41].includes(stepId)) {
    return [
      {
        testId: 'sop-04',
        label: '🧮 باز کردن ماشین‌حساب و SOP این مرحله (سنجش ریپر Free SO2 و دوز KMS — SOP-04)',
        shortLabel: '🧮 ماشین‌حساب SO2 و KMS (SOP-04)'
      }
    ];
  }
  if ([16, 17, 19, 32].includes(stepId)) {
    return [
      {
        testId: 'sop-05',
        label: '🧮 باز کردن ماشین‌حساب و SOP این مرحله (بودجه نیتروژن YAN و تغذیه ۳ پله‌ای SNA — SOP-05)',
        shortLabel: '🧮 ماشین‌حساب YAN و SNA (SOP-05)'
      }
    ];
  }
  if ([24, 33].includes(stepId)) {
    return [
      {
        testId: 'sop-07',
        label: '🧮 باز کردن ماشین‌حساب و SOP این مرحله (تایید خشکی نهایی و آزمون Clinitest < 2 g/L — SOP-07)',
        shortLabel: '🧮 آزمون خشکی و Clinitest (SOP-07)'
      }
    ];
  }
  if ([9, 26].includes(stepId)) {
    return [
      {
        testId: 'sop-08',
        label: '🧮 باز کردن ماشین‌حساب و SOP این مرحله (تست بنتونیت و تست ۵ لیوانی سولفات مس — SOP-08)',
        shortLabel: '🧮 تست بنتونیت و سولفات مس (SOP-08)'
      }
    ];
  }
  return [];
}
