// ───────────────────────────────────────────────────────────────
// MODULE: Relation Inference Backfill
// ───────────────────────────────────────────────────────────────
// Feature catalog: Causal graph statistics (memory_causal_stats)
//
// Bounded, safe, reversible relation-inference backfill. Infers typed
// causal edges from STRONG, EXISTING deterministic signals only — never a
// speculative semantic/ML heuristic. Every inferred edge is created_by='auto'
// so it inherits the runtime guards already enforced inside insertEdge
// (MAX_AUTO_STRENGTH=0.5, MAX_EDGES_PER_NODE=20, per-relation window cap,
// self-loop/orphan rejection) and stays auditable + idempotent (upsert).
//
// dryRun defaults to TRUE: callers must opt in to writes. The scan is bounded
// by `limit` so a single run can never flood a recovered production DB.

import type Database from 'better-sqlite3';

import {
  init as initCausalEdges,
  insertEdgesBatch,
  RELATION_TYPES,
  type RelationType,
} from '../storage/causal-edges.js';
import { invalidateEntityDensityCache } from '../search/entity-density.js';
import { relationsConflict } from '../graph/contradiction-detection.js';

/* ───────────────────────────────────────────────────────────────
   1. CONSTANTS
----------------------------------------------------------------*/

// Conservative default: a single backfill run touches at most this many
// memory rows. Keeps a manual/maintenance invocation against a large DB
// bounded and predictable. Callers may lower it; we clamp the upper end.
const DEFAULT_LIMIT = 200;
const MAX_LIMIT = 2000;

// Inferred-edge strengths stay well under MAX_AUTO_STRENGTH (0.5) so insertEdge
// never has to clamp them and the auto edges read as low-confidence inferences.
const LINEAGE_CAUSED_STRENGTH = 0.4;

// Similarity-derived 'supports' edges are the weakest inferences we emit: they
// rest on a cached cosine neighbour, not a structural document relationship, so
// they carry the lowest strength of any collector here (still < MAX_AUTO_STRENGTH).
const SIMILARITY_SUPPORTS_STRENGTH = 0.35;

// Structural supersession is a strong-but-not-document-chain signal, so the
// 'contradicts' edge sits just under the lineage 'caused' strength.
const SUPERSESSION_CONTRADICTS_STRENGTH = 0.3;

// Spec-document-chain inferred-edge strengths. These mirror the lineage/similarity
// constants above and deliberately differ from createSpecDocumentChain's manual
// strengths (0.7-0.9): an inferred auto edge is a low-confidence promotion of
// recorded structure, not the high-confidence manual chain the creator emits.
const SPEC_CHAIN_CAUSED_STRENGTH = 0.4;
const SPEC_CHAIN_SUPPORTS_STRENGTH = 0.4;

// Defaults for the opt-in similarity collector. The cached related_memories
// column stores similarity on a 0-100 scale; we only promote a neighbour to a
// 'supports' edge above this threshold, and keep at most this many per source.
const DEFAULT_SIMILARITY_THRESHOLD = 75;
const MIN_SIMILARITY_THRESHOLD = 1;
const MAX_SIMILARITY_THRESHOLD = 100;
const SIMILARITY_TOP_K = 5;

// document_type values we treat as a spec-document chain. Mirrors the mapping
// consumed by createSpecDocumentChain (spec/plan/tasks/implementation_summary
// chain + checklist/decision_record/research supports).
const SPEC_CHAIN_DOCUMENT_TYPES: ReadonlySet<string> = new Set([
  'spec',
  'plan',
  'tasks',
  'implementation_summary',
  'checklist',
  'decision_record',
  'research',
]);

/* ───────────────────────────────────────────────────────────────
   2. TYPES
----------------------------------------------------------------*/

interface BackfillRelationInferenceOptions {
  dryRun?: boolean;
  limit?: number;
  actor?: string;
  // OPT-IN: emit 'supports' edges from the cached related_memories column
  // (pre-computed cosine neighbours). Default false.
  similarity?: boolean;
  // OPT-IN: emit 'contradicts' edges from structural supersession
  // (memory_lineage.superseded_by_memory_id). Default false.
  contradicts?: boolean;
  // Minimum cached similarity (0-100 scale) for the similarity collector.
  // Defaults to DEFAULT_SIMILARITY_THRESHOLD.
  similarityThreshold?: number;
}

