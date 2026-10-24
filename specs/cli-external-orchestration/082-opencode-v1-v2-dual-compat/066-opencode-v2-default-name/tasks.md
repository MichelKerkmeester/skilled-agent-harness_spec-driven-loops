---
title: "Tasks: Phase 66: opencode-v2-default-name"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "opencode v2 default name tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 66: opencode-v2-default-name

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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Back up both earlier names and `opencode.db` with its WAL and SHM (`~/.local/share/opencode/pre-v2-default-20261024/`)
- [x] T002 Copy `opencode.db` to `opencode-v1.db` with `sqlite3 .backup`; quick_check `ok`, 1,339 sessions
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Link `opencode` and `opencode2` to the v2 binary and write the `opencode1` launcher (`~/.local/bin/`)
- [x] T004 Rebuild `both`, `check` and the launcher text, and drop the now-unused PATH guard (`scripts/opencode-setup.sh`)
- [x] T005 Add the side-by-side layout test (`scripts/tests/opencode-setup-both.test.cjs`)
- [x] T006 Rewrite the side-by-side, launcher, verification, uninstall and troubleshooting text (`references/install-and-versions.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Live `opencode run` and `opencode1 run` each answer `OK`; session counts move in `opencode.db` and `opencode-v1.db` respectively
- [x] T008 New test passes, and fails 2 of 2 against the previous helper
- [x] T009 shellcheck clean; config-shape, battery and cli-opencode unit tests pass 87 of 87
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
