# Iteration 5: Failure catalog, formula diagnostics, and AI troubleshooting

## Focus

Catalog malformed JSON/Markdown/CSV symptoms, formula parse/type/runtime failures, schema edge cases, and practical AI recipes that avoid silent corruption.

## Actions Taken

- Read the tokenizer, parser, evaluator, formula renderer, Markdown/JSON/CSV handlers, inline renderer, and source-level validation paths.
- Cross-checked each failure symptom against the actual thrown error or fallback behavior, distinguishing UI symptoms from file-layer causes.
- Ran this pass despite convergence telemetry because the configured stop policy is `max-iterations`.

## Findings

### 1. `.table.md` troubleshooting matrix

| Symptom | Source-level cause | Safe recovery |
|---|---|---|
| “Missing `json-table-plugin: true` in frontmatter” | No frontmatter, wrong key, or value is not boolean `true` | Preserve the file, add/repair the exact frontmatter key, then re-read; do not replace the body with raw JSON. |
| “Could not find ` ```json-table ` code block start” | No matching fenced block | Add one block only after confirming this is intended to be a table file. |
| “Could not extract content from ` ```json-table ` code block” | Start marker exists but the regex cannot extract a closing fence/payload | Repair fence boundaries and re-parse before writing. |
| “Invalid embedded JSON: …” | `JSON.parse` failed or the parsed value lacks `columns`/`rows` arrays | Restore from backup/diff, fix JSON syntax, and validate the root before retrying. |
| Table opens as an error with “Open as raw text” | Handler rejected the file or rendering failed | Use raw text to inspect the original wrapper; do not click-save until the payload is repaired. |

The handler reads the first matching `json-table` block and saves by replacing the first matching block. Multiple blocks are therefore ambiguous; an AI should require exactly one target block or use a deterministic surrounding marker. An empty block is accepted and produces an empty table with a default view. `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/MarkdownFileHandler.ts]` `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/JsonTableView.ts]`

Important distinction: `.table.md` is still Markdown to Obsidian. The plugin only treats it as a table when the frontmatter marker and fenced block pass its handler. A file containing valid JSON outside that block is not a valid table payload. `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/MarkdownFileHandler.ts]`

### 2. `.table.json` troubleshooting

An empty `.table.json` is treated as a new empty table (`metadata.title` from the file basename, empty columns/rows, default view). Whitespace-only content is nonempty and reaches `JSON.parse`, so it fails as invalid JSON. Parse errors are wrapped as `Invalid JSON: <native message>`. A parsed object missing `columns`, `rows`, or `views` ultimately throws `Invalid table JSON: missing columns, rows, or views.` after view normalization. Unknown truthy `version` strings are accepted; the handler does not enforce an exact version. `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/JsonFileHandler.ts]` `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/utils/migrateUtils.ts]`

The handler does not deeply validate column IDs, duplicate IDs, cell key types, option references, or row shapes. Those can render blank, sort unexpectedly, break formula references, or be silently ignored. An AI should perform stricter validation than the plugin before writing. This is an inference from the shallow source checks. `[INFERENCE: source handlers cast parsed JSON to TableData and only explicitly validate root arrays]` `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/JsonFileHandler.ts]`

### 3. Formula syntax and type errors

The tokenizer accepts `{{ column }}`, quoted strings, numeric literals, `+ - * /`, `== > <`, parentheses, commas, and bare identifiers only for function calls. It rejects other characters, unterminated `{{...}}`, empty `{{}}`, and unterminated strings with position-bearing errors. String escaping is not implemented, so a quote inside a literal cannot be represented with a backslash escape. `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/formula/tokenizer.ts]`

The parser permits at most one comparison and rejects trailing tokens. Common failures include missing parentheses, chained comparisons, unsupported operators (`!=`, `>=`, `<=`, `%`, boolean conjunctions), bare column names, and unknown function syntax. `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/formula/parser.ts]`

Type/evaluation failures include:

- arithmetic with text/date operands: `"+" can only be used between number columns`;
- `>`/`<` with nonnumeric operands: `"<" can only be used between number or date columns`;
- unary minus on non-number;
- unknown or deleted column reference;
- Formula column referencing another Formula column;
- `if()` with the wrong arity or a non-comparison first argument;
- `contains()` with the wrong arity or a non-column first argument;
- `today()` with arguments;
- `date()` with the wrong arity, nonliteral format, invalid token layout, mismatched input, or invalid month/day range;
- runtime nonnumeric data in a number/date source cell;
- division by zero.

`recomputeAll()` catches parse/type/evaluation failures, writes an empty string into the formula cell, marks the cell errored, and the renderer shows `—`; the detailed exception is not serialized into the file. `formulaResultKind` is unset when inference fails. An AI troubleshooting a visible em dash should inspect the formula expression, referenced column IDs/types, source cell values, and plugin console rather than treating the dash as data. `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/FormulaHandler.ts]` `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/formula/evaluator.ts]` `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/FormulaRenderer.ts]`

Subtleties for AI formula evaluation:

