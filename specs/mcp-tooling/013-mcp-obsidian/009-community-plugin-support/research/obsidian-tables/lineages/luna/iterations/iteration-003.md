# Iteration 3: Commands, settings, file routing, and import paths

## Focus

Inventory the plugin's commands and settings, identify the exact creation/import formats, and document which file operations an AI can safely reproduce at the vault file layer.

## Actions Taken

- Read the command registration, settings tab, file extension routing, view save path, table creation, CSV import, and link-maintenance code.
- Cross-checked current settings and installation behavior against `types.ts`, `manifest.json`, the README, and the changelog.

## Findings

### 1. Settings and defaults

`DEFAULT_SETTINGS` is:

```json
{
  "tableRenderer": "default",
  "enableBetaFeatures": false,
  "enableCsvSupport": false,
  "stickyActionColumn": false
}
```

The setting name `tableRenderer` is a file-format selector, not a second rendering engine in current 1.5.0: `default` creates `.table.md`; `json` creates `.table.json`. The legacy HTML renderer was removed. `enableBetaFeatures` enables row drag/reorder and the row-selection/bulk-action UI. `enableCsvSupport` permits `.csv` opening in the table view. `stickyActionColumn` keeps row actions visible while horizontally scrolling. `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts]` `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/main.ts]` `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/CHANGELOG.md]`

### 2. Commands and context-menu actions

The registered commands are:

- `create-new-table` / **Create new table**: available when an active file has a folder or when the vault root is usable; creates in the active file's parent or root. The file explorer also exposes **New table** on folders.
- `import-csv` / **Import CSV file**: opens a file picker, parses the selected CSV, and creates a new table next to the active file (or at root).
- `add-table-inline` / **Add table inline**: inserts a ` ```jsontable ` fenced block containing the skeleton JSON at the editor cursor.

Column/row actions are UI operations rather than command-palette commands: add/delete columns and rows, rename a table/view, hide columns, edit options/formulas, export table/view CSV, and reorder rows/columns. `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/main.ts]` `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/TableMenuManager.ts]` `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/DivTableRenderer.ts]`

### 3. `.table.md` creation and routing

The default creator writes a wrapper like:

```markdown
---
json-table-plugin: true
table-links: []
---

## New table

<!-- Do not edit the code block below manually -->

