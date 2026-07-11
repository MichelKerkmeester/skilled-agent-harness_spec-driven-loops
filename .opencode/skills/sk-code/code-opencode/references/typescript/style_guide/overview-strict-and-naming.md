---
title: TypeScript Style Guide
description: Formatting standards and naming conventions for TypeScript files in the OpenCode development environment.
trigger_phrases:
  - "opencode typescript style guide"
  - "typescript file header format"
  - "typescript formatting standards"
  - "typescript strict mode style"
importance_tier: normal
contextType: implementation
version: 1.0.0.17
---

# TypeScript Style Guide

Formatting standards and naming conventions for TypeScript files in the OpenCode development environment.

---

## 1. OVERVIEW

### Purpose

Defines consistent styling rules for TypeScript files to ensure readability, maintainability, and alignment across all OpenCode TypeScript code.

### When to Use

- Writing new TypeScript files
- Reviewing TypeScript code for consistency
- Resolving style disagreements in code review

---

## 2. FILE HEADER FORMAT

All TypeScript files MUST begin with a module header block identifying the module.

### Template

```typescript
// ───────────────────────────────────────────────────────────────────
// MODULE: [Module Name]
// ───────────────────────────────────────────────────────────────────
```

### Requirements

- Box width: 67 characters total (box-drawing line)
- Module name: Left-aligned within header block
- No `'use strict'` directive required (TypeScript `strict` mode in tsconfig replaces it)
- Immediately followed by imports

**Rationale**: TypeScript's `"strict": true` in `tsconfig.json` enables strict
type checking at compilation. Current system-spec-kit workspaces are
package-aware: `shared/` and `mcp_server/` use NodeNext ESM, `scripts/` uses
ES2022 ESM, and the root CommonJS setting is only a fallback default.

### Full Header Example

```typescript
// ───────────────────────────────────────────────────────────────────
// MODULE: Memory Search Handler
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import path from 'node:path';

import type { SearchOptions } from '../types.js';
```

---

## 3. STRICT MODE

### tsconfig.json Replaces 'use strict'

In JavaScript `.js/.cjs`, files require `'use strict';` at the top. In
TypeScript, the `tsconfig.json` setting `"strict": true` enforces type-system
strictness at the compiler level, while ESM workspaces are strict by runtime
semantics.

```jsonc
// tsconfig.json
{
  "compilerOptions": {
    "strict": true  // Enables all strict type-checking options
  }
}
```

**What `strict: true` enables:**
- `strictNullChecks` - null/undefined handled explicitly
- `strictFunctionTypes` - stricter function parameter checking
- `strictBindCallApply` - stricter bind/call/apply checking
- `strictPropertyInitialization` - class properties must be initialized
- `noImplicitAny` - parameters and variables must have types
- `noImplicitThis` - `this` must have explicit type
- `alwaysStrict` - parses source in strict mode and emits strict markers where the selected module target requires them

**Rule**: Do NOT add `'use strict';` to TypeScript source files. Use the module
format selected by the owning package (`nodenext`, `es2022`, or inherited
fallback).

---

## 4. SECTION ORGANIZATION

Large files are organized using numbered section dividers, consistent with JavaScript style.

### Section Divider Templates

Two formats are acceptable. Use either consistently within a single file.

**Format A — Line-comment dividers** (used in most files):

```typescript
// ───────────────────────────────────────────────────────────────────
// 1. [SECTION NAME]
// ───────────────────────────────────────────────────────────────────
```

**Format B — Block-comment dividers** (used in 27+ files across the codebase):

```typescript
/* ───────────────────────────────────────────────────────────────
   1. SECTION NAME
──────────────────────────────────────────────────────────────── */
```

Both formats serve the same purpose: visual separation of major code sections with numbered headings. Choose one format per file and apply it consistently.

### Standard Section Order

