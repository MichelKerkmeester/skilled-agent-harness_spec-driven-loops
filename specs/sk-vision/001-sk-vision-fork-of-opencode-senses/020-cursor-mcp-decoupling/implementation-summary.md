---
title: "Implementation Summary: Decouple Cursor MCP config; drop sk-vision from Claude"
description: "Closeout for giving Cursor its own MCP config and removing sk-vision from Claude Code, while Devin, OpenCode, and Pi keep it."
trigger_phrases:
  - "sk-vision cursor mcp decoupling summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/020-cursor-mcp-decoupling"
    last_updated_at: "2026-08-18T15:00:00.000Z"
    last_updated_by: "claude"
    recent_action: "Decoupled Cursor MCP config; dropped sk-vision from .claude/mcp.json."
    next_safe_action: "Commit + push the config split once the operator approves."
    blockers: []
    key_files:
      - "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/020-cursor-mcp-decoupling/implementation-summary.md"
      - ".cursor/mcp.json"
      - ".claude/mcp.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-020-cursor-mcp-decoupling"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 020-cursor-mcp-decoupling |
| **Status** | In Progress |
| **Level** | 1 |

Cursor now owns its MCP config and keeps sk-vision; Claude Code no longer registers it. Only the commit remains.
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

sk-vision is now scoped per runtime: available to OpenCode, Pi, Devin, and Cursor, and absent from Claude Code.

### Fix evidence

| Endpoint | Reads | sk-vision |
|----------|-------|-----------|
| Claude Code | `.claude/mcp.json` (real) | removed |
| repo-root generic | `.mcp.json` → `.claude/mcp.json` | removed (mirrors Claude) |
| Cursor | `.cursor/mcp.json` (now a real file, four servers) | kept |
| Devin | `.devin/mcp_config.json` (own file) | kept (unchanged) |
| OpenCode | `.opencode/plugins/sk-vision.js` (in-process) | kept (unchanged) |
| Pi | `.pi/extensions/sk-vision.ts` (in-process) | kept (unchanged) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The blocker was a symlink chain: `.cursor/mcp.json → .mcp.json → .claude/mcp.json` all resolved to one inode, so Cursor read Claude's config. A plain delete would have stripped sk-vision from Cursor too. The fix copied the full four-server config into a new real `.cursor/mcp.json` (so Cursor loses nothing), then removed the `sk-vision` entry from `.claude/mcp.json`. Repo-root `.mcp.json` still points at `.claude/mcp.json`, so the generic scope mirrors Claude. Devin, OpenCode, and Pi were already independent and untouched. The sk-vision topology docs were updated to describe the Cursor-owned config.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Cursor keeps all four servers | The operator chose losing nothing over a minimal Cursor config |
| Real file, not a symlink | Cursor and Claude need different server sets, which one shared file cannot express |
| Leave repo-root `.mcp.json` → `.claude` | The generic scope should mirror Claude, which no longer has sk-vision |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Claude / repo-root | no `sk-vision`; three servers; valid JSON |
| Cursor | four servers incl. `sk-vision`; valid JSON; real file (not a symlink) |
| Devin | unchanged, `sk-vision` present |
| In-process | OpenCode + Pi adapter symlinks present |
| Docs | `SKILL.md`, `README.md`, `hooks/README.md` describe the Cursor-owned config |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## KNOWN LIMITATIONS

- Cursor's copy of the three shared servers (mk-spec-memory, mk_skill_advisor, code_mode) no longer auto-follows changes to `.claude/mcp.json` — a documented drift trade-off the operator accepted.
- The runtime effect is proven by config parse; a live Cursor session confirming it still attaches sk-vision (and Claude no longer does) is the end-to-end check.
<!-- /ANCHOR:limitations -->
