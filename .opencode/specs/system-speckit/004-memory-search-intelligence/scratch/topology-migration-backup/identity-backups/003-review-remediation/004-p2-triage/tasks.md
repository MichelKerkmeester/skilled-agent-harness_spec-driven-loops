---
title: "Tasks: P2 Triage"
description: "PENDING task list for grouping, deciding and routing the 91 P2 findings."
trigger_phrases:
  - "028 p2 triage tasks"
  - "p2 fix-now routing tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/003-review-remediation/004-p2-triage"
    last_updated_at: "2026-07-04T14:10:01.439Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Created PENDING p2-triage tasks"
    next_safe_action: "Confirm every P2 maps to a family"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-tasks-006-004-p2-triage"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: P2 Triage

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

- [x] T001 Read all 91 P2 findings from `../../archive/review-report.md`. **SOURCE UNRECOVERABLE (verified absent 2026-07-03) — reconstructed from the G1-G15 lens grouping + findings-ledger P2 in spec.md "Reconstructed P2 → 016 Disposition" (phase 013).**
- [ ] T002 Confirm the 15 lens families cover every finding.
- [ ] T003 Note the lineage re-root and bitemporal zero-callers caveats.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Assign each P2 to exactly one family.
- [ ] T005 Mark each family fix-now or accept-as-is with a one-line reason.
- [ ] T006 Route each fix-now family to a follow-on owner.
- [ ] T007 Record why each accept-as-is family is safe to defer.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Confirm no P2 is left ungrouped.
- [ ] T009 Confirm each family has a verdict and a reason.
- [ ] T010 Confirm no fix was performed in this phase.
- [ ] T011 Run strict validation for this child folder.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`.
- [ ] No `[B]` blocked tasks remaining.
- [ ] Every fix-now family has a routed owner.
- [ ] Strict validation exits 0.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Parent**: See `../spec.md`
- **Source review**: See `../../archive/review-report.md`
<!-- /ANCHOR:cross-refs -->
