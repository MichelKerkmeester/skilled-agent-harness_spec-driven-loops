---
title: "Tasks: Stop the sk-git pathspec advisory and the completion-evidence sentinel from raising false alarms"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Stop the sk-git pathspec advisory and the completion-evidence sentinel from raising false alarms

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

- [x] T001 Create the worktree from main at d4ffc18aca and scaffold this phase under the v4 parent (.worktrees/065-fix-advisory-false-alarms)
- [x] T002 Reproduce both false alarms with a scratch script against the unmodified modules. Keep the sentinel's own advisory log as evidence (.skilled/skills/sk-git/scripts/lib/git-rule-checks.mjs, .skilled/skills/system-spec-kit/runtime/lib/hooks/completion-evidence-sentinel.cjs)
- [x] T003 Capture the baselines: sk-git check suite 25 of 25, sentinel suite 23 of 23 (.skilled/skills/sk-git/scripts/lib/git-rule-checks.test.mjs, .skilled/skills/system-spec-kit/runtime/tests/completion-evidence-sentinel.vitest.ts)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Return `pathsResolved` from `parseGitCommand` and keep the two "nothing matched" checks silent when it is false (.skilled/skills/sk-git/scripts/lib/git-rule-checks.mjs)
- [x] T005 [P] Trim a line suffix and a trailing file name in `resolveSpecFolderFromText` (.skilled/skills/system-spec-kit/runtime/lib/hooks/completion-evidence-sentinel.cjs)
- [x] T006 [P] Add the shell-expansion pathspec test (.skilled/skills/sk-git/scripts/lib/git-rule-checks.test.mjs)
- [x] T007 [P] Add the cited-document folder test (.skilled/skills/system-spec-kit/runtime/tests/completion-evidence-sentinel.vitest.ts)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Negative control: with the old sources swapped back in, each new test fails and every other test passes. The new sources were restored byte-identical
- [x] T009 Both sk-git test files pass 33 of 33 and the sentinel suite passes 24 of 24
- [x] T010 The completion-evidence stop-hook suite, the other test file that imports the sentinel, passes 7 of 7
- [x] T011 Fast-forward onto main at 83ee20d219, which had taken phases 051 to 053. Set the first scaffold aside, rebuild and scaffold this phase again as 055-advisory-false-alarms (specs/system-speckit/033-system-speckit-v4/055-advisory-false-alarms)
- [x] T012 Full spec-kit root project: PASS: 1294 of 1307 tests in 109 files passed on the merged tree with 13 skipped and none failed. An earlier run on the original base under the runtime config reported 7 failed tests in 4 files. Three of those files failed only because a fresh worktree lacks their build outputs. The fourth, the Pi spec-gate suite, fails only under that config because the path alias it needs is defined in the root config alone. It passes 9 of 9 under the root config
- [x] T013 The scratch replay is silent for every expansion form, still flags `git reset --hard $REF` on a tree with changes and resolves the cited document to its folder, on the original base and again on the merged tree
- [x] T014 Comment hygiene exits 0 on all four edited files and strict packet validation passes
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: the scratch replay of the original commands and reply text (T013)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
