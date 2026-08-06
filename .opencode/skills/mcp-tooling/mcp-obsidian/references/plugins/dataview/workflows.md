---
title: Dataview File-Layer Workflows
description: "Safe file-layer recipes for Dataview: resolve query results by reading notes, validate query blocks, add inline and frontmatter fields, place query blocks and edit settings with backup discipline."
trigger_phrases:
  - "create dataview query"
  - "add dataview inline field"
  - "dataview table block"
  - "enable dataviewjs"
  - "dataview task query"
  - "dataview frontmatter field"
importance_tier: "normal"
contextType: "implementation"
version: 0.10.0.0
---

# Dataview File-Layer Workflows

These recipes change the **note content and settings files** Dataview reads. The plugin computes views when notes open, so file writes are the operation and an in-app reload is the render step.

---

## 1. OVERVIEW

### Operating sequence

1. Read the settings file (`.obsidian/plugins/dataview/data.json`) or confirm it is absent so defaults apply.
2. Identify the notes the query or edit will touch. Read them before changing anything.
3. For queries, evaluate the DQL against the real notes by hand before promising a result.
4. For metadata, append or patch fields with a backup of the note when editing in place.
5. For settings, back up `data.json` before any write and merge key by key.
6. Verify at the file layer: re-read the note or settings file and confirm the change.
7. Tell the user to open or reload the affected note so the plugin re-renders.

### Backup discipline

- Take a `.bak` copy of `data.json` before any settings write.
- For in-place note edits, keep a copy of the original note text in the working transcript.
- Append-first for metadata. Patch in place only when the field shape stays valid.

---

## 2. READ: RESOLVE A QUERY'S RESULTS

Goal: answer a question the user could ask Dataview, without rendering.

### Steps

1. Read the query or restate the user ask as a DQL query.
2. Resolve the `FROM` source: list the folder, the tag matches, or the link targets.
3. Read every matching note and collect the referenced fields.
4. Apply `WHERE`, then `SORT`, then `GROUP BY` and `FLATTEN`, then `LIMIT`.
5. Report the rows with the same columns the query would show.

### Example

Query: `TABLE status, due FROM "Projects" WHERE status = "active"`.

- Read `Projects/` contents.
- Read each note, collect `status` and `due`.
- Keep rows where `status` equals `active`.
- Report a table with `File`, `status` and `due` columns.

### Checkpoint

`query_resolved_from_files`: every reported value traces to a field read from a real note and the WHERE filter is applied correctly.

---

## 3. VALIDATE: CHECK A QUERY BLOCK

Goal: confirm a query block is well-formed before the user opens the note.

### Steps

1. Check the fence language is `dataview` or `dataviewjs`, exactly.
2. Check the first token is one of `TABLE`, `LIST`, `TASK`, or `CALENDAR` (DQL only).
3. Check every clause keyword is valid: `FROM`, `WHERE`, `SORT`, `GROUP BY`, `FLATTEN`, `LIMIT`, `AS`.
4. Check `FROM` sources use valid syntax: `"Folder"`, `#tag`, `[[note]]`, `outgoing([[note]])`, `incoming([[note]])`.
5. Check field names resolve: frontmatter keys, inline field keys, or `file.*` names from the data model.
6. Check functions in the query exist in the verified subset (data-model section 8) or are marked `VERIFY`.

### Example fix

Before (typo in field name):

````markdown
```dataview
TABLE statu
FROM "Projects"
```
````

After:

````markdown
```dataview
TABLE status
FROM "Projects"
```
````

### Checkpoint

`query_block_validated`: fence language, view type, clauses, FROM source and field names all pass against the verified grammar.

---

## 4. ADD INLINE FIELD DATA TO A NOTE

Goal: make a note queryable by inline fields without touching its existing structure.

### Steps

1. Read the note fully.
2. Append `Key:: Value` lines at the end of the note body, separated by a blank line.
3. Keep one key per line, keys unique in the note.
4. Use ISO dates for date values.
5. Re-read the note and confirm the fields parse.

### Before

```markdown
# Meeting notes

Discussed the quarterly plan.
```

### After

```markdown
# Meeting notes

Discussed the quarterly plan.

Attendees:: Ada, Grace
Status:: done
Date:: 2026-06-30
```

### Checkpoint

