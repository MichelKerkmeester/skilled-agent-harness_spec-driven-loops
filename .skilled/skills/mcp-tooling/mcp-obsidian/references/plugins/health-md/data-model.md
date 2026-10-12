---
title: "Health.md File-Layer Data Model"
description: "Complete file-layer contract for the Health.md Visualizations plugin: data folder and settings, supported formats, the v8 daily envelope and v9 roll-ups, the metric dictionary, provider sections, lossless archives, entry notes, CSV/Bases specifics, and Apple/Android profiles."
trigger_phrases:
  - "health md data model"
  - "healthmd health_data schema"
  - "apple health export json"
  - "health md rollups"
  - "health data folder settings"
  - "health md android"
  - "healthmd health_data v8"
  - "healthmd rollup_summary"
importance_tier: "normal"
contextType: "implementation"
version: 0.5.0.0
---

# Health.md File-Layer Data Model

Health.md Visualizations renders Apple and Android health data from **plain data files in the vault**. The plugin is a renderer over a data folder; the AI operates the folder. The authoritative source for the export schemas below is the companion app's documentation at `healthmd.app/docs/reference/`.

---

## 1. OVERVIEW

### Canonical identity

| Identity field | Current value |
| --- | --- |
| Obsidian plugin ID | health-md |
| Display name | Health.md Visualizations |
| Plugin repository | codybontecou/health-md-visualizations |
| Installed version | 2.1.0 (all vaults, Phase 11) |
| Companion app | Health.md (App Store id 6757763969; site `healthmd.app`) — exports Apple Health and Android data into the vault, and can also merge metrics into Obsidian daily notes |
| Current export schemas | Daily `healthmd.health_data` **v8**; roll-up `healthmd.rollup_summary` **v9** (roll-up rules v8, derived from daily v8); HealthKit archive `healthmd.healthkit_records` v1; provider section `healthmd.provider.whoop_daily` v1 (all per healthmd.app docs) |
| Plugin schema ceiling | The installed plugin v2.1.0 was documented to read daily **v0–v7**. Whether v2.1.0 renders the current **v8/v9** exports is **VERIFY** against the installed build — treat newer files as best-effort until confirmed |

### Core contract

- Default data folder: `Health/` at vault root (configurable in settings).
- Supported formats: JSON, CSV, Markdown frontmatter, Obsidian Bases (YAML frontmatter).
- Vault create, modify, and delete events under the data folder invalidate the plugin's cache.
- A `health-viz` fenced code block in any note renders a chart from the loaded data (`type` must name a registered renderer — see [`health-md.md`](health-md.md) §Render block and the renderer catalog).
- When the data folder is missing or empty, the plugin renders deterministic bundled example data instead.
- Health.md **favors omission over fabricated values**: a missing metric exports as an absent field, never as a zero.

---

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

---

## 3. FILE LAYERS

Distinct layers must never be treated as one stream: daily summaries, separately-indexed roll-ups, the data dictionary, provider sections, lossless/raw archives, and individual entry notes.

### Daily summaries — `healthmd.health_data` (v8)

The current daily record is schema version **8**. A mixed vault may still hold older v0–v7 files (v5/v6 remain valid historical files) — do not relabel them. The v8 JSON envelope (top-level keys, per healthmd.app docs):

| Key | Type | Presence |
| --- | --- | --- |
| `schema` | string | Always |
| `schema_version` | integer | Always (currently `8`) |
| `date` | `YYYY-MM-DD` | Normal documents |
| `type` | string | Always |
| `time_context` | object | Always — `{ "calendar_timezone": "<IANA>", "timestamp_timezone": "UTC" }` (timestamp timezone is fixed UTC) |
| `unit_system` | string | JSON output — structured v8 reports `metric`; display preferences change prose, not canonical values |
| `units` | object | JSON / frontmatter |
| `raw_capture_status` | enum string | Always — `complete` / `partial` / `not_requested` / `legacy_unavailable` |
| Summary sections | object/array | Conditional — present only when data exists |
| `providers` | object | Conditional — typed provider sections (see below) |
| `healthkit_record_archive` | object | Conditional — the lossless capture (see below) |
| `diagnostics` | object | Conditional |

