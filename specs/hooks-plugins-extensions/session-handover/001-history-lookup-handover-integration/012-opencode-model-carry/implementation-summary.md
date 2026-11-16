---
title: "Implementation Summary"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "opencode model carry implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/012-opencode-model-carry"
    last_updated_at: "2026-11-16T08:25:07Z"
    last_updated_by: "generate-context"
    recent_action: "Corrected the variant claim and confirmed OpenCode 1 is unchanged"
    next_safe_action: "Commit, merge and push worktree 426 once the operator approves"
    packet_purpose: "Purpose: An OpenCode 2 hand-over hop starts the next session on the model the sender last answered on."
    blockers: []
    key_files:
      - ".skilled/bin/skilled-loop"
    session_dedup:
      fingerprint: "sha256:21d0503434aaca8a65579c9e3e6df96cb3322043e31bb0628112fe8dd267e168"
      session_id: "scaffold-012-opencode-model-carry"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "87e90d42-7a99-4147-b5e1-353501784430"
      workspace: "/Users/michelkerkmeester/worktrees/public/426-opencode-model-carry"
      savedAt: "2026-11-16T08:25:07Z"
      locatorKind: "transcript_path"
      version: 1
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
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 012-opencode-model-carry |
| **Completed** | 2026-11-16 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

An OpenCode 2 hand-over hop now starts the next session on the model the sender was using. Three live hops with the sender on a model the project does not pin each started the receiver on that model, while a control hop with the carry switched off fell back to the pinned one.

### Phase 12: opencode-model-carry

OpenCode 2's root command has no model flag, so a hop used to drop the model and the receiver started on whatever the project config pins. If you switched models in the TUI, every hop undid that.

Now prepare reads the model your session last answered on from OpenCode's own store. On the next hop the wrapper hands it to OpenCode through `OPENCODE_CONFIG_CONTENT`, which OpenCode reads above the project config, as the top-level, build and plan model. Your own `OPENCODE_CONFIG_CONTENT` stays the base, and text that is not plain JSON is left exactly as it was. No launch setting chooses the variant. It matched (`max`) on both sides in every run, but those runs cannot tell carry from OpenCode's own default, and a sender that changes the variant in the TUI was not tested.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/session-handover/lib/context-usage.cjs` | Modified | Reads the latest assistant model from the OpenCode 2 store |
| `.skilled/hooks/session-handover/lib/relaunch-core.cjs` | Modified | Store path and the OpenCode branch of the settings read |
| `.skilled/bin/skilled-loop` | Modified | Sets `OPENCODE_CONFIG_CONTENT` with the carried model on an OpenCode 2 hop |
| `tests/skilled-loop-wrapper-model-effort.test.cjs`, `tests/skilled-loop-wrapper-harness.cjs` | Modified | Four cases, and the stub records and clears the variable |
| `scratch/harness/live-hop.sh`, `scratch/harness/score.cjs` | Created | `SENDER_MODEL` shim and the store-based `modelCarry` check |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

A spike first launched the real OpenCode 2 TUI in tmux with each candidate route and read the model back from the session export. Only `OPENCODE_CONFIG_CONTENT` changed the model, with `--standalone` and through the background service. The fix then reused the existing settings channel the other runtimes use. Unit tests and a negative control came next, and the live proof used a shim so the sender ran on a model the wrapper could not see as the operator's, which made a carry failure visible.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| Carry the model through `OPENCODE_CONFIG_CONTENT` | It is per process, needs no file write, races no other session, and was the only route a real launch honoured |
| Also set the build and plan agent models | The repository config pins both, and an agent's model wins over the top-level one |
| Leave the variant to OpenCode | Neither `agent.variant` nor a `#variant` suffix changed it in a real launch, so there is no launch route; carrying a variant changed in the TUI is untested |
| Read the model in the existing settings read, not in the plugin | The relaunch record already carries `model`, so no plugin or v2 bridge change was needed |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| Hand-over suite `node --test .skilled/hooks/session-handover/tests/*.test.cjs ...` | PASS, 1119 pass, 0 fail (main 1115) |
| Hooks vitest | PASS, 503/503 |
| Negative control, carry and reader off | `pass 10`, `fail 3`; restored, all pass |
| Live control hop, carry off, sender on `deepseek-v4.1-flash` | 5/5, receiver on `deepseek-v4.1-flash-1017#max`, `kept: false` |
| Live hops `carry1` to `carry3` | 5/5 each, receiver on `deepseek-v4.1-flash#max` like its sender, `kept: true`, side word recovered |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **The variant is not set at launch.** No launch setting changes it. Whether a variant the sender changed in the TUI reaches the receiver through OpenCode's own per-model state is untested.
4. **OpenCode 1 is unchanged.** Its store keeps no `session_message` rows, so the reader returns nothing and an OpenCode 1 hop keeps its `-m` launch.
2. **The printed manual claim command carries no model.** It is a command line, and an environment value would not survive copying it.
3. **Only the build and plan agents are pinned.** A session on a custom agent that the project config pins to another model keeps that pin.
<!-- /ANCHOR:limitations -->

---


