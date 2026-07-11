---
title: Imports/Exports, Errors, TSDoc, tsconfig & One-Liners
description: Copy-paste templates, naming cheat sheet, and common patterns for TypeScript development in OpenCode. — Imports/Exports, Errors, TSDoc, tsconfig & One-Liners.
importance_tier: normal
contextType: implementation
version: 1.0.0.11
---

# Imports/Exports, Errors, TSDoc, tsconfig & One-Liners

## 7. IMPORT / EXPORT TEMPLATES

### Import Ordering

```typescript
// 1. Node.js built-ins
import fs from 'node:fs';
import path from 'node:path';

// 2. Third-party
import Database from 'better-sqlite3';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';

// 3. Local modules
import { loadConfig } from './core/config.js';
import { MemoryError } from './errors/core.js';

// 4. Type-only imports (grouped together)
import type { SearchOptions, SearchResult } from '../types.js';
import type { DatabaseConfig } from './core/config.js';
```

Under `module: "nodenext"`, source files stay `.ts`, but relative import specifiers use the emitted `.js` extension. Use the `node:` prefix for built-in modules.

### Export Patterns

```typescript
// Named exports (preferred)
export function search(query: string): SearchResult[] { }
export class VectorIndex { }
export const MAX_RESULTS = 100;

// Type-only exports
export type { SearchResult, SearchOptions };

// Barrel file (index.ts)
export { ErrorCodes, MemoryError } from './errors/core.js';
export { VectorIndex } from './search/vector-index.js';
export type { SearchResult } from '../types.js';

// Default export (use sparingly — named exports preferred)
export default class ContextServer { }

// Re-export everything from a module
export * from './module.js';
export type * from './types.js';
```

---

## 8. ERROR HANDLING PATTERNS

### Typed catch

```typescript
try {
  await operation();
} catch (error: unknown) {
  if (error instanceof MemoryError) {
    // Narrowed to MemoryError
    console.error(`[module] ${error.code}: ${error.message}`);
  } else if (error instanceof Error) {
    // Generic Error
    console.error(`[module] Unexpected: ${error.message}`);
  } else {
    // Non-Error throw (string, number, etc.)
    console.error(`[module] Unknown error:`, error);
  }
}
```

### Custom Error Class

```typescript
import type { RecoveryHint } from './recovery-hints.js';

class MemoryError extends Error {
  public code: string;
  public details: Record<string, unknown>;
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
```

### Guard Clause

```typescript
function processData(input: unknown): SearchResult {
  if (typeof input !== 'string') {
    throw new MemoryError(
      ErrorCodes.INVALID_PARAMETER,
      'Invalid input: expected string',
      { valueType: typeof input },
    );
  }

  if (input.length === 0) {
    throw new MemoryError(
      ErrorCodes.INVALID_PARAMETER,
      'Invalid input: empty string',
      { length: 0 },
    );
  }

  // Main logic after guards pass
  return transform(input);
}
```

### Result Type Pattern

```typescript
// Instead of throwing, return a discriminated union
interface SuccessResult<T> {
  readonly success: true;
  readonly data: T;
}

interface ErrorResult {
  readonly success: false;
  readonly error: string;
  readonly code: string;
}

type Result<T> = SuccessResult<T> | ErrorResult;

// Usage
async function safeFetch(id: string): Promise<Result<MemoryRecord>> {
  try {
    const record = await database.get(id);
    if (!record) {
      return { success: false, error: 'Not found', code: ErrorCodes.FILE_NOT_FOUND };
    }
    return { success: true, data: record };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return { success: false, error: message, code: ErrorCodes.DB_CONNECTION_FAILED };
  }
}
```

---

## 9. TSDOC TEMPLATE

```typescript
/**
 * Brief description of function purpose.
 *
 * @param query - Required parameter description
 * @param options - Optional parameter with defaults
 * @returns Description of return value
 * @throws {@link MemoryError} When operation fails
 *
 * @example
 * ```typescript
 * const results = await search('query', { limit: 5 });
 * ```
 */
```

---

## 10. TSCONFIG QUICK REFERENCE

### Root Fallback Settings for OpenCode

The root config provides defaults. Current system-spec-kit workspaces override
module settings where their package boundary requires ESM.

```jsonc
{
  "compilerOptions": {
    "target": "es2022",
    "module": "commonjs",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "composite": true,
    "outDir": ".",
    "rootDir": "."
  },
  "exclude": ["node_modules"]
}
```

### Current system-spec-kit Workspace Overrides

```jsonc
// shared/tsconfig.json and mcp_server/tsconfig.json
{
  "compilerOptions": {
    "module": "nodenext",
    "moduleResolution": "nodenext",
    "verbatimModuleSyntax": true
  }
}

// scripts/tsconfig.json
{
  "compilerOptions": {
    "module": "es2022",
    "moduleResolution": "node"
  }
}
```

### Build & Rebuild Commands

```bash
# Standard build (type check + emit dist/)
npm run build                        # runs: tsc --build

# Satellite package build overlay (type check + emit dist/)
npm run build                        # runs: tsc -p tsconfig.build.json

# Type check without emitting files
npm run typecheck                    # often adds: --noEmit --composite false

# Watch mode for incremental builds
npx tsc --build --watch

# Smoke test after build
npm run test:cli
```

**After editing `.ts` source files**: Always rebuild `dist/` — the MCP server and CLI scripts run from compiled `.js`, not `.ts` source.

**Package-aware build rule**: The spec-kit root uses `tsc --build`. Satellite packages with their own package boundary, such as `system-skill-advisor/mcp_server`, use `tsc -p tsconfig.build.json`; their typecheck script may add `--noEmit --composite false` over that same overlay.

---

## 11. COMMON ONE-LINERS

```typescript
// Type narrowing for unknown
const message = error instanceof Error ? error.message : String(error);

// Default with nullish coalescing
const limit = options.limit ?? 10;

// Optional chaining
const name = user?.profile?.name;

// Type assertion (use sparingly)
const config = raw as SearchConfig;

// Satisfies (validates type without widening)
const config = {
  maxResults: 100,
  timeout: 5000,
} satisfies SearchConfig;

// Readonly array from literal
const MODELS = ['gpt-4', 'claude-3'] as const;

// Numeric separator for readability
const MAX_QUERY_LENGTH = 10_000;

// Non-null assertion (with justification comment only)
// Guaranteed by validation in constructor
const element = map.get(key)!;
```

---

## 12. RELATED RESOURCES

- [style_guide.md](../style_guide/overview-strict-and-naming.md) - Detailed formatting rules
- [quality_standards.md](../quality_standards/overview-and-type-system.md) - Type system, TSDoc, error patterns
