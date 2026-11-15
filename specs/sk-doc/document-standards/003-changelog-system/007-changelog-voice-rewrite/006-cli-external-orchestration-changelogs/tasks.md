---
title: "Tasks: Phase 6: cli-external-orchestration-changelogs"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "cli external orchestration changelogs tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 6: cli-external-orchestration-changelogs

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

`S` is `specs/sk-doc/document-standards/003-changelog-system/007-changelog-voice-rewrite/scratch`. `P` is this phase folder, `specs/sk-doc/document-standards/003-changelog-system/007-changelog-voice-rewrite/006-cli-external-orchestration-changelogs`.

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the list (`$S/lists/006.txt`). Verify: `wc -l < $S/lists/006.txt` prints 212. Evidence: 212 lines (`$P/scratch/evidence.txt:2`).
- [x] T002 Dry-run the driver on the list (`$S/rewrite-driver.cjs`). Verify: `--dry-run --slots 2` prints `queued=210`. Evidence: `listed=212 queued=210 refused=0`. The 2 pilot files, committed in `e673c77ba93`, were skipped.
- [x] T003 [P] Measure the 210 queued files at HEAD (`$S/measure-voice.py`). Verify: it prints the baseline. Evidence: avg 12.2 words, 296 sentences over 22, 13 files with a hard blocker (`$P/scratch/evidence.txt:4`).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Run the wave (`$S/wave-006.log`). Verify: `node $S/rewrite-driver.cjs --slots 2 $S/lists/006.txt` exits 0. Evidence: `pass=4 restored=180 unchanged=26`, driver exit 0 (`$P/scratch/evidence.txt:12`).
- [x] T005 Read why 180 files failed (`$S/state.jsonl`, `$S/runs/`). Verify: each record lists its findings. Evidence: 543 worker attempts ended as `infrastructure_failure` with no tokens (`$P/scratch/evidence.txt:15`). The worker logs held HTTP 402 "API budget exhausted" (`$P/scratch/evidence.txt:17`). The first restore came at 14:19:53, and two of the four first-wave passes also lost early attempts to it.
- [x] T006 Confirm every restored file is untouched (`$S/wave-verify.cjs`). Verify: each restored file equals HEAD. Evidence: wave-verify found no drift on the 180, and `git status` showed only the 4 kept rewrites.
- [x] T007 Stop the driver on a spent budget (`$S/rewrite-driver.cjs`). Verify: `node --check` exits 0, and the new pattern matches every budget log and no other log. Evidence: 543 budget logs matched. The pattern names `status 402`, `budget exhausted` and `billing_api`, because a bare 402 matched token counts such as `"output_tokens":402`.
- [x] T008 Run the worker on the Vibe login key (`$S/rewrite-driver.cjs`). Verify: an isolated call without `MISTRAL_API_KEY` finishes. Evidence: `exit 0`, `finished`, cost 0, reading the key from the macOS Keychain (`$P/scratch/evidence.txt:32`). The operator chose this after signing in with the browser.
- [x] T009 Retry the 180 restored files (`$S/wave-006-retry.log`). Verify: `--retry-failed --wave 006-retry` exits 0. Evidence: `pass=180 restored=0`, driver exit 0 (`$P/scratch/evidence.txt:19`). 144 passed on the first attempt, 34 on the second and 2 on the third.
- [x] T010 End a sentence inside closing quotes in the measure (`$S/measure-voice.py`). Verify: the after count shows 0 over 22 and earlier phases stay at 0. Evidence: the old splitter merged two sentences in `cli-external-orchestration/changelog/v1.4.1.0.md` at `"six." Every`. Phases 002 to 005 still show 0 (`$P/scratch/evidence.txt:34`).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Check the wave against HEAD (`$S/wave-verify.cjs`). Verify: no problem for a file this phase rewrote and no missing file. Evidence: `{"listed":212,"keep":184,"restored":26,"missing":0,"problems":2}`. The 2 problems are the pilot files, whose saved original predates the pilot. Both match HEAD, `git diff --quiet` exit 0 (`$P/scratch/evidence.txt:22`, `$P/scratch/evidence.txt:26`).
- [x] T012 Measure the 210 files after the waves (`$S/measure-voice.py`). Verify: `sentences_over_22=0` and `files_with_hvr_hard_blockers=0`. Evidence: avg 8.3 words, 0 over 22, 0 hard blockers (`$P/scratch/evidence.txt:8`).
- [x] T013 Sum the phase tokens (`$S/state.jsonl`). Verify: the summary names the total. Evidence: 7,953,730 tokens for the two waves (`$P/scratch/evidence.txt:30`).
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
- [x] CHK-003 [P1] Worker and fact-check usage is available Evidence: the API budget ran out in wave 006. The retry ran on the Vibe login key with no limit hit.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The edited driver still parses Evidence: `node --check` on the driver exits 0.
- [x] CHK-011 [P0] Every driver run exits 0 Evidence: `driver exit=0` twice (`$P/scratch/evidence.txt:13`, `$P/scratch/evidence.txt:20`).
- [x] CHK-012 [P1] A file that fails three attempts is restored to HEAD Evidence: all 180 outage failures were restored, and `wave-verify.cjs` found no drift.
- [x] CHK-013 [P1] The new comments state the durable reason and name no packet Evidence: one says a spent budget is a limit because retrying it only restores files. The other says Vibe reads the browser-login key from the Keychain without the environment key.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met Evidence: every row in acceptance-criteria.md is Met.
- [x] CHK-021 [P0] The wider limit pattern stops no healthy run Evidence: over every run log it matched the 543 budget logs and nothing else. The older patterns still match some prose, but only after a worker has failed.
- [x] CHK-022 [P1] Files already passing were left unchanged Evidence: 26 recorded `unchanged`, each with no diff against HEAD.
- [x] CHK-023 [P1] A restored file was retried Evidence: the retry on the Vibe login key kept all 180.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

N/A: this phase fixes no reported finding. The driver and measure changes are recorded under Key Decisions in implementation-summary.md.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No brief, log or state row holds a credential Evidence: the state holds tokens and verdicts only. The Keychain key is read by Vibe and never written by the driver.
- [x] CHK-031 [P0] The fact-check executor runs with no write access Evidence: each verifier record shows `sandbox` `read-only`.
- [x] CHK-032 [P1] N/A: no auth surface changes. The worker drops one environment variable and uses the operator's own Vibe login.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] The driver and measure changes are recorded where a later phase will read them Evidence: implementation-summary.md Key Decisions.
- [x] CHK-042 [P2] N/A: no README changes
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Run state and logs live in the parent's `scratch/`, and phase evidence in this phase's `scratch/` Evidence: `$S/state.jsonl`, `$S/wave-006*.log`, `$P/scratch/evidence.txt`.
- [x] CHK-051 [P1] No parked rewrite is left in a changelog Evidence: `$S/failed/` holds no draft from this phase, because the outage failures produced no draft. The worktree files are the kept rewrites, which `wave-verify.cjs` checked against HEAD.
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
