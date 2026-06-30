---
title: "Changelog: Phase 2: framework-bakeoff [149-kimi-k2-7-code-support/002-framework-bakeoff]"
description: "Chronological changelog for the first Kimi K2.7 Code prompt-framework bakeoff."
trigger_phrases:
  - "phase changelog"
  - "framework bakeoff"
  - "kimi run 006"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-18

> Spec folder: `.opencode/specs/skilled-agent-orchestration/z_archive/116-kimi-k2-7-code-support/002-framework-bakeoff` (Level 1)
> Parent packet: `.opencode/specs/skilled-agent-orchestration/z_archive/116-kimi-k2-7-code-support`

### Summary

The first Kimi K2.7 Code prompt-framework bakeoff ran as a real model-under-test sweep, not a dry configuration exercise. It completed 30 of 30 `kimi-for-coding/k2p7` dispatches across five frameworks and two T3 coding fixtures, then returned the only honest verdict the data allowed: TIE. Correctness saturated, the engine surfaced that saturation, fell to efficiency as the ranking key and handed phase 003 an interim finding rather than a winner.

### Added

- Created `kimi-k2.7-frameworks.json` cloned from `framework-bakeoff.json`.

### Changed

- Re-verified the live slug `kimi-for-coding/k2p7` through `opencode models kimi-for-coding`.
- Read `.opencode/skills/deep-loop-workflows/deep-improvement/assets/model_benchmark/benchmark-profiles/framework-bakeoff.json` as the clone base.
- Set models to `[{ "executor":"cli-opencode", "provider":"kimi-for-coding", "model_slug":"k2p7", "variant":"default" }]`.
- Recorded the TIE verdict, inside the noise floor, plus the per-framework leaderboard.
- Folded the finding and the subjective secondary ranking into the phase 003 hand-off.
- Marked all tasks `[x]`.
- Left no `[B]` blocked tasks remaining.

### Fixed

- Confirmed target fixtures exist under `benchmark-fixtures/`.
- Used the two T3 coding fixtures the engine reports as `t3-lower-bound` and `t3-compare-versions`.
- Set frameworks to `["rcaf","race","cidi","tidd-ec","costar"]` and pointed fixtures at real T3 coding files.
- Kept scorer `5dim` plus correctness gate threshold 1.0.
- Confirmed the JSON parses and the engine consumed it.
- Ran the bakeoff through `sweep-benchmark.cjs` with run label `006-kimi-k2.7-prompt-framework`.
- Ran the `gpt-5.5` LLM judge as a standalone secondary pass over Kimi's real generations.
- Documented the deviation that the plan's `--grader=llm` flag is architecturally incompatible with the framework-bakeoff engine, because the sweep scores through a deterministic code oracle and has no LLM-judge hook.
- Documented the deviation that `--grader llm` lives on the loop-host engine, which does not sweep frameworks or dispatch the model under test.
- Drove `runSweep` programmatically with the correct `registryPath` to work around a registry-path bug without editing the engine.
- Confirmed `aggregate.json`, `results.json` and `synthesis.md` exist under `benchmarks/006-kimi-k2.7-prompt-framework/`.
- Confirmed the correctness gate did not silently saturate, since `correctness_saturated: true` was surfaced and the engine fell to efficiency as the ranking key.
- Verified the run output includes verdict TIE and a leaderboard.

### Verification

| Check | Result |
|-------|--------|
| Strict validation | PASS: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <002 folder> --strict` exited 0 after close reconciliation. |
| Run outputs | PASS: run `006-kimi-k2.7-prompt-framework` wrote `aggregate.json`, `results.json` and `synthesis.md` under `benchmarks/006-kimi-k2.7-prompt-framework/`. |
| Correctness gate honesty | PASS: saturation surfaced explicitly as `correctness_saturated: true`, and the engine fell to efficiency as the ranking key. |
| Verdict and leaderboard | PASS: `synthesis.md` recorded verdict TIE inside the noise floor and a five-row efficiency leaderboard of `cidi` > `costar` > `race` > `rcaf` > `tidd-ec`. |
| Real Kimi dispatches | PASS: 30/30 real `kimi-for-coding/k2p7` dispatches succeeded, no fallback used and all cells generated. |
| Tasks complete | PASS: 13 completed task items recorded. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `kimi-k2.7-frameworks.json` | Created | Bakeoff profile with Kimi-only model, five frameworks, real T3 fixtures and `5dim` plus correctness gate threshold 1.0. |
| `benchmarks/006-kimi-k2.7-prompt-framework/ (aggregate.json, results.json, synthesis.md)` | Created | Authoritative sweep outputs with per-framework leaderboard and TIE verdict. |
| `benchmarks/006-kimi-k2.7-prompt-framework/ (llm-judge-board.json, llm-judge-results.json, llm-judge-synthesis.md)` | Created | Secondary `gpt-5.5` clarity tie-break, subjective and not a correctness verdict. |
| `002-framework-bakeoff/improvement/ (model-benchmark-state.jsonl, benchmark-run-pointer.json)` | Created | Run state and pointer recording the deterministic TIE plus the judge top and bottom. |

### Follow-Ups

- The verdict was a TIE, not a winner. Correctness saturated across all five frameworks, so the run could not name an empirically best framework for this model.
- RCAF stayed only as an interim default after this inconclusive run. Phase 004 superseded it with run 007 on strict validators, where COSTAR was promoted, RCAF was retired and status became empirical.
- The two T3 coding fixtures were too easy for this strong model. The engine action was `demote-to-smoke`.
- A sharper recommendation needed harder, less-saturating fixtures and ideally a correctness-anchored judge.
- The secondary `gpt-5.5` judge was subjective. It flagged some oracle-confirmed-correct code as buggy, a known LLM-judge failure mode, so it ranked perceived clarity and was not load-bearing for the verdict.
- `kimi-k2.7-code` has `fallback_target: null`. The run completed on the `kimi-for-coding` pool without fallback, but a future re-run must defer rather than retry the same pool if it is exhausted.
