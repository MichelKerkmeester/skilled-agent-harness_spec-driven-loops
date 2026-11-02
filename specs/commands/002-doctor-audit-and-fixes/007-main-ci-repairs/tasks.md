---
title: "Tasks: Phase 7: main-ci-repairs"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "main ci repairs tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 7: main-ci-repairs

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read each failing workflow's log and rerun its command locally. Verify: the link guard prints `18 broken`, the manifest test names three added folders and the playbook validator names `REQUIRED_PROMPT` on DOC-406.
- [x] T002 Confirm every link target exists under the new packet number (`specs/sk-doc/056-create-goal-mode/`). Verify: 18 of 18 targets exist.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 [P] Repoint the two create-goal benchmark reports (`.skilled/skills/sk-doc/benchmark/reports/2026-09-26--manual-testing-playbook--create-goal*/`). Verify: `rg -c 060-create-goal-mode` on the reports folder prints nothing.
- [x] T004 [P] Refresh the manifest (`durable-directory-manifest.json`). Verify: `test_readme_manifest.py` prints `manifest=reproducible`.
- [x] T005 [P] Add the `Prompt:` line to DOC-406 and set the next free number to DOC-407 (`doctor-routing-helper-handoff.md`, `manual-testing-playbook.md`). Verify: the root playbook reports `violations=0 warnings=12`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Run the three workflow commands. Verify: `0 broken`, `all sk-doc script tests passed` (48 PASS), and `PASS package=.skilled/manual-testing-playbook ... violations=0 warnings=12`.
- [ ] T007 Read the three workflows on main after the push. Verify: each concludes `success`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
