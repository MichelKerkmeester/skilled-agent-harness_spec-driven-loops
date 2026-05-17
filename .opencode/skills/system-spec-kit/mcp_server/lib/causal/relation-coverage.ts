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
    command: string;
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

const BACKFILL_COMMAND = 'memory_health({ autoRepair: true, confirmed: true })';

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
      command: BACKFILL_COMMAND,
      lastBackfillAt: readLastBackfillAt(db),
    },
    targets,
    current,
    status,
    remediationHint: status === 'met'
      ? null
      : `Run ${BACKFILL_COMMAND} to backfill relation coverage; prioritize ${failing.map((entry) => entry.relation).join(', ') || 'unlinked records'}.`,
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
