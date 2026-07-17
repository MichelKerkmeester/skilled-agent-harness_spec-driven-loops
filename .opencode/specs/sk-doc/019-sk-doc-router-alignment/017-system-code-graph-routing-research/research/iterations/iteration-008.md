# Iteration 8: Final Evidence Reconciliation and Synthesis Readiness

## Route Proof
- Resolved route: `mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true`.
- Canonical agent definition loaded from `.opencode/agents/deep-research.md`; execution remained LEAF-only and dispatched no Task or sub-agent.
- State source: packet-local config, state JSONL, strategy, registry, iteration-8 prompt, and iterations 1-7, all read before reconciliation.
- Packet root: `.opencode/specs/sk-doc/019-sk-doc-router-alignment/017-system-code-graph-routing-research/research/`.
- Authorized writes: only this narrative, exactly one iteration-8 state-log append, and write-once `deltas/iter-008.jsonl`; `research.md`, source, spec, config, and reducer-owned files were excluded.

## Focus
Audit iterations 1-7 against the five-question charter and live router, typed-contract, manifest-generator, replay, and scorer contracts. Reconcile current behavior versus recommendations, validate all cardinalities and route-map coverage, close evidence-supported questions, and provide the exact synthesis/resource-map and dependency-ordered implementation handoff without performing synthesis or implementation.

## Findings
1. **All five charter requirements are answerable, but two reducer-owned question statuses are stale.** Q1 is answered as a two-state classification: the current router maps 11 scored intents to untyped path unions and emits no `(workflowMode, leafResourceId)` pair, while the proposed typed target supplies singleton mode plus exact leaves. Q2 has a finite physical set and a feasible target manifest. Q3 has a concrete immutable baseline procedure, although no numeric report exists. Q4 has a complete 23-routing/5-non-routing partition. Q5 has the A0-A9 acceptance matrix and dependency order. Strategy/registry still show Q1 and Q3 open despite iteration 1 explicitly answering Q1 and iteration 3 explicitly answering the baseline-procedure question; synthesis should close both while preserving the missing numeric report as an implementation dependency, not an unanswered research question. [SOURCE: spec.md:74-101] [SOURCE: research/iterations/iteration-001.md:58-68] [SOURCE: research/iterations/iteration-003.md:40-49] [SOURCE: research/iterations/iteration-004.md:66-78] [SOURCE: research/iterations/iteration-007.md:18-35] [SOURCE: research/deep-research-strategy.md:16-23] [SOURCE: research/findings-registry.json:70-92]

2. **The definitive current-state/target-state boundary removes the apparent contradictions.** Confirmed current behavior is: four discovery roots; 11 broad intent keys; prefix/stem expansion; two default support documents; at most two intents within score delta 1; and a return shape of only `intents`, `ambiguous`, and `resources`. Confirmed shared contract behavior is still version 1 with only `references/` and `assets/`; the generator still requires `mode-registry.json` and walks only those two roots; replay still derives typed pairs from undifferentiated raw `resources`. Therefore singleton `system-code-graph`, contract v2 with four legal roots, standalone generation, exact `RESOURCE_MAP`, four output channels, `FULL_INVENTORY`, and 23 typed-gold rows are recommendations, not present behavior. [SOURCE: .opencode/skills/system-code-graph/SKILL.md:103-175] [SOURCE: .opencode/skills/system-code-graph/SKILL.md:251-299] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:43-126] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:91-129] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:200-243] [INFERENCE: iterations 2 and 5-7 consistently label these items as target-state design, so synthesis must not convert them into current-behavior claims]

