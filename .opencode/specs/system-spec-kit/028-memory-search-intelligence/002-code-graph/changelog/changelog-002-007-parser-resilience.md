---
title: "Changelog: Code Graph Q2-C1 — Transient/Fatal Parser Skip-List with Bounded Retry [002-code-graph/007-parser-resilience]"
description: "Chronological changelog for the Code Graph Q2-C1 — Transient/Fatal Parser Skip-List with Bounded Retry phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-19

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/002-code-graph/007-parser-resilience` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/002-code-graph`

### Summary

Q2-C1 is implemented in the real Code Graph MCP subsystem. The parser skip-list now separates the existing crash cohort (B1 / B2 / OTHER) from a new retry policy axis (transient / fatal). A transient file remains eligible for a later parse until its durable attempt_count reaches max_retries; default is 5 via SPECKIT_PARSER_SKIP_LIST_MAX_RETRIES. A fatal file is skipped immediately and remains manual-review-only.

### Added

- Secure explicit owner sign-off to reverse the "must not auto-unskip / no self-heal" stance for the TRANSIENT class (mcp_server/lib/parser-skip-list.ts) — satisfied by the 2026-06-19 pre-approved implementation request
- Decide the max_retries surface and whether a retry_class column is needed — default 5 via SPECKIT_PARSER_SKIP_LIST_MAX_RETRIES; additive retry_class column added
- Add the transient/fatal axis + max_retries ceiling to the skip-list policy; reuse the durable attempt_count as the budget (mcp_server/lib/parser-skip-list.ts) — REQ-001/002
- Classify the caught error TRANSIENT vs FATAL at the structural-indexer catch before addToSkipList; preserve the empty-node isolation return (mcp_server/lib/structural-indexer.ts) — REQ-004/007
- [P] Declare an additive retry_class column on parser_skip_list (mcp_server/lib/code-graph-db.ts) — additive only, legacy rows default to fatal
- tsc + build pass; focused parser-skip-list / structural-indexer suite green; validate.sh --strict on this folder green — typecheck and broad vitest complete; strict validation to be recorded after doc reconciliation

### Changed

- Confirm the durable attempt_count budget and the prior permanent-skip behavior (mcp_server/lib/parser-skip-list.ts)
- Confirm the parse-error catch + empty-node isolation return (mcp_server/lib/structural-indexer.ts)
- Enumerate the TRANSIENT (WASM OOM / timeout / deadline-abort) vs FATAL error-string mapping; default ambiguous → FATAL (fail-closed) — covered by classifyParserRetryClass
- Capture baseline: typecheck 0 errors; broad related vitest 5 files / 137 passed / 1 skipped before edits
- Make lookupSkipList return "skip" only for FATAL or exhausted-TRANSIENT; a TRANSIENT-under-budget file stays eligible for re-attempt (mcp_server/lib/parser-skip-list.ts) — REQ-001
- Promote an exhausted TRANSIENT (attempt_count >= max_retries) to FATAL (mcp_server/lib/parser-skip-list.ts) — REQ-002

### Fixed

- No fixes recorded.

### Verification

- Baseline typecheck - PASS — npm --prefix .opencode/skills/system-code-graph run typecheck, 0 errors
- Baseline broad related vitest - PASS — 5 files / 137 passed / 1 skipped
- Focused affected vitest - PASS — 3 files / 42 passed
- Final typecheck - PASS — npm --prefix .opencode/skills/system-code-graph run typecheck, 0 errors
- Final build - PASS — npm --prefix .opencode/skills/system-code-graph run build
- Final broad related vitest - PASS — 5 files / 144 passed / 1 skipped
- Alignment drift - PASS — 158 files scanned, 0 findings
- Strict spec validation - PASS — validate.sh --strict on this phase

### Files Changed

_No file-level detail recorded._

### Follow-Ups

- No live MCP scan, benchmark, reindex, or DB benchmark was run. This was deliberate per user instruction.
- Q2-C2 content-addressed edge endpoints remain out of scope.
- The older packet 030 shipped record still does not list Q2-C1; this phase implements it locally without touching packet 030.
