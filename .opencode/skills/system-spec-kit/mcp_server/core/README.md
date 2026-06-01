---
title: "Core Modules: Runtime Config and Database State"
description: "Runtime configuration, path guards, database-state coordination, and shared rebind hooks for the MCP server."
trigger_phrases:
  - "core modules"
  - "db state"
  - "resolve database paths"
---

# Core Modules: Runtime Config and Database State

---

## 1. OVERVIEW

`core/` is the shared runtime foundation for MCP server modules. It exposes configuration constants, database path resolution, input limits, scan cooldown settings, and database dependency rebinding.

Current responsibilities:

- Resolve database paths from runtime environment variables with allowed-path checks.
- Export server path constants, batch settings, input limits, and cache timing values.
- Initialize and rebind database-backed consumers when the vector index connection changes.
- Coordinate the index-scan lease lifecycle (acquire, refresh, complete) and persist last-scan timing.
- Track constitutional cache state.

---

## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────────╮
│                         CORE MODULES                             │
╰──────────────────────────────────────────────────────────────────╯

┌────────────────┐      ┌────────────────┐      ┌────────────────────┐
│ Environment    │ ───▶ │ config.ts      │ ───▶ │ Public constants   │
└────────────────┘      └───────┬────────┘      └────────────────────┘
                                │
                                ▼
                       ┌────────────────┐      ┌────────────────────┐
                       │ db-state.ts    │ ───▶ │ DB consumers       │
                       └───────┬────────┘      └────────────────────┘
                               │
                               ▼
                       ┌────────────────┐
                       │ index.ts       │
                       └────────────────┘

Dependency direction: callers ───▶ core/index.ts ───▶ config.ts and db-state.ts
```

---

## 3. DIRECTORY TREE

```text
core/
+-- config.ts    # Runtime paths, input limits, batch settings, and cognitive config bridge
+-- db-state.ts  # Database dependency state, rebind listeners, scan timing, and cache state
+-- index.ts     # Public core exports
`-- README.md
```

---

## 4. KEY FILES

| File | Responsibility |
|---|---|
| `config.ts` | Resolves database paths, validates allowed filesystem boundaries, and exports runtime constants. |
| `db-state.ts` | Coordinates vector index initialization, database consumer rebinding, the index-scan lease lifecycle, persistent scan timing, and constitutional cache access. |
| `index.ts` | Re-exports the public core surface for server modules. |

---

## 5. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Paths | Database directories must resolve inside the project, home, or temporary directory boundaries. |
| Environment | `SPEC_KIT_DB_DIR`, `SPECKIT_DB_DIR`, and `MEMORY_DB_PATH` are read during path resolution. |
| Rebinding | DB-backed consumers are initialized through `db-state.ts` rather than direct cross-module mutation. |
| Public API | Callers should import from `core/index.ts` unless they need a file-local test seam. |

Main flow:

```text
╭──────────────────────────────────────────╮
│ MCP server startup or DB reconnect       │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ resolveDatabasePaths()                   │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ init() stores DB-backed dependencies     │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ reinitializeDatabase() or listener event │
└──────────────────────────────────────────┘
                  │
                  ▼
╭──────────────────────────────────────────╮
│ Consumers receive current DB handle      │
╰──────────────────────────────────────────╯
```

---

## 6. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `resolveDatabasePaths()` | Function | Computes and stores database directory, database file, and update-marker paths. |
| `init()` | Function | Registers DB-backed dependencies for current and future rebinds. |
| `checkDatabaseUpdated()` | Function | Detects external database update markers. |
| `reinitializeDatabase()` | Function | Reopens the vector index and rebinds DB consumers. |
| `registerDatabaseRebindListener()` | Function | Lets modules react after the shared DB handle changes. |
| `acquireIndexScanLease()` | Function | Acquires the single-writer index-scan lease, honoring cooldown and stale-lease expiry. |
| `completeIndexScanLease()` | Function | Releases the scan lease and records the last-scan time. |

---

## 7. VALIDATION

Run from `.opencode/skills/system-spec-kit/mcp_server`.

```bash
npx vitest run tests/unit-path-security.vitest.ts tests/symlink-realpath-hardening.vitest.ts tests/handler-memory-index.vitest.ts
```

Expected result: path security, symlink hardening, and database rebind paths pass.

---

## 8. RELATED

- [`../database/README.md`](../database/README.md)
- [`../handlers/README.md`](../handlers/README.md)
- [`../configs/README.md`](../configs/README.md)
- [`../tests/README.md`](../tests/README.md)
