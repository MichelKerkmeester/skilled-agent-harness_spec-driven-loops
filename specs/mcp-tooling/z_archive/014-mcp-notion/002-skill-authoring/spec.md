---
title: "Phase 002: mcp-notion skill package authoring"
description: "Author the mcp-notion mode's core package — SKILL.md (MCP-only smart router + dual-backend selection + invariants), README.md, INSTALL-GUIDE.md, changelog, and the graph-metadata advisor identity — mirroring the mcp-click-up light-workflow-mode pattern with content from the 001 research verdict."
trigger_phrases:
  - "mcp-notion skill authoring"
  - "mcp-notion SKILL.md"
  - "notion mode package"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/014-mcp-notion/002-skill-authoring"
    last_updated_at: "2026-08-21T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "SKILL.md authored; tool names reconciled to hyphen-safe callables; validator 0 issues"
    next_safe_action: "Author SKILL.md mirroring mcp-click-up, then README + INSTALL-GUIDE"
    blockers: []
    key_files: ["../001-deep-research/research/research.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "014-002-skill-authoring"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Phase 002: mcp-notion skill package authoring

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
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-21 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 5 |
| **Predecessor** | 001-deep-research |
| **Successor** | 003-knowledge-references |
| **Handoff Criteria** | `.opencode/skills/mcp-tooling/mcp-notion/SKILL.md` authored to the mcp-click-up light-workflow-mode shape (8 sections): MCP-only Smart Router (6 intents), `resolve_notion_backend()` decision, 24-tool operation-to-tool routing table, 5 direct-API gap routes, MARKDOWN + DATA-SOURCE CONTRACT, and ALWAYS/NEVER/ESCALATE agent-safety rules; tool names reconciled to the confirmed hyphenated official set via hyphen-safe bracket callables with a `list_tools()`/`tool_info()` VERIFY caveat; `validate_document.py --type skill` = 0 issues; version 0.1.0.0. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the `mcp-notion` mode build. It authors the mode's **routing contract** — the SKILL.md an agent reads to decide how to reach Notion — from the verdict the 001 deep-research phase produced. Because the official `@notionhq/notion-mcp-server` (24 tools) already covers all CRUD, this mode is an **MCP-only light workflow mode** modeled on `mcp-click-up`, not a CLI-plus-MCP dual-surface mode like `mcp-obsidian`.

**Scope Boundary**: Author the mode-local core package under `mcp-notion/` using the mcp-click-up shape. This phase does not build the knowledge references (Phase 3), does not register the mode in the hub or advisor (Phase 4), and does not run live-API verification or closeout (Phase 5).

**Dependencies**:
- Phase 1 research verdict (`../001-deep-research/research/research.md`) — the source for the dual-backend decision, the 5 tooling gaps, and the API 2.0 data-source model.
- `mcp-click-up`'s SKILL.md as the structural mirror (light workflow mode, MCP-only).

**Deliverables**:
- `SKILL.md` — the 8-section MCP-only router (6 intents, backend selection, 24-tool table, 5 gap routes, markdown + data-source contract, agent-safety rules).
- `README.md`, `INSTALL-GUIDE.md`, `changelog/v0.1.0.0.md`, and the `graph-metadata.json` advisor identity.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After Phase 1, the research verdict exists but nothing tells an agent *how* to reach Notion: which backend to use (headless stdio vs interactive OAuth), which of the 24 tools serves which operation, where the 5 direct-API gaps are, or how the API 2.0 data-source model differs from a plain database id. A naive author would also get the tool names wrong: the official Notion tool names are **hyphenated** (`create-a-page`, `query-data-source`, …), so dot-access callables silently break.

### Purpose
Author the `mcp-notion` core package — a SKILL.md smart router plus README, INSTALL-GUIDE, changelog, and advisor identity — so an agent can classify a Notion request, pick the right backend, route to the right tool (or the right direct-API call for a gap), and respect the markdown/data-source contract and the agent-safety invariants, with tool names that actually resolve.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `SKILL.md` mirroring the `mcp-click-up` light-workflow-mode shape (8 sections):
  - an **MCP-only Smart Router** with 6 intents: `NOTION_PAGES`, `NOTION_DATA`, `NOTION_API_GAP`, `NOTION_KNOWLEDGE`, `INSTALL`, `TROUBLESHOOT`;
  - a `resolve_notion_backend()` decision — `LOCAL_STDIO` (Code Mode / headless via `NOTION_TOKEN`) vs `REMOTE_MCP` (interactive OAuth);
  - a **24-tool operation-to-tool routing table**;
  - **5 direct-API gap routes** for operations the MCP surface does not cover;
  - a **MARKDOWN + DATA-SOURCE CONTRACT** (blocks vs properties; `database_id` vs `data_source_id` in API 2.0);
  - **ALWAYS / NEVER / ESCALATE** agent-safety rules.
- Tool-naming reconciliation to the confirmed **hyphenated** official names using hyphen-safe **bracket callables** plus a standing `list_tools()`/`tool_info()` VERIFY caveat.
- `README.md`, `INSTALL-GUIDE.md`, `changelog/v0.1.0.0.md`, and `graph-metadata.json`.

### Out of Scope
- Knowledge references (`references/`) — Phase 3.
- Hub registration (mode-registry / hub-router / advisor / leaf-manifest / smart-routing) — Phase 4.
- Live-API round-trip verification and closeout — Phase 5.
- Any CLI surface — Notion is MCP + direct-API only; no headless Notion CLI exists.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-tooling/mcp-notion/SKILL.md` | Create | MCP-only smart router (8 sections, 6 intents, dual-backend, 24-tool table, 5 gap routes, contracts, invariants) |
| `.opencode/skills/mcp-tooling/mcp-notion/README.md` | Create | Overview + at-a-glance + quick start |
| `.opencode/skills/mcp-tooling/mcp-notion/INSTALL-GUIDE.md` | Create | `NOTION_TOKEN` setup, Code Mode registration, dual-backend config |
| `.opencode/skills/mcp-tooling/mcp-notion/changelog/v0.1.0.0.md` | Create | Initial-version changelog |
| `.opencode/skills/mcp-tooling/mcp-notion/graph-metadata.json` | Create | Advisor mode identity |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Author `SKILL.md` as an MCP-only smart router mirroring `mcp-click-up` (8 sections) with the 6 intents, `resolve_notion_backend()`, the 24-tool routing table, the 5 direct-API gap routes, the markdown + data-source contract, and ALWAYS/NEVER/ESCALATE rules | SKILL.md present; router classifies by the 6 intents; backend decision and 24-tool table present; 5 gap routes present; contract + safety rules present; no CLI claims |
| REQ-002 | Reconcile tool names to the confirmed hyphenated official set using hyphen-safe bracket callables plus a standing VERIFY caveat | SKILL.md uses `notion["notion_create-a-page"]`-style bracket callables (never dot-access on hyphenated names); a `list_tools()`/`tool_info()` VERIFY caveat is stated (Code Mode may sanitize hyphens to underscores) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Author `README.md`, `INSTALL-GUIDE.md`, `changelog/v0.1.0.0.md`, and `graph-metadata.json` for the mode | All four package files present; INSTALL-GUIDE covers `NOTION_TOKEN` + Code Mode registration + dual-backend config; changelog versioned `v0.1.0.0` |
| REQ-004 | Verify the package docs pass the skill-document validator | `validate_document.py --type skill` = 0 issues on the authored docs; version 0.1.0.0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `validate_document.py --type skill` reports 0 issues on `SKILL.md`, `README.md`, and `INSTALL-GUIDE.md`.
- **SC-002**: The router matches the 001 research architecture — dual-backend selection and the 5 direct-API gap endpoints.
- **SC-003**: No CLI claims anywhere (Notion is MCP + direct-API only), and every hyphenated tool name is reached through a hyphen-safe bracket callable with the VERIFY caveat present.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Dot-access on a hyphenated tool name (`notion.create-a-page`) silently fails | High | Use hyphen-safe bracket callables `notion["notion_create-a-page"]`; state a `list_tools()`/`tool_info()` VERIFY caveat because Code Mode may sanitize hyphens to underscores |
| Risk | Confusing `database_id` with `data_source_id` under API 2.0 | Med | The MARKDOWN + DATA-SOURCE CONTRACT names both explicitly; target data-source ids for queries |
| Risk | Hardcoding the token, or auto-editing shared config | Med | ALWAYS/NEVER rules: never hardcode the token (read from `notion_NOTION_TOKEN`); never auto-modify `.utcp_config.json` / `.env`; pin API versions `2025-09-03` / `2026-03-11` |
| Dependency | Phase 1 research verdict (`../001-deep-research/research/research.md`) | The router has no source architecture | Author from the research verdict (dual-backend, 5 gaps, data-source model) |
| Dependency | `mcp-click-up` SKILL.md | Structural drift from the light-workflow-mode house style | Mirror the mcp-click-up 8-section shape |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The dual-backend decision, the 5 tooling gaps, and the data-source model were settled by the 001 research verdict; the hyphenated tool-name reconciliation was confirmed against the official server and applied.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
