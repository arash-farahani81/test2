import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

function readSafe(relPath: string): string {
  const fullPath = path.join(ROOT, relPath);
  if (!fs.existsSync(fullPath)) {
    return `<!-- File not found: ${relPath} -->`;
  }
  return fs.readFileSync(fullPath, 'utf-8').trim();
}

function stripCommentsAndBlankLines(code: string): string {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .split(/\r?\n/)
    .map((line) => line.replace(/\s+\/\/.*$/, ''))
    .filter((line) => {
      const t = line.trim();
      return t.length > 0 && !t.startsWith('//');
    })
    .join('\n');
}

function extractComponentSkeleton(relPath: string): string {
  const fullPath = path.join(ROOT, relPath);
  const raw = fs.readFileSync(fullPath, 'utf-8');
  const lines = raw.split(/\r?\n/);

  // 1. Extract import statements (compact multi-line lucide-react imports to 1 line)
  const imports: string[] = [];
  let inImport = false;
  let currentImport: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    const hasFrom = trimmed.includes("from '") || trimmed.includes('from "') || /^import\s+['"]/.test(trimmed);
    if (!inImport && trimmed.startsWith('import ')) {
      if (hasFrom) {
        imports.push(trimmed);
      } else {
        inImport = true;
        currentImport = [trimmed];
      }
    } else if (inImport) {
      currentImport.push(trimmed);
      if (hasFrom || trimmed.endsWith(';')) {
        const joined = currentImport.join(' ');
        if (joined.includes('lucide-react')) {
          imports.push(`import { /* icons */ } from 'lucide-react';`);
        } else {
          imports.push(joined);
        }
        inImport = false;
        currentImport = [];
      }
    }
  }

  // 2. Extract top-level TypeScript interface / type declarations (strictly PascalCase identifiers, never JSX attributes)
  const interfaces: string[] = [];
  let inInterface = false;
  let braceDepth = 0;
  let currentInterface: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (
      !inInterface &&
      /^(export\s+)?(interface|type)\s+[A-Z][A-Za-z0-9_]*(\s*=|\s*\{|\s*<)/.test(trimmed)
    ) {
      if (!trimmed.includes('{')) {
        interfaces.push(trimmed);
      } else {
        inInterface = true;
        braceDepth =
          (trimmed.match(/\{/g) || []).length - (trimmed.match(/\}/g) || []).length;
        currentInterface = [line];
        if (braceDepth <= 0) {
          interfaces.push(currentInterface.join('\n'));
          inInterface = false;
          currentInterface = [];
        }
      }
    } else if (inInterface) {
      currentInterface.push(line);
      braceDepth +=
        (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
      if (braceDepth <= 0 || currentInterface.length >= 25) {
        interfaces.push(currentInterface.join('\n'));
        inInterface = false;
        currentInterface = [];
      }
    }
  }

  // 3. Extract state hooks (useState, useLocalStorageState, useFlexibleProtocol)
  const stateLines = lines
    .map((l, idx) => ({ line: l.trim(), lineNo: idx + 1 }))
    .filter(
      ({ line }) =>
        (line.startsWith('const [') || line.startsWith('const {')) &&
        (line.includes('useState') ||
          line.includes('useLocalStorageState') ||
          line.includes('useFlexibleProtocol'))
    )
    .map(({ line, lineNo }) =>
      `L${lineNo}: ${line.length > 140 ? line.slice(0, 137) + '...' : line}`
    );

  return [
    `### \`${relPath}\` (${lines.length} lines)`,
    '```ts',
    '// --- Imports ---',
    ...imports,
    '// --- Props & Types ---',
    ...(interfaces.length > 0 ? interfaces : ['// (No local interfaces)']),
    '// --- State & Protocol Hooks ---',
    ...(stateLines.length > 0 ? stateLines : ['// (Stateless component)']),
    '```'
  ].join('\n');
}

function buildUltraDigest(): string {
  const componentsDir = path.join(ROOT, 'src/components');
  const componentFiles = fs
    .readdirSync(componentsDir)
    .filter((f) => f.endsWith('.tsx'))
    .sort()
    .map((f) => `src/components/${f}`);

  const componentSkeletons = [
    extractComponentSkeleton('src/context/EnologyUiContext.tsx'),
    ...componentFiles.map((rel) => extractComponentSkeleton(rel))
  ].join('\n\n');

  return [
    '# ENOLOGY STUDIO — AI ULTRA DIGEST (LOW-TOKEN ARCHITECTURE & CONTRACTS)',
    `> Generated automatically via \`npm run ai:digest\`. Share this single file with any AI assistant to provide 100% of data contracts, API signatures, and UI component state wiring.`,
    '',
    '## 1. Architecture & Agent Protocol (`AGENTS.md`)',
    readSafe('AGENTS.md'),
    '',
    '## 2. Project Task State (`.agent/TASK_STATE.md`)',
    readSafe('.agent/TASK_STATE.md'),
    '',
    '## 3. Data Models & Zod Schemas (`src/types/tracking.ts` & `src/types/database.ts`)',
    '### `src/types/tracking.ts`',
    '```ts',
    stripCommentsAndBlankLines(readSafe('src/types/tracking.ts')),
    '```',
    '### `src/types/database.ts`',
    '```ts',
    stripCommentsAndBlankLines(readSafe('src/types/database.ts')),
    '```',
    '',
    '## 4. Core Engine API Signatures (`.agent/API_SIGNATURES.md`)',
    readSafe('.agent/API_SIGNATURES.md'),
    '',
    '## 5. UI Component Wiring & State Skeleton (`src/context/EnologyUiContext.tsx` & `src/components/*.tsx` — JSX Omitted)',
    componentSkeletons,
    ''
  ].join('\n');
}

function buildCoreLogicBundle(ultraDigest: string): string {
  const coreFiles = [
    'src/context/EnologyUiContext.tsx',
    'src/data/masterProtocolConfig.ts',
    'src/utils/enologyUtils.ts',
    'src/utils/trackingCalculations.ts',
    'src/utils/enologyTroubleshooting.ts',
    'src/utils/rightNowEngine.ts',
    'src/db/enologyDatabase.ts'
  ];

  const sourceSections = coreFiles
    .map((relPath) => {
      const content = stripCommentsAndBlankLines(readSafe(relPath));
      const lineCount = content.split(/\r?\n/).length;
      return [
        `### \`${relPath}\` (${lineCount} compact lines)`,
        '```ts',
        content,
        '```'
      ].join('\n');
    })
    .join('\n\n');

  return [
    ultraDigest,
    '---',
    '',
    '## 6. Complete Scientific & Database Engine Source Code',
    sourceSections,
    ''
  ].join('\n');
}

function main() {
  const ultraDigest = buildUltraDigest();
  const coreBundle = buildCoreLogicBundle(ultraDigest);

  const ultraPath = path.join(ROOT, 'AI_ULTRA_DIGEST.md');
  const bundlePath = path.join(ROOT, 'AI_CORE_LOGIC_BUNDLE.md');

  fs.writeFileSync(ultraPath, ultraDigest, 'utf-8');
  fs.writeFileSync(bundlePath, coreBundle, 'utf-8');

  const ultraTokens = Math.round(ultraDigest.length / 4);
  const bundleTokens = Math.round(coreBundle.length / 4);

  console.log(
    `[ai:digest] Generated AI_ULTRA_DIGEST.md (${ultraDigest.length.toLocaleString()} chars / ~${ultraTokens.toLocaleString()} tokens)`
  );
  console.log(
    `[ai:digest] Generated AI_CORE_LOGIC_BUNDLE.md (${coreBundle.length.toLocaleString()} chars / ~${bundleTokens.toLocaleString()} tokens)`
  );
}

main();
