---
title: "Implementation Plan: Decouple Cursor MCP config; drop sk-vision from Claude"
description: "Convert .cursor/mcp.json to a real file, remove sk-vision from .claude/mcp.json, and update the sk-vision topology docs."
trigger_phrases:
  - "sk-vision cursor mcp decoupling plan"
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
      - "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/020-cursor-mcp-decoupling/plan.md"
      - ".cursor/mcp.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-020-cursor-mcp-decoupling"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Decouple Cursor MCP config; drop sk-vision from Claude

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON config + Markdown docs |
| **Framework** | Per-runtime MCP configs (Claude, Cursor, Devin) + in-process adapters (OpenCode, Pi) |
| **Storage** | `.cursor/mcp.json`, `.claude/mcp.json`, sk-vision skill docs |
| **Testing** | `python3` JSON parse + server-key assertions per endpoint |

### Overview
Break the `.cursor/mcp.json → .mcp.json → .claude/mcp.json` symlink chain by making `.cursor/mcp.json` a real file (all four servers), then remove sk-vision from `.claude/mcp.json`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Topology understood. Evidence: inode check shows `.cursor/mcp.json` == `.claude/mcp.json`.
- [x] Cursor content decided. Evidence: operator chose all four servers.

### Definition of Done
- [x] Cursor decoupled + Claude stripped. Evidence: per-endpoint parse.
- [x] Docs updated. Evidence: `hooks/README.md`, `SKILL.md`, `README.md`.
- [ ] Committed on v4 (and main). Evidence: pending.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Per-runtime config ownership: each MCP-only host reads its own config file; in-process hosts load a plugin. sk-vision's presence is now decided per file rather than through a shared symlink.

### Key Components
- **`.cursor/mcp.json`** — real file, four servers incl. sk-vision.
- **`.claude/mcp.json`** — three servers, no sk-vision (repo-root `.mcp.json` mirrors it).
- **`.devin/mcp_config.json`** — unchanged, sk-vision only.

### Data Flow
cursor-agent → reads `.cursor/mcp.json` → launches `dist/mcp-server.js`. Claude Code → reads `.claude/mcp.json` → no sk-vision.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Config split (done)
- [x] Replace the `.cursor/mcp.json` symlink with a real four-server file; remove sk-vision from `.claude/mcp.json`. Evidence: per-endpoint parse.

### Phase 2: Docs (done)
- [x] Update the sk-vision topology docs to the Cursor-owned model. Evidence: three docs edited.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Config | server keys per endpoint | `python3` JSON parse |
| Validity | all edited files parse | `python3 json.load` |
| Regression | in-process hosts present | symlink existence check |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Cursor project-scope config support | External | Available | Cursor could not own a config |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Cursor fails to load its own config, or sk-vision must return to Claude.
- **Procedure**: Restore `.cursor/mcp.json` as a symlink to `../.mcp.json` and re-add the `sk-vision` entry to `.claude/mcp.json`. Both are single-file, git-tracked reversions.
<!-- /ANCHOR:rollback -->
