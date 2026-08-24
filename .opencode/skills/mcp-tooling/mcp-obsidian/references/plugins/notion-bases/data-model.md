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

The plugin persists a database's schema and view config in one `_database.md` file per database folder, and one column value per row `.md` file's frontmatter. Nothing lives outside vault markdown. This storage model, the 18 column types, the 7 view types, the 7 rollup functions and the `nb-database` embed syntax are all confirmed by the plugin's own source (v1.12.0, installed in the operator's vault). The exact per-column frontmatter keys for relation/rollup/lookup/subtask/view declarations are also confirmed against the plugin's `src/types.ts` and the installed `main.js` — they are the source-key spellings documented in §2–§6. Every `_database.md` must additionally carry the required `notion-bases: true` marker (§1 Database marker).

---

## 1. OVERVIEW

### Storage model

| Layer | Artifact | AI-operable |
| --- | --- | --- |
| Schema + views | `<database-folder>/_database.md` frontmatter | Yes — read, back up, merge |
| Row data | Every other `.md` file in that folder, one file per row | Yes — read/write frontmatter per column |
| Column types (18 total, confirmed) | Declared per column in `_database.md`: `title, text, number, select, multiselect, checkbox, date, url, email, phone, status, formula, relation, lookup, image, rollup, audio, video`. Relation, Lookup and Rollup exist **only** through this plugin (or hand-authored Dataview) — core Obsidian Bases has none of them | Yes for every text-representable type |
| View embed | `nb-database` fenced code block in any note (§6) | Yes — write, read, validate the block |
| Enablement | `.obsidian/community-plugins.json` | Yes (already enabled when this reference set is loaded for a live vault) |
| Rendering | The open Obsidian window | No — file-layer writes prove the schema, not the pixels |

### Core contract

- Every database row is a real note. Deleting the plugin never deletes data — the markdown survives on its own.
- Relation, Rollup and Lookup columns exist **only** through this plugin or hand-authored Dataview queries; core Obsidian Bases has none of them.
- Two-way relations, Rollup columns, self-relation subtasks and Chart views require **v1.5.0+** (Rollup/subtasks/charts) or **v1.3.0+** (two-way relations only).

### Database marker (required)

A folder becomes a Notion Bases database **only** when its `_database.md` frontmatter carries the boolean marker `notion-bases: true`. The plugin tests this with a strict `=== true` check, so the key must be present and boolean — a missing marker, or a string `"true"`, means the plugin does not treat the folder as a database at all. Every `_database.md` you author or edit must include it alongside the `columns` and `views` maps:

```yaml
# Projects/_database.md  (frontmatter)
notion-bases: true
columns:
  ...
views:
  ...
```

---

## 2. RELATION COLUMNS (two-way)

A Relation column links rows across two databases (or within one, for subtasks — §4). As of v1.3.0+ the relation is **two-way**: declaring the back-reference on both sides keeps a forward and reverse column in sync.

### Example schema

```yaml
# Projects/_database.md
columns:
  tasks:
    type: relation
    refDatabasePath: "Tasks/_database.md"  # the related database's _database.md
    refColumnId: "_title"                   # match column on the related row (defaults to _title = basename)
    pairedColumnId: project                 # reverse column on the other side — makes it two-way
```

```yaml
# Tasks/_database.md
columns:
  project:
    type: relation
    refDatabasePath: "Projects/_database.md"
    refColumnId: "_title"
    pairedColumnId: tasks
```

At the row level, a relation value is a wikilink (or a list of wikilinks for one-to-many/many-to-many):

```yaml
# Tasks/Design homepage.md
---
project: "[[Website Relaunch]]"
---
```

The AI verifies a two-way relation by reading **both** notes: the Task's `project` field must resolve to the Project note, and — once the plugin has run — the Project note's `tasks` field should list the Task back. At the file layer, before the plugin renders anything, the AI can only confirm the forward reference and the schema's declared `pairedColumnId`; full reciprocal-list population is an in-app compute step.

**Cardinality**: one-to-one, one-to-many and many-to-many all use the same `relation` column type — cardinality is a property of how many wikilinks a row lists, not a separate schema field.

---

## 3. ROLLUP COLUMNS (7 functions)

A Rollup column aggregates one property across every row reached through a Relation column, and keeps the aggregate visible inline in the table view without a query block.

