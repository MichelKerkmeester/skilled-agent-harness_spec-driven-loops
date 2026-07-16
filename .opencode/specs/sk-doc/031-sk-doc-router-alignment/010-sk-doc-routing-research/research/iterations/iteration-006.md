# Iteration 6: Prioritize the implementable sk-doc routing fixes

## Focus

Answer Q5 with one dependency-ordered implementation plan. Choose the public leaf-path namespace, specify the conversion boundary, and name the exact live files, templates, validators, fixtures, and report paths each fix changes. Preserve the distinct benchmark classes: 6 wrong-root, 6 missing-leaf, 5 over-bundle, and 2 clean rows, including the four threshold-pass rows that still lose D3 efficiency.

## Actions Taken

1. Read the reducer-owned strategy, canonical JSONL state, iteration 5, and its delta; confirmed Q5 is the only remaining question and did not re-enter the saturated alias-equality direction.
2. Re-read iterations 3-5 to preserve the 19-row causal split and the six validator-boundary results rather than collapsing them into one router defect.
3. Compared the live `sk-doc` router/registry and all eleven packet routers with the create-skill standalone and parent-hub templates to choose a path contract that both layers can implement.
4. Traced the benchmark's optional second-layer router, fixture loader, score join, and report emission to place topology validation and provenance checks before scoring.

## Findings

### 1. Priority 1 — make public leaf IDs packet-root-relative and type both coordinate systems

The canonical public identifier must be the pair `(workflowMode, leafResourceId)`, where `leafResourceId` is packet-root-relative and begins with `references/` or `assets/`. Internal hub load addresses remain hub-root-relative and packet-qualified, such as `create-agent/SKILL.md`. The conversion boundary is **after the hub selects `workflowMode` and the packet router returns local resources, but before the route is serialized to a caller or benchmark**. At that boundary, emit the packet's already-local `references/...` / `assets/...` values unchanged; never prepend `modes[].packet`. Shared physical files are projected through the manifest into the selected mode's public namespace, so `shared/assets/changelog_template.md` can have the public ID `assets/changelog_template.md` for `create-changelog` without pretending the physical file moved.

This convention wins because packet routers already derive values with `doc.relative_to(SKILL_ROOT)`, while the benchmark gold uses exact root-relative strings. Packet-qualified public IDs would require rewriting the scorer corpus and every packet return contract, and would preserve the ambiguity that directly explained four wrong-root rows. The mode/leaf pair also prevents collisions between identical local names such as `references/README.md`. [SOURCE: .opencode/skills/sk-doc/create-skill/assets/skill/skill_smart_router.md:44] [SOURCE: .opencode/skills/sk-doc/create-skill/assets/skill/skill_smart_router.md:52] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:65] [SOURCE: .opencode/specs/sk-doc/031-sk-doc-router-alignment/010-sk-doc-routing-research/research/iterations/iteration-004.md:19]

Concrete changes:

