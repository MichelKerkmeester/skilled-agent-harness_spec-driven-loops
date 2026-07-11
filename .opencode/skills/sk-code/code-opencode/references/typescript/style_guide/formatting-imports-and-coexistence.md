---
title: Formatting, Imports, Commenting & JS/TS Coexistence
description: Formatting standards and naming conventions for TypeScript files in the OpenCode development environment. — Formatting, Imports, Commenting & JS/TS Coexistence.
importance_tier: normal
contextType: implementation
version: 1.0.0.17
---

# Formatting, Imports, Commenting & JS/TS Coexistence

## 6. FORMATTING RULES

### Indentation

- **Size**: 2 spaces (same as JavaScript)
- **Tabs**: Never use tabs

### Braces

**Style**: K&R (opening brace on same line)

```typescript
if (condition) {
  // code
} else {
  // code
}

function example(): void {
  // code
}
```

### Semicolons

**Rule**: Always use semicolons (same as JavaScript)

```typescript
const value: number = 42;
return result;
```

### Quotes

**Rule**: Single quotes for strings (same as JavaScript)

```typescript
const message = 'Hello world';
const template = `Value: ${value}`;  // Template literals OK
```

### Line Length

- **Maximum**: 100 characters
- **Preferred**: 80 characters
- **Exception**: URLs, long type signatures, and import paths

### Type Annotation Placement

**Rule**: Type annotations follow the colon with a single space.

```typescript
// CORRECT
const name: string = 'hello';
function add(a: number, b: number): number { return a + b; }
const items: string[] = [];

// INCORRECT
const name:string = 'hello';           // no space after colon
const name :string = 'hello';          // space before colon
```

### Multiline Type Definitions

For types that exceed line length limits, break at logical points:

```typescript
// Short — single line is fine
interface Point { x: number; y: number; }

// Medium — use multiline formatting
interface SearchConfig {
  readonly query: string;
  readonly limit: number;
  readonly offset: number;
  readonly filters: Record<string, unknown>;
}

// Long union types — one member per line
type MemoryOperation =
  | 'save'
  | 'search'
  | 'delete'
  | 'archive'
  | 'consolidate';

// Long function types — break parameters
type TransformFn = (
  input: string,
  options: TransformOptions,
  context: ExecutionContext,
) => Promise<TransformResult>;
```

### Trailing Commas

**Rule**: Use trailing commas in multiline constructs (arrays, objects, parameters, type members).

```typescript
// CORRECT — trailing comma
const config: SearchConfig = {
  query: 'test',
  limit: 10,
  offset: 0,
};

// CORRECT — trailing comma in multiline parameters
function search(
  query: string,
  options: SearchOptions,
  context: ExecutionContext,
): Promise<SearchResult[]> {
  // ...
}
```

---

## 7. IMPORT ORDERING

### Four-Group Import Order

TypeScript imports follow a four-group ordering with blank lines between groups:

```typescript
// 1. Node.js built-in modules
import fs from 'node:fs';
import path from 'node:path';

// 2. Third-party packages
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import Database from 'better-sqlite3';

// 3. Local modules (project code)
import { loadConfig } from './core/config.js';
import { MemoryError } from './errors/core.js';
import { validateInputLengths } from './utils/validation.js';

// 4. Type-only imports (grouped together)
import type { SearchOptions, SearchResult } from '../types.js';
import type { DatabaseConfig } from './core/config.js';
```

Under `module: "nodenext"`, TypeScript source remains `.ts`, but every relative import specifier must use the emitted `.js` extension. Built-in modules use the `node:` protocol prefix.

### Type-Only Imports

Use `import type` for imports used only in type positions. This ensures they are erased at compile time and do not create runtime dependencies. Group type-only imports together; do not interleave value and type imports from the same module.

```typescript
// CORRECT — type-only import (erased at compile time)
import type { EmbeddingProfile } from '../shared/types.js';

// CORRECT — mixed: value import (needed at runtime)
import { MemoryError } from './errors/core.js';

// INCORRECT — importing a type without `import type`
import { SearchResult } from '../types.js';  // Only used as a type
```

**Rule**: If an import is ONLY used in type annotations, parameter types, return types, or generic constraints, use `import type`.

### Re-export Syntax

```typescript
// Re-export everything
export * from './module.js';

// Re-export specific items
export { ErrorCodes, MemoryError } from './errors/core.js';

// Re-export types only
export type { SearchResult, SearchOptions } from '../types.js';
```

---

## 8. COMMENTING RULES

