This file is a merged representation of a subset of the codebase, containing files not matching ignore patterns, combined into a single document by Repomix.
The content has been processed where comments have been removed, empty lines have been removed, content has been compressed (code blocks are separated by ⋮---- delimiter).

# File Summary

## Purpose
This file contains a packed representation of a subset of the repository's contents that is considered the most important context.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching these patterns are excluded: **/*.test.*, **/*.spec.*, **/*.svg, **/*.docx, dist/**, .aistudio/**
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Code comments have been removed from supported file types
- Empty lines have been removed from all files
- Content has been compressed - code blocks are separated by ⋮---- delimiter
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
````
.agent/
  API_SIGNATURES.md
  TASK_STATE.md
scripts/
  generate_ai_digest.ts
  generate_docx.ts
src/
  components/
    BandedFermentationChartAndSO2Panel.tsx
    BatchOnboardingWizardModal.tsx
    BioscienceDatabaseView.tsx
    EnologyCalculators.tsx
    FermentationTracker.tsx
    FlexibleProtocolCustomizerBar.tsx
    Header.tsx
    InteractiveLabWizardsPanel.tsx
    MasterProtocolView.tsx
    PhotoDiaryAndVintagePanel.tsx
    ProcessRoadmapTracker.tsx
    QuickTenSecondLogModal.tsx
    RightNowActionCenter.tsx
    TestingGuide.tsx
  context/
    EnologyUiContext.tsx
  data/
    bioscienceData.ts
    masterProtocolConfig.ts
    protocolData.ts
    roadmapStepsData.ts
    seedTrackingData.ts
    smartLoggingPresets.ts
  db/
    enologyDatabase.test.ts
    enologyDatabase.ts
  types/
    database.ts
    index.ts
    tracking.ts
  utils/
    enologyTroubleshooting.test.ts
    enologyTroubleshooting.ts
    enologyUtils.test.ts
    enologyUtils.ts
    exportDocxReport.test.ts
    exportDocxReport.ts
    persianDate.ts
    rightNowEngine.test.ts
    rightNowEngine.ts
    trackingCalculations.test.ts
    trackingCalculations.ts
    useLocalStorage.ts
    useToast.ts
  App.tsx
  index.css
  main.tsx
.aiignore
.clineignore
.clinerules
.env.example
.gitignore
.repomixignore
AGENTS.md
index.html
metadata.json
package.json
repomix.config.json
system-logic-audit.md
tsconfig.json
vite.config.ts
````

# Files

## File: .agent/API_SIGNATURES.md
````markdown
# Core Enology Studio API Signatures (Contract Reference)

## 1. `src/utils/enologyUtils.ts`
```ts
export type VolumeBasis = 'liquid_phase' | 'gross_mash';
export type ScalePrecisionGrams = 1 | 0.1 | 0.01;
export type StockCompoundCategory = 'zinc' | 'kms' | 'copper' | 'tartaric' | 'fermaid_or_yeast' | 'general';
export function isAlreadyLiquidVolume(volumeL: number): boolean;
export function getEffectiveLiquidVolume(volumeL: number, isUnpressedRedMustOrBasis?: boolean | VolumeBasis, mashYieldFactor?: number): number;
export function calculateKMS(volumeL: number, currentSO2: number, targetSO2: number, isUnpressedRedMust?: boolean | VolumeBasis, mashYieldFactor?: number): number;
export function normalizeEnologyNumericInput(raw: string | number, mode?: 'sg' | 'general'): number | null;
export function correctHydrometer(measuredSG: number, tempC: number, calibrationTempC?: 20 | 15.5): { trueSG: number; delta: number; isAbove32CWarning?: boolean; warningFa?: string };
export function calculateScaleVolumes(grapeKg: number): { mashVolume: number; liquidVolume: number; saigneeVolume: number; roseFinalVolume: number; redFinalVolume: number };
export function calculateTitratableAcidity(vNaOH_mL: number, nNaOH?: number, vSample_mL?: number): number;
export function calculateTartaricAddition(currentTA: number, targetTA: number, volumeL: number, isUnpressedRedMust?: boolean | VolumeBasis, mashYieldFactor?: number): number;
export function estimateAcidOrBaseFromPHShift(currentPH: number, targetPH: number, effectiveVolumeL: number): {
  mode: 'acidification' | 'deacidification' | 'none'; reagentFa: string;
  lowBufferGrams: number; typicalBufferGrams: number; highBufferGrams: number;
  isEmpiricalEstimateOnly: true; warningFa: string;
};
export function calculateDeacidificationOptions(deltaTA_gL: number, effectiveVolumeL: number): { khco3StoichiometricGrams: number; khco3WithColdStabGrams: number; caco3Grams: number };
export function calculateKHCO3Deacidification(currentPH: number, targetMinPH: number, volumeL: number, isUnpressedRedMust?: boolean | VolumeBasis, deltaTA_gL?: number, mashYieldFactor?: number): number;
export function calculateFreeSO2Ripper(vI2_mL: number, nI2?: number, vSample_mL?: number): number;
export function calculateMolecularSO2(freeSO2_ppm: number, pH: number): number;
export function calculateRefractometerCorrection(origBrix: number, currentRefractometerBrix: number): {
  trueBrix: number; trueSG: number; abv: number; isWortEmpiricalApproximation: true; disclaimerFa: string;
};
export function calculateSNAAmounts(volumeL: number, brix?: number, sgOrStrain?: number | 'low' | 'medium' | 'high', naturalYAN?: number, sgOptional?: number, isUnpressedRedMust?: boolean | VolumeBasis, mashYieldFactor?: number, customRates?: { fermaidO1RateGL?: number; fermaidK2RateGL?: number; dap2RateGL?: number; fermaidO3RateGL?: number; zincRateGL?: number }): {
  initialSG: number; effectiveVolumeL: number; sugarGL: number; sugarGPerL: number; targetYAN: number; neededYAN: number;
  fermaidO_1: number; fermaidK_2: number; dap_2: number; zinc_2: number; fermaidO_3: number; fermaidK_3: number;
  suppliedChemicalYAN_mgL: number; suppliedBioEquivalentYAN_mgL: number; additionalFermaidOForPureChemicalParityG: number; zincNoteFa: string;
};
export function calculateBenchFiningGrams(doseG_per_L: number, tankVolume_L: number): number;
export function calculateCoolingDryIceKg(volumeL: number, currentTempC: number, targetTempC?: number, sg?: number, efficiency?: number): number;
export function getTargetFreeSO2ByPH(ph: number, isRose?: boolean): { min: number; max: number; target: number };
export function getContinuousTargetFreeSO2ByPH(ph: number, isRose?: boolean, targetMolecularMgL?: number): { min: number; max: number; target: number; targetMolecularMgL: number; formulaText: string };
export function calculateStockSolutionPlan(targetDoseGrams: number, scalePrecisionGrams?: ScalePrecisionGrams, compoundCategory?: StockCompoundCategory): {
  needsStockSolution: boolean; canUseStockSolution: boolean; targetDoseGrams: number; scalePrecisionGrams: ScalePrecisionGrams;
  stockMassGrams: number; stockVolumeMl: number; syringeVolumeMl: number; roundedDirectGrams: number; directWeighErrorPct: number;
  instructionFa: string; stabilityNoteFa: string;
};
export function calculateDynamicSGTriggers(initialSG?: number, overrides?: { pressingPoint?: number; drynessPoint?: number }): {
  initialSG: number; sna1: number; sna2: number; oneThirdCeiling: number; phase2Tannin: number; sna3: number; pressingPoint: number; drynessPoint: number;
};
export function calculateH2O2SulfiteRemoval(volumeL: number, currentSO2: number, targetSO2?: number): number;
export function calculateStagedH2O2Plan(volumeL: number, currentSO2: number, targetSO2?: number): {
  effectiveTargetSO2: number; totalExcessSO2MgL: number; maxSingleStepReductionMgL: number; currentStepReductionMgL: number;
  totalTheoretical3PercentMl: number; maxCurrentStep3PercentMl: number; recommendedSafeTrialStep1Ml: number;
  dilutedUnder1PercentTotalVolumeMl: number; stagesRequired: number; requiresReMeasurementBeforeNextStage: true;
};
```

## 2. `src/utils/trackingCalculations.ts`
```ts
export function calculateFermentationProgress(sg: number, initialSG?: number, finalSG?: number): number;
export function calculateAlcoholByVolume(initialSG: number, currentSG: number): number;
export function brixToSpecificGravity(brix: number): number;
export function specificGravityToBrix(sg: number): number;
export function getCapTemperatureAlertLevel(tempCap: number, isRose?: boolean, currentSG?: number): 'normal' | 'caution' | 'warning' | 'danger';
export function sortFermentationLogs(logs: FermentationLogEntry[]): FermentationLogEntry[];
export function analyzeLogEntryHealth(log: FermentationLogEntry, tankId?: TankId, recordedAdditions?: ChemicalAddition[], planOverride?: DynamicProtocolPlan): LogHealthAnalysis;
export function compareRealLogsWithBenchmark(realLogs: FermentationLogEntry[], benchmarkLogs: FermentationLogEntry[], tankId?: TankId): BenchmarkComparison;
export function calculateRecentLogVelocity(sortedLogs: FermentationLogEntry[], initialSGOverride?: number): { recentVelocityPerDay: number; hasObservedVelocity: boolean; referenceSG: number };
export function calculateVelocity(logs: FermentationLogEntry[]): number;
export function predictFermentationCompletion(logs: FermentationLogEntry[], tankId?: TankId, targetSGOverride?: number, tempOverride?: number, initialSGOverride?: number): FermentationPredictionResult;
```

## 3. `src/utils/enologyTroubleshooting.ts`
```ts
export interface ScenarioInput {
  batchVolumeL: number; currentSG: number; currentBrix: number; tempCapC: number; ph: number; ta: number; freeSO2: number;
  dayNumber?: number; isRose?: boolean; isUnpressedMash?: boolean; isUnpressedRedMust?: boolean;
  issues?: { isStuckFermentation?: boolean; hasH2S?: boolean; hasVolatileAcidity?: boolean; hasDryCap?: boolean; hasBitterSeeds?: boolean; hasCloudiness?: boolean };
}
export interface CorrectiveAction {
  title: string; category: 'pH_Acid' | 'Temperature' | 'SG_Ferment' | 'SO2_Oxidation' | 'OffOdor_Spoilage' | 'Tannin_Fining';
  severity: 'normal' | 'caution' | 'warning' | 'danger'; diagnosis: string; solutionSummary: string;
  calculatedRecipe?: { item: string; amount: string; unit: string; instruction: string }[]; steps: string[];
  alertTier?: 'critical' | 'attention' | 'info'; canSnooze?: boolean;
  confidenceBadge?: 'stoichiometric' | 'rule_of_thumb' | 'empirical_unverified'; confidenceLabelFa?: string;
  progressiveLayers?: { layer1ActionFa: string; layer2WhyFa: string; layer3ScienceFa: string };
}
export interface EnologyEvaluationResult {
  overallHealthScore: number; overallStatusText: string; overallStatusColor: 'emerald' | 'amber' | 'rose' | 'blue';
  criticalWarningsCount: number; actions: CorrectiveAction[];
  visibleActions: CorrectiveAction[]; hiddenActionsCount: number; infoActions: CorrectiveAction[];
  hasInvalidVolume?: boolean;
}
export function evaluateEnologicalScenario(input: ScenarioInput): EnologyEvaluationResult;
```

## 4. `src/db/enologyDatabase.ts`
```ts
export interface CumulativeSO2Ledger {
  tankId: TankId; batchId?: string; addedFromKmsMgL: number; totalKmsMassGrams: number;
  finalVolumeEquivalentMgL: number; skippedInvalidUnitCount: number; endogenousYeastMgL: number;
  estimatedTotalSO2MgL: number; legalCeilingMgL: number; remainingBudgetMgL: number; isOverBudget: boolean;
  accountingBasisFa: string; estimatedBoundAndVolatilizedRatio: number; measuredTotalSO2MgL?: number;
  stageBreakdown: Array<{ id: string; stageTitle: string; amountGrams: number; referenceVolumeL: number; contributedMgL: number; formulaText: string; isDemo?: boolean }>;
}
export const enologyDb: {
  hydrateFromIndexedDBIfNeeded(): Promise<boolean>;
  getStorageDiagnostics(): { lastStorageError: string | null; corruptedKeysRecovered: string[] };
  getBatches(): WineBatch[];
  getBatchById(id: string): WineBatch | undefined;
  addBatch(batch: Omit<WineBatch, 'id'>): WineBatch;
  updateBatch(id: string, updates: Partial<WineBatch>): WineBatch | null;
  updateBatchProtocolSnapshot(batchId: string, params: FlexibleProtocolParams): WineBatch | null;
  hasDemoData(): boolean;
  startRealBatchMode(newBatch?: Omit<WineBatch, 'id'>): WineBatch | null;
  getOrphanRecordsSummary(): { orphanLogsCount: number; orphanAdditionsCount: number; orphanAnalysesCount: number };
  assignOrphanRecordsToBatch(targetBatchId: string): void;
  getLogs(tankId?: TankId, includeDeleted?: boolean, batchId?: string): FermentationLogEntry[];
  addLog(entry: FermentationLogEntry): FermentationLogEntry[];
  updateLog(id: string, entry: Partial<FermentationLogEntry>): FermentationLogEntry[];
  softDeleteLog(id: string): FermentationLogEntry[];
  restoreLog(id: string): FermentationLogEntry[];
  deleteLog(id: string): FermentationLogEntry[];
  clearRealLogs(tankId?: TankId): FermentationLogEntry[];
  resetLogsToDefault(): FermentationLogEntry[];
  getAdditions(tankId?: TankId, includeDeleted?: boolean, batchId?: string): ChemicalAddition[];
  addAddition(addition: Omit<ChemicalAddition, 'id'>): ChemicalAddition;
  softDeleteAddition(id: string): ChemicalAddition[];
  restoreAddition(id: string): ChemicalAddition[];
  deleteAddition(id: string): ChemicalAddition[];
  getLabAnalyses(tankId?: TankId, includeDeleted?: boolean, batchId?: string): LabAnalysisRecord[];
  addLabAnalysis(analysis: Omit<LabAnalysisRecord, 'id'>): LabAnalysisRecord;
  softDeleteLabAnalysis(id: string): LabAnalysisRecord[];
  restoreLabAnalysis(id: string): LabAnalysisRecord[];
  deleteLabAnalysis(id: string): LabAnalysisRecord[];
  getSavedCalculations(): SavedCalculation[];
  saveCalculation(calc: Omit<SavedCalculation, 'id' | 'timestamp'>): SavedCalculation;
  deleteCalculation(id: string): SavedCalculation[];
  getCumulativeSO2Ledger(tankId: TankId, batchVolumeL?: number, residualSugarGL?: number, measuredTotalSO2MgL?: number, excludeDemo?: boolean, batchId?: string): CumulativeSO2Ledger;
  getBackupHealthStatus(): { status: 'green' | 'amber' | 'red'; daysSinceBackup: number | null; unsavedChangesCount: number; labelFa: string };
  getDatabaseSummary(): { totalBatches: number; totalFermentationLogs: number; totalChemicalAdditions: number; totalLabAnalyses: number; totalSavedCalculations: number; totalRecords: number; lastUpdated: string };
  buildExportDatabaseJSON(): string;
  confirmBackupCompleted(): void;
  exportDatabaseJSON(confirmImmediately?: boolean): string;
  exportLogsToCSV(tankId?: TankId): string;
  previewDatabaseImport(jsonString: string): { valid: boolean; messageFa: string; summary?: { batchesCount: number; logsCount: number; additionsCount: number; analysesCount: number; dateRangeFa: string } };
  importDatabaseJSON(jsonString: string, mode?: 'replace' | 'merge'): { success: boolean; message: string };
  resetToFactoryDefaults(): void;
};
```

## 5. `src/data/masterProtocolConfig.ts`
```ts
export const MASTER_PROTOCOL_CONFIG: Readonly<typeof MASTER_PROTOCOL_CONFIG>;
export const IDEAL_DEFAULT_PROTOCOL_PARAMS: FlexibleProtocolParams;
export const CLASSIC_V32_PROTOCOL_PARAMS: FlexibleProtocolParams;
export const FLEXIBLE_PARAM_METADATA: ReadonlyArray<FlexibleParamMetaItem>;
export function computeDynamicProtocolPlan(params?: Partial<FlexibleProtocolParams>): DynamicProtocolPlan;
export function getCurrentDynamicProtocolPlan(): DynamicProtocolPlan;
export function getEffectiveProtocolPlanForBatch(batch?: { protocolParamsSnapshot?: Record<string, number | string> } | null, explicitPlan?: DynamicProtocolPlan, preferExplicit?: boolean): DynamicProtocolPlan;
export function useFlexibleProtocol(): {
  params: FlexibleProtocolParams; plan: DynamicProtocolPlan;
  updateParam: <K extends Exclude<keyof FlexibleProtocolParams, 'presetId'>>(key: K, value: FlexibleProtocolParams[K]) => void;
  applyPreset: (presetId: 'conservative_ideal' | 'classic_v32') => void;
  resetParamToIdeal: <K extends Exclude<keyof FlexibleProtocolParams, 'presetId'>>(key: K) => void;
  resetAllToIdeal: () => void;
  isModifiedFromIdeal: boolean;
};
```

