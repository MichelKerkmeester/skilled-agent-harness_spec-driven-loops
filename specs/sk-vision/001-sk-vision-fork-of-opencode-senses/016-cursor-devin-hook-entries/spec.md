---
title: "Feature Specification: Cursor + Devin hook entries"
description: "Give Cursor and Devin visible hooks/ entries by moving their MCP configs under hooks/cursor and hooks/devin, so all four hosts appear in the skill's hooks tree."
trigger_phrases:
  - "sk-vision cursor hook entry"
  - "sk-vision devin hook entry"
  - "sk-vision hooks four hosts"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/016-cursor-devin-hook-entries"
    last_updated_at: "2026-08-17T15:17:23.000Z"
    last_updated_by: "claude"
    recent_action: "Added hooks/cursor and hooks/devin plus their hook-hub mirror symlinks."
    next_safe_action: "Author the phase spec docs and commit the sk-vision-scoped changes on v4."
    blockers: []
    key_files:
      - "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/016-cursor-devin-hook-entries/spec.md"
      - ".opencode/skills/sk-vision/hooks/devin/mcp_config.json"
      - ".opencode/skills/sk-vision/hooks/cursor/mcp.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-016-cursor-devin-hook-entries"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Cursor + Devin hook entries

<!-- SPECKIT_LEVEL: 1 -->
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
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-08-17 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `specs/sk-vision/001-sk-vision-fork-of-opencode-senses` |
| **Predecessor** | `015-sk-code-opencode-alignment` |
| **Successor** | N/A |
| **Handoff Criteria** | Cursor and Devin have `hooks/` entries; the Devin symlink resolves; the MCP server still lists 13 tools; skill package validates; changes committed. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

`014` wired Cursor and Devin over MCP but left them invisible in the `hooks/` tree — only Pi and OpenCode had `hooks/<host>/` sources, because Cursor and Devin are MCP-only and their "adapter" is a config file, not in-process code. This phase surfaces both hosts under `hooks/` for a consistent four-host layout.

**Scope Boundary**: `hooks/cursor/mcp.json`, `hooks/devin/mcp_config.json`, `hooks/README.md`, the `.devin/mcp_config.json` symlink, and the SKILL.md/README host-adapter text. Do not change the MCP server, the 13 tools, or the in-process adapters.

**Dependencies**:
- The MCP server (`014`) is the shared transport both configs launch.
- Devin loads a dedicated `.devin/mcp_config.json`; Cursor reads the shared `.claude/mcp.json`.

**Deliverables**:
- A `hooks/` tree that shows all four hosts.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `hooks/` directory showed only `pi/` and `opencode/`. Cursor and Devin worked over MCP but had no presence there, so the layout read as if only two hosts were supported. Their config wiring lived at the host load paths (`.devin/mcp_config.json`, the `.claude/mcp.json` entry), away from the skill's `hooks/` source tree.

### Purpose
Represent Cursor and Devin under `hooks/` alongside Pi and OpenCode, with a README explaining why the two MCP-only hosts carry a config rather than in-process code.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `hooks/devin/mcp_config.json` (skill-owned) and symlink `.devin/mcp_config.json` to it.
- Add `hooks/cursor/mcp.json` as the portable Cursor entry (Cursor reads the shared `.claude/mcp.json` in this repo).
- Mirror the cursor and devin sources into the shared hook hub at `.opencode/hooks/sk-vision/{cursor,devin}`, matching the existing `{pi,opencode}` mirrors.
- Add `hooks/README.md` documenting the four-host model.
- Update SKILL.md/README host-adapter text to point at the new entries.

### Out of Scope
- The MCP server, the 13 tool contracts, or the in-process adapters.
- Repointing `.cursor/mcp.json` away from the shared `.claude/mcp.json` (it needs the other servers).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-vision/hooks/devin/mcp_config.json` | Create | Skill-owned Devin MCP config |
| `.opencode/skills/sk-vision/hooks/cursor/mcp.json` | Create | Portable Cursor MCP config entry |
| `.opencode/skills/sk-vision/hooks/README.md` | Create | Four-host adapter model |
| `.devin/mcp_config.json` | Update | Now a symlink to the owned source |
| `.opencode/hooks/sk-vision/{cursor,devin}/` | Create | Hub mirror symlinks back to the two config sources |
| `.opencode/skills/sk-vision/SKILL.md`, `README.md`, `hooks/README.md` | Update | Point host-adapter text at the new entries + hub mirrors; version 0.1.3.1 |

### Verification evidence

- `hooks/` now lists `cursor/mcp.json`, `devin/mcp_config.json`, `opencode/`, `pi/`, `README.md`.
- `.devin/mcp_config.json` resolves to `hooks/devin/mcp_config.json`; both configs are valid JSON with the `sk-vision` server.
- The config command's MCP `tools/list` still returns 13 tools; `ci-skill-root-metadata.cjs` `OK [S] sk-vision`; `validate_skill_package.py --check` PASS.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Both hosts visible in hooks | `hooks/cursor/` and `hooks/devin/` exist with configs |
| REQ-002 | Devin still loads its config | `.devin/mcp_config.json` symlink resolves to the owned source |
| REQ-003 | No transport regression | MCP `tools/list` still returns 13 tools |
| REQ-004 | Skill still validates | `ci-skill-root-metadata.cjs` `OK [S]`; package `--check` PASS |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-P1 | The Cursor asymmetry is documented | `hooks/README.md` explains the shared `.claude/mcp.json` reach |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- [x] Cursor + Devin visible in `hooks/`. Evidence: `find` shows `hooks/cursor/mcp.json` and `hooks/devin/mcp_config.json`.
- [x] Devin symlink resolves. Evidence: `readlink .devin/mcp_config.json` -> `hooks/devin/mcp_config.json`.
- [x] Configs valid + point to the server. Evidence: `json.load` on both; both carry `mcpServers.sk-vision`.
- [x] MCP transport unchanged. Evidence: config command MCP `tools/list` returned 13.
- [x] Skill validates. Evidence: `ci-skill-root-metadata.cjs` `OK [S] sk-vision`; package `--check: PASS`.
- [x] Four-host model documented. Evidence: `hooks/README.md` plus SKILL.md §3 / README §7.
- [x] Hub mirrors resolve. Evidence: `.opencode/hooks/sk-vision/{cursor/mcp.json,devin/mcp_config.json}` symlinks resolve back to the sources, alongside the existing `{pi,opencode}` mirrors.
- [ ] Changes committed on v4. Evidence: pending the commit.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | `hooks/cursor/mcp.json` is not Cursor's load path in this repo | Reads as an unused file | `hooks/README.md` marks it portable and names the real reach (shared `.claude/mcp.json`) |
| Risk | Devin symlink dangles | Devin loses its config | `readlink` verified; the target is the committed owned source |
| Dependency | The `014` MCP server | Both configs launch it | Unchanged; `tools/list` re-verified |
<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

### Answered Questions
- **Q**: Why not a symlinked `hooks/cursor` load path like Devin? **A**: Cursor reads the shared `.claude/mcp.json` (which carries other MCP servers too), so the skill cannot own that file; `hooks/cursor/mcp.json` is the portable entry instead.
- **Q**: Why does the MCP server not move under `hooks/`? **A**: It needs the MCP SDK dependency that resolves inside `vision-runtime`.

### Open Questions
- None.
<!-- /ANCHOR:questions -->
