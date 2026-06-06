// MODULE: Coverage Graph Signals

import Database from '../../../system-spec-kit/mcp_server/node_modules/better-sqlite3/lib/index.js';
import type {
  Namespace,
  LoopType,
  CoverageNode,
  CoverageEdge,
} from './coverage-graph-db.js';
import {
  getDb,
  getNodes,
  getEdges,
  createSnapshot,
  getSnapshots,
  getStats,
} from './coverage-graph-db.js';

// ───── TYPE DEFINITIONS ─────

export interface NodeSignal {
  nodeId: string;
  kind: string;
  degree: number;
  inDegree: number;
  outDegree: number;
  depth: number;
  weightSum: number;
}

export interface ResearchConvergenceSignals {
  questionCoverage: number;
  claimVerificationRate: number;
  contradictionDensity: number;
  sourceDiversity: number;
  evidenceDepth: number;
}

export interface ReviewConvergenceSignals {
  dimensionCoverage: number;
  findingStability: number;
  p0ResolutionRate: number;
  evidenceDensity: number;
  hotspotSaturation: number;
}

export interface ContextConvergenceSignals {
  sliceCoverage: number;
  reuseCatalogCoverage: number;
  agreementRate: number;
  relevanceFloor: number;
  dependencyCompleteness: number;
}

export type ConvergenceSignals =
  | ResearchConvergenceSignals
  | ReviewConvergenceSignals
  | ContextConvergenceSignals;

export interface SignalSnapshot {
  iteration: number;
  signals: ConvergenceSignals;
  nodeSignals: NodeSignal[];
  nodeCount: number;
  edgeCount: number;
}

// ───── CONSTANTS ─────

type ResearchSignalNodeLike = {
  id: string;
  kind: string;
  metadata?: CoverageNode['metadata'] | string | null;
};

type ResearchSignalEdgeLike = {
  sourceId: string;
  targetId: string;
  relation: string;
};

interface SqlFragment {
  clause: string;
  params: unknown[];
}

// ───── HELPERS ─────

function buildNamespacePredicate(alias: string, ns: Namespace): SqlFragment {
  const prefix = alias ? `${alias}.` : '';
  const clauses = [`${prefix}spec_folder = ?`, `${prefix}loop_type = ?`];
  const params: unknown[] = [ns.specFolder, ns.loopType];

  if (ns.sessionId) {
    clauses.push(`${prefix}session_id = ?`);
    params.push(ns.sessionId);
  }

  return {
    clause: clauses.join(' AND '),
    params,
  };
}

function buildCompositeNodeJoin(
  nodeAlias: string,
  edgeAlias: string,
  edgeNodeColumn: 'source_id' | 'target_id',
): string {
  return `${nodeAlias}.spec_folder = ${edgeAlias}.spec_folder
      AND ${nodeAlias}.loop_type = ${edgeAlias}.loop_type
      AND ${nodeAlias}.session_id = ${edgeAlias}.session_id
      AND ${nodeAlias}.id = ${edgeAlias}.${edgeNodeColumn}`;
}

function parseNodeMetadata(metadata: CoverageNode['metadata'] | string | null | undefined): Record<string, unknown> | null {
  if (!metadata) return null;
  if (typeof metadata === 'string') {
    try {
      const parsed = JSON.parse(metadata) as unknown;
      return parsed && typeof parsed === 'object' ? parsed as Record<string, unknown> : null;
    } catch {
      return null;
    }
  }
  return typeof metadata === 'object' ? metadata as Record<string, unknown> : null;
}

function buildAnsweringFindingsByQuestion(edges: ReadonlyArray<ResearchSignalEdgeLike>): Map<string, string[]> {
  const answeringFindings = new Map<string, string[]>();

  for (const edge of edges) {
    if (edge.relation !== 'ANSWERS') continue;
    if (!answeringFindings.has(edge.targetId)) answeringFindings.set(edge.targetId, []);
    answeringFindings.get(edge.targetId)!.push(edge.sourceId);
  }

  return answeringFindings;
}

