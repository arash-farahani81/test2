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
  tankId: TankId; tankLabelFa: string;
  doseValue: string; doseUnit: string; compoundFa: string; volumeContextFa: string;
  doseAmountTextFa: string; isCompletedForTank: boolean;
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

