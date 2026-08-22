---
title: "Notion Bases Plugin File-Layer Data Model"
description: "The _database.md schema shape for the Notion Bases community plugin: two-way Relation columns, the 7 Rollup functions, Lookup columns, self-relation subtasks (3-level) and the 7 view types."
trigger_phrases:
  - "notion bases data model"
  - "database.md schema"
  - "notion bases relation column"
  - "notion bases rollup functions"
  - "notion bases lookup column"
  - "notion bases subtasks"
  - "notion bases view types"
importance_tier: "normal"
contextType: "implementation"
version: "0.1.0.0"
---

# Notion Bases Plugin File-Layer Data Model

The plugin persists a database's schema and view config in one `_database.md` file per database folder, and one column value per row `.md` file's frontmatter. Nothing lives outside vault markdown. Every shape below is the documented conceptual schema — exact key spelling is `VERIFY` against the installed plugin (see §7).

---

## 1. OVERVIEW

### Storage model

| Layer | Artifact | AI-operable |
| --- | --- | --- |
| Schema + views | `<database-folder>/_database.md` frontmatter | Yes — read, back up, merge |
| Row data | Every other `.md` file in that folder, one file per row | Yes — read/write frontmatter per column |
| Column types (18 total) | Declared per column in `_database.md`; adds Relation, Lookup, Rollup, Formula, Image, Audio and Video beyond core Bases' 6 (title, text, number, select, multi-select, checkbox, date) | Yes for every text-representable type |
| Enablement | `.obsidian/community-plugins.json` | Yes (already enabled when this reference set is loaded for a live vault) |
| Rendering | The open Obsidian window | No — file-layer writes prove the schema, not the pixels |

### Core contract

- Every database row is a real note. Deleting the plugin never deletes data — the markdown survives on its own.
- Relation, Rollup and Lookup columns exist **only** through this plugin or hand-authored Dataview queries; core Obsidian Bases has none of them.
- Two-way relations, Rollup columns, self-relation subtasks and Chart views require **v1.5.0+** (Rollup/subtasks/charts) or **v1.3.0+** (two-way relations only).

---

## 2. RELATION COLUMNS (two-way)

A Relation column links rows across two databases (or within one, for subtasks — §4). As of v1.3.0+ the relation is **two-way**: declaring the back-reference on both sides keeps a forward and reverse column in sync.

### Documented shape (illustrative — VERIFY exact keys)

```yaml
# Projects/_database.md
columns:
  tasks:
    type: relation
    target: "Tasks"        # sibling database folder
    two_way: true
    back_reference: project
```

```yaml
# Tasks/_database.md
columns:
  project:
    type: relation
    target: "Projects"
    two_way: true
    back_reference: tasks
```

At the row level, a relation value is a wikilink (or a list of wikilinks for one-to-many/many-to-many):

```yaml
# Tasks/Design homepage.md
---
project: "[[Website Relaunch]]"
---
```

The AI verifies a two-way relation by reading **both** notes: the Task's `project` field must resolve to the Project note, and — once the plugin has run — the Project note's `tasks` field should list the Task back. At the file layer, before the plugin renders anything, the AI can only confirm the forward reference and the schema's declared `back_reference` name; full reciprocal-list population is an in-app compute step.

**Cardinality**: one-to-one, one-to-many and many-to-many all use the same `relation` column type — cardinality is a property of how many wikilinks a row lists, not a separate schema field.

---

## 3. ROLLUP COLUMNS (7 functions)

A Rollup column aggregates one property across every row reached through a Relation column, and keeps the aggregate visible inline in the table view without a query block.

### The 7 functions

| Function | What it computes |
| --- | --- |
| `sum` | Total of a numeric property across related rows |
| `count` | Number of related rows |
| `average` | Mean of a numeric property across related rows |
| `min` | Smallest value of a numeric property across related rows |
| `max` | Largest value of a numeric property across related rows |
| `count_values` (distinct) | Count of distinct values for a property across related rows |
| `list` | Concatenated / clickable list of a property's values across related rows |

### Documented shape (illustrative — VERIFY exact keys)

```yaml
# Projects/_database.md
columns:
  estimate_hours_total:
    type: rollup
    relation: tasks          # the Relation column to aggregate through
    property: estimate_hours # the property on the related row
    function: sum
```

