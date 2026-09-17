// MODULE: Council Graph Query Helpers

import {
  getEdges,
  getEdgesFrom,
  getEdgesTo,
  getNode,
  getNodes,
  getNodesByKind,
  type CouncilEdge,
  type CouncilNamespace,
  type CouncilNode,
} from './council-graph-db.js';

// ───── TYPE DEFINITIONS ─────

export interface PromptSafeNode {
  id: string;
  kind: string;
  name: string;
  artifactPath?: string;
  contentHash?: string;
  roundId?: string;
  metadata?: Record<string, unknown>;
}

export interface PromptSafeEdge {
  id: string;
  sourceId: string;
  targetId: string;
  relation: string;
  weight: number;
  artifactPath?: string;
  metadata?: Record<string, unknown>;
}

export interface DecisionSupportSummary {
  node: PromptSafeNode;
  supportCount: number;
  evidenceCount: number;
  agreementCount: number;
  resolutionCount: number;
  incoming: PromptSafeEdge[];
  outgoing: PromptSafeEdge[];
}

export interface ConvergenceBlockers {
  unresolvedCriticalDisagreements: PromptSafeNode[];
  lowConfidenceDecisions: PromptSafeNode[];
  unsupportedDecisions: PromptSafeNode[];
}

export interface EvidenceChainStep {
  depth: number;
  node: PromptSafeNode;
  viaEdge?: PromptSafeEdge;
  direction?: 'incoming' | 'outgoing';
}

// ───── CONSTANTS ─────

const SAFE_METADATA_KEYS = new Set([
  'confidence',
  'confidenceScore',
  'planConfidence',
  'severity',
  'priority',
  'status',
]);
const MAX_METADATA_STRING_LENGTH = 80;

// ───── HELPERS ─────

/**
 * Return a prompt-safe node shape with allowlisted metadata only.
 *
 * @param node - Full council node row.
 * @returns Prompt-safe node projection.
 */
export function toPromptSafeNode(node: CouncilNode): PromptSafeNode {
  const metadata = sanitizeMetadata(node.metadata);
  return {
    id: node.id,
    kind: node.kind,
    name: node.name,
    ...(node.artifactPath ? { artifactPath: node.artifactPath } : {}),
    ...(node.contentHash ? { contentHash: node.contentHash } : {}),
    ...(node.roundId ? { roundId: node.roundId } : {}),
    ...(metadata ? { metadata } : {}),
  };
}

/**
 * Return a prompt-safe edge shape with allowlisted metadata only.
 *
 * @param edge - Full council edge row.
 * @returns Prompt-safe edge projection.
 */
export function toPromptSafeEdge(edge: CouncilEdge): PromptSafeEdge {
  const metadata = sanitizeMetadata(edge.metadata);
  return {
    id: edge.id,
    sourceId: edge.sourceId,
    targetId: edge.targetId,
    relation: edge.relation,
    weight: edge.weight,
    ...(edge.artifactPath ? { artifactPath: edge.artifactPath } : {}),
    ...(metadata ? { metadata } : {}),
  };
}

/**
 * Keep only scalar metadata that is safe to expose in prompts.
 *
 * @param metadata - Raw node or edge metadata.
 * @returns Sanitized metadata, or undefined if no safe keys remain.
 */
export function sanitizeMetadata(metadata: Record<string, unknown> | undefined): Record<string, unknown> | undefined {
  if (!metadata) return undefined;
  const safe: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(metadata)) {
    if (!SAFE_METADATA_KEYS.has(key)) continue;
    if (typeof value === 'number' && Number.isFinite(value)) {
      safe[key] = value;
    } else if (typeof value === 'boolean') {
      safe[key] = value;
    } else if (typeof value === 'string') {
      safe[key] = value.length > MAX_METADATA_STRING_LENGTH
        ? `${value.slice(0, MAX_METADATA_STRING_LENGTH)}...`
        : value;
    }
  }

  return Object.keys(safe).length > 0 ? safe : undefined;
}

// ───── CORE LOGIC ─────

/**
 * Find disagreement nodes that have not been resolved.
 *
 * @param ns - Namespace identifying the council graph.
 * @returns Prompt-safe disagreement nodes.
 */
export function findUnresolvedDisagreements(ns: CouncilNamespace): PromptSafeNode[] {
  return getNodesByKind(ns, 'DISAGREEMENT')
    .filter((node) => !getEdgesTo(ns, node.id).some((edge) => edge.relation === 'RESOLVES'))
    .map(toPromptSafeNode);
}

/**
 * Summarize support and resolution context for decisions and recommendations.
 *
 * @param ns - Namespace identifying the council graph.
 * @param nodeId - Optional decision/recommendation ID to inspect.
 * @returns Decision support summaries.
 */
export function findDecisionSupport(ns: CouncilNamespace, nodeId?: string): DecisionSupportSummary[] {
  const candidates = nodeId
    ? [getNode(ns, nodeId)].filter((node): node is CouncilNode => Boolean(node))
    : [...getNodesByKind(ns, 'DECISION'), ...getNodesByKind(ns, 'RECOMMENDATION')];

  return candidates.map((node) => {
    const incoming = getEdgesTo(ns, node.id).filter((edge) =>
      edge.relation === 'SUPPORTS' || edge.relation === 'EVIDENCE_FOR' || edge.relation === 'AGREES_WITH',
    );
    const outgoing = getEdgesFrom(ns, node.id).filter((edge) =>
      edge.relation === 'RESOLVES' || edge.relation === 'RECOMMENDS',
    );
    return {
      node: toPromptSafeNode(node),
      supportCount: incoming.filter((edge) => edge.relation === 'SUPPORTS').length,
      evidenceCount: incoming.filter((edge) => edge.relation === 'EVIDENCE_FOR').length,
      agreementCount: incoming.filter((edge) => edge.relation === 'AGREES_WITH').length,
      resolutionCount: outgoing.filter((edge) => edge.relation === 'RESOLVES').length,
      incoming: incoming.map(toPromptSafeEdge),
      outgoing: outgoing.map(toPromptSafeEdge),
    };
  });
}

