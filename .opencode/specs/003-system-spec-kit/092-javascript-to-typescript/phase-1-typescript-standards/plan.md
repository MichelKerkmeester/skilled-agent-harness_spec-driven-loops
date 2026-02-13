# Plan: Phase 0 — TypeScript Standards in workflows-code--opencode

> **Parent Spec:** `specs/003-memory-and-spec-kit/092-javascript-to-typescript/`
> **Phase:** 0
> **Workstream:** W-A (Standards Agent)
> **Level:** 3+
> **Status:** Planning
> **Created:** 2026-02-07

---

## 1. Overview

**Goal:** Establish TypeScript coding standards BEFORE any conversion begins.

**Why first:** The conversion must follow consistent conventions. Without documented standards, each agent or session might make different choices for interface naming, type placement, import ordering, etc.

**Effort:** ~3,000 new lines across 9 files (4 new, 5 updates)

**Dependencies:** None — Phase 0 is the foundation for all subsequent phases

**Rationale (D6: Standards Before Migration):**
- Up to 10 agents may work in parallel — without documented standards, each makes different choices
- Interface naming, import ordering, type annotation style must be consistent
- The skill's "TypeScript not used" exclusion must be removed to avoid confusion

---

## 2. Implementation Approach

### Standards Creation Strategy

Create comprehensive TypeScript documentation within `workflows-code--opencode` skill following its existing documentation patterns:

1. **Style guide** — Naming, formatting, import ordering, section organization
2. **Quality standards** — Type decisions, strict mode, utility types, TSDoc
3. **Quick reference** — Templates and cheat sheets for rapid lookup
4. **Checklist** — P0/P1/P2 validation items for TypeScript files

### Integration Strategy

Update existing skill files to recognize TypeScript as a first-class language:

1. **SKILL.md** — Add TypeScript to language detection algorithm, resource router, use cases
2. **Universal patterns** — Add TypeScript examples alongside JavaScript
3. **Code organization** — Add TypeScript import/export patterns
4. **Universal checklist** — Add TypeScript validation steps

---

## 3. File Creation Order

### New Files (4)

| # | File | Content | Est. Lines | Dependencies |
|---|------|---------|--------:|--------------|
| 1 | `references/typescript/style_guide.md` | File headers, naming (PascalCase interfaces/types/enums, camelCase functions), formatting, import ordering (type-only imports separated), section organization (TYPE DEFINITIONS section added) | ~350 | — |
| 2 | `references/typescript/quality_standards.md` | `interface` vs `type` decisions, `unknown` over `any`, strict null checks, discriminated unions, utility types, TSDoc format, typed error classes, async patterns with typed Promises, tsconfig baseline | ~400 | File 1 |
| 3 | `references/typescript/quick_reference.md` | Complete TS file template, naming cheat sheet, type annotation patterns, import/export template, error handling patterns, tsconfig settings | ~250 | Files 1, 2 |
| 4 | `assets/checklists/typescript_checklist.md` | P0: no `any` in public API, PascalCase types, file header. P1: explicit return types on public functions, interfaces for all data shapes, strict mode. P2: utility types, discriminated unions, type-only imports | ~150 | Files 1, 2 |

**Total new content:** ~1,150 lines

### Files to Update (5)

| # | File | Changes | Est. Lines |
|---|------|---------|--------:|
| 5 | `SKILL.md` | Add TypeScript to language detection, resource router, use case router, naming matrix. Remove "TypeScript not used" exclusion. Add TS keyword triggers. | ~40 changes |
| 6 | `references/shared/universal_patterns.md` | Add TypeScript examples alongside JavaScript in naming section | ~20 additions |
| 7 | `references/shared/code_organization.md` | Add TypeScript import ordering, export patterns, `.test.ts` naming | ~30 additions |
| 8 | `assets/checklists/universal_checklist.md` | Add TypeScript to naming conventions, add `tsc --noEmit` to validation | ~10 additions |
| 9 | `CHANGELOG.md` | Version entry for TypeScript additions | ~20 additions |

**Total updated content:** ~120 additions

---

## 4. Key Standards to Document

### Naming Conventions

| Construct | Convention | Example |
|-----------|-----------|---------|
| Interface | PascalCase (no `I` prefix) | `EmbeddingProvider`, `VectorStore` |
| Type alias | PascalCase | `SearchResult`, `MemoryRecord` |
| Enum | PascalCase name, PascalCase members | `enum ErrorCode { NotFound, Timeout }` |
| Generic parameter | Single uppercase or `T`-prefixed | `<T>`, `<TResult>` |
| Function | camelCase | `calculateDecayScore()` |
| Constant | UPPER_SNAKE_CASE | `MAX_QUERY_LENGTH` |
| File name | kebab-case (unchanged from JS) | `vector-index.ts` |
| Type-only import | Separate line | `import type { Config } from './config';` |

