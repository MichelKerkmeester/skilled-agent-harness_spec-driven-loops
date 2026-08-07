# Iteration 3: File-Layer AI Operations, Troubleshooting, and Value Recipes

## Focus
This final required iteration under `stopPolicy=max-iterations` completed the source-backed file-layer operating guidance for `aztekgold/obsidian-tables`: safe create/patch/query/migration protocol, CSV import/export boundaries, malformed JSON and `.table.md` parsing symptoms, formula error behavior, remaining persisted cell values, and concrete AI usage recipes. It distinguishes direct source facts from conservative recommendations inferred from source behavior.

## Findings
1. Source-confirmed create protocol: a valid current table should use `version: "agentable-1.0.0"`, `metadata.title`, `columns`, `rows`, and `views`; default new tables include generated `col_` IDs, one row with cells keyed by column ID, and one default view. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/main.ts]
2. Source-confirmed `.table.md` wrapping protocol: Markdown table files require frontmatter `json-table-plugin: true` and a fenced `json-table` code block; saving rewrites/creates frontmatter, updates `table-links` from link-column cell values, and replaces or appends the `json-table` block. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/MarkdownFileHandler.ts]
3. Source-confirmed `.table.md` parsing symptoms: missing or false frontmatter throws "not a valid table file" with the missing `json-table-plugin: true` detail; no fence throws "Could not find '```json-table' code block start"; an unextractable fence throws "Could not extract content"; invalid JSON or missing `columns`/`rows` is wrapped as "Invalid embedded JSON: ...". [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/MarkdownFileHandler.ts]
4. Source-confirmed `.table.json` parsing symptoms: empty content returns an empty current-version table, invalid JSON is wrapped as "Invalid JSON: ...", and parsed data lacking `columns`, `rows`, or `views` throws "Invalid table JSON: missing columns, rows, or views." [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/JsonFileHandler.ts]
5. Source-confirmed migration trigger and recovery path: missing `version` or array-shaped first row is treated as old format; migration creates Agentable-style `version`, `metadata.title`, normalized columns, object-shaped row cells, view arrays, sort/filter IDs, and maps legacy filter operators before `ensureViewsValid()` fills missing view arrays and normalizes legacy column aliases. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/utils/migrateUtils.ts]
6. Conservative patch protocol for AI agents: patch JSON by stable IDs, not display names; preserve arrays unless intentionally reordering; write row values under `row.cells[col.id]`; preserve or regenerate prefixed `col_`, `view_`, `flt_`, and `srt_` IDs; update `.table.md` by replacing only the JSON payload and preserving valid frontmatter/body where possible. [INFERENCE: based on `src/types.ts`, `src/fileHandlers/MarkdownFileHandler.ts`, `src/fileHandlers/JsonFileHandler.ts`, and `src/utils/migrateUtils.ts`]
7. Conservative query protocol: read `.table.json` as the root JSON object; read `.table.md` by first verifying frontmatter and extracting the `json-table` fenced JSON; apply `views[*].hiddenColumns`, `filters`, and the first fetched `SortHandler` sort rule when emulating the plugin, while noting iteration 2's unresolved multi-level sort contradiction. [INFERENCE: based on `src/fileHandlers/MarkdownFileHandler.ts`, `src/FilterHandler.ts`, `src/SortHandler.ts`, and iteration 2 findings]
8. Source-confirmed CSV boundaries: direct CSV support must be enabled to open `.csv`; `CsvFileHandler` converts CSV headers to text columns with deterministic `col_${index.toString(36)}` IDs and generated row IDs; edits to opened `.csv` files are memory-only in `JsonTableView.saveTableData`; CSV import creates a new `.table.md` or `.table.json`; export writes current column names and `row.cells[col.id]` values with CSV escaping. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/CsvFileHandler.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/JsonTableView.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/main.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/utils/csv.ts]
9. Source-confirmed CSV parser/generator caveats: parsing drops blank lines, trims field values, supports doubled quotes inside quoted fields, allows jagged row arrays, and export stringifies missing cells as empty fields; therefore CSV ingestion is lossy for surrounding whitespace and not a schema-preserving round trip. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/utils/csv.ts]
10. Source-confirmed formula grammar: formulas parse numbers, strings, `{{ columnRef }}`, function calls, parentheses, unary minus, arithmetic `+ - * /`, and one optional comparison `==`, `>`, or `<`; AST nodes are `number`, `string`, `columnRef`, `unaryMinus`, `binaryOp`, and `functionCall`. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/formula/parser.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/formula/ast.ts]
11. Source-confirmed formula functions and errors: supported functions are `if`, `contains`, `today`, and `date`; type errors include unknown column/function, Formula-column references, wrong function arity, non-boolean `if` condition, invalid date formats, division by zero, and non-numeric values in number/date operands. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/formula/evaluator.ts]
12. Source-confirmed formula runtime behavior: formulas are stored id-based in `constraints.formula`, validated from display text, self-heal name-based refs, cache `formulaResultKind`, write computed values directly into `row.cells[col.id]`, mark errors, and render errored formula cells as an em dash. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/FormulaHandler.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/FormulaRenderer.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/TableMenuManager.ts]
13. Source-confirmed persisted value formats: text stores `innerText` as a string; number stores parsed numbers, `null` for empty edits, or a nonnumeric string fallback; checkbox stores the strings `"true"` or `"false"`; URL and email store trimmed strings through a shared editable link renderer and only render as links when regex validation passes. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/TextRenderer.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/NumberRenderer.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/CheckboxRenderer.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/AbstractLinkRenderer.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/UrlRenderer.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/EmailRenderer.ts]
14. Source-confirmed persisted value formats continued: select stores one option-value string; multi-select stores a comma-separated string and cannot safely represent option values containing commas; date stores millisecond timestamp strings; note links store a resolved file path when Obsidian resolves the input, otherwise raw trimmed text. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/DropdownRenderer.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/MultiSelectRenderer.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/DateRenderer.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/NoteLinkRenderer.ts]
15. Concrete AI recipe for safe create: choose Markdown when Obsidian backlink/frontmatter support is desired, use `.table.md` frontmatter plus one `json-table` code block, create columns with unique `col_` IDs, rows with unique IDs and complete `cells` keys, one default view, and option/date/formula metadata under `constraints`/`display`; choose `.table.json` only when wrapper Markdown is unnecessary. [INFERENCE: based on `src/main.ts`, `src/types.ts`, `src/fileHandlers/MarkdownFileHandler.ts`, and `src/fileHandlers/JsonFileHandler.ts`]
16. Concrete AI recipe for safe patch/recovery: parse first, reject or repair missing frontmatter/fence/required arrays before mutating, normalize legacy aliases through the migration rules, preserve unknown optional root fields such as `policy`, avoid editing formula result cells directly unless recomputing formulas, and after changing link cells in `.table.md` expect plugin save to refresh `table-links`. [INFERENCE: based on `src/fileHandlers/MarkdownFileHandler.ts`, `src/fileHandlers/JsonFileHandler.ts`, `src/utils/migrateUtils.ts`, and `src/FormulaHandler.ts`]
17. README-only facts still useful but not load-bearing here: public README states the file is AI-readable, documents embed alias syntax, and describes user-facing formula examples; source now verifies the underlying storage/mutation mechanisms for those areas except the unresolved multi-level sort application mismatch noted in iteration 2. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/README.md] [INFERENCE: based on iteration 2 `SortHandler.ts` finding]

