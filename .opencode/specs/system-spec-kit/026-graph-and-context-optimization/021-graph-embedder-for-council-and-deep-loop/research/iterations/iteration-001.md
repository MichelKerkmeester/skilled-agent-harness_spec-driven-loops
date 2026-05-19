# Iteration 001 — Schema Impact and Content Shape

## Files / DBs read

- `.opencode/skills/system-spec-kit/mcp_server/lib/council-graph/council-graph-db.ts:1-567`
  - Schema: council_nodes table with columns: spec_folder, session_id, id, kind, name, artifact_path, content_hash, round_id, metadata, created_at, updated_at
  - Schema: council_edges table with relation-based graph structure
  - Current schema version: 1
  - No embedding column exists

- `.opencode/skills/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:1-548`
  - Schema: coverage_nodes table with columns: spec_folder, loop_type, session_id, id, kind, name, content_hash, iteration, metadata, created_at, updated_at
  - Schema: coverage_edges table with relation-based graph structure
  - Current schema version: 2
  - No embedding column exists

- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/registry.ts:1-136`
  - nomic-embed-text-v1.5 manifest: dim=768, backend='ollama', prefixQuery='search_query: ', prefixDocument='search_document: ', maxInputChars=5000
  - EmbedderAdapter pattern already exists and is reusable

- `.opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/upsert.ts:1-155`
  - Council node kinds: SESSION, ROUND, SEAT, CLAIM, EVIDENCE, DISAGREEMENT, DECISION, RECOMMENDATION
  - name field is required TEXT content for all nodes

- `.opencode/skills/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts:1-191`
  - Coverage node kinds (research): QUESTION, FINDING, CLAIM, SOURCE
  - Coverage node kinds (review): DIMENSION, FILE, FINDING, EVIDENCE, REMEDIATION
  - name field is required TEXT content for all nodes

## Findings

1. **Schema impact is minimal but non-trivial**: Adding an `embedding BLOB` column to both `council_nodes` and `coverage_nodes` tables is straightforward DDL. The column would be nullable (to handle existing rows and embedder failures). Storage cost: 768-dim float32 = 3,072 bytes per node (~3 KB).

2. **Per-node content shape is suitable for embedding**: The `name` field is the primary text payload for both graphs. Based on the node kinds:
   - Council: CLAIM, EVIDENCE, DISAGREEMENT, DECISION, RECOMMENDATION are clearly semantic prose
   - Coverage: QUESTION, FINDING, CLAIM, DIMENSION, FILE, EVIDENCE, REMEDIATION are also semantic prose
   - All node kinds have required `name` TEXT fields
   - Content length is bounded by nomic-embed-text-v1.5's maxInputChars=5000, which should cover most council/coverage node names

3. **Existing embedder infrastructure is directly reusable**: The `lib/embedders/` registry already has nomic-embed-text-v1.5 configured with the correct prefix tokens for text search. The EmbedderAdapter interface is clean and the OllamaAdapter implementation is production-ready.

4. **Database files don't exist yet**: This is a greenfield schema design - no existing data to migrate. The schema versioning system (council_schema_version table, schema_version table) can handle the migration from v1→v2 (council) and v2→v3 (coverage).

5. **No FTS5 currently exists**: Unlike mk-spec-memory which has a hybrid FTS5+vector approach, these graphs are pure structural. Adding embeddings would be the first semantic search capability.

## Updates to research.md

- Created initial research.md with sections: Executive Summary (DEFER pending more investigation), Schema Impact, Per-node Content Shape, Capabilities Unlocked (empty), Cost Analysis (partial), Failure Modes (empty), Reuse vs Duplicate (partial), Query API Design (empty), Operator Config (empty), Comparison to mk-spec-memory (partial), Recommendation (DEFER)

## Open questions for next iter

1. What are the actual operator workflows that would benefit from semantic search? Are there concrete user stories or is this hypothetical?
2. What's the migration strategy for the schema version bump? Is it a simple ALTER TABLE or do we need data backfill?
3. How does the embedder dependency interact with the upsert handlers? Should embedding be synchronous (blocking insert) or async (background job)?
4. What happens if the embedder is unavailable at insert time? Should we fail the insert or store the node without an embedding?
5. Should we add an FTS5 index as well, or just dense embeddings? What's the cost/benefit tradeoff?

## Convergence signal

- new findings vs prior iter: N/A (first iteration)
