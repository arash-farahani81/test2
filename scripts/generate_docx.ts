import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  AlignmentType,
  WidthType,
  BorderStyle,
  Header,
  Footer,
  PageNumber,
} from 'docx';
import fs from 'fs';
import path from 'path';

const FONT_NAME = 'Vazirmatn';
const FALLBACK_FONT = 'B Nazanin';
const PRIMARY_COLOR = '881337'; // Deep Wine Burgundy
const SECONDARY_COLOR = '9F1239'; // Rich Wine
const DARK_NAVY = '0F172A'; // Dark Slate/Navy
const BORDER_COLOR = 'CBD5E1'; // Slate-300
const ALT_ROW_COLOR = 'F8FAFC'; // Slate-50
const HEADER_BG = '1E293B'; // Slate-800
const WARN_BG = 'FEF2F2'; // Rose-50
const SUCCESS_BG = 'F0FDF4'; // Emerald-50
const GOLD_BG = 'FEF3C7'; // Amber-100

function createParagraph(
  text: string,
  options: {
    bold?: boolean;
    size?: number;
    color?: string;
    align?: (typeof AlignmentType)[keyof typeof AlignmentType];
    spacingAfter?: number;
    spacingBefore?: number;
    bullet?: boolean;
    italic?: boolean;
  } = {}
): Paragraph {
  const {
    bold = false,
    size = 21,
    color = '1E293B',
    align = AlignmentType.RIGHT,
    spacingAfter = 90,
    spacingBefore = 0,
    bullet = false,
    italic = false,
  } = options;

  return new Paragraph({
    alignment: align,
    bidirectional: true,
    spacing: {
      after: spacingAfter,
      before: spacingBefore,
      line: 320,
    },
    bullet: bullet ? { level: 0 } : undefined,
    children: [
      new TextRun({
        text,
        bold,
        italics: italic,
        size,
        color,
        font: {
          name: FONT_NAME,
          ascii: FONT_NAME,
          hAnsi: FONT_NAME,
          cs: FALLBACK_FONT,
        },
      }),
    ],
  });
}

function createSectionHeading(title: string, badge?: string): Paragraph[] {
  const display = badge ? `[ ${badge} ]  ${title}` : title;
  return [
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      bidirectional: true,
      spacing: { before: 360, after: 140 },
      border: {
        bottom: {
          style: BorderStyle.SINGLE,
          size: 16,
          color: PRIMARY_COLOR,
        },
      },
      children: [
        new TextRun({
          text: display,
          bold: true,
          size: 26, // 13pt
          color: PRIMARY_COLOR,
          font: { name: FONT_NAME, cs: FALLBACK_FONT },
        }),
      ],
    }),
  ];
}

function createSubHeading(title: string): Paragraph {
  return new Paragraph({
    alignment: AlignmentType.RIGHT,
    bidirectional: true,
    spacing: { before: 220, after: 80 },
    children: [
      new TextRun({
        text: `◆ ${title}`,
        bold: true,
        size: 22, // 11pt
        color: DARK_NAVY,
        font: { name: FONT_NAME, cs: FALLBACK_FONT },
      }),
    ],
  });
}

function createCell(
  content: string | Paragraph[],
  options: {
    isHeader?: boolean;
    widthPercent?: number;
    align?: (typeof AlignmentType)[keyof typeof AlignmentType];
    bgColor?: string;
    bold?: boolean;
  } = {}
): TableCell {
  const {
    isHeader = false,
    widthPercent,
    align = isHeader ? AlignmentType.CENTER : AlignmentType.RIGHT,
    bgColor,
    bold = isHeader,
  } = options;

  let children: Paragraph[];
  if (typeof content === 'string') {
    children = [
      new Paragraph({
        alignment: align,
        bidirectional: true,
        children: [
          new TextRun({
            text: content,
            bold,
            size: isHeader ? 19 : 18,
            color: isHeader ? 'FFFFFF' : '0F172A',
            font: { name: FONT_NAME, cs: FALLBACK_FONT },
          }),
        ],
      }),
    ];
  } else {
    children = content;
  }

  const border = {
    style: BorderStyle.SINGLE,
    size: 4,
    color: BORDER_COLOR,
  };

  return new TableCell({
    width: widthPercent ? { size: widthPercent, type: WidthType.PERCENTAGE } : undefined,
    shading: {
      fill: bgColor || (isHeader ? HEADER_BG : 'FFFFFF'),
    },
    margins: {
      top: 100,
      bottom: 100,
      left: 140,
      right: 140,
    },
    borders: {
      top: border,
      bottom: border,
      left: border,
      right: border,
    },
    children,
  });
}

