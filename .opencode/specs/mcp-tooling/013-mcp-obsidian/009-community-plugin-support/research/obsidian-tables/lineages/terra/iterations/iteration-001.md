# Iteration 1: Canonical TableData Schema and Persistence Paths

## Focus
This iteration recorded the strongest source-backed facts already collected for `aztekgold/obsidian-tables`: canonical `TableData` fields, normalized column types, ID/order model, Markdown/JSON parsing and serialization, and migration behavior. No additional network collection was performed in this finalization pass.

## Findings
1. The persisted root model is `TableData` with `version`, `metadata: { title }`, optional `policy.permissions` booleans for agent read/create/update/delete, `columns`, `views`, and `rows`; the current version constant is `AGENTABLE_VERSION = 'agentable-1.0.0'`. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts]
2. The canonical ID prefixes visible in source are `col_` for columns, `view_` for views, `flt_` for filters, and `srt_` for sorts; row IDs are plain strings, and array order is the persisted order for `columns`, `views`, and `rows`, with per-view `columnOrder` for display order. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/utils/migrateUtils.ts]
3. `ColumnDef` persists `id`, `name`, `type`, optional `display.width`, optional `display.dateFormat`, and optional `constraints` for select options/colors, multi-select, note-link file suggestions, text wrapping, formula expression text, and formula result-kind cache. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts]
4. Source comments identify Agentable spec column types as `text`, `number`, `select`, `date`, `boolean`, `url`, and `link`; plugin-specific accepted/normalized aliases include `checkbox -> boolean`, `dropdown -> select`, `multiselect`/`multi-select -> select` with `constraints.multiSelect = true`, `notelink`/`wikilink -> link`, and `function -> formula`. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/utils/migrateUtils.ts]
5. Views persist as `{ id, name, sorts, filters, hiddenColumns, columnOrder }`; sorts persist `{ id, columnId, direction: 'asc'|'desc' }`; filters persist `{ id, columnId, operator, value? }`, where operators include `contains`, `doesNotContain`, `startsWith`, `endsWith`, `isEmpty`, `isNotEmpty`, `gt`, `lt`, `is`, and `isNot`. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts]
6. `.table.md` files are valid only with frontmatter `json-table-plugin: true` and a fenced `json-table` code block; save updates frontmatter, writes `table-links` from link-column cell values, and replaces or appends the JSON code block using `JSON.stringify(data, null, 2)`. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/MarkdownFileHandler.ts]
7. `.table.json` files read raw JSON and save raw JSON through `JSON.stringify(data, null, 2)`; empty JSON content or empty Markdown JSON-block content produces a current-version empty table with filename-derived title, empty columns/rows, and one default view. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/JsonFileHandler.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/MarkdownFileHandler.ts]
8. Migration treats missing `version` or array-shaped first row as old format, creates current `version`/`metadata.title`, normalizes legacy column types/options/date display, converts array rows into `{ id, cells }`, accepts old view keys `sort`/`filter`, maps legacy filter operators `equals`/`notEqual` to `is`/`isNot`, and ensures every view has sort/filter/hidden-column/column-order arrays. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/utils/migrateUtils.ts]
9. README source confirms the user-facing ten column types: Text, Number, Checkbox, Select, Multi-select, URL, Email, Note Link, Date, and Formula. The fetched TypeScript source did not verify a canonical persisted `email` type beyond README feature documentation, so `email` remains an open source-verification caveat. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/README.md] [INFERENCE: based on README feature list plus the narrower `ColumnDef.type` source comment in `src/types.ts`]
10. Formula persistence is source-confirmed only at the column constraints level: `constraints.formula` stores expression text and `formulaResultKind` may cache `number`, `date`, or `text`; the formula evaluator/parser internals were not fetched, so formula AST/evaluation semantics remain unverified in this iteration. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts]

## Ruled Out
- Minified installed `main.js` was not used as evidence because the dispatch required source-level evidence. [INFERENCE: based on dispatch scope and fetched TypeScript source availability]
- Additional network/source collection was stopped by orchestration; this iteration used the preceding source-confirmed memo and exact GitHub source URLs. [INFERENCE: based on dispatcher instruction to use the preceding memo and perform no further network collection]

## Dead Ends
- Direct shell GitHub access was not available earlier because shell DNS resolution failed; GitHub source access succeeded through the GitHub connector instead. [INFERENCE: based on prior tool result `Could not resolve host: github.com` and successful GitHub connector fetches]

## Edge Cases
- Ambiguous input: none; the focus was explicitly canonical schema/parser/migration evidence.
- Contradictory evidence: none in fetched source. The only caveat is coverage: README lists Email as a user-facing type, while the fetched `src/types.ts` canonical comment did not list `email`.
- Missing dependencies: formula evaluator/parser source was not fetched before source collection stopped; this limits formula findings to persisted constraint fields.
- Partial success: source-level schema, ID/order model, parsing/serialization, and migration were covered; exact email persistence and formula evaluator internals remain unverified.

## Sources Consulted
- https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts
- https://github.com/aztekgold/obsidian-tables/blob/main/src/utils/migrateUtils.ts
- https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/MarkdownFileHandler.ts
- https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/JsonFileHandler.ts
- https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/CsvFileHandler.ts
- https://github.com/aztekgold/obsidian-tables/blob/main/src/main.ts
- https://github.com/aztekgold/obsidian-tables/blob/main/src/JsonTableView.ts
- https://github.com/aztekgold/obsidian-tables/blob/main/README.md
- https://github.com/aztekgold/obsidian-tables/blob/main/package.json

## Assessment
- New information ratio: 1.00
- Questions addressed: exact top-level JSON shape, stable IDs/order/version fields, parsing/serialization, migration, partial column-type surface
- Questions answered: What exact top-level JSON shape, stable IDs, ordering, and version fields does current source accept and emit for a `.table.md` file?; Canonical parsing/serialization and migration behavior for Markdown/JSON files

## Reflection
- What worked and why: GitHub connector source fetches provided TypeScript evidence without cloning or writing source files outside the artifact root.
- What did not work and why: direct shell GitHub access failed due to DNS resolution, and timeboxing stopped deeper source collection for formula evaluator internals.
- What I would do differently: next iteration should fetch the formula implementation and column UI/renderer files first, because the root schema is now established.

## Recommended Next Focus
Verify the remaining column-level details from source: `email` persistence, formula parser/evaluator behavior, note-link cell values, select option mutation, and UI handlers that create or edit each column type.
