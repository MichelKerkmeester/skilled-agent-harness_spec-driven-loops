---
title: "Tasks: Phase 21: goal-scan-large-log"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "goal scan large log tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 21: goal-scan-large-log

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

**Task variables**: `RL` is `.skilled/hooks/session-relaunch`. `PHASE` is this phase folder. `FIX` is the commit that lands this phase.

**Test environment**: run every suite as `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test <file>`, because a dispatched child marker and an inherited OpenCode database path both change how the relaunch tests behave.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Take the suite baseline before any edit (`RL/tests`). Verify: `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0, and its `tests`, `pass` and `fail` lines and the exit status are saved in `PHASE/scratch/baseline.txt`.
- [ ] T002 Confirm the cap, the refusal and the two partial-read assertions (`RL/lib/relaunch-core.cjs`, `RL/tests/relaunch-core.test.cjs`). Verify: the three commands of `spec.md` Measured Behavior print lines 61, 687, 2876, 2944, 58 and 59, each exit 0.
- [ ] T003 Confirm the fallback and the mark already run on a whole read (`RL/lib/relaunch-core.cjs`). Verify: `sed -n '683,695p' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` shows the claimed-note mark, the `whole` check and the two-level fallback, saved to `PHASE/scratch/fallback.txt`.

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Change the partial-read assertion in `resolveGoalPacket leaves an ended or unreadable Claude goal uncarried` to expect the packet goal for 17 one-MB filler lines with no goal entry, and add a `claudeResult` helper that returns `resolveGoalPacketResult` for the same log (`RL/tests/relaunch-core.test.cjs`). Verify: `node --check .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0.
- [ ] T005 Add the ended-goal-before-the-tail case to the same test: `[goalStatus({ met: true, condition }), ...17 filler lines]` must return `{ packet: '', reason: '', ended: true }` (`RL/tests/relaunch-core.test.cjs`). Verify: `node --check .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0.
- [ ] T006 Run the changed test before the source edit (`PHASE/scratch/red.txt`). Verify: `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test --test-name-pattern='ended or unreadable Claude goal' .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 1 with `fail 1`, and the failure names the empty packet and the `ended: false` result.
- [ ] T007 Add `GOAL_LOG_SCAN_CHUNK_BYTES = 64 * 1024` and the shared `goalEntryFromLogLine` helper, and make `readLogTail` return `start` (`RL/lib/relaunch-core.cjs`). Verify: `node --check .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` exits 0.
- [ ] T008 Add `latestGoalLogEntryBefore` and call it from `latestGoalLogEntry` when the capped tail holds no entry (`RL/lib/relaunch-core.cjs`). The scan reads `[0, tail.start)`, keeps a remainder as bytes, skips lines without `goal`, joins the remainder with the tail's first partial line before parsing it, and returns `{ latest, whole: true }`. Verify: `node --check .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` exits 0.
- [ ] T009 Correct the comment above the cap so it says the tail is widened and the bytes before it are read in fixed chunks when the tail holds no entry (`RL/lib/relaunch-core.cjs`). Verify: `git diff -- .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` shows the comment, and no added comment names a packet, phase, task or finding number.
- [ ] T010 Correct the comment above the second partial-read assertion so it says the log is read whole and holds no goal entry, and the claimed note still speaks (`RL/tests/relaunch-core.test.cjs`). Verify: `rg -c 'a log read only in part' .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` prints nothing with exit 1.
- [ ] T011 Correct the sentence on a large log (`RL/README.md`). Verify: `rg -c 'fixed chunks' .skilled/hooks/session-relaunch/README.md` prints 1 or more and `rg -c 'A log too large to read whole is treated as unproven' .skilled/hooks/session-relaunch/README.md` prints nothing with exit 1.

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 Run the changed test (`RL/tests/relaunch-core.test.cjs`). Verify: the command of T006 exits 0 with `fail 0`, saved to `PHASE/scratch/green.txt`.
- [ ] T013 Run the whole goal test file (`RL/tests/relaunch-core.test.cjs`). Verify: `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0 with `fail 0`, saved to `PHASE/scratch/relaunch-core.txt`.
- [ ] T014 Run the relaunch and OpenCode plugin suites (`RL/tests` and `.opencode/plugins/tests`). Verify: the command of T001 exits 0 with `fail 0` and the `tests` count in `PHASE/scratch/baseline.txt`, saved to `PHASE/scratch/final-suite.txt`.
- [ ] T015 Check that the fix adds no file, no record key and no log event (`FIX`). Verify: `git show --diff-filter=A --name-only FIX | rg -v '021-goal-scan-large-log/'` prints nothing with exit 1, and `git show FIX -- .skilled/hooks/session-relaunch | rg -c "^\+.*logEvent\('"` prints nothing with exit 1.
- [ ] T016 Validate the phase folder (`PHASE`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/021-goal-scan-large-log --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] Every task is resolved: T001 to T016 are complete, and T015 ran against the fix commit.
- [ ] No `[B]` blocked tasks remaining: no task is blocked.
- [ ] Manual verification passed: `scratch/red.txt` shows both changed assertions failing and `scratch/green.txt` shows them passing.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **The fallback this reader feeds**: `../002-packet-goal-fallback/`
- **The mark that still decides on a whole read**: `../010-goal-ending-carry/`
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

A blocked task is marked `[B]` with its reason in `goal.md`. A `[B]` on T001 blocks every implementation task, because the count in T014 is read against the baseline.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md: `rg -c '^\| REQ-' spec.md` prints 6.
- [ ] CHK-002 [P0] Technical approach defined in plan.md: `rg -c '^## 3. ARCHITECTURE' plan.md` prints 1.
- [ ] CHK-003 [P1] The baseline count is saved before the first edit (T001).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `node --check` exits 0 on the core and the test file (T004, T007, T008).
- [ ] CHK-011 [P0] The tail loop and the head scan parse a line through one helper, so the two cannot drift.
- [ ] CHK-012 [P1] The scan reads no byte twice and holds one 64 KiB buffer plus one line.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] AC-001 and AC-002 pass with their commands. `scratch/red.txt` shows both failing before the edit and `scratch/green.txt` shows both passing after.
- [ ] CHK-021 [P0] The big-log fallback failed before the source edit (`scratch/red.txt`).
- [ ] CHK-022 [P1] The existing goal tests, including the claimed-last mark and the fallback bound, still pass in `scratch/relaunch-core.txt`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [ ] CHK-FIX-001 [P0] The finding class is `class-of-bug`: every log size and every goal position is checked against one newest-entry rule.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory: `rg -n 'readLogTail|latestGoalLogEntry' .skilled` prints the reader, its caller and the tests, and no second reader exists.
- [ ] CHK-FIX-003 [P0] Consumer inventory: `claudeGoalPacketResult` reads `{ latest, whole }` at `lib/relaunch-core.cjs:674`, and no other code reads the helper's result.
- [ ] CHK-FIX-004 [P0] N/A: no security, path, parser or redaction fix.
- [ ] CHK-FIX-005 [P1] Matrix axes listed in plan.md: log size crossed with result. All rows are named.
- [ ] CHK-FIX-006 [P1] The tests run with `AI_SESSION_CHILD` and `OPENCODE_DB` unset. Every saved command line begins `env -u AI_SESSION_CHILD -u OPENCODE_DB`.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to the fix commit, named in `goal.md` section 4.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secrets: the change reads no credential.
- [ ] CHK-031 [P0] No goal text is printed or logged by the scan.
- [ ] CHK-032 [P1] N/A: no auth surface.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` all name the whole read and the newest entry.
- [ ] CHK-041 [P1] Both corrected comments name no packet, phase or task number (T009, T010).
- [ ] CHK-042 [P2] The shared README names the whole read (T011).
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Test runs live under `scratch/` only.
- [ ] CHK-051 [P1] No 17 MB fixture log is left on disk outside `scratch/`, and none is committed.
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
