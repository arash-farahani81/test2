export type TankId = 'tank-a' | 'tank-b' | 'tank-rose';

export interface FermentationLogEntry {
  id: string;
  tankId: TankId;
  dayNumber: number;
  dateTime: string; // e.g. "۱۴۰۳/۰۷/۲۵ - ۰۸:۰۰"
  timestampMs?: number; // Epoch milliseconds for sub-day velocity & ordering
  stageTitle: string; // e.g. "روز ۲ - تریگر ۱"
  brix: number; // e.g. 20.5
  sg: number; // e.g. 1.083
  tempCap: number; // e.g. 23.5 (°C)
  tempRoom: number; // e.g. 21.0 (°C)
  ph: number; // e.g. 3.52
  ta?: number; // Total Acidity in g/L e.g. 6.8
  freeSO2?: number; // mg/L
  pigeageDone: boolean;
  pigeageCount?: number;
  operationNote?: string;
  isTriggerPoint?: boolean;
  isBenchmark?: boolean; // true if this entry belongs to the ideal benchmark curve
  tempSample?: number; // separate sample temperature at hydrometer reading (Idea 2)
  measuredSG?: number; // raw uncorrected hydrometer reading before temperature correction (Idea 2)
  isDemo?: boolean; // marks sample/seed logs (Idea 5)
  isDeleted?: boolean; // soft-delete flag (Idea 11)
  photoIds?: string[]; // IndexedDB photo attachment IDs (Idea 15)
  quickTags?: string[]; // quick sensory/observation tags (Idea 15)
  batchId?: string;
  updatedAtMs?: number;
  phMeasured?: boolean;
  taMeasured?: boolean;
  freeSO2Measured?: boolean;
  tempRoomMeasured?: boolean;
}
