---
title: "benchmark-profiles: Lane B run profiles"
description: "The 10 Lane B benchmark profiles that tell run-benchmark.cjs which fixtures, models, frameworks, and scoring to use."
trigger_phrases:
  - "benchmark profile"
  - "framework-bakeoff profile"
  - "model-vs-model profile"
  - "default.json benchmark"
version: 1.17.0.4
---

# benchmark-profiles: Lane B run profiles

---

## 1. OVERVIEW

`benchmark-profiles/` holds the 10 JSON profiles a Lane B run loads with `run-benchmark.cjs --profile <path-or-id>`. A profile declares the fixtures to score, where outputs land, the scoring method, and (for sweep profiles) the matrix of frameworks and models to run. `default.json` is the legacy single-pass profile; `framework_bakeoff.json` and `model_vs_model.json` add a `mode` field and a sweep matrix. Alongside these original single-pass and sweep profiles, the set now also includes `reviewer_regression.json` (`mode: reviewer`, gated on `SPECKIT_REVIEWER_BENCHMARKS`), a reviewer-mode regression profile scored by the reviewer scorer rather than the pattern or `5dim` path. The remaining profiles — `capability_m3_vs_mimo.json`, `capability_m3_vs_mimo_v2.json`, `capability_m3_vs_mimo_v3.json`, `glm_5.2_frameworks.json`, `kimi_k2.7_discriminating.json`, and `kimi_k2.7_frameworks.json` — are additional Lane B run profiles kept in this folder; see each file for its own mode and matrix.

Current state:

- `default.json` has no `mode` — it scores three deep-improvement agent fixtures with the legacy pattern scorer (no `scoring` block, no sweep).
- `framework_bakeoff.json` sets `mode: framework-bakeoff` and sweeps five prompt frameworks against one model, grouping the leaderboard by framework.
- `model_vs_model.json` sets `mode: model-vs-model` and sweeps three models against one fixed framework, grouping the leaderboard by model.
- Both sweep profiles use the opt-in `5dim` scorer, `samplesPerCell: 3` at `seed: 1729`, and the same five weighted dimensions (D1 0.25, D2 0.30, D3 0.20, D4 0.15, D5 0.10) under a `correctnessGate` of 1.0.
- All three share the same `outputsDir` token (`{spec_folder}/improvement/benchmark-outputs`) and the same `benchmark` gate (aggregate 80, per-fixture 70, repeatability tolerance 0).

---

## 2. KEY FILES

| File | Mode | Purpose |
|---|---|---|
| `default.json` | (none) | Legacy single-pass profile. Targets `.opencode/agents/deep-improvement.md`, scores fixtures `fixture-baseline`, `fixture-improved`, `fixture-edge` with the default pattern scorer. Declares `thresholdDelta` and the `benchmark` gate; no `mode`, `frameworks`, `models`, or `scoring` block. |
| `framework_bakeoff.json` | `framework-bakeoff` | Prompt-framework sweep. Holds one model fixed (`cli-opencode` / `minimax-coding-plan` / `MiniMax-M2.7`) and sweeps `frameworks: [rcaf, race, cidi, tidd-ec, costar]` over the T3 fixtures `t3-lower-bound` and `t3-compare-versions`. Reports `groupBy: framework` with leaderboard and history. |
| `model_vs_model.json` | `model-vs-model` | Model sweep. Holds one framework fixed (`rcaf`) and sweeps three model cells (`cli-opencode` MiniMax-M2.7, `cli-opencode` gpt-5.5 high, `cli-claude-code` claude-opus high) over the same two T3 fixtures. Reports `groupBy: model` with leaderboard and history. |

Shared top-level keys (all three): `profileId`/`id`, `version`, `family`, `fixtureDir`, `fixtures`, `outputsDir`, `metrics`, `thresholdDelta`, `benchmark`. Sweep-only keys (`framework_bakeoff.json`, `model_vs_model.json`): `mode`, `fixtureSelection`, `frameworks`, `models`, `scoring`, `sampling`, `reporting`.

---

## 3. BOUNDARIES

| Boundary | Rule |
|---|---|
| Ownership | These three profiles are the canonical Lane B run configs. The fixtures they reference live in `../benchmark-fixtures/` (resolved via each profile's `fixtureDir`). |
| Consumers | Read by `run-benchmark.cjs` (loaded by `--profile <path-or-id>`). The `mode` field is routed by `loop-host.cjs`; the `scoring` block is consumed only on the `5dim` path. |
| Write policy | Authored config, hand-edited. Not generated and not runtime state. Run outputs go to `outputsDir`, never back into this folder. |
| Path tokens | `outputsDir` contains the `{spec_folder}` token, expanded by the loop runtime at dispatch time; do not hard-code a spec path here. |

---

## 4. VALIDATION

Run from the repository root.

```bash
node -e "for(const f of ['default','framework_bakeoff','model_vs_model']){const p=require('./.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/'+f+'.json');console.log(f, p.profileId, p.mode||'(no mode)')}"
```

Expected result: all three profiles parse as valid JSON and print their `profileId` and mode (`default (no mode)`, `framework-bakeoff framework-bakeoff`, `model-vs-model model-vs-model`).

---

## 5. RELATED

- [`model-benchmark scripts README`](../../../scripts/model-benchmark/README.md)
- [`benchmark-fixtures`](../benchmark-fixtures)
- [`deep-improvement SKILL.md`](../../../SKILL.md)
- Authoring these profiles: [`sk-doc/create-benchmark`](../../../../../sk-doc/create-benchmark/SKILL.md) §11 — the run-profile template [`model_benchmark_profile_template.md`](../../../../../sk-doc/create-benchmark/assets/model_benchmark/model_benchmark_profile_template.md) and [`model_benchmark_fixture_guide.md`](../../../../../sk-doc/create-benchmark/references/model_benchmark/model_benchmark_fixture_guide.md). That packet owns the profile *authoring* template; `run-benchmark.cjs` and the scorers stay lane-local.
