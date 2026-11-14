---
title: "Implementation Summary"
description: "A Claude Stop that cannot arm a prepared hand-over now stamps the record, so the operator's next prompt withdraws it and question dialogs work again without running cancel."
trigger_phrases:
  - "parked record escape implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/005-parked-record-escape"
    last_updated_at: "2026-11-14T07:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Recorded the parked-record stamp, its tests and the checks run in worktree 373"
    next_safe_action: "None. The code is committed and nothing is merged or pushed without the operator"
    blockers: []
    key_files: [".skilled/hooks/session-relaunch/claude/stop-arm.mjs", ".skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs", ".skilled/hooks/session-relaunch/tests/adapter-conformance.test.cjs"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-parked-record-escape"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Does a live Claude session that Stop could not arm get its dialog back after one prompt? Not run."
    answered_questions:
      - "Did all three paths leave the record unmarked before the fix? Yes, 3 of 3 tests failed on the missing stamp (scratch/red.txt)."
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
| **Spec Folder** | 005-parked-record-escape |
| **Completed** | 2026-11-14 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A Claude session whose Stop could not arm a prepared hand-over no longer stays parked. The record now carries a `deferredAt` stamp, so the next prompt you send withdraws it and the question dialog works again without running `cancel`.

### Phase 5: parked-record-escape

After `prepare`, the dialog guard refuses every question while the relaunch record is pending, because only Stop arms a hand-over and a dialog holds the turn open. Stop has three ways to give up and leave the record pending: the event has no transcript path, no process below the loop can be found to signal, or the arm throws. Before this change none of the three marked the record. Only an armed record or one stamped `deferredAt` is withdrawn by your next prompt, so the record kept refusing dialogs until a later Stop armed it or you ran `cancel`.

`stop-arm.mjs` now has a helper `markParked` that stamps the pending record through the existing `markDeferred` and logs `stop-arm-error stage=defer` if the stamp itself fails. Stop calls it on the three give-up paths, and the background-task deferral, which already stamped inline, calls it too. The shared conformance case for a Stop with no target sets the stamp aside, because Codex Stop does not stamp and parent decision D2 forbids editing the Codex adapter.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/session-relaunch/claude/stop-arm.mjs` | Modified | Adds `markParked` and calls it on the three give-up paths and in the background-task deferral |
| `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` | Modified | Renames two tests to expect the stamp and adds one in-process test where the arm throws |
| `.skilled/hooks/session-relaunch/tests/adapter-conformance.test.cjs` | Modified | Adds `assertStillPending` for the shared no-target case |
| `.skilled/hooks/session-relaunch/README.md` | Modified | Names the stamp on the three paths and what it is for |
| `scratch/red.txt` | Created | The three tests before the source edit, 0 pass and 3 fail |
| `scratch/green.txt` | Created | The same three tests after the edit, 3 of 3 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The research of 2026-11-13 named the gap and ranked the fix third. It found that Stop leaves a record pending on three paths and that only the background-task deferral stamps `deferredAt` (`research/research.md` section 4 and section 9).

The tests were written before the source edit. `scratch/red.txt` shows 3 tests with 0 passing and 3 failing, each on the `deferredAt` assertion. The third test passes `cwd: 1n` to `armPendingRecord`, which makes the arm throw after the target resolved. After the edit `scratch/green.txt` shows 3 of 3 passing.

The code is committed as `eaf24f999e` on branch `worktrees/373-relaunch-gap-fixes`. The orchestrator ran the relaunch and OpenCode plugin suites on that commit's tree: exit 0, 1539 of 1539, from 1538 before. This author reran the three tests and then both changed test files whole on 2026-11-14, on a tree that holds later commits: 115 of 115 with exit 0. Nothing is merged or pushed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| One helper for every stamp Stop writes | Four call sites would otherwise repeat the same try, stamp and log, and the next path that parks a record would need a fourth copy |
| Reuse `markDeferred` and the `deferredAt` field | Parent decision D3 allows no new record key, and `withdraw.cjs` already reads this field |
| Stamp, do not arm | A Stop that cannot find a transcript or a target has no killer to start, so arming would strand an armed record with nothing to signal |
| Set the stamp aside in the shared conformance case | Codex Stop does not stamp such a record and parent decision D2 forbids editing the Codex adapter, so the case keeps asserting the rest of the record and the absence of a killer |
| Make the arm throw with `cwd: 1n` in an in-process test | A value that cannot be written as JSON throws after the target has resolved, which reaches the third path without a mock of the core |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| The three tests before the edit (`scratch/red.txt`) | 3 tests, 0 pass, 3 fail, each on the `deferredAt` assertion |
| The three tests after the edit (`scratch/green.txt`) | 3 of 3, `fail 0`, exit 0, rerun by this author on 2026-11-14 with the same result |
| `claude-adapters.test.cjs` and `adapter-conformance.test.cjs` whole | Exit 0, 115 of 115, run by this author on 2026-11-14 on a tree that holds later commits |
| Relaunch and OpenCode plugin suites | Exit 0, 1539 of 1539, from 1538 before, run by the orchestrator on this commit's tree. This author did not rerun it and no output is saved |
| `node --check` on `stop-arm.mjs` | Exit 0 |
| No new file, Codex adapter unchanged | `git show --stat eaf24f999e` lists four files, no new file, and the diff under `codex/` is empty |
| Strict validation | Recorded in `goal.md` section 4 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Codex Stop still leaves such a record unmarked.** Parent decision D2 forbids editing the Codex adapter, so a Codex session whose Stop cannot arm keeps a pending record with no stamp. The shared conformance case sets the stamp aside for that reason. Running `cancel` clears it. A later change to the Codex adapter would close it.
2. **No live hop was run for this child.** The dialog coming back after one prompt rests on the three unit tests and on `withdraw.cjs` accepting a stamped pending record, read at `lib/withdraw.cjs:27`. A live Claude session whose Stop cannot arm, followed by one prompt and then a question dialog, would confirm it end to end.
3. **The whole-suite count comes from the orchestrator only.** The 1539 of 1539 has no saved output here. This author reran the three tests and the two changed test files, and the latter on a later tree.
4. **A prompt calls the hop off.** A stamped record is withdrawn by the next prompt you send, so a hand-over Stop could not arm is not carried out after that prompt. That is the intended escape and the cost of it.
5. **A failed stamp is not tested.** `markParked` logs `stop-arm-error stage=defer` and returns when `markDeferred` throws. This is read from the code at `stop-arm.mjs:53` to `stop-arm.mjs:59` and no test makes the stamp fail.
<!-- /ANCHOR:limitations -->

---
