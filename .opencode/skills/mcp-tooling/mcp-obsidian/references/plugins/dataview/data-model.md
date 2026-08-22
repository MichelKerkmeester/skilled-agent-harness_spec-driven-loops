---
title: "Dataview File-Layer Data Model"
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
version: "0.10.0.0"
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

### Type mapping (how Dataview reads a frontmatter value)

| YAML value | Dataview type |
| --- | --- |
| `"quoted"` | Text |
| unquoted number (`70`) | Number |
| `true` / `false` | Boolean |
| ISO date (`2026-06-30`) | Date |
| a YAML list | List |
| nested map | Object |
| quoted `"[[Link]]"` | Link |

- **ISO-8601 auto-detection.** A value matching `YYYY-MM-DD`, `YYYY-MM-DDTHH:mm:ss` or `YYYY-MM` is parsed as a Date automatically. A **non-ISO** date such as `2026-04-17 18:00` becomes **Text**, which silently breaks date math — normalize migrated dates to ISO.
- **Link caveat.** A quoted `"[[Link]]"` in frontmatter is a Dataview Link but **not** an Obsidian link: it creates no graph edge and is not rename-propagated. Use it for querying, not for the graph.

---

## 4. METADATA LAYER: INLINE FIELDS

Inline fields live in the note body. The parser splits on the `::` separator, so the key is the text before it and the value is the text after it.

```markdown
Author:: Ada Lovelace
Due:: 2026-06-30
Progress:: 70
```

- The key is trimmed, the value is trimmed.
- An inline field value is terminated by the line break — it is single-line. To store multi-line text, use a YAML frontmatter field with the pipe (`|`) block scalar instead; indenting a continuation line does **not** extend an inline value.
- Inline fields merge with frontmatter fields into one field space. A plain query references the field name without any prefix.
- `prettyRenderInlineFields` controls how the raw `Key:: Value` text displays in reading view.
- The same key in frontmatter and inline body is ambiguous. Keep one source per key to avoid confusion.

### The three inline syntaxes

| Syntax | Where | Notes |
| --- | --- | --- |
| `Key:: Value` | own line | the plain form; does **not** attach to a task or list item |
| `[key:: value]` | inline, brackets | key stays visible; **required** to add a field to a task or list item |
| `(key:: value)` | inline, parens | key hidden in Reader view |

### Type inference

Inline values are typed exactly like frontmatter: quoted → Text, unquoted number → Number, `true`/`false` → Boolean, ISO date → Date, `dur(...)`-shaped → Duration, `[[Link]]` → Link, comma list → List. A **non-ISO** date becomes Text.

### Field-name sanitization

Field names are normalized: spaces and punctuation → lowercase-hyphenated, formatting tokens stripped, and a capitalized key also gets a lowercase alias. A migrated `Due Date` is queryable as `due-date`, and `Due` resolves as `due` — names do not match naively, so sanitize when querying.

### Reaching reserved-word or spaced fields

Use bracket access for a reserved word or a spaced/awkward name: `row["keyword"]`, `row['Field With Space']`.

### Duplicate keys

The same key twice in one note collects into a **List** — Dataview does not keep only the last value.

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
| `file.frontmatter` | object | Raw frontmatter as key/value text pairs — for raw-value checks, not typed access (query the field by name for a typed value) |
| `file.day` | date | Derived day, present only when the note structure yields one |

- `file.day` appears when a date can be derived from the note: its filename contains a date (`yyyy-mm-dd` / `yyyymmdd`), **or** the note has a Date field. (The exact "folder vs filename" trigger for the name case is not confirmed against the official docs — do not rely on a folder-name trigger.) Do not assume it exists.
- Fields in frontmatter or the body never override the `file` object keys.

### Task and list implicit fields

Each item in `file.tasks` / `file.lists` exposes 18 fields: `status`, `checked`, `completed`, `fullyCompleted`, `text`, `visual`, `line`, `lineCount`, `path`, `section`, `tags`, `outlinks`, `link`, `children`, `task`, `annotated`, `parent`, `blockId`. A task also **inherits every page-level field** of its note, so a page's `project` is queryable on its tasks.

**Emoji task-date shorthands** (dates only, no bracket needed): 🗓️ → `due`, ✅ → `completion`, ➕ → `created`, 🛫 → `start`, ⏳ → `scheduled`.

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

### DataviewJS API surface

The `dv` object exposes ~30+ methods across the groups below (default-off; `enableDataviewJs` required). Signatures follow the official `api/code-reference` and `api/data-array` docs.

