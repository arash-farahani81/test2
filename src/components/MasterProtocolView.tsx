import React, { useMemo, useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  ShieldCheck,
  Scale,
  FlaskConical,
  Activity,
  AlertTriangle,
  Layers,
  Thermometer,
  Search,
  CheckCircle2,
  Calendar,
  Building2,
  BookOpen,
  ClipboardList,
  Flame,
  Clock,
  HelpCircle,
  Wrench,
  CheckSquare,
  Database,
  Dna
} from 'lucide-react';
import { RASHA_PROTOCOL } from '../data/protocolData.ts';
import {
  useFlexibleProtocol,
  getEffectiveProtocolPlanForBatch
} from '../data/masterProtocolConfig.ts';
import { useEnologyUi } from '../context/EnologyUiContext.tsx';
import { useLocalStorageState } from '../utils/useLocalStorage.ts';
import { exportDocxReport } from '../utils/exportDocxReport.ts';
import { enologyDb } from '../db/enologyDatabase.ts';
import { BioscienceDatabaseView } from './BioscienceDatabaseView.tsx';

export type Pillar4SubView = 'master-protocol' | 'bioscience-kb' | 'export-backup';

interface MasterProtocolViewProps {
  onNavigateToTracking?: () => void;
  onNavigateToTestingGuide?: (
    testId?: string,
    subTab?: 'calculators-sops' | 'troubleshooting-crises' | 'saved-history'
  ) => void;
  onNavigateToCalculators?: (testId?: string) => void;
  initialPillarSubView?: Pillar4SubView;
}

