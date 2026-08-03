---
title: "Health.md File-Layer Workflows"
description: "Safe file-layer recipes for Health.md: resolve the configured data folder, add authentic export files, place health-viz chart blocks, adjust folder structure, verify real data (mock-fallback escape), and discover entry notes."
trigger_phrases:
  - "create health md chart"
  - "add apple health data file"
  - "health md render block"
  - "health data folder setup"
  - "health-viz block"
importance_tier: "normal"
contextType: "implementation"
version: 1.2.1.0
---

# Health.md File-Layer Workflows

These recipes change the **data files** Health.md renders. The plugin invalidates its cache on vault create/modify/delete events under the data folder, so file writes are the entire operation; no app reload is needed for the cache to refresh.

---

## 1. OVERVIEW

### Operating sequence

1. Read the plugin settings (`.obsidian/plugins/health-md/data.json`) and resolve the **actual selected data folder**, structure, pattern, and format — never assume the default.
2. Inspect what exists: files, formats, schema versions, roll-ups, dictionary, entry notes.
3. Write/append data files using an existing authentic file's shape as the template.
4. Place/adjust the `health-viz` render block in the target note.
5. Verify the file layer by reading the files back — the visual itself renders in-app only.

## 2. RECIPES

### First-time setup (no data folder)

- Create `<vault>/Health/` (or the folder named in settings).
- Do **not** create placeholder/empty data files — an empty export is a false chart.
- Note the mock-fallback trap: while the data folder is missing or empty, the plugin renders deterministic bundled example data, so a rendered chart proves nothing.
- Report to the user that no health data exists yet and that the Health.md app (or any real health export) is the data source.

### Add a data file (with real data in hand)

- Match the existing format: JSON export → `<data folder>/<name>.json`; CSV → `<data folder>/<name>.csv`; frontmatter note → `<data folder>/<name>.md`.
- For JSON, keep the `healthmd.health_data` wrapper and set `schema_version` to the version the file actually conforms to (0–7). Never relabel historical files; re-export only when corrected v7 semantics are required.
- For Markdown, keep YAML frontmatter with schema/units/timezone when available.
- Preserve the export exactly; never synthesize or extrapolate observations.

### Add a roll-up

- `<data folder>/Rollups/<name>.json|.md|.csv` — v7 semantics for JSON/Markdown/Bases; unversioned structural CSV for CSV.
- Do not duplicate daily records into roll-ups (double counting), and do not silently rewrite older roll-ups.

### Place a chart in a note

```health-viz
type: step-spiral
last: 7
```

- `type` is required and must name a registered renderer. Common optional keys: `width`, `height`, inclusive `from`/`to`, `last`, `clickAction`.
- Dates may be ISO dates/datetimes, built-in dynamic variables such as `{{today:YYYY-MM-DD}}`, or frontmatter variables; raw Templater or Dataview expressions are not a reliable substitute.
- Prefer copying an existing working block from the vault over inventing keys; unknown block options render nothing.

### Switch to a dated structure

- Create `<data folder>/2026/06/` etc., move existing files, and set the data folder structure to `Year`/`Month`/`Week`/`Day` or a custom template (`{year}`, `{month}`, `{week}`, `{day}`, `{date}`).
- Files directly under the data folder keep loading in nested modes, so migration is safe.
- Update the settings via the same JSON edit discipline as any plugin settings file.

### Verify a chart shows real data (mock-fallback escape)

1. Read the data folder value from settings — not the default.
2. Confirm that folder exists and is non-empty.
3. Open at least one authentic source file: it parses and matches the file pattern.
4. Confirm the block's `type` is a registered renderer and any referenced metric resolves via `_healthmd_data_dictionary.json`.

### Discover individual entry notes

- Search for workout, vitals, and platform-specific entries by declared frontmatter/tags — a separate discovery path from daily summaries.
- Do not merge them into daily summaries or roll-ups.

### Privacy handling

- Keep lossless/raw archives out of ingestion, broad search indexing, and indiscriminate sync; large inputs get bounded previews.
- Treat exact timestamps, routes, clinical/FHIR content, medication events, source/device identity, and attachments as highly sensitive.

## 3. VERIFYING

- After any write: `Read` the file back and validate JSON/YAML parse.
- Confirm the file matches the plugin's `file pattern` setting and the resolved data folder.
- Confirm the note's render block references a metric that actually exists in the data (check `_healthmd_data_dictionary.json` when unsure).
- Never treat a rendered chart as verification on its own — follow the real-data verification workflow.
