# Iteration 31: D3-A14 Routing Telemetry And Miss-Rate Baseline

## Focus

[D3-A14 / D3] routing observability/telemetry for `sk-design`: log the mode chosen, alias matched, bundle loaded, proof verdict, and accumulate a measured miss-rate over the local repo corpus. This pass does not re-open whether `hubRoute`, default policy, vocabulary drift, or application witnesses are needed; it specifies the missing route-event envelope that makes those prior gates inspectable and reportable.

## Actions Taken

1. Re-read iterations 28-30 and the active strategy so this pass stayed on observability, not the already-covered false-default, vocabulary-drift, or loaded-versus-applied witness angles. [SOURCE: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-028.md:17] [SOURCE: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-029.md:16] [SOURCE: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-030.md:16] [SOURCE: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/deep-research-strategy.md:34]
2. Re-read the live `sk-design` hub and registry to anchor the route facts that telemetry must expose: `workflowMode`, `backendKind`, aliases, packet, bundle/default policy, and the build bundle. [SOURCE: .opencode/skills/sk-design/SKILL.md:41] [SOURCE: .opencode/skills/sk-design/SKILL.md:44] [SOURCE: .opencode/skills/sk-design/SKILL.md:48] [SOURCE: .opencode/skills/sk-design/SKILL.md:56] [SOURCE: .opencode/skills/sk-design/SKILL.md:60] [SOURCE: .opencode/skills/sk-design/mode-registry.json:14] [SOURCE: .opencode/skills/sk-design/mode-registry.json:21]
3. Re-read the context/proof cards and checker to see where bundle-loaded and proof-verdict signals exist today. [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:46] [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:55] [SOURCE: .opencode/skills/sk-design/shared/assets/context_loaded_card.md:31] [SOURCE: .opencode/skills/sk-design/shared/assets/context_loaded_card.md:70] [SOURCE: .opencode/skills/sk-design/shared/assets/proof_of_application_card.md:57] [SOURCE: .opencode/skills/sk-design/shared/scripts/proof_check.py:47]
4. Re-read the skill-benchmark deterministic router, live executor, normalized observed-result shape, scorer funnel, and report renderer to find the enforceable insertion point. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/router-replay.cjs:254] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/executor-dispatch.cjs:32] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/live-executor.cjs:63] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/live-executor.cjs:243] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:188] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/build-report.cjs:116]
5. Ran a read-only local corpus measurement over `sk-design/**/manual_testing_playbook/*.md`, excluding aggregate `manual_testing_playbook.md` files. The measurement counted files with prompt blocks and searched for machine-readable route telemetry tokens: `ROUTED:`, `hubRoute`, `routeOutcome`, `workflowMode`, `workflowModes`, `routeTrace`, `aliasMatched`, `matchedAlias`, `bundleLoaded`, `proofVerdict`, `missRate`, and `statedRoutingCorrect`.

## Findings

### Finding 1: The route facts exist, but no route event is emitted

Severity: P1. Label: ENFORCEABLE on a test corpus; ADVISORY for open-ended natural-language intent.

The hub names the route discriminator and says routing is registry-driven. [SOURCE: .opencode/skills/sk-design/SKILL.md:41] [SOURCE: .opencode/skills/sk-design/SKILL.md:44] It also states the actual classification rule: classify to a `workflowMode`, apply mode-hint override, default generic design prompts to `interface`, and pair modes only for clearly separate axes. [SOURCE: .opencode/skills/sk-design/SKILL.md:48] [SOURCE: .opencode/skills/sk-design/SKILL.md:56] The registry stores the five mode rows, packets, backends, and aliases. [SOURCE: .opencode/skills/sk-design/mode-registry.json:14] [SOURCE: .opencode/skills/sk-design/mode-registry.json:16] [SOURCE: .opencode/skills/sk-design/mode-registry.json:21] [SOURCE: .opencode/skills/sk-design/mode-registry.json:28] [SOURCE: .opencode/skills/sk-design/mode-registry.json:40] [SOURCE: .opencode/skills/sk-design/mode-registry.json:52] [SOURCE: .opencode/skills/sk-design/mode-registry.json:64]

