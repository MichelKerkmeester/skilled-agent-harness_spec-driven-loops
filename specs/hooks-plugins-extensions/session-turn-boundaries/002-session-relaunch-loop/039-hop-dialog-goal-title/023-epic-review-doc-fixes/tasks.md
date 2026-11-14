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

- [ ] T001 Confirm phases 020, 021 and 022 landed (`PKT`). Verify: `rg -n '^\| \*\*Status\*\* \| (Complete|In Progress)' PKT/020-question-guard-killer-gone/spec.md PKT/021-goal-scan-large-log/spec.md PKT/022-stop-park-notices/spec.md` prints three lines, and each child's fix commit named in its `goal.md` is an ancestor of `HEAD`.
- [ ] T002 Save a baseline of the four sk-doc checks and the mirror check before any edit (`PHASE/scratch/baseline.txt`). Verify: the commands of T018 and T019 run once with their output and exit status saved.
- [ ] T003 Re-read the lines the new text will cite: the armable guard, the generated title fallback, the missing-transcript notice and the spawn-failure test (`.skilled/hooks/session-relaunch`). Verify: the line numbers and the commit they were read at are written into `goal.md` section 4 and `PHASE/scratch/citations.txt`.

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Correct the `stop-arm.mjs` sentence in the Claude adapter README to say a spawn failure leaves the record armed and the next Stop re-arms it (`.skilled/hooks/session-relaunch/claude/README.md`). Verify: `rg -c 'A spawn failure leaves the record pending for the next Stop' .skilled/hooks/session-relaunch/claude/README.md` prints nothing with exit 1.
- [ ] T005 Add one catalog sentence on the question dialog guard in Nudge Prepare And Arm and one on the generated title carry in Killer And Wrapper (`FC`). Verify: `rg -c 'AskUserQuestion' FC` and `rg -c 'generatedName' FC` each print 1 or more.
- [ ] T006 Add `#### HS-9 One real hop checks the question guard, the packet goal and the generated title (Operator-run)` after HS-8, with the six steps, the evidence list and the PASS and FAIL lines from `plan.md` (`PB`). Verify: `rg -c 'operator-run' PB` and `rg -c 'AskUserQuestion' PB` each print 1 or more.
- [ ] T007 Add `generatedName: string` to the `@returns` shape at `lib/relaunch-core.cjs:800` (`.skilled/hooks/session-relaunch/lib/relaunch-core.cjs`). Verify: `rg -c '@returns \{\{model: string, effort: string, name: string\}\}' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` prints nothing with exit 1 and `node --check .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` exits 0.
- [ ] T008 Add a dated note to line 129 of the child 001 summary that names the throwing-read test phase 020 adds, and a dated note to line 131 that says a stamped parked record is withdrawn by the next prompt (`PKT/001-sender-dialog-after-prepare/implementation-summary.md`). Verify: `rg -c '2026-11' PKT/001-sender-dialog-after-prepare/implementation-summary.md` prints 2 or more.
- [ ] T009 Add `PKT/002-packet-goal-fallback/decision-record.md` with ADR-001, following the shape of `002-session-relaunch-loop/028-goal-rebind-live-proof-and-docs/decision-record.md`, set 002 AC-003 to `Superseded` with `ADR-001` in its Waiver cell, add a dated note that no saved run can prove the old rule, and change the closure statement to accept one superseded row (`PKT/002-packet-goal-fallback/acceptance-criteria.md`). Verify: `rg -c 'ADR-001' PKT/002-packet-goal-fallback/decision-record.md PKT/002-packet-goal-fallback/acceptance-criteria.md` prints 1 or more for each.

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Run the three suites on the final tree and save each output (`PHASE/scratch/final-suite.txt`, `PHASE/scratch/goal-suite.txt`, `PHASE/scratch/pi-suite.txt`). Verify: `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0, `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/goal/**/*.test.cjs .skilled/hooks/goal/**/*.test.mjs` exits 0, and `npx vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/session-relaunch/pi/session-relaunch.test.ts` exits 0. Each saved file holds its `tests`, `pass` and `fail` line and the exit status.
- [ ] T011 Append a dated note to 001 AC-005 that names `PHASE/scratch/final-suite.txt`, the tests, pass and fail counts it holds, and the test `subagent-guard lets a question dialog through when the record read throws`, and that says the earlier sentence about no test is no longer true (`PKT/001-sender-dialog-after-prepare/acceptance-criteria.md`). Verify: the row names all of them and keeps `Met`.
- [ ] T012 Append a dated note to 002 AC-007 that names `PHASE/scratch/final-suite.txt` and the tests, pass and fail counts it holds (`PKT/002-packet-goal-fallback/acceptance-criteria.md`). Verify: the row names the file and keeps `Met`.
- [ ] T013 Append a dated note to 003 AC-006 that names `PHASE/scratch/final-suite.txt`, `PHASE/scratch/goal-suite.txt` and `PHASE/scratch/pi-suite.txt` and the counts each holds (`PKT/003-generated-title-carry/acceptance-criteria.md`). Verify: the row names all three and keeps `Met`.
- [ ] T014 Append a dated note to 005 AC-007 that names `PHASE/scratch/final-suite.txt` and the tests, pass and fail counts it holds (`PKT/005-parked-record-escape/acceptance-criteria.md`). Verify: the row names the file and keeps `Met`.
- [ ] T015 Append a dated note to 007 AC-004 that names `PHASE/scratch/final-suite.txt` and the tests, pass and fail counts it holds (`PKT/007-killer-test-margin/acceptance-criteria.md`). Verify: the row names the file and keeps `Met`.
- [ ] T016 Append a dated note to 011 AC-004 that names `PHASE/scratch/final-suite.txt` and the tests, pass and fail counts it holds and keeps the historical count (`PKT/011-goal-fallback-bound/acceptance-criteria.md`). Verify: the row names the file and keeps `Met`.
- [ ] T017 Re-derive the metadata of every folder this phase edited (`PKT`, `PHASE`). Verify: `node .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs --folder <folder> --apply` runs for `001`, `002`, `003`, `005`, `007`, `011` and `023`, and each prints `failed=0`.
- [ ] T018 Run sk-doc's playbook and catalog checks (`.skilled/skills/system-spec-kit`). Verify: `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/skills/system-spec-kit/manual-testing-playbook`, `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --strict`, `python3 .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py` and `python3 .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/tests/test_validator_fixtures.py` each exit 0, or fail only as the baseline in `PHASE/scratch/baseline.txt` did.
- [ ] T019 Run the runtime mirror check after the edits (`.skilled/hooks/session-relaunch`). Verify: `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check` prints `PASS` and exits 0.
- [ ] T020 Validate every edited folder (`PKT`, `PHASE`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <folder> --strict` prints `RESULT: PASSED` for `001`, `002`, `003`, `005`, `007`, `011` and `023`, saved to `PHASE/scratch/validate-folders.txt`.
- [ ] T021 Validate the whole packet (`PKT`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title --recursive --strict` prints `RESULT: PASSED` for every folder and never `RESULT: FAILED`, saved to `PHASE/scratch/validate-recursive.txt`.
- [ ] T022 Check each new sentence against the line or test it names (`PB`, `FC`). Verify: every cited `file:line` in the diff resolves to the text it describes on the current tree, and the list is saved to `PHASE/scratch/citations.txt`.
- [ ] T023 Check the commit scope (`FIX`). Verify: `git show --name-status FIX` lists Markdown, the one comment line in `relaunch-core.cjs`, the derived `graph-metadata.json` files and the scratch files, and no test file and no adapter file.
- [ ] T024 Validate the phase folder from the final state (`PHASE`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/023-epic-review-doc-fixes --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] Every task is resolved: T001 to T024 are complete, and T023 ran against the fix commit.
- [ ] No `[B]` blocked tasks remaining: no task is blocked.
- [ ] Manual verification passed: the four sk-doc checks and the mirror check exit 0, and the three saved suite runs name every row they prove.
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

- [ ] CHK-001 [P0] Requirements documented in spec.md: `rg -c '^\| REQ-' spec.md` prints 7.
- [ ] CHK-002 [P0] Technical approach defined in plan.md: `rg -c '^## 3. ARCHITECTURE' plan.md` prints 1.
- [ ] CHK-003 [P1] The validator baselines exist before the first edit, and the three suite runs happen after the last document edit (T002, T010).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] No code behavior changes: `git show --name-status FIX` lists one comment line in `relaunch-core.cjs` and no test or adapter file (T023).
- [ ] CHK-011 [P0] Each new sentence names a source line, a test or a saved run (T022).
- [ ] CHK-012 [P1] No sentence in the playbook or the catalog repeats another in the same document.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] AC-001 to AC-004 pass with their searches, saved to `PHASE/scratch/checks.txt`.
- [ ] CHK-021 [P0] AC-005 and AC-006 pass with the saved runs and the ADR. Every one of the seven rows names a saved file, and ADR-001 exists.
- [ ] CHK-022 [P1] sk-doc's four checks pass or match the baseline (T018).
- [ ] CHK-023 [P1] The mirror check prints `PASS` (T019).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [ ] CHK-FIX-001 [P0] The finding class is `traceability` for F3, F5, F6 and F7. Every document that explains the guard, the title or the goal field is checked.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory: `rg -l 'AskUserQuestion'` and `rg -l 'generatedName'` are saved, and `goal.md` names what each hit is.
- [ ] CHK-FIX-003 [P0] Consumer inventory: N/A, documents and one comment.
- [ ] CHK-FIX-004 [P0] N/A: no security, path, parser or redaction fix.
- [ ] CHK-FIX-005 [P1] Matrix axes listed in plan.md: behavior crossed with document.
- [ ] CHK-FIX-006 [P1] Every acceptance note names a file saved under `scratch/` and the count it holds.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to the fix commit, named in `goal.md` section 4.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secrets: no document gains a credential, a path to a credential or an environment value.
- [ ] CHK-031 [P0] No dotenv file is named or read.
- [ ] CHK-032 [P1] N/A: no auth surface.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` all name F3, F5, F6, F7 and the live-hop check.
- [ ] CHK-041 [P1] The operator-run scenario is marked in its heading and its first line (T006).
- [ ] CHK-042 [P2] The Pi and OpenCode playbook decision is recorded in `spec.md`. Result: Out of Scope and Open Questions name it.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Baselines, the three suite runs, the citation list and the validation logs live under `scratch/` only.
- [ ] CHK-051 [P1] No temporary file is left outside `scratch/`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 11 | 0/11 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Pending. The builder records each observed run here and cites the scratch file.
<!-- /ANCHOR:summary -->

---