### The 7 functions (confirmed exact keywords)

| Function | What it computes |
| --- | --- |
| `sum` | Total of a numeric property across related rows |
| `count` | Number of related rows |
| `avg` | Mean of a numeric property across related rows |
| `min` | Smallest value of a numeric property across related rows |
| `max` | Largest value of a numeric property across related rows |
| `count_values` (distinct) | Count of distinct values for a property across related rows |
| `list` | Concatenated / clickable list of a property's values across related rows |

### Example schema

```yaml
# Projects/_database.md
columns:
  estimate_hours_total:
    type: rollup
    rollupRelationColumnId: tasks          # the Relation column to aggregate through
    rollupTargetColumnId: estimate_hours   # the property on the related row
    rollupFunction: sum
```

Because the aggregate is computed from ordinary frontmatter on ordinary notes, the AI can resolve a rollup's value by hand — read every row the relation column reaches, apply the declared function, and report the result — exactly the way `dataview/workflows.md` §2 resolves a DQL query without rendering it. This is what makes the rollup verifiable at the file layer before the plugin ever runs (see `workflows.md` §3 and the `OBS-022` manual scenario).

---

## 4. LOOKUP COLUMNS

A Lookup column pulls one literal property value from a single related row through a Relation column — it does not aggregate, it copies. This is the plugin's answer to Notion's `show_original` rollup function and to Bases' `asFile().properties` formula pattern.

### Example schema

```yaml
# Tasks/_database.md
columns:
  project_status:
    type: lookup
    refDatabasePath: "Projects/_database.md"  # the related database to look into
    refColumnId: status                        # the property to copy from the related row
    refMatchColumnId: "_title"                 # the column matched against the relation (defaults to _title)
```

The AI resolves a Lookup value the same way as a Rollup: read the single related row's `status` field and report it. A Lookup column with a one-to-many relation is ambiguous (which related row's value?) — treat that as a schema error, not a value to guess.

---

## 5. SELF-RELATION SUBTASKS (3-level)

Subtasks reuse the Relation column type, targeting the **same** database, and the plugin's UI adds expand/collapse for the resulting hierarchy. The documented nesting limit is **3 levels**.

### Example schema

```yaml
# Tasks/_database.md
columns:
  parent_task:
    type: relation
    refDatabasePath: "Tasks/_database.md"  # self-relation: points back at this same database
    isHierarchical: true                    # marks it as a subtask/self-relation hierarchy
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

## 6. THE 7 VIEW TYPES (confirmed exact keywords)

| View | Core Bases | Notion Bases plugin | Notes |
| --- | --- | --- | --- |
| `table` | Yes | Yes | Default view; the only one the Obsidian Importer writes automatically |
| `board` (Kanban) | Yes | Yes | Groups rows by a select-type column |
| `list` | Yes | Yes | — |
| `calendar` | Yes | Yes | Needs a date-type column |
| `gallery` | No | Yes | Core Bases has no gallery view |
| `timeline` | No | Yes | Core Bases has no timeline view; sometimes described as Gantt-style in the plugin's own UI copy |
| `chart` | No | Yes (bar/line/pie) | v1.5.0+; core Bases has none, the Charts plugin is the file-layer alternative |

This is 7 of Notion's 10 view types. **Form, Map and Dashboard have no Obsidian equivalent through this plugin or any other** — document them as lost per the migration research, not as a pending recipe.

### Example view-block schema

```yaml
# Projects/_database.md
views:
  - name: "By status"
    type: board
    groupByColumnId: status
  - name: "Schedule"
    type: calendar
    calendarDateField: dueDate
```

The AI validates a view block structurally: the `type` is one of the 7 supported values above, and any column it references (`groupByColumnId` for a board, `calendarDateField` for a calendar, a timeline date field, …) exists in the same schema's `columns` map. Confirming the view actually renders needs a running Obsidian and a reload.

### Embedding a view in a note (confirmed syntax)

A view is rendered in any note through the plugin's own **`nb-database`** fenced code block — this is confirmed by the plugin's README, distinct from a core Obsidian `.base` embed:

````markdown
```nb-database
path: "Projects"
type: board
```
````

`path` names the database folder; `type` is optional and, when present, must be one of the 7 values in the table above.

---

## 7. ADVANCED SCHEMA KEYS

Beyond columns and views, `_database.md` supports several confirmed keys (from the plugin's `src/types.ts` and the installed `main.js`). All are optional.

### System columns (read-only, file-stat backed)

`created` and `modified` columns are backed by file stats, **not** frontmatter — never hand-author their values:

```yaml
columns:
  created:  { type: date, systemField: ctime }   # from file.stat.ctime
  modified: { type: date, systemField: mtime }   # from file.stat.mtime
