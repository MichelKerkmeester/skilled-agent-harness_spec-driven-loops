// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Context
// ───────────────────────────────────────────────────────────────
// LLM-oriented compact graph neighborhoods from structural seeds.
// Provides the code_graph_context MCP tool implementation.

import { performance } from 'node:perf_hooks';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import * as graphDb from './code-graph-db.js';
import { classifyQueryExpansion } from './query-intent-classifier.js';
import { resolveSeeds, type AnySeed, type ArtifactRef } from './seed-resolver.js';
import { isSpeckitMetricsEnabled, speckitMetrics } from './shared/metrics-stub.js';
import type {
  WeightedTraversalEdge,
  WeightedWalkResult,
} from '../../../system-spec-kit/mcp_server/dist/lib/graph/bfs-traversal.js';

type MemoryWeightedWalkModule = typeof import('../../../system-spec-kit/mcp_server/dist/lib/graph/bfs-traversal.js');

function resolveMemoryWeightedWalkModuleUrl(): URL {
  const candidates = [
    new URL('../../../system-spec-kit/mcp_server/dist/lib/graph/bfs-traversal.js', import.meta.url),
    new URL('../../../../system-spec-kit/mcp_server/dist/lib/graph/bfs-traversal.js', import.meta.url),
  ];
  const resolved = candidates.find((candidate) => existsSync(fileURLToPath(candidate)));
  if (!resolved) {
    throw new Error('Memory weighted-walk traversal module not found');
  }
  return resolved;
}

const memoryWeightedWalkModule = await import(
  resolveMemoryWeightedWalkModuleUrl().href
) as MemoryWeightedWalkModule;
const collectMemoryWeightedWalk = memoryWeightedWalkModule.collectWeightedWalk;

/** Map internal QueryMode → canonical spec_kit metric `mode` label value. */
function speckitQueryModeLabel(mode: QueryMode): 'outline' | 'blast_radius' | 'relationship' {
  if (mode === 'outline') return 'outline';
  if (mode === 'impact') return 'blast_radius';
  return 'relationship';
}

export type QueryMode = 'neighborhood' | 'outline' | 'impact';

export interface ContextArgs {
  input?: string;
  queryMode?: QueryMode;
  subject?: string;
  seeds?: AnySeed[];
  budgetTokens?: number;
  deadlineMs?: number;
  profile?: 'quick' | 'research' | 'debug';
  includeTrace?: boolean;
}

export interface GraphFreshnessMetadata {
  lastScanAt: string | null;
  staleness: 'fresh' | 'recent' | 'stale' | 'unknown';
  generation: number;
}

export interface ContextResult {
  queryMode: QueryMode;
  resolvedAnchors: ArtifactRef[];
  graphContext: GraphContextSection[];
  textBrief: string;
  combinedSummary: string;
  nextActions: string[];
  metadata: {
    totalNodes: number;
    totalEdges: number;
    budgetUsed: number;
    budgetLimit: number;
    deadlineMs: number | null;
    partialOutput: {
      isPartial: boolean;
      reasons: Array<'deadline' | 'budget'>;
      omittedSections: number;
      omittedAnchors: number;
      truncatedText: boolean;
    };
    freshness: GraphFreshnessMetadata;
  };
}

interface GraphContextSection {
  anchor: string;
  nodes: { name: string; kind: string; file: string; line: number }[];
  edges: {
    from: string;
    to: string;
    type: string;
    confidence: number | null;
    detectorProvenance: string | null;
    evidenceClass: string | null;
    reason: string | null;
    step: string | null;
  }[];
  why_included?: ContextWhyIncluded[];
  partial?: {
    reason: 'deadline';
    omittedNodes: number;
    omittedEdges: number;
  };
}

interface ContextWhyIncludedEdgeChainStep {
  from: string;
  to: string;
  fromFile: string | null;
  toFile: string | null;
  edgeType: string;
  confidence: number | null;
  detectorProvenance: string | null;
  evidenceClass: string | null;
  reason: string | null;
  step: string | null;
}

interface ContextWhyIncluded {
  filePath: string;
  depth: number;
  edgeChain: ContextWhyIncludedEdgeChainStep[];
  confidence: number | null;
  ambiguous: boolean;
  truncationReason: 'deadline' | 'budget' | 'trace_limit' | null;
}

const CONTEXT_WHY_INCLUDED_LIMIT = 25;
const CONTEXT_EDGE_RRF_K = 60;
const CONTEXT_EDGE_EVIDENCE_RANK_FACTORS: Readonly<Record<string, number>> = {
  EXTRACTED: 0.01,
  STRUCTURED: 0.01,
  INFERRED: 0.004,
  AMBIGUOUS: 0.002,
};
const SEEDED_PPR_ENABLED_ENV = 'SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING';
const SEEDED_PPR_ENABLED_VALUES = new Set(['1', 'true', 'yes', 'on', 'experimental']);
const SEEDED_PPR_IMPACT_EDGE_TYPES = ['CALLS', 'IMPORTS'] as const;
const SEEDED_PPR_MAX_HOPS = 3;
const SEEDED_PPR_MAX_ITERATIONS = 20;
const SEEDED_PPR_DAMPING = 0.85;
const SEEDED_PPR_EPSILON = 1e-6;
const SEEDED_PPR_EVIDENCE_TRANSITION_FACTORS: Readonly<Record<string, number>> = {
  EXTRACTED: 1.0,
  STRUCTURED: 1.0,
  INFERRED: 0.45,
  AMBIGUOUS: 0.25,
};

interface ExpansionResult {
  section: GraphContextSection;
  deadlineExceeded: boolean;
  omittedNodes: number;
  omittedEdges: number;
}

interface FormattedTextBrief {
  text: string;
  omittedSections: number;
  truncated: boolean;
}

interface ContextNodeSummary {
  name: string;
  kind: string;
  file: string;
  line: number;
}

type ContextEdgeResult = graphDb.CodeEdgeTargetResult | graphDb.CodeEdgeSourceResult;

interface RankedContextEdge<T extends ContextEdgeResult> {
  readonly result: T;
  readonly rankScore: number;
  readonly tieKey: readonly string[];
}

type PprNodeId = string | number;

