---
title: "Installed Obsidian Plugins Roster"
description: "The complete roster of community plugins enabled in the operator's Obsidian vault: display name, manifest id, installed version, repository, one-line purpose, and whether the mode ships a dedicated mcp-obsidian integration reference for it, had its documentation removed, or is UI-only."
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
version: "0.2.0.0"
---

# Installed Obsidian Plugins Roster (`installed-plugins`)

This is the single source of truth for **every community plugin enabled in the operator's vault** — including the ones that carry no dedicated integration reference. It answers three questions at a glance: what is installed, what each plugin is for, and where (if anywhere) the AI-usable integration docs live.

## 1. OVERVIEW

The vault has **24 community plugins** enabled (`.obsidian/community-plugins.json`). They split into three operating classes, and the counts add up: **2 documented + 13 undocumented file-layer + 9 UI/automatic = 24**.

- **Documented file-layer plugins (2)** — persist their state as markdown, frontmatter, or a structured file, and the mode documents them at the file layer: each has a dedicated four-file integration reference tree under `references/plugins/<name>/` plus a `feature-catalog/plugins/<name>.md` entry. Only these two carry dedicated docs.
- **Undocumented file-layer plugins (13)** — persist state an AI edits at the file layer just as directly, but their dedicated reference trees were removed from this skill. They stay installed and operationally supported; the mode reaches them by locating and editing their on-disk data, with no per-plugin reference to follow.
- **UI / automatic plugins (9)** — change the editor UI or apply automatic behavior with no vault syntax or data model an AI authors against. These are installed and listed here for completeness but carry **no dedicated integration docs** — there is nothing for an AI to author against.

Ground-truth identity (id, version, `minAppVersion`) always comes from each plugin's on-disk `manifest.json` under `.obsidian/plugins/<manifest.id>/`. The operator's Obsidian app is **1.13.4**, which clears every plugin's minimum-version floor (the highest here is 1.13.1).

---

## 2. DOCUMENTED FILE-LAYER PLUGINS (dedicated integration docs)

Only these two plugins have a dedicated integration reference. Each tree is `references/plugins/<name>/` with four files: index (`<name>.md`), `data-model.md`, `workflows.md`, `troubleshooting.md`, plus a catalog entry at `feature-catalog/plugins/<name>.md`. Concretely, the two surviving trees are `references/plugins/health-md/` and `references/plugins/iconic/`, with catalog entries `feature-catalog/plugins/health-md.md` and `feature-catalog/plugins/iconic.md`.

| Plugin | Manifest id | Ver | Repository | Purpose | Docs folder |
| --- | --- | --- | --- | --- | --- |
| Health.md Visualizations | `health-md` | 2.1.0 | `codybontecou/health-md-visualizations` | Apple/Android Health data charts from `health.md` blocks | `health-md/` |
| Iconic | `iconic` | 1.1.10 | `gfxholo/iconic` | Custom icons on files, folders, ribbon, and tabs | `iconic/` |

---

## 3. FURTHER FILE-LAYER PLUGINS (dedicated docs removed)

These plugins persist their state as markdown, frontmatter, or a structured file, so the file-layer operating model in `plugin-operation-logic.md` applies to them exactly as it applies in §2. What changed is the documentation: their dedicated reference trees were removed from this skill, so there is no `references/plugins/<name>/` tree and no `feature-catalog/plugins/<name>.md` entry to follow. All 13 remain installed and enabled in the vault. To operate one, locate its on-disk data and edit that directly.

