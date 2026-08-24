---
title: "mcp-obsidian Shared File-Layer Workflows"
description: "Shared cross-plugin workflow index for editing the plain files that Obsidian plugins render, covering table and BRAT workflows."
trigger_phrases:
  - "obsidian file-layer workflow"
  - "plugin data over ui"
  - "obsidian tables workflow"
  - "brat plugin workflow"
importance_tier: "normal"
contextType: "implementation"
version: 0.1.0.0
---

# mcp-obsidian Shared File-Layer Workflows

This asset gives plugin-specific data edits a shared operating sequence. Each plugin section points to its canonical deep reference and keeps UI actions outside the file-layer contract.

---

## 1. OVERVIEW

The mode operates vault files through its CLI and MCP surfaces. A plugin's UI renders or transforms data already stored in the vault, so an agent should identify the plugin's source file, preserve its schema, make the smallest reversible mutation, validate the data, and tell the operator when a reload is needed for rendering. ([plugin operation logic](../references/plugins/plugin-operation-logic.md))

### Shared sequence

1. Identify the exact vault and source-of-truth file.
2. Read the current file and any plugin settings or include/index references.
3. Snapshot before a destructive or bulk mutation.
4. Apply one schema-valid file-layer edit.
5. Run the plugin/domain validator and a focused readback.
6. Reopen or reload the Obsidian view only after the file-layer checks pass.

---

## 2. OBSIDIAN-TABLES — TABLES

Tables is the `tables` Obsidian plugin at `aztekgold/obsidian-tables`. It persists one table in one `.table.md` file: Markdown frontmatter with `json-table-plugin: true` plus a fenced `json-table` Agentable 1.0 payload. Agentable is the upstream schema standard, not a replacement plugin identity. ([Tables manifest](https://github.com/aztekgold/obsidian-tables/blob/main/manifest.json), [Tables types](https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts), [Agentable](https://github.com/aztekgold/agentable))

### File-layer dispatch

| Goal | Canonical data | Validate |
|---|---|---|
| Create table | New `.table.md` wrapper and canonical root JSON | Frontmatter marker, one `json-table` fence, JSON parse, root arrays, unique IDs |
| Add or rename a column | `columns[]`; every row's `cells[column.id]` | Stable column ID retained for a rename; values match the new column definition |
| Add or edit a row | `rows[]` object selected by `row.id` | Cell keys resolve to existing column IDs; type-specific cell storage is valid |
| Add a formula | Formula column `constraints.formula` plus cached row result strings | ID references resolve; source and cached output agree before downstream use |
| Add a named view | `views[]` object with sorts, filters, hidden columns, and column order | View/filter/sort IDs and column references resolve |
| Import CSV | New `.table.md` or `.table.json` table | Imported columns/cells remain text strings until an explicit type-conversion pass |

### Canonical procedure

```text
read complete file → validate frontmatter/fence → parse JSON → map stable IDs → patch one object →
preserve wrapper/body → rebuild table-links after link changes → reparse/readback → reload table view
```

Rows use `cells[column.id]`, so headers can be renamed without moving data. Current source stores Multi-select as `type: "select"` with `constraints.multiSelect: true` and a comma-separated cell string; Formula source uses stable column IDs and cached computed strings persist in formula cells. ([migrateUtils.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/utils/migrateUtils.ts), [FormulaHandler.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/FormulaHandler.ts), [MultiSelectRenderer.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/MultiSelectRenderer.ts))

### Current caveats

- A saved view can contain several sort rules, but current `SortHandler` executes only the first one.
- Embed aliases are view names; an alias for a missing view creates and persists that view.
- Directly opened CSV files are in-memory views; normal table saves do not write edits back to CSV.
- Legacy files canonicalize on save, so patch by stable IDs only after normalizing the payload.

### Deep references and starter file

- [`obsidian-tables/data-model.md`](../references/plugins/obsidian-tables/data-model.md) — exact schema, canonical identity, all ten user-facing kinds, formulas, views, settings, migration, and a copyable skeleton.
- [`obsidian-tables/workflows.md`](../references/plugins/obsidian-tables/workflows.md) — detailed create, column, row, formula, view, CSV, and sort recipes.
- [`obsidian-tables/troubleshooting.md`](../references/plugins/obsidian-tables/troubleshooting.md) — malformed wrappers, IDs, formulas, constrained selects, legacy saves, sort limits, and CSV recovery.
- [`plugins/obsidian-tables/example.table.md`](plugins/obsidian-tables/example.table.md) — valid complete table asset.

---

## 3. OBSIDIAN42-BRAT — FILE-LAYER INSTALLATION AND UPDATE

BRAT (`obsidian42-brat`) is the installer and updater for beta/community plugins staged from GitHub releases in this mode. It selects a GitHub release, stages exact plugin assets, registers the repository in its own `data.json`, and can activate the manifest ID through `.obsidian/community-plugins.json`.

Keep the three file-layer stages separate:

1. **Stage** `main.js`, `manifest.json`, and optional `styles.css` from an exact GitHub release into `.obsidian/plugins/<manifest.id>/`.
2. **Register** the repository path in `.obsidian/plugins/obsidian42-brat/data.json` under `pluginList`, with the moving or frozen policy in `pluginSubListFrozenVersion`.
3. **Activate** the manifest ID, not the repository path, in `.obsidian/community-plugins.json`, then reload Obsidian.

| Plugin | BRAT repository path | Manifest ID | Target directory |
|---|---|---|---|
| Obsidian Tables | `aztekgold/obsidian-tables` | `tables` | `.obsidian/plugins/tables/` |

For a moving release, use `version: "latest"`; for a frozen install, use the exact GitHub release tag. BRAT update-all skips a policy record with a truthy version other than `latest`. Registration removal removes the repository from `pluginList` and its policy record; it does not delete staged plugin files unless that separate operation is requested.

Use the deep references for exact file operations and recovery: [`BRAT data model`](../references/plugins/obsidian42-brat/data-model.md), [`BRAT workflows`](../references/plugins/obsidian42-brat/workflows.md), [`BRAT troubleshooting`](../references/plugins/obsidian42-brat/troubleshooting.md), and the valid [`BRAT data entry example`](brat-data-entry.example.json).

---

## 4. RELATED RESOURCES

- [`../references/plugins/plugin-operation-logic.md`](../references/plugins/plugin-operation-logic.md) — shared data-over-UI principle.
- [`../references/plugins/obsidian-tables/obsidian-tables.md`](../references/plugins/obsidian-tables/obsidian-tables.md) — existing sibling reference.
- [`../references/plugins/obsidian42-brat/obsidian42-brat.md`](../references/plugins/obsidian42-brat/obsidian42-brat.md) — existing sibling reference.
