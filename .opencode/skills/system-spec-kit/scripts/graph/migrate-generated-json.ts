// ───────────────────────────────────────────────────────────────
// MODULE: Migrate Generated JSON
// Usage:
//   node .../graph/migrate-generated-json.js [--dry-run] [--verify]
//   node .../graph/migrate-generated-json.js --only <spec-folder> [--only <spec-folder>]
//   node .../graph/migrate-generated-json.js --root <specs-dir> [--limit <n>]
//   node .../graph/migrate-generated-json.js <scope> --prune-report
//   node .../graph/migrate-generated-json.js <scope> --prune --prune-confirm <report-hash>
//
// --prune-report writes .migrate-generated-json-prune-report.json under the
// selected specs root and exits without changing generated metadata. Review
// that artifact, then pass its contentHash to --prune-confirm. Apply refuses
// when the artifact is absent or the current candidates differ from the report.
//
// Stage 3 migration: enumerate every spec folder in the repo, archives
// included, and regenerate both description.json and graph-metadata.json for
// each one through the scoped per-folder path only. Each folder is refreshed in
// isolation, so the migration never runs the repo-wide tree walk that dirties
// unrelated sessions' folders.
//
// The hardened writer rules decide which folders are eligible. A folder whose
// graph-metadata path the writer would refuse (the z_future staging tree is the
// live example) is enumerated for full coverage but recorded skipped on the
// writer rule, and neither file is written, so the migration never leaves an
// inconsistent half-pair the integrity validator would flag. The z_archive tree
// stays eligible because the writer keeps it, so archived packets are migrated
// like any other track.
//
// One bad folder is reported failed and the run continues over every healthy
// folder. A --dry-run reports what each folder would do without writing.
// ───────────────────────────────────────────────────────────────

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

import {
  canClassifyAsGraphMetadataPath,
  checkGeneratedMetadataIntegrity,
  generatePerFolderDescription,
  loadPerFolderDescription,
  savePerFolderDescription,
  wouldWritePerFolderDescription,
  type GeneratedMetadataViolation,
} from '@spec-kit/mcp-server/api';
import {
  createPruneReportArtifact,
  pruneReportPath,
  runBackfillCore,
  validatePruneConfirmation,
  writePruneReportArtifact,
  type PruneCandidate,
  type PruneReportReceipt,
} from './backfill-graph-metadata.js';
import { dirnameFromImportMeta, isMainModule } from '../lib/esm-entry.js';

const moduleDir = dirnameFromImportMeta(import.meta.url);

// Derive the scoped backfill's return shape so changes cannot drift between the
// low-level writer and the migration driver.
type BackfillSummary = ReturnType<typeof runBackfillCore>;

// Traversal noise that never holds a migratable spec folder. z_archive and
// z_future are deliberately absent so the enumerator reaches the archive trees.
const TRAVERSAL_SKIP_DIRS = new Set(['node_modules', '.git', 'external']);
const MIGRATION_PRUNE_REPORT_FILE = '.migrate-generated-json-prune-report.json';

// The safety and field-writing flags the migration runs the generators under.
// Identity merge safety resolves specs-root-relative identity and preserves the
// parent links, idempotent writes settle the content-hashed skip so the second
// run is a no-op, and the drift gate plus generator hardening persist the synopsis
// freshness hashes and the source fingerprint so the metadata carries its own
// staleness key and the enforcing integrity rule has the fields to check against.
const MIGRATION_FLAGS = {
  SPECKIT_IDENTITY_MERGE_SAFETY: '1',
  SPECKIT_IDEMPOTENT_DESCRIPTION_WRITES: '1',
  SPECKIT_GENERATED_METADATA_DRIFT_GATE: '1',
  SPECKIT_GENERATOR_HARDENING: '1',
} as const;

/** What happened to one generated file during a folder migration. */
export type SideAction =
  | 'created'
  | 'rewritten'
  | 'unchanged'
  | 'excluded'
  | 'absent'
  | 'failed'
  | 'planned-write'
  | 'planned-refresh'
  | 'planned-noop';

