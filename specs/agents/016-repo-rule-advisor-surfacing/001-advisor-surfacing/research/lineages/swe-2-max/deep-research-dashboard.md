---
title: "Deep Research Dashboard - swe-2-max lineage"
trigger_phrases: []
---
# Deep Research Dashboard - swe-2-max lineage

**Session:** `fanout-swe-2-max-1791116504576-gieznv` · **Executor:** `cli-devin / swe-2-max` · **Stop policy:** `max-iterations (max 4)` — **REACHED**

_Reducer-style dashboard for the detached lineage; all writes are bounded to this directory._

## Status

- Phase init: complete.
- Main loop: complete, 4/4 iterations recorded.
- Synthesis: complete.
- Stop reason: `maxIterationsReached`.
- Direct artifact binding: `config.fanout_lineage_artifact_dir`; `resolveArtifactRoot` skipped.
- Parent spec writeback, continuity/memory save, shared telemetry, and git staging: skipped by boundary.

## Iteration Table

| run | focus | newInfoRatio | findings | status |
|-----|-------|--------------|----------|--------|
| 1 | Current Gate 5 delivery path, rule corpus inventory, and prior settled decisions | 0.92 | 9 | complete |
| 2 | Candidate (a) advisor-brief pointer and candidate (b) trigger-index corpus inclusion | 0.85 | 11 | complete |
| 3 | Candidate (c) PreToolUse advisory, candidate (d) no new surface, federation portability | 0.80 | 14 | complete |
| 4 | Cross-candidate verification, coverage partition, final matrix and verdict inputs | 0.55 | 9 | complete |

## Question Status

**Addressed:** 8/8 research questions · **Bounded-unknown:** 1 (Gate-5 miss rate — no telemetry exists)

- [x] How rules reach the model today (Gate 5 + §8 loader + resident floor — designed partition).
- [x] Candidate (a) emission/cost/silence — refuse.
- [x] Candidate (b) emission/cost/silence — refuse (recorded-decision reversal).
- [x] Candidate (c) emission/cost/silence — strong form admissible, gated on measurement.
- [x] Candidate (d) — verdict.
- [x] Federation portability — measured live on sibling checkout.
- [x] Per-turn context costs — code-measured for all candidates.
- [x] Prior work respected/overturned — all respected, zero overturned.

## Verdict (summary)

No new model-facing surface. The one admissible build is a once-per-session first-mutation `additionalContext` reminder (the Gate-3 marker pattern), gated on a measured Gate-5 miss or operator risk acceptance. The real fragility is CI-side: no check that trigger rows cover rule fires.

## Convergence Trend

- Last 4 `newInfoRatio`: `[0.92, 0.80, 0.80, 0.55]` (iteration values 0.92/0.85/0.80/0.55).
- Rolling average: `0.78`.
- Threshold: `0.05`.
- Direction: descending but above threshold; convergence was telemetry only under `max-iterations` policy.
- Decision: ran all 4 configured iterations and synthesized at the max-iterations boundary.
