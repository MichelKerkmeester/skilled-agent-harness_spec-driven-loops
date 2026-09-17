---
title: "Query a data source"
description: "Filter and sort a data source's rows, paginated, through the confirmed notion_query-data-source tool."
trigger_phrases:
  - "Query a data source"
  - "notion_query-data-source"
  - "filter and sort rows in a Notion data source"
version: 0.1.0.0
---

# Query a data source (`notion_query-data-source`)

## 1. OVERVIEW

`notion_query-data-source` filters and sorts the rows (pages) of one data source, paginated. It is the row-level read counterpart to `retrieve-a-data-source`'s schema read, and the tool most agent workflows reach for when a user asks to "find", "list", or "filter" items in a Notion table.

The Code Mode callable form is `notion["notion_query-data-source"]` — bracket access, since the tool name's hyphen is not a valid JavaScript dot-identifier. Confirm the exact callable and input schema with `list_tools()` / `tool_info()` before hardcoding a call; the manual is not yet runtime-registered in this environment, so the name below is source-confirmed only, not runtime-confirmed.

---

## 2. HOW IT WORKS

The operator needs the `notion` manual registered in `.utcp_config.json`, `NOTION_TOKEN` set in the Code Mode runtime, and the data source shared with the integration in the Notion UI.

`notion_query-data-source` calls `POST /v1/data_sources/{data_source_id}/query` under API version `2025-09-03`. Inputs are `data_source_id`, an optional `filter` (per-property operators nested under `and` / `or`), optional `sorts`, and the pagination pair `start_cursor` / `page_size`. This is the API 2.0 breaking change this catalog's data model is built around: **the query targets a `data_source_id`, not a `database_id`** — passing a database ID here fails with a `validation_error`. Resolve the ID with `retrieve-a-database` first if only a database ID is on hand.

Results paginate via `has_more` / `next_cursor`, and `relation`, `people`, and `rich_text` values in a returned page may be truncated past ~25 items (use the direct-API page-property-item gap fill for a full read). **An empty `results` array (`[]`) is a valid outcome** — a genuinely empty or filtered-out data source, or an integration without access, never a signal to fabricate rows.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| [`../../SKILL.md`](../../SKILL.md) | Shared | Routes database/data-source ops to the Databases and data sources domain in the mode's operation table. |
| [`../../references/mcp-tools.md`](../../references/mcp-tools.md) | Shared | Confirms the tool name, endpoint, API-version pin, and key inputs (§5 Databases / Data Sources). |
| [`../../references/database-model.md`](../../references/database-model.md) | Shared | Documents the filter/sort shapes, pagination, and the data-source-not-database targeting rule. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| [`../../manual-testing-playbook/data-sources/query-data-source.md`](../../manual-testing-playbook/data-sources/query-data-source.md) | Manual playbook | Exercises a scratch data-source row query, including an empty-result case, as a scratch-safe scenario. |
| [`../../examples/README.md`](../../examples/README.md) | Reference | Documents the Code Mode invocation pattern, including the read-only data-source query example. |

---

## 4. SOURCE METADATA

- Group: Databases and data sources
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `data-sources/query-data-source.md`

Related references:
- [`retrieve-a-data-source.md`](retrieve-a-data-source.md) — reads the schema that shapes this tool's filter and sort inputs.
- [`list-data-source-templates.md`](list-data-source-templates.md) — a lighter-weight companion listing for the same data source.
