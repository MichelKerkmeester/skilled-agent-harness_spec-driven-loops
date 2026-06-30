# Iteration 28: D3-A11 Default-to-Interface False-Default Sink

## Focus

[D3-A11 / D3] `default-to-interface` as a silent miss sink. This pass separates "the hub routed somewhere" from "the hub routed correctly," then defines how to measure false defaults where a prompt falls into `interface` instead of the expected mode or an explicit ask/defer outcome.

## Actions Taken

1. Re-read the active strategy, state tail, and prior D3 iterations so this pass did not re-cover route tokens, backend/tool lockstep, child-boundary proof, or the standing gold corpus.
2. Re-read the live `sk-design` hub routing prose, especially the `interface` default and escalation clauses. [SOURCE: .opencode/skills/sk-design/SKILL.md:56] [SOURCE: .opencode/skills/sk-design/SKILL.md:92] [SOURCE: .opencode/skills/sk-design/SKILL.md:102]
3. Re-read `mode-registry.json` to anchor the actual local alias corpus and confirm that it stores mode identity and aliases, not default/ambiguity policy. [SOURCE: .opencode/skills/sk-design/mode-registry.json:4] [SOURCE: .opencode/skills/sk-design/mode-registry.json:16] [SOURCE: .opencode/skills/sk-design/mode-registry.json:21] [SOURCE: .opencode/skills/sk-design/mode-registry.json:33] [SOURCE: .opencode/skills/sk-design/mode-registry.json:45] [SOURCE: .opencode/skills/sk-design/mode-registry.json:57] [SOURCE: .opencode/skills/sk-design/mode-registry.json:69]
4. Re-read the benchmark router/scorer/live parser to see whether current reports can tell "routed" apart from "routed correctly." [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:188] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:242] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:278] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/live-executor.cjs:243]
5. Ran two read-only local proxy measurements over the 56 registry aliases. The strict proxy used only the exception families named in the hub prose; the generous proxy added obvious registry vocabulary such as palette, grid, audit, CSS, and extraction.

## Findings

### Finding 1: The current default is a prose fallback, not a measured route outcome

Severity: P1. Label: ENFORCEABLE on a test corpus; ADVISORY for open-ended future language.

The hub explicitly says generic "make this look good" prompts default to `interface` unless another axis is explicit. [SOURCE: .opencode/skills/sk-design/SKILL.md:56] The same rule is repeated as an ALWAYS clause. [SOURCE: .opencode/skills/sk-design/SKILL.md:92] The only hard escalation language nearby is for named-mode conflicts, prompts spanning more than three axes, or unsafe/contradictory constraints. [SOURCE: .opencode/skills/sk-design/SKILL.md:100] [SOURCE: .opencode/skills/sk-design/SKILL.md:102] There is no typed `routeOutcome`, `defaultApplied`, `askRequired`, or `deferReason` field in the hub contract.

Buildable recommendation: add a registry-backed `routerPolicy` or sibling `hub-router.json` with these fields:

```json
{
  "defaultMode": "interface",
  "defaultAllowedWhen": ["generic-interface-quality"],
  "ambiguityDelta": 1,
  "nearTieOutcome": "ask",
  "returnShape": ["routed", "routeOutcome", "workflowMode", "workflowModes", "defaultApplied", "defaultReason", "deferReason"]
}
```

Then make fixtures assert the policy. A scenario can route to `interface` and still fail if `defaultApplied:true` is forbidden by private gold.

### Finding 2: The registry has enough alias corpus to measure false defaults, but no policy fields to prevent them

Severity: P1. Label: ENFORCEABLE.

`mode-registry.json` carries the five valid mode labels and alias lists. [SOURCE: .opencode/skills/sk-design/mode-registry.json:14] [SOURCE: .opencode/skills/sk-design/mode-registry.json:16] [SOURCE: .opencode/skills/sk-design/mode-registry.json:28] [SOURCE: .opencode/skills/sk-design/mode-registry.json:40] [SOURCE: .opencode/skills/sk-design/mode-registry.json:52] [SOURCE: .opencode/skills/sk-design/mode-registry.json:64] It also says the advisor does not read the file at runtime. [SOURCE: .opencode/skills/sk-design/mode-registry.json:4] That means the alias corpus can be private gold for measurement, but the file does not yet encode how to resolve near-ties, when to ask, or when the `interface` default is legal.

The read-only local proxy measurement makes the risk concrete. With a strict classifier derived from the hub's exact exception wording, 29 of 46 non-interface aliases fell through to `interface`, a 0.63 false-default proxy rate. With a generous classifier that adds obvious registry vocabulary, 4 of 46 still fell through, a 0.087 false-default proxy rate. The spread is itself the finding: prose inference changes the measured miss rate by more than seven times.

Buildable recommendation: make `falseDefaultRate` an aggregate over private-gold scenarios:

```text
falseDefaultRate =
  count(observed.defaultApplied && observed.workflowMode == "interface" && !hubRoute.routedCorrectly)
  / count(observed.defaultApplied && observed.workflowMode == "interface")
```

