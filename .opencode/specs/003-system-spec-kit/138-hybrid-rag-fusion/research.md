# Feature Research: Unified Graph Architecture for Hybrid Search Pipeline

## 1. Metadata

| Field | Value |
|-------|-------|
| Research ID | R-138-UGA-001 |
| Status | COMPLETE |
| Created | 2026-02-20 |
| Researcher | @research agent |
| Spec Folder | 003-system-spec-kit/138-hybrid-rag-fusion |
| Confidence | High (85%) |

---

## 2. Investigation Report

### Request Summary

Design a unified graph architecture that merges two disconnected graph systems -- the **Causal Edge Graph** (SQLite `causal_edges` table) and the **SGQS Skill Graph** (in-memory filesystem-based) -- into a single retrieval channel that feeds the existing hybrid search pipeline through the currently-null `graphSearchFn` hook.

### Key Findings

1. **The graph channel hook is wired but never connected.** `context-server.ts:566` calls `hybridSearch.init(database, vectorIndex.vectorSearch)` -- the third `graphFn` parameter is omitted, defaulting to `null`. The entire graph channel infrastructure (RRF source type `'graph'`, `GRAPH_WEIGHT_BOOST = 1.5`, score normalization for graph results) exists but receives zero input.

2. **The two graph systems have fundamentally different storage models.** The Causal Graph uses string IDs in SQLite (`source_id`/`target_id` as TEXT referencing `memory_index.id`), while the Skill Graph uses hierarchical path IDs in memory (`{skill-name}/{relative-path}` as Map keys). There is no shared ID namespace. Bridging them requires a virtual node adapter.

3. **A causal-boost module already exists but operates post-fusion.** `causal-boost.ts` applies score boosting using recursive CTE traversal of `causal_edges` AFTER RRF fusion completes. This is separate from the graph search CHANNEL -- it is a post-processing step. The unified graph search function is a pre-fusion input to RRF.

4. **The SGQS engine rebuilds the graph from filesystem on every query call.** `query()` in `sgqs/index.ts:50-55` calls `buildSkillGraph(skillRoot)` synchronously on each invocation, performing full filesystem scanning. This is unsuitable for a 45ms query budget. The graph must be cached.

5. **Adaptive fusion currently has no graph weight dimension.** `FusionWeights` in `adaptive-fusion.ts` only has `semanticWeight`, `keywordWeight`, and `recencyWeight`. Adding a `graphWeight` field requires extending this interface and all 6 intent profiles.

### Recommendations Summary

| Option | Description | Confidence |
|--------|-------------|------------|
| A | Virtual Graph Adapter with Cached SGQS | High |
| B | SQLite-Only Graph (merge skill nodes into causal_edges) | Medium |

**Recommended: Option A** -- Virtual Graph Adapter with graph cache, querying both graphs in parallel within the 45ms budget.

---

## 3. Executive Overview

The hybrid search pipeline (`hybridSearchEnhanced()`) orchestrates 4 retrieval channels: Vector, FTS5, BM25, and Graph. The Graph channel has full infrastructure (RRF source type, weight boost, score normalization) but receives no data because `graphSearchFn` is null. Meanwhile, two rich graph systems exist in isolation:

```
Current State:

  [Causal Graph]          [Skill Graph]          [Hybrid Search Pipeline]
  causal_edges (SQLite)   SGQS (in-memory)       hybridSearchEnhanced()
  6 edge types            6 edge types               |
  Memory documents        Skill knowledge        [Vector] [FTS5] [BM25] [Graph=NULL]
  Spreading activation    SGQS query engine           |          |         |      |
  causal-boost.ts         graph-enrichment.ts    fuseResultsMulti() via RRF
        |                       |                         |
        v                       v                    GRAPH_WEIGHT_BOOST=1.5
   NOT connected           Only used at                   |
   to search               INDEX time              (receives nothing)
```

```
Target State:

  [Causal Graph]          [Skill Graph]
  causal_edges (SQLite)   SGQS (cached)
        |                       |
        +-------+-------+-------+
                |
      [Unified Graph Adapter]
      createUnifiedGraphSearchFn()
                |
                v
        graphSearchFn(query, options)
                |
                v
        [Hybrid Search Pipeline]
        hybridSearchEnhanced()
            |
        [Vector] [FTS5] [BM25] [Graph]
            |                      |
        fuseResultsMulti() via RRF
                |
        [Adaptive Fusion with graphWeight]
```

---

## 4. Core Architecture

### 4.1 Unified Node Model

The two graph systems use incompatible ID systems:

| System | Node ID Format | Example | Storage |
|--------|---------------|---------|---------|
| Causal Graph | `string(memory_index.id)` | `"42"`, `"137"` | SQLite `causal_edges` table |
| Skill Graph | `{skill}/{path}` | `"system-spec-kit/nodes/memory-system"` | In-memory `Map<string, GraphNode>` |

