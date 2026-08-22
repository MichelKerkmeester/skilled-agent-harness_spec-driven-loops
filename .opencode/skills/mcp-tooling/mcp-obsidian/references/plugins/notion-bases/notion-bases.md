---
title: "Notion Bases Plugin File-Layer Index"
description: "Lean entry point for operating the Notion Bases community plugin (bgarciamoura/obsidian-notion-bases-plugin) at the file layer: two-way relations, rollups, lookups, subtasks and multi-view databases stored in _database.md schema files."
trigger_phrases:
  - "notion bases plugin"
  - "notion-bases plugin"
  - "obsidian-notion-bases-plugin"
  - "notion bases relation"
  - "notion bases rollup"
  - "notion bases lookup column"
  - "notion bases view"
  - "database.md schema"
importance_tier: "normal"
contextType: "implementation"
version: "0.1.0.0"
---

# Notion Bases Plugin File-Layer Index (`notion-bases`)

The `mcp-obsidian` mode operates the Notion Bases community plugin by **editing `_database.md` schema files and the frontmatter of each row note**. It never drives the plugin's table, board, gallery or chart UI. This is the plugin `mcp-obsidian` treats as required for post-Notion-migration relational parity.

## 1. OVERVIEW

| Identity field | Current value | Why it matters |
| --- | --- | --- |
| Plugin repository | [`bgarciamoura/obsidian-notion-bases-plugin`](https://github.com/bgarciamoura/obsidian-notion-bases-plugin) | Source of behavior facts |
| Display name | **Notion Bases** | Name shown in Community Plugins → Browse |
| Community store slug | `notion-bases` | Listing path `community.obsidian.md/plugins/notion-bases`; the on-disk manifest `id` under `.obsidian/plugins/<manifest.id>/` is a separate value — **VERIFY** it against the release `manifest.json` before assuming it equals this slug |
| Version pin | **v1.5.0+** | v1.3.0 added two-way relations; v1.5.0 added rollup columns, self-relation subtasks and chart views. A vault below v1.5.0 has relations but not rollups/subtasks/charts |
| Storage model | Every database row is its own `.md` file; every column is a frontmatter key; one `_database.md` per database folder holds the column schema and view definitions | The plugin persists nothing outside the vault's markdown — no separate database file |
| Coverage claim | Recovers over 90% of Notion's relational feature set (two-way relations, 7 rollup functions, Lookup columns, 3-level subtasks, 7 of Notion's 10 view types) | This is why the migration research ranks it P0-required, not optional |

Not yet installed in this repository's reference vault. Every schema example in this reference set is the documented, illustrative shape — exact `_database.md` key spelling is **VERIFY** against the installed plugin before writing a production schema file (see §4 Guardrails).

---

## 2. HOW IT WORKS

The plugin reads a `_database.md` file at the root of a database folder for that folder's schema: column names, column types (including `relation`, `rollup`, `lookup` and the self-relation subtask column), and one or more view definitions (table, board, list, calendar, gallery, timeline/gantt, chart). Every row in that database is a sibling `.md` file whose frontmatter carries one value per declared column.

A **relation** column is two-way as of v1.3.0+: writing a forward reference on one row and declaring the column's back-reference target keeps both sides in sync when the plugin runs, and the AI can prove reciprocity at the file layer by reading both notes' frontmatter directly. A **rollup** column (v1.5.0+, 7 functions) aggregates a property across every row reached through a relation column — the AI can compute the same aggregate by hand from the linked rows before the plugin ever opens the note. A **lookup** column pulls one property's literal value from a single related row. **Self-relation subtasks** (v1.5.0+) reuse the relation column type against the same database, nesting up to 3 levels, and resolve the same way a normal relation does: by following the wikilink chain.

Views live in the same `_database.md` file as named blocks with a `type` (one of the 7 supported types) and view-specific config such as `group_by` for board or a date field for calendar/timeline. The AI validates a view block structurally — valid type, referenced column exists — the same way it validates everything else here: from the files, not the render.

---

## 3. SOURCE FILES

| File | Use it for |
| --- | --- |
| [`data-model.md`](data-model.md) | The `_database.md` schema shape: relation, rollup (7 functions), lookup, self-relation subtasks (3 levels), and the 7 view types |
| [`workflows.md`](workflows.md) | Numbered file-layer recipes for writing/extending relation, rollup, lookup and view definitions, plus a Dataview-supplement section for aggregations the plugin doesn't cover |
| [`troubleshooting.md`](troubleshooting.md) | Failure modes and recovery: schema mismatch, missing back-reference, unsupported view type |

The general file-layer operating model (locate data, edit data, never drive the UI) lives in [`../plugin-operation-logic.md`](../plugin-operation-logic.md). Sibling plugin knowledge for read-only supplemental aggregation lives in [`../dataview/dataview.md`](../dataview/dataview.md) — this reference set never edits the Dataview files, it only points to them.

---

## 4. GUARDRAILS

- **Never invent exact `_database.md` key names.** Every schema example in `data-model.md` and `workflows.md` is the documented conceptual shape, flagged `VERIFY`. Re-check the installed plugin's own schema output (or its README) before writing a production file.
- **Respect the version pin.** Rollup, Lookup and subtask columns need v1.5.0+; a vault on v1.3.0–v1.4.x only has two-way relations. Confirm the installed version before promising a rollup or subtask recovery.
- **Respect the 7/10 view boundary.** Form, Map and Dashboard views have no Obsidian parity through this plugin or any other — document them as lost, never as a pending recipe.
- **Dataview is a supplement, never a replacement.** Use it only for the custom aggregations §5 of the migration research and `workflows.md` §7 describe; the plugin is the primary relational surface.
- **File-layer verification proves the write, not the render.** A reload inside a running Obsidian is required to see the table, board, gallery or chart output — that check belongs to the plugin-install phase, not this reference set.
- **No plugin install or live vault work happens from this reference set.** It documents the file shapes an already-installed plugin reads; installing the plugin and confirming its render is a separate, later step.
