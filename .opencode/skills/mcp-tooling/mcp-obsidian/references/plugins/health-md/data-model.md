---
title: "Health.md File-Layer Data Model"
description: "Complete file-layer contract for the Health.md Visualizations plugin: data folder and settings contract, supported formats, schema versions, roll-ups, metric dictionary, lossless archives, entry notes, and Apple/Android profiles."
trigger_phrases:
  - "health md data model"
  - "healthmd health_data schema"
  - "apple health export json"
  - "health md rollups"
  - "health data folder settings"
  - "health md android"
importance_tier: "normal"
contextType: "implementation"
version: 1.2.1.0
---

# Health.md File-Layer Data Model

Health.md Visualizations renders Apple and Android health data from **plain data files in the vault**. The plugin is a renderer over a data folder; the AI operates the folder.

---

## 1. OVERVIEW

### Canonical identity

| Identity field | Current value |
| --- | --- |
| Obsidian plugin ID | health-md |
| Display name | Health.md Visualizations |
| Plugin repository | codybontecou/health-md-visualizations |
| Installed version | 2.1.0 (all vaults, Phase 11) |
| Companion app | Health.md (App Store id 6757763969) — exports Apple Health (v7) and Android (frozen v4, analytical v5) data into the vault |

### Core contract

- Default data folder: `Health/` at vault root (configurable in settings).
- Supported formats: JSON, CSV, Markdown frontmatter, Obsidian Bases (YAML frontmatter).
- Vault create, modify, and delete events under the data folder invalidate the plugin's cache.
- A `health-viz` fenced code block in any note renders a chart from the loaded data.
- When the data folder is missing or empty, the plugin renders deterministic bundled example data instead.

## 2. SETTINGS CONTRACT

The full contract covers folder, structure, pattern, and format **plus** theme/palette/appearance defaults, chart dimensions, and click behavior. Read the configured values; do not assume defaults.

| Setting | Default | Notes |
| --- | --- | --- |
| Data folder | `Health` | Operator must read the configured vault-relative folder |
| Data folder structure | `Flat` | `Flat` loads files directly under the folder; `Year`/`Month`/`Week`/`Day` scan subfolder depths; `Custom` uses a template |
| Custom folder template | — | Variables `{year}`, `{month}`, `{week}`, `{day}`, `{date}`; example `{year}/{month}/{day}` |
| File pattern | `*` | Glob filter — not an exporter filename template |
| Data format | `auto` | `auto` detects by extension; explicit `json`/`csv`/`markdown`/`bases` also valid |
| Theme / palette / appearance | Global defaults | Per-block appearance keys can override |
| Chart dimensions | Global defaults | Per-block `width`/`height` can override |
| Data point click action | — | Pin tooltip / open source file / open matching daily note |
| Schema compatibility | — | Diagnostic: Settings → Health.md Visualizations → Health.md schema compatibility → Scan now; run after export-setting changes |

Nested structures still load files directly under the data folder, so flat exports can migrate gradually.

## 3. FILE LAYERS

Distinct layers must never be treated as one stream: daily summaries, separately-indexed roll-ups, the data dictionary, lossless/raw archives, and individual entry notes.

### 3.1 Daily summaries — `healthmd.health_data`

- Schema versions v0 through v7 are supported; v5/v6 remain valid historical files; a mixed vault can load v0–v7 without relabeling older exports.
- Versions newer than v7 are reported best-effort — never assert support for unknown versions.
- Re-export only when corrected v7 summary or roll-up semantics are required; preserve authentic export semantics and validate version/format.

### 3.2 Roll-ups — `<data folder>/Rollups/`

- Weekly/monthly/yearly exported statistics, indexed separately from daily points; keep them separate (merging causes double counting).
- JSON, Markdown, and Bases roll-ups use v7 semantics; roll-up CSV is unversioned because its public header lacks a schema-version column.
- v7 corrects VO₂ Max roll-ups to use the latest daily measurement and preserves canonical unit/timezone semantics. Do not silently rewrite older roll-ups.

### 3.3 Metric dictionary — `_healthmd_data_dictionary.json`

- Aliases, canonical units, metric IDs/types: interpretation metadata, not observations.
- Read to resolve a metric name; avoid casual edits; never invent metrics.

### 3.4 Lossless/raw archives

- `healthmd.healthkit_records` v1 (Apple, embedded in v6/v7 JSON): the plugin reads only capture status, schema version, record counts, query status counts, and warning counts. Canonical records, UUID relationships, routes, waveforms, clinical payloads, and binary/base64 material are excluded from metric summaries and the in-memory day cache. Do not rewrite the archive.
- Android raw JSON/NDJSON snapshots: immutable provider/API archival products preserving provider-native structures; explicitly not daily summaries. Keep them out of daily-data ingestion.
- Android destinations: Storage Access Framework destinations may be local or provider-backed; compatibility API uploads may be HTTP or HTTPS, while raw uploads require HTTPS and reject redirects. "Local-first" therefore does not mean every user-selected destination is local.
- Large JSON/CSV/lossless inputs get bounded previews — a correctness, performance, and privacy boundary.

### 3.5 Individual entry notes

- Detailed workouts, vitals, and platform-specific entries live in notes discoverable by declared frontmatter/tags — a separate discovery path.
- Do not merge them into daily summaries.

## 4. PLATFORM PROFILES

| Profile | Version | Notes |
| --- | --- | --- |
| Apple export | v7 | Full shared chart coverage plus iOS-only surfaces |
| Android frozen export | v4 | Independent compatibility profile in the canonical repo |
| Android analytical export | v5 | Independent compatibility profile in the canonical repo |

Format names are shared between Apple and Android, but version and semantic differences remain explicit.

- Shared charts cover common activity, heart, respiratory/vitals, sleep, mobility, workout, body, nutrition, and hearing fields.
- iOS-only surfaces: Mood/State of Mind; HealthKit-style medication catalog/dose events.
- Android gaps: walking symmetry is partial; Stand can use an explicit steps-derived proxy when `standHours` is missing.
- The plugin exposes no Android-only visualization despite Android-native PHR/FHIR, planned-workout, and activity-intensity exports.
- Routes and sample charts require granular data plus permission/consent.
- Missing data is ordinarily absent, not zero.

## 5. FORMAT NOTES

| Format | Capabilities | Limits |
| --- | --- | --- |
| JSON | Full schema declaration, units, timezone, completeness | Large files get a bounded source preview |
| CSV | Supported | Cannot declare schema version (roll-up CSV) or timezone |
| Markdown frontmatter | Schema, units, timezone, completeness | Requires YAML frontmatter (Bases-style) |
| Markdown without frontmatter | Granular tables | No schema/units/timezone/completeness |
| Bases | Full frontmatter path | Same as Markdown frontmatter |

## 6. WHAT THE AI MUST NOT DO

- Never fabricate, extrapolate, or medically interpret health observations; do not infer that absence means zero, and never treat a plugin chart as diagnosis, a safe/unsafe threshold, or a recommendation.
- Do not synthesize observations, raw archives, dictionaries, or roll-ups. Modify authentic exports only with explicit provenance and a contract-preserving reason.
- Do not recompute canonical roll-ups or dictionary mappings casually; do not silently rewrite older roll-ups.
- Keep raw/lossless archives away from ordinary daily-note ingestion, broad search indexing, and indiscriminate sync.
- Do not edit files inside `healthmd.healthkit_records` archives; the plugin consumes compact diagnostics only.
- Treat exact timestamps, routes, clinical/FHIR content, medication events, source/device identity, and attachments as highly sensitive.
- Do not claim schema support beyond v7.
