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
  // 'known-failure': the folder was already failing in the baseline and still
  // is. Standing debt, not a change, so it is reported without failing the run.
  status: 'pass' | 'regression' | 'new-failure' | 'first-run' | 'known-failure' | 'error';
  exitCode: number | null;
  errors: number;
  warnings: number;
  // Which rules actually objected, worst severity first. Counts alone say a
  // packet failed but not why, so a report full of them cannot be acted on and
  // cannot distinguish one systemic rule from many unrelated defects.
  failedRules?: string[];
  message: string;
}

interface Baseline {
  isLoaded: boolean;
  passes: Set<string>;
  // Every folder the baseline saw, whatever its status. Without this a folder
  // that was already failing is indistinguishable from one seen for the first
  // time, so a static failure would be re-reported as new on every run.
  seen: Set<string>;
}

// Trees the sweep will not descend into. Beyond the obvious build and VCS
// directories, archived and scratch-backup packets are frozen copies kept for
// history: they are never going to be brought back up to current template
// standards, so measuring their freshness reports permanent debt that no one
// can act on and buries the packets that are still worked on.
const SKIPPED_TREES = new Set(['node_modules', '.git', 'z_archive', 'scratch']);

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const skillRoot = path.resolve(scriptDir, '..', '..');
const repoRoot = path.resolve(skillRoot, '..', '..', '..');
const realRepoRoot = fs.realpathSync(repoRoot);
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
  if (!fs.existsSync(resolved)) {
    return resolved;
  }

  const realResolved = fs.realpathSync(resolved);
  const realRelative = path.relative(realRepoRoot, realResolved);
  if (realRelative.startsWith('..') || path.isAbsolute(realRelative)) {
    throw new Error(`Root escapes repository: ${inputPath}`);
  }
  return realResolved;
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
  if (/(^|[^a-z0-9])(planned|planning|draft|pending|not started|not yet|not implemented|todo|queued)([^a-z0-9]|$)/.test(normalized)) return 'planned';
  if (/(^|[^a-z0-9])(in progress|in-progress|active|started|working|partial|ongoing)([^a-z0-9]|$)/.test(normalized)) return 'in-progress';
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
      if (SKIPPED_TREES.has(entry.name)) continue;
      stack.push(path.join(current, entry.name));
    }
  }
  return results.sort();
}

function readBaseline(baselinePath: string | null): Baseline {
  if (!baselinePath) return { isLoaded: false, passes: new Set(), seen: new Set() };
  const resolved = resolveInsideRepo(baselinePath);
  if (!fs.existsSync(resolved)) return { isLoaded: false, passes: new Set(), seen: new Set() };
  const parsed = JSON.parse(fs.readFileSync(resolved, 'utf8')) as { results?: SweepResult[] };
  const results = parsed.results ?? [];
  return {
    isLoaded: true,
    passes: new Set(results.filter((result) => result.status === 'pass').map((result) => result.folder)),
    seen: new Set(results.map((result) => result.folder)),
  };
}

// The validator emits two shapes depending on the schema a packet resolves to:
// older packets report under `entries`, newer ones under `results`. Reading only
// one silently yields no rules for half the fleet, which looks like "no detail
// available" rather than a parsing gap.
interface ValidateRow {
  rule?: string;
  check?: string;
  status?: string;
  severity?: string;
}

interface ValidateOutput {
  passed?: boolean;
  summary?: { errors?: number; warnings?: number };
  results?: ValidateRow[];
  entries?: ValidateRow[];
}

const FAILING_SEVERITIES = new Set(['error', 'warn', 'warning']);

function extractFailedRules(parsed: ValidateOutput): string[] {
  const rows = [...(parsed.results ?? []), ...(parsed.entries ?? [])];
  const errorRules = new Set<string>();
  const warnRules = new Set<string>();
  for (const row of rows) {
    const severity = String(row.status ?? row.severity ?? '').toLowerCase();
    if (!FAILING_SEVERITIES.has(severity)) continue;
    const name = row.rule ?? row.check;
    if (!name) continue;
    (severity === 'error' ? errorRules : warnRules).add(name);
  }
  // Errors first: when a packet trips both, the error is the actionable one.
  return [...[...errorRules].sort(), ...[...warnRules].sort().filter((r) => !errorRules.has(r))];
}

