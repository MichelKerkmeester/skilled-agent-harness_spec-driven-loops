// ────────────────────────────────────────────────────────────────
// MODULE: Memory Crud Health
// ────────────────────────────────────────────────────────────────

/* ───────────────────────────────────────────────────────────────
   IMPORTS
──────────────────────────────────────────────────────────────── */

import { randomUUID } from 'node:crypto';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import type Database from 'better-sqlite3';

import { checkDatabaseUpdated } from '../core/index.js';
import { INDEX_SCAN_COOLDOWN } from '../core/config.js';
import { getLastScanTime } from '../core/db-state.js';
import * as vectorIndex from '../lib/search/vector-index.js';
import { isMemoryRuntimeInitialized } from '../lib/runtime/memory-runtime-guard.js';
import * as embeddings from '../lib/providers/embeddings.js';
import * as triggerMatcher from '../lib/parsing/trigger-matcher.js';
import { getRedactionStats } from '../lib/parsing/secret-scrubber.js';
import * as incrementalIndex from '../lib/storage/incremental-index.js';
import { createMCPSuccessResponse, createMCPErrorResponse } from '../lib/response/envelope.js';
import { toErrorMessage } from '../utils/index.js';

import { summarizeAliasConflicts } from './memory-index.js';
import * as causalEdges from '../lib/storage/causal-edges.js';
import { getCircuitFlapState, getEmbeddingRetryStats, getRetryStats } from '../lib/providers/retry-manager.js';
import {
  getSnapshot as getRoutingTelemetrySnapshot,
  WINDOW_SIZE as ROUTING_TELEMETRY_WINDOW_SIZE,
} from '../lib/search/routing-telemetry.js';
import {
  getByteEstimate as getEmbeddingCacheByteEstimate,
  getEmbeddingCacheByProfileStats,
  type EmbeddingCacheProfileStats,
} from '../lib/cache/embedding-cache.js';
import {
  getCacheByteEstimates,
  getDetailedMemorySnapshot,
  type CacheByteEstimates,
  type DetailedMemorySnapshot,
} from '../lib/telemetry/heap-profiler.js';
import { getBm25EngineStatus } from '../lib/search/bm25-index.js';
import { getIpcBridgeStats, type IpcBridgeStats } from '../lib/ipc/socket-server.js';
import {
  getHardExclusionPredicates,
  getGraphMetrics,
  type HardExclusionPredicate,
  type HardExclusionSource,
} from '../lib/search/hybrid-search.js';
import {
  buildVectorDegradationSignal,
  getMaintenanceObservabilitySnapshot,
} from '../lib/observability/retrieval-observability.js';

import type { MCPResponse, EmbeddingProfile } from './types.js';
import type { HealthArgs, PartialProviderMetadata } from './memory-crud-types.js';

// Feature catalog: Health diagnostics (memory_health)
// Feature catalog: Validation feedback (memory_validate)
// Feature catalog: Memory health autoRepair metadata


