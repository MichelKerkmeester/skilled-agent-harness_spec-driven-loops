---
title: "System Code Graph Database Path Policy"
description: "Policy for the package-local code-graph SQLite database path required by ADR-002 extraction constraint."
trigger_phrases:
  - "system code graph db path"
  - "code-graph.sqlite path"
  - "code graph database policy"
---

# System Code Graph Database Path Policy

Policy for the package-local code-graph SQLite database path and supported override boundaries.

---

<!-- ANCHOR:1-overview -->
## 1. OVERVIEW

### Purpose

This policy fixes the current runtime location for the code graph's package-local SQLite database and its sidecar files. The database is the code graph's structural index state, so the policy ensures clear ownership boundaries after the ADR-002 extraction.

### When to Use

- Configuring `mk-code-index` database paths across runtimes.
- Reviewing tests or CI that override `SPECKIT_CODE_GRAPH_DB_DIR`.
- Diagnosing stale state from legacy database locations.

### Core Principle

All runtimes coordinate through one workspace-contained SQLite triplet owned by `system-code-graph`.

### Key Sources

- `INSTALL_GUIDE.md` §7 for operator-facing database configuration.
- `.opencode/bin/mk-code-index-launcher.cjs` for the standalone-storage guard.
- `mcp_server/lib/database-paths.ts` for runtime path resolution.

---

<!-- /ANCHOR:1-overview -->

<!-- ANCHOR:2-policy -->
## 2. POLICY

The code graph database lives in the shared spec-kit data directory:

```text
.opencode/.spec-kit/code-graph/database/code-graph.sqlite
```

It must not live under either of the following legacy locations:

```text
.opencode/skills/system-spec-kit/mcp_server/database/       (pre-extraction)
.opencode/skills/system-code-graph/mcp_server/database/     (post-extraction, pre-consolidation)
```

SQLite sidecars stay beside the database file:

```text
code-graph.sqlite-wal
code-graph.sqlite-shm
```

Additional runtime state lives in the same directory:

```text
.mk-code-index-launcher.json
.code-graph-readiness.json
```

The override path `SPECKIT_CODE_GRAPH_DB_DIR` is allowed for tests and disposable CI runs only. The launcher enforces a standalone-storage guard: the override must resolve inside the workspace root. External absolute paths are rejected at startup. See `INSTALL_GUIDE.md` §7 (Database and Maintainer Mode) for the canonical configuration.

---

<!-- /ANCHOR:2-policy -->

<!-- ANCHOR:3-rationale -->
## 3. RATIONALE

ADR-002 extraction constraint required DB-local ownership for the extracted code graph skill, but cross-runtime sharing surfaced a second constraint: every runtime (OpenCode, Claude Code, Codex, Gemini, Devin, VSCode) must read and write a single graph instead of fragmenting state per-runtime. The shared `.opencode/.spec-kit/code-graph/` location satisfies both: the standalone `mk-code-index` MCP server owns the runtime state, and all runtimes coordinate through one SQLite triplet.

This produces cleaner mutation scope:

- `/doctor:update` and future repair flows reason per shared data directory, not per skill folder.
- The scan loop in `system-code-graph` is the single writer for `code-graph.sqlite`.
- `system-spec-kit` keeps memory and spec packet state in its own DB; ownership boundary is preserved.
- Backups, cleanup, and integrity checks target one well-known shared path.

The shared SQLite file remains the coordination boundary between in-process imports (from `system-spec-kit` handlers) and MCP tool callers (via `mk_code_index`).

---

<!-- /ANCHOR:3-rationale -->

<!-- ANCHOR:4-test-and-ci-override -->
## 4. TEST AND CI OVERRIDE

`SPECKIT_CODE_GRAPH_DB_DIR` is allowed for tests and disposable CI runs only. Tests typically use temporary directories via `mkdtempSync` and pass `dbDir` as a function parameter rather than relying on the environment variable.

The launcher enforces a standalone-storage guard so the override path must resolve inside the workspace root. External absolute paths are rejected. Production and operator docs should treat `.opencode/.spec-kit/code-graph/database/` as the default. A runtime override must not silently re-collocate the database with `system-spec-kit/mcp_server/database/`.

---

<!-- /ANCHOR:4-test-and-ci-override -->

<!-- ANCHOR:5-migration-notes -->
## 5. MIGRATION NOTES

The code graph database has moved twice:

1. **Pre-extraction → skill-local (packet 013).** `system-spec-kit/mcp_server/database/` → `system-code-graph/mcp_server/database/`. Established skill-local DB ownership per ADR-002.
2. **Skill-local → shared spec-kit data dir (packet 019/020 + cross-runtime consolidation).** `system-code-graph/mcp_server/database/` → `.opencode/.spec-kit/code-graph/database/`. The launcher auto-migrates legacy installs on first startup: the SQLite triplet, readiness marker, and launcher state file are **copied** (not moved) so the prior location is preserved as a backup. Configs that still reference the `system_code_graph` MCP server name should be renamed to `mk_code_index`.

Cross-skill consumers reach the data through two paths: in-process imports from `system-spec-kit` handlers and hooks, and the standalone MCP namespace used by agents and commands. SessionStart hooks remain under `system-spec-kit/mcp_server/hooks/` due to 110-plus file references. This asymmetry is intentional and any future move is planned as a separate packet with build and config redesign scope.

<!-- /ANCHOR:5-migration-notes -->
