---
title: "Health.md File-Layer Troubleshooting"
description: "Cause, detection, and recovery for Health.md data-folder misses (including the bundled mock-data trap), format mismatches, schema-version drift, empty charts, platform gaps, and settings misconfigurations."
trigger_phrases:
  - "health md chart empty"
  - "health md no data found"
  - "health md wrong file pattern"
  - "health md schema version"
  - "health md settings json"
  - "health md mock data"
importance_tier: "normal"
contextType: "general"
version: 0.4.1.0
---

# Health.md File-Layer Troubleshooting

Diagnose data files, folder settings, platform boundaries, and render blocks separately. A valid data file can still fail to render when the folder, pattern, format, platform, or block type is wrong.

---

## 1. OVERVIEW

| Symptom | Most likely cause |
| --- | --- |
| "No data found" in the chart | Data folder path or file pattern setting doesn't cover the files |
| Chart shows bundled example data | Data folder missing or empty — plugin falls back to deterministic bundled example data; verify against an authentic source file |
| Chart renders but is empty | No records, denied permission, disabled export selection, absent platform capability, or unsupported visualization |
| Files ignored | Format mismatch (`auto` misdetect) or schema version > 7 (best-effort) |
| Wrong numbers | Roll-up duplicates daily records, or mixed timezone contexts |
| Platform-specific surface missing | iOS-only feature on Android, or a known Android gap (see §3) |
| Plugin settings lost | `data.json` edited into invalid JSON |

## 2. DIAGNOSIS SEQUENCE

1. Read the plugin settings file (`.obsidian/plugins/health-md/data.json`) — folder, structure, pattern, format. After export-setting changes, run the explicit diagnostic: Settings → Health.md Visualizations → Health.md schema compatibility → **Scan now**.
2. Resolve the actual selected data folder; check that it exists and is non-empty (the mock-fallback trap hides here).
3. List the data folder — do the files exist and match the pattern?
4. Read one file — does it parse (JSON/YAML), and does its `schema_version` exist (0–7)?
5. Identify the file layer — daily summary vs roll-up (under `Rollups/`) vs lossless/raw archive vs individual entry note; diagnose them separately.
6. Check the note's render block — is `type` a registered renderer, and does the referenced metric resolve (see `_healthmd_data_dictionary.json`)?
7. Check the platform dimension — an iOS-only surface on Android is expected behavior, not a bug.

## 3. PLATFORM DISTINCTIONS

- Mood/State of Mind and HealthKit-style medication catalog/dose events are **iOS-only**; an empty chart for them on Android is expected.
- Android walking symmetry coverage is **partial**.
- Android Stand can use an explicit **steps-derived proxy** when `standHours` is missing.
- Routes and sample charts require granular data plus permission/consent — check both, not just the files.
- Missing data is ordinarily absent, not zero; an empty chart does not imply a zero measurement.
- Empty-chart causes to distinguish: no records, denied permission, disabled export selection, absent platform capability, unsupported visualization.

## 4. RECOVERY

| Problem | Fix |
| --- | --- |
| Pattern excludes the file | Widen `file pattern` in settings or rename the file to match |
| Format misdetected | Set `data format` explicitly instead of `auto` |
| Folder missing/empty (mock data showing) | Create the folder and place an authentic export, or point settings at the real data folder |
| Empty/placeholder data file | Delete it; never fabricate data |
| Unknown schema version | Treat as best-effort; do not promise rendering; do not relabel historical files |
| Render block with wrong type or metric | Copy a known-good block from the vault; verify the renderer and metric first |
| iOS-only surface on Android | Expected — no fix; document the platform gap |
| Permission/consent missing (routes, samples) | User must grant granular data permission/consent, then re-export |
| Invalid `data.json` | Restore from backup or re-create with the known defaults, then reload Obsidian |

## 5. LIMITS

- The plugin's in-app cache invalidates on file changes, but **rendering itself happens in Obsidian** — the AI verifies files, not pixels.
- A rendered chart is not verification: with a missing/empty data folder it shows bundled example data.
- Large JSON/CSV/lossless files receive a bounded preview in-app; the AI should query the file directly for full values, and keep archives out of ingestion and search.
- Never infer that absence means zero, and never treat a plugin chart as diagnosis, a safe/unsafe threshold, or a recommendation.
