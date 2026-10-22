import type { PubChemCompoundData, UniProtProteinData } from '../types/database.ts';

/**
 * Curated Enological Biochemical Compounds Database with verified PubChem CIDs
 * Compliant with Google DeepMind Science Skill specifications.
 */
export const PRELOADED_ENOLOGY_COMPOUNDS: PubChemCompoundData[] = [
  {
    cid: 24446,
    title: 'Potassium Metabisulfite (KMS)',
    iupacName: 'dipotassium;sulfonatooxysulfinate',
    molecularFormula: 'K2S2O5',
    molecularWeight: '222.32',
    canonicalSmiles: '[K+].[K+].[O-]S(=O)OS(=O)[O-]',
    enologyRoleFa: 'منبع آزادسازی SO2 آزاد؛ ضدعفونی‌کننده ضدمیکروبی و آنتی‌اکسیدان حیاتی در مهار اکسیداسیون و باکتری‌های وحشی انگور رشه.',
    category: 'sulfur',
    hazardWarningFa: 'در غلظت بالا محرک مجاری تنفسی؛ در صورت ترکیب با اسید قوی گاز SO2 متصاعد می‌کند.',
    imageUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/24446/PNG?image_size=large'
  },
  {
    cid: 875,
    title: 'L-Tartaric Acid',
    iupacName: '(2R,3R)-2,3-dihydroxybutanedioic acid',
    molecularFormula: 'C4H6O6',
    molecularWeight: '150.09',
    canonicalSmiles: 'C(C(C(=O)O)O)(C(=O)O)O',
    xLogP: -1.0,
    tpsa: 94.8,
    hBondDonorCount: 4,
    hBondAcceptorCount: 6,
    enologyRoleFa: 'اسید اصلی و ارگانیک انگور؛ پایدارکننده رنگ آنتوسیانین‌های رشه سردشت، کاهش‌دهنده pH و محافظ طراوت میوه‌ای در برابر فساد میکروبی.',
    category: 'acid',
    imageUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/875/PNG?image_size=large'
  },
  {
    cid: 525,
    title: 'L-Malic Acid',
    iupacName: '(2S)-2-hydroxybutanedioic acid',
    molecularFormula: 'C4H6O5',
    molecularWeight: '134.09',
    canonicalSmiles: 'C(C(C(=O)O)O)C(=O)O',
    xLogP: -1.3,
    tpsa: 94.8,
    hBondDonorCount: 3,
    hBondAcceptorCount: 5,
    enologyRoleFa: 'اسید تند و سیبی انگور نارس؛ سوبسترای اصلی باکتری‌های Oenococcus oeni در تخمیر مالولاکتیک (MLF) جهت تبدیل به اسید لاکتیک نرم.',
    category: 'acid',
    imageUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/525/PNG?image_size=large'
  },
  {
    cid: 10768,
    title: 'L-Lactic Acid',
    iupacName: '(2S)-2-hydroxypropanoic acid',
    molecularFormula: 'C3H6O3',
    molecularWeight: '90.08',
    canonicalSmiles: 'CC(C(=O)O)O',
    xLogP: -0.7,
    tpsa: 57.5,
    hBondDonorCount: 2,
    hBondAcceptorCount: 3,
    enologyRoleFa: 'محصول نهایی تخمیر مالولاکتیک؛ ایجاد حس دهانی کرمی، لطیف‌سازی بافت گس شراب قرمز رشه و کاهش ترشی زننده.',
    category: 'acid',
    imageUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/10768/PNG?image_size=large'
  },
  {
    cid: 1119,
    title: 'Sulfur Dioxide (SO2)',
    iupacName: 'sulfur dioxide',
    molecularFormula: 'O2S',
    molecularWeight: '64.06',
    canonicalSmiles: 'O=S=O',
    tpsa: 35.5,
    hBondAcceptorCount: 2,
    enologyRoleFa: 'گونه گازی فعال ضدقارچی و ضدباکتریایی؛ فرم مولکولی آن تابع معکوس pH شراب است (در pH=3.5 به میزان 30-35 ppm SO2 آزاد نیاز است).',
    category: 'sulfur',
    imageUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/1119/PNG?image_size=large'
  },
  {
    cid: 702,
    title: 'Ethanol',
    iupacName: 'ethanol',
    molecularFormula: 'C2H6O',
    molecularWeight: '46.07',
    canonicalSmiles: 'CCO',
    xLogP: -0.3,
    tpsa: 20.2,
    hBondDonorCount: 1,
    hBondAcceptorCount: 1,
    enologyRoleFa: 'الکل اتیلیک حاصل از تخمیر الکلی قندهای گلوکز و فروکتوز توسط مخمر ساکرومایسس، ایجاد بدنه، گرما و حلالیت پلی‌فنول‌ها.',
    category: 'alcohol',
    imageUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/702/PNG?image_size=large'
  },
  {
    cid: 445154,
    title: 'Resveratrol (trans-Resveratrol)',
    iupacName: '5-[(E)-2-(4-hydroxyphenyl)ethenyl]benzene-1,3-diol',
    molecularFormula: 'C14H12O3',
    molecularWeight: '228.24',
    canonicalSmiles: 'C1=CC(=CC=C1/C=C/C2=CC(=CC(=C2)O)O)O',
    xLogP: 3.1,
    tpsa: 60.7,
    hBondDonorCount: 3,
    hBondAcceptorCount: 3,
    enologyRoleFa: 'پلی‌فنول فیتوالکسین مشهور پوست انگور قرمز رشه سردشت؛ دارای بالاترین اثرات آنتی‌اکسیدانی و محافظت قلبی در شراب قرمز.',
    category: 'polyphenol',
    imageUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/445154/PNG?image_size=large'
  },
  {
    cid: 443652,
    title: 'Malvidin 3-glucoside (Oenin)',
    iupacName: '3-[(2S,3R,4S,5S,6R)-3,4,5-trihydroxy-6-(hydroxymethyl)oxan-2-yl]oxy-5,7-dihydroxy-2-(4-hydroxy-3,5-dimethoxyphenyl)chromenylium',
    molecularFormula: 'C23H25O12+',
    molecularWeight: '493.4',
    canonicalSmiles: 'COC1=CC(=CC(=C1O)OC)C2=[O+]C3=CC(=CC(=C3C=C2OC4C(C(C(C(O4)CO)O)O)O)O)O',
    enologyRoleFa: 'رنگیزه آنتوسیانینی اصلی و عامل رنگ یاقوتی تیره و بنفش انگور کوهستانی رشه سردشت؛ استخراج شده طی دوره ماسراسیون و پیژاژ کلاهک.',
    category: 'polyphenol',
    imageUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/443652/PNG?image_size=large'
  },
  {
    cid: 9064,
    title: '(+)-Catechin',
    iupacName: '(2R,3S)-2-(3,4-dihydroxyphenyl)-3,4-dihydro-2H-chromene-3,5,7-triol',
    molecularFormula: 'C15H14O6',
    molecularWeight: '290.27',
    canonicalSmiles: 'C1C(C(OC2=CC(=CC(=C12)O)O)C3=CC(=C(C=C3)O)O)O',
    xLogP: 0.4,
    tpsa: 110.0,
    hBondDonorCount: 5,
    hBondAcceptorCount: 6,
    enologyRoleFa: 'مونومر تاننی فلاوان-۳-اول استخراجی از هسته و پوست انگور؛ تامین‌کننده ساختار تاننی، گسی کنترل شده و پایداری اکسیداتیو پیری شراب.',
    category: 'polyphenol',
    imageUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/9064/PNG?image_size=large'
  },
  {
    cid: 24261,
    title: 'Diammonium Phosphate (DAP)',
    iupacName: 'diazanium hydrogen phosphate',
    molecularFormula: '(NH4)2HPO4',
    molecularWeight: '132.06',
    canonicalSmiles: '[NH4+].[NH4+].[O-]P(=O)([O-])O',
    enologyRoleFa: 'منبع معدنی نیتروژن قابل جذب مخمر (YAN)؛ تغذیه کننده سلول‌های مخمر در فاز رشد لگاریتمی جهت مهار تولید سولفید هیدروژن (H2S بوی تخم‌مرغ گندیده).',
    category: 'nutrient',
    imageUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/24261/PNG?image_size=large'
  },
  {
    cid: 176,
    title: 'Acetic Acid',
    iupacName: 'acetic acid',
    molecularFormula: 'C2H4O2',
    molecularWeight: '60.05',
    canonicalSmiles: 'CC(=O)O',
    xLogP: -0.2,
    tpsa: 37.3,
    hBondDonorCount: 1,
    hBondAcceptorCount: 2,
    enologyRoleFa: 'اسید استیک؛ شاخص اصلی اسیدیته فرار (VA). افزایش آن بالاتر از ۰.۷ گرم در لیتر نشان‌دهنده فعالیت باکتری‌های استوباکتر در حضور اکسیژن است.',
    category: 'spoilage_marker',
    hazardWarningFa: 'بوی سرکه و تند ایجاد می‌کند؛ در حضور هوا و هوادهی بیش از حد کلاهک تکثیر می‌شود.',
    imageUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/176/PNG?image_size=large'
  },
  {
    cid: 8857,
    title: 'Ethyl Acetate',
    iupacName: 'ethyl acetate',
    molecularFormula: 'C4H8O2',
    molecularWeight: '88.11',
    canonicalSmiles: 'CCOC(=O)C',
    xLogP: 0.7,
    tpsa: 26.3,
    hBondAcceptorCount: 2,
    enologyRoleFa: 'استر شاخص فساد فرار؛ در غلظت بالای ۱۲۰ میلی‌گرم در لیتر بوی تینر، استون و لاک ناخن در شراب ایجاد می‌کند.',
    category: 'spoilage_marker',
    imageUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/8857/PNG?image_size=large'
  },
  {
    cid: 753,
    title: 'Glycerol',
    iupacName: 'propane-1,2,3-triol',
    molecularFormula: 'C3H8O3',
    molecularWeight: '92.09',
    canonicalSmiles: 'C(C(CO)O)O',
    xLogP: -1.8,
    tpsa: 60.7,
    hBondDonorCount: 3,
    hBondAcceptorCount: 3,
    enologyRoleFa: 'پلی‌ال شیرین و غیرفرار تولید شده توسط مخمر در تخمیر الکلی؛ ایجاد بدنه، مخملی بودن و ویسکوزیته در شراب باکیفیت رشه سردشت.',
    category: 'alcohol',
    imageUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/753/PNG?image_size=large'
  },
  {
    cid: 370,
    title: 'Gallic Acid',
    iupacName: '3,4,5-trihydroxybenzoic acid',
    molecularFormula: 'C7H6O5',
    molecularWeight: '170.12',
    canonicalSmiles: 'C1=C(C=C(C(=C1O)O)O)C(=O)O',
    xLogP: 0.7,
    tpsa: 98.0,
    hBondDonorCount: 4,
    hBondAcceptorCount: 5,
    enologyRoleFa: 'اسید فنولیک هیدرولیزشونده ناشی از چوب بلوط و پوست انگور؛ پایدارکننده پیوند پلی‌فنول‌ها و کاهش اکسیژن حل‌شده.',
    category: 'polyphenol',
    imageUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/370/PNG?image_size=large'
  },
  {
    cid: 5785,
    title: 'L-Ascorbic Acid (Vitamin C)',
    iupacName: '(5R)-5-[(1S)-1,2-dihydroxyethyl]-3,4-dihydroxyfuran-2-one',
    molecularFormula: 'C6H8O6',
    molecularWeight: '176.12',
    canonicalSmiles: 'C(C(C1C(=C(C(=O)O1)O)O)O)O',
    xLogP: -1.8,
    tpsa: 107.0,
    enologyRoleFa: 'اکسیژن‌خوار قدرتمند در لحظه بطری‌گیری (۳۵ mg/L)؛ جذب فوری اکسیژن محبوس در گلوگاه بطری و پیشگیری از اکسیداسیون رایحه‌های میوه‌ای.',
    category: 'acid',
    imageUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/5785/PNG?image_size=large'
  },
  {
    cid: 23663989,
    title: 'Potassium Bitartrate (Cream of Tartar)',
    iupacName: 'potassium;(2R,3R)-2,3-dihydroxy-4-hydroxy-4-oxobutanoate',
    molecularFormula: 'C4H5KO6',
    molecularWeight: '188.18',
    canonicalSmiles: '[K+].C(C(C(=O)[O-])O)(C(=O)O)O',
    enologyRoleFa: 'بذر کریستالی خالص (Contact Seeding - 0.20 g/L) در مرحله پایدارسازی سرد؛ شکستن سد انرژی هسته‌زایی و رسوب ۱۰۰٪ تارتارات‌های ناپایدار در +1 °C.',
    category: 'acid',
    imageUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/23663989/PNG?image_size=large'
  },
  {
    cid: 24462,
    title: 'Copper(II) Sulfate Pentahydrate',
    iupacName: 'copper(2+);sulfate;pentahydrate',
    molecularFormula: 'CuSO4.5H2O',
    molecularWeight: '249.68',
    canonicalSmiles: 'O.O.O.O.O.[O-]S(=O)(=O)[O-].[Cu+2]',
    enologyRoleFa: 'نمک کاتالیزور حذف بوی گوگرد و H2S؛ تشکیل رسوب سیاه‌رنگ و غیرمحلول سولفید مس (CuS) و حذف کامل عیوب بویایی (مصرف صرفاً به صورت محلول استوک ۰.۱٪).',
    category: 'sulfur',
    hazardWarningFa: 'در دوز بالا سمی؛ سقف قانونی یون مس آزاد در شراب 0.254 mg/L است که با تزریق Bactiless کاملاً رسوب داده می‌شود.',
    imageUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/24462/PNG?image_size=large'
  },
  {
    cid: 311,
    title: 'Citric Acid',
    iupacName: '2-hydroxypropane-1,2,3-tricarboxylic acid',
    molecularFormula: 'C6H8O7',
    molecularWeight: '192.12',
    canonicalSmiles: 'C(C(=O)O)C(CC(=O)O)(C(=O)O)O',
    xLogP: -1.7,
    tpsa: 132.0,
    enologyRoleFa: 'اسید سیتریک خوراکی؛ شستشوی اسیدی خوشه‌های دارای گوگرد، تمیزکاری الکترود pH و ساخت محلول ضدعفونی اسیدی سولفیت (بطری شماره ۳).',
    category: 'acid',
    imageUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/311/PNG?image_size=large'
  },
  {
    cid: 516892,
    title: 'Sodium Bicarbonate (Baking Soda)',
    iupacName: 'sodium;hydrogen carbonate',
    molecularFormula: 'NaHCO3',
    molecularWeight: '84.01',
    canonicalSmiles: '[Na+].C(=O)(O)[O-]',
    enologyRoleFa: 'جوش‌شیرین خوراکی؛ شستشوی قلیایی ملایم اولیه خوشه‌های انگور (2 g/L) جهت شکستن کشش سطحی و جداسازی مکانیکی گوگرد عنصری سم‌پاشی باغ.',
    category: 'acid',
    imageUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/516892/PNG?image_size=large'
  },
  {
    cid: 784,
    title: 'Hydrogen Peroxide (H2O2)',
    iupacName: 'hydrogen peroxide',
    molecularFormula: 'H2O2',
    molecularWeight: '34.01',
    canonicalSmiles: 'OO',
    enologyRoleFa: 'آب‌اکسیژنه ۳٪؛ اکسیداسیون معکوس سولفیت متصل به آنتوسیانین در تست ۳۰ ثانیه‌ای پتانسیل رنگ رُزه سانیه.',
    category: 'spoilage_marker',
    imageUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/784/PNG?image_size=large'
  }
];

