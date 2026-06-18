## Context
You are one read-only analysis seat in a multi-seat context sweep of the repository at /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public. Gather-subject: SQLite usage surfaces across the system-spec-kit / system-code-graph / system-skill-advisor MCP servers (driver better-sqlite3 ^12.6.2, sqlite-vec ^0.1.7-alpha.2, FTS5, recursive CTEs, pragmas, WAL, daemon single-writer models), oriented at Turso/libSQL migration touchpoints. Turso (Rust SQLite rewrite) lacks FTS5, loadExtension, .pragma(), WITH RECURSIVE, and vector indexes — every construct touching those is migration-relevant.
THIS ITERATION'S SHARED SLICE — analyze ONLY these files:
- .opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts
- .opencode/skills/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts
- .opencode/skills/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts
- .opencode/skills/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts
- .opencode/skills/system-spec-kit/mcp_server/lib/storage/consolidation.ts
Known context (do not re-find): Confirmed agreement-eligible units so far (do NOT re-find): learned-triggers-schema.ts::migrateLearnedTriggers; learned-triggers-schema.ts::rollbackLearnedTriggers; reindex.ts::writeVectorsToShard; db-shard-migration.ts::migrateLegacySingleDbToShardSync; vector-index-store.ts::database.exec; vector-index-store.ts::ensure_vector_shard_schema; bm25-index.ts::shouldUseSqliteLexicalEngine; vector-index-store.ts::sqliteVec.load; vector-index-store.ts::vec0; vector-index-store.ts::database.pragma; sweep.ts::sqlite_master.
Focus note: This slice is the lifecycle/maintenance layer: checkpoint create/restore (file copies vs backup API), schema downgrade paths, retention sweeps, consolidation/reconsolidation flows. Watch for VACUUM, backup(), serialize(), file-copy snapshot assumptions, and long transactions.
Read-only analysis: do NOT write, edit, or create any files. Use read/grep tools on the slice files only.

## Objective
Your perspective: MIGRATION RISK. Find every better-sqlite3-specific API coupling point in the slice: .pragma() calls, loadExtension(), prepared-statement idioms (.raw(), .pluck(), .iterate()), synchronous Database constructor options, backup()/serialize(), user-defined functions, recursive CTEs, ATTACH/DETACH — and tag each with which Turso/libSQL gap it exposes. Return structured findings.

## Style
precise, no preamble

## Tone
neutral

## Audience
automated pipeline — output will be parsed directly; prose wrapping around code is harmful

## Response
Return ONLY a JSON object, no surrounding prose, exactly this shape:
{"findings":[{"path":"<repo-relative file path from the slice list>","symbol":"<exact identifier/table name at the evidence line>","kind":"reuse_candidate|integration_point|convention|dependency|gap","signature":"<one-line signature or DDL fragment>","reuse":"extend|compose|wrap|import","evidence":"<repo-relative path>:<line number>","relevance":0.0,"notes":"<one line: why this matters for Turso/libSQL migration>"}]}
Rules: path MUST be exactly one of the slice paths. symbol MUST be the exact identifier at the evidence line. 8-20 findings. relevance = migration impact (1.0 = blocks migration as-is).

---
Pre-plan (lean):
1. Read each slice file; locate migration risk constructs -> candidate list with exact line numbers.
2. For each candidate: classify kind, capture signature + evidence path:line, score relevance -> final findings array.
3. Verify: every finding has exact path + symbol + numeric relevance; output is one valid JSON object with no prose.
