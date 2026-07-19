## Context
You are one read-only analysis seat in a multi-seat context sweep of the repository at /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public. Gather-subject: SQLite usage surfaces across the system-spec-kit / system-code-graph / system-skill-advisor MCP servers (driver better-sqlite3 ^12.6.2, sqlite-vec ^0.1.7-alpha.2, FTS5, recursive CTEs, pragmas, WAL, daemon single-writer models), oriented at Turso/libSQL migration touchpoints. Turso (Rust SQLite rewrite) lacks FTS5, loadExtension, .pragma(), WITH RECURSIVE, and vector indexes — every construct touching those is migration-relevant.
THIS ITERATION'S SHARED SLICE — analyze ONLY these files:
- .opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts
- .opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-queries.ts
- .opencode/skills/system-skill-advisor/mcp_server/lib/daemon/lease.ts
- .opencode/skills/system-skill-advisor/mcp_server/lib/daemon/state-mutation.ts
- .opencode/skills/system-skill-advisor/mcp_server/lib/freshness/sqlite-integrity.ts
Known context (do not re-find): Confirmed agreement-eligible units so far (do NOT re-find): learned-triggers-schema.ts::migrateLearnedTriggers; learned-triggers-schema.ts::rollbackLearnedTriggers; reindex.ts::writeVectorsToShard; db-shard-migration.ts::migrateLegacySingleDbToShardSync; vector-index-store.ts::database.exec; vector-index-store.ts::ensure_vector_shard_schema; bm25-index.ts::shouldUseSqliteLexicalEngine; vector-index-store.ts::sqliteVec.load; vector-index-store.ts::vec0; vector-index-store.ts::database.pragma; code-graph-db.ts::queryStartupHighlights; sweep.ts::sqlite_master.
Focus note: This slice is the system-skill-advisor DB layer: skill-graph storage and queries, the daemon-lease single-writer database (heartbeat-based), state mutations, and sqlite integrity probes. The lease DB is a SEPARATE sqlite file with its own concurrency assumptions.
Read-only analysis: do NOT write, edit, or create any files. Use read/grep tools on the slice files only.

## Objective
Your perspective: MIGRATION RISK. Find every better-sqlite3-specific API coupling point in the slice: .pragma() calls, loadExtension(), prepared-statement idioms (.raw(), .pluck(), .iterate()), synchronous Database constructor options, backup()/serialize(), user-defined functions, recursive CTEs, ATTACH/DETACH — and tag each with which Turso/libSQL gap it exposes. Return structured findings.
Regardless of perspective, ALWAYS also include the slice's top driver-coupling constructs — every .pragma() call site, transaction wrapper, virtual-table DDL, and extension load you encounter — using the construct's exact symbol name. These anchor cross-seat agreement.

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
