---
title: "Token-Budget Truncation Safety: Skip Don't Break, Floor of Three, Progressive Remainder"
description: "Token-budget truncation stopped discarding the overflow remainder and stopped collapsing a five-result set to one. It now skips an oversized entry instead of breaking the loop, floors a minimum of min(limit, 3) results, promotes summaries on overflow even for metadata-only calls, and pages whatever still does not fit through a progressive remainder. Weak low-signal queries get the full budget."
trigger_phrases:
  - "002/016/001 token budget truncation safety changelog"
  - "skip dont break floor of three"
  - "progressive remainder token budget"
  - "five results rendered as one fix"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-17

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/016-search-and-output-intelligence/001-token-budget-truncation-safety` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement`

### Summary

A search that found five good results was rendering only one. The token-budget truncation step had two failure modes. It broke the materialization loop on the first entry that did not fit, so a single large `includeContent` body could swallow the budget and drop every result behind it. And the summary fallback that would have salvaged the overflow only fired when `includeContent` was true, so the common metadata-only call (which passes false) discarded the remainder outright. This phase makes truncation skip an oversized entry and keep going rather than break, floors a minimum of `min(limit, 3)` materialized results so a non-empty search never renders empty, promotes summaries on overflow regardless of `includeContent`, and routes whatever still does not fit through a progressive remainder so callers can page it instead of losing it. Weak and low-signal queries, which used to be assigned the smallest budget tier, now get the full budget so the trim does not start from a starved baseline.

### Added

- `progressive` field on `TruncateToBudgetResult`, carrying the summary layer, the first snippet page and a continuation cursor for the overflow remainder
- `lowSignal` budget path in `dynamic-token-budget.ts` that floors the budget for weak queries instead of assigning the smallest tier

### Changed

- `lib/search/hybrid-search.ts` - `truncateToBudget` now skips an entry that does not fit and continues, enforces the `min(limit, 3)` floor, and emits summaries plus a progressive remainder for whatever exceeds the budget
- `lib/search/dynamic-token-budget.ts` - a low-signal query is no longer pinned to the simple-tier budget

### Fixed

- A metadata-only call no longer discards the overflow remainder
- Truncation no longer breaks the loop on the first oversized entry, so a five-result set is no longer collapsed to one
- A non-empty result set always materializes at least the floor count

### Verification

| Check | Result |
|-------|--------|
| Phase suite | PASS: `token-budget-skip-and-floor.vitest.ts` |
| Touched-surface sweep | PASS: 12 files green including `hybrid-search` and `dynamic-token-budget` |
| Live full-set render | DEFERRED: confirming the original two-word queries render their full set needs a daemon recycle plus the deferred reindex |

### Files Changed

| File | Action |
|------|--------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts` | Modified |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/dynamic-token-budget.ts` | Modified |
| `.opencode/skills/system-spec-kit/mcp_server/tests/token-budget-skip-and-floor.vitest.ts` | Added |

### Follow-Ups

- Live confirmation that the originally weak two-word queries now render the full result set is gated on the daemon recycle and the deferred corpus reindex.