`inline_fields_appended`: each `Key:: Value` line uses the `::` separator, keys are unique and the note body before the addition is unchanged.

---

## 5. ADD FRONTMATTER FIELDS TO A NOTE

Goal: give a note typed, queryable metadata.

### Steps

1. Read the note. If it has frontmatter, merge new keys into it.
2. If it has none, add a `---` fenced YAML block as the first lines.
3. Keep list values under their key with two-space indentation.
4. Preserve every existing key and value.
5. Re-read and validate the YAML parses.

### Before (no frontmatter)

```markdown
# Quarterly report

Revenue summary goes here.
```

### After

```markdown
---
title: "Quarterly report"
status: active
tags:
  - finance
  - report
---

# Quarterly report

Revenue summary goes here.
```

### Checkpoint

`frontmatter_merged`: YAML parses, existing keys survive and the new fields match the names the query expects.

---

## 6. CREATE A TABLE QUERY BLOCK

Goal: add a table view to a note.

### Steps

1. Pick the `FROM` source and verify the notes exist.
2. Name the columns you need and verify each field exists in the source notes.
3. Write the block at the end of the note or in the intended section.
4. Validate per section 3.

### Before

```markdown
## Project status

```

### After

````markdown
## Project status

```dataview
TABLE status, due AS "Due date"
FROM "Projects"
WHERE contains(status, "active")
SORT due ASC
LIMIT 20
```
````

### Checkpoint

`table_block_placed`: fence language `dataview`, valid view type, verified field names and at least one matching note on disk.

---

## 7. CREATE A TASK OR CALENDAR QUERY BLOCK

Goal: add a task list or calendar view.

### Steps

1. For tasks, confirm the source notes contain `- [ ]` list items.
2. For a calendar, confirm a date field exists on the source notes, such as `file.day` or a frontmatter date.
3. Write the block and validate per section 3.

### Task example

````markdown
```dataview
TASK
FROM "Journal"
WHERE !completed
```
````

### Calendar example

````markdown
```dataview
CALENDAR file.day
FROM "Journal"
```
````

### Checkpoint

`task_or_calendar_block_valid`: the source notes contain the required item or date data and the block passes grammar validation.

---

## 8. ENABLE DATAVIEWJS

Goal: allow `dataviewjs` blocks and `$=` inline JS to run.

### Steps

1. Read `data.json` or confirm it is absent.
2. Back it up to `data.json.bak` when it exists.
3. Write or merge `enableDataviewJs: true` (blocks) and `enableInlineDataviewJs: true` (inline).
4. Keep every other key unchanged.
5. Re-read the file and validate JSON parse.
6. Tell the user to reload Obsidian so the plugin reads the new settings.

### Before

```json
{
  "enableDataviewJs": false,
  "enableInlineDataviewJs": false
}
```

### After

```json
{
  "enableDataviewJs": true,
  "enableInlineDataviewJs": true
}
```

### Checkpoint

`dataviewjs_enabled`: the two keys are `true`, the rest of `data.json` is byte-identical and the JSON parses.

---

## 9. CHANGE RENDER DEFAULTS

Goal: adjust how Dataview renders null values, dates, or result counts.

### Steps

1. Read `data.json`.
2. Back it up.
3. Merge the target keys, for example `renderNullAs` or `defaultDateFormat`.
4. Re-read and validate JSON parse.
5. Ask for a reload when the change affects open views.

### Example

```json
{
  "renderNullAs": "\\-",
  "defaultDateFormat": "yyyy-MM-dd"
}
```

### Checkpoint

`settings_merged`: the target keys carry the new values, unrelated keys are untouched and the file parses.

---

## 10. VERIFYING

Run these named checkpoints after any Dataview operation:

| Checkpoint | What it proves |
| --- | --- |
| `query_resolved_from_files` | Every reported value comes from a real note |
| `query_block_validated` | Block grammar and field names pass |
| `inline_fields_appended` | Fields parse and the rest of the note is intact |
| `frontmatter_merged` | YAML parses and existing keys survive |
| `table_block_placed` | Block is valid and source notes exist |
| `task_or_calendar_block_valid` | Source data supports the view |
| `dataviewjs_enabled` | Settings keys set, rest intact |
| `settings_merged` | Settings keys set, rest intact |

The file layer proves the write. The render proves itself in-app after the user reloads the note.
