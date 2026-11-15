---
title: "Implementation Summary"
description: "A Mistral Vibe session started through skilled-loop now hands over on its own, the way a Claude Code session does: it is nudged near its compaction point, ends at turn end and restarts on the claim seed. Two live hops scored 5/5, the same as the Claude Code baseline."
trigger_phrases:
  - "vibe automatic handover implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-handover/002-session-handover-loop/045-vibe-automatic-handover"
    last_updated_at: "2026-11-15T12:20:49Z"
    last_updated_by: "generate-context"
    recent_action: "Vibe hands over automatically, two live hops scored 5 of 5 like Claude Code"
    next_safe_action: "Commit in worktree 406, then ask the operator before merge and push"
    packet_purpose: "Purpose: A Vibe session hands over the way a Claude Code session does: it is nudged near its compaction point, it arms at turn end, and the wrapper starts a fresh Vibe on the claim seed."
    blockers: []
    key_files:
      - ".skilled/hooks/session-handover/vibe/handover-parts.mjs"
      - ".skilled/hooks/session-handover/lib/context-usage.cjs"
      - ".skilled/hooks/session-lifecycle/vibe/turn-end.mjs"
      - ".skilled/hooks/session-lifecycle/vibe/compaction-post-tool.mjs"
      - ".skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-handover-vibe.md"
    session_dedup:
      fingerprint: "sha256:76ab400db1b64badb669e5686bf8e66146a7a9e573e23bfd2a2a1a59c10b1149"
      session_id: "scaffold-045-vibe-automatic-handover"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "b726ec67-1d85-4833-b219-c038e184d696"
      workspace: "/Users/michelkerkmeester/worktrees/public/406-vibe-automatic-handover"
      savedAt: "2026-11-15T12:20:49Z"
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
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 045-vibe-automatic-handover |
| **Completed** | 2026-11-15 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A Vibe session you start with `skilled-loop vibe` now hands over by itself. Turn on `SYSTEM_SESSION_HANDOVER_VIBE_ENABLED`, and when the session fills toward Vibe's compaction point it is told to write a handoff note, its turn ends, and a fresh Vibe starts on the claim seed and finishes the work. Before this, you had to end the session and run a printed claim command yourself.

### Phase 45: Vibe joins the automatic tier

The fill comes from the token counts Vibe records in its session journal, measured against the compaction point Vibe itself uses. The nudge can land at a turn start or right after a tool call, so a long turn hears it too. If you type a prompt after the hand-over is armed, the hand-over is called off and the session carries on. With the switch off, nothing changes, and a hand-over you start by typing `/speckit-handoff` still ends with the printed claim command, because Vibe gives its tools no session id to arm with.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/session-handover/vibe/handover-parts.mjs` | Created | The context part (seed, withdraw, nudge) and the turn-end arm part |
| `.skilled/hooks/session-handover/lib/context-usage.cjs` | Modified | `readVibeUsage` and `resolveVibeWindow`, skipping a compaction's summarizer call |
| `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs`, `turn-end.mjs`, `compaction-post-tool.mjs` | Modified | Run the two parts, each loaded on demand, the arm part last |
| `tests/vibe-adapters.test.cjs`, `tests/context-usage.test.cjs`, the Vibe composer tests, `compaction-post-tool.test.mjs` | Created, Modified | Nudge, seed, withdraw, arm, subagent, switch, deny order, summarizer skip |
| `.skilled/hooks/README.md`, the handover README, `.vibe/plugins/README.md`, the Vibe guards reference, the session-lifecycle Vibe README | Modified | Vibe listed as automatic |
| `VIB-HK-027`, the `VIB-HK-026` fallback note, spec-kit `session-handover-vibe.md`, the feature catalog | Created, Modified | Playbook scenarios for the hop, the withdraw and the switch off |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A live spike first measured interactive Vibe: SIGTERM ends it cleanly, and `context-breakdown.json` holds characters, not tokens, so the reader uses the journal's measured `input_tokens`. DeepSeek V4.1 Flash max through cli-opencode wrote every change from a short brief, nine briefs in all, and each result was read and its tests rerun before the next. A fresh Opus medium agent reviewed the code and found no P0 or P1. Its two fixable P2 findings went back to DeepSeek as two more briefs. The gate ran before and after, then four live runs went through `skilled-loop vibe` on deepseek-flash: two hops, one withdraw, one with the switch off. The work sits in worktree 406 and is not merged or pushed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Read the fill from the journal, not `context-breakdown.json` | The breakdown file holds payload characters. Measured, 77,464 characters stood for 20,001 tokens. |
| Measure against `compaction_threshold`, not the full window | That is the point where Vibe compacts on its own, so the nudge lands before it. |
| Nudge at `post_tool` too | Vibe appends `post_tool` context to the tool result, so a long turn hears the nudge without waiting for the next prompt, as Codex does at PostToolUse. |
| Ride the existing post_tool binding instead of a new hook entry | No new registration to sync across runtimes, and each part fails on its own. |
| Arm part last in the turn-end composer | The composer stops at the first deny, so a turn another part sends back is never armed and ended. |
| DeepSeek V4.1 Flash max builds, a fresh Opus medium reviews | The operator chose it for this phase, in place of the parent's builder decision. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Gate before and after | Relaunch 1,567 to 1,582, Vibe 48 to 53, the new tests. Flags 31, Pi 67, `tsc` 0, goal 203, doctor 17, spec gate 107, writer 75 unchanged, all 0 fail |
| Sync and drift | Hook sync PASS (35 hooks), mirror sync PASS (257), drift 4 of 4 PASS |
| Review | Fresh Opus medium: no P0, no P1, five P2. Two fixed, three recorded below |
| Live hop scores | `base1-claude` 5/5. `hop1-vibe` 5/5. `hop2-vibe` 5/5 |
| Stage times, prepare / to signal / to relaunch / closed | Claude 17.5 / 6.2 / 1.2 / 35.1 s. Vibe 15.5 / 38.7 / 0.5 / 67.4 s and 12.8 / 19.4 / 0.4 / 42.1 s |
| Withdraw | `withdrawn reason=user-message`, then `killer-no-armed-record`, the session answered on |
| Switch off | No `prepare`, no `killer-signal`. `prepare` refused with exit 2 naming the switch |
| Playbook docs | `validate_document.py` VALID, 0 issues, for all three scenario files |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A typed `/speckit-handoff` does not arm.** Vibe gives its tools no session id, so that route prepares with a `uuidgen` id and the wrapper prints the claim command as before. Let the nudge start the hand-over instead.
2. **The sender can take longer to end than Claude Code.** In the first hop deepseek-flash spent twelve more tool calls checking the record after `prepare`, so the signal came 38.7 s after it. The arm, killer and relaunch themselves took about 3.5 s.
3. **The killer reads three quiet seconds as idle.** If Vibe started a slow model call after the turn ended, the killer could signal during it. The review inferred this. No live run showed it.
4. **Parallel tool calls could nudge twice.** Two `post_tool` hooks reading the nudge level at once could both fire. The review inferred this. It costs one repeated message.
<!-- /ANCHOR:limitations -->

---



