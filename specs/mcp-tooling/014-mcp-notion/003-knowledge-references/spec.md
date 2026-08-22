---
title: "Phase 003: mcp-notion knowledge-layer references"
description: "Author the mcp-notion reference layer — mcp-tools.md (24-tool catalog), api-gap-tools.md (direct API for the 5 gap endpoints), property-types.md (22 property types), database-model.md (data-source hierarchy, relations, rollups, Formulas 2.0), troubleshooting.md — plus the embedded notion-mcp server README, from the 001 research findings."
trigger_phrases:
  - "mcp-notion references"
  - "notion knowledge layer"
  - "notion property types database model"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/014-mcp-notion/003-knowledge-references"
    last_updated_at: "2026-08-21T15:52:00Z"
    last_updated_by: "claude"
    recent_action: "Authored 5 references + notion-mcp server README; all validate 0 issues"
    next_safe_action: "Author the 5 references + mcp-servers/notion-mcp/README from research findings"
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
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Phase 003: mcp-notion knowledge-layer references

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
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-21 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 5 |
| **Predecessor** | 002-skill-authoring |
| **Successor** | 004-hub-registration-and-advisor |
| **Handoff Criteria** | Five `references/` files plus the embedded `notion-mcp/README.md` authored and validating: each reference passes `validate_document.py --type reference` with 0 issues, the server README passes `--type readme` with 0 issues, tool/property/gap counts match the 001 research findings, and all endpoints are web-verified against the official sources on 2026-08-21. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the `mcp-notion` mode build. Phase 2 authored the mode's routing contract (SKILL.md, README, INSTALL-GUIDE, examples). This phase adds the `references/` knowledge layer that gives the mode operational depth: the tool catalog, the direct-API escape hatches for MCP gaps, the property-type reference, the database data-model, and troubleshooting recovery — plus the embedded server config README.

**Scope Boundary**: Documentation authoring only, contained inside the mode's own package (`mcp-notion/references/**` and `mcp-notion/mcp-servers/notion-mcp/README.md`). This phase does NOT touch hub routing, the skill-advisor, `.utcp_config.json`, or repo docs — that is Phase 4. It documents CURRENT verified behavior, not roadmap.

**Dependencies**:
- The 001 deep-research findings (`../001-deep-research/research/research.md`) — the verified tool surface, the 5 MCP gaps, the property-type set, and the data-source hierarchy this layer documents.
- The official `@notionhq/notion-mcp-server` README (fetched 2026-08-21) — the verbatim source for the 24-tool catalog.
- The Notion developer docs at developers.notion.com (verified 2026-08-21) — the source for the direct-API gap endpoints and API-version pins.

**Deliverables**:
- `references/mcp-tools.md` — the 24-tool catalog across 6 domains + the Code Mode invocation contract.
- `references/api-gap-tools.md` — direct Notion REST calls for the 5 MCP gaps.
- `references/property-types.md` — the 22 schema property types with schema/value/filter/sort semantics.
- `references/database-model.md` — the database→data-source→page hierarchy, relations, rollups, Formulas 2.0.
- `references/troubleshooting.md` — auth, rate-limit, API-version, and deprecation-migration recovery.
- `mcp-servers/notion-mcp/README.md` — embedded server config notes.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After Phase 2 the `mcp-notion` mode has a routing contract but no knowledge layer, so it is a thin transport. There is no single catalog of the server's tools, no documented path for the operations the MCP server cannot do, no reference for Notion's property types or its database data-model, and no troubleshooting guide. Without this depth an operator cannot tell what the mode can do, cannot reach the 5 API gaps, and cannot recover from the common auth, rate-limit, and API-version failures.

### Purpose
Author the `references/` knowledge layer the 001 research verdict requires — the depth that makes `mcp-notion` a workflow mode rather than a thin transport — plus the embedded server config README, so Phase 4 can register a fully documented mode.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **Tool catalog** (`references/mcp-tools.md`): the 24 tools grouped into 6 domains, with the Code Mode invocation contract. Tool names transcribed VERBATIM from the official README (fetched 2026-08-21). The honest count caveat is documented: the README prose says "22 tools" but its table lists 24 — the two markdown tools (`retrieve-page-markdown` / `update-page-markdown`) were added later — so the catalog documents 24 with the caveat stated.
- **API-gap tools** (`references/api-gap-tools.md`): direct Notion REST calls for the 5 gaps the MCP server does not cover — file uploads (`POST /v1/file_uploads` plus send/complete), views, non-truncated page property items (`GET /v1/pages/{id}/properties/{prop}`), async tasks (`GET /v1/async_tasks/{id}`), and the daily-notes convention. Endpoints web-verified against developers.notion.com on 2026-08-21. The token is always read from `$notion_NOTION_TOKEN`, never hardcoded.
- **Property types** (`references/property-types.md`): the 22 schema property types with schema/value/filter/sort semantics, and the reconciliation findings: `verification` is value-only/read-only (wiki), `button` has no API representation, `place` is the schema-only 22nd type ("not fully supported"), and 8 computed types must be stripped before any write.
- **Database data-model** (`references/database-model.md`): the database→data-source→page hierarchy (the API 2.0 `database_id`→`data_source_id` migration), relations (single/dual plus the "target must be shared" constraint), rollups (14 config functions; the read-value vocabulary is wider), and Formulas 2.0.
- **Troubleshooting** (`references/troubleshooting.md`): 401/403/404 auth, 429/529 backoff honoring `Retry-After`, API-version mismatch (2025-09-03 core vs 2026-03-11 markdown/async), data-source-vs-database confusion, and local→remote deprecation-migration.
- **Server README** (`mcp-servers/notion-mcp/README.md`): embedded server config notes (stdio, `NOTION_TOKEN`, dual-backend).

