---
title: "Tasks: Phase 30: nested-worktree-battery"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "nested worktree battery tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 30: nested-worktree-battery

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

- [x] T001 Create worktree 169 from `origin/main` at `97c9a1105f` and provision it (11 installed, 5 built, 0 failed). Item 7.
- [x] T002 Baseline: the battery fails v2 plugin-active in worktree 169 (`scratch/rootcause/base-v2.json`), v1 passes there, and the test suite passes 37 of 37 (`scratch/mutation/baseline.txt`). Item 7.
- [x] T003 Root cause: the private server's read shows 17 outer plugins active and 17 worktree plugins failed with `Duplicate plugin ID`; a plain clone passes; the OpenCode 2 source walks every ancestor with no stop (`scratch/rootcause/summary.txt`). Item 7.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add `ancestorPluginDirs` and `v2ServerEnv`, use them in `readV2`, and return `shadowing` (`.skilled/commands/doctor/scripts/opencode-version-battery.cjs`). Item 7.
- [x] T005 Put an `isolated:` line per ancestor folder first in the plugin-active details (`.skilled/commands/doctor/scripts/opencode-version-battery.cjs`). Item 7.
- [x] T006 Make the fake server behave like OpenCode 2 under an outer checkout; add three nested tests and the plain-root assertions (`.skilled/commands/doctor/scripts/tests/opencode-version-battery.test.cjs`). Item 7.
- [x] T006a Resolve a symlinked root to its real path and walk nothing from the filesystem root; keep the tests off the caller's switches; make the fake server's skill and command answers depend on the config selection; cover caller switches (round-1 review). Item 7.
- [x] T006b Fail an isolated read that still carries ancestor plugin entries or ancestor-only commands, with a fake server that ignores the switches (round-2 review). Item 7.
- [x] T006c Build an isolated read's command allowlist from the root's own `.opencode`, not the caller's config folder; record OpenCode 1's origins in the worktree (round-3 and round-4 reviews). Item 7.
- [x] T007 [P] Add the battery sentence and the known limit (`.opencode/plugins/ARCHITECTURE.md`). Item 7.
- [x] T008 [P] Add the troubleshooting entry (`.skilled/skills/sk-git/references/worktree-workflows.md`). Item 7.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 The test suite passes 45 of 45 (`after-r4.txt`; 37 at baseline). The old battery fails 6 of the new tests (`m1-old-battery-r1.txt`); mutants m2 to m8 fail 2, 2, 2, 1, 1, 2 and 1 tests (`scratch/mutation/`). Item 7.
- [x] T010 The battery passes both families in worktree 169, v2 with an `isolated:` line, and both families in a plain clone with none (`scratch/rootcause/after-r4-both.json`, `after-r2-plain-both.json`). Item 7.
- [x] T011 Luna review passes: round 5 PASS after four FAIL rounds, each finding fixed; one P2 recorded as a follow-up. Item 7.
- [x] T012 Strict validation of this folder and recursive validation of 082 print `RESULT: PASSED`: 31 folders passed, 0 failed, after both merges of main. Item 7.
- [x] T013 The Dual-Version Battery passes on CI at main `c492e020ff` (run 39432681929: v1, v2 and both-versions jobs all success). Item 7.
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
