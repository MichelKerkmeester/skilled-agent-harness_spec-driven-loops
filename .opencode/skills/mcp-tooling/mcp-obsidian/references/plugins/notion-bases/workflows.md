---
title: "Notion Bases Plugin File-Layer Workflows"
description: "Safe file-layer recipes for the Notion Bases community plugin: write and extend _database.md relation, rollup and lookup columns, configure a view, and fall back to Dataview for aggregations the plugin doesn't cover."
trigger_phrases:
  - "add notion bases relation column"
  - "add notion bases rollup column"
  - "add notion bases lookup column"
  - "configure notion bases view"
  - "notion bases dataview supplement"
  - "notion bases subtasks recipe"
importance_tier: "normal"
contextType: "implementation"
version: "0.1.0.0"
---

# Notion Bases Plugin File-Layer Workflows

These recipes change the **`_database.md` schema file and the frontmatter of row notes** the plugin reads. File writes are the operation; an in-app reload is the render step. The database definition, the column/view/rollup/lookup shapes and the `nb-database` embed syntax below are confirmed by the plugin's own README (v1.12.0, installed in the operator's vault). Only the exact per-column YAML key spelling remains a single open item — `VERIFY` against a real database before writing a production file (see `data-model.md` §1/§7).

---

## 1. OVERVIEW

### Operating sequence

1. Read the database folder's `_database.md`, or confirm it is absent so no schema exists yet.
2. Identify the row notes the edit will touch. Read them before changing anything.
3. For a new column, add its declaration to `_database.md` and, if it is a Relation, add the matching back-reference declaration in the target database's `_database.md`.
4. For a rollup or lookup, resolve the value by hand from the related rows before promising a result — the same discipline `dataview/workflows.md` §2 uses for DQL.
5. For a view, confirm every column it references already exists in the schema.
6. Back up `_database.md` before any in-place edit; append-first for new columns.
7. Verify at the file layer: re-read the schema and the touched rows, confirm the change.
8. Tell the user to reload the affected note or pane so the plugin re-renders.

### Backup discipline

- Take a `.bak` copy of `_database.md` before any settings-shape edit.
- For row-note edits, keep the original frontmatter in the working transcript.
- Never replace `_database.md` wholesale — merge column and view declarations key by key.

---

## 2. ADD A TWO-WAY RELATION COLUMN

Goal: link two databases so a forward reference on one side and a declared back-reference on the other stay in sync.

### Steps

1. Read both databases' `_database.md` files (or confirm absence).
2. Add a `relation` column to the source database naming its `target` folder and `back_reference` column name.
3. Add the matching `relation` column to the target database, with its own `back_reference` pointing back.
4. On a row in the source database, write the forward value as a wikilink (or a list of wikilinks) to the target row.
5. Re-read both `_database.md` files and the touched row; confirm the schema and the forward value parse.

### Before

```yaml
# Projects/_database.md
columns:
  status: { type: select }
```

```yaml
# Tasks/_database.md
columns:
  title: { type: title }
```

### After

```yaml
# Projects/_database.md
columns:
  status: { type: select }
  tasks:
    type: relation
    target: "Tasks"
    two_way: true
    back_reference: project
```

```yaml
# Tasks/_database.md
columns:
  title: { type: title }
  project:
    type: relation
    target: "Projects"
    two_way: true
    back_reference: tasks
```

```yaml
# Tasks/Design homepage.md
---
project: "[[Website Relaunch]]"
---
```

### Checkpoint

`relation_schema_reciprocal`: both `_database.md` files declare the relation with matching `back_reference` names, and the row's forward wikilink resolves to an existing note in the target folder.

---

## 3. ADD A ROLLUP COLUMN

Goal: aggregate a property across every row a Relation column reaches, and prove the aggregate by hand before the plugin renders it.

### Steps

