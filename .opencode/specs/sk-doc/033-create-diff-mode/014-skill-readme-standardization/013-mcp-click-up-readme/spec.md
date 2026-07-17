---
title: "Feature Specification: mcp-click-up README"
description: "Rewrite the mcp-click-up skill README in the narrative voice, leading with the dual-path ClickUp orchestrator (cupt CLI and official MCP) and fixing the broken MCP integration facts."
trigger_phrases:
  - "mcp-click-up readme"
  - "mcp-click-up narrative rewrite"
importance_tier: "normal"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "sk-doc/014-skill-readme-standardization/013-mcp-click-up-readme"
    last_updated_at: "2026-06-07T12:50:50Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Shipped mcp-click-up README via deep-context + dual-draft"
    next_safe_action: "Begin phase 014 (mcp-code-mode README)"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-click-up/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "readme-std-135-013"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Fixed the README's wrong MCP integration: clickup.clickup_ naming (not clickup_official), array call_tool_chain, opencode.json/clickup key (not .utcp_config.json); dropped version line, Version History and contested counts"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: mcp-click-up README

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-07 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 13 of 24 |
| **Predecessor** | 012-mcp-chrome-devtools-readme |
| **Successor** | 014-mcp-code-mode-readme |
| **Handoff Criteria** | README passes validate_document.py --type readme and HVR; paths verified; MCP facts corrected |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 13**, the second skill in Batch C (mcp-*).

**Scope Boundary**: Only `.opencode/skills/mcp-click-up/README.md`. No SKILL.md or behavior change.

**Dependencies**: The narrative template (phase 001) and the deep-context gather in this folder's `context/`.

**Deliverables**: A rewritten `mcp-click-up/README.md` in the narrative voice with corrected MCP integration facts.

**Changelog**: Refresh the matching ../changelog/ file when this phase closes.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The mcp-click-up README is a tabular reference card with a Version History section and no problem-first entry point. Worse, its MCP integration instructions are wrong: it tells the reader to register the server in `.utcp_config.json` with the key `clickup_official` and to call tools as `clickup_official.clickup_official_{tool}` through a `call_tool_chain({ code })` form, while every authoritative file (SKILL.md, INSTALL_GUIDE, install.sh, mcp_tools.md) uses the platform MCP config with server key `clickup`, the `clickup.clickup_{tool}` naming and the array `call_tool_chain([{ tool, input }])` form. It also undercounts the operation table and miscounts the test playbook.

### Purpose

Rewrite the README in the narrative voice, grounded in a two-iteration deep-context gather and a dual-model draft, leading with the dual-path ClickUp orchestrator (cupt CLI for daily ops with a dry-run safety net, official MCP for documents and bulk) and the agent safety invariants, while correcting every wrong MCP integration fact and dropping the version and contested counts.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Rewrite `mcp-click-up/README.md` to the narrative skeleton; lead with the two paths and fix the MCP integration facts.

### Out of Scope

- Any change to SKILL.md, INSTALL_GUIDE.md or the skill's behavior. Documentation only. (The `mcp-servers/clickup-mcp/README.md` `clickup_official` key is noted for a later reconciliation packet.)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-click-up/README.md` | Modify | Narrative-voice rewrite with corrected MCP integration facts |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | README follows the narrative template | Sections match the template skeleton, no table of contents, no Version History |
| REQ-002 | README passes structure validation | `validate_document.py --type readme` reports zero issues |
| REQ-003 | MCP integration facts corrected | Uses `clickup.clickup_{tool}` naming, array `call_tool_chain`, `opencode.json` with key `clickup`; no `clickup_official` or `.utcp_config.json` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | README is HVR-clean in prose | No prose em dashes, semicolons, Oxford-comma lists or banned words (code-block syntax exempt) |
| REQ-005 | Drift dropped | No version line, no Version History, no contested counts; every cited path resolves |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `validate_document.py --type readme` passes with zero issues.
- **SC-002**: The MCP integration facts match SKILL.md and the references, every cited path resolves, and no wrong-form fact (`clickup_official`, `.utcp_config.json`, `{ code }` call) appears.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Model draft copies the README's wrong MCP facts | A README that perpetuates broken instructions | Authoring prompt forbade each wrong form; host scanned the draft and confirmed zero `clickup_official` / `.utcp_config` / `{ code }` leaks |
| Risk | Model pins a drift-prone count (46 tools, 16 operations) | Inaccurate over time | Host softened the one count the draft pinned; template drops the rest |
| Dependency | deep-context gather in `context/` | Grounds the draft | Two-iteration sweep with cited file evidence; both models found the same wrong MCP facts |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None for the README. The `mcp-servers/clickup-mcp/README.md` server-key drift (`clickup_official`) is real but out of scope here; note it for a later reconciliation packet.
<!-- /ANCHOR:questions -->