interface BackfillRelationInferenceResult {
  dryRun: boolean;
  scanned: number;
  inferred: number;
  skipped: number;
  written: number;
  // Auto edges suppressed because the (source,target) pair already carries a
  // VALID edge with a conflicting relation (e.g. a lineage 'caused' edge blocks
  // the supersession 'contradicts' for the same directed pair). These are NOT
  // counted as written and never reach the contradiction-detection invalidation
  // path, so they cannot silently invalidate a pre-existing valid edge.
  skippedConflicting: number;
  byRelation: Record<string, number>;
}

interface SpecDocRow {
  id: number;
  spec_folder: string | null;
  document_type: string | null;
}

interface LineageLinkRow {
  memory_id: number;
  predecessor_memory_id: number | null;
}

interface RelatedMemoriesRow {
  id: number;
  related_memories: string | null;
}

interface SupersessionRow {
  memory_id: number;
  superseded_by_memory_id: number | null;
}

type InferredEdge = {
  sourceId: string;
  targetId: string;
  relation: RelationType;
  strength: number;
  evidence: string;
};

/* ───────────────────────────────────────────────────────────────
   3. SIGNAL COLLECTION
----------------------------------------------------------------*/

function tableExists(db: Database.Database, name: string): boolean {
  try {
    const row = db.prepare(
      "SELECT 1 AS found FROM sqlite_master WHERE type IN ('table','view') AND name = ?",
    ).get(name) as { found?: number } | undefined;
    return row?.found === 1;
  } catch {
    return false;
  }
}

function columnExists(db: Database.Database, table: string, column: string): boolean {
  try {
    const rows = db.prepare(`PRAGMA table_info(${table})`).all() as Array<{ name?: string }>;
    return rows.some((row) => row.name === column);
  } catch {
    return false;
  }
}

/**
 * Spec-document chain edges. Groups the scanned rows by spec_folder, maps
 * document_type -> memory_index.id, and emits the same typed chain that
 * createSpecDocumentChain produces (spec->plan->tasks->impl = caused;
 * checklist/decision-record/research = supports). Only the most recent id
 * per (folder, document_type) is used so we link the active document.
 */
function collectSpecChainEdges(rows: SpecDocRow[]): Array<Record<string, number>> {
  const byFolder = new Map<string, Record<string, number>>();

  for (const row of rows) {
    const folder = row.spec_folder;
    const docType = row.document_type;
    if (!folder || !docType || !SPEC_CHAIN_DOCUMENT_TYPES.has(docType)) {
      continue;
    }
    let docs = byFolder.get(folder);
    if (!docs) {
      docs = {};
      byFolder.set(folder, docs);
    }
    // Rows arrive ordered newest-first; keep the first (latest) id per type.
    if (docs[docType] === undefined) {
      docs[docType] = row.id;
    }
  }

  const chains: Array<Record<string, number>> = [];
  for (const docs of byFolder.values()) {
    // A chain needs at least one linkable pair to produce an edge.
    if (Object.keys(docs).length >= 2) {
      chains.push(docs);
    }
  }
  return chains;
}

/**
 * Lineage predecessor edges: version N-1 -> version N is a 'caused' link
 * (the prior version caused the existence of the next). Reuses the existing
 * memory_lineage predecessor pointer — no inference, just promotion of a
 * recorded structural relation into the causal graph.
 */
function collectLineageEdges(rows: LineageLinkRow[]): InferredEdge[] {
  const edges: InferredEdge[] = [];
  for (const row of rows) {
    const predecessor = row.predecessor_memory_id;
    if (predecessor === null || predecessor === undefined) {
      continue;
    }
    if (predecessor === row.memory_id) {
      continue; // self-loop guard (insertEdge also rejects, belt-and-braces)
    }
    edges.push({
      sourceId: String(predecessor),
      targetId: String(row.memory_id),
      relation: RELATION_TYPES.CAUSED,
      strength: LINEAGE_CAUSED_STRENGTH,
      evidence: 'lineage predecessor->successor (version evolution)',
    });
  }
  return edges;
}

