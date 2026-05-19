# Iteration 003 — Vector Similarity Implementation in SQLite

## Files / DBs read

- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:256-1260`
  - Uses sqlite-vec extension for vector similarity operations
  - Loads extension via `sqliteVec.load(database)` at initialization
  - Falls back to "anchor-only mode (no vector search)" if extension unavailable
  - Creates virtual table using `vec0(embedding FLOAT[${dim}])` when extension available
  - Extension provides native vector similarity computation in SQL

- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1-600`
  - References similarity scores but delegates vector operations to pipeline
  - Uses hybrid approach (vector + FTS5 + BM25) for search
  - Handles vector channel unavailability with warnings

## Findings

1. **mk-spec-memory uses sqlite-vec extension**: The memory index relies on the sqlite-vec SQLite extension for vector similarity operations. This is a native extension that provides vector similarity search capabilities within SQL.

2. **Extension loading is conditional**: At database initialization, the code attempts to load sqlite-vec via `sqliteVec.load(database)`. If this fails (extension not installed), it falls back to "anchor-only mode (no vector search)" and logs a warning to install the extension.

3. **vec0 virtual table for vector operations**: When sqlite-vec is available, the code creates a virtual table using `CREATE VIRTUAL TABLE vec_memories USING vec0(embedding FLOAT[${dim}])`. This enables native SQL queries for vector similarity.

4. **New dependency required**: For council/coverage graphs to support semantic search, we would need to add sqlite-vec as a dependency. This contradicts the operator principle of "wide embedder support - reuse nomic-embed-text-v1.5 rather than introduce a new dependency."

5. **Fallback complexity**: The extension approach requires handling two code paths:
   - Extension available: Full vector similarity search via vec0
   - Extension unavailable: Fallback to anchor-only mode (no vector search)
   This adds complexity and deployment overhead.

6. **Alternative approaches have significant drawbacks**:
   - Load vectors into application memory: Doesn't scale, violates "future-proof, hardened, strong, effective over speed"
   - Custom SQL functions: Slow, complex, fragile
   - No native SQLite vector operations: Without extension, must implement similarity in application layer

7. **I'M UNCERTAIN ABOUT THIS**: Whether the sqlite-vec dependency is acceptable given the operator principles. The principle says "reuse nomic-embed-text-v1.5 rather than introduce a new dependency," but sqlite-vec is a different kind of dependency (SQLite extension vs embedder model). It's possible this principle only applies to embedder models, not SQLite extensions.

8. **Installation burden**: The code logs "Install sqlite-vec: brew install sqlite-vec (macOS)" when the extension is unavailable. This adds deployment complexity across different platforms (macOS, Linux, Windows).

## Updates to research.md

- Added "Failure Modes" section with vector extension dependency findings
- Updated "Query API Design" section with sqlite-vec extension requirement
- Added finding that vector similarity requires SQLite extension or application-layer computation

## Open questions for next iter

1. Is the sqlite-vec dependency acceptable under operator principles, or does it violate "reuse rather than introduce new dependency"?
2. Should we pursue a hybrid approach (FTS5 only) that gets 80% of value at 20% cost, avoiding the extension dependency?
3. What's the incremental value of vector similarity over FTS5 for the hypothetical workflows identified in iteration 2?
4. If we add sqlite-vec, do we need it for both council and coverage graphs, or just one?
5. How does the extension loading work in different deployment environments (dev, prod, CI)?

## Convergence signal

- new findings vs prior iter: 8 new findings
- Not converged yet - significant new information about technical implementation challenges
- Major blocker identified: sqlite-vec dependency contradicts operator principles (uncertain interpretation)
