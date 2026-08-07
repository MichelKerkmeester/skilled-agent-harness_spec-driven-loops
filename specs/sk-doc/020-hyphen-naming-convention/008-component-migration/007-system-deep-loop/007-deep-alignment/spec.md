---
title: "Feature Specification: deep-alignment filesystem names (020 phase 007/007)"
description: "The deep-alignment packet contains 15 underscore-bearing directory families and 68 underscore-bearing files across adapters, catalogs, playbooks, and state references. This phase renames those in-scope paths to kebab-case and repairs path-valued resource maps while preserving authority identifiers, embedded code keys, read-only behavior, and tool-mandated names."
trigger_phrases:
  - "deep-alignment kebab-case migration"
  - "alignment packet filesystem names"
  - "alignment resource path repair"
  - "deep-alignment snake_case resources"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/007-system-deep-loop/007-deep-alignment"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/007-system-deep-loop/007-deep-alignment"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored deep alignment phase spec"
    next_safe_action: "Execute the deep alignment rename closure"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The live deep-alignment inventory has 15 underscore-bearing directory families and 68 underscore-bearing files."
      - "Path strings in resource maps change when their files move; Python-like identifiers, JSON/YAML keys, authority names, and frontmatter fields do not."
      - "SKILL.md and tool-mandated names stay exact, and the read-only-by-default tool surface is unchanged."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr_rules.md -->

# Feature Specification: Deep-alignment filesystem names

> Phase adjacency under the system-deep-loop component parent: predecessor `006-deep-improvement`; successor `008-manual-testing-playbook`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/020-hyphen-naming-convention/008-component-migration/007-system-deep-loop/007-deep-alignment |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | deep-alignment |
| **Origin** | Phase 007 of the system-deep-loop component migration under the 020 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The alignment packet routes named-standard audits through adapter, lane, state, catalog, and playbook resources. Its live tree contains directory families such as `adapter_contract`, `alignment_contract`, `discovery_and_adapters`, `entry_points_and_modes`, `lane_resolution_and_scoping`, `read_only_and_gated_remediation`, `state_and_fault_tolerance`, and `verify_first_and_known_deviations`, plus path names such as `deep_alignment_config_template.json`, `alignment_state_file_layout.md`, and `verify_first_no_finding_without_reprobe.md`.

This phase renames the alignment packet's in-scope filesystem names to kebab-case and repairs path-valued routing references without altering authority names, embedded resource-map identifiers, read-only guards, or alignment verdict semantics.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The 15 underscore-bearing directory families under `deep-alignment/`, including the paired `feature_catalog/` and `manual_testing_playbook/` trees, `behavior_benchmark/`, adapter categories, and state/fault-tolerance categories.
- The 68 underscore-bearing files across assets, catalogs, playbooks, references, and benchmark documentation, including `deep_alignment_config_template.json`, `alignment_report_reducer.md`, `authority_artifact_class_registry.md`, `lane_config_schema.md`, and `state_machine_wiring_regression.md`.
- Alignment `SKILL.md`, README, embedded resource maps, adapter path values, Markdown links, and test/verification references where a filesystem path changes.
- Authority/lane discovery counts, read-only tool-surface evidence, and path resolution for all four registered authorities.

### Out of Scope

- The shared runtime, sibling workflow packets, root playbook, and root benchmark storage.
- `SKILL.md`, generated reports/state, Python `.py` files/package directories, code identifiers, JSON/YAML/TOML keys, frontmatter fields, database columns, and frozen changelog/history.
- Changing authority names, lane keys, adapter selection, read-only defaults, state transitions, or alignment verdicts.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/deep-alignment/assets/` | Rename/reference update | Rename underscore-bearing prompt/config assets and their path-valued references. |
| `.opencode/skills/system-deep-loop/deep-alignment/feature_catalog/` | Rename/reference update | Rename catalog root, adapter/lane categories, leaves, and index path values. |
| `.opencode/skills/system-deep-loop/deep-alignment/manual_testing_playbook/` | Rename/reference update | Rename playbook categories/scenarios and preserve authority coverage. |
| `.opencode/skills/system-deep-loop/deep-alignment/SKILL.md`, `references/`, and tests | Reference update | Update only filesystem path strings; preserve embedded identifiers and data keys. |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every alignment candidate is classified once | The map covers all 15 directory families and 68 underscore-bearing files with no unknown or duplicate target. |
| REQ-002 | Alignment path consumers are repaired | Resource maps, adapter paths, Markdown links, playbook/catalog indexes, and test references resolve to kebab-case paths. |
| REQ-003 | Identifier/key boundaries are preserved | Authority names, lane keys, embedded Python/TypeScript identifiers, JSON/YAML keys, and frontmatter fields are byte-equivalent except for required path values. |
| REQ-004 | Alignment behavior remains read-only by default | Tool permissions, guard paths, state transitions, registered authorities, and verdict outputs match BASE evidence. |
| REQ-005 | Exemptions are respected | Tool names, generated output, Python files/package directories, database columns, and frozen history retain their original names. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No in-scope snake_case filesystem name remains under `deep-alignment/`.
- **SC-002**: All four authority adapters, resource routes, playbook scenarios, and state references resolve with unchanged semantics.
- **SC-003**: The read-only-by-default alignment surface and its tool boundary remain intact.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The alignment packet embeds resource maps beside code-like identifiers and data keys. A text-wide underscore replacement would corrupt those contracts while a path-only replacement could miss adapter references assembled at runtime. The phase depends on the frozen map and reference checker; the checklist requires separate evidence for path strings, identifiers/keys, and read-only behavior.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. Any path-looking string that does not resolve to a filesystem name must be recorded as an identifier/key disposition before the rename batch is accepted.
<!-- /ANCHOR:questions -->
