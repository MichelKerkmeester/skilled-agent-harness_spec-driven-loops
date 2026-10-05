---
title: "Opt-in 5-dimension scorer"
description: "Selects the pattern matcher by default or the opt-in five-dimension scorer for model-benchmark outputs."
trigger_phrases:
  - "opt-in 5-dimension scorer"
  - "score-model-variant.cjs"
  - "enable 5dim scorer"
  - "--scorer 5dim flag"
  - "grader selection"
version: 1.17.0.9
---

# Opt-in 5-dimension scorer

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Selects the pattern matcher by default or the opt-in five-dimension scorer for model-benchmark outputs.

This feature controls how `run-benchmark.cjs` judges materialized outputs. It keeps the deterministic byte-identical scorer as the default and exposes the richer five-dimension scorer behind explicit flags.

---

## 2. HOW IT WORKS

`run-benchmark.cjs --scorer pattern` is the default. It uses the byte-identical heading and pattern matcher, so a run with no scorer flag produces the same deterministic result as before. `--scorer 5dim` is opt-in: it routes materialized outputs through `scripts/model-benchmark/scorer/score-model-variant.cjs`, the ported five-dimension scorer that combines deterministic checks with a pluggable grader.

Grader selection is separate from scorer selection. `--grader auto` is the default: with a stored Jev credential it grades D4 with the Jev cascade, which asks only about outputs the deterministic hallucination check flags, and without one it resolves to `noop`, deterministic with no model dispatch. `--grader noop` forces the deterministic path, `--grader mock` selects the stub grader, `--grader llm` the real grader and `--grader jev` the cascade, exiting 2 without a credential. The report records the resolved `grader`, the `graderRequested` value and the `graderReason`. Any other value exits 2 with the usage line before a profile loads, so a mistyped kind can no longer score with the stub. The benchmark report and the `benchmark_run` record carry `scoringMethod: pattern` or `scoringMethod: 5dim`, so downstream consumers can attribute each result to the scorer that produced it.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs` | Benchmark runner | Resolves `--scorer` and `--grader`, runs the default pattern matcher, and stamps `scoringMethod` on the report. |
| `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs` | 5-dim scorer | Ported five-dimension scorer reached only under `--scorer 5dim`. |
| `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/grader/harness.cjs` | Grader harness | Hosts the pluggable `noop`, `mock`, and `llm` grader paths the 5-dim scorer consumes. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/optin-scorer.vitest.ts` | Automated test | Verifies pattern-default parity, `--scorer 5dim` routing, grader selection, and `scoringMethod` stamping end to end. |
| `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/scorer.vitest.ts` | Automated test | Verifies the five-dimension scorer module behavior in isolation. |

---

## 4. SOURCE METADATA

- Group: Model-benchmark mode
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `model-benchmark-mode/opt-in-5dim-scorer.md`
Related references:
- [model-dispatcher.md](../../feature-catalog/model-benchmark-mode/model-dispatcher.md) — Model dispatcher
- [mode-records-and-gates.md](../../feature-catalog/model-benchmark-mode/mode-records-and-gates.md) — Mode records and hardening gates
