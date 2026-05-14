---
title: "Code Graph Database: SQLite Runtime Artifacts"
description: "Local SQLite graph files and mk-code-index launcher state used by the standalone system-code-graph MCP server."
trigger_phrases:
  - "code graph database"
  - "code-graph sqlite"
  - "mk-code-index launcher state"
  - "parser skip list storage"
---

# Code Graph Database: SQLite Runtime Artifacts

> Local graph storage for `mk-code-index`. This folder stores runtime state, not source modules.

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. DIRECTORY TREE](#2--directory-tree)
- [3. KEY FILES](#3--key-files)
- [4. BOUNDARIES AND FLOW](#4--boundaries-and-flow)
- [5. VALIDATION](#5--validation)
- [6. RELATED](#6--related)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`mcp_server/database/` contains the local SQLite database and launcher state used by the standalone `mk-code-index` MCP server. The database stores indexed files, symbols, edges, metadata, verification baselines and parser skip-list rows.

Current state:

- `code-graph.sqlite` is the primary graph database.
- `code-graph.sqlite-shm` and `code-graph.sqlite-wal` are SQLite write-ahead logging companions.
- `.mk-code-index-launcher.json` records launcher state for the current MCP server name.
- Runtime code owns schema changes through `../lib/code-graph-db.ts`.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:directory-tree -->
## 2. DIRECTORY TREE

```text
database/
+-- .mk-code-index-launcher.json  # Launcher state for the standalone MCP server
+-- code-graph.sqlite             # Primary SQLite graph database
+-- code-graph.sqlite-shm         # SQLite shared-memory companion file
+-- code-graph.sqlite-wal         # SQLite write-ahead log companion file
`-- README.md                     # This file
```

<!-- /ANCHOR:directory-tree -->

---

<!-- ANCHOR:key-files -->
## 3. KEY FILES

| File | Responsibility |
|---|---|
| `code-graph.sqlite` | Stores graph files, nodes, edges, metadata, diagnostics, parser skip-list rows and verification records. |
| `code-graph.sqlite-shm` | SQLite shared-memory file created when WAL mode is active. |
| `code-graph.sqlite-wal` | SQLite write-ahead log file created when WAL mode is active. |
| `.mk-code-index-launcher.json` | Launcher state for the current standalone MCP server identity. |

<!-- /ANCHOR:key-files -->

---

<!-- ANCHOR:boundaries-flow -->
## 4. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Ownership | Treat this folder as runtime state. Source modules live in `../lib/`, `../handlers/` and `../tools/`. |
| Writes | Graph writes should flow through `../lib/code-graph-db.ts` or the launcher, not manual file edits. |
| Commits | Do not stage SQLite runtime churn unless a packet explicitly owns database-state evidence. |
| Namespace | Current launcher state uses `mk-code-index`, not the old `system_code_graph` server name. |

Main flow:

```text
code_graph_scan or recovery path
  -> ../lib/code-graph-db.ts
  -> code-graph.sqlite
  -> status, query, context and verify reads
```

<!-- /ANCHOR:boundaries-flow -->

---

<!-- ANCHOR:validation -->
## 5. VALIDATION

Run from the repository root when database behavior changes:

```bash
.opencode/skills/system-code-graph/node_modules/.bin/vitest --config .opencode/skills/system-code-graph/vitest.config.ts --run code-graph-db parser-skip-list code-graph-status
```

Expected result: SQLite schema, parser skip-list and status-readiness suites pass.

<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:related -->
## 6. RELATED

| Document | Purpose |
|---|---|
| [../lib/README.md](../lib/README.md) | Library modules that own schema, persistence and readiness behavior. |
| [../handlers/README.md](../handlers/README.md) | MCP handlers that call into database-backed graph operations. |
| [../../README.md](../../README.md) | Skill-level overview and operator guide. |

<!-- /ANCHOR:related -->
