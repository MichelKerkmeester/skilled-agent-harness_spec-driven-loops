---
title: "Tasks: Phase 6: codex-check-and-advisory-fixes"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "codex check and advisory fixes tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 6: codex-check-and-advisory-fixes

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation
<!-- FILL: Keep the prefix table and add the two shell variables this task list uses. GOOD: `R` is `scripts/rotate-logs.sh`. `A` is `logs/archive/`. WEAK: Variables are defined below. -->

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`I` is `.skilled/bin/install-codex-hooks.mjs`. `A` is `.skilled/skills/system-spec-kit/runtime/hooks`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [x] T001 Confirm the Pi and DSH OK-line warning by running both real adapters against the primary checkout (`$A/pi`, `$A/dsh`). Verify: the probes print the `OK` line as a Pi warning and a DSH notice. Evidence: recorded in `spec.md` Measured Behavior.
- [x] T002 Record the spec-kit Vitest baselines with the alias, using the spec-kit's own Vitest 4.1.12 (`.skilled/skills/system-spec-kit`). Verify: each run prints its file and test counts. Evidence: runtime 1484 passed and root 4074 passed, 13 and 33 skipped.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [x] T003 Add a linked-worktree test, see it fail, then pass `--check` through the guard (`$I`, `.skilled/bin/tests/install-codex-hooks-source-root.test.cjs`). Verify: the test fails before the fix and `node --test .skilled/bin/tests/install-codex-hooks-*.test.cjs` prints `fail 0` after it. Evidence: before, the check was refused; after, 20 of 20 pass.
- [x] T004 Mark the Codex check `quietOnSuccess` on DSH and test it through the real runner (`$A/dsh/session-start-advisories.mjs`, `dsh-session-lifecycle.test.mjs`). Verify: the new test fails on the old adapter and the suite passes on the new one. Evidence: old 0 of 1, new 13 of 13.
- [x] T005 Mark the Codex check `quietOnSuccess` on Pi and add its test (`$A/pi/session-start-advisories.ts`, `pi-session-start-advisories.test.ts`). Verify: one test fails on the old adapter and all pass on the new one. Evidence: old 1 failed and 2 passed, new 3 of 3.
- [x] T006 Update the docs and the watchdog comment that described the old behavior (`codex-global-hooks-check/README.md`, `session-lifecycle/README.md`, `session-lifecycle/tests/README.md`, `.opencode/plugins/codex-hooks-watchdog.js`). Verify: `validate_document.py` prints `VALID`, `hvr_scan.py` prints `hard blockers: 0` and both README checkers pass on each README. Evidence: all three READMEs pass all four.
- [x] T007 Remove the alias from both spec-kit Vitest configs if the counts match (`.skilled/skills/system-spec-kit/vitest.config.ts`, `runtime/vitest.config.ts`). Verify: each suite prints the same counts with and without the alias. Evidence: runtime 1484 and root 4074 passed both ways; on the final configs runtime 1485 and root 4075 passed with 0 failed.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [x] T008 Rerun the live installer check and both advisory probes. Verify: `--check` in this worktree prints `OK` with exit 0, a write still refuses, and the probes print `DSH injected: []` and `Pi notified: []`. Evidence: all four as expected, in the primary checkout and the worktree.
- [x] T009 Rerun the hook suites and both sync checks (`.skilled/hooks`). Verify: 0 failures and two PASS lines. Evidence: `node --test` 1892 of 1892, Vitest 506 of 506 in 10 files, both syncs PASS.
- [x] T010 Run strict validation on this packet (`spec.md`). Verify: `validate.sh --recursive --strict` prints `RESULT: PASSED`. Evidence: see the recursive run on the parent.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
