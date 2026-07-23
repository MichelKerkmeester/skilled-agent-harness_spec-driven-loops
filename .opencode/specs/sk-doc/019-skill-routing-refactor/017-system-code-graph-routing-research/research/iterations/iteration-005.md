# Iteration 5: Explicit Resource Map and Dependency-Ordered Rollout

## Focus
Design an implementation-ready target router that replaces prefix/stem expansion with exact paths while retaining the standalone topology, the two always-loaded defaults, score/tie behavior, deduplication, guarded loading, and package-index behavior. The iteration prompt's explicit focus overrides the reducer's stale `Next Focus`; the prior iteration already resolved singleton identity/root semantics, so this pass converts those decisions into a concrete map and rollout order.

## Findings
1. **Target contract and invariants.** The target should declare `WORKFLOW_MODE = "system-code-graph"`, keep one standalone packet (no `mode-registry.json`), and emit typed pairs only after the leaf contract is versioned to accept `references/`, `assets/`, `feature_catalog/`, and `manual_testing_playbook/`. Preserve: defaults load first; selected resources append in deterministic order; `seen` deduplicates; `_guard_in_skill` plus inventory membership fail closed; at most two intents within `ambiguity_delta = 1`; no-score requests return the existing disambiguation checklist; and package indexes never become typed leaves. [SOURCE: .opencode/skills/system-code-graph/SKILL.md:103-125] [SOURCE: .opencode/skills/system-code-graph/SKILL.md:177-232] [SOURCE: .opencode/skills/system-code-graph/SKILL.md:251-299] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:43-48] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:79-126] [INFERENCE: target identity/root behavior follows iterations 1-2 while preserving the live router's control-flow invariants]

2. **Explicit target `RESOURCE_MAP`.** The map below contains no directory prefixes, filename stems, globs, or package indexes. Generic requests resolve to canonical reference/feature leaves; exact benchmarkable requests resolve through scenario-specific keys to exactly one scenario leaf. Broad `FEATURES`/`PLAYBOOK` requests use `PACKAGE_INDEXES` for navigation, outside typed leaf output. This intentionally replaces broad sibling expansion with exact selection and makes every proposed route auditable. [SOURCE: .opencode/skills/system-code-graph/SKILL.md:79-98] [SOURCE: .opencode/skills/system-code-graph/SKILL.md:127-175] [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/017-system-code-graph-routing-research/research/iterations/iteration-001.md:19-39] [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/017-system-code-graph-routing-research/research/iterations/iteration-004.md:9-41] [INFERENCE: exact one-leaf scenario keys are the smallest map capable of satisfying the 23 proposed typed-gold rows]

   ```python
   WORKFLOW_MODE = "system-code-graph"

   DEFAULT_RESOURCES = [
       "references/runtime/tool_surface.md",
       "references/readiness/code_graph_readiness_check.md",
   ]

   # Navigation resources remain loadable but are not leafResourceIds.
   PACKAGE_INDEXES = {
       "FEATURES": "feature_catalog/feature_catalog.md",
       "PLAYBOOK": "manual_testing_playbook/manual_testing_playbook.md",
   }

   RESOURCE_MAP = {
       # Generic documentation routes (defaults may deduplicate these).
       "TOOL_SURFACE": ["references/runtime/tool_surface.md"],
       "READINESS": ["references/readiness/code_graph_readiness_check.md"],
       "READINESS_SCOPE": ["references/readiness/readiness_and_scope_fingerprint.md"],
       "QUERY": ["references/runtime/tool_surface.md"],
       "SCAN_VERIFY": ["references/readiness/readiness_and_scope_fingerprint.md"],
       "CHANGE_DETECTION": ["feature_catalog/detect_changes/detect_changes_preflight.md"],
       "CONFIG": ["references/config/database_path_policy.md"],
       "NAMING": ["references/runtime/naming_conventions.md"],
       "OWNERSHIP": ["references/runtime/ownership_boundary.md"],
       "LAUNCHER": ["references/runtime/launcher_lease.md"],
       "CODE_INDEX_CLI": ["feature_catalog/mcp_tool_surface/code_index_cli.md"],
       "TOOL_REGISTRATIONS": ["feature_catalog/mcp_tool_surface/tool_registrations.md"],
       "QUERY_SELF_HEAL": ["feature_catalog/read_path_freshness/query_self_heal.md"],
       "CODE_GRAPH_CONTEXT": ["feature_catalog/context_retrieval/code_graph_context.md"],

       # Positive typed-gold scenario routes (23 exact leaves).
       "ENSURE_READY_SELECTIVE_REINDEX": ["manual_testing_playbook/read_path_freshness/ensure_ready_selective_reindex.md"],
       "QUERY_SELF_HEAL_STALE_FILE": ["manual_testing_playbook/read_path_freshness/query_self_heal_stale_file.md"],
       "SCAN_INCREMENTAL": ["manual_testing_playbook/manual_scan_verify_status/code_graph_scan_incremental.md"],
       "SCAN_FULL": ["manual_testing_playbook/manual_scan_verify_status/code_graph_scan_full.md"],
       "VERIFY_BLOCKED_ON_STALE": ["manual_testing_playbook/manual_scan_verify_status/code_graph_verify_blocked_on_stale.md"],
       "STATUS_READONLY": ["manual_testing_playbook/manual_scan_verify_status/code_graph_status_readonly.md"],
       "DETECT_CHANGES_NO_INLINE_INDEX": ["manual_testing_playbook/detect_changes/detect_changes_no_inline_index.md"],
       "CONTEXT_READINESS_BLOCK": ["manual_testing_playbook/context_retrieval/code_graph_context_readiness_block.md"],
       "DEEP_LOOP_GRAPH_CONVERGENCE": ["manual_testing_playbook/coverage_graph/deep_loop_graph_convergence_yaml_fire.md"],
       "DEEP_LOOP_GRAPH_UPSERT": ["manual_testing_playbook/coverage_graph/deep_loop_graph_upsert_conditional.md"],
       "TOOL_CALL_SHAPE_VALIDATION": ["manual_testing_playbook/mcp_tool_surface/tool_call_shape_validation.md"],
       "DOCTOR_APPLY_MODE_POLICY": ["manual_testing_playbook/doctor_code_graph/doctor_apply_mode_policy.md"],
       "MCP_MANIFEST_POST_RENAME": ["manual_testing_playbook/mcp_tool_surface/mcp_tool_manifest_post_rename.md"],
       "LAUNCHER_STARTUP_PREFIX": ["manual_testing_playbook/post_rename_infrastructure/launcher_startup_prefix.md"],
       "MCP_SERVER_KEY_RENAME": ["manual_testing_playbook/post_rename_infrastructure/mcp_json_server_key_rename.md"],
       "DATABASE_PATH_VERIFICATION": ["manual_testing_playbook/post_rename_infrastructure/database_path_verification.md"],
       "TYPESCRIPT_ENTRY_POINT": ["manual_testing_playbook/post_rename_infrastructure/typescript_build_and_entry_point.md"],
       "UNICODE_DIST_CLEANUP": ["manual_testing_playbook/post_rename_infrastructure/unicode_normalization_fix_from_009.md"],
       "CLI_FALLBACK_SURFACE": ["manual_testing_playbook/mcp_tool_surface/code_index_cli_fallback_surface.md"],
       "QUERY_ASOF_TIME_TRAVEL": ["manual_testing_playbook/mcp_tool_surface/code_graph_query_asof_time_travel.md"],
       "QUERY_BM25_RESOLVER": ["manual_testing_playbook/mcp_tool_surface/code_graph_query_bm25_symbol_resolver.md"],
       "CONTEXT_EDGE_CONFIDENCE": ["manual_testing_playbook/context_retrieval/code_graph_context_edge_confidence_differentiation.md"],
       "CONTEXT_SEEDED_PPR": ["manual_testing_playbook/context_retrieval/code_graph_context_seeded_ppr_ranking.md"],
   }
   ```

3. **Selection algorithm and route proof.** `INTENT_SIGNALS` should retain the existing generic keys and add the exact keys above using distinctive phrases from each scenario prompt. Score all keys as today, but rank exact keys ahead of generic keys on equal score (`specificity: 2` versus `1`); if one exact key wins, load its exact list plus defaults and report `ambiguous: false`; otherwise retain the two-key ambiguity rule. Return `{workflowMode, intents, ambiguous, resources, leafResources}`, where `resources` preserves compatibility and `leafResources` is the deduplicated `makeTypedPair(WORKFLOW_MODE, path)` projection excluding `PACKAGE_INDEXES`. Startup validation must assert every map path exists, is Markdown, is packet-contained, is not either package index, and has no duplicate composite pair. [SOURCE: .opencode/skills/system-code-graph/SKILL.md:191-232] [SOURCE: .opencode/skills/system-code-graph/SKILL.md:251-299] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:114-183] [INFERENCE: specificity tie-breaking prevents generic category keywords from defeating an exact scenario route without changing low-information ambiguity behavior]

