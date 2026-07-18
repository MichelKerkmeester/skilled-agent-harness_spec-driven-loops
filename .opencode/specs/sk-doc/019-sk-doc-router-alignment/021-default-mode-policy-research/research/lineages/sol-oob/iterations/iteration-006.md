# Iteration 6: Capability/Type-Directed Minimal Router Contract

## Focus

This iteration tested whether the two hand-authored structures commonly called `INTENT_SIGNALS` and `RESOURCE_MAP` can collapse into a small capability/type-directed constraint solver. The test was information-preserving rather than syntactic: classification, resource loading, bundles, capability, authority, ambiguity, and replay each had to retain enough state to reproduce current behavior. The first candidate contract was then falsified against two dissimilar parents: `sk-code`, a two-axis workflow-plus-surface bundler, and `system-deep-loop`, a flat mode hub whose public modes can share one packet and diverge by runtime discriminator.

## Findings

1. `defaultMode` exposes a commitment-boundary smell, not merely a bad fallback value. It lets “no discriminating evidence,” “a policy prior favors this child,” and “execute this child” collapse into one field. The current parent schema already admits the distinction: a named default is evidence-bearing, a detection-routed hub may have no default, and a defer-routed hub must preserve the zero-signal state rather than guess. Both tested hubs set `defaultMode: null` and give defer an explicit outcome. The replacement therefore needs a typed decision outcome before it needs a confidence number. [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_hub_router_schema.md:225] [SOURCE: .opencode/skills/sk-code/hub-router.json:4] [SOURCE: .opencode/skills/system-deep-loop/hub-router.json:4] [INFERENCE: a field that simultaneously encodes prior, missing evidence, and action hides when irreversible authority is acquired]

2. The information-preservation test leaves seven distinct obligations. Classification needs evidence-producing detectors and explicit hints; resource loading needs a mode-to-resource selector plus existence/scope guards; bundles need target roles and order; capability needs stable mode type and backend discriminators; authority needs packet-local tool/mutation policy; ambiguity needs alternatives and a typed defer/clarify outcome; replay needs normalized facts plus immutable policy identity. The existing schema separately defines outcomes, bidirectional registry/signal integrity, resource paths, and two routing axes, confirming these are not one undifferentiated keyword map. [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_hub_router_schema.md:102] [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_hub_router_schema.md:160] [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_hub_router_schema.md:170] [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_hub_router_schema.md:235]

3. The smallest honest replacement has three pieces: request facts, a content-addressed compiled policy, and a typed route decision. `INTENT_SIGNALS` becomes compiler input for detectors that emit typed facts; packet-level `RESOURCE_MAP` entries become registry/leaf-manifest selectors. A decision carries references, not copied contracts: `modeId + policyHash` derives packet, authority, and default resources; only request-specific leaf resources and ordered roles appear in the plan. This removes parallel declarations while retaining semantic information. [SOURCE: .opencode/skills/sk-code/mode-registry.json:5] [SOURCE: .opencode/skills/sk-code/SKILL.md:50] [SOURCE: .opencode/skills/system-deep-loop/SKILL.md:38] [INFERENCE: content-addressed indirection removes duplicated arrays without making authority or resources implicit in mutable runtime state]

4. `sk-code` falsifies the initial one-capability/one-target solver. Its registry distinguishes acting workflow packets from read-only surface evidence, including different mutation and tool surfaces; the hub can return one workflow followed by zero or more surfaces, and bare phase requests may resolve to a pure surface bundle. A solver returning only “code capability → packet” loses both which component may act and the ordered evidence bundle. The minimal contract therefore needs `target.role` and an ordered target list, while authority stays derived from each registry entry. [SOURCE: .opencode/skills/sk-code/mode-registry.json:21] [SOURCE: .opencode/skills/sk-code/mode-registry.json:61] [SOURCE: .opencode/skills/sk-code/SKILL.md:57] [SOURCE: .opencode/skills/sk-code/SKILL.md:108] [SOURCE: .opencode/skills/sk-code/SKILL.md:120]

5. `system-deep-loop` falsifies packet path as the capability key. `agent-improvement`, `model-benchmark`, and `skill-benchmark` share `deep-improvement` but preserve distinct public modes, command bridges, and loop-host modes; other modes map public identity to a graph runtime type that is explicitly not inferred from the workflow name. The hub also says mode hints/commands override classification. Consequently the irreducible boundary is not a keyword table specifically, but some auditable lexical, command, or surface detector that turns raw input into typed facts. Capability solving starts after that boundary; it cannot honestly replace it. [SOURCE: .opencode/skills/system-deep-loop/mode-registry.json:104] [SOURCE: .opencode/skills/system-deep-loop/mode-registry.json:129] [SOURCE: .opencode/skills/system-deep-loop/mode-registry.json:152] [SOURCE: .opencode/skills/system-deep-loop/SKILL.md:46] [SOURCE: .opencode/skills/system-deep-loop/SKILL.md:53] [SOURCE: .opencode/skills/system-deep-loop/SKILL.md:70]

## Information-Preservation Test

