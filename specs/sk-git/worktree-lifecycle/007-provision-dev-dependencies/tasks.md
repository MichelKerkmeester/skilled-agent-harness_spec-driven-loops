---
title: "Tasks: Provision a nested npm package even when an ancestor installed a same-named dependency"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "provision dev dependencies tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Provision a nested npm package even when an ancestor installed a same-named dependency

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

- [x] T001 Reproduce the failure (`worktree-naming.sh create provision-dev-dependencies`). Verify: it prints `4 already present, 4 failed`.
- [x] T002 Confirm the mechanism (`.skilled/node_modules/@types/node`). Verify: it exists while `system-spec-kit/node_modules/typescript` does not.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add `_wn_npm_install_root` and use it as the npm boundary (`.skilled/skills/sk-git/scripts/worktree-naming.sh`). Verify: `bash -n` exits 0.
- [x] T004 Add the nested-lockfile regression case (`.skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh`). Verify: it fails against the HEAD script.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Run the suite (`worktree-naming.test.sh`). Verify: it prints `PASS=178 FAIL=0`; against the HEAD script it prints `PASS=177 FAIL=1`.
- [x] T006 Re-provision worktree 536 (`worktree-naming.sh provision`). Verify: it prints `0 failed`.
- [x] T007 Compare shellcheck warnings (`shellcheck -S warning`). Verify: 2 at HEAD and 2 after.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
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
