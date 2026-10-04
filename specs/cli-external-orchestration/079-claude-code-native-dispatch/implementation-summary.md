---
title: "Implementation Summary"
description: "The cli-claude-code self-invocation guard now tells a Claude Code session to dispatch a native subagent and how to pin its model and effort."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/079-claude-code-native-dispatch"
    last_updated_at: "2026-10-03T21:11:45Z"
    last_updated_by: "claude-code-native-dispatch"
    recent_action: "Reworded the cli-claude-code self-invocation guard"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files:
      - ".skilled/skills/cli-external-orchestration/cli-claude-code/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-code-native-dispatch"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 079-claude-code-native-dispatch |
| **Completed** | 2026-10-03 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A Claude Code session that reads the cli-claude-code guard now learns where to go instead of the CLI. Before, the guard said only "use native capabilities", so a session needing Sonnet 5.5 at xhigh checked the CLI route before it dispatched a subagent.

### Native dispatch guidance in the cli-claude-code guard

The "You ARE Claude Code already" bullet now says to dispatch a subagent with the Agent tool, that its `model` parameter picks the model, and that a pinned effort comes from an agent definition whose frontmatter sets `model` and `effort`. The guard comment and the `$CLAUDECODE` rule now route to a native subagent instead of only refusing.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/cli-external-orchestration/cli-claude-code/SKILL.md` | Modified | Three guidance lines |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/cli-external-orchestration/manifest.json` and its authored copy | Modified | Re-minted for the new skill text |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The operator approved the exact wording. The parent session applied it, re-minted the hub manifest, copied it to its authored source and ran the routing gates.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A packet of its own, not the doctor packet | The change is to a different skill and has nothing to do with the doctor audit |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/cli-external-orchestration` | Exit 0, all hard invariants passed, 0 warnings |
| `node .skilled/bin/compiled-route-guard.cjs` | Exit 0 after the re-mint, all hubs fresh |
| `bash .skilled/commands/doctor/scripts/route-validate.sh` | Exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The `sonnet-xhigh` agent is user-level.** It lives in `~/.claude/agents/`, outside the repository, so another machine needs its own copy.
<!-- /ANCHOR:limitations -->

---
