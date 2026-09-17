// ───────────────────────────────────────────────────────────────────
// MODULE: Coverage Graph Query Helpers
// ───────────────────────────────────────────────────────────────────

import {
  getDb,
  type Namespace,
  type CoverageNode,
  type CoverageEdge,
  type NodeKind,
} from './coverage-graph-db.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

export interface CoverageGap {
  nodeId: string;
  kind: string;
  name: string;
  reason: string;
}

export interface ContradictionPair {
  edgeId: string;
  sourceId: string;
  targetId: string;
  sourceName: string;
  targetName: string;
  weight: number;
  metadata?: Record<string, unknown>;
}

export interface ProvenanceStep {
  nodeId: string;
  kind: string;
  name: string;
  depth: number;
  edgeRelation: string;
  cumulativeWeight: number;
}

export interface HotNode {
  nodeId: string;
  kind: string;
  name: string;
  edgeCount: number;
  weightSum: number;
  score: number;
}

/** Query options for deterministic same-kind node similarity. */
export interface SimilarNodeQuery {
  kind: NodeKind;
  name: string;
  threshold?: number;
}

/** Similar node result with a normalized score in the range [0, 1]. */
export interface SimilarNode {
  nodeId: string;
  kind: NodeKind;
  name: string;
  score: number;
}

/** Same-kind node group that callers may choose to consolidate. */
export interface ConsolidationCluster {
  kind: NodeKind;
  canonical: SimilarNode;
  nodes: SimilarNode[];
}

/** Options for namespace-wide consolidation candidate discovery. */
export interface ConsolidationCandidatesOptions {
  threshold?: number;
}

/** Consolidation discovery result split into clusters and singleton leftovers. */
export interface ConsolidationCandidates {
  clusters: ConsolidationCluster[];
  leftovers: SimilarNode[];
}

interface SqlFragment {
  clause: string;
  params: unknown[];
}

interface CandidateNode {
  id: string;
  kind: NodeKind;
  name: string;
}

interface MutableConsolidationCluster {
  kind: NodeKind;
  canonical: SimilarNode;
  nodes: SimilarNode[];
}

type CoverageDirection = 'incoming' | 'outgoing';

interface CoverageGapRequirement {
  kind: NodeKind;
  relations: Array<CoverageEdge['relation']>;
  direction: CoverageDirection;
}

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const DEFAULT_SIMILARITY_THRESHOLD = 0.85;
const SUBSTRING_SIMILARITY_SCORE = 0.85;
const EXACT_WORD_OVERLAP_THRESHOLD = 0.7;
const WORD_SIMILARITY_THRESHOLD = 0.8;
const MIN_FUZZY_WORD_LENGTH = 3;
const MAX_ALIAS_MEMO_ENTRIES = 2_000;
const MAX_METADATA_STRING_LENGTH = 80;
const REDACTED_METADATA_VALUE = '[REDACTED]';

const SAFE_METADATA_KEYS = new Set([
  'confidence',
  'confidenceScore',
  'planConfidence',
  'severity',
  'priority',
  'status',
  'verification_status',
  'quality_class',
  'hotspot_score',
  'relevance',
  'confirmations',
  'verified',
]);

const SECRET_METADATA_VALUE_PATTERNS = [
  /\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9_]{20,}\b/,
  /\bgithub_pat_[A-Za-z0-9_]{20,}\b/,
  /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/,
  /\b(?:sk|rk|pk)_[A-Za-z0-9_-]{20,}\b/,
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
];

const namespaceAliasMemo = new Map<string, number>();

// ───────────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────────

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

function getNodeById(id: string, ns: Namespace): { kind: string; name: string } | null {
  const d = getDb();
  const nodeNamespace = buildNamespacePredicate('', ns);
  const row = d.prepare(`
    SELECT kind, name
    FROM coverage_nodes
    WHERE id = ?
      AND ${nodeNamespace.clause}
  `).get(id, ...nodeNamespace.params) as { kind: string; name: string } | undefined;
  return row ?? null;
}

