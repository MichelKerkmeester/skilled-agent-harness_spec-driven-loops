---
title: "Tasks: Graduation Follow-Ups Deep Review and Fixes"
description: "The audit lenses and the fix tasks for the 010 graduation follow-ups deep review, marked complete with evidence from the review record and the re-reviews."
trigger_phrases:
  - "follow-up deep review tasks"
  - "bitemporal fix tasks"
  - "review lens tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/004-dark-flag-graduation/008-followup-deep-review"
    last_updated_at: "2026-06-24T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Marked all review and fix tasks complete with evidence"
    next_safe_action: "Evidence-gated decision to flip any of the involved defaults on"
    blockers: []
    key_files:
      - ".opencode/specs/system-spec-kit/028-memory-search-intelligence/005-dark-flag-graduation/008-followup-deep-review/review/review-report.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-028-011"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Graduation Follow-Ups Deep Review and Fixes

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

- [x] T001 Define the ten rotating review lenses and the loop-until-dry stop condition (`review/deep-review-strategy.md`)
- [x] T002 Point the review at the production read and write paths across the four subsystems, not the test fixtures
- [x] T003 [P] Record the entry state, a green cli pass reported graduate-ready
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Run ten opus passes, record the FAIL verdict, three P0 plus eight P1 plus four P2 (`review/review-report.md`)
- [x] T005 Fix P0-1, the live readers filter on `invalid_at IS NULL` under the flag so a flag-on reindex returns only the open edge
- [x] T006 Fix P0-2, `pruneDanglingEdges` closes instead of hard-deleting on the deferred full-scan prune under the flag
- [x] T007 Fix P0-3, `replaceNodes` closes its edges instead of deleting them before `replaceEdges` under the flag
- [x] T008 Fix the off-by-one generation stamp so an as-of read at the genuine pre-reindex generation returns the old target
- [x] T009 Fix the conditional P1: the budget-trim primary-row reservation, the advisor alias guard, and the lag metric
- [x] T010 [P] Ship the second batch under their flags: ensure-ready bump, lineage validity, as-of query surface, degree-cap-15, stall detector, title-aware dedup
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Drive the real two-scan reindex integration test under the real bump ordering, confirm the as-of round trip
- [x] T012 Confirm each fix byte-identical when its flag is off with a flag-off unit test per change
- [x] T013 Re-review the committed code, confirm PASS with zero P0 and zero P1 (`review/review-report.md`)
- [x] T014 Confirm the third re-review at zero findings for the second batch
- [x] T015 Measure the dedup title-only false-collapse rate at 0.50 then confirm 0 with the Jaccard gate while identical-dup collapse holds 7 of 7
- [x] T016 Record the readiness on evidence, not on the single green cli pass
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Every P0 and P1 and the actionable P2 resolved and re-reviewed to zero
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Review Record**: See `review/review-report.md`
<!-- /ANCHOR:cross-refs -->
