# Iteration 9: Situational modes (model-vs-model, bake-off, ablation, regression, capability)

- **Executor**: cli-codex gpt-5.5, reasoning=high, service_tier=fast, sandbox=read-only
- **Dispatch exit code**: 0
- **Tokens used**: 153,705

---

## Codex findings (verbatim)

**Current State**

Deep-improvement already has lanes, not situation modes: Lane A agent-improvement, Lane B model-benchmark, Lane C skill-benchmark in [SKILL.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/SKILL.md:29). Lane B is selected by `/deep:start-model-benchmark-loop` or `loop-host.cjs --mode=model-benchmark`; `loop-host` accepts `agent-improvement`, `model-benchmark`, and `skill-benchmark` as runtime modes, with unknown modes falling back to agent-improvement ([SKILL.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/SKILL.md:282), [loop-host.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/shared/loop-host.cjs:31), [loop-host.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/shared/loop-host.cjs:140)).

The model-benchmark command advertises execution mode `:auto|:confirm`, scorer `pattern|5dim`, grader `noop|mock|llm`, and optional executor/model for real graded dispatch ([start-model-benchmark-loop.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/deep/start-model-benchmark-loop.md:2), [start-model-benchmark-loop.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/deep/start-model-benchmark-loop.md:170), [start-model-benchmark-loop.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/deep/start-model-benchmark-loop.md:335)). `run-benchmark.cjs` supports `--scorer pattern|5dim`, `--grader noop|mock|llm`, `--integration-report`, profile/output/state/label flags, and writes `scoringMethod`, `grader`, aggregate score, rows, thresholds, and mode-tagged state rows ([run-benchmark.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:389), [run-benchmark.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:462), [run-benchmark.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:512)). So “model vs framework vs ablation vs regression” is not first-class today; it is implicit in the profile/fixtures/operator setup.

I found no literal shipped “keystone schema” file in the requested read set. The shipped profile anchor is `default.json`: `profileId/id/version/family/targetPath/fixtureDir/fixtures/outputsDir/metrics/thresholdDelta/benchmark thresholds` ([default.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/assets/model-benchmark/benchmark-profiles/default.json:2)). The deltas below assume that schema grows a thin `mode` plus `sweep` object.

**Profile Deltas A-F**

A) **model-vs-model** fixes prompt framework + fixtures, sweeps `models[]`, uses `5dim` when capability quality matters or `pattern` for fast structural checks, and leaderboards by model. This matches Lane B’s intent to benchmark a model/prompt framework and `dispatch-model.cjs` already routes executor/model/variant across CLI families ([SKILL.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/SKILL.md:284), [dispatch-model.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:105)).
```json
{"mode":"model-vs-model","fixed":{"prompt":"base","fixtures":"tiered"},"sweep":{"axis":"model","values":["gpt-5.5","mimo-v2.5-pro"]},"scorer":"5dim","leaderboard":{"groupBy":"model"}}
```

B) **framework bake-off** fixes model + fixtures and sweeps prompt frameworks. 126/004 did exactly this manually: 5 frameworks x 2 fixtures, real MiMo dispatch, deterministic scoring, and “hold everything constant but the framework” ([implementation-summary.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/126-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/implementation-summary.md:66), [implementation-summary.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/126-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/implementation-summary.md:109)).
```json
{"mode":"framework-bakeoff","fixed":{"model":"mimo-v2.5-pro","fixtures":["chunk","parseRange"]},"sweep":{"axis":"promptFramework","values":["RCAF","RACE","CIDI","TIDD-EC","COSTAR"]},"leaderboard":{"groupBy":"promptFramework"}}
```

C) **reasoning-effort ablation** fixes model + prompt + fixtures and sweeps `variant/reasoningEffort`. This is already technically aligned with `dispatch-model.cjs`, which forwards `variant` only when set and maps it to `--variant`, Claude `--effort`, or Codex `model_reasoning_effort` ([dispatch-model.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:18), [dispatch-model.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:197), [dispatch-model.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:211)).
```json
{"mode":"reasoning-ablation","fixed":{"model":"cli-codex/gpt-5.5","prompt":"COSTAR","fixtures":"tiered"},"sweep":{"axis":"variant","values":["low","medium","high"]},"leaderboard":{"groupBy":"variant"}}
```

D) **prompt-vs-prompt** fixes model + fixtures and sweeps two prompt artifacts. It is the smallest form of the same sweep machinery: two candidates, same scorer, head-to-head delta, grouped by prompt id.
```json
{"mode":"prompt-vs-prompt","fixed":{"model":"mimo-v2.5-pro","fixtures":"holdout"},"sweep":{"axis":"prompt","values":["candidate-a.md","candidate-b.md"]},"gate":{"minDelta":0.02},"leaderboard":{"groupBy":"prompt"}}
```

