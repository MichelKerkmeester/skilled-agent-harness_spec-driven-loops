// ───────────────────────────────────────────────────────────────
// MODULE: Backfill Graph Metadata
// Usage:
//   node .../graph/backfill-graph-metadata.js <spec-folder> [--dry-run]
//   node .../graph/backfill-graph-metadata.js --spec-folder <path> [--dry-run]
//   node .../graph/backfill-graph-metadata.js --all [--dry-run] [--active-only] [--root <specs-dir>]
//
// A default invocation refreshes ONE packet only: it requires a target spec
// folder, validates it against the supported specs roots, and never walks the
// repo-wide tree. The broad repo-wide walk lives behind an explicit --all flag
// so a single-packet intent can no longer dirty unrelated sessions' folders.
// In --all mode z_future/ is always skipped (it is not a supported specs root)
// and z_archive/ is included unless --active-only is passed.
// ───────────────────────────────────────────────────────────────

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

export type BackfillScope = 'scoped' | 'all';

interface BackfillSummary {
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
  pruneCandidates: Array<{ specFolder: string; childId: string; targetPath: string; existsOnDisk: boolean }>;
}

export interface BackfillOptions {
  dryRun: boolean;
  root: string;
  activeOnly?: boolean;
  prune?: boolean;
  pruneReport?: boolean;
  // When set, only this single packet folder is refreshed and no tree walk runs.
  specFolder?: string;
}

export type BackfillPlan =
  | { ok: true; options: BackfillOptions }
  | { ok: false; error: string };

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

  if (all) {
    if (scopedTarget !== null) {
      return { ok: false, error: 'cannot combine --all with a target spec folder' };
    }
    return { ok: true, options: { dryRun, root, activeOnly, prune, pruneReport } };
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
  return { ok: true, options: { dryRun, root, specFolder: resolved.specFolder, prune, pruneReport } };
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
export function runBackfill({ dryRun, root, activeOnly = false, prune = false, pruneReport = false, specFolder }: BackfillOptions): BackfillSummary {
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
      const merged = mergeGraphMetadata(existing, derived, { prune });
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
        ? derived
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

function run(): void {
  const plan = planBackfill(process.argv.slice(2));
  if (!plan.ok) {
    process.stderr.write(`backfill-graph-metadata: ${plan.error}\n`);
    process.exitCode = 1;
    return;
  }
  const summary = runBackfill(plan.options);
  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
}

if (isMainModule(import.meta.url)) {
  run();
}