The missing piece is a single emitted route event. Current deterministic replay returns `parseable`, `intents`, `resources`, `missingResources`, `scores`, and sometimes `surface`; it does not carry the parent-hub fields that `sk-design` needs: chosen `workflowMode`, matched registry alias, default reason, bundle role, or defer reason. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/router-replay.cjs:254] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/router-replay.cjs:303] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/router-replay.cjs:307]

Buildable recommendation: add a `routeTelemetry` object to the parent-hub adapter or future `hub-router.json` replay output:

```json
{
  "skillId": "sk-design",
  "scenarioId": "FOUND-COLOR-001",
  "routeOutcome": "single|orderedBundle|defer",
  "workflowMode": "foundations",
  "workflowModes": [{"mode": "foundations", "role": "primary"}],
  "matchedAliases": [{"mode": "foundations", "alias": "color token system", "source": "mode-registry.aliases", "score": 1}],
  "defaultApplied": false,
  "deferReason": null,
  "backendKind": "reference-base",
  "packet": "design-foundations"
}
```

That event is deterministic when the scenario has private gold and the adapter reads `mode-registry.json`. It remains advisory when a live, non-fixture prompt requires human judgment about whether an alias should have counted.

### Finding 2: Bundle-loaded and proof verdict exist, but they are late proof fields rather than route telemetry

Severity: P1. Label: ENFORCEABLE for artifacts/transcripts with structured cards; ADVISORY for aesthetic quality.

The shared contract already requires a context manifest before dispatch or design decisions. [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:46] Its minimum shape has `MODE BUNDLE LOADED`, conditional files, and a hard rule that design claims do not pass until the supporting files are named as loaded. [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:55] [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:59] [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:65] The context card carries a scope owner and loaded-files checklist, then ends with a `Context verdict: LOADED | BLOCKED`. [SOURCE: .opencode/skills/sk-design/shared/assets/context_loaded_card.md:31] [SOURCE: .opencode/skills/sk-design/shared/assets/context_loaded_card.md:45] [SOURCE: .opencode/skills/sk-design/shared/assets/context_loaded_card.md:70] The proof card carries final `READY | NOT READY`, and `proof_check.py` returns `fields`, `cards`, `ready`, `missing`, and `ok`. [SOURCE: .opencode/skills/sk-design/shared/assets/proof_of_application_card.md:57] [SOURCE: .opencode/skills/sk-design/shared/assets/proof_of_application_card.md:68] [SOURCE: .opencode/skills/sk-design/shared/scripts/proof_check.py:47] [SOURCE: .opencode/skills/sk-design/shared/scripts/proof_check.py:54]

Those signals are useful, but today they sit after routing and are not joined to the chosen mode or matched alias. A run can say context loaded and proof READY without the report being able to answer "loaded for which route?" or "was the proof attached to the mode the prompt actually required?"

Buildable recommendation: extend `routeTelemetry` after context/proof parsing instead of inventing a separate proof-only metric:

```json
{
  "routeTelemetry": {
    "routeVerdict": "matched|missed|ambiguous|unobserved",
    "bundleLoaded": {"required": ["interface", "foundations"], "observed": ["interface"], "missing": ["foundations"], "verdict": "BLOCKED"},
    "proofVerdict": {"ready": false, "ok": false, "missing": ["CONTRAST PAIRS"]},
    "firstMissStage": "context-bundle-missing"
  }
}
```

The enforceable rule is that `bundleLoaded` and `proofVerdict` are attributes of a route event. They should feed miss-rate buckets rather than remain disconnected cards.

### Finding 3: The benchmark has evidence fields and a funnel, but no route telemetry lane

Severity: P1. Label: ENFORCEABLE.

The normalized observed-result contract currently exposes `mode`, `executor`, `classKind`, `parseable`, `observedIntents`, `observedResources`, `observedSurface`, `statedRoutingCorrect`, activation, missing resources, routed-out state, and raw data. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/executor-dispatch.cjs:32] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/executor-dispatch.cjs:40] The live executor asks for `surface`, `subLanguage`, `resources`, `assets`, `agent`, and `disambiguation`, not a hub route event. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/live-executor.cjs:63] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/live-executor.cjs:72] It then returns `observedIntents: []` and `statedRoutingCorrect: null`, even when the model stated something parseable. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/live-executor.cjs:243] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/live-executor.cjs:255]

