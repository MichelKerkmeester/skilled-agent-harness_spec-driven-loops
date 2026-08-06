---
title: Dataview File-Layer Data Model
description: "Exact file-layer contract for Dataview: settings data.json schema, frontmatter and inline field syntax, implicit file fields, query block formats and the verified DQL grammar."
trigger_phrases:
  - "dataview data model"
  - "dataview settings json"
  - "dataview inline fields"
  - "dataview frontmatter fields"
  - "dataview file fields"
  - "dataview query syntax"
  - "dataview dql grammar"
importance_tier: "normal"
contextType: "implementation"
version: 0.10.0.0
---

# Dataview File-Layer Data Model

Dataview reads note content and renders it. The AI operates the note content and the settings file. Every schema below was verified against the installed artifact (version 0.5.68 `main.js` and `manifest.json`).

---

## 1. OVERVIEW

### Canonical identity

| Identity field | Current value |
| --- | --- |
| Obsidian plugin ID | dataview |
| Display name | Dataview |
| Plugin repository | blacksmithgu/obsidian-dataview |
| Installed version | 0.5.68 (verified on-disk) |
| Minimum app version | 0.13.11 |
| Settings file | `<vault>/.obsidian/plugins/dataview/data.json` |

### Core contract

- Dataview derives queryable data from YAML frontmatter, `Key:: Value` inline fields and implicit `file.*` fields.
- Query blocks are fenced code blocks with language `dataview` (DQL) or `dataviewjs` (JavaScript).
- Inline expressions use the `=` prefix (DQL) and the `$=` prefix (JavaScript).
- The plugin persists nothing except its settings file. It never writes to notes.
- This vault has no `data.json`, so all documented defaults apply until the plugin writes settings.

---

## 2. SETTINGS CONTRACT

All 25 keys and defaults below come from the `DEFAULT_SETTINGS` object in the installed `main.js`. When `data.json` is absent, these values are in effect. When it exists, read it and document only the real values.

| Key | Default | Notes |
| --- | --- | --- |
| `renderNullAs` | `"\\-"` (JSON) | Renders null values as this string. The display value is `\-` |
| `taskCompletionTracking` | `false` | Adds completion metadata to tasks |
| `taskCompletionUseEmojiShorthand` | `false` | Uses emoji markers for completion |
| `taskCompletionText` | `"completion"` | Key name for completion timestamps |
| `taskCompletionDateFormat` | `"yyyy-MM-dd"` | Format for completion timestamps |
| `recursiveSubTaskCompletion` | `false` | Completes subtasks with their parent |
| `warnOnEmptyResult` | `true` | Shows a warning on empty query results |
| `refreshEnabled` | `true` | Periodic auto-refresh of views |
| `refreshInterval` | `2500` | Refresh period in milliseconds |
| `defaultDateFormat` | `"MMMM dd, yyyy"` | Date format for `date(...)` output |
| `defaultDateTimeFormat` | `"h:mm a - MMMM dd, yyyy"` | Datetime format for datetime output |
| `maxRecursiveRenderDepth` | `4` | Depth limit for recursive renders |
| `tableIdColumnName` | `"File"` | Header of the implicit file column |
| `tableGroupColumnName` | `"Group"` | Header of group columns |
| `showResultCount` | `true` | Shows the result count under views |
| `allowHtml` | `true` | Allows HTML in rendered output |
| `inlineQueryPrefix` | `"="` | Prefix that starts an inline DQL query |
| `inlineJsQueryPrefix` | `"$="` | Prefix that starts an inline JS query |
| `inlineQueriesInCodeblocks` | `true` | Allows inline queries inside code blocks |
| `enableInlineDataview` | `true` | Enables `=` inline queries |
| `enableDataviewJs` | `false` | Enables `dataviewjs` blocks |
| `enableInlineDataviewJs` | `false` | Enables `$=` inline JS queries |
| `prettyRenderInlineFields` | `true` | Formats inline fields in reading view |
| `prettyRenderInlineFieldsInLivePreview` | `true` | Formats inline fields in live preview |
| `dataviewJsKeyword` | `"dataviewjs"` | Fence language that activates JS blocks |

### Default `data.json` shape

This JSON mirrors the defaults. Write it only to restore a broken settings file, after a backup.

