# Iteration 2: Runnable Live-Routing Benchmark Matrix

## Route Proof

`Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true`

- Iteration: `2`
- Run: `2`
- Agent definition loaded: `true`
- Execution remained one LEAF research iteration; no sub-agent was dispatched.

## Focus

This iteration turns the paired named-versus-null proposal into a runnable, non-mutating benchmark. It specifies corpus strata, fixture variants, helper-resource arms, blind grading, repeated sampling, per-hub falsification margins, and trace evidence. Migration/schema changes and second-order production effects remain for iteration 3.

## Findings

1. **Use isolated hub snapshots, not edits to live hubs, and cross policy with helper shape as separate factors.** For each hub, copy its parent `SKILL.md`, `hub-router.json`, `mode-registry.json`, and referenced routing helper into an executing packet's fixture directory, validate paths, and dispatch Mode B against that fixture root. Build a `2 x 4` matrix: policy `{named default, null}` crossed with helper `{full registry, compressed card, child hint, none}`. Keep signals, mode order, child packets, executor, prompt, and trace contract byte-identical within each matched block. The current live executor already accepts a skill root, issues a read-only routing-analysis prompt, and captures model-stated routing plus tool activation/read evidence; Lane C is diagnostic and does not mutate target skills or gold. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/live-executor.cjs:18-26] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/live-executor.cjs:60-90] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/live-executor.cjs:270-342] [SOURCE: .opencode/commands/deep/skill-benchmark.md:138-146] [INFERENCE: fixture snapshots isolate policy presentation and helper content without changing a shipped hub.]

2. **The corpus should be stratified by ambiguity, not sampled only from existing happy paths.** Author 12 prompt stems per hub: four true zero-signal/hub-identity prompts whose gold is `defer`, four adjacent-mode boundary prompts whose gold is one targeted clarification question, and four weak-but-resolvable prompts balanced across non-default and default children. Derive seeds from each hub's playbook, then paraphrase them without mode ids, aliases, resource basenames, or commands; reserve one third as blind holdouts. Existing benchmark doctrine requires meaningful C1/C2 coverage and one consolidated question for under-specified cells, while shipped holdouts already mark router-keyword blindness and tolerable secondary defer outcomes. [SOURCE: .opencode/skills/sk-doc/create-benchmark/references/behavior_benchmark/behavior_benchmark_guide.md:155-184] [SOURCE: .opencode/skills/cli-external-orchestration/manual_testing_playbook/hub_routing/holdout_second_opinion.md:1-22] [SOURCE: .opencode/skills/mcp-tooling/manual_testing_playbook/hub_routing/holdout_web_design_reference.md:1-31] [INFERENCE: equal ambiguity strata prevent a dominant-mode prior from determining the benchmark result.]

3. **The four helper arms test distinct hypotheses and must not be collapsed.** `full registry` exposes the complete mode objects; `compressed card` contains only mode id, one-line use-when cue, one discriminating question, and one exclusion cue per mode, with alphabetical or seeded-random order and no default badge; `child hint` contains only the candidate child's name plus explicit "suggestion, ask if unclear" wording; `none` supplies no fallback material. Full registries contain operational fields far beyond disambiguation, while current smart-routing files explicitly separate mode choice from leaf-resource choice and keep no-match behavior as confirm-before-load. Parent-routing doctrine also says children must remain discoverable without flattening every child resource into an always-loaded bundle. [SOURCE: .opencode/skills/mcp-tooling/mode-registry.json:1-31] [SOURCE: .opencode/skills/mcp-tooling/mode-registry.json:32-101] [SOURCE: .opencode/skills/mcp-tooling/shared/references/smart_routing.md:64-76] [SOURCE: .opencode/skills/mcp-tooling/shared/references/smart_routing.md:115-127] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/routing_optimization.md:112-127] [INFERENCE: the compressed card is the only arm designed to preserve complete mode discoverability while removing registry implementation noise and named-child anchoring.]

4. **Blind grading should combine a primary routing outcome with the repository's evidence-scored dimensions.** Strip fixture/arm names from transcripts, randomize case ids, and have two graders independently assign: route/clarification correctness, presentation fidelity, unsupported-mode invention, completion integrity, and efficiency, each `0/1/2`; adjudicate disagreements of more than one point or different terminal buckets. Also classify exactly one primary outcome: `correct_pick`, `targeted_question`, `unsupported_pick`, `arbitrary_pick`, `freeze`, or `invented_mode`. The shared framework requires scores to come from captured evidence rather than executor claims, defines 0/1/2 dimensions, and provides mutually exclusive terminal buckets. Live traces preserve the declared workflow mode, stated resources, activation, tool calls, observed reads, bounded response text, and model id needed for audit. [SOURCE: .opencode/skills/system-deep-loop/shared/behavior-benchmark/framework.md:116-164] [SOURCE: .opencode/skills/system-deep-loop/shared/behavior-benchmark/framework.md:175-202] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/live-executor.cjs:303-340] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/live-executor.cjs:358-380] [INFERENCE: dual blind grading prevents knowledge of `defaultMode` from turning a suggestion into an apparently correct route after the fact.]