/**
 * Canonical unordered-pair key. The similarity collector deduplicates against
 * the spec-chain population, which emits directed edges; a 'supports' inference
 * for the same two nodes adds nothing, so we suppress it regardless of direction.
 */
function pairKey(a: string, b: string): string {
  return a < b ? `${a}|${b}` : `${b}|${a}`;
}

/**
 * Parse the cached related_memories JSON column. Mirrors the tolerant parsing in
 * co-activation.ts (accepts bare numeric ids and {id,similarity} objects). Bare
 * ids have no similarity score so they can never clear a >=1 threshold and are
 * dropped — only scored neighbours become 'supports' edges. Returns [] on any
 * absent/empty/unparseable input (never throws).
 */
function parseRelatedNeighbors(raw: string | null): Array<{ id: number; similarity: number }> {
  if (!raw) return [];
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(parsed)) return [];

  const out: Array<{ id: number; similarity: number }> = [];
  for (const entry of parsed) {
    if (typeof entry !== 'object' || entry === null) continue;
    const candidate = entry as { id?: unknown; similarity?: unknown };
    if (
      typeof candidate.id === 'number'
      && Number.isFinite(candidate.id)
      && typeof candidate.similarity === 'number'
      && Number.isFinite(candidate.similarity)
    ) {
      out.push({ id: candidate.id, similarity: candidate.similarity });
    }
  }
  return out;
}

/**
 * Similarity 'supports' edges. Reads ONLY the pre-computed memory_index.
 * related_memories column (no live vector_search / sqlite-vec scan, no O(n^2)
 * all-pairs work) so the collector is deterministic and testable. For each
 * scanned row: keep neighbours at or above `threshold` (0-100 scale), take the
 * top SIMILARITY_TOP_K by similarity, exclude self-loops and any pair already
 * produced by the spec-chain collector. Graceful no-op on absent/empty/
 * unparseable input.
 */
function collectSimilarityEdges(
  rows: RelatedMemoriesRow[],
  threshold: number,
  excludedPairs: Set<string>,
): InferredEdge[] {
  const edges: InferredEdge[] = [];
  for (const row of rows) {
    const sourceId = String(row.id);
    const neighbors = parseRelatedNeighbors(row.related_memories)
      .filter((n) => n.similarity >= threshold && n.id !== row.id)
      .sort((a, b) => b.similarity - a.similarity || a.id - b.id)
      .slice(0, SIMILARITY_TOP_K);

    for (const neighbor of neighbors) {
      const targetId = String(neighbor.id);
      if (excludedPairs.has(pairKey(sourceId, targetId))) {
        continue; // already linked by the structural spec-chain collector
      }
      edges.push({
        sourceId,
        targetId,
        relation: RELATION_TYPES.SUPPORTS,
        strength: SIMILARITY_SUPPORTS_STRENGTH,
        evidence: `cached similarity neighbour (>=${threshold})`,
      });
    }
  }
  return edges;
}

/**
 * Supersession 'contradicts' edges. Promotes the structural
 * memory_lineage.superseded_by_memory_id pointer into the causal graph:
 * predecessor 'contradicts' its successor (the successor records the
 * supersession direction). NOT derived from embedding similarity — supersession
 * is a recorded structural fact, so there is no semantic false-positive risk.
 */
function collectSupersessionEdges(rows: SupersessionRow[]): InferredEdge[] {
  const edges: InferredEdge[] = [];
  for (const row of rows) {
    const successor = row.superseded_by_memory_id;
    if (successor === null || successor === undefined) {
      continue;
    }
    if (successor === row.memory_id) {
      continue; // self-loop guard (insertEdge also rejects, belt-and-braces)
    }
    edges.push({
      sourceId: String(row.memory_id),
      targetId: String(successor),
      relation: RELATION_TYPES.CONTRADICTS,
      strength: SUPERSESSION_CONTRADICTS_STRENGTH,
      evidence: 'lineage supersession (predecessor contradicts successor)',
    });
  }
  return edges;
}

