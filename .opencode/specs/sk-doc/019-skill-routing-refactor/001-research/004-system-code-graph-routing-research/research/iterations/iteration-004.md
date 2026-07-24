# Iteration 4: Full playbook typed-gold eligibility partition

## Focus
Classify every one of the 28 `system-code-graph` manual-testing scenarios as either a genuine resource-routing decision eligible for target-state `(workflowMode, leafResourceId)` gold or non-routing behavior/command/integration coverage. The explicit iteration prompt takes precedence over the stale strategy `Next Focus`; it names this 28-file corpus and limits writes to this narrative, one state append, and one delta file. The target-state singleton mode remains `system-code-graph`; this iteration does not claim that the current router emits it.

## Findings
1. **Objective eligibility rule.** A scenario is eligible only when it supplies an exact, user-facing or operator-facing prompt that is a positive in-domain request, contains enough capability detail to select one scenario leaf rather than merely the playbook package, and can declare that exact leaf as typed gold. This follows the authoring contract: `stage: routing` is the positive in-domain tier, benchmark participants need an exact prompt plus expected resources, and typed scoring remains disengaged when `expected_leaf_resources` is absent. Auto-fired runtime events and files that contain only procedural steps are not routing decisions until an exact prompt is authored. [SOURCE: .opencode/skills/sk-doc/create-manual-testing-playbook/assets/manual_testing_playbook_snippet_template.md:158-161] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:120-139]

