---
title: "Feature Specification: Code-Graph Workspace-Root + IPC Socket Reconnect Fix [template:level_2/spec.md]"
description: "The mk_code_index MCP server failed to reconnect (-32000). Two startup crashes: a stray nested .opencode/ dir mis-resolved the workspace root (OUTSIDE_WORKSPACE on the DB dir), and an over-strict IPC socket check rejected the required /tmp socket dir."
trigger_phrases:
  - "code index reconnect"
  - "mk_code_index -32000"
  - "OUTSIDE_WORKSPACE"
  - "workspace root resolution"
  - "ipc socket workspace"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-code-graph/031-code-graph-buildout/003-code-graph-workspace-root-fix"
    last_updated_at: "2026-05-26T08:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Fixed both startup crashes; verified MCP handshake (8 tools)"
    next_safe_action: "Reconnect mk_code_index via /mcp"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/mcp_server/core/config.ts"
      - ".opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Is /tmp socket dir required? Yes — in-workspace path is 121 chars, exceeds macOS sun_path limit (104)."
---
# Feature Specification: Code-Graph Workspace-Root + IPC Socket Reconnect Fix

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-05-26 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`/mcp` reported `Failed to reconnect to mk_code_index: -32000`. The code-graph MCP server crashed on startup, so the launcher's bridge could never connect. Investigation found two independent, stacked startup crashes — the second masked by the first.

### Purpose
Restore `mk_code_index` reconnection by making both the workspace-root resolution and the IPC socket-dir validation robust to the real deployment layout and the required `/tmp` socket path.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Harden `resolveWorkspaceRoot()` so stray nested `.opencode/` dirs cannot mis-resolve the workspace root.
- Remove 5 stray, untracked `.opencode/` artifact dirs under `.opencode/skills/`.
- Allow the OS temp dir + `/tmp` as valid IPC socket-dir roots (alongside the workspace), preserving the unlink owner-check hardening.

### Out of Scope
- Reconciling the `config.ts` `defaultDir` fallback with the documented canonical DB dir (pre-existing latent mismatch, already flagged in-code for a separate follow-up).
- Applying the socket-root fix to `mk-spec-memory` / `mk-skill-advisor` (they never had the over-strict check; unaffected).
- Adding a stronger root-marker (e.g. `.git`) to the resolver — current on-path `.opencode` anchor is sufficient for the framework layout.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-code-graph/mcp_server/core/config.ts` | Modify | Anchor `resolveWorkspaceRoot()` on the file's own on-path `.opencode` segment |
| `.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts` | Modify | Allow OS temp dir + `/tmp` as socket-dir roots; keep owner check |
| `.opencode/skills/system-code-graph/mcp_server/dist/**` | Modify | Rebuilt from source (`tsc --build`) |
| `.opencode/skills/{system-code-graph,system-skill-advisor,sk-doc,system-spec-kit}/**/.opencode/` | Delete | 5 stray untracked artifact dirs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Workspace root resolves to project root regardless of stray nested `.opencode/` dirs | Launcher startup no longer throws `CanonicalDbDirError: OUTSIDE_WORKSPACE` |
| REQ-002 | IPC socket binds at the configured `/tmp` dir | `[ipc-bridge] socket listening at /private/tmp/mk-code-index/daemon-ipc.sock`; no throw |
| REQ-003 | Server completes MCP handshake | `initialize` returns `mk-code-index`; `tools/list` returns 8 tools |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Stale `/tmp` socket reclaimed on restart | Second launcher run rebinds without `EADDRINUSE` throw |
| REQ-005 | Unlink hardening preserved | `canUnlinkExistingSocket` still requires socket type + owner uid match |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `mk_code_index` reconnects in Claude Code (no `-32000`).
- **SC-002**: `typecheck` + `build` pass; MCP handshake returns 8 tools.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Relaxing socket-dir constraint to include `/tmp` | Low — broadens allowed socket location | Owner-uid check on unlink retained; siblings already operate this way |
| Risk | On-path `.opencode` nesting could mis-anchor | Low — not present in framework layout | Returns first on-path `.opencode` parent; documented assumption |
| Dependency | macOS `sun_path` 104-char limit | Forces `/tmp` socket | Confirmed in-workspace path = 121 chars |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Security
- **NFR-S01**: Socket unlink restricted to sockets we own (`stat.uid === process.getuid()`) and of socket type.
- **NFR-S02**: Socket file created mode `0600` (owner-only).
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Path Resolution
- Stray sibling `.opencode/` dir: ignored (not on the running file's ancestry path).
- File not under any `.opencode/` segment: falls back to `process.cwd()` (unchanged behavior).

### Socket
- Non-existent socket dir: resolved by absolute path (not realpath) and still range-checked.
- Stale socket owned by another user: not unlinked (owner check returns false).
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | 2 source files, ~50 LOC, 1 subsystem |
| Risk | 18/25 | Path resolution + socket security boundary |
| Research | 10/20 | Root-cause across 3 sibling servers + sun_path limit |
| **Total** | **36/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None — both root causes confirmed, fixes verified end-to-end.
<!-- /ANCHOR:questions -->