5. **Run three independent replays per cell as the screening floor, block by prompt stem and model, and confirm threshold-crossing effects with ten replays.** The screening matrix is `5 hubs x 12 stems x 8 arms x 3 models x 3 replays = 4,320` live dispatches. Predeclare three model families and fixed variants; rotate arm order within each `(hub, stem, model, replay)` block. Any primary effect whose interval touches a hub threshold is rerun to ten replays for that affected hub/stratum. Report paired risk differences with a prompt-and-model clustered bootstrap interval and Holm correction across the five hub primary tests. The repository's stability helper refuses a verdict below three replays, uses a `0.95` stability warning threshold, and treats insufficient samples as unstable; the sk-prompt summary explicitly warns that a single live sample is noise until reproduced. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs:16-35] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs:112-135] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs:159-191] [SOURCE: .opencode/skills/sk-prompt/benchmark/BENCHMARK-SUMMARY.md:16-25] [INFERENCE: three replays are a screening minimum, not enough to establish a small policy effect.]

6. **Falsification must be hub-specific because mode count and misroute cost differ.** Use the table below as preregistered practical margins. A named default is falsified as harmless when the named-minus-null increase in `unsupported_pick + arbitrary_pick` on defer/question strata meets the margin and the 95% paired interval excludes zero. Null is falsified as preferable when its increase in `freeze + unnecessary targeted_question` on resolvable strata meets the friction margin, the interval excludes zero, and null reduces wrong picks by less than 3 percentage points. These are policy falsification tests, not claims about natural traffic prevalence. [SOURCE: .opencode/skills/sk-prompt/hub-router.json:4-18] [SOURCE: .opencode/skills/cli-external-orchestration/hub-router.json:4-30] [SOURCE: .opencode/skills/system-deep-loop/hub-router.json:4-50] [SOURCE: .opencode/skills/mcp-tooling/hub-router.json:4-29] [SOURCE: .opencode/skills/sk-design/hub-router.json:4-25] [INFERENCE: lower margins are appropriate where a wrong route can launch a materially different mutating workflow or where six to seven modes make a single-child prior especially strong.]

| Hub | Modes | Named default | Wrong-pick margin | Null-friction margin | Additional hard failure |
|---|---:|---|---:|---:|---|
| `sk-prompt` | 2 | `prompt-improve` | 10 pp | 10 pp | Named arm loses if it routes a named-model request to improve in >=5% of cases |
| `cli-external-orchestration` | 3 | `cli-opencode` | 8 pp | 8 pp | Any >=5% unsupported provider commitment is a failure |
| `system-deep-loop` | 7 | `research` | 5 pp | 8 pp | Any >=3% launch of the wrong mutating loop is a failure |
| `mcp-tooling` | 6 | `mcp-chrome-devtools` | 5 pp | 8 pp | Any >=3% wrong external/tool transport commitment is a failure |
| `sk-design` | 6 | `interface` | 5 pp | 8 pp | Any >=3% wrong mutating/external mode commitment is a failure |

## Runnable Matrix

### Fixture Manifest

Each generated fixture manifest should record:

```json
{
  "hub": "mcp-tooling",
  "policy": "named|null",
  "helper": "full-registry|compressed-card|child-hint|none",
  "sourceHashes": {
    "SKILL.md": "sha256:...",
    "hub-router.json": "sha256:...",
    "mode-registry.json": "sha256:..."
  },
  "onlyAllowedDifferences": ["routerPolicy.defaultMode", "fallbackHelperPayload"],
  "liveHubMutated": false
}
```

Before dispatch, reject a pair if a normalized diff contains any path outside `onlyAllowedDifferences`. Keep the grader blind to `policy`, `helper`, source path, and arm order.

### Trace Record

Persist one append-only row per dispatch with:

```json
{
  "caseId": "opaque-id",
  "hub": "mcp-tooling",
  "stemId": "MT-Z03",
  "stratum": "zero-signal|boundary|resolvable",
  "model": "provider/model",
  "variant": "high",
  "replay": 1,
  "armHash": "sha256:...",
  "declaredWorkflowMode": ["defer"],
  "declaredIntents": [],
  "disambiguation": true,
  "activation": {"activated": true, "topSkill": "mcp-tooling"},
  "toolCalls": [],
  "observedReads": [],
  "responseText": "bounded raw answer",
  "latencyMs": 0,
  "inputTokens": null,
  "graderA": null,
  "graderB": null,
  "adjudicated": null
}
```

The existing live executor has no startup resource manifest, so stated routing is primary and tool evidence is corroborative; the benchmark must not claim actual hidden context loading from a model's declaration alone. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/live-executor.cjs:10-23]

### Helper Decision Rule

