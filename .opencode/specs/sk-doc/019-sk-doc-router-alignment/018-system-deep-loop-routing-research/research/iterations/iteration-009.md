# Iteration 9: Static Seven-Row Oracle Matrix Validation

## Focus

Validate `MR-001..003`, `IL-001..003`, and proposed `DA-R01` as one seven-mode typed-gold seed. The narrow test was whether the set is simultaneously mode-complete, loader-reachable, manifest-checkable, within the selected-map cap, and classifiable by the benchmark error taxonomy. No fixture, manifest, loader, router, source, spec, synthesis, or reducer-owned file was modified.

## Actions Taken

1. Reused iterations 7 and 8 for the six-row seed and proposed alignment contract instead of retrying loader-ineligible `DAL-*` inference.
2. Read all six existing route scenarios and the five child routers to map each prompt to its child-local candidate leaf set.
3. Traced both loader branches, manifest generation, topology validation, router replay, and typed scoring to test whether all seven rows can actually enter the typed lane.
4. Checked the hub and alignment playbook index shapes and confirmed that no hub `leaf-manifest.json` is currently committed.

## Findings

1. **The proposed set is statically mode-complete:** its expected modes are exactly the seven registry keys, one per row. Every row therefore declares one simultaneous mode, below the selected-map cap of two; leaf count does not affect that cap. [SOURCE: .opencode/skills/system-deep-loop/mode-registry.json:29-197] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/validate-playbook-topology.cjs:43-51,203-219]

2. **Static candidate matrix (typed leaf IDs stay child-local):**

   | Row | Expected mode | Candidate child-local typed leaves | Loader precondition | Manifest precondition | Cap | Current / post-gate taxonomy |
   |---|---|---|---|---|---:|---|
   | `MR-001` | `research` | `references/guides/quick_reference.md`; `references/protocol/loop_protocol.md`; `references/state/state_format.md`; `references/state/state_jsonl.md`; `references/protocol/spec_check_protocol.md`; `references/protocol/context_snapshot.md` | Repair the indexed hyphenated path, then supply independently authored typed gold through a loader-supported hub shape | All six under manifest mode `research` | 1/2 | Currently ungated legacy; malformed authored fields → `fixture_schema_error`; missing member → `fixture_topology_error`; valid oracle but missing observed pair → `routing_miss` |
   | `MR-002` | `review` | `references/protocol/quick_reference.md`; `references/protocol/loop_protocol.md`; `references/convergence/convergence.md`; `references/convergence/convergence_signals.md`; `references/state/state_format.md`; `references/state/state_outputs.md` | Same hub index repair and authored-gold requirement | All six under `review` | 1/2 | Same staged taxonomy |
   | `MR-003` | `ai-council` | `references/integration/quick_reference.md`; `references/integration/loop_protocol.md`; `references/patterns/seat_diversity_patterns.md`; `references/convergence/convergence_signals.md`; `references/structure/output_schema.md`; `assets/deep_ai_council_strategy.md`; `assets/prompt_pack_round.md` | Same hub index repair and authored-gold requirement | All seven under `ai-council` | 1/2 | Same staged taxonomy |
   | `IL-001` | `agent-improvement` | `references/shared/quick_reference.md`; `references/shared/loop_protocol.md`; `references/model_benchmark/benchmark_operator_guide.md`; `references/shared/runtime_truth_contracts.md`; `references/agent_improvement/candidate_proposal_format.md`; `references/shared/rollback_runbook.md`; `references/agent_improvement/mirror_drift_policy.md`; `references/shared/promotion_rules.md`; `references/agent_improvement/stress_test_protocol.md`; `references/shared/promotion_gate_contract.md` | Same hub index repair and authored-gold requirement | All ten under `agent-improvement` | 1/2 | Same staged taxonomy |
   | `IL-002` | `model-benchmark` | `references/shared/quick_reference.md`; `references/model_benchmark/benchmark_operator_guide.md`; `references/model_benchmark/evaluator_contract.md`; `references/model_benchmark/lane_b_mechanics.md`; `references/model_benchmark/mixed_executor_methodology.md`; `assets/model_benchmark/benchmark-fixtures/reviewer_schema.md` | Same hub index repair and authored-gold requirement | All six under `model-benchmark` | 1/2 | Same staged taxonomy; extra unresolved or cross-mode output → `routing_contract_error` |
   | `IL-003` | `skill-benchmark` | `references/shared/quick_reference.md`; `references/skill_benchmark/operator_guide.md`; `references/skill_benchmark/scoring_contract.md`; `references/skill_benchmark/scenario_authoring.md`; `references/skill_benchmark/routing_optimization.md`; `assets/skill_benchmark/fixtures/deep_loop_workflows/routing_precision.md` | Same hub index repair and authored-gold requirement | All six under `skill-benchmark` | 1/2 | Same staged taxonomy; extra unresolved or cross-mode output → `routing_contract_error` |
   | `DA-R01` | `alignment` | `references/scoping_protocol.md`; `references/lane_config_schema.md` | The proposed YAML row must be reached by the hub corpus loader rather than merely existing off-index | Both under `alignment` | 1/2 | Currently no normalized hub row; once reached, the same staged taxonomy applies |

   The six existing prompts author the expected modes but do **not** author reference gold; these leaves are therefore implementation candidates derived from deterministic router maps, not permission to silently rewrite the fixtures. [SOURCE: .opencode/skills/system-deep-loop/manual_testing_playbook/mode_routing/research_routing.md:15-36] [SOURCE: .opencode/skills/system-deep-loop/manual_testing_playbook/mode_routing/review_routing.md:15-36] [SOURCE: .opencode/skills/system-deep-loop/manual_testing_playbook/mode_routing/ai_council_routing.md:15-36] [SOURCE: .opencode/skills/system-deep-loop/manual_testing_playbook/improvement_lane_routing/agent_improvement.md:15-38] [SOURCE: .opencode/skills/system-deep-loop/manual_testing_playbook/improvement_lane_routing/model_benchmark.md:15-37] [SOURCE: .opencode/skills/system-deep-loop/manual_testing_playbook/improvement_lane_routing/skill_benchmark.md:15-37] [SOURCE: .opencode/skills/system-deep-loop/deep-research/SKILL.md:111-132,200-251] [SOURCE: .opencode/skills/system-deep-loop/deep-review/SKILL.md:103-168,195-260] [SOURCE: .opencode/skills/system-deep-loop/deep-ai-council/SKILL.md:143-168,232-283] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/SKILL.md:102-132,168-209] [SOURCE: .opencode/skills/system-deep-loop/deep-alignment/SKILL.md:90-133]