3. **All reported counts reconcile once their denominators are named; the proposed routing map is intentionally not full-inventory coverage.** The live tree has 55 Markdown files (`7/0/19/29` across references/assets/features/playbook). Excluding two package indexes yields the 53-pair target manifest (`7/0/18/28`). Iteration 5's map has 37 entries but 35 unique live leaves because two values are reused; it has zero dead values and leaves 18 authorized files unmapped: 13 feature leaves plus the five non-routing scenarios. The scenario partition is independently `23 + 5 = 28`. Synthesis must never describe 35 mapped leaves as the full 53-leaf inventory or 23 gold rows as all scenario files. [SOURCE: research/iterations/iteration-001.md:19-39] [SOURCE: research/iterations/iteration-004.md:9-41] [SOURCE: research/iterations/iteration-006.md:15-27] [INFERENCE: read-only live-tree set comparison confirmed physical `7/0/19/29`, authorized `7/0/18/28`, 37 map entries, 35 unique mapped leaves, zero dead values, and 18 authorized-unmapped leaves]

   The 18-path intentional-unmapped partition that resource-map/synthesis must preserve is:
   - Features (13): `feature_catalog/context_retrieval/context_handler.md`; all four `feature_catalog/coverage_graph/*.md`; `feature_catalog/doctor_code_graph/doctor_apply_mode.md`; all three `feature_catalog/edge_confidence_and_provenance/*.md`; all three `feature_catalog/manual_scan_verify_status/*.md`; `feature_catalog/read_path_freshness/ensure_code_graph_ready.md`.
   - Non-routing scenarios (5): `manual_testing_playbook/detect_changes/detect_changes_multi_file_diff.md`; `manual_testing_playbook/doctor_code_graph/code_graph_apply_sub_operations.md`; `manual_testing_playbook/mcp_tool_surface/code_graph_query_blast_radius.md`; `manual_testing_playbook/plugins_and_hooks/code_graph_freshness_guard.md`; `manual_testing_playbook/plugins_and_hooks/code_graph_plugin.md`. [SOURCE: research/iterations/iteration-006.md:20-23]

4. **Iteration 7's four-channel model supersedes iteration 5's simpler target return shape, but it requires an atomic replay change.** Iteration 5 proposed compatibility `resources` plus typed `leafResources`; iteration 6 proved that deriving typed pairs from all raw resources makes the two defaults reduce one-leaf D3 precision to `1/3` and makes package indexes unresolved. Iteration 7 resolves that design conflict by separating selected typed leaves, support defaults, navigation indexes, and compatibility load trace. The live replay currently accepts only `resources` and converts every ordinary item, so D3 `1/1` is a benchmark expectation contingent on router and replay adopting the selected-leaf channel together; it is not a current result. [SOURCE: research/iterations/iteration-005.md:69-73] [SOURCE: research/iterations/iteration-006.md:24-27] [SOURCE: research/iterations/iteration-007.md:13-31] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:217-243] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1215-1257] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1311-1356]

5. **The synthesis blueprint and implementation handoff are complete and dependency ordered.** The resource map must carry five evidence categories: (a) charter/state evidence — `spec.md`, config/state/strategy/registry, iterations 1-8; (b) current router/inventory — `.opencode/skills/system-code-graph/SKILL.md` and all Markdown under `references/`, `assets/`, `feature_catalog/`, and `manual_testing_playbook/`, explicitly marking the two indexes as navigation; (c) typed contract/generation — `leaf-resource-contract.cjs`, `generate-leaf-manifest.cjs`, and `validate-playbook-topology.cjs`; (d) benchmark pipeline — the deep skill-benchmark command YAML, loop host, runner, scenario loader, router replay, executor dispatch, scorer, and playbook benchmark template; and (e) target design — iterations 5-7's exact map, 53/35/18 partition, four channels, `FULL_INVENTORY`, and A0-A9 gates. [SOURCE: spec.md:95-110] [SOURCE: research/iterations/iteration-003.md:12-38] [SOURCE: research/iterations/iteration-005.md:6-73] [SOURCE: research/iterations/iteration-006.md:12-59] [SOURCE: research/iterations/iteration-007.md:13-35] [INFERENCE: these categories cover every load-bearing claim while separating packet evidence, current source, measurement machinery, and target recommendations]

   Exact handoff order:
   1. Capture A0 on an authorized clean tree and retain command, tree identity, loaded/scored counts, parse warnings, dimensional coverage, report digest, and rerun stability; do not invent a baseline number. [SOURCE: research/iterations/iteration-003.md:13-16] [SOURCE: research/iterations/iteration-007.md:20]
   2. Atomically version the leaf contract/readers and add standalone four-root, Markdown-only, index-excluding generation; commit/check the deterministic 53-pair manifest. [SOURCE: research/iterations/iteration-006.md:13-18] [SOURCE: research/iterations/iteration-007.md:21-23]
   3. Atomically activate the exact map and startup checks with specificity-aware selection, four separated channels, `FULL_INVENTORY`, compatibility output, and replay normalization; prove A3-A6 and A8 before gold. [SOURCE: research/iterations/iteration-007.md:23-28] [INFERENCE: producer and consumer must agree before fixtures describe the new contract]
   4. Add table-driven coverage and typed gold for exactly the 23 eligible prompts; retain the five excluded files as non-routing coverage unless separately authored prompts change their status. [SOURCE: research/iterations/iteration-004.md:9-41] [SOURCE: research/iterations/iteration-007.md:27]
   5. Run A9 and promote only with zero topology exclusions/errors, 23/23 typed recall, selected-pair D3 1.0, unchanged fallback/ambiguity behavior, and no compatibility regression; compare dimensions and error classes rather than aggregate alone. [SOURCE: research/iterations/iteration-007.md:29-35]

