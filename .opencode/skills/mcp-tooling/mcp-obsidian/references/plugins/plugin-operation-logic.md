# Reference — Plugin operation logic (file-layer model)

> Ships in the `mcp-obsidian` mode at `references/plugins/`. This is the connective principle that makes the per-plugin references usable, and the pattern to extend to any future plugin.

## 1. CORE PRINCIPLE

The `mcp-obsidian` mode operates the vault at the **file layer** — it reads, writes, and searches files via its CLI and MCP surfaces. Obsidian community plugins are **UI / rendering layers over plain data** stored in the vault. Therefore:

> **Operate a plugin's features by editing the DATA the plugin reads — not by driving the plugin's UI.**

The mode has no headless UI bridge, so command-palette actions and in-app buttons are out of reach. But almost every plugin persists its state as text/JSON in the vault, and *that* is directly operable.

## 2. WHERE PLUGINS KEEP THEIR DATA (find-the-file checklist)

For any plugin, locate its data by checking, in order:
1. A **document convention** — a dedicated file extension (`.table.md`), a fenced code-block language, or a frontmatter key.
2. A **plain-text ledger/sidecar** the plugin renders (e.g. a `.beancount` file at a configured path).
3. **Plugin settings/state** at `<vault>/.obsidian/plugins/{plugin-id}/data.json`.
4. **Vault-level plugin state** — `community-plugins.json` (enabled ids), `app.json`, `appearance.json`.

## 3. THE THREE PLUGINS — data map

| Plugin | Data the AI edits | Operation |
|--------|-------------------|-----------|
| `obsidian-flat-financing` | the configured `*.beancount` ledger | append/patch balanced Beancount directives |
| `obsidian-tables` | `*.table.md` (JSON) | edit `columns`/`rows`/`views` JSON (`VERIFY` schema) |
| `obsidian42-brat` | `.obsidian/plugins/{id}/` + `community-plugins.json` + BRAT `data.json` | install = write plugin assets + enable id + register in BRAT |

## 4. WHAT THE FILE LAYER CAN AND CANNOT DO

**CAN** (file writes fully suffice):
- Create/append/patch a plugin's data document (a transaction, a table row, a note).
- Enable a plugin (edit `community-plugins.json`).
- Query/aggregate over the data (the AI computes; it does not need the plugin's UI compute).

**CANNOT** (needs the app / a reload):
- Invoke command-palette commands or click ribbon icons.
- Force in-app computations that only run on render (e.g. obsidian-tables **formula evaluation** happens when the note is opened — the AI writes the formula string; Obsidian evaluates it).
- Guarantee a live view refreshes without the user reloading the note/pane.

**Discipline:** write the data, then tell the user (or a smoke step) to open/reload the relevant note so the plugin re-renders. Append is safest; in-place patches must preserve the plugin's exact schema or the file won't render.

## 5. EXTENDING TO A NEW PLUGIN

1. Fetch the plugin's README + manifest; record repo id, author, data convention.
2. Generate one real artifact in-app, then **match its on-disk shape** (this removes schema guesswork).
3. Write a per-plugin reference mirroring `flat-financing.md` / `obsidian-tables.md`: identity → what it does → data model → settings → file-layer recipes → gotchas/VERIFY → sources.
4. Add a row to §3 above and an example asset.

## 6. RELATION TO THE MODE

These references are loaded on demand by the `mcp-obsidian` SKILL.md router when a request mentions finance/beancount, tables, or beta-plugin install. See `assets/workflows.md` for end-to-end procedures.
