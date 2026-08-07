# Iteration 2: Views, Sorting, Filtering, Reordering, Embeds, and Formula Persistence

## Focus
This iteration source-verified view-scoped mutation behavior, filters, multi-level sort UI/storage, hidden columns, row/column drag persistence, embed alias view selection/creation, commands/settings that affect files, formula handling, and remaining per-column persisted-value details. The run proceeded under `stopPolicy=max-iterations` even though iteration 1 had established the root schema baseline.

## Findings
1. `ViewDef` persists `id`, `name`, `sorts`, `filters`, `hiddenColumns`, and `columnOrder`; new/default views initialize `sorts`, `filters`, `hiddenColumns`, and `columnOrder` as empty arrays. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/ViewManager.ts]
2. View creation, deletion, and rename mutate `data.views` directly and call `saveTableData(data)`; deleting the last view is refused, and locked/inline render contexts do not show regular view tabs. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/ViewManager.ts]
3. Filter edits are view-scoped: `FilterHandler` reads and writes `getActiveView().filters`, adds rules with generated `flt_` IDs, persists on add/change/delete through `saveTableData`, and evaluates all filter rules with AND semantics. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/FilterHandler.ts]
4. Filter operators are source-confirmed as `contains`, `doesNotContain`, `startsWith`, `endsWith`, `isEmpty`, `isNotEmpty`, `gt`, `lt`, `is`, and `isNot`; `gt`/`lt` are offered only for numeric columns, dates, or formula columns whose cached result kind is numeric/date, with date range input persisted as a millisecond timestamp string. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/FilterHandler.ts]
5. Sort edits are view-scoped: `SortHandler` reads/writes `getActiveView().sorts`, creates generated `srt_` IDs, persists column/direction/delete changes, and the UI supports multiple rules by adding rows labelled "sort by" and "then by"; however `getSortedRows()` only applies `rules[0]`, so multi-level sort is stored in the file but only the first rule was source-confirmed as applied in this handler. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/SortHandler.ts]
6. Hidden-column state is view-scoped: the show/hide menu toggles column IDs in `activeView.hiddenColumns`, persists through `saveTableData`, and rendering filters visible columns by excluding IDs found in the active view's hidden list. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/TableMenuManager.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/AbstractTableRenderer.ts]
7. Row drag reorder is persisted by splicing `data.rows` and saving, but it is available only when beta row reordering is enabled, the table is not inline/embed read-only, and no active sort is present. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/DivTableRenderer.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/main.ts]
8. Column drag reorder is persisted by splicing the global `data.columns` array and saving; the fetched source did not show drag reorder writing to `activeView.columnOrder`, so `columnOrder` exists in schema/default views but was not source-confirmed as the drag persistence target. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/DivTableRenderer.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts]
9. Embed alias behavior is source-confirmed: `EmbedTableRenderer` receives an optional `viewName`; it case-insensitively selects an existing view by name, or creates a new view with empty sorts/filters/hiddenColumns/columnOrder, saves the file, locks the renderer to that view, and sets `renderer.lockToView = true`. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/EmbedTableRenderer.ts]
10. Commands/settings that affect file contents include `create-new-table` using `getDefaultTableData()`, `import-csv` creating a `.table.md` or `.table.json` table from parsed CSV, `add-table-inline` inserting a `jsontable` fenced block with skeleton JSON into the current note, default file format choosing Markdown versus JSON creation, CSV support enabling `.csv` handling, and beta row reorder gating row drag UI. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/main.ts]
11. Formula persistence and execution are source-confirmed: formula expressions are edited in display form with column names, stored in `constraints.formula` using column IDs, store `constraints.formulaResultKind` as `number`, `date`, or `text`, self-heal legacy name-based refs during recompute, and write computed results into `row.cells[col.id]`; formula cells are read-only and display errors as an em dash. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/FormulaHandler.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/TableMenuManager.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/FormulaRenderer.ts]
12. Per-column values source-confirmed in fetched renderers: select cell values persist as a single string matching an option value; multi-select cell values persist as a comma-separated string; date cells persist as millisecond timestamp strings; note-link cells persist as a resolved file path when Obsidian can resolve the link, otherwise raw trimmed text; column options persist as `{ value, color }`, with newly created options using `color: 'default'`. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/DropdownRenderer.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/MultiSelectRenderer.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/DateRenderer.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/NoteLinkRenderer.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/TableMenuManager.ts]
13. Email is no longer README-only: fetched source registers an `EmailRenderer`, includes `email` in the type icon map and add/change type menus, and therefore source-confirms `type: 'email'` as a plugin-supported persisted column type; exact email cell validation/rendering internals were not fetched in this iteration. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/AbstractTableRenderer.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/TableMenuManager.ts]
14. README-only behaviors not independently source-verified in this iteration include the public wording for embed syntax examples, full CSV export UX claims, and every formula language operator/function detail from the README; this iteration verified the storage/evaluation pipeline but did not fetch the parser/evaluator AST files. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/README.md] [INFERENCE: based on fetched `FormulaHandler.ts` imports of `src/formula/parser`, `src/formula/evaluator`, and `src/formula/ast` without fetching those files]

