---
title: "Data Loaders"
description: "Data loader modules that normalize input from JSON files or native CLI capture, then hard-stop when no usable session data exists."
trigger_phrases:
  - "data loaders"
  - "load collected data"
  - "context loading"
---

# Data Loaders

## 1. OVERVIEW

`scripts/loaders/` is the script-side ingestion layer for context generation. It loads explicit JSON input or normalized native capture data, validates that usable session data exists, and returns a consistent object for extractors and renderers.

## 2. SCRIPT IO

| Source | Input | Output |
| --- | --- | --- |
| Explicit JSON | `dataFile` option | Parsed and normalized session data |
| Preferred capture | `preferredCaptureSource` option or `SYSTEM_SPEC_KIT_CAPTURE_SOURCE` | Normalized native capture data |
| Capture fallback | OpenCode, Claude Code, OpenCode, Copilot CLI | First usable native capture payload |
| No data | Empty or unusable sources | `NO_DATA_AVAILABLE` hard stop |

## 3. ENTRYPOINTS

- `loadData()` loads explicit or captured data and enforces the no-data hard stop.
- `loadFromJsonFile()` reads and validates explicit JSON data files.
- `loadFromNativeCapture()` loads normalized data from supported CLI capture sources.
- `index.ts` re-exports the public loader API for script consumers.

## 4. VALIDATION FROM REPO ROOT

Run loader validation from the repository root:

```bash
npm --prefix .opencode/skills/system-spec-kit/scripts run build
node -e "const loaders=require('./.opencode/skills/system-spec-kit/scripts/dist/loaders'); console.log(Object.keys(loaders).sort())"
python3 .opencode/skills/sk-code/code-quality/scripts/verify_alignment_drift.py --root .opencode/skills/system-spec-kit/scripts/loaders
```

## 5. KEY FILES

| File | Purpose |
| --- | --- |
| `data-loader.ts` | Loads explicit data, applies path checks, normalizes capture data, and throws clear no-data errors |
| `index.ts` | Barrel export for the loader API |

## 6. BOUNDARIES

- Loaders do not extract decisions, files, diagrams, or implementation facts.
- Loaders do not render markdown or update spec documents.
- Path checks must stay inside the loader before any explicit file content is trusted.

## 7. RELATED

- `../extractors/README.md`
- `../renderers/README.md`
- `../utils/README.md`
