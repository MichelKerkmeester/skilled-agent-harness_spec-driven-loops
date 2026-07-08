---
title: Improvement Config Reference
description: Field-level documentation for improvement_config.json runtime configuration.
trigger_phrases:
  - "improvement config reference"
  - "improvement config fields"
  - "dimension weight tuning"
  - "stop rule thresholds"
  - "model-benchmark mode config"
importance_tier: normal
contextType: implementation
version: 1.17.0.12
---

# Improvement Config Reference

Field-level reference for `improvement_config.json`. Use this when modifying runtime configuration for a deep-improvement packet.

---

## 1. OVERVIEW

### Purpose

Documents each field in `improvement_config.json` so operators can tune scoring, benchmarking, stop rules, and file protection without guessing.

### When to Use

Use this reference when:
- Adjusting dimension weights for a specific target
- Changing stop rule thresholds
- Enabling or disabling dynamic profiling
- Understanding what each config section controls

---

## 2. FIELDS

### Top-Level

| Field | Type | Description |
| --- | --- | --- |
| `target` | string | Path to the canonical target agent file |
| `targetProfile` | string | Active profile ID (always `dynamic` in the current release) |
| `targetKind` | string | Classification: `dynamic` (default), `derived`, or `candidate-only` |
| `maxIterations` | number | Maximum loop iterations before forced stop |
| `executionMode` | string | AUTONOMOUS or INTERACTIVE |
| `proposalOnly` | boolean | When true, candidates cannot be promoted |
| `promotionEnabled` | boolean | When true, guarded promotion is available |

### Scoring

| Field | Type | Description |
| --- | --- | --- |
| `thresholdDelta` | number | Minimum score improvement for candidate-better recommendation |
| `hardRejectOnMissingTemplate` | boolean | Reject if required template references are absent |
| `hardRejectOnNestedDelegation` | boolean | Reject if nested delegation is detected |
| `simplicityTieBreak` | boolean | Prefer simpler candidate when scores tie |
| `dynamicProfileEnabled` | boolean | Must remain `true`; dynamic mode is the sole scoring path via generate-profile.cjs |
| `dimensionWeights` | object | Per-dimension weights for 5D scoring (must sum to 1.0) |

### Stop Rules

| Field | Type | Description |
| --- | --- | --- |
| `maxConsecutiveTies` | number | Stop after N consecutive tie scores |
| `maxInfraFailuresPerProfile` | number | Stop after N infrastructure failures |
| `maxWeakBenchmarkRunsPerProfile` | number | Stop after N weak benchmark results |
| `stopOnDriftAmbiguity` | boolean | Stop if mirror drift report is ambiguous |
| `stopOnDimensionPlateau` | boolean | Stop if all 5 dimensions plateau (identical scores over the plateau window) |
| `plateauWindow` | number | Number of trailing scores to compare for plateau detection (default: 3) |

### Model-Benchmark Mode

The model-benchmark mode (run via `scripts/shared/loop-host.cjs --mode=model-benchmark`) is selected at the command line, not by a config field. Its operator-facing levers:

| Lever | Where | Description |
| --- | --- | --- |
| `--mode` | `loop-host.cjs` | `agent-improvement` (default) or `model-benchmark`. Unknown values warn and fall back to agent-improvement. |
| `--scorer` | `run-benchmark.cjs` | `pattern` (default, byte-identical heading/pattern matcher) or `5dim` (routes outputs through `scripts/model-benchmark/scorer/score-model-variant.cjs`). |
| `--grader` | `run-benchmark.cjs` | `noop` (default, deterministic), `mock`, or `llm`. Only consulted under `--scorer 5dim`. |
| `DEEP_AGENT_ALLOW_CRITERIA_EXEC` | env | Set to `0` to refuse criteria-driven shell execution in the 5-dim scorer. Default permissive. |
| `DEEP_AGENT_GRADER_CACHE_RAW` | env | Set to `0` to redact raw grader output from the on-disk cache. Default permissive. |

The default agent-improvement path is unaffected when no mode flag is set. See SKILL.md "Lane B" for the full contract.

---

## 3. RELATED RESOURCES

- `improvement_config.json`: the actual config file
- `../../references/model_benchmark/evaluator_contract.md`: scoring rubric details
- `../../references/shared/promotion_rules.md`: stop condition reference
