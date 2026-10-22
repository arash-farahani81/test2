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
  grapeVariety: string; // e.g. "انگور رشه سردشت (Rasha Sardasht)"
  vintageYear: number; // e.g. 1403
  initialWeightKg: number; // e.g. 400
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
  compoundName: string; // e.g. "پتاسیم متابی‌سولفیت (KMS)"
  pubchemCid?: number;
  amount: number; // e.g. 18
  unit: 'g' | 'g/hL' | 'mg/L' | 'mL' | 'kg';
  purpose: string; // e.g. "مهار باکتری‌های وحشی و اکسیداسیون در روز اول"
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
  targetAnalyte: string; // e.g. "Free SO2", "Tartaric Acid", "Malic / Lactic Acid"
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

// ============================================================================
// ZOD SCHEMAS FOR PRODUCTION DATA VALIDATION
// ============================================================================

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