## 6. `src/utils/rightNowEngine.ts`
```ts
export type MilestoneState = 'pending' | 'due' | 'missed' | 'closed' | 'completed' | 'skipped';
export type MilestoneTriggerType = 'sg' | 'day' | 'event';
export interface MilestoneTankRow {
  tankId: TankId; tankLabelFa: string; doseAmountTextFa: string; isCompletedForTank: boolean;
  additionsToRecord: Array<Omit<ChemicalAddition, 'id'>>;
}
export interface RightNowMilestone {
  id: string; roadmapStepIds: number[]; titleFa: string; whyFa: string; howToExecuteFa: string;
  scienceNoteFa: string; confidenceLabelFa: string; triggerType: MilestoneTriggerType;
  triggerSG?: number; windowCloseSG?: number; triggerDay?: number; windowCloseDay?: number;
  state: MilestoneState; stateBadgeFa: string; closedReasonFa?: string; canMarkDone: boolean;
  estimatedHoursUntilDue?: { min: number; max: number }; skippedReasonFa?: string; snoozedUntilMs?: number;
  tankRows: MilestoneTankRow[];
}
export interface SgAnomalyAlert {
  hasAnomaly: boolean; previousSG: number; currentSG: number; titleFa: string; descriptionFa: string;
}
export interface RightNowQueueResult {
  sgAnomaly: SgAnomalyAlert | null; primaryAction: RightNowMilestone | null;
  overdueActions: RightNowMilestone[]; closedActions: RightNowMilestone[];
  upcomingActions: RightNowMilestone[]; allMilestones: RightNowMilestone[];
}
export interface DeadlineCountdownItem {
  id: 'dap_window' | 'bactiless_contact' | 'post_dryness_so2'; titleFa: string; rangeTextFa: string;
  color: 'emerald' | 'amber' | 'rose' | 'gray'; urgencyLevel: 'safe' | 'warning' | 'critical' | 'closed'; explanationFa: string;
}
export interface BottlingGateCheckItem {
  id: string; titleFa: string; isBlocking: boolean; status: 'passed' | 'blocked_red' | 'advisory_amber';
  dataStatus?: 'verified' | 'incomplete_data' | 'failed'; detailFa: string; whyFa: string;
}
export interface BottlingReadinessResult {
  blockingItems: BottlingGateCheckItem[]; advisoryItems: BottlingGateCheckItem[];
  allBlockingPassed: boolean; canStartBottling: boolean;
  executionMode: 'safe_ready' | 'override_with_risk' | 'blocked';
  overriddenBlockerIds: string[]; overrideWarningFa?: string;
  riskOverrideReason?: string;
  overrideAudit?: { overriddenAtMs: number; reason: string; overriddenBlockerIds: string[]; tankId: TankId; batchId?: string };
  so2AgeHours?: number;
}
export function evaluateRightNowQueue(options: {
  logs: FermentationLogEntry[]; additions: ChemicalAddition[]; activeTankId?: TankId;
  completedRoadmapStepIds?: number[]; snoozedUntilMsByStepId?: Record<string, number>;
  skippedReasonsByStepId?: Record<string, string>; nowMs?: number; plan?: DynamicProtocolPlan;
  batch?: WineBatch; batchId?: string; excludeDemo?: boolean;
}): RightNowQueueResult;
export function evaluateDeadlineCountdowns(options: {
  logs: FermentationLogEntry[]; additions: ChemicalAddition[]; labAnalyses?: LabAnalysisRecord[];
  tankId?: TankId; plan?: DynamicProtocolPlan; batch?: WineBatch; batchId?: string; excludeDemo?: boolean;
}): DeadlineCountdownItem[];
export function evaluateBottlingReadinessGate(options: {
  logs: FermentationLogEntry[]; additions: ChemicalAddition[]; labAnalyses: LabAnalysisRecord[];
  batch?: WineBatch; batchId?: string; excludeDemo?: boolean; tankId?: TankId; requireRsLabConfirmation?: boolean;
  manualConfirmations?: { clarityConfirmed?: boolean; coldStabConfirmedOrSkipped?: boolean; warmTestPassed?: boolean; sanitationConfirmed?: boolean; malicRiskAccepted?: boolean; clinitestPassed?: boolean; rsConfirmed?: boolean };
  riskOverrideReason?: string; nowMs?: number;
}): BottlingReadinessResult;
```

## 7. `src/context/EnologyUiContext.tsx`
```ts
export type GlobalTankSelection = 'tank-a' | 'tank-b' | 'tank-rose' | 'both-red';
export type AppFiveTabView = 'today' | 'tanks' | 'lab' | 'roadmap' | 'more';
export interface LabDeepLinkRequest {
  testId: string;
  subTab?: 'calculators-sops' | 'troubleshooting-crises' | 'saved-history';
  prefillTankId?: TankId; prefillSG?: number; prefillPH?: number; prefillSO2?: number;
  prefillTA?: number; prefillTempC?: number; prefillVolumeL?: number; returnToTab?: AppFiveTabView; timestampMs?: number;
}
export interface EnologyGlossaryItem {
  key: string; termFa: string; termEn: string; shortTooltipFa: string;
  formulaOrRangeFa?: string; whyItMattersFa: string;
}
export const ENOLOGY_GLOSSARY_DICTIONARY: Record<string, EnologyGlossaryItem>;
export function getGlossaryItem(key: string): EnologyGlossaryItem | undefined;
export function resolveEffectiveTankSelection(selection: GlobalTankSelection, tankCount?: 1 | 2): GlobalTankSelection;
export function resolvePrimaryTankId(selection: GlobalTankSelection, tankCount?: 1 | 2): TankId;
export function resolveTargetTankIds(selection: GlobalTankSelection, tankCount?: 1 | 2): TankId[];
export function getAvailableTankSelections(tankCount?: 1 | 2, targetStyle?: WineBatch['targetStyle']): TankSelectionOption[];
export function getTankSelectionLabelFa(selection: GlobalTankSelection, tankCount?: 1 | 2): string;
export const EnologyUiProvider: React.FC<{ children: React.ReactNode }>;
export function useEnologyUi(): EnologyUiContextValue;
export const GlossaryTerm: React.FC<{ termKey: string; labelOverride?: string; className?: string }>;
```
````

## File: .agent/TASK_STATE.md
````markdown
# Enology Studio — Agent Task State

## Completed
- **Phase 1**: Core Stoichiometry
- **Phase 2A**: Flexible Protocol Engine & Lab Hub
- **Phase 2B**: Dynamic Timers, Sugar-Depletion Matching, Cumulative SO2 Ledger, DOCX Sync
- **Phase 3**: PWA, Zod Validation, Lot Number Traceability
- **Audit Remediation Micro-Task 1**: Core Stoichiometry & Enology Math (`src/utils/enologyUtils.ts` & `src/utils/enologyUtils.test.ts`)
- **Audit Remediation Micro-Task 2**: Cardinal Thermal Kinetics & Duplicate-Dosing Guard (`src/utils/trackingCalculations.ts` & `src/utils/trackingCalculations.test.ts`)
- **Audit Remediation Micro-Task 3**: Database Zod Init, IndexedDB Mirror, OIV SO2 Ceilings & Troubleshooting Sync (`src/db/enologyDatabase.ts`, `src/utils/enologyTroubleshooting.ts`, `src/data/seedTrackingData.ts`, unit tests)
- **Phase 1A & 1B (16-Idea Suite)**: Structured `compoundType` & `referenceVolumeL` SO2 ledger, `isDemo` isolation, soft-delete/undo, corrupt JSON preservation, continuous Henderson-Hasselbalch SO2 target, stock solution assistant, smart numeric input normalizer, 3-layer progressive disclosure, and alert de-noising/conflict resolution.
- **Phase 2A & 2B (16-Idea Suite)**: Unified 5-State Milestone Engine (`rightNowEngine.ts`), Closing-Window Deadline Countdowns, Bottling Readiness Safety Gate, `RightNowActionCenter.tsx`, and `Header.tsx` Backup Health Chip + Cellar Mode toggle.
- **Phase 3 (16-Idea Suite)**: 10-Second Wet-Hands Daily Logger (`QuickTenSecondLogModal.tsx`) + High-Contrast Cellar Mode (`App.tsx`) with Screen Wake Lock & CO2 safety banner.
- **Phase 4 (16-Idea Suite)**: Banded Fermentation SVG Chart (`[-40%, +30%]`), clickable milestone markers, prediction fan, separate temp strip, 3 status pills, and Dual SO2 Added vs Free gauge (`BandedFermentationChartAndSO2Panel.tsx`).
- **Phase 5A & 5B (16-Idea Suite)**: 5-Step Batch Onboarding Wizard (`BatchOnboardingWizardModal.tsx`, 20–5000 kg) and 5 Step-by-Step Interactive Lab Wizards (`InteractiveLabWizardsPanel.tsx` with 15s Ripper timer & Malic Chromatography).
- **Phase 6 (16-Idea Suite)**: IndexedDB 1280px JPEG Photo Diary, 6 Scheduled Tasting Checkpoints, Vintage Comparison, PWA 2nd-visit install prompt, honest Pigeage reminder, `.ics` Calendar Exporter (`PhotoDiaryAndVintagePanel.tsx`), and Backup Import Preview (`merge` vs `replace`).
- **Audit Remediation Part 1**: Core Math, Continuous SO2, Input Normalizer, Dynamic Health & Timestamp Velocity (`enologyUtils.ts` & `trackingCalculations.ts`).
- **Audit Remediation Part 2**: Troubleshooter Stoichiometry (10.8 g/L per °Brix Chaptalization), Post-Fermentation KMS Guard, Continuous SO2 Overdose Thresholds, Acid Deduplication & Label Clarifications (`enologyTroubleshooting.ts` & `masterProtocolConfig.ts`).
- **Audit Remediation Part 3**: Batch & Milestone Schema Fields, Row-Level Zod Salvage, Timestamp-Aware Merge, Unsaved Counter & IndexedDB Fallback (`src/types/*` & `src/db/enologyDatabase.ts`).
- **Audit Remediation Part 4**: Unified Milestone, Deadline & Bottling Readiness Engine Overhaul (`src/utils/rightNowEngine.ts` & unit tests).
- **Final UX Architecture Step 1**: Global Batch/Tank/DeepLink/Glossary Context (`src/context/EnologyUiContext.tsx`) with `'both-red'` selection, `tankCount === 1` auto-adaptation, critical alert cap immunity (`enologyTroubleshooting.ts`), and safe empty-default + 1-sentence learning feedback in 10s logger (`QuickTenSecondLogModal.tsx`).
- **Final UX Architecture Step 2**: «امروز» Page Upgrade (`RightNowActionCenter.tsx` with 5-level hero, conditional deadlines, measurements strip with trend arrows & compact bottling gate) + Unified 3-Mode Logging Bottom Sheet (`QuickTenSecondLogModal.tsx` with safe empty inputs, live preview & 10s undo).
- **Final UX Architecture Step 3**: 5-Tab Navigation (`Header.tsx` + `App.tsx` with mobile bottom nav, desktop header, fontScale scaling, unified «بیشتر» Hub) + 5-Stage Phase Stepper Bar, default active phase filter, direct step logger triggers & floating active timers chip (`ProcessRoadmapTracker.tsx`).
- **Final UX Architecture Step 4**: Question-Based Lab Entry Cards (2×2 grid synced with `InteractiveLabWizardsPanel`), Deep-Link Referral Return Banner (`useEnologyUi().labDeepLink`), and 6 Toggleable Symptom-Based Troubleshooting Chips (`TestingGuide.tsx` + `InteractiveLabWizardsPanel.tsx`).
- **Final UX Architecture Step 5**: Unified Tank Status Card (3 collapsible rows: Diagnosis, Benchmark with `sugarDepletionPct`, and Kinetic Prediction), 1-Tap Chart Layer Toggles (`نمودار SG و مراحل | نوار دمای کلاهک | بودجه و گیج SO2` in `BandedFermentationChartAndSO2Panel.tsx`), and Streamlined 4-Tab Tank Logbook with direct «بیشتر» Master Protocol checklist shortcut (`FermentationTracker.tsx`).
- **Final UX Architecture (Steps 1–5: 5-Tab Navigation `امروز | مخزنها | آزمایش | نقشه راه | بیشتر`, Global Tank/Batch/DeepLink/Glossary Context, Safe Empty-Default Unified Bottom Sheet, Question-Based Lab & Symptom Chips, and Unified Tank Status Card + Chart Layer Toggles)**: **100% Completed**.

## Next Queue
1. Luxury Winery Visual Polish & End-to-End QA
````

## File: scripts/generate_ai_digest.ts
````typescript
import fs from 'node:fs';
import path from 'node:path';
⋮----
function readSafe(relPath: string): string
⋮----
function stripCommentsAndBlankLines(code: string): string
⋮----
function extractComponentSkeleton(relPath: string): string
⋮----
function buildUltraDigest(): string
⋮----
function buildCoreLogicBundle(ultraDigest: string): string
⋮----
function main()
````

## File: scripts/generate_docx.ts
````typescript
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
⋮----
function createParagraph(
  text: string,
  options: {
    bold?: boolean;
    size?: number;
    color?: string;
    align?: (typeof AlignmentType)[keyof typeof AlignmentType];
⋮----
function createSectionHeading(title: string, badge?: string): Paragraph[]
⋮----
function createSubHeading(title: string): Paragraph
⋮----
function createCell(
  content: string | Paragraph[],
  options: {
    isHeader?: boolean;
    widthPercent?: number;
    align?: (typeof AlignmentType)[keyof typeof AlignmentType];
⋮----
export async function buildCompleteMasterProtocolDocx(): Promise<Buffer>
⋮----
async function run()
````

## File: src/components/BandedFermentationChartAndSO2Panel.tsx
````typescript
import React, { useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  FlaskConical,
  Gauge,
  Info,
  Thermometer
} from 'lucide-react';
import type {
  ChemicalAddition,
  FermentationLogEntry,
  LabAnalysisRecord,
  TankId
} from '../types/index.ts';
import { enologyDb } from '../db/enologyDatabase.ts';
import {
  calculateMolecularSO2,
  getContinuousTargetFreeSO2ByPH
} from '../utils/enologyUtils.ts';
import {
  calculateRecentLogVelocity,
  getCapTemperatureAlertLevel,
  predictFermentationCompletion,
  sortFermentationLogs
} from '../utils/trackingCalculations.ts';
import {
  evaluateRightNowQueue,
  type RightNowMilestone
} from '../utils/rightNowEngine.ts';
import { useEnologyUi } from '../context/EnologyUiContext.tsx';
⋮----
export interface BandedFermentationChartAndSO2PanelProps {
  tankId: TankId;
  logs: FermentationLogEntry[];
  additions: ChemicalAddition[];
  labAnalyses: LabAnalysisRecord[];
  onSelectMilestone?: (milestoneId: string) => void;
}
⋮----
const toggleLayer = (layer: 'sg' | 'temp' | 'so2') =>
⋮----
const dayToX = (day: number): number =>
⋮----
const sgToY = (sg: number): number =>
⋮----
// Interpolate X position on active curve for each SG milestone
const getDayAtSG = (targetSgVal: number): number =>
⋮----
{/* Layer Toggle Chips */}
⋮----
⋮----
setSelectedMilestoneId(
                      selectedMilestoneId === m.id ? null : m.id
                    );
onSelectMilestone?.(m.id);
⋮----
const tempToY = (t: number) =>
````

## File: src/components/BatchOnboardingWizardModal.tsx
````typescript
import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FlaskConical,
  Scale,
  Sparkles,
  Wine,
  X
} from 'lucide-react';
import type { WineBatch } from '../types/index.ts';
import { enologyDb } from '../db/enologyDatabase.ts';
import {
  IDEAL_DEFAULT_PROTOCOL_PARAMS,
  computeDynamicProtocolPlan,
  useFlexibleProtocol
} from '../data/masterProtocolConfig.ts';
import {
  brixToSpecificGravity,
  specificGravityToBrix
} from '../utils/trackingCalculations.ts';
import { normalizeEnologyNumericInput } from '../utils/enologyUtils.ts';
import { getCurrentPersianDateTimeStr } from '../utils/persianDate.ts';
import { useEnologyUi } from '../context/EnologyUiContext.tsx';
⋮----
export interface BatchOnboardingWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBatchCreated?: (batch: WineBatch) => void;
}
⋮----
// Step 4: Malic Acid Status
⋮----
const handleSgInputChange = (val: number) =>
⋮----
const handleBrixInputChange = (val: number) =>
⋮----
const handleCompleteOnboarding = () =>
⋮----
onChange=
⋮----
setSugarSource('hydrometer');
setManualBothSugar(false);
const nextBrix = specificGravityToBrix(initialSG);
setInitialBrix(nextBrix);
setInitialBrixInput(nextBrix.toFixed(1));
⋮----
setInitialSgInput(raw);
const parsed = normalizeEnologyNumericInput(raw, 'sg');
⋮----
setInitialSG(parsed);
⋮----
setPhKnown(true);
setTaKnown(true);
setInitialPHInput('3.52');
setInitialTAInput('6.8');
⋮----
setPhKnown(!e.target.checked);
if (e.target.checked) setInitialPHInput('');
⋮----
setTaKnown(!e.target.checked);
if (e.target.checked) setInitialTAInput('');
⋮----
{/* STEP 4: Malic Acid Status */}
````

## File: src/components/BioscienceDatabaseView.tsx
````typescript
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
⋮----
export interface BioscienceDatabaseViewProps {
  onNavigateToCalculators?: () => void;
  onNavigateToTracking?: () => void;
  onNavigateToLabTool?: (testId: string, subTab?: 'calculators-sops' | 'troubleshooting-crises') => void;
  initialActiveTab?: 'chemicals' | 'enzymes' | 'backup';
  hideInternalHeader?: boolean;
}
⋮----
// Live search state
⋮----
// Database Management & Idea 5 Import Preview / Merge
⋮----
const showFeedback = (text: string, type: 'success' | 'error' = 'success') =>
⋮----
const handleLivePubChemSearch = async (e: React.FormEvent) =>
⋮----
const handleExportJSON = () =>
⋮----
const handleExportCSV = () =>
⋮----
const handleGenerateTankDocx = async () =>
⋮----
const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) =>
⋮----
const handleConfirmDatabaseImport = () =>
⋮----
const handleResetDefaults = () =>
⋮----
setActiveTab('backup');
setDbSummary(enologyDb.getDatabaseSummary());
⋮----
onChange=
⋮----
href={`https://pubchem.ncbi.nlm.nih.gov/compound/${selectedCompound.cid}`}
⋮----
if (onNavigateToLabTool)
onNavigateToLabTool('sop-04', 'calculators-sops');
⋮----
onNavigateToLabTool('sop-05', 'calculators-sops');
⋮----
href={`https://www.uniprot.org/uniprotkb/${selectedProtein.accession}`}
⋮----
setPendingImportJson(null);
setImportPreviewData(null);
````

## File: src/components/EnologyCalculators.tsx
````typescript
import React from 'react';
import { TestingGuide, type TestingGuideProps } from './TestingGuide.tsx';
⋮----
export const EnologyCalculators: React.FC<TestingGuideProps> = (props) =>
````

## File: src/components/FermentationTracker.tsx
````typescript
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity,
  Plus,
  Trash2,
  Thermometer,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Info,
  TrendingDown,
  Droplets,
  FileSpreadsheet,
  Printer,
  Sparkles,
  ShieldAlert,
  Zap,
  Compass,
  X,
  FlaskConical,
  Layers,
  Filter,
  FileText,
  Clock,
  Timer,
  Sliders,
  Gauge,
  Beaker,
  ClipboardCheck,
  BookOpen,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import type { FermentationLogEntry, TankId } from '../types/tracking.ts';
import type {
  ChemicalAddition,
  LabAnalysisRecord,
  StructuredCompoundType
} from '../types/database.ts';
import { BandedFermentationChartAndSO2Panel } from './BandedFermentationChartAndSO2Panel.tsx';
import { PhotoDiaryAndVintagePanel } from './PhotoDiaryAndVintagePanel.tsx';
import { exportDocxReport } from '../utils/exportDocxReport.ts';
import {
  calculateFermentationProgress,
  calculateAlcoholByVolume,
  brixToSpecificGravity,
  specificGravityToBrix,
  analyzeLogEntryHealth,
  compareRealLogsWithBenchmark,
  predictFermentationCompletion,
  sortFermentationLogs,
  calculateVelocity
} from '../utils/trackingCalculations.ts';
import { evaluateEnologicalScenario } from '../utils/enologyTroubleshooting.ts';
import { calculateDynamicSGTriggers, getTargetFreeSO2ByPH } from '../utils/enologyUtils.ts';
import { enologyDb } from '../db/enologyDatabase.ts';
import { useLocalStorageState } from '../utils/useLocalStorage.ts';
import { RASHA_PROTOCOL } from '../data/protocolData.ts';
import {
  useFlexibleProtocol,
  getEffectiveProtocolPlanForBatch
} from '../data/masterProtocolConfig.ts';
import { FlexibleProtocolCustomizerBar } from './FlexibleProtocolCustomizerBar.tsx';
import {
  getSmartAdditivePresets,
  getSmartDailyStagePresets,
  getSmartLabPresets
} from '../data/smartLoggingPresets.ts';
import { useEnologyUi } from '../context/EnologyUiContext.tsx';
import { getCurrentPersianDateTimeStr } from '../utils/persianDate.ts';
⋮----
interface FermentationTrackerProps {
  onNavigateToTestingGuide?: (
    testId?: string,
    subTab?: 'calculators-sops' | 'troubleshooting-crises' | 'saved-history'
  ) => void;
  onDataChanged?: () => void;
}
⋮----
type LogbookTab = 'daily-logs' | 'chemical-additions' | 'lab-analyses' | 'sensory-eval';
⋮----
interface DetectedTriggerInfo {
  id: string;
  title: string;
  description: string;
  warning?: string;
  hasChemicalDose: boolean;
  additionsToRecord: Array<{
    compoundName: string;
    compoundType?: StructuredCompoundType;
    amount: number;
    unit: 'g' | 'g/hL' | 'mg/L' | 'mL' | 'kg';
    stageTitle: string;
    purpose: string;
    pubchemCid?: number;
  }>;
}
⋮----
const toggleStatusRow = (row: 'diagnosis' | 'benchmark' | 'prediction') =>
⋮----
const isRowExpanded = (row: 'diagnosis' | 'benchmark' | 'prediction') =>
⋮----
// Organoleptic Sensory Evaluation Form State (Tab 4)
⋮----
const showToast = (msg: string) =>
⋮----
// Group and sort logs
⋮----
// Active logs for table display based on mode
⋮----
const detectTriggerWindow = (sgVal: number, currentTank: TankId): DetectedTriggerInfo | null =>
⋮----
const getRecommendation = () =>
⋮----
const getCurrentPersianDateStr = ()
⋮----
const handleOpenAddModal = () =>
⋮----
const inferStructuredCompoundType = (name: string, cid?: number): StructuredCompoundType =>
⋮----
const applyChemicalPreset = (presetId: string, targetTank: TankId) =>
⋮----
const applyDailyStagePreset = (presetId: string) =>
⋮----
const applyLabPreset = (presetId: string, targetTank: TankId) =>
⋮----
const handleOpenAddChemicalModal = () =>
⋮----
const handleOpenAddLabModal = () =>
⋮----
const handleBrixChange = (val: number) =>
⋮----
const handleSGChange = (val: number) =>
⋮----
const handleAddLog = (e: React.FormEvent) =>
⋮----
// If a dosing trigger matched and auto-record is checked, record the ChemicalAddition(s) in enologyDb
⋮----
const handleAddChemicalSubmit = (e: React.FormEvent) =>
⋮----
const handleUndoRecentAddition = () =>
⋮----
const triggerUndoableDelete = (record: {
    type: 'log' | 'addition' | 'lab';
    id: string;
    label: string;
}) =>
⋮----
const handleRestoreDeletedRecord = () =>
⋮----
const handleDeleteAddition = (id: string) =>
⋮----
const handleAddLabSubmit = (e: React.FormEvent) =>
⋮----
const handleDeleteLabAnalysis = (id: string) =>
⋮----
const handleDeleteLog = (id: string) =>
⋮----
const handleClearRealLogs = () =>
⋮----
const handleResetData = () =>
⋮----
const handleExportCSV = () =>
⋮----
const handleExportDocx = async () =>
⋮----
const computeEffectiveDays = (entries: FermentationLogEntry[]): number[] =>
⋮----
setTankId('tank-b');
setGlobalTankSelection('tank-b');
setSelectedLogId(null);
⋮----
setTankId('tank-rose');
setGlobalTankSelection('tank-rose');
⋮----
const getX = (day: number)
const getSGY = (sgVal: number)
⋮----
{/* Chart Legend Top Right */}
⋮----
{/* Dynamic Trigger Lines */}
⋮----
{/* Ideal Benchmark Curve */}
⋮----
const getTY = (tVal: number)
⋮----
const getPY = (phVal: number)
⋮----
const getSyncX = (day: number)
⋮----
{/* ===================================================================== */}
{/* ZONE C: 4-TAB UNIFIED TANK LOGBOOK («دفتر کل ثبت‌های مخزن و کارگاه»)  */}
{/* ===================================================================== */}
⋮----
e.stopPropagation();
handleDeleteLog(item.id);
⋮----
{/* ------------------------------------------------------------------- */}
{/* LOGBOOK TAB 2: CHEMICAL ADDITIONS LOGSHEET (لاگ‌شیت ۳)              */}
{/* ------------------------------------------------------------------- */}
⋮----
{/* Live Cumulative SO2 Ledger & OIV Ceiling Card */}
⋮----
{/* ------------------------------------------------------------------- */}
{/* LOGBOOK TAB 3: LAB ANALYSES RECORDS                                 */}
{/* ------------------------------------------------------------------- */}
⋮----
{/* ------------------------------------------------------------------- */}
{/* LOGBOOK TAB 4: ORGANOLEPTIC SENSORY EVALUATION (ارزیابی حسی ۵ محوره) */}
{/* ------------------------------------------------------------------- */}
⋮----
const toggleFault = (f: string) =>
⋮----
const handleSaveSensoryEvaluation = (e: React.FormEvent) =>
⋮----
onChange=
⋮----
{/* ===================================================================== */}
{/* MODAL 1: ADD DAILY LOG ENTRY (+ SMART TRIGGER DETECTOR)               */}
{/* ===================================================================== */}
⋮----
{/* SMART STAGE & TRIGGER AUTO-FILL SELECTOR */}
⋮----
⋮----
{/* SMART TRIGGER DETECTOR BANNER */}
⋮----
setAutoRecordTriggerAddition(e.target.checked);
setFormIsTrigger(e.target.checked);
⋮----
{/* ===================================================================== */}
{/* MODAL 2: ADD CHEMICAL ADDITION                                        */}
{/* ===================================================================== */}
⋮----
{/* SMART CHEMICAL & NUTRIENT CATALOG PRESET SELECTOR */}
⋮----
setChemAmount(parseFloat(e.target.value) || 0);
setPendingAdditionConfirm(false);
⋮----
{/* Pre-Commit Confirmation Box inside Modal (Idea 11) */}
⋮----
onClick=
````

## File: src/components/FlexibleProtocolCustomizerBar.tsx
````typescript
import React, { useState } from 'react';
import {
  Sliders,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Scale,
  FlaskConical,
  Thermometer,
  RefreshCw
} from 'lucide-react';
import {
  useFlexibleProtocol,
  FLEXIBLE_PARAM_METADATA,
  IDEAL_DEFAULT_PROTOCOL_PARAMS,
  type DynamicProtocolPlan,
  type FlexibleProtocolParams
} from '../data/masterProtocolConfig.ts';
⋮----
interface FlexibleProtocolCustomizerBarProps {
  onSyncToCalculators?: (plan: DynamicProtocolPlan) => void;
  defaultExpanded?: boolean;
  compact?: boolean;
}
⋮----
const handleSyncClick = () =>
⋮----
const parsed = parseFloat(e.target.value);
````

## File: src/components/Header.tsx
````typescript
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
  MoreHorizontal
} from 'lucide-react';
import { enologyDb } from '../db/enologyDatabase.ts';
import {
  useEnologyUi,
  type AppFiveTabView,
  type GlobalTankSelection
} from '../context/EnologyUiContext.tsx';
⋮----
export type MainPillarView = 'roadmap' | 'tracking' | 'testing-guide' | 'protocol';
⋮----
interface HeaderProps {
  activeView?: MainPillarView;
  onViewChange?: (view: MainPillarView) => void;
  activeFiveTab?: AppFiveTabView;
  onFiveTabChange?: (tab: AppFiveTabView) => void;
  cellarMode?: boolean;
  onToggleCellarMode?: () => void;
}
⋮----
const handleSelectTab = (tab: AppFiveTabView) =>
⋮----
const handleMouseDown = (e: MouseEvent) =>
const handleKeyDown = (e: KeyboardEvent) =>
⋮----
const handleStorageError = (evt: Event) =>
⋮----
const handleToggleCellar = () =>
⋮----
const handleOneTapBackup = async () =>
````