- **Query** — `dv.pages(source)` (source is a string; folders must be **double-quoted inside** it: `dv.pages('"Folder"')`), `dv.pagePaths(source)`, `dv.page(path)` (auto-resolves link + extension), `dv.current()`.
- **Render** — `dv.header(level, text)`, `dv.paragraph(text)`, `dv.span(text)`, `dv.el(tag, text)`, `dv.execute(dql)`, `dv.executeJs(code)`, `dv.view(path, input)`, `dv.list(items)`, `dv.table(headers, rows)`, `dv.taskList(tasks, groupByFile)`.
- **Markdown-string** — `dv.markdownTable(headers, rows)`, `dv.markdownList(items)`, `dv.markdownTaskList(tasks)` (return a string instead of rendering).
- **Utility** — `dv.fileLink(path)`, `dv.sectionLink(...)`, `dv.blockLink(...)`, `dv.date(text)`, `dv.duration(text)`, `dv.compare(a, b)`, `dv.equal(a, b)`, `dv.clone(value)`, `dv.parse(value)`, `dv.array(value)`, `dv.isArray(value)`.
- **Query-evaluation** — `dv.query(dql)`, `dv.tryQuery(dql)`, `dv.queryMarkdown(dql)`, `dv.evaluate(expr)`, `dv.tryEvaluate(expr)` → a `Result` `{ successful, value | error }`.
- **DataArray** — the immutable proxied array `dv.pages(...)` returns: `.where(fn)`, `.map(fn)`, `.sort(fn)`, `.groupBy(fn)`, `.distinct()`, `.sum()`, `.avg()`, `.limit(n)`, `.first()`, … plus **field swizzling** (`array.field` collects that field across every element).
- **File-I/O** (async — `await`) — `dv.io.csv(path)`, `dv.io.load(path)`, `dv.io.normalize(path)`.

### Inline DQL vs inline JS semantics

- Inline DQL `` `= expr` `` renders exactly **one** value blended into the surrounding text; `this.` means the current page, `[[page]].` another page. It supports expressions and functions but **not** Query Types or Data Commands (`WHERE` / `SORT` / `GROUP BY` / `FLATTEN` / `LIMIT`).
- Inline JS `` `$= code` `` uses `dv.current()` as the analog of `this.` and **can** reach multiple pages.

> The `dv.pages`/`dv.current`/`dv.list`/`dv.table`/`dv.taskList` core five are verified in the installed `main.js`; the fuller surface above follows the official Dataview API docs — confirm an uncommon method against those docs before shipping a production example.

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

### Grammar details and correctness rules

- **FROM is zero-or-one and must immediately follow the Query Type.** A query has at most one `FROM`.
- **Data commands run in written order** (see `workflows.md` §2) — `FLATTEN` before vs after `WHERE` changes the result, and a command may repeat.
- **`WITHOUT ID`** (LIST + TABLE) drops the default id/link column.
- **Source operators**: negate with `-` (`FROM -#archive`), group with parentheses, and use `[[]]` as shorthand for the current file.
- **`SORT`** takes multiple fields: `SORT a ASC, b DESC`.
- **`GROUP BY`** yields `key` + `rows`, and `rows.field` **swizzles** that field across the group.
- **`FLATTEN expr AS name`** names the expanded value.
- **`TASK`** operates at task level (child tasks inherit a parent match) and is the only DQL type that **writes files** (checkbox toggles).
- **`CALENDAR`** requires a date field; `SORT` / `GROUP BY` have no effect on it.

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

### Expressions and literals

DQL expressions support arithmetic, comparisons, string operations, list/object indexing, and lambdas (`(x) => …`). Literals include:

- **Date shorthands**: `date(today)`, `date(now)`, `date(sow)` (start of week), `date(eom)` (end of month), and similar.
- **Duration aliases**: `dur(1 day)`, `dur(2 hours 30 mins)`, `dur(1 h)`.
- **Date property access**: `date(...).year` / `.month` / `.weekday` / `.day`.

---

## 9. WHAT THE AI MUST NOT DO

- Never invent query syntax or function names. Every example in this file is verified. Anything unverified is marked `VERIFY`.
- Never claim a query rendered. Rendering happens in-app. The AI validates the block and the data, then asks for a reload.
- Never rewrite user notes casually. Metadata additions are append-first. Edits preserve everything else in the note.
- Never replace `data.json` wholesale unless restoring the documented defaults after a backup.
- Never promise `file.day` exists. It is conditional on note structure.
- Never fabricate results. If a query cannot be evaluated from the files on disk, say so and mark the gap.
