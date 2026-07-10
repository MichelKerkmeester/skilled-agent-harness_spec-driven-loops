// ───────────────────────────────────────────────────────────────
// MODULE: Backfill Graph Metadata
// Usage:
//   node .../graph/backfill-graph-metadata.js <spec-folder> [--dry-run]
//   node .../graph/backfill-graph-metadata.js --spec-folder <path> [--dry-run]
//   node .../graph/backfill-graph-metadata.js --all [--dry-run] [--active-only] [--root <specs-dir>]
//   node .../graph/backfill-graph-metadata.js <scope> --prune-report
//   node .../graph/backfill-graph-metadata.js <scope> --prune --prune-confirm <report-hash>
//
// --prune-report writes .backfill-graph-metadata-prune-report.json under the
// selected specs root and exits without changing graph metadata. Review that
// artifact, then pass its contentHash to --prune-confirm. Apply refuses when
// the artifact is absent or the current candidates differ from the report.
//
// A default invocation refreshes ONE packet only: it requires a target spec
// folder, validates it against the supported specs roots, and never walks the
// repo-wide tree. The broad repo-wide walk lives behind an explicit --all flag
// so a single-packet intent can no longer dirty unrelated sessions' folders.
// In --all mode z_future/ is always skipped (it is not a supported specs root)
// and z_archive/ is included unless --active-only is passed.
// ───────────────────────────────────────────────────────────────

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

import {
  canClassifyAsGraphMetadataPath,
  checkGeneratedMetadataDrift,
  collectChildrenPruneCandidates,
  deriveGraphMetadata,
  graphMetadataEqualIgnoringVolatile,
  loadGraphMetadata,
  mergeGraphMetadata,
  refreshGraphMetadataForSpecFolder,
  resolveSpecFolderIdentity,
  SpecFolderIdentityError,
  type GraphMetadata,
} from '@spec-kit/mcp-server/api';
import { dirnameFromImportMeta, isMainModule } from '../lib/esm-entry.js';

const moduleDir = dirnameFromImportMeta(import.meta.url);

const SPEC_FOLDER_RE = /^\d{3}(?:[-_].+)?$/;
const EXCLUDED_DIRS = new Set(['memory', 'scratch', 'node_modules', '.git', 'z_future']);
const ARCHIVE_SEGMENT_RE = /(^|\/)(z_archive|z_future)(\/|$)/;
const BACKFILL_PRUNE_REPORT_FILE = '.backfill-graph-metadata-prune-report.json';
const PRUNE_REPORT_VERSION = 1;

export type BackfillScope = 'scoped' | 'all';

/** One persisted child relationship that an explicit prune would remove. */
export interface PruneCandidate {
  specFolder: string;
  childId: string;
  targetPath: string;
  existsOnDisk: boolean;
}

/** Stable review artifact whose hash binds a scope to its prune candidates. */
export interface PruneReportArtifact {
  version: number;
  scope: string;
  candidates: PruneCandidate[];
  contentHash: string;
}

/** Report location and confirmation token surfaced to the CLI caller. */
export interface PruneReportReceipt {
  path: string;
  contentHash: string;
}

export interface BackfillSummary {
  dryRun: boolean;
  scope: BackfillScope;
  root: string;
  totalSpecFolders: number;
  created: number;
  refreshed: number;
  changed: number;
  existing: number;
  lineageStamped: number;
  skipped: Array<{ specFolder: string; reason: string }>;
  failed: Array<{ specFolder: string; error: string }>;
  reviewFlags: Array<{ specFolder: string; flags: string[] }>;
  // Report-only drift surface: which packets carry a stored synopsis field that drifted from
  // the current docs. Populated from a read-only re-derive, never a write side effect.
  drift: Array<{ specFolder: string; fields: string[] }>;
  pruneCandidates: PruneCandidate[];
  pruneReportArtifact?: PruneReportReceipt;
}

export interface BackfillOptions {
  dryRun: boolean;
  root: string;
  activeOnly?: boolean;
  prune?: boolean;
  pruneReport?: boolean;
  pruneConfirm?: string;
  // When set, only this single packet folder is refreshed and no tree walk runs.
  specFolder?: string;
}

export type BackfillPlan =
  | { ok: true; options: BackfillOptions }
  | { ok: false; error: string };

/** Result of applying the report gate around the low-level backfill operation. */
export type BackfillExecutionResult =
  | { ok: true; summary: BackfillSummary }
  | { ok: false; error: string };

