---
title: "Tasks: Phase 23: epic-review-doc-fixes"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "epic review doc fixes tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 23: epic-review-doc-fixes

<!-- SPECKIT_LEVEL: 2 -->

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

**Task variables**: `PB` is `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md`. `FC` is `.skilled/skills/system-spec-kit/feature-catalog/context-preservation/session-relaunch-loop.md`. `PKT` is `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title`. `PHASE` is this phase folder. `FIX` is the commit that lands this phase.

**Test environment**: run every suite as `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test <file>`, because a dispatched child marker and an inherited OpenCode database path both change how the relaunch tests behave.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm phases 020, 021 and 022 landed (`PKT`). Observed 2026-11-14: the search printed three `Status | Complete` lines, and `git merge-base --is-ancestor` confirmed `1640b29745`, `8415fb23ef` and `2638731a9d` are ancestors of `HEAD`.
- [x] T002 Save a baseline of the four sk-doc checks and the mirror check before any edit (`PHASE/scratch/baseline.txt`). Observed: all five commands exited 0, with two playbook warnings, 13 strict warnings, five note-only catalog lines, `ALL PASS` and `PASS: 256 mirrors across 10 trees are in sync.`.
- [x] T003 Re-read the lines the new text will cite: the armable guard, the generated title fallback, the missing-transcript notice and the spawn-failure test (`.skilled/hooks/session-relaunch`). Observed: each cited line was read at `2638731a9d` and listed with its current number in `PHASE/scratch/citations.txt`, which also records that the JSDoc edit moved the lines below it by one.

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Correct the `stop-arm.mjs` sentence in the Claude adapter README to say a spawn failure leaves the record armed and the next Stop re-arms it (`.skilled/hooks/session-relaunch/claude/README.md`). Observed: the old sentence printed nothing with exit 1, and the row at `:27` now says a spawn failure logs `stop-arm-error` with stage `spawn` and leaves the record armed for the next Stop to start a killer again.
- [x] T005 Add one catalog sentence on the question dialog guard in Nudge Prepare And Arm and one on the generated title carry in Killer And Wrapper (`FC`). Observed: `rg -c 'AskUserQuestion'` and `rg -c 'generatedName'` each printed 1, at `:51` and `:63`.
- [x] T006 Add `#### HS-9 One real hop checks the question guard, the packet goal and the generated title (Operator-run)` after HS-8, with the six steps, the evidence list and the PASS and FAIL lines from `plan.md` (`PB`). Observed: `rg -c 'operator-run'` and `rg -c 'AskUserQuestion'` each printed 1, at `:944` and `:946`. No run is claimed.
- [x] T007 Add `generatedName: string` to the `@returns` shape at `lib/relaunch-core.cjs:800` (`.skilled/hooks/session-relaunch/lib/relaunch-core.cjs`). Observed: the old shape printed nothing with exit 1, the new shape sits at `:866`, and `node --check` exited 0. The line had moved from 800 to 866 since the plan.
- [x] T008 Add a dated note to line 129 of the child 001 summary that names the throwing-read test phase 020 adds, and a dated note to line 131 that says a stamped parked record is withdrawn by the next prompt (`PKT/001-sender-dialog-after-prepare/implementation-summary.md`). Observed: `rg -c '2026-11'` printed 8, and each note names its phase and the behavior that changed.
- [x] T009 Add `PKT/002-packet-goal-fallback/decision-record.md` with ADR-001, following the shape of `002-session-relaunch-loop/028-goal-rebind-live-proof-and-docs/decision-record.md`, set 002 AC-003 to `Superseded` with `ADR-001` in its Waiver cell, add a dated note that no saved run can prove the old rule, and change the closure statement to accept one superseded row (`PKT/002-packet-goal-fallback/acceptance-criteria.md`). Observed: `rg -c 'ADR-001'` printed 3 in the record and 2 in the criteria, AC-003 keeps its id and its original evidence, and the closure statement accepts one superseded row.

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run the three suites on the final tree and save each output (`PHASE/scratch/final-suite.txt`, `PHASE/scratch/goal-suite.txt`, `PHASE/scratch/pi-suite.txt`). Observed, each with `env -u AI_SESSION_CHILD -u OPENCODE_DB` in front: the relaunch and OpenCode plugin suite exited 0 with tests 1555, pass 1555 and fail 0 (`scratch/final-suite.txt`), the goal suites exited 0 with tests 200, pass 200 and fail 0 (`scratch/goal-suite.txt`), and the Pi vitest run exited 0 with 62 passed of 62 (`scratch/pi-suite.txt`).
- [x] T011 Append a dated note to 001 AC-005 that names `PHASE/scratch/final-suite.txt`, the tests, pass and fail counts it holds, and the test `subagent-guard lets a question dialog through when the record read throws`, and that says the earlier sentence about no test is no longer true (`PKT/001-sender-dialog-after-prepare/acceptance-criteria.md`). Observed: the row names all of them, cites `subagent-guard.test.cjs:334`, and stays `Met`.
- [x] T012 Append a dated note to 002 AC-007 that names `PHASE/scratch/final-suite.txt` and the tests, pass and fail counts it holds (`PKT/002-packet-goal-fallback/acceptance-criteria.md`). Observed: the row names the file and the 1555 of 1555 run, and stays `Met`.
- [x] T013 Append a dated note to 003 AC-006 that names `PHASE/scratch/final-suite.txt`, `PHASE/scratch/goal-suite.txt` and `PHASE/scratch/pi-suite.txt` and the counts each holds (`PKT/003-generated-title-carry/acceptance-criteria.md`). Observed: the row names all three and the counts, and stays `Met`.
- [x] T014 Append a dated note to 005 AC-007 that names `PHASE/scratch/final-suite.txt` and the tests, pass and fail counts it holds (`PKT/005-parked-record-escape/acceptance-criteria.md`). Observed: the row names the file and the 1555 of 1555 run, and stays `Met`.
- [x] T015 Append a dated note to 007 AC-004 that names `PHASE/scratch/final-suite.txt` and the tests, pass and fail counts it holds (`PKT/007-killer-test-margin/acceptance-criteria.md`). Observed: the row names the file and the 1555 of 1555 run, and stays `Met`.
- [x] T016 Append a dated note to 011 AC-004 that names `PHASE/scratch/final-suite.txt` and the tests, pass and fail counts it holds and keeps the historical count (`PKT/011-goal-fallback-bound/acceptance-criteria.md`). Observed: the row names the file and the 1555 of 1555 run, and the 1550 of 1550 stays as the earlier count.
- [x] T017 Re-derive the metadata of every folder this phase edited (`PKT`, `PHASE`). Observed: `repair-derived.cjs --apply` ran for `001`, `002`, `003`, `005`, `007`, `011` and `023`, and each printed `inspected=1 repaired=1 failed=0`.
- [x] T018 Run sk-doc's playbook and catalog checks (`.skilled/skills/system-spec-kit`). Observed: all four commands exited 0, with the same warnings as `scratch/baseline.txt` and no new one. Saved to `scratch/verification.txt`.
- [x] T019 Run the runtime mirror check after the edits (`.skilled/hooks/session-relaunch`). Observed: `PASS: 256 mirrors across 10 trees are in sync.` and exit 0, saved to `scratch/verification.txt`.
- [x] T020 Validate every edited folder (`PKT`, `PHASE`). Observed: `RESULT: PASSED` with `Errors: 0  Warnings: 0` for `001`, `002`, `003`, `005`, `007`, `011` and `023`, saved to `PHASE/scratch/validate-folders.txt`.
- [x] T021 Validate the whole packet (`PKT`). Observed: `--recursive --strict` exited 0 with 24 folders printing `RESULT: PASSED` and none printing `RESULT: FAILED`, saved to `PHASE/scratch/validate-recursive.txt`.
- [x] T022 Check each new sentence against the line or test it names (`PB`, `FC`). Observed: every cited `file:line` printed the text it describes, with `mismatches: 0`, saved to `PHASE/scratch/citations.txt`. The check caught three engine lines the JSDoc edit had moved by one, and the list was corrected to the current numbers.
- [ ] T023 Check the commit scope (`FIX`). Not run here: the orchestrator commits, so `FIX` does not exist yet. The substitute observed on the working tree is `git status --porcelain -uall`, which lists only the allowed documents, the one JSDoc change, the derived metadata and the `scratch/` files, with no test file and no adapter file. The named check runs after the orchestrator commits.
- [x] T024 Validate the phase folder from the final state (`PHASE`). Observed: `RESULT: PASSED` with `Errors: 0  Warnings: 0` for `023-epic-review-doc-fixes`, rerun after this file and the summary were written.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Every task is resolved: T001 to T022 and T024 are complete, and T023 records the working-tree scope check with the commit-scope run left to the orchestrator, which owns the commit.
- [x] No `[B]` blocked tasks remaining: no task is blocked, and one task waits on the orchestrator's commit.
- [x] Manual verification passed: the four sk-doc checks and the mirror check exit 0, and the three saved suite runs name every row they prove.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **The guard this documents**: `../020-question-guard-killer-gone/`
- **The large-log read this documents**: `../021-goal-scan-large-log/`
- **The notices this documents**: `../022-stop-park-notices/`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

