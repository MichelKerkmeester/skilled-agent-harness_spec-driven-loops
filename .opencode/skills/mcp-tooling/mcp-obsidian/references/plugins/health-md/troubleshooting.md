---
title: "Health.md File-Layer Troubleshooting"
description: "Cause, detection, and recovery for Health.md data-folder misses, format mismatches, schema-version drift, empty charts, and settings misconfigurations."
trigger_phrases:
  - "health md chart empty"
  - "health md no data found"
  - "health md wrong file pattern"
  - "health md schema version"
  - "health md settings json"
importance_tier: "normal"
contextType: "general"
version: 1.2.0.0
---

# Health.md File-Layer Troubleshooting

Diagnose data files, folder settings, and render blocks separately. A valid data file can still fail to render when the folder, pattern, format, or block metric is wrong.

---

## 1. OVERVIEW

| Symptom | Most likely cause |
|---|---|
| "No data found" in the chart | Data folder path or file pattern setting doesn't cover the files |
| Chart renders but is empty | Metric name in the block doesn't exist in the data (or data file is empty) |
| Files ignored | Format mismatch (`auto` misdetect) or schema version > 7 (best-effort) |
| Wrong numbers | Roll-up duplicates daily records, or mixed timezone contexts |
| Plugin settings lost | `data.json` edited into invalid JSON |

## 2. DIAGNOSIS SEQUENCE

1. Read the plugin settings file (`.obsidian/plugins/health-md/data.json`) — folder, structure, pattern, format.
2. List the data folder — do the files exist and match the pattern?
3. Read one file — does it parse (JSON/YAML), and does its `schema_version` exist (0–7)?
4. Check the note's render block — does the metric name resolve (see `_healthmd_data_dictionary.json`)?
5. Confirm the file is a daily export vs a roll-up (roll-ups live under `Rollups/`).

## 3. RECOVERY

| Problem | Fix |
|---|---|
| Pattern excludes the file | Widen `file pattern` in settings or rename the file to match |
| Format misdetected | Set `data format` explicitly instead of `auto` |
| Empty/placeholder data file | Delete it; never fabricate data |
| Unknown schema version | Treat as best-effort; do not promise rendering |
| Render block with wrong metric | Copy a known-good block from the vault; verify metric id first |
| Invalid `data.json` | Restore from backup or re-create with the known defaults, then reload Obsidian |

## 4. LIMITS

- The plugin's in-app cache refreshes on file changes, but **rendering itself happens in Obsidian** — the AI verifies files, not pixels.
- Large JSON/CSV files receive a bounded preview in-app; the AI should query the file directly for full values.
