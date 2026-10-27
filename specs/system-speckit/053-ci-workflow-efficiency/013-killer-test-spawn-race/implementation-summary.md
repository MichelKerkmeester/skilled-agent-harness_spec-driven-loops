---
title: "Implementation Summary"
description: "The killer test suite no longer races the target's SIGTERM handler: targets report readiness after installing it and the tests wait for that report instead of the spawn event."
trigger_phrases:
  - "killer test spawn race implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/053-ci-workflow-efficiency/013-killer-test-spawn-race"
    last_updated_at: "2026-10-27T21:50:00Z"
    last_updated_by: "claude-sonnet-5-5"
    recent_action: "Fixed the killer test spawn race; 10 of 10 runs pass"
    next_safe_action: "None; the conductor lands the commit"
    blockers: []
    key_files:
      - ".skilled/hooks/session-relaunch/tests/killer.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-27-013-killer-test-spawn-race"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 013-killer-test-spawn-race |
| **Completed** | 2026-10-27 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The session-relaunch killer tests no longer depend on runner speed. A target now tells the test when its SIGTERM handler is installed, and the test waits for that message before it starts the killer. The one CI failure in 40 runs (`ENOENT ... target-signal`) came from the killer signalling a target that had spawned but not yet run its handler.

### Readiness handshake

`startTarget` and `startCountingTarget` print `sigterm-handler-ready` right after `process.on('SIGTERM')`. `waitForTargetReady` listens for that line and rejects with the pid and the reason when the child exits, errors, or stays silent for 15 s. Forty `once('spawn')` waits moved to it, plus one inside a `Promise.all`. Targets from `startPersistentProcess` and the `sleep` children install no handler, so they keep the spawn wait.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/session-relaunch/tests/killer.test.cjs` | Modified | Ready line in two target scripts, `waitForTargetReady`, 41 waits switched |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

I measured the unforced file first, then forced the race in scratch copies outside the repo by inserting a 600 ms busy wait ahead of the handler in both target scripts. The old file failed and the fixed file passed under the same forcing. Then the fixed file ran ten times unforced.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Ready line on stdout, not a ready file | The wait needs no polling, and a pipe delivers the line the moment the handler exists |
| Wait helper takes the child, not a spawn promise | Each test keeps its own spawn call and only the wait changes |
| Persistent and `sleep` targets unchanged | They have no handler, so the default action is what the tests expect |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Old file, unforced, `node --test` | pass 64, fail 0, 38.2 s |
| Old file, 600 ms handler delay | pass 47, fail 17, 30.2 s; failures are `ENOENT ... target-signal`, including the CI flake |
| Fixed file, 600 ms handler delay | pass 64, fail 0, 65.6 s (each target waits out the delay) |
| Fixed file, unforced, 10 runs | all 10: exit 0, pass 64, fail 0; 39 to 41 s each (old file: 38.2 s) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A target that never prints the ready line fails after 15 s.** The error names the pid and the limit; raise `TARGET_READY_TIMEOUT_MS` if a slower runner needs more.
<!-- /ANCHOR:limitations -->

---
