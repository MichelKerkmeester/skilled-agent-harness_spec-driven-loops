---
title: TypeScript Quick Reference
description: Copy-paste templates, naming cheat sheet, and common patterns for TypeScript development in OpenCode.
trigger_phrases:
  - "opencode typescript quick reference"
  - "typescript file template"
  - "type annotation patterns"
  - "typescript naming cheat sheet"
importance_tier: normal
contextType: implementation
version: 1.0.0.11
---

# TypeScript Quick Reference

Copy-paste templates, naming cheat sheet, and common patterns for TypeScript development in OpenCode.

---

## 1. OVERVIEW

### Purpose

Quick-access reference card for TypeScript patterns. For detailed explanations, see:
- [style_guide.md](./style_guide.md) - Full style documentation
- [quality_standards.md](./quality_standards.md) - Quality requirements

Current system-spec-kit TypeScript is package-aware: `shared/` and
`mcp_server/` use NodeNext ESM, `scripts/` uses ES2022 ESM, and root CommonJS
settings are only fallback defaults for workspaces that do not override them.

---

## 2. COMPLETE FILE TEMPLATE

```typescript
// ───────────────────────────────────────────────────────────────────
// MODULE: [Module Name]
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import path from 'node:path';

import Database from 'better-sqlite3';

import { loadConfig } from './core/config.js';
import { ErrorCodes, MemoryError } from './errors/core.js';

import type { SearchOptions, SearchResult } from '../types.js';

// ───────────────────────────────────────────────────────────────────
// 2. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

/** Configuration for the main operation. */
interface ModuleConfig {
  readonly timeout: number;
  readonly maxRetries: number;
  readonly verbose: boolean;
}

/** Possible operation outcomes. */
type OperationOutcome = 'success' | 'failure' | 'timeout';

// ───────────────────────────────────────────────────────────────────
// 3. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const DEFAULT_TIMEOUT = 5_000;
const MAX_RETRIES = 3;
const DEFAULT_ERROR_DETAILS = Object.freeze({
  source: 'module-name',
} satisfies Record<string, unknown>);

// ───────────────────────────────────────────────────────────────────
// 4. HELPERS
// ───────────────────────────────────────────────────────────────────

function validateInput(input: unknown): input is string {
  return typeof input === 'string' && input.length > 0;
}

// ───────────────────────────────────────────────────────────────────
// 5. CORE LOGIC
// ───────────────────────────────────────────────────────────────────

/**
 * Main function description.
 *
 * @param input - Input description
 * @param options - Configuration options
 * @returns Result object with success status and data
 * @throws {@link MemoryError} If operation fails
 */
export async function mainFunction(
  input: string,
  options: Partial<ModuleConfig> = {},
): Promise<SearchResult[]> {
  if (!validateInput(input)) {
    throw new MemoryError(
      ErrorCodes.INVALID_PARAMETER,
      'Invalid input: expected non-empty string',
      DEFAULT_ERROR_DETAILS,
    );
  }

  try {
    const config: ModuleConfig = {
      timeout: DEFAULT_TIMEOUT,
      maxRetries: MAX_RETRIES,
      verbose: false,
      ...options,
    };
    const result = await process(input, config);
    return result;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[module-name] Error: ${message}`);
    throw error;
  }
}

// ───────────────────────────────────────────────────────────────────
// 6. EXPORTS
// ───────────────────────────────────────────────────────────────────

export { validateInput };
export type { ModuleConfig, OperationOutcome };
```

---

## 3. NAMING CHEAT SHEET

| Element           | Convention         | Example                   |
|-------------------|--------------------|---------------------------|
| Functions         | `camelCase`        | `loadConfig`              |
| Constants         | `UPPER_SNAKE_CASE` | `MAX_RETRIES`             |
| Classes           | `PascalCase`       | `MemoryError`             |
| Interfaces        | `PascalCase`       | `SearchResult`            |
| Type aliases      | `PascalCase`       | `MemoryState`             |
| Const maps        | `PascalCase`       | `ErrorCodes`              |
| Const map keys    | `UPPER_SNAKE_CASE` | `ErrorCodes.INVALID_PARAMETER` |
| Generics          | `T`-prefix         | `<T>`, `<TResult>`        |
| Local variables   | `camelCase`        | `searchResults`           |
| Module variables  | `camelCase`        | `dbConnection`            |
| Parameters        | `camelCase`        | `queryText`               |
| Booleans          | `is`/`has`/`can`   | `isValid`, `hasItems`     |
| Files             | `kebab-case`       | `memory-search.ts`        |
| Private members   | `_prefix`          | `private _connection`     |

**Legacy exception**: `IEmbeddingProvider` and `IVectorStore` keep `I` prefix. New interfaces omit it.

---

## 4. SECTION ORDERING

```
1. IMPORTS           (Node built-ins, third-party, local, type-only)
2. TYPE DEFINITIONS  (Interfaces, types, const-derived unions)
3. CONSTANTS         (Configuration values)
4. HELPERS           (Internal utility functions)
5. CORE LOGIC        (Main implementation)
6. EXPORTS           (Module public interface)
```

---

## 5. TYPE ANNOTATION PATTERNS

### Basic Annotations

```typescript
// Variables
const name: string = 'hello';
const count: number = 42;
const isActive: boolean = true;
const items: string[] = ['a', 'b', 'c'];
const metadata: Record<string, unknown> = {};

// Optional
const limit: number | undefined = options.limit;
const result: MemoryRecord | null = findById(id);
```

### Function Signatures

```typescript
// Named function
function add(a: number, b: number): number {
  return a + b;
}

// Arrow function
const multiply = (a: number, b: number): number => a * b;

// Async function
async function fetch(id: string): Promise<MemoryRecord | null> {
  return database.get(id);
}

// Optional parameters
function search(query: string, limit?: number): SearchResult[] { }

// Default parameters
function configure(options: Partial<Config> = {}): Config { }

// Rest parameters
function log(prefix: string, ...args: unknown[]): void { }

// Type guard
function isString(value: unknown): value is string {
  return typeof value === 'string';
}
```

### Object and Array Types

```typescript
// Object type with readonly
interface Config {
  readonly host: string;
  readonly port: number;
  debug?: boolean;  // optional
}

// Array types
const ids: string[] = [];
const matrix: number[][] = [];
const records: readonly MemoryRecord[] = [];  // immutable array

// Tuple
const pair: [string, number] = ['score', 0.95];
```

---

## 6. COMMON UTILITY TYPE PATTERNS

```typescript
// Partial — all properties optional (for updates/overrides)
function updateConfig(overrides: Partial<SearchConfig>): SearchConfig {
  return { ...DEFAULT_CONFIG, ...overrides };
}

// Required — all properties required (for validated state)
function validate(input: Partial<Config>): Required<Config> {
  // ... validation logic
}

// Pick — select specific properties
type MemorySummary = Pick<MemoryRecord, 'id' | 'text' | 'score'>;

// Omit — exclude properties
type PublicRecord = Omit<MemoryRecord, 'internalScore' | 'rawEmbedding'>;

// Record — typed key-value object
const scores: Record<string, number> = { relevance: 0.9, recency: 0.7 };

// Readonly — immutable version
const frozen: Readonly<Config> = Object.freeze(config);

// NonNullable — strip null/undefined
type ValidId = NonNullable<string | null | undefined>;  // string

// ReturnType — extract return type from function
type SearchReturn = ReturnType<typeof searchMemories>;
```

---
