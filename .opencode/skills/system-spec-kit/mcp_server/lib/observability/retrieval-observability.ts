// ───────────────────────────────────────────────────────────────
// MODULE: Retrieval Observability
// ───────────────────────────────────────────────────────────────

import type Database from 'better-sqlite3';

type MaintenanceTool = 'memory_index_scan' | 'memory_embedding_reconcile' | 'memory_retention_sweep';

export interface DocumentAnchorKey {
  path: string;
  anchor: string | null;
}

export interface WhyRankedTrace {
  document: DocumentAnchorKey;
  rank: number;
  effectiveScore: number | null;
  scoreSource: string;
  channels: Record<'vector' | 'bm25' | 'fts' | 'graph' | 'trigger', number | null>;
  signals: Record<'fsrs' | 'importance' | 'recency', number | null>;
  source: 'ranker_intermediates';
}

export interface RetrievalConflictWarning {
  type: 'verify_before_applying';
  relation: 'contradicts' | 'supersedes';
  documents: [DocumentAnchorKey, DocumentAnchorKey];
  message: string;
}

export interface VectorDegradationSignal {
  degraded: boolean;
  vectorSearchAvailable: boolean;
  mode: 'hybrid' | 'lexical_only';
  reason: string | null;
  degradedVector?: DegradedVectorHealthSnapshot;
}

export type DegradedVectorRepairState = 'healthy' | 'detected' | 'quarantined' | 'rebuilding' | 'rebuild_failed';

export interface DegradedVectorHealthSnapshot {
  state: DegradedVectorRepairState;
  degraded: boolean;
  detections: number;
  quarantines: number;
  rebuildsStarted: number;
  rebuildsCompleted: number;
  rebuildsFailed: number;
  lastEventAt: string | null;
  lastReason: string | null;
  lastShard: string | null;
  lastQuarantine: string | null;
  activeJobId: string | null;
}

export interface MaintenanceRunCounters {
  tool: MaintenanceTool;
  lastRunAt: string | null;
  lastStatus: 'success' | 'error' | 'coalesced' | null;
  counts: Record<string, number>;
  staleCandidates: number;
}

const CHANNEL_KEYS = ['vector', 'bm25', 'fts', 'graph', 'trigger'] as const;

const maintenanceRuns: Record<MaintenanceTool, MaintenanceRunCounters> = {
  memory_index_scan: emptyMaintenanceRun('memory_index_scan'),
  memory_embedding_reconcile: emptyMaintenanceRun('memory_embedding_reconcile'),
  memory_retention_sweep: emptyMaintenanceRun('memory_retention_sweep'),
};

const degradedVectorHealth: DegradedVectorHealthSnapshot = {
  state: 'healthy',
  degraded: false,
  detections: 0,
  quarantines: 0,
  rebuildsStarted: 0,
  rebuildsCompleted: 0,
  rebuildsFailed: 0,
  lastEventAt: null,
  lastReason: null,
  lastShard: null,
  lastQuarantine: null,
  activeJobId: null,
};

function emptyMaintenanceRun(tool: MaintenanceTool): MaintenanceRunCounters {
  return {
    tool,
    lastRunAt: null,
    lastStatus: null,
    counts: {},
    staleCandidates: 0,
  };
}

function finiteNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function scoreMap(value: unknown): Record<string, number> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const output: Record<string, number> = {};
  for (const [key, raw] of Object.entries(value as Record<string, unknown>)) {
    const score = finiteNumber(raw);
    if (score !== null) output[key] = score;
  }
  return output;
}

function basenameOrNull(value: string | null | undefined): string | null {
  if (!value) return null;
  const normalized = value.replace(/\\/g, '/');
  return normalized.slice(normalized.lastIndexOf('/') + 1);
}

function updateDegradedVectorHealth(update: Partial<DegradedVectorHealthSnapshot>): void {
  Object.assign(degradedVectorHealth, update, {
    degraded: update.state ? update.state !== 'healthy' : degradedVectorHealth.state !== 'healthy',
    lastEventAt: new Date().toISOString(),
  });
}

