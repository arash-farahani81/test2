import React, { useMemo } from 'react';
import { Activity, Check, Droplets, Thermometer } from 'lucide-react';
import type {
  CellarEquipmentProfile,
  FermentationLogEntry,
  TankId
} from '../types/index.ts';
import { enologyDb } from '../db/enologyDatabase.ts';
import {
  getEffectiveProtocolPlanForBatch,
  useFlexibleProtocol,
  type DynamicProtocolPlan
} from '../data/masterProtocolConfig.ts';
import {
  calculateAlcoholByVolume,
  calculateRecentLogVelocity,
  getCapTemperatureAlertLevel,
  sortFermentationLogs
} from '../utils/trackingCalculations.ts';
import { useEnologyUi } from '../context/EnologyUiContext.tsx';
import {
  evaluateEquipmentCapabilities,
  type EquipmentProfileInput
} from '../utils/equipmentAdapterEngine.ts';
import { getYeastStrainById } from '../data/yeastStrainsData.ts';

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
  vesselHardwareBadgeFa: string;
  headspaceProtectionBadgeFa: string;
  isStainlessSteel: boolean;
  yeastStrainCode: string;
  yeastStrainNameFa: string;
  yeastTempOptRangeFa: string;
  yeastYanDemandFa: string;
}

export function computeVesselTwinState(params: {
  tankId: TankId;
  logs: FermentationLogEntry[];
  plan?: DynamicProtocolPlan;
  tankCount?: 1 | 2;
  equipmentProfile?: CellarEquipmentProfile | EquipmentProfileInput;
  yeastStrainId?: string;
}): VesselTwinState {
  const isRose = params.tankId === 'tank-rose';
  const strain = getYeastStrainById(params.yeastStrainId, isRose);
  const rawEquip = params.equipmentProfile as Record<string, unknown> | undefined;
  const caps = params.equipmentProfile
    ? evaluateEquipmentCapabilities(params.equipmentProfile as EquipmentProfileInput)
    : null;
  const effectiveTankCount: 1 | 2 =
    params.tankCount ?? caps?.effectiveTankCount ?? 2;
  const redTankMultiplier = !isRose && effectiveTankCount === 1 ? 2 : 1;
  const plan = params.plan ?? getEffectiveProtocolPlanForBatch(null);

  const tankLogs = params.logs.filter(
    (l) => l.tankId === params.tankId && !l.isDeleted
  );
  const realLogs = tankLogs.filter((l) => !l.isBenchmark);
  const sorted = sortFermentationLogs(
    realLogs.length > 0 ? realLogs : tankLogs
  );

  const latest = sorted[sorted.length - 1];
  const currentSG = latest?.sg ?? plan.triggers.initialSG;
  const tempCap = latest?.tempCap ?? (isRose ? 17.0 : 22.0);
  const dayNumber = latest?.dayNumber ?? 0;

  const abvPct = calculateAlcoholByVolume(plan.triggers.initialSG, currentSG);

  let maxCapacityL: number;
  let currentLiquidVolumeL: number;
  let grossVolumeL: number;
  let hasPomaceCap: boolean;

  if (isRose) {
    maxCapacityL = Math.max(20, Math.round(40 * plan.scaleFactor));
    if (dayNumber === 0 && currentSG >= plan.triggers.initialSG - 0.002) {
      currentLiquidVolumeL = plan.volumes.saigneeTotalL;
    } else if (currentSG > 0.995) {
      currentLiquidVolumeL = plan.volumes.roseClarifiedFermentL;
    } else if (dayNumber < 80) {
      currentLiquidVolumeL = plan.volumes.rosePostRackingL;
    } else {
      currentLiquidVolumeL = plan.volumes.roseFinalBottlingL;
    }
    grossVolumeL = currentLiquidVolumeL;
    hasPomaceCap = false;
  } else {
    maxCapacityL = Math.max(
      50,
      Math.round(200 * plan.scaleFactor * redTankMultiplier)
    );
    if (dayNumber === 0 && currentSG >= plan.triggers.initialSG - 0.001) {
      currentLiquidVolumeL =
        Math.round(
          plan.volumes.initialLiquidPerTankL * redTankMultiplier * 10
        ) / 10;
      grossVolumeL =
        Math.round(plan.volumes.crushedMashPerTankL * redTankMultiplier * 10) /
        10;
      hasPomaceCap = true;
    } else if (currentSG > plan.triggers.pressingSG) {
      currentLiquidVolumeL =
        Math.round(
          plan.volumes.redLiquidFermentPerTankL * redTankMultiplier * 10
        ) / 10;
      grossVolumeL =
        Math.round(
          plan.volumes.redMashAfterSaigneePerTankL * redTankMultiplier * 10
        ) / 10;
      hasPomaceCap = true;
    } else if (dayNumber < 10) {
      currentLiquidVolumeL =
        Math.round(plan.volumes.freeRunPerTankL * redTankMultiplier * 10) / 10;
      grossVolumeL = currentLiquidVolumeL;
      hasPomaceCap = false;
    } else if (dayNumber < 21) {
      currentLiquidVolumeL =
        Math.round(plan.volumes.rack1PerTankL * redTankMultiplier * 10) / 10;
      grossVolumeL = currentLiquidVolumeL;
      hasPomaceCap = false;
    } else if (dayNumber < 65) {
      currentLiquidVolumeL =
        Math.round(plan.volumes.rack2PerTankL * redTankMultiplier * 10) / 10;
      grossVolumeL = currentLiquidVolumeL;
      hasPomaceCap = false;
    } else {
      currentLiquidVolumeL =
        Math.round(plan.volumes.finalRedPerTankL * redTankMultiplier * 10) / 10;
      grossVolumeL = currentLiquidVolumeL;
      hasPomaceCap = false;
    }
  }

  const fillRatio = Math.min(0.9, Math.max(0.22, grossVolumeL / maxCapacityL));
  const capHeightRatio = hasPomaceCap ? 0.12 : 0;

  let liquidColorHex: string;
  let liquidHighlightHex: string;
  let colorStageFa: string;

  if (isRose) {
    if (currentSG >= 1.085) {
      liquidColorHex = '#D96B52';
      liquidHighlightHex = '#E8927C';
      colorStageFa = 'مرجانی سانیه';
    } else {
      liquidColorHex = '#E88D72';
      liquidHighlightHex = '#F4B19C';
      colorStageFa = 'سالمونی یاقوتی رُزه';
    }
  } else {
    if (currentSG >= 1.085) {
      liquidColorHex = '#4A153B';
      liquidHighlightHex = '#6B2457';
      colorStageFa = 'بنفش تیره کراش';
    } else if (currentSG > 1.02) {
      liquidColorHex = '#6E1F2F';
      liquidHighlightHex = '#8E2B40';
      colorStageFa = 'گارنت تخمیر فعال';
    } else if (currentSG > 0.995) {
      liquidColorHex = '#7A1C24';
      liquidHighlightHex = '#9B2832';
      colorStageFa = 'یاقوتی سردشت';
    } else {
      liquidColorHex = '#8B1E24';
      liquidHighlightHex = '#AD2B32';
      colorStageFa = 'یاقوتی زلال تثبیت‌شده';
    }
  }

  const velocityInfo = calculateRecentLogVelocity(
    sorted,
    plan.triggers.initialSG
  );
  const dryCeiling = isRose ? 0.992 : 0.995;

  let bubbleCount: number;
  let bubbleDurationSec: number;
  let activityLabelFa: string;

  if (currentSG <= dryCeiling) {
    bubbleCount = 0;
    bubbleDurationSec = 0;
    activityLabelFa = 'آرام (تخمیر کامل)';
  } else if (velocityInfo.recentVelocityPerDay >= 0.018) {
    bubbleCount = 9;
    bubbleDurationSec = 1.4;
    activityLabelFa = 'تخمیر پرشتاب';
  } else if (velocityInfo.recentVelocityPerDay >= 0.008) {
    bubbleCount = 6;
    bubbleDurationSec = 2.3;
    activityLabelFa = 'تخمیر فعال';
  } else {
    bubbleCount = 3;
    bubbleDurationSec = 3.5;
    activityLabelFa = 'فاز لگ / ملایم';
  }

  const airlockBubbleIntervalSec =
    bubbleCount > 0
      ? Math.max(0.7, Math.round(bubbleDurationSec * 0.75 * 10) / 10)
      : 0;
  const sineWaveAmplitudePx =
    bubbleCount >= 8 ? 3.2 : bubbleCount > 0 ? 2.0 : 0;

  const tempAlert = getCapTemperatureAlertLevel(
    tempCap,
    isRose,
    currentSG,
    params.yeastStrainId ? strain.id : undefined
  );

  const labelFa = isRose
    ? 'گالن رُزه (سانیه)'
    : effectiveTankCount === 1
    ? 'مخزن قرمز (یکپارچه)'
    : params.tankId === 'tank-a'
    ? 'مخزن قرمز A (اصلی)'
    : 'مخزن قرمز B (دوقلو)';

  const shortLabelFa = isRose
    ? 'گالن رُزه'
    : effectiveTankCount === 1
    ? 'مخزن قرمز'
    : params.tankId === 'tank-a'
    ? 'مخزن A'
    : 'مخزن B';

  const redConfigStr = String(
    rawEquip?.redTankConfiguration ?? rawEquip?.primaryFermenterType ?? ''
  );
  const agingTypeStr = String(
    rawEquip?.agingVesselType ?? rawEquip?.secondaryVesselType ?? ''
  );
  const inertStr = String(rawEquip?.inertGasSystem ?? '');

  const isStainlessSteel =
    !isRose &&
    (redConfigStr === 'stainless_variable' ||
      (currentSG <= plan.triggers.pressingSG &&
        agingTypeStr === 'stainless_keg'));

  let vesselHardwareBadgeFa: string;
  if (isRose) {
    vesselHardwareBadgeFa = 'گالن شیشهای رُزه سانیه';
  } else if (currentSG <= plan.triggers.pressingSG) {
    const unitL = caps?.agingCarboyUnitL ?? 20;
    const count = Math.max(1, Math.ceil(currentLiquidVolumeL / unitL));
    vesselHardwareBadgeFa =
      agingTypeStr === 'stainless_keg' || unitL === 50
        ? `${count} کگ استیل ${unitL}L`
        : `${count} گالن شیشهای ${unitL}L`;
  } else {
    vesselHardwareBadgeFa =
      redConfigStr === 'stainless_variable'
        ? 'مخزن استیل دربشناور'
        : effectiveTankCount === 1
        ? 'مخزن بزرگ یکپارچه'
        : 'مخزن تخمیر دهانهگشاد';
  }

  const headspaceProtectionBadgeFa =
    inertStr === 'co2_argon_cylinder' || inertStr.includes('cylinder')
      ? 'پرج گاز CO2/آرگون'
      : inertStr === 'dry_ice_only' || inertStr.includes('dry_ice')
      ? 'پوشش یخ خشک'
      : 'لببهلب (Top-up / تیله شیشهای)';

  return {
    tankId: params.tankId,
    labelFa,
    shortLabelFa,
    isRose,
    currentSG,
    tempCap,
    dayNumber,
    abvPct,
    currentLiquidVolumeL,
    grossVolumeL,
    maxCapacityL,
    fillRatio,
    hasPomaceCap,
    capHeightRatio,
    liquidColorHex,
    liquidHighlightHex,
    colorStageFa,
    velocityPerDay: velocityInfo.recentVelocityPerDay,
    bubbleCount,
    bubbleDurationSec,
    airlockBubbleIntervalSec,
    sineWaveAmplitudePx,
    activityLabelFa,
    tempAlert,
    vesselHardwareBadgeFa,
    headspaceProtectionBadgeFa,
    isStainlessSteel,
    yeastStrainCode: strain.code,
    yeastStrainNameFa: strain.nameFa,
    yeastTempOptRangeFa: `${strain.tempOptMinC}–${strain.tempOptMaxC}°C`,
    yeastYanDemandFa:
      strain.yanDemandLevel === 'low'
        ? 'کمنیاز N'
        : strain.yanDemandLevel === 'high'
        ? 'پرنیاز N'
        : 'متوسط N'
  };
}

