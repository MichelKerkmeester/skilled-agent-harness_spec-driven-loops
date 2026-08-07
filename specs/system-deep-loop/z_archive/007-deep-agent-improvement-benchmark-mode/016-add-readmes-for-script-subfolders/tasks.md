---
title: "Tasks: Phase 16: script-subfolder-readmes"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "script subfolder readmes tasks"
  - "code folder readme tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/007-deep-agent-improvement-benchmark-mode/016-add-readmes-for-script-subfolders"
    last_updated_at: "2026-05-29T13:30:00Z"
    last_updated_by: "setup-agent"
    recent_action: "Authored Level 2 task list for subfolder READMEs"
    next_safe_action: "Build: write 7 new READMEs and audit 3 existing"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "setup-121-016"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 16: script-subfolder-readmes

<!-- SPECKIT_LEVEL: 2 -->

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

- [x] T001 Confirm 7 target subfolders + 3 audit targets from on-disk tree
- [x] T002 Read sk-doc code-folder template
- [x] T003 Read script headers in every target folder
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 [P] Write shared README (scripts/shared/README.md)
- [ ] T005 [P] Write Lane A README (scripts/agent-improvement/README.md)
- [ ] T006 [P] Write Lane B README (scripts/model-benchmark/README.md)
- [ ] T007 [P] Write scorer README (scripts/model-benchmark/scorer/README.md)
- [ ] T008 [P] Write deterministic README (scripts/model-benchmark/scorer/deterministic/README.md)
- [ ] T009 [P] Write grader README (scripts/model-benchmark/scorer/grader/README.md)
- [ ] T010 [P] Write scorer lib README (scripts/model-benchmark/scorer/lib/README.md)
- [ ] T011 Audit + align scripts/README.md, lib/README.md, tests/README.md
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 Accuracy review each README against its folder contents
- [ ] T013 HVR sweep: no em-dashes, no semicolon characters in prose, no banned phrases, no phase IDs
- [ ] T014 Run validate.sh --strict until PASSED and mark checklist evidence
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] validate.sh --strict PASSED
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