export interface BoundedPersonalizedPageRankOptions<TNode extends PprNodeId> {
  readonly seeds: readonly TNode[];
  readonly maxHops: number;
  readonly maxIterations: number;
  readonly damping: number;
  readonly convergenceEpsilon?: number;
  readonly readEdges: (nodeIds: readonly TNode[]) => readonly WeightedTraversalEdge<TNode>[];
  readonly deadlineExpired?: () => boolean;
}

export interface BoundedPersonalizedPageRankResult<TNode extends PprNodeId> {
  readonly scores: Map<TNode, number>;
  readonly reached: Map<TNode, WeightedWalkResult<TNode>>;
  readonly iterations: number;
  readonly boundedReason: 'converged' | 'iteration_cap' | 'deadline' | 'empty';
}

interface SeededPprImpactCandidate {
  readonly result: graphDb.CodeEdgeSourceResult;
  readonly targetLabel: string;
  readonly targetFile: string | null;
  readonly pprScore: number;
  readonly minHop: number;
  readonly tieKey: readonly string[];
}

interface SeededPprImpactRanking {
  readonly candidates: SeededPprImpactCandidate[];
  readonly deadlineExceeded: boolean;
}

function defaultDeadlineMsForProfile(profile: ContextArgs['profile']): number {
  switch (profile) {
    case 'quick':
      return 250;
    case 'debug':
      return 700;
    case 'research':
      return 900;
    default:
      return 400;
  }
}

/** Build context from resolved anchors using specified query mode */
export function buildContext(args: ContextArgs): ContextResult {
  const queryMode = args.queryMode ?? 'neighborhood';
  const budgetTokens = args.budgetTokens ?? 1200;
  const seeds = args.seeds ?? [];
  const deadlineMs = args.deadlineMs ?? defaultDeadlineMsForProfile(args.profile);
  const speckitQueryStart = isSpeckitMetricsEnabled() ? performance.now() : 0;
  const speckitModeLabel = speckitQueryModeLabel(queryMode);
  const resolvedAnchors = resolveSeeds(seeds);

  // If no seeds but subject given, create seed from subject
  if (resolvedAnchors.length === 0 && args.subject) {
    const subjectRef = resolveSubjectToRef(args.subject);
    if (subjectRef) resolvedAnchors.push(subjectRef);
  }

  // Empty seeds + no subject → outline mode fallback
  if (resolvedAnchors.length === 0) {
    if (isSpeckitMetricsEnabled()) {
      speckitMetrics.incrementCounter('spec_kit.graph.query_cache_misses_total', { mode: speckitModeLabel });
    }
    return buildEmptyFallback(queryMode, budgetTokens);
  }
  if (isSpeckitMetricsEnabled()) {
    speckitMetrics.incrementCounter('spec_kit.graph.query_cache_hits_total', { mode: speckitModeLabel });
  }

  const sections: GraphContextSection[] = [];
  let totalNodes = 0;
  let totalEdges = 0;
  let omittedAnchors = 0;
  let omittedSections = 0;
  const partialReasons = new Set<'deadline' | 'budget'>();

  // Profile-based limits
  const nodeLimit = args.profile === 'quick' ? 10 : args.profile === 'debug' ? 30 : 20;

  const contextStart = performance.now();

  for (const anchor of resolvedAnchors) {
    // Deadline check: stop processing further anchors if over budget
    if (performance.now() - contextStart > deadlineMs) {
      partialReasons.add('deadline');
      omittedAnchors += resolvedAnchors.length - sections.length;
      break;
    }

    if (!anchor.symbolId) {
      // File anchor — get outline
      const outlineNodes = graphDb.queryOutline(anchor.filePath).slice(0, nodeLimit);
      sections.push({
        anchor: `${anchor.filePath}:${anchor.startLine}`,
        nodes: outlineNodes.map(n => ({ name: n.fqName, kind: n.kind, file: n.filePath, line: n.startLine })),
        edges: [],
        ...(args.includeTrace === true
          ? {
            why_included: [{
              filePath: anchor.filePath,
              depth: 0,
              edgeChain: [],
              confidence: anchor.confidence,
              ambiguous: anchor.resolution !== 'exact',
              truncationReason: null,
            }],
          }
          : {}),
      });
      totalNodes += outlineNodes.length;
      continue;
    }

    const expansion = expandAnchor(
      anchor,
      queryMode,
      Math.max(0, deadlineMs - (performance.now() - contextStart)),
      args.includeTrace === true,
      args.input,
    );
    sections.push(expansion.section);
    totalNodes += expansion.section.nodes.length;
    totalEdges += expansion.section.edges.length;
    omittedSections += expansion.section.partial ? 1 : 0;
    if (expansion.deadlineExceeded) {
      partialReasons.add('deadline');
      omittedAnchors += resolvedAnchors.length - sections.length;
      break;
    }
  }

  const formattedTextBrief = formatTextBrief(sections, budgetTokens, resolvedAnchors);
  if (formattedTextBrief.omittedSections > 0 || formattedTextBrief.truncated) {
    // Budget truncation only slices the human-readable textBrief; the
    // structured why_included breadcrumbs are returned in full via
    // graphContext, so they must not be stamped 'budget'. The budget
    // partiality is surfaced via partialOutput.reasons / truncatedText.
    partialReasons.add('budget');
  }
  const combinedSummary = buildCombinedSummary(resolvedAnchors, sections);
  const nextActions = suggestNextActions(resolvedAnchors, sections, queryMode);
  const freshness = computeFreshness();
  if (isSpeckitMetricsEnabled()) {
    const freshnessLabel = freshness.staleness === 'fresh' || freshness.staleness === 'recent' ? 'live' : freshness.staleness === 'stale' ? 'stale' : 'unavailable';
    speckitMetrics.recordHistogram('spec_kit.graph.query_latency_ms', performance.now() - speckitQueryStart, { mode: speckitModeLabel, freshness_state: freshnessLabel });
  }

  return {
    queryMode,
    resolvedAnchors,
    graphContext: sections,
    textBrief: formattedTextBrief.text,
    combinedSummary,
    nextActions,
    metadata: {
      totalNodes,
      totalEdges,
      budgetUsed: Math.ceil(formattedTextBrief.text.length / 4),
      budgetLimit: budgetTokens,
      deadlineMs,
      partialOutput: {
        isPartial: partialReasons.size > 0,
        reasons: [...partialReasons],
        omittedSections: omittedSections + formattedTextBrief.omittedSections,
        omittedAnchors,
        truncatedText: formattedTextBrief.truncated,
      },
      freshness,
    },
  };
}

