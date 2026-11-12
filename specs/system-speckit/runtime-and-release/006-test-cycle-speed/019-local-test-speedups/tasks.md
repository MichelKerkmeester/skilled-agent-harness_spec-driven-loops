---
title: "Tasks: Phase 19: local-test-speedups"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "local test speedups tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 19: local-test-speedups

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


- [x] T001 Time each spec-kit lane and each deep-loop project once (`.skilled/skills/system-spec-kit/runtime/scripts/run-tests.mjs`). Verify: five commands exit 0 with walls 374, 211, 82, 240 and 257 s. Evidence: spec.md, Measured Behavior.
- [x] T002 Find what holds the runtime lane open (`.skilled/skills/system-spec-kit/runtime/tests/validation-exit-honesty.vitest.ts`). Verify: the JSON reporter shows that file's first test starting at 370 s while 127 of 129 files ended by 60 s.
- [x] T003 Time one deep-loop file with and without fsync (`.skilled/skills/system-deep-loop/runtime/tests/unit/claim-continuity.vitest.ts`). Verify: 72.34 s with fsync and 5.79 s with the two functions replaced by no-ops.

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation


- [x] T004 Point the import-time probe at a fresh empty folder and remove it afterwards (`.skilled/skills/system-spec-kit/runtime/tests/validation-exit-honesty.vitest.ts`). Verify: `npx vitest run tests/validation-exit-honesty.vitest.ts` prints `6 passed`. Evidence: 6 passed in 5.03 s.
- [x] T005 Add the preload that replaces `fsyncSync` and `fdatasyncSync` (`.skilled/skills/system-deep-loop/runtime/tests/_support/skip-fsync-preload.cjs`). Verify: `node --check` on the file exits 0.
- [x] T006 Add the setup file that loads the preload and passes it to child processes through `NODE_OPTIONS` (`.skilled/skills/system-deep-loop/runtime/tests/_support/skip-fsync.ts`). Verify: the parallel project runs in under 60 s. Evidence: 39 s, 161 files passed.
- [x] T007 Register the setup file (`.skilled/skills/system-deep-loop/runtime/vitest.config.ts`). Verify: `rg -c 'skip-fsync.ts' .skilled/skills/system-deep-loop/runtime/vitest.config.ts` prints 1.
- [x] T008 Run the three spec-kit lanes side by side three times before changing the runner (`.skilled/skills/system-spec-kit/runtime/package.json`). Verify: nine exit codes are 0. Evidence: walls 250, 247 and 256 s, all nine exit codes 0.
- [x] T009 Start the three lanes together in the runner, each under its own bound, and print each lane's output as one block (`.skilled/skills/system-spec-kit/runtime/scripts/run-tests.mjs`). Verify: `npm test` exits 0. Evidence: exit 0 in 256 s.

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification


- [x] T010 Run the spec-kit runtime lane with the probe fix (`.skilled/skills/system-spec-kit/runtime/vitest.config.ts`). Verify: `npx vitest run` ends in under 200 s. Evidence: 164 s against 374 s.
- [x] T011 Run the whole deep-loop suite from the final state (`.skilled/skills/system-deep-loop/runtime/package.json`). Verify: `npm test` exits 0. Evidence: exit 0 in 225 s against 497 s, 173 files and 2,885 tests passed with 8 skipped.
- [x] T012 Prove a timed-out lane still fails the run (`.skilled/skills/system-spec-kit/runtime/scripts/run-tests.mjs`). Verify: `SPECKIT_TEST_RUN_TIMEOUT_MS=3000 node scripts/run-tests.mjs` exits 124. Evidence: exit 124 in 3 s, and each of the three lanes printed `invocation exceeded 3000ms`.
- [x] T013 Update the documents that describe the runner and the deep-loop test setup (`.skilled/skills/system-spec-kit/runtime/README.md`). Verify: `rg -c 'starts the core, cli and spec-validation lanes together' .skilled/skills/system-spec-kit/runtime/README.md .skilled/skills/system-spec-kit/runtime/scripts/README.md` prints 1 for each, and `rg -c 'skip-fsync.ts' .skilled/skills/system-deep-loop/runtime/tests/README.md` prints 1.
- [x] T014 Push the branch and read the deep-loop job on the runner (`.github/workflows/deep-loop-runtime.yml`). Verify: `gh pr checks` shows every check passing. Evidence: pull request 100, 37 checks pass and 0 fail. The deep-loop test step took 354 s on run 43295604123 against 306 s and 370 s on two earlier `main` runs, so the skip saves nothing on the runner.

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