function channelScore(rawResult: Record<string, unknown>, channel: typeof CHANNEL_KEYS[number]): number | null {
  const scores = scoreMap(rawResult.sourceScores);
  if (scores[channel] !== undefined) return scores[channel];
  if (channel === 'fts') return finiteNumber(rawResult.fts_score);
  if (channel === 'bm25') return finiteNumber(rawResult.bm25_score);
  if (channel === 'trigger') return finiteNumber(rawResult.triggerScore);
  if (channel === 'graph') {
    const contribution = rawResult.graphContribution;
    if (contribution && typeof contribution === 'object' && !Array.isArray(contribution)) {
      const total = finiteNumber((contribution as Record<string, unknown>).totalDelta);
      if (total !== null) return total;
    }
  }
  if (channel === 'vector') {
    const similarity = finiteNumber(rawResult.similarity ?? rawResult.averageSimilarity);
    return similarity !== null ? similarity / 100 : null;
  }
  return null;
}

function resolveEffectiveScore(rawResult: Record<string, unknown>): { score: number | null; source: string } {
  for (const [field, source] of [
    ['intentAdjustedScore', 'intentAdjusted'],
    ['rrfScore', 'fusion'],
    ['stage2Score', 'stage2'],
    ['score', 'score'],
    ['similarity', 'semantic'],
    ['averageSimilarity', 'semantic'],
  ] as const) {
    const score = finiteNumber(rawResult[field]);
    if (score !== null) {
      return { score: field === 'similarity' || field === 'averageSimilarity' ? score / 100 : score, source };
    }
  }
  return { score: null, source: 'none' };
}

export function resolveDocumentAnchor(rawResult: Record<string, unknown>): DocumentAnchorKey {
  const filePath = rawResult.file_path ?? rawResult.filePath;
  const anchor = rawResult.anchor_id ?? rawResult.anchorId;
  return {
    path: typeof filePath === 'string' ? filePath : '',
    anchor: typeof anchor === 'string' && anchor.trim().length > 0 ? anchor.trim() : null,
  };
}

export function buildWhyRankedTrace(rawResult: Record<string, unknown>, rank: number): WhyRankedTrace {
  const effective = resolveEffectiveScore(rawResult);
  return {
    document: resolveDocumentAnchor(rawResult),
    rank,
    effectiveScore: effective.score,
    scoreSource: effective.source,
    channels: {
      vector: channelScore(rawResult, 'vector'),
      bm25: channelScore(rawResult, 'bm25'),
      fts: channelScore(rawResult, 'fts'),
      graph: channelScore(rawResult, 'graph'),
      trigger: channelScore(rawResult, 'trigger'),
    },
    signals: {
      fsrs: finiteNumber(rawResult.attentionScore ?? rawResult.retrievability ?? rawResult.stability),
      importance: finiteNumber(rawResult.importance_weight),
      recency: finiteNumber(rawResult.recencyScore ?? rawResult.recency_score),
    },
    source: 'ranker_intermediates',
  };
}

export function buildVectorDegradationSignal(
  vectorSearchAvailable: boolean,
  degradedVector = getDegradedVectorObservabilitySnapshot(),
): VectorDegradationSignal {
  const degraded = !vectorSearchAvailable || degradedVector.degraded;
  return {
    degraded,
    vectorSearchAvailable,
    mode: vectorSearchAvailable ? 'hybrid' : 'lexical_only',
    reason: !vectorSearchAvailable
      ? 'vector_search_unavailable'
      : degradedVector.degraded
        ? `vector_shard_${degradedVector.state}`
        : null,
    degradedVector,
  };
}

export function recordVectorShardProbeFailure(input: { shardPath: string; reason: string }): void {
  degradedVectorHealth.detections += 1;
  updateDegradedVectorHealth({
    state: 'detected',
    lastReason: input.reason,
    lastShard: basenameOrNull(input.shardPath),
  });
}

export function recordVectorShardQuarantined(input: { shardPath: string; quarantinePath: string; reason: string }): void {
  degradedVectorHealth.quarantines += 1;
  updateDegradedVectorHealth({
    state: 'quarantined',
    lastReason: input.reason,
    lastShard: basenameOrNull(input.shardPath),
    lastQuarantine: basenameOrNull(input.quarantinePath),
  });
}

export function recordVectorShardRebuildStarted(input: { jobId: string; shardPath: string; reason: string }): void {
  degradedVectorHealth.rebuildsStarted += 1;
  updateDegradedVectorHealth({
    state: 'rebuilding',
    activeJobId: input.jobId,
    lastReason: input.reason,
    lastShard: basenameOrNull(input.shardPath),
  });
}

export function recordVectorShardRebuildCompleted(input: { jobId: string; shardPath: string }): void {
  degradedVectorHealth.rebuildsCompleted += 1;
  updateDegradedVectorHealth({
    state: 'healthy',
    activeJobId: degradedVectorHealth.activeJobId === input.jobId ? null : degradedVectorHealth.activeJobId,
    lastReason: null,
    lastShard: basenameOrNull(input.shardPath),
  });
}