## Ruled Out
- Treating reducer-owned open flags for Q1/Q3 as stronger evidence than the cited iteration answers.
- Treating target-state `system-code-graph`, four-root contract, four channels, or A0-A9 as confirmed current behavior.
- Treating 35 unique map values as complete 53-leaf inventory coverage.
- Claiming a numeric baseline, post-change score, or D3 `1.0` before authorized execution.
- Reopening aliases, parent-hub conversion, package-index leaves, selector identities, or a second active `RESOURCE_DOMAINS` authority.

## Dead Ends
- Aggregate-only benchmark comparison remains invalid because the typed migration changes the oracle and applicable dimensions.
- Package indexes cannot serve simultaneously as navigation documents and typed leaves.
- A containment-only root change cannot produce standalone generation, exact routing, or replay correctness.

## Edge Cases
- Ambiguous input: “resource map” can mean the evidence/resource inventory emitted by deep research or the proposed router's `RESOURCE_MAP`; this audit distinguishes both and requires synthesis to preserve that distinction.
- Contradictory evidence: reducer Q1/Q3 status conflicts with iteration answers, and current source conflicts with target recommendations only if lifecycle labels are omitted. Both are reconciled above; reducer files remain untouched.
- Missing dependencies: no authorized baseline report, real four-root manifest, typed fixtures, or post-change report exists. These are implementation outputs and prevent numeric claims, but do not prevent answering the research questions.
- Partial success: none for the reconciliation audit; implementation and final synthesis remain workflow-owned follow-up actions.

## Sources Consulted
- `.opencode/agents/deep-research.md`
- `research/prompts/iteration-8.md`
- `research/deep-research-config.json`; `research/deep-research-state.jsonl`; `research/deep-research-strategy.md`; `research/findings-registry.json`
- `research/iterations/iteration-001.md` through `research/iterations/iteration-007.md`
- `spec.md:56-139`
- `.opencode/skills/system-code-graph/SKILL.md:57-306`
- `.opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:37-286`
- `.opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:70-169`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:200-299`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1160-1369`
- `.opencode/skills/system-deep-loop/deep-research/references/state/state_outputs.md:90-144`
- Read-only live-tree inventory/map set comparison recorded in this iteration's state `sourcesQueried`.

## Assessment
- New information ratio: 0.70.
- Novelty justification: 1 of 5 findings was fully new and 4 were partially new; `(1 + 0.5*4)/5 = 0.60`, plus a `0.10` simplicity bonus for closing two stale questions and reconciling the output-channel contradiction.
- Questions addressed: all five charter questions and all three iteration-8 terminal questions.
- Questions answered: all five charter research questions; current-versus-recommended claim boundary; required synthesis/resource-map and implementation-handoff content.
- Remaining uncertainty: only executable evidence — baseline/post-change reports and implemented contract/router behavior — not further identity, inventory, or dependency-order research.

## Reflection
- What worked and why: Crosswalking each charter requirement to prior evidence, then rereading only the live producer/consumer seams, exposed stale reducer status and separated recommendations from current behavior without broad rereads.
- What did not work and why: A numeric benchmark cannot be reconciled because no authorized report exists; any number would be fabricated.
- What I would do differently: Final synthesis should use a current-state/target-state table before the implementation plan so recommendations cannot be read as shipped behavior.

## Recommended Next Focus
The workflow should synthesize `research.md` and the resource map from iterations 1-8, close Q1/Q3 in reducer outputs, and hand the five-step dependency sequence to a sibling implementation packet. No ninth research iteration is needed unless implementation produces contradictory source or benchmark evidence.
