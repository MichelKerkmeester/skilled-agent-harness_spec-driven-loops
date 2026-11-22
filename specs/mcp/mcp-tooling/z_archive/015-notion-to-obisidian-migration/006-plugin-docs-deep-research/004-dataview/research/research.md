---
title: "Dataview Research Synthesis"
trigger_phrases: []
---
# Dataview Research Synthesis

> Progressive synthesis from deep-research iterations. Each iteration adds verified findings from the official Dataview documentation compared against local mcp-obsidian references. All findings are grounded in the official repository/docs (`blacksmithgu/obsidian-dataview`) and compared against the local `references/plugins/dataview/*` surface. This run is research-only; the shipped docs were read, never modified.

---

## Iteration 001: DQL Query Grammar and Command Patterns

### Key Findings

1. **Query structure**: `QUERY-TYPE <fields> FROM <source> <DATA-COMMAND> <expression> ...` — only Query Type is mandatory. FROM is zero-or-one and must appear immediately after the Query Type. Other data commands can be duplicated in any order and execute in written order.

2. **WITHOUT ID modifier**: Both `LIST` and `TABLE` support `WITHOUT ID` to suppress the default first column. Useful for computed outputs and custom column headers.

3. **Source negation and combining**: Sources support `AND`, `OR`, negation with `-` prefix, and parentheses for grouping. Current file shorthand: `[[]]`. Extension forcing: `"folder/File.md"`.

4. **GROUP BY rows swizzling**: `GROUP BY` yields `key` + `rows` array. `rows.field` auto-extracts that field from every row element.

5. **FLATTEN**: Expands array values into one row per entry. Supports computed expressions with `AS name`.

6. **Expressions and literals**: Arithmetic, comparisons, string ops, list/object indexing, lambdas. Date shorthands (`date(today)`, `date(sow)`, `date(eom)`, etc.). Duration aliases (`dur(1 day)`, `dur(2 hours 30 mins)`).

7. **Field name simplification**: Spaces/punctuation → lowercase with hyphens. Keyword fields accessed via `row["keyword"]`.

8. **TASK task-level semantics**: Operates at task level, not page level. Child tasks inherit parent matching. Only DQL type that modifies files (checking tasks).

9. **CALENDAR constraints**: Requires a date field. SORT and GROUP BY have no effect.

10. **Comparison safety**: `null <= date(today)` returns true. Use `typeof(field) = "date"` for safe type-specific comparisons.

### Gaps in Local References

| Gap | Affected File(s) | Recommendation |
|-----|------------------|----------------|
| FROM ordering constraint (zero-or-one, must follow Query Type) | data-model.md §7, workflows.md §2 | Add ordering rule; correct workflows.md implied fixed order |
| WITHOUT ID modifier | data-model.md §7 | Add to view types table |
| Source negation (`-`), parentheses, `[[]]` shorthand | data-model.md §7 | Expand FROM sources table |
| GROUP BY rows swizzling | data-model.md §7 | Add rows swizzling documentation |
| FLATTEN computed expressions | data-model.md §7 | Add FLATTEN with AS syntax |
| Multiple SORT fields | data-model.md §7 | Add multi-field SORT syntax |
| Expressions and literals | data-model.md (missing section) | Add dedicated expressions/literals section |
| Date shorthands and duration aliases | data-model.md (missing) | Add to function/literal docs |
| Field name simplification rules | data-model.md (missing) | Add normalization rules |
| `row["keyword"]` escape syntax | data-model.md (missing) | Add keyword escape documentation |
| Inline DQL `this.` prefix | data-model.md §6 | Add inline DQL semantics |
| TASK task-level execution | data-model.md §7 | Add task-level semantics note |
| CALENDAR constraints | data-model.md §7 | Add date requirement and SORT/GROUP BY note |
| Null comparison trap | troubleshooting.md §3 | Add `typeof()` safety pattern |

---

## Iteration 002: Frontmatter and Data Model