1. Confirm the Relation column the rollup will aggregate through already exists (§2).
2. Add the `rollup` column to the schema: `relation` (the relation column name), `property` (the field on related rows), `function` (one of the 7 in `data-model.md` §3).
3. Read every related row and apply the function by hand.
4. Re-read the schema and report the computed value alongside the declaration, not as an in-app render.

### Before

```yaml
# Projects/_database.md
columns:
  tasks: { type: relation, target: "Tasks", two_way: true, back_reference: project }
```

### After

```yaml
# Projects/_database.md
columns:
  tasks: { type: relation, target: "Tasks", two_way: true, back_reference: project }
  estimate_hours_total:
    type: rollup
    relation: tasks
    property: estimate_hours
    function: sum
```

Hand-resolution: if `Tasks/Design homepage.md` has `estimate_hours: 8` and `Tasks/Write copy.md` has `estimate_hours: 5`, and both list `project: "[[Website Relaunch]]"`, the `sum` rollup on the Website Relaunch project resolves to `13` — read from the files, not rendered by the plugin.

### Checkpoint

`rollup_hand_resolved`: every related row was read, the declared function was applied correctly, and the reported value traces to real frontmatter, not an assumption.

---

## 4. ADD A LOOKUP COLUMN

Goal: copy one property's literal value from a single related row.

### Steps

1. Confirm the Relation column the lookup will read through already exists, and that it resolves to exactly one related row per source row (a one-to-many relation makes a lookup ambiguous — flag it instead of guessing).
2. Add the `lookup` column: `relation` (the relation column name), `property` (the field to copy).
3. Read the single related row and report its value as the lookup's resolved value.

### Before

```yaml
# Tasks/_database.md
columns:
  project: { type: relation, target: "Projects", two_way: true, back_reference: tasks }
```

### After

```yaml
# Tasks/_database.md
columns:
  project: { type: relation, target: "Projects", two_way: true, back_reference: tasks }
  project_status:
    type: lookup
    relation: project
    property: status
```

### Checkpoint

`lookup_hand_resolved`: the relation resolves to exactly one related row, and the reported value is that row's real `status` field.

---

## 5. CONFIGURE SELF-RELATION SUBTASKS

Goal: nest tasks up to 3 levels using a self-relation column.

### Steps

1. Add a `relation` column to the database's own `_database.md` with `target` set to the same folder and `self_relation: true`.
2. On each child row, write the parent as a single wikilink in that column.
3. Walk the chain from a leaf row upward and confirm it terminates within 3 hops at a row with no parent value.

### Before

```yaml
# Tasks/_database.md
columns:
  title: { type: title }
```

### After

```yaml
# Tasks/_database.md
columns:
  title: { type: title }
  parent_task:
    type: relation
    target: "Tasks"
    self_relation: true
```

```yaml
# Tasks/Design homepage - review.md
---
parent_task: "[[Design homepage]]"
---
```

### Checkpoint

`subtask_chain_within_limit`: every row's `parent_task` chain resolves to real notes and terminates at or before 3 levels.

---

## 6. CONFIGURE A VIEW

Goal: add a named view to a database's `_database.md`.

### Steps

1. Pick one of the 7 supported view types (`data-model.md` §6). Form, Map and Dashboard are not valid choices — document the request as lost instead.
2. Confirm every column the view references (`group_by`, a date field, …) already exists in the schema.
3. Add the view block to `_database.md`.
4. Re-read the file and validate the view's `type` and referenced columns per step 1–2.
5. To render the view in a note, embed it with the confirmed `nb-database` fenced code block (`data-model.md` §6), naming the database's `path` and, optionally, a `type`.

### Before

```yaml
# Projects/_database.md
columns:
  status: { type: select }
views: []
```

### After

```yaml
# Projects/_database.md
columns:
  status: { type: select }
views:
  - name: "By status"
    type: board
    group_by: status
```

Embedded in a note:

````markdown
```nb-database
path: "Projects"
type: board
```
````

### Checkpoint

