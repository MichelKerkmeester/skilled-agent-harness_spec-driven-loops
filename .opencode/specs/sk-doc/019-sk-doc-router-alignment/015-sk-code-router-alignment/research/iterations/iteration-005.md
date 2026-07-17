# Iteration 5: Shared Preamble Typed-Identity Contract

## Focus

Determine whether turning the universal preamble into a real declared `shared` manifest mode would clear `routing_contract_error`, compare that design with authored aliases and explicit exclusion, and identify which benchmark metrics could legitimately remain invariant. The narrow interpretation is contract identity only; no router or benchmark mutation was performed.

## Findings

1. A real shared mode can mechanically resolve the preamble, but only as a coordinated three-part contract change: add a registry mode whose packet is `shared`, packet-qualify each preamble path as `shared/references/...`, and regenerate the manifest so that mode owns those `references/...` leaves. Declared packet prefixes resolve to typed pairs, and the manifest generator scans every declared packet's `references/` and `assets/` trees. Merely adding a manifest row or merely rewriting the prefix is insufficient. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:190-214] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:88-129]
2. That design is not contract-only under the current hub authority. Every registry mode must also appear bidirectionally in `hub-router.json` signals and exactly once in its tie-break list, while sk-code currently declares only two workflow and two surface modes. A real `shared` mode therefore expands routable hub topology and can affect D5/conformance unless the hub router is also changed; static evidence cannot establish preservation of 18/18 surface routing after that expansion. [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_hub_router_schema.md:317-329] [SOURCE: .opencode/skills/sk-code/mode-registry.json:21-99] [INFERENCE: adding a fifth registry mode triggers the authority's bidirectional router-signal and tie-break obligations]
3. Authored aliasing is the typed-pair authority's preferred mechanism for a physical `shared/...` file that belongs logically to an existing mode. `leaf-aliases.json` maps a shared disk path to one explicit `(workflowMode, leafResourceId)` pair, and manifest generation adds that alias leaf under the named mode without introducing another routable mode. This is conformant only if each universal file has one honest mode owner; the resolver returns the first matching disk path, so duplicating one shared path across several mode aliases would create order-dependent ownership rather than a mode-neutral identity. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:217-236] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:50-67] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:88-108]
4. Silent exclusion is not supported by the current identity contract. The authority permits exactly packet-qualified declared-mode paths or authored shared aliases and otherwise fails closed with `UNRECOGNIZED_LEGACY_SHAPE`. Excluding universal preamble entries from typed diagnostics would therefore require an explicit new resource category and scorer/oracle policy; simply dropping unresolved entries would conceal contract drift and is ruled out. [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_hub_router_schema.md:298-313] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:239-275]
5. The contract decision is: do not model the universal preamble as an ordinary routable `shared` mode under the present schema. Prefer authored aliases when a truthful single owner exists; if the files are genuinely mode-neutral, extend the typed contract with an explicit non-routable shared owner before implementation. In a genuinely identity-only experiment, surface selection, selected raw resources, flat expected-leaf hit counts, D1/D2 recall proxies, and D3 waste should remain byte-for-byte or numerically unchanged; only unresolved-resource counts, `routing_contract_error`, typed-pair eligibility/recall, manifest digest, and possibly the verdict gate should change. A declared ordinary mode does not qualify for that invariant claim because it changes registry topology. [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/015-sk-code-router-alignment/research/findings-registry.json:173-240] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:113-126] [INFERENCE: changing only raw-to-typed identity leaves the router's selected raw resource set unchanged, whereas adding a registry mode changes a D5-governed topology input]

## Ruled Out

- A manifest-only hidden `shared` entry: the generator derives modes from the registry, and the hub authority requires every registry mode in router signals and tie-break policy. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:111-129] [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_hub_router_schema.md:317-329]
- Multiple aliases with the same shared disk path to simulate mode-neutral ownership: shared resolution returns the first matching alias, making ownership order-dependent. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:227-236]
- Prefix-only rewriting and silent exclusion: the former is already blocked, and the latter is fail-open behavior absent from the authority. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:239-275]

## Dead Ends

- Treating `shared` as a manifest-only non-routable mode under the current registry schema. It cannot simultaneously be an ordinary declared mode for leaf identity and remain absent from hub-router conformance.
- Treating universal preamble resources as outside the typed contract without adding an explicit, validated exclusion category.

## Edge Cases

- Ambiguous input: none; “real shared manifest mode” was interpreted as a mode declared in `mode-registry.json`, not an undeclared manifest-only owner.
- Contradictory evidence: none; the packet-qualified resolver can technically resolve a declared `shared` packet, while the shared-tier rule requires aliases only when `shared` remains a tier rather than becoming a declared packet mode.
- Missing dependencies: a controlled mutated benchmark was unavailable because this iteration explicitly forbids implementation. Metric preservation is therefore an inference and not an observed experiment result.
- Partial success: none; the contract question is answered, while empirical non-degradation remains an explicit later verification gate.

## Sources Consulted

- `.opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:43-360`
- `.opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:7-168`
- `.opencode/skills/sk-doc/create-skill/references/parent_skill/parent_hub_router_schema.md:286-329`
- `.opencode/skills/sk-doc/create-skill/assets/parent_skill/parent_skill_smart_routing_template.md:1-52`
- `.opencode/skills/sk-code/mode-registry.json:1-100`
- `.opencode/skills/sk-code/leaf-manifest.json:1-223`
- `.opencode/specs/sk-doc/019-sk-doc-router-alignment/015-sk-code-router-alignment/research/findings-registry.json:173-240`

## Assessment

- New information ratio: 0.80
- Questions addressed: Does packet-qualifying the universal preamble as a shared manifest mode clear `routing_contract_error` without degrading surface routing?
- Questions answered: A complete declared-mode change should clear the identity error, but it is not contract-only and cannot claim surface invariance; the current contract should use truthful authored ownership or gain an explicit non-routable shared-owner type.

## Reflection

- What worked and why: Comparing the resolver, manifest generator, and hub-router conformance authority exposed the difference between a technically resolvable packet prefix and a semantically non-routable shared tier.
- What did not work and why: Static inspection cannot prove post-change benchmark invariance because the no-implementation constraint prevents the required controlled mutation and replay.
- What I would do differently: In an implementation/planning phase, define the intended ownership semantics first, then run paired baseline/candidate reports and require unchanged surface decisions and raw routed-resource sets before accepting typed-contract improvements.

## Recommended Next Focus

Specify the concrete routing-template, scoring-logic, and JSON-artifact changes most likely to improve missed expected leaves without increasing D3 waste. Keep the shared-owner decision separate from recall optimization, and include a later paired experiment that distinguishes identity-only metric changes from topology changes.
