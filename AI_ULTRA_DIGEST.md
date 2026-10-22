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

### `src/components/BandedFermentationChartAndSO2Panel.tsx` (989 lines)
```ts
// --- Imports ---
import React, { useMemo, useState } from 'react';
import { /* icons */ } from 'lucide-react';
import type { ChemicalAddition, FermentationLogEntry, LabAnalysisRecord, TankId } from '../types/index.ts';
import { enologyDb } from '../db/enologyDatabase.ts';
import { calculateMolecularSO2, getContinuousTargetFreeSO2ByPH } from '../utils/enologyUtils.ts';
import { calculateRecentLogVelocity, getCapTemperatureAlertLevel, predictFermentationCompletion, sortFermentationLogs } from '../utils/trackingCalculations.ts';
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
// --- State & Protocol Hooks ---
L63: const [selectedMilestoneId, setSelectedMilestoneId] = useState<string | null>(
L66: const [visibleLayers, setVisibleLayers] = useState<Array<'sg' | 'temp' | 'so2'>>(['sg', 'so2']);
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

### `src/components/LivingTankVisualTwin.tsx` (577 lines)
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
  activityLabelFa: string;
  tempAlert: 'normal' | 'caution' | 'warning' | 'danger';
}
// --- State & Protocol Hooks ---
L258: const { plan } = useFlexibleProtocol();
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

### `src/components/PhotoDiaryAndVintagePanel.tsx` (1743 lines)
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
L598: const [photos, setPhotos] = useState<PhotoDiaryEntry[]>([]);
L599: const [photoError, setPhotoError] = useState<string | null>(null);
L600: const [photoCategory, setPhotoCategory] = useState<
L603: const [photoNote, setPhotoNote] = useState<string>('');
L604: const [photoTags, setPhotoTags] = useState<string[]>([]);
L605: const [isCompressing, setIsCompressing] = useState<boolean>(false);
L614: const [tastingsByCheckpoint, setTastingsByCheckpoint] = useLocalStorageState<
L629: const [historicalVintages, setHistoricalVintages] = useLocalStorageState<
L648: const [visitCount, setVisitCount] = useLocalStorageState<number>(
L652: const [pwaDismissed, setPwaDismissed] = useLocalStorageState<boolean>(
L656: const [calendarStartDate, setCalendarStartDate] = useState<string>(() =>
L855: const [showVintagePassport, setShowVintagePassport] = useState(false);
L856: const [passportCopied, setPassportCopied] = useState(false);
```

