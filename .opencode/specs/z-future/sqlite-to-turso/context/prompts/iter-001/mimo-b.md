## Context
You are one read-only analysis seat in a multi-seat context sweep of the repository at /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public. Gather-subject: SQLite usage surfaces across the system-spec-kit / system-code-graph / system-skill-advisor MCP servers (driver better-sqlite3 ^12.6.2, sqlite-vec ^0.1.7-alpha.2, FTS5, recursive CTEs, pragmas, WAL, daemon single-writer models), oriented at Turso/libSQL migration touchpoints. Turso (Rust SQLite rewrite) lacks FTS5, loadExtension, .pragma(), WITH RECURSIVE, and vector indexes — every construct you find that touches those is migration-relevant.
THIS ITERATION'S SHARED SLICE — analyze ONLY these files:
- .opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts
- .opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts
- .opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts
- .opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-types.ts
- .opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
- .opencode/skills/system-spec-kit/mcp_server/lib/search/db-shard-migration.ts
- .opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts
- .opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts
Known context (do not re-find): none yet — this is iteration 1.
Read-only analysis: do NOT write, edit, or create any files. Use read/grep tools on the slice files only.

## Objective
Your perspective: WRITE PATHS. Find every transactional/write construct in the slice: synchronous transaction wrappers, insert/upsert/delete flows into vec tables, reindex/rebuild flows, shard creation/migration writes, error-recovery on corrupt shards, and any WAL/locking assumptions baked into write sequencing. Return structured findings.

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
1. Read each slice file; locate transaction/write/rebuild/recovery constructs -> candidate list with exact line numbers.
2. For each candidate: classify kind, capture signature + evidence path:line, score relevance -> final findings array.
3. Verify: every finding has exact path + symbol + numeric relevance; output is one valid JSON object with no prose.
