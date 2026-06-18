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

---

## 1. OVERVIEW

`mcp_server/core/` owns the `DATABASE_DIR` constant used by the code-graph MCP server. It resolves the database directory from the `SPECKIT_CODE_GRAPH_DB_DIR` environment variable, falling back to a default path. The module creates the target directory on load when it does not exist.

Current state:

- `config.ts` is the only file. It exports `DATABASE_DIR` after resolving the path and calling `mkdirSync` with `recursive: true`.
- The environment variable `SPECKIT_CODE_GRAPH_DB_DIR` takes precedence over the default path.
- Callers that need the code-graph database location import this module. Current consumers are `mcp_server/index.ts`, `lib/code-graph-db.ts`, `lib/apply-orchestrator.ts`, and `lib/recovery-procedures.ts`.
- The module imports only `node:fs`, `node:path` and `node:url`. It has no dependencies on other MCP server code.

`DATABASE_DIR` is always a valid, existing directory after the module loads. No runtime checks or guards are needed after import. Module load can throw if the resolved path cannot be created (for example, when `SPECKIT_CODE_GRAPH_DB_DIR` points to an unwritable location).

---

## 2. KEY FILES

| File | Responsibility |
|---|---|
| `config.ts` | Resolves `SPECKIT_CODE_GRAPH_DB_DIR` or the default path, creates the directory and exports `DATABASE_DIR`. |

---

## 3. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `DATABASE_DIR` | const | Absolute path to the code-graph database directory. Imported by `mcp_server/index.ts`, `lib/code-graph-db.ts`, `lib/apply-orchestrator.ts`, and `lib/recovery-procedures.ts`. |

---

## 4. VALIDATION

This module is validated through the full MCP server test suite.

```bash
cd .opencode/skills/system-code-graph && npm test
```

---

## 5. RELATED

- [Parent: mcp_server](../README.md)
- [Skill README](../../README.md)
- [Library: lib/](../lib/README.md)
