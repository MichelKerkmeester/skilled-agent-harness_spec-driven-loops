---
title: Deep Research Strategy — Jev hallucination grader DeepSeek lineage
description: Detached five-iteration research strategy for improving the Jev hallucination grader (024).
trigger_phrases: []
---

# Deep Research Strategy — Jev hallucination grader DeepSeek lineage

## 1. Overview

This is the persistent state for detached fan-out lineage `deepseek` (cli-pi, deepseek-v4.1-flash, reasoning max). The loop is forced to five iterations by `stopPolicy: max-iterations`; convergence before iteration five is telemetry only and each early convergence signal broadens the review angle instead of closing the run.

## 2. Topic

Improve, refine and expand the Jev hallucination grader (cli-jev feature 024). The scorer under study is `score-d4-agreement.cjs` in `system-deep-loop/deep-improvement`, measuring the D4 hallucination dimension of the model-benchmark 5-dimension scorer, run today by `deterministic/hallucination-flag.cjs`; `run-benchmark.cjs` already accepts `--grader noop|mock|llm`. Measured result to explain: `verdict jev: keep K=56 M=56 A=55 B=47 W=8 L=0 F=1 p_win=0.003906`, baselines majority 47 of 56 and deterministic check 22 of 56, over a fixture corpus where 42 honest DeepSeek answers held 0 invented names and all 9 labeled hallucinations came from 14 deliberately careless answers.

## 3. Non-Goals

- Research only. No scorer, runner, fixture, or workflow file is modified; writes stay inside this lineage directory.
- Do not re-measure feature 024 or re-run the jev/grading arms; phase 047 owns the measurement and its outputs live outside this repository.
- Do not claim measured facts about files that were not read or commands that were not run.

## 4. Stop Conditions

- Complete exactly five evidence iterations regardless of early convergence; stop with `maxIterationsReached`.
- Treat convergence before iteration five as telemetry and broaden into an uncovered angle.
- Retain explicit UNKNOWNs rather than resolving them by inference.

## 5. Key Questions (remaining)

- [x] Q1. What drove the measured result (K=56, M=56, A=55, B=47, W=8, L=0, F=1, p_win=0.003906) — corpus design, grader behavior, baseline degeneracy, and keep-rule mechanics?
- [x] Q2. How can the grader's accuracy be raised or its cost lowered without weakening the judgment?
- [x] Q3. How can the measurement itself be made more trustworthy (labels, splits, repeatability, leakage, reporting)?
- [x] Q4. Where else in `.skilled` would the same invented-name judgment pay off, with file:line evidence?
- [x] Q5. What would a default-on integration need (plumbing, hermeticity, budget), and what cost and risk does it carry?

## 5b. Answered Questions

- Q5 (iteration 5): requirements in order — choose and measure the backend (jev wiring is a later operator-opened phase; the llm path needs its own agreement run), fix the failed-grade 0.0, version and re-baseline the default, keep hermetic no-op for offline runs, populate allowlists, add a cost cap or gate the default, carry the Q3 trust fixes; cost is one call per scored output per uncached pass (recorded jev reference 169 calls / ~93k est. tokens for 56 outputs); risks ranked in iteration-5; blast radius is advisory-only.
- Q4 (iteration 4): ranked seats — review findings (promise without enforcement), benchmark reviewer-output grading (fixtures in place), doc prose advisory lint (citation scan covers only citation shapes), deep-loop evidence filings, and a cli-classifier mode to share one route; planning docs are excluded by design.
- Q3 (iteration 3): ranked trust fixes — second-labeler audit on the disagreements; per-class metrics with intervals and effective-unit framing; repeat the measurement for verdict stability; populate allowlists so B is a same-question baseline; extend the corpus beyond the one hallucination family; tighten requalification (labels SHA + real model build hash). Numbers and citations live in iteration-3.
- Q2 (iteration 2): ranked levers — populate fixture allowlists (repairs the baseline, anchors the Claude grader, unlocks the cascade); confidence-aware reruns and a held-out threshold calibration; cascade once allowlists land (23% saving today); an unmeasured outcome for grader failures instead of score 0.0; opt-in answer caching for regression reruns only. Ranking and file:line anchors live in iteration-2.
- Q1 (iteration 1): three separable drivers — a cleanly separating grader (yes-class median noul 0.71 vs no-class p95 0.23; one near-threshold miss), a baseline forced to majority-only because the deterministic check ran with empty allowlists (reproduced 22 = tp9+tn13, fp34), and a 47:9 corpus whose single discordant story (8-0, one flip) passes every keep check.

## 6. Known Context

- Feature under study: `specs/cli-jev/003-cli-jev-workflow-integration/024-hallucination-grader/` (spec, plan, implementation summary; build commit fb3f9c0599).
- Measurement owner: `specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md` row 024.
- Scorer: `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs`; deterministic baseline: `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/deterministic/hallucination-flag.cjs`; runner: `run-benchmark.cjs`; harness: `scorer/grader/harness.cjs`.
- Fixtures: `.skilled/skills/system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-fixtures/` (21 JSON fixtures, 0 carrying an `allowlist` key — confirmed by reading).
- Measurement artifacts (read-only, outside the repo): `~/.skilled/.labels/024-labels.jsonl` (56 rows), `~/.skilled/.labels/runs/047-024-jev-20261002/report.json` and `calls.jsonl` (169 call records).
- Outputs corpus: `.../047-measure-every-jev-feature/scratch/fixtures/024-outputs/` (56 markdown outputs; 21 fixtures x run1/run2 honest plus 14 run3 careless).
- Verified measurement facts already established in this lineage: report.json matches the quoted verdict line; labels 47 no / 9 yes; all 9 yes labels are `*.run3.md` files; the one A miss is `harder-normalize-path.run3.md` (nouls 0.43/0.43/0.40); the one flip is `validate-semver.run3.md` (0.55/0.41/0.54); the deterministic check right-22 total was reproduced in memory as tp=9 tn=13 fp=34 fn=0.

## 7. What Worked

- (iteration 0) Reading the workflow contract from the fan-out runner: the completion gate is artifacts on disk (5 iteration markdown files, 1..5 state records, non-empty `research.md`, synthesis event with `stopPolicy=max-iterations`).
- (iteration 1) Aggregating `calls.jsonl` per row and re-running the check's own `scoreOutput` in memory: both authoritative counts (A=55, check=22) were reproduced exactly rather than taken from the summary line, including the tp/tn/fp/fn split.
- (iteration 2) Reading the production grader path (`harness.cjs`, `dispute.cjs`, `cache.cjs`) beside the agreement arm: the allowlist gap starves both the check and the Claude grader rubric, which sharpens the lever ranking.
- (iteration 3) Deriving the intervals and family-wise figures from the recorded counts: turned a vague small-corpus caution into actionable numbers ([0.9045,0.9995] overall vs [0.5175,0.9972] sensitivity; Bonferroni k=15 = 0.003333).
- (iteration 4) Finding the promise ("No hallucinated or false-positive issues") in the review agent contract and its self-attestation enforcement: located the highest-payoff adoption seat without running anything.
- (iteration 5) Reading the 024 decision table first: the frozen decisions (no grader kind added; a keep wires nothing) anchored the integration requirements and prevented treating the jev keep as evidence for the Claude grader.

## 8. What Failed

- None yet.

## 9. Exhausted Approaches

- None yet.

## 10. Ruled-Out Directions

- None yet.

## 11. Next Focus

Complete. All five questions are answered in iteration-001 through iteration-005; the consolidated, ranked recommendations live in `research.md`. No further focus is defined (max-iterations stop).
