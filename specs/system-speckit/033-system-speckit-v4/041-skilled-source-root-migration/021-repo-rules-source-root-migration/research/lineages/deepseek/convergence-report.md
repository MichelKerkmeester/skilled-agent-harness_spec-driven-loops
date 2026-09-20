---
title: "Convergence report - deepseek lineage"
trigger_phrases: []
---
# Convergence report - deepseek lineage

**Session:** `fanout-deepseek-1789890318556-in1rmm`
**Loop:** `research` · **Stop policy:** `max-iterations` (3) · **Stop reason:** `maxIterationsReached`
**Convergence threshold:** 0.05 (telemetry only under this policy)

## Stop Reason

Forced depth. The stop policy required all three configured iterations, so convergence before the cap was telemetry only and no early synthesis was allowed. The loop ran iterations 1-3 and synthesized after the cap.

## Iteration Trend

| run | focus | newInfoRatio | rolling avg | legal stop | findings | status |
|-----|-------|--------------|-------------|------------|----------|--------|
| 1 | Q1 — in-repo consumer census outside specs/ | 0.95 | 0.95 | false | 11 | complete |
| 2 | Q2 — generators, mirrors, CI and gate inputs | 0.90 | 0.925 | false | 12 | complete |
| 3 | Q3 — external consumers and checker portability | 0.85 | 0.90 | false | 10 | complete |

**Average newInfoRatio:** 0.90. The gentle decline is consistent with a forced-depth run whose questions are independent (each iteration opens a new question rather than deepening one), so novelty stayed high; the average is telemetry, not a stop signal.

## Question Coverage

- Q1 — answered in full: 26 router links, 9 `AGENTS.md` instances on 5 lines, 13 body backlinks, the checker's four couplings and nine checks, the skill/command/agent/benchmark surfaces, and the three real breakages.
- Q1a-Q1d — all answered with measured counts.
- Q2 — answered in full: mirror topology, per-mirror checkers and CI wiring, both gate surfaces, artifact determinism and the regeneration obligation.
- Q2a-Q2b — answered, including the filter-twin constraint on the canonical CI filter.
- Q3 — answered: sibling link shape and observed links, the dual-root probe and row-containment contract, body-link base, and farm-check placement.
- Remaining unknowns (3 open items): the two unobserved sibling repositories, the containment mechanism choice, and the canonical-filter twin decision; plus the absent farm script file. Recorded in `findings-registry.json` and `research.md` §8.

## Quality Guards

- **Source diversity:** each iteration drew on a different family (repo corpus + checker; generators + CI + tests; sibling filesystem + plan/spec). No iteration rests on a single source.
- **Focus alignment:** iteration N files address exactly QN; deltas carry the same focus string as the state record.
- **No single weak source:** load-bearing claims carry file:line citations from tracked files; the one out-of-repo observation (sibling links) is corroborated by the documented link shape and the specs' sibling statements.
- **Negative knowledge:** ruled-out directions are recorded per iteration (router links as breakage; whole-directory symlink; tenth checker check; `check-markdown-links` as an AGENTS.md proof).

## Stop Policy Compliance

The state log records iterations 1, 2 and 3 with integer `iteration` fields, the per-iteration convergence telemetry events, a `phase_main_loop` completion event, and the terminal `synthesis_complete` event with `stopReason: "maxIterationsReached"`. Iteration files `iteration-001.md`-`iteration-003.md` exist with no gaps or duplicates.
