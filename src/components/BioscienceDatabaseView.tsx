import React, { useState } from 'react';
import {
  Database,
  FlaskConical,
  Dna,
  Search,
  ExternalLink,
  Download,
  Upload,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Atom,
  Layers,
  FileSpreadsheet,
  FileJson,
  Sparkles,
  Info,
  ShieldAlert,
  ChevronRight,
  FileText
} from 'lucide-react';
import {
  PRELOADED_ENOLOGY_COMPOUNDS,
  PRELOADED_ENOLOGY_PROTEINS,
  fetchPubChemCompoundLive
} from '../data/bioscienceData.ts';
import { enologyDb } from '../db/enologyDatabase.ts';
import { exportDocxReport } from '../utils/exportDocxReport.ts';
import { useEnologyUi } from '../context/EnologyUiContext.tsx';
import { PhotoDiaryAndVintagePanel } from './PhotoDiaryAndVintagePanel.tsx';
import type { PubChemCompoundData, UniProtProteinData } from '../types/database.ts';
import type { TankId } from '../types/tracking.ts';

export interface BioscienceDatabaseViewProps {
  onNavigateToCalculators?: () => void;
  onNavigateToTracking?: () => void;
  onNavigateToLabTool?: (testId: string, subTab?: 'calculators-sops' | 'troubleshooting-crises') => void;
  initialActiveTab?: 'chemicals' | 'enzymes' | 'backup';
  hideInternalHeader?: boolean;
}