3. **The six indexed hub rows cannot currently derive typed gold even after path repair.** The hub's root index forces the sk-code loader branch. That branch only derives typed pairs from `expectedResources`, but the six files contain no `**Expected references loaded**` block. More importantly, `extractPaths()` preserves only `code-*`, `references/`, `assets/`, or `../shared/` prefixes, while derivation requires the string's leading segment to equal a manifest workflow mode. Thus neither `research/references/...` nor `deep-research/references/...` survives as a mode-qualified value, and plain `references/...` is interpreted as mode `references` and discarded. This is a loader-shape implementation blocker, not a router miss. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:168-191,258-315,427-475,497-519] [SOURCE: .opencode/skills/system-deep-loop/manual_testing_playbook/manual_testing_playbook.md:144-159,201-211]

4. **`DA-R01` is also not yet a normalized seventh hub row.** When a root index exists, the loader reads only indexed files through `parseFeatureFile()` and does not walk extra YAML-frontmatter fixtures. Adding the iteration-8 YAML file off-index would therefore be ignored; adding it to the hub index would parse it through the index branch, which does not consume its `expected_leaf_resources` frontmatter. The authored contract remains sound, but implementation must first choose and test one loader-supported corpus shape for it. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:258-315,343-417,486-524] [SOURCE: .opencode/specs/sk-doc/031-sk-doc-router-alignment/018-system-deep-loop-routing-research/research/iterations/iteration-008.md:16-39,87-93]

5. **The failure taxonomy is deterministic once a row reaches the typed gate and a hub manifest exists.** Schema defects are `fixture_schema_error`; unknown modes or absent leaves are `fixture_topology_error`; mode/join or greater-than-two simultaneous-mode defects are `fixture_selection_error`. A valid oracle is then scored: missing resource contracts, unresolved outputs, or observed mode-cap excess are `routing_contract_error`, while an otherwise valid contract missing expected pairs is `routing_miss`. Without a manifest or typed gold, the row remains ungated legacy and none of those classes proves success. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/validate-playbook-topology.cjs:14-25,43-55,168-239] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1093-1196,1202-1257,1287-1300]

## Ruled Out