/* ───────────────────────────────────────────────────────────────
   4. BACKFILL
----------------------------------------------------------------*/

/**
 * Infer typed causal edges from strong existing signals and (optionally)
 * persist them. Default dryRun=true reports counts without writing.
 *
 * @param db Database connection.
 * @param options dryRun (default true), limit (bounded), actor (audit label),
 *   similarity/contradicts (OPT-IN collectors, default false), similarityThreshold.
 * @returns Summary: scanned, inferred, skipped, written, byRelation.
 */
export function backfillRelationInference(
  db: Database.Database,
  options: BackfillRelationInferenceOptions = {},
): BackfillRelationInferenceResult {
  const dryRun = options.dryRun !== false; // default TRUE; only explicit false writes
  const rawLimit = options.limit;
  const limit = Number.isInteger(rawLimit) && (rawLimit as number) > 0
    ? Math.min(rawLimit as number, MAX_LIMIT)
    : DEFAULT_LIMIT;

  // OPT-IN collectors: both default OFF so existing callers see no behaviour
  // change. The similarity threshold is clamped to its valid 1-100 range.
  const similarityEnabled = options.similarity === true;
  const contradictsEnabled = options.contradicts === true;
  const rawThreshold = options.similarityThreshold;
  const similarityThreshold = Number.isInteger(rawThreshold)
    ? Math.max(MIN_SIMILARITY_THRESHOLD, Math.min(MAX_SIMILARITY_THRESHOLD, rawThreshold as number))
    : DEFAULT_SIMILARITY_THRESHOLD;

  const empty: BackfillRelationInferenceResult = {
    dryRun,
    scanned: 0,
    inferred: 0,
    skipped: 0,
    written: 0,
    skippedConflicting: 0,
    byRelation: {},
  };

  if (!db || !tableExists(db, 'memory_index') || !tableExists(db, 'causal_edges')) {
    return empty;
  }

  // Bind the storage module to this DB so its guards (insertEdge bounds,
  // window cap, contradiction detection) operate on the same connection.
  initCausalEdges(db);

  // ── SCAN (bounded) ──────────────────────────────────────────────
  // Most-recently-updated rows first; newest id wins per (folder, type).
  let specRows: SpecDocRow[] = [];
  try {
    specRows = db.prepare(`
      SELECT id, spec_folder, document_type
      FROM memory_index
      WHERE spec_folder IS NOT NULL AND spec_folder != ''
      ORDER BY COALESCE(updated_at, created_at) DESC, id DESC
      LIMIT ?
    `).all(limit) as SpecDocRow[];
  } catch {
    specRows = [];
  }

  let lineageRows: LineageLinkRow[] = [];
  if (tableExists(db, 'memory_lineage')) {
    try {
      lineageRows = db.prepare(`
        SELECT memory_id, predecessor_memory_id
        FROM memory_lineage
        WHERE predecessor_memory_id IS NOT NULL
        ORDER BY memory_id DESC
        LIMIT ?
      `).all(limit) as LineageLinkRow[];
    } catch {
      lineageRows = [];
    }
  }

  // OPT-IN similarity scan: read the PRE-COMPUTED related_memories column only.
  // No live vector_search / sqlite-vec call and no all-pairs work.
  let relatedRows: RelatedMemoriesRow[] = [];
  if (similarityEnabled && columnExists(db, 'memory_index', 'related_memories')) {
    try {
      relatedRows = db.prepare(`
        SELECT id, related_memories
        FROM memory_index
        WHERE related_memories IS NOT NULL AND related_memories != ''
        ORDER BY COALESCE(updated_at, created_at) DESC, id DESC
        LIMIT ?
      `).all(limit) as RelatedMemoriesRow[];
    } catch {
      relatedRows = [];
    }
  }

  // OPT-IN supersession scan: structural memory_lineage.superseded_by_memory_id.
  let supersessionRows: SupersessionRow[] = [];
  if (
    contradictsEnabled
    && tableExists(db, 'memory_lineage')
    && columnExists(db, 'memory_lineage', 'superseded_by_memory_id')
  ) {
    try {
      supersessionRows = db.prepare(`
        SELECT memory_id, superseded_by_memory_id
        FROM memory_lineage
        WHERE superseded_by_memory_id IS NOT NULL
        ORDER BY memory_id DESC
        LIMIT ?
      `).all(limit) as SupersessionRow[];
    } catch {
      supersessionRows = [];
    }
  }

  const scanned = specRows.length + lineageRows.length
    + relatedRows.length + supersessionRows.length;

  // ── INFER ────────────────────────────────────────────────────────
  const specChains = collectSpecChainEdges(specRows);
  const lineageEdges = collectLineageEdges(lineageRows);

  // Pairs already produced structurally by the spec-chain collector; the
  // similarity collector excludes these so it never re-links a known pair.
  const specChainPairs = new Set<string>();
  for (const chain of specChains) {
    for (const edge of predictSpecChainEdges(chain)) {
      specChainPairs.add(pairKey(edge.sourceId, edge.targetId));
    }
  }

  const similarityEdges = similarityEnabled
    ? collectSimilarityEdges(relatedRows, similarityThreshold, specChainPairs)
    : [];
  const supersessionEdges = contradictsEnabled
    ? collectSupersessionEdges(supersessionRows)
    : [];

  // Predicted edge count for the spec chains: createSpecDocumentChain emits at
  // most 6 edges per fully-populated chain. We count what the batch reports as
  // the real "written" tally, but we still report `inferred` as the candidate
  // population so dryRun is informative.
  const inferred = specChainCandidateCount(specChains) + lineageEdges.length
    + similarityEdges.length + supersessionEdges.length;

  const byRelation: Record<string, number> = {};
  const bumpRelation = (relation: string, delta: number): void => {
    byRelation[relation] = (byRelation[relation] ?? 0) + delta;
  };

  // ── DRY RUN: report only, write ZERO edges ──────────────────────
  if (dryRun) {
    // Report candidate relation distribution without touching the DB.
    for (const chain of specChains) {
      for (const edge of predictSpecChainEdges(chain)) {
        bumpRelation(edge.relation, 1);
      }
    }
    for (const edge of lineageEdges) {
      bumpRelation(edge.relation, 1);
    }
    for (const edge of similarityEdges) {
      bumpRelation(edge.relation, 1);
    }
    for (const edge of supersessionEdges) {
      bumpRelation(edge.relation, 1);
    }
    return {
      dryRun: true,
      scanned,
      inferred,
      skipped: inferred,
      written: 0,
      skippedConflicting: 0,
      byRelation,
    };
  }

  // ── EXECUTE: transactional, guard-respecting writes ─────────────
  // Order matters for the conflict guard: the NON-conflicting collectors
  // (spec-chain + lineage 'caused', plus similarity 'supports' which never
  // conflicts with another auto inference) are inserted FIRST so the
  // conflict-prone collectors (supersession 'contradicts', and 'supports' if a
  // pre-existing conflicting edge exists) can see them as valid in-transaction
  // edges and SKIP rather than invalidate them.
  let written = 0;
  let skippedConflicting = 0;

  // Per-relation snapshot of VALID auto edges before the write. `written` and
  // `byRelation` are derived from the DELTA against this snapshot so pre-existing
  // (upserted) edges and edges silently invalidated by contradiction-detection
  // are never miscounted as freshly written — the count stays honest on re-runs.
  const beforeCounts = countValidAutoEdgesByRelation(db);

  const specChainEdges: InferredEdge[] = [];
  for (const chain of specChains) {
    specChainEdges.push(...predictSpecChainEdges(chain));
  }

  const execute = db.transaction(() => {
    // Insert the non-conflicting structural edges first. Spec-chain + lineage
    // are 'caused'/'supports'; createSpecDocumentChain defaults created_by to
    // 'manual', but we want 'auto' for auditability, so we re-emit through
    // insertEdgesBatch with createdBy:'auto' (every edge is still bound-checked,
    // window-capped, and auto-strength clamped by insertEdge).
    insertInferredEdges(specChainEdges);
    insertInferredEdges(lineageEdges);

    // Now the conflict-prone collectors. hasConflictingValidEdge sees the edges
    // just inserted above within THIS transaction, so a supersession
    // 'contradicts' whose pair already has a valid lineage 'caused' is skipped
    // (it would otherwise mislabel an evolution as a contradiction and trigger
    // contradiction-detection to invalidate the valid 'caused' edge). The same
    // guard protects any PRE-EXISTING manual/higher-strength conflicting edge.
    skippedConflicting += insertNonConflictingEdges(db, similarityEdges);
    skippedConflicting += insertNonConflictingEdges(db, supersessionEdges);
  });

  try {
    execute();
  } catch {
    // best-effort: a failed transaction leaves the DB unchanged; written stays 0
  }

  // Derive written + byRelation from the committed delta (newly-valid auto edges
  // only). This is honest across re-runs (upserts add nothing) and immune to the
  // contradiction-detection invalidation path (an invalidated edge drops out of
  // the valid count, so it is never reported as written).
  const afterCounts = countValidAutoEdgesByRelation(db);
  for (const relation of Object.keys(afterCounts)) {
    const delta = afterCounts[relation] - (beforeCounts[relation] ?? 0);
    if (delta > 0) {
      bumpRelation(relation, delta);
      written += delta;
    }
  }

  // FRESHNESS: edge writers call invalidateDegreeCache() internally, but no
  // causal-edge mutation invalidates the entity-density cache. Raising
  // outgoing-edge counts changes the >=3-outgoing-edge entity-density routing
  // signal, so we MUST invalidate it explicitly after committing edges.
  invalidateEntityDensityCache();

  return {
    dryRun: false,
    scanned,
    inferred,
    written,
    skipped: Math.max(0, inferred - written),
    skippedConflicting,
    byRelation,
  };
}

