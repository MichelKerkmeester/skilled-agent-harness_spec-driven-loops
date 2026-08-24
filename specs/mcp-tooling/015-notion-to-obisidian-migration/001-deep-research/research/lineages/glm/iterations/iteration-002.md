# Iteration 2: mcp-notion Read Surface Mapping (24 MCP tools + 5 API gaps → inventory)

## Focus

Map the exact `mcp-notion` read surface to the migration **inventory** phase. For each Notion artifact that must be enumerated before import, name the tool that reads it (MCP vs direct API gap), and document the read limits that shape the inventory strategy.

## Findings

### F2.1 — The 24-tool MCP read surface, by domain

| Domain | MCP tools (read-relevant) | Reads | [SOURCE] |
|---|---|---|---|
| Pages (7) | `retrieve-a-page`, `retrieve-page-markdown`, `archive-a-page` (read-side: retrieve) | Page metadata + properties; page body as markdown (API `2026-03-11`) | mcp-notion/SKILL.md §3, references/mcp-tools.md |
| Blocks (5) | `retrieve-block-children`, `retrieve-a-block` | Page content tree (blocks); recursive children | mcp-notion/SKILL.md §3 |
| Data sources (6) | `retrieve-a-database`, `retrieve-a-data-source`, `query-data-source` | Database container → data-source IDs; data-source schema; rows with filters/sorts | mcp-notion/references/database-model.md §4 |
| Comments (2) | comment tools (list) | Page/discussion comments | mcp-notion/SKILL.md §3 |
| Users (3) | user tools (list, retrieve, bot) | Workspace users + bot identity | mcp-notion/SKILL.md §3 |
| Search (1) | `search` | **Title-only** search across pages/databases | mcp-notion/SKILL.md §3 |

### F2.2 — The 5 API gaps that complete the inventory read surface

| Gap | Direct API endpoint | Inventory use | [SOURCE] |
|---|---|---|---|
| File uploads | `GET /v1/file_uploads`, `GET /v1/file_uploads/{id}` | Enumerate uploaded files/attachments and their status | mcp-notion/references/api-gap-tools.md §3 |
| Views | `GET /v1/databases/{database_id}/views`, `GET /v1/views/{view_id}` | **Enumerate every saved view** per database (table/board/calendar/timeline/gallery/form/chart/map/dashboard) — the importer only carries the default table view, so the full view set must be inventoried here for reconstruction | mcp-notion/references/api-gap-tools.md §4 |
| Page property items | `GET /v1/pages/{page_id}/properties/{property_id}` | Read **non-truncated** relation/people/rich_text values past the 25-reference truncation limit — essential for inventorying wide relations | mcp-notion/references/api-gap-tools.md §5 |
| Async tasks | `GET /v1/async_tasks/{task_id}` | Poll long-running duplication/export tasks (local backend only) | mcp-notion/references/api-gap-tools.md §6 |
| Daily notes | (convention, no endpoint) | Query a "Daily Notes" data source filtered on date | mcp-notion/references/api-gap-tools.md §7 |

### F2.3 — Read limits that shape the inventory strategy

