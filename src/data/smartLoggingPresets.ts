import type { DynamicProtocolPlan } from './masterProtocolConfig.ts';
import type { TankId } from '../types/tracking.ts';
import type { LabAnalysisRecord } from '../types/database.ts';
import { specificGravityToBrix } from '../utils/trackingCalculations.ts';

export interface AdditivePresetItem {
  id: string;
  category:
    | 'sulfite'
    | 'enzyme_fining'
    | 'tannin_acid'
    | 'yeast_nutrient'
    | 'stabilization_finishing';
  categoryLabelFa: string;
  labelFa: string;
  compoundName: string;
  pubchemCid?: number;
  stageTitle: string;
  amount: number;
  unit: 'g' | 'mL' | 'mg/L' | 'g/hL' | 'kg';
  purpose: string;
}

export interface DailyStagePresetItem {
  id: string;
  labelFa: string;
  dayNumber: number;
  stageTitle: string;
  sg: number;
  brix: number;
  tempCap: number;
  tempRoom: number;
  ph: number;
  ta: number;
  freeSO2?: number;
  pigeageDone: boolean;
  pigeageCount: number;
  note: string;
  isTrigger: boolean;
}

export interface LabAnalysisPresetItem {
  id: string;
  labelFa: string;
  testType: LabAnalysisRecord['testType'];
  analyte: string;
  defaultValue: string;
  unit: string;
  actionTaken: string;
  notes: string;
}