/** Per-file outcome carrying the action and an optional human detail. */
export interface SideOutcome {
  action: SideAction;
  detail?: string;
}

/** Aggregate folder status rolled up from the two file outcomes. */
export type FolderStatus = 'migrated' | 'skipped-noop' | 'failed';

/** One folder's migration result, specs-root-relative for stable reporting. */
export interface FolderOutcome {
  specFolder: string;
  status: FolderStatus;
  graph: SideOutcome;
  description: SideOutcome;
  reason?: string;
}

/** Aggregate run summary plus the per-folder breakdown and any verify report. */
export interface MigrationSummary {
  dryRun: boolean;
  root: string;
  enumerated: number;
  migrated: number;
  skippedNoop: number;
  failed: number;
  excluded: number;
  outcomes: FolderOutcome[];
  pruneCandidates: PruneCandidate[];
  pruneReportArtifact?: PruneReportReceipt;
  verify?: VerifyReport;
}

/** Validator aggregation over the migrated tree, the companion conformance gate. */
export interface VerifyReport {
  foldersChecked: number;
  violationCount: number;
  violations: Array<{ specFolder: string; violations: GeneratedMetadataViolation[] }>;
  clean: boolean;
}

/** Injectable per-folder regeneration seams so a test can assert call shape. */
export interface MigrationDeps {
  enumerate: (specsRoot: string) => string[];
  regenGraph: (folderAbs: string, specsRoot: string, dryRun: boolean, options?: Pick<MigrateOptions, 'prune' | 'pruneReport'>) => BackfillSummary;
  regenDescription: (folderAbs: string, specsRoot: string, dryRun: boolean) => SideOutcome;
}

/**
 * Resolve the repo root by walking up to the nearest `.opencode/specs` anchor.
 *
 * Prefers the current working directory so a run from the repo root resolves
 * immediately, and falls back to the module location for an out-of-tree call.
 *
 * @returns Absolute repo root path
 */
function resolveRepoRoot(): string {
  const cwdCandidate = path.resolve(process.cwd());
  if (fs.existsSync(path.join(cwdCandidate, '.opencode', 'specs'))) {
    return cwdCandidate;
  }
  let current = path.resolve(moduleDir);
  let lastMatch: string | null = null;
  while (true) {
    if (fs.existsSync(path.join(current, '.opencode', 'specs'))) {
      lastMatch = current;
    }
    const parent = path.dirname(current);
    if (parent === current) {
      break;
    }
    current = parent;
  }
  if (lastMatch) {
    return lastMatch;
  }
  return path.resolve(moduleDir, '..', '..', '..', '..', '..');
}

/** Whether a directory directly carries either generated-JSON source marker. */
function isMigratableFolder(dirPath: string): boolean {
  return fs.existsSync(path.join(dirPath, 'spec.md'))
    || fs.existsSync(path.join(dirPath, 'description.json'));
}

/**
 * Enumerate every spec folder under the specs root, archives included.
 *
 * A folder qualifies when it directly carries spec.md or description.json, so a
 * phase parent and a folder that only ever held a description are both reached.
 * The z_archive and z_future trees are walked like any other directory, only the
 * obvious non-spec noise is pruned, so coverage is complete by construction.
 *
 * @param specsRoot - Absolute path to the `.opencode/specs` root
 * @returns Sorted list of absolute spec-folder paths
 */
export function enumerateSpecFolders(specsRoot: string): string[] {
  const folders: string[] = [];

  function walk(currentPath: string): void {
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(currentPath, { withFileTypes: true });
    } catch {
      return;
    }

    if (isMigratableFolder(currentPath)) {
      folders.push(currentPath);
    }

    for (const entry of entries) {
      if (!entry.isDirectory()) {
        continue;
      }
      if (TRAVERSAL_SKIP_DIRS.has(entry.name) || entry.name.startsWith('.')) {
        continue;
      }
      walk(path.join(currentPath, entry.name));
    }
  }

  walk(specsRoot);
  return folders.sort();
}