- Prefer `compressed-card` if its correct-decision rate is non-inferior to `full-registry` within 3 pp and it reduces median measured input tokens by at least 20%.
- Prefer `full-registry` only if it improves correct decisions by more than 3 pp without increasing invented modes or latency by more than 10%.
- Reject `child-hint` if it raises named-child picks on defer-gold stems by any hub's wrong-pick margin.
- Reject `none` if it raises `freeze + arbitrary_pick` by the null-friction margin.
- If token accounting is unavailable, report helper efficiency as `UNKNOWN`; do not substitute file byte count for model input tokens.

## Ruled Out

- **A simple named-versus-null A/B test with one shared helper.** It cannot distinguish policy-field effects from fallback-resource effects, which is the iteration's central question. [INFERENCE: the two factors would be confounded.]
- **Treating the full `mode-registry.json` as the automatic control winner.** Registries carry backend, tool-surface, mutation, advisor, and extension data beyond the routing decision, so more context is not necessarily better context. [SOURCE: .opencode/skills/mcp-tooling/mode-registry.json:1-31] [SOURCE: .opencode/skills/sk-design/mode-registry.json:1-38]
- **Using one live run per case.** Existing evidence labels a one-sample inversion approximate noise, and the stability helper requires at least three replays before a verdict. [SOURCE: .opencode/skills/sk-prompt/benchmark/BENCHMARK-SUMMARY.md:16-25] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs:120-135]
- **Inferring actual resource loading from stated routing.** The live executor explicitly says OpenCode emits no startup resource manifest; reads and activation only corroborate the model's declaration. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/live-executor.cjs:18-23]

## Dead Ends

- Re-deriving the run-1 keep/flip table was excluded by the strategy's saturated-directions rule. [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/021-default-mode-policy-research/research/lineages/sol-ultra/deep-research-strategy.md:41-59]
- Repository playbooks cannot supply natural hub-request frequencies: they are authored contracts whose purpose is deliberate axis and boundary coverage. [SOURCE: .opencode/skills/sk-doc/create-benchmark/references/behavior_benchmark/behavior_benchmark_guide.md:155-184]

## What This Experiment Cannot Infer

- It cannot estimate the production share of zero-signal, boundary, or default-child requests because the corpus is balanced by design rather than sampled from traffic.
- It cannot prove an approximately 80% dominant mode without privacy-safe, deduplicated real request-frequency evidence.
- It cannot show that a declared route was the model's latent choice before the output contract prompted a declaration.
- It cannot generalize beyond the tested model/version/variant combinations or beyond fixture parity checks.
- It cannot measure hidden resource ingestion unless the runtime adds a startup resource manifest; observed reads are only partial corroboration.

## Sources Consulted

- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/live-executor.cjs:10-26,60-90,270-380`
- `.opencode/commands/deep/skill-benchmark.md:138-152`
- `.opencode/skills/system-deep-loop/shared/behavior-benchmark/framework.md:60-202`
- `.opencode/skills/sk-doc/create-benchmark/references/behavior_benchmark/behavior_benchmark_guide.md:107-184`
- `.opencode/skills/sk-doc/create-benchmark/assets/behavior_benchmark/behavior_benchmark_scenario_template.md:57-89,145-188`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs:16-35,112-215`
- `.opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/routing_optimization.md:95-153`
- `.opencode/skills/sk-prompt/benchmark/BENCHMARK-SUMMARY.md:5-25`
- The five named-default hubs' `hub-router.json` and `mode-registry.json` files.
- `sk-prompt` and `mcp-tooling` smart-routing resources and hub-routing playbooks.

## Assessment

- New information ratio: 0.90
- Novelty justification: The iteration adds a complete factorial fixture design, corpus strata, blind rubric, trace schema, replay schedule, helper decision rule, and hub-specific falsification margins; only the need for a paired live test carried forward from iteration 1.
- Question addressed: How should null fallback resources, Layer-0/Layer-1 interaction, and live-model behavior be experimentally evaluated?
- Question answered: Live behavior and fallback-resource evaluation now have a runnable, falsifiable design; Layer-0 traffic-frequency interaction remains unresolved because no traffic corpus exists.
- Confidence: high that the design matches repository benchmark and trace contracts; medium on practical margins because they are preregistered policy tolerances, not empirically estimated effects.

## Reflection

- What worked and why: combining playbook corpus contracts, live trace capture, shared blind scoring, and stability guards yielded an implementable design without touching shipped hubs.
- What did not work and why: repository fixtures cannot establish natural mode prevalence, and current live traces cannot prove hidden resource loading.
- Ruled out: confounded two-arm testing, automatic preference for the largest helper, single-sample verdicts, and declarations-as-resource-manifest claims.

## Recommended Next Focus

Specify migration and schema safety for a third archetype: exact field semantics, validator changes, `defaultApplied` rename ripple, rollout order, rollback telemetry, and cross-hub edge cases including contextual and multi-dominant defaults.