E) **skill-change regression** is closest to Lane B as-is: run the same profile before/after a skill edit and compare aggregate/fixture rows. Lane B already writes profile provenance, thresholds, report history snapshots, and mode-tagged benchmark rows, which are the regression substrate ([run-benchmark.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:456), [run-benchmark.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:507), [run-benchmark.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:512)).
```json
{"mode":"skill-regression","fixed":{"profile":"default","fixtures":"default"},"compare":{"baseline":"before","candidate":"after"},"gate":{"noAggregateDrop":true,"noNewFailedFixtures":true},"leaderboard":{"groupBy":"runLabel"}}
```

F) **capability profiling** fixes one model and sweeps the full tiered fixture taxonomy, then reports category x tier x dimension. The three-tier fixture idea exists in repo evidence: generated/decontaminated, hand-authored holdout, and adversarial/negative, with the T1-T2 gap as a circularity meter ([iteration-003.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/opus/iterations/iteration-003.md:83)). The 5dim scorer already returns D1-D5 dimensions and weighted score ([score-model-variant.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs:39), [score-model-variant.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs:255)).
```json
{"mode":"capability-profile","fixed":{"model":"gpt-5.5"},"sweep":{"axis":"fixtureSet","values":"allCategoriesByTier"},"scorer":"5dim","leaderboard":{"groupBy":["category","tier","dimension"]}}
```

**Reuse vs New Machinery**

Reuse Lane B mostly as-is for E. D can reuse Lane B scoring but needs the new two-candidate sweep wrapper. A/B/C/F need new sweep machinery because current `loop-host` plans one profile run, not an axis matrix ([loop-host.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/shared/loop-host.cjs:155)). B is the clearest proof: 126/004 built a separate eval rig because Lane B’s fixture model did not fit the framework bake-off cleanly ([implementation-summary.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/126-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/implementation-summary.md:109)).

**Capability Payoff**

F is the anti-saturation payoff. In 126/004, assertion-pass saturated at 100% for all frameworks, so the benchmark could not separate raw correctness and had to use format/length ([synthesis.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/126-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/synthesis.md:12), [synthesis.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/126-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/synthesis.md:55)). A tiered taxonomy plus D1-D5 dimensions gives a radar where a frontier model can still show weakness by category/tier/dimension even when easy fixtures are saturated.

**Mode Selector**

Mode should be one profile field, not new rig code: `mode` sets defaults for `sweep.axis`, scorer, gate, and leaderboard; the operator fills the swept axis. That matches the existing architecture direction: mode selects implementations while seams stay mode-agnostic ([research.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/002-research-model-benchmark-implementation/research/research.md:25), [research.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/002-research-model-benchmark-implementation/research/research.md:34)). The runner should not know “framework bake-off” as a bespoke branch; it should know “expand matrix, dispatch cells, score rows, reduce by groupBy.”

**Proposals**

1. Add `mode` and `sweep.axis|values` to benchmark profiles; keep `run-benchmark.cjs` scoring unchanged.
2. Add one matrix expander before Lane B: materialize cell configs, dispatch, score, append rows.
3. Add default presets for A-F: default scorer, gate, and leaderboard per `mode`.
4. Promote `variant` to a profile sweep value, since dispatch already supports it.
5. Add capability report reduction: `category x tier x dimension`, plus T1-T2 circularity gap.
6. Backfill 126/004 as a `framework-bakeoff` profile fixture to prove no new rig code is needed.

```json
[
  {"priority":"P0","target":"assets/model-benchmark/benchmark-profiles/*.json","change":"Add first-class profile fields: mode, sweep.axis, sweep.values, fixed, gate, leaderboard.groupBy.","confidence":0.91},
  {"priority":"P0","target":"scripts/shared/loop-host.cjs","change":"Add a generic sweep expander for Lane B that runs the same materialize -> dispatch -> run-benchmark path per cell, without situation-specific branches.","confidence":0.86},
  {"priority":"P1","target":"scripts/model-benchmark/run-benchmark.cjs","change":"Persist sweep cell metadata on report rows and benchmark_run records: mode, axis, cellId, fixed values, group keys.","confidence":0.88},
  {"priority":"P1","target":"scripts/model-benchmark/dispatch-model.cjs","change":"Expose variant/reasoningEffort from profile cells, reusing existing executor-specific forwarding.","confidence":0.84},
  {"priority":"P1","target":"references/model-benchmark/benchmark_operator_guide.md","change":"Document A-F as profile modes with defaults, emphasizing that only profile shape changes, not rig code.","confidence":0.9},
  {"priority":"P2","target":"scripts/shared/reduce-state.cjs","change":"Add grouped leaderboard and capability radar reducers for groupBy=model|promptFramework|variant|prompt|category,tier,dimension.","confidence":0.78}
]
```
