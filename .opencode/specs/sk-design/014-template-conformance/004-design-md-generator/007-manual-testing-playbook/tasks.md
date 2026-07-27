---
title: "Tasks: design-md-generator manual-testing-playbook/ conformance"
description: "Task breakdown for auditing design-md-generator's 18-file manual-testing-playbook/ tree."
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/004-design-md-generator/007-manual-testing-playbook"
    last_updated_at: "2026-07-27T10:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author manual-testing-playbook audit tasks"
    next_safe_action: "Enumerate and read all 18 playbook files against the template"
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
# Tasks: design-md-generator manual-testing-playbook/ conformance

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

- [ ] T001 Read `manual-testing-playbook-template.md` in full
- [ ] T002 Enumerate all 18 target files by full path
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 [P] Diff root `manual-testing-playbook.md`; fix if confirmed
- [ ] T004 [P] Diff `accessibility/accessibility-section.md`; fix if confirmed
- [ ] T005 [P] Diff `authoring-boundary/authoring-boundary.md`; fix if confirmed
- [ ] T006 [P] Diff `cluster/oklch-clustering.md`; fix if confirmed
- [ ] T007 [P] Diff `dark-mode/dark-mode-gate.md`; fix if confirmed
- [ ] T008 [P] Diff `detectors/framework-icon-motion-detection.md`; fix if confirmed
- [ ] T009 [P] Diff `escalation/anti-bot-escalation.md`; fix if confirmed
- [ ] T010 [P] Diff `extract/live-extraction.md`; fix if confirmed
- [ ] T011 [P] Diff `fidelity/verbatim-value-fidelity.md`; fix if confirmed
- [ ] T012 [P] Diff `guided-run/guided-run-smoke-lane.md`; fix if confirmed
- [ ] T013 [P] Diff `interaction/interaction-state-matrix.md`; fix if confirmed
- [ ] T014 [P] Diff all 3 `procedure-card-contract/*.md` files; fix if confirmed
- [ ] T015 [P] Diff `report/report-generation.md`; fix if confirmed
- [ ] T016 [P] Diff `setup/tool-readiness.md`; fix if confirmed
- [ ] T017 [P] Diff `source-of-truth/source-of-truth-card.md`; fix if confirmed
- [ ] T018 [P] Diff `study/editorial-exemplar-study.md`; fix if confirmed
- [ ] T019 [P] Diff `validate/phantom-hex-detection.md`; fix if confirmed
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T020 Re-diff all 18 fixed files
- [ ] T021 Run `validate.sh` for this folder
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] All 18 files accounted for
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
