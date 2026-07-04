---
title: "Changelog: Learning Feedback Loop Repair [016/009-learning-feedback-loop-repair]"
description: "Repaired sixteen correctness bugs across the memory learning and feedback loop and added two gated maintenance tools so the loop learns from real signal instead of stale or double-counted data."
trigger_phrases:
  - "learning feedback loop changelog"
  - "ledger sweep bounds"
  - "memory learned maintenance tools"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-07-04

> Spec folder: `.opencode/specs/system-speckit/028-memory-search-intelligence/016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/009-learning-feedback-loop-repair/` (Level 2)
> Parent packet: `.opencode/specs/system-speckit/028-memory-search-intelligence/016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/`

### Summary

The memory learning loop had sixteen ways to learn the wrong thing and this phase closes all of them. Cache-hit access tracking updates access metadata on the cached search path when a caller opts in, with the production default off. FSRS `last_review` is written in one ISO-8601 UTC format everywhere. The learned-term cap ignores expired terms so a memory whose eight terms are all stale can still learn. Batch learning aggregates in SQL, treats a `query_reformulated` signal as negative and is idempotent. Auto-promotion gained demotion with hysteresis, a per-memory throttle and batched negative-count fetches. All seven feedback ledgers gained age-based sweeps that are dry-run by default and never delete inside an active shadow window. Two new gated `/memory:manage` maintenance tools were added. Shipped in `92bbca7a25`.

### Added

- Two gated `/memory:manage` maintenance tools. `memory_learned_expire` previews how many stale terms would expire and `memory_learned_clear` requires an explicit `confirm: true` before clearing.
- Age-based sweeps for all seven feedback ledgers, dry-run by default with a MIN-timestamp shadow guard.
- Demotion with hysteresis, a per-memory throttle and batched negative-count fetches in auto-promotion.

### Changed

- FSRS `last_review` writes in one ISO-8601 UTC format everywhere, including the missed prediction-error gating site.
- The learned-term cap ignores expired terms.
- Batch learning aggregates in SQL instead of per-row JS, treats `query_reformulated` as negative and is idempotent on re-run.
- Corrections retries are no-ops and undo reverses by delta instead of restoring a stale absolute.
- Shadow-evaluation cycles without query-scoped labels are recorded as unlabeled instead of vanishing.
- True-citation matching needs two or more digits for a bare id and matches anchors on a two-of-three word subset with session-scoped uniqueness.
- The working-memory fix separates the decayed base score from the additive mention boost, so repeated passes no longer re-apply full decay and re-add the boost.

### Fixed

- The quality loop pairs a rejection's `bestContent` with that same attempt's score and stops writing `eval_run_id=0`.
- The prediction-error gate is initialized at server startup so audit rows are written.
- The eval dashboard reads `ablation_latency_*` as lower-is-better.
- FSRS classification decay short-circuits before the hybrid no-decay branch so no memory gets both policies.

### Verification

- `npx tsc --build` exit 0.
- 009 targeted vitest 767 passed, 13 skipped, across 15 files.
- REQ review 12 of 16 on the first pass. Four were remediated and re-verified.
- Seven ledger sweeps proven on injected aged fixtures with the MIN-timestamp shadow guard.
- `trackAccess` production default still off, grep-confirmed.
- `validate.sh --strict` pass.

### Files Changed

- `mcp_server/lib/feedback/batch-learning.ts` carries the batch-learning fixes.
- `mcp_server/lib/search/auto-promotion.ts` adds demotion and hysteresis.
- `mcp_server/lib/cognitive/working-memory.ts` fixes the decay stability.
- `mcp_server/handlers/memory-learned-maintenance.ts` adds the two maintenance tools.

### Follow-Ups

- `trackAccess` production enablement is a deferred operator decision. Assess it against the phase 010 hot-path latency budget before enabling.
- The MCP tool surface grew by two, so any doc stating a fixed tool count is stale. Phase 012 does the doc-alignment.
- Code effects apply on the next daemon-lease restart. No live data was migrated.
