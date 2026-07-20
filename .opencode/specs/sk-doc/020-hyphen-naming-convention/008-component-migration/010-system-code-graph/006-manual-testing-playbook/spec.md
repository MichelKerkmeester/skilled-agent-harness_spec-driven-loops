---
title: "Feature Specification: system-code-graph manual testing playbook"
description: "Rename the system-code-graph manual-testing-playbook root, nine category directories, and 29 scenario/index files to kebab-case, then repair every playbook path reference while preserving scenario identity and test semantics."
trigger_phrases:
  - "system-code-graph manual testing playbook naming"
  - "code graph manual-playbook tree migration"
  - "manual_testing_playbook to manual-testing-playbook"
  - "code graph scenario link closure"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/010-system-code-graph"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/010-system-code-graph/006-manual-testing-playbook"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored manual-playbook migration contract"
    next_safe_action: "Execute manual-playbook tree rename on pinned BASE"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/manual_testing_playbook"
      - ".opencode/skills/system-code-graph/manual_testing_playbook/manual_testing_playbook.md"
      - ".opencode/skills/system-code-graph/feature_catalog"
      - ".opencode/skills/system-code-graph/SKILL.md"
      - ".opencode/skills/system-code-graph/README.md"
      - ".opencode/skills/system-code-graph/INSTALL_GUIDE.md"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The playbook contains 29 Markdown files including the root index under nine snake_case category directories."
      - "The root, category directories, and file basenames become kebab-case; scenario IDs, titles, steps, and expected results remain unchanged."
      - "Feature-catalog and sibling component phases own their physical trees; this phase repairs playbook pointers to their target paths."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

# Feature Specification: system-code-graph manual testing playbook
> Phase adjacency — predecessor `005-feature-catalog`; successor `007-changelog-verify`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/020-hyphen-naming-convention/008-component-migration/010-system-code-graph/006-manual-testing-playbook |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 006 of the system-code-graph component migration |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The code-graph manual playbook currently uses the snake_case manual_testing_playbook root, nine snake_case category
directories, and 29 Markdown files. The root index, scenario cross-links, feature-catalog references, SKILL/README
guidance, and post-rename procedures refer to those paths. A filesystem-only naming migration must not alter scenario
IDs, titles, steps, expected results, command examples, or the meaning of any manual verification.

### Purpose
Convert the complete 29-file manual-testing-playbook tree to kebab-case and update every live pointer so operators
can discover and execute the same scenarios at canonical paths.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rename manual_testing_playbook/ to manual-testing-playbook/ and manual_testing_playbook.md to
  manual-testing-playbook.md.
- Rename the nine category directories: context_retrieval, coverage_graph, detect_changes, doctor_code_graph,
  manual_scan_verify_status, mcp_tool_surface, plugins_and_hooks, post_rename_infrastructure, and
  read_path_freshness.
- Rename all 28 category scenario files:
  code_graph_context_edge_confidence_differentiation.md, code_graph_context_readiness_block.md,
  code_graph_context_seeded_ppr_ranking.md, deep_loop_graph_convergence_yaml_fire.md,
  deep_loop_graph_upsert_conditional.md, detect_changes_multi_file_diff.md, detect_changes_no_inline_index.md,
  code_graph_apply_sub_operations.md, doctor_apply_mode_policy.md, code_graph_scan_full.md,
  code_graph_scan_incremental.md, code_graph_status_readonly.md, code_graph_verify_blocked_on_stale.md,
  code_graph_query_asof_time_travel.md, code_graph_query_blast_radius.md, code_graph_query_bm25_symbol_resolver.md,
  code_index_cli_fallback_surface.md, mcp_tool_manifest_post_rename.md, tool_call_shape_validation.md,
  code_graph_freshness_guard.md, code_graph_plugin.md, database_path_verification.md, launcher_startup_prefix.md,
  mcp_json_server_key_rename.md, typescript_build_and_entry_point.md, unicode_normalization_fix_from_009.md,
  ensure_ready_selective_reindex.md, and query_self_heal.md.
