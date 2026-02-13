# Decision Record: Phase 2 — Break Circular Dependencies

> **Parent Spec:** 092-javascript-to-typescript/
> **Workstream:** W-B
> **Phase:** Phase 2 of 10
> **Created:** 2026-02-07

---

## D4: Circular Dependency Resolution — File Moves

**Status:** Decided
**Date:** 2026-02-07
**Phase:** Phase 2

**Context:**

`shared/` imports utilities from `mcp_server/`, while `mcp_server/` imports from `shared/` — creating a circular dependency. TypeScript project references require a DAG (Directed Acyclic Graph), so this cycle must be broken before TypeScript conversion can proceed.

Circular import chain:
```
shared/embeddings/providers/voyage.js
  → requires mcp_server/lib/utils/retry.js

shared/embeddings/providers/openai.js
  → requires mcp_server/lib/utils/retry.js

shared/utils.js (DEPRECATED)
  → requires mcp_server/lib/utils/path-security.js

mcp_server/lib/search/vector-index.js
  → requires shared/embeddings.js

mcp_server/handlers/memory-search.js
  → requires shared/trigger-extractor.js

scripts/memory/rank-memories.js
  → requires mcp_server/lib/scoring/folder-scoring.js
```

This creates two cycles:
1. **Direct cycle:** `shared/` ↔ `mcp_server/`
2. **Indirect cycle:** `scripts/` → `mcp_server/` → `shared/` → `mcp_server/`

**Decision:**

Move 3 self-contained files from `mcp_server/` to `shared/`:

1. **retry.js** → `shared/utils/retry.js`
2. **path-security.js** → `shared/utils/path-security.js`
3. **folder-scoring.js** → `shared/scoring/folder-scoring.js`

Create re-export stubs at original locations for backward compatibility during migration.

Delete deprecated `shared/utils.js` (was only re-exporting path-security).

**Rationale:**

**Why these 3 files:**
- All 3 are **self-contained** — no internal `mcp_server/` dependencies
- `retry.js` is a generic utility (HTTP retry, backoff sequences) — conceptually belongs in shared infrastructure
- `path-security.js` is security validation (path traversal prevention) — used across all layers
- `folder-scoring.js` is pure scoring logic (no database, no state) — only depends on Node built-ins

**Why move to shared/ (not extract to separate package):**
- Shared/ is already the "foundation layer" for cross-workspace utilities
- Moving files is lower risk than creating new npm packages in a monorepo
- TypeScript project references naturally model `shared` as the base layer

**Why re-export stubs:**
- Minimizes blast radius — only 5 files touched in this phase
- Allows gradual import path updates in later phases
- Tests continue working without changes (proof: migration doesn't break functionality)

**Result dependency graph (DAG):**
```
shared/               (leaf — no outgoing deps to other workspaces)
  ↑
mcp_server/          (imports from shared/)
  ↑
scripts/             (imports from shared/ and mcp_server/)
```

**Alternatives Considered:**

1. **Single tsconfig (no project references)**
   - **Rejected:** Loses incremental compilation, slower builds, no workspace isolation
   - Would allow circular deps but at the cost of build performance and maintainability

2. **Extract to separate npm package**
   - **Rejected:** Over-engineering for 3 utility files in an internal monorepo
   - Adds package.json management, version coordination, separate CI
   - Doesn't solve the conceptual issue (utilities should be in shared/)

3. **Duplicate code in both locations**
   - **Rejected:** DRY violation, maintenance burden, drift risk
   - Would require syncing changes across 2 codebases

4. **Lazy-load with dynamic imports**
   - **Rejected:** Runtime complexity, doesn't solve compile-time circular ref issue
   - TypeScript project references are compile-time, not runtime

5. **Refactor to remove dependencies**
   - **Rejected:** Would require rewriting embedding provider error handling
   - Much higher scope than file moves

**Trade-offs Accepted:**

- Re-export stubs add indirection (minor: resolved in TypeScript phase via `export *`)
- `shared/scoring/` directory created (was flat before)
- Conceptual shift: `folder-scoring` is now "shared infrastructure" not "MCP-specific" (acceptable: it's pure logic)

**Validation:**

- All 59 existing tests pass after file moves (100% pass rate)
- `tsc --build` (after Phase 1 tsconfig) resolves workspace references without circular errors
- No remaining `shared/` → `mcp_server/` imports (verified via grep)

**Impact:**

- **Phase 1 (Infrastructure):** Enables TypeScript project references to work
- **Phase 3 (shared/ conversion):** Can now convert `shared/` in isolation
- **Phase 4+ (mcp_server/, scripts/):** Can reference compiled `shared/` types

**Sign-off:**

This decision is foundational — without breaking circular deps, TypeScript project references cannot be used, and the migration cannot proceed in a modular fashion.

---

## Cross-References

- **Master Decision Record:** See `../decision-record.md` (D4)
- **Plan:** See `plan.md` (dependency graph diagrams)
- **Tasks:** See `tasks.md` (T020-T027)
- **Checklist:** See `checklist.md` (CHK-050–CHK-059)
