// ───────────────────────────────────────────────────────────────
// MODULE: Memory Index
// ───────────────────────────────────────────────────────────────
import path from 'path';
import { createHash } from 'node:crypto';
import type Database from 'better-sqlite3';

/* ───────────────────────────────────────────────────────────────
   1. CORE AND UTILS IMPORTS
──────────────────────────────────────────────────────────────── */

import { checkDatabaseUpdated } from '../core/index.js';
import { INDEX_SCAN_COOLDOWN, DEFAULT_BASE_PATH, BATCH_SIZE } from '../core/config.js';
import { beginMaintenance } from '../lib/storage/maintenance-marker.js';
import { acquireIndexScanLease, completeIndexScanLease, refreshScanLease } from '../core/db-state.js';
import { processBatches, requireDb, toErrorMessage, type RetryErrorResult } from '../utils/index.js';
import { ensureMemoryRuntimeInitialized } from '../lib/runtime/memory-runtime-guard.js';
import { getCanonicalPathKey } from '../lib/utils/canonical-path.js';
import {
  runTriggerEmbeddingBackfill,
  type TriggerEmbeddingBackfillResult,
} from '../lib/search/trigger-embedding-backfill.js';

/* ───────────────────────────────────────────────────────────────
   2. LIB MODULE IMPORTS
──────────────────────────────────────────────────────────────── */

import { recordHistory } from '../lib/storage/history.js';
import * as checkpoints from '../lib/storage/checkpoints.js';
import * as memoryParser from '../lib/parsing/memory-parser.js';
import * as embeddings from '../lib/providers/embeddings.js';
import * as incrementalIndex from '../lib/storage/incremental-index.js';
import * as causalEdges from '../lib/storage/causal-edges.js';
import * as vectorIndex from '../lib/search/vector-index.js';
import { promoteMetadataEdges } from '../lib/causal/frontmatter-promoter.js';
import { runPostMutationHooks } from './mutation-hooks.js';
import { createStatediffAction } from '../lib/storage/statediff.js';
import { repairIncompleteMarkers } from './save/enrichment-state.js';
import { isMemoryIdempotencyEnabled } from '../lib/storage/idempotency-receipts.js';
import { recordNearDuplicateCheck } from '../lib/storage/near-duplicate.js';
import {
  findConstitutionalFiles,
  findGraphMetadataFiles,
  findSpecDocuments,
  detectSpecLevel,
  type DiscoveryCapExceeded,
  type DiscoveryFileList,
} from './memory-index-discovery.js';
import {
  EMPTY_ALIAS_CONFLICT_SUMMARY,
  createDefaultDivergenceReconcileSummary,
  detectAliasConflictsFromIndex,
  summarizeAliasConflicts,
  runDivergenceReconcileHooks,
  type AliasConflictSummary,
  type DivergenceReconcileSummary,
} from './memory-index-alias.js';

// Standardized response structure
import { createMCPSuccessResponse, createMCPErrorResponse } from '../lib/response/envelope.js';
import { requiresGovernedIngest, validateGovernedIngest } from '../lib/governance/scope-governance.js';
import { recordMaintenanceRun } from '../lib/observability/retrieval-observability.js';
import {
  createJobId,
  createMaintenanceJob,
  setJobState,
  setJobPhase,
  setJobProgress,
  appendJobError,
  completeJob,
  isCancelRequestedFast,
} from '../lib/ops/job-store.js';

// Shared handler types
import type { MCPResponse, EmbeddingProfile } from './types.js';
import type { StatediffAction } from '../lib/storage/statediff.js';

// Feature catalog: Workspace scanning and indexing (memory_index_scan)
// Feature catalog: Async ingestion job lifecycle


/* ───────────────────────────────────────────────────────────────
   3. TYPES
──────────────────────────────────────────────────────────────── */

interface IndexResult {
  status: string;
  id?: number;
  specFolder?: string;
  title?: string | null;
  embeddingStatus?: string;
  error?: string;
  errorDetail?: string;
  [key: string]: unknown;
}

/** Type guard: distinguishes IndexResult from RetryErrorResult via the 'status' property */
function isIndexResult(result: IndexResult | RetryErrorResult): result is IndexResult {
  return (
    typeof result === 'object' &&
    result !== null &&
    typeof (result as { status?: unknown }).status === 'string' &&
    !('retries_failed' in result)
  );
}

function emptyDiscoveryCapExceeded(): DiscoveryCapExceeded {
  return { maxNodes: false, depth: false, gitignoreSize: false };
}

function mergeDiscoveryCapExceeded(...caps: Array<DiscoveryCapExceeded | undefined>): DiscoveryCapExceeded {
  return caps.reduce<DiscoveryCapExceeded>((merged, cap) => ({
    maxNodes: merged.maxNodes || cap?.maxNodes === true,
    depth: merged.depth || cap?.depth === true,
    gitignoreSize: merged.gitignoreSize || cap?.gitignoreSize === true,
  }), emptyDiscoveryCapExceeded());
}

function discoveryWarnings(files: string[] | DiscoveryFileList): string[] {
  const maybeWarnings = (files as Partial<DiscoveryFileList>).warnings;
  return Array.isArray(maybeWarnings) ? maybeWarnings : [];
}

function discoveryCaps(files: string[] | DiscoveryFileList): DiscoveryCapExceeded | undefined {
  return (files as Partial<DiscoveryFileList>).capExceeded;
}

/** Individual file result from a memory index scan. */
interface ScanFileEntry {
  file: string;
  filePath?: string;
  status?: string;
  specFolder?: string;
  id?: number;
  isSpecDoc?: boolean;
  isConstitutional?: boolean;
  error?: string;
  errorDetail?: string;
}

interface CheckpointRepairReport {
  sentinelPresent: boolean;
  attempted: boolean;
  completed: number;
  failed: number;
  skipped: number;
  cleared: boolean;
  error: string | null;
}

interface ScanResults {
  scanned: number;
  indexed: number;
  updated: number;
  unchanged: number;
  failed: number;
  deferred: number;
  skipped_mtime: number;
  mtimeUpdates: number;
  staleDeleted: number;
  staleDeleteFailed: number;
  postInsertEnrichmentRepaired: number;
  nearDuplicateRepaired: number;
  orphanSwept: number;
  orphanSweepFailed: number;
  orphanSweepScanned: number;
  orphanSweepNextCursor: number | null;
  moveReconciled?: number;
  files: ScanFileEntry[];
  constitutional: {
    found: number;
    indexed: number;
    alreadyIndexed: number;
  };
  incremental: {
    enabled: boolean;
    fast_path_skips: number;
    mtime_changed: number;
    metadataPromoter: {
      processed: number;
      resolved: number;
      inserted: number;
      skippedManual: number;
      staleTombstoned: number;
      staleDeleted: number;
      warnings: number;
    };
  };
  dedup: {
    inputTotal: number;
    uniqueTotal: number;
    duplicatesSkipped: number;
  };
  aliasConflicts: AliasConflictSummary;
  divergenceReconcile: DivergenceReconcileSummary;
  checkpointRepair: CheckpointRepairReport;
  triggerEmbeddingBackfill?: TriggerEmbeddingBackfillResult;
  warnings: string[];
  capExceeded: DiscoveryCapExceeded;
}

interface CategorizedFiles {
  toIndex: string[];
  toUpdate: string[];
  toSkip: string[];
  toDelete: string[];
}

interface ScanKeyOptions {
  spec_folder: string | null;
  force: boolean;
  incremental: boolean;
  include_constitutional: boolean;
  include_spec_docs: boolean;
}

interface RecordDeleteResult {
  deleted: number;
  failed: number;
  actions: StatediffAction[];
}

interface OrphanSweepDeleteResult {
  swept: number;
  failed: number;
  scannedRows: number;
  nextCursor: number | null;
  actions: StatediffAction[];
}

interface OrphanSweepCandidates {
  swept: number;
  nextCursor: number | null;
  scannedRows: number;
  orphanRecordIds?: number[];
}

const ORPHAN_SWEEP_LIMIT = 200;
const ORPHAN_SWEEP_CURSOR_KEY = 'memory_index.orphan_sweep.cursor';