function getEdgesFromNode(sourceId: string, ns: Namespace): CoverageEdge[] {
  const d = getDb();
  const edgeNamespace = buildNamespacePredicate('', ns);
  const rows = d.prepare(`
    SELECT *
    FROM coverage_edges
    WHERE source_id = ?
      AND ${edgeNamespace.clause}
  `).all(sourceId, ...edgeNamespace.params) as Record<string, unknown>[];

  return rows.map(row => ({
    id: row.id as string,
    specFolder: row.spec_folder as string,
    loopType: row.loop_type as Namespace['loopType'],
    sessionId: row.session_id as string,
    sourceId: row.source_id as string,
    targetId: row.target_id as string,
    relation: row.relation as CoverageEdge['relation'],
    weight: row.weight as number,
    metadata: row.metadata ? JSON.parse(row.metadata as string) : undefined,
    createdAt: row.created_at as string | undefined,
  }));
}

function parseMetadata(metadata: unknown): Record<string, unknown> | undefined {
  if (!metadata) return undefined;
  if (typeof metadata === 'string') {
    try {
      const parsed = JSON.parse(metadata) as unknown;
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
        ? parsed as Record<string, unknown>
        : undefined;
    } catch {
      return undefined;
    }
  }
  return typeof metadata === 'object' && !Array.isArray(metadata)
    ? metadata as Record<string, unknown>
    : undefined;
}

function isSecretLikeString(value: string): boolean {
  return SECRET_METADATA_VALUE_PATTERNS.some(pattern => pattern.test(value));
}

function sanitizeMetadataValue(value: unknown): string | number | boolean | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'boolean') return value;
  if (typeof value !== 'string') return undefined;
  if (isSecretLikeString(value)) return REDACTED_METADATA_VALUE;
  return value.length > MAX_METADATA_STRING_LENGTH
    ? `${value.slice(0, MAX_METADATA_STRING_LENGTH)}...`
    : value;
}

function sanitizeMetadata(metadata: Record<string, unknown> | undefined): Record<string, unknown> | undefined {
  if (!metadata) return undefined;
  const safe: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(metadata)) {
    if (!SAFE_METADATA_KEYS.has(key)) continue;
    const sanitizedValue = sanitizeMetadataValue(value);
    if (sanitizedValue !== undefined) {
      safe[key] = sanitizedValue;
    }
  }

  return Object.keys(safe).length > 0 ? safe : undefined;
}

function rowToCoverageNode(row: Record<string, unknown>): CoverageNode {
  return {
    id: row.id as string,
    specFolder: row.spec_folder as string,
    loopType: row.loop_type as Namespace['loopType'],
    sessionId: row.session_id as string,
    kind: row.kind as NodeKind,
    name: row.name as string,
    contentHash: row.content_hash as string | undefined,
    iteration: row.iteration as number | undefined,
    metadata: sanitizeMetadata(parseMetadata(row.metadata)),
    createdAt: row.created_at as string | undefined,
    updatedAt: row.updated_at as string | undefined,
  };
}

function getCoverageGapRequirements(loopType: Namespace['loopType']): CoverageGapRequirement[] {
  if (loopType === 'research') {
    return [{ kind: 'QUESTION', relations: ['ANSWERS', 'COVERS'], direction: 'incoming' }];
  }
  if (loopType === 'context') {
    return [{ kind: 'SLICE', relations: ['COVERED_BY'], direction: 'outgoing' }];
  }
  return [
    { kind: 'DIMENSION', relations: ['COVERS', 'EVIDENCE_FOR'], direction: 'outgoing' },
    { kind: 'FILE', relations: ['COVERS'], direction: 'incoming' },
  ];
}

function isResearchClaimVerified(metadata: Record<string, unknown> | undefined): boolean {
  const status = metadata?.verification_status;
  return typeof status === 'string' && status.length > 0 && status !== 'unresolved';
}

function normalizeThreshold(threshold: number | undefined): number {
  if (threshold === undefined) return DEFAULT_SIMILARITY_THRESHOLD;
  if (!Number.isFinite(threshold)) return DEFAULT_SIMILARITY_THRESHOLD;
  return Math.max(0, Math.min(1, threshold));
}

function normalizeNodeName(name: string): string {
  return name.toLowerCase().trim().replace(/\s+/g, ' ');
}

function tokenizeName(name: string, minLength: number = 0): string[] {
  return normalizeNodeName(name)
    .split(/\s+/)
    .filter(word => word.length >= minLength);
}

function buildNamespaceMemoKey(ns: Namespace): string {
  return `${ns.specFolder}\u0000${ns.loopType}\u0000${ns.sessionId ?? '*'}`;
}

function buildAliasMemoKey(ns: Namespace, kind: NodeKind, firstName: string, secondName: string): string {
  const normalized = [normalizeNodeName(firstName), normalizeNodeName(secondName)].sort();
  return `${buildNamespaceMemoKey(ns)}\u0000${kind}\u0000${normalized[0]}\u0000${normalized[1]}`;
}

