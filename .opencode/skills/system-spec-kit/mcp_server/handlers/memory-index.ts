// ───────────────────────────────────────────────────────────────
// MODULE: Memory Index
// ───────────────────────────────────────────────────────────────
import path from 'path';
import { createHash } from 'node:crypto';

/* ───────────────────────────────────────────────────────────────
   1. CORE AND UTILS IMPORTS
──────────────────────────────────────────────────────────────── */

import { checkDatabaseUpdated } from '../core/index.js';
import { INDEX_SCAN_COOLDOWN, DEFAULT_BASE_PATH, BATCH_SIZE } from '../core/config.js';
import { acquireIndexScanLease, completeIndexScanLease, refreshScanLease } from '../core/db-state.js';
import { processBatches, requireDb, toErrorMessage, type RetryErrorResult } from '../utils/index.js';
import { ensureMemoryRuntimeInitialized } from '../lib/runtime/memory-runtime-guard.js';
import { getCanonicalPathKey } from '../lib/utils/canonical-path.js';

/* ───────────────────────────────────────────────────────────────
   2. LIB MODULE IMPORTS
──────────────────────────────────────────────────────────────── */

import { recordHistory } from '../lib/storage/history.js';
import * as checkpoints from '../lib/storage/checkpoints.js';
import * as memoryParser from '../lib/parsing/memory-parser.js';
import * as embeddings from '../lib/providers/embeddings.js';
import * as incrementalIndex from '../lib/storage/incremental-index.js';
import * as vectorIndex from '../lib/search/vector-index.js';
import { runPostMutationHooks } from './mutation-hooks.js';
import { repairIncompleteMarkers } from './save/enrichment-state.js';
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
import { validateGovernedIngest } from '../lib/governance/scope-governance.js';

// Shared handler types
import type { MCPResponse, EmbeddingProfile } from './types.js';

// Feature catalog: Workspace scanning and indexing (memory_index_scan)
// Feature catalog: Async ingestion job lifecycle


/* ───────────────────────────────────────────────────────────────
   4. TYPES
──────────────────────────────────────────────────────────────── */

interface IndexResult {
  status: string;
  id?: number;
  specFolder?: string;
  title?: string | null;
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
  };
  dedup: {
    inputTotal: number;
    uniqueTotal: number;
    duplicatesSkipped: number;
  };
  aliasConflicts: AliasConflictSummary;
  divergenceReconcile: DivergenceReconcileSummary;
  checkpointRepair: CheckpointRepairReport;
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
}

interface OrphanSweepDeleteResult {
  swept: number;
  failed: number;
  scannedRows: number;
  nextCursor: number | null;
}

interface OrphanSweepCandidates {
  swept: number;
  nextCursor: number | null;
  scannedRows: number;
  orphanRecordIds?: number[];
}

const ORPHAN_SWEEP_LIMIT = 200;

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
   5. SHARED INDEXING LOGIC
──────────────────────────────────────────────────────────────── */

import { indexMemoryFile } from './memory-save.js';

/** Index a single memory file, delegating to the shared indexMemoryFile logic */
async function indexSingleFile(
  filePath: string,
  force: boolean = false,
  options?: {
    qualityGateMode?: 'enforce' | 'warn-only';
    fromScan?: boolean;
    asyncEmbedding?: boolean;
  },
): Promise<IndexResult> {
  return indexMemoryFile(filePath, {
    force,
    qualityGateMode: options?.qualityGateMode,
    fromScan: options?.fromScan,
    asyncEmbedding: options?.asyncEmbedding,
  });
}

/* ───────────────────────────────────────────────────────────────
   6. MEMORY INDEX SCAN HANDLER
──────────────────────────────────────────────────────────────── */