function ensureConfigTable(database: Database.Database): void {
  database.exec('CREATE TABLE IF NOT EXISTS config (key TEXT PRIMARY KEY, value TEXT)');
}

function readOrphanSweepCursor(database: Database.Database): number {
  try {
    ensureConfigTable(database);
    const row = database.prepare('SELECT value FROM config WHERE key = ?').get(ORPHAN_SWEEP_CURSOR_KEY) as { value?: unknown } | undefined;
    const cursor = typeof row?.value === 'string' ? Number.parseInt(row.value, 10) : Number(row?.value);
    return Number.isFinite(cursor) && cursor > 0 ? Math.floor(cursor) : 0;
  } catch (_error: unknown) {
    return 0;
  }
}

function writeOrphanSweepCursor(database: Database.Database, cursor: number | null): void {
  try {
    ensureConfigTable(database);
    const nextCursor = Number.isFinite(cursor) && (cursor ?? 0) > 0 ? Math.floor(cursor ?? 0) : 0;
    database.prepare(`
      INSERT INTO config (key, value)
      VALUES (?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value
    `).run(ORPHAN_SWEEP_CURSOR_KEY, String(nextCursor));
  } catch (error: unknown) {
    console.warn('[memory-index-scan] Failed to persist orphan sweep cursor:', toErrorMessage(error));
  }
}

// Scan responsiveness diagnostics. A blocked event loop is the failure mode that
// breaks daemon re-election: it cannot answer a competing launcher's probe, so the
// launcher spawns a second daemon. Sampling timer drift distinguishes a true
// event-loop block from a phase that is merely slow but yields — the two need
// different fixes (chunk-and-yield vs launcher-side probe tolerance).
const LOOP_LAG_SAMPLE_MS = 250;
const LOOP_LAG_WARN_MS = 1000;

function emptyCheckpointRepairReport(): CheckpointRepairReport {
  return {
    sentinelPresent: false,
    attempted: false,
    completed: 0,
    failed: 0,
    skipped: 0,
    cleared: false,
    error: null,
  };
}

function runCheckpointNeedsRebuildRepairForScan(): CheckpointRepairReport {
  try {
    const repair = checkpoints.repairNeedsRebuildSentinel(requireDb(), {
      source: 'memory_index_scan',
      actor: 'mcp:memory_index_scan',
    });
    return {
      sentinelPresent: repair.sentinelPresent,
      attempted: repair.attempted,
      completed: repair.summary?.completed.length ?? 0,
      failed: repair.summary?.failed.length ?? 0,
      skipped: repair.summary?.skipped.length ?? 0,
      cleared: repair.cleared,
      error: repair.error,
    };
  } catch (error: unknown) {
    return {
      ...emptyCheckpointRepairReport(),
      sentinelPresent: true,
      attempted: true,
      error: toErrorMessage(error),
    };
  }
}

function createScanKey(options: ScanKeyOptions): string {
  const normalized = {
    spec_folder: options.spec_folder ?? null,
    force: !!options.force,
    incremental: !!options.incremental,
    include_constitutional: !!options.include_constitutional,
    include_spec_docs: !!options.include_spec_docs,
  };

  return createHash('sha256')
    .update(JSON.stringify(normalized))
    .digest('hex')
    .slice(0, 16);
}

interface ScanArgs {
  specFolder?: string | null;
  force?: boolean;
  includeConstitutional?: boolean;
  includeSpecDocs?: boolean;
  incremental?: boolean;
  // Opt-in: run the scan as a background job and return a jobId immediately.
  background?: boolean;
  tenantId?: string;
  userId?: string;
  agentId?: string;
  sessionId?: string;
  provenanceSource?: string;
  provenanceActor?: string;
  governedAt?: string;
  retentionPolicy?: 'keep' | 'ephemeral';
  deleteAfter?: string;
}

/* ───────────────────────────────────────────────────────────────
   4. SHARED INDEXING LOGIC
──────────────────────────────────────────────────────────────── */

import { indexMemoryFile } from './memory-save.js';
import type { GovernanceDecision } from '../lib/governance/scope-governance.js';
import type { WriteProvenanceContext } from '../lib/storage/write-provenance.js';

/** Index a single memory file, delegating to the shared indexMemoryFile logic */
async function indexSingleFile(
  filePath: string,
  force: boolean = false,
  options?: {
    qualityGateMode?: 'enforce' | 'warn-only';
    fromScan?: boolean;
    asyncEmbedding?: boolean;
    governance?: GovernanceDecision;
    provenance?: WriteProvenanceContext;
  },
): Promise<IndexResult> {
  return indexMemoryFile(filePath, {
    force,
    qualityGateMode: options?.qualityGateMode,
    fromScan: options?.fromScan,
    asyncEmbedding: options?.asyncEmbedding,
    governance: options?.governance,
    provenance: options?.provenance,
  });
}

/* ───────────────────────────────────────────────────────────────
   5. MEMORY INDEX SCAN HANDLER
──────────────────────────────────────────────────────────────── */

// Hooks let a background runner observe cancellation and report phase/progress.
// On the synchronous path every hook is undefined, so behavior is identical.
interface ScanRunContext {
  isCancelled?: () => boolean;
  onPhase?: (phase: string) => void;
  onProgress?: (progress: { processed: number; total: number }) => void;
}

// Pull the envelope.data field back out of an MCP response so status can echo it.
function extractEnvelopeData(response: MCPResponse): unknown {
  try {
    const text = (response as { content?: Array<{ text?: string }> })?.content?.[0]?.text;
    if (typeof text !== 'string') return null;
    const parsed = JSON.parse(text) as { data?: unknown };
    return parsed?.data ?? null;
  } catch (_error: unknown) {
    return null;
  }
}

// Persisted payload for debugging: scan shape only, no governance identifiers.
function redactScanArgs(args: ScanArgs): Record<string, unknown> {
  return {
    specFolder: args.specFolder ?? null,
    force: !!args.force,
    includeConstitutional: args.includeConstitutional !== false,
    includeSpecDocs: args.includeSpecDocs !== false,
    incremental: args.incremental !== false,
    background: true,
  };
}

function cancelledScanEnvelope(scanKey: string): MCPResponse {
  return createMCPSuccessResponse({
    tool: 'memory_index_scan',
    summary: 'Index scan cancelled before completion',
    data: { status: 'cancelled', cancelled: true, scanKey },
    hints: ['The scan was cancelled via memory_index_scan_cancel'],
  });
}

