# Iteration 6: Backlog validation against hub, benchmark, hook, plugin, and quality-standard evidence

## Focus
This iteration validated the iteration-005 backlog against sibling hub patterns, behavior-benchmark conventions, hook/plugin surfaces, and general code-quality standards. The selected interpretation follows the explicit dispatch focus over the reducer-owned stale `NEXT FOCUS`: keep or downgrade backlog items based on contradictions, missing high-leverage evidence, and current codebase contracts.

## Findings
1. The backlog's parent-layer routing and advisor work is supported, but only as a hub-level update. The canonical parent-hub pattern keeps one hub, one `modes[]` registry, required `hub-router.json`, and one graph identity; `sk-design` and `deep-loop-workflows` both state that hubs stay routing-only and packets own detailed mode logic. For `sk-code`, that means expanding parent router/metadata vocabulary is valid, while adding packet-local `graph-metadata.json` or copying sibling-only extension machinery remains ruled out. [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_skills_nested_packets.md:17] [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_skills_nested_packets.md:56] [SOURCE: .opencode/skills/sk-design/SKILL.md:41] [SOURCE: .opencode/skills/deep-loop-workflows/SKILL.md:37] [SOURCE: .opencode/skills/sk-code/mode-registry.json:10] [SOURCE: .opencode/skills/sk-code/hub-router.json:42]
2. The proposed `behavior-benchmark` scenarios for code-quality hook behavior should be downgraded or relocated. The shared behavior-benchmark framework is explicitly for active deep-loop workflow packages and measures a live executor model at a deep-loop command surface; `sk-code` has no scoped `behavior_benchmark` package, while its manual playbook already owns tooling/hook scenarios and explicitly flags the comment-hygiene hook branch as uncovered. The stronger backlog item is: add sk-code manual-playbook and/or automated hook regression coverage, not a deep-loop `behavior_benchmark` scenario. [SOURCE: .opencode/skills/deep-loop-workflows/shared/behavior-benchmark/framework.md:20] [SOURCE: .opencode/skills/deep-loop-workflows/shared/behavior-benchmark/framework.md:23] [SOURCE: .opencode/skills/deep-loop-workflows/shared/behavior-benchmark/framework.md:38] [SOURCE: .opencode/skills/sk-code/manual_testing_playbook/manual_testing_playbook.md:292] [SOURCE: .opencode/skills/sk-code/manual_testing_playbook/manual_testing_playbook.md:324] [INFERENCE: scoped Glob/Grep found no `behavior_benchmark` package under `.opencode/skills/sk-code`]
3. Hook documentation has a real contradiction that should be promoted above generic hook-scenario work. `code-quality` describes three comment-hygiene layers, and the hooks README says the pre-commit hook checks comment hygiene only, but the actual pre-commit hook also runs the agent mirror-sync gate for staged agent files. Any backlog item that treats `.opencode/hooks/pre-commit` as a single-purpose comment-hygiene surface is stale; update hook docs and the code-quality handoff wording to name both commit-time gates before expanding tests. [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:124] [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:131] [SOURCE: .opencode/hooks/README.md:21] [SOURCE: .opencode/hooks/README.md:70] [SOURCE: .opencode/hooks/pre-commit:36] [SOURCE: .opencode/hooks/pre-commit:40] [SOURCE: .opencode/hooks/pre-commit:52]
4. Plugin-surface work lacks enough current evidence for implementation. The root OpenCode config exposes MCP server entries and experimental config, while `.opencode/package.json` only declares an `@opencode-ai/plugin` dependency; scoped search did not find `.opencode/plugins/**/*.ts` or root `plugins` configuration. A `plugin surface` backlog item should therefore remain a discovery note unless it names a concrete plugin file, command, or runtime hook to test. [SOURCE: opencode.json:10] [SOURCE: opencode.json:47] [SOURCE: opencode.json:68] [SOURCE: opencode.json:87] [SOURCE: .opencode/package.json:3] [SOURCE: .opencode/package.json:4] [INFERENCE: scoped Glob found no `.opencode/plugins/**/*.ts`, and Grep found no root `plugins` key in `opencode.json`]
5. Route-proof fields are a valid deep-research benchmark convention, but they should not be generalized into the code-quality handoff unless a consumer exists. The deep-research route-proof scenario requires state JSONL to name `deep-research`, and the benchmark framework scores delegation correctness by route-proof fields matching the expected leaf agent. That supports this iteration's required JSONL route-proof fields and any deep-loop test fixture, but not an implementation change to `code-quality` unless deep-review or a scorer explicitly consumes those fields. [SOURCE: .opencode/skills/deep-loop-workflows/deep-research/behavior_benchmark/scenarios/RSB-007-delegation-route-proof.md:20] [SOURCE: .opencode/skills/deep-loop-workflows/deep-research/behavior_benchmark/scenarios/RSB-007-delegation-route-proof.md:28] [SOURCE: .opencode/skills/deep-loop-workflows/deep-research/behavior_benchmark/scenarios/RSB-007-delegation-route-proof.md:32] [SOURCE: .opencode/skills/deep-loop-workflows/shared/behavior-benchmark/framework.md:121] [SOURCE: .opencode/skills/deep-loop-workflows/shared/behavior-benchmark/framework.md:125]
6. The handoff schema remains high-leverage, but its acceptance criteria must require direct evidence rather than self-attested quality status. The universal standards make P0 blocking and P1 deferral explicit, require direct comment-hygiene execution with zero violations, and route formal review output to `code-review`; the CI workflow independently blocks comment-hygiene violations on PRs. The schema should therefore record commands/checker outputs, checklist paths, P0/P1/P2 decisions, accepted deferrals, and verification handoff, but should not include a field that lets `code-quality` claim done or replace verification/review. [SOURCE: .opencode/skills/sk-code/shared/references/universal/code_quality_standards.md:61] [SOURCE: .opencode/skills/sk-code/shared/references/universal/code_quality_standards.md:67] [SOURCE: .opencode/skills/sk-code/shared/references/universal/code_quality_standards.md:127] [SOURCE: .opencode/skills/sk-code/shared/references/universal/code_quality_standards.md:147] [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:187] [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:213] [SOURCE: .github/workflows/comment-hygiene.yml:14] [SOURCE: .github/workflows/comment-hygiene.yml:34]