- `contains()` performs exact case-insensitive membership for multi-select values split on commas, but substring matching for other columns.
- `today()` is local midnight, not the current instant.
- `date()` supports fixed-width `YYYY`/`YY`/`MM`/`DD` tokens only; it does not support `MMMM`/`M`/`D` in formula parsing, even though date display formats support month names.
- Formula `if()` results are numeric only when both branches infer as numbers; omitted false branches make the result text-shaped.
- The tokenizer's number loop permits multiple dots and then uses `parseFloat`, so malformed literals such as `1.2.3` deserve an explicit AI-side numeric-literal check rather than blind trust. `[INFERENCE: tokenizer accepts the whole token but parser calls parseFloat]` `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/formula/tokenizer.ts]`

### 4. CSV edge cases

The CSV parser handles quoted commas and doubled quotes, trims each field, drops blank lines, and accepts jagged rows. It splits the entire file into physical lines before parsing each line, so a quoted field containing a newline is not safely preserved despite CSV export quoting newlines. Unmatched quotes are not reported as a parse error. These are confirmed implementation limitations. `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/utils/csv.ts]`

An empty CSV becomes zero columns and zero rows. Duplicate/empty headers are accepted. Imported cells are text and direct CSV row IDs are regenerated on each read. For durable AI import, normalize headers/row widths, preserve a source copy, and write a `.table.md` or `.table.json` table instead of editing CSV in place. `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/CsvFileHandler.ts]` `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/JsonTableView.ts]`

### 5. IDs, aliases, and silent-data risks

- Duplicate column IDs are not rejected; they can make `cells` and formula resolution ambiguous. Generate and validate uniqueness.
- Duplicate column names are tolerated; formula authoring resolves the first exact name match and reports a warning.
- Missing row cell keys render as empty; extra cell keys have no visible column and may be lost by CSV export.
- Legacy aliases are normalized only on load/save; a file-layer AI should migrate before querying.
- `columnOrder` and later `sorts` entries can look authoritative in JSON but are not fully honored by current renderer code.
- `policy.permissions` is typed but not enforced by the plugin, so it cannot be used as a security boundary.
- Note-link cells are path strings; `table-links` is derived Markdown frontmatter, not the row-value encoding.

These are source-confirmed except the consequence wording about downstream ambiguity, which is a direct inference from the lack of uniqueness checks and ID-based lookup. `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts]` `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/utils/migrateUtils.ts]` `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/FormulaHandler.ts]` `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/DivTableRenderer.ts]`

### 6. AI-usage recipes

**Read/query:** parse the wrapper, map IDs, normalize legacy aliases, apply only source-confirmed view semantics, and label formula freshness. Return row IDs with results so a later patch is stable.

**Add/patch:** read the entire file, locate the unique payload, patch by row/column IDs, preserve all other JSON and Markdown, validate uniqueness/references, write atomically, re-read, and report a diff. Never patch by row index.

**Formula update:** edit source columns or `constraints.formula`; avoid writing a guessed formula output. If the plugin is not being run, mark computed values as potentially stale.

**CSV import:** use quote-aware parsing, normalize row widths, create text columns, then perform a separately reviewed type-conversion pass.

**Migration:** retain a byte-level backup, transform only the JSON object, preserve the Markdown wrapper, use the plugin's alias mappings, validate default view and IDs, and re-read after save.

**Embed view:** before writing `![[Name.table.md|View]]`, check whether creating a missing view is intended because the plugin persists that view as a side effect.

These are operational recipes inferred from the source contracts and README's explicit AI-friendly positioning. `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/README.md]` `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/MarkdownFileHandler.ts]` `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/utils/migrateUtils.ts]`

## Questions Answered

- Which malformed-file, parsing, formula, and edge-case symptoms are observable, and what recipes avoid them? **Answered with handler messages, parser/evaluator failures, limitations, and recovery procedures.**

## Questions Remaining

- No material source question remains for the requested current `main` scope. Version drift after the inspected repository state is an external maintenance concern.

## Ruled Out

- Treating formula em dashes as literal stored values.
- Assuming CSV multiline fields, strict IDs, policy enforcement, or exact version validation.
- Treating display date formats as formula `date()` parsing formats.

## Sources Consulted

- `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/README.md]`
- `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/MarkdownFileHandler.ts]`
- `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/JsonFileHandler.ts]`
- `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/utils/csv.ts]`
- `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/CsvFileHandler.ts]`
- `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/formula/tokenizer.ts]`
- `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/formula/parser.ts]`
- `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/formula/evaluator.ts]`
- `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/FormulaHandler.ts]`
- `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/FormulaRenderer.ts]`
- `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/InlineTableRenderer.ts]`
- `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts]`
- `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/DivTableRenderer.ts]`

## Assessment

- `newInfoRatio`: `0.61`
- Novelty: exact handler messages and formula tokenizer/evaluator edge cases were added; the remaining pass intentionally broadens troubleshooting rather than stopping on convergence telemetry.

## Reflection

The five required angles are covered: schema, views, features, workflows, and failure recovery. Synthesis can now consolidate the source-cited knowledge base and preserve the two major implementation caveats (single-level sort and ignored columnOrder).

## Recommended Next Focus

Synthesize `research.md` and `resource-map.md` inside the lineage, include the full JSON examples and troubleshooting matrix, then verify all five iteration/delta artifacts and the max-iteration stop reason.
