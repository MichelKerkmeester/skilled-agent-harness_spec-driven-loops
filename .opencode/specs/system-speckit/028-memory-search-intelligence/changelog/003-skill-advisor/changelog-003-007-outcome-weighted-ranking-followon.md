---
title: "Changelog: Skill Advisor Outcome-Weighted Ranking Follow-On"
description: "Chronological changelog for the Skill Advisor outcome-weighted ranking follow-on phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/003-skill-advisor/007-outcome-weighted-ranking-followon` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/003-skill-advisor`

### Summary

The stale planning-only summary is corrected: this phase delivered a shadow-only implementation. It added a distinct execution-success record, a durable append-only skill-outcome store, an idempotent out-of-process fold tick, a shadow outcome-weighted rerank, query-scored failure-mode recall and a default-off BM25 calibration seam. The live fused sort remains byte-identical by test. The remaining gates are the undecided runtime signal that fires the emitter and wiring the rerank adapter to the shared Beta primitive, which the sibling reliability phase has now shipped. Live promotion remains a no-go until real execution-success data and benchmark evidence exist.

### Added

- Added a skill execution-outcome record distinct from recommendation acceptance.
- Added the append-only skill-outcome store, replay-safe fold and query-scored failure-mode recall.
- Added an out-of-process fold-tick runner for cron or maintenance use.
- Added a shadow outcome-weighted rerank module with neutral fresh-skill reliability.
- Added query-length BM25 calibration behind a default-off flag.
- Added unit coverage for record distinction, fold idempotence, ambient tick behavior, live-sort identity and BM25 bucket selection.

### Changed

- Kept outcome weighting shadow-only and off the live recommend path.
- Kept BM25 calibration telemetry-only while the BM25 lane remains shadow-weighted.
- Updated the phase record from planning-only to shadow-only implemented with external gates pending.

### Fixed

- Separated execution-success evidence from recommendation-acceptance evidence.
- Made store folding replay-safe and double-tick safe.
- Proved the shadow rerank cannot change live fused order.

### Verification

| Check | Result |
|-------|--------|
| Typecheck | PASS, 0 errors |
| New unit tests | PASS, 20 of 20 |
| Broad scorer suite | PASS, 15 files, 109 tests |
| Broad regression suite | 0 new failures, 181 pass with 2 baseline failures unchanged |
| Live-sort guardrail | PASS, byte-identical with and without store data |
| Comment hygiene | PASS |
| Strict validation | PASS, 0 errors and 0 warnings |

### Files Changed

| File | Action | What changed |
|---|---|---|
| `spec.md` | Updated | Shadow-only implementation and pending gates |
| `plan.md` | Updated | Emitter, store, tick, rerank and BM25 sequence |
| `tasks.md` | Updated | Implemented tasks checked, external gates left open |
| `checklist.md` | Updated | Verification evidence |
| `decision-record.md` | Updated | Live-promotion no-go |
| `implementation-summary.md` | Updated | Corrected closeout |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/metrics.ts` | Modified | Skill execution-outcome record and validator |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/skill-outcome-store.ts` | Created | Durable store, fold, recall and tick core |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/outcome-weighted-rerank.ts` | Created | Shadow rerank and Beta adapter seam |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/bm25.ts` | Modified | Query-length midpoint flag |
| `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill-outcome-fold-tick.mjs` | Created | Out-of-process fold runner |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/outcome-weighted-ranking.vitest.ts` | Created | End-to-end shadow guardrail coverage |

### Follow-Ups

- Decide which runtime post-task signal fires the execution-success emitter.
- Wire the shared Beta posterior primitive, now landed in the sibling reliability phase, into the rerank adapter.
- Benchmark with real execution-success data before any live rerank or default promotion.

## 2026-07-01

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/003-skill-advisor/007-outcome-weighted-ranking-followon` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/003-skill-advisor`

### Summary

A deep-history correction to the prior drift-audit record: `skill-outcome-store.ts` (364 lines) and `outcome-weighted-rerank.ts` (124 lines) were built at commit `03d0b01eb6` and wired live-adjacent at `09626fc921`, then deleted at commit `8efcde0e6b`. The measured result at deletion was an MRR delta of +0.005 to +0.008 against the metric's own noise band of SD 0.0237 (4x larger) and a right-skill@3 of 0.000 across all 90 runs, recorded in the delete commit as "structurally inert despite being fully wired." Of the four related features corrected in the same audit, this is the strongest negative result. The operator explicitly decided not to revive it.

### Fixed

- Corrected a prior drift-audit pass-1 finding that stated this code "was never committed." Git history disproves that claim: both files were committed, wired live-adjacent and measured before being deleted for cause. This entry replaces that record with the verified history.

### Follow-Ups

- No revival planned. The question is closed.
