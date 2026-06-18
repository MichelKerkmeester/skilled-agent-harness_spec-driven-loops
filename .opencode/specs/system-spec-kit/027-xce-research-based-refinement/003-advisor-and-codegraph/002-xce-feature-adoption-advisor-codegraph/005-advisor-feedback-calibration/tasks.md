---
title: "Tasks: Phase 5: advisor-feedback-calibration [template:level_1/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "name"
  - "template"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/003-advisor-and-codegraph/002-xce-feature-adoption-advisor-codegraph/005-advisor-feedback-calibration"
    last_updated_at: "2026-06-10T23:45:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Completed shadow feedback calibration reducer"
    next_safe_action: "Inspect advisory records; do not promote automatically"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/005-advisor-feedback-calibration"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Future promotion criteria remain out of scope."
    answered_questions:
      - "No live scoring drift is allowed; tests prove byte-identical scoring with the shadow flag off and on."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 5: advisor-feedback-calibration

<!-- SPECKIT_LEVEL: 1 -->

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

- [x] T001 Read phase scaffold and existing validate/scorer surfaces
- [x] T002 Confirm no new dependencies or package changes are needed
- [x] T003 [P] Identify existing vitest and TypeScript verification commands
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Implement default-off shadow feedback calibration reducer
- [x] T005 Add read-only proposed-vs-current weight and threshold proposal surface
- [x] T006 Wire `advisor_validate` to record advisory reports only when enabled
- [x] T007 Add low-sample, sample-concentration, no-lane-attribution, and no-auto-promotion guardrails
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Add reducer and validate integration vitest coverage
- [x] T009 Add no-live-drift test for byte-identical recommendation order, scores, and weights with flag off vs on
- [x] T010 Run typecheck, build, targeted tests, and update documentation
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Verification passed with targeted vitest, typecheck, build, and strict spec validation
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
