# Iteration 1: Current Router and Concrete Resource Inventory

## Focus

Map the current `system-code-graph` routing pseudocode and expand its directory-prefix and filename-stem selectors into the concrete Markdown resources present on disk. The narrow interpretation is current-state diagnosis only: benchmark design and scenario typed-gold selection are deferred.

## Actions Taken

1. Read the skill router, including `INTENT_SIGNALS`, `RESOURCE_DOMAINS`, discovery, scoring, defaults, selection, and return shape.
2. Enumerated Markdown under all four discovery roots: `references/`, `assets/`, `feature_catalog/`, and `manual_testing_playbook/`.
3. Read the feature-catalog and playbook indexes to distinguish index files from 18 feature leaves and 28 scenario leaves.
4. Checked for a packet `mode-registry.json`; none exists.
5. Compared the discovered paths with the sk-doc typed-pair containment contract.

## Findings

1. **The current router does not emit `(workflowMode, leafResourceId)` pairs.** It scores 11 intent labels, selects at most two within one point of the top score, loads defaults plus matching resources, and returns `intents`, `ambiguous`, and `resources`. No `workflowMode` field or singleton mode identifier is declared, and no `mode-registry.json` exists. A typed lift therefore needs an authored constant mode identity; inventing its value during research would not describe current behavior. [SOURCE: .opencode/skills/system-code-graph/SKILL.md:113] [SOURCE: .opencode/skills/system-code-graph/SKILL.md:251] [SOURCE: .opencode/skills/system-code-graph/SKILL.md:272] [SOURCE: .opencode/skills/system-code-graph/SKILL.md:295]

2. **The discovered inventory is finite and currently contains 55 Markdown paths: 7 references, 0 assets, 19 feature-catalog files, and 29 playbook files.** The latter two counts each include one package index, leaving the documented 18 feature leaves and 28 scenario leaves. This makes every current prefix/stem selector mechanically enumerable against today's tree. [SOURCE: .opencode/skills/system-code-graph/SKILL.md:103] [SOURCE: .opencode/skills/system-code-graph/SKILL.md:184] [SOURCE: .opencode/skills/system-code-graph/feature_catalog/feature_catalog.md:23] [SOURCE: .opencode/skills/system-code-graph/manual_testing_playbook/manual_testing_playbook.md:20]

3. **The present selectors expand to the following discrete resource sets; multi-intent routing returns the deduplicated union plus the two defaults.** The defaults resolve to `references/runtime/tool_surface.md` and `references/readiness/code_graph_readiness_check.md`. [SOURCE: .opencode/skills/system-code-graph/SKILL.md:110] [SOURCE: .opencode/skills/system-code-graph/SKILL.md:127] [SOURCE: .opencode/skills/system-code-graph/SKILL.md:227]

   | Intent | Explicit current resources selected by that domain, excluding already-loaded defaults |
   | --- | --- |
   | `TOOL_SURFACE` | `feature_catalog/mcp_tool_surface/code_index_cli.md`; `feature_catalog/mcp_tool_surface/tool_registrations.md`; `manual_testing_playbook/mcp_tool_surface/code_graph_query_asof_time_travel.md`; `code_graph_query_blast_radius.md`; `code_graph_query_bm25_symbol_resolver.md`; `code_index_cli_fallback_surface.md`; `mcp_tool_manifest_post_rename.md`; `tool_call_shape_validation.md` (all under that playbook directory) |
   | `READINESS` | `references/readiness/readiness_and_scope_fingerprint.md`; both `feature_catalog/read_path_freshness/*.md`; both `feature_catalog/manual_scan_verify_status/` readiness resources only via its explicit prefix (all 3 files); both `manual_testing_playbook/read_path_freshness/*.md`; all 4 `manual_testing_playbook/manual_scan_verify_status/*.md` |
   | `QUERY` | both `feature_catalog/read_path_freshness/*.md`; both `feature_catalog/context_retrieval/*.md`; both `manual_testing_playbook/read_path_freshness/*.md`; all 3 `manual_testing_playbook/context_retrieval/*.md`; all 6 `manual_testing_playbook/mcp_tool_surface/*.md` |
   | `SCAN_VERIFY` | `references/readiness/readiness_and_scope_fingerprint.md`; all 3 `feature_catalog/manual_scan_verify_status/*.md`; all 4 `manual_testing_playbook/manual_scan_verify_status/*.md` |
   | `CHANGE_DETECTION` | `feature_catalog/detect_changes/detect_changes_preflight.md`; both `manual_testing_playbook/detect_changes/*.md` |
   | `CONFIG` | `references/config/database_path_policy.md`; all 5 `manual_testing_playbook/post_rename_infrastructure/*.md` |
   | `NAMING` | `references/runtime/naming_conventions.md` |
   | `OWNERSHIP` | `references/runtime/ownership_boundary.md` |
   | `LAUNCHER` | `references/runtime/launcher_lease.md`; all 5 `manual_testing_playbook/post_rename_infrastructure/*.md` |
   | `FEATURES` | all 19 `feature_catalog/**/*.md`, including `feature_catalog/feature_catalog.md` |
   | `PLAYBOOK` | all 29 `manual_testing_playbook/**/*.md`, including `manual_testing_playbook/manual_testing_playbook.md` |

