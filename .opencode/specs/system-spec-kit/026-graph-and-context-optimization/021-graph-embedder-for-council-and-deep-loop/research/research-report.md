# Research Report — Council & Deep-Loop Graph Embeddings

## Executive Summary

**STATUS=DONT-BUILD**

After 7 iterations of autonomous deep-research, the recommendation is **DON'T-BUILD** for adding `nomic-embed-text-v1.5` semantic embeddings to council-graph and deep-loop coverage-graph. The investigation revealed no concrete operator or AI agent workflows that would benefit from semantic search. While technically feasible, the feature would violate multiple operator principles and add complexity without clear value.

## Question-by-Question Findings

### 1. Schema impact

**Finding**: Minimal technical impact. Adding an `embedding BLOB` column to both `council_nodes` and `coverage_nodes` tables is straightforward DDL. Storage cost: 768-dim float32 = 3 KB per node. Schema versioning system exists (council v1→v2, coverage v2→v3). No existing data to migrate (databases don't exist yet - greenfield design).

**Evidence**: `.opencode/skills/system-spec-kit/mcp_server/lib/council-graph/council-graph-db.ts:117-175` (schema definition), `.opencode/skills/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:156-218` (schema definition)

### 2. Per-node content shape

**Finding**: The `name` field is the primary text payload for both graphs. Council node kinds (SESSION, ROUND, SEAT, CLAIM, EVIDENCE, DISAGREEMENT, DECISION, RECOMMENDATION) and coverage node kinds (QUESTION, FINDING, CLAIM, SOURCE for research; DIMENSION, FILE, FINDING, EVIDENCE, REMEDIATION for review) are all semantic prose. Content length is bounded by nomic-embed-text-v1.5's maxInputChars=5000, which should cover most node names.

**Evidence**: `.opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/upsert.ts:78-81` (name field required), `.opencode/skills/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts:101-104` (name field required)

### 3. Capabilities unlocked

**Finding**: Hypothetical semantic search workflows (cross-session similarity, near-duplicate detection, finding clustering, dimension retrospectives) are theoretically possible but not currently implemented. No documented operator needs exist for these capabilities. Existing queries are purely structural (coverage gaps, contradictions, provenance chains, convergence blockers).

**Evidence**: `.opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/query.ts:14-19` (query types), `.opencode/skills/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts:20-26` (query types)

### 4. Cost analysis

**Finding**: Storage cost is negligible (3 KB per node). Index time: ~50-100ms per node on MPS. Query time: requires sqlite-vec extension for native SQL vector operations; without extension, must implement in application layer (slow, memory-intensive). No native vector operations in SQLite without extension.

**Evidence**: `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:748-754` (sqlite-vec extension loading)

### 5. Failure modes

**Finding**: Vector extension dependency (sqlite-vec required for native vector similarity). If extension unavailable: fallback to "anchor-only mode (no vector search)". Embedder dependency at insert time: should we fail insert or store node without embedding? Schema migration risks: embedder dimension changes require schema migration. Extension availability changes: graphs created with extension may break if extension removed.

**Evidence**: `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1213-1221` (extension loading with fallback)

### 6. Reuse vs duplicate

**Finding**: Embedder infrastructure already exists (nomic-embed-text-v1.5 configured, adapter pattern clean). Direct import into council/coverage graph modules would work. However, sqlite-vec extension is a new dependency not covered by existing embedder infrastructure.

**Evidence**: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/registry.ts:24-33` (nomic-embed-text-v1.5 manifest)

### 7. Query API design

**Finding**: Technical requirement: sqlite-vec extension must be loaded at database initialization to support vector similarity queries. Proposed query types: `council_graph_semantic_search({ text, top_k, filter })` and `coverage_graph_similarity({ node_id, top_k })`. Implementation would follow mk-spec-memory pattern (vec0 virtual table, distance functions). Integration with existing structural queries unclear.

**Evidence**: `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:491-497` (vec0 virtual table creation)

### 8. Operator config

**Finding**: If semantic search were added, operator config would involve env vars for embedder selection, per-graph opt-in flags, schema-versioned settings, fallback configuration. However, given DON'T-BUILD recommendation, these config details are not implemented.

**Evidence**: Academic analysis based on mk-spec-memory patterns

### 9. Comparison to mk-spec-memory hybrid pattern

**Finding**: mk-spec-memory uses hybrid FTS5 + vector embeddings for human operator search. Council/coverage graphs are AI agent workflow state projections (convergence detection, coverage analysis). Coverage graph specifically serves structural purpose (convergence signals: component count, edge density, answer coverage), not general search. Different use cases suggest different requirements.

**Evidence**: `.opencode/skills/deep-research/feature_catalog/03--convergence/04-graph-convergence.md:12-18` (convergence signals are structural)

### 10. Final verdict

**Finding**: DON'T-BUILD. No concrete operator or AI agent workflows identified. Technically feasible but violates operator principles ("don't build for hypothetical futures", "fix code don't bandaid", "reuse dependencies"). Existing structural queries appear sufficient. Coverage graph serves different purpose than mk-spec-memory (workflow state vs search interface). Adversarial challenge found no valid counterarguments.

**Evidence**: Consistent findings across 7 iterations examining schema, handlers, documentation, AI agent workflows, adversarial arguments, and test files.

## Schema Migration Proposal

**Not applicable** - Recommendation is DON'T-BUILD. No schema migration proposed.

If this recommendation is revisited in the future based on concrete operator needs, the migration would be:

```sql
-- Council graph: schema v1 → v2
ALTER TABLE council_nodes ADD COLUMN embedding BLOB;

-- Coverage graph: schema v2 → v3
ALTER TABLE coverage_nodes ADD COLUMN embedding BLOB;
```

Backfill would be one-shot script over existing rows using nomic-embed-text-v1.5.

## Query API Sketch

**Not applicable** - Recommendation is DON'T-BUILD. No query API proposed.

If this recommendation is revisited in the future based on concrete operator needs, the API would follow mk-spec-memory patterns:

```typescript
// Council graph semantic search
export interface CouncilGraphSemanticSearchArgs {
  specFolder: string;
  sessionId: string;
  text: string;
  topK?: number;
  kindFilter?: CouncilNodeKind[];
}

// Coverage graph similarity
export interface CoverageGraphSimilarityArgs {
  specFolder: string;
  loopType: LoopType;
  sessionId: string;
  nodeId: string;
  topK?: number;
}
```

## Operator Workflows Enabled

**None** - No concrete operator workflows identified that would benefit from semantic search.

Hypothetical workflows (cross-session similarity, near-duplicate detection, finding clustering, dimension retrospectives) are theoretically possible but not requested or needed based on current evidence.

## Caveats

1. **Latent needs**: There may be undocumented operator or AI agent workflows that would benefit from semantic search. Absence of documentation doesn't prove absence of need, but no evidence suggests current struggle with existing structural queries.

2. **Future workflows**: Future AI agent workflows (e.g., cross-session reasoning, duplicate detection) might require semantic search. These would be new workflows, not enhancements to existing ones, and would require concrete justification.

3. **Operator education**: Operators might not know to request semantic search capabilities. However, operator principle "don't build for hypothetical futures" explicitly rejects this reasoning.

4. **Technical evolution**: SQLite vector search capabilities may evolve, reducing the extension dependency. This could change the technical complexity calculation in the future.

## Recommended Next Packets

1. **Solicit operator feedback**: Add feature request mechanism to make it easier for operators to surface latent needs. Ask specifically: "Are operators struggling with current structural query limitations in council/coverage graphs?"

2. **Monitor AI agent workflows**: Monitor deep-research and deep-review evolution for requests for semantic enhancements to coverage graph queries.

3. **Revisit if need emerges**: If concrete operator or AI agent workflow is identified, start with minimal viable experiment (one-shot script) before schema migration.

4. **Consider alternative approaches**: If semantic search need emerges, evaluate FTS5-only approach (80% value at 20% cost) before committing to full embeddings + sqlite-vec extension.

## STATUS=DONT-BUILD

**Verdict**: DON'T-BUILD

**Rationale**: No concrete operator or AI agent workflows identified. Technically feasible but violates multiple operator principles. Existing structural queries appear sufficient. Coverage graph serves different purpose than mk-spec-memory (workflow state vs search interface). Adversarial challenge found no valid counterarguments.

**Confidence**: High - consistent evidence across 7 iterations examining multiple angles (schema, handlers, documentation, AI agent usage, adversarial arguments, test coverage).

**Conditions for revisit**: Revisit only after concrete operator or AI agent workflow is identified that specifically requires semantic search over council/coverage node content.

---

**Generated with [Devin](https://cli.devin.ai/docs)**

**Co-Authored-By: Devin <158243242+devin-ai-integration[bot]@users.noreply.github.com>**