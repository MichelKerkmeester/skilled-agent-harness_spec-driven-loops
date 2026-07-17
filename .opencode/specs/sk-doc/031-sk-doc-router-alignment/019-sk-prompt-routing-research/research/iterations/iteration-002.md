# Iteration 2: Dependency-ordered typed-pair routing change plan

## Focus

Produce a dependency-ordered change plan for adding sk-prompt's second-layer typed-pair router without weakening the existing unknown, ambiguous, or missing-resource behavior. “Fallback behavior” is interpreted as the combined hub fallback plus each packet's own fallback; implementation remains exclusively in the sibling packet.

## Findings

1. The first dependency is to freeze the existing first-layer contract, not replace it: keep both registry entries as workflow modes, keep `hub-router.json` responsible only for mode selection and packet entrypoints, and add the per-intent leaf map separately at `shared/references/smart_routing.md`. The authoritative recipe says hub resources are packet entrypoints while leaf gold belongs in the second-layer router, and the current hub explicitly keeps packet behavior unflattened. [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_hub_router_schema.md:298] [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_hub_router_schema.md:307] [SOURCE: .opencode/skills/sk-prompt/SKILL.md:74] [SOURCE: .opencode/skills/sk-prompt/SKILL.md:85]

2. The second dependency is to author packet-qualified `INTENT_SIGNALS` and `RESOURCE_MAP` entries before producing typed gold. The map must use `prompt-improve/references|assets/...` and `prompt-models/references|assets/...` raw addresses, which the contract converts exactly once to packet-root-relative `leafResourceId` values; unrecognized prefixes must fail closed rather than be stripped heuristically. [SOURCE: .opencode/skills/sk-doc/create-skill/assets/parent_skill/parent_skill_smart_routing_template.md:10] [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_hub_router_schema.md:309] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:20] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:190]

3. Fallback preservation needs three explicit invariants, because the current layers intentionally differ: hub ambiguity loads only `prompt-improve/SKILL.md` and asks for mode/model/format; `prompt-improve` zero-score routing loads only its default DEPTH resource and returns a checklist; `prompt-models` unknown-model routing loads only `_index.md` and returns its model checklist, while a known-but-missing profile remains index-only. The new surface router must load no leaf on no keyword match and must not turn either fallback into a guessed typed pair. [SOURCE: .opencode/skills/sk-prompt/SKILL.md:63] [SOURCE: .opencode/skills/sk-prompt/SKILL.md:70] [SOURCE: .opencode/skills/sk-prompt/prompt-improve/SKILL.md:222] [SOURCE: .opencode/skills/sk-prompt/prompt-models/SKILL.md:168] [SOURCE: .opencode/skills/sk-prompt/prompt-models/SKILL.md:173] [SOURCE: .opencode/skills/sk-doc/create-skill/assets/parent_skill/parent_skill_smart_routing_template.md:43]

4. Manifest generation must follow registry/resource authoring but precede scenario gold. The generator enumerates each registered mode's on-disk `references/` and `assets/`, rejects duplicate composite pairs, and writes a canonical manifest; the topology validator then requires every scenario pair to have a workflow mode and contained leaf id, resolve in that manifest, and belong to the scenario's selected mode. Therefore the safe order is: resource/map declarations → `leaf-manifest.json` generation/check → independently authored scenario pairs → topology gate. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:88] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:111] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:120] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/validate-playbook-topology.cjs:165] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/validate-playbook-topology.cjs:187] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/validate-playbook-topology.cjs:203]

5. Lexical optimization belongs after a typed baseline and fallback regression fixtures, not before them. The hub currently uses `ambiguityDelta: 1`, deterministic tie-breaking, default mode `prompt-improve`, and an ordered bundle only for clearly separate intents; changing vocabulary or weights before typed replay would confound contract enablement with behavior tuning. Preserve the current policy first, measure typed routing, then adjust the smallest signal set and rerun unknown/no-keyword, near-tie, explicit dual-intent, and named-model cases. [SOURCE: .opencode/skills/sk-prompt/hub-router.json:4] [SOURCE: .opencode/skills/sk-prompt/hub-router.json:7] [SOURCE: .opencode/skills/sk-prompt/hub-router.json:8] [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_hub_router_schema.md:256] [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_hub_router_schema.md:270]

