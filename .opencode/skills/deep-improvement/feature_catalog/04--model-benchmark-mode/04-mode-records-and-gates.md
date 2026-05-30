---
title: "Mode records and hardening gates"
description: "Stamps a mode field on every state record and exposes two env gates that harden the 5-dim scorer."
---

# Mode records and hardening gates

## 1. OVERVIEW

Stamps a mode field on every state record and exposes two env gates that harden the 5-dim scorer.

This feature makes runs attributable and gives operators two opt-in safety controls over the five-dimension scorer. It covers the record-level `mode` field and the two hardening environment gates.

---

## 2. CURRENT REALITY

Every state record carries `mode: agent-improvement` or `mode: model-benchmark`, so the reducer and downstream consumers can tell which path produced a record. Benchmark reports and `benchmark_run` records additionally carry `scoringMethod: pattern` or `scoringMethod: 5dim` for finer attribution within the model-benchmark path.

Two environment gates harden the five-dimension scorer, and both default to the permissive value for backward-compat. `DEEP_AGENT_ALLOW_CRITERIA_EXEC=0` refuses criteria-driven shell execution inside the 5-dim scorer and substitutes a skipped-criterion detail instead. `DEEP_AGENT_GRADER_CACHE_RAW=0` redacts raw grader output from the on-disk cache. Leaving either unset, or set to the default value, keeps the prior behavior.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/deep-improvement/scripts/model-benchmark/run-benchmark.cjs` | Benchmark runner | Stamps `mode: model-benchmark` and `scoringMethod` on benchmark reports and `benchmark_run` records. |
| `.opencode/skills/deep-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs` | 5-dim scorer | Honors `DEEP_AGENT_ALLOW_CRITERIA_EXEC=0` to refuse criteria-driven shell execution. |
| `.opencode/skills/deep-improvement/scripts/model-benchmark/scorer/grader/harness.cjs` | Grader | Honors `DEEP_AGENT_GRADER_CACHE_RAW=0` by redacting raw grader output before it is written to the on-disk cache (`scorer/lib/cache.cjs` stores whatever the harness passes). |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/deep-improvement/scripts/tests/optin-scorer.vitest.ts` | Automated test | Verifies `scoringMethod` stamping across the pattern and 5dim paths. |
| `.opencode/skills/deep-improvement/scripts/tests/scorer.vitest.ts` | Automated test | Verifies 5-dim scorer behavior under the criteria-exec and grader-cache gates. |

---

## 4. SOURCE METADATA

- Group: Model-benchmark mode
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `04--model-benchmark-mode/04-mode-records-and-gates.md`
