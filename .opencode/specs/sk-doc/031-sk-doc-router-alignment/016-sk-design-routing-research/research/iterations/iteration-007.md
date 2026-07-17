# Iteration 7: Nested Transport Attribution and Typed-Gold Cardinality

## Focus
Stress-test the proposed fix plan against transport-only, design-only, and transport-plus-design requests, with emphasis on ambiguous prompts and the distinction between route-mode cardinality and typed-leaf-pair cardinality.

Exact route proof: `Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true`.

## Findings
1. Route-mode cardinality and typed-pair cardinality are different axes: one selected `workflowMode` can legitimately carry multiple `(workflowMode, leafResourceId)` pairs, while a two-mode bundle can have an underdetermined leaf oracle for one mode. The fixture contract parses an arbitrary list of typed pairs and validates each pair against the declared selected-mode set; it does not require exactly one pair per selected mode. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/validate-playbook-topology.cjs:70-100] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/validate-playbook-topology.cjs:203-219]
2. A transport-only WIRE scenario should select one mode, `design-mcp-open-design`, but admit two typed pairs when resource loading is part of the oracle: `references/mcp_wiring.md` and `references/od_cli_reference.md`. It must not add a design-judgment pair because WIRE is explicitly exempt; similarly, bare inventory remains transport-only, whereas design-bearing reads are guarded. [SOURCE: .opencode/skills/sk-design/design-mcp-open-design/references/smart_router_pseudocode.md:28-47] [SOURCE: .opencode/skills/sk-design/design-mcp-open-design/SKILL.md:82-96] [SOURCE: .opencode/skills/sk-design/design-mcp-open-design/references/tool_surface.md:65-97]
3. A design-only request should first narrow to one dominant design mode, then type only the packet-local leaves independently required by the prompt; that may be one pair or several same-mode pairs. Merely naming several candidate modes is not evidence for multiple-mode gold: the hub requires one focused question or an explicit smallest-useful-mode assumption, and permits a small set only for clearly separate axes. [SOURCE: .opencode/skills/sk-design/SKILL.md:54-71] [SOURCE: .opencode/skills/sk-design/SKILL.md:244-247] [SOURCE: .opencode/skills/sk-design/hub-router.json:4-12]
4. A RUN request that generates design through Open Design is not eligible for dominant-mode narrowing to the transport alone: it requires an ordered judgment-plus-transport bundle. `HM-004` independently fixes the route as `interface + design-mcp-open-design` when no other judgment axis dominates, while the topology validator explicitly supports simultaneous `+` bundles of at most two modes. However, HM-004 fixes the two-mode route but does not name an exact interface leaf, so it is suitable for bundle gold as written but needs a separately authored judgment-leaf oracle before claiming complete multi-pair leaf gold. [SOURCE: .opencode/skills/sk-design/manual_testing_playbook/hub_manager_intake/design_mode_pairing_before_run.md:13-33] [SOURCE: .opencode/skills/sk-design/design-mcp-open-design/SKILL.md:70-96] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/validate-playbook-topology.cjs:43-51] [INFERENCE: the scenario fixes both modes but only the transport contract fixes exact packet-local resources]
5. The prose and scenario contracts require judgment-plus-transport composition, but the machine-readable hub router currently declares only the `interface + foundations` bundle rule. This is a real edge-contract gap, not evidence that the transport should be flattened or that all multi-intent prompts should bundle: the implementation packet should add or otherwise prove a narrow RUN/design-feeding-READ pairing rule, with WIRE and exempt inventory as negative controls. [SOURCE: .opencode/skills/sk-design/hub-router.json:4-25] [SOURCE: .opencode/skills/sk-design/SKILL.md:263-267] [SOURCE: .opencode/skills/sk-design/manual_testing_playbook/hub_manager_intake/design_mode_pairing_before_run.md:22-33] [INFERENCE: the normative composition rule lacks a corresponding machine-readable bundle rule]

