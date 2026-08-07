# Iteration 1: Repository-source archaeology

## Focus

This iteration targeted the canonical TypeScript model, defaults, serializers, column renderers/editors, and sample `.table.md` fixtures needed to establish the exact persisted schema. The repository README and source tree were accessible, but GitHub source-file bodies were not: blob/raw requests returned cache or safety failures, and shell retrieval failed DNS resolution. The narrow evidence-backed result is therefore the documented feature/persistence contract plus a precise map of the source files still requiring body-level inspection.

## Actions Taken

1. Read the lineage config, state log, strategy, and findings registry; confirmed iteration 1 and no exhausted approaches.
2. Read the repository landing page/README and its documented column, formula, view, filtering, sorting, embed, and save behavior.
3. Inspected the `src/` tree to locate `types.ts`, `JsonTableView.ts`, `FilterHandler.ts`, `SortHandler.ts`, renderer directories, and `fileHandlers/`.
4. Tried GitHub blob, raw, Contents API, recursive-tree API, jsDelivr, and shell `curl` paths for source bodies; all source-body paths failed in this environment.
5. Preserved the unresolved exact-schema questions rather than inferring JSON keys from UI terminology.

## Findings

1. A table is a portable single JSON vault file, with the README explicitly describing one file per table rather than one Markdown file per row; it is editable outside Obsidian and exportable to CSV. The repository description calls the plugin an “Interactive JSON table plugin,” while embeds and source naming establish the `.table.md` convention. [SOURCE: https://github.com/aztekgold/obsidian-tables#tables-for-obsidian]

2. The documented column-type set is exactly ten kinds: Text, Number, Checkbox, Select, Multi-select, URL, Email, Note Link, Date, and Formula. Select and Multi-select carry predefined options with custom colours; Date has a customizable display format; URL and Email become links only when their values match the corresponding patterns. This establishes required semantic cases but not their persisted property names. [SOURCE: https://github.com/aztekgold/obsidian-tables#multiple-column-types]

3. Formula source is persisted using rename-stable internal column references even though authors enter `{{ Column Name }}`. Formula results are computed live and support arithmetic, comparisons, `if`, `contains`, `today`, and `date`; date-shaped results receive date formatting, and numeric/date-shaped results participate in sorting and range filters. The README does not state whether computed results themselves are serialized, so that remains unresolved. [SOURCE: https://github.com/aztekgold/obsidian-tables#formulas]

4. Multiple named views exist in one table file and combine multi-level ascending/descending sorts, complex filters, and visible-column search. An embed without an alias selects the first/default view; `![[MyTable.table.md|Sprint Board]]` pins the named view and creates it if missing. That creation behavior implies a write to the table document, but the view/filter/sort JSON object shapes remain unverified. [SOURCE: https://github.com/aztekgold/obsidian-tables#views-sorting--filtering] [SOURCE: https://github.com/aztekgold/obsidian-tables#embeds]

5. The canonical source investigation surface is concentrated in `src/types.ts` for interfaces/unions, `src/fileHandlers/` for parse/save behavior, `src/JsonTableView.ts` for defaults and mutations, `src/FilterHandler.ts` and `src/SortHandler.ts` for view semantics, plus `src/renderers/` and `src/ui/` for column-specific editing. No fixtures or test directory were visible at the `src/` level, so repository-wide fixture discovery remains necessary. [SOURCE: https://github.com/aztekgold/obsidian-tables/tree/main/src]

## Questions Answered

- Confirmed the documented ten column kinds and their high-level behavioral distinctions.
- Confirmed that formula expressions persist rename-stable column references, while results are evaluated live.
- Confirmed high-level view/embed selection and named-view creation behavior.
- Located the canonical source areas that must be read to resolve exact JSON shapes.

## Questions Remaining

- Exact top-level keys, schema/version/order fields, ID generation, row identity, and cell/value layout.
- Exact discriminated-union shape and defaults for each column type, including option/color encoding.
- Whether formula results are serialized or only evaluated, and the exact internal reference syntax.
- Exact view, filter-group, filter-condition, sort-level, visible-column/order/width, and active/default-view serialization.
- Exact serializer validation, migration, malformed-file recovery, and any repository fixtures/examples.

## Ruled Out / Dead Ends

- `raw.githubusercontent.com` via shell: DNS resolution failed.
- GitHub blob/raw pages through the browser fetcher: cache misses.
- GitHub Contents and recursive-tree APIs: URL safety rejection.
- jsDelivr source paths: URL safety rejection.
- Inferring JSON property names from README UI labels: ruled out as unsound; UI nouns are not schema evidence.

## Edge Cases

- Ambiguous input: none; the prompt clearly prioritizes exact persisted schema.
- Contradictory evidence: none found.
- Missing dependencies: repository source-file bodies and fixtures were unavailable through all attempted transports.
- Partial success: README and repository-tree evidence established the semantic contract and source map, but did not establish the exact JSON schema. Status is `complete` because multiple in-scope questions were materially answered with cited evidence; exact-shape questions remain open.

## Sources Consulted

- https://github.com/aztekgold/obsidian-tables
- https://github.com/aztekgold/obsidian-tables/blob/main/README.md
- https://github.com/aztekgold/obsidian-tables/tree/main/src
- https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts (fetch failed)
- https://github.com/aztekgold/obsidian-tables/tree/main/src/fileHandlers (fetch failed)
- https://github.com/aztekgold/obsidian-tables/blob/main/src/JsonTableView.ts (fetch failed)
- https://github.com/aztekgold/obsidian-tables/blob/main/src/FilterHandler.ts (fetch failed)
- https://github.com/aztekgold/obsidian-tables/blob/main/src/SortHandler.ts (fetch failed)

## Assessment

- New information ratio: 1.00 (five new findings against an empty lineage registry; the ratio measures novelty, not completeness).
- Questions addressed: top-level persistence model; column kinds; formula persistence/evaluation; views/sorts/filters/embeds; source locations.
- Questions answered: documented semantic column set; high-level formula and view/embed behavior; canonical source map.
- Coverage limitation: exact JSON object shapes remain unanswered.

## Reflection

- What worked and why: the rendered repository README exposed a detailed behavioral contract, and the source tree identified the exact implementation surfaces without relying on minified installed code.
- What did not work and why: every source-body transport failed at the network/cache/safety layer, so interfaces and serializer implementations could not be inspected.
- What I would do differently: begin the next iteration from an environment with a local checkout or functioning GitHub raw/API access, then use line-numbered reads of `types.ts`, all `fileHandlers`, view/filter/sort handlers, and repository-wide `.table.md`/JSON fixtures.

## Recommended Next Focus

Resolve source-body access first, then extract an exhaustive field table from `src/types.ts` and serializer/default constructors, cross-check it against every `.table.md` fixture and column editor. Record exact keys, optionality, default values, ID/reference formats, and one minimal valid JSON document before moving to AI mutation recipes.