## Ruled Out
- Direct shell GitHub access, broad connector code search, and minified installed `main.js` were not retried because strategy marks those approaches blocked. [INFERENCE: based on current strategy exhausted approaches]
- Runtime testing inside Obsidian was not attempted; this iteration is source-level file-layer research only. [INFERENCE: based on research boundaries and non-goals]

## Dead Ends
- No source evidence found in this iteration resolves iteration 2's mismatch between persisted multi-sort rules and `SortHandler.getSortedRows()` applying only `rules[0]`; operational recipes should emulate only verified first-rule sort application unless later runtime/source evidence proves otherwise. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/SortHandler.ts] [INFERENCE: based on iteration 2 finding]

## Edge Cases
- Ambiguous input: "safe" file-layer operations can mean plugin-compatible or lossless. This iteration uses plugin-compatible as the selected interpretation and flags lossy CSV whitespace/comma-separated multi-select limitations separately.
- Contradictory evidence: README-level "multi-level sorting" remains in tension with fetched `SortHandler.ts` first-rule application; unresolved.
- Missing dependencies: no runtime Obsidian validation was performed, and the Agentable package internals were not fetched. Source coverage is otherwise sufficient for file-layer recipes.
- Partial success: source evidence answers the five strategy questions at the file-layer level; exact live UI/runtime behavior remains outside this packet's non-goal.