/* ───────────────────────────────────────────────────────────────
   5. HELPERS
----------------------------------------------------------------*/

/**
 * Predict the typed edges this backfill emits for one document-type map. The
 * PAIRING (which document types link to which, and the relation) mirrors
 * createSpecDocumentChain so dryRun reporting and the actual write agree, but the
 * STRENGTHS deliberately differ: these are low-confidence auto inferences
 * (SPEC_CHAIN_*_STRENGTH), not the high-confidence manual strengths (0.7-0.9)
 * the creator hard-codes.
 */
function predictSpecChainEdges(ids: Record<string, number>): InferredEdge[] {
  const edges: InferredEdge[] = [];
  const push = (
    src: number | undefined,
    tgt: number | undefined,
    relation: RelationType,
    strength: number,
    label: string,
  ): void => {
    if (src === undefined || tgt === undefined || src === tgt) return;
    edges.push({
      sourceId: String(src),
      targetId: String(tgt),
      relation,
      strength,
      evidence: label,
    });
  };

  push(ids.spec, ids.plan, RELATION_TYPES.CAUSED, SPEC_CHAIN_CAUSED_STRENGTH, 'spec->plan chain');
  push(ids.plan, ids.tasks, RELATION_TYPES.CAUSED, SPEC_CHAIN_CAUSED_STRENGTH, 'plan->tasks chain');
  push(ids.tasks, ids.implementation_summary, RELATION_TYPES.CAUSED, SPEC_CHAIN_CAUSED_STRENGTH, 'tasks->impl chain');
  push(ids.checklist, ids.spec, RELATION_TYPES.SUPPORTS, SPEC_CHAIN_SUPPORTS_STRENGTH, 'checklist supports spec');
  push(ids.decision_record, ids.plan, RELATION_TYPES.SUPPORTS, SPEC_CHAIN_SUPPORTS_STRENGTH, 'decision-record supports plan');
  push(ids.research, ids.spec, RELATION_TYPES.SUPPORTS, SPEC_CHAIN_SUPPORTS_STRENGTH, 'research supports spec');

  return edges;
}

