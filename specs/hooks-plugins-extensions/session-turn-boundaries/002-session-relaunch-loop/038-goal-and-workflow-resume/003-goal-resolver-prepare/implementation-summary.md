---
title: "Implementation Summary: The sender says why a goal was not carried"
description: "Cursor and Devin keep a handed-over goal at their next handoff, a goal packet is found by a unique headline, and prepare prints one reason line when a goal cannot be carried."
trigger_phrases:
  - "goal resolver prepare implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/003-goal-resolver-prepare"
    last_updated_at: "2026-11-13T03:55:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Closed the phase after the build, the review fixes and the final suite run"
    next_safe_action: "None; phase closed"
    blockers: []
    key_files:
      - ".skilled/hooks/session-relaunch/lib/relaunch-core.cjs"
      - ".skilled/hooks/session-relaunch/bin/session-relaunch.cjs"
      - ".skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs"
      - ".skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs"
    session_dedup:
      fingerprint: "sha256:197d0d070714a4cf06653b04dc541948bf6f5d4d45a7dd8bb8f22736dc9d6f30"
      session_id: "scaffold-003-goal-resolver-prepare"
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
| **Spec Folder** | 003-goal-resolver-prepare |
| **Completed** | 2026-11-12 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A goal that cannot be carried no longer disappears without a word. `prepare` prints one `goal not carried:` line with the reason. Cursor and Devin keep the goal they were handed, and a Claude goal is found even when the session works outside the goal's folder tree.

### Phase 3: goal-resolver-prepare

Three losses were silent. A Codex sender, a free-text goal and a goal outside the note's folder tree all gave an empty answer and no message. Cursor and Devin record their handoff under a made-up session id, so their own goal record was never found and the next note had no goal.

The resolver now reports a reason beside the packet. Cursor and Devin fall back to the packet they inherited when no record matches, and no other runtime does. When the folder tree has no match, the resolver looks for the goal's headline in the `goal.md` files under `specs/` and takes it only when exactly one packet holds it. `prepare` also tells Cursor and Devin that nothing ends their session.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` | Modified | Inherited packet for Cursor and Devin, the unique-headline search, the reason beside the packet |
| `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs` | Modified | One reason line on stderr, one search per call, the manual text for Cursor and Devin |
| `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` | Modified | Resolver cases and the guard for the other runtimes |
| `.skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` | Modified | `prepare` output cases |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Luna wrote the failing tests through `codex exec` and stopped before the source change, because three older tests failed in its sandbox, which blocks `ps`. It said so and changed no source. DeepSeek V4.1 Flash max then implemented against those tests: `scratch/red.txt` holds the failing run, `scratch/green.txt` 310 of 310. The review found that a miss walked the specs tree twice, about 1.5 seconds each, so a follow-up pass made `prepare` search once. An independent Opus 5.5 review of the whole diff stalled after an hour and was stopped. The orchestrator finished the review from the experiments it left behind and by reading each change. The orchestrator reran every suite outside the builders' sandboxes from the final working tree: relaunch and OpenCode plugin suites 1471 of 1471, goal hook suites 200 of 200, Pi relaunch suite 59 of 59, each exit 0.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The reason is a sibling of the resolver, and the resolver keeps its return type | Three callers and the tests rely on a plain string |
| The reason goes to stderr | The stdout of `prepare` is pinned by a test and read by the wrapper |
| Only Cursor and Devin use the inherited packet | Claude inherits the same variable and would carry a goal the operator had cleared |
| A headline match counts only when it is the single one | About 70 real packets share a headline with another, and a wrong goal is worse than none |
| The search skips `scratch`, `lineages` and `z_archive` | Those folders hold copies of other packets with the same headlines |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test` on `relaunch-core.test.cjs` and `session-relaunch-cli.test.cjs` | PASS: 310 tests, 310 pass, 0 fail in `scratch/green.txt` |
| The new cases before the change | FAIL as required, in `scratch/red.txt` |
| The headline search on the real tree, measured by the reviewer | 1.1 to 1.7 seconds for 53,605 folders and 933 goal files, once per `prepare` and only on a miss |
| `node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs`, loop variables unset | PASS: 1471 tests, 1471 pass, 0 fail, exit 0 |
| Goal hook suites under `.skilled/hooks/goal` | PASS: 200 tests, 200 pass, 0 fail, exit 0 |
| Pi relaunch vitest file | PASS: 59 passed, exit 0 |
| `validate.sh --strict` on this packet | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The search costs about a second and a half.** It runs once, only for a Claude goal whose folder tree gives no match.
2. **A shared headline still drops the goal.** Two packets with the same goal title give no match. The reason line says so.
3. **Codex only gets the reason line.** It still carries no packet.
4. **A refused Claude slice is still reported only by the wrapper.** The reason for a child goal or an over-budget slice reaches stderr once and not the receiver.
<!-- /ANCHOR:limitations -->

---


