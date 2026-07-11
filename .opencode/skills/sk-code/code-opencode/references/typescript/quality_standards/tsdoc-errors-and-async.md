---
title: TSDoc, Typed Error Classes & Async Patterns
description: Type system patterns, error handling, documentation, async patterns, and tsconfig baseline for TypeScript files in the OpenCode development environment. — TSDoc, Typed Error Classes & Async Patterns.
importance_tier: normal
contextType: implementation
version: 1.0.0.11
---

# TSDoc, Typed Error Classes & Async Patterns

## 7. TSDOC DOCUMENTATION

### TSDoc Format

TypeScript uses TSDoc format. Unlike JSDoc, TSDoc does not include `{type}` annotations because TypeScript has native types.

### Function Documentation

```typescript
/**
 * Search memory database for matching entries.
 *
 * Performs hybrid search combining vector similarity and BM25 keyword
 * matching, then applies RRF fusion to combine rankings.
 *
 * @param query - Search query text
 * @param options - Search configuration
 * @returns Array of matching memory entries sorted by relevance
 * @throws {@link MemoryError} If database connection fails
 * @throws {@link ValidationError} If query exceeds maximum length
 *
 * @example
 * ```typescript
 * const results = await searchMemories('authentication', {
 *   limit: 5,
 *   specFolder: 'specs/007-auth',
 * });
 * ```
 */
export async function searchMemories(
  query: string,
  options: SearchOptions = {},
): Promise<SearchResult[]> {
  // implementation
}
```

### Interface Documentation

```typescript
/**
 * Configuration for memory search operations.
 *
 * @remarks
 * All properties have sensible defaults. Only `query` is required
 * at the call site (passed as a separate parameter).
 */
interface SearchOptions {
  /** Maximum number of results to return. Defaults to 10. */
  limit?: number;

  /** Filter results to a specific spec folder path. */
  specFolder?: string;

  /** Filter by specific anchor types (e.g., 'state', 'next-steps'). */
  anchors?: readonly string[];

  /** Include full content in results. Defaults to false. */
  includeContent?: boolean;
}
```

### Class Documentation

```typescript
/**
 * Manages vector-based semantic search index.
 *
 * @remarks
 * Uses sqlite-vec for vector storage and cosine similarity search.
 * Must call {@link VectorIndex.initialize} before first use.
 *
 * @example
 * ```typescript
 * const index = new VectorIndex(dbPath);
 * await index.initialize();
 * const results = await index.search(embedding, { limit: 10 });
 * ```
 */
class VectorIndex {
  /**
   * Create a VectorIndex instance.
   *
   * @param dbPath - Path to SQLite database file
   * @param dimension - Vector dimension size (must match embedding model)
   */
  constructor(
    private readonly dbPath: string,
    private readonly dimension: number,
  ) { }
}
```

### Generic Type Documentation

```typescript
/**
 * Cached value with TTL-based expiration.
 *
 * @typeParam T - The type of the cached value
 */
interface CacheEntry<T> {
  /** The cached value. */
  readonly value: T;

  /** Unix timestamp (ms) when this entry was created. */
  readonly createdAt: number;

  /** TTL in milliseconds. Entry expires at createdAt + ttl. */
  readonly ttl: number;
}
```

### TSDoc Tag Reference

| Tag             | Purpose                                      | Example                                        |
|-----------------|----------------------------------------------|------------------------------------------------|
| `@param`        | Describe parameter                           | `@param query - Search text`                   |
| `@returns`      | Describe return value                        | `@returns Array of results`                    |
| `@throws`       | Document thrown exceptions                   | `@throws {@link MemoryError} If DB fails`      |
| `@typeParam`    | Describe generic type parameter              | `@typeParam T - Cached value type`             |
| `@remarks`      | Extended description (after summary)         | `@remarks Uses cosine similarity...`           |
| `@example`      | Usage example with code block                | `@example \`\`\`typescript ... \`\`\``         |
| `@see`          | Cross-reference                              | `@see {@link SearchOptions}`                   |
| `@deprecated`   | Mark as deprecated                           | `@deprecated Use searchMemories instead`       |
| `@internal`     | Mark as internal (not public API)            | `@internal`                                    |
| `@readonly`     | Indicate read-only property                  | `@readonly`                                    |

