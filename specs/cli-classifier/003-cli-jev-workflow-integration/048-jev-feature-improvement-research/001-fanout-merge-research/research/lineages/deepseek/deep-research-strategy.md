---
title: "Deep Research Strategy — Jev fan-out merge (deepseek lineage)"
trigger_phrases: []
---
# Deep Research Strategy — Jev fan-out merge (deepseek lineage)

<!-- MACHINE-OWNED (detached lineage: no reducer runs here; this file was authored in full) -->

## Research Charter

**Topic:** Improve, refine and expand the Jev fan-out merge (cli-jev feature 030) — the merge step of
`/deep:research` and `/deep:review` fan-out runs, which decides whether two findings from parallel
lineages are the same finding. Scorer: `.skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs`.
Measured on 2026-10-02: `verdict jev: keep K=60 M=60 A=53 B=12 W=44 L=3 F=3 p=1.232e-10` on 60 recorded
fan-out pairs labeled by a delegated arbiter.

**Five questions**
1. What drove the measured result.
2. How to raise its accuracy or lower its cost.
3. How to make the measurement more trustworthy.
4. Where else in `.skilled` the same judgment would pay off.
5. What a default-on integration would need, cost and risk.

**Non-Goals:** changing any scorer, merge or live workflow; re-measuring the feature; implementation.

## Known Context

- `fanout-merge.cjs` merges lineage registries; its collapse rule is a body-key equality gate plus a
  title-overlap threshold of 0.15, and near-duplicate dedup is off unless an option or env var turns it on.
- `score-fanout-pairs.cjs` censuses tracked fan-out registries, classes pairs as `near-line`
  (same body, title overlap 0.05–0.30) or `cross-body` (different body, text overlap ≥ 0.5), calls the
  merge's exported functions as the oracle, and asks Jev one fixed question per pair, three times (AB, BA, AB).
- The recorded measurement artifacts live outside the repository: labels in `~/.skilled/.labels/030-labels.jsonl`
  and the report, calls and stdout in `~/.skilled/.labels/runs/047-030-jev-20261002/`.
- The merge runs live as one step of the synthesis phase in the deep-research and deep-review YAML workflows.
- Adjacent suites in `system-deep-loop/runtime/lib/` already model same/contradict/agree judgments with
  exact-key or lexical identity: `claim-continuity`, `contradiction-supersession`, `conditional-fanin`.

## Key Questions

- [x] Q1 What drove the measured result: corpus geometry (one class, zero near-line), a structurally
      constant merge baseline, the 48:12 label split, and a per-pair record of 44/48 sensitivity and 9/12 specificity.
- [x] Q2 How to raise accuracy or lower cost: decision-equivalent early stop (−32% calls, identical verdict),
      symmetric tiebreak (+2), SAME_AT 0.4 post-hoc (+4), and the lexical-rule ceiling context.
- [x] Q3 How to make the measurement more trustworthy: frame-dependence (stop on margin against any
      non-blind baseline), oracle dropouts, different-class composition, contested labels, label identity,
      split reproducibility.
- [x] Q4 Where else the judgment pays off: merge question/ruled-out streams, claim-continuity, conditional-fanin,
      contradiction-supersession; scorer exports as the measurement kit.
- [x] Q5 Default-on integration: constraints (reader, phase, amendment), hermetic-step and publication-guard
      blockers, determinism/cache, cost model, measured risk register, four tiers.

## What Worked

- 2026-10-03 iteration 1: reading the recorded `calls.jsonl` alongside the labels turns the aggregate verdict into a per-pair anatomy (sensitivity/specificity, split pairs, cost).
- 2026-10-03 iteration 1: re-running the zero-call census in this worktree reproduced the recorded census line for line.
- 2026-10-03 iteration 2: counterfactual scoring of recorded calls made the tiebreak and threshold levers measurable without a single new model call.
- 2026-10-03 iteration 3: reconstructing each labeled pair's source findings from the tracked registries exposed the four oracle-undecidable pairs and the dimension-label composition of the `different` class.
- 2026-10-03 iteration 5: reading both live merge steps confirmed the integration blockers (hermetic step, publication guard, count bindings).

## What Failed

- 2026-10-03 iteration 3: `merge undecidable: 12` could not be mapped to distinct labeled pairs beyond the four found; the remaining eight lie outside the labeled subset.
- 2026-10-03 iteration 5: no live pair-volume distribution exists for pre-commit runs; the tracked corpus undercounts live volumes by construction.

## Exhausted

- Reading the recorded artifacts for new signal: every claim in this packet traces to the recorded labels, calls, report, stdout, the two scripts, or the workflows. New claims need new labels or new calls.

## Next Focus

Loop complete at max-iterations. Synthesis written to `research.md`; findings registry holds 35 findings,
5 resolved questions, 5 open questions and 10 ruled-out directions. Stop reason: `maxIterationsReached`.