## Sources Consulted
- https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts
- https://github.com/aztekgold/obsidian-tables/blob/main/src/main.ts
- https://github.com/aztekgold/obsidian-tables/blob/main/src/JsonTableView.ts
- https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/MarkdownFileHandler.ts
- https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/JsonFileHandler.ts
- https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/CsvFileHandler.ts
- https://github.com/aztekgold/obsidian-tables/blob/main/src/utils/migrateUtils.ts
- https://github.com/aztekgold/obsidian-tables/blob/main/src/utils/csv.ts
- https://github.com/aztekgold/obsidian-tables/blob/main/src/FilterHandler.ts
- https://github.com/aztekgold/obsidian-tables/blob/main/src/SortHandler.ts
- https://github.com/aztekgold/obsidian-tables/blob/main/src/FormulaHandler.ts
- https://github.com/aztekgold/obsidian-tables/blob/main/src/formula/parser.ts
- https://github.com/aztekgold/obsidian-tables/blob/main/src/formula/evaluator.ts
- https://github.com/aztekgold/obsidian-tables/blob/main/src/formula/ast.ts
- https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/TextRenderer.ts
- https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/NumberRenderer.ts
- https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/CheckboxRenderer.ts
- https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/AbstractLinkRenderer.ts
- https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/UrlRenderer.ts
- https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/EmailRenderer.ts
- https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/DropdownRenderer.ts
- https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/MultiSelectRenderer.ts
- https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/DateRenderer.ts
- https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/NoteLinkRenderer.ts
- https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/FormulaRenderer.ts
- https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/TableMenuManager.ts
- https://github.com/aztekgold/obsidian-tables/blob/main/README.md

## Assessment
- New information ratio: 0.74
- Questions addressed: all five strategy questions
- Questions answered: What exact top-level JSON shape, stable IDs, ordering, and version fields does current source accept and emit for a `.table.md` file?; What is the persisted value/options structure for each of the ten column types, especially select colours, date settings, formula references, and note links?; How do views, filters, sort chains, visible-column state, and embed view aliases serialize and mutate the file?; What commands/settings and UI features affect file contents, including CSV import/export and row/column drag ordering?; Which file-layer AI operations are safe for create, patch, CSV ingestion, querying, migration, and recovery, and which malformed-input symptoms or edge cases must be handled?

## Reflection
- What worked and why: fetching the remaining formula and renderer files directly closed the prior uncertainty around formula grammar and simple cell value formats.
- What did not work and why: the final pass still could not resolve the multi-sort README/source mismatch without runtime testing or a different source path.
- What I would do differently: if another research cycle were allowed, I would run a local/plugin runtime fixture specifically for multi-sort and `columnOrder`; under the current source-only boundary, the conservative recipe is to avoid relying on those as fully verified.

## Recommended Next Focus
No further required iteration under `maxIterations: 3`. If follow-up work is approved outside this lineage, convert the three iterations into a concise implementation-facing recipe sheet and add runtime tests/fixtures for multi-sort, `columnOrder`, and malformed `.table.md` recovery.
