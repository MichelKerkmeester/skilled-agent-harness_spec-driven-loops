# Health.md Plugin Deep Dive

## Executive Summary

Health.md Visualizations is a local Obsidian renderer over vault-resident daily summaries, roll-ups, metadata, and selected individual-entry notes. Its current contract is broader than the packet's starter guidance: plugin 2.1.0 accepts JSON, CSV, Markdown frontmatter, and Bases; supports mixed daily schema v0-v7; reads Apple and Android-compatible summary fields; and exposes a substantial `health-viz` renderer registry. [SOURCE: https://github.com/CodyBontecou/health-md-visualizations] [SOURCE: https://community.obsidian.md/plugins/health-md]

The main operational risk is confusing distinct file layers. Daily summaries drive ordinary charts. Roll-ups are separately indexed. `_healthmd_data_dictionary.json` is interpretation metadata. Lossless/raw archives are sensitive source material and enter the plugin only as compact diagnostics, not metric observations. Individual workout notes are a separate discovery path. Treating these as one stream causes double counting, unsafe rewrites, or unnecessary disclosure. [SOURCE: https://github.com/CodyBontecou/health-md-visualizations] [SOURCE: https://github.com/CodyBontecou/health-md] [SOURCE: https://github.com/CodyBontecou/health-md-android]

The existing packet reference set is partly accurate but not safe to use unchanged. Its quick-start examples use the wrong `health-md` fence and invented keys, its framing is Apple-only, and its validation path misses the plugin's deterministic mock-data fallback. These are priority corrections for the parent workflow.

## 1. Current Runtime and Compatibility Baseline

- Current documented plugin version: 2.1.0; minimum Obsidian version: 1.12.0; desktop and mobile supported. [SOURCE: https://community.obsidian.md/plugins/health-md]
- Supported daily formats: JSON, CSV, Markdown with YAML frontmatter, and Obsidian Bases frontmatter. Markdown without frontmatter can supply supported granular tables but cannot declare schema, canonical units, timezone, or capture completeness. [SOURCE: https://github.com/CodyBontecou/health-md-visualizations]
- Daily JSON uses `healthmd.health_data`. Unversioned/legacy material is v0; all published versions through v7 can coexist; files newer than v7 are best-effort. Historical v5/v6 files remain valid. [SOURCE: https://github.com/CodyBontecou/health-md-visualizations]
- Do not relabel historical files merely to make a vault uniform. Re-export only when corrected v7 summary or roll-up semantics are required. [SOURCE: https://github.com/CodyBontecou/health-md-visualizations]

## 2. Discovery, Settings, and Cache

The default data folder is `Health`, but the operator must read the configured vault-relative folder. Folder structure can be Flat, Year, Month, Week, Day, or Custom. Custom paths accept `{year}`, `{month}`, `{week}`, `{day}`, and `{date}`. Nested modes deliberately continue loading files at the data-folder root, enabling gradual migration. [SOURCE: https://github.com/CodyBontecou/health-md-visualizations]

`File pattern` is a glob filter, not an exporter filename template. `Data format` is independent and can be `auto`, `json`, `csv`, `markdown`, or `bases`. Vault create, modify, and delete events under the data folder invalidate the cache. After export-setting changes, the explicit diagnostic is Settings → Health.md Visualizations → Health.md schema compatibility → Scan now. [SOURCE: https://github.com/CodyBontecou/health-md-visualizations] [SOURCE: https://community.obsidian.md/plugins/health-md]

The settings contract also includes theme/palette/appearance defaults, chart dimensions, and data-point click behavior. Guidance that permits only path/pattern inspection is incomplete.

## 3. `health-viz` Render Contract

The fenced language is `health-viz`. Each non-comment line is `key: value`; `type` is required and must name a registered renderer. Common optional keys are `width`, `height`, inclusive `from`, inclusive `to`, `last`, and `clickAction`. Renderer-specific arguments remain type-specific. [SOURCE: https://github.com/CodyBontecou/health-md-visualizations]

A valid minimal example is:

````markdown
```health-viz
type: step-spiral
last: 7
```
````

Dates may be ISO dates or datetimes, built-in dynamic variables such as `{{today:YYYY-MM-DD}}`, or frontmatter variables. Raw Templater or Dataview expressions are not a reliable substitute. Sub-day windows recompute available heart, respiratory, sleep, and workout aggregates from samples, but activity/mobility fields exported only as daily totals remain full-day values. [SOURCE: https://github.com/CodyBontecou/health-md-visualizations]

Appearance keys can override global theme, palette, and colors. Canvas click behavior can pin the tooltip, open source, or open a Daily Note. Some HTML/SVG/Leaflet renderers do not have the canvas tooltip layer.

### Validation trap: bundled mock data

When the default `Health/` folder is missing or empty, the plugin falls back to deterministic bundled example data. A rendered chart therefore proves neither that a configured data folder was found nor that real health exports were loaded. Verification must identify the actual selected data folder and at least one authentic source file. [SOURCE: https://github.com/CodyBontecou/health-md-visualizations]

## 4. File-Layer Separation

| Layer | Role | Safe handling |
| --- | --- | --- |
| Daily `healthmd.health_data` | Ordinary chart time series and summaries | Preserve authentic export semantics; validate version/format |
| `Health/Rollups/` | Weekly/monthly/yearly exported statistics | Keep separate from daily points; preserve period and v7 rules |
| `_healthmd_data_dictionary.json` | Aliases, canonical units, metric IDs/types | Treat as metadata, not observations; avoid casual edits |
| `healthmd.healthkit_records` v1 | Apple lossless source archive embedded in v6/v7 JSON | Do not rewrite; plugin consumes compact diagnostics only |
| Android raw JSON/NDJSON snapshot | Immutable provider/API archival product | Keep out of daily-data ingestion |
| Individual entry notes | Detailed workouts, vitals, and platform-specific entries | Discover by declared frontmatter/tags; do not merge into daily summaries |

The plugin excludes canonical records, UUID relationships, routes, waveforms, clinical payloads, and binary/base64 material from metric summaries and the in-memory day cache. Large JSON/CSV/lossless inputs get bounded previews. This is a correctness, performance, and privacy boundary. [SOURCE: https://github.com/CodyBontecou/health-md-visualizations]

Roll-up JSON, Markdown, and Bases use v7 semantics; roll-up CSV is unversioned because its public header lacks a schema-version column. V7 corrects VO₂ Max roll-ups to use the latest daily measurement and preserves canonical unit/timezone semantics. Do not silently rewrite older roll-ups. [SOURCE: https://github.com/CodyBontecou/health-md] [SOURCE: https://github.com/CodyBontecou/health-md-visualizations]

## 5. Apple and Android Boundaries

The canonical repository retains Apple v7, Android frozen v4, and Android analytical v5 as independent compatibility profiles. Format names are shared, but version and semantic differences remain explicit. [SOURCE: https://github.com/CodyBontecou/health-md]

Shared plugin charts cover common activity, heart, respiratory/vitals, sleep, mobility, workout, body, nutrition, and hearing fields. Missing data is ordinarily absent, not zero. Android walking symmetry is partial, and Android Stand can use an explicit steps-derived proxy when `standHours` is missing. Routes and sample charts require granular data plus permission/consent. [SOURCE: https://github.com/CodyBontecou/health-md-visualizations]

Mood/State of Mind and HealthKit-style medication catalog/dose events are iOS-only. The current plugin exposes no Android-only visualization despite Android-native PHR/FHIR, planned-workout, and activity-intensity exports. An empty chart may mean no records, denied permission, disabled export selection, absent platform capability, or unsupported visualization; troubleshooting must preserve those distinctions. [SOURCE: https://github.com/CodyBontecou/health-md-visualizations]

Android raw snapshots preserve provider-native structures and are explicitly not daily summaries. Storage Access Framework destinations may be local or provider-backed. Compatibility API uploads may be HTTP or HTTPS, while raw uploads require HTTPS and reject redirects. “Local-first” therefore does not mean every user-selected destination is local. [SOURCE: https://github.com/CodyBontecou/health-md-android]

## 6. Privacy and Safety Contract

- Never fabricate, extrapolate, or medically interpret health observations.
- Prefer read-only inspection; modify authentic exports only with explicit provenance and a contract-preserving reason.
- Do not recompute canonical roll-ups or dictionary mappings casually.
- Keep raw/lossless archives away from ordinary daily-note ingestion, broad search indexing, and indiscriminate sync.
- Treat exact timestamps, routes, clinical/FHIR content, medication events, source/device identity, and attachments as highly sensitive.
- Never infer that absence means zero or that a plugin chart provides diagnosis, safe/unsafe thresholds, or recommendations. [SOURCE: https://github.com/CodyBontecou/health-md-visualizations]

## 7. Reference-Set Remediation Order

1. Replace every `health-md` quick-start fence and invented `type: chart` / `dateRange` example with a tested `health-viz` block.
2. Add the mock-fallback warning and require verification of an authentic source file.
3. Replace Apple-only framing with the explicit Apple/Android compatibility and platform-gap model.
4. Narrow AI write authority: preserve real exported data; do not synthesize observations, raw archives, dictionaries, or roll-ups.
5. Add individual workout-note discovery, raw snapshot separation, permission ambiguity, and bounded-preview/privacy guidance.
6. Retain the accurate v0-v7, nesting, cache, roll-up, dictionary, and compact archive sections.

## 8. Source Record

- https://github.com/CodyBontecou/health-md-visualizations
- https://community.obsidian.md/plugins/health-md
- https://github.com/CodyBontecou/health-md
- https://github.com/CodyBontecou/health-md-android

Accessed during the lineage run on 2026-08-03. Current-version claims should be rechecked when these upstream projects change.
