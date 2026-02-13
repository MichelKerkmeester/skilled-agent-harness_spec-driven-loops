# Decision Record: Phase 6 — Convert scripts/ to TypeScript

> **Parent Spec:** 092-javascript-to-typescript/
> **Workstream:** W-F
> **Session:** Session 3 (parallel with Phase 5)
> **Status:** Planning
> **Created:** 2026-02-07

---

## Overview

Phase 6 inherits all 8 architectural decisions from the parent spec (092-javascript-to-typescript/decision-record.md). This document records Phase 6-specific implementation choices and their rationale.

---

## Inherited Decisions (from Parent Spec)

Phase 6 adheres to all parent spec decisions:

| # | Decision | Impact on Phase 6 |
|---|----------|------------------|
| **D1** | CommonJS output (not ESM) | scripts/ compiles to `module.exports`, preserves `__dirname` in CLI tools |
| **D2** | In-place compilation (no `dist/`) | scripts/ `.ts` files compile to `.js` in same directory |
| **D3** | `strict: true` from start | All scripts/ files use strict type checking from day 1 |
| **D4** | Move files to break circular deps | scripts/ already clean (depends on shared/, minimal mcp_server/) |
| **D5** | Keep `I` prefix on existing interfaces | Not applicable to scripts/ (no interfaces exported) |
| **D6** | Phase 0 standards first | scripts/ conversion follows TypeScript standards from Phase 0 |
| **D7** | Central `shared/types.ts` | scripts/ imports common types from shared/ |
| **D8** | Convert tests last (Phase 7) | scripts/ tests converted in Phase 7, not Phase 6 |

---

## Phase 6-Specific Decisions

### D-P6-01: Lazy require() → Static import Conversion

**Decision:** Convert all lazy `require()` calls in `core/workflow.ts` to static `import` statements at file top.

**Context:**
- `core/workflow.ts` (550 lines) uses lazy require() for conditional module loading (optimization for faster startup)
- Example: `const loader = require('./loaders/data-loader');` (loaded only if needed)
- TypeScript encourages static imports for better type inference and tree-shaking

**Options Considered:**

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| **A: Convert to static import** | Type inference works, easier to maintain, matches TS idioms | Slightly slower startup (all modules loaded upfront) | ✅ Chosen |
| B: Keep dynamic import | Preserves startup performance | `import()` syntax is async, complicates workflow control flow, loses type inference | ❌ Rejected |
| C: Mix of static + dynamic | Some optimization retained | Inconsistent pattern, harder to reason about | ❌ Rejected |

**Rationale:**
- TypeScript's type system works best with static imports
- Startup time dominated by `tsc` build, not module loading at runtime
- Consistency: all other scripts/ modules use static imports
- Compiled `.js` output is CommonJS anyway (no ESM lazy loading benefits)

**Implementation:**
```typescript
// Before (JS):
function runWorkflow() {
  const loader = require('./loaders/data-loader'); // lazy
  const data = loader.loadData();
}

// After (TS):
import { loadData } from './loaders/data-loader'; // static

function runWorkflow() {
  const data = loadData();
}
```

**Status:** Decided
**Date:** 2026-02-07

---

### D-P6-02: Re-export Proxy Strategy

**Decision:** Use `export *` syntax for re-export proxies to other workspaces.

**Context:**
- 3 files are re-export proxies: `lib/embeddings.ts`, `lib/trigger-extractor.ts`, `lib/retry-manager.ts`
- These provide convenient import paths: `scripts/lib/embeddings` → `shared/embeddings`
- Need to preserve backward compatibility while ensuring type safety

**Options Considered:**

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| **A: `export *` wildcard** | Simplest, preserves all exports, type inference works | May export more than needed | ✅ Chosen |
| B: Named re-exports | Explicit control over exports | Maintenance burden (update on every upstream change) | ❌ Rejected |
| C: Direct imports (no proxy) | No indirection | Breaks existing imports, migration burden | ❌ Rejected |

**Rationale:**
- `export *` is idiomatic TypeScript for re-exports
- TypeScript compiler ensures type safety through proxy
- Minimal maintenance (upstream changes propagate automatically)
- Compiled output is identical to original JS proxies

**Implementation:**
```typescript
// lib/embeddings.ts
export * from '../../../shared/embeddings';

// lib/trigger-extractor.ts
export * from '../../../shared/trigger-extractor';

// lib/retry-manager.ts
export * from '../../../mcp_server/lib/providers/retry-manager';
```

**Status:** Decided
**Date:** 2026-02-07

---

### D-P6-03: Snake_case Alias Preservation Method

**Decision:** Export both camelCase and snake_case aliases in `spec-folder/index.ts` barrel file.

**Context:**
- Spec 090 standardized exports to both camelCase (primary) and snake_case (backward compatibility)
- 4 functions in spec-folder/ have snake_case aliases: `detect_spec_folder`, `setup_context_directory`, `filter_archive_folders`, `validate_content_alignment`
- Must preserve backward compatibility during TypeScript migration

