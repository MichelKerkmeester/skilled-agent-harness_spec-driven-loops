---
title: "Implementation Plan: sk-vision Cursor + Devin MCP adapters"
description: "Port the tested MCP stdio server onto v4, add its build entry, and wire the Cursor and Devin MCP config files to launch it."
trigger_phrases:
  - "sk-vision cursor devin plan"
  - "sk-vision mcp plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/014-cursor-devin-mcp-adapters"
    last_updated_at: "2026-08-17T12:10:09.000Z"
    last_updated_by: "claude"
    recent_action: "Ported the MCP server to v4 and wired the Cursor and Devin MCP configs."
    next_safe_action: "Author the phase spec docs and commit the sk-vision-scoped changes on v4."
    blockers: []
    key_files:
      - "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/014-cursor-devin-mcp-adapters/plan.md"
      - ".opencode/skills/sk-vision/vision-runtime/scripts/build.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-014-cursor-devin-mcp-adapters"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: sk-vision Cursor + Devin MCP adapters

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript MCP server bundled by Bun; JSON host configs |
| **Framework** | Model Context Protocol (`@modelcontextprotocol/sdk`) over stdio |
| **Storage** | Built `dist/mcp-server.js`; `.claude/mcp.json` + `.devin/mcp_config.json` |
| **Testing** | `bun test` (MCP client asserts 13 tools), a live `tools/list` probe against the config command |

### Overview
Cursor and Devin attach tools only over MCP. Port the tested MCP stdio server onto v4 inside the runtime package (where the MCP SDK resolves), add its build entry, and point both hosts' MCP config files at the built server.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] MCP-only host model confirmed. Evidence: Cursor/Devin have no in-process plugin API; they read `.cursor/mcp.json` / `.devin/mcp_config.json`.
- [x] Tested server source located. Evidence: PR #34 worktree `vision-runtime/src/mcp/server.ts` + `server.test.ts`.

### Definition of Done
- [x] Server builds and lists 13 tools. Evidence: `implementation-summary.md` Verification.
- [x] Both host configs launch it. Evidence: `.claude/mcp.json` + `.devin/mcp_config.json` entries.
- [ ] Changes committed on v4. Evidence: pending the commit.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One shared MCP stdio server for the MCP-only hosts, launched per host by its MCP config; the in-process adapters (Pi/OpenCode) are unchanged.

### Key Components
- **MCP server** — `vision-runtime/src/mcp/server.ts`, registering the shared 13 tool definitions with the MCP SDK; built to `dist/mcp-server.js`.
- **Cursor config** — the `sk-vision` entry in the canonical `.claude/mcp.json`, reached via `.cursor/mcp.json → .mcp.json`.
- **Devin config** — `.devin/mcp_config.json` `sk-vision` entry.

### Data Flow
Host (Cursor/Devin) reads its MCP config -> launches `node dist/mcp-server.js` -> server registers the 13 tools -> tool calls reach the shared vision-runtime core over the same NDJSON path the in-process adapters use.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Port the server
- [x] Copy `server.ts` + `server.test.ts` into `vision-runtime/src/mcp/`. Evidence: files present on v4, unchanged from the tested source.
- [x] Add the `sk-vision-mcp` bin. Evidence: `vision-runtime/package.json` `bin`.

### Phase 2: Build + configs
- [x] Add the MCP-server build entry. Evidence: `build.ts` emits `dist/mcp-server.js`.
- [x] Add the Cursor entry to `.claude/mcp.json`; create `.devin/mcp_config.json`. Evidence: both contain `mcpServers.sk-vision`.

### Phase 3: Docs
- [x] Document Cursor/Devin in SKILL.md and README host-adapter sections. Evidence: SKILL.md §3 and README §7 name both hosts.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Build | MCP server bundle | `bun run build` |
| Unit | 13-tool listing + status over MCP | `bun test` (`server.test.ts`) |
| Live | config command lists 13 tools | `tools/list` JSON-RPC probe against `node dist/mcp-server.js` |
| Config | valid JSON with the server | `python3 -c json.load` on both configs |
| Regression | runtime | `bun test` 9/0 |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `@modelcontextprotocol/sdk` | External | Present in vision-runtime | Server cannot build |
| Tested `012` server | Internal | Available on the worktree | No proven source to port |
| `.cursor/mcp.json` symlink chain | Internal | Verified | Cursor cannot reach the entry |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A host fails to launch the server, or the build breaks.
- **Procedure**: The change is additive — remove the `vision-runtime/src/mcp/` server, its build entry and bin, and the two config entries. The in-process adapters and the 13 tool contracts are untouched, so removing the MCP transport returns to the OpenCode/Pi-only state.
<!-- /ANCHOR:rollback -->
