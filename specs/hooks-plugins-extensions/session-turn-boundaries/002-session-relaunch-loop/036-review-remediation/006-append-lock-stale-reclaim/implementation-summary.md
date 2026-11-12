---
title: "Implementation Summary: A stale append lock is reclaimed by one waiter at a time"
description: "A waiter that finds a stale append lock now takes a reclaim directory, reads the lock's age again and removes it only when it is still stale, so waiters can no longer hold one lock together, and a record lock is never created inside an unsafe state directory."
trigger_phrases:
  - "append lock stale reclaim implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/006-append-lock-stale-reclaim"
    last_updated_at: "2026-11-12T15:11:53Z"
    last_updated_by: "generate-context"
    recent_action: "Fixed the four second-review findings and reran the gate"
    next_safe_action: "Await the operator's decision on merging worktree 351"
    blockers: []
    key_files:
      - ".skilled/hooks/session-relaunch/lib/relaunch-core.cjs"
      - ".skilled/hooks/session-relaunch/lib/nudge.cjs"
      - ".skilled/bin/skilled-loop"
      - ".skilled/bin/skilled-loop-shell.sh"
    session_dedup:
      fingerprint: "sha256:02f8aa3d8a665d87c9de4050ad66e48691b278c87a5c82ba25bdbce31c1955f6"
      session_id: "scaffold-006-append-lock-stale-reclaim"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "6f6d0815-5182-4dab-96b0-b36b0b73deea"
      workspace: "/Users/michelkerkmeester/worktrees/public/351-session-relaunch-review-remediation"
      savedAt: "2026-11-12T15:11:53Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-append-lock-stale-reclaim |
| **Completed** | 2026-11-12 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Two sessions can no longer write one relaunch record or one handoff note at the same time after a stale lock. Only one waiter at a time may reclaim a stale lock, and it reads the lock's age again before it removes anything. A lock for a relaunch record is also no longer created inside a state directory that failed the safety check.

### Phase 6: append-lock-stale-reclaim

`withAppendLock` serializes the log, the relaunch records and the handoff notes with a lock directory. A lock older than ten seconds counts as abandoned. Before this phase every waiter that saw such a lock removed it by path, so a second waiter could remove the fresh lock the first one had just taken, and both then ran their critical section.

A waiter now creates `<lock>.reclaim` first. While it holds that directory it reads the lock's age again and removes the lock only when it is still stale. A waiter that finds the reclaim directory taken waits and tries again. The wait bound of two seconds and the fallback that runs without a lock stay as they were.

