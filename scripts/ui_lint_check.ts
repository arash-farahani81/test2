import fs from 'node:fs';
import path from 'node:path';

const ROOT_DIR = process.cwd();
const TARGET_FILES: string[] = [
  path.join(ROOT_DIR, 'src', 'App.tsx'),
  ...fs
    .readdirSync(path.join(ROOT_DIR, 'src', 'components'))
    .filter((f) => f.endsWith('.tsx'))
    .map((f) => path.join(ROOT_DIR, 'src', 'components', f))
];

const RULES: Array<{ name: string; regex: RegExp }> = [
  {
    name: 'Arbitrary pixel font sizes (text-[Npx])',
    regex: /\btext-\[\d+px\]/
  },
  {
    name: 'Over-heavy font weights (font-black / font-extrabold)',
    regex: /\bfont-(?:black|extrabold)\b/
  },
  {
    name: 'Decorative emoji characters in TSX',
    regex: /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u
  },
  {
    name: 'Banned meta-architecture strings',
    regex: /(?:معماری ۵ تبی|سازماندهی ۳ گروهی|سازمان‌دهی ۳ گروهی|دسترسی سریع کارگاهی)/
  }
];

let violationCount = 0;

for (const filePath of TARGET_FILES) {
  if (!fs.existsSync(filePath)) continue;
  const relPath = path.relative(ROOT_DIR, filePath);
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split(/\r?\n/);

  lines.forEach((line, idx) => {
    for (const rule of RULES) {
      if (rule.regex.test(line)) {
        console.error(
          `[UI LINT ERROR] ${relPath}:${idx + 1} — ${rule.name}\n  > ${line.trim()}`
        );
        violationCount++;
      }
    }
  });
}

if (violationCount > 0) {
  console.error(`\nUI Lint Check failed with ${violationCount} violation(s).`);
  process.exit(1);
} else {
  console.log('UI Lint Check passed (0 violations).');
}
