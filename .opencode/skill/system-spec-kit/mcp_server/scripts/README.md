---
title: "Scripts"
description: "CLI utilities for manual memory database operations."
trigger_phrases:
  - "scripts"
  - "reindex embeddings"
  - "database maintenance"
importance_tier: "normal"
---

# Scripts

> CLI utilities for manual memory database operations.

---

## TABLE OF CONTENTS
<!-- ANCHOR:table-of-contents -->

- [1. 📖 OVERVIEW](#1--overview)
- [2. 📁 STRUCTURE](#2--structure)
- [3. 💡 USAGE](#3--usage)
- [4. 📚 RELATED RESOURCES](#4--related-resources)

<!-- /ANCHOR:table-of-contents -->

---

## 1. 📖 OVERVIEW
<!-- ANCHOR:overview -->

This folder contains standalone command-line scripts for administrative tasks on the Spec Kit Memory database. These tools operate independently of the MCP server and are used for maintenance, debugging, and force operations.

<!-- /ANCHOR:overview -->

---

## 2. 📁 STRUCTURE
<!-- ANCHOR:structure -->

| File                    | Purpose                                              |
| ----------------------- | ---------------------------------------------------- |
| `reindex-embeddings.ts` | Force regeneration of all embeddings in the database |

<!-- /ANCHOR:structure -->

---

## 3. 💡 USAGE
<!-- ANCHOR:usage -->

### Force Reindex All Memory Files

```bash
# TypeScript source (requires compilation first)
npm run build

# Run compiled version
node mcp_server/dist/scripts/reindex-embeddings.js
```

**When to use:**
- After changing embedding provider or model
- Database corruption or inconsistent state
- Manual verification of indexing system
- Testing embedding pipeline changes

**Output:**
- 5-phase initialization (database, config, embeddings, modules, scan)
- Progress summary with counts (scanned, indexed, updated, unchanged, failed)
- Constitutional memory tracking
- File-level status for changed entries

<!-- /ANCHOR:usage -->

---

## 4. 📚 RELATED RESOURCES
<!-- ANCHOR:related -->

- [Parent README](../README.md) - MCP server documentation
- [Reindex Script](./reindex-embeddings.ts) - Full TypeScript implementation
- [Vector Index Module](../lib/search/vector-index.ts) - Underlying indexing system
- [Compiled Output](../dist/scripts/reindex-embeddings.js) - Transpiled JavaScript (outDir)
<!-- /ANCHOR:related -->
