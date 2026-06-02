---
title: "D1-D5 scoring and funnel"
description: "Per-scenario scoring against the private gold plus a per-skill aggregate normalized over the dimensions actually measured, with a funnel whose largest first-failure count is the headline bottleneck."
trigger_phrases:
  - "d1-d5 scoring and funnel"
  - "score-skill-benchmark.cjs"
  - "score benchmark dimensions"
  - "headline bottleneck funnel"
  - "per-scenario aggregate scoring"
---

# D1-D5 scoring and funnel

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

`score-skill-benchmark.cjs` turns router-replay, advisor, and connectivity results into the five benchmark dimensions. D1-intra, D2, and D3 are scored per scenario against the private gold; D1-inter is per scenario but only when the advisor probe ran; D5 is per skill; D4 is always `null` (unscored) until live mode. The scenario `modeAScore` and the per-skill aggregate are normalized over only the dimensions actually measured, and a funnel ranks first-failure stages so the largest attrition becomes the headline bottleneck.

---

## 2. HOW IT WORKS

### Scoring & Ranking

`scripts/skill-benchmark/score-skill-benchmark.cjs` is a pure function of its inputs and hardcodes `WEIGHTS = { d1inter: 12, d1intra: 13, d2: 20, d3: 15, d4: 25, d5: 15 }`. `setRecall(expected, actual)` returns the fraction of expected items present in actual, or `null` when expected is empty (not applicable). `scoreScenario` computes per scenario:

- D1-intra = `0.4 * intentRecall + 0.6 * resourceRecall` (each null recall treated as 1.0, non-penalizing). Negative-activation scenarios invert: routing any expected (to-suppress) resource scores 0, else 1.
- D2 (Mode A proxy `router-replay-recall`) = expected-resource recall (1.0 when no expected resources); for negative scenarios it mirrors the D1-intra suppression outcome.
- D3 (Mode A proxy `router-overload`) = `routed === 0 ? 1 : Math.max(0, 1 - wasted/routed)` where `wasted` is routed resources not in the expected set; for negative scenarios D3 mirrors the suppression outcome.
- D1-inter = `scoreD1Inter` from the advisor probe when an `advisorResult` is supplied, else `{ score: null, unscored: '...' }`.
- D4 (the weighted hallucination dimension) = always `{ score: null, unscored: 'requires skill-on/off ablation (live mode)' }` — unscored in the aggregate by design.
- `assetRecall` = `expectedAssets` recall on its own lane (live: vs the model's stated assets; router: `{ score: null, deferred: true }`), so assets never distort D2/D3.
- A row may also carry `d4TaskOutcome` (the real usefulness signal), attached by the opt-in `--d4` ablation pass in the orchestrator — not by `scoreScenario`.

The scenario `modeAScore` is the weighted mean (×100, rounded) over D1-intra, D2, D3, and — only when it scored — D1-inter, normalized by the sum of those weights. `firstFailingStage` is the first of: `activated-inter` (D1-inter < 0.5), `router-unparseable`, `routed-intra` (D1-intra < 0.5), `discovered` (D2 < 0.5).

### Core Behavior

`aggregate({ skillId, skillRoot, scenarioRows, connectivity, traceMode })` averages the per-scenario dimension scores (ignoring non-numbers), counts `firstFailingStage` occurrences into a `funnel`, and picks the `headlineBottleneck` as the non-`passed` stage with the highest count. D5 score is `connectivity.score`. The verdict is: `BLOCKED-BY-STRUCTURE` when `connectivity.gateFailed`; else `NO-SCENARIOS` when no aggregate score; else `PASS` ≥ 80, `CONDITIONAL` ≥ 50, else `FAIL` — on the 0-100 `aggregateScore`. The report object carries `schemaVersion: 'skill-benchmark-report.v1'`, `scoringMethod: 'mode-a-router-replay'`, `dimensionScores` (each dimension reports `points` plus `score` or `status: 'unscored-mode-a'`), `unscoredDimensions` (`['D1inter','D4']` when no advisor, else `['D4']`), `advisorySignals` (`D4_task_outcome` + `assetRecall` — surfaced but NOT folded into the weighted aggregate; `D4_task_outcome` is populated only by the opt-in `--d4` live pass, else `unscored`), and `bottlenecks` (the connectivity findings, with a `funnel_attrition` P1 entry unshifted to the front when a headline bottleneck exists). Weights and verdict bands also live in `assets/skill-benchmark/default_profile.json`. UNVERIFIED: that profile is a reference only — its `notes` field states it is NOT consumed at runtime; the scorer hardcodes `WEIGHTS` and there is no `--profile` loader on the Lane C path.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs` | Scoring | Per-scenario D1-intra/D2/D3 vs gold (`scoreScenario`), D1-inter via the probe, D5 from connectivity, weighted `modeAScore`, funnel + headline bottleneck, verdict, bottlenecks (`aggregate`). |
| `.opencode/skills/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs` | Utility (imported) | Supplies `scoreD1Inter` folded into the scenario score. |
| `.opencode/skills/deep-improvement/assets/skill-benchmark/default_profile.json` | Reference profile | Documents weights and verdict bands; reference only, not consumed at runtime per its own `notes`. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts` | Automated test | Asserts a full-match scenario yields `verdict: PASS` and D1-intra > 0.9, a negative scenario that leaks the suppressed resource scores D1-intra 0 and D3 0, and end-to-end the `deep-improvement` fixture produces a scored scenario row. |

---

## 4. SOURCE METADATA

- Group: Skill-benchmark mode
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `05--skill-benchmark/022-scoring-and-funnel.md`
Related references:
- [021-d5-connectivity-gate.md](021-d5-connectivity-gate.md) — D5 structural connectivity hard gate
- [023-dual-report-and-remediation.md](023-dual-report-and-remediation.md) — Dual report and remediation taxonomy
