// ───────────────────────────────────────────────────────────────────
// MODULE: Check Source / Dist Alignment
// ───────────────────────────────────────────────────────────────────
//
// Investigation history:
// Investigated on 2026-03-19:
// - runtime/dist/lib/utils/retry.js traced to deleted source
//   runtime/lib/utils/retry.ts, removed in commit 5e49e272 on
//   2026-03-07. No matching source remains, so the stale dist
//   artifact set was removed.
// - runtime/dist/lib/eval/hydra-baseline.js traced to deleted
//   source runtime/lib/eval/hydra-baseline.ts, removed in commit
//   8bb6eb62 on 2026-03-13. Its logic was renamed/refactored into
//   runtime/lib/eval/memory-state-baseline.ts, so the stale
//   pre-rename dist artifact set was removed.
//
// Broadened dist alignment scan (2026-04-30):
// - The previous DIST_TARGETS set covered only `dist/lib` and `scripts/dist`,
//   so orphans elsewhere (e.g. `dist/tests/search-quality/harness.js` after
//   its source moved to `stress-test/search-quality/harness.ts`) were never
//   flagged. The targets now include every runtime-critical dist subtree:
//   skill_advisor, handlers, formatters, scripts, tools, code_graph, hooks,
//   matrix_runners, schemas, stress_test, tests, core, configs, api, utils.
//   Each target maps dist `*.js` back to the matching source `.ts` directory.
// - The stale `dist/tests/search-quality/harness.js` was removed in this
//   packet; the broadened scan ensures the same drift surfaces a
//   violation rather than going silent.

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import * as fs from 'fs';
import * as path from 'path';
import { spawnSync } from 'node:child_process';
import { dirnameFromImportMeta, isMainModule } from '../lib/esm-entry.js';
import { resolvePackageRoot } from '@spec-kit/shared/workspace/package-root.js';

const moduleDir = dirnameFromImportMeta(import.meta.url);

// ───────────────────────────────────────────────────────────────────
// 2. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

interface AllowlistException {
  file: string;
  reason: string;
  owner: string;
  date: string;
}

interface OrphanedDistFile {
  distFile: string;
  expectedSource: string;
  allowlistEntry?: AllowlistException;
}

interface DistTarget {
  label: string;
  distRoot: string;
  sourceRoot: string;
}

/** Package entry and recovery command checked by the alignment eval. */
export interface FreshnessCheck {
  packageId: string;
  entry: string;
  buildCommand: string;
}

/** Captured process output from one dist-freshness check invocation. */
export interface FreshnessCommandResult {
  status: number | null;
  stdout: string;
  stderr: string;
  error?: Error;
}

// ───────────────────────────────────────────────────────────────────
// 3. CONSTANTS
// ───────────────────────────────────────────────────────────────────

// Time-bounded allowlist for known stragglers surfaced by the
// broadened scan. Each entry MUST include a follow-on owner and remediation
// date. The harness orphan is being deleted in this packet;
// the remaining three search-quality dist artifacts cannot be deleted by
// this packet under its scope discipline (only harness.js was authorized for
// removal) and are time-boxed for a follow-on cleanup packet.
const ALLOWLIST_EXCEPTIONS: AllowlistException[] = [
  {
    file: 'dist/tests/search-quality/corpus.js',
    reason: 'F-020-D5-02 broadened scan surfaced this as an orphan after source moved to stress-test/search-quality/. Sibling of harness.js (F-020-D5-03) which was deleted in packet 007. Pending removal in a dist-cleanup follow-on.',
    owner: 'remediation-orchestrator',
    date: '2026-04-30',
  },
  {
    file: 'dist/tests/search-quality/measurement-fixtures.js',
    reason: 'F-020-D5-02 broadened scan surfaced this as an orphan after source moved to stress-test/search-quality/. Sibling of harness.js (F-020-D5-03) which was deleted in packet 007. Pending removal in a dist-cleanup follow-on.',
    owner: 'remediation-orchestrator',
    date: '2026-04-30',
  },
  {
    file: 'dist/tests/search-quality/metrics.js',
    reason: 'F-020-D5-02 broadened scan surfaced this as an orphan after source moved to stress-test/search-quality/. Sibling of harness.js (F-020-D5-03) which was deleted in packet 007. Pending removal in a dist-cleanup follow-on.',
    owner: 'remediation-orchestrator',
    date: '2026-04-30',
  },
];

// ───────────────────────────────────────────────────────────────────
// 4. HELPERS
// ───────────────────────────────────────────────────────────────────

function toPosix(filePath: string): string {
  return filePath.replace(/\\/g, '/');
}

