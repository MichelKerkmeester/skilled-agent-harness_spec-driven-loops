---
title: "Implementation Summary"
description: "A note prepared with the goal switch off no longer hands on its old goal packet at consume, and three relaunch paths that had no test now have one."
trigger_phrases:
  - "relaunch coverage gaps implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks/023-session-relaunch-loop/033-research-remediation/006-relaunch-coverage-gaps"
    last_updated_at: "2026-10-25T17:45:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Built and verified the record-based goal switch and four tests"
    next_safe_action: "Commit the phase"
    blockers: []
    key_files:
      - ".skilled/hooks/session-relaunch/lib/relaunch-core.cjs"
      - ".skilled/hooks/session-relaunch/bin/session-relaunch.cjs"
      - ".skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs"
      - ".skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs"
      - ".skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-006-relaunch-coverage-gaps"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-relaunch-coverage-gaps |
| **Completed** | 2026-10-25 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A hand-over prepared with `SESSION_RELAUNCH_GOAL=0` no longer passes on the goal packet an earlier prepare left in the note, even when the switch is back on by the time the wrapper consumes. Three relaunch paths that had no test now have one: the OpenCode 2 `--server=URL` form, a runtime binary missing from PATH, and two sessions claiming one note at once.

### Phase 6: relaunch-coverage-gaps

The note cannot tell a packet the current prepare wrote from one it left in place, so the relaunch record now carries the answer. The CLI prepare passes the goal switch to `preparePending`, which writes it as `goalSwitch`. Consume passes that field to `usableGoalPacket`, which refuses the packet only when the field is `false`. A record with no field, written before this change or by a test fixture, keeps the old behavior and reads the switch at consume time. A manual `claim` has no record and still reads the switch at claim time.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` | Modified | `preparePending` takes an optional `goalSwitch` and writes it only when it is a boolean; `usableGoalPacket` takes a fourth `recordedGoalSwitch` and returns '' for a recorded `false` |
| `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs` | Modified | Prepare passes `goalSwitchOn(resolvedSwitches())`; consume passes `record?.goalSwitch`; claim passes nothing |
| `.skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` | Modified | Failing-first test "a reused note with the goal switch off hands on no packet" |
| `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` | Modified | Coverage test "two concurrent claims have one winner" |
| `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` | Modified | Coverage tests "opencode 2 equals-form server warns and keeps the launch" and "missing runtime binary exits 127" |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The baseline ran first: 915 node tests and 59 vitest tests, all passing. The reused-note test went in before the fix and failed on its on-at-consume assertion, which got `goal_packet: specs/hooks/023-session-relaunch-loop` back. Its off-at-consume assertion passed, as the plan expected (`scratch/red-before-reused-note.txt`). After the fix it passed, with the existing consume goal test and both `preparePending` record-shape tests (`scratch/green-after-reused-note.txt`).

The three coverage tests passed on unchanged code. The concurrency test passed five times in a row by hand. For T006 the lock was removed from `claimHandoff` in a scratchpad copy of the core, never in the shared checkout, and the test failed 10 of 10 runs with both claimants winning (`scratch/lock-removed-variant.txt`). The copy was deleted afterwards.

Each new test that builds an environment sets `SYSTEM_SESSION_RELAUNCH_ENABLED: '1'`, so it keeps working once the hooks ship off by default.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Write `goalSwitch` only when the caller passes a boolean | The exact-shape record tests and every fixture that calls `preparePending` without it stay unchanged, and an absent field already means "read the switch at consume" |
| Keep the consume-time switch check ahead of the recorded one | Turning the switch off still stops a packet at consume, so the recorded state can only remove a packet, never add one |
| Leave `skilled-loop`'s seeded first launch and `claim` without a recorded state | Neither has a relaunch record to read; the spec records the claim exposure as a known limit |
| Run the lock-removed variant on a scratchpad copy | Another builder works in this checkout, so the shared core file was never edited for the experiment |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/session-relaunch.test.cjs` | PASS: 924 pass, 0 fail, exit 0 (baseline 915). Of the 9 new, 4 are this phase's and 5 are manual-command tests in `skilled-loop.test.cjs` from the builder working on the manual claim command path (`scratch/final-node.txt`) |
| `npx vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/session-relaunch/pi/session-relaunch.test.ts` | PASS: 59 pass, exit 0, unchanged from baseline (`scratch/final-vitest.txt`) |
| Reused-note test against the old code | FAIL as expected on the on-at-consume assertion, exit 1 |
| Concurrency test with the claim lock removed | FAIL 10 of 10, two winners |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A manual claim can still hand on an old packet.** A note prepared with the switch off and then claimed by hand with the switch on prints its old `Goal packet:` line, because `claim` has no relaunch record. Fixing it needs the switch state on the note itself.
2. **The concurrency test has one flake source.** `withAppendLock` runs its work unlocked once its 2000 ms wait expires, so a machine stalled that long could let both claims through. The test comment names this.
3. **README drift.** `.skilled/hooks/session-relaunch/README.md:176` says `SESSION_RELAUNCH_GOAL=0` makes "`claim` and the wrapper pass nothing on". It does not say that consume now follows the switch as prepare recorded it, nor that a manual claim reads the switch at claim time. The README is out of scope for this phase.
<!-- /ANCHOR:limitations -->
