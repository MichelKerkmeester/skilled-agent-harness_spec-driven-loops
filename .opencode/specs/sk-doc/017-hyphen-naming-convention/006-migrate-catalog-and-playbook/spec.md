---
title: "Feature Specification: migrate catalog and playbook content (019 phase 006)"
description: "Packet 027 renamed catalog/playbook content to underscore. This phase reverses it: rename `feature_catalog`->`feature-catalog`, `manual_testing_playbook`->`manual-testing-playbook`, and all underscore content back to hyphens, across all skills, validated against the 002 hyphen-aware logic."
trigger_phrases:
  - "migrate catalog and playbook content"
  - "hyphen naming phase 006"
  - "kebab-case migrate catalog"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/006-migrate-catalog-and-playbook"
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

# Feature Specification: Migrate catalog and playbook content

> Phase adjacency under the 019 parent (grouping order, not a runtime dependency): predecessor `005-inventory-and-partitioning`; successor `007-migrate-references-and-assets`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/017-hyphen-naming-convention/006-migrate-catalog-and-playbook |
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-13 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 006 of the 019 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Packet 027 renamed catalog/playbook content to underscore. This phase reverses it: rename `feature_catalog`->`feature-catalog`, `manual_testing_playbook`->`manual-testing-playbook`, and all underscore content back to hyphens, across all skills, validated against the 002 hyphen-aware logic.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rename the two catalog/playbook roots and all underscore content folders/files back to hyphens, all skills.
- Rewrite index tables + `category:` frontmatter + cross-references in lockstep.
- Validate each family against the 002 classifier before commit.

### Out of Scope
- Non-catalog references/assets (007).
- Scripts/imports (008).
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Zero underscore catalog/playbook filesystem names remain (excl frozen) | `git ls-files` finds 0 underscore names under the two roots |
| REQ-002 | The catalog roots are hyphenated and still classify correctly | Leaves under `feature-catalog` type correctly under the 002 logic |
| REQ-003 | All catalog/playbook references resolve after the rename | Index tables + frontmatter + cross-refs point at hyphenated paths |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 027 is reversed for catalog/playbook content.
- **SC-002**: Classification survives the root rename.
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
