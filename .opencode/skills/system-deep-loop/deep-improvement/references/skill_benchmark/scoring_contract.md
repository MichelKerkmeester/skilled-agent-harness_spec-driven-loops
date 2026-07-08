---
title: "Lane C Skill-Benchmark Scoring Contract"
description: "Authoritative D1-D5 computation for the Lane C Skill Benchmark Report: point weights, Mode A deterministic scoring, the opt-in advisor probe for D1-inter, deferred live-mode dimensions, and funnel/bottleneck ranking."
trigger_phrases:
  - "skill-benchmark scoring contract"
  - "lane c scoring"
  - "d1 d5 weights"
  - "skill benchmark dimensions"
importance_tier: important
contextType: implementation
version: 1.17.0.6
---

# Lane C Skill-Benchmark Scoring Contract

Authoritative computation for the Skill Benchmark Report. Source of truth: the converged design in `122-.../001-skill-benchmark-deep-research/research/research.md` §3 and the implementation playbook in `002-implementation-deep-research/research/research.md`.

---

## 1. OVERVIEW

Lane C scores a skill across five dimensions (D1-D5) and rolls them into a single verdict. D5 (structural connectivity) is a static hard gate that runs first. Mode A (router-replay) scores everything that needs no live model deterministically; D1-inter is built but opt-in via the in-repo advisor. The weighted **D4** dimension (a hallucination-grader proxy) stays unscored in the aggregate **by design** — it does not measure task usefulness. Real routine-task usefulness is measured separately by the opt-in **D4-R task-outcome ablation**, reported as an advisory signal (never folded into the weighted score); the live trace (Mode B) is built. The aggregate normalizes over the dimensions actually measured so the headline number stays honest about coverage.

## 2. POINT WEIGHTS (FULL / LIVE MODE)

`D1 = 25` (inter 12 + intra 13) · `D2 = 20` · `D3 = 15` · `D4 = 25` · `D5 = 15` (hard gate).

## 3. MODE A (ROUTER-REPLAY, DETERMINISTIC)

Scores only what needs no live model; the aggregate normalizes over the measured weights (D1-intra + D2 + D3, plus D1-inter when the advisor probe is enabled) so the number is honest about coverage. D5 is computed statically and gates.

- **D1-intra** = `0.4 * intentRecall + 0.6 * resourceRecall` vs private `expected.intentKeys` / `expected.resources`. Empty expected = not-applicable (treated as 1.0, non-penalizing). Negative-activation scenarios invert: routing the expected resources is a failure.
- **D2** (Mode A proxy) = recall of expected resources in the routed set. Live mode replaces this with Hit@1 / Hit@3 / Recall@5 / MRR over the observed file-load trace.
- **D3** (Mode A proxy) = `1 - wastedRouted / totalRouted` (over-routing penalty). Live mode replaces with calls/tokens-to-first-expected.
- **D5** = `100 - Σ penalties` (P0 40, P1 12, P2 3), floored at 0. Any P0 sets `gateFailed`.

## 4. D1-INTER — OPT-IN ADVISOR PROBE (BUILT, DETERMINISTIC)

D1-inter (does the skill *advisor* select this skill for the scenario?) is built and deterministic, but **opt-in** so the pure-router default stays fast and dependency-free:

- Enable with `--advisor-mode=python`. Off by default and in CI.
- Scored out-of-band via the deterministic SQLite advisor (`scoreAdvisorPrompt` / `skill_advisor.py`) with the advisor hook disabled so the answer cannot leak into the dispatched prompt.
- When disabled it reports `status: unscored-mode-a` (never faked); when enabled it contributes its 12 points to the measured aggregate.

## 5. LIVE MODE (MODE B) + ADVISORY SIGNALS

The weighted **D4** dimension stays `unscored-mode-a` in the aggregate by design (its grader scores hallucination, not usefulness). Two live-mode signals are surfaced under `advisorySignals`, **outside** the weighted aggregate so the v1 weights/verdict are unchanged:

- **`D4_task_outcome` — the real usefulness instrument (D4-R).** Opt-in via `--d4` (live). The model is asked to *do* a routine task (a minimal patch plan + verification commands, not a routing list) skill-on vs skill-off; both answers are graded by the task-outcome rubric (`system-grader-task-outcome.md`: correctness / verification-fit / focus / hallucination-risk) through the Lane B grader harness (claude-graded; distinct cache keys via the `#taskoutcome#on|off` fixture ids). Score = `0.5 + (on − off) / 2` (>0.5 = the skill helped). Stamped `attribution: approximate` (skill-off is approximated by hook-disable + preamble + a contamination guard that drops a leaked pair). Reported as `advisorySignals.D4_task_outcome`, never summed into the verdict.
- **`assetRecall` — deferred-asset support.** `expectedAssets` is scored on its own lane (live: recall vs the model's stated assets; router: deferred). `live-executor` keeps assets on a separate `observedAssets` channel so a stated, useful asset is not counted as D3 over-routing waste.

**Live trace (Mode B)** replaces the D2/D3 router-replay proxies with the model's stated/observed routing (references only — assets are on the `assetRecall` lane). Signals that did not run report `status: unscored-mode-a` — never faked.

### Advisory Signals

`score-skill-benchmark.cjs` emits `advisorySignals` in the machine report, and `build-report.cjs` renders them under **Advisory signals (NOT in the weighted aggregate)**. `D4_task_outcome` reports the opt-in D4-R routine-task usefulness delta when `--d4` live ablation runs; otherwise it is unscored. `assetRecall` reports expected deferred-asset support when live stated assets are available; otherwise it is deferred or unscored. Both are diagnostic only and never change `aggregateScore`, `dimensionScores`, `verdict`, or D4's weighted status.

## 6. FUNNEL + BOTTLENECK RANKING

Per-scenario `firstFailingStage` follows the implemented order: `activated-inter` (advisor selected the wrong skill when D1-inter is scored), `router-unparseable`, `surface-mismatch`, `routed-intra`, then `discovered`. A scenario with no failing stage is counted as `passed`; orchestrator-added degradation rows can also contribute `unparseable-fixture`, `contaminated-fixture`, or browser routed-out reasons, and `build-report.cjs` displays routed-out rows with their reason instead of a normal failing stage. The headline bottleneck is the non-`passed` stage with the largest first-failure count (attrition). Bottlenecks list D5 findings plus the headline funnel finding, each mapped through `assets/skill_benchmark/remediation_taxonomy.json` to file, locus, one-line fix, and handoff lane.
