---
title: "Scripts"
description: "Operational script(s) for forced embedding reindex and maintenance workflows."
trigger_phrases:
  - "scripts"
  - "reindex embeddings"
  - "database maintenance"
importance_tier: "normal"
---

# Scripts

## Overview

`scripts/` currently contains one operational script:

- `reindex-embeddings.ts`

The script initializes runtime modules, warms embeddings, and runs a forced full scan through `handleMemoryIndexScan({ force: true, includeConstitutional: true })`.

## Implemented State

- Reindex path runs through current handlers (not a separate indexing implementation).
- Indexed scope follows current scan behavior, including README/spec-doc discovery defaults.
- Script prints a concise progress summary and exits non-zero on fatal startup failures.

## Usage

```bash
npm run build
node mcp_server/dist/scripts/reindex-embeddings.js
```

## Related

- `../handlers/memory-index.ts`
- `../handlers/memory-save.ts`
- `../core/README.md`
