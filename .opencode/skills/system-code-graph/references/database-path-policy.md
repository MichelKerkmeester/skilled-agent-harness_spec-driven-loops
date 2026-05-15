---
title: "System Code Graph Database Path Policy"
description: "Policy for the package-local code-graph SQLite database path required by ADR-002 extraction constraint."
trigger_phrases:
  - "system code graph db path"
  - "code-graph.sqlite path"
  - "code graph database policy"
---

# System Code Graph Database Path Policy

<!-- sk-doc-template: skill_reference -->

---

<!-- ANCHOR:1-overview -->
## 1. OVERVIEW

This policy fixes the current runtime location for the code graph's package-local SQLite database and its sidecar files. The database is the code graph's structural index state, so the policy ensures clear ownership boundaries after the ADR-002 extraction.

---

<!-- /ANCHOR:1-overview -->

<!-- ANCHOR:2-policy -->
## 2. POLICY

The code graph database lives inside the standalone code graph skill package:

```text
.opencode/skills/system-code-graph/mcp_server/database/code-graph.sqlite
```

It must not live under:

```text
.opencode/skills/system-spec-kit/mcp_server/database/
```

SQLite sidecars stay beside the database file:

```text
code-graph.sqlite-wal
code-graph.sqlite-shm
```

Additional runtime state lives in the same directory:

```text
.mk-code-index-launcher.json
```

---

<!-- /ANCHOR:2-policy -->

<!-- ANCHOR:3-rationale -->
## 3. RATIONALE

ADR-002 extraction constraint requires DB-local ownership for the extracted code graph skill. The database is the code graph's runtime state, so it belongs with the skill that reads, writes, validates and rebuilds it.

This separation produces cleaner mutation scope:

- `/doctor:update` and future repair flows can reason per skill package.
- The scan loop in `system-code-graph` is the single writer for `code-graph.sqlite`.
- `system-spec-kit` keeps memory and spec packet state without owning code-graph runtime data.
- Backups, cleanup and integrity checks can target the code graph package directly.

The shared SQLite file is the coordination boundary between in-process imports and MCP tool callers.

---

<!-- /ANCHOR:3-rationale -->

<!-- ANCHOR:4-test-and-ci-override -->
## 4. TEST AND CI OVERRIDE

`SPECKIT_CODE_GRAPH_DB_DIR` is allowed for tests and disposable CI runs only. Tests typically use temporary directories via `mkdtempSync` and pass `dbDir` as a function parameter rather than relying on the environment variable.

The launcher enforces a standalone-storage guard so the override path must resolve inside the workspace root. External absolute paths are rejected. Production and operator docs should treat the package-local path as the default. A runtime override must not silently re-collocate the database with `system-spec-kit/mcp_server/database/`.

---

<!-- /ANCHOR:4-test-and-ci-override -->

<!-- ANCHOR:5-migration-notes -->
## 5. MIGRATION NOTES

The database moved from `system-spec-kit/mcp_server/database/` to `system-code-graph/mcp_server/database/` during the code graph extraction. Existing configs that still reference the `system_code_graph` MCP server name should be renamed to `mk_code_index`.

Cross-skill consumers reach the data through two paths: in-process imports from `system-spec-kit` handlers and hooks, and the standalone MCP namespace used by agents and commands. SessionStart hooks remain under `system-spec-kit/mcp_server/hooks/` due to 110-plus file references. This asymmetry is intentional and any future move is planned as a separate packet with build and config redesign scope.

<!-- /ANCHOR:5-migration-notes -->
