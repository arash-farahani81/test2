import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  BookOpen,
  Calendar,
  ChevronLeft,
  Database,
  Eye,
  Scale,
  Search,
  ShieldCheck,
  Sliders,
  SunMedium,
  Type,
  X
} from 'lucide-react';
import { Header } from './components/Header.tsx';
import { MasterProtocolView } from './components/MasterProtocolView.tsx';
import { FermentationTracker } from './components/FermentationTracker.tsx';
import { TestingGuide } from './components/TestingGuide.tsx';
import { ProcessRoadmapTracker } from './components/ProcessRoadmapTracker.tsx';
import { RightNowActionCenter } from './components/RightNowActionCenter.tsx';
import { QuickTenSecondLogModal } from './components/QuickTenSecondLogModal.tsx';
import { BatchOnboardingWizardModal } from './components/BatchOnboardingWizardModal.tsx';
import { FlexibleProtocolCustomizerBar } from './components/FlexibleProtocolCustomizerBar.tsx';
import { PhotoDiaryAndVintagePanel } from './components/PhotoDiaryAndVintagePanel.tsx';
import {
  EnologyUiProvider,
  useEnologyUi,
  ENOLOGY_GLOSSARY_DICTIONARY
} from './context/EnologyUiContext.tsx';
import { enologyDb } from './db/enologyDatabase.ts';
import { sortFermentationLogs } from './utils/trackingCalculations.ts';
import { useLocalStorageState } from './utils/useLocalStorage.ts';

type MoreSubPage =
  | 'menu'
  | 'protocol-customizer'
  | 'master-protocol'
  | 'backup-data'
  | 'photo-vintage'
  | 'glossary'
  | 'display-settings';