6. The existing 100 score is not a sufficient pre-change routing baseline: the canonical report has D1-intra and D2 at 100 but D1-inter, D3, and D4 unscored, while the benchmark summary says the four current hub scenarios only exercise packet selection and identifies child-router conformance gaps. The change plan must therefore record both the current report and a new typed-pair baseline before claiming improvement. [SOURCE: .opencode/skills/sk-prompt/benchmark/router_final/skill-benchmark-report.json:12] [SOURCE: .opencode/skills/sk-prompt/benchmark/router_final/skill-benchmark-report.json:29] [SOURCE: .opencode/skills/sk-prompt/benchmark/router_final/skill-benchmark-report.json:43] [SOURCE: .opencode/skills/sk-prompt/benchmark/BENCHMARK-SUMMARY.md:27] [SOURCE: .opencode/skills/sk-prompt/benchmark/BENCHMARK-SUMMARY.md:36]

## Ruled Out

- Replacing `hub-router.json` resources with leaf paths: this conflates `hubLoadAddress` with `leafResourceId`. [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_hub_router_schema.md:298]
- Adding lexical carve-outs before measuring typed-pair behavior: the current hub itself requires benchmark evidence before such a carve-out. [SOURCE: .opencode/skills/sk-prompt/SKILL.md:124]
- Treating UNKNOWN as the default mode's normal leaf set: the second-layer scaffold requires no resource load on a no-keyword match. [SOURCE: .opencode/skills/sk-doc/create-skill/assets/parent_skill/parent_skill_smart_routing_template.md:46]

## Dead Ends

- No new exhausted approach category. The prior ruled-out conversions of `prompt-models` to a surface packet and packet `SKILL.md` pointers to leaf gold remain excluded.

## Edge Cases

- Ambiguous input: “fallback behavior” spans hub and packet routers; this iteration preserves all three documented fallback branches rather than selecting one.
- Contradictory evidence: none in the change-order evidence. The existing aggregate 100 is retained as a partial score, not treated as proof of full routing coverage.
- Missing dependencies: Spec Memory remains unavailable; packet-local and repository evidence was sufficient.
- Partial success: none. The dependency-order question is answered; resource-map completeness, scenario classification, and the post-typed score remain for later iterations.

## Sources Consulted

- `.opencode/skills/sk-prompt/hub-router.json:4`
- `.opencode/skills/sk-prompt/SKILL.md:63`
- `.opencode/skills/sk-prompt/prompt-improve/SKILL.md:222`
- `.opencode/skills/sk-prompt/prompt-models/SKILL.md:168`
- `.opencode/skills/sk-doc/shared/references/smart_routing.md:3`
- `.opencode/skills/sk-doc/create-skill/assets/parent_skill/parent_skill_smart_routing_template.md:10`
- `.opencode/skills/sk-doc/create-skill/references/parent_skill/parent_hub_router_schema.md:298`
- `.opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:10`
- `.opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:88`
- `.opencode/skills/sk-doc/create-skill/scripts/validate-playbook-topology.cjs:165`
- `.opencode/skills/sk-prompt/benchmark/router_final/skill-benchmark-report.json:12`
- `.opencode/skills/sk-prompt/benchmark/BENCHMARK-SUMMARY.md:27`

## Assessment

- New information ratio: 0.93
- Questions addressed: What dependency-ordered changes produce a hub-level surface router and improve routing without weakening fallback behavior?
- Questions answered: dependency-ordered change plan and fallback-preservation invariants
- Novelty basis: four findings are fully new and two are partial extensions of iteration 1; the 0.10 simplicity bonus reflects consolidation into one dependency order that closes a key question.

## Reflection

- What worked and why: joining the hub contract, packet fallback branches, manifest generator, and topology validator exposed a strict authoring and verification order rather than a file checklist.
- What did not work and why: broad repository searches returned unrelated packet benchmarks; narrowing to the typed-pair scripts and current sk-prompt reports produced actionable dependencies.
- What I would do differently: next iteration should enumerate the complete `prompt-models` map first and classify each candidate as route-selected, always-loaded, linked supporting data, or non-Markdown registry data.

## Recommended Next Focus

Define and resolve-check the complete `prompt-models` `RESOURCE_MAP`, explicitly deciding whether `_index.md`, `pattern_index.md`, five active profiles, and shared assets are typed route leaves or supporting-only resources; then emit the packet-qualified candidate map needed before scenario gold.
