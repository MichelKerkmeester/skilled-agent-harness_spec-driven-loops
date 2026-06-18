# Iteration 7: Slice 7: system-skill-advisor DB and lease layer

## Focus
Slice 7: system-skill-advisor DB and lease layer (5 slice files, shared across all seats)

## Per-Seat Contribution
Succeeded: mimo-a, mimo-b, mimo-c | Failed: none

## Merged Findings (relevance-gated at 0.55)
Kept 40 units (6 marginal in [0.40,0.55)); 5 agreement-eligible (>=2 seats), 5 new this iteration.

### Agreement-eligible units
- [2x] `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts` :: `db.pragma` (dependency, rel 1) — better-sqlite3 .pragma() API has no direct Turso equivalent; busy_timeout and foreign_keys must be set via PRAGMA statements or connection options; wal_checkpoint(FULL) may not be available.
- [2x] `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts` :: `ensureVecTableForDim` (gap, rel 1) — sqlite-vec virtual tables (vec0 module) require loadExtension() which Turso does not support; this blocks vector embedding storage entirely.
- [2x] `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts` :: `database.exec` (dependency, rel 0.7) — better-sqlite3 .exec() is synchronous multi-statement; Turso JS driver uses async .execute() or .batch() for multi-statement execution.
- [2x] `.opencode/skills/system-skill-advisor/mcp_server/lib/daemon/lease.ts` :: `ensureSchema` (integration_point, rel 0.9) — PRAGMA journal_mode = WAL inside .exec() multi-statement; Turso libSQL may reject PRAGMA in batch/execute or handle differently.
- [2x] `.opencode/skills/system-skill-advisor/mcp_server/lib/freshness/sqlite-integrity.ts` :: `checkSqliteIntegrity` (integration_point, rel 0.9) — PRAGMA quick_check on readonly handle; Turso embedded may not support quick_check or fileMustExist option.

## Coverage
sliceCoverage 1 · agreementRate 0.125 · relevanceFloor 0.6 · reuseCatalogCoverage 0.6