function findJsFiles(dir: string): string[] {
  const results: string[] = [];

  function walk(currentDir: string): void {
    if (!fs.existsSync(currentDir)) return;

    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
        continue;
      }

      if (entry.isFile() && entry.name.endsWith('.js')) {
        results.push(fullPath);
      }
    }
  }

  walk(dir);
  return results.sort((left, right) => left.localeCompare(right));
}

// Cover runtime-critical dist subtrees beyond `dist/lib`. Each
// entry maps `runtime/dist/<sub>/*.js` back to `runtime/<sub>/*.ts`.
// New entries should be added when a new runtime subtree appears under
// `runtime/dist/`. Empty/optional dist roots are skipped at scan time.
const DIST_TARGETS: DistTarget[] = [
  {
    label: 'runtime/cli',
    distRoot: path.join('runtime', 'cli', 'dist'),
    sourceRoot: path.join('runtime', 'cli'),
  },
  {
    label: 'runtime/lib',
    distRoot: path.join('runtime', 'dist', 'lib'),
    sourceRoot: path.join('runtime', 'lib'),
  },
  {
    label: 'system-skill-advisor/runtime',
    distRoot: path.join('runtime', 'dist', 'skill_advisor'),
    sourceRoot: path.join('runtime', 'skill_advisor'),
  },
  {
    label: 'runtime/handlers',
    distRoot: path.join('runtime', 'dist', 'handlers'),
    sourceRoot: path.join('runtime', 'handlers'),
  },
  {
    label: 'runtime/formatters',
    distRoot: path.join('runtime', 'dist', 'formatters'),
    sourceRoot: path.join('runtime', 'formatters'),
  },
  {
    label: 'runtime/tools',
    distRoot: path.join('runtime', 'dist', 'tools'),
    sourceRoot: path.join('runtime', 'tools'),
  },
  {
    label: 'runtime/code_graph',
    distRoot: path.join('runtime', 'dist', 'code_graph'),
    sourceRoot: path.join('runtime', 'code_graph'),
  },
  {
    label: 'runtime/hooks',
    distRoot: path.join('runtime', 'dist', 'hooks'),
    sourceRoot: path.join('runtime', 'hooks'),
  },
  {
    label: 'runtime/matrix-runners',
    distRoot: path.join('runtime', 'dist', 'matrix-runners'),
    sourceRoot: path.join('runtime', 'matrix-runners'),
  },
  {
    label: 'runtime/schemas',
    distRoot: path.join('runtime', 'dist', 'schemas'),
    sourceRoot: path.join('runtime', 'schemas'),
  },
  {
    label: 'runtime/stress-test',
    distRoot: path.join('runtime', 'dist', 'stress-test'),
    sourceRoot: path.join('runtime', 'stress-test'),
  },
  {
    label: 'runtime/tests',
    distRoot: path.join('runtime', 'dist', 'tests'),
    sourceRoot: path.join('runtime', 'tests'),
  },
  {
    label: 'runtime/core',
    distRoot: path.join('runtime', 'dist', 'core'),
    sourceRoot: path.join('runtime', 'core'),
  },
  {
    label: 'runtime/api',
    distRoot: path.join('runtime', 'dist', 'api'),
    sourceRoot: path.join('runtime', 'api'),
  },
  {
    label: 'runtime/utils',
    distRoot: path.join('runtime', 'dist', 'utils'),
    sourceRoot: path.join('runtime', 'utils'),
  },
  {
    label: 'runtime/configs',
    distRoot: path.join('runtime', 'dist', 'configs'),
    sourceRoot: path.join('runtime', 'configs'),
  },
  {
    label: 'runtime/scripts',
    distRoot: path.join('runtime', 'dist', 'scripts'),
    sourceRoot: path.join('runtime', 'scripts'),
  },
  {
    label: 'scripts',
    distRoot: path.join('scripts', 'dist'),
    sourceRoot: 'scripts',
  },
];

// Derive the package-relative path so the report shows the
// `runtime/dist/...` or `runtime/cli/dist/...` prefix that authors recognize.
// Previously this used a hardcoded `target.label === 'runtime'` check
// which only worked for the single combined `dist/lib` target. With the
// broader DIST_TARGETS set, derive the package segment from the dist root.
function mapDistFileToSource(packageRoot: string, target: DistTarget, distFile: string): OrphanedDistFile {
  const absoluteDistRoot = path.join(packageRoot, target.distRoot);
  const packageSegment = target.distRoot.startsWith('scripts') ? 'scripts' : 'runtime';
  const relativeDistPath = toPosix(path.relative(path.join(packageRoot, packageSegment), distFile));
  const sourceRelativePath = path.relative(absoluteDistRoot, distFile).replace(/\.js$/, '.ts');
  const expectedSource = path.join(packageRoot, target.sourceRoot, sourceRelativePath);

  return {
    distFile: relativeDistPath,
    expectedSource: toPosix(path.relative(packageRoot, expectedSource)),
  };
}

