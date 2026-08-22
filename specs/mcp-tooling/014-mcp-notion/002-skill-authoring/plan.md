---
title: "Implementation Plan: Phase 002 — mcp-notion skill package authoring"
description: "Author the mcp-notion SKILL.md MCP-only smart router plus README, INSTALL-GUIDE, changelog, and advisor identity from the mcp-click-up light-workflow-mode shape, grounded in the 001 research verdict, with tool names reconciled to the confirmed hyphenated official set."
trigger_phrases:
  - "mcp-notion skill plan"
  - "mcp-notion SKILL.md plan"
  - "notion mode package plan"
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
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 002: mcp-notion skill package authoring

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown authoring (SKILL.md, README, INSTALL-GUIDE, changelog) + one advisor JSON — no runtime code |
| **Framework** | `mcp-click-up` light-workflow-mode shape (MCP-only); content from the 001 research verdict |
| **Storage** | None (docs + one metadata JSON) |
| **Testing** | `validate_document.py --type skill` (0 issues target) |

### Overview
Author the `mcp-notion` core package by mirroring the `mcp-click-up` light-workflow-mode shape and filling it with the 001 research architecture: a SKILL.md whose smart router classifies a Notion request into 6 intents, picks a backend via `resolve_notion_backend()`, routes to one of 24 tools or one of 5 direct-API gap endpoints, and enforces the markdown + data-source contract and the agent-safety invariants. Tool names are reconciled to the confirmed hyphenated official set through hyphen-safe bracket callables with a standing VERIFY caveat. README, INSTALL-GUIDE, changelog, and the advisor `graph-metadata.json` round out the package.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] 001 research verdict read (dual-backend decision, 5 tooling gaps, API 2.0 data-source model)
- [x] `mcp-click-up` SKILL.md read as the light-workflow-mode structural mirror
- [x] Confirmed official tool names (hyphenated) and the Code Mode hyphen-sanitization caveat

### Definition of Done
- [x] SKILL.md authored: 8 sections, 6 intents, `resolve_notion_backend()`, 24-tool table, 5 gap routes, markdown + data-source contract, ALWAYS/NEVER/ESCALATE
- [x] Tool names reconciled via hyphen-safe bracket callables + `list_tools()`/`tool_info()` VERIFY caveat
- [x] README + INSTALL-GUIDE + `changelog/v0.1.0.0.md` + `graph-metadata.json` authored
- [x] `validate_document.py --type skill` = 0 issues; version 0.1.0.0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
MCP-only light workflow mode. A smart router (6 intents → backend selection → tool-or-gap route) mirroring `mcp-click-up` §2, over the official `@notionhq/notion-mcp-server` (24 tools) plus 5 direct-API calls for the gaps.

### Key Components
- **SKILL.md smart router**: 6 intents (`NOTION_PAGES`, `NOTION_DATA`, `NOTION_API_GAP`, `NOTION_KNOWLEDGE`, `INSTALL`, `TROUBLESHOOT`) classify the request.
- **`resolve_notion_backend()`**: `LOCAL_STDIO` (Code Mode / headless via `NOTION_TOKEN`) vs `REMOTE_MCP` (interactive OAuth).
- **24-tool operation-to-tool table + 5 direct-API gap routes**: the concrete routing surface.
- **MARKDOWN + DATA-SOURCE CONTRACT**: blocks vs properties; `database_id` vs `data_source_id` under API 2.0.
- **Agent-safety invariants**: ALWAYS/NEVER/ESCALATE (token from `notion_NOTION_TOKEN`, no auto-edit of shared config, data-source targeting, API-version pinning).

### Data Flow
Agent request → SKILL.md §1 activation → router classifies into 1 of 6 intents → `resolve_notion_backend()` picks stdio vs OAuth → operation routes to a hyphen-safe bracket callable over the 24-tool surface, or to one of the 5 direct-API gap endpoints → contract + safety rules constrain the call.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable — this phase authors mode-local documentation plus one advisor identity JSON inside `mcp-notion/`. It touches no shipped runtime, no shared config (`.utcp_config.json` / `.env` registration is Phase 4), no shared policy, and no hub routing. Hub registration and advisor wiring are Phase 4 (`004-hub-registration-and-advisor`).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the 001 research verdict (`../001-deep-research/research/research.md`) for the dual-backend decision, the 5 gaps, and the data-source model
- [x] Read `mcp-click-up` SKILL.md as the light-workflow-mode structural mirror
- [x] Confirm the official hyphenated tool names and the Code Mode hyphen-sanitization caveat

### Phase 2: Core Implementation
- [x] Author SKILL.md: 8 sections, 6 intents, `resolve_notion_backend()`, 24-tool table, 5 direct-API gap routes, markdown + data-source contract, ALWAYS/NEVER/ESCALATE
- [x] Reconcile tool names to hyphen-safe bracket callables + `list_tools()`/`tool_info()` VERIFY caveat
- [x] Author README.md + INSTALL-GUIDE.md + `changelog/v0.1.0.0.md` + `graph-metadata.json`

### Phase 3: Verification
- [x] Run `validate_document.py --type skill` on the package docs — 0 issues
- [x] Confirm no CLI claims; confirm every hyphenated name is reached via a bracket callable
- [x] Refresh `implementation-summary.md` + continuity
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structure | SKILL.md 8 sections, README, INSTALL-GUIDE | `validate_document.py --type skill` |
| Router logic | 6 intents, dual-backend, 24-tool table, 5 gap routes match the 001 architecture | Manual read against `research.md` |
| Tool names | Hyphenated names reached via bracket callables; VERIFY caveat present; no dot-access | `rg` on SKILL.md |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 001 research verdict | Internal | Green | Router has no source architecture |
| `mcp-click-up` SKILL.md | Internal | Green | Structural drift from house style |
| Confirmed hyphenated tool names | Internal | Green | Callables silently break on dot-access |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: router incoherent, or tool names cannot be made to resolve.
- **Procedure**: the authored docs are additive and mode-local — delete `SKILL.md`, `README.md`, `INSTALL-GUIDE.md`, `changelog/v0.1.0.0.md`, and `graph-metadata.json` under `mcp-notion/`. No shared runtime or other mode is affected (hub registration has not happened yet).
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