**Solution: Unified Node ID with namespace prefix.**

```typescript
// Namespace prefixes for unified ID space
type UnifiedNodeId = `mem:${string}` | `skill:${string}`;

// Examples:
// Memory document: "mem:42" (from memory_index.id = 42)
// Skill node: "skill:system-spec-kit/nodes/memory-system"
```

[SOURCE: `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:44-52`] -- CausalEdge interface uses `source_id: string` and `target_id: string`.

[SOURCE: `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/sgqs/types.ts:13-28`] -- GraphNode interface uses `id: string` in `{skill-name}/{relative-path}` format.

### 4.2 Unified Edge Type Taxonomy

| Causal Edge Types | Skill Graph Edge Types | Unified Category |
|-------------------|----------------------|------------------|
| `caused` | - | CAUSAL |
| `enabled` | - | CAUSAL |
| `supersedes` | - | TEMPORAL |
| `contradicts` | - | CONFLICT |
| `derived_from` | - | LINEAGE |
| `supports` | - | SUPPORT |
| - | `LINKS_TO` | STRUCTURAL |
| - | `CONTAINS` | STRUCTURAL |
| - | `REFERENCES` | SEMANTIC |
| - | `DEPENDS_ON` | DEPENDENCY |
| - | `HAS_ENTRYPOINT` | STRUCTURAL |
| - | `HAS_INDEX` | STRUCTURAL |

**New Cross-Graph Edge Types:**

| Edge Type | Direction | Purpose |
|-----------|-----------|---------|
| `DESCRIBES` | skill -> mem | Skill node is documentation for a memory topic |
| `IMPLEMENTS` | mem -> skill | Memory describes implementation of a skill concept |
| `GOVERNS` | skill -> mem | Skill rule/node governs memory behavior |

### 4.3 Complete TypeScript Interface Definitions

```typescript
// ---------------------------------------------------------------
// unified-graph.ts - Unified Graph Search for Hybrid Pipeline
// ---------------------------------------------------------------

import type Database from 'better-sqlite3';
import type { SkillGraph, GraphNode } from '../../scripts/sgqs/types';

/* ----- 1. UNIFIED NODE MODEL ----- */

type NodeNamespace = 'mem' | 'skill';

interface UnifiedNode {
  /** Namespaced ID: "mem:{id}" or "skill:{skill/path}" */
  id: string;
  namespace: NodeNamespace;
  /** Original ID in the source system */
  originalId: string;
  /** Human-readable title */
  title: string;
  /** Searchable text content for keyword matching */
  searchText: string;
  /** Source system metadata */
  metadata: Record<string, unknown>;
}

/* ----- 2. UNIFIED EDGE MODEL ----- */

type UnifiedEdgeType =
  // From Causal Graph
  | 'caused' | 'enabled' | 'supersedes'
  | 'contradicts' | 'derived_from' | 'supports'
  // From Skill Graph
  | 'links_to' | 'contains' | 'references'
  | 'depends_on' | 'has_entrypoint' | 'has_index'
  // Cross-graph bridges
  | 'describes' | 'implements' | 'governs';

interface UnifiedEdge {
  source: string;  // UnifiedNode.id
  target: string;  // UnifiedNode.id
  type: UnifiedEdgeType;
  weight: number;  // 0.0 - 1.0
}

/* ----- 3. GRAPH SEARCH RESULT ----- */

interface GraphSearchResult {
  id: number | string;
  score: number;
  source: 'graph';
  title?: string;
  graphSource: 'causal' | 'skill' | 'cross';
  traversalDepth: number;
  edgeType?: string;
  [key: string]: unknown;
}

/* ----- 4. GRAPH SEARCH OPTIONS ----- */

interface UnifiedGraphSearchOptions {
  limit?: number;
  specFolder?: string;
  /** Which sub-graphs to query */
  sources?: ('causal' | 'skill' | 'both')[];
  /** Maximum traversal depth */
  maxHops?: number;
  /** Minimum score threshold */
  minScore?: number;
}

/* ----- 5. ADAPTIVE GRAPH WEIGHTS ----- */

/** Extended FusionWeights with graph dimension */
interface ExtendedFusionWeights {
  semanticWeight: number;
  keywordWeight: number;
  recencyWeight: number;
  graphWeight: number;       // NEW
  graphCausalBias: number;   // 0-1: weight toward causal vs skill graph
}
```

---

## 5. Technical Specifications

### 5.1 The `graphSearchFn` Implementation

**Algorithm: Dual-Graph Parallel Query with Score Normalization**

