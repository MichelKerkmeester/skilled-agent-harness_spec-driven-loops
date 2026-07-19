---
title: "Feature Specification: mcp-code-mode manual-testing playbook (020 component 011 phase 005)"
description: "The mcp-code-mode manual-testing tree uses snake_case for its root, eight category directories, the index, and 27 scenario files. This phase renames that filesystem tree to kebab-case and updates every active link and pointer while preserving scenario IDs, tool names, content keys, Python exemptions, and frozen changelog history."
trigger_phrases:
  - "mcp-code-mode manual-testing playbook"
  - "mcp-code-mode phase 005"
  - "manual playbook kebab-case"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/011-mcp-code-mode"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/011-mcp-code-mode/005-manual-testing-playbook"
    last_updated_at: "2026-07-14T16:30:00Z"
    last_updated_by: "codex"
    recent_action: "Authored manual-playbook docs"
    next_safe_action: "Freeze the manual-playbook tree map"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr_rules.md -->

# Feature Specification: mcp-code-mode manual-testing playbook

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/020-hyphen-naming-convention/008-component-migration/011-mcp-code-mode/005-manual-testing-playbook |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 005 of the 020 mcp-code-mode component migration |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The manual playbook is a live operator index and scenario corpus, but its root manual_testing_playbook, eight category directories, index file, and scenario filenames use underscores. The index and scenario evidence refer to one another by relative paths, so a partial rename would break discoverability and make the 27-scenario corpus incomplete.

This phase renames the complete manual-testing tree to kebab-case, rewrites active links and path pointers, and proves that the scenario set and scenario content remain unchanged apart from filesystem paths.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The root manual_testing_playbook → manual-testing-playbook and its index manual_testing_playbook.md → manual-testing-playbook.md.
- Category directories clickup_and_chrome_via_cm, core_tools, env_var_prefixing, manual_namespace_contract, multi_tool_workflows, plugins_and_hooks, recovery_and_config, and third_party_via_cm, each renamed to its hyphenated form.
- The 27 scenario files: chrome_navigate_screenshot.md, clickup_create_read_delete.md, sibling_pair_handover.md; call_tool_chain_execution.md, list_tools_enumeration.md, search_tools_relevance.md, tool_info_schema.md; prefixed_env_load.md, unprefixed_env_not_found.md, validate_config_script.md; correct_manual_tool_form.md, list_tools_dot_vs_underscore.md, wrong_form_error.md; promise_all_parallel.md, sequential_chain.md, try_catch_error_path.md; mcp_route_guard.md; deregister_reregister_cycle.md, disabled_server_omitted.md, invalid_config_error.md, missing_manual_entry.md, partial_chain_rollback.md, timeout_escalation.md; figma_file_metadata.md, github_list_user_repos.md, myservice_list_sites.md, and notion_search_workspace.md.
- Active links, index tables, scenario references, manual pointers, and path-valued documentation under the skill and its active consumers.

### Out of Scope
- Scenario IDs, prompts, tool names, JSON/YAML/TOML keys, frontmatter fields, Python files, Python package directories, and executable runtime filenames.
- Frozen changelog history, generated metadata content, other skills' manual-playbook trees, and migration execution during this authoring pass.
- References/assets and package/scripts closures owned by phases 001 through 004, except for consuming their final paths.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The root and all eight category directories use kebab-case | The map contains the root and eight exact directory source-to-target pairs, with no category omitted |
| REQ-002 | All 27 scenario filenames use kebab-case | Every listed scenario has one target path and the final tree still contains 27 scenario files across eight categories |
| REQ-003 | The playbook index follows the root and scenario renames | The root index, category tables, scenario links, and path references resolve under manual-testing-playbook |
| REQ-004 | Every active playbook pointer is updated | A link/path scan finds no stale active manual_testing_playbook, category, or scenario path |
| REQ-005 | Scenario semantics remain stable | Scenario IDs, objectives, prompts, expected signals, tool names, and evidence content are unchanged except for path strings |
| REQ-006 | The 020 exemption boundary is honored | Frozen changelogs, identifiers, keys, fields, Python names, and runtime names are not renamed by this phase |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The manual playbook root, eight category directories, index, and 27 scenarios are kebab-case and internally linked.
- **SC-002**: The playbook retains its 27-scenario inventory and no active consumer points at the old filesystem tree.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The root/index pair is especially sensitive because the index documents its own tree and several scenarios point to scripts,
runtime files, and the skill guide. This phase depends on the prior package, scripts, references/assets, and runtime path
states, plus a Markdown link resolver and scenario-count comparison; it must not rewrite frozen changelog history.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking; the pinned baseline inventory is authoritative for any scenario file added before execution.
<!-- /ANCHOR:questions -->
