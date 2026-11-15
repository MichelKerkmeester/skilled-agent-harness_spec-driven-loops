---
title: "Tasks: Phase 4: system-spec-kit-changelogs"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "system spec kit changelogs tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 4: system-spec-kit-changelogs

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

`S` is `specs/sk-doc/document-standards/003-changelog-system/007-changelog-voice-rewrite/scratch`. `P` is this phase folder, `specs/sk-doc/document-standards/003-changelog-system/007-changelog-voice-rewrite/004-system-spec-kit-changelogs`.

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the list (`$S/lists/004.txt`). Verify: `wc -l < $S/lists/004.txt` prints 167. Evidence: 167 lines (`$P/scratch/evidence.txt:2`).
- [x] T002 Dry-run the driver on the list (`$S/rewrite-driver.cjs`). Verify: `--dry-run --slots 2` prints `queued=165`. Evidence: `listed=167 queued=165 refused=0`. The 2 pilot files, committed in `e673c77ba93`, were skipped.
- [x] T003 [P] Measure the 165 queued files at HEAD (`$S/measure-voice.py`). Verify: it prints the baseline. Evidence: avg 11.9 words, 374 sentences over 22, 5 files with a hard blocker (`$P/scratch/evidence.txt:4`).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Run the wave (`$S/wave-004.log`). Verify: `node $S/rewrite-driver.cjs --slots 2 $S/lists/004.txt` exits 0. Evidence: `pass=126 restored=2 unchanged=37`, driver exit 0 (`$P/scratch/evidence.txt:12`).
- [x] T005 Retry the 2 restored files (`$S/wave-004-retry.log`). Verify: `--retry-failed --wave 004-retry` exits 0. Evidence: `pass=0 restored=2`, driver exit 0 (`$P/scratch/evidence.txt:15`).
- [x] T006 Read why both files failed (`$S/state.jsonl`). Verify: each record lists its findings. Evidence: `v2.12.25.0.md` has a `hard-blockers.md` fix row for the banned word harness. The fact check rejected the plain-noun swap as a renamed component, and an attempt that kept the word failed the voice scan. `v2.12.5.0.md` line 16 writes a bare triple backtick twice in running text, which CommonMark reads as one code span, so the structure lock froze that text.
- [x] T007 Tell the worker and the fact check about a planned word swap (`$S/rewrite-driver.cjs`, `$S/brief-verify.md`). Verify: `node --check` exits 0 and wave 004 re-verifies with every earlier pass kept. Evidence: keep 126 of 126 before the retry. The note reaches only word tokens, 7 `harness` fix rows (`$P/scratch/evidence.txt:31`).
- [x] T008 Retry with the changed driver (`$S/wave-004-retry2.log`). Verify: `--retry-failed --wave 004-retry2` exits 0. Evidence: `pass=2 restored=0`, driver exit 0 (`$P/scratch/evidence.txt:18`). `v2.12.25.0.md` passed on its first attempt and `v2.12.5.0.md` on its second.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Check the wave against HEAD (`$S/wave-verify.cjs`). Verify: no problem for a file this phase rewrote and no missing file. Evidence: `{"listed":167,"keep":128,"restored":37,"missing":0,"problems":2}`. The 2 problems are the pilot files, whose saved original predates the pilot. Both match HEAD, `git diff --quiet` exit 0 (`$P/scratch/evidence.txt:21`).
- [x] T010 Measure the 165 files after the waves (`$S/measure-voice.py`). Verify: `sentences_over_22=0` and `files_with_hvr_hard_blockers=0`. Evidence: avg 8.6 words, 0 over 22, 0 hard blockers (`$P/scratch/evidence.txt:8`). `v2.12.25.0.md` holds 0 uses of harness (`$P/scratch/evidence.txt:29`).
- [x] T011 Sum the phase tokens (`$S/state.jsonl`). Verify: the summary names the total. Evidence: 6,212,961 tokens for the three waves (`$P/scratch/evidence.txt:33`).
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
- [x] CHK-003 [P1] Vibe and Codex quota is available Evidence: all three waves ran with no usage limit.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The edited driver still parses Evidence: `node --check` on the driver exits 0.
- [x] CHK-011 [P0] Every driver run exits 0 Evidence: `driver exit=0` three times (`$P/scratch/evidence.txt:13`, `$P/scratch/evidence.txt:16`, `$P/scratch/evidence.txt:19`).
- [x] CHK-012 [P1] A file that fails three attempts is restored to HEAD Evidence: both first-wave failures were restored, and `wave-verify.cjs` found no drift.
- [x] CHK-013 [P1] The new comment states the durable reason and names no packet Evidence: it says a planned voice fix swaps a banned word for a plain noun, and without the note the fact check rejects the swap.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met Evidence: every row in acceptance-criteria.md is Met.
- [x] CHK-021 [P0] The prompt change loosens no other file Evidence: the note is empty unless the file's row is a `fix` of a word token. Wave 004 re-verified under the change still keeps all 126 earlier passes.
- [x] CHK-022 [P1] Files already passing were left unchanged Evidence: 37 recorded `unchanged`, each with no diff against HEAD.
- [x] CHK-023 [P1] A restored file was retried Evidence: the retry with the changed driver kept both files.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

N/A: this phase fixes no reported finding. The driver change is recorded under Key Decisions in implementation-summary.md.
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
- [x] CHK-041 [P1] The driver change is recorded where a later phase will read it Evidence: implementation-summary.md Key Decisions.
- [x] CHK-042 [P2] N/A: no README changes
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Run state and logs live in the parent's `scratch/`, and phase evidence in this phase's `scratch/` Evidence: `$S/state.jsonl`, `$S/wave-004*.log`, `$P/scratch/evidence.txt`.
- [x] CHK-051 [P1] No parked rewrite is left in a changelog Evidence: `$S/failed/` holds the last rejected drafts of `v2.12.25.0.md` and `v2.12.5.0.md` from the restored attempts, plus the phase 003 draft. None was applied. The worktree files are the kept 004-retry2 rewrites, which `wave-verify.cjs` checked against HEAD.
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