### `src/components/ProcessRoadmapTracker.tsx` (2073 lines)
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
L557: const [quickTankState, setQuickTankState] = useState<TankId>(effectiveSingleTankId);
L570: const [quickDay, setQuickDay] = useState<number>(1);
L571: const [quickSG, setQuickSG] = useState<number>(1.083);
L572: const [quickBrix, setQuickBrix] = useState<number>(20.0);
L573: const [quickTempCap, setQuickTempCap] = useState<number>(23.0);
L574: const [quickTempRoom, setQuickTempRoom] = useState<number>(21.0);
L575: const [quickPH, setQuickPH] = useState<number>(3.52);
L576: const [quickTA, setQuickTA] = useState<number>(6.8);
L577: const [quickPhTouched, setQuickPhTouched] = useState<boolean>(false);
L578: const [quickTaTouched, setQuickTaTouched] = useState<boolean>(false);
L579: const [quickNote, setQuickNote] = useState<string>('');
L582: const [selectedRoadmapChemPresetId, setSelectedRoadmapChemPresetId] = useState<string>('');
L583: const [chemName, setChemName] = useState<string>('متابی‌سولفیت پتاسیم (KMS)');
L584: const [chemAmount, setChemAmount] = useState<string>('6.52g');
L585: const [chemPurpose, setChemPurpose] = useState<string>('کنترل میکروبی و آنتی‌اکسیدانی اولیه');
```

### `src/components/QuickTenSecondLogModal.tsx` (1951 lines)
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
L215: const { plan } = useFlexibleProtocol();
L225: const [mode, setMode] = useState<QuickSheetPresetMode>(initialMode);
L226: const [tankSelection, setTankSelection] = useState<GlobalTankSelection>(
L229: const [calibrationTemp, setCalibrationTemp] = useLocalStorageState<20 | 15.5>(
L243: const [rawSGInput, setRawSGInput] = useState<string>('');
L244: const [lastSG, setLastSG] = useState<number>(1.083);
L245: const [tempSample, setTempSample] = useState<number>(20);
L246: const [tempCap, setTempCap] = useState<number>(23.0);
L247: const [tempRoom, setTempRoom] = useState<number>(21.0);
L248: const [tempRoomInput, setTempRoomInput] = useState<string>('21');
L249: const [pigeageDone, setPigeageDone] = useState<boolean>(true);
L252: const [openPhTaSection, setOpenPhTaSection] = useState<boolean>(false);
L253: const [openFreeSo2Section, setOpenFreeSo2Section] = useState<boolean>(false);
L254: const [openRefractSection, setOpenRefractSection] = useState<boolean>(false);
L255: const [openTagsNoteSection, setOpenTagsNoteSection] = useState<boolean>(false);
L257: const [phInput, setPhInput] = useState<string>('3.52');
L258: const [taInput, setTaInput] = useState<string>('');
L259: const [freeSo2Input, setFreeSo2Input] = useState<string>('');
L260: const [refractBrixInput, setRefractBrixInput] = useState<string>('');
L261: const [selectedTags, setSelectedTags] = useState<string[]>([]);
L262: const [operationNote, setOperationNote] = useState<string>('');
L265: const [hasExplicitPhInput, setHasExplicitPhInput] = useState<boolean>(false);
L266: const [hasExplicitTaInput, setHasExplicitTaInput] = useState<boolean>(false);
L267: const [hasExplicitSo2Input, setHasExplicitSo2Input] = useState<boolean>(false);
L274: const [rawAdditionAmount, setRawAdditionAmount] = useState<string>('');
L275: const [additionLotNumber, setAdditionLotNumber] = useState<string>('');
L276: const [additionNote, setAdditionNote] = useState<string>('');
L281: const [rawLabValue, setRawLabValue] = useState<string>('');
L282: const [labNote, setLabNote] = useState<string>('');
```

