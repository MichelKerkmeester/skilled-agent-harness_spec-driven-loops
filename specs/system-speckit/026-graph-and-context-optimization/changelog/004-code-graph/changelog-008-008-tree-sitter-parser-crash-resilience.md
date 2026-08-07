---
title: "Changelog: Tree-sitter parser resilience [008-real-world-usefulness-test-planning/008-tree-sitter-parser-crash-resilience]"
description: "Chronological changelog for the Tree-sitter parser resilience phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-15

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/008-real-world-usefulness-test-planning/008-tree-sitter-parser-crash-resilience` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/008-real-world-usefulness-test-planning`

### Summary

The broad-scope code_graph_scan now completes cleanly across 9,300+ files. The bash B1 cascade that previously corrupted parser memory after about 80 throws no longer fires. Parser-error rate dropped from about 17.5% to 0.72%, a >24x improvement.

### Added

- Schema v5 parser_skip_list table in code-graph-db.ts with columns for file_path, error_class, last_seen_at, attempt_count, and last_success_at.
- parser-skip-list.ts module exporting addToSkipList, lookupSkipList, recordSuccess, getSkipListSummary, and seedFromProduction; default seed backfills 70 production B1 paths from parse_diagnostics.
- Pre-parse skip-list lookup in tree-sitter-parser.ts with B1/B2 catch handling that upserts into the skip-list and emits ParseFailure.
- parserSkipList summary and parserHealth surfaced in code_graph_status responses.
- parserSkipList.added and parserSkipList.healed deltas surfaced in code_graph_scan responses.
- Decision-record.md documents which hypothesis is supported by strongest evidence and the discriminating signal.

### Changed

- Broad-scope crash cohort captured by re-running code_graph_scan with agents+commands+specs+plugins=all.
- Database migration from v4 to v5 with backfill from existing parse_diagnostics rows.
- Self-heal policy set to manual review only; files stay on the skip-list until quarterly operator review.
- Live broad-scope scan returns status ok with 0.72% parser-error rate and zero B2 events.
- Skills-only regression check returns zero parser errors.

### Fixed

- Bash B1 cascade that previously corrupted parser memory after ~80 throws no longer fires.
- Parser-error rate dropped from ~17.5% to 0.72% across 9,300+ files, a >24x improvement.
- Hypothesis A (version mismatch) ruled out: stack is WASM-only, not native binding.
- Hypothesis B (WASM grammar bug) confirmed: bash WASM symbol fault identified as root cause.
- Hypothesis C (content-specific patterns) closed as non-primary.

### Verification

- npm run build - PASS, exit 0
- vitest parser-skip-list.vitest.ts - PASS, 13 of 13 cases
- vitest full code_graph suite - PASS, 293 of 293 cases, previously 280 with 13 new cases
- bash validate.sh --strict - PASS, 0 errors and 0 warnings
- Live driver status - PASS, schemaVersion=5, parserHealth='ok', parserSkipList.count=70 seed
- Live broad-scope scan - PASS, status: ok, 9,314 of 9,391 files indexed, 0 B2 events, parserHealth stayed ok, 0.72% parse-error rate
- SQLite skip-list state - PASS, 70 seed B1 rows plus 9 runtime B1 rows equals 79 total, 0 B2 rows
- Tasks complete - 21 completed task item(s) recorded

### Files Changed

| File | Action | What changed |
|---|---|---|
| `mcp_server/code_graph/lib/parser-skip-list.ts` | Created | Adds skip-list lookup, write, summary and seed backfill helpers. |
| `mcp_server/code_graph/lib/code-graph-db.ts` | Modified | Bumps schema to v5, adds parser_skip_list and seeds from parse_diagnostics. |
| `mcp_server/code_graph/lib/tree-sitter-parser.ts` | Modified | Adds pre-parse skip-list lookup, B1 and B2 catch handling, env gate and parser health exports. |
| `mcp_server/code_graph/lib/structural-indexer.ts` | Modified | Threads file paths through the parser adapter so skip-list decisions use the current path. |
| `mcp_server/code_graph/handlers/status.ts` | Modified | Surfaces parser skip-list summary and parser health in status responses. |
| `mcp_server/code_graph/handlers/scan.ts` | Modified | Surfaces skip-list scan deltas in scan responses. |
| `mcp_server/code_graph/tests/parser-skip-list.vitest.ts` | Created | Covers skip-list operations, fail-open behavior, migration seeding and quarantine early returns. |
| `mcp_server/code_graph/tests/code-graph-scan.vitest.ts` | Modified | Updates scan mocks for the new skip-list response shape. |
| `mcp_server/code_graph/tests/code-graph-siblings-readiness.vitest.ts` | Modified | Updates readiness mocks for parser skip-list and parser health fields. |

### Follow-Ups

- Crash cohort enumerated with full list of files that fail under broad scope.
- Minimum failing fixtures committed (5-10 standalone .ts files reproducing the crash).
- Hypothesis A bisect outcome recorded with version pins and pass/fail per fixture.
- Hypothesis B WASM-vs-native outcome recorded per fixture.
- R-2 grammar rebuild deferred: web-tree-sitter 0.26.x rejects current vendored WASM artifacts; requires co-bumped grammar rebuild infrastructure.
- Self-heal stays disabled by design; operator workflow is quarterly manual review of runtime skip-list rows.
- Quarantine sentinel clears only through MCP server restart; no programmatic clear endpoint exists.