```typescript
/**
 * Factory function that creates the unified graph search function.
 * Called once at server startup, returns the closure that
 * hybridSearch.init() accepts as the third parameter.
 */
function createUnifiedGraphSearchFn(
  db: Database.Database,
  skillGraphCache: SkillGraphCache
): GraphSearchFn {

  return function unifiedGraphSearch(
    query: string,
    options: Record<string, unknown>
  ): Array<Record<string, unknown>> {
    const limit = (options.limit as number) || 10;
    const specFolder = options.specFolder as string | undefined;
    const startTime = Date.now();
    const BUDGET_MS = 40; // Leave 5ms headroom from 45ms budget

    // ---- PHASE 1: Keyword extraction (1-2ms) ----
    const queryTerms = extractQueryTerms(query);

    // ---- PHASE 2: Parallel graph queries (budget-bounded) ----
    const results: GraphSearchResult[] = [];

    // 2a. Causal graph: keyword match on memory titles/paths (SQLite)
    const causalResults = queryCausalGraph(
      db, queryTerms, specFolder, Math.ceil(limit * 0.6)
    );
    results.push(...causalResults);

    // 2b. Skill graph: node property matching (in-memory, cached)
    const elapsed = Date.now() - startTime;
    if (elapsed < BUDGET_MS - 5) {
      const skillResults = querySkillGraph(
        skillGraphCache, queryTerms, limit - causalResults.length
      );
      results.push(...skillResults);
    }

    // ---- PHASE 3: Score normalization (< 1ms) ----
    return normalizeGraphScores(results, limit);
  };
}
```

### 5.2 Causal Graph Query Implementation

The causal graph query finds memory documents that are causally connected to memories matching the search query. This is a TWO-STEP process:

**Step 1:** Find seed memories whose titles/trigger_phrases match query terms (FTS5 or LIKE).
**Step 2:** Traverse `causal_edges` outward from seeds (1-2 hops) to find causally related documents.

```typescript
function queryCausalGraph(
  db: Database.Database,
  queryTerms: string[],
  specFolder: string | undefined,
  limit: number
): GraphSearchResult[] {
  // Step 1: Find seed memories matching query (fast: uses existing FTS index)
  const termPattern = queryTerms.join('%');
  const folderFilter = specFolder
    ? 'AND m.spec_folder = ?'
    : '';
  const params: unknown[] = specFolder
    ? [`%${termPattern}%`, specFolder, 5]
    : [`%${termPattern}%`, 5];

  const seeds = db.prepare(`
    SELECT m.id, m.title, m.spec_folder
    FROM memory_index m
    WHERE (m.title LIKE ? OR m.trigger_phrases LIKE ?)
    ${folderFilter}
    ORDER BY m.importance_weight DESC
    LIMIT ?
  `).all(...[`%${termPattern}%`, ...params]) as Array<{
    id: number; title: string; spec_folder: string
  }>;

  if (seeds.length === 0) return [];

  // Step 2: Traverse causal edges from seeds (1-2 hops)
  const seedIds = seeds.map(s => String(s.id));
  const placeholders = seedIds.map(() => '?').join(',');

  const neighbors = db.prepare(`
    WITH RECURSIVE causal_walk(node_id, hop, path, strength) AS (
      -- Seed nodes
      SELECT target_id, 1, source_id || '>' || target_id, strength
      FROM causal_edges
      WHERE source_id IN (${placeholders})
      UNION ALL
      SELECT source_id, 1, target_id || '>' || source_id, strength
      FROM causal_edges
      WHERE target_id IN (${placeholders})
      UNION ALL
      -- 2nd hop
      SELECT
        CASE WHEN ce.source_id = cw.node_id THEN ce.target_id
             ELSE ce.source_id END,
        cw.hop + 1,
        cw.path || '>' || CASE WHEN ce.source_id = cw.node_id
          THEN ce.target_id ELSE ce.source_id END,
        cw.strength * ce.strength * 0.5
      FROM causal_walk cw
      JOIN causal_edges ce
        ON ce.source_id = cw.node_id OR ce.target_id = cw.node_id
      WHERE cw.hop < 2
    )
    SELECT DISTINCT cw.node_id, MIN(cw.hop) as min_hop,
           MAX(cw.strength) as max_strength
    FROM causal_walk cw
    WHERE cw.node_id NOT IN (${placeholders})
    GROUP BY cw.node_id
    ORDER BY max_strength DESC
    LIMIT ?
  `).all(
    ...seedIds, ...seedIds, ...seedIds, limit
  ) as Array<{ node_id: string; min_hop: number; max_strength: number }>;

  // Fetch memory details for discovered neighbors
  const results: GraphSearchResult[] = [];
  for (const n of neighbors) {
    const memId = parseInt(n.node_id, 10);
    if (!Number.isFinite(memId)) continue;

    const mem = db.prepare(
      'SELECT id, title, spec_folder FROM memory_index WHERE id = ?'
    ).get(memId) as { id: number; title: string; spec_folder: string } | undefined;

    if (!mem) continue;

    results.push({
      id: mem.id,
      score: n.max_strength * (1 / n.min_hop),
      source: 'graph',
      title: mem.title,
      graphSource: 'causal',
      traversalDepth: n.min_hop,
      spec_folder: mem.spec_folder,
    });
  }

  return results;
}
```

