---
title: "Codex skill advisor Node runtime alignment"
description: "Codex pins the skill advisor to Node 22, but the installed better-sqlite3 native module targets Node ABI 141. The MCP server exits before initialize, which interrupts startup of the remaining Codex MCP servers."
trigger_phrases:
  - "Codex MCP startup interrupted"
  - "mk_skill_advisor failed to start"
  - "better-sqlite3 NODE_MODULE_VERSION 141"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/019-codex-node-runtime-alignment"
    last_updated_at: "2026-08-10T08:41:19Z"
    last_updated_by: "codex"
    recent_action: "Aligned the Codex advisor runtime and verified MCP initialization"
    next_safe_action: "Start a fresh Codex session and confirm the startup banner is clear"
    blockers: []
    key_files:
      - ".codex/config.toml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-mcp-runtime-alignment-20260810"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Use a new Level 1 packet under the system-skill-advisor track."
---
# Codex Skill Advisor Node Runtime Alignment

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-10 |
| **Branch** | Current branch |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Codex launches `mk_skill_advisor` with Node 22, whose module ABI is 127. The installed `better-sqlite3` binary was compiled for ABI 141, so the advisor process exits during startup and Codex interrupts initialization of the remaining MCP servers.

### Purpose
Launch the Codex skill advisor with the Node runtime that matches its installed native dependency, without changing unrelated MCP runtime pins.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Reproduce the native ABI failure under the configured Node 22 runtime.
- Update only the Codex `mk_skill_advisor` command to the compatible Node 25 executable.
- Verify TOML parsing and successful MCP initialization from the final configuration.

### Out of Scope
- Rebuilding `better-sqlite3`, because other configured runtimes already use the ABI 141 binary.
- Changing `mk-spec-memory` or `code_mode` runtime pins without independent failure evidence.
- Altering Codex-managed servers that were skipped after startup interruption.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.codex/config.toml` | Modify | Align the skill advisor command with Node ABI 141. |
| `specs/system-skill-advisor/019-codex-node-runtime-alignment/` | Create | Record scope, proof, and final state. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Use an advisor runtime compatible with the installed native SQLite module. | The exact configured launcher returns a valid MCP initialize response. |
| REQ-002 | Preserve unrelated MCP runtime selections. | The scoped diff changes no other `mcp_servers` command. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Keep the Codex config parseable and documented. | Python `tomllib` parses the file and strict packet validation exits 0. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Node 22 reproduces the native module ABI mismatch.
- **SC-002**: The final configured Node executable loads `better-sqlite3` and completes the advisor MCP initialize handshake.
- **SC-003**: `.codex/config.toml` parses and the scoped diff contains only the intended runtime change plus this packet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `/opt/homebrew/bin/node` ABI 141 | Advisor cannot load SQLite if its ABI changes. | Verify both runtime ABI and a live database constructor. |
| Risk | Over-correcting other MCP pins | Could break servers with different native dependencies. | Change only `mk_skill_advisor`; verify other registrations separately. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None.
<!-- /ANCHOR:questions -->