function buildCitedSourcesByFinding(edges: ReadonlyArray<ResearchSignalEdgeLike>): Map<string, string[]> {
  const citedSources = new Map<string, string[]>();

  for (const edge of edges) {
    if (edge.relation !== 'CITES') continue;
    if (!citedSources.has(edge.sourceId)) citedSources.set(edge.sourceId, []);
    citedSources.get(edge.sourceId)!.push(edge.targetId);
  }

  return citedSources;
}

/**
 * Compute longest-path depth for each node from any root node.
 * Mirrors the in-memory CJS implementation so both layers report
 * the same structural depth for DAG-shaped coverage graphs.
 */
function computeDepths(nodes: CoverageNode[], edges: CoverageEdge[]): Map<string, number> {
  const adjacency = new Map<string, string[]>();
  const inDegree = new Map<string, number>();

  for (const node of nodes) {
    adjacency.set(node.id, []);
    inDegree.set(node.id, 0);
  }

  for (const edge of edges) {
    if (!adjacency.has(edge.sourceId)) adjacency.set(edge.sourceId, []);
    adjacency.get(edge.sourceId)!.push(edge.targetId);
    inDegree.set(edge.targetId, (inDegree.get(edge.targetId) ?? 0) + 1);
    if (!inDegree.has(edge.sourceId)) inDegree.set(edge.sourceId, 0);
  }

  const depthMap = new Map<string, number>();
  const remaining = new Map(inDegree);
  const queue: string[] = [];

  for (const [id, degree] of remaining) {
    if (degree === 0) {
      depthMap.set(id, 0);
      queue.push(id);
    }
  }

  let queueIndex = 0;
  while (queueIndex < queue.length) {
    const current = queue[queueIndex++];
    const currentDepth = depthMap.get(current) ?? 0;

    for (const childId of adjacency.get(current) ?? []) {
      const candidateDepth = currentDepth + 1;
      if (candidateDepth > (depthMap.get(childId) ?? 0)) {
        depthMap.set(childId, candidateDepth);
      }

      const nextDegree = (remaining.get(childId) ?? 0) - 1;
      remaining.set(childId, nextDegree);
      if (nextDegree === 0) {
        queue.push(childId);
      }
    }
  }

  for (const node of nodes) {
    if (!depthMap.has(node.id)) depthMap.set(node.id, 0);
  }

  return depthMap;
}

function computeHotspotSaturation(d: Database.Database, ns: Namespace): number {
  const nodeNamespace = buildNamespacePredicate('', ns);
  const edgeNamespace = buildNamespacePredicate('e', ns);
  const files = d.prepare(`
    SELECT id, metadata FROM coverage_nodes
    WHERE ${nodeNamespace.clause} AND kind = 'FILE'
  `).all(...nodeNamespace.params) as Array<{ id: string; metadata: string | null }>;

  const hotspotFiles: string[] = [];
  for (const f of files) {
    if (f.metadata) {
      try {
        const meta = JSON.parse(f.metadata);
        if (meta.hotspot_score && meta.hotspot_score > 0) {
          hotspotFiles.push(f.id);
        }
      } catch { }
    }
  }

  if (hotspotFiles.length === 0) return 1.0;

  let saturated = 0;
  for (const fileId of hotspotFiles) {
    const dimCoverage = (d.prepare(`
      SELECT COUNT(DISTINCT e.source_id) as c
      FROM coverage_edges e
      JOIN coverage_nodes n ON ${buildCompositeNodeJoin('n', 'e', 'source_id')}
      WHERE ${edgeNamespace.clause}
        AND e.target_id = ?
        AND e.relation = 'COVERS'
        AND n.kind = 'DIMENSION'
    `).get(...edgeNamespace.params, fileId) as { c: number }).c;

    if (dimCoverage >= 2) saturated++;
  }

  return hotspotFiles.length > 0 ? saturated / hotspotFiles.length : 1.0;
}

