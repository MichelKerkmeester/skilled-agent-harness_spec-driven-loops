---
title: "Installed Obsidian Plugins Roster"
description: "The complete roster of community plugins enabled in the operator's Obsidian vault: display name, manifest id, installed version, repository, one-line purpose, and whether each has a dedicated mcp-obsidian integration reference or is UI-only with no dedicated docs."
trigger_phrases:
  - "installed plugins"
  - "plugin roster"
  - "vault plugins"
  - "which plugins do we use"
  - "obsidian plugins list"
  - "plugin inventory"
  - "what plugins are installed"
  - "plugins we support"
importance_tier: "normal"
contextType: "implementation"
version: "0.1.0.0"
---

# Installed Obsidian Plugins Roster (`installed-plugins`)

This is the single source of truth for **every community plugin enabled in the operator's vault** — including the ones that deliberately have no dedicated integration reference. It answers three questions at a glance: what is installed, what each plugin is for, and where (if anywhere) the AI-usable integration docs live.

## 1. OVERVIEW

The vault has **21 community plugins** enabled (`.obsidian/community-plugins.json`). They split into two operating classes:

- **File-layer plugins (15)** — persist their state as markdown, frontmatter, or a structured file (`.canvas`, `_database.md`, `.excalidraw.md`, ledgers). The AI operates these at the file layer, so each has a dedicated four-file integration reference under `references/plugins/<name>/`.
- **UI / automatic plugins (6)** — change the editor UI or apply automatic behavior with no vault syntax or data model an AI authors against. These are installed and listed here for completeness but intentionally carry **no dedicated integration docs** — there is nothing for an AI to author against.

Ground-truth identity (id, version, `minAppVersion`) always comes from each plugin's on-disk `manifest.json` under `.obsidian/plugins/<manifest.id>/`. The operator's Obsidian app is **1.13.4**, which clears every plugin's minimum-version floor (the highest here is 1.13.1).

---

## 2. FILE-LAYER PLUGINS (dedicated integration docs)

Each row's reference tree is `references/plugins/<folder>/` with four files: index (`<folder>.md`), `data-model.md`, `workflows.md`, `troubleshooting.md`, plus a catalog entry at `feature-catalog/plugins/<folder>.md`.

| Plugin | Manifest id | Ver | Repository | Purpose | Docs folder |
| --- | --- | --- | --- | --- | --- |
| Notion Bases | `notion-bases` | 1.12.0 | `bgarciamoura/obsidian-notion-bases-plugin` | Notion-style relational databases: two-way relations, rollups, lookups, subtasks, multi-view | `notion-bases/` |
| Dataview | `dataview` | 0.5.68 | `blacksmithgu/obsidian-dataview` | Query/aggregation engine (DQL + JS) over notes and frontmatter | `dataview/` |
| Tables | `tables` | 1.5.0 | `aztekgold/obsidian-tables` | Spreadsheet-style editor for markdown tables | `obsidian-tables/` |
| Excalidraw | `obsidian-excalidraw-plugin` | 2.26.2 | `zsviczian/obsidian-excalidraw-plugin` | Freeform hand-drawn diagrams and sketches (`.excalidraw.md`) | `excalidraw/` |
| Advanced Canvas | `advanced-canvas` | 6.5.4 | `developer-mike/obsidian-advanced-canvas` | Extends the native `.canvas` JSON: node types, portals, presentations, edge routing | `advanced-canvas/` |
| Charts | `obsidian-charts` | 3.9.0 | `phibr0/obsidian-charts` | Chart.js charts rendered from fenced code blocks | `charts/` |
| Project Manager | `project-manager` | 1.8.0 | `StepanKropachev/obsidian-pm` | Project-management layer: Table/Gantt/Kanban over tasks with dependencies and time tracking | `project-manager/` |
| Health.md Visualizations | `health-md` | 2.1.0 | `codybontecou/health-md-visualizations` | Apple/Android Health data charts from `health.md` blocks | `health-md/` |
| Beancount Ledger | `beancount-finance` | 2.3.1 | `mkshp-dev/obsidian-finance-plugin` | Beancount plain-text accounting ledgers inside the vault | `beancount-finance/` |
| Outliner | `obsidian-outliner` | 4.10.2 | `vslinko/obsidian-outliner` | Structured bullet-list outlining: zoom, fold, move-by-tree | `outliner/` |
| Iconic | `iconic` | 1.1.10 | `gfxholo/iconic` | Custom icons on files, folders, ribbon, and tabs | `iconic/` |
| Claudian | `realclaudian` | 2.2.4 | `YishenTu/claudian` | Embeds coding-agent CLIs (Claude Code, Codex, …) as in-vault collaborators | `claudian/` |
| Git | `obsidian-git` | 2.38.6 | `Vinzent03/obsidian-git` | Version-controls the vault: commit, push, pull, scheduled backup | `git/` |
| BRAT | `obsidian42-brat` | 2.2.0 | `TfTHacker/obsidian42-brat` | Installs and updates beta plugins straight from GitHub releases | `obsidian42-brat/` |
| Local REST API with MCP | `obsidian-local-rest-api` | 5.1.0 | `coddingtonbear/obsidian-local-rest-api` | HTTP/REST + MCP endpoint into the vault — the transport backbone the `mcp-obsidian` MCP path depends on | `obsidian-local-rest-api/` |

