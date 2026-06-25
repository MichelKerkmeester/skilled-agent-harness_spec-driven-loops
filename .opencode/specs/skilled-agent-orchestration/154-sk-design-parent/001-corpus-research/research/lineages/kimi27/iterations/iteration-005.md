# Iteration 5: Parent structural model — hub with nested packets vs. umbrella router

## Focus

Compare the two parent structural models and choose the one that fits the existing `sk-design-*` family and internal skill conventions.

## Findings

1. **`deep-loop-workflows` is the strongest internal precedent for a hub with nested packets.**
   - One public skill identity (`deep-loop-workflows`) with one `graph-metadata.json` and one `mode-registry.json`. [SOURCE: file:.opencode/skills/deep-loop-workflows/SKILL.md:57-68]
   - The registry lists mode packets (`deep-context`, `deep-research`, `deep-review`, `ai-council`, `deep-improvement`) each with its own `SKILL.md`, `references/`, `scripts/`, and `feature_catalog/`, but **no per-packet `graph-metadata.json`**. [SOURCE: file:.opencode/skills/deep-loop-workflows/SKILL.md:67]
   - Routing is by `workflowMode` through `mode-registry.json`; per-mode convergence/state/artifact contracts stay inside each packet. [SOURCE: file:.opencode/skills/deep-loop-workflows/mode-registry.json:5-17]
   - The hub's `graph-metadata.json` explicitly states it "merges the five former deep-loop persona skills into one advisor identity." [SOURCE: file:.opencode/skills/deep-loop-workflows/graph-metadata.json:152]

2. **`sk-code` is a counter-example: one broad skill with internal surface routing**, not a parent of independent siblings. It has a single `graph-metadata.json` and routes by surface detection. [SOURCE: file:.opencode/skills/sk-code/SKILL.md:67-120] This shows the framework already accepts large, internally-routed skills, but it does not help when the children are as distinct as design disciplines.

3. **The `sk-design-*` family identity already exists in metadata.**
   - `sk-design-md-generator`'s `causal_summary` calls it "the extraction-and-format-fidelity engine of the sk-design-* family - sibling to sk-design-interface." [SOURCE: file:.opencode/skills/sk-design-md-generator/graph-metadata.json:144]
   - `sk-design-interface`'s `graph-metadata.json` lists `sk-design-md-generator` as a sibling with weight 0.55. [SOURCE: file:.opencode/skills/sk-design-interface/graph-metadata.json:22-25]
   - Both skills currently enhance `sk-code` rather than a parent, but the family semantic is already present.

4. **Umbrella-router-over-siblings model characteristics.**
   - Each child (`sk-design-direction`, `sk-design-foundations`, etc.) would be a top-level skill with its own `graph-metadata.json`.
   - A separate `sk-design-router` skill (or `sk-design` umbrella) would route user intent to the correct child.
   - Pros: children are independently discoverable, can be released/owned separately, and avoid a monolithic parent.
   - Cons: the advisor surface fragments into many design skills; users asking generically "make this look good" may be routed to the wrong child; shared family conventions (quality floor, anti-default critique) must be duplicated or cross-referenced; graph-metadata maintenance scales with child count.

5. **Hub-with-nested-packets model characteristics.**
   - `sk-design` is one advisor-discoverable skill with one `graph-metadata.json` and a `mode-registry.json` (or `family-registry.json`) listing child packets.
   - Child packets (`sk-design-direction`, `sk-design-foundations`, `sk-design-motion`, `sk-design-critique`, `sk-design-system`, optionally `sk-design-presentation`) keep their own `SKILL.md`, `references/`, `feature_catalog/`, and `manual_testing_playbook/`.
   - Pros: preserves the existing family intent; matches `deep-loop-workflows`; keeps generic design queries under one identity; shared conventions live in the parent hub; backward compatibility is simpler (existing `sk-design-interface` triggers can fold to the direction packet).
   - Cons: the parent `SKILL.md` must stay logic-free (like `deep-loop-workflows`) to avoid becoming a god object; child release lines are coupled to the parent registry.

6. **Coupling and shared-runtime signals.**
   - `deep-loop-workflows` has high backend coupling: every mode consumes `deep-loop-runtime` (executor, coverage-graph, convergence). [SOURCE: file:.opencode/skills/deep-loop-workflows/graph-metadata.json:10-12]
   - `sk-design` children are guidance/reference skills, not runtime loops, so backend coupling is low. The shared "runtime" is the design process framework (ground → token system → critique → build → self-critique) and the quality floor. These can be referenced from the hub without executable coupling.
   - Because coupling is low, an umbrella router *could* work, but the loss of a unified advisor identity and the pre-existing family metadata favor the hub model.

7. **Preliminary recommendation**: use the **hub-with-nested-packets** model, mirroring `deep-loop-workflows`, with `sk-design/SKILL.md` as the logic-free router, `sk-design/mode-registry.json` (or `family-registry.json`) mapping public triggers to child packets, and one `graph-metadata.json` at the hub.

## Sources Consulted

- `.opencode/skills/deep-loop-workflows/SKILL.md`
- `.opencode/skills/deep-loop-workflows/mode-registry.json`
- `.opencode/skills/deep-loop-workflows/graph-metadata.json`
- `.opencode/skills/sk-code/SKILL.md` (smart routing section)
- `.opencode/skills/sk-code/graph-metadata.json`
- `.opencode/skills/sk-design-interface/graph-metadata.json`
- `.opencode/skills/sk-design-md-generator/graph-metadata.json`

## Assessment

- **newInfoRatio**: 0.65
- **noveltyJustification**: Provides concrete internal precedent and quantifies the trade-offs between hub and umbrella models.
- **status**: complete

## Reflection

- **What worked**: Reading the actual `mode-registry.json` and `graph-metadata.json` gave precise evidence for the hub model.
- **What failed**: None.
- **Ruled out**: The umbrella-router-over-siblings model is not preferred for `sk-design` because the family identity already exists and the children are not independent enough to justify separate advisor discovery.

## Recommended Next Focus

Iteration 6: Map the existing `sk-design-interface` and `sk-design-md-generator` skills into the proposed children and define backward-compatibility/onboarding implications.
