#!/usr/bin/env node
// ---------------------------------------------------------------
// MODULE: Strict Pass Freshness Sweep
// ---------------------------------------------------------------
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

type Format = 'json' | 'text';

interface Options {
  roots: string[];
  baseline: string | null;
  format: Format;
}

interface SweepResult {
  folder: string;
  // 'first-run': the folder currently fails but no baseline exists to compare
  // against, so nothing has actually regressed (see runValidate()).
  status: 'pass' | 'regression' | 'first-run' | 'error';
  exitCode: number | null;
  errors: number;
  warnings: number;
  message: string;
}

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const skillRoot = path.resolve(scriptDir, '..', '..');
const repoRoot = path.resolve(skillRoot, '..', '..', '..');
const validateScript = process.env.SPECKIT_VALIDATE_SCRIPT
  ? path.resolve(process.env.SPECKIT_VALIDATE_SCRIPT)
  : path.join(skillRoot, 'scripts', 'spec', 'validate.sh');

function parseArgs(argv: string[]): Options {
  const options: Options = { roots: [], baseline: null, format: 'json' };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--roots') {
      const value = argv[index + 1] ?? '';
      index += 1;
      options.roots.push(...value.split(',').map((entry) => entry.trim()).filter(Boolean));
      continue;
    }
    if (arg.startsWith('--roots=')) {
      options.roots.push(...arg.slice('--roots='.length).split(',').map((entry) => entry.trim()).filter(Boolean));
      continue;
    }
    if (arg === '--baseline') {
      options.baseline = argv[index + 1] ?? null;
      index += 1;
      continue;
    }
    if (arg.startsWith('--baseline=')) {
      options.baseline = arg.slice('--baseline='.length);
      continue;
    }
    if (arg === '--format') {
      const value = argv[index + 1] as Format | undefined;
      index += 1;
      if (value === 'json' || value === 'text') options.format = value;
      continue;
    }
    if (arg.startsWith('--format=')) {
      const value = arg.slice('--format='.length);
      if (value === 'json' || value === 'text') options.format = value;
      continue;
    }
    if (arg === '--help' || arg === '-h') {
      console.log('Usage: strict-pass-freshness.ts --roots <path[,path...]> [--baseline report.json] [--format json|text]');
      process.exit(0);
    }
    throw new Error(`Unknown argument: ${arg}`);
  }
  if (options.roots.length === 0) {
    options.roots = ['.opencode/specs', 'specs'].filter((candidate) => fs.existsSync(path.resolve(repoRoot, candidate)));
  }
  return options;
}

function resolveInsideRepo(inputPath: string): string {
  const resolved = path.resolve(repoRoot, inputPath);
  const relative = path.relative(repoRoot, resolved);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error(`Root escapes repository: ${inputPath}`);
  }
  return resolved;
}

function classifyStatus(rawValue: string): 'planned' | 'in-progress' | 'complete' | 'unknown' {
  const normalized = rawValue
    .replace(/\*\*|`/g, '')
    .trim()
    .toLowerCase()
    .replace(/[\s.,;:!]+$/g, '')
    .replace(/\s+/g, ' ');
  if (!normalized) return 'unknown';
  // Cross-reference: status-classifier.sh's classify_status() keeps a byte-equivalent
  // complete/in-progress/planned word list. Update both when adding a status word.
  if (/(^|[^a-z0-9])(complete|completed|done|shipped|delivered|finished|closed)([^a-z0-9]|$)/.test(normalized)) return 'complete';
  // "implemented"/"implementing" also count as complete, but NOT when part of the
  // "not implemented" / "not yet implemented" phrasing the planned bucket below already
  // owns (real Status values use both forms) — checked separately so this exclusion
  // cannot suppress the other complete-bucket words.
  if (
    /(^|[^a-z0-9])(implemented|implementing)([^a-z0-9]|$)/.test(normalized) &&
    !/(^|[^a-z0-9])not\s+(yet\s+)?(implemented|implementing)([^a-z0-9]|$)/.test(normalized)
  ) {
    return 'complete';
  }
  if (/(^|[^a-z0-9])(in progress|in-progress|active|started|working|partial|ongoing)([^a-z0-9]|$)/.test(normalized)) return 'in-progress';
  if (/(^|[^a-z0-9])(planned|planning|draft|pending|not started|not yet|not implemented|todo|queued)([^a-z0-9]|$)/.test(normalized)) return 'planned';
  return 'unknown';
}

function extractStatus(filePath: string): string {
  if (!fs.existsSync(filePath)) return '';
  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    if (!/^\s*\|/.test(line)) continue;
    const cells = line.split('|').map((cell) => cell.replace(/\*\*|`/g, '').trim());
    if (cells.length >= 4 && cells[1].toLowerCase() === 'status') {
      return cells[2];
    }
  }
  return '';
}

