---
title: "Feature Specification: code-quality filesystem names (032 phase 008/003)"
description: "The sk-code quality mode contains snake_case checklist, manual-playbook, and benchmark names that are referenced by the quality mode's routing and author-gate documentation. This phase defines the in-scope kebab-case rename and reference repair without changing quality rules, identifiers, or tool-mandated names."
trigger_phrases:
  - "code-quality naming migration"
  - "quality mode kebab-case"
  - "quality checklist path rename"
  - "sk-code quality packet migration"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/001-sk-code"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/001-sk-code/003-code-quality"
    last_updated_at: "2026-07-14T18:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored code-quality phase spec"
    next_safe_action: "Execute the quality packet rename closure"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/code-quality/SKILL.md"
      - ".opencode/skills/sk-code/code-quality/assets/"
      - ".opencode/skills/sk-code/code-quality/manual_testing_playbook/"
      - ".opencode/skills/sk-code/code-quality/benchmark/"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Quality-mode behavior and rule identifiers are unchanged."
      - "SKILL.md, README.md, Python files/package directories, generated output, and tool-mandated names remain exact."
      - "This child owns only the code-quality subtree and its path/reference closure."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: code-quality filesystem names

> Phase adjacency under the sk-code component parent: predecessor 002-code-opencode; successor 004-code-review.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/020-hyphen-naming-convention/008-component-migration/001-sk-code/003-code-quality |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-code |
| **Origin** | Phase 003 of the sk-code component migration under the 032 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The code-quality mode still stores its reusable checklist under assets/code_quality_checklist/, its playbook under manual_testing_playbook/quality_gate/, and its benchmark runs under live_mode_b/ and router_mode_a/. The mode's SKILL.md, README.md, and scenario links use those names as path contracts, so renaming only the directories would strand the author quality gate.

### Purpose

Rename the in-scope code-quality filesystem names to kebab-case and update every quality-mode path consumer while preserving the quality gate's rules, check identifiers, executable script names, and exemption boundary.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- assets/code_quality_checklist/ and its files naming_init_formatting_and_css.md, overview_header_and_comments.md, and verification_quick_reference_and_related.md.
- The code-quality/manual_testing_playbook/ root, quality_gate/ category, manual_testing_playbook.md index, and quality_checklist.md scenario.
- Nested benchmark labels live_mode_b/ and router_mode_a/ plus quality-mode SKILL.md, README.md, link text, and resource path consumers.
- A frozen-map disposition for every underscore-bearing path under code-quality and every path reference that crosses into shared or surface evidence.

### Out of Scope

- Quality rules, check IDs, shell script names, code identifiers, JSON/YAML/TOML keys, frontmatter fields, and behavior changes.
- SKILL.md, README.md, package manifests, Python .py files and package directories, generated/lockfile output, tool-mandated names, and frozen changelog/history as physical names.
- code-opencode, code-review, code-webflow, hub-level playbook, and root benchmark physical renames owned by sibling children.
- Rewriting shared source files; this phase updates only the path consumers needed for the quality closure.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/sk-code/code-quality/assets/code_quality_checklist/** | Rename and reference update | Rename the checklist directory and three markdown resources. |
| .opencode/skills/sk-code/code-quality/manual_testing_playbook/** | Rename and reference update | Rename the playbook root/category/index/scenario paths. |
| .opencode/skills/sk-code/code-quality/benchmark/** | Rename and path update | Rename live_mode_b and router_mode_a storage labels. |
| .opencode/skills/sk-code/code-quality/SKILL.md and README.md | Reference update | Repair quality-mode resource paths without changing gate logic. |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All in-scope quality-mode names have kebab-case targets | The frozen map covers the checklist, playbook, and benchmark paths with no collision or unknown row. |
| REQ-002 | Quality-mode consumers resolve the renamed resources | SKILL.md, README.md, playbook links, shared references, and benchmark commands contain no stale active path. |
| REQ-003 | Quality gate semantics remain unchanged | Quality routing, checklist identifiers, severity rules, and executable script behavior match BASE. |
| REQ-004 | Exemptions remain intact | Python/package, generated, lockfile, tool-mandated, identifier/key, frontmatter, and frozen surfaces are unchanged. |
| REQ-005 | The child reports cross-component edges | Any shared or surface path touched by the rename is dispositioned for the subtree gate rather than silently changed. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No in-scope snake_case filesystem name remains under code-quality.
- **SC-002**: The quality mode can load its checklist, playbook, shared standards, and benchmark paths after the rename.
- **SC-003**: Quality-gate outcomes and exemption boundaries remain equivalent to BASE.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The quality packet is an active workflow mode: a stale checklist path can make an author gate silently skip evidence even when the mode itself still routes. The mitigation is a direct resource-load check, a complete markdown/path-value sweep, and before/after quality-gate evidence. The phase depends on the frozen map and the preceding OpenCode/shared path handoffs.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. The executor must record whether benchmark output directories are classified as tracked rename candidates or generated output before applying the component map.
<!-- /ANCHOR:questions -->