### 5.3 Skill Graph Cache

The SGQS graph builder performs synchronous filesystem I/O. At ~412 nodes and ~627 edges (from the skill graph context data), a full rebuild takes ~50-150ms -- far too slow for a 45ms query budget.

**Solution: Warm cache at server startup, invalidate on filesystem watch.**

```typescript
interface SkillGraphCache {
  graph: SkillGraph | null;
  builtAt: number;
  nodeIndex: Map<string, string[]>; // term -> node IDs (inverted index)
}

class SkillGraphCacheManager {
  private cache: SkillGraphCache = {
    graph: null,
    builtAt: 0,
    nodeIndex: new Map(),
  };
  private skillRoot: string;
  private TTL_MS = 300_000; // 5 minutes

  constructor(skillRoot: string) {
    this.skillRoot = skillRoot;
  }

  /** Build graph and inverted index. Call at server startup. ~100ms. */
  warmCache(): void {
    const graph = buildSkillGraph(this.skillRoot);
    const nodeIndex = new Map<string, string[]>();

    for (const [nodeId, node] of graph.nodes) {
      const terms = extractNodeSearchTerms(node);
      for (const term of terms) {
        const existing = nodeIndex.get(term) || [];
        existing.push(nodeId);
        nodeIndex.set(term, existing);
      }
    }

    this.cache = { graph, builtAt: Date.now(), nodeIndex };
  }

  /** Get cached graph, rebuilding if stale. */
  getGraph(): SkillGraph | null {
    if (!this.cache.graph || Date.now() - this.cache.builtAt > this.TTL_MS) {
      this.warmCache();
    }
    return this.cache.graph;
  }

  getNodeIndex(): Map<string, string[]> {
    this.getGraph(); // Ensure fresh
    return this.cache.nodeIndex;
  }
}

function extractNodeSearchTerms(node: GraphNode): string[] {
  const terms: string[] = [];
  const props = node.properties as Record<string, unknown>;

  // Node name and title
  if (typeof props.name === 'string') {
    terms.push(...props.name.toLowerCase().split(/[-_\s]+/));
  }
  if (typeof props.title === 'string') {
    terms.push(...props.title.toLowerCase().split(/[-_\s]+/));
  }
  if (typeof props.description === 'string') {
    terms.push(...props.description.toLowerCase().split(/\s+/).filter(t => t.length >= 3));
  }

  // Skill name
  terms.push(...node.skill.toLowerCase().split(/[-_]/));

  // Labels
  for (const label of node.labels) {
    terms.push(label.replace(/^:/, '').toLowerCase());
  }

  return [...new Set(terms)].filter(t => t.length >= 2);
}
```

### 5.4 Skill Graph Query Implementation

```typescript
function querySkillGraph(
  cache: SkillGraphCacheManager,
  queryTerms: string[],
  limit: number
): GraphSearchResult[] {
  const graph = cache.getGraph();
  if (!graph) return [];

  const nodeIndex = cache.getNodeIndex();
  const scores = new Map<string, number>();

  // Score each node by term overlap
  for (const term of queryTerms) {
    const normalizedTerm = term.toLowerCase();

    // Exact match in inverted index
    const exactMatches = nodeIndex.get(normalizedTerm) || [];
    for (const nodeId of exactMatches) {
      scores.set(nodeId, (scores.get(nodeId) || 0) + 1.0);
    }

    // Prefix match for partial terms
    for (const [indexTerm, nodeIds] of nodeIndex) {
      if (indexTerm.startsWith(normalizedTerm) && indexTerm !== normalizedTerm) {
        for (const nodeId of nodeIds) {
          scores.set(nodeId, (scores.get(nodeId) || 0) + 0.5);
        }
      }
    }
  }

  if (scores.size === 0) return [];

  // Normalize scores
  const maxScore = Math.max(...scores.values());

  // Convert to results, sorted by score
  const results: GraphSearchResult[] = [];
  const sorted = [...scores.entries()].sort((a, b) => b[1] - a[1]);

  for (const [nodeId, rawScore] of sorted.slice(0, limit)) {
    const node = graph.nodes.get(nodeId);
    if (!node) continue;

    const props = node.properties as Record<string, unknown>;
    results.push({
      id: `skill:${nodeId}`,
      score: maxScore > 0 ? rawScore / maxScore : 0,
      source: 'graph',
      title: (props.title as string) || (props.name as string) || nodeId,
      graphSource: 'skill',
      traversalDepth: 0,
      skill: node.skill,
      labels: node.labels,
      path: node.path,
    });
  }

  return results;
}
```

