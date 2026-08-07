---
title: "Health.md File-Layer Index"
description: "Lean entry point for operating the Health.md Visualizations Obsidian plugin through its vault data files (JSON/CSV/Markdown/Bases): Apple and Android exports, health-viz render blocks, and the data-folder verification trap."
trigger_phrases:
  - "health-md obsidian plugin"
  - "health md visualizations file layer"
  - "apple health chart vault"
  - "health data folder"
  - "health-viz render block"
importance_tier: "normal"
contextType: "implementation"
version: 0.4.1.0
---

# Health.md Plugin Index (health-md)

The `mcp-obsidian` mode operates this plugin by **managing the data files it renders** — never by driving its chart UI. Health.md Visualizations renders Apple Health and Android Health exports already present in the vault.

## 1. IDENTITY

| Identity field | Current value | Why it matters |
| --- | --- | --- |
| Obsidian plugin ID | health-md | Plugin directory name + enablement entry |
| Display name | **Health.md Visualizations** | Current manifest name |
| Plugin repository | codybontecou/health-md-visualizations | Source of release assets + behavior facts |
| Version / minApp | 2.1.0 / 1.12.0 | Installed in all vaults (Phase 11); desktop and mobile supported |
| Companion exporters | Health.md iOS/Android app | Apple export profile v7; Android frozen export v4; Android analytical export v5 |

## 2. WHAT IT DOES

Renders interactive health visualizations from data files **already in the vault**. A `health-viz` fenced code block placed in any note (including daily notes) becomes a chart canvas fed by the local data. It never fetches from Apple or a cloud — it renders what the data folder contains.

Chart coverage is shared across platforms for common activity, heart, respiratory/vitals, sleep, mobility, workout, body, nutrition, and hearing fields. Mood/State of Mind and HealthKit-style medication catalog/dose events are iOS-only; Android walking symmetry is partial and Android Stand can use an explicit steps-derived proxy when `standHours` is missing.

## 3. FILE-LAYER SURFACE (what the AI touches)

| Layer | Path / artifact | Safe handling |
| --- | --- | --- |
| Daily summaries | `<data folder>/` (default `Health/`) — `healthmd.health_data` JSON, CSV, Markdown frontmatter, Bases | Read; write only authentic exports, preserving version/format semantics |
| Roll-ups | `<data folder>/Rollups/` — weekly/monthly/yearly exported statistics (v7 JSON/Markdown/Bases; unversioned CSV) | Keep separate from daily points; preserve period and v7 rules; never synthesize |
| Metric dictionary | `_healthmd_data_dictionary.json` | Interpretation metadata (aliases, canonical units, metric IDs/types), not observations; avoid casual edits |
| Lossless/raw archives | `healthmd.healthkit_records` v1 inside v6/v7 JSON; Android raw JSON/NDJSON snapshots | Do not rewrite; plugin consumes compact diagnostics only; keep out of daily-data ingestion |
| Individual entry notes | Workout, vitals, platform-specific entries | Separate discovery path via declared frontmatter/tags; do not merge into daily summaries |
| Chart placement | `health-viz` fenced block in a note | Yes — insert the render block |
| Plugin settings | `.obsidian/plugins/health-md/data.json` | Read the full contract (folder/structure/pattern/format plus theme/palette/appearance, chart dimensions, click behavior); edit only on explicit user request |
| Enablement | `.obsidian/community-plugins.json` | Yes (Phase 11 done) |

## 4. RENDER BLOCK (quick start)

```health-viz
type: step-spiral
last: 7
```

Block contract, per the plugin's renderer registry:

- `type` is required and must name a **registered renderer** (for example `step-spiral`).
- Common optional keys: `width`, `height`, inclusive `from`, inclusive `to`, `last`, `clickAction`. Renderer-specific arguments stay type-specific.
- Dates may be ISO dates or datetimes, built-in dynamic variables such as `{{today:YYYY-MM-DD}}`, or frontmatter variables. Raw Templater or Dataview expressions are not a reliable substitute.
- Appearance keys override global theme, palette, and colors; canvas click behavior can pin the tooltip, open the source file, or open a Daily Note. Some HTML/SVG/Leaflet renderers have no canvas tooltip layer.
- Prefer copying an existing working block from the vault over inventing keys; unknown block options render nothing.

## 5. VERIFICATION TRAP (bundled mock data)

When the data folder is **missing or empty**, the plugin falls back to deterministic bundled example data. A rendered chart therefore proves **neither** that the configured data folder was found **nor** that real health exports were loaded.

Verification always requires: identify the actual selected data folder from the plugin settings (not the default) and confirm at least one authentic source file exists there, matches the file pattern, and parses.

## 6. DATA FORMATS

| Format | Extension | Notes |
| --- | --- | --- |
| JSON | `.json` | Full schema support; `healthmd.health_data` schema_version 0–7 |
| CSV | `.csv` | Supported; roll-up CSV is unversioned structural |
| Markdown | `.md` with YAML frontmatter | Bases-style; frontmatter declares schema/units/timezone/completeness |
| Obsidian Bases | YAML frontmatter | Same frontmatter path as Markdown |

Markdown without frontmatter renders granular tables but cannot declare schema, units, timezone, or capture completeness.

## 7. GOTCHAS

- **Never fabricate, extrapolate, or medically interpret health data.** Writing a plausible-looking export when no real data exists produces false charts. Preserve authentic exports; do not synthesize observations, raw archives, dictionaries, or roll-ups.
- **A rendered chart is not evidence** (see §5): with a missing/empty data folder the plugin shows bundled example data.
- **Schema drift:** versions newer than v7 are best-effort — do not claim support for unknown schema versions, and do not relabel historical files; re-export only when corrected v7 summary or roll-up semantics are required.
- **Missing data is ordinarily absent, not zero** — an empty chart does not imply a zero measurement.
- **Privacy bounds:** keep lossless/raw archives out of ordinary ingestion, broad search indexing, and indiscriminate sync; large inputs get bounded previews; exact timestamps, routes, clinical/FHIR content, medication events, source/device identity, and attachments are highly sensitive.
- **Settings edits are only on explicit request:** changing the data folder means moving data with it.
