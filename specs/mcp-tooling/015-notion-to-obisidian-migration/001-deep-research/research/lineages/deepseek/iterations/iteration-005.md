# Iteration 5: Notion API 2.0 Data-Source Model — Impact on Inventory Strategy

## Focus
How the Notion API 2.0 data-source model (2025-09-03 breaking change) changes the inventory strategy, and what the agent must know to navigate database → data-source migration correctly.

## Findings

### F5.1 — Database vs Data Source: What Changed

| Aspect | Legacy model (pre-2025-09-03) | 2.0 model (2025-09-03+) | Impact on inventory |
|---|---|---|---|
| Primary ID | `database_id` | `data_source_id` | Must resolve data source from database container |
| Query endpoint | `POST /v1/databases/{id}/query` (deprecated) | `POST /v1/data_sources/{id}/query` | Using old ID format fails with 400 validation error |
| Property schema | Attached to database | Attached to each data source within a database | A single database may have multiple data sources |
| Relations/rollups | Defined on database | Defined per data source, cross-data-source | Must enumerate all data sources within each database |
| Views | `GET /v1/databases/{id}/views` | `GET /v1/databases/{id}/views` (still uses database id) | View list still uses database id — but view config references data source |
| Create a data source | `POST /v1/databases` | `POST /v1/data_sources` under a database | New entities are data sources, not databases |

[SOURCE: mcp-notion SKILL.md §1 — "database vs data source" contract warning]
[SOURCE: mcp-notion/references/mcp-tools.md §5 — retrieve-a-database returns data_source_ids]

### F5.2 — Inventory Flow Must Resolve the Database → Data Source Bridge

The inventory flow for data-rich workspaces must:

```
For each database in the workspace:
  1. mcp-notion: retrieve-a-database(database_id)
     → returns { data_source_ids: ["ds_1", "ds_2", ...] }
  2. For each data_source_id:
     a. mcp-notion: retrieve-a-data-source(data_source_id)
        → returns property schema, relation configs, rollup configs
     b. mcp-notion: query-data-source(data_source_id)
        → returns ALL rows (with pagination)
     c. Record: data source schema + row count + relation targets + rollup formulas
  3. mcp-notion direct API: GET /v1/databases/{id}/views
     → returns all saved views (filters, sorts, configs)
  4. For each view, if second-primary or non-table:
     → flag as "requires reconstruction in Obsidian"
```

**Critical**: The MCP's `search` tool returns pages and data sources, but NOT database containers. Finding all databases requires:
1. Search the root workspace by traversing pages
2. For each page that is a database, get its `data_source_ids`
3. Query each data source independently

[SOURCE: mcp-notion/references/mcp-tools.md §5 — tool inventory]
[SOURCE: mcp-notion/references/api-gap-tools.md §4 — views endpoint]

### F5.3 — Rate Limit Impact on Inventory

For a workspace with N databases each having M data sources:

| Step | Calls per item | Total calls | Rate limit budget (at 3 req/s) |
|---|---|---|---|
| Search (find all parent pages) | 1 (+ pagination) | ~10 (large workspace) | ~3 sec |
| Retrieve-a-database | 1 per DB | N | N/3 sec |
| Retrieve-a-data-source | 1 per DS | N × M | (N×M)/3 sec |
| Query-data-source | 1 per DS | N × M | (N×M)/3 sec |
| List views (direct API) | 1 per DB | N | N/3 sec |
| Comments per page | 1 per page | P (pages) | P/3 sec |
| **Total (10 DBs × 3 DS, 500 pages)** |    | **~600 calls** | **~200 sec = ~3.3 min** |

For very large workspaces (50+ databases, thousands of pages), the inventory phase at 3 req/s would take ~15-30 minutes of uninterrupted polling. Mitigation: batch reads in background, cache data source schemas, skip low-priority databases.

[SOURCE: mcp-notion/references/api-gap-tools.md §8 — rate limit = ~3 req/s, 429 handling]
[SOURCE: mcp-notion SKILL.md §4, rule 6 — handle rate limit with backoff and jitter]

### F5.4 — The `retrieve-a-page` Truncation Trap

During inventory, `retrieve-a-page` returns properties but truncates relation/people/rich_text at 25 items. For databases with broad relations (e.g., "Related Projects" with 50+ linked pages), the agent must:

1. Call `retrieve-a-page` → get truncated relation IDs (first 25)
2. For each truncated relation property: call direct API `GET /v1/pages/{page_id}/properties/{property_id}` with pagination
3. Reassemble the complete relation list

This adds significant latency for relation-heavy workspaces — budget for it in the inventory phase.

[SOURCE: mcp-notion/references/api-gap-tools.md §5 — page property items endpoint]

### F5.5 — Practical Mitigation: Scoped Inventory by Priority

Rather than full inventory of every database, the phased approach from prior-findings should be:

1. **Quick inventory** (unpaged): query-data-source each identified data source with `page_size=1` → get count + schema only, not rows
2. **Schema inventory**: retrieve-a-data-source → get property defs, relations config
3. **Row inventory** (paginated): only for databases flagged "must-preserve" in step 1-2
4. **View inventory**: direct API list views → only for databases flagged as having secondary views

[SOURCE: prior-findings.md §4 — Migration Process: Inventory]
[SOURCE: mcp-notion/references/mcp-tools.md §5 — query-data-source with pagination]

## Sources Consulted
- mcp-notion SKILL.md §1 — data-source model warning
- mcp-notion/references/mcp-tools.md §5, §7
- mcp-notion/references/api-gap-tools.md §4, §5, §8
- https://developers.notion.com/reference (API 2.0 migration)
- prior-findings.md §4 — migration process

## Assessment
- newInfoRatio: 0.9
- noveltyJustification: "Rate-limit budget analysis, data-source bridge flow, and truncation mitigation are all new — prior-findings never analyzed the API 2.0 model"
- Confidence: High — all from skill references + Notion API reference

## Reflection
- What worked: The call-count budget calculation exposes the real-time cost of inventory — essential for migration planning
- What failed: Cannot test the data-source resolution chain without a live Notion token/workspace
- Ruled out: Skipping the data-source resolution step (using old database IDs directly) — will produce 400 errors

## Recommended Next Focus
KQ-8: Nested page hierarchy — what the importer preserves, what becomes flat, and how to reconstruct nesting in Obsidian