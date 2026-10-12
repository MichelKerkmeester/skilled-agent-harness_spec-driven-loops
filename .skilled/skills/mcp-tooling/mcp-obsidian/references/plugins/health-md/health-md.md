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
version: 0.5.0.0
---

# Health.md Plugin Index (health-md)

The `mcp-obsidian` mode operates this plugin by **managing the data files it renders** — never by driving its chart UI. Health.md Visualizations renders Apple Health and Android Health exports already present in the vault.

## 1. OVERVIEW

| Identity field | Current value | Why it matters |
| --- | --- | --- |
| Obsidian plugin ID | health-md | Plugin directory name + enablement entry |
| Display name | **Health.md Visualizations** | Current manifest name |
| Plugin repository | codybontecou/health-md-visualizations | Source of release assets + behavior facts |
| Version / minApp | 2.1.0 / 1.12.0 | Installed in all vaults (Phase 11); desktop and mobile supported |
| Companion exporters | Health.md iOS/Android/Mac app (`healthmd.app`) | Current Apple export: daily `healthmd.health_data` v8, roll-up `healthmd.rollup_summary` v9; Android frozen v4, analytical v5. Whether the installed plugin v2.1.0 reads v8/v9 is VERIFY — historically v0–v7 |

---

## 2. WHAT IT DOES

Renders interactive health visualizations from data files **already in the vault**. A `health-viz` fenced code block placed in any note (including daily notes) becomes a chart canvas fed by the local data. It never fetches from Apple or a cloud — it renders what the data folder contains.

Chart coverage is shared across platforms for common activity, heart, respiratory/vitals, sleep, mobility, workout, body, nutrition, and hearing fields. Mood/State of Mind and HealthKit-style medication catalog/dose events are iOS-only; Android walking symmetry is partial and Android Stand can use an explicit steps-derived proxy when `standHours` is missing.

---

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

---

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

### Registered renderer catalog

The documented renderer set is **43 renderers across 18 export categories** (healthmd.app visualization catalog). The installed v2.1.0 build may expose a subset — the installed registry is authoritative, so `VERIFY` an unfamiliar `type` against a working vault block. iOS-only renderers produce nothing on Android data.

- **Overview:** `intro-stats`, `summary-card`, `trend-tile`
- **Activity:** `activity-rings`, `vitals-rings`, `bar-chart`, `activity-heatmap`, `step-spiral`, `weekday-average`
- **Heart:** `heart-terrain`, `heart-range`, `hrv-trend`
- **Respiratory/oxygen:** `oxygen-river`, `oxygen-range`, `breathing-wave`
- **Sleep:** `sleep-schedule`, `sleep-quality-bars`, `sleep-architecture`, `sleep-polar`
- **Mood/mindfulness (iOS-only):** `mood-trend`, `mood-calendar-heatmap`, `mood-sleep-scatter`, `mood-day-timeline`, `mood-association-breakdown`, `mood-label-cloud`, `mood-volatility`, `mood-kind-split`, `mood-circadian-clock`, `mood-recovery-tile`, `mood-association-matrix`
- **Medications (iOS-only):** `medication-overview`, `medication-inventory`, `medication-adherence-summary`, `medication-dose-status`, `medication-adherence-trend`, `medication-recent-dose-events`
- **Mobility:** `walking-symmetry` (partial on Android)
- **Workouts:** `workout-log`, `workout-heart-rate`, `workout-zones`, `workout-trends`, `workout-intervals`, `workout-map` (GPS route)

Roadmap renderers (blood pressure, glucose, temperature, weight/BMI/body-composition, gait/running-form, nutrition macros/hydration/caffeine, symptom matrix, cycle calendar, hearing exposure) are not guaranteed on any installed build — confirm before use.

---

## 5. VERIFICATION TRAP (bundled mock data)

When the data folder is **missing or empty**, the plugin falls back to deterministic bundled example data. A rendered chart therefore proves **neither** that the configured data folder was found **nor** that real health exports were loaded.

Verification always requires: identify the actual selected data folder from the plugin settings (not the default) and confirm at least one authentic source file exists there, matches the file pattern, and parses.