| Plugin | Manifest id | Ver | Repository | Purpose | Docs status |
| --- | --- | --- | --- | --- | --- |
| Notion Bases | `notion-bases` | 1.12.0 | `bgarciamoura/obsidian-notion-bases-plugin` | Notion-style relational databases: two-way relations, rollups, lookups, subtasks, multi-view | Dedicated docs removed (the mode no longer documents it at the file layer) |
| Make.md | `make-md` | 1.3.5 | `Make-md/makemd` | Notion-like Spaces/Contexts: table/board/gallery/calendar/chart views, relations, formulas (UI-driven config, heavier than Notion Bases) | Dedicated docs removed (the mode no longer documents it at the file layer) |
| Dataview | `dataview` | 0.5.68 | `blacksmithgu/obsidian-dataview` | Query/aggregation engine (DQL + JS) over notes and frontmatter | Dedicated docs removed (the mode no longer documents it at the file layer) |
| Tables | `tables` | 1.5.0 | `aztekgold/obsidian-tables` | Spreadsheet-style editor for markdown tables | Dedicated docs removed (the mode no longer documents it at the file layer) |
| Advanced Canvas | `advanced-canvas` | 6.5.4 | `developer-mike/obsidian-advanced-canvas` | Extends the native `.canvas` JSON: node types, portals, presentations, edge routing | Dedicated docs removed (the mode no longer documents it at the file layer) |
| Charts | `obsidian-charts` | 3.9.0 | `phibr0/obsidian-charts` | Chart.js charts rendered from fenced code blocks | Dedicated docs removed (the mode no longer documents it at the file layer) |
| Meta Bind | `obsidian-meta-bind-plugin` | 1.5.1 | `mProjectsCode/obsidian-meta-bind-plugin` | Inline `INPUT[]`/`BUTTON[]`/`VIEW[]` fields that read & write frontmatter; the button engine behind the Notion-style task timer | Dedicated docs removed (the mode no longer documents it at the file layer) |
| JS Engine | `js-engine` | 0.3.6 | `mProjectsCode/obsidian-js-engine-plugin` | Runs JS in `js-engine` blocks and Meta Bind actions; computes timer timestamps and dynamic field values (companion to Meta Bind) | Dedicated docs removed (the mode no longer documents it at the file layer) |
| Outliner | `obsidian-outliner` | 4.10.2 | `vslinko/obsidian-outliner` | Structured bullet-list outlining: zoom, fold, move-by-tree | Dedicated docs removed (the mode no longer documents it at the file layer) |
| Claudian | `realclaudian` | 2.2.4 | `YishenTu/claudian` | Embeds coding-agent CLIs (Claude Code, Codex, …) as in-vault collaborators | Dedicated docs removed (the mode no longer documents it at the file layer) |
| Git | `obsidian-git` | 2.38.6 | `Vinzent03/obsidian-git` | Version-controls the vault: commit, push, pull, scheduled backup | Dedicated docs removed (the mode no longer documents it at the file layer) |
| BRAT | `obsidian42-brat` | 2.2.0 | `TfTHacker/obsidian42-brat` | Installs and updates beta plugins straight from GitHub releases | Dedicated docs removed (the mode no longer documents it at the file layer) |
| Local REST API with MCP | `obsidian-local-rest-api` | 5.1.0 | `coddingtonbear/obsidian-local-rest-api` | HTTP/REST + MCP endpoint into the vault — the transport backbone the `mcp-obsidian` MCP path depends on | Dedicated docs removed (the mode no longer documents it at the file layer) |

> **Do not remove `obsidian-local-rest-api`.** It is the HTTP backbone the `mcp-obsidian` MCP transport talks to. Uninstalling it silently breaks every MCP note operation, regardless of what other plugins are present.

---

## 4. UI / AUTOMATIC PLUGINS (installed, no dedicated docs)

These are enabled in the vault and supported operationally, but they have no vault-embedded syntax or data model an AI authors against — their configuration is display preferences, URLs, or automatic behavior. They are listed here so the roster is complete; there is intentionally nothing to document under `references/plugins/`.

