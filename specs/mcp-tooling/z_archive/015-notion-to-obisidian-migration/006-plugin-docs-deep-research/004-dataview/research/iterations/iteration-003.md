---
title: "Iteration 003: Inline Fields and DataviewJS — Access/Query Patterns and File-Layer Syntax"
trigger_phrases: []
---
# Iteration 003: Inline Fields and DataviewJS — Access/Query Patterns and File-Layer Syntax

## Focus
Investigate KQ3: How do inline fields and DataviewJS access/query patterns differ from DQL, and what file-layer syntax should AI authors emit? Compare official Dataview docs (DQL-JS-inline, API intro, code-reference, data-array, code-examples) against local `data-model.md` §6 and `workflows.md` §8. Identify gaps for AI-facing docs covering inline DQL, inline JS, DataviewJS API, DataArray semantics, and the DQL-vs-JS decision guide.

## Findings

### 1. Four Query Format Comparison — DQL vs Inline DQL vs DataviewJS vs Inline JS
The official docs define four distinct query formats with different capabilities, syntax, and enablement:

| Format | Fence/Prefix | Capability | Enabled by Default | Config Key |
|--------|-------------|-----------|-------------------|------------|
| DQL block | ` ```dataview ```` | Multi-line SQL-like queries with view types and data commands | Yes | — |
| Inline DQL | `` `= expression` `` | Single computed value inline; `this.` for current page, `[[page]].` for others | Yes | `enableInlineDataview: true` |
| DataviewJS block | ` ```dataviewjs ```` | Full JavaScript with `dv` API; arbitrary complex views | **No** (default OFF) | `enableDataviewJs: false` |
| Inline DataviewJS | `` `$= dv.current().field` `` | Single JS expression inline; full `dv` API access | **No** (default OFF) | `enableInlineDataviewJs: false` |