function specChainCandidateCount(chains: Array<Record<string, number>>): number {
  let total = 0;
  for (const chain of chains) {
    total += predictSpecChainEdges(chain).length;
  }
  return total;
}

/**
 * Re-emit inferred edges through insertEdgesBatch with createdBy:'auto'. Every
 * edge still flows through insertEdge's guards (bounds, window cap, auto-strength
 * clamp, self-loop/orphan rejection). Used by all collectors whose edges can
 * never conflict with another auto inference on the same pair.
 */
function insertInferredEdges(edges: InferredEdge[]): void {
  if (edges.length === 0) return;
  insertEdgesBatch(edges.map((edge) => ({
    sourceId: edge.sourceId,
    targetId: edge.targetId,
    relation: edge.relation,
    strength: edge.strength,
    evidence: edge.evidence,
    createdBy: 'auto',
  })));
}

/**
 * Insert inferred edges, but FIRST drop any whose (source,target) pair already
 * carries a VALID edge with a conflicting relation (per relationsConflict).
 * Returns the number skipped. The check runs against the live connection inside
 * the caller's transaction, so it observes edges inserted earlier in the SAME
 * transaction — this is what stops a supersession 'contradicts' from
 * invalidating a lineage 'caused' inserted moments before, and protects any
 * pre-existing manual/higher-strength conflicting edge.
 */
