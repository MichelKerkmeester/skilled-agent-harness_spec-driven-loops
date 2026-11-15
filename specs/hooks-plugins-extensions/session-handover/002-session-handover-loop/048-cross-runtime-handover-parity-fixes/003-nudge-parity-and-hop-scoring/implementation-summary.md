---
title: "Implementation Summary: Phase 3: nudge-parity-and-hop-scoring"
description: "Claude Code, Codex and Vibe now deliver one nudge when two hooks race, through one shared claim, and the live-hop scorer reports whether the receiver recovered a detail kept out of the note."
trigger_phrases:
  - "nudge parity implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-handover/002-session-handover-loop/048-cross-runtime-handover-parity-fixes/003-nudge-parity-and-hop-scoring"
    last_updated_at: "2026-11-15T21:21:18Z"
    last_updated_by: "generate-context"
    recent_action: "AC-005 met: live1-opencode and live3-pi recovered the side word through History Lookup"
    next_safe_action: "Commit worktree 420 and merge it to main"
    packet_purpose: "Purpose: Every runtime delivers each nudge once, and a live hop scores recall as well as the hop."
    blockers: []
    key_files:
      - ".skilled/hooks/session-handover/lib/nudge.cjs"
      - ".skilled/hooks/session-handover/lib/relaunch-core.cjs"
      - ".skilled/hooks/session-handover/codex/stop-arm.mjs"
      - ".skilled/hooks/session-handover/pi/session-handover.ts"
      - ".opencode/plugins/session-handover.js"
    session_dedup:
      fingerprint: "sha256:d030c6881b56e4e1655cd9a9ac2acd9a3c844b39adb7558c21fc5a5276eeea77"
      session_id: "scaffold-003-nudge-parity-and-hop-scoring"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "b726ec67-1d85-4833-b219-c038e184d696"
      workspace: "/Users/michelkerkmeester/worktrees/public/420-cross-runtime-handover-parity-fixes"
      savedAt: "2026-11-15T21:21:18Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary: Phase 3: nudge-parity-and-hop-scoring

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-nudge-parity-and-hop-scoring |
| **Completed** | 2026-11-15 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Two hooks that decide on the same nudge at once now deliver it once on Claude Code, Codex and Vibe. Session logs had shown the same nudge twice within 16 ms on Claude and within 12 ms on Codex.

### Phase 3: nudge-parity-and-hop-scoring

The claim that phase 047 built inside the Vibe adapter now lives in the shared nudge module as `commitNudge`. A hook creates the session's claim file with an exclusive open, decides again under the claim and writes the level. A hook that finds the claim held stays quiet. A claim older than 10 seconds was left by a hook that died and is taken over. The Claude, Codex and Vibe nudge paths call it, and the Vibe copy is gone. Separately, the live-hop scorer now reports whether the receiver stated the side word and whether the note held it, so a run can tell recall through the lookup from recall through the note.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/session-handover/lib/nudge.cjs` | Modified | `claimNudge` and `commitNudge` |
| `.skilled/hooks/session-handover/claude/context-nudge.mjs`, `codex/shared.mjs` | Modified | Deliver through `commitNudge` |
| `.skilled/hooks/session-handover/vibe/handover-parts.mjs` | Modified | Use the shared claim, drop the local copy |
| `nudge.test.cjs`, `claude-adapters.test.cjs`, `codex-adapters.test.cjs` | Modified | Race, stale-claim and held-claim tests |
| `../scratch/harness/score.cjs` | Modified | The `recall` block |
| `.skilled/hooks/session-handover/README.md` | Modified | One paragraph on the shared claim |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Vibe CLI on deepseek-flash built the shared function first, then the Claude and Codex callers, then the Vibe change, from three one-change briefs in worktree 420. Each diff was read before the next brief. Mutation checks removed the second decision, the held-claim check and each adapter's null check, and tests failed every time. A fresh Opus medium review read the diff. Four live hops ran: one OpenCode and three Pi. The third Pi hop ran after the phase 004 preview fix.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Move the claim into `nudge.cjs` (ADR-001) | The race sits in the shared decide-then-write sequence, and it shows on Claude and Codex as well as Vibe |
| Fall back to the first decision when the commit throws | A failed write delivered the nudge before this change too, so the hook keeps its old behavior on an error |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Handover suite | PASS: `tests 1039`, `fail 0` |
| Vibe lifecycle suite | PASS: `tests 37`, `fail 0` |
| Mutations | second decision skipped: 2 fail. Held-claim check dropped: 4 fail. Claude, Codex and Vibe null check removed: their tests fail |
| `score.cjs` on 047 `hard2-vibe` | `sideWordStated: true`, `sideWordInNote: false` |
| Live hop `../scratch/runs/live1-opencode` | PASS 5/5. Side word absent from the note and recovered through the lookup |
| Live hop `../scratch/runs/live1-pi` | 5/5, but the sender wrote the side word into the note, so the run does not show recall through the lookup |
| Live hop `../scratch/runs/live2-pi` | 4/5. The receiver ran the printed browse but did not recover the side word, and the note stayed claimed |
| Live hop `../scratch/runs/live3-pi`, after the phase 004 preview fix | PASS 5/5 on DeepSeek Flash at max thinking. Side word absent from the note, and the receiver browsed, loaded the sender's first turn and reported it |
| Opus medium review | no P0 or P1 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Recall depends on the receiver using the lookup.** A Pi receiver on GPT-6 Luna at low thinking gave up after one browse in `live2-pi`. On DeepSeek Flash at max thinking, with readable previews, it browsed further and loaded the turn it needed.
2. **Two hooks that find the same stale claim can both deliver.** The cost is one repeated nudge.
<!-- /ANCHOR:limitations -->
