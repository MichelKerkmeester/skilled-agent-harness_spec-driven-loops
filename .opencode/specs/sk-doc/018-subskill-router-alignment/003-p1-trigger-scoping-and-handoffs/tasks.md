---
title: "Tasks: P1 Trigger Scoping and Handoffs"
description: "Completed broad-trigger removal, per-mode hub-score narrowing, and ten sibling handoff corrections."
trigger_phrases:
  - "trigger scoping tasks"
  - "handoff alignment tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/018-subskill-router-alignment/003-p1-trigger-scoping-and-handoffs"
    last_updated_at: "2026-07-13T06:50:00Z"
    last_updated_by: "opencode"
    recent_action: "Completed P1 trigger and handoff fixes"
    next_safe_action: "Reference phase 004"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/003-p1-trigger-scoping-and-handoffs"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: P1 Trigger Scoping and Handoffs

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Inventory broad triggers and all handoff sections [EVIDENCE: source audit]
- [x] T002 Confirm workstream-A benchmark vocabulary [EVIDENCE: preservation grep]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Apply P1-01 bare benchmark removal [EVIDENCE: source/router diff]
- [x] T004 Apply P1-02 suffix-only trigger removal [EVIDENCE: command trigger line]
- [x] T005 Apply P1-03 generic documentation removal [EVIDENCE: README alias diff]
- [x] T006 Apply P1-04 hub-schema trigger removal [EVIDENCE: skill trigger line]
- [x] T007 Apply P1-05 hub-identity score removal [EVIDENCE: router signal diff]
- [x] T008 Apply P1-06 exact handoffs across ten packets [EVIDENCE: handoff scan]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Confirm generic documentation and benchmark queries defer [EVIDENCE: final replay]
- [x] T010 Confirm family vocabulary remains in all projections [EVIDENCE: preservation grep]
- [x] T011 Confirm ten standardized handoff lists [EVIDENCE: structure scan]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P1 tasks marked complete
- [x] No blocked P1 tasks remain
- [x] Broad queries defer and family-specific vocabulary remains
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
