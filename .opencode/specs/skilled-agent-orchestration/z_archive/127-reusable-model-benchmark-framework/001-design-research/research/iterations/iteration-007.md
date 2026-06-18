# Iteration 7: Config/profile schema (the keystone)

- **Executor**: cli-codex gpt-5.5, reasoning=high, service_tier=fast, sandbox=read-only
- **Dispatch exit code**: 0
- **Tokens used**: 106,891

---

## Codex findings (verbatim)

**Current Contract**
The current profile is [default.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/assets/model-benchmark/benchmark-profiles/default.json:1):

```json
{
  "profileId": "default",
  "id": "default",
  "version": "1.0",
  "family": "deep-improvement",
  "targetPath": ".opencode/agents/deep-improvement.md",
  "fixtureDir": ".opencode/skills/deep-improvement/assets/model-benchmark/benchmark-fixtures",
  "fixtures": ["fixture-baseline", "fixture-improved", "fixture-edge"],
  "outputsDir": "{spec_folder}/improvement/benchmark-outputs",
  "metrics": ["score", "delta", "pass_rate"],
  "thresholdDelta": 0.05,
  "benchmark": {
    "requiredAggregateScore": 80,
    "minimumFixtureScore": 70,
    "repeatabilityTolerance": 0
  }
}
```

`run-benchmark.cjs` reads these profile keys today:

| Key | Evidence | Current meaning |
|---|---:|---|
| `fixtureDir` | [run-benchmark.cjs:96](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:96) | Primary fixture directory. |
| `benchmark.fixtureDir` | [run-benchmark.cjs:98](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:98) | Legacy/nested fallback. |
| `fixtures` | [run-benchmark.cjs:99](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:99) | Explicit fixture ids/files. |
| `benchmark.fixtures` | [run-benchmark.cjs:99](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:99) | Legacy/nested fallback. |
| `profileId` | [run-benchmark.cjs:421](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:421) | Preferred run identity. |
| `id` | [run-benchmark.cjs:421](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:421) | Identity fallback. |
| `version` | [run-benchmark.cjs:422](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:422) | Provenance only. |
| `benchmark.minimumFixtureScore` | [run-benchmark.cjs:441](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:441) | Per-fixture pass floor, default `70`. |
| `benchmark.requiredAggregateScore` | [run-benchmark.cjs:442](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:442) | Aggregate pass floor, default `80`. |
| `thresholdDelta` | [run-benchmark.cjs:449](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:449) | Ratio threshold subtracted from aggregate score. |
| `family` | [run-benchmark.cjs:469](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:469) | Report/state-log metadata. |
| `targetPath` | [run-benchmark.cjs:470](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:470) | Report/state-log target metadata. |
| `benchmark.repeatabilityTolerance` | [run-benchmark.cjs:486](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:486) | Threshold metadata, default `0`. |

It does **not** read `outputsDir` or `metrics`; `outputsDir` comes from `--outputs-dir` [run-benchmark.cjs:384](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:384). `--scorer` is CLI-only, valid values are `pattern|5dim`, and invalid values fall back to `pattern` [run-benchmark.cjs:389](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:389). `--grader` is CLI-only and defaults to `noop` [run-benchmark.cjs:397](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:397).

**Extended Schema**
Minimal additive shape:

```json
{
  "profileId": "126-004-framework-bakeoff",
  "id": "126-004-framework-bakeoff",
  "version": "1.1",
  "family": "deep-improvement",
  "mode": "framework-bakeoff",

  "targetPath": ".opencode/agents/deep-improvement.md",
  "fixtureDir": ".opencode/skills/deep-improvement/assets/model-benchmark/benchmark-fixtures",
  "fixtures": ["fixture-baseline", "fixture-improved", "fixture-edge"],
  "outputsDir": "{spec_folder}/improvement/benchmark-outputs",

  "models": [
    {
      "id": "minimax-m2-highspeed",
      "executor": "cli-opencode",
      "provider": "minimax-coding-plan",
      "model_slug": "MiniMax-M2.7-highspeed",
      "defaults": { "agent": "general", "timeout_ms": 600000 },
      "capabilities": ["code", "reasoning", "read-only"],
      "cost": { "max_calls": 126, "max_usd": 25.0 }
    }
  ],

  "frameworks": [
    { "id": "baseline", "registry": "frameworks.baseline" },
    { "id": "depth", "registry": "frameworks.depth" },
    { "id": "council", "registry": "frameworks.council" }
  ],

  "variants": [
    { "id": "low", "reasoning": "low" },
    { "id": "medium", "reasoning": "medium" },
    { "id": "high", "reasoning": "high" }
  ],

  "fixtureSelection": {
    "pack": "default",
    "include": ["fixture-baseline", "fixture-improved", "fixture-edge"],
    "filters": {
      "category": ["implementation", "review"],
      "tier": ["smoke", "core"],
      "hidden_tests": true
    }
  },

  "scoring": {
    "scorer": "5dim",
    "grader": "noop",
    "correctnessGate": {
      "enabled": true,
      "dimension": "D2",
      "policy": "fail-cell-on-hard-gate"
    },
    "dimensions": [
      { "id": "D1", "scorer_type": "deterministic", "weight": 0.25, "params": { "plugin": "acceptance" } },
      { "id": "D2", "scorer_type": "deterministic", "weight": 0.30, "params": { "plugin": "bundle-gate", "hard_gate": true } },
      { "id": "D3", "scorer_type": "deterministic", "weight": 0.20, "params": { "plugin": "cwd-check" } },
      { "id": "D4", "scorer_type": "graded", "weight": 0.15, "params": { "plugin": "hallucination", "grader": "noop" } },
      { "id": "D5", "scorer_type": "deterministic", "weight": 0.10, "params": { "plugin": "preplanning-regex" } }
    ]
  },

  "sampling": {
    "samplesPerCell": 2,
    "minSamplesForWinner": 2,
    "confidenceLevel": 0.95,
    "noiseFloor": { "policy": "require-margin", "min_delta": 0.03 }
  },

  "reporting": {
    "groupBy": ["framework", "variant", "fixture"],
    "leaderboard": { "metric": "aggregateScore", "direction": "desc" },
    "history": { "enabled": true, "dir": "report-history" }
  },

  "execution": {
    "timeout_ms": 600000,
    "retry": { "max_attempts": 3, "backoff_ms": [60000, 120000, 240000] },
    "outputsDir": "{spec_folder}/improvement/benchmark-outputs",
    "mock": false
  },

  "metrics": ["score", "delta", "pass_rate"],
  "thresholdDelta": 0.05,
  "benchmark": {
    "requiredAggregateScore": 80,
    "minimumFixtureScore": 70,
    "repeatabilityTolerance": 0
  }
}
```

Why this is minimal: `dispatch-model.cjs` needs `prompt_file`, `executor`, `model`, `agent`, `variant`, `state_dir`, `mock`, `mock_mode`, `cwd`, and `timeout_ms` [dispatch-model.cjs:13](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:13). It recognizes five executors [dispatch-model.cjs:105](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:105), resolves defaults from `modelBenchmarkConfig.target_model` [dispatch-model.cjs:87](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:87), and forwards `variant` only when present [dispatch-model.cjs:197](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:197). The scorer already accepts a rubric vector via `opts.rubric` [score-model-variant.cjs:193](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs:193), with default D1..D5 weights [score-model-variant.cjs:39](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs:39).

**Backward Compat**
The extension should be strictly additive.

`mode` defaults to today’s profile behavior: Lane B materialize + score, no sweep orchestration. Existing top-level `fixtureDir`, `fixtures`, `thresholdDelta`, `family`, `targetPath`, and `benchmark.*` remain honored exactly. `outputsDir` and `metrics` can remain profile metadata, but existing runners still take `--outputs-dir` and compute `totals.score/delta/pass_rate`.

New keys should be ignored by `run-benchmark.cjs` until a higher-level sweep runner consumes them. That preserves the current README contract: `run-benchmark.cjs` “reads a benchmark profile, scores each fixture output, and writes report.json” [README.md:21](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/README.md:21), while dispatch remains separately documented as the executor router [README.md:20](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/README.md:20).

**Composition**
Support one simple mechanism:

```json
{
  "extends": "base/lane-b-5dim.json",
  "overrides": {
    "profileId": "126-004-framework-bakeoff",
    "frameworks": ["baseline", "depth", "council"],
    "sampling": { "samplesPerCell": 2 }
  }
}
```

Rules: resolve `extends` relative to the current profile or profiles dir; deep-merge objects; replace arrays wholesale; forbid multiple inheritance. That avoids copy-paste for common fixtures/scoring/execution while keeping resolution debuggable.

**Validation**
Small dependency-free validator is enough.

Validate required legacy keys for current Lane B: `profileId|id`, `version`, `fixtureDir|benchmark.fixtureDir`, and `fixtures|benchmark.fixtures` when used by the materializer. Validate mode enum: `model-vs-model`, `framework-bakeoff`, `reasoning-ablation`, `prompt-vs-prompt`, `skill-regression`, `capability-profile`, plus legacy/default unset. Validate executor enum against `KNOWN_EXECUTORS` [dispatch-model.cjs:105](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:105). Validate scorer enum against `pattern|5dim` [run-benchmark.cjs:391](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:391). Validate dimension weights sum to `1.0 ± 0.001`, `scorer_type` enum, positive sample counts, and `confidenceLevel` in `(0,1)`.

MVP profile:

```json
{
  "profileId": "mvp",
  "version": "1.1",
  "mode": "framework-bakeoff",
  "fixtureDir": ".opencode/skills/deep-improvement/assets/model-benchmark/benchmark-fixtures",
  "fixtures": ["fixture-baseline"],
  "models": [{ "id": "default", "executor": "cli-opencode", "provider": "minimax-coding-plan", "model_slug": "MiniMax-M2.7-highspeed" }],
  "frameworks": [{ "id": "baseline", "registry": "frameworks.baseline" }],
  "variants": [{ "id": "high", "reasoning": "high" }],
  "scoring": { "scorer": "pattern" },
  "sampling": { "samplesPerCell": 1, "minSamplesForWinner": 1 },
  "execution": { "outputsDir": "{spec_folder}/improvement/benchmark-outputs", "mock": true }
}
```

**Proposals**
1. Add optional `mode`, `models`, `frameworks`, `variants`, `fixtureSelection`, `scoring`, `sampling`, `reporting`, and `execution` keys to benchmark profiles.
2. Keep `run-benchmark.cjs` legacy-compatible: old keys remain authoritative for scoring, new sweep keys are ignored unless a sweep orchestrator is introduced.
3. Normalize `scoring.dimensions` directly into `score-model-variant.cjs`’s existing `rubric.dims`.
4. Add a tiny validator module with enum checks and per-mode required-key checks.
5. Add single-parent `extends` with deep object merge and array replacement.
6. Treat correctness as an explicit gate policy, not another weighted dimension.

```json
[
  {
    "priority": "P0",
    "target": "benchmark profile schema",
    "change": "Add optional additive keys for mode, sweep axes, scoring, sampling, reporting, and execution while preserving legacy fixtureDir/fixtures/benchmark keys.",
    "confidence": 0.91
  },
  {
    "priority": "P0",
    "target": "profile validation",
    "change": "Implement dependency-free enum and required-key validation before materialization or sweep expansion.",
    "confidence": 0.88
  },
  {
    "priority": "P1",
    "target": "scoring adapter",
    "change": "Map scoring.dimensions to score-model-variant rubric.dims and keep --scorer pattern as the default when scoring is absent.",
    "confidence": 0.86
  },
  {
    "priority": "P1",
    "target": "dispatch orchestration",
    "change": "Use models/frameworks/variants to expand dispatch cells and feed executor/model/variant/timeout/mock into dispatch-model.cjs.",
    "confidence": 0.82
  },
  {
    "priority": "P2",
    "target": "profile composition",
    "change": "Support one extends profile plus overrides using deep object merge and array replacement.",
    "confidence": 0.76
  },
  {
    "priority": "P2",
    "target": "reporting",
    "change": "Use reporting.groupBy and leaderboard only in the new sweep report layer; leave current report.json unchanged for legacy runs.",
    "confidence": 0.8
  }
]
```