## Ruled Out
- Adding packet-local advisor identity or `graph-metadata.json` for `code-quality`; sibling hub and parent-skill contracts preserve one graph identity at the hub. [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_skills_nested_packets.md:56] [SOURCE: .opencode/skills/sk-code/mode-registry.json:10]
- Adding code-quality hook scenarios to the deep-loop `behavior_benchmark` package; that framework measures deep-loop command-surface executor behavior, not sk-code hook/system behavior. [SOURCE: .opencode/skills/deep-loop-workflows/shared/behavior-benchmark/framework.md:20] [SOURCE: .opencode/skills/deep-loop-workflows/shared/behavior-benchmark/framework.md:38]
- Treating root plugin work as implementation-ready; no concrete `.opencode/plugins` source or `plugins` runtime config was found in the scoped search. [SOURCE: opencode.json:10] [SOURCE: .opencode/package.json:4] [INFERENCE: scoped plugin Glob/Grep results]

## Dead Ends
- `research/deltas/iter-006.jsonl` was not written. The leaf agent's allowed-write contract includes iteration markdown, one append-only state record, optional `idea_observed` events, progressive `research.md`, and packet-local ideas only; it does not include `research/deltas/*`. [SOURCE: .opencode/agents/deep-research.md:69] [SOURCE: .opencode/agents/deep-research.md:71]
- Another broad discovery pass is unlikely to improve the backlog. The remaining uncertainty is implementation scoping: which exact docs/tests should change first after the downgraded benchmark/plugin items are removed. [INFERENCE: based on iterations 1-6 covering baseline, spec-kit, advisor, deep-loop/hook/benchmark, backlog synthesis, and validation]

