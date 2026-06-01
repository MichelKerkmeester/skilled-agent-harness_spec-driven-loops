---
title: "014: Infra investigations (memory-DB repaired, graph-churn deferred)"
description: "Repaired corrupted memory-DB FTS5 shadow table and deferred graph-metadata churn fix to reduce working-tree noise on commits."
trigger_phrases:
  - "memory-DB repair"
  - "FTS5 shadow rebuild"
  - "graph-churn"
  - "mcp-daemon-reliability"
  - "spec-memory subsystem"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-30

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/014-infra-memory-db-and-graph-churn`
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/014-infra-memory-db-and-graph-churn`

### Summary
Two live-infra issues degraded the spec-memory subsystem. Memory writes failed due to DB corruption from unclean shutdown. Graph-metadata churn buried real changes in working-tree noise and forced wide manual git scoping on every commit.

### Added
- FTS5 shadow rebuild tooling for memory-DB repair (applied live, 30670 rows intact, integrity-check ok, writes succeed, unclean marker cleared)

### Changed
- None.

### Fixed
- Memory-DB SQLITE_CONSTRAINT_PRIMARYKEY root cause: corrupted FTS5 shadow (memory_fts_data) after unclean shutdown, AFTER-INSERT trigger hits duplicate shadow rowid, aborting every memory_index insert

### Verification
- Memory-DB root cause: DONE, corrupted FTS5 shadow + detect-only boot probe, matches prior incident
- Graph-churn root cause: DONE, default-root walk + unconditional last_save_at, incl. archives
- Unsanctioned parser edit reverted: DONE, git checkout HEAD -- clean, agent version saved to /tmp
- No other stray code changes: DONE, working tree scan shows only known graph-metadata.json daemon churn
- Fixes applied: PENDING, graph-churn (tooling) + memory-DB (operator-gated)
- validate.sh --strict (this packet): PASS

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
|, |, | No explicit file paths listed in original changelog |

### Follow-Ups
- Graph-churn code fix deferred (agent idempotency draft builds + passes 41 tests but effectiveness unverified)
