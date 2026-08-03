---
title: "Health.md File-Layer Index"
description: "Lean entry point for operating the Health.md Visualizations Obsidian plugin through its Apple Health data files (JSON/CSV/Markdown/Bases) in the vault."
trigger_phrases:
  - "health-md obsidian plugin"
  - "health md visualizations file layer"
  - "apple health chart vault"
  - "health data folder"
importance_tier: "normal"
contextType: "implementation"
version: 1.2.0.0
---

# Health.md Plugin Index (`health-md`)

The `mcp-obsidian` mode operates this plugin by **writing the health data files it renders** — never by driving its chart UI.

## 1. IDENTITY

| Identity field | Current value | Why it matters |
| --- | --- | --- |
| Obsidian plugin ID | `health-md` | Plugin directory name + enablement entry |
| Display name | **Health.md Visualizations** | Current manifest name |
| Plugin repository | [`codybontecou/health-md-visualizations`](https://github.com/codybontecou/health-md-visualizations) | Source of release assets + behavior facts |
| Version / minApp | 2.1.0 / 1.12.0 | Installed in all vaults (Phase 11); Obsidian 1.13.4 ≥ min |
| Companion exporter | **Health.md** iOS/Android app | Exports Apple Health data into the vault; plugin only renders |

## 2. WHAT IT DOES

Renders interactive Apple Health visualizations from data files **already in the vault**. A fenced code block placed in any note (including daily notes) becomes a chart canvas fed by the local health data. It never fetches from Apple — it renders what the data folder contains.

## 3. FILE-LAYER SURFACE (what the AI edits)

| Layer | Path / artifact | Operable by AI |
|---|---|---|
| Data files | `<data folder>/` (default `Health/`) — JSON, CSV, Markdown frontmatter, Bases | **Yes** — create/append/patch export files |
| Roll-ups | `<data folder>/Rollups/` (v7 JSON/Markdown/Bases, unversioned CSV) | **Yes** — same rules as data files |
| Metric dictionary | `_healthmd_data_dictionary.json` (canonical aliases, units, metric IDs) | Read; edit only to correct units/aliases |
| Chart placement | fenced code block in a note | **Yes** — insert the render block |
| Plugin settings | `.obsidian/plugins/health-md/data.json` | Read; edit only the data-folder path/pattern |
| Enablement | `.obsidian/community-plugins.json` | Yes (Phase 11 done) |

## 4. RENDER BLOCK (quick start)

```markdown
```health-md
type: chart
metric: step_count
dateRange: last7d
```
```

The exact block schema is plugin-defined; the safe move is to copy an existing rendered block from a note before creating new ones. The plugin watches the data folder and refreshes its cache automatically on file changes.

## 5. DATA FORMATS

| Format | Extension | Notes |
|---|---|---|
| JSON | `.json` | Full schema support; `healthmd.health_data` schema_version 0–7 |
| CSV | `.csv` | Supported; roll-up CSV is unversioned structural |
| Markdown | `.md` with YAML frontmatter | Bases-style; frontmatter declares schema/units/timezone |
| Obsidian Bases | YAML frontmatter | Same frontmatter path as Markdown |

Markdown without frontmatter renders granular tables but cannot declare schema, units, timezone, or capture completeness.

## 6. GOTCHAS

- **Never fabricate health data.** Writing a plausible-looking export file when no real data exists produces false charts. If no data folder/files exist, say so and offer to create the folder.
- **Schema drift:** versions newer than v7 are "best-effort" — do not claim support for unknown schema versions.
- **Settings edits are optional:** the defaults (`Health/`, flat, auto) work for most vaults; changing the folder means moving data with it.
