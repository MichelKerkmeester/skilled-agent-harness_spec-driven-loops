---
title: "Feature Specification: Canonicalize missing IPC socket dirs in code-graph resolveIpcSocketPath"
description: "The code-graph MCP server crashes with -32000 when its /tmp socket dir is missing (e.g. cleared on reboot) because resolveIpcSocketPath only canonicalizes the dir when it exists; the literal /tmp path then fails the allowed-root check that compares against canonicalized /private/tmp."
trigger_phrases:
  - "ipc socket dir canonicalize"
  - "resolveIpcSocketPath missing dir"
  - "mk-code-index -32000 socket"
  - "code-graph socket reboot"
  - "allowed socket root check"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/007-mcp-daemon-reliability/001-ipc-socket-dir-canonicalize"
    last_updated_at: "2026-05-28T17:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Implemented canonicalize-missing fix + regression test; built dist"
    next_safe_action: "None; phase complete pending strict validate"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts"
      - ".opencode/skills/system-code-graph/mcp_server/tests/ipc-socket-resolve.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000291"
      session_id: "029-001-ipc-socket-dir-canonicalize"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Scope: only system-code-graph has the allowed-root check; system-spec-kit + system-skill-advisor have no such check and are unaffected"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Canonicalize missing IPC socket dirs in code-graph resolveIpcSocketPath

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-28 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 7 |
| **Predecessor** | None |
| **Successor** | 002-code-graph-initial-scan |
| **Handoff Criteria** | Fix shipped + regression test green + dist rebuilt; mk_code_index reconnect succeeds without a pre-created socket dir |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the MCP socket-dir reboot resilience packet: make the code-graph server's IPC socket-dir resolution survive a missing/cleared socket directory.

**Scope Boundary**: `system-code-graph` socket-server only. `system-spec-kit` and `system-skill-advisor` socket-servers have no allowed-root check, so they are not subject to this failure and are out of scope.

**Dependencies**: None (pure code change + test; no MCP needed to implement).

**Deliverables**:
- `canonicalizePath` handles a non-existent leaf by canonicalizing the nearest existing ancestor.
- `resolveIpcSocketPath` uses `canonicalizePath` for the socket dir.
- Regression test covering missing-dir resolve + out-of-root rejection.
- Rebuilt `system-code-graph` dist.

**Changelog**: When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `mk_code_index` (system-code-graph) MCP server failed to connect with `MCP error -32000: Connection closed`. `resolveIpcSocketPath` only `realpath`-normalizes the socket dir when `fs.existsSync(rawSocketDir)` is true; when the configured `/tmp/mk-code-index` dir is missing (e.g. cleared on reboot), the literal `/tmp/...` path is checked against `allowedSocketRoots()`, which stores `canonicalizePath('/tmp')` = `/private/tmp` on macOS. `/tmp` != `/private/tmp`, so `isWithinAllowedSocketRoot` returns false and the server throws at startup.

### Purpose
The code-graph server resolves its IPC socket dir to a canonical path even when the dir does not exist yet, so a reboot-cleared `/tmp` socket dir no longer crashes startup.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Canonicalize a non-existent socket-dir candidate via its nearest existing ancestor.
- Route `resolveIpcSocketPath` through the fixed `canonicalizePath`.
- Regression test for the missing-dir and out-of-root cases.

### Out of Scope
- `system-spec-kit` / `system-skill-advisor` socket-servers — they have no allowed-root check, so the bug does not apply.
- Changing the `SPECKIT_IPC_SOCKET_DIR=/tmp/<service>` config convention — the `/tmp` path is valid and intended.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts` | Modify | `canonicalizePath` ancestor-walk + `resolveIpcSocketPath` uses it |
| `.opencode/skills/system-code-graph/mcp_server/tests/ipc-socket-resolve.vitest.ts` | Create | Regression test |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A missing `/tmp` socket dir must resolve without throwing | `resolveIpcSocketPath` with `SPECKIT_IPC_SOCKET_DIR` set to a non-existent `/tmp/<name>` returns a canonical socket path and does not throw |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | The allowed-root guard must still reject out-of-root dirs | A non-existent dir outside the workspace and system temp dirs still throws "must stay within…" |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `mk_code_index` reconnects successfully with no pre-created socket dir (the server creates the canonical dir on bind via the existing `mkdirSync`).
- **SC-002**: Regression test passes (missing-dir resolves; out-of-root rejects); no regression in existing code-graph tests.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Change touches every socket-server startup | Low | Change only affects the previously-throwing/literal branch; existing-dir paths resolve identically (realpath) |
| Dependency | Live verification needs mk_code_index reconnect | Low | Unit test + code inspection confirm; live confirm folds into Phase 2 reconnect |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None — root cause diagnosed and fix implemented this session.
<!-- /ANCHOR:questions -->
