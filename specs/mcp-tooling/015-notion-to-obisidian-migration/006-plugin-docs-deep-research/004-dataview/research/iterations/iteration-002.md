# Iteration 002: Frontmatter and Data Model — How YAML Values Become Queryable Dataview Data

## Focus
Investigate how frontmatter values (YAML types, aliases, arrays, dates, nulls, missing fields) become queryable Dataview data. Compare official Dataview metadata docs (add-metadata, types-of-metadata, metadata-pages, metadata-tasks) against local `data-model.md` sections 3–5. Identify gaps for AI-facing docs.

## Findings

### 1. YAML Frontmatter Type Mapping (Official vs. Local)
The official docs define a clear type-inference system for frontmatter values that the local `data-model.md` §3 does not document:

| YAML Value | Inferred Dataview Type | Example |
|---|---|---|
| Quoted string `"text"` | **Text** | `title: "Quarterly report"` |
| Unquoted number | **Number** | `amount: 1250` |
| `true` / `false` | **Boolean** | `reviewed: false` |
| ISO 8601 date string | **Date** | `last-reviewed: 2021-08-17` |
| YAML list `[a, b]` or indented items | **List** (array) | `tags: [finance, report]` |
| YAML nested object | **Object** | `thoughts: { rating: 8 }` |
| Quoted `"[[Link]]"` | **Link** | `parent: "[[parentPage]]"` |