// ───── CORE LOGIC ─────

/**
 * Compute degree, depth, and weight signals for all nodes in a namespace.
 *
 * @param ns - Namespace identifying the coverage graph.
 * @returns Array of node-level signal objects.
 */
export function computeNodeSignals(ns: Namespace): NodeSignal[] {
  const nodes = getNodes(ns);
  const edges = getEdges(ns);

  const inDegreeMap = new Map<string, number>();
  const outDegreeMap = new Map<string, number>();
  const weightSumMap = new Map<string, number>();

  for (const edge of edges) {
    outDegreeMap.set(edge.sourceId, (outDegreeMap.get(edge.sourceId) ?? 0) + 1);
    inDegreeMap.set(edge.targetId, (inDegreeMap.get(edge.targetId) ?? 0) + 1);
    weightSumMap.set(edge.sourceId, (weightSumMap.get(edge.sourceId) ?? 0) + edge.weight);
    weightSumMap.set(edge.targetId, (weightSumMap.get(edge.targetId) ?? 0) + edge.weight);
  }

  const depthMap = computeDepths(nodes, edges);

  return nodes.map(node => ({
    nodeId: node.id,
    kind: node.kind,
    degree: (inDegreeMap.get(node.id) ?? 0) + (outDegreeMap.get(node.id) ?? 0),
    inDegree: inDegreeMap.get(node.id) ?? 0,
    outDegree: outDegreeMap.get(node.id) ?? 0,
    depth: depthMap.get(node.id) ?? 0,
    weightSum: weightSumMap.get(node.id) ?? 0,
  }));
}

/**
 * Canonical research question coverage: questions with at least two ANSWERS
 * edges divided by all research questions in the graph.
 *
 * @param nodes - Research nodes in the graph.
 * @param edges - Research edges in the graph.
 * @returns Coverage ratio in [0, 1].
 */
export function computeResearchQuestionCoverageFromData(
  nodes: ReadonlyArray<ResearchSignalNodeLike>,
  edges: ReadonlyArray<ResearchSignalEdgeLike>,
): number {
  const questionIds = nodes
    .filter(node => node.kind === 'QUESTION')
    .map(node => node.id);

  if (questionIds.length === 0) return 0;

  const answeringFindings = buildAnsweringFindingsByQuestion(edges);
  let coveredQuestions = 0;

  for (const questionId of questionIds) {
    if ((answeringFindings.get(questionId) ?? []).length >= 2) {
      coveredQuestions++;
    }
  }

  return coveredQuestions / questionIds.length;
}

/**
 * Canonical research claim verification rate: verified claims divided by all
 * claim nodes, where verified means verification_status exists and is not
 * "unresolved".
 *
 * Zero claim nodes is a vacuous pass (returns 1.0): there is nothing to verify,
 * so this signal must not block convergence. Returning 0 would mark the trace
 * entry failed and force a claimless-but-otherwise-converged graph to loop
 * forever, since no unverified-claims blocker is raised for the empty case.
 * This mirrors p0ResolutionRate, which also returns 1.0 when its denominator
 * is zero.
 *
 * @param nodes - Research nodes in the graph.
 * @returns Verification rate in [0, 1]; 1.0 when there are no claim nodes.
 */
export function computeResearchClaimVerificationRateFromData(
  nodes: ReadonlyArray<ResearchSignalNodeLike>,
): number {
  const claims = nodes.filter(node => node.kind === 'CLAIM');
  if (claims.length === 0) return 1.0;

  let verifiedClaims = 0;
  for (const claim of claims) {
    const meta = parseNodeMetadata(claim.metadata);
    if (meta?.verification_status && meta.verification_status !== 'unresolved') {
      verifiedClaims++;
    }
  }

  return verifiedClaims / claims.length;
}