function rememberAliasScore(key: string, score: number): number {
  if (namespaceAliasMemo.has(key)) {
    namespaceAliasMemo.delete(key);
  } else if (namespaceAliasMemo.size >= MAX_ALIAS_MEMO_ENTRIES) {
    const oldestKey = namespaceAliasMemo.keys().next().value as string | undefined;
    if (oldestKey) namespaceAliasMemo.delete(oldestKey);
  }

  namespaceAliasMemo.set(key, score);
  return score;
}

function levenshteinWordSimilarity(first: string, second: string): number {
  const maxLength = Math.max(first.length, second.length);
  if (maxLength === 0) return 1;

  const distances = new Array<number>(second.length + 1);
  for (let index = 0; index <= second.length; index += 1) {
    distances[index] = index;
  }

  for (let firstIndex = 1; firstIndex <= first.length; firstIndex += 1) {
    let previousDistance = distances[0];
    distances[0] = firstIndex;

    for (let secondIndex = 1; secondIndex <= second.length; secondIndex += 1) {
      const currentDistance = distances[secondIndex];
      distances[secondIndex] = first[firstIndex - 1] === second[secondIndex - 1]
        ? previousDistance
        : 1 + Math.min(distances[secondIndex], distances[secondIndex - 1], previousDistance);
      previousDistance = currentDistance;
    }
  }

  return 1 - distances[second.length] / maxLength;
}

function calculateNameSimilarity(firstName: string, secondName: string): number {
  const first = normalizeNodeName(firstName);
  const second = normalizeNodeName(secondName);
  if (first === second) return 1;
  if (!first || !second) return 0;
  if (first.includes(second) || second.includes(first)) return SUBSTRING_SIMILARITY_SCORE;

  const firstWords = tokenizeName(firstName);
  const secondWords = tokenizeName(secondName);
  const firstWordSet = new Set(firstWords);
  const secondWordSet = new Set(secondWords);
  const sharedWordCount = [...firstWordSet].filter(word => secondWordSet.has(word)).length;
  const wordUnionSize = firstWordSet.size + secondWordSet.size - sharedWordCount;
  const exactOverlapScore = wordUnionSize > 0 ? sharedWordCount / wordUnionSize : 0;
  if (exactOverlapScore >= EXACT_WORD_OVERLAP_THRESHOLD) return exactOverlapScore;

  const firstFuzzyWords = tokenizeName(firstName, MIN_FUZZY_WORD_LENGTH);
  const secondFuzzyWords = tokenizeName(secondName, MIN_FUZZY_WORD_LENGTH);
  if (firstFuzzyWords.length === 0 || secondFuzzyWords.length === 0) return 0;

  const firstFuzzySet = new Set(firstFuzzyWords);
  const secondFuzzySet = new Set(secondFuzzyWords);
  const unmatchedSecondWords = [...secondFuzzySet].filter(word => !firstFuzzySet.has(word));
  let exactFuzzyOverlap = 0;
  let fuzzyOverlap = 0;

  for (const firstWord of firstFuzzySet) {
    if (secondFuzzySet.has(firstWord)) {
      exactFuzzyOverlap += 1;
      continue;
    }

    for (let index = 0; index < unmatchedSecondWords.length; index += 1) {
      const secondWord = unmatchedSecondWords[index];
      if (
        secondWord
        && levenshteinWordSimilarity(firstWord, secondWord) >= WORD_SIMILARITY_THRESHOLD
      ) {
        fuzzyOverlap += 1;
        unmatchedSecondWords[index] = '';
        break;
      }
    }
  }

  const totalOverlap = exactFuzzyOverlap + fuzzyOverlap;
  const fuzzyUnionSize = firstFuzzySet.size + secondFuzzySet.size - exactFuzzyOverlap;
  return fuzzyUnionSize > 0 ? totalOverlap / fuzzyUnionSize : 0;
}

function getMemoizedSimilarity(ns: Namespace, kind: NodeKind, firstName: string, secondName: string): number {
  const memoKey = buildAliasMemoKey(ns, kind, firstName, secondName);
  const cachedScore = namespaceAliasMemo.get(memoKey);
  if (cachedScore !== undefined) return cachedScore;
  return rememberAliasScore(memoKey, calculateNameSimilarity(firstName, secondName));
}

