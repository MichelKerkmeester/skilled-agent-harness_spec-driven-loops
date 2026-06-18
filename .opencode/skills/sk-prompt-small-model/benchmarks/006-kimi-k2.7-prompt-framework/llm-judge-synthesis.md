# 006 Kimi K2.7 — LLM-Judge Secondary Pass (gpt-5.5)

> **Secondary signal.** The authoritative bake-off result is the deterministic-oracle run in
> `synthesis.md` / `aggregate.json` / `results.json`. That run **saturated** (every framework
> 100% correct on the hidden oracles), so its trust verdict is **TIE** and it cannot crown a
> winner. This file is a supplementary LLM-judge tie-breaker run over the **same Kimi
> generations**, judged by a non-Kimi model (`openai/gpt-5.5` via `cli-opencode`), to surface a
> quality/clarity ordering the saturated oracle could not.

## Why this exists (machinery note)

The repo's `framework-bakeoff` engine (`sweep-benchmark.cjs`) scores by a **deterministic code
oracle** (runs `tests[]` + `hidden_tests[]`); it has **no LLM-judge hook**. The `--grader=llm`
flag lives only on the *other* engine (`loop-host` → `run-benchmark.cjs`), which does **not** run
a framework sweep and does **not** dispatch the model under test — it grades pre-materialized
fixture markdown via a **claude-only** D4 hallucination grader. The two are architecturally
incompatible (see the run report). This LLM-judge pass was therefore run as a standalone
secondary scorer over Kimi's real generations, honoring the "LLM judge / gpt-5.5 / non-Kimi"
intent in the only form the data supports.

## Setup

- **Model under test:** `kimi-for-coding/k2p7` (variant default), dispatched per framework with
  the same registry-rendered prompt the sweep uses.
- **Judge:** `openai/gpt-5.5` via `cli-opencode` (`opencode run --model openai/gpt-5.5 --format json`).
  Different model family from Kimi (`openai` vs `moonshot`), so the grader-independence rule holds.
- **Fixtures:** `t3-lower-bound` (binary-search lower bound), `t3-compare-versions` (strict SemVer).
- **Samples:** 1 Kimi generation per (framework × fixture) = 10 generations, each judged once.
- **Rubric (judge-scored, 0–1):** D1 correctness (0.35), D2 edge coverage (0.25),
  D3 spec adherence (0.20), D4 clarity (0.10), D5 conciseness (0.10).

## LLM-judge leaderboard (gpt-5.5 overall_mean, n=2 cells/framework)

| rank | framework | overall | D1 corr | D2 edge | D3 spec | D4 clarity | D5 concise |
| ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| 1 | cidi | 0.989 | 1.00 | 0.97 | 1.00 | 0.97 | 0.97 |
| 1 | costar | 0.989 | 1.00 | 0.97 | 1.00 | 0.97 | 0.97 |
| 3 | tidd-ec | 0.983 | 0.99 | 0.97 | 1.00 | 0.95 | 0.97 |
| 4 | race | 0.881 | 0.86 | 0.75 | 1.00 | 0.95 | 0.97 |
| 5 | rcaf | 0.726 | 0.60 | 0.57 | 1.00 | 0.78 | 0.95 |

All discrimination came from the harder `t3-compare-versions` (SemVer) fixture; `t3-lower-bound`
saturated at overall 1.0 for every framework even under the judge.

| framework | lower-bound overall | compare-versions overall |
| --- | ---: | ---: |
| cidi | 1.000 | 0.978 |
| costar | 1.000 | 0.978 |
| tidd-ec | 1.000 | 0.966 |
| race | 1.000 | 0.762 |
| rcaf | 1.000 | 0.453 |

## Cross-signal caveat (read before promoting)

The **deterministic oracle is ground truth** and reported **100% pass for all 5 frameworks** on
both fixtures — Kimi's SemVer code passed every hidden test under rcaf too. The gpt-5.5 judge,
however, read rcaf's and race's SemVer output as buggy (rcaf D1=0.2, "release comparison fatally
broken"). That is the well-documented LLM-judge failure mode: the judge's "correctness" is a
*subjective read*, not execution. Treat the LLM-judge ordering as a **quality/clarity tie-breaker**,
not a correctness verdict. The robust reading: cidi / costar / tidd-ec produce SemVer code the
judge reads as clean; rcaf / race produce code the judge distrusts (more terse, less obviously
correct), even though it executes correctly.

## Bottom line

- **Deterministic verdict (authoritative): TIE / saturated** — no framework is a real winner on
  correctness for Kimi on these fixtures.
- **LLM-judge tie-break (secondary):** cidi ≈ costar > tidd-ec ≫ race > rcaf on perceived
  quality. If a single default must be chosen for the registry placeholder, **costar or cidi** are
  the judge-preferred picks; the current placeholder **rcaf** is the judge's *lowest*-ranked of the
  five (though still 100% correct by oracle). Promotion is the operator's call.
