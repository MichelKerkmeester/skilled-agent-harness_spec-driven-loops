---
title: "Deterministic scoring"
description: "Produces repeatable score and benchmark outputs from the dynamic scorer and fixture runner."
trigger_phrases:
  - "deterministic scoring"
  - "run-benchmark.cjs"
  - "produce repeatable scores"
  - "dynamic-5d scoring mode"
  - "fixture runner output"
---

# Deterministic scoring

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Produces repeatable score and benchmark outputs from the dynamic scorer and fixture runner.

This feature covers the JSON outputs that later gates, dashboards, and manual decisions consume.

---

## 2. HOW IT WORKS

`score-candidate.cjs` always runs in `dynamic-5d` mode. It reads the candidate, parses the JSONC manifest when one is supplied, regenerates the profile on the fly, optionally accepts a `--weights` override, and emits structured output with `status`, `profileId`, `family`, `evaluationMode`, `score`, `dimensions`, `recommendation`, and `failureModes`. Scores below `60` on a dimension become `weak-*` failure modes, and the weighted-score threshold for `candidate-acceptable` is `70`.

`run-benchmark.cjs` is also deterministic once a profile exists. It loads a profile JSON from `assets/agent-improvement/target-profiles`, scores fixture outputs against required headings and patterns, optionally folds in integration-report data, and appends benchmark-run records to the state log. Because the current release ships dynamic scoring without a populated static profile catalog, benchmark execution only becomes directly runnable when a profile-specific fixture directory and profile JSON are supplied for the target being tested.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/deep-improvement/scripts/agent-improvement/score-candidate.cjs` | Scorer | Emits the current dynamic score payload and recommendation labels. |
| `.opencode/skills/deep-improvement/scripts/model-benchmark/run-benchmark.cjs` | Benchmark runner | Scores fixture outputs and optional integration-report data against a loaded profile. |
| `.opencode/skills/deep-improvement/references/model-benchmark/evaluator_contract.md` | Contract reference | Documents the scorer output schema, benchmark schema, and recommendation threshold. |
| `.opencode/skills/deep-improvement/references/model-benchmark/benchmark_operator_guide.md` | Operator reference | Defines the benchmark command shape, repeatability rule, and integration-benchmark fields. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/deep-improvement/scripts/agent-improvement/tests/benchmark-stability.vitest.ts` | Automated test | Verifies the replay-stability helper that sits beside benchmark verdicts. |
| `.opencode/skills/deep-improvement/README.md` | Package reference | Mirrors the current weighted-score threshold and benchmark expectations for operators. |

---

## 4. SOURCE METADATA

- Group: Scoring system
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `03--scoring-system/012-deterministic-scoring.md`
Related references:
- [011-dynamic-profiling.md](011-dynamic-profiling.md) — Dynamic profiling
- [013-dimensional-progress.md](013-dimensional-progress.md) — Dimensional progress