4. **Dependency-ordered implementation sequence.** The safe order is: **(0)** capture the authorized unmodified baseline before source changes; **(1)** version the shared leaf contract and its tests to permit the two native roots; **(2)** declare singleton `WORKFLOW_MODE` and generate/check the standalone leaf inventory; **(3)** replace `RESOURCE_DOMAINS` with `RESOURCE_MAP`, `PACKAGE_INDEXES`, startup validation, exact-key specificity, compatibility `resources`, and typed `leafResources`; **(4)** add router unit fixtures for defaults, missing paths, deduplication, exact winner, two-way ambiguity, package-index exclusion, and all 23 routes; **(5)** add `expected_workflow_mode`/`expected_leaf_resources` only to the 23 eligible scenarios; **(6)** run post-change benchmark and compare dimension-by-dimension against baseline, not aggregate-only; **(7)** promote only if exact-resource accuracy improves without regressions in fallback, existence guards, or legacy resource output. Each step consumes an artifact or API established by the previous step, so reordering typed gold before steps 1-4 would encode an oracle the router cannot yet satisfy. [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/017-system-code-graph-routing-research/research/iterations/iteration-002.md:7-9] [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/017-system-code-graph-routing-research/research/iterations/iteration-004.md:41-78] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:43-48] [INFERENCE: dependency order is derived from contract acceptance -> identity/inventory -> router emission -> fixtures/gold -> measurement]

