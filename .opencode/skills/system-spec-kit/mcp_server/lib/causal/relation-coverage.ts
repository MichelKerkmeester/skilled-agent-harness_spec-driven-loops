// ───────────────────────────────────────────────────────────────
// MODULE: Relation Coverage
// ───────────────────────────────────────────────────────────────
// Feature catalog: Causal graph statistics (memory_causal_stats)

import type Database from 'better-sqlite3';

type CoverageStatus = 'met' | 'below_target' | 'no_edges';

interface RelationCoverageTarget {
  relation: string;
  minimumShare: number;
  maximumShare?: number;
  minimumCount: number;
}

interface RelationCoverageEntry extends RelationCoverageTarget {
  count: number;
  share: number;
  status: CoverageStatus;
}

interface RelationCoverageState {
  backfillJob: {
    name: string;
    scope: string;
    // Honest signal: a bounded relation-inference backfill IS now wired. It infers typed edges from
    // strong EXISTING signals only (spec-document chains + lineage predecessor links), all created_by
    // 'auto' and subject to insertEdge's guards. `command` names the real callable entry point;
    // `lastBackfillAt` is the latest auto-edge timestamp (null until the job has run at least once).
    implemented: boolean;
    command: string | null;
    lastBackfillAt: string | null;
  };
  targets: RelationCoverageTarget[];
  current: RelationCoverageEntry[];
  status: CoverageStatus;
  remediationHint: string | null;
}

const DEFAULT_RELATION_TARGETS: RelationCoverageTarget[] = [
  { relation: 'caused', minimumShare: 0.05, minimumCount: 1 },
  { relation: 'supports', minimumShare: 0.05, minimumCount: 1 },
  { relation: 'contradicts', minimumShare: 0, minimumCount: 0 },
  { relation: 'supersedes', minimumShare: 0, maximumShare: 0.75, minimumCount: 0 },
  { relation: 'produced', minimumShare: 0, minimumCount: 0 },
  { relation: 'cited_by', minimumShare: 0, minimumCount: 0 },
];

// Real, callable entry point for the bounded relation-inference backfill.
// Wired in handlers/causal-graph.ts (handleMemoryCausalStats accepts { backfill }).
// Defaults to a dry run; pass dryRun:false to commit bounded auto edges.
const BACKFILL_COMMAND = 'memory_causal_stats({ backfill: { dryRun: false } })';

function clampShare(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

function roundShare(value: number): number {
  return Math.round(clampShare(value) * 10000) / 10000;
}

function readLastBackfillAt(db: Database.Database | null): string | null {
  if (!db) return null;

  try {
    const row = db.prepare(`
      SELECT MAX(extracted_at) AS lastBackfillAt
      FROM causal_edges
      WHERE created_by = 'auto'
    `).get() as { lastBackfillAt?: string | null } | undefined;
    return typeof row?.lastBackfillAt === 'string' ? row.lastBackfillAt : null;
  } catch {
    return null;
  }
}

function buildRelationCoverageState(
  byRelation: Record<string, number>,
  db: Database.Database | null = null,
  targets: RelationCoverageTarget[] = DEFAULT_RELATION_TARGETS,
): RelationCoverageState {
  const total = Object.values(byRelation).reduce((sum, value) => (
    sum + (Number.isFinite(value) ? Math.max(0, value) : 0)
  ), 0);

  const current = targets.map((target): RelationCoverageEntry => {
    const count = Math.max(0, byRelation[target.relation] ?? 0);
    const share = total > 0 ? roundShare(count / total) : 0;
    const belowMinimum = count < target.minimumCount || share < target.minimumShare;
    const aboveMaximum = target.maximumShare !== undefined && share > target.maximumShare;
    const status: CoverageStatus = total === 0
      ? 'no_edges'
      : belowMinimum || aboveMaximum ? 'below_target' : 'met';
    return {
      ...target,
      count,
      share,
      status,
    };
  });

  const failing = current.filter((entry) => entry.status !== 'met');
  const status: CoverageStatus = total === 0
    ? 'no_edges'
    : failing.length > 0 ? 'below_target' : 'met';

  return {
    backfillJob: {
      name: 'autonomous-causal-relation-backfill',
      scope: 'memory causal graph relation balancing across caused/supports/contradicts/supersedes/produced/cited_by',
      implemented: true,
      command: BACKFILL_COMMAND,
      lastBackfillAt: readLastBackfillAt(db),
    },
    targets,
    current,
    status,
    remediationHint: status === 'met'
      ? null
      : `Below target: ${failing.map((entry) => entry.relation).join(', ') || 'unlinked records'}. Run ${BACKFILL_COMMAND} to infer typed edges from spec-document chains + lineage links (bounded, created_by='auto', idempotent). Additional similarity-derived 'supports' and structural-supersession 'contradicts' edges are available via the OPT-IN collectors: memory_causal_stats({ backfill: { dryRun:false, similarity:true, contradicts:true } }). 'supports' also grows via post-insert enrichment on save, and any typed relation can be set explicitly via memory_causal_link.`,
  };
}

export {
  DEFAULT_RELATION_TARGETS,
  BACKFILL_COMMAND,
  buildRelationCoverageState,
};

export type {
  CoverageStatus,
  RelationCoverageTarget,
  RelationCoverageEntry,
  RelationCoverageState,
};
