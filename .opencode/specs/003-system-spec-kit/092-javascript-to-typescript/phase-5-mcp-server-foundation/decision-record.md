# Decision Record: Phase 4 - Convert mcp_server/ Foundation Layers

> **Parent Spec:** 092-javascript-to-typescript/
> **Workstream:** W-D
> **Session:** 2

---

## Overview

Phase 4 has no new architectural decisions. All relevant decisions were made in earlier phases of the JavaScript to TypeScript migration.

This document references the decisions from the parent spec that apply to Phase 4 implementation.

---

## Applicable Decisions from Parent Spec

The following architectural decisions from `../decision-record.md` govern Phase 4 implementation:

### D1: CommonJS Output (not ESM)

**Status:** Decided (Phase 1)

**Impact on Phase 4:**
- All converted `.ts` files use ES module syntax in source (`import`/`export`)
- TypeScript compiler outputs CommonJS (via `module: "commonjs"` in tsconfig)
- Preserves `__dirname` usage across all foundation modules
- No changes needed to `path.join(__dirname, ...)` patterns

**Rationale:** Avoids rewriting 50+ `__dirname` references across foundation layers.

---

### D2: In-Place Compilation (no dist/ folder)

**Status:** Decided (Phase 1)

**Impact on Phase 4:**
- Compiled `.js` files output to same directory as `.ts` source
- All relative path references in foundation modules remain valid
- No updates needed to import paths for:
  - `lib/utils/` → `lib/errors/` imports
  - `lib/config/` → `lib/scoring/` imports
  - Re-export stubs maintain exact same paths

**Rationale:** Preserves 100+ relative import paths in foundation layers unchanged.

---

### D3: Strict Mode from Start

**Status:** Decided (Phase 1)

**Impact on Phase 4:**
- All foundation layer conversions use `strict: true` from day one
- No gradual strictness ramp-up (avoids technical debt)
- Catch type errors immediately during Phase 4 conversion
- Forces explicit typing of:
  - All function parameters
  - Public API return types
  - Generic constraints

**Rationale:** 34 foundation files are manageable under strict mode; better to fix all type issues upfront.

---

### D7: Central shared/types.ts for Cross-Workspace Types

**Status:** Decided (Phase 3)

**Impact on Phase 4:**
- `lib/interfaces/embedding-provider.ts` imports `IEmbeddingProvider` from `shared/types.ts`
- `lib/interfaces/vector-store.ts` imports `IVectorStore` from `shared/types.ts`
- No duplicate interface definitions in mcp_server/
- Foundation layers use shared types for cross-cutting concerns

**Rationale:** Single source of truth for interfaces used by both shared/ and mcp_server/.

---

## Implementation Choices (Not Formal ADRs)

The following are implementation details specific to Phase 4, not formal architectural decisions:

### Bottom-Up Conversion Strategy

**Choice:** Convert foundation layers (4a–4l) before upper layers (Phase 5).

**Why:** Avoids cascading type errors. Each layer compiles independently before dependent layers are converted.

**Not a Decision:** This is an execution strategy, not an architectural choice. The alternative (top-down) would work but require more type stubs.

---

### Parallelization: Wave 1 + Wave 2

**Choice:**
- Wave 1 (4a–4h, 4l): Parallel — no inter-dependencies within Phase 4
- Wave 2 (4i–4k): Sequential after Wave 1 — depend on 4a, 4b

**Why:** Maximizes agent utilization (7 agents in parallel for Wave 1).

**Not a Decision:** Execution optimization, not a design decision. Could be done fully sequential if fewer agents available.

---

### Re-Export Stubs for Moved Files

**Choice:** Keep re-export stubs at original locations for files moved to shared/ in Phase 2:
- `lib/utils/retry.ts` → re-exports `shared/utils/retry`
- `lib/utils/path-security.ts` → re-exports `shared/utils/path-security`
- `lib/scoring/folder-scoring.ts` → re-exports `shared/scoring/folder-scoring`
- `lib/parsing/trigger-extractor.ts` → re-exports `shared/trigger-extractor`

**Why:** Backward compatibility for existing import paths in downstream modules (Phase 5 upper layers).

**Not a Decision:** This was decided in Phase 2 (circular dependency resolution). Phase 4 just converts the stubs from `.js` to `.ts`.

---

## Decision Status Summary

| Decision | Phase | Status | Applies to Phase 4? |
|----------|-------|--------|---------------------|
| D1: CommonJS output | 1 | Decided | ✅ Yes |
| D2: In-place compilation | 1 | Decided | ✅ Yes |
| D3: Strict mode | 1 | Decided | ✅ Yes |
| D4: Move files to break circular deps | 2 | Decided | ✅ Yes (re-export stubs) |
| D5: Keep `I` prefix on existing interfaces | 3 | Decided | ✅ Yes (IEmbeddingProvider, IVectorStore) |
| D6: Phase 0 standards first | 0 | Decided | ✅ Yes (follow established conventions) |
| D7: Central shared/types.ts | 3 | Decided | ✅ Yes (import from shared/) |
| D8: Convert tests last (Phase 7) | 0 | Decided | ⚠️ N/A (tests not in Phase 4 scope) |

---

## No New Decisions Required

Phase 4 implementation is fully guided by existing architectural decisions. No new design choices requiring formal ADR process.

All implementation details (conversion order, parallelization, re-export handling) are tactical execution choices, not strategic architectural decisions.

---

## Cross-References

- **Parent Decision Record:** `../decision-record.md` (D1–D8)
- **Phase 4 Plan:** `plan.md`
- **Phase 4 Tasks:** `tasks.md`
- **Phase 4 Checklist:** `checklist.md`