export function recordVectorShardRebuildFailed(input: { jobId: string; shardPath: string; reason: string }): void {
  degradedVectorHealth.rebuildsFailed += 1;
  updateDegradedVectorHealth({
    state: 'rebuild_failed',
    activeJobId: degradedVectorHealth.activeJobId === input.jobId ? null : degradedVectorHealth.activeJobId,
    lastReason: input.reason,
    lastShard: basenameOrNull(input.shardPath),
  });
}

export function getDegradedVectorObservabilitySnapshot(): DegradedVectorHealthSnapshot {
  return { ...degradedVectorHealth };
}

export function resetDegradedVectorObservabilityForTest(): void {
  Object.assign(degradedVectorHealth, {
    state: 'healthy',
    degraded: false,
    detections: 0,
    quarantines: 0,
    rebuildsStarted: 0,
    rebuildsCompleted: 0,
    rebuildsFailed: 0,
    lastEventAt: null,
    lastReason: null,
    lastShard: null,
    lastQuarantine: null,
    activeJobId: null,
  });
}

export function recordMaintenanceRun(
  tool: MaintenanceTool,
  input: { status: MaintenanceRunCounters['lastStatus']; counts?: Record<string, unknown>; staleCandidates?: number },
): void {
  const counts: Record<string, number> = {};
  for (const [key, value] of Object.entries(input.counts ?? {})) {
    const count = finiteNumber(value);
    if (count !== null) counts[key] = count;
  }
  maintenanceRuns[tool] = {
    tool,
    lastRunAt: new Date().toISOString(),
    lastStatus: input.status,
    counts,
    staleCandidates: Math.max(0, Math.floor(input.staleCandidates ?? 0)),
  };
}

export function getMaintenanceObservabilitySnapshot(): Record<MaintenanceTool, MaintenanceRunCounters> {
  return {
    memory_index_scan: { ...maintenanceRuns.memory_index_scan, counts: { ...maintenanceRuns.memory_index_scan.counts } },
    memory_embedding_reconcile: { ...maintenanceRuns.memory_embedding_reconcile, counts: { ...maintenanceRuns.memory_embedding_reconcile.counts } },
    memory_retention_sweep: { ...maintenanceRuns.memory_retention_sweep, counts: { ...maintenanceRuns.memory_retention_sweep.counts } },
  };
}

export function findInlineConflictWarnings(
  results: Array<Record<string, unknown>>,
  dbGetter: () => Database.Database,
): RetrievalConflictWarning[] {
  const byId = new Map<string, Record<string, unknown>>();
  for (const result of results) {
    const id = result.id;
    if (typeof id === 'number' || typeof id === 'string') byId.set(String(id), result);
  }
  if (byId.size < 2) return [];

  let database: Database.Database;
  try {
    database = dbGetter();
  } catch {
    return [];
  }

  try {
    const ids = Array.from(byId.keys());
    const placeholders = ids.map(() => '?').join(',');
    const rows = database.prepare(`
      SELECT source_id, target_id, relation
      FROM causal_edges
      WHERE relation IN ('contradicts', 'supersedes')
        AND source_id IN (${placeholders})
        AND target_id IN (${placeholders})
    `).all(...ids, ...ids) as Array<{ source_id: string; target_id: string; relation: 'contradicts' | 'supersedes' }>;

    const warnings: RetrievalConflictWarning[] = [];
    const seen = new Set<string>();
    for (const row of rows) {
      const source = byId.get(String(row.source_id));
      const target = byId.get(String(row.target_id));
      if (!source || !target) continue;
      const key = [row.relation, row.source_id, row.target_id].join(':');
      if (seen.has(key)) continue;
      seen.add(key);
      const documents: [DocumentAnchorKey, DocumentAnchorKey] = [
        resolveDocumentAnchor(source),
        resolveDocumentAnchor(target),
      ];
      warnings.push({
        type: 'verify_before_applying',
        relation: row.relation,
        documents,
        message: `Returned memories are linked by ${row.relation}; verify before applying either document.`,
      });
    }
    return warnings;
  } catch {
    return [];
  }
}

export const __testables = {
  buildWhyRankedTrace,
  buildVectorDegradationSignal,
  findInlineConflictWarnings,
  getDegradedVectorObservabilitySnapshot,
  getMaintenanceObservabilitySnapshot,
  recordMaintenanceRun,
  resetDegradedVectorObservabilityForTest,
};
