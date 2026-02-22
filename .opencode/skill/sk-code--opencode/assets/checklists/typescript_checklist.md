---
title: TypeScript Code Quality Checklist
description: Quality validation checklist for TypeScript code in the OpenCode development environment.
---

# TypeScript Code Quality Checklist

Quality validation checklist for TypeScript code in the OpenCode development environment.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Specific quality checks for TypeScript files. Use alongside the [universal_checklist.md](./universal_checklist.md) for complete validation.

### Priority Levels

| Level | Meaning       | Enforcement                        |
|-------|---------------|------------------------------------|
| P0    | HARD BLOCKER  | Must fix before commit             |
| P1    | Required      | Must fix or get explicit approval  |
| P2    | Recommended   | Can defer with justification       |

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:p0-hard-blockers -->
## 2. P0 - HARD BLOCKERS

These items MUST be fixed before any commit.

### File Header

```markdown
[ ] File has box header identifying the module
```

**Required format**:
```typescript
// ---------------------------------------------------------------
// MODULE: [Module Name]
// ---------------------------------------------------------------
```

### No `any` in Public API

```markdown
[ ] No `any` type used in exported functions, interfaces, or type aliases
```

**Correct**:
```typescript
export function parse(input: unknown): SearchConfig { }
export interface SearchOptions { metadata: Record<string, unknown>; }
```

**Wrong**:
```typescript
export function parse(input: any): any { }
export interface SearchOptions { metadata: any; }
```

**Exception**: Interop with untyped third-party modules requires justification comment:
```typescript
// Interop: sqlite-vec has no type definitions
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sqliteVec = require('sqlite-vec') as any;
```

### PascalCase Types and Interfaces

```markdown
[ ] All interfaces, type aliases, and enums use PascalCase naming
```

**Correct**:
```typescript
interface SearchResult { }
type MemoryState = 'active' | 'archived';
enum ErrorCode { NotFound, Timeout }
```

**Wrong**:
```typescript
interface searchResult { }       // camelCase
type memoryState = string;       // camelCase
enum errorCode { }               // camelCase
```

### No Commented-Out Code

```markdown
[ ] No commented-out code blocks present
```

Same rule as JavaScript. Delete unused code; git preserves history.

### WHY Comments

```markdown
[ ] Inline comments follow AI-intent policy (max 3 comments per 10 LOC)
    - Allowed prefixes: AI-WHY, AI-GUARD, AI-INVARIANT, AI-TRACE, AI-RISK
    - No narrative comments describing obvious mechanics
```

### Numbered ALL-CAPS Sections

```markdown
[ ] Numbered ALL-CAPS section headers are preserved (`## N. SECTION NAME`)
```

Same rule as JavaScript. Explain reasoning, not mechanics.

---

<!-- /ANCHOR:p0-hard-blockers -->
<!-- ANCHOR:p1-required -->
## 3. P1 - REQUIRED

These must be addressed or receive approval to defer.

### Explicit Return Types on Public Functions

```markdown
[ ] All exported functions have explicit return type annotations
```

**Correct**:
```typescript
export function calculate(input: number): number { }
export async function search(query: string): Promise<SearchResult[]> { }
```

**Wrong**:
```typescript
export function calculate(input: number) { }      // inferred return
export async function search(query: string) { }    // inferred return
```

Private/internal helper functions may use inferred return types.

### Interfaces for Data Shapes

```markdown
[ ] Object shapes passed across module boundaries use named interfaces
```

**Correct**:
```typescript
interface SearchOptions {
  limit: number;
  offset: number;
}
function search(query: string, options: SearchOptions): void { }
```

**Wrong**:
```typescript
function search(query: string, options: { limit: number; offset: number }): void { }
```

### Strict Mode Enabled

```markdown
[ ] tsconfig.json has "strict": true
```

No partial strict mode. All strict flags must be enabled.

### No Non-Null Assertions Without Justification

```markdown
[ ] Non-null assertions (!) have a justification comment on the preceding line
```

**Correct**:
```typescript
// Map guaranteed to contain key after initialization phase (line 42)
const value = map.get(key)!;
```

**Wrong**:
```typescript
const value = map.get(key)!;  // No explanation
```

### TSDoc on Public API

```markdown
[ ] Exported functions, classes, and interfaces have TSDoc comments
```

**Minimum**:
```typescript
/** Search memories matching the given query. */
export async function searchMemories(query: string): Promise<SearchResult[]> { }
```

**Full (for complex functions)**:
```typescript
/**
 * Search memories matching the given query.
 *
 * @param query - Search query text
 * @param options - Search configuration
 * @returns Matching memories sorted by relevance
 * @throws {@link MemoryError} If database unavailable
 */