export const MasterProtocolView: React.FC<MasterProtocolViewProps> = ({
  onNavigateToTracking,
  onNavigateToTestingGuide,
  onNavigateToCalculators,
  initialPillarSubView
}) => {
  const [pillarSubView, setPillarSubView] = useLocalStorageState<Pillar4SubView>(
    'enology_pillar4_subview_v1',
    initialPillarSubView || 'master-protocol'
  );
  const [activeTab, setActiveTab] = useLocalStorageState<
    'materials' | 'balance' | 'safety' | 'stations' | 'forms' | 'calibration'
  >('enology_protocol_active_tab', 'materials');
  const [activeSubTab, setActiveSubTab] = useLocalStorageState<'form1' | 'form2' | 'form3' | 'form4'>('enology_protocol_subtab', 'form1');
  const [searchMaterial, setSearchMaterial] = useState('');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  React.useEffect(() => {
    if (initialPillarSubView) {
      setPillarSubView(initialPillarSubView);
    }
  }, [initialPillarSubView, setPillarSubView]);

  // Form 1 Initial Analysis Interactive States (Persisted in LocalStorage)
  const [initBrix, setInitBrix] = useLocalStorageState<string>('enology_init_brix', '22.0');
  const [initSG, setInitSG] = useLocalStorageState<string>('enology_init_sg', '1.092');
  const [initPH, setInitPH] = useLocalStorageState<string>('enology_init_ph', '3.52');
  const [initTA, setInitTA] = useLocalStorageState<string>('enology_init_ta', '6.8');
  const [useDynamicBomMode, setUseDynamicBomMode] = useLocalStorageState<boolean>(
    'enology_protocol_dynamic_bom_v1',
    true
  );

  const { activeBatch, effectiveSingleTankId } = useEnologyUi();
  const { params: flexParams, plan: flexPlan } = useFlexibleProtocol();
  const batchPlan = useMemo(
    () =>
      activeBatch?.protocolParamsSnapshot
        ? getEffectiveProtocolPlanForBatch(activeBatch)
        : flexPlan,
    [activeBatch, flexPlan]
  );

  const sourceMaterials = useDynamicBomMode
    ? batchPlan.dynamicMaterials
    : RASHA_PROTOCOL.materials;
  const sourceVolumeBalances = useDynamicBomMode
    ? batchPlan.dynamicVolumeBalances
    : RASHA_PROTOCOL.volumeBalances;

  const filteredMaterials = sourceMaterials.filter(
    (m) =>
      m.name.includes(searchMaterial) ||
      m.purpose.includes(searchMaterial) ||
      m.totalAmount.includes(searchMaterial)
  );

  const handleDownloadDocx = async () => {
    try {
      await exportDocxReport({
        tankId: effectiveSingleTankId,
        logs: enologyDb.getLogs(undefined, false, activeBatch?.id),
        additions: enologyDb.getAdditions(undefined, false, activeBatch?.id),
        analyses: enologyDb.getLabAnalyses(undefined, false, activeBatch?.id),
        batchName:
          activeBatch?.name ??
          'بچ شماره ۱: انگور رشه سردشت (۴۰۰ کیلوگرم استاندارد)',
        vintageYear: activeBatch?.vintageYear ?? 1403
      });
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error('Error exporting DOCX:', err);
    }
  };

  const handleOpenCalculatorTool = (testId?: string) => {
    if (onNavigateToTestingGuide) {
      onNavigateToTestingGuide(testId, 'calculators-sops');
    } else if (onNavigateToCalculators) {
      onNavigateToCalculators(testId);
    }
  };

  return (
    <div className="my-2 max-w-6xl mx-auto font-['Vazirmatn',sans-serif] space-y-4">
      {/* Compact Sub-View Switcher */}
      <div className="bg-surface border border-line rounded-xl p-2 flex flex-wrap items-center gap-1.5 no-print">
        <button
          type="button"
          onClick={() => setPillarSubView('master-protocol')}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            pillarSubView === 'master-protocol'
              ? 'bg-wine text-white'
              : 'bg-paper border border-line text-ink-soft hover:text-ink'
          }`}
        >
          <FileText className="w-4 h-4 shrink-0" />
          <span>مستندات رسمی مستر پروتکل (SOP-OENO-1405-RS400)</span>
        </button>

        <button
          type="button"
          onClick={() => setPillarSubView('bioscience-kb')}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            pillarSubView === 'bioscience-kb'
              ? 'bg-wine text-white'
              : 'bg-paper border border-line text-ink-soft hover:text-ink'
          }`}
        >
          <Dna className="w-4 h-4 shrink-0" />
          <span>بانک شیمی PubChem و بیوکاتالیزورها (UniProt)</span>
        </button>

        <button
          type="button"
          onClick={() => setPillarSubView('export-backup')}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            pillarSubView === 'export-backup'
              ? 'bg-wine text-white'
              : 'bg-paper border border-line text-ink-soft hover:text-ink'
          }`}
        >
          <Download className="w-4 h-4 shrink-0" />
          <span>مرکز خروجی گزارش‌ها (Word / CSV) و پشتیبان‌گیری (JSON)</span>
        </button>
      </div>

      {pillarSubView === 'bioscience-kb' && (
        <BioscienceDatabaseView
          initialActiveTab="chemicals"
          onNavigateToCalculators={() => handleOpenCalculatorTool('all')}
          onNavigateToLabTool={handleOpenCalculatorTool}
          onNavigateToTracking={onNavigateToTracking}
        />
      )}

      {pillarSubView === 'export-backup' && (
        <BioscienceDatabaseView
          initialActiveTab="backup"
          onNavigateToCalculators={() => handleOpenCalculatorTool('all')}
          onNavigateToLabTool={handleOpenCalculatorTool}
          onNavigateToTracking={onNavigateToTracking}
        />
      )}

      {pillarSubView === 'master-protocol' && (
        <div className="space-y-4">
          <div className="bg-surface rounded-xl shadow-xs border border-line overflow-hidden text-ink">
            {/* Official Corporate Document Header */}
            <div className="bg-surface border-b border-line p-5 text-ink">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-paper text-ink border border-line text-xs px-2.5 py-0.5 rounded-md font-bold">
                      استاندارد رسمی مهندسی انولوژی
                    </span>
                    <span className="text-ink-soft text-xs flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-ink-soft" />
                      کد سند: <strong className="text-ink font-mono">SOP-OENO-1405-RS400</strong>
                    </span>
                    <span className="text-ink-soft text-xs flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-ink-soft" />
                      نسخه {RASHA_PROTOCOL.version} (پروفایل فعال: {flexParams.grapeWeightKg} کیلوگرم)
                    </span>
                  </div>

                  <h1 className="text-xl font-bold text-ink pt-1">
                    {RASHA_PROTOCOL.title}
                  </h1>
                  <p className="text-sm text-ink-soft max-w-3xl leading-relaxed">
                    {RASHA_PROTOCOL.subtitle}
                  </p>
                </div>

                {/* Direct Actions */}
                <div className="flex items-center gap-2.5 shrink-0 flex-wrap no-print">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="bg-paper border border-line text-ink rounded-lg px-4 py-2.5 text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors hover:bg-stone-200/60"
                    title="چاپ به عنوان سند رسمی یا ذخیره در PDF"
                  >
                    <Printer className="w-4 h-4 text-ink-soft" />
                    <span>چاپ A4 / PDF</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadDocx}
                    className="bg-wine text-white font-bold rounded-lg px-4 py-2.5 text-xs flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                  >
                    <Download className="w-4 h-4" />
                    <span>دانلود فایل ورد (.DOCX) شرکتی</span>
                  </button>
                </div>
              </div>

              {downloadSuccess && (
                <div className="mt-3 p-2.5 bg-emerald-50 border border-ok/30 rounded-xl text-ok text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>فایل رسمی ورد با کلیه جداول، فرم‌ها و راست‌چین کامل (RTL) با موفقیت دانلود شد!</span>
                </div>
              )}
            </div>

            {/* Navigation Tabs */}
            <div className="bg-paper border-b border-line p-2 flex flex-wrap gap-1.5 no-print">
              <button
                type="button"
                onClick={() => setActiveTab('materials')}
                className={`px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'materials'
                    ? 'bg-wine text-white'
                    : 'text-ink-soft hover:text-ink hover:bg-surface'
                }`}
              >
                <Scale className="w-4 h-4" />
                <span>جدول جامع ۱۹ ردیفه مواد اولیه</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('balance')}
                className={`px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'balance'
                    ? 'bg-wine text-white'
                    : 'text-ink-soft hover:text-ink hover:bg-surface'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>بخش صفر: موازنه، تجهیزات و واژه‌نامه</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('safety')}
                className={`px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'safety'
                    ? 'bg-wine text-white'
                    : 'text-ink-soft hover:text-ink hover:bg-surface'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>بخش دوم: ایمنی HSE و ۵ محلول استوک</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('stations')}
                className={`px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'stations'
                    ? 'bg-wine text-white'
                    : 'text-ink-soft hover:text-ink hover:bg-surface'
                }`}
              >
                <Activity className="w-4 h-4" />
                <span>ایستگاه‌های عملیاتی ۱ تا ۷</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('forms')}
                className={`px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'forms'
                    ? 'bg-wine text-white'
                    : 'text-ink-soft hover:text-ink hover:bg-surface'
                }`}
              >
                <ClipboardList className="w-4 h-4" />
                <span>فرم‌های ثبت روزانه (لاگ‌شیت ۱، ۲ و ۳)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('calibration')}
                className={`px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'calibration'
                    ? 'bg-wine text-white'
                    : 'text-ink-soft hover:text-ink hover:bg-surface'
                }`}
              >
                <AlertTriangle className="w-4 h-4" />
                <span>کالیبراسیون و مدیریت ۵ بحران</span>
              </button>
            </div>

      <div className="p-5 sm:p-8 space-y-6">
        {/* TAB 1: Materials Table */}
        {activeTab === 'materials' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-ink">
                  بخش اول: جدول جامع مواد اولیه و چک‌لیست وزن‌کشی (۲۰ ردیف استاندارد — مقیاس {flexParams.grapeWeightKg} کیلوگرم)
                </h2>
                <p className="text-xs text-ink-soft mt-0.5">
                  تمام مقادیر بر اساس نرخ دوز انتخابی شما و حجم واقعی هر ایستگاه ({flexPlan.volumes.redLiquidFermentPerTankL}L تخمیری ← {flexPlan.volumes.rack1PerTankL}L سیفون روز ۱۰ ← {flexPlan.volumes.finalRedPerTankL}L نهایی) محاسبه شده‌اند.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 no-print">
                <button
                  type="button"
                  onClick={() => setUseDynamicBomMode((prev) => !prev)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer transition-colors ${
                    useDynamicBomMode
                      ? 'bg-wine text-white border-wine'
                      : 'bg-paper text-ink border-line'
                  }`}
                >
                  {useDynamicBomMode
                    ? '● حالت محاسبه پویا (Dynamic Plan فعال)'
                    : 'حالت متن ثابت مرجع (نسخه ۳.۲)'}
                </button>

                {/* Search */}
                <div className="relative w-full sm:w-56">
                  <Search className="w-4 h-4 text-ink-soft absolute right-3 top-2.5" />
                  <input
                    type="text"
                    value={searchMaterial}
                    onChange={(e) => setSearchMaterial(e.target.value)}
                    placeholder="جستجو در مواد اولیه..."
                    className="w-full text-xs rounded-xl border border-line bg-paper text-ink pr-9 pl-3 py-2 focus:border-wine focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="border border-line rounded-xl overflow-hidden overflow-x-auto shadow-xs">
              <table className="w-full text-right text-xs border-collapse">
                <thead className="bg-paper text-ink font-bold border-b border-line">
                  <tr>
                    <th className="py-2.5 px-2.5 w-10 text-center border-l border-line">ردیف</th>
                    <th className="py-2.5 px-3 min-w-[150px] border-l border-line">نام ماده</th>
                    <th className="py-2.5 px-3 min-w-[120px] text-center border-l border-line">کل نیاز پروژه</th>
                    <th className="py-2.5 px-3 min-w-[140px] border-l border-line">نرخ دوز استاندارد</th>
                    <th className="py-2.5 px-3 min-w-[130px] border-l border-line">
                      سهم مخزن A ({flexPlan.volumes.redLiquidFermentPerTankL}L)
                    </th>
                    <th className="py-2.5 px-3 min-w-[130px] border-l border-line">
                      سهم مخزن B ({flexPlan.volumes.redLiquidFermentPerTankL}L)
                    </th>
                    <th className="py-2.5 px-3 min-w-[120px] border-l border-line">
                      سهم شراب رُزه ({flexPlan.volumes.roseClarifiedFermentL}L)
                    </th>
                    <th className="py-2.5 px-3 min-w-[170px]">زمان و هدف مصرف</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {filteredMaterials.map((item, idx) => (
                    <tr
                      key={item.row}
                      className={`hover:bg-rose-50/40 transition-colors ${
                        idx % 2 === 1 ? 'bg-stone-50' : 'bg-white'
                      }`}
                    >
                      <td className="py-2.5 px-2.5 text-center font-bold text-stone-600 border-l border-stone-200">
                        {item.row}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-stone-900 border-l border-stone-200">
                        {item.name}
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-rose-900 border-l border-stone-200">
                        {item.totalAmount}
                      </td>
                      <td className="py-2.5 px-3 text-stone-700 border-l border-stone-200 whitespace-pre-line text-xs">
                        {item.doseRate}
                      </td>
                      <td className="py-2.5 px-3 text-stone-800 border-l border-stone-200 whitespace-pre-line text-xs">
                        {item.tankA}
                      </td>
                      <td className="py-2.5 px-3 text-stone-800 border-l border-stone-200 whitespace-pre-line text-xs">
                        {item.tankB}
                      </td>
                      <td className="py-2.5 px-3 text-stone-800 border-l border-stone-200 whitespace-pre-line text-xs">
                        {item.roseShare}
                      </td>
                      <td className="py-2.5 px-3 text-stone-600 text-xs">
                        {item.purpose}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: Section 0 - Balance, Equipment & Glossary */}
        {activeTab === 'balance' && (
          <div className="space-y-6">
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-xs sm:text-sm text-stone-800 leading-relaxed">
              <strong className="text-amber-950 font-bold block mb-1">
                قانون طلایی کارگاه (Mass & Volume Balance):
              </strong>
              {RASHA_PROTOCOL.goldenRule}
            </div>

            {/* Sub-section 1: Volume Balance */}
            <div className="space-y-3">
              <h3 className="text-sm sm:text-base font-bold text-stone-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-rose-700" />
                ۱. موازنهٔ مهندسی جرم و حجم (Mass & Volume Balance — مقیاس {flexParams.grapeWeightKg} کیلوگرم)
              </h3>
              <div className="border border-line rounded-xl overflow-hidden shadow-xs">
                <table className="w-full text-right text-xs sm:text-sm border-collapse">
                  <thead className="bg-paper text-ink font-bold border-b border-line">
                    <tr>
                      <th className="py-2.5 px-4 w-1/3 border-l border-line">مرحله و ایستگاه عملیاتی</th>
                      <th className="py-2.5 px-4 w-1/3 border-l border-line">حجم و مقادیر مهندسی</th>
                      <th className="py-2.5 px-4">شرح موازنه و تخصیص مخازن</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {sourceVolumeBalances.map((item, idx) => (
                      <tr key={idx} className={idx % 2 === 1 ? 'bg-stone-50' : 'bg-white'}>
                        <td className="py-3 px-4 font-bold text-stone-900 border-l border-stone-200">{item.stage}</td>
                        <td className="py-3 px-4 font-bold text-rose-900 border-l border-stone-200">{item.volume}</td>
                        <td className="py-3 px-4 text-stone-700 text-xs sm:text-sm">{item.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sub-section 2: Equipment */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm sm:text-base font-bold text-stone-900 flex items-center gap-2">
                <Wrench className="w-4 h-4 text-rose-700" />
                ۲. فهرست ظروف و تجهیزات آزمایشگاهی الزامی
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {RASHA_PROTOCOL.equipment.map((eq, i) => (
                  <div key={i} className="border border-stone-200 bg-stone-50/70 p-4 rounded-xl space-y-2">
                    <h4 className="text-xs sm:text-sm font-bold text-stone-900">{eq.category}</h4>
                    <ul className="space-y-1.5 text-xs text-stone-700">
                      {eq.items.map((item, j) => (
                        <li key={j} className="flex items-start gap-1.5">
                          <span className="text-rose-700 font-bold shrink-0">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Sub-section 3: Glossary */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm sm:text-base font-bold text-stone-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-rose-700" />
                ۳. واژه‌نامهٔ تخصصی کارگاه (Enological Glossary)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {RASHA_PROTOCOL.glossary.map((item, idx) => (
                  <div key={idx} className="border border-stone-200 p-3.5 rounded-xl bg-white shadow-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <strong className="text-xs font-bold text-rose-900">{item.term}</strong>
                      <span className="text-xs font-mono text-stone-500 font-semibold" dir="ltr">
                        {item.enTerm}
                      </span>
                    </div>
                    <p className="text-xs text-stone-700 leading-relaxed">{item.def}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Section 2 - Safety, Cleaning & 5 Stock Solutions */}
        {activeTab === 'safety' && (
          <div className="space-y-6">
            <h2 className="text-base sm:text-lg font-bold text-stone-900">
              بخش دوم: ایمنی صنعتی کارگاه، شستشوی دو مرحله‌ای و ساخت ۵ محلول استوک
            </h2>

            {/* 1. HSE */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-rose-700" />
                ۱. پروتکل ایمنی حیاتی کارگاه (HSE)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {RASHA_PROTOCOL.safetyHSE.map((item, i) => (
                  <div key={i} className="bg-rose-50 border border-rose-200 p-3.5 rounded-xl text-xs space-y-1.5">
                    <strong className="text-rose-950 block">{item.title}</strong>
                    <p className="text-rose-900 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Cleaning */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <Wrench className="w-4 h-4 text-rose-700" />
                ۲. پروتکل دو مرحله‌ای «تمیزکاری قلیایی» و «ضدعفونی اسیدی»
              </h3>
              <div className="border border-stone-200 bg-stone-50 p-4 rounded-xl space-y-2 text-xs sm:text-sm text-stone-800 leading-relaxed">
                <p>
                  <strong className="text-stone-900">{RASHA_PROTOCOL.cleaningProtocol.step1}</strong>
                </p>
                <p>
                  <strong className="text-stone-900">{RASHA_PROTOCOL.cleaningProtocol.step2}</strong>
                </p>
              </div>
            </div>

            {/* 3. Stock Solutions */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-rose-700" />
                ۳. دستور ساخت ۵ محلول استوک کارگاه (آماده‌سازی صبح روز صفر)
              </h3>
              <div className="space-y-3">
                {RASHA_PROTOCOL.stockSolutions.map((sol) => (
                  <div key={sol.num} className="border border-stone-300 rounded-xl p-4 bg-white shadow-xs space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-wine text-white text-xs font-bold font-mono">
                          {sol.num}
                        </span>
                        <strong className="text-sm font-bold text-stone-900">{sol.title}</strong>
                      </div>
                      <span className="text-xs font-mono font-bold text-rose-800 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-md">
                        غلظت: {sol.concentration}
                      </span>
                    </div>
                    <p className="text-xs text-stone-800 bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                      <strong>روش ساخت دقیق:</strong> {sol.formula}
                    </p>
                    <p className="text-xs text-stone-600">
                      <strong>کاربرد و نحوه مصرف:</strong> {sol.usage}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Operational Stations 1 to 7 Full Detailed Text */}
        {activeTab === 'stations' && (
          <div className="space-y-6">
            <h2 className="text-base sm:text-lg font-bold text-stone-900">
              ایستگاه‌های عملیاتی ۱ تا ۷: دستورالعمل اجرایی کامل از پذیرش تا بطری‌گذاری
            </h2>

            {/* Station 1 */}
            <div className="border border-stone-300 rounded-xl p-5 bg-white shadow-xs space-y-3">
              <h3 className="text-sm sm:text-base font-bold text-rose-900 border-b border-rose-200 pb-2">
                ایستگاه ۱: پذیرش انگور، شستشوی مشروط و کراش ملایم (روز صفر)
              </h3>
              <div className="space-y-3 text-xs sm:text-sm text-stone-800 leading-relaxed">
                <div>
                  <h4 className="font-bold text-stone-900 mb-1">۱. پروتکل شستشوی مشروط انگور (حذف ذرات سطحی گوگرد باغ S⁰):</h4>
                  <p>
                    گوگرد عنصری سم‌پاشی‌شده در باغ به صورت ذرات آب‌گریز به لایهٔ مومی سطح حبه (Pruine) می‌چسبد و در صورت ورود به تخمیر به مقدار بیش از 2 mg/L، توسط مخمر به گاز بدبوی H2S احیا می‌شود.
                  </p>
                  <p className="mt-1">
                    <strong>تصمیم‌گیری مهندسی:</strong> اگر باغ در ۴ هفتهٔ پایانی پیش از برداشت سم‌پاشی گوگردی نشده و خوشه‌ها تمیز هستند، انگور را نشویید و مستقیم به مرحلهٔ خوشه‌زدایی بروید. اما اگر آثار غبار گوگرد یا سم‌پاشی دیرهنگام وجود دارد: دو تشت ۱۰۰ لیتری آب سرد (15–18 °C) آماده کنید: در تشت اول 200 g جوش‌شیرین (2 g/L) و در تشت دوم 100 g اسید سیتریک (1 g/L) حل کنید. سبدهای انگور را ۱ دقیقه در تشت اول تکان دهید تا کشش سطحی شکسته شده و ذرات گوگرد جدا شوند، سپس ۳۰ ثانیه در تشت اسیدی و در نهایت آبکشی نمایید. سپس خشک‌سازی کامل با پنکه انجام شود (۲ تا ۳ ساعت) تا رطوبت سطحی کاملاً تبخیر شود.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 mb-1">۲. خوشه‌زدایی دستی، حذف دمبرگ‌های سبز و کراش ملایم:</h4>
                  <p>
                    <strong>حذف ۱۰۰٪ چوب‌های سبز (Jacks) و حبه‌های نارس:</strong> دمبرگ سبز و حبهٔ نارس حاوی متوکسی‌پیرازین‌ها (عطر فلفل دلمه‌ای خام) و کاتچین‌های تلخ هستند؛ از آنجا که تخمیر مالولاکتیک مسدود می‌شود و اسید مالیک ترد در شراب باقی می‌ماند، حضور تانن‌های سبز اثر هم‌افزایی منفی ایجاد کرده و گسی خشنی می‌دهد.
                  </p>
                  <p className="mt-1">
                    <strong>کراش بدون آسیب به هسته:</strong> حبه‌ها طوری له شوند که فقط پوست شکافته شود و پالپ آزاد گردد. شکستن هسته‌ها مطلقاً ممنوع است. توده به دو بخش مساوی در مخزن A (۱۷۵L) و B (۱۷۵L) تقسیم شده و بریکس، SG₀، pH و TA اولیه ثبت گردد.
                  </p>
                </div>
              </div>
            </div>

            {/* Station 2 */}
            <div className="border border-stone-300 rounded-xl p-5 bg-white shadow-xs space-y-3">
              <h3 className="text-sm sm:text-base font-bold text-rose-900 border-b border-rose-200 pb-2">
                ایستگاه ۲: جدول عملیاتی روز صفر — ماسراسیون رُزه، آنزیم، اصلاح اسید و تلقیح مخمر
              </h3>
              <div className="space-y-3 text-xs sm:text-sm text-stone-800 leading-relaxed">
                <p>
                  <strong>گام ۱ (ساعت ۰۰:۰۰ حین کراش):</strong> تزریق دوز اول سولفیت (25 mg/L SO2): برای مخزن A مقدار 6.52 g و برای مخزن B مقدار 6.52 g متابی‌سولفیت در ۵۰۰mL آب سرد لایه‌به‌لایه بپاشید.
                </p>
                <p>
                  <strong>گام ۲ (ساعت ۰۰:۰۰ تا ۰۳:۰۰):</strong> ماسراسیون سرد رُزه و خون‌گیری سانیه: استخراج رنگ یاقوتی روشن طی ۲.۵ تا ۳ ساعت در دمای ۱۶-۱۸ درجه. پایش رنگ در ساعات ۰۲:۰۰، ۰۲:۳۰ و ۰۳:۰۰. خون‌گیری در بستر CO2 با یخ خشک و شیلنگ سیفون: ۱۸ لیتر از A و ۱۸ لیتر از B به گالن‌های رُزه کشیده شود (۳۶ لیتر کل).
                </p>
                <p>
                  <strong>گام ۳ (ساعت ۰۳:۳۰ در قرمز):</strong> تکمیل سولفیت و تزریق آنزیم پکتیک: در هر مخزن ۱۳۲ لیتری، 3.43 g متابی‌سولفیت افزوده شده (رسیدن به 40mg/L)؛ ۱۵ دقیقه بعد 7.26 g آنزیم پکتولیتیک در آب سرد حل و بدون کف اضافه شود. ۷.۵ ساعت استراحت در ۲۰ درجه تا ساعت ۱۱:۰۰ (تست الکل پکتین در ساعت ۱۰:۳۰ با اتانول ۹۶٪).
                </p>
                <p>
                  <strong>گام ۴ (ساعت ۱۱:۰۰ تا ۱۲:۳۰ در قرمز):</strong> تزریق تانن فاز ۱ (3.96g سفید + 13.20g قرمز در آب ۳۵ درجه). تست آزمایشگاهی ۳ لیوانی اسید تارتاریک برای قفل روی pH = 3.52 با رعایت سقف TA ≤ 7.2 g/L.
                </p>
                <p>
                  <strong>گام ۵ (ساعت ۱۵:۳۰ تا ۱۶:۳۰ در قرمز):</strong> بیدارسازی 39.60 g پودر Go-Ferm در آب ۴۳ درجه و افزودن 33.00 g مخمر RC-212 در ۴۰ درجه. هم‌دمایی ۳ مرحله‌ای (+500mL در ۳۰.۵°C، +900mL در ۲۶.۰°C، +1500mL در ۲۲.۵°C) و تلقیح در ساعت ۱۶:۲۵.
                </p>
              </div>
            </div>

            {/* Station 3 */}
            <div className="border border-stone-300 rounded-xl p-5 bg-white shadow-xs space-y-3">
              <h3 className="text-sm sm:text-base font-bold text-rose-900 border-b border-rose-200 pb-2">
                ایستگاه ۳: مدیریت ۶ روز تخمیر شراب قرمز (پروفایل دما، Pigeage، YAN و تغذیه SNA)
              </h3>
              <div className="space-y-3 text-xs sm:text-sm text-stone-800 leading-relaxed">
                <p>
                  <strong>۱. محاسبات مهندسی YAN:</strong> نیاز کل نیتروژن برای بریکس ۲۲ (قند واقعی 239.8 g/L با احتساب چگالی SG=1.090) برابر با 216–235 mg N/L است. با کسر 100 mg/L نیتروژن طبیعی انگور رشه، باید 116 تا 135 mg N/L نیتروژن تکمیلی در ۳ مرحله SNA تامین شود (تمام نیتروژن معدنی DAP و Fermaid K در نوبت دوم SG=1.070 و در نوبت سوم SG=1.057 منحصراً ۱۰۰٪ نیتروژن ارگانیک Fermaid O تزریق گردد).
                </p>
                <p>
                  <strong>۲. تریگرهای شناور SG:</strong> فرمول SG_Trigger = SG₀ - f × (SG₀ - 0.993). تریگر ۱ (f=0.10) برابر با 1.083 (33.00g Fermaid O). تریگر ۲ (f=0.25) برابر با 1.070 (33.00g Fermaid K + 19.80g DAP + 1.58g روی). تریگر رنگ (f=0.32) برابر با 1.060. تریگر ۳ (f=0.36) برابر با 1.057 (39.60g Fermaid O — ۱۰۰٪ نیتروژن آلی؛ ممنوعیت مطلق DAP و Fermaid K).
                </p>
                <p>
                  <strong>۳. قوانین اجرایی:</strong> ممنوعیت رفراکتومتر پس از تلقیح (فقط هیدرومتر). سقف دمای کلاهک ۲۷ تا ۲۸.۵ درجه؛ خط قرمز ۲۹.۵ درجه (بطری‌های یخ فریزر). نقطه طلایی پرسینگ در SG = 1.008 در روز ششم.
                </p>
              </div>
            </div>

            {/* Station 4 */}
            <div className="border border-stone-300 rounded-xl p-5 bg-white shadow-xs space-y-3">
              <h3 className="text-sm sm:text-base font-bold text-rose-900 border-b border-rose-200 pb-2">
                ایستگاه ۴: پروتکل اختصاصی شراب رُزه (۳۶L اولیه ← ۳۲L تخمیری ← ۲۹L نهایی)
              </h3>
              <div className="space-y-3 text-xs sm:text-sm text-stone-800 leading-relaxed">
                <p>
                  <strong>۱. آنزیم‌دهی و Débourbage سرد:</strong> افزودن 1.44 g آنزیم در دمای ۱۶-۱۸ درجه؛ ۲ ساعت بعد افزودن ژل 7.20 g بنتونیت و نگهداری ۲۰.۵ ساعت در ۴-۸ درجه؛ سیفون ۳۲ لیتر زلال بالایی (دور ریختن ۴ لیتر لجن گوگردی).
                </p>
                <p>
                  <strong>۲. گرم‌سازی فعال و تلقیح:</strong> قرار دادن گالن‌ها در تشت آب ۲۴ درجه تا دما به ۱۷-۱۸ درجه برسد. افزودن 1.12 g تانن سفید + تنظیم pH روی 3.28–3.35 با اسید تارتاریک (TA ≤ 7.5). تلقیح 8.00 g مخمر با 9.60 g Go-Ferm پس از هم‌دمایی ۳ مرحله‌ای.
                </p>
                <p>
                  <strong>۳. تخمیر خنک و تغذیه پله‌ای (16–18 °C):</strong> تغذیه در سه پله: SG 1.083 (6.40g Fermaid O + 0.48g روی)، SG 1.070 (5.76g Fermaid K + 3.20g DAP) و SG 1.057 (7.36g Fermaid O — ۱۰۰٪ ارگانیک). پایان تخمیر در SG 0.991–0.992: ۳۰ ساعت سرما در ۱۴ درجه، سیفون ۳۰ لیتر، تست مس، افزودن 7.50 g Bactiless + 2.34 g متابی‌سولفیت و نگهداری ساکن.
                </p>
              </div>
            </div>

            {/* Station 5 */}
            <div className="border border-stone-300 rounded-xl p-5 bg-white shadow-xs space-y-3">
              <h3 className="text-sm sm:text-base font-bold text-rose-900 border-b border-rose-200 pb-2">
                ایستگاه ۵: پرسینگ قرمز، تکمیل تخمیر مایع و جراحی حذف گوگرد (روز ۶ تا ۲۱)
              </h3>
              <div className="space-y-3 text-xs sm:text-sm text-stone-800 leading-relaxed">
                <p>
                  <strong>۱. منطق علمی جداسازی در SG = 1.008:</strong> اوج استخراج رنگ و مهار حل شدن تانن‌های تلخ هسته.
                </p>
                <p>
                  <strong>۲. تفکیک آب‌آزاد از پرس سنگین:</strong> ۱۱۰ لیتر آب‌آزاد هر مخزن (۲۲۰ لیتر کل) شراب اصلی است. ۱۲ لیتر پرس سنگین هر مخزن در گالن‌های مجزا تا SG 0.993 تخمیر و با 7.20 g باکتیلس و 1.87 g متابی‌سولفیت تیمار شود.
                </p>
                <p>
                  <strong>۳. تکمیل تخمیر قند باقی‌مانده (روز ۶ تا ۹):</strong> ۱۱۰ لیتر در دمای ۲۲-۲۳ درجه با قفل هوا تا خشکی کامل و مصرف اکسیژن پرسینگ. تایید با هیدرومتر 0.992–0.994 و تست قند احیاکننده زیر ۲g/L.
                </p>
                <p>
                  <strong>۴. سیفون روز ۱۰ و تست ۴ لیوانی مس/اسکوربیک:</strong> انتقال ۱۰۵ لیتر شراب صاف به گالن‌های لب‌به‌لب. تست ۴ لیوانی: لیوان ۱ شاهد، ۲A مس 0.25mg/L، ۲B مس 0.50mg/L، ۳ اسکوربیک + مس برای شکستن دی‌سولفیدها. تزریق کمترین دوز موثر با سرنگ از استوک ۲.
                </p>
                <p>
                  <strong>۵. قفل بیولوژیکی ۱۰ روزه با باکتیلس:</strong> افزودن 31.50 g باکتیلس + 8.19 g متابی‌سولفیت در هر ۱۰۵ لیتر شراب؛ ۱۰ روز تماس در ۱۵-۱۶ درجه جهت لیز باکتری‌ها و رسوب CuS، و سیفون در روز ۲۱.
                </p>
              </div>
            </div>

            {/* Station 6 */}
            <div className="border border-stone-300 rounded-xl p-5 bg-white shadow-xs space-y-3">
              <h3 className="text-sm sm:text-base font-bold text-rose-900 border-b border-rose-200 pb-2">
                ایستگاه ۶: نگهداری لب‌به‌لب، سرمازدایی تارتارات و فینیشینگ حسی (روز ۲۱ تا ۹۵)
              </h3>
              <div className="space-y-3 text-xs sm:text-sm text-stone-800 leading-relaxed">
                <p>
                  <strong>۱. نگهداری لب‌به‌لب و Top-up دوره‌ای:</strong> ۵ گالن ۲۰ لیتری برای هر بچ کاملاً پر تا باریک‌ترین نقطه گلوگاه و ۲ لیتر در بطری‌های ۱.۵ و ۰.۵ لیتری. ممنوعیت روغن پارافین! انجام Top-up هر ۱۰ روز با شراب یدکی. استراحت در ۱۴-۱۵ درجه در تاریکی.
                </p>
                <p>
                  <strong>۲. پایدارسازی سرد ۱۴ روزه (0 تا +2 °C - روز ۶۵ تا ۸۰):</strong> رسوب بی‌تارتارات پتاسیم و سیفون در حالت سرد در روز ۸۰. حجم نهایی خالص: ۱۰۰ لیتر در هر بچ قرمز (۲۰۰ لیتر کل = ۲۶۶ بطری) و ۲۹ لیتر رُزه.
                </p>
                <p>
                  <strong>۳. تست حسی ۳ لیوانی گلیسیرین و تانن فینیشینگ (روز ۸۵):</strong> تست در ۳ لیوان: شاهد، 2.0 g/L و 3.5 g/L. انتخاب دوز برتر (تا 350g در ۱۰۰L قرمز و تا 43.5g در ۲۹L رُزه). افزودن 2.50 g تانن فینیشینگ در ۲ لیتر شراب ولرم ۲۶ درجه و همگن‌سازی.
                </p>
              </div>
            </div>

            {/* Station 7 */}
            <div className="border border-stone-300 rounded-xl p-5 bg-white shadow-xs space-y-3">
              <h3 className="text-sm sm:text-base font-bold text-rose-900 border-b border-rose-200 pb-2">
                ایستگاه ۷: پروتکل بطری‌گذاری ضد-اکسیداسیون (روز ۹۹ و ۱۰۰)
              </h3>
              <div className="space-y-3 text-xs sm:text-sm text-stone-800 leading-relaxed">
                <p>
                  <strong>گام ۱ (روز ۹۹ - ۲۴h قبل):</strong> تنظیم Free SO2 روی 35 mg/L در قرمز (~3.00g KMS در ۱۰۰L) و 30 mg/L در رُزه (~0.87g KMS) در دمای ۱۸-۲۰ درجه.
                </p>
                <p>
                  <strong>گام ۲ (روز ۱۰۰ - ۳۰ تا ۶۰ دقیقه قبل بطری):</strong> تزریق ال-اسید اسکوربیک (3.50 g در ۱۰۰L قرمز و 1.02 g در ۲۹L رُزه).
                </p>
                <p>
                  <strong>گام ۳:</strong> ضدعفونی بطری‌ها با استوک ۳ و بخاردهی سرد چوب‌پنبه‌ها در سطل SO2 (ممنوعیت خیساندن در آب!).
                </p>
                <p>
                  <strong>گام ۴:</strong> پر کردن از کف با ۱۲-۱۵mm فضای خالی (Ullage)، دمش ۳ ثانیه گاز CO2 در گلوگاه، تکنیک نخ نایلونی 0.40mm جهت تخلیه فشار هوای زیر چوب‌پنبه.
                </p>
                <p>
                  <strong>گام ۵:</strong> استراحت عمودی ۷۲ ساعته در ۱۸ درجه، سپس موم‌بندی گلوگاه با مخلوط بن‌ماری (1040 g موم عسل + 195 g پارافین + 65 g روغن نارگیل در دمای ۸۰ درجه)، و ایجینگ در انبار ۱۲-۱۵ درجه در تاریکی.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: Operational Forms 1, 2, 3 */}
        {activeTab === 'forms' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-stone-900">
                  پیوست عملیاتی ۱: فرم‌های چک‌لیست و ثبت روزانهٔ مخازن (Tank Log Sheets)
                </h2>
                <p className="text-xs text-stone-500">
                  آمادهٔ چاپ و تکمیل روزانه در ایستگاه‌های تخمیر مخازن A، B و رُزه
                </p>
              </div>

              {/* Sub-tabs for Form 1, 2, 3 */}
              <div className="flex items-center gap-1 bg-paper border border-line p-1 rounded-xl no-print">
                <button
                  type="button"
                  onClick={() => setActiveSubTab('form1')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                    activeSubTab === 'form1' ? 'bg-wine text-white' : 'text-ink-soft hover:text-ink'
                  }`}
                >
                  فرم ۱: روز صفر
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSubTab('form2')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                    activeSubTab === 'form2' ? 'bg-wine text-white' : 'text-ink-soft hover:text-ink'
                  }`}
                >
                  فرم ۲: تخمیر قرمز
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSubTab('form3')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                    activeSubTab === 'form3' ? 'bg-wine text-white' : 'text-ink-soft hover:text-ink'
                  }`}
                >
                  فرم ۳: شراب رُزه
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSubTab('form4')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                    activeSubTab === 'form4' ? 'bg-wine text-white' : 'text-ink-soft hover:text-ink'
                  }`}
                >
                  فرم ۴: پرس سنگین
                </button>
              </div>
            </div>

            {/* FORM 1 */}
            {activeSubTab === 'form1' && (
              <div className="space-y-3">
                <div className="bg-stone-50 border border-stone-200 p-3 rounded-xl text-xs space-y-1">
                  <p className="font-bold text-stone-900">
                    فرم شماره ۱: چک‌لیست ساعت‌به‌ساعت روز صفر (پذیرش، سانیه، آنزیم، اسید و تلقیح) — مخازن قرمز A و B
                  </p>
                  <p className="text-stone-600">
                    حجم اولیه: ۱۷۵L توده = ۱۵۰L مایع | حجم پس از سانیه در ساعت ۰۳:۰۰: ۱۳۲L مایع در هر مخزن
                  </p>
                  <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-semibold text-stone-800">
                    <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-stone-300">
                      <span>بریکس اولیه:</span>
                      <input
                        type="text"
                        value={initBrix}
                        onChange={(e) => setInitBrix(e.target.value)}
                        className="w-14 text-center font-mono font-bold text-rose-900 focus:outline-none bg-stone-50 border border-stone-200 rounded px-1"
                        placeholder="22.0"
                      />
                    </div>
                    <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-stone-300">
                      <span>وزن مخصوص اولیه (SG₀):</span>
                      <input
                        type="text"
                        value={initSG}
                        onChange={(e) => setInitSG(e.target.value)}
                        className="w-16 text-center font-mono font-bold text-rose-900 focus:outline-none bg-stone-50 border border-stone-200 rounded px-1"
                        placeholder="1.092"
                      />
                    </div>
                    <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-stone-300">
                      <span>pH اولیه:</span>
                      <input
                        type="text"
                        value={initPH}
                        onChange={(e) => setInitPH(e.target.value)}
                        className="w-14 text-center font-mono font-bold text-rose-900 focus:outline-none bg-stone-50 border border-stone-200 rounded px-1"
                        placeholder="3.52"
                      />
                    </div>
                    <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-stone-300">
                      <span>TA اولیه (g/L):</span>
                      <input
                        type="text"
                        value={initTA}
                        onChange={(e) => setInitTA(e.target.value)}
                        className="w-14 text-center font-mono font-bold text-rose-900 focus:outline-none bg-stone-50 border border-stone-200 rounded px-1"
                        placeholder="6.8"
                      />
                    </div>
                  </div>
                </div>

                <div className="border border-line rounded-xl overflow-hidden overflow-x-auto shadow-xs">
                  <table className="w-full text-right text-xs border-collapse">
                    <thead className="bg-paper text-ink font-bold border-b border-line">
                      <tr>
                        <th className="py-2.5 px-2.5 w-10 text-center border-l border-line">گام</th>
                        <th className="py-2.5 px-3 min-w-[130px] border-l border-line">زمان هدف (روز صفر)</th>
                        <th className="py-2.5 px-3 min-w-[280px] border-l border-line">عملیات اجرایی و دوز دقیق (هر مخزن به تنهایی)</th>
                        <th className="py-2.5 px-3 min-w-[90px] text-center border-l border-line">دمای مجاز</th>
                        <th className="py-2.5 px-3 min-w-[120px] text-center border-l border-line">وضعیت مخزن A</th>
                        <th className="py-2.5 px-3 min-w-[120px] text-center">وضعیت مخزن B</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                      {RASHA_PROTOCOL.form1Steps.map((row, idx) => (
                        <tr key={idx} className={idx % 2 === 1 ? 'bg-stone-50' : 'bg-white'}>
                          <td className="py-2.5 px-2.5 text-center font-bold text-stone-600 border-l border-stone-200">
                            {row.step}
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-stone-900 border-l border-stone-200">
                            {row.time}
                          </td>
                          <td className="py-2.5 px-3 text-stone-800 border-l border-stone-200 leading-relaxed">
                            {row.operation}
                          </td>
                          <td className="py-2.5 px-3 text-center font-bold text-rose-900 border-l border-stone-200">
                            {row.temp}
                          </td>
                          <td className="py-2.5 px-3 text-center whitespace-pre-line text-xs text-stone-600 border-l border-stone-200">
                            {row.tankA}
                          </td>
                          <td className="py-2.5 px-3 text-center whitespace-pre-line text-xs text-stone-600">
                            {row.tankB}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* FORM 2 */}
            {activeSubTab === 'form2' && (
              <div className="space-y-3">
                <div className="bg-amber-50 border border-amber-200 p-3 sm:p-4 rounded-xl text-xs space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <p className="font-bold text-amber-950 text-xs sm:text-sm">
                      قانون طلایی اپراتور در فرم شماره ۲ (پایش تخمیر و هیدرومتر):
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {onNavigateToTestingGuide && (
                        <button
                          type="button"
                          onClick={() => onNavigateToTestingGuide('all', 'calculators-sops')}
                          className="px-3 py-1.5 bg-paper hover:bg-surface text-ink border border-line rounded-lg font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0 self-start sm:self-auto"
                        >
                          <FlaskConical className="w-3.5 h-3.5 text-ink-soft" />
                          <span>راهنمای آزمون‌ها و ماشین‌حساب‌های آزمایشگاهی (SOP)</span>
                        </button>
                      )}
                      {onNavigateToTracking && (
                        <button
                          type="button"
                          onClick={onNavigateToTracking}
                          className="px-3 py-1.5 bg-wine text-white rounded-lg font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0 self-start sm:self-auto"
                        >
                          <Activity className="w-3.5 h-3.5" />
                          <span>ورود به بخش ثبت زنده و نمودارهای تحلیلی</span>
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-amber-900 leading-relaxed">
                    ستون «روز» فقط یک راهنمای تقریبی است؛ ملاک تزریق مواد مغذی (SNA)، تانن فاز ۲ و پرسینگ، صرفاً رسیدن هیدرومتر به عدد وزن مخصوص (SG) تصحیح‌شده در جدول است، نه ساعت یا روز! همچنین خط قرمز دمای کلاهک ۲۹.۵ درجه است (در صورت رسیدن به ۲۹.۵ درجه بلافاصله بطری یخ ضدعفونی‌شده وارد شود).
                  </p>
                </div>

                <div className="border border-line rounded-xl overflow-hidden overflow-x-auto shadow-xs">
                  <table className="w-full text-right text-xs border-collapse">
                    <thead className="bg-paper text-ink font-bold border-b border-line">
                      <tr>
                        <th className="py-2.5 px-3 min-w-[130px] border-l border-line">مرحله / نوبت</th>
                        <th className="py-2.5 px-2.5 w-16 text-center border-l border-line">دمای اتاق</th>
                        <th className="py-2.5 px-2.5 w-16 text-center border-l border-line">دمای کلاهک</th>
                        <th className="py-2.5 px-3 min-w-[110px] text-center border-l border-line">محدوده مجاز</th>
                        <th className="py-2.5 px-3 min-w-[110px] text-center border-l border-line">هیدرومتر (SG)</th>
                        <th className="py-2.5 px-3 min-w-[110px] text-center border-l border-line">Pigeage</th>
                        <th className="py-2.5 px-3 min-w-[260px] border-l border-line">عملیات ویژه و تزریق مواد (بر پایه SG)</th>
                        <th className="py-2.5 px-3 min-w-[110px] text-center">کنترل بویایی</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                      {RASHA_PROTOCOL.form2Logs.map((row, idx) => (
                        <tr
                          key={idx}
                          className={
                            row.phase.includes('پرسینگ')
                              ? 'bg-rose-100 font-bold'
                              : row.phase.includes('تریگر')
                              ? 'bg-amber-50 font-semibold'
                              : idx % 2 === 1
                              ? 'bg-stone-50'
                              : 'bg-white'
                          }
                        >
                          <td className="py-2.5 px-3 font-bold text-stone-900 border-l border-stone-200">
                            {row.phase}
                          </td>
                          <td className="py-2.5 px-2.5 text-center text-stone-400 border-l border-stone-200 font-mono">
                            {row.tempRoom}
                          </td>
                          <td className="py-2.5 px-2.5 text-center text-stone-400 border-l border-stone-200 font-mono">
                            {row.tempCap}
                          </td>
                          <td className="py-2.5 px-3 text-center font-bold text-rose-900 border-l border-stone-200">
                            {row.tempAllowed}
                          </td>
                          <td className="py-2.5 px-3 text-center font-bold text-stone-900 border-l border-stone-200">
                            {row.sg}
                          </td>
                          <td className="py-2.5 px-3 text-center text-stone-700 border-l border-stone-200 text-xs">
                            {row.pigeage}
                          </td>
                          <td className="py-2.5 px-3 text-stone-800 border-l border-stone-200 leading-relaxed text-xs">
                            {row.specialOp}
                          </td>
                          <td className="py-2.5 px-3 text-center text-stone-700 text-xs whitespace-pre-line">
                            {row.sensory}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* FORM 3 */}
            {activeSubTab === 'form3' && (
              <div className="space-y-3">
                <div className="bg-stone-50 border border-stone-200 p-3 rounded-xl text-xs space-y-1">
                  <p className="font-bold text-stone-900">
                    فرم شماره ۳: چک‌لیست اختصاصی شراب رُزه (۳۶ لیتر اولیه ← ۳۲ لیتر تخمیری ← ۳۰ لیتر پس از دُرد ← ۲۹ لیتر نهایی)
                  </p>
                </div>

                <div className="border border-line rounded-xl overflow-hidden overflow-x-auto shadow-xs">
                  <table className="w-full text-right text-xs border-collapse">
                    <thead className="bg-paper text-ink font-bold border-b border-line">
                      <tr>
                        <th className="py-2.5 px-3 min-w-[130px] border-l border-line">مرحله و زمان</th>
                        <th className="py-2.5 px-3 min-w-[320px] border-l border-line">عملیات اجرایی و دوز دقیق (برای کل بچ رُزه)</th>
                        <th className="py-2.5 px-3 min-w-[100px] text-center border-l border-line">دمای هدف</th>
                        <th className="py-2.5 px-3 min-w-[130px] text-center">وضعیت اجرا (امضا / ثبت)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                      {RASHA_PROTOCOL.form3RoseLogs.map((row, idx) => (
                        <tr key={idx} className={idx % 2 === 1 ? 'bg-stone-50' : 'bg-white'}>
                          <td className="py-2.5 px-3 font-bold text-stone-900 border-l border-stone-200">
                            {row.stage}
                          </td>
                          <td className="py-2.5 px-3 text-stone-800 border-l border-stone-200 leading-relaxed">
                            {row.op}
                          </td>
                          <td className="py-2.5 px-3 text-center font-bold text-rose-900 border-l border-stone-200">
                            {row.targetTemp}
                          </td>
                          <td className="py-2.5 px-3 text-center text-stone-600 text-xs whitespace-pre-line">
                            {row.status}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* FORM 4 */}
            {activeSubTab === 'form4' && (
              <div className="space-y-3">
                <div className="bg-stone-50 border border-stone-200 p-3 rounded-xl text-xs space-y-1">
                  <p className="font-bold text-stone-900">
                    فرم شماره ۴: چک‌لیست اختصاصی شراب پرس سنگین (۲۴ لیتر مجموع دو مخزن)
                  </p>
                  <p className="text-stone-600">
                    حجم: ۲۴ لیتر (۱۲L از مخزن A + ۱۲L از مخزن B) — نگهداری کاملاً مجزا از شراب اصلی
                  </p>
                </div>

                <div className="border border-line rounded-xl overflow-hidden overflow-x-auto shadow-xs">
                  <table className="w-full text-right text-xs border-collapse">
                    <thead className="bg-paper text-ink font-bold border-b border-line">
                      <tr>
                        <th className="py-2.5 px-3 min-w-[160px] border-l border-line">مرحله و زمان</th>
                        <th className="py-2.5 px-3 min-w-[320px] border-l border-line">عملیات اجرایی و دوز دقیق (شراب پرس سنگین - ۲۴L)</th>
                        <th className="py-2.5 px-3 min-w-[140px] text-center">وضعیت اجرا (تاریخ / عدد / امضا)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                      {RASHA_PROTOCOL.form4HeavyPressLogs.map((row, idx) => (
                        <tr key={idx} className={idx % 2 === 1 ? 'bg-stone-50' : 'bg-white'}>
                          <td className="py-2.5 px-3 font-bold text-stone-900 border-l border-stone-200">
                            {row.stage}
                          </td>
                          <td className="py-2.5 px-3 text-stone-800 border-l border-stone-200 leading-relaxed">
                            {row.op}
                          </td>
                          <td className="py-2.5 px-3 text-center text-stone-600 text-xs whitespace-pre-line">
                            {row.status}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: Hydrometer Calibration & 5 Crises Troubleshooting */}
        {activeTab === 'calibration' && (
          <div className="space-y-6">
            {/* Calibration Table */}
            <div className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-ink flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-ink-soft" />
                بخش دوم پیوست: جدول مهندسی تصحیح دمای هیدرومتر (کالیبره‌شده در ۲۰°C)
              </h2>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <p className="text-xs text-ink-soft font-semibold">
                  فرمول محاسبه وزن مخصوص واقعی: SG_True(20°C) = SG_Measured + ΔSG_Correction
                </p>
                {onNavigateToTestingGuide && (
                  <button
                    type="button"
                    onClick={() => onNavigateToTestingGuide('sop-01', 'calculators-sops')}
                    className="px-3 py-1.5 bg-wine text-white rounded-lg font-bold text-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                  >
                    <FlaskConical className="w-3.5 h-3.5" />
                    <span>ورود به ماشین‌حساب زنده تصحیح دمایی و راهنمای تست</span>
                  </button>
                )}
              </div>

              <div className="border border-line rounded-xl overflow-hidden shadow-xs">
                <table className="w-full text-right text-xs sm:text-sm border-collapse">
                  <thead className="bg-paper text-ink font-bold border-b border-line">
                    <tr>
                      <th className="py-2.5 px-4 w-1/4 border-l border-line">دمای فعلی نمونه مایع (°C)</th>
                      <th className="py-2.5 px-4 w-1/4 border-l border-line text-center">ضریب تصحیح (ΔSG)</th>
                      <th className="py-2.5 px-4">مثال کاربردی (اگر هیدرومتر ۱.۰۰۶۰ را نشان دهد)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {RASHA_PROTOCOL.hydrometerTable.map((item, idx) => (
                      <tr
                        key={idx}
                        className={
                          item.temp.includes('کالیبراسیون')
                            ? 'bg-amber-100 font-bold'
                            : item.temp.includes('پرسینگ')
                            ? 'bg-rose-100 font-bold'
                            : idx % 2 === 1
                            ? 'bg-stone-50'
                            : 'bg-white'
                        }
                      >
                        <td className="py-2.5 px-4 border-l border-stone-200">{item.temp}</td>
                        <td className="py-2.5 px-4 text-center font-bold text-rose-900 border-l border-stone-200">
                          {item.deltaSG}
                        </td>
                        <td className="py-2.5 px-4 text-stone-800">{item.example}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 5 Crises Troubleshooting */}
            <div className="space-y-3 pt-3">
              <h2 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-700" />
                بخش سوم پیوست: پروتکل‌های اورژانسی مدیریت بحران ۵‌گانه کارگاهی (Troubleshooting)
              </h2>

              <div className="space-y-3">
                {RASHA_PROTOCOL.crises.map((item) => (
                  <div key={item.id} className="border border-stone-300 rounded-xl p-4 bg-white shadow-xs space-y-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0" />
                      <h3 className="font-bold text-stone-900 text-sm">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-xs text-stone-700 bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                      <strong className="text-stone-900">ریشه علمی و خطر:</strong> {item.danger}
                    </p>
                    <p className="text-xs text-rose-950 bg-rose-50/80 p-2.5 rounded-lg border border-rose-200 leading-relaxed">
                      <strong className="text-rose-900">اقدام فوری و قطعی:</strong> {item.action}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Official Corporate Sign-off Footer */}
        <div className="pt-8 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-xs">
          <div className="border border-dashed border-stone-300 p-4 rounded-xl">
            <p className="font-bold text-stone-800 mb-1">سرپرست تیم انولوژی و تخمیر</p>
            <p className="text-stone-500 mb-6">Enology Lead</p>
            <div className="w-28 h-0.5 bg-stone-300 mx-auto mb-1"></div>
            <p className="text-xs text-stone-400">محل امضا و تایید فرمولاسیون</p>
          </div>

          <div className="border border-dashed border-stone-300 p-4 rounded-xl">
            <p className="font-bold text-stone-800 mb-1">مدیر کنترل کیفیت و آزمایشگاه</p>
            <p className="text-stone-500 mb-6">QA & QC Manager</p>
            <div className="w-28 h-0.5 bg-stone-300 mx-auto mb-1"></div>
            <p className="text-xs text-stone-400">محل مهر و تایید بهداشتی</p>
          </div>

          <div className="border border-dashed border-stone-300 p-4 rounded-xl">
            <p className="font-bold text-stone-800 mb-1">مدیر ارشد فنی و اجرایی کارگاه</p>
            <p className="text-stone-500 mb-6">Technical Director</p>
            <div className="w-28 h-0.5 bg-stone-300 mx-auto mb-1"></div>
            <p className="text-xs text-stone-400">محل امضا و صدور مجوز بطری‌گذاری</p>
          </div>
        </div>
      </div>
          </div>
        </div>
      )}
    </div>
  );
};
