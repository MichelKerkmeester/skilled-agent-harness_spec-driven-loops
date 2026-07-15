---
title: "Feature Specification: Templates and examples (017 subtree 008 phase 005)"
description: "The system-spec-kit template surface contains underscore-bearing directory and file names in the examples and stress-test layouts, including level_1, level_2, level_3, level_3+, stress_test, and EXTENSION_GUIDE.md. This phase moves permitted template paths and updates generator, renderer, and documentation pointers while preserving tool-mandated manifest templates."
trigger_phrases:
  - "system-spec-kit templates and examples"
  - "level_1 template rename"
  - "stress_test template rename"
  - "EXTENSION_GUIDE rename"
  - "kebab-case phase 005"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/008-system-spec-kit"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/008-system-spec-kit/005-templates-and-examples"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored template-example docs"
    next_safe_action: "Execute the template path map after script callers are stable"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Templates and examples

> Phase adjacency under the 008 system-spec-kit subtree (grouping order, not a runtime dependency): predecessor 004-scripts-tree; successor 006-references-and-assets.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/019-hyphen-naming-convention/008-component-migration/008-system-spec-kit/005-templates-and-examples |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | system-spec-kit |
| **Origin** | Phase 005 of the 008 system-spec-kit component migration under the 017 kebab-case program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Template selection and example links still encode underscore-bearing directory names such as templates/examples/level_1 and templates/stress_test. The manifest templates and renderer use these paths as data, so a directory or file move without pointer updates would make scaffold output incomplete or select the wrong level.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rename template example directories level_1, level_2, level_3, and level_3+ to semantic level-1, level-2, level-3, and level-3+ paths.
- Rename templates/stress_test to templates/stress-test and templates/manifest/EXTENSION_GUIDE.md to extension-guide.md where the policy permits.
- Update template manifests, create/render scripts, README links, example frontmatter pointers, and any path-valued docs or tests.
- Keep tool-mandated manifest filenames such as spec.md.tmpl, plan.md.tmpl, tasks.md.tmpl, checklist.md.tmpl, decision-record.md.tmpl, package manifests, and SKILL.md exact.

### Out of Scope
- Reference and asset files outside templates, which phase 006 owns.
- Feature-catalog and manual-playbook content trees, which phases 008 and 009 own.
- Changing the meaning, section shape, or level semantics of a template.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every underscore-bearing template path is inventoried and classified. | The inventory covers examples, stress-test assets, manifest documentation, and all generator pointers. |
| REQ-002 | Permitted template paths use semantic kebab targets. | level_1, level_2, level_3, level_3+, stress_test, and EXTENSION_GUIDE.md have explicit source-to-target entries. |
| REQ-003 | Generators and renderers resolve the new template paths. | Scaffold and inline-render path selection points at the renamed directories and file. |
| REQ-004 | Tool-mandated names remain exact. | Manifest template basenames, package manifests, SKILL.md, and test magic are not renamed. |
| REQ-005 | Example output remains structurally equivalent. | Generated example trees retain the expected files, level markers, anchors, and cross-references. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The template and example tree has no permitted underscore-bearing filesystem name.
- **SC-002**: Generators, renderers, and documentation select the semantic kebab paths.
- **SC-003**: Example output is structurally identical except for approved filesystem names.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

Level directory names are consumed as template selectors, so a path rewrite can silently change which contract is rendered. The phase must compare generated trees and preserve manifest basenames. The plus suffix in level-3+ is retained as a template family marker while the underscore segment becomes a hyphen.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

No blocking questions. The execution report must record whether any additional underscore-bearing template path appears beyond the named directories and guide.
<!-- /ANCHOR:questions -->

