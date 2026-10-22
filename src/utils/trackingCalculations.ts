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

/**
 * Pure calculation helpers for enological tracking and analytics
 */

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

/**
 * Standard non-linear high-gravity enological equation for Alcohol By Volume (ABV % v/v)
 * Accounts for density shifts and glycerol production in 12-15% ABV wine musts:
 * ABV (% v/v) = ((76.08 * (OG - FG)) / (1.775 - OG)) * (FG / 0.794)
 */
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

/**
 * Converts Persian/Arabic numerals in a string to ASCII digits and extracts hour fraction if present
 */
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

/**
 * Chronological comparator for FermentationLogEntry items, handling multiple same-day logs safely
 */
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
    if (a.sg !== b.sg) return b.sg - a.sg; // Higher SG is earlier in fermentation on the same day
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
  healthScore: number; // 0 to 100
  detailedDescription: string;
  recommendedAction: string;
  parameters: LogParameterHealth[];
}

/**
 * Smart Diagnostic Engine based on Rasha Sardasht Master Protocol benchmarks
 */
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

  // 1. SG Analysis (using dynamic triggers & practical tolerance window)
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

  // 2. Stage-Aware Temperature Analysis
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

  // 3. pH Analysis
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

  // 4. Titratable Acidity (TA) Analysis (when present)
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

  // 5. Free SO2 Analysis (when present)
  if (log.freeSO2 !== undefined && log.freeSO2 >= 0) {
    const effectivePhForSo2 = log.phMeasured === false ? (isRose ? plan.params.targetRosePH : plan.params.targetRedPH) : ph;
    const pHTarget = getContinuousTargetFreeSO2ByPH(effectivePhForSo2, isRose);
    // Keep reference to getTargetFreeSO2ByPH so all imports remain utilized
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

  // Overall Diagnosis & Recommendation Construction
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

  // Stage-specific tailored descriptions
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

    // Tightened normalization: 0.025 SG deviation = 1.0 error unit; 3.0°C temp deviation = 1.0 error unit
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
  // Blend average deviation with dataset-wide maximum deviation so a single-day catastrophic spike immediately lowers alignmentScore
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

/**
 * Helper to get absolute substrate depletion factor for a given SG
 */
function getSubstrateDepletionFactor(sg: number): number {
  if (sg <= 1.005) return 0.65;
  if (sg <= 1.030) return 0.85;
  return 1.0;
}

/**
 * Computes recent SG drop velocity (SG units per day) from sorted logs while preventing
 * division-by-zero on multiple same-day logs via timestampMs, parsed hours, or previous-day lookback.
 */
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

    // Priority 1: Both logs have timestampMs
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

    // Priority 2: Both logs have valid parsed hours in dateTime
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

    // Priority 3: If same dayNumber without elapsed hours, look back to previous day
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

    // Priority 4: Fallback to dayNumber difference
    const daySpan = Math.max(0.2, latestLog.dayNumber - prevLog.dayNumber);
    const sgDrop = Math.max(0, prevLog.sg - latestLog.sg);
    return {
      recentVelocityPerDay: sgDrop / daySpan,
      hasObservedVelocity: true,
      referenceSG: prevLog.sg
    };
  }

  // Single log on Day > 0
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

/**
 * Convenience helper to compute recent SG drop velocity (SG/day) from unsorted or sorted logs
 */
export function calculateVelocity(logs: FermentationLogEntry[], tankId?: TankId): number {
  const scoped = tankId ? logs.filter((l) => l.tankId === tankId) : logs;
  const sorted = sortFermentationLogs(scoped);
  const { recentVelocityPerDay } = calculateRecentLogVelocity(sorted);
  return Math.round(recentVelocityPerDay * 10000) / 10000;
}

/**
 * Predictive Engine for Estimating Remaining Fermentation Days
 * Analyzes SG drop velocity, temperature Arrhenius kinetics, and sugar depletion curves
 * without double-counting temperature/depletion slowdowns on observed velocity.
 */
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

  // Fallback default if no logs exist
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

  // If already at or below target SG
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

  // 1. Calculate recent SG drop velocity per day (protected against same-day division by zero)
  const { recentVelocityPerDay, hasObservedVelocity, referenceSG } = calculateRecentLogVelocity(
    filteredLogs,
    fallbackInitialSG
  );

  // 2. Substrate depletion factor (Michaelis-Menten kinetics)
  const depletionFactor = getSubstrateDepletionFactor(currentSG);

  // 3. Non-Linear Cardinal Temperature Kinetic Factor
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

  // 4. Theoretical baseline velocity strictly receives absolute F_depletion and K_temp
  const velBaseline = 0.0125 * depletionFactor * tempKineticFactor;

  // 5. Avoid double-counting on observed velocity:
  // Only apply a relative depletion factor if currentSG just crossed into a lower threshold zone (< 1.030 or < 1.005)
  // compared to the reference reading, then blend 70% observed velocity + 30% theoretical baseline velocity.
  const prevDepletionFactor = getSubstrateDepletionFactor(referenceSG);
  const relativeDepletion =
    depletionFactor < prevDepletionFactor ? depletionFactor / prevDepletionFactor : 1.0;

  const effectiveVelocityPerDay = hasObservedVelocity
    ? Math.max(0.001, 0.7 * (recentVelocityPerDay * relativeDepletion) + 0.3 * velBaseline)
    : Math.max(0.001, velBaseline);

  // Estimated remaining days
  const rawEstDays = sgRemaining / effectiveVelocityPerDay;
  const estimatedRemainingDays = Math.round(rawEstDays * 10) / 10;
  const estimatedRemainingHours = Math.round(estimatedRemainingDays * 24);

  // Kinetic status classification with Lag Phase & Noise Guard
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

  // Temperature impact description
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

  // Generate candidate SG transpositions from measuredSG formatted to 3 decimals 1.d1d2d3
  const formatted = measuredSG.toFixed(3);
  const candidates: number[] = [];
  const dotIdx = formatted.indexOf('.');
  if (dotIdx !== -1 && formatted.length >= dotIdx + 4) {
    const intPart = formatted.slice(0, dotIdx);
    const d1 = formatted[dotIdx + 1];
    const d2 = formatted[dotIdx + 2];
    const d3 = formatted[dotIdx + 3];
    const swappedStrings = [
      `${intPart}.${d1}${d3}${d2}`, // swap d2 and d3 (e.g., 1.080 <-> 1.008)
      `${intPart}.${d2}${d1}${d3}`, // swap d1 and d2
      `${intPart}.${d3}${d2}${d1}` // swap d1 and d3
    ];
    for (const s of swappedStrings) {
      const val = Number(s);
      if (Number.isFinite(val) && Math.abs(val - measuredSG) > 0.0005 && !candidates.includes(val)) {
        candidates.push(val);
      }
    }
  }

  // Case A: Unexpected SG Jump Up
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

  // Case B: Extreme SG Plunge
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

  // Case C: Cap Temp Typo
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




