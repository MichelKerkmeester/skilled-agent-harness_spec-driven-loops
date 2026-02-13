# Decision Record: Phase 3 — Convert shared/ Foundation Layer

> **Parent Spec:** 092-javascript-to-typescript/
> **Workstream:** W-C
> **Session:** 2

---

## D5: Interface Naming — Keep `I` Prefix on Existing

**Status:** Decided
**Date:** 2026-02-07
**Applies to:** Phase 3 shared/ conversion

**Context:** The codebase has `IEmbeddingProvider` and `IVectorStore` with `I` prefix. Modern TypeScript convention omits the prefix.

**Decision:** Keep `I` prefix on these two existing interfaces. New interfaces omit it.

**Rationale:**
- These names are used across 10+ import sites and re-export aliases
- Renaming would be a separate scope item with its own risk
- Documenting the exception prevents confusion
- Phase 3 creates `shared/types.ts` with these interfaces as-is

**Alternatives rejected:**
- Remove prefix globally: Would change import names across the codebase — separate concern from JS→TS migration

**Implementation notes:**
- `shared/types.ts` defines:
  - `export interface IEmbeddingProvider { ... }` (Keep I prefix)
  - `export interface IVectorStore { ... }` (Keep I prefix)
- New interfaces (e.g., `SearchResult`, `MemoryRecord`, `SearchOptions`) omit the `I` prefix

---

## D7: Central Types File

**Status:** Decided
**Date:** 2026-02-07
**Applies to:** Phase 3 shared/ conversion

**Context:** Where should shared type definitions live?

**Decision:** Create `shared/types.ts` as the single source of truth for cross-workspace types.

**Rationale:**
- `IEmbeddingProvider`, `IVectorStore`, `SearchResult`, `MemoryRecord` are used across all 3 modules
- Centralizing prevents duplication and drift
- TypeScript project references ensure type-only imports don't create runtime dependencies
- Conversion order: Create `shared/types.ts` FIRST (T030), then all other shared files import from it

**Implementation:**

```typescript
// shared/types.ts

// Provider Interfaces (Keep I prefix per D5)
export interface IEmbeddingProvider { ... }
export interface IVectorStore { ... }

// Core Data Types (No I prefix)
export interface EmbeddingProfile { ... }
export interface SearchResult { ... }
export interface MemoryRecord { ... }
export interface SearchOptions { ... }
export interface StoreStats { ... }

// Utility Types
export interface RetryConfig { ... }
export type ErrorClassification = 'transient' | 'permanent';
export type BackoffSequence = readonly number[];

// Scoring Types
export interface FolderScore { ... }
export type RankingMode = 'composite' | 'recency' | 'importance' | 'volume';
export interface ArchivePattern { ... }

// Trigger Extraction Types
export interface TriggerConfig { ... }
export interface TriggerPhrase { ... }
export interface ExtractionStats { ... }
```

**Files that import from `shared/types.ts`:**
- `shared/utils/retry.ts` → imports `RetryConfig`, `ErrorClassification`
- `shared/scoring/folder-scoring.ts` → imports `FolderScore`, `RankingMode`, `MemoryRecord`
- `shared/embeddings/profile.ts` → imports `EmbeddingProfile`
- `shared/embeddings/providers/*.ts` → imports `IEmbeddingProvider`, `EmbeddingProfile`
- `shared/embeddings/factory.ts` → imports `IEmbeddingProvider`, `EmbeddingProfile`
- `shared/embeddings.ts` → imports `IEmbeddingProvider`, `SearchResult`, etc.
- `shared/trigger-extractor.ts` → imports `TriggerConfig`, `TriggerPhrase`, `ExtractionStats`

**Alternatives rejected:**
- Types defined per-module: Risk of duplication and drift
- Types in barrel index files: Harder to track canonical definitions

---

## D7.1: Export Alias Preservation Strategy

**Status:** Decided
**Date:** 2026-02-07
**Applies to:** Phase 3 shared/ conversion

**Context:** `shared/embeddings.ts` and `shared/trigger-extractor.ts` export backward-compatible snake_case aliases for all functions.

**Decision:** Preserve ALL snake_case export aliases during TypeScript conversion.

**Rationale:**
- Existing consumers may use either naming style
- Removing aliases would break backward compatibility
- TypeScript allows dual exports (modern + legacy)

**Implementation pattern:**

```typescript
// Modern camelCase export
export async function embedText(text: string): Promise<number[]> {
  // implementation
}

// Backward-compatible snake_case alias
export const embed_text = embedText;
```

**Verification:**
- CHK-070: `shared/embeddings.ts` — all 25+ exports preserved (camelCase + snake_case)
- CHK-071: `shared/trigger-extractor.ts` — all exports preserved (camelCase + snake_case)

---

## D7.2: In-Place Compilation for shared/

**Status:** Decided (inherited from D2)
**Date:** 2026-02-07
**Applies to:** Phase 3 shared/ conversion

**Context:** Should compiled `.js` live next to `.ts` source, or in a separate `dist/` directory?

**Decision:** In-place compilation (`.ts` → `.js` in same directory, `outDir: "."`).

**Rationale:**
- All `require('./module')` paths in mcp_server and scripts stay valid
- No path rewriting needed in downstream consumers
- `shared/tsconfig.json` sets `"outDir": "."` to compile in-place

**Implementation:**
```jsonc
// shared/tsconfig.json
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "composite": true,
    "rootDir": ".",
    "outDir": "."  // In-place compilation
  },
  "include": ["**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

## D7.3: Strict Mode from Phase 3 Start

**Status:** Decided (inherited from D3)
**Date:** 2026-02-07
**Applies to:** Phase 3 shared/ conversion

**Context:** TypeScript's `strict` flag enables 7 compiler checks. Should we start strict or ease in?

**Decision:** `"strict": true` from Phase 1 applies to all Phase 3 conversions.

**Rationale:**
- Catches `null`/`undefined` errors at compile time
- Prevents accumulating type-unsafe code
- Phase 3 files must pass strict checks before claiming completion

**Verification:**
- CHK-078: No implicit `any` types
- CHK-079: Strict null checks pass
- CHK-080: All function parameters have explicit types

---

## Cross-References

- **Parent Decision Record**: `../decision-record.md`
- **D1**: Module Output Format (CommonJS) — affects compiled output
- **D2**: Compilation Strategy (In-Place) — `outDir: "."`
- **D3**: Strict Mode — applies to Phase 3
- **D5**: Interface Naming — `I` prefix preserved
- **D7**: Central Types File — `shared/types.ts` created