/** Stable specs-root-relative label for a folder, for report rows. */
function relativeSpecFolder(folderAbs: string, specsRoot: string): string {
  const rel = path.relative(specsRoot, folderAbs).replace(/\\/g, '/');
  return rel.length > 0 ? rel : path.basename(folderAbs);
}

/** Sha256 of a file's bytes, or null when the file is absent. */
function fileHash(filePath: string): string | null {
  try {
    return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
  } catch {
    return null;
  }
}

/**
 * Regenerate one folder's graph-metadata through the scoped backfill path.
 *
 * Delegates to the scoped single-folder backfill, never the repo-wide walk, so
 * the migration composes the hardened scoped writer one folder at a time.
 *
 * @param folderAbs - Absolute spec-folder path
 * @param specsRoot - Absolute specs root, passed through for context
 * @param dryRun - When true the backfill derives without writing
 * @returns The scoped backfill summary for that single folder
 */
export function regenGraphScoped(
  folderAbs: string,
  specsRoot: string,
  dryRun: boolean,
  options: Pick<MigrateOptions, 'prune' | 'pruneReport'> = {},
): BackfillSummary {
  return runBackfillCore({
    dryRun,
    root: specsRoot,
    specFolder: folderAbs,
    prune: options.prune,
    pruneReport: options.pruneReport,
  });
}

/**
 * Regenerate one folder's description.json through the scoped per-folder path.
 *
 * Uses the per-folder generate and save only, so siblings and the aggregate
 * descriptions.json cache are never touched. The idempotent-writes flag settles
 * the no-op skip, so a re-run over unchanged content writes nothing. A dry-run
 * predicts the outcome by comparing the would-be content against the existing
 * file on the stable fields, ignoring the volatile timestamp.
 *
 * @param folderAbs - Absolute spec-folder path
 * @param specsRoot - Absolute specs root used as the identity base
 * @param dryRun - When true the prediction runs without writing
 * @returns The description-side outcome for the folder
 */
export function regenDescriptionScoped(folderAbs: string, specsRoot: string, dryRun: boolean): SideOutcome {
  const next = generatePerFolderDescription(folderAbs, specsRoot);
  if (!next) {
    return { action: 'absent', detail: 'spec.md unreadable, no description regenerated' };
  }

  const existing = loadPerFolderDescription(folderAbs);

  if (dryRun) {
    if (!existing) {
      return { action: 'planned-write', detail: 'would create description.json' };
    }
    return wouldWritePerFolderDescription(next, folderAbs)
      ? { action: 'planned-write' }
      : { action: 'planned-noop' };
  }

  const before = fileHash(path.join(folderAbs, 'description.json'));
  savePerFolderDescription(next, folderAbs);
  const after = fileHash(path.join(folderAbs, 'description.json'));

  if (before === null) {
    return { action: 'created' };
  }
  return before === after ? { action: 'unchanged' } : { action: 'rewritten' };
}

/** Map a scoped backfill summary for one folder onto a graph side outcome. */
function graphOutcomeFromSummary(summary: BackfillSummary, dryRun: boolean): SideOutcome {
  if (summary.failed.length > 0) {
    return { action: 'failed', detail: summary.failed[0]?.error };
  }
  if (summary.skipped.length > 0) {
    return { action: 'excluded', detail: summary.skipped[0]?.reason };
  }
  if (dryRun) {
    if (summary.created > 0) {
      return { action: 'planned-write' };
    }
    return summary.changed > 0 ? { action: 'planned-refresh' } : { action: 'planned-noop' };
  }
  if (summary.created > 0) {
    return { action: 'created' };
  }
  return summary.changed === 0 ? { action: 'unchanged' } : { action: 'rewritten' };
}