```json
{
  "renderNullAs": "\\-",
  "taskCompletionTracking": false,
  "taskCompletionUseEmojiShorthand": false,
  "taskCompletionText": "completion",
  "taskCompletionDateFormat": "yyyy-MM-dd",
  "recursiveSubTaskCompletion": false,
  "warnOnEmptyResult": true,
  "refreshEnabled": true,
  "refreshInterval": 2500,
  "defaultDateFormat": "MMMM dd, yyyy",
  "defaultDateTimeFormat": "h:mm a - MMMM dd, yyyy",
  "maxRecursiveRenderDepth": 4,
  "tableIdColumnName": "File",
  "tableGroupColumnName": "Group",
  "showResultCount": true,
  "allowHtml": true,
  "inlineQueryPrefix": "=",
  "inlineJsQueryPrefix": "$=",
  "inlineQueriesInCodeblocks": true,
  "enableInlineDataview": true,
  "enableDataviewJs": false,
  "enableInlineDataviewJs": false,
  "prettyRenderInlineFields": true,
  "prettyRenderInlineFieldsInLivePreview": true,
  "dataviewJsKeyword": "dataviewjs"
}
```

### Settings discipline

- Read `data.json` before every operation. The user may have changed values in-app.
- Back up the file before any write (copy to `data.json.bak`).
- Merge edits key by key. Never replace the whole file with an unrelated object.
- After writing, validate JSON parse and confirm the changed keys.

---

## 3. METADATA LAYER: FRONTMATTER FIELDS

YAML frontmatter at the top of a note becomes queryable fields.

```yaml
---
title: "Quarterly report"
status: active
owner: ada
tags:
  - finance
  - report
amount: 1250
---
```

- Fields are queried by their plain name: `status`, `owner`, `amount`.
- Tags in frontmatter feed `file.tags` and `file.etags`.
- Dates can be written as ISO strings. Dataview parses them as date values when used with `date(...)`.
- Numbers stay numeric for `WHERE` comparisons and aggregation functions.
- Lists become arrays you can test with `contains(...)`.

---

## 4. METADATA LAYER: INLINE FIELDS

Inline fields live in the note body. The parser splits on the `::` separator, so the key is the text before it and the value is the text after it.

```markdown
Author:: Ada Lovelace
Due:: 2026-06-30
Progress:: 70
```

- The key is trimmed, the value is trimmed.
- A value can span multiple lines when the continuation is indented.
- Inline fields merge with frontmatter fields into one field space. A plain query references the field name without any prefix.
- `prettyRenderInlineFields` controls how the raw `Key:: Value` text displays in reading view.
- The same key in frontmatter and inline body is ambiguous. Keep one source per key to avoid confusion.

---

## 5. METADATA LAYER: IMPLICIT FILE FIELDS

Every note exposes a `file` object. The keys below were verified in the installed `main.js` serializer.

| Field | Type | Meaning |
| --- | --- | --- |
| `file.name` | string | Note name from path, without extension |
| `file.path` | string | Full vault path of the note |
| `file.folder` | string | Containing folder of the note |
| `file.ext` | string | File extension, usually `md` |
| `file.link` | link | Link object for the note |
| `file.outlinks` | array of links | Links, embeds, header and block links in the note |
| `file.inlinks` | array of links | Links from other notes into this note |
| `file.etags` | array of strings | Exact tags in the note |
| `file.tags` | array of strings | Tags plus parent tags, so `#hello/yes` yields `#hello` and `#hello/yes` |
| `file.aliases` | array of strings | Aliases declared for the note |
| `file.lists` | array of list items | All list items in the note |
| `file.tasks` | array of task items | List items that are tasks |
| `file.ctime` | datetime | Note creation time |
| `file.cday` | date | Creation time with time stripped |
| `file.mtime` | datetime | Note modification time |
| `file.mday` | date | Modification time with time stripped |
| `file.size` | number | Note size in bytes |
| `file.starred` | boolean | Starred state of the note |
| `file.frontmatter` | object | The raw frontmatter as an object |
| `file.day` | date | Derived day, present only when the note structure yields one |

- `file.day` appears only when a day can be derived from the note's folder or name. Do not assume it exists.
- Fields in frontmatter or the body never override the `file` object keys.

---

## 6. QUERY BLOCK FORMATS

### DQL blocks (default on)

Multi-line queries in a fenced block with language `dataview`.

````markdown
```dataview
TABLE file.mtime, status
FROM "Journal"
SORT file.mtime DESC
LIMIT 10
```
````

### Inline DQL expressions (default on)

A single-line block or inline text starting with the `=` prefix.

````markdown
```dataview
= file.mtime
```
````

### Inline JavaScript expressions (default off)

A single-line block or inline text starting with the `$=` prefix. Requires `enableInlineDataviewJs`.

````markdown
```dataview
$= dv.current().file.name
```
````

### DataviewJS blocks (default off)

A fenced block with language `dataviewjs`. Requires `enableDataviewJs`. The API object is `dv`.

````markdown
```dataviewjs
dv.list(dv.pages('"Journal"').map(p => p.file.link))
```
````

