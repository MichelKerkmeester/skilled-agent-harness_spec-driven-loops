---
title: "Tasks: Doc Accuracy Remediation"
description: "PENDING task list for the changelog mislabel and doc staleness cluster fixes."
trigger_phrases:
  - "028 doc accuracy tasks"
  - "doc staleness cluster tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/006-review-remediation/003-doc-accuracy"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Created PENDING doc-accuracy tasks"
    next_safe_action: "Trace each doc claim to a commit"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-tasks-006-003-doc-accuracy"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Doc Accuracy Remediation

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

- [ ] T001 Trace the mislabeled rollup rows (009/011/017/018/020) to their commits and child summaries.
- [ ] T002 Enumerate the commits omitted by `timeline.md` and `before-vs-after.md`.
- [ ] T003 Confirm phase 001 has applied its `benchmark-status.md` re-run update.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Reclassify the Memory rollup rows, keeping phase 008 as no-code-shipped (P1-6).
- [ ] T005 [P] Refresh the `timeline.md` epochs diagram and Section E classification.
- [ ] T006 [P] Advance `before-vs-after.md` CURRENT STATE and correct release-cleanup claims.
- [ ] T007 [P] Add `SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING` and the 17 new flags to the inventories.
- [ ] T008 Reconcile the `005-release-cleanup/spec.md` phase-map and replace the zero-hash fingerprint.
- [ ] T009 Populate `changelog-028-root.md` verification, files-changed and follow-up evidence.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Confirm every status edit traces to a commit or implementation-summary.
- [ ] T011 Re-run `validate.sh 005-release-cleanup --strict` after editing the sibling spec.
- [ ] T012 Run strict validation for this child folder.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`.
- [ ] No `[B]` blocked tasks remaining.
- [ ] Every status change has commit evidence.
- [ ] Strict validation exits 0.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Parent**: See `../spec.md`
- **Source review**: See `../../review-report.md`
<!-- /ANCHOR:cross-refs -->
