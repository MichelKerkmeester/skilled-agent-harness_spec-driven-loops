# Iteration 14: Contract coverage for standalone skill creation

## Focus

Determine whether the static create/doctor handoff contract should include /create:skill as well as /create:skill-parent, while preserving the standalone route's distinct memory/indexing presentation.

The narrow interpretation is route coverage, not byte-identical output. The question is whether excluding the standalone route leaves a drift surface, and which assertions remain valid for its four operation branches.

## Actions Taken

- Read the iteration-013 state, strategy, and registry-owned context before selecting this focus; the packet has 13 prior iteration records and no existing iteration-014 or delta file.
- Compared the standalone router and presentation asset with the standalone auto workflow, focusing on completion fields, validation, context save, and indexing.
- Compared the parent completion contract and the existing static presentation-test pattern to separate reusable vocabulary from parent-only metadata.
- Ran the requested read-only Codex hook installer check. It refused to anchor from this linked worktree and identified the primary checkout; that result is relevant to source-selection context but does not change the standalone contract decision.

## Findings

1. **P1 — /create:skill is an independent contract surface and should be included in the contract-test matrix.** The router declares its presentation, auto workflow, and confirm workflow as separate owned assets, and the presentation's completion template explicitly reports both Memory saved and Memory indexed. The auto workflow independently defines context save and memory_index_scan outputs. If the test covers only /create:skill-parent, this standalone handoff can drift without detection. [SOURCE: .opencode/commands/create/skill.md:18-56; .opencode/commands/create/assets/create-skill-presentation.txt:129-150; .opencode/commands/create/assets/create-skill-auto.yaml:423-461]

2. **P1 — Standalone /create:skill does not have the parent-hub metadata contract.** Its workflow validates a leaf skill package, synchronizes SKILL.md routing, then saves and indexes context when a spec path exists. Its template sources are the leaf skill, reference, asset, smart-router, and README templates; it does not generate the parent-only mode-registry.json, hub-router.json, description.json, or hub graph-metadata.json set. A test that requires those fields on every create route would encode a false invariant. [SOURCE: .opencode/commands/create/assets/create-skill-auto.yaml:188-217,385-439]

3. **P1 — The common contract must be vocabulary-level, not a shared result schema.** The parent presentation reports hub identity counts, parent-skill-check, canonical hub structure, per-mode packet shape, and advisorRouting coverage, while standalone reports DQI, operation target, spec path, and memory/index status. The stable test boundary is therefore route identity, target, validation outcome, and the relevant context/index handoff; parent identity and advisor refresh fields remain parent/doctor assertions. [SOURCE: .opencode/commands/create/assets/create-skill-parent-presentation.txt:127-154; .opencode/commands/create/assets/create-skill-presentation.txt:129-150]

4. **P1 — Add /create:skill to the same static contract suite through route-specific requirement sets.** The repository's existing presentation contract test already uses explicit asset lists and checks required text, workflow coverage, allowed tools, and stale references without requiring identical prose. A proportionate extension would enumerate standalone presentation plus auto/confirm assets, parent presentation plus auto/confirm assets, and doctor handoff assets; then assert standalone memory/index fields and parent/doctor selected-repo, hub-identity, refresh, and validation fields separately. [SOURCE: .opencode/plugins/tests/speckit-goal-offer-contract.test.cjs:18-47,71-105; .opencode/commands/create/skill.md:20-24; .opencode/commands/create/skill-parent.md:27-33]

## Questions Answered

- **Should /create:skill be covered?** Yes. It is a separate public presentation/workflow surface with its own memory/indexing lifecycle.
- **Should it share the parent-hub assertions?** No. Cover both routes in one contract suite if useful, but parameterize the required fields by route and operation.

## Questions Remaining

- Whether the eventual test should include all four standalone operations or only the full-create/full-update branches; the presentation is unified, but reference-only and asset-only have different validation targets.
- Whether the doctor-side route should expose skill_graph_validate through route metadata or retain a CLI-only validation handoff.
- Whether description.json should remain descriptive metadata rather than a vocabulary-validated projection.

## Ruled Out

- Requiring mode-registry.json, hub-router.json, description.json, or graph-metadata.json in every /create:skill contract assertion.
- Treating /create:skill as covered indirectly by the parent-skill test.

## Dead Ends

- A single byte-identical formatter/test fixture is not supported by the current ownership model: create and parent-create have distinct presentation assets and distinct result shapes. The useful convergence point is a field vocabulary and command semantics.

## Edge Cases

- Ambiguous input: interpreted “cover /create:skill” as adding the standalone route to the static contract matrix, not forcing parent-hub metadata onto leaf skills.
- Contradictory evidence: none found in the local contracts.
- Missing dependencies: the memory trigger MCP call was cancelled; direct local source inspection was sufficient for this focused question. [INFERENCE: the cited command and workflow files are the authoritative local contracts for this route.]
- Partial success: the hook installer check was read-only but refused linked-worktree anchoring; it confirms the earlier source-selection caveat and was not needed to answer standalone coverage.

## Sources Consulted

- .opencode/commands/create/skill.md:18-56
- .opencode/commands/create/assets/create-skill-presentation.txt:129-150
- .opencode/commands/create/assets/create-skill-auto.yaml:188-217,385-461
- .opencode/commands/create/skill-parent.md:27-33
- .opencode/commands/create/assets/create-skill-parent-presentation.txt:127-154
- .opencode/plugins/tests/speckit-goal-offer-contract.test.cjs:18-47,71-105
- node .opencode/bin/install-codex-hooks.mjs --check

## Assessment

- New information ratio: 0.72
- Questions addressed: standalone contract coverage and route-specific assertion scope.
- Questions answered: one carried-forward focus question.
- Overall research remains open; this iteration narrows the test boundary but does not implement it.

## Reflection

- What worked and why: direct comparison of presentation and workflow assets exposed the exact lifecycle fields and avoided inferring parent metadata from the shared command name.
- What did not work and why: the memory trigger lookup was cancelled, and the hook installer cannot check a linked worktree without an explicit override; both were optional for this local evidence pass.
- What I would do differently: next pass should inspect existing create-command test harness conventions before recommending whether one new test file or an extension of mk-skill-advisor.test.cjs is the lower-drift placement.

## Recommended Next Focus

Trace the existing create-command test harness and determine the smallest route-aware fixture matrix that covers /create:skill standalone operations, /create:skill-parent hub creation, and /doctor:skill-advisor handoff semantics without duplicating workflow assertions.