## File: src/components/InteractiveLabWizardsPanel.tsx
````typescript
import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FlaskConical,
  Pause,
  Play,
  RotateCcw,
  Save,
  Timer
} from 'lucide-react';
import type { LabAnalysisRecord, TankId } from '../types/index.ts';
import { enologyDb } from '../db/enologyDatabase.ts';
import {
  calculateFreeSO2Ripper,
  calculateMolecularSO2,
  calculateTitratableAcidity,
  correctHydrometer,
  getContinuousTargetFreeSO2ByPH
} from '../utils/enologyUtils.ts';
import { useEnologyUi } from '../context/EnologyUiContext.tsx';
import { getCurrentPersianDateTimeStr } from '../utils/persianDate.ts';
⋮----
export interface InteractiveLabWizardsPanelProps {
  onAnalysisSaved?: (record: LabAnalysisRecord) => void;
  selectedWizardOverride?: 'ripper_so2' | 'ph_meter' | 'ta_titration' | 'mlf_chromatography' | 'hydrometer_temp';
}
⋮----
type LabWizardId =
  | 'ripper_so2'
  | 'ph_meter'
  | 'ta_titration'
  | 'mlf_chromatography'
  | 'hydrometer_temp';
⋮----
function formatFaDate(): string
⋮----
const handleSelectWizard = (id: LabWizardId) =>
⋮----
const handleSaveRipperRecord = () =>
⋮----
const handleSavePhRecord = () =>
⋮----
const handleSaveTaRecord = () =>
⋮----
const handleSaveMalicRecord = () =>
⋮----
const handleSaveHydroRecord = () =>
⋮----
setRipperTimerRunning(false);
setRipperTimerSec(15);
⋮----
setHydroMeasuredSG(
⋮----
onClick=
````

## File: src/components/MasterProtocolView.tsx
````typescript
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
import { FlexibleProtocolCustomizerBar } from './FlexibleProtocolCustomizerBar.tsx';
import { useLocalStorageState } from '../utils/useLocalStorage.ts';
import { exportDocxReport } from '../utils/exportDocxReport.ts';
import { enologyDb } from '../db/enologyDatabase.ts';
import { BioscienceDatabaseView } from './BioscienceDatabaseView.tsx';
⋮----
export type Pillar4SubView = 'master-protocol' | 'bioscience-kb' | 'export-backup';
⋮----
interface MasterProtocolViewProps {
  onNavigateToTracking?: () => void;
  onNavigateToTestingGuide?: (
    testId?: string,
    subTab?: 'calculators-sops' | 'troubleshooting-crises' | 'saved-history'
  ) => void;
  onNavigateToCalculators?: (testId?: string) => void;
  initialPillarSubView?: Pillar4SubView;
}
⋮----
// Form 1 Initial Analysis Interactive States (Persisted in LocalStorage)
⋮----
const handleDownloadDocx = async () =>
⋮----
const handleOpenCalculatorTool = (testId?: string) =>
⋮----
onChange=
````

## File: src/components/PhotoDiaryAndVintagePanel.tsx
````typescript
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Bell,
  Calendar,
  Camera,
  CheckCircle2,
  Download,
  GitCompare,
  Plus,
  Smartphone,
  Star,
  Trash2,
  Wine
} from 'lucide-react';
import type { TankId } from '../types/index.ts';
import { enologyDb } from '../db/enologyDatabase.ts';
import {
  calculateAlcoholByVolume,
  sortFermentationLogs
} from '../utils/trackingCalculations.ts';
import { useLocalStorageState } from '../utils/useLocalStorage.ts';
import { useEnologyUi } from '../context/EnologyUiContext.tsx';
import { getCurrentPersianDateTimeStr } from '../utils/persianDate.ts';
⋮----
export interface PhotoDiaryAndVintagePanelProps {
  tankId?: TankId;
}
⋮----
export interface PhotoDiaryEntry {
  id: string;
  batchId: string;
  tankId: TankId;
  timestamp: string;
  dayNumber: number;
  category: 'hydrometer' | 'cap' | 'color' | 'sediment';
  dataUrlJpeg: string;
  sizeKb: number;
  quickTags: string[];
  note: string;
}
⋮----
export type TastingCheckpointKey =
  | 'day_10'
  | 'post_racking'
  | 'bottling'
  | 'month_3'
  | 'month_6'
  | 'month_12';
⋮----
export interface ScheduledTastingRecord {
  checkpoint: TastingCheckpointKey;
  appearance: number;
  aroma: number;
  palate: number;
  quickTags: string[];
  note: string;
  updatedAtFa: string;
}
⋮----
export interface HistoricalVintageEntry {
  id: string;
  titleFa: string;
  vintageYear: number;
  initialBrix: number;
  phRangeText: string;
  taGL: number;
  yanMgL: number;
  fermentationDays: number;
  finalAbvPct: number;
  totalAddedSo2MgL: number;
  avgTastingScore: string;
}
⋮----
function openPhotoIdb(): Promise<IDBDatabase | null>
⋮----
async function getAllPhotosFromIdb(): Promise<PhotoDiaryEntry[]>
⋮----
async function savePhotoToIdb(
  entry: PhotoDiaryEntry
): Promise<
⋮----
async function deletePhotoFromIdb(
  id: string
): Promise<
⋮----
export function compressImageToJpeg1280(
  file: File
): Promise<
⋮----
function formatIcsDateTimeLocal(baseDate: Date, addDays: number, hour: number): string
⋮----
const pad = (n: number)
⋮----
export function exportWorkshopCalendarICS(startDateIso: string): string
⋮----
const escapeIcs = (s: string)
⋮----
export const PhotoDiaryAndVintagePanel: React.FC<
  PhotoDiaryAndVintagePanelProps
> = (
⋮----
// Scheduled Tasting Checkpoints (Idea 15)
⋮----
const updateCurrentTasting = (patch: Partial<ScheduledTastingRecord>) =>
⋮----
const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) =>
⋮----
const handleDeletePhoto = async (id: string) =>
⋮----
const handleExportPhotosJson = () =>
⋮----
const handleDownloadIcs = () =>
⋮----
onChange=
````

## File: src/components/ProcessRoadmapTracker.tsx
````typescript
import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Circle,
  PlayCircle,
  PauseCircle,
  Clock,
  Timer,
  Sliders,
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  Sparkles,
  FlaskConical,
  Thermometer,
  RotateCcw,
  CheckSquare,
  ChevronDown,
  ChevronUp,
  Info,
  ShieldAlert,
  Flame,
  Layers,
  Wine,
  Database,
  Activity,
  Plus,
  Save,
  FileSpreadsheet,
  FileText,
  Trash2,
  Compass,
  MapPin,
  Calendar,
  Zap
} from 'lucide-react';
import { useLocalStorageState } from '../utils/useLocalStorage.ts';
import { enologyDb } from '../db/enologyDatabase.ts';
import { useFlexibleProtocol, type DynamicProtocolPlan } from '../data/masterProtocolConfig.ts';
import { useEnologyUi } from '../context/EnologyUiContext.tsx';
import { getCurrentPersianDateTimeStr } from '../utils/persianDate.ts';
import { normalizeEnologyNumericInput } from '../utils/enologyUtils.ts';
import { FlexibleProtocolCustomizerBar } from './FlexibleProtocolCustomizerBar.tsx';
import { RightNowActionCenter } from './RightNowActionCenter.tsx';
import { QuickTenSecondLogModal } from './QuickTenSecondLogModal.tsx';
import type { TankId, FermentationLogEntry } from '../types/tracking.ts';
import type { ChemicalAddition, LabAnalysisRecord } from '../types/database.ts';
⋮----
import { ZERO_TO_HUNDRED_STEPS, getStepLabTools, type ProcessStep, type StepLabToolLink } from "../data/roadmapStepsData.ts";
import { getSmartAdditivePresets } from '../data/smartLoggingPresets.ts';
⋮----
export interface ProcessRoadmapTrackerProps {
  onNavigateToTracking?: () => void;
  onNavigateToTestingGuide?: (
    testId?: string,
    subTab?: 'calculators-sops' | 'troubleshooting-crises' | 'saved-history'
  ) => void;
  onNavigateToCalculators?: (testId?: string) => void;
  onNavigateToLabTool?: (
    testId: string,
    subTab?: 'calculators-sops' | 'troubleshooting-crises' | 'saved-history'
  ) => void;
}
⋮----
function roundSum(a: number, b: number): number
⋮----
export interface WorkshopTimerConfig {
  id: string;
  stepIds: number[];
  title: string;
  mode: 'countdown' | 'stopwatch';
  defaultMinutes: number;
  flexibleWindow: string;
  stationNote: string;
  isCustom?: boolean;
}
⋮----
function playTimerCompletionChime()
⋮----
function formatSecondsMMSS(totalSeconds: number): string
⋮----
function parseTimeToMinutes(timeStr: string): number
⋮----
function formatMinutesToTime(totalMins: number): string
⋮----
export function getDynamicStepDoseSummary(stepId: number, plan: DynamicProtocolPlan): string | null
⋮----
// Multi-Mode Workshop Timers Execution State (Persisted across tab switches - BUG-103)
⋮----
const toggleTimerRun = (timerId: string) =>
⋮----
const resetTimer = (timerId: string) =>
⋮----
const adjustTimerMinutes = (timerId: string, deltaMins: number) =>
⋮----
const setTimerExactMinutes = (timerId: string, mins: number) =>
⋮----
const handleAddCustomTimer = (e: React.FormEvent) =>
⋮----
const handleDeleteCustomTimer = (id: string) =>
⋮----
const setCurrentTimeAsAnchor = () =>
⋮----
// In-step quick logging form states synced with global tank selection (BUG-74)
⋮----
const setQuickTank = (nextTank: TankId) =>
⋮----
// Chemical addition quick state
⋮----
const applyRoadmapChemPreset = (presetId: string, targetTank: TankId) =>
⋮----
const showToast = (msg: string) =>
⋮----
const toggleStepCompleted = (id: number) =>
⋮----
const handleSelectStep = (id: number) =>
⋮----
const handleOpenLabTool = (testId: string, subTab: 'calculators-sops' | 'troubleshooting-crises' = 'calculators-sops') =>
⋮----
const handleSaveStepDailyLog = (e: React.FormEvent) =>
⋮----
const handleSaveStepChemical = (e: React.FormEvent) =>
⋮----
onOpenQuickLogModal=
⋮----
onChange=
⋮----
onClick=
⋮----
{/* NEXT STEP PREVIEW BOX */}
⋮----
{/* FILTER & SEARCH BAR FOR ALL 46 STEPS */}
````

