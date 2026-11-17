---
title: "Tasks: Phase 2: mode-packet-readmes"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "mode packet readmes tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 2: mode-packet-readmes

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

- [x] T001 Rebuild the file list (`$S/r002.txt`). Verify: the enumeration command in `plan.md` prints 41 lines. Evidence: `r002.txt` holds 41 lines.
- [x] T002 Record the per-file baseline (`$S/baseline-002-before.tsv`). Verify: `bash $S/tools/baseline.sh $(cat $S/r002.txt)` prints 41 lines. Evidence: `baseline-002-before.tsv` holds 41 lines, 41 `VALID`, 45 hard blockers across 12 files.
- [x] T003 Confirm the link check and every consumer test pass before any edit (`plan.md` affected surfaces). Verify: `readme_links.py` prints `0 problems` and each consumer prints its pass line. Evidence: `0 problems` before the first edit, and each consumer printed its pass line.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Run one canary writer on the smallest file (`$S/runs/`). Verify: its handback says `STATUS: DONE`, and `baseline.sh` on it prints `✅ VALID` and `hard=0`. Evidence: the sk-code-frontend canary returned `STATUS: DONE`, `✅ VALID issues=0 hard=0`, ceiling 94 to 98, `EXACT`.
- [x] T005 [P] Run the remaining writers in waves (the 41 files in `$S/r002.txt`). Verify: every handback says `STATUS: DONE`, and `baseline.sh` prints `✅ VALID` and `hard=0` for each. Evidence: 40 writer handbacks, every file `✅ VALID issues=0 hard=0`.
- [x] T006 [P] Run one reviewer per README, never its writer (`$S/runs/*.review.jsonl`). Verify: every handback carries `CLAIMS_CHECKED` and a findings list. Evidence: 41 reviewer handbacks with `CLAIMS_CHECKED`, 4,820 claims in all. The sk-create-repo-rule review reran on GPT-6 Luna after the DevPass cap stopped its first run.
- [x] T007 Confirm each finding against the code and apply or reject it (`implementation-summary.md`). Verify: one line per README records claims checked, findings applied and findings rejected with a reason. Evidence: one Fact checks line per README in `implementation-summary.md`, 109 applied and 19 rejected with reasons.
- [x] T008 Rebuild the generated files: the README verdict baseline, then the trigger index last (`baseline-readme-verdicts.json`). Verify: the parity test prints `PARITY PASS` and `generate-trigger-index.mjs --check` reports every entry fresh. Evidence: `PARITY PASS: verdict diff is empty`, so the verdict baseline needed no rebuild. The trigger index is rebuilt last before the commit.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Rerun the full baseline and the structure check on all 41 files (`$S/baseline-002-after.tsv`). Verify: every line prints `✅ VALID`, `hard=0` and `emojiH=0`, `h2model.py` prints EXACT or SUBSET for each and no ceiling is lower than its baseline. Evidence: 41 of 41 `✅ VALID issues=0 hard=0 emojiH=0`, 41 `EXACT`.
- [x] T010 Rerun the link check and every consumer test (`plan.md` affected surfaces). Verify: `readme_links.py` prints `0 problems`, `check-markdown-links.cjs` prints `0 broken` and each consumer prints its pass line. Evidence: `0 problems` over 713 links, `15083 links checked, 0 broken`, and every consumer passed.
- [x] T011 Run the sk-doc suite (`run-script-tests.sh`). Verify: it exits 0. Evidence: exit 0, 57 PASS.
- [x] T012 Record before and after numbers and close the packet docs (`implementation-summary.md`). Verify: `validate.sh --strict` on this folder prints `RESULT: PASSED`. Evidence: `implementation-summary.md` holds the before and after numbers.
- [x] T013 Commit, merge origin/main and push under sk-git (`git log -1`). Verify: `git rev-parse HEAD origin/main` prints the same hash twice. Evidence: `cbc0bd2bd49` pushed, and `git rev-parse HEAD origin/main` printed it twice. The READMEs themselves landed in `096fe534033`.
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
- [x] CHK-003 [P1] The baseline, link check and consumer tests ran before any edit (baseline, `0 problems` and every consumer pass line recorded before the first writer ran)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `validate_document.py` prints `VALID` for all 41 files (41 of 41 `✅ VALID`)
- [x] CHK-011 [P0] `hvr_scan.py` reports `hard blockers: 0` for all 41 files (41 of 41 `hard=0`)
- [x] CHK-012 [P1] No heading carries an emoji: the emoji count column prints 0 for all 41 (41 of 41 `emojiH=0`)
- [x] CHK-013 [P1] Each file follows its template's section model: `h2model.py` prints EXACT or SUBSET (41 of 41 `EXACT`)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met (AC-001 to AC-009 Met)
- [x] CHK-021 [P0] Every consumer test in the plan's affected surfaces table passes (19 vitests, rule canary, 7 hub checks, drift check, parity and manifest all pass)
- [x] CHK-022 [P1] `readme_links.py` prints `0 problems` (713 outbound links, `0 problems`)
- [x] CHK-023 [P1] Every reviewer finding is applied or rejected with a reason (109 applied, 19 rejected with reasons, recorded per README)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No README shows a secret, token or private path: `rg -n -i 'token|secret|api[_-]key'` over the 41 files hits only prose about those features (the scan hits prose about tokens and keys only)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` name the same 41 files (all three use the same 41-file enumeration)
- [x] CHK-041 [P1] `implementation-summary.md` records the before and after numbers (Verification section)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files live in the scratchpad, never in the repository (every run, ledger and baseline file lives under `$S`)
- [x] CHK-051 [P1] `git status --short` after the commit shows only paths this program does not own (after `cbc0bd2bd49` only the operator files and another session's decision-capture metadata stayed modified)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 2/7 |
| P1 Items | 9 | 0/9 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-11-16
<!-- /ANCHOR:summary -->

---