/**
 * Canonical research contradiction density: CONTRADICTS edges divided by all
 * research edges in the graph.
 *
 * @param edges - Research edges in the graph.
 * @returns Contradiction density in [0, 1].
 */
export function computeResearchContradictionDensityFromData(
  edges: ReadonlyArray<ResearchSignalEdgeLike>,
): number {
  if (edges.length === 0) return 0;
  let contradictionCount = 0;

  for (const edge of edges) {
    if (edge.relation === 'CONTRADICTS') contradictionCount++;
  }

  return contradictionCount / edges.length;
}

/**
 * Canonical research source diversity: for each question, count distinct
 * source metadata quality classes reachable through ANSWERS -> CITES paths,
 * then average that count across all questions.
 *
 * @param nodes - Research nodes in the graph.
 * @param edges - Research edges in the graph.
 * @returns Average source diversity score.
 */
export function computeResearchSourceDiversityFromData(
  nodes: ReadonlyArray<ResearchSignalNodeLike>,
  edges: ReadonlyArray<ResearchSignalEdgeLike>,
): number {
  const questionIds = nodes
    .filter(node => node.kind === 'QUESTION')
    .map(node => node.id);

  if (questionIds.length === 0) return 0;

  const answeringFindings = buildAnsweringFindingsByQuestion(edges);
  const citedSources = buildCitedSourcesByFinding(edges);
  const sourceMetadataById = new Map<string, Record<string, unknown>>();

  for (const node of nodes) {
    if (node.kind !== 'SOURCE') continue;
    const meta = parseNodeMetadata(node.metadata);
    if (meta) sourceMetadataById.set(node.id, meta);
  }

  let totalDiversity = 0;

  for (const questionId of questionIds) {
    const qualityClasses = new Set<string>();

    for (const findingId of answeringFindings.get(questionId) ?? []) {
      for (const sourceId of citedSources.get(findingId) ?? []) {
        const qualityClass = sourceMetadataById.get(sourceId)?.quality_class;
        if (typeof qualityClass === 'string' && qualityClass.length > 0) {
          qualityClasses.add(qualityClass);
        }
      }
    }

    totalDiversity += qualityClasses.size;
  }

  return totalDiversity / questionIds.length;
}

/**
 * Canonical research evidence depth: average path length across all
 * question -> finding paths, scoring 2 when the finding cites at least one
 * source and 1 when it does not.
 *
 * @param nodes - Research nodes in the graph.
 * @param edges - Research edges in the graph.
 * @returns Average evidence depth score.
 */
export function computeResearchEvidenceDepthFromData(
  nodes: ReadonlyArray<ResearchSignalNodeLike>,
  edges: ReadonlyArray<ResearchSignalEdgeLike>,
): number {
  const questionIds = nodes
    .filter(node => node.kind === 'QUESTION')
    .map(node => node.id);

  if (questionIds.length === 0) return 0;

  const answeringFindings = buildAnsweringFindingsByQuestion(edges);
  const citedSources = buildCitedSourcesByFinding(edges);
  let totalDepth = 0;
  let pathCount = 0;

  for (const questionId of questionIds) {
    for (const findingId of answeringFindings.get(questionId) ?? []) {
      totalDepth += (citedSources.get(findingId) ?? []).length > 0 ? 2 : 1;
      pathCount++;
    }
  }

  return pathCount > 0 ? totalDepth / pathCount : 0;
}

/**
 * Compute research convergence signals from raw node and edge data.
 *
 * @param ns - Namespace identifying the coverage graph.
 * @returns Research convergence signals with all five metrics.
 */
