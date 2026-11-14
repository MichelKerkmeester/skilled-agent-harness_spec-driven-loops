---
title: "Tasks: Phase 19: relaunch-doc-coverage"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "relaunch doc coverage tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 19: relaunch-doc-coverage

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm phases 15, 16 and 17 landed (`PKT`). Verify: `rg -n '^\| \*\*Status\*\* \| Complete' PKT/015-wrapper-start-checksum/spec.md PKT/016-ended-goal-mark-match/spec.md PKT/017-missing-transcript-notice/spec.md` prints three lines, and each child's fix commit named in its `goal.md` is an ancestor of `HEAD`. Result: the search printed three lines, one per child, and `git merge-base --is-ancestor` returned 0 for `f99d3c442d`, `c37531f72b` and `78f9d39501`.
- [x] T002 Save a baseline of the four sk-doc checks and the mirror check before any edit (`PHASE/scratch/baseline.txt`). Verify: the commands of T012 and T013 run once with their output and exit status saved. Result: `scratch/baseline.txt` holds five runs, each exit 0 before the first edit; the playbook package printed `violations=0 warnings=2` and the mirror printed `PASS: 256 mirrors across 10 trees are in sync.`
- [x] T003 Re-read the lines the new text will cite: the start-checksum guard, the change notice and its log call, the missing-transcript notice, the claimed-last helper and the fallback bound (`.skilled/bin/skilled-loop`, `.skilled/hooks/session-relaunch`). Verify: the line numbers are written into `goal.md` section 4 with the commit they were read at. Result: `goal.md` section 4 names `7759159a3f` and every line, and `scratch/citations.txt` prints the text each line holds.

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Change "links" to "copies" in the HS-8 prose (`PB`). Verify: `rg -c 'The check links that helper' .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md` prints nothing with exit 1. Result: the search printed nothing with exit 1, and `rg -c 'The check copies that helper'` prints 1.
- [x] T005 Make the goal switch sentence name both fields (`.skilled/commands/speckit/handoff.md`). Verify: `rg -c 'turns the field off' .skilled/commands/speckit/handoff.md` prints nothing with exit 1, and `rg -n 'SESSION_RELAUNCH_GOAL=0' .skilled/commands/speckit/handoff.md` prints a line that names `goal_packet` and `goal_ended`. Result: the old phrase printed nothing with exit 1; line 131 reads `SESSION_RELAUNCH_GOAL=0 turns both fields off, goal_packet and goal_ended alike.`
- [x] T006 Extend the playbook evidence: the Wrapper edge cases name the change notice, the `wrapper-changed` line, the unreadable-at-hop case and the empty-at-start case, GR-3 names the ended-goal cases of `relaunch-core.test.cjs` and `session-relaunch-cli.test.cjs`, and the adapter session gate names the missing-transcript notice (`PB`). Verify: `rg -c 'wrapper-changed'`, `rg -c 'goal_ended'` and `rg -c 'no transcript path'` on the playbook each print 1 or more. Result: each search prints 1, and `scratch/citations.sh` finds every named case once in the file it names.
- [x] T007 Extend the catalog: the Killer And Wrapper section gains the change notice, its log line and the empty-checksum rule, the Nudge Prepare And Arm section gains the `deferredAt` stamp, the withdrawal on the next prompt, the missing-transcript notice and the record with no `handoff`, and the Goal Carry-Over section gains `goal_ended`, the claimed-last rule, the unreadable log and the fallback bound (`FC`). Verify: `rg -c 'wrapper-changed'`, `rg -c 'deferredAt'`, `rg -c 'goal_ended'` and `rg -c 'no transcript path'` on the catalog each print 1 or more. Result: each search prints 1, and a read finds the record with no `handoff`, the fallback bound and the empty-checksum rule.
- [x] T008 Pin both citations of child 004 to commit `89e246760e` (`PKT/004-wrapper-change-notice/acceptance-criteria.md`, `PKT/004-wrapper-change-notice/plan.md`). Verify: `rg -n '1469' PKT/004-wrapper-change-notice --glob '*.md'` prints two lines, each also holding `89e246760e`. Result: the search printed two lines and both name `89e246760e`.
- [x] T009 Pin the ten citations of child 013 to commit `c69f278cfc` (`PKT/013-conformance-stamp-pin`). They use three spellings: `stop-arm.mjs:183`, `:183` and `line 183`. Verify: `rg -n ':183|line 183' PKT/013-conformance-stamp-pin --glob '*.md'` prints ten lines, each also holding `c69f278cfc`. Result: the search printed ten lines and all ten name `c69f278cfc`.
- [x] T010 Record the trigger phrase decision with the advisor output (`PHASE/goal.md`). Verify: `rg -c 'trigger phrase' PHASE/goal.md` prints 1 or more and `git diff --quiet HEAD -- .skilled/skills/system-spec-kit/graph-metadata.json` exits 0. Result: the search prints 3 and the diff exits 0.

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Check each new playbook and catalog sentence against the line or test it names (`PB`, `FC`). Verify: every cited `file:line` in the diff of `PB` and `FC` resolves to the text it describes on the current tree, and the list is saved to `PHASE/scratch/citations.txt`. Result: `scratch/citations.sh` printed `mismatches: 0` with exit 0, and `scratch/citations.txt` holds each test name once and each source line with its text.
- [x] T012 Run sk-doc's playbook and catalog checks (`.skilled/skills/system-spec-kit`). Verify: `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/skills/system-spec-kit/manual-testing-playbook`, `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --strict`, `python3 .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py` and `python3 .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/tests/test_validator_fixtures.py` each exit 0, or fail only as the baseline in `PHASE/scratch/baseline.txt` did. Result: all four exited 0 in `scratch/verification.txt`, and the fixture suite printed `ALL PASS`.
- [x] T013 Run the runtime mirror check after the handoff edit (`.skilled/commands`). Verify: `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check` prints `PASS` and exits 0. Result: `[runtime-mirror-sync] PASS: 256 mirrors across 10 trees are in sync.` with exit 0.
- [x] T014 Validate children 004 and 013 after the citation edits (`PKT`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh PKT/004-wrapper-change-notice --strict` and the same for `PKT/013-conformance-stamp-pin` each print `RESULT: PASSED`. Result: both printed `Errors: 0  Warnings: 0` and `RESULT: PASSED`, after `repair-derived --apply` re-derived their graph metadata.
- [x] T015 Check the commit touches documents only (`FIX`). Verify: `git show --name-status FIX` lists Markdown, the three derived `graph-metadata.json` files and the scratch files, and no code file. Result: `FIX` is `72bc2bf988` (`Commit-Id` 0014057). It changes 29 files: 16 Markdown, the derived `graph-metadata.json` of children 004, 013 and 019, and 10 scratch files of this child. No code file changed.
- [x] T016 Validate the phase folder (`PHASE`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/019-relaunch-doc-coverage --strict` prints `RESULT: PASSED`. Result: `Errors: 0  Warnings: 0`, `RESULT: PASSED`, exit 0, `scratch/validate.txt:53`, `:55`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`. Result: T001 to T016 are done after fix commit `72bc2bf988`.
- [x] No `[B]` blocked tasks remaining. Result: none is marked `[B]`.
- [x] Manual verification passed: every new sentence was read against the line or test it names (T011). Result: `scratch/citations.txt`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Findings closed**: alignment B-02, B-03, D-01, X-1, X-2 and X-3; deep review R10-P2-001; review FH and the orchestrator on the moved citations.
- **The behavior documented here**: `../015-wrapper-start-checksum/`, `../016-ended-goal-mark-match/` and `../017-missing-transcript-notice/`
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

A blocked task is marked `[B]` with its reason in `goal.md`. A `[B]` on T001 blocks every implementation task, because this phase documents what phases 15 to 17 ship.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md: `rg -c '^\| REQ-' spec.md` prints 7. Result: 7.
- [x] CHK-002 [P0] Technical approach defined in plan.md: `rg -c '^## 3. ARCHITECTURE' plan.md` prints 1. Result: 1.
- [x] CHK-003 [P1] The validator baselines are saved before the first edit (T002). Result: `scratch/baseline.txt` was written before the first edit.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] No code file changes: `git show --name-status FIX` lists Markdown, the derived `graph-metadata.json` files and the scratch files (T015). Result: `72bc2bf988` changes 29 files, none of them code.
- [x] CHK-011 [P0] Each new sentence names a source line or a test (T011). Result: `scratch/citations.txt`.
- [x] CHK-012 [P1] No sentence in the playbook or the catalog repeats another in the same document. Result: the new sentences state different behaviors in different sections, and a read of the diff found no repeat.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] AC-001 to AC-003 pass with their searches. Result: `scratch/green.txt` prints `checks: 14, failed: 0` with exit 0.
- [x] CHK-021 [P0] sk-doc's four checks pass or match the baseline (T012). Result: `scratch/verification.txt`, four runs exit 0.
- [x] CHK-022 [P1] The mirror check prints `PASS` (T013). Result: `PASS: 256 mirrors across 10 trees are in sync.` with exit 0.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] The finding class is `class-of-bug` for documents: every document that explains the goal field is checked for `goal_ended`. Result: the same-class inventory in `goal.md` names all five documents and says why each does or does not change.
- [x] CHK-FIX-002 [P0] Same-class producer inventory: `rg -n 'goal_packet'` over the catalog, the playbooks and the speckit commands is saved and each hit is named in `goal.md`. Result: `goal.md` names the five files the search returns.
- [x] CHK-FIX-003 [P0] Consumer inventory: N/A, documents only. Result: N/A.
- [x] CHK-FIX-004 [P0] N/A: no security, path, parser or redaction fix. Result: N/A.
- [x] CHK-FIX-005 [P1] Matrix axes listed in plan.md: behavior crossed with document. Result: plan.md §FIX ADDENDUM lists them.
- [x] CHK-FIX-006 [P1] Each citation edit keeps its line number and adds its commit. Result: ten 183 lines and two 1469 lines keep their numbers and name `c69f278cfc` and `89e246760e`.
- [x] CHK-FIX-007 [P1] Evidence is pinned to the fix commit, named in `goal.md` section 4. Result: `goal.md` section 4 names `72bc2bf988` (`Commit-Id` 0014057).
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets: no document gains a credential, path to a credential or environment value. Result: the diff adds only behavior text and commit ids.
- [x] CHK-031 [P0] No dotenv file is named or read. Result: no dotenv file was read, written or named.
- [x] CHK-032 [P1] N/A: no auth surface. Result: N/A.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` all name the six findings this phase closes. Result: the Cross-References line now names them, and `spec.md` and `plan.md` already did.
- [x] CHK-041 [P1] The trigger phrase decision is recorded with its evidence (T010). Result: `goal.md` Progress names the advisor output and the decision.
- [x] CHK-042 [P2] The Pi and OpenCode playbook decision is recorded in `spec.md`. Result: `spec.md` Out of Scope and Open Questions name it.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Baselines and the citation list live under `scratch/` only. Result: `baseline.txt`, `red.txt`, `green.txt`, `verification.txt` and `citations.txt` are all in `scratch/`.
- [x] CHK-051 [P1] No temporary file is left outside `scratch/`. Result: `git status` lists no untracked file outside the child's `scratch/` and this child's documents.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 11 | 11/11 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-14. Every item is verified, and CHK-010 and CHK-FIX-007 read fix commit `72bc2bf988`.
<!-- /ANCHOR:summary -->

---
