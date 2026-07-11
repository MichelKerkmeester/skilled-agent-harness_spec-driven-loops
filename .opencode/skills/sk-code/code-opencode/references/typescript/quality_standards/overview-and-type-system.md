---
title: TypeScript Quality Standards
description: Type system patterns, error handling, documentation, async patterns, and tsconfig baseline for TypeScript files in the OpenCode development environment.
trigger_phrases:
  - "opencode typescript quality standards"
  - "interface vs type decision"
  - "typescript type safety policies"
  - "tsconfig baseline standards"
importance_tier: normal
contextType: implementation
version: 1.0.0.11
---

# TypeScript Quality Standards

Type system patterns, error handling, documentation, async patterns, and tsconfig baseline for TypeScript files in the OpenCode development environment.

---

## 1. OVERVIEW

### Purpose

Establishes type system patterns, error handling, documentation, async patterns, and tsconfig baseline that all TypeScript code in the OpenCode development environment must follow.

### When to Use

- Writing new TypeScript modules
- Reviewing TypeScript code for quality compliance
- Setting up type safety, error handling, and documentation patterns

---

## 2. INTERFACE vs TYPE DECISION GUIDE

### When to Use `interface`

Use `interface` for object shapes, class contracts, and data structures:

```typescript
// Object shapes
interface SearchResult {
  readonly id: string;
  score: number;
  text: string;
  metadata: Record<string, unknown>;
}

// Class contracts
interface EmbeddingProvider {
  embed(text: string): Promise<number[]>;
  batchEmbed(texts: string[]): Promise<number[][]>;
  getDimension(): number;
  getModelName(): string;
  isReady(): boolean;
}

// Extending shapes
interface DetailedSearchResult extends SearchResult {
  highlights: string[];
  explanation: string;
}
```

**Why interfaces for objects**: Interfaces support declaration merging, provide clearer error messages, and signal "this is a data contract" to the reader.

### When to Use `type`

Use `type` for unions, intersections, mapped types, conditional types, and function signatures:

```typescript
// Union types
type MemoryState = 'active' | 'archived' | 'pending' | 'deleted';

// Intersection types
type Timestamped<T> = T & { createdAt: number; updatedAt: number };

// Function signatures
type ScoreCalculator = (input: number, weight: number) => number;

// Conditional types
type AsyncReturn<T> = T extends Promise<infer U> ? U : T;

// Mapped types
type Nullable<T> = { [K in keyof T]: T[K] | null };

// Tuple types
type Coordinates = [x: number, y: number];
```

### Decision Summary

| Use Case                           | Construct   | Reason                          |
|------------------------------------|-------------|---------------------------------|
| Object shapes / data structures    | `interface` | Extensible, clear error messages|
| Class contracts                    | `interface` | Supports `implements`           |
| Union types                        | `type`      | Only `type` supports unions     |
| Intersection / mapped / conditional| `type`      | Only `type` supports these      |
| Function signatures (standalone)   | `type`      | Cleaner syntax than interface    |
| Simple primitives / literals       | `type`      | `type ID = string`              |

---

## 3. TYPE SAFETY POLICIES

### `unknown` Over `any`

**Policy**: Use `unknown` instead of `any` in public API surfaces. The `any` type disables type checking entirely. `unknown` forces callers to narrow the type before use.

```typescript
// CORRECT — unknown forces type narrowing
function parseInput(raw: unknown): SearchConfig {
  if (typeof raw !== 'object' || raw === null) {
    throw new TypeError('Expected object input');
  }
  const obj = raw as Record<string, unknown>;
  // validate and narrow further...
  return obj as SearchConfig;
}

// INCORRECT — any disables all type checking
function parseInput(raw: any): SearchConfig {
  return raw;  // No validation, no safety
}
```

**Permitted `any` usage** (must include justification comment):

```typescript
// Interop with untyped third-party library (sqlite-vec native module)
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sqliteVec = require('sqlite-vec') as any;
```

### Strict Null Checks

With `strictNullChecks: true`, `null` and `undefined` must be handled explicitly:

```typescript
// CORRECT — explicit null handling
function findMemory(id: string): MemoryRecord | null {
  const record = database.get(id);
  if (!record) return null;
  return record;
}

// Usage requires null check
const memory = findMemory('abc');
if (memory !== null) {
  console.log(memory.text);  // TypeScript knows memory is not null here
}
```

### Non-Null Assertions

**Policy**: Avoid non-null assertions (`!`). When absolutely necessary, include a justification comment:

```typescript
// AVOID — non-null assertion hides potential bugs
const name = user!.name;

// PREFERRED — explicit null check
if (user === null) throw new Error('User not found');
const name = user.name;

// PERMITTED — with justification
// Process guarantees element exists after validation phase (see line 42)
const element = document.getElementById('root')!;
```

### Generic Constraints

Use `extends` to constrain generic type parameters:

