---
title: "Feature Specification: sk-vision Cursor + Devin MCP adapters"
description: "Expose sk-vision's 13 tools inside Cursor and Devin (both MCP-only hosts) via a shared MCP stdio server and their MCP config files."
trigger_phrases:
  - "sk-vision cursor support"
  - "sk-vision devin support"
  - "sk-vision mcp server"
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
      - "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/014-cursor-devin-mcp-adapters/spec.md"
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
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: sk-vision Cursor + Devin MCP adapters

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-08-17 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `specs/sk-vision/001-sk-vision-fork-of-opencode-senses` |
| **Predecessor** | `013-skill-standards-and-hook-restructure` |
| **Successor** | N/A |
| **Handoff Criteria** | The MCP server builds and lists 13 tools; Cursor and Devin MCP configs launch it; docs document both hosts; runtime tests stay green; changes committed. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This phase child extends sk-vision's host reach to Cursor and Devin. Both are MCP-only — they attach tools exclusively over the Model Context Protocol and have no in-process plugin API — so they cannot use the `hooks/pi` / `hooks/opencode` in-process adapters from `013`.

**Scope Boundary**: the MCP server under `vision-runtime/src/mcp/`, its build entry, the `sk-vision-mcp` bin, the `.claude/mcp.json` entry, and `.devin/mcp_config.json`, plus SKILL.md/README host-adapter docs. Do not change the 13 tool contracts, the vision-runtime core, or the in-process adapters.

**Dependencies**:
- The tested MCP server already exists on the PR #34 worktree (packet `012`); it is ported here rather than rebuilt.
- `@modelcontextprotocol/sdk` is a `vision-runtime` dependency, so the server stays in the package where the dep resolves.
- Cursor reads `.cursor/mcp.json`, which symlinks through `.mcp.json` to the canonical `.claude/mcp.json`.

**Deliverables**:
- A shared MCP stdio server exposing the 13 tools.
- Cursor and Devin MCP config entries launching it.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
On v4, sk-vision only worked in OpenCode and Pi. Cursor and Devin — both MCP-only coding hosts — had no way to reach the 13 tools: there was no MCP server on v4 (`vision-runtime/src/mcp/server.ts` was absent), no `.devin/mcp_config.json`, and no sk-vision entry in the Cursor/Claude MCP config. The MCP transport built earlier lived only on the PR #34 worktree with the pre-restructure layout and never landed on v4.

### Purpose
Give Cursor and Devin the same 13 tools by porting the tested MCP stdio server onto v4 and wiring both hosts' MCP config files to launch it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Port `vision-runtime/src/mcp/server.ts` and `server.test.ts` onto v4 (unchanged; they import the shared core within the package).
- Add the MCP-server build entry emitting `dist/mcp-server.js` and the `sk-vision-mcp` bin.
- Add the `sk-vision` entry to `.claude/mcp.json` (reaches Cursor) and create `.devin/mcp_config.json`.
- Document Cursor and Devin in SKILL.md and README host-adapter sections.

### Out of Scope
- Changing the 13 tool contracts, the vision-runtime core, or the Pi/OpenCode adapters.
- Merging the PR #34 worktree.
- The gitignored `package.json` / `dist` fresh-checkout build caveat (pre-existing).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-vision/vision-runtime/src/mcp/server.ts` | Create | MCP stdio server exposing the 13 tools (ported) |
| `.opencode/skills/sk-vision/vision-runtime/src/mcp/server.test.ts` | Create | Hermetic MCP client test asserting 13 tools + status (ported) |
| `.opencode/skills/sk-vision/vision-runtime/scripts/build.ts` | Update | Emit `dist/mcp-server.js` |
| `.opencode/skills/sk-vision/vision-runtime/package.json` | Update | `sk-vision-mcp` bin |
| `.claude/mcp.json` | Update | `sk-vision` server entry (reaches Cursor) |
| `.devin/mcp_config.json` | Create | Devin `sk-vision` server entry |
| `.opencode/skills/sk-vision/SKILL.md`, `README.md` | Update | Document Cursor/Devin MCP host adapters |

### Verification evidence

- `bun run build` emits `dist/mcp-server.js`; `bun test` = 9 pass / 0 fail (adds the MCP server test).
- The config command `node …/dist/mcp-server.js` answers MCP `tools/list` with 13 tools including `sk_vision_status`.
- `.claude/mcp.json` and `.devin/mcp_config.json` are valid JSON with the `sk-vision` server.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | MCP server exposes 13 tools | MCP `tools/list` returns 13 tools |
| REQ-002 | Server builds | `bun run build` emits `dist/mcp-server.js` |
| REQ-003 | Cursor config launches it | `.claude/mcp.json` has the `sk-vision` server (Cursor reaches it via the symlink chain) |
| REQ-004 | Devin config launches it | `.devin/mcp_config.json` has the `sk-vision` server |
| REQ-005 | No runtime regression | `bun test` stays green |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-P1 | Status works without model weights | `sk_vision_status` returns text over MCP with the model unloaded |
| REQ-P2 | Docs cover both hosts | SKILL.md and README name Cursor and Devin as MCP hosts |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- [x] MCP server lists 13 tools. Evidence: the config command's MCP `tools/list` returned 13 including `sk_vision_status`.
- [x] Server builds. Evidence: `bun run build` emits `dist/mcp-server.js` (~1.17 MB).
- [x] Cursor config wired. Evidence: `.claude/mcp.json` `mcpServers.sk-vision` present; `.cursor/mcp.json` symlinks to it via `.mcp.json`.
- [x] Devin config wired. Evidence: `.devin/mcp_config.json` `mcpServers.sk-vision` present and valid JSON.
- [x] No runtime regression. Evidence: `bun test` → 9 pass / 0 fail.
- [x] Docs cover both hosts. Evidence: SKILL.md §3 and README §7 host-adapter sections name Cursor and Devin.
- [ ] Changes committed on v4. Evidence: pending the commit.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | `dist/mcp-server.js` is a gitignored build artifact | Config command fails until `bun run build` on a fresh checkout | Same contract as the plugin/`dist`; documented |
| Risk | Committing on a busy `v4` checkout | Unrelated work could be swept in | Stage only sk-vision + config paths explicitly |
| Dependency | `@modelcontextprotocol/sdk` in vision-runtime | Required to build the server | Server stays in the package where the dep resolves |
| Dependency | `.cursor/mcp.json → .mcp.json → .claude/mcp.json` chain | Required for Cursor to reach the entry | Verified the chain resolves on v4 |
<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

### Answered Questions
- **Q**: Should the MCP server live under `hooks/` like the in-process adapters? **A**: No. It needs the MCP SDK dependency that resolves only inside `vision-runtime`, and it is a shared server for two hosts, not a per-host in-process adapter — so it stays in the package and the hosts attach via their MCP config.
- **Q**: Port the server or rebuild? **A**: Port the tested `012` server from the worktree; it is proven and unchanged.

### Open Questions
- None.
<!-- /ANCHOR:questions -->