function isCompletionClaimingFolder(folder: string): boolean {
  const summary = path.join(folder, 'implementation-summary.md');
  if (!fs.existsSync(summary)) return false;
  const status = extractStatus(summary);
  if (classifyStatus(status) === 'complete') return true;
  const content = fs.readFileSync(summary, 'utf8');
  return /completion_pct:\s*100\b/.test(content) || /\|\s*\*\*Completed\*\*\s*\|\s*(yes|complete|completed)\s*\|/i.test(content);
}

function discoverSpecFolders(root: string): string[] {
  const results: string[] = [];
  const stack = [root];
  while (stack.length > 0) {
    const current = stack.pop() as string;
    let entries: fs.Dirent[] = [];
    try {
      entries = fs.readdirSync(current, { withFileTypes: true });
    } catch {
      continue;
    }
    const hasSpec = fs.existsSync(path.join(current, 'spec.md'));
    const hasImplementation = fs.existsSync(path.join(current, 'implementation-summary.md'));
    if ((hasSpec || hasImplementation) && isCompletionClaimingFolder(current)) {
      results.push(current);
    }
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      if (entry.name === 'node_modules' || entry.name === '.git') continue;
      stack.push(path.join(current, entry.name));
    }
  }
  return results.sort();
}

function readBaseline(baselinePath: string | null): Set<string> {
  if (!baselinePath) return new Set();
  const resolved = resolveInsideRepo(baselinePath);
  if (!fs.existsSync(resolved)) return new Set();
  const parsed = JSON.parse(fs.readFileSync(resolved, 'utf8')) as { results?: SweepResult[] };
  return new Set((parsed.results ?? []).filter((result) => result.status === 'pass').map((result) => result.folder));
}

function runValidate(folder: string, baselinePasses: Set<string>): SweepResult {
  const relativeFolder = path.relative(repoRoot, folder) || '.';
  const result = spawnSync('bash', [validateScript, folder, '--strict', '--json', '--no-recursive'], {
    cwd: repoRoot,
    encoding: 'utf8',
    env: process.env,
  });
  const exitCode = result.status ?? 1;
  const stdout = result.stdout ?? '';
  try {
    const parsed = JSON.parse(stdout) as { passed?: boolean; summary?: { errors?: number; warnings?: number } };
    const errors = Number(parsed.summary?.errors ?? 0);
    const warnings = Number(parsed.summary?.warnings ?? 0);
    const failed = exitCode !== 0 || parsed.passed === false;
    // No baseline at all (no --baseline flag, missing file, or an empty
    // results array) means there is nothing to regress from — a current
    // failure there is a first-run/unknown result, not a regression.
    const hasBaseline = baselinePasses.size > 0;
    const wasBaselinePass = hasBaseline && baselinePasses.has(relativeFolder);
    if (failed && wasBaselinePass) {
      return { folder: relativeFolder, status: 'regression', exitCode, errors, warnings, message: 'strict validation no longer passes' };
    }
    if (failed && !hasBaseline) {
      return { folder: relativeFolder, status: 'first-run', exitCode, errors, warnings, message: 'strict validation fails but no baseline exists to compare against (first run, not a regression)' };
    }
    return { folder: relativeFolder, status: 'pass', exitCode, errors, warnings, message: 'strict validation passes or was not a baseline pass' };
  } catch {
    return {
      folder: relativeFolder,
      status: 'error',
      exitCode,
      errors: 1,
      warnings: 0,
      message: `validate.sh --json returned malformed output: ${(stdout || result.stderr || '').trim().slice(0, 200)}`,
    };
  }
}

function main(): void {
  const options = parseArgs(process.argv.slice(2));
  const roots = options.roots.map(resolveInsideRepo).filter((root) => fs.existsSync(root));
  const baselinePasses = readBaseline(options.baseline);
  const folders = roots.flatMap(discoverSpecFolders);
  const uniqueFolders = [...new Set(folders)];
  const results = uniqueFolders.map((folder) => runValidate(folder, baselinePasses));
  const regressions = results.filter((result) => result.status === 'regression');
  const errors = results.filter((result) => result.status === 'error');
  const firstRun = results.filter((result) => result.status === 'first-run');
  const payload = {
    roots: roots.map((root) => path.relative(repoRoot, root) || '.'),
    inspected: results.length,
    regressions: regressions.length,
    firstRun: firstRun.length,
    errors: errors.length,
    results,
  };
  if (options.format === 'text') {
    console.log(`strict-pass-freshness: inspected=${payload.inspected} regressions=${payload.regressions} firstRun=${payload.firstRun} errors=${payload.errors}`);
    for (const result of results.filter((entry) => entry.status !== 'pass')) {
      console.log(`${result.status}\t${result.folder}\t${result.message}\terrors=${result.errors}\twarnings=${result.warnings}`);
    }
  } else {
    console.log(JSON.stringify(payload, null, 2));
  }
  process.exit(regressions.length > 0 || errors.length > 0 ? 1 : 0);
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(2);
}
