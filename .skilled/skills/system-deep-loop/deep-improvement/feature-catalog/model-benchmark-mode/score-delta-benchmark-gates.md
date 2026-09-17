---
title: "Score-delta benchmark gates"
description: "Emits outcomeScoreDelta and fixtureDeltas helped/hurt evidence from Lane B benchmark runs, summarizes the deltas in reduce-state, and blocks promotion on regressions or unreviewed hurt fixtures."
trigger_phrases:
  - "score-delta benchmark gates"
  - "outcomeScoreDelta"
  - "fixtureDeltas helped hurt"
  - "allow-hurt-fixtures"
  - "benchmark delta promotion gate"
version: 1.17.0.1
---

# Score-delta benchmark gates

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Lane B benchmark reports now carry quality-delta evidence, not only pass/fail status. `run-benchmark.cjs` compares each fixture's after score with the fixture baseline, emits `fixtureDeltas[]`, computes an aggregate `outcomeScoreDelta`, and writes the same fields to the benchmark ledger. `reduce-state.cjs` summarizes the helped, hurt, unchanged, and missing-baseline counts, while `promote-candidate.cjs` blocks benchmark promotion when the outcome delta is negative, missing without explicit review, or contains hurt fixtures without `--allow-hurt-fixtures`.

---

## 2. HOW IT WORKS

`run-benchmark.cjs` reads baseline scores from fixture-level `baselineScore` fields or profile-level baseline maps, then builds one delta row per fixture: `beforeScore`, `afterScore`, numeric `delta`, and boolean `helped`/`hurt` flags. If every fixture has a baseline, it computes `outcomeScoreDelta` as the average after score minus the average before score; otherwise the field is `null` and the report records the missing-baseline count.

The benchmark report and appended `benchmark_run` state row both include `outcomeScoreDelta`, `fixtureDeltas`, and `fixtureDeltaSummary`. `reduce-state.cjs` rolls those rows into a registry/dashboard benchmark delta summary so operators can see runs with missing deltas, latest and average outcome delta, and helped/hurt fixture totals.

Promotion treats the delta contract as a safety gate. `promote-candidate.cjs` refuses negative `outcomeScoreDelta`, refuses a missing baseline unless `--no-baseline-ok` is passed, and refuses any hurt fixture unless `--allow-hurt-fixtures` is passed. The override flags are explicit review levers; they do not change benchmark scoring.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs` | Benchmark runner | Builds `fixtureDeltas[]`, `fixtureDeltaSummary`, and `outcomeScoreDelta`; persists them in the report and `benchmark_run` ledger row. |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/reduce-state.cjs` | Reducer | Aggregates benchmark delta rows into registry and dashboard summaries: runs with deltas, missing deltas, helped/hurt/unchanged/missing-baseline counts. |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs` | Promotion helper | Blocks negative outcome deltas, missing baselines without `--no-baseline-ok`, and hurt fixtures without `--allow-hurt-fixtures`. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/run-benchmark-hardening.vitest.ts` | Automated test | Asserts benchmark reports and state rows include `outcomeScoreDelta`, per-fixture helped/hurt rows, and the fixture delta summary. |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/promote-candidate-benchmark.vitest.ts` | Automated test | Asserts promotion rejects negative deltas, missing baselines, and hurt fixtures unless the explicit override flag is supplied. |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/reduce-state-mode-mix.vitest.ts` | Automated test | Asserts reducer registry and dashboard output summarize benchmark score-delta counts. |

---

## 4. SOURCE METADATA

- Group: Model-benchmark mode
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `model-benchmark-mode/score-delta-benchmark-gates.md`
Related references:
- [mode-records-and-gates.md](../../feature-catalog/model-benchmark-mode/mode-records-and-gates.md) -- Record-level mode and hardening gates
- [promotion-gates.md](../../feature-catalog/evaluation-loop/promotion-gates.md) -- Promotion gate policy