1. **Truncation at 25 references.** `retrieve-a-page` truncates large `relation`, `people`, and `rich_text` values at 25 items. For a complex workspace, inventorying the true width of relations requires the page-property-item gap endpoint with `start_cursor` pagination. [SOURCE: mcp-notion/references/database-model.md §8, api-gap-tools.md §5]
2. **Title-only search.** `search` matches titles only — no full-text content search. To find pages by content, retrieve candidates and inspect client-side. Inventory must therefore start from the database/page tree (via `retrieve-a-database` + `query-data-source`), not from content search. [SOURCE: mcp-notion/SKILL.md §3, NEVER #6]
3. **Data-source vs database keying.** API 2.0 made `data_source_id` the primary key for schema, queries, relations, and rollups. Inventory must call `retrieve-a-database` to get the data-source ID list, then operate per data source. Using a `database_id` where a `data_source_id` is required is the most common 400. [SOURCE: mcp-notion/references/database-model.md §3]
4. **Rate limit ~3 req/s.** Batch reads, space requests ~333 ms, honor `Retry-After` on 429. Large-workspace inventory is time-budgeted. [SOURCE: mcp-notion/references/api-gap-tools.md §8]
5. **Relation target must be shared.** Reading/writing a relation property fails if the target data source is not shared with the integration. Inventory must verify sharing for every relation target. [SOURCE: mcp-notion/references/database-model.md §5]
6. **Read-only computed properties.** `formula`, `rollup`, `created_time`, `created_by`, `last_edited_time`, `last_edited_by`, `unique_id`, `verification` cannot be set on write — but they ARE readable for inventory. Their definitions (formula expression, rollup relation+function) are in the data-source schema from `retrieve-a-data-source`. [SOURCE: mcp-notion/references/database-model.md §8]

### F2.4 — The inventory read procedure (mcp-notion side)

A complete inventory of a complex Notion workspace, using only mcp-notion reads:

1. `search` (title) or operator-provided root → enumerate top-level pages/databases.
2. For each database: `retrieve-a-database` → data-source IDs; `retrieve-a-data-source` → full schema (every property type, relation config, rollup config, formula expression, select options).
3. For each data source: `query-data-source` (paginated) → all rows; for each row with wide relations/people/text, `GET /v1/pages/{id}/properties/{prop}` (gap) → non-truncated values.
4. For each database: `GET /v1/databases/{database_id}/views` (gap) → every saved view (type, filters, sorts, config) — the set the importer will drop.
5. For each page: `retrieve-page-markdown` (body) + `retrieve-block-children` (block tree, recursive); `GET /v1/file_uploads` (gap) → attachment inventory.
6. Comments: MCP comment-list tools → discussion comments per page (the gap the importer drops).
7. Users: MCP user-list → people-property resolution.

This produces the **must-preserve / rebuild / retire ledger** the prior findings called for, with the schema-level detail needed to drive reconstruction. [SOURCE: prior-findings.md §4, §5]

## Sources Consulted

- [SOURCE: .opencode/skills/mcp-tooling/mcp-notion/SKILL.md] — 24-tool catalog, operation-to-tool routing, backend selection
- [SOURCE: .opencode/skills/mcp-tooling/mcp-notion/references/database-model.md] — data-source hierarchy, relations, rollups, truncation gap, read-only properties
- [SOURCE: .opencode/skills/mcp-tooling/mcp-notion/references/api-gap-tools.md] — 5 API gaps (files, views, property items, async, daily notes), rate/version doctrine
- [SOURCE: prior-findings.md §4, §5] — inventory ledger + AI agent file-layer role

## Assessment

- **newInfoRatio: 0.68** — The mcp-notion surface was documented in the skill but not yet mapped to the migration inventory step; this iteration produces the operation→tool→artifact mapping and surfaces the views gap endpoint as the inventory source for secondary-view reconstruction.
- **Novelty justification:** First mapping of the 24+5 read surface to a concrete inventory procedure, including the non-obvious point that views must be inventoried via the API gap (not the MCP) because the importer drops them.
- **Confidence:** High — grounded in the skill's own reference docs.

## Reflection

- **What worked:** The skill's operation-to-tool routing table and database-model/api-gap references gave a near-complete read map.
- **What failed:** Nothing — the surface is well-documented.
- **Ruled out:** Relying on `search` for content-based inventory (title-only); using `database_id` where `data_source_id` is required.

## Recommended Next Focus

**Iteration 3:** Q3 — Map the mcp-obsidian write surface (notesmd-cli headless, cyanheads MCP app-backed, plugin file-layer) to the reconstruction phase: which surface writes each Obsidian artifact (notes, frontmatter, folders, `.base` files, Dataview queries, tags), and the headless-vs-app-backed decision that shapes unattended migration.
