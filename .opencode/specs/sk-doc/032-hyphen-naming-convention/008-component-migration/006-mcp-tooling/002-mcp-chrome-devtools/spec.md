---
title: "Feature Specification: mcp-chrome-devtools naming closure (032 phase 002)"
description: "The mcp-chrome-devtools component contains snake_case manual-testing categories, scenario filenames, reference filenames, and an uppercase underscored install guide. This phase renames those filesystem paths to semantic kebab-case and updates every component-local reference while preserving the SKILL.md contract and non-filesystem identifiers."
trigger_phrases:
  - "mcp-chrome-devtools kebab-case"
  - "chrome devtools playbook rename"
  - "032 mcp tooling phase 002"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/006-mcp-tooling"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/006-mcp-tooling/002-mcp-chrome-devtools"
    last_updated_at: "2026-07-14T16:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored phase 002 from the Chrome DevTools path census"
    next_safe_action: "Execute the Chrome DevTools rename and reference closure"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md"
      - ".opencode/skills/mcp-tooling/mcp-chrome-devtools/manual_testing_playbook/"
      - ".opencode/skills/mcp-tooling/mcp-chrome-devtools/references/"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: mcp-chrome-devtools Naming Closure

> Phase adjacency under the 006-mcp-tooling parent: predecessor 001-hub-root-and-shared; successor 003-mcp-click-up.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/032-hyphen-naming-convention/008-component-migration/006-mcp-tooling/002-mcp-chrome-devtools |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 002 of the mcp-tooling component naming migration |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The Chrome DevTools packet has snake_case in its manual-testing-playbook root, seven category directories, their scenario files, two reference files, and INSTALL_GUIDE.md. The Markdown already contains many human-facing hyphenated labels while links and path-derived category values still point at underscored filesystem names, so a filename-only sweep would leave broken navigation and stale metadata.

This phase produces a kebab-case Chrome DevTools filesystem surface and a complete reference closure without renaming SKILL.md, README.md, tool identifiers, scenario IDs, or any Python-exempt path.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- mcp-chrome-devtools/INSTALL_GUIDE.md, the component manual_testing_playbook/ directory and manual_testing_playbook.md index.
- The category directories cli_bdg_lifecycle, console_and_network, dom_and_screenshot, intra_routing_recall, mcp_parallel_instances, protocol_discovery, and recovery_and_failure.
- The scenario filenames under those categories, including chrome_devtools_1_navigate.md, dual_instance_parallel.md, and session_management.md-style references.
- references/cdp_patterns.md and references/session_management.md.
- Relative Markdown links, root-relative references, and path-derived frontmatter values.

### Out of Scope
- SKILL.md, README.md, changelog history, and other tool-mandated or frozen names.
- CLI identifiers such as bdg, CDP method names, scenario IDs, and prose/code identifiers.
- mcp-click-up, mcp-figma, and the hub-level manual-testing-playbook tree.
- Python .py files or Python package directories; the current component census found none.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/mcp-tooling/mcp-chrome-devtools/INSTALL_GUIDE.md | Rename | Use the lowercase kebab target install-guide.md |
| .opencode/skills/mcp-tooling/mcp-chrome-devtools/manual_testing_playbook/ | Rename | Use manual-testing-playbook/ and hyphenated category directories/files |
| .opencode/skills/mcp-tooling/mcp-chrome-devtools/references/cdp_patterns.md | Rename | Use cdp-patterns.md |
| .opencode/skills/mcp-tooling/mcp-chrome-devtools/references/session_management.md | Rename | Use session-management.md |
| .opencode/skills/mcp-tooling/mcp-chrome-devtools/{SKILL.md,README.md} | Modify | Repair links and path-derived values only |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Rename every in-scope Chrome filesystem name | The seven category directories, root playbook directory/index, all underscored scenario files, INSTALL_GUIDE.md, and the two reference files have explicit kebab targets in the map |
| REQ-002 | Update component-local references | Every Markdown link, path table, root-relative path, and path-derived category value resolves to the renamed resource |
| REQ-003 | Preserve non-filesystem contracts | SKILL.md remains exact; bdg/CDP/scenario identifiers and frontmatter fields are unchanged |
| REQ-004 | Honor the 032 exemption boundary | No Python file/package directory, changelog history, generated output, or tool-mandated name is renamed |
| REQ-005 | Prove component behavior is unchanged | The existing Chrome manual scenario inventory and parent-hub check pass with non-zero discovery |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No in-scope snake_case filesystem name remains under mcp-chrome-devtools.
- **SC-002**: All component links and category values resolve under kebab-case paths.
- **SC-003**: Chrome routing, scenario IDs, and tool contracts remain unchanged.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The main risk is stale links because the scenario index contains relative paths that are already displayed with hyphenated labels. The mitigation is a rename-map-driven link scan plus Markdown-link resolution. A second risk is changing the scenario identifier chrome_devtools_1 or the category frontmatter key instead of only its path-derived value; the diff review must separate filesystem paths, frontmatter values, fields, and identifiers.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. The target for INSTALL_GUIDE.md is the lowercase kebab filename install-guide.md; all other targets are resolved by the frozen semantic map.
<!-- /ANCHOR:questions -->