5. **Typed-gold and promotion gate.** Keep `022`, `023`, `024`, and both plugin/hook scenarios outside positive typed gold unless separately authored user prompts are added; do not infer prompts from procedures or automatic events. Promotion requires 23/23 expected pairs to resolve to existing exact leaves, zero package-index pairs, zero duplicate composites, no missing-map notices, and separate before/after reporting for routing accuracy, resource efficiency, and fallback behavior. [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/017-system-code-graph-routing-research/research/iterations/iteration-004.md:34-41] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:167-183] [INFERENCE: these gates prevent target-gold coverage from concealing corpus gaps or broad-load regressions]

## Ruled Out
- Keeping `RESOURCE_DOMAINS` as a second active routing source: two authorities would permit prefix expansion to drift from typed gold.
- Emitting package indexes as typed leaves: they are navigation documents, not feature/scenario leaves.
- Adding typed gold before the root contract and exact router exist: this would benchmark an impossible current contract.

## Dead Ends
- Prefix or stem selectors as leaf identities remain blocked; exact paths are the only map values.
- Synthetic aliases and parent-hub conversion remain blocked; neither is needed by the target standalone contract.

## Edge Cases
- Ambiguous input: The reducer strategy's `Next Focus` is stale, but the explicit iteration prompt unambiguously selects router design and dependency order; the prompt was followed.
- Contradictory evidence: Current contract v1 rejects two roots intentionally discovered by the live router; the design resolves this only through a versioned contract change, not by claiming current compatibility.
- Missing dependencies: No authorized baseline report exists and benchmark execution is write-blocked for this iteration; baseline capture remains dependency step 0.
- Partial success: None; the design question is answered without executing or modifying implementation.

## Sources Consulted
- `.opencode/skills/system-code-graph/SKILL.md:45-314`
- `.opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:1-320`
- `.opencode/specs/sk-doc/019-sk-doc-router-alignment/017-system-code-graph-routing-research/research/iterations/iteration-001.md:9-95`
- `.opencode/specs/sk-doc/019-sk-doc-router-alignment/017-system-code-graph-routing-research/research/iterations/iteration-002.md:4-46`
- `.opencode/specs/sk-doc/019-sk-doc-router-alignment/017-system-code-graph-routing-research/research/iterations/iteration-004.md:4-78`

## Assessment
- New information ratio: 0.90 (3 fully new findings and 2 partially new findings out of 5, plus a 0.10 simplicity bonus for reducing the design to one explicit map and dependency chain).
- Questions addressed: Which exact routing optimizations close the diagnosed gaps? What explicit resource map and invariants should implementation use? What must change before typed gold and benchmark promotion?
- Questions answered: All three iteration-focus questions.

## Reflection
- What worked and why: Reusing the prior finite inventory and 23/5 partition, then checking the live control flow and typed-pair contract, separated stable behavior from the contract changes needed for exact routing.
- What did not work and why: A numeric benchmark remains unavailable because its report files are outside this iteration's three-artifact write scope; design therefore uses explicit acceptance gates rather than fabricated scores.
- What I would do differently: In an authorized implementation pass, capture the immutable baseline first and generate the full leaf inventory mechanically before editing the router.

## Recommended Next Focus
Validate the target map against an authorized generated four-root leaf manifest: prove every proposed path resolves, identify intentionally index-only/unrouted feature leaves, and turn the dependency sequence into file-level implementation tasks without changing sources during research.
