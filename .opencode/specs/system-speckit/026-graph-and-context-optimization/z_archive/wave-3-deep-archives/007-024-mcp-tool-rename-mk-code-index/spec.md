---
title: "MCP Tool Rename: mk-code-index"
description: "Rename the standalone code-graph MCP server from system_code_graph to mk-code-index while preserving stable code_graph_* tool identifiers and the system-code-graph skill folder."
trigger_phrases:
  - "010 mcp tool rename mk code index"
  - "rename system code graph mcp to mk code index"
  - "mcp__mk_code_index code graph namespace"
  - "mk-code-index launcher"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/z_archive/wave-3-deep-archives/007-024-mcp-tool-rename-mk-code-index"
    last_updated_at: "2026-05-14T17:29:04Z"
    last_updated_by: "cli-codex-gpt5.5-xhigh-fast-010"
    recent_action: "Renamed MCP server to mk-code-index"
    next_safe_action: "Restart MCP children after merge"
    blockers: []
    key_files:
      - ".claude/mcp.json"
      - "opencode.json"
      - ".opencode/bin/mk-code-index-launcher.cjs"
      - ".opencode/skills/system-code-graph/mcp_server/index.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-14-010-mcp-tool-rename-mk-code-index"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "MCP config keys use mk_code_index while the server handshake name uses mk-code-index."
      - "Client tool namespace is mcp__mk_code_index__* because MCP tool prefixes normalize hyphens to underscores."
      - "code_graph_* tool identifiers and SPECKIT_CODE_GRAPH_* env vars remain unchanged."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: MCP Tool Rename: mk-code-index

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-14 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The extracted code-graph MCP server was registered as `system_code_graph`. The operator's preferred standalone server name is `mk-code-index`, while the skill folder remains `.opencode/skills/system-code-graph/` and the public tool identifiers remain `code_graph_*`, `ccc_*`, and `detect_changes`.

Leaving mixed naming in configs, launcher state, server metadata, and MCP tool grants would make the fresh runtime expose stale `mcp__system_code_graph__*` names after restart.

### Purpose

Rename only the standalone MCP server identity and launcher binding to `mk-code-index`, with client-facing tool namespace references updated to `mcp__mk_code_index__*`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Rename the MCP config key from `system_code_graph` to `mk_code_index` in `.claude/mcp.json` and `opencode.json`.
- Rename `.opencode/bin/system-code-graph-launcher.cjs` to `.opencode/bin/mk-code-index-launcher.cjs`.
- Update launcher stderr prefix, state command name, lockdir name, and state JSON filename.
- Update `.opencode/skills/system-code-graph/mcp_server/index.ts` to advertise server name `mk-code-index`.
- Update live MCP namespace references from `mcp__system_code_graph__*` to `mcp__mk_code_index__*`.
- Keep code-graph tool IDs unchanged.
- Keep `SPECKIT_CODE_GRAPH_*` environment variables unchanged.
- Keep `.opencode/skills/system-code-graph/` as the skill folder name.

### Out of Scope

- Existing packet docs under children `001` through `009`.
- Parallel packet folders `012` and `015`.
- Live MCP child process termination.
- Git branch changes, feature branches, or rebases.
- Renaming `code_graph_*`, `ccc_*`, or `detect_changes` tools.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.claude/mcp.json` | Modify | Register `mk_code_index` and point at the new launcher. |
| `opencode.json` | Modify | Register `mk_code_index` and point at the new launcher. |
| `.opencode/bin/mk-code-index-launcher.cjs` | Rename/modify | New launcher filename, stderr prefix, state names, and command value. |
| `.opencode/skills/system-code-graph/mcp_server/index.ts` | Modify | Advertise server name `mk-code-index`. |
| `.opencode/skills/system-code-graph/**` | Modify | Update owned runtime/docs references to the new MCP namespace. |
| `.opencode/commands/doctor/**` | Modify | Update allowed MCP tool grants to the new namespace. |
| `.opencode/skills/system-spec-kit/mcp_server/**` | Modify | Update runtime guidance and tool schema hints to the new namespace. |
| `010-mcp-tool-rename-mk-code-index/` | Create | Track scope, plan, tasks, and verification evidence. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Runtime config uses the new MCP server key | `.claude/mcp.json` and `opencode.json` contain `mk_code_index` and no `system_code_graph` entry. |
| REQ-002 | Launcher binding uses the new name | `.opencode/bin/mk-code-index-launcher.cjs` exists, old launcher path is removed, and state paths use `.mk-code-index-launcher.*`. |
| REQ-003 | MCP server advertises `mk-code-index` | `mcp_server/index.ts` passes `name: 'mk-code-index'` to `new Server`. |
| REQ-004 | Client-facing namespace references are updated | Live docs/config/code grants use `mcp__mk_code_index__*` instead of `mcp__system_code_graph__*`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Tool IDs stay stable | No rename of `code_graph_*`, `ccc_*`, or `detect_changes` tool identifiers. |
| REQ-006 | Spec-kit env namespace stays stable | `SPECKIT_CODE_GRAPH_*` env vars remain unchanged. |
| REQ-007 | Build and runtime smoke pass | `npx tsc` exits 0 and launcher smoke starts with the new prefix. |
| REQ-008 | Packet docs validate | `validate.sh --strict` exits 0 for this 010 packet. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Fresh MCP clients will see code-graph tools under `mcp__mk_code_index__*` after restart.
- **SC-002**: The new launcher starts without missing-module or stale-path errors.
- **SC-003**: The rename does not change the code-graph skill folder, tool IDs, or `SPECKIT_CODE_GRAPH_*` env vars.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Running MCP children keep old registrations | Current runtime still exposes old names until restart. | Do not kill children; record restart requirement. |
| Risk | MCP config key and server handshake name differ in spelling | Tool namespace could be misdocumented. | Use `mk_code_index` for config keys and `mk-code-index` for `new Server`, with `mcp__mk_code_index__*` in grants. |
| Dependency | Local TypeScript dependencies | `npx tsc` must use the checked-out toolchain without network. | Run from `.opencode/skills/system-code-graph` and record exit code. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None.
<!-- /ANCHOR:questions -->
