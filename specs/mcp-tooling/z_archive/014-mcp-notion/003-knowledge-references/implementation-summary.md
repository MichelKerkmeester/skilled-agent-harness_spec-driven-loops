---
title: "Implementation Summary: mcp-notion knowledge-layer references"
description: "The verified references/ knowledge layer for the mcp-notion mode — tool catalog, API-gap tools, property types, database data-model, and troubleshooting — plus the embedded notion-mcp server README."
trigger_phrases:
  - "implementation"
  - "summary"
  - "mcp-notion references"
  - "notion knowledge layer"
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
    key_files:
      - ".opencode/skills/mcp-tooling/mcp-notion/references/mcp-tools.md"
      - ".opencode/skills/mcp-tooling/mcp-notion/references/api-gap-tools.md"
      - ".opencode/skills/mcp-tooling/mcp-notion/references/property-types.md"
      - ".opencode/skills/mcp-tooling/mcp-notion/references/database-model.md"
      - ".opencode/skills/mcp-tooling/mcp-notion/references/troubleshooting.md"
      - ".opencode/skills/mcp-tooling/mcp-notion/mcp-servers/notion-mcp/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "014-003-knowledge-references"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The tool count is 24 (README table), not 22 (README prose); the two markdown tools were added later, documented with the caveat."
      - "verification is value-only/read-only (wiki), button has no API representation, place is the schema-only 22nd type."
      - "API versions are pinned: 2025-09-03 for the core surface, 2026-03-11 for the markdown/async surface."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-knowledge-references |
| **Completed** | 2026-08-21 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The `mcp-notion` mode now has the `references/` knowledge layer that turns it from a thin transport into a workflow mode. Five reference documents cover the tool surface, the direct-API escape hatches, the property model, the database data-model, and recovery. An embedded server README captures the config the mode runs against. Every claim is grounded in the 001 deep-research findings or a source verified against the official docs on 2026-08-21.

### Tool catalog (`references/mcp-tools.md`)

Documents the 24 tools grouped into 6 domains, plus the Code Mode invocation contract for calling them. The tool names are transcribed verbatim from the official `@notionhq/notion-mcp-server` README. The catalog records an honest count caveat: the README prose says "22 tools" but its table lists 24, because the two markdown tools (`retrieve-page-markdown` / `update-page-markdown`) were added later. It documents 24 with the caveat stated.

### API-gap tools (`references/api-gap-tools.md`)

Documents the direct Notion REST calls for the 5 operations the MCP server does not cover: file uploads (`POST /v1/file_uploads` plus send/complete), views, non-truncated page property items (`GET /v1/pages/{id}/properties/{prop}`), async tasks (`GET /v1/async_tasks/{id}`), and the daily-notes convention. Every endpoint is web-verified against developers.notion.com. The token is always read from `$notion_NOTION_TOKEN` and never hardcoded.

### Property types (`references/property-types.md`)

Documents the 22 schema property types with their schema/value/filter/sort semantics, and the reconciliation findings: `verification` is value-only/read-only (wiki), `button` has no API representation, and `place` is the schema-only 22nd type ("not fully supported"). It states the rule to strip the 8 computed types before any write.

### Database data-model (`references/database-model.md`)

Documents the database→data-source→page hierarchy and the API 2.0 `database_id`→`data_source_id` migration, relations (single and dual, with the "target must be shared" constraint), rollups (14 config functions, with a wider read-value vocabulary), and Formulas 2.0.

### Troubleshooting (`references/troubleshooting.md`)

Documents recovery for 401/403/404 auth, 429/529 backoff honoring `Retry-After`, API-version mismatch (2025-09-03 core vs 2026-03-11 markdown/async), data-source-vs-database confusion, and the local→remote deprecation-migration.

### Server README (`mcp-servers/notion-mcp/README.md`)

Documents the embedded server config: stdio transport, the `NOTION_TOKEN` environment variable, and the dual-backend note.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/mcp-tooling/mcp-notion/references/mcp-tools.md` | Created | 24-tool catalog (6 domains) + Code Mode invocation contract |
| `.opencode/skills/mcp-tooling/mcp-notion/references/api-gap-tools.md` | Created | Direct Notion REST calls for the 5 MCP gaps |
| `.opencode/skills/mcp-tooling/mcp-notion/references/property-types.md` | Created | 22 property types with schema/value/filter/sort semantics |
| `.opencode/skills/mcp-tooling/mcp-notion/references/database-model.md` | Created | data-source hierarchy, relations, 14 rollups, Formulas 2.0 |
| `.opencode/skills/mcp-tooling/mcp-notion/references/troubleshooting.md` | Created | Auth, rate-limit, API-version, deprecation-migration recovery |
| `.opencode/skills/mcp-tooling/mcp-notion/mcp-servers/notion-mcp/README.md` | Created | Embedded server config notes (stdio, NOTION_TOKEN, dual-backend) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The references were authored source-first: the verified surface came from the 001 deep-research findings, the tool names came verbatim from the official README fetched on 2026-08-21, and the gap endpoints and API-version pins were cross-checked against developers.notion.com the same day. Each reference was validated with `validate_document.py --type reference` and reported 0 issues; the server README was validated with `--type readme` and reported 0 issues.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Document 24 tools, not 22 | The README table lists 24; the "22" prose predates the two later-added markdown tools. The caveat is stated so the count is defensible. |
| Read the token from `$notion_NOTION_TOKEN` in the gap tools | The direct-API calls must never hardcode a secret; the environment variable keeps the token out of the docs and out of history. |
| Keep `verification`, `button`, and `place` as documented boundaries | `verification` is read-only (wiki), `button` has no API representation, and `place` is schema-only ("not fully supported") — stating these prevents invalid writes. |
| Pin both API versions | The core surface (2025-09-03) and the markdown/async surface (2026-03-11) differ; pinning both in troubleshooting prevents version-mismatch errors at call time. |
| Split direct-API gaps into their own reference | The 5 gaps are not MCP tools; separating them keeps the tool catalog honest about what the server actually exposes. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `mcp-tools.md` (`--type reference`) | PASS: 0 issues |
| `api-gap-tools.md` (`--type reference`) | PASS: 0 issues |
| `property-types.md` (`--type reference`) | PASS: 0 issues |
| `database-model.md` (`--type reference`) | PASS: 0 issues |
| `troubleshooting.md` (`--type reference`) | PASS: 0 issues |
| `notion-mcp/README.md` (`--type readme`) | PASS: 0 issues |
| Gap endpoints + API-version pins | PASS: web-verified against developers.notion.com (2026-08-21) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Live workspace validation is out of scope here.** The references document the verified surface; exercising the tools against a real Notion workspace with a token belongs to Phase 5 verification-and-closeout.
2. **API surface can drift.** Notion pins two API versions (2025-09-03 core, 2026-03-11 markdown/async); a future version bump would require re-verifying the affected endpoints.
3. **The `place` property type is schema-only.** Notion marks it "not fully supported," so its value/filter semantics are documented as a boundary rather than a full contract.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr-rules.md
-->
