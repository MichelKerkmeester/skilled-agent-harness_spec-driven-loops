# Changelog — 014: Infra investigations (memory-DB repaired; graph-churn deferred)

**Shipped**: 2026-05-30
**Commit**: 4b2c5de6a3

## What Changed
- Root-caused memory-DB SQLITE_CONSTRAINT_PRIMARYKEY: corrupted FTS5 shadow (memory_fts_data) after unclean shutdown; AFTER-INSERT trigger hits duplicate shadow rowid, aborting every memory_index insert
- Root-caused graph-metadata last_save_at churn (~634 files): save path invokes graph-metadata refresh with default root (whole .opencode/specs tree including z_archive/z_future) and writes last_save_at unconditionally
- Memory-DB repaired via FTS5 shadow rebuild on a copy then applied live; verified (integrity-check ok, writes succeed, 30670 rows intact, unclean marker cleared)
- Graph-churn code fix deferred (agent idempotency draft builds + passes 41 tests but effectiveness unverified)

## Why
Two live-infra issues degraded the spec-memory subsystem. Memory writes failed due to DB corruption from unclean shutdown. Graph-metadata churn buried real changes in working-tree noise and forced wide manual git scoping on every commit.

## Verification
- Memory-DB root cause: DONE — corrupted FTS5 shadow + detect-only boot probe; matches prior incident
- Graph-churn root cause: DONE — default-root walk + unconditional last_save_at, incl. archives
- Unsanctioned parser edit reverted: DONE — git checkout HEAD -- clean; agent version saved to /tmp
- No other stray code changes: DONE — working tree scan shows only known graph-metadata.json daemon churn
- Fixes applied: PENDING — graph-churn (tooling) + memory-DB (operator-gated)
- validate.sh --strict (this packet): PASS
