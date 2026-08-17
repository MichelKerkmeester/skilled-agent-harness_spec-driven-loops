---
title: "Implementation Summary: sk-vision Cursor + Devin MCP adapters"
description: "Closeout for exposing sk-vision's 13 tools to Cursor and Devin via a shared MCP stdio server and their MCP configs."
trigger_phrases:
  - "sk-vision cursor devin summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/014-cursor-devin-mcp-adapters"
    last_updated_at: "2026-08-17T12:10:09.000Z"
    last_updated_by: "claude"
    recent_action: "Ported the MCP server to v4 and wired the Cursor and Devin MCP configs."
    next_safe_action: "Commit the sk-vision-scoped changes on v4."
    blockers: []
    key_files:
      - "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/014-cursor-devin-mcp-adapters/implementation-summary.md"
      - ".opencode/skills/sk-vision/vision-runtime/src/mcp/server.ts"
      - ".devin/mcp_config.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-014-cursor-devin-mcp-adapters"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 014-cursor-devin-mcp-adapters |
| **Status** | In Progress |
| **Level** | 2 |

The MCP server, build, configs, and docs are done and verified; the sk-vision-scoped commit on v4 is the one remaining step.
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

sk-vision now reaches Cursor and Devin. Both are MCP-only hosts, so they attach the 13 tools over the Model Context Protocol rather than through an in-process adapter. A shared MCP stdio server — ported unchanged from the tested `012` worktree source — was added to the runtime package, built to `dist/mcp-server.js`, and wired into both hosts' MCP config files.

### Fix evidence

| Edit | Artifact | Result |
|------|----------|--------|
| MCP server | `vision-runtime/src/mcp/server.ts` | Registers the shared 13 tool definitions with the MCP SDK |
| Build entry | `vision-runtime/scripts/build.ts` | Emits `dist/mcp-server.js` (~1.17 MB) |
| Bin | `vision-runtime/package.json` | `sk-vision-mcp` -> `./dist/mcp-server.js` |
| Cursor config | `.claude/mcp.json` | `mcpServers.sk-vision`, reached via `.cursor/mcp.json` -> `.mcp.json` |
| Devin config | `.devin/mcp_config.json` | `mcpServers.sk-vision` |
| Docs | `SKILL.md` §3, `README.md` §7 | Cursor + Devin named as MCP host adapters |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The server and its test were copied unchanged from the PR #34 worktree into `vision-runtime/src/mcp/`, keeping their in-package relative imports intact. A second `Bun.build` entrypoint emits `dist/mcp-server.js` with the `mcp-server.[ext]` naming, and the package gained the `sk-vision-mcp` bin. The `sk-vision` server entry was added to the canonical `.claude/mcp.json` (which Cursor reaches through its symlink chain) and a new `.devin/mcp_config.json` was created. Both point at `node …/dist/mcp-server.js`. The build and the runtime `bun test` suite were re-run, and a live MCP `tools/list` probe was issued against the exact config command.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep the MCP server in `vision-runtime/src/mcp/`, not `hooks/` | It imports `@modelcontextprotocol/sdk` at runtime, which resolves only inside the package; and it is a shared server for two hosts, not a per-host in-process adapter |
| Port the tested `012` server rather than rebuild | The worktree server is proven (13-tool listing + status test); porting avoids re-introducing bugs |
| Wire Cursor through `.claude/mcp.json` | `.cursor/mcp.json` symlinks to it via `.mcp.json`, so one entry serves Cursor (and Claude) without a duplicate file |
| Point configs at the built `dist/mcp-server.js` | Matches the plugin's build-artifact contract; the host launches a plain `node` process |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `bun run build` | emits `dist/plugin.js` + `dist/mcp-server.js` + hooks/opencode adapter |
| `bun test` | 9 pass / 0 fail (adds the MCP server test) |
| MCP `tools/list` (config command) | 13 tools, includes `sk_vision_status` |
| status without model weights | `server.test.ts` asserts `loaded: false`, `provider: photon` |
| `.claude/mcp.json` / `.devin/mcp_config.json` | valid JSON, `mcpServers.sk-vision` present |
| Cursor reach | `.cursor/mcp.json` -> `.mcp.json` -> `.claude/mcp.json` |
| Scope isolation | only sk-vision + the two MCP configs changed |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## KNOWN LIMITATIONS

- `dist/mcp-server.js` is a gitignored build artifact, so the config command fails on a fresh checkout until `bun run build` runs — the same contract as the plugin bundle. The gitignored `vision-runtime/package.json` (carrying the MCP SDK dependency) is a pre-existing fresh-checkout caveat, out of scope here.
- The changes live in the main checkout only; the commit on `v4` is pending. Unrelated checkout work is untouched.
- `description.json` and `graph-metadata.json` are conductor-generated, not hand-authored.
<!-- /ANCHOR:limitations -->
