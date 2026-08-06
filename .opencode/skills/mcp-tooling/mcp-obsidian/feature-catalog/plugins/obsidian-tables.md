---
title: "Obsidian Tables file-layer operations"
description: "Create and edit portable .table.md JSON files for the Tables community plugin, then verify the rendered table."
trigger_phrases:
  - "Obsidian Tables file layer"
  - "create .table.md"
  - "edit table row by ID"
  - "formula column"
  - "Agentable table round-trip"
version: 0.1.0.0
---

# Obsidian Tables file-layer operations (`tables`)

## 1. OVERVIEW

The Obsidian Tables plugin has manifest ID `tables` and is maintained in `aztekgold/obsidian-tables`, with the Agentable repository defining the aligned JSON table model. Each table is a portable `.table.md` file: Markdown frontmatter marks the file for the plugin and one fenced `json-table` payload stores the table state.

The file layer can create a table, patch columns/rows/views/formulas, and preserve the wrapper and unrelated body text. Obsidian remains the renderer; a valid JSON payload is necessary but the final render must be checked after the note is opened or reloaded.

## 2. HOW IT WORKS

Read the complete file, confirm `json-table-plugin: true` and exactly one `json-table` fence, then parse the payload. Patch objects by stable `column.id`, `row.id`, and `view.id`; row cells use column IDs rather than visible headers. Preserve `table-links`, unknown root fields, and non-table Markdown, serialize only the JSON payload, and parse the written file again.

The canonical root keeps `version`, `metadata.title`, `columns`, `views`, and `rows`. Formula columns use ID-based references and cached result strings. After the file-layer edit passes its structural checks, open or reload the `.table.md` in Obsidian and confirm the table renders with the changed row or column instead of exposing raw JSON or an error view.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| [`../../SKILL.md`](../../SKILL.md) | Shared | Routes table-specific requests to only the Tables reference family. |
| [`../../references/plugins/plugin-operation-logic.md`](../../references/plugins/plugin-operation-logic.md) | Shared | Defines the file-layer-over-UI operating boundary. |
| [`../../references/plugins/obsidian-tables/data-model.md`](../../references/plugins/obsidian-tables/data-model.md) | Plugin | Defines the `.table.md` envelope, Agentable root, IDs, cells, formulas, and views. |
| [`../../references/plugins/obsidian-tables/workflows.md`](../../references/plugins/obsidian-tables/workflows.md) | Plugin | Defines create, row/column, formula, view, CSV, and sort edits. |
| [`../../references/plugins/obsidian-tables/troubleshooting.md`](../../references/plugins/obsidian-tables/troubleshooting.md) | Plugin | Defines wrapper, ID, formula, select, migration, sort, and CSV recovery. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| [`../../manual-testing-playbook/plugin-tie-ins/obsidian-tables-roundtrip.md`](../../manual-testing-playbook/plugin-tie-ins/obsidian-tables-roundtrip.md) | Manual playbook | Creates/edits a `.table.md` at the file layer and verifies the rendered result. |
| [`../../assets/plugins/obsidian-tables/sample.example.table.md`](../../assets/plugins/obsidian-tables/sample.example.table.md) | Fixture | Provides a valid Agentable 1.0 table fixture with rows, views, links, and a formula. |
| [`../../references/plugins/obsidian-tables/workflows.md`](../../references/plugins/obsidian-tables/workflows.md) | Reference | Defines readback and reload checks after each mutation. |

## 4. SOURCE METADATA

- Group: Plugins
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `plugins/obsidian-tables.md`

Related references:
- [`../../references/plugins/obsidian-tables/obsidian-tables.md`](../../references/plugins/obsidian-tables/obsidian-tables.md) — plugin identity and deep-reference index.
- [`../../assets/workflows.md`](../../assets/workflows.md) — shared cross-plugin file-layer workflow asset.