### Principles (Same as JavaScript)

1. **Quantity limit**: Maximum 3 comments per 10 lines of code
2. **Focus on purposeful semantics**: Explain WHY something is done, not WHAT it does
3. **Focus on WHY, not WHAT**: Explain intent, constraints, reasoning
4. **No commented-out code**: Delete unused code (git preserves history)

### Comment Examples

Use plain comments that explain reasoning:

- `// Rationale for this path`
- `// Contract/precondition that must hold`
- `// State that must hold after execution`
- `// SEC: security note tied to a stable standard (CWE-###)`
- `// Reliability/performance/security risk control`
- No spec-folder-internal ids (`T###`/`REQ-###`/`CHK-###`/ADR/ticket) in comments — see [`../shared/universal_patterns.md`](../shared/universal_patterns.md) §4.

### Capitalization

All comment text MUST start with a capital letter:

```typescript
// Reverse order preserves dependency chain     // correct
// reverse order preserves dependency chain     // wrong
```

**Exceptions**: `eslint-disable` directives, `@ts-` annotations, and inline code references.

### TSDoc Comments (Replaces JSDoc)

TypeScript uses TSDoc format for documentation comments. See `quality_standards.md` for the full TSDoc reference.

```typescript
/**
 * Search memory database for matching entries.
 *
 * @param query - Search query text
 * @param options - Search configuration
 * @returns Array of matching memory entries
 * @throws {@link MemoryError} If database connection fails
 */
async function memorySearch(
  query: string,
  options: SearchOptions = {},
): Promise<SearchResult[]> {
  // implementation
}
```

**Key difference from JSDoc**: TSDoc does not use `{type}` annotations in tags because TypeScript has native type annotations. Compare:

```typescript
// JSDoc (JavaScript) — types in comments
/** @param {string} query - Search text */

// TSDoc (TypeScript) — types in code
/** @param query - Search text */
function search(query: string): void { }
```

---

## 9. MIXED JS/TS COEXISTENCE PATTERNS

During the transitional period where the codebase contains both JavaScript and TypeScript files, the following patterns are acceptable.

### TypeScript Importing JavaScript

Use ESM imports for local modules and keep the emitted `.js` extension in the specifier. For CommonJS-only packages or modules, create a scoped `require` with `createRequire(import.meta.url)`; bare `require(...)` is a runtime `ReferenceError` in ESM even when `tsc` accepts it.

```typescript
// Option A — local JS module through ESM
import config from './legacy-config.js';

// Option B — CommonJS-only dependency
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const legacyHelper = require('legacy-helper') as LegacyHelper;
```

For frequently imported JS modules, add a `.d.ts` declaration file co-located with the JS module and sharing its exact basename. A relative `declare module './legacy-config.js' { ... }` block does NOT type an untyped local sibling — it fails with `TS7016 (Could not find a declaration file for module …)`; use plain top-level declarations instead:

```typescript
// legacy-config.d.ts — same directory and exact basename as legacy-config.js
export interface LegacyConfig {
  version: string;
  features: string[];
}
declare const config: LegacyConfig;
export default config;
```

### Dynamic require() with try-catch

For optional dependencies (e.g., native modules that may not be installed):

```typescript
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

let sqliteVec: any;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  sqliteVec = require('sqlite-vec');
} catch {
  console.warn('[vector-index] sqlite-vec not available, falling back');
  sqliteVec = null;
}
```

### 'use strict' Rule

- `.js` files: **ALWAYS** include `'use strict';` at the top
- `.ts` files: **NEVER** include `'use strict';` (tsconfig `strict: true` handles it)

### Backward-Compatible Export Aliases

During migration, modules may export both old (`snake_case`) and new (`camelCase`) names:

```typescript
// Primary exports
export { memorySearch, loadConfig };

// Backward-compatible aliases — remove after migration completes
export {
  memorySearch as memory_search,
  loadConfig as load_config,
};
```

### allowJs in tsconfig

When a TypeScript project includes legacy `.js` files that cannot be immediately converted:

```jsonc
{
  "compilerOptions": {
    "allowJs": true,        // Include .js files in compilation
    "checkJs": false         // Don't type-check .js files (too noisy during migration)
  }
}
```

Set `checkJs: true` only after the majority of JS files have been migrated or typed.

---

## 10. RELATED RESOURCES

- [quality_standards.md](./quality_standards.md) - Type system, TSDoc, error patterns, tsconfig
- [quick_reference.md](./quick_reference.md) - Copy-paste templates and cheat sheets
