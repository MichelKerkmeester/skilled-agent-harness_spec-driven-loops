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
| `config.ts` | Exports the package-relative path anchors and the input-limit constants. |

---

## 3. BOUNDARIES

| Boundary | Rule |
|---|---|
| Paths | Path anchors are derived from the module's own location; nothing here resolves a database directory since the memory database left. |

---

## 4. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `SERVER_DIR`, `NODE_MODULES`, `LIB_DIR`, `SHARED_DIR` | Constants | Package-relative path anchors. |
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
