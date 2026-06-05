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

## 1. OVERVIEW

### Purpose

This policy fixes the current runtime location for the code graph's package-local SQLite database and its sidecar files. The database is the code graph's structural index state, so the policy ensures clear ownership boundaries after the ADR-002 extraction.

### When to Use

- Configuring `mk-code-index` database paths across runtimes.
- Reviewing tests or CI that override `SPECKIT_CODE_GRAPH_DB_DIR`.
- Diagnosing stale state from legacy database locations.

### Core Principle

All runtimes coordinate through one SQLite triplet owned by and co-located with `system-code-graph`, reached by every runtime through the `.opencode/skills` symlink.

### Key Sources

- `INSTALL_GUIDE.md` §7 for operator-facing database configuration.
- `.opencode/bin/mk-code-index-launcher.cjs` for the standalone-storage guard + skill-local path resolution + migration-back.
- `mcp_server/core/config.ts` (`DATABASE_DIR`) and `mcp_server/lib/canonical-db-dir.ts` for runtime path resolution.

---

## 2. POLICY

The code graph database lives SKILL-LOCAL, owned by and co-located with its skill:

```text
.opencode/skills/system-code-graph/mcp_server/database/code-graph.sqlite
```

Every repo-managed runtime (`.claude` / `.codex` / `.opencode`) reaches this path through the
`.opencode/skills` symlink, so the skill-local database is a single shared instance with no
per-runtime fragmentation. It must not live under either of the following:

```text
.opencode/skills/system-spec-kit/mcp_server/database/    (pre-extraction; wrong skill)
.opencode/.spec-kit/code-graph/database/                 (former shared location; superseded 2026-05-29)
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

## 3. RATIONALE

**Reversal note (2026-05-29):** the database was previously placed at the shared
`.opencode/.spec-kit/code-graph/database/` location under the assumption that a skill-local
DB would fragment state per-runtime. That assumption was wrong: every runtime symlinks
`.opencode/skills` to one physical directory, so a skill-local DB at
`system-code-graph/mcp_server/database/` is already a single shared instance. Cross-runtime
sharing therefore does not distinguish skill-local from `.spec-kit` — both are equally shared.

Given that, the database is kept SKILL-LOCAL because that is the simpler ownership model:

- The `system-code-graph` skill owns both its server source AND its runtime DB in one tree — no split between code and the state it produces.
- `system-spec-kit` keeps memory and spec packet state in its own DB; the ownership boundary is preserved.
- The scan loop in `system-code-graph` remains the single writer for `code-graph.sqlite`.
- Backups, cleanup, and integrity checks target one well-known skill-local path.

This reverses ADR-002/004/005's consolidation-to-`.spec-kit` decision. **Trade-off:** because the
DB now lives inside the (committed, symlinked) skill folder, skill re-sync / reinstall flows must
treat `mcp_server/database/` runtime artifacts as gitignored, regenerable state and never overwrite
a live DB; the `.gitignore` rules and the launcher migration-back handle this. The SQLite file
remains the coordination boundary between in-process imports and MCP tool callers (via `mk_code_index`).

---

## 4. TEST AND CI OVERRIDE

`SPECKIT_CODE_GRAPH_DB_DIR` is allowed for tests and disposable CI runs only. Tests typically use temporary directories via `mkdtempSync` and pass `dbDir` as a function parameter rather than relying on the environment variable.

The launcher enforces a standalone-storage guard so the override path must resolve inside the workspace root. External absolute paths are rejected. Production and operator docs should treat `.opencode/skills/system-code-graph/mcp_server/database/` as the default. A runtime override must not silently re-collocate the database with `system-spec-kit/mcp_server/database/`.

---

## 5. MIGRATION NOTES

The code graph database has moved three times:

1. **Pre-extraction → skill-local (packet 013).** `system-spec-kit/mcp_server/database/` → `system-code-graph/mcp_server/database/`. Established skill-local DB ownership per ADR-002.
2. **Skill-local → shared spec-kit data dir (packet 019/020 + cross-runtime consolidation).** `system-code-graph/mcp_server/database/` → `.opencode/.spec-kit/code-graph/database/`. The launcher auto-migrates legacy installs on first startup: the SQLite triplet, readiness marker, and launcher state file are **copied** (not moved) so the prior location is preserved as a backup. Configs that still reference the `system_code_graph` MCP server name should be renamed to `mk_code_index`.
3. **Shared spec-kit data dir → skill-local (2026-05-29 reversal).** `.opencode/.spec-kit/code-graph/database/` → `system-code-graph/mcp_server/database/`. The cross-runtime-sharing rationale for the shared location was incorrect — every runtime already shares the skill via the `.opencode/skills` symlink, so skill-local is itself a single shared instance. The launcher auto-migrates the former shared location back (copy, not move). Reverses ADR-002/004/005.

Cross-skill consumers reach the data through two paths: in-process imports from `system-spec-kit` handlers and hooks, and the standalone MCP namespace used by agents and commands. SessionStart hooks remain under `system-spec-kit/mcp_server/hooks/` due to 110-plus file references. This asymmetry is intentional and any future move is planned as a separate packet with build and config redesign scope.
