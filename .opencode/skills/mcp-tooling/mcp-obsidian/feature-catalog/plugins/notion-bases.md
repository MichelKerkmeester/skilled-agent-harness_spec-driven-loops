---
title: "Notion Bases plugin file-layer relations, rollups and views"
description: "Author and validate Notion Bases community-plugin _database.md schemas at the file layer: two-way relation columns, the 7 rollup functions, lookup columns, self-relation subtasks and the 7 supported view types."
trigger_phrases:
  - "notion bases plugin"
  - "notion bases relation"
  - "notion bases rollup"
  - "notion bases lookup"
  - "notion bases subtasks"
  - "notion bases view"
version: "0.1.0.0"
---

# Notion Bases plugin file-layer relations, rollups and views (`notion-bases`)

## 1. OVERVIEW

The Notion Bases community plugin (repo `bgarciamoura/obsidian-notion-bases-plugin`, version pin v1.5.0+) is the closest Obsidian equivalent to Notion's full relational database experience. It persists a database's schema and view definitions in one `_database.md` file per database folder, with every row as its own `.md` file and every column as a frontmatter key. The plugin recovers over 90% of Notion's relational feature set: two-way relations (v1.3.0+), 7 rollup functions, lookup columns, self-relation subtasks up to 3 levels, and 7 of Notion's 10 view types (v1.5.0+). It never writes note content beyond the schema and view config it manages, so every AI operation happens at the file layer.

---

## 2. HOW IT WORKS

The mode edits `_database.md` schema files (append or merge relation, rollup, lookup and view declarations) and the frontmatter of the row notes those schemas describe. Relation reciprocity, rollup aggregates and lookup values are all resolved by reading the related notes directly and applying the documented function — the same discipline used for Dataview queries — rather than waiting on the plugin's in-app compute. Rendering stays in-app: the file layer proves the write and a note reload shows the table, board, gallery, calendar, timeline or chart result.

---

## 3. SOURCE FILES

### Implementation

- Plugin index: `references/plugins/notion-bases/notion-bases.md`
- Data contract: `references/plugins/notion-bases/data-model.md`
- Recipes: `references/plugins/notion-bases/workflows.md`
- Diagnostics: `references/plugins/notion-bases/troubleshooting.md`

### Verification

- Manual scenario: `manual-testing-playbook/plugin-tie-ins/notion-bases-relation-rollup.md`

### Related

- Read-only aggregation supplement: `references/plugins/dataview/` (never edited by this plugin's references — `workflows.md` §7 only points to it)

---

## 4. GUARDRAILS

- Never invent `_database.md` key names. Every schema example in this reference set is the documented conceptual shape, flagged `VERIFY` against the installed plugin.
- Respect the version pin: two-way relations need v1.3.0+; rollup, lookup, subtask and chart-view coverage need v1.5.0+.
- Never claim Form, Map or Dashboard view parity — the migration research is explicit these have no Obsidian equivalent through this plugin or any other.
- Resolve rollups and lookups by hand from the real related rows before reporting a value; never fabricate an aggregate.
- Never claim a schema or row edit rendered in the plugin's UI. File-layer verification proves the write, not the pixels.