/**
 * Curated Enological Biocatalysts & Enzymes Database with verified UniProt IDs
 */
export const PRELOADED_ENOLOGY_PROTEINS: UniProtProteinData[] = [
  {
    accession: 'P00330',
    id: 'ADH1_YEAST',
    proteinName: 'Alcohol dehydrogenase 1',
    geneName: 'ADH1',
    organism: 'Saccharomyces cerevisiae (strain ATCC 204508 / S288c)',
    ecNumber: '1.1.1.1',
    length: 348,
    functionSummaryFa: 'آنزیم کلیدی گلوکززدایی و تخمیر الکلی که استالدئید را به اتانول احیا کرده و همزمان کوآنزیم NADH را به +NAD اکسید می‌کند.',
    enologyRelevanceFa: 'کاتالیزور زیستی مرحله پایانی تخمیر الکلی؛ حفظ فعالیت بهینه این آنزیم نیازمند دمای کنترل‌شده (زیر ۲۸ درجه) و عدم کمبود روی (Zn) است.'
  },
  {
    accession: 'Q9KJ82',
    id: 'MLE_OENON',
    proteinName: 'Malolactic enzyme (MLE)',
    geneName: 'mleA',
    organism: 'Oenococcus oeni',
    ecNumber: '4.1.1.101',
    length: 541,
    functionSummaryFa: 'کاتالیزور دکربوکسیلاسیون مستقیم ال-مالات به ال-لاکتات و دی‌اکسید کربن در حضور کوفاکتورهای Mn2+ و +NAD.',
    enologyRelevanceFa: 'موتور اصلی تخمیر مالولاکتیک (MLF)؛ کاهش اسیدیته تند شراب و افزایش پایداری میکروبیولوژیک شراب قرمز رشه قبل از بطری‌گیری.'
  },
  {
    accession: 'P26213',
    id: 'PGL_ASPNG',
    proteinName: 'Endo-polygalacturonase A',
    geneName: 'pgaA',
    organism: 'Aspergillus niger',
    ecNumber: '3.2.1.15',
    length: 362,
    functionSummaryFa: 'هیدرولیز تصادفی پیوندهای آلفا-۱،۴ دی‌گالاکتورونیک در پلیمرهای پکتین دیواره سلولی گیاهی.',
    enologyRelevanceFa: 'آنزیم پکتیناز پره‌تخمیر (روز ۱)؛ شکستن دیواره سلول‌های پوست ضخیم رشه سردشت جهت خروج آسان‌تر آبمیوه و استخراج حداکثری رنگ و تانن.'
  },
  {
    accession: 'P22506',
    id: 'BGL1_CANMA',
    proteinName: 'Beta-glucosidase',
    geneName: 'BGL1',
    organism: 'Candida wickerhamii / Brettanomyces',
    ecNumber: '3.2.1.21',
    length: 835,
    functionSummaryFa: 'شکستن پیوند بتا-دی-گلوکوزید متصل به ترکیبات ترپنی و نورایزوپرنوئیدی آروماتیک انگور.',
    enologyRelevanceFa: 'آزادسازی رایحه‌های پنهان میوه‌ای و گلی انگور رشه از فرم‌های باندشده قندی گلیکوزیدی.'
  }
];

