---
title: "Tasks: Phase 2: skilled-release-line"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "skilled release line tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 2: skilled-release-line

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

`S` is `specs/sk-doc/document-standards/003-changelog-system/007-changelog-voice-rewrite/scratch`. `P` is this phase folder, `specs/sk-doc/document-standards/003-changelog-system/007-changelog-voice-rewrite/002-skilled-release-line`.

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the list (`$S/lists/002.txt`). Verify: `wc -l < $S/lists/002.txt` prints 62. Evidence: 62 lines (`$P/scratch/evidence.txt:2`).
- [x] T002 Dry-run the driver on the list (`$S/rewrite-driver.cjs`). Verify: `--dry-run --slots 2` prints `queued=60` and the five gates. Evidence: `listed=62 queued=60 refused=0`. The 2 pilot files, committed in `e673c77ba93`, were skipped.
- [x] T003 [P] Measure the 60 queued files at HEAD (`$S/measure-voice.py`). Verify: it prints the baseline. Evidence: avg 13.7 words, 626 sentences over 22, 1 file with a hard blocker (`$P/scratch/evidence.txt:4`).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Run the wave (`$S/wave-002.log`). Verify: `node $S/rewrite-driver.cjs --slots 2 $S/lists/002.txt` exits 0. Evidence: `pass=46 restored=5 unchanged=9`, driver exit 0 (`$P/scratch/evidence.txt:12`).
- [x] T005 Read why the 5 restored files failed (`$S/state.jsonl`). Verify: each restored record lists its last finding. Evidence: every one was a fact-check finding of meaning drift, such as a "could" made definite, a cause dropped from a split sentence and an example turned into a rule.
- [x] T006 Retry the restored files once (`$S/wave-002-retry.log`). Verify: `--retry-failed --wave 002-retry` exits 0. Evidence: `pass=5 restored=0 unchanged=0`, driver exit 0 (`$P/scratch/evidence.txt:15`).
- [x] T007 Save each published body, then sync it from the new entry text (`$P/scratch/release-bodies-before/`, `$P/scratch/release-bodies-after/`). Verify: 52 files in each folder, and each `gh release view --json body` read-back equals the text sent. Evidence: 52 and 52, `synced_ok=52 fail=0` (`$P/scratch/evidence.txt:28`). v4 bodies keep their footer, and v1 to v3.6 bodies keep having none.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Check the wave against HEAD (`$S/wave-verify.cjs`). Verify: no problem for a file this phase rewrote and no missing file. Evidence: `{"listed":62,"keep":51,"restored":9,"missing":0,"problems":2}`. The 2 problems are the pilot files, whose saved original predates the pilot. Both match HEAD, `git diff --quiet` exit 0 (`$P/scratch/evidence.txt:18`).
- [x] T009 Measure the 60 files after the waves (`$S/measure-voice.py`). Verify: `sentences_over_22=0` and `files_with_hvr_hard_blockers=0`. Evidence: avg 9.0 words, 0 over 22, 0 hard blockers (`$P/scratch/evidence.txt:8`).
- [x] T010 Sum the phase tokens (`$S/state.jsonl`). Verify: the summary names the total. Evidence: 4,468,065 tokens for both waves.
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

- [x] CHK-010 [P0] N/A: this phase changes no code. It runs the phase 001 driver unchanged.
- [x] CHK-011 [P0] Both driver runs exit 0 Evidence: `driver exit=0` twice (`$P/scratch/evidence.txt:13`, `$P/scratch/evidence.txt:16`).
- [x] CHK-012 [P1] A file that fails three attempts is restored to HEAD Evidence: the 5 first-wave failures were restored, and `wave-verify.cjs` found no drift.
- [x] CHK-013 [P1] N/A: no code comment written.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met Evidence: every row in acceptance-criteria.md is Met.
- [x] CHK-021 [P0] Each synced body was read back Evidence: `synced_ok=52 fail=0`.
- [x] CHK-022 [P1] Files already passing were left unchanged Evidence: 9 recorded `unchanged`, each with no diff against HEAD.
- [x] CHK-023 [P1] A restored file was retried Evidence: the retry wave kept all 5.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

N/A: this phase fixes no reported finding.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No brief, state row or body holds a credential Evidence: the bodies are release notes, and the state holds tokens and verdicts only.
- [x] CHK-031 [P0] The fact-check executor runs with no write access Evidence: each verifier record shows `sandbox` `read-only`.
- [x] CHK-032 [P1] N/A: no auth surface. The `gh` edits used the operator's existing login.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Each published body matches its entry Evidence: the read-back compare, 52 of 52.
- [x] CHK-042 [P2] N/A: no README changes
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Run state and logs live in the parent's `scratch/`, and phase evidence in this phase's `scratch/` Evidence: `$S/state.jsonl`, `$S/wave-002*.log`, `$P/scratch/`.
- [x] CHK-051 [P1] No parked rewrite is left Evidence: `$S/failed/` holds no draft.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 7/7 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-15
<!-- /ANCHOR:summary -->

---



