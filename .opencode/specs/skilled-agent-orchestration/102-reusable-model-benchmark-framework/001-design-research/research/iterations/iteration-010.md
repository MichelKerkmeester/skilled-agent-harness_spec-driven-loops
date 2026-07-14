# Iteration 10: Synthesis + roadmap (reuse vs net-new, MVP, phases, risks)

- **Executor**: cli-codex gpt-5.5, reasoning=high, service_tier=fast, sandbox=read-only
- **Dispatch exit code**: 0
- **Tokens used**: 111,685

---

## Codex findings (verbatim)

My read: build this as an extension of Lane B, not a new rig. Lane B already has the core bones: profile loading, fixture materialization, executor dispatch, 5-dim scoring, report history, and a shared loop host. The missing pieces are the matrix layer, framework registry, hard fixtures, and statistics.

Evidence anchors: current profile shape is [default.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/assets/model-benchmark/benchmark-profiles/default.json:2); artifact fixtures are heading/pattern contracts in [fixture-baseline.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/assets/model-benchmark/benchmark-fixtures/fixture-baseline.json:5); `run-benchmark.cjs` loads profile fixtures, supports `pattern|5dim`, writes `report.json`, and snapshots history at [run-benchmark.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:96), [run-benchmark.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:391), [run-benchmark.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:462), [run-benchmark.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:510). `dispatch-model.cjs` already has executor routing at [dispatch-model.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:105), and the 5-dim scorer exposes reusable D1-D5 scoring at [score-model-variant.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs:40).

**Reuse Table**

| Component | Class | Lane B asset | Build direction |
|---|---:|---|---|
| dispatcher | EXTEND | `dispatch-model.cjs` executor map + variant forwarding | Add normalized envelope: output, latency, nullable tokens/cost, provider/model metadata, OpenCode JSON parsing. |
| scorer | EXTEND | `score-model-variant.cjs`, deterministic checks, grader harness | Keep 5dim as scorer family; add correctness gate and plugin-style deterministic adapters. |
| profile loader | EXTEND | `run-benchmark.cjs` profile reading | Add `mode`, `sweep`, `models`, `frameworks`, `sampling`, `reporting`, `scoring`; preserve legacy keys. |
| loop/sweep host | EXTEND | `shared/loop-host.cjs` | Add generic matrix expander before Lane B’s materialize/run path; no bespoke framework branches. |
| reduce/report | EXTEND | `shared/reduce-state.cjs` + `report.json`/history | Add grouped aggregate, trust verdict, leaderboard, saturation and regression reducers. |
| fixtures | REUSE-AS-IS | artifact-contract JSON fixtures | Keep as T1 smoke/regression fixtures, not ranking fixtures. |
| frameworks | NET-NEW | builds on 126 hard-coded framework idea, not Lane B | New registry + slot renderer for RCAF/RACE/CIDI/TIDD-EC/COSTAR/CRISPE/CRAFT. |
| stats | NET-NEW | builds on Iteration 4 design | New `stats.cjs`: mean/median/MAD/quantile/bootstrap CI/trust verdict. |
| fixture taxonomy/tiers | NET-NEW | builds on 120/126 fixture lessons | New JSON+sidecar taxonomy with category, tier, hidden oracle, saturation policy. |

**Architecture**

```text
ONE benchmark profile
  ├─ fixtureSource: fixtureDir + fixtureSelection + taxonomy/tier filters
  │    └─ existing artifact JSON fixtures + new T3/T4 fixture packs
  ├─ frameworkSource: framework registry + output contracts + technique axes
  │    └─ new registry renderer materializes prompts per fixture/framework
  ├─ sweep axes: models × executors × variants × frameworks × fixtures × samples
  │    └─ new matrix expander in/near loop-host
  ├─ dispatcher
  │    └─ dispatch-model.cjs executor routing
  ├─ scorer
  │    └─ 5dim + deterministic checks + grader harness + correctness gate
  └─ reporter
       └─ report.json/report-history + aggregate.json + synthesis.md + trust verdict
```

**Roadmap**

| Phase | Deliverable | Target files | Acceptance |
|---|---|---|---|
| P0 / MVP | Config-driven framework bake-off and model-vs-model with saturation-safe reports | `benchmark-profiles/*.json`, `loop-host.cjs`, new matrix expander, framework registry, renderer, `run-benchmark.cjs`, scorer adapter, 2-3 T3/T4 fixtures | One profile can run `framework-bakeoff` and `model-vs-model`; correctness is a gate; report says `WINNER/TIE/INCONCLUSIVE`; easy fixture saturation cannot produce a winner claim. |
| P1 | Statistical and operational reliability | new `stats.cjs`, `dispatch-model.cjs`, reporting reducers, CI fixture pack, taxonomy docs/profiles | Multi-sample rows exist; paired CI/noise floor gates winner claims; cost/latency envelope is reported; CI can fail on regression; leaderboard supports `groupBy`. |
| P2 | Optimization and richer capability analysis | mutation operators, profile inheritance, executor cost parsers, custom framework templates, capability radar reducers | Hill-climb can mutate framework/technique axes; profiles can extend base profiles; capability radar shows category × tier × dimension; custom framework is data-only. |

