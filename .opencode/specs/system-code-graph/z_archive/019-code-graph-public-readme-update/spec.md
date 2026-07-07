---
title: "Public README Update"
description: "Update the repository-root README after packet 014 so first-time readers see system-code-graph as a first-class skill and understand the current standalone MCP topology without pre-empting the parallel 010 rename packet."
trigger_phrases:
  - "015 public readme update"
  - "public readme post 014 extraction"
  - "system code graph first class skill readme"
  - "standalone mcp topology readme"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/z_archive/019-code-graph-public-readme-update"
    last_updated_at: "2026-05-14T19:30:00Z"
    last_updated_by: "cli-codex-gpt5.5-xhigh-fast-015"
    recent_action: "Validated README update; git staging blocked"
    next_safe_action: "Stage from writable shell"
    blockers:
      - ".git/index.lock creation is EPERM in this sandbox"
    key_files:
      - "README.md"
      - ".opencode/skills/system-code-graph/SKILL.md"
      - "opencode.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-14-015-public-readme-update"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "Use current MCP server name `system_code_graph` and note that parallel packet 010 may supersede it with `mk-code-index`."
      - "Do not edit sub-skill READMEs, CLAUDE.md, AGENTS.md, packet 010, packet 012, or live MCP child processes."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Public README Update

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Blocked on Git Metadata |
| **Created** | 2026-05-14 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The repository-root `README.md` is the first document new readers see, but parts of it still describe code graph as memory-owned or omit the standalone MCP topology created by packet 014.

### Purpose

Refresh the public README as an accurate aggregation layer for current docs: first-class `system-code-graph` skill ownership, standalone MCP server names, key skill index entries, a short spec-kit workflow brief, quick-start commands, and recent shipped work references.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Update only the repository-root `README.md`.
- Create this Level 1 packet under the provided `015-public-readme-update` path.
- Reference current `system_code_graph`, `system_skill_advisor`, `spec_kit_memory`, `cocoindex_code`, `code_mode`, and `sequential_thinking` MCP topology.
- Mention packet 014 and recent 038/039 work as concise context, not a changelog dump.
- Run README sanity checks and strict spec validation.

### Out of Scope

- Editing sub-skill READMEs.
- Touching `CLAUDE.md`, `AGENTS.md`, packet 010, packet 012, or any spec folder outside this new 015 packet.
- Killing, restarting, or switching live MCP child processes.
- Switching away from `main`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `README.md` | Modify | Public root README aggregation update. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/029-public-readme-update/` | Create | Track scope, plan, tasks, verification, and metadata for this packet. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | README reflects first-class system-code-graph ownership | Root README links `.opencode/skills/system-code-graph/` and no longer says code graph is registered through the co-resident memory server. |
| REQ-002 | README names current standalone MCP topology | Root README includes `spec_kit_memory`, `system_skill_advisor`, `system_code_graph`, `cocoindex_code`, `code_mode`, and `sequential_thinking`. |
| REQ-003 | README does not pre-empt packet 010 rename | Root README uses current `system_code_graph` naming and mentions 010 may supersede it with `mk-code-index`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | README stays an aggregator | New content links existing docs or spec packets and does not invent behavior absent from the repo. |
| REQ-005 | sk-doc quality checks pass or have documented non-blocking limitations | README has clear structure, no placeholders, and no broken local markdown links in changed references. |
| REQ-006 | Packet validates strictly | `validate.sh --strict` exits 0 for the 015 packet. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: First-time readers can identify the current code graph skill path and MCP server name from the root README.
- **SC-002**: README quick-start and architecture sections describe the standalone MCP topology.
- **SC-003**: The recent-changes callout names 014 and 038/039 work without becoming a full changelog.
- **SC-004**: Only `README.md` and this 015 packet are staged for commit.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Parallel packet 010 rename | Current repo state may contain rename artifacts not yet authoritative for this packet. | Use current registered `system_code_graph` name and explicitly note 010 may supersede it. |
| Risk | Broken cross-reference | Public README can send users to missing docs. | Run a local markdown link existence check. |
| Risk | Dirty worktree | Accidental staging can pollute the commit. | Stage only `README.md` and the 015 packet folder. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None.
<!-- /ANCHOR:questions -->
