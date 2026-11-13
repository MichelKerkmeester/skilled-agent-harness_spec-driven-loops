---
title: "Implementation Summary: A Claude claim arrives with the enable switch off"
description: "The Claude start hook delivers the claim whenever the wrapper replaced the start prompt, also when the Claude enable switch is off. The master and kill switches still silence it."
trigger_phrases:
  - "claude start claim implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/004-claude-start-claim"
    last_updated_at: "2026-11-13T03:55:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Closed the phase after the build, the review fixes and the final suite run"
    next_safe_action: "None; phase closed"
    blockers: []
    key_files:
      - ".skilled/hooks/session-relaunch/claude/compact-pointer.mjs"
      - ".skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs"
    session_dedup:
      fingerprint: "sha256:5e1c53f6cc894ed281c4c63bf1e59caa4948a84bc7b9be20c832443307f78cc8"
      session_id: "scaffold-004-claude-start-claim"
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
| **Spec Folder** | 004-claude-start-claim |
| **Completed** | 2026-11-12 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A note written on Pi or OpenCode and claimed with `claude` is no longer left unread when the Claude relaunch switch is off. The receiver gets its claim steps and the goal.

### Phase 4: claude-start-claim

The wrapper replaces the start prompt with the goal command and moves the claim into the environment. The start hook then delivers the claim. With the Claude enable switch off the hook left early, so the session worked the goal and the note stayed open. The claim branch now runs before the enable check. The master switch and the concern kill switch still stop the whole hook, and the compaction path is unchanged.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/session-relaunch/claude/compact-pointer.mjs` | Modified | The start claim runs before the enable check |
| `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` | Modified | The claim with the switch off, and silence under the master switch |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek V4.1 Flash max built it through OpenCode, test first: `scratch/red.txt` shows 64 pass and 1 fail, `scratch/green.txt` 65 of 65. The review asked for a guard under the master switch, which a follow-up pass added. An independent Opus 5.5 review of the whole diff stalled after an hour and was stopped. The orchestrator finished the review from the experiments it left behind and by reading each change. The orchestrator reran every suite outside the builders' sandboxes from the final working tree: relaunch and OpenCode plugin suites 1471 of 1471, goal hook suites 200 of 200, Pi relaunch suite 59 of 59, each exit 0.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Deliver the claim in the hook, not guard the swap in the wrapper | Guarding the swap would keep the hook silent but lose the native goal |
| The master and kill switches still win | They say stop everything. An enable switch that is merely off does not |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` | PASS in the final full run |
| The new case before the change | FAIL as required: 64 pass, 1 fail in `scratch/red.txt` |
| `node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs`, loop variables unset | PASS: 1471 tests, 1471 pass, 0 fail, exit 0 |
| Goal hook suites under `.skilled/hooks/goal` | PASS: 200 tests, 200 pass, 0 fail, exit 0 |
| Pi relaunch vitest file | PASS: 59 passed, exit 0 |
| `validate.sh --strict` on this packet | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not run in a live Claude session.** The cases feed the hook a start payload.
2. **The claim needs the wrapper.** Without `SKILLED_LOOP_CLAIM_SEED` in the environment nothing is delivered, as before.
<!-- /ANCHOR:limitations -->

---