4. **Physical enumerability does not yet imply a valid sk-doc `leafResourceId` set.** The typed-pair contract accepts only packet-root-relative paths beginning `references/` or `assets/`; 48 of the 55 discovered Markdown paths live under `feature_catalog/` or `manual_testing_playbook/` and would fail with `OUT_OF_ROOT`. The generic standalone-skill router template likewise defines resource bases as only `references/` and `assets/`. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:43] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:71] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:94] [SOURCE: .opencode/skills/sk-doc/create-skill/assets/skill/skill_smart_router.md:160]

5. **Three inventory categories are currently unreachable through specific domain keys.** `feature_catalog/coverage_graph/`, `feature_catalog/doctor_code_graph/`, and `feature_catalog/edge_confidence_and_provenance/` are reachable only through broad `FEATURES`; `manual_testing_playbook/coverage_graph/`, `doctor_code_graph/`, and `plugins_and_hooks/` are reachable only through broad `PLAYBOOK`. This is routing under-specificity, not missing files. [SOURCE: .opencode/skills/system-code-graph/SKILL.md:127] [SOURCE: .opencode/skills/system-code-graph/SKILL.md:173] [SOURCE: .opencode/skills/system-code-graph/feature_catalog/feature_catalog.md:27] [SOURCE: .opencode/skills/system-code-graph/manual_testing_playbook/manual_testing_playbook.md:22]

## Ruled Out

- Treating a directory prefix or filename stem as a leaf identity: these are selectors that expand to zero or more files, not resolvable files themselves.
- Assigning an inferred `workflowMode` value: the current standalone skill declares no canonical mode identifier.
- Counting `feature_catalog.md` as a feature leaf or `manual_testing_playbook.md` as a scenario leaf: each is a package index.

## Dead Ends

None. The inventory is directly discoverable; the unresolved issue is a contract decision, not unavailable evidence.

## Edge Cases

- Ambiguous input: “map to pairs” could mean current emitted pairs or a proposed normalization. Current emitted behavior was analyzed; the proposed mode string is deferred because it is not authored anywhere.
- Contradictory evidence: none.
- Missing dependencies: focused memory context was unavailable at initialization, but direct source and inventory evidence were sufficient.
- Partial success: the physical set is fully enumerable, but whether non-`references|assets` paths should become legal leaf IDs remains unanswered.

## Questions Answered

- **Answered:** How does the current `INTENT_SIGNALS` plus `RESOURCE_DOMAINS` pseudocode map to `(workflowMode, leafResourceId)` pairs? It currently does not; it maps intent scores to untyped resource-path unions and lacks an authored workflow-mode coordinate.
- **Partially addressed, still open:** Can every prefix/stem resource target be enumerated into a discrete, resolvable leaf set? Every current target can be enumerated physically, but 48 paths are outside the present typed-leaf containment roots.

## Questions Remaining

1. What canonical singleton `workflowMode` should identify this standalone skill, and should the typed contract permit `feature_catalog/` and `manual_testing_playbook/` leaves or project them through aliases?
2. How should the first skill-benchmark baseline be established?
3. Which of the 28 playbook scenarios are genuine routing decisions eligible for typed gold?
4. Which dependency-ordered routing optimizations close the diagnosed gaps?

## Sources Consulted

- `.opencode/skills/system-code-graph/SKILL.md:57-300`
- `.opencode/skills/system-code-graph/feature_catalog/feature_catalog.md:21-38`
- `.opencode/skills/system-code-graph/manual_testing_playbook/manual_testing_playbook.md:18-32`
- `.opencode/skills/system-code-graph/manual_testing_playbook/manual_testing_playbook.md:66-153`
- `.opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:43-126`
- `.opencode/skills/sk-doc/create-skill/assets/skill/skill_smart_router.md:145-166`
- Scoped Markdown inventories under the four `RESOURCE_BASES` declared in `.opencode/skills/system-code-graph/SKILL.md:103-109`

## Assessment

- New information ratio: 1.00
- Novelty calculation: 5 fully new findings / 5 total findings = 1.00.
- Questions addressed: current pseudocode-to-pair mapping; physical enumerability of prefix/stem targets.
- Questions answered: current pseudocode-to-pair mapping.

## Reflection

- What worked and why: expanding the router's own discovery roots and selectors against the live tree exposed both the exact finite inventory and selector coverage gaps.
- What did not work and why: a direct typed-pair projection fails because the borrowed sk-doc contract excludes two resource roots that this skill intentionally routes.
- What I would do differently: next iteration should settle identifier semantics before evaluating benchmarks, so benchmark gold is not authored against a provisional namespace.

## Recommended Next Focus

Resolve the typed identity contract for this standalone skill: choose the canonical singleton `workflowMode`, then decide whether `feature_catalog/` and `manual_testing_playbook/` become valid leaf roots or receive authored aliases into the existing `references|assets` namespace. Use that decision to produce a complete explicit `RESOURCE_MAP` before baseline scoring.
