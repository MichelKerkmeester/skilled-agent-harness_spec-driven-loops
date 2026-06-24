// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Auto-Trigger (Ensure Ready)
// ───────────────────────────────────────────────────────────────
// Checks if the code graph needs reindexing before a query and
// performs the reindex automatically. Shared helper for context,
// query, and status handlers.

import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { getDb, getLastGitHead, setLastGitHead, ensureFreshFiles } from './code-graph-db.js';
import { indexFiles } from './structural-indexer.js';
import { getDefaultConfig } from './indexer-types.js';
import type { IndexerConfig, ParseResult } from './indexer-types.js';
import {
  resolveIndexScopePolicy,
  parseIndexScopePolicyFromFingerprint,
  scopeFingerprintsMatchOrLegacy,
  isDefaultEndUserScope,
} from './index-scope-policy.js';
import { isRecord } from './query-result-adapter.js';
import * as graphDb from './code-graph-db.js';
// Shared policy module (`auto-rescan-policy.ts`) is the canonical reference
// for the read-path guard. ensure-ready delegates here so callers that consume
// the helper directly (read-path handlers via `shouldAutoRescan(...)`) and
// callers that rely on `ReadyResult.autoRescanSafety` see identical decisions.
import { shouldAutoRescan } from './auto-rescan-policy.js';

// ───────────────────────────────────────────────────────────────
// Types
// ───────────────────────────────────────────────────────────────

export type ReadyAction = 'none' | 'full_scan' | 'selective_reindex';
// Re-export the canonical GraphFreshness union from ops-hardening (superset:
// includes 'error' for unreachable/crashed scopes). The local 3-value alias is
// gone; ensure-ready callers pick up the widened union automatically via this
// re-export so the codebase stays on a single vocabulary.
export type { GraphFreshness } from './ops-hardening.js';
import type { GraphFreshness } from './ops-hardening.js';

export interface ReadyResult {
  freshness: GraphFreshness;
  action: ReadyAction;
  files?: string[];
  inlineIndexPerformed: boolean;
  reason: string;
  activeScope?: ReadinessScopeDiagnostic;
  storedScope?: ReadinessScopeDiagnostic;
  manifestCount?: number | null;
  manifestDigest?: string | null;
  parseErrorBacklog?: number;
  autoRescanSafety?: 'allowed' | 'blocked';
  autoRescanBlockReason?: string;
  selfHealAttempted?: boolean;
  selfHealResult?: 'ok' | 'failed' | 'skipped';
  verificationGate?: 'pass' | 'fail' | 'absent';
  lastSelfHealAt?: string;
}

export interface EnsureReadyOptions {
  allowInlineIndex?: boolean;
  allowInlineFullScan?: boolean;
  allowGuardedInlineFullScan?: boolean;
  parseErrorBacklogThreshold?: number;
}

// ───────────────────────────────────────────────────────────────
// Constants
// ───────────────────────────────────────────────────────────────

/** Maximum time (ms) before auto-indexing is aborted */
const AUTO_INDEX_TIMEOUT_MS = 10_000;

/**
 * Maximum stale files before we switch from selective to full reindex.
 *
 * Operators can tune via `SPECKIT_CODE_GRAPH_SELECTIVE_REINDEX_THRESHOLD`
 * (positive integer). Default `50` balances incremental-rescan speed
 * (fast for small diffs) against full-scan throughput (one expensive pass
 * for bulk changes). Raise to delay full-scans (favors session-boot
 * latency over freshness). Lower to keep the DB tighter at the cost of
 * more frequent full-scans.
 */
function resolveSelectiveReindexThreshold(): number {
  const raw = process.env.SPECKIT_CODE_GRAPH_SELECTIVE_REINDEX_THRESHOLD;
  if (typeof raw !== 'string' || raw.trim() === '') return 50;
  const parsed = Number.parseInt(raw.trim(), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 50;
}
export const SELECTIVE_REINDEX_THRESHOLD = resolveSelectiveReindexThreshold();
const GUARDED_FULL_SCAN_PARSE_ERROR_THRESHOLD = 0;

// ───────────────────────────────────────────────────────────────
// Internal helpers
// ───────────────────────────────────────────────────────────────

function getCurrentGitHead(rootDir: string): string | null {
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], {
      cwd: rootDir,
      encoding: 'utf-8',
      timeout: 5_000,
      stdio: ['ignore', 'pipe', 'pipe'],
    }).trim();
  } catch {
    return null;
  }
}