export function getSmartAdditivePresets(
  plan: DynamicProtocolPlan,
  tankId: TankId
): AdditivePresetItem[] {
  const isRose = tankId === 'tank-rose';
  const d = plan.dosages;
  const v = plan.volumes;
  const t = plan.triggers;
  const p = plan.params;

  return [
    // 1. Sulfites (sulfite)
    {
      id: 'kms-crush',
      category: 'sulfite',
      categoryLabelFa: '۱. ترکیبات سولفیت و آنتی‌اکسیدان (KMS)',
      labelFa: `KMS دوز اول کراش (${d.crushKmsPerTankG}g — هدف ${p.crushSO2TargetMgL} mg/L)`,
      compoundName: 'متابی‌سولفیت پتاسیم (KMS - دوز اول کراش)',
      pubchemCid: 24446,
      stageTitle: 'گام ۵: کراش و سولفیتاسیون اولیه (روز ۰)',
      amount: d.crushKmsPerTankG ?? 6.52,
      unit: 'g',
      purpose: `حذف مخمرهای وحشی Kloeckera و مهار اکسیداسیون اولیه (${p.crushSO2TargetMgL} mg/L SO₂ در ${v.initialLiquidPerTankL}L مایع)`
    },
    {
      id: 'kms-post-saignee',
      category: 'sulfite',
      categoryLabelFa: '۱. ترکیبات سولفیت و آنتی‌اکسیدان (KMS)',
      labelFa: `KMS تکمیلی پس از سانیه قرمز (${d.postSaigneeKmsPerTankG}g — سقف ${p.postSaigneeRedSO2TargetMgL} mg/L)`,
      compoundName: 'متابی‌سولفیت پتاسیم (KMS - پس از سانیه)',
      pubchemCid: 24446,
      stageTitle: 'گام ۸: تکمیل سولفیت قرمز پس از خون‌گیری سانیه (روز ۰)',
      amount: d.postSaigneeKmsPerTankG ?? 3.43,
      unit: 'g',
      purpose: `رساندن سولفیت کل فاز مایع قرمز (${v.redLiquidFermentPerTankL}L) به ${p.postSaigneeRedSO2TargetMgL} mg/L پیش از آنزیم‌دهی`
    },
    {
      id: 'kms-post-ferm',
      category: 'sulfite',
      categoryLabelFa: '۱. ترکیبات سولفیت و آنتی‌اکسیدان (KMS)',
      labelFa: isRose
        ? `KMS پایان تخمیر رُزه (${d.rosePostFermKmsG}g در ${v.rosePostRackingL}L)`
        : `KMS قفل بیولوژیکی روز ۱۱ قرمز (${d.day11KmsPerTankG}g در ${v.rack1PerTankL}L)`,
      compoundName: 'متابی‌سولفیت پتاسیم (KMS - پایان تخمیر/روز ۱۱)',
      pubchemCid: 24446,
      stageTitle: isRose
        ? 'گام ۳۳: تثبیت پس از تخمیر شراب رُزه'
        : 'گام ۲۷: سیفون اول و قفل بیولوژیکی روز ۱۱',
      amount: isRose ? (d.rosePostFermKmsG ?? 2.34) : (d.day11KmsPerTankG ?? 6.72),
      unit: 'g',
      purpose: isRose
        ? `تثبیت میکروبی و آنتی‌اکسیدانی شراب رُزه صاف‌شده (${v.rosePostRackingL}L)`
        : `تامین ~40 mg/L سولفیت آزاد و قفل کامل تخمیر مالولاکتیک در ${v.rack1PerTankL}L شراب قرمز`
    },
    {
      id: 'kms-pre-bottling',
      category: 'sulfite',
      categoryLabelFa: '۱. ترکیبات سولفیت و آنتی‌اکسیدان (KMS)',
      labelFa: isRose
        ? `KMS پیش از بطری‌گذاری رُزه (${d.rosePreBottlingKmsG}g در ${v.roseFinalBottlingL}L)`
        : `KMS پیش از بطری‌گذاری قرمز (${d.preBottlingKmsPerTankG}g در ${v.finalRedPerTankL}L)`,
      compoundName: 'متابی‌سولفیت پتاسیم (KMS - تنظیم پیش از بطری)',
      pubchemCid: 24446,
      stageTitle: 'گام ۴۱: تنظیم نهایی Free SO₂ پیش از بطری‌گذاری (روز ۹۹)',
      amount: isRose ? (d.rosePreBottlingKmsG ?? 0.87) : (d.preBottlingKmsPerTankG ?? 2.79),
      unit: 'g',
      purpose: 'تثبیت سولفیت مولکولی و محافظت در برابر شوک اکسیژن بطری‌گذاری'
    },

    // 2. Enzymes & Fining (enzyme_fining)
    {
      id: 'pectic-enzyme',
      category: 'enzyme_fining',
      categoryLabelFa: '۲. آنزیم‌ها و شفاف‌کننده‌ها (Enzymes & Fining)',
      labelFa: isRose
        ? `آنزیم پکتولیتیک شفاف‌سازی رُزه (${d.pecticEnzymeRoseG}g در ${v.saigneeTotalL}L)`
        : `آنزیم پکتولیتیک استخراج رنگ قرمز (${d.pecticEnzymeRedPerTankG}g در ${v.redLiquidFermentPerTankL}L)`,
      compoundName: 'پودر آنزیم پکتولیتیک (Lallzyme EX-V / C-Max)',
      stageTitle: isRose
        ? 'گام ۹: آنزیم‌دهی و Débourbage شیره رُزه (روز ۰)'
        : 'گام ۸: آنزیم‌دهی پکتولیتیک توده قرمز (روز ۰ - ۱۵ دقیقه پس از سولفیت)',
      amount: isRose ? (d.pecticEnzymeRoseG ?? 1.44) : (d.pecticEnzymeRedPerTankG ?? 7.26),
      unit: 'g',
      purpose: isRose
        ? 'شکستن کامل پکتین معلقه شیره رُزه جهت رسوب سریع لرد پیش از تخمیر'
        : 'هیدرولیز دیواره سلولی پوست ضخیم انگور رشه و آزادسازی آنتوسیانین‌ها و تانن‌های پلی‌مری'
    },
    {
      id: 'bentonite-rose',
      category: 'enzyme_fining',
      categoryLabelFa: '۲. آنزیم‌ها و شفاف‌کننده‌ها (Enzymes & Fining)',
      labelFa: `بنتونیت فعال‌شده شفاف‌سازی رُزه (${d.bentoniteRoseG}g در ${v.saigneeTotalL}L)`,
      compoundName: 'بنتونیت سدیمی/کلسیمی فعال‌شده (شفاف‌سازی رُزه)',
      pubchemCid: 24844,
      stageTitle: 'گام ۹: تزریق دوغاب بنتونیت ۲ ساعت پس از آنزیم پکتیک رُزه',
      amount: d.bentoniteRoseG ?? 7.2,
      unit: 'g',
      purpose: 'جذب الکترواستاتیک پروتئین‌های ناپایدار حساس به گرما و شفاف‌سازی کریستالی شیره رُزه'
    },

    // 3. Tannins & Acid/Base (tannin_acid)
    {
      id: 'white-tannin',
      category: 'tannin_acid',
      categoryLabelFa: '۳. تانن‌ها و تنظیم‌کننده‌های اسیدیته (Tannins & Acid/Base)',
      labelFa: isRose
        ? `تانن سفید گالیک تخمیر رُزه (${d.whiteTanninRoseFermentG}g در ${v.roseClarifiedFermentL}L)`
        : `تانن سفید گالیک فاز ۱ قرمز (${d.whiteTanninRedPhase1PerTankG}g در ${v.redLiquidFermentPerTankL}L)`,
      compoundName: 'تانن شراب سفید گالیک (حفاظت آنتی‌اکسیدانی)',
      pubchemCid: 16129778,
      stageTitle: isRose
        ? 'گام ۳۰: آماده‌سازی شیره رُزه شفاف‌شده پیش از تلقیح'
        : 'گام ۱۱: تزریق تانن‌های فاز ۱ پس از منفی شدن تست الکل پکتین',
      amount: isRose ? (d.whiteTanninRoseFermentG ?? 1.12) : (d.whiteTanninRedPhase1PerTankG ?? 3.96),
      unit: 'g',
      purpose: 'مهار آنزیم‌های اکسیداتیو لاکاز/تیروزیناز و حذف پروتئین‌های آزاد قبل از شروع تخمیر'
    },
    {
      id: 'red-tannin-p1',
      category: 'tannin_acid',
      categoryLabelFa: '۳. تانن‌ها و تنظیم‌کننده‌های اسیدیته (Tannins & Acid/Base)',
      labelFa: `تانن مخصوص شراب قرمز - فاز ۱ (${d.redTanninPhase1PerTankG}g در ${v.redLiquidFermentPerTankL}L)`,
      compoundName: 'تانن مخصوص شراب قرمز - فاز ۱ (تثبیت اولیه رنگ)',
      stageTitle: 'گام ۱۱: تزریق تانن فاز ۱ پس از استراحت آنزیم پکتیک (روز ۰)',
      amount: d.redTanninPhase1PerTankG ?? 13.2,
      unit: 'g',
      purpose: 'کُو-پیگمانتاسیون اولیه با آنتوسیانین‌های تازه استخراج‌شده پوست رشه'
    },
    {
      id: 'red-tannin-p2',
      category: 'tannin_acid',
      categoryLabelFa: '۳. تانن‌ها و تنظیم‌کننده‌های اسیدیته (Tannins & Acid/Base)',
      labelFa: `تانن مخصوص شراب قرمز - فاز ۲ (${d.redTanninPhase2PerTankG}g در SG ${t.phase2Tannin.toFixed(3)})`,
      compoundName: `تانن مخصوص شراب قرمز - فاز ۲ (در SG ${t.phase2Tannin.toFixed(3)})`,
      stageTitle: `گام ۱۸: تریگر رنگ فاز ۲ و جمع‌آوری هسته (SG = ${t.phase2Tannin.toFixed(3)})`,
      amount: d.redTanninPhase2PerTankG ?? 13.2,
      unit: 'g',
      purpose: 'پل‌زنی اتانولی و تثبیت کووالانسی رنگ یاقوتی تیره در حضور الکل نوظهور'
    },
    {
      id: 'tartaric-acid',
      category: 'tannin_acid',
      categoryLabelFa: '۳. تانن‌ها و تنظیم‌کننده‌های اسیدیته (Tannins & Acid/Base)',
      labelFa: isRose
        ? `اسید تارتاریک خوراکی L(+) رُزه (~60g — قفل pH روی ${p.targetRosePH})`
        : `اسید تارتاریک خوراکی L(+) قرمز (~180g — قفل pH روی ${p.targetRedPH})`,
      compoundName: 'اسید تارتاریک خوراکی L(+) (قفل pH طبق تست ۳ لیوانی)',
      pubchemCid: 444305,
      stageTitle: isRose
        ? 'گام ۳۰: قفل اسیدیته و pH شیره رُزه'
        : 'گام ۱۲: تست ۳ لیوانی و قفل pH شیره قرمز پیش از تلقیح مخمر',
      amount: isRose ? 60 : 180,
      unit: 'g',
      purpose: isRose
        ? `تنظیم pH شیره رُزه روی ${p.targetRosePH} جهت طراوت اسیدی و حداکثر کارایی سولفیت مولکولی`
        : `تنظیم pH شیره قرمز روی ${p.targetRedPH} با رعایت سقف اسیدیته کل (TA ≤ 7.2 g/L)`
    },
    {
      id: 'khco3',
      category: 'tannin_acid',
      categoryLabelFa: '۳. تانن‌ها و تنظیم‌کننده‌های اسیدیته (Tannins & Acid/Base)',
      labelFa: isRose
        ? 'بی‌کربنات پتاسیم KHCO₃ اسیدزدایی رُزه (~16g)'
        : 'بی‌کربنات پتاسیم KHCO₃ اسیدزدایی قرمز (~66g)',
      compoundName: 'بی‌کربنات پتاسیم KHCO₃ (اسیدزدایی در سرما)',
      pubchemCid: 516893,
      stageTitle: 'گام ۳۷: اصلاح اسیدیته کل (TA) پیش از سرمازدایی تارتارات',
      amount: isRose ? 16 : 66,
      unit: 'g',
      purpose: 'کاهش استوکیومتریک اسید تارتاریک مازاد و رسوب بی‌تارتارات پتاسیم (KHT) در سرما'
    },

    // 4. Yeast & Staged Nutrients (yeast_nutrient)
    {
      id: 'go-ferm',
      category: 'yeast_nutrient',
      categoryLabelFa: '۴. مخمر و تغذیه مرحله‌ای نیتروژن (Yeast & SNA)',
      labelFa: isRose
        ? `ریزمغذی بیدارسازی Go-Ferm رُزه (${d.goFermRoseG}g در ۴۳°C)`
        : `ریزمغذی بیدارسازی Go-Ferm قرمز (${d.goFermRedPerTankG}g در ۴۳°C)`,
      compoundName: 'ریزمغذی بیدارسازی مخمر Go-Ferm Protect',
      stageTitle: isRose
        ? 'گام ۳۱: بیدارسازی و آب‌دهی مخمر شراب رُزه'
        : 'گام ۱۳: بیدارسازی مخمر در آب ۴۳°C و هم‌دمایی پله‌ای (روز ۰)',
      amount: isRose ? (d.goFermRoseG ?? 9.6) : (d.goFermRedPerTankG ?? 39.6),
      unit: 'g',
      purpose: 'غنی‌سازی غشای سلولی مخمر با استرول‌ها، اسیدهای چرب غیراشباع و ویتامین‌های حیاتی در آب‌دهی'
    },
    {
      id: 'yeast-rc212',
      category: 'yeast_nutrient',
      categoryLabelFa: '۴. مخمر و تغذیه مرحله‌ای نیتروژن (Yeast & SNA)',
      labelFa: isRose
        ? `مخمر Lalvin RC-212 / D47 شراب رُزه (${d.yeastRoseG}g در ${v.roseClarifiedFermentL}L)`
        : `مخمر Lalvin Bourgovin RC-212 قرمز (${d.yeastRedPerTankG}g در ${v.redLiquidFermentPerTankL}L)`,
      compoundName: 'مخمر ساکارومایسس سرویزیه Lalvin Bourgovin RC-212',
      stageTitle: isRose
        ? 'گام ۳۱: تلقیح مخمر شراب رُزه پس از هم‌دمایی'
        : 'گام ۱۴: تلقیح نهایی مخمر پس از هم‌دمایی ۳ مرحله‌ای با شیره (روز ۰)',
      amount: isRose ? (d.yeastRoseG ?? 8.0) : (d.yeastRedPerTankG ?? 33.0),
      unit: 'g',
      purpose: 'تلقیح جمعیت غالب مخمر (25 g/hL) جهت تخمیر کامل، استخراج پلی‌فنول و حفظ عطر میوه‌ای رشه'
    },
    {
      id: 'fermaid-o-sna1',
      category: 'yeast_nutrient',
      categoryLabelFa: '۴. مخمر و تغذیه مرحله‌ای نیتروژن (Yeast & SNA)',
      labelFa: isRose
        ? `مغذی ارگانیک Fermaid O — تریگر SNA-1 رُزه (${d.fermaidO1RoseG}g در SG ${t.sna1.toFixed(3)})`
        : `مغذی ارگانیک Fermaid O — تریگر SNA-1 قرمز (${d.fermaidO1RedPerTankG}g در SG ${t.sna1.toFixed(3)})`,
      compoundName: `مغذی ارگانیک Fermaid O (تریگر SNA-1 در SG ${t.sna1.toFixed(3)})`,
      stageTitle: isRose
        ? `گام ۳۲: تغذیه مرحله اول رُزه (SNA-1 در SG = ${t.sna1.toFixed(3)})`
        : `گام ۱۶: تریگر اول تغذیه SNA-1 پس از افت ۱۰٪ قند (SG = ${t.sna1.toFixed(3)})`,
      amount: isRose ? (d.fermaidO1RoseG ?? 6.4) : (d.fermaidO1RedPerTankG ?? 33.0),
      unit: 'g',
      purpose: 'تامین اسیدهای آمینه آلی (α-amino nitrogen) بدون ایجاد پیک حرارتی ناگهانی در شروع لگاریتمی تخمیر'
    },
    {
      id: 'fermaid-k-sna2',
      category: 'yeast_nutrient',
      categoryLabelFa: '۴. مخمر و تغذیه مرحله‌ای نیتروژن (Yeast & SNA)',
      labelFa: isRose
        ? `مغذی کمپلکس Fermaid K — تریگر SNA-2 رُزه (${d.fermaidK2RoseG}g در SG ${t.sna2.toFixed(3)})`
        : `مغذی کمپلکس Fermaid K — تریگر SNA-2 قرمز (${d.fermaidK2RedPerTankG}g در SG ${t.sna2.toFixed(3)})`,
      compoundName: `مغذی کمپلکس Fermaid K (تریگر SNA-2 در SG ${t.sna2.toFixed(3)})`,
      stageTitle: isRose
        ? `گام ۳۲: تغذیه مرحله دوم رُزه (SNA-2 در SG = ${t.sna2.toFixed(3)})`
        : `گام ۱۷: تریگر دوم تغذیه SNA-2 در افت ۲۵٪ قند (SG = ${t.sna2.toFixed(3)})`,
      amount: isRose ? (d.fermaidK2RoseG ?? 5.76) : (d.fermaidK2RedPerTankG ?? 33.0),
      unit: 'g',
      purpose: 'تامین تیامین، پانتوتنات، بیوتین، منیزیم و نیتروژن مختلط در اوج تکثیر بیومس مخمر'
    },
    {
      id: 'dap-sna2',
      category: 'yeast_nutrient',
      categoryLabelFa: '۴. مخمر و تغذیه مرحله‌ای نیتروژن (Yeast & SNA)',
      labelFa: isRose
        ? `دی‌آمونیوم فسفات DAP — تریگر SNA-2 رُزه (${d.dap2RoseG}g در SG ${t.sna2.toFixed(3)})`
        : `دی‌آمونیوم فسفات DAP — تریگر SNA-2 قرمز (${d.dap2RedPerTankG}g در SG ${t.sna2.toFixed(3)})`,
      compoundName: `دی‌آمونیوم فسفات DAP (تریگر SNA-2 در SG ${t.sna2.toFixed(3)})`,
      pubchemCid: 24261,
      stageTitle: isRose
        ? `گام ۳۲: تغذیه مرحله دوم رُزه (SNA-2 در SG = ${t.sna2.toFixed(3)})`
        : `گام ۱۷: تریگر دوم تغذیه SNA-2 در افت ۲۵٪ قند (SG = ${t.sna2.toFixed(3)})`,
      amount: isRose ? (d.dap2RoseG ?? 3.2) : (d.dap2RedPerTankG ?? 19.8),
      unit: 'g',
      purpose: `تامین یون آمونیوم و فسفات معدنی پیش از سقف مطلق ۱/۳ قند (SG ≥ ${t.oneThirdCeiling.toFixed(3)}) و مهار تولید H₂S`
    },
    {
      id: 'zinc-nutrient',
      category: 'yeast_nutrient',
      categoryLabelFa: '۴. مخمر و تغذیه مرحله‌ای نیتروژن (Yeast & SNA)',
      labelFa: isRose
        ? `مکمل روی مخمر (ZnSO₄ / Wyeast) — SNA-1 رُزه (${d.zincRoseG}g)`
        : `مکمل روی مخمر (ZnSO₄ / Wyeast) — SNA-2 قرمز (${d.zincRedPerTankG}g)`,
      compoundName: 'مکمل روی مخمر (Wyeast Nutrient / ZnSO₄·7H₂O)',
      pubchemCid: 24424,
      stageTitle: isRose
        ? `گام ۳۲: جبران روی جذب‌شده توسط بنتونیت در رُزه (SG = ${t.sna1.toFixed(3)})`
        : `گام ۱۷: تزریق کوآنزیم روی همزمان با SNA-2 قرمز (SG = ${t.sna2.toFixed(3)})`,
      amount: isRose ? (d.zincRoseG ?? 0.06) : (d.zincRedPerTankG ?? 0.26),
      unit: 'g',
      purpose: 'تامین کاتیون کاتالیتیک Zn²⁺ برای فعال‌سازی آنزیم الکل دهیدروژناز و جلوگیری از توقف تخمیر در الکل بالا'
    },
    {
      id: 'fermaid-o-sna3',
      category: 'yeast_nutrient',
      categoryLabelFa: '۴. مخمر و تغذیه مرحله‌ای نیتروژن (Yeast & SNA)',
      labelFa: isRose
        ? `مغذی ۱۰۰٪ ارگانیک Fermaid O — تریگر SNA-3 رُزه (${d.fermaidO3RoseG}g در SG ${t.sna3.toFixed(3)})`
        : `مغذی ۱۰۰٪ ارگانیک Fermaid O — تریگر SNA-3 قرمز (${d.fermaidO3RedPerTankG}g در SG ${t.sna3.toFixed(3)})`,
      compoundName: `مغذی ۱۰۰٪ ارگانیک Fermaid O (تریگر نهایی SNA-3 در SG ${t.sna3.toFixed(3)})`,
      stageTitle: isRose
        ? `گام ۳۲: تغذیه پایانی SNA-3 رُزه (SG = ${t.sna3.toFixed(3)})`
        : `گام ۱۹: تریگر نهایی تغذیه SNA-3 در نیمه قند (SG = ${t.sna3.toFixed(3)} — 0g DAP)`,
      amount: isRose ? (d.fermaidO3RoseG ?? 7.36) : (d.fermaidO3RedPerTankG ?? 39.6),
      unit: 'g',
      purpose: 'سوخت استقامت نیمه دوم تخمیر با ۱۰۰٪ پپتید و اسید آمینه ارگانیک قابل جذب در حضور الکل (بدون ریسک اتیل کاربامات)'
    },

    // 5. Stabilization & Finishing (stabilization_finishing)
    {
      id: 'bactiless',
      category: 'stabilization_finishing',
      categoryLabelFa: '۵. پایدارسازی، اصلاح بو و فینیشینگ (Stabilization & Finishing)',
      labelFa: isRose
        ? `زیست‌پلیمر کیتوزان Bactiless رُزه (${d.bactilessRoseG}g در ${v.rosePostRackingL}L)`
        : `زیست‌پلیمر کیتوزان Bactiless قرمز (${d.bactilessRedPerTankG}g در ${v.rack1PerTankL}L)`,
      compoundName: 'زیست‌پلیمر کیتوزان Bactiless (حذف باکتری اسید لاکتیک و قفل MLF)',
      pubchemCid: 71853,
      stageTitle: isRose
        ? 'گام ۳۳: قفل میکروبی پس از تخمیر شراب رُزه'
        : 'گام ۲۷: قفل بیولوژیکی روز ۱۱ پس از سیفون دُرد سنگین',
      amount: isRose ? (d.bactilessRoseG ?? 7.5) : (d.bactilessRedPerTankG ?? 28.8),
      unit: 'g',
      purpose: 'تخریب دیواره سلولی باکتری‌های Oenococcus / Lactobacillus و برتانومایسس جهت حفظ کامل اسید مالیک طبیعی'
    },
    {
      id: 'cuso4-stock2',
      category: 'stabilization_finishing',
      categoryLabelFa: '۵. پایدارسازی، اصلاح بو و فینیشینگ (Stabilization & Finishing)',
      labelFa: isRose
        ? `محلول استوک ۲ سولفات مس ۰.۱٪ رُزه (${Math.round(v.rosePostRackingL * 0.25 * 10) / 10} mL — معادل 0.25 mg/L)`
        : `محلول استوک ۲ سولفات مس ۰.۱٪ قرمز (${Math.round(v.rack1PerTankL * 0.25 * 10) / 10} mL — معادل 0.25 mg/L)`,
      compoundName: 'محلول استوک ۲ سولفات مس ۵ آبی ۰.۱٪ (حذف H₂S)',
      pubchemCid: 24463,
      stageTitle: 'گام ۲۶: اصلاح بوی گوگرد و H₂S بر اساس تست ۵ لیوانی (روز ۱۰)',
      amount: isRose
        ? Math.round(v.rosePostRackingL * 0.25 * 10) / 10
        : Math.round(v.rack1PerTankL * 0.25 * 10) / 10,
      unit: 'mL',
      purpose: 'واکنش استوکیومتریک یون مس با سولفید هیدروژن فرار و رسوب به صورت CuS نامحلول پیش از سیفون باکتیلس'
    },
    {
      id: 'finishing-tannin',
      category: 'stabilization_finishing',
      categoryLabelFa: '۵. پایدارسازی، اصلاح بو و فینیشینگ (Stabilization & Finishing)',
      labelFa: isRose
        ? `تانن سفید فینیشینگ رُزه (${d.whiteTanninRoseFinishingG}g در روز ۶۰)`
        : `تانن فینیشینگ بلوط/انگور قرمز (${d.redTanninFinishingPerTankG}g در روز ۶۰)`,
      compoundName: 'تانن فینیشینگ بلوط/انگور (روز ۶۰ پیش از سرمازدایی)',
      stageTitle: 'گام ۳۶: تزریق تانن فینیشینگ ۲ هفته پیش از سرمازدایی (روز ۶۰)',
      amount: isRose ? (d.whiteTanninRoseFinishingG ?? 0.44) : (d.redTanninFinishingPerTankG ?? 2.33),
      unit: 'g',
      purpose: 'گرد کردن ساختار تاننی، افزایش پتانسیل کهنه‌سازی و کمک به رسوب کلوئیدهای ناپایدار در سرما'
    },
    {
      id: 'kht-seeding',
      category: 'stabilization_finishing',
      categoryLabelFa: '۵. پایدارسازی، اصلاح بو و فینیشینگ (Stabilization & Finishing)',
      labelFa: isRose
        ? `کریستال کرم تارتار KHT بذرپاشی رُزه (${d.khtColdStabRoseG}g در +1°C)`
        : `کریستال کرم تارتار KHT بذرپاشی قرمز (${d.khtColdStabRedPerTankG}g در +1°C)`,
      compoundName: 'کریستال کرم تارتار KHT (بذرپاشی سرمازدایی در +1°C)',
      pubchemCid: 23666341,
      stageTitle: 'گام ۳۷: بذرپاشی تماسی (Contact Seeding) در شروع سرمازدایی (روز ۶۵)',
      amount: isRose ? (d.khtColdStabRoseG ?? 6.0) : (d.khtColdStabRedPerTankG ?? 18.6),
      unit: 'g',
      purpose: 'ایجاد هسته‌های بلوری اولیه جهت تسریع رسوب بی‌تارتارات پتاسیم فوق‌اشباع در دمای ۰ تا +۲ درجه'
    },
    {
      id: 'glycerin',
      category: 'stabilization_finishing',
      categoryLabelFa: '۵. پایدارسازی، اصلاح بو و فینیشینگ (Stabilization & Finishing)',
      labelFa: isRose
        ? `گلیسیرین گیاهی خوراکی رُزه (حداکثر ${d.glycerinRoseMaxG}g در ${v.roseFinalBottlingL}L)`
        : `گلیسیرین گیاهی خوراکی قرمز (حداکثر ${d.glycerinRedMaxPerTankG}g در ${v.finalRedPerTankL}L)`,
      compoundName: 'گلیسیرین گیاهی خوراکی USP (نرم‌سازی حس دهانی روز ۸۵)',
      pubchemCid: 753,
      stageTitle: 'گام ۳۹: تست آمیزه و نرم‌سازی حس دهانی با گلیسیرین (روز ۸۵)',
      amount: isRose ? (d.glycerinRoseMaxG ?? 43.5) : (d.glycerinRedMaxPerTankG ?? 325.5),
      unit: 'g',
      purpose: 'افزایش ویسکوزیته حسی، گرد کردن تیزی اسیدیته و تانن بدون ایجاد شیرینی تخمیرپذیر'
    },
    {
      id: 'ascorbic-acid',
      category: 'stabilization_finishing',
      categoryLabelFa: '۵. پایدارسازی، اصلاح بو و فینیشینگ (Stabilization & Finishing)',
      labelFa: isRose
        ? `ال-اسید اسکوربیک / ویتامین C رُزه (${d.ascorbicRoseG}g — ۳۰ دقیقه قبل بطری)`
        : `ال-اسید اسکوربیک / ویتامین C قرمز (${d.ascorbicRedPerTankG}g — ۳۰ دقیقه قبل بطری)`,
      compoundName: 'ال-اسید اسکوربیک / ویتامین C (اکسیژن‌زدایی ۳۰ دقیقه قبل بطری)',
      pubchemCid: 54670067,
      stageTitle: 'گام ۴۲: اکسیژن‌زدایی فوری ۳۰ دقیقه پیش از بطری‌گذاری (روز ۱۰۰)',
      amount: isRose ? (d.ascorbicRoseG ?? 1.16) : (d.ascorbicRedPerTankG ?? 3.72),
      unit: 'g',
      purpose: 'مصرف سریع اکسیژن محلول (DO) حین پر کردن بطری در حضور حداقل 35 mg/L سولفیت آزاد'
    }
  ];
}