function getCandidateNodes(ns: Namespace, kind?: NodeKind): CandidateNode[] {
  const d = getDb();
  const nodeNamespace = buildNamespacePredicate('', ns);
  const rows = d.prepare(`
    SELECT id, kind, name
    FROM coverage_nodes
    WHERE ${nodeNamespace.clause}
      ${kind ? 'AND kind = ?' : ''}
    ORDER BY kind ASC, name ASC, id ASC
  `).all(
    ...nodeNamespace.params,
    ...(kind ? [kind] : []),
  ) as Array<{ id: string; kind: string; name: string }>;

  return rows.map(row => ({
    id: row.id,
    kind: row.kind as NodeKind,
    name: row.name,
  }));
}

function toSimilarNode(node: CandidateNode, score: number): SimilarNode {
  return {
    nodeId: node.id,
    kind: node.kind,
    name: node.name,
    score,
  };
}

function compareSimilarNodes(first: SimilarNode, second: SimilarNode): number {
  return second.score - first.score
    || first.kind.localeCompare(second.kind)
    || first.name.localeCompare(second.name)
    || first.nodeId.localeCompare(second.nodeId);
}

function compareClusters(first: ConsolidationCluster, second: ConsolidationCluster): number {
  return first.kind.localeCompare(second.kind)
    || first.canonical.name.localeCompare(second.canonical.name)
    || first.canonical.nodeId.localeCompare(second.canonical.nodeId);
}

// ───────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ───────────────────────────────────────────────────────────────────

/**
 * Find same-kind nodes whose names are deterministically similar to a query name.
 *
 * The node kind is treated as the category boundary, so rows from another kind
 * are filtered before any name scoring happens.
 *
 * @param ns - Namespace identifying the coverage graph.
 * @param query - Similarity query with node kind, name, and optional threshold.
 * @returns Same-kind nodes ordered by descending similarity.
 */
export function findSimilarNodes(ns: Namespace, query: SimilarNodeQuery): SimilarNode[] {
  const threshold = normalizeThreshold(query.threshold);
  const nodes = getCandidateNodes(ns, query.kind);
  const matches: SimilarNode[] = [];

  for (const node of nodes) {
    if (node.kind !== query.kind) continue;
    const score = getMemoizedSimilarity(ns, query.kind, query.name, node.name);
    if (score >= threshold) {
      matches.push(toSimilarNode(node, score));
    }
  }

  return matches.sort(compareSimilarNodes);
}

/**
 * Discover same-kind consolidation clusters without mutating graph rows.
 *
 * Nodes are read once, assigned deterministically to the strongest matching
 * same-kind cluster, and returned as clusters plus singleton leftovers.
 *
 * @param ns - Namespace identifying the coverage graph.
 * @param options - Optional similarity threshold.
 * @returns Consolidation clusters and nodes that did not match any cluster.
 */
export function findConsolidationCandidates(
  ns: Namespace,
  options: ConsolidationCandidatesOptions = {},
): ConsolidationCandidates {
  const threshold = normalizeThreshold(options.threshold);
  const candidateNodes = getCandidateNodes(ns);
  const workingClusters: MutableConsolidationCluster[] = [];

  for (const candidate of candidateNodes) {
    let bestCluster: MutableConsolidationCluster | null = null;
    let bestScore = 0;

    for (const cluster of workingClusters) {
      if (cluster.kind !== candidate.kind) continue;

      for (const clusterNode of cluster.nodes) {
        if (clusterNode.kind !== candidate.kind) continue;
        const score = getMemoizedSimilarity(ns, candidate.kind, candidate.name, clusterNode.name);
        if (score >= threshold && score > bestScore) {
          bestCluster = cluster;
          bestScore = score;
        }
      }
    }

    if (bestCluster) {
      bestCluster.nodes.push(toSimilarNode(candidate, bestScore));
      bestCluster.nodes.sort(compareSimilarNodes);
    } else {
      const canonical = toSimilarNode(candidate, 1);
      workingClusters.push({
        kind: candidate.kind,
        canonical,
        nodes: [canonical],
      });
    }
  }

  const clusters: ConsolidationCluster[] = [];
  const leftovers: SimilarNode[] = [];

  for (const cluster of workingClusters) {
    if (cluster.nodes.length > 1) {
      clusters.push({
        kind: cluster.kind,
        canonical: cluster.canonical,
        nodes: cluster.nodes,
      });
    } else {
      leftovers.push(cluster.nodes[0]);
    }
  }

  return {
    clusters: clusters.sort(compareClusters),
    leftovers: leftovers.sort(compareSimilarNodes),
  };
}

