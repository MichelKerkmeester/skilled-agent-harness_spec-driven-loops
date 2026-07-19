# Iteration 8: Slice 8: cross-cutting spec-kit infrastructure databases

## Focus
Slice 8: cross-cutting spec-kit infrastructure databases (6 slice files, shared across all seats)

## Per-Seat Contribution
Succeeded: mimo-a, mimo-b, mimo-c | Failed: none

## Merged Findings (relevance-gated at 0.55)
Kept 35 units (6 marginal in [0.40,0.55)); 7 agreement-eligible (>=2 seats), 7 new this iteration.

### Agreement-eligible units
- [2x] `.opencode/skills/system-spec-kit/mcp_server/lib/session/session-manager.ts` :: `getTableColumns` (dependency, rel 0.9) — PRAGMA table_info via better-sqlite3 .prepare() — Turso lacks .pragma() API; must use db.exec('PRAGMA table_info(...)') or alternative schema introspection.
- [2x] `.opencode/skills/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts` :: `initSessionAnalyticsDb` (dependency, rel 0.95) — Three .pragma() calls (WAL, busy_timeout, foreign_keys) — Turso does not support .pragma() method; must use db.exec('PRAGMA ...') or configure via connection options.
- [2x] `.opencode/skills/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts` :: `hasActiveVectorShard` (dependency, rel 0.95) — PRAGMA database_list for attached shard detection — Turso does not support PRAGMA database_list; must use alternative shard discovery mechanism.
- [2x] `.opencode/skills/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts` :: `getTableColumns` (dependency, rel 0.9) — PRAGMA table_info with attached schema prefix — Turso lacks .pragma() and attached DB introspection; requires complete rework for shard-aware column detection.
- [2x] `.opencode/skills/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts` :: `migrateEmbeddingCacheSchema` (integration_point, rel 0.7) — Multi-step migration with RENAME/INSERT/DROP across attached schemas — Turso supports DDL but attached-schema prefixes must be reworked.
- [2x] `.opencode/skills/system-spec-kit/mcp_server/lib/eval/eval-db.ts` :: `initEvalDb` (dependency, rel 0.95) — Three .pragma() calls (WAL, busy_timeout, foreign_keys) — same blocker as session-analytics-db; Turso requires alternative pragma configuration.
- [2x] `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts` :: `claimRetryCandidate` (integration_point, rel 0.6) — Optimistic locking via conditional UPDATE — standard SQL; Turso compatible.

## Coverage
sliceCoverage 1 · agreementRate 0.200 · relevanceFloor 0.55 · reuseCatalogCoverage 0