**Options Considered:**

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| **A: Dual export in barrel** | Clean, explicit, co-located | Slightly verbose | ✅ Chosen |
| B: Use `export { x as y }` | TypeScript native | Same verbosity | ❌ Equivalent |
| C: Drop snake_case | Simplifies codebase | Breaks existing consumers | ❌ Rejected |

**Rationale:**
- Backward compatibility is P0 (many consumers use snake_case)
- Barrel file is natural place for alias definitions
- TypeScript type inference works for both aliases
- Test coverage ensures both work identically

**Implementation:**
```typescript
// spec-folder/index.ts
export { detectSpecFolder, detectSpecFolder as detect_spec_folder } from './folder-detector';
export { setupContextDirectory, setupContextDirectory as setup_context_directory } from './directory-setup';
export { filterArchiveFolders, filterArchiveFolders as filter_archive_folders } from './folder-detector';
export { validateContentAlignment, validateContentAlignment as validate_content_alignment } from './alignment-validator';
```

**Verification:**
```typescript
// Both should work:
import { detectSpecFolder } from './spec-folder';
import { detect_spec_folder } from './spec-folder';
```

**Status:** Decided
**Date:** 2026-02-07

---

### D-P6-04: CLI Argument Typing Strategy

**Decision:** Define explicit interfaces for CLI argument structures in entry point files.

**Context:**
- 3 CLI entry points: `generate-context.ts`, `rank-memories.ts`, `cleanup-orphaned-vectors.ts`
- Each parses `process.argv` with different argument schemas
- Need type safety for argument parsing and validation

**Options Considered:**

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| **A: Interface per CLI** | Explicit, self-documenting, type-safe | Slightly more code | ✅ Chosen |
| B: Generic `CLIArgs` type | Reusable | Too abstract, loses specific validation | ❌ Rejected |
| C: No explicit types | Less code | Loses type safety, harder to maintain | ❌ Rejected |

**Rationale:**
- Each CLI has unique argument structure
- Type safety catches argument parsing bugs at compile time
- Self-documenting: interface shows expected arguments
- Enables IDE autocomplete for argument validation

**Implementation:**
```typescript
// memory/generate-context.ts
interface GenerateContextArgs {
  specFolderPath: string;
  mode?: 'full' | 'incremental';
  force?: boolean;
}

function parseArgs(args: string[]): GenerateContextArgs {
  // Parse logic with type-safe return
}

async function main(args: string[]): Promise<void> {
  const parsed = parseArgs(args);
  // parsed.specFolderPath is typed as string
}
```

**Status:** Decided
**Date:** 2026-02-07

---

### D-P6-05: Error Handling in Workflow Pipeline

**Decision:** Use typed error objects with discriminated unions for workflow stage errors.

**Context:**
- `core/workflow.ts` orchestrates 12 pipeline stages
- Each stage can fail independently
- Need to track which stage failed and why, with partial completion support

**Options Considered:**

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| **A: Discriminated union of errors** | Type-safe, pattern matching, explicit handling | More upfront design | ✅ Chosen |
| B: Generic `Error` class | Simple | Loses context, hard to handle specific failures | ❌ Rejected |
| C: Separate exception per stage | Very explicit | 12 exception classes, overkill | ❌ Rejected |

**Rationale:**
- TypeScript discriminated unions enable exhaustive error handling
- Each stage error has stage-specific metadata
- Enables partial completion tracking (e.g., "7 of 12 stages succeeded")
- Better error reporting to user

**Implementation:**
```typescript
// core/workflow.ts
type WorkflowStage =
  | 'load-config'
  | 'detect-folder'
  | 'validate-alignment'
  | 'load-data'
  | 'extract-session'
  | 'extract-decisions'
  | 'extract-diagrams'
  | 'generate-anchors'
  | 'filter-content'
  | 'render-template'
  | 'validate-output'
  | 'write-file';

interface WorkflowError {
  stage: WorkflowStage;
  message: string;
  cause?: Error;
  recoverable: boolean;
}

interface WorkflowResult {
  success: boolean;
  completedStages: WorkflowStage[];
  output?: string;
  errors: WorkflowError[];
}
```

**Status:** Decided
**Date:** 2026-02-07

---

### D-P6-06: Template Renderer Typing Approach

**Decision:** Use `Record<string, unknown>` for template context with runtime validation.

**Context:**
- `renderers/template-renderer.ts` implements Mustache-like templating
- Context objects have dynamic structure (depends on template variables)
- Need balance between type safety and flexibility

**Options Considered:**

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| **A: `Record<string, unknown>` + runtime validation** | Flexible, catches errors at render time, type-safe access | Less compile-time safety | ✅ Chosen |
| B: Generic `TemplateContext<T>` | Full type safety | Requires predefined schema for every template, inflexible | ❌ Rejected |
| C: `any` for context | Maximum flexibility | Loses all type safety | ❌ Rejected |

