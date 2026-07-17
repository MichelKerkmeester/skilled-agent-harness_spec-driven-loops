# Iteration 1: Current sk-prompt routing and implied typed-pair surface

## Focus

Map `prompt-improve` and `prompt-models` to their owning packets, current hub and packet router declarations, routable leaf resources, and the implied canonical `(workflowMode, leafResourceId)` surface. The phrase “surface router” is interpreted narrowly as the second-layer leaf-resource router, not as a request to convert `prompt-models` into a registry `packetKind: surface`.

## Actions Taken

1. Inspected the hub registry, hub router, and hub routing contract.
2. Inspected both packet-level smart routers and their declared resource-loading behavior.
3. Enumerated the `prompt-models` reference and asset inventory and checked the active-profile index.
4. Compared the current design with the sk-doc packet-qualified typed-pair contract and scaffold.

## Findings

1. The first routing layer is already deterministic: `prompt-improve` maps to packet `prompt-improve`, backend `prompt-engine`, and a mutating tool surface; `prompt-models` maps to packet `prompt-models`, backend `profile-lookup`, and a read-only tool surface. Both are intentionally `packetKind: workflow`. [SOURCE: .opencode/skills/sk-prompt/mode-registry.json:16] [SOURCE: .opencode/skills/sk-prompt/mode-registry.json:29]

2. `hub-router.json` performs only workflow selection. It defaults to `prompt-improve`, assigns mode-specific vocabulary, and emits packet entrypoint addresses (`prompt-improve/SKILL.md` or `prompt-models/SKILL.md`); it has no per-intent leaf map and no bundle rules. The hub contract likewise says outcomes are `single`, `orderedBundle`, or `defer`, with no registry surface axis. [SOURCE: .opencode/skills/sk-prompt/hub-router.json:4] [SOURCE: .opencode/skills/sk-prompt/hub-router.json:13] [SOURCE: .opencode/skills/sk-prompt/hub-router.json:16] [SOURCE: .opencode/skills/sk-prompt/SKILL.md:81]

3. `prompt-improve` declares seven packet intents but only six unique routable Markdown leaves: `references/depth_framework.md`, `references/patterns_evaluation.md`, `references/design_generation_patterns.md`, and the Markdown/JSON/YAML format guides. Its implied typed surface is therefore six pairs whose mode is always `prompt-improve` and whose `leafResourceId` is each of those packet-root-relative paths. `RAW` intentionally maps to no leaf. [SOURCE: .opencode/skills/sk-prompt/prompt-improve/SKILL.md:121] [SOURCE: .opencode/skills/sk-prompt/prompt-improve/SKILL.md:130] [SOURCE: .opencode/skills/sk-prompt/prompt-improve/SKILL.md:137]

4. `prompt-models` has routing logic but no explicit `RESOURCE_MAP`: it always loads `references/models/_index.md`, resolves one of five active model ids, then loads `references/models/<id>.md` and `references/pattern_index.md`. Its minimum implied typed surface is seven pairs under `workflowMode: prompt-models`: the index, pattern index, and five active profiles (`deepseek-v4-pro`, `kimi-k2.7-code`, `minimax-m3`, `mimo-v2.5-pro`, `glm-5.2`). The index links all five active profile files, and repository inventory confirmed those seven leaves exist. [SOURCE: .opencode/skills/sk-prompt/prompt-models/SKILL.md:123] [SOURCE: .opencode/skills/sk-prompt/prompt-models/SKILL.md:168] [SOURCE: .opencode/skills/sk-prompt/prompt-models/SKILL.md:182] [SOURCE: .opencode/skills/sk-prompt/prompt-models/references/models/_index.md:24]

5. The typed-pair recipe requires a separate second-layer map containing hub-root-relative, packet-qualified raw addresses; the leaf contract converts each raw address exactly once into `(workflowMode, leafResourceId)`. Consequently, `prompt-improve`'s current packet-root-relative `RESOURCE_MAP` is valid inside its packet but cannot be copied verbatim as hub-level typed gold; its entries need a `prompt-improve/` prefix, while the proposed model leaves need `prompt-models/`. [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_hub_router_schema.md:286] [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_hub_router_schema.md:298] [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_hub_router_schema.md:307] [SOURCE: .opencode/skills/sk-doc/create-skill/assets/parent_skill/parent_skill_smart_routing_template.md:10]