## File: src/components/QuickTenSecondLogModal.tsx
````typescript
import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Droplets,
  FlaskConical,
  Info,
  Minus,
  Plus,
  RotateCcw,
  Save,
  Sparkles,
  Thermometer,
  X
} from 'lucide-react';
import type {
  ChemicalAddition,
  FermentationLogEntry,
  LabAnalysisRecord,
  StructuredCompoundType,
  TankId
} from '../types/index.ts';
import { enologyDb } from '../db/enologyDatabase.ts';
import {
  calculateRefractometerCorrection,
  correctHydrometer,
  normalizeEnologyNumericInput
} from '../utils/enologyUtils.ts';
import {
  predictFermentationCompletion,
  sortFermentationLogs,
  specificGravityToBrix
} from '../utils/trackingCalculations.ts';
import { evaluateRightNowQueue } from '../utils/rightNowEngine.ts';
import { useLocalStorageState } from '../utils/useLocalStorage.ts';
import {
  getEffectiveProtocolPlanForBatch,
  useFlexibleProtocol
} from '../data/masterProtocolConfig.ts';
import { getCurrentPersianDateTimeStr } from '../utils/persianDate.ts';
import {
  resolveTargetTankIds,
  useEnologyUi,
  type GlobalTankSelection
} from '../context/EnologyUiContext.tsx';
⋮----
export type QuickSheetPresetMode = 'measurement' | 'addition' | 'lab';
⋮----
export interface QuickTenSecondLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTankId?: TankId;
  initialMode?: QuickSheetPresetMode;
  onLogSaved?: (savedEntry: FermentationLogEntry) => void;
  inlineMode?: boolean;
}
⋮----
interface PostSaveSummary {
  mode: QuickSheetPresetMode;
  savedEntry?: FermentationLogEntry;
  createdLogIds: string[];
  createdAdditionIds: string[];
  createdLabIds: string[];
  previousSG: number;
  sgDrop: number;
  drynessRangeDays: { min: number; max: number };
  primaryActionTitleFa: string | null;
  primaryActionDoseFa: string | null;
  primaryActionStateBadgeFa: string | null;
  learningFeedbackFa: string;
  expiresAtMs: number;
  remainingUndoSec: number;
}
⋮----
// Explicit Provenance Tracking Flags (Audit Section 2 & 5.3)
⋮----
// Addition Mode States (Safe empty-default for rawAdditionAmount)
⋮----
// Lab Mode States (Safe empty-default for rawLabValue)
⋮----
// 10-second Undo countdown timer
⋮----
const loadLatestTankDefaults = (targetTank: TankId) =>
⋮----
const handleKeyDown = (e: KeyboardEvent) =>
⋮----
const handleSelectTank = (nextSelection: GlobalTankSelection) =>
⋮----
const getReferenceVolumeForTank = (
    tId: TankId,
    compType: StructuredCompoundType = selectedCompoundType
): number =>
⋮----
const toggleQuickTag = (tag: string) =>
⋮----
const adjustPh = (delta: number) =>
⋮----
const getFormattedNowDate = (nowMs: number): string
⋮----
const handleSaveMeasurement = (e: React.FormEvent) =>
⋮----
const handleSaveAddition = (e: React.FormEvent) =>
⋮----
const handleSaveLabAnalysis = (e: React.FormEvent) =>
⋮----
const handleUndoSavedRecord = () =>
⋮----
loadLatestTankDefaults(tankId);
setPostSaveSummary(null);
⋮----
setPhInput(e.target.value);
setHasExplicitPhInput(
                                e.target.value.trim().length > 0
                              );
⋮----
setTaInput(e.target.value);
setHasExplicitTaInput(
                              e.target.value.trim().length > 0
                            );
⋮----
setFreeSo2Input(e.target.value);
setHasExplicitSo2Input(e.target.value.trim().length > 0);
⋮----
setOpenPhTaSection(true);
setHasExplicitPhInput(true);
⋮----
{/* Safe Empty Input + Gray Placeholder + Explicit Chip */}
⋮----
onChange=
⋮----
{/* MODE 3: LAB ('ثبت سریع آزمایش') */}
````

