---
title: "Tasks: Phase 003 — mcp-notion knowledge-layer references"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "mcp-notion references tasks"
  - "notion knowledge layer tasks"
  - "mcp-notion phase 3 tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/014-mcp-notion/003-knowledge-references"
    last_updated_at: "2026-08-21T15:52:00Z"
    last_updated_by: "claude"
    recent_action: "Authored 5 references + notion-mcp server README; all validate 0 issues"
    next_safe_action: "Proceed to Phase 004 hub registration + advisor"
    blockers: []
    key_files: ["../001-deep-research/research/research.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "014-003-knowledge-references"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 003 — mcp-notion knowledge-layer references

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

- [x] T001 Read the 001 deep-research findings for the tool surface, the 5 gaps, the property set, and the data-source hierarchy (`../001-deep-research/research/research.md`) [Evidence: research findings read; surface and counts extracted]
- [x] T002 Fetch the official `@notionhq/notion-mcp-server` README (2026-08-21) for the verbatim tool names [Evidence: README fetched; 24-tool table transcribed, "22" prose caveat noted]
- [x] T003 [P] Identify the gap endpoints and API-version pins on developers.notion.com for web verification [Evidence: `GET /v1/async_tasks/{id}` and the file-upload/property-item endpoints plus the 2025-09-03 / 2026-03-11 API-version pins web-verified]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Author the 24-tool catalog across 6 domains with the Code Mode invocation contract and the "22 vs 24" README count caveat (`.opencode/skills/mcp-tooling/mcp-notion/references/mcp-tools.md`) [Evidence: `validate_document.py --type reference` = 0 issues; tool names verbatim]
- [x] T005 Author the direct-API gap tools for the 5 MCP gaps with endpoints and the `$notion_NOTION_TOKEN` rule (`.opencode/skills/mcp-tooling/mcp-notion/references/api-gap-tools.md`) [Evidence: 5 gaps covered; endpoints web-verified; validator = 0 issues; token never hardcoded]
- [x] T006 Author the 22 property types with schema/value/filter/sort semantics and the read-only/no-API/strip-computed findings (`.opencode/skills/mcp-tooling/mcp-notion/references/property-types.md`) [Evidence: 22 types; verification/button/place findings documented; validator = 0 issues]
- [x] T007 Author the database data-model — data-source hierarchy, relations, 14 rollups, Formulas 2.0 (`.opencode/skills/mcp-tooling/mcp-notion/references/database-model.md`) [Evidence: hierarchy + relations + rollups documented; validator = 0 issues]
- [x] T008 Author the troubleshooting recovery guide — auth, backoff, API-version, data-source confusion, deprecation-migration (`.opencode/skills/mcp-tooling/mcp-notion/references/troubleshooting.md`) [Evidence: recovery paths documented; validator = 0 issues]
- [x] T009 Author the embedded server README — stdio, `NOTION_TOKEN`, dual-backend (`.opencode/skills/mcp-tooling/mcp-notion/mcp-servers/notion-mcp/README.md`) [Evidence: `validate_document.py --type readme` = 0 issues]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run `validate_document.py --type reference` on all five references and `--type readme` on the server README; all pass with 0 issues [Evidence: 5 references + 1 README, 0 issues each]
- [x] T011 Web-verify the gap endpoints and the API-version pins against developers.notion.com (2026-08-21); confirm the token is never hardcoded [Evidence: endpoints and 2025-09-03 / 2026-03-11 pins confirmed; token read from `$notion_NOTION_TOKEN`]
- [x] T012 Run `validate.sh` on this phase; refresh `implementation-summary.md` + continuity [Evidence: phase validates; summary + continuity refreshed]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] All five references validate (`--type reference` = 0 issues) and the server README validates (`--type readme` = 0 issues)
- [x] Tool count caveat, read-only/no-API property types, and API-version pins documented against their web-verified sources
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Next phase**: `../004-hub-registration-and-advisor/`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