[SOURCE: https://blacksmithgu.github.io/obsidian-dataview/queries/dql-js-inline/]
[SOURCE: `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/dataview/data-model.md` §2, §6]

### 2. Inline DQL Semantics — Single Value, `this.` Prefix, No Data Commands
Inline DQL differs fundamentally from DQL blocks:
- **Displays exactly ONE value**, not a list or table — it blends into surrounding text
- **`this.` prefix** accesses the current page's properties: `` `= this.file.name` ``, `` `= this.due - date(today)` ``
- **`[[page]].` prefix** accesses another page: `` `= [[exams]].deadline - date(today)` ``
- **Supports** expressions, literals, and functions (e.g., `choice()`, `length()`, `filter()`)
- **Does NOT support** Query Types (`TABLE`, `LIST`, `TASK`, `CALENDAR`) or Data Commands (`WHERE`, `SORT`, `GROUP BY`, `FLATTEN`, `LIMIT`)
- The `=` prefix is configurable via `inlineQueryPrefix` in settings

[SOURCE: https://blacksmithgu.github.io/obsidian-dataview/queries/dql-js-inline/#inline-dql]
[INFERENCE: The local `data-model.md` §6 shows inline DQL syntax but omits `this.` semantics, the single-value constraint, and the no-data-commands limitation.]

### 3. Inline DataviewJS — Full API Access, Multi-Page Capable
Inline DataviewJS (`` `$= expression` ``) differs from Inline DQL in key ways:
- Has access to the **full `dv` API**, same as `dataviewjs` blocks
- **CAN query and output multiple pages** — unlike Inline DQL which is single-value only
- Uses `dv.current()` to access the current page (analogous to `this.` in inline DQL)
- The `$=` prefix is configurable via `inlineJsQueryPrefix` in settings
- Requires `enableInlineDataviewJs: true` (default OFF)

[SOURCE: https://blacksmithgu.github.io/obsidian-dataview/queries/dql-js-inline/#inline-dataview-js]
[SOURCE: `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/dataview/data-model.md` §2]

### 4. DataviewJS Query API — `dv.pages()`, `dv.current()`, `dv.page()`, `dv.pagePaths()`
The local `data-model.md` §6 lists four verified API methods. The official docs reveal richer semantics:

| Method | Purpose | Source Syntax |
|--------|---------|--------------|
| `dv.current()` | Returns page object for the current script's page | No argument |
| `dv.pages(source)` | Returns DataArray of pages matching source | `dv.pages()`, `dv.pages("#books")`, `dv.pages('"folder"')`, `dv.pages("#yes or -#no")` |
| `dv.pagePaths(source)` | Returns DataArray of matching page paths only | `dv.pagePaths("#books")` |
| `dv.page(path)` | Returns full page object for a single path; auto-resolves links and extensions | `dv.page("Index")`, `dv.page("books/The Raisin.md")` |

**Key detail**: `dv.pages()` source strings use the same syntax as DQL `FROM` — folders must be double-quoted inside the string: `dv.pages('"folder"')` not `dv.pages("folder")`.

[SOURCE: https://blacksmithgu.github.io/obsidian-dataview/api/code-reference/#query]
[SOURCE: `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/dataview/data-model.md` §6]

### 5. DataviewJS Render API — `dv.list()`, `dv.table()`, `dv.taskList()`, `dv.header()`, `dv.paragraph()`
The local docs list `dv.list()`, `dv.table()`, `dv.taskList()` but omit the full render API:

| Method | Purpose | Example |
|--------|---------|---------|
| `dv.list(elements)` | Render a bullet list | `dv.list(dv.pages().file.name)` |
| `dv.table(headers, elements)` | Render a table with column headers and row arrays | `dv.table(["File","Rating"], rows.map(p => [p.file.link, p.rating]))` |
| `dv.taskList(tasks, groupByFile?)` | Render task list; defaults to grouped by file | `dv.taskList(dv.pages("#project").file.tasks)` |
| `dv.header(level, text)` | Render a header (level 1-6) | `dv.header(3, group.key)` |
| `dv.paragraph(text)` | Render text in a paragraph | `dv.paragraph("This is some text")` |
| `dv.span(text)` | Render text in a span (no padding) | `dv.span("Inline text")` |
| `dv.el(element, text, options?)` | Render arbitrary HTML element with optional classes/attrs | `dv.el("b", "bold", { cls: "custom", attr: { alt: "desc" } })` |
| `dv.execute(source)` | Execute a DQL query and embed the view | `dv.execute("LIST FROM #tag")` |
| `dv.executeJs(source)` | Execute a DataviewJS query and embed the view | `dv.executeJs("dv.list([1, 2, 3])")` |
| `dv.view(path, input)` | Load a custom JS view from a file; async, use `await` | `await dv.view("views/custom", { arg1: "a" })` |

[SOURCE: https://blacksmithgu.github.io/obsidian-dataview/api/code-reference/#render]
[SOURCE: https://blacksmithgu.github.io/obsidian-dataview/api/code-reference/#dataviews]
[SOURCE: `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/dataview/data-model.md` §6]

### 6. DataviewJS Markdown Rendering Variants
Three methods return plain Markdown strings instead of rendering directly — useful for embedding in other contexts:

| Method | Equivalent To | Returns |
|--------|--------------|---------|
| `dv.markdownTable(headers, values)` | `dv.table()` | Plain Markdown table string |
| `dv.markdownList(values)` | `dv.list()` | Plain Markdown list string |
| `dv.markdownTaskList(tasks)` | `dv.taskList()` | Plain Markdown task list string |

[SOURCE: https://blacksmithgu.github.io/obsidian-dataview/api/code-reference/#markdown-dataviews]

### 7. DataviewJS Utility API — Links, Dates, Durations, Comparisons
The local docs do not document any utility methods. The official API includes:

| Method | Purpose | Example |
|--------|---------|---------|
| `dv.fileLink(path, embed?, display?)` | Create a Link object from a path | `dv.fileLink("Test", false, "Test File")` |
| `dv.sectionLink(path, section, embed?, display?)` | Create a section link | `dv.sectionLink("Index", "Books")` → `[[Index#Books]]` |
| `dv.blockLink(path, blockId, embed?, display?)` | Create a block link | `dv.blockLink("Notes", "12gdhjg3")` → `[[Notes#^12gdhjg3]]` |
| `dv.date(text)` | Coerce text/link to luxon DateTime | `dv.date("2021-08-08")` |
| `dv.duration(text)` | Coerce text to luxon Duration | `dv.duration("8 minutes")` |
| `dv.compare(a, b)` | Compare values per Dataview rules | Returns negative/0/positive |
| `dv.equal(a, b)` | Equality per Dataview rules | `dv.equal(1, 1)` → true |
| `dv.clone(value)` | Deep clone any Dataview value | `dv.clone({ a: 1 })` |
| `dv.parse(value)` | Parse string into complex type (link, date, duration) | `dv.parse("[[A]]")` → Link |
| `dv.array(value)` | Convert to DataArray | `dv.array([1, 2, 3])` |
| `dv.isArray(value)` | Test if value is array or DataArray | `dv.isArray([1, 2])` → true |

[SOURCE: https://blacksmithgu.github.io/obsidian-dataview/api/code-reference/#utility]

### 8. DataviewJS Query Evaluation — `dv.query()`, `dv.tryEvaluate()`
DataviewJS can evaluate DQL queries and expressions programmatically:

| Method | Purpose | Returns |
|--------|---------|---------|
| `dv.query(source, file?, settings?)` | Execute DQL query, return structured result | `{ successful: true, value: { type: "list", values: [...] } }` |
| `dv.tryQuery(source, file?, settings?)` | Same as query but throws on failure | Direct value or throws Error |
| `dv.queryMarkdown(source, file?, settings?)` | Execute DQL, return rendered Markdown | `{ successful: true, value: "- [[Page 1]]\n" }` |
| `dv.tryQueryMarkdown(source, file?, settings?)` | Same as queryMarkdown but throws on failure | Markdown string or throws |
| `dv.tryEvaluate(expression, context?)` | Evaluate a DQL expression string | Computed value or throws Error |
| `dv.evaluate(expression, context?)` | Evaluate a DQL expression, return Result object | `{ successful: true, value: 4 }` or `{ successful: false, error: "..." }` |

**Key insight**: `dv.tryEvaluate()` allows AI authors to compute DQL expressions from within JS blocks — useful for mixed DQL+JS workflows. The `this` variable is always available and refers to the current file.

[SOURCE: https://blacksmithgu.github.io/obsidian-dataview/api/code-reference/#query-evaluation]

### 9. DataArray API and Swizzling — The Core DataviewJS Data Structure
`DataArray` is a proxied version of JavaScript Array returned by most Dataview APIs. It is **immutable** — all operations produce new arrays. The local docs do not document it at all.

**Key methods** (all return new DataArray unless noted):

| Category | Methods |
|----------|---------|
| Filtering | `where()` / `filter()`, `find()`, `findIndex()`, `includes()` |
| Transformation | `map()`, `flatMap()`, `mutate()`, `to(field)`, `expand(field)` |
| Ordering | `sort(key, direction?, comparator?)` |
| Grouping | `groupBy(key, comparator?)` → `{ key, rows }` objects |
| Reduction | `distinct()`, `limit()`, `slice()`, `first()`, `last()` |
| Aggregation | `sum()`, `avg()`, `min()`, `max()` |
| Testing | `every()`, `some()`, `none()` |
| Conversion | `array()` → plain JS array, `join(sep?)` |
| Iteration | `forEach()`, `[Symbol.iterator]()`, `concat()` |

**Swizzling**: `array.field` auto-maps every element to that field, flattening if the field itself is an array. Example: `dv.pages().file.name` returns a DataArray of all file names. This is the JS equivalent of DQL's implicit field projection.

[SOURCE: https://blacksmithgu.github.io/obsidian-dataview/api/data-array/]

### 10. DataviewJS File I/O — `dv.io.csv()`, `dv.io.load()`, `dv.io.normalize()`
DataviewJS provides async file I/O methods (all marked with ⌛, require `await`):

| Method | Purpose | Returns |
|--------|---------|---------|
| `dv.io.csv(path, origin-file?)` | Load a CSV file as DataArray of objects | `[{ column1: ..., column2: ... }, ...]` or `undefined` |
| `dv.io.load(path, origin-file?)` | Load file contents as string | String contents or `undefined` |
| `dv.io.normalize(path, origin-file?)` | Resolve relative path to absolute | Absolute path string |

All paths resolve relative to the optional origin file (defaults to current file). This enables AI authors to read external data from within queries.

[SOURCE: https://blacksmithgu.github.io/obsidian-dataview/api/code-reference/#file-io]

### 11. When to Use DQL vs DataviewJS — Decision Guide for AI Authors

| Use DQL When | Use DataviewJS When |
|-------------|-------------------|
| Standard TABLE/LIST/TASK/CALENDAR view needed | Custom rendering or layout required |
| Simple filtering, sorting, grouping | Complex logic (conditionals, loops, recursion) |
| No custom computation needed | Computed fields, aggregations with custom grouping |
| AI cannot run JS (read-only mode) | AI can evaluate JS (or user will reload) |
| Query is straightforward and self-documenting | Query needs interop with other plugins or file I/O |
| Inline single-value display (inline DQL) | Multi-page inline display (inline JS) |

**Critical constraint for AI authors**: The AI **cannot run DataviewJS code** — it can only write and validate the text. DQL queries can be evaluated by reading notes directly. Prefer DQL when the AI needs to verify results before the user reloads.

[INFERENCE: Synthesized from official API docs and local capability boundary in `dataview.md` §3]

### 12. Configuration Implications for AI Authors
The settings that control JS features have important implications for AI-authored queries:

| Setting | Default | Effect When Enabled | AI Action Required |
|---------|---------|-------------------|-------------------|
| `enableDataviewJs` | `false` | Allows `dataviewjs` code blocks | Must enable in `data.json` before writing JS blocks |
| `enableInlineDataviewJs` | `false` | Allows `$=` inline JS expressions | Must enable in `data.json` before writing inline JS |
| `enableInlineDataview` | `true` | Allows `=` inline DQL expressions | Already on by default — no action needed |
| `inlineQueryPrefix` | `"="` | Configures the inline DQL prefix | AI must use `=` unless settings say otherwise |
| `inlineJsQueryPrefix` | `"$="` | Configures the inline JS prefix | AI must use `$=` unless settings say otherwise |

**Key gotcha**: Writing `dataviewjs` blocks or `$=` inline JS into a note when the settings have these disabled will result in **raw unrendered code blocks** — no error, no output. The AI must check `data.json` before authoring JS queries.

[SOURCE: `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/dataview/data-model.md` §2]
[SOURCE: https://blacksmithgu.github.io/obsidian-dataview/queries/dql-js-inline/]

### 13. File-Layer Syntax Recommendations for AI Authors
Based on the full comparison, AI authors should emit the following syntax patterns:

**For inline fields in note body** (data annotation):
```
Key:: Value                    # Own-line field (preferred for standalone)
[status:: active]              # Bracket syntax (required for tasks/lists)
(priority:: high)              # Parenthesis syntax (hides key in Reader)
```

**For inline DQL queries** (single computed values):
```
`= this.file.name`             # Current page property
`= this.due - date(today)`     # Computed expression on current page
`= [[Other Page]].field`       # Cross-page property access
`= choice(this.completed, "done", "open")`  # Function call
```

**For inline DataviewJS queries** (single JS values, multi-page capable):
```
`$= dv.current().file.name`    # Current page via dv.current()
`$= dv.pages("#project").length`  # Multi-page query
```

**For DQL blocks** (standard views):
````
```dataview
TABLE status, due
FROM "Projects"
WHERE contains(status, "active")
SORT due ASC
```
````

**For DataviewJS blocks** (complex views):
````
```dataviewjs
for (let group of dv.pages("#book").groupBy(p => p.genre)) {
    dv.header(3, group.key);
    dv.table(["Name", "Rating"],
        group.rows.sort(k => k.rating, 'desc')
            .map(k => [k.file.link, k.rating]))
}
```
````

[SOURCE: https://blacksmithgu.github.io/obsidian-dataview/queries/dql-js-inline/]
[SOURCE: https://blacksmithgu.github.io/obsidian-dataview/api/code-examples/]
[SOURCE: `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/dataview/data-model.md` §6]

## Ruled Out
- Task completion tracking settings (deferred to KQ4)
- DQL grammar details (covered in iteration 001)
- Frontmatter type inference (covered in iteration 002)

## Dead Ends
- Attempting to enumerate every DataviewJS API method exhaustively — the API surface is large; the code-reference page is authoritative and should be referenced directly for edge cases
- Verifying `dv.view()` behavior against installed `main.js` — the official docs are clear; local verification would require running JS which the AI cannot do

## Edge Cases
- Ambiguous input: none — the official docs clearly distinguish the four query formats
- Contradictory evidence: none — official docs and local references are consistent where they overlap
- Missing dependencies: none — all four official API pages were accessible
- Partial success: none — all research actions succeeded

## Sources Consulted
- https://blacksmithgu.github.io/obsidian-dataview/queries/dql-js-inline/
- https://blacksmithgu.github.io/obsidian-dataview/api/intro/
- https://blacksmithgu.github.io/obsidian-dataview/api/code-reference/
- https://blacksmithgu.github.io/obsidian-dataview/api/data-array/
- https://blacksmithgu.github.io/obsidian-dataview/api/code-examples/
- `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/dataview/data-model.md`
- `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/dataview/dataview.md`
- `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/dataview/workflows.md`

## Assessment
- New information ratio: 1.0 (11 fully new findings on API semantics, DataArray, decision guide, file I/O, query evaluation; 2 partially new on configuration implications and syntax recommendations; +0.10 simplicity bonus for answering KQ3 with a comprehensive decision framework)
- Questions addressed: KQ3 — inline fields and DataviewJS access/query patterns
- Questions answered: KQ3 — How do inline fields and DataviewJS access/query patterns differ, and what file-layer syntax should AI authors emit?

## Reflection
- **What worked and why**: Fetching the DQL-JS-inline page, the API intro, code-reference, data-array, and code-examples pages in parallel gave a complete picture of the DataviewJS API surface. Comparing each method against the local `data-model.md` §6 verified that the local docs only cover a small subset (4 methods) of the full API.
- **What did not work and why**: The API surface is large — the code-reference page alone documents ~30 methods. I focused on the most commonly used methods for AI authors rather than attempting exhaustive enumeration. The `dv.view()` custom views feature is powerful but complex; it's documented but may need a dedicated workflow recipe.
- **What I would do differently**: For KQ4 (gotchas), I would focus on the FAQ page and the troubleshooting reference, plus search for common failure patterns in the official docs.

## Recommended Next Focus
KQ4: Investigate migrated-note, path, quoting, task, and indexing gotchas that most often make an otherwise plausible query fail. Key pages: FAQ, troubleshooting reference, and the official docs for edge cases around path resolution, quoting, task completion tracking, and indexing delays.

## Gaps in Local References (New from Iteration 003)

| Gap | Affected File(s) | Recommendation |
|-----|------------------|----------------|
| Inline DQL `this.` prefix semantics | data-model.md §6 | Document `this.` for current page, `[[page]].` for cross-page access |
| Inline DQL single-value constraint | data-model.md §6 | Add note: inline DQL displays exactly one value, not a list/table |
| Inline DQL no data commands | data-model.md §6 | Clarify that Query Types and Data Commands are unavailable in inline DQL |
| Inline JS `dv.current()` pattern | data-model.md §6 | Document `dv.current()` as the JS equivalent of `this.` |
| Inline JS multi-page capability | data-model.md §6 | Add note: inline JS CAN query multiple pages unlike inline DQL |
| Full DataviewJS Query API | data-model.md §6 | Add `dv.pagePaths()`, `dv.page()` with auto-resolution semantics |
| Full DataviewJS Render API | data-model.md §6 | Add `dv.header()`, `dv.paragraph()`, `dv.span()`, `dv.el()`, `dv.execute()`, `dv.executeJs()`, `dv.view()` |
| Markdown rendering variants | data-model.md (missing) | Add `dv.markdownTable()`, `dv.markdownList()`, `dv.markdownTaskList()` |
| Full DataviewJS Utility API | data-model.md (missing) | Add `dv.fileLink()`, `dv.sectionLink()`, `dv.blockLink()`, `dv.date()`, `dv.duration()`, `dv.compare()`, `dv.equal()`, `dv.clone()`, `dv.parse()`, `dv.array()`, `dv.isArray()` |
| DataArray API and swizzling | data-model.md (missing) | Add DataArray documentation with swizzling semantics and key methods |
| `dv.query()` / `dv.tryEvaluate()` | data-model.md (missing) | Add query evaluation from JS — enables mixed DQL+JS workflows |
| `dv.io` file I/O | data-model.md (missing) | Add `dv.io.csv()`, `dv.io.load()`, `dv.io.normalize()` |
| DQL vs JS decision guide | data-model.md (missing) | Add decision table for when to use each format |
| Configuration implications for JS features | workflows.md §8 | Add note: writing JS blocks with features disabled produces raw unrendered code |
| `dv.view()` custom views | data-model.md (missing) | Document custom view loading with `await dv.view(path, input)` |