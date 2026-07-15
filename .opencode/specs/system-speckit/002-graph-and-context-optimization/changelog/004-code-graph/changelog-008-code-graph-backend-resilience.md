---
title: "Code Graph Phase 008: Backend Resilience"
description: "15 tasks shipped across 5 backend resilience streams. After implementation, a 10-iteration deep-review found 5 P0 and 12 P1 findings. All were closed in a remediation pass. A follow-up sk-code-opencode audit found 1 P0 and 10 P1 findings. All were closed in a second remediation pass. Test suite at 99.8 percent pass."
trigger_phrases:
  - "phase 008 changelog"
  - "code graph backend resilience"
  - "5 backend streams"
  - "deep review remediation"
  - "sk-code-opencode audit"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-25

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph` (Level 2)
> Parent packet: `002-graph-and-context-optimization/004-code-graph`

### Summary

The code-graph backend needed hardening across five streams: scan idempotence, query timeout protection, error recovery, diagnostic accuracy, and test-isolation robustness. Fifteen tasks were dispatched via cli-codex gpt-5.4 high fast. Build passed after every task.

After the 15-task implementation landed, a 10-iteration deep-review cycle found 5 P0 and 12 P1 findings. The P0s covered: (F-P0-01) a scan that failed mid-indexing left the database in a half-populated state, (F-P0-02) long-running queries had no timeout guard, (F-P0-03) the error-recovery path on SQLite busy errors was a bare retry without exponential backoff, (F-P0-04) parse-diagnostic counts were computed from a stale cache, and (F-P0-05) tool-count aggregation in status responses used a non-atomic read that could race with concurrent scans.

All 5 P0 and 12 P1 findings were closed in a remediation pass via cli-codex. Tests passed. Build passed.

A follow-up sk-code-opencode audit found 1 P0 and 10 P1 additional findings. The P0 was a test-isolation leak where a module-level singleton was not reset between vitest cases. All 11 audit findings were closed in a second remediation pass.

Final state: 99.8 percent test pass rate. All 5 backend resilience streams verified. Two deferred findings remain (test-isolation hardening for copilot-hook-wiring and mtime-based staleness in the incremental scan path).

### Added

- Scan transaction wraparound: mid-indexing failure now rolls back the entire scan
- Query timeout guard with configurable budget via `SPECKIT_GRAPH_QUERY_TIMEOUT_MS` env flag
- Exponential-backoff retry path for SQLite busy errors (3 retries with 100ms, 200ms, 400ms backoff)
- Diagnostic count recomputation from live database on every status call
- Atomic-tool-count aggregation using a materialized view refreshed on scan commit
- Test-isolation `__resetParserHealth()` and `__resetIndexerState()` exports for vitest hardening

### Changed

- Scan pipeline: from sequential-commit to transactional-wraparound
- Query path: from unbounded to timeout-guarded with configurable deadline
- Error-recovery path: from single-retry to exponential-backoff with configurable retry count
- Diagnostic computation: from stale-cache-read to live-database query
- Status-aggregation: from non-atomic read to materialized-view refresh

### Fixed

- Mid-indexing scan failures left the database in a half-populated state. Fixed by transaction wraparound.
- Long-running queries could hang the MCP server. Fixed by configurable timeout guard.
- SQLite busy errors were retried without backoff. Fixed by exponential-backoff with 3 retries.
- Parse-diagnostic counts were stale. Fixed by live-database recomputation.
- Tool-count aggregation raced with concurrent scans. Fixed by materialized-view refresh on commit.

### Verification

- Vitest suite: 99.8 percent pass (one pre-existing failure in copilot-hook-wiring.vitest.ts, out of scope).
- Build (`npm run build`): exit 0 after every task.
- Deep-review: 10 iterations, 5 P0 and 12 P1 findings all closed.
- Sk-code-opencode audit: 1 P0 and 10 P1 findings all closed.
- Transactional-wraparound test: mid-indexing kill confirmed rollback with no partial data.
- Query-timeout test: long-running query confirmed graceful deadline abort.

### Files Changed

| File | What changed |
|------|--------------|
| `code_graph/lib/code-graph-db.ts` | Transactional-wraparound, exponential-backoff retry, materialized-view refresh |
| `code_graph/lib/code-graph-query.ts` | Configurable timeout guard |
| `code_graph/handlers/status.ts` | Atomic tool-count aggregation, live diagnostic recomputation |
| `code_graph/handlers/scan.ts` | Transaction-wraparound integration |
| `code_graph/lib/tree-sitter-parser.ts` | `__resetParserHealth()` export for test isolation |
| `code_graph/lib/structural-indexer.ts` | `__resetIndexerState()` export for test isolation |
| `code_graph/tests/` (multiple files) | Test-isolation hardening across 10+ test files |

### Follow-Ups

- **Test-isolation hardening for copilot-hook-wiring.** The pre-existing copilot-hook-wiring.vitest.ts failure is out of scope for this packet. A follow-up should add the same reset exports to that module.
- **Mtime-based staleness in incremental scan.** The incremental scan path uses `mtime` comparison to skip fresh files. On filesystems with coarse mtime resolution, this can produce false-fresh results. A follow-up should add a content-hash fallback.
