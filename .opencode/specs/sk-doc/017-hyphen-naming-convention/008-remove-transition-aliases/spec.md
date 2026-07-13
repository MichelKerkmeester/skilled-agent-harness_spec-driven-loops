---
title: "Feature Specification: remove transition aliases (017 phase 008)"
description: "The 002 dual-name tolerance was a bridge. Once 007 has renamed the roots, the underscore aliases must be removed so the old names are rejected and the hyphenated form is the only accepted one, leaving only scoped frozen/exempt references behind."
trigger_phrases:
  - "remove transition aliases"
  - "hyphen naming phase 008"
  - "kebab-case remove transition"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-remove-transition-aliases"
    last_updated_at: "2026-07-13T13:10:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase spec authored from the 16-phase decomposition"
    next_safe_action: "Execute this phase on the pinned worktree when picked up"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Remove transition aliases

> Phase adjacency under the 017 parent (grouping order, not a runtime dependency): predecessor `007-migrate-catalog-and-playbook`; successor `009-runtime-and-package-layout`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/017-hyphen-naming-convention/008-remove-transition-aliases |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-13 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 008 of the 017 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The 002 dual-name tolerance was a bridge. Once 007 has renamed the roots, the underscore aliases must be removed so the old names are rejected and the hyphenated form is the only accepted one, leaving only scoped frozen/exempt references behind.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Remove the underscore aliases from the 002 classifier/loader/guards.
- Prove the old live root names are now rejected.
- Confirm only scoped frozen/exempt references to the old names remain.

### Out of Scope
- Any further content rename (already done in 007).
- Non-catalog surfaces (010+).
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The underscore aliases are removed from all 002 consumers | No consumer accepts the underscore roots anymore |
| REQ-002 | The old live root names are rejected | A synthetic underscore catalog leaf fails classification/guard |
| REQ-003 | Only scoped frozen/exempt references to the old names remain | A scope-aware scan finds old-name references only under frozen/exempt paths |
| REQ-004 | The Lane C loader still loads all scenarios under the hyphenated roots | Scenario count and IDs unchanged after alias removal |
| REQ-005 | The convention guard now enforces hyphen-only for catalog content | The inverse guard rejects any re-introduced underscore catalog name |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The dual-name bridge is removed.
- **SC-002**: Hyphenated roots are the only accepted form.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

Inherits the program-level risks in the 017 parent spec (import breakage, validator downgrade, non-reproducible builds,
over-broad sweep, exemption leakage, concurrent sessions). Phase-specific risks are enumerated in this phase's plan.md.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking; resolved during this phase's execution against the pinned baseline.
<!-- /ANCHOR:questions -->
