---
title: "Implementation Plan: Cursor + Devin hook entries"
description: "Add hooks/cursor and hooks/devin MCP configs and a hooks README so all four hosts appear under hooks/."
trigger_phrases:
  - "sk-vision cursor devin hook entries plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/016-cursor-devin-hook-entries"
    last_updated_at: "2026-08-17T13:42:29.000Z"
    last_updated_by: "claude"
    recent_action: "Added hooks/cursor and hooks/devin MCP config entries and a hooks README."
    next_safe_action: "Author the phase spec docs and commit the sk-vision-scoped changes on v4."
    blockers: []
    key_files:
      - "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/016-cursor-devin-hook-entries/plan.md"
      - ".opencode/skills/sk-vision/hooks/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-016-cursor-devin-hook-entries"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Cursor + Devin hook entries

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON MCP configs; markdown README |
| **Framework** | Model Context Protocol host configs |
| **Storage** | `hooks/cursor/`, `hooks/devin/`; `.devin` symlink |
| **Testing** | symlink resolution, JSON validity, MCP `tools/list`, skill package check |

### Overview
Surface the two MCP-only hosts under `hooks/`: own Devin's config and symlink its load path to it, add Cursor's portable config, and document the four-host model.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Four-host model understood. Evidence: `spec.md` Phase Context (in-process vs MCP).
- [x] Cursor/Devin config asymmetry identified. Evidence: Devin dedicated file vs Cursor shared `.claude/mcp.json`.

### Definition of Done
- [x] Both hosts visible + Devin symlink resolves. Evidence: `implementation-summary.md` Verification.
- [x] MCP transport + skill package unchanged-green. Evidence: `tools/list` 13; package `--check` PASS.
- [ ] Changes committed on v4. Evidence: pending the commit.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Skill-owned host config sources under `hooks/<host>/`, symlinked to the host load path where the host uses a dedicated file (Devin); a portable reference where the host uses a shared file (Cursor).

### Key Components
- **`hooks/devin/mcp_config.json`** — owned; `.devin/mcp_config.json` symlinks to it.
- **`hooks/cursor/mcp.json`** — portable; Cursor reaches the server via the shared `.claude/mcp.json`.
- **`hooks/README.md`** — the four-host table and the in-process vs MCP explanation.

### Data Flow
Unchanged transport: both configs still launch `node dist/mcp-server.js`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Config entries
- [x] Create `hooks/devin/mcp_config.json` and `hooks/cursor/mcp.json`. Evidence: both present, valid JSON with `mcpServers.sk-vision`.
- [x] Symlink `.devin/mcp_config.json` to the owned source. Evidence: `readlink` -> `hooks/devin/mcp_config.json`.

### Phase 2: Docs
- [x] Add `hooks/README.md`; update SKILL.md §3 / README §7; bump version to 0.1.3.1. Evidence: the host-adapter sections name all four hosts.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Symlink | Devin load path | `readlink` / `test -e` |
| Config | JSON validity | `python3 json.load` |
| Transport | 13 tools still served | MCP `tools/list` probe |
| Package | skill still valid | `ci-skill-root-metadata.cjs`, `validate_skill_package.py` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `014` MCP server | Internal | Available | No server for the configs to launch |
| Devin dedicated config file | External | Available | Cannot own/symlink the load path |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The Devin symlink breaks its config load, or the new entries confuse the layout.
- **Procedure**: Restore `.devin/mcp_config.json` as a real file and delete `hooks/cursor/`, `hooks/devin/`, and `hooks/README.md`. The MCP server and the `.claude/mcp.json` Cursor entry are untouched, so the transport keeps working.
<!-- /ANCHOR:rollback -->