### Out of Scope
- Hub registration, the skill-advisor, `.utcp_config.json`, and the repo README — all Phase 4.
- SKILL.md / package routing docs — authored in Phase 2.
- Any new runtime or tool code — this phase only documents the verified surface from the 001 research.
- Verification-and-closeout scenarios — Phase 5.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-tooling/mcp-notion/references/mcp-tools.md` | Create | 24-tool catalog (6 domains) + Code Mode invocation contract |
| `.opencode/skills/mcp-tooling/mcp-notion/references/api-gap-tools.md` | Create | Direct Notion REST calls for the 5 MCP gaps |
| `.opencode/skills/mcp-tooling/mcp-notion/references/property-types.md` | Create | 22 property types with schema/value/filter/sort semantics |
| `.opencode/skills/mcp-tooling/mcp-notion/references/database-model.md` | Create | data-source hierarchy, relations, rollups, Formulas 2.0 |
| `.opencode/skills/mcp-tooling/mcp-notion/references/troubleshooting.md` | Create | Auth, rate-limit, API-version, deprecation-migration recovery |
| `.opencode/skills/mcp-tooling/mcp-notion/mcp-servers/notion-mcp/README.md` | Create | Embedded server config notes (stdio, NOTION_TOKEN, dual-backend) |
| `.../003-knowledge-references/implementation-summary.md` | Modify | Filled on phase close |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Author `references/mcp-tools.md` — the 24-tool catalog across 6 domains with the Code Mode invocation contract | Tool names match the official README verbatim; the "22 vs 24" count caveat is documented; `validate_document.py --type reference` reports 0 issues |
| REQ-002 | Author `references/api-gap-tools.md` — direct Notion REST calls for the 5 MCP gaps | All 5 gaps covered; endpoints web-verified against developers.notion.com (2026-08-21); token read from `$notion_NOTION_TOKEN`, never hardcoded; validator reports 0 issues |
| REQ-003 | Author `references/property-types.md`, `references/database-model.md`, and `references/troubleshooting.md` | 22 property types, the data-source hierarchy/relations/rollups/Formulas 2.0, and the auth/rate-limit/API-version/migration recovery all documented; each validator reports 0 issues |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Author `mcp-servers/notion-mcp/README.md` — embedded server config notes | stdio, `NOTION_TOKEN`, and the dual-backend note documented; `validate_document.py --type readme` reports 0 issues |
| REQ-005 | Content documents CURRENT verified behavior sourced from the 001 research and the official docs | Every claim maps to a research finding or a web-verified source; reconciliation findings (verification/button/place, API-version pins) are stated, not inferred |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All five references pass `validate_document.py --type reference` with 0 issues, and the server README passes `--type readme` with 0 issues.
- **SC-002**: The tool catalog documents 24 tools with the "22 vs 24" README caveat stated; the property reference documents 22 types; the api-gap reference covers all 5 gaps.
- **SC-003**: API-version pins (2025-09-03 core, 2026-03-11 markdown/async) and gap endpoints are web-verified against the official sources on 2026-08-21, and the token is never hardcoded.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The 001 research findings + the official README/docs | Wrong tool set or counts if the source is misread | Transcribe tool names verbatim from the README; web-verify endpoints and version pins against developers.notion.com |
| Risk | The README prose count ("22") disagrees with its table ("24") | A miscount misrepresents the surface | Document 24 with the caveat stated, naming the two later-added markdown tools |
| Risk | Computed property types written back to the API | Write failures if computed types are not stripped | Document the 8 computed types and the strip-before-write rule explicitly |
| Risk | API-version drift between core and markdown/async surfaces | Version-mismatch errors at call time | Pin both versions (2025-09-03 core, 2026-03-11 markdown/async) in the troubleshooting reference |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None open. The tool count ("22 vs 24"), the read-only/no-API property types (`verification`, `button`, `place`), and the API-version pins were all resolved against the official README and developer docs on 2026-08-21 and documented with their caveats.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
