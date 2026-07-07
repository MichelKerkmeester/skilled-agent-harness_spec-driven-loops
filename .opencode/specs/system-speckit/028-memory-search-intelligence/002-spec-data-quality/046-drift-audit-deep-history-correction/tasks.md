---
title: "Tasks: Drift Audit Deep History Correction"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "028 pass 2 tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/002-spec-data-quality/046-drift-audit-deep-history-correction"
    last_updated_at: "2026-07-04T17:11:46.692Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Enumerated 5 correction items + verify + wrap-up"
    next_safe_action: "Dispatch T003-T007"
    blockers: []
    key_files: ["tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-01-028-deep-history-correction"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Drift Audit Deep History Correction

<!-- SPECKIT_LEVEL: 2 -->
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

- [x] T001 Carry pass-1 fixes into the isolated worktree
- [x] T002 Scaffold this spec folder
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Correct all 5 items, then independently verify each.

- [ ] T003 Correct summary-fusion lane docs (`001-speckit-memory/015-summary-fusion-grounding/{spec.md,implementation-summary.md,checklist.md}`) - Recall@20 -0.036, guessed-weight caveat
- [ ] T004 Correct seeded-PPR docs with forward-pointer (`002-code-graph/005-seeded-ppr-ranking/{spec.md,implementation-summary.md,plan.md,decision-record.md}` + `005-dark-flag-graduation/005-codegraph-seeded-ppr/benchmark-results.md`) - exact 0.0000-delta numbers + pointer to 010 revisit work
- [ ] T005 Fix C4 shadow-weight promoter "never committed" claim (`system-skill-advisor/002-skill-advisor-runtime/004-c4-shadow-seam-beta-posterior/{decision-record.md,implementation-summary.md,plan.md}`) - built `10c5b61493`, deleted `8efcde0e6b`
- [ ] T006 Fix outcome-weighted ranking pass-1 error + dangling link (`system-skill-advisor/002-skill-advisor-runtime/007-outcome-weighted-ranking-followon/{implementation-summary.md,plan.md,spec.md,decision-record.md,checklist.md}`) - built `03d0b01eb6`/`09626fc921`, deleted `8efcde0e6b`, MRR delta vs noise numbers
- [ ] T007 Add pointer note in prior pass's own docs (`045-drift-audit-remediation/{spec.md,implementation-summary.md}`) - acknowledge pass 2

- [ ] T008 [P] Verify T003 correction (GPT-5.5-fast read-back)
- [ ] T009 [P] Verify T004 correction (GPT-5.5-fast read-back)
- [ ] T010 [P] Verify T005 correction (GPT-5.5-fast read-back)
- [ ] T011 [P] Verify T006 correction (GPT-5.5-fast read-back)
- [ ] T012 [P] Verify T007 correction (GPT-5.5-fast read-back)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T013 Sync corrected files to live tree as uncommitted diffs
- [ ] T014 Update this folder's checklist.md and implementation-summary.md
- [ ] T015 Run `validate.sh 046-drift-audit-deep-history-correction --strict`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All 15 tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Live-tree diff reviewed by operator
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