function AppWorkspace() {
  const {
    activeTab,
    setActiveTab,
    effectiveSingleTankId,
    fontScale,
    setFontScale,
    scalePrecision,
    setScalePrecision,
    labDeepLink,
    navigateToLabTest,
    activeGlossaryItem,
    closeGlossaryTerm,
    isQuickLogOpen,
    openQuickLog,
    closeQuickLog,
    isOnboardingOpen,
    closeOnboardingWizard,
    activeBatch,
    dataVersion,
    notifyDataChanged
  } = useEnologyUi();

  const [selectedTestId, setSelectedTestId] = useState<string>('all');
  const [testingGuideSubTab, setTestingGuideSubTab] = useState<
    'calculators-sops' | 'troubleshooting-crises' | 'saved-history'
  >('calculators-sops');
  const [cellarMode, setCellarMode] = useLocalStorageState<boolean>(
    'enology_cellar_mode_v1',
    false
  );
  const [autoSuggestNightCellar, setAutoSuggestNightCellar] =
    useLocalStorageState<boolean>('enology_auto_night_cellar_v1', true);
  const [dataRefreshTick, setDataRefreshTick] = useState<number>(0);

  // «بیشتر» (More) Sub-Page state
  const [moreSubPage, setMoreSubPage] = useState<MoreSubPage>('menu');
  const [glossarySearch, setGlossarySearch] = useState<string>('');

  const hasActiveFermentation = useMemo(() => {
    const allLogs = sortFermentationLogs(
      enologyDb.getLogs(undefined, false, activeBatch?.id).filter((l) => !l.isBenchmark)
    );
    const tanks = ['tank-a', 'tank-b', 'tank-rose'] as const;
    return tanks.some((tId) => {
      const tLogs = allLogs.filter((l) => l.tankId === tId);
      const latest = tLogs[tLogs.length - 1];
      return latest ? latest.sg > 1.0 : true;
    });
  }, [dataRefreshTick, dataVersion, isQuickLogOpen, cellarMode, activeBatch?.id]);

  const backupHealth = useMemo(
    () => enologyDb.getBackupHealthStatus(),
    [dataRefreshTick, dataVersion, isQuickLogOpen, cellarMode]
  );

  const storageDiagnostics = useMemo(
    () => enologyDb.getStorageDiagnostics(),
    [dataRefreshTick, dataVersion, isQuickLogOpen, cellarMode]
  );

  const dbSummary = useMemo(
    () => enologyDb.getDatabaseSummary(),
    [dataRefreshTick, dataVersion, isQuickLogOpen, cellarMode]
  );

  const [isNightHours, setIsNightHours] = useState<boolean>(() => {
    const hour = new Date().getHours();
    return hour >= 19 || hour < 6;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const hour = new Date().getHours();
      setIsNightHours(hour >= 19 || hour < 6);
    }, 60_000);
    return () => clearInterval(timer);
  }, []);

  const handleOpenTestingTool = (
    testId?: string,
    subTab?: 'calculators-sops' | 'troubleshooting-crises' | 'saved-history'
  ) => {
    setSelectedTestId(testId || 'all');
    setTestingGuideSubTab(subTab || 'calculators-sops');
    navigateToLabTest(testId || 'ripper_so2', {
      subTab: subTab || 'calculators-sops'
    });
  };

  const fontScaleRootClass =
    fontScale === 'xlarge'
      ? 'text-xl'
      : fontScale === 'large'
      ? 'text-lg'
      : 'text-base';

  const glossaryList = useMemo(() => {
    const items = Object.values(ENOLOGY_GLOSSARY_DICTIONARY);
    const q = glossarySearch.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) =>
        item.termFa.toLowerCase().includes(q) ||
        item.termEn.toLowerCase().includes(q) ||
        item.shortTooltipFa.toLowerCase().includes(q) ||
        item.whyItMattersFa.toLowerCase().includes(q)
    );
  }, [glossarySearch]);

  if (cellarMode) {
    return (
      <div
        className={`min-h-screen bg-slate-950 text-slate-50 text-lg flex flex-col font-['Vazirmatn',sans-serif] pb-20 md:pb-0 ${fontScaleRootClass}`}
      >
        {/* Persistent CO2 Asphyxiation Safety Warning Banner when SG > 1.000 */}
        {hasActiveFermentation && (
          <div className="bg-rose-800 text-white px-4 py-3 border-b-2 border-rose-400 flex items-center justify-between gap-3 text-sm sm:text-base font-bold">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-6 h-6 text-amber-300 shrink-0" />
              <span>
                هشدار ایمنی خفگی با گاز CO₂ (SG &gt; 1.000): تخمیر فعال در جریان است! پیش از ورود به زیرزمین یا خم شدن بالای دهانه مخزن، تهویه و هواکش کارگاه را روشن کنید.
              </span>
            </div>
          </div>
        )}

        <Header
          activeFiveTab={activeTab}
          onFiveTabChange={setActiveTab}
          cellarMode={cellarMode}
          onToggleCellarMode={() => setCellarMode((v) => !v)}
        />

        <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 space-y-6">
          {/* Block 1: Right Now Action Center */}
          <RightNowActionCenter
            compact={false}
            onOpenQuickLogModal={() => openQuickLog()}
            onDataChanged={() => {
              setDataRefreshTick((t) => t + 1);
              notifyDataChanged();
            }}
          />

          {/* Block 2: Inline 10-Second Wet-Hands Daily Logger */}
          <QuickTenSecondLogModal
            isOpen={true}
            inlineMode={true}
            onClose={() => closeQuickLog()}
            onLogSaved={() => {
              setDataRefreshTick((t) => t + 1);
              notifyDataChanged();
            }}
          />

          {/* Block 3: Backup Health Status & Exit Cellar Mode Button */}
          <div className="bg-slate-900 border-2 border-slate-700 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-sm font-bold text-slate-200">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>وضعیت پشتیبان‌گیری کارگاه: {backupHealth.labelFa}</span>
            </div>
            <button
              type="button"
              onClick={() => setCellarMode(false)}
              className="min-h-[48px] px-5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-sm font-bold flex items-center gap-2 cursor-pointer"
            >
              <SunMedium className="w-5 h-5" />
              <span>خروج از حالت سرداب و بازگشت به نمای کامل ۵ تبی</span>
            </button>
          </div>
        </main>

        <BatchOnboardingWizardModal
          isOpen={isOnboardingOpen}
          onClose={closeOnboardingWizard}
          onBatchCreated={() => {
            setDataRefreshTick((t) => t + 1);
            notifyDataChanged();
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-paper text-ink flex flex-col font-['Vazirmatn',sans-serif] pb-20 md:pb-0 ${fontScaleRootClass}`}
    >
      {/* 5-Tab Winery Header & Mobile Bottom Nav */}
      <Header
        activeFiveTab={activeTab}
        onFiveTabChange={setActiveTab}
        cellarMode={cellarMode}
        onToggleCellarMode={() => setCellarMode((v) => !v)}
      />

      {/* Optional Auto Night Cellar Mode Suggestion Banner (19:00 to 06:00) */}
      {autoSuggestNightCellar && isNightHours && !cellarMode && (
        <div className="bg-amber-50 text-amber-950 border-b border-amber-300 px-4 py-2 text-xs font-bold flex items-center justify-between gap-2 no-print">
          <div className="flex items-center gap-2">
            <SunMedium className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              ساعات شب کارگاه (۱۹ تا ۰۶): برای خوانایی بهتر و روشن ماندن صفحه با دست خیس، «حالت سرداب» پیشنهاد می‌شود.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setCellarMode(true)}
            className="px-3 py-1 rounded-lg bg-amber-400 text-stone-950 font-bold cursor-pointer shrink-0"
          >
            فعال‌سازی حالت سرداب
          </button>
        </div>
      )}

      {/* Main 5-Tab Enology Content */}
      <main
        key={dataRefreshTick}
        className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6"
      >
        {/* Tab 1: «امروز» (Today Landing View) */}
        {activeTab === 'today' && (
          <RightNowActionCenter
            compact={false}
            onOpenQuickLogModal={() => openQuickLog()}
            onDataChanged={() => {
              setDataRefreshTick((t) => t + 1);
              notifyDataChanged();
            }}
          />
        )}

        {/* Tab 2: «مخزن‌ها» (Tanks & Unified Logbook) */}
        {activeTab === 'tanks' && (
          <FermentationTracker
            onNavigateToTestingGuide={(testId, subTab) =>
              navigateToLabTest(testId || 'ripper_so2', { subTab })
            }
          />
        )}

        {/* Tab 3: «آزمایش» (9 Lab Calculators, Wizards & Troubleshooter) */}
        {activeTab === 'lab' && (
          <TestingGuide
            onNavigateToTracking={() => setActiveTab('tanks')}
            initialSelectedTest={labDeepLink?.testId || selectedTestId}
            initialActiveSubTab={labDeepLink?.subTab || testingGuideSubTab}
          />
        )}

        {/* Tab 4: «نقشه راه» (46-Step Roadmap & Floating Timers) */}
        {activeTab === 'roadmap' && (
          <ProcessRoadmapTracker
            onNavigateToTracking={() => setActiveTab('tanks')}
            onNavigateToTestingGuide={(testId, subTab) =>
              navigateToLabTest(testId || 'ripper_so2', { subTab })
            }
            onNavigateToCalculators={(testId) =>
              navigateToLabTest(testId || 'ripper_so2', {
                subTab: 'calculators-sops'
              })
            }
            onNavigateToLabTool={(testId, subTab) =>
              navigateToLabTest(testId || 'ripper_so2', { subTab })
            }
          />
        )}

        {/* Tab 5: «بیشتر» (Single-Level Settings List & Dedicated Sub-Pages) */}
        {activeTab === 'more' && (
          <div className="space-y-4">
            {moreSubPage === 'menu' ? (
              <div className="max-w-2xl mx-auto bg-surface border border-line rounded-xl divide-y divide-line overflow-hidden">
                {[
                  {
                    id: 'protocol-customizer' as const,
                    title: 'تنظیمات پارامترهای پروتکل',
                    subtitle: 'وزن انگور، بریکس و ضرایب دوزینگ',
                    icon: Sliders
                  },
                  {
                    id: 'master-protocol' as const,
                    title: 'مستر پروتکل و بانک شیمی',
                    subtitle: 'فرمولاسیون علمی، PubChem و UniProt',
                    icon: Database
                  },
                  {
                    id: 'backup-data' as const,
                    title: 'پشتیبان‌گیری و مدیریت داده‌ها',
                    subtitle: `${backupHealth.labelFa} • خروجی JSON/CSV و سری ساخت جدید`,
                    icon: ShieldCheck
                  },
                  {
                    id: 'photo-vintage' as const,
                    title: 'دفتر عکس، چشایی و تقویم (.ics)',
                    subtitle: 'ثبت بصری، امتیازدهی حسی و یادآورهای تقویم',
                    icon: Calendar
                  },
                  {
                    id: 'glossary' as const,
                    title: 'واژه‌نامه اصطلاحات شراب‌سازی',
                    subtitle: `${glossaryList.length} اصطلاح علمی و کارگاهی`,
                    icon: BookOpen
                  },
                  {
                    id: 'display-settings' as const,
                    title: 'تنظیمات نمایش و ترازو',
                    subtitle: 'اندازه فونت، دقت ترازو و حالت سرداب',
                    icon: Eye
                  }
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setMoreSubPage(item.id)}
                      className="min-h-[60px] px-4 py-3.5 flex items-center justify-between hover:bg-paper/60 transition-colors text-right w-full cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Icon className="w-5 h-5 text-ink-soft shrink-0" />
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-ink">
                            {item.title}
                          </div>
                          <div className="text-xs text-ink-soft mt-0.5 truncate">
                            {item.subtitle}
                          </div>
                        </div>
                      </div>
                      <ChevronLeft className="w-4 h-4 text-ink-soft shrink-0" />
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-surface border border-line rounded-xl px-4 py-2">
                  <button
                    type="button"
                    onClick={() => setMoreSubPage('menu')}
                    className="min-h-[44px] text-sm font-medium text-ink-soft hover:text-ink flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>← بازگشت به بیشتر</span>
                  </button>
                </div>

                {moreSubPage === 'protocol-customizer' && (
                  <section className="space-y-2">
                    <div className="flex items-center gap-2 px-1">
                      <Sliders className="w-4 h-4 text-ink-soft" />
                      <h3 className="text-sm font-bold text-ink">
                        تنظیمات پارامترهای پروتکل (تطبیق وزن انگور، بریکس و ضرایب)
                      </h3>
                    </div>
                    <FlexibleProtocolCustomizerBar defaultExpanded={true} />
                  </section>
                )}

                {moreSubPage === 'master-protocol' && (
                  <section className="space-y-2">
                    <div className="flex items-center gap-2 px-1">
                      <Database className="w-4 h-4 text-ink-soft" />
                      <h3 className="text-sm font-bold text-ink">
                        مستر پروتکل و بانک شیمی
                      </h3>
                    </div>
                    <MasterProtocolView
                      onNavigateToTracking={() => setActiveTab('tanks')}
                      onNavigateToTestingGuide={(testId, subTab) =>
                        handleOpenTestingTool(testId, subTab)
                      }
                      onNavigateToCalculators={(testId) =>
                        handleOpenTestingTool(testId, 'calculators-sops')
                      }
                    />
                  </section>
                )}

                {moreSubPage === 'backup-data' && (
                  <div className="space-y-4">
                    <section className="bg-surface border border-line rounded-xl p-4 sm:p-5 space-y-3">
                      <div className="flex items-center justify-between gap-2 flex-wrap border-b border-line pb-3">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-5 h-5 text-ok" />
                          <h3 className="text-sm sm:text-base font-bold text-ink">
                            وضعیت پشتیبان‌گیری و مدیریت داده‌ها
                          </h3>
                        </div>
                        <span
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                            storageDiagnostics.lastStorageError
                              ? 'bg-red-100 text-danger'
                              : backupHealth.status === 'green'
                              ? 'bg-emerald-100 text-ok'
                              : 'bg-amber-100 text-warn'
                          }`}
                        >
                          {backupHealth.labelFa}
                        </span>
                      </div>

                      <div className="text-xs text-ink-soft">
                        تغییرات بدون پشتیبان خارجی:{' '}
                        <strong className="text-ink ltr-metric">
                          {backupHealth.unsavedChangesCount} رکورد
                        </strong>
                      </div>

                      <details className="border-t border-line pt-3">
                        <summary className="text-xs font-medium text-ink-soft hover:text-ink cursor-pointer">
                          جزئیات فنی حافظه و رکوردهای پایگاه داده
                        </summary>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mt-3">
                          <div className="bg-paper border border-line rounded-lg p-3">
                            <div className="text-ink-soft">کل رکوردهای ثبت‌شده در پایگاه:</div>
                            <div className="text-base font-mono font-bold text-ink mt-1 ltr-metric">
                              {dbSummary.totalRecords} رکورد
                            </div>
                          </div>
                          <div className="bg-paper border border-line rounded-lg p-3">
                            <div className="text-ink-soft">آخرین خطای حافظه مرورگر:</div>
                            <div className="font-bold text-ink mt-1">
                              {storageDiagnostics.lastStorageError ?? 'بدون خطا (سالم)'}
                            </div>
                          </div>
                          <div className="bg-paper border border-line rounded-lg p-3">
                            <div className="text-ink-soft">کلیدهای بازیابی‌شده (Corrupt):</div>
                            <div className="font-mono font-bold text-ink mt-1">
                              {storageDiagnostics.corruptedKeysRecovered.length === 0
                                ? '۰ مورد'
                                : `${storageDiagnostics.corruptedKeysRecovered.length} مورد حفظ‌شده`}
                            </div>
                          </div>
                        </div>
                      </details>
                    </section>

                    <MasterProtocolView
                      onNavigateToTracking={() => setActiveTab('tanks')}
                      onNavigateToTestingGuide={(testId, subTab) =>
                        handleOpenTestingTool(testId, subTab)
                      }
                      onNavigateToCalculators={(testId) =>
                        handleOpenTestingTool(testId, 'calculators-sops')
                      }
                    />
                  </div>
                )}

                {moreSubPage === 'photo-vintage' && (
                  <section className="space-y-2">
                    <div className="flex items-center gap-2 px-1">
                      <Calendar className="w-4 h-4 text-ink-soft" />
                      <h3 className="text-sm font-bold text-ink">
                        دفتر عکس، چشایی‌های زمان‌بندی‌شده، مقایسهٔ سال‌ها و تقویم (.ics)
                      </h3>
                    </div>
                    <PhotoDiaryAndVintagePanel tankId={effectiveSingleTankId} />
                  </section>
                )}

                {moreSubPage === 'glossary' && (
                  <section className="bg-surface border border-line rounded-xl p-4 sm:p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-3">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-ink-soft" />
                        <div>
                          <h3 className="text-sm sm:text-base font-bold text-ink">
                            واژه‌نامهٔ کامل اصطلاحات انولوژی ({glossaryList.length} اصطلاح)
                          </h3>
                          <p className="text-xs text-ink-soft">
                            توضیح سادهٔ فارسی، معادل علمی لاتین و کاربرد عملی در کارگاه شراب‌سازی رشه سردشت
                          </p>
                        </div>
                      </div>
                      <div className="relative w-full sm:w-64">
                        <Search className="w-4 h-4 text-ink-soft absolute right-3 top-2.5" />
                        <input
                          type="text"
                          value={glossarySearch}
                          onChange={(e) => setGlossarySearch(e.target.value)}
                          placeholder="جستجوی اصطلاح (مثلاً SG، سانیه، YAN)..."
                          className="w-full pr-9 pl-3 py-1.5 rounded-lg bg-paper border border-line text-xs font-bold text-ink focus:outline-none focus:border-wine"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {glossaryList.map((item) => (
                        <div
                          key={item.key}
                          className="bg-paper border border-line rounded-xl p-3.5 space-y-1.5"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="text-xs font-bold text-ink">
                              {item.termFa}{' '}
                              <span className="font-mono text-xs text-ink-soft">
                                ({item.termEn})
                              </span>
                            </h4>
                          </div>
                          <p className="text-xs text-ink leading-relaxed font-medium">
                            {item.shortTooltipFa}
                          </p>
                          {item.formulaOrRangeFa && (
                            <div className="text-xs font-mono font-bold text-ink bg-surface border border-line px-2 py-1 rounded-lg">
                              {item.formulaOrRangeFa}
                            </div>
                          )}
                          <p className="text-xs text-ink-soft leading-relaxed">
                            <strong className="text-ink">مثال کارگاهی:</strong>{' '}
                            {item.whyItMattersFa}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {moreSubPage === 'display-settings' && (
                  <section className="bg-surface border border-line rounded-xl p-4 sm:p-5 space-y-4">
                    <div className="flex items-center gap-2 border-b border-line pb-3">
                      <Eye className="w-5 h-5 text-ink-soft" />
                      <h3 className="text-sm sm:text-base font-bold text-ink">
                        تنظیمات نمایش و ترازو
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Font Size Selector */}
                      <div className="bg-paper border border-line rounded-xl p-3.5 space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-ink">
                          <Type className="w-4 h-4 text-ink-soft" />
                          <span>اندازه نوشته‌ها (مقیاس فونت):</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1.5">
                          {(
                            [
                              { id: 'normal', label: 'عادی' },
                              { id: 'large', label: 'درشت' },
                              { id: 'xlarge', label: 'خیلی درشت' }
                            ] as const
                          ).map((opt) => (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => setFontScale(opt.id)}
                              className={`py-2 rounded-lg text-xs font-bold border cursor-pointer transition-all ${
                                fontScale === opt.id
                                  ? 'bg-wine text-white border-wine'
                                  : 'bg-surface text-ink border-line hover:bg-paper'
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Scale Precision Selector */}
                      <div className="bg-paper border border-line rounded-xl p-3.5 space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-ink">
                          <Scale className="w-4 h-4 text-ink-soft" />
                          <span>دقت ترازوی کارگاه (گرد کردن دوزها):</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1.5">
                          {(
                            [
                              { val: 1, label: '1g (ترازوی آشپزخانه)' },
                              { val: 0.1, label: '0.1g (دهم گرم)' },
                              { val: 0.01, label: '0.01g (ترازوی زرگری)' }
                            ] as const
                          ).map((opt) => (
                            <button
                              key={opt.val}
                              type="button"
                              onClick={() => setScalePrecision(opt.val)}
                              className={`py-2 px-1.5 rounded-lg text-xs font-bold border cursor-pointer transition-all ${
                                scalePrecision === opt.val
                                  ? 'bg-wine text-white border-wine'
                                  : 'bg-surface text-ink border-line hover:bg-paper'
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Cellar Mode & Night Suggestion Toggles */}
                      <div className="bg-paper border border-line rounded-xl p-3.5 space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-ink flex items-center gap-1.5">
                            <SunMedium className="w-4 h-4 text-ink-soft" />
                            <span>حالت سرداب (کنتراست بالا و دست خیس)</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => setCellarMode((v) => !v)}
                            className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                              cellarMode
                                ? 'bg-wine text-white'
                                : 'bg-surface text-ink border border-line'
                            }`}
                          >
                            {cellarMode ? 'فعال' : 'غیرفعال'}
                          </button>
                        </div>
                        <label className="flex items-center gap-2 text-xs font-bold text-ink-soft cursor-pointer pt-1">
                          <input
                            type="checkbox"
                            checked={autoSuggestNightCellar}
                            onChange={(e) =>
                              setAutoSuggestNightCellar(e.target.checked)
                            }
                            className="rounded border-line text-wine focus:ring-wine"
                          />
                          <span>
                            پیشنهاد خودکار حالت انبار در ساعات شب (۱۹ تا ۰۶)
                          </span>
                        </label>
                      </div>
                    </div>
                  </section>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Global Interactive Glossary Popover Modal */}
      {activeGlossaryItem && (
        <div
          className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-3"
          onClick={closeGlossaryTerm}
        >
          <div
            className="bg-white border border-stone-200 rounded-2xl max-w-md w-full p-4 shadow-2xl space-y-2.5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-2 border-b border-stone-100 pb-2">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-600" />
                <h4 className="text-sm font-bold text-stone-900">
                  {activeGlossaryItem.termFa}{' '}
                  <span className="font-mono text-xs text-stone-500">
                    ({activeGlossaryItem.termEn})
                  </span>
                </h4>
              </div>
              <button
                type="button"
                onClick={closeGlossaryTerm}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-stone-700 leading-relaxed font-medium">
              {activeGlossaryItem.shortTooltipFa}
            </p>
            {activeGlossaryItem.formulaOrRangeFa && (
              <div className="text-xs font-mono font-bold text-amber-900 bg-amber-50 border border-amber-200 px-2.5 py-1.5 rounded-xl">
                {activeGlossaryItem.formulaOrRangeFa}
              </div>
            )}
            <p className="text-xs text-stone-600 leading-relaxed">
              <strong className="text-stone-900">اهمیت کارگاهی:</strong>{' '}
              {activeGlossaryItem.whyItMattersFa}
            </p>
          </div>
        </div>
      )}

      {/* Global 10-Second Wet-Hands Daily Logger Modal */}
      <QuickTenSecondLogModal
        isOpen={isQuickLogOpen}
        onClose={() => closeQuickLog()}
        onLogSaved={() => {
          setDataRefreshTick((t) => t + 1);
          notifyDataChanged();
        }}
      />

      {/* Global Batch Onboarding Wizard Modal */}
      <BatchOnboardingWizardModal
        isOpen={isOnboardingOpen}
        onClose={closeOnboardingWizard}
        onBatchCreated={() => {
          setDataRefreshTick((t) => t + 1);
          notifyDataChanged();
        }}
      />

      {/* Footer */}
      <footer className="bg-surface text-ink-soft border-t border-line text-xs py-4 px-6 text-center no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            سامانه تخصصی مدیریت کارگاهی، مهندسی انولوژی و کنترل کیفی شراب‌سازی | مستر پروتکل رشه سردشت
          </span>
          <span className="font-mono text-stone-500">
            SOP-OENO-1403-RS400 • نسخه ۳.۲
          </span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <EnologyUiProvider>
      <AppWorkspace />
    </EnologyUiProvider>
  );
}