function sortPruneCandidates(candidates: PruneCandidate[]): PruneCandidate[] {
  return [...candidates].sort((left, right) => {
    const leftKey = `${left.specFolder}\0${left.childId}\0${left.targetPath}\0${left.existsOnDisk}`;
    const rightKey = `${right.specFolder}\0${right.childId}\0${right.targetPath}\0${right.existsOnDisk}`;
    return leftKey.localeCompare(rightKey);
  });
}

function hashPruneReportContent(
  version: number,
  scope: string,
  candidates: PruneCandidate[],
): string {
  return crypto.createHash('sha256')
    .update(JSON.stringify({ version, scope, candidates: sortPruneCandidates(candidates) }))
    .digest('hex');
}

/** Build the deterministic report payload reviewed before a prune apply. */
export function createPruneReportArtifact(
  scope: string,
  candidates: PruneCandidate[],
): PruneReportArtifact {
  const sortedCandidates = sortPruneCandidates(candidates);
  return {
    version: PRUNE_REPORT_VERSION,
    scope,
    candidates: sortedCandidates,
    contentHash: hashPruneReportContent(PRUNE_REPORT_VERSION, scope, sortedCandidates),
  };
}

/** Resolve an entry point's deterministic report path under its selected root. */
export function pruneReportPath(root: string, fileName = BACKFILL_PRUNE_REPORT_FILE): string {
  return path.join(path.resolve(root), fileName);
}

