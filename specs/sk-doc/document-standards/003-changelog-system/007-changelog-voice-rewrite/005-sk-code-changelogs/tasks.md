---
title: "Tasks: Phase 5: sk-code-changelogs"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "sk code changelogs tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 5: sk-code-changelogs

<!-- SPECKIT_LEVEL: 2 -->

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

`S` is `specs/sk-doc/document-standards/003-changelog-system/007-changelog-voice-rewrite/scratch`. `P` is this phase folder, `specs/sk-doc/document-standards/003-changelog-system/007-changelog-voice-rewrite/005-sk-code-changelogs`.

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the list (`$S/lists/005.txt`). Verify: `wc -l < $S/lists/005.txt` prints 204. Evidence: 204 lines (`$P/scratch/evidence.txt:2`).
- [x] T002 Dry-run the driver on the list (`$S/rewrite-driver.cjs`). Verify: `--dry-run --slots 2` prints `queued=202`. Evidence: `listed=204 queued=202 refused=0`. The 2 pilot files, committed in `e673c77ba93`, were skipped.
- [x] T003 [P] Measure the 202 queued files at HEAD (`$S/measure-voice.py`). Verify: it prints the baseline. Evidence: avg 13.5 words, 559 sentences over 22, 4 files with a hard blocker (`$P/scratch/evidence.txt:4`).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Run the wave (`$S/wave-005.log`). Verify: `node $S/rewrite-driver.cjs --slots 2 $S/lists/005.txt` exits 0. Evidence: `pass=172 restored=2 unchanged=28`, driver exit 0 (`$P/scratch/evidence.txt:12`).
- [x] T005 Read why the 2 restored files failed (`$S/state.jsonl`). Verify: each record lists its findings. Evidence: `v3.4.0.0.md` failed on a changed alternative and a lost link. `v3.9.13.0.md` failed on a dropped detail and the sentence-mean gate (`$P/scratch/evidence.txt:30`, `$P/scratch/evidence.txt:31`). Neither points to a tool fault.
- [x] T006 Retry the 2 restored files (`$S/wave-005-retry.log`). Verify: `--retry-failed --wave 005-retry` exits 0. Evidence: `pass=2 restored=0`, driver exit 0 (`$P/scratch/evidence.txt:17`). Both passed on their first attempt.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Check the wave against HEAD (`$S/wave-verify.cjs`). Verify: no problem for a file this phase rewrote and no missing file. Evidence: `{"listed":204,"keep":174,"restored":28,"missing":0,"problems":2}`. The 2 problems are the pilot files, whose saved original predates the pilot. Both match HEAD, `git diff --quiet` exit 0 (`$P/scratch/evidence.txt:20`, `$P/scratch/evidence.txt:24`).
- [x] T008 Measure the 202 files after the waves (`$S/measure-voice.py`). Verify: `sentences_over_22=0` and `files_with_hvr_hard_blockers=0`. Evidence: avg 8.7 words, 0 over 22, 0 hard blockers (`$P/scratch/evidence.txt:8`).
- [x] T009 Sum the phase tokens (`$S/state.jsonl`). Verify: the summary names the total. Evidence: 7,793,615 tokens for the two waves (`$P/scratch/evidence.txt:28`).
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

## Verification Checklist
<!-- FILL: Fill each checklist section below. GOOD: Each CHK line names the command that answers it. WEAK: The checklist is done. -->

<!-- ANCHOR:protocol -->
## Verification Protocol
<!-- FILL: Keep the three rows and add the rule this packet uses for a blocked task. GOOD: P0 blocks close. P1 needs a recorded reason. WEAK: Follow the priorities. -->

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md Evidence: spec.md REQ-001 to REQ-005.
- [x] CHK-002 [P0] Technical approach defined in plan.md Evidence: plan.md.
- [x] CHK-003 [P1] Vibe and Codex quota is available Evidence: both waves ran with no usage limit.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The driver is the one phase 004 committed Evidence: no driver or brief file changed in this phase.
- [x] CHK-011 [P0] Every driver run exits 0 Evidence: `driver exit=0` twice (`$P/scratch/evidence.txt:13`, `$P/scratch/evidence.txt:18`).
- [x] CHK-012 [P1] A file that fails three attempts is restored to HEAD Evidence: both first-wave failures were restored, and `wave-verify.cjs` found no drift.
- [x] CHK-013 [P1] N/A: no code comment was added in this phase.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met Evidence: every row in acceptance-criteria.md is Met.
- [x] CHK-021 [P0] Every kept file passed the fact check Evidence: each pass record carries a `gpt-6-luna` verifier at `xhigh` with a read-only sandbox.
- [x] CHK-022 [P1] Files already passing were left unchanged Evidence: 28 recorded `unchanged`, each with no diff against HEAD.
- [x] CHK-023 [P1] A restored file was retried Evidence: the one retry wave kept both files.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

N/A: this phase fixes no reported finding and changes no tool.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No brief or state row holds a credential Evidence: the state holds tokens and verdicts only.
- [x] CHK-031 [P0] The fact-check executor runs with no write access Evidence: each verifier record shows `sandbox` `read-only`.
- [x] CHK-032 [P1] N/A: no auth surface.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] The retry outcome is recorded where a later phase will read it Evidence: implementation-summary.md Key Decisions.
- [x] CHK-042 [P2] N/A: no README changes
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Run state and logs live in the parent's `scratch/`, and phase evidence in this phase's `scratch/` Evidence: `$S/state.jsonl`, `$S/wave-005*.log`, `$P/scratch/evidence.txt`.
- [x] CHK-051 [P1] No parked rewrite is left in a changelog Evidence: `$S/failed/` holds the last rejected drafts of `sk-code/changelog/v3.4.0.0.md` and `v3.9.13.0.md` from the restored attempts, beside drafts from earlier phases. None was applied. The worktree files are the kept 005-retry rewrites, which `wave-verify.cjs` checked against HEAD.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-15
<!-- /ANCHOR:summary -->

---
