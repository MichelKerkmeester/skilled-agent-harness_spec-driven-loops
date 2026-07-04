---
title: "Tasks: Section-Counts Manifest Fix"
description: "Task ledger for the per-doc section-count derivation fix."
trigger_phrases:
  - "section counts tasks"
importance_tier: "medium"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/004-deep-loop/007-deep-review-followup-hardening/004-section-counts-manifest-fix"
    last_updated_at: "2026-07-04T16:33:21.084Z"
    last_updated_by: "opencode-gpt-5.5"
    recent_action: "Completed implementation and verification tasks"
    next_safe_action: "No follow-up required; packet is complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fable-032-004-section-counts"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Section-Counts Manifest Fix

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

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

- [x] T001 Read `check-section-counts.sh` in full.
- [x] T002 Confirm `contract spec.md <level>` header counts for levels 1, 2, 3, 3+ via template-structure.js.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Swap `_section_expected_spec_h2` to the per-doc derivation with a documented fallback default.
- [x] T004 Sweep the fixture suite for encoded old expectations; update alongside the fix.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Live before/after: false warning gone on two known conforming folders.
- [x] T006 Thin-spec check: genuinely under-template spec still warns.
- [x] T007 Full `test-validation-extended.sh`: fully green.
- [x] T008 Author implementation-summary.md; fill checklist evidence; set spec.md Status per real outcome.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Manual verification passed (`validate.sh --strict` exits 0 on this folder).
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decisions**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->