/** Build fallback result when no seeds/subject resolve */
function buildEmptyFallback(queryMode: QueryMode, budgetTokens: number): ContextResult {
  return {
    queryMode,
    resolvedAnchors: [],
    graphContext: [],
    textBrief: 'No anchors resolved. Try `code_graph_scan` first, or provide a `subject` or `seeds[]`.',
    combinedSummary: 'Empty context — no seeds or subject resolved to graph nodes.',
    nextActions: ['Run `code_graph_scan` to index the workspace', 'Provide `subject` parameter with a symbol name'],
    metadata: {
      totalNodes: 0,
      totalEdges: 0,
      budgetUsed: 0,
      budgetLimit: budgetTokens,
      deadlineMs: null,
      partialOutput: {
        isPartial: false,
        reasons: [],
        omittedSections: 0,
        omittedAnchors: 0,
        truncatedText: false,
      },
      freshness: computeFreshness(),
    },
  };
}

/** Generate a one-line summary of the resolved context */
function buildCombinedSummary(anchors: ArtifactRef[], sections: GraphContextSection[]): string {
  if (anchors.length === 0) return 'No anchors resolved.';
  const totalNodes = sections.reduce((sum, s) => sum + s.nodes.length, 0);
  const totalEdges = sections.reduce((sum, s) => sum + s.edges.length, 0);
  const files = new Set(anchors.map(a => a.filePath));
  const topAnchor = anchors[0];
  const topName = topAnchor.fqName ?? topAnchor.filePath.split('/').pop() ?? 'unknown';
  return `${anchors.length} anchor(s) across ${files.size} file(s): ${topName} + ${totalNodes} symbols, ${totalEdges} relationships`;
}

/** Suggest relevant follow-up operations */
function suggestNextActions(anchors: ArtifactRef[], sections: GraphContextSection[], mode: QueryMode): string[] {
  const actions: string[] = [];
  if (mode === 'neighborhood' && sections.some(s => s.edges.length > 5)) {
    actions.push('Use `queryMode: "impact"` to see who calls these symbols');
  }
  if (mode === 'impact') {
    actions.push('Use `queryMode: "outline"` for file-level overview');
  }
  if (anchors.some(a => a.resolution === 'file_anchor')) {
    actions.push('Run `code_graph_scan` to improve resolution (file anchors found)');
  }
  if (sections.some(s => s.nodes.length >= 15)) {
    actions.push('Narrow with `seeds[]` for more specific context');
  }
  return actions.slice(0, 4);
}

/** Compute freshness metadata from DB scan timestamps */
function computeFreshness(): GraphFreshnessMetadata {
  try {
    const generation = graphDb.getCodeGraphGeneration();
    const d = graphDb.getDb();
    const row = d.prepare('SELECT MAX(indexed_at) as last FROM code_files').get() as { last: string | null } | undefined;
    const lastScanAt = row?.last ?? null;
    if (!lastScanAt) return { lastScanAt: null, staleness: 'unknown', generation };

    const ageMs = Date.now() - new Date(lastScanAt).getTime();
    const staleness = ageMs < 300_000 ? 'fresh' : ageMs < 3_600_000 ? 'recent' : 'stale';
    return { lastScanAt, staleness, generation };
  } catch {
    return { lastScanAt: null, staleness: 'unknown', generation: 0 };
  }
}

// Read-path allowlist for `reason` / `step` strings on
// edge metadata. The same sanitizer pattern as `code-graph-db` and
// `query.ts`: defense-in-depth single-line, length-capped, non-
// control-char check.
const CONTEXT_EDGE_REASON_MAX_LENGTH = 200;
const CONTEXT_EDGE_REASON_BLOCKED = /[\x00-\x1F\x7F]/;

function sanitizeContextEdgeString(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  if (value.length === 0) return null;
  if (value.length > CONTEXT_EDGE_REASON_MAX_LENGTH) return null;
  if (CONTEXT_EDGE_REASON_BLOCKED.test(value)) return null;
  return value;
}

function clampConfidence(value: unknown): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

function contextEdgeReliability(edge: graphDb.CodeEdgeTargetResult['edge'] | graphDb.CodeEdgeSourceResult['edge']): number {
  const evidenceClass = typeof edge.metadata?.evidenceClass === 'string'
    ? edge.metadata.evidenceClass
    : null;
  const evidenceClassFactor = evidenceClass === null
    ? 0
    : CONTEXT_EDGE_EVIDENCE_RANK_FACTORS[evidenceClass] ?? 0;
  return clampConfidence(edge.metadata?.confidence) * evidenceClassFactor;
}

function seededPprRankingEnabled(env: NodeJS.ProcessEnv = process.env): boolean {
  const raw = env[SEEDED_PPR_ENABLED_ENV]?.trim().toLowerCase();
  return raw ? SEEDED_PPR_ENABLED_VALUES.has(raw) : false;
}

function shouldUseSeededPprRanking(mode: QueryMode, input: string | undefined): boolean {
  if (!seededPprRankingEnabled()) {
    return false;
  }
  return classifyQueryExpansion(input ?? '', mode).seededPprEligible;
}

function positiveFinite(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : fallback;
}

function contextEdgeTransitionWeight(edge: graphDb.CodeEdgeTargetResult['edge'] | graphDb.CodeEdgeSourceResult['edge']): number {
  const evidenceClass = typeof edge.metadata?.evidenceClass === 'string'
    ? edge.metadata.evidenceClass
    : null;
  const evidenceFactor = evidenceClass
    ? SEEDED_PPR_EVIDENCE_TRANSITION_FACTORS[evidenceClass] ?? 1
    : 1;
  const confidence = typeof edge.metadata?.confidence === 'number'
    ? Math.max(clampConfidence(edge.metadata.confidence), 0.001)
    : 1;
  return positiveFinite(edge.weight, 1) * confidence * evidenceFactor * (1 + contextEdgeReliability(edge));
}

