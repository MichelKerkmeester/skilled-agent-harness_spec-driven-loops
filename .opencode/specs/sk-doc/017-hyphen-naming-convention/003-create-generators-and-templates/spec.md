---
title: "Feature Specification: create-* generators and templates (019 phase 003)"
description: "The create-feature-catalog and create-manual-testing-playbook skills, the `/create:*` generators, and their templates currently emit underscore names (the 027 change, commit 7cc369f2ed). They must emit hyphenated folder/file names so newly-created content is born compliant."
trigger_phrases:
  - "create-* generators and templates"
  - "hyphen naming phase 003"
  - "kebab-case create generators"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/003-create-generators-and-templates"
    last_updated_at: "2026-07-13T11:44:19Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase spec scaffolded from the 019 decomposition"
    next_safe_action: "Plan this phase when it is picked up for execution"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: create-* generators and templates

> Phase adjacency under the 019 parent (grouping order, not a runtime dependency): predecessor `002-sk-doc-validator-and-classifier-logic`; successor `004-guard-and-migration-tooling`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/017-hyphen-naming-convention/003-create-generators-and-templates |
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-13 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 003 of the 019 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The create-feature-catalog and create-manual-testing-playbook skills, the `/create:*` generators, and their templates currently emit underscore names (the 027 change, commit 7cc369f2ed). They must emit hyphenated folder/file names so newly-created content is born compliant.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- create-feature-catalog + create-manual-testing-playbook SKILL.md + templates.
- The `/create:*` generators (reverse the 027 `category_name`/`feature_name.md` emission back to `category-name`/`feature-name.md`).
- Any other create-* mode that emits filesystem names.

### Out of Scope
- Retroactive rename of existing content (006+).
- The classifier logic (002).
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The create-* generators emit hyphenated folder and file names | A dry-run generation produces `category-name/` and `feature-name.md` |
| REQ-002 | Templates and SKILL docs document the hyphenated canonical form | No template or SKILL example shows an underscore filesystem name |
| REQ-003 | The 027 generator changes are reversed | The generators no longer emit `category_name`/`feature_name.md` |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: New catalog/playbook content is born hyphenated.
- **SC-002**: Generators + templates are the reference for the convention.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

Inherits the program-level risks in the 019 parent spec (import breakage, validator downgrade, over-broad sweep,
exemption leakage, concurrent sessions). Phase-specific risks are enumerated in this phase's plan.md when it is planned.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking at scaffold time; resolved during this phase's planning.
<!-- /ANCHOR:questions -->
