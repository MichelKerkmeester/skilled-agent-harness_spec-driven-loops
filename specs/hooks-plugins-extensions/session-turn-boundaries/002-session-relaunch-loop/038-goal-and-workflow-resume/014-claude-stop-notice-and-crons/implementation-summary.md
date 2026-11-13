---
title: "Implementation Summary"
description: "A deferred Claude hop now tells the operator what it waits on and how to call it off, and the relaunch log records the session's cron count."
trigger_phrases:
  - "claude stop notice and crons implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/014-claude-stop-notice-and-crons"
    last_updated_at: "2026-11-13T15:30:00Z"
    last_updated_by: "builder"
    recent_action: "Built the deferral notice and the cron count log; tests, suite and validation pass"
    next_safe_action: "None, the phase is complete"
    blockers: []
    key_files: [".skilled/hooks/session-relaunch/claude/stop-arm.mjs", ".skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-014-claude-stop-notice-and-crons"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Do crons end on a hop in a live Claude session? Yes, observed live on 2026-11-13."
    answered_questions:
      - "A Stop hook's systemMessage reaches the operator, confirmed from Claude Code's hook documentation."
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
| **Spec Folder** | 014-claude-stop-notice-and-crons |
| **Completed** | 2026-11-13 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A Claude session that parks its hop because background work is still running now says so at every deferred Stop, and tells the operator how to call the hop off. The relaunch log also records how many session-scoped crons the session held once its hop could arm.

### Phase 14: claude-stop-notice-and-crons

The deferral branch of the Claude Stop adapter keeps its existing record handling and `deferred-background-tasks` line, then prints one JSON line carrying `systemMessage`. The text names the task count, says the hop goes ahead at the first Stop after the tasks finish, says a typed prompt calls it off, and names `node .skilled/hooks/session-relaunch/bin/session-relaunch.cjs cancel`. It carries no `decision` key, so Claude shows the text and still ends the turn.

After the record is found armable, a non-empty `session_crons` array appends one `session-crons` line with `loopId`, `sessionId` and `crons`. An empty, missing or non-array value writes nothing. The count reaches the log only; the cron list stays with the note line that `prepare` already validated, because Stop fires at every turn end and the entry shape is now documented rather than assumed.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/session-relaunch/claude/stop-arm.mjs` | Modified | Writes the deferral `systemMessage` through a `dependencies.write` seam and logs `session-crons` after the armable check. |
| `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` | Modified | Replaces the empty-stdout assertion in the deferral test with the notice parse and adds the cron count test. |
| `scratch/live-crons.txt` | Created | Records the documented `systemMessage` confirmation and the live hop that showed crons and the todo list end with the session. |
| `scratch/red.txt` | Created | Holds the two failing test-first runs. |
| `scratch/green.txt` | Created | Holds the two passing runs after the adapter edit. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every source edit followed a recorded failing test. `scratch/red.txt` holds T005's failure on the empty stdout and T006's failure because no `relaunch.log` existed, both exit 1. `scratch/green.txt` holds the same commands passing with `fail 0`.

T002 was confirmed from Claude Code's hooks reference, fetched 2026-11-13: `systemMessage` is a universal output field shown to the user, and a Stop hook continues the turn only when it returns `decision: "block"`. T001, the live cron hop, needs an interactive Claude login and a throwaway checkout, so it is marked `[B]` for the orchestrator.

The guard tests kept their assertions: the arm, disabled and armed-deferral cases passed 3 of 3. The whole relaunch suite ran 915 tests with 915 pass and `fail 0` at T010, one above the 914-test baseline; the final-state rerun reported 921 tests, 921 pass and `fail 0` after a concurrent builder added six tests. `node --check claude/stop-arm.mjs` exited 0.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| `systemMessage`, never `decision` | A `decision: "block"` would keep the turn alive; the operator needs the notice without the hop changing its behaviour. |
| Count only in the log | The list belongs to the note line `prepare` validated. Stop runs at every turn end, so writing the list there would rewrite a validated note repeatedly. |
| Notice after the deferral mark | The record must be marked first so a prompt sent while it waits can withdraw it; the notice is the last thing the branch does before returning. |
| Write through a seam | Tests and the conformance harness import `armPendingRecord`; a `dependencies.write` default keeps stdout real in the hook and captureable in tests. |
| Failed notice write is logged, not thrown | The hook must exit 0 on every path, so a broken stdout pipe cannot change the exit code. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Deferral notice test | Exit 0, pass 1, `fail 0`; red entry exit 1 |
| Cron count test | Exit 0, pass 1, `fail 0`; red entry exit 1 |
| Guard tests (arm, disabled, armed-deferral) | 3 pass, `fail 0` |
| Whole session-relaunch suite | T010: 915 tests, 915 pass, `fail 0` (baseline 914). Final rerun: 921 tests, 921 pass, `fail 0` |
| `node --check .skilled/hooks/session-relaunch/claude/stop-arm.mjs` | Exit 0 |
| Non-array `session_crons` | Exit 0, notice printed, zero `session-crons` lines |
| Strict validation | `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The live cron hop ran after the build, not before it.** The task order asks for the observation before any edit. A builder may not start a Claude session, so the hop ran on 2026-11-13 after the build and confirmed the claim the build rests on (`scratch/live-crons.txt`). AC-001 is Met.
2. **The notice repeats at every deferred Stop.** That is the intended rate: one line per Stop while the tasks run, so a long task says it is still waiting each turn rather than going silent.
3. **The cron list is not in the notice.** It stays with phase 009's `Scheduled:` note line; this phase records only the count.
<!-- /ANCHOR:limitations -->

---