2. **Eligible partition: 23 scenarios.** Each item below has an explicit natural-language request/prompt whose capability terms distinguish its own leaf. The proposed typed pair for every row is `workflowMode: system-code-graph` plus the listed packet-relative `leafResourceId`. [INFERENCE: applying Finding 1 to the cited prompt in each scenario]
   1. `001` -> `manual_testing_playbook/read_path_freshness/ensure_ready_selective_reindex.md` — single-file readiness repair without an unrequested full scan. [SOURCE: .opencode/skills/system-code-graph/manual_testing_playbook/read_path_freshness/ensure_ready_selective_reindex.md:21-27]
   2. `002` -> `manual_testing_playbook/read_path_freshness/query_self_heal_stale_file.md` — single-file self-heal versus broad-stale refusal. [SOURCE: .opencode/skills/system-code-graph/manual_testing_playbook/read_path_freshness/query_self_heal_stale_file.md:21-27]
   3. `003` -> `manual_testing_playbook/manual_scan_verify_status/code_graph_scan_incremental.md` — incremental skip and deleted-file pruning. [SOURCE: .opencode/skills/system-code-graph/manual_testing_playbook/manual_scan_verify_status/code_graph_scan_incremental.md:21-27]
   4. `004` -> `manual_testing_playbook/manual_scan_verify_status/code_graph_scan_full.md` — explicit full scan and baseline persistence. [SOURCE: .opencode/skills/system-code-graph/manual_testing_playbook/manual_scan_verify_status/code_graph_scan_full.md:21-27]
   5. `005` -> `manual_testing_playbook/manual_scan_verify_status/code_graph_verify_blocked_on_stale.md` — stale verify block followed by post-scan verification. [SOURCE: .opencode/skills/system-code-graph/manual_testing_playbook/manual_scan_verify_status/code_graph_verify_blocked_on_stale.md:21-27]
   6. `006` -> `manual_testing_playbook/manual_scan_verify_status/code_graph_status_readonly.md` — diagnostic-only status around stale state. [SOURCE: .opencode/skills/system-code-graph/manual_testing_playbook/manual_scan_verify_status/code_graph_status_readonly.md:21-27]
   7. `007` -> `manual_testing_playbook/detect_changes/detect_changes_no_inline_index.md` — stale `detect_changes` refusal without inline repair. [SOURCE: .opencode/skills/system-code-graph/manual_testing_playbook/detect_changes/detect_changes_no_inline_index.md:21-27]
   8. `008` -> `manual_testing_playbook/context_retrieval/code_graph_context_readiness_block.md` — broad-stale context block with readiness metadata. [SOURCE: .opencode/skills/system-code-graph/manual_testing_playbook/context_retrieval/code_graph_context_readiness_block.md:21-27]
   9. `009` -> `manual_testing_playbook/coverage_graph/deep_loop_graph_convergence_yaml_fire.md` — graph convergence before deep-loop stop voting. [SOURCE: .opencode/skills/system-code-graph/manual_testing_playbook/coverage_graph/deep_loop_graph_convergence_yaml_fire.md:21-27]
   10. `010` -> `manual_testing_playbook/coverage_graph/deep_loop_graph_upsert_conditional.md` — conditional upsert when `graphEvents` exist. [SOURCE: .opencode/skills/system-code-graph/manual_testing_playbook/coverage_graph/deep_loop_graph_upsert_conditional.md:21-27]
   11. `011` -> `manual_testing_playbook/mcp_tool_surface/tool_call_shape_validation.md` — malformed tool-call schema validation. [SOURCE: .opencode/skills/system-code-graph/manual_testing_playbook/mcp_tool_surface/tool_call_shape_validation.md:21-27]
   12. `015` -> `manual_testing_playbook/doctor_code_graph/doctor_apply_mode_policy.md` — doctor route metadata versus diagnostic-only Phase A. [SOURCE: .opencode/skills/system-code-graph/manual_testing_playbook/doctor_code_graph/doctor_apply_mode_policy.md:21-27]
   13. `016` -> `manual_testing_playbook/mcp_tool_surface/mcp_tool_manifest_post_rename.md` — exact post-rename eight-tool manifest. [SOURCE: .opencode/skills/system-code-graph/manual_testing_playbook/mcp_tool_surface/mcp_tool_manifest_post_rename.md:21-27]
   14. `017` -> `manual_testing_playbook/post_rename_infrastructure/launcher_startup_prefix.md` — launcher prefix and idle-timeout guardrail. [SOURCE: .opencode/skills/system-code-graph/manual_testing_playbook/post_rename_infrastructure/launcher_startup_prefix.md:21-27]
   15. `018` -> `manual_testing_playbook/post_rename_infrastructure/mcp_json_server_key_rename.md` — `mk_code_index` server-key rename. [SOURCE: .opencode/skills/system-code-graph/manual_testing_playbook/post_rename_infrastructure/mcp_json_server_key_rename.md:21-27]
   16. `019` -> `manual_testing_playbook/post_rename_infrastructure/database_path_verification.md` — canonical SQLite path and legacy-path absence. [SOURCE: .opencode/skills/system-code-graph/manual_testing_playbook/post_rename_infrastructure/database_path_verification.md:21-27]
   17. `020` -> `manual_testing_playbook/post_rename_infrastructure/typescript_build_and_entry_point.md` — built entry point and schema-module loading. [SOURCE: .opencode/skills/system-code-graph/manual_testing_playbook/post_rename_infrastructure/typescript_build_and_entry_point.md:21-27]
   18. `021` -> `manual_testing_playbook/post_rename_infrastructure/unicode_normalization_fix_from_009.md` — root-level dist cleanup after build. [SOURCE: .opencode/skills/system-code-graph/manual_testing_playbook/post_rename_infrastructure/unicode_normalization_fix_from_009.md:21-27]
   19. `025` -> `manual_testing_playbook/mcp_tool_surface/code_index_cli_fallback_surface.md` — explicit CLI fallback prompt covering count, exit taxonomy, and blocked reads. [SOURCE: .opencode/skills/system-code-graph/manual_testing_playbook/mcp_tool_surface/code_index_cli_fallback_surface.md:15-22]
   20. `026` -> `manual_testing_playbook/mcp_tool_surface/code_graph_query_asof_time_travel.md` — `asOf` behavior under the bitemporal flag. [SOURCE: .opencode/skills/system-code-graph/manual_testing_playbook/mcp_tool_surface/code_graph_query_asof_time_travel.md:20-27]
   21. `027` -> `manual_testing_playbook/mcp_tool_surface/code_graph_query_bm25_symbol_resolver.md` — BM25 fallback-only disambiguation. [SOURCE: .opencode/skills/system-code-graph/manual_testing_playbook/mcp_tool_surface/code_graph_query_bm25_symbol_resolver.md:20-27]
   22. `028` -> `manual_testing_playbook/context_retrieval/code_graph_context_edge_confidence_differentiation.md` — flag-gated CALLS confidence differentiation. [SOURCE: .opencode/skills/system-code-graph/manual_testing_playbook/context_retrieval/code_graph_context_edge_confidence_differentiation.md:20-27]
   23. `029` -> `manual_testing_playbook/context_retrieval/code_graph_context_seeded_ppr_ranking.md` — default-off seeded-PPR behavior and CUT verdict. [SOURCE: .opencode/skills/system-code-graph/manual_testing_playbook/context_retrieval/code_graph_context_seeded_ppr_ranking.md:20-27]

