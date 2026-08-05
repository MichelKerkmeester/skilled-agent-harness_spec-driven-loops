---
title: "Reference — Plugin operation logic (file-layer model)"
description: "The mcp-obsidian mode operates Obsidian community plugins by editing the data they read, never by driving their UI."
trigger_phrases:
  - "plugin operation logic"
  - "file layer operating model"
  - "operate plugin data not ui"
  - "where plugins keep data"
  - "plugin data map"
  - "file layer over ui principle"
importance_tier: "normal"
contextType: "implementation"
version: 0.1.0.0
---

# Reference — Plugin operation logic (file-layer model)

The `mcp-obsidian` mode operates Obsidian community plugins by editing the data they read, never by driving their UI. This is the connective principle that makes the per-plugin references usable and the pattern to extend to any future plugin.

---

## 1. OVERVIEW

### Purpose

Ships in the `mcp-obsidian` mode at `references/plugins/`. It defines one operating model for every plugin the mode covers: locate the plugin's persisted data, edit the data directly, and let the app re-render. The per-plugin references (`beancount-finance`, `obsidian-tables`, `obsidian42-brat`, `health-md`, `iconic`, `charts`, `dataview`, `excalidraw`, `git`, `outliner`, `minimal`) apply this model to their specific file shapes; this document is the general contract.

### Core Principle

> **Operate a plugin's features by editing the DATA the plugin reads — not by driving the plugin's UI.**

The mode has no headless UI bridge, so command-palette actions and in-app buttons are out of reach. Almost every plugin persists its state as text/JSON in the vault, and *that* is directly operable.

### When to Use

- Any request that changes what a plugin shows or computes (icons, tables, health charts, beta installs, ledger entries).
- Deciding whether a plugin capability is reachable headlessly before promising it to the operator.
- Extending the mode to a plugin not yet covered by a per-plugin reference.

### Prerequisites

- Per-plugin identity and schema: `references/plugins/plugin-operation-logic.md` siblings under `references/plugins/{plugin}/`.
- End-to-end procedures: `assets/workflows.md`.
- File-layer scenarios: `manual-testing-playbook/plugin-tie-ins/`.

---

## 2. WHERE PLUGINS KEEP THEIR DATA

For any plugin, locate its data by checking, in order:

1. A **document convention** — a dedicated file extension (`.table.md`), a fenced code-block language, or a frontmatter key.
2. A **plain-text ledger/sidecar** the plugin renders (e.g. a `.beancount` file at a configured path).
3. **Plugin settings/state** at `<vault>/.obsidian/plugins/{plugin-id}/data.json`.
4. **Vault-level plugin state** — `community-plugins.json` (enabled ids), `app.json`, `appearance.json`.

**Validation**: `plugin_data_located` — the exact file (not a folder) that drives the requested behavior is named, read, and its schema matched before any mutation.

---

## 3. THE ELEVEN ARTIFACTS — DATA MAP

| Artifact | Data the AI edits | Operation |
|--------|-------------------|-----------|
| `beancount-finance` | the structured `*.beancount` ledger | append/patch balanced Beancount directives |
| `obsidian-tables` | `*.table.md` (JSON) | edit `columns`/`rows`/`views` JSON (`VERIFY` schema) |
| `obsidian42-brat` | `.obsidian/plugins/{id}/` + `community-plugins.json` + BRAT `data.json` | install = write plugin assets + enable id + register in BRAT |
| `health-md` | Apple + Android Health export files in the data folder (default `Health/`), JSON/CSV/Markdown/Bases | `health-viz` render blocks; create/append/patch data files; verify real folder + authentic source (bundled mock-data fallback renders on empty folder); NEVER fabricate data |
| `iconic` | `.obsidian/plugins/iconic/data.json` (rulebook + settings) | merge rules/toggles with backup-before-write; preserve unrelated keys; rendering is in-app |
| `charts` | `chart`/`advanced-chart` render blocks (JSON body) + `.obsidian/plugins/obsidian-charts/data.json` | author/validate render-block JSON; edit settings with backup-before-write; the Charts View pane is in-app |
| `dataview` | inline metadata in notes (frontmatter + `Key:: Value`) + `.obsidian/plugins/dataview/data.json` | author DQL/dataviewjs query blocks; add or patch metadata fields; edit settings with backup-before-write |
| `excalidraw` | `.excalidraw.md` drawing notes (frontmatter + embedded JSON) + plugin `data.json` | create/patch drawing notes at the file layer; validate embedded JSON; settings edits with backup-before-write; never hand-edit element coordinates |
| `git` | the vault git repository (`.git` at vault root) + `.obsidian/plugins/obsidian-git/data.json` | read status/log/diff; edit settings with backup-before-write; never run destructive git ops on a real vault (throwaway repos only) |
| `outliner` | no note format of its own; only `.obsidian/plugins/obsidian-outliner/data.json` | settings edits with backup-before-write; editor behavior is in-app |
| `minimal` | theme: `.obsidian/themes/Minimal/theme.css` + `appearance.json` `cssTheme` key | verify install/activation; propose snippet-based tweaks (`.obsidian/snippets/`); never edit `theme.css` in a real vault |

**Validation**: `plugin_data_map_applied` — the row above names the exact data artifact and the exact mutation discipline before the agent edits anything.

---

## 4. WHAT THE FILE LAYER CAN AND CANNOT DO

### CAN (file writes fully suffice)

- Create/append/patch a plugin's data document (a transaction, a table row, a note).
- Enable a plugin (edit `community-plugins.json`).
- Query/aggregate over the data (the AI computes; it does not need the plugin's UI compute).

### CANNOT (needs the app / a reload)

- Invoke command-palette commands or click ribbon icons.
- Force in-app computations that only run on render (e.g. obsidian-tables **formula evaluation** happens when the note is opened — the AI writes the formula string; Obsidian evaluates it).
- Guarantee a live view refreshes without the user reloading the note/pane.

**Note:** the file-layer model covers everything the plugin persists. If a capability is not reachable through a persisted artifact, it is out of reach headlessly.

**Out of scope:** driving the plugin UI, in-app computation, and anything that only exists in the running renderer.

### Discipline

Write the data, then tell the user (or a smoke step) to open/reload the relevant note so the plugin re-renders. Append is safest; in-place patches must preserve the plugin's exact schema or the file won't render.

---

## 5. EXTENDING TO A NEW PLUGIN

1. Fetch the plugin's README + manifest; record repo id, author, data convention.
2. Generate one real artifact in-app, then **match its on-disk shape** (this removes schema guesswork).
3. Write a per-plugin reference mirroring `beancount-finance.md` / `obsidian-tables.md`: identity → what it does → data model → settings → file-layer recipes → gotchas/VERIFY → sources.
4. Add a row to the plugin data map above and an example asset.

**Validation**: `plugin_reference_complete` — a real artifact's on-disk shape was matched, the per-plugin reference exists, and the data map row plus asset landed.

---

## 6. RELATION TO THE MODE

These references are loaded on demand by the `mcp-obsidian` SKILL.md router when a request mentions finance/beancount, tables, beta-plugin install, health data, or icon rules. See `assets/workflows.md` for end-to-end procedures.
