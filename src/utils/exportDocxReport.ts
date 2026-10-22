import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  HeadingLevel,
  AlignmentType,
  WidthType,
  ShadingType
} from 'docx';
import fileSaver from 'file-saver';
const saveAs = fileSaver.saveAs || fileSaver;
import type { FermentationLogEntry, TankId } from '../types/tracking.ts';
import type { ChemicalAddition, LabAnalysisRecord } from '../types/database.ts';
import { compareRealLogsWithBenchmark } from './trackingCalculations.ts';
import { getCurrentDynamicProtocolPlan, type DynamicProtocolPlan } from '../data/masterProtocolConfig.ts';
import { enologyDb } from '../db/enologyDatabase.ts';

export interface DocxReportOptions {
  tankId: TankId;
  batchId?: string;
  logs: FermentationLogEntry[];
  additions?: ChemicalAddition[];
  analyses?: LabAnalysisRecord[];
  batchName?: string;
  vintageYear?: number;
  plan?: DynamicProtocolPlan;
}

/**
 * Generates and downloads a rich Microsoft Word (.docx) report
 * for Rasha Sardasht Enology Master Protocol (with Dynamic Flexible Protocol & OIV SO2 Ledger)
 */
export async function exportDocxReport(options: DocxReportOptions): Promise<void> {
  const activePlan = options.plan || getCurrentDynamicProtocolPlan();
  const { volumes: v, dosages: d, triggers: t, params: p, nitrogen: n } = activePlan;

  const {
    tankId,
    logs,
    additions = [],
    analyses = [],
    batchName = `بچ مهندسی انگور رشه سردشت (${p.grapeWeightKg} کیلوگرم — پروفایل ${
      p.presetId === 'conservative_ideal' ? 'توصیه بهینه استاندارد' : p.presetId === 'classic_v32' ? 'سند کلاسیک v3.2' : 'سفارشی کارگاه'
    })`,
    vintageYear = 1405
  } = options;

  const tankName =
    tankId === 'tank-a'
      ? `مخزن قرمز A (بچ اول ${v.redLiquidFermentPerTankL} لیتر مایع / ${v.redMashAfterSaigneePerTankL} لیتر مش)`
      : tankId === 'tank-b'
      ? `مخزن قرمز B (بچ دوم ${v.redLiquidFermentPerTankL} لیتر مایع / ${v.redMashAfterSaigneePerTankL} لیتر مش)`
      : `مخزن شراب رُزه (${v.roseClarifiedFermentL} لیتر شیره شفاف)`;

  const tankLogs = logs
    .filter((l) => l.tankId === tankId)
    .sort((a, b) => a.dayNumber - b.dayNumber || a.id.localeCompare(b.id));

  const benchmarkLogs = tankLogs.filter((l) => l.isBenchmark === true);
  const realLogs = tankLogs.filter((l) => l.isBenchmark !== true);
  const comparison = compareRealLogsWithBenchmark(realLogs, benchmarkLogs, tankId);

  const latestLog = realLogs.length > 0
    ? realLogs[realLogs.length - 1]
    : tankLogs[tankLogs.length - 1];

  const so2RefVolL = tankId === 'tank-rose' ? v.rosePostRackingL : v.rack1PerTankL;
  const liveSo2Ledger = enologyDb.getCumulativeSO2Ledger(
    tankId,
    so2RefVolL,
    1.5,
    undefined,
    false,
    options.batchId
  );

  const nowStr = new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    calendar: 'persian'
  }).format(new Date());

  // Helper for RTL cell styling
  const headerCell = (text: string, widthPct: number) =>
    new TableCell({
      width: { size: widthPct, type: WidthType.PERCENTAGE },
      shading: { fill: '881337', type: ShadingType.CLEAR }, // Deep Rose
      children: [
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [new TextRun({ text, bold: true, color: 'FFFFFF', size: 18 })]
        })
      ]
    });

  const dataCell = (text: string, widthPct: number, bold = false, bgHex = 'FFFFFF') =>
    new TableCell({
      width: { size: widthPct, type: WidthType.PERCENTAGE },
      shading: bgHex !== 'FFFFFF' ? { fill: bgHex, type: ShadingType.CLEAR } : undefined,
      children: [
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [new TextRun({ text, bold, size: 18, color: '1C1917' })]
        })
      ]
    });

  // 1. Cover / Title Paragraphs
  const titleParagraph = new Paragraph({
    heading: HeadingLevel.HEADING_1,
    alignment: AlignmentType.RIGHT,
    spacing: { after: 120 },
    children: [
      new TextRun({
        text: 'گزارش جامع انولوژی و پایش تخمیر شراب انگور رشه سردشت (SOP-OENO-1405-RS400)',
        bold: true,
        size: 32,
        color: '881337'
      })
    ]
  });

  const subTitleParagraph = new Paragraph({
    alignment: AlignmentType.RIGHT,
    spacing: { after: 240 },
    children: [
      new TextRun({
        text: `مستر پروتکل کارگاه مهندسی انولوژی | ${batchName} | سال برداشت: ${vintageYear}`,
        size: 20,
        color: '57534E'
      })
    ]
  });

  const metaParagraph = new Paragraph({
    alignment: AlignmentType.RIGHT,
    spacing: { after: 300 },
    children: [
      new TextRun({ text: `شناسه مخزن: ${tankName} | `, bold: true, size: 18 }),
      new TextRun({ text: `تاریخ صدور گزارش: ${nowStr} | `, size: 18 }),
      new TextRun({
        text: realLogs.length > 0
          ? `وضعیت: ثبت واقعی کارگاه فعال (${realLogs.length} لاگ)`
          : 'وضعیت: منحنی مرجع ایده‌آل (آماده‌باش ثبت)',
        bold: true,
        color: realLogs.length > 0 ? '047857' : '6D28D9',
        size: 18
      })
    ]
  });

  // 2. Summary & Final Status Table
  const summaryHeader = new Paragraph({
    heading: HeadingLevel.HEADING_2,
    alignment: AlignmentType.RIGHT,
    spacing: { before: 200, after: 120 },
    children: [
      new TextRun({
        text: '۱. خلاصه وضعیت نهایی تخمیر و شاخص‌های بیوشیمیایی',
        bold: true,
        size: 24,
        color: '1C1917'
      })
    ]
  });

  const summaryTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          headerCell('شاخص بیوشیمیایی', 30),
          headerCell('مقدار اندازه‌گیری شده', 30),
          headerCell('بازه استاندارد پروتکل رشه', 40)
        ]
      }),
      new TableRow({
        children: [
          dataCell('وزن مخصوص فعلی (SG)', 30, true),
          dataCell(latestLog ? `${latestLog.sg}` : `${t.initialSG}`, 30, true, 'FFF1F2'),
          dataCell(`${t.initialSG.toFixed(3)} (شروع) → 0.993 (خشکی کامل) | پرسینگ: ${t.pressingSG.toFixed(3)}`, 40)
        ]
      }),
      new TableRow({
        children: [
          dataCell('درجه بریکس (°Bx)', 30),
          dataCell(latestLog ? `${latestLog.brix}° Bx` : `${p.initialBrix}° Bx`, 30),
          dataCell(`${p.initialBrix}° Bx → 0.0° Bx (مصرف کامل قند)`, 40)
        ]
      }),
      new TableRow({
        children: [
          dataCell('دمای مرکز کلاهک (°C)', 30),
          dataCell(latestLog ? `${latestLog.tempCap}°C` : '22.0°C', 30, true, latestLog && latestLog.tempCap >= 28.5 ? 'FEF2F2' : 'FFFFFF'),
          dataCell('سقف مجاز: 28.5°C | بحران: 29.5°C', 40)
        ]
      }),
      new TableRow({
        children: [
          dataCell('شاخص اسیدیته (pH)', 30),
          dataCell(latestLog ? `${latestLog.ph}` : `${p.targetRedPH}`, 30),
          dataCell(tankId === 'tank-rose' ? `3.28 تا 3.38 (هدف: ${p.targetRosePH})` : `3.48 تا 3.55 (هدف: ${p.targetRedPH})`, 40)
        ]
      }),
      new TableRow({
        children: [
          dataCell('درجه انطباق با منحنی مرجع', 30, true),
          dataCell(comparison.hasRealLogs ? `${comparison.alignmentScore}٪ انطباق` : '100٪ (منحنی مرجع)', 30, true, 'F0FDF4'),
          dataCell(comparison.statusTitle, 40)
        ]
      })
    ]
  });

  // 2B. Mass/Volume Balance, YAN Budget & Cumulative OIV SO2 Ledger Section
  const massBalanceHeader = new Paragraph({
    heading: HeadingLevel.HEADING_2,
    alignment: AlignmentType.RIGHT,
    spacing: { before: 300, after: 120 },
    children: [
      new TextRun({
        text: '۲. موازنه حجمی، بودجه نیتروژن (YAN) و سقف تجمعی گوگرد (OIV Total SO₂ Ledger)',
        bold: true,
        size: 24,
        color: '1C1917'
      })
    ]
  });

  const massBalanceTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          headerCell('پارامتر مهندسی / استوکیومتری', 35),
          headerCell('مقدار محاسبه‌شده بچ فعلی', 30),
          headerCell('استاندارد مرجع و توضیحات بیوشیمیایی', 35)
        ]
      }),
      new TableRow({
        children: [
          dataCell('وزن انگور و حجم توده کراش (Mash)', 35, true),
          dataCell(`${p.grapeWeightKg} kg ← ${v.totalCrushedMashL} L (${v.crushedMashPerTankL}L هر مخزن)`, 30, true),
          dataCell(`فاز مایع اولیه: ${v.initialLiquidL}L (${v.initialLiquidPerTankL}L هر مخزن)`, 35)
        ]
      }),
      new TableRow({
        children: [
          dataCell('حجم خون‌گیری سانیه رُزه و تخمیر قرمز', 35, true),
          dataCell(`سانیه رُزه: ${v.saigneeTotalL}L (${v.roseClarifiedFermentL}L صاف) | قرمز هر مخزن: ${v.redLiquidFermentPerTankL}L مایع`, 30),
          dataCell(`مش کل هر مخزن قرمز پس از سانیه: ${v.redMashAfterSaigneePerTankL}L (ضریب مایع ۸۴٪)`, 35)
        ]
      }),
      new TableRow({
        children: [
          dataCell('راندمان پس از پرسینگ و بطری نهایی', 35, true),
          dataCell(`Free-Run هر بچ: ${v.freeRunPerTankL}L | نهایی کل: ${v.finalRedTotalL}L قرمز + ${v.roseFinalBottlingL}L رُزه`, 30, true, 'ECFDF5'),
          dataCell(`کل بطری ۷۵۰mL: ${v.totalBottles750ml} بطری (${v.redBottles750ml} قرمز + ${v.roseBottles750ml} رُزه) + ${v.heavyPressTotalL}L پرس سنگین`, 35)
        ]
      }),
      new TableRow({
        children: [
          dataCell('بودجه نیتروژن مخمر (YAN — شراب قرمز)', 35, true),
          dataCell(`نیاز هدف: ${n.targetYANMgL} mg/L | تامین بیواکویوالان: +${n.suppliedBioEquivalentYANRedMgL} mg/L`, 30),
          dataCell(`YAN پایه شیره: ${p.naturalMustYANMgL} mg/L → نیاز YAN: ${n.neededYANMgL} mg/L (SNA 3 پله‌ای)`, 35)
        ]
      }),
      new TableRow({
        children: [
          dataCell('دفتر کل گوگرد تجمعی (Total SO₂ Ledger)', 35, true),
          dataCell(`از KMS ثبت‌شده: ${liveSo2Ledger.addedFromKmsMgL} mg/L + مخمر: ${liveSo2Ledger.endogenousYeastMgL} mg/L = کل: ${liveSo2Ledger.estimatedTotalSO2MgL} mg/L`, 30, true, 'FFF1F2'),
          dataCell(`سقف قانونی OIV: ${liveSo2Ledger.legalCeilingMgL} mg/L | حاشیه امن باقی‌مانده: ${liveSo2Ledger.remainingBudgetMgL} mg/L`, 35)
        ]
      })
    ]
  });

  // 3. Detailed Diagnostic Summary Paragraphs
  const diagnosticHeader = new Paragraph({
    heading: HeadingLevel.HEADING_2,
    alignment: AlignmentType.RIGHT,
    spacing: { before: 300, after: 120 },
    children: [
      new TextRun({
        text: '۳. ارزیابی انولوژی و راهکارهای کارگاهی',
        bold: true,
        size: 24,
        color: '1C1917'
      })
    ]
  });

  const diagnosticText = new Paragraph({
    alignment: AlignmentType.RIGHT,
    spacing: { after: 180 },
    children: [
      new TextRun({ text: 'تحلیل وضعیت: ', bold: true, size: 20, color: '881337' }),
      new TextRun({ text: comparison.comparisonDetails, size: 20 })
    ]
  });

  const actionText = new Paragraph({
    alignment: AlignmentType.RIGHT,
    spacing: { after: 240 },
    children: [
      new TextRun({ text: 'توصیه و اقدام اجرایی بعدی: ', bold: true, size: 20, color: '047857' }),
      new TextRun({ text: comparison.actionableGuidance, size: 20, bold: true })
    ]
  });

  // 4. Logsheet History Table Section
  const logTableHeader = new Paragraph({
    heading: HeadingLevel.HEADING_2,
    alignment: AlignmentType.RIGHT,
    spacing: { before: 300, after: 120 },
    children: [
      new TextRun({
        text: '۴. جدول سوابق لاگ‌شیت پایش روزانه (Logsheet Records)',
        bold: true,
        size: 24,
        color: '1C1917'
      })
    ]
  });

  const logRows: TableRow[] = [
    new TableRow({
      children: [
        headerCell('نوع', 10),
        headerCell('روز', 8),
        headerCell('تاریخ/ساعت', 14),
        headerCell('مرحله / تریگر', 20),
        headerCell('SG', 9),
        headerCell('بریکس', 9),
        headerCell('دما', 9),
        headerCell('pH', 8),
        headerCell('یادداشت و اقدامات کارگاهی', 13)
      ]
    })
  ];

  tankLogs.forEach((item, idx) => {
    const bg = idx % 2 === 1 ? 'F5F5F4' : 'FFFFFF';
    logRows.push(
      new TableRow({
        children: [
          dataCell(item.isBenchmark ? 'مرجع' : 'واقعی', 10, true, item.isBenchmark ? 'F3E8FF' : 'ECFDF5'),
          dataCell(`روز ${item.dayNumber}`, 8, true, bg),
          dataCell(item.dateTime, 14, false, bg),
          dataCell(item.stageTitle, 20, item.isTriggerPoint, bg),
          dataCell(`${item.sg}`, 9, true, bg),
          dataCell(`${item.brix}°`, 9, false, bg),
          dataCell(`${item.tempCap}°C`, 9, false, bg),
          dataCell(`${item.ph}`, 8, false, bg),
          dataCell(item.operationNote || '—', 13, false, bg)
        ]
      })
    );
  });

  const logHistoryTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: logRows
  });

  // 5. Chemical Additions Section (Logsheet 3)
  const additionsHeader = new Paragraph({
    heading: HeadingLevel.HEADING_2,
    alignment: AlignmentType.RIGHT,
    spacing: { before: 300, after: 120 },
    children: [
      new TextRun({
        text: '۵. جدول ثبت افزوده‌های شیمیایی و تغذیه پله‌ای (Logsheet 3)',
        bold: true,
        size: 24,
        color: '1C1917'
      })
    ]
  });

  const tankAdditions = additions.filter(
    (a) =>
      a.tankId === tankId ||
      ((!a.tankId || (a.tankId as string) === 'both-red') && tankId !== 'tank-rose')
  );

  const additionRows: TableRow[] = [
    new TableRow({
      children: [
        headerCell('زمان ثبت', 18),
        headerCell('مرحله تخمیر', 22),
        headerCell('نام ترکیب شیمیایی', 25),
        headerCell('مقدار دوز', 12),
        headerCell('هدف انولوژی', 23)
      ]
    })
  ];

  if (tankAdditions.length > 0) {
    tankAdditions.forEach((add, i) => {
      const bg = i % 2 === 1 ? 'F5F5F4' : 'FFFFFF';
      additionRows.push(
        new TableRow({
          children: [
            dataCell(add.timestamp, 18, false, bg),
            dataCell(add.stageTitle, 22, true, bg),
            dataCell(add.compoundName, 25, true, bg),
            dataCell(`${add.amount} ${add.unit}`, 12, true, 'FFF1F2'),
            dataCell(add.purpose, 23, false, bg)
          ]
        })
      );
    });
  } else {
    additionRows.push(
      new TableRow({
        children: [
          dataCell('اقدام اولیه روز ۰', 18),
          dataCell('روز ۰: سولفیتاسیون ۲ مرحله‌ای و آنزیم', 22),
          dataCell('KMS (متابی‌سولفیت پتاسیم ۵۷.۶٪) + آنزیم پکتولیتیک + Go-Ferm', 25),
          dataCell(`${d.crushKmsPerTankG}g کراش + ${d.postSaigneeKmsPerTankG}g پس از سانیه`, 12, true, 'FFF1F2'),
          dataCell(`سولفیتاسیون ${p.crushSO2TargetMgL} ppm کراش و تکمیل تا ${p.postSaigneeRedSO2TargetMgL} ppm + شکست پکتین پوست`, 23)
        ]
      })
    );
  }

  const additionsTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: additionRows
  });

  // 5B. Lab Analyses Section
  const tankAnalyses = analyses.filter(
    (a) =>
      a.tankId === tankId ||
      ((!a.tankId || (a.tankId as string) === 'both-red') && tankId !== 'tank-rose')
  );
  const labHeader = new Paragraph({
    heading: HeadingLevel.HEADING_2,
    alignment: AlignmentType.RIGHT,
    spacing: { before: 300, after: 120 },
    children: [
      new TextRun({
        text: '۶. سوابق تست‌های آزمایشگاهی و کنترل کیفیت',
        bold: true,
        size: 24,
        color: '1C1917'
      })
    ]
  });

  const labRows: TableRow[] = [
    new TableRow({
      children: [
        headerCell('تاریخ', 18),
        headerCell('نوع آزمون', 22),
        headerCell('پارامتر هدف', 25),
        headerCell('مقدار', 15),
        headerCell('اقدام اصلاحی', 20)
      ]
    })
  ];

  if (tankAnalyses.length > 0) {
    tankAnalyses.forEach((lab, i) => {
      const bg = i % 2 === 1 ? 'F5F5F4' : 'FFFFFF';
      labRows.push(
        new TableRow({
          children: [
            dataCell(lab.date, 18, false, bg),
            dataCell(lab.testType, 22, false, bg),
            dataCell(lab.targetAnalyte, 25, true, bg),
            dataCell(`${lab.measuredValue} ${lab.unit}`, 15, true, 'ECFDF5'),
            dataCell(lab.actionTaken || '—', 20, false, bg)
          ]
        })
      );
    });
  } else {
    labRows.push(
      new TableRow({
        children: [
          dataCell('روز ۰ (کراش)', 18),
          dataCell('آنالیز پایه شیره', 22),
          dataCell('Brix / SG / pH / TA', 25, true),
          dataCell(`${p.initialBrix}°Bx / ${t.initialSG.toFixed(3)} / pH ${p.targetRedPH}`, 15, true),
          dataCell('ثبت خط مبنای مستر پروتکل', 20)
        ]
      })
    );
  }

  const labAnalysesTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: labRows
  });

  // 6. Final Instructions & Cold Stabilization Guidelines
  const guidelinesHeader = new Paragraph({
    heading: HeadingLevel.HEADING_2,
    alignment: AlignmentType.RIGHT,
    spacing: { before: 300, after: 120 },
    children: [
      new TextRun({
        text: '۷. دستورالعمل‌های مرحله نهایی، سرمایش و بسته‌بندی',
        bold: true,
        size: 24,
        color: '1C1917'
      })
    ]
  });

  const finalInstructions = [
    `۱. سیفون رسوب سنگین (Racking): پس از ۳۰ ساعت سرمایش در دمای ۱۴-۱۵ درجه سانتی‌گراد، ${v.rack1PerTankL} لیتر شراب زلال هر بچ بالا کشیده شده و رسوب دُرد ته مخزن جداسازی شود.`,
    `۲. قفل بیولوژیکی روز ۱۱ (بدون MLF): تزریق ${d.bactilessRedPerTankG} گرم کیتوزان Bactiless به همراه ${d.day11KmsPerTankG} گرم KMS در هر بچ قرمز جهت حذف باکتری‌های لاکتیک و استیک.`,
    `۳. تثبیت سرمایی و بذرپاشی روز ۶۰: افزودن ${d.khtColdStabRedPerTankG} گرم کرم تارتار (0.20 g/L) در دمای +1°C برای رسوب کامل بی‌تارتارات پتاسیم پیش از بطری‌گذاری.`,
    `۴. محافظت پیش از بطری‌گذاری (روز ۱۰۳): تنظیم Free SO2 روی 35 mg/L (${d.preBottlingKmsPerTankG}g KMS در هر بچ) و تزریق ${d.ascorbicRedPerTankG} گرم ال-اسید اسکوربیک ۳۰ دقیقه پیش از پر کردن ${v.totalBottles750ml} بطری ۷۵۰mL.`
  ];

  const instructionParagraphs = finalInstructions.map(
    (text) =>
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        spacing: { after: 80 },
        children: [new TextRun({ text, size: 19, color: '292524' })]
      })
  );

  // Construct Document
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          titleParagraph,
          subTitleParagraph,
          metaParagraph,
          summaryHeader,
          summaryTable,
          massBalanceHeader,
          massBalanceTable,
          diagnosticHeader,
          diagnosticText,
          actionText,
          logTableHeader,
          logHistoryTable,
          additionsHeader,
          additionsTable,
          labHeader,
          labAnalysesTable,
          guidelinesHeader,
          ...instructionParagraphs
        ]
      }
    ]
  });

  // Export Packer to Blob
  const blob = await Packer.toBlob(doc);
  const fileName = `گزارش_انولوژی_مستر_پروتکل_رشه_${tankId}_${Date.now()}.docx`;
  saveAs(blob, fileName);
}