## File: src/components/RightNowActionCenter.tsx
````typescript
import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Eye,
  FlaskConical,
  Lock,
  PlusCircle,
  RotateCcw,
  Scale,
  ShieldAlert,
  Sparkles,
  Trash2,
  Unlock,
  XCircle
} from 'lucide-react';
import type {
  ChemicalAddition,
  StructuredCompoundType,
  TankId
} from '../types/index.ts';
import { enologyDb } from '../db/enologyDatabase.ts';
import { useFlexibleProtocol } from '../data/masterProtocolConfig.ts';
import {
  calculateStockSolutionPlan,
  type ScalePrecisionGrams,
  type StockCompoundCategory
} from '../utils/enologyUtils.ts';
import { sortFermentationLogs } from '../utils/trackingCalculations.ts';
import {
  evaluateBottlingReadinessGate,
  evaluateDeadlineCountdowns,
  evaluateRightNowQueue,
  type RightNowMilestone
} from '../utils/rightNowEngine.ts';
import { useLocalStorageState as useLocalStorage } from '../utils/useLocalStorage.ts';
import {
  GlossaryTerm,
  useEnologyUi,
  type GlobalTankSelection
} from '../context/EnologyUiContext.tsx';
import { BatchOnboardingWizardModal } from './BatchOnboardingWizardModal.tsx';
⋮----
export interface RightNowActionCenterProps {
  activeTankId?: TankId;
  onTankChange?: (tankId: TankId) => void;
  onDataChanged?: () => void;
  onOpenQuickLogModal?: () => void;
  compact?: boolean;
}
⋮----
interface PendingConfirmSession {
  milestone: RightNowMilestone;
  targetTankIds: TankId[];
  additions: Array<Omit<ChemicalAddition, 'id'>>;
  calculatedAmounts: number[];
  explicitAdditionConfirmed: boolean;
  overrideOverBudgetConfirmed: boolean;
}
⋮----
interface UndoSession {
  milestoneTitleFa: string;
  createdAdditionIds: string[];
  addedStepIds: number[];
  expiresAtMs: number;
  remainingSec: number;
}
⋮----
function mapCompoundToStockCategory(
  compoundType?: StructuredCompoundType
): StockCompoundCategory
⋮----
// Sync externalTankId prop if provided
⋮----
const handleGlobalTankChange = (selection: GlobalTankSelection) =>
⋮----
const handleTriggerQuickLog = () =>
⋮----
const handleStartRealBatch = () =>
⋮----
const openConfirmSheet = (
    milestone: RightNowMilestone,
    targetTankIds: TankId[]
) =>
⋮----
const handleCommitAdditions = () =>
⋮----
const handleUndoLastCommit = () =>
⋮----
const handleSnooze2Hours = (milestoneId: string) =>
⋮----
const handleConfirmSkip = (milestoneId: string) =>
⋮----
onChange=
⋮----
{/* 2. Target Batch & explicit Tank destination */}
⋮----
{/* 3. Calculated Dose vs Editable Actual Added Amount */}
⋮----
{/* 4. Reference volume & basis */}
⋮----
{/* 5. Explicit confirmation checkbox/toggle */}
⋮----
setConfirmSession(
⋮----
{/* Actionable Overdue Items (state === 'missed') */}
⋮----
onClick=
⋮----
{/* Next Up (Pending Milestones) */}
⋮----
{/* Separate Gray Card for Closed Windows (state === 'closed', non-executable) */}
⋮----
{/* 7. Conditional Closing-Window Deadline Countdowns Strip (Section 3A.4) */}
⋮----
{/* 8. Latest Measurements Strip with Trend Arrows & Quick Lab Deep-Link (Section 3A.4) */}
⋮----
{/* SG Pill with Trend Arrow */}
⋮----
{/* Cap Temp Pill with Trend Arrow */}
⋮----
{/* pH Pill with Trend Arrow */}
⋮----
{/* 9. Compact Bottling Readiness Safety Gate Card (Idea 10 & Items 1.1, 1.2, 1.3) */}
⋮----
{/* Structured Override Warning Box when executionMode === 'override_with_risk' (Audit Item 1.3) */}
⋮----
{/* 4 Blocking Items */}
⋮----
setBottlingConfirmations(
⋮----
onBatchCreated=
````

## File: src/components/TestingGuide.tsx
````typescript
import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  FlaskConical,
  Calculator,
  Thermometer,
  Scale,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Layers,
  ChevronDown,
  ChevronUp,
  FileCheck,
  Flame,
  Gauge,
  ArrowRight,
  Database,
  Save,
  Trash2,
  ExternalLink,
  History,
  Wrench,
  Activity,
  ShieldAlert
} from 'lucide-react';
import { enologyDb } from '../db/enologyDatabase.ts';
import type { SavedCalculation } from '../types/database.ts';
import { useLocalStorageState } from '../utils/useLocalStorage.ts';
import { evaluateEnologicalScenario } from '../utils/enologyTroubleshooting.ts';
import { RASHA_PROTOCOL } from '../data/protocolData.ts';
import {
  useFlexibleProtocol,
  computeDynamicProtocolPlan,
  type DynamicProtocolPlan
} from '../data/masterProtocolConfig.ts';
import { FlexibleProtocolCustomizerBar } from './FlexibleProtocolCustomizerBar.tsx';
import { InteractiveLabWizardsPanel } from './InteractiveLabWizardsPanel.tsx';
import { useEnologyUi } from '../context/EnologyUiContext.tsx';
import {
  calculateTitratableAcidity,
  calculateTartaricAddition,
  calculateKHCO3Deacidification,
  calculateDeacidificationOptions,
  calculateFreeSO2Ripper,
  calculateMolecularSO2,
  correctHydrometer,
  calculateKMS,
  calculateRefractometerCorrection,
  calculateSNAAmounts,
  calculateBenchFiningGrams,
  calculateCoolingDryIceKg,
  getEffectiveLiquidVolume,
  isAlreadyLiquidVolume,
  getTargetFreeSO2ByPH,
  calculateDynamicSGTriggers,
  calculateH2O2SulfiteRemoval,
  estimateAcidOrBaseFromPHShift,
  calculateStagedH2O2Plan
} from '../utils/enologyUtils.ts';
⋮----
export type LabHubSubTab = 'calculators-sops' | 'troubleshooting-crises' | 'saved-history';
⋮----
export interface TestingGuideProps {
  onNavigateToTracking?: () => void;
  initialSelectedTest?: string;
  initialActiveSubTab?: LabHubSubTab;
}
⋮----
function mapTestIdToSopFilter(testId?: string): string
⋮----
const returnFromLabDeepLink = () =>
⋮----
const showToast = (msg: string) =>
⋮----
const reloadSavedCalcs = () =>
⋮----
const handleDeleteSavedCalc = (id: string) =>
⋮----
const toggleExpand = (id: string) =>
⋮----
const toggleAllSops = (open: boolean) =>
⋮----
const handleSaveHydro = () =>
⋮----
const handleSaveRefract = () =>
⋮----
const handleSaveTA = () =>
⋮----
const handleSavePH = () =>
⋮----
const handleSaveKMS = () =>
⋮----
const handleSaveYAN = () =>
⋮----
const handleSaveCooling = () =>
⋮----
const handleSaveDryness = () =>
⋮----
const handleSaveFining = () =>
⋮----
const handleSaveBatchScaling = () =>
⋮----
const handleSyncPlanToCalculators = (plan: DynamicProtocolPlan) =>
⋮----
const renderDoubleDiscountGuard = (
    volumeL: number,
    isChecked: boolean,
    onUncheck: () => void,
    onSetMashVolume: (mashL: number) => void
) =>
⋮----
const handleSaveTroubleshooting = () =>
⋮----
setSelectedWizardOverride('ripper_so2');
setSelectedFilter('sop-04');
setExpandedTests((prev) => (
⋮----
setSelectedWizardOverride('ta_titration');
setSelectedFilter('sop-02');
⋮----
setSelectedWizardOverride('hydrometer_temp');
setSelectedFilter('sop-07');
⋮----
setSelectedWizardOverride('mlf_chromatography');
setSelectedFilter('sop-03');
⋮----
onChange=
⋮----
{/* ----------------------------------------------------------------- */}
{/* TOOL 2 (SOP-02): Titratable Acidity (TA) & Tartaric Addition      */}
{/* ----------------------------------------------------------------- */}
⋮----
اسید تارتاریک مورد نیاز (
⋮----
{/* BOTTOM HALF: Collapsible SOP */}
⋮----
{/* ----------------------------------------------------------------- */}
{/* TOOL 5 (SOP-05): YAN Budget & 3-Stage SNA Calculator              */}
{/* ----------------------------------------------------------------- */}
⋮----
onClick=
⋮----
{/* TOP HALF: Interactive Calculator */}
⋮----
{/* Protocol v2: Dynamic SG0 Trigger Calculator & Reference Table */}
⋮----
{/* BOTTOM HALF: Collapsible SOP */}
⋮----
{/* ----------------------------------------------------------------- */}
{/* TOOL 6 (SOP-06): Cap Temperature & Thermal Cooling Calculator     */}
{/* ----------------------------------------------------------------- */}
⋮----
{/* TOP HALF: Interactive Calculator */}
⋮----
{/* BOTTOM HALF: Collapsible SOP */}
⋮----
{/* ----------------------------------------------------------------- */}
{/* TOOL 7 (SOP-07): Dryness & Residual Sugar Verification            */}
{/* ----------------------------------------------------------------- */}
⋮----
{/* TOP HALF: Interactive Dryness Evaluator */}
⋮----
{/* BOTTOM HALF: Collapsible SOP */}
⋮----
{/* ----------------------------------------------------------------- */}
{/* TOOL 8 (SOP-08): Bench Fining (Bentonite) & Copper Sulfate Stock  */}
{/* ----------------------------------------------------------------- */}
⋮----
{/* TOP HALF: Interactive Calculator */}
⋮----
{/* Left: Bentonite Scaling */}
⋮----
{/* Right: Copper Sulfate Stock #2 Scaling */}
⋮----
{/* Protocol v2: Day 85/86 Bench Trials for Heavy Press Blending (0%, 3%, 5%) & 10% Glycerin Stock Solution */}
⋮----
{/* BOTTOM HALF: Collapsible SOP */}
⋮----
{/* ----------------------------------------------------------------- */}
{/* TOOL 9 (SOP-09): Batch Mass & Volume Scaling Calculator (400kg)   */}
{/* ----------------------------------------------------------------- */}
⋮----
{/* TOP HALF: Interactive Scaling Calculator */}
⋮----
{/* Protocol v2: Realistic Post-Pressing Volume Cascade & Per-Liter / Per-20L-Carboy Dosing Calculator */}
⋮----
{/* BOTTOM HALF: Collapsible Reference Balance Table */}
⋮----
{/* ===================================================================== */}
{/* SUB-TAB 2: INTERACTIVE SCENARIO EVALUATOR & 5 EMERGENCY CRISIS SOPS   */}
{/* ===================================================================== */}
⋮----
{/* Interactive Scenario & Troubleshooting Evaluator */}
⋮----
{/* Symptom-Based Troubleshooting Chips (عیب‌یابی علامت‌محور) */}
⋮----
{/* Live Scenario Inputs */}
⋮----
{/* Diagnostic Output Results */}
⋮----
{/* Informational Alerts (Zero Health Score Penalty — Idea 14) */}
⋮----
{/* Layer 1 Action & Layer 2 Why (Idea 13) */}
⋮----
{/* Layer 3 Expandable Science & Formula Details (Idea 13) */}
⋮----
{/* 5 Master Protocol Crisis Management SOPs */}
⋮----
{/* 5 Standard Stock Solutions Reference */}
⋮----
{/* ===================================================================== */}
{/* SUB-TAB 3: SAVED CALCULATIONS HISTORY IN DATABASE                     */}
{/* ===================================================================== */}
````

## File: src/context/EnologyUiContext.tsx
````typescript
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import type { TankId, WineBatch } from '../types/index.ts';
import { enologyDb } from '../db/enologyDatabase.ts';
⋮----
export type GlobalTankSelection = 'tank-a' | 'tank-b' | 'tank-rose' | 'both-red';
⋮----
export type AppFiveTabView = 'today' | 'tanks' | 'lab' | 'roadmap' | 'more';
⋮----
export interface LabDeepLinkRequest {
  testId: string;
  subTab?: 'calculators-sops' | 'troubleshooting-crises' | 'saved-history';
  prefillTankId?: TankId;
  prefillSG?: number;
  prefillPH?: number;
  prefillSO2?: number;
  prefillTA?: number;
  prefillTempC?: number;
  prefillVolumeL?: number;
  returnToTab?: AppFiveTabView;
  timestampMs?: number;
}
⋮----
export interface EnologyGlossaryItem {
  key: string;
  termFa: string;
  termEn: string;
  shortTooltipFa: string;
  formulaOrRangeFa?: string;
  whyItMattersFa: string;
}
⋮----
export function getGlossaryItem(key: string): EnologyGlossaryItem | undefined
⋮----
export function resolveEffectiveTankSelection(
  selection: GlobalTankSelection,
  tankCount: 1 | 2 = 2
): GlobalTankSelection
⋮----
export function resolvePrimaryTankId(
  selection: GlobalTankSelection,
  tankCount: 1 | 2 = 2
): TankId
⋮----
export function resolveTargetTankIds(
  selection: GlobalTankSelection,
  tankCount: 1 | 2 = 2
): TankId[]
⋮----
export interface TankSelectionOption {
  id: GlobalTankSelection;
  labelFa: string;
  shortLabelFa: string;
  isCombinedRed?: boolean;
}
⋮----
export function getAvailableTankSelections(
  tankCount: 1 | 2 = 2,
  targetStyle: WineBatch['targetStyle'] = 'red'
): TankSelectionOption[]
⋮----
export function getTankSelectionLabelFa(
  selection: GlobalTankSelection,
  tankCount: 1 | 2 = 2
): string
⋮----
export type FontScaleMode = 'normal' | 'large' | 'xlarge';
export type ScalePrecisionGrams = 1 | 0.1 | 0.01;
⋮----
export interface EnologyUiContextValue {
  batches: WineBatch[];
  activeBatchId: string;
  activeBatch: WineBatch | undefined;
  setActiveBatchId: (batchId: string) => void;
  tankCount: 1 | 2;
  hasDemoData: boolean;
  selectedTank: GlobalTankSelection;
  setSelectedTank: (selection: GlobalTankSelection) => void;
  globalTankSelection: GlobalTankSelection;
  setGlobalTankSelection: (selection: GlobalTankSelection) => void;
  primaryTankId: TankId;
  effectiveSingleTankId: TankId;
  targetTankIds: TankId[];
  isBothRedSelected: boolean;
  availableTankOptions: TankSelectionOption[];
  selectedTankLabelFa: string;
  activeFiveTab: AppFiveTabView;
  setActiveFiveTab: (tab: AppFiveTabView) => void;
  activeTab: AppFiveTabView;
  setActiveTab: (tab: AppFiveTabView) => void;
  fontScale: FontScaleMode;
  setFontScale: (scale: FontScaleMode) => void;
  scalePrecision: ScalePrecisionGrams;
  setScalePrecision: (precision: ScalePrecisionGrams) => void;
  labDeepLink: LabDeepLinkRequest | null;
  navigateToLabTest: (
    request: string | LabDeepLinkRequest,
    options?: Partial<LabDeepLinkRequest>
  ) => void;
  clearLabDeepLink: () => void;
  roadmapHighlightStepNumber: number | null;
  navigateToRoadmapStep: (stepNumber: number) => void;
  clearRoadmapHighlightStep: () => void;
  isQuickLogOpen: boolean;
  quickLogTankOverride: GlobalTankSelection | null;
  openQuickLog: (tankOverride?: GlobalTankSelection) => void;
  closeQuickLog: () => void;
  isOnboardingOpen: boolean;
  openOnboardingWizard: () => void;
  closeOnboardingWizard: () => void;
  activeGlossaryKey: string | null;
  activeGlossaryItem: EnologyGlossaryItem | null;
  openGlossaryTerm: (key: string) => void;
  closeGlossaryTerm: () => void;
  dataVersion: number;
  notifyDataChanged: () => void;
}
⋮----
function readStorageString<T extends string>(key: string, fallback: T): T
⋮----
function writeStorageString(key: string, value: string): void
⋮----
export const EnologyUiProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) =>
⋮----
const handleSync = (e: Event) =>
⋮----
export function useEnologyUi(): EnologyUiContextValue
⋮----
export interface GlossaryTermProps {
  termKey: string;
  labelOverride?: string;
  className?: string;
}
⋮----
export const GlossaryTerm: React.FC<GlossaryTermProps> = ({
  termKey,
  labelOverride,
  className = ''
}) =>
⋮----
e.stopPropagation();
openGlossaryTerm(item.key);
````

## File: src/data/bioscienceData.ts
````typescript
import type { PubChemCompoundData, UniProtProteinData } from '../types/database.ts';
⋮----
export async function fetchPubChemCompoundLive(cidOrName: string | number): Promise<Partial<PubChemCompoundData> | null>
````

## File: src/data/masterProtocolConfig.ts
````typescript
import { useState, useEffect, useCallback, useMemo } from 'react';
import type { ProtocolMaterial, VolumeBalance } from './protocolData.ts';
⋮----
export interface TemperatureThresholdConfig {
  optimalMin: number;
  optimalMax: number;
  caution?: number;
  warningCeiling: number;
  crisisDanger: number;
}
⋮----
export interface MasterProtocolConfig {
  metadata: {
    code: string;
    vintageYear: number;
    grapeWeightKg: number;
    targetInitialBrix: number;
    targetInitialSG: number;
    redFinalSG: number;
    roseFinalSG: number;
  };
  volumes: {
    totalCrushedMashL: number;
    crushedMashPerTankL: number;
    initialLiquidL: number;
    initialLiquidPerTankL: number;
    saigneeRoseRawL: number;
    saigneePerTankL: number;
    roseClarifiedFermentL: number;
    rosePostRackingL: number;
    roseFinalBottlingL: number;
    redMashAfterSaigneePerTankL: number;
    redLiquidFermentPerTankL: number;
    redLiquidFermentTotalL: number;
    redMashToLiquidYieldFactor: number;
    postPressFreeRunConservativePerTankL: number;
    postPressFreeRunRangePerTankL: { min: number; max: number };
    postPressRack1PerTankL: number;
    postPressRack2PerTankL: number;
    postPressColdStabPerTankL: number;
    postPressHeavyPressTotalL: number;
    postPressHeavyPressPerTankL: number;
  };
  temperatures: {
    redActiveMaceration: TemperatureThresholdConfig;
    roseActiveFermentation: TemperatureThresholdConfig;
    postPressingLiquidFinishing: {
      optimalMin: number;
      optimalMax: number;
      coldRiskBelow: number;
      warmWarningAbove: number;
    };
    finishedWineAging: {
      optimalMin: number;
      optimalMax: number;
      warningAbove: number;
      dangerAbove: number;
    };
  };
  stoichiometry: {
    kmsActiveSO2Fraction: number;
    h2o2_3PercentMlPerMgSO2: number;
    khco3GramsPerGL_TA: number;
    khco3WithColdStabGramsPerGL_TA: number;
    k2co3GramsPerGL_TA: number;
    caco3GramsPerGL_TA: number;
    totalSO2LegalCeilingMgL: number;
    yeastEndogenousSO2MgL: number;
    sgTriggerTolerance: number;
    dapNitrogenMgPerG: number;
    fermaidKNitrogenMgPerG: number;
    fermaidOChemicalNitrogenMgPerG: number;
    fermaidOBioEquivalentNitrogenMgPerG: number;
    zincSulfateHeptahydrateSafeRateGPerL: number;
    yanTargetMultiplierMedium: number;
    yanScaleBaselineMgL: number;
  };
}
⋮----
export type FlexibleProtocolPresetId = 'conservative_ideal' | 'classic_v32' | 'custom';
⋮----
export interface FlexibleProtocolParams {
  presetId: FlexibleProtocolPresetId;
  grapeWeightKg: number;
  initialBrix: number;
  initialSG: number;
  naturalMustYANMgL: number;
  targetRedPH: number;
  targetRosePH: number;
  mashYieldPer400KgL: number;
  initialLiquidPer400KgL: number;
  saigneeTotalL: number;
  roseClarifiedFermentL: number;
  rosePostRackingL: number;
  roseFinalBottlingL: number;
  redMashLiquidYieldFactor: number;
  postPressFreeRunPerTankL: number;
  postPressRack1PerTankL: number;
  postPressRack2PerTankL: number;
  postPressFinalPerTankL: number;
  heavyPressTotalL: number;
  crushSO2TargetMgL: number;
  postSaigneeRedSO2TargetMgL: number;
  pecticEnzymeRedRateGL: number;
  pecticEnzymeRoseRateGL: number;
  yeastRateGL: number;
  goFermMultiplier: number;
  fermaidO1RedRateGL: number;
  fermaidO1RoseRateGL: number;
  fermaidK2RedRateGL: number;
  fermaidK2RoseRateGL: number;
  dap2RedRateGL: number;
  dap2RoseRateGL: number;
  zincSafeRateGL: number;
  fermaidO3RedRateGL: number;
  fermaidO3RoseRateGL: number;
  bactilessRedRateGL: number;
  bactilessRoseRateGL: number;
  day11KmsRateGL: number;
  redMaxGlycerinGL: number;
  roseMaxGlycerinGL: number;
  ascorbicRateGL: number;
  pressingTargetSG: number;
  redCapWarningTempC: number;
  redCapDangerTempC: number;
}
⋮----
export interface FlexibleParamMetaItem {
  key: Exclude<keyof FlexibleProtocolParams, 'presetId'>;
  labelFa: string;
  unit: string;
  idealValue: number;
  classicValue: number;
  min: number;
  max: number;
  step: number;
  category: 'harvest' | 'volumes' | 'dosages' | 'thresholds';
  noteFa: string;
}
⋮----
export interface DynamicProtocolPlan {
  params: FlexibleProtocolParams;
  scaleFactor: number;
  volumes: {
    totalCrushedMashL: number;
    crushedMashPerTankL: number;
    initialLiquidL: number;
    initialLiquidPerTankL: number;
    saigneeTotalL: number;
    saigneePerTankL: number;
    roseClarifiedFermentL: number;
    rosePostRackingL: number;
    roseFinalBottlingL: number;
    roseBottles750ml: number;
    redMashAfterSaigneePerTankL: number;
    redLiquidFermentPerTankL: number;
    redLiquidFermentTotalL: number;
    freeRunPerTankL: number;
    freeRunTotalL: number;
    rack1PerTankL: number;
    rack1TotalL: number;
    rack2PerTankL: number;
    rack2TotalL: number;
    finalRedPerTankL: number;
    finalRedTotalL: number;
    redBottles750ml: number;
    heavyPressTotalL: number;
    heavyPressPerTankL: number;
    totalBottles750ml: number;
  };
  triggers: {
    initialSG: number;
    sna1: number;
    sna2: number;
    oneThirdCeiling: number;
    phase2Tannin: number;
    sna3: number;
    pressingSG: number;
    drynessSG: number;
  };
  dosages: {
    crushKmsPerTankG: number;
    postSaigneeKmsPerTankG: number;
    day11KmsPerTankG: number;
    preBottlingKmsPerTankG: number;
    rosePostFermKmsG: number;
    rosePreBottlingKmsG: number;
    heavyPressKmsG: number;
    totalWineKmsG: number;
    pecticEnzymeRedPerTankG: number;
    pecticEnzymeRoseG: number;
    pecticEnzymeTotalG: number;
    whiteTanninRedPhase1PerTankG: number;
    whiteTanninRoseFermentG: number;
    whiteTanninRoseFinishingG: number;
    whiteTanninTotalG: number;
    redTanninPhase1PerTankG: number;
    redTanninPhase2PerTankG: number;
    redTanninFinishingPerTankG: number;
    redTanninTotalG: number;
    yeastRedPerTankG: number;
    yeastRoseG: number;
    yeastTotalG: number;
    goFermRedPerTankG: number;
    goFermRoseG: number;
    goFermTotalG: number;
    fermaidO1RedPerTankG: number;
    fermaidO1RoseG: number;
    fermaidO3RedPerTankG: number;
    fermaidO3RoseG: number;
    fermaidOTotalG: number;
    fermaidK2RedPerTankG: number;
    fermaidK2RoseG: number;
    fermaidKTotalG: number;
    dap2RedPerTankG: number;
    dap2RoseG: number;
    dapTotalG: number;
    zincRedPerTankG: number;
    zincRoseG: number;
    zincTotalG: number;
    bentoniteRoseG: number;
    bactilessRedPerTankG: number;
    bactilessRoseG: number;
    bactilessHeavyPressG: number;
    bactilessTotalG: number;
    khtColdStabRedPerTankG: number;
    khtColdStabRoseG: number;
    khtColdStabHeavyPressG: number;
    khtTotalG: number;
    glycerinRedMaxPerTankG: number;
    glycerinRoseMaxG: number;
    glycerinTotalMaxG: number;
    ascorbicRedPerTankG: number;
    ascorbicRoseG: number;
    ascorbicTotalG: number;
  };
  nitrogen: {
    sugarGPerL: number;
    targetYANMgL: number;
    neededYANMgL: number;
    suppliedChemicalYANRedMgL: number;
    suppliedBioEquivalentYANRedMgL: number;
    baseBioEquivalentYANMgL: number;
    unmetBioEquivalentYANMgL: number;
    yanAccountingBasisFa: string;
  };
  dynamicMaterials: ProtocolMaterial[];
  dynamicVolumeBalances: VolumeBalance[];
}
⋮----
function round1(val: number): number
⋮----
function round2(val: number): number
⋮----
function round3(val: number): number
⋮----
export function computeDynamicProtocolPlan(
  overrides?: Partial<FlexibleProtocolParams>
): DynamicProtocolPlan
⋮----
function loadStoredFlexibleParams(): FlexibleProtocolParams
⋮----
export function getCurrentDynamicProtocolPlan(): DynamicProtocolPlan
⋮----
function sanitizeProtocolParamsSnapshot(
  snapshot?: Record<string, number | string> | null
): Partial<FlexibleProtocolParams> | null
⋮----
export function getEffectiveProtocolPlanForBatch(
  batch?: { protocolParamsSnapshot?: Record<string, number | string> } | null,
  explicitPlan?: DynamicProtocolPlan,
  preferExplicit: boolean = false
): DynamicProtocolPlan
⋮----
export type FlexibleProtocolSyncListener = (params: FlexibleProtocolParams) => void;
⋮----
export function onFlexibleProtocolSync(listener: FlexibleProtocolSyncListener): () => void
⋮----
export function notifyFlexibleProtocolSync(next: FlexibleProtocolParams): void
⋮----
export function useFlexibleProtocol()
⋮----
const handleSync = (e: Event) =>
````

## File: src/data/protocolData.ts
````typescript
export interface ProtocolMaterial {
  row: string;
  name: string;
  totalAmount: string;
  doseRate: string;
  tankA: string;
  tankB: string;
  roseShare: string;
  purpose: string;
}
⋮----
export interface VolumeBalance {
  stage: string;
  volume: string;
  description: string;
}
⋮----
export interface HydrometerCorrection {
  temp: string;
  deltaSG: string;
  example: string;
}
⋮----
export interface CrisisProtocol {
  id: string;
  title: string;
  danger: string;
  action: string;
}
⋮----
export interface Form1Item {
  step: string;
  time: string;
  operation: string;
  temp: string;
  tankA: string;
  tankB: string;
}
⋮----
export interface Form2Item {
  phase: string;
  tempRoom: string;
  tempCap: string;
  tempAllowed: string;
  sg: string;
  pigeage: string;
  specialOp: string;
  sensory: string;
}
⋮----
export interface Form3Item {
  stage: string;
  op: string;
  targetTemp: string;
  status: string;
}
⋮----
export interface GlossaryItem {
  term: string;
  enTerm: string;
  def: string;
}
⋮----
export interface EquipmentItem {
  category: string;
  items: string[];
}
⋮----
export interface StockSolutionItem {
  num: string;
  title: string;
  concentration: string;
  formula: string;
  usage: string;
}
⋮----
export interface StationDetail {
  id: number;
  title: string;
  subtitle: string;
  sections: {
    heading: string;
    paragraphs: string[];
  }[];
}
````

## File: src/data/roadmapStepsData.ts
````typescript
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
⋮----
export interface StepLabToolLink {
  testId: string;
  label: string;
  shortLabel: string;
}
⋮----
export function getStepLabTools(stepId: number): StepLabToolLink[]
````

## File: src/data/seedTrackingData.ts
````typescript
import type { FermentationLogEntry } from '../types/tracking.ts';
````

## File: src/data/smartLoggingPresets.ts
````typescript
import type { DynamicProtocolPlan } from './masterProtocolConfig.ts';
import type { TankId } from '../types/tracking.ts';
import type { LabAnalysisRecord } from '../types/database.ts';
import { specificGravityToBrix } from '../utils/trackingCalculations.ts';
⋮----
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
⋮----
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
⋮----
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
⋮----
export function getSmartAdditivePresets(
  plan: DynamicProtocolPlan,
  tankId: TankId
): AdditivePresetItem[]
⋮----
export function getSmartDailyStagePresets(
  plan: DynamicProtocolPlan,
  tankId: TankId
): DailyStagePresetItem[]
⋮----
export function getSmartLabPresets(
  plan: DynamicProtocolPlan,
  tankId: TankId
): LabAnalysisPresetItem[]
````

## File: src/db/enologyDatabase.test.ts
````typescript
import test from 'node:test';
import assert from 'node:assert/strict';
import { enologyDb } from './enologyDatabase.ts';
import { FermentationLogEntrySchema } from '../types/database.ts';
import { PRELOADED_ENOLOGY_COMPOUNDS, PRELOADED_ENOLOGY_PROTEINS } from '../data/bioscienceData.ts';
import {
  IDEAL_DEFAULT_PROTOCOL_PARAMS,
  getEffectiveProtocolPlanForBatch,
  notifyFlexibleProtocolSync
} from '../data/masterProtocolConfig.ts';
import { getSmartAdditivePresets } from '../data/smartLoggingPresets.ts';
⋮----
// 1. Test updateBatchProtocolSnapshot
````

## File: src/db/enologyDatabase.ts
````typescript
import { z } from 'zod';
import {
  type WineBatch,
  type ChemicalAddition,
  type LabAnalysisRecord,
  type SavedCalculation,
  type EnologyDatabaseExport,
  type FermentationLogEntry,
  type TankId,
  WineBatchSchema,
  FermentationLogEntrySchema,
  ChemicalAdditionSchema,
  LabAnalysisRecordSchema,
  SavedCalculationSchema,
  EnologyDatabaseExportSchema
} from '../types/index.ts';
import { INITIAL_TRACKING_DATA } from '../data/seedTrackingData.ts';
import {
  MASTER_PROTOCOL_CONFIG,
  onFlexibleProtocolSync,
  type FlexibleProtocolParams
} from '../data/masterProtocolConfig.ts';
⋮----
export interface CumulativeSO2Ledger {
  tankId: TankId;
  batchId?: string;
  addedFromKmsMgL: number;
  totalKmsMassGrams: number;
  finalVolumeEquivalentMgL: number;
  skippedInvalidUnitCount: number;
  endogenousYeastMgL: number;
  estimatedTotalSO2MgL: number;
  legalCeilingMgL: number;
  remainingBudgetMgL: number;
  isOverBudget: boolean;
  accountingBasisFa: string;
  estimatedBoundAndVolatilizedRatio: number;
  measuredTotalSO2MgL?: number;
  stageBreakdown: Array<{
    id: string;
    stageTitle: string;
    amountGrams: number;
    referenceVolumeL: number;
    contributedMgL: number;
    formulaText: string;
    isDemo?: boolean;
  }>;
}
⋮----
function mirrorToIndexedDB(storeKey: string, data: unknown): void
⋮----
function generateId(prefix: string): string
⋮----
class EnologyDatabaseService
⋮----
constructor()
⋮----
private preserveCorruptRawValue(key: string, rawValue: string)
⋮----
private handleStorageSetItem(key: string, serialized: string)
⋮----
private loadBackupMeta()
⋮----
private persistBackupMeta()
⋮----
private incrementChangesSinceBackup()
⋮----
private parseArrayWithSalvage<T>(
    key: string,
    rawJson: string,
    itemSchema: z.ZodType<T>,
    fallback: T[]
): T[]
⋮----
public async hydrateFromIndexedDBIfNeeded(): Promise<boolean>
⋮----
const readKey = <T>(
              key: string,
              shouldHydrate: boolean,
              schema: z.ZodType<T>,
              onValid: (items: T[]) => void
): Promise<void>
⋮----
const mergeIfSalvaged = <T extends { id: string }>(
              key: string,
              current: T[],
              idbItems: T[]
): T[] =>
⋮----
private init()
⋮----
public getStorageDiagnostics():
⋮----
public getBatches(): WineBatch[]
⋮----
public getBatchById(id: string): WineBatch | undefined
⋮----
public addBatch(batch: Omit<WineBatch, 'id'>): WineBatch
⋮----
public updateBatch(id: string, updates: Partial<WineBatch>): WineBatch | null
⋮----
public updateBatchProtocolSnapshot(
    batchId: string,
    params: FlexibleProtocolParams
): WineBatch | null
⋮----
public syncActiveBatchProtocolSnapshot(params: FlexibleProtocolParams): WineBatch | null
⋮----
private persistBatches()
⋮----
public hasDemoData(): boolean
⋮----
public startRealBatchMode(newBatch?: Omit<WineBatch, 'id'>): WineBatch | null
⋮----
public getOrphanRecordsSummary():
⋮----
public assignOrphanRecordsToBatch(targetBatchId: string): void
⋮----
private matchesBatch(itemBatchId: string | undefined, batchId: string): boolean
⋮----
public getLogs(tankId?: TankId, includeDeleted: boolean = false, batchId?: string): FermentationLogEntry[]
⋮----
public addLog(entry: FermentationLogEntry): FermentationLogEntry[]
⋮----
public updateLog(id: string, entry: Partial<FermentationLogEntry>): FermentationLogEntry[]
⋮----
public softDeleteLog(id: string): FermentationLogEntry[]
⋮----
public restoreLog(id: string): FermentationLogEntry[]
⋮----
public deleteLog(id: string): FermentationLogEntry[]
⋮----
public clearRealLogs(tankId?: TankId, batchId?: string): FermentationLogEntry[]
⋮----
public resetLogsToDefault(): FermentationLogEntry[]
⋮----
private persistLogs()
⋮----
public getAdditions(tankId?: TankId, includeDeleted: boolean = false, batchId?: string): ChemicalAddition[]
⋮----
public addAddition(addition: Omit<ChemicalAddition, 'id'>): ChemicalAddition
⋮----
public softDeleteAddition(id: string): ChemicalAddition[]
⋮----
public restoreAddition(id: string): ChemicalAddition[]
⋮----
public deleteAddition(id: string): ChemicalAddition[]
⋮----
private persistAdditions()
⋮----
public getLabAnalyses(tankId?: TankId, includeDeleted: boolean = false, batchId?: string): LabAnalysisRecord[]
⋮----
public addLabAnalysis(analysis: Omit<LabAnalysisRecord, 'id'>): LabAnalysisRecord
⋮----
public softDeleteLabAnalysis(id: string): LabAnalysisRecord[]
⋮----
public restoreLabAnalysis(id: string): LabAnalysisRecord[]
⋮----
public deleteLabAnalysis(id: string): LabAnalysisRecord[]
⋮----
private persistAnalyses()
⋮----
public getSavedCalculations(): SavedCalculation[]
⋮----
public saveCalculation(calc: Omit<SavedCalculation, 'id' | 'timestamp'>): SavedCalculation
⋮----
public deleteCalculation(id: string): SavedCalculation[]
⋮----
private persistCalculations()
⋮----
public getCumulativeSO2Ledger(
    tankId: TankId,
    batchVolumeL?: number,
    residualSugarGL: number = 1.5,
    measuredTotalSO2MgL?: number,
    excludeDemo: boolean = false,
    batchId?: string
): CumulativeSO2Ledger
⋮----
public getBackupHealthStatus():
⋮----
public getDatabaseSummary()
⋮----
public buildExportDatabaseJSON(): string
⋮----
public confirmBackupCompleted(): void
⋮----
public exportDatabaseJSON(confirmImmediately: boolean = true): string
⋮----
public exportLogsToCSV(tankId?: TankId): string
⋮----
// Add UTF-8 BOM so Excel opens Persian text cleanly
⋮----
// --- Preview Database Import (JSON) ---
public previewDatabaseImport(jsonString: string):
⋮----
// --- Import Database (JSON) with Zod Validation ---
public importDatabaseJSON(
    jsonString: string,
    mode: 'replace' | 'merge' = 'replace'
):
⋮----
const mergeById = <T extends
⋮----
public resetToFactoryDefaults()
````

## File: src/types/database.ts
````typescript
import { z } from 'zod';
import type { FermentationLogEntry, TankId } from './tracking.ts';
⋮----
export type StructuredCompoundType =
  | 'kms'
  | 'bactiless'
  | 'fermaid_o'
  | 'fermaid_k'
  | 'dap'
  | 'zinc'
  | 'tannin_red'
  | 'tannin_white'
  | 'enzyme'
  | 'tartaric'
  | 'khco3'
  | 'caco3'
  | 'copper'
  | 'kht'
  | 'glycerin'
  | 'ascorbic'
  | 'h2o2'
  | 'yeast'
  | 'go_ferm'
  | 'bentonite'
  | 'other';
⋮----
export interface WineBatch {
  id: string;
  name: string;
  grapeVariety: string;
  vintageYear: number;
  initialWeightKg: number;
  targetStyle: 'red' | 'rose' | 'reserve';
  status: 'active_fermentation' | 'pressing' | 'malolactic' | 'aging' | 'bottled';
  startDate: string;
  notes?: string;
  isDemo?: boolean;
  tankCount?: 1 | 2;
  sugarSource?: 'refractometer' | 'hydrometer';
  initialBrix?: number;
  initialSG?: number;
  initialPH?: number | 'unknown';
  initialTA?: number | 'unknown';
  malicStatus?: 'low' | 'medium' | 'high' | 'unknown';
  mlfPolicy?: 'no_mlf' | 'spontaneous' | 'inoculated';
  updatedAtMs?: number;
  protocolParamsSnapshot?: Record<string, number | string>;
}
⋮----
export interface ChemicalAddition {
  id: string;
  batchId: string;
  tankId: TankId;
  timestamp: string;
  stageTitle: string;
  compoundName: string;
  pubchemCid?: number;
  amount: number;
  unit: 'g' | 'g/hL' | 'mg/L' | 'mL' | 'kg';
  purpose: string;
  operatorNote?: string;
  lotNumber?: string;
  compoundType?: StructuredCompoundType;
  referenceVolumeL?: number;
  calculatedSO2MgL?: number;
  sgAtAddition?: number;
  isDemo?: boolean;
  isDeleted?: boolean;
  milestoneId?: string;
  dayNumber?: number;
  timestampMs?: number;
  updatedAtMs?: number;
}
⋮----
export interface LabAnalysisRecord {
  id: string;
  batchId: string;
  tankId: TankId;
  date: string;
  testType: 'ripper_so2' | 'ta_titration' | 'ph_meter' | 'mlf_chromatography' | 'refractometer_correction' | 'sensory_eval';
  targetAnalyte: string;
  pubchemCid?: number;
  measuredValue: number | string;
  unit: string;
  actionTaken?: string;
  notes?: string;
  methodReliability?: 'high' | 'medium' | 'low_red_ripper' | 'ascorbic_interference';
  malicResult?: 'present' | 'partial' | 'depleted';
  isDemo?: boolean;
  isDeleted?: boolean;
  dayNumber?: number;
  timestampMs?: number;
  updatedAtMs?: number;
}
⋮----
export interface SavedCalculation {
  id: string;
  timestamp: string;
  calculatorType:
    | 'kms'
    | 'hydrometer_temp'
    | 'batch_scaling'
    | 'yan'
    | 'tartaric_addition'
    | 'ph_adjustment'
    | 'refractometer_correction'
    | 'dry_ice_cooling'
    | 'dryness_check'
    | 'bench_fining'
    | 'troubleshooting_scenario';
  title: string;
  inputs: Record<string, number | string>;
  results: Record<string, number | string>;
  notes?: string;
}
⋮----
export interface PubChemCompoundData {
  cid: number;
  title: string;
  iupacName: string;
  molecularFormula: string;
  molecularWeight: string;
  canonicalSmiles: string;
  xLogP?: number;
  tpsa?: number;
  hBondDonorCount?: number;
  hBondAcceptorCount?: number;
  enologyRoleFa: string;
  category: 'acid' | 'sulfur' | 'polyphenol' | 'alcohol' | 'nutrient' | 'spoilage_marker' | 'enzyme_substrate';
  hazardWarningFa?: string;
  imageUrl?: string;
}
⋮----
export interface UniProtProteinData {
  accession: string;
  id: string;
  proteinName: string;
  geneName?: string;
  organism: string;
  functionSummaryFa: string;
  enologyRelevanceFa: string;
  length?: number;
  ecNumber?: string;
}
⋮----
export interface EnologyDatabaseExport {
  version: string;
  exportedAt: string;
  batches: WineBatch[];
  fermentationLogs: FermentationLogEntry[];
  chemicalAdditions: ChemicalAddition[];
  labAnalyses: LabAnalysisRecord[];
  savedCalculations: SavedCalculation[];
  flexibleProtocolParams?: Record<string, number | string>;
}
````

## File: src/types/index.ts
````typescript

````

## File: src/types/tracking.ts
````typescript
export type TankId = 'tank-a' | 'tank-b' | 'tank-rose';
⋮----
export interface FermentationLogEntry {
  id: string;
  tankId: TankId;
  dayNumber: number;
  dateTime: string;
  timestampMs?: number;
  stageTitle: string;
  brix: number;
  sg: number;
  tempCap: number;
  tempRoom: number;
  ph: number;
  ta?: number;
  freeSO2?: number;
  pigeageDone: boolean;
  pigeageCount?: number;
  operationNote?: string;
  isTriggerPoint?: boolean;
  isBenchmark?: boolean;
  tempSample?: number;
  measuredSG?: number;
  isDemo?: boolean;
  isDeleted?: boolean;
  photoIds?: string[];
  quickTags?: string[];
  batchId?: string;
  updatedAtMs?: number;
  phMeasured?: boolean;
  taMeasured?: boolean;
  freeSO2Measured?: boolean;
  tempRoomMeasured?: boolean;
}
````

## File: src/utils/enologyTroubleshooting.test.ts
````typescript
import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateEnologicalScenario } from './enologyTroubleshooting.ts';
import {
  resolveEffectiveTankSelection,
  resolvePrimaryTankId,
  resolveTargetTankIds,
  getAvailableTankSelections,
  getGlossaryItem
} from '../context/EnologyUiContext.tsx';
````

## File: src/utils/enologyTroubleshooting.ts
````typescript
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
⋮----
export interface ScenarioInput {
  batchVolumeL: number;
  currentSG: number;
  currentBrix: number;
  tempCapC: number;
  ph: number;
  ta: number;
  freeSO2: number;
  dayNumber?: number;
  isRose?: boolean;
  isUnpressedMash?: boolean;
  isUnpressedRedMust?: boolean;
  issues?: {
    isStuckFermentation?: boolean;
    hasH2S?: boolean;
    hasVolatileAcidity?: boolean;
    hasDryCap?: boolean;
    hasBitterSeeds?: boolean;
    hasCloudiness?: boolean;
  };
}
⋮----
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
⋮----
export interface EnologyEvaluationResult {
  overallHealthScore: number;
  overallStatusText: string;
  overallStatusColor: 'emerald' | 'amber' | 'rose' | 'blue';
  criticalWarningsCount: number;
  actions: CorrectiveAction[];
  visibleActions: CorrectiveAction[];
  hiddenActionsCount: number;
  infoActions: CorrectiveAction[];
  hasInvalidVolume?: boolean;
}
⋮----
export function evaluateEnologicalScenario(input: ScenarioInput): EnologyEvaluationResult
````

## File: src/utils/enologyUtils.test.ts
````typescript
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getEffectiveLiquidVolume,
  isAlreadyLiquidVolume,
  calculateKMS,
  normalizeEnologyNumericInput,
  correctHydrometer,
  calculateScaleVolumes,
  calculateTitratableAcidity,
  calculateTartaricAddition,
  estimateAcidOrBaseFromPHShift,
  calculateKHCO3Deacidification,
  calculateDeacidificationOptions,
  calculateFreeSO2Ripper,
  calculateMolecularSO2,
  calculateRefractometerCorrection,
  calculateSNAAmounts,
  calculateBenchFiningGrams,
  calculateCoolingDryIceKg,
  getTargetFreeSO2ByPH,
  getContinuousTargetFreeSO2ByPH,
  calculateStockSolutionPlan,
  calculateDynamicSGTriggers,
  calculateH2O2SulfiteRemoval,
  calculateStagedH2O2Plan
} from './enologyUtils.ts';
import {
  IDEAL_DEFAULT_PROTOCOL_PARAMS,
  CLASSIC_V32_PROTOCOL_PARAMS,
  computeDynamicProtocolPlan,
  getEffectiveProtocolPlanForBatch
} from '../data/masterProtocolConfig.ts';
````

## File: src/utils/enologyUtils.ts
````typescript
import { MASTER_PROTOCOL_CONFIG } from '../data/masterProtocolConfig.ts';
⋮----
export function isAlreadyLiquidVolume(volumeL: number): boolean
⋮----
export type VolumeBasis = 'liquid_phase' | 'gross_mash';
⋮----
export function getEffectiveLiquidVolume(
  volumeL: number,
  isUnpressedRedMustOrBasis: boolean | VolumeBasis = false,
  mashYieldFactor: number = 0.84
): number
⋮----
export function calculateKMS(
  volumeL: number,
  currentSO2: number,
  targetSO2: number,
  isUnpressedRedMust: boolean | VolumeBasis = false,
  mashYieldFactor: number = 0.84
): number
⋮----
export function normalizeEnologyNumericInput(
  raw: string | number,
  mode: 'sg' | 'general' = 'general'
): number | null
⋮----
export function correctHydrometer(
  measuredSG: number,
  tempC: number,
  calibrationTempC: 20 | 15.5 = 20
):
⋮----
export function calculateScaleVolumes(grapeKg: number)
⋮----
export function calculateTitratableAcidity(
  vNaOH_mL: number,
  nNaOH: number = 0.1,
  vSample_mL: number = 5
): number
⋮----
export function calculateTartaricAddition(
  currentTA: number,
  targetTA: number,
  volumeL: number,
  isUnpressedRedMust: boolean | VolumeBasis = false,
  mashYieldFactor: number = 0.84
): number
⋮----
export function estimateAcidOrBaseFromPHShift(
  currentPH: number,
  targetPH: number,
  effectiveVolumeL: number
):
⋮----
/**
 * Returns all 3 stoichiometric deacidification options for a given TA reduction (g/L) and effective liquid volume (L):
 * - Pure stoichiometric KHCO3: 1.33 g/L per 1.0 g/L Tartaric Acid (2 * 100.115 / 150.09 = 1.334)
 * - KHCO3 with Cold Stabilization KHT precipitation: 1.00 g/L per 1.0 g/L TA
 * - Calcium Carbonate (CaCO3): 0.67 g/L per 1.0 g/L TA (100.09 / 150.09 = 0.667)
 */
export function calculateDeacidificationOptions(
  deltaTA_gL: number,
  effectiveVolumeL: number
):
⋮----
/**
 * Calculates Potassium Bicarbonate (KHCO3) deacidification dosage in grams.
 * Note: True stoichiometry (1.33 g/L KHCO3 per 1.0 g/L TA reduction) requires `deltaTA_gL`.
 * When `deltaTA_gL` is not provided, returns an empirical starting estimate for a 3-glass bench trial.
 */
export function calculateKHCO3Deacidification(
  currentPH: number,
  targetMinPH: number,
  volumeL: number,
  isUnpressedRedMust: boolean | VolumeBasis = false,
  deltaTA_gL?: number,
  mashYieldFactor: number = 0.84
): number
⋮----
const khco3Rate = MASTER_PROTOCOL_CONFIG.stoichiometry.khco3GramsPerGL_TA; // 1.33 g/L
⋮----
/**
 * Free SO2 Ripper Titration test
 * Formula: Free SO2 (mg/L or ppm) = (V_I2 (mL) * N_I2 * 32 * 1000) / V_sample (mL)
 * (32 is the equivalent weight of SO2)
 */
export function calculateFreeSO2Ripper(
  vI2_mL: number,
  nI2: number = 0.02,
  vSample_mL: number = 25
): number
⋮----
/**
 * Molecular (active antimicrobial) SO2 from Free SO2 and pH
 * Formula: Molecular SO2 = Free SO2 / (1 + 10^(pH - 1.81))
 * Standard target: 0.8 mg/L for red wines (or 0.5-0.8), preventing Brettanomyces & spoilage
 */
export function calculateMolecularSO2(freeSO2_ppm: number, pH: number): number
⋮----
/**
 * Refractometer alcohol correction during fermentation (Sean Terrill Cubic Equation).
 * In Sean Terrill's polynomial, all Original Brix (ob) terms are negative and all Current Brix (cb) terms are positive:
 * SG = 1.001843 - 0.002318474*OB - 0.000007775*OB^2 - 0.000000034*OB^3
 *               + 0.00574*CB + 0.00003344*CB^2 + 0.000000086*CB^3
 */
export function calculateRefractometerCorrection(
  origBrix: number,
  currentRefractometerBrix: number
):
⋮----
const terrillAt = (o: number, c: number)
⋮----
export function calculateSNAAmounts(
  volumeL: number,
  brix: number = 22,
  sgOrStrain: number | 'low' | 'medium' | 'high' = 'medium',
  naturalYAN: number = 100,
  sgOptional?: number,
  isUnpressedRedMust: boolean | VolumeBasis = false,
  mashYieldFactor: number = 0.84,
  customRates?: {
    fermaidO1RateGL?: number;
    fermaidK2RateGL?: number;
    dap2RateGL?: number;
    fermaidO3RateGL?: number;
    zincRateGL?: number;
  }
)
⋮----
export function calculateBenchFiningGrams(doseG_per_L: number, tankVolume_L: number): number
⋮----
export function calculateCoolingDryIceKg(
  volumeL: number,
  currentTempC: number,
  targetTempC: number = 26,
  sg: number = 1.080,
  efficiency: number = 0.65
): number
⋮----
export function getTargetFreeSO2ByPH(
  ph: number,
  isRose: boolean = false
):
⋮----
export function getContinuousTargetFreeSO2ByPH(
  ph: number,
  isRose: boolean = false,
  targetMolecularMgL?: number
):
⋮----
export type ScalePrecisionGrams = 1 | 0.1 | 0.01;
export type StockCompoundCategory =
  | 'zinc'
  | 'kms'
  | 'copper'
  | 'tartaric'
  | 'fermaid_or_yeast'
  | 'general';
⋮----
export function calculateStockSolutionPlan(
  targetDoseGrams: number,
  scalePrecisionGrams: ScalePrecisionGrams = 0.1,
  compoundCategory: StockCompoundCategory = 'general'
):
⋮----
export function calculateDynamicSGTriggers(
  initialSG: number = 1.092,
  overrides?: { pressingPoint?: number; drynessPoint?: number }
):
⋮----
export function calculateH2O2SulfiteRemoval(
  volumeL: number,
  currentSO2: number,
  targetSO2: number = 35
): number
⋮----
export function calculateStagedH2O2Plan(
  volumeL: number,
  currentSO2: number,
  targetSO2: number = 35
):
````

## File: src/utils/exportDocxReport.test.ts
````typescript
import test from 'node:test';
import assert from 'node:assert/strict';
import { exportDocxReport } from './exportDocxReport.ts';
import type { FermentationLogEntry } from '../types/tracking.ts';
````

## File: src/utils/exportDocxReport.ts
````typescript
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
⋮----
import type { FermentationLogEntry, TankId } from '../types/tracking.ts';
import type { ChemicalAddition, LabAnalysisRecord } from '../types/database.ts';
import { compareRealLogsWithBenchmark } from './trackingCalculations.ts';
import { getCurrentDynamicProtocolPlan, type DynamicProtocolPlan } from '../data/masterProtocolConfig.ts';
import { enologyDb } from '../db/enologyDatabase.ts';
⋮----
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
⋮----
export async function exportDocxReport(options: DocxReportOptions): Promise<void>
⋮----
const headerCell = (text: string, widthPct: number)
⋮----
const dataCell = (text: string, widthPct: number, bold = false, bgHex = 'FFFFFF')
````

## File: src/utils/persianDate.ts
````typescript
export function getCurrentPersianDateTimeStr(nowMs: number = Date.now()): string
````

## File: src/utils/rightNowEngine.test.ts
````typescript
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  evaluateRightNowQueue,
  evaluateDeadlineCountdowns,
  evaluateBottlingReadinessGate
} from './rightNowEngine.ts';
import { INITIAL_TRACKING_DATA } from '../data/seedTrackingData.ts';
import {
  computeDynamicProtocolPlan,
  IDEAL_DEFAULT_PROTOCOL_PARAMS
} from '../data/masterProtocolConfig.ts';
import type {
  ChemicalAddition,
  FermentationLogEntry,
  LabAnalysisRecord
} from '../types/index.ts';
⋮----
const makeDryLogs = (freeSO2?: number, tsMs?: number, phMeasured: boolean = true): FermentationLogEntry[]
⋮----
// 3. Verify tank-rose filters out Red-only skin/cap milestones and populates tank-rose rows with both Fermaid O + Zinc in SNA-1
````