export function computeResearchSignals(ns: Namespace): ResearchConvergenceSignals {
  const nodes = getNodes(ns);
  const edges = getEdges(ns);

  const questionCoverage = computeResearchQuestionCoverageFromData(nodes, edges);
  const claimVerificationRate = computeResearchClaimVerificationRateFromData(nodes);
  const contradictionDensity = computeResearchContradictionDensityFromData(edges);
  const sourceDiversity = computeResearchSourceDiversityFromData(nodes, edges);
  const evidenceDepth = computeResearchEvidenceDepthFromData(nodes, edges);

  return {
    questionCoverage,
    claimVerificationRate,
    contradictionDensity,
    sourceDiversity,
    evidenceDepth,
  };
}

/**
 * Compute review convergence signals using SQL aggregation.
 *
 * @param ns - Namespace identifying the coverage graph.
 * @returns Review convergence signals with all five metrics.
 */
export function computeReviewSignals(ns: Namespace): ReviewConvergenceSignals {
  const d = getDb();
  const nodeNamespace = buildNamespacePredicate('', ns);
  const scopedNodeNamespace = buildNamespacePredicate('n', ns);
  const edgeNamespace = buildNamespacePredicate('e', ns);
  const bareEdgeNamespace = buildNamespacePredicate('', ns);

  const allDimensions = (d.prepare(
    `SELECT COUNT(*) as c FROM coverage_nodes WHERE ${nodeNamespace.clause} AND kind = 'DIMENSION'`,
  ).get(...nodeNamespace.params) as { c: number }).c;

  const coveredDimensions = (d.prepare(`
    SELECT COUNT(*) as c FROM coverage_nodes n
    WHERE ${scopedNodeNamespace.clause} AND n.kind = 'DIMENSION'
      AND EXISTS (
        SELECT 1 FROM coverage_edges e
        WHERE ${edgeNamespace.clause}
          AND e.source_id = n.id
          AND e.relation = 'COVERS'
      )
  `).get(...scopedNodeNamespace.params, ...edgeNamespace.params) as { c: number }).c;

  const dimensionCoverage = allDimensions > 0 ? coveredDimensions / allDimensions : 0;

  const allFindings = (d.prepare(
    `SELECT COUNT(*) as c FROM coverage_nodes WHERE ${nodeNamespace.clause} AND kind = 'FINDING'`,
  ).get(...nodeNamespace.params) as { c: number }).c;

  const stableFindings = (d.prepare(`
    SELECT COUNT(*) as c FROM coverage_nodes n
    WHERE ${scopedNodeNamespace.clause} AND n.kind = 'FINDING'
      AND NOT EXISTS (
        SELECT 1 FROM coverage_edges e
        WHERE ${edgeNamespace.clause}
          AND (e.source_id = n.id OR e.target_id = n.id)
          AND e.relation = 'CONTRADICTS'
      )
  `).get(...scopedNodeNamespace.params, ...edgeNamespace.params) as { c: number }).c;

  const findingStability = allFindings > 0 ? stableFindings / allFindings : 0;

  const allP0 = d.prepare(`
    SELECT id, metadata FROM coverage_nodes
    WHERE ${nodeNamespace.clause} AND kind = 'FINDING'
  `).all(...nodeNamespace.params) as Array<{ id: string; metadata: string | null }>;

  let p0Count = 0;
  let p0Resolved = 0;

  for (const finding of allP0) {
    if (finding.metadata) {
      try {
        const meta = JSON.parse(finding.metadata);
        if (meta.severity === 'P0') {
          p0Count++;
          const hasResolve = (d.prepare(
            `SELECT COUNT(*) as c FROM coverage_edges e WHERE ${edgeNamespace.clause} AND e.target_id = ? AND e.relation = 'RESOLVES'`,
          ).get(...edgeNamespace.params, finding.id) as { c: number }).c;
          if (hasResolve > 0) p0Resolved++;
        }
      } catch { }
    }
  }

  const p0ResolutionRate = p0Count > 0 ? p0Resolved / p0Count : 1.0;

  const totalEvidenceEdges = (d.prepare(
    `SELECT COUNT(*) as c FROM coverage_edges WHERE ${bareEdgeNamespace.clause} AND relation = 'EVIDENCE_FOR'`,
  ).get(...bareEdgeNamespace.params) as { c: number }).c;

  const evidenceDensity = allFindings > 0 ? totalEvidenceEdges / allFindings : 0;

  const hotspotSaturation = computeHotspotSaturation(d, ns);

  return {
    dimensionCoverage,
    findingStability,
    p0ResolutionRate,
    evidenceDensity,
    hotspotSaturation,
  };
}