/**
 * Find nodes with coverage gaps.
 *
 * For research: questions that have no incoming ANSWERS or COVERS edges.
 * For review: dimensions use outgoing coverage, while files use incoming COVERS edges.
 *
 * @param ns - Namespace identifying the coverage graph.
 * @returns Array of coverage gap objects.
 */
export function findCoverageGaps(ns: Namespace): CoverageGap[] {
  const d = getDb();
  const gaps: CoverageGap[] = [];
  const requirements = getCoverageGapRequirements(ns.loopType);

  for (const requirement of requirements) {
    const nodeNamespace = buildNamespacePredicate('n', ns);
    const edgeNamespace = buildNamespacePredicate('e', ns);
    const edgeNodeColumn = requirement.direction === 'incoming' ? 'target_id' : 'source_id';
    const nodeRows = d.prepare(`
      SELECT n.id, n.kind, n.name
      FROM coverage_nodes n
      WHERE ${nodeNamespace.clause}
        AND n.kind = ?
        AND NOT EXISTS (
          SELECT 1 FROM coverage_edges e
          WHERE ${edgeNamespace.clause}
            AND e.${edgeNodeColumn} = n.id
            AND e.relation IN (${requirement.relations.map(() => '?').join(',')})
        )
    `).all(
      ...nodeNamespace.params,
      requirement.kind,
      ...edgeNamespace.params,
      ...requirement.relations,
    ) as Array<{ id: string; kind: string; name: string }>;

    for (const row of nodeRows) {
      gaps.push({
        nodeId: row.id,
        kind: row.kind,
        name: row.name,
        reason: `No ${requirement.direction} ${requirement.relations.join(' or ')} edges`,
      });
    }
  }

  return gaps;
}

/**
 * Find all CONTRADICTS edge pairs in a namespace.
 *
 * @param ns - Namespace identifying the coverage graph.
 * @returns Array of contradiction pair objects with source and target node names.
 */
export function findContradictions(ns: Namespace): ContradictionPair[] {
  const d = getDb();
  const edgeNamespace = buildNamespacePredicate('e', ns);

  const rows = d.prepare(`
    SELECT e.id, e.source_id, e.target_id, e.weight, e.metadata,
           s.name AS source_name, t.name AS target_name
    FROM coverage_edges e
    JOIN coverage_nodes s ON ${buildCompositeNodeJoin('s', 'e', 'source_id')}
    JOIN coverage_nodes t ON ${buildCompositeNodeJoin('t', 'e', 'target_id')}
    WHERE ${edgeNamespace.clause}
      AND e.relation = 'CONTRADICTS'
  `).all(...edgeNamespace.params) as Array<{
    id: string;
    source_id: string;
    target_id: string;
    weight: number;
    metadata: string | null;
    source_name: string;
    target_name: string;
  }>;

  return rows.map(row => ({
    edgeId: row.id,
    sourceId: row.source_id,
    targetId: row.target_id,
    sourceName: row.source_name,
    targetName: row.target_name,
    weight: row.weight,
    metadata: sanitizeMetadata(parseMetadata(row.metadata)),
  }));
}

/**
 * BFS from a node following CITES/EVIDENCE_FOR/DERIVED_FROM/SUPPORTS edges.
 *
 * Detects cycles and returns cumulative path strength. Fully namespace-scoped
 * to prevent cross-packet provenance reads.
 *
 * @param ns - Namespace identifying the coverage graph.
 * @param nodeId - Starting node ID.
 * @param maxDepth - Maximum traversal depth (default: 10).
 * @returns Array of provenance steps in BFS order.
 */