## File: src/utils/rightNowEngine.ts
````typescript
import type {
  ChemicalAddition,
  FermentationLogEntry,
  LabAnalysisRecord,
  TankId,
  WineBatch
} from '../types/index.ts';
import {
  MASTER_PROTOCOL_CONFIG,
  getCurrentDynamicProtocolPlan,
  getEffectiveProtocolPlanForBatch,
  type DynamicProtocolPlan
} from '../data/masterProtocolConfig.ts';
import {
  calculateDynamicSGTriggers,
  getContinuousTargetFreeSO2ByPH
} from './enologyUtils.ts';
import {
  calculateRecentLogVelocity,
  sortFermentationLogs
} from './trackingCalculations.ts';
⋮----
export type MilestoneState =
  | 'pending'
  | 'due'
  | 'missed'
  | 'closed'
  | 'completed'
  | 'skipped';
⋮----
export type MilestoneTriggerType = 'sg' | 'day' | 'event';
⋮----
export interface MilestoneTankRow {
  tankId: TankId;
  tankLabelFa: string;
  doseAmountTextFa: string;
  isCompletedForTank: boolean;
  additionsToRecord: Array<Omit<ChemicalAddition, 'id'>>;
}
⋮----
export interface RightNowMilestone {
  id: string;
  roadmapStepIds: number[];
  titleFa: string;
  whyFa: string;
  howToExecuteFa: string;
  scienceNoteFa: string;
  confidenceLabelFa: string;
  triggerType: MilestoneTriggerType;
  triggerSG?: number;
  windowCloseSG?: number;
  triggerDay?: number;
  windowCloseDay?: number;
  state: MilestoneState;
  stateBadgeFa: string;
  closedReasonFa?: string;
  canMarkDone: boolean;
  estimatedHoursUntilDue?: { min: number; max: number };
  skippedReasonFa?: string;
  snoozedUntilMs?: number;
  tankRows: MilestoneTankRow[];
}
⋮----
export interface SgAnomalyAlert {
  hasAnomaly: boolean;
  previousSG: number;
  currentSG: number;
  titleFa: string;
  descriptionFa: string;
}
⋮----
export interface RightNowQueueResult {
  sgAnomaly: SgAnomalyAlert | null;
  primaryAction: RightNowMilestone | null;
  overdueActions: RightNowMilestone[];
  closedActions: RightNowMilestone[];
  upcomingActions: RightNowMilestone[];
  allMilestones: RightNowMilestone[];
}
⋮----
export interface DeadlineCountdownItem {
  id: 'dap_window' | 'bactiless_contact' | 'post_dryness_so2';
  titleFa: string;
  rangeTextFa: string;
  color: 'emerald' | 'amber' | 'rose' | 'gray';
  urgencyLevel: 'safe' | 'warning' | 'critical' | 'closed';
  explanationFa: string;
}
⋮----
export interface BottlingGateCheckItem {
  id: string;
  titleFa: string;
  isBlocking: boolean;
  status: 'passed' | 'blocked_red' | 'advisory_amber';
  dataStatus?: 'verified' | 'incomplete_data' | 'failed';
  detailFa: string;
  whyFa: string;
}
⋮----
export interface BottlingReadinessResult {
  blockingItems: BottlingGateCheckItem[];
  advisoryItems: BottlingGateCheckItem[];
  allBlockingPassed: boolean;
  canStartBottling: boolean;
  executionMode: 'safe_ready' | 'override_with_risk' | 'blocked';
  overriddenBlockerIds: string[];
  overrideWarningFa?: string;
  riskOverrideReason?: string;
  overrideAudit?: {
    overriddenAtMs: number;
    reason: string;
    overriddenBlockerIds: string[];
    tankId: TankId;
    batchId?: string;
  };
  so2AgeHours?: number;
}
⋮----
function getStateBadgeFa(state: MilestoneState): string
⋮----
function formatNowFa(): string
⋮----
function isMilestoneCompletedByAdditions(
  milestoneId: string,
  tankAdditions: ChemicalAddition[],
  completedRoadmapStepIds: number[],
  roadmapStepIds: number[]
): boolean
⋮----
export function evaluateRightNowQueue(options: {
  logs: FermentationLogEntry[];
  additions: ChemicalAddition[];
  activeTankId?: TankId;
  completedRoadmapStepIds?: number[];
  snoozedUntilMsByStepId?: Record<string, number>;
  skippedReasonsByStepId?: Record<string, string>;
  nowMs?: number;
  plan?: DynamicProtocolPlan;
  batch?: WineBatch;
  batchId?: string;
  excludeDemo?: boolean;
}): RightNowQueueResult
⋮----
const isRecordMatchingActiveBatch = (recordBatchId?: string, recordTankId?: TankId): boolean =>
⋮----
interface MilestoneBlueprint {
    id: string;
    roadmapStepIds: number[];
    titleFa: string;
    whyFa: string;
    howToExecuteFa: string;
    scienceNoteFa: string;
    confidenceLabelFa: string;
    triggerType: MilestoneTriggerType;
    triggerSG?: number;
    windowCloseSG?: number;
    triggerDay?: number;
    windowCloseDay?: number;
    closedReasonFa?: string;
    buildTankRows: () => MilestoneTankRow[];
  }