Because the aggregate is computed from ordinary frontmatter on ordinary notes, the AI can resolve a rollup's value by hand — read every row the relation column reaches, apply the declared function, and report the result — exactly the way `dataview/workflows.md` §2 resolves a DQL query without rendering it. This is what makes the rollup verifiable at the file layer before the plugin ever runs (see `workflows.md` §3 and the `OBS-022` manual scenario).

---

## 4. LOOKUP COLUMNS

A Lookup column pulls one literal property value from a single related row through a Relation column — it does not aggregate, it copies. This is the plugin's answer to Notion's `show_original` rollup function and to Bases' `asFile().properties` formula pattern.

### Documented shape (illustrative — VERIFY exact keys)

```yaml
# Tasks/_database.md
columns:
  project_status:
    type: lookup
    relation: project      # the Relation column to look through
    property: status       # the property to copy from the related row
```

The AI resolves a Lookup value the same way as a Rollup: read the single related row's `status` field and report it. A Lookup column with a one-to-many relation is ambiguous (which related row's value?) — treat that as a schema error, not a value to guess.

---

## 5. SELF-RELATION SUBTASKS (3-level)

Subtasks reuse the Relation column type, targeting the **same** database, and the plugin's UI adds expand/collapse for the resulting hierarchy. The documented nesting limit is **3 levels**.

### Documented shape (illustrative — VERIFY exact keys)

```yaml
# Tasks/_database.md
columns:
  parent_task:
    type: relation
    target: "Tasks"     # self-relation: same folder as this schema file
    self_relation: true
```

```yaml
# Tasks/Design homepage - review.md
---
parent_task: "[[Design homepage]]"
---
```

```yaml
# Tasks/Design homepage - review - final polish.md
---
parent_task: "[[Design homepage - review]]"
---
```

The AI verifies a subtask chain by walking `parent_task` wikilinks from a leaf note upward and confirming the chain terminates within 3 hops at a row with no `parent_task` value. A chain deeper than 3 levels is not a plugin feature — flag it rather than assume the plugin renders it.

---

## 6. THE 7 VIEW TYPES

| View | Core Bases | Notion Bases plugin | Notes |
| --- | --- | --- | --- |
| Table | Yes | Yes | Default view; the only one the Obsidian Importer writes automatically |
| Board (Kanban) | Yes | Yes | Groups rows by a select-type column |
| List | Yes | Yes | — |
| Calendar | Yes | Yes | Needs a date-type column |
| Gallery | No | Yes | Core Bases has no gallery view |
| Timeline / Gantt | No | Yes | Core Bases has no timeline view |
| Chart | No | Yes (bar/line/pie) | v1.5.0+; core Bases has none, the Charts plugin is the file-layer alternative |

This is 7 of Notion's 10 view types. **Form, Map and Dashboard have no Obsidian equivalent through this plugin or any other** — document them as lost per the migration research, not as a pending recipe.

### Documented view-block shape (illustrative — VERIFY exact keys)

```yaml
# Projects/_database.md
views:
  - name: "By status"
    type: board
    group_by: status
```

The AI validates a view block structurally: the `type` is one of the 7 supported values above, and any column it references (`group_by`, a calendar/timeline date field, …) exists in the same schema's `columns` map. Confirming the view actually renders needs a running Obsidian and a reload.

---

## 7. WHAT THE AI MUST NOT DO

- Never present the illustrative YAML shapes above as byte-verified plugin syntax — they are the documented conceptual schema, confirmed by the migration research's plugin evidence but not yet checked against an installed `main.js`/manifest. Mark exact key spelling `VERIFY` until an install confirms it.
- Never claim a Rollup, Lookup or subtask feature works on a plugin version below v1.5.0, or a two-way Relation on a version below v1.3.0.
- Never invent an 8th view type or claim Form/Map/Dashboard parity — the migration research is explicit that these have no Obsidian equivalent.
- Never claim a schema or row edit rendered in the plugin's table/board/gallery/chart UI. File-layer verification proves the write; a reload proves the render, and that belongs to the plugin-install phase.
- Never fabricate a rollup or lookup result. If the related rows on disk do not support the computed value, report the gap.
