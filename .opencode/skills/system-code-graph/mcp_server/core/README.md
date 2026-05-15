---
title: "Core: Database Directory Configuration"
description: "Resolves and exports the DATABASE_DIR constant for the code-graph MCP server, creating the directory when it does not exist."
trigger_phrases:
  - "code graph database directory"
  - "DATABASE_DIR"
  - "code graph config"
  - "SPECKIT_CODE_GRAPH_DB_DIR"
---

# Core: Database Directory Configuration

> Minimal configuration module that resolves the code-graph database directory from environment variables or a default path.

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1-overview)
- [2. KEY FILES](#2-key-files)
- [3. ENTRYPOINTS](#3-entrypoints)
- [4. VALIDATION](#4-validation)
- [5. RELATED](#5-related)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`mcp_server/core/` owns the `DATABASE_DIR` constant used by the code-graph MCP server. It resolves the database directory from the `SPECKIT_CODE_GRAPH_DB_DIR` environment variable, falling back to a default path. The module creates the target directory on load when it does not exist.

Current state:

- `config.ts` is the only file. It exports `DATABASE_DIR` after resolving the path and calling `mkdirSync` with `recursive: true`.
- The environment variable `SPECKIT_CODE_GRAPH_DB_DIR` takes precedence over the default path.
- Callers that need the code-graph database location import this module. The vector index and session manager both depend on it.
- The module imports only `node:fs`, `node:path` and `node:url`. It has no dependencies on other MCP server code.

`DATABASE_DIR` is always a valid, existing directory after the module loads. No runtime checks or guards are needed after import.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:key-files -->
## 2. KEY FILES

| File | Responsibility |
|---|---|
| `config.ts` | Resolves `SPECKIT_CODE_GRAPH_DB_DIR` or the default path, creates the directory and exports `DATABASE_DIR`. |

<!-- /ANCHOR:key-files -->

---

<!-- ANCHOR:entrypoints -->
## 3. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `DATABASE_DIR` | const | Absolute path to the code-graph database directory. Used by vector index and session manager initialization. |

<!-- /ANCHOR:entrypoints -->

---

<!-- ANCHOR:validation -->
## 4. VALIDATION

This module is validated through the full MCP server test suite.

```bash
cd .opencode/skills/system-code-graph && npm test
```

<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:related -->
## 5. RELATED

- [Parent: mcp_server](../README.md)
- [Skill README](../../README.md)
- [Library: lib/](../lib/README.md)

<!-- /ANCHOR:related -->
