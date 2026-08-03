---
title: "Health.md file-layer data operations"
description: "Create, patch, and validate Apple Health export files (JSON/CSV/Markdown/Bases) in the vault data folder, and place render blocks — without fabricating data."
trigger_phrases:
  - "health md file layer"
  - "apple health data files"
  - "health chart block"
  - "health data folder"
version: 1.2.0.0
---

# Health.md file-layer data operations (`health-md`)

## 1. OVERVIEW

Health.md Visualizations (repo `codybontecou/health-md-visualizations`, installed v2.1.0 in every vault by Phase 11) renders Apple Health data from plain data files in a vault folder (default `Health/`). The mode operates the **data files**, never the chart UI. Formats: JSON (`healthmd.health_data` schema v0–v7), CSV, Markdown frontmatter (Bases-style), Obsidian Bases. Roll-ups live under `Health/Rollups/`; `_healthmd_data_dictionary.json` holds canonical metric ids/units. The plugin watches the folder and refreshes its cache on file changes.

## 2. HOW IT WORKS

Write data files into the configured data folder matching the existing file shapes; insert the `health-md` fenced render block into a note to display a metric; verify by parsing the file back. Settings (`data.json`: folder, structure, file pattern, format) may be read, and adjusted only when the user asks to reorganize the data folder.

## 3. SOURCE FILES

### Implementation

- Plugin index: `references/plugins/health-md/health-md.md`
- Data contract: `references/plugins/health-md/data-model.md`
- Recipes: `references/plugins/health-md/workflows.md`
- Diagnostics: `references/plugins/health-md/troubleshooting.md`

### Assets

- `assets/plugins/health-md/healthmd-export.example.json` — minimal valid v7-shaped export fixture

### Verification

- Manual scenario: `manual-testing-playbook/plugin-tie-ins/health-md-data.md`

## 4. GUARDRAILS

- **Never fabricate or extrapolate health data.** Absent data → state it and offer to create the folder; empty files are false charts.
- Do not claim schema support beyond v7 (newer versions are best-effort).
- Do not edit HealthKit records archive payloads (binary; ignored by the plugin anyway).
