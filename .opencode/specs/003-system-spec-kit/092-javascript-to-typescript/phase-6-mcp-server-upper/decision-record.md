# Decision Record: Phase 5 — mcp_server/ Upper Layers TypeScript Conversion

> **Parent Spec:** 092-javascript-to-typescript/

---

## Decision Inheritance

Phase 5 inherits all architectural decisions from the parent spec:

**From `092-javascript-to-typescript/decision-record.md`:**
- **D1**: CommonJS output (not ESM)
- **D2**: In-place compilation (no `dist/`)
- **D3**: `strict: true` from start
- **D4**: Move files to break circular deps
- **D5**: Keep `I` prefix on existing interfaces
- **D6**: Phase 0 standards first
- **D7**: Central `shared/types.ts`

**No new formal ADRs for Phase 5.** All major architectural choices were made in Phases 0–2.

---

## Implementation Approach Choices

While no new ADRs are required, Phase 5 involves several implementation approach choices that are worth documenting:

### 1. Handler Typing Strategy

**Choice:** Define TypeScript interfaces for each handler's input/output schemas that mirror the JSON schema structure.

**Rationale:**
- MCP tool schemas are already defined in JSON
- TypeScript interfaces provide compile-time validation
- Type narrowing from `unknown` input to typed handler arguments improves safety

**Alternative considered:** Use Zod or similar runtime validation library.
- **Rejected:** Adds runtime overhead, increases bundle size, introduces new dependency
- **Trade-off:** Manual type definitions require keeping TypeScript types synchronized with JSON schemas

**Example pattern:**
```typescript
interface MemorySearchInput {
  query: string;
  limit?: number;
  threshold?: number;
  anchors?: string[];
}

interface MemorySearchOutput {
  memories: SearchResult[];
  summary: string;
  truncated: boolean;
}
```

---

### 2. MCP SDK Integration Approach

**Choice:** Use `@modelcontextprotocol/sdk` types where available, fallback to `unknown` + type narrowing where SDK types are incomplete.

**Rationale:**
- MCP SDK is still evolving (not 1.0)
- Some internal types may not be exported
- Explicit `unknown` + narrowing is safer than `any`

**Alternative considered:** Fork MCP SDK and add missing type exports.
- **Rejected:** Creates maintenance burden, diverges from upstream
- **Trade-off:** Some internal MCP structures remain untyped

**Pattern:**
```typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import type { CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';

// SDK types used where available
const server = new Server(
  { name: 'context-server', version: '1.7.2' },
  { capabilities: { tools: {} } }
);

// Fallback to unknown + narrowing where SDK types incomplete
function isValidToolRequest(req: unknown): req is CallToolRequestSchema {
  return typeof req === 'object' && req !== null && 'method' in req;
}
```

---

### 3. Generic Types for Cache Entries

**Choice:** Use TypeScript generics for `CacheEntry<T>` to support multiple value types.

**Rationale:**
- Tool cache stores heterogeneous data (search results, config objects, etc.)
- Generic provides type safety without separate cache classes per type
- Enables type inference at call sites

**Alternative considered:** Store all cache values as `unknown`.
- **Rejected:** Loses type safety, requires type assertions at every cache read
- **Trade-off:** Slightly more complex type signatures

**Pattern:**
```typescript
interface CacheEntry<T> {
  key: string;
  value: T;
  expiresAt: number;
  size: number;
  lastAccessed: number;
}

class ToolCache {
  private cache = new Map<string, CacheEntry<unknown>>();

  set<T>(key: string, value: T, ttl: number): void {
    this.cache.set(key, {
      key,
      value,
      expiresAt: Date.now() + ttl,
      size: JSON.stringify(value).length,
      lastAccessed: Date.now()
    });
  }

  get<T>(key: string): T | undefined {
    const entry = this.cache.get(key);
    if (!entry || entry.expiresAt < Date.now()) return undefined;
    return entry.value as T;
  }
}
```

---

### 4. SQLite Query Result Typing

**Choice:** Define TypeScript interfaces for all SQLite query results based on schema structure.

**Rationale:**
- `better-sqlite3` returns `any` by default
- Explicit result types catch schema changes at compile time
- Enables autocomplete in handler code

**Alternative considered:** Use `better-sqlite3` with generic return type `Database.RunResult`.
- **Rejected:** Loses column-level type information
- **Trade-off:** Manual type definitions for each query shape

**Pattern:**
```typescript
interface MemoryRow {
  id: string;
  title: string;
  content: string;
  importance: number;
  tier: string;
  created_at: number;
  updated_at: number;
}

const stmt = db.prepare<unknown[], MemoryRow>(
  'SELECT * FROM memories WHERE id = ?'
);
const row: MemoryRow | undefined = stmt.get(memoryId);
```

---

### 5. Barrel Export Organization

**Choice:** Organize barrel exports in `lib/index.ts` by functional area with clear section comments.

**Rationale:**
- 42 files across 12 sub-layers — flat export list is hard to navigate
- Grouped exports match mental model of system architecture
- Section comments serve as mini table-of-contents

**Alternative considered:** Flat alphabetical export list.
- **Rejected:** Loses architectural context, harder to find related functions
- **Trade-off:** Slightly longer file, but much more maintainable

**Pattern:**
```typescript
// === Embeddings ===
export * from './lib/embeddings/provider-chain.js';

// === Cognitive ===
export * from './lib/cognitive/fsrs-scheduler.js';
export * from './lib/cognitive/tier-classifier.js';
export * from './lib/cognitive/consolidation.js';

// === Search ===
export * from './lib/search/vector-index.js';
export * from './lib/search/hybrid-search.js';

// === Storage ===
export * from './lib/storage/causal-edges.js';
export * from './lib/storage/checkpoints.js';

// === Handlers ===
export * from './handlers/memory-search.js';
export * from './handlers/memory-save.js';
```

---

## Risk Register (Phase 5 Specific)

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| `vector-index.ts` (3,309 lines) typing takes >4h | Medium | High | Break into incremental sessions, prioritize query result types first |
| MCP SDK types change between versions | Low | Medium | Pin SDK version, document type fallback patterns |
| Handler input validation diverges from schemas | Medium | Medium | Add integration tests that validate against actual JSON schemas |
| SQLite schema migration breaks typed queries | Low | High | Type all migrations first, verify queries compile against each schema version |

---

## Cross-References

- **Parent Spec:** `092-javascript-to-typescript/spec.md`
- **Parent Decisions:** `092-javascript-to-typescript/decision-record.md` (D1–D7)
- **Plan:** See `plan.md`
- **Tasks:** See `tasks.md`
- **Checklist:** See `checklist.md`