The phase also carries a finding from the review of phase 002. A new helper, `withStateLock`, takes the lock for a relaunch record and skips it when the state directory is a symlink or belongs to another account. The five record writers use it. Handoff notes keep the plain lock, so a note in a linked directory still gets one.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` | Modified | The stale branch of `withAppendLock` reclaims under `<lock>.reclaim` with a second age read. `withStateLock` is added and exported, and `arm`, `markSignalled`, `unarm`, `markDeferred` and `withdrawRecord` use it |
| `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` | Modified | Adds the two-waiter case, the eight-waiter case over six rounds, the unsafe-state-directory case and the `arm` case |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek V4.1 Flash at max built the change through OpenCode Go in three passes, each test first, and the orchestrator reran every command outside the builder's session. The first pass followed the orchestrator's brief, a rename without the identity check, and its two-waiter test passed. The orchestrator then wrote a stress probe: one stale lock, eight processes that start at the same instant, an exclusive marker file as the overlap detector. It measured 318 overlapping critical sections in 60 rounds for that build and 77 on the unchanged checkout. The design frozen in this phase's goal, rename with an inode check and a rename back, measured 127 to 176 in a scratch copy and 0 with two waiters. A reclaim directory with a second age read measured 0 in 180 rounds of eight waiters and 30 rounds of sixteen. The operator chose the reclaim directory, and the goal, spec, plan and tasks were amended. The second pass built it with `scratch/red-2.txt` (1 test, 1 fail). SWE reviewed the diff read-only through Devin and returned CONDITIONAL with one P1 and two P2. The P1, `arm` still on the generic lock, was confirmed in the source and fixed in the third pass with `scratch/red-3.txt` (1 test, 1 fail), along with a stale test comment. The second P2 is limitation 1. After the last pass the probe measured 0 overlaps in two more runs of 60 rounds. The final runs are `scratch/green.txt`, `scratch/green-full.txt` and `scratch/green-opencode.txt`. The evidence is pinned to the diff range `5dafa313e8..working tree` on branch `worktrees/351-session-relaunch-review-remediation`. Nothing is committed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The reclaim runs under a reclaim directory with a second age read | The rename design moves a fresh lock off its path for a moment, and a third waiter can take the free path. Measured: 127 to 176 overlaps per 60 rounds against 0 |
| The operator decided the design change | The phase goal froze the rename design, and a frozen decision is the operator's to amend |
| An abandoned reclaim directory is removed by age | A waiter killed inside the reclaim would otherwise block every later reclaim of that lock |
| `withStateLock` is a separate helper | `withAppendLock` also serializes handoff notes, and a note in a linked handoffs directory must keep its lock |
| A state directory that does not exist yet keeps the lock | The writer creates the directory under the lock and then meets the same check |
| The eight-waiter case runs six rounds | The broken builds overlapped in most rounds, so six rounds fail reliably and keep the file fast |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` | PASS: 148 tests, 148 pass, 0 fail, exit 0, in `scratch/green.txt` |
| The new cases before each fix | FAIL as required: 2 tests, 2 fail in `scratch/red.txt`, 1 test, 1 fail in `scratch/red-2.txt` and 1 test, 1 fail in `scratch/red-3.txt` |
| Stress probe, one stale lock, eight waiters, 60 rounds | PASS: 0 overlaps in five runs, and 0 in 30 rounds of sixteen waiters. The same probe measured 318 for the first build, 127 to 176 for the frozen design and 77 for the unchanged checkout. A control with no stale lock measured 0 |
| `node --check .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` | PASS: exit 0 |
| `node --test .skilled/hooks/session-relaunch/tests/*.test.cjs` | PASS: 861 tests, 861 pass, 0 fail, exit 0, in `scratch/green-full.txt` (855 after phase 005, and the count includes the two phase 007 cases) |
| `node --test .opencode/plugins/tests/session-relaunch.test.cjs` | PASS: 65 tests, 65 pass, 0 fail, exit 0, in `scratch/green-opencode.txt` |
| Pi vitest suite | PASS: 59 passed, exit 0 |
| SWE review through Devin, read-only | CONDITIONAL with one P1 and two P2. The P1 and one P2 fixed in the third pass, one P2 recorded as limitation 1 |
| Second SWE review through Devin, read-only, on the later passes | PASS with one P2 on `withStateLock`: `arm` threw `ENOTDIR` when the runtime directory is a regular file, where the unchanged checkout returns `null`. Fixed, with `scratch/red-4.txt` (1 test, 1 fail), and the file then ran 149 of 149. The stress probe repeated with 0 overlaps in two runs of 60 rounds with eight waiters and one of 30 rounds with sixteen |
| `validate.sh --strict` on this packet | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Removing an abandoned reclaim directory is itself a check and then an act.** It needs a waiter killed inside the reclaim, which lasts three system calls, and then three more waiters in one exact order. The outcome would be the old defect once. The probe cannot reach it. A fix would apply the inode comparison from `killer.cjs` to that removal.
2. **A holder that runs longer than ten seconds can still lose its lock.** The stale bound is unchanged. A critical section here is one file write.
3. **The stress probe is not part of the suite.** It lives in the session scratchpad. The eight-waiter case in the test file is its short form.
4. **Only `arm` has a case for a state directory that cannot be inspected.** `markSignalled`, `unarm`, `markDeferred` and `withdrawRecord` take the same path through `withStateLock` and run unlocked there, but no test calls them with a runtime directory that is a regular file.
<!-- /ANCHOR:limitations -->

---


