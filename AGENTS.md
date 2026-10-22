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