The scorer's evidence summary reports event count, activation, tool calls, observed reads, whether stated routing parsed, and a response head. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:209] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:216] The funnel can first-fail only at `activated-inter`, `router-unparseable`, `surface-mismatch`, `routed-intra`, or `discovered`; report rendering shows scenario, class, score, and first failing stage. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:188] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:359] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/build-report.cjs:116]

Buildable recommendation: add a hard hub-route lane before D1-intra/resource recall and a report section that aggregates route telemetry:

```text
hub-route-unobserved
hub-route-wrong-mode
hub-route-alias-missed
hub-route-default-forbidden
hub-route-bundle-mismatch
context-bundle-missing
proof-verdict-failed
routed-intra
```

Report metrics:

```text
telemetryMissingRate = count(routeTelemetry == null) / count(routeTelemetryRequired)
routeMissRate = count(routeTelemetry.routeVerdict in missed|ambiguous|unobserved) / count(routeTelemetryRequired)
aliasMissRate = count(expected.matchedAlias && !observed.matchedAliases contains it) / count(expected.matchedAlias)
bundleMissRate = count(bundleLoaded.missing.length > 0) / count(expected.workflowModes.length > 1 or buildBundleRequired)
proofFailRate = count(proofVerdict.ok == false) / count(proofVerdictRequired)
```

This is deterministically enforceable for benchmark fixtures and filled proof-card artifacts. It is intentionally separate from `modePrecision`, which remains advisory and advisor-oriented rather than parent-hub route proof. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:278] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:433]

### Finding 4: The local sk-design playbook corpus has a telemetry missing rate of 1.000

Severity: P1. Label: ENFORCEABLE.

The fixture authoring contract's private gold currently names `skillId`, `advisorLane`, `intentKeys`, `resources`, and `negativeActivation`, not `expectedHubRoute`, `routeOutcome`, matched alias, bundle expectation, or proof verdict. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/references/skill_benchmark/scenario_authoring.md:26] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/references/skill_benchmark/scenario_authoring.md:27] The local `sk-design` manual playbooks contain route expectations in prose, for example foundations routes to `foundations`, motion routes to `motion`, audit routes to `audit`, and extraction detects an extraction phase. [SOURCE: .opencode/skills/sk-design/design-foundations/manual_testing_playbook/01--color/001-oklch-palette-and-dark-mode.md:31] [SOURCE: .opencode/skills/sk-design/design-foundations/manual_testing_playbook/01--color/001-oklch-palette-and-dark-mode.md:33] [SOURCE: .opencode/skills/sk-design/design-motion/manual_testing_playbook/01--strategy/001-purposeful-motion-plan.md:31] [SOURCE: .opencode/skills/sk-design/design-motion/manual_testing_playbook/01--strategy/001-purposeful-motion-plan.md:33] [SOURCE: .opencode/skills/sk-design/design-audit/manual_testing_playbook/04--evidence-worksheet/011-evidence-backed-release-readiness.md:46] [SOURCE: .opencode/skills/sk-design/design-md-generator/manual_testing_playbook/01--extract/001-live-extraction.md:46]

Read-only measurement:

```json
{
  "scenarioFiles": 61,
  "promptScenarios": 55,
  "routeTelemetryScenarios": 0,
  "telemetryMissing": 55,
  "telemetryMissingRate": 1.0,
  "byMode": {
    "design-interface": {"total": 16, "telemetry": 0},
    "design-motion": {"total": 9, "telemetry": 0},
    "design-audit": {"total": 10, "telemetry": 0},
    "design-foundations": {"total": 7, "telemetry": 0},
    "design-md-generator": {"total": 13, "telemetry": 0}
  }
}
```

This is not a route correctness score yet. It is the readiness baseline: the current local corpus can express "the answer should route to X" in prose, but no scenario emits or expects a machine-readable route trace. The first measurable backlog item is therefore `telemetryMissingRate`, followed by `routeMissRate` once `expectedHubRoute` gold exists.