## Edge Cases
- Ambiguous input: The reducer-owned `NEXT FOCUS` still points at the original baseline, while the dispatch required iteration-006 backlog validation. I followed the explicit dispatch focus and treated strategy focus as stale reducer state.
- Contradictory evidence: Two contradictions were found and preserved: behavior-benchmark proposal vs the deep-loop-only behavior-benchmark framework; hooks README/comment-only framing vs actual pre-commit mirror-sync logic. Both are resolved by downgrading/relocating backlog items rather than forcing implementation.
- Missing dependencies: Optional delta writing is outside this leaf's allowed-write contract, so no `research/deltas/iter-006.jsonl` was created. Plugin-surface implementation evidence is missing; plugin work remains discovery-only.
- Partial success: Required iteration markdown, state append, and progressive synthesis are in scope. Optional delta artifact is intentionally omitted by contract.

## Sources Consulted
- `.opencode/skills/sk-doc/create-skill/references/parent_skill/parent_skills_nested_packets.md:17`
- `.opencode/skills/sk-design/SKILL.md:41`
- `.opencode/skills/deep-loop-workflows/SKILL.md:37`
- `.opencode/skills/sk-code/mode-registry.json:10`
- `.opencode/skills/sk-code/hub-router.json:42`
- `.opencode/skills/deep-loop-workflows/shared/behavior-benchmark/framework.md:20`
- `.opencode/skills/deep-loop-workflows/deep-research/behavior_benchmark/scenarios/RSB-007-delegation-route-proof.md:20`
- `.opencode/skills/sk-code/manual_testing_playbook/manual_testing_playbook.md:292`
- `.opencode/skills/sk-code/manual_testing_playbook/manual_testing_playbook.md:324`
- `.opencode/skills/sk-code/code-quality/SKILL.md:124`
- `.opencode/skills/sk-code/code-quality/SKILL.md:187`
- `.opencode/hooks/README.md:21`
- `.opencode/hooks/pre-commit:36`
- `.opencode/skills/sk-code/code-quality/scripts/hooks/claude-posttooluse.sh:107`
- `.opencode/skills/sk-code/code-quality/scripts/check-comment-hygiene.test.sh:39`
- `.opencode/skills/sk-code/shared/references/universal/code_quality_standards.md:61`
- `.opencode/skills/sk-code/shared/references/universal/code_style_guide.md:124`
- `.github/workflows/comment-hygiene.yml:14`
- `opencode.json:10`
- `.opencode/package.json:4`

## Assessment
- New information ratio: 0.80
- Questions addressed: validate iteration-005 backlog against sibling hub patterns, behavior-benchmark conventions, hook/plugin surfaces, route-proof conventions, and code-quality standards.
- Questions answered: Parent-layer routing, handoff schema, and hook coverage remain useful; deep-loop behavior-benchmark scenarios and plugin-surface implementation should be downgraded until scoped to the right owner/evidence.

## Reflection
- What worked and why: Comparing the backlog against sibling hub contracts and the normative behavior-benchmark framework exposed ownership mismatches that were not visible from the initial synthesis alone.
- What did not work and why: Treating `hook/plugin surfaces` as one bucket hid two different evidence states: hooks have concrete contradictory docs/code, while plugin work has only dependency/config hints and no implementation surface.
- What I would do differently: Split the implementation backlog into `keep`, `relocate`, and `defer` groups before writing tasks so behavior-benchmark and plugin work cannot slip in as over-scoped implementation items.

## Recommended Next Focus
Converge research and move to implementation planning with a trimmed backlog: keep shared README/navigation, handoff schema, parent router/advisor vocabulary, hook-doc alignment, and sk-code manual/automated hook coverage; relocate behavior-benchmark work to manual playbook or tests; defer plugin work until a concrete plugin surface is identified.