/** Handle memory_index_scan tool - scans and indexes memory files with incremental support */
async function handleMemoryIndexScan(args: ScanArgs): Promise<MCPResponse> {
  await ensureMemoryRuntimeInitialized('handler:memory_index_scan');
  const restoreBarrier = checkpoints.getRestoreBarrierStatus();
  if (restoreBarrier) {
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
  });
  if (!lease.acquired) {
    const message = lease.reason === 'lease_active'
      ? 'A scan is already in progress; this call coalesced onto it.'
      : 'A scan recently completed; this call coalesced onto the recent scan window.';
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
  const releaseScanLease = async (): Promise<void> => {
    if (scanLeaseReleased) return;
    scanLeaseReleased = true;
    await completeIndexScanLease(Date.now());
  };

  const checkpointRepair = runCheckpointNeedsRebuildRepairForScan();

  try {
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
  const specDocKeySet = new Set(specDocFiles.map((f) => getCachedKey(f)));
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
      return { deleted: 0, failed: 0 };
    }

    let deleted = 0;
    let failed = 0;

    for (const staleRecordId of recordIds) {
      try {
        const staleSnapshot = vectorIndex.getDb()?.prepare(
          'SELECT spec_folder, file_path FROM memory_index WHERE id = ?'
        ).get(staleRecordId) as { spec_folder?: string | null; file_path?: string | null } | undefined;

        if (vectorIndex.deleteMemory(staleRecordId)) {
          deleted++;
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

    return { deleted, failed };
  };

  const deleteStaleIndexedRecords = (paths: string[]): RecordDeleteResult => {
    if (paths.length === 0) {
      return { deleted: 0, failed: 0 };
    }

    return deleteIndexedRecordIds(incrementalIndex.listIndexedRecordIdsForDeletedPaths(paths));
  };

  const runGlobalOrphanSweep = (): OrphanSweepDeleteResult => {
    if (!('sweepOrphanIndexRows' in incrementalIndex)) {
      return { swept: 0, failed: 0, scannedRows: 0, nextCursor: null };
    }

    const sweepOrphanIndexRows = (incrementalIndex as {
      sweepOrphanIndexRows?: (options?: { limit?: number; cursor?: number }) => OrphanSweepCandidates;
    }).sweepOrphanIndexRows;

    if (typeof sweepOrphanIndexRows !== 'function') {
      return { swept: 0, failed: 0, scannedRows: 0, nextCursor: null };
    }

    const sweep = sweepOrphanIndexRows({ limit: ORPHAN_SWEEP_LIMIT });
    const deleteResult = deleteIndexedRecordIds(sweep.orphanRecordIds ?? []);
    return {
      swept: deleteResult.deleted,
      failed: deleteResult.failed,
      scannedRows: sweep.scannedRows,
      nextCursor: sweep.nextCursor,
    };
  };

  const runScanInvalidationHooks = (context: Record<string, unknown>): void => {
    try {
      runPostMutationHooks('scan', context);
    } catch (error: unknown) {
      console.warn('[memory-index-scan] Post-mutation invalidation failed:', toErrorMessage(error));
    }
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

  if (files.length === 0) {
    let staleDeleted = 0;
    let staleDeleteFailed = 0;
    const orphanSweepResult = runGlobalOrphanSweep();
    const postInsertEnrichmentRepaired = await runPostInsertEnrichmentRepairBackfill();

    if (incremental && !force) {
      const categorized: CategorizedFiles = incrementalIndex.categorizeFilesForIndexing([]);
      const staleDeleteResult = deleteStaleIndexedRecords(categorized.toDelete);
      staleDeleted = staleDeleteResult.deleted;
      staleDeleteFailed = staleDeleteResult.failed;
      if (staleDeleted > 0) {
        runScanInvalidationHooks({ staleDeleted, staleDeleteFailed, operation: 'stale-delete' });
      }
    }

    if (orphanSweepResult.swept > 0) {
      runScanInvalidationHooks({
        orphanSwept: orphanSweepResult.swept,
        orphanSweepFailed: orphanSweepResult.failed,
        operation: 'orphan-sweep',
      });
    }
    if (postInsertEnrichmentRepaired > 0) {
      runScanInvalidationHooks({
        postInsertEnrichmentRepaired,
        operation: 'post-insert-enrichment-repair',
      });
    }

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
      mtime_changed: 0
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
      if (constitutionalSet.has(getCachedKey(unchangedPath))) {
        results.constitutional.alreadyIndexed++;
      }
    }

    const categorizeTime = Date.now() - startCategorize;
    console.error(`[memory-index-scan] Incremental mode: ${filesToIndex.length}/${files.length} files need indexing (categorized in ${categorizeTime}ms)`);
    console.error(`[memory-index-scan] Fast-path skips: ${results.incremental.fast_path_skips}, Mtime changed: ${results.incremental.mtime_changed}`);
  }

  // Attempt move reconciliation before full delete+reindex cycle.
  // Matches vanished paths to new paths by packet_id + doc type; updates in place.
  if (filesToDelete.length > 0 && filesToIndex.length > 0) {
    const moveResult = incrementalIndex.reconcileMoves(filesToDelete, filesToIndex);
    if (moveResult.reconciled.length > 0) {
      results.moveReconciled = moveResult.reconciled.length;
      filesToDelete = moveResult.filteredToDelete;
      filesToIndex = moveResult.filteredToIndex;
      console.error(`[memory-index-scan] Move reconciled ${moveResult.reconciled.length} path(s) in place`);
    }
  }

  // Track successfully indexed files for post-indexing mtime update.
  // SAFETY INVARIANT: mtime markers are updated ONLY after indexing succeeds.
  // Failed files keep their old mtime so shouldReindex() returns 'modified'
  // Or 'new' on the next scan, ensuring automatic retry. Moving this update
  // Before indexing would cause silent data loss — a failed file would be
  // Marked "already indexed" and permanently skipped.
  const successfullyIndexedFiles: string[] = [];
  const scanBatchSize = BATCH_SIZE;

  if (filesToIndex.length > 0) {
    const batchResults = await processBatches(filesToIndex, async (filePath: string) => {
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
      return await indexSingleFile(filePath, force, {
        ...(useWarnOnly ? { qualityGateMode: 'warn-only' as const } : {}),
        fromScan: true,
        asyncEmbedding: true,
      });
    }, scanBatchSize);

    for (let i = 0; i < batchResults.length; i++) {
      const result = batchResults[i];
      const filePath = filesToIndex[i];
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
        if (!isSuccessfulStatus) {
          results.failed++;
        }

        if (result.status === 'indexed') {
          results.indexed++;
          successfullyIndexedFiles.push(filePath);
        } else if (result.status === 'updated') {
          results.updated++;
          successfullyIndexedFiles.push(filePath);
        } else if (result.status === 'unchanged') {
          results.unchanged++;
          successfullyIndexedFiles.push(filePath);
        } else if (result.status === 'reinforced') {
          results.updated++;
          successfullyIndexedFiles.push(filePath);
        } else if (result.status === 'duplicate') {
          results.unchanged++;
          successfullyIndexedFiles.push(filePath);
        } else if (result.status === 'deferred') {
          results.indexed++;
          results.deferred++;
          successfullyIndexedFiles.push(filePath);
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

    // Heartbeat: refresh lease after batch processing to prevent expiry on long scans.
    refreshScanLease();
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

  if (filesToDelete.length > 0) {
    if (results.failed === 0) {
      const staleDeleteResult = deleteStaleIndexedRecords(filesToDelete);
      results.staleDeleted = staleDeleteResult.deleted;
      results.staleDeleteFailed = staleDeleteResult.failed;
    } else {
      console.warn('[memory-index-scan] Deferring stale cleanup because one or more replacement files failed to index');
    }
  }

  const orphanSweepResult = runGlobalOrphanSweep();
  results.orphanSwept = orphanSweepResult.swept;
  results.orphanSweepFailed = orphanSweepResult.failed;
  results.orphanSweepScanned = orphanSweepResult.scannedRows;
  results.orphanSweepNextCursor = orphanSweepResult.nextCursor;

  results.postInsertEnrichmentRepaired = await runPostInsertEnrichmentRepairBackfill();

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

        for (const folder of affectedSpecFolders) {
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
          console.error(`[memory-index-scan] Spec 126: Created ${chainsCreated} causal chain edges across ${foldersProcessed} spec folders`);
        }
      }
    } catch (err: unknown) {
      const message = toErrorMessage(err);
      console.warn('[memory-index-scan] Spec 126: Causal chain creation failed:', message);
    }
  }

  if (results.indexed > 0 || results.updated > 0 || results.staleDeleted > 0 || results.orphanSwept > 0 || results.postInsertEnrichmentRepaired > 0) {
    runScanInvalidationHooks({
      indexed: results.indexed,
      updated: results.updated,
      staleDeleted: results.staleDeleted,
      staleDeleteFailed: results.staleDeleteFailed,
      ...(results.postInsertEnrichmentRepaired > 0
        ? { postInsertEnrichmentRepaired: results.postInsertEnrichmentRepaired }
        : {}),
      ...(results.orphanSwept > 0 || results.orphanSweepFailed > 0
        ? {
            orphanSwept: results.orphanSwept,
            orphanSweepFailed: results.orphanSweepFailed,
          }
        : {}),
    });
  }

  results.aliasConflicts = detectAliasConflictsFromIndex();
  results.divergenceReconcile = runDivergenceReconcileHooks(results.aliasConflicts);

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

  return createMCPSuccessResponse({
    tool: 'memory_index_scan',
    summary,
    data: {
      status: results.deferred > 0 ? 'complete_with_pending_vectors' : 'complete',
      ...(results.deferred > 0 ? { pendingVectors: results.deferred } : {}),
      scanKey,
      batchSize: scanBatchSize,
      ...results,
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
    await releaseScanLease();
  }
}

/* ───────────────────────────────────────────────────────────────
   9. EXPORTS
──────────────────────────────────────────────────────────────── */

export {
  handleMemoryIndexScan,
  indexSingleFile,
  findConstitutionalFiles,
  findSpecDocuments,
  detectSpecLevel,
  summarizeAliasConflicts,
  runDivergenceReconcileHooks,
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