/** Roll the two file outcomes up into one folder status. */
function rollUpStatus(graph: SideOutcome, description: SideOutcome): FolderStatus {
  if (graph.action === 'failed' || description.action === 'failed') {
    return 'failed';
  }
  const wrote = (action: SideAction): boolean =>
    action === 'created' || action === 'rewritten'
    || action === 'planned-write' || action === 'planned-refresh';
  if (wrote(graph.action) || wrote(description.action)) {
    return 'migrated';
  }
  return 'skipped-noop';
}

/**
 * Migrate one folder through the scoped paths, gated by the writer rules.
 *
 * A folder the hardened writer would refuse is recorded skipped on the writer
 * rule and neither file is written, so the migration cannot create an
 * inconsistent half-pair. A per-folder throw is caught by the caller and
 * reported failed without aborting the run.
 *
 * @param folderAbs - Absolute spec-folder path
 * @param specsRoot - Absolute specs root
 * @param dryRun - Whether to predict without writing
 * @param deps - Injectable regeneration seams
 * @returns The folder outcome
 */
export function migrateFolder(
  folderAbs: string,
  specsRoot: string,
  dryRun: boolean,
  deps: Pick<MigrationDeps, 'regenGraph' | 'regenDescription'>,
  options: Pick<MigrateOptions, 'prune' | 'pruneReport'> = {},
): FolderOutcome {
  const specFolder = relativeSpecFolder(folderAbs, specsRoot);
  const graphPath = path.join(folderAbs, 'graph-metadata.json');

  // Writer-rule gate: a folder the scoped graph writer refuses (the live z_future
  // staging tree) is excluded from both files so the pair stays consistent.
  if (!canClassifyAsGraphMetadataPath(graphPath)) {
    return {
      specFolder,
      status: 'skipped-noop',
      graph: { action: 'excluded', detail: 'writer-rule' },
      description: { action: 'excluded', detail: 'writer-rule' },
      reason: 'writer-rule-excluded',
    };
  }

  const graphSummary = deps.regenGraph(folderAbs, specsRoot, dryRun, options);
  const graph = graphOutcomeFromSummary(graphSummary, dryRun);
  const description = deps.regenDescription(folderAbs, specsRoot, dryRun);

  return { specFolder, status: rollUpStatus(graph, description), graph, description };
}

/** Set the migration safety flags on, returning a restore for the prior values. */
function applyMigrationFlags(): () => void {
  const prior: Record<string, string | undefined> = {};
  for (const [key, value] of Object.entries(MIGRATION_FLAGS)) {
    prior[key] = process.env[key];
    process.env[key] = value;
  }
  return () => {
    for (const key of Object.keys(MIGRATION_FLAGS)) {
      if (prior[key] === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = prior[key];
      }
    }
  };
}

/** Run the integrity validator over the eligible folders and aggregate it. */
function runVerify(folders: string[], specsRoot: string): VerifyReport {
  const violations: VerifyReport['violations'] = [];
  let checked = 0;
  for (const folderAbs of folders) {
    const graphPath = path.join(folderAbs, 'graph-metadata.json');
    if (!canClassifyAsGraphMetadataPath(graphPath)) {
      continue;
    }
    const report = checkGeneratedMetadataIntegrity(folderAbs);
    if (!report.checked) {
      continue;
    }
    checked += 1;
    if (report.violations.length > 0) {
      violations.push({ specFolder: relativeSpecFolder(folderAbs, specsRoot), violations: report.violations });
    }
  }
  const violationCount = violations.reduce((sum, entry) => sum + entry.violations.length, 0);
  return { foldersChecked: checked, violationCount, violations, clean: violationCount === 0 };
}

/** Options accepted by the migration entry point. */
export interface MigrateOptions {
  specsRoot: string;
  dryRun: boolean;
  verify?: boolean;
  only?: string[];
  limit?: number;
  prune?: boolean;
  pruneReport?: boolean;
  pruneConfirm?: string;
  deps?: Partial<MigrationDeps>;
}

function migrationPruneScope(specsRoot: string, folders: string[]): string {
  return JSON.stringify({
    entryPoint: 'migrate-generated-json',
    root: path.resolve(specsRoot),
    folders: folders.map((folder) => relativeSpecFolder(folder, specsRoot)),
  });
}