export function getSmartDailyStagePresets(
  plan: DynamicProtocolPlan,
  tankId: TankId
): DailyStagePresetItem[] {
  const isRose = tankId === 'tank-rose';
  const t = plan.triggers;
  const p = plan.params;
  const d = plan.dosages;
  const targetPH = isRose ? p.targetRosePH : p.targetRedPH;

  return [
    {
      id: 'day0-crush',
      labelFa: `روز ۰ — کراش، سولفیت اول و قفل pH (SG₀ = ${t.initialSG.toFixed(3)} / ${p.initialBrix}°Bx)`,
      dayNumber: 0,
      stageTitle: isRose
        ? 'روز ۰: خون‌گیری سانیه رُزه، آنزیم‌پاشی و شفاف‌سازی سرد'
        : 'روز ۰: کراش، سولفیت اول، سانیه، آنزیم پکتیک و قفل pH',
      sg: t.initialSG,
      brix: p.initialBrix,
      tempCap: isRose ? 14.0 : 19.0,
      tempRoom: 20.0,
      ph: targetPH,
      ta: isRose ? 7.0 : 6.6,
      freeSO2: p.crushSO2TargetMgL,
      pigeageDone: !isRose,
      pigeageCount: isRose ? 0 : 2,
      note: isRose
        ? `برداشت ${plan.volumes.saigneeTotalL}L شیره رُزه در بستر یخ خشک + تزریق ${d.pecticEnzymeRoseG}g آنزیم پکتیک و ${d.bentoniteRoseG}g بنتونیت.`
        : `تزریق ${d.crushKmsPerTankG}g KMS اول + پس از سانیه ${d.postSaigneeKmsPerTankG}g KMS و ${d.pecticEnzymeRedPerTankG}g آنزیم پکتیک + قفل pH روی ${targetPH}.`,
      isTrigger: false
    },
    {
      id: 'day1-inoculation',
      labelFa: `روز ۱ — تلقیح مخمر و پایان فاز تأخیر (SG = ${t.initialSG.toFixed(3)})`,
      dayNumber: 1,
      stageTitle: 'روز ۱: تلقیح مخمر با Go-Ferm و تشکیل کلاهک اولیه',
      sg: Math.round((t.initialSG - 0.002) * 1000) / 1000,
      brix: specificGravityToBrix(Math.round((t.initialSG - 0.002) * 1000) / 1000),
      tempCap: isRose ? 16.5 : 22.0,
      tempRoom: isRose ? 16.0 : 21.0,
      ph: targetPH,
      ta: isRose ? 7.0 : 6.8,
      pigeageDone: !isRose,
      pigeageCount: isRose ? 0 : 3,
      note: isRose
        ? `تلقیح ${d.yeastRoseG}g مخمر با ${d.goFermRoseG}g Go-Ferm در شیره رُزه شفاف‌شده (${plan.volumes.roseClarifiedFermentL}L).`
        : `تلقیح ${d.yeastRedPerTankG}g مخمر RC-212 بیدارشده در ${d.goFermRedPerTankG}g Go-Ferm؛ شروع تولید CO₂ و بالا آمدن کلاهک.`,
      isTrigger: false
    },
    {
      id: 'day2-sna1',
      labelFa: `روز ۲ — تریگر اول تغذیه SNA-1 (افت ۱۰٪ قند — SG = ${t.sna1.toFixed(3)})`,
      dayNumber: 2,
      stageTitle: `روز ۲: تریگر اول تغذیه (SNA-1 در SG ${t.sna1.toFixed(3)})`,
      sg: t.sna1,
      brix: specificGravityToBrix(t.sna1),
      tempCap: isRose ? 17.0 : 24.5,
      tempRoom: isRose ? 16.5 : 21.5,
      ph: targetPH,
      ta: isRose ? 7.1 : 6.8,
      pigeageDone: !isRose,
      pigeageCount: isRose ? 0 : 3,
      note: isRose
        ? `تزریق ${d.fermaidO1RoseG}g Fermaid O + ${d.zincRoseG}g مکمل روی در SG = ${t.sna1.toFixed(3)}.`
        : `تزریق ${d.fermaidO1RedPerTankG}g Fermaid O حل‌شده در آب ولرم پس از گاززدایی کلاهک در SG = ${t.sna1.toFixed(3)}.`,
      isTrigger: true
    },
    {
      id: 'day3-sna2',
      labelFa: `روز ۳ — تریگر دوم تغذیه SNA-2 (افت ۲۵٪ قند — SG = ${t.sna2.toFixed(3)})`,
      dayNumber: 3,
      stageTitle: `روز ۳: تریگر دوم تغذیه (SNA-2 در SG ${t.sna2.toFixed(3)})`,
      sg: t.sna2,
      brix: specificGravityToBrix(t.sna2),
      tempCap: isRose ? 17.5 : 26.8,
      tempRoom: isRose ? 16.5 : 22.0,
      ph: targetPH,
      ta: isRose ? 7.1 : 6.9,
      pigeageDone: !isRose,
      pigeageCount: isRose ? 0 : 4,
      note: isRose
        ? `تزریق ${d.fermaidK2RoseG}g Fermaid K + ${d.dap2RoseG}g DAP در اوج تکثیر مخمر رُزه.`
        : `تزریق ${d.fermaidK2RedPerTankG}g Fermaid K + ${d.dap2RedPerTankG}g DAP + ${d.zincRedPerTankG}g روی پیش از سقف ۱/۳ قند (${t.oneThirdCeiling.toFixed(3)}).`,
      isTrigger: true
    },
    {
      id: 'day4-tannin2',
      labelFa: `روز ۴ صبح — تریگر تانن فاز ۲ و جمع‌آوری هسته (SG = ${t.phase2Tannin.toFixed(3)})`,
      dayNumber: 4,
      stageTitle: `روز ۴: تریگر تانن فاز ۲ و جمع‌آوری هسته (SG ${t.phase2Tannin.toFixed(3)})`,
      sg: t.phase2Tannin,
      brix: specificGravityToBrix(t.phase2Tannin),
      tempCap: isRose ? 17.5 : 27.2,
      tempRoom: isRose ? 16.5 : 21.5,
      ph: Math.round((targetPH + 0.02) * 100) / 100,
      ta: isRose ? 7.0 : 6.8,
      pigeageDone: !isRose,
      pigeageCount: isRose ? 0 : 3,
      note: `تزریق ${d.redTanninPhase2PerTankG}g تانن قرمز فاز ۲ جهت تثبیت کووالانسی رنگ + خارج‌سازی هسته‌های ته‌نشین‌شده کف مخزن.`,
      isTrigger: true
    },
    {
      id: 'day4-sna3',
      labelFa: `روز ۴ عصر — تریگر نهایی تغذیه SNA-3 ۱۰۰٪ ارگانیک (SG = ${t.sna3.toFixed(3)})`,
      dayNumber: 4,
      stageTitle: `روز ۴ عصر: تریگر نهایی SNA-3 ۱۰۰٪ ارگانیک (SG ${t.sna3.toFixed(3)})`,
      sg: t.sna3,
      brix: specificGravityToBrix(t.sna3),
      tempCap: isRose ? 17.2 : 26.5,
      tempRoom: isRose ? 16.5 : 21.5,
      ph: Math.round((targetPH + 0.03) * 100) / 100,
      ta: isRose ? 7.0 : 6.8,
      pigeageDone: !isRose,
      pigeageCount: isRose ? 0 : 3,
      note: isRose
        ? `تزریق پایانی ${d.fermaidO3RoseG}g Fermaid O ۱۰۰٪ ارگانیک (0g DAP / Fermaid K).`
        : `تزریق پایانی ${d.fermaidO3RedPerTankG}g Fermaid O ۱۰۰٪ ارگانیک (ممنوعیت مطلق نیتروژن معدنی DAP).`,
      isTrigger: true
    },
    {
      id: 'day6-pressing',
      labelFa: `روز ۶ — نقطه طلایی پرسینگ و تفکیک آب‌آزاد (SG = ${t.pressingSG.toFixed(3)})`,
      dayNumber: 6,
      stageTitle: `روز ۶: نقطه طلایی پرسینگ و جداسازی پوست (SG ${t.pressingSG.toFixed(3)})`,
      sg: t.pressingSG,
      brix: specificGravityToBrix(t.pressingSG),
      tempCap: isRose ? 16.8 : 22.0,
      tempRoom: isRose ? 16.5 : 21.0,
      ph: Math.round((targetPH + 0.04) * 100) / 100,
      ta: isRose ? 6.9 : 6.7,
      pigeageDone: false,
      pigeageCount: 0,
      note: `توقف کامل غوطه‌ورسازی، خنک‌سازی به 22°C و تفکیک ${plan.volumes.freeRunPerTankL}L شراب آب‌آزاد (Free-Run) از ${plan.volumes.heavyPressPerTankL}L پرس سنگین زیر قفل هوا.`,
      isTrigger: true
    },
    {
      id: 'day9-dryness',
      labelFa: `روز ۹ — پایان تخمیر الکلی و خشکی کامل (SG = ${isRose ? '0.991' : '0.993'})`,
      dayNumber: 9,
      stageTitle: 'روز ۹: پایان تخمیر الکلی، ثبات ۴۸ ساعته SG و تایید Clinitest',
      sg: isRose ? 0.991 : 0.993,
      brix: 0,
      tempCap: isRose ? 16.0 : 21.0,
      tempRoom: isRose ? 16.0 : 20.5,
      ph: Math.round((targetPH + 0.04) * 100) / 100,
      ta: isRose ? 6.9 : 6.6,
      pigeageDone: false,
      pigeageCount: 0,
      note: 'ثبات کامل وزن مخصوص طی ۴۸ ساعت متوالی؛ تایید قند احیاکننده زیر 2 g/L با قرص Clinitest و شروع خنک‌سازی ۱۵°C جهت رسوب دُرد سنگین.',
      isTrigger: true
    },
    {
      id: 'day11-stabilize',
      labelFa: 'روز ۱۱ — سیفون دُرد سنگین و قفل بیولوژیکی (Bactiless + KMS)',
      dayNumber: 11,
      stageTitle: 'روز ۱۱: سیفون اول از روی دُرد سنگین و قفل بیولوژیکی MLF',
      sg: isRose ? 0.991 : 0.993,
      brix: 0,
      tempCap: 15.5,
      tempRoom: 15.5,
      ph: Math.round((targetPH + 0.04) * 100) / 100,
      ta: isRose ? 6.8 : 6.6,
      freeSO2: 38,
      pigeageDone: false,
      pigeageCount: 0,
      note: isRose
        ? `سیفون رُزه (${plan.volumes.rosePostRackingL}L) + تزریق ${d.bactilessRoseG}g باکتیلس و ${d.rosePostFermKmsG}g KMS.`
        : `سیفون دُرد سنگین (${plan.volumes.rack1PerTankL}L صاف) + تزریق ${d.bactilessRedPerTankG}g باکتیلس و ${d.day11KmsPerTankG}g KMS برای قفل کامل اسید مالیک.`,
      isTrigger: false
    }
  ];
}