function runValidate(folder: string, baseline: Baseline): SweepResult {
  const relativeFolder = path.relative(repoRoot, folder) || '.';
  const result = spawnSync('bash', [validateScript, folder, '--strict', '--json', '--no-recursive'], {
    cwd: repoRoot,
    encoding: 'utf8',
    env: process.env,
  });
  const exitCode = result.status ?? 1;
  const stdout = result.stdout ?? '';
  try {
    const parsed = JSON.parse(stdout) as ValidateOutput;
    const errors = Number(parsed.summary?.errors ?? 0);
    const warnings = Number(parsed.summary?.warnings ?? 0);
    const failed = exitCode !== 0 || parsed.passed === false;
    const failedRules = extractFailedRules(parsed);
    const wasBaselinePass = baseline.passes.has(relativeFolder);
    if (failed && wasBaselinePass) {
      return { folder: relativeFolder, status: 'regression', exitCode, errors, warnings, failedRules, message: 'strict validation no longer passes' };
    }
    if (failed && !baseline.isLoaded) {
      return { folder: relativeFolder, status: 'first-run', exitCode, errors, warnings, failedRules, message: 'strict validation fails but no baseline exists to compare against (first run, not a regression)' };
    }
    if (failed && baseline.seen.has(relativeFolder)) {
      return { folder: relativeFolder, status: 'known-failure', exitCode, errors, warnings, failedRules, message: 'strict validation still fails, exactly as it did in the baseline' };
    }
    if (failed) {
      return { folder: relativeFolder, status: 'new-failure', exitCode, errors, warnings, failedRules, message: 'strict validation fails and the folder is absent from the baseline entirely' };
    }
    return { folder: relativeFolder, status: 'pass', exitCode, errors, warnings, message: 'strict validation passes' };
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

function tallyRules(results: SweepResult[]): Record<string, number> {
  const counts = new Map<string, number>();
  for (const result of results) {
    for (const rule of result.failedRules ?? []) {
      counts.set(rule, (counts.get(rule) ?? 0) + 1);
    }
  }
  return Object.fromEntries([...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])));
}

function main(): void {
  const options = parseArgs(process.argv.slice(2));
  const roots = options.roots.map(resolveInsideRepo).filter((root) => fs.existsSync(root));
  const baseline = readBaseline(options.baseline);
  const folders = roots.flatMap(discoverSpecFolders);
  const uniqueFolders = [...new Set(folders)];
  const results = uniqueFolders.map((folder) => runValidate(folder, baseline));
  const regressions = results.filter((result) => result.status === 'regression');
  const newFailures = results.filter((result) => result.status === 'new-failure');
  const errors = results.filter((result) => result.status === 'error');
  const firstRun = results.filter((result) => result.status === 'first-run');
  const knownFailures = results.filter((result) => result.status === 'known-failure');
  const payload = {
    roots: roots.map((root) => path.relative(repoRoot, root) || '.'),
    inspected: results.length,
    regressions: regressions.length,
    newFailures: newFailures.length,
    firstRun: firstRun.length,
    knownFailures: knownFailures.length,
    errors: errors.length,
    // How many packets each rule accounts for. One systemic rule and hundreds of
    // unrelated defects produce the same failure count, and only this tells them
    // apart — which decides whether the fix is one change or hundreds.
    ruleTally: tallyRules(results),
    results,
  };
  if (options.format === 'text') {
    console.log(`strict-pass-freshness: inspected=${payload.inspected} regressions=${payload.regressions} newFailures=${payload.newFailures} firstRun=${payload.firstRun} knownFailures=${payload.knownFailures} errors=${payload.errors}`);
    for (const result of results.filter((entry) => entry.status !== 'pass')) {
      console.log(`${result.status}\t${result.folder}\t${result.message}\terrors=${result.errors}\twarnings=${result.warnings}`);
    }
  } else {
    console.log(JSON.stringify(payload, null, 2));
  }
  process.exit(regressions.length > 0 || newFailures.length > 0 || errors.length > 0 ? 1 : 0);
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(2);
}
