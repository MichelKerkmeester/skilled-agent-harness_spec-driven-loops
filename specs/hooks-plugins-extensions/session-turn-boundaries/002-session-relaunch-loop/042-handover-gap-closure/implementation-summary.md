---
title: "Implementation Summary: Handover gap closure on Pi, OpenCode and Codex"
description: "Pi and OpenCode no longer park a hand-over behind a question dialog, and they tell the model when a new prompt withdrew one. Codex now points a compacted session back at its note. Two of the five gaps needed no code: Codex goal carry already works, and OpenCode 2 has no route to start on a carried model."
trigger_phrases:
  - "handover gap closure implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/042-handover-gap-closure"
    last_updated_at: "2026-11-15T05:56:06Z"
    last_updated_by: "generate-context"
    recent_action: "Fixed three handover gaps and measured all five live on four runtimes"
    next_safe_action: "Commit worktree 392 and ask the operator before merge and push"
    packet_purpose: "Purpose: Pi and OpenCode refuse a question dialog while a hand-over is pending and tell the model when one is withdrawn, Codex points a compacted session at its note, and every gap that cannot be fixed is recorded with the run that shows it."
    blockers: []
    key_files:
      - ".skilled/hooks/session-relaunch/lib/nudge.cjs"
      - ".skilled/hooks/session-relaunch/pi/session-relaunch.ts"
      - ".opencode/plugins/session-relaunch.js"
      - ".skilled/hooks/session-relaunch/codex/compact-pointer.mjs"
      - "specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/042-handover-gap-closure/scratch/harness/probe.sh"
    session_dedup:
      fingerprint: "sha256:825e1cfa377dfb79e722627e561958bfc48ad25bab99a03691d03fe8eee09760"
      session_id: "scaffold-042-handover-gap-closure"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "b726ec67-1d85-4833-b219-c038e184d696"
      workspace: "/Users/michelkerkmeester/worktrees/public/392-cross-runtime-handover-parity"
      savedAt: "2026-11-15T05:56:06Z"
      locatorKind: "transcript_path"
      version: 1
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
| **Spec Folder** | 042-handover-gap-closure |
| **Completed** | 2026-11-15 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every gap phase 041 left open now has a live run behind it. Three are fixed, one already worked and one has no route.

### Handover gap closure

`scratch/harness/probe.sh` starts a runtime in tmux and types scripted steps once a trigger shows on screen or in the relaunch log. A step can wait for a pattern to leave the screen, so a prompt lands after the turn ends and inside the killer's 3 s idle wait. A prompt typed during the turn joins that turn on Claude Code and OpenCode, so the first withdraw attempt measured nothing on those two (`withdraw-claude`, `withdraw-opencode`).

