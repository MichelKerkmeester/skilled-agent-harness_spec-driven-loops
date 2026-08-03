# Obsidian Tables — File-Layer AI Knowledge Base

## 1. Executive summary

`aztekgold/obsidian-tables` stores each table as one portable `.table.md` file. Its payload is JSON embedded in Markdown, not raw JSON. Repository `main` uses the Agentable 1.0 model: root `{version, metadata, policy?, columns, views, rows}`, stable structural IDs, cells keyed by column ID, and arrays as the authoritative ordering mechanism. [README](https://github.com/aztekgold/obsidian-tables#tables-for-obsidian) [types.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts) [MarkdownFileHandler.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/MarkdownFileHandler.ts)

For a file-layer AI: parse the Markdown wrapper before the JSON; patch by stable IDs while preserving unknown fields and unrelated Markdown; validate a staged full document before atomic replacement; retain a backup; and recompute formula cells plus derived `table-links` after relevant changes.

## 2. Scope, provenance, and confidence

This report describes repository `main`, cross-checked across declared types, file handlers, migration code, formula/filter/sort execution, settings, and the README. It does not prove parity with an arbitrary installed release. **Source-confirmed** facts follow directly from cited code/docs. **Inference** labels runtime conventions derived by combining implementations where `cells` is intentionally typed as `unknown`. Iteration 1 established the public contract and source map; iteration 2 obtained source bodies and resolved the exact persistence questions. [Source tree](https://github.com/aztekgold/obsidian-tables/tree/main/src) [Agentable](https://github.com/aztekgold/agentable)

## 3. Exact `.table.md` wrapper

**Source-confirmed.** A Markdown-backed table has YAML frontmatter containing `json-table-plugin: true` and a fenced `json-table` block containing the JSON. Save preserves other frontmatter/body content and regenerates `table-links` from link-column cells. [MarkdownFileHandler.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/MarkdownFileHandler.ts)

````markdown
---
json-table-plugin: true
table-links: []
---

```json-table
{
  "version": "agentable-1.0.0",
  "metadata": { "title": "Tasks" },
  "columns": [],
  "views": [],
  "rows": []
}
```
````

Do not pass the whole file to `JSON.parse`. Locate the marker, extract exactly the `json-table` fence, parse its body, and preserve everything outside the replaced payload. Bare JSON is a separate handler, not the `.table.md` representation. [JsonFileHandler.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/JsonFileHandler.ts)

## 4. Canonical root, identity, and ordering

**Source-confirmed.** [types.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts)

| Root key | Shape | Required | Meaning |
|---|---|---:|---|
| `version` | string | yes | Current value `agentable-1.0.0`. |
| `metadata` | object | yes | Requires `title`; preserve additional metadata. |
| `policy` | object | no | Optional agent-operation policy. |
| `policy.permissions` | object | no | Optional `allowAgentRead/Create/Update/Delete` booleans. Absence is not explicit permission. |
| `columns` | array | yes | Column definitions; array is base order. |
| `views` | array | current/repairable | Named presentation configurations. |
| `rows` | array | yes | Manual row order when no active sort overrides it. |

There is no root order key. Arrays order columns, views, rows, sorts, and filters. Structural IDs use `col_`, `view_`, `flt_`, and `srt_` prefixes with random suffixes. Row IDs combine sortable Base36 time and randomness. Preserve IDs; generate collision-resistant replacements only after checking the document. Rows are exactly `{id, cells}`, and cells are keyed by stable column ID, never display name. [migrateUtils.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/utils/migrateUtils.ts) [Agentable](https://github.com/aztekgold/agentable)

## 5. Column definitions and every requested type

**Source-confirmed.** A column is `{id, name, type, display?, constraints?}`. `display` optionally holds `width` and `dateFormat`; `constraints` optionally holds `options`, `multiSelect`, `suggestAllFiles`, `wrap`, `formula`, and `formulaResultKind`. Options are `{value,color?}` and cells store the option value. [types.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts)

| User-facing kind | Canonical `type` | Additional definition | Runtime value |
|---|---|---|---|
| Text | `text` | optional `constraints.wrap` | string |
| Number | `number` | none required | number or numeric string |
| Checkbox | `boolean` | none required | JSON boolean |
| Select | `select` | `constraints.options` | one option-value string |
| Multi-select | `select` | `constraints.multiSelect:true`; options | array of option-value strings |
| URL | `url` | none required | string; link only if pattern-valid |
| Email | `email` | none required | string; link only if pattern-valid |
| Note link | `link` | optional `suggestAllFiles` | vault-link/path string |
| Date | `date` | optional `display.dateFormat` | epoch-millisecond number |
| Formula | `formula` | formula + optional result-kind cache | persisted computed string |

The README shows ten UI kinds, but the canonical union has nine type strings: multi-select is constrained select. [README: types](https://github.com/aztekgold/obsidian-tables#multiple-column-types) [migrateUtils.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/utils/migrateUtils.ts)

## 6. Cell encodings and normalization

The interface types cell values as `unknown`; the key-by-column-ID rule is confirmed, while this complete value table is a **runtime inference** cross-checked against sort/filter/formula/render/migration paths. [types.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts) [SortHandler.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/SortHandler.ts)

- Text, URL, email, link, and single-select: strings.
- Multi-select: string arrays matching option `value`s.
- Boolean: native `true`/`false`, not strings.
- Number: native number or numeric string; writers should prefer numbers unless preserving representation.
- Date: epoch milliseconds; display format does not change storage.
- Formula: last computed result as a string; failure writes `""`.
- Missing, `null`, and empty string can render/filter differently; preserve existing empty conventions unless deliberately migrating.

## 7. Minimal complete example

IDs below are illustrative; production IDs must be collision-resistant. [types.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts)

````markdown
---
json-table-plugin: true
table-links: []
---

```json-table
{
  "version": "agentable-1.0.0",
  "metadata": { "title": "Tasks" },
  "policy": { "permissions": { "allowAgentRead": true, "allowAgentCreate": true, "allowAgentUpdate": true, "allowAgentDelete": false } },
  "columns": [
    { "id": "col_task", "name": "Task", "type": "text", "display": { "width": 220 }, "constraints": { "wrap": true } },
    { "id": "col_done", "name": "Done", "type": "boolean" },
    { "id": "col_status", "name": "Status", "type": "select", "constraints": { "options": [{ "value": "Todo", "color": "red" }, { "value": "Done", "color": "green" }] } },
    { "id": "col_tags", "name": "Tags", "type": "select", "constraints": { "multiSelect": true, "options": [{ "value": "AI", "color": "blue" }] } },
    { "id": "col_due", "name": "Due", "type": "date", "display": { "dateFormat": "YYYY/MM/DD" } },
    { "id": "col_label", "name": "Label", "type": "formula", "constraints": { "formula": "{{ col_task }}", "formulaResultKind": "text" } }
  ],
  "views": [{
    "id": "view_all", "name": "All",
    "sorts": [{ "id": "srt_due", "columnId": "col_due", "direction": "asc" }],
    "filters": [{ "id": "flt_open", "columnId": "col_done", "operator": "isNot", "value": true }],
    "hiddenColumns": [],
    "columnOrder": ["col_done", "col_task", "col_status", "col_tags", "col_due", "col_label"]
  }],
  "rows": [{ "id": "m0example001", "cells": { "col_task": "Ship", "col_done": false, "col_status": "Todo", "col_tags": ["AI"], "col_due": 1785715200000, "col_label": "Ship" } }]
}
```
````

## 8. Formulas

**Source-confirmed.** Authors enter `{{ Column Name }}`, but the editor converts names to stable IDs such as `{{ col_task }}` before persistence. Source lives at `column.constraints.formula`; `formulaResultKind` caches `number`, `date`, or `text`. Recompute writes each result into `rows[].cells[formulaColumnId]` as a string. Failure writes empty string, renders an em dash, and may clear result kind. Supported documented operations include arithmetic, comparisons, `if`, `contains`, `today`, and `date`. [FormulaHandler.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/FormulaHandler.ts) [FormulaRenderer.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/FormulaRenderer.ts) [README: formulas](https://github.com/aztekgold/obsidian-tables#formulas)

Safe edits use ID references and recompute formulas whose dependencies changed. A name-based hand edit may self-heal once, but duplicate names use the first match and are ambiguous.

## 9. Views, filters, sorts, ordering, and embeds

**Source-confirmed.** Views are `{id,name,sorts,filters,hiddenColumns,columnOrder}`. Sorts are `{id,columnId,direction:"asc"|"desc"}`. Filters are `{id,columnId,operator,value?}` with operators `contains`, `doesNotContain`, `startsWith`, `endsWith`, `isEmpty`, `isNotEmpty`, `gt`, `lt`, `is`, `isNot`. Rules are flat and ANDed; no nested OR/group schema was verified. Hidden/order arrays contain column IDs. [types.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts) [FilterHandler.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/FilterHandler.ts)

The UI persists multiple sort rules, but current `getSortedRows()` applies only `rules[0]`: a confirmed divergence from README “multi-level sorting.” Preserve extra rules for compatibility, but put the required current behavior first. [SortHandler.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/SortHandler.ts) [README: views](https://github.com/aztekgold/obsidian-tables#views-sorting--filtering)

An embed without alias selects the first/default view. `![[MyTable.table.md|Sprint Board]]` pins a named view and creates it if missing, which may write the table during rendering. Visible-column search is a feature but no persisted search-query field was found. [README: embeds](https://github.com/aztekgold/obsidian-tables#embeds)

## 10. Features, commands, and settings

**Source-confirmed surface:** inline editing; column create/rename/reorder/resize; row create/reorder; option colors; date formats; formulas; named views; filters/sorts; visible-column search; Markdown embeds; CSV import/export; link maintenance; autosave; mobile layouts. [README](https://github.com/aztekgold/obsidian-tables) [main.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/main.ts)

The primary command/file-menu action is **New table**; CSV import appears when enabled. Exact exhaustive command IDs and every notice string were not enumerated within two iterations, so none are invented here. Settings are `tableRenderer:"default"|"json"` (default Markdown/default), `enableBetaFeatures:false`, `enableCsvSupport:false`, and `stickyActionColumn:false`. [types.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts) [main.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/main.ts)

CSV import treats the first parsed row as headers, creates only text columns (`col_0`, `col_1`, …) of width 150, and stores strings without inference. Export reads current cells, including formula cells. [CsvFileHandler.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/CsvFileHandler.ts)

## 11. Safe file-layer AI operations

1. Read full bytes and retain a backup.
2. Confirm marker; locate one valid fence; parse JSON; require root arrays.
3. Index all column/view/row/nested IDs and reject duplicates.
4. Honor explicit `policy.permissions`; absence is not affirmative authorization.
5. Patch by ID; preserve unknown keys, unrelated Markdown/frontmatter, and extra sorts.
6. Validate values/options and all cell/filter/sort/hidden/order/formula references.
7. Recompute affected formula cells and regenerate `table-links`.
8. Serialize two-space JSON into a sibling staged document.
9. Reparse the staged Markdown and re-run referential-integrity checks.
10. Atomically replace only after validation; keep backup until Obsidian opens it.

Source establishes parse/save/migration/formula/link behavior; backup, staging, and atomic replacement are a labeled **safety inference** derived from that contract.

## 12. Migrations

**Source-confirmed mappings.** [migrateUtils.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/utils/migrateUtils.ts)

| Legacy | Canonical |
|---|---|
| `checkbox` | `boolean` |
| `dropdown` | `select` |
| `multiselect` / `multi-select` | `select` + `constraints.multiSelect:true` |
| `notelink` / `wikilink` | `link` |
| `function` | `formula` |
| column `width` / `dateFormat` | `display.width` / `display.dateFormat` |
| old options/colors | `constraints.options:[{value,color?}]` |
| row arrays/cell objects | `{id,cells}` keyed by column ID |
| old filter/sort names | current `{id,columnId,...}` |

Empty bare JSON loads as an empty table with a default view; missing views are repaired. Migrations occur in memory and canonicalize on next save. Preserve valid IDs/unknown keys, generate only missing IDs, validate, and save once. CSV should first import as text, then undergo a separately approved type migration. [JsonFileHandler.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/JsonFileHandler.ts)

## 13. Troubleshooting and edge cases

| Symptom/condition | Cause and recovery |
|---|---|
| Ordinary Markdown / invalid table | Restore `json-table-plugin: true`. |
| Cannot extract block | Restore one correctly labeled `json-table` fence. |
| `Invalid embedded JSON` / `Invalid JSON` | Fix syntax/trailing comma in the appropriate fenced/bare representation; reparse staged file. |
| Invalid structure | Restore `columns`/`rows` arrays and current/repaired `views`. |
| Data lost after JSON parse | Restore backup; extract fence rather than parsing whole Markdown. |
| Formula em dash/empty cell | Repair unknown dependency, syntax, or value type; recompute. |
| Wrong formula dependency | Duplicate names choose first; replace with stable ID references. |
| Wrong formula formatting | Recompute stale/cleared `formulaResultKind`; do not guess it. |
| Extra sorts ignored | Current runtime executes only first; reorder while preserving others. |
| Manual row reorder seems ignored | Active sort overrides presentation; row array remains base order. |
| Unexpected filter exclusions | All rules are ANDed; validate each operator/value. |
| Need OR/group filters | No verified persisted grouping; use separate views, not invented keys. |
| Select missing label/color | Cell must match an option `value`; add/correct deliberately. |
| Multi-select wrong | Use `type:"select"`, `multiSelect:true`, and string array. |
| Checkbox is text | Use canonical `boolean` plus native JSON boolean. |
| Date wrong | Store epoch milliseconds; convert with explicit timezone semantics. |
| URL/email not clickable | String fails URL/email pattern; type alone does not validate it. |
| Stale `table-links` | Rescan link columns and regenerate derived frontmatter. |
| Embed unexpectedly writes | Missing named alias view is auto-created; pre-create/check it. |
| Missing view | Allow canonical default repair, then save once. |
| Colliding IDs/dangling refs | Validate uniqueness and all references before replacement. |
| Stale formula export | Recompute; CSV export reads stored formula cells. |
| CSV imports all text | Expected behavior; run explicit second type migration. |
| Unknown fields disappear | Patch original object rather than reconstructing narrow schema. |
| Installed behavior differs | Pin installed version and compare its tag/source. |

## 14. Usage recipes

- **Create:** build canonical root with at least one view and unique IDs; wrap, stage, reparse, atomically install.
- **Query:** index columns by ID/name; project `rows[].cells[id]`; AND all filters; to match current runtime apply first sort only.
- **Add/patch row:** unique row ID, known column IDs, canonical values, recomputed dependents; preserve omitted cells.
- **Select option:** append unique `{value,color?}`; use arrays only for multi-select.
- **View:** unique `view_` ID; initialize all four arrays; use column IDs; place critical sort first.
- **Rename/delete column:** rename changes only `name`; before delete remove/migrate every cell, formula, filter, sort, hidden, and order reference.
- **CSV:** import strings first; validate; convert types in a second transaction.
- **Legacy migration:** apply section 12 in memory; preserve IDs/unknowns; validate, back up, save once, reopen.

## 15. Eliminated alternatives

- Bare-JSON `.table.md`: eliminated by Markdown handler.
- Canonical `multi-select` type: eliminated by current types/migration.
- Render-only formula results: eliminated by persisted recomputation.
- All stored sorts execute: eliminated by current `rules[0]` implementation.
- README labels as schema keys: eliminated; source types/serializers are authoritative.
- Raw/blob/API/CDN retry in iteration-1 environment: exhausted by DNS/cache/safety failures; connector succeeded.
- Minified `main.js` as primary source: unnecessary for current-source contract; relevant only to installed-version parity.

## 16. Divergence map and open questions

| Area | Documentation/expectation | Verified source/runtime |
|---|---|---|
| Types | Ten UI kinds | Nine strings; multi-select is constrained select. |
| Sorting | Multi-level | Multiple persist, first executes. |
| Formulas | Live computation | Definition and last result persist. |
| Portability | “JSON table” | Markdown wraps JSON. |
| Search | Visible-column feature | No persisted search field verified. |
| Complex filters | Broad README wording | Flat ANDed list; no group/OR schema verified. |

Open, non-blocking: (1) which tag/commit matches the installed plugin; (2) whether a later release fixes multi-sort; (3) exhaustive command IDs and every notice string.

## 17. References and convergence report

Primary sources: [README](https://github.com/aztekgold/obsidian-tables), [types](https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts), [Markdown handler](https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/MarkdownFileHandler.ts), [JSON handler](https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/JsonFileHandler.ts), [CSV handler](https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/CsvFileHandler.ts), [migration](https://github.com/aztekgold/obsidian-tables/blob/main/src/utils/migrateUtils.ts), [formula handler](https://github.com/aztekgold/obsidian-tables/blob/main/src/FormulaHandler.ts), [formula renderer](https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/FormulaRenderer.ts), [filter handler](https://github.com/aztekgold/obsidian-tables/blob/main/src/FilterHandler.ts), [sort handler](https://github.com/aztekgold/obsidian-tables/blob/main/src/SortHandler.ts), [main](https://github.com/aztekgold/obsidian-tables/blob/main/src/main.ts), and [Agentable](https://github.com/aztekgold/agentable).

Convergence: **complete after 2 iterations**. Stop reason: **`maxIterationsReached`**, required by `maxIterations:2` and `stopPolicy:max-iterations`, not early convergence. Iteration 1 added five novel README/source-map findings but could not fetch source bodies. Iteration 2 added twelve source-backed findings resolving wrapper, root, columns, rows, views, formulas, migration, settings, CSV, and workflows. Remaining parity/UI questions do not invalidate the repository-`main` persistence model.