// ───── CONTEXT SIGNALS ─────

// Findings below this relevance are noise and excluded from "kept" coverage, so
// small-model over-collection cannot masquerade as new context and block saturation.
const CONTEXT_RELEVANCE_GATE = 0.55;
// By-model fan-out: a finding independently confirmed by this many executors is high-confidence.
const CONTEXT_AGREEMENT_MIN = 2;

function contextMeta(node: CoverageNode): Record<string, unknown> {
  return node.metadata && typeof node.metadata === 'object' ? node.metadata : {};
}

function contextAgreement(node: CoverageNode, confirmCountById: Map<string, number>): number {
  const metaConfirmations = Number((contextMeta(node) as { confirmations?: unknown }).confirmations);
  const edgeConfirmations = confirmCountById.get(node.id) ?? 0;
  return Math.max(Number.isFinite(metaConfirmations) ? metaConfirmations : 0, edgeConfirmations);
}

function contextRelevance(node: CoverageNode): number {
  const relevance = Number((contextMeta(node) as { relevance?: unknown }).relevance);
  return Number.isFinite(relevance) ? relevance : 0;
}

/**
 * Compute context convergence signals from raw node and edge data.
 *
 * Pure (no DB) so both computeContextSignals and the convergence script share
 * one implementation. Agreement is read from a node's CONFIRMS in-edges OR its
 * metadata.confirmations (whichever is higher); relevance from metadata.relevance.
 * Each signal vacuous-passes (1.0) when its kind is absent so a feature with no
 * dependencies (etc.) is not penalized — matching the review p0ResolutionRate rule.
 *
 * @param nodes - Coverage nodes for the namespace.
 * @param edges - Coverage edges for the namespace.
 * @returns Context convergence signals with all five metrics.
 */
export function computeContextSignalsFromData(
  nodes: CoverageNode[],
  edges: CoverageEdge[],
): ContextConvergenceSignals {
  const sliceNodes = nodes.filter((node) => node.kind === 'SLICE');
  const reuseNodes = nodes.filter((node) => node.kind === 'REUSE_CANDIDATE');
  const dependencyNodes = nodes.filter((node) => node.kind === 'DEPENDENCY');
  const findingKinds = new Set(['REUSE_CANDIDATE', 'PATTERN', 'CONSTRAINT']);
  const findingNodes = nodes.filter((node) => findingKinds.has(node.kind));

  const coveredSliceIds = new Set(
    edges.filter((edge) => edge.relation === 'COVERED_BY').map((edge) => edge.sourceId),
  );
  const confirmCountById = new Map<string, number>();
  for (const edge of edges) {
    if (edge.relation === 'CONFIRMS') {
      confirmCountById.set(edge.targetId, (confirmCountById.get(edge.targetId) ?? 0) + 1);
    }
  }
  const resolvedDependencyIds = new Set(
    edges
      .filter((edge) => edge.relation === 'DEPENDS_ON' || edge.relation === 'IMPORTS')
      .map((edge) => edge.sourceId),
  );

  const sliceCoverage = sliceNodes.length > 0
    ? sliceNodes.filter((node) => coveredSliceIds.has(node.id)).length / sliceNodes.length
    : 1;
  const reuseCatalogCoverage = reuseNodes.length > 0
    ? reuseNodes.filter((node) => contextAgreement(node, confirmCountById) >= 1
        || (contextMeta(node) as { verified?: unknown }).verified === true).length / reuseNodes.length
    : 1;
  const agreementRate = findingNodes.length > 0
    ? findingNodes.filter((node) => contextAgreement(node, confirmCountById) >= CONTEXT_AGREEMENT_MIN).length / findingNodes.length
    : 1;
  const relevanceFloor = findingNodes.length > 0
    ? findingNodes.filter((node) => contextRelevance(node) >= CONTEXT_RELEVANCE_GATE).length / findingNodes.length
    : 1;
  const dependencyCompleteness = dependencyNodes.length > 0
    ? dependencyNodes.filter((node) => resolvedDependencyIds.has(node.id)).length / dependencyNodes.length
    : 1;

  return { sliceCoverage, reuseCatalogCoverage, agreementRate, relevanceFloor, dependencyCompleteness };
}