```

### Number format

A `number` column can carry a `numberFormat`:

```yaml
columns:
  budget:
    type: number
    numberFormat: { decimals: 2, thousandsSeparator: true, prefix: "$", suffix: "" }
```

### Templates

New-row templates are declared at the database level with `templatePath` (or `templateFolder`, plus `askTemplateOnCreate: true`):

```yaml
templatePath: "Templates/task.md"
```

Placeholders `{{title}}`, `{{folder}}`, `{{date}}`, `{{time}}` are expanded when a row is created (`applyTemplate`).

### Folder arrangement (auto-files rows into subfolders)

```yaml
folderArrangement:
  enabled: true
  propertyIds: [status, priority]
```

When enabled, the plugin **relocates** each row's `.md` file into a subfolder computed from its column values (`computeArrangedPath`, e.g. `Done/High/row.md`). An AI editing a row must know the file can move — do not assume a fixed path.

### Full ViewConfig surface

Beyond `groupByColumnId` and `calendarDateField` (§6), a view block can carry, by view type: `calendarViewMode`; `timelineStartField` / `timelineEndField` / `timelineZoom` / `timelineGroupByField`; `chartType` / `chartXAxis` / `chartYAxis` / `chartAggregation`; `galleryCoverField` / `galleryCardSize`; `boardColumnOrder` / `boardColumnLimits` / `boardHideEmpty` / `boardHideNoValue`; and shared `pinnedColumnId` / `columnOrder` / `rowHeight` / `wrapText` / `aggregations` / `includeSubfolders` / `conditionalFormats`.

### Embed state storage

An embedded view's state does not live in the database's `_database.md` — it persists in the **hosting note's** frontmatter under `notion-bases-embeds` (key `EMBED_FM_KEY`), a map of embed id → `ViewConfig`/`EmbedState`. Editing a note that hosts an `nb-database` embed means that map may be present; do not strip it.

### Live placeholders

`{{columnId}}` tokens in a note body render the current cell value for that column in reading view (`createLivePlaceholderProcessor`) — a distinct mechanism from the `nb-database` embed system.

### Inline field support

When `readInlineFields` is enabled in the plugin's settings, Dataview-style `Key:: Value` inline fields in a row note are read alongside its frontmatter (`getNoteData`) — so a column value can come from an inline field, not only frontmatter.

---

## 8. WHAT THE AI MUST NOT DO

- Always author `_database.md` frontmatter with the confirmed source keys (`refDatabasePath`, `refColumnId`, `pairedColumnId`, `rollupRelationColumnId`, `rollupTargetColumnId`, `rollupFunction`, `refMatchColumnId`, `isHierarchical`, `groupByColumnId`, `calendarDateField`) shown in §2–§6, and always include the required `notion-bases: true` marker (§1). These keys are confirmed against the plugin's `src/types.ts` and the installed `main.js` (v1.12.0). Snake-case guesses like `target`, `two_way`, `back_reference`, `relation`, `property`, `function`, `group_by`, `date_field` are **not** plugin keys — the plugin silently ignores them, so the column has no effect.
- Never claim a Rollup, Lookup or subtask feature works on a plugin version below v1.5.0, or a two-way Relation on a version below v1.3.0.
- Never invent an 8th view type or claim Form/Map/Dashboard parity — the migration research is explicit that these have no Obsidian equivalent.
- Never claim a schema or row edit rendered in the plugin's table/board/gallery/chart UI. File-layer verification proves the write; a reload proves the render, and that belongs to the plugin-install phase.
- Never hand-author a **system-column** (`created`/`modified`), **rollup** or **lookup** value — they are derived (file stats, `resolveRollupsForRows`, `resolveLookupsForRows`), so a written value is ignored or overwritten (§7).
- Never fabricate a rollup or lookup result. If the related rows on disk do not support the computed value, report the gap.