/** Strip absolute paths, stack traces, and truncate for safe user-facing hints. */
function sanitizeErrorForHint(msg: string): string {
  return msg
    .replace(/(^|[\s(])\/(?:[^/\n]+\/)*[^:\n)"'\]]+/g, (_match, prefix: string) => `${prefix}[path]`)
    .replace(/(^|[\s(])[A-Za-z]:\\(?:[^\\\n]+\\)*[^:\n)"'\]]+/g, (_match, prefix: string) => `${prefix}[path]`)
    .replace(/^[ \t]*at .+$/gm, '')            // strip stack trace lines
    .replace(/\n{2,}/g, '\n')                   // collapse blank lines left by stripping
    .trim()
    .slice(0, 200);
}

/** Redact absolute paths: keep only project-relative portion or basename. */
function redactPath(absolutePath: string): string {
  const normalizedPath = toNormalizedPath(absolutePath);
  if (normalizedPath.startsWith('.opencode/')) return normalizedPath;
  if (normalizedPath.startsWith('specs/')) return normalizedPath;
  const opencodeIdx = normalizedPath.indexOf('/.opencode/');
  const specsIdx = normalizedPath.indexOf('/specs/');
  if (opencodeIdx !== -1) return normalizedPath.slice(opencodeIdx + 1);
  if (specsIdx !== -1) return normalizedPath.slice(specsIdx + 1);
  // Fallback: basename only
  const lastSlash = normalizedPath.lastIndexOf('/');
  return lastSlash !== -1 ? normalizedPath.slice(lastSlash + 1) : normalizedPath;
}

/* ───────────────────────────────────────────────────────────────
   CONSTANTS
──────────────────────────────────────────────────────────────── */

// Read version from package.json at module load time using ESM-relative paths.
// WHY try-catch: if package.json is missing or malformed, the server should still start
const SERVER_VERSION: string = (() => {
  const packageCandidates = [
    resolve(import.meta.dirname, '../package.json'),
    resolve(import.meta.dirname, '../../package.json'),
  ];

  try {
    for (const candidate of packageCandidates) {
      if (!existsSync(candidate)) {
        continue;
      }
      const pkg = JSON.parse(readFileSync(candidate, 'utf-8'));
      if (pkg?.version) {
        return pkg.version;
      }
    }
    return 'unknown';
  } catch (_error: unknown) {
    return 'unknown';
  }
})();

const DIVERGENT_ALIAS_REPORT_MODE = 'divergent_aliases';
const DEFAULT_DIVERGENT_ALIAS_LIMIT = 20;
const MAX_DIVERGENT_ALIAS_LIMIT = 200;
const DOT_OPENCODE_SPECS_SEGMENT = '/.opencode/specs/';
const SPECS_SEGMENT = '/specs/';
const DAY_MS = 24 * 60 * 60 * 1000;
const INDEX_HEALTH_STALENESS_MS = 24 * 60 * 60 * 1000;
const CHECKPOINT_FRESHNESS_STALENESS_MS = 7 * DAY_MS;
const INDEX_HEALTH_ORPHAN_SAMPLE_LIMIT = 200;
const INDEX_SCAN_LEASE_EXPIRY_MS = INDEX_SCAN_COOLDOWN * 2;

type IndexHealthSummary =
  | 'healthy_fresh'
  | 'healthy_lagging_vectors'
  | 'stale_needs_scan'
  | 'degraded_needs_repair'
  | 'unavailable';

interface IndexHealthBlock {
  summary: IndexHealthSummary;
  indexedRows: number;
  pendingVectors: number;
  retryVectors: number;
  failedVectors: number;
  orphanFiles: number | null;
  lastScanAgeMs: number | null;
  activeScanJob: boolean;
  activeEmbedderJob: boolean;
  note?: string;
}

interface AliasConflictDbRow {
  file_path: string;
  content_hash: string | null;
  spec_folder?: string | null;
}

interface CheckpointFreshnessRow {
  count?: number;
  newestCreatedAt?: string | null;
}

interface DivergentAliasVariant {
  filePath: string;
  contentHash: string | null;
}

interface DivergentAliasGroup {
  normalizedPath: string;
  specFolders: string[];
  distinctHashCount: number;
  variants: DivergentAliasVariant[];
}

interface DivergentAliasBucket {
  hasDotOpencodeVariant: boolean;
  hasSpecsVariant: boolean;
  variants: Map<string, string | null>;
  hashes: Set<string>;
  specFolders: Set<string>;
}

interface FullMemoryReport {
  includeFullReport: true;
  memory_snapshot: DetailedMemorySnapshot;
  cache_byte_estimates: CacheByteEstimates & {
    embedding_cache_by_profile: Record<string, EmbeddingCacheProfileStats>;
  };
  ipc_bridge: IpcBridgeStats;
  db_split: {
    canonical_path: string;
    canonical_size_mb: number;
    shard_path: string;
    shard_size_mb: number;
    attached: boolean;
    profile: {
      provider: string;
      model: string;
      dim: number;
      dtype?: string | null;
    };
    lexical_engine: 'auto' | 'sqlite' | 'packed-inmemory' | 'legacy-inmemory';
    bm25_warm_status: {
      enabled: boolean;
      fts5_available: boolean;
      warms_in_memory_bm25: boolean;
    };
  };
  recommended_action: string;
}

type ExclusionAuditStatus = 'ok' | 'risk' | 'unclassified' | 'unavailable';
type ExclusionAuditClassification = 'intended' | 'silent-risk' | 'unclassified';

interface IntendedExclusionPolicy {
  version: string;
  intendedSources: HardExclusionSource[];
  silentRiskSources: HardExclusionSource[];
}

interface ExclusionAuditEntry {
  predicateId: string;
  source: HardExclusionSource;
  channel: string;
  classification: ExclusionAuditClassification;
  candidateRows: number | null;
}

interface ExclusionAuditDiagnostic {
  code: 'hard-exclusion-risk' | 'exclusion-unclassified' | 'exclusion-audit-unavailable';
  severity: 'info' | 'medium' | 'high';
  message: string;
  predicateId?: string;
  source?: HardExclusionSource;
  candidateRows?: number | null;
}

interface ExclusionAuditReport {
  status: ExclusionAuditStatus;
  policyVersion: string | null;
  entries: ExclusionAuditEntry[];
  diagnostics: ExclusionAuditDiagnostic[];
}

const DEFAULT_INTENDED_EXCLUSION_POLICY: IntendedExclusionPolicy = Object.freeze({
  version: 'hard-exclusion-v1',
  intendedSources: ['archived-tier'] as HardExclusionSource[],
  silentRiskSources: ['deprecated-tier'] as HardExclusionSource[],
});

function toNormalizedPath(filePath: string): string {
  return filePath.replace(/\\/g, '/');
}

function toSpecAliasKey(filePath: string): string {
  const normalizedPath = toNormalizedPath(filePath);
  return normalizedPath
    .replace(/\/\.opencode\/specs\//g, '/specs/')
    .replace(/^\.opencode\/specs\//, 'specs/');
}

function isSpecsAliasPath(filePath: string): boolean {
  const normalizedPath = toNormalizedPath(filePath);
  return (
    normalizedPath.includes(DOT_OPENCODE_SPECS_SEGMENT) ||
    normalizedPath.includes(SPECS_SEGMENT) ||
    normalizedPath.startsWith('.opencode/specs/') ||
    normalizedPath.startsWith('specs/')
  );
}

function isDotOpencodeVariantPath(normalizedPath: string): boolean {
  return normalizedPath.includes(DOT_OPENCODE_SPECS_SEGMENT) || normalizedPath.startsWith('.opencode/specs/');
}

function isSpecsVariantPath(normalizedPath: string): boolean {
  if (isDotOpencodeVariantPath(normalizedPath)) {
    return false;
  }
  return normalizedPath.includes(SPECS_SEGMENT) || normalizedPath.startsWith('specs/');
}

function getDivergentAliasGroups(rows: AliasConflictDbRow[], limit: number): DivergentAliasGroup[] {
  if (!rows.length) {
    return [];
  }

  const buckets = new Map<string, DivergentAliasBucket>();

  for (const row of rows) {
    if (!row || typeof row.file_path !== 'string' || row.file_path.length === 0) {
      continue;
    }

    const normalizedPath = toNormalizedPath(row.file_path);
    const aliasKey = toSpecAliasKey(normalizedPath);
    let bucket = buckets.get(aliasKey);
    if (!bucket) {
      bucket = {
        hasDotOpencodeVariant: false,
        hasSpecsVariant: false,
        variants: new Map<string, string | null>(),
        hashes: new Set<string>(),
        specFolders: new Set<string>(),
      };
      buckets.set(aliasKey, bucket);
    }

    if (isDotOpencodeVariantPath(normalizedPath)) {
      bucket.hasDotOpencodeVariant = true;
    }
    if (isSpecsVariantPath(normalizedPath)) {
      bucket.hasSpecsVariant = true;
    }

    bucket.variants.set(normalizedPath, row.content_hash ?? null);
    if (typeof row.content_hash === 'string' && row.content_hash.trim().length > 0) {
      bucket.hashes.add(row.content_hash.trim());
    }
    if (typeof row.spec_folder === 'string' && row.spec_folder.length > 0) {
      bucket.specFolders.add(row.spec_folder);
    }
  }

  const groups: DivergentAliasGroup[] = [];
  for (const [normalizedPath, bucket] of buckets.entries()) {
    if (!bucket.hasDotOpencodeVariant || !bucket.hasSpecsVariant) {
      continue;
    }
    if (bucket.variants.size < 2 || bucket.hashes.size < 2) {
      continue;
    }

    const variants: DivergentAliasVariant[] = Array.from(bucket.variants.entries())
      .sort(([pathA], [pathB]) => pathA.localeCompare(pathB))
      .map(([filePath, contentHash]) => ({ filePath: redactPath(filePath), contentHash }));

    groups.push({
      normalizedPath: redactPath(normalizedPath),
      // Fix F21 — redact specFolders to prevent path disclosure.
      specFolders: Array.from(bucket.specFolders).sort().map(sf => redactPath(sf)),
      distinctHashCount: bucket.hashes.size,
      variants,
    });
  }

  groups.sort((a, b) => a.normalizedPath.localeCompare(b.normalizedPath));
  return groups.slice(0, limit);
}

function getRecommendedAction(snapshot: DetailedMemorySnapshot): string {
  if (snapshot.heap_used_mb > 100) {
    return 'Consider running heap snapshot via SPECKIT_HEAP_SNAPSHOT_DIR=/path/to/dir; large heap detected';
  }
  if (snapshot.external_mb > 50) {
    return 'Consider running heap snapshot via SPECKIT_HEAP_SNAPSHOT_DIR=/path/to/dir; large external memory detected';
  }
  if (snapshot.array_buffers_mb > 50) {
    return 'Consider running heap snapshot via SPECKIT_HEAP_SNAPSHOT_DIR=/path/to/dir; large ArrayBuffer memory detected';
  }
  if (snapshot.rss_mb > 512 && snapshot.heap_used_mb < 100) {
    return 'RSS is high but V8 heap is not; inspect native SQLite/cache or external provider memory before changing old-space limits';
  }

  return 'No heap snapshot recommended from current thresholds';
}

function getFullMemoryReport(
  includeFullReport: boolean,
  database: Database.Database | null,
): FullMemoryReport | null {
  if (!includeFullReport) {
    return null;
  }

  const snapshot = getDetailedMemorySnapshot();
  const cacheByteEstimates = getCacheByteEstimates();
  const vectorSource = vectorIndex.getActiveVectorSource();
  const lexicalStatus = getBm25EngineStatus(database);
  const fileSizeMb = (filePath: string): number => {
    if (!filePath || !existsSync(filePath)) {
      return 0;
    }
    return Math.round((statSync(filePath).size / 1024 / 1024) * 100) / 100;
  };
  if (database) {
    const embeddingEstimate = getEmbeddingCacheByteEstimate(database);
    cacheByteEstimates.embedding_cache_in_process = {
      entries: embeddingEstimate.entries,
      approx_bytes: embeddingEstimate.approxBytes,
    };
  }

  return {
    includeFullReport: true,
    memory_snapshot: snapshot,
    cache_byte_estimates: {
      ...cacheByteEstimates,
      embedding_cache_by_profile: database
        ? getEmbeddingCacheByProfileStats(database)
        : {},
    },
    ipc_bridge: getIpcBridgeStats(),
    db_split: {
      canonical_path: vectorSource.canonical_path,
      canonical_size_mb: fileSizeMb(vectorSource.canonical_path),
      shard_path: vectorSource.shard_path,
      shard_size_mb: fileSizeMb(vectorSource.shard_path),
      attached: vectorSource.attached,
      profile: vectorSource.profile,
      lexical_engine: lexicalStatus.lexical_engine,
      bm25_warm_status: {
        enabled: lexicalStatus.bm25_enabled,
        fts5_available: lexicalStatus.fts5_available,
        warms_in_memory_bm25: lexicalStatus.warms_in_memory_bm25,
      },
    },
    recommended_action: getRecommendedAction(snapshot),
  };
}

function isValidExclusionPolicy(value: unknown): value is IntendedExclusionPolicy {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.version === 'string' &&
    Array.isArray(candidate.intendedSources) &&
    Array.isArray(candidate.silentRiskSources) &&
    candidate.intendedSources.every((item) => item === 'archived-tier' || item === 'deprecated-tier') &&
    candidate.silentRiskSources.every((item) => item === 'archived-tier' || item === 'deprecated-tier')
  );
}

function countExclusionCandidates(
  database: Database.Database | null,
  source: HardExclusionSource,
): number | null {
  if (!database) {
    return null;
  }

  const tier = source === 'deprecated-tier' ? 'deprecated' : 'archived';
  try {
    const row = database.prepare(`
      SELECT COUNT(*) AS count
      FROM memory_index
      WHERE parent_id IS NULL
        AND importance_tier = ?
        AND (expires_at IS NULL OR expires_at > datetime('now'))
        AND (
          title IS NOT NULL OR
          trigger_phrases IS NOT NULL OR
          file_path IS NOT NULL OR
          content IS NOT NULL
        )
    `).get(tier) as { count?: number } | undefined;
    return row?.count ?? 0;
  } catch (_error: unknown) {
    return null;
  }
}

function classifyExclusionPredicate(
  predicate: HardExclusionPredicate,
  policy: IntendedExclusionPolicy,
): ExclusionAuditClassification {
  if (policy.intendedSources.includes(predicate.source)) {
    return 'intended';
  }
  if (policy.silentRiskSources.includes(predicate.source)) {
    return 'silent-risk';
  }
  return 'unclassified';
}

function auditHardExclusions(
  database: Database.Database | null,
  policy: unknown = DEFAULT_INTENDED_EXCLUSION_POLICY,
  predicates: HardExclusionPredicate[] = getHardExclusionPredicates(),
): ExclusionAuditReport {
  if (!Array.isArray(predicates) || predicates.length === 0) {
    return {
      status: 'unclassified',
      policyVersion: isValidExclusionPolicy(policy) ? policy.version : null,
      entries: [],
      diagnostics: [{
        code: 'exclusion-unclassified',
        severity: 'high',
        message: 'exclusion unclassified: no hard-exclusion predicates were exposed for audit',
      }],
    };
  }

  if (!isValidExclusionPolicy(policy)) {
    return {
      status: 'unclassified',
      policyVersion: null,
      entries: predicates.map((predicate) => ({
        predicateId: predicate.id,
        source: predicate.source,
        channel: predicate.channel,
        classification: 'unclassified',
        candidateRows: countExclusionCandidates(database, predicate.source),
      })),
      diagnostics: predicates.map((predicate) => ({
        code: 'exclusion-unclassified',
        severity: 'high',
        predicateId: predicate.id,
        source: predicate.source,
        candidateRows: countExclusionCandidates(database, predicate.source),
        message: `exclusion unclassified: intended-exclusion policy unavailable for ${predicate.id}`,
      })),
    };
  }

  const entries: ExclusionAuditEntry[] = [];
  const diagnostics: ExclusionAuditDiagnostic[] = [];
  for (const predicate of predicates) {
    const classification = classifyExclusionPredicate(predicate, policy);
    const candidateRows = countExclusionCandidates(database, predicate.source);
    entries.push({
      predicateId: predicate.id,
      source: predicate.source,
      channel: predicate.channel,
      classification,
      candidateRows,
    });

    if (classification === 'silent-risk' && (candidateRows ?? 0) > 0) {
      diagnostics.push({
        code: 'hard-exclusion-risk',
        severity: 'medium',
        predicateId: predicate.id,
        source: predicate.source,
        candidateRows,
        message: `${candidateRows} row(s) match ${predicate.source} and can be silently hard-excluded by ${predicate.id}`,
      });
    }
    if (classification === 'unclassified') {
      diagnostics.push({
        code: 'exclusion-unclassified',
        severity: 'high',
        predicateId: predicate.id,
        source: predicate.source,
        candidateRows,
        message: `exclusion unclassified: no intended-exclusion policy entry for ${predicate.id}`,
      });
    }
  }

  const status: ExclusionAuditStatus = diagnostics.some((diagnostic) => diagnostic.code === 'exclusion-unclassified')
    ? 'unclassified'
    : diagnostics.some((diagnostic) => diagnostic.code === 'hard-exclusion-risk')
      ? 'risk'
      : database
        ? 'ok'
        : 'unavailable';

  if (!database) {
    diagnostics.push({
      code: 'exclusion-audit-unavailable',
      severity: 'info',
      message: 'Hard-exclusion audit could not count candidate rows because the database is unavailable.',
    });
  }

  return {
    status,
    policyVersion: policy.version,
    entries,
    diagnostics,
  };
}

function parseConfigTimestamp(value: unknown): number {
  const parsed = typeof value === 'string' ? Number.parseInt(value, 10) : 0;
  return Number.isFinite(parsed) ? parsed : 0;
}

function getConfigTimestamp(database: Database.Database, key: string): number {
  try {
    const row = database.prepare('SELECT value FROM config WHERE key = ?').get(key) as { value?: string } | undefined;
    return parseConfigTimestamp(row?.value);
  } catch (_error: unknown) {
    return 0;
  }
}

function hasActiveScanJob(database: Database.Database, now: number): boolean {
  const scanStartedAt = getConfigTimestamp(database, 'scan_started_at');
  return scanStartedAt > 0 && now - scanStartedAt < INDEX_SCAN_LEASE_EXPIRY_MS;
}

function hasActiveEmbedderJob(database: Database.Database): boolean {
  try {
    const table = database.prepare(`
      SELECT name
      FROM sqlite_master
      WHERE type = 'table' AND name = 'embedder_jobs'
      LIMIT 1
    `).get() as { name?: string } | undefined;
    if (!table) {
      return false;
    }

    const row = database.prepare(`
      SELECT COUNT(*) AS count
      FROM embedder_jobs
      WHERE status IN ('queued', 'running')
    `).get() as { count?: number } | undefined;
    return (row?.count ?? 0) > 0;
  } catch (_error: unknown) {
    return false;
  }
}

function addCheckpointFreshnessHint(database: Database.Database, hints: string[], now: number): void {
  try {
    const row = database.prepare(`
      SELECT COUNT(*) AS count, MAX(created_at) AS newestCreatedAt
      FROM checkpoints
    `).get() as CheckpointFreshnessRow | undefined;
    const checkpointCount = row?.count ?? 0;
    const newestCreatedAt = row?.newestCreatedAt ?? null;

    if (checkpointCount === 0 || !newestCreatedAt) {
      hints.push('No checkpoints found; create a checkpoint to keep a recent restore point available.');
      return;
    }

    const newestCheckpointMs = Date.parse(newestCreatedAt);
    if (!Number.isFinite(newestCheckpointMs)) {
      hints.push('Checkpoint freshness unknown: newest checkpoint timestamp could not be parsed.');
      return;
    }

    const checkpointAgeMs = Math.max(0, now - newestCheckpointMs);
    if (checkpointAgeMs > CHECKPOINT_FRESHNESS_STALENESS_MS) {
      const checkpointAgeDays = Math.floor(checkpointAgeMs / DAY_MS);
      hints.push(`Newest checkpoint is ${checkpointAgeDays} day(s) old; create a fresh checkpoint to keep a recent restore point available.`);
    }
  } catch (error: unknown) {
    hints.push(`Checkpoint freshness check failed: ${sanitizeErrorForHint(toErrorMessage(error))}`);
  }
}

async function getIndexHealthBlock(
  database: Database.Database | null,
  indexedRows: number,
  vectorSearchAvailable: boolean,
  now: number,
): Promise<IndexHealthBlock> {
  let pendingVectors = 0;
  let retryVectors = 0;
  let failedVectors = 0;
  let orphanFiles: number | null = null;
  let lastScanAgeMs: number | null = null;
  let activeScanJob = false;
  let activeEmbedderJob = false;
  const notes: string[] = [];

  if (!database || !vectorSearchAvailable) {
    return {
      summary: 'unavailable',
      indexedRows,
      pendingVectors,
      retryVectors,
      failedVectors,
      orphanFiles,
      lastScanAgeMs,
      activeScanJob,
      activeEmbedderJob,
      note: 'Database or vector index is unavailable.',
    };
  }

  try {
    const retryStats = getRetryStats();
    pendingVectors = retryStats.pending;
    retryVectors = retryStats.retry;
    failedVectors = retryStats.failed;
  } catch (error: unknown) {
    const retrySnapshot = getEmbeddingRetryStats();
    pendingVectors = retrySnapshot.pending;
    retryVectors = Math.max(0, retrySnapshot.queueDepth - retrySnapshot.pending);
    failedVectors = retrySnapshot.failed;
    notes.push(`Embedding retry counts fell back to in-memory telemetry: ${sanitizeErrorForHint(toErrorMessage(error))}`);
  }

  try {
    const lastScanTime = await getLastScanTime();
    lastScanAgeMs = lastScanTime > 0 ? Math.max(0, now - lastScanTime) : null;
  } catch (error: unknown) {
    notes.push(`Last scan timestamp unavailable: ${sanitizeErrorForHint(toErrorMessage(error))}`);
  }

  activeScanJob = hasActiveScanJob(database, now);
  activeEmbedderJob = hasActiveEmbedderJob(database);

  try {
    incrementalIndex.init(database);
    const orphanSweep = incrementalIndex.sweepOrphanIndexRows({ limit: INDEX_HEALTH_ORPHAN_SAMPLE_LIMIT });
    orphanFiles = orphanSweep.swept;
    if (orphanSweep.nextCursor !== null) {
      notes.push(`orphanFiles is a bounded count over ${orphanSweep.scannedRows} sampled row(s); more rows may exist.`);
    }
  } catch (error: unknown) {
    orphanFiles = null;
    notes.push(`Orphan file count unavailable: ${sanitizeErrorForHint(toErrorMessage(error))}`);
  }

  let summary: IndexHealthSummary;
  if (failedVectors > 0 || (orphanFiles ?? 0) > 0) {
    summary = 'degraded_needs_repair';
  } else if (lastScanAgeMs === null || lastScanAgeMs > INDEX_HEALTH_STALENESS_MS) {
    summary = 'stale_needs_scan';
  } else if (pendingVectors > 0 || retryVectors > 0) {
    summary = 'healthy_lagging_vectors';
  } else {
    summary = 'healthy_fresh';
  }

  return {
    summary,
    indexedRows,
    pendingVectors,
    retryVectors,
    failedVectors,
    orphanFiles,
    lastScanAgeMs,
    activeScanJob,
    activeEmbedderJob,
    ...(notes.length > 0 ? { note: notes.join(' ') } : {}),
  };
}

/* ───────────────────────────────────────────────────────────────
   CORE LOGIC
──────────────────────────────────────────────────────────────── */

/** Handle memory_health tool -- returns system health status and diagnostics. */
async function handleMemoryHealth(args: HealthArgs): Promise<MCPResponse> {
  const startTime = Date.now();
  // A7-P2-1: Generate requestId for incident correlation in error responses
  const requestId = randomUUID();
  if (isMemoryRuntimeInitialized()) {
    try {
      await checkDatabaseUpdated();
    } catch (dbStateErr: unknown) {
      const message = toErrorMessage(dbStateErr);
      console.error(`[memory-health] Database refresh failed [requestId=${requestId}]: ${message}`);
      return createMCPErrorResponse({
        tool: 'memory_health',
        error: 'Database refresh failed before diagnostics completed. Retry the request or restart the MCP server.',
        code: 'E021',
        details: { requestId },
        startTime,
      });
    }
  }

  const {
    reportMode = 'full',
    includeFullReport = false,
    limit: rawLimit = DEFAULT_DIVERGENT_ALIAS_LIMIT,
    specFolder,
    autoRepair = false,
    confirmed = false,
    cleanFiles = false,
  } = args ?? {};

  if (reportMode !== 'full' && reportMode !== DIVERGENT_ALIAS_REPORT_MODE) {
    return createMCPErrorResponse({
      tool: 'memory_health',
      error: `Invalid reportMode: ${String(reportMode)}. Expected "full" or "${DIVERGENT_ALIAS_REPORT_MODE}"`,
      code: 'E_INVALID_INPUT',
      details: { requestId },
      startTime,
    });
  }
  if (typeof includeFullReport !== 'boolean') {
    return createMCPErrorResponse({
      tool: 'memory_health',
      error: 'includeFullReport must be a boolean',
      code: 'E_INVALID_INPUT',
      details: { requestId },
      startTime,
    });
  }
  if (specFolder !== undefined && typeof specFolder !== 'string') {
    return createMCPErrorResponse({
      tool: 'memory_health',
      error: 'specFolder must be a string',
      code: 'E_INVALID_INPUT',
      details: { requestId },
      startTime,
    });
  }
  if (typeof autoRepair !== 'boolean') {
    return createMCPErrorResponse({
      tool: 'memory_health',
      error: 'autoRepair must be a boolean',
      code: 'E_INVALID_INPUT',
      details: { requestId },
      startTime,
    });
  }
  if (typeof confirmed !== 'boolean') {
    return createMCPErrorResponse({
      tool: 'memory_health',
      error: 'confirmed must be a boolean',
      code: 'E_INVALID_INPUT',
      details: { requestId },
      startTime,
    });
  }
  if (typeof cleanFiles !== 'boolean') {
    return createMCPErrorResponse({
      tool: 'memory_health',
      error: 'cleanFiles must be a boolean',
      code: 'E_INVALID_INPUT',
      details: { requestId },
      startTime,
    });
  }
  if (rawLimit !== undefined && (!Number.isFinite(rawLimit) || rawLimit <= 0)) {
    return createMCPErrorResponse({
      tool: 'memory_health',
      error: 'limit must be a positive number',
      code: 'E_INVALID_INPUT',
      details: { requestId },
      startTime,
    });
  }
  const safeLimit = Math.max(1, Math.min(Math.floor(rawLimit || DEFAULT_DIVERGENT_ALIAS_LIMIT), MAX_DIVERGENT_ALIAS_LIMIT));
  const runtimeInitialized = isMemoryRuntimeInitialized();
  const database = vectorIndex.tryGetDb();
  const fullMemoryReport = getFullMemoryReport(includeFullReport, database);
  let memoryCount = 0;
  let aliasConflicts: ReturnType<typeof summarizeAliasConflicts> = summarizeAliasConflicts([]);
  let aliasRows: AliasConflictDbRow[] = [];
  let divergentAliasGroups: DivergentAliasGroup[] = [];
  const processHealth = {
    pid: process.pid,
    rss_mb: Math.round(process.memoryUsage().rss / 1024 / 1024),
    uptime_s: Math.round(process.uptime()),
    uptime_seconds: Math.round(process.uptime()),
    runtime_initialized: runtimeInitialized,
  };
  const embeddingRetry = {
    ...getEmbeddingRetryStats(),
    ...getCircuitFlapState(),
  };
  try {
    if (database) {
      const countResult = database.prepare('SELECT COUNT(*) as count FROM memory_index')
        .get() as Record<string, number> | undefined;
      memoryCount = countResult?.count ?? 0;

      const whereParts: string[] = [
        'parent_id IS NULL',
      ];
      const params: unknown[] = [];
      if (specFolder) {
        whereParts.push('spec_folder = ?');
        params.push(specFolder);
      }

      const aliasSql = `
        SELECT file_path, content_hash, spec_folder
        FROM memory_index
        WHERE ${whereParts.join(' AND ')}
      `;

      aliasRows = (database.prepare(aliasSql).all(...params) as AliasConflictDbRow[])
        .filter((row) => typeof row?.file_path === 'string' && isSpecsAliasPath(row.file_path));
      aliasConflicts = summarizeAliasConflicts(aliasRows);
      divergentAliasGroups = getDivergentAliasGroups(aliasRows, safeLimit);
    }
  } catch (err: unknown) {
    const message = toErrorMessage(err);
    if (message.includes('no such table')) {
      console.error(`[memory-health] Schema missing [requestId=${requestId}]:`, message);
      return createMCPErrorResponse({
        tool: 'memory_health',
        error: `Schema missing: ${sanitizeErrorForHint(message)}. Run memory_index_scan() to create the database schema, or restart the MCP server.`,
        code: 'E_SCHEMA_MISSING',
        details: { requestId },
        startTime,
      });
    }
    console.warn(`[memory-health] Failed to get memory count [requestId=${requestId}]:`, message);
  }

  const indexHealth = await getIndexHealthBlock(
    database,
    memoryCount,
    vectorIndex.isVectorSearchAvailable(),
    Date.now(),
  );
  const vectorDegradation = buildVectorDegradationSignal(vectorIndex.isVectorSearchAvailable());
  const maintenance = getMaintenanceObservabilitySnapshot();
  const exclusionAudit = auditHardExclusions(database);

  if (reportMode === DIVERGENT_ALIAS_REPORT_MODE) {
    const hints: string[] = [];
    if (!database) {
      hints.push('Database runtime has not initialized yet; the first memory-owning tool call will initialize it.');
    }
    if (autoRepair) {
      hints.push('autoRepair is only applied in reportMode="full"');
    }
    if (aliasConflicts.divergentHashGroups === 0) {
      hints.push('No divergent alias groups detected');
    }
    if (aliasConflicts.divergentHashGroups > divergentAliasGroups.length) {
      hints.push(`More divergent alias groups available: increase limit above ${safeLimit}`);
    }
    for (const diagnostic of exclusionAudit.diagnostics) {
      hints.push(diagnostic.message);
    }

    return createMCPSuccessResponse({
      tool: 'memory_health',
      summary: `Divergent alias report: ${divergentAliasGroups.length} of ${aliasConflicts.divergentHashGroups} group(s)`,
      data: {
        reportMode,
        status: database ? 'healthy' : 'degraded',
        runtime_initialized: runtimeInitialized,
        databaseConnected: !!database,
        process: processHealth,
        index: indexHealth,
        recallDegradation: vectorDegradation,
        maintenance,
        exclusionAudit,
        embeddingRetry,
        specFolder: specFolder ?? null,
        limit: safeLimit,
        totalRowsScanned: aliasRows.length,
        totalDivergentGroups: aliasConflicts.divergentHashGroups,
        returnedGroups: divergentAliasGroups.length,
        groups: divergentAliasGroups,
        ...(fullMemoryReport ?? {}),
      },
      hints,
      startTime,
    });
  }

  let providerMetadata = embeddings.getProviderMetadata() as PartialProviderMetadata;
  let profile = embeddings.getEmbeddingProfile() as EmbeddingProfile | null;
  const hints: string[] = [];
  for (const diagnostic of exclusionAudit.diagnostics) {
    hints.push(diagnostic.message);
  }
  const consistency = {
    status: database ? 'healthy' : 'unknown',
    rowsTotal: memoryCount,
    ftsRowsTotal: null as number | null,
    vecRowsTotal: null as number | null,
    mismatchedIds: [] as Array<string | number>,
  };
  const causalEdgeHealth = {
    orphanedEdges: 0,
    sample: [] as Array<{
      edgeId: number;
      sourceId: string;
      targetId: string;
      relation: string;
      sourceExists: boolean;
      targetExists: boolean;
    }>,
    repaired: 0,
    tombstoned: 0,
  };
  const repair = {
    requested: autoRepair,
    attempted: false,
    repaired: false,
    partialSuccess: false,
    actions: [] as string[],
    warnings: [] as string[],
    errors: [] as string[],
  };
  let successfulRepairCount = 0;
  let failedRepairCount = 0;

  const trackRepairOutcome = (succeeded: boolean): void => {
    repair.attempted = true;
    if (succeeded) {
      successfulRepairCount += 1;
      return;
    }
    failedRepairCount += 1;
  };

  if (!profile) {
    try {
      // Resolve the lazy profile so health reflects the active runtime provider
      // Rather than the legacy sync fallback defaults.
      profile = await embeddings.getEmbeddingProfileAsync() as EmbeddingProfile | null;
      providerMetadata = embeddings.getProviderMetadata() as PartialProviderMetadata;
    } catch (profileError: unknown) {
      hints.push(`Embedding profile unavailable: ${sanitizeErrorForHint(toErrorMessage(profileError))}`);
    }
  }

  const providerName = profile?.provider ?? providerMetadata.provider;
  const providerModel = profile?.model ?? providerMetadata.model ?? embeddings.getModelName();
  const providerDimension = profile?.dim ?? providerMetadata.dim ?? embeddings.getEmbeddingDimension();
  const providerDtype = profile?.dtype ?? providerMetadata.dtype ?? null;
  const repairActions = [
    'fts_rebuild',
    'trigger_cache_refresh',
    'orphan_edges_cleanup',
    'orphan_vector_cleanup',
    'orphan_chunks_cleanup',
    ...(cleanFiles ? ['orphan_files_cleanup'] : []),
  ];

  if (database) {
    try {
      const memoryCountRow = database.prepare('SELECT COUNT(*) as count FROM memory_index').get() as { count: number };
      const ftsCountRow = database.prepare('SELECT COUNT(*) as count FROM memory_fts').get() as { count: number };
      const integrityReport = vectorIndex.verifyIntegrity({ autoClean: false });
      consistency.rowsTotal = memoryCountRow.count;
      consistency.ftsRowsTotal = ftsCountRow.count;
      consistency.vecRowsTotal = integrityReport.totalVectors;
      if (memoryCountRow.count !== ftsCountRow.count) {
        consistency.mismatchedIds.push('fts_count_mismatch');
      }
      if (integrityReport.missingVectors > 0) {
        consistency.mismatchedIds.push(`missing_vectors:${integrityReport.missingVectors}`);
      }
      if (integrityReport.orphanedVectors > 0) {
        consistency.mismatchedIds.push(`orphaned_vectors:${integrityReport.orphanedVectors}`);
      }
      if (integrityReport.orphanedChunks > 0) {
        consistency.mismatchedIds.push(`orphaned_chunks:${integrityReport.orphanedChunks}`);
      }
      for (const file of integrityReport.orphanedFiles.slice(0, 50)) {
        consistency.mismatchedIds.push(file.id);
      }
      consistency.status = consistency.mismatchedIds.length > 0 ? 'degraded' : 'healthy';
    } catch (error: unknown) {
      consistency.status = 'unknown';
      hints.push(`Read-only consistency check failed: ${sanitizeErrorForHint(toErrorMessage(error))}`);
    }
  }

  if (database) {
    try {
      causalEdges.init(database);
      const orphanedEdges = causalEdges.findOrphanedEdges();
      causalEdgeHealth.orphanedEdges = orphanedEdges.length;
      if (orphanedEdges.length > 0) {
        const memoryExistsStmt = database.prepare('SELECT 1 AS present FROM memory_index WHERE CAST(id AS TEXT) = ? LIMIT 1');
        for (const edge of orphanedEdges.slice(0, safeLimit)) {
          causalEdgeHealth.sample.push({
            edgeId: edge.id,
            sourceId: edge.source_id,
            targetId: edge.target_id,
            relation: edge.relation,
            sourceExists: !!(memoryExistsStmt.get(edge.source_id) as { present?: number } | undefined),
            targetExists: !!(memoryExistsStmt.get(edge.target_id) as { present?: number } | undefined),
          });
        }
        consistency.status = 'degraded';
        consistency.mismatchedIds.push(`orphan_causal_edges:${orphanedEdges.length}`);
        hints.push(`${orphanedEdges.length} orphaned causal edge(s) detected; inspect data.causalEdges.sample.`);
      }
    } catch (error: unknown) {
      hints.push(`Causal edge orphan check failed: ${sanitizeErrorForHint(toErrorMessage(error))}`);
    }
  }

  const status = database && consistency.status === 'healthy' ? 'healthy' : 'degraded';
  const summary = `Memory system ${status}: ${memoryCount} memories indexed`;
  if (consistency.status === 'degraded') {
    hints.push('Memory consistency degraded; inspect data.consistency for FTS/vector mismatch details.');
  }

  if (autoRepair && !confirmed) {
    return createMCPSuccessResponse({
      tool: 'memory_health',
      summary: 'Confirmation required before auto-repair actions are executed',
      data: {
        status,
        reportMode,
        runtime_initialized: runtimeInitialized,
        autoRepairRequested: true,
        needsConfirmation: true,
        actions: repairActions,
        causalEdges: causalEdgeHealth,
        process: processHealth,
        index: indexHealth,
        recallDegradation: vectorDegradation,
        maintenance,
        exclusionAudit,
        embeddingRetry,
        ...(fullMemoryReport ?? {}),
      },
      hints: [
        'Re-run memory_health with autoRepair:true and confirmed:true to execute repair actions.',
      ],
      startTime,
    });
  }

  if (!database) {
    hints.push('Database runtime has not initialized yet; the first memory-owning tool call will initialize it.');
  }
  if (database) {
    addCheckpointFreshnessHint(database, hints, startTime);
  }
  if (!vectorIndex.isVectorSearchAvailable()) {
    hints.push('Vector search unavailable - fallback to BM25');
  }
  // FTS5 consistency check
  if (database) {
    try {
      const memoryCountRow = database.prepare('SELECT COUNT(*) as count FROM memory_index').get() as { count: number };
      const ftsCountRow = database.prepare('SELECT COUNT(*) as count FROM memory_fts').get() as { count: number };
      if (memoryCountRow.count !== ftsCountRow.count) {
        hints.push(
          `FTS5 index out of sync: memory_index has ${memoryCountRow.count} rows, memory_fts has ${ftsCountRow.count} rows. ` +
          `Run memory_index_scan with force:true to rebuild FTS5 index.`
        );

        if (autoRepair) {
          try {
            database.exec("INSERT INTO memory_fts(memory_fts) VALUES('rebuild')");
            repair.actions.push('fts_rebuild');

            triggerMatcher.refreshTriggerCache();
            repair.actions.push('trigger_cache_refresh');

            const repairedFtsCountRow = database.prepare('SELECT COUNT(*) as count FROM memory_fts').get() as { count: number };
            if (memoryCountRow.count === repairedFtsCountRow.count) {
              trackRepairOutcome(true);
              repair.actions.push('fts_consistency_verified');
              hints.push('Auto-repair completed: FTS5 index rebuilt and trigger cache refreshed.');
            } else {
              trackRepairOutcome(false);
              const warning = `Post-repair mismatch persists: memory_index=${memoryCountRow.count}, memory_fts=${repairedFtsCountRow.count}`;
              repair.warnings.push(warning);
              hints.push(`Auto-repair attempted, but mismatch remains (${warning}).`);
            }
          } catch (repairError: unknown) {
            const message = toErrorMessage(repairError);
            trackRepairOutcome(false);
            repair.errors.push(sanitizeErrorForHint(message));
            hints.push(`Auto-repair failed: ${sanitizeErrorForHint(message)}`);
          }
        }
      }
    } catch (e: unknown) {
      const message = toErrorMessage(e);
      hints.push(`FTS5 consistency check failed: ${sanitizeErrorForHint(message)}`);
      if (autoRepair) {
        trackRepairOutcome(false);
        repair.errors.push(`Consistency check failed before repair: ${sanitizeErrorForHint(message)}`);
      }
    }
  }
  // cleanupOrphanedEdges was exported but
  // Never invoked at runtime. Wire it into autoRepair so orphaned causal edges
  // (referencing deleted memories) are cleaned up during health checks.
  if (autoRepair && database) {
    try {
      // Fix F8 — ensure causal-edges DB init before orphan cleanup.
      causalEdges.init(database);
      const orphanResult = causalEdges.cleanupOrphanedEdges();
      if (orphanResult.deleted > 0) {
        causalEdgeHealth.repaired = orphanResult.deleted;
        causalEdgeHealth.tombstoned = orphanResult.tombstoned;
        trackRepairOutcome(true);
        repair.actions.push(`orphan_edges_cleaned:${orphanResult.deleted}`);
        repair.actions.push(`orphan_edges_tombstoned:${orphanResult.tombstoned}`);
        hints.push(`Auto-repair: tombstoned and removed ${orphanResult.deleted} orphaned causal edge(s)`);
      }
    } catch (orphanError: unknown) {
      trackRepairOutcome(false);
      repair.errors.push(`Orphan edge cleanup failed: ${sanitizeErrorForHint(toErrorMessage(orphanError))}`);
    }
  }

  if (autoRepair && database) {
    try {
      const integrityReport = vectorIndex.verifyIntegrity({ autoClean: true, cleanFiles });
      const cleanedVectors = integrityReport.cleaned?.vectors ?? 0;
      const cleanedChunks = integrityReport.cleaned?.chunks ?? 0;
      const cleanedFiles = integrityReport.cleaned?.files ?? 0;

      if (cleanedVectors > 0) {
        trackRepairOutcome(true);
        repair.actions.push(`orphan_vectors_cleaned:${cleanedVectors}`);
        hints.push(`Auto-repair: removed ${cleanedVectors} orphaned vector(s)`);
      }

      if (cleanedChunks > 0) {
        trackRepairOutcome(true);
        repair.actions.push(`orphan_chunks_cleaned:${cleanedChunks}`);
        hints.push(`Auto-repair: removed ${cleanedChunks} orphaned chunk(s)`);
      }

      if (cleanedFiles > 0) {
        trackRepairOutcome(true);
        repair.actions.push(`orphan_files_cleaned:${cleanedFiles}`);
        hints.push(`Auto-repair: removed ${cleanedFiles} orphaned file row(s) (memory_index rows whose file_path no longer exists on disk)`);
      }

      const postRepairReport = vectorIndex.verifyIntegrity({ autoClean: false });
      if (
        postRepairReport.orphanedVectors > 0 ||
        postRepairReport.missingVectors > 0 ||
        postRepairReport.orphanedFiles.length > 0 ||
        postRepairReport.orphanedChunks > 0
      ) {
        repair.warnings.push(
          `Post-repair integrity still degraded: orphanedVectors=${postRepairReport.orphanedVectors}, ` +
          `missingVectors=${postRepairReport.missingVectors}, orphanedFiles=${postRepairReport.orphanedFiles.length}, ` +
          `orphanedChunks=${postRepairReport.orphanedChunks}`
        );
      }
    } catch (integrityError: unknown) {
      trackRepairOutcome(false);
      repair.errors.push(`Integrity cleanup failed: ${sanitizeErrorForHint(toErrorMessage(integrityError))}`);
    }
  }

  if (repair.attempted) {
    repair.repaired = failedRepairCount === 0 && successfulRepairCount > 0;
    repair.partialSuccess = failedRepairCount > 0 && successfulRepairCount > 0;
  }

  if (aliasConflicts.groups > 0) {
    hints.push(`Detected ${aliasConflicts.groups} specs/.opencode alias group(s)`);
  }
  if (aliasConflicts.divergentHashGroups > 0) {
    hints.push(`${aliasConflicts.divergentHashGroups} alias group(s) have divergent content hashes`);
  }

  let routingTelemetry: Pick<
    ReturnType<typeof getRoutingTelemetrySnapshot>,
    'graphChannelInvocationRate' | 'channelInvocationCounts' | 'channelInvocationRates' | 'totalRecorded' | 'windowSize'
  >;
  let graphChannelMetrics: ReturnType<typeof getGraphMetrics>;
  try {
    routingTelemetry = getRoutingTelemetrySnapshot();
  } catch (err: unknown) {
    routingTelemetry = {
      graphChannelInvocationRate: 0,
      channelInvocationCounts: { vector: 0, fts: 0, bm25: 0, graph: 0, degree: 0 },
      channelInvocationRates: { vector: 0, fts: 0, bm25: 0, graph: 0, degree: 0 },
      totalRecorded: 0,
      windowSize: ROUTING_TELEMETRY_WINDOW_SIZE,
    };
    const errClass = err instanceof Error ? err.constructor.name : typeof err;
    const errMsg = err instanceof Error ? err.message : String(err);
    const hint = `Routing telemetry unavailable (${errClass}: ${errMsg})`.slice(0, 160);
    hints.push(hint);
  }
  try {
    graphChannelMetrics = getGraphMetrics();
  } catch (err: unknown) {
    graphChannelMetrics = {
      totalQueries: 0,
      graphHits: 0,
      graphResultCount: 0,
      graphOnlyResults: 0,
      graphMultiSourceResults: 0,
      multiSourceResults: 0,
      degreeQueries: 0,
      degreeHits: 0,
      degreeResultCount: 0,
      graphHitRate: 0,
      degreeHitRate: 0,
    };
    const errClass = err instanceof Error ? err.constructor.name : typeof err;
    const errMsg = err instanceof Error ? err.message : String(err);
    const hint = `Graph channel metrics unavailable (${errClass}: ${errMsg})`.slice(0, 160);
    hints.push(hint);
  }
  return createMCPSuccessResponse({
    tool: 'memory_health',
    summary,
    data: {
      status,
      runtime_initialized: runtimeInitialized,
      databaseConnected: !!database,
      vectorSearchAvailable: vectorIndex.isVectorSearchAvailable(),
      recallDegradation: vectorDegradation,
      memoryCount,
      uptime: process.uptime(),
      process: processHealth,
      index: indexHealth,
      maintenance,
      exclusionAudit,
      version: SERVER_VERSION,
      reportMode: 'full',
      aliasConflicts,
      consistency,
      causalEdges: causalEdgeHealth,
      repair,
      embeddingProvider: {
        provider: providerName,
        model: providerModel,
        dimension: providerDimension,
        dtype: providerDtype,
        healthy: providerMetadata.healthy !== false,
        databasePath: redactPath(vectorIndex.getDbPath() ?? ''),
      },
      embeddingRetry,
      routing: {
        graphChannelInvocationRate: routingTelemetry.graphChannelInvocationRate,
        channelInvocationCounts: routingTelemetry.channelInvocationCounts,
        channelInvocationRates: routingTelemetry.channelInvocationRates,
        graphContributionCounters: {
          totalQueries: graphChannelMetrics.totalQueries,
          graphHits: graphChannelMetrics.graphHits,
          graphResultCount: graphChannelMetrics.graphResultCount,
          graphOnlyResults: graphChannelMetrics.graphOnlyResults,
          graphMultiSourceResults: graphChannelMetrics.graphMultiSourceResults,
          multiSourceResults: graphChannelMetrics.multiSourceResults,
          graphHitRate: graphChannelMetrics.graphHitRate,
        },
        degreeContributionCounters: {
          degreeQueries: graphChannelMetrics.degreeQueries,
          degreeHits: graphChannelMetrics.degreeHits,
          degreeResultCount: graphChannelMetrics.degreeResultCount,
          degreeHitRate: graphChannelMetrics.degreeHitRate,
        },
        totalRecorded: routingTelemetry.totalRecorded,
        windowSize: routingTelemetry.windowSize,
      },
      redaction: getRedactionStats(),
      ...(fullMemoryReport ?? {}),
    },
    hints,
    startTime,
  });
}

/* ───────────────────────────────────────────────────────────────
   EXPORTS
──────────────────────────────────────────────────────────────── */

export const __testables = {
  DEFAULT_INTENDED_EXCLUSION_POLICY,
  auditHardExclusions,
  classifyExclusionPredicate,
  countExclusionCandidates,
};

export { handleMemoryHealth };