- **A question dialog after `prepare` parked Pi and OpenCode.** The dialog holds the run or turn open, so the arm event never comes. Claude Code already refused it. The refusal check and text moved into `questionHoldReason` in the nudge module, and Pi's `tool_call` and OpenCode's `tool.execute.before` now call it too. Codex needs no guard: it asked through `request_user_input_async`, which returned `{"accepted":true}` and let the turn end.
- **A withdrawn hand-over left Pi and OpenCode waiting.** Both withdrew the record correctly, but only Claude Code and Codex told the model. Pi now steers the notice from `agent_start`, which Pi awaits before the first model call. OpenCode keeps it in the system prompt for the rest of the turn, until the next prompt or a compaction.
- **Codex had no compaction pointer.** Codex runs `SessionStart` with `source: compact` after a compaction and adds its context for the model. `codex/compact-pointer.mjs` answers it the way Claude's pointer does: it resets the nudge level and points at the open note, or sends the stale-note text.
- **Codex goal carry already works.** The sender wrote an `Active goal:` line and the receiver created the goal again in its own thread.
- **OpenCode 2 has no model route.** The root command has no model flag. `OPENCODE_CONFIG_CONTENT`, flat or as a v2 model object, and an `OPENCODE_CONFIG` file all started on the project model.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/session-relaunch/lib/nudge.cjs` | Modified | `questionHoldReason` |
| `.skilled/hooks/session-relaunch/claude/subagent-guard.mjs` | Modified | Calls the shared check, same text |
| `.skilled/hooks/session-relaunch/pi/session-relaunch.ts` | Modified | `tool_call` refusal, notice steered from `agent_start` |
| `.opencode/plugins/session-relaunch.js` | Modified | `tool.execute.before` refusal, notice in the system prompt |
| `.skilled/hooks/session-relaunch/codex/compact-pointer.mjs`, `.codex/hooks/compact-pointer.mjs` | Created | The Codex pointer and its mirror link |
| `hook-registry.json`, `.codex/hooks.json` | Modified | The Codex `SessionStart` binding |
| `pi/session-relaunch.test.ts`, `.opencode/plugins/tests/session-relaunch.test.cjs`, `tests/codex-adapters.test.cjs` | Modified | Two Pi, two OpenCode and two Codex cases, the registry case, and two cases that counted messages |
| `session-relaunch/README.md`, `codex/README.md`, `pi/README.md`, `opencode/README.md`, the relaunch feature catalog entry | Modified | The guard, the notice and the pointer |
| `scratch/harness/probe.sh` | Created | The step-typing probe, with every run under `scratch/runs/` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each gap was probed live first. Each fix started from tests that failed on the old code: both Pi cases, both OpenCode cases and all three Codex cases. The OpenCode baseline ran in the unchanged primary checkout. Codex reads `hooks.json` from a worktree's main checkout, so the live Codex pointer run used a plain local clone of the worktree, with hook trust bypassed for that one run.

```text
gap                 before                                         after
question, pi        open dialog 4 m 54 s, prepared, no signal      2 calls refused, cancel, then asked with nothing armed
question, opencode  open dialog, prepared, no signal               refused, question moved into the note, hopped
withdraw, pi        "I should stop now so the loop can relaunch"   "The prepared hand-over was withdrawn ... continue here"
withdraw, opencode  "the record is armed and ... should go idle"   "Withdrawn ... the killer never relaunched"
compaction, codex   no SessionStart binding, no pointer logged     compact-pointer logged, git log --since the note date run
goal, codex         sender and receiver threads both hold the goal (no change)
model, opencode     project model on all three routes              (no route, recorded)
```
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| One shared check for the refusal | Three runtimes refuse for the same reason, so one text and one record rule keep them from drifting apart |
| No Codex question guard | Its default-mode question tool does not hold the turn, and the live hop ran |
| Steer the Pi notice from `agent_start` | Pi awaits that handler before the run reads its steers, so the model sees the notice before its first call |
| Keep the OpenCode notice for the whole turn | An auxiliary request can take the first system prompt, the reason the seed stays the same way |
| End the OpenCode notice at a compaction | The stale-note text a compaction sends already says the hand-over is off |
| Record OpenCode model carry, change nothing | No launch route exists in OpenCode 2.3, so any change would be dead code |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test` relaunch and plugin suites | 1,564 passed, 0 failed (baseline 1,560) |
| `node --test .skilled/hooks/shared/hook-flags.test.cjs` | 29 passed, 0 failed |
| Pi vitest suite | 67 passed (baseline 65) |
| `tsc -p tsconfig.pi.json` | exit 0 |
| Goal hook suites under `.skilled/hooks/goal` | 200 passed, 0 failed, the same as the primary checkout |
| `sync-hook-registrations.cjs --check`, `sync-runtime-mirrors.cjs --check` | PASS, PASS |
| Live probes on the fixed code | No prepared record stuck behind a dialog, both models said withdrawn, the Codex pointer logged |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **OpenCode 2 drops a model picked mid-session.** No launch route exists. The receiver starts on the project's `opencode.json` model.
2. **A refused question can still end the hop.** On Pi the model took the `cancel` way out the refusal offers, so it asked and stayed in the session. Nothing was left stranded, but no hop ran.
3. **The fixed OpenCode withdraw run read the hop history.** Its reply was right, but it also checked the file, so the live run alone does not prove it read the notice. The test proves the notice reaches the system prompt.
4. **A new Codex hook waits for trust.** Codex skips new or changed hooks until they are reviewed in `/hooks`. Someone who installs this change on Codex reviews the new `SessionStart` row once.
5. **Codex reads a worktree's hooks from the main checkout.** The pointer reaches Codex sessions in a worktree only once the change is merged.
<!-- /ANCHOR:limitations -->

---