function collectMigrationPruneCandidates(
  folders: string[],
  specsRoot: string,
  regenGraph: MigrationDeps['regenGraph'],
): PruneCandidate[] {
  const candidates: PruneCandidate[] = [];
  for (const folderAbs of folders) {
    if (!canClassifyAsGraphMetadataPath(path.join(folderAbs, 'graph-metadata.json'))) {
      continue;
    }
    const graphSummary = regenGraph(folderAbs, specsRoot, true, { prune: false, pruneReport: true });
    if (graphSummary.failed.length > 0) {
      const failure = graphSummary.failed[0];
      const failedFolder = failure?.specFolder ?? folderAbs;
      const failureMessage = failure?.error ?? 'unknown error';
      throw new Error(
        `cannot build a complete prune report for ${failedFolder}: ${failureMessage}`,
      );
    }
    candidates.push(...graphSummary.pruneCandidates);
  }
  return candidates;
}

/**
 * Migrate the generated JSON across the enumerated spec folders.
 *
 * Sets the two migration safety flags on for the run and restores them after, so
 * the generators always run hardened regardless of the caller environment. Every
 * folder is regenerated through the scoped path only, one bad folder is recorded
 * failed without aborting, and the optional verify pass aggregates the integrity
 * validator over the eligible folders.
 *
 * @param options - Migration options including the specs root and run mode
 * @returns The aggregate run summary
 */
export function migrateAllJson(options: MigrateOptions): MigrationSummary {
  const {
    specsRoot,
    dryRun,
    verify = false,
    only,
    limit,
    prune = false,
    pruneReport = false,
    pruneConfirm,
  } = options;
  if (prune && pruneReport) {
    throw new Error('cannot combine --prune with --prune-report');
  }
  if (prune && !pruneConfirm) {
    throw new Error('--prune requires --prune-confirm <hash> from a prior --prune-report run');
  }
  const effectiveDryRun = dryRun || pruneReport;
  const deps: MigrationDeps = {
    enumerate: options.deps?.enumerate ?? enumerateSpecFolders,
    regenGraph: options.deps?.regenGraph ?? regenGraphScoped,
    regenDescription: options.deps?.regenDescription ?? regenDescriptionScoped,
  };

  const restoreFlags = applyMigrationFlags();
  try {
    let folders = only && only.length > 0
      ? only.map((entry) => path.resolve(entry))
      : deps.enumerate(specsRoot);
    if (typeof limit === 'number' && limit >= 0) {
      folders = folders.slice(0, limit);
    }

    const pruneCandidates = prune || pruneReport
      ? collectMigrationPruneCandidates(folders, specsRoot, deps.regenGraph)
      : [];
    const pruneScope = migrationPruneScope(specsRoot, folders);
    const reportPath = pruneReportPath(specsRoot, MIGRATION_PRUNE_REPORT_FILE);

    if (prune) {
      const validated = validatePruneConfirmation(
        reportPath,
        pruneScope,
        pruneCandidates,
        pruneConfirm ?? '',
      );
      if (!validated.ok) {
        throw new Error(validated.error);
      }
    }

    const summary: MigrationSummary = {
      dryRun: effectiveDryRun,
      root: specsRoot,
      enumerated: folders.length,
      migrated: 0,
      skippedNoop: 0,
      failed: 0,
      excluded: 0,
      outcomes: [],
      pruneCandidates,
    };

    for (const folderAbs of folders) {
      let outcome: FolderOutcome;
      try {
        outcome = migrateFolder(folderAbs, specsRoot, effectiveDryRun, deps, {
          prune,
          pruneReport: false,
        });
      } catch (error) {
        // One corrupt folder reports failed, the run continues over the rest.
        outcome = {
          specFolder: relativeSpecFolder(folderAbs, specsRoot),
          status: 'failed',
          graph: { action: 'failed', detail: error instanceof Error ? error.message : String(error) },
          description: { action: 'failed' },
        };
      }

      summary.outcomes.push(outcome);
      if (outcome.status === 'migrated') {
        summary.migrated += 1;
      } else if (outcome.status === 'failed') {
        summary.failed += 1;
      } else {
        summary.skippedNoop += 1;
      }
      if (outcome.reason === 'writer-rule-excluded') {
        summary.excluded += 1;
      }
    }

    if (verify) {
      const verifyFolders = only && only.length > 0
        ? only.map((entry) => path.resolve(entry))
        : deps.enumerate(specsRoot);
      summary.verify = runVerify(verifyFolders, specsRoot);
    }

    if (pruneReport) {
      const artifact = createPruneReportArtifact(pruneScope, pruneCandidates);
      writePruneReportArtifact(reportPath, artifact);
      summary.pruneReportArtifact = {
        path: reportPath,
        contentHash: artifact.contentHash,
      };
    }

    return summary;
  } finally {
    restoreFlags();
  }
}