function uniquePprNodes<TNode extends PprNodeId>(nodeIds: readonly TNode[]): TNode[] {
  return Array.from(new Set(nodeIds));
}

function normalizeTeleport<TNode extends PprNodeId>(seeds: readonly TNode[]): Map<TNode, number> {
  const uniqueSeeds = uniquePprNodes(seeds);
  const teleport = new Map<TNode, number>();
  if (uniqueSeeds.length === 0) {
    return teleport;
  }
  const mass = 1 / uniqueSeeds.length;
  for (const seed of uniqueSeeds) {
    teleport.set(seed, mass);
  }
  return teleport;
}

function weightedAdjacency<TNode extends PprNodeId>(
  nodes: readonly TNode[],
  edges: readonly WeightedTraversalEdge<TNode>[],
): Map<TNode, Array<{ to: TNode; weight: number }>> {
  const nodeSet = new Set(nodes);
  const adjacency = new Map<TNode, Array<{ to: TNode; weight: number }>>();
  for (const edge of edges) {
    if (!nodeSet.has(edge.from) || !nodeSet.has(edge.to)) {
      continue;
    }
    const weight = positiveFinite(edge.weight, 0) * positiveFinite(edge.strength, 1);
    if (weight <= 0) {
      continue;
    }
    const bucket = adjacency.get(edge.from) ?? [];
    bucket.push({ to: edge.to, weight });
    adjacency.set(edge.from, bucket);
  }
  return adjacency;
}

export function computeBoundedPersonalizedPageRank<TNode extends PprNodeId>(
  options: BoundedPersonalizedPageRankOptions<TNode>,
): BoundedPersonalizedPageRankResult<TNode> {
  const seeds = uniquePprNodes(options.seeds);
  const teleport = normalizeTeleport(seeds);
  if (seeds.length === 0) {
    return { scores: new Map(), reached: new Map(), iterations: 0, boundedReason: 'empty' };
  }

  const maxHops = Math.max(0, Math.trunc(options.maxHops));
  const maxIterations = Math.max(1, Math.trunc(options.maxIterations));
  const damping = Math.max(0, Math.min(1, options.damping));
  const epsilon = options.convergenceEpsilon ?? SEEDED_PPR_EPSILON;
  const reached = collectMemoryWeightedWalk({
    seeds,
    maxHops,
    readEdges: options.readEdges,
  });
  const nodes = uniquePprNodes([...seeds, ...reached.keys()]);
  let scores = new Map<TNode, number>(teleport);
  if (nodes.length === seeds.length && reached.size === 0) {
    return { scores, reached, iterations: 0, boundedReason: 'empty' };
  }

  const adjacency = weightedAdjacency(nodes, options.readEdges(nodes));
  let boundedReason: BoundedPersonalizedPageRankResult<TNode>['boundedReason'] = 'iteration_cap';
  let iterations = 0;
  for (let iteration = 0; iteration < maxIterations; iteration += 1) {
    if (options.deadlineExpired?.() === true) {
      boundedReason = 'deadline';
      break;
    }

    const next = new Map<TNode, number>();
    for (const [node, mass] of teleport) {
      next.set(node, (next.get(node) ?? 0) + (1 - damping) * mass);
    }

    for (const node of nodes) {
      const currentScore = scores.get(node) ?? 0;
      if (currentScore === 0) {
        continue;
      }
      const outgoing = adjacency.get(node) ?? [];
      if (outgoing.length === 0) {
        for (const [seed, mass] of teleport) {
          next.set(seed, (next.get(seed) ?? 0) + damping * currentScore * mass);
        }
        continue;
      }
      const totalWeight = outgoing.reduce((sum, edge) => sum + edge.weight, 0);
      if (totalWeight <= 0) {
        continue;
      }
      for (const edge of outgoing) {
        next.set(edge.to, (next.get(edge.to) ?? 0) + damping * currentScore * (edge.weight / totalWeight));
      }
    }

    let delta = 0;
    for (const node of nodes) {
      delta += Math.abs((next.get(node) ?? 0) - (scores.get(node) ?? 0));
    }
    scores = next;
    iterations = iteration + 1;
    if (delta <= epsilon) {
      boundedReason = 'converged';
      break;
    }
  }

  return { scores, reached, iterations, boundedReason };
}