/**
 * Follow evidence/support/derivation edges around a root node.
 *
 * @param ns - Namespace identifying the council graph.
 * @param nodeId - Root node ID.
 * @param maxDepth - Maximum traversal depth.
 * @returns Prompt-safe evidence chain steps in breadth-first order.
 */
export function findEvidenceChain(ns: CouncilNamespace, nodeId: string, maxDepth: number): EvidenceChainStep[] {
  const root = getNode(ns, nodeId);
  if (!root) return [];

  const allowedRelations = new Set(['EVIDENCE_FOR', 'SUPPORTS', 'DERIVES_FROM']);
  const visited = new Set<string>([root.id]);
  const queue: Array<{ node: CouncilNode; depth: number; viaEdge?: CouncilEdge; direction?: 'incoming' | 'outgoing' }> = [
    { node: root, depth: 0 },
  ];
  const result: EvidenceChainStep[] = [];

  while (queue.length > 0) {
    const current = queue.shift()!;
    result.push({
      depth: current.depth,
      node: toPromptSafeNode(current.node),
      ...(current.viaEdge ? { viaEdge: toPromptSafeEdge(current.viaEdge) } : {}),
      ...(current.direction ? { direction: current.direction } : {}),
    });

    if (current.depth >= maxDepth) continue;

    const neighbors = [
      ...getEdgesTo(ns, current.node.id).map((edge) => ({ edge, nextId: edge.sourceId, direction: 'incoming' as const })),
      ...getEdgesFrom(ns, current.node.id).map((edge) => ({ edge, nextId: edge.targetId, direction: 'outgoing' as const })),
    ].filter((entry) => allowedRelations.has(entry.edge.relation));

    for (const entry of neighbors) {
      if (visited.has(entry.nextId)) continue;
      const nextNode = getNode(ns, entry.nextId);
      if (!nextNode) continue;
      visited.add(entry.nextId);
      queue.push({ node: nextNode, depth: current.depth + 1, viaEdge: entry.edge, direction: entry.direction });
    }
  }

  return result;
}

/**
 * Find blockers that should influence council convergence decisions.
 *
 * @param ns - Namespace identifying the council graph.
 * @returns Critical disagreement, low-confidence, and unsupported decision groups.
 */
export function findConvergenceBlockers(ns: CouncilNamespace): ConvergenceBlockers {
  const unresolvedCriticalDisagreements = findUnresolvedDisagreements(ns).filter((node) => isCritical(node.metadata));
  const decisions = [...getNodesByKind(ns, 'DECISION'), ...getNodesByKind(ns, 'RECOMMENDATION')];
  const lowConfidenceDecisions = decisions
    .filter((node) => confidence(node.metadata) < 0.5)
    .map(toPromptSafeNode);
  const unsupportedDecisions = decisions
    .filter((node) => !getEdgesTo(ns, node.id).some((edge) => edge.relation === 'SUPPORTS' || edge.relation === 'EVIDENCE_FOR'))
    .map(toPromptSafeNode);

  return {
    unresolvedCriticalDisagreements,
    lowConfidenceDecisions,
    unsupportedDecisions,
  };
}

/**
 * Rank graph nodes by edge degree and total relation weight.
 *
 * @param ns - Namespace identifying the council graph.
 * @param limit - Maximum rows to return.
 * @returns Prompt-safe hot nodes.
 */
export function rankHotNodes(ns: CouncilNamespace, limit: number): Array<PromptSafeNode & { degree: number; weightedDegree: number }> {
  const nodes = getNodes(ns);
  const edges = getEdges(ns);
  const scores = new Map<string, { degree: number; weightedDegree: number }>();

  for (const node of nodes) {
    scores.set(node.id, { degree: 0, weightedDegree: 0 });
  }

  for (const edge of edges) {
    for (const id of [edge.sourceId, edge.targetId]) {
      const score = scores.get(id);
      if (!score) continue;
      score.degree += 1;
      score.weightedDegree += edge.weight;
    }
  }

  return nodes
    .map((node) => ({ ...toPromptSafeNode(node), ...(scores.get(node.id) ?? { degree: 0, weightedDegree: 0 }) }))
    .sort((a, b) => b.weightedDegree - a.weightedDegree || b.degree - a.degree || a.id.localeCompare(b.id))
    .slice(0, limit);
}

/**
 * Extract normalized confidence from council metadata.
 *
 * @param metadata - Node metadata.
 * @returns Confidence in [0, 1], or 0 when absent.
 */
export function confidence(metadata: Record<string, unknown> | undefined): number {
  const raw = metadata?.confidence ?? metadata?.confidenceScore ?? metadata?.planConfidence;
  if (typeof raw !== 'number' || !Number.isFinite(raw)) return 0;
  return raw > 1 ? Math.min(raw / 100, 1) : Math.max(raw, 0);
}

/**
 * Check whether metadata marks a disagreement as critical/high-priority.
 *
 * @param metadata - Node metadata.
 * @returns True for CRITICAL/HIGH/P0/P1 severity or priority.
 */
export function isCritical(metadata: Record<string, unknown> | undefined): boolean {
  const raw = String(metadata?.severity ?? metadata?.priority ?? '').toUpperCase();
  return raw === 'CRITICAL' || raw === 'HIGH' || raw === 'P0' || raw === 'P1';
}