## Ruled Out
- Assigning multiple judgment modes or all candidate leaves to an ambiguous design prompt; candidate naming triggers clarification or a stated narrowing assumption, not hedge-everything gold. [SOURCE: .opencode/skills/sk-design/SKILL.md:54-57]
- Treating every Open Design mention as a two-mode bundle; WIRE and bare inventory are explicit transport-only exemptions. [SOURCE: .opencode/skills/sk-design/design-mcp-open-design/references/smart_router_pseudocode.md:40-47]
- Treating a RUN request as transport-only because `design-mcp-open-design` is a distinct public mode; generation still has a mandatory design-judgment precondition. [SOURCE: .opencode/skills/sk-design/design-mcp-open-design/SKILL.md:82-96]

## Dead Ends
- A universal cardinality rule such as “one selected mode equals one typed pair” is invalid because selected modes and expected leaves are independently plural. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/validate-playbook-topology.cjs:70-100] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/validate-playbook-topology.cjs:203-219]

## Edge Cases
- Ambiguous input: Multi-intent requests divide into unclear candidate lists, which require clarification/narrowing, and clearly separate axes, which may form an ordered bundle; typed gold must not conflate them.
- Contradictory evidence: Normative hub/transport prose and HM-004 require judgment-plus-transport composition for RUN, while `hub-router.json` has no transport bundle rule. The intended semantics are better supported by the two independent prose contracts, but machine enforcement remains unproven until a routed HM-004-style check passes. [SOURCE: .opencode/skills/sk-design/SKILL.md:263-267] [SOURCE: .opencode/skills/sk-design/design-mcp-open-design/SKILL.md:82-96] [SOURCE: .opencode/skills/sk-design/hub-router.json:19-25]
- Missing dependencies: A committed manifest and independently authored judgment-leaf oracle are still required before HM-004 can become complete multi-pair leaf gold; bundle semantics alone do not supply the missing leaf.
- Partial success: none; the three requested semantic classes are classified without modifying sources or fixtures.

## Sources Consulted
- `.opencode/skills/sk-design/SKILL.md:54-75,236-267`
- `.opencode/skills/sk-design/hub-router.json:1-25`
- `.opencode/skills/sk-design/design-mcp-open-design/SKILL.md:70-96,123-133`
- `.opencode/skills/sk-design/design-mcp-open-design/references/smart_router_pseudocode.md:20-56`
- `.opencode/skills/sk-design/design-mcp-open-design/references/tool_surface.md:65-97`
- `.opencode/skills/sk-design/manual_testing_playbook/manual_testing_playbook.md:178-267`
- `.opencode/skills/sk-design/manual_testing_playbook/mode_routing/mcp_open_design_mode.md:13-62`
- `.opencode/skills/sk-design/manual_testing_playbook/hub_manager_intake/design_mode_pairing_before_run.md:13-58`
- `.opencode/skills/sk-doc/create-skill/scripts/validate-playbook-topology.cjs:40-100,165-221`

## Assessment
- New information ratio: 0.70
- Novelty justification: 1 of 5 findings is fully new and 4 are partially new edge-case refinements (raw 0.60), plus a 0.10 simplicity bonus for separating route-mode cardinality from leaf-pair cardinality.
- Questions addressed: What typed-gold cardinality is appropriate for transport-only, design-only, and transport-plus-design scenarios?
- Questions answered: What typed-gold cardinality is appropriate for transport-only, design-only, and transport-plus-design scenarios?

## Reflection
- What worked and why: Comparing the hub's dominant-mode policy, transport gate, representative WIRE/RUN scenarios, and fixture validator exposed the two independent cardinality axes and the missing machine-readable composition rule.
- What did not work and why: Broad ambiguity search returned many domain-irrelevant uses of “dominant” and “ambiguous”; exact contract reads around the hub, HM-004, and validator supplied the useful evidence.
- What I would do differently: Start from the three scenario classes and build a route-mode/leaf-pair matrix before searching for ambiguity vocabulary.

## Recommended Next Focus
For the final iteration, synthesize an acceptance matrix that tests transport WIRE, exempt inventory, design-bearing READ, RUN composition, ambiguous candidate lists, and explicit two-axis bundles without changing router sources or fixtures.