| Order | Section Name      | Purpose                                |
|-------|-------------------|----------------------------------------|
| 1     | IMPORTS           | Module dependencies (with type imports)|
| 2     | TYPE DEFINITIONS  | Interfaces, types, const-derived unions|
| 3     | CONSTANTS         | Configuration values, magic numbers    |
| 4     | HELPERS           | Internal utility functions              |
| 5     | CORE LOGIC        | Main implementation                    |
| 6     | EXPORTS           | Module public interface                |

**Key difference from JavaScript**: TypeScript files include a TYPE DEFINITIONS section (section 2) between imports and constants. This is where interfaces, type aliases, and const-derived unions are defined.

Number sections from the first divider actually present in the file. File headers and module banners do not count, so a file whose first numbered divider is `TYPE DEFINITIONS` should label that divider `1`, not `2`.

### TYPE DEFINITIONS Section Example (when IMPORTS is present as section 1)

```typescript
// ───────────────────────────────────────────────────────────────────
// 2. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

/** Configuration for search operations. */
interface SearchConfig {
  readonly maxResults: number;
  readonly timeout: number;
  readonly includeMetadata: boolean;
}

/** Possible states for a memory entry. */
type MemoryState = 'active' | 'archived' | 'pending';

/** Error codes for memory operations. */
const ErrorCodes = {
  NOT_FOUND: 'NOT_FOUND',
  TIMEOUT: 'TIMEOUT',
  CONNECTION_FAILED: 'CONNECTION_FAILED',
} as const;

type ErrorCodeKey = keyof typeof ErrorCodes;
```

---

## 5. NAMING CONVENTIONS

### Interface Names

**Style**: `PascalCase` (no `I` prefix for new interfaces)

```typescript
// CORRECT — new interfaces
interface SearchResult { }
interface EmbeddingProvider { }
interface MemoryRecord { }

// CORRECT — legacy exception (documented below)
interface IEmbeddingProvider { }
interface IVectorStore { }

// INCORRECT
interface iSearchResult { }      // camelCase
interface search_result { }      // snake_case
interface ISearchResult { }      // I prefix on new interface
```

**Legacy Exception**: `IEmbeddingProvider` and `IVectorStore` retain their `I` prefix for backward compatibility with re-export aliases across the codebase. All NEW interfaces omit the prefix. This exception is documented in the migration plan (Decision D5).

### Type Alias Names

**Style**: `PascalCase`

```typescript
// CORRECT
type SearchResult = { score: number; text: string };
type MemoryState = 'active' | 'archived' | 'pending';
type ScoreCalculator = (input: number) => number;

// INCORRECT
type searchResult = { };        // camelCase
type search_result = { };       // snake_case
```

### Const Object Names and Members

**Style**: Prefer `as const` objects over `enum`, with `PascalCase` object names and `UPPER_SNAKE_CASE` keys for code maps.

```typescript
// CORRECT
export const ErrorCodes = {
  NOT_FOUND: 'NOT_FOUND',
  TIMEOUT: 'TIMEOUT',
  CONNECTION_FAILED: 'CONNECTION_FAILED',
} as const;

export type ErrorCodeKey = keyof typeof ErrorCodes;

export const MemoryTier = {
  CONSTITUTIONAL: 'constitutional',
  WORKING: 'working',
  LONG_TERM: 'long_term',
} as const;

export type MemoryTierKey = keyof typeof MemoryTier;

// INCORRECT
const errorCodes = { NOT_FOUND: 'NOT_FOUND' } as const;  // camelCase object name
const ErrorCodes = { notFound: 'NOT_FOUND' } as const;   // camelCase key
```

### Generic Type Parameters

**Style**: Single uppercase letter or `T`-prefixed descriptive name

```typescript
// CORRECT — simple
function identity<T>(value: T): T { return value; }

// CORRECT — descriptive
function transform<TInput, TOutput>(input: TInput): TOutput { }
interface Repository<TEntity> { }
type Mapper<TSource, TTarget> = (source: TSource) => TTarget;

// INCORRECT
function identity<type>(value: type): type { }    // lowercase
function transform<input, output>(): void { }      // not T-prefixed
```

### Function Names

**Style**: `camelCase` (unchanged from JavaScript)

