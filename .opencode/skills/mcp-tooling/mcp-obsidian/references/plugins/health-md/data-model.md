---
title: "Health.md File-Layer Data Model"
description: "Complete file-layer contract for the Health.md Visualizations plugin: data folder, supported formats, schema versions, roll-ups, metric dictionary, and settings."
trigger_phrases:
  - "health md data model"
  - "healthmd health_data schema"
  - "apple health export json"
  - "health md rollups"
  - "health data folder settings"
importance_tier: "normal"
contextType: "implementation"
version: 1.2.0.0
---

# Health.md File-Layer Data Model

Health.md Visualizations renders Apple Health data from **plain data files in the vault**. The plugin is a renderer over a data folder; the AI operates the folder.

---

## 1. OVERVIEW

### Canonical identity

| Identity field | Current value |
| --- | --- |
| Obsidian plugin ID | `health-md` |
| Display name | Health.md Visualizations |
| Plugin repository | `codybontecou/health-md-visualizations` |
| Installed version | 2.1.0 (all vaults, Phase 11) |
| Companion app | Health.md (App Store id 6757763969) — exports Apple Health data into the vault |

### Core contract

- Default data folder: `Health/` at vault root (configurable in settings).
- Supported formats: JSON, CSV, Markdown frontmatter, Obsidian Bases (YAML frontmatter).
- The plugin **watches** the data folder and refreshes its cache when files are added, modified, or deleted.
- A fenced code block in any note renders a chart from the loaded data.

## 2. DATA FOLDER CONFIGURATION (settings the AI may read/adjust)

| Setting | Default | Notes |
|---|---|---|
| Data folder | `Health` | Path inside the vault; changing it moves where exports are expected |
| Data folder structure | `Flat` | `Flat` loads files directly under the folder; `Year`/`Month`/`Week`/`Day` scan subfolder depths (`Health/2026/`, `Health/2026/06/`, `Health/2026/W23/`, `Health/2026/06/03/`) |
| Custom folder template | — | Variables `{year}`, `{month}`, `{week}` (e.g. `W23`), `{day}`, `{date}`; example `{year}/{month}/{day}` |
| File pattern | `*` | Glob filter; e.g. `*.json`, `2026-*.md`, `health-*.csv`, `2026/**/*.json` |
| Data format | `auto` | `auto` detects by extension; explicit `json`/`csv`/`markdown`/`bases` also valid |
| Data point click action | — | Pin tooltip / open source file / open matching daily note |

Nested structures still load files directly under the data folder, so flat exports can migrate gradually.

## 3. FILE SCHEMAS

### 3.1 Daily exports — `healthmd.health_data`

- Schema versions **v0 through v7** are supported; v5/v6 remain valid historical files.
- A mixed vault can load v0–v7 without relabeling older exports.
- Versions **newer than v7** are reported best-effort — never assert support for unknown versions.

### 3.2 Roll-ups — `Health/Rollups/`

- Indexed separately from daily records.
- Supported: v7 JSON, Markdown, and Bases roll-ups (every statistic; v7 VO2 Max `latest` rule).
- Roll-up CSV accepted as unversioned structural format (its public header has no schema-version column).

### 3.3 Metric dictionary — `_healthmd_data_dictionary.json`

- Canonical aliases, units, metric IDs, and metric types.
- Read to resolve a metric name; edit only to correct an alias/unit mapping, never to invent metrics.

### 3.4 HealthKit records archive (`healthmd.healthkit_records` v1)

- Present in v6/v7 exports; the plugin reads only capture status, schema version, record counts, query status counts, and warning counts.
- Canonical records, UUIDs, routes, waveforms, clinical payloads, and binary data are **not** read into summaries (avoids double counting the daily summary layer).

## 4. FORMAT NOTES

| Format | Capabilities | Limits |
|---|---|---|
| JSON | Full schema declaration, units, timezone, completeness | Large files get a bounded source preview |
| CSV | Supported | Cannot declare schema version (roll-up CSV) or timezone |
| Markdown frontmatter | Schema, units, timezone, completeness | Requires YAML frontmatter (Bases-style) |
| Markdown without frontmatter | Granular tables | No schema/units/timezone/completeness |
| Bases | Full frontmatter path | Same as Markdown frontmatter |

## 5. WHAT THE AI MUST NOT DO

- **Do not fabricate or extrapolate health data** — a chart is only as true as the files. Absent data → state that no data exists and offer to create the folder/format.
- Do not edit files inside `healthmd.healthkit_records` archives (binary payloads; the plugin ignores them anyway).
- Do not claim schema support beyond v7.
