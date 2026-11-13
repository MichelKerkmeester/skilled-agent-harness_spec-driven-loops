---
title: "Implementation Summary: The OpenCode goal continuation leaves a prepared hop alone"
description: "The goal plugin does not send a continuation while a relaunch record names the session as pending or armed, and it drops the packet variable after its one bind attempt."
trigger_phrases:
  - "opencode continuation hop implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/005-opencode-continuation-hop"
    last_updated_at: "2026-11-13T03:55:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Closed the phase after the build, the review fixes and the final suite run"
    next_safe_action: "None; phase closed"
    blockers: []
    key_files:
      - ".opencode/plugins/opencode-goal.js"
      - ".opencode/plugins/tests/opencode-goal-lifecycle.test.cjs"
    session_dedup:
      fingerprint: "sha256:4a3fa25e78bee27728e7d4590c5188daf666a495ddb03fad15b7598a97312e89"
      session_id: "scaffold-005-opencode-continuation-hop"
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
| **Spec Folder** | 005-opencode-continuation-hop |
| **Completed** | 2026-11-12 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

With goal autonomy switched on, an OpenCode session that has prepared a hop is no longer pulled back into work. The hop goes ahead.

### Phase 5: opencode-continuation-hop

On idle the relaunch plugin arms the hop and the goal plugin may send a continuation prompt. That prompt arrives as a user message, and a user message withdraws an armed hop. The session then worked on near its context limit. The goal plugin now reads the relaunch record and holds its continuation while the record names this session as pending or armed. It also deletes the hand-over packet variable after the one bind attempt, so a runtime started from the session does not inherit it.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/plugins/opencode-goal.js` | Modified | No continuation during a prepared hop, and the packet variable is dropped after the bind attempt. `.skilled/hooks/goal/opencode/opencode-goal.js` is a link to this file |
| `.opencode/plugins/tests/opencode-goal-lifecycle.test.cjs` | Modified | Suppressed for a pending and an armed record, and the variable is gone after the attempt |
| `.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/goal-hook/goal-hook.md` | Modified | The stated suite count follows the two new tests, 166 to 168 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Luna built it through `codex exec` at xhigh, test first: `scratch/red.txt` shows 46 pass and 2 fail, `scratch/green.txt` 48 of 48. Its sandbox failed three process-tree tests and one count check. Outside the sandbox the only failure was the count check: a playbook states the number of goal plugin tests, and the phase added two. The orchestrator corrected the playbook from 166 to 168. An independent Opus 5.5 review of the whole diff stalled after an hour and was stopped. The orchestrator finished the review from the experiments it left behind and by reading each change. The orchestrator reran every suite outside the builders' sandboxes from the final working tree: relaunch and OpenCode plugin suites 1471 of 1471, goal hook suites 200 of 200, Pi relaunch suite 59 of 59, each exit 0.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The goal plugin reads the relaunch record | The record is the one place that says a hop is prepared, and it already has a checked reader |
| Suppress only for this session and only while pending or armed | A withdrawn or spent record must not hold the continuation back |
| The playbook count is part of this phase | A contract test pins it to the suite, so adding tests without it fails the suite |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test .opencode/plugins/tests/opencode-goal-lifecycle.test.cjs` | PASS: 48 tests, 48 pass, 0 fail in `scratch/green.txt` |
| The two new cases before the change | FAIL as required: 46 pass, 2 fail in `scratch/red.txt` |
| `goal-doc-contract.test.cjs` after the count correction | PASS: 5 of 5 |
| `node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs`, loop variables unset | PASS: 1471 tests, 1471 pass, 0 fail, exit 0 |
| Goal hook suites under `.skilled/hooks/goal` | PASS: 200 tests, 200 pass, 0 fail, exit 0 |
| Pi relaunch vitest file | PASS: 59 passed, exit 0 |
| `validate.sh --strict` on this packet | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Autonomy is off by default.** The defect and the fix only matter with `OPENCODE_GOAL_AUTONOMY` set to `active` or `smoke`.
2. **Read from the code, not seen live.** The lost hop was found by reading both plugins. No live OpenCode hop was run.
<!-- /ANCHOR:limitations -->

---


