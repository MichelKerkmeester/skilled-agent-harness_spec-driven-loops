---
title: "Feature Specification: Decouple Cursor MCP config; drop sk-vision from Claude"
description: "Give Cursor its own real MCP config so sk-vision is removed from Claude Code's .claude/mcp.json while staying available to Cursor, Devin, OpenCode, and Pi."
trigger_phrases:
  - "sk-vision cursor mcp decoupling"
  - "remove sk-vision from claude mcp"
  - "sk-vision host registration scope"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/020-cursor-mcp-decoupling"
    last_updated_at: "2026-08-18T15:00:00.000Z"
    last_updated_by: "claude"
    recent_action: "Decoupled Cursor MCP config; dropped sk-vision from .claude/mcp.json."
    next_safe_action: "Commit + push the config split once the operator approves."
    blockers: []
    key_files:
      - "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/020-cursor-mcp-decoupling/spec.md"
      - ".cursor/mcp.json"
      - ".claude/mcp.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-020-cursor-mcp-decoupling"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Decouple Cursor MCP config; drop sk-vision from Claude

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-08-18 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `specs/sk-vision/001-sk-vision-fork-of-opencode-senses` |
| **Predecessor** | `019-guaranteed-vision-for-text-only-models` |
| **Handoff Criteria** | sk-vision is absent from `.claude/mcp.json` and present in `.cursor/mcp.json` (real file), `.devin/mcp_config.json`, and the OpenCode/Pi in-process adapters; docs describe the new topology. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

The operator wants sk-vision available to OpenCode, Pi, Devin, and Cursor, but NOT registered as an MCP server for Claude Code. The trap: Cursor did not have its own MCP config — `.cursor/mcp.json` symlinked to `.mcp.json`, which symlinks to `.claude/mcp.json`, so Cursor and Claude read the *same* file. A plain delete would have stripped sk-vision from Cursor too.

**Scope Boundary**: `.cursor/mcp.json` (symlink → real file), `.claude/mcp.json` (remove one entry), and the sk-vision topology docs. Devin, OpenCode, and Pi registrations are already independent and unchanged.

**Deliverables**: a Cursor-owned MCP config carrying all four servers, and a Claude config without sk-vision.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`.cursor/mcp.json → .mcp.json → .claude/mcp.json` all resolve to one inode, so Cursor reads Claude's MCP config. Removing sk-vision from `.claude/mcp.json` would also remove it from Cursor — the opposite of the intent.

### Purpose
Break the sharing: give Cursor its own real `.cursor/mcp.json` (carrying all four servers, including sk-vision), then remove sk-vision from `.claude/mcp.json`. sk-vision stays available to Cursor, Devin, OpenCode, and Pi, and is no longer attached by Claude Code.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Convert `.cursor/mcp.json` from a symlink into a real file with all four servers (mk-spec-memory, mk_skill_advisor, code_mode, sk-vision).
- Remove the `sk-vision` entry from `.claude/mcp.json` (which repo-root `.mcp.json` mirrors).
- Update the sk-vision topology docs (`SKILL.md`, `README.md`, `hooks/README.md`).

### Out of Scope
- Devin, OpenCode, and Pi registrations (already independent; unchanged).
- The other three MCP servers' definitions (copied verbatim into the Cursor config).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.cursor/mcp.json` | Update | Symlink → real file with all four servers |
| `.claude/mcp.json` | Update | Remove the `sk-vision` entry |
| `.opencode/skills/sk-vision/hooks/README.md` | Update | New Cursor topology + env-scope note |
| `.opencode/skills/sk-vision/SKILL.md` | Update | New Cursor host-load-path description |
| `.opencode/skills/sk-vision/README.md` | Update | New Cursor host description |

### Verification evidence
- Per-endpoint JSON parse: `.claude/mcp.json` and repo-root `.mcp.json` have no `sk-vision`; `.cursor/mcp.json` and `.devin/mcp_config.json` do; all four parse as valid JSON.
- OpenCode/Pi in-process adapter symlinks still present.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | sk-vision absent from Claude | `.claude/mcp.json` (and repo-root `.mcp.json`) contain no `sk-vision` key |
| REQ-002 | sk-vision retained for Cursor | `.cursor/mcp.json` is a real file containing `sk-vision` |
| REQ-003 | No loss for Cursor | `.cursor/mcp.json` still carries the other three servers |
| REQ-004 | Other hosts unaffected | `.devin/mcp_config.json` and the OpenCode/Pi in-process adapters are unchanged |
| REQ-005 | Valid JSON | All edited config files parse as valid JSON |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- [x] `.cursor/mcp.json` is a real file with all four servers. Evidence: `python3` parse shows `sk-vision` plus the three shared servers.
- [x] `.claude/mcp.json` no longer registers `sk-vision`. Evidence: parse shows three servers only.
- [x] Devin/OpenCode/Pi unaffected. Evidence: Devin config unchanged; both in-process symlinks present.
- [x] Topology docs updated. Evidence: `SKILL.md`, `README.md`, `hooks/README.md` describe the Cursor-owned config.
- [ ] Changes committed on v4 (and main). Evidence: pending the commit.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Cursor's copy of the three shared servers drifts from `.claude/mcp.json` | Config divergence over time | Documented trade-off; the operator chose keeping all four for Cursor over losing servers |
| Risk | A generic client reading repo-root `.mcp.json` loses sk-vision | Intended — that scope mirrors Claude | Devin/Cursor have their own configs; in-process hosts are unaffected |
<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

### Answered Questions
- **Q**: Cursor shares Claude's config file — what should Cursor's own config contain? **A**: All four servers (keep everything Cursor has today), then drop sk-vision from Claude.

### Open Questions
- None.
<!-- /ANCHOR:questions -->