- Calling the seven rows oracle-valid merely because they cover seven modes: loader reachability and authored typed gold are independent gates.
- Adding only `DA-R01` YAML frontmatter under the indexed hub playbook: the index branch ignores off-index files and does not parse typed frontmatter on indexed files.
- Encoding packet prefixes inside canonical `leaf_resource_id`: the canonical pair remains `{workflowMode, child-local leafResourceId}`.
- Treating the cap as a leaf-count limit: it is a simultaneous-workflow-mode cap of two.

## Dead Ends

- Further inspection of existing loader-ineligible `DAL-*` files cannot repair the hub loader-shape mismatch and was not retried.

## Edge Cases

- Ambiguous input: “oracle-valid” was separated into static semantic validity and executable loader/topology validity. The set passes the first and currently fails the second.
- Contradictory evidence: iteration 8's YAML-frontmatter contract is valid for the YAML loader branch, but the target hub currently selects the index branch; both claims are true under different loader shapes.
- Missing dependencies: a committed generated hub `leaf-manifest.json`, a loader-supported authored-gold representation for the six indexed rows, and a loader-reachable placement for `DA-R01`.
- Partial success: the mode/cap/taxonomy matrix is complete, but executable oracle validity remains blocked; status is `complete` because the iteration's question is answered negatively with the exact blocker.

## SCOPE VIOLATIONS

None. All researched source, config, spec, synthesis, and reducer-owned files remained read-only.

## Sources Consulted

- `.opencode/skills/system-deep-loop/manual_testing_playbook/{manual_testing_playbook.md,mode_routing/*.md,improvement_lane_routing/*.md}`
- `.opencode/skills/system-deep-loop/{deep-research,deep-review,deep-ai-council,deep-improvement,deep-alignment}/SKILL.md`
- `.opencode/skills/system-deep-loop/mode-registry.json:29-197`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:168-191,220-315,343-524`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:186-295`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1093-1300`
- `.opencode/skills/sk-doc/create-skill/scripts/validate-playbook-topology.cjs:1-239`
- `.opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:88-161`
- `.opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:114-274`
- `.opencode/specs/sk-doc/031-sk-doc-router-alignment/018-system-deep-loop-routing-research/research/iterations/iteration-007.md`
- `.opencode/specs/sk-doc/031-sk-doc-router-alignment/018-system-deep-loop-routing-research/research/iterations/iteration-008.md`

## Assessment

- New information ratio: 0.80
- Novelty calculation: 2 of 5 findings were fully new and 3 partially new (`(2 + 0.5×3) / 5 = 0.70`), plus a 0.10 simplicity bonus for reducing the remaining blocker to one loader/corpus-shape decision and one manifest gate.
- Questions addressed: Is the seven-row proposed seed mode-complete and oracle-valid as a set, and what preconditions or blockers remain?
- Questions answered: It is mode-complete and cap-valid statically, but not executable-oracle-valid until the hub loader can preserve/consume authored typed gold for indexed rows, `DA-R01` becomes loader-reachable, and the generated manifest verifies every pair.

## Reflection

- What worked and why: following each row through corpus discovery, gold parsing, manifest validation, replay, and scoring exposed a blocker that a mode-only table would miss.
- What did not work and why: router maps can propose candidate leaves but cannot independently authorize fixture gold; the six scenario contracts currently stop at mode-level intent.
- What I would do differently: implementation should add a loader regression test for all seven rows before authoring fixtures, so corpus-shape support is proven before gold content is committed.

## Questions Answered

- Is the seven-row seed mode-complete? **Yes, statically: exactly one row per registered mode.**
- Is it oracle-valid today? **No: typed gold is not loader-reachable for the six indexed rows, `DA-R01` is not a normalized hub row, and no hub manifest is committed.**
- What is the smallest blocker? **Choose and test one hub loader representation that preserves explicit workflow mode plus child-local leaf ID for both indexed rows and `DA-R01`, then generate and check the manifest.**

## Questions Remaining

- Governance-only: should any existing loader-ineligible file be promoted? No promotion is required by this seven-row plan.
- Implementation-only: which loader-compatible authoring shape will be adopted for the indexed hub corpus? Research establishes constraints but does not modify the loader.

## Next Focus

Iteration 10 should synthesize a deterministic resource map and final implementation handoff that orders: loader regression support, hub index repair, authored seven-row gold, manifest generation/check, topology gate, router replay, and same-corpus benchmark comparison.

## Recommended Next Focus

Produce the final dependency-ordered resource map and acceptance handoff, preserving this iteration's distinction between static mode completeness and executable oracle validity.