---

## 6. DATA FORMATS

| Format | Extension | Notes |
| --- | --- | --- |
| JSON | `.json` | Full schema support; `healthmd.health_data` schema_version 0–7 |
| CSV | `.csv` | Supported; roll-up CSV is unversioned structural |
| Markdown | `.md` with YAML frontmatter | Bases-style; frontmatter declares schema/units/timezone/completeness |
| Obsidian Bases | YAML frontmatter | Same frontmatter path as Markdown |

Markdown without frontmatter renders granular tables but cannot declare schema, units, timezone, or capture completeness.

---

## 7. COMPANION ECOSYSTEM (UPSTREAM DATA SOURCES)

The Health.md **plugin** only renders files already in the vault. Those files are produced by the separate Health.md **companion app** (`healthmd.app`), which offers three data-production paths worth knowing — none of which the `mcp-obsidian` mode drives:

- **Daily-note frontmatter merge.** The app can merge selected metrics into the YAML frontmatter of Obsidian daily notes on every export (e.g. `steps: 12642`, `sleep_total_hours: 7.31`, `workout_count: 1`), without touching the rest of the note. Default target folder `Daily` (configurable, e.g. `Journal/Daily`); filename placeholders `{date}`, `{year}`, `{month}`, `{day}`, `{weekday}`, `{monthName}`, `{quarter}` (e.g. `{year}/{monthName}/{date}-{weekday}` → `2026/April/2026-04-28-Tue.md`). It can also inject app-managed markdown sections (Sleep, Activity, Heart, …) wrapped in HTML comments and replaced cleanly on each export. **Never hand-edit inside those managed frontmatter keys or comment-wrapped sections** — the next export overwrites them.
- **`healthmd` CLI.** A bundled Swift helper (`/Applications/Health.md.app/Contents/Helpers/healthmd`) plus a portable Rust CLI (`0.1.0-alpha.1`, unreleased). Commands include `status`, `doctor`, `metrics list`, `extract`, `query`, `export`, `resume`/`cancel`. It reads Apple HealthKit from the iPhone only; output is versioned JSON (stdout or `--output`). Standalone — no Obsidian integration of its own.
- **`healthmd-mcp` MCP server.** A signed stdio helper at `/Applications/Health.md.app/Contents/Helpers/healthmd-mcp` exposing **21 fixed tools** (readiness: `healthmd_status` / `healthmd_doctor` / `healthmd_capabilities` / `healthmd_metrics`; analysis: `healthmd_metric_chart` / `healthmd_sleep_sessions` / `healthmd_workouts` / `healthmd_coverage` / `healthmd_compare_periods` / `healthmd_query` / …; exports: `healthmd_export_files` / `healthmd_export_job_status` / …). It connects to the Mac loopback API (`127.0.0.1:17645`) and reads **only** Apple Health from a connected iPhone — **not** the Obsidian vault. It is a separate product from the Obsidian plugin; its `healthmd_export_files` tool can write generated files that then become the plugin's input. This server is not registered in this repo's MCP config; see `healthmd.app/docs/mcp/` to wire it into a runtime.

---

## 8. GOTCHAS

- **Never fabricate, extrapolate, or medically interpret health data.** Writing a plausible-looking export when no real data exists produces false charts. Preserve authentic exports; do not synthesize observations, raw archives, dictionaries, or roll-ups.
- **A rendered chart is not evidence** (see §5): with a missing/empty data folder the plugin shows bundled example data.
- **Schema drift:** versions newer than v7 are best-effort — do not claim support for unknown schema versions, and do not relabel historical files; re-export only when corrected v7 summary or roll-up semantics are required.
- **Missing data is ordinarily absent, not zero** — an empty chart does not imply a zero measurement.
- **Privacy bounds:** keep lossless/raw archives out of ordinary ingestion, broad search indexing, and indiscriminate sync; large inputs get bounded previews; exact timestamps, routes, clinical/FHIR content, medication events, source/device identity, and attachments are highly sensitive.
- **Settings edits are only on explicit request:** changing the data folder means moving data with it.
