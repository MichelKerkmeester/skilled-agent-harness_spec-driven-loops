---
title: "Tasks: Phase 7: hook-code-folder-readmes"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "hook code folder readmes tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 7: hook-code-folder-readmes

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

- [x] T001 Rebuild the file list (`$S/r007.txt`). Verify: the enumeration command in `plan.md` prints 32 lines. Evidence: the enumeration printed 32 lines, identical to `r007.txt`.
- [x] T002 Record the per-file baseline (`$S/baseline-007-before.tsv`). Verify: `bash $S/tools/baseline.sh $(cat $S/r007.txt)` prints 32 lines. Evidence: `baseline-007-before.tsv` holds 32 lines and matched a rerun before the canary.
- [x] T003 Confirm the link check and every consumer test pass before any edit (`plan.md` affected surfaces). Verify: `readme_links.py` prints `0 problems` and each consumer prints its pass line. Evidence: `readme_links.py` printed `0 problems`, runtime-refusal `pass 6`, parity `PARITY PASS` and the sk-doc suite exit 0, all before the first edit.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Run one canary writer on the smallest file (`$S/runs/`). Verify: its handback says `STATUS: DONE`, and `baseline.sh` on it prints `✅ VALID` and `hard=0`. Evidence: the canary on `session-handover/lib/README.md` handed back `STATUS: DONE`, and `baseline.sh` printed `✅ VALID` and `hard=0`.
- [x] T005 [P] Run the remaining writers in waves (the 32 files in `$S/r007.txt`). Verify: every handback says `STATUS: DONE`, and `baseline.sh` prints `✅ VALID` and `hard=0` for each. Evidence: eight waves and the library run, every handback `STATUS: DONE`, and `baseline-007-after.tsv` shows `✅ VALID` and `hard=0` for all 32.
- [x] T006 [P] Run one reviewer per README, never its writer (`$S/runs/*.review.jsonl`). Verify: every handback carries `CLAIMS_CHECKED` and a findings list. Evidence: 32 reviewer handbacks, each with `CLAIMS_CHECKED` and a findings list, 3,040 claims in all.
- [x] T007 Confirm each finding against the code and apply or reject it (`implementation-summary.md`). Verify: one line per README records claims checked, findings applied and findings rejected with a reason. Evidence: the review record in `implementation-summary.md` holds one line per README, 78 findings applied and 2 rejected with a reason.
- [x] T008 Rebuild the generated files: the README verdict baseline, then the trigger index last (`baseline-readme-verdicts.json`). Verify: the parity test prints `PARITY PASS` and `generate-trigger-index.mjs --check` reports every entry fresh. Evidence: no README verdict changed, so `test_readme_verdict_parity.py` printed `PARITY PASS` with the baseline untouched. The trigger index was left alone because every stale entry in `generate-trigger-index.mjs --check` belongs to another session's packet and no trigger phrase in this phase changed.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Rerun the full baseline and the structure check on all 32 files (`$S/baseline-007-after.tsv`). Verify: every line prints `✅ VALID`, `hard=0` and `emojiH=0`, `h2model.py` prints EXACT or SUBSET for each and no ceiling is lower than its baseline. Evidence: `baseline-007-after.tsv` shows `✅ VALID`, `hard=0` and `emojiH=0` on every line, `h2model.py` printed `SUBSET nodiv=0` for all 32 and no ceiling fell.
- [x] T010 Rerun the link check and every consumer test (`plan.md` affected surfaces). Verify: `readme_links.py` prints `0 problems`, `check-markdown-links.cjs` prints `0 broken` and each consumer prints its pass line. Evidence: `readme_links.py` printed `0 problems`, `check-markdown-links.cjs` printed `0 broken markdown links` and runtime-refusal printed `pass 6`.
- [x] T011 Run the sk-doc suite (`run-script-tests.sh`). Verify: it exits 0. Evidence: `run-script-tests.sh` printed `all sk-doc script tests passed`, 58 PASS, exit 0.
- [x] T012 Record before and after numbers and close the packet docs (`implementation-summary.md`). Verify: `validate.sh --strict` on this folder prints `RESULT: PASSED`. Evidence: `implementation-summary.md` records the before and after numbers, and `validate.sh --strict` on this folder printed `RESULT: PASSED`.
- [x] T013 Commit, merge origin/main and push under sk-git (`git log -1`). Verify: `git rev-parse HEAD origin/main` prints the same hash twice. Evidence: commit `ddacb0a2bf9` was merged with origin/main and pushed as `6f22dec0ca1`, and `git rev-parse HEAD origin/main` printed `6f22dec0ca1` twice.
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
- [x] CHK-003 [P1] The baseline, link check and consumer tests ran before any edit. Evidence: T003.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `validate_document.py` prints `VALID` for all 32 files. Evidence: `baseline-007-after.tsv`, plus `--no-exclude` on the fixtures README.
- [x] CHK-011 [P0] `hvr_scan.py` reports `hard blockers: 0` for all 32 files. Evidence: `hard=0` on all 32 lines.
- [x] CHK-012 [P1] No heading carries an emoji: the emoji count column prints 0 for all 32. Evidence: `emojiH=0` on all 32 lines.
- [x] CHK-013 [P1] Each file follows its template's section model: `h2model.py` prints EXACT or SUBSET. Evidence: `SUBSET nodiv=0` for all 32.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: every row in `acceptance-criteria.md` is Met.
- [x] CHK-021 [P0] Every consumer test in the plan's affected surfaces table passes. Evidence: runtime-refusal `pass 6`, parity `PARITY PASS`, the hook flags example still points at the kill-switch index.
- [x] CHK-022 [P1] `readme_links.py` prints `0 problems`. Evidence: `0 problems` over 182 outbound and 2 inbound links.
- [x] CHK-023 [P1] Every reviewer finding is applied or rejected with a reason. Evidence: the review record.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No README shows a secret, token or private path: `rg -n -i 'token|secret|api[_-]key'` over the 32 files hits only prose about those features. Evidence: 34 hits, all prose or identifiers, no key-shaped string and no private path.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` name the same 32 files. Evidence: all three name the 32 files of `r007.txt`.
- [x] CHK-041 [P1] `implementation-summary.md` records the before and after numbers. Evidence: the Verification section.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files live in the scratchpad, never in the repository. Evidence: every helper and ledger sits in the scratchpad.
- [x] CHK-051 [P1] `git status --short` after the commit shows only paths this program does not own. Evidence: `git status --short` over `.skilled/hooks/` and this packet printed nothing after the push
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