/** Run the full memory_index_scan operation. Hooks are no-ops on the synchronous path. */
async function runIndexScan(args: ScanArgs, ctx: ScanRunContext = {}): Promise<MCPResponse> {
  await ensureMemoryRuntimeInitialized('handler:memory_index_scan');
  const restoreBarrier = checkpoints.getRestoreBarrierStatus();
  if (restoreBarrier) {
    recordMaintenanceRun('memory_index_scan', { status: 'error' });
    return createMCPErrorResponse({
      tool: 'memory_index_scan',
      error: restoreBarrier.message,
      code: restoreBarrier.code,
      recovery: {
        hint: 'Retry memory_index_scan after checkpoint_restore maintenance completes.',
        actions: ['Wait for the restore to finish', 'Retry the index scan'],
        severity: 'warning',
      },
    });
  }

  const {
    specFolder: spec_folder = null,
    force = false,
    includeConstitutional: include_constitutional = true,
    includeSpecDocs: include_spec_docs = true,
    incremental = true
  } = args;
  const scanKey = createScanKey({
    spec_folder,
    force,
    incremental,
    include_constitutional,
    include_spec_docs,
  });
  const governedIngest = requiresGovernedIngest(args);
  const governanceDecision = validateGovernedIngest(args);
  if (!governanceDecision.allowed) {
    throw new Error(`Governed ingest rejected: ${governanceDecision.issues.join('; ')}`);
  }

  // Pre-flight dimension check
  try {
    const profile: EmbeddingProfile | null = embeddings.getEmbeddingProfile();
    if (profile) {
      console.error(`[memory_index_scan] Using embedding provider: ${profile.provider}, model: ${profile.model}, dimension: ${profile.dim}`);
    }
  } catch (dimCheckError: unknown) {
    const message = toErrorMessage(dimCheckError);
    console.warn('[memory_index_scan] Could not verify embedding dimension:', message);
  }

  await checkDatabaseUpdated();

  // Atomic scan lease check.
  // Reserve scan_started_at up front to avoid check-then-set race windows.
  const now = Date.now();
  const lease = await acquireIndexScanLease({
    now,
    cooldownMs: INDEX_SCAN_COOLDOWN,
    scanKey,
  });
  if (!lease.acquired) {
    let message: string;
    if (lease.reason === 'lease_active') {
      message = 'A scan is already in progress; this call coalesced onto it.';
    } else if (lease.reason === 'contention') {
      message = 'The index DB is briefly locked by another writer; retry shortly.';
    } else {
      message = 'A scan recently completed; this call coalesced onto the recent scan window.';
    }
    recordMaintenanceRun('memory_index_scan', {
      status: 'coalesced',
      counts: { waitSeconds: lease.waitSeconds },
      staleCandidates: 0,
    });
    return createMCPSuccessResponse({
      tool: 'memory_index_scan',
      summary: message,
      data: {
        success: true,
        coalesced: true,
        status: 'coalesced',
        reason: lease.reason,
        scanKey,
        waitSeconds: lease.waitSeconds,
        nextPollAfterMs: lease.waitSeconds * 1000,
        message,
      },
      hints: [message],
    });
  }

  let scanLeaseReleased = false;
  const releaseScanLease = async (options: { setCooldown?: boolean } = {}): Promise<void> => {
    if (scanLeaseReleased) return;
    scanLeaseReleased = true;
    await completeIndexScanLease(Date.now(), { setCooldown: options.setCooldown, scanKey });
  };

  const checkpointRepair = runCheckpointNeedsRebuildRepairForScan();

  // Keep the scan lease alive for the full duration of a long, multi-batch scan.
  // processBatches() runs all batches sequentially and may exceed the lease expiry
  // window (each batch waits on embedding/API latency). Without a periodic refresh
  // the lease can expire mid-scan, letting a concurrent caller treat it as stale and
  // launch a second parallel scan. Refresh well inside the expiry window (a third of
  // it) so a single missed beat never lets the lease lapse. .unref() keeps the timer
  // from holding the event loop open at shutdown; finally clears it before release.
  const leaseExpiryMs = lease.leaseExpiryMs;
  const leaseHeartbeatMs = Math.max(10000, Math.floor(leaseExpiryMs / 3));
  let leaseHeartbeat: ReturnType<typeof setInterval> | null = null;

  // Background scans pass an onPhase hook; the synchronous foreground path does not.
  // Gate diagnostics on it so the synchronous path's behavior stays identical.
  const instrument = typeof ctx.onPhase === 'function';
  let loopLagTimer: ReturnType<typeof setInterval> | null = null;
  let maxLoopLagMs = 0;

  try {
  leaseHeartbeat = setInterval(() => {
    refreshScanLease(undefined, undefined, scanKey);
  }, leaseHeartbeatMs);
  leaseHeartbeat.unref?.();

  if (instrument) {
    let loopLagExpectedAt = Date.now() + LOOP_LAG_SAMPLE_MS;
    loopLagTimer = setInterval(() => {
      const sampledAt = Date.now();
      const lag = sampledAt - loopLagExpectedAt;
      loopLagExpectedAt = sampledAt + LOOP_LAG_SAMPLE_MS;
      if (lag > maxLoopLagMs) maxLoopLagMs = lag;
      if (lag > LOOP_LAG_WARN_MS) {
        // A late sample means the loop was blocked since the prior tick; logged
        // adjacent to the phase=... line of whatever phase just ran, so the daemon
        // log timeline fingers the blocking phase.
        console.error(`[memory-index-scan] event-loop blocked ~${lag}ms between samples`);
      }
    }, LOOP_LAG_SAMPLE_MS);
    loopLagTimer.unref?.();
  }

  if (ctx.isCancelled?.()) {
    await releaseScanLease({ setCooldown: false });
    return cancelledScanEnvelope(scanKey);
  }
  ctx.onPhase?.('discovering');

  const workspacePath: string = DEFAULT_BASE_PATH;

  const constitutionalFiles: string[] = include_constitutional ? findConstitutionalFiles(workspacePath) : [];
  const specDocFiles = include_spec_docs
    ? findSpecDocuments(workspacePath, { specFolder: spec_folder })
    : Object.assign([], { warnings: [], capExceeded: emptyDiscoveryCapExceeded() }) as DiscoveryFileList;
  const graphMetadataFiles = include_spec_docs
    ? findGraphMetadataFiles(workspacePath, { specFolder: spec_folder })
    : Object.assign([], { warnings: [], capExceeded: emptyDiscoveryCapExceeded() }) as DiscoveryFileList;
  const walkerWarnings = [
    ...discoveryWarnings(specDocFiles),
    ...discoveryWarnings(graphMetadataFiles),
  ];
  const walkerCapExceeded = mergeDiscoveryCapExceeded(
    discoveryCaps(specDocFiles),
    discoveryCaps(graphMetadataFiles),
  );

  const canonicalKeyCache = new Map<string, string>();
  const getCachedKey = (filePath: string): string => {
    const cached = canonicalKeyCache.get(filePath);
    if (cached) {
      return cached;
    }

    const canonicalKey = getCanonicalPathKey(filePath);
    canonicalKeyCache.set(filePath, canonicalKey);
    return canonicalKey;
  };

  const mergedFiles = [...constitutionalFiles, ...specDocFiles, ...graphMetadataFiles];
  const specDocKeySet = new Set(
    [...specDocFiles, ...graphMetadataFiles].map((f) => getCachedKey(f)),
  );
  const seenCanonicalFiles = new Set<string>();
  const files: string[] = [];

  for (const filePath of mergedFiles) {
    const canonicalKey = getCachedKey(filePath);
    if (seenCanonicalFiles.has(canonicalKey)) {
      continue;
    }
    seenCanonicalFiles.add(canonicalKey);
    files.push(filePath);
  }

  const dedupDuplicatesSkipped = mergedFiles.length - files.length;
  if (dedupDuplicatesSkipped > 0) {
    console.error(`[memory-index-scan] Canonical dedup skipped ${dedupDuplicatesSkipped} alias path(s) (${mergedFiles.length} -> ${files.length})`);
  }

  const deleteIndexedRecordIds = (recordIds: number[]): RecordDeleteResult => {
    if (recordIds.length === 0) {
      return { deleted: 0, failed: 0, actions: [] };
    }

    let deleted = 0;
    let failed = 0;
    const actions: StatediffAction[] = [];

    for (const staleRecordId of recordIds) {
      try {
        const database = vectorIndex.getDb();
        const staleSnapshot = database?.prepare(
          'SELECT spec_folder, file_path FROM memory_index WHERE id = ?'
        ).get(staleRecordId) as { spec_folder?: string | null; file_path?: string | null } | undefined;

        // Mirror the CRUD/bulk-delete ordering: drop the memory row first, then its
        // causal edges, atomically in one transaction. The previous edges-then-row
        // sequence in two separate statements left a crash window where edges were
        // gone but the row survived, and deleted edges for a row that may not exist.
        const rowDeleted = database
          ? database.transaction(() => {
              if (!vectorIndex.deleteMemory(staleRecordId)) {
                return false;
              }
              causalEdges.init(database);
              causalEdges.deleteEdgesForMemory(String(staleRecordId), {
                reason: 'memory_index stale record cleanup',
                command: 'memory-index.deleteIndexedRecordIds',
                restoreContext: {
                  memoryId: staleRecordId,
                  specFolder: staleSnapshot?.spec_folder ?? null,
                  filePath: staleSnapshot?.file_path ?? null,
                },
              });
              return true;
            })()
          : vectorIndex.deleteMemory(staleRecordId);

        if (rowDeleted) {
          deleted++;
          actions.push(createStatediffAction('delete', {
            target: 'memory_index',
            key: String(staleRecordId),
            sourceOperation: 'scan',
            oldStateHash: null,
            newStateHash: null,
            metadata: {
              filePath: staleSnapshot?.file_path ?? null,
              specFolder: staleSnapshot?.spec_folder ?? null,
            },
          }));
          // Record DELETE history only after confirmed deletion.
          try {
            recordHistory(
              staleRecordId,
              'DELETE',
              staleSnapshot?.file_path ?? null,
              null,
              'mcp:memory_index_scan',
              staleSnapshot?.spec_folder ?? null,
            );
          } catch (_histErr: unknown) {
            // History recording is best-effort
          }
        } else {
          failed++;
        }
      } catch (_error: unknown) {
        failed++;
      }
    }

    return { deleted, failed, actions };
  };

  const deleteStaleIndexedRecords = (paths: string[]): RecordDeleteResult => {
    if (paths.length === 0) {
      return { deleted: 0, failed: 0, actions: [] };
    }

    return deleteIndexedRecordIds(incrementalIndex.listIndexedRecordIdsForDeletedPaths(paths));
  };

  const runGlobalOrphanSweep = (): OrphanSweepDeleteResult => {
    if (!('sweepOrphanIndexRows' in incrementalIndex)) {
      return { swept: 0, failed: 0, scannedRows: 0, nextCursor: null, actions: [] };
    }

    const sweepOrphanIndexRows = (incrementalIndex as {
      sweepOrphanIndexRows?: (options?: { limit?: number; cursor?: number; basePath?: string }) => OrphanSweepCandidates;
    }).sweepOrphanIndexRows;

    if (typeof sweepOrphanIndexRows !== 'function') {
      return { swept: 0, failed: 0, scannedRows: 0, nextCursor: null, actions: [] };
    }

    const database = vectorIndex.getDb();
    const cursor = database ? readOrphanSweepCursor(database) : 0;
    const sweep = sweepOrphanIndexRows({ limit: ORPHAN_SWEEP_LIMIT, cursor, basePath: workspacePath });
    const deleteResult = deleteIndexedRecordIds(sweep.orphanRecordIds ?? []);
    if (database) {
      writeOrphanSweepCursor(database, sweep.nextCursor);
    }
    return {
      swept: deleteResult.deleted,
      failed: deleteResult.failed,
      scannedRows: sweep.scannedRows,
      nextCursor: sweep.nextCursor,
      actions: deleteResult.actions,
    };
  };

  const runScanInvalidationHooks = (context: Record<string, unknown>, actions: readonly StatediffAction[]): void => {
    try {
      runPostMutationHooks('scan', { ...context, statediffActions: actions });
    } catch (error: unknown) {
      console.warn('[memory-index-scan] Post-mutation invalidation failed:', toErrorMessage(error));
    }
  };

  const triggerBackfillChangedRows = (result: TriggerEmbeddingBackfillResult): boolean => (
    result.readyRows > 0 || result.failedRows > 0 || result.pendingRows > 0
  );

  const createTriggerBackfillAction = (result: TriggerEmbeddingBackfillResult): StatediffAction => createStatediffAction('upsert', {
    target: 'memory_index',
    key: 'trigger-embedding-backfill',
    sourceOperation: 'scan',
    metadata: {
      readyRows: result.readyRows,
      failedRows: result.failedRows,
      pendingRows: result.pendingRows,
    },
  });

  const runScanHygieneSubscribers = (actions: readonly StatediffAction[]): void => {
    if (actions.length === 0) {
      return;
    }
    results.aliasConflicts = detectAliasConflictsFromIndex();
    results.divergenceReconcile = runDivergenceReconcileHooks(results.aliasConflicts);
  };

  const runPostInsertEnrichmentRepairBackfill = async (): Promise<number> => {
    try {
      const repairResult = await repairIncompleteMarkers(
        { database: requireDb(), plannerMode: 'full-auto' },
        { limit: BATCH_SIZE },
      );
      if (repairResult.failed > 0) {
        console.warn(`[memory-index-scan] Post-insert enrichment repair left ${repairResult.failed} failed marker(s)`);
      }
      return repairResult.repaired;
    } catch (error: unknown) {
      console.warn('[memory-index-scan] Post-insert enrichment repair skipped:', toErrorMessage(error));
      return 0;
    }
  };

  const runNearDuplicateRepairBackfill = async (): Promise<number> => {
    if (!isMemoryIdempotencyEnabled()) {
      return 0;
    }
    try {
      const database = requireDb();
      const rows = database.prepare(`
        SELECT id, spec_folder, title, content_text, content_hash,
               tenant_id, user_id, agent_id, session_id
        FROM memory_index
        WHERE parent_id IS NULL
          AND embedding_status = 'success'
          AND content_text IS NOT NULL
          AND (last_dedup_checked_at IS NULL OR updated_at > last_dedup_checked_at)
        ORDER BY id ASC
        LIMIT ?
      `).all(BATCH_SIZE) as Array<{
        id: number;
        spec_folder: string;
        title: string | null;
        content_text: string;
        content_hash: string | null;
        tenant_id: string | null;
        user_id: string | null;
        agent_id: string | null;
        session_id: string | null;
      }>;
      let repaired = 0;
      for (const row of rows) {
        try {
          const embeddingInput = row.title ? `${row.title}\n\n${row.content_text}` : row.content_text;
          const embedding = await embeddings.generateDocumentEmbedding(embeddingInput);
          recordNearDuplicateCheck({
            database,
            memoryId: row.id,
            specFolder: row.spec_folder,
            contentHash: row.content_hash,
            embedding,
            scope: {
              tenantId: row.tenant_id,
              userId: row.user_id,
              agentId: row.agent_id,
              sessionId: row.session_id,
            },
          });
          repaired++;
        } catch (error: unknown) {
          console.warn(`[memory-index-scan] Near-duplicate repair skipped for memory ${row.id}: ${toErrorMessage(error)}`);
        }
      }
      return repaired;
    } catch (error: unknown) {
      console.warn('[memory-index-scan] Near-duplicate repair skipped:', toErrorMessage(error));
      return 0;
    }
  };

  // Time each un-yielded tail phase: because these phases do not yield, their
  // wall-clock equals their event-loop-block duration, so this pinpoints a blocking
  // phase when read alongside the event-loop lag sampler. Entering a phase also fires
  // onPhase, which refreshes the busy marker — giving each phase a full TTL ahead.
  const timedPhase = async <T>(phase: string, fn: () => Promise<T> | T): Promise<T> => {
    ctx.onPhase?.(phase);
    if (!instrument) {
      return await fn();
    }
    const startedAt = Date.now();
    try {
      return await fn();
    } finally {
      console.error(`[memory-index-scan] phase=${phase} ms=${Date.now() - startedAt}`);
    }
  };

  if (files.length === 0) {
    let staleDeleted = 0;
    let staleDeleteFailed = 0;
    const orphanSweepResult = await timedPhase('orphan-sweep', () => runGlobalOrphanSweep());
    const postInsertEnrichmentRepaired = await timedPhase('enrichment-repair', () => runPostInsertEnrichmentRepairBackfill());
    const nearDuplicateRepaired = await timedPhase('near-dup-repair', () => runNearDuplicateRepairBackfill());

    if (incremental && !force) {
      const categorized: CategorizedFiles = incrementalIndex.categorizeFilesForIndexing([]);
      const staleDeleteResult = deleteStaleIndexedRecords(categorized.toDelete);
      staleDeleted = staleDeleteResult.deleted;
      staleDeleteFailed = staleDeleteResult.failed;
      if (staleDeleted > 0) {
        runScanInvalidationHooks({ staleDeleted, staleDeleteFailed, operation: 'stale-delete' }, staleDeleteResult.actions);
      }
    }

    const triggerEmbeddingBackfill = await timedPhase('trigger-backfill', () =>
      runTriggerEmbeddingBackfill(requireDb(), {
        isCancelled: () => ctx.isCancelled?.() ?? false,
      }));

    if (orphanSweepResult.swept > 0) {
      runScanInvalidationHooks({
        orphanSwept: orphanSweepResult.swept,
        orphanSweepFailed: orphanSweepResult.failed,
        operation: 'orphan-sweep',
      }, orphanSweepResult.actions);
    }
    if (postInsertEnrichmentRepaired > 0) {
      runScanInvalidationHooks({
        postInsertEnrichmentRepaired,
        operation: 'post-insert-enrichment-repair',
      }, [createStatediffAction('upsert', {
        target: 'graph_edge',
        key: 'post-insert-enrichment-repair',
        sourceOperation: 'scan',
        metadata: { postInsertEnrichmentRepaired },
      })]);
    }
    if (triggerBackfillChangedRows(triggerEmbeddingBackfill)) {
      runScanInvalidationHooks({
        triggerEmbeddingBackfill,
        operation: 'trigger-embedding-backfill',
      }, [createTriggerBackfillAction(triggerEmbeddingBackfill)]);
    }

    recordMaintenanceRun('memory_index_scan', {
      status: 'success',
      counts: {
        scanned: 0,
        indexed: 0,
        updated: 0,
        unchanged: 0,
        failed: 0,
        staleDeleted,
        staleDeleteFailed,
        orphanSwept: orphanSweepResult.swept,
      },
      staleCandidates: staleDeleted + staleDeleteFailed,
    });
    await releaseScanLease();
    return createMCPSuccessResponse({
      tool: 'memory_index_scan',
      summary: 'No memory files found',
      data: {
        status: 'complete',
        scanKey,
        scanned: 0,
        indexed: 0,
        updated: 0,
        unchanged: 0,
        failed: 0,
        staleDeleted,
        staleDeleteFailed,
        postInsertEnrichmentRepaired,
        nearDuplicateRepaired,
        triggerEmbeddingBackfill,
        orphanSwept: orphanSweepResult.swept,
        orphanSweepFailed: orphanSweepResult.failed,
        orphanSweepScanned: orphanSweepResult.scannedRows,
        orphanSweepNextCursor: orphanSweepResult.nextCursor,
        checkpointRepair,
        warnings: walkerWarnings,
        capExceeded: walkerCapExceeded,
      },
      hints: [
        ...(staleDeleted > 0 ? [`Removed ${staleDeleted} stale index record(s) for deleted files`] : []),
        ...(postInsertEnrichmentRepaired > 0 ? [`Repaired ${postInsertEnrichmentRepaired} incomplete post-insert enrichment marker(s)`] : []),
        ...(nearDuplicateRepaired > 0 ? [`Repaired ${nearDuplicateRepaired} near-duplicate marker(s)`] : []),
        ...(triggerEmbeddingBackfill.readyRows > 0 ? [`Backfilled ${triggerEmbeddingBackfill.readyRows} trigger embedding row(s)`] : []),
        ...(triggerEmbeddingBackfill.failedRows > 0 ? [`${triggerEmbeddingBackfill.failedRows} trigger embedding row(s) failed backfill`] : []),
        ...(orphanSweepResult.swept > 0 ? [`Swept ${orphanSweepResult.swept} orphan index record(s)`] : []),
        ...(orphanSweepResult.failed > 0 ? [`${orphanSweepResult.failed} orphan index record(s) could not be removed`] : []),
        ...(checkpointRepair.cleared ? [`Cleared checkpoint derived rebuild sentinel after repairing ${checkpointRepair.completed} step(s)`] : []),
        ...(checkpointRepair.attempted && !checkpointRepair.cleared ? ['Checkpoint derived rebuild repair did not complete; sentinel retained'] : []),
        ...(checkpointRepair.error ? [`Checkpoint derived rebuild repair error: ${checkpointRepair.error}`] : []),
        'Indexable files are canonical spec documents under specs/**/ (spec.md, plan.md, decision-record.md, implementation-summary.md, handover.md, etc.)',
        'Constitutional files go in .opencode/skills/*/constitutional/'
      ]
    });
  }

  const constitutionalSet = new Set(constitutionalFiles.map((filePath) => getCachedKey(filePath)));

  const results: ScanResults = {
    scanned: files.length,
    indexed: 0,
    updated: 0,
    unchanged: 0,
    failed: 0,
    deferred: 0,
    skipped_mtime: 0,
    mtimeUpdates: 0,
    staleDeleted: 0,
    staleDeleteFailed: 0,
    postInsertEnrichmentRepaired: 0,
    nearDuplicateRepaired: 0,
    orphanSwept: 0,
    orphanSweepFailed: 0,
    orphanSweepScanned: 0,
    orphanSweepNextCursor: null,
    files: [],
    constitutional: {
      found: constitutionalFiles.length,
      indexed: 0,
      alreadyIndexed: 0
    },
    incremental: {
      enabled: incremental && !force,
      fast_path_skips: 0,
      mtime_changed: 0,
      metadataPromoter: {
        processed: 0,
        resolved: 0,
        inserted: 0,
        skippedManual: 0,
        staleTombstoned: 0,
        staleDeleted: 0,
        warnings: 0,
      }
    },
    dedup: {
      inputTotal: mergedFiles.length,
      uniqueTotal: files.length,
      duplicatesSkipped: dedupDuplicatesSkipped,
    },
    aliasConflicts: { ...EMPTY_ALIAS_CONFLICT_SUMMARY },
    divergenceReconcile: createDefaultDivergenceReconcileSummary(),
    checkpointRepair,
    warnings: walkerWarnings,
    capExceeded: walkerCapExceeded,
  };
  const scanAppliedActions: StatediffAction[] = [];
  const returnedUnchangedSpecDocs: ScanFileEntry[] = [];

  let filesToIndex: string[] = files;
  let filesToDelete: string[] = [];

  if (incremental && !force) {
    const startCategorize = Date.now();
    const categorized: CategorizedFiles = incrementalIndex.categorizeFilesForIndexing(files);

    filesToIndex = [...categorized.toIndex, ...categorized.toUpdate];
    filesToDelete = categorized.toDelete;

    results.unchanged = categorized.toSkip.length;
    results.skipped_mtime = categorized.toSkip.length;
    results.incremental.fast_path_skips = categorized.toSkip.length;
    results.incremental.mtime_changed = categorized.toUpdate.length;

    for (const unchangedPath of categorized.toSkip) {
      if (specDocKeySet.has(getCachedKey(unchangedPath))) {
        returnedUnchangedSpecDocs.push({
          file: path.basename(unchangedPath),
          filePath: unchangedPath,
          status: 'unchanged',
          isSpecDoc: true,
        });
      }
      if (constitutionalSet.has(getCachedKey(unchangedPath))) {
        results.constitutional.alreadyIndexed++;
      }
    }

    const categorizeTime = Date.now() - startCategorize;
    console.error(`[memory-index-scan] Incremental mode: ${filesToIndex.length}/${files.length} files need indexing (categorized in ${categorizeTime}ms)`);
    console.error(`[memory-index-scan] Fast-path skips: ${results.incremental.fast_path_skips}, Mtime changed: ${results.incremental.mtime_changed}`);
  }

  // Attempt move reconciliation before full delete+reindex cycle.
  // Pairs a vanished path with a new path by grandparent dir + basename (a sibling folder
  // rename), gated by the new folder still carrying a packet_id and by DB uniqueness +
  // stored-document_type cross-checks; the matched row is updated in place.
  if (filesToDelete.length > 0 && filesToIndex.length > 0) {
    const moveResult = incrementalIndex.reconcileMoves(filesToDelete, filesToIndex);
    if (moveResult.reconciled.length > 0) {
      results.moveReconciled = moveResult.reconciled.length;
      filesToDelete = moveResult.filteredToDelete;
      filesToIndex = moveResult.filteredToIndex;
      console.error(`[memory-index-scan] Move reconciled ${moveResult.reconciled.length} path(s) in place`);
    }
  }

  const plannedScanActions = [
    ...filesToIndex.map((filePath) => createStatediffAction('upsert', {
      target: 'memory_index',
      key: getCachedKey(filePath),
      sourceOperation: 'scan',
      metadata: { filePath },
    })),
    ...filesToDelete.map((filePath) => createStatediffAction('delete', {
      target: 'memory_index',
      key: getCachedKey(filePath),
      sourceOperation: 'scan',
      metadata: { filePath },
    })),
  ];
  if (plannedScanActions.length > 0) {
    console.error(`[memory-index-scan] Statediff plan: ${plannedScanActions.length} action(s) before scan writes`);
  }

  // Track successfully indexed files for post-indexing mtime update.
  // SAFETY INVARIANT: mtime markers are updated ONLY after indexing succeeds.
  // Failed files keep their old mtime so shouldReindex() returns 'modified'
  // Or 'new' on the next scan, ensuring automatic retry. Moving this update
  // Before indexing would cause silent data loss — a failed file would be
  // Marked "already indexed" and permanently skipped.
  const successfullyIndexedFiles: string[] = [];
  const scanBatchSize = BATCH_SIZE;

  ctx.onPhase?.('indexing');
  ctx.onProgress?.({ processed: 0, total: filesToIndex.length });

  if (filesToIndex.length > 0) {
    let processedInScan = 0;
    const batchResults = await processBatches(filesToIndex, async (filePath: string) => {
      // Cancellation is checked between files (mirrors ingest). A cancelled file is
      // returned as a no-op so its mtime is never bumped, preserving retry on re-run.
      if (ctx.isCancelled?.()) {
        return { status: 'cancelled' } as IndexResult;
      }
      const isSpecDoc = specDocKeySet.has(getCachedKey(filePath));
      // Constitutional markdown is policy text, not evidence-bearing memory.
      // It does not carry primary-evidence sections or ANCHOR tags by design, so the
      // strict sufficiency gate would always reject it. Treat constitutional files like
      // spec docs and pass them through warn-only mode so they index against the same
      // pipeline without the document-evidence requirements.
      const isConstitutional = constitutionalSet.has(getCachedKey(filePath));
      // During force reindex, use warn-only for all files — the goal is to index
      // everything that has valid frontmatter, not to enforce template contracts on
      // older files created before current templates were established.
      const useWarnOnly = force || isSpecDoc || isConstitutional;
      const indexResult = await indexSingleFile(filePath, force, {
        ...(useWarnOnly ? { qualityGateMode: 'warn-only' as const } : {}),
        fromScan: true,
        asyncEmbedding: true,
        governance: governedIngest ? governanceDecision : undefined,
      });
      processedInScan += 1;
      ctx.onProgress?.({ processed: processedInScan, total: filesToIndex.length });
      return indexResult;
    }, scanBatchSize, undefined, { shouldAbort: () => ctx.isCancelled?.() ?? false });

    for (let i = 0; i < batchResults.length; i++) {
      const result = batchResults[i];
      const filePath = filesToIndex[i];
      const isSpecDoc = specDocKeySet.has(getCachedKey(filePath));
      const isConstitutional = constitutionalSet.has(getCachedKey(filePath));

      if (result.error) {
        results.failed++;
        results.files.push({
          file: path.basename(filePath),
          filePath,
          status: 'failed',
          error: result.error,
          errorDetail: result.errorDetail
        });
      } else if (isIndexResult(result)) {
        const isSuccessfulStatus =
          result.status === 'success' ||
          result.status === 'indexed' ||
          result.status === 'updated' ||
          result.status === 'unchanged' ||
          result.status === 'reinforced' ||
          result.status === 'duplicate' ||
          result.status === 'deferred';
        // A cancelled file was never indexed and was never going to be: counting it
        // as a failure would attribute an operator-requested stop to a file error.
        // It is neither success nor failure, so it falls through both tallies.
        if (!isSuccessfulStatus && result.status !== 'cancelled') {
          results.failed++;
        }

        if (result.status === 'indexed') {
          results.indexed++;
          successfullyIndexedFiles.push(filePath);
          scanAppliedActions.push(createStatediffAction('insert', {
            target: 'memory_index',
            key: String(result.id ?? getCachedKey(filePath)),
            sourceOperation: 'scan',
            metadata: { filePath, specFolder: result.specFolder ?? null, status: result.status },
          }));
        } else if (result.status === 'updated') {
          results.updated++;
          successfullyIndexedFiles.push(filePath);
          scanAppliedActions.push(createStatediffAction('upsert', {
            target: 'memory_index',
            key: String(result.id ?? getCachedKey(filePath)),
            sourceOperation: 'scan',
            metadata: { filePath, specFolder: result.specFolder ?? null, status: result.status },
          }));
        } else if (result.status === 'unchanged') {
          results.unchanged++;
          successfullyIndexedFiles.push(filePath);
          if (isSpecDoc) {
            returnedUnchangedSpecDocs.push({
              file: path.basename(filePath),
              filePath,
              specFolder: result.specFolder,
              status: result.status,
              id: result.id,
              isSpecDoc,
              isConstitutional,
            });
          }
        } else if (result.status === 'reinforced') {
          results.updated++;
          successfullyIndexedFiles.push(filePath);
          scanAppliedActions.push(createStatediffAction('upsert', {
            target: 'memory_index',
            key: String(result.id ?? getCachedKey(filePath)),
            sourceOperation: 'scan',
            metadata: { filePath, specFolder: result.specFolder ?? null, status: result.status },
          }));
        } else if (result.status === 'duplicate') {
          results.unchanged++;
          successfullyIndexedFiles.push(filePath);
        } else if (result.status === 'deferred') {
          results.indexed++;
          successfullyIndexedFiles.push(filePath);
          scanAppliedActions.push(createStatediffAction('insert', {
            target: 'memory_index',
            key: String(result.id ?? getCachedKey(filePath)),
            sourceOperation: 'scan',
            metadata: { filePath, specFolder: result.specFolder ?? null, status: result.status },
          }));
        }

        if (result.status === 'deferred' || result.embeddingStatus === 'pending') {
          results.deferred++;
        }

        if (isConstitutional) {
          if (result.status === 'indexed') {
            results.constitutional.indexed++;
          } else if (result.status === 'unchanged') {
            results.constitutional.alreadyIndexed++;
          }
        }

        if (result.status !== 'unchanged') {
          const rejectionDetail = !isSuccessfulStatus
            ? {
                ...(typeof result.rejectionCode === 'string' && result.rejectionCode.length > 0
                  ? { rejectionCode: result.rejectionCode }
                  : {}),
                ...(typeof result.rejectionReason === 'string' && result.rejectionReason.length > 0
                  ? { rejectionReason: result.rejectionReason }
                  : (typeof result.message === 'string' && result.message.length > 0
                    ? { rejectionReason: result.message }
                    : {})),
                ...(typeof result.error === 'string' && result.error.length > 0
                  ? { error: result.error }
                  : {}),
              }
            : {};

          results.files.push({
            file: path.basename(filePath),
            filePath,
            specFolder: result.specFolder,
            status: result.status,
            id: result.id,
            isSpecDoc,
            isConstitutional,
            ...rejectionDetail,
          });
        }
      } else {
        results.failed++;
        results.files.push({
          file: path.basename(filePath),
          filePath,
          status: 'failed',
          error: 'Unexpected batch result shape',
          errorDetail: JSON.stringify(result),
        });
      }
    }
  }

  // Update mtimes ONLY for successfully indexed files, not before indexing.
  // Failed files keep their old mtime so they are retried on next scan.
  // This is the ONLY place where scan-triggered mtime updates occur.
  // See also: indexMemoryFile() sets file_mtime_ms within its DB transaction,
  // Which rolls back atomically on failure — a complementary safety mechanism.
  if (successfullyIndexedFiles.length > 0) {
    const mtimeUpdateResult = incrementalIndex.batchUpdateMtimes(successfullyIndexedFiles);
    results.mtimeUpdates = mtimeUpdateResult.updated;
  }

  if (include_spec_docs) {
    const database = requireDb();
    let promoterYieldCount = 0;
    for (const fileResult of results.files) {
      // This sweep is synchronous SQLite over EVERY indexed row. On a force scan
      // that is the whole corpus, so without a periodic macrotask yield the event
      // loop is starved for the duration and no IPC (status, cancel, health,
      // search) can be serviced. Yield and re-check cancellation between rows; the
      // yield lands between self-contained promoteMetadataEdges transactions, never
        // inside one, so atomicity on the shared connection is preserved.
        if (++promoterYieldCount % 200 === 0) {
          if (ctx.isCancelled?.()) {
            await releaseScanLease({ setCooldown: false });
            return cancelledScanEnvelope(scanKey);
          }
        await new Promise<void>((resolve) => setImmediate(resolve));
      }
      if (!fileResult.id || !fileResult.filePath || fileResult.status === 'failed') {
        continue;
      }
      try {
        const promotion = promoteMetadataEdges(database, {
          memoryId: fileResult.id,
          filePath: fileResult.filePath,
        });
        results.incremental.metadataPromoter.processed += promotion.processed;
        results.incremental.metadataPromoter.resolved += promotion.resolved;
        results.incremental.metadataPromoter.inserted += promotion.inserted;
        results.incremental.metadataPromoter.skippedManual += promotion.skippedManual;
        results.incremental.metadataPromoter.staleTombstoned += promotion.staleTombstoned;
        results.incremental.metadataPromoter.staleDeleted += promotion.staleDeleted;
        results.incremental.metadataPromoter.warnings += promotion.warnings.length;
        for (const warning of promotion.warnings) {
          results.warnings.push(`Metadata edge promoter: ${warning.field} ${warning.reference}: ${warning.message}`);
        }
      } catch (error: unknown) {
        results.warnings.push(`Metadata edge promoter failed for ${fileResult.filePath}: ${toErrorMessage(error)}`);
      }
    }
  }

  if (ctx.isCancelled?.()) {
    await releaseScanLease({ setCooldown: false });
    return cancelledScanEnvelope(scanKey);
  }
  ctx.onPhase?.('post-processing');

  if (filesToDelete.length > 0) {
    if (results.failed === 0) {
      const staleDeleteResult = deleteStaleIndexedRecords(filesToDelete);
      results.staleDeleted = staleDeleteResult.deleted;
      results.staleDeleteFailed = staleDeleteResult.failed;
      scanAppliedActions.push(...staleDeleteResult.actions);
    } else {
      console.warn('[memory-index-scan] Deferring stale cleanup because one or more replacement files failed to index');
    }
  }

  const orphanSweepResult = await timedPhase('orphan-sweep', () => runGlobalOrphanSweep());
  results.orphanSwept = orphanSweepResult.swept;
  results.orphanSweepFailed = orphanSweepResult.failed;
  results.orphanSweepScanned = orphanSweepResult.scannedRows;
  results.orphanSweepNextCursor = orphanSweepResult.nextCursor;
  scanAppliedActions.push(...orphanSweepResult.actions);

  results.postInsertEnrichmentRepaired = await timedPhase('enrichment-repair', () => runPostInsertEnrichmentRepairBackfill());
  if (results.postInsertEnrichmentRepaired > 0) {
    scanAppliedActions.push(createStatediffAction('upsert', {
      target: 'graph_edge',
      key: 'post-insert-enrichment-repair',
      sourceOperation: 'scan',
      metadata: { postInsertEnrichmentRepaired: results.postInsertEnrichmentRepaired },
    }));
  }

  results.triggerEmbeddingBackfill = await timedPhase('trigger-backfill', () =>
    runTriggerEmbeddingBackfill(requireDb(), { isCancelled: () => ctx.isCancelled?.() ?? false }));
  if (triggerBackfillChangedRows(results.triggerEmbeddingBackfill)) {
    scanAppliedActions.push(createTriggerBackfillAction(results.triggerEmbeddingBackfill));
  }
  results.nearDuplicateRepaired = await timedPhase('near-dup-repair', () => runNearDuplicateRepairBackfill());

  // Create causal chains between spec folder documents.
  // Includes deferred indexing outcomes and incremental single-file updates.
  if (include_spec_docs) {
    try {
      // Determine which spec folders had spec document changes in this scan.
      // We use parsed document type (not basename) to avoid false positives
      // From memory/plan.md or similar filenames.
      const affectedSpecFolders = new Set<string>();
      for (const fileResult of results.files) {
        if (!fileResult.specFolder || fileResult.status === 'failed') {
          continue;
        }

        if (!fileResult.filePath) {
          continue;
        }

        const docType = memoryParser.extractDocumentType(fileResult.filePath);
        if (
          docType !== 'memory' &&
          docType !== 'constitutional'
        ) {
          affectedSpecFolders.add(fileResult.specFolder);
        }
      }

      if (affectedSpecFolders.size > 0) {
        const database = requireDb();
        const { createSpecDocumentChain, init: initCausalEdges } = await import('../lib/storage/causal-edges.js');
        initCausalEdges(database);

        // Build full per-folder document map from DB (not just this scan's files).
        const selectDocIds = database.prepare(`
          SELECT document_type, MAX(id) AS id
          FROM memory_index
          WHERE spec_folder = ?
            AND document_type IN ('spec', 'plan', 'tasks', 'checklist', 'decision_record', 'implementation_summary', 'research', 'handover', 'graph_metadata')
          GROUP BY document_type
        `);

        let chainsCreated = 0;
        let foldersProcessed = 0;
        let chainYieldCount = 0;

        for (const folder of affectedSpecFolders) {
          // Per-folder synchronous DB work; yield + cancel-check between folders so a
          // large affected set cannot block the event loop (same rationale as the
          // metadata-edge sweep above).
          if (++chainYieldCount % 50 === 0) {
            if (ctx.isCancelled?.()) {
              await releaseScanLease({ setCooldown: false });
              return cancelledScanEnvelope(scanKey);
            }
            await new Promise<void>((resolve) => setImmediate(resolve));
          }
          const rows = selectDocIds.all(folder) as Array<{ document_type: string; id: number }>;
          const docIds: Record<string, number> = {};

          for (const row of rows) {
            if (row.document_type && typeof row.id === 'number') {
              docIds[row.document_type] = row.id;
            }
          }

          if (Object.keys(docIds).length >= 2) {
            const chainResult = createSpecDocumentChain(docIds);
            chainsCreated += chainResult.inserted;
            foldersProcessed++;
          }
        }

        if (chainsCreated > 0) {
          console.error(`[memory-index-scan] Created ${chainsCreated} causal chain edges across ${foldersProcessed} spec folders`);
        }
      }
    } catch (err: unknown) {
      const message = toErrorMessage(err);
      console.warn('[memory-index-scan] Causal chain creation failed:', message);
    }
  }

  if (results.indexed > 0 || results.updated > 0 || results.staleDeleted > 0 || results.orphanSwept > 0 || results.postInsertEnrichmentRepaired > 0 || triggerBackfillChangedRows(results.triggerEmbeddingBackfill)) {
    runScanInvalidationHooks({
      indexed: results.indexed,
      updated: results.updated,
      staleDeleted: results.staleDeleted,
      staleDeleteFailed: results.staleDeleteFailed,
      ...(triggerBackfillChangedRows(results.triggerEmbeddingBackfill)
        ? { triggerEmbeddingBackfill: results.triggerEmbeddingBackfill }
        : {}),
      ...(results.postInsertEnrichmentRepaired > 0
        ? { postInsertEnrichmentRepaired: results.postInsertEnrichmentRepaired }
        : {}),
      ...(results.orphanSwept > 0 || results.orphanSweepFailed > 0
        ? {
            orphanSwept: results.orphanSwept,
            orphanSweepFailed: results.orphanSweepFailed,
          }
        : {}),
    }, scanAppliedActions);
  }

  runScanHygieneSubscribers(scanAppliedActions);

  const summary = `Scan complete: ${results.indexed} indexed, ${results.updated} updated, ${results.unchanged} unchanged, ${results.staleDeleted} deleted, ${results.orphanSwept} orphan swept, ${results.failed} failed`;

  const hints: string[] = [];
  if (results.failed > 0) {
    hints.push(`${results.failed} files failed to index - check file format`);
  }
  if (filesToDelete.length > 0 && results.failed > 0 && results.staleDeleted === 0 && results.staleDeleteFailed === 0) {
    hints.push('Deferred stale index cleanup because one or more replacement files failed to index');
  }
  if (results.staleDeleted > 0) {
    hints.push(`Removed ${results.staleDeleted} stale index record(s) for deleted files`);
  }
  if (results.staleDeleteFailed > 0) {
    hints.push(`${results.staleDeleteFailed} stale index record(s) could not be removed`);
  }
  if (results.orphanSwept > 0) {
    hints.push(`Swept ${results.orphanSwept} orphan index record(s)`);
  }
  if (results.postInsertEnrichmentRepaired > 0) {
    hints.push(`Repaired ${results.postInsertEnrichmentRepaired} incomplete post-insert enrichment marker(s)`);
  }
  if (results.nearDuplicateRepaired > 0) {
    hints.push(`Repaired ${results.nearDuplicateRepaired} near-duplicate marker(s)`);
  }
  if (results.triggerEmbeddingBackfill?.readyRows) {
    hints.push(`Backfilled ${results.triggerEmbeddingBackfill.readyRows} trigger embedding row(s)`);
  }
  if (results.triggerEmbeddingBackfill?.failedRows) {
    hints.push(`${results.triggerEmbeddingBackfill.failedRows} trigger embedding row(s) failed backfill`);
  }
  if (results.orphanSweepFailed > 0) {
    hints.push(`${results.orphanSweepFailed} orphan index record(s) could not be removed`);
  }
  if (results.dedup.duplicatesSkipped > 0) {
    hints.push(`Canonical dedup skipped ${results.dedup.duplicatesSkipped} alias path(s)`);
  }
  if (results.aliasConflicts.groups > 0) {
    hints.push(`Detected ${results.aliasConflicts.groups} specs/.opencode alias group(s); no automatic mutation performed`);
  }
  if (results.aliasConflicts.divergentHashGroups > 0) {
    hints.push(`${results.aliasConflicts.divergentHashGroups} alias group(s) have divergent content hashes`);
  }
  if (results.divergenceReconcile.retriesScheduled > 0) {
    hints.push(`Auto-reconcile scheduled for ${results.divergenceReconcile.retriesScheduled} divergent alias sample(s)`);
  }
  if (results.divergenceReconcile.escalated > 0) {
    hints.push(`Auto-reconcile exhausted for ${results.divergenceReconcile.escalated} sample(s); manual triage required`);
  }
  if (results.divergenceReconcile.errors.length > 0) {
    hints.push(`Auto-reconcile hook encountered ${results.divergenceReconcile.errors.length} error(s)`);
  }
  if (results.checkpointRepair.cleared) {
    hints.push(`Cleared checkpoint derived rebuild sentinel after repairing ${results.checkpointRepair.completed} step(s)`);
  }
  if (results.checkpointRepair.attempted && !results.checkpointRepair.cleared) {
    hints.push('Checkpoint derived rebuild repair did not complete; sentinel retained');
  }
  if (results.checkpointRepair.error) {
    hints.push(`Checkpoint derived rebuild repair error: ${results.checkpointRepair.error}`);
  }
  if (results.incremental.enabled && results.incremental.fast_path_skips > 0) {
    hints.push(`Incremental mode saved time: ${results.incremental.fast_path_skips} files skipped via mtime check`);
  }
  if (results.indexed + results.updated === 0 && results.unchanged > 0) {
    hints.push('All files already up-to-date. Use force: true to re-index');
  }

  await releaseScanLease();
  const returnedFiles = returnedUnchangedSpecDocs.length > 0
    ? [...results.files, ...returnedUnchangedSpecDocs]
    : results.files;

  recordMaintenanceRun('memory_index_scan', {
    status: 'success',
    counts: {
      scanned: results.scanned,
      indexed: results.indexed,
      updated: results.updated,
      unchanged: results.unchanged,
      failed: results.failed,
      staleDeleted: results.staleDeleted,
      staleDeleteFailed: results.staleDeleteFailed,
      orphanSwept: results.orphanSwept,
    },
    staleCandidates: filesToDelete.length,
  });

  return createMCPSuccessResponse({
    tool: 'memory_index_scan',
    summary,
    data: {
      status: results.deferred > 0 ? 'complete_with_pending_vectors' : 'complete',
      ...(results.deferred > 0 ? { pendingVectors: results.deferred } : {}),
      scanKey,
      batchSize: scanBatchSize,
      ...results,
      files: returnedFiles,
      ...(process.env.SPECKIT_DEBUG_INDEX_SCAN === 'true'
        ? {
            _debug_fileCounts: {
              constitutionalFiles: constitutionalFiles.length,
              specDocFiles: specDocFiles.length,
              totalFiles: files.length,
              mergedFiles: mergedFiles.length,
              dedupSkipped: dedupDuplicatesSkipped,
              includeSpecDocs: include_spec_docs,
              workspacePath,
            },
          }
        : {})
    },
    hints
  });
  } finally {
    if (leaseHeartbeat) {
      clearInterval(leaseHeartbeat);
      leaseHeartbeat = null;
    }
    if (loopLagTimer) {
      clearInterval(loopLagTimer);
      loopLagTimer = null;
      console.error(`[memory-index-scan] max-event-loop-lag ms=${maxLoopLagMs}`);
    }
    await releaseScanLease();
  }
}