**Saturation Fix**

The old mis-read was ranking on columns after correctness had flattened. The fix is: correctness gates eligibility, harder tiered fixtures create variance, dimensions stay separate, reports emit trustworthiness before leaderboard language, and saturation auto-detect marks fixtures as `keep`, `promote`, `smoke-only`, or `retire`.

**Risks**

| Risk | Mitigation |
|---|---|
| Dispatch cost blow-up | Preflight call count = axes product; require `samplesPerCell` caps and profile budget gates. |
| Grader nondeterminism/cost | Default `noop`/deterministic; require explicit `llm`; cache by rubric/output/model hash. |
| Scope sprawl | P0 excludes mutation, full stats, custom templates, and cost parsers. |
| Breaking Lane B | Keep legacy `run-benchmark.cjs` path and old profile keys; matrix layer is additive. |
| Provider quirks | Move agent/variant/format policies into capability config; unknown token/cost parsers return `null`, not fake values. |

**Big Decisions**

1. Whether the matrix expander is a new `sweep-benchmark.cjs` or embedded in `loop-host.cjs`. I’d make it a new module and let `loop-host` call it.
2. Whether framework registry lives under `sk-prompt/assets` or `deep-improvement/assets/model-benchmark`. I’d keep canonical framework definitions in `sk-prompt`, benchmark-local output contracts in `deep-improvement`.
3. Whether to extend `run-benchmark.cjs` or keep it as the row scorer. I’d keep it mostly legacy and add a sweep/report layer around it.
4. How strict P0 fixtures should be. I’d include only a couple T3/T4 fixtures, enough to prove non-saturation.
5. Whether correctness gate threshold is always `1.0`. I’d start with `1.0` for hidden deterministic tests, configurable for partial-credit fixtures.

Crisp MVP: one profile can run either `framework-bakeoff` or `model-vs-model` by changing config, using a framework registry, Lane B dispatcher/scorer, correctness-as-gate, trustworthiness verdict, and a small T3/T4 fixture pack that prevents saturated correctness from being misread as a real winner.

```json
[
  {
    "priority": "P0",
    "target": "assets/model-benchmark/benchmark-profiles/*.json",
    "change": "Add additive profile keys for mode, sweep axes, models, frameworks, variants, scoring gate, sampling, and reporting while preserving current Lane B profile keys.",
    "confidence": 0.92
  },
  {
    "priority": "P0",
    "target": "scripts/shared/loop-host.cjs + new sweep module",
    "change": "Add a generic matrix expander over models x executors x variants x frameworks x fixtures x samples that feeds Lane B dispatch/scoring without mode-specific rig branches.",
    "confidence": 0.87
  },
  {
    "priority": "P0",
    "target": "framework registry + renderer",
    "change": "Create a machine-readable framework registry and slot renderer so RCAF/RACE/CIDI/TIDD-EC/COSTAR-style bake-offs are data-driven.",
    "confidence": 0.9
  },
  {
    "priority": "P0",
    "target": "scripts/model-benchmark/scorer/",
    "change": "Reuse the 5dim and deterministic scorer stack, but make correctness a gate and report per-dimension scores separately.",
    "confidence": 0.91
  },
  {
    "priority": "P0",
    "target": "assets/model-benchmark/benchmark-fixtures/",
    "change": "Add a small T3/T4 fixture pack with hidden deterministic oracles; keep current artifact-contract fixtures as smoke/regression only.",
    "confidence": 0.88
  },
  {
    "priority": "P0",
    "target": "reporting layer",
    "change": "Emit trustworthiness verdict WINNER/TIE/INCONCLUSIVE plus saturation status before leaderboard output.",
    "confidence": 0.93
  },
  {
    "priority": "P1",
    "target": "scripts/model-benchmark/stats.cjs",
    "change": "Add dependency-free mean, median, MAD, quantile, seeded paired bootstrap CI, and noise-floor utilities.",
    "confidence": 0.86
  },
  {
    "priority": "P1",
    "target": "scripts/model-benchmark/dispatch-model.cjs",
    "change": "Return normalized dispatch envelopes with latency, provider/model metadata, nullable token/cost fields, and OpenCode JSON parsing where available.",
    "confidence": 0.82
  },
  {
    "priority": "P1",
    "target": "scripts/shared/reduce-state.cjs",
    "change": "Add grouped leaderboard reducers and saturation auto-detect by fixture, dimension, model, framework, and variant.",
    "confidence": 0.8
  },
  {
    "priority": "P2",
    "target": "profile inheritance + mutation operators",
    "change": "Add single-parent profile extends, custom framework template loading, and optional hill-climb over framework and technique axes.",
    "confidence": 0.74
  }
]
```
