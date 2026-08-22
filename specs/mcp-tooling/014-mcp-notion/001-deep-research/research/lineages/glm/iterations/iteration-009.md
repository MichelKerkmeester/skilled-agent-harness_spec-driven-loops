# Iteration 9: API Version Pinning + 015 Migration Tie-in

## Focus
Document the Notion API version landscape (2022-06-28, 2025-09-03, 2026-03-11), which tools require which version, how the mode should pin versions, and how the 015 Notion→Obsidian migration spec relates to mcp-notion.

## Findings

### F9.1 — API version landscape: three active versions with breaking changes

The Notion API uses date-based versioning via the `Notion-Version` header. Three versions are relevant:

| Version | Release | Key changes | Breaking? |
|---|---|---|---|
| `2022-06-28` | Jun 2022 | Introduced `single_property`/`dual_property` relation types; page properties must use retrieve-page-property endpoint; parents always direct | Yes (from prior) |
| `2025-09-03` | Sep 2025 | **Major**: databases → data sources hierarchy; `database_id` → `data_source_id` for most operations; new `/v1/data_sources` endpoints; multi-source databases | **Yes — major migration** |
| `2026-03-11` | Mar 2026 | `after` parameter → `position` object (block insertion); `archived` field → `in_trash`; `transcription` block type → `meeting_notes` | Yes |