/** Parse argv into migration options, or an error string. */
export function parseArgs(argv: string[]): { ok: true; options: MigrateOptions } | { ok: false; error: string } {
  let dryRun = false;
  let verify = false;
  let prune = false;
  let pruneReport = false;
  let pruneConfirm: string | undefined;
  let root = path.join(resolveRepoRoot(), '.opencode', 'specs');
  let limit: number | undefined;
  const only: string[] = [];

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--dry-run') {
      dryRun = true;
      continue;
    }
    if (arg === '--verify') {
      verify = true;
      continue;
    }
    if (arg === '--prune') {
      prune = true;
      continue;
    }
    if (arg === '--prune-report') {
      pruneReport = true;
      dryRun = true;
      continue;
    }
    if (arg === '--prune-confirm') {
      const value = argv[index + 1];
      if (value === undefined || value.startsWith('--')) {
        return { ok: false, error: '--prune-confirm requires a report content hash' };
      }
      pruneConfirm = value;
      index += 1;
      continue;
    }
    if (arg === '--root') {
      const value = argv[index + 1];
      if (value === undefined || value.startsWith('--')) {
        return { ok: false, error: '--root requires a directory path' };
      }
      root = path.resolve(value);
      index += 1;
      continue;
    }
    if (arg === '--only') {
      const value = argv[index + 1];
      if (value === undefined || value.startsWith('--')) {
        return { ok: false, error: '--only requires a spec-folder path' };
      }
      only.push(value);
      index += 1;
      continue;
    }
    if (arg === '--limit') {
      const value = argv[index + 1];
      if (value === undefined || Number.isNaN(Number(value))) {
        return { ok: false, error: '--limit requires a number' };
      }
      limit = Number(value);
      index += 1;
      continue;
    }
    return { ok: false, error: `unknown argument: ${arg}` };
  }

  if (prune && pruneReport) {
    return { ok: false, error: 'cannot combine --prune with --prune-report' };
  }
  if (prune && !pruneConfirm) {
    return {
      ok: false,
      error: '--prune requires --prune-confirm <hash> from a prior --prune-report run',
    };
  }
  if (pruneConfirm && !prune) {
    return { ok: false, error: '--prune-confirm requires --prune' };
  }

  return {
    ok: true,
    options: {
      specsRoot: root,
      dryRun,
      verify,
      only,
      limit,
      prune,
      pruneReport,
      pruneConfirm,
    },
  };
}

function run(): void {
  const parsed = parseArgs(process.argv.slice(2));
  if (!parsed.ok) {
    process.stderr.write(`migrate-generated-json: ${parsed.error}\n`);
    process.exitCode = 1;
    return;
  }
  try {
    const summary = migrateAllJson(parsed.options);
    process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
    if (summary.failed > 0 || (summary.verify && !summary.verify.clean)) {
      process.exitCode = 1;
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`migrate-generated-json: ${message}\n`);
    process.exitCode = 1;
  }
}

if (isMainModule(import.meta.url)) {
  run();
}
