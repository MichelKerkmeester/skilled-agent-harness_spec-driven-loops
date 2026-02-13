# Decision Record: JavaScript to TypeScript Migration

> **Spec Folder:** `specs/003-memory-and-spec-kit/092-javascript-to-typescript/`
> **Created:** 2026-02-07

---

## D1: Module Output Format — CommonJS

**Status:** Decided
**Date:** 2026-02-07

**Context:** The codebase uses `__dirname` in 50+ files for path resolution. ESM requires `import.meta.url` + `fileURLToPath()` instead.

**Decision:** Use CommonJS output (`"module": "commonjs"` in tsconfig).

**Rationale:**
- `__dirname` works natively with CommonJS — zero changes to path logic
- `opencode.json` starts server via `node context-server.js` — works unchanged
- All `require()` calls in compiled output are functionally identical
- MCP SDK supports both ESM and CJS

**Alternatives rejected:**
- ESM output: Would require rewriting `__dirname` → `import.meta.url` in 50+ files, `path.dirname(fileURLToPath(import.meta.url))` everywhere — high risk for no functional benefit

---

## D2: Compilation Strategy — In-Place

**Status:** Decided
**Date:** 2026-02-07

**Context:** Should compiled `.js` live next to `.ts` source, or in a separate `dist/` directory?

**Decision:** In-place compilation (`.ts` → `.js` in same directory, `outDir: "."`).

**Rationale:**
- All `require('./module')` paths stay valid — no path rewriting needed
- `opencode.json` startup command unchanged
- `config.js` path constants (`path.join(__dirname, '...')`) all work
- Simpler mental model — file is where you expect it

**Alternatives rejected:**
- Separate `dist/` folder: Would require updating `opencode.json`, all `path.join(__dirname)` references, `package.json` `main` fields, and all documentation. ~100 path references would need changing.

**Trade-offs accepted:**
- Source and compiled output coexist in same directory (slightly messier)
- `.gitignore` must handle compiled artifacts carefully

---

## D3: Strict Mode — Enabled from Start

**Status:** Decided
**Date:** 2026-02-07

**Context:** TypeScript's `strict` flag enables 7 compiler checks. Should we start strict or ease in?

**Decision:** `"strict": true` from Phase 1.

**Rationale:**
- Catches `null`/`undefined` errors at compile time (these are the most common runtime bugs)
- Prevents accumulating type-unsafe code that's harder to fix later
- The codebase already uses disciplined patterns (guard clauses, explicit checks)

**Alternatives rejected:**
- Incremental strictness: History shows projects rarely reach full strict if they don't start there

---

## D4: Circular Dependency Resolution — File Moves

**Status:** Decided
**Date:** 2026-02-07

**Context:** `shared/` imports `retry.js` and `path-security.js` from `mcp_server/`, while `mcp_server/` imports from `shared/`. TypeScript project references require a DAG (no cycles).

**Decision:** Move 3 files from `mcp_server/` to `shared/`:
1. `retry.js` → `shared/utils/retry.ts`
2. `path-security.js` → `shared/utils/path-security.ts`
3. `folder-scoring.js` → `shared/scoring/folder-scoring.ts`

Leave re-export stubs at original locations.

**Rationale:**
- All 3 files are self-contained (no internal `mcp_server/` dependencies)
- `retry.js` is a generic utility — belongs in shared by nature
- `path-security.js` is security infrastructure — shared across all modules
- `folder-scoring.js` is used by `scripts/memory/rank-memories.js` — putting it in shared removes the `scripts/` → `mcp_server/` cross-workspace dependency

**Alternatives rejected:**
- Single tsconfig (no project references): Loses incremental compilation, slower builds, no workspace isolation
- Extract to separate npm package: Over-engineering for an internal monorepo

---

## D5: Interface Naming — Keep `I` Prefix on Existing

**Status:** Decided
**Date:** 2026-02-07

**Context:** The codebase has `IEmbeddingProvider` and `IVectorStore` with `I` prefix. Modern TypeScript convention omits the prefix.

**Decision:** Keep `I` prefix on these two existing interfaces. New interfaces omit it.

**Rationale:**
- These names are used across 10+ import sites and re-export aliases
- Renaming would be a separate scope item with its own risk
- Documenting the exception prevents confusion

**Alternatives rejected:**
- Remove prefix globally: Would change import names across the codebase — separate concern from JS→TS migration

---

## D6: Standards Before Migration

**Status:** Decided
**Date:** 2026-02-07

**Context:** Should we establish TypeScript conventions first, or let them emerge during migration?

**Decision:** Phase 0 creates full TypeScript standards in `workflows-code--opencode` before any code conversion.

**Rationale:**
- Up to 10 agents may work in parallel — without documented standards, each makes different choices
- Interface naming, import ordering, type annotation style must be consistent
- The skill's "TypeScript not used" exclusion must be removed to avoid confusion

---

## D7: Central Types File

**Status:** Decided
**Date:** 2026-02-07

**Context:** Where should shared type definitions live?

**Decision:** Create `shared/types.ts` as the single source of truth for cross-workspace types.

**Rationale:**
- `IEmbeddingProvider`, `IVectorStore`, `SearchResult`, `MemoryRecord` are used across all 3 modules
- Centralizing prevents duplication and drift
- TypeScript project references ensure type-only imports don't create runtime dependencies

---

## D8: Test Conversion Last

**Status:** Decided
**Date:** 2026-02-07

**Context:** Should tests be converted alongside their source modules, or in a dedicated phase?

**Decision:** Convert all 59 test files in Phase 7, after all source is converted.

**Rationale:**
- Tests can run as `.js` against compiled `.ts` output — no functionality risk during migration
- Deferring tests reduces complexity during source conversion phases
- All 5 test batches can be parallelized (no inter-test dependencies)

**Trade-offs accepted:**
- Tests temporarily lack type safety (acceptable: they're verification code, not production)
- Slightly longer migration timeline before "100% TypeScript" claim
