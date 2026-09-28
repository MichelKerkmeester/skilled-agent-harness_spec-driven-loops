---
title: "Tasks: Root docs and git hook disclosure"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "root docs git hook tasks"
  - "git hook bypass line tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Root docs and git hook disclosure

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

- [x] T001 Confirm the stale claims: the project name and the clone URL (`CONTRIBUTING.md`). The README's `CLAUDE.md` line was already fixed in `003dabe08d` (`README.md`)
- [x] T002 Read each hook's block paths and list the seven that name no way through (`.skilled/scripts/git-hooks/commit-msg`, `.skilled/scripts/git-hooks/pre-commit`)
- [x] T003 Capture the suite baselines: commit-msg 17 of 17, pre-commit 50 of 50
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P] Add a test case per missing bypass line and watch each fail against the current hooks (`.skilled/scripts/git-hooks/tests/commit-msg.test.sh`, `.skilled/scripts/git-hooks/tests/pre-commit.test.sh`)
- [x] T005 Add the bypass line to the two early commit-msg blocks (`.skilled/scripts/git-hooks/commit-msg`)
- [x] T006 Add the bypass line to the comment hygiene and mirror parity blocks, and the whole-chain switch to both agent mirror blocks (`.skilled/scripts/git-hooks/pre-commit`)
- [x] T007 [P] Rename the project, fix the clone URL, state the enforced commit rules and link the README's Git Hooks section (`CONTRIBUTING.md`)
- [x] T008 [P] Add the header on where switches are read and complete the git hook bypass list (`.env.example`)
- [x] T009 Add the Git Hooks subsection to Quick Start and the Off Switches subsection to Configuration (`README.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run both suites: commit-msg 19 of 19 and pre-commit 55 of 55. The same suites against the HEAD hooks fail exactly the seven new checks
- [x] T011 Check each README claim against the hook source: the install trigger in every runtime's session start, the 100-file deletion ceiling, the four-file body rule and what `--uninstall` removes
- [x] T012 Run `validate_document.py` on `README.md` and `CONTRIBUTING.md` beside their HEAD versions (no new issue), and `hvr_scan.py` on the added lines (0 hard blockers)
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
