---
title: "Update a data source"
description: "Edit a data source's title, description, or property schema through the confirmed notion_update-a-data-source tool."
trigger_phrases:
  - "Update a data source"
  - "notion_update-a-data-source"
  - "add or change a column on a Notion data source"
version: 0.1.0.0
---

# Update a data source (`notion_update-a-data-source`)

## 1. OVERVIEW

`notion_update-a-data-source` edits a data source's `title`, `description`, or `properties` schema — adding, renaming, retyping, or removing columns. It is a schema mutation, not a row mutation: row values are written with `update-page-properties`, not this tool.

The Code Mode callable form is `notion["notion_update-a-data-source"]` — bracket access, since the tool name's hyphen is not a valid JavaScript dot-identifier. Confirm the exact callable and input schema with `list_tools()` / `tool_info()` before hardcoding a call; the manual is not yet runtime-registered in this environment, so the name below is source-confirmed only, not runtime-confirmed.

---

## 2. HOW IT WORKS

The operator needs the `notion` manual registered in `.utcp_config.json`, `NOTION_TOKEN` set in the Code Mode runtime, and the data source shared with the integration in the Notion UI with update capability granted.

`notion_update-a-data-source` calls `PATCH /v1/data_sources/{data_source_id}` under API version `2025-09-03`. Inputs are `data_source_id` plus any of `title`, `description`, and `properties` (the schema config for changed columns) — only supplied fields change. **Schema edits apply to every existing row immediately**: retyping a column, removing a `select` option in use, or deleting a relation a rollup depends on affects live data the moment the call succeeds, not on next read.

Read the current schema with `retrieve-a-data-source` before editing it, since property configs (relation targets, rollup function names, formula expressions) are validated on save — an invalid expression or a relation pointing at a data source not shared with the integration is rejected, not silently stored.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| [`../../SKILL.md`](../../SKILL.md) | Shared | Routes database/data-source ops to the Databases and data sources domain in the mode's operation table. |
| [`../../references/mcp-tools.md`](../../references/mcp-tools.md) | Shared | Confirms the tool name, endpoint, API-version pin, and key inputs (§5 Databases / Data Sources). |
| [`../../references/database-model.md`](../../references/database-model.md) | Shared | Documents the property/relation/rollup/formula config shapes this tool writes, and the cross-property dependency rules. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| [`../../manual-testing-playbook/data-sources/update-a-data-source.md`](../../manual-testing-playbook/data-sources/update-a-data-source.md) | Manual playbook | Exercises a scratch data-source schema edit as a scratch-safe scenario. |
| [`../../examples/README.md`](../../examples/README.md) | Reference | Documents the Code Mode invocation pattern and preflight before any Notion call. |

---

## 4. SOURCE METADATA

- Group: Databases and data sources
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `data-sources/update-a-data-source.md`

Related references:
- [`create-a-data-source.md`](create-a-data-source.md) — defines the initial schema this tool later edits.
- [`retrieve-a-data-source.md`](retrieve-a-data-source.md) — read-only counterpart used to confirm the current schema before editing.