---

## 6. Constraints & Limitations

### 6.1 Zero Schema Changes

The constraint is ZERO SQLite schema changes. This means:
- Cannot add new tables for cross-graph edges
- Cannot add columns to `causal_edges` or `memory_index`
- Cross-graph edges MUST be computed at query time or stored in-memory

**Impact:** Cross-graph edges (DESCRIBES, IMPLEMENTS, GOVERNS) cannot be persisted in SQLite. They must be inferred dynamically or stored in an in-memory structure that rebuilds at startup.

### 6.2 ID System Incompatibility

Causal graph uses numeric-as-string IDs (`"42"`). Skill graph uses path IDs (`"system-spec-kit/nodes/memory-system"`). The RRF fusion system deduplicates by `id` field.

**Impact:** Graph results from the skill graph cannot be deduplicated against memory results from vector/FTS/BM25 channels because they use different ID systems. This is actually acceptable -- skill graph results are SUPPLEMENTARY knowledge that should appear alongside, not replace, memory results.

### 6.3 Performance Budget

Total pipeline: 120ms. Graph channel: 45ms.

| Operation | Budget | Implementation |
|-----------|--------|----------------|
| Query term extraction | 2ms | Regex split + stopword filter |
| Causal graph query | 20ms | SQLite recursive CTE (indexed) |
| Skill graph query | 15ms | In-memory Map lookup (cached) |
| Score normalization | 3ms | Array sort + min-max |
| Headroom | 5ms | Safety margin |
| **Total** | **45ms** | |

---

## 7. Integration Patterns

### 7.1 Cross-Graph Edge Discovery

Since we cannot persist cross-graph edges in SQLite, we use **heuristic bridging** at query time:

**Strategy: Keyword Overlap Bridging**

When a causal graph result (memory document) and a skill graph result share significant keyword overlap, they are implicitly linked. Rather than materializing cross-graph edges, we let RRF convergence bonuses reward documents that appear in both the causal and skill graph result sets.

For explicit bridging in the future (when schema changes are allowed):

```typescript
/**
 * Cross-graph bridge discovery (batch, runs at startup or periodically).
 * Matches skill graph node properties against memory document metadata.
 */
function discoverCrossGraphEdges(
  db: Database.Database,
  skillGraph: SkillGraph
): UnifiedEdge[] {
  const bridges: UnifiedEdge[] = [];

  for (const [nodeId, node] of skillGraph.nodes) {
    const props = node.properties as Record<string, unknown>;
    const nodeName = ((props.name as string) || '').toLowerCase();
    const nodeTitle = ((props.title as string) || '').toLowerCase();

    if (!nodeName && !nodeTitle) continue;

    // Find memories whose title or trigger_phrases contain the skill node name
    const searchTerm = nodeName || nodeTitle;
    const matches = db.prepare(`
      SELECT id, title FROM memory_index
      WHERE title LIKE ? OR trigger_phrases LIKE ?
      LIMIT 5
    `).all(`%${searchTerm}%`, `%${searchTerm}%`) as Array<{
      id: number; title: string
    }>;

    for (const mem of matches) {
      bridges.push({
        source: `skill:${nodeId}`,
        target: `mem:${mem.id}`,
        type: 'describes',
        weight: 0.6,
      });
    }
  }

  return bridges;
}
```

### 7.2 Wiring into the Pipeline

The single integration point is `context-server.ts:566`:

```typescript
// BEFORE (current):
hybridSearch.init(database, vectorIndex.vectorSearch);

// AFTER (proposed):
const skillGraphCache = new SkillGraphCacheManager(skillRoot);
skillGraphCache.warmCache();
const graphSearchFn = createUnifiedGraphSearchFn(database, skillGraphCache);
hybridSearch.init(database, vectorIndex.vectorSearch, graphSearchFn);
```

This is the ONLY production code change required for basic graph integration. Everything else is additive (new module).

---

## 8. Implementation Guide

### 8.1 New File Structure

```
mcp_server/lib/search/
  unified-graph.ts      # NEW: Main module with createUnifiedGraphSearchFn
  skill-graph-cache.ts  # NEW: SkillGraphCacheManager
  graph-query-causal.ts # NEW: queryCausalGraph()
  graph-query-skill.ts  # NEW: querySkillGraph()
```

### 8.2 Adaptive Graph Weights by Intent

The current `INTENT_WEIGHT_PROFILES` in `adaptive-fusion.ts` needs extension. The new `graphWeight` and `graphCausalBias` control how much the graph channel contributes and which sub-graph is favored.