- Update root/category/scenario links and path-valued references in the playbook, catalog, SKILL/README/INSTALL/
  ARCHITECTURE docs, references, tests, and other live system-code-graph consumers.
- Preserve the program's filesystem exemption boundary: Python scripts, Python package directories, and
  tool-mandated names are not renamed by this phase.

### Out of Scope
- Scenario IDs, frontmatter, titles, steps, expected results, commands, evidence requirements, or manual test
  semantics.
- Feature-catalog, references, runtime, scripts, mcp-server, and other sibling-owned filesystem names; only direct
  playbook path pointers to those sibling targets are repaired here.
- Adding scenarios, reorganizing categories, changing validation policy, or changing the naming program.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/system-code-graph/manual_testing_playbook/ | Rename | Root to manual-testing-playbook/ |
| .opencode/skills/system-code-graph/manual_testing_playbook/manual_testing_playbook.md | Rename | Root index to manual-testing-playbook.md |
| .opencode/skills/system-code-graph/manual_testing_playbook/{context_retrieval,coverage_graph,detect_changes,doctor_code_graph,manual_scan_verify_status,mcp_tool_surface,plugins_and_hooks,post_rename_infrastructure,read_path_freshness}/ | Rename | Nine category directories to kebab-case |
| .opencode/skills/system-code-graph/manual_testing_playbook/**/*.md | Rename | All 28 category scenario files to kebab-case |
| .opencode/skills/system-code-graph/{SKILL,README,INSTALL_GUIDE,ARCHITECTURE}.md | Modify | Repair playbook paths and examples |
| .opencode/skills/system-code-graph/feature_catalog/**/*.md | Modify | Repair catalog-to-playbook links where needed |
| .opencode/skills/system-code-graph/{references,mcp_server,tests,runtime}/**/* | Modify | Repair live playbook pointers without changing sibling-owned names |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The playbook inventory is complete | The 29-file tree, root index, and nine category directories each have exactly one kebab-case target in the frozen map. |
| REQ-002 | The playbook tree is canonical | manual-testing-playbook/ and all permitted descendants use kebab-case; no old live playbook path remains. |
| REQ-003 | Playbook links are repaired | Root navigation, scenario links, catalog links, top-level docs, references, tests, and path-valued consumers resolve at new paths. |
| REQ-004 | Scenario identity is preserved | Scenario IDs, frontmatter, titles, steps, expected results, commands, evidence rules, and scenario ordering remain unchanged except for path text. |
| REQ-005 | Cross-phase boundaries are respected | Python exemptions and tool-mandated names remain intact; sibling physical renames are not performed in this phase. |
| REQ-006 | Manual coverage remains stable | Scenario count, category membership, referenced feature IDs, and playbook-to-catalog/reference link counts match BASE after path normalization. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The complete 29-file playbook is present under one kebab-case root with nine kebab-case categories.
- **SC-002**: Playbook navigation and all cross-links resolve without changing scenario semantics or evidence requirements.
- **SC-003**: Manual coverage and scenario/category parity match BASE after path normalization.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Feature-catalog phase | Catalog-to-playbook links can point at planned but not yet present sibling targets | Use the frozen catalog map and verify final integrated links at the subtree gate. |
| Dependency | Post-rename infrastructure scenarios | Scenario documents may describe target paths that other phases own | Preserve scenario content and validate path references against the combined rename ledger. |
| Risk | Scenario content is changed during path replacement | Manual evidence becomes incomparable to BASE | Restrict edits to filesystem path contexts and compare IDs, frontmatter, and content hashes after normalization. |
| Risk | Directory names are mistaken for scenario identifiers | Operators lose discoverability or stable scenario references | Keep scenario IDs and category semantics as content contracts; change only filesystem segments. |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. The executor must use an explicit 29-file map and record every old-name disposition, including
cross-links whose target belongs to another system-code-graph phase.
<!-- /ANCHOR:questions -->

