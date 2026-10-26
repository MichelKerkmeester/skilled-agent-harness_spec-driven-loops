---
title: "Implementation Summary: Phase 9: pi-arm-on-agent-settled"
description: "The Pi extension now arms a prepared hand-over on agent_settled, so a continuation's agent_start inside the same run can no longer withdraw it."
trigger_phrases:
  - "pi arm on agent settled implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks/023-session-relaunch-loop/033-research-remediation/009-pi-arm-on-agent-settled"
    last_updated_at: "2026-10-25T16:05:00Z"
    last_updated_by: "builder"
    recent_action: "Moved the Pi arm to agent_settled, tests and live hop green"
    next_safe_action: "Orchestrator commits the phase hunks"
    blockers: []
    key_files:
      - ".skilled/hooks/session-relaunch/pi/session-relaunch.ts"
      - ".skilled/hooks/session-relaunch/pi/session-relaunch.test.ts"
      - ".skilled/hooks/session-relaunch/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-009-pi-arm-on-agent-settled"
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
| **Spec Folder** | 009-pi-arm-on-agent-settled |
| **Completed** | 2026-10-25 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A Pi session now arms its prepared hand-over only once Pi has settled the run. Before this, the arm ran on `agent_end`, and in Pi 1.4.0 an auto-retry, a compaction or a queued follow-up starts a fresh agent loop whose `agent_start` withdrew the record a moment after it was armed.

### Phase 9: pi-arm-on-agent-settled

The extension registers a new `agent_settled` handler that runs the arm and the killer restart for an unowned armed record. It returns without arming when the event says `aborted: true`, because an aborted run is the operator stopping it. `agent_end` keeps only the held nudge. A local `AgentSettledRegistrar` type declares the event, since the ambient Pi shim does not, and the spawn-failure log event is now `agent-settled-arm-error`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/session-relaunch/pi/session-relaunch.ts` | Modified | `AgentSettledRegistrar`, the `agent_settled` arm handler, the arm removed from `agent_end`, the log event rename, the doc comment |
| `.skilled/hooks/session-relaunch/pi/session-relaunch.test.ts` | Modified | 16 arm hits now fire `agent_settled`, 7 titles and 2 log assertions renamed, four new tests |
| `.skilled/hooks/session-relaunch/README.md` | Modified | Lines 138 and 223 name `agent_settled` as Pi's arm event |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Baselines first (vitest 54 pass, node 892 pass, tsc exit 0). Then the four new tests went in and ran red (`scratch/red-before.txt`). Then came the code change and the sort of all 36 `'agent_end'` test hits (`scratch/agent-end-inventory.txt`). After that, the three gates were rerun, and one live Pi 1.4.0 hop ran through `skilled-loop` with `openai/gpt-6-luna` (`scratch/pi-settled-live/`). The first hop attempt stopped before prepare because the harness looked for the Pi session under the unresolved `$TMPDIR` path. The second run used the resolved path (`pwd -P`) and passed. The first attempt's summary is kept in `scratch/pi-settled-live-attempt1/`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The arm moves to `agent_settled` | Pi 1.4.0 emits it once per `_startRun`, from the `finally` block (`dist/core/agent-session.js:1471` calling `_emitAgentSettled` at `:683-690`). That is after the retry, compaction and continuation loop (`:1450-1462`), and it also fires when the run errors. Read in the installed package `~/.pi/agent/install/releases/1.4.0/node_modules/@earendil-works/pi-coding-agent` |
| The held nudge stays on `agent_end` | A follow-up queued at `agent_end` makes `_handlePostAgentRun` return true (`agent-session.js:1562-1564`), so the loop continues the same run and `agent_settled` fires only after the prepare turn. Checked by the test "agent_end alone sends the held nudge as a follow-up and leaves the record pending" |
| Skip the arm on `aborted: true` | The payload is `{ aborted }` (`dist/core/extensions/types.d.ts:801-805`), set from `_agentRunAbortRequested` (`agent-session.js:688`) |
| The AC-007 test writes the pending record after the first `agent_end` | A this-session pending record that is present when the held nudge is checked retires the nudge by design (`handoffPending`, existing test "agent_end stays quiet when the prepare call left a pending handoff"). So the test follows the real order: the nudge goes out, the prepare turn writes the record, and that continuation's `agent_end` leaves it pending |
| Type check with the local TypeScript 7.0.2 at `.pi/extensions/pi-cache-optimizer/node_modules/.bin/tsc` | The repository root has no `typescript`, so `npx tsc` offers to install one. A copy with a misspelled event fails with TS2345, so the check really reads the registrar (`scratch/tsc-negative-control.txt`) |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| vitest Pi suite | PASS, 59 of 59, exit 0 (`scratch/final-vitest.txt`); baseline 54 |
| `tsc -p tsconfig.pi.json` | PASS, exit 0 (`scratch/final-tsc.txt`), negative control exit 1 |
| node:test hooks and OpenCode plugin | PASS, 896 of 896, exit 0 (`scratch/final-node.txt`); baseline 892, the 4 extra come from other phases |
| Red before | 4 new tests failed on the old code (`scratch/red-before.txt`) |
| Live Pi hop | PASS, `relaunch-record-armed.json` holds `"status":"armed"`, `note-final.md` shows `status: done` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The live hop does not prove the change.** A hop succeeds on either arm event. The unit test "a continuation before agent_settled leaves the record armed" is the proof.
2. **One killer test failed once under load.** "killer keeps the record armed when the target exits during its grace period" failed in `scratch/after-node.txt` while the live hop ran beside it. It passed 3 of 3 alone and in the final full run. No node test loads the Pi extension. Timing under load is the inferred cause.
3. **The harness path trap.** `run-pi-effort.sh` builds the Pi session folder from the sandbox path as given, so on macOS the sandbox path must be the resolved one (`pwd -P`), or the hop stops with "no sender session id".
<!-- /ANCHOR:limitations -->