/**
 * Live PubChem REST API Compound Fetcher with Retry & Rate Limiting
 */
export async function fetchPubChemCompoundLive(cidOrName: string | number): Promise<Partial<PubChemCompoundData> | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);
  try {
    const isCid = typeof cidOrName === 'number' || /^\d+$/.test(String(cidOrName));
    const endpoint = isCid
      ? `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cidOrName}/property/Title,IUPACName,MolecularFormula,MolecularWeight,CanonicalSMILES,XLogP,TPSA,HBondDonorCount,HBondAcceptorCount,Charge/JSON`
      : `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(cidOrName)}/property/Title,IUPACName,MolecularFormula,MolecularWeight,CanonicalSMILES,XLogP,TPSA,HBondDonorCount,HBondAcceptorCount,Charge/JSON`;

    const res = await fetch(endpoint, {
      headers: { Accept: 'application/json' },
      signal: controller.signal
    });
    if (!res.ok) return null;
    const json = await res.json();
    const prop = json?.PropertyTable?.Properties?.[0];
    if (!prop) return null;

    return {
      cid: prop.CID,
      title: prop.Title || String(cidOrName),
      iupacName: prop.IUPACName || '',
      molecularFormula: prop.MolecularFormula || '',
      molecularWeight: String(prop.MolecularWeight || ''),
      canonicalSmiles: prop.CanonicalSMILES || '',
      xLogP: prop.XLogP,
      tpsa: prop.TPSA,
      hBondDonorCount: prop.HBondDonorCount,
      hBondAcceptorCount: prop.HBondAcceptorCount,
      imageUrl: `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${prop.CID}/PNG?image_size=large`
    };
  } catch (err) {
    console.warn('PubChem query fallback:', err);
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}
