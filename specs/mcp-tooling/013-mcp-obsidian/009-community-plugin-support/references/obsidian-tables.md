# Reference — obsidian-tables (interactive JSON tables)

> Destined for `mcp-tooling/mcp-obsidian/references/` at Phase 5. Operate this plugin at the **file layer**: edit the `.table.md` JSON the plugin renders.

## 1. IDENTITY (verified)

| Field | Value |
|-------|-------|
| Repo | `aztekgold/obsidian-tables` |
| Author | Aztekgold · License MIT |
| Install | Manual (drop `main.js`, `manifest.json`, `styles.css` into `<vault>/.obsidian/plugins/tables/`) or BRAT; community list "Coming Soon" |
| Data format | A single **JSON file** per table with the `.table.md` extension |

## 2. WHAT IT DOES

Interactive database-style tables inside Obsidian — a middle ground between a spreadsheet and a database. Column types: **Text, Number, Checkbox, Select, Multi-select, URL, Email, Note Link, Date, Formula**. Multiple **Views** (filtered/sorted perspectives of the same data), multi-level sort, complex filters, drag-to-reorder, inline resize, CSV export, and note-link graph integration.

## 3. DATA MODEL — the file the AI operates

Each table is stored as a **JSON document in a `.table.md` file**. Reference/embed it from other notes:
```
![[MyTable.table.md]]
![[MyTable.table.md|Sprint Board]]     ← pin a specific saved View by alias
```

The exact JSON schema is not fully public — treat the following as the **representative shape to VERIFY against a real generated `.table.md`** (create one in-app once, then match it):
```
{
  "columns": [ { "name": "...", "type": "text|number|checkbox|select|multiselect|url|email|notelink|date|formula", "options"?: [...] } ],
  "rows":    [ { "<Column Name>": <value>, ... } ],
  "views"?:  [ { "name": "...", "filters": [...], "sorts": [...] } ]
}
```
`VERIFY` the real key names (`columns`/`rows`/`views` and per-column keys) before programmatic writes.

**Formulas** use `{{ Column Name }}` interpolation with operators (`+ - * /`, `== > <`) and functions (`if()`, `contains()`, `today()`, `date()`):
```
{{ Price }} * {{ Quantity }}
{{ Due Date }} < today()
if({{ Status }} == "Done", "✅", "⏳")
date("01/10/26", "DD/MM/YY")
```
Formula results are computed **by the plugin on render**, not stored — the AI writes the formula string; it evaluates when the note is opened.

## 4. SETTINGS

Row-reorder toggle · Select/Multi-select color customization · date format (default `YYYY-MM-DD`, accepts patterns like `DD/MM/YY`) · smart-link backlink updates on note rename/delete.

## 5. IN-APP USAGE (context only — the mode does NOT drive the UI)

Create via file-explorer right-click or command palette → "New table"; add/delete rows and columns via buttons; rename a column by clicking its header. The mode achieves equivalent results by editing the `.table.md` JSON directly.

## 6. FILE-LAYER RECIPES (via mcp-obsidian CLI/MCP)

- **Create a table** → write a new `<name>.table.md` with the `columns`/`rows` JSON (match the verified schema). Embed it with `![[<name>.table.md]]`.
- **Add a row** → read the JSON, append to `rows`, write back.
- **Query/filter** → read the JSON and filter `rows` in code (the AI can compute; the plugin's Views are UI-only).
- **Add a formula column** → add a `formula`-type column with a `{{ … }}` expression; it renders when opened in Obsidian.

## 7. GOTCHAS / VERIFY

- The JSON schema is the biggest unknown — **VERIFY against a real `.table.md`** before bulk writes; a malformed file won't render.
- Formula evaluation is render-time (in-app); file-layer writes store the expression, not the result.
- The `.table.md` extension means these files are markdown-typed but hold JSON — read as JSON.

## Sources
- Repo README: https://github.com/aztekgold/obsidian-tables