---

## 8. TYPED ERROR CLASSES

### Custom Error Pattern

Extend `Error` with typed properties:

```typescript
import type { RecoveryHint } from './recovery-hints.js';

export const ErrorCodes = {
  INVALID_PARAMETER: 'E030',
} as const;

/**
 * Base error for all memory operations.
 */
class MemoryError extends Error {
  /** Error code for programmatic handling. */
  public code: string;

  /** Additional details for debugging. */
  public details: Record<string, unknown>;

  /** Optional recovery guidance for callers. */
  public recoveryHint?: RecoveryHint;

  constructor(
    code: string,
    message: string,
    details: Record<string, unknown> = {},
  ) {
    super(message);
    this.name = 'MemoryError';
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, MemoryError.prototype);
  }
}

// Specialized error subclass
class ValidationError extends MemoryError {
  constructor(message: string, details: Record<string, unknown> = {}) {
    super(ErrorCodes.INVALID_PARAMETER, message, details);
    this.name = 'ValidationError';
  }
}
```

### Error Code Const Object

```typescript
export const ErrorCodes = {
  EMBEDDING_FAILED: 'E001',
  FILE_NOT_FOUND: 'E010',
  DB_CONNECTION_FAILED: 'E020',
  INVALID_PARAMETER: 'E030',
  SEARCH_FAILED: 'E040',
  RATE_LIMITED: 'E429',
} as const;

export type ErrorCodeKey = keyof typeof ErrorCodes;
```

Prefer `export const X = {...} as const` plus `keyof typeof X` over `enum` for shared code maps.

### Typed Error Handling

```typescript
// Catching typed errors
try {
  await searchMemories(query, options);
} catch (error: unknown) {
  if (error instanceof MemoryError) {
    // TypeScript narrows to MemoryError — .code and .details available
    console.error(`[search] ${error.code}: ${error.message}`);
    if (error.code === ErrorCodes.SEARCH_FAILED) {
      // Handle timeout specifically
    }
  } else if (error instanceof Error) {
    console.error(`[search] Unexpected error: ${error.message}`);
  } else {
    console.error('[search] Unknown error:', error);
  }
}
```

**Rule**: Always type `catch` parameter as `unknown` and narrow with `instanceof`.

---

## 9. ASYNC PATTERNS

### Typed Promises

```typescript
// Explicit return type for async functions
async function fetchMemories(
  query: string,
): Promise<MemoryRecord[]> {
  const results = await database.search(query);
  return results;
}
```

### Parallel Operations

```typescript
// Parallel execution with typed results
const [users, posts]: [User[], Post[]] = await Promise.all([
  fetchUsers(),
  fetchPosts(),
]);

// Promise.allSettled for partial failure tolerance
const results = await Promise.allSettled([
  embedText(text1),
  embedText(text2),
  embedText(text3),
]);

for (const result of results) {
  if (result.status === 'fulfilled') {
    processEmbedding(result.value);
  } else {
    console.error(`Embedding failed: ${result.reason}`);
  }
}
```

### Async Error Wrapper

```typescript
// Generic async error wrapper with typed result
async function safeAsync<T>(
  fn: () => Promise<T>,
  context: string,
): Promise<OperationResult<T>> {
  try {
    const data = await fn();
    return { success: true, data };
  } catch (error: unknown) {
    const message = error instanceof Error
      ? error.message
      : String(error);
    console.error(`[${context}] Failed: ${message}`);
    return { success: false, error: message, code: ErrorCodes.SEARCH_FAILED };
  }
}

// Usage
const result = await safeAsync(
  () => searchMemories(query),
  'memory-search',
);
```

---