```typescript
const EXTENDED_INTENT_PROFILES: Record<string, ExtendedFusionWeights> = {
  understand: {
    semanticWeight: 0.55,
    keywordWeight: 0.15,
    recencyWeight: 0.10,
    graphWeight: 0.20,        // High: exploration benefits from graph
    graphCausalBias: 0.3,     // Favor skill graph (knowledge structure)
  },
  find_spec: {
    semanticWeight: 0.50,
    keywordWeight: 0.15,
    recencyWeight: 0.10,
    graphWeight: 0.25,        // Very high: specs are well-connected
    graphCausalBias: 0.7,     // Favor causal graph (spec chains)
  },
  fix_bug: {
    semanticWeight: 0.35,
    keywordWeight: 0.35,
    recencyWeight: 0.20,
    graphWeight: 0.10,        // Low: bugs need exact matches
    graphCausalBias: 0.8,     // Favor causal graph (error chains)
  },
  find_decision: {
    semanticWeight: 0.40,
    keywordWeight: 0.20,
    recencyWeight: 0.10,
    graphWeight: 0.30,        // Very high: decisions form chains
    graphCausalBias: 0.9,     // Strongly favor causal (decision lineage)
  },
  add_feature: {
    semanticWeight: 0.40,
    keywordWeight: 0.25,
    recencyWeight: 0.15,
    graphWeight: 0.20,        // Medium: features reference prior work
    graphCausalBias: 0.5,     // Balanced
  },
  refactor: {
    semanticWeight: 0.45,
    keywordWeight: 0.25,
    recencyWeight: 0.10,
    graphWeight: 0.20,        // Medium: refactoring needs structure
    graphCausalBias: 0.4,     // Slight skill graph favor (patterns)
  },
};
```

**Rationale:**

| Intent | graphWeight | graphCausalBias | Why |
|--------|------------|----------------|-----|
| `understand` | 0.20 | 0.3 (skill) | Exploration queries benefit from knowledge graph structure |
| `find_spec` | 0.25 | 0.7 (causal) | Specs have strong causal chains (spec->plan->tasks) |
| `fix_bug` | 0.10 | 0.8 (causal) | Bug fixes need exact keyword matches, minimal graph |
| `find_decision` | 0.30 | 0.9 (causal) | Decisions form causal chains, strongest graph signal |
| `add_feature` | 0.20 | 0.5 (balanced) | Features reference both skills and prior decisions |
| `refactor` | 0.20 | 0.4 (skill) | Refactoring benefits from pattern knowledge |

### 8.3 Graph Weight Application in hybridSearchEnhanced

The graph weight from adaptive fusion must be applied to the graph channel's RRF list:

```typescript
// In hybridSearchEnhanced(), after collecting graph results:
if (useGraph && graphSearchFn) {
  const graphResults = graphSearchFn(query, { limit, specFolder });
  if (graphResults.length > 0) {
    lists.push({
      source: 'graph',
      results: graphResults,
      weight: adaptiveResult.weights.graphWeight || 0.15,
    });
  }
}
```

The `graphCausalBias` controls the internal balance within `createUnifiedGraphSearchFn` -- how many results come from causal vs skill graph:

```typescript
const causalLimit = Math.ceil(limit * graphCausalBias);
const skillLimit = limit - causalLimit;
```

---

## 9. Code Examples

### 9.1 Server Startup Integration

```typescript
// In context-server.ts, server initialization:

import { SkillGraphCacheManager } from './lib/search/skill-graph-cache';
import { createUnifiedGraphSearchFn } from './lib/search/unified-graph';

// During startup (after database init):
const skillRoot = path.join(DEFAULT_BASE_PATH, '.opencode', 'skill');
const skillGraphCache = new SkillGraphCacheManager(skillRoot);

console.error('[context-server] Warming skill graph cache...');
skillGraphCache.warmCache();
console.error(`[context-server] Skill graph cached: ${skillGraphCache.getStats()}`);

const graphSearchFn = createUnifiedGraphSearchFn(database, skillGraphCache);
hybridSearch.init(database, vectorIndex.vectorSearch, graphSearchFn);
```

### 9.2 Complete Factory Function

