## Context
You are one read-only analysis seat in a multi-seat context sweep of the repository at /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public. Gather-subject: SQLite usage surfaces across the system-spec-kit / system-code-graph / system-skill-advisor MCP servers (driver better-sqlite3 ^12.6.2, sqlite-vec ^0.1.7-alpha.2, FTS5, recursive CTEs, pragmas, WAL, daemon single-writer models), oriented at Turso/libSQL migration touchpoints. Turso (Rust SQLite rewrite) lacks FTS5, loadExtension, .pragma(), WITH RECURSIVE, and vector indexes — every construct touching those is migration-relevant.
THIS ITERATION'S SHARED SLICE — analyze ONLY these files:
- .opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-types.ts
- .opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
- .opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts
- .opencode/skills/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts
- .opencode/skills/system-spec-kit/mcp_server/lib/chunking/anchor-chunker.ts
- .opencode/skills/system-spec-kit/mcp_server/lib/storage/statediff.ts
- .opencode/skills/system-spec-kit/mcp_server/lib/storage/idempotency-receipts.ts
- .opencode/skills/system-spec-kit/mcp_server/lib/storage/near-duplicate.ts
- .opencode/skills/system-code-graph/mcp_server/lib/close-db-assertion.ts
- .opencode/skills/system-code-graph/mcp_server/lib/canonical-db-dir.ts
Known context (do not re-find): Confirmed agreement-eligible units (do NOT re-find): reindex.ts::writeVectorsToKnn; bm25-index.ts::isMemoryFtsAvailable; db-shard-migration.ts::canonical.exec; db-shard-migration.ts::copyShardPayloadTable; checkpoints.ts::memory_fts delete-all; checkpoints.ts::memory_fts rebuild; checkpoints.ts::restoreCheckpointV2; checkpoints.ts::VACUUM active_vec INTO; checkpoints.ts::VACUUM main INTO; learned-triggers-schema.ts::memory_fts; learned-triggers-schema.ts::migrateLearnedTriggers; learned-triggers-schema.ts::rollbackLearnedTriggers; reindex.ts::writeVectorsToShard; db-shard-migration.ts::migrateLegacySingleDbToShardSync; vector-index-store.ts::database.exec; vector-index-store.ts::ensure_vector_shard_schema; lease.ts::ensureSchema; sqlite-integrity.ts::checkSqliteIntegrity; bm25-index.ts::shouldUseSqliteLexicalEngine; embedding-cache.ts::migrateEmbeddingCacheSchema; retry-manager.ts::claimRetryCandidate; code-graph-db.ts::Database; session-analytics-db.ts::db.pragma; reindex.ts::sqliteVec.load; eval-db.ts::db.pragma; memory-retention-sweep.ts::memory_fts; db-shard-migration.ts::sqliteVec.load; vector-index-queries.ts::vec_distance_cosine; vector-index-schema.ts::bm25; vector-index-schema.ts::CREATE VIRTUAL TABLE memory_fts USING fts5; vector-index-schema.ts::memory_fts; vector-index-store.ts::sqliteVec.load; vector-index-store.ts::vec_distance_cosine; checkpoints.ts::memory_fts; checkpoints.ts::VACUUM active_vec INTO; checkpoints.ts::VACUUM main INTO; schema-downgrade.ts::createFtsArtifacts; skill-graph-db.ts::db.pragma; vector-index-store.ts::vec0; session-analytics-db.ts::initSessionAnalyticsDb.
Focus note: FINAL sweep: these files produced no above-gate findings in earlier iterations. Some may genuinely have no direct SQLite coupling — for such a file, emit ONE finding with kind convention, symbol = the module top-level export, relevance 0.6, and notes stating: no direct SQLite/driver coupling; migration-neutral. Do not invent constructs.
Read-only analysis: do NOT write, edit, or create any files. Use read/grep tools on the slice files only.

## Objective
Your perspective: WRITE PATHS. Find every transactional/write construct in the slice: synchronous transaction wrappers, insert/upsert/delete flows, rebuild/sweep flows, error-recovery writes, and WAL/locking assumptions baked into write sequencing. Return structured findings.
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
1. Read each slice file; locate write paths constructs -> candidate list with exact line numbers.
2. For each candidate: classify kind, capture signature + evidence path:line, score relevance -> final findings array.
3. Verify: every finding has exact path + symbol + numeric relevance; output is one valid JSON object with no prose.