function findAllowlistEntry(distFile: string): AllowlistException | undefined {
  return ALLOWLIST_EXCEPTIONS.find((entry) => entry.file === distFile);
}


// ───────────────────────────────────────────────────────────────────
// 4b. COMPILED SIBLINGS
// ───────────────────────────────────────────────────────────────────

/**
 * A compiled `.js` sitting in the same directory as the `.ts` it came from.
 *
 * These are worse than an orphan in a build directory, because they win. Anything that resolves
 * the path literally rather than through the compiler loads the sibling instead of the source, so
 * an edit to the source appears to do nothing and the test that should have caught it reads the
 * stale bytes too. Nothing regenerates them, so they drift the moment the source changes.
 *
 * A deliberate one is allowed, and has to say why it exists.
 */
interface SiblingException {
  readonly file: string;
  readonly reason: string;
}

const SIBLING_ALLOWLIST: SiblingException[] = [];

/** Directories whose contents are build output or dependencies, not authored source. */
const SIBLING_SKIP_DIRS = new Set(['dist', 'node_modules', '.git']);

const FRESHNESS_CHECKS: FreshnessCheck[] = [
  {
    packageId: 'system-spec-kit/runtime',
    entry: 'default',
    buildCommand: 'cd .skilled/skills/system-spec-kit/runtime && npm run build',
  },
  {
    packageId: 'system-spec-kit/runtime',
    entry: 'validation-orchestrator',
    buildCommand: 'cd .skilled/skills/system-spec-kit/runtime && npm run build',
  },
  {
    packageId: 'system-spec-kit/runtime/cli',
    entry: 'default',
    buildCommand: 'cd .skilled/skills/system-spec-kit/runtime/cli && npm run build',
  },
  {
    packageId: 'system-spec-kit/runtime/cli',
    entry: 'is-phase-parent',
    buildCommand: 'cd .skilled/skills/system-spec-kit/runtime/cli && npm run build',
  },
];

/** Return a failure message unless the helper proves this entry is fresh. */
export function freshnessFailure(
  check: FreshnessCheck,
  result: FreshnessCommandResult,
): string | null {
  const label = `${check.packageId} entry ${check.entry}`;
  const remedy = `build with: ${check.buildCommand}`;
  const detail = result.error?.message || result.stderr.trim();

  if (result.error || result.status === null) {
    return `Freshness check could not run for ${label}; ${remedy}${detail ? ` (${detail})` : ''}`;
  }

  if (result.status === 69) {
    return `Stale dist for ${label}; ${remedy}`;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(result.stdout) as unknown;
  } catch {
    return `Freshness check could not be read for ${label}; ${remedy}${detail ? ` (${detail})` : ''}`;
  }

  if (!parsed || typeof parsed !== 'object') {
    return `Freshness check returned no result for ${label}; ${remedy}`;
  }

  const freshness = parsed as { status?: unknown; stale?: unknown; message?: unknown };
  if (freshness.stale === true || freshness.status === 'stale') {
    return `Stale dist for ${label}; ${remedy}`;
  }

  if (result.status === 0 && freshness.status === 'unprovisioned' && freshness.stale === false) {
    return null;
  }

  if (result.status !== 0 || freshness.status !== 'fresh' || freshness.stale !== false) {
    const reason = typeof freshness.message === 'string' ? freshness.message : detail;
    return `Freshness check failed for ${label}${reason ? `: ${reason}` : ''}; ${remedy}`;
  }

  return null;
}

function runFreshnessChecks(packageRoot: string): { failures: string[]; skipped: string[] } {
  const helperPath = path.join(packageRoot, 'runtime', 'cli', 'lib', 'dist-freshness.cjs');
  const skipped: string[] = [];
  const failures = FRESHNESS_CHECKS.flatMap((check) => {
    const result = spawnSync(
      process.execPath,
      [helperPath, 'check', '--package', check.packageId, '--entry', check.entry, '--json', '--no-write'],
      { cwd: packageRoot, encoding: 'utf8' },
    );
    const failure = freshnessFailure(check, result);
    if (!failure) {
      const parsed = JSON.parse(result.stdout) as { status?: unknown };
      if (parsed.status === 'unprovisioned') {
        const label = `${check.packageId} entry ${check.entry}`;
        skipped.push(label);
        console.log(`  dist freshness: ${label} unprovisioned, skipped`);
      }
    }
    return failure ? [failure] : [];
  });
  return { failures, skipped };
}

function findCompiledSiblings(dir: string, packageRoot: string, found: string[] = []): string[] {
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return found;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SIBLING_SKIP_DIRS.has(entry.name)) continue;
      findCompiledSiblings(full, packageRoot, found);
      continue;
    }
    if (!entry.isFile() || !entry.name.endsWith('.js')) continue;
    const source = `${full.slice(0, -'.js'.length)}.ts`;
    if (fs.existsSync(source)) {
      found.push(toPosix(path.relative(path.dirname(packageRoot), full)));
    }
  }
  return found;
}