⋮----
const makeRedTanksRows = (
    milestoneId: string,
    stepIds: number[],
buildForTank: (tankId: 'tank-a' | 'tank-b', labelFa: string) =>
⋮----
const appendRoseTankRow = (
    rows: MilestoneTankRow[],
    milestoneId: string,
    stepIds: number[],
    doseAmountTextFa: string,
    additionsToRecord: Array<Omit<ChemicalAddition, 'id'>>
): MilestoneTankRow[] =>
⋮----
export function evaluateDeadlineCountdowns(options: {
  logs: FermentationLogEntry[];
  additions: ChemicalAddition[];
  labAnalyses?: LabAnalysisRecord[];
  tankId?: TankId;
  plan?: DynamicProtocolPlan;
  batch?: WineBatch;
  batchId?: string;
  excludeDemo?: boolean;
}): DeadlineCountdownItem[]
⋮----
export function evaluateBottlingReadinessGate(options: {
  logs: FermentationLogEntry[];
  additions: ChemicalAddition[];
  labAnalyses: LabAnalysisRecord[];
  batch?: WineBatch;
  batchId?: string;
  excludeDemo?: boolean;
  tankId?: TankId;
  requireRsLabConfirmation?: boolean;
  manualConfirmations?: {
    clarityConfirmed?: boolean;
    coldStabConfirmedOrSkipped?: boolean;
    warmTestPassed?: boolean;
    sanitationConfirmed?: boolean;
    malicRiskAccepted?: boolean;
    clinitestPassed?: boolean;
    rsConfirmed?: boolean;
  };
  riskOverrideReason?: string;
  nowMs?: number;
}): BottlingReadinessResult
⋮----
const matchesBatch = (recordBatchId?: string): boolean =>
⋮----
// Blocking Check 3: Malic / MLF Stability
````

## File: src/utils/trackingCalculations.test.ts
````typescript
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateFermentationProgress,
  calculateAlcoholByVolume,
  brixToSpecificGravity,
  specificGravityToBrix,
  getCapTemperatureAlertLevel,
  analyzeLogEntryHealth,
  compareRealLogsWithBenchmark,
  predictFermentationCompletion,
  calculateRecentLogVelocity,
  calculateVelocity
} from './trackingCalculations.ts';
import type { FermentationLogEntry } from '../types/tracking.ts';
import type { ChemicalAddition } from '../types/database.ts';
````

## File: src/utils/trackingCalculations.ts
````typescript
import type { FermentationLogEntry, TankId } from '../types/tracking.ts';
import type { ChemicalAddition } from '../types/database.ts';
import {
  calculateDynamicSGTriggers,
  getContinuousTargetFreeSO2ByPH,
  getTargetFreeSO2ByPH
} from './enologyUtils.ts';
import {
  MASTER_PROTOCOL_CONFIG,
  getCurrentDynamicProtocolPlan,
  getEffectiveProtocolPlanForBatch,
  type DynamicProtocolPlan
} from '../data/masterProtocolConfig.ts';
import { enologyDb } from '../db/enologyDatabase.ts';
⋮----
export function calculateFermentationProgress(
  sg: number,
  initialSG: number = MASTER_PROTOCOL_CONFIG.metadata.targetInitialSG,
  finalSG: number = MASTER_PROTOCOL_CONFIG.metadata.redFinalSG
): number
⋮----
export function calculateAlcoholByVolume(
  initialSG: number,
  currentSG: number
): number
⋮----
export function brixToSpecificGravity(brix: number): number
⋮----
export function specificGravityToBrix(sg: number): number
⋮----
export function getCapTemperatureAlertLevel(
  tempCap: number,
  isRose: boolean = false,
  currentSG: number = 1.050
): 'normal' | 'caution' | 'warning' | 'danger'
⋮----
function parseTimeHourFromDateTime(dateTime?: string): number | null
⋮----
export function sortFermentationLogs(logs: FermentationLogEntry[]): FermentationLogEntry[]
⋮----
export interface LogParameterHealth {
  paramName: string;
  value: string;
  targetRange: string;
  status: 'ideal' | 'good' | 'warning' | 'danger';
  note: string;
}
⋮----
export interface LogHealthAnalysis {
  isIdeal: boolean;
  statusBadge: string;
  statusColor: 'emerald' | 'amber' | 'rose' | 'blue';
  healthScore: number;
  detailedDescription: string;
  recommendedAction: string;
  parameters: LogParameterHealth[];
}
⋮----
export function analyzeLogEntryHealth(
  log: FermentationLogEntry,
  tankId: TankId = 'tank-a',
  recordedAdditions: ChemicalAddition[] = [],
  planOverride?: DynamicProtocolPlan
): LogHealthAnalysis
⋮----
export interface BenchmarkComparison {
  hasRealLogs: boolean;
  alignmentScore: number;
  sugarDepletionPct: number;
  statusTitle: string;
  statusBadge: string;
  statusColor: 'emerald' | 'amber' | 'rose' | 'indigo';
  sgDelta: number;
  tempDelta: number;
  phDelta: number;
  brixDelta: number;
  latestRealLog?: FermentationLogEntry;
  matchedBenchmarkLog?: FermentationLogEntry;
  comparisonDetails: string;
  actionableGuidance: string;
}
⋮----
export function compareRealLogsWithBenchmark(
  realLogs: FermentationLogEntry[],
  benchmarkLogs: FermentationLogEntry[],
  tankId: TankId = 'tank-a'
): BenchmarkComparison
⋮----
export interface FermentationPredictionResult {
  currentSG: number;
  targetSG: number;
  sgRemaining: number;
  recentVelocityPerDay: number; // e.g. 0.012 SG drop per day
  tempKineticFactor: number; // e.g. 1.10x multiplier based on temp
  effectiveVelocityPerDay: number;
  estimatedRemainingDays: number; // e.g. 3.5 days
  estimatedRemainingHours: number; // e.g. 84 hours
  estimatedDaysRange: { min: number; max: number };
  stageName: string; // e.g. "پایان تخمیر اولیه و خشکی کامل (SG = 0.993)"
  kineticStatus: 'fast' | 'normal' | 'sluggish' | 'stuck' | 'finished';
  kineticStatusFa: string;
  kineticAdviceFa: string;
  tempImpactDescription: string;
  isOutOfModelBounds?: boolean;
}
⋮----
recentVelocityPerDay: number; // e.g. 0.012 SG drop per day
tempKineticFactor: number; // e.g. 1.10x multiplier based on temp
⋮----
estimatedRemainingDays: number; // e.g. 3.5 days
estimatedRemainingHours: number; // e.g. 84 hours
⋮----
stageName: string; // e.g. "پایان تخمیر اولیه و خشکی کامل (SG = 0.993)"
⋮----
function getSubstrateDepletionFactor(sg: number): number
⋮----
export function calculateRecentLogVelocity(
  sortedLogs: FermentationLogEntry[],
  initialSGOverride?: number
):
⋮----
export function calculateVelocity(logs: FermentationLogEntry[], tankId?: TankId): number
⋮----
export function predictFermentationCompletion(
  logs: FermentationLogEntry[],
  tankId: TankId = 'tank-a',
  targetSGOverride?: number,
  tempOverride?: number,
  initialSGOverride?: number,
  planOverride?: DynamicProtocolPlan
): FermentationPredictionResult
````

## File: src/utils/useLocalStorage.ts
````typescript
import { useState, useEffect, useRef } from 'react';
⋮----
interface LocalStorageSyncDetail {
  key: string;
  serialized: string;
  value: unknown;
}
⋮----
export function useLocalStorageState<T>(
  key: string,
  defaultValue: T
): [T, (value: T | ((prev: T) => T)) => void]
⋮----
const readKey = (targetKey: string, fallback: T): T =>
⋮----
const handleSameWindowSync = (e: Event) =>
⋮----
const handleStorageEvent = (e: StorageEvent) =>
````

## File: src/utils/useToast.ts
````typescript
import { useState, useRef, useCallback, useEffect } from 'react';
⋮----
export function useToast(durationMs: number = 3500):
````

## File: src/App.tsx
````typescript
import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  BookOpen,
  Calendar,
  Database,
  Eye,
  PlusCircle,
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
import { useLocalStorageState } from './utils/useLocalStorage.ts';
⋮----
type MoreHubSection =
  | 'all'
  | 'group-winemaking'
  | 'group-knowledge'
  | 'group-data-health'
  | 'accessibility'
  | 'protocol-customizer'
  | 'photo-vintage'
  | 'glossary'
  | 'master-protocol';
