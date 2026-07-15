# Iteration 014 — SECURITY (adversarial threat-model pass)

## P0 Findings
(none this iter)

## P1 Findings
(none this iter)

## P2 Findings
(none this iter)

## Analysis Summary

### SQL Injection (schema.ts, reindex.ts)
- **schema.ts**: All prepared statements use proper parameterization with `?` placeholders (lines 60, 105, 117). The only dynamic SQL construction is table name `${tableName}` in `ensureVecTableForDim` (line 76), but `tableName` is derived from `vecTableNameForDim` which validates that `dim` is a positive integer before constructing `vec_${dim}`. No user input influences table names.
- **reindex.ts**: All 9 `prepare()` calls use parameterized queries with `?` placeholders (lines 145, 156, 176, 193, 198, 223, 328, 333, 373). Line 224 uses `${tableName}` but follows the same validation pattern as schema.ts via `tableNameForDim`. Line 176 uses dynamic SQL construction for optional fields but uses parameterized `@status`, `@updatedAt`, `@processed`, `@error` bindings. No SQLi vectors found.

### Path Traversal (registry.ts)
- **registry.ts**: The `modelPath` field in manifests (line 34) is a hardcoded string `'unsloth-embeddinggemma-300m-GGUF/embeddinggemma-300m-Q8_0.gguf'`, not user input. The `getManifest()` function performs a simple array lookup on the frozen `MANIFESTS` array (line 144). No filesystem operations, no `path.join`, no `fs.*` usage in the embedders module. No path traversal risk.

### Privilege Escalation (reindex.ts)
- **reindex.ts**: Jobs operate within a well-scoped DB transaction context. They can only modify:
  - `vec_*` tables (vector storage for specific dimensions)
  - `embedder_jobs` table (job metadata)
- Jobs cannot access other tables or filesystem resources. The `runningJobs` Set (line 88) is module-level state used to prevent duplicate job execution (lines 242-249) — this is a safety mechanism, not a vulnerability. No privilege escalation path found.

### MCP Boundary Leakage (handlers/*.ts)
- **handlers/index.ts**: Module-level lazy-loading promises (lines 86-105) are used for dynamic import caching. These are module-level caches, not request-scoped state. No data leakage between handlers.
- **handlers/embedder-*.ts**: The embedder handlers (embedder-set.ts, embedder-list.ts, embedder-status.ts) use singleton DB connection via `get_db()` and have no shared mutable state between requests.
- **memory-save.ts, memory-bulk-delete.ts**: The `warnedEntityDensityInvalidationFailure` flags (lines 178 and 27 respectively) are boolean flags to prevent duplicate warning logs — benign, no data leakage.

### Trust Boundaries Examined
1. **DB writes (schema.ts)**: Prepared statement parametrization verified — safe
2. **Manifest resolution (registry.ts)**: Static array lookup, no filesystem access — safe
3. **Job orchestration (reindex.ts)**: Scoped to specific tables, no privilege escalation — safe
4. **MCP boundary (handlers/*.ts)**: No shared request state, no data leakage — safe

## Conclusion
No security vulnerabilities found in this adversarial threat-model pass. The embedder subsystem follows secure coding practices with proper input validation, parameterized queries, and scoped job execution.