### `src/components/RightNowActionCenter.tsx` (1822 lines)
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
L97: const { plan } = useFlexibleProtocol();
L119: const [refreshTick, setRefreshTick] = useState(0);
L143: const [showLayer2Why, setShowLayer2Why] = useState(false);
L144: const [showLayer3Science, setShowLayer3Science] = useState(false);
L145: const [showAllDeadlinesToggle, setShowAllDeadlinesToggle] = useState(false);
L146: const [skippingMilestoneId, setSkippingMilestoneId] = useState<string | null>(
L149: const [skipReasonInput, setSkipReasonInput] = useState('');
L152: const [undoSession, setUndoSession] = useState<UndoSession | null>(null);
L153: const [showBottlingGate, setShowBottlingGate] = useState(false);
L154: const [expandedBottlingWhyId, setExpandedBottlingWhyId] = useState<
L157: const [riskOverrideReason, setRiskOverrideReason] = useState('');
L158: const [bottlingUnlockedNotice, setBottlingUnlockedNotice] = useState(false);
L159: const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
L160: const [confirmingRealBatchReset, setConfirmingRealBatchReset] = useState(false);
```

### `src/components/TestingGuide.tsx` (4390 lines)
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
import { calculateTitratableAcidity, calculateTartaricAddition, calculateKHCO3Deacidification, calculateDeacidificationOptions, calculateFreeSO2Ripper, calculateMolecularSO2, correctHydrometer, calculateKMS, calculateRefractometerCorrection, calculateSNAAmounts, calculateBenchFiningGrams, calculateCoolingDryIceKg, getEffectiveLiquidVolume, isAlreadyLiquidVolume, getTargetFreeSO2ByPH, calculateDynamicSGTriggers, calculateH2O2SulfiteRemoval, estimateAcidOrBaseFromPHShift, calculateStagedH2O2Plan, buildCalculatorDirectAdditions, type CalculatorDirectDoseKind } from '../utils/enologyUtils.ts';
import { getCurrentPersianDateTimeStr } from '../utils/persianDate.ts';
// --- Props & Types ---
export type LabHubSubTab = 'calculators-sops' | 'troubleshooting-crises' | 'saved-history';
export interface TestingGuideProps {
  onNavigateToTracking?: () => void;
  initialSelectedTest?: string;
  initialActiveSubTab?: LabHubSubTab;
}
// --- State & Protocol Hooks ---
L121: const [activeSubTab, setActiveSubTab] = useState<LabHubSubTab>(initialActiveSubTab);
L122: const [selectedFilter, setSelectedFilter] = useState<string>(() =>
L125: const [selectedWizardOverride, setSelectedWizardOverride] = useState<
L128: const [savedCalculations, setSavedCalculations] = useState<SavedCalculation[]>(() =>
L131: const [toastMessage, setToastMessage] = useState<string | null>(null);
L133: const [ledgerUndoToast, setLedgerUndoToast] = useState<{
L138: const [showAllTsAlerts, setShowAllTsAlerts] = useState<boolean>(false);
L139: const [expandedTsScienceIds, setExpandedTsScienceIds] = useState<Record<number, boolean>>({});
L219: const [expandedTests, setExpandedTests] = useState<Record<string, boolean>>({
L273: const { params: flexParams, plan: flexPlan } = useFlexibleProtocol();
L292: const [hydroMeasuredSG, setHydroMeasuredSG] = useLocalStorageState<number>('enology_calc_hydro_sg', 1.006);
L293: const [hydroTemp, setHydroTemp] = useLocalStorageState<number>('enology_calc_hydro_temp', 28);
L294: const [refractOrigBrix, setRefractOrigBrix] = useLocalStorageState<number>('enology_calc_refract_orig_brix', 22);
L295: const [refractReadingBrix, setRefractReadingBrix] = useLocalStorageState<number>('enology_calc_refract_curr_brix', 11.5);
L340: const [taNaOHVol, setTaNaOHVol] = useLocalStorageState<number>('enology_calc_ta_naoh_vol', 4.2);
L341: const [taNaOHNorm, setTaNaOHNorm] = useLocalStorageState<number>('enology_calc_ta_naoh_norm', 0.1);
L342: const [taSampleVol, setTaSampleVol] = useLocalStorageState<number>('enology_calc_ta_sample_vol', 5);
L343: const [taTarget, setTaTarget] = useLocalStorageState<number>('enology_calc_ta_target', 6.5);
L344: const [taBatchVolume, setTaBatchVolume] = useLocalStorageState<number>('enology_calc_ta_batch_vol', 132);
L345: const [taUnpressedMash, setTaUnpressedMash] = useLocalStorageState<boolean>('enology_calc_ta_unpressed', false);
L383: const [samplePH, setSamplePH] = useLocalStorageState<number>('enology_calc_ph_sample', 3.65);
L384: const [targetPH, setTargetPH] = useLocalStorageState<number>('enology_calc_ph_target', 3.52);
L385: const [phBatchVolume, setPhBatchVolume] = useLocalStorageState<number>('enology_calc_ph_vol', 132);
L386: const [phUnpressedMash, setPhUnpressedMash] = useLocalStorageState<boolean>('enology_calc_ph_unpressed', false);
L433: const [ripperI2Vol, setRipperI2Vol] = useLocalStorageState<number>('enology_calc_ripper_i2_vol', 1.4);
L434: const [ripperI2Norm, setRipperI2Norm] = useLocalStorageState<number>('enology_calc_ripper_i2_norm', 0.02);
L435: const [ripperSampleVol, setRipperSampleVol] = useLocalStorageState<number>('enology_calc_ripper_sample_vol', 25);
L436: const [winePHForSO2, setWinePHForSO2] = useLocalStorageState<number>('enology_calc_so2_ph', 3.52);
L437: const [kmsCurrentSO2, setKmsCurrentSO2] = useLocalStorageState<number>('enology_calc_kms_current_so2', 18);
L438: const [kmsTargetSO2, setKmsTargetSO2] = useLocalStorageState<number>('enology_calc_kms_target_so2', 35);
L439: const [kmsVolume, setKmsVolume] = useLocalStorageState<number>('enology_calc_kms_vol', 105);
L440: const [kmsUnpressedMash, setKmsUnpressedMash] = useLocalStorageState<boolean>('enology_calc_kms_unpressed', false);
L441: const [useRipperForKMS, setUseRipperForKMS] = useLocalStorageState<boolean>('enology_calc_kms_use_ripper', false);
L472: const [snaBrix, setSnaBrix] = useLocalStorageState<number>('enology_calc_yan_brix', 22);
L473: const [snaVolume, setSnaVolume] = useLocalStorageState<number>('enology_calc_yan_vol', 132);
L474: const [snaNaturalYAN, setSnaNaturalYAN] = useLocalStorageState<number>('enology_calc_yan_natural', 100);
L475: const [snaStrainDemand, setSnaStrainDemand] = useLocalStorageState<'low' | 'medium' | 'high'>(
L479: const [snaUnpressedMash, setSnaUnpressedMash] = useLocalStorageState<boolean>('enology_calc_yan_unpressed', false);
L526: const [capTempCurrent, setCapTempCurrent] = useLocalStorageState<number>('enology_calc_cool_curr_temp', 29.5);
L527: const [capTempTarget, setCapTempTarget] = useLocalStorageState<number>('enology_calc_cool_target_temp', 26.5);
L528: const [coolingBatchVol, setCoolingBatchVol] = useLocalStorageState<number>('enology_calc_cool_vol', 132);
L558: const [drynessSG, setDrynessSG] = useLocalStorageState<number>('enology_calc_dryness_sg', 0.993);
L559: const [drynessStableDays, setDrynessStableDays] = useLocalStorageState<number>('enology_calc_dryness_days', 3);
L560: const [drynessRS, setDrynessRS] = useLocalStorageState<number>('enology_calc_dryness_rs', 1.5);
L586: const [finingTrialRate, setFiningTrialRate] = useLocalStorageState<number>('enology_calc_fining_rate', 0.2); // g/L
L587: const [finingTankVol, setFiningTankVol] = useLocalStorageState<number>('enology_calc_fining_vol', 36);
L588: const [copperDoseMgL, setCopperDoseMgL] = useLocalStorageState<number>('enology_calc_copper_dose', 0.25); // mg/L
L589: const [copperTankVol, setCopperTankVol] = useLocalStorageState<number>('enology_calc_copper_vol', 105);
L619: const [grapeWeight, setGrapeWeight] = useLocalStorageState<number>('enology_calc_grape_weight', 400);
L666: const [tsVol, setTsVol] = useLocalStorageState<number>('enology_calc_ts_vol', 132);
L667: const [tsSG, setTsSG] = useLocalStorageState<number>('enology_calc_ts_sg', 1.060);
L668: const [tsBrix, setTsBrix] = useLocalStorageState<number>('enology_calc_ts_brix', 14.5);
L669: const [tsTemp, setTsTemp] = useLocalStorageState<number>('enology_calc_ts_temp', 28.5);
L670: const [tsPH, setTsPH] = useLocalStorageState<number>('enology_calc_ts_ph', 3.65);
L671: const [tsTA, setTsTA] = useLocalStorageState<number>('enology_calc_ts_ta', 6.2);
L672: const [tsSO2, setTsSO2] = useLocalStorageState<number>('enology_calc_ts_so2', 20);
L673: const [tsUnpressed, setTsUnpressed] = useLocalStorageState<boolean>('enology_calc_ts_unpressed', false);
L674: const [tsStuck, setTsStuck] = useLocalStorageState<boolean>('enology_calc_ts_stuck', false);
L675: const [tsH2S, setTsH2S] = useLocalStorageState<boolean>('enology_calc_ts_h2s', false);
L676: const [tsVA, setTsVA] = useLocalStorageState<boolean>('enology_calc_ts_va', false);
L677: const [tsDryCap, setTsDryCap] = useLocalStorageState<boolean>('enology_calc_ts_dry_cap', false);
L678: const [tsBitterSeeds, setTsBitterSeeds] = useLocalStorageState<boolean>('enology_calc_ts_bitter_seeds', false);
L679: const [tsCloudy, setTsCloudy] = useLocalStorageState<boolean>('enology_calc_ts_cloudy', false);
L680: const [tsIsRose, setTsIsRose] = useLocalStorageState<boolean>('enology_calc_ts_is_rose', false);
L681: const [postPressActualVol, setPostPressActualVol] = useLocalStorageState<number>('enology_calc_post_press_vol', 96);
L682: const [blendPressPct, setBlendPressPct] = useLocalStorageState<number>('enology_calc_blend_press_pct', 3);
L683: const [glycerinDoseGL, setGlycerinDoseGL] = useLocalStorageState<number>('enology_calc_glycerin_dose', 2.5);
```
