---
title: "Feature Specification: design command namespace naming (017 phase 008/013/003)"
description: "The design command namespace has kebab-case command markdown files but snake_case workflow and presentation asset filenames. This phase renames the 15 maintained assets, repairs their path references, and leaves command IDs and configuration keys unchanged."
trigger_phrases:
  - "design command namespace naming"
  - "kebab-case design assets"
  - "hyphenate design workflow files"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/013-commands"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/013-commands/003-design-namespace"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored design namespace docs"
    next_safe_action: "Execute the design asset rename closure against the frozen map"
    blockers: []
    key_files:
      - ".opencode/commands/design/"
      - ".opencode/commands/design/assets/"
      - ".opencode/commands/design/*.md"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The five design command markdown files already use compliant basenames."
      - "Only path-valued asset references change; command IDs and configuration keys remain exact."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Design command namespace naming

> Phase adjacency under the commands component parent: predecessor `002-deep-namespace`; successor `004-doctor-namespace`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/017-hyphen-naming-convention/008-component-migration/013-commands/003-design-namespace |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 003 of the commands-surface migration under the 017 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The `.opencode/commands/design/assets/` tree contains `design_audit_auto.yaml`, `design_foundations_presentation.txt`, `design_interface_confirm.yaml`, `design_md-generator_auto.yaml`, and `design_motion_presentation.txt`. The five design command markdown files already use kebab-case, but their workflow and presentation pointers still use underscore filenames.

### Purpose

Rename the 15 maintained design assets to kebab-case and update every active link and pointer so audit, foundations, interface, md-generator, and motion workflows retain their current loading behavior.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The 15 maintained files under `.opencode/commands/design/assets/`: `design_audit_auto.yaml`, `design_audit_confirm.yaml`, `design_audit_presentation.txt`; `design_foundations_auto.yaml`, `design_foundations_confirm.yaml`, `design_foundations_presentation.txt`; `design_interface_auto.yaml`, `design_interface_confirm.yaml`, `design_interface_presentation.txt`; `design_md-generator_auto.yaml`, `design_md-generator_confirm.yaml`, `design_md-generator_presentation.txt`; and `design_motion_auto.yaml`, `design_motion_confirm.yaml`, `design_motion_presentation.txt`.
- References in `audit.md`, `foundations.md`, `interface.md`, `md-generator.md`, `motion.md`, asset-local pointers, command indexes, tests, and other consumers that name these files as paths.
- A source-to-target disposition and post-rename reference closure for all 15 candidates.

### Out of Scope

- The already-compliant design command files and the `assets/` directory name.
- Command IDs, design configuration keys, YAML keys, frontmatter fields, generated or lockfile output, Python files/package directories, and frozen history.
- Other command namespaces and shared asset residuals owned by sibling phases.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every design asset candidate maps once to a kebab-case target | The frozen-map report lists 15 sources, 15 distinct targets, and no unknown disposition. |
| REQ-002 | Design command and asset pointers remain resolvable | Every active auto, confirm, and presentation path points to an existing target with no old active path. |
| REQ-003 | Design command behavior remains equivalent | Audit, foundations, interface, md-generator, and motion route to the same workflows and presentation content as BASE. |
| REQ-004 | Exempt content remains unchanged | Command IDs, YAML/config keys, frontmatter fields, Python/package names, generated output, tool-mandated names, and frozen history are preserved. |
| REQ-005 | Evidence is complete and scope-bound | The candidate report includes map, reference, route, and diff evidence for the design closure only. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 15 maintained design assets use kebab-case filenames and resolve from every active consumer.
- **SC-002**: All five design command modes retain their BASE loading and routing behavior.
- **SC-003**: No command ID, configuration key, or exemption is changed.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

Design assets are referenced from both command markdown tables and asset content, and `design_md-generator_*` mixes an underscore with an already-hyphenated token. The mitigation is an explicit map with exact target strings plus a path-only reference scan; the phase depends on the 005 tooling, 006 frozen map, and 000 baseline and must not rely on a global underscore replacement.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. The executor must classify each occurrence as a filesystem path, an identifier/key, or prose before rewriting it and must attach external consumers to the design closure.
<!-- /ANCHOR:questions -->