/** Persist a prune report in the stable JSON form operators review. */
export function writePruneReportArtifact(
  reportPath: string,
  artifact: PruneReportArtifact,
): void {
  fs.writeFileSync(reportPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf-8');
}

function isPruneCandidate(value: unknown): value is PruneCandidate {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return typeof candidate.specFolder === 'string'
    && typeof candidate.childId === 'string'
    && typeof candidate.targetPath === 'string'
    && typeof candidate.existsOnDisk === 'boolean';
}

function readPruneReportArtifact(reportPath: string): PruneReportArtifact | null {
  try {
    const value = JSON.parse(fs.readFileSync(reportPath, 'utf-8')) as Record<string, unknown>;
    if (
      value.version !== PRUNE_REPORT_VERSION
      || typeof value.scope !== 'string'
      || typeof value.contentHash !== 'string'
      || !Array.isArray(value.candidates)
      || !value.candidates.every(isPruneCandidate)
    ) {
      return null;
    }
    return value as unknown as PruneReportArtifact;
  } catch {
    return null;
  }
}

/** Validate a prior report and confirmation against the candidates present now. */
export function validatePruneConfirmation(
  reportPath: string,
  scope: string,
  candidates: PruneCandidate[],
  confirmation: string,
): { ok: true } | { ok: false; error: string } {
  if (!fs.existsSync(reportPath)) {
    return {
      ok: false,
      error: `prune report artifact not found at ${reportPath}; run --prune-report first`,
    };
  }

  const artifact = readPruneReportArtifact(reportPath);
  if (!artifact) {
    return {
      ok: false,
      error: `prune report artifact at ${reportPath} is invalid; run --prune-report again`,
    };
  }

  const storedContentHash = hashPruneReportContent(
    artifact.version,
    artifact.scope,
    artifact.candidates,
  );
  if (storedContentHash !== artifact.contentHash) {
    return {
      ok: false,
      error: `prune report artifact at ${reportPath} failed its content hash; run --prune-report again`,
    };
  }
  if (confirmation !== artifact.contentHash) {
    return {
      ok: false,
      error: '--prune-confirm does not match the prior prune report contentHash',
    };
  }

  const current = createPruneReportArtifact(scope, candidates);
  if (current.contentHash !== artifact.contentHash) {
    return {
      ok: false,
      error: 'prune report is stale because the candidates changed; run --prune-report again',
    };
  }
  return { ok: true };
}

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

function isSpecFolder(dirPath: string): boolean {
  const base = path.basename(dirPath);
  return SPEC_FOLDER_RE.test(base) && fs.existsSync(path.join(dirPath, 'spec.md'));
}

/**
 * Validate a scoped target through the supported-root checks before any write.
 *
 * Rejects a missing target, a folder without spec.md, a path that resolves
 * outside a supported specs root, and a graph-metadata path the writer rules
 * would refuse, so a scoped run fails the contract up front rather than later
 * inside the per-folder refresh.
 *
 * @param target - Caller-supplied spec folder (positional or --spec-folder)
 * @returns The validated absolute folder path or a contract error
 */
function resolveScopedTarget(target: string): { ok: true; specFolder: string } | { ok: false; error: string } {
  const absTarget = path.resolve(target);
  if (!fs.existsSync(absTarget) || !fs.statSync(absTarget).isDirectory()) {
    return { ok: false, error: `target spec folder does not exist: ${absTarget}` };
  }
  if (!isSpecFolder(absTarget)) {
    return { ok: false, error: `target is not a spec folder (missing spec.md): ${absTarget}` };
  }
  try {
    resolveSpecFolderIdentity(absTarget);
  } catch (error) {
    if (error instanceof SpecFolderIdentityError) {
      return { ok: false, error: `target resolves outside a supported specs root: ${absTarget}` };
    }
    throw error;
  }
  const graphPath = path.join(absTarget, 'graph-metadata.json');
  if (!canClassifyAsGraphMetadataPath(graphPath)) {
    return { ok: false, error: `target graph-metadata path fails the writer rules: ${graphPath}` };
  }
  return { ok: true, specFolder: absTarget };
}

/**
 * Parse argv into a validated backfill plan.
 *
 * Rejects unknown args, requires a scoped target unless --all is given, and
 * validates the resolved scoped folder through the supported-root checks. The
 * broad tree walk stays behind --all so the default path can only touch one
 * packet.
 *
 * @param argv - CLI arguments after the node entrypoint
 * @returns A ready-to-run plan or a contract error
 */
export function planBackfill(argv: string[]): BackfillPlan {
  let dryRun = false;
  let activeOnly = false;
  let prune = false;
  let pruneReport = false;
  let pruneConfirm: string | undefined;
  let all = false;
  let root = path.join(resolveRepoRoot(), '.opencode', 'specs');
  let scopedTarget: string | null = null;
  let sawPositional = false;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--dry-run') {
      dryRun = true;
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
    if (arg === '--active-only') {
      activeOnly = true;
      continue;
    }
    if (arg === '--include-archive') {
      activeOnly = false;
      continue;
    }
    if (arg === '--all') {
      all = true;
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
    if (arg === '--spec-folder') {
      const value = argv[index + 1];
      if (value === undefined || value.startsWith('--')) {
        return { ok: false, error: '--spec-folder requires a directory path' };
      }
      scopedTarget = value;
      index += 1;
      continue;
    }
    if (arg.startsWith('-')) {
      return { ok: false, error: `unknown argument: ${arg}` };
    }
    if (sawPositional) {
      return { ok: false, error: `unexpected extra argument: ${arg}` };
    }
    scopedTarget = arg;
    sawPositional = true;
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

  if (all) {
    if (scopedTarget !== null) {
      return { ok: false, error: 'cannot combine --all with a target spec folder' };
    }
    return {
      ok: true,
      options: { dryRun, root, activeOnly, prune, pruneReport, pruneConfirm },
    };
  }

  if (scopedTarget === null) {
    return {
      ok: false,
      error: 'a target spec folder is required (or pass --all for a repo-wide refresh)',
    };
  }

  const resolved = resolveScopedTarget(scopedTarget);
  if (!resolved.ok) {
    return resolved;
  }
  return {
    ok: true,
    options: {
      dryRun,
      root,
      specFolder: resolved.specFolder,
      prune,
      pruneReport,
      pruneConfirm,
    },
  };
}

function isArchivedTraversalPath(dirPath: string): boolean {
  return ARCHIVE_SEGMENT_RE.test(dirPath.replace(/\\/g, '/'));
}

/**
 * Collect spec folders eligible for graph-metadata refresh.
 *
 * @param root - Specs root to traverse
 * @param options - Traversal controls such as `activeOnly`
 * @returns Sorted list of discovered spec-folder paths
 */
export function collectSpecFolders(
  root: string,
  options: Pick<BackfillOptions, 'activeOnly'> = {},
): string[] {
  const folders: string[] = [];
  const activeOnly = options.activeOnly ?? false;

  function walk(currentPath: string): void {
    if (activeOnly && isArchivedTraversalPath(currentPath)) {
      return;
    }

    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(currentPath, { withFileTypes: true });
    } catch {
      return;
    }

    if (isSpecFolder(currentPath)) {
      folders.push(currentPath);
    }

    for (const entry of entries) {
      if (!entry.isDirectory()) {
        continue;
      }
      if (EXCLUDED_DIRS.has(entry.name) || entry.name.startsWith('.')) {
        continue;
      }
      walk(path.join(currentPath, entry.name));
    }
  }

  walk(root);
  return folders.sort();
}

/**
 * Derive human-review flags for a refreshed graph-metadata payload.
 *
 * @param specFolderPath - Absolute path to the packet folder being inspected
 * @param metadata - Derived or refreshed graph metadata for the packet
 * @returns List of review flags describing low-confidence derivations
 */
export function collectReviewFlags(specFolderPath: string, metadata: GraphMetadata): string[] {
  const flags: string[] = [];
  const specDoc = fs.existsSync(path.join(specFolderPath, 'spec.md'))
    ? fs.readFileSync(path.join(specFolderPath, 'spec.md'), 'utf-8')
    : '';
  const planDoc = fs.existsSync(path.join(specFolderPath, 'plan.md'))
    ? fs.readFileSync(path.join(specFolderPath, 'plan.md'), 'utf-8')
    : '';

  if (metadata.derived.status === 'planned' && !/\nstatus:\s*["']?(planned|complete|in_progress|blocked)/i.test(`${specDoc}\n${planDoc}`)) {
    flags.push('ambiguous_status');
  }
  if (
    metadata.derived.causal_summary === 'Packet metadata derived from canonical spec documents.'
    || metadata.derived.causal_summary.trim().length < 40
  ) {
    flags.push('missing_summary');
  }
  if (/(depends on|supersedes|related to)/i.test(`${specDoc}\n${planDoc}`)) {
    flags.push('prose_relationship_hints');
  }
  if (metadata.derived.source_docs.length < 3) {
    flags.push('thin_source_docs');
  }

  return flags;
}

function preserveExistingChildrenForPrediction(
  specFolderPath: string,
  existing: GraphMetadata | null,
  derived: GraphMetadata,
): GraphMetadata {
  const retainedChildren = collectChildrenPruneCandidates(specFolderPath, existing, derived)
    .filter((candidate) => candidate.existsOnDisk)
    .map((candidate) => candidate.childId);
  if (retainedChildren.length === 0) {
    return derived;
  }
  return {
    ...derived,
    children_ids: [...new Set([...retainedChildren, ...derived.children_ids])],
  };
}

/**
 * Backfill graph-metadata files across the selected scope.
 *
 * A scoped run (`specFolder` set) refreshes that single packet only. A broad
 * run collects folders under `root`. Either way, a candidate whose
 * graph-metadata path fails the writer rules is skipped, and one corrupt
 * folder is reported failed without aborting the rest of the run.
 *
 * @param options - Backfill execution options
 * @returns Aggregate summary of created, refreshed, skipped, and failed packets
 */
export function runBackfillCore({
  dryRun,
  root,
  activeOnly = false,
  prune = false,
  pruneReport = false,
  specFolder,
}: BackfillOptions): BackfillSummary {
  const specFolders = specFolder
    ? [specFolder]
    : collectSpecFolders(root, { activeOnly });
  const summary: BackfillSummary = {
    dryRun,
    scope: specFolder ? 'scoped' : 'all',
    root,
    totalSpecFolders: specFolders.length,
    created: 0,
    refreshed: 0,
    changed: 0,
    existing: 0,
    lineageStamped: 0,
    skipped: [],
    failed: [],
    reviewFlags: [],
    drift: [],
    pruneCandidates: [],
  };

  for (const specFolderPath of specFolders) {
    const graphPath = path.join(specFolderPath, 'graph-metadata.json');

    // Match the writer rules so a candidate the writer would reject never
    // reaches the refresh and cannot throw later inside it.
    if (!canClassifyAsGraphMetadataPath(graphPath)) {
      summary.skipped.push({ specFolder: specFolderPath, reason: 'writer_rule' });
      continue;
    }

    // Isolate per-folder failures: one corrupt or unsupported folder reports
    // failed and the run continues over every healthy folder.
    try {
      const existing = loadGraphMetadata(graphPath);
      const saveLineage = existing?.derived.save_lineage ?? 'graph_only';
      if (existing) {
        summary.existing += 1;
      }

      const derived = deriveGraphMetadata(specFolderPath, existing, { saveLineage });
      const mergeInput = prune
        ? preserveExistingChildrenForPrediction(specFolderPath, existing, derived)
        : derived;
      const merged = mergeGraphMetadata(existing, mergeInput, { prune });
      if (!existing || !graphMetadataEqualIgnoringVolatile(existing, merged)) {
        summary.changed += 1;
      }
      const pruneCandidates = collectChildrenPruneCandidates(specFolderPath, existing, derived);
      if (pruneReport || prune) {
        for (const candidate of pruneCandidates) {
          summary.pruneCandidates.push({
            specFolder: derived.spec_folder,
            childId: candidate.childId,
            targetPath: candidate.targetPath,
            existsOnDisk: candidate.existsOnDisk,
          });
        }
      }

      const metadata = dryRun
        ? merged
        : refreshGraphMetadataForSpecFolder(specFolderPath, { saveLineage, prune }).metadata;

      if (!existing) {
        summary.created += 1;
      } else {
        summary.refreshed += 1;
        if (!dryRun && !existing.derived.save_lineage && metadata.derived.save_lineage === 'graph_only') {
          summary.lineageStamped += 1;
        }
      }

      const flags = collectReviewFlags(specFolderPath, metadata);
      if (flags.length > 0) {
        summary.reviewFlags.push({
          specFolder: metadata.spec_folder,
          flags,
        });
      }

      // Surface synopsis drift as a read-only report. The check never writes, so it holds in
      // dry-run and live alike and cannot churn the files the gate exists to keep clean.
      const driftReport = checkGeneratedMetadataDrift(specFolderPath);
      if (driftReport.driftedFields.length > 0) {
        summary.drift.push({
          specFolder: metadata.spec_folder,
          fields: driftReport.driftedFields.map((field) => field.field),
        });
      }
    } catch (error) {
      summary.failed.push({
        specFolder: specFolderPath,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return summary;
}

function backfillPruneScope(options: BackfillOptions): string {
  return JSON.stringify({
    entryPoint: 'backfill-graph-metadata',
    root: path.resolve(options.root),
    scope: options.specFolder ? 'scoped' : 'all',
    specFolder: options.specFolder ? path.resolve(options.specFolder) : null,
    activeOnly: options.activeOnly ?? false,
  });
}

/** Execute the report/confirm gate before delegating to the metadata writer. */
export function executeBackfill(options: BackfillOptions): BackfillExecutionResult {
  if (options.prune && !options.pruneConfirm) {
    return {
      ok: false,
      error: '--prune requires --prune-confirm <hash> from a prior --prune-report run',
    };
  }
  if (options.prune && options.pruneReport) {
    return { ok: false, error: 'cannot combine --prune with --prune-report' };
  }

  if (!options.prune && !options.pruneReport) {
    return { ok: true, summary: runBackfillCore(options) };
  }

  const reportSummary = runBackfillCore({
    ...options,
    dryRun: true,
    prune: false,
    pruneReport: true,
  });
  const scope = backfillPruneScope(options);
  const reportPath = pruneReportPath(options.root);

  if (options.pruneReport) {
    const artifact = createPruneReportArtifact(scope, reportSummary.pruneCandidates);
    writePruneReportArtifact(reportPath, artifact);
    reportSummary.pruneReportArtifact = {
      path: reportPath,
      contentHash: artifact.contentHash,
    };
    return { ok: true, summary: reportSummary };
  }

  const validated = validatePruneConfirmation(
    reportPath,
    scope,
    reportSummary.pruneCandidates,
    options.pruneConfirm ?? '',
  );
  if (!validated.ok) {
    return validated;
  }
  return { ok: true, summary: runBackfillCore(options) };
}

/** Run a backfill while enforcing the report/confirm contract for pruning. */
export function runBackfill(options: BackfillOptions): BackfillSummary {
  const result = executeBackfill(options);
  if (!result.ok) {
    throw new Error(result.error);
  }
  return result.summary;
}

function run(): void {
  const plan = planBackfill(process.argv.slice(2));
  if (!plan.ok) {
    process.stderr.write(`backfill-graph-metadata: ${plan.error}\n`);
    process.exitCode = 1;
    return;
  }
  const result = executeBackfill(plan.options);
  if (!result.ok) {
    process.stderr.write(`backfill-graph-metadata: ${result.error}\n`);
    process.exitCode = 1;
    return;
  }
  process.stdout.write(`${JSON.stringify(result.summary, null, 2)}\n`);
}

if (isMainModule(import.meta.url)) {
  run();
}
