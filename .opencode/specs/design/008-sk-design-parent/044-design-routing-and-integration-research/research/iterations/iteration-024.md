# Iteration 24: Live Dispatch Route Declaration Token

## Focus

[D3-A7 / D3] utilization invisible in live dispatch: the angle bank names the symptom as `014 intentRecall=0` and proposes a mandatory machine-readable mode declaration token, `ROUTED: workflowMode=...`. [SOURCE: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/angle-bank.json:25]

This iteration does not re-cover the prior D3 findings that the hub needs a parseable router, ordered bundles, negative transport ranking, or registry completeness checks. It narrows to observability: after live dispatch, can the benchmark prove which `sk-design` mode the model actually chose?

## Actions Taken

1. Re-read the active strategy and prior D3 trail so this pass stayed on the D3-A7 live-utilization gap rather than the already-covered hub-router and registry-static gaps. [SOURCE: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/deep-research-strategy.md:35] [SOURCE: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/deep-research-strategy.md:39] [SOURCE: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-021.md:77] [SOURCE: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-023.md:77]
2. Read the live `sk-design` hub and registry to verify the intended vocabulary is `workflowMode`, not a generic surface label. [SOURCE: .opencode/skills/sk-design/SKILL.md:41] [SOURCE: .opencode/skills/sk-design/SKILL.md:44] [SOURCE: .opencode/skills/sk-design/SKILL.md:49] [SOURCE: .opencode/skills/sk-design/mode-registry.json:4] [SOURCE: .opencode/skills/sk-design/mode-registry.json:6] [SOURCE: .opencode/skills/sk-design/mode-registry.json:14]
3. Read the live-executor and scorer code to trace why a live run can have correct-looking resources but still no mode/intention evidence. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/live-executor.cjs:18] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/live-executor.cjs:66] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/live-executor.cjs:243] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:74] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:243]
4. Checked the context-loading contract and mode-precision tests to separate "files loaded" proof from "route declared" proof. [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:48] [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:65] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts:248] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts:257]

## Findings

### Finding 1: Live dispatch currently has no `sk-design` mode-declaration channel

Severity: P1. Label: ENFORCEABLE.

The `sk-design` hub routes by `workflowMode`: it says the registry is the source of truth, defines the public mode key, and resolves a request to a mode such as `interface`, `foundations`, `motion`, `audit`, or `md-generator`. [SOURCE: .opencode/skills/sk-design/SKILL.md:41] [SOURCE: .opencode/skills/sk-design/SKILL.md:44] [SOURCE: .opencode/skills/sk-design/SKILL.md:49] The registry carries those same mode keys and packets. [SOURCE: .opencode/skills/sk-design/mode-registry.json:14] [SOURCE: .opencode/skills/sk-design/mode-registry.json:16] [SOURCE: .opencode/skills/sk-design/mode-registry.json:28] [SOURCE: .opencode/skills/sk-design/mode-registry.json:40] [SOURCE: .opencode/skills/sk-design/mode-registry.json:52] [SOURCE: .opencode/skills/sk-design/mode-registry.json:64]

The live benchmark executor asks the model for a different shape: detected `SURFACE`, `subLanguage`, reference/asset paths, and agent. Its required JSON is `{"surface": "...", "subLanguage": "...", "resources": [...], "assets": [...], "agent": "none", "disambiguation": false}`. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/live-executor.cjs:66] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/live-executor.cjs:74] That shape is useful for `sk-code` surface routing, but it cannot express `workflowMode=interface` or an ordered `sk-design` bundle.

Buildable recommendation: add a parent-hub route declaration to live routing-analysis prompts and parsers. The minimal token should be line-oriented so it survives prose, JSON fences, and cross-model formatting drift:

```text
ROUTED: skill=sk-design workflowMode=interface routeOutcome=orderedBundle workflowModes=interface,foundations packet=design-interface source=hub-router
```

For JSON consumers, mirror the same content as:

```json
{
  "routed": {
    "skill": "sk-design",
    "workflowMode": "interface",
    "routeOutcome": "orderedBundle",
    "workflowModes": ["interface", "foundations"],
    "packet": "design-interface",
    "source": "hub-router"
  }
}
```

The parser should fail closed for parent-hub fixtures when neither representation is present. This is deterministic: regex/JSON extraction plus registry-key validation.

### Finding 2: The `014 intentRecall=0` symptom is explained by an empty live intent vector

Severity: P1. Label: ENFORCEABLE.

I did not find a saved benchmark report artifact for scenario `014` in this research packet. The code path still explains the symptom named in the angle bank. The live parser returns `observedIntents: []` unconditionally, while returning stated resources, assets, surface, activation, and raw evidence. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/live-executor.cjs:243] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/live-executor.cjs:246] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/live-executor.cjs:252] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/live-executor.cjs:258]

The scorer then converts a live observation into `routerResult.intents = obs.observedIntents || []`, derives expected intent keys from scenario gold, and computes `intentRecall` by set overlap. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:55] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:61] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:74] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:80] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:243]

So any live fixture with `expected.intentKeys: ["interface"]` or similar will score `intentRecall=0` even if the model actually selected the right mode in prose, because the live executor never captures that mode as an intent. Resource recall can partially mask the failure because D1-intra weighs null/zero intent and resource recall together. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:105] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:113] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/feature_catalog/05--skill-benchmark/scoring-and-funnel.md:29]

Buildable recommendation: after parsing `ROUTED`, populate `observedIntents` with the declared `workflowMode` for parent-hub fixtures and add explicit fields:

```json
{
  "observedWorkflowMode": "interface",
  "observedWorkflowModes": ["interface", "foundations"],
  "routeDeclarationParsed": true
}
```

Then score `expected.workflowMode` and `expected.modeBundle` directly. Do not rely on resource overlap as a proxy for route choice.

