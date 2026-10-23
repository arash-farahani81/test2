import React, { useEffect, useRef, useState } from 'react';
import {
  Wine,
  FileText,
  FlaskConical,
  Database,
  Compass,
  Activity,
  ShieldCheck,
  AlertTriangle,
  Share2,
  SunMedium,
  Sparkles,
  MoreHorizontal,
  Timer,
  Sliders
} from 'lucide-react';
import { enologyDb } from '../db/enologyDatabase.ts';
import {
  useEnologyUi,
  type AppFiveTabView,
  type GlobalTankSelection
} from '../context/EnologyUiContext.tsx';
import { useLocalStorageState } from '../utils/useLocalStorage.ts';
import {
  getGlobalActiveTimersSnapshot,
  type WorkshopTimerConfig
} from './ProcessRoadmapTracker.tsx';

export type MainPillarView = 'roadmap' | 'tracking' | 'testing-guide' | 'protocol';

interface HeaderProps {
  activeView?: MainPillarView;
  onViewChange?: (view: MainPillarView) => void;
  activeFiveTab?: AppFiveTabView;
  onFiveTabChange?: (tab: AppFiveTabView) => void;
  cellarMode?: boolean;
  onToggleCellarMode?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  onViewChange,
  activeFiveTab: externalFiveTab,
  onFiveTabChange,
  cellarMode: externalCellarMode,
  onToggleCellarMode
}) => {
  const {
    activeTab: ctxActiveTab,
    setActiveTab: ctxSetActiveTab,
    globalTankSelection,
    setGlobalTankSelection,
    tankCount,
    activeBatch,
    batches,
    activeBatchId,
    setActiveBatchId,
    navigateToRoadmapStep,
    equipmentCapabilities,
    openEquipmentModal,
    activeTankYeastStrain,
    openYeastSelectorModal,
    dataVersion
  } = useEnologyUi();

  const currentTab: AppFiveTabView = externalFiveTab ?? ctxActiveTab;

  // Global Workshop Timer Sync across all 5 tabs (Idea 3)
  const [timerRunning] = useLocalStorageState<Record<string, boolean>>(
    'enology_timer_running_v1',
    {}
  );
  const [timerElapsed, setTimerElapsed] = useLocalStorageState<
    Record<string, number>
  >('enology_timer_elapsed_v1', {});
  const [customTimers] = useLocalStorageState<WorkshopTimerConfig[]>(
    'enology_custom_workshop_timers',
    []
  );
  const [timerDurations] = useLocalStorageState<Record<string, number>>(
    'enology_timer_durations_v1',
    {}
  );
  const vibratedTimersRef = useRef<Record<string, boolean>>({});

  useEffect(() => {
    const hasRunning = Object.values(timerRunning).some(Boolean);
    if (!hasRunning || currentTab === 'roadmap') return;

    const interval = setInterval(() => {
      setTimerElapsed((prev) => {
        const next = { ...prev };
        for (const [k, isRun] of Object.entries(timerRunning)) {
          if (isRun) {
            next[k] = (next[k] || 0) + 1;
          }
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerRunning, currentTab, setTimerElapsed]);

  const durationOverridesMin = Object.fromEntries(
    Object.entries(timerDurations).map(([k, val]) => [
      k,
      val >= 60 ? val / 60 : val
    ])
  );

  const activeTimers = getGlobalActiveTimersSnapshot({
    runningMap: timerRunning,
    elapsedMap: timerElapsed,
    customTimers,
    durationOverridesMin
  });

  useEffect(() => {
    for (const timer of activeTimers) {
      if (timer.isCompletedCountdown && !vibratedTimersRef.current[timer.id]) {
        vibratedTimersRef.current[timer.id] = true;
        if (
          typeof navigator !== 'undefined' &&
          typeof navigator.vibrate === 'function'
        ) {
          try {
            navigator.vibrate([200, 100, 200]);
          } catch {
            // Ignore vibration permission errors
          }
        }
      } else if (!timer.isCompletedCountdown) {
        delete vibratedTimersRef.current[timer.id];
      }
    }
  }, [activeTimers]);

  const handleSelectTab = (tab: AppFiveTabView) => {
    if (onFiveTabChange) {
      onFiveTabChange(tab);
    } else {
      ctxSetActiveTab(tab);
    }
    if (onViewChange) {
      const legacyMap: Record<AppFiveTabView, MainPillarView> = {
        today: 'roadmap',
        tanks: 'tracking',
        lab: 'testing-guide',
        roadmap: 'roadmap',
        more: 'protocol'
      };
      onViewChange(legacyMap[tab]);
    }
  };

  const [dbCount, setDbCount] = useState<number>(
    () => enologyDb.getDatabaseSummary().totalRecords
  );
  const [backupHealth, setBackupHealth] = useState(() =>
    enologyDb.getBackupHealthStatus()
  );
  const [storageDiag, setStorageDiag] = useState(() =>
    enologyDb.getStorageDiagnostics()
  );
  const [storageErrorMsg, setStorageErrorMsg] = useState<string | null>(
    () => enologyDb.getStorageDiagnostics().lastStorageError
  );
  const [isStoragePersisted, setIsStoragePersisted] = useState<boolean | null>(
    null
  );
  const [showBackupPopover, setShowBackupPopover] = useState(false);
  const [internalCellarMode, setInternalCellarMode] = useState<boolean>(() => {
    if (typeof localStorage === 'undefined') return false;
    return localStorage.getItem('enology_cellar_mode_v1') === 'true';
  });

  const isCellarMode = externalCellarMode ?? internalCellarMode;
  const wakeLockRef = useRef<{ release: () => Promise<void> } | null>(null);
  const backupPopoverRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle(
        'cellar-mode-active',
        isCellarMode
      );
    }
    let cancelled = false;
    if (
      isCellarMode &&
      typeof navigator !== 'undefined' &&
      'wakeLock' in navigator
    ) {
      try {
        (
          navigator as unknown as {
            wakeLock?: {
              request: (
                type: 'screen'
              ) => Promise<{ release: () => Promise<void> }>;
            };
          }
        ).wakeLock
          ?.request('screen')
          .then((sentinel) => {
            if (cancelled) {
              sentinel.release().catch(() => {});
            } else {
              wakeLockRef.current = sentinel;
            }
          })
          .catch(() => {
            // Ignore WakeLock errors on unsupported browsers
          });
      } catch {
        // Ignore WakeLock errors
      }
    } else if (wakeLockRef.current) {
      wakeLockRef.current.release().catch(() => {});
      wakeLockRef.current = null;
    }
    return () => {
      cancelled = true;
      if (wakeLockRef.current) {
        wakeLockRef.current.release().catch(() => {});
        wakeLockRef.current = null;
      }
    };
  }, [isCellarMode]);

  useEffect(() => {
    if (!showBackupPopover || typeof document === 'undefined') return;
    const handleMouseDown = (e: MouseEvent) => {
      if (
        backupPopoverRef.current &&
        !backupPopoverRef.current.contains(e.target as Node)
      ) {
        setShowBackupPopover(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowBackupPopover(false);
      }
    };
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showBackupPopover]);

  useEffect(() => {
    if (
      typeof navigator !== 'undefined' &&
      navigator.storage &&
      typeof navigator.storage.persist === 'function'
    ) {
      navigator.storage
        .persist()
        .then((persisted) => setIsStoragePersisted(persisted))
        .catch(() => setIsStoragePersisted(false));
    }
  }, []);

  useEffect(() => {
    setDbCount(enologyDb.getDatabaseSummary().totalRecords);
    setBackupHealth(enologyDb.getBackupHealthStatus());
    setStorageDiag(enologyDb.getStorageDiagnostics());
  }, [dataVersion]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDbCount(enologyDb.getDatabaseSummary().totalRecords);
      setBackupHealth(enologyDb.getBackupHealthStatus());
      setStorageDiag(enologyDb.getStorageDiagnostics());
    }, 10000);

    const handleStorageError = (evt: Event) => {
      const customEvt = evt as CustomEvent<string>;
      setStorageErrorMsg(
        customEvt.detail ||
          'ذخیره نشد؛ حافظهٔ مرورگر پر است. همین الان فایل پشتیبان بگیرید.'
      );
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('enology-storage-error', handleStorageError);
    }
    return () => {
      clearInterval(interval);
      if (typeof window !== 'undefined') {
        window.removeEventListener('enology-storage-error', handleStorageError);
      }
    };
  }, []);

  const handleToggleCellar = () => {
    if (onToggleCellarMode) {
      onToggleCellarMode();
      return;
    }
    const next = !internalCellarMode;
    setInternalCellarMode(next);
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('enology_cellar_mode_v1', String(next));
      } catch {
        // Ignore
      }
    }
  };

  const handleOneTapBackup = async () => {
    const jsonStr = enologyDb.buildExportDatabaseJSON();
    const logs = enologyDb.getLogs(undefined, false, activeBatch?.id).filter((l) => !l.isBenchmark);
    const recentSummaryText = [
      'خلاصه پشتیبان سامانه مهندسی شراب‌سازی (Enology Studio)',
      `تعداد کل رکوردها: ${enologyDb.getDatabaseSummary().totalRecords}`,
      ...logs
        .slice(-5)
        .map(
          (l) =>
            `روز ${l.dayNumber} (${l.tankId}): SG=${l.sg.toFixed(3)} | T=${l.tempCap}°C | pH=${l.ph}`
        )
    ].join('\n');

    const fileName = `enology-backup-${new Date().toISOString().slice(0, 10)}.json`;
    if (
      typeof navigator !== 'undefined' &&
      typeof navigator.share === 'function'
    ) {
      try {
        const file = new File([jsonStr], fileName, {
          type: 'application/json'
        });
        await navigator.share({
          title: 'فایل پشتیبان شراب‌سازی (Enology Backup)',
          text: recentSummaryText,
          files: [file]
        });
        enologyDb.confirmBackupCompleted();
        setBackupHealth(enologyDb.getBackupHealthStatus());
        return;
      } catch (err) {
        if ((err as { name?: string })?.name === 'AbortError') {
          return;
        }
        // Fallback to direct download if share is unsupported for files
      }
    }

    if (typeof document !== 'undefined') {
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
      enologyDb.confirmBackupCompleted();
      setBackupHealth(enologyDb.getBackupHealthStatus());
    }
  };

  const chipColorClass =
    backupHealth.status === 'amber'
      ? 'bg-amber-50/80 text-warn border-warn'
      : 'bg-red-50 text-danger border-danger';

  const rawTankPillOptions: { id: GlobalTankSelection; shortLabel: string; titleFa: string }[] =
    tankCount === 1
      ? [
          { id: 'tank-a', shortLabel: 'الف', titleFa: 'مخزن قرمز (تک‌مخزنه)' },
          { id: 'tank-rose', shortLabel: 'رُزه', titleFa: 'گالن رُزه (Saignée)' }
        ]
      : [
          { id: 'tank-a', shortLabel: 'الف', titleFa: 'مخزن قرمز A' },
          { id: 'tank-b', shortLabel: 'ب', titleFa: 'مخزن قرمز B' },
          { id: 'tank-rose', shortLabel: 'رُزه', titleFa: 'گالن رُزه (Saignée)' },
          { id: 'both-red', shortLabel: 'هر دو', titleFa: 'هر دو مخزن قرمز (A + B)' }
        ];
  const tankPillOptions =
    !equipmentCapabilities.produceRoseSaignee && activeBatch?.targetStyle !== 'rose'
      ? rawTankPillOptions.filter((opt) => opt.id !== 'tank-rose')
      : rawTankPillOptions;

  const fiveTabsConfig: {
    id: AppFiveTabView;
    labelFa: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'today',
      labelFa: 'امروز',
      icon: <Sparkles className="w-4 h-4 shrink-0" />
    },
    {
      id: 'tanks',
      labelFa: 'مخزنها',
      icon: <Activity className="w-4 h-4 shrink-0" />
    },
    {
      id: 'lab',
      labelFa: 'آزمایش',
      icon: <FlaskConical className="w-4 h-4 shrink-0" />
    },
    {
      id: 'roadmap',
      labelFa: 'نقشه راه',
      icon: <Compass className="w-4 h-4 shrink-0" />
    },
    {
      id: 'more',
      labelFa: 'بیشتر',
      icon: <MoreHorizontal className="w-4 h-4 shrink-0" />
    }
  ];

  // Unused references kept for backward compatibility
  void activeView;
  void dbCount;
  void storageDiag;
  void handleToggleCellar;

  return (
    <>
      <header className="bg-surface text-ink border-b border-line sticky top-0 z-40 no-print font-['Vazirmatn',sans-serif]">
        {/* Persistent Red Storage Quota Error Banner */}
        {(storageErrorMsg || storageDiag.lastStorageError) && (
          <div className="bg-danger text-white px-4 py-2 text-xs font-bold flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>
                {storageErrorMsg ||
                  storageDiag.lastStorageError ||
                  'ذخیره نشد؛ حافظهٔ مرورگر پر است. همین الان فایل پشتیبان بگیرید.'}
              </span>
            </div>
            <button
              type="button"
              onClick={handleOneTapBackup}
              className="px-3 py-1 rounded-lg bg-surface text-danger font-bold cursor-pointer shrink-0"
            >
              پشتیبان‌گیری فوری
            </button>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3">
          {/* Active Batch Name */}
          <div className="flex items-center gap-2.5 min-w-0">
            <Wine className="w-5 h-5 text-wine shrink-0" />
            {batches.length > 1 ? (
              <select
                aria-label="انتخاب بچ فعال"
                value={activeBatchId}
                onChange={(e) => setActiveBatchId(e.target.value)}
                className="text-base font-bold text-ink bg-transparent border border-line rounded-lg px-2.5 py-1 truncate cursor-pointer"
              >
                {batches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            ) : (
              <h1 className="text-base font-bold text-ink truncate">
                {activeBatch?.name ?? 'کارگاه شراب‌سازی رشه'}
              </h1>
            )}
          </div>

          {/* Global Tank Selector, Desktop 5 Tabs & Conditional Backup Chip */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Global Tank Selector (الف | ب | رُزه | هر دو) */}
            <div
              role="group"
              aria-label="انتخابگر سراسری مخزن"
              className="bg-paper p-1 rounded-lg border border-line flex items-center gap-1"
            >
              {tankPillOptions.map((opt) => {
                const isSelected = globalTankSelection === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setGlobalTankSelection(opt.id)}
                    title={opt.titleFa}
                    className={`px-2.5 py-1 rounded-md text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-wine text-white font-bold'
                        : 'text-ink-soft hover:text-ink font-medium'
                    }`}
                  >
                    {opt.shortLabel}
                  </button>
                );
              })}
            </div>

            {/* Desktop 5-Tab Navigation (`hidden md:flex`) */}
            <nav
              aria-label="ناوبری ۵ تبی سامانه"
              className="hidden md:flex bg-paper p-1 rounded-lg border border-line items-center gap-1"
            >
              {fiveTabsConfig.map((tab) => {
                const isActive = currentTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleSelectTab(tab.id)}
                    className={`px-3 py-1.5 rounded-md text-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-wine text-white font-bold'
                        : 'text-ink-soft hover:text-ink font-medium'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.labelFa}</span>
                  </button>
                );
              })}
            </nav>

            {/* Equipment Profile Quick Button */}
            <button
              type="button"
              data-testid="header-equipment-profile-btn"
              onClick={openEquipmentModal}
              className="rounded-lg border border-line bg-paper px-2.5 py-1 text-xs font-medium text-ink hover:border-wine inline-flex items-center gap-1.5 cursor-pointer transition-colors"
              title="تنظیم تجهیزات و موجودی کارگاه"
            >
              <Sliders className="w-3.5 h-3.5 text-wine shrink-0" />
              <span>تجهیزات: {equipmentCapabilities.shortBadgeFa}</span>
            </button>

            {/* Active Yeast Strain Quick Button */}
            <button
              type="button"
              data-testid="header-yeast-selector-btn"
              onClick={openYeastSelectorModal}
              className="rounded-lg border border-line bg-paper px-2.5 py-1 text-xs font-medium text-ink hover:border-wine inline-flex items-center gap-1.5 cursor-pointer transition-colors"
              title="انتخاب سویه مخمر از دانشنامه ۳۶ سویه جهانی"
            >
              <FlaskConical className="w-3.5 h-3.5 text-wine shrink-0" />
              <span>مخمر: <strong className="ltr-metric">{activeTankYeastStrain.code}</strong></span>
            </button>

            {/* Conditional Backup Status Chip — ONLY shown when Amber or Red */}
            {backupHealth.status !== 'green' && (
              <div className="relative" ref={backupPopoverRef}>
                <button
                  type="button"
                  onClick={() => setShowBackupPopover((v) => !v)}
                  className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors ${chipColorClass}`}
                  title={backupHealth.labelFa}
                >
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  <span className="max-w-[140px] sm:max-w-none truncate">
                    {backupHealth.labelFa}
                  </span>
                </button>

                {showBackupPopover && (
                  <div className="absolute left-0 mt-2 w-72 bg-surface border border-line rounded-xl p-3.5 shadow-lg z-50 text-xs space-y-2.5 text-ink">
                    <div className="font-bold text-ink flex items-center justify-between">
                      <span>وضعیت حفاظت و پشتیبان داده</span>
                      <button
                        type="button"
                        onClick={() => setShowBackupPopover(false)}
                        className="text-ink-soft hover:text-ink cursor-pointer"
                      >
                        ×
                      </button>
                    </div>
                    <div className="text-xs text-ink-soft space-y-1">
                      <div>
                        تغییرات ذخیره نشده در فایل:{' '}
                        <span className="font-mono font-bold text-warn">
                          {backupHealth.unsavedChangesCount}
                        </span>
                      </div>
                      <div>
                        وضعیت حافظه مرورگر:{' '}
                        <span className="font-medium text-ink">
                          {isStoragePersisted
                            ? 'حافظهٔ ماندگار مرورگر فعال است'
                            : 'تضمینی نیست؛ فایل پشتیبان بگیرید'}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleOneTapBackup}
                      className="w-full py-2 rounded-lg bg-wine text-white font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>دریافت و اشتراک‌گذاری پشتیبان (JSON)</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Global Floating Timer Pill (Idea 3) */}
            {activeTimers.length > 0 && (() => {
              const primaryTimer = activeTimers[0];
              return (
                <button
                  type="button"
                  onClick={() => {
                    ctxSetActiveTab('roadmap');
                    onFiveTabChange?.('roadmap');
                    if (primaryTimer.stepIds[0]) {
                      navigateToRoadmapStep(primaryTimer.stepIds[0]);
                    }
                    setTimeout(() => {
                      if (typeof window !== 'undefined') {
                        window.dispatchEvent(
                          new CustomEvent('enology-open-timer-hub')
                        );
                      }
                    }, 60);
                  }}
                  className={`rounded-full px-3 py-1 text-xs font-bold border inline-flex items-center gap-1.5 shadow-sm transition-transform hover:scale-105 cursor-pointer ${
                    primaryTimer.isCompletedCountdown
                      ? 'bg-danger text-white border-danger animate-pulse'
                      : 'bg-wine text-white border-wine'
                  }`}
                  title={primaryTimer.title}
                >
                  <Timer className="w-3.5 h-3.5 shrink-0" />
                  <span className="max-w-[150px] truncate">
                    {primaryTimer.title}
                  </span>
                  <span className="ltr-metric font-bold px-1.5 py-0.5 rounded bg-black/20">
                    {primaryTimer.isCompletedCountdown
                      ? '00:00 !'
                      : primaryTimer.formattedTime}
                  </span>
                  {activeTimers.length > 1 && (
                    <span className="ltr-metric text-xs opacity-90">
                      (+{activeTimers.length - 1})
                    </span>
                  )}
                </button>
              );
            })()}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (`md:hidden fixed bottom-0 inset-x-0 z-40`) */}
      <nav
        aria-label="ناوبری پایین موبایل"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-surface border-t border-line px-1.5 py-1 flex items-center justify-around no-print font-['Vazirmatn',sans-serif]"
      >
        {fiveTabsConfig.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleSelectTab(tab.id)}
              className={`min-h-[56px] min-w-[56px] flex-1 rounded-lg flex flex-col items-center justify-center gap-1 text-xs transition-colors cursor-pointer ${
                isActive
                  ? 'text-wine font-bold'
                  : 'text-ink-soft hover:text-ink font-medium'
              }`}
            >
              {tab.icon}
              <span>{tab.labelFa}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};