```typescript
// CORRECT
function calculateDecayScore(age: number): number { }
function validateInput(data: unknown): data is string { }
async function fetchMemories(query: string): Promise<MemoryRecord[]> { }

// INCORRECT
function calculate_decay_score() { }    // snake_case
function CalculateDecayScore() { }      // PascalCase
```

### Constant Names

**Style**: `UPPER_SNAKE_CASE` (unchanged from JavaScript)

```typescript
// CORRECT
const MAX_QUERY_LENGTH = 10_000;
const DEFAULT_TIMEOUT = 5_000;
const SUPPORTED_MODELS: readonly string[] = ['gpt-4', 'claude-3'] as const;

// INCORRECT
const maxQueryLength = 10000;      // camelCase for a constant
```

### Variable Names

| Scope        | Style        | Example                                     |
|--------------|--------------|---------------------------------------------|
| Local        | `camelCase`  | `const searchResults: SearchResult[] = []`  |
| Module-level | `camelCase`  | `const dbPath: string = '...'`              |
| Parameters   | `camelCase`  | `function search(queryText: string)`        |

### Boolean Names

**Style**: `camelCase` with `is`/`has`/`can`/`should` prefix (unchanged from JavaScript)

```typescript
const isValid: boolean = true;
const hasResults: boolean = items.length > 0;
const canProceed: boolean = !isBlocked;
const shouldRetry: boolean = attempts < MAX_RETRIES;
```

### File Names

**Style**: `kebab-case` with `.ts` extension (unchanged from JavaScript `.js` convention)

```
memory-search.ts
vector-index.ts
path-security.ts
embedding-provider.ts
```

### snake_case Exception: Database-Mapped Properties

TypeScript interfaces that mirror SQLite column names MAY use `snake_case` properties. This exception applies **only** to properties that directly map to database columns.

**Rules:**
- Include a justification comment on each snake_case property: `// Maps to SQLite column column_name`
- For new code, prefer a mapping layer at the DB boundary (map to `camelCase` internally)
- Existing interfaces with dual naming (e.g., `MemoryRecord`) are acceptable during migration

```typescript
// ACCEPTABLE — interface mirrors DB schema directly
interface MemoryRow {
  id: string;
  importance_tier: number;   // Maps to SQLite column importance_tier
  spec_folder: string;       // Maps to SQLite column spec_folder
  created_at: number;        // Maps to SQLite column created_at
}

// PREFERRED for new code — map at the DB boundary
interface MemoryRecord {
  id: string;
  importanceTier: number;
  specFolder: string;
  createdAt: number;
}

function fromRow(row: MemoryRow): MemoryRecord {
  return {
    id: row.id,
    importanceTier: row.importance_tier,
    specFolder: row.spec_folder,
    createdAt: row.created_at,
  };
}
```

### Naming Summary Table

| Element           | Convention         | Example                     |
|-------------------|--------------------|-----------------------------|
| Functions         | `camelCase`        | `loadConfig`                |
| Constants         | `UPPER_SNAKE_CASE` | `MAX_RETRIES`               |
| Classes           | `PascalCase`       | `MemoryError`               |
| Interfaces        | `PascalCase`       | `SearchResult`              |
| Type aliases      | `PascalCase`       | `MemoryState`               |
| Const maps        | `PascalCase`       | `ErrorCodes`                |
| Const map keys    | `UPPER_SNAKE_CASE` | `ErrorCodes.NOT_FOUND`      |
| Generics          | `T`-prefix         | `<T>`, `<TResult>`          |
| Local variables   | `camelCase`        | `searchResults`             |
| Module variables  | `camelCase`        | `dbConnection`              |
| Parameters        | `camelCase`        | `queryText`                 |
| Booleans          | `is`/`has`/`can`   | `isValid`, `hasItems`       |
| Files             | `kebab-case`       | `memory-search.ts`          |
| Private members   | `_prefix`          | `private _connection`       |
| DB-mapped props   | `snake_case`*      | `importance_tier`           |

\* Exception: Only for properties that directly map to SQLite column names. See "snake_case Exception" above.

---
