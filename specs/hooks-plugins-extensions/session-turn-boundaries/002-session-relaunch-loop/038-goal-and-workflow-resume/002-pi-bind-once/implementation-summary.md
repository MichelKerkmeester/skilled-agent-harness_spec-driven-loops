---
title: "Implementation Summary: Pi binds a hop goal once per process"
description: "The Pi extension clears the hand-over packet variable after its first bind attempt, so a later session in the same process or a nested runtime gets no goal it did not ask for."
trigger_phrases:
  - "pi bind once implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/002-pi-bind-once"
    last_updated_at: "2026-11-13T03:55:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Closed the phase after the build, the review fixes and the final suite run"
    next_safe_action: "None; phase closed"
    blockers: []
    key_files:
      - ".skilled/hooks/goal/pi/goal-context.ts"
      - ".skilled/hooks/goal/pi/goal-pi.test.mjs"
    session_dedup:
      fingerprint: "sha256:09af83f754e0e458a9103b8a577c0551ea0ca3bae5718b5c652380d77b865fb6"
      session_id: "scaffold-002-pi-bind-once"
      parent_session_id: null
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
| **Spec Folder** | 002-pi-bind-once |
| **Completed** | 2026-11-12 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A hopped Pi session no longer pushes its goal into every session you open afterwards. `/new`, `/resume` and `/fork` in that process start without the hop goal.

### Phase 2: pi-bind-once

Pi starts new sessions inside one process. The hand-over guard was per session id, and the packet variable stayed in the environment, so each new session id was bound to the hop goal. The extension now deletes the variable after the first attempt that has a session id, inside `finally`, so a throw cannot leave it behind. A runtime started from the receiver's shell inherits nothing either.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/goal/pi/goal-context.ts` | Modified | Clears the packet variable after the first hand-over attempt |
| `.skilled/hooks/goal/pi/goal-pi.test.mjs` | Modified | A second session start with a new id binds nothing |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek V4.1 Flash max built it through OpenCode, test first: `scratch/red.txt` shows 28 pass and 1 fail, the new case, and `scratch/green.txt` 29 of 29. An independent Opus 5.5 review of the whole diff stalled after an hour and was stopped. The orchestrator finished the review from the experiments it left behind and by reading each change. The orchestrator reran every suite outside the builders' sandboxes from the final working tree: relaunch and OpenCode plugin suites 1471 of 1471, goal hook suites 200 of 200, Pi relaunch suite 59 of 59, each exit 0.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Delete the variable instead of adding a process flag | One deletion closes both the later-session bind and the nested-runtime leak |
| The deletion sits in `finally` | A bind that throws must not leave the packet for the next session |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test .skilled/hooks/goal/pi/goal-pi.test.mjs` | PASS: 29 tests, 29 pass, 0 fail |
| The new case before the change | FAIL as required: 28 pass, 1 fail in `scratch/red.txt` |
| `node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs`, loop variables unset | PASS: 1471 tests, 1471 pass, 0 fail, exit 0 |
| Goal hook suites under `.skilled/hooks/goal` | PASS: 200 tests, 200 pass, 0 fail, exit 0 |
| Pi relaunch vitest file | PASS: 59 passed, exit 0 |
| `validate.sh --strict` on this packet | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Cursor and Devin keep the per-session behaviour.** Their hooks run as one process per event, so there is no process to remember an attempt. A second session there can still bind the inherited packet.
2. **Not run on a live Pi.** The case drives the extension with events. No Pi session was started.
<!-- /ANCHOR:limitations -->

---


