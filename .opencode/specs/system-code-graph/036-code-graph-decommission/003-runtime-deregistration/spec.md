---
title: "Feature Specification: Phase 3: runtime-deregistration"
description: "Remove the mk_code_index MCP server registration from all five runtime surfaces — OpenCode, Claude Code, Cursor, Codex, and the Claude PostToolUse hook — plus the local permission allowlist, so no runtime attempts to spawn the launcher."
trigger_phrases:
  - "mk_code_index deregistration"
  - "remove code graph mcp registration"
  - "opencode.json code graph removal"
  - "codex config code graph"
  - "036 runtime deregistration"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/036-code-graph-decommission/003-runtime-deregistration"
    last_updated_at: "2026-07-28T04:51:16Z"
    last_updated_by: "claude-code"
    recent_action: "Executed the phase and verified it"
    next_safe_action: "Closeout verification in phase 015"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-036-003-runtime-deregistration"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3: runtime-deregistration

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 15 |
| **Predecessor** | 002-decommission-decision-record |
| **Successor** | 004-plugin-and-hook-removal |
| **Handoff Criteria** | No runtime config references `mk_code_index`, and a fresh session in each runtime starts without an MCP registration error |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the code graph decommission specification.

**Scope Boundary**: Runtime registration surfaces only. Plugins, hooks that live outside config, and consumer code belong to later phases.

**Dependencies**:
- The ratified decision record from phase 002.

**Deliverables**:
- The `mk_code_index` server block removed from every registration file.
- The Claude PostToolUse freshness hook entry removed.
- The local Bash permission allowlist entry removed.
- Evidence that each runtime starts clean afterward.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The server is registered in `opencode.json`, `.claude/mcp.json`, and `.codex/config.toml`, and reached again through two symlinks — `.mcp.json` and `.cursor/mcp.json` both resolve to `.claude/mcp.json`, which makes Cursor a fifth registered surface that a naive audit misses. A sixth entry, the `Write|Edit` PostToolUse hook in `.claude/settings.json`, points directly into the skill folder rather than through a shim. If any of these survive deletion, the affected runtime will try to spawn a launcher whose target no longer exists.

### Purpose
Leave no runtime holding a registration for a server that is about to disappear, and prove it by starting each runtime cleanly.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The `mk_code_index` registration block in each config file.
- The Claude PostToolUse freshness hook entry.
- The `code-index.cjs` Bash permission allowlist entry.
- Confirming which config paths are symlinks so each real file is edited exactly once.

### Out of Scope
- Deleting the launcher or the skill folder — phases 012 and 013.
- Plugin and non-config hook removal — phase 004.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `opencode.json` | Modify | Remove the `mk_code_index` local server block |
| `.claude/mcp.json` | Modify | Remove the same block; reached also via `.mcp.json` and `.cursor/mcp.json` |
| `.codex/config.toml` | Modify | Remove the `[mcp_servers.mk_code_index]` table |
| `.claude/settings.json` | Modify | Remove the PostToolUse code-graph freshness hook |
| `.claude/settings.local.json` | Modify | Remove the `code-index.cjs` Bash allowlist entry |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All five registration surfaces are cleared | A `--no-ignore` sweep of config files returns no `mk_code_index` hit |
| REQ-002 | Symlinks are edited once, not duplicated | `.mcp.json` and `.cursor/mcp.json` remain valid symlinks; only the real file changed |
| REQ-003 | Each config remains syntactically valid | JSON and TOML parse cleanly after the edit |
| REQ-004 | The PostToolUse hook entry is removed | `Write|Edit` events fire no code-graph freshness command |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Explanatory `_NOTE_*` keys are removed with their block | No orphaned notes describing a server that no longer exists |
| REQ-006 | A fresh session starts clean in each runtime | No MCP connection error at session start |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Starting OpenCode, Claude Code, and Codex produces no registration or connection error.
- **SC-002**: No config file mentions the server, verified with `--no-ignore`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Global gitignore hides config files from sweeps | A registration survives unnoticed | Every verification uses `--no-ignore` |
| Risk | Editing through a symlink creates a duplicate file | Divergent configs across runtimes | Resolve symlinks first; edit the real path |
| Risk | A running daemon outlives its registration | Orphan process holding a lease | Daemon reaping is owned by phase 013 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does any runtime cache its MCP roster such that a restart is required beyond a fresh session?
<!-- /ANCHOR:questions -->

---

<!-- SCAFFOLD_VALIDATION_COUNTS:
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