- **Summary sections (v8, 18 categories):** `sleep`, `activity`, `heart`, `vitals`, `body`, `nutrition`, `mindfulness`, `mobility`, `hearing`, `reproductiveHealth`, `cyclingPerformance`, `vitamins`, `minerals`, `symptoms`, `medications`, `other`, `workouts`. Optional sections and fields are omitted when absent; production JSON sorts keys deterministically.
- **`raw_capture_status` values:** `complete` (all planned branches succeeded), `partial` (a requested branch failed), `not_requested` (canonical archive disabled — summary-only mode), `legacy_unavailable` (export predates archive support).
- Re-export only when corrected v8 (or roll-up) semantics are required; preserve authentic export semantics and validate version/format.

### Roll-ups — `<data folder>/Rollups/` (`healthmd.rollup_summary` v9)

- Weekly/monthly/yearly exported statistics, indexed separately from daily points; keep them separate (merging causes double counting).
- Schema `healthmd.rollup_summary` **v9**, derived from daily schema v8 with roll-up rules version 8.
- `period_id` is formatted `<start>_to_<end>` in the frozen IANA calendar timezone.
- Metadata fields: schema/version identifiers, period type and `period_id`, start/end dates, expected vs counted days, coverage percentage, source dates, summarized metrics/categories, units, and per-metric statistics.
- Available in JSON, CSV, Markdown, and Bases (Bases uses `rollup_metrics` frontmatter). Generated examples: `range.json`, `range.csv`, `range.md`, `range-bases.md`.
- Roll-ups are derived from daily snapshots and **do not embed source archives** (unlike daily records, which preserve raw event identity). Do not silently rewrite older roll-ups.

### Metric dictionary — `_healthmd_data_dictionary.json`

Interpretation metadata, not observations — a sidecar written beside daily exports. Each entry's confirmed fields (per healthmd.app docs):

| Field | Type | Meaning |
| --- | --- | --- |
| `key` | string | Output key after user styling/rename |
| `canonicalKey` | string | Stable Health.md flat-summary key |
| `metricId` | string | Metric-selection identifier |
| `displayName` | string | User-facing metric name |
| `category` | string | Health.md metric category |
| `unit` | string | Canonical structured-summary unit |
| `healthKitIdentifier` | string (optional) | Primary source identifier |
| `metricType` | string | `quantity`, `category`, `workout`, or diagnostic |
| `aggregation` | string | Compatibility alias for `dailyAggregation` |
| `dailyAggregation` | string | Rule producing the daily value |
| `healthKitAggregation` | string | Source-definition aggregation behavior |
| `rollup` | object | Period-aggregation guidance |
| `schemaVersion` | integer | Daily schema version represented |

Read to resolve a metric name; avoid casual edits; never invent metrics. The app also publishes a full generated dictionary at `generated/core/data-dictionary.json` and a metric catalog at `generated/core/metric-catalog.md`.

### Provider sections — `providers.*`

- The v8 daily envelope can carry typed third-party provider data under `providers`. Confirmed: `providers.whoop` using `healthmd.provider.whoop_daily` **v1**.
- Provider sections are optional and omitted when absent; treat them as authentic exports (never synthesize).

### Lossless/raw archives

- `healthmd.healthkit_records` v1 (Apple, embedded in v6/v7/v8 JSON as `healthkit_record_archive`): the plugin reads only capture status, schema version, record counts, query status counts, and warning counts. Canonical records, UUID relationships, routes, waveforms, clinical payloads, and binary/base64 material are excluded from metric summaries and the in-memory day cache. Do not rewrite the archive.
- **Summary-only vs lossless capture:** with Lossless Health Records off, canonical record rows and archives are excluded and `raw_capture_status` is `not_requested`; with lossless capture on, the full archive manifest ships (record inventory, query manifests, warnings).
- Android raw JSON/NDJSON snapshots: immutable provider/API archival products preserving provider-native structures; explicitly not daily summaries. Keep them out of daily-data ingestion.
- Android destinations: Storage Access Framework destinations may be local or provider-backed; compatibility API uploads may be HTTP or HTTPS, while raw uploads require HTTPS and reject redirects. "Local-first" therefore does not mean every user-selected destination is local.
- Large JSON/CSV/lossless inputs get bounded previews — a correctness, performance, and privacy boundary.