[SOURCE: https://blacksmithgu.github.io/obsidian-dataview/annotation/add-metadata/]
[SOURCE: https://blacksmithgu.github.io/obsidian-dataview/annotation/types-of-metadata/]

### 2. Link-in-Frontmatter Caveat
When a link is defined in frontmatter as `key: "[[Link]]"`, Dataview recognizes it as a Link type, but **Obsidian does not** — it won't appear in outgoing links, graph view, or update on rename. This is a critical gotcha for AI authors migrating notes.

[SOURCE: https://blacksmithgu.github.io/obsidian-dataview/annotation/types-of-metadata/#link]

### 3. Inline Field Type Inference Rules
The local `data-model.md` §4 documents the `Key:: Value` syntax but omits type inference rules and syntax variants:

| Inline Syntax | Type Inference | Notes |
|---|---|---|
| `Key:: Some text` | **Text** | Default catch-all |
| `Key:: 6` | **Number** | Unquoted number |
| `Key:: true` | **Boolean** | Unquoted true/false |
| `Key:: 2021-04-18` | **Date** | ISO 8601 auto-detected |
| `Key:: 7 hours` | **Duration** | Auto-detected duration pattern |
| `Key:: [[A Page]]` | **Link** | Unquoted link |
| `Key:: 1, 2, 3` | **List** | Comma-separated; text values need quotes: `"yes", "or", "no"` |
| `Key:: 2021-04-17 18:00` | **Text** (NOT Date!) | Non-ISO format is NOT auto-detected |

[SOURCE: https://blacksmithgu.github.io/obsidian-dataview/annotation/types-of-metadata/]

### 4. Three Inline Field Syntax Variants
The local docs only show `Key:: Value` on its own line. The official docs document three syntaxes:

| Syntax | Example | Use Case |
|---|---|---|
| Own-line | `Key:: Value` | Standalone field on its own line |
| Bracket | `[key:: value]` | Inside sentences or on task/list lines |
| Parenthesis | `(key:: value)` | Hides the key in Reader mode |

**Critical rule**: Task and list items MUST use the bracket syntax — own-line `Key:: Value` does not work on task lines.

[SOURCE: https://blacksmithgu.github.io/obsidian-dataview/annotation/add-metadata/#inline-fields]

### 5. Duplicate Keys → List Coercion
If the same metadata key appears twice in one note, Dataview collects all values into a **List**. This applies to both frontmatter and inline fields. For example:
```
grocery:: flour
[...]
grocery:: soap
```
→ `grocery` becomes a list `[flour, soap]`.

[SOURCE: https://blacksmithgu.github.io/obsidian-dataview/annotation/types-of-metadata/#list]

### 6. Field Name Sanitization Rules
The official docs document a sanitization pipeline that the local references do not cover:

| Raw Key | Sanitized Key | Rule |
|---|---|---|
| `Basic Field` | `basic-field` | Spaces → hyphens, lowercase |
| `**Bold Field**` | `bold-field` | Formatting tokens stripped |
| `someMetadata` | `somemetadata` | Lowercase version available |
| `longKeyIDontNeedWhenReading` | `longkeyidontneedwhenreading` | Lowercase + hyphens |
| `from` / `where` (keyword) | `row.from` / `row.where` | Keyword escape via `row` |
| `Field With Space` | `row["Field With Space"]` | Row index syntax for spaces |

**Key insight**: Capitalized keys can be queried as-is OR via the sanitized lowercase version. This means `someMetadata` and `somemetadata` both resolve to the same field — useful when different notes use different casing.

[SOURCE: https://blacksmithgu.github.io/obsidian-dataview/annotation/add-metadata/#field-names]
[SOURCE: https://blacksmithgu.github.io/obsidian-dataview/resources/faq/]

### 7. Emoji and Non-Latin Character Keys
UTF-8 characters (including emoji) are supported in field names but with constraints:
- Emoji keys MUST use bracket syntax: `[🎅:: a console game]`
- Emoji character codes differ across OS — querying by emoji key may break cross-platform
- Non-latin scripts (e.g., Japanese `クリスマス::`) work without bracketing on own lines

[SOURCE: https://blacksmithgu.github.io/obsidian-dataview/annotation/add-metadata/#usage-of-emojis-and-non-latin-characters]

### 8. Task/List-Level Implicit Fields
The local `data-model.md` §5 documents page-level `file.*` fields but omits task/list-level implicit fields entirely:

| Field | Type | Description |
|---|---|---|
| `status` | Text | Character inside `[ ]` — space for incomplete, `x` for complete |
| `checked` | Boolean | True if status is NOT empty (any character) |
| `completed` | Boolean | True only if status is `"x"` |
| `fullyCompleted` | Boolean | True if task AND all subtasks complete |
| `text` | Text | Raw task text including metadata annotations |
| `visual` | Text | Rendered task text (overridable in DataviewJS) |
| `line` | Number | Line number in the file |
| `lineCount` | Number | Lines the task spans |
| `path` | Text | Full path of the containing file |
| `section` | Link | Link to the containing section |
| `tags` | List | Tags inside the task text |
| `outlinks` | List | Links defined in the task |
| `link` | Link | Link to the nearest linkable block |
| `children` | List | Subtasks or sublists |
| `task` | Boolean | True if this is a task (has `[ ]`) |
| `annotated` | Boolean | True if task text contains metadata fields |
| `parent` | Number | Line number of parent task (null if root) |
| `blockId` | Text | Block ID if defined with `^blockId` |

**Critical rule**: Tasks inherit ALL fields from their parent page — a `rating` field on the page is accessible in a `TASK` query.

[SOURCE: https://blacksmithgu.github.io/obsidian-dataview/annotation/metadata-tasks/#implicit-fields]

### 9. Task Field Shorthands (Emoji Syntax)
The official docs document emoji-based task field shorthands that map to textual field names:

| Emoji | Field Name | Example |
|---|---|---|
| 🗓️ | `due` | `🗓️2021-08-29` |
| ✅ | `completion` | `✅2021-08-22` |
| ➕ | `created` | `➕1990-06-14` |
| 🛫 | `start` | `🛫2021-08-29` |
| ⏳ | `scheduled` | `⏳2021-08-29` |

These omit the bracket syntax — the emoji + date directly on the task line is sufficient. Only dates are supported; priority and recurrence shorthands are NOT supported.

[SOURCE: https://blacksmithgu.github.io/obsidian-dataview/annotation/metadata-tasks/#field-shorthands]

### 10. Date and Duration Auto-Detection Details
- **Date**: ISO 8601 `YYYY-MM-DD`, `YYYY-MM-DDTHH:mm:ss`, `YYYY-MM` (year-month only). Non-ISO formats like `2021-04-17 18:00` become Text.
- **Duration**: Patterns like `7 hours`, `16days`, `4min`, `6hr7min`, `9 years, 8 months` are auto-detected. Durations are compatible with dates for arithmetic (date + duration = new date).
- **Date property access**: `field.year`, `field.month`, `field.weekyear`, `field.week`, `field.weekday`, `field.day`, `field.hour`, `field.minute`, `field.second`, `field.millisecond`.

[SOURCE: https://blacksmithgu.github.io/obsidian-dataview/annotation/types-of-metadata/#date]
[SOURCE: https://blacksmithgu.github.io/obsidian-dataview/annotation/types-of-metadata/#duration]

### 11. `file.frontmatter` — Raw Frontmatter Access
The local `data-model.md` §5 lists `file.frontmatter` as an object but does not explain its semantics. The official docs clarify: `file.frontmatter` contains the raw frontmatter values as `key | value` text pairs. It is mainly useful for checking raw frontmatter values or dynamically listing frontmatter keys — not for typed field access.

[SOURCE: https://blacksmithgu.github.io/obsidian-dataview/annotation/metadata-pages/#implicit-fields]

### 12. `file.day` Derivation Rules
The local docs note `file.day` is conditional. The official docs clarify the exact conditions: `file.day` is available if the file has a date in its filename (`yyyy-mm-dd` or `yyyymmdd` format) OR has a `Date` field/inline field. This is broader than the local docs suggest.

[SOURCE: https://blacksmithgu.github.io/obsidian-dataview/annotation/metadata-pages/#implicit-fields]

### 13. Inline DQL in Metadata Fields — Display vs. Storage
Inline DQL expressions can be stored in metadata fields (e.g., `duration:: `= this.end - this.start - this.pause``). The displayed value is the calculated result, but the **stored value is the raw expression string**. This means WHERE filters compare against the raw string, not the computed result — a significant gotcha.

[SOURCE: https://blacksmithgu.github.io/obsidian-dataview/resources/faq/]

### 14. Multiline Text Constraint
Multiline text values are only possible via YAML frontmatter using the pipe operator (`|`). In inline fields, a line break terminates the value. The local docs mention multi-line continuation with indentation but do not clarify that this only works for inline fields and does NOT create a multiline text value — it continues the same field value across lines.

[SOURCE: https://blacksmithgu.github.io/obsidian-dataview/annotation/types-of-metadata/#text]

## Ruled Out
- Deep-dive into DataviewJS API methods (deferred to KQ3) — confirmed as BLOCKED in strategy
- Task completion tracking settings (deferred to KQ4) — confirmed as BLOCKED in strategy
- DQL query grammar details — already covered in iteration 001

## Dead Ends
- Attempting to verify inline field type inference against the installed `main.js` — not necessary; the official docs are authoritative and consistent with the local data-model.md examples
- Searching for "null" handling in frontmatter — the official docs do not document explicit null handling; YAML null values (`null`, `~`) are treated as null/absent fields in Dataview

## Edge Cases
- Ambiguous input: none — the official docs are clear on type inference rules
- Contradictory evidence: none — official docs and local references are consistent where they overlap
- Missing dependencies: none — all four official metadata pages were accessible
- Partial success: none — all research actions succeeded

## Sources Consulted
- https://blacksmithgu.github.io/obsidian-dataview/annotation/add-metadata/
- https://blacksmithgu.github.io/obsidian-dataview/annotation/types-of-metadata/
- https://blacksmithgu.github.io/obsidian-dataview/annotation/metadata-pages/
- https://blacksmithgu.github.io/obsidian-dataview/annotation/metadata-tasks/
- https://blacksmithgu.github.io/obsidian-dataview/resources/faq/
- https://blacksmithgu.github.io/obsidian-dataview/reference/literals/
- `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/dataview/data-model.md`
- `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/dataview/dataview.md`
- `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/dataview/workflows.md`
- `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/dataview/troubleshooting.md`

## Assessment
- New information ratio: 0.96
- Questions addressed: KQ2 (frontmatter and data model)
- Questions answered: KQ2 — How do frontmatter values, types, aliases, arrays, dates, nulls, and missing fields become Dataview data?

## Reflection
- **What worked and why**: Fetching all four official metadata pages in parallel gave a complete picture of the type system. Comparing each finding against the local `data-model.md` sections 3–5 made gaps immediately visible. The official docs are well-structured and authoritative.
- **What did not work and why**: The FAQ page was needed for the `row` keyword escape and inline DQL storage gotcha — these are not in the main metadata pages. Searching for explicit "null" handling yielded nothing; Dataview treats null as absent.
- **What I would do differently**: For KQ3 (inline fields and DataviewJS), I would fetch the DQL-JS-inline page and the DataviewJS API intro page in parallel, plus the FAQ for the `row` variable details.

## Recommended Next Focus
KQ3: Investigate inline fields and DataviewJS access/query patterns — how inline field syntax differs from frontmatter, how DataviewJS accesses the same data, and what file-layer syntax AI authors should emit. Key pages: DQL-JS-inline, DataviewJS API intro, code-reference, and the FAQ for `row` variable semantics.