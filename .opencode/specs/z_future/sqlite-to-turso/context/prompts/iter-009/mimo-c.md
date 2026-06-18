## Context
You are one verification seat in a multi-seat re-confirmation pass over the repository at /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public. Earlier sweeps produced the candidate findings below about SQLite/better-sqlite3 usage that only ONE analyst reported. Each needs independent verification against the actual source.
CANDIDATE UNITS TO VERIFY (read each file at the stated symbol):
1. path=.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts | symbol=writeVectorsToKnn | kind=integration_point | claim: Transaction-wrapped vec0 virtual table writes (delete+insert per row) — blocks Turso migration entirely
2. path=.opencode/skills/system-spec-kit/mcp_server/lib/search/bm25-index.ts | symbol=isMemoryFtsAvailable | kind=integration_point | claim: FTS5 gate: determines whether SQLite FTS5 or in-memory BM25 is used; Turso migration must replace this with alternative lexical engine detec
3. path=.opencode/skills/system-spec-kit/mcp_server/lib/search/db-shard-migration.ts | symbol=canonical.exec | kind=integration_point | claim: ATTACH/DETACH used for 3-database migration (legacy→canonical→shard); Turso has no ATTACH — requires architectural redesign
4. path=.opencode/skills/system-spec-kit/mcp_server/lib/search/db-shard-migration.ts | symbol=copyShardPayloadTable | kind=integration_point | claim: Creates vec0 virtual table in attached shard and copies rows — Turso has no vec0, no ATTACH, no loadExtension
5. path=.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts | symbol=memory_fts delete-all | kind=integration_point | claim: FTS5 'delete-all' command. Turso/libSQL lacks FTS5; this must be reimplemented with external search or alternative FTS.
6. path=.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts | symbol=memory_fts rebuild | kind=integration_point | claim: FTS5 'rebuild' command used in post-restore derived artifact rebuilds. FTS5 not available in Turso.
7. path=.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts | symbol=restoreCheckpointV2 | kind=integration_point | claim: v2 restore is entirely file-copy based (rename live→backup, copy snapshot→live); Turso remote DB cannot fs.copyFileSync — needs API-level re
8. path=.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts | symbol=VACUUM active_vec INTO | kind=integration_point | claim: VACUUM INTO on attached database (active_vec). Turso lacks ATTACH and VACUUM INTO; vector shard snapshot needs complete reimplementation.
9. path=.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts | symbol=VACUUM main INTO | kind=integration_point | claim: VACUUM INTO is SQLite-specific; Turso/libSQL does not support it. Checkpoint creation must use alternative serialization (e.g., file copy or
10. path=.opencode/skills/system-spec-kit/mcp_server/lib/storage/learned-triggers-schema.ts | symbol=memory_fts | kind=integration_point | claim: FTS5 virtual table existence probe; Turso lacks FTS5 — this check and all memory_fts consumers must be replaced or gated
11. path=.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts | symbol=Database | kind=dependency | claim: Direct better-sqlite3 driver import; Turso uses @libsql/client — every call site in this module couples to the synchronous better-sqlite3 AP
12. path=.opencode/skills/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts | symbol=db.pragma | kind=dependency | claim: Three .pragma() calls; libSQL lacks .pragma() method — must use db.exec('PRAGMA ...') or connection string params
13. path=.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts | symbol=sqliteVec.load | kind=dependency | claim: loadExtension in reindex shard writer; Turso blocks extension loading — reindex cannot populate vec0 KNN table
14. path=.opencode/skills/system-spec-kit/mcp_server/lib/eval/eval-db.ts | symbol=db.pragma | kind=dependency | claim: Three .pragma() calls; libSQL has no .pragma() API — requires exec-based pragma or connection config
15. path=.opencode/skills/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts | symbol=memory_fts | kind=dependency | claim: FTS5 optimize command after bulk deletes; Turso has no FTS5 — must remove or replace
16. path=.opencode/skills/system-spec-kit/mcp_server/lib/search/db-shard-migration.ts | symbol=sqliteVec.load | kind=dependency | claim: loadExtension during shard migration; Turso blocks extension loading — migration logic cannot create vec0 tables
17. path=.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts | symbol=vec_distance_cosine | kind=dependency | claim: sqlite-vec scalar function used in every vector search query (also lines 403, 407); Turso has no vec_distance_cosine — must compute external
18. path=.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts | symbol=bm25 | kind=dependency | claim: FTS5 bm25() ranking function with per-column weights. No equivalent in Turso — requires external BM25 implementation.
19. path=.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts | symbol=CREATE VIRTUAL TABLE memory_fts USING fts5 | kind=dependency | claim: FTS5 virtual table + 3 sync triggers; Turso lacks FTS5 — full-text search must use external engine or Turso's FTS alternative
20. path=.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts | symbol=memory_fts | kind=dependency | claim: FTS5 virtual table for BM25 full-text search. Turso lacks FTS5 — must use external search engine or Turso's native text search.
21. path=.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts | symbol=vec_distance_cosine | kind=dependency | claim: sqlite-vec distance function for KNN queries. Must be reimplemented if Turso lacks vec extension support.
22. path=.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts | symbol=memory_fts | kind=dependency | claim: FTS5 delete-all command; Turso/libSQL has no FTS5 — must replace with external search or Trigram/other index
23. path=.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts | symbol=VACUUM active_vec INTO | kind=dependency | claim: VACUUM INTO on attached shard — Turso cannot attach databases or VACUUM INTO; snapshot strategy must change entirely
24. path=.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts | symbol=VACUUM main INTO | kind=dependency | claim: VACUUM INTO is a SQLite-specific snapshot mechanism; Turso/libSQL lacks this — must replace with serialize()/file-copy or Turso snapshot API
25. path=.opencode/skills/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts | symbol=createFtsArtifacts | kind=dependency | claim: Full FTS5 virtual table creation with content-sync triggers and rebuild; Turso has no FTS5 or loadExtension — blocks schema downgrade path
26. path=.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts | symbol=db.pragma | kind=gap | claim: Turso/libSQL has no .pragma() method; busy_timeout must be set via connection config or PRAGMA SQL statement if supported
27. path=.opencode/skills/system-code-graph/mcp_server/lib/recovery-procedures.ts | symbol=DB_TRIPLET | kind=gap | claim: WAL triplet file model (.sqlite + .sqlite-wal + .sqlite-shm); Turso uses remote replicas — all triplet copy/move/restore logic becomes obsol
28. path=.opencode/skills/system-code-graph/mcp_server/lib/recovery-procedures.ts | symbol=db.pragma | kind=gap | claim: integrity_check pragma is local SQLite; Turso has no embedded integrity check — recovery procedure CG-RP-001 must be redesigned
29. path=.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts | symbol=retryEmbedding | kind=gap | claim: vec_memories is a vec0 virtual table (sqlite-vec) — Turso/libSQL has NO vector index support; this is a migration blocker requiring alternat
30. path=.opencode/skills/system-spec-kit/mcp_server/lib/search/causal-boost.ts | symbol=causal_walk | kind=gap | claim: Recursive CTE with bidirectional UNION seed + UNION ALL recursive step traversing causal_edges up to MAX_HOPS(2). Turso lacks WITH RECURSIVE
31. path=.opencode/skills/system-spec-kit/mcp_server/lib/search/causal-boost.ts | symbol=getNeighborBoosts | kind=gap | claim: Core recursive CTE for graph traversal with bidirectional edges and relation-weighted scoring. Turso lacks WITH RECURSIVE — must rewrite as 
32. path=.opencode/skills/system-spec-kit/mcp_server/lib/search/causal-boost.ts | symbol=WITH RECURSIVE causal_walk | kind=gap | claim: Recursive CTE for graph traversal (2-hop). Turso lacks WITH RECURSIVE — must be replaced with iterative application-side traversal or bounde
33. path=.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts | symbol=memory_fts | kind=gap | claim: FTS5 virtual table for BM25 full-text search — Turso/libSQL lacks FTS5; entire FTS search path blocks migration
34. path=.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts | symbol=VACUUM main INTO | kind=gap | claim: VACUUM INTO is the core v2 checkpoint snapshot mechanism; Turso/libSQL lacks this — blocks checkpoint creation as-is
35. path=.opencode/skills/system-spec-kit/mcp_server/lib/storage/memo.ts | symbol=dependents | kind=gap | claim: Recursive CTE for transitive dependency closure. Turso lacks WITH RECURSIVE; collectDependents() and wouldCreateCycle() both depend on this.
36. path=.opencode/skills/system-spec-kit/mcp_server/lib/storage/memo.ts | symbol=WITH RECURSIVE dependents | kind=gap | claim: Recursive CTE for transitive dependency closure (cycle detection + invalidation). Turso lacks WITH RECURSIVE — must rewrite as iterative BFS
Read-only analysis: do NOT write, edit, or create any files.

## Objective
For EACH candidate: open the file, locate the symbol, and decide CONFIRMED (construct exists and the claim is accurate) or REFUTED (symbol absent, claim wrong, or migration-irrelevant). Echo path, symbol, and kind VERBATIM from the candidate list for confirmed units — exact echo is required for cross-seat matching. For refuted units, set kind to gap and prefix notes with REFUTED:.

## Style
precise, no preamble

## Tone
neutral

## Audience
automated pipeline — output will be parsed directly; prose wrapping around code is harmful

## Response
Return ONLY a JSON object, no surrounding prose, exactly this shape:
{"findings":[{"path":"<verbatim from candidate>","symbol":"<verbatim from candidate>","kind":"<verbatim from candidate, or gap when refuting>","signature":"<one-line actual signature found>","reuse":"","evidence":"<path>:<actual line number>","relevance":0.0,"notes":"<CONFIRMED: why accurate | REFUTED: why wrong>"}]}
Rules: one entry per candidate (all 36). relevance = your own migration-impact score after reading the code.

---
Pre-plan (lean):
1. For each candidate, read the file around the symbol; verify existence + claim accuracy.
2. Emit one finding per candidate with verbatim path/symbol/kind (or kind=gap if refuted) + actual evidence line.
3. Verify: output is one valid JSON object, 36 findings, no prose.