/**
 * Compute context convergence signals for a namespace.
 *
 * @param ns - Namespace identifying the coverage graph.
 * @returns Context convergence signals with all five metrics.
 */
export function computeContextSignals(ns: Namespace): ContextConvergenceSignals {
  return computeContextSignalsFromData(getNodes(ns), getEdges(ns));
}

// ───── EXPORTS ─────

/**
 * Compute all convergence signals for a namespace.
 *
 * Dispatches to research or review signal computation based on loop type.
 *
 * @param ns - Namespace identifying the coverage graph.
 * @returns Research or review convergence signals.
 */
export function computeSignals(ns: Namespace): ConvergenceSignals {
  if (ns.loopType === 'research') {
    return computeResearchSignals(ns);
  }
  if (ns.loopType === 'context') {
    return computeContextSignals(ns);
  }
  return computeReviewSignals(ns);
}

/**
 * Create a signal snapshot for a given iteration.
 *
 * Computes convergence signals and node-level signals, then persists
 * them via the coverage graph database.
 *
 * @param ns - Namespace identifying the coverage graph.
 * @param iteration - Current iteration number.
 * @returns Signal snapshot with signals, node signals, and counts.
 */
export function createSignalSnapshot(ns: Namespace, iteration: number): SignalSnapshot {
  const signals = computeSignals(ns);
  const nodeSignals = computeNodeSignals(ns);
  const stats = getStats(ns.specFolder, ns.loopType);

  const snapshot: SignalSnapshot = {
    iteration,
    signals,
    nodeSignals,
    nodeCount: stats.totalNodes,
    edgeCount: stats.totalEdges,
  };

  createSnapshot({
    specFolder: ns.specFolder,
    loopType: ns.loopType,
    sessionId: ns.sessionId ?? 'legacy',
    iteration,
    metrics: {
      ...signals,
      nodeCount: stats.totalNodes,
      edgeCount: stats.totalEdges,
    },
    nodeCount: stats.totalNodes,
    edgeCount: stats.totalEdges,
  });

  return snapshot;
}

/**
 * Compute momentum (change rate) between the latest and previous snapshots.
 *
 * @param specFolder - Spec folder for namespace scoping.
 * @param loopType - Loop type ('research' or 'review').
 * @param sessionId - Optional session ID for scoping.
 * @returns Map of metric names to deltas, or null if fewer than 2 snapshots.
 */
export function computeMomentum(
  specFolder: string,
  loopType: LoopType,
  sessionId?: string,
): Record<string, number> | null {
  const snapshots = getSnapshots(specFolder, loopType, sessionId);
  if (snapshots.length < 2) return null;

  const latest = snapshots[snapshots.length - 1]?.metrics ?? {};
  const previous = snapshots[snapshots.length - 2]?.metrics ?? {};

  const momentum: Record<string, number> = {};
  for (const key of Object.keys(latest)) {
    if (typeof latest[key] === 'number' && typeof previous[key] === 'number') {
      momentum[key] = latest[key] - previous[key];
    }
  }

  return momentum;
}