```json-table
{ "version": "agentable-1.0.0", "metadata": { "title": "New Table" }, "columns": [], "views": [], "rows": [] }
```
```

The actual skeleton has two text columns and one empty row. The exact body title and metadata title can differ (`main.ts` uses `New Table` in the JSON metadata and the generated filename for the heading). The Markdown handler accepts additional prose around the block and preserves it on save, but it requires exact boolean frontmatter `json-table-plugin: true`. `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/main.ts]` `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/MarkdownFileHandler.ts]`

File routing is extension-based: `.table.md` uses `MarkdownFileHandler`, `.table.json` uses `JsonFileHandler`, and `.csv` uses `CsvFileHandler` only when CSV support is enabled. The plugin registers `table.md`, `json`, and optionally `csv` extensions, but a generic `.json` that is not `.table.json` falls back to a normal text/Markdown view. `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/utils/fileUtils.ts]` `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/JsonTableView.ts]` `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/main.ts]`

### 4. Direct JSON and Markdown saves

`.table.json` saves are `JSON.stringify(data, null, 2)` through `vault.process`, after `ensureViewsValid()`. `.table.md` saves also use `vault.process`, replace the first matching `json-table` block, preserve surrounding body text, force the plugin frontmatter key to true, and rewrite `table-links` from all link-column cell paths as `[[path]]` entries. If no matching block exists, the handler appends a new block to the body. `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/JsonFileHandler.ts]` `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/MarkdownFileHandler.ts]`

`JsonTableView.saveTableData()` is the normal write path. It validates the extension/handler before saving and uses the current view's `vault.process` operation. A safe AI patch should use the same read/parse/modify/serialize pattern and preserve fields it does not own, especially frontmatter and unrelated Markdown body content. `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/JsonTableView.ts]`

### 5. CSV import versus direct CSV opening

The **Import CSV file** command is the reliable conversion workflow. It parses the header row, creates every imported column as `type: "text"` with width 150, generates row IDs, creates a default view, and writes a new `.table.md` or `.table.json` according to `tableRenderer`. The output filename is the CSV basename sanitized to ASCII letters/numbers/hyphens/underscores, with an incrementing suffix for collisions. `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/main.ts]`

Direct `.csv` opening is different: `CsvFileHandler` parses headers and rows into an in-memory Agentable table, assigning `col_0`, `col_1`, etc. and new row IDs. Although `CsvFileHandler.save()` exists, `JsonTableView.saveTableData()` deliberately returns early for `.csv`, so UI edits are not written back to the CSV. Treat direct CSV view as a transient inspection/edit surface; use import to persist into a table file. `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/CsvFileHandler.ts]` `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/JsonTableView.ts]`

### 6. CSV parser behavior relevant to AI imports

The parser supports quoted commas, doubled quotes, and line-ending variants. It trims each parsed field, drops blank lines, takes the first nonblank line as headers, and permits jagged data rows. There is no type inference: imported cells are strings. An AI doing its own conversion should normalize row lengths to the header count before writing a table; otherwise extra cells have no matching column and short rows produce missing cells. `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/utils/csv.ts]`

### 7. Smart link maintenance

On vault rename/delete events, the plugin scans every `.table.md` and `.table.json` file (and CSV when enabled), reads each table, and updates/removes exact link-column values matching the old/deleted path. A rename changes matching cells to the new path; deletion changes them to `""`. This is a broad side effect, so an AI patching a link path should snapshot affected files or perform the same exact-path scope check before writing. `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/main.ts]` `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/MarkdownFileHandler.ts]`

### 8. Installation/current release context

The repository manifest identifies version 1.5.0, mobile-capable (`isDesktopOnly: false`). The README still labels Community Plugins as “Coming Soon” and documents manual installation of `main.js`, `manifest.json`, and `styles.css`; BRAT/manual GitHub installation is therefore the operational assumption for the current repository state. `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/manifest.json]` `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/README.md]`

## Questions Answered

- What commands, settings, and user-facing feature behavior must an AI account for when operating the vault? **Answered, including defaults and side effects.**
- Which creation/import path is persistent? **`.table.md`/`.table.json` creation and Import CSV are persistent; direct CSV edits are not.**

## Questions Remaining

- What exact safe create/add/patch/query/migration recipes should the final knowledge base prescribe?
- What malformed JSON, Markdown extraction, CSV, and formula error messages and recovery steps are observable?
- Which source claims are implementation caveats versus intended behavior?

## Ruled Out

- Do not treat `tableRenderer` as a visual renderer choice in v1.5.0.
- Do not use direct `.csv` table editing when the goal is a persisted vault mutation.
- Do not overwrite a `.table.md` file with raw JSON; its frontmatter and fenced block are part of the file contract.

## Sources Consulted

- `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/main.ts]`
- `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/JsonTableView.ts]`
- `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts]`
- `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/utils/fileUtils.ts]`
- `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/JsonFileHandler.ts]`
- `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/MarkdownFileHandler.ts]`
- `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/CsvFileHandler.ts]`
- `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/utils/csv.ts]`
- `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/manifest.json]`
- `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/README.md]`
- `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/CHANGELOG.md]`

## Assessment

- `newInfoRatio`: `0.84`
- Novelty: command IDs, settings defaults, exact wrapper writes, extension routing, non-persistent direct CSV edits, and broad smart-link side effects were confirmed from source.

## Reflection

Operational constraints are now clear. The next pass should turn them into file-layer recipes with explicit invariants, including atomic read/modify/write and schema-preserving migration.

## Recommended Next Focus

Construct and verify AI workflows for creating valid files, appending/patching rows, importing CSV, querying rows, safely patching in place, and migrating legacy payloads without losing wrapper/body data.
