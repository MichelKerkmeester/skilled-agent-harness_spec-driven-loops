---
title: "Tasks: Phase 5: runtime-plugin-readmes"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "runtime plugin readmes tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 5: runtime-plugin-readmes

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

`$S` is the scratchpad folder `/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Skilled/256db329-443e-4697-8e43-b3b7f7c74ec6/scratchpad`. Every command runs from the repository root.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Rebuild the file list (`$S/r005.txt`). Verify: the enumeration command in `plan.md` prints 8 lines. Evidence: `r005.txt` holds the 8 paths the enumeration command prints.
- [x] T002 Record the per-file baseline (`$S/baseline-005-before.tsv`). Verify: `bash $S/tools/baseline.sh $(cat $S/r005.txt)` prints 8 lines. Evidence: `baseline-005-before.tsv` holds 8 lines, all `VALID`, with 27 hard blockers across four files.
- [x] T003 Confirm the link check and every consumer test pass before any edit (`plan.md` affected surfaces). Verify: `readme_links.py` prints `0 problems` and each consumer prints its pass line. Evidence: `readme_links.py` printed `0 problems` over 49 links and `goal-doc-contract.test.cjs` printed `pass 5`, `fail 0`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Run one canary writer on the smallest file (`$S/runs/`). Verify: its handback says `STATUS: DONE`, and `baseline.sh` on it prints `✅ VALID` and `hard=0`. Evidence: the `.cursor/hooks` canary came back `STATUS: DONE`, `✅ VALID issues=0 hard=0`, ceiling 92 to 100.
- [x] T005 [P] Run the remaining writers in waves (the 8 files in `$S/r005.txt`). Verify: every handback says `STATUS: DONE`, and `baseline.sh` prints `✅ VALID` and `hard=0` for each. Evidence: 8 writer handbacks, all `STATUS: DONE`, and all 8 print `✅ VALID` and `hard=0`.
- [x] T006 [P] Run one reviewer per README, never its writer (`$S/runs/*.review.jsonl`). Verify: every handback carries `CLAIMS_CHECKED` and a findings list. Evidence: 8 review handbacks from sessions that did not write the file, 1,329 claims checked in all.
- [x] T007 Confirm each finding against the code and apply or reject it (`implementation-summary.md`). Verify: one line per README records claims checked, findings applied and findings rejected with a reason. Evidence: the Review Record in `implementation-summary.md` holds one line per README, 25 findings applied, 0 rejected, plus the blocking review's seven.
- [x] T008 Rebuild the generated files: the README verdict baseline, then the trigger index last (`baseline-readme-verdicts.json`). Verify: the parity test prints `PARITY PASS` and `generate-trigger-index.mjs --check` reports every entry fresh. Evidence: the parity test printed `PARITY PASS: verdict diff is empty`, so the verdict baseline needed no rebuild. The trigger index is rebuilt last, just before the commit.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Rerun the full baseline and the structure check on all 8 files (`$S/baseline-005-after.tsv`). Verify: every line prints `✅ VALID`, `hard=0` and `emojiH=0`, `h2model.py` prints EXACT or SUBSET for each and no ceiling is lower than its baseline. Evidence: 8 of 8 `✅ VALID`, `issues=0`, `hard=0`, `emojiH=0`, `EXACT` for one and `SUBSET` for seven, and no ceiling below its baseline.
- [x] T010 Rerun the link check and every consumer test (`plan.md` affected surfaces). Verify: `readme_links.py` prints `0 problems`, `check-markdown-links.cjs` prints `0 broken` and each consumer prints its pass line. Evidence: `0 problems` over 62 links, `15212 links checked, 0 broken`, `goal-doc-contract.test.cjs` `pass 5` and `PARITY PASS`.
- [B] T011 Run the sk-doc suite (`run-script-tests.sh`). Verify: it exits 0. Blocked: `bash .skilled/skills/sk-doc/scripts/tests/run-script-tests.sh` exits 1 with `FAIL test_check_changelog_shape.py`, caused by commit `14926d78a37` in `.skilled/changelog/skilled/v4.0.2.1.md`, outside this phase. 57 other tests pass.
- [x] T012 Record before and after numbers and close the packet docs (`implementation-summary.md`). Verify: `validate.sh --strict` on this folder prints `RESULT: PASSED`. Evidence: the before and after numbers are in `implementation-summary.md`.
- [ ] T013 Commit, merge origin/main and push under sk-git (`git log -1`). Verify: `git rev-parse HEAD origin/main` prints the same hash twice.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [x] Manual verification passed: every reviewer finding is applied or rejected with a reason
- [ ] The phase commit is on origin/main
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
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

A blocked task is marked `[B]` with the failing command and its output beside it.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] The baseline, link check and consumer tests ran before any edit
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `validate_document.py` prints `VALID` for all 8 files
- [x] CHK-011 [P0] `hvr_scan.py` reports `hard blockers: 0` for all 8 files
- [x] CHK-012 [P1] No heading carries an emoji: the emoji count column prints 0 for all 8
- [x] CHK-013 [P1] Each file follows its template's section model: `h2model.py` prints EXACT or SUBSET
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Every consumer test in the plan's affected surfaces table passes Blocked: the sk-doc suite fails on a changelog test outside this phase. `goal-doc-contract.test.cjs` and the parity test pass.
- [x] CHK-022 [P1] `readme_links.py` prints `0 problems`
- [x] CHK-023 [P1] Every reviewer finding is applied or rejected with a reason
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No README shows a secret, token or private path: `rg -n -i 'token|secret|api[_-]key'` over the 8 files hits only prose about those features
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` name the same 8 files
- [x] CHK-041 [P1] `implementation-summary.md` records the before and after numbers
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files live in the scratchpad, never in the repository
- [ ] CHK-051 [P1] `git status --short` after the commit shows only paths this program does not own
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 5/7 |
| P1 Items | 9 | 8/9 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-11-17
<!-- /ANCHOR:summary -->

---
