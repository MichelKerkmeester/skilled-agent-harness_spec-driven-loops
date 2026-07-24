# Iteration 2: Standalone Typed Identity and Native Resource Roots

## Focus
Resolve the typed identity semantics for the standalone `system-code-graph` skill and determine whether its `feature_catalog/` and `manual_testing_playbook/` resources should become legal leaf roots or be projected through aliases. The current-state diagnosis is kept separate from the proposed target contract: the skill currently emits no `workflowMode`, so `system-code-graph` below is a recommendation, not a claim about present behavior.

## Findings
1. **The durable singleton `workflowMode` should be `system-code-graph`, but only as an authored target-state identity.** The current router returns `intents`, `ambiguous`, and `resources`, not a mode, while the repository's typed manifests use stable public packet keys as `workflowMode` values (for example, packet `create-skill` uses mode `create-skill`). Using the standalone skill's public name provides the same durable namespace without pretending that a current mode exists. [SOURCE: .opencode/skills/system-code-graph/SKILL.md:295-299] [SOURCE: .opencode/skills/sk-doc/leaf-manifest.json:182-183] [INFERENCE: the stable public skill identity is the narrowest repository-aligned singleton namespace, based on the current return shape and manifest naming precedent]
2. **A singleton typed identity does not require converting the skill into a parent hub or adding `mode-registry.json`.** The skill contract requires only `SKILL.md` for a standalone packet, while `mode-registry.json` is required for a parent; sk-doc's authoring router likewise defines a standalone as one skill with one advisor identity and one runtime contract. The singleton mode can therefore be declared by the standalone leaf-manifest/router contract itself. [SOURCE: .opencode/skills/sk-doc/shared/assets/skill_contract.json:171-183] [SOURCE: .opencode/skills/sk-doc/create-skill/SKILL.md:62-66]
3. **`feature_catalog/` and `manual_testing_playbook/` should become legal packet-local leaf roots in a versioned contract extension, not aliases.** They are first-class discovery roots in the live skill, but contract version 1 accepts only `references/` and `assets/`; adding the two native roots changes the accepted identifier domain and should therefore accompany a contract-version bump rather than be described as compatible current behavior. [SOURCE: .opencode/skills/system-code-graph/SKILL.md:98-109] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:43-48] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:71-96] [INFERENCE: direct legal roots preserve packet-local identity and make the current finite non-index inventory typed without synthetic renaming]
4. **The existing alias mechanism is semantically and operationally the wrong projection for these native packages.** It is explicitly limited to authored mappings for a hub's shared tier, still validates the alias target through the `references/`/`assets/` leaf contract, and forbids generic prefix inference. Projecting native feature and scenario files through aliases would require synthetic canonical IDs plus one authored mapping per file, obscuring rather than preserving their real ownership. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:217-235] [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_hub_router_schema.md:298-313] [INFERENCE: aliases are appropriate for shared disk paths with explicit ownership, not intrinsic standalone packet roots]

## Ruled Out
- Claiming that `system-code-graph` is the current `workflowMode`: the current router does not emit any mode field.
- Converting the standalone skill into a parent hub solely to obtain a singleton mode namespace: standalone topology already supports one identity and one runtime contract.
- Mapping native feature/playbook files to synthetic `references/` or `assets/` aliases: the alias contract is for shared-tier ownership and would create unnecessary per-file indirection.

## Dead Ends
- Alias projection for the two native package roots is a dead end for the target contract; it preserves contract-v1 syntax only by hiding the actual resource topology.

## Edge Cases
- Ambiguous input: The word "canonical" could mean current authored state or recommended target state. This iteration treats current state as "no mode" and separately recommends `system-code-graph`.
- Contradictory evidence: The live router intentionally discovers `feature_catalog/` and `manual_testing_playbook/`, while typed contract v1 rejects those roots. The conflict is real but resolved at the design level by a proposed versioned root extension, not by claiming present compatibility. [SOURCE: .opencode/skills/system-code-graph/SKILL.md:103-109] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:43-48]
- Missing dependencies: None.
- Partial success: None; both identity and root-policy questions were answered with repository evidence, though implementation and benchmark validation remain outside this research iteration.

## Sources Consulted
- `.opencode/skills/system-code-graph/SKILL.md:57-300`
- `.opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:37-275`
- `.opencode/skills/sk-doc/shared/assets/skill_contract.json:171-183`
- `.opencode/skills/sk-doc/create-skill/SKILL.md:40-79`
- `.opencode/skills/sk-doc/leaf-manifest.json:1-216`
- `.opencode/skills/sk-doc/create-skill/references/parent_skill/parent_hub_router_schema.md:286-313`

## Assessment
- New information ratio: 0.98
- Novelty calculation: 3 fully new findings plus 1 partially new finding over 4 findings gives 0.875; resolving the identity/root-policy contradiction adds the 0.10 simplicity bonus, rounded to 0.98.
- Questions addressed: `Can every prefix/stem resource target be enumerated into a discrete, resolvable leaf set?`; `What canonical singleton workflowMode should identify this standalone skill, and should the typed contract permit feature_catalog/ and manual_testing_playbook/ leaves or project them through aliases?`
- Questions answered: Both. Current state has no mode and contract-v1 cannot type the two native roots; the recommended target is singleton mode `system-code-graph` plus a versioned contract that permits both roots directly, with selectors and package indexes remaining non-leaf.

## Reflection
- What worked and why: Comparing standalone topology rules, the typed-pair normalization boundary, and the alias contract separated three concerns that the current mismatch conflates: skill identity, legal leaf roots, and legacy/shared path translation.
- What did not work and why: Broad `workflowMode` searches produced mostly parent-hub examples; they were useful only after narrowing to the standalone contract and generated leaf manifest.
- What I would do differently: Start from the standalone packet-kind contract and leaf normalization boundary before scanning hub precedents, reducing irrelevant registry-driven examples.

## Recommended Next Focus
Establish the first skill-benchmark baseline against the unmodified current router, then define target typed gold using `workflowMode: system-code-graph` and the proposed versioned four-root leaf contract so diagnosis and optimization scores remain separate.