| Plugin | Manifest id | Ver | Repository | Purpose | Why no dedicated docs |
| --- | --- | --- | --- | --- | --- |
| Virtual Linker / Glossary | `virtual-linker` | 1.5.2 | `vschroeter/obsidian-virtual-linker` | Auto-generates glossary-style virtual links wherever text matches a note title or alias | Automatic; only config is an include/exclude file list |
| Notebook Navigator | `notebook-navigator` | 3.3.4 | `johansan/notebook-navigator` | Dual-pane file-explorer replacement with tag/calendar/property browsing | File-explorer UI; settings are display preferences |
| Editing Toolbar | `editing-toolbar` | 4.1.1 | `pkm-er/obsidian-editing-toolbar` | Floating/fixed rich-text formatting toolbar | Pure UI convenience; no file format |
| Quick Switcher++ | `darlal-switcher-plus` | 6.1.6 | `darlal/obsidian-switcher-plus` | Extends core Quick Switcher with heading/symbol/editor/bookmark modes | Switcher UI only; no persisted data model |
| Custom Frames | `obsidian-custom-frames` | 2.6.0 | `Ellpeck/ObsidianCustomFrames` | Embeds external web apps as panes via iframe | Config is a URL + CSS string per frame |
| Link Favicons | `link-favicon` | 1.8.5 | `joethei/obsidian-link-favicon` | Renders a favicon next to external links | Purely visual; no content/data model |
| Dragger | `dragger` | 2.0.0 | `Ariestar/obsidian-dragger` | Notion-style drag handle to reorder blocks/lines in the editor | Editor UI gesture; no vault syntax or data model |
| Bullet Depth Markers | `bullet-depth-markers` | 1.0.0 | `michaelnguyen5653/Bullet-Depth-Markers` | Renders a distinct bullet glyph per indent depth | Automatic on edit; no AI-authored syntax (note: it rewrites the literal `-`/`*`/`+` characters in files) |
| Dynamic Outline | `dynamic-outline` | 1.19.0 | `theopavlove/obsidian-dynamic-outline` | Notion/GitHub-style floating table-of-contents panel, per note | Navigation UI; no vault syntax or data model |

---

## 5. NOTES AND RELATED

- **Themes.** `references/themes/` documents the Obsidian *theme system* (with Minimal as the worked example), not a community plugin. Themes live under `.obsidian/themes/` and appearance settings, not in `community-plugins.json`, so no theme is a row in this roster.
- **Overlap decisions.** Claudian (`realclaudian`) runs an agent inside Obsidian while Local REST API serves external agents — different use cases, both kept. **Project Manager was removed** (deprecated 2026-08-22): its task-tracking role is consolidated onto Notion Bases (relations, rollups, Table/Board/Timeline/Calendar views) plus Meta Bind + JS Engine for the live start/stop task timer, which made a dedicated PM plugin redundant. **Excalidraw was removed** the same day — freeform drawing/whiteboard use was retired from the vault.
- **Notion-parity stack (2026-08-22).** The vault standardizes on Notion Bases as the database and calendar foundation. The Notion-style task timer (Start/End buttons that stamp frontmatter + a Total-Time formula column) is built with Meta Bind + JS Engine over a Bases task database.
- **Dynamic Outline activation.** Selected and pinned to v1.19.0 (repo `theopavlove/obsidian-dynamic-outline`) for a Notion-style floating table of contents; install it via BRAT and reload Obsidian to activate. Until that install runs, the live `community-plugins.json` shows 23 enabled ids rather than the 24 this roster documents.
- **Compatibility watch.** Notebook Navigator replaces the core file-explorer pane; Iconic injects icons into that pane. Confirm Iconic's icons still render inside Notebook Navigator's row UI when relying on both.

---

## 6. KEEPING THIS ROSTER CURRENT

This roster is a hand-maintained snapshot, reconciled against the vault, not an auto-generated file. When a plugin is installed, enabled, or removed:

1. Re-read the enabled set: `.obsidian/community-plugins.json` (each entry is a manifest `id`).
2. Read the changed plugin's `.obsidian/plugins/<id>/manifest.json` for its authoritative id, version, and `minAppVersion`.
3. Add or remove its row in §2 (documented file-layer, with a `references/plugins/<name>/` tree), §3 (file-layer whose dedicated docs were removed), or §4 (UI/automatic, never documented).
4. Keep the total in §1 in step with the row count (2 promoted + 13 undocumented + 9 UI/automatic = 24).

A plugin belongs in §2 only if the mode ships a four-file reference tree for it under `references/plugins/<name>/`. A file-layer plugin without that tree belongs in §3, and a plugin whose configuration is display preferences, URLs, or automatic behavior belongs in §4.