const BUBBLE_X_POSITIONS = [26, 36, 46, 54, 64, 72, 31, 50, 68];

export const LivingTankVisualTwin: React.FC<{
  activeTankId?: TankId;
  onSelectTank?: (tankId: TankId) => void;
  compact?: boolean;
}> = ({ activeTankId, onSelectTank, compact = false }) => {
  const {
    activeBatch,
    activeBatchId,
    tankCount,
    globalTankSelection,
    setGlobalTankSelection,
    dataVersion,
    equipmentProfile,
    equipmentCapabilities,
    selectedYeastByTank
  } = useEnologyUi();
  void equipmentCapabilities;
  const { plan } = useFlexibleProtocol();

  const effectivePlan = useMemo(
    () => getEffectiveProtocolPlanForBatch(activeBatch, plan),
    [activeBatch, plan]
  );

  const vesselIds: TankId[] = useMemo(() => {
    if (activeBatch?.targetStyle === 'rose') return ['tank-rose'];
    const base: TankId[] =
      tankCount === 1 ? ['tank-a'] : ['tank-a', 'tank-b'];
    if (equipmentCapabilities.produceRoseSaignee !== false) {
      base.push('tank-rose');
    }
    return base;
  }, [
    activeBatch?.targetStyle,
    tankCount,
    equipmentCapabilities.produceRoseSaignee
  ]);

  const vessels = useMemo(
    () =>
      vesselIds.map((vId) => {
        const vLogs = enologyDb.getLogs(vId, false, activeBatchId);
        return computeVesselTwinState({
          tankId: vId,
          logs: vLogs,
          plan: effectivePlan,
          tankCount,
          equipmentProfile,
          yeastStrainId: selectedYeastByTank[vId]
        });
      }),
    [
      vesselIds,
      activeBatchId,
      effectivePlan,
      tankCount,
      dataVersion,
      equipmentProfile,
      selectedYeastByTank
    ]
  );

  return (
    <div className="rounded-2xl border border-line bg-surface p-3 sm:p-4 space-y-3 font-['Vazirmatn',sans-serif]">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <Droplets className="w-4 h-4 text-wine shrink-0" />
          <h4 className="text-xs sm:text-sm font-bold text-ink">
            دوقلوی دیجیتال مخازن (وضعیت زنده سرداب)
          </h4>
        </div>
        <span className="text-xs text-ink-soft">
          برای تغییر مخزن فعال، روی مخزن کلیک کنید
        </span>
      </div>

      <div
        className={`grid gap-2.5 ${
          vessels.length === 1
            ? 'grid-cols-1'
            : vessels.length === 2
            ? 'grid-cols-2'
            : 'grid-cols-2 sm:grid-cols-3'
        }`}
      >
        {vessels.map((vessel) => {
          const isSelected =
            activeTankId === vessel.tankId ||
            globalTankSelection === vessel.tankId ||
            (globalTankSelection === 'both-red' &&
              vessel.tankId !== 'tank-rose');

          const vesselTopY = 18;
          const vesselBottomY = 114;
          const vesselInteriorH = vesselBottomY - vesselTopY;
          const totalFillH = Math.round(vesselInteriorH * vessel.fillRatio);
          const liquidTopY = vesselBottomY - totalFillH;
          const capH = vessel.hasPomaceCap
            ? Math.max(10, Math.round(vesselInteriorH * vessel.capHeightRatio))
            : 0;

          const clipId = `vessel-clip-${vessel.tankId}-${compact ? 'sm' : 'lg'}`;
          const gradId = `vessel-grad-${vessel.tankId}-${compact ? 'sm' : 'lg'}`;

          const tempTextColor =
            vessel.tempAlert === 'danger'
              ? 'text-danger'
              : vessel.tempAlert === 'warning' || vessel.tempAlert === 'caution'
              ? 'text-warn'
              : 'text-ok';

          return (
            <button
              key={vessel.tankId}
              type="button"
              onClick={() => {
                setGlobalTankSelection(vessel.tankId);
                onSelectTank?.(vessel.tankId);
              }}
              className={`text-right rounded-xl border p-2.5 sm:p-3 transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                isSelected
                  ? 'border-wine bg-paper shadow-sm ring-1 ring-wine/30'
                  : 'border-line bg-surface hover:bg-paper/60'
              }`}
            >
              {/* Top Title Row */}
              <div className="flex items-center justify-between gap-1.5 w-full">
                <span className="text-xs font-bold text-ink truncate">
                  {vessel.labelFa}
                </span>
                {isSelected && (
                  <span className="px-1.5 py-0.5 rounded-full bg-wine text-white text-xs font-bold flex items-center gap-0.5 shrink-0">
                    <Check className="w-3 h-3" />
                    <span>فعال</span>
                  </span>
                )}
              </div>

              {/* Center Visual Twin SVG + Metrics */}
              <div className="flex items-center gap-2.5 w-full">
                <svg
                  viewBox="0 0 100 130"
                  className={`${
                    compact ? 'h-24 w-20' : 'h-32 w-24'
                  } shrink-0 mx-auto`}
                  role="img"
                  aria-label={`نمای مخزن ${vessel.labelFa}`}
                >
                  <defs>
                    <clipPath id={clipId}>
                      {vessel.isRose ? (
                        <path d="M 38 18 L 62 18 L 66 36 Q 82 48 82 68 L 82 104 Q 82 114 72 114 L 28 114 Q 18 114 18 104 L 18 68 Q 18 48 34 36 Z" />
                      ) : (
                        <rect
                          x="16"
                          y="18"
                          width="68"
                          height="96"
                          rx="10"
                          ry="10"
                        />
                      )}
                    </clipPath>
                    <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={vessel.liquidHighlightHex} />
                      <stop offset="100%" stopColor={vessel.liquidColorHex} />
                    </linearGradient>
                  </defs>

                  {/* Glass Airlock Bubbler & Lid Neck (Golden Idea 4) */}
                  <g data-testid="vessel-airlock-bubbler-svg">
                    <rect
                      x="44"
                      y="9"
                      width="12"
                      height="9"
                      rx="2.5"
                      fill="#e4dccd"
                      stroke="#6b625a"
                      strokeWidth="1.4"
                    />
                    <path
                      d="M 50 18 L 50 9 C 50 4 56 4 56 8 C 56 12 44 12 44 6 L 44 3"
                      fill="none"
                      stroke="#6b625a"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                    {vessel.bubbleCount > 0 && (
                      <circle cx="44" cy="4" r="2.2" fill="#6e1f2f">
                        <animate
                          attributeName="cy"
                          values="8;1"
                          dur={`${vessel.airlockBubbleIntervalSec}s`}
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          values="0.9;0"
                          dur={`${vessel.airlockBubbleIntervalSec}s`}
                          repeatCount="indefinite"
                        />
                      </circle>
                    )}
                  </g>

                  {/* Clipped Interior Fill (Liquid + Optional Pomace Cap + Rising Bubbles) */}
                  <g clipPath={`url(#${clipId})`}>
                    {/* Background inside vessel */}
                    <rect
                      x="14"
                      y="16"
                      width="72"
                      height="100"
                      fill="#fbf9f4"
                    />

                    {/* Liquid Layer with Sine-Wave Surface */}
                    <path
                      d={`M 16 ${liquidTopY} Q 33 ${
                        liquidTopY - vessel.sineWaveAmplitudePx
                      } 50 ${liquidTopY} T 84 ${liquidTopY} L 84 120 L 16 120 Z`}
                      fill={`url(#${gradId})`}
                    />
                    <path
                      d={`M 18 ${liquidTopY} Q 34 ${
                        liquidTopY - vessel.sineWaveAmplitudePx
                      } 50 ${liquidTopY} T 82 ${liquidTopY}`}
                      fill="none"
                      stroke={vessel.liquidHighlightHex}
                      strokeWidth="1.5"
                    />

                    {/* Floating Pomace Cap Layer for Red Maceration */}
                    {vessel.hasPomaceCap && (
                      <g>
                        <rect
                          x="14"
                          y={liquidTopY}
                          width="72"
                          height={capH}
                          fill="#3B1026"
                        />
                        <line
                          x1="16"
                          y1={liquidTopY + capH}
                          x2="84"
                          y2={liquidTopY + capH}
                          stroke="#f6f1e7"
                          strokeWidth="1"
                          strokeDasharray="3 2"
                        />
                        <text
                          x="50"
                          y={liquidTopY + Math.min(capH - 3, 10)}
                          textAnchor="middle"
                          fill="#f6f1e7"
                          fontSize="7.5"
                          fontWeight="bold"
                        >
                          کلاهک پوست
                        </text>
                      </g>
                    )}

                    {/* Rising CO2 Bubbles proportional to dSG/dt */}
                    {vessel.bubbleCount > 0 &&
                      BUBBLE_X_POSITIONS.slice(0, vessel.bubbleCount).map(
                        (bx, idx) => {
                          const startY = vesselBottomY - 6;
                          const endY = liquidTopY + capH + 4;
                          const delaySec = (
                            (idx * vessel.bubbleDurationSec) /
                            vessel.bubbleCount
                          ).toFixed(2);
                          return (
                            <circle
                              key={idx}
                              cx={bx}
                              cy={startY}
                              r={idx % 2 === 0 ? 2.2 : 1.6}
                              fill="#fbf9f4"
                              opacity="0.75"
                            >
                              <animate
                                attributeName="cy"
                                from={startY}
                                to={Math.max(vesselTopY + 6, endY)}
                                dur={`${vessel.bubbleDurationSec}s`}
                                begin={`${delaySec}s`}
                                repeatCount="indefinite"
                              />
                              <animate
                                attributeName="opacity"
                                values="0;0.85;0"
                                dur={`${vessel.bubbleDurationSec}s`}
                                begin={`${delaySec}s`}
                                repeatCount="indefinite"
                              />
                            </circle>
                          );
                        }
                      )}
                  </g>

                  {/* Vessel Glass/Steel Outline */}
                  {vessel.isRose ? (
                    <path
                      d="M 38 18 L 62 18 L 66 36 Q 82 48 82 68 L 82 104 Q 82 114 72 114 L 28 114 Q 18 114 18 104 L 18 68 Q 18 48 34 36 Z"
                      fill="none"
                      stroke={isSelected ? '#6e1f2f' : '#6b625a'}
                      strokeWidth="2.2"
                    />
                  ) : (
                    <rect
                      x="16"
                      y="18"
                      width="68"
                      height="96"
                      rx="10"
                      ry="10"
                      fill="none"
                      stroke={isSelected ? '#6e1f2f' : '#6b625a'}
                      strokeWidth="2.2"
                    />
                  )}

                  {/* Volume Badge inside Bottom of Vessel */}
                  <rect
                    x="24"
                    y="94"
                    width="52"
                    height="15"
                    rx="4"
                    fill="#1f1a17"
                    fillOpacity="0.78"
                  />
                  <text
                    x="50"
                    y="104.5"
                    textAnchor="middle"
                    fill="#fbf9f4"
                    fontSize="9"
                    fontWeight="bold"
                  >
                    {vessel.currentLiquidVolumeL} L
                  </text>
                </svg>

                {/* Live Telemetry Readout Column */}
                <div className="flex-1 min-w-0 space-y-1.5 text-xs">
                  <span className="inline-block px-2 py-0.5 rounded-md bg-surface border border-line text-ink-soft font-bold truncate max-w-full">
                    {vessel.colorStageFa}
                  </span>

                  <div className="ltr-metric font-bold text-ink block">
                    SG {vessel.currentSG.toFixed(3)}
                  </div>

                  <div
                    className={`ltr-metric font-bold flex items-center gap-1 ${tempTextColor}`}
                  >
                    <Thermometer className="w-3.5 h-3.5 shrink-0" />
                    <span>{vessel.tempCap.toFixed(1)}°C</span>
                  </div>

                  {!compact && (
                    <>
                      <div className="ltr-metric text-ink-soft font-medium block">
                        ABV {vessel.abvPct.toFixed(1)}%
                      </div>
                      <div className="flex items-center gap-1 text-ink-soft font-medium">
                        <Activity className="w-3.5 h-3.5 text-wine shrink-0" />
                        <span className="truncate">{vessel.activityLabelFa}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div
                data-testid={`vessel-hardware-badge-${vessel.tankId}`}
                className="text-xs text-ink-soft pt-1 border-t border-line w-full truncate"
              >
                {vessel.vesselHardwareBadgeFa} • {vessel.headspaceProtectionBadgeFa}
              </div>
              <div
                data-testid={`vessel-yeast-badge-${vessel.tankId}`}
                className="text-xs font-medium text-wine mt-0.5 w-full truncate"
              >
                {`مخمر: ${vessel.yeastStrainCode} (${vessel.yeastTempOptRangeFa} • ${vessel.yeastYanDemandFa})`}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
