---
title: "Tasks: Phase 002 — mcp-notion skill package authoring"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "mcp-notion skill tasks"
  - "mcp-notion SKILL.md tasks"
  - "notion mode package tasks"
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
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 002: mcp-notion skill package authoring

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the 001 research verdict (`../001-deep-research/research/research.md`) for the dual-backend decision, the 5 tooling gaps, and the API 2.0 data-source model
- [x] T002 [P] Read `mcp-click-up` SKILL.md as the light-workflow-mode structural mirror
- [x] T003 Confirm the official hyphenated Notion tool names and the Code Mode hyphen-sanitization caveat
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Author `SKILL.md` (`.opencode/skills/mcp-tooling/mcp-notion/SKILL.md`): 8 sections — MCP-only Smart Router with 6 intents (`NOTION_PAGES`, `NOTION_DATA`, `NOTION_API_GAP`, `NOTION_KNOWLEDGE`, `INSTALL`, `TROUBLESHOOT`); `resolve_notion_backend()` (`LOCAL_STDIO` via `NOTION_TOKEN` vs `REMOTE_MCP` OAuth); 24-tool operation-to-tool routing table; 5 direct-API gap routes; MARKDOWN + DATA-SOURCE CONTRACT; ALWAYS/NEVER/ESCALATE agent-safety rules
- [x] T005 Reconcile tool names to the confirmed hyphenated official set via hyphen-safe bracket callables (`notion["notion_create-a-page"]`) with a standing `list_tools()`/`tool_info()` VERIFY caveat (Code Mode may sanitize hyphens to underscores)
- [x] T006 Author `README.md` (overview + at-a-glance + quick start) and `INSTALL-GUIDE.md` (`NOTION_TOKEN` setup, Code Mode registration, dual-backend config)
- [x] T007 Author `changelog/v0.1.0.0.md` and `graph-metadata.json` (advisor mode identity)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run `validate_document.py --type skill` on the package docs — 0 issues
- [x] T009 Confirm no CLI claims (Notion is MCP + direct-API only) and every hyphenated name is reached via a bracket callable
- [x] T010 Refresh `implementation-summary.md` + continuity
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] SKILL.md router matches the 001 architecture (6 intents, dual-backend, 24-tool table, 5 gap routes)
- [x] `validate_document.py --type skill` = 0 issues; version 0.1.0.0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Predecessor**: `../001-deep-research/`
- **Next phase**: `../003-knowledge-references/`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