export const BioscienceDatabaseView: React.FC<BioscienceDatabaseViewProps> = ({
  onNavigateToCalculators,
  onNavigateToLabTool,
  initialActiveTab = 'chemicals',
  hideInternalHeader = false
}) => {
  const { notifyDataChanged, activeBatch } = useEnologyUi();
  const [activeTab, setActiveTab] = useState<'chemicals' | 'enzymes' | 'backup'>(initialActiveTab);
  const [exportTankId, setExportTankId] = useState<TankId>('tank-a');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompound, setSelectedCompound] = useState<PubChemCompoundData>(
    PRELOADED_ENOLOGY_COMPOUNDS[0]
  );
  const [selectedProtein, setSelectedProtein] = useState<UniProtProteinData>(
    PRELOADED_ENOLOGY_PROTEINS[0]
  );

  // Live search state
  const [liveSearchInput, setLiveSearchInput] = useState('');
  const [isSearchingLive, setIsSearchingLive] = useState(false);
  const [liveSearchResult, setLiveSearchResult] = useState<Partial<PubChemCompoundData> | null>(null);
  const [liveSearchError, setLiveSearchError] = useState<string | null>(null);

  // Database Management & Idea 5 Import Preview / Merge
  const [dbSummary, setDbSummary] = useState(() => enologyDb.getDatabaseSummary());
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [pendingImportJson, setPendingImportJson] = useState<string | null>(null);
  const [importPreviewData, setImportPreviewData] = useState<ReturnType<typeof enologyDb.previewDatabaseImport> | null>(null);
  const [importMode, setImportMode] = useState<'replace' | 'merge'>('replace');

  const showFeedback = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedbackMessage({ type, text });
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  const filteredCompounds = PRELOADED_ENOLOGY_COMPOUNDS.filter((c) => {
    const matchesCategory = categoryFilter === 'all' || c.category === categoryFilter;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      c.title.toLowerCase().includes(query) ||
      c.molecularFormula.toLowerCase().includes(query) ||
      c.enologyRoleFa.toLowerCase().includes(query) ||
      String(c.cid).includes(query);
    return matchesCategory && matchesSearch;
  });

  const handleLivePubChemSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!liveSearchInput.trim()) return;

    setIsSearchingLive(true);
    setLiveSearchError(null);
    setLiveSearchResult(null);

    try {
      const result = await fetchPubChemCompoundLive(liveSearchInput.trim());
      if (result && result.cid) {
        setLiveSearchResult(result);
        showFeedback(`ترکیب ${result.title} با CID ${result.cid} از PubChem استعلام شد.`);
      } else {
        setLiveSearchError(`ترکیب "${liveSearchInput}" در پایگاه داده PubChem یافت نشد.`);
      }
    } catch {
      setLiveSearchError('خطا در برقراری ارتباط با سرویس آنلاین PubChem NCBI.');
    } finally {
      setIsSearchingLive(false);
    }
  };

  const handleExportJSON = () => {
    const json = enologyDb.buildExportDatabaseJSON();
    const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Enology_Database_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    enologyDb.confirmBackupCompleted();
    setDbSummary(enologyDb.getDatabaseSummary());
    notifyDataChanged();
    URL.revokeObjectURL(url);
    showFeedback('پشتیبان کامل دیتابیس (JSON) با موفقیت دانلود شد.');
  };

  const handleExportCSV = () => {
    const csvString = enologyDb.exportLogsToCSV(exportTankId, activeBatch?.id);
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Fermentation_Logs_${exportTankId}_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showFeedback(`خروجی اکسل/CSV لاگ‌های تخمیر (${exportTankId}) با کدگذاری UTF-8 آماده و دانلود شد.`);
  };

  const handleGenerateTankDocx = async () => {
    try {
      await exportDocxReport({
        tankId: exportTankId,
        batchId: activeBatch?.id,
        logs: enologyDb.getLogs(exportTankId, false, activeBatch?.id),
        additions: enologyDb.getAdditions(exportTankId, false, activeBatch?.id),
        analyses: enologyDb.getLabAnalyses(exportTankId, false, activeBatch?.id),
        batchName: activeBatch?.name ?? 'بچ شراب رشه سردشت',
        vintageYear: activeBatch?.vintageYear ?? 1405
      });
      showFeedback(`گزارش رسمی Word (.DOCX) برای ${exportTankId} با موفقیت تولید و دانلود شد.`);
    } catch {
      showFeedback('خطا در تولید گزارش Word مخزن.', 'error');
    }
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const preview = enologyDb.previewDatabaseImport(content);
      setImportPreviewData(preview);
      if (preview.valid) {
        setPendingImportJson(content);
      } else {
        setPendingImportJson(null);
        showFeedback(preview.messageFa, 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleConfirmDatabaseImport = () => {
    if (!pendingImportJson) return;
    const res = enologyDb.importDatabaseJSON(pendingImportJson, importMode);
    if (res.success) {
      setDbSummary(enologyDb.getDatabaseSummary());
      notifyDataChanged();
      setPendingImportJson(null);
      setImportPreviewData(null);
      showFeedback(res.message, 'success');
    } else {
      showFeedback(res.message, 'error');
    }
  };

  const handleResetDefaults = () => {
    if (
      !window.confirm(
        'آیا از بازنشانی کامل دیتابیس به مقادیر کارخانه اطمینان دارید؟ تمام ثبت‌های فعلی پاک خواهند شد.'
      )
    ) {
      return;
    }
    enologyDb.resetToFactoryDefaults();
    setDbSummary(enologyDb.getDatabaseSummary());
    notifyDataChanged();
    showFeedback('پایگاه داده به مقادیر اولیه کارگاهی مستر پروتکل رشه سردشت بازنشانی شد.');
  };

  return (
    <div className="space-y-6 font-['Vazirmatn',sans-serif]">
      {/* Top Banner & Header */}
      {!hideInternalHeader && (
      <div className="bg-surface rounded-xl border border-line shadow-xs p-5 text-ink">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-paper border border-line text-ink-soft flex items-center justify-center shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-bold text-ink">
                  بانک اطلاعات بیوانولوژی و پایگاه داده شراب‌سازی
                </h2>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-paper text-ink-soft border border-line">
                  اتصال به PubChem و UniProt (Science Skills)
                </span>
              </div>
              <p className="text-xs text-ink-soft mt-1 leading-relaxed max-w-3xl">
                دیتابیس تخصصی ترکیبات آلی، اسیدهای میوه‌ای، رنگیزه‌های آنتوسیانینی انگور رشه سردشت و آنزیم‌های بیوکاتالیزور تخمیر
                به همراه موتور ذخیره‌سازی ابری و محلی، مدیریت بچ‌ها و پشتیبان‌گیری.
              </p>
            </div>
          </div>

          {/* Quick Database Status Badge */}
          <div className="bg-paper border border-line rounded-xl p-3 flex items-center gap-3 shrink-0">
            <div className="text-center border-l border-line pl-3">
              <span className="text-xs text-ink-soft block">کل رکوردها</span>
              <span className="text-base font-bold text-ink font-mono">
                {dbSummary.totalRecords}
              </span>
            </div>
            <div className="text-center border-l border-line pl-3">
              <span className="text-xs text-ink-soft block">لاگ‌های تخمیر</span>
              <span className="text-base font-bold text-ink font-mono">
                {dbSummary.totalFermentationLogs}
              </span>
            </div>
            <div className="text-center">
              <span className="text-xs text-ink-soft block">بچ‌های فعال</span>
              <span className="text-base font-bold text-ink font-mono">
                {dbSummary.totalBatches}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 mt-5 border-t border-line pt-4 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveTab('chemicals')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'chemicals'
                ? 'bg-wine text-white'
                : 'bg-paper border border-line text-ink hover:bg-stone-200/60'
            }`}
          >
            <FlaskConical className="w-4 h-4" />
            <span>بانک ترکیبات شیمیایی و اسیدها (PubChem)</span>
            <span className="px-1.5 py-0.2 rounded-md bg-white/20 text-xs">
              {PRELOADED_ENOLOGY_COMPOUNDS.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('enzymes')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'enzymes'
                ? 'bg-wine text-white'
                : 'bg-paper border border-line text-ink hover:bg-stone-200/60'
            }`}
          >
            <Dna className="w-4 h-4" />
            <span>بیوکاتالیزورها و آنزیم‌های تخمیر (UniProt)</span>
            <span className="px-1.5 py-0.2 rounded-md bg-white/20 text-xs">
              {PRELOADED_ENOLOGY_PROTEINS.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('backup');
              setDbSummary(enologyDb.getDatabaseSummary());
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'backup'
                ? 'bg-wine text-white'
                : 'bg-paper border border-line text-ink hover:bg-stone-200/60'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>مدیریت دیتابیس، خروجی اکسل و پشتیبان‌گیری</span>
          </button>
        </div>
      </div>
      )}

      {hideInternalHeader && activeTab !== 'backup' && (
        <div className="bg-surface p-3.5 rounded-xl border border-line flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setActiveTab('chemicals')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'chemicals'
                  ? 'bg-wine text-white'
                  : 'bg-paper border border-line text-ink hover:bg-stone-200/60'
              }`}
            >
              <FlaskConical className="w-4 h-4" />
              <span>۱. بانک ترکیبات شیمیایی، اسیدها و پلی‌فنول‌ها (PubChem)</span>
              <span className="px-1.5 py-0.2 rounded-md bg-white/20 text-xs">
                {PRELOADED_ENOLOGY_COMPOUNDS.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('enzymes')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'enzymes'
                  ? 'bg-wine text-white'
                  : 'bg-paper border border-line text-ink hover:bg-stone-200/60'
              }`}
            >
              <Dna className="w-4 h-4" />
              <span>۲. بیوکاتالیزورها و آنزیم‌های تخمیر (UniProtKB)</span>
              <span className="px-1.5 py-0.2 rounded-md bg-white/20 text-xs">
                {PRELOADED_ENOLOGY_PROTEINS.length}
              </span>
            </button>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-paper text-ink-soft border border-line">
            متصل به سرویس آنلاین NCBI PubChem REST API
          </span>
        </div>
      )}

      {/* Feedback Toast */}
      {feedbackMessage && (
        <div
          className={`p-3.5 rounded-xl border flex items-center gap-2 text-xs font-bold ${
            feedbackMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {feedbackMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
          )}
          <span>{feedbackMessage.text}</span>
        </div>
      )}

      {/* TAB 1: CHEMICALS DATABASE */}
      {activeTab === 'chemicals' && (
        <div className="space-y-5">
          {/* Live Search & Filter Bar */}
          <div className="bg-surface p-4 rounded-xl border border-line shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute right-3 top-3 text-ink-soft" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجو در نام، فرمول یا نقش انولوژی..."
                className="w-full bg-paper border border-line text-xs rounded-lg pr-9 pl-3 py-2 text-ink focus:outline-none focus:border-wine"
              />
            </div>

            <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto">
              <span className="text-xs text-ink-soft ml-1">دسته‌بندی:</span>
              {[
                { id: 'all', label: 'همه' },
                { id: 'acid', label: 'اسیدها' },
                { id: 'sulfur', label: 'گوگردی و SO2' },
                { id: 'polyphenol', label: 'پلی‌فنول و رنگیزه' },
                { id: 'alcohol', label: 'الکل و گلیسرول' },
                { id: 'nutrient', label: 'تغذیه مخمر' },
                { id: 'spoilage_marker', label: 'شاخص فساد' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryFilter(cat.id)}
                  className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                    categoryFilter === cat.id
                      ? 'bg-wine text-white'
                      : 'bg-paper border border-line text-ink-soft hover:text-ink'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Master Detail Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left/List column (5 cols) */}
            <div className="lg:col-span-5 space-y-2.5 max-h-[620px] overflow-y-auto pr-1">
              {filteredCompounds.map((compound) => {
                const isSelected = selectedCompound.cid === compound.cid;
                return (
                  <div
                    key={compound.cid}
                    onClick={() => setSelectedCompound(compound)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50/80 border-emerald-400 shadow-sm'
                        : 'bg-white border-stone-200 hover:border-emerald-200 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-stone-900">{compound.title}</h4>
                          <span className="text-xs font-mono bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded border border-stone-200">
                            CID: {compound.cid}
                          </span>
                        </div>
                        <p className="text-xs font-mono text-emerald-800 font-bold mt-0.5">
                          {compound.molecularFormula} • MW: {compound.molecularWeight} g/mol
                        </p>
                      </div>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          compound.category === 'acid'
                            ? 'bg-amber-100 text-amber-800'
                            : compound.category === 'sulfur'
                            ? 'bg-rose-100 text-rose-800'
                            : compound.category === 'polyphenol'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {compound.category}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 mt-2 line-clamp-2 leading-relaxed">
                      {compound.enologyRoleFa}
                    </p>
                  </div>
                );
              })}

              {filteredCompounds.length === 0 && (
                <div className="p-8 text-center text-stone-500 bg-white rounded-xl border border-stone-200 text-xs">
                  هیچ ترکیبی با فیلتر فعلی یافت نشد.
                </div>
              )}
            </div>

            {/* Right/Inspector column (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200/80 p-5 shadow-xs space-y-4">
              <div className="flex items-start justify-between gap-3 border-b border-stone-100 pb-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-bold text-stone-900">
                      {selectedCompound.title}
                    </h3>
                    <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-mono font-bold">
                      PubChem CID: {selectedCompound.cid}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 font-mono mt-1 break-all">
                    IUPAC: {selectedCompound.iupacName}
                  </p>
                </div>

                <a
                  href={`https://pubchem.ncbi.nlm.nih.gov/compound/${selectedCompound.cid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold flex items-center gap-1.5 transition-all shrink-0"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>صفحه رسمی PubChem</span>
                </a>
              </div>

              {/* 2D Molecular Structure & Core Properties */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-5 bg-stone-50 rounded-xl p-3 border border-stone-200/70 flex flex-col items-center justify-center">
                  <span className="text-xs text-stone-500 mb-1 font-bold">
                    ساختار دو بعدی مولکول (PubChem PUG REST)
                  </span>
                  <img
                    src={selectedCompound.imageUrl}
                    alt={selectedCompound.title}
                    className="max-h-40 object-contain drop-shadow-sm rounded bg-white p-2 border border-stone-200"
                    loading="lazy"
                  />
                  <span className="text-xs font-mono text-stone-400 mt-2">
                    {selectedCompound.molecularFormula}
                  </span>
                </div>

                <div className="sm:col-span-7 space-y-2 text-xs">
                  <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-200/60 flex justify-between items-center">
                    <span className="text-stone-500">وزن مولکولی:</span>
                    <span className="font-mono font-bold text-stone-900">
                      {selectedCompound.molecularWeight} g/mol
                    </span>
                  </div>
                  <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-200/60 flex justify-between items-center">
                    <span className="text-stone-500">فرمول مولکولی:</span>
                    <span className="font-mono font-bold text-emerald-800">
                      {selectedCompound.molecularFormula}
                    </span>
                  </div>
                  {selectedCompound.xLogP !== undefined && (
                    <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-200/60 flex justify-between items-center">
                      <span className="text-stone-500">ضریب تفکیک XLogP:</span>
                      <span className="font-mono font-bold text-stone-900">
                        {selectedCompound.xLogP}
                      </span>
                    </div>
                  )}
                  {selectedCompound.tpsa !== undefined && (
                    <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-200/60 flex justify-between items-center">
                      <span className="text-stone-500">مساحت سطح قطبی (TPSA):</span>
                      <span className="font-mono font-bold text-stone-900">
                        {selectedCompound.tpsa} Å²
                      </span>
                    </div>
                  )}
                  {selectedCompound.hBondDonorCount !== undefined && (
                    <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-200/60 flex justify-between items-center">
                      <span className="text-stone-500">اهداکننده / پذیرنده پیوند هیدروژنی:</span>
                      <span className="font-mono font-bold text-stone-900">
                        {selectedCompound.hBondDonorCount} / {selectedCompound.hBondAcceptorCount}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Canonical SMILES */}
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/70">
                <span className="text-xs font-bold text-stone-500 block mb-1">
                  رشته شیمیایی استاندارد (Canonical SMILES):
                </span>
                <code className="text-xs font-mono text-stone-800 break-all select-all block bg-white p-2 rounded border border-stone-200">
                  {selectedCompound.canonicalSmiles}
                </code>
              </div>

              {/* Enological Importance */}
              <div className="bg-emerald-50/70 border border-emerald-200 p-3.5 rounded-xl">
                <h5 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5 mb-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-700" />
                  <span>اهمیت بیوشیمیایی و عملکرد در انولوژی و شراب رشه سردشت:</span>
                </h5>
                <p className="text-xs text-emerald-900 leading-relaxed">
                  {selectedCompound.enologyRoleFa}
                </p>
              </div>

              {selectedCompound.hazardWarningFa && (
                <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl text-xs text-rose-900 flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">هشدارهای ایمنی و مدیریت کارگاهی (GHS):</span>
                    <span className="mt-0.5 block">{selectedCompound.hazardWarningFa}</span>
                  </div>
                </div>
              )}

              {/* Action Jump to Calculator */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                {selectedCompound.cid === 24446 && (onNavigateToLabTool || onNavigateToCalculators) && (
                  <button
                    type="button"
                    onClick={() => {
                      if (onNavigateToLabTool) {
                        onNavigateToLabTool('sop-04', 'calculators-sops');
                      } else if (onNavigateToCalculators) {
                        onNavigateToCalculators();
                      }
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span>رفتن به محاسبه‌گر دوز دقیق KMS و تیتراسیون ریپر (SOP-04)</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
                {selectedCompound.cid === 24261 && (onNavigateToLabTool || onNavigateToCalculators) && (
                  <button
                    type="button"
                    onClick={() => {
                      if (onNavigateToLabTool) {
                        onNavigateToLabTool('sop-05', 'calculators-sops');
                      } else if (onNavigateToCalculators) {
                        onNavigateToCalculators();
                      }
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span>رفتن به محاسبه‌گر تغذیه نیتروژن YAN و SNA (SOP-05)</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Live Online Query Box (NCBI PubChem API) */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <Atom className="w-5 h-5 text-emerald-700" />
              <h4 className="text-sm font-bold text-stone-900">
                استعلام زنده هر ترکیب شیمیایی دیگر از پایگاه جهانی PubChem (Live PUG REST)
              </h4>
            </div>
            <p className="text-xs text-stone-500">
              می‌توانید نام انگلیسی هر ماده (مثلاً Citric acid, Ascorbic acid, Vanillin, Tannin, Sorbic acid)
              یا شماره CID را وارد کنید تا مستقیماً از NCBI دریافت شود:
            </p>

            <form onSubmit={handleLivePubChemSearch} className="flex gap-2 max-w-xl">
              <input
                type="text"
                value={liveSearchInput}
                onChange={(e) => setLiveSearchInput(e.target.value)}
                placeholder="مثلاً: citric acid یا 311"
                className="flex-1 bg-paper border border-line rounded-lg px-3 py-2 text-xs text-ink focus:outline-none focus:border-wine"
              />
              <button
                type="submit"
                disabled={isSearchingLive}
                className="px-4 py-2 rounded-lg bg-wine text-white text-xs font-bold transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
              >
                {isSearchingLive ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Search className="w-3.5 h-3.5" />
                )}
                <span>استعلام زنده</span>
              </button>
            </form>

            {liveSearchError && (
              <p className="text-xs text-rose-600 font-bold">{liveSearchError}</p>
            )}

            {liveSearchResult && (
              <div className="mt-3 p-4 bg-stone-50 rounded-xl border border-stone-200 flex flex-col sm:flex-row items-center gap-4">
                {liveSearchResult.imageUrl && (
                  <img
                    src={liveSearchResult.imageUrl}
                    alt={liveSearchResult.title}
                    className="w-24 h-24 object-contain bg-white p-1 rounded border border-stone-200"
                  />
                )}
                <div className="text-xs space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900 text-sm">{liveSearchResult.title}</span>
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono font-bold">
                      CID: {liveSearchResult.cid}
                    </span>
                  </div>
                  <p className="text-stone-500 font-mono text-xs">{liveSearchResult.iupacName}</p>
                  <p className="font-mono text-emerald-700 font-bold">
                    فرمول: {liveSearchResult.molecularFormula} • جرم: {liveSearchResult.molecularWeight} g/mol
                  </p>
                  <p className="font-mono text-stone-600 text-xs break-all">
                    SMILES: {liveSearchResult.canonicalSmiles}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: ENZYMES & BIOCATALYSTS (UniProt) */}
      {activeTab === 'enzymes' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Protein list */}
            <div className="lg:col-span-5 space-y-3">
              {PRELOADED_ENOLOGY_PROTEINS.map((protein) => {
                const isSelected = selectedProtein.accession === protein.accession;
                return (
                  <div
                    key={protein.accession}
                    onClick={() => setSelectedProtein(protein)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50/80 border-emerald-400 shadow-sm'
                        : 'bg-white border-stone-200 hover:border-emerald-200 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-stone-900">{protein.proteinName}</h4>
                      <span className="text-xs font-mono bg-stone-100 text-stone-700 px-1.5 py-0.5 rounded border border-stone-200">
                        {protein.accession}
                      </span>
                    </div>
                    <p className="text-xs text-emerald-800 font-bold mt-1">
                      {protein.organism} • ژن: {protein.geneName || 'نامشخص'}
                    </p>
                    <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                      {protein.functionSummaryFa}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Protein Inspector */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200/80 p-5 shadow-xs space-y-4">
              <div className="flex items-start justify-between gap-3 border-b border-stone-100 pb-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-bold text-stone-900">
                      {selectedProtein.proteinName}
                    </h3>
                    <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-mono font-bold">
                      UniProt: {selectedProtein.accession}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 font-mono mt-1">
                    شناسه: {selectedProtein.id} • رده آنزیمی: {selectedProtein.ecNumber || 'EC'}
                  </p>
                </div>

                <a
                  href={`https://www.uniprot.org/uniprotkb/${selectedProtein.accession}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold flex items-center gap-1.5 transition-all shrink-0"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>مشاهده در UniProtKB</span>
                </a>
              </div>

              {/* Protein details */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/60">
                  <span className="text-stone-500 block mb-0.5">موجود ارگانیسم منبع:</span>
                  <span className="font-bold text-stone-800">{selectedProtein.organism}</span>
                </div>
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/60">
                  <span className="text-stone-500 block mb-0.5">طول زنجیره اسید آمینه:</span>
                  <span className="font-mono font-bold text-stone-800">
                    {selectedProtein.length} آمینواسید
                  </span>
                </div>
              </div>

              <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200/70">
                <h5 className="text-xs font-bold text-stone-700 mb-1">مکانیزم بیوشیمیایی و عملکرد:</h5>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {selectedProtein.functionSummaryFa}
                </p>
              </div>

              <div className="bg-emerald-50/80 border border-emerald-200 p-4 rounded-xl">
                <h5 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5 mb-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-700" />
                  <span>کاربرد حیاتی در فرآیند شراب‌سازی و مستر پروتکل رشه:</span>
                </h5>
                <p className="text-xs text-emerald-900 leading-relaxed">
                  {selectedProtein.enologyRelevanceFa}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DATABASE BACKUP, EXPORT & RESTORE */}
      {activeTab === 'backup' && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-surface p-4 rounded-xl border border-line shadow-xs text-center">
              <span className="text-xs text-ink-soft">تعداد بچ‌های شراب</span>
              <p className="text-xl font-bold text-ink font-mono mt-1">
                {dbSummary.totalBatches}
              </p>
            </div>
            <div className="bg-surface p-4 rounded-xl border border-line shadow-xs text-center">
              <span className="text-xs text-ink-soft">لاگ‌های ثبت تخمیر</span>
              <p className="text-xl font-bold text-ink font-mono mt-1">
                {dbSummary.totalFermentationLogs}
              </p>
            </div>
            <div className="bg-surface p-4 rounded-xl border border-line shadow-xs text-center">
              <span className="text-xs text-ink-soft">افزودنی‌های شیمیایی (KMS/DAP)</span>
              <p className="text-xl font-bold text-ink font-mono mt-1">
                {dbSummary.totalChemicalAdditions}
              </p>
            </div>
            <div className="bg-surface p-4 rounded-xl border border-line shadow-xs text-center">
              <span className="text-xs text-ink-soft">آزمون‌های آزمایشگاهی</span>
              <p className="text-xl font-bold text-ink font-mono mt-1">
                {dbSummary.totalLabAnalyses}
              </p>
            </div>
          </div>

          {/* Backup & Export Actions */}
          <div className="bg-surface p-6 rounded-xl border border-line shadow-xs space-y-5 text-ink">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-3">
              <div>
                <h3 className="text-sm font-bold text-ink flex items-center gap-2">
                  <Download className="w-4 h-4 text-ink-soft" />
                  <span>مرکز خروجی، گزارش Word/Excel و پشتیبان‌گیری کامل دیتابیس</span>
                </h3>
                <p className="text-xs text-ink-soft mt-0.5">
                  دانلود مستر پروتکل رسمی، تولید گزارش پویای Word (.DOCX) برای هر مخزن، خروجی اکسل لاگ‌شیت و پشتیبان JSON
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <label className="font-bold text-ink">مخزن هدف گزارش پویا:</label>
                <select
                  value={exportTankId}
                  onChange={(e) => setExportTankId(e.target.value as TankId)}
                  className="bg-paper border border-line rounded-lg px-3 py-1.5 font-bold text-ink"
                >
                  <option value="tank-a">مخزن قرمز A (۱۳۲L)</option>
                  <option value="tank-b">مخزن قرمز B (۱۳۲L)</option>
                  <option value="tank-rose">گالن شراب رُزه (۳۲L)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 1. Official Master Protocol Word Document */}
              <a
                href="/Master_Protocol_Rasha_Sardasht_400kg.docx"
                download="مستر_پروتکل_جامع_رشه_سردشت_۴۰۰کیلوگرم.docx"
                className="p-4 rounded-xl border border-line bg-paper hover:bg-stone-200/60 text-right transition-all cursor-pointer flex items-start gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-wine text-white flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-ink">
                    ۱. دانلود سند رسمی مستر پروتکل جامع رشه سردشت (.DOCX)
                  </h4>
                  <p className="text-xs text-ink-soft mt-1">
                    فایل ورد مرجع کارگاهی ۴۰۰ کیلوگرم انگور رشه سردشت شامل کلیه جداول ۲۰ ردیفه، ۵ محلول استوک و ایستگاه‌های ۱ تا ۷.
                  </p>
                </div>
              </a>

              {/* 2. Generate & Download Dynamic Tank Report Word Document */}
              <button
                type="button"
                onClick={handleGenerateTankDocx}
                className="p-4 rounded-xl border border-line bg-paper hover:bg-stone-200/60 text-right transition-all cursor-pointer flex items-start gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-wine text-white flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-ink">
                    ۲. تولید و دانلود گزارش پویای مخزن در قالب Word (.DOCX)
                  </h4>
                  <p className="text-xs text-ink-soft mt-1">
                    تولید زنده فایل ورد راست‌چین (RTL) شامل لاگ‌های ثبت‌شده، افزودنی‌های شیمیایی و نتایج آزمایشگاه مخزن انتخاب‌شده.
                  </p>
                </div>
              </button>

              {/* 3. Export Excel/CSV Fermentation Logsheet */}
              <button
                type="button"
                onClick={handleExportCSV}
                className="p-4 rounded-xl border border-line bg-paper hover:bg-stone-200/60 text-right transition-all cursor-pointer flex items-start gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-wine text-white flex items-center justify-center shrink-0">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-ink">
                    ۳. خروجی اکسل لاگ‌شیت تخمیر (CSV با کدگذاری UTF-8 BOM)
                  </h4>
                  <p className="text-xs text-ink-soft mt-1">
                    فایل صفحه گسترده سازگار با Microsoft Excel و Google Sheets با پشتیبانی کامل از حروف فارسی برای مخزن انتخاب‌شده.
                  </p>
                </div>
              </button>

              {/* 4. Download Full Database JSON Backup */}
              <button
                type="button"
                onClick={handleExportJSON}
                className="p-4 rounded-xl border border-line bg-paper hover:bg-stone-200/60 text-right transition-all cursor-pointer flex items-start gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-wine text-white flex items-center justify-center shrink-0">
                  <FileJson className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-ink">
                    ۴. دانلود نسخه پشتیبان کامل دیتابیس (JSON Backup)
                  </h4>
                  <p className="text-xs text-ink-soft mt-1">
                    شامل کلیه بچ‌ها، لاگ‌های روزانه تخمیر، افزودنی‌های شیمیایی، آزمون‌های آزمایشگاهی و محاسبات ذخیره‌شده.
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* 5. Restore & Import Actions */}
          <div className="bg-surface p-6 rounded-xl border border-line shadow-xs space-y-4 text-ink">
            <div className="border-b border-line pb-3">
              <h3 className="text-sm font-bold text-ink flex items-center gap-2">
                <Upload className="w-4 h-4 text-ink-soft" />
                <span>۵. بازیابی فایل پشتیبان (Import JSON) و بازنشانی کارخانه‌ای</span>
              </h3>
              <p className="text-xs text-ink-soft mt-0.5">
                اگر قبلاً فایلی از دیتابیس دانلود کرده‌اید، می‌توانید آن را بارگذاری کنید یا دیتابیس را به مقادیر استاندارد اولیه بازگردانید:
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <label className="px-4 py-2.5 rounded-xl bg-wine text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-xs">
                <Upload className="w-4 h-4" />
                <span>انتخاب و پیش‌نمایش فایل پشتیبان JSON</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleImportJSON}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={handleResetDefaults}
                className="px-4 py-2.5 rounded-xl bg-paper border border-line text-ink hover:bg-stone-200/60 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              >
                <RefreshCw className="w-4 h-4" />
                <span>بازنشانی دیتابیس به داده‌های استاندارد کارخانه (Factory Reset)</span>
              </button>
            </div>

            {/* Import Preview & Merge vs Replace Confirmation Card (Idea 5) */}
            {importPreviewData?.valid && importPreviewData.summary && (
              <div className="bg-paper border border-line rounded-xl p-4 space-y-3 text-xs text-ink">
                <div className="font-bold text-ink">
                  پیش‌نمایش محتوای فایل پشتیبان پیش از بازیابی:
                </div>
                <div className="font-bold text-ink-soft">
                  {importPreviewData.summary.logsCount} لاگ تخمیر،{' '}
                  {importPreviewData.summary.additionsCount} افزودنی،{' '}
                  {importPreviewData.summary.batchesCount} بچ (بازه زمانی:{' '}
                  {importPreviewData.summary.dateRangeFa})
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setImportMode('merge')}
                    className={`px-3 py-1.5 rounded-xl font-bold border cursor-pointer ${
                      importMode === 'merge'
                        ? 'bg-wine text-white border-wine'
                        : 'bg-surface text-ink border-line'
                    }`}
                  >
                    ادغام با داده‌های فعلی (Merge)
                  </button>
                  <button
                    type="button"
                    onClick={() => setImportMode('replace')}
                    className={`px-3 py-1.5 rounded-xl font-bold border cursor-pointer ${
                      importMode === 'replace'
                        ? 'bg-wine text-white border-wine'
                        : 'bg-surface text-ink border-line'
                    }`}
                  >
                    جایگزینی کامل (Replace)
                  </button>
                </div>

                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPendingImportJson(null);
                      setImportPreviewData(null);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-surface border border-line text-ink font-bold cursor-pointer"
                  >
                    انصراف
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmDatabaseImport}
                    className="px-4 py-1.5 rounded-xl bg-wine text-white font-bold cursor-pointer"
                  >
                    تأیید و اعمال بازیابی
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 6. Workshop Calendar (.ics), Photo Archive & Vintage Comparison (Ideas 15 & 16) */}
          <PhotoDiaryAndVintagePanel tankId={exportTankId} />
        </div>
      )}
    </div>
  );
};