function isCommitSha(value: string): boolean {
  return /^[0-9a-fA-F]{40}$/.test(value);
}

/**
 * Return the file-paths touched by `git diff` between two HEAD shas.
 * Returns null on git failure (caller falls back to the existing
 * full-scan behavior — no regression). Returns an empty array when both shas
 * are valid but no files changed between them.
 *
 * The diff is `--name-only` and includes added/modified/deleted/renamed paths
 * so the caller can intersect against `getTrackedFiles()` to determine
 * whether a HEAD pointer change actually affects the indexed set.
 */
function getGitDiffFilePaths(rootDir: string, fromSha: string, toSha: string): string[] | null {
  if (!isCommitSha(fromSha) || !isCommitSha(toSha)) {
    return null;
  }
  try {
    const out = execFileSync('git', ['diff', '--name-only', `${fromSha}..${toSha}`], {
      cwd: rootDir,
      encoding: 'utf-8',
      timeout: 5_000,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    return out.split('\n').map((line) => line.trim()).filter((line) => line.length > 0);
  } catch {
    return null;
  }
}

/**
 * Decide whether a raw HEAD pointer change actually touches the indexed file
 * set. Returns:
 *   - 'unknown' if git is unavailable or one sha is missing (caller keeps
 *     existing full-scan behavior so we never silently downgrade safety)
 *   - 'in-scope' if the diff touches at least one tracked file
 *   - 'out-of-scope' if the diff touches no tracked files (HEAD pointer can be
 *     advanced without a full reindex)
 */
function classifyHeadDriftScope(
  rootDir: string,
  storedHead: string | null,
  currentHead: string | null,
  trackedFiles: string[],
): 'unknown' | 'in-scope' | 'out-of-scope' {
  if (!storedHead || !currentHead || storedHead === currentHead) {
    return 'unknown';
  }
  const diffPaths = getGitDiffFilePaths(rootDir, storedHead, currentHead);
  if (diffPaths === null) {
    return 'unknown';
  }
  if (diffPaths.length === 0) {
    return 'out-of-scope';
  }
  // Intersect with tracked files. Compare against both bare paths (relative
  // to rootDir) and absolute paths since `getTrackedFiles()` may store either.
  const trackedSet = new Set(trackedFiles);
  for (const candidate of diffPaths) {
    if (trackedSet.has(candidate)) return 'in-scope';
    // Try absolute resolution (rootDir + candidate)
    const absCandidate = candidate.startsWith('/') ? candidate : `${rootDir.replace(/\/$/, '')}/${candidate}`;
    if (trackedSet.has(absCandidate)) return 'in-scope';
  }
  return 'out-of-scope';
}

// ─── Candidate manifest for tracked-set drift detection ───
//
// This manifest pins the cardinality + digest of the
// CURRENTLY-TRACKED file set (`getTrackedFiles()` == rows in `code_files`). It is
// recorded from the tracked set after a scan and compared against the tracked
// set on `detectState()`, so it detects changes WITHIN the tracked universe
// (e.g. a bulk rebuild that rewrites the tracked set, or tracked-file removals)
// and complements the per-file mtime check.
//
// It does NOT detect brand-new UNTRACKED files: a file that has never been
// indexed is absent from `getTrackedFiles()` at both record and compare time,
// so it cannot diverge the manifest. Detecting brand-new on-disk files at read
// time would require a filesystem walk of the include globs, which the read
// path deliberately avoids (NFR-P01: no FS walk on the read path). Brand-new
// files are picked up on the next explicit/triggered full `code_graph_scan`,
// which walks the include globs itself.
//
// Bounded: persists `{count, digest}` only (no per-path storage) so 10k+ file
// monorepos don't bloat the metadata table.

const CANDIDATE_MANIFEST_KEY = 'candidate_manifest';

interface CandidateManifest {
  readonly count: number;
  readonly digest: string;
  readonly recordedAt: string;
}

export interface ReadinessScopeDiagnostic {
  readonly fingerprint: string | null;
  readonly label: string | null;
  readonly source: string | null;
}

function scopeDiagnostic(scope: {
  fingerprint?: string | null;
  label?: string | null;
  source?: string | null;
}): ReadinessScopeDiagnostic {
  return {
    fingerprint: scope.fingerprint ?? null,
    label: scope.label ?? null,
    source: scope.source ?? null,
  };
}

function buildReadinessDiagnostics(): Pick<
  ReadyResult,
  'activeScope' | 'storedScope' | 'manifestCount' | 'manifestDigest' | 'parseErrorBacklog'
> {
  const activeScope = resolveIndexScopePolicy();
  const storedScope = graphDb.getStoredCodeGraphScope();
  const manifest = loadCandidateManifest();
  let parseErrorBacklog = 0;
  try {
    parseErrorBacklog = graphDb.getParseDiagnosticsSummary().affectedFiles;
  } catch {
    parseErrorBacklog = 0;
  }

  return {
    activeScope: scopeDiagnostic(activeScope),
    storedScope: scopeDiagnostic(storedScope),
    manifestCount: manifest?.count ?? null,
    manifestDigest: manifest?.digest ?? null,
    parseErrorBacklog,
  };
}

function evaluateGuardedFullScan(
  diagnostics: ReturnType<typeof buildReadinessDiagnostics>,
  parseErrorBacklogThreshold: number,
): Pick<ReadyResult, 'autoRescanSafety' | 'autoRescanBlockReason'> {
  // Delegate to the shared `auto-rescan-policy.ts` helper so this gate and
  // the read-path handler gate stay in sync.
  const decision = shouldAutoRescan({
    storedScope: { fingerprint: diagnostics.storedScope?.fingerprint ?? null },
    activeScope: { fingerprint: diagnostics.activeScope?.fingerprint ?? null },
    parseDiagnosticsBacklog: diagnostics.parseErrorBacklog ?? 0,
    parseDiagnosticsBacklogThreshold: parseErrorBacklogThreshold,
  });
  if (!decision.allowed) {
    return {
      autoRescanSafety: 'blocked',
      autoRescanBlockReason: decision.blockReason,
    };
  }
  return { autoRescanSafety: 'allowed' };
}

/**
 * Load the persisted candidate manifest. Returns null if no manifest exists
 * (first run) or if the stored value is malformed.
 */
function loadCandidateManifest(): CandidateManifest | null {
  // Bounded read of the persisted manifest.
  const raw = graphDb.getCodeGraphMetadata(CANDIDATE_MANIFEST_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!isRecord(parsed)) return null;
    if (typeof parsed.count !== 'number' || typeof parsed.digest !== 'string' || typeof parsed.recordedAt !== 'string') {
      return null;
    }
    return { count: parsed.count, digest: parsed.digest, recordedAt: parsed.recordedAt };
  } catch {
    return null;
  }
}

/**
 * Persist a candidate manifest. Called after any successful full or selective
 * scan so the next `detectState()` has a baseline to compare against.
 */
export function recordCandidateManifest(filePaths: string[]): void {
  // Persist {count, digest} only — no per-path storage.
  const sorted = [...filePaths].sort();
  const digest = createHash('sha256').update(sorted.join('\n'), 'utf-8').digest('hex').slice(0, 16);
  const manifest: CandidateManifest = {
    count: sorted.length,
    digest,
    recordedAt: new Date().toISOString(),
  };
  graphDb.setCodeGraphMetadata(CANDIDATE_MANIFEST_KEY, JSON.stringify(manifest));
}

/**
 * Compare on-disk tracked file paths against the stored candidate manifest.
 * Returns true when divergence is detected (count differs OR digest differs);
 * false when the manifest matches OR no manifest exists yet.
 *
 * Bounded compare: no filesystem walk happens here — we use the same
 * `getTrackedFiles()` set that `detectState()` already loads, plus existence
 * checks already performed by `partitionTrackedFiles()`. The manifest pins the
 * cardinality + digest of the TRACKED set so a bulk rebuild that rewrites that
 * set (or removes tracked files) flips to stale even when per-file mtimes look
 * unchanged. Note: brand-new UNTRACKED files are NOT detected here —
 * they are absent from `getTrackedFiles()`, so they cannot diverge the digest;
 * they are indexed by the next full `code_graph_scan` (which walks the globs).
 */
function detectCandidateManifestDrift(filePaths: string[]): boolean {
  const stored = loadCandidateManifest();
  if (!stored) return false; // no baseline = no drift signal yet
  const sorted = [...filePaths].sort();
  if (sorted.length !== stored.count) return true;
  const digest = createHash('sha256').update(sorted.join('\n'), 'utf-8').digest('hex').slice(0, 16);
  return digest !== stored.digest;
}

function partitionTrackedFiles(filePaths: string[]): { existingFiles: string[]; deletedFiles: string[] } {
  const existingFiles: string[] = [];
  const deletedFiles: string[] = [];

  for (const filePath of filePaths) {
    if (existsSync(filePath)) {
      existingFiles.push(filePath);
      continue;
    }

    deletedFiles.push(filePath);
  }

  return { existingFiles, deletedFiles };
}

function cleanupDeletedTrackedFiles(filePaths: string[]): number {
  for (const filePath of filePaths) {
    graphDb.removeFile(filePath);
  }

  return filePaths.length;
}

function appendCleanupReason(reason: string, removedDeletedCount: number): string {
  if (removedDeletedCount === 0) {
    return reason;
  }

  return `${reason}; removed ${removedDeletedCount} deleted tracked file(s)`;
}

function getVerificationGate(
  verification: object | null,
): ReadyResult['verificationGate'] {
  if (!isRecord(verification)) {
    return 'absent';
  }

  if (verification.passed === false) {
    return 'fail';
  }

  if (!isRecord(verification.pass_policy)) {
    return verification.passed === true ? 'pass' : 'absent';
  }

  const overallThreshold = verification.pass_policy.overall_pass_rate;
  const edgeThreshold = verification.pass_policy.edge_focus_pass_rate;
  const overallPassRate = verification.overall_pass_rate ?? verification.overallPassRate;
  const edgeFocusPassRate = verification.edge_focus_pass_rate;

  if (
    typeof overallThreshold !== 'number'
    || typeof edgeThreshold !== 'number'
    || typeof overallPassRate !== 'number'
    || typeof edgeFocusPassRate !== 'number'
  ) {
    return verification.passed === true ? 'pass' : 'absent';
  }

  return overallPassRate >= overallThreshold && edgeFocusPassRate >= edgeThreshold
    ? 'pass'
    : 'fail';
}

/** Detect graph state without triggering any reindex */
function detectState(rootDir: string): {
  freshness: GraphFreshness;
  action: ReadyAction;
  staleFiles: string[];
  deletedFiles: string[];
  reason: string;
} {
  const d = getDb();

  // Condition (a): Graph is empty
  const nodeCount = (d.prepare('SELECT COUNT(*) as c FROM code_nodes').get() as { c: number }).c;
  if (nodeCount === 0) {
    return { freshness: 'empty', action: 'full_scan', staleFiles: [], deletedFiles: [], reason: 'graph is empty (0 nodes)' };
  }

  const activeScope = resolveIndexScopePolicy();
  const storedScope = graphDb.getStoredCodeGraphScope();
  // Env-vs-stored drift only blocks reads when the prior scan
  // took its policy from env (`env`/`default`). When the prior scan was an
  // explicit per-call override (`scan-argument`), the index contains exactly
  // what the user just asked for — trust it and let reads proceed regardless
  // of env drift. This preserves the cross-session env-change
  // contract while restoring read-after-scan semantics for explicit probes.
  const storedFromPerCall = storedScope.source === 'scan-argument';
  if (!storedFromPerCall && !scopeFingerprintsMatchOrLegacy(storedScope.fingerprint, activeScope.fingerprint)) {
    const storedLabel = storedScope.label ?? 'unknown previous code graph scope';
    return {
      freshness: 'stale',
      action: 'full_scan',
      staleFiles: [],
      deletedFiles: [],
      reason: `code graph scope changed: stored=${storedLabel}; active=${activeScope.label}; run code_graph_scan with incremental:false`,
    };
  }

  // Condition (b): Git HEAD changed
  const currentHead = getCurrentGitHead(rootDir);
  const storedHead = getLastGitHead();
  const headChanged = Boolean(currentHead && storedHead && currentHead !== storedHead);
  // headChanged proves both git refs are present before formatting the transition.
  const headChangedReason = headChanged
    ? `git HEAD changed: ${storedHead!.slice(0, 8)} -> ${currentHead!.slice(0, 8)}`
    : null;

  // Condition (c): Check file mtime drift on tracked files
  const trackedFiles = graphDb.getTrackedFiles();
  if (trackedFiles.length === 0) {
    return { freshness: 'empty', action: 'full_scan', staleFiles: [], deletedFiles: [], reason: 'no tracked files in code_files table' };
  }

  // Classify HEAD drift by index scope. Raw HEAD drift no longer
  // triggers full_scan if the diff touches no path in `getTrackedFiles()`.
  // 'unknown' means git was unavailable or shas are missing — we keep the
  // existing safe behavior (treat headChanged as significant).
  const headScope = headChanged
    ? classifyHeadDriftScope(rootDir, storedHead, currentHead, trackedFiles)
    : 'unknown';
  const headChangedSignificant = headChanged && headScope !== 'out-of-scope';

  const { existingFiles, deletedFiles } = partitionTrackedFiles(trackedFiles);
  const { stale } = ensureFreshFiles(existingFiles);

  // Detect untracked-indexable drift via the candidate manifest.
  // If the on-disk indexable cardinality or digest diverges from the stored
  // baseline, flip to stale + full_scan even when individual mtimes look fine.
  const manifestDrift = detectCandidateManifestDrift(trackedFiles);

  if (stale.length === 0) {
    if (headChangedSignificant) {
      return {
        freshness: 'stale',
        action: 'full_scan',
        staleFiles: [],
        deletedFiles,
        reason: deletedFiles.length > 0
          ? `${headChangedReason}; tracked files appear up-to-date on disk; ${deletedFiles.length} tracked file(s) no longer exist on disk`
          : `${headChangedReason}; tracked files appear up-to-date on disk`,
      };
    }

    if (manifestDrift) {
      return {
        freshness: 'stale',
        action: 'full_scan',
        staleFiles: [],
        deletedFiles,
        reason: 'candidate manifest drift: indexable file set has changed since last scan',
      };
    }

    if (deletedFiles.length > 0) {
      return {
        freshness: 'stale',
        action: 'none',
        staleFiles: [],
        deletedFiles,
        reason: `${deletedFiles.length} tracked file(s) no longer exist on disk`,
      };
    }

    // HEAD pointer may have advanced without touching tracked
    // files. Update the stored HEAD so we don't re-classify on every probe.
    if (headChanged && headScope === 'out-of-scope' && currentHead) {
      setLastGitHead(currentHead);
    }
    return { freshness: 'fresh', action: 'none', staleFiles: [], deletedFiles: [], reason: 'all tracked files are up-to-date' };
  }

  // Too many stale files => full scan is more efficient
  if (stale.length > SELECTIVE_REINDEX_THRESHOLD) {
    return {
      freshness: 'stale',
      action: 'full_scan',
      staleFiles: stale,
      deletedFiles,
      reason: [
        headChangedReason,
        `${stale.length} stale files exceed selective threshold (${SELECTIVE_REINDEX_THRESHOLD})`,
        deletedFiles.length > 0 ? `${deletedFiles.length} tracked file(s) no longer exist on disk` : null,
      ].filter(Boolean).join('; '),
    };
  }

  return {
    freshness: 'stale',
    action: 'selective_reindex',
    staleFiles: stale,
    deletedFiles,
    reason: [
      headChangedReason,
      `${stale.length} file(s) have newer mtime than indexed_at`,
      deletedFiles.length > 0 ? `${deletedFiles.length} tracked file(s) no longer exist on disk` : null,
    ].filter(Boolean).join('; '),
  };
}

/** Run indexFiles with a timeout guard */
async function indexWithTimeout(
  config: IndexerConfig,
  timeoutMs: number,
  indexOptions?: Parameters<typeof indexFiles>[1],
): Promise<void> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const results = await Promise.race([
      // Pass the deadline signal so indexFiles' phase runner can stop
      // between phases on timeout instead of running to completion in the
      // background and discarding the result.
      indexFiles(config, { ...indexOptions, signal: controller.signal }),
      new Promise<never>((_, reject) => {
        controller.signal.addEventListener('abort', () =>
          reject(new Error(`Auto-indexing timed out after ${timeoutMs}ms`)),
        );
      }),
    ]);

    let persistedDetectorProvenance: ReturnType<typeof graphDb.getLastDetectorProvenance> = null;
    let persistedAny = false;
    for (const result of results) {
      try {
        persistIndexedFileResult(result);
        persistedDetectorProvenance ??= result.detectorProvenance;
        persistedAny = true;
      } catch {
        // Best-effort: skip files that fail to persist.  File remains stale
        // (mtime=0 from Stage 1) so the next scan will retry structural rows.
      }
    }

    if (persistedDetectorProvenance) {
      graphDb.setLastDetectorProvenance(persistedDetectorProvenance);
    }

    // The explicit-scan handler bumps the graph generation after its persist
    // loop, but this auto-index read path did not, so two consecutive
    // ensure-ready reindexes wrote at the same generation. Under bitemporal
    // reads that collapses a superseded edge into a zero-width window the as-of
    // reader cannot see, because its close lands at the same generation as its
    // own valid_at. Bumping here once writes have landed gives each reindex a
    // distinct generation and a non-empty window. The bump is gated on the flag
    // so the generation counter is byte-identical on this path when the flag is
    // off.
    if (persistedAny && graphDb.codeGraphEdgeBitemporalReadsEnabled()) {
      graphDb.bumpCodeGraphGeneration();
    }
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Persist one indexed file without marking it fresh until structural rows land.
 *
 * Stage `file_mtime_ms=0`, write nodes/edges, then finalize with the real
 * mtime so persistence failures leave the file stale for retry.
 *
 * Wrap the four storage operations (stage upsert, replaceNodes, replaceEdges,
 * finalize upsert) in a single per-file transaction so a crash mid-persistence
 * rolls all four back atomically. Per-file scope keeps the
 * lock window short (3-4 statements) so concurrent readers/writers on the
 * same DB are not starved during a long scan.
 */
export function persistIndexedFileResult(
  result: ParseResult,
  opts: { deferDanglingTargetPrune?: boolean } = {},
): void {
  if (result.parseHealth === 'error') {
    graphDb.recordParseDiagnostic(result.filePath, result.parseErrors.join('; '));
    return;
  }

  // Atomic per-file persistence boundary.
  const tx = graphDb.getDb().transaction(() => {
    const fileId = graphDb.upsertFile(
      result.filePath, result.language, result.contentHash,
      result.nodes.length, result.edges.length,
      result.parseHealth, result.parseDurationMs,
      { fileMtimeMs: 0 },
    );
    graphDb.replaceNodes(fileId, result.nodes);
    const sourceIds = result.nodes.map((node) => node.symbolId);
    graphDb.replaceEdges(sourceIds, result.edges, opts);
    graphDb.upsertFile(
      result.filePath, result.language, result.contentHash,
      result.nodes.length, result.edges.length,
      result.parseHealth, result.parseDurationMs,
    );
    graphDb.clearParseDiagnostic(result.filePath);
  });
  tx();
}

// ───────────────────────────────────────────────────────────────
// Public API
// ───────────────────────────────────────────────────────────────

/**
 * Check whether the code graph is ready and, if not, perform
 * the minimum necessary reindexing before returning.
 *
 * Has a 10-second timeout guard so auto-indexing never blocks
 * queries forever.
 */
export async function ensureCodeGraphReady(rootDir: string, options: EnsureReadyOptions = {}): Promise<ReadyResult> {
  const allowInlineIndex = options.allowInlineIndex ?? true;
  const allowInlineFullScan = options.allowInlineFullScan ?? allowInlineIndex;
  const allowGuardedInlineFullScan = options.allowGuardedInlineFullScan ?? false;
  const parseErrorBacklogThreshold = options.parseErrorBacklogThreshold ?? GUARDED_FULL_SCAN_PARSE_ERROR_THRESHOLD;

  const state = detectState(rootDir);
  const removedDeletedCount = cleanupDeletedTrackedFiles(state.deletedFiles);
  const verificationGate = getVerificationGate(graphDb.getLastGoldVerification());
  const diagnostics = buildReadinessDiagnostics();

  if (state.action === 'none') {
    return {
      freshness: state.freshness,
      action: 'none',
      inlineIndexPerformed: false,
      reason: appendCleanupReason(state.reason, removedDeletedCount),
      ...diagnostics,
      verificationGate,
    };
  }

  if (state.action === 'selective_reindex' && !allowInlineIndex) {
    return {
      freshness: state.freshness,
      action: state.action,
      ...(state.action === 'selective_reindex' ? { files: state.staleFiles } : {}),
      inlineIndexPerformed: false,
      reason: appendCleanupReason(`${state.reason}; inline auto-index skipped for read path`, removedDeletedCount),
      ...diagnostics,
      selfHealAttempted: true,
      selfHealResult: 'skipped',
      verificationGate,
    };
  }

  // First-time auto-establish: an EMPTY graph has nothing to overwrite, so a
  // first full scan is safe to auto-run on a read path WITHOUT an explicit
  // code_graph_scan — but only under the DEFAULT end-user-code scope. A fresh
  // clone (default scope) gets "it just works"; a maintainer who opted .opencode
  // in (a large scope) keeps the explicit gate so a quick query never silently
  // triggers a big all-of-.opencode scan. The normal scope-fingerprint guard
  // (evaluateGuardedFullScan) still protects POPULATED/stale graphs from unsafe
  // scope-mismatched auto-rescans.
  const firstTimeAutoEstablish = state.freshness === 'empty'
    && allowGuardedInlineFullScan
    && isDefaultEndUserScope(resolveIndexScopePolicy());

  const guardedFullScan = firstTimeAutoEstablish
    ? { autoRescanSafety: 'allowed' as const }
    : state.action === 'full_scan' && allowGuardedInlineFullScan
      ? evaluateGuardedFullScan(diagnostics, parseErrorBacklogThreshold)
      : { autoRescanSafety: 'blocked' as const, autoRescanBlockReason: 'guard_disabled' };
  const canRunFullScan = allowInlineFullScan || guardedFullScan.autoRescanSafety === 'allowed';
  if (state.action === 'full_scan' && !canRunFullScan) {
    return {
      freshness: state.freshness,
      action: state.action,
      inlineIndexPerformed: false,
      reason: appendCleanupReason(`${state.reason}; inline full scan skipped for read path`, removedDeletedCount),
      ...diagnostics,
      ...guardedFullScan,
      verificationGate,
    };
  }

  // Honor the last explicit scan's stored scope so per-call disabled scans are
  // not silently re-broadened back to env-resolved scope at read time. Without
  // this, a `code_graph_scan({includeSkills:false,...})` followed by any read
  // re-resolves scope from env (which may say `INDEX_*=true`), detects a
  // mismatch, and immediately blocks reads with `requiredAction:"code_graph_scan"`.
  const storedScope = graphDb.getStoredCodeGraphScope();
  const storedPolicy = parseIndexScopePolicyFromFingerprint({
    fingerprint: storedScope.fingerprint,
    source: storedScope.source,
  });

  try {
    if (state.action === 'full_scan') {
      const config = getDefaultConfig(rootDir, storedPolicy ?? undefined);
      await indexWithTimeout(config, AUTO_INDEX_TIMEOUT_MS);
      graphDb.setCodeGraphScope(config.scopePolicy);

      // Update stored git HEAD after full scan
      const head = getCurrentGitHead(rootDir);
      if (head) setLastGitHead(head);
      // Refresh candidate manifest after a full scan so the next detectState()
      // has a current baseline to compare against.
      try {
        recordCandidateManifest(graphDb.getTrackedFiles());
      } catch {
        // Best-effort: manifest recording must never block a successful scan
      }

      const refreshedState = detectState(rootDir);
      return {
        freshness: refreshedState.freshness,
        action: refreshedState.action,
        ...(refreshedState.action === 'selective_reindex' ? { files: refreshedState.staleFiles } : {}),
        inlineIndexPerformed: true,
        reason: appendCleanupReason(refreshedState.reason, removedDeletedCount),
        ...buildReadinessDiagnostics(),
        ...(state.action === 'full_scan' && allowGuardedInlineFullScan
          ? { ...guardedFullScan, selfHealAttempted: true, selfHealResult: 'ok' as const }
          : {}),
        verificationGate,
      };
    }

    // selective_reindex: only re-parse stale files
    if (state.action === 'selective_reindex' && state.staleFiles.length > 0) {
      const lastSelfHealAt = new Date().toISOString();
      const config = getDefaultConfig(rootDir, storedPolicy ?? undefined);
      await indexWithTimeout(config, AUTO_INDEX_TIMEOUT_MS, { specificFiles: state.staleFiles });
      graphDb.setCodeGraphScope(config.scopePolicy);

      const head = getCurrentGitHead(rootDir);
      if (head) setLastGitHead(head);
      // Refresh candidate manifest after a selective reindex too
      // (the tracked-file set may have grown if the scan added new files).
      try {
        recordCandidateManifest(graphDb.getTrackedFiles());
      } catch {
        // Best-effort: manifest recording must never block a successful scan
      }

      const refreshedState = detectState(rootDir);
      const selfHealResult = refreshedState.freshness === 'fresh' && refreshedState.action === 'none'
        ? 'ok'
        : 'failed';
      return {
        freshness: refreshedState.freshness,
        action: refreshedState.action,
        ...(refreshedState.action === 'selective_reindex' ? { files: refreshedState.staleFiles } : {}),
        inlineIndexPerformed: true,
        reason: appendCleanupReason(refreshedState.reason, removedDeletedCount),
        ...buildReadinessDiagnostics(),
        selfHealAttempted: true,
        selfHealResult,
        verificationGate,
        lastSelfHealAt,
      };
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[ensure-ready] Auto-index failed: ${msg}`);
    return {
      freshness: state.freshness,
      action: state.action,
      files: state.staleFiles,
      inlineIndexPerformed: false,
      reason: appendCleanupReason(`${state.reason} (auto-index failed: ${msg})`, removedDeletedCount),
      ...diagnostics,
      verificationGate,
      ...(state.action === 'selective_reindex'
        ? {
            selfHealAttempted: true,
            selfHealResult: 'failed' as const,
            lastSelfHealAt: new Date().toISOString(),
          }
        : {}),
    };
  }

  return {
    freshness: state.freshness,
    action: 'none',
    inlineIndexPerformed: false,
    reason: appendCleanupReason(state.reason, removedDeletedCount),
    ...diagnostics,
    verificationGate,
  };
}

/**
 * Non-mutating freshness check for status display.
 * Does NOT trigger reindexing.
 *
 * Returns 'error' on probe crash so callers can canonically distinguish
 * "scope is unreachable" from "scope is empty".
 * The widened union flows through readiness-contract → trustStateFromGraphState
 * to emit `trustState: 'unavailable'` per the widened contract.
 */
export function getGraphFreshness(rootDir: string): GraphFreshness {
  try {
    const state = detectState(rootDir);
    return state.freshness;
  } catch {
    return 'error';
  }
}

// ───────────────────────────────────────────────────────────────
// Read-only readiness snapshot
// ───────────────────────────────────────────────────────────────
// Surfaces the same `action` + `freshness` + `reason` triplet that
// `ensureCodeGraphReady` would emit, but WITHOUT mutating any state:
//   - no debounce cache writes
//   - no cleanup of deleted tracked files
//   - no inline indexing (full or selective)
//   - no `setLastGitHead` updates
//
// Used by `code_graph_status` so operators can distinguish
// "needs full scan" vs "needs selective reindex" vs "fresh"
// without invoking `code_graph_scan` (which mutates).

export interface GraphReadinessSnapshot {
  freshness: GraphFreshness;
  action: ReadyAction;
  reason: string;
}

/**
 * Compute the readiness action that `ensureCodeGraphReady` WOULD take,
 * without performing any mutation. Safe to call from `code_graph_status`
 * and any other read-only diagnostic surface.
 *
 * Reuses the detection-only branch of {@link detectState}; intentionally
 * does NOT touch the cache (`readinessDebounce`), the deleted-file cleanup
 * (`cleanupDeletedTrackedFiles`), or the inline indexer.
 *
 * On probe crash, returns `{ freshness: 'error', action: 'none', reason }`
 * so the consumer can render an unavailable state instead of inheriting an
 * exception.
 */
export function getGraphReadinessSnapshot(rootDir: string): GraphReadinessSnapshot {
  try {
    const state = detectState(rootDir);
    return {
      freshness: state.freshness,
      action: state.action,
      reason: state.reason,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      freshness: 'error',
      action: 'none',
      reason: `readiness probe crashed: ${msg}`,
    };
  }
}