3. **Non-routing partition: 5 scenarios.** These files should not receive typed gold in their current form. `022`, `023`, and `024` are valuable direct behavior suites but contain preconditions and executable step lists rather than an exact benchmark prompt; synthesizing a prompt from their titles would violate the exact-prompt authoring rule. The two plugin/hook scenarios explicitly describe automatic runtime triggers, not a user resource-selection decision. [SOURCE: .opencode/skills/sk-doc/create-manual-testing-playbook/assets/manual_testing_playbook_snippet_template.md:158-161]
   1. `022` — `manual_testing_playbook/mcp_tool_surface/code_graph_query_blast_radius.md`: direct multi-subject/transitive tool procedure, no exact prompt contract. [SOURCE: .opencode/skills/system-code-graph/manual_testing_playbook/mcp_tool_surface/code_graph_query_blast_radius.md:12-23] [SOURCE: .opencode/skills/system-code-graph/manual_testing_playbook/mcp_tool_surface/code_graph_query_blast_radius.md:33-79]
   2. `023` — `manual_testing_playbook/doctor_code_graph/code_graph_apply_sub_operations.md`: five direct apply-operation procedures, no exact prompt contract. [SOURCE: .opencode/skills/system-code-graph/manual_testing_playbook/doctor_code_graph/code_graph_apply_sub_operations.md:12-23] [SOURCE: .opencode/skills/system-code-graph/manual_testing_playbook/doctor_code_graph/code_graph_apply_sub_operations.md:32-69]
   3. `024` — `manual_testing_playbook/detect_changes/detect_changes_multi_file_diff.md`: hand-constructed diff/tool-call procedure, no exact prompt contract. [SOURCE: .opencode/skills/system-code-graph/manual_testing_playbook/detect_changes/detect_changes_multi_file_diff.md:12-23] [SOURCE: .opencode/skills/system-code-graph/manual_testing_playbook/detect_changes/detect_changes_multi_file_diff.md:40-67]
   4. `code-graph-freshness-guard` — `manual_testing_playbook/plugins_and_hooks/code_graph_freshness_guard.md`: explicitly has no user command and fires after mutating tool calls. [SOURCE: .opencode/skills/system-code-graph/manual_testing_playbook/plugins_and_hooks/code_graph_freshness_guard.md:36-51]
   5. `code-graph-plugin` — `manual_testing_playbook/plugins_and_hooks/code_graph_plugin.md`: automatic chat/session hook activity (plus a direct diagnostic tool), so the scenario as a whole is integration coverage rather than one stable resource-selection prompt. [SOURCE: .opencode/skills/system-code-graph/manual_testing_playbook/plugins_and_hooks/code_graph_plugin.md:38-53]

4. **The partition is target-gold design, not proof of current exact routing.** The current router selects at most two broad intent domains and expands every matching support prefix, so prompts in the same category can load several sibling scenarios; it returns `intents`, `ambiguous`, and `resources`, not a typed pair. Before the 23 eligible rows can be benchmark gold, the target router needs an enumerated leaf map and each row needs committed benchmark frontmatter. [SOURCE: .opencode/skills/system-code-graph/SKILL.md:113-175] [SOURCE: .opencode/skills/system-code-graph/SKILL.md:251-299] [INFERENCE: exact leaf gold would otherwise measure a contract the current prefix-expansion router cannot express]

## Ruled Out
- Marking all 28 files eligible merely because all are packet-local resources: five lack a user routing decision or exact prompt.
- Inventing exact prompts for `022`, `023`, and `024`: prompt authoring is a source change outside this iteration and would conceal the current corpus gap.
- Giving the two auto-fired plugin/hook scenarios positive typed gold based only on their trigger phrases: those phrases are retrieval metadata, not an executor prompt.

## Dead Ends
- Treating automatic runtime events as positive typed routing scenarios is a category error; retain them as integration/manual coverage unless separate user-request scenarios are authored.
- Inferring benchmark prompts from procedural headings is not auditable and should remain blocked.

## Edge Cases
- Ambiguous input: none; the iteration prompt explicitly defines the corpus and classification target.
- Contradictory evidence: none; direct behavior coverage and routing eligibility are separate dimensions.
- Missing dependencies: none. Five corpus rows lack exact prompts by authored design/content; that absence is the classification evidence, not a failed dependency.
- Partial success: none. All 28 scenario files were inspected and partitioned.
- Scope precedence: `progressiveSynthesis` is true in config, but the iteration dispatch explicitly permits only three writes; `research.md` was therefore left untouched.

## Sources Consulted
- `.opencode/skills/system-code-graph/manual_testing_playbook/manual_testing_playbook.md:18-153`
- All 28 non-index Markdown files under `.opencode/skills/system-code-graph/manual_testing_playbook/`, with prompt/contract anchors cited item-by-item above.
- `.opencode/skills/system-code-graph/SKILL.md:57-299`
- `.opencode/skills/sk-doc/create-manual-testing-playbook/assets/manual_testing_playbook_snippet_template.md:154-161`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:120-139`

## Assessment
- New information ratio: 1.00
- Novelty calculation: 4 of 4 findings are fully new; no simplicity bonus was needed.
- Questions addressed: Which of the 28 playbook scenarios are genuine routing decisions eligible for typed gold? Which scenarios are non-routing behavior coverage, and why?
- Questions answered: Which of the 28 playbook scenarios are genuine routing decisions eligible for typed gold?

## Reflection
- What worked and why: Reading the exact scenario contracts/prompts, then applying the benchmark authoring and parser contracts, separated resource existence from a real routing decision.
- What did not work and why: Category names alone were insufficient; post-rename and coverage-graph scenarios look like integration coverage but many still contain precise user prompts suitable for leaf selection.
- What I would do differently: In a write-authorized implementation phase, normalize the three procedural scenarios to the current benchmark-frontmatter/prompt template before generating typed gold.

## Recommended Next Focus
Derive the dependency-ordered optimization plan: version the legal leaf-root contract, declare the singleton mode, enumerate the 23 eligible prompt-to-leaf rows, add exact prompts (or deliberately retain non-routing status) for `022`/`023`/`024`, keep background plugin scenarios outside positive gold, then replace broad prefix expansion with exact leaf selection plus measured fallback behavior.