export function findProvenanceChain(ns: Namespace, nodeId: string, maxDepth: number = 10): ProvenanceStep[] {
  const provenanceRelations = ns.loopType === 'research'
    ? ['CITES', 'DERIVED_FROM', 'SUPPORTS']
    : ['EVIDENCE_FOR', 'CONFIRMS'];

  const visited = new Set<string>();
  const results: ProvenanceStep[] = [];
  let frontier: Array<{ id: string; depth: number; cumulativeWeight: number }> = [
    { id: nodeId, depth: 0, cumulativeWeight: 1.0 },
  ];

  while (frontier.length > 0) {
    const next: typeof frontier = [];

    for (const item of frontier) {
      if (visited.has(item.id) || item.depth >= maxDepth) continue;
      visited.add(item.id);

      const edges = getEdgesFromNode(item.id, ns);
      for (const edge of edges) {
        if (!provenanceRelations.includes(edge.relation)) continue;
        if (visited.has(edge.targetId)) continue;

        const targetNode = getNodeById(edge.targetId, ns);
        if (!targetNode) continue;

        const cumWeight = item.cumulativeWeight * edge.weight;
        results.push({
          nodeId: edge.targetId,
          kind: targetNode.kind,
          name: targetNode.name,
          depth: item.depth + 1,
          edgeRelation: edge.relation,
          cumulativeWeight: cumWeight,
        });

        next.push({ id: edge.targetId, depth: item.depth + 1, cumulativeWeight: cumWeight });
      }
    }

    frontier = next;
  }

  return results;
}

/**
 * Find claim nodes that have not reached the research verification threshold.
 *
 * For research: CLAIM nodes whose verification status is absent or unresolved.
 * For review: FINDING nodes with no RESOLVES edges.
 *
 * @param ns - Namespace identifying the coverage graph.
 * @returns Array of unverified coverage nodes.
 */
export function findUnverifiedClaims(ns: Namespace): CoverageNode[] {
  const d = getDb();
  const { loopType } = ns;

  if (loopType === 'research') {
    const nodeNamespace = buildNamespacePredicate('', ns);
    const rows = d.prepare(`
      SELECT * FROM coverage_nodes
      WHERE ${nodeNamespace.clause}
        AND kind = 'CLAIM'
    `).all(...nodeNamespace.params) as Record<string, unknown>[];

    return rows
      .filter(row => !isResearchClaimVerified(parseMetadata(row.metadata)))
      .map(rowToCoverageNode);
  }

  const reviewNodeNamespace = buildNamespacePredicate('n', ns);
  const reviewEdgeNamespace = buildNamespacePredicate('e', ns);
  const rows = d.prepare(`
    SELECT n.* FROM coverage_nodes n
    WHERE ${reviewNodeNamespace.clause}
      AND n.kind = 'FINDING'
      AND NOT EXISTS (
        SELECT 1 FROM coverage_edges e
        WHERE ${reviewEdgeNamespace.clause}
          AND e.target_id = n.id
          AND e.relation = 'RESOLVES'
      )
  `).all(
    ...reviewNodeNamespace.params,
    ...reviewEdgeNamespace.params,
  ) as Record<string, unknown>[];

  return rows.map(rowToCoverageNode) as CoverageNode[];
}

/**
 * Rank nodes by edge count + weight sum.
 *
 * Hot nodes are those with the most connections and highest total edge weight.
 *
 * @param ns - Namespace identifying the coverage graph.
 * @param limit - Maximum number of hot nodes to return (default: 10).
 * @returns Array of hot nodes ordered by score descending.
 */
export function rankHotNodes(ns: Namespace, limit: number = 10): HotNode[] {
  const d = getDb();
  const edgeNamespace = buildNamespacePredicate('e', ns);
  const nodeNamespace = buildNamespacePredicate('n', ns);

  const rows = d.prepare(`
    WITH node_edges AS (
      SELECT n.id, n.kind, n.name,
        (
          SELECT COUNT(*) FROM coverage_edges e
          WHERE (e.source_id = n.id OR e.target_id = n.id)
            AND ${edgeNamespace.clause}
        ) AS edge_count,
        (
          SELECT COALESCE(SUM(e.weight), 0) FROM coverage_edges e
          WHERE (e.source_id = n.id OR e.target_id = n.id)
            AND ${edgeNamespace.clause}
        ) AS weight_sum
      FROM coverage_nodes n
      WHERE ${nodeNamespace.clause}
    )
    SELECT id, kind, name, edge_count, weight_sum,
      (edge_count * 1.0 + weight_sum * 0.5) AS score
    FROM node_edges
    WHERE edge_count > 0
    ORDER BY score DESC
    LIMIT ?
  `).all(
    ...edgeNamespace.params,
    ...edgeNamespace.params,
    ...nodeNamespace.params,
    limit,
  ) as Array<{
    id: string;
    kind: string;
    name: string;
    edge_count: number;
    weight_sum: number;
    score: number;
  }>;

  return rows.map(row => ({
    nodeId: row.id,
    kind: row.kind,
    name: row.name,
    edgeCount: row.edge_count,
    weightSum: row.weight_sum,
    score: row.score,
  }));
}