### Individual entry notes

- Detailed workouts, vitals, and platform-specific entries live in notes discoverable by declared frontmatter/tags — a separate discovery path.
- Do not merge them into daily summaries.

---

## 4. PLATFORM PROFILES

| Profile | Version | Notes |
| --- | --- | --- |
| Apple export | Daily v8 / roll-up v9 (current) | Full shared chart coverage plus iOS-only surfaces |
| Android frozen export | v4 | Independent compatibility profile in the canonical repo |
| Android analytical export | v5 | Independent compatibility profile in the canonical repo |

Format names are shared between Apple and Android, but version and semantic differences remain explicit.

- Shared charts cover common activity, heart, respiratory/vitals, sleep, mobility, workout, body, nutrition, and hearing fields.
- iOS-only surfaces: Mood/State of Mind; HealthKit-style medication catalog/dose events.
- Android gaps: walking symmetry is partial; Stand can use an explicit steps-derived proxy when `standHours` is missing; Android support is limited to shared HealthKit/Health Connect fields.
- The plugin exposes no Android-only visualization despite Android-native PHR/FHIR, planned-workout, and activity-intensity exports.
- Routes and sample charts require granular data plus permission/consent.
- Missing data is ordinarily absent, not zero.

---

## 5. FORMAT NOTES

| Format | Capabilities | Limits |
| --- | --- | --- |
| JSON | Full schema declaration, units, timezone, completeness; one file per day; provider + archive sections | Large files get a bounded source preview |
| CSV | Canonical source records, one file per day | Cannot declare schema version or timezone; roll-up CSV is unversioned |
| Markdown frontmatter | Schema, units, timezone, completeness; one file per day; built-in styles (Compact/Sections/Detailed) | Requires YAML frontmatter (Bases-style) |
| Markdown without frontmatter | Granular tables | No schema/units/timezone/completeness |
| Bases | Full frontmatter path | Same as Markdown frontmatter |

### CSV structure

- Header: `Date,Category,Metric,Value,Unit,Timestamp`.
- Compatibility/aggregate summary rows contain **five** fields and omit the trailing empty `Timestamp` column; timestamped and canonical-record rows contain all **six**. Parse with an RFC 4180-compliant reader — canonical JSON cells can contain commas, quotes, and embedded line breaks.
- Canonical row categories (lossless CSV): `Raw HealthKit / Raw Capture Status`, `Raw HealthKit / Archive Manifest`, `Raw HealthKit / Raw HealthKit Record` (UUID-backed), `Raw HealthKit / Raw HealthKit External Record` (UUID-free), `Raw HealthKit / Query Failure`, `WHOOP Capture / Resource Result`.

### Bases (`-bases.md`) specifics

- When both Markdown and Bases output are enabled, Bases files take a `-bases.md` suffix to avoid collisions (e.g. `summary-day-bases.md`).
- Reserved lossless frontmatter properties: `raw_capture_status`, `raw_record_count`, `raw_query_failure_count`, `raw_integrity_warning_count`, `raw_record_schema`, `raw_record_schema_version`. Roll-up Bases files carry `rollup_metrics`.

---

## 6. WHAT THE AI MUST NOT DO

- Never fabricate, extrapolate, or medically interpret health observations; do not infer that absence means zero, and never treat a plugin chart as diagnosis, a safe/unsafe threshold, or a recommendation.
- Do not synthesize observations, raw archives, dictionaries, provider sections, or roll-ups. Modify authentic exports only with explicit provenance and a contract-preserving reason.
- Do not recompute canonical roll-ups or dictionary mappings casually; do not silently rewrite older roll-ups.
- Keep raw/lossless archives away from ordinary daily-note ingestion, broad search indexing, and indiscriminate sync.
- Do not edit files inside `healthmd.healthkit_records` archives; the plugin consumes compact diagnostics only.
- Treat exact timestamps, routes, clinical/FHIR content, medication events, source/device identity, and attachments as highly sensitive.
- Do not assert the installed plugin renders a schema version it may not support: the current exporter is at daily v8 / roll-up v9, but whether the installed v2.1.0 build reads v8/v9 is `VERIFY` — treat newer-than-supported files as best-effort and never relabel historical files.