```

### Typed Error Handling

```markdown
[ ] catch blocks use `unknown` type and narrow with instanceof
```

**Correct**:
```typescript
try { } catch (error: unknown) {
  if (error instanceof MemoryError) { }
}
```

**Wrong**:
```typescript
try { } catch (error) {        // implicitly any
  console.log(error.message);  // unsafe access
}
```

### KISS / DRY / SOLID Checks

```markdown
[ ] KISS: remove unnecessary abstraction layers
[ ] DRY: duplicate constants/rules are centralized
[ ] SOLID: SRP/OCP/LSP/ISP/DIP risks reviewed with evidence
```

---

<!-- /ANCHOR:p1-required -->
<!-- ANCHOR:p2-recommended -->
## 4. P2 - RECOMMENDED

These improve quality but can be deferred.

### Utility Types Used Where Appropriate

```markdown
[ ] Standard utility types preferred over manual type construction
```

**Correct**:
```typescript
function update(overrides: Partial<Config>): Config { }
type Summary = Pick<MemoryRecord, 'id' | 'text'>;
```

**Less optimal**:
```typescript
function update(overrides: { timeout?: number; limit?: number }): Config { }
// Manual partial instead of Partial<Config>
```

### Discriminated Unions for Complex State

```markdown
[ ] Multi-state objects use discriminated unions instead of optional properties
```

**Correct**:
```typescript
type Result<T> =
  | { success: true; data: T }
  | { success: false; error: string };
```

**Less optimal**:
```typescript
interface Result<T> {
  success: boolean;
  data?: T;         // unclear when present
  error?: string;   // unclear when present
}
```

### Type-Only Imports Separated

```markdown
[ ] Imports used only in type positions use `import type`
```

**Correct**:
```typescript
import { MemoryError } from './errors';          // runtime value
import type { SearchResult } from '../types';     // type only
```

**Less optimal**:
```typescript
import { MemoryError, SearchResult } from './module';
// SearchResult only used as type but imported as value
```

### Generic Constraints Where Applicable

```markdown
[ ] Generic type parameters have constraints when meaningful
```

**Correct**:
```typescript
function findById<T extends { id: string }>(items: T[], id: string): T | undefined { }
```

**Less optimal**:
```typescript
function findById<T>(items: T[], id: string): T | undefined { }
// No guarantee T has an 'id' property
```

### Readonly Where Appropriate

```markdown
[ ] Configuration objects and immutable data use readonly modifiers
```

**Correct**:
```typescript
interface SearchConfig {
  readonly maxResults: number;
  readonly timeout: number;
}
```

---

<!-- /ANCHOR:p2-recommended -->
<!-- ANCHOR:checklist-template -->
## 5. CHECKLIST TEMPLATE

Copy this for code review:

```markdown
## TypeScript Code Quality Check

### P0 - HARD BLOCKERS
- [ ] File header present (box format)
- [ ] No `any` in public API
- [ ] PascalCase types/interfaces/enums
- [ ] No commented-out code
- [ ] AI-intent comments (max 3/10, AI-WHY/AI-GUARD/AI-INVARIANT/AI-TRACE/AI-RISK)

### P1 - REQUIRED
- [ ] Explicit return types on exported functions
- [ ] Named interfaces for data shapes
- [ ] strict: true in tsconfig
- [ ] Non-null assertions justified
- [ ] TSDoc on public API
- [ ] Typed error handling (catch unknown)

### P2 - RECOMMENDED
- [ ] Utility types used (Partial, Pick, Omit, etc.)
- [ ] Discriminated unions for multi-state objects
- [ ] Type-only imports separated (import type)
- [ ] Generic constraints where meaningful
- [ ] Readonly for immutable data

### Universal Checklist
- [ ] [universal_checklist.md](./universal_checklist.md) passed

### Notes
[Any specific observations or deferred items]
```

---

<!-- /ANCHOR:checklist-template -->
<!-- ANCHOR:validation-commands -->
## 6. VALIDATION COMMANDS

```bash
# Type check without emitting files
tsc --noEmit

# Build with project references
tsc --build

# Check for `any` in public API
grep -rn ': any' src/ --include='*.ts' | grep -v 'node_modules'

# Check for missing return types on exports
grep -rn 'export function' src/ --include='*.ts' | grep -v '): '

# Check for untyped catch blocks
grep -rn 'catch (error)' src/ --include='*.ts'
```

---

<!-- /ANCHOR:validation-commands -->
<!-- ANCHOR:related-resources -->
## 7. RELATED RESOURCES

### Checklists
- [universal_checklist.md](./universal_checklist.md) - Language-agnostic checks

### Style Guide
- [TypeScript Style Guide](../../references/typescript/style_guide.md)
- [TypeScript Quality Standards](../../references/typescript/quality_standards.md)
<!-- /ANCHOR:related-resources -->
