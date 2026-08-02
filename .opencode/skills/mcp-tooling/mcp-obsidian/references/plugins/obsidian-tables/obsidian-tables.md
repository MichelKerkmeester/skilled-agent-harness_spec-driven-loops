---
title: "Tables Plugin Index"
description: "Lean entry point for operating the Tables Obsidian community plugin through its portable .table.md JSON data files."
trigger_phrases:
  - "tables obsidian plugin"
  - "obsidian tables file layer"
  - "tables table md"
  - "agentable obsidian table"
  - "tables plugin workflow"
importance_tier: "normal"
contextType: "implementation"
version: 1.0.0.0
---

# Tables Plugin Index

Tables is a file-backed Obsidian table plugin. Operate its `.table.md` data payload directly, then let Obsidian render the result.

---

## 1. OVERVIEW

| Identity field | Canonical value |
| --- | --- |
| Plugin ID | `tables` |
| Display name | **Tables** |
| Plugin repository | [`aztekgold/obsidian-tables`](https://github.com/aztekgold/obsidian-tables) |
| Schema upstream | [`aztekgold/agentable`](https://github.com/aztekgold/agentable) |

The Agentable repository is the upstream JSON-table standard used by the plugin's Agentable 1.0 model. It is not a renamed plugin, replacement repository, or alternative Obsidian plugin ID. ([manifest.json](https://github.com/aztekgold/obsidian-tables/blob/main/manifest.json), [types.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts), [Agentable](https://github.com/aztekgold/agentable))

Tables provides database-like rows, typed columns, formulas, named views, filters, sorts, embeds, and CSV interchange while persisting the whole table in one portable vault file. The `.table.md` file is Markdown with `json-table-plugin: true` frontmatter and one fenced `json-table` JSON object. ([plugin README](https://github.com/aztekgold/obsidian-tables), [MarkdownFileHandler.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/MarkdownFileHandler.ts))

### File-layer doctrine

- Read the complete file, then extract and parse the fenced JSON payload.
- Patch columns, views, and rows by stable IDs; row cells use column IDs, not headers.
- Preserve the Markdown wrapper and non-table body text; replace only the JSON payload.
- Parse the written payload again before asking Obsidian to reload it.

---

## 2. DEEP REFERENCES

- [Data model](obsidian-tables/data-model.md) — exact wrapper, Agentable root, columns, cell encodings, formulas, views, settings, migration, and a full copyable skeleton.
- [Workflows](obsidian-tables/workflows.md) — create, add/rename columns, add/edit rows, formulas, named views, CSV import, and sort recipes.
- [Troubleshooting](obsidian-tables/troubleshooting.md) — malformed file recovery, ID integrity, formula, select, migration, sort, and CSV failure paths.

---

## 3. STARTER ASSET

Copy [`example.table.md`](../../assets/plugins/obsidian-tables/example.table.md) for a valid ten-kind table with two views, a link-column frontmatter index, and an ID-based formula.

---

## 4. SOURCE BOUNDARY

The implementation details in the deep references are grounded in the Tables source repository, especially [type definitions](https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts), the [Markdown serializer](https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/MarkdownFileHandler.ts), [formula handler](https://github.com/aztekgold/obsidian-tables/blob/main/src/FormulaHandler.ts), [migration utility](https://github.com/aztekgold/obsidian-tables/blob/main/src/utils/migrateUtils.ts), and [sort handler](https://github.com/aztekgold/obsidian-tables/blob/main/src/SortHandler.ts).
