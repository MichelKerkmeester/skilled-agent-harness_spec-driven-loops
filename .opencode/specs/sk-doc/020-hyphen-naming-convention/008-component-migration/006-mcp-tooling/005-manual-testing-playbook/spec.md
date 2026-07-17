---
title: "Feature Specification: mcp-tooling hub manual-testing-playbook naming closure (032 phase 005)"
description: "The mcp-tooling hub-level manual-testing-playbook tree uses an underscored root, category directory, index file, and seven scenario filenames. This phase renames only that hub-level tree to kebab-case and updates its navigation references, leaving the three component-local playbooks to their own phases."
trigger_phrases:
  - "mcp-tooling manual-testing-playbook naming"
  - "hub routing playbook rename"
  - "032 mcp tooling phase 005"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/006-mcp-tooling"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/006-mcp-tooling/005-manual-testing-playbook"
    last_updated_at: "2026-07-14T16:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored phase 005 from the hub playbook path census"
    next_safe_action: "Execute the hub-level playbook rename and link closure"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-tooling/manual_testing_playbook/"
      - ".opencode/skills/mcp-tooling/SKILL.md"
      - ".opencode/skills/mcp-tooling/manual_testing_playbook/manual_testing_playbook.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: mcp-tooling Hub Manual-Testing-Playbook Naming Closure

> Phase adjacency under the 006-mcp-tooling parent: predecessor 004-mcp-figma; successor 006-benchmark.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/020-hyphen-naming-convention/008-component-migration/006-mcp-tooling/005-manual-testing-playbook |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 005 of the mcp-tooling component naming migration |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The hub-level manual-testing-playbook directory is named manual_testing_playbook, its category is hub_routing, its index is manual_testing_playbook.md, and its six scenario names use underscores. The hub SKILL.md and playbook index reference this tree, while component-local playbooks have separate ownership in phases 002-004.

This phase gives the hub-level routing playbook a complete kebab-case filesystem closure and updates its links without changing scenario semantics, frontmatter fields, or component-local paths.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- .opencode/skills/mcp-tooling/manual_testing_playbook/ to manual-testing-playbook/.
- hub_routing/ to hub-routing/.
- manual_testing_playbook.md to manual-testing-playbook.md.
- ambiguous_defer.md, chrome_devtools_browser_debug.md, clickup_task_management.md, figma_transport.md, holdout_browser_inspect.md, and holdout_design_tokens.md.
- Hub SKILL.md and playbook links that point at these paths.

### Out of Scope
- The component-local manual-testing-playbook trees under mcp-chrome-devtools, mcp-click-up, and mcp-figma.
- benchmark/, changelog history, SKILL.md itself, JSON/YAML/TOML keys, frontmatter field names, scenario IDs, and prose labels.
- Any code, tool behavior, Python path, generated output, or package manifest.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/mcp-tooling/manual_testing_playbook/ | Rename | Use manual-testing-playbook/ and hub-routing/ |
| .opencode/skills/mcp-tooling/manual_testing_playbook/manual_testing_playbook.md | Rename | Use manual-testing-playbook.md |
| .opencode/skills/mcp-tooling/manual_testing_playbook/hub_routing/*.md | Rename | Use kebab-case scenario filenames |
| .opencode/skills/mcp-tooling/SKILL.md | Modify | Update hub layout/navigation references only |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Rename the complete hub playbook tree | The 2 underscored directories and 7 underscored files have explicit kebab targets |
| REQ-002 | Repair hub navigation | SKILL.md, the playbook index, and every scenario link resolve under manual-testing-playbook/hub-routing |
| REQ-003 | Preserve scenario semantics | Scenario IDs, frontmatter fields, labels, and expected routing outcomes are unchanged |
| REQ-004 | Keep component ownership separate | No component-local playbook path is renamed or rewritten as part of this phase |
| REQ-005 | Prove playbook completeness | The hub playbook index discovers all seven scenario files after the move |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No in-scope snake_case filesystem name remains in the hub-level playbook tree.
- **SC-002**: All hub scenario links resolve and the scenario count remains seven.
- **SC-003**: Component-local playbook ownership and scenario semantics remain unchanged.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The primary risk is confusing the hub-level tree with the three component-local trees. The mitigation is a path-owner allowlist and a seven-file pre/post index count. A second risk is updating display labels but not hrefs; the checklist requires link resolution from both SKILL.md and the playbook index.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. Phase 005 owns only the root .opencode/skills/mcp-tooling/manual_testing_playbook/ tree.
<!-- /ANCHOR:questions -->
