---
title: "Changelog: Code Graph Q2-C1 - Transient/Fatal Parser Skip-List with Bounded Retry [002-code-graph/007-parser-resilience]"
description: "Chronological changelog for the Code Graph Q2-C1 - Transient/Fatal Parser Skip-List with Bounded Retry phase."
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

> Spec folder: `.opencode/specs/system-code-graph/001-code-graph-core/007-parser-resilience` (Level 1)
> Parent packet: `.opencode/specs/system-code-graph/001-code-graph-core`

### Summary

Parser resilience is implemented in the Code Graph MCP subsystem. The parser skip-list now separates crash cohort from retry policy, so transient failures can retry until their durable `attempt_count` reaches `max_retries`, defaulting to `5` through `SPECKIT_PARSER_SKIP_LIST_MAX_RETRIES`. Fatal entries still skip immediately and stay manual-review-only.

### Added

- A `retry_class` column on `parser_skip_list`, with legacy rows defaulting to fatal.
- Transient and fatal retry policy over the existing durable `attempt_count` budget.
- Error classification at the structural-indexer parse catch, while preserving the empty-node isolation return.
- A configurable max-retry ceiling for transient parse failures.

### Changed

- `lookupSkipList` skips fatal entries and exhausted transient entries, while under-budget transient files stay eligible.
- Exhausted transient entries promote to fatal.
- Ambiguous parser errors fail closed to fatal.

### Fixed

- A transient parser failure no longer creates a permanent skip-list entry on first failure.
- Successful transient reparses clear the skip-list entry.
- Poison-pill isolation still returns an empty-node error result instead of crashing the scan.

### Verification

- Baseline typecheck - PASS: `npm --prefix .opencode/skills/system-code-graph run typecheck`, 0 errors
- Baseline broad related vitest - PASS: 5 files, 137 passed, 1 skipped
- Focused affected vitest - PASS: 3 files, 42 passed
- Final typecheck - PASS: `npm --prefix .opencode/skills/system-code-graph run typecheck`, 0 errors
- Final build - PASS: `npm --prefix .opencode/skills/system-code-graph run build`
- Final broad related vitest - PASS: 5 files, 144 passed, 1 skipped
- Alignment drift - PASS: 158 files scanned, 0 findings
- Strict spec validation - PASS: `validate.sh --strict` on this phase

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/system-code-graph/mcp_server/lib/parser-skip-list.ts` | Modified | Adds retry classes, bounded skip decisions and transient success cleanup |
| `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts` | Modified | Adds the additive `retry_class` column |
| `.opencode/skills/system-code-graph/mcp_server/lib/tree-sitter-parser.ts` | Modified | Feeds crash cohort and retry policy into skip-list handling |
| `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts` | Modified | Classifies fallback parse exceptions before isolated empty-node return |
| `.opencode/skills/system-code-graph/mcp_server/tests/parser-skip-list.vitest.ts` | Modified | Covers transient self-heal, exhaustion, fatal behavior and legacy upgrade |

### Follow-Ups

- No live MCP scan, benchmark, reindex or DB benchmark was run. This was deliberate per user instruction.
- Content-addressed edge endpoints remain out of scope.
- The older shipped record still does not list this parser-resilience work. This phase implements it locally without touching that packet.
