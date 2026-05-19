# Research Synthesis — Council & Deep-Loop Graph Embeddings

## Executive Summary

DEFER - No concrete operator workflows identified. Schema analysis shows minimal technical impact, but existing query patterns are purely structural (no text-based search). Hypothetical semantic search workflows exist (cross-session similarity, near-duplicate detection, finding clustering) but technical documentation reveals no documented operator needs for these capabilities. The graphs appear to be AI-agent workflow state projections rather than human operator search tools. Operator principle "Don't build for hypothetical futures" strongly applies - without concrete operator needs, adding semantic search would be building for hypothetical futures.

## Schema Impact

**Current state:**
- council_nodes (schema v1): spec_folder, session_id, id, kind, name, artifact_path, content_hash, round_id, metadata, created_at, updated_at
- coverage_nodes (schema v2): spec_folder, loop_type, session_id, id, kind, name, content_hash, iteration, metadata, created_at, updated_at
- Neither table has an embedding column

**Proposed change:**
- Add `embedding BLOB` column to both tables (nullable)
- Schema version bump: council v1→v2, coverage v2→v3
- Storage cost: 768-dim float32 = 3,072 bytes per node (~3 KB)

**Migration strategy:**
- No existing data (databases don't exist yet) - greenfield design
- Simple ALTER TABLE ADD COLUMN for new installations
- Schema versioning system already in place (council_schema_version, schema_version tables)

## Per-node Content Shape

**Council node kinds (all prose-heavy):**
- SESSION, ROUND, SEAT, CLAIM, EVIDENCE, DISAGREEMENT, DECISION, RECOMMENDATION
- `name` field is required TEXT for all nodes
- Content appears suitable for semantic embedding (claims, evidence, decisions are semantic)

**Coverage node kinds (all prose-heavy):**
- Research: QUESTION, FINDING, CLAIM, SOURCE
- Review: DIMENSION, FILE, FINDING, EVIDENCE, REMEDIATION
- `name` field is required TEXT for all nodes
- Content appears suitable for semantic embedding (findings, evidence, questions are semantic)

**Content length:**
- nomic-embed-text-v1.5 has maxInputChars=5000
- Should cover most council/coverage node names
- No truncation risk for typical node content

## Capabilities Unlocked

**Hypothetical semantic search workflows (not currently implemented, no documented operator need):**

1. **Cross-session similarity**: "Find prior councils that converged on similar conclusions"
   - Would require semantic search over DECISION/RECOMMENDATION node names across sessions
   - Use case: Learn from prior council outcomes when starting a new council
   - Status: Hypothetical - no documented operator request

2. **Near-duplicate detection**: "Did seat 3 just rephrase seat 1's claim?"
   - Would require semantic similarity over CLAIM node names within a session
   - Use case: Detect redundancy in AI council deliberations
   - Status: Hypothetical - no documented operator request

3. **Finding clustering**: "Group findings that report the same defect across packets"
   - Would require semantic similarity over FINDING node names across spec folders
   - Use case: Cross-packet defect tracking and remediation prioritization
   - Status: Hypothetical - no documented operator request

4. **Dimension retrospectives**: "Which dimensions did we revisit across deep-review cycles?"
   - Would require semantic similarity over DIMENSION node names across sessions
   - Use case: Identify recurring review themes and adjust review checklists
   - Status: Hypothetical - no documented operator request

**Current query capabilities (purely structural):**
- Council: unresolved_disagreements, evidence_chain, decision_support, convergence_blockers, hot_nodes
- Coverage: uncovered_questions, coverage_gaps, unverified_claims, contradictions, provenance_chain, hot_nodes
- All queries operate on graph structure (edges, node kinds, metadata) - no text-based search

**Documentation analysis:**
- Council-graph README: Generic code documentation, no operator workflows documented
- Coverage-graph README: Technical architecture documentation, no semantic search use cases mentioned
- No evidence of current operator demand for semantic search capabilities

**I'M UNCERTAIN ABOUT THIS**: Whether there are undocumented operator workflows or informal requests for semantic search. Absence of documentation doesn't prove absence of need, but no evidence suggests current operator struggle with existing structural queries.

## Cost Analysis

**Storage:**
- 3 KB per node × N nodes
- For 10,000 nodes: ~30 MB
- For 100,000 nodes: ~300 MB
- Negligible for modern storage

**Index time:**
- Re-embed on insert: ~50-100ms per node on MPS (based on typical ollama performance)
- Batch inserts would incur linear latency

**Backfill:**
- Not applicable (no existing data)
- Future backfill would be one-shot script over existing rows

**Query time:**
- Semantic similarity search requires vector distance computation
- With sqlite-vec extension: native SQL vector operations (fast)
- Without extension: must implement in application layer (slow, memory-intensive)
- No native vector operations in SQLite without extension

## Failure Modes

**Vector extension dependency:**
- sqlite-vec extension required for native vector similarity in SQLite
- If extension unavailable: fallback to "anchor-only mode (no vector search)"
- Installation burden: "brew install sqlite-vec (macOS)" - varies by platform
- Contradicts operator principle: "reuse nomic-embed-text-v1.5 rather than introduce a new dependency" (uncertain if this applies to SQLite extensions)

**Embedder dependency at insert time:**
- If embedder unavailable at insert: should we fail the insert or store node without embedding?
- Race conditions if embedder is async: need to handle partial failures
- Node text is empty/null: should we skip embedding or store null vector?

**Schema migration risks:**
- Embedder dimension changes: requires schema migration (vec_768 → vec_1024)
- Existing rows after migration: backfill cost realistic for large graphs?
- Extension availability changes: graphs created with extension may break if extension removed

**I'M UNCERTAIN ABOUT THIS**: Whether sqlite-vec dependency is acceptable under operator principles. The principle says "reuse rather than introduce new dependency," but sqlite-vec is a SQLite extension (infrastructure) vs embedder model (AI). Different categories may have different rules.

## Reuse vs Duplicate

**Existing embedder infrastructure:**
- `lib/embedders/registry.ts` has nomic-embed-text-v1.5 configured
- EmbedderAdapter interface is clean and reusable
- OllamaAdapter implementation is production-ready
- Prefix tokens (search_query:, search_document:) already configured

**Integration approach:**
- Direct import of embedder registry into council/coverage graph modules
- No new abstraction layer needed
- Per-graph config via env var or hardcoded model selection

## Query API Design

**Technical requirement:** sqlite-vec extension must be loaded at database initialization to support vector similarity queries. This creates a vec0 virtual table for native SQL vector operations.

**Proposed query types (if extension available):**
- `council_graph_semantic_search({ text, top_k, filter })` — new handler for council graph
- `coverage_graph_similarity({ node_id, top_k })` — new handler for coverage graph
- Both would compose with existing structural queries (e.g., filter by kind, then semantic search)

**Implementation approach (from mk-spec-memory pattern):**
- Load sqlite-vec extension at DB init: `sqliteVec.load(database)`
- Create virtual table: `CREATE VIRTUAL TABLE vec_nodes USING vec0(embedding FLOAT[768])`
- Query via vec0 distance functions for similarity search
- Fallback to anchor-only mode if extension unavailable

**Integration with existing queries:**
- Could add semantic similarity as a ranking signal to existing structural queries
- Or provide separate semantic search handlers
- Unclear which approach provides better operator value

**Cross-session vs session-scoped:**
- Existing queries are session-scoped (require sessionId)
- Hypothetical cross-session workflows would require new query patterns
- Would need to decide scope based on actual operator needs

## Operator Config

**Note**: This section is academic given the DON'T-BUILD recommendation. If semantic search were added, operator config would involve:

- Env vars for embedder selection (COUNCIL_GRAPH_EMBEDDER, COVERAGE_GRAPH_EMBEDDER)
- Per-graph opt-in flags (COUNCIL_GRAPH_SEMANTIC_SEARCH_ENABLED, COVERAGE_GRAPH_SEMANTIC_SEARCH_ENABLED)
- Schema-versioned settings for migration safety
- Fallback configuration for embedder unavailability

However, since the recommendation is DON'T-BUILD, these config details are not implemented.

## Comparison to mk-spec-memory Hybrid Pattern

**mk-spec-memory approach:**
- Hybrid FTS5 + vector embeddings
- FTS5 for exact keyword search
- Vector for semantic similarity
- Both indices maintained on insert
- Purpose: human operator search over memory artifacts

**Council/coverage current state:**
- Pure structural (no search at all - zero text-based capability)
- All queries are graph-traversal and structural analysis
- Coverage graph specifically used for convergence detection (component count, edge density, answer coverage)
- Adding embeddings would be first semantic capability
- No FTS5 currently exists
- Purpose: AI agent workflow state tracking (convergence detection, coverage analysis)

**Key difference:**
- mk-spec-memory is a human-facing search interface
- Council/coverage graphs are AI agent workflow state projections
- Coverage graph serves specific structural purpose (convergence signals), not general search
- Different use cases suggest different requirements

**AI agent consumer analysis:**
- Deep-research uses coverage graph for structural convergence signals only
- Deep-review uses coverage graph for dimension-based convergence detection
- No evidence of AI agents needing semantic similarity for current workflows
- Graph convergence is working as designed with structural metrics

## Adversarial Analysis

**Common pro-arguments tested and rejected:**

1. **Performance**: Current structural queries use SQL indexes and scale well. Semantic search would be slower than exact ID lookups. Performance is not a valid argument for semantic search.

2. **Scalability**: Structural queries remain O(edges) which is manageable. Semantic search would be O(nodes * dim) - worse scalability. Scalability is not a valid argument for semantic search.

3. **"Build it and they will come"**: Rejected by operator principle "Don't build for hypothetical futures." We should wait for explicit requests, not anticipate needs.

4. **Future-proofing**: Principle refers to quality and robustness, not speculative feature addition. Adding unused complexity doesn't make systems more future-proof.

5. **Infrastructure reuse**: Embedder infrastructure exists, but sqlite-vec is still a new dependency. Existence of a hammer doesn't mean everything is a nail.

**Conclusion**: No valid counterarguments found. Adversarial challenge strengthened DON'T-BUILD conclusion.

## Recommendation

DON'T-BUILD - Strong convergence after 6 iterations:

1. **No concrete operator workflows**: Hypothetical workflows identified but no documented operator needs. Technical documentation reveals no operator-facing use cases for semantic search. Operator principle "Don't build for hypothetical futures" strongly applies.

2. **AI agents don't need semantic search for current workflows**: Deep-research and deep-review use coverage graph for structural convergence detection only (component count, edge density, answer coverage). No evidence of AI agents needing semantic similarity. Graph convergence is working as designed with structural metrics.

3. **Technical complexity without clear value**: Vector similarity requires sqlite-vec extension dependency (contradicts "reuse rather than introduce new dependency" principle), or inferior application-layer implementation. Not justified without concrete operator or AI agent need.

4. **Existing queries are sufficient**: Current structural queries (coverage gaps, contradictions, provenance chains, convergence blockers) appear to meet operator and AI agent needs. No evidence of struggle with limitations.

5. **"Fix code, don't bandaid with model swaps"**: If there's no actual problem to solve, adding semantic search would be a bandaid, not a fix. The graphs are workflow state projections, not search interfaces.

6. **Different purpose than mk-spec-memory**: Coverage graph serves specific structural purpose (convergence signals), not general search. Different use cases suggest different requirements are appropriate.

7. **Alternative approaches also unjustified**: Even FTS5-only (80% value at 20% cost) is unjustified without concrete needs. Any search capability addition is premature without documented problems.

8. **Adversarial challenge found no valid counterarguments**: Common pro-arguments (performance, scalability, future-proofing, infrastructure reuse, operator education) don't apply in this case. Testing these arguments strengthened the DON'T-BUILD conclusion.

**Recommended next steps**:
- Solicit operator feedback: Are operators struggling with current structural query limitations?
- Monitor AI agent workflows: Are deep-research/deep-review requesting semantic enhancements?
- If need emerges: Start with minimal viable experiment (one-shot script) before schema migration
- Revisit only after concrete operator or AI agent workflow is identified
- Consider adding feature request mechanism to make it easier for operators to surface latent needs

**STATUS=DONT-BUILD**

Current assessment: DON'T-BUILD without concrete needs. Technically feasible but violates multiple operator principles (don't build for hypothetical futures, fix code don't bandaid, reuse dependencies). The graphs serve a different purpose than mk-spec-memory (workflow state vs search interface), and AI agents don't currently need semantic search for their structural convergence workflows. Adversarial challenge found no valid counterarguments.