Also report `silentDefaultCount`, `askExpectedButDefaultedCount`, and `wrongDefaultModeCount`. Those are deterministic once fixtures carry `expected.routeOutcome`, `expected.workflowMode(s)`, and `expected.defaultAllowed`.

### Finding 3: Current benchmark scoring can pass "routed" without proving "routed correctly"

Severity: P1. Label: ENFORCEABLE.

The current first-failing-stage funnel is `activated-inter`, `router-unparseable`, `surface-mismatch`, `routed-intra`, then `discovered`. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:188] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/references/skill_benchmark/scoring_contract.md:60] The D1-intra score compares expected `intentKeys` and `resources` against router output. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:242] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:245] `modePrecision` exists, but the scorer comments say it is advisory and never gated. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:278] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:289]

This is the silent miss sink. A future parent-hub runner could emit some resources, or even the default mode's resources, and the report would call the scenario routed/discovered without a hard failure for "the prompt should have asked" or "the prompt should have routed to `foundations`." Iteration 27 named the need for a `hubRoute` lane; this pass pins the false-default subclass and where it belongs in the funnel.

Buildable recommendation: insert hub-route stages before `routed-intra`:

```text
hub-route-missing
hub-route-incorrect
hub-route-silent-default
hub-route-ambiguous-not-asked
routed-intra
```

`routed` should mean a valid route object exists. `routedCorrectly` should mean the route object matches private gold. Only the second should unlock resource recall, context manifests, proof cards, or READY/adoption claims.

### Finding 4: Live-mode parsing has a placeholder for routing correctness, but it is always null

Severity: P1. Label: ENFORCEABLE.

The live parser returns `observedIntents: []`, `observedResources`, `observedAssets`, `observedSurface`, and `statedRoutingCorrect: null`. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/live-executor.cjs:243] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/live-executor.cjs:246] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/live-executor.cjs:252] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/live-executor.cjs:255] The score evidence only reports whether any stated routing parsed, not whether the stated route matches expected `workflowMode` or an expected ask/defer outcome. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:209] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:216]

Buildable recommendation: extend live output parsing to accept a `HUB_ROUTE` or JSON block:

```json
{
  "skill": "sk-design",
  "routeOutcome": "single|orderedBundle|defer",
  "workflowMode": "interface",
  "workflowModes": ["interface"],
  "defaultApplied": true,
  "defaultReason": "generic-interface-quality",
  "askedClarifyingQuestion": false,
  "deferReason": null
}
```

The scorer then computes `routed`, `routedCorrectly`, `defaultApplied`, and `askCorrectly`. This is deterministic for benchmark transcripts. Runtime user-facing ambiguity remains advisory unless the command/workflow requires a hard ask.

## Questions Answered

- Q2/D3: Parent-to-sub-skill routing must split activation/routed/routed-correctly. `interface` defaults are allowed only when private gold permits defaulting; otherwise they are false defaults even if resources load.
- Q5/all: The enforceable backlog item is a hard `hubRoute` scorer lane plus false-default aggregate metrics. The advisory boundary is open-world prompt interpretation outside the fixture corpus.

## Questions Remaining

- Should `nearTieOutcome:"ask"` live in `mode-registry.json.routerPolicy`, or should a generated sibling `hub-router.json` own all route policy?
- What ambiguity delta should trigger ask/defer for `sk-design`: a global score delta, mode-pair-specific deltas, or explicit minimal-pair groups only?
- Should `defaultApplied:true` ever be legal for bundle routes, or only for single `interface` advice?

## Next Focus

D3-A12: define the exact `hubRoute` fixture/private-gold schema and parser output for `single`, `orderedBundle`, and `defer`, including how `defaultApplied` interacts with backend/tool lockstep and boundary-proof gates.

## Sources Consulted

- `.opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/deep-research-strategy.md`
- `.opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-026.md`
- `.opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-027.md`
- `.opencode/skills/sk-design/SKILL.md`
- `.opencode/skills/sk-design/mode-registry.json`
- `.opencode/skills/sk-design/shared/context_loading_contract.md`
- `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/router-replay.cjs`
- `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs`
- `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/live-executor.cjs`
- `.opencode/skills/deep-loop-workflows/deep-improvement/references/skill_benchmark/scoring_contract.md`
- `.opencode/skills/deep-loop-workflows/deep-improvement/references/skill_benchmark/scenario_authoring.md`

## Assessment

newInfoRatio: 0.67. The route-corpus finding from iteration 27 already established that `workflowMode` must be hard gold. This iteration adds a concrete failure mode and metric: silent `interface` default can make a scenario look routed while hiding a wrong or missing ask/defer decision. The strict and generous alias-proxy measurements are not a final benchmark result; they are a local-repo proof that the false-default rate is highly sensitive to untyped prose interpretation.

## Reflection

The implementation should not try to make `interface` less important. It should make defaulting observable. A default can be correct, but only if the report can say why it was allowed and count it separately from explicit, correct routing.