### Finding 3: Context manifests prove loaded files, not the route decision that required them

Severity: P1. Label: ENFORCEABLE for manifest/declaration shape; ADVISORY for final design quality.

The shared contract already requires a context manifest before dispatch or design decisions, with `MODE BUNDLE LOADED` rows for `interface`, `foundations`, and `audit`, plus conditional file rows. [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:44] [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:63] It also blocks design/readiness claims until files behind the claim are named as loaded, and ships hard gates for context, register/dials, contrast, interface pre-flight, audit evidence, dispatch profile, and adoption. [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:65] [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:138] [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:150]

That is necessary but insufficient for D3-A7. A manifest can say `interface` and `foundations` were loaded, but it does not prove the hub routed to `interface`, that the route came from a mode hint versus a default, or that an ordered bundle was intentionally selected. This is the exact invisibility gap: loading evidence appears after the decision; the route token must name the decision itself.

Buildable recommendation: require the route declaration before the context manifest:

```text
ROUTED: skill=sk-design workflowMode=interface routeOutcome=orderedBundle workflowModes=interface,foundations source=hub-router
CONTEXT MANIFEST:
MODE BUNDLE LOADED:
- interface: loaded
- foundations: loaded
```

Then update `proof_check.py --require-route-manifest` or the future hub-router gate to validate three facts: every declared `workflowMode` is a current registry key, every declared mode has a matching manifest row, and no manifest mode can satisfy a route requirement unless it appears in the declaration.

### Finding 4: Existing mode precision is advisory, so it cannot make missing declarations fail

Severity: P1. Label: ENFORCEABLE once the declaration field exists.

The benchmark already has a mode-precision lane, but it is explicitly advisory: `scoreScenario()` calls `scoreModePrecision()`, while comments say the skill-id gate remains the authority and mode precision only reports whether the resolved mode matches fixture gold. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:278] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:286] The tests lock in that a wrong advisor mode does not lower the scenario score and that mode precision stays outside weighted dimensions. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts:248] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts:260] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts:264] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts:269]

That is acceptable as an advisor diagnostic, but it is too weak for live utilization. A missing `ROUTED` token should be a first failing stage for parent-hub scenarios, before resource recall, because otherwise resource overlap can make a run look partially successful while the actual mode decision remains invisible.

Buildable recommendation: add a gated live route-declaration dimension for parent hubs:

```json
{
  "expected": {
    "skillId": "sk-design",
    "workflowMode": "interface",
    "modeBundle": ["interface", "foundations"],
    "routeOutcome": "orderedBundle",
    "requiresRouteDeclaration": true
  }
}
```

Scoring should set `firstFailingStage: "route-declaration-missing"` when the token is absent, `"route-mode-mismatch"` when the declared mode is wrong, and only then proceed to resource/content proof. This is enforceable on a test corpus and in live dispatch transcripts. Whether the chosen mode produced excellent design remains advisory.

## Questions Answered

- Q2/D3: Parent-to-sub-skill utilization needs a live, machine-readable route declaration in addition to static hub-router replay. The enforceable unit is not "the model read some design files"; it is "the live transcript declared a registry-valid `workflowMode` or ordered bundle, and the manifest/proof rows matched that declaration."
- Q5/all: Enforceable pieces are the `ROUTED` token grammar, JSON mirror, parser extraction, registry-key validation, declaration-to-manifest matching, and gated benchmark failure on missing or wrong declarations. Advisory pieces are open-ended prompt interpretation outside fixtures and final aesthetic quality.

## Questions Remaining

- Should the route declaration live only in live benchmark prompts, or should every real `sk-design` invocation emit it before context manifests and proof cards?
- Should `ROUTED` carry only the primary `workflowMode`, or always carry `routeOutcome` plus `workflowModes[]` so bundle expectations are first-class?
- Should a missing declaration cap the existing D1-intra score, or become a separate `D1hubRoute` / `D3-utilization` hard gate before resource recall?
- Should explicit mode hints use `source=mode-hint`, and should contradictory hints produce `routeOutcome=defer` instead of a declared mode?

## Next Focus

D3-A8: tool-permission correctness across the `reference-base` versus `playwright-extract` `backendKind` split. Wrong mode routing is not only a taste miss; it can grant the wrong tool surface.

## Sources Consulted

- `.opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/deep-research-strategy.md`
- `.opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/angle-bank.json`
- `.opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-021.md`
- `.opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-023.md`
- `.opencode/skills/sk-design/SKILL.md`
- `.opencode/skills/sk-design/mode-registry.json`
- `.opencode/skills/sk-design/shared/context_loading_contract.md`
- `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/live-executor.cjs`
- `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs`
- `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/executor-dispatch.cjs`
- `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts`
- `.opencode/skills/deep-loop-workflows/deep-improvement/feature_catalog/05--skill-benchmark/scoring-and-funnel.md`

## Assessment

newInfoRatio: 0.61. Novelty is moderate: iterations 18, 21, and 23 already established the missing router, bundle, and registry gates. This pass adds the live-transcript observability layer: the benchmark can parse resources and surfaces today, but cannot parse a `sk-design` `workflowMode`, which explains the `intentRecall=0` class and yields a small buildable token/parser/gate change.

Confidence: high for the live parser/scorer behavior because it is directly traced through the code. Medium for the exact scoring placement because the implementation phase must choose whether route declaration becomes part of D1-intra or a new hard-gated hub-route dimension.

## Reflection

The useful split is route, load, apply. Earlier work covered route replay and source-proof application. This pass fills the middle observability hole: in a live transcript, the route must be declared before load proof can mean anything.

Ruled out: treating `MODE BUNDLE LOADED` as sufficient route evidence. It proves files were named, not why those files were required or which registry mode won.