- Verified API methods in the installed build: `dv.pages(query)`, `dv.current()`, `dv.list(...)`, `dv.table(...)`, `dv.taskList(tasks, groupByFile)`.
- Full API semantics beyond these methods: VERIFY against the official documentation before writing a copyable example.

---

## 7. DQL GRAMMAR

The parser grammar below was verified in the installed `main.js`.

### View types

A query starts with exactly one of these, case-insensitive:

| View | Output |
| --- | --- |
| `TABLE` | Columnar table. `AS` names a column |
| `LIST` | Bullet list of matching notes |
| `TASK` | Task list from matching notes |
| `CALENDAR` | Calendar grid keyed by a date field |

### FROM sources

| Source | Syntax | Meaning |
| --- | --- | --- |
| Folder | `FROM "Journal"` | Notes in that folder |
| Tag | `FROM #project` | Notes with that tag |
| Link | `FROM [[note]]` | Notes linked to that note |
| File | `FROM "path/to/note"` | A specific note |
| Outgoing | `FROM outgoing([[note]])` | Notes that note links to |
| Incoming | `FROM incoming([[note]])` | Notes linking to that note |

### Clauses

| Clause | Role |
| --- | --- |
| `WHERE` | Filters rows with a boolean expression |
| `SORT` | Orders rows. Append `ASC` or `DESC` |
| `GROUP BY` | Groups rows by an expression |
| `FLATTEN` | Expands array values into rows |
| `LIMIT` | Caps the row count |
| `AS` | Names a computed column or field |

### Minimal valid examples

````markdown
```dataview
TABLE status
FROM "Projects"
WHERE contains(status, "active")
```
````

````markdown
```dataview
LIST
FROM #project
```
````

````markdown
```dataview
TASK
FROM "Journal"
```
````

````markdown
```dataview
CALENDAR file.day
FROM "Journal"
```
````

````markdown
```dataview
LIST
FROM "Notes"
GROUP BY file.folder
```
````

````markdown
```dataview
TABLE tags
FROM "Notes"
FLATTEN tags
```
````

---

## 8. VERIFIED FUNCTION SUBSET

Each function below exists in the installed `main.js`. Signatures follow the official documentation. Keep examples minimal and test them against real notes before promising output.

| Function | Minimal usage | Purpose |
| --- | --- | --- |
| `contains(...)` | `contains(status, "active")` | Tests a list or string for a value |
| `date(...)` | `date(file.mtime)` | Parses a date or datetime |
| `default(...)` | `default(amount, 0)` | Fallback for null values |
| `choice(...)` | `choice(completed, "done", "open")` | Picks a value from a boolean |
| `link(...)` | `link(file.path)` | Builds a link |
| `length(...)` | `length(tags)` | Size of a list or string |
| `lower(...)` | `lower(file.name)` | Lowercases a string |
| `replace(...)` | `replace(file.name, "-", " ")` | String replacement |
| `round(...)` | `round(amount, 2)` | Numeric rounding |
| `split(...)` | `split(tags, ",")` | Splits a string into a list |
| `sum(...)` | `sum(rows.amount)` | Sums a list of numbers |
| `duration(...)` | `duration(file.mtime - file.ctime)` | Computes a duration |
| `number(...)` | `number("42")` | Converts to a number |
| `string(...)` | `string(amount)` | Converts to a string |
| `striptime(...)` | `striptime(file.mtime)` | Drops the time part of a datetime |
| `regexreplace(...)` | `regexreplace(file.name, "[0-9]+", "")` | Regex replacement |
| `startswith(...)` | `startswith(file.name, "log-")` | Prefix test |
| `endswith(...)` | `endswith(file.name, ".md")` | Suffix test |
| `any(...)` | `any(tags, (t) => startswith(t, "#a"))` | True if any item matches |
| `all(...)` | `all(tags, (t) => t)` | True if every item matches |
| `min(...)` / `max(...)` | `min(rows.amount)` | Extrema over a list |
| `average(...)` | `average(rows.amount)` | Mean over a list |
| `total(...)` | `total(rows.amount)` | Sum over a list |

---

## 9. WHAT THE AI MUST NOT DO

- Never invent query syntax or function names. Every example in this file is verified. Anything unverified is marked `VERIFY`.
- Never claim a query rendered. Rendering happens in-app. The AI validates the block and the data, then asks for a reload.
- Never rewrite user notes casually. Metadata additions are append-first. Edits preserve everything else in the note.
- Never replace `data.json` wholesale unless restoring the documented defaults after a backup.
- Never promise `file.day` exists. It is conditional on note structure.
- Never fabricate results. If a query cannot be evaluated from the files on disk, say so and mark the gap.
