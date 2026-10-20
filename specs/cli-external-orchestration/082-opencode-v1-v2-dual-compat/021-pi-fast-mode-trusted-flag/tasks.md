---
title: "Tasks: Phase 21: pi-fast-mode-trusted-flag"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "pi fast mode trusted flag tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 21: pi-fast-mode-trusted-flag

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

- [x] T001 Record the four fix rows this phase closes with their sources (`../014-post-merge-deep-research/research/research.md`) Done: row 1 (P1, missing `--fast` in the trusted main checkout), row 19 (P2, unverified test count), row 21 (P2, Pi keeps pre-trust listeners) and row 22 (P2, wrong conflict model in the comment) each carry their file, line and verdict. (rows 1, 19, 21, 22)
- [x] T002 Capture the baseline test run before any edit (`scratch/mutation/baseline-vitest.txt`) Done: 7 files passed, 80 tests passed, exit 0. (row 19)
- [x] T003 Reproduce the missing flag with the help probe on the old code (`scratch/probe/probe.sh`, `scratch/probe/probe-4layout.txt`) Done: the primary plain run reports `--fast=0`, while the primary `-a` and `-na` runs and all three worktree runs report `--fast=1`, exit 0 and no conflict. (row 1)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Key the copy claim on the claiming copy's real package root (`.pi/extensions/pi-fast-mode-w-subagent-support/src/index.ts`) Done: `realRoot` resolves the package root with `realpathSync` and falls back to `path.resolve`; `claimPackage` carries `claimedBy` and stands down only when it is set and differs from the copy's own root, so copies at one real path both register. (row 1)
- [x] T005 Add the test "lets two copies at one real path both register" (`.pi/extensions/pi-fast-mode-w-subagent-support/tests/extension.test.ts`) Done: a real package directory and a symlink to it load on one fake bus, and both copies register a `fast` flag of type boolean. (row 1)
- [x] T006 Correct the comment above `claimPackage` (`.pi/extensions/pi-fast-mode-w-subagent-support/src/index.ts`) Done: it now says Pi keeps every copy keyed by real path, copies at one real path collapse, a flag from two real paths is a conflict that fails a print-mode run, and the pre-trust listeners stay subscribed. (row 22)
- [x] T007 Set the README test counts from a real vitest run (`.pi/extensions/pi-fast-mode-w-subagent-support/README.md` line 124, `src/README.md` line 78, `tests/README.md` lines 21 and 53) Done: all four places say 7 files and 81 tests, replacing 80 before the new test, and the `extension.test.ts` row and the copy-claim paragraph describe the real-root rule. (row 19)
- [x] T008 Record the upstream loader issue and leave the repo alone (`../014-post-merge-deep-research/research/research.md` row 21) Done: the row says Pi's loader keeps pre-trust listeners and bus subscriptions across the trusted load in Pi 1.3.0 and names the suggested upstream fix, release the pre-trust bus subscriptions on `reload()`; no Pi source file changed. (row 21)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run the new test against the old code (`scratch/mutation/old-code-run.txt`) Done: 1 failed, 12 passed, exit 1, so the test fails for the reason it was written. (row 1)
- [x] T010 Run the new test against the new code (`scratch/mutation/new-code-run.txt`) Done: 13 passed, exit 0. (row 1)
- [x] T011 Run the full extension suite and the type check (`.pi/extensions/pi-fast-mode-w-subagent-support`) Done: 7 files and 81 tests pass, and `tsc --noEmit` exits 0. (rows 1, 19)
- [x] T012 Run the help probe over both layouts and all three flag modes (`scratch/probe/probe-4layout.txt`) Done: with a temporary `PI_CODING_AGENT_DIR`, never `~/.pi`, the new code reports `--fast=1` in all six runs (primary and worktree layouts × plain, `-a`, `-na`), no conflicts, exit 0; the old code reported `--fast=0` in the primary plain run. (row 1)
- [x] T013 Run the print-mode load in both layouts (`scratch/probe/print-after.txt`) Done: no "failed to load" and no conflict in either layout; the exit 1 is only because the temporary agent dir has no models configured. (rows 1, 22)
- [x] T014 [P] Fill this folder's records and the parent phase rows (`spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`, `../spec.md`) Done: every placeholder replaced, the phase 21 row names the trusted main checkout and the copy-claim comment, and the 020-to-021 handoff row carries 020 being on main plus the 81-test run and the six-run help probe. Evidence: this folder's four documents and `../spec.md`. (rows 1, 19, 21, 22)
- [x] T015 Run strict validation of this folder (`bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/021-pi-fast-mode-trusted-flag --strict`) Done: RESULT: PASSED. (rows 1, 19, 21, 22)
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
