---
title: "Feature Specification: sk-doc validator and classifier logic (019 phase 002)"
description: "The sk-doc classifier keys on the `feature_catalog` / `manual_testing_playbook` parent-directory names (validate_document.py:129,137, both copies) and the Lane C loader keys on frontmatter. To rename those roots to hyphens without downgrading every catalog leaf to `readme`, the classification logic must accept the hyph"
trigger_phrases:
  - "sk-doc validator and classifier logic"
  - "hyphen naming phase 002"
  - "kebab-case sk doc"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/002-sk-doc-validator-and-classifier-logic"
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

# Feature Specification: sk-doc validator and classifier logic

> Phase adjacency under the 019 parent (grouping order, not a runtime dependency): predecessor `001-convention-policy-and-scope`; successor `003-create-generators-and-templates`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/017-hyphen-naming-convention/002-sk-doc-validator-and-classifier-logic |
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-13 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 002 of the 019 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The sk-doc classifier keys on the `feature_catalog` / `manual_testing_playbook` parent-directory names (validate_document.py:129,137, both copies) and the Lane C loader keys on frontmatter. To rename those roots to hyphens without downgrading every catalog leaf to `readme`, the classification logic must accept the hyphenated roots first — ideally with a dual-name tolerance so it can land before the rename.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `validate_document.py` classifier (both copies) updated to recognize `feature-catalog` / `manual-testing-playbook`.
- A transition tolerance that accepts BOTH the underscore and hyphen root names during migration.
- Any validator rule or Lane C loader path that references the two root names by string.

### Out of Scope
- Renaming the directories themselves (phase 006).
- Generator emission changes (003).
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The classifier recognizes hyphenated catalog/playbook roots and still types leaves correctly | A hyphenated catalog leaf classifies as its typed document, not `readme` |
| REQ-002 | A dual-name tolerance accepts both underscore and hyphen roots during transition | Both `feature_catalog` and `feature-catalog` leaves classify identically |
| REQ-003 | Both copies of the classifier change identically with no drift | Diff of the two copies is byte-identical in the changed region |
| REQ-004 | The Lane C loader remains separator-agnostic and loads unchanged | Discovered-scenario count is unchanged |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Hyphenated catalog roots classify correctly.
- **SC-002**: Dual-name tolerance lets 002 land before 006.
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
