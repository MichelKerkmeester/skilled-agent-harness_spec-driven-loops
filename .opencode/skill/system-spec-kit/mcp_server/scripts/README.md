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

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. 📖 OVERVIEW](#1--overview)
- [2. 📌 IMPLEMENTED STATE](#2--implemented-state)
- [3. 💡 USAGE](#3--usage)
- [4. 📚 RELATED](#4--related)

<!-- /ANCHOR:table-of-contents -->
<!-- ANCHOR:overview -->
## 1. 📖 OVERVIEW

This section provides an overview of the Scripts directory.

`scripts/` currently contains one operational script:

- `reindex-embeddings.ts`

The script initializes runtime modules, warms embeddings, and runs a forced full scan through `handleMemoryIndexScan({ force: true, includeConstitutional: true })`.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:implemented-state -->
## 2. 📌 IMPLEMENTED STATE


- Reindex path runs through current handlers (not a separate indexing implementation).
- Indexed scope follows current scan behavior, including README/spec-doc discovery defaults.
- Script prints a concise progress summary and exits non-zero on fatal startup failures.


<!-- /ANCHOR:implemented-state -->
<!-- ANCHOR:usage -->
## 3. 💡 USAGE


```bash
npm run build
node mcp_server/dist/scripts/reindex-embeddings.js
```


<!-- /ANCHOR:usage -->
<!-- ANCHOR:related -->
## 4. 📚 RELATED


- `../handlers/memory-index.ts`
- `../handlers/memory-save.ts`
- `../core/README.md`
<!-- /ANCHOR:related -->
