---
title: "Opt-in 5-dimension scorer"
description: "Selects the pattern matcher by default or the opt-in five-dimension scorer for model-benchmark outputs."
---

# Opt-in 5-dimension scorer

## 1. OVERVIEW

Selects the pattern matcher by default or the opt-in five-dimension scorer for model-benchmark outputs.

This feature controls how `run-benchmark.cjs` judges materialized outputs. It keeps the deterministic byte-identical scorer as the default and exposes the richer five-dimension scorer behind explicit flags.

---

## 2. CURRENT REALITY

`run-benchmark.cjs --scorer pattern` is the default. It uses the byte-identical heading and pattern matcher, so a run with no scorer flag produces the same deterministic result as before. `--scorer 5dim` is opt-in: it routes materialized outputs through `scripts/scorer/score-model-variant.cjs`, the ported five-dimension scorer that combines deterministic checks with a pluggable grader.

Grader selection is separate from scorer selection. `--grader noop` is the default and stays deterministic with no model dispatch. `--grader mock` selects the stub grader and `--grader llm` selects the real grader. The benchmark report and the `benchmark_run` record carry `scoringMethod: pattern` or `scoringMethod: 5dim`, so downstream consumers can attribute each result to the scorer that produced it.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/deep-agent-improvement/scripts/run-benchmark.cjs` | Benchmark runner | Resolves `--scorer` and `--grader`, runs the default pattern matcher, and stamps `scoringMethod` on the report. |
| `.opencode/skills/deep-agent-improvement/scripts/scorer/score-model-variant.cjs` | 5-dim scorer | Ported five-dimension scorer reached only under `--scorer 5dim`. |
| `.opencode/skills/deep-agent-improvement/scripts/scorer/grader/harness.cjs` | Grader harness | Hosts the pluggable `noop`, `mock`, and `llm` grader paths the 5-dim scorer consumes. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/deep-agent-improvement/scripts/tests/optin-scorer.vitest.ts` | Automated test | Verifies pattern-default parity, `--scorer 5dim` routing, grader selection, and `scoringMethod` stamping end to end. |
| `.opencode/skills/deep-agent-improvement/scripts/tests/scorer.vitest.ts` | Automated test | Verifies the five-dimension scorer module behavior in isolation. |

---

## 4. SOURCE METADATA

- Group: Model-benchmark mode
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `04--model-benchmark-mode/03-opt-in-5dim-scorer.md`