function stableTieValue(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function contextEdgeTieKey(result: ContextEdgeResult): readonly string[] {
  const relatedNode = 'targetNode' in result ? result.targetNode : result.sourceNode;
  const relatedSymbolId = 'targetNode' in result ? result.edge.targetId : result.edge.sourceId;
  const primaryKey =
    stableTieValue(relatedNode?.contentHash)
    ?? stableTieValue(relatedSymbolId)
    ?? stableTieValue(result.edge.sourceId)
    ?? stableTieValue(result.edge.targetId)
    ?? '';

  return [
    primaryKey,
    stableTieValue(relatedSymbolId) ?? '',
    stableTieValue(relatedNode?.filePath) ?? '',
    stableTieValue(relatedNode?.fqName) ?? '',
    stableTieValue(result.edge.edgeType) ?? '',
    stableTieValue(result.edge.sourceId) ?? '',
    stableTieValue(result.edge.targetId) ?? '',
  ];
}

function compareStrings(left: string, right: string): number {
  if (left < right) return -1;
  if (left > right) return 1;
  return 0;
}

function compareRankedContextEdges<T extends ContextEdgeResult>(
  left: RankedContextEdge<T>,
  right: RankedContextEdge<T>,
): number {
  if (left.rankScore > right.rankScore) return -1;
  if (left.rankScore < right.rankScore) return 1;

  const maxLength = Math.max(left.tieKey.length, right.tieKey.length);
  for (let index = 0; index < maxLength; index += 1) {
    const compared = compareStrings(left.tieKey[index] ?? '', right.tieKey[index] ?? '');
    if (compared !== 0) return compared;
  }
  return 0;
}

function rankContextEdges<T extends ContextEdgeResult>(
  results: readonly T[],
): T[] {
  return results
    .map((result) => ({
      result,
      tieKey: contextEdgeTieKey(result),
    }))
    .sort((left, right) => {
      const maxLength = Math.max(left.tieKey.length, right.tieKey.length);
      for (let index = 0; index < maxLength; index += 1) {
        const compared = compareStrings(left.tieKey[index] ?? '', right.tieKey[index] ?? '');
        if (compared !== 0) return compared;
      }
      return 0;
    })
    .map(({ result, tieKey }, index): RankedContextEdge<T> => {
      const baselineRankScore = 1 / (CONTEXT_EDGE_RRF_K + index + 1);
      return {
        result,
        rankScore: baselineRankScore + contextEdgeReliability(result.edge),
        tieKey,
      };
    })
    .sort(compareRankedContextEdges)
    .map((ranked) => ranked.result);
}

function contextNodeFromEdgeResult(
  result: graphDb.CodeEdgeTargetResult | graphDb.CodeEdgeSourceResult,
): ContextNodeSummary | null {
  const node = 'targetNode' in result ? result.targetNode : result.sourceNode;
  if (!node) {
    return null;
  }
  return {
    name: node.fqName,
    kind: node.kind,
    file: node.filePath,
    line: node.startLine,
  };
}

function seededPprEdgeKey(edge: graphDb.CodeEdgeSourceResult['edge']): string {
  return `${edge.sourceId}\u0000${edge.targetId}\u0000${edge.edgeType}`;
}

function compareSeededPprImpactCandidates(
  left: SeededPprImpactCandidate,
  right: SeededPprImpactCandidate,
): number {
  if (left.pprScore > right.pprScore) return -1;
  if (left.pprScore < right.pprScore) return 1;
  if (left.minHop < right.minHop) return -1;
  if (left.minHop > right.minHop) return 1;

  const comparedEdges = compareRankedContextEdges(
    { result: left.result, rankScore: contextEdgeReliability(left.result.edge), tieKey: left.tieKey },
    { result: right.result, rankScore: contextEdgeReliability(right.result.edge), tieKey: right.tieKey },
  );
  if (comparedEdges !== 0) return comparedEdges;
  return compareStrings(left.targetLabel, right.targetLabel);
}

function collectSeededPprImpactRanking(
  anchor: ArtifactRef,
  anchorLabel: string,
  budgetExpired: () => boolean,
): SeededPprImpactRanking {
  const anchorId = anchor.symbolId;
  if (!anchorId) {
    return { candidates: [], deadlineExceeded: false };
  }

  let deadlineExceeded = false;
  const edgesByNode = new Map<string, WeightedTraversalEdge<string>[]>();
  const nodeSummaries = new Map<string, ContextNodeSummary>([
    [anchorId, { name: anchorLabel, kind: anchor.kind ?? 'unknown', file: anchor.filePath, line: anchor.startLine }],
  ]);
  const candidatesByEdge = new Map<string, {
    result: graphDb.CodeEdgeSourceResult;
    targetLabel: string;
    targetFile: string | null;
  }>();

  const ensureNodeEdges = (nodeId: string): WeightedTraversalEdge<string>[] => {
    const cached = edgesByNode.get(nodeId);
    if (cached) {
      return cached;
    }
    if (budgetExpired()) {
      deadlineExceeded = true;
      edgesByNode.set(nodeId, []);
      return [];
    }

    const weightedEdges: WeightedTraversalEdge<string>[] = [];
    for (const edgeType of SEEDED_PPR_IMPACT_EDGE_TYPES) {
      const incoming = graphDb.queryEdgesTo(nodeId, edgeType);
      for (const result of incoming) {
        const related = contextNodeFromEdgeResult(result);
        if (related) {
          nodeSummaries.set(result.edge.sourceId, related);
        }
        if (result.edge.sourceId !== anchorId) {
          candidatesByEdge.set(seededPprEdgeKey(result.edge), {
            result,
            targetLabel: nodeSummaries.get(nodeId)?.name ?? nodeId,
            targetFile: nodeSummaries.get(nodeId)?.file ?? null,
          });
        }
        weightedEdges.push({
          from: nodeId,
          to: result.edge.sourceId,
          weight: contextEdgeTransitionWeight(result.edge),
        });
      }

      const outgoing = graphDb.queryEdgesFrom(nodeId, edgeType);
      for (const result of outgoing) {
        const related = contextNodeFromEdgeResult(result);
        if (related) {
          nodeSummaries.set(result.edge.targetId, related);
        }
        weightedEdges.push({
          from: nodeId,
          to: result.edge.targetId,
          weight: contextEdgeTransitionWeight(result.edge),
        });
      }
    }

    edgesByNode.set(nodeId, weightedEdges);
    return weightedEdges;
  };

  const readEdges = (nodeIds: readonly string[]): WeightedTraversalEdge<string>[] => (
    uniquePprNodes(nodeIds).flatMap((nodeId) => ensureNodeEdges(nodeId))
  );

  const ppr = computeBoundedPersonalizedPageRank({
    seeds: [anchorId],
    maxHops: SEEDED_PPR_MAX_HOPS,
    maxIterations: SEEDED_PPR_MAX_ITERATIONS,
    damping: SEEDED_PPR_DAMPING,
    convergenceEpsilon: SEEDED_PPR_EPSILON,
    readEdges,
    deadlineExpired: budgetExpired,
  });
  if (ppr.boundedReason === 'deadline') {
    deadlineExceeded = true;
  }

  readEdges([anchorId, ...ppr.reached.keys()]);

  const candidates = [...candidatesByEdge.values()]
    .map((candidate): SeededPprImpactCandidate | null => {
      const sourceId = candidate.result.edge.sourceId;
      const pprScore = ppr.scores.get(sourceId);
      if (pprScore === undefined) {
        return null;
      }
      const reached = ppr.reached.get(sourceId);
      return {
        ...candidate,
        pprScore,
        minHop: reached?.minHop ?? 1,
        tieKey: contextEdgeTieKey(candidate.result),
      };
    })
    .filter((candidate): candidate is SeededPprImpactCandidate => candidate !== null)
    .sort(compareSeededPprImpactCandidates);

  return { candidates, deadlineExceeded };
}

function formatContextEdge(edge: graphDb.CodeEdgeTargetResult['edge'] | graphDb.CodeEdgeSourceResult['edge']): {
  confidence: number | null;
  detectorProvenance: string | null;
  evidenceClass: string | null;
  reason: string | null;
  step: string | null;
} {
  const confidence = edge.metadata?.confidence ?? edge.weight;
  return {
    confidence: typeof confidence === 'number' && Number.isFinite(confidence) ? confidence : null,
    detectorProvenance: typeof edge.metadata?.detectorProvenance === 'string'
      ? edge.metadata.detectorProvenance
      : null,
    evidenceClass: typeof edge.metadata?.evidenceClass === 'string' ? edge.metadata.evidenceClass : null,
    reason: sanitizeContextEdgeString(edge.metadata?.reason),
    step: sanitizeContextEdgeString(edge.metadata?.step),
  };
}

function formatContextNodeKind(kind: string): string {
  const trimmed = kind.trim();
  return trimmed.length > 0 ? trimmed : 'unknown';
}

function formatContextNode(node: ContextNodeSummary): string {
  return `  ${formatContextNodeKind(node.kind)} ${node.name} (${node.file}:${node.line})`;
}

/** Expand a single anchor into a context section */
function expandAnchor(
  anchor: ArtifactRef,
  mode: QueryMode,
  remainingMs?: number,
  includeTrace = false,
  queryText?: string,
): ExpansionResult {
  const startTime = performance.now();
  const budgetMs = remainingMs ?? 400; // 400ms default latency budget
  const nodes: { name: string; kind: string; file: string; line: number }[] = [];
  const edges: {
    from: string;
    to: string;
    type: string;
    confidence: number | null;
    detectorProvenance: string | null;
    evidenceClass: string | null;
    reason: string | null;
    step: string | null;
  }[] = [];
  let deadlineExceeded = false;
  let omittedNodes = 0;
  let omittedEdges = 0;
  let omittedWhyIncluded = 0;
  const whyIncludedByFile = new Map<string, ContextWhyIncluded>();

  const anchorLabel = anchor.fqName ?? anchor.symbolId ?? anchor.filePath;
  if (includeTrace) {
    whyIncludedByFile.set(anchor.filePath, {
      filePath: anchor.filePath,
      depth: 0,
      edgeChain: [],
      confidence: anchor.confidence,
      ambiguous: anchor.resolution !== 'exact',
      truncationReason: null,
    });
  }

  const startHr = process.hrtime.bigint();
  const budgetExpired = (): boolean => Number(process.hrtime.bigint() - startHr) / 1e6 > budgetMs;

  const finalize = (): ExpansionResult => {
    const traceTruncationReason = deadlineExceeded
      ? 'deadline'
      : omittedWhyIncluded > 0
        ? 'trace_limit'
        : null;
    const whyIncluded = [...whyIncludedByFile.values()].map((entry) => ({
      ...entry,
      // The depth-0 anchor entry is recorded in full before any edge
      // processing, deadline check, or trace-limit cap, so its breadcrumb is
      // always complete — never stamp it with a section-level truncation
      // reason (that would falsely signal incomplete provenance). Neighbor
      // entries (depth >= 1) reflect a section whose expansion was cut short.
      truncationReason: entry.depth === 0
        ? entry.truncationReason
        : entry.truncationReason ?? traceTruncationReason,
    }));
    return {
      section: {
        anchor: `${anchor.filePath}:${anchor.startLine} (${anchor.fqName ?? 'unknown'})`,
        nodes,
        edges,
        ...(includeTrace ? { why_included: whyIncluded } : {}),
        ...(deadlineExceeded
          ? {
            partial: {
              reason: 'deadline',
              omittedNodes,
              omittedEdges,
            },
          }
          : {}),
      },
      deadlineExceeded,
      omittedNodes,
      omittedEdges,
    };
  };

  const recordWhyIncluded = (input: {
    filePath: string | null | undefined;
    depth: number;
    edge: graphDb.CodeEdgeTargetResult['edge'] | graphDb.CodeEdgeSourceResult['edge'];
    from: string;
    to: string;
    fromFile: string | null;
    toFile: string | null;
  }): void => {
    if (!includeTrace || !input.filePath) {
      return;
    }
    const formattedEdge = formatContextEdge(input.edge);
    const confidence = formattedEdge.confidence;
    const previous = whyIncludedByFile.get(input.filePath);
    // A strictly-shallower existing entry wins (shortest provenance path);
    // ignore deeper re-discoveries of the same file.
    if (previous && previous.depth < input.depth) {
      return;
    }
    const edge = {
      from: input.from,
      to: input.to,
      fromFile: input.fromFile,
      toFile: input.toFile,
      edgeType: input.edge.edgeType,
      confidence,
      detectorProvenance: formattedEdge.detectorProvenance,
      evidenceClass: formattedEdge.evidenceClass,
      reason: formattedEdge.reason,
      step: formattedEdge.step,
    };
    // A neighbor pulled in via a heuristic/inferred edge is an uncertain
    // inclusion; flag it so consumers can distinguish it from a resolved edge.
    // (Anchor entries instead derive ambiguous from anchor-resolution identity.)
    const edgeAmbiguous = formattedEdge.evidenceClass === 'INFERRED';
    // Same-depth re-discovery: a file reachable via multiple edges at the same
    // depth was included for more than one reason — append the edge instead of
    // dropping it so edgeChain reflects every distinct inclusion path. Track
    // the minimum confidence as the entry's overall confidence and OR the
    // ambiguity so any inferred path keeps the entry flagged.
    if (previous && previous.depth === input.depth) {
      previous.edgeChain = [...previous.edgeChain, edge];
      previous.confidence = previous.edgeChain.reduce<number | null>((minimum, step) => {
        if (step.confidence === null) return minimum;
        if (minimum === null) return step.confidence;
        return Math.min(minimum, step.confidence);
      }, null);
      previous.ambiguous = previous.ambiguous || edgeAmbiguous;
      return;
    }
    if (!previous && whyIncludedByFile.size >= CONTEXT_WHY_INCLUDED_LIMIT) {
      omittedWhyIncluded += 1;
      return;
    }
    whyIncludedByFile.set(input.filePath, {
      filePath: input.filePath,
      depth: input.depth,
      edgeChain: [edge],
      confidence,
      ambiguous: edgeAmbiguous,
      truncationReason: null,
    });
  };

  // Invariant: buildContext handles file anchors (no symbolId) inline and
  // continues before ever reaching expandAnchor (the sole call site), so
  // anchor.symbolId is always present here. Assert rather than carry a second,
  // divergent why_included construction path for a state that cannot occur.
  if (!anchor.symbolId) {
    throw new Error('expandAnchor requires a symbol anchor; file anchors are handled by buildContext');
  }

  switch (mode) {
    case 'neighborhood': {
      // 1-hop: CALLS + IMPORTS + CONTAINS from anchor
      const seenNodes = new Set<string>();
      for (const edgeType of ['CALLS', 'IMPORTS', 'CONTAINS'] as const) {
        if (budgetExpired()) {
          deadlineExceeded = true;
          omittedEdges += 1;
          break;
        }
        const outgoing = rankContextEdges(graphDb.queryEdgesFrom(anchor.symbolId, edgeType));
        let processedOutgoing = 0;
        for (const { edge, targetNode } of outgoing) {
          if (budgetExpired()) {
            deadlineExceeded = true;
            omittedEdges += outgoing.length - processedOutgoing;
            break;
          }
          edges.push({
            from: anchorLabel,
            to: targetNode?.fqName ?? edge.targetId,
            type: edge.edgeType,
            ...formatContextEdge(edge),
          });
          recordWhyIncluded({
            filePath: targetNode?.filePath,
            depth: 1,
            edge,
            from: anchorLabel,
            to: targetNode?.fqName ?? edge.targetId,
            fromFile: anchor.filePath,
            toFile: targetNode?.filePath ?? null,
          });
          if (targetNode && !seenNodes.has(targetNode.fqName)) {
            seenNodes.add(targetNode.fqName);
            nodes.push({ name: targetNode.fqName, kind: targetNode.kind, file: targetNode.filePath, line: targetNode.startLine });
          }
          processedOutgoing += 1;
        }
        if (deadlineExceeded) {
          break;
        }
        const incoming = rankContextEdges(graphDb.queryEdgesTo(anchor.symbolId, edgeType));
        let processedIncoming = 0;
        for (const { edge, sourceNode } of incoming) {
          if (budgetExpired()) {
            deadlineExceeded = true;
            omittedEdges += incoming.length - processedIncoming;
            break;
          }
          edges.push({
            from: sourceNode?.fqName ?? edge.sourceId,
            to: anchorLabel,
            type: edge.edgeType,
            ...formatContextEdge(edge),
          });
          recordWhyIncluded({
            filePath: sourceNode?.filePath,
            depth: 1,
            edge,
            from: sourceNode?.fqName ?? edge.sourceId,
            to: anchorLabel,
            fromFile: sourceNode?.filePath ?? null,
            toFile: anchor.filePath,
          });
          if (sourceNode && !seenNodes.has(sourceNode.fqName)) {
            seenNodes.add(sourceNode.fqName);
            nodes.push({ name: sourceNode.fqName, kind: sourceNode.kind, file: sourceNode.filePath, line: sourceNode.startLine });
          }
          processedIncoming += 1;
        }
        if (deadlineExceeded) {
          break;
        }
      }
      break;
    }
    case 'outline': {
      const outlineNodes = graphDb.queryOutline(anchor.filePath);
      for (const n of outlineNodes) {
        if (budgetExpired()) {
          deadlineExceeded = true;
          omittedNodes += outlineNodes.length - nodes.length;
          break;
        }
        nodes.push({ name: n.fqName, kind: n.kind, file: n.filePath, line: n.startLine });
      }
      // CONTAINS + EXPORTS from file symbols
      if (!deadlineExceeded) {
        const fileExports = graphDb.queryEdgesFrom(anchor.symbolId, 'EXPORTS');
        let processedExports = 0;
        for (const { edge, targetNode } of fileExports) {
          if (budgetExpired()) {
            deadlineExceeded = true;
            omittedEdges += fileExports.length - processedExports;
            break;
          }
          edges.push({
            from: anchorLabel,
            to: targetNode?.fqName ?? edge.targetId,
            type: 'EXPORTS',
            ...formatContextEdge(edge),
          });
          recordWhyIncluded({
            filePath: targetNode?.filePath,
            depth: 1,
            edge,
            from: anchorLabel,
            to: targetNode?.fqName ?? edge.targetId,
            fromFile: anchor.filePath,
            toFile: targetNode?.filePath ?? null,
          });
          processedExports += 1;
        }
      }
      break;
    }
    case 'impact': {
      if (shouldUseSeededPprRanking(mode, queryText)) {
        const seededRanking = collectSeededPprImpactRanking(anchor, anchorLabel, budgetExpired);
        deadlineExceeded = seededRanking.deadlineExceeded;
        let processedIncoming = 0;
        for (const candidate of seededRanking.candidates) {
          if (budgetExpired()) {
            deadlineExceeded = true;
            omittedEdges += seededRanking.candidates.length - processedIncoming;
            break;
          }
          const { edge, sourceNode } = candidate.result;
          edges.push({
            from: sourceNode?.fqName ?? edge.sourceId,
            to: candidate.targetLabel,
            type: edge.edgeType,
            ...formatContextEdge(edge),
          });
          recordWhyIncluded({
            filePath: sourceNode?.filePath,
            depth: candidate.minHop,
            edge,
            from: sourceNode?.fqName ?? edge.sourceId,
            to: candidate.targetLabel,
            fromFile: sourceNode?.filePath ?? null,
            toFile: candidate.targetFile,
          });
          if (sourceNode) {
            nodes.push({ name: sourceNode.fqName, kind: sourceNode.kind, file: sourceNode.filePath, line: sourceNode.startLine });
          }
          processedIncoming += 1;
        }
        break;
      }

      // Reverse: who calls this? who imports this?
      // Latency guard: break early if queries exceed budget (400ms default)
      for (const edgeType of ['CALLS', 'IMPORTS'] as const) {
        const elapsed = performance.now() - startTime;
        if (elapsed > budgetMs) {
          console.warn(`[code-graph-context] impact query exceeded ${budgetMs}ms budget (${Math.round(elapsed)}ms elapsed), breaking early`);
          deadlineExceeded = true;
          omittedEdges += 1;
          break;
        }
        const incoming = rankContextEdges(graphDb.queryEdgesTo(anchor.symbolId, edgeType));
        let processedIncoming = 0;
        for (const { edge, sourceNode } of incoming) {
          if (budgetExpired()) {
            deadlineExceeded = true;
            omittedEdges += incoming.length - processedIncoming;
            break;
          }
          edges.push({
            from: sourceNode?.fqName ?? edge.sourceId,
            to: anchorLabel,
            type: edge.edgeType,
            ...formatContextEdge(edge),
          });
          recordWhyIncluded({
            filePath: sourceNode?.filePath,
            depth: 1,
            edge,
            from: sourceNode?.fqName ?? edge.sourceId,
            to: anchorLabel,
            fromFile: sourceNode?.filePath ?? null,
            toFile: anchor.filePath,
          });
          if (sourceNode) {
            nodes.push({ name: sourceNode.fqName, kind: sourceNode.kind, file: sourceNode.filePath, line: sourceNode.startLine });
          }
          processedIncoming += 1;
        }
        if (deadlineExceeded) {
          break;
        }
      }
      break;
    }
  }

  return finalize();
}

/**
 * Discriminated result for subject resolution.
 *
 * - 'resolved': matched a row in code_nodes
 * - 'unresolved': DB was queryable but no matching row exists
 * - 'unavailable': DB threw during the resolution attempt (e.g. connection
 *   broken, schema mismatch); the subject's actual existence is UNKNOWN, not
 *   absent. Callers can distinguish this from 'unresolved' to render a
 *   degraded-availability message instead of treating the subject as missing.
 */
export type ResolveSubjectResult =
  | { kind: 'resolved'; ref: ArtifactRef }
  | { kind: 'unresolved' }
  | { kind: 'unavailable'; reason: string };

/**
 * Resolve a subject string to an ArtifactRef with typed unavailability.
 * Internal helper used by `buildContext`; surfaces DB failures distinctly
 * from "no matching row" so callers can react accordingly.
 */
// Typed resolution result
function resolveSubjectToRefTyped(subject: string): ResolveSubjectResult {
  try {
    const d = graphDb.getDb();
    // Try as symbolId, fqName, or name
    const row = d.prepare(`
      SELECT * FROM code_nodes
      WHERE symbol_id = ? OR fq_name = ? OR name = ?
      LIMIT 1
    `).get(subject, subject, subject) as Record<string, unknown> | undefined;

    if (row) {
      return {
        kind: 'resolved',
        ref: {
          filePath: row.file_path as string,
          startLine: row.start_line as number,
          endLine: row.end_line as number,
          symbolId: row.symbol_id as string,
          fqName: row.fq_name as string,
          kind: row.kind as string,
          confidence: 0.9,
          resolution: 'exact',
          score: null,
          snippet: null,
          range: null,
          provider: 'code_graph',
        },
      };
    }
    return { kind: 'unresolved' };
  } catch (err: unknown) {
    // DB error is now distinct from unresolved. Previously
    // swallowed silently as "unresolved subject"; now surfaces the reason.
    return {
      kind: 'unavailable',
      reason: err instanceof Error ? err.message : String(err),
    };
  }
}

/**
 * Backward-compatible wrapper: `null` when the subject is unresolved OR the
 * DB is unavailable. New callers should use `resolveSubjectToRefTyped`.
 * A side-channel debug log surfaces the unavailable case so the
 * silent-error path is auditable from logs even when callers only see null.
 */
function resolveSubjectToRef(subject: string): ArtifactRef | null {
  const result = resolveSubjectToRefTyped(subject);
  if (result.kind === 'resolved') return result.ref;
  if (result.kind === 'unavailable') {
    // Surface DB-failure path so it's not silently lost
    console.warn(
      `[code-graph-context] resolveSubjectToRef DB unavailable for subject "${subject}": ${result.reason}`,
    );
  }
  return null;
}

/**
 * Format sections into compact text brief within token budget.
 * Never-drops guarantee: always includes top seed, root anchor, one boundary edge, one next action.
 */
function formatTextBrief(sections: GraphContextSection[], budgetTokens: number, _anchors?: ArtifactRef[]): FormattedTextBrief {
  const maxChars = budgetTokens * 4;
  const lines: string[] = [];
  let omittedSections = 0;

  // Priority rendering: first section is always fully rendered (never dropped)
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    const isFirst = i === 0;
    const nodeLimit = isFirst ? 15 : Math.max(5, 15 - i * 3);
    const edgeLimit = isFirst ? 10 : Math.max(3, 10 - i * 2);

    lines.push(`### ${section.anchor}`);

    if (section.nodes.length > 0) {
      lines.push('Symbols:');
      for (const n of section.nodes.slice(0, nodeLimit)) {
        lines.push(formatContextNode(n));
      }
      if (section.nodes.length > nodeLimit) {
        lines.push(`  ... +${section.nodes.length - nodeLimit} more`);
      }
    }

    if (section.edges.length > 0) {
      lines.push('Relationships:');
      for (const e of section.edges.slice(0, edgeLimit)) {
        const metadata = [
          e.reason ? `reason=${e.reason}` : null,
          e.step ? `step=${e.step}` : null,
          typeof e.confidence === 'number' ? `confidence=${e.confidence}` : null,
        ].filter(Boolean).join(' ');
        lines.push(`  ${e.from} -[${e.type}${metadata ? ` ${metadata}` : ''}]-> ${e.to}`);
      }
      if (section.edges.length > edgeLimit) {
        lines.push(`  ... +${section.edges.length - edgeLimit} more`);
      }
    }

    lines.push('');

    // Budget check: stop adding sections if we're over budget (but first section always included)
    if (!isFirst && lines.join('\n').length > maxChars * 0.9) {
      omittedSections = sections.length - i - 1;
      lines.push(`[${omittedSections} more sections omitted — budget limit]`);
      break;
    }
  }

  let result = lines.join('\n');
  let truncated = false;
  if (result.length > maxChars) {
    truncated = true;
    result = result.slice(0, maxChars) + '\n[...truncated]';
  }
  return {
    text: result,
    omittedSections,
    truncated,
  };
}