Buildable recommendation: add `expectedHubRoute` to private gold or playbook sidecars:

```json
{
  "expectedHubRoute": {
    "routeOutcome": "single",
    "workflowMode": "foundations",
    "workflowModes": [{"mode": "foundations", "role": "primary"}],
    "matchedAliases": ["color token system"],
    "defaultAllowed": false,
    "bundleRequired": false,
    "proofVerdictRequired": false
  }
}
```

Then the benchmark can publish two separate numbers: "we cannot observe routing" and "we observed routing and it missed." Collapsing those into one failure would hide whether the system lacks instrumentation or has a real routing defect.

## Questions Answered

- Q2/D3: Parent-to-sub-skill routing becomes provable only when every scenario carries a route telemetry envelope before resource recall, context proof, and READY/adoption credit. The envelope must join mode chosen, alias matched, default/defer state, bundle-loaded state, and proof verdict.
- Q5/all: The buildable backlog item is an enforceable `routeTelemetry` schema plus scorer/report metrics: `telemetryMissingRate`, `routeMissRate`, `aliasMissRate`, `bundleMissRate`, and `proofFailRate`. Runtime intent interpretation remains advisory outside the fixture corpus, but fixture replay and filled proof artifacts are deterministic.

## Questions Remaining

- Should route telemetry be required only in benchmark/live-analysis transcripts first, or should every real `sk-design` invocation emit the route event before context cards?
- Should `routeTelemetry` live inside a generic parent-hub benchmark adapter, or should `sk-design` own a local adapter until a second hub needs the same fields?
- Should proof-card parsing mutate/augment the route event in the scorer, or should the filled proof card itself contain a `ROUTE TRACE` section that `proof_check.py` validates directly?

## Next Focus

D3-A15: turn the telemetry envelope into a concrete private-gold and observed-result schema: exact fixture fields, parser shape, first-failing-stage insertion, report table, and reducer/dashboard metrics.

## Sources Consulted

- `.opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/deep-research-strategy.md`
- `.opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-028.md`
- `.opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-029.md`
- `.opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-030.md`
- `.opencode/skills/sk-design/SKILL.md`
- `.opencode/skills/sk-design/mode-registry.json`
- `.opencode/skills/sk-design/shared/context_loading_contract.md`
- `.opencode/skills/sk-design/shared/assets/context_loaded_card.md`
- `.opencode/skills/sk-design/shared/assets/proof_of_application_card.md`
- `.opencode/skills/sk-design/shared/scripts/proof_check.py`
- `.opencode/skills/sk-design/design-foundations/manual_testing_playbook/01--color/001-oklch-palette-and-dark-mode.md`
- `.opencode/skills/sk-design/design-motion/manual_testing_playbook/01--strategy/001-purposeful-motion-plan.md`
- `.opencode/skills/sk-design/design-audit/manual_testing_playbook/04--evidence-worksheet/011-evidence-backed-release-readiness.md`
- `.opencode/skills/sk-design/design-md-generator/manual_testing_playbook/01--extract/001-live-extraction.md`
- `.opencode/skills/deep-loop-workflows/deep-improvement/references/skill_benchmark/scenario_authoring.md`
- `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/router-replay.cjs`
- `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/executor-dispatch.cjs`
- `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/live-executor.cjs`
- `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs`
- `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/build-report.cjs`

## Assessment

newInfoRatio: 0.66. Prior D3 iterations already established the need for route gold, default observability, vocabulary projection, context loading, boundary proof, and output witnesses. This pass adds the missing operational telemetry layer and a local measured baseline: among 55 prompt-bearing `sk-design` manual scenarios, zero currently carry machine-readable route telemetry, so the corpus has a telemetry missing rate of 1.000 before any route correctness rate can be computed.

## Reflection

The useful split is "unobserved" versus "observed and wrong." `sk-design` needs both numbers. Otherwise the first benchmark that fails a route scenario will not tell the implementer whether the route was bad, the alias map was incomplete, the context bundle was missing, or the proof card failed after a correct route.
