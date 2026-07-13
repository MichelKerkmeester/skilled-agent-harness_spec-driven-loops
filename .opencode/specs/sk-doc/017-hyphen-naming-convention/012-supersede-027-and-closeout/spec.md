---
title: "Feature Specification: supersede 027 and close out (019 phase 012)"
description: "With the migration complete and green, packet 027 must be formally superseded, changelogs updated, the convention finalized as canonical, the parent rolled up, and the worktree merged back."
trigger_phrases:
  - "supersede 027 and close out"
  - "hyphen naming phase 012"
  - "kebab-case supersede 027"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/012-supersede-027-and-closeout"
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

# Feature Specification: Supersede 027 and close out

> Phase adjacency under the 019 parent (grouping order, not a runtime dependency): predecessor `011-validate-build-test-rebenchmark`; successor none (final phase).

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/017-hyphen-naming-convention/012-supersede-027-and-closeout |
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-13 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 012 of the 019 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

With the migration complete and green, packet 027 must be formally superseded, changelogs updated, the convention finalized as canonical, the parent rolled up, and the worktree merged back.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Mark packet 027 superseded and reconcile its docs.
- Update changelogs; finalize the convention doc as canonical.
- Parent rollup for 019; merge the execution worktree back.

### Out of Scope
- Any further renaming or logic change.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Packet 027 is formally superseded and reconciled | 027 status/docs reference 019 as the superseding program |
| REQ-002 | The convention doc is the single canonical source and changelogs are updated | Changelog entry exists; convention doc is linked as canonical |
| REQ-003 | The 019 parent is rolled up and the worktree merged | Parent status complete; worktree merged with 0 conflicts |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 027 superseded; 019 canonical.
- **SC-002**: Worktree merged; program closed.
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