- `.opencode/skills/sk-doc/hub-router.json`: add a `pathContract` schema object declaring `hubLoadAddress = hub-root-relative/packet-qualified`, `leafResourceId = packet-root-relative references|assets`, `leafIdentity = [workflowMode, leafResourceId]`, and `conversionBoundary = packet-router-output`. Keep `routerSignals[].resources` typed as internal `hubLoadAddress`; do not reuse that field for public leaves. [SOURCE: .opencode/skills/sk-doc/hub-router.json:13] [SOURCE: .opencode/skills/sk-doc/hub-router.json:23]
- `.opencode/skills/sk-doc/mode-registry.json`: add `resourceContractVersion` at the root and `leafManifestKey` per mode. The key equals the owning packet, so `create-skill` and `create-skill-parent` intentionally share `create-skill`; this makes N-to-1 packet multiplexing explicit instead of inferring it at the score boundary. Existing `modes[].packet` remains the physical resolution base. [SOURCE: .opencode/skills/sk-doc/mode-registry.json:18] [SOURCE: .opencode/skills/sk-doc/mode-registry.json:30]
- `.opencode/skills/sk-doc/SKILL.md`: extend the hub pseudocode return contract to return `workflowMode`, internal `packetEntry`, and packet-local `leafResourceIds` as separate fields, with a hard rule forbidding packet-prefix insertion into leaf IDs. [SOURCE: .opencode/skills/sk-doc/SKILL.md:57] [SOURCE: .opencode/skills/sk-doc/SKILL.md:88]
- `.opencode/skills/sk-doc/create-skill/assets/skill/skill_smart_router.md`: add a named `leafResourceId` definition beside `SKILL_ROOT`, change the example return shape to include it, and state that a parent hub must pair it with `workflowMode` but must not prepend the packet directory. [SOURCE: .opencode/skills/sk-doc/create-skill/assets/skill/skill_smart_router.md:44] [SOURCE: .opencode/skills/sk-doc/create-skill/assets/skill/skill_smart_router.md:69]
- `.opencode/skills/sk-doc/create-skill/assets/parent_skill/parent_skill_hub_router_template.json` and `.opencode/skills/sk-doc/create-skill/references/parent_skill/parent_hub_router_schema.md`: add the same typed `pathContract` and distinguish `routerSignals[].resources` load addresses from second-layer public leaves. The current schema calls both default and signal resources hub-root-relative but defines no output type. [SOURCE: .opencode/skills/sk-doc/create-skill/assets/parent_skill/parent_skill_hub_router_template.json:16] [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_hub_router_schema.md:89] [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_hub_router_schema.md:176]
- Add the identical public-output sentence and return-field shape to these exact packet contracts: `.opencode/skills/sk-doc/create-agent/SKILL.md`, `create-benchmark/SKILL.md`, `create-changelog/SKILL.md`, `create-command/SKILL.md`, `create-diff/SKILL.md`, `create-feature-catalog/SKILL.md`, `create-flowchart/SKILL.md`, `create-manual-testing-playbook/SKILL.md`, `create-quality-control/SKILL.md`, `create-readme/SKILL.md`, and `create-skill/SKILL.md`. Every packet must emit only local leaf IDs; cross-packet physical paths are resolved by the manifest, not leaked into the public array. [SOURCE: .opencode/skills/sk-doc/create-agent/SKILL.md:66] [SOURCE: .opencode/skills/sk-doc/create-changelog/SKILL.md:81] [SOURCE: .opencode/skills/sk-doc/create-quality-control/SKILL.md:58] [SOURCE: .opencode/skills/sk-doc/create-skill/SKILL.md:86]
- `.opencode/commands/doctor/scripts/parent-skill-check.cjs`: add a guard immediately after existing resource-existence checks that validates both declared path roles and rejects packet-prefixed `leafResourceId` values or unqualified `hubLoadAddress` values. Existing checks prove existence, not coordinate semantics. [SOURCE: .opencode/specs/sk-doc/031-sk-doc-router-alignment/010-sk-doc-routing-research/research/iterations/iteration-005.md:32]

Measured target: the 6 wrong-root class. Four are confirmed handoff errors; `SD-020` and `SD-016` remain separate gold/provenance cases and are not claimed as template-only fixes.

### 2. Priority 2 — add an authored second-layer router, generated recursive manifest, and pre-dispatch fixture gate

The second layer needs two artifacts with different ownership. Routing intent is semantic and must be authored per hub; topology is mechanical and should be generated. Create `.opencode/skills/sk-doc/shared/references/smart_routing.md` with machine-readable `INTENT_SIGNALS`, `RESOURCE_MAP`, and `DEFAULT_RESOURCE` blocks whose values are canonical packet-local leaf IDs. Create `.opencode/skills/sk-doc/leaf-manifest.json` as a generated projection mapping `(workflowMode, leafResourceId)` to one physical hub-root path and recording shared-file aliases. The existing replay already probes the proposed `shared/references/smart_routing.md` location, while its current hub path otherwise stops at packet `SKILL.md` resources. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:389] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:396] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:501]

Concrete changes:

- New `.opencode/skills/sk-doc/shared/references/smart_routing.md`: authored sk-doc intent-to-leaf map, including exact leaves rather than directory placeholders, and an explicit full-inventory intent rather than treating empty keywords as permission to load everything.
- New `.opencode/skills/sk-doc/leaf-manifest.json`: generated recursive leaf projection keyed by `leafManifestKey` and canonical public ID; include explicit aliases such as `create-changelog + assets/changelog_template.md -> shared/assets/changelog_template.md` and `create-quality-control + assets/llmstxt_templates.md -> shared/assets/llmstxt_templates.md`.
- New `.opencode/skills/sk-doc/create-skill/assets/parent_skill/parent_skill_smart_routing_template.md`: scaffold the second-layer router for every new resource-bearing hub. The create-skill template should generate the structure, but the hub author must fill semantic intent/resource membership; file discovery cannot infer that judgment.
- New `.opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs`: recursively enumerate every registered packet's `references/` and `assets/` plus declared shared aliases and emit stable sorted manifest entries. `.opencode/skills/sk-doc/create-skill/SKILL.md` must make generation and drift validation part of parent-hub creation.
- `.opencode/commands/doctor/scripts/parent-skill-check.cjs`: add a recursive check that regenerates the manifest in memory, compares it with `leaf-manifest.json`, validates every `smart_routing.md` resource against the selected mode, and detects orphan manifest entries. This is the missing hub-wide leaf-coverage guard.
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/d5-connectivity.cjs`: consume the same manifest for hub D5 instead of treating a root-only `references/`/`assets/` scan as nested coverage. [SOURCE: .opencode/specs/sk-doc/031-sk-doc-router-alignment/010-sk-doc-routing-research/research/iterations/iteration-005.md:40]
- New `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/validate-routing-fixtures.cjs`: validate every positive `(expectedIntent, expectedResource)` against the router plus manifest before dispatch; reject absent, ambiguous, or undeclared-legacy paths.
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs`: retain each fixture's absolute/relative source identity and pass extracted gold to the validator rather than returning unchecked strings. The current loader extracts `expected_resources` unchanged. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:295] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:321]
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs`: run fixture validation after loading and before `dispatchScenario`; a topology-invalid corpus must block scoring rather than produce a low recall row. The current loop dispatches immediately after loading. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:137] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:141]

Measured target: the 6 missing-leaf rows. This layer also prevents a stale fixture from masquerading as a model miss, but it does not by itself prevent over-bundling.

### 3. Priority 3 — cap bundles by selected maps, not an arbitrary global number

An arbitrary small numeric cap would break the legitimate 17-leaf full-inventory scenario. The enforceable rule is: at most two workflow modes, no resource outside the selected `RESOURCE_MAP` entries, and no inventory expansion unless the prompt explicitly selects the named full-inventory intent. Thus the cap is `sum(exact selected map entries)`, not “all discovered files.” This blocks the 65-resource dump while preserving intentional broad coverage. [SOURCE: .opencode/skills/sk-doc/hub-router.json:7] [SOURCE: .opencode/skills/sk-doc/hub-router.json:14] [SOURCE: .opencode/specs/sk-doc/031-sk-doc-router-alignment/010-sk-doc-routing-research/research/iterations/iteration-003.md:29]

Concrete changes:

- `.opencode/skills/sk-doc/hub-router.json`: add `bundlePolicy` with `maxWorkflowModes: 2`, `allowUnmappedLeafResources: false`, `resourceLimit: selectedMapUnion`, `overflow: defer`, and one explicit full-inventory exception bound to the authored full map.
- `.opencode/skills/sk-doc/create-skill/assets/parent_skill/parent_skill_hub_router_template.json` and `parent_hub_router_schema.md`: make `bundlePolicy` required for resource-bearing hubs and validate that every exception names a real intent/map.
- `.opencode/skills/sk-doc/shared/references/smart_routing.md`: encode exact per-intent leaf sets and the full-inventory exception; never use a discovered inventory as the return bundle.
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs`: enforce the selected-map union after `assembleResources` and emit overflow telemetry instead of silently returning extra leaves.
- The eleven packet `SKILL.md` files named in Priority 1: add “no inventory enumeration without explicit full-inventory intent” and return only the selected map union.

Measured target: all 5 over-bundle rows, including the one primary failure and the 4 threshold-pass rows with D3 efficiency loss. The 2 clean rows become regression fixtures: they should remain exact and zero-waste after caps, proving that the change is not a blanket suppression rule.

### 4. Priority 4 — make score provenance fail closed, then repair `SD-020` and `SD-016`

Gold cleanup must follow the namespace/manifest decision; doing it first would merely encode another guess. At the score join, persist exact normalized expected and observed arrays plus hashes of the fixture source, `hub-router.json`, `mode-registry.json`, `leaf-manifest.json`, and second-layer router. Report emission must refuse any scored row missing this block. The current runner aggregates and writes after scoring, while retained evidence can be only a truncated response head. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:210] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:215] [SOURCE: .opencode/specs/sk-doc/031-sk-doc-router-alignment/010-sk-doc-routing-research/research/iterations/iteration-003.md:100]

Concrete changes:

- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs`: add `routeProvenance` to every scored row with canonical expected/observed pairs and their hashes; retain full normalized arrays or a hash-addressed side artifact, not only `responseHead`.
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs`: compute source/config hashes before dispatch and fail report emission if any non-routed-out row lacks provenance.
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs`: carry the exact fixture source path and content hash into the score join.
- `.opencode/skills/sk-doc/manual_testing_playbook/agent_dispatch/markdown_agent_cli_opencode.md` (`SD-020`): keep canonical public gold `assets/changelog_template.md`, but make the manifest-resolved physical source explicit and let the new topology gate prove the alias. The current file's gold is public-root-relative while its expected-behavior section names the shared physical file. [SOURCE: .opencode/skills/sk-doc/manual_testing_playbook/agent_dispatch/markdown_agent_cli_opencode.md:9] [SOURCE: .opencode/skills/sk-doc/manual_testing_playbook/agent_dispatch/markdown_agent_cli_opencode.md:94]
- `.opencode/skills/sk-doc/manual_testing_playbook/intent_detection/optimization.md` (`SD-016`): normalize the first gold entry from `create-quality-control/references/optimization.md` to `references/optimization.md`; retain `assets/llmstxt_templates.md` and resolve it through the shared alias. Re-run only after provenance is active so the contradictory historical row becomes reconstructable. [SOURCE: .opencode/skills/sk-doc/manual_testing_playbook/intent_detection/optimization.md:7] [SOURCE: .opencode/skills/sk-doc/manual_testing_playbook/intent_detection/optimization.md:8]

Measured target: the two anomalous members of the 6 wrong-root symptom count and the reliability of every future class label. Provenance does not improve routing by itself; it prevents unverifiable scores from being accepted.

### 5. `command-metadata.json` should remain absent

Do not create `.opencode/skills/sk-doc/command-metadata.json` in this fix. It is optional, its command-bridge drift enforcement is explicitly pending, and `mode-registry.json` already records every mode's command and aliases. Adding it would create another projection to synchronize without addressing wrong roots, missing leaves, bundles, or provenance. If a future command-bridge requirement appears, generate it from `mode-registry.json` only after the guard ships. [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_skills_nested_packets.md:212] [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_skills_nested_packets.md:217] [SOURCE: .opencode/skills/sk-doc/mode-registry.json:25]

### Dependency and acceptance order

1. Land the typed path contract and packet return wording.
2. Land the authored second-layer router, generated manifest, recursive guard, and fixture topology gate.
3. Land selected-map bundle enforcement.
4. Land provenance capture/fail-closed reporting, then clean the two gold cases.
5. Run the parent-hub validator, router-mode benchmark, and live benchmark. Acceptance is zero namespace violations, zero manifest/gold topology errors, no bundle outside selected maps, provenance on every scored row, unchanged exact results for the 2 clean rows, and separately reported deltas for the 6/6/5 failure classes.

Reversing steps 1 and 2 makes the manifest encode an undefined namespace. Cleaning gold before steps 1-2 can hide real topology drift. Using one catch-all canonicalizer would collapse distinct causes and make the benchmark less diagnostic.

## Questions Answered

- **Q5:** Answered. The implementable order is typed packet-local public IDs first; per-hub semantic router plus generated recursive manifest and fixture validation second; selected-map bundle caps third; fail-closed provenance and the two gold repairs fourth. `command-metadata.json` remains absent. Every mutation target and change shape is named above and tied to the 6 wrong-root / 6 missing-leaf / 5 over-bundle / 2 clean distribution.

## Questions Remaining

- None for Q5. The exact JSON property names are implementation-level choices, but the four path roles, conversion boundary, ownership split, and validation order are fixed by the evidence.

## Assessment

- New information ratio: **0.74**.
- Novelty justification: prior iterations established the causes; this iteration adds the canonical namespace decision, artifact ownership split, exact mutation map, dependency order, and acceptance gates.
- Status: **complete** for Q5.
- Confidence: high for the dependency order and target files; medium-high for the proposed schema field names, which are new API names and should be finalized during implementation without changing their semantics.

## SCOPE VIOLATIONS

- Every recommended mutation targets researched hub, template, validator, benchmark, or fixture files outside this iteration's write fence. They are recorded as findings only; none were executed.
- The workflow reducer owns strategy, registry, dashboard, and synthesis updates. This leaf iteration wrote only its narrative, canonical state append, and delta.

## Next Focus

Use iteration 7 to pressure-test `(workflowMode, leafResourceId)` against duplicate local filenames, shared aliases, N-to-1 packet multiplexing, and the existing sk-code second-layer router, then state migration compatibility tests without reopening the settled namespace choice.
