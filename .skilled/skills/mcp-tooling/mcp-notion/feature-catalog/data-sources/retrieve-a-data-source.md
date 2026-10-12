---
title: "Retrieve a data source"
description: "Read a data source's property schema and definitions through the confirmed notion_retrieve-a-data-source tool."
trigger_phrases:
  - "Retrieve a data source"
  - "notion_retrieve-a-data-source"
  - "read a Notion data source's schema"
version: 0.1.0.0
---

# Retrieve a data source (`notion_retrieve-a-data-source`)

## 1. OVERVIEW

`notion_retrieve-a-data-source` reads one data source's `properties` schema and definitions by its `data_source_id` — the column names, types, and type-specific config (select options, relation targets, rollup functions, formula expressions) that every row in the data source must conform to. It is the schema read, not the row read; rows come from `query-data-source`.

The Code Mode callable form is `notion["notion_retrieve-a-data-source"]` — bracket access, since the tool name's hyphen is not a valid JavaScript dot-identifier. Confirm the exact callable and input schema with `list_tools()` / `tool_info()` before hardcoding a call; the manual is not yet runtime-registered in this environment, so the name below is source-confirmed only, not runtime-confirmed.

---

## 2. HOW IT WORKS

The operator needs the `notion` manual registered in `.utcp_config.json`, `NOTION_TOKEN` set in the Code Mode runtime, and the data source (or its parent database) shared with the integration in the Notion UI.

`notion_retrieve-a-data-source` calls `GET /v1/data_sources/{data_source_id}` under API version `2025-09-03`. The only required input is `data_source_id`; the response returns the data source's `title`, `parent`, and a `properties` map keyed by column name. This schema is load-bearing for every subsequent write or filter: the returned property shapes drive the correct payload for `update-page-properties`, `create-a-page`, and the `filter`/`sorts` in `query-data-source` — writing an undefined `select` option or a wrong-typed value against the schema fails.

Read this schema before writing rows, not after a failed write. A `restricted_resource` or 404-style error means the data source (or its parent database) was never shared with the integration; re-share it in the Notion UI and retry.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| [`../../SKILL.md`](../../SKILL.md) | Shared | Routes database/data-source ops to the Databases and data sources domain in the mode's operation table. |
| [`../../references/mcp-tools.md`](../../references/mcp-tools.md) | Shared | Confirms the tool name, endpoint, API-version pin, and key inputs (§5 Databases / Data Sources). |
| [`../../references/database-model.md`](../../references/database-model.md) | Shared | Documents the schema-first workflow and the property/relation/rollup config shapes this read returns. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| [`../../manual-testing-playbook/data-sources/retrieve-a-data-source.md`](../../manual-testing-playbook/data-sources/retrieve-a-data-source.md) | Manual playbook | Exercises a scratch data-source schema read as a scratch-safe scenario. |
| [`../../examples/README.md`](../../examples/README.md) | Reference | Documents the Code Mode invocation pattern and preflight before any Notion call. |

---

## 4. SOURCE METADATA

- Group: Databases and data sources
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `data-sources/retrieve-a-data-source.md`

Related references:
- [`retrieve-a-database.md`](retrieve-a-database.md) — discovers the container and its data-source ID list this tool reads from.
- [`update-a-data-source.md`](update-a-data-source.md) — mutates the same schema this tool reads.