```typescript
export function createUnifiedGraphSearchFn(
  db: Database.Database,
  skillGraphCache: SkillGraphCacheManager
): GraphSearchFn {

  return function unifiedGraphSearch(
    query: string,
    options: Record<string, unknown>
  ): Array<Record<string, unknown>> {
    const limit = Math.min((options.limit as number) || 10, 20);
    const specFolder = options.specFolder as string | undefined;
    const causalBias = (options.graphCausalBias as number) || 0.5;
    const startTime = Date.now();

    const queryTerms = query
      .toLowerCase()
      .split(/\s+/)
      .filter(t => t.length >= 2 && !STOP_WORDS.has(t));

    if (queryTerms.length === 0) return [];

    const causalLimit = Math.max(1, Math.ceil(limit * causalBias));
    const skillLimit = Math.max(1, limit - causalLimit);

    // Query causal graph (SQLite, ~20ms)
    const causalResults = queryCausalGraph(db, queryTerms, specFolder, causalLimit);

    // Budget check: only query skill graph if time remains
    const elapsed = Date.now() - startTime;
    let skillResults: GraphSearchResult[] = [];
    if (elapsed < 35) {
      skillResults = querySkillGraph(skillGraphCache, queryTerms, skillLimit);
    }

    // Merge and normalize
    const merged = [...causalResults, ...skillResults];
    if (merged.length === 0) return [];

    const maxScore = Math.max(...merged.map(r => r.score));
    return merged
      .map(r => ({ ...r, score: maxScore > 0 ? r.score / maxScore : 0 }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  };
}

const STOP_WORDS = new Set([
  'the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or',
  'but', 'in', 'with', 'to', 'for', 'of', 'from', 'by', 'as',
  'it', 'this', 'that', 'be', 'are', 'was', 'were', 'do', 'does',
  'did', 'has', 'have', 'had', 'not', 'no', 'can', 'will',
]);
```

---

## 10. Testing & Debugging

### 10.1 Test Strategy

| Test Category | What to Test | Method |
|---------------|-------------|--------|
| Unit: Graph Cache | Cache warmup, TTL expiry, rebuild | vitest mock filesystem |
| Unit: Causal Query | Seed finding, CTE traversal, scoring | vitest with in-memory SQLite |
| Unit: Skill Query | Inverted index matching, scoring | vitest with mock SkillGraph |
| Integration: Factory | Full pipeline: query -> causal + skill -> merged | vitest with real SQLite |
| Performance: Budget | 45ms budget adherence | vitest with large datasets |
| E2E: Pipeline | Graph results appear in hybridSearchEnhanced output | vitest with full pipeline |

### 10.2 Diagnostic Checklist

```
[ ] graphSearchFn is not null after init
[ ] Causal graph has edges (check with getGraphStats())
[ ] Skill graph cache is warm (check nodeCount > 0)
[ ] Graph results appear in RRF fusion output (check sources array)
[ ] Graph weight is non-zero in adaptive fusion profile
[ ] Performance stays under 45ms for graph channel
[ ] Convergence bonus triggers when graph + other source agree
```

---

## 11. Performance

### 11.1 Performance Budget Analysis

**Current pipeline (without graph):**
- Vector search: ~30-50ms
- FTS5: ~5-10ms
- BM25: ~5-10ms
- RRF fusion: ~2-5ms
- Total: ~42-75ms

**With graph channel (target):**
- Vector search: ~30-50ms (unchanged, parallel)
- FTS5: ~5-10ms (unchanged)
- BM25: ~5-10ms (unchanged)
- **Graph channel: ~25-40ms**
  - Keyword extraction: 1-2ms
  - Causal CTE query: 15-25ms (SQLite recursive CTE, indexed)
  - Skill graph lookup: 5-10ms (in-memory Map)
  - Normalization: 1-2ms
- RRF fusion: ~3-6ms (one more list)
- Total: ~68-116ms (within 120ms budget)

### 11.2 Optimization Strategies

1. **Lazy graph channel**: Skip graph query entirely when `graphWeight < 0.05` for the detected intent
2. **Early termination**: If causal query returns `limit` results with high scores, skip skill graph
3. **Prepared statements**: Pre-compile SQLite CTE query at factory creation time
4. **Result cap**: Hard limit of 20 graph results to bound normalization cost

---

## 12. Security

### 12.1 Input Validation

- Query terms must be sanitized before SQLite LIKE (escape `%`, `_`)
- Skill graph node IDs are filesystem paths -- validate against path traversal
- Graph results must have score clamped to [0, 1] range

### 12.2 Data Protection

- No sensitive data exposed through graph traversal
- Cross-graph bridges use title matching only, not content
- Memory importance tiers respected (constitutional memories not exposed differently)

---

## 13. Maintenance

### 13.1 Upgrade Paths

**Phase 1 (Current design):** Zero schema changes. In-memory cross-graph edges. Heuristic bridging.

**Phase 2 (Future):** Add `graph_bridges` table to SQLite schema. Persist cross-graph edges. Add periodic batch job to refresh bridges.

**Phase 3 (Future):** Real-time graph updates on memory save. Skill graph watches filesystem. Bridge edges created on memory indexing.

### 13.2 Compatibility

