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
