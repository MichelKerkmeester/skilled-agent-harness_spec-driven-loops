---
title: "Implementation Summary: The printed manual command runs as typed"
description: "A shell that sources the shim has a skilled-loop function, so the manual claim command the wrapper prints can be pasted and run."
trigger_phrases:
  - "skilled loop command implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/006-skilled-loop-command"
    last_updated_at: "2026-11-13T03:55:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Closed the phase after the build, the review fixes and the final suite run"
    next_safe_action: "None; phase closed"
    blockers: []
    key_files:
      - ".skilled/bin/skilled-loop-shell.sh"
      - ".skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs"
    session_dedup:
      fingerprint: "sha256:153b3b224ad9695eff9a102548f3ee0a8d2848cef289cbf229b0ba28b2c22f16"
      session_id: "scaffold-006-skilled-loop-command"
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
| **Spec Folder** | 006-skilled-loop-command |
| **Completed** | 2026-11-12 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

When a hop is declined the wrapper prints `skilled-loop <runtime> ...` for you to run. That line now works when you paste it.

### Phase 6: skilled-loop-command

The shim defined a function for each runtime and none for `skilled-loop`, and the wrapper is not on the path. The shim now defines `skilled-loop`, which runs the wrapper of the checkout that owns the shim. It never takes a wrapper from the current folder. When the shim does not know its checkout, it prints one line and returns 127.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/bin/skilled-loop-shell.sh` | Modified | A `skilled-loop` function that runs the owning checkout's wrapper |
| `.skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs` | Modified | The function exists after sourcing, and a missing checkout is reported |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek V4.1 Flash max built it through OpenCode, test first, and checked `bash -n` and `zsh -n` on the shim. The review found that an empty checkout variable ran a path under the file system root, which a follow-up pass replaced with a message and exit 127. An independent Opus 5.5 review of the whole diff stalled after an hour and was stopped. The orchestrator finished the review from the experiments it left behind and by reading each change. The orchestrator reran every suite outside the builders' sandboxes from the final working tree: relaunch and OpenCode plugin suites 1471 of 1471, goal hook suites 200 of 200, Pi relaunch suite 59 of 59, each exit 0.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A function in the shim, not a new printed text | Tests pin the printed command, and the shim is where the runtime names already live |
| The wrapper comes from the checkout that owns the shim | A pasted claim must not start a wrapper from a cloned repository |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test .skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs` | PASS in the final full run |
| `bash -n` and `zsh -n` on the shim | PASS: exit 0, reported by the builder |
| `skilled-loop-wrapper-claim-goal.test.cjs` | PASS: the printed `skilled-loop cursor` and `skilled-loop devin` text is unchanged |
| `node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs`, loop variables unset | PASS: 1471 tests, 1471 pass, 0 fail, exit 0 |
| Goal hook suites under `.skilled/hooks/goal` | PASS: 200 tests, 200 pass, 0 fail, exit 0 |
| Pi relaunch vitest file | PASS: 59 passed, exit 0 |
| `validate.sh --strict` on this packet | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Only in a shell that sources the shim.** Elsewhere the name is still not found, and the bare runtime name skips the wrapper.
<!-- /ANCHOR:limitations -->

---


