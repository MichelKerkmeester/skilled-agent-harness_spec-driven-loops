---
title: "Implementation Summary"
description: "A hand-over withdrawn after the wrapper approved the hop no longer relaunches: consume reads, judges and removes the record under the withdraw's lock and reports withdrawn: true, which the wrapper treats as a decline."
trigger_phrases:
  - "consume locked withdraw implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks/023-session-relaunch-loop/033-research-remediation/002-consume-locked-withdraw"
    last_updated_at: "2026-10-25T17:00:00Z"
    last_updated_by: "builder-002"
    recent_action: "Built the locked consume and the wrapper decline, ran the new tests red then green"
    next_safe_action: "Orchestrator commits the phase and refreshes the parent changelog entry"
    blockers: []
    key_files:
      - ".skilled/hooks/session-relaunch/bin/session-relaunch.cjs"
      - ".skilled/bin/skilled-loop"
      - ".skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs"
      - ".skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "builder-002-consume-locked-withdraw"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The withdrawn declines on the cwd-failure paths exit with the runtime's code, not 1, because a withdrawn hop had nothing to relaunch"
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
| **Spec Folder** | 002-consume-locked-withdraw |
| **Completed** | 2026-10-25 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A hand-over you withdraw after the wrapper has approved the hop can no longer relaunch. Before, consume read the record outside its lock and never looked at it again, so a `cancel` from another shell or a late hook that landed between `should-relaunch` and `consume` was lost and the next session started anyway.

### Phase 2: consume-locked-withdraw

`consume` now reads the record, judges it and unlinks it inside one `withAppendLock` call, the same lock a withdraw takes. A record whose status is `disarmed` with a reason in `WITHDRAWN_DISARM_REASONS` adds `withdrawn: true` to the output. Every other record prints exactly what it printed before. The hand-over note is parsed after the lock, so a slow note never holds a withdraw up.

The wrapper checks the new field right after each `consume_record` on the approved path. On the main path it prints the same withdrawn warning the declined path prints and exits with the runtime's own code, before `record_hand_over` and before any relaunch. The cwd-failure paths and the Ctrl-C path skip their claim command the same way, and still warn about a different note an earlier hop seeded and never claimed.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs` | Modified | Read, judge and unlink the record under one lock; add `withdrawn: true` only for a withdrawn record |
| `.skilled/bin/skilled-loop` | Modified | `consumed_withdrawn` and `decline_withdrawn` helpers, and a withdrawn check after each consume on the approved path |
| `.skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` | Modified | Four consume tests: withdrawn for both reasons, read under the lock, no key for an armed or other disarmed record |
| `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` | Modified | A stub that cancels through the real CLI right before consume, and two decline tests (main path, Ctrl-C path) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The six new tests went in first and ran against the unchanged code: five failed for the intended reason and the guard passed (`scratch/red-before-full-suite.txt`, 902 tests, 897 pass, 5 fail). The main-path wrapper test showed the race itself: the runtime started a second time. After the change the whole relaunch suite and the Pi test were rerun (`scratch/green-after-full-suite.txt`, `scratch/green-after-vitest.txt`). `withdraw.test.cjs` needed no change, because the wrapper stub drives the real `cancel` command. No live proof is required; the interleaving is deterministic in tests.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| `consumed_withdrawn` matches `"withdrawn":true` in the JSON string | Consume prints compact `JSON.stringify` output, which escapes every quote inside a value, so only a real field can match, and the approved path spawns no extra process |
| Withdrawn declines on the cwd-failure paths exit with the runtime's code instead of 1 | A withdrawn hop had nothing to relaunch, so the unusable cwd is not a wrapper failure; this follows the goal's decline rule |
| The unlink moved before the note parse | The lock then covers only the record read and the unlink, and the record is removed in every outcome, as before |
| The wrapper decline is a helper used only on the approved path | The declined path's own withdrawn branch is tied to its `manual_command_printed` flow, and rewriting it was outside this phase |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Red before: new tests on unchanged code | 902 tests, 897 pass, 5 fail: the four withdrawn and lock tests plus both wrapper tests (`scratch/red-before-full-suite.txt`) |
| Full node suite after | 906 tests, 903 pass, 3 fail, exit 1. All six new tests pass. The three failures are `readClaudeSettings` tests in `context-usage.test.cjs`, the in-flight work of the phase 001 follow-up, outside this phase |
| Pi vitest | 59 passed, exit 0 |
| `bash -n .skilled/bin/skilled-loop` | exit 0 |
| `shellcheck -S warning .skilled/bin/skilled-loop` | exit 0, no findings |
| `node --check` on `session-relaunch.cjs` | exit 0 |
| Exact-shape consume tests unedited | `git diff --numstat` on `session-relaunch-cli.test.cjs`: 69 added, 0 removed |
| Live proof | Not required by the plan |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The full suite is not green in the shared checkout.** Three `readClaudeSettings` tests in `context-usage.test.cjs` fail on the phase 001 follow-up's uncommitted work. They exercise `context-usage.cjs`, which this phase does not touch.
2. **The parent changelog entry is not refreshed.** The phase context asks for it on close, but `../changelog/` is outside this build's write scope.
<!-- /ANCHOR:limitations -->

---