```typescript
// CORRECT — constrained generic
function getProperty<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  key: K,
): T[K] {
  return obj[key];
}

// CORRECT — constraint ensures required shape
interface HasId { readonly id: string; }
function findById<T extends HasId>(items: T[], id: string): T | undefined {
  return items.find(item => item.id === id);
}

// INCORRECT — unconstrained when constraint is needed
function getProperty<T>(obj: T, key: string): unknown {
  return (obj as Record<string, unknown>)[key];  // Loses type safety
}
```

---

## 4. DISCRIMINATED UNIONS

Use discriminated unions for state management where an object can be in one of several distinct states:

```typescript
// Discriminated union for operation results
interface SuccessResult<T> {
  readonly success: true;
  readonly data: T;
}

interface ErrorResult {
  readonly success: false;
  readonly error: string;
  readonly code: string;
}

type OperationResult<T> = SuccessResult<T> | ErrorResult;

// Usage — TypeScript narrows automatically
function handleResult(result: OperationResult<SearchResult[]>): void {
  if (result.success) {
    // TypeScript knows: result.data exists
    console.log(`Found ${result.data.length} results`);
  } else {
    // TypeScript knows: result.error and result.code exist
    console.error(`Error ${result.code}: ${result.error}`);
  }
}
```

### State Machine Pattern

```typescript
type ConnectionState =
  | { status: 'disconnected' }
  | { status: 'connecting'; attempt: number }
  | { status: 'connected'; connection: DatabaseConnection }
  | { status: 'error'; error: Error; lastAttempt: number };

function getConnectionInfo(state: ConnectionState): string {
  switch (state.status) {
    case 'disconnected':
      return 'Not connected';
    case 'connecting':
      return `Connecting (attempt ${state.attempt})`;
    case 'connected':
      return `Connected to ${state.connection.host}`;
    case 'error':
      return `Error: ${state.error.message}`;
  }
}
```

---

## 5. UTILITY TYPES

### Standard TypeScript Utility Types

Use built-in utility types instead of reinventing them:

| Utility Type       | Purpose                                    | Example                                     |
|--------------------|--------------------------------------------|---------------------------------------------|
| `Partial<T>`      | All properties optional                    | `Partial<SearchConfig>` for update payloads  |
| `Required<T>`     | All properties required                    | `Required<OptionalConfig>` for validated config |
| `Pick<T, K>`      | Select specific properties                 | `Pick<MemoryRecord, 'id' \| 'text'>`        |
| `Omit<T, K>`      | Exclude specific properties                | `Omit<MemoryRecord, 'internalScore'>`        |
| `Record<K, V>`    | Object with typed keys and values          | `Record<string, unknown>` for metadata       |
| `Readonly<T>`     | All properties readonly                    | `Readonly<SearchConfig>` for immutable config |
| `ReadonlyArray<T>`| Immutable array                            | `ReadonlyArray<string>` or `readonly string[]`|
| `NonNullable<T>`  | Exclude null and undefined                 | `NonNullable<string \| null>` = `string`     |
| `ReturnType<T>`   | Extract function return type               | `ReturnType<typeof calculateScore>`          |
| `Parameters<T>`   | Extract function parameter types as tuple  | `Parameters<typeof search>`                  |

### Common Patterns in OpenCode

```typescript
// Configuration with optional overrides
function configure(overrides: Partial<SearchConfig>): SearchConfig {
  return { ...DEFAULT_CONFIG, ...overrides };
}

// Immutable configuration
const FROZEN_CONFIG = Object.freeze({
  maxResults: 100,
  timeout: 5000,
  includeMetadata: true,
} satisfies SearchConfig);

// Metadata as untyped key-value pairs
interface MemoryRecord {
  readonly id: string;
  text: string;
  metadata: Record<string, unknown>;
}

// Create type from existing interface
type MemorySummary = Pick<MemoryRecord, 'id' | 'text'>;
type PublicMemory = Omit<MemoryRecord, 'internalScore'>;
```

---

## 6. RETURN TYPE ANNOTATIONS

### Policy: Explicit for Public API, Inferred for Private Helpers

```typescript
// PUBLIC API — explicit return type (required by P1 checklist)
export function calculateDecayScore(
  baseScore: number,
  ageInHours: number,
): number {
  return baseScore * Math.exp(-0.1 * ageInHours);
}

// PUBLIC API — async explicit return type
export async function searchMemories(
  query: string,
  options: SearchOptions,
): Promise<SearchResult[]> {
  // implementation
}

// PRIVATE HELPER — inferred return type is acceptable
function normalizeScore(raw: number, max: number) {
  return Math.min(raw / max, 1.0);
}
```

**Why explicit on public API**: Return types serve as documentation, prevent accidental signature changes, and improve compile-time error messages for consumers.

**Why inferred on private helpers**: Reduces boilerplate for internal code where the return type is obvious from the implementation.

---

