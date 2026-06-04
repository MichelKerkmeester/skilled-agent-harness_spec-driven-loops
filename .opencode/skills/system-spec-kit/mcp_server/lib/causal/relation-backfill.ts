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
  createSpecDocumentChain,
  RELATION_TYPES,
  type RelationType,
} from '../storage/causal-edges.js';
import { invalidateEntityDensityCache } from '../search/entity-density.js';

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
      byRelation,
    };
  }

  // ── EXECUTE: transactional, guard-respecting writes ─────────────
  let written = 0;

  const execute = db.transaction(() => {
    let total = 0;

    // Spec-document chains via the established creator (it batches through
    // insertEdge, so every edge is bound-checked + window-capped + auto-strength
    // clamped). createSpecDocumentChain hard-codes created_by via its batch
    // default ('manual'); we instead want created_by='auto' for auditability,
    // so we re-emit the same edges through insertEdgesBatch with created_by.
    for (const chain of specChains) {
      const edges = predictSpecChainEdges(chain).map((edge) => ({
        sourceId: edge.sourceId,
        targetId: edge.targetId,
        relation: edge.relation,
        strength: edge.strength,
        evidence: edge.evidence,
        createdBy: 'auto',
      }));
      if (edges.length === 0) continue;
      const result = insertEdgesBatch(edges);
      total += result.inserted;
      for (const edge of edges) {
        // Best-effort per-relation accounting; batch reports an aggregate
        // inserted count, so we attribute proportionally by emitting per edge
        // only when the batch inserted at least that many.
        bumpRelation(edge.relation, 0); // ensure key exists
      }
    }

    // Lineage 'caused' edges.
    if (lineageEdges.length > 0) {
      const result = insertEdgesBatch(lineageEdges.map((edge) => ({
        sourceId: edge.sourceId,
        targetId: edge.targetId,
        relation: edge.relation,
        strength: edge.strength,
        evidence: edge.evidence,
        createdBy: 'auto',
      })));
      total += result.inserted;
    }

    // OPT-IN similarity 'supports' edges (from cached related_memories).
    if (similarityEdges.length > 0) {
      const result = insertEdgesBatch(similarityEdges.map((edge) => ({
        sourceId: edge.sourceId,
        targetId: edge.targetId,
        relation: edge.relation,
        strength: edge.strength,
        evidence: edge.evidence,
        createdBy: 'auto',
      })));
      total += result.inserted;
    }

    // OPT-IN supersession 'contradicts' edges (from structural lineage).
    if (supersessionEdges.length > 0) {
      const result = insertEdgesBatch(supersessionEdges.map((edge) => ({
        sourceId: edge.sourceId,
        targetId: edge.targetId,
        relation: edge.relation,
        strength: edge.strength,
        evidence: edge.evidence,
        createdBy: 'auto',
      })));
      total += result.inserted;
    }

    return total;
  });

  try {
    written = execute();
  } catch {
    written = 0;
  }

  // Recompute byRelation from what is now present for the inferred pairs so the
  // summary reflects committed reality, not the candidate population.
  if (written > 0) {
    countWrittenByRelation(
      db,
      specChains,
      [...lineageEdges, ...similarityEdges, ...supersessionEdges],
      byRelation,
    );
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
    byRelation,
  };
}

/* ───────────────────────────────────────────────────────────────
   5. HELPERS
----------------------------------------------------------------*/

/**
 * Predict the typed edges createSpecDocumentChain would emit for one
 * document-type map. Kept in lock-step with createSpecDocumentChain's pairing
 * rules so dryRun reporting and the actual write agree.
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

  push(ids.spec, ids.plan, RELATION_TYPES.CAUSED, 0.4, 'spec->plan chain');
  push(ids.plan, ids.tasks, RELATION_TYPES.CAUSED, 0.4, 'plan->tasks chain');
  push(ids.tasks, ids.implementation_summary, RELATION_TYPES.CAUSED, 0.4, 'tasks->impl chain');
  push(ids.checklist, ids.spec, RELATION_TYPES.SUPPORTS, 0.4, 'checklist supports spec');
  push(ids.decision_record, ids.plan, RELATION_TYPES.SUPPORTS, 0.4, 'decision-record supports plan');
  push(ids.research, ids.spec, RELATION_TYPES.SUPPORTS, 0.4, 'research supports spec');

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
 * After a committed run, read the actual auto edges back for the inferred
 * source/target pairs and tally them by relation. This gives an accurate
 * byRelation distribution that reflects guard-rejected duplicates/bounds.
 */
function countWrittenByRelation(
  db: Database.Database,
  specChains: Array<Record<string, number>>,
  directEdges: InferredEdge[],
  byRelation: Record<string, number>,
): void {
  const candidates: InferredEdge[] = [];
  for (const chain of specChains) {
    candidates.push(...predictSpecChainEdges(chain));
  }
  candidates.push(...directEdges);

  let stmt: Database.Statement;
  try {
    stmt = db.prepare(`
      SELECT 1 AS found FROM causal_edges
      WHERE source_id = ? AND target_id = ? AND relation = ? AND created_by = 'auto'
    `);
  } catch {
    return;
  }

  for (const edge of candidates) {
    try {
      const row = stmt.get(edge.sourceId, edge.targetId, edge.relation) as { found?: number } | undefined;
      if (row?.found === 1) {
        byRelation[edge.relation] = (byRelation[edge.relation] ?? 0) + 1;
      }
    } catch {
      // skip
    }
  }
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
