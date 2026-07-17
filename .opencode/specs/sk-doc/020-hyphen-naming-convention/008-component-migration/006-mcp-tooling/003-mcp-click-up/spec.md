---
title: "Feature Specification: mcp-click-up naming closure (032 phase 003)"
description: "The mcp-click-up component contains snake_case catalog roots, catalog category directories, manual-testing categories, index files, reference files, and hundreds of links between them. This phase renames the component-local filesystem paths to kebab-case and updates path-derived references while preserving ClickUp CLI identifiers, package manifests, and data keys."
trigger_phrases:
  - "mcp-click-up kebab-case"
  - "clickup catalog playbook rename"
  - "032 mcp tooling phase 003"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/006-mcp-tooling"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/006-mcp-tooling/003-mcp-click-up"
    last_updated_at: "2026-07-14T16:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored phase 003 from the ClickUp path census"
    next_safe_action: "Execute the ClickUp catalog/playbook rename and reference closure"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-tooling/mcp-click-up/SKILL.md"
      - ".opencode/skills/mcp-tooling/mcp-click-up/feature_catalog/"
      - ".opencode/skills/mcp-tooling/mcp-click-up/manual_testing_playbook/"
      - ".opencode/skills/mcp-tooling/mcp-click-up/references/"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: mcp-click-up Naming Closure

> Phase adjacency under the 006-mcp-tooling parent: predecessor 002-mcp-chrome-devtools; successor 004-mcp-figma.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/020-hyphen-naming-convention/008-component-migration/006-mcp-tooling/003-mcp-click-up |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 003 of the mcp-tooling component naming migration |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The ClickUp packet has 26 snake_case directories and 137 underscored filenames across feature_catalog, manual_testing_playbook, references, and index material. Its documents already use many hyphenated display labels but retain underscored hrefs, category values, and catalog root names, so an incomplete move would break the catalog-to-playbook graph and silently lose discoverability.

This phase moves the full component-local catalog and playbook closure to kebab-case, updates every path reference, and preserves the cupt command vocabulary, MCP tool names, package layout, and data identifiers.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- feature_catalog/ and its FEATURE_CATALOG.md index, including the cupt_attachments, cupt_authentication, cupt_global_flags, cupt_notes_comments, cupt_tag_management, cupt_task_completion, cupt_task_details, cupt_task_listing, cupt_time_tracking, cupt_workspace, mcp_high_priority, mcp_medium_priority, and mcp_low_priority directories.
- manual_testing_playbook/ and manual_testing_playbook.md, including cupt_advanced_listing, cupt_lifecycle, cupt_offline_and_cache, intra_routing_recall, mcp_advanced, mcp_bulk_and_structure, mcp_documents_goals, mcp_task_crud, recovery_and_failure, task_operations, and time_and_notes.
- Underscored feature, scenario, reference, and index files such as cupt_commands.md, install_guide.md, mcp_tools.md, add_comment.md, create_bulk_tasks.md, and manual_testing_playbook.md.
- Catalog/playbook links, index tables, path-derived frontmatter values, and component documentation references.

### Out of Scope
- SKILL.md, README.md, changelog history, requirements.txt, setup.sh, and package/server directory names that are already tool- or layout-mandated.
- The cupt CLI token, ClickUp operation names, MCP tool names, JSON/YAML/TOML keys, and frontmatter field names.
- The hub-level manual-testing-playbook tree, which belongs to phase 005, and the Chrome/Figma component trees.
- Python .py files and Python import-package directories; the component census found none.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/mcp-tooling/mcp-click-up/feature_catalog/ | Rename | Use feature-catalog/ and kebab-case categories/files |
| .opencode/skills/mcp-tooling/mcp-click-up/manual_testing_playbook/ | Rename | Use manual-testing-playbook/ and kebab-case categories/files |
| .opencode/skills/mcp-tooling/mcp-click-up/references/ | Rename | Rename cupt_commands.md, install_guide.md, and mcp_tools.md |
| .opencode/skills/mcp-tooling/mcp-click-up/{SKILL.md,README.md,examples/} | Modify | Repair component-local paths and path-derived values |
| .opencode/skills/mcp-tooling/mcp-click-up/mcp-servers/ | Preserve | Keep clickup-cli/clickup-mcp layout and package manifests exact |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Rename the complete ClickUp catalog closure | The two catalog roots, all 26 underscored directories, FEATURE_CATALOG.md, and all 137 underscored files have explicit semantic targets |
| REQ-002 | Repair catalog/playbook references | Every catalog link, playbook link, index table, reference link, and path-derived category value resolves after the move |
| REQ-003 | Preserve tool contracts and data semantics | SKILL.md, package manifests, cupt/MCP identifiers, JSON/YAML/TOML keys, and frontmatter field names remain unchanged |
| REQ-004 | Honor the 032 exemption boundary | No Python path, generated/lockfile output, changelog history, or tool-mandated name is renamed |
| REQ-005 | Prove catalog and playbook completeness | Catalog and manual scenario discovery each return non-zero counts matching the pre-rename inventory |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No in-scope snake_case filesystem name remains under mcp-click-up.
- **SC-002**: The feature catalog, manual playbook, references, examples, and indexes form one resolved link graph.
- **SC-003**: cupt/MCP routing and package layout remain behaviorally unchanged.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

This is the largest child closure in the subtree. The main risk is a partial category move that leaves catalog links pointing at old directories or changes a content identifier while repairing a path. Mitigation is a complete 26-directory/137-file map, a pre/post discovery-count comparison, and a diff review that separates path segments, frontmatter values, fields, and CLI/data identifiers.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. Component-local catalog and playbook trees are owned by this phase; only the hub-level playbook tree is deferred to phase 005.
<!-- /ANCHOR:questions -->
