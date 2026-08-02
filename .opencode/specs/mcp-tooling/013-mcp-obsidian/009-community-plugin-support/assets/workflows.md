# Workflows — operating the three plugins at the file layer

> Destined for `mcp-tooling/mcp-obsidian/references/` (or `assets/`) at Phase 5. Each workflow is expressed as `mcp-obsidian` CLI/MCP **file operations**, not UI clicks. `$VAULT` = the vault root.

## A. Install a beta plugin via BRAT (e.g. flat-financing)

**Preferred (command path)** — if a command/URI bridge is available:
1. Ensure BRAT is installed + enabled (`obsidian42-brat` in `$VAULT/.obsidian/community-plugins.json`).
2. Run **`BRAT: Add a beta plugin for testing`** → paste `pranjulsingh/obsidian-flat-financing`.
3. Enable the new plugin under Settings → Community plugins.

**Headless (file path)** — when no command bridge exists:
1. Fetch the latest GitHub **release** assets for `pranjulsingh/obsidian-flat-financing`: `main.js`, `manifest.json`, `styles.css` (if present).
2. Write them to `$VAULT/.obsidian/plugins/<plugin-id>/` (read `<plugin-id>` from the fetched `manifest.json` `id`).
3. Add `<plugin-id>` to the JSON array in `$VAULT/.obsidian/community-plugins.json` (enable it).
4. Append `"pranjulsingh/obsidian-flat-financing"` to `pluginList` in `$VAULT/.obsidian/plugins/obsidian42-brat/data.json` so BRAT tracks updates (`VERIFY` shape — see `assets/brat-data-entry.example.json`).
5. Tell the user to reload Obsidian so the plugin folder is detected.

## B. Add a finance transaction (flat-financing / Beancount)

1. Read the plugin's configured ledger path from its settings (`$VAULT/.obsidian/plugins/<id>/data.json`, `VERIFY` key) — call it `$LEDGER`.
2. Ensure the accounts exist; if not, append `open` directives.
3. **Append** a balanced transaction to `$LEDGER`:
   ```beancount
   2026-08-05 * "Coffee Shop" "Team offsite" #reimbursable
     Expenses:Food:Coffee     18.00 USD
     Assets:Bank:Checking    -18.00 USD
   ```
4. Verify the postings sum to zero (they must, or the entry won't render).
5. Open/reload the Accounting dashboard to re-render.

## C. Create and query an obsidian-tables table

**Create:**
1. Write `$VAULT/<Name>.table.md` containing the table JSON (match the `VERIFY`-ed schema from `assets/table-example.table.md`).
2. Embed it in a note: `![[<Name>.table.md]]` (or `![[<Name>.table.md|Sprint Board]]` to pin a View).

**Add a row:**
1. Read `<Name>.table.md` as JSON.
2. Append an object to `rows` whose keys match the column names.
3. Write the JSON back (preserve the exact schema).

**Query:**
1. Read `<Name>.table.md`; filter/aggregate `rows` in code (the AI computes; plugin Views are UI-only).
2. For a formula column, write the `{{ … }}` expression — it evaluates in-app when the note opens (not at write time).

## Cross-references
- `references/flat-financing.md` · `references/obsidian-tables.md` · `references/obsidian42-brat.md` · `references/plugin-operation-logic.md`