function insertNonConflictingEdges(db: Database.Database, edges: InferredEdge[]): number {
  if (edges.length === 0) return 0;
  const safe: InferredEdge[] = [];
  let skipped = 0;
  for (const edge of edges) {
    if (hasConflictingValidEdge(db, edge.sourceId, edge.targetId, edge.relation)) {
      skipped++;
      continue;
    }
    safe.push(edge);
  }
  insertInferredEdges(safe);
  return skipped;
}

/**
 * True if the (sourceId,targetId) pair already has a VALID (invalid_at IS NULL)
 * edge whose relation conflicts with `relation` per the shared conflict rules.
 * Mirrors detectContradictions' valid-edge query so the backfill suppresses an
 * edge that contradiction-detection would otherwise resolve by invalidating the
 * pre-existing valid edge. Fails open (returns false) on any query error.
 */
function hasConflictingValidEdge(
  db: Database.Database,
  sourceId: string,
  targetId: string,
  relation: RelationType,
): boolean {
  try {
    const hasInvalidAt = columnExists(db, 'causal_edges', 'invalid_at');
    const validClause = hasInvalidAt ? "AND (invalid_at IS NULL OR invalid_at = '')" : '';
    const rows = db.prepare(`
      SELECT relation FROM causal_edges
      WHERE source_id = ? AND target_id = ? ${validClause}
    `).all(sourceId, targetId) as Array<{ relation: string }>;
    return rows.some((row) => relationsConflict(row.relation, relation));
  } catch {
    return false;
  }
}

/**
 * Tally VALID (invalid_at IS NULL) created_by='auto' edges grouped by relation.
 * Snapshotting this before/after the write lets the caller report only the
 * committed delta as `written`/`byRelation`, which is honest across re-runs and
 * immune to contradiction-detection invalidation. Returns {} on any error.
 */
function countValidAutoEdgesByRelation(db: Database.Database): Record<string, number> {
  const out: Record<string, number> = {};
  try {
    const hasInvalidAt = columnExists(db, 'causal_edges', 'invalid_at');
    const validClause = hasInvalidAt ? "AND (invalid_at IS NULL OR invalid_at = '')" : '';
    const rows = db.prepare(`
      SELECT relation, COUNT(*) AS count FROM causal_edges
      WHERE created_by = 'auto' ${validClause}
      GROUP BY relation
    `).all() as Array<{ relation: string; count: number }>;
    for (const row of rows) {
      out[row.relation] = row.count;
    }
  } catch {
    // best-effort: an empty snapshot yields written=0 rather than a crash
  }
  return out;
}

/* ───────────────────────────────────────────────────────────────
   6. EXPORTS
----------------------------------------------------------------*/

export {
  DEFAULT_LIMIT,
  MAX_LIMIT,
};

export type {
  BackfillRelationInferenceOptions,
  BackfillRelationInferenceResult,
};