### Key Findings

1. **YAML Frontmatter Type Mapping**: Quoted strings→Text, unquoted numbers→Number, `true`/`false`→Boolean, ISO dates→Date, YAML lists→List, nested objects→Object, quoted `[[Link]]`→Link.

2. **Link-in-Frontmatter Caveat**: Dataview recognizes quoted `[[Link]]` as Link type, but Obsidian does not — no graph view, no rename updates.

3. **Inline Field Type Inference**: `Key:: Value` auto-detects Text, Number, Boolean, Date (ISO), Duration, Link, List. Non-ISO dates like `2021-04-17 18:00` become Text, not Date.

4. **Three Inline Syntax Variants**: Own-line (`Key:: Value`), bracket (`[key:: value]` for sentences/tasks), parenthesis (`(key:: value)` hides key in Reader). Tasks MUST use bracket syntax.

5. **Duplicate Keys→List Coercion**: Same key twice in one note → Dataview collects all values into a List.

6. **Field Name Sanitization**: Spaces→hyphens+lowercase, formatting tokens stripped, capitalized keys have lowercase alias, keyword escape via `row['keyword']`, space access via `row['Field With Space']`.

7. **Emoji and Non-Latin Keys**: UTF-8 supported; emoji keys MUST use bracket syntax; emoji character codes differ across OS (cross-platform risk).

8. **Task/List-Level Implicit Fields**: 18 fields (status, checked, completed, fullyCompleted, text, visual, line, lineCount, path, section, tags, outlinks, link, children, task, annotated, parent, blockId). Tasks inherit ALL fields from parent page.

9. **Task Field Shorthands (Emoji)**: 🗓️→due, ✅→completion, ➕→created, 🛫→start, ⏳→scheduled. No bracket syntax needed. Only dates supported.

10. **Date/Duration Details**: ISO 8601 auto-detection (YYYY-MM-DD, YYYY-MM-DDTHH:mm:ss, YYYY-MM). Duration patterns like `7 hours`, `16days`, `4min`. Date property access: `.year`, `.month`, `.weekday`, etc.

11. **file.frontmatter Semantics**: Raw frontmatter as key|value text pairs — for checking raw values, not typed access.

12. **file.day Derivation**: Available if filename contains date (yyyy-mm-dd or yyyymmdd) OR note has a Date field — broader than local docs suggest.

13. **Inline DQL Storage Gotcha**: Inline DQL in metadata stores the raw expression string, not the computed result. WHERE filters compare against the raw string.

14. **Multiline Text Constraint**: Only via YAML frontmatter pipe operator (`|`). Inline fields: line break terminates the value.

### Gaps in Local References (New from Iteration 002)

| Gap | Affected File(s) | Recommendation |
|-----|------------------|----------------|
| YAML frontmatter type mapping table | data-model.md §3 | Add type inference table (Text, Number, Boolean, Date, List, Object, Link) |
| Link-in-frontmatter caveat | data-model.md §3 | Add note that Obsidian doesn't treat quoted [[Link]] as native link |
| Inline field type inference rules | data-model.md §4 | Add type inference table for inline fields |
| Three inline syntax variants | data-model.md §4 | Document bracket `[key:: value]` and parenthesis `(key:: value)` syntax |
| Task/list bracket requirement | data-model.md §4, workflows.md §4 | Add rule: tasks MUST use bracket syntax |
| Duplicate keys→list coercion | data-model.md §4 | Add duplicate key behavior documentation |
| Field name sanitization rules | data-model.md (missing) | Add sanitization pipeline (spaces→hyphens, formatting stripped, lowercase alias) |
| Keyword escape via `row` | data-model.md (missing) | Add `row["keyword"]` and `row.keyword` syntax |
| Emoji key constraints | data-model.md (missing) | Add emoji bracket requirement and cross-platform warning |
| Task/list implicit fields (18 fields) | data-model.md §5 | Add task-level implicit fields table |
| Task field shorthands (emoji) | data-model.md (missing) | Add emoji→field-name mapping table |
| Task inheritance of page fields | data-model.md §5 | Add note: tasks inherit all fields from parent page |
| Date auto-detection details | data-model.md §3 | Add ISO 8601 formats and non-ISO→Text gotcha |
| Duration auto-detection patterns | data-model.md (missing) | Add duration pattern recognition rules |
| Date property access (.year, .month, etc.) | data-model.md (missing) | Add date property access documentation |
| `file.frontmatter` semantics | data-model.md §5 | Clarify it returns raw key|value text pairs |
| `file.day` derivation rules | data-model.md §5 | Document filename date AND Date field triggers |
| Inline DQL storage gotcha | data-model.md (missing) | Add warning: stores raw expression, not computed value |
| Multiline text constraint | data-model.md §4 | Clarify inline field line-break termination vs YAML pipe operator |