`view_block_valid`: `type` is one of the 7 supported values, and every referenced column exists in the same schema's `columns` map. `nb_database_embed_valid`: the embedded block's `path` resolves to a real database folder and its optional `type` (if given) is one of the 7 supported values.

---

## 7. DATASOURCE SUPPLEMENT: DATAVIEW FOR AGGREGATIONS THE PLUGIN DOESN'T COVER

The Notion Bases plugin's 7 rollup functions (`sum`, `count`, `avg`, `min`, `max`, `count_values`, `list`) cover most Notion rollup patterns, but not every one. When a Notion rollup or cross-database aggregation has no matching plugin function — a custom filter-then-aggregate, a multi-hop rollup through more than one relation, or a computed value the plugin's spreadsheet-style formulas cannot express — fall back to a read-only Dataview query instead of forcing it into the plugin schema.

**Do not edit `references/plugins/dataview/*`.** This section only points to it: read `../dataview/workflows.md` for the query-authoring recipes and `../dataview/data-model.md` for the verified DQL grammar.

### Recipe

1. Confirm the aggregation genuinely has no Rollup/Lookup equivalent (check `data-model.md` §3–§4 first).
2. Tag or otherwise make the related rows queryable exactly as `../dataview/workflows.md` §4–§5 describe (frontmatter or inline fields).
3. Author a DQL `TABLE` block with the needed `SUM`/`COUNT`/`AVG`/`GROUP BY` per `../dataview/data-model.md` §7–§8.
4. Resolve the query by hand per `../dataview/workflows.md` §2 before promising a result.

### Example: multi-hop aggregation the plugin's rollup can't express

A Notion rollup that sums a property two relations away (Task → Project → Program) has no single Notion Bases rollup column, because a rollup aggregates through exactly one relation. Dataview reaches it in one query:

````markdown
```dataview
TABLE sum(rows.estimate_hours) AS "Program hours"
FROM "Tasks"
WHERE project = this.file.link
GROUP BY project
```
````

### Static-value fallback (no equivalent in either surface)

When a Notion rollup or formula pattern has no equivalent in the plugin **or** Dataview — for example a Notion formula using `style()`/`unstyle()`/`name()` text-styling functions, which have no Obsidian analogue in either surface — do not invent a workaround. Write the value as a plain static frontmatter field at import time, and note in the same frontmatter (or an adjacent comment note) that it was hand-computed and will not auto-update. This mirrors the migration research's formula-recovery guidance: keep a correct static value over a fabricated live one.

```yaml
# Tasks/Legacy formula task.md
---
styled_label: "Design Homepage"   # static: was Notion style()/name(), no plugin or Dataview equivalent — hand-set, does not auto-update
---
```

### Checkpoint

`dataview_supplement_used_correctly`: the plugin's Rollup/Lookup columns were checked first and genuinely do not cover the pattern, the Dataview query is grounded in real note data, and any value with no equivalent in either surface is a clearly labeled static fallback rather than a silent gap.

---

## 8. VERIFYING

Run these named checkpoints after any Notion Bases operation:

| Checkpoint | What it proves |
| --- | --- |
| `relation_schema_reciprocal` | Both sides of a relation declare matching back-references, and the forward value resolves |
| `rollup_hand_resolved` | The rollup's declared function was applied by hand to real related rows |
| `lookup_hand_resolved` | The lookup resolves to exactly one related row's real value |
| `subtask_chain_within_limit` | The self-relation chain resolves and terminates within 3 levels |
| `view_block_valid` | The view type is one of the 7 supported values and its referenced columns exist |
| `nb_database_embed_valid` | The `nb-database` embed block's `path` resolves to a real database folder and its optional `type` is one of the 7 supported values |
| `dataview_supplement_used_correctly` | Dataview was used only after the plugin's own columns were ruled out, and static fallbacks are labeled |

The file layer proves the write. The render proves itself in-app after the user reloads the note — that check belongs to the plugin-install phase, not this reference set.
