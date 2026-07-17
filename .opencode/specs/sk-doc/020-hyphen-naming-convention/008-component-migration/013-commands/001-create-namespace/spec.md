---
title: "Feature Specification: create command namespace naming (032 phase 008/013/001)"
description: "The create command namespace keeps its workflow and presentation assets in snake_case filenames even though its command markdown files already use kebab-case. This phase renames the maintained create assets, repairs every path pointer, and preserves command IDs, data keys, and tool-mandated names."
trigger_phrases:
  - "create command namespace naming"
  - "kebab-case create assets"
  - "hyphenate create workflow files"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/013-commands"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/013-commands/001-create-namespace"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored create namespace docs"
    next_safe_action: "Execute the create asset rename closure against the frozen map"
    blockers: []
    key_files:
      - ".opencode/commands/create/"
      - ".opencode/commands/create/assets/"
      - ".opencode/commands/create/README.txt"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The create command markdown files are already kebab-case; the physical candidates are maintained asset files."
      - "Workflow YAML keys and command IDs remain exact while path values and links change."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Create command namespace naming

> Phase adjacency under the commands component parent: predecessor `012-sk-git`; successor `002-deep-namespace`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/020-hyphen-naming-convention/008-component-migration/013-commands/001-create-namespace |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 001 of the commands-surface migration under the 032 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The `.opencode/commands/create/assets/` tree has maintained filenames such as `create_agent_auto.yaml`, `create_feature_catalog_confirm.yaml`, and `create_manual_testing_playbook_presentation.txt`. The command markdown files already use kebab-case, but their links and loader pointers still name the underscore assets.

### Purpose

Rename the 30 maintained create asset files to their exact kebab-case targets and update every active pointer so `:auto`, `:confirm`, and presentation loading retain their current behavior.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The 30 maintained files under `.opencode/commands/create/assets/`: `create_agent_auto.yaml`, `create_agent_confirm.yaml`, `create_agent_presentation.txt`; `create_benchmark_auto.yaml`, `create_benchmark_confirm.yaml`, `create_benchmark_presentation.txt`; `create_changelog_auto.yaml`, `create_changelog_confirm.yaml`, `create_changelog_presentation.txt`; `create_command_auto.yaml`, `create_command_confirm.yaml`, `create_command_presentation.txt`; `create_feature_catalog_auto.yaml`, `create_feature_catalog_confirm.yaml`, `create_feature_catalog_presentation.txt`; `create_flowchart_auto.yaml`, `create_flowchart_confirm.yaml`, `create_flowchart_presentation.txt`; `create_manual_testing_playbook_auto.yaml`, `create_manual_testing_playbook_confirm.yaml`, `create_manual_testing_playbook_presentation.txt`; `create_readme_auto.yaml`, `create_readme_confirm.yaml`, `create_readme_presentation.txt`; `create_skill_auto.yaml`, `create_skill_confirm.yaml`, `create_skill_presentation.txt`; and `create_skill_parent_auto.yaml`, `create_skill_parent_confirm.yaml`, `create_skill_parent_presentation.txt`.
- References from the create command markdown files, `README.txt`, asset-local pointers, and external command indexes or tests that resolve these paths.
- A frozen-map disposition for each listed source and target, including collision and old-reference checks.

### Out of Scope

- The already-compliant command files `agent.md`, `benchmark.md`, `changelog.md`, `command.md`, `feature-catalog.md`, `flowchart.md`, `manual-testing-playbook.md`, `readme.md`, `skill-parent.md`, and `skill.md`.
- Command IDs, YAML keys, workflow field names, frontmatter fields, generated or lockfile output, Python files/package directories, and frozen history.
- The `deep`, `design`, `doctor`, `memory`, `scripts`, `speckit`, loose-command, and final-gate surfaces owned by sibling phases.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every maintained create asset candidate has one semantic source-to-target row | The frozen-map report lists all 30 sources, 30 distinct kebab-case targets, and no unknown disposition. |
| REQ-002 | Asset filenames and active path references agree | Every target exists, every old path literal is absent from the active closure, and every create command points to the target asset. |
| REQ-003 | Create workflows preserve their public contract | `:auto`, `:confirm`, presentation loading, and the existing command IDs resolve the same workflow and presentation content as BASE. |
| REQ-004 | Exempt content remains untouched | YAML keys, command IDs, frontmatter fields, tool-mandated names, Python/package names, generated output, and frozen history are unchanged. |
| REQ-005 | The phase hands off an auditable closure | The report records source/target paths, external consumers, link results, and the path-scoped diff. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 30 maintained create assets have kebab-case filenames with no collision or stale active pointer.
- **SC-002**: Every create command still loads the same mode and presentation contract through the renamed paths.
- **SC-003**: No command ID, data key, or exemption boundary changes as a side effect.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The create markdown files repeat asset paths in tables, instructions, and presentation-boundary sections, while the YAML assets can carry path-valued strings of their own. A partial replacement can leave a mode working only in one branch. The phase depends on the 032 frozen map, the 005 rename/reference tooling, the 006 map handoff, and the 000 baseline; the executor must scan both command-local and repository-wide consumers before accepting the batch.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. The executor must use the frozen map to distinguish filesystem path values from YAML keys or command identifiers and must attach any consumer outside `.opencode/commands/create/` to the closure evidence.
<!-- /ANCHOR:questions -->
