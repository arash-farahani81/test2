# ENOLOGY STUDIO — AI ULTRA DIGEST (LOW-TOKEN ARCHITECTURE & CONTRACTS)
> Generated automatically via `npm run ai:digest`. Share this single file with any AI assistant to provide 100% of data contracts, API signatures, and UI component state wiring.

## 1. Architecture & Agent Protocol (`AGENTS.md`)
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
- **Zero Functionality Loss — Demote, Don't Stack (UI Discipline)**: Preserve 100% of domain logic, calculators, state hooks, and instructional content, but demote secondary explanations into `<details>`, never stack duplicate navigation bars, use `@theme` tokens (`bg-paper`, `bg-surface`, `text-ink`, `text-ink-soft`, `border-line`, `bg-wine`, `text-danger`), and never use `text-[10px]`, `font-black`, or emojis in `.tsx` files.

## 3. Silent Verification Loop (Mandatory)
- After completing edits, DO NOT run verbose `npm run build` or `npm test`.
- Always verify changes by running: `npm run agent:check`
- If `npm run agent:check` passes, update `.agent/TASK_STATE.md` if requested and stop immediately.

## 2. Project Task State (`.agent/TASK_STATE.md`)
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

## 3. Data Models & Zod Schemas (`src/types/tracking.ts` & `src/types/database.ts`)
### `src/types/tracking.ts`
```ts
export type TankId = 'tank-a' | 'tank-b' | 'tank-rose';
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
```
### `src/types/database.ts`
```ts
import { z } from 'zod';
import type { FermentationLogEntry, TankId } from './tracking.ts';
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
export const TankIdSchema = z.enum(['tank-a', 'tank-b', 'tank-rose']);
export const StructuredCompoundTypeSchema = z.enum([
  'kms',
  'bactiless',
  'fermaid_o',
  'fermaid_k',
  'dap',
  'zinc',
  'tannin_red',
  'tannin_white',
  'enzyme',
  'tartaric',
  'khco3',
  'caco3',
  'copper',
  'kht',
  'glycerin',
  'ascorbic',
  'h2o2',
  'yeast',
  'go_ferm',
  'bentonite',
  'other'
]);
export const WineBatchSchema = z.object({
  id: z.string(),
  name: z.string(),
  grapeVariety: z.string(),
  vintageYear: z.number(),
  initialWeightKg: z.number(),
  targetStyle: z.enum(['red', 'rose', 'reserve']),
  status: z.enum(['active_fermentation', 'pressing', 'malolactic', 'aging', 'bottled']),
  startDate: z.string(),
  notes: z.string().optional(),
  isDemo: z.boolean().optional(),
  tankCount: z.union([z.literal(1), z.literal(2)]).optional(),
  sugarSource: z.enum(['refractometer', 'hydrometer']).optional(),
  initialBrix: z.number().optional(),
  initialSG: z.number().optional(),
  initialPH: z.union([z.number(), z.literal('unknown')]).optional(),
  initialTA: z.union([z.number(), z.literal('unknown')]).optional(),
  malicStatus: z.enum(['low', 'medium', 'high', 'unknown']).optional(),
  mlfPolicy: z.enum(['no_mlf', 'spontaneous', 'inoculated']).optional(),
  updatedAtMs: z.number().optional(),
  protocolParamsSnapshot: z.record(z.string(), z.union([z.number(), z.string()])).optional()
});
export const ChemicalAdditionSchema = z.object({
  id: z.string(),
  batchId: z.string(),
  tankId: TankIdSchema,
  timestamp: z.string(),
  stageTitle: z.string(),
  compoundName: z.string(),
  pubchemCid: z.number().optional(),
  amount: z.number(),
  unit: z.enum(['g', 'g/hL', 'mg/L', 'mL', 'kg']),
  purpose: z.string(),
  operatorNote: z.string().optional(),
  lotNumber: z.string().optional(),
  compoundType: StructuredCompoundTypeSchema.optional(),
  referenceVolumeL: z.number().optional(),
  calculatedSO2MgL: z.number().optional(),
  sgAtAddition: z.number().optional(),
  isDemo: z.boolean().optional(),
  isDeleted: z.boolean().optional(),
  milestoneId: z.string().optional(),
  dayNumber: z.number().optional(),
  timestampMs: z.number().optional(),
  updatedAtMs: z.number().optional()
});
export const LabAnalysisRecordSchema = z.object({
  id: z.string(),
  batchId: z.string(),
  tankId: TankIdSchema,
  date: z.string(),
  testType: z.enum([
    'ripper_so2',
    'ta_titration',
    'ph_meter',
    'mlf_chromatography',
    'refractometer_correction',
    'sensory_eval'
  ]),
  targetAnalyte: z.string(),
  pubchemCid: z.number().optional(),
  measuredValue: z.union([z.number(), z.string()]),
  unit: z.string(),
  actionTaken: z.string().optional(),
  notes: z.string().optional(),
  methodReliability: z.enum(['high', 'medium', 'low_red_ripper', 'ascorbic_interference']).optional(),
  malicResult: z.enum(['present', 'partial', 'depleted']).optional(),
  isDemo: z.boolean().optional(),
  isDeleted: z.boolean().optional(),
  dayNumber: z.number().optional(),
  timestampMs: z.number().optional(),
  updatedAtMs: z.number().optional()
});
export const SavedCalculationSchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  calculatorType: z.enum([
    'kms',
    'hydrometer_temp',
    'batch_scaling',
    'yan',
    'tartaric_addition',
    'ph_adjustment',
    'refractometer_correction',
    'dry_ice_cooling',
    'dryness_check',
    'bench_fining',
    'troubleshooting_scenario'
  ]),
  title: z.string(),
  inputs: z.record(z.string(), z.union([z.number(), z.string()])),
  results: z.record(z.string(), z.union([z.number(), z.string()])),
  notes: z.string().optional()
});
export const FermentationLogEntrySchema = z.object({
  id: z.string(),
  tankId: TankIdSchema,
  dayNumber: z.number(),
  dateTime: z.string(),
  timestampMs: z.number().optional(),
  stageTitle: z.string(),
  brix: z.number(),
  sg: z.number(),
  tempCap: z.number(),
  tempRoom: z.number(),
  ph: z.number(),
  ta: z.number().optional(),
  freeSO2: z.number().optional(),
  pigeageDone: z.boolean(),
  pigeageCount: z.number().optional(),
  operationNote: z.string().optional(),
  isTriggerPoint: z.boolean().optional(),
  isBenchmark: z.boolean().optional(),
  tempSample: z.number().optional(),
  measuredSG: z.number().optional(),
  isDemo: z.boolean().optional(),
  isDeleted: z.boolean().optional(),
  photoIds: z.array(z.string()).optional(),
  quickTags: z.array(z.string()).optional(),
  batchId: z.string().optional(),
  updatedAtMs: z.number().optional(),
  phMeasured: z.boolean().optional(),
  taMeasured: z.boolean().optional(),
  freeSO2Measured: z.boolean().optional(),
  tempRoomMeasured: z.boolean().optional()
});
export const EnologyDatabaseExportSchema = z.object({
  version: z.string(),
  exportedAt: z.string(),
  batches: z.array(WineBatchSchema),
  fermentationLogs: z.array(FermentationLogEntrySchema),
  chemicalAdditions: z.array(ChemicalAdditionSchema),
  labAnalyses: z.array(LabAnalysisRecordSchema),
  savedCalculations: z.array(SavedCalculationSchema),
  flexibleProtocolParams: z.record(z.string(), z.union([z.number(), z.string()])).optional()
});
```

## 4. Core Engine API Signatures (`.agent/API_SIGNATURES.md`)
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

## 5. UI Component Wiring & State Skeleton (`src/context/EnologyUiContext.tsx` & `src/components/*.tsx` — JSX Omitted)
### `src/context/EnologyUiContext.tsx` (894 lines)
```ts
// --- Imports ---
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { TankId, WineBatch } from '../types/index.ts';
import { enologyDb } from '../db/enologyDatabase.ts';
// --- Props & Types ---
export type GlobalTankSelection = 'tank-a' | 'tank-b' | 'tank-rose' | 'both-red';
export type AppFiveTabView = 'today' | 'tanks' | 'lab' | 'roadmap' | 'more';
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
export interface EnologyGlossaryItem {
  key: string;
  termFa: string;
  termEn: string;
  shortTooltipFa: string;
  formulaOrRangeFa?: string;
  whyItMattersFa: string;
}
export interface TankSelectionOption {
  id: GlobalTankSelection;
  labelFa: string;
  shortLabelFa: string;
  isCombinedRed?: boolean;
}
export type FontScaleMode = 'normal' | 'large' | 'xlarge';
export type ScalePrecisionGrams = 1 | 0.1 | 0.01;
export interface EnologyUiContextValue {
  // Batch state
  batches: WineBatch[];
  activeBatchId: string;
  activeBatch: WineBatch | undefined;
  setActiveBatchId: (batchId: string) => void;
  tankCount: 1 | 2;
  hasDemoData: boolean;

  // Global tank selection ('tank-a' | 'tank-b' | 'tank-rose' | 'both-red')
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

  // 5-Tab Workspace Navigation
  activeFiveTab: AppFiveTabView;
  setActiveFiveTab: (tab: AppFiveTabView) => void;
  activeTab: AppFiveTabView;
export interface GlossaryTermProps {
  termKey: string;
  labelOverride?: string;
  className?: string;
}
// --- State & Protocol Hooks ---
L403: const [dataVersion, setDataVersion] = useState<number>(0);
L404: const [batches, setBatches] = useState<WineBatch[]>(() => enologyDb.getBatches());
L406: const [activeBatchIdState, setActiveBatchIdState] = useState<string>(() => {
L416: const [rawSelectedTank, setRawSelectedTank] = useState<GlobalTankSelection>(() => {
L432: const [activeFiveTabState, setActiveFiveTabState] = useState<AppFiveTabView>(() => {
L449: const [fontScaleState, setFontScaleState] = useState<FontScaleMode>(() => {
L457: const [scalePrecisionState, setScalePrecisionState] = useState<ScalePrecisionGrams>(() => {
L467: const [labDeepLink, setLabDeepLink] = useState<LabDeepLinkRequest | null>(null);
L468: const [roadmapHighlightStepNumber, setRoadmapHighlightStepNumber] = useState<
L472: const [isQuickLogOpen, setIsQuickLogOpen] = useState<boolean>(false);
L475: const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
L476: const [activeGlossaryKey, setActiveGlossaryKey] = useState<string | null>(null);
```

### `src/components/BandedFermentationChartAndSO2Panel.tsx` (1386 lines)
```ts
// --- Imports ---
import React, { useMemo, useState } from 'react';
import { /* icons */ } from 'lucide-react';
import type { ChemicalAddition, FermentationLogEntry, LabAnalysisRecord, TankId } from '../types/index.ts';
import { enologyDb } from '../db/enologyDatabase.ts';
import { calculateKMS, calculateMolecularSO2, getContinuousTargetFreeSO2ByPH, getEffectiveLiquidVolume } from '../utils/enologyUtils.ts';
import { calculateRecentLogVelocity, compareRealLogsWithBenchmark, getCapTemperatureAlertLevel, predictFermentationCompletion, sortFermentationLogs } from '../utils/trackingCalculations.ts';
import { getEffectiveProtocolPlanForBatch } from '../data/masterProtocolConfig.ts';
import { evaluateRightNowQueue, type RightNowMilestone } from '../utils/rightNowEngine.ts';
import { useEnologyUi } from '../context/EnologyUiContext.tsx';
import { LivingTankVisualTwin } from './LivingTankVisualTwin.tsx';
// --- Props & Types ---
export interface BandedFermentationChartAndSO2PanelProps {
  tankId: TankId;
  logs: FermentationLogEntry[];
  additions: ChemicalAddition[];
  labAnalyses: LabAnalysisRecord[];
  onSelectMilestone?: (milestoneId: string) => void;
}
export interface TimeMachineDaySnapshot {
  dayNumber: number;
  stageTitle: string;
  sg: number;
  benchmarkSG: number;
  sgDeltaVsBenchmark: number;
  tempCap: number;
  ph: number;
  velocityPerDay: number;
}
export interface So2TrajectoryVectorMetrics {
  currentFreeSo2MgL: number;
  targetFreeSo2MgL: number;
  deltaSo2MgL: number;
  currentMolecularMgL: number;
  targetMolecularMgL: number;
  kmsGramsNeeded: number;
  currentX: number;
  targetX: number;
  needsAddition: boolean;
}
// --- State & Protocol Hooks ---
L186: const [selectedMilestoneId, setSelectedMilestoneId] = useState<string | null>(
L189: const [timeMachineDay, setTimeMachineDay] = useState<number | null>(null);
L190: const [visibleLayers, setVisibleLayers] = useState<Array<'sg' | 'temp' | 'so2'>>(['sg', 'so2']);
```

### `src/components/BatchOnboardingWizardModal.tsx` (967 lines)
```ts
// --- Imports ---
import React, { useEffect, useMemo, useState } from 'react';
import { /* icons */ } from 'lucide-react';
import type { WineBatch } from '../types/index.ts';
import { enologyDb } from '../db/enologyDatabase.ts';
import { IDEAL_DEFAULT_PROTOCOL_PARAMS, computeDynamicProtocolPlan, useFlexibleProtocol } from '../data/masterProtocolConfig.ts';
import { brixToSpecificGravity, specificGravityToBrix } from '../utils/trackingCalculations.ts';
import { normalizeEnologyNumericInput } from '../utils/enologyUtils.ts';
import { getCurrentPersianDateTimeStr } from '../utils/persianDate.ts';
import { useEnologyUi } from '../context/EnologyUiContext.tsx';
// --- Props & Types ---
export interface BatchOnboardingWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBatchCreated?: (batch: WineBatch) => void;
}
// --- State & Protocol Hooks ---
L37: const { params, updateParam } = useFlexibleProtocol();
L40: const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
L43: const [batchName, setBatchName] = useState<string>(
L46: const [grapeWeightKg, setGrapeWeightKg] = useState<number>(
L49: const [grapeWeightInput, setGrapeWeightInput] = useState<string>(
L52: const [tankCount, setTankCount] = useState<1 | 2>(2);
L55: const [sugarSource, setSugarSource] = useState<
L58: const [manualBothSugar, setManualBothSugar] = useState<boolean>(false);
L59: const [initialSG, setInitialSG] = useState<number>(1.092);
L60: const [initialSgInput, setInitialSgInput] = useState<string>('1.092');
L61: const [initialBrix, setInitialBrix] = useState<number>(22.0);
L62: const [initialBrixInput, setInitialBrixInput] = useState<string>('22.0');
L65: const [phKnown, setPhKnown] = useState<boolean>(true);
L66: const [initialPHInput, setInitialPHInput] = useState<string>('');
L67: const [taKnown, setTaKnown] = useState<boolean>(true);
L68: const [initialTAInput, setInitialTAInput] = useState<string>('');
L86: const [malicStatus, setMalicStatus] = useState<
L91: const [mlfPolicy, setMlfPolicy] = useState<'no_mlf' | 'spontaneous' | 'inoculated'>(
```

### `src/components/BioscienceDatabaseView.tsx` (1026 lines)
```ts
// --- Imports ---
import React, { useState } from 'react';
import { /* icons */ } from 'lucide-react';
import { PRELOADED_ENOLOGY_COMPOUNDS, PRELOADED_ENOLOGY_PROTEINS, fetchPubChemCompoundLive } from '../data/bioscienceData.ts';
import { enologyDb } from '../db/enologyDatabase.ts';
import { exportDocxReport } from '../utils/exportDocxReport.ts';
import { useEnologyUi } from '../context/EnologyUiContext.tsx';
import { PhotoDiaryAndVintagePanel } from './PhotoDiaryAndVintagePanel.tsx';
import type { PubChemCompoundData, UniProtProteinData } from '../types/database.ts';
import type { TankId } from '../types/tracking.ts';
// --- Props & Types ---
export interface BioscienceDatabaseViewProps {
  onNavigateToCalculators?: () => void;
  onNavigateToTracking?: () => void;
  onNavigateToLabTool?: (testId: string, subTab?: 'calculators-sops' | 'troubleshooting-crises') => void;
  initialActiveTab?: 'chemicals' | 'enzymes' | 'backup';
  hideInternalHeader?: boolean;
}
// --- State & Protocol Hooks ---
L50: const [activeTab, setActiveTab] = useState<'chemicals' | 'enzymes' | 'backup'>(initialActiveTab);
L51: const [exportTankId, setExportTankId] = useState<TankId>('tank-a');
L52: const [categoryFilter, setCategoryFilter] = useState<string>('all');
L53: const [searchQuery, setSearchQuery] = useState('');
L54: const [selectedCompound, setSelectedCompound] = useState<PubChemCompoundData>(
L57: const [selectedProtein, setSelectedProtein] = useState<UniProtProteinData>(
L62: const [liveSearchInput, setLiveSearchInput] = useState('');
L63: const [isSearchingLive, setIsSearchingLive] = useState(false);
L64: const [liveSearchResult, setLiveSearchResult] = useState<Partial<PubChemCompoundData> | null>(null);
L65: const [liveSearchError, setLiveSearchError] = useState<string | null>(null);
L68: const [dbSummary, setDbSummary] = useState(() => enologyDb.getDatabaseSummary());
L69: const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
L70: const [pendingImportJson, setPendingImportJson] = useState<string | null>(null);
L71: const [importPreviewData, setImportPreviewData] = useState<ReturnType<typeof enologyDb.previewDatabaseImport> | null>(null);
L72: const [importMode, setImportMode] = useState<'replace' | 'merge'>('replace');
```

### `src/components/EnologyCalculators.tsx` (7 lines)
```ts
// --- Imports ---
import React from 'react';
import { TestingGuide, type TestingGuideProps } from './TestingGuide.tsx';
// --- Props & Types ---
// (No local interfaces)
// --- State & Protocol Hooks ---
// (Stateless component)
```

### `src/components/FermentationTracker.tsx` (4000 lines)
```ts
// --- Imports ---
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { /* icons */ } from 'lucide-react';
import type { FermentationLogEntry, TankId } from '../types/tracking.ts';
import type { ChemicalAddition, LabAnalysisRecord, StructuredCompoundType } from '../types/database.ts';
import { BandedFermentationChartAndSO2Panel } from './BandedFermentationChartAndSO2Panel.tsx';
import { PhotoDiaryAndVintagePanel } from './PhotoDiaryAndVintagePanel.tsx';
import { exportDocxReport } from '../utils/exportDocxReport.ts';
import { calculateFermentationProgress, calculateAlcoholByVolume, brixToSpecificGravity, specificGravityToBrix, analyzeLogEntryHealth, compareRealLogsWithBenchmark, predictFermentationCompletion, sortFermentationLogs, calculateVelocity } from '../utils/trackingCalculations.ts';
import { evaluateEnologicalScenario } from '../utils/enologyTroubleshooting.ts';
import { calculateDynamicSGTriggers, getTargetFreeSO2ByPH } from '../utils/enologyUtils.ts';
import { enologyDb } from '../db/enologyDatabase.ts';
import { useLocalStorageState } from '../utils/useLocalStorage.ts';
import { RASHA_PROTOCOL } from '../data/protocolData.ts';
import { useFlexibleProtocol, getEffectiveProtocolPlanForBatch } from '../data/masterProtocolConfig.ts';
import { getSmartAdditivePresets, getSmartDailyStagePresets, getSmartLabPresets } from '../data/smartLoggingPresets.ts';
import { useEnologyUi } from '../context/EnologyUiContext.tsx';
import { getCurrentPersianDateTimeStr } from '../utils/persianDate.ts';
// --- Props & Types ---
interface FermentationTrackerProps {
  onNavigateToTestingGuide?: (
    testId?: string,
    subTab?: 'calculators-sops' | 'troubleshooting-crises' | 'saved-history'
  ) => void;
  onDataChanged?: () => void;
}
type LogbookTab = 'daily-logs' | 'chemical-additions' | 'lab-analyses' | 'sensory-eval';
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
// --- State & Protocol Hooks ---
L111: const { params: flexParams, plan: flexPlan, isModifiedFromIdeal } = useFlexibleProtocol();
L116: const [showFlexibleCustomizer, setShowFlexibleCustomizer] = useState<boolean>(false);
L118: const [tankId, setTankId] = useLocalStorageState<TankId>('enology_tracking_selected_tank', effectiveSingleTankId || 'tank-a');
L135: const [logs, setLogs] = useState<FermentationLogEntry[]>(() =>
L138: const [additions, setAdditions] = useState<ChemicalAddition[]>(() =>
L141: const [labAnalyses, setLabAnalyses] = useState<LabAnalysisRecord[]>(() =>
L152: const [showAddModal, setShowAddModal] = useState(false);
L153: const [showAddChemicalModal, setShowAddChemicalModal] = useState(false);
L154: const [showAddLabModal, setShowAddLabModal] = useState(false);
L157: const [selectedLogId, setSelectedLogId] = useLocalStorageState<string | null>('enology_tracking_selected_log_id', null);
L158: const [activeChart, setActiveChart] = useLocalStorageState<'sg' | 'temp' | 'ph' | 'all'>('enology_tracking_active_chart', 'sg');
L159: const [logDisplayMode, setLogDisplayMode] = useLocalStorageState<'all' | 'real' | 'benchmark'>('enology_log_display_mode', 'all');
L160: const [toastMessage, setToastMessage] = useState<string | null>(null);
L163: const [localShowAllDetails, setLocalShowAllDetails] = useLocalStorageState<boolean>('enology_advisor_show_all', false);
L167: const [expandedStatusRows, setExpandedStatusRows] = useState<{
L186: const [logbookTab, setLogbookTab] = useLocalStorageState<LogbookTab>('enology_logbook_active_tab', 'daily-logs');
L187: const [filterAdditionsByTank, setFilterAdditionsByTank] = useLocalStorageState<boolean>('enology_filter_additions_tank', true);
L188: const [filterLabByTank, setFilterLabByTank] = useLocalStorageState<boolean>('enology_filter_lab_tank', true);
L191: const [simTemp, setSimTemp] = useLocalStorageState<number>('enology_prediction_sim_temp', 24.0);
L192: const [targetSGChoice, setTargetSGChoice] = useLocalStorageState<number>('enology_prediction_target_sg', tankId === 'tank-rose' ? 0.991 :...
L195: const [formDate, setFormDate] = useLocalStorageState<string>(
L204: const [formDay, setFormDay] = useLocalStorageState<number>('enology_form_day', 1);
L205: const [formStage, setFormStage] = useLocalStorageState<string>('enology_form_stage', '');
L206: const [formBrix, setFormBrix] = useLocalStorageState<number>('enology_form_brix', 20.0);
L207: const [formSG, setFormSG] = useLocalStorageState<number>('enology_form_sg', 1.083);
L208: const [formTempCap, setFormTempCap] = useLocalStorageState<number>('enology_form_temp_cap', 23.0);
L209: const [formTempRoom, setFormTempRoom] = useLocalStorageState<number>('enology_form_temp_room', 21.0);
L210: const [formPH, setFormPH] = useLocalStorageState<number>('enology_form_ph', 3.52);
L211: const [formTA, setFormTA] = useLocalStorageState<number>('enology_form_ta', 6.8);
L212: const [formFreeSO2, setFormFreeSO2] = useLocalStorageState<number | undefined>('enology_form_free_so2', undefined);
L213: const [formPigeage, setFormPigeage] = useLocalStorageState<boolean>('enology_form_pigeage', true);
L214: const [formPigeageCount, setFormPigeageCount] = useLocalStorageState<number>('enology_form_pigeage_count', 3);
L215: const [formNote, setFormNote] = useLocalStorageState<string>('enology_form_note', '');
L216: const [formIsTrigger, setFormIsTrigger] = useLocalStorageState<boolean>('enology_form_is_trigger', true);
L217: const [autoRecordTriggerAddition, setAutoRecordTriggerAddition] = useState<boolean>(true);
L218: const [formPhTouched, setFormPhTouched] = useState(false);
L219: const [formTaTouched, setFormTaTouched] = useState(false);
L222: const [selectedChemPresetId, setSelectedChemPresetId] = useState<string>('fermaid-o-sna1');
L223: const [chemTankId, setChemTankId] = useState<TankId>(tankId);
L224: const [chemTimestamp, setChemTimestamp] = useState<string>('');
L225: const [chemStageTitle, setChemStageTitle] = useState<string>('تغذیه مرحله‌ای / اصلاح شیمیایی');
L226: const [chemCompoundName, setChemCompoundName] = useState<string>('Fermaid O (نیتروژن ارگانیک)');
L227: const [chemCompoundType, setChemCompoundType] = useState<StructuredCompoundType>('fermaid_o');
L228: const [chemReferenceVolumeL, setChemReferenceVolumeL] = useState<number>(defaultRefVol);
L232: const [chemPubchemCid, setChemPubchemCid] = useState<number | undefined>(undefined);
L233: const [chemAmount, setChemAmount] = useState<number>(33.0);
L234: const [chemUnit, setChemUnit] = useState<'g' | 'g/hL' | 'mg/L' | 'mL' | 'kg'>('g');
L235: const [chemPurpose, setChemPurpose] = useState<string>('تامین اسیدهای آمینه ارگانیک مخمر');
L236: const [chemNote, setChemNote] = useState<string>('');
L237: const [chemLotNumber, setChemLotNumber] = useState<string>('');
L238: const [pendingAdditionConfirm, setPendingAdditionConfirm] = useState<boolean>(false);
L239: const [undoAdditionId, setUndoAdditionId] = useState<string | null>(null);
L240: const [undoDeletedRecord, setUndoDeletedRecord] = useState<{
L249: const [selectedDailyPresetId, setSelectedDailyPresetId] = useState<string>('');
L250: const [selectedLabPresetId, setSelectedLabPresetId] = useState<string>('lab-ripper-so2');
L253: const [labTankId, setLabTankId] = useState<TankId>(tankId);
L254: const [labDate, setLabDate] = useState<string>('');
L255: const [labTestType, setLabTestType] = useState<LabAnalysisRecord['testType']>('ripper_so2');
L256: const [labAnalyte, setLabAnalyte] = useState<string>('سولفیت آزاد (Free SO2)');
L257: const [labValue, setLabValue] = useState<string>('32');
L258: const [labUnit, setLabUnit] = useState<string>('mg/L (ppm)');
L259: const [labActionTaken, setLabActionTaken] = useState<string>('در محدوده ایمن؛ نیازی به تزریق KMS نیست');
L260: const [labNotes, setLabNotes] = useState<string>('');
L263: const [sensoryClarity, setSensoryClarity] = useState<number>(5);
L264: const [sensoryAroma, setSensoryAroma] = useState<number>(4);
L265: const [sensoryAcidity, setSensoryAcidity] = useState<number>(4);
L266: const [sensoryTannin, setSensoryTannin] = useState<number>(4);
L267: const [sensoryOverall, setSensoryOverall] = useState<number>(4);
L268: const [sensoryFaults, setSensoryFaults] = useState<string[]>([]);
L269: const [sensoryNotes, setSensoryNotes] = useState<string>('');
```

### `src/components/FlexibleProtocolCustomizerBar.tsx` (343 lines)
```ts
// --- Imports ---
import React, { useState } from 'react';
import { /* icons */ } from 'lucide-react';
import { useFlexibleProtocol, FLEXIBLE_PARAM_METADATA, IDEAL_DEFAULT_PROTOCOL_PARAMS, type DynamicProtocolPlan, type FlexibleProtocolParams } from '../data/masterProtocolConfig.ts';
// --- Props & Types ---
interface FlexibleProtocolCustomizerBarProps {
  onSyncToCalculators?: (plan: DynamicProtocolPlan) => void;
  defaultExpanded?: boolean;
  compact?: boolean;
}
// --- State & Protocol Hooks ---
L42: const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);
L43: const [activeCategory, setActiveCategory] = useState<
L46: const [syncSuccess, setSyncSuccess] = useState(false);
```

### `src/components/Header.tsx` (653 lines)
```ts
// --- Imports ---
import React, { useEffect, useRef, useState } from 'react';
import { /* icons */ } from 'lucide-react';
import { enologyDb } from '../db/enologyDatabase.ts';
import { useEnologyUi, type AppFiveTabView, type GlobalTankSelection } from '../context/EnologyUiContext.tsx';
import { useLocalStorageState } from '../utils/useLocalStorage.ts';
import { getGlobalActiveTimersSnapshot, type WorkshopTimerConfig } from './ProcessRoadmapTracker.tsx';
// --- Props & Types ---
export type MainPillarView = 'roadmap' | 'tracking' | 'testing-guide' | 'protocol';
interface HeaderProps {
  activeView?: MainPillarView;
  onViewChange?: (view: MainPillarView) => void;
  activeFiveTab?: AppFiveTabView;
  onFiveTabChange?: (tab: AppFiveTabView) => void;
  cellarMode?: boolean;
  onToggleCellarMode?: () => void;
}
// --- State & Protocol Hooks ---
L65: const [timerRunning] = useLocalStorageState<Record<string, boolean>>(
L69: const [timerElapsed, setTimerElapsed] = useLocalStorageState<
L72: const [customTimers] = useLocalStorageState<WorkshopTimerConfig[]>(
L76: const [timerDurations] = useLocalStorageState<Record<string, number>>(
L153: const [dbCount, setDbCount] = useState<number>(
L156: const [backupHealth, setBackupHealth] = useState(() =>
L159: const [storageDiag, setStorageDiag] = useState(() =>
L162: const [storageErrorMsg, setStorageErrorMsg] = useState<string | null>(
L165: const [isStoragePersisted, setIsStoragePersisted] = useState<boolean | null>(
L168: const [showBackupPopover, setShowBackupPopover] = useState(false);
L169: const [internalCellarMode, setInternalCellarMode] = useState<boolean>(() => {
```

### `src/components/InteractiveLabWizardsPanel.tsx` (984 lines)
```ts
// --- Imports ---
import React, { useEffect, useMemo, useState } from 'react';
import { /* icons */ } from 'lucide-react';
import type { LabAnalysisRecord, TankId } from '../types/index.ts';
import { enologyDb } from '../db/enologyDatabase.ts';
import { calculateFreeSO2Ripper, calculateMolecularSO2, calculateTitratableAcidity, correctHydrometer, getContinuousTargetFreeSO2ByPH } from '../utils/enologyUtils.ts';
import { useEnologyUi } from '../context/EnologyUiContext.tsx';
import { getCurrentPersianDateTimeStr } from '../utils/persianDate.ts';
// --- Props & Types ---
export interface InteractiveLabWizardsPanelProps {
  onAnalysisSaved?: (record: LabAnalysisRecord) => void;
  selectedWizardOverride?: 'ripper_so2' | 'ph_meter' | 'ta_titration' | 'mlf_chromatography' | 'hydrometer_temp';
}
type LabWizardId =
// --- State & Protocol Hooks ---
L68: const [activeWizard, setActiveWizard] = useState<LabWizardId>(
L71: const [tankId, setTankId] = useState<TankId>(
L74: const [step, setStep] = useState<number>(1);
L75: const [savedBannerText, setSavedBannerText] = useState<string | null>(null);
L95: const [hasAscorbic, setHasAscorbic] = useState<boolean>(false);
L96: const [ripperTimerSec, setRipperTimerSec] = useState<number>(15);
L97: const [ripperTimerRunning, setRipperTimerRunning] = useState<boolean>(false);
L98: const [iodineMl, setIodineMl] = useState<number>(1.25);
L99: const [ripperPH, setRipperPH] = useState<number>(3.52);
L102: const [measuredPH, setMeasuredPH] = useState<number>(3.52);
L105: const [naohMl, setNaohMl] = useState<number>(4.5);
L108: const [malicResult, setMalicResult] = useState<
L113: const [hydroCalTemp, setHydroCalTemp] = useState<20 | 15.5>(20);
L114: const [hydroMeasuredSG, setHydroMeasuredSG] = useState<number>(1.083);
L115: const [hydroSampleTempC, setHydroSampleTempC] = useState<number>(24.0);
```

### `src/components/LivingTankVisualTwin.tsx` (620 lines)
```ts
// --- Imports ---
import React, { useMemo } from 'react';
import { Activity, Check, Droplets, Thermometer } from 'lucide-react';
import type { FermentationLogEntry, TankId } from '../types/index.ts';
import { enologyDb } from '../db/enologyDatabase.ts';
import { getEffectiveProtocolPlanForBatch, useFlexibleProtocol, type DynamicProtocolPlan } from '../data/masterProtocolConfig.ts';
import { calculateAlcoholByVolume, calculateRecentLogVelocity, getCapTemperatureAlertLevel, sortFermentationLogs } from '../utils/trackingCalculations.ts';
import { useEnologyUi } from '../context/EnologyUiContext.tsx';
// --- Props & Types ---
export interface VesselTwinState {
  tankId: TankId;
  labelFa: string;
  shortLabelFa: string;
  isRose: boolean;
  currentSG: number;
  tempCap: number;
  dayNumber: number;
  abvPct: number;
  currentLiquidVolumeL: number;
  grossVolumeL: number;
  maxCapacityL: number;
  fillRatio: number;
  hasPomaceCap: boolean;
  capHeightRatio: number;
  liquidColorHex: string;
  liquidHighlightHex: string;
  colorStageFa: string;
  velocityPerDay: number;
  bubbleCount: number;
  bubbleDurationSec: number;
  airlockBubbleIntervalSec: number;
  sineWaveAmplitudePx: number;
  activityLabelFa: string;
  tempAlert: 'normal' | 'caution' | 'warning' | 'danger';
// --- State & Protocol Hooks ---
L269: const { plan } = useFlexibleProtocol();
```

### `src/components/MasterProtocolView.tsx` (1207 lines)
```ts
// --- Imports ---
import React, { useMemo, useState } from 'react';
import { /* icons */ } from 'lucide-react';
import { RASHA_PROTOCOL } from '../data/protocolData.ts';
import { useFlexibleProtocol, getEffectiveProtocolPlanForBatch } from '../data/masterProtocolConfig.ts';
import { useEnologyUi } from '../context/EnologyUiContext.tsx';
import { useLocalStorageState } from '../utils/useLocalStorage.ts';
import { exportDocxReport } from '../utils/exportDocxReport.ts';
import { enologyDb } from '../db/enologyDatabase.ts';
import { BioscienceDatabaseView } from './BioscienceDatabaseView.tsx';
// --- Props & Types ---
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
// --- State & Protocol Hooks ---
L56: const [pillarSubView, setPillarSubView] = useLocalStorageState<Pillar4SubView>(
L60: const [activeTab, setActiveTab] = useLocalStorageState<
L63: const [activeSubTab, setActiveSubTab] = useLocalStorageState<'form1' | 'form2' | 'form3' | 'form4'>('enology_protocol_subtab', 'form1');
L64: const [searchMaterial, setSearchMaterial] = useState('');
L65: const [downloadSuccess, setDownloadSuccess] = useState(false);
L74: const [initBrix, setInitBrix] = useLocalStorageState<string>('enology_init_brix', '22.0');
L75: const [initSG, setInitSG] = useLocalStorageState<string>('enology_init_sg', '1.092');
L76: const [initPH, setInitPH] = useLocalStorageState<string>('enology_init_ph', '3.52');
L77: const [initTA, setInitTA] = useLocalStorageState<string>('enology_init_ta', '6.8');
L78: const [useDynamicBomMode, setUseDynamicBomMode] = useLocalStorageState<boolean>(
L84: const { params: flexParams, plan: flexPlan } = useFlexibleProtocol();
```

### `src/components/PhotoDiaryAndVintagePanel.tsx` (2023 lines)
```ts
// --- Imports ---
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { /* icons */ } from 'lucide-react';
import type { ChemicalAddition, FermentationLogEntry, TankId } from '../types/index.ts';
import { enologyDb } from '../db/enologyDatabase.ts';
import { calculateAlcoholByVolume, sortFermentationLogs } from '../utils/trackingCalculations.ts';
import { useLocalStorageState } from '../utils/useLocalStorage.ts';
import { useEnologyUi } from '../context/EnologyUiContext.tsx';
import { getCurrentPersianDateTimeStr } from '../utils/persianDate.ts';
// --- Props & Types ---
export interface PhotoDiaryAndVintagePanelProps {
  tankId?: TankId;
}
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
export type TastingCheckpointKey =
export interface ScheduledTastingRecord {
  checkpoint: TastingCheckpointKey;
  appearance: number; // 1 to 5
  aroma: number; // 1 to 5
  palate: number; // 1 to 5
  acidity?: number; // 1 to 5
  tannin?: number; // 1 to 5
  body?: number; // 1 to 5
  balance?: number; // 1 to 5
  wineColorHex?: string;
  wineColorLabelFa?: string;
  quickTags: string[];
  note: string;
  updatedAtFa: string;
}
export interface WineGlassLegItem {
  id: number;
  x: number;
  topY: number;
  bottomY: number;
  delaySec: number;
}
export interface WineGlassVisualMetrics {
  wineColorHex: string;
  clampedBody: number;
  clampedAbv: number;
  legsCount: number;
  legStrokeWidth: number;
  legFallDurationSec: number;
  viscosityLabelFa: string;
  legs: WineGlassLegItem[];
}
export interface VintagePassportSummary {
  batchNameFa: string;
  vintageYear: number;
  varietyAndOriginFa: string;
  tankLabelFa: string;
  initialSG: string;
  finalSG: string;
  abvPct: string;
  fermentationDays: number;
  finalPh: string;
  finalTaGL: string;
  totalSo2AddedMgL: number;
  oakProfileFa: string;
  bottles750mlCount: number;
  sensoryScoreOutOf5: string;
  wineColorHex: string;
  wineColorLabelFa: string;
}
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
// --- State & Protocol Hooks ---
L746: const [photos, setPhotos] = useState<PhotoDiaryEntry[]>([]);
L747: const [photoError, setPhotoError] = useState<string | null>(null);
L748: const [photoCategory, setPhotoCategory] = useState<
L751: const [photoNote, setPhotoNote] = useState<string>('');
L752: const [photoTags, setPhotoTags] = useState<string[]>([]);
L753: const [isCompressing, setIsCompressing] = useState<boolean>(false);
L762: const [tastingsByCheckpoint, setTastingsByCheckpoint] = useLocalStorageState<
L777: const [historicalVintages, setHistoricalVintages] = useLocalStorageState<
L796: const [visitCount, setVisitCount] = useLocalStorageState<number>(
L800: const [pwaDismissed, setPwaDismissed] = useLocalStorageState<boolean>(
L804: const [calendarStartDate, setCalendarStartDate] = useState<string>(() =>
L1003: const [showVintagePassport, setShowVintagePassport] = useState(false);
L1004: const [passportCopied, setPassportCopied] = useState(false);
```

### `src/components/ProcessRoadmapTracker.tsx` (2086 lines)
```ts
// --- Imports ---
import React, { useState, useEffect } from 'react';
import { /* icons */ } from 'lucide-react';
import { useLocalStorageState } from '../utils/useLocalStorage.ts';
import { enologyDb } from '../db/enologyDatabase.ts';
import { useFlexibleProtocol, type DynamicProtocolPlan } from '../data/masterProtocolConfig.ts';
import { useEnologyUi } from '../context/EnologyUiContext.tsx';
import { getCurrentPersianDateTimeStr } from '../utils/persianDate.ts';
import { normalizeEnologyNumericInput } from '../utils/enologyUtils.ts';
import { QuickTenSecondLogModal } from './QuickTenSecondLogModal.tsx';
import type { TankId, FermentationLogEntry } from '../types/tracking.ts';
import type { ChemicalAddition, LabAnalysisRecord } from '../types/database.ts';
import { ZERO_TO_HUNDRED_STEPS, getStepLabTools, type ProcessStep, type StepLabToolLink } from "../data/roadmapStepsData.ts";
import { getSmartAdditivePresets } from '../data/smartLoggingPresets.ts';
// --- Props & Types ---
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
export interface GlobalActiveTimerItem {
  id: string;
  title: string;
  stepIds: number[];
  mode: 'countdown' | 'stopwatch';
  elapsedSec: number;
  totalDurationSec: number;
  remainingSec: number;
  formattedTime: string;
  isCompletedCountdown: boolean;
}
// --- State & Protocol Hooks ---
L329: const { params: flexParams, plan: flexPlan, isModifiedFromIdeal } = useFlexibleProtocol();
L330: const [showFlexibleCustomizer, setShowFlexibleCustomizer] = useState<boolean>(false);
L331: const [showTimerHub, setShowTimerHub] = useState<boolean>(false);
L332: const [isQuickLogModalOpen, setIsQuickLogModalOpen] = useState<boolean>(false);
L333: const [rightNowRefreshKey, setRightNowRefreshKey] = useState<number>(0);
L341: const [anchorTime, setAnchorTime] = useLocalStorageState<string>(`enology_day0_anchor_time${batchKeySuffix}`, '14:30');
L342: const [saigneeOffsetHours, setSaigneeOffsetHours] = useLocalStorageState<number>(`enology_day0_saignee_offset_hours${batchKeySuffix}`, 3.0);
L343: const [enzymeOffsetHours, setEnzymeOffsetHours] = useLocalStorageState<number>(`enology_day0_enzyme_offset_hours${batchKeySuffix}`, 7.5);
L346: const [customTimers, setCustomTimers] = useLocalStorageState<WorkshopTimerConfig[]>('enology_custom_workshop_timers', []);
L347: const [newCustomTitle, setNewCustomTitle] = useState('');
L348: const [newCustomMins, setNewCustomMins] = useState(15);
L349: const [newCustomStepId, setNewCustomStepId] = useState(1);
L352: const [timerDurations, setTimerDurations] = useLocalStorageState<
L360: const [timerElapsed, setTimerElapsed] = useLocalStorageState<Record<string, number>>('enology_timer_elapsed_v1', {});
L361: const [timerRunning, setTimerRunning] = useLocalStorageState<Record<string, boolean>>('enology_timer_running_v1', {});
L362: const [timerChimed, setTimerChimed] = useState<Record<string, boolean>>({});
L527: const [currentStepId, setCurrentStepId] = useLocalStorageState<number>(`enology_active_roadmap_step${batchKeySuffix}`, 1);
L528: const [completedSteps, setCompletedSteps] = useLocalStorageState<number[]>(`enology_completed_roadmap_steps${batchKeySuffix}`, []);
L537: const [filterPhase, setFilterPhase] = useState<number | 'all'>(() => activePhaseNumber);
L538: const [searchQuery, setSearchQuery] = useState('');
L539: const [toastMessage, setToastMessage] = useState<string | null>(null);
L540: const [focusedStepHaloNumber, setFocusedStepHaloNumber] = useState<
L567: const [quickTankState, setQuickTankState] = useState<TankId>(effectiveSingleTankId);
L580: const [quickDay, setQuickDay] = useState<number>(1);
L581: const [quickSG, setQuickSG] = useState<number>(1.083);
L582: const [quickBrix, setQuickBrix] = useState<number>(20.0);
L583: const [quickTempCap, setQuickTempCap] = useState<number>(23.0);
L584: const [quickTempRoom, setQuickTempRoom] = useState<number>(21.0);
L585: const [quickPH, setQuickPH] = useState<number>(3.52);
L586: const [quickTA, setQuickTA] = useState<number>(6.8);
L587: const [quickPhTouched, setQuickPhTouched] = useState<boolean>(false);
L588: const [quickTaTouched, setQuickTaTouched] = useState<boolean>(false);
L589: const [quickNote, setQuickNote] = useState<string>('');
L592: const [selectedRoadmapChemPresetId, setSelectedRoadmapChemPresetId] = useState<string>('');
L593: const [chemName, setChemName] = useState<string>('متابی‌سولفیت پتاسیم (KMS)');
L594: const [chemAmount, setChemAmount] = useState<string>('6.52g');
L595: const [chemPurpose, setChemPurpose] = useState<string>('کنترل میکروبی و آنتی‌اکسیدانی اولیه');
```

### `src/components/QuickTenSecondLogModal.tsx` (2337 lines)
```ts
// --- Imports ---
import React, { useEffect, useMemo, useState } from 'react';
import { /* icons */ } from 'lucide-react';
import type { ChemicalAddition, FermentationLogEntry, LabAnalysisRecord, StructuredCompoundType, TankId } from '../types/index.ts';
import { enologyDb } from '../db/enologyDatabase.ts';
import { calculateRefractometerCorrection, correctHydrometer, normalizeEnologyNumericInput } from '../utils/enologyUtils.ts';
import { detectQuickLogTypoShield, predictFermentationCompletion, sortFermentationLogs, specificGravityToBrix } from '../utils/trackingCalculations.ts';
import { evaluateRightNowQueue } from '../utils/rightNowEngine.ts';
import { useLocalStorageState } from '../utils/useLocalStorage.ts';
import { getEffectiveProtocolPlanForBatch, useFlexibleProtocol } from '../data/masterProtocolConfig.ts';
import { getCurrentPersianDateTimeStr } from '../utils/persianDate.ts';
import { resolveTargetTankIds, useEnologyUi, type GlobalTankSelection } from '../context/EnologyUiContext.tsx';
// --- Props & Types ---
export type QuickSheetPresetMode = 'measurement' | 'addition' | 'lab';
export interface HydrometerCylinderMetrics {
  clampedSG: number;
  normalizedRatio: number;
  stemOffsetY: number;
  meniscusY: number;
  nextStationMarkerY: number | null;
  liquidColorHex: string;
  vernierTicks: Array<{
    sg: number;
    xPct: number;
    isMajor: boolean;
    isMedium: boolean;
  }>;
}
export interface QuickTenSecondLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTankId?: TankId;
  initialMode?: QuickSheetPresetMode;
  onLogSaved?: (savedEntry: FermentationLogEntry) => void;
  inlineMode?: boolean;
}
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
// --- State & Protocol Hooks ---
L291: const { plan } = useFlexibleProtocol();
L301: const [mode, setMode] = useState<QuickSheetPresetMode>(initialMode);
L302: const [tankSelection, setTankSelection] = useState<GlobalTankSelection>(
L305: const [calibrationTemp, setCalibrationTemp] = useLocalStorageState<20 | 15.5>(
L319: const [rawSGInput, setRawSGInput] = useState<string>('');
L320: const [lastSG, setLastSG] = useState<number>(1.083);
L321: const [tempSample, setTempSample] = useState<number>(20);
L322: const [tempCap, setTempCap] = useState<number>(23.0);
L323: const [tempRoom, setTempRoom] = useState<number>(21.0);
L324: const [tempRoomInput, setTempRoomInput] = useState<string>('21');
L325: const [pigeageDone, setPigeageDone] = useState<boolean>(true);
L328: const [openPhTaSection, setOpenPhTaSection] = useState<boolean>(false);
L329: const [openFreeSo2Section, setOpenFreeSo2Section] = useState<boolean>(false);
L330: const [openRefractSection, setOpenRefractSection] = useState<boolean>(false);
L331: const [openTagsNoteSection, setOpenTagsNoteSection] = useState<boolean>(false);
L333: const [phInput, setPhInput] = useState<string>('3.52');
L334: const [taInput, setTaInput] = useState<string>('');
L335: const [freeSo2Input, setFreeSo2Input] = useState<string>('');
L336: const [refractBrixInput, setRefractBrixInput] = useState<string>('');
L337: const [selectedTags, setSelectedTags] = useState<string[]>([]);
L338: const [operationNote, setOperationNote] = useState<string>('');
L341: const [hasExplicitPhInput, setHasExplicitPhInput] = useState<boolean>(false);
L342: const [hasExplicitTaInput, setHasExplicitTaInput] = useState<boolean>(false);
L343: const [hasExplicitSo2Input, setHasExplicitSo2Input] = useState<boolean>(false);
L350: const [rawAdditionAmount, setRawAdditionAmount] = useState<string>('');
L351: const [additionLotNumber, setAdditionLotNumber] = useState<string>('');
L352: const [additionNote, setAdditionNote] = useState<string>('');
L357: const [rawLabValue, setRawLabValue] = useState<string>('');
L358: const [labNote, setLabNote] = useState<string>('');
```

### `src/components/RightNowActionCenter.tsx` (1831 lines)
```ts
// --- Imports ---
import React, { useEffect, useMemo, useState } from 'react';
import { /* icons */ } from 'lucide-react';
import type { ChemicalAddition, StructuredCompoundType, TankId } from '../types/index.ts';
import { enologyDb } from '../db/enologyDatabase.ts';
import { useFlexibleProtocol } from '../data/masterProtocolConfig.ts';
import { calculateStockSolutionPlan, type ScalePrecisionGrams, type StockCompoundCategory } from '../utils/enologyUtils.ts';
import { sortFermentationLogs } from '../utils/trackingCalculations.ts';
import { evaluateBottlingReadinessGate, evaluateDeadlineCountdowns, evaluateRightNowQueue, type RightNowMilestone } from '../utils/rightNowEngine.ts';
import { useLocalStorageState as useLocalStorage } from '../utils/useLocalStorage.ts';
import { GlossaryTerm, useEnologyUi, type GlobalTankSelection } from '../context/EnologyUiContext.tsx';
import { BatchOnboardingWizardModal } from './BatchOnboardingWizardModal.tsx';
import { LivingTankVisualTwin } from './LivingTankVisualTwin.tsx';
import { EngravedWaxSealStamp } from './PhotoDiaryAndVintagePanel.tsx';
// --- Props & Types ---
export interface RightNowActionCenterProps {
  activeTankId?: TankId;
  onTankChange?: (tankId: TankId) => void;
  onDataChanged?: () => void;
  onOpenQuickLogModal?: () => void;
  compact?: boolean;
}
interface PendingConfirmSession {
  milestone: RightNowMilestone;
  targetTankIds: TankId[];
  additions: Array<Omit<ChemicalAddition, 'id'>>;
  calculatedAmounts: number[];
  explicitAdditionConfirmed: boolean;
  overrideOverBudgetConfirmed: boolean;
}
interface UndoSession {
  milestoneTitleFa: string;
  createdAdditionIds: string[];
  addedStepIds: number[];
  expiresAtMs: number;
  remainingSec: number;
}
// --- State & Protocol Hooks ---
L98: const { plan } = useFlexibleProtocol();
L120: const [refreshTick, setRefreshTick] = useState(0);
L144: const [showLayer2Why, setShowLayer2Why] = useState(false);
L145: const [showLayer3Science, setShowLayer3Science] = useState(false);
L146: const [showAllDeadlinesToggle, setShowAllDeadlinesToggle] = useState(false);
L147: const [skippingMilestoneId, setSkippingMilestoneId] = useState<string | null>(
L150: const [skipReasonInput, setSkipReasonInput] = useState('');
L153: const [undoSession, setUndoSession] = useState<UndoSession | null>(null);
L154: const [showBottlingGate, setShowBottlingGate] = useState(false);
L155: const [expandedBottlingWhyId, setExpandedBottlingWhyId] = useState<
L158: const [riskOverrideReason, setRiskOverrideReason] = useState('');
L159: const [bottlingUnlockedNotice, setBottlingUnlockedNotice] = useState(false);
L160: const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
L161: const [confirmingRealBatchReset, setConfirmingRealBatchReset] = useState(false);
```

### `src/components/TestingGuide.tsx` (4603 lines)
```ts
// --- Imports ---
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { /* icons */ } from 'lucide-react';
import { enologyDb } from '../db/enologyDatabase.ts';
import type { SavedCalculation } from '../types/database.ts';
import { useLocalStorageState } from '../utils/useLocalStorage.ts';
import { evaluateEnologicalScenario } from '../utils/enologyTroubleshooting.ts';
import { RASHA_PROTOCOL } from '../data/protocolData.ts';
import { useFlexibleProtocol, computeDynamicProtocolPlan, type DynamicProtocolPlan } from '../data/masterProtocolConfig.ts';
import { InteractiveLabWizardsPanel } from './InteractiveLabWizardsPanel.tsx';
import { useEnologyUi } from '../context/EnologyUiContext.tsx';
import { calculateTitratableAcidity, calculateTartaricAddition, calculateKHCO3Deacidification, calculateDeacidificationOptions, calculateFreeSO2Ripper, calculateMolecularSO2, correctHydrometer, calculateKMS, calculateRefractometerCorrection, calculateSNAAmounts, calculateBenchFiningGrams, calculateCoolingDryIceKg, getEffectiveLiquidVolume, isAlreadyLiquidVolume, getTargetFreeSO2ByPH, calculateDynamicSGTriggers, calculateH2O2SulfiteRemoval, estimateAcidOrBaseFromPHShift, calculateStagedH2O2Plan, calculateStockSolutionPlan, computeGraduatedSyringeMetrics, buildCalculatorDirectAdditions, type CalculatorDirectDoseKind } from '../utils/enologyUtils.ts';
import { getCurrentPersianDateTimeStr } from '../utils/persianDate.ts';
// --- Props & Types ---
export type LabHubSubTab = 'calculators-sops' | 'troubleshooting-crises' | 'saved-history';
export interface TestingGuideProps {
  onNavigateToTracking?: () => void;
  initialSelectedTest?: string;
  initialActiveSubTab?: LabHubSubTab;
}
// --- State & Protocol Hooks ---
L238: const [activeSubTab, setActiveSubTab] = useState<LabHubSubTab>(initialActiveSubTab);
L239: const [selectedFilter, setSelectedFilter] = useState<string>(() =>
L242: const [focusedHaloTestId, setFocusedHaloTestId] = useState<string | null>(null);
L243: const [selectedWizardOverride, setSelectedWizardOverride] = useState<
L246: const [savedCalculations, setSavedCalculations] = useState<SavedCalculation[]>(() =>
L249: const [toastMessage, setToastMessage] = useState<string | null>(null);
L251: const [ledgerUndoToast, setLedgerUndoToast] = useState<{
L256: const [showAllTsAlerts, setShowAllTsAlerts] = useState<boolean>(false);
L257: const [expandedTsScienceIds, setExpandedTsScienceIds] = useState<Record<number, boolean>>({});
L337: const [expandedTests, setExpandedTests] = useState<Record<string, boolean>>({
L391: const { params: flexParams, plan: flexPlan } = useFlexibleProtocol();
L410: const [hydroMeasuredSG, setHydroMeasuredSG] = useLocalStorageState<number>('enology_calc_hydro_sg', 1.006);
L411: const [hydroTemp, setHydroTemp] = useLocalStorageState<number>('enology_calc_hydro_temp', 28);
L412: const [refractOrigBrix, setRefractOrigBrix] = useLocalStorageState<number>('enology_calc_refract_orig_brix', 22);
L413: const [refractReadingBrix, setRefractReadingBrix] = useLocalStorageState<number>('enology_calc_refract_curr_brix', 11.5);
L458: const [taNaOHVol, setTaNaOHVol] = useLocalStorageState<number>('enology_calc_ta_naoh_vol', 4.2);
L459: const [taNaOHNorm, setTaNaOHNorm] = useLocalStorageState<number>('enology_calc_ta_naoh_norm', 0.1);
L460: const [taSampleVol, setTaSampleVol] = useLocalStorageState<number>('enology_calc_ta_sample_vol', 5);
L461: const [taTarget, setTaTarget] = useLocalStorageState<number>('enology_calc_ta_target', 6.5);
L462: const [taBatchVolume, setTaBatchVolume] = useLocalStorageState<number>('enology_calc_ta_batch_vol', 132);
L463: const [taUnpressedMash, setTaUnpressedMash] = useLocalStorageState<boolean>('enology_calc_ta_unpressed', false);
L501: const [samplePH, setSamplePH] = useLocalStorageState<number>('enology_calc_ph_sample', 3.65);
L502: const [targetPH, setTargetPH] = useLocalStorageState<number>('enology_calc_ph_target', 3.52);
L503: const [phBatchVolume, setPhBatchVolume] = useLocalStorageState<number>('enology_calc_ph_vol', 132);
L504: const [phUnpressedMash, setPhUnpressedMash] = useLocalStorageState<boolean>('enology_calc_ph_unpressed', false);
L551: const [ripperI2Vol, setRipperI2Vol] = useLocalStorageState<number>('enology_calc_ripper_i2_vol', 1.4);
L552: const [ripperI2Norm, setRipperI2Norm] = useLocalStorageState<number>('enology_calc_ripper_i2_norm', 0.02);
L553: const [ripperSampleVol, setRipperSampleVol] = useLocalStorageState<number>('enology_calc_ripper_sample_vol', 25);
L554: const [winePHForSO2, setWinePHForSO2] = useLocalStorageState<number>('enology_calc_so2_ph', 3.52);
L555: const [kmsCurrentSO2, setKmsCurrentSO2] = useLocalStorageState<number>('enology_calc_kms_current_so2', 18);
L556: const [kmsTargetSO2, setKmsTargetSO2] = useLocalStorageState<number>('enology_calc_kms_target_so2', 35);
L557: const [kmsVolume, setKmsVolume] = useLocalStorageState<number>('enology_calc_kms_vol', 105);
L558: const [kmsUnpressedMash, setKmsUnpressedMash] = useLocalStorageState<boolean>('enology_calc_kms_unpressed', false);
L559: const [useRipperForKMS, setUseRipperForKMS] = useLocalStorageState<boolean>('enology_calc_kms_use_ripper', false);
L590: const [snaBrix, setSnaBrix] = useLocalStorageState<number>('enology_calc_yan_brix', 22);
L591: const [snaVolume, setSnaVolume] = useLocalStorageState<number>('enology_calc_yan_vol', 132);
L592: const [snaNaturalYAN, setSnaNaturalYAN] = useLocalStorageState<number>('enology_calc_yan_natural', 100);
L593: const [snaStrainDemand, setSnaStrainDemand] = useLocalStorageState<'low' | 'medium' | 'high'>(
L597: const [snaUnpressedMash, setSnaUnpressedMash] = useLocalStorageState<boolean>('enology_calc_yan_unpressed', false);
L644: const [capTempCurrent, setCapTempCurrent] = useLocalStorageState<number>('enology_calc_cool_curr_temp', 29.5);
L645: const [capTempTarget, setCapTempTarget] = useLocalStorageState<number>('enology_calc_cool_target_temp', 26.5);
L646: const [coolingBatchVol, setCoolingBatchVol] = useLocalStorageState<number>('enology_calc_cool_vol', 132);
L676: const [drynessSG, setDrynessSG] = useLocalStorageState<number>('enology_calc_dryness_sg', 0.993);
L677: const [drynessStableDays, setDrynessStableDays] = useLocalStorageState<number>('enology_calc_dryness_days', 3);
L678: const [drynessRS, setDrynessRS] = useLocalStorageState<number>('enology_calc_dryness_rs', 1.5);
L704: const [finingTrialRate, setFiningTrialRate] = useLocalStorageState<number>('enology_calc_fining_rate', 0.2); // g/L
L705: const [finingTankVol, setFiningTankVol] = useLocalStorageState<number>('enology_calc_fining_vol', 36);
L706: const [copperDoseMgL, setCopperDoseMgL] = useLocalStorageState<number>('enology_calc_copper_dose', 0.25); // mg/L
L707: const [copperTankVol, setCopperTankVol] = useLocalStorageState<number>('enology_calc_copper_vol', 105);
L737: const [grapeWeight, setGrapeWeight] = useLocalStorageState<number>('enology_calc_grape_weight', 400);
L784: const [tsVol, setTsVol] = useLocalStorageState<number>('enology_calc_ts_vol', 132);
L785: const [tsSG, setTsSG] = useLocalStorageState<number>('enology_calc_ts_sg', 1.060);
L786: const [tsBrix, setTsBrix] = useLocalStorageState<number>('enology_calc_ts_brix', 14.5);
L787: const [tsTemp, setTsTemp] = useLocalStorageState<number>('enology_calc_ts_temp', 28.5);
L788: const [tsPH, setTsPH] = useLocalStorageState<number>('enology_calc_ts_ph', 3.65);
L789: const [tsTA, setTsTA] = useLocalStorageState<number>('enology_calc_ts_ta', 6.2);
L790: const [tsSO2, setTsSO2] = useLocalStorageState<number>('enology_calc_ts_so2', 20);
L791: const [tsUnpressed, setTsUnpressed] = useLocalStorageState<boolean>('enology_calc_ts_unpressed', false);
L792: const [tsStuck, setTsStuck] = useLocalStorageState<boolean>('enology_calc_ts_stuck', false);
L793: const [tsH2S, setTsH2S] = useLocalStorageState<boolean>('enology_calc_ts_h2s', false);
L794: const [tsVA, setTsVA] = useLocalStorageState<boolean>('enology_calc_ts_va', false);
L795: const [tsDryCap, setTsDryCap] = useLocalStorageState<boolean>('enology_calc_ts_dry_cap', false);
L796: const [tsBitterSeeds, setTsBitterSeeds] = useLocalStorageState<boolean>('enology_calc_ts_bitter_seeds', false);
L797: const [tsCloudy, setTsCloudy] = useLocalStorageState<boolean>('enology_calc_ts_cloudy', false);
L798: const [tsIsRose, setTsIsRose] = useLocalStorageState<boolean>('enology_calc_ts_is_rose', false);
L799: const [postPressActualVol, setPostPressActualVol] = useLocalStorageState<number>('enology_calc_post_press_vol', 96);
L800: const [blendPressPct, setBlendPressPct] = useLocalStorageState<number>('enology_calc_blend_press_pct', 3);
L801: const [glycerinDoseGL, setGlycerinDoseGL] = useLocalStorageState<number>('enology_calc_glycerin_dose', 2.5);
```

---

## 6. Complete Scientific & Database Engine Source Code
### `src/context/EnologyUiContext.tsx` (796 compact lines)
```ts
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
export type GlobalTankSelection = 'tank-a' | 'tank-b' | 'tank-rose' | 'both-red';
export type AppFiveTabView = 'today' | 'tanks' | 'lab' | 'roadmap' | 'more';
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
export interface EnologyGlossaryItem {
  key: string;
  termFa: string;
  termEn: string;
  shortTooltipFa: string;
  formulaOrRangeFa?: string;
  whyItMattersFa: string;
}
export const ENOLOGY_GLOSSARY_DICTIONARY: Record<string, EnologyGlossaryItem> = {
  sg: {
    key: 'sg',
    termFa: 'چگالی ویژه (SG)',
    termEn: 'Specific Gravity',
    shortTooltipFa: 'نسبت چگالی شیره یا شراب به آب خالص در دمای مرجع ۲۰ درجه سانتی‌گراد.',
    formulaOrRangeFa: 'شروع: ~1.092 | پرسینگ: 1.008–1.010 | خشکی کامل: ≤ 0.994',
    whyItMattersFa:
      'با مصرف قند توسط مخمر و تولید الکل، چگالی مایع روزانه کاهش می‌یابد و تمام زمان‌بندی‌های تغذیه (SNA) و پرسینگ بر اساس آن تعیین می‌شود.'
  },
  brix: {
    key: 'brix',
    termFa: 'درجه بریکس (°Bx)',
    termEn: 'Degrees Brix',
    shortTooltipFa: 'درصد وزنی قندهای محلول در شیره انگور پیش از شروع تخمیر.',
    formulaOrRangeFa: 'هدف رشه سردشت: ۲۲.۰°Bx (معادل ~۱۲.۹٪ الکل بالقوه)',
    whyItMattersFa:
      'عیار قند اولیه انگور، پتانسیل الکلی شراب و نیاز مخمر به نیتروژن (YAN) را مشخص می‌کند.'
  },
  ph: {
    key: 'ph',
    termFa: 'اسیدیته فعال (pH)',
    termEn: 'Active Acidity (pH)',
    shortTooltipFa: 'معیار لگاریتمی تمرکز یون هیدروژن فعال در شیره و شراب.',
    formulaOrRangeFa: 'محدوده هدف قرمز: ۳.۴۵ تا ۳.۵۵ | رُزه: ۳.۲۰ تا ۳.۳۸',
    whyItMattersFa:
      'مستقیماً درصد سولفیت مولکولی فعال (ضدعفونی‌کننده)، پایداری رنگ قرمز (آنتوسیانین) و مقاومت در برابر فساد باکتریایی را کنترل می‌کند.'
  },
  ta: {
    key: 'ta',
    termFa: 'اسیدیته کل قابل تیتر (TA)',
    termEn: 'Titratable Acidity',
    shortTooltipFa: 'مجموع اسیدهای آلی شراب (تارتاریک، مالیک، سیتریک) بر حسب گرم بر لیتر اسید تارتاریک.',
    formulaOrRangeFa: 'محدوده هدف قرمز: ۶.۰ تا ۶.۸ g/L | رُزه: ۶.۵ تا ۷.۵ g/L',
    whyItMattersFa:
      'طراوت، شادابی طعمی و تعادل حسی شراب در دهان را رقم می‌زند و در برابر حس الکل و تانن توازن ایجاد می‌کند.'
  },
  free_so2: {
    key: 'free_so2',
    termFa: 'سولفیت آزاد (Free SO₂)',
    termEn: 'Free Sulfur Dioxide',
    shortTooltipFa: 'بخش غیرمتصل و فعال دی‌اکسید گوگرد در شراب که خاصیت آنتی‌اکسیدانی و ضدباکتری دارد.',
    formulaOrRangeFa: 'در pH = 3.52: هدف ۳۸ تا ۴۲ mg/L (بر اساس جدول پیوسته pH)',
    whyItMattersFa:
      'تنها بخش آزاد SO₂ است که از قهوه‌ای شدن شراب (اکسیداسیون) و فعالیت باکتری سرکه (استوباکتر) جلوگیری می‌کند.'
  },
  molecular_so2: {
    key: 'molecular_so2',
    termFa: 'سولفیت مولکولی (Molecular SO₂)',
    termEn: 'Molecular SO₂',
    shortTooltipFa: 'کسر گازی و نفوذپذیر از سولفیت آزاد که قادر به عبور از غشای سلولی میکروب‌هاست.',
    formulaOrRangeFa: 'شراب قرمز: ≥ 0.60 mg/L | شراب رُزه/سفید: ≥ 0.80 mg/L',
    whyItMattersFa:
      'با بالا رفتن pH، درصد سولفیت مولکولی به شدت افت می‌کند؛ بنابراین در pH بالاتر به سولفیت آزاد بیشتری نیاز است.'
  },
  total_so2: {
    key: 'total_so2',
    termFa: 'سولفیت کل تجمعی (Total SO₂)',
    termEn: 'Total Sulfur Dioxide',
    shortTooltipFa: 'مجموع سولفیت آزاد و سولفیت متصل به استالدهید، قندها و رنگدانه‌ها.',
    formulaOrRangeFa: 'سقف قانونی OIV قرمز خشک: ۱۵۰ mg/L | رُزه خشک: ۲۰۰ mg/L',
    whyItMattersFa:
      'رعایت سقف قانونی سولفیت کل مانع از بوی تند گوگرد، سوزش گلو و رنگ‌پریدگی دائمی شراب می‌شود.'
  },
  yan: {
    key: 'yan',
    termFa: 'نیتروژن قابل جذب مخمر (YAN)',
    termEn: 'Yeast Assimilable Nitrogen',
    shortTooltipFa: 'مجموع نیتروژن آمینواسیدی ارگانیک (FAN) و یون آمونیوم معدنی قابل مصرف توسط مخمر.',
    formulaOrRangeFa: 'هدف برای ۲۲°Bx و مخمر کم‌نیاز: ~۱۹۸ mg N/L',
    whyItMattersFa:
      'کمبود YAN عامل اصلی توقف تخمیر و تولید بوی تخم‌مرغ گندیده (گاز H₂S) توسط مخمر گرسنه است.'
  },
  sna: {
    key: 'sna',
    termFa: 'تغذیه پله‌ای مخمر (SNA)',
    termEn: 'Staggered Nutrient Addition',
    shortTooltipFa: 'تزریق مرحله‌ای مکمل‌های نیتروژنی (Fermaid O، Fermaid K و DAP) در نقاط مشخص افت SG.',
    formulaOrRangeFa: 'نوبت ۱: SG 1.083 | نوبت ۲: SG 1.067 | نوبت ۳: SG 1.057 (سقف ۱/۳ افت قند)',
    whyItMattersFa:
      'از شوک جمعیتی و جهش حرارتی مخمر در روز اول جلوگیری کرده و سلامت غشای سلولی را تا پایان تخمیر حفظ می‌کند.'
  },
  saignee: {
    key: 'saignee',
    termFa: 'خون‌گیری شیره (Saignée)',
    termEn: 'Saignée / Must Bleed-off',
    shortTooltipFa: 'جداسازی بخشی از شیره صاف صورتی پس از ۱۲ تا ۲۴ ساعت خیساندن سرد پوست.',
    formulaOrRangeFa: 'پروتکل ۴۰۰ کیلوگرم: ۱۸ لیتر از هر مخزن قرمز (مجموعاً ۳۶ لیتر برای گالن رُزه)',
    whyItMattersFa:
      'هم نسبت پوست به مایع را در مخازن قرمز بالا می‌برد (شراب قرمز غلیظ‌تر) و هم یک شراب رُزه معطر جانبی تولید می‌کند.'
  },
  pigeage: {
    key: 'pigeage',
    termFa: 'غوطه‌ورسازی کلاهک پوست (Pigeage)',
    termEn: 'Punch-down (Pigeage)',
    shortTooltipFa: 'فرو بردن ملایم لایه فشرده پوست‌های شناور به درون شیره در حال تخمیر.',
    formulaOrRangeFa: 'فاز اوج تخمیر: ۴ نوبت در شبانه‌روز (هر ۶ ساعت یک‌بار)',
    whyItMattersFa:
      'گرمای حبس‌شده در کلاهک را دفع می‌کند، رنگ و تانن پوست را استخراج می‌نماید و مانع خشک شدن کلاهک و رشد باکتری سرکه می‌شود.'
  },
  mlf: {
    key: 'mlf',
    termFa: 'تخمیر مالولاکتیک (MLF)',
    termEn: 'Malolactic Fermentation',
    shortTooltipFa: 'فرآیند باکتریایی تبدیل اسید مالیک دوکربوکسیلیک به اسید لاکتیک تک‌کربوکسیلیک.',
    formulaOrRangeFa: 'در انگور کم‌اسید رشه: مهار کامل با کیتوزان (Bactiless) + حفظ SO₂',
    whyItMattersFa:
      'در انگورهای مناطق گرم که اسیدیته طبیعی پایینی دارند، انجام MLF باعث جهش خطرناک pH بالای ۳.۸ و بی‌دفاع شدن شراب می‌شود.'
  },
  kms: {
    key: 'kms',
    termFa: 'متابی‌سولفیت پتاسیم (KMS)',
    termEn: 'Potassium Metabisulfite (K₂S₂O₅)',
    shortTooltipFa: 'نمک کریستالی سفید که منبع استاندارد آزادسازی گاز SO₂ در شراب‌سازی است.',
    formulaOrRangeFa: 'بازده استوکیومتری عملی: ۵۷.۶٪ (گرم KMS = لیتر × ppm هدف ÷ ۵۷۶)',
    whyItMattersFa:
      'ابزار اصلی کنترل اکسیداسیون، مهار مخمرهای وحشی در روز کراش و تثبیت شراب پیش از بطری‌گذاری است.'
  },
  bactiless: {
    key: 'bactiless',
    termFa: 'کیتوزان قارچی (Bactiless)',
    termEn: 'Fungal Chitosan (Bactiless)',
    shortTooltipFa: 'پلیمر زیست‌تخریب‌پذیر غیرحساسیت‌زا برای حذف فیزیکی باکتری‌های اسید لاکتیک و استیک.',
    formulaOrRangeFa: 'دوز استاندارد روز ۱۱: ۰.۳۰ گرم بر لیتر (۱۰ روز تماس و سپس سیفون)',
    whyItMattersFa:
      'بدون افزایش سولفیت کل، باکتری‌های عامل تخمیر مالولاکتیک ناخواسته و فساد سرکه‌ای را از شراب پاکسازی می‌کند.'
  },
  cold_stab: {
    key: 'cold_stab',
    termFa: 'تثبیت سرمایی تارتارات (Cold Stab)',
    termEn: 'Tartrate Cold Stabilization',
    shortTooltipFa: 'سرد کردن شراب به همراه بذر بی‌تارتارات پتاسیم (KHT) برای رسوب دادن نمک‌های اشباع.',
    formulaOrRangeFa: 'دمای -۲ تا +۲ درجه سانتی‌گراد به مدت ۱۴ روز (روز ۶۵ تا ۸۰)',
    whyItMattersFa:
      'مانع از تشکیل رسوب بلوری (الماس شراب) در کف بطری پس از عرضه و نگهداری در یخچال می‌شود.'
  }
};
export function getGlossaryItem(key: string): EnologyGlossaryItem | undefined {
  const normalized = key.trim().toLowerCase().replace(/[\s-]+/g, '_');
  return ENOLOGY_GLOSSARY_DICTIONARY[normalized] ?? ENOLOGY_GLOSSARY_DICTIONARY[key];
}
export function resolveEffectiveTankSelection(
  selection: GlobalTankSelection,
  tankCount: 1 | 2 = 2
): GlobalTankSelection {
  if (tankCount === 1 && (selection === 'tank-b' || selection === 'both-red')) {
    return 'tank-a';
  }
  return selection;
}
export function resolvePrimaryTankId(
  selection: GlobalTankSelection,
  tankCount: 1 | 2 = 2
): TankId {
  const effective = resolveEffectiveTankSelection(selection, tankCount);
  if (effective === 'both-red') {
    return 'tank-a';
  }
  return effective;
}
export function resolveTargetTankIds(
  selection: GlobalTankSelection,
  tankCount: 1 | 2 = 2
): TankId[] {
  const effective = resolveEffectiveTankSelection(selection, tankCount);
  if (effective === 'both-red') {
    return tankCount === 1 ? ['tank-a'] : ['tank-a', 'tank-b'];
  }
  return [effective];
}
export interface TankSelectionOption {
  id: GlobalTankSelection;
  labelFa: string;
  shortLabelFa: string;
  isCombinedRed?: boolean;
}
export function getAvailableTankSelections(
  tankCount: 1 | 2 = 2,
  targetStyle: WineBatch['targetStyle'] = 'red'
): TankSelectionOption[] {
  if (targetStyle === 'rose') {
    return [
      {
        id: 'tank-rose',
        labelFa: 'گالن رُزه (Saignée)',
        shortLabelFa: 'رُزه'
      }
    ];
  }
  if (tankCount === 1) {
    return [
      {
        id: 'tank-a',
        labelFa: 'مخزن قرمز (تک‌مخزنه)',
        shortLabelFa: 'مخزن قرمز'
      },
      {
        id: 'tank-rose',
        labelFa: 'گالن رُزه (Saignée)',
        shortLabelFa: 'رُزه'
      }
    ];
  }
  return [
    {
      id: 'tank-a',
      labelFa: 'مخزن قرمز A',
      shortLabelFa: 'مخزن A'
    },
    {
      id: 'tank-b',
      labelFa: 'مخزن قرمز B',
      shortLabelFa: 'مخزن B'
    },
    {
      id: 'both-red',
      labelFa: 'هر دو مخزن قرمز (A + B)',
      shortLabelFa: 'هر دو قرمز (A+B)',
      isCombinedRed: true
    },
    {
      id: 'tank-rose',
      labelFa: 'گالن رُزه (Saignée)',
      shortLabelFa: 'رُزه'
    }
  ];
}
export function getTankSelectionLabelFa(
  selection: GlobalTankSelection,
  tankCount: 1 | 2 = 2
): string {
  const effective = resolveEffectiveTankSelection(selection, tankCount);
  if (effective === 'tank-rose') return 'گالن رُزه (Saignée)';
  if (effective === 'both-red') return 'هر دو مخزن قرمز (A + B)';
  if (effective === 'tank-b') return 'مخزن قرمز B';
  return tankCount === 1 ? 'مخزن قرمز (تک‌مخزنه)' : 'مخزن قرمز A';
}
export type FontScaleMode = 'normal' | 'large' | 'xlarge';
export type ScalePrecisionGrams = 1 | 0.1 | 0.01;
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
const STORAGE_KEY_ACTIVE_BATCH_ID = 'enology_global_active_batch_id';
const STORAGE_KEY_UI_ACTIVE_BATCH = 'enology_ui_active_batch_v1';
const STORAGE_KEY_SELECTED_TANK = 'enology_global_selected_tank';
const STORAGE_KEY_ACTIVE_FIVE_TAB = 'enology_global_active_five_tab';
const STORAGE_KEY_FONT_SCALE = 'enology_global_font_scale';
const STORAGE_KEY_SCALE_PRECISION = 'enology_global_scale_precision';
const STORAGE_KEY_SCALE_PRECISION_LEGACY = 'enology_scale_precision_g';
function readStorageString<T extends string>(key: string, fallback: T): T {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return fallback;
  }
  try {
    const raw = localStorage.getItem(key);
    return raw ? (raw as T) : fallback;
  } catch {
    return fallback;
  }
}
function writeStorageString(key: string, value: string): void {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return;
  }
  try {
    localStorage.setItem(key, value);
  } catch {
    window.dispatchEvent(
      new CustomEvent('enology-storage-error', {
        detail: 'ذخیره تنظیمات UI ناموفق بود؛ حافظه مرورگر پر یا مسدود است.'
      })
    );
  }
}
const EnologyUiContext = createContext<EnologyUiContextValue | null>(null);
export const EnologyUiProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [dataVersion, setDataVersion] = useState<number>(0);
  const [batches, setBatches] = useState<WineBatch[]>(() => enologyDb.getBatches());
  const [activeBatchIdState, setActiveBatchIdState] = useState<string>(() => {
    const saved = readStorageString(STORAGE_KEY_ACTIVE_BATCH_ID, '');
    const initialBatches = enologyDb.getBatches();
    if (saved && initialBatches.some((b) => b.id === saved)) {
      return saved;
    }
    const realBatch = initialBatches.find((b) => !b.isDemo);
    return realBatch?.id ?? initialBatches[0]?.id ?? 'batch-rasha-1403';
  });
  const [rawSelectedTank, setRawSelectedTank] = useState<GlobalTankSelection>(() => {
    const saved = readStorageString<GlobalTankSelection>(
      STORAGE_KEY_SELECTED_TANK,
      'tank-a'
    );
    if (
      saved === 'tank-a' ||
      saved === 'tank-b' ||
      saved === 'tank-rose' ||
      saved === 'both-red'
    ) {
      return saved;
    }
    return 'tank-a';
  });
  const [activeFiveTabState, setActiveFiveTabState] = useState<AppFiveTabView>(() => {
    const saved = readStorageString<AppFiveTabView>(
      STORAGE_KEY_ACTIVE_FIVE_TAB,
      'today'
    );
    if (
      saved === 'today' ||
      saved === 'tanks' ||
      saved === 'lab' ||
      saved === 'roadmap' ||
      saved === 'more'
    ) {
      return saved;
    }
    return 'today';
  });
  const [fontScaleState, setFontScaleState] = useState<FontScaleMode>(() => {
    const saved = readStorageString<FontScaleMode>(STORAGE_KEY_FONT_SCALE, 'normal');
    if (saved === 'normal' || saved === 'large' || saved === 'xlarge') {
      return saved;
    }
    return 'normal';
  });
  const [scalePrecisionState, setScalePrecisionState] = useState<ScalePrecisionGrams>(() => {
    const savedPrimary = readStorageString<string>(STORAGE_KEY_SCALE_PRECISION, '');
    const savedLegacy = readStorageString<string>(STORAGE_KEY_SCALE_PRECISION_LEGACY, '');
    const raw = savedPrimary || savedLegacy || '0.01';
    const parsed = Number.parseFloat(raw);
    return Number.isFinite(parsed) && (parsed === 1 || parsed === 0.1 || parsed === 0.01)
      ? parsed
      : 0.01;
  });
  const [labDeepLink, setLabDeepLink] = useState<LabDeepLinkRequest | null>(null);
  const [roadmapHighlightStepNumber, setRoadmapHighlightStepNumber] = useState<
    number | null
  >(null);
  const [isQuickLogOpen, setIsQuickLogOpen] = useState<boolean>(false);
  const [quickLogTankOverride, setQuickLogTankOverride] =
    useState<GlobalTankSelection | null>(null);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [activeGlossaryKey, setActiveGlossaryKey] = useState<string | null>(null);
  const notifyDataChanged = useCallback(() => {
    const latestBatches = enologyDb.getBatches();
    setBatches(latestBatches);
    setDataVersion((v) => v + 1);
  }, []);
  useEffect(() => {
    let mounted = true;
    enologyDb
      .hydrateFromIndexedDBIfNeeded()
      .then((hydrated) => {
        if (mounted && hydrated) {
          notifyDataChanged();
        }
      })
      .catch(() => {
      });
    return () => {
      mounted = false;
    };
  }, [notifyDataChanged]);
  const activeBatch = useMemo(() => {
    return (
      batches.find((b) => b.id === activeBatchIdState) ??
      batches.find((b) => !b.isDemo) ??
      batches[0]
    );
  }, [batches, activeBatchIdState]);
  const activeBatchId = activeBatch?.id ?? activeBatchIdState;
  const tankCount: 1 | 2 = activeBatch?.tankCount === 1 ? 1 : 2;
  const hasDemoData = useMemo(() => enologyDb.hasDemoData(), [dataVersion, batches]);
  const selectedTank = useMemo<GlobalTankSelection>(() => {
    if (activeBatch?.targetStyle === 'rose') {
      return 'tank-rose';
    }
    return resolveEffectiveTankSelection(rawSelectedTank, tankCount);
  }, [rawSelectedTank, tankCount, activeBatch?.targetStyle]);
  useEffect(() => {
    if (selectedTank !== rawSelectedTank) {
      setRawSelectedTank(selectedTank);
      writeStorageString(STORAGE_KEY_SELECTED_TANK, selectedTank);
    }
  }, [selectedTank, rawSelectedTank]);
  const setActiveBatchId = useCallback((batchId: string) => {
    setActiveBatchIdState(batchId);
    writeStorageString(STORAGE_KEY_ACTIVE_BATCH_ID, batchId);
    writeStorageString(STORAGE_KEY_UI_ACTIVE_BATCH, batchId);
    const targetBatch = enologyDb.getBatchById(batchId);
    if (targetBatch?.tankCount === 1) {
      setRawSelectedTank((prev) => {
        const adapted = resolveEffectiveTankSelection(prev, 1);
        writeStorageString(STORAGE_KEY_SELECTED_TANK, adapted);
        return adapted;
      });
    }
  }, []);
  const setSelectedTank = useCallback(
    (selection: GlobalTankSelection) => {
      const adapted = resolveEffectiveTankSelection(selection, tankCount);
      setRawSelectedTank(adapted);
      writeStorageString(STORAGE_KEY_SELECTED_TANK, adapted);
    },
    [tankCount]
  );
  const setActiveFiveTab = useCallback((tab: AppFiveTabView) => {
    setActiveFiveTabState(tab);
    writeStorageString(STORAGE_KEY_ACTIVE_FIVE_TAB, tab);
  }, []);
  const setFontScale = useCallback((scale: FontScaleMode) => {
    setFontScaleState(scale);
    writeStorageString(STORAGE_KEY_FONT_SCALE, scale);
  }, []);
  const setScalePrecision = useCallback((val: ScalePrecisionGrams) => {
    setScalePrecisionState(val);
    const serialized = JSON.stringify(val);
    writeStorageString(STORAGE_KEY_SCALE_PRECISION, serialized);
    writeStorageString(STORAGE_KEY_SCALE_PRECISION_LEGACY, serialized);
    if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
      window.dispatchEvent(
        new CustomEvent('enology-localstorage-sync', {
          detail: {
            key: 'enology_scale_precision_g',
            serialized: JSON.stringify(val),
            value: val
          }
        })
      );
    }
  }, []);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleSync = (e: Event) => {
      const customEvent = e as CustomEvent<{ key?: string; value?: unknown }>;
      if (
        customEvent.detail?.key === STORAGE_KEY_SCALE_PRECISION_LEGACY ||
        customEvent.detail?.key === STORAGE_KEY_SCALE_PRECISION
      ) {
        const num = Number(customEvent.detail.value);
        if (num === 1 || num === 0.1 || num === 0.01) {
          setScalePrecisionState(num);
          writeStorageString(STORAGE_KEY_SCALE_PRECISION, String(num));
          writeStorageString(STORAGE_KEY_SCALE_PRECISION_LEGACY, String(num));
        }
      }
    };
    window.addEventListener('enology-localstorage-sync', handleSync);
    return () => window.removeEventListener('enology-localstorage-sync', handleSync);
  }, []);
  const primaryTankId = useMemo(
    () => resolvePrimaryTankId(selectedTank, tankCount),
    [selectedTank, tankCount]
  );
  const targetTankIds = useMemo(
    () => resolveTargetTankIds(selectedTank, tankCount),
    [selectedTank, tankCount]
  );
  const isBothRedSelected = selectedTank === 'both-red' && tankCount === 2;
  const availableTankOptions = useMemo(
    () => getAvailableTankSelections(tankCount, activeBatch?.targetStyle ?? 'red'),
    [tankCount, activeBatch?.targetStyle]
  );
  const selectedTankLabelFa = useMemo(
    () => getTankSelectionLabelFa(selectedTank, tankCount),
    [selectedTank, tankCount]
  );
  const navigateToLabTest = useCallback(
    (
      request: string | LabDeepLinkRequest,
      options?: Partial<LabDeepLinkRequest>
    ) => {
      const normalizedRequest: LabDeepLinkRequest =
        typeof request === 'string'
          ? {
              ...options,
              testId: request,
              subTab: options?.subTab ?? 'calculators-sops',
              prefillTankId: options?.prefillTankId ?? primaryTankId,
              returnToTab: options?.returnToTab ?? activeFiveTabState,
              timestampMs: Date.now()
            }
          : {
              ...request,
              ...options,
              subTab: options?.subTab ?? request.subTab ?? 'calculators-sops',
              prefillTankId: options?.prefillTankId ?? request.prefillTankId ?? primaryTankId,
              returnToTab: options?.returnToTab ?? request.returnToTab ?? activeFiveTabState,
              timestampMs: options?.timestampMs ?? request.timestampMs ?? Date.now()
            };
      setLabDeepLink(normalizedRequest);
      setActiveFiveTab('lab');
    },
    [primaryTankId, activeFiveTabState, setActiveFiveTab]
  );
  const clearLabDeepLink = useCallback(() => {
    setLabDeepLink(null);
  }, []);
  const navigateToRoadmapStep = useCallback(
    (stepNumber: number) => {
      setRoadmapHighlightStepNumber(stepNumber);
      setActiveFiveTab('roadmap');
    },
    [setActiveFiveTab]
  );
  const clearRoadmapHighlightStep = useCallback(() => {
    setRoadmapHighlightStepNumber(null);
  }, []);
  const openQuickLog = useCallback((tankOverride?: GlobalTankSelection) => {
    setQuickLogTankOverride(tankOverride ?? null);
    setIsQuickLogOpen(true);
  }, []);
  const closeQuickLog = useCallback(() => {
    setIsQuickLogOpen(false);
    setQuickLogTankOverride(null);
  }, []);
  const openOnboardingWizard = useCallback(() => {
    setIsOnboardingOpen(true);
  }, []);
  const closeOnboardingWizard = useCallback(() => {
    setIsOnboardingOpen(false);
  }, []);
  const openGlossaryTerm = useCallback((key: string) => {
    setActiveGlossaryKey(key);
  }, []);
  const closeGlossaryTerm = useCallback(() => {
    setActiveGlossaryKey(null);
  }, []);
  const activeGlossaryItem = useMemo(
    () => (activeGlossaryKey ? getGlossaryItem(activeGlossaryKey) ?? null : null),
    [activeGlossaryKey]
  );
  const value = useMemo<EnologyUiContextValue>(
    () => ({
      batches,
      activeBatchId,
      activeBatch,
      setActiveBatchId,
      tankCount,
      hasDemoData,
      selectedTank,
      setSelectedTank,
      globalTankSelection: selectedTank,
      setGlobalTankSelection: setSelectedTank,
      primaryTankId,
      effectiveSingleTankId: primaryTankId,
      targetTankIds,
      isBothRedSelected,
      availableTankOptions,
      selectedTankLabelFa,
      activeFiveTab: activeFiveTabState,
      setActiveFiveTab,
      activeTab: activeFiveTabState,
      setActiveTab: setActiveFiveTab,
      fontScale: fontScaleState,
      setFontScale,
      scalePrecision: scalePrecisionState,
      setScalePrecision,
      labDeepLink,
      navigateToLabTest,
      clearLabDeepLink,
      roadmapHighlightStepNumber,
      navigateToRoadmapStep,
      clearRoadmapHighlightStep,
      isQuickLogOpen,
      quickLogTankOverride,
      openQuickLog,
      closeQuickLog,
      isOnboardingOpen,
      openOnboardingWizard,
      closeOnboardingWizard,
      activeGlossaryKey,
      activeGlossaryItem,
      openGlossaryTerm,
      closeGlossaryTerm,
      dataVersion,
      notifyDataChanged
    }),
    [
      batches,
      activeBatchId,
      activeBatch,
      setActiveBatchId,
      tankCount,
      hasDemoData,
      selectedTank,
      setSelectedTank,
      primaryTankId,
      targetTankIds,
      isBothRedSelected,
      availableTankOptions,
      selectedTankLabelFa,
      activeFiveTabState,
      setActiveFiveTab,
      fontScaleState,
      setFontScale,
      scalePrecisionState,
      setScalePrecision,
      labDeepLink,
      navigateToLabTest,
      clearLabDeepLink,
      roadmapHighlightStepNumber,
      navigateToRoadmapStep,
      clearRoadmapHighlightStep,
      isQuickLogOpen,
      quickLogTankOverride,
      openQuickLog,
      closeQuickLog,
      isOnboardingOpen,
      openOnboardingWizard,
      closeOnboardingWizard,
      activeGlossaryKey,
      activeGlossaryItem,
      openGlossaryTerm,
      closeGlossaryTerm,
      dataVersion,
      notifyDataChanged
    ]
  );
  return (
    <EnologyUiContext.Provider value={value}>
      {children}
    </EnologyUiContext.Provider>
  );
};
export function useEnologyUi(): EnologyUiContextValue {
  const ctx = useContext(EnologyUiContext);
  if (ctx) {
    return ctx;
  }
  console.warn('useEnologyUi called outside <EnologyUiProvider>; using fallback state.');
  const fallbackBatches = enologyDb.getBatches();
  const fallbackBatch =
    fallbackBatches.find((b) => !b.isDemo) ?? fallbackBatches[0];
  const fallbackTankCount: 1 | 2 = fallbackBatch?.tankCount === 1 ? 1 : 2;
  return {
    batches: fallbackBatches,
    activeBatchId: fallbackBatch?.id ?? 'batch-rasha-1403',
    activeBatch: fallbackBatch,
    setActiveBatchId: () => {},
    tankCount: fallbackTankCount,
    hasDemoData: enologyDb.hasDemoData(),
    selectedTank: 'tank-a',
    setSelectedTank: () => {},
    globalTankSelection: 'tank-a',
    setGlobalTankSelection: () => {},
    primaryTankId: 'tank-a',
    effectiveSingleTankId: 'tank-a',
    targetTankIds: ['tank-a'],
    isBothRedSelected: false,
    availableTankOptions: getAvailableTankSelections(fallbackTankCount),
    selectedTankLabelFa: getTankSelectionLabelFa('tank-a', fallbackTankCount),
    activeFiveTab: 'today',
    setActiveFiveTab: () => {},
    activeTab: 'today',
    setActiveTab: () => {},
    fontScale: 'normal',
    setFontScale: () => {},
    scalePrecision: 0.01,
    setScalePrecision: () => {},
    labDeepLink: null,
    navigateToLabTest: () => {},
    clearLabDeepLink: () => {},
    roadmapHighlightStepNumber: null,
    navigateToRoadmapStep: () => {},
    clearRoadmapHighlightStep: () => {},
    isQuickLogOpen: false,
    quickLogTankOverride: null,
    openQuickLog: () => {},
    closeQuickLog: () => {},
    isOnboardingOpen: false,
    openOnboardingWizard: () => {},
    closeOnboardingWizard: () => {},
    activeGlossaryKey: null,
    activeGlossaryItem: null,
    openGlossaryTerm: () => {},
    closeGlossaryTerm: () => {},
    dataVersion: 0,
    notifyDataChanged: () => {}
  };
}
export interface GlossaryTermProps {
  termKey: string;
  labelOverride?: string;
  className?: string;
}
export const GlossaryTerm: React.FC<GlossaryTermProps> = ({
  termKey,
  labelOverride,
  className = ''
}) => {
  const item = getGlossaryItem(termKey);
  const { openGlossaryTerm } = useEnologyUi();
  if (!item) {
    return <span className={className}>{labelOverride ?? termKey}</span>;
  }
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        openGlossaryTerm(item.key);
      }}
      title={`${item.termFa} (${item.termEn}): ${item.shortTooltipFa}`}
      className={`inline-flex items-center gap-1 border-b border-dotted border-amber-500/70 text-amber-900 dark:text-amber-300 hover:border-amber-600 cursor-help transition-colors ${className}`}
    >
      <span>{labelOverride ?? item.termFa}</span>
      <span
        aria-hidden="true"
        className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-amber-500/15 text-xs font-bold text-amber-700 dark:text-amber-300"
      >
        ؟
      </span>
    </button>
  );
};
```

### `src/data/masterProtocolConfig.ts` (1280 compact lines)
```ts
import { useState, useEffect, useCallback, useMemo } from 'react';
import type { ProtocolMaterial, VolumeBalance } from './protocolData.ts';
export interface TemperatureThresholdConfig {
  optimalMin: number;
  optimalMax: number;
  caution?: number;
  warningCeiling: number;
  crisisDanger: number;
}
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
export const MASTER_PROTOCOL_CONFIG: MasterProtocolConfig = {
  metadata: {
    code: 'SOP-OENO-1405-RS400',
    vintageYear: 1405,
    grapeWeightKg: 400,
    targetInitialBrix: 22.0,
    targetInitialSG: 1.092,
    redFinalSG: 0.993,
    roseFinalSG: 0.991
  },
  volumes: {
    totalCrushedMashL: 350,
    crushedMashPerTankL: 175,
    initialLiquidL: 300,
    initialLiquidPerTankL: 150,
    saigneeRoseRawL: 36,
    saigneePerTankL: 18,
    roseClarifiedFermentL: 32,
    rosePostRackingL: 30,
    roseFinalBottlingL: 29,
    redMashAfterSaigneePerTankL: 157,
    redLiquidFermentPerTankL: 132,
    redLiquidFermentTotalL: 264,
    redMashToLiquidYieldFactor: 0.84,
    postPressFreeRunConservativePerTankL: 100,
    postPressFreeRunRangePerTankL: { min: 95, max: 110 },
    postPressRack1PerTankL: 96,
    postPressRack2PerTankL: 94,
    postPressColdStabPerTankL: 93,
    postPressHeavyPressTotalL: 28,
    postPressHeavyPressPerTankL: 14
  },
  temperatures: {
    redActiveMaceration: {
      optimalMin: 20.0,
      optimalMax: 28.5,
      caution: 28.5,
      warningCeiling: 30.0,
      crisisDanger: 32.0
    },
    roseActiveFermentation: {
      optimalMin: 16.0,
      optimalMax: 18.0,
      warningCeiling: 19.0,
      crisisDanger: 19.5
    },
    postPressingLiquidFinishing: {
      optimalMin: 21.0,
      optimalMax: 22.5,
      coldRiskBelow: 18.5,
      warmWarningAbove: 26.0
    },
    finishedWineAging: {
      optimalMin: 14.0,
      optimalMax: 16.0,
      warningAbove: 20.0,
      dangerAbove: 24.0
    }
  },
  stoichiometry: {
    kmsActiveSO2Fraction: 0.576,
    h2o2_3PercentMlPerMgSO2: 0.0177,
    khco3GramsPerGL_TA: 1.33,
    khco3WithColdStabGramsPerGL_TA: 1.00,
    k2co3GramsPerGL_TA: 0.92,
    caco3GramsPerGL_TA: 0.67,
    totalSO2LegalCeilingMgL: 150,
    yeastEndogenousSO2MgL: 15,
    sgTriggerTolerance: 0.0025,
    dapNitrogenMgPerG: 212,
    fermaidKNitrogenMgPerG: 100,
    fermaidOChemicalNitrogenMgPerG: 40,
    fermaidOBioEquivalentNitrogenMgPerG: 120,
    zincSulfateHeptahydrateSafeRateGPerL: 0.002,
    yanTargetMultiplierMedium: 1.05,
    yanScaleBaselineMgL: 152
  }
};
export type FlexibleProtocolPresetId = 'conservative_ideal' | 'classic_v32' | 'custom';
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
export const IDEAL_DEFAULT_PROTOCOL_PARAMS: FlexibleProtocolParams = {
  presetId: 'conservative_ideal',
  grapeWeightKg: 400,
  initialBrix: 22.0,
  initialSG: 1.092,
  naturalMustYANMgL: 100,
  targetRedPH: 3.52,
  targetRosePH: 3.32,
  mashYieldPer400KgL: 350,
  initialLiquidPer400KgL: 300,
  saigneeTotalL: 36,
  roseClarifiedFermentL: 32,
  rosePostRackingL: 30,
  roseFinalBottlingL: 29,
  redMashLiquidYieldFactor: 0.84,
  postPressFreeRunPerTankL: 100,
  postPressRack1PerTankL: 96,
  postPressRack2PerTankL: 94,
  postPressFinalPerTankL: 93,
  heavyPressTotalL: 28,
  crushSO2TargetMgL: 25,
  postSaigneeRedSO2TargetMgL: 40,
  pecticEnzymeRedRateGL: 0.055,
  pecticEnzymeRoseRateGL: 0.040,
  yeastRateGL: 0.25,
  goFermMultiplier: 1.20,
  fermaidO1RedRateGL: 0.25,
  fermaidO1RoseRateGL: 0.20,
  fermaidK2RedRateGL: 0.25,
  fermaidK2RoseRateGL: 0.18,
  dap2RedRateGL: 0.15,
  dap2RoseRateGL: 0.10,
  zincSafeRateGL: 0.002,
  fermaidO3RedRateGL: 0.30,
  fermaidO3RoseRateGL: 0.23,
  bactilessRedRateGL: 0.30,
  bactilessRoseRateGL: 0.25,
  day11KmsRateGL: 0.070,
  redMaxGlycerinGL: 3.5,
  roseMaxGlycerinGL: 1.5,
  ascorbicRateGL: 0.040,
  pressingTargetSG: 1.008,
  redCapWarningTempC: 28.5,
  redCapDangerTempC: 30.0
};
export const CLASSIC_V32_PROTOCOL_PARAMS: FlexibleProtocolParams = {
  ...IDEAL_DEFAULT_PROTOCOL_PARAMS,
  presetId: 'classic_v32',
  redMashLiquidYieldFactor: 0.84,
  postPressFreeRunPerTankL: 110,
  postPressRack1PerTankL: 105,
  postPressRack2PerTankL: 102,
  postPressFinalPerTankL: 100,
  heavyPressTotalL: 24,
  zincSafeRateGL: 0.012,
  day11KmsRateGL: 0.078,
  ascorbicRateGL: 0.035,
  redCapDangerTempC: 29.5
};
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
export const FLEXIBLE_PARAM_METADATA: ReadonlyArray<FlexibleParamMetaItem> = [
  {
    key: 'grapeWeightKg',
    labelFa: 'وزن کل انگور ورودی',
    unit: 'kg',
    idealValue: 400,
    classicValue: 400,
    min: 20,
    max: 5000,
    step: 10,
    category: 'harvest',
    noteFa: 'مبنای استاندارد مستر پروتکل رشه سردشت (توزیع متقارن در دو مخزن A و B)'
  },
  {
    key: 'initialBrix',
    labelFa: 'بریکس اولیه آب‌انگور (Brix₀)',
    unit: '°Bx',
    idealValue: 22.0,
    classicValue: 22.0,
    min: 18.0,
    max: 28.0,
    step: 0.2,
    category: 'harvest',
    noteFa: 'تعیین‌کننده قند واقعی (% w/v) و بودجه نیتروژن YAN'
  },
  {
    key: 'initialSG',
    labelFa: 'وزن مخصوص اولیه در ۲۰°C (SG₀)',
    unit: 'SG',
    idealValue: 1.092,
    classicValue: 1.092,
    min: 1.070,
    max: 1.120,
    step: 0.001,
    category: 'harvest',
    noteFa: 'مبنای محاسبه پویا برای نقاط تریگر تغذیه SNA و تانن فاز ۲'
  },
  {
    key: 'naturalMustYANMgL',
    labelFa: 'نیتروژن طبیعی انگور رشه (Natural YAN)',
    unit: 'mg N/L',
    idealValue: 100,
    classicValue: 100,
    min: 40,
    max: 250,
    step: 5,
    category: 'harvest',
    noteFa: 'میانگین نیتروژن بومی تاکستان‌های دیم سردشت'
  },
  {
    key: 'targetRedPH',
    labelFa: 'pH هدف شراب قرمز',
    unit: 'pH',
    idealValue: 3.52,
    classicValue: 3.52,
    min: 3.30,
    max: 3.65,
    step: 0.01,
    category: 'harvest',
    noteFa: 'توازن بهینه پایداری میکروبی SO2 و ساختار بدون تخمیر مالولاکتیک'
  },
  {
    key: 'targetRosePH',
    labelFa: 'pH هدف شراب رُزه سانیه',
    unit: 'pH',
    idealValue: 3.32,
    classicValue: 3.32,
    min: 3.15,
    max: 3.45,
    step: 0.01,
    category: 'harvest',
    noteFa: 'حفظ طراوت اسیدی و رنگ یاقوتی روشن در رُزه'
  },
  {
    key: 'redMashLiquidYieldFactor',
    labelFa: 'ضریب حجم مایع به مش پس از سانیه',
    unit: 'نسبت',
    idealValue: 0.84,
    classicValue: 0.84,
    min: 0.75,
    max: 0.90,
    step: 0.01,
    category: 'volumes',
    noteFa: 'در ۱۵۷ لیتر مش پس از سانیه، ۱۳۲ لیتر مایع خالص وجود دارد (132/157 = 0.8408)'
  },
  {
    key: 'saigneeTotalL',
    labelFa: 'حجم خون‌گیری سانیه رُزه (کل دو مخزن)',
    unit: 'L',
    idealValue: 36,
    classicValue: 36,
    min: 0,
    max: 80,
    step: 2,
    category: 'volumes',
    noteFa: '۱۲٪ فاز مایع اولیه (۱۸ لیتر از مخزن A + ۱۸ لیتر از مخزن B)'
  },
  {
    key: 'postPressFreeRunPerTankL',
    labelFa: 'حجم شراب آب‌آزاد هر مخزن (روز ۶)',
    unit: 'L/مخزن',
    idealValue: 100,
    classicValue: 110,
    min: 85,
    max: 115,
    step: 1,
    category: 'volumes',
    noteFa: 'بازده واقعی محافظه‌کارانه بدون فشار مکانیکی: ~۱۰۰ لیتر در هر مخزن (بازه ۹۵ تا ۱۱۰L)'
  },
  {
    key: 'postPressRack1PerTankL',
    labelFa: 'حجم سیفون اول دُرد سنگین (روز ۱۰)',
    unit: 'L/مخزن',
    idealValue: 96,
    classicValue: 105,
    min: 80,
    max: 110,
    step: 1,
    category: 'volumes',
    noteFa: 'حجم شراب صاف انتقالی به گالن‌های لب‌به‌لب پیش از تزریق باکتیلس'
  },
  {
    key: 'postPressFinalPerTankL',
    labelFa: 'حجم نهایی شراب قرمز پس از سرمازدایی (روز ۸۰)',
    unit: 'L/مخزن',
    idealValue: 93,
    classicValue: 100,
    min: 75,
    max: 105,
    step: 1,
    category: 'volumes',
    noteFa: 'حجم خالص بطری‌گذاری تراز اول پس از رسوب تارتارات'
  },
  {
    key: 'heavyPressTotalL',
    labelFa: 'حجم کل شراب پرس سنگین (مجموع دو مخزن)',
    unit: 'L کل',
    idealValue: 28,
    classicValue: 24,
    min: 10,
    max: 40,
    step: 2,
    category: 'volumes',
    noteFa: 'نگهداری مجزا برای Top-up یا تست آمیزش ۳ لیوانی روز ۸۶'
  },
  {
    key: 'zincSafeRateGL',
    labelFa: 'دوز مکمل روی در SNA-2 (ZnSO4 / Wyeast)',
    unit: 'g/L',
    idealValue: 0.002,
    classicValue: 0.012,
    min: 0.000,
    max: 0.015,
    step: 0.001,
    category: 'dosages',
    noteFa: '۰.۰۰۲ g/L برای سولفات روی خالص ۷ آبه (۰.۴۵ mg/L Zn²⁺)؛ ۰.۰۱۲ g/L برای مخلوط تجاری Wyeast'
  },
  {
    key: 'day11KmsRateGL',
    labelFa: 'نرخ متابی‌سولفیت تثبیت روز ۱۱ (همراه باکتیلس)',
    unit: 'g/L',
    idealValue: 0.070,
    classicValue: 0.078,
    min: 0.050,
    max: 0.100,
    step: 0.002,
    category: 'dosages',
    noteFa: '۰.۰۷۰ g/L معادل ۱.۴۰ گرم در هر گالن ۲۰ لیتری (~40 mg/L SO2)'
  },
  {
    key: 'ascorbicRateGL',
    labelFa: 'نرخ اسید اسکوربیک پیش از بطری‌گذاری (روز ۱۰۰)',
    unit: 'g/L',
    idealValue: 0.040,
    classicValue: 0.035,
    min: 0.000,
    max: 0.060,
    step: 0.005,
    category: 'dosages',
    noteFa: '۰.۰۴۰ g/L (مشروط به Free SO2 ≥ 30 mg/L؛ در شراب رُزه بسیار مفید و در شراب قرمز غنی از تانن اختیاری و قابل تنظیم روی صفر است)'
  },
  {
    key: 'pressingTargetSG',
    labelFa: 'وزن مخصوص نقطه طلایی پرسینگ قرمز',
    unit: 'SG',
    idealValue: 1.008,
    classicValue: 1.008,
    min: 1.002,
    max: 1.015,
    step: 0.001,
    category: 'thresholds',
    noteFa: 'جداسازی پوست پیش از استخراج تانن‌های تلخ هسته در الکل بالا'
  },
  {
    key: 'redCapDangerTempC',
    labelFa: 'سقف بحران حرارتی کلاهک قرمز',
    unit: '°C',
    idealValue: 30.0,
    classicValue: 29.5,
    min: 28.5,
    max: 32.0,
    step: 0.5,
    category: 'thresholds',
    noteFa: 'آستانه شوک حرارتی غشای مخمر RC-212 و الزام خنک‌سازی اضطراری'
  }
];
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
function round1(val: number): number {
  return Math.round(val * 10) / 10;
}
function round2(val: number): number {
  return Math.round(val * 100) / 100;
}
function round3(val: number): number {
  return Math.round(val * 1000) / 1000;
}
export function computeDynamicProtocolPlan(
  overrides?: Partial<FlexibleProtocolParams>
): DynamicProtocolPlan {
  const params: FlexibleProtocolParams = {
    ...IDEAL_DEFAULT_PROTOCOL_PARAMS,
    ...(overrides || {})
  };
  const scaleFactor = Math.max(0.05, params.grapeWeightKg / 400);
  const totalCrushedMashL = round1(params.mashYieldPer400KgL * scaleFactor);
  const crushedMashPerTankL = round1(totalCrushedMashL / 2);
  const initialLiquidL = round1(params.initialLiquidPer400KgL * scaleFactor);
  const initialLiquidPerTankL = round1(initialLiquidL / 2);
  const saigneeTotalL = round1(params.saigneeTotalL * scaleFactor);
  const saigneePerTankL = round1(saigneeTotalL / 2);
  const roseClarifiedFermentL = round1(params.roseClarifiedFermentL * scaleFactor);
  const rosePostRackingL = round1(params.rosePostRackingL * scaleFactor);
  const roseFinalBottlingL = round1(params.roseFinalBottlingL * scaleFactor);
  const roseBottles750ml = Math.floor((roseFinalBottlingL * 1000) / 750);
  const redMashAfterSaigneePerTankL = round1(Math.max(10, crushedMashPerTankL - saigneePerTankL));
  const isCustomYieldFactor =
    params.redMashLiquidYieldFactor !== IDEAL_DEFAULT_PROTOCOL_PARAMS.redMashLiquidYieldFactor;
  const redLiquidFermentPerTankL = isCustomYieldFactor
    ? round1(Math.max(10, redMashAfterSaigneePerTankL * params.redMashLiquidYieldFactor))
    : round1(Math.max(10, initialLiquidPerTankL - saigneePerTankL));
  const redLiquidFermentTotalL = round1(redLiquidFermentPerTankL * 2);
  const freeRunPerTankL = round1(params.postPressFreeRunPerTankL * scaleFactor);
  const freeRunTotalL = round1(freeRunPerTankL * 2);
  const rack1PerTankL = round1(params.postPressRack1PerTankL * scaleFactor);
  const rack1TotalL = round1(rack1PerTankL * 2);
  const rack2PerTankL = round1(params.postPressRack2PerTankL * scaleFactor);
  const rack2TotalL = round1(rack2PerTankL * 2);
  const finalRedPerTankL = round1(params.postPressFinalPerTankL * scaleFactor);
  const finalRedTotalL = round1(finalRedPerTankL * 2);
  const redBottles750ml = Math.floor((finalRedTotalL * 1000) / 750);
  const heavyPressTotalL = round1(params.heavyPressTotalL * scaleFactor);
  const heavyPressPerTankL = round1(heavyPressTotalL / 2);
  const totalBottles750ml = redBottles750ml + roseBottles750ml;
  const sg0 =
    !Number.isFinite(params.initialSG) || params.initialSG <= 0
      ? 1.092
      : Math.max(1.020, params.initialSG);
  const span = sg0 - 1.000;
  const triggers = {
    initialSG: round3(sg0),
    sna1: round3(sg0 - 0.10 * span),
    sna2: round3(sg0 - 0.24 * span),
    oneThirdCeiling: round3(sg0 - 0.33 * span),
    phase2Tannin: round3(sg0 - 0.35 * span),
    sna3: round3(sg0 - 0.38 * span),
    pressingSG: round3(params.pressingTargetSG),
    drynessSG: 0.993
  };
  const sugarGPerL = round1(params.initialBrix * 10 * sg0);
  const targetYANMgL = Math.round(Math.round(sugarGPerL) * 1.05);
  const neededYANMgL = Math.max(0, targetYANMgL - params.naturalMustYANMgL);
  const yanScale = neededYANMgL / 152;
  const crushKmsPerTankG = round2(6.52 * (initialLiquidPerTankL / 150) * (params.crushSO2TargetMgL / 25));
  const postSaigneeKmsPerTankG = round2(
    3.43 * (redLiquidFermentPerTankL / 132) * (params.postSaigneeRedSO2TargetMgL / 40)
  );
  const day11KmsPerTankG = round2(params.day11KmsRateGL * rack1PerTankL);
  const preBottlingKmsPerTankG = round2(0.030 * finalRedPerTankL);
  const rosePostFermKmsG = round2(0.078 * rosePostRackingL);
  const rosePreBottlingKmsG = round2(0.030 * roseFinalBottlingL);
  const heavyPressKmsG = round2(0.078 * heavyPressTotalL);
  const totalWineKmsG = round2(
    (crushKmsPerTankG + postSaigneeKmsPerTankG + day11KmsPerTankG + preBottlingKmsPerTankG) * 2 +
      rosePostFermKmsG +
      rosePreBottlingKmsG +
      heavyPressKmsG
  );
  const pecticEnzymeRedPerTankG = round2(params.pecticEnzymeRedRateGL * redLiquidFermentPerTankL);
  const pecticEnzymeRoseG = round2(params.pecticEnzymeRoseRateGL * saigneeTotalL);
  const pecticEnzymeTotalG = round2(pecticEnzymeRedPerTankG * 2 + pecticEnzymeRoseG);
  const whiteTanninRedPhase1PerTankG = round2(0.030 * redLiquidFermentPerTankL);
  const whiteTanninRoseFermentG = round2(0.035 * roseClarifiedFermentL);
  const whiteTanninRoseFinishingG = round2(0.015 * roseFinalBottlingL);
  const whiteTanninTotalG = round2(
    whiteTanninRedPhase1PerTankG * 2 + whiteTanninRoseFermentG + whiteTanninRoseFinishingG
  );
  const redTanninPhase1PerTankG = round2(0.100 * redLiquidFermentPerTankL);
  const redTanninPhase2PerTankG = round2(0.100 * redLiquidFermentPerTankL);
  const redTanninFinishingPerTankG = round2(0.025 * finalRedPerTankL);
  const redTanninTotalG = round2(
    (redTanninPhase1PerTankG + redTanninPhase2PerTankG + redTanninFinishingPerTankG) * 2
  );
  const yeastRedPerTankG = round2(params.yeastRateGL * redLiquidFermentPerTankL);
  const yeastRoseG = round2(params.yeastRateGL * roseClarifiedFermentL);
  const yeastTotalG = round2(yeastRedPerTankG * 2 + yeastRoseG);
  const goFermRedPerTankG = round2(yeastRedPerTankG * params.goFermMultiplier);
  const goFermRoseG = round2(yeastRoseG * params.goFermMultiplier);
  const goFermTotalG = round2(goFermRedPerTankG * 2 + goFermRoseG);
  const fermaidO1RedPerTankG = round2(params.fermaidO1RedRateGL * yanScale * redLiquidFermentPerTankL);
  const fermaidO1RoseG = round2(params.fermaidO1RoseRateGL * yanScale * roseClarifiedFermentL);
  const fermaidO3RedPerTankG = round2(params.fermaidO3RedRateGL * yanScale * redLiquidFermentPerTankL);
  const fermaidO3RoseG = round2(params.fermaidO3RoseRateGL * yanScale * roseClarifiedFermentL);
  const fermaidOTotalG = round2(
    (fermaidO1RedPerTankG + fermaidO3RedPerTankG) * 2 + fermaidO1RoseG + fermaidO3RoseG
  );
  const fermaidK2RedPerTankG = round2(params.fermaidK2RedRateGL * yanScale * redLiquidFermentPerTankL);
  const fermaidK2RoseG = round2(params.fermaidK2RoseRateGL * yanScale * roseClarifiedFermentL);
  const fermaidKTotalG = round2(fermaidK2RedPerTankG * 2 + fermaidK2RoseG);
  const dap2RedPerTankG = round2(params.dap2RedRateGL * yanScale * redLiquidFermentPerTankL);
  const dap2RoseG = round2(params.dap2RoseRateGL * yanScale * roseClarifiedFermentL);
  const dapTotalG = round2(dap2RedPerTankG * 2 + dap2RoseG);
  const zincRedPerTankG = round2(params.zincSafeRateGL * redLiquidFermentPerTankL);
  const zincRoseG = round2(
    (params.presetId === 'classic_v32' ? 0.015 : params.zincSafeRateGL) * roseClarifiedFermentL
  );
  const zincTotalG = round2(zincRedPerTankG * 2 + zincRoseG);
  const bentoniteRoseG = round2(0.20 * saigneeTotalL);
  const bactilessRedPerTankG = round2(params.bactilessRedRateGL * rack1PerTankL);
  const bactilessRoseG = round2(params.bactilessRoseRateGL * rosePostRackingL);
  const bactilessHeavyPressG = round2(params.bactilessRedRateGL * heavyPressTotalL);
  const bactilessTotalG = round2(bactilessRedPerTankG * 2 + bactilessRoseG + bactilessHeavyPressG);
  const khtColdStabRedPerTankG = round2(0.20 * finalRedPerTankL);
  const khtColdStabRoseG = round2(0.20 * rosePostRackingL);
  const khtColdStabHeavyPressG = round2(0.20 * heavyPressTotalL);
  const khtTotalG = round2(khtColdStabRedPerTankG * 2 + khtColdStabRoseG + khtColdStabHeavyPressG);
  const glycerinRedMaxPerTankG = round1(params.redMaxGlycerinGL * finalRedPerTankL);
  const glycerinRoseMaxG = round1(params.roseMaxGlycerinGL * roseFinalBottlingL);
  const glycerinTotalMaxG = round1(glycerinRedMaxPerTankG * 2 + glycerinRoseMaxG);
  const ascorbicRedPerTankG = round2(params.ascorbicRateGL * finalRedPerTankL);
  const ascorbicRoseG = round2(params.ascorbicRateGL * roseFinalBottlingL);
  const ascorbicTotalG = round2(ascorbicRedPerTankG * 2 + ascorbicRoseG + 1.0);
  const suppliedChemicalYANRedMgL =
    redLiquidFermentPerTankL > 0
      ? round1(
          (((fermaidO1RedPerTankG + fermaidO3RedPerTankG) *
            MASTER_PROTOCOL_CONFIG.stoichiometry.fermaidOChemicalNitrogenMgPerG +
            fermaidK2RedPerTankG * MASTER_PROTOCOL_CONFIG.stoichiometry.fermaidKNitrogenMgPerG +
            dap2RedPerTankG * MASTER_PROTOCOL_CONFIG.stoichiometry.dapNitrogenMgPerG) /
            redLiquidFermentPerTankL)
        )
      : 0;
  const suppliedBioEquivalentYANRedMgL =
    redLiquidFermentPerTankL > 0
      ? round1(
          (((fermaidO1RedPerTankG + fermaidO3RedPerTankG) *
            MASTER_PROTOCOL_CONFIG.stoichiometry.fermaidOBioEquivalentNitrogenMgPerG +
            fermaidK2RedPerTankG * MASTER_PROTOCOL_CONFIG.stoichiometry.fermaidKNitrogenMgPerG +
            dap2RedPerTankG * MASTER_PROTOCOL_CONFIG.stoichiometry.dapNitrogenMgPerG) /
            redLiquidFermentPerTankL)
        )
      : 0;
  const baseBioEquivalentYANMgL = round1(
    (params.fermaidO1RedRateGL + params.fermaidO3RedRateGL) *
      MASTER_PROTOCOL_CONFIG.stoichiometry.fermaidOBioEquivalentNitrogenMgPerG +
      params.fermaidK2RedRateGL * MASTER_PROTOCOL_CONFIG.stoichiometry.fermaidKNitrogenMgPerG +
      params.dap2RedRateGL * MASTER_PROTOCOL_CONFIG.stoichiometry.dapNitrogenMgPerG
  );
  const unmetBioEquivalentYANMgL = Math.max(
    0,
    round1(neededYANMgL - suppliedBioEquivalentYANRedMgL)
  );
  const yanAccountingBasisFa = `کسری نیتروژن هدف (${neededYANMgL} mg N/L) بر پایه ضریب مقیاس YAN تامین میشود: نیتروژن شیمیایی مستقیم = ${suppliedChemicalYANRedMgL} mg N/L، نیتروژن معادل زیستی (با ضریب ۳ برابری اسیدهای آمینه Fermaid O) = ${suppliedBioEquivalentYANRedMgL} mg N eq/L (نرخ پایه پروتکل: ${baseBioEquivalentYANMgL} mg N eq/L) و کسری پوشش‌داده‌نشده (Unmet Bio-Equivalent Deficit) = ${unmetBioEquivalentYANMgL} mg N eq/L.`;
  const dynamicVolumeBalances: VolumeBalance[] = [
    {
      stage: 'مادهٔ اولیه',
      volume: `${params.grapeWeightKg} کیلوگرم انگور دست‌چین`,
      description: `بریکس هدف: ${params.initialBrix}، وزن مخصوص اولیه در ۲۰ درجه: SG₀ = ${triggers.initialSG.toFixed(3)}`
    },
    {
      stage: 'حجم کل تودهٔ کراش‌شده',
      volume: `حدود ${totalCrushedMashL} لیتر`,
      description: `تقسیم متقارن: ${crushedMashPerTankL} لیتر در مخزن A و ${crushedMashPerTankL} لیتر در مخزن B`
    },
    {
      stage: 'حجم کل فاز مایع اولیه (V_initial)',
      volume: `${initialLiquidL} لیتر مایع خالص`,
      description: `${initialLiquidPerTankL} لیتر مایع در مخزن A + ${initialLiquidPerTankL} لیتر مایع در مخزن B`
    },
    {
      stage: 'خون‌گیری سانیه برای رُزه (ساعت ۰۳:۰۰)',
      volume: `${saigneeTotalL} لیتر شیرهٔ رُزه`,
      description: `${saigneePerTankL}L از مخزن A + ${saigneePerTankL}L از مخزن B (پس از Débourbage: ${roseClarifiedFermentL}L تخمیری ← ${roseFinalBottlingL}L رُزه نهایی = ${roseBottles750ml} بطری ۷۵۰mL)`
    },
    {
      stage: 'حجم مایع قرمز پس از سانیه (V_red-ferm)',
      volume: `${redLiquidFermentTotalL} لیتر مایع کل`,
      description: `${redLiquidFermentPerTankL}L در مخزن A + ${redLiquidFermentPerTankL}L در مخزن B (حجم مش هر مخزن = ${redMashAfterSaigneePerTankL}L؛ ضریب مایع به مش = ${params.redMashLiquidYieldFactor})`
    },
    {
      stage: `موازنه در ایستگاه پرسینگ (روز ۶ در SG = ${triggers.pressingSG.toFixed(3)})`,
      volume: `${freeRunTotalL}L آب‌آزاد + ${heavyPressTotalL}L پرس سنگین`,
      description: `${freeRunPerTankL}L آب‌آزاد در هر مخزن + ${heavyPressPerTankL}L پرس سنگین در هر مخزن`
    },
    {
      stage: 'سیفون دُرد سنگین مخمر (روز ۱۰) و سیفون باکتیلس (روز ۲۱)',
      volume: `${rack1PerTankL}L (روز ۱۰) ← ${rack2PerTankL}L (روز ۲۱) در هر مخزن`,
      description: `مجموعاً ${rack1TotalL} لیتر شراب قرمز صاف در روز ۱۰ و ${rack2TotalL} لیتر پس از سیفون باکتیلس در روز ۲۱`
    },
    {
      stage: 'محصول نهایی تراز اول قرمز پس از سرمازدایی (روز ۸۰ تا ۱۰۰)',
      volume: `${finalRedPerTankL} لیتر در هر مخزن`,
      description: `مجموعاً ${finalRedTotalL} لیتر = ${redBottles750ml} بطری ۷۵۰ میلی‌لیتری (کل بطری‌های پروژه با رُزه: ${totalBottles750ml} بطری)`
    }
  ];
  const dynamicMaterials: ProtocolMaterial[] = [
    {
      row: '۱',
      name: 'پرکربنات سدیم (شویندهٔ قلیایی)',
      totalAmount: `${Math.round(400 * scaleFactor)} g`,
      doseRate: '4 g/L آب گرم',
      tankA: '—',
      tankB: '—',
      roseShare: '—',
      purpose: 'شستشوی اولیهٔ ظروف و شیلنگ‌ها پیش از ضدعفونی'
    },
    {
      row: '۲',
      name: 'جوش‌شیرین خوراکی (مشروط)',
      totalAmount: `${Math.round(400 * scaleFactor)} g`,
      doseRate: '2 g/L آب سرد (مشروط)',
      tankA: '—',
      tankB: '—',
      roseShare: '—',
      purpose: 'فقط در صورت سم‌پاشی دیرهنگام گوگرد در باغ'
    },
    {
      row: '۳',
      name: 'اسید سیتریک خوراکی',
      totalAmount: `${Math.round(300 * scaleFactor)} g`,
      doseRate: 'طبق فرمول',
      tankA: '—',
      tankB: '—',
      roseShare: '—',
      purpose: 'آبکشی، ساخت محلول ضدعفونی، الکترود و چوب‌پنبه'
    },
    {
      row: '۴',
      name: 'متابی‌سولفیت پتاسیم (K2S2O5)',
      totalAmount: `${totalWineKmsG.toFixed(2)} g (شراب) + 200 g (ضدعفونی)`,
      doseRate: `کراش: ${params.crushSO2TargetMgL} mg/L SO2\nپس از سانیه: ${params.postSaigneeRedSO2TargetMgL} mg/L\nروز ۱۱: ${params.day11KmsRateGL.toFixed(3)} g/L\nبطری: ~0.030 g/L`,
      tankA: `کراش (${initialLiquidPerTankL}L): ${crushKmsPerTankG.toFixed(2)} g\nساعت ۳.۵ (${redLiquidFermentPerTankL}L): ${postSaigneeKmsPerTankG.toFixed(2)} g\nروز ۱۱ (${rack1PerTankL}L): ${day11KmsPerTankG.toFixed(2)} g\nروز ۹۹ (${finalRedPerTankL}L): ~${preBottlingKmsPerTankG.toFixed(2)} g`,
      tankB: `کراش (${initialLiquidPerTankL}L): ${crushKmsPerTankG.toFixed(2)} g\nساعت ۳.۵ (${redLiquidFermentPerTankL}L): ${postSaigneeKmsPerTankG.toFixed(2)} g\nروز ۱۱ (${rack1PerTankL}L): ${day11KmsPerTankG.toFixed(2)} g\nروز ۹۹ (${finalRedPerTankL}L): ~${preBottlingKmsPerTankG.toFixed(2)} g`,
      roseShare: `پایان تخمیر (${rosePostRackingL}L): ${rosePostFermKmsG.toFixed(2)} g\nروز ۹۹ (${roseFinalBottlingL}L): ~${rosePreBottlingKmsG.toFixed(2)} g\n(پرس سنگین ${heavyPressTotalL}L: ${heavyPressKmsG.toFixed(2)} g)`,
      purpose: 'مهار اکسیداسیون، قفل مالولاکتیک و تنظیم سولفیت آزاد نهایی بر اساس pH'
    },
    {
      row: '۵',
      name: 'پودر آنزیم پکتولیتیک',
      totalAmount: `${pecticEnzymeTotalG.toFixed(2)} g`,
      doseRate: `قرمز: ${params.pecticEnzymeRedRateGL.toFixed(3)} g/L\nرُزه: ${params.pecticEnzymeRoseRateGL.toFixed(3)} g/L`,
      tankA: `${pecticEnzymeRedPerTankG.toFixed(2)} g (در ${redLiquidFermentPerTankL}L)`,
      tankB: `${pecticEnzymeRedPerTankG.toFixed(2)} g (در ${redLiquidFermentPerTankL}L)`,
      roseShare: `${pecticEnzymeRoseG.toFixed(2)} g (در ${saigneeTotalL}L)`,
      purpose: 'شکستن پکتین دیوارهٔ سلولی پوست رشه و شفاف‌سازی رُزه'
    },
    {
      row: '۶',
      name: 'تانن شراب سفید (گالیک)',
      totalAmount: `${whiteTanninTotalG.toFixed(2)} g`,
      doseRate: 'قرمز: 0.030 g/L\nرُزه: 0.035 + 0.015 g/L',
      tankA: `${whiteTanninRedPhase1PerTankG.toFixed(2)} g (در ${redLiquidFermentPerTankL}L)`,
      tankB: `${whiteTanninRedPhase1PerTankG.toFixed(2)} g (در ${redLiquidFermentPerTankL}L)`,
      roseShare: `شروع (${roseClarifiedFermentL}L): ${whiteTanninRoseFermentG.toFixed(2)} g\nروز ۸۵ (${roseFinalBottlingL}L): ${whiteTanninRoseFinishingG.toFixed(2)} g`,
      purpose: 'رسوب پروتئین‌های ناپایدار و مهار آنزیم لاکاز/تیروزیناز'
    },
    {
      row: '۷',
      name: 'تانن مخصوص شراب قرمز',
      totalAmount: `${redTanninTotalG.toFixed(2)} g`,
      doseRate: 'فاز ۱ و ۲: 0.10 g/L\nفینیشینگ: 0.025 g/L',
      tankA: `ساعت ۱۱ (${redLiquidFermentPerTankL}L): ${redTanninPhase1PerTankG.toFixed(2)} g\nدر SG ${triggers.phase2Tannin.toFixed(3)}: ${redTanninPhase2PerTankG.toFixed(2)} g\nروز ۸۵ (${finalRedPerTankL}L): ${redTanninFinishingPerTankG.toFixed(2)} g`,
      tankB: `ساعت ۱۱ (${redLiquidFermentPerTankL}L): ${redTanninPhase1PerTankG.toFixed(2)} g\nدر SG ${triggers.phase2Tannin.toFixed(3)}: ${redTanninPhase2PerTankG.toFixed(2)} g\nروز ۸۵ (${finalRedPerTankL}L): ${redTanninFinishingPerTankG.toFixed(2)} g`,
      roseShare: 'صفر (مطلقاً در رُزه ریخته نشود)',
      purpose: 'تثبیت کووالانسی آنتوسیانین‌های رنگ و ساختار مخملی'
    },
    {
      row: '۸',
      name: 'اسید تارتاریک خوراکی L(+)',
      totalAmount: `ذخیره: ${Math.round(600 * scaleFactor)} g`,
      doseRate: 'طبق تست ۳ لیوانی و کنترل TA',
      tankA: `~ ${Math.round(150 * scaleFactor)}–${Math.round(250 * scaleFactor)} g (هدف pH = ${params.targetRedPH})`,
      tankB: `~ ${Math.round(150 * scaleFactor)}–${Math.round(250 * scaleFactor)} g (هدف pH = ${params.targetRedPH})`,
      roseShare: `~ ${Math.round(50 * scaleFactor)}–${Math.round(80 * scaleFactor)} g (هدف pH = ${params.targetRosePH})`,
      purpose: `تنظیم pH قرمز روی ${params.targetRedPH} و رُزه روی ${params.targetRosePH} با رعایت سقف TA`
    },
    {
      row: '۹',
      name: 'مخمر Lalvin RC-212 (و Rhône 4600 / ICV D47 برای رُزه)',
      totalAmount: `${yeastTotalG.toFixed(2)} g (+ 15 g EC-1118 رزرو)`,
      doseRate: `${params.yeastRateGL.toFixed(2)} g/L`,
      tankA: `${yeastRedPerTankG.toFixed(2)} g (در ${redLiquidFermentPerTankL}L)`,
      tankB: `${yeastRedPerTankG.toFixed(2)} g (در ${redLiquidFermentPerTankL}L)`,
      roseShare: `${yeastRoseG.toFixed(2)} g (در ${roseClarifiedFermentL}L)`,
      purpose: 'تخمیر الکلی با استخراج بالای پلی‌فنول در قرمز و حفظ استرهای گل‌فام در رُزه'
    },
    {
      row: '۱۰',
      name: 'مغذی Go-Ferm',
      totalAmount: `${goFermTotalG.toFixed(2)} g`,
      doseRate: `${round2(params.yeastRateGL * params.goFermMultiplier).toFixed(2)} g/L (${params.goFermMultiplier} × مخمر)`,
      tankA: `${goFermRedPerTankG.toFixed(2)} g`,
      tankB: `${goFermRedPerTankG.toFixed(2)} g`,
      roseShare: `${goFermRoseG.toFixed(2)} g`,
      purpose: 'غنی‌سازی غشای سلولی مخمر با استرول‌ها در آب ۴۳ درجه'
    },
    {
      row: '۱۱',
      name: 'مغذی Fermaid O (۱۰۰٪ نیتروژن ارگانیک)',
      totalAmount: `${fermaidOTotalG.toFixed(2)} g`,
      doseRate: `مرحله ۱: ${params.fermaidO1RedRateGL} g/L\nمرحله ۳: ${params.fermaidO3RedRateGL} g/L (۱۰۰٪ ارگانیک)`,
      tankA: `در SG ${triggers.sna1.toFixed(3)}: ${fermaidO1RedPerTankG.toFixed(2)} g\nدر SG ${triggers.sna3.toFixed(3)}: ${fermaidO3RedPerTankG.toFixed(2)} g`,
      tankB: `در SG ${triggers.sna1.toFixed(3)}: ${fermaidO1RedPerTankG.toFixed(2)} g\nدر SG ${triggers.sna3.toFixed(3)}: ${fermaidO3RedPerTankG.toFixed(2)} g`,
      roseShare: `در SG ${triggers.sna1.toFixed(3)}: ${fermaidO1RoseG.toFixed(2)} g\nدر SG ${triggers.sna3.toFixed(3)}: ${fermaidO3RoseG.toFixed(2)} g`,
      purpose: 'تامین اسیدهای آمینهٔ ۱۰۰٪ ارگانیک پایدار در مرحله ۱ و مرحله ۳ (۱/۲ افت قند)'
    },
    {
      row: '۱۲',
      name: 'مغذی Fermaid K',
      totalAmount: `${fermaidKTotalG.toFixed(2)} g`,
      doseRate: `فقط مرحله ۲ (۱/۳ قند): ${params.fermaidK2RedRateGL} g/L`,
      tankA: `فقط در SG ${triggers.sna2.toFixed(3)}: ${fermaidK2RedPerTankG.toFixed(2)} g`,
      tankB: `فقط در SG ${triggers.sna2.toFixed(3)}: ${fermaidK2RedPerTankG.toFixed(2)} g`,
      roseShare: `فقط در SG ${triggers.sna2.toFixed(3)}: ${fermaidK2RoseG.toFixed(2)} g`,
      purpose: 'تامین تیامین، منیزیم و نیتروژن ترکیبی در اوج تکثیر (ممنوع در ۱/۲ قند)'
    },
    {
      row: '۱۳',
      name: 'دی‌آمونیم فسفات (DAP)',
      totalAmount: `${dapTotalG.toFixed(2)} g`,
      doseRate: `قرمز: ${params.dap2RedRateGL} g/L\nرُزه: ${params.dap2RoseRateGL} g/L`,
      tankA: `فقط در SG ${triggers.sna2.toFixed(3)}: ${dap2RedPerTankG.toFixed(2)} g`,
      tankB: `فقط در SG ${triggers.sna2.toFixed(3)}: ${dap2RedPerTankG.toFixed(2)} g`,
      roseShare: `فقط در SG ${triggers.sna2.toFixed(3)}: ${dap2RoseG.toFixed(2)} g`,
      purpose: 'تامین نیتروژن معدنی سریع در اوج تکثیر سلولی (۱/۳ قند) جهت مهار H2S'
    },
    {
      row: '۱۴',
      name: 'مکمل روی (ZnSO4·7H2O / Wyeast)',
      totalAmount: `${zincTotalG.toFixed(2)} g`,
      doseRate: `${params.zincSafeRateGL.toFixed(3)} g/L (${params.zincSafeRateGL <= 0.003 ? 'سقف ایمن سولفات روی خالص' : 'مخلوط مغذی تجاری'})`,
      tankA: `در SG ${triggers.sna2.toFixed(3)}: ${zincRedPerTankG.toFixed(2)} g`,
      tankB: `در SG ${triggers.sna2.toFixed(3)}: ${zincRedPerTankG.toFixed(2)} g`,
      roseShare: `در SG ${triggers.sna1.toFixed(3)}: ${zincRoseG.toFixed(2)} g`,
      purpose: 'تقویت کوفاکتور روی (Zn²⁺) برای آنزیم الکل دهیدروژناز'
    },
    {
      row: '۱۵',
      name: 'بنتونیت انولوژیک',
      totalAmount: `${bentoniteRoseG.toFixed(2)} g`,
      doseRate: '0.20 g/L (در رُزه)',
      tankA: 'صفر',
      tankB: 'صفر',
      roseShare: `${bentoniteRoseG.toFixed(2)} g (ساعت ۰۵:۳۰ در ${saigneeTotalL}L)`,
      purpose: 'کمک‌لخته‌ساز برای رسوب دادن ذرات کدر و گوگرد معلق در رُزه'
    },
    {
      row: '۱۶',
      name: 'سولفات مس ۵ آبه (CuSO4·5H2O)',
      totalAmount: '1.00 g',
      doseRate: 'محلول استوک ۰.۱٪ (1 mg/mL)',
      tankA: `در صورت نیاز: ${round1(0.25 * rack1PerTankL)}–${round1(0.50 * rack1PerTankL)} mL استوک ۲`,
      tankB: `در صورت نیاز: ${round1(0.25 * rack1PerTankL)}–${round1(0.50 * rack1PerTankL)} mL استوک ۲`,
      roseShare: `در صورت نیاز: ${round1(0.25 * rosePostRackingL)} mL استوک ۲`,
      purpose: 'ساخت ۱ لیتر محلول استوک ۲ جهت تست ۴/۵ لیوانی و حذف H2S (دوز 0.25 mg/L سولفات مس ۵ آبه معادل 0.064 mg/L مس عنصری Cu²⁺)'
    },
    {
      row: '۱۷',
      name: 'Bactiless (کیتوزان لالمند)',
      totalAmount: `${bactilessTotalG.toFixed(2)} g`,
      doseRate: `قرمز: ${params.bactilessRedRateGL} g/L\nرُزه: ${params.bactilessRoseRateGL} g/L`,
      tankA: `${bactilessRedPerTankG.toFixed(2)} g (روز ۱۱ در ${rack1PerTankL}L)`,
      tankB: `${bactilessRedPerTankG.toFixed(2)} g (روز ۱۱ در ${rack1PerTankL}L)`,
      roseShare: `${bactilessRoseG.toFixed(2)} g (در ${rosePostRackingL}L رُزه)\n(+ ${bactilessHeavyPressG.toFixed(2)} g برای ${heavyPressTotalL}L پرس)`,
      purpose: 'لیز کردن غشای باکتریهای مالولاکتیک/استیک (دوز شوک درمانی/قفل کامل: 0.20–0.30 g/L؛ دوز نگهدارنده برچسب: 0.04–0.10 g/L)'
    },
    {
      row: '۱۸',
      name: 'بی‌تارتارات پتاسیم (کرم تارتار)',
      totalAmount: `${khtTotalG.toFixed(2)} g`,
      doseRate: '0.20 g/L (4.0 g در هر گالن ۲۰ لیتری)',
      tankA: `${khtColdStabRedPerTankG.toFixed(2)} g (روز ۶۵ در ${finalRedPerTankL}L)`,
      tankB: `${khtColdStabRedPerTankG.toFixed(2)} g (روز ۶۵ در ${finalRedPerTankL}L)`,
      roseShare: `${khtColdStabRoseG.toFixed(2)} g (در ${rosePostRackingL}L رُزه)\n(+ ${khtColdStabHeavyPressG.toFixed(2)} g در پرس)`,
      purpose: 'بذرپاشی کریستالی استاتیک ۱۴ روزه در +1 °C با دوز 0.20 g/L (در روش صنعتی همزدن پیوسته ۲۴ ساعته: ۱ تا ۴ g/L)'
    },
    {
      row: '۱۹',
      name: 'گلیسیرین خوراکی خالص (مشروط به تست)',
      totalAmount: `حداکثر ${glycerinTotalMaxG.toFixed(1)} g (${Math.round(glycerinTotalMaxG / 1.26)} mL)`,
      doseRate: `قرمز: تا ${params.redMaxGlycerinGL} g/L\nرُزه: تا ${params.roseMaxGlycerinGL} g/L`,
      tankA: `تا ${glycerinRedMaxPerTankG.toFixed(1)} g (${Math.round(glycerinRedMaxPerTankG / 1.26)} mL در ${finalRedPerTankL}L)`,
      tankB: `تا ${glycerinRedMaxPerTankG.toFixed(1)} g (${Math.round(glycerinRedMaxPerTankG / 1.26)} mL در ${finalRedPerTankL}L)`,
      roseShare: `تا ${glycerinRoseMaxG.toFixed(1)} g (${round1(glycerinRoseMaxG / 1.26)} mL در ${roseFinalBottlingL}L)`,
      purpose: 'گرد کردن حس دهانی پس از تایید در تست حسی ۳ لیوانی روز ۸۵'
    },
    {
      row: '۲۰',
      name: 'ال-اسید اسکوربیک (ویتامین C)',
      totalAmount: `${ascorbicTotalG.toFixed(2)} g`,
      doseRate: `${params.ascorbicRateGL.toFixed(3)} g/L (${Math.round(params.ascorbicRateGL * 1000)} mg/L)`,
      tankA: `${ascorbicRedPerTankG.toFixed(2)} g (۳۰ دقیقه قبل از بطری در ${finalRedPerTankL}L)`,
      tankB: `${ascorbicRedPerTankG.toFixed(2)} g (۳۰ دقیقه قبل از بطری در ${finalRedPerTankL}L)`,
      roseShare: `${ascorbicRoseG.toFixed(2)} g (در ${roseFinalBottlingL}L) + 1.00 g استوک ۲B`,
      purpose: 'حذف اکسیژن محلول گلوگاه بطری در لحظهٔ بطری‌گذاری (مشروط به Free SO2 ≥ 30 mg/L)'
    }
  ];
  return {
    params,
    scaleFactor,
    volumes: {
      totalCrushedMashL,
      crushedMashPerTankL,
      initialLiquidL,
      initialLiquidPerTankL,
      saigneeTotalL,
      saigneePerTankL,
      roseClarifiedFermentL,
      rosePostRackingL,
      roseFinalBottlingL,
      roseBottles750ml,
      redMashAfterSaigneePerTankL,
      redLiquidFermentPerTankL,
      redLiquidFermentTotalL,
      freeRunPerTankL,
      freeRunTotalL,
      rack1PerTankL,
      rack1TotalL,
      rack2PerTankL,
      rack2TotalL,
      finalRedPerTankL,
      finalRedTotalL,
      redBottles750ml,
      heavyPressTotalL,
      heavyPressPerTankL,
      totalBottles750ml
    },
    triggers,
    dosages: {
      crushKmsPerTankG,
      postSaigneeKmsPerTankG,
      day11KmsPerTankG,
      preBottlingKmsPerTankG,
      rosePostFermKmsG,
      rosePreBottlingKmsG,
      heavyPressKmsG,
      totalWineKmsG,
      pecticEnzymeRedPerTankG,
      pecticEnzymeRoseG,
      pecticEnzymeTotalG,
      whiteTanninRedPhase1PerTankG,
      whiteTanninRoseFermentG,
      whiteTanninRoseFinishingG,
      whiteTanninTotalG,
      redTanninPhase1PerTankG,
      redTanninPhase2PerTankG,
      redTanninFinishingPerTankG,
      redTanninTotalG,
      yeastRedPerTankG,
      yeastRoseG,
      yeastTotalG,
      goFermRedPerTankG,
      goFermRoseG,
      goFermTotalG,
      fermaidO1RedPerTankG,
      fermaidO1RoseG,
      fermaidO3RedPerTankG,
      fermaidO3RoseG,
      fermaidOTotalG,
      fermaidK2RedPerTankG,
      fermaidK2RoseG,
      fermaidKTotalG,
      dap2RedPerTankG,
      dap2RoseG,
      dapTotalG,
      zincRedPerTankG,
      zincRoseG,
      zincTotalG,
      bentoniteRoseG,
      bactilessRedPerTankG,
      bactilessRoseG,
      bactilessHeavyPressG,
      bactilessTotalG,
      khtColdStabRedPerTankG,
      khtColdStabRoseG,
      khtColdStabHeavyPressG,
      khtTotalG,
      glycerinRedMaxPerTankG,
      glycerinRoseMaxG,
      glycerinTotalMaxG,
      ascorbicRedPerTankG,
      ascorbicRoseG,
      ascorbicTotalG
    },
    nitrogen: {
      sugarGPerL,
      targetYANMgL,
      neededYANMgL,
      suppliedChemicalYANRedMgL,
      suppliedBioEquivalentYANRedMgL,
      baseBioEquivalentYANMgL,
      unmetBioEquivalentYANMgL,
      yanAccountingBasisFa
    },
    dynamicMaterials,
    dynamicVolumeBalances
  };
}
const FLEXIBLE_PROTOCOL_STORAGE_KEY = 'enology_flexible_protocol_params_v1';
const FLEXIBLE_PROTOCOL_SYNC_EVENT = 'enology-flexible-protocol-sync';
function loadStoredFlexibleParams(): FlexibleProtocolParams {
  if (typeof window === 'undefined') {
    return IDEAL_DEFAULT_PROTOCOL_PARAMS;
  }
  try {
    const raw = window.localStorage.getItem(FLEXIBLE_PROTOCOL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...IDEAL_DEFAULT_PROTOCOL_PARAMS,
        ...parsed
      };
    }
  } catch (err) {
    console.warn('Error reading flexible protocol params from localStorage:', err);
  }
  return IDEAL_DEFAULT_PROTOCOL_PARAMS;
}
export function getCurrentDynamicProtocolPlan(): DynamicProtocolPlan {
  return computeDynamicProtocolPlan(loadStoredFlexibleParams());
}
function sanitizeProtocolParamsSnapshot(
  snapshot?: Record<string, number | string> | null
): Partial<FlexibleProtocolParams> | null {
  if (!snapshot || typeof snapshot !== 'object') return null;
  const sanitized: Record<string, number | string> = {};
  for (const [k, val] of Object.entries(snapshot)) {
    if (k === 'presetId') {
      if (val === 'conservative_ideal' || val === 'classic_v32' || val === 'custom') {
        sanitized[k] = val;
      }
    } else if (typeof val === 'number' && Number.isFinite(val)) {
      sanitized[k] = val;
    }
  }
  return Object.keys(sanitized).length > 0 ? (sanitized as Partial<FlexibleProtocolParams>) : null;
}
export function getEffectiveProtocolPlanForBatch(
  batch?: { protocolParamsSnapshot?: Record<string, number | string> } | null,
  explicitPlan?: DynamicProtocolPlan,
  preferExplicit: boolean = false
): DynamicProtocolPlan {
  const sanitizedSnapshot = sanitizeProtocolParamsSnapshot(batch?.protocolParamsSnapshot);
  if (!preferExplicit && sanitizedSnapshot) {
    return computeDynamicProtocolPlan(sanitizedSnapshot);
  }
  if (explicitPlan) {
    return explicitPlan;
  }
  if (sanitizedSnapshot) {
    return computeDynamicProtocolPlan(sanitizedSnapshot);
  }
  return getCurrentDynamicProtocolPlan();
}
export type FlexibleProtocolSyncListener = (params: FlexibleProtocolParams) => void;
const flexibleProtocolSyncListeners = new Set<FlexibleProtocolSyncListener>();
export function onFlexibleProtocolSync(listener: FlexibleProtocolSyncListener): () => void {
  flexibleProtocolSyncListeners.add(listener);
  return () => {
    flexibleProtocolSyncListeners.delete(listener);
  };
}
export function notifyFlexibleProtocolSync(next: FlexibleProtocolParams): void {
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(FLEXIBLE_PROTOCOL_STORAGE_KEY, JSON.stringify(next));
    } catch (err) {
      console.warn('Error saving flexible protocol params:', err);
    }
  }
  for (const listener of flexibleProtocolSyncListeners) {
    try {
      listener(next);
    } catch (err) {
      console.warn('Error in flexible protocol sync listener:', err);
    }
  }
  if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
    try {
      window.dispatchEvent(new CustomEvent(FLEXIBLE_PROTOCOL_SYNC_EVENT, { detail: next }));
    } catch (err) {
      console.warn('Error dispatching flexible protocol sync event:', err);
    }
  }
}
export function useFlexibleProtocol() {
  const [params, setParamsState] = useState<FlexibleProtocolParams>(loadStoredFlexibleParams);
  const persistAndBroadcast = useCallback(
    (
      nextOrUpdater:
        | FlexibleProtocolParams
        | ((prev: FlexibleProtocolParams) => FlexibleProtocolParams)
    ) => {
      setParamsState((prev) => {
        const next =
          typeof nextOrUpdater === 'function' ? nextOrUpdater(prev) : nextOrUpdater;
        notifyFlexibleProtocolSync(next);
        return next;
      });
    },
    []
  );
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleSync = (e: Event) => {
      const customEvent = e as CustomEvent<FlexibleProtocolParams>;
      if (customEvent.detail) {
        setParamsState(customEvent.detail);
      }
    };
    window.addEventListener(FLEXIBLE_PROTOCOL_SYNC_EVENT, handleSync);
    return () => window.removeEventListener(FLEXIBLE_PROTOCOL_SYNC_EVENT, handleSync);
  }, []);
  const updateParam = useCallback(
    <K extends Exclude<keyof FlexibleProtocolParams, 'presetId'>>(
      key: K,
      value: FlexibleProtocolParams[K]
    ) => {
      persistAndBroadcast((prev) => ({
        ...prev,
        [key]: value,
        presetId: 'custom'
      }));
    },
    [persistAndBroadcast]
  );
  const updateParams = useCallback(
    (partial: Partial<Omit<FlexibleProtocolParams, 'presetId'>>) => {
      persistAndBroadcast((prev) => ({
        ...prev,
        ...partial,
        presetId: 'custom'
      }));
    },
    [persistAndBroadcast]
  );
  const applyPreset = useCallback(
    (presetId: 'conservative_ideal' | 'classic_v32') => {
      const target =
        presetId === 'classic_v32' ? CLASSIC_V32_PROTOCOL_PARAMS : IDEAL_DEFAULT_PROTOCOL_PARAMS;
      persistAndBroadcast({ ...target });
    },
    [persistAndBroadcast]
  );
  const resetParamToIdeal = useCallback(
    <K extends Exclude<keyof FlexibleProtocolParams, 'presetId'>>(key: K) => {
      persistAndBroadcast((prev) => {
        const next: FlexibleProtocolParams = {
          ...prev,
          [key]: IDEAL_DEFAULT_PROTOCOL_PARAMS[key]
        };
        const allMatchIdeal = FLEXIBLE_PARAM_METADATA.every(
          (m) => next[m.key] === IDEAL_DEFAULT_PROTOCOL_PARAMS[m.key]
        );
        next.presetId = allMatchIdeal ? 'conservative_ideal' : 'custom';
        return next;
      });
    },
    [persistAndBroadcast]
  );
  const resetAllToIdeal = useCallback(() => {
    persistAndBroadcast({ ...IDEAL_DEFAULT_PROTOCOL_PARAMS });
  }, [persistAndBroadcast]);
  const isModifiedFromIdeal = useMemo(
    () =>
      FLEXIBLE_PARAM_METADATA.some(
        (m) => params[m.key] !== IDEAL_DEFAULT_PROTOCOL_PARAMS[m.key]
      ),
    [params]
  );
  const plan = useMemo(() => computeDynamicProtocolPlan(params), [params]);
  return {
    params,
    plan,
    updateParam,
    updateParams,
    applyPreset,
    resetParamToIdeal,
    resetAllToIdeal,
    isModifiedFromIdeal
  };
}
```

### `src/utils/enologyUtils.ts` (921 compact lines)
```ts
import type {
  ChemicalAddition,
  StructuredCompoundType,
  TankId
} from '../types/index.ts';
import { MASTER_PROTOCOL_CONFIG } from '../data/masterProtocolConfig.ts';
export function isAlreadyLiquidVolume(volumeL: number): boolean {
  const rounded = Math.round(volumeL);
  return (
    rounded === MASTER_PROTOCOL_CONFIG.volumes.redLiquidFermentPerTankL ||
    rounded === MASTER_PROTOCOL_CONFIG.volumes.redLiquidFermentTotalL ||
    rounded === MASTER_PROTOCOL_CONFIG.volumes.initialLiquidPerTankL ||
    rounded === MASTER_PROTOCOL_CONFIG.volumes.initialLiquidL ||
    rounded === MASTER_PROTOCOL_CONFIG.volumes.roseClarifiedFermentL
  );
}
export type VolumeBasis = 'liquid_phase' | 'gross_mash';
export function getEffectiveLiquidVolume(
  volumeL: number,
  isUnpressedRedMustOrBasis: boolean | VolumeBasis = false,
  mashYieldFactor: number = 0.84
): number {
  if (volumeL <= 0) return 0;
  const isGrossMash = isUnpressedRedMustOrBasis === true || isUnpressedRedMustOrBasis === 'gross_mash';
  const factor = isGrossMash ? (mashYieldFactor > 0 && mashYieldFactor <= 1 ? mashYieldFactor : 0.84) : 1.0;
  return Math.round(volumeL * factor * 100) / 100;
}
export function calculateKMS(
  volumeL: number,
  currentSO2: number,
  targetSO2: number,
  isUnpressedRedMust: boolean | VolumeBasis = false,
  mashYieldFactor: number = 0.84
): number {
  if (volumeL <= 0) return 0;
  const effectiveVol = getEffectiveLiquidVolume(volumeL, isUnpressedRedMust, mashYieldFactor);
  const diff = Math.max(0, targetSO2 - currentSO2);
  return Math.round(((diff * effectiveVol) / 576) * 100) / 100;
}
const HYDROMETER_CALIBRATION_POINTS: ReadonlyArray<readonly [number, number]> = [
  [10, -0.0016],
  [12, -0.0013],
  [14, -0.0010],
  [16, -0.0007],
  [18, -0.0004],
  [20, 0.0000],
  [22, 0.0004],
  [24, 0.0009],
  [26, 0.0014],
  [28, 0.0020],
  [30, 0.0026],
  [32, 0.0032]
];
export function normalizeEnologyNumericInput(
  raw: string | number,
  mode: 'sg' | 'general' = 'general'
): number | null {
  let parsed: number;
  if (typeof raw === 'number') {
    if (!Number.isFinite(raw)) return null;
    parsed = raw;
  } else {
    const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
    const arabicDigits = '٠١٢٣٤٥٦٧٨٩';
    let cleaned = String(raw);
    for (let i = 0; i < 10; i++) {
      cleaned = cleaned
        .replace(new RegExp(persianDigits[i], 'g'), String(i))
        .replace(new RegExp(arabicDigits[i], 'g'), String(i));
    }
    cleaned = cleaned.replace(/\s+/g, '');
    if (!cleaned || cleaned.includes('/') || !/^[+-]?\d+(?:[.,٫،]\d+)*$/.test(cleaned)) {
      return null;
    }
    cleaned = cleaned.replace(/[٫،]/g, ',');
    if (cleaned.includes(',') && cleaned.includes('.')) {
      cleaned = cleaned.replace(/,/g, '');
    } else if (cleaned.includes(',')) {
      const commaCount = (cleaned.match(/,/g) || []).length;
      if (
        commaCount > 1 ||
        (mode === 'general' && /^[+-]?\d{1,3}(,\d{3})+$/.test(cleaned))
      ) {
        cleaned = cleaned.replace(/,/g, '');
      } else {
        cleaned = cleaned.replace(/,/g, '.');
      }
    }
    if ((cleaned.match(/\./g) || []).length > 1) {
      return null;
    }
    parsed = Number.parseFloat(cleaned);
    if (Number.isNaN(parsed) || !Number.isFinite(parsed)) return null;
  }
  if (mode === 'sg' && Number.isInteger(parsed) && parsed >= 980 && parsed <= 1150) {
    return Math.round((parsed / 1000) * 10000) / 10000;
  }
  return parsed;
}
export function correctHydrometer(
  measuredSG: number,
  tempC: number,
  calibrationTempC: 20 | 15.5 = 20
): { trueSG: number; delta: number; isAbove32CWarning?: boolean; warningFa?: string } {
  let delta = 0;
  if (tempC <= HYDROMETER_CALIBRATION_POINTS[0][0]) {
    delta = HYDROMETER_CALIBRATION_POINTS[0][1];
  } else if (tempC > 32) {
    delta = 0.0032 + (tempC - 32) * 0.0003;
  } else if (tempC >= HYDROMETER_CALIBRATION_POINTS[HYDROMETER_CALIBRATION_POINTS.length - 1][0]) {
    delta = HYDROMETER_CALIBRATION_POINTS[HYDROMETER_CALIBRATION_POINTS.length - 1][1];
  } else {
    for (let i = 0; i < HYDROMETER_CALIBRATION_POINTS.length - 1; i++) {
      const [t0, d0] = HYDROMETER_CALIBRATION_POINTS[i];
      const [t1, d1] = HYDROMETER_CALIBRATION_POINTS[i + 1];
      if (tempC >= t0 && tempC <= t1) {
        const fraction = (tempC - t0) / (t1 - t0);
        delta = d0 + fraction * (d1 - d0);
        break;
      }
    }
  }
  if (calibrationTempC === 15.5) {
    delta += 0.0008;
  }
  const roundedDelta = Math.round(delta * 10000) / 10000;
  const trueSG = Math.round((measuredSG + roundedDelta) * 10000) / 10000;
  if (tempC > 32) {
    return {
      trueSG,
      delta: roundedDelta,
      isAbove32CWarning: true,
      warningFa: 'نمونه را خنک کنید؛ فرمول فقط تا ۳۲ °C دقیق است'
    };
  }
  return { trueSG, delta: roundedDelta };
}
export function calculateScaleVolumes(grapeKg: number) {
  if (grapeKg <= 0) {
    return {
      mashVolume: 0,
      liquidVolume: 0,
      saigneeVolume: 0,
      roseFinalVolume: 0,
      redFinalVolume: 0,
    };
  }
  const factor = grapeKg / MASTER_PROTOCOL_CONFIG.metadata.grapeWeightKg;
  return {
    mashVolume: Math.round(MASTER_PROTOCOL_CONFIG.volumes.totalCrushedMashL * factor),
    liquidVolume: Math.round(MASTER_PROTOCOL_CONFIG.volumes.initialLiquidL * factor),
    saigneeVolume: Math.round(MASTER_PROTOCOL_CONFIG.volumes.saigneeRoseRawL * factor),
    roseFinalVolume: Math.round(MASTER_PROTOCOL_CONFIG.volumes.roseFinalBottlingL * factor),
    redFinalVolume: Math.round(
      MASTER_PROTOCOL_CONFIG.volumes.postPressFreeRunConservativePerTankL * 2 * factor
    ),
  };
}
export function calculateTitratableAcidity(
  vNaOH_mL: number,
  nNaOH: number = 0.1,
  vSample_mL: number = 5
): number {
  if (vSample_mL <= 0 || vNaOH_mL <= 0) return 0;
  const ta = (vNaOH_mL * nNaOH * 75) / vSample_mL;
  return Math.round(ta * 100) / 100;
}
export function calculateTartaricAddition(
  currentTA: number,
  targetTA: number,
  volumeL: number,
  isUnpressedRedMust: boolean | VolumeBasis = false,
  mashYieldFactor: number = 0.84
): number {
  if (volumeL <= 0) return 0;
  const effectiveVol = getEffectiveLiquidVolume(volumeL, isUnpressedRedMust, mashYieldFactor);
  const diff = Math.max(0, targetTA - currentTA);
  return Math.round(diff * effectiveVol * 10) / 10;
}
export function estimateAcidOrBaseFromPHShift(
  currentPH: number,
  targetPH: number,
  effectiveVolumeL: number
): {
  mode: 'acidification' | 'deacidification' | 'none';
  reagentFa: string;
  lowBufferGrams: number;
  typicalBufferGrams: number;
  highBufferGrams: number;
  isEmpiricalEstimateOnly: true;
  warningFa: string;
} {
  const vol = Math.max(0, effectiveVolumeL);
  if (currentPH > targetPH && vol > 0) {
    const steps = (currentPH - targetPH) / 0.1;
    return {
      mode: 'acidification',
      reagentFa: 'اسید تارتاریک L(+)',
      lowBufferGrams: Math.round(steps * 0.75 * vol * 10) / 10,
      typicalBufferGrams: Math.round(steps * 1.00 * vol * 10) / 10,
      highBufferGrams: Math.round(steps * 1.35 * vol * 10) / 10,
      isEmpiricalEstimateOnly: true,
      warningFa:
        'تخمین تجربی بر پایه ظرفیت بافری میانگین (صرفاً برای شروع تست ۳ لیوانی — غیرقابل تزریق مستقیم بدون سنجش TA!)'
    };
  }
  if (currentPH < targetPH && vol > 0) {
    const steps = (targetPH - currentPH) / 0.1;
    return {
      mode: 'deacidification',
      reagentFa: 'بیکربنات پتاسیم (KHCO3)',
      lowBufferGrams: Math.round(steps * 0.90 * vol * 10) / 10,
      typicalBufferGrams: Math.round(steps * 1.20 * vol * 10) / 10,
      highBufferGrams: Math.round(steps * 1.50 * vol * 10) / 10,
      isEmpiricalEstimateOnly: true,
      warningFa:
        'تخمین تجربی بر پایه ظرفیت بافری میانگین (صرفاً برای شروع تست ۳ لیوانی — استوکیومتری دقیق نیازمند ΔTA است!)'
    };
  }
  return {
    mode: 'none',
    reagentFa: 'بدون نیاز به اصلاح',
    lowBufferGrams: 0,
    typicalBufferGrams: 0,
    highBufferGrams: 0,
    isEmpiricalEstimateOnly: true,
    warningFa: ''
  };
}
export function calculateDeacidificationOptions(
  deltaTA_gL: number,
  effectiveVolumeL: number
): {
  khco3StoichiometricGrams: number;
  khco3WithColdStabGrams: number;
  caco3Grams: number;
} {
  if (deltaTA_gL <= 0 || effectiveVolumeL <= 0) {
    return {
      khco3StoichiometricGrams: 0,
      khco3WithColdStabGrams: 0,
      caco3Grams: 0
    };
  }
  const {
    khco3GramsPerGL_TA,
    khco3WithColdStabGramsPerGL_TA,
    caco3GramsPerGL_TA
  } = MASTER_PROTOCOL_CONFIG.stoichiometry;
  return {
    khco3StoichiometricGrams: Math.round(deltaTA_gL * khco3GramsPerGL_TA * effectiveVolumeL * 10) / 10,
    khco3WithColdStabGrams: Math.round(deltaTA_gL * khco3WithColdStabGramsPerGL_TA * effectiveVolumeL * 10) / 10,
    caco3Grams: Math.round(deltaTA_gL * caco3GramsPerGL_TA * effectiveVolumeL * 10) / 10
  };
}
export function calculateKHCO3Deacidification(
  currentPH: number,
  targetMinPH: number,
  volumeL: number,
  isUnpressedRedMust: boolean | VolumeBasis = false,
  deltaTA_gL?: number,
  mashYieldFactor: number = 0.84
): number {
  if (volumeL <= 0) return 0;
  const effectiveVol = getEffectiveLiquidVolume(volumeL, isUnpressedRedMust, mashYieldFactor);
  const khco3Rate = MASTER_PROTOCOL_CONFIG.stoichiometry.khco3GramsPerGL_TA;
  if (deltaTA_gL !== undefined && deltaTA_gL > 0) {
    return Math.round(deltaTA_gL * khco3Rate * effectiveVol * 10) / 10;
  }
  if (currentPH >= targetMinPH) return 0;
  return estimateAcidOrBaseFromPHShift(currentPH, targetMinPH, effectiveVol).typicalBufferGrams;
}
export function calculateFreeSO2Ripper(
  vI2_mL: number,
  nI2: number = 0.02,
  vSample_mL: number = 25
): number {
  if (vSample_mL <= 0 || vI2_mL <= 0) return 0;
  const freeSO2 = (vI2_mL * nI2 * 32 * 1000) / vSample_mL;
  return Math.round(freeSO2 * 10) / 10;
}
export function calculateMolecularSO2(freeSO2_ppm: number, pH: number): number {
  if (freeSO2_ppm <= 0 || pH <= 0) return 0;
  const denominator = 1 + Math.pow(10, pH - 1.81);
  const molecular = freeSO2_ppm / denominator;
  return Math.round(molecular * 100) / 100;
}
export function calculateRefractometerCorrection(
  origBrix: number,
  currentRefractometerBrix: number
): {
  trueBrix: number;
  trueSG: number;
  abv: number;
  isWortEmpiricalApproximation: true;
  disclaimerFa: string;
} {
  const disclaimerFa =
    'تخمین تجربی اپتیکی (کالیبرهشده با چگالی اولیه؛ برای تصمیمگیریهای حساس SNA و پرسینگ صرفاً به هیدرومتر استناد شود)';
  if (origBrix <= 0) {
    return { trueBrix: 0, trueSG: 1.0, abv: 0, isWortEmpiricalApproximation: true, disclaimerFa };
  }
  const ob = origBrix;
  const cb = currentRefractometerBrix;
  const origSG = Math.round((1 + ob / (258.6 - ob * 0.88)) * 10000) / 10000;
  const terrillAt = (o: number, c: number) =>
    1.001843 -
    0.002318474 * o -
    0.000007775 * Math.pow(o, 2) -
    0.000000034 * Math.pow(o, 3) +
    0.00574 * c +
    0.00003344 * Math.pow(c, 2) +
    0.000000086 * Math.pow(c, 3);
  const calibratedSG = cb >= ob ? origSG : terrillAt(ob, cb) + (origSG - terrillAt(ob, ob));
  const roundedSG = Math.max(0.985, Math.round(calibratedSG * 10000) / 10000);
  if (cb >= ob) {
    return {
      trueBrix: Math.round(ob * 10) / 10,
      trueSG: roundedSG,
      abv: 0,
      isWortEmpiricalApproximation: true,
      disclaimerFa
    };
  }
  const trueBrix = Math.max(0, Math.round(((roundedSG - 1.0) / 0.004) * 10) / 10);
  const rawAbv =
    roundedSG >= origSG || origSG >= 1.775
      ? 0
      : ((76.08 * (origSG - roundedSG)) / (1.775 - origSG)) * (roundedSG / 0.794);
  const abv = Math.max(0, Math.round(rawAbv * 10) / 10);
  return { trueBrix, trueSG: roundedSG, abv, isWortEmpiricalApproximation: true, disclaimerFa };
}
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
) {
  const effectiveVolumeL = getEffectiveLiquidVolume(Math.max(0, volumeL), isUnpressedRedMust, mashYieldFactor);
  const explicitSG = typeof sgOrStrain === 'number' ? sgOrStrain : sgOptional;
  const effectiveBrix =
    explicitSG && explicitSG > 0 && brix === 22 && Math.abs(explicitSG - 1.092) >= 0.004
      ? Math.max(0, Math.round(261.3 * (1 - 1 / explicitSG) * 10) / 10)
      : Math.max(0, brix);
  const strainMultiplier =
    sgOrStrain === 'low' ? 0.75 : sgOrStrain === 'high' ? 1.10 : 1.05;
  const initialSG =
    explicitSG && explicitSG > 0
      ? explicitSG
      : effectiveBrix > 0
      ? Math.round((1 + effectiveBrix / (258.6 - effectiveBrix * 0.88)) * 1000) / 1000
      : 1.0;
  const sugarGPerL = Math.round(effectiveBrix * 10 * initialSG * 10) / 10;
  const sugarGL = Math.round(sugarGPerL);
  const targetYAN = Math.round(sugarGL * strainMultiplier);
  const neededYAN = Math.max(0, targetYAN - naturalYAN);
  const baselineNeededYAN = 152;
  const yanScale = neededYAN > 0 ? neededYAN / baselineNeededYAN : 0;
  const fermaidO1Rate = customRates?.fermaidO1RateGL ?? 0.25;
  const fermaidK2Rate = customRates?.fermaidK2RateGL ?? 0.25;
  const dap2Rate = customRates?.dap2RateGL ?? 0.15;
  const fermaidO3Rate = customRates?.fermaidO3RateGL ?? 0.30;
  const zincRate =
    customRates?.zincRateGL ??
    MASTER_PROTOCOL_CONFIG.stoichiometry.zincSulfateHeptahydrateSafeRateGPerL;
  const fermaidO_1 = Math.round(fermaidO1Rate * yanScale * effectiveVolumeL * 100) / 100;
  const fermaidK_2 = Math.round(fermaidK2Rate * yanScale * effectiveVolumeL * 100) / 100;
  const dap_2 = Math.round(Math.min(0.30, dap2Rate * yanScale) * effectiveVolumeL * 100) / 100;
  const zinc_2 = Math.round(zincRate * effectiveVolumeL * 100) / 100;
  const fermaidO_3 = Math.round(fermaidO3Rate * yanScale * effectiveVolumeL * 100) / 100;
  const fermaidOGPerL = effectiveVolumeL > 0 ? (fermaidO_1 + fermaidO_3) / effectiveVolumeL : 0;
  const fermaidKGPerL = effectiveVolumeL > 0 ? fermaidK_2 / effectiveVolumeL : 0;
  const dapGPerL = effectiveVolumeL > 0 ? dap_2 / effectiveVolumeL : 0;
  const suppliedChemicalYAN_mgL =
    effectiveVolumeL > 0
      ? Math.round((fermaidOGPerL * 40 + fermaidKGPerL * 100 + dapGPerL * 212) * 10) / 10
      : 0;
  const suppliedBioEquivalentYAN_mgL =
    effectiveVolumeL > 0
      ? Math.round((fermaidOGPerL * 120 + fermaidKGPerL * 100 + dapGPerL * 212) * 10) / 10
      : 0;
  const additionalFermaidOForPureChemicalParityG = Math.max(
    0,
    Math.round(((neededYAN - suppliedChemicalYAN_mgL) / 40) * effectiveVolumeL * 100) / 100
  );
  return {
    initialSG,
    effectiveVolumeL,
    sugarGL,
    sugarGPerL,
    targetYAN,
    neededYAN,
    fermaidO_1,
    fermaidK_2,
    dap_2,
    zinc_2,
    fermaidO_3,
    fermaidK_3: 0,
    suppliedChemicalYAN_mgL,
    suppliedBioEquivalentYAN_mgL,
    additionalFermaidOForPureChemicalParityG,
    zincNoteFa:
      'با توجه به حضور ریزمغذی روی در Go-Ferm و Fermaid K، دوز سولفات روی خالص (ZnSO4·7H2O) روی سقف ایمن ۲ mg/L (معادل ۰.۴۵ mg/L یون روی عنصری) قفل شده است.'
  };
}
export function calculateBenchFiningGrams(doseG_per_L: number, tankVolume_L: number): number {
  if (doseG_per_L <= 0 || tankVolume_L <= 0) return 0;
  return Math.round(doseG_per_L * tankVolume_L * 100) / 100;
}
export function calculateCoolingDryIceKg(
  volumeL: number,
  currentTempC: number,
  targetTempC: number = 26,
  sg: number = 1.080,
  efficiency: number = 0.65
): number {
  if (volumeL <= 0 || currentTempC <= targetTempC) return 0;
  const effectiveSG = sg > 0 ? sg : 1.080;
  const effectiveEfficiency = efficiency > 0 && efficiency <= 1 ? efficiency : 0.65;
  const deltaT = currentTempC - targetTempC;
  const heatToExtractKJ = volumeL * effectiveSG * 3.9 * deltaT;
  const dryIceKg = heatToExtractKJ / (571 * effectiveEfficiency);
  return Math.round(dryIceKg * 100) / 100;
}
export function getTargetFreeSO2ByPH(
  ph: number,
  isRose: boolean = false
): { min: number; max: number; target: number } {
  void isRose;
  if (ph <= 3.30) return { min: 20, max: 26, target: 24 };
  if (ph <= 3.40) return { min: 24, max: 32, target: 28 };
  if (ph <= 3.50) return { min: 30, max: 40, target: 35 };
  if (ph <= 3.60) return { min: 37, max: 49, target: 42 };
  const clampedPH = Math.min(4.2, ph);
  const hhRatio =
    (1 + Math.pow(10, clampedPH - 1.81)) / (1 + Math.pow(10, 3.60 - 1.81));
  return {
    min: Math.round(37 * hhRatio),
    max: Math.round(49 * hhRatio),
    target: Math.round(42 * hhRatio)
  };
}
export function getContinuousTargetFreeSO2ByPH(
  ph: number,
  isRose: boolean = false,
  targetMolecularMgL?: number
): {
  min: number;
  max: number;
  target: number;
  targetMolecularMgL: number;
  formulaText: string;
} {
  const clampedPH = Math.max(2.8, Math.min(4.2, Number.isFinite(ph) ? ph : 3.5));
  const factor = 1 + Math.pow(10, clampedPH - 1.81);
  const effectiveTargetMolecular =
    targetMolecularMgL !== undefined && targetMolecularMgL > 0
      ? targetMolecularMgL
      : isRose
      ? 0.75
      : 0.65;
  const minMolecular = isRose ? 0.60 : 0.55;
  const maxMolecular = isRose ? 0.85 : 0.80;
  const min = Math.round(Math.max(18, minMolecular * factor) * 10) / 10;
  const target = Math.round(Math.max(22, effectiveTargetMolecular * factor) * 10) / 10;
  const max = Math.round(Math.max(target, maxMolecular * factor) * 10) / 10;
  return {
    min,
    max,
    target,
    targetMolecularMgL: effectiveTargetMolecular,
    formulaText: `Free SO2 = ${effectiveTargetMolecular} × (1 + 10^(pH - 1.81))`
  };
}
export type ScalePrecisionGrams = 1 | 0.1 | 0.01;
export type StockCompoundCategory =
  | 'zinc'
  | 'kms'
  | 'copper'
  | 'tartaric'
  | 'fermaid_or_yeast'
  | 'general';
export function calculateStockSolutionPlan(
  targetDoseGrams: number,
  scalePrecisionGrams: ScalePrecisionGrams = 0.1,
  compoundCategory: StockCompoundCategory = 'general'
): {
  needsStockSolution: boolean;
  canUseStockSolution: boolean;
  targetDoseGrams: number;
  scalePrecisionGrams: ScalePrecisionGrams;
  stockMassGrams: number;
  stockVolumeMl: number;
  syringeVolumeMl: number;
  roundedDirectGrams: number;
  directWeighErrorPct: number;
  instructionFa: string;
  stabilityNoteFa: string;
} {
  const safeTarget = Math.max(0, targetDoseGrams);
  const needsStockSolution = safeTarget > 0 && safeTarget < 10 * scalePrecisionGrams;
  const canUseStockSolution = compoundCategory !== 'fermaid_or_yeast';
  let stockMassGrams = Math.max(scalePrecisionGrams * 10, 1.0);
  if (safeTarget >= stockMassGrams) {
    stockMassGrams = Math.ceil(safeTarget / scalePrecisionGrams) * scalePrecisionGrams;
  }
  const stockVolumeMl = 100;
  const syringeVolumeMl =
    safeTarget > 0
      ? Math.round((safeTarget / (stockMassGrams / stockVolumeMl)) * 10) / 10
      : 0;
  const roundedDirectGrams =
    safeTarget > 0
      ? Math.round(
          Math.max(
            scalePrecisionGrams,
            Math.round(safeTarget / scalePrecisionGrams) * scalePrecisionGrams
          ) * 100
        ) / 100
      : 0;
  const directWeighErrorPct =
    safeTarget > 0
      ? Math.round((Math.abs(roundedDirectGrams - safeTarget) / safeTarget) * 100)
      : 0;
  const instructionFa = !canUseStockSolution
    ? `مخمر و مغذی‌های ارگانیک (Fermaid / Go-Ferm) نباید به صورت محلول استوک نگهداری شوند؛ مقدار ${roundedDirectGrams} گرم را مستقیماً وزن و تازه مصرف کنید.`
    : `${stockMassGrams} گرم را وزن کرده و در ${stockVolumeMl} میلی‌لیتر آب مقطر حل کنید؛ سپس ${syringeVolumeMl} میلی‌لیتر از آن را با سرنگ بردارید.`;
  let stabilityNoteFa =
    'محلول استوک تازه را در ظرف شیشه‌ای تمیز با آب مقطر تهیه کنید.';
  if (compoundCategory === 'fermaid_or_yeast') {
    stabilityNoteFa =
      'ممنوعیت استوک: مخمر و مغذی‌های مخمری (Fermaid O/K, Go-Ferm) سوسپانسیون زیستی هستند و قابلیت نگهداری به صورت محلول استوک را ندارند.';
  } else if (compoundCategory === 'kms') {
    stabilityNoteFa =
      'هشدار پایداری KMS: محلول متابی‌سولفیت پتاسیم به سرعت گاز SO2 آزاد کرده و اکسید می‌شود؛ حتماً در همان روز تهیه و مصرف گردد.';
  } else if (compoundCategory === 'zinc' || compoundCategory === 'copper' || compoundCategory === 'tartaric') {
    stabilityNoteFa =
      'پایداری بالا: محلول استوک املاح معدنی (سولفات روی، سولفات مس) و اسید تارتاریک در بطری دربسته و جای خنک تا ۶ ماه پایدار است.';
  }
  return {
    needsStockSolution,
    canUseStockSolution,
    targetDoseGrams: safeTarget,
    scalePrecisionGrams,
    stockMassGrams,
    stockVolumeMl,
    syringeVolumeMl,
    roundedDirectGrams,
    directWeighErrorPct,
    instructionFa,
    stabilityNoteFa
  };
}
export function calculateDynamicSGTriggers(
  initialSG: number = 1.092,
  overrides?: { pressingPoint?: number; drynessPoint?: number }
): {
  initialSG: number;
  sna1: number;
  sna2: number;
  oneThirdCeiling: number;
  phase2Tannin: number;
  sna3: number;
  pressingPoint: number;
  drynessPoint: number;
} {
  const sg0 = !Number.isFinite(initialSG) || initialSG <= 0 ? 1.092 : Math.max(1.020, initialSG);
  const span = sg0 - 1.000;
  const pressingPoint = Math.round((overrides?.pressingPoint ?? 1.008) * 1000) / 1000;
  const drynessPoint = Math.round((overrides?.drynessPoint ?? 0.993) * 1000) / 1000;
  return {
    initialSG: Math.round(sg0 * 1000) / 1000,
    sna1: Math.round((sg0 - 0.10 * span) * 1000) / 1000,
    sna2: Math.round((sg0 - 0.24 * span) * 1000) / 1000,
    oneThirdCeiling: Math.round((sg0 - 0.33 * span) * 1000) / 1000,
    phase2Tannin: Math.round((sg0 - 0.35 * span) * 1000) / 1000,
    sna3: Math.round((sg0 - 0.38 * span) * 1000) / 1000,
    pressingPoint,
    drynessPoint
  };
}
export function calculateH2O2SulfiteRemoval(
  volumeL: number,
  currentSO2: number,
  targetSO2: number = 35
): number {
  const effectiveTarget = Math.max(10, targetSO2);
  if (volumeL <= 0 || currentSO2 <= effectiveTarget) return 0;
  const excessSO2 = currentSO2 - effectiveTarget;
  const ml3Percent = excessSO2 * 0.0177 * volumeL;
  return Math.round(ml3Percent * 100) / 100;
}
export function calculateStagedH2O2Plan(
  volumeL: number,
  currentSO2: number,
  targetSO2: number = 35
): {
  effectiveTargetSO2: number;
  totalExcessSO2MgL: number;
  maxSingleStepReductionMgL: number;
  currentStepReductionMgL: number;
  totalTheoretical3PercentMl: number;
  maxCurrentStep3PercentMl: number;
  recommendedSafeTrialStep1Ml: number;
  dilutedUnder1PercentTotalVolumeMl: number;
  stagesRequired: number;
  requiresReMeasurementBeforeNextStage: true;
} {
  const effectiveTargetSO2 = Math.max(10, targetSO2);
  const totalExcessSO2MgL = Math.max(0, Math.round((currentSO2 - effectiveTargetSO2) * 10) / 10);
  const maxSingleStepReductionMgL = 25;
  const currentStepReductionMgL = Math.min(maxSingleStepReductionMgL, totalExcessSO2MgL);
  const totalTheoretical3PercentMl = calculateH2O2SulfiteRemoval(volumeL, currentSO2, effectiveTargetSO2);
  const maxCurrentStep3PercentMl =
    Math.round(currentStepReductionMgL * 0.0177 * Math.max(0, volumeL) * 100) / 100;
  const recommendedSafeTrialStep1Ml = Math.round(maxCurrentStep3PercentMl * 0.50 * 100) / 100;
  const dilutedUnder1PercentTotalVolumeMl = Math.round(maxCurrentStep3PercentMl * 3.5 * 10) / 10;
  const stagesRequired = totalExcessSO2MgL > 0 ? Math.ceil(totalExcessSO2MgL / maxSingleStepReductionMgL) : 0;
  return {
    effectiveTargetSO2,
    totalExcessSO2MgL,
    maxSingleStepReductionMgL,
    currentStepReductionMgL,
    totalTheoretical3PercentMl,
    maxCurrentStep3PercentMl,
    recommendedSafeTrialStep1Ml,
    dilutedUnder1PercentTotalVolumeMl,
    stagesRequired,
    requiresReMeasurementBeforeNextStage: true
  };
}
export type CalculatorDirectDoseKind =
  | 'kms_so2'
  | 'tartaric_ta'
  | 'khco3_ta'
  | 'ph_shift'
  | 'sna_1'
  | 'sna_2'
  | 'sna_3'
  | 'fining_bentonite'
  | 'copper_stock_ml'
  | 'post_press_day11_lock'
  | 'finishing_glycerin';
export function buildCalculatorDirectAdditions(params: {
  kind: CalculatorDirectDoseKind;
  batchId: string;
  tankId: TankId;
  timestamp: string;
  currentSG?: number;
  referenceVolumeL: number;
  primaryAmount: number;
  secondaryAmount?: number;
  tertiaryAmount?: number;
  calculatedSO2MgL?: number;
  phShiftMode?: 'acidification' | 'deacidification' | 'none';
  noteFa?: string;
}): Array<Omit<ChemicalAddition, 'id'>> {
  if (params.primaryAmount <= 0 || params.referenceVolumeL <= 0) {
    return [];
  }
  const round2 = (val: number) => Math.round(val * 100) / 100;
  const baseFields = {
    batchId: params.batchId,
    tankId: params.tankId,
    timestamp: params.timestamp,
    sgAtAddition: params.currentSG,
    referenceVolumeL: params.referenceVolumeL,
    isDemo: false
  };
  switch (params.kind) {
    case 'kms_so2':
      return [
        {
          ...baseFields,
          compoundName: 'پتاسیم متابیسولفیت (KMS)',
          compoundType: 'kms' as StructuredCompoundType,
          pubchemCid: 24446,
          amount: round2(params.primaryAmount),
          unit: 'g',
          calculatedSO2MgL: params.calculatedSO2MgL,
          stageTitle: 'ثبت مستقیم از ماشین‌حساب سولفیت (SOP-TEST-04)',
          purpose:
            params.noteFa ||
            'تنظیم سولفیت آزاد بر اساس pH و حجم مایع مؤثر'
        }
      ];
    case 'tartaric_ta':
      return [
        {
          ...baseFields,
          compoundName: 'اسید تارتاریک خوراکی L(+)',
          compoundType: 'tartaric' as StructuredCompoundType,
          pubchemCid: 875,
          amount: round2(params.primaryAmount),
          unit: 'g',
          stageTitle: 'ثبت مستقیم از ماشین‌حساب اسیدیته کل (SOP-TEST-02)',
          purpose:
            params.noteFa ||
            'افزایش اسیدیته قابل تیتر (TA) به محدوده هدف'
        }
      ];
    case 'khco3_ta':
      return [
        {
          ...baseFields,
          compoundName: 'بی‌کربنات پتاسیم (KHCO3)',
          compoundType: 'khco3' as StructuredCompoundType,
          amount: round2(params.primaryAmount),
          unit: 'g',
          stageTitle: 'ثبت مستقیم اسیدزدایی از ماشین‌حساب TA (SOP-TEST-02)',
          purpose:
            params.noteFa ||
            'کاهش اسیدیته کل (TA) بر پایه استوکیومتری'
        }
      ];
    case 'ph_shift': {
      if (params.phShiftMode === 'none') return [];
      const isAcid = params.phShiftMode === 'acidification';
      return [
        {
          ...baseFields,
          compoundName: isAcid
            ? 'اسید تارتاریک خوراکی L(+)'
            : 'بی‌کربنات پتاسیم (KHCO3)',
          compoundType: (isAcid ? 'tartaric' : 'khco3') as StructuredCompoundType,
          amount: round2(params.primaryAmount),
          unit: 'g',
          stageTitle: 'ثبت مستقیم از ماشین‌حساب تنظیم pH (SOP-TEST-03)',
          purpose:
            params.noteFa || 'تنظیم pH پس از تایید تست ۳ لیوانی'
        }
      ];
    }
    case 'sna_1':
      return [
        {
          ...baseFields,
          compoundName: 'نیتروژن آلی (Fermaid O)',
          compoundType: 'fermaid_o' as StructuredCompoundType,
          amount: round2(params.primaryAmount),
          unit: 'g',
          milestoneId: 'sna-1',
          stageTitle: 'تغذیه نوبت اول مخمر (SNA-1)',
          purpose: 'تامین نیتروژن آلی اسیدهای آمینه در نوبت اول تغذیه'
        }
      ];
    case 'sna_2': {
      const items: Array<Omit<ChemicalAddition, 'id'>> = [
        {
          ...baseFields,
          compoundName: 'مکمل مخمر Fermaid K',
          compoundType: 'fermaid_k' as StructuredCompoundType,
          amount: round2(params.primaryAmount),
          unit: 'g',
          milestoneId: 'sna-2-dap',
          stageTitle: 'تغذیه نوبت دوم مخمر (SNA-2 در ۱/۳ افت قند)',
          purpose: 'تامین نیتروژن ترکیبی و تیامین در SNA-2'
        },
        {
          ...baseFields,
          compoundName: 'دی‌آمونیوم فسفات (DAP)',
          compoundType: 'dap' as StructuredCompoundType,
          pubchemCid: 24261,
          amount: round2(params.secondaryAmount ?? 0),
          unit: 'g',
          milestoneId: 'sna-2-dap',
          stageTitle: 'تغذیه نوبت دوم مخمر (SNA-2 در ۱/۳ افت قند)',
          purpose: 'تامین آمونیوم معدنی پیش از سقف ۱/۳ قند'
        },
        {
          ...baseFields,
          compoundName: 'سولفات روی هپتاهیدرات (ZnSO4·7H2O)',
          compoundType: 'zinc' as StructuredCompoundType,
          amount: round2(params.tertiaryAmount ?? 0),
          unit: 'g',
          milestoneId: 'sna-2-dap',
          stageTitle: 'تغذیه نوبت دوم مخمر (SNA-2 در ۱/۳ افت قند)',
          purpose: 'تامین کوفاکتور روی در سقف ایمن ۲ mg/L'
        }
      ];
      return items.filter((item) => item.amount > 0);
    }
    case 'sna_3':
      return [
        {
          ...baseFields,
          compoundName: 'نیتروژن آلی (Fermaid O)',
          compoundType: 'fermaid_o' as StructuredCompoundType,
          amount: round2(params.primaryAmount),
          unit: 'g',
          milestoneId: 'sna-3-organic',
          stageTitle: 'تغذیه نوبت سوم ۱۰۰٪ ارگانیک (SNA-3)',
          purpose: 'تغذیه نهایی ۱۰۰٪ ارگانیک بدون نمک آمونیوم'
        }
      ];
    case 'fining_bentonite':
      return [
        {
          ...baseFields,
          compoundName: 'بنتونیت انولوژیک (Bentonite)',
          compoundType: 'bentonite' as StructuredCompoundType,
          amount: round2(params.primaryAmount),
          unit: 'g',
          stageTitle: 'ثبت مستقیم از ماشین‌حساب زلال‌سازی (SOP-TEST-08)',
          purpose: 'شفاف‌سازی و حذف پروتئین‌های ناپایدار پس از تست لیوانی'
        }
      ];
    case 'copper_stock_ml':
      return [
        {
          ...baseFields,
          compoundName: 'محلول استوک ۰.۱٪ سولفات مس (CuSO4·5H2O)',
          compoundType: 'copper' as StructuredCompoundType,
          amount: round2(params.primaryAmount),
          unit: 'mL',
          stageTitle: 'اصلاح بوی احیایی H2S با استوک سولفات مس (SOP-TEST-08)',
          purpose: 'حذف سولفید هیدروژن پس از تایید تست ۵ لیوانی'
        }
      ];
    case 'post_press_day11_lock': {
      const items: Array<Omit<ChemicalAddition, 'id'>> = [
        {
          ...baseFields,
          compoundName: 'کیتوزان قارچی (Bactiless)',
          compoundType: 'bactiless' as StructuredCompoundType,
          amount: round2(params.primaryAmount),
          unit: 'g',
          milestoneId: 'day11-bactiless-kms-lock',
          stageTitle: 'روز ۱۱ - قفل کیتوزان ضدباکتری (Bactiless No-MLF Lock)',
          purpose: 'حذف باکتری‌های مالولاکتیک و استیک'
        },
        {
          ...baseFields,
          compoundName: 'پتاسیم متابیسولفیت (KMS)',
          compoundType: 'kms' as StructuredCompoundType,
          pubchemCid: 24446,
          amount: round2(params.secondaryAmount ?? 0),
          unit: 'g',
          calculatedSO2MgL: params.calculatedSO2MgL ?? 40,
          milestoneId: 'day11-bactiless-kms-lock',
          stageTitle: 'روز ۱۱ - تثبیت سولفیت پس از تخمیر',
          purpose: 'تثبیت شراب خشک پس از سیفون اول'
        }
      ];
      return items.filter((item) => item.amount > 0);
    }
    case 'finishing_glycerin':
      return [
        {
          ...baseFields,
          compoundName: 'گلیسیرین خوراکی خالص (Food-Grade Glycerin)',
          compoundType: 'glycerin' as StructuredCompoundType,
          amount: round2(params.primaryAmount),
          unit: 'g',
          stageTitle: 'روز ۸۵ - اصلاح حس دهانی با گلیسیرین (SOP-TEST-08)',
          purpose: 'گرد کردن ساختار تانن پس از تست ۳ لیوانی'
        }
      ];
    default:
      return [];
  }
}
export interface GraduatedSyringeMetrics {
  volumeMl: number;
  barrelCapacityMl: 1 | 5 | 10 | 20 | 50 | 100;
  fillRatio: number;
  liquidWidth: number;
  plungerX: number;
  majorTicks: Array<{ ml: number; x: number }>;
}
export function computeGraduatedSyringeMetrics(
  syringeVolumeMl: number
): GraduatedSyringeMetrics {
  const volumeMl = Math.max(
    0,
    Math.round((Number.isFinite(syringeVolumeMl) ? syringeVolumeMl : 0) * 100) /
      100
  );
  let barrelCapacityMl: 1 | 5 | 10 | 20 | 50 | 100;
  if (volumeMl <= 1) {
    barrelCapacityMl = 1;
  } else if (volumeMl <= 5) {
    barrelCapacityMl = 5;
  } else if (volumeMl <= 10) {
    barrelCapacityMl = 10;
  } else if (volumeMl <= 20) {
    barrelCapacityMl = 20;
  } else if (volumeMl <= 50) {
    barrelCapacityMl = 50;
  } else {
    barrelCapacityMl = 100;
  }
  const fillRatio = Math.min(1, Math.max(0, volumeMl / barrelCapacityMl));
  const liquidWidth = Math.round(fillRatio * 140 * 10) / 10;
  const plungerX = Math.round((34 + liquidWidth) * 10) / 10;
  const majorTicks: Array<{ ml: number; x: number }> = [];
  for (let i = 0; i <= 5; i++) {
    majorTicks.push({
      ml: Math.round(barrelCapacityMl * (i / 5) * 10) / 10,
      x: Math.round((34 + 140 * (i / 5)) * 10) / 10
    });
  }
  return {
    volumeMl,
    barrelCapacityMl,
    fillRatio,
    liquidWidth,
    plungerX,
    majorTicks
  };
}
```

### `src/utils/trackingCalculations.ts` (1157 compact lines)
```ts
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
export function calculateFermentationProgress(
  sg: number,
  initialSG: number = MASTER_PROTOCOL_CONFIG.metadata.targetInitialSG,
  finalSG: number = MASTER_PROTOCOL_CONFIG.metadata.redFinalSG
): number {
  const totalSpan = initialSG - finalSG;
  if (totalSpan <= 0) return 0;
  const consumed = initialSG - sg;
  return Math.min(100, Math.max(0, Math.round((consumed / totalSpan) * 100)));
}
export function calculateAlcoholByVolume(
  initialSG: number,
  currentSG: number
): number {
  if (currentSG >= initialSG || initialSG >= 1.775 || currentSG <= 0) return 0;
  const abv = ((76.08 * (initialSG - currentSG)) / (1.775 - initialSG)) * (currentSG / 0.794);
  return Math.max(0, Math.round(abv * 10) / 10);
}
export function brixToSpecificGravity(brix: number): number {
  if (brix <= 0) return 1.000;
  const sg = 1 + brix / (258.6 - brix * 0.88);
  return Math.round(sg * 1000) / 1000;
}
export function specificGravityToBrix(sg: number): number {
  if (sg <= 1.000) return 0;
  const brix = 261.3 * (1 - 1 / sg);
  return Math.max(0, Math.round(brix * 10) / 10);
}
export function getCapTemperatureAlertLevel(
  tempCap: number,
  isRose: boolean = false,
  currentSG: number = 1.050
): 'normal' | 'caution' | 'warning' | 'danger' {
  if (currentSG <= 0.995) {
    if (tempCap > MASTER_PROTOCOL_CONFIG.temperatures.finishedWineAging.dangerAbove) return 'danger';
    if (tempCap > MASTER_PROTOCOL_CONFIG.temperatures.finishedWineAging.warningAbove) return 'warning';
    if (tempCap > MASTER_PROTOCOL_CONFIG.temperatures.finishedWineAging.optimalMax) return 'caution';
    return 'normal';
  }
  if (!isRose && currentSG > 0.995 && currentSG <= 1.008) {
    if (tempCap < 18.5 || tempCap > 26.0) return 'warning';
    if (tempCap >= 21.0 && tempCap <= 22.5) return 'normal';
    return 'caution';
  }
  if (isRose) {
    if (tempCap >= MASTER_PROTOCOL_CONFIG.temperatures.roseActiveFermentation.crisisDanger) return 'danger';
    if (tempCap > MASTER_PROTOCOL_CONFIG.temperatures.roseActiveFermentation.optimalMax) return 'warning';
    if (tempCap >= 17.5) return 'caution';
    return 'normal';
  }
  if (tempCap >= MASTER_PROTOCOL_CONFIG.temperatures.redActiveMaceration.warningCeiling) return 'danger';
  if (tempCap >= MASTER_PROTOCOL_CONFIG.temperatures.redActiveMaceration.optimalMax) return 'warning';
  if (tempCap >= 27.0) return 'caution';
  return 'normal';
}
function parseTimeHourFromDateTime(dateTime?: string): number | null {
  if (!dateTime) return null;
  const normalized = dateTime
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 1776))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632));
  const match = normalized.match(/(\d{1,2}):(\d{2})/);
  if (!match) return null;
  const hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  if (isNaN(hours) || isNaN(minutes)) return null;
  return hours + minutes / 60;
}
export function sortFermentationLogs(logs: FermentationLogEntry[]): FermentationLogEntry[] {
  return [...logs].sort((a, b) => {
    if (a.dayNumber !== b.dayNumber) return a.dayNumber - b.dayNumber;
    if (a.timestampMs !== undefined && b.timestampMs !== undefined && a.timestampMs !== b.timestampMs) {
      return a.timestampMs - b.timestampMs;
    }
    const hourA = parseTimeHourFromDateTime(a.dateTime);
    const hourB = parseTimeHourFromDateTime(b.dateTime);
    if (hourA !== null && hourB !== null && hourA !== hourB) {
      return hourA - hourB;
    }
    if (a.sg !== b.sg) return b.sg - a.sg;
    return a.id.localeCompare(b.id);
  });
}
export interface LogParameterHealth {
  paramName: string;
  value: string;
  targetRange: string;
  status: 'ideal' | 'good' | 'warning' | 'danger';
  note: string;
}
export interface LogHealthAnalysis {
  isIdeal: boolean;
  statusBadge: string;
  statusColor: 'emerald' | 'amber' | 'rose' | 'blue';
  healthScore: number;
  detailedDescription: string;
  recommendedAction: string;
  parameters: LogParameterHealth[];
}
export function analyzeLogEntryHealth(
  log: FermentationLogEntry,
  tankId: TankId = 'tank-a',
  recordedAdditions: ChemicalAddition[] = [],
  planOverride?: DynamicProtocolPlan
): LogHealthAnalysis {
  const isRose = tankId === 'tank-rose';
  const sg = log.sg;
  const tempCap = log.tempCap;
  const ph = log.ph;
  const tankAdditions =
    log.isBenchmark === true
      ? []
      : recordedAdditions.filter(
          (a) =>
            (!a.tankId || a.tankId === tankId) &&
            (!log.batchId || !a.batchId || a.batchId === log.batchId)
        );
  const batch = log.batchId ? enologyDb.getBatchById(log.batchId) : undefined;
  const plan = getEffectiveProtocolPlanForBatch(batch, planOverride);
  const triggers = plan.triggers;
  const dynTriggers = calculateDynamicSGTriggers(triggers.initialSG, {
    pressingPoint: triggers.pressingSG,
    drynessPoint: isRose ? 0.991 : triggers.drynessSG
  });
  const drynessTargetSG = isRose ? 0.991 : triggers.drynessSG;
  const parameters: LogParameterHealth[] = [];
  let score = 100;
  const sgTol = MASTER_PROTOCOL_CONFIG.stoichiometry.sgTriggerTolerance;
  const practicalTol = Math.max(sgTol, 0.0035);
  const midOneThirdAndTannin2 = (triggers.oneThirdCeiling + triggers.phase2Tannin) / 2;
  const midTannin2AndSna3 = (triggers.phase2Tannin + triggers.sna3) / 2;
  let sgStatus: 'ideal' | 'good' | 'warning' | 'danger' = 'ideal';
  let sgNote = 'مطابق با منحنی استاندارد تخمیر';
  if (sg > triggers.initialSG + 0.003) {
    sgStatus = 'warning';
    sgNote = 'غلیظ‌تر از بریکس اولیه هدف (۲۲° Bx)';
    score -= 10;
  } else if (Math.abs(sg - triggers.sna1) <= practicalTol) {
    sgNote = 'نقطه طلایی تزریق SNA-1 (افت ۱۰٪ قند)';
  } else if (Math.abs(sg - triggers.sna2) <= practicalTol) {
    sgNote = 'نقطه طلایی تزریق SNA-2 (افت ۲۴ تا ۲۵٪ قند — تزریق Fermaid K + DAP)';
  } else if (Math.abs(sg - triggers.oneThirdCeiling) <= practicalTol && sg > midOneThirdAndTannin2) {
    sgNote = `مرز ۱/۳ افت قند (SG = ${triggers.oneThirdCeiling.toFixed(3)} — آخرین مهلت مجاز مصرف نیتروژن معدنی DAP)`;
  } else if (
    !isRose &&
    Math.abs(sg - triggers.phase2Tannin) <= practicalTol &&
    sg <= midOneThirdAndTannin2 &&
    sg > midTannin2AndSna3
  ) {
    sgNote = 'زمان تزریق تانن فاز ۲ + جمع‌آوری هسته‌ها از کف';
  } else if (Math.abs(sg - triggers.sna3) <= practicalTol && (isRose || sg <= midTannin2AndSna3)) {
    sgNote = 'سقف نهایی تغذیه SNA-3 (صرفاً نیتروژن ۱۰۰٪ ارگانیک Fermaid O)';
  } else if (
    !isRose &&
    (Math.abs(sg - triggers.pressingSG) <= sgTol || Math.abs(sg - triggers.pressingSG) <= practicalTol)
  ) {
    sgNote = 'نقطه طلایی پرسینگ و جداسازی پوست انگور رشه';
  } else if (sg <= drynessTargetSG + 0.001) {
    sgNote = 'SG در محدوده هدف خشکی (احتمال پایان تخمیر — نیازمند ثبات ۴۸ ساعته هیدرومتر و تایید آزمون قند احیاکننده Clinitest < 2 g/L)';
  }
  parameters.push({
    paramName: 'وزن مخصوص (SG)',
    value: sg.toFixed(3),
    targetRange: `${triggers.initialSG.toFixed(3)} → ${drynessTargetSG.toFixed(3)}`,
    status: sgStatus,
    note: sgNote
  });
  const redWarnTemp = plan.params.redCapWarningTempC ?? 28.5;
  const redDangerTemp = plan.params.redCapDangerTempC ?? 30.0;
  let tempStatus: 'ideal' | 'good' | 'warning' | 'danger' = 'ideal';
  let tempNote = 'دمای کلاهک/مایع در محدوده خنک و بهینه است';
  let tempTargetRange = isRose ? '16–18 °C' : `20–${redWarnTemp} °C (سقف ${redDangerTemp}°C)`;
  if (sg <= 0.995) {
    tempTargetRange = '14–16 °C (نگهداری) / 0–2 °C (سرمازدایی)';
    if (tempCap > 24.0) {
      tempStatus = 'danger';
      tempNote = 'خطر جدی اکسیداسیون و فعالیت استوباکتر در شراب تمام‌شده!';
      score -= 35;
    } else if (tempCap > 20.0) {
      tempStatus = 'warning';
      tempNote = 'دمای شراب تمام‌شده بالاست؛ به ۱۴–۱۵ درجه کاهش دهید';
      score -= 18;
    } else {
      tempNote = 'دمای نگهداری شراب تمام‌شده کاملاً ایمن است';
    }
  } else if (!isRose && sg > 0.995 && sg <= triggers.pressingSG) {
    tempTargetRange = '21–22.5 °C (فاز مایع پس از پرس)';
    if (tempCap < 18.5) {
      tempStatus = 'warning';
      tempNote = 'خطر توقف تخمیر پس از پرسینگ در اثر سرمایش (بحران ۴)';
      score -= 18;
    } else if (tempCap > 26.0) {
      tempStatus = 'warning';
      tempNote = 'دمای فاز مایع بالاتر از حد بهینه ۲۲°C است';
      score -= 15;
    } else {
      tempNote = 'دمای بهینه برای مصرف ۳۰g/L قند نهایی در فاز مایع';
    }
  } else if (isRose) {
    if (tempCap >= 19.5) {
      tempStatus = 'danger';
      tempNote = 'خطر از دست رفتن استرهای میوه‌ای رُزه (دما بالای ۱۹.۵°C)';
      score -= 25;
    } else if (tempCap > 18.0) {
      tempStatus = 'warning';
      tempNote = 'نزدیک سقف دمای تخمیر رُزه (۱۸°C)';
      score -= 10;
    } else if (tempCap < 14.0) {
      tempStatus = 'warning';
      tempNote = 'سرمایش بیش از حد و کندی تخمیر رُزه';
      score -= 12;
    }
  } else {
    if (tempCap >= 32.0) {
      tempStatus = 'danger';
      tempNote = 'بحران ۱: شوک حرارتی مرگبار مخمر (≥ 32°C) و خطر سرکه!';
      score -= 40;
    } else if (tempCap >= redDangerTemp) {
      tempStatus = 'danger';
      tempNote = `عبور از سقف مجاز ${redDangerTemp.toFixed(1)}°C - نیازمند ورود ۳ تا ۴ بطری یخ استریل`;
      score -= 22;
    } else if (tempCap >= redWarnTemp) {
      tempStatus = 'warning';
      tempNote = `نزدیک به سقف ${redDangerTemp.toFixed(1)}°C (بالای ${redWarnTemp}°C) - آماده‌باش بطری یخ زیر کلاهک`;
      score -= 10;
    } else if (tempCap >= 20.0 && tempCap < redWarnTemp) {
      tempNote = 'دمای عالی برای استخراج آنتوسیانین‌ها و تانن رشه';
    } else if (tempCap < 18.0) {
      tempStatus = 'warning';
      tempNote = 'دمای پایین‌تر از حد استخراج بهینه رنگ (۲۰°C)';
      score -= 10;
    }
  }
  parameters.push({
    paramName: 'دمای کلاهک / مایع (°C)',
    value: `${tempCap}°C`,
    targetRange: tempTargetRange,
    status: tempStatus,
    note: tempNote
  });
  let phStatus: 'ideal' | 'good' | 'warning' | 'danger' = 'ideal';
  let phNote = 'پایداری میکروبی و رنگی عالی';
  const idealPH = isRose ? (plan.params.targetRosePH ?? 3.32) : (plan.params.targetRedPH ?? 3.52);
  if (log.phMeasured === false) {
    phStatus = 'good';
    phNote = `${phNote} (مقدار انتقالی/تخمینی — امروز اندازهگیری نشده است)`;
  } else if (ph < 2.5 || ph > 4.5 || Math.abs(ph - idealPH) > 0.25) {
    phStatus = 'danger';
    phNote = `انحراف بحرانی از pH هدف (${idealPH}) - نیازمند اصلاح فوری`;
    score -= 25;
  } else if (Math.abs(ph - idealPH) > 0.12) {
    phStatus = 'warning';
    phNote = `انحراف از pH هدف (${idealPH}) - بررسی سقف TA و سولفیت آزاد`;
    score -= 10;
  }
  parameters.push({
    paramName: 'اسیدیته فعال (pH)',
    value: ph.toFixed(2),
    targetRange: isRose
      ? `${(idealPH - 0.04).toFixed(2)}–${(idealPH + 0.06).toFixed(2)}`
      : `${(idealPH - 0.04).toFixed(2)}–${(idealPH + 0.06).toFixed(2)}`,
    status: phStatus,
    note: phNote
  });
  if (log.ta !== undefined && log.ta > 0) {
    const taMin = isRose ? 6.0 : 5.8;
    const taMax = isRose ? 7.5 : 7.2;
    let taStatus: 'ideal' | 'good' | 'warning' | 'danger' = 'ideal';
    let taNote = 'تعادل اسیدیته کل در محدوده استاندارد پروتکل (بدون MLF)';
    if (log.taMeasured === false) {
      taStatus = 'good';
      taNote = 'در این نوبت اسیدیته کل آزمایش نشده و مقدار قبلی منتقل شده است (انتقالی — امروز اندازهگیری نشده).';
    } else if (log.ta > 12.0) {
      taStatus = 'danger';
      taNote = 'خطای بحرانی TA (> 12 g/L): بررسی نرمالیته 0.1N سود یا اوردوز اسید!';
      score -= 45;
    } else if (log.ta > 9.0 || log.ta < 4.8) {
      taStatus = 'danger';
      taNote = log.ta > 9.0 ? 'اسیدیته کل بسیار بالا و گزنده - نیازمند اسیدزدایی' : 'کمبود شدید اسیدیته کل و خطر میکروبی';
      score -= 28;
    } else if (log.ta > taMax) {
      taStatus = 'warning';
      taNote = ph > 3.55
        ? 'پارادوکس پتاسیم (pH و TA هم‌زمان بالا): توقف اسیدزنی و اجرای سرمازدایی!'
        : 'کمی بالاتر از سقف پروتکل؛ در سرمازدایی روز ۶۵ رسوب می‌کند';
      score -= 14;
    } else if (log.ta < taMin) {
      taStatus = 'warning';
      taNote = 'کمی کمتر از بازه هدف؛ قابل اصلاح با اسید تارتاریک';
      score -= 12;
    }
    parameters.push({
      paramName: 'اسیدیته کل (TA)',
      value: `${log.ta.toFixed(1)} g/L`,
      targetRange: isRose ? '6.0–7.5 g/L' : '5.8–7.2 g/L (سقف ۷.۵)',
      status: taStatus,
      note: taNote
    });
  }
  if (log.freeSO2 !== undefined && log.freeSO2 >= 0) {
    const effectivePhForSo2 = log.phMeasured === false ? (isRose ? plan.params.targetRosePH : plan.params.targetRedPH) : ph;
    const pHTarget = getContinuousTargetFreeSO2ByPH(effectivePhForSo2, isRose);
    void getTargetFreeSO2ByPH(effectivePhForSo2, isRose);
    let so2Status: 'ideal' | 'good' | 'warning' | 'danger' = 'ideal';
    let so2Note = 'سطح سولفیت آزاد متناسب با pH و مرحله فرآیند';
    let so2TargetStr = sg > 1.005 ? '≤ 35 mg/L (در حین تخمیر)' : `${pHTarget.min}–${pHTarget.max} mg/L (هدف ${pHTarget.target})`;
    if (log.freeSO2Measured === false) {
      so2Status = 'good';
      so2Note = `${so2Note} (انتقالی — امروز اندازهگیری نشده)`;
    } else if (sg > 1.005) {
      if (log.freeSO2 > 55) {
        so2Status = 'danger';
        so2Note = 'مسمومیت سولفیتی مخمر در حین تخمیر و خطر تولید H2S!';
        score -= 28;
      } else if (log.freeSO2 > 40) {
        so2Status = 'warning';
        so2Note = 'سولفیت آزاد بالا در حین تخمیر فعال؛ هوادهی پاششی انجام شود';
        score -= 14;
      }
    } else {
      if (log.freeSO2 > Math.max(75, pHTarget.max + 15)) {
        so2Status = 'danger';
        so2Note = 'اوردوز سولفیت آزاد! خطر رنگ‌پریدگی و نیاز به خنثی‌سازی با H2O2 ۳٪';
        score -= 30;
      } else if (log.freeSO2 > Math.max(60, pHTarget.max + 5)) {
        so2Status = 'warning';
        so2Note = 'بالاتر از محدوده جدول pH';
        score -= 15;
      } else if (log.freeSO2 < 15) {
        so2Status = 'danger';
        so2Note = 'افت بحرانی سولفیت آزاد و خطر اکسیداسیون (افزودن ویتامین C ممنوع!)';
        score -= 24;
      } else if (log.freeSO2 < pHTarget.min) {
        so2Status = 'warning';
        so2Note = `کمتر از حداقل جدول pH (${pHTarget.min} mg/L)؛ نیازمند شارژ KMS`;
        score -= 12;
      }
    }
    if (log.phMeasured === false && log.freeSO2Measured !== false) {
      so2Note += ' (بر مبنای pH هدف؛ pH واقعی امروز سنجش نشده)';
    }
    parameters.push({
      paramName: 'سولفیت آزاد (Free SO2)',
      value: `${log.freeSO2} mg/L`,
      targetRange: so2TargetStr,
      status: so2Status,
      note: so2Note
    });
  }
  let isIdeal = score >= 90;
  let statusBadge = 'ایده‌آل و کاملاً مطبق بر مستر پروتکل';
  let statusColor: 'emerald' | 'amber' | 'rose' | 'blue' = 'emerald';
  let detailedDescription = '';
  let recommendedAction = '';
  if (score < 70) {
    statusBadge = 'خط قرمز - نیازمند مداخله فوری کارگاهی';
    statusColor = 'rose';
  } else if (score < 90) {
    statusBadge = 'مطلوب با نیاز به اصلاح خنک‌سازی / اسیدیته';
    statusColor = 'amber';
  }
  void dynTriggers;
  if (log.dayNumber === 0 || sg >= triggers.initialSG - 0.002) {
    if (isRose) {
      detailedDescription = `آنالیز شیره سانیه رُزه در روز پذیرش و شفاف‌سازی سرد (Débourbage) کاملاً ایده‌آل است. بریکس اولیه ۲۲.۰° Bx و SG اولیه ${triggers.initialSG.toFixed(3)} پتانسیل تولید الکل طبیعی ~۱۳.۸٪ را فراهم می‌آورد. pH اولیه ${ph} در محدوده استاندارد پایداری رنگ مرجانی و مهار میکروبی قرار دارد.`;
      recommendedAction = `شفاف‌سازی سرد (Débourbage) با ${plan.dosages.pecticEnzymeRoseG}g آنزیم پکتیناز و ${plan.dosages.bentoniteRoseG}g بنتونیت، سیفون فاز زلال و گرم کردن تا ۱۸°C، قفل pH روی ${idealPH} با تانن سفید (${plan.dosages.whiteTanninRoseFermentG}g) و تلقیح ${plan.dosages.yeastRoseG}g مخمر RC-212 با ${plan.dosages.goFermRoseG}g Go-Ferm.`;
    } else {
      detailedDescription = `آنالیز شربت انگور رشه سردشت در روز پذیرش کاملاً ایده‌آل است. بریکس اولیه ۲۲.۰° Bx و SG اولیه ${triggers.initialSG.toFixed(3)} (قند واقعی ۲۴۰ گرم بر لیتر با احتساب چگالی) پتانسیل تولید الکل طبیعی ~۱۳.۸٪ (معادله غیرخطی) را فراهم می‌آورد. pH اولیه ${ph} در محدوده استاندارد پایداری رنگ مرجانی و مهار میکروبی قرار دارد.`;
      recommendedAction = 'تزریق دوز اول KMS بر اساس حجم مایع مؤثر، قفل pH روی ۳.۵۲ با اسید تارتاریک، ۷.۵ ساعت استراحت آنزیمی برای شکست پکتین و تلقیح مخمر RC-212 هم‌دماشده.';
    }
  } else if (sg >= triggers.sna1 - practicalTol) {
    detailedDescription = isRose
      ? `فاز رشد تصاعدی مخمرها در تخمیر خنک رُزه (${tempCap}°C در بازه ۱۶–۱۸°C). مصرف قند در بازه ۱۰٪ اولیه قرار دارد و محیط تخمیر عاری از هرگونه بوی گوگرد سرکوب‌شده (H2S) است.`
      : `فاز رشد تصاعدی مخمرها و شروع تولید حباب‌های CO2. مصرف قند در بازه ۱۰٪ اولیه قرار دارد. دمای مرکز کلاهک (${tempCap}°C) به خوبی کنترل شده و محیط تخمیر عاری از هرگونه بوی گوگرد سرکوب‌شده (H2S) است.`;
    if (Math.abs(sg - triggers.sna1) <= practicalTol) {
      const sna1Done = tankAdditions.some(
        (a) => a.stageTitle.includes('SNA-1') || a.compoundName.includes('SNA-1')
      );
      if (isRose) {
        recommendedAction = sna1Done
          ? '✅ دوز تغذیه SNA-1 قبلاً در دفتر ثبت افزودنیهای این مخزن ثبت شده است؛ از تزریق مجدد خودداری کنید و تخمیر خنک ۱۶–۱۸°C را ادامه دهید.'
          : `رسیدن به تریگر SNA-1 رُزه! تزریق ${plan.dosages.fermaidO1RoseG}g Fermaid O + ${plan.dosages.zincRoseG}g مکمل روی در تخمیر خنک ۱۶–۱۸°C (بدون Pigeage).`;
      } else {
        recommendedAction = sna1Done
          ? '✅ دوز تغذیه SNA-1 قبلاً در دفتر ثبت افزودنیهای این مخزن ثبت شده است؛ از تزریق مجدد خودداری کنید و پیژاژ منظم را ادامه دهید.'
          : `رسیدن به تریگر SNA-1! تزریق ${plan.dosages.fermaidO1RedPerTankG} گرم Fermaid O حل‌شده در ۵۰۰mL آب ولرم + گاززدایی ۲ دقیقه‌ای کلاهک و ۴ نوبت Pigeage روزانه.`;
      }
    } else {
      recommendedAction = isRose
        ? `حفظ دمای تخمیر خنک ۱۶–۱۸°C (بدون Pigeage) و آمادگی برای نقطه تریگر SNA-1 در SG=${triggers.sna1.toFixed(3)}.`
        : `ادامه ۴ نوبت Pigeage روزانه، پایش دمای مرکز کلاهک هر ۶ ساعت و آمادگی برای نقطه تریگر SNA-1 در SG=${triggers.sna1.toFixed(3)}.`;
    }
  } else if (sg >= Math.min(1.055, triggers.sna3 - practicalTol)) {
    detailedDescription = isRose
      ? `اوج تخمیر فاز مایع رُزه در دمای خنک ${tempCap}°C جهت سنتز استرهای میوه‌ای و حفظ رنگ مرجانی.`
      : `اوج تخمیر اصلی و استخراج پلی‌فنولی از پوست انگور رشه سردشت. آنتوسیانین‌ها و تانن‌ها در حال پیوند با تانن‌های افزودنی فاز ۱ هستند. دمای ${tempCap}°C سینتیک تخمیر را خنک نگه داشته است.`;
    if (Math.abs(sg - triggers.sna2) <= practicalTol) {
      const sna2Done = tankAdditions.some(
        (a) =>
          a.compoundType === 'dap' ||
          a.compoundType === 'fermaid_k' ||
          a.stageTitle.includes('SNA-2') ||
          a.compoundName.includes('SNA-2')
      );
      if (isRose) {
        recommendedAction = sna2Done
          ? '✅ دوز تغذیه SNA-2 قبلاً در دفتر ثبت افزودنیهای این مخزن ثبت شده است؛ از تزریق مجدد خودداری کنید.'
          : `رسیدن به تریگر SNA-2 رُزه (افت ۲۴ تا ۲۵٪ قند)! تزریق ${plan.dosages.fermaidK2RoseG.toFixed(2)}g Fermaid K + ${plan.dosages.dap2RoseG.toFixed(2)}g DAP در تخمیر خنک ۱۶–۱۸°C بدون Pigeage (قبل از مرز ۱/۳ قند در SG=${triggers.oneThirdCeiling.toFixed(3)}).`;
      } else {
        recommendedAction = sna2Done
          ? '✅ دوز تغذیه SNA-2 قبلاً در دفتر ثبت افزودنیهای این مخزن ثبت شده است؛ از تزریق مجدد خودداری کنید.'
          : `رسیدن به تریگر SNA-2 (افت ۲۴ تا ۲۵٪ قند)! تزریق ${plan.dosages.fermaidK2RedPerTankG.toFixed(2)}g Fermaid K + ${plan.dosages.dap2RedPerTankG.toFixed(2)}g DAP + ${plan.dosages.zincRedPerTankG.toFixed(2)}g سولفات روی همراه با هوادهی پاششی (قبل از مرز ۱/۳ قند در SG=${triggers.oneThirdCeiling.toFixed(3)}).`;
      }
    } else if (Math.abs(sg - triggers.oneThirdCeiling) <= practicalTol && sg > midOneThirdAndTannin2) {
      recommendedAction = `مرز ۱/۳ افت قند (SG = ${triggers.oneThirdCeiling.toFixed(3)}): آخرین مهلت قانونی و بیولوژیکی مصرف نیتروژن معدنی DAP! در صورت عدم تزریق SNA-2، فوراً اقدام شود.`;
    } else if (
      !isRose &&
      Math.abs(sg - triggers.phase2Tannin) <= practicalTol &&
      sg <= midOneThirdAndTannin2 &&
      sg > midTannin2AndSna3
    ) {
      const tannin2Done = tankAdditions.some(
        (a) =>
          a.stageTitle.includes('تانن فاز ۲') ||
          a.stageTitle.includes(triggers.phase2Tannin.toFixed(3)) ||
          a.compoundName.includes('تانن فاز ۲')
      );
      recommendedAction = tannin2Done
        ? '✅ تانن فاز ۲ قبلاً در دفتر ثبت افزودنیهای این مخزن ثبت شده است؛ از تزریق مجدد خودداری کنید.'
        : `تزریق ${plan.dosages.redTanninPhase2PerTankG.toFixed(2)}g تانن قرمز جهت تثبیت رنگ یاقوتی + جمع‌آوری هسته‌های جداشده از کف مخزن شیب‌دار.`;
    } else if (Math.abs(sg - triggers.sna3) <= practicalTol && (isRose || sg <= midTannin2AndSna3)) {
      const sna3Done = tankAdditions.some(
        (a) => a.stageTitle.includes('SNA-3') || a.compoundName.includes('SNA-3')
      );
      const o3Dose = isRose
        ? plan.dosages.fermaidO3RoseG.toFixed(2)
        : plan.dosages.fermaidO3RedPerTankG.toFixed(2);
      recommendedAction = sna3Done
        ? '✅ دوز تغذیه SNA-3 قبلاً در دفتر ثبت افزودنیهای این مخزن ثبت شده است؛ از تزریق مجدد خودداری کنید.'
        : `تزریق نهایی SNA-3 (صرفاً ${o3Dose}g نیتروژن ۱۰۰٪ ارگانیک Fermaid O؛ افزودن نمک‌های معدنی DAP در این سطح الکل ممنوع است!). این سقف مطلق تغذیه نیتروژنی است!`;
    } else {
      const sna2Done = tankAdditions.some(
        (a) =>
          a.compoundType === 'dap' ||
          a.compoundType === 'fermaid_k' ||
          a.stageTitle.includes('SNA-2') ||
          a.compoundName.includes('SNA-2')
      );
      if (sg <= triggers.oneThirdCeiling && !sna2Done) {
        recommendedAction = isRose
          ? `هشدار بسته شدن پنجره DAP در SG = ${triggers.oneThirdCeiling.toFixed(3)}: مصرف نیتروژن معدنی DAP و Fermaid K ممنوع است و صرفاً نیتروژن ارگانیک Fermaid O مجاز است. ادامه تخمیر خنک رُزه در دمای ۱۶–۱۸°C زیر قفل هوا.`
          : `هشدار بسته شدن پنجره DAP در SG = ${triggers.oneThirdCeiling.toFixed(3)}: مصرف نیتروژن معدنی DAP و Fermaid K ممنوع است و صرفاً نیتروژن ارگانیک Fermaid O مجاز است. ادامه غوطه‌ورسازی ملایم کلاهک و کنترل دقیق دمای زیر کلاهک (سقف ۲۸.۵°C).`;
      } else {
        recommendedAction = isRose
          ? 'ادامه تخمیر خنک فاز مایع رُزه در دمای ۱۶–۱۸°C زیر قفل هوا (بدون Pigeage).'
          : 'ادامه غوطه‌ورسازی ملایم کلاهک و کنترل دقیق دمای زیر کلاهک (سقف ۲۸.۵°C).';
      }
    }
  } else if (!isRose && sg >= triggers.pressingSG - practicalTol) {
    detailedDescription = `مرحله پایانی تماس پوست با شیره و نرم شدن بافت تانن روی زبان. قند باقی‌مانده زیر ۳۰ گرم بر لیتر بوده و الکل حاصله (~۱۲.۵٪) استخراج ترکیبات آروماتیک را کامل کرده است.`;
    if (Math.abs(sg - triggers.pressingSG) <= sgTol || Math.abs(sg - triggers.pressingSG) <= practicalTol) {
      recommendedAction = `نقطه طلایی پرسینگ قرمز! توقف کامل Pigeage، خنک‌سازی فوری مخزن با بطری یخ به ۲۲°C و جداسازی ${plan.volumes.freeRunTotalL}L شراب آب‌آزاد (Free-Run) از ${plan.volumes.heavyPressTotalL}L پرس سنگین.`;
    } else {
      recommendedAction = `چشیدن نمونه هر ۸ ساعت برای ارزیابی بافت و آماده‌سازی ظروف دوم جهت پرسینگ در SG=${triggers.pressingSG.toFixed(3)}.`;
    }
  } else if (sg <= drynessTargetSG + 0.001) {
    detailedDescription = `وزن مخصوص شراب به محدوده هدف خشکی (SG = ${sg.toFixed(3)}) رسیده است. با توجه به اثر الکل و عصاره بر چگالی، تأیید خشکی قطعی (قند احیاکننده زیر ۲ گرم بر لیتر) نیازمند ثبات ۴۸ ساعته هیدرومتر و آزمون شیمیایی Clinitest است.`;
    recommendedAction = 'ثبات ۴۸ ساعته هیدرومتر و تایید Clinitest < 2 g/L ← ۳۰ ساعت نگهداری در سرما (۱۵-۱۶°C) ← سیفون شراب زلال به ظروف لب‌به‌لب در روز ۱۰ + اجرای تست ۵ لیوانی مس.';
  } else {
    detailedDescription = isRose
      ? `تخمیر خنک فاز مایع رُزه زیر قفل هوا در دمای ${tempCap}°C با موفقیت در حال سپری شدن است و استرهای میوه‌ای حفظ شده‌اند.`
      : `تخمیر فاز مایع زیر قفل هوا با موفقیت در حال سپری شدن است. غلظت الکل به حداکثر رسیده و اکسیژن پرسینگ توسط مخمرهای باقی‌مانده مصرف شده است.`;
    recommendedAction = `نگهداری ظروف زیر قفل هوا در دمای ۱۵-۱۶°C تا ثبات ۴۸ ساعته SG روی ${drynessTargetSG.toFixed(3)} و تایید Clinitest.`;
  }
  return {
    isIdeal,
    statusBadge,
    statusColor,
    healthScore: Math.max(0, Math.min(100, score)),
    detailedDescription,
    recommendedAction,
    parameters
  };
}
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
export function compareRealLogsWithBenchmark(
  realLogs: FermentationLogEntry[],
  benchmarkLogs: FermentationLogEntry[],
  tankId: TankId = 'tank-a'
): BenchmarkComparison {
  const isRose = tankId === 'tank-rose';
  if (!realLogs || realLogs.length === 0) {
    return {
      hasRealLogs: false,
      alignmentScore: 0,
      sugarDepletionPct: 0,
      statusTitle: 'آماده‌باش ثبت داده‌های واقعی - الگوی مرجع ایده‌آل فعال است',
      statusBadge: 'منحنی الگوی مرجع ایده‌آل',
      statusColor: 'indigo',
      sgDelta: 0,
      tempDelta: 0,
      phDelta: 0,
      brixDelta: 0,
      comparisonDetails:
        'در حال حاضر هیچ داده واقعی توسط شما ثبت نشده است. نمودارها و شاخص‌ها، «الگوی مرجع ایده‌آل تخمیر و استخراج رشه» را نمایش می‌دهند. به محض اینکه اعداد و اندازه‌گیری‌های واقعی کارگاه خود را ثبت کنید، نمودار واقعی به صورت خط ممتد بر روی منحنی مرجع نقطه چین نگاشت خواهد شد تا مقایسه لحظه‌ای داشته باشید.',
      actionableGuidance:
        'جهت شروع ثبت، روی دکمه «ثبت داده واقعی» کلیک کنید یا فرم‌های روزانه نقشه راه را تکمیل کنید.'
    };
  }
  const sortedReal = sortFermentationLogs(realLogs);
  const latestReal = sortedReal[sortedReal.length - 1];
  const sugarDepletionPct = calculateFermentationProgress(
    latestReal.sg,
    MASTER_PROTOCOL_CONFIG.metadata.targetInitialSG,
    isRose ? MASTER_PROTOCOL_CONFIG.metadata.roseFinalSG : MASTER_PROTOCOL_CONFIG.metadata.redFinalSG
  );
  let stageMatchedBench: FermentationLogEntry | undefined;
  let dayMatchedBench: FermentationLogEntry | undefined;
  if (benchmarkLogs.length > 0) {
    stageMatchedBench = benchmarkLogs.reduce((prev, curr) =>
      Math.abs(curr.sg - latestReal.sg) < Math.abs(prev.sg - latestReal.sg) ? curr : prev
    );
    dayMatchedBench =
      benchmarkLogs.find((bm) => bm.dayNumber === latestReal.dayNumber) ??
      benchmarkLogs.reduce((prev, curr) =>
        Math.abs(curr.dayNumber - latestReal.dayNumber) <
        Math.abs(prev.dayNumber - latestReal.dayNumber)
          ? curr
          : prev
      );
  }
  const dayBenchSG = dayMatchedBench
    ? dayMatchedBench.sg
    : stageMatchedBench
    ? stageMatchedBench.sg
    : 1.092;
  const dayBenchBrix = dayMatchedBench
    ? dayMatchedBench.brix
    : stageMatchedBench
    ? stageMatchedBench.brix
    : 22.0;
  const benchTemp = stageMatchedBench ? stageMatchedBench.tempCap : 22.0;
  const benchPH = stageMatchedBench ? stageMatchedBench.ph : 3.52;
  const sgDelta = Math.round((latestReal.sg - dayBenchSG) * 1000) / 1000;
  const tempDelta = Math.round((latestReal.tempCap - benchTemp) * 10) / 10;
  const phDelta = Math.round((latestReal.ph - benchPH) * 100) / 100;
  const brixDelta = Math.round((latestReal.brix - dayBenchBrix) * 10) / 10;
  let totalDevScore = 0;
  let maxDatasetError = 0;
  sortedReal.forEach((r) => {
    let b = benchmarkLogs.find((bm) => bm.dayNumber === r.dayNumber);
    if (!b && benchmarkLogs.length > 0) {
      b = benchmarkLogs.reduce((prev, curr) =>
        Math.abs(curr.dayNumber - r.dayNumber) < Math.abs(prev.dayNumber - r.dayNumber) ? curr : prev
      );
    }
    const bSG = b ? b.sg : 1.092;
    const bT = b ? b.tempCap : 22.0;
    const sgErr = Math.abs(r.sg - bSG) / 0.025;
    const tErr = Math.abs(r.tempCap - bT) / 3.0;
    const pointMax = Math.max(sgErr, tErr);
    if (pointMax > maxDatasetError) {
      maxDatasetError = pointMax;
    }
    const pointError = (sgErr + tErr) / 2;
    totalDevScore += pointError;
  });
  const avgDev = totalDevScore / sortedReal.length;
  const effectiveDev = 0.5 * avgDev + 0.5 * maxDatasetError;
  const alignmentScore = Math.max(0, Math.min(100, Math.round((1 - effectiveDev * 0.5) * 100)));
  let statusTitle = `انطباق بسیار بالا با منحنی مرجع ایده‌آل (${alignmentScore}٪)`;
  let statusBadge = 'تطبیق عالی با الگو';
  let statusColor: 'emerald' | 'amber' | 'rose' | 'indigo' = 'emerald';
  if (alignmentScore < 75) {
    statusTitle = `انحراف قابل توجه از الگوی مرجع (${alignmentScore}٪ انطباق)`;
    statusBadge = 'نیازمند اصلاح شرایط';
    statusColor = 'rose';
  } else if (alignmentScore < 90) {
    statusTitle = `انحراف جزئی از منحنی مرجع (${alignmentScore}٪ انطباق)`;
    statusBadge = 'کنترل خنک‌سازی / سرعت';
    statusColor = 'amber';
  }
  let comparisonDetails = `در روز ${latestReal.dayNumber} تخمیر، وزن مخصوص شما ${latestReal.sg} (اختلاف ${sgDelta > 0 ? '+' : ''}${sgDelta} نسبت به الگو) و دمای کلاهک ${latestReal.tempCap}°C (اختلاف ${tempDelta > 0 ? '+' : ''}${tempDelta}°C) است. `;
  if (Math.abs(sgDelta) <= 0.003 && Math.abs(tempDelta) <= 1.0) {
    comparisonDetails += 'پروفایل تخمیر کارگاه شما کاملاً بر روی منحنی مرجع ایده‌آل استخراج و تخمیر رشه منطبق است.';
  } else if (sgDelta < -0.003) {
    comparisonDetails += 'سرعت افت قند و تخمیر شما نسبت به منحنی مرجع ایده‌آل سریع‌تر است (کاهش زودتر SG).';
  } else if (sgDelta > 0.003) {
    comparisonDetails += 'سرعت افت قند نسبت به الگو کمی کُندتر است (احتمال دمای پایین‌تر یا کمبود اولیه YAN).';
  }
  let actionableGuidance = '';
  if (tempDelta > 1.5) {
    actionableGuidance = `دمای کلاهک شما ${tempDelta}°C از منحنی مرجع بالاتر است. برای جابجایی منحنی واقعی به سمت الگوی ایده‌آل، از بطری‌های یخ زیر کلاهک استفاده کرده و تعداد نوبت‌های غوطه‌ورسازی (Pigeage) را افزایش دهید.`;
  } else if (sgDelta < -0.005) {
    actionableGuidance = 'تخمیر با سرعت بالاتر از الگو پیش می‌رود. جهت جلوگیری از جهش دمایی ناگهانی، سیستم خنک‌سازی کارگاه را یک درجه فعال‌تر کنید.';
  } else if (sgDelta > 0.005) {
    actionableGuidance = 'برای شتاب‌بخشی مطبق بر الگو، دمای محیط کارگاه را بین ۲۰ تا ۲۲ درجه تنظیم کرده و هوادهی سبک انجام دهید.';
  } else {
    actionableGuidance = 'روند کارگاه عالی است! طبق برنامه زمان‌بندی الگوی مرجع، نوبت بعدی پایش و تزریق را ادامه دهید.';
  }
  return {
    hasRealLogs: true,
    alignmentScore,
    sugarDepletionPct,
    statusTitle,
    statusBadge,
    statusColor,
    sgDelta,
    tempDelta,
    phDelta,
    brixDelta,
    latestRealLog: latestReal,
    matchedBenchmarkLog: dayMatchedBench ?? stageMatchedBench,
    comparisonDetails,
    actionableGuidance
  };
}
export interface NextCriticalTriggerStation {
  id:
    | 'sna-1'
    | 'sna-2-dap'
    | 'dap-ceiling'
    | 'phase2-tannin'
    | 'sna-3-organic'
    | 'pressing'
    | 'dryness';
  titleFa: string;
  targetSG: number;
  sgDeltaRemaining: number;
  estimatedHours: number;
  estimatedHoursRange: { min: number; max: number };
  badgeTextFa: string;
}
export interface QuickLogTypoShieldAlert {
  hasWarning: boolean;
  field: 'sg' | 'tempCap';
  severity: 'warning' | 'danger';
  titleFa: string;
  messageFa: string;
  suggestedValue?: number;
  suggestedLabelFa?: string;
}
export interface FermentationPredictionResult {
  currentSG: number;
  targetSG: number;
  sgRemaining: number;
  recentVelocityPerDay: number;
  tempKineticFactor: number;
  effectiveVelocityPerDay: number;
  estimatedRemainingDays: number;
  estimatedRemainingHours: number;
  estimatedDaysRange: { min: number; max: number };
  stageName: string;
  kineticStatus: 'fast' | 'normal' | 'sluggish' | 'stuck' | 'finished';
  kineticStatusFa: string;
  kineticAdviceFa: string;
  tempImpactDescription: string;
  isOutOfModelBounds?: boolean;
  nextCriticalStation?: NextCriticalTriggerStation | null;
}
export function computeNextCriticalStation(
  currentSG: number,
  effectiveVelocityPerDay: number,
  isRose: boolean,
  planTriggers: DynamicProtocolPlan['triggers']
): NextCriticalTriggerStation | null {
  const stations: Array<{
    id: NextCriticalTriggerStation['id'];
    titleFa: string;
    targetSG: number;
  }> = [
    {
      id: 'sna-1',
      titleFa: 'ایستگاه تغذیه اول (SNA-1)',
      targetSG: planTriggers.sna1
    },
    {
      id: 'sna-2-dap',
      titleFa: 'ایستگاه تغذیه دوم (SNA-2 + DAP)',
      targetSG: planTriggers.sna2
    },
    {
      id: 'dap-ceiling',
      titleFa: 'بسته شدن پنجره مجاز DAP (سقف ۱/۳ قند)',
      targetSG: planTriggers.oneThirdCeiling
    },
    ...(!isRose
      ? [
          {
            id: 'phase2-tannin' as const,
            titleFa: 'تزریق تانن فاز ۲ و خروج هسته',
            targetSG: planTriggers.phase2Tannin
          }
        ]
      : []),
    {
      id: 'sna-3-organic',
      titleFa: 'ایستگاه تغذیه سوم ارگانیک (SNA-3)',
      targetSG: planTriggers.sna3
    },
    ...(!isRose
      ? [
          {
            id: 'pressing' as const,
            titleFa: 'نقطه طلایی پرسینگ و جداسازی پوست',
            targetSG: planTriggers.pressingSG
          }
        ]
      : []),
    {
      id: 'dryness',
      titleFa: isRose ? 'خشکی کامل رُزه' : 'خشکی کامل شراب قرمز',
      targetSG: isRose ? 0.991 : planTriggers.drynessSG
    }
  ];
  const station = stations.find((s) => currentSG > s.targetSG + 0.001);
  if (!station) return null;
  const sgDeltaRemaining = Math.max(
    0.001,
    Math.round((currentSG - station.targetSG) * 1000) / 1000
  );
  const vel = Math.max(0.001, effectiveVelocityPerDay);
  const rawHours = (sgDeltaRemaining / vel) * 24;
  const estimatedHours = Math.max(1, Math.round(rawHours));
  const min = Math.max(1, Math.round(rawHours * 0.8));
  const max = Math.max(min + 1, Math.round(rawHours * 1.25));
  const badgeTextFa =
    'حدود ' +
    estimatedHours +
    ' ساعت تا ' +
    station.titleFa +
    ' (SG ' +
    station.targetSG.toFixed(3) +
    ')';
  return {
    id: station.id,
    titleFa: station.titleFa,
    targetSG: station.targetSG,
    sgDeltaRemaining,
    estimatedHours,
    estimatedHoursRange: { min, max },
    badgeTextFa
  };
}
function getSubstrateDepletionFactor(sg: number): number {
  if (sg <= 1.005) return 0.65;
  if (sg <= 1.030) return 0.85;
  return 1.0;
}
export function calculateRecentLogVelocity(
  sortedLogs: FermentationLogEntry[],
  initialSGOverride?: number
): { recentVelocityPerDay: number; hasObservedVelocity: boolean; referenceSG: number } {
  const baselineVel = 0.0125;
  const fallbackInitialSG = initialSGOverride ?? getCurrentDynamicProtocolPlan().triggers.initialSG;
  if (sortedLogs.length === 0) {
    return { recentVelocityPerDay: baselineVel, hasObservedVelocity: false, referenceSG: fallbackInitialSG };
  }
  const latestLog = sortedLogs[sortedLogs.length - 1];
  if (sortedLogs.length >= 2) {
    const prevLog = sortedLogs[sortedLogs.length - 2];
    if (
      latestLog.timestampMs !== undefined &&
      prevLog.timestampMs !== undefined &&
      latestLog.timestampMs !== prevLog.timestampMs
    ) {
      const diffDays = Math.abs(latestLog.timestampMs - prevLog.timestampMs) / (1000 * 60 * 60 * 24);
      const daySpan = Math.max(0.02, diffDays);
      const sgDrop = Math.max(0, prevLog.sg - latestLog.sg);
      return {
        recentVelocityPerDay: sgDrop / daySpan,
        hasObservedVelocity: true,
        referenceSG: prevLog.sg
      };
    }
    const hourPrev = parseTimeHourFromDateTime(prevLog.dateTime);
    const hourLatest = parseTimeHourFromDateTime(latestLog.dateTime);
    if (hourPrev !== null && hourLatest !== null && latestLog.dayNumber >= prevLog.dayNumber) {
      const elapsedHours = (latestLog.dayNumber - prevLog.dayNumber) * 24 + (hourLatest - hourPrev);
      if (elapsedHours > 0) {
        const daySpan = Math.max(0.02, elapsedHours / 24);
        const sgDrop = Math.max(0, prevLog.sg - latestLog.sg);
        return {
          recentVelocityPerDay: sgDrop / daySpan,
          hasObservedVelocity: true,
          referenceSG: prevLog.sg
        };
      }
    }
    if (latestLog.dayNumber === prevLog.dayNumber) {
      for (let i = sortedLogs.length - 2; i >= 0; i--) {
        if (sortedLogs[i].dayNumber < latestLog.dayNumber) {
          const prevDayLog = sortedLogs[i];
          const daySpan = Math.max(0.2, latestLog.dayNumber - prevDayLog.dayNumber);
          const sgDrop = Math.max(0, prevDayLog.sg - latestLog.sg);
          return {
            recentVelocityPerDay: sgDrop / daySpan,
            hasObservedVelocity: true,
            referenceSG: prevDayLog.sg
          };
        }
      }
    }
    const daySpan = Math.max(0.2, latestLog.dayNumber - prevLog.dayNumber);
    const sgDrop = Math.max(0, prevLog.sg - latestLog.sg);
    return {
      recentVelocityPerDay: sgDrop / daySpan,
      hasObservedVelocity: true,
      referenceSG: prevLog.sg
    };
  }
  if (latestLog.dayNumber > 0) {
    const initialSG = fallbackInitialSG;
    const sgDrop = Math.max(0, initialSG - latestLog.sg);
    const daySpan = Math.max(0.2, latestLog.dayNumber);
    return {
      recentVelocityPerDay: sgDrop / daySpan,
      hasObservedVelocity: sgDrop > 0,
      referenceSG: initialSG
    };
  }
  return { recentVelocityPerDay: baselineVel, hasObservedVelocity: false, referenceSG: latestLog.sg };
}
export function calculateVelocity(logs: FermentationLogEntry[], tankId?: TankId): number {
  const scoped = tankId ? logs.filter((l) => l.tankId === tankId) : logs;
  const sorted = sortFermentationLogs(scoped);
  const { recentVelocityPerDay } = calculateRecentLogVelocity(sorted);
  return Math.round(recentVelocityPerDay * 10000) / 10000;
}
export function predictFermentationCompletion(
  logs: FermentationLogEntry[],
  tankId: TankId = 'tank-a',
  targetSGOverride?: number,
  tempOverride?: number,
  initialSGOverride?: number,
  planOverride?: DynamicProtocolPlan
): FermentationPredictionResult {
  const isRose = tankId === 'tank-rose';
  const planTriggers = (planOverride ?? getCurrentDynamicProtocolPlan()).triggers;
  const defaultTargetSG = isRose ? 0.991 : planTriggers.drynessSG;
  const targetSG = targetSGOverride ?? defaultTargetSG;
  const fallbackInitialSG = initialSGOverride ?? planTriggers.initialSG;
  const filteredLogs = sortFermentationLogs(logs.filter((l) => l.tankId === tankId));
  if (filteredLogs.length === 0) {
    const currentSG = fallbackInitialSG;
    const sgRemaining = Math.max(0, currentSG - targetSG);
    const estDays = Math.round((sgRemaining / 0.0125) * 10) / 10;
    return {
      currentSG,
      targetSG,
      sgRemaining,
      recentVelocityPerDay: 0.0125,
      tempKineticFactor: 1.0,
      effectiveVelocityPerDay: 0.0125,
      estimatedRemainingDays: estDays,
      estimatedRemainingHours: Math.round(estDays * 24),
      estimatedDaysRange: {
        min: Math.max(0, Math.round(estDays * 0.8 * 10) / 10),
        max: Math.round(estDays * 1.25 * 10) / 10
      },
      stageName: isRose ? 'خشکی کامل رُزه (SG = 0.991)' : 'خشکی کامل قرمز (SG = 0.993)',
      kineticStatus: 'normal',
      kineticStatusFa: 'در حال شروع تخمیر (حالت استاندارد)',
      kineticAdviceFa: 'تخمیر تازه آغاز شده است؛ پس از ثبت لاگ‌های روزانه ۲ و ۳، دقت پیش‌بینی هوشمند افزایش می‌یابد.',
      tempImpactDescription: 'دمای نرمال کارگاه (۲۲°C) - سرعت استخراج استاندارد.',
      isOutOfModelBounds: false,
      nextCriticalStation: computeNextCriticalStation(currentSG, 0.0125, isRose, planTriggers)
    };
  }
  const latestLog = filteredLogs[filteredLogs.length - 1];
  const currentSG = latestLog.sg;
  const sgRemaining = Math.max(0, Math.round((currentSG - targetSG) * 1000) / 1000);
  if (sgRemaining <= 0) {
    return {
      currentSG,
      targetSG,
      sgRemaining: 0,
      recentVelocityPerDay: 0,
      tempKineticFactor: 1.0,
      effectiveVelocityPerDay: 0,
      estimatedRemainingDays: 0,
      estimatedRemainingHours: 0,
      estimatedDaysRange: { min: 0, max: 0 },
      stageName: 'مرحله فعلی تخمیر کاملاً به پایان رسیده است',
      kineticStatus: 'finished',
      kineticStatusFa: 'پایان تخمیر (خشکی کامل)',
      kineticAdviceFa: 'قند به پایان رسیده و شراب به خشکی مطلق رسیده است. آمادگی برای سیفون، خنک‌سازی و سولفیت‌زنی.',
      tempImpactDescription: 'تخمیر متوقف شده (قند مصرف شده است).',
      isOutOfModelBounds: false,
      nextCriticalStation: null
    };
  }
  const { recentVelocityPerDay, hasObservedVelocity, referenceSG } = calculateRecentLogVelocity(
    filteredLogs,
    fallbackInitialSG
  );
  const depletionFactor = getSubstrateDepletionFactor(currentSG);
  const effectiveTemp = tempOverride ?? latestLog.tempCap;
  const refTemp = isRose ? 17.0 : 22.0;
  const tempDiff = effectiveTemp - refTemp;
  let tempKineticFactor = 1.0;
  if (!isRose) {
    if (effectiveTemp < 16.0) {
      const coldPenalty = Math.max(0.50, 1.0 - (16.0 - effectiveTemp) * 0.08);
      tempKineticFactor = Math.max(
        0.15,
        Math.pow(1.8, (effectiveTemp - 22.0) / 10) * coldPenalty
      );
    } else if (effectiveTemp <= 28.0) {
      tempKineticFactor = Math.pow(1.8, (effectiveTemp - 22.0) / 10);
    } else if (effectiveTemp <= 29.5) {
      tempKineticFactor = 1.42 - ((effectiveTemp - 28.0) / 1.5) * 0.42;
    } else if (effectiveTemp <= 32.0) {
      tempKineticFactor = 1.00 - ((effectiveTemp - 29.5) / 2.5) * 0.65;
    } else {
      tempKineticFactor = 0.15;
    }
  } else {
    if (effectiveTemp < 13.0) {
      tempKineticFactor = 0.25;
    } else if (effectiveTemp <= 19.0) {
      tempKineticFactor = Math.pow(1.8, (effectiveTemp - 17.0) / 10);
    } else if (effectiveTemp <= 24.0) {
      const peakRose = Math.pow(1.8, (19.0 - 17.0) / 10);
      tempKineticFactor = peakRose - ((effectiveTemp - 19.0) / 5.0) * (peakRose - 0.85);
    } else {
      tempKineticFactor = 0.35;
    }
  }
  tempKineticFactor = Math.round(tempKineticFactor * 100) / 100;
  const isOutOfModelBounds = effectiveTemp < 13.0 || effectiveTemp >= 30.5;
  const velBaseline = 0.0125 * depletionFactor * tempKineticFactor;
  const prevDepletionFactor = getSubstrateDepletionFactor(referenceSG);
  const relativeDepletion =
    depletionFactor < prevDepletionFactor ? depletionFactor / prevDepletionFactor : 1.0;
  const effectiveVelocityPerDay = hasObservedVelocity
    ? Math.max(0.001, 0.7 * (recentVelocityPerDay * relativeDepletion) + 0.3 * velBaseline)
    : Math.max(0.001, velBaseline);
  const rawEstDays = sgRemaining / effectiveVelocityPerDay;
  const estimatedRemainingDays = Math.round(rawEstDays * 10) / 10;
  const estimatedRemainingHours = Math.round(estimatedRemainingDays * 24);
  const initialSG = filteredLogs[0]?.sg ?? fallbackInitialSG;
  const isLagPhase =
    latestLog.dayNumber <= 1 ||
    (latestLog.dayNumber <= 2 && initialSG - currentSG <= 0.006);
  const canReportStuck =
    !isLagPhase && (latestLog.dayNumber >= 2 || filteredLogs.length >= 3);
  let kineticStatus: 'fast' | 'normal' | 'sluggish' | 'stuck' | 'finished' = 'normal';
  let kineticStatusFa = 'سرعت تخمیر نرمال و ایده‌آل';
  let kineticAdviceFa = 'روند مصرف قند توسط مخمر کاملاً متوازن است. پایش روزانه و تهویه منظم را ادامه دهید.';
  if (isLagPhase && recentVelocityPerDay < 0.005) {
    kineticStatus = 'normal';
    kineticStatusFa = 'فاز لَگ و تکثیر اولیه مخمر (طبیعی ۲۴ تا ۴۸ ساعت اول)';
    kineticAdviceFa = 'مخمرها در حال جذب اکسیژن و استرولهای غشایی برای تکثیر سلولی هستند؛ افت کند چگالی در ۴۸ ساعت نخست کاملاً طبیعی است.';
  } else if (canReportStuck && recentVelocityPerDay < 0.003 && currentSG > 1.010) {
    kineticStatus = 'stuck';
    kineticStatusFa = 'توقف یا رکود شدید تخمیر (Stuck Risk)';
    kineticAdviceFa = 'افت قند در ۲۴ ساعت گذشته بسیار ناچیز بوده است! دما را بررسی کرده و هوادهی یا افزودن مکمل/مخمر EC-1118 را اجرا کنید.';
  } else if (!isLagPhase && recentVelocityPerDay < 0.007 && currentSG > 1.005) {
    kineticStatus = 'sluggish';
    kineticStatusFa = 'تخمیر کُند (Sluggish Fermentation)';
    kineticAdviceFa = 'سرعت مصرف قند کمتر از الگوی مرجع است. تنظیم دمای محیط کارگاه بین ۲۱-۲۴ درجه سانتی‌گراد توصیه می‌شود.';
  } else if (recentVelocityPerDay > 0.020) {
    kineticStatus = 'fast';
    kineticStatusFa = 'تخمیر بسیار سریع و پرقدرت (Fast Fermentation)';
    kineticAdviceFa = 'سرعت مصرف قند بالاست؛ دمای مرکز کلاهک را کنترل کنید تا از داغ شدن ناگهانی مخزن جلوگیری شود.';
  }
  let tempImpactDescription = `دمای فعلی کلاهک (${effectiveTemp}°C): `;
  if (isOutOfModelBounds) {
    tempImpactDescription =
      'هشدار: دمای فعلی خارج از دامنه اعتبار سینتیکی مخمر است و خطر توقف حرارتی/برودتی تخمیر وجود دارد!';
  } else if (tempDiff > 2) {
    tempImpactDescription += `افزایش دما سرعت واکنش بیوشیمیایی پایه را ${tempKineticFactor} برابر شتاب داده است.`;
  } else if (tempDiff < -2) {
    tempImpactDescription += `برودت محیط سرعت متابولیسم پایه مخمر را به میزان ${Math.round((1 - tempKineticFactor) * 100)}٪ کاهش داده است.`;
  } else {
    tempImpactDescription += 'دما در محدوده بهینه بیولوژیکی قرار دارد (ضریب شتاب پایه ۱.۰).';
  }
  const stageName = targetSG <= 1.000
    ? `خشکی کامل و اتمام تخمیر اولیه (SG = ${targetSG})`
    : `رسیدن به نقطه پرسینگ و جداسازی پوست (SG = ${targetSG})`;
  const nextCriticalStation = computeNextCriticalStation(
    currentSG,
    effectiveVelocityPerDay,
    isRose,
    planTriggers
  );
  return {
    currentSG,
    targetSG,
    sgRemaining,
    recentVelocityPerDay: Math.round(recentVelocityPerDay * 1000) / 1000,
    tempKineticFactor,
    effectiveVelocityPerDay: Math.round(effectiveVelocityPerDay * 1000) / 1000,
    estimatedRemainingDays,
    estimatedRemainingHours,
    estimatedDaysRange: {
      min: Math.max(0, Math.round(estimatedRemainingDays * 0.8 * 10) / 10),
      max: Math.round(estimatedRemainingDays * 1.25 * 10) / 10
    },
    stageName,
    kineticStatus,
    kineticStatusFa,
    kineticAdviceFa,
    tempImpactDescription,
    isOutOfModelBounds,
    nextCriticalStation
  };
}
export function detectQuickLogTypoShield(params: {
  measuredSG: number;
  trueSG: number;
  previousSG?: number;
  previousTempCap?: number;
  tempCap?: number;
  daysElapsed?: number;
}): QuickLogTypoShieldAlert | null {
  const { measuredSG, trueSG, previousSG, previousTempCap, tempCap, daysElapsed } = params;
  const formatted = measuredSG.toFixed(3);
  const candidates: number[] = [];
  const dotIdx = formatted.indexOf('.');
  if (dotIdx !== -1 && formatted.length >= dotIdx + 4) {
    const intPart = formatted.slice(0, dotIdx);
    const d1 = formatted[dotIdx + 1];
    const d2 = formatted[dotIdx + 2];
    const d3 = formatted[dotIdx + 3];
    const swappedStrings = [
      `${intPart}.${d1}${d3}${d2}`,
      `${intPart}.${d2}${d1}${d3}`,
      `${intPart}.${d3}${d2}${d1}`
    ];
    for (const s of swappedStrings) {
      const val = Number(s);
      if (Number.isFinite(val) && Math.abs(val - measuredSG) > 0.0005 && !candidates.includes(val)) {
        candidates.push(val);
      }
    }
  }
  if (previousSG !== undefined && trueSG > previousSG + 0.003) {
    const candSG = candidates.find(
      (c) => c <= previousSG + 0.001 && c >= 0.988 && previousSG - c <= 0.04
    );
    return {
      hasWarning: true,
      field: 'sg',
      severity: 'warning',
      titleFa: 'احتمال خطای تایپی در وزن مخصوص (افزایش چگالی)',
      messageFa:
        candSG !== undefined
          ? 'چگالی واردشده (' +
            trueSG.toFixed(3) +
            ') از ثبت قبلی (' +
            previousSG.toFixed(3) +
            ') بیشتر است. آیا منظورتان ' +
            candSG.toFixed(3) +
            ' بوده است؟'
          : 'چگالی واردشده (' +
            trueSG.toFixed(3) +
            ') بیش از ۰.۰۰۳ بالاتر از ثبت قبلی (' +
            previousSG.toFixed(3) +
            ') است؛ بدون افزودن قند، چگالی در حین تخمیر افزایش نمی‌یابد.',
      suggestedValue: candSG,
      suggestedLabelFa:
        candSG !== undefined ? 'اصلاح سریع به ' + candSG.toFixed(3) : undefined
    };
  }
  if (
    previousSG !== undefined &&
    previousSG - trueSG > 0.045 &&
    (daysElapsed ?? 1) <= 1.5
  ) {
    const candSG = candidates.find(
      (c) => c < previousSG && previousSG - c >= 0.002 && previousSG - c <= 0.035
    );
    return {
      hasWarning: true,
      field: 'sg',
      severity: 'warning',
      titleFa: 'افت غیرعادی و بسیار شدید چگالی در یک نوبت',
      messageFa:
        candSG !== undefined
          ? 'افت چگالی از ' +
            previousSG.toFixed(3) +
            ' به ' +
            trueSG.toFixed(3) +
            ' در یک روز غیرعادی است. آیا منظورتان ' +
            candSG.toFixed(3) +
            ' بوده است؟'
          : 'افت بیش از ۰.۰۴۵ واحد SG در یک شبانه‌روز از نظر بیوشیمیایی غیرمعمول است. قرائت هیدرومتر را بازبینی کنید.',
      suggestedValue: candSG,
      suggestedLabelFa:
        candSG !== undefined ? 'اصلاح سریع به ' + candSG.toFixed(3) : undefined
    };
  }
  if (tempCap !== undefined && (tempCap >= 34 || tempCap <= 9)) {
    let suggestedTemp: number | undefined;
    if (previousTempCap !== undefined) {
      if (Math.abs(tempCap - 10 - previousTempCap) <= 4) {
        suggestedTemp = Math.round((tempCap - 10) * 10) / 10;
      } else if (Math.abs(tempCap + 10 - previousTempCap) <= 4) {
        suggestedTemp = Math.round((tempCap + 10) * 10) / 10;
      }
    }
    return {
      hasWarning: true,
      field: 'tempCap',
      severity: 'warning',
      titleFa: 'دمای کلاهک خارج از بازه متعارف کارگاهی',
      messageFa:
        suggestedTemp !== undefined && previousTempCap !== undefined
          ? 'دمای واردشده (' +
            tempCap.toFixed(1) +
            '°C) جهش شدیدی نسبت به ثبت قبلی (' +
            previousTempCap.toFixed(1) +
            '°C) دارد. آیا منظورتان ' +
            suggestedTemp.toFixed(1) +
            '°C بوده است؟'
          : 'دمای واردشده (' +
            tempCap.toFixed(1) +
            '°C) خارج از محدوده معمول تخمیر است.',
      suggestedValue: suggestedTemp,
      suggestedLabelFa:
        suggestedTemp !== undefined
          ? 'اصلاح دما به ' + suggestedTemp.toFixed(1) + '°C'
          : undefined
    };
  }
  return null;
}
```

### `src/utils/enologyTroubleshooting.ts` (973 compact lines)
```ts
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
export function evaluateEnologicalScenario(input: ScenarioInput): EnologyEvaluationResult {
  const hasInvalidVolume =
    !input.batchVolumeL || input.batchVolumeL <= 0 || !Number.isFinite(input.batchVolumeL);
  const vol = hasInvalidVolume ? 0 : input.batchVolumeL;
  const isRose = Boolean(input.isRose);
  const isUnpressedRedMust = Boolean((input.isUnpressedMash || input.isUnpressedRedMust) && !isRose);
  const effectiveLiquidVol = hasInvalidVolume ? 0 : getEffectiveLiquidVolume(vol, isUnpressedRedMust);
  const actions: CorrectiveAction[] = [];
  let score = 100;
  if (hasInvalidVolume) {
    score -= 40;
    actions.push({
      title: 'خطای ورودی: حجم مخزن نامعتبر یا وارد نشده است (توقف محاسبه دوز)',
      category: 'SG_Ferment',
      severity: 'danger',
      alertTier: 'critical',
      canSnooze: false,
      confidenceBadge: 'stoichiometric',
      confidenceLabelFa: 'نگهبان ایمنی حجم',
      diagnosis:
        'حجم مخزن صفر، منفی یا نامعتبر وارد شده است. محاسبه دوز گرم/میلی‌لیتر مواد شیمیایی بدون حجم معتبر متوقف شد تا از اوردوز یا خطای توزین جلوگیری شود.',
      solutionSummary: 'لطفاً ابتدا حجم معتبر مخزن (> 0 لیتر) را وارد نمایید.',
      calculatedRecipe: [
        {
          item: 'محاسبه دوز مواد افزودنی',
          amount: '0',
          unit: 'گرم',
          instruction: 'محاسبه متوقف شد — ابتدا حجم معتبر مخزن را وارد کنید'
        }
      ],
      steps: [
        'حجم واقعی فاز مایع یا توده مش مخزن (بر حسب لیتر، بزرگ‌تر از صفر) را در فیلد حجم وارد کنید.',
        'از محاسبه فرضی روی حجم پیش‌فرض ۱۳۲ لیتر خودداری شد تا دوز اشتباه به مخزن تزریق نگردد.'
      ]
    });
  }
  const phMin = isRose ? 3.25 : 3.45;
  const phMax = isRose ? 3.42 : 3.60;
  const taMin = isRose ? 6.0 : 5.8;
  const taMax = isRose ? 7.5 : 7.2;
  if (input.currentSG < 0.985 || input.currentSG > 1.150) {
    score -= 35;
    actions.push({
      title: 'خطای فیزیکی یا کالیبراسیون هیدرومتر (SG خارج از محدوده طبیعی)',
      category: 'SG_Ferment',
      severity: 'danger',
      diagnosis: `وزن مخصوص واردشده (${input.currentSG.toFixed(3)}) خارج از بازه فیزیکی شیره انگور و شراب (0.985 تا 1.150) است.`,
      solutionSummary: 'بررسی سلامت شناور هیدرومتر، چرخش برای حذف حباب‌های CO2 و تصحیح دمای نمونه در ۲۰°C.',
      steps: [
        'نمونه را ابتدا ۲ دقیقه هم بزنید تا گاز CO2 محلول که باعث بالا رفتن کاذب هیدرومتر می‌شود خارج گردد.',
        'مطمئن شوید هیدرومتر به دیواره استوانه مدرج نچسبیده و کف استوانه گیر نکرده است.',
        'عدد خوانده‌شده را با جدول تصحیح دمای ۲۰ درجه سانتی‌گراد (SOP-TEST-01) اصلاح نمایید.'
      ]
    });
  }
  if (input.ph < 2.5 || input.ph > 4.5) {
    score -= 35;
    actions.push({
      title: 'خطای سنسور یا الکترود پی‌اچ‌متر (pH غیرممکن بیولوژیکی)',
      category: 'pH_Acid',
      severity: 'danger',
      diagnosis: `مقدار pH ثبت‌شده (${input.ph.toFixed(2)}) خارج از محدوده بیولوژیکی شیره انگور و شراب (2.50 تا 4.50) است و نشان‌دهنده عدم کالیبراسیون یا خرابی الکترود است.`,
      solutionSummary: 'کالیبراسیون مجدد دو نقطه‌ای پی‌اچ‌متر با بافرهای ۴.۰۱ و ۷.۰۰ و شستشو با محلول اسید سیتریک ۲٪ (بطری شماره ۴).',
      steps: [
        'الکترود پی‌اچ‌متر را با محلول استوک شماره ۴ (اسید سیتریک ۲٪) شستشو دهید تا رسوبات تارتارات و پروتئین پاک شوند.',
        'کالیبراسیون دو نقطه‌ای با بافرهای تازه در دمای ۲۰ درجه انجام دهید.',
        'الکترود را هرگز در آب مقطر نگهداری نکنید (فقط در محلول 3M KCl).'
      ]
    });
  }
  const expectedBrixFromSG =
    input.currentSG <= 0.995
      ? 0
      : Math.max(0, Math.round(261.3 * (1 - 1 / input.currentSG) * 10) / 10);
  if (
    input.currentSG >= 0.985 &&
    input.currentSG < 1.080 &&
    input.currentBrix > 0 &&
    Math.abs(input.currentBrix - expectedBrixFromSG) > 3.5
  ) {
    const terrillEst = calculateRefractometerCorrection(22.0, input.currentBrix);
    actions.push({
      title: 'تناقض فیزیکی بین عدد بریکس و وزن مخصوص (خطای شکست نور الکل در رفراکتومتر)',
      category: 'SG_Ferment',
      severity: 'normal',
      alertTier: 'info',
      canSnooze: true,
      confidenceBadge: 'empirical_unverified',
      confidenceLabelFa: 'تخمین اپتیکی تجربی',
      diagnosis: `در وزن مخصوص فعلی (SG = ${input.currentSG.toFixed(3)})، بریکس معادل واقعی حدود ${expectedBrixFromSG}° Bx است اما عدد ${input.currentBrix}° Bx وارد شده است. در حضور الکل، ضریب شکست نور تغییر کرده و رفراکتومتر عدد کاذب بالا نشان می‌دهد.`,
      solutionSummary: `در حین تخمیر صرفاً به هیدرومتر استناد کنید یا از ماشین‌حساب تصحیح خطای الکل رفراکتومتر (SOP-TEST-06؛ تخمین تِریل: SG ≈ ${terrillEst.trueSG.toFixed(3)} و بریکس واقعی ≈ ${terrillEst.trueBrix}° Bx) استفاده نمایید.`,
      steps: [
        'توجه داشته باشید که رفراکتومتر نوری پس از شروع تخمیر به دلیل حضور اتانول، عدد بریکس را ۵ تا ۸ درجه بالاتر از واقعیت نشان می‌دهد.',
        'برای تبدیل عدد رفراکتومتر به SG واقعی، به ابزار SOP-TEST-06 مراجعه کنید یا مستقیماً از هیدرومتر در استوانه مدرج استفاده نمایید.'
      ]
    });
  }
  const isHighPhHighTaParadox = !isRose
    ? input.ph > 3.55 && input.ta >= 7.2
    : input.ph > 3.42 && input.ta >= 7.5;
  const isContradictoryLowPhLowTa = input.ph < phMin && input.ta > 0 && input.ta < taMin;
  const isLowTA = !isContradictoryLowPhLowTa && input.ta > 0 && input.ta < taMin;
  if (isContradictoryLowPhLowTa) {
    score -= 18;
    actions.push({
      title: 'تناقض آزمایشگاهی: pH پایین هم‌زمان با اسیدیته کل (TA) پایین',
      category: 'pH_Acid',
      severity: 'warning',
      confidenceBadge: 'empirical_unverified',
      confidenceLabelFa: 'نیازمند بازبینی سنسور/تیتراسیون',
      diagnosis: `ثبت هم‌زمان pH پایین (${input.ph.toFixed(2)} < ${phMin}) و اسیدیته قابل تیتر پایین (TA = ${input.ta.toFixed(1)} g/L < ${taMin} g/L) از نظر شیمیایی در آب‌انگور طبیعی متناقض است و اغلب ناشی از خطای کالیبراسیون الکترود پی‌اچ‌متر یا انقضای محلول سود ۰.۱ نرمال است.`,
      solutionSummary: 'توقف هرگونه افزودن اسید تارتاریک یا پتاسیم بیکربنات؛ کالیبراسیون مجدد دو نقطه‌ای پی‌اچ‌متر (بافرهای ۴.۰۱ و ۷.۰۰) و تکرار تیتراسیون با محلول 0.1N NaOH تازه.',
      steps: [
        'پیش از هرگونه اصلاح شیمیایی (اسیدزنی یا اسیدزدایی)، الکترود پی‌اچ‌متر را با بافرهای استاندارد ۴.۰۱ و ۷.۰۰ در دمای ۲۰ درجه کالیبره کنید.',
        'غلظت محلول سود (0.1N NaOH) و حجم دقیق نمونه (۵ میلی‌لیتر) را کنترل کرده و تیتراسیون TA را مجدداً انجام دهید.',
        'تنها پس از رفع تناقض سنسور، اقدام به تنظیم اسیدیته نمایید.'
      ]
    });
  } else if (input.ph < phMin) {
    const isSevere = input.ph < 3.20;
    score -= isSevere ? 25 : 12;
    const totalKHCO3_Grams = calculateKHCO3Deacidification(input.ph, phMin, vol, isUnpressedRedMust);
    const bufferEst = estimateAcidOrBaseFromPHShift(input.ph, phMin, effectiveLiquidVol);
    actions.push({
      title: isSevere ? 'اصلاح اضطراری pH پایین و اسیدیته شدید' : 'اصلاح pH پایین و تنظیم بالانس طعمی',
      category: 'pH_Acid',
      severity: isSevere ? 'danger' : 'warning',
      diagnosis: `مقدار pH نمونه (${input.ph.toFixed(2)}) کمتر از محدوده استاندارد (${phMin}–${phMax}) است. اسیدیته ترش و تند بوده و تعادل حسی را برهم می‌زند.`,
      solutionSummary: `اصلاح اسیدیته با پتاسیم بیکربنات (KHCO3: تخمین تجربی اولیه جهت تست ۳ لیوانی در بازه ظرفیت بافری ${bufferEst.lowBufferGrams} تا ${bufferEst.highBufferGrams} گرم؛ استوکیومتری دقیق ۱.۳۳ گرم بر لیتر نیازمند ΔTA در فاز مایع مؤثر ${effectiveLiquidVol}L است) یا تثبیت سرما جهت رسوب بی‌تارتارات پتاسیم.`,
      calculatedRecipe: [
        {
          item: 'پتاسیم بیکربنات (KHCO3)',
          amount: `${totalKHCO3_Grams}`,
          unit: 'گرم',
          instruction: `تخمین تجربی اولیه جهت تست ۳ لیوانی (بازه ظرفیت بافری ${bufferEst.lowBufferGrams}–${bufferEst.highBufferGrams} گرم با میانگین ${bufferEst.typicalBufferGrams} گرم؛ استوکیومتری دقیق نیازمند ΔTA است).`
        }
      ],
      steps: [
        `توجه علمی: به دلیل تفاوت ظرفیت بافری شراب (۳۰ تا ۵۵ mEq/L·pH)، دوز مبتنی بر اختلاف pH (${totalKHCO3_Grams} گرم؛ بازه بافری ${bufferEst.lowBufferGrams} تا ${bufferEst.highBufferGrams} گرم) صرفاً یک تخمین تجربی اولیه جهت تست ۳ لیوانی است و استوکیومتری دقیق نیازمند ΔTA است.`,
        'ابتدا تست ۳ لیوانی ۱۰۰ میلی‌لیتری را اجرا کرده و سپس محلول تاییدشده را به آرامی به شربت اضافه کنید تا گاز CO2 خارج شود.',
        'پس از ۱۲ ساعت، pH و TA را مجدداً اندازه‌گیری کنید.',
        'در فاز نهایی، نگهداری در دمای سرما (۰ تا +۲ درجه) رسوب کریستال‌های بی‌تارتارات را کامل می‌کند.'
      ]
    });
  } else if (isHighPhHighTaParadox) {
    const isCriticalParadox = input.ph > 3.68 || input.ta > 8.5;
    score -= isCriticalParadox ? 30 : 22;
    const paradoxSO2Target = getTargetFreeSO2ByPH(Math.max(input.ph, 3.60), isRose);
    const kmsForParadox = calculateKMS(vol, input.freeSO2, paradoxSO2Target.target, isUnpressedRedMust);
    actions.push({
      title: 'پارادوکس اشباع پتاسیم و قانون سقف اسید (بدون مالولاکتیک)',
      category: 'pH_Acid',
      severity: isCriticalParadox ? 'danger' : 'warning',
      diagnosis: `هم‌زمان هم pH بالا (${input.ph.toFixed(2)}) و هم اسیدیته کل بالا (TA = ${input.ta.toFixed(1)} g/L ≥ سقف ۷.۲–۷.۵ g/L) مشاهده می‌شود! این پدیده ناشی از استخراج بالای یون پتاسیم (K⁺) از پوست انگور رشه و بافر شدن محیط است. از آنجا که در این پروتکل تخمیر مالولاکتیک (MLF) با باکتیلس قفل شده است، افزودن اسید تارتاریک بیشتر شراب را به شدت ترش و غیرقابل نوشیدن می‌کند!`,
      solutionSummary: `توقف مطلق افزودن اسید تارتاریک (رعایت سقف مطلق TA ≤ 7.5 g/L و حداکثر ۲.۵ g/L = ۳۳۰ گرم در مخزن ۱۳۲L)، پذیرش pH نهایی تا ۳.۶۰ و جبران حفاظت میکروبی با تنظیم سولفیت آزاد روی ${paradoxSO2Target.target} mg/L (بازه ${paradoxSO2Target.min}–${paradoxSO2Target.max} mg/L) + سرمازدایی ۱۴ روزه.`,
      calculatedRecipe: [
        {
          item: 'اسید تارتاریک خالص (Tartaric Acid)',
          amount: '0 (ممنوع - عبور از سقف TA)',
          unit: 'گرم',
          instruction: 'به دلیل قفل بودن مالولاکتیک و رسیدن TA به سقف مجاز، هیچ اسیدی اضافه نکنید!'
        },
        {
          item: 'افزایش دوز متابی‌سولفیت (KMS) متناسب با pH 3.6',
          amount: `${kmsForParadox}`,
          unit: 'گرم',
          instruction: `جهت رساندن سولفیت آزاد به ${paradoxSO2Target.target} mg/L و تامین ۰.۶–۰.۸ mg/L سولفیت مولکولی`
        }
      ],
      steps: [
        'افزودن اسید تارتاریک را فوراً متوقف کنید؛ هرگز از سقف TA = 7.5 g/L (یا سقف ۲.۵ گرم بر لیتر اسید افزودنی = ۳۳۰ گرم در ۱۳۲ لیتر) عبور نکنید.',
        `مقدار pH نهایی در محدوده ۳.۵۵ تا ۳.۶۰ را بپذیرید و به جای اسیدزنی، سطح سولفیت آزاد (Free SO2) را طبق جدول pH روی ${paradoxSO2Target.min} تا ${paradoxSO2Target.max} mg/L نگه دارید.`,
        'در روز ۶۵، پایدارسازی سرد ۱۴ روزه (۰ تا +۲ درجه با بذرپاشی ۰.۲۰ g/L کرم تارتار) را اجرا کنید تا پتاسیم مازاد به صورت بی‌تارتارات پتاسیم (KHT) رسوب کند.'
      ]
    });
  } else if (input.ph > phMax) {
    const phExcess = Math.round((input.ph - phMax) * 100) / 100;
    const isSevereLowTA = isLowTA && input.ta < 4.8;
    const isCritical = input.ph > 3.68 || isSevereLowTA;
    score -= (input.ph > 3.68 ? 30 : 15) + (isLowTA ? (isSevereLowTA ? 15 : 8) : 0);
    const tartaricGramsPerL = (phExcess / 0.1) * 1.0;
    const totalTartaricGrams = Math.round(tartaricGramsPerL * effectiveLiquidVol * 10) / 10;
    const acidBufferEst = estimateAcidOrBaseFromPHShift(input.ph, phMax, effectiveLiquidVol);
    const pHTarget = getTargetFreeSO2ByPH(input.ph, isRose);
    const targetTA = isRose ? 6.8 : 6.5;
    const taTartaricGrams = isLowTA
      ? calculateTartaricAddition(input.ta, targetTA, vol, isUnpressedRedMust)
      : 0;
    const recommendedTartaricGrams = isLowTA
      ? Math.max(totalTartaricGrams, taTartaricGrams)
      : totalTartaricGrams;
    actions.push({
      title: isCritical
        ? 'هشدار بحرانی: pH بالا و خطر آلودگی میکروبی'
        : 'اصلاح pH بالا با افزودن اسید تارتاریک',
      category: 'pH_Acid',
      severity: isCritical ? 'danger' : 'warning',
      diagnosis: isLowTA
        ? `مقدار pH نمونه (${input.ph.toFixed(2)}) بالاتر از حد مجاز (${phMax}) و هم‌زمان اسیدیته کل (TA = ${input.ta.toFixed(1)} g/L) کمتر از بازه استاندارد (${taMin}–${taMax} g/L) است. رنگ سرخ یاقوتی تضعیف شده و کارایی سولفیت آزاد (SO2) کاهش شدید می‌یابد.`
        : `مقدار pH نمونه (${input.ph.toFixed(2)}) بالاتر از حد مجاز (${phMax}) است. رنگ سرخ یاقوتی تضعیف شده و کارایی سولفیت آزاد (SO2) کاهش شدید می‌یابد.`,
      solutionSummary: isLowTA
        ? `اصلاح یکپارچه pH و کمبود TA با اسید تارتاریک خالص دارویی (دوز استوکیومتری کمبود TA = ${taTartaricGrams} گرم برای رسیدن به TA = ${targetTA} g/L؛ بازه ظرفیت بافری اصلاح pH: ${acidBufferEst.lowBufferGrams} تا ${acidBufferEst.highBufferGrams} گرم — نسخه واحد بدون دوباره‌کاری) و افزایش دوز محافظتی KMS بر اساس فاز مایع مؤثر.`
        : `اسیدی‌سازی با اسید تارتاریک خالص دارویی (تخمین تجربی اولیه جهت تست ۳ لیوانی در بازه بافری ${acidBufferEst.lowBufferGrams} تا ${acidBufferEst.highBufferGrams} گرم؛ استوکیومتری دقیق نیازمند ΔTA و رعایت سقف TA ≤ 7.5 g/L است) و افزایش دوز محافظتی KMS بر اساس فاز مایع مؤثر.`,
      calculatedRecipe: [
        {
          item: 'اسید تارتاریک خالص (Tartaric Acid)',
          amount: `${recommendedTartaricGrams}`,
          unit: 'گرم',
          instruction: isLowTA
            ? `نسخه واحد اصلاح هم‌زمان pH و TA (استوکیومتری ΔTA: ${taTartaricGrams} گرم جهت رسیدن به ${targetTA} g/L؛ بازه ظرفیت بافری pH: ${acidBufferEst.lowBufferGrams}–${acidBufferEst.highBufferGrams} گرم)`
            : `تخمین تجربی اولیه جهت تست ۳ لیوانی (بازه ظرفیت بافری ${acidBufferEst.lowBufferGrams}–${acidBufferEst.highBufferGrams} گرم؛ استوکیومتری دقیق نیازمند ΔTA و رعایت سقف ۲.۵ گرم بر لیتر است)`
        },
        {
          item: 'افزایش دوز متابی‌سولفیت (KMS)',
          amount: `${calculateKMS(vol, input.freeSO2, Math.max(38, pHTarget.target), isUnpressedRedMust)}`,
          unit: 'گرم',
          instruction: `جهت جبران افت کارایی SO2 مولکولی در pH بالا (هدف: ${Math.max(38, pHTarget.target)} mg/L)`
        }
      ],
      steps: [
        `توجه علمی: مقدار ${recommendedTartaricGrams} گرم (بازه بافری ${acidBufferEst.lowBufferGrams} تا ${acidBufferEst.highBufferGrams} گرم${isLowTA ? ` و دوز استوکیومتری ΔTA برابر ${taTartaricGrams} گرم` : ''}) جهت اصلاح یکپارچه اسیدیته محاسبه شده است (مشروط به عدم عبور TA از ۷.۵ گرم بر لیتر).`,
        'پس از تایید در تست ۳ لیوانی، محلول را به صورت یکنواخت به مخزن افزوده و مخلوط نمایید.',
        `به دلیل pH بالاتر، دوز سولفیت آزاد هدف را روی ${pHTarget.min}–${pHTarget.max} mg/L تنظیم کنید.`,
        'دمای کلاهک و ظروف را تحت کنترل دقیق نگه دارید تا آلودگی باکتریایی رخ ندهد.'
      ]
    });
  }
  if (isLowTA && input.ph <= phMax) {
    const isSevereLowTA = input.ta < 4.8;
    score -= isSevereLowTA ? 32 : 15;
    const targetTA = isRose ? 6.8 : 6.5;
    const tartaricNeeded = calculateTartaricAddition(input.ta, targetTA, vol, isUnpressedRedMust);
    actions.push({
      title: isSevereLowTA
        ? 'کمبود بحرانی اسیدیته کل (TA < 4.8 g/L) و خطر فساد میکروبی'
        : 'کمبود ملایم اسیدیته کل (TA پایین) و طعم تخت شراب',
      category: 'pH_Acid',
      severity: isSevereLowTA ? 'danger' : 'warning',
      diagnosis: `اسیدیته کل فعلی (TA = ${input.ta.toFixed(1)} g/L) کمتر از بازه استاندارد (${taMin}–${taMax} g/L) است. کمبود اسید باعث طعم تخت (Flat)، بی‌روح شدن میوه‌ای شراب و افزایش آسیب‌پذیری میکروبی می‌شود.`,
      solutionSummary: `افزودن دقیق ${tartaricNeeded} گرم اسید تارتاریک خالص L(+) بر اساس حجم مایع مؤثر (${effectiveLiquidVol}L) جهت رساندن TA به ${targetTA} g/L.`,
      calculatedRecipe: [
        {
          item: 'اسید تارتاریک خالص (Tartaric Acid)',
          amount: `${tartaricNeeded}`,
          unit: 'گرم',
          instruction: isSevereLowTA
            ? 'در ۲ مرحله به فاصله ۱۲ ساعت تزریق شود و پس از مرحله اول pH و طعم چک گردد'
            : `حل‌شده در شیره/شراب جهت رسیدن به TA = ${targetTA} g/L`
        }
      ],
      steps: [
        'ابتدا تست ۳ لیوانی اسید تارتاریک را با محلول استوک شماره ۱ (۱۰٪ اسید تارتاریک) روی نمونه ۱۰۰ میلی‌لیتری انجام دهید.',
        `مقدار ${tartaricNeeded} گرم اسید تارتاریک را در ۲ لیتر از شیره/شراب حل کرده و به مخزن اضافه کنید.`,
        'پس از ۱۲ ساعت همگن‌سازی، مجدداً تیتراسیون TA با سود ۰.۱ نرمال و خوانش pH را تکرار نمایید.'
      ]
    });
  } else if (input.ta > taMax && !(isHighPhHighTaParadox && input.ta <= 9.0)) {
    const targetBaseTA = isRose ? 7.0 : 6.8;
    const taExcess = Math.max(0.1, Math.round((input.ta - targetBaseTA) * 100) / 100);
    const deacidOptions = calculateDeacidificationOptions(taExcess, effectiveLiquidVol);
    const khco3Grams = deacidOptions.khco3StoichiometricGrams;
    const khco3ColdStabGrams = deacidOptions.khco3WithColdStabGrams;
    const caco3Grams = deacidOptions.caco3Grams;
    if (input.ta > 12.0) {
      score -= 55;
      actions.push({
        title: 'خطای بحرانی اسیدیته کل (TA غیرطبیعی / اوردوز اسید / خطای تیتراسیون آزمایشگاهی)',
        category: 'pH_Acid',
        severity: 'danger',
        diagnosis: `مقدار اسیدیته کل ثبت‌شده (TA = ${input.ta.toFixed(1)} g/L) به شکل غیرطبیعی و بحرانی بالاتر از سقف مجاز (${taMax} g/L) است! این عدد نشان‌دهنده یکی از ۳ علت ریشه‌ای زیر است: (۱) خطای ۱۰ برابری نرمالیته سود در تیتراسیون آزمایشگاهی (استفاده از سود ۱.۰ نرمال به جای ۰.۱ نرمال یا خطای حجم نمونه ۵mL)، (۲) اوردوز شدید توزین اسید تارتاریک هنگام اسیدزنی، یا (۳) فساد شدید باکتری سرکه (Acetobacter) و تبدیل الکل به اسید استیک.`,
        solutionSummary: `تکرار فوری تیتراسیون با محلول استاندارد 0.1N NaOH تازه؛ و در صورت تایید اوردوز واقعی اسید، اسیدزدایی اضطراری با کربنات کلسیم (CaCO3: ۰.۶۷ گرم بر لیتر به ازای هر ۱ g/L کاهش TA) یا پتاسیم بیکربنات (KHCO3: استوکیومتری ۱.۳۳ گرم بر لیتر یا ۱.۰۰ گرم بر لیتر همراه با سرمازدایی).`,
        calculatedRecipe: [
          {
            item: 'کربنات کلسیم خالص انولوژیک (CaCO3)',
            amount: `${caco3Grams}`,
            unit: 'گرم',
            instruction: `معادل 0.67 g/L به ازای هر 1.0 g/L اسید مازاد در ${effectiveLiquidVol}L مایع (مناسب کاهش اسیدیته‌های شدید)`
          },
          {
            item: 'پتاسیم بیکربنات (KHCO3 - استوکیومتری خالص ۱.۳۳ g/L)',
            amount: `${khco3Grams}`,
            unit: 'گرم',
            instruction: `معادل 1.33 g/L استوکیومتری خالص (${khco3ColdStabGrams} گرم با احتساب رسوب سرمازدایی ۱.۰۰ g/L) در ${effectiveLiquidVol}L مایع`
          }
        ],
        steps: [
          'گام اول (کنترل خطای آزمایشگاه): فرمول TA = (V_NaOH × N_NaOH × 75) / V_sample را چک کنید. مطمئن شوید سود مصرفی دقیقاً 0.1N است و حجم نمونه دقیقاً ۵ میلی‌لیتر بوده است.',
          'گام دوم (بررسی بوی سرکه): اگر نمونه بوی تند سرکه یا لاک ناخن می‌دهد، افزایش TA ناشی از اسید استیک فرار (VA) است و با کربنات اصلاح نمی‌شود؛ فوراً پروتکل مهار استوباکتر (KMS + سرمایش) را اجرا کنید.',
          `گام سوم (اصلاح اوردوز اسید تارتاریک): اگر اسید تارتاریک بیش از حد ریخته شده، تست لیوانی اسیدزدایی را با ${caco3Grams} گرم کربنات کلسیم (CaCO3) یا ${khco3Grams} گرم پتاسیم بیکربنات انجام داده و سپس ۱۴ روز در دمای ۰ تا +۲ درجه سرمازدایی کنید.`
        ]
      });
    } else if (input.ta > 9.0) {
      score -= 35;
      const cappedKHCO3 = Math.round(Math.min(2.5, taExcess * 1.33) * effectiveLiquidVol * 10) / 10;
      actions.push({
        title: `هشدار قرمز: اسیدیته کل بسیار بالا (TA = ${input.ta.toFixed(1)} g/L) و طعم ترش گزنده`,
        category: 'pH_Acid',
        severity: 'danger',
        diagnosis: `اسیدیته کل (${input.ta.toFixed(1)} g/L) بسیار بالاتر از سقف پروتکل (${taMax} g/L) است. از آنجا که تخمیر مالولاکتیک (MLF) در این پروتکل انجام نمی‌شود، این حجم از اسید باعث ترشی تند و گزندگی شدید در کام می‌گردد.`,
        solutionSummary: 'اسیدزدایی شیمیایی کنترل‌شده با کربنات کلسیم (CaCO3) یا پتاسیم بیکربنات (KHCO3) به همراه سرمازدایی ۱۴ روزه در ۰ تا +۲ درجه.',
        calculatedRecipe: [
          {
            item: 'کربنات کلسیم خالص (CaCO3)',
            amount: `${caco3Grams}`,
            unit: 'گرم',
            instruction: '۰.۶۷ گرم بر لیتر به ازای هر ۱.۰ g/L کاهش TA'
          },
          {
            item: 'پتاسیم بیکربنات (KHCO3 - با سقف ایمن)',
            amount: `${cappedKHCO3}`,
            unit: 'گرم',
            instruction: '۱.۳۳ گرم بر لیتر استوکیومتری به ازای هر ۱.۰ g/L کاهش TA (حداکثر مجاز ۲.۵ g/L در هر مرحله)'
          }
        ],
        steps: [
          'ابتدا در ۳ لیوان ۱۰۰ میلی‌لیتری، دوزهای پلکانی KHCO3 یا CaCO3 را تست کنید.',
          'محلول را به آرامی تزریق کنید (توجه: واکنش با اسید گاز CO2 و کف شدید تولید می‌کند؛ فضای خالی ظرف را رعایت کنید).',
          'سپس در روز ۶۵، پایدارسازی سرد (۰ تا +۲ درجه به مدت ۱۴ روز) را جهت رسوب کریستال‌های تارتارات اجرا نمایید.'
        ]
      });
    } else {
      score -= 18;
      actions.push({
        title: 'اسیدیته کل بالا (TA > سقف پروتکل) و نیاز به تعادل‌بخشی بدون مالولاکتیک',
        category: 'pH_Acid',
        severity: 'warning',
        diagnosis: `اسیدیته کل (${input.ta.toFixed(1)} g/L) بالاتر از محدوده بهینه (${taMin}–${taMax} g/L) است. به دلیل حذف عمدی تخمیر مالولاکتیک (No-MLF Protocol)، اسید مالیک و تارتاریک به اسید لاکتیک تبدیل نمی‌شوند و باید با سرمازدایی یا بیکربنات ملایم متعادل شوند.`,
        solutionSummary: `عدم افزودن هرگونه اسید تارتاریک جدید + اجرای پایدارسازی سرد ۱۴ روزه (۰ تا +۲ درجه) که ۱.۰ تا ۱.۵ g/L از TA را به صورت طبیعی رسوب می‌دهد، یا استفاده ملایم از ${khco3Grams} گرم KHCO3 (${khco3ColdStabGrams} گرم با سرمازدایی).`,
        calculatedRecipe: [
          {
            item: 'پتاسیم بیکربنات ملایم (KHCO3 - اختیاری پس از سرمازدایی)',
            amount: `${khco3Grams}`,
            unit: 'گرم',
            instruction: `معادل ۱.۳۳ گرم بر لیتر استوکیومتری (${khco3ColdStabGrams} گرم با سرمازدایی) به ازای هر ۱.۰ g/L کاهش TA در ${effectiveLiquidVol}L مایع`
          }
        ],
        steps: [
          'هیچ اسید تارتاریک یا سیتریک جدیدی به مخزن اضافه نکنید.',
          'در ایستگاه پایدارسازی سرد (روز ۶۵ تا ۸۰)، دمای شراب را به ۰ تا +۲ درجه برسانید و ۰.۲۰ g/L کرم تارتار بزنید تا ۱ تا ۱.۵ گرم بر لیتر اسید به صورت طبیعی رسوب کند.',
          'در روز ۸۵، در صورت باقی ماندن تیزی اسید، با تست ۳ لیوانی گلیسیرین (۱.۵ تا ۳.۵ g/L) یا دوز ملایم KHCO3 تعادل طعمی را تنظیم کنید.'
        ]
      });
    }
  }
  if (input.currentSG <= 0.995) {
    if (input.tempCapC > 20.0) {
      const isDangerFinishedTemp = input.tempCapC > 24.0;
      score -= isDangerFinishedTemp ? 38 : 20;
      actions.push({
        title: 'خطر گرمایش شراب تمام‌شده (اکسیداسیون و فعالیت باکتری سرکه در فاز نگهداری)',
        category: 'Temperature',
        severity: isDangerFinishedTemp ? 'danger' : 'warning',
        diagnosis: `تخمیر الکلی به پایان رسیده است (SG = ${input.currentSG.toFixed(3)} ≤ 0.995) و دیگر لایه محافظ گاز CO2 تولید نمی‌شود. نگهداری شراب تمام‌شده در دمای ${input.tempCapC}°C (به جای دمای استاندارد ۱۴ تا ۱۶ درجه) سرعت اکسیداسیون فنولی، تبخیر سولفیت آزاد و رشد باکتری‌های سرکه (Acetobacter) را ۳ برابر می‌کند!`,
        solutionSummary: 'انتقال فوری گالن‌ها به محیط خنک ۱۴ تا ۱۵ درجه سانتی‌گراد، لب‌به‌لب کردن کامل گلوگاه (Top-up) و کنترل سطح سولفیت آزاد متناسب با pH.',
        steps: [
          'فوراً دمای اتاق نگهداری یا یخچال کارگاه را روی ۱۴ تا ۱۵ درجه سانتی‌گراد تنظیم کنید.',
          'فضای خالی بالای گالن‌های شیشه‌ای را با شراب ذخیره (Top-up) کاملاً لب‌به‌لب کنید تا اکسیژن به صفر برسد.',
          'سطح سولفیت آزاد (Free SO2) را اندازه‌گیری کنید؛ در دمای بالا سولفیت آزاد به سرعت مصرف و اکسید می‌شود.'
        ]
      });
    }
  } else if (!isRose && input.currentSG > 0.995 && input.currentSG <= 1.008) {
    if (input.tempCapC < 18.5) {
      score -= 20;
      actions.push({
        title: 'هشدار سرمایش پس از پرسینگ و خطر توقف تخمیر در فاز مایع (بحران ۴)',
        category: 'Temperature',
        severity: 'warning',
        diagnosis: `در فاز پایانی تخمیر مایع پس از پرسینگ (SG = ${input.currentSG.toFixed(3)})، دمای مایع به ${input.tempCapC}°C افت کرده است. سرد شدن شراب زیر ۱۸.۵ درجه در حضور ۱۲.۵٪ الکل باعث به خواب رفتن مخمرها و باقی ماندن قند احیاکننده (Stuck Fermentation) می‌شود.`,
        solutionSummary: 'تثبیت دمای گالن‌ها روی ۲۱ تا ۲۲.۵ درجه سانتی‌گراد و معلق‌سازی ملایم دُرد نرم تا رسیدن به خشکی مطلق (SG ≤ 0.993).',
        steps: [
          'گالن‌های شراب آب‌آزاد و پرس را در محیط ۲۱ تا ۲۲.۵ درجه سانتی‌گراد قرار دهید تا ۳۰ گرم قند باقی‌مانده ظرف ۲ تا ۴ روز کامل مصرف شود.',
          'با میله استیل ضدعفونی‌شده، دُرد نرم مخمری کف گالن را روزی یک بار به آرامی معلق کنید.'
        ]
      });
    } else if (input.tempCapC > 26.0) {
      const isDangerPostPress = input.tempCapC >= 29.0;
      score -= isDangerPostPress ? 30 : 15;
      actions.push({
        title: 'افزایش بیش از حد دمای فاز مایع پس از پرسینگ',
        category: 'Temperature',
        severity: isDangerPostPress ? 'danger' : 'warning',
        diagnosis: `دمای شراب پس از جداسازی پوست (${input.tempCapC}°C) بالاتر از دمای هدف ۲۲ درجه است و موجب تبخیر استرهای ظریف میوه‌ای می‌گردد.`,
        solutionSummary: 'کاهش دمای محیط به ۲۰–۲۲ درجه سانتی‌گراد تا اتمام آرام قند باقی‌مانده.',
        steps: [
          'تهویه محیط را تنظیم کنید تا دمای مایع داخل گالن‌ها روی ۲۱ تا ۲۲ درجه سانتی‌گراد تثبیت شود.'
        ]
      });
    }
  } else if (isRose) {
    if (input.tempCapC > 18.5) {
      const isExtremeRose = input.tempCapC >= 19.5;
      const tempDiff = Math.round((input.tempCapC - 18.0) * 10) / 10;
      score -= isExtremeRose ? 35 : 18;
      actions.push({
        title: isExtremeRose
          ? 'خط قرمز گرمایش شراب رُزه! خطر پریدن استرهای فرار میوه‌ای'
          : 'افزایش دمای تخمیر رُزه و نیاز به خنک‌سازی',
        category: 'Temperature',
        severity: isExtremeRose ? 'danger' : 'warning',
        diagnosis: `دمای تخمیر رُزه (${input.tempCapC}°C) به میزان ${tempDiff}°C از سقف استاندارد ۱۸ درجه فراتر رفته است. در دمای بالای ۱۹.۵ درجه، استرهای گل‌فام و توت‌فرنگی رُزه با جریان گاز CO2 تبخیر می‌شوند.`,
        solutionSummary: 'قرار دادن گالن‌های رُزه در تشت آب سرد یا استفاده از بطری یخ جهت بازگرداندن دما به ۱۶–۱۸ درجه.',
        calculatedRecipe: [
          {
            item: 'بطری‌های یخ استریل ۱.۵ لیتری (در تشت آب اطراف گالن)',
            amount: `${Math.max(1, Math.ceil((tempDiff * vol) / 60))}`,
            unit: 'عدد',
            instruction: 'قرارگیری در تشت آب خنک دور گالن شیشه‌ای رُزه'
          }
        ],
        steps: [
          'گالن‌های ۲۰ لیتری رُزه را داخل تشت آب خنک (۱۴–۱۵ درجه) قرار دهید تا دمای مایع به ۱۶ تا ۱۸ درجه برگردد.',
          'هرگز یخ خشک را مستقیم کف گالن شیشه‌ای نیندازید (خطر ترکیدن شیشه در اثر شوک -78°C).'
        ]
      });
    } else if (input.tempCapC < 14.0) {
      const isSevereColdRose = input.tempCapC < 11.0;
      score -= isSevereColdRose ? 25 : 12;
      actions.push({
        title: 'سرد شدن بیش از حد شیره رُزه و خطر توقف فعالیت مخمر',
        category: 'Temperature',
        severity: isSevereColdRose ? 'danger' : 'caution',
        diagnosis: `دمای شیره رُزه (${input.tempCapC}°C) کمتر از آستانه فعالیت بهینه مخمر (۱۶–۱۹ درجه) است و می‌تواند تخمیر را متوقف کند.`,
        solutionSummary: 'انتقال گالن رُزه به محیط ۱۷–۱۸ درجه سانتی‌گراد.',
        steps: [
          'گالن رُزه را از محیط سرد خارج کرده و دمای مایع را به ۱۶ تا ۱۸ درجه سانتی‌گراد برسانید.'
        ]
      });
    }
  } else {
    if (input.tempCapC >= 32.0) {
      const tempDiff = Math.round((input.tempCapC - 28.5) * 10) / 10;
      const iceBottlesNeeded = Math.max(4, Math.ceil((tempDiff * vol) / 100));
      score -= 45;
      actions.push({
        title: 'بحران ۱: شوک حرارتی مرگبار مخمر (T ≥ 32°C) و خطر جهش اسیدیته فرار (سرکه)!',
        category: 'Temperature',
        severity: 'danger',
        diagnosis: `دمای مرکز کلاهک (${input.tempCapC}°C) از مرز بحرانی ۳۲.۰ درجه عبور کرده است! در این دما در حضور الکل، غشای فسفولیپیدی مخمر RC-212 متلاشی شده، تخمیر متوقف (Stuck) می‌گردد و باکتری‌های سرکه به سرعت تکثیر می‌شوند.`,
        solutionSummary: 'مداخله اورژانسی زیر ۱۵ دقیقه: غوطه‌ورسازی ۴ بطری ۱.۵ لیتری یخ ضدعفونی‌شده زیر کلاهک + تزریق یخ خشک در کاسه استیل شناور.',
        calculatedRecipe: [
          {
            item: 'بطری‌های یخ استریل ۱.۵ لیتری',
            amount: `${iceBottlesNeeded}`,
            unit: 'عدد',
            instruction: 'مستغرق در ۱۵ سانتی‌متری زیر کلاهک در مرکز مخزن (هر بطری ~500-700 kJ گرما جذب می‌کند)'
          },
          {
            item: 'یخ خشک در صورت نیاز فوری',
            amount: `${calculateCoolingDryIceKg(vol, input.tempCapC, 26.5, input.currentSG || 1.080)}`,
            unit: 'کیلوگرم',
            instruction: 'با احتساب چگالی شیره (SG) و راندمان انتقال حرارت ۶۵٪ تصعید گاز CO2 (در کاسه استیل شناور)'
          }
        ],
        steps: [
          `بلافاصله ${iceBottlesNeeded} عدد بطری ۱.۵ لیتری یخ‌زده که برچسب آن‌ها جدا و با محلول سولفیت اسیدی (بطری شماره ۳) ضدعفونی شده‌اند را زیر کلاهک قرار دهید.`,
          'پس از ۲۰ دقیقه، Pigeage عمیق انجام دهید تا لایه داغ مرکز کلاهک با مایع خنک زیرین همگن شود.',
          'در صورت استفاده از یخ خشک، قطعات را داخل یک کاسه استیل ضدزنگ شناور قرار دهید و تهویه کف‌کش کارگاه را با حداکثر دور روشن کنید.'
        ]
      });
    } else if (input.tempCapC > 30.0) {
      const tempDiff = Math.round((input.tempCapC - 28.5) * 10) / 10;
      const iceBottlesNeeded = Math.max(3, Math.ceil((tempDiff * vol) / 100));
      score -= 22;
      actions.push({
        title: 'عبور دمای کلاهک از سقف مجاز ۳۰.۰ درجه و نیاز به خنک‌سازی فوری با بطری یخ',
        category: 'Temperature',
        severity: 'danger',
        diagnosis: `دمای مرکز کلاهک (${input.tempCapC}°C) از سقف مجاز پروتکل (۳۰.۰°C) فراتر رفته است. تداوم این دما باعث استرس حرارتی مخمر، تبخیر آرومای میوه‌ای و استخراج تانن‌های خشن هسته می‌شود.`,
        solutionSummary: 'غوطه‌ورسازی ۳ تا ۴ بطری ۱.۵ لیتری یخ ضدعفونی‌شده در زیر کلاهک (کاهش ~۱ درجه به ازای هر بطری در مخزن ۱۵۷ لیتری) و Pigeage پس از ۲۰ دقیقه.',
        calculatedRecipe: [
          {
            item: 'بطری‌های یخ استریل ۱.۵ لیتری',
            amount: `${iceBottlesNeeded}`,
            unit: 'عدد',
            instruction: 'مستغرق زیر کلاهک در مرکز مخزن (هر بطری ۱.۵ لیتری ۵۰۰ تا ۷۰۰ کیلوژول گرما جذب می‌کند)'
          },
          {
            item: 'یخ خشک در صورت نیاز فوری',
            amount: `${calculateCoolingDryIceKg(vol, input.tempCapC, 26.5, input.currentSG || 1.080)}`,
            unit: 'کیلوگرم',
            instruction: 'با احتساب چگالی شیره (SG) و راندمان انتقال حرارت ۶۵٪ تصعید گاز CO2'
          }
        ],
        steps: [
          `بلافاصله ${iceBottlesNeeded} عدد بطری ۱.۵ لیتری یخ ضدعفونی‌شده با محلول استوک شماره ۳ را در عمق ۱۵ سانتی‌متری زیر کلاهک قرار دهید.`,
          '۲۰ دقیقه صبر کرده و سپس کلاهک را غوطه‌ور (Pigeage) کنید تا دما به بازه ایمن ۲۶ تا ۲۸ درجه برگردد.',
          'دمای محیط کارگاه را روی ۱۸–۲۰ درجه تنظیم نمایید.'
        ]
      });
    } else if (input.tempCapC > 29.0) {
      score -= 10;
      actions.push({
        title: 'نزدیک شدن دمای کلاهک به سقف ۳۰.۰ درجه (بازه هشدار ۲۹ تا ۳۰ درجه)',
        category: 'Temperature',
        severity: 'warning',
        diagnosis: `دمای مرکز کلاهک (${input.tempCapC}°C) در اوج استخراج پلی‌فنولی قرار دارد اما به سقف مجاز ۳۰.۰ درجه نزدیک شده است.`,
        solutionSummary: 'آماده‌سازی بطری‌های یخ ۱.۵ لیتری ضدعفونی‌شده و انجام غوطه‌ورسازی کلاهک (Pigeage) جهت پخش حرارت.',
        calculatedRecipe: [
          {
            item: 'بطری‌های یخ استریل ۱.۵ لیتری',
            amount: '2',
            unit: 'عدد',
            instruction: 'در صورت عبور دما از ۲۹.۵ درجه زیر کلاهک قرار گیرد'
          }
        ],
        steps: [
          '۲ عدد بطری یخ ۱.۵ لیتری را با محلول سولفیت اسیدی (بطری شماره ۳) ضدعفونی و آماده نگه دارید.',
          'یک نوبت Pigeage انجام دهید تا گرمای متمرکز در کلاهک پوست با فاز مایع خنک‌تر تبادل یابد.'
        ]
      });
    } else if (input.tempCapC < 18.0) {
      const isColdDanger = input.tempCapC < 14.0;
      score -= isColdDanger ? 25 : 10;
      actions.push({
        title: isColdDanger
          ? 'سرمایش شدید مخزن قرمز و خطر توقف بیولوژیکی مخمر'
          : 'سرد شدن بیش از حد و خطر کُند شدن فعالیت مخمر',
        category: 'Temperature',
        severity: isColdDanger ? 'danger' : 'caution',
        diagnosis: `دمای کلاهک (${input.tempCapC}°C) کمتر از محدوده فعال‌سازی و استخراج رنگ مخمر RC-212 (۲۰–۲۸.۵ درجه) است.`,
        solutionSummary: 'انتقال ظروف به محیط گرم‌تر (۲۰–۲۲ درجه) یا استفاده از کمربند حرارتی کنترل‌شده.',
        steps: [
          'دمای اتاق تخمیر را به ۲۰–۲۲ درجه سانتی‌گراد برسانید.',
          'همزدن ملایم لایه‌های زیرین جهت بیداری مجدد مخمرهای ته‌نشین‌شده.'
        ]
      });
    }
  }
  if (input.issues?.isStuckFermentation) {
    score -= 40;
    actions.push({
      title: 'بحرانی: توقف تخمیر (Stuck Fermentation - بحران ۴)',
      category: 'SG_Ferment',
      severity: 'danger',
      diagnosis: `وزن مخصوص در عدد ${input.currentSG.toFixed(3)} به مدت بیش از ۳۶ ساعت ثابت مانده و قند باقی‌مانده بالاست. مخمرها دچار شوک حرارتی/الکل یا کمبود استرول شده‌اند.`,
      solutionSummary: 'اجرای پروتکل ۲ مرحله‌ای راه‌اندازی مجدد (احیای حرارتی ۲۲–۲۳ درجه + استارتر پیش‌رونده مخمر مقاوم EC-1118 با Go-Ferm و Fermaid O).',
      calculatedRecipe: [
        {
          item: 'مخمر مقاوم Lalvin EC-1118',
          amount: `${Math.round(0.25 * vol * 10) / 10}`,
          unit: 'گرم',
          instruction: 'آب‌دهی در آب ۴۰ درجه با محافظ سلولی Go-Ferm و سازگارکنندگی پله‌ای با الکل'
        },
        {
          item: 'مغذی Go-Ferm Protect',
          amount: `${Math.round(0.30 * vol * 10) / 10}`,
          unit: 'گرم',
          instruction: 'حل‌شده در آب ۴۳ درجه پیش از افزودن مخمر EC-1118'
        },
        {
          item: 'مکمل ارگانیک Fermaid O (سم‌زدایی مخزن)',
          amount: `${Math.round(0.18 * vol * 10) / 10}`,
          unit: 'گرم',
          instruction: 'افزودن مستقیم به شراب متوقف‌شده جهت جذب اسیدهای چرب سمی'
        }
      ],
      steps: [
        'گام اول (احیای حرارتی): دمای شراب را به ۲۲–۲۳ درجه برسانید و دُرد نرم کف ظرف را با میله استیل ضدعفونی‌شده به آرامی معلق کنید.',
        'گام دوم (اگر ظرف ۴۸ ساعت راه نیفتاد): دوز Fermaid O را به مخزن اضافه کنید تا پوسته مخمر اسیدهای چرب بازدارنده را جذب کند.',
        'در یک ظرف ۵ لیتری، Go-Ferm را در آب ۴۳ درجه حل کرده، در ۴۰ درجه مخمر EC-1118 را اضافه کنید و پس از ۲۰ دقیقه، هر ۲ ساعت حجم استارتر را با شراب مخزن دو برابر کنید (1.5L → 3L → 6L) و سپس به کل مخزن تزریق نمایید.'
      ]
    });
  } else if (input.currentBrix > 24.5 && (input.dayNumber === 0 || input.dayNumber === 1 || input.currentSG >= 1.095)) {
    score -= 15;
    actions.push({
      title: 'بریکس اولیه بالا و خطر استرس اسمزی مخمر',
      category: 'SG_Ferment',
      severity: 'warning',
      diagnosis: `بریکس اولیه (${input.currentBrix}° Bx) بالاتر از حد هدف (۲۲.۰° Bx) است. این امر موجب فشار اسمزی بر مخمر و الکل نهایی بالای ۱۴.۵٪ می‌شود.`,
      solutionSummary: 'اصلاح با افزودن آب مقطر اسیدی‌شده جهت کاهش بریکس به ۲۲.۰° Bx و محاسبه تریگرهای پویا بر اساس SG0 واقعی.',
      steps: [
        'افزودن مقدار مشخصی آب مقطر خنک که با اسید تارتاریک به pH=3.52 تنظیم شده است.',
        'استفاده از دوز کامل مکمل YAN با مقیاس‌پذیری پویا (SOP-TEST-05) جهت تقویت تحمل الکلی مخمر.',
        'پایش دقیق دمای تخمیر زیر ۳۰ درجه و محاسبه نقاط تریگر SNA با فرمول پویا SG_trigger = SG0 - f*(SG0 - 1.000).'
      ]
    });
  } else if (input.currentBrix > 0 && input.currentBrix < 20.0 && input.dayNumber === 0) {
    score -= 10;
    const brixDeficit = Math.round((22.0 - input.currentBrix) * 10) / 10;
    const sugarNeededGrams = Math.round(brixDeficit * 10.8 * effectiveLiquidVol);
    actions.push({
      title: 'بریکس اولیه پایین و پتانسیل الکل کم',
      category: 'SG_Ferment',
      severity: 'caution',
      diagnosis: `بریکس اولیه (${input.currentBrix}° Bx) کمتر از استانداردهای انگور رشه سردشت است. الکل نهایی کمتر از ۱۱.۵٪ خواهد شد و بدنه‌ی شراب ضعیف می‌گردد.`,
      solutionSummary:
        'چاپتالیزاسیون (غنی‌سازی با شکر خالص خوراکی به میزان ۱۰.۸ گرم بر لیتر به ازای هر ۱.۰ درجه بریکس کسری — توجه: ۱۷ گرم بر لیتر معادل ۱٪ الکل بالقوه یا ~۱.۶ درجه بریکس است) جهت رسیدن به ۲۲.۰° Bx.',
      calculatedRecipe: [
        {
          item: 'شکر خالص تصفیه‌شده خوراکی',
          amount: `${sugarNeededGrams}`,
          unit: 'گرم',
          instruction:
            'چاپتالیزاسیون (غنی‌سازی با شکر خالص خوراکی به میزان ۱۰.۸ گرم بر لیتر به ازای هر ۱.۰ درجه بریکس کسری — توجه: ۱۷ گرم بر لیتر معادل ۱٪ الکل بالقوه یا ~۱.۶ درجه بریکس است) جهت رسیدن به ۲۲.۰° Bx'
        }
      ],
      steps: [
        `چاپتالیزاسیون (غنی‌سازی با شکر خالص خوراکی به میزان ۱۰.۸ گرم بر لیتر به ازای هر ۱.۰ درجه بریکس کسری — توجه: ۱۷ گرم بر لیتر معادل ۱٪ الکل بالقوه یا ~۱.۶ درجه بریکس است) جهت رسیدن به ۲۲.۰° Bx: مقدار ${sugarNeededGrams} گرم شکر را در مقداری شربت گرم حل کنید.`,
        'محلول را به مخزن افزوده و کاملاً یکنواخت هم بزنید.',
        'بریکس و SG0 جدید را مجدداً اندازه‌گیری کرده و عدد پایه جدید ثبت کنید.'
      ]
    });
  }
  if (input.issues?.hasH2S) {
    score -= 25;
    actions.push({
      title: 'تشخیص بوی گوگرد / تخم‌مرغ گندیده (H2S - بحران ۲)',
      category: 'OffOdor_Spoilage',
      severity: 'danger',
      diagnosis: 'مخمر دچار گرسنگی نیتروژنی (YAN) شده یا گوگرد عنصری سم‌پاشی باغ را به گاز سولفید هیدروژن (H2S) احیا کرده است.',
      solutionSummary: 'هوادهی پاششی فوری (۲۰ بار با پارچ استیل) + تزریق نیتروژن ارگانیک (Fermaid O) یا اجرای تست ۵ لیوانی سولفات مس و اسکوربیک در روز دهم.',
      calculatedRecipe: [
        {
          item: 'مکمل تغذیه‌ای ارگانیک Fermaid O',
          amount: `${Math.round(0.15 * effectiveLiquidVol * 10) / 10}`,
          unit: 'گرم',
          instruction: 'حل‌شده در آب ولرم (در صورت عبور از SG 1.062 مصرف DAP مطلقاً ممنوع است!)'
        },
        {
          item: 'محلول استوک ۰.۱٪ سولفات مس (بطری شماره ۲)',
          amount: `${Math.round(0.25 * effectiveLiquidVol * 10) / 10}`,
          unit: 'میلی‌لیتر',
          instruction:
            'معادل دوز 0.25 mg/L سولفات مس ۵ آبه (CuSO4·5H2O) که برابر با 0.064 mg/L یون مس عنصری (Cu²⁺) است (بسیار کمتر از سقف قانونی 1.0 mg/L OIV) پس از تایید در تست ۵ لیوانی (SOP-TEST-08)'
        }
      ],
      steps: [
        'فوراً با پارچ استیل تمیز، ۲۰ بار مایع را از شیر پایین بردارید و از ارتفاع ۳۰ سانتی‌متری روی کلاهک بپاشید (Splash Aeration).',
        'اگر قبل از SG = 1.057 هستید نوبت SNA را تزریق کنید؛ اگر از 1.057 عبور کرده‌اید صرفاً از Fermaid O ارگانیک استفاده نمایید.',
        'اگر بوی گوگرد تا پایان تخمیر باقی ماند، در روز دهم تست ۵ لیوانی مس و اسید اسکوربیک (SOP-TEST-08) را انجام دهید تا سولفید مس (CuS) رسوب کند و با Bactiless کیلیت شود.'
      ]
    });
  }
  if (input.issues?.hasVolatileAcidity) {
    score -= 30;
    const vaTargetSO2 = getTargetFreeSO2ByPH(input.ph, isRose);
    actions.push({
      title: 'خط قرمز: بوی اسید استیک / سرکه و استات اتیل (Volatile Acidity)',
      category: 'OffOdor_Spoilage',
      severity: 'danger',
      diagnosis: 'باکتری‌های هوازی اسید استیک (Acetobacter) به دلیل تماس اکسیژن با کلاهک شناور خشک یا فضای خالی گالن فعال شده‌اند.',
      solutionSummary: 'غوطه‌ورسازی کامل کلاهک، حذف ۱۰۰٪ فضای خالی، خنک‌سازی زیر ۱۴ درجه و تزریق KMS + کیتوزان (Bactiless).',
      calculatedRecipe: [
        {
          item: 'متابی‌سولفیت پتاسیم (KMS)',
          amount: `${calculateKMS(vol, input.freeSO2, Math.max(42, vaTargetSO2.target), isUnpressedRedMust)}`,
          unit: 'گرم',
          instruction: 'تزریق جهت سرکوب فوری باکتری‌های استیک بر اساس فاز مایع مؤثر'
        },
        {
          item: 'کیتوزان قارچی (Bactiless)',
          amount: `${Math.round(0.30 * effectiveLiquidVol * 10) / 10}`,
          unit: 'گرم',
          instruction: 'معادل 0.30 g/L در فاز پس از تخمیر جهت لیز کردن دیواره سلولی باکتری‌ها'
        }
      ],
      steps: [
        'کلاهک شناور را فوراً مستغرق کرده و فضای بالای مخزن را با گاز CO2 یا آرگون پوشش دهید.',
        'در شراب پس از تخمیر، گالن‌ها را کاملاً لب‌به‌لب (Top-up) کرده و دما را به ۱۲–۱۴ درجه کاهش دهید.',
        'با تزریق KMS و ۰.۳۰ گرم بر لیتر Bactiless، باکتری‌های استیک و مالولاکتیک را به طور کامل حذف نمایید.'
      ]
    });
  }
  if (input.issues?.hasDryCap) {
    score -= 22;
    actions.push({
      title: 'خشک شدن سطح کلاهک پوست (خطر رشد استوباکتر و مگس سرکه)',
      category: 'OffOdor_Spoilage',
      severity: 'warning',
      diagnosis: 'باقی ماندن کلاهک پوست در مجاورت هوا برای بیش از ۸ ساعت باعث خشک شدن سطح آن، رشد باکتری‌های سرکه (Acetobacter) و اکسیداسیون رنگدانه‌ها می‌شود.',
      solutionSummary: 'غوطه‌ورسازی منظم ۴ نوبته (Pigeage هر ۶ ساعت در اوج تخمیر)، خیس کردن کلاهک و پاشش گاز CO2 روی سطح.',
      steps: [
        'در صورت مشاهده لایه سفید یا بوی سرکه روی ۱ سانتی‌متر بالایی کلاهک، ابتدا آن لایه نازک را با کفگیر استریل برداشته و دور بریزید.',
        'کلاهک را به آرامی به زیر شیره فرو ببرید (Pigeage) تا کاملاً با شراب تازه خیس و خنک شود.',
        'دیواره داخلی مخزن در بالای سطح کلاهک را با دستمال آغشته به محلول سولفیت اسیدی (بطری شماره ۳) پاک کنید و درب مخزن را با قفل هوا ببندید.'
      ]
    });
  }
  if (input.issues?.hasBitterSeeds) {
    score -= 18;
    const finingGelatinOrAlbuminG = Math.round(0.08 * effectiveLiquidVol * 100) / 100;
    actions.push({
      title: 'آزاد شدن تانن‌های گس و تلخ هسته انگور (عصاره کاتچین هسته)',
      category: 'Tannin_Fining',
      severity: 'warning',
      diagnosis: 'با افزایش الکل بالای ۶٪ (SG ≤ 1.060) یا له شدن مکانیکی هسته‌ها، لایه مومی هسته انگور حل شده و تانن‌های مونومری تلخ و فلزی وارد شراب شده‌اند.',
      solutionSummary: 'جمع‌آوری فوری هسته‌های کف مخزن شیب‌دار (در SG 1.060)، توقف کوبش خشن کلاهک، پرسینگ به‌موقع در SG 1.008 و گرد کردن طعم در روز ۸۵.',
      calculatedRecipe: [
        {
          item: 'سفیده تخم‌مرغ تازه یا آلبومین انولوژیک (در صورت گسی شدید پس از تخمیر)',
          amount: `${finingGelatinOrAlbuminG}`,
          unit: 'گرم',
          instruction: `معادل 0.08 g/L در ${effectiveLiquidVol}L شراب قرمز (صرفاً پس از تست لیوانی)`
        },
        {
          item: 'گلیسیرین خوراکی خالص (در ایستگاه فینیشینگ روز ۸۵)',
          amount: `${Math.round(2.5 * effectiveLiquidVol)}`,
          unit: 'گرم',
          instruction: 'معادل ۲.۵ گرم بر لیتر پس از تایید در تست ۳ لیوانی گلیسیرین ۱۰٪ (SOP-TEST-08)'
        }
      ],
      steps: [
        'در حین تخمیر قرمز (به‌ویژه در SG = 1.060)، با کفگیر مشبک استیل هسته‌های رهاشده در کف مخزن را جمع‌آوری و خارج کنید.',
        'غوطه‌ورسازی کلاهک را صرفاً با فشار عمودی ملایم دست یا پدل انجام دهید و از ساییدن پوست و هسته به دیواره مخزن خودداری کنید.',
        'اگر در SG = 1.008 تا 1.010 گسی تانن به سقف مطلوب رسید، بلافاصله پرسینگ و جداسازی پوست را انجام دهید.'
      ]
    });
  }
  if (input.issues?.hasCloudiness) {
    score -= 14;
    const enzymeDoseG = Math.round(0.05 * effectiveLiquidVol * 100) / 100;
    const bentoniteDoseG = Math.round(0.20 * effectiveLiquidVol * 100) / 100;
    actions.push({
      title: 'کدورت پایدار شراب (پکتین باقی‌مانده، پروتئین ناپایدار یا دُرد معلق)',
      category: 'Tannin_Fining',
      severity: 'caution',
      diagnosis: 'کدورت شراب ناشی از پکتین شکسته نشده انگور رشه، پروتئین‌های حساس به دما (به‌ویژه در رُزه) یا گاز CO2 محلول است که مانع ته‌نشینی ذرات دُرد نرم می‌شود.',
      solutionSummary: 'اجرای تست الکل ۹۶٪ پکتین (۵mL شراب + ۱۰mL الکل)، گاززدایی و شفاف‌سازی با آنزیم پکتولیتیک یا ژل بنتونیت + سرمایش.',
      calculatedRecipe: [
        {
          item: 'پودر آنزیم پکتولیتیک (در صورت مثبت بودن تست الکل پکتین)',
          amount: `${enzymeDoseG}`,
          unit: 'گرم',
          instruction: `معادل 0.05 g/L حل‌شده در آب سرد بدون کف برای ${effectiveLiquidVol}L`
        },
        {
          item: 'بنتونیت انولوژیک هیدراته‌شده (در صورت کدورت پروتئینی/معلق)',
          amount: `${bentoniteDoseG}`,
          unit: 'گرم',
          instruction: `معادل 0.20 g/L پاشیده‌شده در آب ۵۰ درجه به مدت ۵ ساعت برای ${effectiveLiquidVol}L`
        }
      ],
      steps: [
        'ابتدا ۵ میلی‌لیتر از شراب صاف را با ۱۰ میلی‌لیتر الکل طبی ۹۶٪ مخلوط کنید؛ اگر رشته‌های ژله‌ای تشکیل شد، پکتین عامل کدورت است و باید آنزیم پکتیک بزنید.',
        'اگر تست پکتین منفی بود، با تست لیوانی بنتونیت (SOP-TEST-08) دوز دقیق زلال‌سازی را تعیین کرده و در دمای ۰ تا ۴ درجه ته‌نشین نمایید.'
      ]
    });
  }
  const pHTargetSO2 = getContinuousTargetFreeSO2ByPH(input.ph, isRose);
  const isPostFermentationStage =
    input.currentSG <= 0.995 ||
    (input.dayNumber !== undefined && input.dayNumber > 7 && input.currentSG <= 0.997);
  if (!isPostFermentationStage) {
    if (input.freeSO2 > 40) {
      const isDangerActiveSO2 = input.freeSO2 > 55;
      score -= isDangerActiveSO2 ? 35 : 18;
      actions.push({
        title: 'مسمومیت سولفیتی مخمر در حین تخمیر فعال و خطر تولید H2S',
        category: 'SO2_Oxidation',
        severity: isDangerActiveSO2 ? 'danger' : 'warning',
        diagnosis: `سطح سولفیت آزاد ثبت‌شده در حین تخمیر فعال (${input.freeSO2} mg/L در SG = ${input.currentSG.toFixed(3)}) بیش از حد بالاست! سولفیت آزاد واقعی بالای ۴۰ mg/L آنزیم‌های گلیکولیز مخمر را مهار کرده و خطر تولید H2S را افزایش می‌دهد؛ با این حال توجه علمی داشته باشید که در تخمیر فعال قرمز (SG > 1.000)، آنتوسیانین‌ها، آلدهیدها و ترکیبات احیاکننده با ید در تیتراسیون ریپر (Ripper) تداخل داشته و باعث خوانش کاذب و متورم Free SO2 می‌شوند.`,
        solutionSummary:
          'توقف مطلق هرگونه افزودن KMS جدید، بررسی احتمال خطای کاذب تیتراسیون ریپر (Ripper Interference) در حضور آنتوسیانین‌ها و قندهای احیاکننده (توجه: هوادهی پاششی قادر به پراندن SO2 محلول/متصل از شیره نیست)، حفظ دمای ۲۳–۲۵ °C و تقویت مخمر با نیتروژن ارگانیک Fermaid O.',
        steps: [
          'مطلقاً هیچ متابی‌سولفیت پتاسیم (KMS) جدیدی تا پایان کامل تخمیر الکلی (SG ≤ 0.993) اضافه نکنید!',
          'توجه آزمایشگاهی: در حین تخمیر فعال قرمز، تیتراسیون یدومتری ریپر به دلیل واکنش ید با فنول‌ها، آنتوسیانین‌ها و اسیدهای احیاکننده عدد کاذب بالا نشان می‌دهد و هوادهی پاششی نیز قادر به خارج کردن SO2 از شیره نیست.',
          'دمای مخزن را روی ۲۳ تا ۲۵ درجه سانتی‌گراد نگه دارید و در صورت کندی تخمیر، مخمر را با مکمل ارگانیک Fermaid O تقویت نمایید.'
        ]
      });
    }
  } else {
    const overdoseWarningThreshold = Math.max(60, Math.round(pHTargetSO2.max + 5));
    const overdoseDangerThreshold = Math.max(75, Math.round(pHTargetSO2.max + 15));
    if (input.freeSO2 < pHTargetSO2.min) {
      const isDangerLowSO2 = input.freeSO2 < 15;
      score -= isDangerLowSO2 ? 28 : 16;
      const kmsNeeded = calculateKMS(vol, input.freeSO2, pHTargetSO2.target, isUnpressedRedMust);
      const currentMolSO2 = calculateMolecularSO2(input.freeSO2, input.ph);
      actions.push({
        title: isDangerLowSO2
          ? 'خطر بحرانی اکسیداسیون و فساد میکروبی (افت شدید سولفیت آزاد)'
          : 'افت سولفیت آزاد (SO2) نسبت به جدول pH و خطر اکسیداسیون',
        category: 'SO2_Oxidation',
        severity: isDangerLowSO2 ? 'danger' : 'warning',
        diagnosis: `در اسیدیته فعلی شراب (pH = ${input.ph.toFixed(2)})، برای دستیابی به سطح ضدعفونی‌کننده ۰.۶ تا ۰.۸ mg/L سولفیت مولکولی، سطح سولفیت آزاد باید در بازه ${pHTargetSO2.min} تا ${pHTargetSO2.max} mg/L (هدف: ${pHTargetSO2.target} mg/L) باشد؛ اما سولفیت آزاد فعلی فقط ${input.freeSO2} mg/L (سولفیت مولکولی: ${currentMolSO2} mg/L) است.`,
        solutionSummary: `تزریق دقیق ${kmsNeeded} گرم متابی‌سولفیت پتاسیم (KMS) جهت رسیدن به ${pHTargetSO2.target} mg/L (با رعایت سقف قانونی سولفیت کل Total SO2 ≤ 150 mg/L و قفل ایمنی اسید اسکوربیک).`,
        calculatedRecipe: [
          {
            item: 'متابی‌سولفیت پتاسیم (KMS)',
            amount: `${kmsNeeded}`,
            unit: 'گرم',
            instruction: `حل‌شده در ۱۰۰mL آب مقطر سرد برای رساندن Free SO2 از ${input.freeSO2} به ${pHTargetSO2.target} mg/L در ${effectiveLiquidVol}L`
          }
        ],
        steps: [
          `مقدار ${kmsNeeded} گرم پودر KMS را در آب مقطر سرد حل کرده و به آرامی از کف ظرف تزریق و همگن کنید.`,
          'قانون قفل ایمنی ویتامین C: هرگز اسید اسکوربیک (ویتامین C) را به شرابی که سولفیت آزاد آن زیر ۳۰–۳۵ mg/L است اضافه نکنید؛ زیرا اسید اسکوربیک در غیاب SO2 تولید آب‌اکسیژنه (H2O2) کرده و شراب را به سرعت قهوه‌ای می‌کند!',
          'کنترل بودجه سولفیت کل (Total SO2): مجموع سولفیت تزریق‌شده در کل چرخه (کراش + پس از تخمیر + بطری‌گذاری + تولید مخمر) نباید از سقف قانونی 150 mg/L تجاوز کند.'
        ]
      });
    } else if (input.freeSO2 > overdoseWarningThreshold) {
      const isDangerHighSO2 = input.freeSO2 > overdoseDangerThreshold;
      score -= isDangerHighSO2 ? 38 : 20;
      const stagedPlan = calculateStagedH2O2Plan(effectiveLiquidVol, input.freeSO2, pHTargetSO2.target);
      const h2o2MlNeeded = stagedPlan.totalTheoretical3PercentMl;
      actions.push({
        title: 'اوردوز سولفیت آزاد (رنگ‌پریدگی آنتوسیانین و بوی کبریت سوخته — پروتکل پلکانی H2O2)',
        category: 'SO2_Oxidation',
        severity: isDangerHighSO2 ? 'danger' : 'warning',
        diagnosis: `سولفیت آزاد فعلی (${input.freeSO2} mg/L) بسیار بالاتر از محدوده هدف جدول pH (${pHTargetSO2.min}–${pHTargetSO2.max} mg/L) است! یون بی‌سولفیت مازاد به کربن C4 آنتوسیانین‌ها حمله کرده و باعث بی‌رنگ شدن (Bleaching) موقت شراب، بوی تند گوگرد/کبریت سوخته و سوزش گلو می‌شود (توجه: بالا بودن Free SO2 به تنهایی اثبات‌کننده نقض سقف قانونی Total SO2 نیست و ارزیابی سقف قانونی نیازمند سنجش Total SO2 یا دفتر حسابداری تجمعی است).`,
        solutionSummary: `کاهش پلکانی و ایمن سولفیت آزاد از ${input.freeSO2} به ${stagedPlan.effectiveTargetSO2} mg/L (کف ایمن ≥ 10 mg/L): حداکثر مجاز مرحله اول ${stagedPlan.maxCurrentStep3PercentMl} میلی‌لیتر محلول ۳٪ H2O2 (برای کاهش ≤ 25 mg/L، دوز محافظه‌کارانه ۵۰٪ = ${stagedPlan.recommendedSafeTrialStep1Ml} mL؛ کل تئوری ${h2o2MlNeeded} mL در ${stagedPlan.stagesRequired} مرحله) پس از رقیق‌سازی زیر ۱٪ و تست ۳ لیوانی.`,
        calculatedRecipe: [
          {
            item: 'محلول آب‌اکسیژنه خوراکی ۳٪ (3% Food-Grade H2O2) — سقف ایمن مرحله اول (≤ 25 mg/L)',
            amount: `${stagedPlan.maxCurrentStep3PercentMl}`,
            unit: 'میلی‌لیتر',
            instruction: `حداکثر مجاز مرحله اول برای کاهش ${stagedPlan.currentStepReductionMgL} mg/L (دوز شروع محافظه‌کارانه ۵۰٪ = ${stagedPlan.recommendedSafeTrialStep1Ml} mL؛ کل تئوری ${h2o2MlNeeded} mL در ${stagedPlan.stagesRequired} مرحله با کف ایمن ≥ 10 mg/L)`
          }
        ],
        steps: [
          'استوکیومتری دقیق واکنش: هر ۱ mg/L سولفیت آزاد برای اکسید شدن به سولفات نیازمند ۰.۵۳۰۹ mg آب‌اکسیژنه خالص (معادل ۰.۰۱۷۷ میلی‌لیتر محلول ۳٪ خوراکی در هر لیتر شراب) است؛ هرگز Free SO2 را زیر کف ایمن ۱۰ mg/L کاهش ندهید.',
          `قانون تزریق پلکانی AWRI (حداکثر ۲۵ mg/L کاهش در هر مرحله): در مرحله اول حداکثر ${stagedPlan.maxCurrentStep3PercentMl} میلی‌لیتر (توصیه محافظه‌کارانه ۵۰٪ = ${stagedPlan.recommendedSafeTrialStep1Ml} میلی‌لیتر) را ابتدا در تست ۳ لیوانی ۱۰۰ میلی‌لیتری بررسی کنید.`,
          `رقیق‌سازی زیر ۱٪ پیش از تزریق: دوز مرحله اول را حداقل ۳.۵ برابر با آب مقطر رقیق کنید (حجم محلول رقیق‌شده < 1%: حدود ${stagedPlan.dilutedUnder1PercentTotalVolumeMl} میلی‌لیتر) و به آرامی حین همزدن اضافه کرده و پس از ۶ ساعت Free SO2 را مجدداً تیتر نمایید.`
        ]
      });
    }
  }
  const enrichedActions: CorrectiveAction[] = actions.map((action) => {
    const alertTier: 'critical' | 'attention' | 'info' =
      action.alertTier === 'info' || action.severity === 'normal'
        ? 'info'
        : action.severity === 'danger'
        ? 'critical'
        : 'attention';
    const canSnooze = alertTier !== 'critical';
    let confidenceBadge = action.confidenceBadge;
    let confidenceLabelFa = action.confidenceLabelFa;
    if (!confidenceBadge) {
      if (
        action.solutionSummary.includes('تخمین تجربی') ||
        action.category === 'Tannin_Fining'
      ) {
        confidenceBadge = 'rule_of_thumb';
        confidenceLabelFa = 'قاعدهٔ سرانگشتی تجربی';
      } else {
        confidenceBadge = 'stoichiometric';
        confidenceLabelFa = 'محاسبهٔ استوکیومتری قطعی';
      }
    }
    const sanitizedRecipes =
      hasInvalidVolume && action.calculatedRecipe
        ? action.calculatedRecipe.map((r) => ({
            ...r,
            amount: '0',
            instruction: 'محاسبه متوقف شد — ابتدا حجم معتبر مخزن را وارد کنید'
          }))
        : action.calculatedRecipe;
    const firstRecipe = sanitizedRecipes?.[0];
    const layer1ActionFa = firstRecipe
      ? `${firstRecipe.amount} ${firstRecipe.unit} ${firstRecipe.item} (${action.solutionSummary})`
      : action.solutionSummary;
    return {
      ...action,
      calculatedRecipe: sanitizedRecipes,
      alertTier,
      canSnooze,
      confidenceBadge,
      confidenceLabelFa,
      progressiveLayers: {
        layer1ActionFa,
        layer2WhyFa: action.diagnosis,
        layer3ScienceFa: action.steps.join(' | ')
      }
    };
  });
  const infoActions = enrichedActions.filter((a) => a.alertTier === 'info');
  const severityRank: Record<CorrectiveAction['severity'], number> = {
    danger: 0,
    warning: 1,
    caution: 2,
    normal: 3
  };
  const sortedNonInfo = enrichedActions
    .filter((a) => a.alertTier !== 'info')
    .sort((a, b) => severityRank[a.severity] - severityRank[b.severity]);
  const criticalNonInfoCount = sortedNonInfo.filter((a) => a.severity === 'danger').length;
  const visibleLimit = Math.max(3, criticalNonInfoCount);
  const visibleActions = sortedNonInfo.slice(0, visibleLimit);
  const hiddenActionsCount = Math.max(0, sortedNonInfo.length - visibleLimit);
  const finalScore = Math.max(0, Math.min(100, score));
  const criticalWarningsCount = enrichedActions.filter((a) => a.severity === 'danger').length;
  let overallStatusText = 'تمام پارامترها و شرایط کارگاهی در محدوده ایده‌آل و ایمن قرار دارند.';
  let overallStatusColor: 'emerald' | 'amber' | 'rose' | 'blue' = 'emerald';
  if (criticalWarningsCount > 0) {
    overallStatusText = `توجه: ${criticalWarningsCount} خطای بحرانی کشف شد! نیازمند اقدام و مداخله فوری کارگاهی.`;
    overallStatusColor = 'rose';
  } else if (sortedNonInfo.length > 0) {
    overallStatusText = `شرایط نسبتاً مطلوب است؛ ${sortedNonInfo.length} دستورالعمل اصلاحی جهت بهینه‌سازی پیشنهاد گردید.`;
    overallStatusColor = 'amber';
  }
  return {
    overallHealthScore: finalScore,
    overallStatusText,
    overallStatusColor,
    criticalWarningsCount,
    actions: enrichedActions,
    visibleActions,
    hiddenActionsCount,
    infoActions,
    hasInvalidVolume
  };
}
```

### `src/utils/rightNowEngine.ts` (2085 compact lines)
```ts
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
export type MilestoneState =
  | 'pending'
  | 'due'
  | 'missed'
  | 'closed'
  | 'completed'
  | 'skipped';
export type MilestoneTriggerType = 'sg' | 'day' | 'event';
export interface MilestoneTankRow {
  tankId: TankId;
  tankLabelFa: string;
  doseValue: string;
  doseUnit: string;
  compoundFa: string;
  volumeContextFa: string;
  doseAmountTextFa: string;
  isCompletedForTank: boolean;
  additionsToRecord: Array<Omit<ChemicalAddition, 'id'>>;
}
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
export interface SgAnomalyAlert {
  hasAnomaly: boolean;
  previousSG: number;
  currentSG: number;
  titleFa: string;
  descriptionFa: string;
}
export interface RightNowQueueResult {
  sgAnomaly: SgAnomalyAlert | null;
  primaryAction: RightNowMilestone | null;
  overdueActions: RightNowMilestone[];
  closedActions: RightNowMilestone[];
  upcomingActions: RightNowMilestone[];
  allMilestones: RightNowMilestone[];
}
export interface DeadlineCountdownItem {
  id: 'dap_window' | 'bactiless_contact' | 'post_dryness_so2';
  titleFa: string;
  rangeTextFa: string;
  color: 'emerald' | 'amber' | 'rose' | 'gray';
  urgencyLevel: 'safe' | 'warning' | 'critical' | 'closed';
  explanationFa: string;
}
export interface BottlingGateCheckItem {
  id: string;
  titleFa: string;
  isBlocking: boolean;
  status: 'passed' | 'blocked_red' | 'advisory_amber';
  dataStatus?: 'verified' | 'incomplete_data' | 'failed';
  detailFa: string;
  whyFa: string;
}
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
function getStateBadgeFa(state: MilestoneState): string {
  switch (state) {
    case 'pending':
      return 'در انتظار';
    case 'due':
      return 'موعد رسیده';
    case 'missed':
      return 'جاافتاده — همین الان بزنید';
    case 'closed':
      return 'پنجره بسته شد';
    case 'completed':
      return 'انجام شد';
    case 'skipped':
      return 'رد شد';
  }
}
function formatNowFa(): string {
  try {
    return new Intl.DateTimeFormat('fa-IR', {
      dateStyle: 'short',
      timeStyle: 'short'
    }).format(new Date());
  } catch {
    return '۱۴۰۵/۰۷/۲۵ - ۰۸:۰۰';
  }
}
function isMilestoneCompletedByAdditions(
  milestoneId: string,
  tankAdditions: ChemicalAddition[],
  completedRoadmapStepIds: number[],
  roadmapStepIds: number[]
): boolean {
  if (
    completedRoadmapStepIds.length > 0 &&
    roadmapStepIds.length > 0 &&
    roadmapStepIds.every((id) => completedRoadmapStepIds.includes(id))
  ) {
    return true;
  }
  for (const add of tankAdditions) {
    if (add.isDeleted) continue;
    if (add.milestoneId !== undefined) {
      if (add.milestoneId === milestoneId) return true;
      continue;
    }
    const text = `${add.stageTitle} ${add.purpose} ${add.compoundName}`;
    switch (milestoneId) {
      case 'crush-kms':
        if (
          (add.compoundType === 'kms' ||
            add.pubchemCid === 24446 ||
            /kms|متابیسولفیت|متابی‌سولفیت/i.test(text)) &&
          (add.referenceVolumeL === 150 || text.includes('کراش') || text.includes('اولیه'))
        ) {
          return true;
        }
        break;
      case 'saignee-rose':
        if (
          (add.compoundType === 'kms' || add.pubchemCid === 24446 || text.includes('KMS')) &&
          (text.includes('سانیه') || text.includes('خون‌گیری') || text.includes('+15'))
        ) {
          return true;
        }
        break;
      case 'pectic-enzyme':
        if (add.compoundType === 'enzyme' || text.includes('پکتین') || text.includes('آنزیم')) {
          return true;
        }
        break;
      case 'yeast-inoculation':
        if (
          add.compoundType === 'yeast' ||
          add.compoundType === 'go_ferm' ||
          text.includes('مخمر') ||
          text.includes('RC-212')
        ) {
          return true;
        }
        break;
      case 'sna-1':
        if (
          (add.compoundType === 'fermaid_o' || /fermaid\s*o/i.test(text)) &&
          (text.includes('SNA-1') ||
            text.includes('نوبت اول') ||
            text.includes('روز ۲') ||
            (add.sgAtAddition !== undefined && add.sgAtAddition >= 1.072))
        ) {
          return true;
        }
        break;
      case 'sna-2-dap':
        if (text.includes('SNA-2') || text.includes('نوبت دوم')) {
          return true;
        }
        if (
          tankAdditions.some((a) => !a.isDeleted && a.compoundType === 'fermaid_k') &&
          tankAdditions.some((a) => !a.isDeleted && a.compoundType === 'dap')
        ) {
          return true;
        }
        break;
      case 'phase2-tannin':
        if (
          text.includes('فاز ۲') ||
          text.includes('فاز 2') ||
          text.includes('1.060') ||
          (add.compoundType === 'tannin_red' &&
            !text.includes('فاز ۱') &&
            !text.includes('فاز 1') &&
            !text.includes('روز ۰') &&
            !text.includes('ساعت ۱۱') &&
            add.sgAtAddition !== undefined &&
            add.sgAtAddition <= 1.065 &&
            add.sgAtAddition >= 1.052)
        ) {
          return true;
        }
        break;
      case 'sna-3-organic':
        if (
          (add.compoundType === 'fermaid_o' || /fermaid\s*o/i.test(text)) &&
          (text.includes('SNA-3') ||
            text.includes('نوبت سوم') ||
            text.includes('نهایی') ||
            (add.sgAtAddition !== undefined && add.sgAtAddition < 1.068))
        ) {
          return true;
        }
        break;
      case 'pressing':
        if (text.includes('پرسینگ') || text.includes('جداسازی پوست')) {
          return true;
        }
        break;
      case 'racking-1-gross-lees':
        if (text.includes('سیفون اول') || text.includes('دُرد درشت')) {
          return true;
        }
        break;
      case 'day11-bactiless-kms-lock':
        if (
          add.compoundType === 'bactiless' ||
          /bactiless|ب[ا]?کتی[‌]?لس/i.test(text) ||
          text.includes('روز ۱۱')
        ) {
          return true;
        }
        break;
      case 'day21-bactiless-racking':
        if (text.includes('روز ۲۱') || text.includes('سیفون باکتی')) {
          return true;
        }
        break;
      case 'day65-cold-stab':
        if (
          add.compoundType === 'kht' ||
          text.includes('کرم تارتار') ||
          text.includes('پایدارسازی سرد')
        ) {
          return true;
        }
        break;
      case 'day100-bottling':
        if (
          add.compoundType === 'ascorbic' ||
          text.includes('بطری‌گذاری') ||
          text.includes('اسکوربیک')
        ) {
          return true;
        }
        break;
    }
  }
  return false;
}
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
}): RightNowQueueResult {
  const plan = getEffectiveProtocolPlanForBatch(options.batch, options.plan);
  const activeTankId: TankId = options.activeTankId ?? 'tank-a';
  const completedStepIds = options.completedRoadmapStepIds ?? [];
  const snoozedMap = options.snoozedUntilMsByStepId ?? {};
  const skippedMap = options.skippedReasonsByStepId ?? {};
  const nowMs = options.nowMs ?? Date.now();
  const activeBatchId = options.batchId ?? options.batch?.id ?? 'batch-rasha-1403';
  const hasExplicitBatchFilter = Boolean(options.batchId || options.batch?.id);
  const rejectOrphanRecords = Boolean(
    hasExplicitBatchFilter && options.excludeDemo === true
  );
  const hasRealUserData = Boolean(
    options.excludeDemo ||
      options.batch?.isDemo === false ||
      options.logs.some(
        (l) =>
          !l.isDeleted &&
          !l.isBenchmark &&
          !l.isDemo &&
          (!l.batchId ? !rejectOrphanRecords : l.batchId === activeBatchId)
      ) ||
      options.additions.some(
        (a) =>
          !a.isDeleted &&
          !a.isDemo &&
          (!a.batchId ? !rejectOrphanRecords : a.batchId === activeBatchId)
      )
  );
  const isRecordMatchingActiveBatch = (recordBatchId?: string, recordTankId?: TankId): boolean => {
    if (!hasExplicitBatchFilter) return true;
    if (!recordBatchId) {
      return !rejectOrphanRecords;
    }
    if (recordBatchId === activeBatchId) return true;
    if (
      !hasRealUserData &&
      activeBatchId === 'batch-rasha-1403' &&
      recordTankId === 'tank-rose' &&
      recordBatchId === 'batch-rose-1403'
    ) {
      return true;
    }
    return false;
  };
  const filteredLogs = options.logs.filter((l) => {
    if (l.isDeleted) return false;
    if (!isRecordMatchingActiveBatch(l.batchId, l.tankId)) {
      return false;
    }
    if (hasRealUserData && (l.isDemo === true || l.isBenchmark === true)) {
      return false;
    }
    return true;
  });
  const activeLogsAll = filteredLogs.filter((l) => l.tankId === activeTankId);
  const nonBenchmarkLogs = activeLogsAll.filter((l) => !l.isBenchmark);
  const effectiveTankLogs = sortFermentationLogs(
    nonBenchmarkLogs.length > 0 ? nonBenchmarkLogs : activeLogsAll
  );
  const activeAdditions = options.additions.filter((a) => {
    if (a.isDeleted) return false;
    if (!isRecordMatchingActiveBatch(a.batchId, a.tankId)) {
      return false;
    }
    if (hasRealUserData && a.isDemo === true) {
      return false;
    }
    return true;
  });
  let sgAnomaly: SgAnomalyAlert | null = null;
  if (effectiveTankLogs.length >= 2) {
    const prevLog = effectiveTankLogs[effectiveTankLogs.length - 2];
    const latestLog = effectiveTankLogs[effectiveTankLogs.length - 1];
    if (latestLog.sg > prevLog.sg + 0.002) {
      sgAnomaly = {
        hasAnomaly: true,
        previousSG: prevLog.sg,
        currentSG: latestLog.sg,
        titleFa: 'تخمیر متوقف یا اشتباه ثبت؟',
        descriptionFa:
          'افزایش غیرمنتظرهٔ SG نسبت به ثبت قبلی؛ احتمال خطای قرائت، چسبیدن حباب گاز CO2 به هیدرومتر، عدم تصحیح دمای نمونه یا رکود تخمیر را بررسی کنید.'
      };
    }
  }
  const dynTriggers = calculateDynamicSGTriggers(plan.triggers.initialSG, {
    pressingPoint: plan.triggers.pressingSG,
    drynessPoint: activeTankId === 'tank-rose' ? 0.991 : plan.triggers.drynessSG
  });
  const latestLog = effectiveTankLogs[effectiveTankLogs.length - 1];
  const currentSG = latestLog ? latestLog.sg : dynTriggers.initialSG;
  const currentDay = latestLog ? latestLog.dayNumber : 0;
  const velocityInfo = calculateRecentLogVelocity(
    effectiveTankLogs,
    dynTriggers.initialSG
  );
  const velocityPerDay =
    velocityInfo.hasObservedVelocity && velocityInfo.recentVelocityPerDay > 0.001
      ? velocityInfo.recentVelocityPerDay
      : 0.015;
  const lagBufferHours =
    currentDay <= 1 && !velocityInfo.hasObservedVelocity ? 24 : 0;
  const { volumes, dosages } = plan;
  const initialLiquidPerTankL = volumes.initialLiquidPerTankL;
  const redLiquidPerTankL = volumes.redLiquidFermentPerTankL;
  const saigneeTotalL = volumes.saigneeTotalL;
  const roseFermentL = volumes.roseClarifiedFermentL;
  const rosePostRackingL = volumes.rosePostRackingL;
  const roseFinalBottlingL = volumes.roseFinalBottlingL;
  const rack1PerTankL = volumes.rack1PerTankL;
  const freeRunPerTankL = Math.round((rack1PerTankL / 96) * 100);
  const finalRedPerTankL = Math.round(volumes.finalRedTotalL / 2);
  const crushKmsG = dosages.crushKmsPerTankG;
  const postSaigneeKmsG = dosages.postSaigneeKmsPerTankG;
  const pecticEnzymeRedG = dosages.pecticEnzymeRedPerTankG;
  const pecticEnzymeRoseG = dosages.pecticEnzymeRoseG;
  const yeastRedG = dosages.yeastRedPerTankG;
  const yeastRoseG = dosages.yeastRoseG;
  const goFermRedG = dosages.goFermRedPerTankG;
  const goFermRoseG = dosages.goFermRoseG;
  const fermaidO1RedG = dosages.fermaidO1RedPerTankG;
  const fermaidO1RoseG = dosages.fermaidO1RoseG;
  const zincRoseG = dosages.zincRoseG;
  const fermaidK2RedG = dosages.fermaidK2RedPerTankG;
  const fermaidK2RoseG = dosages.fermaidK2RoseG;
  const dapRedG = dosages.dap2RedPerTankG;
  const dap2RoseG = dosages.dap2RoseG;
  const zincRedG = dosages.zincRedPerTankG;
  const redTanninPhase2G = dosages.redTanninPhase2PerTankG;
  const fermaidO3RedG = dosages.fermaidO3RedPerTankG;
  const fermaidO3RoseG = dosages.fermaidO3RoseG;
  const bactilessRedG = dosages.bactilessRedPerTankG;
  const bactilessRoseG = dosages.bactilessRoseG;
  const day11KmsG = dosages.day11KmsPerTankG;
  const rosePostFermKmsG = dosages.rosePostFermKmsG;
  const khtRedG = dosages.khtColdStabRedPerTankG;
  const khtColdStabRoseG = dosages.khtColdStabRoseG;
  const preBottlingKmsG = dosages.preBottlingKmsPerTankG;
  const rosePreBottlingKmsG = dosages.rosePreBottlingKmsG;
  const ascorbicRedG = dosages.ascorbicRedPerTankG;
  const ascorbicRoseG = dosages.ascorbicRoseG;
  const timestampFa = formatNowFa();
  const batchId = activeBatchId;
  const roseBatchId =
    hasExplicitBatchFilter || hasRealUserData ? activeBatchId : 'batch-rose-1403';
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
  const makeRedTanksRows = (
    milestoneId: string,
    stepIds: number[],
    buildForTank: (tankId: 'tank-a' | 'tank-b', labelFa: string) => {
      doseValue: string;
      doseUnit: string;
      compoundFa: string;
      volumeContextFa: string;
      doseAmountTextFa: string;
      additionsToRecord: Array<Omit<ChemicalAddition, 'id'>>;
    }
  ): MilestoneTankRow[] => {
    const pairs: Array<['tank-a' | 'tank-b', string]> =
      options.batch?.tankCount === 1
        ? [['tank-a', 'مخزن A']]
        : [
            ['tank-a', 'مخزن A'],
            ['tank-b', 'مخزن B']
          ];
    return pairs.map(([tId, labelFa]) => {
      const tankAdds = activeAdditions.filter((a) => a.tankId === tId);
      const isCompletedForTank = isMilestoneCompletedByAdditions(
        milestoneId,
        tankAdds,
        completedStepIds,
        stepIds
      );
      const built = buildForTank(tId, labelFa);
      return {
        tankId: tId,
        tankLabelFa: labelFa,
        doseValue: built.doseValue,
        doseUnit: built.doseUnit,
        compoundFa: built.compoundFa,
        volumeContextFa: built.volumeContextFa,
        doseAmountTextFa: built.doseAmountTextFa,
        isCompletedForTank,
        additionsToRecord: built.additionsToRecord.map((item) => ({
          ...item,
          batchId: item.batchId || activeBatchId,
          milestoneId: item.milestoneId ?? milestoneId,
          dayNumber: item.dayNumber ?? latestLog?.dayNumber,
          timestampMs: item.timestampMs ?? nowMs
        }))
      };
    });
  };
  const appendRoseTankRow = (
    rows: MilestoneTankRow[],
    milestoneId: string,
    stepIds: number[],
    doseAmountTextFa: string,
    additionsToRecord: Array<Omit<ChemicalAddition, 'id'>>,
    structuredMeta?: {
      doseValue: string;
      doseUnit: string;
      compoundFa: string;
      volumeContextFa: string;
    }
  ): MilestoneTankRow[] => {
    if (options.batch?.tankCount === 1 && activeTankId !== 'tank-rose') {
      return rows;
    }
    const roseAdds = activeAdditions.filter((a) => a.tankId === 'tank-rose');
    const roseDone = isMilestoneCompletedByAdditions(
      milestoneId,
      roseAdds,
      completedStepIds,
      stepIds
    );
    rows.push({
      tankId: 'tank-rose',
      tankLabelFa: 'گالن رُزه',
      doseValue: structuredMeta?.doseValue ?? '',
      doseUnit: structuredMeta?.doseUnit ?? 'g',
      compoundFa: structuredMeta?.compoundFa ?? '',
      volumeContextFa: structuredMeta?.volumeContextFa ?? '',
      doseAmountTextFa,
      isCompletedForTank: roseDone,
      additionsToRecord: additionsToRecord.map((item) => ({
        ...item,
        batchId: item.batchId || roseBatchId,
        milestoneId: item.milestoneId ?? milestoneId,
        dayNumber: item.dayNumber ?? latestLog?.dayNumber,
        timestampMs: item.timestampMs ?? nowMs
      }))
    });
    return rows;
  };
  const blueprints: MilestoneBlueprint[] = [
    {
      id: 'crush-kms',
      roadmapStepIds: [5],
      titleFa: 'کراش و سولفیت‌زنی اولیه (۲۵ mg/L SO₂)',
      whyFa: 'حذف مخمرهای وحشی (Kloeckera) و مهار آنزیم پلی‌فنول اکسیداز در لحظه له کردن انگور.',
      howToExecuteFa: `در هر مخزن ${crushKmsG} گرم KMS را در ۵۰۰ میلی‌لیتر آب سرد حل کرده و لایه‌به‌لایه روی توده انگور اسپری کنید.`,
      scienceNoteFa: `KMS = (25 mg/L × ${initialLiquidPerTankL} L) ÷ 570 = ${crushKmsG} g`,
      confidenceLabelFa: 'محاسبهٔ استوکیومتری قطعی',
      triggerType: 'sg',
      triggerSG: dynTriggers.initialSG,
      windowCloseSG: dynTriggers.sna1,
      closedReasonFa: 'تخمیر فعال آغاز شده است؛ افزودن سولفیت در حین تخمیر مخمر را مسموم و تولید H2S می‌کند.',
      buildTankRows: () =>
        makeRedTanksRows('crush-kms', [5], (tId, labelFa) => ({
          doseValue: `${crushKmsG}`,
          doseUnit: 'g',
          compoundFa: 'متابیسولفیت پتاسیم (KMS)',
          volumeContextFa: `برای ${initialLiquidPerTankL} لیتر`,
          doseAmountTextFa: `${crushKmsG} g KMS برای ${initialLiquidPerTankL} L (${labelFa})`,
          additionsToRecord: [
            {
              batchId,
              tankId: tId,
              timestamp: timestampFa,
              stageTitle: 'روز ۰ - کراش و سولفیت‌زنی اولیه (25 mg/L SO2)',
              compoundName: 'پتاسیم متابی‌سولفیت (KMS)',
              pubchemCid: 24446,
              compoundType: 'kms',
              referenceVolumeL: initialLiquidPerTankL,
              calculatedSO2MgL: 25,
              sgAtAddition: currentSG,
              amount: crushKmsG,
              unit: 'g',
              purpose: `سولفیتاسیون اولیه ۲۵ ppm در ${initialLiquidPerTankL} لیتر فاز مایع اولیه`
            }
          ]
        }))
    },
    {
      id: 'saignee-rose',
      roadmapStepIds: [6, 7, 8],
      titleFa: 'خون‌گیری سانیه رُزه و تکمیل سولفیت (+۱۵ mg/L SO₂)',
      whyFa: 'افزایش نسبت پوست به آب‌انگور در مخازن قرمز و رساندن سولفیت پایه به ۴۰ mg/L در ۱۳۲ لیتر باقی‌مانده.',
      howToExecuteFa: `پس از ۳.۵ ساعت خیساندن سرد، از هر مخزن ۱۸ لیتر آب‌انگور زلال برای رُزه جدا کنید و سپس ${postSaigneeKmsG} گرم KMS به هر مخزن قرمز بیفزایید.`,
      scienceNoteFa: `KMS = (15 mg/L × ${redLiquidPerTankL} L) ÷ 570 = ${postSaigneeKmsG} g`,
      confidenceLabelFa: 'محاسبهٔ استوکیومتری قطعی',
      triggerType: 'day',
      triggerDay: 0,
      windowCloseSG: dynTriggers.sna1,
      closedReasonFa: 'پنجرهٔ خون‌گیری پیش از تخمیر بسته شده است.',
      buildTankRows: () =>
        makeRedTanksRows('saignee-rose', [6, 7, 8], (tId, labelFa) => ({
          doseValue: `${postSaigneeKmsG}`,
          doseUnit: 'g',
          compoundFa: 'متابیسولفیت پتاسیم (KMS)',
          volumeContextFa: `برای ${redLiquidPerTankL} لیتر`,
          doseAmountTextFa: `${postSaigneeKmsG} g KMS برای ${redLiquidPerTankL} L (${labelFa})`,
          additionsToRecord: [
            {
              batchId,
              tankId: tId,
              timestamp: timestampFa,
              stageTitle: 'روز ۰ - تکمیل سولفیت پس از خون‌گیری سانیه (+15 mg/L SO2)',
              compoundName: 'پتاسیم متابی‌سولفیت (KMS)',
              pubchemCid: 24446,
              compoundType: 'kms',
              referenceVolumeL: redLiquidPerTankL,
              calculatedSO2MgL: 14.8,
              sgAtAddition: currentSG,
              amount: postSaigneeKmsG,
              unit: 'g',
              purpose: `تکمیل دوز سولفیت در ${redLiquidPerTankL} لیتر فاز مایع پس از خون‌گیری سانیه`
            }
          ]
        }))
    },
    {
      id: 'pectic-enzyme',
      roadmapStepIds: [8, 9],
      titleFa: 'تزریق آنزیم پکتولیتیک و استخراج آنتوسیانین',
      whyFa: 'پوست ضخیم انگور رشه سردشت بدون شکستن زنجیره پکتین رنگ یاقوتی و پلی‌فنول‌های خود را کامل آزاد نمی‌کند.',
      howToExecuteFa: `حداقل ۱۵ دقیقه پس از سولفیت‌زنی صبر کنید، سپس ${pecticEnzymeRedG} گرم آنزیم پکتیناز را در آب سرد بدون کلر حل کرده و به هر مخزن اضافه کنید.`,
      scienceNoteFa: `0.055 g/L × ${redLiquidPerTankL} L = ${pecticEnzymeRedG} g Endo-Polygalacturonase`,
      confidenceLabelFa: 'محاسبهٔ استوکیومتری قطعی',
      triggerType: 'day',
      triggerDay: 0,
      windowCloseSG: dynTriggers.sna1,
      closedReasonFa: 'پنجرهٔ آنزیم‌زنی پیش از تخمیر به پایان رسیده است.',
      buildTankRows: () =>
        appendRoseTankRow(
          makeRedTanksRows('pectic-enzyme', [8, 9], (tId, labelFa) => ({
            doseValue: `${pecticEnzymeRedG}`,
            doseUnit: 'g',
            compoundFa: 'آنزیم پکتیناز',
            volumeContextFa: `برای ${redLiquidPerTankL} لیتر`,
            doseAmountTextFa: `${pecticEnzymeRedG} g آنزیم پکتیناز برای ${redLiquidPerTankL} L (${labelFa})`,
            additionsToRecord: [
              {
                batchId,
                tankId: tId,
                timestamp: timestampFa,
                stageTitle: 'روز ۰ - آنزیم‌زنی و استخراج رنگ',
                compoundName: 'آنزیم پکتیناز (Endo-Polygalacturonase)',
                compoundType: 'enzyme',
                referenceVolumeL: redLiquidPerTankL,
                sgAtAddition: currentSG,
                amount: pecticEnzymeRedG,
                unit: 'g',
                purpose: 'شکستن پکتین دیواره سلولی ضخیم انگور رشه و آزادسازی آنتوسیانین'
              }
            ]
          })),
          'pectic-enzyme',
          [8, 9],
          `${pecticEnzymeRoseG} g آنزیم پکتیناز برای ${saigneeTotalL} L (گالن رُزه)`,
          [
            {
              batchId: roseBatchId,
              tankId: 'tank-rose',
              timestamp: timestampFa,
              stageTitle: 'روز ۰ - آنزیم‌زنی و شفاف‌سازی رُزه (Débourbage)',
              compoundName: 'آنزیم پکتیناز (Endo-Polygalacturonase)',
              compoundType: 'enzyme',
              referenceVolumeL: saigneeTotalL,
              sgAtAddition: currentSG,
              amount: pecticEnzymeRoseG,
              unit: 'g',
              purpose: `شکستن پکتین و زلال‌سازی سرد در ${saigneeTotalL} لیتر شیره سانیه رُزه`
            }
          ],
          {
            doseValue: `${pecticEnzymeRoseG}`,
            doseUnit: 'g',
            compoundFa: 'آنزیم پکتیناز',
            volumeContextFa: `برای ${saigneeTotalL} لیتر`
          }
        )
    },
    {
      id: 'yeast-inoculation',
      roadmapStepIds: [13, 14],
      titleFa: 'آبرسانی مخمر Lalvin RC-212 با محافظ غشایی Go-Ferm',
      whyFa: 'تضمین غلبهٔ کامل مخمر انتخابی مقاوم به الکل و تامین استرول‌های غشایی از ساعت اول تخمیر.',
      howToExecuteFa: `${goFermRedG} گرم Go-Ferm را در آب ۴۳ درجه حل کنید، در ۳۸ درجه ${yeastRedG} گرم مخمر RC-212 را بپاشید و پس از هم‌دماسازی پله‌ای (ΔT < 5°C) به مخزن تزریق کنید.`,
      scienceNoteFa: `Yeast = 0.25 g/L (${yeastRedG} g) + Go-Ferm = 0.30 g/L (${goFermRedG} g) در ${redLiquidPerTankL} L`,
      confidenceLabelFa: 'محاسبهٔ استوکیومتری قطعی',
      triggerType: 'day',
      triggerDay: 0,
      windowCloseSG: dynTriggers.sna2,
      closedReasonFa: 'تخمیر از مرحلهٔ تلقیح اولیه عبور کرده است.',
      buildTankRows: () =>
        appendRoseTankRow(
          makeRedTanksRows('yeast-inoculation', [13, 14], (tId, labelFa) => ({
            doseValue: `${yeastRedG} + ${goFermRedG}`,
            doseUnit: 'g',
            compoundFa: 'مخمر RC-212 + Go-Ferm',
            volumeContextFa: `برای ${redLiquidPerTankL} لیتر`,
            doseAmountTextFa: `${yeastRedG} g مخمر RC-212 + ${goFermRedG} g Go-Ferm برای ${redLiquidPerTankL} L (${labelFa})`,
            additionsToRecord: [
              {
                batchId,
                tankId: tId,
                timestamp: timestampFa,
                stageTitle: 'روز ۰ - تلقیح مخمر Lalvin RC-212',
                compoundName: 'مخمر خشک فعال Lalvin RC-212',
                compoundType: 'yeast',
                referenceVolumeL: redLiquidPerTankL,
                sgAtAddition: currentSG,
                amount: yeastRedG,
                unit: 'g',
                purpose: `تلقیح مخمر انتخابی (0.25 g/L) در ${redLiquidPerTankL} لیتر`
              },
              {
                batchId,
                tankId: tId,
                timestamp: timestampFa,
                stageTitle: 'روز ۰ - محافظ غشایی Go-Ferm Protect',
                compoundName: 'Go-Ferm Protect Evolution',
                compoundType: 'go_ferm',
                referenceVolumeL: redLiquidPerTankL,
                sgAtAddition: currentSG,
                amount: goFermRedG,
                unit: 'g',
                purpose: `تامین استرول و ریزمغذی آبرسانی مخمر (0.30 g/L) در ${redLiquidPerTankL} لیتر`
              }
            ]
          })),
          'yeast-inoculation',
          [13, 14],
          `${yeastRoseG} g مخمر RC-212 + ${goFermRoseG} g Go-Ferm برای ${roseFermentL} L (گالن رُزه)`,
          [
            {
              batchId: roseBatchId,
              tankId: 'tank-rose',
              timestamp: timestampFa,
              stageTitle: 'روز ۰ - تلقیح مخمر رُزه Lalvin RC-212',
              compoundName: 'مخمر خشک فعال Lalvin RC-212',
              compoundType: 'yeast',
              referenceVolumeL: roseFermentL,
              sgAtAddition: currentSG,
              amount: yeastRoseG,
              unit: 'g',
              purpose: `تلقیح مخمر رُزه در ${roseFermentL} لیتر آب‌انگور شفاف`
            },
            {
              batchId: roseBatchId,
              tankId: 'tank-rose',
              timestamp: timestampFa,
              stageTitle: 'روز ۰ - محافظ غشایی Go-Ferm رُزه',
              compoundName: 'Go-Ferm Protect Evolution',
              compoundType: 'go_ferm',
              referenceVolumeL: roseFermentL,
              sgAtAddition: currentSG,
              amount: goFermRoseG,
              unit: 'g',
              purpose: `تامین استرول آبرسانی مخمر رُزه در ${roseFermentL} لیتر`
            }
          ],
          {
            doseValue: `${yeastRoseG} + ${goFermRoseG}`,
            doseUnit: 'g',
            compoundFa: 'مخمر RC-212 + Go-Ferm',
            volumeContextFa: `برای ${roseFermentL} لیتر`
          }
        )
    },
    {
      id: 'sna-1',
      roadmapStepIds: [16],
      titleFa: `تغذیه نوبت اول مخمر (SNA-1 در SG = ${dynTriggers.sna1.toFixed(3)})`,
      whyFa: 'تامین اسیدهای آمینه آلی (Fermaid O) در پایان فاز رشد لگاریتمی بدون ایجاد جهش حرارتی ناگهانی.',
      howToExecuteFa: `${fermaidO1RedG} گرم Fermaid O را در نمونه شیره حل کرده و همراه با پیژاژ کامل در مخزن پخش کنید.`,
      scienceNoteFa: `SG_SNA1 = SG0 - 0.10 × (SG0 - 1.000) = ${dynTriggers.sna1.toFixed(3)} | 0.25 g/L Fermaid O`,
      confidenceLabelFa: 'محاسبهٔ استوکیومتری قطعی',
      triggerType: 'sg',
      triggerSG: dynTriggers.sna1,
      windowCloseSG: dynTriggers.oneThirdCeiling,
      closedReasonFa: `پنجرهٔ SNA-1 پس از عبور از سقف ۱/۳ قند (SG ${dynTriggers.oneThirdCeiling.toFixed(3)}) بسته شد؛ به سراغ نوبت SNA-3 بروید.`,
      buildTankRows: () =>
        appendRoseTankRow(
          makeRedTanksRows('sna-1', [16], (tId, labelFa) => ({
            doseValue: `${fermaidO1RedG}`,
            doseUnit: 'g',
            compoundFa: 'Fermaid O',
            volumeContextFa: `برای ${redLiquidPerTankL} لیتر`,
            doseAmountTextFa: `${fermaidO1RedG} g Fermaid O برای ${redLiquidPerTankL} L (${labelFa})`,
            additionsToRecord: [
              {
                batchId,
                tankId: tId,
                timestamp: timestampFa,
                stageTitle: `روز ۲ - تغذیه نوبت اول (SNA-1 در SG = ${dynTriggers.sna1.toFixed(3)})`,
                compoundName: 'نیتروژن آلی (Fermaid O)',
                compoundType: 'fermaid_o',
                referenceVolumeL: redLiquidPerTankL,
                sgAtAddition: currentSG,
                amount: fermaidO1RedG,
                unit: 'g',
                purpose: `تامین نیتروژن آلی اسیدهای آمینه (0.25 g/L در ${redLiquidPerTankL} لیتر)`
              }
            ]
          })),
          'sna-1',
          [16],
          `${fermaidO1RoseG} g Fermaid O + ${zincRoseG} g سولفات روی برای ${roseFermentL} L (گالن رُزه)`,
          [
            {
              batchId: roseBatchId,
              tankId: 'tank-rose',
              timestamp: timestampFa,
              stageTitle: `روز ۲ - تغذیه نوبت اول رُزه (SNA-1 در SG = ${dynTriggers.sna1.toFixed(3)})`,
              compoundName: 'نیتروژن آلی (Fermaid O)',
              compoundType: 'fermaid_o',
              referenceVolumeL: roseFermentL,
              sgAtAddition: currentSG,
              amount: fermaidO1RoseG,
              unit: 'g',
              purpose: `تامین نیتروژن آلی رُزه در ${roseFermentL} لیتر`
            },
            {
              batchId: roseBatchId,
              tankId: 'tank-rose',
              timestamp: timestampFa,
              stageTitle: `روز ۲ - ریزمغذی روی رُزه (SNA-1 در SG = ${dynTriggers.sna1.toFixed(3)})`,
              compoundName: 'سولفات روی هپتاهیدرات (ZnSO4·7H2O)',
              compoundType: 'zinc',
              referenceVolumeL: roseFermentL,
              sgAtAddition: currentSG,
              amount: zincRoseG,
              unit: 'g',
              purpose: `تامین کوفاکتور روی برای سنتز استرهای میوه‌ای رُزه در ${roseFermentL} لیتر`
            }
          ],
          {
            doseValue: `${fermaidO1RoseG} + ${zincRoseG}`,
            doseUnit: 'g',
            compoundFa: 'Fermaid O + سولفات روی',
            volumeContextFa: `برای ${roseFermentL} لیتر`
          }
        )
    },
    {
      id: 'sna-2-dap',
      roadmapStepIds: [17],
      titleFa: `تغذیه نوبت دوم و آخرین مهلت DAP (SNA-2 در SG = ${dynTriggers.sna2.toFixed(3)})`,
      whyFa: 'رساندن نیتروژن به اوج جمعیت مخمر پیش از بسته شدن حامل‌های غشایی آمونیوم در الکل ۶٪ (SG 1.062).',
      howToExecuteFa: `${fermaidK2RedG} گرم Fermaid K + ${dapRedG} گرم DAP + ${zincRedG} گرم سولفات روی را حل کرده و پس از هوادهی ملایم تزریق کنید.`,
      scienceNoteFa: `پنجره مجاز DAP فقط تا سقف ۱/۳ مصرف قند (SG ≥ ${dynTriggers.oneThirdCeiling.toFixed(3)}) باز است.`,
      confidenceLabelFa: 'محاسبهٔ استوکیومتری قطعی',
      triggerType: 'sg',
      triggerSG: dynTriggers.sna2,
      windowCloseSG: dynTriggers.oneThirdCeiling,
      closedReasonFa:
        'پنجرهٔ DAP بسته شد؛ مصرف نیتروژن معدنی پس از یک‌سوم قند (SG 1.062) ممنوع است و فقط Fermaid O مجاز است.',
      buildTankRows: () =>
        appendRoseTankRow(
          makeRedTanksRows('sna-2-dap', [17], (tId, labelFa) => ({
            doseValue: `${fermaidK2RedG} + ${dapRedG} + ${zincRedG}`,
            doseUnit: 'g',
            compoundFa: 'Fermaid K + DAP + سولفات روی',
            volumeContextFa: `برای ${redLiquidPerTankL} لیتر`,
            doseAmountTextFa: `${fermaidK2RedG} g Fermaid K + ${dapRedG} g DAP + ${zincRedG} g Zinc برای ${redLiquidPerTankL} L (${labelFa})`,
            additionsToRecord: [
              {
                batchId,
                tankId: tId,
                timestamp: timestampFa,
                stageTitle: `روز ۳ - تغذیه نوبت دوم (SNA-2 در SG = ${dynTriggers.sna2.toFixed(3)})`,
                compoundName: 'مکمل مخمر Fermaid K',
                compoundType: 'fermaid_k',
                referenceVolumeL: redLiquidPerTankL,
                sgAtAddition: currentSG,
                amount: fermaidK2RedG,
                unit: 'g',
                purpose: `تامین نیتروژن ترکیبی و تیامین در ${redLiquidPerTankL} لیتر`
              },
              {
                batchId,
                tankId: tId,
                timestamp: timestampFa,
                stageTitle: `روز ۳ - تغذیه نوبت دوم (SNA-2 در SG = ${dynTriggers.sna2.toFixed(3)})`,
                compoundName: 'دی‌آمونیوم فسفات (DAP)',
                pubchemCid: 24261,
                compoundType: 'dap',
                referenceVolumeL: redLiquidPerTankL,
                sgAtAddition: currentSG,
                amount: dapRedG,
                unit: 'g',
                purpose: `آخرین مهلت مجاز تزریق آمونیوم معدنی پیش از SG ${dynTriggers.oneThirdCeiling.toFixed(3)}`
              },
              {
                batchId,
                tankId: tId,
                timestamp: timestampFa,
                stageTitle: `روز ۳ - ریزمغذی روی (SNA-2 در SG = ${dynTriggers.sna2.toFixed(3)})`,
                compoundName: 'سولفات روی هپتاهیدرات (ZnSO4·7H2O)',
                compoundType: 'zinc',
                referenceVolumeL: redLiquidPerTankL,
                sgAtAddition: currentSG,
                amount: zincRedG,
                unit: 'g',
                purpose: 'کوفاکتور آنزیم الکل دهیدروژناز (ADH1) در سقف ایمن ۲ mg/L'
              }
            ]
          })),
          'sna-2-dap',
          [17],
          `${fermaidK2RoseG} g Fermaid K + ${dap2RoseG} g DAP برای ${roseFermentL} L (گالن رُزه)`,
          [
            {
              batchId: roseBatchId,
              tankId: 'tank-rose',
              timestamp: timestampFa,
              stageTitle: `روز ۳ - تغذیه نوبت دوم رُزه (SNA-2 در SG = ${dynTriggers.sna2.toFixed(3)})`,
              compoundName: 'مکمل مخمر Fermaid K',
              compoundType: 'fermaid_k',
              referenceVolumeL: roseFermentL,
              sgAtAddition: currentSG,
              amount: fermaidK2RoseG,
              unit: 'g',
              purpose: `تامین نیتروژن ترکیبی رُزه در ${roseFermentL} لیتر`
            },
            {
              batchId: roseBatchId,
              tankId: 'tank-rose',
              timestamp: timestampFa,
              stageTitle: `روز ۳ - تغذیه نوبت دوم رُزه (SNA-2 در SG = ${dynTriggers.sna2.toFixed(3)})`,
              compoundName: 'دی‌آمونیوم فسفات (DAP)',
              pubchemCid: 24261,
              compoundType: 'dap',
              referenceVolumeL: roseFermentL,
              sgAtAddition: currentSG,
              amount: dap2RoseG,
              unit: 'g',
              purpose: `آخرین مهلت مجاز تزریق آمونیوم معدنی رُزه پیش از SG ${dynTriggers.oneThirdCeiling.toFixed(3)}`
            }
          ],
          {
            doseValue: `${fermaidK2RoseG} + ${dap2RoseG}`,
            doseUnit: 'g',
            compoundFa: 'Fermaid K + DAP',
            volumeContextFa: `برای ${roseFermentL} لیتر`
          }
        )
    },
    {
      id: 'phase2-tannin',
      roadmapStepIds: [18],
      titleFa: `تثبیت آنتوسیانین با تانن فاز ۲ و جمع‌آوری هسته (SG = ${dynTriggers.phase2Tannin.toFixed(3)})`,
      whyFa: 'تشکیل پیوند کووالانسی رنگدانه–تانن در حضور استالدهید و جلوگیری از استخراج تانن تلخ هسته.',
      howToExecuteFa: `هسته‌های ته‌نشین‌شده در کف مخزن را خارج کرده و ${redTanninPhase2G} گرم تانن انولوژیک قرمز را به هر مخزن اضافه کنید.`,
      scienceNoteFa: `0.10 g/L × ${redLiquidPerTankL} L = ${redTanninPhase2G} g Condensed Grape Tannin`,
      confidenceLabelFa: 'محاسبهٔ استوکیومتری قطعی',
      triggerType: 'sg',
      triggerSG: dynTriggers.phase2Tannin,
      windowCloseSG: 1.020,
      closedReasonFa: 'فاز استخراج الکلی میانی به پایان رسیده است.',
      buildTankRows: () =>
        makeRedTanksRows('phase2-tannin', [18], (tId, labelFa) => ({
          doseValue: `${redTanninPhase2G}`,
          doseUnit: 'g',
          compoundFa: 'تانن انولوژیک قرمز',
          volumeContextFa: `برای ${redLiquidPerTankL} لیتر`,
          doseAmountTextFa: `${redTanninPhase2G} g تانن قرمز برای ${redLiquidPerTankL} L (${labelFa})`,
          additionsToRecord: [
            {
              batchId,
              tankId: tId,
              timestamp: timestampFa,
              stageTitle: `روز ۳.۵ - تانن فاز ۲ و تثبیت رنگ (SG = ${dynTriggers.phase2Tannin.toFixed(3)})`,
              compoundName: 'تانن انولوژیک قرمز (Condensed Tannin)',
              compoundType: 'tannin_red',
              referenceVolumeL: redLiquidPerTankL,
              sgAtAddition: currentSG,
              amount: redTanninPhase2G,
              unit: 'g',
              purpose: 'تثبیت کمپلکس آنتوسیانین–تانن و ساختاردهی میانی کام'
            }
          ]
        }))
    },
    {
      id: 'sna-3-organic',
      roadmapStepIds: [19],
      titleFa: `تغذیه نوبت سوم ۱۰۰٪ ارگانیک (SNA-3 در SG = ${dynTriggers.sna3.toFixed(3)})`,
      whyFa: 'جلوگیری از توقف تخمیر در نیمه دوم و پیشگیری از تولید H2S بدون هیچ‌گونه نمک آمونیوم.',
      howToExecuteFa: `صرفاً ${fermaidO3RedG} گرم Fermaid O خالص را در نمونه شراب حل و به هر مخزن اضافه کنید (DAP و Fermaid K مطلقاً ممنوع!).`,
      scienceNoteFa: `SG_SNA3 = ${dynTriggers.sna3.toFixed(3)} (~38% افت قند) | ${plan.params.fermaidO3RedRateGL.toFixed(2)} g/L Fermaid O (0g DAP)`,
      confidenceLabelFa: 'محاسبهٔ استوکیومتری قطعی',
      triggerType: 'sg',
      triggerSG: dynTriggers.sna3,
      windowCloseSG: 1.030,
      closedReasonFa: 'پنجرهٔ جذب اسیدهای آمینه در پایان تخمیر بسته شده است.',
      buildTankRows: () =>
        appendRoseTankRow(
          makeRedTanksRows('sna-3-organic', [19], (tId, labelFa) => ({
            doseValue: `${fermaidO3RedG}`,
            doseUnit: 'g',
            compoundFa: 'Fermaid O',
            volumeContextFa: `برای ${redLiquidPerTankL} لیتر`,
            doseAmountTextFa: `${fermaidO3RedG} g Fermaid O برای ${redLiquidPerTankL} L (${labelFa})`,
            additionsToRecord: [
              {
                batchId,
                tankId: tId,
                timestamp: timestampFa,
                stageTitle: `روز ۴ - تغذیه نوبت سوم ۱۰۰٪ ارگانیک (SNA-3 در SG = ${dynTriggers.sna3.toFixed(3)})`,
                compoundName: 'نیتروژن آلی (Fermaid O)',
                compoundType: 'fermaid_o',
                referenceVolumeL: redLiquidPerTankL,
                sgAtAddition: currentSG,
                amount: fermaidO3RedG,
                unit: 'g',
                purpose: 'تغذیه نهایی ۱۰۰٪ ارگانیک جهت اتمام قند بدون باقیمانده آمونیوم'
              }
            ]
          })),
          'sna-3-organic',
          [19],
          `${fermaidO3RoseG} g Fermaid O برای ${roseFermentL} L (گالن رُزه)`,
          [
            {
              batchId: roseBatchId,
              tankId: 'tank-rose',
              timestamp: timestampFa,
              stageTitle: `روز ۴ - تغذیه نوبت سوم ۱۰۰٪ ارگانیک رُزه (SNA-3 در SG = ${dynTriggers.sna3.toFixed(3)})`,
              compoundName: 'نیتروژن آلی (Fermaid O)',
              compoundType: 'fermaid_o',
              referenceVolumeL: roseFermentL,
              sgAtAddition: currentSG,
              amount: fermaidO3RoseG,
              unit: 'g',
              purpose: `تغذیه نهایی ۱۰۰٪ ارگانیک رُزه در ${roseFermentL} لیتر`
            }
          ],
          {
            doseValue: `${fermaidO3RoseG}`,
            doseUnit: 'g',
            compoundFa: 'Fermaid O',
            volumeContextFa: `برای ${roseFermentL} لیتر`
          }
        )
    },
    {
      id: 'pressing',
      roadmapStepIds: [21, 22],
      titleFa: `نقطه طلایی پرسینگ و جداسازی شراب آب‌آزاد (SG = ${dynTriggers.pressingPoint.toFixed(3)})`,
      whyFa: 'جداسازی پوست پیش از صفر شدن گاز CO2 تا کلاهک غرق نشود و تانن‌های خشن به شراب نفوذ نکنند.',
      howToExecuteFa: 'ابتدا شراب آب‌آزاد (Free-Run) را با سیفون به گالن‌های شیشه‌ای منتقل کنید و تفاله را با فشار ملایم (< 1.2 bar) در گالن جداگانه پرس نمایید.',
      scienceNoteFa: 'حفظ ۲۰ گرم بر لیتر قند باقی‌مانده هنگام پرسینگ، سپر محافظ طبیعی CO2 را در گالن‌ها بازسازی می‌کند.',
      confidenceLabelFa: 'محاسبهٔ استوکیومتری قطعی',
      triggerType: 'sg',
      triggerSG: dynTriggers.pressingPoint,
      windowCloseSG: 0.996,
      closedReasonFa: 'تخمیر به خشکی رسیده است؛ فوراً جداسازی تفاله را انجام دهید.',
      buildTankRows: () =>
        makeRedTanksRows('pressing', [21, 22], (_tId, labelFa) => ({
          doseValue: `${freeRunPerTankL}`,
          doseUnit: 'L',
          compoundFa: 'شراب آب‌آزاد',
          volumeContextFa: `از ${redLiquidPerTankL} لیتر فاز مایع`,
          doseAmountTextFa: `جداسازی آب‌آزاد و پرس ملایم (${labelFa})`,
          additionsToRecord: []
        }))
    },
    {
      id: 'racking-1-gross-lees',
      roadmapStepIds: [25, 26],
      titleFa: 'سیفون اول (جداسازی دُرد درشت ۲۴ ساعته) و تست مس',
      whyFa: 'حذف سلول‌های مرده و تفاله سنگین ظرف ۲۴ تا ۴۸ ساعت پس از خشکی کامل (SG ≤ 0.993) برای جلوگیری از بوی احیایی H2S.',
      howToExecuteFa: 'شراب شفاف را از روی لایه دُرد غلیظ کف گالن سیفون کنید و در صورت وجود بوی گوگرد، تست ۵ لیوانی سولفات مس را اجرا نمایید.',
      scienceNoteFa: 'جداسازی Gross Lees در روز ۱۰ از اتولیز بدبوی مرکاپتان‌ها جلوگیری می‌کند.',
      confidenceLabelFa: 'محاسبهٔ استوکیومتری قطعی',
      triggerType: 'day',
      triggerSG: 0.994,
      triggerDay: 10,
      windowCloseDay: 15,
      closedReasonFa: 'مهلت سیفون اول گذشته است؛ هرچه سریع‌تر دُرد درشت را جدا کنید.',
      buildTankRows: () =>
        appendRoseTankRow(
          makeRedTanksRows('racking-1-gross-lees', [25, 26], (_tId, labelFa) => ({
            doseValue: `${rack1PerTankL}`,
            doseUnit: 'L',
            compoundFa: 'شراب صاف (سیفون اول)',
            volumeContextFa: `برای ${rack1PerTankL} لیتر`,
            doseAmountTextFa: `سیفون به حجم خالص ${rack1PerTankL} L (${labelFa})`,
            additionsToRecord: []
          })),
          'racking-1-gross-lees',
          [25, 26],
          `سیفون به حجم خالص ${rosePostRackingL} L (گالن رُزه)`,
          [],
          {
            doseValue: `${rosePostRackingL}`,
            doseUnit: 'L',
            compoundFa: 'شراب صاف رُزه (سیفون اول)',
            volumeContextFa: `برای ${rosePostRackingL} لیتر`
          }
        )
    },
    {
      id: 'day11-bactiless-kms-lock',
      roadmapStepIds: [27],
      titleFa: 'قفل ضدباکتری بدون مالولاکتیک (Bactiless + KMS روز ۱۱)',
      whyFa: 'حذف کامل باکتری‌های اسید لاکتیک (Oenococcus) و استوباکتر برای حفظ طراوت اسید طبیعی انگور رشه و جلوگیری از پرش pH.',
      howToExecuteFa: `در هر مخزن (${rack1PerTankL} لیتر شراب صاف پس از سیفون اول) ابتدا ${bactilessRedG} گرم Bactiless و سپس ${day11KmsG} گرم KMS تزریق کنید.`,
      scienceNoteFa: `Bactiless = 0.30 g/L (${bactilessRedG} g) | KMS = (40 mg/L × ${rack1PerTankL} L) ÷ 570 = ${day11KmsG} g`,
      confidenceLabelFa: 'محاسبهٔ استوکیومتری قطعی',
      triggerType: 'day',
      triggerSG: 0.994,
      triggerDay: 11,
      windowCloseDay: 20,
      closedReasonFa: 'پنجرهٔ تثبیت اولیه روز ۱۱ گذشته است؛ فوراً سطح Free SO2 را بررسی کنید.',
      buildTankRows: () =>
        appendRoseTankRow(
          makeRedTanksRows('day11-bactiless-kms-lock', [27], (tId, labelFa) => ({
            doseValue: `${bactilessRedG} + ${day11KmsG}`,
            doseUnit: 'g',
            compoundFa: 'باکتیلس + KMS',
            volumeContextFa: `برای ${rack1PerTankL} لیتر`,
            doseAmountTextFa: `${bactilessRedG} g Bactiless + ${day11KmsG} g KMS برای ${rack1PerTankL} L (${labelFa})`,
            additionsToRecord: [
              {
                batchId,
                tankId: tId,
                timestamp: timestampFa,
                stageTitle: 'روز ۱۱ - قفل کیتوزان ضدباکتری (Bactiless No-MLF Lock)',
                compoundName: 'کیتوزان قارچی (Bactiless)',
                compoundType: 'bactiless',
                referenceVolumeL: rack1PerTankL,
                sgAtAddition: currentSG,
                amount: bactilessRedG,
                unit: 'g',
                purpose: `حذف باکتری‌های اسید لاکتیک و استیک (0.30 g/L در ${rack1PerTankL} لیتر)`
              },
              {
                batchId,
                tankId: tId,
                timestamp: timestampFa,
                stageTitle: 'روز ۱۱ - تثبیت سولفیت پس از تخمیر (40 mg/L SO2)',
                compoundName: 'پتاسیم متابی‌سولفیت (KMS)',
                pubchemCid: 24446,
                compoundType: 'kms',
                referenceVolumeL: rack1PerTankL,
                calculatedSO2MgL: 40,
                sgAtAddition: currentSG,
                amount: day11KmsG,
                unit: 'g',
                purpose: `تثبیت شراب خشک با ۴۰ ppm سولفیت در ${rack1PerTankL} لیتر شراب صاف`
              }
            ]
          })),
          'day11-bactiless-kms-lock',
          [27],
          `${bactilessRoseG} g Bactiless + ${rosePostFermKmsG} g KMS برای ${rosePostRackingL} L (گالن رُزه)`,
          [
            {
              batchId: roseBatchId,
              tankId: 'tank-rose',
              timestamp: timestampFa,
              stageTitle: 'روز ۱۱ - قفل کیتوزان ضدباکتری رُزه (Bactiless No-MLF Lock)',
              compoundName: 'کیتوزان قارچی (Bactiless)',
              compoundType: 'bactiless',
              referenceVolumeL: rosePostRackingL,
              sgAtAddition: currentSG,
              amount: bactilessRoseG,
              unit: 'g',
              purpose: `حذف باکتری‌های اسید لاکتیک و حفظ اسید مالیک رُزه در ${rosePostRackingL} لیتر`
            },
            {
              batchId: roseBatchId,
              tankId: 'tank-rose',
              timestamp: timestampFa,
              stageTitle: 'روز ۱۱ - تثبیت سولفیت پس از تخمیر رُزه',
              compoundName: 'پتاسیم متابی‌سولفیت (KMS)',
              pubchemCid: 24446,
              compoundType: 'kms',
              referenceVolumeL: rosePostRackingL,
              calculatedSO2MgL: 45,
              sgAtAddition: currentSG,
              amount: rosePostFermKmsG,
              unit: 'g',
              purpose: `تثبیت شراب رُزه خشک در ${rosePostRackingL} لیتر`
            }
          ],
          {
            doseValue: `${bactilessRoseG} + ${rosePostFermKmsG}`,
            doseUnit: 'g',
            compoundFa: 'باکتیلس + KMS',
            volumeContextFa: `برای ${rosePostRackingL} لیتر`
          }
        )
    },
    {
      id: 'day21-bactiless-racking',
      roadmapStepIds: [28],
      titleFa: 'سیفون جداسازی رسوب Bactiless (روز ۲۱ — پایان ۱۰ روز تماس)',
      whyFa: 'خارج کردن باکتری‌های لیزشده و فیبر کیتوزان ته‌نشین‌شده پس از ۱۰ روز تماس کامل.',
      howToExecuteFa: 'شراب زلال را بدون برهم زدن رسوب کف گالن به ظرف تمیز پرشده از گاز CO2 سیفون کرده و گلوگاه را کاملاً لب‌به‌لب (Top-up) کنید.',
      scienceNoteFa: 'تماس ۵ تا ۱۰ روزه با Bactiless برای حذف کامل باکتری‌های گرم‌مثبت کافی است.',
      confidenceLabelFa: 'محاسبهٔ استوکیومتری قطعی',
      triggerType: 'day',
      triggerDay: 21,
      windowCloseDay: 28,
      closedReasonFa: 'پنجرهٔ ۱۰ روزهٔ تماس باکتی‌لس به پایان رسیده است.',
      buildTankRows: () =>
        appendRoseTankRow(
          makeRedTanksRows('day21-bactiless-racking', [28], (_tId, labelFa) => ({
            doseValue: `${rack1PerTankL}`,
            doseUnit: 'L',
            compoundFa: 'سیفون جداسازی باکتیلس',
            volumeContextFa: `برای ${rack1PerTankL} لیتر`,
            doseAmountTextFa: `سیفون از روی رسوب باکتی‌لس (${labelFa})`,
            additionsToRecord: []
          })),
          'day21-bactiless-racking',
          [28],
          'سیفون از روی رسوب باکتیلس (گالن رُزه)',
          [],
          {
            doseValue: `${rosePostRackingL}`,
            doseUnit: 'L',
            compoundFa: 'سیفون جداسازی باکتیلس رُزه',
            volumeContextFa: `برای ${rosePostRackingL} لیتر`
          }
        )
    },
    {
      id: 'day65-cold-stab',
      roadmapStepIds: [37],
      titleFa: 'پایدارسازی سرد ۱۴ روزه (۰ تا +۲ درجه) و بذرپاشی کرم تارتار',
      whyFa: 'رسوب دادن پتاسیم و بی‌تارتارات مازاد در کارگاه تا در یخچال مصرف‌کننده کریستال شیشه‌ای ته بطری تشکیل نشود.',
      howToExecuteFa: `دمای شراب را به ۰ تا +۲ درجه برسانید و ${khtRedG} گرم بی‌تارتارات پتاسیم (KHT) به هر مخزن اضافه و هم بزنید.`,
      scienceNoteFa: `0.20 g/L KHT × ${finalRedPerTankL} L = ${khtRedG} g Contact Seeding`,
      confidenceLabelFa: 'محاسبهٔ استوکیومتری قطعی',
      triggerType: 'day',
      triggerDay: 65,
      windowCloseDay: 80,
      closedReasonFa: 'پنجرهٔ استاندارد پایدارسازی سرد روز ۶۵ گذشته است.',
      buildTankRows: () =>
        appendRoseTankRow(
          makeRedTanksRows('day65-cold-stab', [37], (tId, labelFa) => ({
            doseValue: `${khtRedG}`,
            doseUnit: 'g',
            compoundFa: 'بی‌تارتارات پتاسیم (KHT)',
            volumeContextFa: `برای ${finalRedPerTankL} لیتر`,
            doseAmountTextFa: `${khtRedG} g KHT برای ${finalRedPerTankL} L (${labelFa})`,
            additionsToRecord: [
              {
                batchId,
                tankId: tId,
                timestamp: timestampFa,
                stageTitle: 'روز ۶۵ - بذرپاشی کرم تارتار و پایدارسازی سرد',
                compoundName: 'بی‌تارتارات پتاسیم (KHT / کرم تارتار)',
                compoundType: 'kht',
                referenceVolumeL: finalRedPerTankL,
                sgAtAddition: currentSG,
                amount: khtRedG,
                unit: 'g',
                purpose: `نطفه‌گذاری کریستال تارتارات در دمای ۰ تا ۲ درجه (${finalRedPerTankL} لیتر)`
              }
            ]
          })),
          'day65-cold-stab',
          [37],
          `${khtColdStabRoseG} g KHT برای ${rosePostRackingL} L (گالن رُزه)`,
          [
            {
              batchId: roseBatchId,
              tankId: 'tank-rose',
              timestamp: timestampFa,
              stageTitle: 'روز ۶۵ - بذرپاشی کرم تارتار و پایدارسازی سرد رُزه',
              compoundName: 'بی‌تارتارات پتاسیم (KHT / کرم تارتار)',
              compoundType: 'kht',
              referenceVolumeL: rosePostRackingL,
              sgAtAddition: currentSG,
              amount: khtColdStabRoseG,
              unit: 'g',
              purpose: `نطفه‌گذاری کریستال تارتارات رُزه در ${rosePostRackingL} لیتر`
            }
          ],
          {
            doseValue: `${khtColdStabRoseG}`,
            doseUnit: 'g',
            compoundFa: 'بی‌تارتارات پتاسیم (KHT)',
            volumeContextFa: `برای ${rosePostRackingL} لیتر`
          }
        )
    },
    {
      id: 'day100-bottling',
      roadmapStepIds: [41, 42, 44, 45, 46],
      titleFa: 'تنظیم نهایی سولفیت، اسید اسکوربیک و بطری‌گذاری استریل (روز ۹۹–۱۰۰)',
      whyFa: 'قفل کردن اکسیژن محلول هنگام پر کردن بطری و تضمین پایداری آروماتیک بلندمدت.',
      howToExecuteFa: `در روز ۹۹ (۲۴ ساعت پیش از بطریگیری) ابتدا ${preBottlingKmsG} گرم KMS تزریق کنید تا سولفیت آزاد بالای ۳۵ mg/L تثبیت شود؛ سپس در روز ۱۰۰ (۳۰ دقیقه پیش از پر کردن بطری) ${ascorbicRedG} گرم اسید اسکوربیک اضافه نمایید.`,
      scienceNoteFa: `Ascorbic = 0.04 g/L (${ascorbicRedG} g) + Pre-bottling KMS = ${preBottlingKmsG} g`,
      confidenceLabelFa: 'محاسبهٔ استوکیومتری قطعی',
      triggerType: 'day',
      triggerDay: 99,
      windowCloseDay: 120,
      closedReasonFa: 'چرخهٔ ۱۰۰ روزه به پایان رسیده است.',
      buildTankRows: () =>
        appendRoseTankRow(
          makeRedTanksRows('day100-bottling', [41, 42, 44, 45, 46], (tId, labelFa) => ({
            doseValue: `${preBottlingKmsG} + ${ascorbicRedG}`,
            doseUnit: 'g',
            compoundFa: 'KMS + اسید اسکوربیک',
            volumeContextFa: `برای ${finalRedPerTankL} لیتر`,
            doseAmountTextFa: `${preBottlingKmsG} g KMS + ${ascorbicRedG} g اسکوربیک برای ${finalRedPerTankL} L (${labelFa})`,
            additionsToRecord: [
              {
                batchId,
                tankId: tId,
                timestamp: timestampFa,
                stageTitle: 'روز ۹۹ - تنظیم سولفیت پیش از بطری‌گذاری',
                compoundName: 'پتاسیم متابی‌سولفیت (KMS)',
                pubchemCid: 24446,
                compoundType: 'kms',
                referenceVolumeL: finalRedPerTankL,
                sgAtAddition: currentSG,
                amount: preBottlingKmsG,
                unit: 'g',
                purpose: `تنظیم نهایی Free SO2 پیش از بطری‌گذاری در ${finalRedPerTankL} لیتر`
              },
              {
                batchId,
                tankId: tId,
                timestamp: timestampFa,
                stageTitle: 'روز ۱۰۰ - آنتی‌اکسیدان اسید اسکوربیک پیش از بطری‌گذاری',
                compoundName: 'اسید اسکوربیک خوراکی (L-Ascorbic Acid)',
                compoundType: 'ascorbic',
                referenceVolumeL: finalRedPerTankL,
                sgAtAddition: currentSG,
                amount: ascorbicRedG,
                unit: 'g',
                purpose: `حذف فوری اکسیژن محلول هنگام بطری‌گذاری (${finalRedPerTankL} لیتر)`
              }
            ]
          })),
          'day100-bottling',
          [41, 42, 44, 45, 46],
          `${rosePreBottlingKmsG} g KMS + ${ascorbicRoseG} g اسکوربیک برای ${roseFinalBottlingL} L (گالن رُزه)`,
          [
            {
              batchId: roseBatchId,
              tankId: 'tank-rose',
              timestamp: timestampFa,
              stageTitle: 'روز ۹۹ - تنظیم سولفیت پیش از بطری‌گذاری رُزه',
              compoundName: 'پتاسیم متابی‌سولفیت (KMS)',
              pubchemCid: 24446,
              compoundType: 'kms',
              referenceVolumeL: roseFinalBottlingL,
              sgAtAddition: currentSG,
              amount: rosePreBottlingKmsG,
              unit: 'g',
              purpose: `تنظیم نهایی Free SO2 رُزه پیش از بطری‌گذاری در ${roseFinalBottlingL} لیتر`
            },
            {
              batchId: roseBatchId,
              tankId: 'tank-rose',
              timestamp: timestampFa,
              stageTitle: 'روز ۱۰۰ - آنتی‌اکسیدان اسید اسکوربیک پیش از بطری‌گذاری رُزه',
              compoundName: 'اسید اسکوربیک خوراکی (L-Ascorbic Acid)',
              compoundType: 'ascorbic',
              referenceVolumeL: roseFinalBottlingL,
              sgAtAddition: currentSG,
              amount: ascorbicRoseG,
              unit: 'g',
              purpose: `حذف فوری اکسیژن محلول رُزه هنگام بطری‌گذاری (${roseFinalBottlingL} لیتر)`
            }
          ],
          {
            doseValue: `${rosePreBottlingKmsG} + ${ascorbicRoseG}`,
            doseUnit: 'g',
            compoundFa: 'KMS + اسید اسکوربیک',
            volumeContextFa: `برای ${roseFinalBottlingL} لیتر`
          }
        )
    }
  ];
  const redOnlyMilestoneIds = new Set([
    'crush-kms',
    'saignee-rose',
    'phase2-tannin',
    'pressing'
  ]);
  const effectiveBlueprints =
    activeTankId === 'tank-rose'
      ? blueprints.filter((bp) => !redOnlyMilestoneIds.has(bp.id))
      : blueprints;
  const allMilestones: RightNowMilestone[] = effectiveBlueprints.map((bp) => {
    const tankRows = bp.buildTankRows();
    const activeRow =
      tankRows.find((r) => r.tankId === activeTankId) ?? tankRows[0];
    const isCompleted = activeRow ? activeRow.isCompletedForTank : false;
    const skippedReasonFa = skippedMap[bp.id];
    const snoozedUntilMs = snoozedMap[bp.id];
    let state: MilestoneState = 'pending';
    let estimatedHoursUntilDue: { min: number; max: number } | undefined;
    if (skippedReasonFa) {
      state = 'skipped';
    } else if (isCompleted) {
      state = 'completed';
    } else if (bp.triggerType === 'sg' && bp.triggerSG !== undefined) {
      const closeSG = bp.windowCloseSG;
      const isClosed =
        closeSG !== undefined && currentSG < closeSG;
      if (isClosed) {
        state = 'closed';
      } else if (bp.id === 'crush-kms') {
        if (currentDay === 0 && currentSG >= bp.triggerSG - 0.004) {
          state = 'due';
        } else {
          state = 'missed';
        }
      } else if (
        currentSG <= bp.triggerSG + 0.002 &&
        currentSG >= bp.triggerSG - 0.003
      ) {
        state = 'due';
      } else if (currentSG < bp.triggerSG - 0.003) {
        state = 'missed';
      } else {
        state = 'pending';
        const deltaSG = Math.max(0, currentSG - bp.triggerSG);
        const baseHours = (deltaSG / velocityPerDay) * 24 + lagBufferHours;
        const min = Math.max(1, Math.round(baseHours * 0.8));
        const max = Math.max(min + 1, Math.round(baseHours * 1.25));
        estimatedHoursUntilDue = { min, max };
      }
    } else if (bp.triggerType === 'day') {
      if (bp.triggerDay === 0) {
        if (bp.windowCloseSG !== undefined && currentSG <= bp.windowCloseSG) {
          state = 'closed';
        } else if (currentDay === 0) {
          state = 'due';
        } else {
          state = 'missed';
        }
      } else {
        const reqDay = bp.triggerDay ?? 0;
        if (
          bp.triggerSG !== undefined &&
          currentSG > bp.triggerSG + 0.003 &&
          currentDay < reqDay
        ) {
          state = 'pending';
          const deltaSG = Math.max(0, currentSG - bp.triggerSG);
          const baseHours = (deltaSG / velocityPerDay) * 24 + lagBufferHours;
          const min = Math.max(1, Math.round(baseHours * 0.8));
          const max = Math.max(min + 1, Math.round(baseHours * 1.25));
          estimatedHoursUntilDue = { min, max };
        } else if (bp.windowCloseDay !== undefined && currentDay > bp.windowCloseDay) {
          state = 'closed';
        } else if (currentDay > reqDay + 2) {
          state = 'missed';
        } else if (currentDay >= reqDay || (bp.triggerSG !== undefined && currentSG <= bp.triggerSG)) {
          state = 'due';
        } else {
          state = 'pending';
          const deltaDays = Math.max(1, reqDay - currentDay);
          const baseHours = deltaDays * 24;
          estimatedHoursUntilDue = {
            min: Math.round(baseHours * 0.8),
            max: Math.round(baseHours * 1.25)
          };
        }
      }
    }
    const canMarkDone =
      state === 'due' || state === 'missed' || state === 'pending';
    return {
      id: bp.id,
      roadmapStepIds: bp.roadmapStepIds,
      titleFa: bp.titleFa,
      whyFa: bp.whyFa,
      howToExecuteFa: bp.howToExecuteFa,
      scienceNoteFa: bp.scienceNoteFa,
      confidenceLabelFa: bp.confidenceLabelFa,
      triggerType: bp.triggerType,
      triggerSG: bp.triggerSG,
      windowCloseSG: bp.windowCloseSG,
      triggerDay: bp.triggerDay,
      windowCloseDay: bp.windowCloseDay,
      state,
      stateBadgeFa: getStateBadgeFa(state),
      closedReasonFa: state === 'closed' ? bp.closedReasonFa : undefined,
      canMarkDone: state !== 'closed' && state !== 'completed' && state !== 'skipped' && canMarkDone,
      estimatedHoursUntilDue,
      skippedReasonFa,
      snoozedUntilMs,
      tankRows
    };
  });
  const nonSnoozedActionable = allMilestones.filter(
    (m) =>
      (m.state === 'due' || m.state === 'missed') &&
      !(m.snoozedUntilMs !== undefined && m.snoozedUntilMs > nowMs)
  );
  const missedActionable = nonSnoozedActionable.filter((m) => m.state === 'missed');
  const dueActionable = nonSnoozedActionable.filter((m) => m.state === 'due');
  const primaryAction =
    missedActionable.find((m) => m.id === 'sna-2-dap') ??
    missedActionable[0] ??
    dueActionable.find((m) => m.id === 'sna-2-dap') ??
    dueActionable[0] ??
    null;
  const overdueActions = allMilestones.filter((m) => m.state === 'missed');
  const closedActions = allMilestones.filter((m) => m.state === 'closed');
  const upcomingActions = allMilestones
    .filter((m) => m.state === 'pending')
    .slice(0, 2);
  return {
    sgAnomaly,
    primaryAction,
    overdueActions,
    closedActions,
    upcomingActions,
    allMilestones
  };
}
export function evaluateDeadlineCountdowns(options: {
  logs: FermentationLogEntry[];
  additions: ChemicalAddition[];
  labAnalyses?: LabAnalysisRecord[];
  tankId?: TankId;
  plan?: DynamicProtocolPlan;
  batch?: WineBatch;
  batchId?: string;
  excludeDemo?: boolean;
}): DeadlineCountdownItem[] {
  const tankId: TankId = options.tankId ?? 'tank-a';
  const isRose = tankId === 'tank-rose';
  const plan = getEffectiveProtocolPlanForBatch(options.batch, options.plan);
  const dynTriggers = calculateDynamicSGTriggers(plan.triggers.initialSG, {
    pressingPoint: plan.triggers.pressingSG,
    drynessPoint: isRose ? 0.991 : plan.triggers.drynessSG
  });
  const activeBatchId = options.batchId ?? options.batch?.id ?? 'batch-rasha-1403';
  const hasExplicitBatchFilter = Boolean(options.batchId || options.batch?.id);
  const rejectOrphanRecords = Boolean(
    hasExplicitBatchFilter && options.excludeDemo === true
  );
  const hasRealUserData = Boolean(
    options.excludeDemo ||
      options.batch?.isDemo === false ||
      options.logs.some(
        (l) =>
          !l.isDeleted &&
          !l.isBenchmark &&
          !l.isDemo &&
          (!l.batchId ? !rejectOrphanRecords : l.batchId === activeBatchId)
      ) ||
      options.additions.some(
        (a) =>
          !a.isDeleted &&
          !a.isDemo &&
          (!a.batchId ? !rejectOrphanRecords : a.batchId === activeBatchId)
      )
  );
  const isRecordMatchingActiveBatch = (recordBatchId?: string, recordTankId?: TankId): boolean => {
    if (!hasExplicitBatchFilter) return true;
    if (!recordBatchId) {
      return !rejectOrphanRecords;
    }
    if (recordBatchId === activeBatchId) return true;
    if (
      !hasRealUserData &&
      activeBatchId === 'batch-rasha-1403' &&
      recordTankId === 'tank-rose' &&
      recordBatchId === 'batch-rose-1403'
    ) {
      return true;
    }
    return false;
  };
  const tankLogsAll = options.logs.filter((l) => {
    if (l.isDeleted || l.tankId !== tankId) return false;
    if (!isRecordMatchingActiveBatch(l.batchId, l.tankId)) {
      return false;
    }
    if (hasRealUserData && (l.isDemo === true || l.isBenchmark === true)) {
      return false;
    }
    return true;
  });
  const realTankLogs = tankLogsAll.filter((l) => !l.isBenchmark);
  const sortedLogs = sortFermentationLogs(
    realTankLogs.length > 0 ? realTankLogs : tankLogsAll
  );
  const latestLog = sortedLogs[sortedLogs.length - 1];
  const currentSG = latestLog ? latestLog.sg : dynTriggers.initialSG;
  const currentDay = latestLog ? latestLog.dayNumber : 0;
  const currentPH = latestLog ? latestLog.ph : 3.52;
  const tankAdditions = options.additions.filter((a) => {
    if (a.isDeleted || a.tankId !== tankId) return false;
    if (!isRecordMatchingActiveBatch(a.batchId, a.tankId)) {
      return false;
    }
    if (hasRealUserData && a.isDemo === true) {
      return false;
    }
    return true;
  });
  const items: DeadlineCountdownItem[] = [];
  const sna2Done = isMilestoneCompletedByAdditions(
    'sna-2-dap',
    tankAdditions,
    [],
    [17]
  );
  if (!sna2Done && currentSG > 1.010) {
    const oneThirdCeiling = dynTriggers.oneThirdCeiling;
    if (currentSG < oneThirdCeiling) {
      items.push({
        id: 'dap_window',
        titleFa: 'پنجرهٔ قانونی تغذیه DAP (سقف ۱/۳ مصرف قند)',
        rangeTextFa: 'پنجره بسته شد',
        color: 'gray',
        urgencyLevel: 'closed',
        explanationFa: `چگالی به ${currentSG.toFixed(3)} رسیده و از مرز ${oneThirdCeiling.toFixed(3)} عبور کرده است؛ افزودن DAP یا Fermaid K در الکل بالای ۶٪ ممنوع است (صرفاً Fermaid O مجاز است).`
      });
    } else {
      const velInfo = calculateRecentLogVelocity(
        sortedLogs,
        dynTriggers.initialSG
      );
      const vel =
        velInfo.hasObservedVelocity && velInfo.recentVelocityPerDay > 0.001
          ? velInfo.recentVelocityPerDay
          : 0.015;
      const lagBufferHours =
        currentDay <= 1 && !velInfo.hasObservedVelocity ? 24 : 0;
      const baseHours = ((currentSG - oneThirdCeiling) / vel) * 24 + lagBufferHours;
      const minH = Math.max(1, Math.round(baseHours * 0.8));
      const maxH = Math.max(minH + 1, Math.round(baseHours * 1.25));
      const color: DeadlineCountdownItem['color'] =
        baseHours > 24 ? 'emerald' : baseHours >= 6 ? 'amber' : 'rose';
      const urgencyLevel: DeadlineCountdownItem['urgencyLevel'] =
        baseHours > 24 ? 'safe' : baseHours >= 6 ? 'warning' : 'critical';
      items.push({
        id: 'dap_window',
        titleFa: 'مهلت باقی‌مانده تا بسته شدن پنجرهٔ DAP (SG 1.062)',
        rangeTextFa: `حدود ${minH} تا ${maxH} ساعت تا بسته شدن پنجرهٔ DAP`,
        color,
        urgencyLevel,
        explanationFa: `بر اساس سرعت افت چگالی فعلی (${vel.toFixed(3)} SG/day)، پنجرهٔ مجاز نیتروژن معدنی در SG = ${oneThirdCeiling.toFixed(3)} بسته می‌شود.`
      });
    }
  }
  const bactilessAdd = tankAdditions.find(
    (a) =>
      a.compoundType === 'bactiless' ||
      /bactiless|ب[ا]?کتی[‌]?لس/i.test(`${a.stageTitle} ${a.purpose} ${a.compoundName}`)
  );
  const racking21Done = isMilestoneCompletedByAdditions(
    'day21-bactiless-racking',
    tankAdditions,
    [],
    [28]
  );
  if (bactilessAdd && !racking21Done) {
    let elapsedDays = 0;
    if (bactilessAdd.dayNumber !== undefined) {
      elapsedDays = Math.max(0, currentDay - bactilessAdd.dayNumber);
    } else if (
      bactilessAdd.timestampMs !== undefined &&
      latestLog?.timestampMs !== undefined &&
      latestLog.timestampMs >= bactilessAdd.timestampMs
    ) {
      elapsedDays = Math.max(
        0,
        Math.round((latestLog.timestampMs - bactilessAdd.timestampMs) / (1000 * 60 * 60 * 24))
      );
    } else {
      const addDayMatch = bactilessAdd.stageTitle.match(/روز\s*([۰-۹0-9]+)/);
      let addDay = 11;
      if (addDayMatch) {
        const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
        const ascii = addDayMatch[1].replace(/[۰-۹]/g, (d) => String(persianDigits.indexOf(d)));
        const parsed = Number.parseInt(ascii, 10);
        if (!Number.isNaN(parsed)) addDay = parsed;
      } else if (/یازدهم/.test(bactilessAdd.stageTitle)) {
        addDay = 11;
      } else if (/دوازدهم/.test(bactilessAdd.stageTitle)) {
        addDay = 12;
      } else if (/دهم/.test(bactilessAdd.stageTitle)) {
        addDay = 10;
      }
      elapsedDays = Math.max(0, currentDay - addDay);
    }
    const color: DeadlineCountdownItem['color'] =
      elapsedDays > 10 ? 'rose' : elapsedDays >= 5 ? 'amber' : 'emerald';
    const urgencyLevel: DeadlineCountdownItem['urgencyLevel'] =
      elapsedDays > 10 ? 'critical' : elapsedDays >= 5 ? 'warning' : 'safe';
    items.push({
      id: 'bactiless_contact',
      titleFa: 'پنجرهٔ تماس کیتوزان (Bactiless) تا سیفون',
      rangeTextFa: `روز ${elapsedDays} از ۱۰ تماس؛ سیفون از ۵ تا ۱۰ روز پس از افزودن`,
      color,
      urgencyLevel,
      explanationFa:
        'کیتوزان قارچی پس از ۵ تا ۱۰ روز دیواره سلولی باکتری‌ها را کامل لیز کرده و باید پیش از ایجاد طعم گس از شراب سیفون شود.'
    });
  }
  if (latestLog && latestLog.sg <= 0.995) {
    const targetSO2 = getContinuousTargetFreeSO2ByPH(currentPH, isRose);
    const hasPostFermKms = tankAdditions.some(
      (a) =>
        (a.compoundType === 'kms' || a.pubchemCid === 24446 || a.compoundName.includes('KMS')) &&
        ((a.sgAtAddition !== undefined && a.sgAtAddition <= 1.000) ||
          a.stageTitle.includes('روز ۱۱') ||
          a.stageTitle.includes('پس از تخمیر') ||
          a.stageTitle.includes('بطری'))
    );
    const hasAdequateFreeSO2 =
      latestLog.freeSO2 !== undefined && latestLog.freeSO2 >= targetSO2.min;
    if (!hasPostFermKms && !hasAdequateFreeSO2) {
      items.push({
        id: 'post_dryness_so2',
        titleFa: 'هشدار فوری: شراب خشک بدون سپر محافظ سولفیت (Free SO₂)',
        rangeTextFa: 'اقدام فوری — حفاظت سولفیتی صفر پس از توقف CO₂',
        color: 'rose',
        urgencyLevel: 'critical',
        explanationFa: `تخمیر به خشکی رسیده است (SG = ${latestLog.sg.toFixed(3)}) و دیگر لایه محافظ گاز CO2 تولید نمی‌شود. برای pH = ${currentPH.toFixed(2)} حداقل ${targetSO2.min} mg/L سولفیت آزاد (هدف: ${targetSO2.target} mg/L) الزامی است.`
      });
    }
  }
  return items;
}
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
}): BottlingReadinessResult {
  const tankId: TankId = options.tankId ?? 'tank-a';
  const isRose = tankId === 'tank-rose';
  const nowMs = options.nowMs ?? Date.now();
  const confirmations = options.manualConfirmations ?? {};
  const activeBatchId = options.batchId ?? options.batch?.id;
  const hasExplicitBatchFilter = Boolean(activeBatchId);
  const rejectOrphanRecords = Boolean(
    hasExplicitBatchFilter && options.excludeDemo === true
  );
  const matchesBatch = (recordBatchId?: string): boolean => {
    if (!hasExplicitBatchFilter) return true;
    if (!recordBatchId) return !rejectOrphanRecords;
    return recordBatchId === activeBatchId;
  };
  const tankLogsAll = options.logs.filter((l) => !l.isDeleted && l.tankId === tankId);
  const realLogs = tankLogsAll.filter(
    (l) => !l.isBenchmark && !l.isDemo && matchesBatch(l.batchId)
  );
  const sortedLogs = sortFermentationLogs(realLogs);
  const tankAdditions = options.additions.filter(
    (a) => !a.isDeleted && !a.isDemo && a.tankId === tankId && matchesBatch(a.batchId)
  );
  const tankAnalyses = options.labAnalyses.filter(
    (a) => !a.isDeleted && !a.isDemo && a.tankId === tankId && matchesBatch(a.batchId)
  );
  const lastThreeLogs = sortedLogs.slice(-3);
  const hasThreeDryLogs =
    lastThreeLogs.length >= 3 && lastThreeLogs.every((l) => l.sg <= 0.995);
  let daySpan = 0;
  let sgSpread = 1;
  if (lastThreeLogs.length >= 3) {
    daySpan = lastThreeLogs[2].dayNumber - lastThreeLogs[0].dayNumber;
    const sgs = lastThreeLogs.map((l) => l.sg);
    sgSpread = Math.max(...sgs) - Math.min(...sgs);
  }
  const rsLabRecords = tankAnalyses.filter((a) =>
    /clinitest|قند باقی|residual sugar|\brs\b/i.test(`${a.targetAnalyte} ${a.notes ?? ''}`)
  );
  const hasExplicitHighRsFailure = rsLabRecords.some(
    (a) => typeof a.measuredValue === 'number' && a.measuredValue >= 2.0
  );
  const hasRsConfirmed =
    !hasExplicitHighRsFailure &&
    (Boolean(confirmations.clinitestPassed || confirmations.rsConfirmed) ||
      rsLabRecords.some(
        (a) => typeof a.measuredValue === 'number' && a.measuredValue < 2.0
      ));
  const drynessSgStable = hasThreeDryLogs && daySpan >= 7 && sgSpread <= 0.0015;
  const drynessDataStatus: BottlingGateCheckItem['dataStatus'] =
    !drynessSgStable || hasExplicitHighRsFailure
      ? 'failed'
      : hasRsConfirmed
      ? 'verified'
      : 'incomplete_data';
  const drynessPassed =
    drynessSgStable &&
    !hasExplicitHighRsFailure &&
    (!options.requireRsLabConfirmation || hasRsConfirmed);
  const latestLog = sortedLogs[sortedLogs.length - 1];
  const currentPH = latestLog ? latestLog.ph : 3.52;
  const contSO2Target = getContinuousTargetFreeSO2ByPH(currentPH, isRose);
  const so2UpperCeiling = contSO2Target.max;
  const ripperRecords = [...tankAnalyses]
    .filter((a) => a.testType === 'ripper_so2' && typeof a.measuredValue === 'number')
    .sort((a, b) => {
      if (
        a.timestampMs !== undefined &&
        b.timestampMs !== undefined &&
        a.timestampMs !== b.timestampMs
      ) {
        return b.timestampMs - a.timestampMs;
      }
      if (
        a.dayNumber !== undefined &&
        b.dayNumber !== undefined &&
        a.dayNumber !== b.dayNumber
      ) {
        return b.dayNumber - a.dayNumber;
      }
      return (b.timestampMs ?? 0) - (a.timestampMs ?? 0);
    });
  const latestRipper = ripperRecords[0];
  const hasMeasuredLogSo2 =
    latestLog?.freeSO2 !== undefined && latestLog.freeSO2Measured !== false;
  const useLogSo2InsteadOfRipper =
    hasMeasuredLogSo2 &&
    (!latestRipper ||
      ((latestLog.timestampMs ?? -1) > (latestRipper.timestampMs ?? -1) &&
        latestLog.timestampMs !== undefined));
  const measuredFreeSO2 = useLogSo2InsteadOfRipper
    ? latestLog?.freeSO2
    : typeof latestRipper?.measuredValue === 'number'
    ? latestRipper.measuredValue
    : hasMeasuredLogSo2
    ? latestLog?.freeSO2
    : undefined;
  const so2TimestampMs = useLogSo2InsteadOfRipper
    ? latestLog?.timestampMs
    : latestRipper
    ? latestRipper.timestampMs
    : hasMeasuredLogSo2
    ? latestLog?.timestampMs
    : undefined;
  const so2DayNumber = useLogSo2InsteadOfRipper
    ? latestLog?.dayNumber
    : latestRipper
    ? latestRipper.dayNumber
    : hasMeasuredLogSo2
    ? latestLog?.dayNumber
    : undefined;
  const todayFa = formatNowFa().split(' ')[0];
  const so2DateStr = useLogSo2InsteadOfRipper
    ? latestLog?.dateTime ?? ''
    : latestRipper
    ? latestRipper.date
    : hasMeasuredLogSo2
    ? latestLog?.dateTime ?? ''
    : '';
  const matchesTodayDate = Boolean(todayFa && so2DateStr.includes(todayFa));
  const so2AgeHours =
    so2TimestampMs !== undefined
      ? Math.max(0, (nowMs - so2TimestampMs) / (1000 * 60 * 60))
      : so2DayNumber !== undefined &&
        latestLog?.dayNumber !== undefined &&
        so2DayNumber >= latestLog.dayNumber - 2 &&
        matchesTodayDate
      ? Math.max(0, (latestLog.dayNumber - so2DayNumber) * 24)
      : Number.POSITIVE_INFINITY;
  const isOverSo2Ceiling =
    measuredFreeSO2 !== undefined && measuredFreeSO2 > so2UpperCeiling;
  const isBelowSo2Min =
    measuredFreeSO2 === undefined || measuredFreeSO2 < contSO2Target.min;
  const so2Passed =
    measuredFreeSO2 !== undefined &&
    !isBelowSo2Min &&
    !isOverSo2Ceiling &&
    so2AgeHours <= 48;
  const hasPhLabRecord = tankAnalyses.some((a) => a.testType === 'ph_meter');
  const isPhMeasured =
    (latestLog !== undefined && latestLog.phMeasured !== false) || hasPhLabRecord;
  const so2DataStatus: BottlingGateCheckItem['dataStatus'] = !so2Passed
    ? 'failed'
    : isPhMeasured
    ? 'verified'
    : 'incomplete_data';
  const unmeasuredPhNoteFa = !isPhMeasured
    ? ' (توجه: pH فعلی تخمینی/انتقالی است و مستقیماً اندازه‌گیری نشده است)'
    : '';
  const hasBactilessLock = tankAdditions.some(
    (a) =>
      a.compoundType === 'bactiless' ||
      /bactiless|ب[ا]?کتی[‌]?لس/i.test(`${a.stageTitle} ${a.purpose} ${a.compoundName}`)
  );
  const hasChromatographyDepleted = tankAnalyses.some(
    (a) =>
      a.testType === 'mlf_chromatography' &&
      (a.malicResult === 'depleted' || String(a.measuredValue).includes('depleted'))
  );
  const hasEndOfProcessMalicVerification =
    hasChromatographyDepleted ||
    Boolean(confirmations.malicRiskAccepted) ||
    (hasBactilessLock && so2Passed && currentPH <= 3.60);
  const isHarvestLowMalicOnly =
    !hasEndOfProcessMalicVerification && options.batch?.malicStatus === 'low';
  const malicPassed = hasEndOfProcessMalicVerification;
  const isConditionalBactilessMalicPass =
    malicPassed &&
    hasBactilessLock &&
    !hasChromatographyDepleted &&
    !confirmations.malicRiskAccepted;
  const malicDataStatus: BottlingGateCheckItem['dataStatus'] = malicPassed
    ? 'verified'
    : isHarvestLowMalicOnly
    ? 'incomplete_data'
    : 'failed';
  const clarityPassed = Boolean(confirmations.clarityConfirmed);
  const blockingItems: BottlingGateCheckItem[] = [
    {
      id: 'dryness_stability',
      titleFa:
        '۱. خشکی کامل، ثبات چگالی (SG ≤ 0.995 در ۳ ثبت متوالی طی حداقل ۷ روز) و قند باقی‌مانده (Clinitest / RS < 2 g/L)',
      isBlocking: true,
      status: drynessPassed ? 'passed' : 'blocked_red',
      dataStatus: drynessDataStatus,
      detailFa: drynessPassed
        ? `تایید شد: ۳ ثبت متوالی در بازهٔ ${daySpan} روز روی SG ≤ 0.995 ثابت مانده است${
            hasRsConfirmed
              ? ' و تست قند باقی‌مانده آزمایشگاهی (Clinitest / RS < 2 g/L) نیز تایید شد.'
              : ' (وضعیت داده: incomplete_data — ثبات SG تایید شد اما تست شیمیایی Clinitest / RS < 2 g/L هنوز ثبت نشده است).'
          }`
        : hasExplicitHighRsFailure
        ? 'مسدود: نتیجه آزمایش قند باقی‌مانده (Clinitest / RS ≥ 2.0 g/L) نشان‌دهنده وجود قند تخمیرنشده است (خطر ترکیدن بطری).'
        : !drynessSgStable
        ? `مسدود: نیازمند حداقل ۳ ثبت متوالی SG ≤ 0.995 در بازهٔ حداقل ۷ روز و قند باقی‌مانده RS < 2 g/L با تست Clinitest (فعلی: ${lastThreeLogs.length} ثبت، بازهٔ ${daySpan} روز).`
        : 'مسدود: ثبات چگالی SG احراز شده اما تایید آزمایشگاهی قند باقی‌مانده (Clinitest / RS < 2 g/L) الزامی است.',
      whyFa: 'بطری کردن شراب با قند تخمیرنشده باعث تخمیر مجدد در بطری، پریدن چوب‌پنبه و ترکیدن شیشه می‌شود.'
    },
    {
      id: 'free_so2_target',
      titleFa: `۲. سولفیت آزاد کافی متناسب با pH (${contSO2Target.min}–${contSO2Target.max} mg/L در ۴۸ ساعت اخیر)`,
      isBlocking: true,
      status: so2Passed ? 'passed' : 'blocked_red',
      dataStatus: so2DataStatus,
      detailFa: so2Passed
        ? `تایید شد: سولفیت آزاد فعلی (${measuredFreeSO2} mg/L) در محدودهٔ هدف pH = ${currentPH.toFixed(2)} قرار دارد.${unmeasuredPhNoteFa}`
        : isOverSo2Ceiling
        ? `مسدود: سولفیت آزاد فعلی (${measuredFreeSO2} mg/L > سقف ${so2UpperCeiling} mg/L)؛ سولفیت آزاد بیش از سقف هدف است (خطر رنگپریدگی و بوی تند گوگرد).${unmeasuredPhNoteFa}`
        : `مسدود: سولفیت آزاد فعلی (${measuredFreeSO2 ?? 'ثبت‌نشده'} mg/L) کمتر از حداقل مجاز ${contSO2Target.min} mg/L برای pH = ${currentPH.toFixed(2)} است یا بیش از ۴۸ ساعت از سنجش گذشته است.${unmeasuredPhNoteFa}`,
      whyFa: 'سولفیت مولکولی زیر ۰.۶ mg/L نمی‌تواند شراب داخل بطری را محافظت کند و اوردوز بالای سقف مجاز باعث رنگ‌پریدگی و بوی تند گوگرد می‌شود.'
    },
    {
      id: 'malic_mlf_stability',
      titleFa: '۳. پایداری اسید مالیک (قفل Bactiless، کروماتوگرافی کاغذی یا پذیرش ریسک)',
      isBlocking: true,
      status: malicPassed ? 'passed' : 'blocked_red',
      dataStatus: malicDataStatus,
      detailFa: malicPassed
        ? isConditionalBactilessMalicPass
          ? 'تایید مشروط (پروتکل No-MLF): قفل کیتوزان (Bactiless) به همراه سپر سولفیت آزاد کافی ثبت شده است (توجه: کیتوزان بار باکتریایی را کاهش میدهد اما اسید مالیک را حذف نمیکند؛ حفظ دائمی Free SO2 الزامی است).'
          : 'تایید شد: پایداری میکروبی مالولاکتیک در پایان فرآیند احراز گردیده است.'
        : isHarvestLowMalicOnly
        ? 'مسدود (داده ناقص — incomplete_data): اسید مالیک صرفاً در برداشت اولیه کم برآورد شده (malicStatus = low) و تایید پایانی ندارد؛ انجام تست کروماتوگرافی کاغذی، قفل Bactiless به همراه Free SO2 کافی یا تایید دستی پذیرش ریسک پیش از بطری‌گذاری الزامی است.'
        : 'مسدود: وضعیت اسید مالیک مشخص نیست؛ قفل Bactiless روز ۱۱ (همراه با Free SO2 کافی و pH ≤ 3.60)، تست کروماتوگرافی یا تایید دستی الزامی است.',
      whyFa: 'شروع ناخواستهٔ تخمیر مالولاکتیک داخل بطری باعث کدورت، گازدار شدن و بوی کرهٔ فاسد می‌گردد.'
    },
    {
      id: 'visual_clarity_degas',
      titleFa: '۴. شفافیت نوری با چراغ‌قوه و نبود حباب گاز CO₂',
      isBlocking: true,
      status: clarityPassed ? 'passed' : 'blocked_red',
      dataStatus: clarityPassed ? 'verified' : 'failed',
      detailFa: clarityPassed
        ? 'تایید شد: شفافیت بصری و گاززدایی کامل توسط اپراتور تایید شد.'
        : 'مسدود: لطفاً شفافیت شراب را با نور چراغ‌قوه در لیوان بررسی و تیک تایید را فعال کنید.',
      whyFa: 'پروتئین یا پکتین معلق پس از بطری‌گذاری ته‌نشین شده و لجن ناخوشایند در کف بطری ایجاد می‌کند.'
    }
  ];
  const hasKhtAdd = tankAdditions.some((a) => a.compoundType === 'kht');
  const coldStabDone = hasKhtAdd || Boolean(confirmations.coldStabConfirmedOrSkipped);
  const warmTestDone = Boolean(confirmations.warmTestPassed);
  const ascorbicSafe = (measuredFreeSO2 ?? 0) >= 30;
  const sanitationDone = Boolean(confirmations.sanitationConfirmed);
  const advisoryItems: BottlingGateCheckItem[] = [
    {
      id: 'cold_stabilization',
      titleFa: '۵. پایدارسازی سرد ۱۴ روزه (۰ تا +۲ درجه با کرم تارتار)',
      isBlocking: false,
      status: coldStabDone ? 'passed' : 'advisory_amber',
      detailFa: coldStabDone
        ? 'پایدارسازی سرد یا معافیت آن ثبت شده است.'
        : 'توصیه‌شده: در صورت عدم سرمازدایی، ممکن است در یخچال کریستال بی‌خطر تارتارات رسوب کند.',
      whyFa: 'جلوگیری از تشکیل الماس‌های شراب (کریستال بی‌تارتارات پتاسیم) در دمای یخچال.'
    },
    {
      id: 'warm_bottle_test',
      titleFa: '۶. تست بطری شاهد ۴۸ ساعته در دمای ۲۵ درجه',
      isBlocking: false,
      status: warmTestDone ? 'passed' : 'advisory_amber',
      detailFa: warmTestDone
        ? 'تست پایداری حرارتی ۴۸ ساعته بدون کدورت یا حباب تایید شد.'
        : 'توصیه‌شده: یک نمونه را ۴۸ ساعت در دمای اتاق نگه دارید تا از عدم تشکیل حباب اطمینان حاصل شود.',
      whyFa: 'شبیه‌سازی شرایط نگهداری بطری برای کشف زودهنگام هرگونه فعالیت مخمری یا پروتئینی.'
    },
    {
      id: 'ascorbic_so2_lock',
      titleFa: '۷. قفل ایمنی اسید اسکوربیک (Free SO₂ ≥ 30 mg/L پیش از تزریق ویتامین C)',
      isBlocking: false,
      status: ascorbicSafe ? 'passed' : 'advisory_amber',
      detailFa: ascorbicSafe
        ? `ایمن: سولفیت آزاد (${measuredFreeSO2} mg/L ≥ 30 mg/L) برای افزودن اسید اسکوربیک کافی است.`
        : 'هشدار: تا زمانی که سولفیت آزاد زیر ۳۰ mg/L است، اسید اسکوربیک اضافه نکنید (خطر تولید H2O2).',
      whyFa: 'اسید اسکوربیک در غیاب سولفیت آزاد کافی، اکسیژن را به آب‌اکسیژنه تبدیل کرده و شراب را اکسید می‌کند.'
    },
    {
      id: 'bottle_cork_sanitation',
      titleFa: '۸. ضدعفونی بطری‌ها و چوب‌پنبه‌ها با محلول سولفیت اسیدی و پرج CO₂',
      isBlocking: false,
      status: sanitationDone ? 'passed' : 'advisory_amber',
      detailFa: sanitationDone
        ? 'ضدعفونی خط بطری‌گذاری و چوب‌پنبه‌ها تایید شد.'
        : 'توصیه‌شده: پیش از شروع پر کردن، بطری‌ها را با محلول استوک شماره ۳ آبکشی و خشک نمایید.',
      whyFa: 'جلوگیری از آلودگی کپکی (TCA) و اکسیداسیون گلوگاه بطری.'
    }
  ];
  const allBlockingPassed = blockingItems.every((item) => item.status === 'passed');
  const failedBlockerIds = blockingItems
    .filter((item) => item.status !== 'passed')
    .map((item) => item.id);
  const trimmedReason = options.riskOverrideReason?.trim() ?? '';
  const hasOverride = trimmedReason.length > 0;
  const overriddenBlockerIds = !allBlockingPassed && hasOverride ? failedBlockerIds : [];
  const executionMode: BottlingReadinessResult['executionMode'] = allBlockingPassed
    ? 'safe_ready'
    : hasOverride
    ? 'override_with_risk'
    : 'blocked';
  const overrideWarningFa =
    executionMode === 'override_with_risk'
      ? `هشدار مسئولیت اپراتور: بطری‌گذاری با وجود ${overriddenBlockerIds.length} مانع قرمز (${overriddenBlockerIds.join(', ')}) به صورت استثنا باز شد. دلیل ثبت‌شده: ${trimmedReason}`
      : undefined;
  const overrideAudit =
    executionMode === 'override_with_risk'
      ? {
          overriddenAtMs: nowMs,
          reason: trimmedReason,
          overriddenBlockerIds,
          tankId,
          batchId: activeBatchId
        }
      : undefined;
  return {
    blockingItems,
    advisoryItems,
    allBlockingPassed,
    canStartBottling: allBlockingPassed || hasOverride,
    executionMode,
    overriddenBlockerIds,
    overrideWarningFa,
    riskOverrideReason: options.riskOverrideReason,
    overrideAudit,
    so2AgeHours
  };
}
```

### `src/db/enologyDatabase.ts` (1417 compact lines)
```ts
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
const DB_STORAGE_KEY_BATCHES = 'enology_db_batches_v1';
const DB_STORAGE_KEY_LOGS = 'enology_db_logs_v1';
const DB_STORAGE_KEY_ADDITIONS = 'enology_db_additions_v1';
const DB_STORAGE_KEY_ANALYSES = 'enology_db_lab_analyses_v1';
const DB_STORAGE_KEY_CALCS = 'enology_db_saved_calculations_v1';
const DB_STORAGE_KEY_BACKUP_META = 'enology_last_backup_meta_v1';
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
function mirrorToIndexedDB(storeKey: string, data: unknown): void {
  if (typeof indexedDB === 'undefined') return;
  try {
    const req = indexedDB.open('enology_studio_idb_v1', 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains('kv_mirror')) {
        db.createObjectStore('kv_mirror');
      }
    };
    req.onsuccess = () => {
      try {
        const db = req.result;
        const tx = db.transaction('kv_mirror', 'readwrite');
        tx.objectStore('kv_mirror').put(data, storeKey);
      } catch {
      }
    };
  } catch {
  }
}
function generateId(prefix: string): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
export const DEFAULT_BATCHES: WineBatch[] = [
  {
    id: 'batch-rasha-1403',
    name: 'بچ شماره ۱: انگور رشه سردشت (۴۰۰ کیلوگرم استاندارد)',
    grapeVariety: 'انگور سیاه رشه دیم سردشت (Vitis vinifera cv. Rasha)',
    vintageYear: MASTER_PROTOCOL_CONFIG.metadata.vintageYear,
    initialWeightKg: MASTER_PROTOCOL_CONFIG.metadata.grapeWeightKg,
    targetStyle: 'red',
    status: 'active_fermentation',
    startDate: '۱۴۰۵/۰۷/۲۴',
    notes: 'پروتکل مستر ۴۰۰ کیلوگرمی استاندارد انولوژی با ۳۶ لیتر خون‌گیری برای شراب رُزه سانیه (Saignée) و ۳۱۴ لیتر توده قرمز (۲۶۴ لیتر فاز مایع).',
    isDemo: true
  },
  {
    id: 'batch-rose-1403',
    name: 'بچ شماره ۲: شراب رُزه سانیه رشه سردشت (۳۲ لیتر شفاف)',
    grapeVariety: 'انگور سیاه رشه سردشت (آب‌انگور زلال خون‌گیری‌شده Saignée)',
    vintageYear: MASTER_PROTOCOL_CONFIG.metadata.vintageYear,
    initialWeightKg: 40,
    targetStyle: 'rose',
    status: 'active_fermentation',
    startDate: '۱۴۰۵/۰۷/۲۵',
    notes: 'جداسازی پیش از تخمیر پس از ۳.۵ ساعت خیساندن سرد با پوست، شفاف‌سازی ۲۴ ساعته در سرما (۳۶L ← ۳۲L) و تخمیر آروماتیک در ۱۶–۱۸ درجه سانتی‌گراد.',
    isDemo: true
  }
];
export const DEFAULT_CHEMICAL_ADDITIONS: ChemicalAddition[] = [
  {
    id: 'add-1',
    batchId: 'batch-rasha-1403',
    tankId: 'tank-a',
    timestamp: '۱۴۰۵/۰۷/۲۴ - ۰۰:۰۰',
    stageTitle: 'روز ۰ - کراش و سولفیت‌زنی اولیه (25 mg/L SO2)',
    compoundName: 'پتاسیم متابی‌سولفیت (KMS)',
    pubchemCid: 24446,
    amount: 6.52,
    unit: 'g',
    purpose: 'سولفیتاسیون اولیه ۲۵ ppm در ۱۵۰ لیتر آب‌انگور جهت مهار مخمرهای وحشی و اکسیداسیون آنزیمی',
    operatorNote: 'در ۵۰۰ میلی‌لیتر آب سرد حل و لایه‌به‌لایه روی توده کراش‌شده اسپری شد.',
    compoundType: 'kms',
    referenceVolumeL: 150,
    calculatedSO2MgL: 24.8,
    isDemo: true
  },
  {
    id: 'add-2',
    batchId: 'batch-rasha-1403',
    tankId: 'tank-a',
    timestamp: '۱۴۰۵/۰۷/۲۴ - ۰۳:۳۰',
    stageTitle: 'روز ۰ - تکمیل سولفیت پس از خون‌گیری سانیه (+15 mg/L SO2)',
    compoundName: 'پتاسیم متابی‌سولفیت (KMS)',
    pubchemCid: 24446,
    amount: 3.43,
    unit: 'g',
    purpose: 'رساندن دوز کل سولفیت به ۴۰ mg/L در ۱۳۲ لیتر فاز مایع باقی‌مانده پس از جداسازی ۱۸ لیتر رُزه',
    operatorNote: '۱۵ دقیقه پیش از تزریق آنزیم پکتولیتیک افزوده و هم زده شد.',
    compoundType: 'kms',
    referenceVolumeL: 132,
    calculatedSO2MgL: 14.8,
    isDemo: true
  },
  {
    id: 'add-3',
    batchId: 'batch-rasha-1403',
    tankId: 'tank-a',
    timestamp: '۱۴۰۵/۰۷/۲۴ - ۰۳:۴۵',
    stageTitle: 'روز ۰ - آنزیم‌زنی و استخراج رنگ',
    compoundName: 'آنزیم پکتیناز (Endo-Polygalacturonase)',
    pubchemCid: undefined,
    amount: 7.26,
    unit: 'g',
    purpose: 'شکستن پکتین دیواره سلولی ضخیم انگور رشه (0.055 g/L در ۱۳۲ لیتر) و آزادسازی آنتوسیانین',
    operatorNote: 'در آب سرد بدون کلر به آرامی حل شد؛ زمان استراحت ۷.۵ ساعت در ۲۰ درجه.',
    compoundType: 'enzyme',
    referenceVolumeL: 132,
    isDemo: true
  },
  {
    id: 'add-4',
    batchId: 'batch-rasha-1403',
    tankId: 'tank-a',
    timestamp: '۱۴۰۵/۰۷/۲۴ - ۱۶:۳۰',
    stageTitle: 'روز ۰ - تلقیح مخمر و محافظ غشایی',
    compoundName: 'مخمر خشک فعال Lalvin RC-212 + Go-Ferm Protect',
    amount: 72.6,
    unit: 'g',
    purpose: 'تلقیح ۳۳.۰۰ گرم مخمر RC-212 (0.25 g/L) همراه با ۳۹.۶۰ گرم Go-Ferm (0.30 g/L) برای ۱۳۲ لیتر',
    operatorNote: 'آبرسانی در آب ۳۸ درجه و هم‌دماسازی پله‌ای (اختلاف دمای کمتر از ۵ درجه با مش).',
    compoundType: 'yeast',
    referenceVolumeL: 132,
    isDemo: true
  },
  {
    id: 'add-5',
    batchId: 'batch-rasha-1403',
    tankId: 'tank-a',
    timestamp: '۱۴۰۵/۰۷/۲۶ - ۰۸:۰۰',
    stageTitle: 'روز ۲ - تغذیه نوبت اول (SNA-1 در SG = 1.083)',
    compoundName: 'نیتروژن آلی (Fermaid O)',
    amount: 33.0,
    unit: 'g',
    purpose: 'تامین نیتروژن آلی اسیدهای آمینه (0.25 g/L در ۱۳۲ لیتر) بدون ایجاد پیک حرارتی ناگهانی',
    operatorNote: 'پس از هوادهی ملایم در نمونه شراب حل و با پیژاژ پخش شد.',
    compoundType: 'fermaid_o',
    referenceVolumeL: 132,
    isDemo: true
  },
  {
    id: 'add-6',
    batchId: 'batch-rasha-1403',
    tankId: 'tank-a',
    timestamp: '۱۴۰۵/۰۷/۲۷ - ۰۸:۰۰',
    stageTitle: 'روز ۳ - تغذیه نوبت دوم در ۱/۳ مصرف قند (SNA-2 در SG = 1.070)',
    compoundName: 'Fermaid K (33.00g) + DAP (19.80g) + سولفات روی (1.58g)',
    pubchemCid: 24261,
    amount: 54.38,
    unit: 'g',
    purpose: 'آخرین مهلت مجاز تزریق نیتروژن معدنی DAP و Fermaid K پیش از بسته شدن حامل‌های غشایی مخمر در الکل ۶٪',
    operatorNote: 'شامل ۳۳.۰۰g فرمید K + ۱۹.۸۰g دی‌آمونیوم فسفات + ۱.۵۸g سولفات روی هپتاهیدرات.',
    compoundType: 'fermaid_k',
    referenceVolumeL: 132,
    isDemo: true
  }
];
export const DEFAULT_LAB_ANALYSES: LabAnalysisRecord[] = [
  {
    id: 'lab-1',
    batchId: 'batch-rasha-1403',
    tankId: 'tank-a',
    date: '۱۴۰۵/۰۷/۲۴',
    testType: 'ph_meter',
    targetAnalyte: 'pH آبمیوه اولیه',
    measuredValue: 3.52,
    unit: 'pH Units',
    actionTaken: 'در محدوده بهینه (۳.۴۵ تا ۳.۵۵). نیازی به افزایش اسید تارتاریک قبل از تخمیر ندارد.',
    notes: 'دستگاه با بافرهای ۴.۰۱ و ۷.۰۰ کالیبره شد.',
    isDemo: true
  },
  {
    id: 'lab-2',
    batchId: 'batch-rasha-1403',
    tankId: 'tank-a',
    date: '۱۴۰۵/۰۷/۲۴',
    testType: 'ta_titration',
    targetAnalyte: 'اسیدیته کل قابل تیتر (TA)',
    pubchemCid: 875,
    measuredValue: 6.8,
    unit: 'g/L Tartaric',
    actionTaken: 'اسیدیته انگور رشه سردشت کاملاً متعادل و مطلوب است.',
    notes: 'تیتراسیون با هیدروکسید سدیم ۰.۱ نرمال تا نقطه خنثی pH=8.2.',
    isDemo: true
  },
  {
    id: 'lab-3',
    batchId: 'batch-rasha-1403',
    tankId: 'tank-a',
    date: '۱۴۰۵/۰۷/۲۵',
    testType: 'ripper_so2',
    targetAnalyte: 'Free SO2 (دی‌اکسید گوگرد آزاد)',
    pubchemCid: 1119,
    measuredValue: 24,
    unit: 'mg/L (ppm)',
    actionTaken: 'میزان SO2 آزاد با توجه به واکنش با اجزای انگور افت کرده و در روز ۱ مناسب است.',
    notes: 'روش ریپر با محلول ید ۰.۰۲ نرمال و شناساگر نشاسته.',
    isDemo: true
  }
];
class EnologyDatabaseService {
  private batches: WineBatch[] = [];
  private logs: FermentationLogEntry[] = [];
  private additions: ChemicalAddition[] = [];
  private analyses: LabAnalysisRecord[] = [];
  private calculations: SavedCalculation[] = [];
  private isInitialized = false;
  private hasLocalMutations = false;
  private storageErrorsByKey: Record<string, string> = {};
  private lastStorageError: string | null = null;
  private corruptedKeysRecovered: string[] = [];
  private lastBackupMs: number | null = null;
  private changesSinceBackup = 0;
  constructor() {
    this.init();
    onFlexibleProtocolSync((params) => {
      this.syncActiveBatchProtocolSnapshot(params);
    });
    if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
      window.addEventListener('enology-flexible-protocol-sync', (e: Event) => {
        const customEvent = e as CustomEvent<FlexibleProtocolParams>;
        if (customEvent.detail) {
          this.syncActiveBatchProtocolSnapshot(customEvent.detail);
        }
      });
    }
  }
  private preserveCorruptRawValue(key: string, rawValue: string) {
    this.corruptedKeysRecovered.push(key);
    if (typeof localStorage === 'undefined') return;
    try {
      const dateSuffix = new Date().toISOString().slice(0, 10);
      localStorage.setItem(`corrupt_${key}_${dateSuffix}`, rawValue);
    } catch {
    }
  }
  private handleStorageSetItem(key: string, serialized: string) {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(key, serialized);
      delete this.storageErrorsByKey[key];
      this.lastStorageError = Object.values(this.storageErrorsByKey)[0] ?? null;
    } catch (e) {
      const errMsg =
        'ذخیره نشد؛ حافظهٔ مرورگر پر است یا مسدود شده است. همین الان فایل پشتیبان بگیرید.';
      this.storageErrorsByKey[key] = errMsg;
      this.lastStorageError = Object.values(this.storageErrorsByKey)[0] ?? errMsg;
      if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
        window.dispatchEvent(
          new CustomEvent('enology-storage-error', { detail: this.lastStorageError })
        );
      }
      console.error(`Error persisting ${key}`, e);
    }
  }
  private loadBackupMeta() {
    if (typeof localStorage === 'undefined') return;
    try {
      const raw = localStorage.getItem(DB_STORAGE_KEY_BACKUP_META);
      if (raw) {
        const parsed = JSON.parse(raw) as { lastBackupMs?: unknown; changesSinceBackup?: unknown };
        this.lastBackupMs = typeof parsed.lastBackupMs === 'number' ? parsed.lastBackupMs : null;
        this.changesSinceBackup =
          typeof parsed.changesSinceBackup === 'number' ? parsed.changesSinceBackup : 0;
      }
    } catch {
      this.lastBackupMs = null;
      this.changesSinceBackup = 0;
    }
  }
  private persistBackupMeta() {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(
        DB_STORAGE_KEY_BACKUP_META,
        JSON.stringify({
          lastBackupMs: this.lastBackupMs,
          changesSinceBackup: this.changesSinceBackup
        })
      );
    } catch {
    }
  }
  private incrementChangesSinceBackup() {
    this.changesSinceBackup += 1;
    this.persistBackupMeta();
  }
  private parseArrayWithSalvage<T>(
    key: string,
    rawJson: string,
    itemSchema: z.ZodType<T>,
    fallback: T[]
  ): T[] {
    try {
      const parsed: unknown = JSON.parse(rawJson);
      const full = z.array(itemSchema).safeParse(parsed);
      if (full.success) {
        return full.data;
      }
      this.preserveCorruptRawValue(key, rawJson);
      if (Array.isArray(parsed)) {
        const salvaged: T[] = [];
        for (const item of parsed) {
          const r = itemSchema.safeParse(item);
          if (r.success) {
            salvaged.push(r.data);
          }
        }
        if (salvaged.length > 0) {
          return salvaged;
        }
      }
      return [...fallback];
    } catch {
      this.preserveCorruptRawValue(key, rawJson);
      return [...fallback];
    }
  }
  public async hydrateFromIndexedDBIfNeeded(): Promise<boolean> {
    if (typeof indexedDB === 'undefined') return false;
    const needsBatches =
      (typeof localStorage !== 'undefined' && !localStorage.getItem(DB_STORAGE_KEY_BATCHES)) ||
      this.corruptedKeysRecovered.includes(DB_STORAGE_KEY_BATCHES);
    const needsLogs =
      (typeof localStorage !== 'undefined' &&
        !localStorage.getItem(DB_STORAGE_KEY_LOGS) &&
        !localStorage.getItem('enology_fermentation_logs_v2')) ||
      this.corruptedKeysRecovered.includes(DB_STORAGE_KEY_LOGS);
    const needsAdditions =
      (typeof localStorage !== 'undefined' && !localStorage.getItem(DB_STORAGE_KEY_ADDITIONS)) ||
      this.corruptedKeysRecovered.includes(DB_STORAGE_KEY_ADDITIONS);
    const needsAnalyses =
      (typeof localStorage !== 'undefined' && !localStorage.getItem(DB_STORAGE_KEY_ANALYSES)) ||
      this.corruptedKeysRecovered.includes(DB_STORAGE_KEY_ANALYSES);
    const needsCalcs =
      (typeof localStorage !== 'undefined' && !localStorage.getItem(DB_STORAGE_KEY_CALCS)) ||
      this.corruptedKeysRecovered.includes(DB_STORAGE_KEY_CALCS);
    if (!needsBatches && !needsLogs && !needsAdditions && !needsAnalyses && !needsCalcs) {
      return false;
    }
    return new Promise<boolean>((resolve) => {
      try {
        const req = indexedDB.open('enology_studio_idb_v1', 1);
        req.onupgradeneeded = () => {
          const db = req.result;
          if (!db.objectStoreNames.contains('kv_mirror')) {
            db.createObjectStore('kv_mirror');
          }
        };
        req.onerror = () => resolve(false);
        req.onsuccess = () => {
          try {
            const db = req.result;
            if (!db.objectStoreNames.contains('kv_mirror')) {
              resolve(false);
              return;
            }
            const tx = db.transaction('kv_mirror', 'readonly');
            const store = tx.objectStore('kv_mirror');
            let hydratedAny = false;
            const readKey = <T>(
              key: string,
              shouldHydrate: boolean,
              schema: z.ZodType<T>,
              onValid: (items: T[]) => void
            ): Promise<void> =>
              new Promise((res) => {
                if (!shouldHydrate) {
                  res();
                  return;
                }
                try {
                  const getReq = store.get(key);
                  getReq.onsuccess = () => {
                    if (this.hasLocalMutations) {
                      res();
                      return;
                    }
                    const val = getReq.result;
                    if (Array.isArray(val) && val.length > 0) {
                      const parsed = z.array(schema).safeParse(val);
                      if (parsed.success && parsed.data.length > 0) {
                        onValid(parsed.data);
                        hydratedAny = true;
                      }
                    }
                    res();
                  };
                  getReq.onerror = () => res();
                } catch {
                  res();
                }
              });
            const mergeIfSalvaged = <T extends { id: string }>(
              key: string,
              current: T[],
              idbItems: T[]
            ): T[] => {
              if (!this.corruptedKeysRecovered.includes(key) || current.length === 0) {
                return idbItems;
              }
              const map = new Map<string, T>();
              for (const item of current) {
                map.set(item.id, item);
              }
              for (const idbItem of idbItems) {
                if (!map.has(idbItem.id)) {
                  map.set(idbItem.id, idbItem);
                }
              }
              return Array.from(map.values());
            };
            void Promise.all([
              readKey(DB_STORAGE_KEY_BATCHES, needsBatches, WineBatchSchema, (items) => {
                this.batches = mergeIfSalvaged(DB_STORAGE_KEY_BATCHES, this.batches, items);
                this.handleStorageSetItem(DB_STORAGE_KEY_BATCHES, JSON.stringify(this.batches));
              }),
              readKey(DB_STORAGE_KEY_LOGS, needsLogs, FermentationLogEntrySchema, (items) => {
                this.logs = mergeIfSalvaged(DB_STORAGE_KEY_LOGS, this.logs, items);
                this.handleStorageSetItem(DB_STORAGE_KEY_LOGS, JSON.stringify(this.logs));
              }),
              readKey(DB_STORAGE_KEY_ADDITIONS, needsAdditions, ChemicalAdditionSchema, (items) => {
                this.additions = mergeIfSalvaged(DB_STORAGE_KEY_ADDITIONS, this.additions, items);
                this.handleStorageSetItem(DB_STORAGE_KEY_ADDITIONS, JSON.stringify(this.additions));
              }),
              readKey(DB_STORAGE_KEY_ANALYSES, needsAnalyses, LabAnalysisRecordSchema, (items) => {
                this.analyses = mergeIfSalvaged(DB_STORAGE_KEY_ANALYSES, this.analyses, items);
                this.handleStorageSetItem(DB_STORAGE_KEY_ANALYSES, JSON.stringify(this.analyses));
              }),
              readKey(DB_STORAGE_KEY_CALCS, needsCalcs, SavedCalculationSchema, (items) => {
                this.calculations = mergeIfSalvaged(DB_STORAGE_KEY_CALCS, this.calculations, items);
                this.handleStorageSetItem(DB_STORAGE_KEY_CALCS, JSON.stringify(this.calculations));
              })
            ]).then(() => resolve(hydratedAny));
          } catch {
            resolve(false);
          }
        };
      } catch {
        resolve(false);
      }
    });
  }
  private init() {
    if (this.isInitialized) return;
    this.loadBackupMeta();
    const savedBatches =
      typeof localStorage !== 'undefined' ? localStorage.getItem(DB_STORAGE_KEY_BATCHES) : null;
    if (savedBatches) {
      this.batches = this.parseArrayWithSalvage(
        DB_STORAGE_KEY_BATCHES,
        savedBatches,
        WineBatchSchema,
        DEFAULT_BATCHES
      );
    } else {
      this.batches = [...DEFAULT_BATCHES];
    }
    const savedLogs =
      typeof localStorage !== 'undefined'
        ? localStorage.getItem(DB_STORAGE_KEY_LOGS) || localStorage.getItem('enology_fermentation_logs_v2')
        : null;
    if (savedLogs) {
      this.logs = this.parseArrayWithSalvage(
        DB_STORAGE_KEY_LOGS,
        savedLogs,
        FermentationLogEntrySchema,
        INITIAL_TRACKING_DATA
      );
    } else {
      this.logs = [...INITIAL_TRACKING_DATA];
    }
    const savedAdditions =
      typeof localStorage !== 'undefined' ? localStorage.getItem(DB_STORAGE_KEY_ADDITIONS) : null;
    if (savedAdditions) {
      this.additions = this.parseArrayWithSalvage(
        DB_STORAGE_KEY_ADDITIONS,
        savedAdditions,
        ChemicalAdditionSchema,
        DEFAULT_CHEMICAL_ADDITIONS
      );
    } else {
      this.additions = [...DEFAULT_CHEMICAL_ADDITIONS];
    }
    const savedAnalyses =
      typeof localStorage !== 'undefined' ? localStorage.getItem(DB_STORAGE_KEY_ANALYSES) : null;
    if (savedAnalyses) {
      this.analyses = this.parseArrayWithSalvage(
        DB_STORAGE_KEY_ANALYSES,
        savedAnalyses,
        LabAnalysisRecordSchema,
        DEFAULT_LAB_ANALYSES
      );
    } else {
      this.analyses = [...DEFAULT_LAB_ANALYSES];
    }
    const savedCalcs =
      typeof localStorage !== 'undefined' ? localStorage.getItem(DB_STORAGE_KEY_CALCS) : null;
    if (savedCalcs) {
      this.calculations = this.parseArrayWithSalvage(
        DB_STORAGE_KEY_CALCS,
        savedCalcs,
        SavedCalculationSchema,
        []
      );
    } else {
      this.calculations = [];
    }
    this.isInitialized = true;
    void this.hydrateFromIndexedDBIfNeeded();
  }
  public getStorageDiagnostics(): { lastStorageError: string | null; corruptedKeysRecovered: string[] } {
    return {
      lastStorageError: this.lastStorageError,
      corruptedKeysRecovered: [...this.corruptedKeysRecovered]
    };
  }
  public getBatches(): WineBatch[] {
    return [...this.batches];
  }
  public getBatchById(id: string): WineBatch | undefined {
    return this.batches.find((b) => b.id === id);
  }
  public addBatch(batch: Omit<WineBatch, 'id'>): WineBatch {
    this.hasLocalMutations = true;
    const newBatch: WineBatch = {
      ...batch,
      id: generateId('batch'),
      updatedAtMs: batch.updatedAtMs ?? Date.now()
    };
    this.batches.unshift(newBatch);
    this.persistBatches();
    this.incrementChangesSinceBackup();
    return newBatch;
  }
  public updateBatch(id: string, updates: Partial<WineBatch>): WineBatch | null {
    const idx = this.batches.findIndex((b) => b.id === id);
    if (idx === -1) return null;
    this.hasLocalMutations = true;
    this.batches[idx] = { ...this.batches[idx], ...updates, updatedAtMs: Date.now() };
    this.persistBatches();
    this.incrementChangesSinceBackup();
    return this.batches[idx];
  }
  public updateBatchProtocolSnapshot(
    batchId: string,
    params: FlexibleProtocolParams
  ): WineBatch | null {
    return this.updateBatch(batchId, {
      protocolParamsSnapshot: { ...params }
    });
  }
  public syncActiveBatchProtocolSnapshot(params: FlexibleProtocolParams): WineBatch | null {
    const storedActiveBatchId =
      typeof localStorage !== 'undefined'
        ? localStorage.getItem('enology_ui_active_batch_v1')
        : null;
    const targetBatch =
      (storedActiveBatchId
        ? this.batches.find((b) => b.id === storedActiveBatchId)
        : undefined) ??
      this.batches.find((b) => !b.isDemo) ??
      this.batches[0];
    if (!targetBatch) return null;
    return this.updateBatchProtocolSnapshot(targetBatch.id, params);
  }
  private persistBatches() {
    mirrorToIndexedDB(DB_STORAGE_KEY_BATCHES, this.batches);
    this.handleStorageSetItem(DB_STORAGE_KEY_BATCHES, JSON.stringify(this.batches));
  }
  public hasDemoData(): boolean {
    return (
      this.batches.some((b) => b.isDemo === true) ||
      this.additions.some((a) => !a.isDeleted && a.isDemo === true)
    );
  }
  public startRealBatchMode(newBatch?: Omit<WineBatch, 'id'>): WineBatch | null {
    this.hasLocalMutations = true;
    this.batches = this.batches.filter((b) => b.isDemo !== true);
    this.additions = this.additions.filter((a) => a.isDemo !== true);
    this.analyses = this.analyses.filter((a) => a.isDemo !== true);
    this.logs = this.logs.filter((l) => l.isBenchmark === true || l.isDemo !== true);
    let createdBatch: WineBatch | null = null;
    if (newBatch) {
      createdBatch = {
        ...newBatch,
        isDemo: false,
        id: generateId('batch'),
        updatedAtMs: newBatch.updatedAtMs ?? Date.now()
      };
      this.batches.unshift(createdBatch);
    } else if (this.batches.length === 0) {
      createdBatch = {
        id: generateId('batch'),
        name: 'بچ واقعی شماره ۱: انگور رشه سردشت',
        grapeVariety: 'انگور سیاه رشه سردشت',
        vintageYear: MASTER_PROTOCOL_CONFIG.metadata.vintageYear,
        initialWeightKg: MASTER_PROTOCOL_CONFIG.metadata.grapeWeightKg,
        targetStyle: 'red',
        status: 'active_fermentation',
        startDate: new Intl.DateTimeFormat('fa-IR').format(new Date()),
        isDemo: false,
        updatedAtMs: Date.now()
      };
      this.batches.unshift(createdBatch);
    }
    this.persistBatches();
    this.persistLogs();
    this.persistAdditions();
    this.persistAnalyses();
    this.incrementChangesSinceBackup();
    return createdBatch ?? this.batches[0] ?? null;
  }
  public getOrphanRecordsSummary(): {
    orphanLogsCount: number;
    orphanAdditionsCount: number;
    orphanAnalysesCount: number;
  } {
    const validBatchIds = new Set(this.batches.map((b) => b.id));
    const orphanLogsCount = this.logs.filter(
      (l) => !l.isDeleted && !l.isBenchmark && (!l.batchId || !validBatchIds.has(l.batchId))
    ).length;
    const orphanAdditionsCount = this.additions.filter(
      (a) => !a.isDeleted && (!a.batchId || !validBatchIds.has(a.batchId))
    ).length;
    const orphanAnalysesCount = this.analyses.filter(
      (a) => !a.isDeleted && (!a.batchId || !validBatchIds.has(a.batchId))
    ).length;
    return {
      orphanLogsCount,
      orphanAdditionsCount,
      orphanAnalysesCount
    };
  }
  public assignOrphanRecordsToBatch(targetBatchId: string): void {
    const validBatchIds = new Set(this.batches.map((b) => b.id));
    const now = Date.now();
    let changed = false;
    this.logs = this.logs.map((l) => {
      if (!l.isDeleted && !l.isBenchmark && (!l.batchId || !validBatchIds.has(l.batchId))) {
        changed = true;
        return { ...l, batchId: targetBatchId, updatedAtMs: now };
      }
      return l;
    });
    this.additions = this.additions.map((a) => {
      if (!a.isDeleted && (!a.batchId || !validBatchIds.has(a.batchId))) {
        changed = true;
        return { ...a, batchId: targetBatchId, updatedAtMs: now };
      }
      return a;
    });
    this.analyses = this.analyses.map((a) => {
      if (!a.isDeleted && (!a.batchId || !validBatchIds.has(a.batchId))) {
        changed = true;
        return { ...a, batchId: targetBatchId, updatedAtMs: now };
      }
      return a;
    });
    if (changed) {
      this.hasLocalMutations = true;
      this.persistLogs();
      this.persistAdditions();
      this.persistAnalyses();
      this.incrementChangesSinceBackup();
    }
  }
  private matchesBatch(itemBatchId: string | undefined, batchId: string): boolean {
    const isDefaultDemoBatch =
      batchId === 'batch-rasha-1403' ||
      batchId === 'batch-rose-1403' ||
      this.batches.find((b) => b.id === batchId)?.isDemo === true;
    return itemBatchId === batchId || (!itemBatchId && isDefaultDemoBatch);
  }
  public getLogs(tankId?: TankId, includeDeleted: boolean = false, batchId?: string): FermentationLogEntry[] {
    let visibleLogs = includeDeleted ? this.logs : this.logs.filter((l) => !l.isDeleted);
    if (batchId) {
      visibleLogs = visibleLogs.filter(
        (l) => l.isBenchmark === true || this.matchesBatch(l.batchId, batchId)
      );
    }
    if (!tankId) return [...visibleLogs];
    return visibleLogs.filter((l) => l.tankId === tankId).sort((a, b) => a.dayNumber - b.dayNumber);
  }
  public addLog(entry: FermentationLogEntry): FermentationLogEntry[] {
    this.hasLocalMutations = true;
    const now = Date.now();
    const fallbackBatch =
      this.batches.find(
        (b) => (entry.tankId === 'tank-rose' ? b.targetStyle === 'rose' : b.targetStyle !== 'rose') && !b.isDemo
      ) ??
      this.batches.find((b) =>
        entry.tankId === 'tank-rose' ? b.targetStyle === 'rose' : b.targetStyle !== 'rose'
      );
    const resolvedBatchId =
      entry.batchId ??
      fallbackBatch?.id ??
      (entry.tankId === 'tank-rose' ? 'batch-rose-1403' : 'batch-rasha-1403');
    const enriched: FermentationLogEntry = {
      ...entry,
      batchId: resolvedBatchId,
      timestampMs: entry.timestampMs ?? now,
      updatedAtMs: entry.updatedAtMs ?? now
    };
    this.logs.push(enriched);
    this.persistLogs();
    this.incrementChangesSinceBackup();
    return this.getLogs();
  }
  public updateLog(id: string, entry: Partial<FermentationLogEntry>): FermentationLogEntry[] {
    const idx = this.logs.findIndex((l) => l.id === id);
    if (idx !== -1) {
      this.hasLocalMutations = true;
      this.logs[idx] = { ...this.logs[idx], ...entry, updatedAtMs: Date.now() };
      this.persistLogs();
      this.incrementChangesSinceBackup();
    }
    return this.getLogs();
  }
  public softDeleteLog(id: string): FermentationLogEntry[] {
    const idx = this.logs.findIndex((l) => l.id === id);
    if (idx !== -1) {
      this.hasLocalMutations = true;
      this.logs[idx] = { ...this.logs[idx], isDeleted: true, updatedAtMs: Date.now() };
      this.persistLogs();
      this.incrementChangesSinceBackup();
    }
    return this.getLogs();
  }
  public restoreLog(id: string): FermentationLogEntry[] {
    const idx = this.logs.findIndex((l) => l.id === id);
    if (idx !== -1) {
      this.hasLocalMutations = true;
      this.logs[idx] = { ...this.logs[idx], isDeleted: false, updatedAtMs: Date.now() };
      this.persistLogs();
      this.incrementChangesSinceBackup();
    }
    return this.getLogs();
  }
  public deleteLog(id: string): FermentationLogEntry[] {
    this.hasLocalMutations = true;
    this.logs = this.logs.filter((l) => l.id !== id);
    this.persistLogs();
    this.incrementChangesSinceBackup();
    return this.getLogs();
  }
  public clearRealLogs(tankId?: TankId, batchId?: string): FermentationLogEntry[] {
    this.hasLocalMutations = true;
    this.logs = this.logs.filter((l) => {
      if (l.isBenchmark === true) return true;
      if (tankId && l.tankId !== tankId) return true;
      if (batchId && !this.matchesBatch(l.batchId, batchId)) return true;
      return false;
    });
    this.persistLogs();
    this.incrementChangesSinceBackup();
    return this.getLogs(undefined, false, batchId);
  }
  public resetLogsToDefault(): FermentationLogEntry[] {
    this.hasLocalMutations = true;
    this.logs = [...INITIAL_TRACKING_DATA];
    this.persistLogs();
    return this.getLogs();
  }
  private persistLogs() {
    mirrorToIndexedDB(DB_STORAGE_KEY_LOGS, this.logs);
    this.handleStorageSetItem(DB_STORAGE_KEY_LOGS, JSON.stringify(this.logs));
  }
  public getAdditions(tankId?: TankId, includeDeleted: boolean = false, batchId?: string): ChemicalAddition[] {
    let visibleAdditions = includeDeleted ? this.additions : this.additions.filter((a) => !a.isDeleted);
    if (batchId) {
      visibleAdditions = visibleAdditions.filter((a) => this.matchesBatch(a.batchId, batchId));
    }
    if (!tankId) return [...visibleAdditions];
    return visibleAdditions.filter((a) => a.tankId === tankId);
  }
  public addAddition(addition: Omit<ChemicalAddition, 'id'>): ChemicalAddition {
    this.hasLocalMutations = true;
    const now = Date.now();
    const newAddition: ChemicalAddition = {
      ...addition,
      id: generateId('add'),
      timestampMs: addition.timestampMs ?? now,
      updatedAtMs: addition.updatedAtMs ?? now
    };
    this.additions.unshift(newAddition);
    this.persistAdditions();
    this.incrementChangesSinceBackup();
    return newAddition;
  }
  public softDeleteAddition(id: string): ChemicalAddition[] {
    const idx = this.additions.findIndex((a) => a.id === id);
    if (idx !== -1) {
      this.hasLocalMutations = true;
      this.additions[idx] = { ...this.additions[idx], isDeleted: true, updatedAtMs: Date.now() };
      this.persistAdditions();
      this.incrementChangesSinceBackup();
    }
    return this.getAdditions();
  }
  public restoreAddition(id: string): ChemicalAddition[] {
    const idx = this.additions.findIndex((a) => a.id === id);
    if (idx !== -1) {
      this.hasLocalMutations = true;
      this.additions[idx] = { ...this.additions[idx], isDeleted: false, updatedAtMs: Date.now() };
      this.persistAdditions();
      this.incrementChangesSinceBackup();
    }
    return this.getAdditions();
  }
  public deleteAddition(id: string): ChemicalAddition[] {
    this.hasLocalMutations = true;
    this.additions = this.additions.filter((a) => a.id !== id);
    this.persistAdditions();
    this.incrementChangesSinceBackup();
    return this.getAdditions();
  }
  private persistAdditions() {
    mirrorToIndexedDB(DB_STORAGE_KEY_ADDITIONS, this.additions);
    this.handleStorageSetItem(DB_STORAGE_KEY_ADDITIONS, JSON.stringify(this.additions));
  }
  public getLabAnalyses(tankId?: TankId, includeDeleted: boolean = false, batchId?: string): LabAnalysisRecord[] {
    let visibleAnalyses = includeDeleted ? this.analyses : this.analyses.filter((a) => !a.isDeleted);
    if (batchId) {
      visibleAnalyses = visibleAnalyses.filter((a) => this.matchesBatch(a.batchId, batchId));
    }
    if (!tankId) return [...visibleAnalyses];
    return visibleAnalyses.filter((a) => a.tankId === tankId);
  }
  public addLabAnalysis(analysis: Omit<LabAnalysisRecord, 'id'>): LabAnalysisRecord {
    this.hasLocalMutations = true;
    const now = Date.now();
    const newRecord: LabAnalysisRecord = {
      ...analysis,
      id: generateId('lab'),
      timestampMs: analysis.timestampMs ?? now,
      updatedAtMs: analysis.updatedAtMs ?? now
    };
    this.analyses.unshift(newRecord);
    this.persistAnalyses();
    this.incrementChangesSinceBackup();
    return newRecord;
  }
  public softDeleteLabAnalysis(id: string): LabAnalysisRecord[] {
    const idx = this.analyses.findIndex((a) => a.id === id);
    if (idx !== -1) {
      this.hasLocalMutations = true;
      this.analyses[idx] = { ...this.analyses[idx], isDeleted: true, updatedAtMs: Date.now() };
      this.persistAnalyses();
      this.incrementChangesSinceBackup();
    }
    return this.getLabAnalyses();
  }
  public restoreLabAnalysis(id: string): LabAnalysisRecord[] {
    const idx = this.analyses.findIndex((a) => a.id === id);
    if (idx !== -1) {
      this.hasLocalMutations = true;
      this.analyses[idx] = { ...this.analyses[idx], isDeleted: false, updatedAtMs: Date.now() };
      this.persistAnalyses();
      this.incrementChangesSinceBackup();
    }
    return this.getLabAnalyses();
  }
  public deleteLabAnalysis(id: string): LabAnalysisRecord[] {
    this.hasLocalMutations = true;
    this.analyses = this.analyses.filter((a) => a.id !== id);
    this.persistAnalyses();
    this.incrementChangesSinceBackup();
    return this.getLabAnalyses();
  }
  private persistAnalyses() {
    mirrorToIndexedDB(DB_STORAGE_KEY_ANALYSES, this.analyses);
    this.handleStorageSetItem(DB_STORAGE_KEY_ANALYSES, JSON.stringify(this.analyses));
  }
  public getSavedCalculations(): SavedCalculation[] {
    return [...this.calculations];
  }
  public saveCalculation(calc: Omit<SavedCalculation, 'id' | 'timestamp'>): SavedCalculation {
    this.hasLocalMutations = true;
    const newCalc: SavedCalculation = {
      ...calc,
      id: generateId('calc'),
      timestamp: new Intl.DateTimeFormat('fa-IR', {
        dateStyle: 'medium',
        timeStyle: 'short'
      }).format(new Date())
    };
    this.calculations.unshift(newCalc);
    this.persistCalculations();
    this.incrementChangesSinceBackup();
    return newCalc;
  }
  public deleteCalculation(id: string): SavedCalculation[] {
    this.hasLocalMutations = true;
    this.calculations = this.calculations.filter((c) => c.id !== id);
    this.persistCalculations();
    this.incrementChangesSinceBackup();
    return [...this.calculations];
  }
  private persistCalculations() {
    mirrorToIndexedDB(DB_STORAGE_KEY_CALCS, this.calculations);
    this.handleStorageSetItem(DB_STORAGE_KEY_CALCS, JSON.stringify(this.calculations));
  }
  public getCumulativeSO2Ledger(
    tankId: TankId,
    batchVolumeL?: number,
    residualSugarGL: number = 1.5,
    measuredTotalSO2MgL?: number,
    excludeDemo: boolean = false,
    batchId?: string
  ): CumulativeSO2Ledger {
    const defaultVol =
      tankId === 'tank-rose'
        ? MASTER_PROTOCOL_CONFIG.volumes.roseClarifiedFermentL
        : MASTER_PROTOCOL_CONFIG.volumes.redLiquidFermentPerTankL;
    const effectiveVol = batchVolumeL && batchVolumeL > 0 ? batchVolumeL : defaultVol;
    const targetBatchId =
      batchId ??
      (excludeDemo
        ? this.batches.find(
            (b) =>
              (tankId === 'tank-rose' ? b.targetStyle === 'rose' : b.targetStyle !== 'rose') &&
              !b.isDemo
          )?.id
        : (
            this.batches.find(
              (b) =>
                (tankId === 'tank-rose' ? b.targetStyle === 'rose' : b.targetStyle !== 'rose') &&
                !b.isDemo
            ) ??
            this.batches.find((b) =>
              tankId === 'tank-rose' ? b.targetStyle === 'rose' : b.targetStyle !== 'rose'
            )
          )?.id);
    const effectiveQueryBatchId = targetBatchId ?? (excludeDemo ? '__NONE__' : undefined);
    const tankAdditions = this.getAdditions(tankId, false, effectiveQueryBatchId).filter((add) => {
      if (add.isDeleted === true) return false;
      if (excludeDemo && add.isDemo === true) return false;
      return true;
    });
    const kmsMgPerGram = Math.round(MASTER_PROTOCOL_CONFIG.stoichiometry.kmsActiveSO2Fraction * 1000);
    const kmsMgPerGhL = Math.round((kmsMgPerGram / 100) * 100) / 100;
    const kmsMgPerMl10Pct = Math.round((kmsMgPerGram / 10) * 10) / 10;
    let addedFromKmsMgL = 0;
    let totalKmsMassGrams = 0;
    let skippedInvalidUnitCount = 0;
    const stageBreakdown: CumulativeSO2Ledger['stageBreakdown'] = [];
    for (const add of tankAdditions) {
      let isKms = false;
      if (add.compoundType !== undefined) {
        isKms = add.compoundType === 'kms';
      } else {
        const isPureBactiless =
          /bactiless|بکتی‌لس|بکتیلس/i.test(add.compoundName) &&
          !/kms|k2s2o5|متابی‌سولفیت|متابیسولفیت/i.test(add.compoundName);
        isKms =
          !isPureBactiless &&
          (add.pubchemCid === 24446 ||
            add.compoundName.includes('سولفیت') ||
            add.compoundName.includes('KMS') ||
            add.compoundName.includes('K2S2O5'));
      }
      if (!isKms) continue;
      const volForStage =
        add.referenceVolumeL !== undefined && add.referenceVolumeL > 0
          ? add.referenceVolumeL
          : add.stageTitle.includes('150') ||
            add.stageTitle.includes('۱۵۰') ||
            add.purpose.includes('150') ||
            add.purpose.includes('۱۵۰')
          ? MASTER_PROTOCOL_CONFIG.volumes.initialLiquidPerTankL
          : effectiveVol;
      if (add.unit === 'mg/L') {
        const contributedMgL = Math.round(add.amount * 10) / 10;
        const rawGrams = (add.amount * volForStage) / kmsMgPerGram;
        const equivalentGrams = Math.round(rawGrams * 100) / 100;
        addedFromKmsMgL += add.amount;
        totalKmsMassGrams += rawGrams;
        stageBreakdown.push({
          id: add.id,
          stageTitle: add.stageTitle,
          amountGrams: equivalentGrams,
          referenceVolumeL: volForStage,
          contributedMgL,
          formulaText: `${add.amount} mg/L (${volForStage} L) = ${contributedMgL} mg/L`,
          isDemo: add.isDemo
        });
      } else if (add.unit === 'g') {
        const rawMgL = (add.amount * kmsMgPerGram) / volForStage;
        const contributedMgL = Math.round(rawMgL * 10) / 10;
        addedFromKmsMgL += rawMgL;
        totalKmsMassGrams += add.amount;
        stageBreakdown.push({
          id: add.id,
          stageTitle: add.stageTitle,
          amountGrams: add.amount,
          referenceVolumeL: volForStage,
          contributedMgL,
          formulaText: `${add.amount} g × ${kmsMgPerGram} ÷ ${volForStage} L = ${contributedMgL} mg/L`,
          isDemo: add.isDemo
        });
      } else if (add.unit === 'kg') {
        const grams = add.amount * 1000;
        const rawMgL = (grams * kmsMgPerGram) / volForStage;
        const contributedMgL = Math.round(rawMgL * 10) / 10;
        addedFromKmsMgL += rawMgL;
        totalKmsMassGrams += grams;
        stageBreakdown.push({
          id: add.id,
          stageTitle: add.stageTitle,
          amountGrams: Math.round(grams * 100) / 100,
          referenceVolumeL: volForStage,
          contributedMgL,
          formulaText: `${add.amount} kg (${grams} g) × ${kmsMgPerGram} ÷ ${volForStage} L = ${contributedMgL} mg/L`,
          isDemo: add.isDemo
        });
      } else if (add.unit === 'g/hL') {
        const grams = (add.amount / 100) * volForStage;
        const rawMgL = add.amount * kmsMgPerGhL;
        const contributedMgL = Math.round(rawMgL * 10) / 10;
        addedFromKmsMgL += rawMgL;
        totalKmsMassGrams += grams;
        stageBreakdown.push({
          id: add.id,
          stageTitle: add.stageTitle,
          amountGrams: Math.round(grams * 100) / 100,
          referenceVolumeL: volForStage,
          contributedMgL,
          formulaText: `${add.amount} g/hL × ${kmsMgPerGhL} = ${contributedMgL} mg/L`,
          isDemo: add.isDemo
        });
      } else if (add.unit === 'mL') {
        const grams = add.amount * 0.1;
        const rawMgL = (add.amount * kmsMgPerMl10Pct) / volForStage;
        const contributedMgL = Math.round(rawMgL * 10) / 10;
        addedFromKmsMgL += rawMgL;
        totalKmsMassGrams += grams;
        stageBreakdown.push({
          id: add.id,
          stageTitle: add.stageTitle,
          amountGrams: Math.round(grams * 100) / 100,
          referenceVolumeL: volForStage,
          contributedMgL,
          formulaText: `${add.amount} mL (محلول ۱۰٪ = ${Math.round(grams * 100) / 100} g) × ${kmsMgPerGram} ÷ ${volForStage} L = ${contributedMgL} mg/L`,
          isDemo: add.isDemo
        });
      } else {
        skippedInvalidUnitCount += 1;
      }
    }
    const roundedAdded = Math.round(addedFromKmsMgL * 10) / 10;
    const roundedTotalKmsMassGrams = Math.round(totalKmsMassGrams * 100) / 100;
    const finalVolumeEquivalentMgL = Math.round(((totalKmsMassGrams * kmsMgPerGram) / effectiveVol) * 10) / 10;
    const endogenousYeastMgL = MASTER_PROTOCOL_CONFIG.stoichiometry.yeastEndogenousSO2MgL;
    const estimatedTotalSO2MgL = Math.round((roundedAdded + endogenousYeastMgL) * 10) / 10;
    const legalCeilingMgL =
      tankId === 'tank-rose'
        ? residualSugarGL >= 5
          ? 250
          : 200
        : residualSugarGL >= 5
        ? 200
        : 150;
    const effectiveComparisonTotal = measuredTotalSO2MgL !== undefined ? measuredTotalSO2MgL : estimatedTotalSO2MgL;
    const remainingBudgetMgL = Math.max(0, Math.round((legalCeilingMgL - effectiveComparisonTotal) * 10) / 10);
    return {
      tankId,
      batchId: targetBatchId,
      addedFromKmsMgL: roundedAdded,
      totalKmsMassGrams: roundedTotalKmsMassGrams,
      finalVolumeEquivalentMgL,
      skippedInvalidUnitCount,
      endogenousYeastMgL,
      estimatedTotalSO2MgL,
      legalCeilingMgL,
      remainingBudgetMgL,
      isOverBudget: effectiveComparisonTotal > legalCeilingMgL,
      accountingBasisFa:
        'حسابداری اسمی سولفیت افزودهشده (Nominal Added SO2 Accounting — متفاوت از Total SO2 آزمایشگاهی)',
      estimatedBoundAndVolatilizedRatio: 0.35,
      measuredTotalSO2MgL,
      stageBreakdown
    };
  }
  public getBackupHealthStatus(): {
    status: 'green' | 'amber' | 'red';
    daysSinceBackup: number | null;
    unsavedChangesCount: number;
    labelFa: string;
  } {
    const daysSinceBackup =
      this.lastBackupMs !== null
        ? Math.floor((Date.now() - this.lastBackupMs) / (1000 * 60 * 60 * 24))
        : null;
    const unsavedChangesCount = this.changesSinceBackup;
    if (daysSinceBackup === null || daysSinceBackup >= 7) {
      return {
        status: 'red',
        daysSinceBackup,
        unsavedChangesCount,
        labelFa: 'پشتیبانگیری نشده یا بیش از ۷ روز گذشته'
      };
    }
    if (daysSinceBackup >= 3 || unsavedChangesCount > 10) {
      return {
        status: 'amber',
        daysSinceBackup,
        unsavedChangesCount,
        labelFa: 'نیازمند پشتیبانگیری جدید'
      };
    }
    return {
      status: 'green',
      daysSinceBackup,
      unsavedChangesCount,
      labelFa: 'آخرین پشتیبان: بهروز'
    };
  }
  public getDatabaseSummary() {
    return {
      totalBatches: this.batches.length,
      totalFermentationLogs: this.logs.length,
      totalChemicalAdditions: this.additions.length,
      totalLabAnalyses: this.analyses.length,
      totalSavedCalculations: this.calculations.length,
      totalRecords:
        this.batches.length +
        this.logs.length +
        this.additions.length +
        this.analyses.length +
        this.calculations.length,
      lastUpdated: new Date().toISOString()
    };
  }
  public buildExportDatabaseJSON(): string {
    let flexibleProtocolParams: Record<string, number | string> | undefined;
    if (typeof localStorage !== 'undefined') {
      try {
        const rawFlex = localStorage.getItem('enology_flexible_protocol_params_v1');
        if (rawFlex) {
          const parsedFlex: unknown = JSON.parse(rawFlex);
          if (parsedFlex && typeof parsedFlex === 'object' && !Array.isArray(parsedFlex)) {
            flexibleProtocolParams = parsedFlex as Record<string, number | string>;
          }
        }
      } catch {
      }
    }
    const exportData: EnologyDatabaseExport = {
      version: '3.3.0',
      exportedAt: new Date().toISOString(),
      batches: this.batches,
      fermentationLogs: this.logs,
      chemicalAdditions: this.additions,
      labAnalyses: this.analyses,
      savedCalculations: this.calculations,
      ...(flexibleProtocolParams ? { flexibleProtocolParams } : {})
    };
    return JSON.stringify(exportData, null, 2);
  }
  public confirmBackupCompleted(): void {
    this.lastBackupMs = Date.now();
    this.changesSinceBackup = 0;
    this.persistBackupMeta();
  }
  public exportDatabaseJSON(confirmImmediately: boolean = true): string {
    const json = this.buildExportDatabaseJSON();
    if (confirmImmediately) {
      this.confirmBackupCompleted();
    }
    return json;
  }
  public exportLogsToCSV(tankId?: TankId, batchId?: string): string {
    const entries = this.getLogs(tankId, false, batchId);
    const headers = [
      'شناسه (ID)',
      'مخزن (Tank)',
      'روز (Day)',
      'تاریخ و ساعت (Date Time)',
      'مرحله (Stage)',
      'بریکس (Brix)',
      'دانسیته ویژه (SG)',
      'دمای کلاهک (Temp Cap °C)',
      'دمای محیط (Temp Room °C)',
      'pH',
      'اسیدیته کل (TA g/L)',
      'سولفیت آزاد (Free SO2 ppm)',
      'پیژاژ (Pigeage)',
      'تعداد پیژاژ',
      'توضیحات و اقدامات (Notes)'
    ];
    const rows = entries.map((e) => [
      `"${e.id}"`,
      `"${e.tankId}"`,
      e.dayNumber,
      `"${e.dateTime}"`,
      `"${e.stageTitle}"`,
      e.brix,
      e.sg,
      e.tempCap,
      e.tempRoom,
      e.ph,
      e.ta ?? '',
      e.freeSO2 ?? '',
      e.pigeageDone ? 'انجام شد' : 'خیر',
      e.pigeageCount ?? 0,
      `"${(e.operationNote || '').replace(/"/g, '""')}"`
    ]);
    return '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }
  public previewDatabaseImport(jsonString: string): {
    valid: boolean;
    messageFa: string;
    summary?: {
      batchesCount: number;
      logsCount: number;
      additionsCount: number;
      analysesCount: number;
      dateRangeFa: string;
    };
  } {
    try {
      const parsedObj: unknown = JSON.parse(jsonString);
      const result = EnologyDatabaseExportSchema.safeParse(parsedObj);
      if (!result.success) {
        return {
          valid: false,
          messageFa: 'فایل پشتیبان نامعتبر است: ساختار داده با پروتکل کارخانه همخوانی ندارد.'
        };
      }
      const logs = result.data.fermentationLogs;
      const batches = result.data.batches;
      let dateRangeFa = 'بدون تاریخ';
      if (logs.length > 0) {
        const firstDate = logs[0].dateTime;
        const lastDate = logs[logs.length - 1].dateTime;
        dateRangeFa = firstDate === lastDate ? firstDate : `${firstDate} تا ${lastDate}`;
      } else if (batches.length > 0) {
        dateRangeFa = batches[0].startDate;
      }
      return {
        valid: true,
        messageFa: 'فایل پشتیبان معتبر است و آماده بارگذاری می‌باشد.',
        summary: {
          batchesCount: batches.length,
          logsCount: logs.length,
          additionsCount: result.data.chemicalAdditions.length,
          analysesCount: result.data.labAnalyses.length,
          dateRangeFa
        }
      };
    } catch {
      return {
        valid: false,
        messageFa: 'فایل پشتیبان نامعتبر است: ساختار داده با پروتکل کارخانه همخوانی ندارد.'
      };
    }
  }
  public importDatabaseJSON(
    jsonString: string,
    mode: 'replace' | 'merge' = 'replace'
  ): { success: boolean; message: string } {
    try {
      const parsedObj: unknown = JSON.parse(jsonString);
      const result = EnologyDatabaseExportSchema.safeParse(parsedObj);
      if (!result.success) {
        return {
          success: false,
          message: 'فایل پشتیبان نامعتبر است: ساختار داده با پروتکل کارخانه همخوانی ندارد.'
        };
      }
      const mergeById = <T extends { id: string }>(existing: T[], incoming: T[]): T[] => {
        const map = new Map<string, T>();
        for (const item of existing) {
          map.set(item.id, item);
        }
        for (const incomingItem of incoming) {
          const existingItem = map.get(incomingItem.id);
          if (!existingItem) {
            map.set(incomingItem.id, incomingItem);
            continue;
          }
          const existingTime =
            (existingItem as { updatedAtMs?: number; timestampMs?: number }).updatedAtMs ??
            (existingItem as { timestampMs?: number }).timestampMs ??
            0;
          const incomingTime =
            (incomingItem as { updatedAtMs?: number; timestampMs?: number }).updatedAtMs ??
            (incomingItem as { timestampMs?: number }).timestampMs ??
            0;
          if (existingTime > incomingTime) {
            map.set(incomingItem.id, existingItem);
          } else if (
            (existingItem as { isDeleted?: boolean }).isDeleted === true &&
            (incomingItem as { isDeleted?: boolean }).isDeleted !== true &&
            incomingTime <= existingTime
          ) {
            map.set(incomingItem.id, existingItem);
          } else {
            map.set(incomingItem.id, incomingItem);
          }
        }
        return Array.from(map.values());
      };
      this.hasLocalMutations = true;
      if (mode === 'merge') {
        this.batches = mergeById(this.batches, result.data.batches);
        this.logs = mergeById(this.logs, result.data.fermentationLogs);
        this.additions = mergeById(this.additions, result.data.chemicalAdditions);
        this.analyses = mergeById(this.analyses, result.data.labAnalyses);
        this.calculations = mergeById(this.calculations, result.data.savedCalculations);
        if (
          result.data.flexibleProtocolParams &&
          typeof localStorage !== 'undefined' &&
          !localStorage.getItem('enology_flexible_protocol_params_v1')
        ) {
          this.handleStorageSetItem(
            'enology_flexible_protocol_params_v1',
            JSON.stringify(result.data.flexibleProtocolParams)
          );
        }
        this.incrementChangesSinceBackup();
      } else {
        this.batches = result.data.batches;
        this.logs = result.data.fermentationLogs;
        this.additions = result.data.chemicalAdditions;
        this.analyses = result.data.labAnalyses;
        this.calculations = result.data.savedCalculations;
        if (result.data.flexibleProtocolParams) {
          this.handleStorageSetItem(
            'enology_flexible_protocol_params_v1',
            JSON.stringify(result.data.flexibleProtocolParams)
          );
        }
      }
      this.persistBatches();
      this.persistLogs();
      this.persistAdditions();
      this.persistAnalyses();
      this.persistCalculations();
      return {
        success: true,
        message:
          mode === 'merge'
            ? `پایگاه داده با موفقیت ادغام شد (${this.logs.length} لاگ، ${this.batches.length} بچ)`
            : `پایگاه داده با موفقیت بازنشانی و بارگذاری شد (${result.data.fermentationLogs.length} لاگ، ${result.data.batches.length} بچ)`
      };
    } catch {
      return {
        success: false,
        message: 'فایل پشتیبان نامعتبر است: ساختار داده با پروتکل کارخانه همخوانی ندارد.'
      };
    }
  }
  public resetToFactoryDefaults() {
    this.hasLocalMutations = true;
    this.batches = [...DEFAULT_BATCHES];
    this.logs = [...INITIAL_TRACKING_DATA];
    this.additions = [...DEFAULT_CHEMICAL_ADDITIONS];
    this.analyses = [...DEFAULT_LAB_ANALYSES];
    this.calculations = [];
    this.persistBatches();
    this.persistLogs();
    this.persistAdditions();
    this.persistAnalyses();
    this.persistCalculations();
    this.incrementChangesSinceBackup();
  }
}
export const enologyDb = new EnologyDatabaseService();
```
