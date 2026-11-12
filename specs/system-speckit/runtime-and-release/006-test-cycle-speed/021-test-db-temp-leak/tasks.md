---
title: "Tasks: Phase 21: test-db-temp-leak"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "test db temp leak tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 21: test-db-temp-leak

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


- [x] T001 Mark each scratch folder with its test file and run both lanes (`.skilled/skills/system-spec-kit/runtime/tests/_support/vitest-setup.ts`). Verify: the leftover folders name their files. Evidence: six files, three per lane, listed in spec.md under Measured Behavior. The marker was removed afterwards.
- [x] T002 Confirm the cause on two of the files (`.skilled/skills/system-spec-kit/runtime/tests/copilot-compact-cycle.vitest.ts`). Verify: a run of two skipped files adds two folders. Evidence: `2 skipped`, 3,352 before and 3,354 after.

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation


- [x] T003 Add the run-level setup (`.skilled/skills/system-spec-kit/runtime/tests/_support/vitest-global-setup.ts`). Verify: `npx tsc --noEmit -p .` in the runtime folder prints nothing.
- [x] T004 Create the scratch folder inside the root (`.skilled/skills/system-spec-kit/runtime/tests/_support/vitest-setup.ts`). Verify: `grep -c 'SPECKIT_TEST_DB_ROOT' .skilled/skills/system-spec-kit/runtime/tests/_support/vitest-setup.ts` prints 1.
- [x] T005 Register the run-level setup (`.skilled/skills/system-spec-kit/runtime/vitest.config.ts`, `.skilled/skills/system-spec-kit/vitest.config.ts`). Verify: `grep -c 'vitest-global-setup.ts'` prints 1 for the runtime config and 2 for the package config.

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification


- [x] T006 Run the six files that leaked (`.skilled/skills/system-spec-kit/runtime/cli/tests/graph-aware-stop.vitest.ts`). Verify: the folder count is unchanged. Evidence: 3,360 before and 3,360 after.
- [x] T007 Run the whole suite from the final state (`.skilled/skills/system-spec-kit/runtime/package.json`). Verify: `npm test` exits 0 and no `speckit-test-db` entry is newer than the start stamp. Evidence: exit 0, 0 new entries. Runtime lane 126 files passed and 3 skipped, CLI lane 206 passed and 3 skipped.
- [x] T008 List the new file in the support README (`.skilled/skills/system-spec-kit/runtime/tests/_support/README.md`). Verify: `grep -c 'vitest-global-setup.ts' .skilled/skills/system-spec-kit/runtime/tests/_support/README.md` prints 2.
- [x] T009 Push the branch and read the checks on the runner (`.github/workflows/spec-kit-check.yml`). Verify: `gh pr checks` shows every check passing. Evidence: pull request 102, 37 checks pass, 0 fail and 2 Dependabot jobs skip, after one rerun. The first attempt of `OpenCode plugin and hook node:test suites` was cancelled at its 10 minute limit because the checkout step took 8 min 39 s.

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
