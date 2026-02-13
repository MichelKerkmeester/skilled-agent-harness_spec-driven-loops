# Decision Record: Phase 0 — TypeScript Standards

> **Parent Spec:** `specs/003-memory-and-spec-kit/092-javascript-to-typescript/`
> **Phase:** 0
> **Created:** 2026-02-07

---

## Overview

This decision record documents the architectural decisions specific to Phase 0 (TypeScript Standards). For the full migration decision record, see `../decision-record.md`.

Phase 0 decisions establish the conventions that all subsequent phases must follow.

---

## D5: Interface Naming — Keep `I` Prefix on Existing

**Status:** Decided
**Date:** 2026-02-07
**Applies to:** Phase 0 standards creation, all subsequent phases

**Context:** The codebase has `IEmbeddingProvider` and `IVectorStore` with `I` prefix. Modern TypeScript convention omits the prefix.

**Decision:** Keep `I` prefix on these two existing interfaces. New interfaces omit it.

**Rationale:**
- These names are used across 10+ import sites and re-export aliases
- Renaming would be a separate scope item with its own risk
- Documenting the exception prevents confusion

**Alternatives rejected:**
- Remove prefix globally: Would change import names across the codebase — separate concern from JS→TS migration

**Standards documentation:**
- `references/typescript/style_guide.md` must document this exception
- `references/typescript/quick_reference.md` naming cheat sheet shows both patterns
- Comment: "Exception: `IEmbeddingProvider`, `IVectorStore` retain prefix for backward compatibility"

---

## D6: Standards Before Migration

**Status:** Decided
**Date:** 2026-02-07
**Applies to:** Phase 0 scope and sequencing

**Context:** Should we establish TypeScript conventions first, or let them emerge during migration?

**Decision:** Phase 0 creates full TypeScript standards in `workflows-code--opencode` before any code conversion.

**Rationale:**
- Up to 10 agents may work in parallel — without documented standards, each makes different choices
- Interface naming, import ordering, type annotation style must be consistent
- The skill's "TypeScript not used" exclusion must be removed to avoid confusion

**Alternatives rejected:**
- Emerge standards during migration: Risk of inconsistent parallel agents, rework needed when inconsistencies discovered
- Minimal standards upfront: Partial standards lead to gaps and ambiguity

**Implementation:**
1. Create 4 comprehensive reference files before any `.ts` files exist
2. Update skill routing to recognize TypeScript before any conversions
3. Define all naming, formatting, and quality conventions upfront
4. Establish P0/P1/P2 validation tiers for TypeScript files

**Success criteria:**
- All 4 reference files complete and self-consistent
- No contradictions with existing JavaScript standards
- SKILL.md fully updated to route TypeScript queries
- SYNC-001 checkpoint passed before Phase 1 begins

---

## Standards Scope

Phase 0 standards cover:

### Naming Conventions
- Interfaces: `PascalCase` (no `I` prefix, except exceptions)
- Types: `PascalCase`
- Enums: `PascalCase` name and members
- Generics: `<T>` or `<TResult>`
- Functions: `camelCase` (consistent with JS)
- Constants: `UPPER_SNAKE_CASE` (consistent with JS)
- Files: `kebab-case.ts` (consistent with JS)

### Import Ordering
1. Node built-ins
2. Third-party packages
3. Local modules
4. Type-only imports (separated)

### File Structure
```
File header comment
TYPE DEFINITIONS section (new for TypeScript)
IMPLEMENTATION section
```

### Type System
- `interface` for object shapes
- `type` for unions, intersections, primitives
- `unknown` over `any` (policy)
- Strict mode: `"strict": true` (from D3)
- Utility types: `Partial`, `Required`, `Pick`, `Omit`, `Record`, `Readonly`
- Discriminated unions for state management
- Generic constraints where applicable

### Documentation
- TSDoc format: `@param`, `@returns`, `@throws`, `@typeParam`
- Explicit return types on public API functions
- Type-only imports use `import type` syntax

---

## Cross-References

- **Parent Decision Record**: See `../decision-record.md` (D1–D8, full migration)
- **Phase Plan**: See `plan.md`
- **Phase Tasks**: See `tasks.md` (T001–T009)
- **Phase Checklist**: See `checklist.md` (CHK-010–CHK-035)

---

## Revision History

| Date | Change | Author |
|------|--------|--------|
| 2026-02-07 | Initial creation — D5 and D6 extracted from parent decision record | Migration planning |
