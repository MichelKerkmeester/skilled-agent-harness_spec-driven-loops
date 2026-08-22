# Iteration 001: DQL Query Grammar and Command Patterns

## Focus
Investigate the official Dataview Query Language (DQL) grammar — query structure, source forms, command ordering, and query-type semantics — as documented at `https://blacksmithgu.github.io/obsidian-dataview/`. Compare against the local mcp-obsidian Dataview references (`references/plugins/dataview/`) to identify gaps and recommend additions for AI-facing documentation.

## Actions Taken
1. Read all four local Dataview reference files: `dataview.md`, `data-model.md`, `workflows.md`, `troubleshooting.md`
2. Fetched official docs: Query Structure, Query Types, Data Commands, Sources, DQL/JS/Inline overview, Expressions, and Literals pages
3. Compared official grammar against local references section by section
4. Catalogued gaps where local references omit or under-document official behavior

## Findings

### 1. DQL Query Structure and Command Ordering
**Official**: A DQL query follows `QUERY-TYPE <fields> FROM <source> <DATA-COMMAND> <expression> ...`. Only the Query Type is mandatory. FROM is optional (zero or one) and must appear immediately after the Query Type. All other data commands (WHERE, SORT, GROUP BY, FLATTEN, LIMIT) can appear multiple times in any order after the Query Type (and FROM, if present). Commands execute in the order they are written.
[SOURCE: https://blacksmithgu.github.io/obsidian-dataview/queries/structure/]
[SOURCE: https://blacksmithgu.github.io/obsidian-dataview/queries/data-commands/]

**Local refs**: `data-model.md` §7 lists the clauses but does not document the ordering constraint (FROM must come right after Query Type, other commands can be duplicated in any order). `workflows.md` §2 shows a fixed order (WHERE → SORT → GROUP BY → FLATTEN → LIMIT) that implies a required sequence, which is incorrect.

**Gap**: Local refs should document that FROM is zero-or-one and position-constrained, while other data commands are order-flexible and repeatable.

### 2. Query Types — WITHOUT ID Modifier
**Official**: Both `LIST` and `TABLE` support a `WITHOUT ID` modifier that suppresses the default first column (file link for LIST, File column for TABLE). `LIST WITHOUT ID` requires an additional info field to be meaningful. `TABLE WITHOUT ID` lets you rename the first column by using `file.link AS "Custom Name"`.
[SOURCE: https://blacksmithgu.github.io/obsidian-dataview/queries/query-types/]

**Local refs**: `data-model.md` §7 lists the four view types but does not mention `WITHOUT ID` at all.

**Gap**: Add `WITHOUT ID` modifier to the view types table.

### 3. Source Forms — Negation and Combining
**Official**: Sources support `AND`, `OR`, and negation with `-` prefix (e.g., `#tag and -"folder"`). Parentheses group complex combinations: `(#tag1 or #tag2) and (#tag3 or #tag4)`. The current file can be referenced as `[[]]` or `[[#]]`. Specific files can be forced with extension: `"folder/File.md"`.
[SOURCE: https://blacksmithgu.github.io/obsidian-dataview/reference/sources/]

**Local refs**: `data-model.md` §7 lists source types but omits negation (`-`), parentheses, the `[[]]` shorthand, and the `.md` extension disambiguation.

**Gap**: Add negation, parentheses, current-file shorthand, and extension-forcing to the FROM sources table.

### 4. Data Commands — Full Semantics
**Official**:
- **WHERE**: Boolean expression filter. Type mismatches cause unexpected results (null comparisons). Use `typeof(x) = "date"` for safety.
- **SORT**: Supports multiple sort fields: `SORT field1 ASC, field2 DESC`. Ties resolved by subsequent fields.
- **GROUP BY**: Yields one row per unique value with two properties: `key` (the grouped value) and `rows` (array of matching pages). Field "swizzling": `rows.field` auto-extracts that field from every row element.
- **FLATTEN**: Expands array values into one row per entry. Useful for `file.lists`, `file.tasks`, and multi-value fields. Can use computed expressions with `AS name`.
- **LIMIT**: Caps results. When placed before SORT, sorts only the limited set.
[SOURCE: https://blacksmithgu.github.io/obsidian-dataview/queries/data-commands/]

**Local refs**: `data-model.md` §7 lists clauses but omits: multiple SORT fields, GROUP BY rows swizzling, FLATTEN computed expressions, LIMIT ordering interaction.

**Gap**: Document GROUP BY rows swizzling, multiple SORT fields, FLATTEN with computed expressions, and LIMIT ordering.

### 5. Expressions and Literals
**Official**: DQL supports arithmetic (`+`, `-`, `*`, `/`, `%`), comparisons (`<`, `>`, `=`, `!=`, `<=`, `>=`), string concatenation and repetition, list/object indexing (`list[0]`, `object.key`), function calls, and lambdas (`(x) => x.field`). Literals include numbers, strings, links, lists, objects, dates with shorthands (`date(today)`, `date(tomorrow)`, `date(sow)`, `date(eow)`, `date(som)`, `date(eom)`, `date(soy)`, `date(eoy)`, `date(now)`), and durations with multiple aliases (`dur(1 day)`, `dur(2 hours 30 mins)`).
[SOURCE: https://blacksmithgu.github.io/obsidian-dataview/reference/expressions/]
[SOURCE: https://blacksmithgu.github.io/obsidian-dataview/reference/literals/]

**Local refs**: `data-model.md` §8 lists functions but has no section on expressions or literals. No mention of date shorthands, duration aliases, arithmetic, lambdas, or indexing.

**Gap**: Add a dedicated expressions/literals section to the data model.

### 6. DQL vs JS vs Inline — Key Differences
**Official**: Inline DQL (prefix `=`) displays exactly one value, uses `this.` for current page fields, `[[page]].field` for other pages. Inline JS (prefix `$=`) has full API access via `dv`. Both prefixes are configurable in settings. DataviewJS blocks (` ```dataviewjs ``` `) require `enableDataviewJs: true`. Inline JS requires `enableInlineDataviewJs: true`.
[SOURCE: https://blacksmithgu.github.io/obsidian-dataview/queries/dql-js-inline/]

**Local refs**: `data-model.md` §6 covers block formats but does not document the `this.` prefix for inline DQL, the configurable prefixes, or the fact that inline DQL displays exactly one value.

**Gap**: Document `this.` prefix, single-value constraint, and configurable prefixes for inline queries.

### 7. Field Name Simplification
**Official**: Field names with spaces or punctuation are simplified: lowercase, spaces replaced with hyphens. E.g., `"Simple Field!"` becomes `simple-field`. Keywords like `where` can be accessed via `row["where"]`.
[SOURCE: https://blacksmithgu.github.io/obsidian-dataview/reference/expressions/]
[SOURCE: https://blacksmithgu.github.io/obsidian-dataview/resources/faq/]

**Local refs**: No mention of field name simplification or the `row["keyword"]` escape syntax.

**Gap**: Add field name normalization rules and the `row["keyword"]` escape.

### 8. TASK Query — Task-Level Semantics
**Official**: `TASK` queries operate at the task level, not the page level. Data commands filter individual tasks. Child tasks (indented under a parent) belong to their parent — they appear in results if the parent matches, even if the child doesn't. TASK is the only DQL query type that can modify files (checking a task checks it in the source file).
[SOURCE: https://blacksmithgu.github.io/obsidian-dataview/queries/query-types/#task]

**Local refs**: `data-model.md` §7 lists TASK as a view type but does not document task-level semantics, child task behavior, or the file-modification side effect.

**Gap**: Document TASK task-level execution, child task inheritance, and the file-modification effect.

### 9. CALENDAR Constraints
**Official**: CALENDAR requires a date field argument. SORT and GROUP BY have no effect on CALENDAR output. The field must contain a valid date or be empty; use `WHERE typeof(due) = "date"` to filter.
[SOURCE: https://blacksmithgu.github.io/obsidian-dataview/queries/query-types/#calendar]

**Local refs**: `data-model.md` §7 lists CALENDAR but does not document the date requirement or the SORT/GROUP BY ineffectiveness.

**Gap**: Document CALENDAR constraints.

### 10. Comparison Safety and Type Checking
**Official**: Comparing different types yields unexpected results. `null <= date(today)` returns true. Use `WHERE field AND field <= date(today)` or `WHERE typeof(field) = "date" AND field <= date(today)` for safe comparisons.
[SOURCE: https://blacksmithgu.github.io/obsidian-dataview/reference/expressions/]

**Local refs**: `troubleshooting.md` §3 mentions value type mismatch but does not document the null-comparison trap or the `typeof()` safety pattern.

**Gap**: Add the null-comparison trap and `typeof()` safety pattern to troubleshooting.

## Questions Answered
- KQ1: DQL query structure, source forms, command ordering, and query-type semantics are now established from official docs and compared against local references.

## Questions Remaining
- KQ2: How do frontmatter values, types, aliases, arrays, dates, nulls, and missing fields become Dataview data?
- KQ3: How do inline fields and DataviewJS access/query patterns differ, and what file-layer syntax should AI authors emit?
- KQ4: Which migrated-note, path, quoting, task, and indexing gotchas most often make an otherwise plausible query fail?

## Ruled Out
- Deep-dive into DataviewJS API methods (deferred to KQ3)
- Frontmatter type coercion rules (deferred to KQ2)
- Task completion tracking settings (deferred to KQ4)

## Dead Ends
- None in this iteration. All official doc pages were accessible and provided clear information.

## Edge Cases
- Ambiguous input: None. The official docs are unambiguous about query structure.
- Contradictory evidence: None found. Local refs are consistent with official docs where they overlap, though incomplete.
- Missing dependencies: None. All official doc pages loaded successfully.
- Partial success: N/A — all research actions completed.

## Sources Consulted
- https://blacksmithgu.github.io/obsidian-dataview/ (overview)
- https://blacksmithgu.github.io/obsidian-dataview/queries/structure/
- https://blacksmithgu.github.io/obsidian-dataview/queries/query-types/
- https://blacksmithgu.github.io/obsidian-dataview/queries/data-commands/
- https://blacksmithgu.github.io/obsidian-dataview/reference/sources/
- https://blacksmithgu.github.io/obsidian-dataview/queries/dql-js-inline/
- https://blacksmithgu.github.io/obsidian-dataview/reference/expressions/
- https://blacksmithgu.github.io/obsidian-dataview/reference/literals/
- `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/dataview/dataview.md`
- `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/dataview/data-model.md`
- `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/dataview/workflows.md`
- `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/dataview/troubleshooting.md`

## Assessment
- New information ratio: 0.96
- Questions addressed: KQ1 (fully)
- Questions answered: KQ1

## Reflection
- **What worked**: Fetching the official docs page by page (structure → query types → data commands → sources → expressions → literals → DQL/JS/inline) gave a complete picture. Comparing each section against the local references revealed gaps systematically.
- **What did not work**: The local references are generally accurate but omit many details that an AI authoring queries would need (WITHOUT ID, negation, rows swizzling, expressions, literals, task-level semantics, CALENDAR constraints). The workflows.md implies a fixed command order that is not required.
- **What I would do differently**: For the next iteration, focus on the frontmatter and inline field data model (KQ2), which requires fetching the metadata annotation pages from the official docs.

## Recommended Next Focus
KQ2: How do frontmatter values, types, aliases, arrays, dates, nulls, and missing fields become Dataview data? Fetch the official metadata annotation pages (add-metadata, types-of-metadata, metadata-pages, metadata-tasks) and compare against local data-model.md sections 3-5.