export function getSmartLabPresets(
  plan: DynamicProtocolPlan,
  tankId: TankId
): LabAnalysisPresetItem[] {
  const isRose = tankId === 'tank-rose';
  const p = plan.params;
  const t = plan.triggers;
  const targetPH = isRose ? p.targetRosePH : p.targetRedPH;

  return [
    {
      id: 'lab-pectin',
      labelFa: '۱. تست الکل پکتین (Pectin Alcohol Test — گام ۱۰ روز ۰)',
      testType: 'sensory_eval',
      analyte: 'تست شکست پکتین با الکل ۹۶٪ (1:3)',
      defaultValue: 'منفی (شفاف بدون لخته ژله‌ای)',
      unit: 'Qualitative',
      actionTaken: 'تایید عملکرد کامل آنزیم پکتولیتیک؛ مجوز تزریق تانن‌های فاز ۱ صادر شد',
      notes: 'مخلوط ۵ میلی‌لیتر آب‌انگور صاف‌شده با ۱۵ میلی‌لیتر اتانول ۹۶٪ و بررسی عدم تشکیل رشته ژله‌ای پس از ۵ دقیقه'
    },
    {
      id: 'lab-ph-lock',
      labelFa: `۲. قرائت الکترود pH و تست ۳ لیوانی اسید تارتاریک (هدف ${targetPH})`,
      testType: 'ph_meter',
      analyte: 'شاخص pH پس از ۱ ساعت تعادل یونی تست ۳ لیوانی',
      defaultValue: String(targetPH),
      unit: 'pH (20°C)',
      actionTaken: `قفل دقیق pH روی ${targetPH} با تزریق دوز منتخب اسید تارتاریک L(+) پیش از تلقیح مخمر`,
      notes: 'کالیبراسیون دو نقطه‌ای الکترود در بافرهای استاندارد 4.01 و 7.00 در دمای ۲۰ درجه سانتی‌گراد'
    },
    {
      id: 'lab-ta-titration',
      labelFa: '۳. تیتراسیون اسیدیته کل (TA) با سود 0.1N تا pH = 8.2',
      testType: 'ta_titration',
      analyte: 'اسیدیته کل قابل تیتراسیون (TA بر حسب اسید تارتاریک)',
      defaultValue: isRose ? '7.0' : '6.8',
      unit: 'g/L Tartaric',
      actionTaken: 'در بازه طلایی توازن حسی (6.2 تا 7.2 g/L)؛ عدم نیاز به اسیدزدایی KHCO₃',
      notes: 'گاززدایی کامل نمونه از CO₂ و تیتراسیون ۵ میلی‌لیتر شراب با NaOH 0.1N تا نقطه پایانی pH = 8.20'
    },
    {
      id: 'lab-refractometer-sg',
      labelFa: `۴. کالیبراسیون دوگانه هیدرومتر و رفرکتومتر (SG₀ = ${t.initialSG.toFixed(3)} / ${p.initialBrix}°Bx)`,
      testType: 'refractometer_correction',
      analyte: 'بریکس اولیه و وزن مخصوص تصحیح‌شده دما (۲۰°C)',
      defaultValue: `${p.initialBrix} °Bx / SG ${t.initialSG.toFixed(3)}`,
      unit: '°Brix / SG',
      actionTaken: `ثبت نقطه مرجع SG₀ = ${t.initialSG.toFixed(3)} و محاسبه خودکار پنجره‌های تریگر SNA-1 تا پرسینگ`,
      notes: 'قرائت همزمان هیدرومتر شیشه‌ای و رفرکتومتر نوری پس از همگن‌سازی شیره'
    },
    {
      id: 'lab-clinitest',
      labelFa: '۵. تست قند احیاکننده باقی‌مانده (Clinitest < 2 g/L — گام ۲۴ روز ۹)',
      testType: 'refractometer_correction',
      analyte: 'قندهای احیاکننده تخمیرپذیر باقی‌مانده (RS - گلوکز/فروکتوز)',
      defaultValue: '1.2',
      unit: 'g/L (RS)',
      actionTaken: 'تایید خشکی بیولوژیکی کامل (< 2.0 g/L)؛ مجوز خنک‌سازی ۱۵ درجه و سیفون اول صادر شد',
      notes: 'رنگ آبی خالص در واکنش ۵ قطره شراب + ۱۰ قطره آب مقطر با قرص مس قلیایی Clinitest'
    },
    {
      id: 'lab-cuso4-bench',
      labelFa: '۶. تست ۵ لیوانی سولفات مس (تشخیص H₂S و مرکاپتان — گام ۲۶ روز ۱۰)',
      testType: 'ripper_so2',
      analyte: 'غربالگری حسی ترکیبات گوگردی فرار (H₂S vs Mercaptans)',
      defaultValue: 'پاک شدن کامل بو در لیوان ۰.۲۵ mg/L CuSO₄',
      unit: 'Bench Trial',
      actionTaken: `تزریق دوز هدفمند استوک ۲ سولفات مس ۰.۱٪ (${isRose ? '8.0' : '26.4'} mL) ۲۴ ساعت پیش از سیفون`,
      notes: 'مقایسه لیوان شاهد، لیوان‌های ۰.۱۵، ۰.۲۵ و ۰.۵۰ mg/L سولفات مس و لیوان اسید اسکوربیک + مس'
    },
    {
      id: 'lab-ripper-so2',
      labelFa: '۷. تیتراسیون یدومتری ریپر (Free SO₂ — روز ۱۱ و پیش از بطری)',
      testType: 'ripper_so2',
      analyte: 'سولفیت آزاد فعال (Free SO₂) و محاسبه سولفیت مولکولی',
      defaultValue: isRose ? '34' : '38',
      unit: 'mg/L (ppm)',
      actionTaken: `تامین سولفیت مولکولی ایمن در pH = ${targetPH}؛ حفاظت کامل در برابر اکسیداسیون و باکتری`,
      notes: 'تیتراسیون ۵۰ میلی‌لیتر نمونه اسیدی‌شده (H₂SO₄ 1+3) با ید 0.02N و معرف نشاسته تا ظهور رنگ آبی پایدار'
    },
    {
      id: 'lab-cold-stab-freezer',
      labelFa: '۸. تست پایداری تارتارات در فریزر (-4°C به مدت ۴ ساعت — گام ۳۸ روز ۸۰)',
      testType: 'mlf_chromatography',
      analyte: 'تست شوک انجماد پایداری بی‌تارتارات پتاسیم (KHT Stability)',
      defaultValue: 'پایدار (فاقد رسوب بلوری پس از بازگشت به ۲۰°C)',
      unit: 'Pass / Fail',
      actionTaken: 'تایید اتمام موفقیت‌آمیز سرمازدایی؛ مجوز سیفون سرد در دمای +1°C صادر شد',
      notes: 'نگهداری ۱۰۰ میلی‌لیتر نمونه صاف در -4°C به مدت ۴ ساعت و بررسی عدم تشکیل بلور شیشه‌ای در کف ظرف'
    }
  ];
}