| Obligation | Irreducible information | Safe collapse |
| --- | --- | --- |
| Classification | explicit hint plus evidence-producing lexical/command/surface facts | compile vocabulary classes and detectors; do not keep duplicate per-mode keyword arrays |
| Resource loading | policy-pinned mode, resource selector, request-specific leaf ids, guarded existence | derive packet/default resources from registry; keep leaf selection where one packet has multiple knowledge families |
| Bundles | outcome type, ordered targets, role per target | one ordered list replaces separate single/bundle return shapes |
| Capability | stable mode id, packet kind, backend/runtime discriminator, provided operation | derive static fields from the pinned registry entry |
| Authority | allowed/forbidden tools, mutation state, scoped packet owner | carry an `authorityRef`; destination reloads and enforces the referenced contract |
| Ambiguity | alternatives, evidence gap, budget, `clarify|defer|reject` | confidence may rank alternatives but cannot erase the typed outcome |
| Replay | normalized facts, detector/feature schema hash, policy hash, exact decision | omit duplicated static arrays; hashes make derivation reproducible |

## Concrete Minimal Contract

```text
RouteRequest {
  explicitMode?: ModeId
  facts: Fact[]              # capability, surface, lifecycle, mutation/risk
}

CompiledPolicy {
  policyHash
  factSchemaHash
  modes[ModeId] -> {
    packetId, role, backendDiscriminator,
    provides[], authorityRef, resourceSelectorRef
  }
  detectors[]                # raw input -> typed Fact with evidence
  bundleConstraints[]
}

RouteDecision {
  outcome: single | orderedBundle | surfaceBundle | clarify | defer | reject
  targets: [{ modeId, role, requestLeafResourceIds[] }]
  evidence: FactRef[]
  alternatives: ModeId[]
  replay: { policyHash, factSchemaHash, normalizedFacts }
}
```

The contract is minimal in the information sense: `targets[].modeId` plus `policyHash` derives packet path, default resources, backend, and authority. It is not “capability only,” because neither test hub can recover intent/surface facts from a capability label after those facts have been discarded. [INFERENCE: the two falsification cases show exactly which proposed fields fail when removed]

## Falsification Across Dissimilar Hubs

- Candidate A — `{requestedCapability, mode.provides} -> one mode`: rejected by `sk-code`; one request may require an acting workflow and read-only surface evidence in a stable order.
- Candidate B — add `packetPath`: rejected by `system-deep-loop`; three public improvement modes share one packet while selecting different loop-host modes and command surfaces.
- Candidate C — add typed mode/backend and ordered roles, but delete all detectors: rejected by both; raw user language and surface markers never become solver facts.
- Candidate D — the contract above: survives both cases. It compiles duplicated signal/resource declarations, preserves an evidence-producing detection boundary, derives static authority/resources through a pinned registry, and emits replayable typed outcomes.

## Ruled Out

- A solver whose only inputs are requested capability and a mode resource path.
- A single-target result with no target role or bundle order.
- Deleting lexical/surface detection rather than compiling it into typed observations.
- Copying full authority and resource arrays into every route decision when the policy-pinned mode reference can derive them.

## Dead Ends

Renaming `INTENT_SIGNALS` to “capabilities” and `RESOURCE_MAP` to “providers” is not simplification. It changes vocabulary while preserving duplicate declarations. Conversely, deleting both maps without compiled detectors and resource selectors loses information and fails both hubs.

## Edge Cases

- Ambiguous input: “replace” was interpreted as removing parallel hand-authored structures, not erasing the semantic evidence and resource contracts they currently carry.
- Contradictory evidence: none. The hubs differ structurally, but both support the same three-part request/policy/decision boundary.
- Missing dependencies: none for contract falsification; this is source-level architecture evidence and makes no empirical accuracy claim.
- Partial success: none. The minimal contract answers the remaining question; iteration 7 still runs because the packet uses a forced max-iterations stop policy.

## Sources Consulted

- .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_hub_router_schema.md:102
- .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_hub_router_schema.md:160
- .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_hub_router_schema.md:225
- .opencode/skills/sk-code/hub-router.json:4
- .opencode/skills/sk-code/mode-registry.json:5
- .opencode/skills/sk-code/mode-registry.json:21
- .opencode/skills/sk-code/SKILL.md:48
- .opencode/skills/system-deep-loop/hub-router.json:4
- .opencode/skills/system-deep-loop/mode-registry.json:104
- .opencode/skills/system-deep-loop/SKILL.md:38

## Assessment

- New information ratio: 1.00 (4 fully new findings + 1 partially new finding = 0.90 raw; resolving the final open question into one smaller compiled-policy contract adds the 0.10 simplicity bonus)
- Questions addressed: What deeper architecture smell does `defaultMode` expose, and what minimal confidence or contract model could replace `INTENT_SIGNALS` plus `RESOURCE_MAP`?
- Questions answered: What deeper architecture smell does `defaultMode` expose, and what minimal confidence or contract model could replace `INTENT_SIGNALS` plus `RESOURCE_MAP`?

The answer is: `defaultMode` exposes premature, unobservable commitment at the point where missing evidence is converted into execution. Replace the parallel maps with a policy compiler and typed route plan, but retain typed detectors, bundle roles, registry-derived authority/resources, explicit ambiguity outcomes, and replay hashes.

## Reflection

- What worked and why: starting with field deletion and forcing each candidate through two unlike hubs distinguished duplicated representation from irreducible information.
- What did not work and why: the first repository-wide hub summary query assumed the wrong JSON key and failed; a schema-agnostic direct read of the two selected hubs recovered without repeating that call.
- What I would do differently: derive a machine-checkable contract schema from this minimal form, then use route-gold fixtures to prove every omitted field is recoverable from the policy hash.

## Recommended Next Focus

Run the forced seventh iteration as a contrarian frame-break: treat `defaultMode` as a symptom of irreversible, unobservable commitment; explore proof-carrying or speculative/reversible route plans and name what should replace the debate. Even with all questions answered, continue under the max-iterations policy.

