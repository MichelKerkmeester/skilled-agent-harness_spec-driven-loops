---
title: "Core Modules: Runtime Path and Limits Configuration"
description: "Runtime path constants, database path resolution, and input-validation limits shared across the runtime package."
trigger_phrases:
  - "core modules"
  - "resolve database paths"
  - "input limits"
---

# Core Modules: Runtime Path and Limits Configuration

---

## 1. OVERVIEW

`core/` is the shared runtime foundation for the package. Its single module, `config.ts`, exposes path constants, database path resolution with allowed-path boundary checks, batch-processing tuning, and input-validation limits that other layers import rather than recomputing.

Current responsibilities:

- Resolve database paths from runtime environment variables (`SPEC_KIT_DB_DIR`, `SPECKIT_DB_DIR`, `MEMORY_DB_PATH`) with a realpath-based boundary check against the project, home, and temp directories.
- Export server/lib/shared path constants (`SERVER_DIR`, `NODE_MODULES`, `LIB_DIR`, `SHARED_DIR`).
- Export batch-processing tuning (`BATCH_SIZE`, `BATCH_DELAY_MS`), the index-scan cooldown constant, and query/input length limits (`MAX_QUERY_LENGTH`, `INPUT_LIMITS`).
- Export the allowed base paths used by path-validation callers (`DEFAULT_BASE_PATH`, `ALLOWED_BASE_PATHS`).

---

## 2. KEY FILES

| File | Responsibility |
|---|---|
| `config.ts` | Resolves and boundary-checks database paths, and exports path, batch, and input-limit constants. |

---

## 3. BOUNDARIES

| Boundary | Rule |
|---|---|
| Paths | `computeDatabasePaths()` resolves symlinks (`realpathAllowMissing`) before checking containment inside the project cwd, home directory, or OS temp directory; a path outside all three throws. |
| Environment | `SPEC_KIT_DB_DIR` / `SPECKIT_DB_DIR` (directory override, wins) and `MEMORY_DB_PATH` (file override) are read on every `resolveDatabasePaths()` call, so a test can flip them after import. |
| Mutable exports | `DATABASE_DIR`, `DATABASE_PATH`, and `DB_UPDATED_FILE` are `let` bindings refreshed by `resolveDatabasePaths()`, not frozen constants. |

---

## 4. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `resolveDatabasePaths()` | Function | Re-derives and stores `DATABASE_DIR`, `DATABASE_PATH`, and `DB_UPDATED_FILE` from the current environment. |
| `SERVER_DIR`, `NODE_MODULES`, `LIB_DIR`, `SHARED_DIR` | Constants | Package-relative path anchors. |
| `BATCH_SIZE`, `BATCH_DELAY_MS` | Constants | Batch-processing tuning, overridable via `SPEC_KIT_BATCH_SIZE` / `SPEC_KIT_BATCH_DELAY_MS`. |
| `INDEX_SCAN_COOLDOWN` | Constant | Minimum interval, in milliseconds, between index scans. |
| `MAX_QUERY_LENGTH`, `INPUT_LIMITS` | Constants | Query and per-field length ceilings for input validation. |
| `DEFAULT_BASE_PATH`, `ALLOWED_BASE_PATHS` | Constants | Base path defaults and the resolved allowlist for path-scoped operations. |

---

## 5. VALIDATION

Run from `.opencode/skills/system-spec-kit/runtime`:

```bash
npx vitest run tests/unit-path-security.vitest.ts tests/production-db-isolation.vitest.ts tests/memory-roadmap-flags.vitest.ts
```

Expected result: path-boundary, production-isolation, and database-path-consuming suites pass.

---

## 6. RELATED

- [`../handlers/README.md`](../handlers/README.md)
- [`../lib/storage/README.md`](../lib/storage/README.md)
- [`../tests/README.md`](../tests/README.md)
