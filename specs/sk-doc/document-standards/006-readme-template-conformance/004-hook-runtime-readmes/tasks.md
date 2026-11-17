---
title: "Tasks: Phase 4: hook-runtime-readmes"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "hook runtime readmes tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 4: hook-runtime-readmes

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

- [x] T001 Rebuild the file list (`$S/r004.txt`). Verify: the enumeration command in `plan.md` prints 47 lines. Evidence: the enumeration printed 47 lines at setup and again at close (`r004-final.txt`), the same paths both times.
- [x] T002 Record the per-file baseline (`$S/baseline-004-before.tsv`). Verify: `bash $S/tools/baseline.sh $(cat $S/r004.txt)` prints 47 lines. Evidence: `baseline-004-before.tsv` holds 47 lines, all `VALID` with `hard=0`.
- [x] T003 Confirm the link check and every consumer test pass before any edit (`plan.md` affected surfaces). Verify: `readme_links.py` prints `0 problems` and each consumer prints its pass line. Evidence: `readme_links.py` printed `0 problems`, `check-markdown-links.cjs` printed `0 broken` and `hook-wiring-check.cjs --root .` printed `ok` for claude, codex, cursor and devin.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Run one canary writer on the smallest file (`$S/runs/`). Verify: its handback says `STATUS: DONE`, and `baseline.sh` on it prints `✅ VALID` and `hard=0`. Evidence: the mcp-route-guard/pi canary came back `STATUS: DONE`, `✅ VALID issues=0 hard=0`, after the main session replaced its smoke with the path parity suite.
- [x] T005 [P] Run the remaining writers in waves (the 47 files in `$S/r004.txt`). Verify: every handback says `STATUS: DONE`, and `baseline.sh` prints `✅ VALID` and `hard=0` for each. Evidence: 47 writer handbacks, all `STATUS: DONE`, across codex, devin and opencode-go executors. All 47 print `✅ VALID` and `hard=0`.
- [x] T006 [P] Run one reviewer per README, never its writer (`$S/runs/*.review.jsonl`). Verify: every handback carries `CLAIMS_CHECKED` and a findings list. Evidence: 47 review handbacks from sessions that did not write the file, 2,922 claims checked in all.
- [x] T007 Confirm each finding against the code and apply or reject it (`implementation-summary.md`). Verify: one line per README records claims checked, findings applied and findings rejected with a reason. Evidence: the Review Record in `implementation-summary.md` holds one line per README, 43 fixes applied counting the blocking review and 0 rejected.
- [x] T008 Rebuild the generated files: the README verdict baseline, then the trigger index last (`baseline-readme-verdicts.json`). Verify: the parity test prints `PARITY PASS` and `generate-trigger-index.mjs --check` reports every entry fresh. Evidence: the parity test printed `PARITY PASS: verdict diff is empty`, so the verdict baseline needed no rebuild. The trigger index is rebuilt last, just before the commit.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Rerun the full baseline and the structure check on all 47 files (`$S/baseline-004-after.tsv`). Verify: every line prints `✅ VALID`, `hard=0` and `emojiH=0`, `h2model.py` prints EXACT or SUBSET for each and no ceiling is lower than its baseline. Evidence: 47 of 47 `✅ VALID`, `issues=0`, `hard=0`, `emojiH=0`, `EXACT` for all 47 and no ceiling below its baseline.
- [x] T010 Rerun the link check and every consumer test (`plan.md` affected surfaces). Verify: `readme_links.py` prints `0 problems`, `check-markdown-links.cjs` prints `0 broken` and each consumer prints its pass line. Evidence: `0 problems` over 260 links, `15099 links checked, 0 broken`, `hook-wiring-check.cjs` exit 0 and `PARITY PASS`.
- [x] T011 Run the sk-doc suite (`run-script-tests.sh`). Verify: it exits 0. Evidence: exit 0, 57 PASS and 0 FAIL.
- [x] T012 Record before and after numbers and close the packet docs (`implementation-summary.md`). Verify: `validate.sh --strict` on this folder prints `RESULT: PASSED`. Evidence: the before and after numbers are in `implementation-summary.md`.
- [x] T013 Commit, merge origin/main and push under sk-git (`git log -1`). Verify: `git rev-parse HEAD origin/main` prints the same hash twice. Evidence: commit `2dbd4136739` was pushed as a fast-forward of origin/main, and `git rev-parse HEAD origin/main` printed `2dbd4136739` twice.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: every reviewer finding is applied or rejected with a reason
- [x] The phase commit is on origin/main
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

- [x] CHK-010 [P0] `validate_document.py` prints `VALID` for all 47 files
- [x] CHK-011 [P0] `hvr_scan.py` reports `hard blockers: 0` for all 47 files
- [x] CHK-012 [P1] No heading carries an emoji: the emoji count column prints 0 for all 47
- [x] CHK-013 [P1] Each file follows its template's section model: `h2model.py` prints EXACT or SUBSET
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Every consumer test in the plan's affected surfaces table passes
- [x] CHK-022 [P1] `readme_links.py` prints `0 problems`
- [x] CHK-023 [P1] Every reviewer finding is applied or rejected with a reason
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No README shows a secret, token or private path: `rg -n -i 'token|secret|api[_-]key'` over the 47 files hits only prose about those features
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` name the same 47 files
- [x] CHK-041 [P1] `implementation-summary.md` records the before and after numbers
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files live in the scratchpad, never in the repository
- [x] CHK-051 [P1] `git status --short` after the commit shows only paths this program does not own
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 7/7 |
| P1 Items | 9 | 9/9 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-11-17
<!-- /ANCHOR:summary -->

---