/** Handle memory_index_scan tool — dispatches to a synchronous run or a background job.
 *  Without background the call is byte-for-byte identical to the prior synchronous path. */
async function handleMemoryIndexScan(args: ScanArgs): Promise<MCPResponse> {
  if (!args.background) {
    return runIndexScan(args, {});
  }

  const jobId = createJobId();
  await createMaintenanceJob({ id: jobId, kind: 'index_scan', payload: redactScanArgs(args) });

  setImmediate(() => {
    void (async () => {
      // Mark the daemon busy-by-design so a competing launcher adopts it rather
      // than reaping it mid-scan. The shared marker is reference-counted, so the
      // background-embedding queue draining this scan's deferred embeddings can
      // keep it held past the scan itself.
      const maintenance = beginMaintenance('index_scan');
      try {
        await setJobState(jobId, 'running');
        const response = await runIndexScan(args, {
          isCancelled: () => isCancelRequestedFast(jobId),
          onPhase: (phase) => {
            // Refresh at each phase boundary so a long synchronous tail phase (which
            // cannot fire the interval timer) still enters with a full TTL ahead.
            maintenance.refresh();
            void setJobPhase(jobId, phase).catch(() => {});
          },
          onProgress: (progress) => { void setJobProgress(jobId, progress).catch(() => {}); },
        });
        const scanData = extractEnvelopeData(response);
        const wasCancelled = !!(scanData && typeof scanData === 'object'
          && (scanData as { cancelled?: unknown }).cancelled === true);
        if (wasCancelled) {
          // The run itself short-circuited on cancellation. A cancel that arrives
          // after the scan already finished does not retroactively cancel it.
          await completeJob(jobId, { state: 'cancelled', result: scanData });
        } else if (response.isError === true) {
          // An error envelope (not a thrown error) still means the scan failed.
          await appendJobError(jobId, '__scan__', scanData);
          await setJobState(jobId, 'failed');
        } else {
          await completeJob(jobId, { state: 'complete', result: scanData });
        }
      } catch (error: unknown) {
        try {
          await appendJobError(jobId, '__job__', error);
          await setJobState(jobId, 'failed');
        } catch (_secondaryError: unknown) {
          // Best-effort failure record; never surface a background unhandled rejection.
        }
      } finally {
        // Covers every terminal exit (complete / cancelled / failed / thrown).
        // Release this scan's hold; the marker stays present only while the
        // background-embedding queue still holds it.
        maintenance.end();
      }
    })();
  });

  return createMCPSuccessResponse({
    tool: 'memory_index_scan',
    summary: `Queued background index scan ${jobId}`,
    data: { jobId, state: 'queued', background: true },
    hints: [
      'Use memory_index_scan_status with jobId to poll progress',
      'Use memory_index_scan_cancel with jobId to stop the scan',
    ],
  });
}

/* ───────────────────────────────────────────────────────────────
   6. EXPORTS
──────────────────────────────────────────────────────────────── */

export {
  handleMemoryIndexScan,
  indexSingleFile,
  findConstitutionalFiles,
  findSpecDocuments,
  detectSpecLevel,
  summarizeAliasConflicts,
  runDivergenceReconcileHooks,
  readOrphanSweepCursor,
  writeOrphanSweepCursor,
};

// Backward-compatible aliases (snake_case)
const handle_memory_index_scan = handleMemoryIndexScan;
const index_single_file = indexSingleFile;
const find_constitutional_files = findConstitutionalFiles;
const find_spec_documents = findSpecDocuments;
const detect_spec_level = detectSpecLevel;
const summarize_alias_conflicts = summarizeAliasConflicts;
const run_divergence_reconcile_hooks = runDivergenceReconcileHooks;

export {
  handle_memory_index_scan,
  index_single_file,
  find_constitutional_files,
  find_spec_documents,
  detect_spec_level,
  summarize_alias_conflicts,
  run_divergence_reconcile_hooks,
};