## Ruled Out
- Direct shell GitHub access remained out of scope because iteration 1 already recorded shell DNS failure and the strategy marks that path blocked. [INFERENCE: based on prior state and strategy]
- Minified installed `main.js` remained ruled out as evidence; this iteration used source TypeScript files. [INFERENCE: based on strategy non-goal and iteration 1 ruled-out direction]
- GitHub code search through the connector returned no useful hits for broad handler queries, so known source paths were fetched directly instead. [INFERENCE: based on connector search results returning empty arrays]

## Dead Ends
- `ViewDef.columnOrder` was not found as the drag-reorder persistence target in the fetched column drag source; column drag writes global `data.columns` order instead. This should be treated as an unresolved schema/implementation mismatch candidate until a full repository search proves no other `columnOrder` writer exists. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/DivTableRenderer.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts]
- Multi-level sort rules are persisted but only `rules[0]` was source-confirmed as applied by `getSortedRows()` in fetched `SortHandler.ts`. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/SortHandler.ts]

## Edge Cases
- Ambiguous input: "multi-level sorts" has two levels: persisted rules and applied sorting behavior. This iteration verified both separately and found persisted multi-rules but only first-rule application in fetched source.
- Contradictory evidence: README says advanced multi-level sorting; fetched `SortHandler.ts` stores multiple rules but applies only the first rule in `getSortedRows()`. The contradiction is unresolved without more source or runtime testing.
- Missing dependencies: parser/evaluator AST files and simple text/number/url/email renderers were not fetched; formula storage/write-through is verified, exact parser grammar and email validation internals are not.
- Partial success: view/filter/sort storage, embed alias mutation, commands/settings, formula persistence, and several cell value formats are verified; exact parser grammar and some simple renderer internals remain open.

## Sources Consulted
- https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts
- https://github.com/aztekgold/obsidian-tables/blob/main/src/FilterHandler.ts
- https://github.com/aztekgold/obsidian-tables/blob/main/src/SortHandler.ts
- https://github.com/aztekgold/obsidian-tables/blob/main/src/FormulaHandler.ts
- https://github.com/aztekgold/obsidian-tables/blob/main/src/JsonTableView.ts
- https://github.com/aztekgold/obsidian-tables/blob/main/src/EmbedTableRenderer.ts
- https://github.com/aztekgold/obsidian-tables/blob/main/src/main.ts
- https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/AbstractTableRenderer.ts
- https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/DivTableRenderer.ts
- https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/TableMenuManager.ts
- https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/ViewManager.ts
- https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/DropdownRenderer.ts
- https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/MultiSelectRenderer.ts
- https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/DateRenderer.ts
- https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/NoteLinkRenderer.ts
- https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/FormulaRenderer.ts
- https://github.com/aztekgold/obsidian-tables/blob/main/README.md

## Assessment
- New information ratio: 0.88
- Questions addressed: view/filter/sort serialization and mutation; hidden-column state; embed view aliases; commands/settings affecting file contents; row/column drag ordering; formula storage/write-through; per-column value formats for select, multi-select, date, and note link
- Questions answered: How do views, filters, sort chains, visible-column state, and embed view aliases serialize and mutate the file?; What commands/settings and UI features affect file contents, including CSV import/export and row/column drag ordering?; Which previously uncertain column details can now be source-confirmed?

## Reflection
- What worked and why: fetching known TypeScript files directly through the GitHub connector avoided the blocked shell/raw-GitHub path and yielded source-level mutation evidence.
- What did not work and why: broad connector code search returned empty results, so source discovery depended on paths inferred from imports in fetched files.
- What I would do differently: next iteration should fetch the formula parser/evaluator/AST and the remaining simple renderers (`TextRenderer`, `NumberRenderer`, `UrlRenderer`, `EmailRenderer`, `CheckboxRenderer`) before moving into AI-operation recipes.

## Recommended Next Focus
Finish value-level verification and safe file-layer operations: exact formula grammar/evaluator behavior, simple renderer cell formats, malformed input symptoms, CSV import/export boundaries, and conservative create/patch/recovery recipes for AI agents.
