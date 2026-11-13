---
title: "Implementation Summary"
description: "The OpenCode relaunch plugin now holds a parent's hand-over while a sub-agent is busy and titles a claimed receiver from the launch name, with the bridge gaining the one session update method it lacked."
trigger_phrases:
  - "opencode child and title implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/013-opencode-child-and-title"
    last_updated_at: "2026-11-13T00:00:00Z"
    last_updated_by: "builder"
    recent_action: "Built the child gate, the deferred arm and the seed title, and recorded their red and green runs"
    next_safe_action: "Run T017, the live bridged title check on OpenCode 2.2.7"
    blockers:
      - "T017 needs a live OpenCode claim seed that a builder may not start"
    key_files:
      - ".opencode/plugins/session-relaunch.js"
      - ".opencode/plugins/lib/v2-bridge.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-013-opencode-child-and-title"
      parent_session_id: null
    completion_pct: 90
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
| **Spec Folder** | 013-opencode-child-and-title |
| **Completed** | 2026-11-13 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

An OpenCode parent no longer hands over its runtime while a sub-agent is still working, and a session that claims a hand-off seed now carries the launch name as its title.

The live trace showed the gap: the parent's `session.idle` arrived 82 seconds before the backgrounded child finished, and the plugin armed on that idle. The plugin now records each child's parent and busy state, and a parent idle with a busy child is deferred. The child that finishes last runs the deferred arm. A second live check showed the title works on 2.2.7 through the native `ctx.session.update`, so the bridge's v1 client gained that one method and the plugin calls it once when it detects a claimed seed.

### Phase 13: opencode-child-and-title

A tracked child is busy from its creation until it reports `session.idle` or `session.deleted`. A parent idle only arms when none of its children is busy. A deferred arm is remembered per parent and runs when the last busy child ends.

At a claim seed the plugin reads `SKILLED_LOOP_NAME`, because the hand-off record is deleted before the receiver starts. It fires the title update without awaiting it in the event path and catches every error, so a failed title never stops the seed.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/plugins/session-relaunch.js` | Modified | Track child parent and busy state, defer the parent arm, and title a claimed seed |
| `.opencode/plugins/tests/session-relaunch.test.cjs` | Modified | Six new tests: parent busy gate, deferred arm, two children, title call, two fail-open guards |
| `.opencode/plugins/lib/v2-bridge.js` | Modified | One `session.update` method on the v1 client, mapped to the native `ctx.session.update` |
| `.opencode/plugins/tests/v2-bridge.test.cjs` | Modified | The bridge title test and the updated client key and missing-method inventories |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The two live checks ran first and their verdicts sit in `scratch/`. Each change then followed the recorded order: a failing test saved to `scratch/red.txt`, the smallest source edit, and a passing run saved to `scratch/green.txt`.

The session-relaunch suite went from the 65-test baseline to 71 tests, all passing. The bridge suite prints 52 pass, 0 fail. The whole plugin folder prints 593 pass, 0 fail once the inherited `OPENCODE_DB` is cleared, which is the environment leak recorded in `goal.md` section 4.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A child is busy from creation, cleared by idle or deletion | The plugin inventory manifest does not list `session.execution.started` and is outside this phase's write paths, so a literal check for it fails the inventory suite. Creation plus the two end events keeps the same behaviour without a new literal event name. |
| The title reads `SKILLED_LOOP_NAME` | The record is unlinked by `consume` before the receiver starts, so the environment the wrapper exports is the only source left. |
| The title call is fired and swallowed | The event path must not wait on the server, and the seed has to reach the system prompt even when the title call rejects. |
| The bridge gains exactly one method | The live check showed a working native `update` and no v1 bridge method, and the operator amended the scope to that one method. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `env -u AI_SESSION_CHILD node --test .opencode/plugins/tests/session-relaunch.test.cjs` | PASS: tests 71, pass 71, fail 0 |
| `env -u AI_SESSION_CHILD node --test .opencode/plugins/tests/v2-bridge.test.cjs` | PASS: tests 52, pass 52, fail 0 |
| `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .opencode/plugins/tests/*.test.cjs` | PASS: tests 593, pass 593, fail 0 |
| `node --check .opencode/plugins/session-relaunch.js` | PASS: exit 0 |
| `rg -n '^Verdict: (yes\|no)' scratch/trace-child-idle.md` and `rg -n '^Child parentID: (yes\|no)' scratch/trace-child-idle.md` | PASS: one line each, both yes |
| `rg -n '^Title verdict: (yes\|no)' scratch/live-title.md` and `rg -n '^Client update: (function\|undefined)' scratch/live-title.md` | PASS: one line each, title yes and client update undefined |
| `git diff --name-only -- .opencode` | PASS: the four planned files only |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The live bridged title is unproven.** T017 needs a claim seed on OpenCode 2.2.7, and a builder may not start an OpenCode session. AC-008 stays Unmet and the packet stays open until the orchestrator runs that check and writes `scratch/live-title-bridge.md`.
2. **A child that never reports an end keeps the parent unarmed.** The plugin clears the busy state only on `session.idle` or `session.deleted`; a runtime that loses the child without either event leaves the hop waiting, as the spec's risk table accepts.
3. **The full plugin suite needs `OPENCODE_DB` cleared in this host.** The ambient `opencode-v1.db` name leaks into `session-history-lookup.test.cjs`, which writes `opencode.db`; the failure is outside this phase and disappears with `env -u OPENCODE_DB`.
<!-- /ANCHOR:limitations -->

---