- Backward compatible: `graphSearchFn = null` still works (no graph results)
- Feature flag: `SPECKIT_GRAPH_SEARCH` env var controls enablement
- Graceful degradation: If skill graph cache fails, causal-only results

---

## 14. API Reference

### 14.1 Public API Surface

| Function | Signature | Purpose |
|----------|-----------|---------|
| `createUnifiedGraphSearchFn` | `(db, cache) => GraphSearchFn` | Factory for the graph search callback |
| `SkillGraphCacheManager` | `class(skillRoot)` | Cached skill graph with inverted index |
| `queryCausalGraph` | `(db, terms, folder, limit) => GraphSearchResult[]` | Causal edge traversal |
| `querySkillGraph` | `(cache, terms, limit) => GraphSearchResult[]` | Skill graph keyword search |

### 14.2 Configuration

| Env Variable | Default | Purpose |
|-------------|---------|---------|
| `SPECKIT_GRAPH_SEARCH` | `true` | Enable/disable graph channel |
| `SPECKIT_GRAPH_CACHE_TTL` | `300000` | Skill graph cache TTL (ms) |
| `SPECKIT_GRAPH_BUDGET_MS` | `40` | Graph channel time budget |

---

## 15. Troubleshooting

### 15.1 Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Graph results never appear | `graphSearchFn` not passed to `init()` | Verify `context-server.ts` passes 3rd arg |
| Slow graph queries (>45ms) | Skill graph cache expired, rebuilding | Check `SPECKIT_GRAPH_CACHE_TTL` |
| Only causal results, no skill | Skill root path incorrect | Verify `skillRoot` exists |
| No causal results | `causal_edges` table empty | Run `memory_causal_stats()` |
| Graph weight always 0 | Adaptive fusion not using graph weights | Check `ExtendedFusionWeights` integration |

---

## 16. Acknowledgements

### Evidence Sources

| Source | Grade | Used For |
|--------|-------|----------|
| `hybrid-search.ts` source | A | Pipeline structure, GraphSearchFn type |
| `rrf-fusion.ts` source | A | GRAPH_WEIGHT_BOOST, fuseResultsMulti |
| `adaptive-fusion.ts` source | A | FusionWeights interface, intent profiles |
| `causal-edges.ts` source | A | CausalEdge interface, traversal |
| `co-activation.ts` source | A | spreadActivation algorithm |
| `sgqs/types.ts` source | A | SkillGraph, GraphNode interfaces |
| `sgqs/graph-builder.ts` source | A | buildSkillGraph, filesystem scanning |
| `graph-enrichment.ts` source | A | Current SGQS integration point |
| `context-server.ts:566` | A | init() call site (graph=null) |
| `causal-boost.ts` source | A | Post-fusion causal boosting |
| `intent-classifier.ts` source | A | Intent types and keywords |

---

## 17. Appendix & Changelog

### A. File Reference Table

| File | Absolute Path | Role |
|------|--------------|------|
| hybrid-search.ts | `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts` | Pipeline orchestrator |
| rrf-fusion.ts | `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/rrf-fusion.ts` | RRF fusion engine |
| adaptive-fusion.ts | `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/adaptive-fusion.ts` | Intent-aware fusion |
| causal-edges.ts | `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts` | Causal graph storage |
| co-activation.ts | `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts` | Spreading activation |
| causal-boost.ts | `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts` | Post-fusion causal boosting |
| causal-graph.ts | `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts` | MCP handler for causal tools |
| sgqs/types.ts | `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/sgqs/types.ts` | SGQS type definitions |
| sgqs/graph-builder.ts | `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/sgqs/graph-builder.ts` | Skill graph construction |
| sgqs/executor.ts | `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/sgqs/executor.ts` | SGQS query executor |
| graph-enrichment.ts | `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/memory/graph-enrichment.ts` | Index-time enrichment |
| intent-classifier.ts | `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts` | Query intent classification |
| context-server.ts | `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts` | Server entry point |

### B. Relationship to Existing causal-boost.ts

The `causal-boost.ts` module and the proposed unified graph search are COMPLEMENTARY, not competing:

| Aspect | causal-boost.ts | Unified Graph Search |
|--------|----------------|---------------------|
| **When** | POST-fusion (after RRF) | PRE-fusion (input to RRF) |
| **What** | Boosts scores of results that have causal neighbors | Discovers new results via graph traversal |
| **Effect** | Re-ranks existing results | Adds NEW results to the candidate pool |
| **Scope** | Causal graph only | Both causal + skill graph |

Both should coexist. The unified graph search adds graph-discovered documents to the RRF candidate pool, then causal-boost further amplifies results that have strong causal connections.

### C. Changelog

| Date | Change |
|------|--------|
| 2026-02-20 | Initial research complete |