**Rationale:**
- Templates are user-defined (no fixed schema)
- Runtime validation is necessary anyway (missing variables, type mismatches)
- `unknown` forces type guards before access (safer than `any`)
- Compiled output identical to original JS behavior

**Implementation:**
```typescript
// renderers/template-renderer.ts
type TemplateContext = Record<string, unknown>;

function render(template: string, context: TemplateContext): string {
  // Runtime validation:
  // - Check required variables exist
  // - Check types are compatible with operations (array for loops, etc.)
  return processedTemplate;
}
```

**Status:** Decided
**Date:** 2026-02-07

---

### D-P6-07: Extractor Error Handling in Orchestrator

**Decision:** Fail-fast on critical extractors, continue on optional extractors.

**Context:**
- `extractors/collect-session-data.ts` orchestrates 7 extractors
- Some extractors are critical (session metadata), others optional (diagrams)
- Need to define failure behavior

**Options Considered:**

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| **A: Critical vs optional classification** | Balances completeness and robustness | Requires classification decision for each extractor | ✅ Chosen |
| B: Fail-fast on any error | Simple, no partial results | Single extractor failure aborts entire process | ❌ Rejected |
| C: Continue on all errors | Maximum robustness | May produce incomplete/invalid output | ❌ Rejected |

**Rationale:**
- Some extractors are essential (session metadata, conversation)
- Others enhance output but aren't required (diagrams, OpenCode refs)
- Partial completion with warnings is better than full abort for optional failures

**Implementation:**
```typescript
// extractors/collect-session-data.ts
const CRITICAL_EXTRACTORS = [
  'conversation',
  'session',
  'file-changes',
] as const;

const OPTIONAL_EXTRACTORS = [
  'decisions',
  'diagrams',
  'opencode-refs',
  'implementation-guide',
] as const;

async function collectSessionData(specFolder: string): Promise<SessionData> {
  const results = {};
  const warnings = [];

  // Critical extractors: throw on failure
  for (const extractor of CRITICAL_EXTRACTORS) {
    results[extractor] = await runExtractor(extractor, specFolder);
  }

  // Optional extractors: log warning, continue
  for (const extractor of OPTIONAL_EXTRACTORS) {
    try {
      results[extractor] = await runExtractor(extractor, specFolder);
    } catch (err) {
      warnings.push(`Optional extractor ${extractor} failed: ${err.message}`);
    }
  }

  return { ...results, warnings };
}
```

**Status:** Decided
**Date:** 2026-02-07

---

## Implementation Notes

### Verification Checklist

Each decision has associated verification steps in `checklist.md`:

| Decision | Checklist Items |
|----------|----------------|
| D-P6-01 | CHK-143 (lazy require() elimination) |
| D-P6-02 | CHK-124, CHK-158 (re-export proxies) |
| D-P6-03 | CHK-138, CHK-157 (snake_case aliases) |
| D-P6-04 | CHK-146, CHK-147, CHK-148 (CLI argument typing) |
| D-P6-05 | CHK-142 (workflow error handling) |
| D-P6-06 | CHK-127 (template renderer typing) |
| D-P6-07 | CHK-134 (extractor orchestration) |

---

## Alternatives Rejected (Summary)

| Alternative | Why Rejected |
|-------------|--------------|
| Dynamic `import()` syntax | Async complexity, loses type inference |
| Named re-exports for proxies | Maintenance burden, updates on every upstream change |
| Drop snake_case aliases | Breaks backward compatibility (P0 concern) |
| Generic CLI args type | Too abstract, loses validation specificity |
| Generic `Error` for workflow | Loses stage context, harder to recover |
| Generic template context with schema | Inflexible, templates are user-defined |
| Fail-fast on all extractors | Single failure aborts process, too fragile |
| Continue on all extractor errors | May produce invalid output silently |

---

## Cross-References

- **Parent Decision Record:** `092-javascript-to-typescript/decision-record.md` (D1–D8)
- **Phase 6 Plan:** `phase-7-convert-scripts/plan.md`
- **Phase 6 Tasks:** `phase-7-convert-scripts/tasks.md`
- **Phase 6 Checklist:** `phase-7-convert-scripts/checklist.md`
- **Parent Spec:** `092-javascript-to-typescript/spec.md`

---

## Timeline

| Date | Decision | Status |
|------|----------|--------|
| 2026-02-07 | D-P6-01: Lazy require() → Static import | Decided |
| 2026-02-07 | D-P6-02: Re-export proxy strategy | Decided |
| 2026-02-07 | D-P6-03: Snake_case alias preservation | Decided |
| 2026-02-07 | D-P6-04: CLI argument typing | Decided |
| 2026-02-07 | D-P6-05: Workflow error handling | Decided |
| 2026-02-07 | D-P6-06: Template renderer typing | Decided |
| 2026-02-07 | D-P6-07: Extractor error handling | Decided |

---

**Status:** All Phase 6-specific decisions recorded and ready for implementation.
