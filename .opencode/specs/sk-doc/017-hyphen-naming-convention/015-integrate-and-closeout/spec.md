---
title: "Feature Specification: integrate and close out (017 phase 015)"
description: "With the migration green, the program integrates the latest origin in a clean integration worktree, reruns the entire 014 gate on the exact final commit, then supersedes 027 (append-only), updates changelogs, finalizes the convention, rolls up the parent, reconciles metadata, and merges."
trigger_phrases:
  - "integrate and close out"
  - "hyphen naming phase 015"
  - "kebab-case integrate and"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/015-integrate-and-closeout"
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

# Feature Specification: Integrate and close out

> Phase adjacency under the 017 parent (grouping order, not a runtime dependency): predecessor `014-validate-build-test-rebenchmark`; successor none (final phase).

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/017-hyphen-naming-convention/015-integrate-and-closeout |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-13 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 015 of the 017 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

With the migration green, the program integrates the latest origin in a clean integration worktree, reruns the entire 014 gate on the exact final commit, then supersedes 027 (append-only), updates changelogs, finalizes the convention, rolls up the parent, reconciles metadata, and merges.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Integrate the latest origin in a clean integration worktree (never the raced primary checkout); rerun the ENTIRE 014 gate on the exact final commit.
- Mark packet 027 superseded (append-only) and reconcile its docs.
- Update changelogs; finalize the convention doc as canonical.
- Parent rollup; reconcile completion metadata; merge.

### Out of Scope
- Any further renaming or logic change.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The latest origin is integrated in a clean worktree and the full 014 gate reruns on the final commit | All conflicts resolved; the complete 014 gate passes on the exact final commit |
| REQ-002 | Packet 027 is formally superseded append-only and reconciled | 027 status/docs reference this program as superseding; no broad rewrite of frozen 027 content |
| REQ-003 | The convention doc is the single canonical source and changelogs are updated | A changelog entry exists; the convention doc is linked as canonical |
| REQ-004 | The parent is rolled up and completion metadata reconciled | Parent status complete; child/checklist/completion metadata consistent |
| REQ-005 | The program merges via a clean integration | The merge lands after the reran 014 gate, not through the raced checkout |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 027 superseded; the convention is canonical.
- **SC-002**: Program integrated cleanly and closed.
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
