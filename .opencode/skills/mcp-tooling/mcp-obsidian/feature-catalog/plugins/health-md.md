---
title: "Health.md file-layer data operations"
description: "Create, patch, and validate Apple Health and Android Health export files (JSON/CSV/Markdown/Bases) in the vault data folder, and place health-viz render blocks — without fabricating data."
trigger_phrases:
  - "health md file layer"
  - "apple health data files"
  - "android health data files"
  - "health chart block"
  - "health data folder"
  - "health-viz render block"
version: 0.4.1.0
---

# Health.md file-layer data operations (`health-md`)

## 1. OVERVIEW

Health.md Visualizations (repo `codybontecou/health-md-visualizations`, installed v2.1.0 in every vault by Phase 11) renders Apple Health and Android Health exports from plain data files in a vault folder (default `Health/`). The mode operates the **data files**, never the chart UI. Formats: JSON (`healthmd.health_data` schema v0–v7), CSV, Markdown frontmatter (Bases-style), Obsidian Bases. Compatibility profiles: Apple v7, Android frozen v4, and Android analytical v5 — format names are shared, but version and semantic differences stay explicit. Chart coverage is shared across platforms for common activity, heart, respiratory/vitals, sleep, mobility, workout, body, nutrition, and hearing fields; Mood/State of Mind and HealthKit-style medication events are iOS-only; Android walking symmetry is partial and Android Stand can use an explicit steps-derived proxy when `standHours` is missing. Roll-ups live under `Health/Rollups/`; `_healthmd_data_dictionary.json` holds canonical metric ids/units. The plugin watches the folder and refreshes its cache on file changes.

---

## 2. HOW IT WORKS

Write data files into the configured data folder matching the existing file shapes; insert a `health-viz` fenced render block into a note to display a chart (`type` is required and must name a registered renderer, e.g. `step-spiral`; the plugin does not read a `health-md` fence); verify by parsing the file back. Settings (`data.json`: folder, structure, file pattern, format) may be read, and adjusted only when the user asks to reorganize the data folder.

**Mock-fallback trap:** when the configured data folder is missing or empty, the plugin renders deterministic bundled example data — a rendered chart proves neither that the folder was found nor that real exports were loaded. Before trusting any chart, identify the actual selected data folder from `.obsidian/plugins/health-md/data.json` (not the default) and confirm at least one authentic source file exists there, matches the file pattern, and parses.

---

## 3. SOURCE FILES

### Implementation

- Plugin index: `references/plugins/health-md/health-md.md`
- Data contract: `references/plugins/health-md/data-model.md`
- Recipes: `references/plugins/health-md/workflows.md`
- Diagnostics: `references/plugins/health-md/troubleshooting.md`

### Assets

- `assets/plugins/health-md/healthmd-export.example.json` — minimal valid v7-shaped export fixture
- `assets/plugins/health-md/health-viz-blocks.example.md` — researched-validated `health-viz` render-block forms (minimal, sized, windowed, last-N, click, dynamic date)

### Verification

- Manual scenario: `manual-testing-playbook/plugin-tie-ins/health-md-data.md`

---

## 4. GUARDRAILS

- **Never fabricate or extrapolate health data.** Absent data → state it and offer to create the folder; empty files are false charts.
- **Never count a rendered chart as evidence.** Verify the actual data folder and an authentic source file first — bundled mock data renders when the folder is empty.
- **Never synthesize observations, roll-ups, or dictionaries.** Modify authentic exports only with explicit provenance and a contract-preserving reason.
- **Keep raw/lossless archives out of ingestion** (`healthmd.healthkit_records` v1 and Android raw JSON/NDJSON snapshots): no rewriting, no broad search indexing, no indiscriminate sync.
- Do not claim schema support beyond v7 (newer versions are best-effort).
- Do not edit HealthKit records archive payloads (the plugin reads compact diagnostics only).