export async function buildCompleteMasterProtocolDocx(): Promise<Buffer> {
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1100,
              bottom: 1100,
              left: 1100,
              right: 1100,
            },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.BOTH,
                bidirectional: true,
                border: {
                  bottom: { style: BorderStyle.SINGLE, size: 6, color: BORDER_COLOR },
                },
                children: [
                  new TextRun({
                    text: 'مستر پروتکل جامع مهندسی انولوژی | انگور رشه سردشت (۴۰۰ کیلوگرم)  |  کد سند: SOP-OENO-1403-RS400',
                    size: 15,
                    color: '64748B',
                    font: { name: FONT_NAME, cs: FALLBACK_FONT },
                  }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                bidirectional: true,
                children: [
                  new TextRun({
                    text: 'صفحه ',
                    size: 15,
                    color: '94A3B8',
                    font: { name: FONT_NAME, cs: FALLBACK_FONT },
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    size: 15,
                    color: '94A3B8',
                    font: { name: FONT_NAME, cs: FALLBACK_FONT },
                  }),
                  new TextRun({
                    text: ' از ',
                    size: 15,
                    color: '94A3B8',
                    font: { name: FONT_NAME, cs: FALLBACK_FONT },
                  }),
                  new TextRun({
                    children: [PageNumber.TOTAL_PAGES],
                    size: 15,
                    color: '94A3B8',
                    font: { name: FONT_NAME, cs: FALLBACK_FONT },
                  }),
                  new TextRun({
                    text: '  |  سند رسمی و محرمانهٔ کارگاه — نسخهٔ ۳.۲',
                    size: 15,
                    color: '94A3B8',
                    font: { name: FONT_NAME, cs: FALLBACK_FONT },
                  }),
                ],
              }),
            ],
          }),
        },
        children: [
          // Banner / Cover Box
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: 'FFF1F2' },
                    borders: {
                      top: { style: BorderStyle.SINGLE, size: 12, color: PRIMARY_COLOR },
                      bottom: { style: BorderStyle.SINGLE, size: 12, color: PRIMARY_COLOR },
                      left: { style: BorderStyle.NONE },
                      right: { style: BorderStyle.SINGLE, size: 36, color: PRIMARY_COLOR },
                    },
                    margins: { top: 220, bottom: 220, left: 240, right: 240 },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        bidirectional: true,
                        children: [
                          new TextRun({
                            text: 'مستر پروتکل جامع تولید شراب قرمز و رُزه «رشه سردشت» (مقیاس ۴۰۰ کیلوگرم)',
                            bold: true,
                            size: 32,
                            color: PRIMARY_COLOR,
                            font: { name: FONT_NAME, cs: FALLBACK_FONT },
                          }),
                        ],
                      }),
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        bidirectional: true,
                        spacing: { before: 80 },
                        children: [
                          new TextRun({
                            text: 'نسخهٔ عملیاتی، مهندسی و آزمایشگاهی ویژهٔ تیم اجرایی — از پذیرش انگور تا بطری‌گذاری ضد-اکسیداسیون',
                            size: 20,
                            bold: true,
                            color: DARK_NAVY,
                            font: { name: FONT_NAME, cs: FALLBACK_FONT },
                          }),
                        ],
                      }),
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        bidirectional: true,
                        spacing: { before: 60 },
                        children: [
                          new TextRun({
                            text: 'کد مدرک: SOP-OENO-1403-RS400  •  ویرایش: ۳.۲ (بازمهندسی‌شده و قطعی)  •  تاریخ تدوین: مهر ۱۴۰۳  •  سطح دسترسی: محرمانه داخلی',
                            size: 16,
                            color: '64748B',
                            font: { name: FONT_NAME, cs: FALLBACK_FONT },
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          // بخش صفر
          ...createSectionHeading('بخش صفر: مشخصات پایه، موازنهٔ واقعی حجم‌ها، تجهیزات و واژه‌نامه', 'بخش ۰'),
          createSubHeading('۱. موازنهٔ مهندسی جرم و حجم (Mass & Volume Balance)'),
          createParagraph(
            'قانون طلایی کارگاه: پیش از شروع پروژه، بدنهٔ مخازن ۲۰۰ لیتری A و B و تمامی گالن‌های شیشه‌ای ۲۰ لیتری باید با پیمانهٔ آب کالیبره شده و خطوط حجمی (هر ۵ لیتر در مخازن و خط دقیق ۲۰ لیتر در گالن‌ها) با ماژیک صنعتی ضدآب روی بدنه علامت‌گذاری شوند. تمامی دوزهای پس از پرسینگ بر پایهٔ غلظت واحد (گرم بر لیتر - g/L) و حجم واقعی اندازه‌گیری‌شده در هر ایستگاه اعمال می‌شوند.',
            { italic: true, color: '475569', spacingAfter: 120 }
          ),

          createParagraph('• مادهٔ اولیه: ۴۰۰ کیلوگرم انگور «رشه سردشت» دست‌چین و سالم (بریکس هدف: ۲۲، وزن مخصوص اولیه در ۲۰ درجه: SG₀ = 1.092).', { bullet: true }),
          createParagraph('• حجم کل تودهٔ کراش‌شده (شیره و پوست پس از خوشه‌زدایی): حدود ۳۵۰ لیتر (تقسیم متقارن: ۱۷۵ لیتر در مخزن ۲۰۰ لیتری A و ۱۷۵ لیتر در مخزن ۲۰۰ لیتری B).', { bullet: true }),
          createParagraph('• حجم کل فاز مایع اولیه (V_initial): ۳۰۰ لیتر (۱۵۰ لیتر مایع در مخزن A + ۱۵۰ لیتر مایع در مخزن B).', { bullet: true }),
          createParagraph('• خون‌گیری سانیه برای رُزه (۱۲٪ فاز مایع در ساعت ۰۳:۰۰): ۳۶ لیتر شیرهٔ رُزه (۱۸ لیتر از مخزن A + ۱۸ لیتر از مخزن B):', { bullet: true }),
          createParagraph('   - پس از ۲۰ ساعت شفاف‌سازی سرد و سیفون از روی رسوب بنتونیت: ۳۲ لیتر شیرهٔ رُزهٔ شفاف وارد فاز تخمیر می‌شود.'),
          createParagraph('   - پس از سیفون‌های پایان تخمیر و سرمازدایی: ۲۹ لیتر شراب رُزهٔ نهایی (۳۸ بطری ۷۵۰ میلی‌لیتری).'),
          createParagraph('• حجم باقی‌مانده در مخازن قرمز پس از سانیه (V_red-ferm): ۲۶۴ لیتر فاز مایع کل (۱۳۲ لیتر مایع در مخزن A + ۱۳۲ لیتر مایع در مخزن B). حجم کل مایع به‌همراه کلاهک پوست در هر مخزن ۲۰۰ لیتری برابر با ۱۵۷ لیتر است (۴۳ لیتر فضای خالی ایمن برای انبساط کلاهک).', { bullet: true }),
          createParagraph('• موازنهٔ حجم در ایستگاه پرسینگ (روز ششم در SG = 1.008): از هر مخزن حاوی ۱۳۲ لیتر مایع و ۲۵ لیتر پوست:', { bullet: true }),
          createParagraph('   - شراب آب‌آزاد (Free-Run + فشار ملایم دست): ۱۱۰ لیتر در هر بچ (مجموعاً ۲۲۰ لیتر در دو بچ A و B).'),
          createParagraph('   - شراب پرس سنگین (Heavy Press): ۱۲ لیتر از هر مخزن (مجموعاً ۲۴ لیتر که در گالن‌های مجزا نگهداری و تیمار می‌شود).'),
          createParagraph('   - تلفات رطوبت باقی‌مانده در کیک تفاله و تبخیر: حدود ۱۰ لیتر در هر مخزن (110 + 12 + 10 = 132 L — موازنهٔ کامل).'),
          createParagraph('• موازنهٔ حجم پس از سیفون‌ها (محصول نهایی قرمز):', { bullet: true }),
          createParagraph('   - روز ۱۰ (پس از سیفون دُرد سنگین مخمر / Gross Lees): ۱۰۵ لیتر در هر بچ (مجموعاً ۲۱۰ لیتر).'),
          createParagraph('   - روز ۸۵ تا ۱۰۰ (پس از سیفون باکتیلس و سیفون سرمازدایی تارتارات): ۱۰۰ لیتر شراب قرمز تراز اول در هر بچ (مجموعاً ۲۰۰ لیتر = ۲۶۶ بطری ۷۵۰ میلی‌لیتری، که حدود ۴ تا ۶ بطری از آن در حین دورهٔ نگهداری برای لب‌به‌لب کردن گالن‌ها مصرف می‌شود).'),

          createSubHeading('۲. فهرست ظروف و تجهیزات آزمایشگاهی الزامی'),
          createParagraph('۱. ظروف تخمیر و نگهداری:', { bold: true }),
          createParagraph('• ۲ عدد مخزن ۲۰۰ لیتری پلی‌پروپیلن خوراکی (Food-Grade PP) دولایه (مخازن A و B).', { bullet: true }),
          createParagraph('• ۱۴ عدد گالن شیشه‌ای ۲۰ لیتری (Carboys) کالیبره‌شده (۱۰ عدد برای نگهداری ۲۰۰ تا ۲۱۰ لیتر شراب قرمز در وضعیت لب‌به‌لب، ۲ عدد برای رُزه، ۱ عدد برای شراب پرس سنگین، و ۱ عدد گالن خالی رزرو برای عملیات سیفون).', { bullet: true }),
          createParagraph('• ۶ عدد گالن شیشه‌ای ۴ یا ۵ لیتری و ۱۰ عدد بطری ۱.۵ و ۰.۷۵ لیتری با قفل هوا (برای نگهداری شراب یدکی جهت لب‌به‌لب کردن دوره‌ای یا همان Top-up).', { bullet: true }),
          createParagraph('۲. ابزارهای آزمایشگاهی و کنترلی:', { bold: true }),
          createParagraph('• هیدرومتر آزمایشگاهی سه‌مقیاسه با بازهٔ دقیق 0.990 تا 1.120 (با تفکیک 0.001) + استوانهٔ مدرج ۲۵۰ میلی‌لیتری.', { bullet: true }),
          createParagraph('• رفراکتومتر نوری (صرفاً برای کنترل بریکس انگور در روز صفر پیش از شروع تخمیر).', { bullet: true }),
          createParagraph('• پی‌اچ‌متر دیجیتال با دقت 0.01 به‌همراه محلول‌های بافر استاندارد pH 4.01 و pH 3.00 (یا 7.00) و محلول نگهداری الکترود (3 M KCl).', { bullet: true }),
          createParagraph('• کیت تیتراسیون اسیدیتهٔ کل (TA) حاوی سود سوزآور استاندارد (0.1 N NaOH) و بورت مدرج.', { bullet: true }),
          createParagraph('• کیت اندازه‌گیری سولفیت آزاد (Free SO2) به روش تیتراسیون ریپر (Ripper Method) یا تقطیر هوادهی (Aeration-Oxidation).', { bullet: true }),
          createParagraph('• قرص تست قند احیاکننده (Clinitest) یا محلول فهلینگ A و B (برای تایید خشکی مطلق شراب در قند زیر 2 g/L).', { bullet: true }),
          createParagraph('• ترازوی دیجیتال آزمایشگاهی با دقت 0.01 g + سرنگ‌های مدرج ۱ میلی‌لیتری (انسولین با دقت 0.01 mL)، ۱۰ میلی‌لیتری و ۵۰ میلی‌لیتری.', { bullet: true }),
          createParagraph('• ۲ عدد دماسنج میله‌ای استیل ضدزنگ با سنسور بلند (حداقل ۲۰ سانتی‌متر برای نفوذ به مرکز کلاهک پوست).', { bullet: true }),

          createSubHeading('۳. واژه‌نامهٔ تخصصی کارگاه (Enological Glossary)'),
          createParagraph('• شیرهٔ انگور / تودهٔ تخمیری (Must): مخلوط آب‌انگور تازه، پوست و هسته پیش از پایان تخمیر (در متون قدیمی گاهی «ماست» ترجمه شده که در این پروتکل برای پرهیز از ابهام، «شیره» یا «تودهٔ تخمیری» نامیده می‌شود).'),
          createParagraph('• سانیه (Saignée / خون‌گیری): کشیدن بخشی از آب‌انگورِ بدون فشار در ساعات اولیه پس از له کردن انگور، با دو هدف: تولید شراب رُزه از آبِ کشیده‌شده و افزایش نسبت پوست به مایع در مخزن شراب قرمز.'),
          createParagraph('• غوطه‌ورسازی کلاهک (Pigeage / Punch-down): فرو بردن لایهٔ فشردهٔ پوست‌های شناور روی سطح مخزن (کلاهک / Cap) به داخل فاز مایع برای استخراج رنگ و تانن و خنک کردن کلاهک.'),
          createParagraph('• شفاف‌سازی سرد پیش از تخمیر (Débourbage): ته‌نشین کردن ذرات معلق تفاله و گوگرد عنصری در شیرهٔ رُزه با کمک سرما، آنزیم و بنتونیت پیش از افزودن مخمر.'),
          createParagraph('• هم‌دمایی مخمر (Attemperation): پایین آوردن پله‌پلهٔ دمای دوغاب مخمرِ بیدارشده (از ۴۰ درجه به حدود ۲۲ درجه) با افزودن تدریجی شیرهٔ انگور، جهت جلوگیری از شوک سرمایی به غشای سلولی مخمر.'),
          createParagraph('• تغذیهٔ پله‌ای نیتروژن (SNA - Staggered Nutrient Addition): تقسیم خوراک نیتروژنی مخمر (YAN) به ۳ مرحله بر اساس افت وزن مخصوص (SG) جهت جلوگیری از پیک حرارتی و توقف تولید گاز سولفید هیدروژن (H2S).'),
          createParagraph('• دُرد سنگین (Gross Lees) و دُرد نرم (Fine Lees): دُرد سنگین شامل بقایای درشت پوست، پالپ و مخمرهای مرده است که در ۲۴ تا ۴۸ ساعت اول پس از تخمیر ته‌نشین می‌شود و باید سریعاً جدا گردد؛ دُرد نرم ذرات بسیار ریز معلقی است که در هفته‌های بعد رسوب می‌کند.'),
          createParagraph('• فضای خالی گلوگاه (Ullage / Headspace): فاصلهٔ بین سطح مایع شراب تا زیر چوب‌پنبه در بطری (۱۲ تا ۱۵ میلی‌متر) یا تا دهانهٔ گالن.'),

          // بخش اول: جدول جامع ۱۹ ردیفه مواد اولیه
          ...createSectionHeading('بخش اول: جدول جامع مواد اولیه و چک‌لیست وزن‌کشی', 'بخش ۱'),
          createParagraph(
            'دستورالعمل اجرایی: تمامی مقادیر جدول زیر هم بر اساس نرخ دوز استاندارد (g/L یا mg/L) و هم بر اساس حجم واقعی هر ایستگاه محاسبه شده‌اند. موادی که مقدار آن‌ها کمتر از 0.50 g است (مانند سولفات مس)، مطلقاً نباید به صورت پودر خشک برای مخزن وزن شوند، بلکه صرفاً از روی محلول‌های استوکِ بخش دوم با سرنگ برداشت می‌شوند.',
            { italic: true, spacingAfter: 120 }
          ),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                tableHeader: true,
                children: [
                  createCell('ردیف', { isHeader: true, widthPercent: 5 }),
                  createCell('نام ماده', { isHeader: true, widthPercent: 18 }),
                  createCell('کل نیاز پروژه', { isHeader: true, widthPercent: 12 }),
                  createCell('نرخ دوز استاندارد', { isHeader: true, widthPercent: 14 }),
                  createCell('سهم بچ قرمز A (۱۳۲L)', { isHeader: true, widthPercent: 13 }),
                  createCell('سهم بچ قرمز B (۱۳۲L)', { isHeader: true, widthPercent: 13 }),
                  createCell('سهم شراب رُزه', { isHeader: true, widthPercent: 11 }),
                  createCell('زمان و هدف مصرف', { isHeader: true, widthPercent: 14 }),
                ],
              }),
              new TableRow({ children: [createCell('۱'), createCell('پرکربنات سدیم (شوینده قلیایی)', { bold: true }), createCell('400 g'), createCell('4 g/L آب گرم'), createCell('—'), createCell('—'), createCell('—'), createCell('شستشوی اولیهٔ ظروف و شیلنگ‌ها پیش از ضدعفونی')] }),
              new TableRow({ children: [createCell('۲', { bgColor: ALT_ROW_COLOR }), createCell('جوش‌شیرین خوراکی (مشروط)', { bold: true, bgColor: ALT_ROW_COLOR }), createCell('400 g', { bgColor: ALT_ROW_COLOR }), createCell('2 g/L آب سرد', { bgColor: ALT_ROW_COLOR }), createCell('—', { bgColor: ALT_ROW_COLOR }), createCell('—', { bgColor: ALT_ROW_COLOR }), createCell('—', { bgColor: ALT_ROW_COLOR }), createCell('فقط در صورت سم‌پاشی دیرهنگام گوگرد در باغ', { bgColor: ALT_ROW_COLOR })] }),
              new TableRow({ children: [createCell('۳'), createCell('اسید سیتریک خوراکی', { bold: true }), createCell('300 g'), createCell('طبق فرمول'), createCell('—'), createCell('—'), createCell('—'), createCell('آبکشی، ساخت محلول ضدعفونی، الکترود و چوب‌پنبه')] }),
              new TableRow({ children: [createCell('۴', { bgColor: ALT_ROW_COLOR }), createCell('متابی‌سولفیت پتاسیم (K2S2O5)', { bold: true, bgColor: ALT_ROW_COLOR }), createCell('47.36 g (شراب) + 200 g (ضدعفونی)', { bgColor: ALT_ROW_COLOR }), createCell('کراش: 43.5mg/L\nسانیه: +26mg/L\nباکتیلس: 78mg/L\nبطری: ~30mg/L', { bgColor: ALT_ROW_COLOR }), createCell('کراش (۱۵۰L): 6.52g\nساعت ۳.۵ (۱۳۲L): 3.43g\nروز ۱۱ (۱۰۵L): 8.19g\nروز ۹۹ (۱۰۰L): ~3.00g', { bgColor: ALT_ROW_COLOR }), createCell('کراش (۱۵۰L): 6.52g\nساعت ۳.۵ (۱۳۲L): 3.43g\nروز ۱۱ (۱۰۵L): 8.19g\nروز ۹۹ (۱۰۰L): ~3.00g', { bgColor: ALT_ROW_COLOR }), createCell('در کراش دریافت کرده\nپایان تخمیر (۳۰L): 2.34g\nروز ۹۹ (۲۹L): ~0.87g\n(پرس سنگین ۲۴L: 1.87g)', { bgColor: ALT_ROW_COLOR }), createCell('مهار اکسیداسیون، قفل مالولاکتیک و تنظیم سولفیت آزاد نهایی روی 35 mg/L', { bgColor: ALT_ROW_COLOR })] }),
              new TableRow({ children: [createCell('۵'), createCell('پودر آنزیم پکتولیتیک', { bold: true }), createCell('15.96 g'), createCell('قرمز: 0.055 g/L\nرُزه: 0.040 g/L'), createCell('7.26 g (ساعت ۰۳:۳۰ در ۱۳۲L)'), createCell('7.26 g (ساعت ۰۳:۳۰ در ۱۳۲L)'), createCell('1.44 g (ساعت ۰۳:۳۰ در ۳۶L)'), createCell('شکستن پکتین دیوارهٔ سلولی پوست رشه و شفاف‌سازی رُزه')] }),
              new TableRow({ children: [createCell('۶', { bgColor: ALT_ROW_COLOR }), createCell('تانن شراب سفید (گالیک)', { bold: true, bgColor: ALT_ROW_COLOR }), createCell('9.48 g', { bgColor: ALT_ROW_COLOR }), createCell('قرمز: 0.030 g/L\nرُزه: 0.035 + 0.015 g/L', { bgColor: ALT_ROW_COLOR }), createCell('3.96 g (ساعت ۱۱:۰۰ در ۱۳۲L)', { bgColor: ALT_ROW_COLOR }), createCell('3.96 g (ساعت ۱۱:۰۰ در ۱۳۲L)', { bgColor: ALT_ROW_COLOR }), createCell('شروع تخمیر (۳۲L): 1.12g\nروز ۸۵ (۲۹L): 0.44g', { bgColor: ALT_ROW_COLOR }), createCell('رسوب پروتئین‌های ناپایدار و مهار آنزیم لاکاز/تیروزیناز', { bgColor: ALT_ROW_COLOR })] }),
              new TableRow({ children: [createCell('۷'), createCell('تانن مخصوص شراب قرمز', { bold: true }), createCell('57.80 g'), createCell('فاز ۱ و ۲: 0.10 g/L\nفینیشینگ: 0.025 g/L'), createCell('ساعت ۱۱ (۱۳۲L): 13.20g\nدر SG 1.060: 13.20g\nروز ۸۵ (۱۰۰L): 2.50g'), createCell('ساعت ۱۱ (۱۳۲L): 13.20g\nدر SG 1.060: 13.20g\nروز ۸۵ (۱۰۰L): 2.50g'), createCell('صفر (مطلقاً در رُزه ریخته نشود)', { bold: true }), createCell('تثبیت کووالانسی آنتوسیانین‌های رنگ و ساختار مخملی')] }),
              new TableRow({ children: [createCell('۸', { bgColor: ALT_ROW_COLOR }), createCell('اسید تارتاریک خوراکی L(+)', { bold: true, bgColor: ALT_ROW_COLOR }), createCell('ذخیره: 600 g', { bgColor: ALT_ROW_COLOR }), createCell('طبق تست ۳ لیوانی و کنترل TA', { bgColor: ALT_ROW_COLOR }), createCell('~ 200–260 g (ساعت ۱۲:۳۰ در ۱۳۲L)', { bgColor: ALT_ROW_COLOR }), createCell('~ 200–260 g (ساعت ۱۲:۳۰ در ۱۳۲L)', { bgColor: ALT_ROW_COLOR }), createCell('~ 50–80 g (ساعت ۲۸:۰۰ در ۳۲L) + 10.00 g استوک ۱', { bgColor: ALT_ROW_COLOR }), createCell('تنظیم pH قرمز روی 3.52 و رُزه روی 3.28–3.35 با رعایت سقف TA', { bgColor: ALT_ROW_COLOR })] }),
              new TableRow({ children: [createCell('۹'), createCell('مخمر Lalvin RC-212', { bold: true }), createCell('74.00 g (+15g EC-1118 رزرو)'), createCell('0.25 g/L (25 g/hL)'), createCell('33.00 g (ساعت ۱۶:۳۰ در ۱۳۲L)'), createCell('33.00 g (ساعت ۱۶:۳۰ در ۱۳۲L)'), createCell('8.00 g (ساعت ۲۹:۰۰ در ۳۲L)'), createCell('تخمیر الکلی با استخراج بالای پلی‌فنول')] }),
              new TableRow({ children: [createCell('۱۰', { bgColor: ALT_ROW_COLOR }), createCell('مغذی Go-Ferm', { bold: true, bgColor: ALT_ROW_COLOR }), createCell('88.80 g', { bgColor: ALT_ROW_COLOR }), createCell('0.30 g/L (1.2 × مخمر)', { bgColor: ALT_ROW_COLOR }), createCell('39.60 g (ساعت ۱۵:۳۰)', { bgColor: ALT_ROW_COLOR }), createCell('39.60 g (ساعت ۱۵:۳۰)', { bgColor: ALT_ROW_COLOR }), createCell('9.60 g (ساعت ۲۸:۰۰)', { bgColor: ALT_ROW_COLOR }), createCell('غنی‌سازی غشای سلولی مخمر با استرول‌ها در آب ۴۳ درجه', { bgColor: ALT_ROW_COLOR })] }),
              new TableRow({ children: [createCell('۱۱'), createCell('مغذی Fermaid O (۱۰۰٪ نیتروژن آلی)', { bold: true }), createCell('158.96 g'), createCell('مرحله ۱: 0.20–0.25 g/L\nمرحله ۳ (۱/۲ قند): 0.23–0.30 g/L (۱۰۰٪ آلی)', { bold: true }), createCell('در SG 1.083: 33.00g\nدر SG 1.057: 39.60g (۱۰۰٪ آلی)'), createCell('در SG 1.083: 33.00g\nدر SG 1.057: 39.60g (۱۰۰٪ آلی)'), createCell('در SG 1.083: 6.40g\nدر SG 1.057: 7.36g (۱۰۰٪ آلی)'), createCell('تامین اسیدهای آمینهٔ ارگانیک پایدار؛ تنها منبع نیتروژن مجاز در نیمهٔ تخمیر (SG 1.057)')] }),
              new TableRow({ children: [createCell('۱۲', { bgColor: ALT_ROW_COLOR }), createCell('مغذی Fermaid K', { bold: true, bgColor: ALT_ROW_COLOR }), createCell('71.76 g', { bgColor: ALT_ROW_COLOR }), createCell('صرفاً مرحله ۲ (۱/۳ قند): 0.18–0.25 g/L\n(ممنوع در ۱/۲ قند!)', { bgColor: ALT_ROW_COLOR }), createCell('فقط در SG 1.070: 33.00g\n(در SG 1.057: صفر)', { bgColor: ALT_ROW_COLOR }), createCell('فقط در SG 1.070: 33.00g\n(در SG 1.057: صفر)', { bgColor: ALT_ROW_COLOR }), createCell('فقط در SG 1.070: 5.76g\n(در SG 1.057: صفر)', { bgColor: ALT_ROW_COLOR }), createCell('تامین تیامین، پانتوتنیک اسید، منیزیم و نیتروژن ترکیبی پیش از سد الکلی ۶٪', { bgColor: ALT_ROW_COLOR })] }),
              new TableRow({ children: [createCell('۱۳'), createCell('دی‌آمونیم فسفات (DAP)', { bold: true }), createCell('42.80 g'), createCell('قرمز: 0.15 g/L\nرُزه: 0.10 g/L'), createCell('فقط در SG 1.070: 19.80g'), createCell('فقط در SG 1.070: 19.80g'), createCell('فقط در SG 1.070: 3.20g'), createCell('تامین نیتروژن معدنی سریع در اوج تکثیر سلولی جهت مهار H2S')] }),
              new TableRow({ children: [createCell('۱۴', { bgColor: ALT_ROW_COLOR }), createCell('مکمل روی (Wyeast / Servomyces)', { bold: true, bgColor: ALT_ROW_COLOR }), createCell('3.64 g', { bgColor: ALT_ROW_COLOR }), createCell('قرمز: 0.012 g/L\nرُزه: 0.015 g/L', { bgColor: ALT_ROW_COLOR }), createCell('فقط در SG 1.070: 1.58g', { bgColor: ALT_ROW_COLOR }), createCell('فقط در SG 1.070: 1.58g', { bgColor: ALT_ROW_COLOR }), createCell('فقط در SG 1.083: 0.48g', { bgColor: ALT_ROW_COLOR }), createCell('تقویت کوفاکتور روی (Zn²⁺) برای آنزیم الکل دهیدروژناز', { bgColor: ALT_ROW_COLOR })] }),
              new TableRow({ children: [createCell('۱۵'), createCell('بنتونیت انولوژیک', { bold: true }), createCell('7.20 g'), createCell('0.20 g/L (در رُزه)'), createCell('صفر'), createCell('صفر'), createCell('7.20 g (ساعت ۰۵:۳۰ در ۳۶L)'), createCell('کمک‌لخته‌ساز برای رسوب دادن ذرات کدر و گوگرد معلق در رُزه')] }),
              new TableRow({ children: [createCell('۱۶', { bgColor: ALT_ROW_COLOR }), createCell('سولفات مس ۵ آبه (CuSO4·5H2O)', { bold: true, bgColor: ALT_ROW_COLOR }), createCell('1.00 g (فقط استوک ۰.۱٪)', { bgColor: ALT_ROW_COLOR }), createCell('1 mg/mL محلول استوک ۲', { bgColor: ALT_ROW_COLOR }), createCell('در صورت نیاز: 25–35 mL از استوک ۲', { bgColor: ALT_ROW_COLOR }), createCell('در صورت نیاز: 25–35 mL از استوک ۲', { bgColor: ALT_ROW_COLOR }), createCell('در صورت نیاز: 5–8 mL از استوک ۲', { bgColor: ALT_ROW_COLOR }), createCell('ساخت ۱ لیتر محلول استوک ۲ جهت تست ۳ لیوانی و حذف H2S', { bgColor: ALT_ROW_COLOR })] }),
              new TableRow({ children: [createCell('۱۷'), createCell('Bactiless (کیتوزان لالمند)', { bold: true }), createCell('77.70 g'), createCell('قرمز: 0.30 g/L\nرُزه: 0.25 g/L'), createCell('31.50 g (روز ۱۱ در ۱۰۵L شراب صاف)'), createCell('31.50 g (روز ۱۱ در ۱۰۵L شراب صاف)'), createCell('7.50 g (در ۳۰L رُزه صاف)\n(+ 7.20 g برای ۲۴L پرس)', { bold: true }), createCell('لیز کردن غشای باکتری‌های مالولاکتیک/استیک و کیلیت کردن مس')] }),
              new TableRow({ children: [createCell('۱۸', { bgColor: ALT_ROW_COLOR }), createCell('گلیسیرین خوراکی خالص (مشروط)', { bold: true, bgColor: ALT_ROW_COLOR }), createCell('حداکثر 743.5 g (590 mL)', { bgColor: ALT_ROW_COLOR }), createCell('قرمز: تا 3.5 g/L\nرُزه: تا 1.5 g/L', { bgColor: ALT_ROW_COLOR }), createCell('تا 350 g (278 mL در ۱۰۰L در روز ۸۵)', { bgColor: ALT_ROW_COLOR }), createCell('تا 350 g (278 mL در ۱۰۰L در روز ۸۵)', { bgColor: ALT_ROW_COLOR }), createCell('تا 43.5 g (34.5 mL در ۲۹L در روز ۸۵)', { bgColor: ALT_ROW_COLOR }), createCell('گرد کردن حس دهانی پس از تایید در تست حسی ۳ لیوانی روز ۸۵', { bgColor: ALT_ROW_COLOR })] }),
              new TableRow({ children: [createCell('۱۹'), createCell('ال-اسید اسکوربیک (ویتامین C)', { bold: true }), createCell('9.02 g (+ 6.3 g رزرو)'), createCell('0.035 g/L (35 mg/L)'), createCell('3.50 g (۳۰ دقیقه قبل از بطری در ۱۰۰L)'), createCell('3.50 g (۳۰ دقیقه قبل از بطری در ۱۰۰L)'), createCell('1.02 g (۳۰ دقیقه قبل از بطری در ۲۹L) + 1.00 g استوک ۲B'), createCell('حذف اکسیژن محلول گلوگاه بطری در لحظهٔ بطری‌گذاری')] }),
            ],
          }),

          // بخش دوم
          ...createSectionHeading('بخش دوم: ایمنی صنعتی کارگاه، شستشوی دو مرحله‌ای و ساخت ۵ محلول استوک (روز ۱- تا روز ۰)', 'بخش ۲'),
          createSubHeading('۱. پروتکل ایمنی حیاتی کارگاه (HSE)'),
          createParagraph('1. خطر خفگی با گاز دی‌اکسید کربن (CO2): تخمیر ۳۰۰ لیتر شیرهٔ انگور با بریکس ۲۲ حدود ۱۵ مترمکعب گاز بی‌رنگ و بی‌بوی CO2 تولید می‌کند که به دلیل سنگین‌تر بودن از هوا در کف اتاق جمع می‌شود. کارگاه الزاماً باید دارای فن تهویهٔ کف‌کش به سمت فضای باز باشد.'),
          createParagraph('2. ایمنی کار با یخ خشک: هرگز یخ خشک را با دست بدون دستکش عایق لمس نکنید (دمای -78.5 °C باعث سوختگی سرمایی فوری می‌شود). قانون مطلق: هرگز چوب‌پنبه یا درپوش بسته را روی گالنی که هنوز ذرهٔ جامد یخ خشک در آن در حال تصعید است قرار ندهید (خطر انفجار گالن شیشه‌ای).'),
          createParagraph('3. ایمنی بخار سولفیت (SO2): هنگام تهیهٔ محلول ضدعفونی سولفیت اسیدی یا باز کردن درب سطل بخاردهی چوب‌پنبه، صورت خود را بالای ظرف نگیرید؛ استنشاق گاز SO2 موجب اسپاسم شدید برونش می‌شود.'),

          createSubHeading('۲. پروتکل دو مرحله‌ای «تمیزکاری قلیایی» و «ضدعفونی اسیدی»'),
          createParagraph('محلول متابی‌سولفیت به تنهایی شویندهٔ چربی و جرم نیست. تمامی ظروف، شیلنگ‌ها و ابزارها باید این دو گام را طی کنند:'),
          createParagraph('• گام اول (تمیزکاری با پرکربنات سدیم): 4 g/L پرکربنات سدیم را در آب گرم (45 °C) حل کنید، سطوح داخلی مخازن و شیلنگ‌ها را با آن بشویید و سپس با آب تصفیه‌شده کاملاً آبکشی کنید.'),
          createParagraph('• گام دوم (ضدعفونی با محلول استوک شماره ۳): سطوح تمیز را با محلول سولفیت اسیدی خیس کنید. برای شیلنگ‌های سیفون، شیلنگ را پر از محلول کرده و حداقل ۵ دقیقه زمان تماس بدهید، سپس مایع را خالی کرده و بدون آبکشی با آب شهری استفاده کنید.'),

          createSubHeading('۳. دستور ساخت ۵ محلول استوک کارگاه (آماده‌سازی در صبح روز صفر)'),
          createParagraph('1. بطری شماره ۱ — محلول استوک ۱۰٪ اسید تارتاریک (100 mg/mL): دقیقاً 10.00 g اسید تارتاریک را در 70 mL آب مقطر حل کرده و با آب مقطر حجم کل را دقیقاً به 100 mL برسانید. کاربرد در تست لیوانی: هر 1.0 mL از این محلول در 100 mL شیرهٔ انگور معادل افزودن 1.0 g/L اسید تارتاریک به مخزن است.'),
          createParagraph('2. بطری شماره ۲ — محلول استوک ۰.۱٪ سولفات مس (1.0 mg/mL): برای حذف خطای ترازوی 0.01 g، دقیقاً 1.00 g سولفات مس ۵ آبه (CuSO4·5H2O) را در یک بالن یا ظرف مدرج ۱ لیتری ریخته و با آب مقطر به حجم دقیق 1000 mL برسانید. کاربرد: هر 0.025 mL در 100 mL شراب معادل دوز 0.25 mg/L است. در مقیاس مخزن ۱۰۵ لیتری، برداشتن 26.2 mL با سرنگ معادل دوز دقیق 0.25 mg/L سولفات مس است.'),
          createParagraph('3. بطری شماره ۲B — محلول استوک ۱.۰٪ اسید اسکوربیک (10 mg/mL): دقیقاً 1.00 g ال-اسید اسکوربیک را در 100 mL آب مقطر تازه حل کنید (این محلول باید در روز ۱۰ تازه ساخته شود). کاربرد در تست دی‌سولفید: افزودن 0.30 mL با سرنگ انسولین به 100 mL شراب، دقیقاً دوز واقعی 30 mg/L را شبیه‌سازی می‌کند.'),
          createParagraph('4. بطری شماره ۳ — محلول ضدعفونی سولفیت اسیدی (Acidified SO2 Sanitizer): در یک گالن ۵ لیتری آب تصفیه‌شده، 25 g متابی‌سولفیت پتاسیم + 25 g اسید سیتریک حل کنید و درب آن را محکم ببندید. (تاریخ ساخت را روی گالن بنویسید؛ این محلول باید هر ۷ روز تازه ساخته شود).'),
          createParagraph('5. بطری شماره ۴ — محلول شستشوی الکترود پی‌اچ‌متر و ژل بنتونیت رُزه: الکترود: 100 mL آب مقطر + 2.0 g اسید سیتریک در یک ظرف دردار برای پاک کردن رنگ شراب از حباب شیشه‌ای الکترود. آماده‌سازی بنتونیت رُزه (در ساعت ۰۰:۰۰ روز صفر): 7.20 g بنتونیت را به آرامی روی سطح 150 mL آب گرم (50 °C) بپاشید، هم بزنید و بگذارید ۵.۵ ساعت کامل استراحت کند تا کاملاً متورم و ژل شود (جهت مصرف در ساعت ۰۵:۳۰ در شیرهٔ رُزه).'),

          // ایستگاه‌های ۱ تا ۷
          ...createSectionHeading('ایستگاه‌های عملیاتی ۱ تا ۷: شرح کامل مراحل از انگور تا بطری', 'ایستگاه‌ها'),
          createSubHeading('ایستگاه ۱: پذیرش انگور، شستشوی مشروط و کراش ملایم (روز صفر)'),
          createParagraph('۱. پروتکل شستشوی مشروط انگور (حذف ذرات سطحی گوگرد باغ S⁰): گوگرد عنصری سم‌پاشی‌شده در باغ به صورت ذرات آب‌گریز به لایهٔ مومی سطح حبه (Pruine) می‌چسبد و در صورت ورود به تخمیر به مقدار بیش از 2 mg/L، توسط مخمر به گاز بدبوی H2S احیا می‌شود.'),
          createParagraph('تصمیم‌گیری مهندسی: اگر باغ در ۴ هفتهٔ پایانی پیش از برداشت سم‌پاشی گوگردی نشده و خوشه‌ها تمیز هستند، انگور را نشویید و مستقیم به مرحلهٔ خوشه‌زدایی بروید. اما اگر آثار غبار گوگرد یا سم‌پاشی دیرهنگام وجود دارد: دو تشت ۱۰۰ لیتری آب سرد (15–18 °C) آماده کنید: در تشت اول 200 g جوش‌شیرین (2 g/L) و در تشت دوم 100 g اسید سیتریک (1 g/L) حل کنید. سبدهای انگور (با خوشهٔ سالم و کامل) را ۱ دقیقه در تشت اول تکان دهید تا کشش سطحی شکسته شده و ذرات گوگرد به صورت مکانیکی جدا شوند، سپس ۳۰ ثانیه در تشت اسیدی و در نهایت با آب سرد آبکشی نمایید (آب تشت‌ها را پس از ۲۰۰ کیلوگرم اول تعویض کنید). سپس خشک‌سازی کامل با پنکه انجام شود: سبدها را در یک لایه چیده و ۲ تا ۳ ساعت مقابل پنکهٔ صنعتی قرار دهید تا ۱۰۰٪ قطرات آب سطحی تبخیر شده و دمای حبه‌ها روی 16–18 °C تثبیت شود.'),
          createParagraph('۲. خوشه‌زدایی دستی، حذف دمبرگ‌های سبز و کراش ملایم: حذف کامل چوب‌های سبز (Jacks) و حبه‌های نارس: حبه‌ها را از خوشه جدا کرده و تمام دمبرگ‌های سبز، برگ‌ها، حبه‌های نارس (سبز/ترش) و حبه‌های آسیب‌دیده را جدا کنید. دمبرگ سبز و حبهٔ نارس حاوی متوکسی‌پیرازین‌ها (عطر فلفل دلمه‌ای خام) و کاتچین‌های تلخ هستند؛ از آنجا که در این پروتکل تخمیر مالولاکتیک مسدود می‌شود و اسید مالیکِ ترد در شراب باقی می‌ماند، حضور تانن‌های سبز با اسیدیتهٔ بالا اثر هم‌افزایی منفی ایجاد کرده و گسیِ خشنی به شراب می‌دهد.'),
          createParagraph('کراش بدون آسیب به هسته: حبه‌ها را طوری له کنید که فقط پوست شکافته شود و پالپ آزاد گردد. شکستن هسته‌ها مطلقاً ممنوع است.'),
          createParagraph('تقسیم متقارن و ثبت پارامترهای پایه: تودهٔ له‌شده را به دو بخش مساوی در مخزن A (۱۷۵ لیتر توده = ۱۵۰ لیتر مایع) و مخزن B (۱۷۵ لیتر توده = ۱۵۰ لیتر مایع) بریزید. یک نمونهٔ اولیه از آب‌انگور صاف‌شده بردارید و بریکس اولیه (با رفراکتومتر و هیدرومتر)، pH اولیه و اسیدیتهٔ کل (TA) اولیه را اندازه گرفته و در فرم ثبت کنید.'),

          createSubHeading('ایستگاه ۲: جدول عملیاتی روز صفر — ماسراسیون رُزه، آنزیم، اصلاح اسید و تلقیح مخمر'),
          createParagraph('گام ۱ (ساعت ۰۰:۰۰ — حین کراش): تزریق دوز اول سولفیت (25 mg/L SO2): برای مخزن A مقدار 6.52 g و برای مخزن B نیز مقدار 6.52 g متابی‌سولفیت پتاسیم را هر کدام در 500 mL آب سرد حل کرده و حین ریختن انگورهای له‌شده در مخزن به صورت لایه‌به‌لایه بپاشید و یک بار به آرامی هم بزنید. این دوز، هم آنزیم‌های اکسیداتیو (پلی‌فنول اکسیداز) را مهار می‌کند و هم دوز ایده‌آل سولفیت (25 mg/L) را به آب‌انگور رُزه می‌دهد بدون آنکه رنگ را بیش از حد بی‌رنگ کند.'),
          createParagraph('گام ۲ (ساعت ۰۰:۰۰ تا ۰۳:۰۰): ماسراسیون سرد رُزه و خون‌گیری سانیه (Saignée): در دمای 16–18 °C، استخراج رنگ یاقوتی/مرجانی روشن از پوست انگور رشه نیازمند ۲.۵ تا ۳ ساعت تماس با پوست است. پایش رنگ (ساعت ۰۲:۰۰، ۰۲:۳۰ و ۰۳:۰۰): هر ۳۰ دقیقه 10 mL از شیرهٔ مخزن را صاف کنید: نیمی را در استکان شفاف روی کاغذ سفید در نور روز ببینید، و به 5 mL دیگر به اندازهٔ یک عدس (0.05 g) اسید تارتاریک + ۱ قطره آب‌اکسیژنه ۳٪ بزنید تا سقف پتانسیل رنگی آزادشده را مشاهده کنید. عملیات خون‌گیری در بستر گاز CO2 (ساعت ۰۳:۰۰ تا ۰۳:۳۰): در کف دو گالن شیشه‌ای ۲۰ لیتری تمیز ویژهٔ رُزه، ۳۵ تا ۴۰ گرم یخ خشک خوراکی بیندازید (یا ۳۰ ثانیه گاز CO2 کپسولی با دبی 5 L/min به کف گالن بدمید). هشدار ایمنی: درپوش گالن را نبندید تا گاز اضافه آزادانه خارج شود. یک آبکش استیل ضدعفونی‌شده را به آرامی روی سطح مخزن قرار دهید (بدون فشار به پوست‌ها) و با شیلنگ سیفون دقیقاً ۱۸ لیتر شیرهٔ صاف از مخزن A و ۱۸ لیتر از مخزن B (مجموعاً ۳۶ لیتر) به داخل گالن‌های رُزه بکشید.'),
          createParagraph('گام ۳ (ساعت ۰۳:۳۰ در مخازن قرمز A و B): تکمیل سولفیت و تزریق آنزیم پکتولیتیک: اکنون در هر مخزن قرمز ۱۳۲ لیتر فاز مایع باقی مانده است. ابتدا برای هر مخزن 3.43 g متابی‌سولفیت پتاسیم را در 200 mL آب سرد حل کرده، به مخزن اضافه کنید و کلاهک را زیر و رو نمایید (مجموع سولفیت مخزن قرمز به 40 mg/L می‌رسد). ۱۵ دقیقه بعد، برای هر مخزن دقیقاً 7.26 g پودر آنزیم پکتولیتیک را در 150 mL آب سرد (18 °C) به آرامی و بدون ایجاد کف حل کرده، روی سطح مخزن بپاشید و کلاهک را کاملاً هم بزنید. (نکتهٔ علمی: آنزیم پکتیک در حضور 40 mg/L سولفیتِ پخش‌شده در شیره کاملاً فعال است، به شرطی که در یک ظرف کوچک مستقیماً با محلول غلیظ سولفیت یا تانن مخلوط نشود). دمای تودهٔ تخمیری را روی 20 °C تثبیت کنید و ۷.۵ ساعت (تا ساعت ۱۱:۰۰) هیچ تاننی اضافه نکنید تا آنزیم دیوارهٔ سلولی پوست ضخیم رشه را بشکند. (در ساعت ۱۰:۳۰ تست الکل پکتین انجام دهید: 5 mL شیرهٔ صاف + 10 mL اتانول ۹۶٪؛ عدم تشکیل لختهٔ ژله‌ای پس از ۵ دقیقه نشانهٔ شکست کامل پکتین است).'),
          createParagraph('گام ۴ (ساعت ۱۱:۰۰ تا ۱۲:۳۰ در مخازن قرمز A و B): تانن فاز ۱ و اصلاح مهندسی اسید (pH و TA): ۱. تزریق تانن‌های فاز اول (ساعت ۱۱:۰۰): برای هر مخزن، 3.96 g تانن سفید + 13.20 g تانن قرمز را در 250 mL آب گرم (35 °C) حل کرده، به مخزن اضافه کنید و کلاهک را غوطه‌ور سازید. ۲. تست آزمایشگاهی ۳ لیوانی تنظیم pH و کنترل سقف TA (ساعت ۱۱:۱۵ تا ۱۲:۳۰): هدف طلایی در شراب قرمز رشه (بدون مالولاکتیک): pH = 3.50 تا 3.55 به شرطی که اسیدیتهٔ کل (TA) از 7.2 g/L فراتر نرود تا شراب ترش و تیز نشود. پی‌اچ‌متر را با بافرهای 4.01 و 3.00 (در دمای 20 °C) کالیبره کنید. یک نمونهٔ 400 mL از شیرهٔ مخزن بردارید، صاف و گاززدایی کنید و pH_initial و TA_initial را بخوانید. تخمین اولیه: Estimated Dose (g/L) ≈ (pH_initial - 3.52) × 10 to 12. در سه بشر حاوی دقیقاً 100 mL شیرهٔ صاف، با سرنگ از بطری استوک شماره ۱ سه دوز حول عدد تخمینی اضافه کنید. ۱ ساعت صبر کنید تا تعادل رسوب بی‌تارتارات پتاسیم برقرار شود. در ساعت ۱۲:۱۵، pH و TA را بخوانید و دوز بهینه را در ۱۳۲L ضرب کرده، در ۱ لیتر آب حل و در ساعت ۱۲:۳۰ به مخزن بیفزایید.'),
          createParagraph('گام ۵ (ساعت ۱۵:۳۰ تا ۱۶:۳۰ در مخازن قرمز A و B): بیدارسازی مخمر و هم‌دمایی ۳ مرحله‌ای: ۱. ساعت ۱۵:۳۰: 39.60 g پودر Go-Ferm در 800 mL آب ۴۳ درجه تصفیه‌شده دارای املاح حل شود. ۲. ساعت ۱۵:۴۰: در ۴۰ درجه 33.00 g مخمر RC-212 پاشیده شود (۲۰ دقیقه استراحت). ۳. هم‌دمایی ۳ مرحله‌ای: در ساعت ۱۶:۰۰ افزودن 500 mL شیره (دما به 30.5 °C می‌رسد؛ ۸ دقیقه صبر). در ساعت ۱۶:۰۸ افزودن 900 mL شیره (دما به 26.0 °C می‌رسد؛ ۸ دقیقه صبر). در ساعت ۱۶:۱۶ افزودن 1500 mL شیره (دما به 22.5 °C می‌رسد؛ اختلاف دما کمتر از ۳ درجه). ۴. ساعت ۱۶:۲۵ تا ۱۶:۳۰: تلقیح کل دوغاب مخمر به مخزن.'),

          createSubHeading('ایستگاه ۳: مدیریت ۶ روز تخمیر شراب قرمز (پروفایل دما، Pigeage، YAN و تغذیه SNA)'),
          createParagraph('۱. محاسبات مهندسی نیتروژن قابل‌جذب مخمر (YAN Budget): مخمر Lalvin RC-212 سویه با نیاز نیتروژنی بالا است. غلظت قند با احتساب وزن مخصوص: Sugar (g/L) = Brix × 10 × SG (برای ۲۲ بریکس و SG=1.090 برابر با 239.8 g/L). نیاز کل: Target YAN = Sugar × 0.90 ≈ 216–235 mg N/L. شیرهٔ رشه حدود 100 mg N/L نیتروژن پایه دارد. بنابراین باید 116 تا 135 mg N/L نیتروژن تکمیلی در ۳ پله تامین شود: مرحله ۱ (SNA-1 در افت ۱۰٪ قند): افزودن 0.25 g/L Fermaid O. مرحله ۲ (SNA-2 در افت ۲۵٪ قند — آخرین مهلت نیتروژن معدنی): افزودن 0.25 g/L Fermaid K + 0.15 g/L DAP + 0.012 g/L مکمل روی. مرحله ۳ (SNA-3 در افت ۳۶٪ / نیمهٔ قند): افزودن 0.30 g/L Fermaid O (۱۰۰٪ نیتروژن آلی — مصرف DAP و Fermaid K در این نقطه به دلیل مسدود شدن حامل‌های آمونیوم مخمر در الکل ۶٪ مطلقاً ممنوع است).'),
          createParagraph('۲. فرمول تریگرهای شناور وزن مخصوص: SG_Trigger = SG0 - f × (SG0 - 0.993). تریگر ۱ (f=0.10) برای SG0=1.092 برابر با 1.082–1.083 است. تریگر ۲ (f=0.25) برابر با 1.067–1.070. تریگر رنگ (f=0.32) برابر با 1.060. تریگر ۳ (f=0.36) برابر با 1.056–1.057 (در این نقطه فقط Fermaid O مجاز است و پس از آن هرگونه تغذیه نیتروژنی متوقف می‌شود).'),
          createParagraph('۳. قوانین اجرایی: ممنوعیت رفراکتومتر پس از تلقیح (فقط هیدرومتر گاززدایی‌شده با تصحیح دما). سقف ایمن دمای کلاهک ۲۷ تا ۲۸.۵ درجه؛ خط قرمز ۲۹.۵ درجه (شناورسازی فوری بطری‌های ۱.۵ لیتری یخ). گاززدایی ۲ دقیقه‌ای کلاهک پیش از افزودن پودرها.'),

          createSubHeading('جدول زمان‌بندی و تریگرهای تخمیر قرمز (هر مخزن ۱۳۲L):'),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                tableHeader: true,
                children: [
                  createCell('مرحله و روز تقریبی', { isHeader: true, widthPercent: 20 }),
                  createCell('تریگر هیدرومتر (SG)', { isHeader: true, widthPercent: 18 }),
                  createCell('دمای هدف کلاهک', { isHeader: true, widthPercent: 16 }),
                  createCell('برنامه Pigeage و هوادهی', { isHeader: true, widthPercent: 22 }),
                  createCell('افزودنی دقیق مخزن A و B', { isHeader: true, widthPercent: 24 }),
                ],
              }),
              new TableRow({ children: [createCell('روز ۱ (تکثیر اولیه)'), createCell('1.092 → 1.085'), createCell('20–22 °C'), createCell('۲ بار در روز (هر ۱۲h) ملایم'), createCell('—')] }),
              new TableRow({ children: [createCell('SNA-1 (روز ۲)', { bgColor: ALT_ROW_COLOR }), createCell('SG = 1.083 (افت ۱۰٪)', { bold: true, bgColor: ALT_ROW_COLOR }), createCell('22–24 °C', { bgColor: ALT_ROW_COLOR }), createCell('۳ بار در روز (هر ۸h) کامل', { bgColor: ALT_ROW_COLOR }), createCell('تزریق 33.00 g Fermaid O در ۴۰۰mL آب ولرم', { bgColor: ALT_ROW_COLOR })] }),
              new TableRow({ children: [createCell('SNA-2 (روز ۳)'), createCell('SG = 1.070 (افت ۲۵٪)', { bold: true }), createCell('25–26 °C'), createCell('۴ بار در روز (هر ۶h) عمیق با پاشش شراب'), createCell('33.00 g Fermaid K + 19.80 g DAP + 1.58 g مکمل روی (پایان نیتروژن معدنی)')] }),
              new TableRow({ children: [createCell('تثبیت رنگ (روز ۴ صبح)', { bgColor: ALT_ROW_COLOR }), createCell('SG = 1.060 (افت ۳۲٪)', { bold: true, bgColor: ALT_ROW_COLOR }), createCell('26–27 °C', { bgColor: ALT_ROW_COLOR }), createCell('۴ بار در روز + جمع‌آوری هسته‌ها با کفگیر', { bgColor: ALT_ROW_COLOR }), createCell('تزریق 13.20 g تانن شراب قرمز (فاز دوم)', { bgColor: ALT_ROW_COLOR })] }),
              new TableRow({ children: [createCell('SNA-3 (روز ۴ عصر)'), createCell('SG = 1.057 (افت ۳۶٪)', { bold: true }), createCell('27–28 °C'), createCell('۳ بار در روز با هوادهی ملایم'), createCell('39.60 g Fermaid O (۱۰۰٪ نیتروژن آلی — پایان تغذیه!)')] }),
              new TableRow({ children: [createCell('پنجره استخراج پوست (روز ۵-۶)', { bgColor: ALT_ROW_COLOR }), createCell('1.045 → 1.012', { bgColor: ALT_ROW_COLOR }), createCell('27.5–28.5 °C (سقف ۲۹.۰)', { bold: true, bgColor: ALT_ROW_COLOR }), createCell('۳ بار در روز غوطه‌ورسازی ملایم', { bgColor: ALT_ROW_COLOR }), createCell('کنترل هیدرومتر و چشیدن هر ۸ ساعت', { bgColor: ALT_ROW_COLOR })] }),
              new TableRow({ children: [createCell('نقطه طلایی پرسینگ! (عصر روز ۶)', { bold: true, bgColor: WARN_BG }), createCell('SG = 1.008 (1.006–1.009)', { bold: true, bgColor: WARN_BG }), createCell('کاهش به 22 °C', { bgColor: WARN_BG }), createCell('توقف کامل! جداسازی پوست و هسته', { bold: true, bgColor: WARN_BG }), createCell('انتقال به ایستگاه ۵: ۱۱۰L آب‌آزاد + ۱۲L پرس سنگین', { bold: true, bgColor: WARN_BG })] }),
            ],
          }),

          createSubHeading('ایستگاه ۴: پروتکل اختصاصی شراب رُزه (۳۶L اولیه ← ۳۲L تخمیری ← ۲۹L نهایی)'),
          createParagraph('۱. آنزیم‌دهی و شفاف‌سازی سرد (Débourbage): در ساعت ۰۳:۳۰ مقدار 1.44 g پودر آنزیم در 50 mL آب سرد به ۳۶ لیتر رُزه اضافه شده و ۲ ساعت در دمای ۱۶-۱۸ درجه بماند. در ساعت ۰۵:۳۰ دوغاب 7.20 g بنتونیت (هیدراته‌شده در ۱۵۰mL آب ۵۰ درجه) اضافه و گالن‌ها به محیط ۴ تا ۸ درجه منتقل شوند. در ساعت ۲۶:۰۰ (پس از ۲۰.۵ ساعت ته‌نشینی) ۳۲ لیتر شیره زلال بالایی سیفون شده و ۴ لیتر لجن دور ریخته شود.'),
          createParagraph('۲. گرم‌سازی فعال، اصلاح اسید و تلقیح: ساعت ۲۶:۰۰ تا ۲۸:۰۰ قرار دادن گالن‌ها در تشت آب ۲۴ درجه تا دما به ۱۷-۱۸ درجه برسد. ساعت ۲۸:۰۰ افزودن 1.12 g تانن سفید + تنظیم pH روی 3.28–3.35 با اسید تارتاریک طبق تست لیوانی (TA ≤ 7.5 g/L). ساعت ۲۸:۰۰ تا ۲۹:۰۰ آب‌دهی 8.00 g مخمر RC-212 با 9.60 g Go-Ferm در آب ۴۳ درجه و هم‌دمایی ۳ مرحله‌ای (+150mL, +250mL, +400mL) و تلقیح در ساعت ۲۹:۰۰.'),
          createParagraph('۳. تخمیر خنک و تغذیه پله‌ای (16–18 °C): در SG 1.083: 6.40 g Fermaid O + 0.48 g مکمل روی. در SG 1.070: 5.76 g Fermaid K + 3.20 g DAP. در SG 1.057: 7.36 g Fermaid O (۱۰۰٪ نیتروژن آلی). پایان تخمیر در SG 0.991–0.992 و قند زیر ۲g/L: ۳۰ ساعت سرمایش در ۱۴ درجه، سیفون ۳۰ لیتر شراب صاف، تست مس، افزودن 7.50 g Bactiless + 2.34 g متابی‌سولفیت و نگهداری ساکن در ۱۴ درجه.'),

          createSubHeading('ایستگاه ۵: پرسینگ قرمز، تکمیل تخمیر مایع و جراحی حذف گوگرد (روز ۶ تا ۲۱)'),
          createParagraph('۱. منطق علمی جداسازی پوست در SG = 1.008: استخراج آنتوسیانین‌ها در روزهای ۴ تا ۶ به اوج (۸۵-۹۰٪) می‌رسد. با عبور الکل از ۱۱٪، حلالیت پوسته هسته افزایش یافته و استخراج فلاوان-۳-ال‌های تلخ شتاب می‌گیرد. جداسازی در SG 1.008 از تداخل گسی هسته با اسید مالیک جلوگیری کرده و بافتی ابریشمی ایجاد می‌کند.'),
          createParagraph('۲. تفکیک شراب آب‌آزاد از پرس سنگین: آب‌آزاد: ۱۱۰ لیتر از مخزن A و ۱۱۰ لیتر از مخزن B (مجموعاً ۲۲۰ لیتر) شراب تراز اول است. پرس سنگین: ۱۲ لیتر از A و ۱۲ لیتر از B (مجموعاً ۲۴ لیتر) در گالن‌های مجزا نگهداری، تا SG 0.993 تخمیر و با 7.20 g باکتیلس + 1.87 g متابی‌سولفیت تیمار شود (هرگز بدون تست حسی با شراب اصلی مخلوط نشود).'),
          createParagraph('۳. تکمیل ۳۲ تا ۳۵ گرم قند باقی‌مانده در فاز مایع (روز ۶ تا ۹): ۱۱۰ لیتر در دمای ۲۲ تا ۲۳ درجه با قفل هوا تا خشکی کامل و مصرف اکسیژن پرسینگ. تایید پایان با هیدرومتر ۰.۹۹۲ تا ۰.۹۹۴ و تست قند احیاکننده (کلینیتست/فهلینگ زیر ۲g/L).'),
          createParagraph('۴. سیفون اول به گالن‌های لب‌به‌لب و تست ۴ لیوانی مس/اسکوربیک در روز ۱۰: انتقال ۱۰۵ لیتر شراب صاف هر مخزن به گالن‌های ۲۰ و ۵ لیتری کاملاً پر. تست ۴ لیوانی: لیوان ۱ شاهد، ۲A مس 0.25mg/L (با سرنگ 0.025mL از استوک ۲ در ۱۰۰mL شراب)، ۲B مس 0.50mg/L (1 قطره)، ۳ تست دی‌سولفیدها با 0.30mL از استوک ۲B اسید اسکوربیک + مس. تصمیم‌گیری: اگر بوی هر ۴ لیوان میوه‌ای بود: بدون مس. اگر ۲A یا ۲B پاک شد: دوز بهینه با استوک ۲ (برای دوز 0.25mg/L در ۱۰۵L: دقیقاً 26.2mL). اگر فقط ۳ پاک شد: اسید اسکوربیک 30mg/L + نیمی از سولفیت و ۴۸ ساعت بعد مس.'),
          createParagraph('۵. قفل بیولوژیکی ۱۰ روزه با Bactiless و متابی‌سولفیت (روز ۱۱ تا ۲۱): افزودن 31.50 g پودر باکتیلس + 8.19 g متابی‌سولفیت پتاسیم در هر ۱۰۵ لیتر؛ ۱۰ روز تماس در ۱۵-۱۶ درجه جهت متلاشی کردن باکتری‌های مالولاکتیک/استیک و رسوب CuS، و سیفون در روز ۲۱.'),

          createSubHeading('ایستگاه ۶: نگهداری لب‌به‌لب، سرمازدایی تارتارات و فینیشینگ حسی (روز ۲۱ تا ۹۵)'),
          createParagraph('۱. نگهداری در گالن‌های لب‌به‌لب و Top-up دوره‌ای: ۵ گالن ۲۰ لیتری برای هر بچ کاملاً پر تا باریک‌ترین نقطه گلوگاه و ۲ لیتر در بطری‌های ۱.۵ و ۰.۵ لیتری. ممنوعیت قطعی روغن پارافین! انجام Top-up هر ۱۰ روز با شراب یدکی یا تیله شیشه‌ای/CO2. استراحت ۴۴ روزه در ۱۴-۱۵ درجه در تاریکی مطلق.'),
          createParagraph('۲. پایدارسازی سرد ۱۴ روزه در دمای ایمن ۰ تا ۲+ درجه (Cold Stabilization - روز ۶۵ تا ۸۰): رسوب بی‌تارتارات پتاسیم و سیفون در حالت سرد در روز ۸۰. حجم نهایی خالص: ۱۰۰ لیتر در هر بچ قرمز (مجموعاً ۲۰۰ لیتر = ۲۶۶ بطری) و ۲۹ لیتر رُزه. آنالیز روز ۸۲: اندازه‌گیری نهایی pH، TA و Free SO2.'),
          createParagraph('۳. تست حسی ۳ لیوانی گلیسیرین و تانن فینیشینگ (روز ۸۵): تست در سه لیوان: شاهد، 2.0 g/L و 3.5 g/L. انتخاب دوز برتر (تا 350g در ۱۰۰L قرمز و تا 43.5g در ۲۹L رُزه). تزریق تانن فینیشینگ: 2.50 g قرمز و 0.44 g سفید. حل کردن در ۲ لیتر شراب ولرم ۲۶ درجه و همگن‌سازی.'),

          createSubHeading('ایستگاه ۷: پروتکل بطری‌گذاری ضد-اکسیداسیون (روز ۹۹ و ۱۰۰)'),
          createParagraph('گام ۱ (روز ۹۹ - ۲۴ ساعت قبل): اندازه‌گیری Free SO2 و تنظیم دقیق سولفیت روی 35 mg/L در قرمز و 30 mg/L در رُزه در دمای ۱۸-۲۰ درجه. فرمول: KMS to Add (g) = [(Target - Measured) × Volume] / 570 (~3.00g در ۱۰۰L قرمز و ~0.87g در ۲۹L رُزه).'),
          createParagraph('گام ۲ (روز ۱۰۰ - ۳۰ دقیقه قبل از پر کردن): تزریق ال-اسید اسکوربیک (3.50 g در ۱۰۰L قرمز و 1.02 g در ۲۹L رُزه) بدون ایجاد کف.'),
          createParagraph('گام ۳: ضدعفونی بطری‌ها با محلول استوک ۳ و بخاردهی سرد چوب‌پنبه‌ها در سطل دردار حاوی آب سولفیته (ممنوعیت خیساندن چوب‌پنبه در آب!).'),
          createParagraph('گام ۴: پر کردن از کف با لوله کفی، رعایت ۱۲-۱۵ میلی‌متر فضای خالی (Ullage)، دمش ۳ ثانیه گاز CO2 در گلوگاه (یا یخ خشک 0.12g تا محو شدن)، تکنیک نخ نایلونی 0.40mm برای تخلیه هوای فشرده هنگام کوبیدن چوب‌پنبه.'),
          createParagraph('گام ۵: استراحت عمودی ۷۲ ساعته در ۱۸ درجه، سپس موم‌بندی گلوگاه با مخلوط بن‌ماری (1040 g موم عسل + 195 g پارافین + 65 g روغن نارگیل در دمای ۸۰ درجه)، و چیدمان افقی برای چوب‌پنبه طبیعی و عمودی برای چوب‌پنبه مصنوعی در دمای ۱۲ تا ۱۵ درجه در تاریکی.'),

          // پیوست عملیاتی ۱: فرم‌های سه‌گانه
          ...createSectionHeading('پیوست عملیاتی ۱: فرم‌های چک‌لیست و ثبت روزانهٔ مخازن (Tank Log Sheets)', 'فرم‌ها'),
          createSubHeading('فرم شماره ۱: چک‌لیست ساعت‌به‌ساعت روز صفر مخازن قرمز A و B'),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                tableHeader: true,
                children: [
                  createCell('گام', { isHeader: true, widthPercent: 6 }),
                  createCell('زمان هدف', { isHeader: true, widthPercent: 16 }),
                  createCell('عملیات اجرایی و دوز دقیق (برای هر مخزن به تنهایی)', { isHeader: true, widthPercent: 42 }),
                  createCell('دمای مجاز', { isHeader: true, widthPercent: 12 }),
                  createCell('وضعیت مخزن A', { isHeader: true, widthPercent: 12 }),
                  createCell('وضعیت مخزن B', { isHeader: true, widthPercent: 12 }),
                ],
              }),
              new TableRow({ children: [createCell('۰'), createCell('پیش از کراش'), createCell('شستشوی مشروط + خشک‌سازی با پنکه + حذف ۱۰۰٪ دمبرگ‌ها + آماده‌سازی ژل بنتونیت رُزه (7.20g در 150mL آب ۵۰°)'), createCell('16–18 °C'), createCell('☐ ساعت: .....'), createCell('☐ ساعت: .....')] }),
              new TableRow({ children: [createCell('۱', { bgColor: ALT_ROW_COLOR }), createCell('ساعت ۰۰:۰۰ (کراش)', { bgColor: ALT_ROW_COLOR }), createCell('کراش ملایم بدون شکستن هسته + پاشش 6.52 g متابی‌سولفیت در ۵۰۰mL آب سرد (25mg/L SO2)', { bgColor: ALT_ROW_COLOR }), createCell('16–18 °C', { bgColor: ALT_ROW_COLOR }), createCell('☐ ساعت: .....', { bgColor: ALT_ROW_COLOR }), createCell('☐ ساعت: .....', { bgColor: ALT_ROW_COLOR })] }),
              new TableRow({ children: [createCell('۲'), createCell('ساعت ۰۲:۰۰ تا ۰۳:۰۰'), createCell('پایش رنگ ماسراسیون رُزه (رویت نمونه صاف + تست کمکی اسید و آب‌اکسیژنه) تا رنگ یاقوتی/مرجانی'), createCell('16–18 °C'), createCell('☐ رنگ تایید شد'), createCell('☐ رنگ تایید شد')] }),
              new TableRow({ children: [createCell('۳', { bgColor: ALT_ROW_COLOR }), createCell('ساعت ۰۳:۰۰ تا ۰۳:۳۰', { bgColor: ALT_ROW_COLOR }), createCell('گازدهی دو گالن رُزه با ۳۵g یخ خشک و کشیدن ۱۸ لیتر آب‌آزاد از هر مخزن (مجموعاً ۳۶ لیتر رُزه)', { bgColor: ALT_ROW_COLOR }), createCell('17–18 °C', { bgColor: ALT_ROW_COLOR }), createCell('☐ ۱۸L کشیده شد', { bgColor: ALT_ROW_COLOR }), createCell('☐ ۱۸L کشیده شد', { bgColor: ALT_ROW_COLOR })] }),
              new TableRow({ children: [createCell('۴'), createCell('ساعت ۰۳:۳۰'), createCell('تزریق 3.43 g متابی‌سولفیت به هر مخزن قرمز + ۱۵ دقیقه بعد 7.26 g آنزیم پکتیک بدون کف + همزدن کامل'), createCell('19–20 °C'), createCell('☐ ساعت: .....'), createCell('☐ ساعت: .....')] }),
              new TableRow({ children: [createCell('۵', { bgColor: ALT_ROW_COLOR }), createCell('ساعت ۱۰:۳۰', { bgColor: ALT_ROW_COLOR }), createCell('تست الکل پکتین (5mL شیره + 10mL الکل ۹۶٪؛ عدم تشکیل لخته = شکست کامل پکتین)', { bgColor: ALT_ROW_COLOR }), createCell('20 °C', { bgColor: ALT_ROW_COLOR }), createCell('☐ تست منفی (پاک)', { bgColor: ALT_ROW_COLOR }), createCell('☐ تست منفی (پاک)', { bgColor: ALT_ROW_COLOR })] }),
              new TableRow({ children: [createCell('۶'), createCell('ساعت ۱۱:۰۰ (تانن ۱)'), createCell('تزریق 3.96 g تانن سفید + 13.20 g تانن قرمز در ۲۵۰mL آب گرم ۳۵ درجه + غوطه‌ورسازی کلاهک'), createCell('20 °C'), createCell('☐ ساعت: .....'), createCell('☐ ساعت: .....')] }),
              new TableRow({ children: [createCell('۷', { bgColor: ALT_ROW_COLOR }), createCell('ساعت ۱۱:۱۵ تا ۱۲:۳۰', { bgColor: ALT_ROW_COLOR }), createCell('تست ۳ لیوانی تارتاریک (۱h تعادل)، کنترل سقف TA ≤ 7.2 g/L و تزریق اسید برای قفل روی pH = 3.52', { bgColor: ALT_ROW_COLOR }), createCell('20 °C', { bgColor: ALT_ROW_COLOR }), createCell('☐ گرم: .....\n☐ pH: .....', { bgColor: ALT_ROW_COLOR }), createCell('☐ گرم: .....\n☐ pH: .....', { bgColor: ALT_ROW_COLOR })] }),
              new TableRow({ children: [createCell('۸'), createCell('ساعت ۱۵:۳۰ تا ۱۶:۰۰'), createCell('حل کردن 39.60 g Go-Ferm در ۸۰۰mL آب ۴۳ درجه ← در ۴۰ درجه افزودن 33.00 g مخمر RC-212 (۲۰ دقیقه)'), createCell('43 → 37 °C'), createCell('☐ ساعت: .....'), createCell('☐ ساعت: .....')] }),
              new TableRow({ children: [createCell('۹', { bgColor: ALT_ROW_COLOR }), createCell('ساعت ۱۶:۰۰ تا ۱۶:۳۰', { bgColor: ALT_ROW_COLOR }), createCell('هم‌دمایی ۳ مرحله‌ای: +500mL (30.5°C) ← +900mL (26.0°C) ← +1500mL (22.5°C) و تلقیح به مخزن', { bgColor: ALT_ROW_COLOR }), createCell('اختلاف < ۳°C', { bgColor: ALT_ROW_COLOR }), createCell('☐ ساعت: .....', { bgColor: ALT_ROW_COLOR }), createCell('☐ ساعت: .....', { bgColor: ALT_ROW_COLOR })] }),
            ],
          }),

          createSubHeading('فرم شماره ۲: جدول لاگ روزانه تخمیر و پس از تخمیر شراب قرمز (مخازن A و B)'),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                tableHeader: true,
                children: [
                  createCell('مرحله / نوبت', { isHeader: true, widthPercent: 15 }),
                  createCell('محدوده دمای مجاز', { isHeader: true, widthPercent: 15 }),
                  createCell('عدد هیدرومتر (SG)', { isHeader: true, widthPercent: 15 }),
                  createCell('برنامه Pigeage', { isHeader: true, widthPercent: 15 }),
                  createCell('عملیات ویژه و تزریق مواد (صرفاً بر اساس تریگر SG)', { isHeader: true, widthPercent: 40 }),
                ],
              }),
              new TableRow({ children: [createCell('روز ۱ - صبح و شب'), createCell('20–22 °C'), createCell('~ 1.092'), createCell('۲ بار در روز ملایم'), createCell('بررسی تشکیل لایهٔ کف سفید و شروع فعالیت مخمر')] }),
              new TableRow({ children: [createCell('تریگر ۱ (SNA-1)', { bold: true, bgColor: ALT_ROW_COLOR }), createCell('22–24 °C', { bgColor: ALT_ROW_COLOR }), createCell('1.083 (افت ۱۰٪ قند)', { bold: true, bgColor: ALT_ROW_COLOR }), createCell('۳ بار در روز کامل', { bgColor: ALT_ROW_COLOR }), createCell('تزریق SNA-1: گاززدایی کلاهک + تزریق 33.00 g Fermaid O حل‌شده در آب ولرم در هر مخزن', { bgColor: ALT_ROW_COLOR })] }),
              new TableRow({ children: [createCell('تریگر ۲ (SNA-2)', { bold: true }), createCell('25–26 °C'), createCell('1.070 (افت ۲۵٪ قند)', { bold: true }), createCell('۴ بار در روز با هوادهی'), createCell('تزریق SNA-2: 33.00 g Fermaid K + 19.80 g DAP + 1.58 g مکمل روی در هر مخزن (پایان نیتروژن معدنی)')] }),
              new TableRow({ children: [createCell('تریگر رنگ فاز ۲', { bold: true, bgColor: ALT_ROW_COLOR }), createCell('26–27 °C', { bgColor: ALT_ROW_COLOR }), createCell('1.060 (افت ۳۲٪ قند)', { bold: true, bgColor: ALT_ROW_COLOR }), createCell('۴ بار در روز با هوادهی', { bgColor: ALT_ROW_COLOR }), createCell('تزریق 13.20 g تانن قرمز + جمع‌آوری هسته‌های کف مخزن با کفگیر مشبک استیل', { bgColor: ALT_ROW_COLOR })] }),
              new TableRow({ children: [createCell('تریگر ۳ (SNA-3)', { bold: true }), createCell('27–28 °C'), createCell('1.057 (افت ۳۶٪ قند)', { bold: true }), createCell('۳ بار در روز ملایم'), createCell('تزریق 39.60 g Fermaid O (۱۰۰٪ نیتروژن آلی — پایان مطلق تغذیهٔ نیتروژنی!)')] }),
              new TableRow({ children: [createCell('پنجره استخراج پوست', { bgColor: ALT_ROW_COLOR }), createCell('27.5–28.5 °C (سقف ۲۹.۰)', { bold: true, bgColor: ALT_ROW_COLOR }), createCell('1.045 → 1.015', { bgColor: ALT_ROW_COLOR }), createCell('۳ بار در روز ملایم', { bgColor: ALT_ROW_COLOR }), createCell('غوطه‌ورسازی بدون له کردن پوست و هسته + چشیدن نمونه هر ۸ ساعت', { bgColor: ALT_ROW_COLOR })] }),
              new TableRow({ children: [createCell('نقطه پرسینگ! (روز ۶)', { bold: true, bgColor: WARN_BG }), createCell('کاهش به 22 °C', { bgColor: WARN_BG }), createCell('1.008 (نقطه پرس)', { bold: true, bgColor: WARN_BG }), createCell('توقف کامل!', { bold: true, bgColor: WARN_BG }), createCell('جداسازی پوست: انتقال ۱۱۰ لیتر آب‌آزاد هر مخزن به ظرف دوم با قفل هوا (۱۲L پرس سنگین مجزا)', { bold: true, bgColor: WARN_BG })] }),
              new TableRow({ children: [createCell('روز ۷ و ۸ (تخمیر مایع)'), createCell('22–23 °C'), createCell('1.008 → 0.995'), createCell('بسته (قفل هوا)'), createCell('مصرف 33 g/L قند باقی‌مانده و اکسیژن پرس در فاز مایع')] }),
              new TableRow({ children: [createCell('روز ۹ (خشکی مطلق)', { bgColor: ALT_ROW_COLOR }), createCell('کاهش به 15–16 °C', { bgColor: ALT_ROW_COLOR }), createCell('0.993 (ثابت ۲۴h)', { bold: true, bgColor: ALT_ROW_COLOR }), createCell('ساکن (ته‌نشینی)', { bgColor: ALT_ROW_COLOR }), createCell('تایید قند احیاکننده زیر ۲g/L با کلینیتست/فهلینگ + ۳۰ ساعت سرما برای رسوب دُرد سنگین', { bgColor: ALT_ROW_COLOR })] }),
              new TableRow({ children: [createCell('روز ۱۰ (سیفون اول)'), createCell('15–16 °C'), createCell('0.993'), createCell('سیفون بسته'), createCell('سیفون ۱۰۵ لیتر شراب صاف به گالن‌های ۲۰ لیتری لب‌به‌لب + اجرای تست ۴ لیوانی مس/اسکوربیک')] }),
              new TableRow({ children: [createCell('روز ۱۱ تا ۲۱ (قفل باکتیلس)', { bgColor: ALT_ROW_COLOR }), createCell('15–16 °C', { bgColor: ALT_ROW_COLOR }), createCell('0.993', { bgColor: ALT_ROW_COLOR }), createCell('همزدن در گالن', { bgColor: ALT_ROW_COLOR }), createCell('تزریق 31.50 g Bactiless + 8.19 g متابی‌سولفیت در هر ۱۰۵L ← ۱۰ روز تماس ← سیفون در روز ۲۱', { bgColor: ALT_ROW_COLOR })] }),
              new TableRow({ children: [createCell('روز ۶۵ تا ۱۰۰ (سرمازدایی/بطری)'), createCell('روز ۶۵–۸۰: 0 تا +2 °C\nروز ۹۹–۱۰۰: 18–20 °C'), createCell('0.993'), createCell('سیفون سرد روز ۸۰'), createCell('روز ۸۰: سیفون سرد (۱۰۰L خالص) | روز ۸۵: تست گلیسیرین + 2.50g تانن قرمز | روز ۹۹: Free SO2 روی 35mg/L (~3.0g KMS) | روز ۱۰۰: 3.50g ویتامین C')] }),
            ],
          }),

          createSubHeading('فرم شماره ۳: چک‌لیست اختصاصی شراب رُزه (۳۶L اولیه ← ۲۹L نهایی)'),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                tableHeader: true,
                children: [
                  createCell('مرحله و زمان', { isHeader: true, widthPercent: 20 }),
                  createCell('عملیات اجرایی و دوز دقیق (کل بچ رُزه)', { isHeader: true, widthPercent: 48 }),
                  createCell('دمای هدف', { isHeader: true, widthPercent: 14 }),
                  createCell('وضعیت اجرا', { isHeader: true, widthPercent: 18 }),
                ],
              }),
              new TableRow({ children: [createCell('ساعت ۰۳:۳۰ (روز ۰)'), createCell('افزودن 1.44 g پودر آنزیم پکتولیتیک به ۳۶ لیتر شیره و نگهداری ۲ ساعت در دمای ملایم'), createCell('16–18 °C'), createCell('☐ ساعت: .....')] }),
              new TableRow({ children: [createCell('ساعت ۰۵:۳۰ (روز ۰)', { bgColor: ALT_ROW_COLOR }), createCell('افزودن دوغاب 7.20 g بنتونیت (هیدراته‌شده در ۱۵۰mL آب ۵۰°) و انتقال به محیط سرد (۲۰.۵h)', { bgColor: ALT_ROW_COLOR }), createCell('4–8 °C', { bgColor: ALT_ROW_COLOR }), createCell('☐ ساعت: .....', { bgColor: ALT_ROW_COLOR })] }),
              new TableRow({ children: [createCell('ساعت ۲۶:۰۰ (روز ۱)'), createCell('سیفون شفاف‌سازی (Débourbage): کشیدن ۳۲ لیتر زلال بالایی به ۲ گالن + گرم‌سازی ۲h در آب ۲۴°'), createCell('6 → 18 °C'), createCell('☐ حجم: ..... L')] }),
              new TableRow({ children: [createCell('ساعت ۲۸:۰۰ (روز ۱)', { bgColor: ALT_ROW_COLOR }), createCell('افزودن 1.12 g تانن سفید + تنظیم pH روی 3.28–3.35 با اسید تارتاریک طبق تست لیوانی (TA ≤ 7.5)', { bgColor: ALT_ROW_COLOR }), createCell('18 °C', { bgColor: ALT_ROW_COLOR }), createCell('☐ اسید: ..... g\n☐ pH: .....', { bgColor: ALT_ROW_COLOR })] }),
              new TableRow({ children: [createCell('ساعت ۲۸ تا ۲۹ (روز ۱)'), createCell('آب‌دهی 8.00 g مخمر RC-212 با 9.60 g Go-Ferm در ۲۰۰mL آب ۴۳° + هم‌دمایی ۳ مرحله‌ای و تلقیح در ۲۹:۰۰'), createCell('18–19 °C'), createCell('☐ ساعت: .....')] }),
              new TableRow({ children: [createCell('در SG = 1.083', { bgColor: ALT_ROW_COLOR }), createCell('تغذیه ۱ رُزه: 6.40 g Fermaid O + 0.48 g مکمل روی (جبران روی جذب‌شده با بنتونیت)', { bgColor: ALT_ROW_COLOR }), createCell('16–18 °C', { bgColor: ALT_ROW_COLOR }), createCell('☐ تاریخ: .....', { bgColor: ALT_ROW_COLOR })] }),
              new TableRow({ children: [createCell('در SG = 1.070'), createCell('تغذیه ۲ رُزه: 5.76 g Fermaid K + 3.20 g DAP (پایان نیتروژن معدنی)'), createCell('16–18 °C'), createCell('☐ تاریخ: .....')] }),
              new TableRow({ children: [createCell('در SG = 1.057', { bgColor: ALT_ROW_COLOR }), createCell('تغذیه ۳ رُزه: 7.36 g Fermaid O (۱۰۰٪ نیتروژن آلی — پایان تغذیه)', { bgColor: ALT_ROW_COLOR }), createCell('17–18 °C', { bgColor: ALT_ROW_COLOR }), createCell('☐ تاریخ: .....', { bgColor: ALT_ROW_COLOR })] }),
              new TableRow({ children: [createCell('در SG = 0.992 (خشکی)'), createCell('تایید قند < 2g/L ← ۳۰h سرما در ۱۴° ← سیفون ۳۰L به گالن لب‌به‌لب ← تست مس ← 7.50g باکتیلس + 2.34g KMS'), createCell('14–15 °C'), createCell('☐ تاریخ: .....')] }),
              new TableRow({ children: [createCell('۱۰ روز بعد تا روز ۶۵', { bgColor: ALT_ROW_COLOR }), createCell('سیفون از روی باکتیلس ← نگهداری کاملاً ساکن در گالن‌های لب‌به‌لب در تاریکی (کنترل Top-up هر ۱۰ روز)', { bgColor: ALT_ROW_COLOR }), createCell('14 °C', { bgColor: ALT_ROW_COLOR }), createCell('☐ سیفون باکتیلس انجام شد', { bgColor: ALT_ROW_COLOR })] }),
              new TableRow({ children: [createCell('روز ۶۵ تا ۸۰'), createCell('پایدارسازی سرد ۱۴ روزه در دمای ایمن ۰ تا ۲+ درجه و سیفون سرد از روی تارتارات (حجم خالص: ۲۹ لیتر)'), createCell('0 تا +2 °C'), createCell('☐ سیفون سرد انجام شد')] }),
              new TableRow({ children: [createCell('روز ۸۵، ۹۹ و ۱۰۰', { bgColor: ALT_ROW_COLOR }), createCell('روز ۸۵: تست گلیسیرین (تا 43.5g) + 0.44g تانن سفید | روز ۹۹: تنظیم Free SO2 روی 30mg/L (~0.87g KMS) | روز ۱۰۰: 1.02g ویتامین C', { bgColor: ALT_ROW_COLOR }), createCell('18–19 °C', { bgColor: ALT_ROW_COLOR }), createCell('☐ بطری‌گیری انجام شد', { bgColor: ALT_ROW_COLOR })] }),
            ],
          }),

          // پیوست ۲: جدول هیدرومتر
          ...createSectionHeading('پیوست عملیاتی ۲: جدول مهندسی تصحیح دمای هیدرومتر (کالیبره‌شده در ۲۰°C)', 'هیدرومتر'),
          createParagraph('فرمول محاسبهٔ وزن مخصوص واقعی: SG_True (20 °C) = SG_Measured + ΔSG_Correction', { bold: true }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                tableHeader: true,
                children: [
                  createCell('دمای فعلی نمونه مایع (°C)', { isHeader: true, widthPercent: 25 }),
                  createCell('ضریب تصحیح (ΔSG)', { isHeader: true, widthPercent: 25 }),
                  createCell('مثال کاربردی (اگر هیدرومتر عدد ۱.۰۰۶۰ را نشان دهد)', { isHeader: true, widthPercent: 50 }),
                ],
              }),
              new TableRow({ children: [createCell('10 °C'), createCell('-0.0016'), createCell('عدد واقعی برابر است با ۱.۰۰۴۴')] }),
              new TableRow({ children: [createCell('12 °C', { bgColor: ALT_ROW_COLOR }), createCell('-0.0013', { bgColor: ALT_ROW_COLOR }), createCell('عدد واقعی برابر است با ۱.۰۰۴۷', { bgColor: ALT_ROW_COLOR })] }),
              new TableRow({ children: [createCell('14 °C'), createCell('-0.0010'), createCell('عدد واقعی برابر است با ۱.۰۰۵۰')] }),
              new TableRow({ children: [createCell('16 °C', { bgColor: ALT_ROW_COLOR }), createCell('-0.0007', { bgColor: ALT_ROW_COLOR }), createCell('عدد واقعی برابر است با ۱.۰۰۵۳', { bgColor: ALT_ROW_COLOR })] }),
              new TableRow({ children: [createCell('18 °C'), createCell('-0.0004'), createCell('عدد واقعی برابر است با ۱.۰۰۵۶')] }),
              new TableRow({ children: [createCell('20 °C (دمای کالیبراسیون)', { bold: true, bgColor: GOLD_BG }), createCell('0.0000', { bold: true, bgColor: GOLD_BG }), createCell('عدد خوانده‌شده کاملاً دقیق است (۱.۰۰۶۰)', { bold: true, bgColor: GOLD_BG })] }),
              new TableRow({ children: [createCell('22 °C'), createCell('+0.0004'), createCell('عدد واقعی برابر است با ۱.۰۰۶۴')] }),
              new TableRow({ children: [createCell('24 °C', { bgColor: ALT_ROW_COLOR }), createCell('+0.0009', { bgColor: ALT_ROW_COLOR }), createCell('عدد واقعی برابر است با ۱.۰۰۶۹', { bgColor: ALT_ROW_COLOR })] }),
              new TableRow({ children: [createCell('26 °C'), createCell('+0.0014'), createCell('عدد واقعی برابر است با ۱.۰۰۷۴')] }),
              new TableRow({ children: [createCell('28 °C (نقطه پرس)', { bold: true, bgColor: WARN_BG }), createCell('+0.0020', { bold: true, bgColor: WARN_BG }), createCell('عدد واقعی برابر است با ۱.۰۰۸۰ (نقطهٔ طلایی پرسینگ!)', { bold: true, bgColor: WARN_BG })] }),
              new TableRow({ children: [createCell('30 °C'), createCell('+0.0026'), createCell('عدد واقعی برابر است با ۱.۰۰۸۶')] }),
              new TableRow({ children: [createCell('32 °C', { bgColor: ALT_ROW_COLOR }), createCell('+0.0032', { bgColor: ALT_ROW_COLOR }), createCell('عدد واقعی برابر است با ۱.۰۰۹۲', { bgColor: ALT_ROW_COLOR })] }),
            ],
          }),

          // پیوست ۳: راهنمای اورژانسی ۵ بحران
          ...createSectionHeading('پیوست عملیاتی ۳: پروتکل‌های اورژانسی مدیریت بحران ۵‌گانه کارگاهی', 'بحران‌ها'),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                tableHeader: true,
                children: [
                  createCell('بحران و نشانه', { isHeader: true, widthPercent: 24 }),
                  createCell('ریشه علمی و خطر', { isHeader: true, widthPercent: 30 }),
                  createCell('اقدام فوری و قطعی در کمتر از ۱۵ دقیقه', { isHeader: true, widthPercent: 46 }),
                ],
              }),
              new TableRow({
                children: [
                  createCell('بحران ۱: دمای ۱۵ سانت زیر کلاهک به ۲۹.۵°C رسیده', { bold: true, bgColor: WARN_BG }),
                  createCell('تضعیف غشای فسفولیپیدی مخمر و جهش اسیدیته فرار (سرکه)', { bgColor: WARN_BG }),
                  createCell('همیشه ۸ بطری ۱.۵L یخ در فریزر داشته باشید. بدنه را شسته و با استوک ۳ ضدعفونی کنید. ۲ تا ۳ بطری یخ زیر کلاهک شناور کرده و پس از ۲۰ دقیقه غوطه‌ورسازید (هر بطری ۵۰۰kJ گرما جذب می‌کند).', { bgColor: WARN_BG }),
                ],
              }),
              new TableRow({
                children: [
                  createCell('بحران ۲: استشمام بوی تخم‌مرغ گندیده (H2S)', { bold: true }),
                  createCell('کمبود نیتروژن یا احیای گوگرد عنصری سم‌پاشی باغ', { bold: true }),
                  createCell('۱. هوادهی پاششی فوری: با پارچ استیل ۲۰ بار مایع را از پایین بردارید و از ارتفاع ۳۰cm بپاشید. ۲. اگر به SG 1.057 نرسیده‌اید نوبت SNA را بزنید؛ اگر عبور کرده‌اید ۱۵g پودر Fermaid O بزنید. ۳. در روز ۱۰ تست مس انجام دهید.'),
                ],
              }),
              new TableRow({
                children: [
                  createCell('بحران ۳: فوران کف هنگام افزودن پودرها', { bold: true, bgColor: ALT_ROW_COLOR }),
                  createCell('خروج ناگهانی گاز CO2 فوق‌اشباع در اثر ایجاد مراکز جوشش', { bgColor: ALT_ROW_COLOR }),
                  createCell('پیشگیری قطعی: هرگز پودر خشک نریزید. ابتدا ۲ دقیقه کلاهک را بکوبید تا گاز خارج شود، سپس پودر حل‌شده در ۵۰۰mL آب ولرم را به آرامی اضافه کنید.', { bgColor: ALT_ROW_COLOR }),
                ],
              }),
              new TableRow({
                children: [
                  createCell('بحران ۴: توقف تخمیر پس از پرسینگ روز ۶', { bold: true, bgColor: WARN_BG }),
                  createCell('شوک سرمایی حین پرسینگ یا کمبود مخمر معلق', { bgColor: WARN_BG }),
                  createCell('گام ۱: دما را به ۲۲-۲۳ درجه برسانید و دُرد نرم را معلق کنید. گام ۲ (در صورت عدم تغییر ۴۸h): ۲۰g Fermaid O به مخزن بزنید. در ظرف ۵ لیتری ۳۰g Go-Ferm در ۶۰۰mL آب ۴۳° حل کرده و ۲۵g مخمر مقاوم EC-1118 اضافه کنید. با ۵۰۰mL شراب + ۵۰۰mL آب + ۲۵g شکر سازگار کرده و با ۲ برابر کردن حجم استارتر به مخزن اضافه کنید.', { bgColor: WARN_BG }),
                ],
              }),
              new TableRow({
                children: [
                  createCell('بحران ۵: بالا زدن چوب‌پنبه در ۷۲h اول', { bold: true }),
                  createCell('فشار هوای فشرده در گلوگاه و عدم انبساط چوب‌پنبه', { bold: true }),
                  createCell('برای هر بطری، نخ نایلونی ۰.۴۰mm یا سوزن ظریف استریل از کنار چوب‌پنبه عبور دهید تا فشار گاز با صدای فیس تخلیه شود. چوب‌پنبه را مجدد هم‌سطح کوبیده و در ساعت ۷۲ موم‌اندود کنید.', { bold: true }),
                ],
              }),
            ],
          }),

          // Sign-off
          new Paragraph({ spacing: { before: 400 } }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 33, type: WidthType.PERCENTAGE },
                    borders: { top: { style: BorderStyle.DASHED, size: 4, color: BORDER_COLOR }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                    margins: { top: 140, bottom: 80, left: 100, right: 100 },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        bidirectional: true,
                        children: [
                          new TextRun({
                            text: 'سرپرست تیم انولوژی و تخمیر\n(Enology Lead)\n\nمحل امضا و تایید',
                            bold: true,
                            size: 17,
                            color: '475569',
                            font: { name: FONT_NAME, cs: FALLBACK_FONT },
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 34, type: WidthType.PERCENTAGE },
                    borders: { top: { style: BorderStyle.DASHED, size: 4, color: BORDER_COLOR }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                    margins: { top: 140, bottom: 80, left: 100, right: 100 },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        bidirectional: true,
                        children: [
                          new TextRun({
                            text: 'مدیر کنترل کیفیت و آزمایشگاه\n(QA & QC Manager)\n\nمحل مهر و تایید',
                            bold: true,
                            size: 17,
                            color: '475569',
                            font: { name: FONT_NAME, cs: FALLBACK_FONT },
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 33, type: WidthType.PERCENTAGE },
                    borders: { top: { style: BorderStyle.DASHED, size: 4, color: BORDER_COLOR }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                    margins: { top: 140, bottom: 80, left: 100, right: 100 },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        bidirectional: true,
                        children: [
                          new TextRun({
                            text: 'مدیر ارشد فنی و اجرایی کارگاه\n(Technical Director)\n\nمحل امضا و صدور مجوز',
                            bold: true,
                            size: 17,
                            color: '475569',
                            font: { name: FONT_NAME, cs: FALLBACK_FONT },
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      },
    ],
  });

  return await Packer.toBuffer(doc);
}

async function run() {
  const publicDir = path.resolve('public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const buffer = await buildCompleteMasterProtocolDocx();
  const filePathPublic = path.join(publicDir, 'Master_Protocol_Rasha_Sardasht_400kg.docx');
  const filePathRoot = path.resolve('Master_Protocol_Rasha_Sardasht_400kg.docx');

  fs.writeFileSync(filePathPublic, buffer);
  fs.writeFileSync(filePathRoot, buffer);
  console.log('Master Protocol DOCX fully updated at:', filePathPublic, 'Size:', buffer.length, 'bytes');
}

run().catch((err) => {
  console.error('Failed to generate DOCX:', err);
  process.exit(1);
});
