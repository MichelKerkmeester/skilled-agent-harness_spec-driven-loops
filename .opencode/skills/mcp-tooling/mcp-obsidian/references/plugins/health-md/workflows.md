---
title: "Health.md File-Layer Workflows"
description: "Safe file-layer recipes for Health.md: create the data folder, add export files, place chart blocks, adjust the folder structure, and verify what renders."
trigger_phrases:
  - "create health md chart"
  - "add apple health data file"
  - "health md render block"
  - "health data folder setup"
importance_tier: "normal"
contextType: "implementation"
version: 1.2.0.0
---

# Health.md File-Layer Workflows

These recipes change the **data files** Health.md renders. The plugin watches the data folder, so file writes are the entire operation; no app reload is needed for the cache to refresh.

---

## 1. OVERVIEW

### Operating sequence

1. Locate the data folder (default `<vault>/Health/`; check the plugin settings for overrides).
2. Inspect what exists: files, formats, schema versions, roll-ups.
3. Write/append data files using an existing file's shape as the template.
4. Place/adjust the render block in the target note.
5. Verify by reading the files back — the visual itself renders in-app only.

## 2. RECIPES

### 2.1 First-time setup (no data folder)

- Create `<vault>/Health/`.
- Do **not** create placeholder/empty data files — an empty export is a false chart.
- Report to the user that no health data exists yet and that the Health.md app (or any Apple Health export) is the data source.

### 2.2 Add a data file (with real data in hand)

- Match the existing format: JSON export → `Health/<name>.json`; CSV → `Health/<name>.csv`; frontmatter note → `Health/<name>.md`.
- For JSON, keep the `healthmd.health_data` wrapper and set `schema_version` to the version the file actually conforms to (0–7).
- For Markdown, keep YAML frontmatter with schema/units/timezone when available.

### 2.3 Add a roll-up

- `Health/Rollups/<name>.json|.md|.csv` — v7 format for JSON/Markdown/Bases; unversioned structural CSV for CSV.
- Do not duplicate daily records into roll-ups (double counting).

### 2.4 Place a chart in a note

```markdown
```health-md
type: chart
metric: step_count
dateRange: last7d
```
```

- Prefer copying an existing working block from the vault over inventing block fields; unknown block options render nothing.

### 2.5 Switch to a dated structure

- Create `Health/2026/06/` etc., move existing files, and set the plugin's data folder structure to `Year`/`Month`/`Day` or a custom template (files directly under the data folder keep loading, so migration is safe).
- Update the `data.json` setting via the same JSON edit discipline as any plugin settings file.

## 3. VERIFYING

- After any write: `Read` the file back and validate JSON/YAML parse.
- Confirm the file matches the plugin's `file pattern` setting.
- Confirm the note's render block references a metric that actually exists in the data (check `_healthmd_data_dictionary.json` when unsure).