> **Do not remove `obsidian-local-rest-api`.** It is the HTTP backbone the `mcp-obsidian` MCP transport talks to. Uninstalling it silently breaks every MCP note operation, regardless of what other plugins are present.

---

## 3. UI / AUTOMATIC PLUGINS (installed, no dedicated docs)

These are enabled in the vault and supported operationally, but they have no vault-embedded syntax or data model an AI authors against — their configuration is display preferences, URLs, or automatic behavior. They are listed here so the roster is complete; there is intentionally nothing to document under `references/plugins/`.

| Plugin | Manifest id | Ver | Repository | Purpose | Why no dedicated docs |
| --- | --- | --- | --- | --- | --- |
| Virtual Linker / Glossary | `virtual-linker` | 1.5.2 | `vschroeter/obsidian-virtual-linker` | Auto-generates glossary-style virtual links wherever text matches a note title or alias | Automatic; only config is an include/exclude file list |
| Notebook Navigator | `notebook-navigator` | 3.3.4 | `johansan/notebook-navigator` | Dual-pane file-explorer replacement with tag/calendar/property browsing | File-explorer UI; settings are display preferences |
| Editing Toolbar | `editing-toolbar` | 4.1.1 | `pkm-er/obsidian-editing-toolbar` | Floating/fixed rich-text formatting toolbar | Pure UI convenience; no file format |
| Quick Switcher++ | `darlal-switcher-plus` | 6.1.6 | `darlal/obsidian-switcher-plus` | Extends core Quick Switcher with heading/symbol/editor/bookmark modes | Switcher UI only; no persisted data model |
| Custom Frames | `obsidian-custom-frames` | 2.6.0 | `Ellpeck/ObsidianCustomFrames` | Embeds external web apps as panes via iframe | Config is a URL + CSS string per frame |
| Link Favicons | `link-favicon` | 1.8.5 | `joethei/obsidian-link-favicon` | Renders a favicon next to external links | Purely visual; no content/data model |

---

## 4. NOTES AND RELATED

- **Minimal theme.** `references/plugins/minimal/` documents the Minimal *theme*, not a community plugin. Themes live under `.obsidian/themes/` and appearance settings, not in `community-plugins.json`, so Minimal is not a row in this roster.
- **Overlap decisions (kept, not removed).** Two installed plugins overlap others by design and coexist: Claudian (`realclaudian`) runs an agent inside Obsidian while Local REST API serves external agents — different use cases; Project Manager overlaps Dataview and Notion Bases for task tracking specifically but is purpose-built for PM (dependencies, Gantt, time tracking). None of the three is redundant.
- **Compatibility watch.** Notebook Navigator replaces the core file-explorer pane; Iconic injects icons into that pane. Confirm Iconic's icons still render inside Notebook Navigator's row UI when relying on both.

---

## 5. KEEPING THIS ROSTER CURRENT

This roster is a hand-maintained snapshot, reconciled against the vault, not an auto-generated file. When a plugin is installed, enabled, or removed:

1. Re-read the enabled set: `.obsidian/community-plugins.json` (each entry is a manifest `id`).
2. Read the changed plugin's `.obsidian/plugins/<id>/manifest.json` for its authoritative id, version, and `minAppVersion`.
3. Add or remove its row in §2 (file-layer, with a `references/plugins/<name>/` tree) or §3 (UI/automatic, no dedicated docs).
4. Keep the total in §1 in step with the row count.

A plugin belongs in §2 only if it exposes a vault syntax or data model an AI edits at the file layer; otherwise it belongs in §3.