6. Adding a registry surface packet is ruled out for this optimization. The existing architecture explicitly classifies both packets as workflows because `prompt-models` is consumed by `cli-opencode` outside this hub; the compatible optimization is a hub-level second-layer leaf router while preserving both workflow modes and current fallback behavior. [SOURCE: .opencode/skills/sk-prompt/SKILL.md:36] [SOURCE: .opencode/skills/sk-prompt/SKILL.md:106] [INFERENCE: the typed-pair scaffold at `.opencode/skills/sk-doc/create-skill/assets/parent_skill/parent_skill_smart_routing_template.md:3` adds leaf selection without changing registry packet kinds]

## Questions Answered

- **Answered:** How do `prompt-improve` and `prompt-models` currently route, and what `(workflowMode, leafResourceId)` pairs do they imply?

## Questions Remaining

- Define the complete `prompt-models` `RESOURCE_MAP`, including whether shared supporting references/assets beyond the seven minimum routing leaves belong in typed gold, then recheck every proposed address.
- Reconcile the stated baseline score of 100 with the checked report, which currently records `aggregateScore: null`, D1-D4 null, and D5 16.
- Classify the 32 playbook scenarios for independently authored typed gold.
- Produce the dependency-ordered change plan without weakening unknown/ambiguous fallback behavior.

## Dead Ends or Ruled Out

- **Ruled out:** treating `prompt-models` as a registry surface packet; this contradicts the documented same-hub consumer criterion. [SOURCE: .opencode/skills/sk-prompt/mode-registry.json:7]
- **Ruled out:** treating the hub router's packet `SKILL.md` pointers as leaf-resource gold; the schema distinguishes `hubLoadAddress` from `leafResourceId`. [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_hub_router_schema.md:298]

## Edge Cases

- **Ambiguous input:** “hub-level surface router” could mean a registry surface axis or a second-layer leaf router. The latter was selected because it matches the typed-pair contract while preserving the explicit workflow-only architecture.
- **Contradictory evidence:** none within this iteration's routing-map focus; the baseline-score contradiction is retained for the next focus.
- **Missing dependencies:** Spec Memory was unavailable before dispatch; direct packet and repository evidence was used as required by the prompt pack.
- **Partial success:** none. The first key question is answered; later key questions were intentionally not expanded beyond this iteration's focus.

## Sources Consulted

- `.opencode/skills/sk-prompt/SKILL.md:12`
- `.opencode/skills/sk-prompt/mode-registry.json:1`
- `.opencode/skills/sk-prompt/hub-router.json:1`
- `.opencode/skills/sk-prompt/prompt-improve/SKILL.md:53`
- `.opencode/skills/sk-prompt/prompt-models/SKILL.md:55`
- `.opencode/skills/sk-prompt/prompt-models/references/models/_index.md:22`
- `.opencode/skills/sk-doc/create-skill/references/parent_skill/parent_hub_router_schema.md:286`
- `.opencode/skills/sk-doc/create-skill/assets/parent_skill/parent_skill_smart_routing_template.md:1`

## Assessment

- New information ratio: 1.00
- Questions addressed: current mode routing and implied typed-pair surface
- Questions answered: 1 of 5
- Novelty basis: all six findings establish the first packet-specific routing map for this research run.

## Reflection

- What worked and why: reading registry, hub router, and both packet routers together separated first-layer packet addresses from second-layer leaf ids.
- What did not work and why: the phrase “surface router” was overloaded; resolving it required checking the authoritative typed-pair path contract rather than relying on the registry's `surface` term.
- What I would do differently: next iteration should start from an explicit candidate `prompt-models` map and test each entry against scenario-level expected loads.

## Next Focus

Specify the complete packet-qualified `prompt-models` resource map, decide which supporting resources are route-selectable versus merely linked data, and verify every proposed leaf address before scoring typed pairs.
