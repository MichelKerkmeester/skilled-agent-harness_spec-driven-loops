---
title: "Implementation Summary: Cursor + Devin hook entries"
description: "Closeout for surfacing Cursor and Devin under the sk-vision hooks tree via owned MCP configs and a hooks README."
trigger_phrases:
  - "sk-vision cursor devin hook entries summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/016-cursor-devin-hook-entries"
    last_updated_at: "2026-08-17T15:17:23.000Z"
    last_updated_by: "claude"
    recent_action: "Added hooks/cursor and hooks/devin plus their hook-hub mirror symlinks."
    next_safe_action: "Commit the sk-vision-scoped changes on v4."
    blockers: []
    key_files:
      - "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/016-cursor-devin-hook-entries/implementation-summary.md"
      - ".opencode/skills/sk-vision/hooks/cursor/mcp.json"
      - ".opencode/skills/sk-vision/hooks/devin/mcp_config.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-016-cursor-devin-hook-entries"
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
| **Spec Folder** | 016-cursor-devin-hook-entries |
| **Status** | In Progress |
| **Level** | 1 |

The hook entries and docs are done and verified; the sk-vision-scoped commit on v4 is the one remaining step.
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Cursor and Devin now appear under `hooks/` alongside Pi and OpenCode. Because they are MCP-only, their `hooks/` entry is a config that names the shared MCP server rather than in-process adapter code.

### Fix evidence

| Edit | Artifact | Result |
|------|----------|--------|
| Devin config owned | `hooks/devin/mcp_config.json` | `.devin/mcp_config.json` symlinks to it |
| Cursor config | `hooks/cursor/mcp.json` | portable entry; Cursor reaches the server via the shared `.claude/mcp.json` |
| Hub mirrors | `.opencode/hooks/sk-vision/{cursor,devin}` | per-file symlinks back to the sources, matching the `{pi,opencode}` mirrors |
| Four-host doc | `hooks/README.md` | in-process vs MCP model + the Cursor shared-config note + the hub-mirror note |
| Host docs | `SKILL.md` §3, `README.md` §7 | name all four hosts; version 0.1.3.1 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The two config files were written under `hooks/`, both pointing to the same `dist/mcp-server.js`. `.devin/mcp_config.json` was replaced with a symlink to `hooks/devin/mcp_config.json`, giving Devin the same own-the-source pattern Pi and OpenCode use. Cursor keeps reading the shared `.claude/mcp.json`, so `hooks/cursor/mcp.json` is the portable entry and `hooks/README.md` records that asymmetry. The MCP server, the 13 tools, and the in-process adapters were not touched, so a `tools/list` probe and the skill package check were re-run to confirm nothing regressed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Own + symlink the Devin config | Devin loads a dedicated file, so the skill can own it exactly like Pi/OpenCode |
| Keep `hooks/cursor/mcp.json` portable, not a load path | Cursor reads the shared `.claude/mcp.json` (with other servers); the skill cannot own that file |
| Leave the MCP server in `vision-runtime` | It needs the MCP SDK dependency that resolves inside the package |
| Add a `hooks/README.md` | The four-host layout is only obvious once the in-process vs MCP split is stated |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `hooks/` tree | lists `cursor/mcp.json`, `devin/mcp_config.json`, `opencode/`, `pi/`, `README.md` |
| `.devin/mcp_config.json` | symlink resolves to `hooks/devin/mcp_config.json` |
| hub mirrors | `.opencode/hooks/sk-vision/{pi,opencode,cursor,devin}` all four resolve |
| both configs | valid JSON, `mcpServers.sk-vision` present |
| MCP `tools/list` | 13 tools |
| `ci-skill-root-metadata.cjs` | `OK [S] sk-vision` |
| `validate_skill_package.py --check` | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## KNOWN LIMITATIONS

- `hooks/cursor/mcp.json` is not Cursor's load path in this repo (Cursor reads the shared `.claude/mcp.json`); it is the portable entry, marked as such in `hooks/README.md`.
- `dist/mcp-server.js` remains a gitignored build artifact, so both MCP configs need `bun run build` before they launch on a fresh checkout.
- The changes live in the main checkout only; the commit on `v4` is pending. Unrelated checkout work is untouched.
- `description.json` and `graph-metadata.json` are conductor-generated, not hand-authored.
<!-- /ANCHOR:limitations -->
