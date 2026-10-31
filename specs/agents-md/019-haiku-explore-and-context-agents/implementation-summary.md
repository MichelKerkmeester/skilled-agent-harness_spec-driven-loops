---
title: "Implementation Summary"
description: "Explore now defaults to Haiku through a Claude-only override, the context agent is pinned to Haiku, and neither change forces a model on any other subagent."
trigger_phrases:
  - "haiku explore and context agents implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "agents/019-haiku-explore-and-context-agents"
    last_updated_at: "2026-10-08T10:15:00Z"
    last_updated_by: "claude"
    recent_action: "Landed Explore override and context pin"
    next_safe_action: "Spawn Explore in a new session"
    blockers: []
    key_files:
      - ".claude/agents/Explore.md"
      - ".claude/agents/context.md"
      - ".skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs"
      - ".skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "8dc8e6a4-8f4a-445b-977c-e942be2eb5bc"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Do Cursor and Devin accept model: haiku in the context agent they reach through a symlink?"
    answered_questions:
      - "Does a non-forced CLAUDE_CODE_SUBAGENT_MODEL reach Explore? No, per the Claude Code docs."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 019-haiku-explore-and-context-agents |
| **Completed** | 2026-10-08 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Search-type subagents now default to Haiku instead of the main model. Explore runs on Haiku through an override file, the `context` and `markdown` agents declare `model: haiku` in their frontmatter, and no force flag is set, so a model you name when you ask for a different subagent still wins.

### Haiku-default Explore override and haiku-pinned context agent across Claude and sibling runtime surfaces

Claude Code lets a user or project agent named `Explore` replace the built-in, and the documented settings route cannot do that without forcing every subagent onto one model. The override file keeps the built-in's read-only posture with an explicit `tools:` list and sets `model: haiku` as the default.

Explore exists only in the Claude tree. No other runtime has a built-in to replace, and the Codex generator rejects a capitalised filename, so you chose to mark it Claude-only. The roster check and the Cursor and Devin symlink sync each skip it.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `~/.claude/agents/Explore.md` | Created | User-level Haiku override, applies in every project |
| `.claude/agents/Explore.md` | Created | Repo-level override, same content |
| `.claude/agents/context.md` | Modified | Added `model: haiku` to the frontmatter |
| `.claude/agents/markdown.md` | Modified | Added `model: haiku` to the frontmatter |
| `.claude/agents/README.txt` | Modified | Corrected the model note and recorded Explore as Claude-only |
| `.skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs` | Modified | Roster skips Claude-only agents |
| `.skilled/commands/doctor/scripts/tests/agent-roster-mirror-check.test.cjs` | Modified | One test for the Claude-only case |
| `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs` | Modified | Symlink sync skips Claude-only agents |
| `.skilled/skills/system-deep-loop/deep-improvement/references/shared/agent-mirror-crosswalk.md` | Modified | Corrected the two statements that no Claude-tree agent declares a model |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The five mirror and sync checks were run before any repo edit and again after, and the counts match. The first attempt mirrored Explore to every runtime. The Codex generator rejected it, the copies in `.skilled`, `.pi`, `.cursor` and `.devin` were removed, and the Claude-only route replaced it. Nothing is committed or pushed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Override Explore with an agent file, not an env var | The non-forced `CLAUDE_CODE_SUBAGENT_MODEL` is ignored by Explore, and the forced one removes the per-request model choice |
| Leave the force flag and the subagent env var unset | The docs say a per-call model beats the file's `model:` only while the force flag is off |
| Mark Explore Claude-only instead of loosening the Codex generator | Only Claude Code has the built-in, and a mirrored copy would be a second unrelated agent elsewhere |
| Pin `context` and `markdown` with frontmatter, not a hook | The request was a frontmatter change, and a dispatch hook is a separate enforcement design |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Roster check | PASS, `STATUS=OK`, 12 agents on every surface, same as the baseline |
| Symlink sync `--check` | PASS, 187 mirrors across 8 trees, same as the baseline |
| Pi and Codex `--check` | PASS, 12 agents each, same as the baseline |
| Agent mirror sync `--all` | PASS, 12 agents in sync |
| Roster test file | PASS, 9 of 9 including the new Claude-only test |
| `SUBAGENT_MODEL` in either `settings.json` | None found |
| Live spawn of Explore and `context` in a new session | NOT RUN, only the operator can start a new session |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The Haiku pin is a default, not a lock.** A model passed on the Agent call wins over the file, and dispatched routes that pass a model explicitly override the `context` pin too. Only the force flag would stop that, and it also blocks your per-request choice.
2. **Not confirmed live.** A test Explore run in the session that wrote the file still reported the main model, so the override takes effect in a new session. The docs say a project or user `Explore` file replaces the built-in, and that is untested here.
3. **Cursor and Devin reach `context.md` and `markdown.md` through symlinks** and now see `model: haiku`. Whether either runtime accepts that value is UNKNOWN.
<!-- /ANCHOR:limitations -->

---