// ───────────────────────────────────────────────────────────────────
// 5. MAIN LOGIC
// ───────────────────────────────────────────────────────────────────

function main(): void {
  const packageRoot = resolvePackageRoot(moduleDir);
  const allowlistedOrphans: OrphanedDistFile[] = [];
  const violations: OrphanedDistFile[] = [];
  let scannedCount = 0;

  for (const target of DIST_TARGETS) {
    const absoluteDistRoot = path.join(packageRoot, target.distRoot);
    // skip optional/empty dist roots silently rather than failing
    // the build. Some targets (e.g. runtime/dist/api) may not exist in all
    // build configurations. Required-target enforcement was load-bearing only
    // when DIST_TARGETS contained the two combined roots; the broadened set
    // includes optional subtrees.
    if (!fs.existsSync(absoluteDistRoot)) {
      continue;
    }

    const distFiles = findJsFiles(absoluteDistRoot);
    scannedCount += distFiles.length;

    for (const distFile of distFiles) {
      const mapped = mapDistFileToSource(packageRoot, target, distFile);
      const absoluteExpectedSource = path.join(packageRoot, mapped.expectedSource);

      if (fs.existsSync(absoluteExpectedSource)) {
        continue;
      }

      const allowlistEntry = findAllowlistEntry(mapped.distFile);
      if (allowlistEntry) {
        allowlistedOrphans.push({ ...mapped, allowlistEntry });
        continue;
      }

      violations.push(mapped);
    }
  }

  const { failures: freshnessFailures, skipped: freshnessSkips } = runFreshnessChecks(packageRoot);
  const alignedCount = scannedCount - allowlistedOrphans.length - violations.length;

  if (allowlistedOrphans.length > 0) {
    console.warn(`Source/dist alignment warning: ${allowlistedOrphans.length} allowlisted orphan(s):\n`);
    for (const orphan of allowlistedOrphans) {
      const entry = orphan.allowlistEntry as AllowlistException;
      console.warn(`  ${orphan.distFile}`);
      console.warn(`    expected source: ${orphan.expectedSource}`);
      console.warn(`    allowlisted by ${entry.owner} on ${entry.date} — ${entry.reason}`);
    }
    console.warn('');
  }

  console.log('Source/dist alignment summary:');
  console.log(`  dist JS files scanned: ${scannedCount}`);
  console.log(`  aligned files: ${alignedCount}`);
  console.log(`  allowlisted orphans: ${allowlistedOrphans.length}`);
  console.log(`  violations: ${violations.length}`);
  const freshCount = FRESHNESS_CHECKS.length - freshnessFailures.length - freshnessSkips.length;
  console.log(`  dist freshness: ${freshCount}/${FRESHNESS_CHECKS.length} fresh, ${freshnessSkips.length} skipped`);

  if (freshnessFailures.length > 0) {
    console.error(`\nDist freshness check FAILED: ${freshnessFailures.length} package/entry pair(s):\n`);
    for (const failure of freshnessFailures) {
      console.error(`  ${failure}`);
    }
  }

  if (violations.length > 0) {
    console.error(`\nSource/dist alignment check FAILED: ${violations.length} orphaned dist file(s):\n`);
    for (const orphan of violations) {
      console.error(`  ${orphan.distFile}`);
      console.error(`    expected source: ${orphan.expectedSource}`);
    }
    console.error('\nRemove stale dist outputs, restore missing source files, or add a time-bounded allowlist entry.');
    process.exit(1);
  }

  const siblings = findCompiledSiblings(packageRoot, packageRoot)
    .filter((file) => !SIBLING_ALLOWLIST.some((entry) => entry.file === file));

  console.log(`  compiled siblings beside a source: ${siblings.length} undeclared, ${SIBLING_ALLOWLIST.length} declared`);

  if (siblings.length > 0) {
    console.error(`\nCompiled-sibling check FAILED: ${siblings.length} file(s) shadow their own source:\n`);
    for (const file of siblings) {
      console.error(`  ${file}`);
    }
    console.error('\nA compiled file beside its source wins resolution for anything that does not go');
    console.error('through the compiler, so the source can be edited with no effect. Delete it, or');
    console.error('declare it with the reason it has to exist.');
    process.exit(1);
  }

  if (freshnessFailures.length > 0) {
    process.exit(1);
  }

  console.log('\nSource/dist alignment check passed: every scanned dist *.js file maps to a source .ts file,');
  console.log('and no compiled file shadows the source it came from.');
  process.exit(0);
}

if (isMainModule(import.meta.url)) {
  main();
}