---

## Iteration 003: Inline Fields and DataviewJS — Access/Query Patterns and File-Layer Syntax

Focus (KQ3): How do inline fields and DataviewJS access/query patterns differ from DQL, and what file-layer syntax should AI authors emit? Official pages consulted: `queries/dql-js-inline/`, `api/intro/`, `api/code-reference/`, `api/data-array/`, `api/code-examples/`, compared against local `data-model.md` §6 and `workflows.md` §8.

### Key Findings

1. **Four query formats, different enablement**: DQL block (` ```dataview ` — on by default); Inline DQL (`` `= expr` `` — on by default, key `enableInlineDataview`); DataviewJS block (` ```dataviewjs ` — **OFF by default**, key `enableDataviewJs`); Inline DataviewJS (`` `$= dv.current().field` `` — **OFF by default**, key `enableInlineDataviewJs`). [SOURCE: dql-js-inline]

2. **Inline DQL semantics**: Displays exactly ONE value (blends into text — not a list/table). `this.` prefix accesses current page (`` `= this.file.name` ``, `` `= this.due - date(today)` ``); `[[page]].` prefix accesses another page. Supports expressions/literals/functions, but NOT Query Types or Data Commands (`WHERE`/`SORT`/`GROUP BY`/`FLATTEN`/`LIMIT`). Prefix configurable via `inlineQueryPrefix`. [SOURCE: dql-js-inline#inline-dql]

3. **Inline DataviewJS**: `` `$= expr` `` has the full `dv` API and CAN query/output multiple pages (unlike inline DQL). Uses `dv.current()` as the analog of `this.`. Prefix configurable via `inlineJsQueryPrefix`; requires `enableInlineDataviewJs: true`. [SOURCE: dql-js-inline#inline-dataview-js]

4. **DataviewJS Query API** (local docs list only 4 methods): `dv.current()` (no arg — current page object); `dv.pages(source)` (DataArray of pages; source uses DQL `FROM` syntax); `dv.pagePaths(source)` (paths only); `dv.page(path)` (single page object; auto-resolves links and extensions). **Key detail**: folders must be double-quoted *inside* the source string — `dv.pages('"folder"')`, not `dv.pages("folder")`. [SOURCE: api/code-reference#query]

5. **DataviewJS Render API** (local docs list only `dv.list`/`dv.table`/`dv.taskList`): also `dv.header(level, text)`, `dv.paragraph(text)`, `dv.span(text)`, `dv.el(element, text, options?)`, `dv.execute(source)` (embed a DQL view), `dv.executeJs(source)`, and `dv.view(path, input)` (async custom view — use `await`). [SOURCE: api/code-reference#render, #dataviews]

6. **Markdown-string render variants**: `dv.markdownTable(headers, values)`, `dv.markdownList(values)`, `dv.markdownTaskList(tasks)` return plain Markdown strings instead of rendering directly. [SOURCE: api/code-reference#markdown-dataviews]

7. **DataviewJS Utility API** (undocumented locally): `dv.fileLink`, `dv.sectionLink`, `dv.blockLink`, `dv.date(text)`, `dv.duration(text)`, `dv.compare(a,b)`, `dv.equal(a,b)`, `dv.clone(value)`, `dv.parse(value)`, `dv.array(value)`, `dv.isArray(value)`. [SOURCE: api/code-reference#utility]

8. **Query evaluation from JS**: `dv.query`, `dv.tryQuery`, `dv.queryMarkdown`, `dv.tryQueryMarkdown`, `dv.evaluate`, `dv.tryEvaluate(expr, context?)`. `dv.tryEvaluate()` lets an author compute DQL expressions inside JS blocks (mixed DQL+JS); `this` is always available (current file). Non-`try` variants return a Result object `{ successful, value | error }`. [SOURCE: api/code-reference#query-evaluation]

9. **DataArray + swizzling**: `DataArray` is a proxied, **immutable** Array returned by most APIs (operations produce new arrays). Methods span filtering (`where`/`filter`, `find`, `includes`), transformation (`map`, `flatMap`, `mutate`, `to`, `expand`), ordering (`sort`), grouping (`groupBy` → `{key, rows}`), reduction (`distinct`, `limit`, `slice`, `first`, `last`), aggregation (`sum`, `avg`, `min`, `max`), testing (`every`/`some`/`none`), conversion (`array`, `join`). **Swizzling**: `array.field` auto-maps every element to that field (flattening array-valued fields) — the JS analog of DQL implicit projection, e.g. `dv.pages().file.name`. [SOURCE: api/data-array]

10. **File I/O** (async, require `await`): `dv.io.csv(path, origin?)` (CSV → DataArray of objects), `dv.io.load(path, origin?)` (file contents string), `dv.io.normalize(path, origin?)` (relative → absolute). Paths resolve relative to the origin file (default: current). [SOURCE: api/code-reference#file-io]

11. **DQL vs DataviewJS decision guide**: Prefer DQL for standard TABLE/LIST/TASK/CALENDAR views, simple filter/sort/group, self-documenting queries, and single-value inline display; use DataviewJS for custom rendering, complex logic, computed/aggregated fields, plugin interop, file I/O, and multi-page inline display. **Critical for AI authors**: the AI cannot *run* DataviewJS — it can only write/validate the text; DQL results can be reasoned about by reading notes. Prefer DQL when the AI must verify results before the user reloads. [INFERENCE: synthesized from API docs + local capability boundary in `dataview.md` §3]

12. **Configuration gotcha**: `enableDataviewJs` and `enableInlineDataviewJs` default to `false`. Writing a `dataviewjs` block or `$=` inline JS while disabled yields **raw unrendered code — no error, no output**. The AI must check `data.json` before authoring any JS query. `enableInlineDataview` (inline DQL) is on by default. [SOURCE: dql-js-inline; local data-model.md §2]

13. **File-layer syntax templates for AI authors**: own-line `Key:: Value` (standalone), `[status:: active]` (required for tasks/lists), `(priority:: high)` (hides key in Reader); inline DQL `` `= this.field` `` / `` `= [[Other]].field` ``; inline JS `` `$= dv.current().file.name` `` / `` `$= dv.pages("#project").length` ``; DQL and DataviewJS fenced blocks per the code-examples page. [SOURCE: dql-js-inline; api/code-examples]

### Gaps in Local References (New from Iteration 003)

| Gap | Affected File(s) | Recommendation |
|-----|------------------|----------------|
| Inline DQL `this.` / `[[page]].` prefix semantics | data-model.md §6 | Document current-page vs cross-page access |
| Inline DQL single-value + no-data-commands constraint | data-model.md §6 | Note that inline DQL shows exactly one value; Query Types/Data Commands unavailable |
| Inline JS `dv.current()` + multi-page capability | data-model.md §6 | Document `dv.current()` as the JS analog of `this.`; note inline JS can query multiple pages |
| Full DataviewJS Query API | data-model.md §6 | Add `dv.pagePaths()`, `dv.page()` auto-resolution; note double-quoted folders in source strings |
| Full DataviewJS Render API | data-model.md §6 | Add `dv.header/paragraph/span/el/execute/executeJs/view` |
| Markdown rendering variants | data-model.md (missing) | Add `dv.markdownTable/markdownList/markdownTaskList` |
| Full DataviewJS Utility API | data-model.md (missing) | Add link/date/duration/compare/equal/clone/parse/array/isArray helpers |
| DataArray API + swizzling | data-model.md (missing) | Add DataArray doc: immutability, key methods, `array.field` swizzling |
| `dv.query()` / `dv.tryEvaluate()` | data-model.md (missing) | Add JS-side query/expression evaluation for mixed DQL+JS |
| `dv.io` file I/O | data-model.md (missing) | Add `dv.io.csv/load/normalize` (async) |
| DQL vs JS decision guide | data-model.md (missing) | Add decision table + the AI-cannot-run-JS constraint |
| Config implications for JS features | workflows.md §8 | Add: JS features disabled → raw unrendered code, no error |
| `dv.view()` custom views | data-model.md (missing) | Document `await dv.view(path, input)` |

---

## Final Synthesis

This section consolidates the three iterations into an implementation-ready picture for anyone updating `references/plugins/dataview/*`. Every recommendation below is research-only; the shipped docs remain unmodified.

### A. Highest-value additions (ranked)

1. **A DataviewJS reference is essentially missing.** Local `data-model.md` §6 documents ~4 API methods; the plugin exposes ~30+ across Query, Render, Markdown, Utility, Query-Evaluation, DataArray, and File-I/O surfaces (iteration 003, findings 4-10). This is the single largest gap. Recommend a dedicated `dataviewjs-api.md` (or a large §6 expansion) organized by those surface groups, each with one worked example.

2. **A frontmatter/inline-field type-inference table.** The type-mapping rules (iteration 002, findings 1-4, 10) are the highest-leverage addition for *migrated* notes, where field types are frequently mis-inferred (see gotchas below). Add both a YAML-frontmatter table and an inline-field table to `data-model.md` §3-§4.

3. **A DQL grammar/ordering correction + expansion.** The FROM ordering constraint, `WITHOUT ID`, source negation/grouping, GROUP BY `rows` swizzling, FLATTEN `AS`, and the expressions/literals + date/duration literal set (iteration 001) fill real holes and correct an implied fixed-order in `workflows.md` §2.

4. **A "four query formats" orientation table** (iteration 003, finding 1) at the top of `data-model.md` — the default-OFF status of both DataviewJS formats is a frequent, silent failure and belongs where an author first looks.

5. **A DQL-vs-DataviewJS decision guide** including the AI-specific constraint that the AI cannot execute JS (iteration 003, finding 11) — steers AI authors toward verifiable DQL by default.

### B. Cross-cutting gotchas most likely to break AI-authored queries against migrated notes

These are consolidated from all three iterations. (Note: a *dedicated* gotchas iteration for KQ4 — FAQ/troubleshooting/path-quoting/indexing deep-dive — did not run; see "Unresolved / VERIFY" below. The list here is what surfaced while answering KQ1-KQ3, not an exhaustive KQ4 sweep.)

1. **JS features silently disabled** — `dataviewjs`/`$=` blocks render as raw code with no error when `enableDataviewJs`/`enableInlineDataviewJs` are off (default). Check `data.json` first. (iter 003 #12)
2. **Non-ISO dates become Text** — `2021-04-17 18:00` (space, no `T`) infers as Text, not Date; date math and date filters then silently fail. Migrated notes often carry non-ISO date strings. (iter 002 #3, #10)
3. **Quoted `[[Link]]` in frontmatter** is a Dataview Link but *not* an Obsidian link — no graph edges, no rename propagation. (iter 002 #2)
4. **Inline DQL stored in metadata keeps the raw expression string**, not the computed value; `WHERE` then compares against the literal text. (iter 002 #13)
5. **Null comparison trap** — `null <= date(today)` returns true, so filters over sparsely-populated (migrated) fields leak rows; guard with `typeof(field) = "date"`. (iter 001 #10)
6. **Folder source strings in DataviewJS must be double-quoted inside the string** — `dv.pages('"folder"')`, not `dv.pages("folder")`. (iter 003 #4)
7. **Field-name sanitization** — spaces/punctuation → lowercase-hyphenated; keyword-named or spaced fields need `row["keyword"]` / `row['Field With Space']`. Migrated field names ("Due Date", "Created At") don't match naively. (iter 001 #7; iter 002 #6)
8. **Tasks/lists require bracket inline syntax** (`[key:: value]`); own-line `Key:: Value` does not attach a field to a task. (iter 002 #4)
9. **Emoji/non-Latin keys** need bracket syntax and carry cross-platform character-code risk. (iter 002 #7)
10. **Inline DQL cannot do Query Types or Data Commands** — a common author error is expecting `` `= WHERE ...` `` to work. (iter 003 #2)

### C. Consolidated recommendation targets by file

- **`data-model.md`**: four-formats table (§2 top); frontmatter + inline-field type tables (§3-§4); three inline syntaxes + task-bracket rule (§4); implicit task fields (18) + emoji shorthands + task inheritance (§5); `file.frontmatter` / `file.day` clarifications (§5); DQL grammar/ordering/`WITHOUT ID`/sources/GROUP BY/FLATTEN/expressions/literals (§7); large DataviewJS API expansion or new `dataviewjs-api.md` (§6).
- **`workflows.md`**: correct implied fixed command order (§2); config-disabled → raw-code note (§8); task bracket requirement (§4).
- **`troubleshooting.md`**: `typeof()` null-comparison safety pattern (§3); ideally absorb the gotcha list in B once a KQ4 sweep confirms/extends it.

### D. Unresolved / VERIFY

- **KQ4 was not completed as a dedicated iteration.** The run's automated reduce/synthesis step stalled after iteration 003 (see provenance). A follow-up iteration should sweep the official **FAQ** and **troubleshooting** pages for: path resolution/quoting rules, task-completion tracking settings, and **indexing-delay** behavior (queries returning stale/empty results right after edits). These are exactly the failure classes most relevant to bulk-migrated notes and are only partially covered by the incidental gotchas in section B.
- **Local `§` anchors are as cited by the iteration agent** against `data-model.md` / `workflows.md` / `troubleshooting.md`. Before editing, confirm each section number still matches the current shipped file (the agent read them this run, but numbering can drift).
- **Inline-field type inference against installed `main.js`** was explicitly ruled out as unnecessary (official docs authoritative and consistent with local examples) — recorded as a resolved non-goal, not a gap.

### E. Sources

Official: `queries/structure`, `queries/dql-js-inline`, `api/intro`, `api/code-reference`, `api/data-array`, `api/code-examples` under `https://blacksmithgu.github.io/obsidian-dataview/`; repo `https://github.com/blacksmithgu/obsidian-dataview`. Local surface compared: `references/plugins/dataview/{data-model.md, dataview.md, workflows.md, troubleshooting.md}`.

---

## Synthesis Provenance

Iterations 001-003 (KQ1-KQ3) were produced by the deep-research workflow's native executor and are the substantive research corpus (three iteration files, ~645 lines, fully sourced). The workflow's automated post-iteration-003 reduce/convergence/synthesis step did not complete: it stalled reproducibly across two executors (DeepSeek v4 Flash and Luna-fast), and a third launch hung at session startup. Because the research content itself was complete and high-quality, the orchestrator performed the final reduction — appending the Iteration 003 section and this Final Synthesis — mechanically from the workflow-generated iteration files, adding no new claims beyond what those files established. KQ4 (a dedicated gotchas/FAQ/indexing sweep) was never dispatched and is flagged as open work in section D.
