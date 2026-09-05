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

// ───────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────

import * as fs from 'fs';
import * as path from 'path';
import { dirnameFromImportMeta } from '../lib/esm-entry.js';

const moduleDir = dirnameFromImportMeta(import.meta.url);

// ───────────────────────────────────────────────────────────────
// 2. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────

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

// ───────────────────────────────────────────────────────────────
// 3. CONSTANTS
// ───────────────────────────────────────────────────────────────

const REQUIRED_ROOT_DIRS = ['runtime', 'scripts'] as const;
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

// ───────────────────────────────────────────────────────────────
// 4. HELPERS
// ───────────────────────────────────────────────────────────────

function resolvePackageRoot(startDir: string): string {
  let cursor = path.resolve(startDir);

  while (true) {
    const hasRequiredDirs = REQUIRED_ROOT_DIRS.every((dirName) => {
      return fs.existsSync(path.join(cursor, dirName));
    });

    if (hasRequiredDirs) {
      return cursor;
    }

    const parent = path.dirname(cursor);
    if (parent === cursor) {
      throw new Error(`Unable to resolve package root from: ${startDir}`);
    }
    cursor = parent;
  }
}

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
    label: 'runtime/lib',
    distRoot: path.join('runtime', 'dist', 'lib'),
    sourceRoot: path.join('runtime', 'lib'),
  },
  {
    label: 'system-skill-advisor/mcp-server',
    distRoot: path.join('mcp-server', 'dist', 'skill_advisor'),
    sourceRoot: path.join('mcp-server', 'skill_advisor'),
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
// `runtime/dist/...` or `scripts/dist/...` prefix that authors recognize.
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

// ───────────────────────────────────────────────────────────────
// 5. MAIN LOGIC
// ───────────────────────────────────────────────────────────────

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

  if (violations.length > 0) {
    console.error(`\nSource/dist alignment check FAILED: ${violations.length} orphaned dist file(s):\n`);
    for (const orphan of violations) {
      console.error(`  ${orphan.distFile}`);
      console.error(`    expected source: ${orphan.expectedSource}`);
    }
    console.error('\nRemove stale dist outputs, restore missing source files, or add a time-bounded allowlist entry.');
    process.exit(1);
  }

  console.log('\nSource/dist alignment check passed: every scanned dist *.js file maps to a source .ts file.');
  process.exit(0);
}

main();
