---
title: "Tasks: design-md-generator feature-catalog/ conformance"
description: "Task breakdown for auditing design-md-generator's feature-catalog/ root and 7 subdirectories."
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/004-design-md-generator/006-feature-catalog"
    last_updated_at: "2026-07-27T10:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author feature-catalog audit tasks"
    next_safe_action: "Enumerate and read all 9 feature-catalog/ files against the template"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: design-md-generator feature-catalog/ conformance

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

- [ ] T001 Read `feature-catalog-template.md` in full
- [ ] T002 Enumerate all 9 target files (root + 7 subdirectories)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 [P] Diff `feature-catalog.md` against the template; fix if confirmed
- [ ] T004 [P] Diff `cluster-classify/cluster-classify.md`; fix if confirmed
- [ ] T005 [P] Diff `extract/extract.md`; fix if confirmed
- [ ] T006 [P] Diff `feature-extractors/feature-extractors.md`; fix if confirmed
- [ ] T007 [P] Diff `interaction-capture/interaction-capture.md`; fix if confirmed
- [ ] T008 [P] Diff `procedure-cards/md-generator-procedure-card-inventory.md`; fix if confirmed
- [ ] T009 [P] Diff `report-preview/report-preview.md`; fix if confirmed
- [ ] T010 [P] Diff `validate/validate.md`; fix if confirmed
- [ ] T011 [P] Diff `write-design-md/write-design-md.md`; fix if confirmed
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 Re-diff all 9 fixed files
- [ ] T013 Run `validate.sh` for this folder
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks `[x]`
- [ ] No `[B]` blocked tasks remaining
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