[SOURCE: https://developers.notion.com/reference/changes-by-version] [SOURCE: https://developers.notion.com/guides/get-started/upgrade-guide-2025-09-03] [SOURCE: https://developers.notion.com/guides/get-started/upgrade-guide-2026-03-11]

### F9.2 — Version requirements by MCP tool

The official MCP server (v2.5.1) uses two API versions:

| Tool category | API version | Notes |
|---|---|---|
| Most tools (pages, blocks, data sources, comments, users, search) | `2025-09-03` | Data sources migration; `database_id` → `data_source_id` |
| Markdown tools (`retrieve-page-markdown`, `update-page-markdown`) | `2026-03-11` | Newer API for enhanced markdown round-trip |
| Async page markdown writes | `2026-03-11` | `allow_async: true` returns `async_task` handle with `status_url` and `poll_after_seconds` |

**The mode must pin the API version per operation**, not globally. The MCP server handles this internally, but direct API calls (for the 5 tooling gaps) must set the correct `Notion-Version` header per endpoint.

### F9.3 — Version pinning doctrine for the mode

The mode's reference docs must encode:

1. **Default version**: `2025-09-03` for most operations (matches MCP server default)
2. **Markdown operations**: `2026-03-11` required for `retrieve-page-markdown` and `update-page-markdown`
3. **Direct API calls**: set `Notion-Version` header explicitly per endpoint
4. **Breaking change awareness**: `archived` → `in_trash` (2026-03-11), `after` → `position` (2026-03-11), `database_id` → `data_source_id` (2025-09-03)
5. **Version negotiation**: the MCP server handles version internally; direct API calls must match
6. **Future-proofing**: the mode should document the version landscape so agents understand what changed and why

### F9.4 — The 015 migration spec: Notion→Obsidian, not Obsidian→Notion

The 015 spec (`specs/mcp-tooling/015-notion-to-obisidian-migration/`) is a **research packet** documenting how to migrate complex Notion workspaces to Obsidian. Key findings from 015:

- **Importer choice**: Obsidian's official Importer has a Notion API mode (recommended) that converts databases to Bases; HTML .zip mode loses databases entirely
- **Bases** (Obsidian core since v1.9) is the native Notion-database replacement — but has no two-way relations or rollups out of the box
- **Plugin recovery**: Notion Bases community plugin adds relations/rollups/extra views; Dataview is the no-extra-plugin alternative
- **AI agent's role**: file-layer work around the in-app importer — pre-flight inventory, post-import relation reconstruction, authoring .base files, CSV-to-notes explosion, programmatic verification
- **Relationship to 014**: the 015 spec says "Informs, but does not depend on, `014-mcp-notion`"

[SOURCE: specs/mcp-tooling/015-notion-to-obisidian-migration/spec.md] [SOURCE: specs/mcp-tooling/015-notion-to-obisidian-migration/research.md]

### F9.5 — How mcp-notion relates to the 015 migration

The 015 migration is **Notion→Obsidian** (reading from Notion, writing to Obsidian). mcp-notion is the **Notion operation mode** (reading and writing Notion). The relationship is:

**mcp-notion as a migration enabler (read side)**:
- The 015 migration's "pre-flight inventory" step requires enumerating every database, relation, rollup, and formula in the Notion workspace
- mcp-notion's `retrieve-a-database` + `retrieve-a-data-source` + `query-data-source` tools can automate this inventory
- mcp-notion's knowledge layer (22 property types, relation/rollup/formula model) helps the agent understand what it's reading and what needs reconstruction in Obsidian
- The 015 spec mentions "via the Notion API or the export tree" for inventory — mcp-notion is the API path

**mcp-notion is NOT the migration executor**:
- The actual import is done by Obsidian's in-app Importer (human-driven)
- The post-import reconstruction is Obsidian file-layer work (mcp-obsidian's domain)
- mcp-notion's role is limited to the read-side inventory and understanding the source structure

**The knowledge layer is shared**:
- mcp-notion encodes the Notion data model (databases, data sources, 22 property types, relations, rollups, formulas)
- The 015 migration needs this same knowledge to understand what's being migrated and what needs reconstruction
- The mode's `references/property-types.md` and `references/database-model.md` serve both operational use and migration inventory

### F9.6 — Async markdown writes: a new capability (2026-03-11)

The changelog reveals a capability not fully captured in earlier iterations:

- `allow_async: true` on `POST /v1/pages` (with `markdown` body) and `PATCH /v1/pages/:page_id/markdown`
- Returns an `async_task` handle with `status_url` and `poll_after_seconds`
- Poll until task succeeds or fails
- MCP server supports this via `notion-create-pages` and `notion-update-page` with `allow_async: true`, plus `notion-get-async-task` polling tool

This means the MCP server **does** have an async task tool (`notion-get-async-task`) on the remote server — but the open-source local server may not. This is another differentiator between the two backends.

[SOURCE: https://developers.notion.com/page/changelog]

### F9.7 — Mode's version-related reference doc structure

The mode should encode version knowledge in two places:

1. **`references/troubleshooting.md`** — version-related errors (e.g., "archived field not found" → upgrade to 2026-03-11; "database_id not working" → use data_source_id with 2025-09-03)
2. **`references/mcp-tools.md`** — per-tool API version annotation (which tools use which version)
3. **`INSTALL-GUIDE.md`** — version pinning in the Code Mode config (`OPENAPI_MCP_VERSION` env var)

## Sources Consulted
- https://developers.notion.com/reference/changes-by-version (version changelog)
- https://developers.notion.com/guides/get-started/upgrade-guide-2025-09-03 (data sources migration)
- https://developers.notion.com/guides/get-started/upgrade-guide-2026-03-11 (block positioning, in_trash, meeting_notes)
- https://developers.notion.com/page/changelog (async markdown writes, MCP async task tool)
- specs/mcp-tooling/015-notion-to-obisidian-migration/spec.md (migration spec)
- specs/mcp-tooling/015-notion-to-obisidian-migration/research.md (migration findings)

## Assessment
- **newInfoRatio: 0.65** — The version landscape, breaking changes, and 015 migration relationship are net-new. The async markdown writes capability is newly discovered. Some overlap with iteration 1's version mention and iteration 2's endpoint enumeration.
- **Novelty justification**: Per-tool version mapping, version pinning doctrine, 015 migration tie-in analysis, and async task tool discovery are all net-new.
- **Confidence**: High — sourced from official Notion changelog and upgrade guides, plus the checked-in 015 spec.

## Reflection
- **What worked**: Official changelog and upgrade guides gave authoritative version data. The 015 spec was already in the repo, providing the migration context.
- **What failed**: Nothing significant.
- **Ruled out**: Nothing new. The 015 migration is Notion→Obsidian, not the reverse — mcp-notion's role is read-side inventory only, not migration execution.

## Recommended Next Focus
Iteration 10: Final gap analysis + verdict consolidation. Consolidate all findings across 9 iterations into a final gap matrix, confirm the BUILD verdict with the complete evidence base, and prepare for synthesis.
