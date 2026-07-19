# Iteration 2: Slice 2: spec-kit FTS5/BM25 retrieval layer

## Focus
Slice 2: spec-kit FTS5/BM25 retrieval layer (6 slice files, shared across all seats)

## Per-Seat Contribution
Succeeded: mimo-a, mimo-b, mimo-c | Failed: none

## Merged Findings (relevance-gated at 0.55)
Kept 21 units (12 marginal in [0.40,0.55)); 3 agreement-eligible (>=2 seats), 3 new this iteration.

### Agreement-eligible units
- [3x] `.opencode/skills/system-spec-kit/mcp_server/lib/storage/learned-triggers-schema.ts` :: `migrateLearnedTriggers` (integration_point, rel 0.7) — ALTER TABLE ADD COLUMN DDL; supported by Turso but PRAGMA table_info introspection path differs in libSQL
- [3x] `.opencode/skills/system-spec-kit/mcp_server/lib/storage/learned-triggers-schema.ts` :: `rollbackLearnedTriggers` (integration_point, rel 0.6) — ALTER TABLE DROP COLUMN requires SQLite 3.35.0+; Turso/libSQL supports but verify version compatibility
- [2x] `.opencode/skills/system-spec-kit/mcp_server/lib/search/bm25-index.ts` :: `shouldUseSqliteLexicalEngine` (integration_point, rel 0.9) — Decision function for FTS5 vs in-memory BM25; Turso migration must redirect this to non-FTS5 lexical path

## Coverage
sliceCoverage 0.667 · agreementRate 0.143 · relevanceFloor 0.6 · reuseCatalogCoverage 0