A blocked task is marked `[B]` with its reason in `goal.md`. A `[B]` on T001 blocks every implementation task, because the saved runs must cover the fixes the rows depend on.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md: `rg -c '^\| REQ-' spec.md` printed 7.
- [x] CHK-002 [P0] Technical approach defined in plan.md: `rg -c '^## 3. ARCHITECTURE' plan.md` printed 1.
- [x] CHK-003 [P1] The validator baselines exist before the first edit, and the three suite runs happen after the last document edit (T002, T010). `scratch/baseline.txt` was written before the first edit, and the three suite files were written after the last document edit.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] No code behavior changes: `git show --name-status FIX` lists one comment line in `relaunch-core.cjs` and no test or adapter file (T023). The commit does not exist yet, so the working-tree check stands in: `git status --porcelain -uall` lists no test file and no adapter file, and the only code file is `lib/relaunch-core.cjs`, whose change is the JSDoc return shape. The named check runs after the orchestrator commits.
- [x] CHK-011 [P0] Each new sentence names a source line, a test or a saved run (T022). `scratch/citations.txt` resolves every cited line with `mismatches: 0`.
- [x] CHK-012 [P1] No sentence in the playbook or the catalog repeats another in the same document. Read of both edited sections: the guard sentence names the two armable states, and the title sentence names the fallback order, so each adds a case the document did not hold.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] AC-001 to AC-004 pass with their searches, saved to `PHASE/scratch/checks.txt`.
- [x] CHK-021 [P0] AC-005 and AC-006 pass with the saved runs and the ADR. Every one of the seven rows names a saved file, and ADR-001 exists.
- [x] CHK-022 [P1] sk-doc's four checks pass or match the baseline (T018). All four exited 0 with the baseline warnings unchanged.
- [x] CHK-023 [P1] The mirror check prints `PASS` (T019). It printed `PASS: 256 mirrors across 10 trees are in sync.` with exit 0.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] The finding class is `traceability` for F3, F5, F6 and F7. Every document that explains the guard, the title or the goal field is checked. `plan.md` names the class and the four findings.
- [x] CHK-FIX-002 [P0] Same-class producer inventory: `rg -l 'AskUserQuestion'` and `rg -l 'generatedName'` are saved to `PHASE/scratch/producers.txt`, and `goal.md` names what each hit is.
- [x] CHK-FIX-003 [P0] Consumer inventory: N/A, documents and one comment.
- [x] CHK-FIX-004 [P0] N/A: no security, path, parser or redaction fix.
- [x] CHK-FIX-005 [P1] Matrix axes listed in plan.md: behavior crossed with document.
- [x] CHK-FIX-006 [P1] Every acceptance note names a file saved under `scratch/` and the count it holds. Each of the seven rows names a file and its count.
- [x] CHK-FIX-007 [P1] Evidence is pinned to the tree at `2638731a9d` and named in `goal.md` section 4. The fix commit does not exist yet and is recorded there as the orchestrator's step.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets: no document gains a credential, a path to a credential or an environment value.
- [x] CHK-031 [P0] No dotenv file is named or read.
- [x] CHK-032 [P1] N/A: no auth surface.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] The findings and the live-hop check are named across the three documents. `plan.md` and `tasks.md` name F3, F5, F6 and F7, and `spec.md` names the four findings and the live-hop check without the F labels.
- [x] CHK-041 [P1] The operator-run scenario is marked in its heading and its first line (T006). Both say operator-run at `session-relaunch-claude.md:944` and `:946`.
- [x] CHK-042 [P2] The Pi and OpenCode playbook decision is recorded in `spec.md`. Result: Out of Scope and Open Questions name it.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Baselines, the three suite runs, the citation list, the check log and the validation logs live under `scratch/` only.
- [x] CHK-051 [P1] No temporary file is left outside `scratch/`. The recursive validation wrote one temporary file under `scratch/` and removed it.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 12 | 12/12 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-14. Each observed run is recorded against its task above and cites its `scratch/` file. One item carries a substitution: the commit-scope check of T023, CHK-010 and AC-007 runs after the orchestrator commits, and the working-tree scope check stands in until then.
<!-- /ANCHOR:summary -->

---