**Exception (D5):** Keep `I` prefix for existing `IEmbeddingProvider` and `IVectorStore` — document this exception in the style guide.

### Type vs Interface Decision Guide

```typescript
// Use interface for object shapes
interface SearchResult {
  id: string;
  score: number;
}

// Use type for unions, intersections, primitives
type Status = 'pending' | 'complete' | 'failed';
type Result<T> = { success: true; data: T } | { success: false; error: string };
```

### Import Ordering

```typescript
// 1. Node built-ins
import path from 'path';
import fs from 'fs/promises';

// 2. Third-party
import Database from 'better-sqlite3';

// 3. Local modules
import { calculateScore } from './scoring';

// 4. Type-only imports (separated)
import type { Config } from './config';
import type { MemoryRecord } from './types';
```

### File Structure (TYPE DEFINITIONS section)

```typescript
/**
 * Brief file description
 *
 * @file Module purpose
 */

// =====================================================================
// TYPE DEFINITIONS
// =====================================================================

interface SearchOptions {
  limit?: number;
  threshold?: number;
}

type ResultStatus = 'success' | 'error';

// =====================================================================
// IMPLEMENTATION
// =====================================================================

export function search(query: string, options?: SearchOptions): SearchResult[] {
  // ...
}
```

### Strict Mode (D3: Strict Mode Enabled from Start)

All tsconfig files use `"strict": true` from the start. No incremental strictness — catch errors early.

---

## 5. Quality Gates

### Standards Completeness

- [ ] Style guide covers: naming, formatting, imports, sections
- [ ] Quality standards covers: types, interfaces, enums, generics, errors
- [ ] Quick reference has: templates, cheat sheets, patterns
- [ ] Checklist has: P0/P1/P2 tiers with validation items

### Integration Completeness

- [ ] TypeScript added to SKILL.md language detection algorithm
- [ ] TypeScript keyword triggers added to SKILL.md
- [ ] TypeScript resource router block added to SKILL.md
- [ ] TypeScript use case router added to SKILL.md
- [ ] TypeScript examples added to universal_patterns.md
- [ ] TypeScript patterns added to code_organization.md
- [ ] TypeScript validation added to universal_checklist.md

### Consistency Check

- [ ] No contradictions between TS standards and existing JS standards
- [ ] Naming conventions compatible (camelCase functions, UPPER_SNAKE constants)
- [ ] File header format consistent
- [ ] Import ordering extends JS pattern (adds type-only group)

---

## 6. Agent Allocation (Session 1)

From parent plan.md §4 "Agent Allocation — Session 1":

| Agent | Task | Est. files |
|-------|------|-----------|
| Agent 1 | Phase 0: TS style_guide.md + quality_standards.md | 2 new |
| Agent 2 | Phase 0: TS quick_reference.md + checklist.md | 2 new |
| Agent 3 | Phase 0: Update SKILL.md + shared refs | 3 updates |

**Parallelization:** Agents 1 and 2 can work simultaneously on new files. Agent 3 depends on Agent 1 completing style_guide.md.

---

## 7. Success Criteria

- [ ] All 4 new TypeScript reference files created with complete content
- [ ] All 5 existing files updated with TypeScript additions
- [ ] No "TypeScript not used" language in SKILL.md
- [ ] TypeScript appears in all relevant skill routing tables
- [ ] All standards are self-consistent
- [ ] CHANGELOG.md entry added

**Completion signal:** `>>> SYNC-001: Phase 0 complete — TypeScript standards established. All agents use these conventions. <<<`

---

## 8. Risk Mitigations

| Risk | Mitigation |
|------|-----------|
| Standards contradict existing JS patterns | Review existing universal_patterns.md before writing TS standards |
| Missing standard causes agent inconsistency | Comprehensive review: all TypeScript constructs covered (interfaces, types, enums, generics, errors, async) |
| SKILL.md updates break existing routing | Test language detection with sample prompts after updates |

---

## 9. Cross-References

- **Parent Specification**: `../spec.md`
- **Parent Plan**: `../plan.md`
- **Parent Tasks**: `../tasks.md` (T001–T009)
- **Parent Checklist**: `../checklist.md` (CHK-010–CHK-020)
- **Decision Record**: `../decision-record.md` (D5: Interface Naming, D6: Standards Before Migration)

---

## 10. Next Phase

After Phase 0 completion (SYNC-001), Phase 1 (Infrastructure Setup) can begin. Phase 1 installs TypeScript dependencies, creates tsconfig files, and prepares the build pipeline.
