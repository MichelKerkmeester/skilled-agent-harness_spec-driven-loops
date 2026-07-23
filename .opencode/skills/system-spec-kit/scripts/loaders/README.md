---
title: "Data Loaders"
description: "Data loader module that normalizes explicit structured JSON input, then hard-stops when no usable session data exists."
trigger_phrases:
  - "data loaders"
  - "load collected data"
  - "context loading"
---

# Data Loaders

## 1. OVERVIEW

`scripts/loaders/` is the script-side ingestion layer for context generation. It loads explicit structured JSON input, validates that usable session data exists and returns a consistent object for extractors and renderers.

## 2. SCRIPT IO

| Source | Input | Output |
| --- | --- | --- |
| Explicit JSON | `dataFile` option, populated via a file path, `--stdin`, or `--json` | Parsed and normalized session data tagged `_source: 'file'` |
| Legacy shared path | A legacy shared `save-context` `dataFile` path | `LEGACY_SHARED_DATA_FILE` rejection |
| No data | `dataFile` unset | `NO_DATA_FILE` hard stop |
| Read or parse failure | Missing file, permission error or invalid JSON | `EXPLICIT_DATA_FILE_LOAD_FAILED` error |

## 3. ENTRYPOINTS

- `loadCollectedData()` loads and validates the explicit JSON data file, sanitizes the path, normalizes the payload and enforces the no-data hard stop.
- `index.ts` re-exports `loadCollectedData` plus the `DataSource` and `LoadedData` types for script consumers.

## 4. VALIDATION FROM REPO ROOT

Run loader validation from the repository root:

```bash
npm --prefix .opencode/skills/system-spec-kit/scripts run build
node -e "const loaders=require('./.opencode/skills/system-spec-kit/scripts/dist/loaders'); console.log(Object.keys(loaders).sort())"
python3 .opencode/skills/sk-code/code-opencode/assets/scripts/verify_alignment_drift.py --root .opencode/skills/system-spec-kit/scripts/loaders
```

## 5. KEY FILES

| File | Purpose |
| --- | --- |
| `data-loader.ts` | Loads the explicit JSON data file, applies path checks, normalizes the payload and throws clear no-data errors |
| `index.ts` | Barrel export for the loader API |

## 6. BOUNDARIES

- Loaders do not extract decisions, files, diagrams, or implementation facts.
- Loaders do not render markdown or update spec documents.
- Path checks must stay inside the loader before any explicit file content is trusted.

## 7. RELATED

- `../extractors/README.md`
- `../renderers/README.md`
- `../utils/README.md`