⋮----
const handleOpenTestingTool = (
    testId?: string,
    subTab?: 'calculators-sops' | 'troubleshooting-crises' | 'saved-history'
) =>
⋮----
onDataChanged=
⋮----
navigateToLabTest(testId || 'ripper_so2',
⋮----
onNavigateToTracking=
⋮----
onChange=
⋮----
onLogSaved=
````

## File: src/index.css
````css
@layer base {
⋮----
* {
body {
input, textarea, select, button {
code, kbd, samp, pre, .font-mono {
input[type="number"], input[inputmode="decimal"], .tabular-nums {
.ltr-metric {
::placeholder {
⋮----
.no-print {
.print-only {
.print-page-break {
.print-card {
````

## File: src/main.tsx
````typescript
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
````

## File: .aiignore
````
node_modules/
dist/
build/
.aistudio/
public/*.docx
*.docx
*.lock
package-lock.json
pnpm-lock.yaml
*.min.js
*.map
**/*.svg
system-logic-audit.md
AI_ULTRA_DIGEST.md
AI_CORE_LOGIC_BUNDLE.md
````

## File: .clineignore
````
node_modules/
dist/
build/
.aistudio/
public/*.docx
*.docx
*.lock
package-lock.json
pnpm-lock.yaml
*.min.js
*.map
**/*.svg
system-logic-audit.md
AI_ULTRA_DIGEST.md
AI_CORE_LOGIC_BUNDLE.md
````

## File: .clinerules
````
# Agent Execution Protocol & Architecture Guide (Enology Studio)

## 1. Tech Stack & Directory Map
- Shared Types & Zod Schemas (READ FIRST): `src/types/index.ts`
- Single Source of Truth Protocol Config: `src/data/masterProtocolConfig.ts`
- Pure Chemistry & Enology Math: `src/utils/enologyUtils.ts`
- Fermentation Kinetics & Diagnostics: `src/utils/trackingCalculations.ts`
- Troubleshooting & Crisis Engine: `src/utils/enologyTroubleshooting.ts`
- LocalStorage/IndexedDB Service: `src/db/enologyDatabase.ts`
- 4-Pillar UI Components:
  - Pillar 1 (46-Step Roadmap & Timers): `src/components/ProcessRoadmapTracker.tsx`
  - Pillar 2 (Tank Dashboard, SVG Charts & 5-Tab Logbook): `src/components/FermentationTracker.tsx`
  - Pillar 3 (9 Lab Calculators, SOPs & Troubleshooter): `src/components/TestingGuide.tsx`
  - Pillar 4 (Master Protocol, PubChem/UniProt DB & Backup): `src/components/MasterProtocolView.tsx`, `src/components/BioscienceDatabaseView.tsx`
  - Flexible Parameter Studio Bar: `src/components/FlexibleProtocolCustomizerBar.tsx`

## 2. Strict Token-Saving Rules
- DO NOT run exploratory `ls` or read unrelated files. Only open the exact target file(s) named in the prompt.
- Check `src/types/index.ts` first when inspecting data contracts.
- When working on UI components (`src/components/*`), read `.agent/API_SIGNATURES.md` and `src/types/index.ts` instead of opening implementation files in `src/utils/` or `src/db/`.
- NEVER open static text data files (`src/data/protocolData.ts`, `src/data/bioscienceData.ts`, `src/data/roadmapStepsData.ts`, `src/data/seedTrackingData.ts`) unless the user prompt explicitly asks to modify them.
- Keep edits minimal and surgical. NEVER rewrite an entire large file when a targeted search/replace block suffices.
- Preserve 100% of existing features, formulas, and Persian instructional texts (Zero Feature Loss Rule).

## 3. Silent Verification Loop (Mandatory)
- After completing edits, DO NOT run verbose `npm run build` or `npm test`.
- Always verify changes by running: `npm run agent:check`
- If `npm run agent:check` passes, update `.agent/TASK_STATE.md` if requested and stop immediately.
````

## File: .env.example
````
# GEMINI_API_KEY: Required for Gemini AI API calls.
# AI Studio automatically injects this at runtime from user secrets.
# Users configure this via the Secrets panel in the AI Studio UI.
GEMINI_API_KEY="MY_GEMINI_API_KEY"

# APP_URL: The URL where this applet is hosted.
# AI Studio automatically injects this at runtime with the Cloud Run service URL.
# Used for self-referential links, OAuth callbacks, and API endpoints.
APP_URL="MY_APP_URL"
````

## File: .gitignore
````
node_modules/
build/
dist/
coverage/
.DS_Store
*.log
.env*
!.env.example
````

## File: .repomixignore
````
node_modules/**
dist/**
build/**
coverage/**
.aistudio/**
skills/**
.git/**
package-lock.json
pnpm-lock.yaml
*.docx
*.png
*.jpg
*.jpeg
*.svg
*.ico
*.woff
*.woff2
*.ttf
*.eot
AI_ULTRA_DIGEST.md
AI_CORE_LOGIC_BUNDLE.md
.agent/repo-skeleton.xml
repomix-output.*
````

## File: AGENTS.md
````markdown
# Agent Execution Protocol & Architecture Guide (Enology Studio)

## 1. Tech Stack & Directory Map
- Shared Types & Zod Schemas (READ FIRST): `src/types/index.ts`
- Single Source of Truth Protocol Config: `src/data/masterProtocolConfig.ts`
- Pure Chemistry & Enology Math: `src/utils/enologyUtils.ts`
- Fermentation Kinetics & Diagnostics: `src/utils/trackingCalculations.ts`
- Troubleshooting & Crisis Engine: `src/utils/enologyTroubleshooting.ts`
- Unified 5-State Milestone, Deadline & Bottling Gate Engine: `src/utils/rightNowEngine.ts`
- Global UI & Deep-Link Context (5-Tab Nav, Batch/Tank Switcher, Glossary): `src/context/EnologyUiContext.tsx`
- LocalStorage/IndexedDB Service: `src/db/enologyDatabase.ts`
- 5-Tab Final UX Architecture (100% Completed — Steps 1–5: `امروز | مخزنها | آزمایش | نقشه راه | بیشتر`, Global Tank/Batch/DeepLink/Glossary Context, Safe Empty-Default Unified Bottom Sheet, Question-Based Lab & Symptom Chips, and Unified Tank Status Card + Chart Layer Toggles):
  - Tab 1 («امروز» — Action Center, Deadlines & Bottling Gate): `src/components/RightNowActionCenter.tsx`
  - Tab 2 («مخزنها» — Unified Status Card, Layered SVG Charts & 4-Tab Logbook): `src/components/FermentationTracker.tsx`, `src/components/BandedFermentationChartAndSO2Panel.tsx`
  - Tab 3 («آزمایش» — Question-Based Entry, 5 Lab Wizards, 9 Calculators & Symptom Chips): `src/components/TestingGuide.tsx`, `src/components/InteractiveLabWizardsPanel.tsx`
  - Tab 4 («نقشه راه» — 5-Phase Stepper, 46-Step Roadmap & Active Timers Chip): `src/components/ProcessRoadmapTracker.tsx`
  - Tab 5 («بیشتر» — Master Protocol, PubChem/UniProt DB, Vintage/Photo Diary & Backup): `src/components/MasterProtocolView.tsx`, `src/components/BioscienceDatabaseView.tsx`, `src/components/PhotoDiaryAndVintagePanel.tsx`
  - Global Modals & Bars: `src/components/QuickTenSecondLogModal.tsx`, `src/components/BatchOnboardingWizardModal.tsx`, `src/components/FlexibleProtocolCustomizerBar.tsx`

## 2. Strict Token-Saving Rules
- DO NOT run exploratory `ls` or read unrelated files. Only open the exact target file(s) named in the prompt.
- Check `src/types/index.ts` first when inspecting data contracts.
- When working on UI components (`src/components/*`), read `.agent/API_SIGNATURES.md` and `src/types/index.ts` instead of opening implementation files in `src/utils/` or `src/db/`.
- NEVER open static text data files (`src/data/protocolData.ts`, `src/data/bioscienceData.ts`, `src/data/roadmapStepsData.ts`, `src/data/seedTrackingData.ts`) unless the user prompt explicitly asks to modify them.
- Keep edits minimal and surgical. NEVER rewrite an entire large file when a targeted search/replace block suffices.
- Preserve 100% of existing features, formulas, and Persian instructional texts (Zero Feature Loss Rule).

## 3. Silent Verification Loop (Mandatory)
- After completing edits, DO NOT run verbose `npm run build` or `npm test`.
- Always verify changes by running: `npm run agent:check`
- If `npm run agent:check` passes, update `.agent/TASK_STATE.md` if requested and stop immediately.
````

## File: index.html
````html
<!doctype html>
<html lang="fa" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>سامانه مهندسی و مدیریت شراب‌سازی | مستر پروتکل رشه سردشت و خروجی ورد</title>
    <meta name="description" content="سامانه جامع مدیریت کارگاهی، مهندسی انولوژی و راهنمای شراب‌سازی با مستر پروتکل رشه سردشت، محاسبه‌گرهای تخصصی و خروجی ورد DOCX" />
    <meta property="og:title" content="سامانه مهندسی و مدیریت شراب‌سازی | مستر پروتکل رشه سردشت و خروجی ورد" />
    <meta property="og:description" content="سامانه جامع مدیریت کارگاهی، مهندسی انولوژی و راهنمای شراب‌سازی با مستر پروتکل رشه سردشت، محاسبه‌گرهای تخصصی و خروجی ورد DOCX" />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
  </head>
  <body class="bg-stone-50 text-stone-900 font-['Vazirmatn',sans-serif] antialiased selection:bg-amber-100 selection:text-amber-900">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
````

## File: metadata.json
````json
{
  "name": "Rasha Sardasht 400kg Enology & Winery Studio",
  "description": "سامانه جامع مدیریت کارگاهی، مهندسی انولوژی و راهنمای شراب‌سازی با مستر پروتکل رشه سردشت، محاسبه‌گرهای تخصصی و خروجی ورد DOCX",
  "requestFramePermissions": [],
  "majorCapabilities": [
    "MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API"
  ]
}
````

## File: package.json
````json
{
  "name": "react-example",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --port=3000 --host=0.0.0.0",
    "build": "vite build",
    "preview": "vite preview",
    "clean": "rm -rf dist server.js",
    "lint": "tsc --noEmit",
    "test": "tsx --test src/db/enologyDatabase.test.ts src/utils/enologyUtils.test.ts src/utils/trackingCalculations.test.ts src/utils/enologyTroubleshooting.test.ts src/utils/exportDocxReport.test.ts",
    "agent:check": "tsc --noEmit --pretty false && tsx --test --test-reporter=dot src/db/enologyDatabase.test.ts src/utils/enologyUtils.test.ts src/utils/trackingCalculations.test.ts src/utils/enologyTroubleshooting.test.ts src/utils/exportDocxReport.test.ts",
    "ai:digest": "tsx scripts/generate_ai_digest.ts"
  },
  "dependencies": {
    "@fontsource/vazirmatn": "^5.3.0",
    "@tailwindcss/vite": "^4.3.3",
    "@vitejs/plugin-react": "^6.1.1",
    "docx": "^9.12.0",
    "file-saver": "^2.0.5",
    "lucide-react": "^0.546.0",
    "motion": "^12.23.24",
    "react": "^19.0.1",
    "react-dom": "^19.0.1",
    "vite": "^8.3.0",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@types/file-saver": "^2.0.7",
    "@types/node": "^22.14.0",
    "@types/react": "^19.3.0",
    "@types/react-dom": "^19.3.0",
    "autoprefixer": "^10.4.21",
    "esbuild": "^0.25.0",
    "tailwindcss": "^4.3.3",
    "tsx": "^4.21.0",
    "typescript": "^7.0.2",
    "vite-plugin-pwa": "^0.20.0"
  }
}
````

## File: repomix.config.json
````json
{
  "output": {
    "filePath": ".agent/repo-skeleton.xml",
    "style": "xml",
    "compress": true,
    "removeComments": true,
    "removeEmptyLines": true,
    "topFilesLength": 10
  },
  "ignore": {
    "useGitignore": true,
    "customPatterns": ["**/*.test.*", "**/*.spec.*", "**/*.svg", "**/*.docx", "dist/**", ".aistudio/**"]
  }
}
````

## File: system-logic-audit.md
````markdown
# System Logic Audit & Architecture Specification
**Application:** Rasha Sardasht Enology Protocol & Fermentation Analytics System (`SOP-OENO-1405-RS400`)  
**Document Author:** Principal Enology Bioprocess Engineer & Senior TypeScript Architect  
**File Target:** `system-logic-audit.md`  
**Scope:** Single Source of Truth (`src/data/masterProtocolConfig.ts`), Data Layer (`src/db/enologyDatabase.ts`), Core Stoichiometric & Bioprocess Algorithms (`src/utils/enologyUtils.ts`), and Predictive Telemetry (`src/utils/trackingCalculations.ts`)  

---

## 1. Data Models, Single Source of Truth & Schemas

The application is built on strongly-typed TypeScript models governed by `MASTER_PROTOCOL_CONFIG` (`src/data/masterProtocolConfig.ts`) covering wine batches, daily fermentation logs, chemical additions, cumulative $\text{SO}_2$ ledgers, laboratory titrations, saved calculations, and PubChem/UniProt bioscience annotations.

### 1.1 Single Source of Truth Constants (`src/data/masterProtocolConfig.ts`)

- **Protocol Code & Vintage:** `SOP-OENO-1405-RS400`, Vintage `1405`, Harvest Baseline `400 kg` (`22.0 °Bx`, `SG = 1.092`).
- **Mass & Volume Balance:**
  - Total Crushed Mash: `350 L` (`175 L` per Tank A/B)
  - Initial Liquid Phase: `300 L` (`150 L` per Tank A/B)
  - Saignée Raw Rosé Draw-Off: `36 L` (`18 L` from A + `18 L` from B) $\rightarrow$ `32 L` clarified Rosé $\rightarrow$ `30 L` post-racking $\rightarrow$ `29 L` final bottled Rosé.
  - Red Mash Post-Saignée: `157 L` per tank (`132 L` pure liquid phase + `25 L` skin cap; liquid-to-mash ratio `132 / 157 = 0.8408 ≈ 0.84`).
  - Post-Pressing Red Free-Run: Conservative `100 L` per tank (`95–110 L` range) $\rightarrow$ `96 L` (Day 10 Rack 1) $\rightarrow$ `94 L` (Day 30 Rack 2) $\rightarrow$ `93 L` (Day 65 Cold Stabilization).
  - Heavy Press Fraction: `28 L` total (`14 L` per tank, kept strictly separate).

### 1.2 Fermentation Tracking & Daily Log Models (`src/types/tracking.ts`)

```typescript
export type TankId = 'tank-a' | 'tank-b' | 'tank-rose';

export interface FermentationLogEntry {
  id: string;
  tankId: TankId;
  dayNumber: number;
  dateTime: string;            // Persian formatted string e.g. "۱۴۰۵/۰۷/۲۵ - ۰۸:۰۰"
  timestampMs?: number;        // Epoch milliseconds for exact sub-day velocity calculations
  stageTitle: string;          // e.g. "روز ۲ - تریگر ۱"
  brix: number;                // Refractometer / Hydrometer Brix reading e.g. 20.5
  sg: number;                  // Specific Gravity e.g. 1.083
  tempCap: number;             // Cap center temperature (°C) e.g. 23.5
  tempRoom: number;            // Ambient cellar room temperature (°C) e.g. 21.0
  ph: number;                  // pH meter reading e.g. 3.52
  ta?: number;                 // Titratable Acidity in g/L Tartaric acid e.g. 6.8
  freeSO2?: number;            // Free SO2 concentration in mg/L (ppm)
  pigeageDone: boolean;        // Manual punch-down execution flag
  pigeageCount?: number;       // Number of punch-downs executed in 24h
  operationNote?: string;      // Enological notes or observations
  isTriggerPoint?: boolean;    // Flag for critical SOP milestones (SNA, Pressing)
  isBenchmark?: boolean;       // True if this log belongs to the Master Protocol benchmark curve
}
```

---

## 2. State Management & Persistence Architecture

1. **`useLocalStorageState<T>(key: string, defaultValue: T)` Hook (`src/utils/useLocalStorageState.ts`):**
   - Synchronizes component state with `window.localStorage` with defensive JSON parsing and quota protection.
2. **`enologyDb` Client Database Service (`src/db/enologyDatabase.ts`):**
   - Generates collision-safe IDs via `crypto.randomUUID()`.
   - Persists 5 collections (`enology_db_batches_v1`, `enology_db_logs_v1`, `enology_db_additions_v1`, `enology_db_lab_analyses_v1`, `enology_db_saved_calculations_v1`).
   - Computes real-time cumulative $\text{SO}_2$ budget via `getCumulativeSO2Ledger(tankId, batchVolumeL)` including `15 mg/L` endogenous yeast $\text{SO}_2$ against the `150 mg/L` legal ceiling.

---

## 3. Core Computational & Stoichiometric Logic (`src/utils/enologyUtils.ts`)

### 3.1 Gravity, Brix & Alcohol Conversions

#### Specific Gravity to Brix Conversion
$$\text{Brix} = 261.3 \times \left(1 - \frac{1}{\text{SG}}\right)$$
*Condition:* If $\text{SG} \le 0.995$, $\text{Brix} = 0.0$.

#### Brix to Specific Gravity Conversion
$$\text{SG} = 1 + \frac{\text{Brix}}{258.6 - (\text{Brix} \times 0.88)}$$

#### Non-Linear High-Gravity Alcohol By Volume (ABV) Formula
Accounts for density shifts and glycerol production in $12\text{–}15\%\text{ v/v}$ wine musts:
$$\text{ABV (\% v/v)} = \frac{76.08 \times (\text{OG} - \text{FG})}{1.775 - \text{OG}} \times \frac{\text{FG}}{0.794}$$
*(At $\text{OG} = 1.092, \text{FG} = 0.993$, $\text{ABV} = 13.8\%\text{ v/v}$).*

#### Sean Terrill Cubic Refractometer Alcohol Correction
In Sean Terrill's cubic equation, all $\text{OB}$ (Original Brix) terms are negative and all $\text{CB}$ (Current Brix) terms are positive:
$$\text{True SG} = 1.001843 - 0.002318474\,\text{OB} - 0.000007775\,\text{OB}^2 - 0.000000034\,\text{OB}^3 + 0.00574\,\text{CB} + 0.00003344\,\text{CB}^2 + 0.000000086\,\text{CB}^3$$
*(At $\text{OB} = 22, \text{CB} = 22$, $\text{True SG} = 1.0901$ and $\text{ABV} = 0\%$). For $\text{CB} < \text{OB}$:*
$$\text{True Brix} = \frac{\text{True SG} - 1.0}{0.004}$$

---

### 3.2 Hydrometer Temperature Correction (Piecewise Linear Interpolation)

Calibrated at $20^\circ\text{C}$, $\Delta\text{SG}(T)$ is linearly interpolated across standard calibration points from $10^\circ\text{C}$ ($-0.0016$) through $20^\circ\text{C}$ ($0.0000$) up to $32^\circ\text{C}$ ($+0.0032$).
- For example, at $T = 19^\circ\text{C}$, linear interpolation between $(18^\circ\text{C}, -0.0004)$ and $(20^\circ\text{C}, 0.0000)$ yields $\Delta\text{SG}(19^\circ\text{C}) = -0.0002$.

---

### 3.3 Sulfur Dioxide ($\text{SO}_2$) & Hydrogen Peroxide ($\text{H}_2\text{O}_2$) Stoichiometry

#### Potassium Metabisulfite (KMS) Required Dosage
$$\text{KMS (g)} = \frac{(\text{Target Free SO}_2 - \text{Current Free SO}_2) \times V_{\text{liquid}}\text{ (L)}}{570}$$

#### Hydrogen Peroxide ($\text{H}_2\text{O}_2$ $3\%\text{ w/v}$) Sulfite Overdose Neutralization
Reaction: $\text{SO}_2\,(64.06\text{ g/mol}) + \text{H}_2\text{O}_2\,(34.01\text{ g/mol}) \rightarrow \text{H}_2\text{SO}_4$.
- $1\text{ mg SO}_2$ requires $\frac{34.01}{64.06} = 0.5309\text{ mg}$ pure $\text{H}_2\text{O}_2$.
- For a $3\%\text{ w/v}$ solution ($30\text{ mg/mL}$): $\frac{0.5309}{30} = 0.0177\text{ mL}$ of $3\%\text{ H}_2\text{O}_2$ per $\text{mg/L}$ excess $\text{SO}_2$ per liter:
$$\text{V}_{3\%\,\text{H}_2\text{O}_2}\text{ (mL)} = (\text{Current SO}_2 - \text{Target SO}_2) \times 0.0177 \times V_{\text{liquid}}\text{ (L)}$$

#### Active Antimicrobial Molecular $\text{SO}_2$ Formula
$$\text{Molecular SO}_2\text{ (mg/L)} = \frac{\text{Free SO}_2}{1 + 10^{(\text{pH} - 1.81)}}$$

---

### 3.4 Acidity, pH Balance & Deacidification Stoichiometry

#### Titratable Acidity (TA) NaOH Titration Formula
$$\text{TA (g/L as Tartaric Acid)} = \frac{V_{\text{NaOH}}\text{ (mL)} \times N_{\text{NaOH}} \times 75}{V_{\text{sample}}\text{ (mL)}}$$

#### Deacidification Stoichiometry ($\text{KHCO}_3$ vs. $\text{CaCO}_3$)
- **Pure Stoichiometric $\text{KHCO}_3$ ($MW = 100.115\text{ g/mol}$ vs. Tartaric Acid $MW = 150.09\text{ g/mol}$):** Neutralizing $1.0\text{ g/L}$ Tartaric Acid (or raising pH by $\approx 0.1$ unit) requires $1.33\text{ g/L}$ of $\text{KHCO}_3$.
- **$\text{KHCO}_3$ Combined with Cold Stabilization ($\text{KHT}$ Precipitation):** $1.00\text{ g/L}$ per $1.0\text{ g/L}$ TA reduction.
- **Calcium Carbonate ($\text{CaCO}_3$, $MW = 100.09\text{ g/mol}$):** $0.67\text{ g/L}$ per $1.0\text{ g/L}$ TA reduction.

---

### 3.5 Staggered Nutrient Addition (SNA) & Nitrogen Mass Balance

- $\text{Sugar (g/L)} = \text{Brix} \times 10 \times \text{SG}_0$ ($240.2\text{ g/L}$ at $22^\circ\text{Bx}, \text{SG}_0 = 1.092$).
- **Actual Nitrogen Contributions:**
  - $\text{DAP} = 212\text{ mg N/g}$
  - $\text{Fermaid K} = 100\text{ mg N/g}$
  - $\text{Fermaid O} = 40\text{ mg N/g}$ chemical N ($\approx 120\text{ mg N eq/g}$ organic bio-equivalent)
- **3-Step SNA Protocol (`132 L` Red Liquid Phase):**
  1. **SNA-1 ($\text{SG} = 1.083$, $10\%$ Sugar Drop):** $0.25\text{ g/L}$ Fermaid O ($33.00\text{ g}$).
  2. **SNA-2 ($\text{SG} = 1.070$, $24\%$ Sugar Drop):** $0.25\text{ g/L}$ Fermaid K ($33.00\text{ g}$) + $0.15\text{ g/L}$ DAP ($19.80\text{ g}$) + safe micro-cofactor $\text{ZnSO}_4\cdot 7\text{H}_2\text{O}$ ($0.002\text{ g/L} = 0.26\text{ g}$).
  3. **SNA-3 ($\text{SG} = 1.057$, $38\%$ Sugar Drop):** Strictly $100\%$ Organic Fermaid O at $0.30\text{ g/L}$ ($39.60\text{ g}$), $0\text{ g}$ DAP / Fermaid K.

---

### 3.6 Fermentation Kinetics & Predictive Engine (`src/utils/trackingCalculations.ts`)

- **Blended Velocity Model (No Double-Counting):** Observed velocity ($\text{Vel}_{\text{recent}}$) already embeds the current temperature and substrate state, so `predictFermentationCompletion` blends $70\%$ observed velocity with $30\%$ theoretical Arrhenius/Michaelis-Menten baseline velocity and returns a confidence interval `estimatedDaysRange: { min, max }`.
- **Unified Stage-Aware Cap Temperature Thresholds (Red Active Maceration):**
  - $T < 27.0^\circ\text{C} \implies \text{'normal'}$
  - $27.0 \le T < 28.5^\circ\text{C} \implies \text{'caution'}$
  - $28.5 \le T < 30.0^\circ\text{C} \implies \text{'warning'}$
  - $T \ge 30.0^\circ\text{C} \implies \text{'danger'}$ (and $T \ge 32.0^\circ\text{C} \implies \text{Crisis 1 Thermal Shock}$)
````

## File: tsconfig.json
````json
{
  "compilerOptions": {
    "target": "ES2022",
    "experimentalDecorators": true,
    "useDefineForClassFields": false,
    "module": "ESNext",
    "types": ["vite/client"],
    "lib": [
      "ES2022",
      "DOM",
      "DOM.Iterable"
    ],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "isolatedModules": true,
    "moduleDetection": "force",
    "allowJs": true,
    "jsx": "react-jsx",
    "paths": {
      "@/*": [
        "./*"
      ]
    },
    "allowImportingTsExtensions": true,
    "noEmit": true
  }
}
````

## File: vite.config.ts
````typescript
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';
import {defineConfig} from 'vite';
````
