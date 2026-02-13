# Verification Checklist: Phase 0 — TypeScript Standards

> **Parent Spec:** `specs/003-memory-and-spec-kit/092-javascript-to-typescript/`
> **Phase:** 0
> **Workstream:** W-A (Standards Agent)
> **Created:** 2026-02-07

---

## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval to defer |
| **[P2]** | Optional | Can defer with documented reason |

**Evidence format:** When marking `[x]`, provide evidence on the next line:
```
- [x] CHK-NNN [Px] Description
  - **Evidence**: [compilation output / test result / file existence / screenshot]
```

---

## Phase 0: TypeScript Standards Verification

### Standards Creation

- [ ] CHK-010 [P0] `references/typescript/style_guide.md` created with all required sections
  - **Evidence**:
  - File headers, naming conventions (PascalCase interfaces/types/enums, camelCase functions)
  - Import ordering (built-in → third-party → local → type-only)
  - Formatting rules (2-space indent, semicolons, single quotes)
  - TypeScript-specific section organization (TYPE DEFINITIONS section)

- [ ] CHK-011 [P0] `references/typescript/quality_standards.md` created with all required sections
  - **Evidence**:
  - `interface` vs `type` decision guide documented
  - `unknown` over `any` policy stated
  - Strict null checks, discriminated unions documented
  - Utility types catalog included
  - TSDoc format requirements specified
  - `tsconfig.json` baseline settings defined

- [ ] CHK-012 [P1] `references/typescript/quick_reference.md` created with templates
  - **Evidence**:
  - Complete TS file template (copy-paste ready)
  - Naming cheat sheet with Interface/Type/Enum/Generic rows
  - Error handling pattern template

- [ ] CHK-013 [P1] `assets/checklists/typescript_checklist.md` created with P0/P1/P2 tiers
  - **Evidence**:
  - P0 items: no `any` in public API, PascalCase types, file header
  - P1 items: explicit return types, interfaces for data shapes, strict mode
  - P2 items: utility types, discriminated unions, type-only imports

### Standards Integration

- [ ] CHK-014 [P0] SKILL.md updated: TypeScript added to language detection algorithm
  - **Evidence**:
  - "TypeScript (not currently used)" exclusion REMOVED
  - TypeScript keywords added to LANGUAGE_KEYWORDS
  - `.ts`, `.tsx`, `.mts`, `.d.ts` added to FILE_EXTENSIONS
  - TypeScript resource router block added
  - TypeScript use case router table added

- [ ] CHK-015 [P1] `universal_patterns.md` updated with TypeScript naming examples
  - **Evidence**:

- [ ] CHK-016 [P1] `code_organization.md` updated with TypeScript patterns
  - **Evidence**:
  - ES module import ordering with `import type`
  - TypeScript export patterns documented
  - `.test.ts` naming convention added

- [ ] CHK-017 [P1] `universal_checklist.md` updated with TypeScript validation
  - **Evidence**:
  - `tsc --noEmit` added to validation workflow
  - TypeScript naming conventions added

- [ ] CHK-018 [P2] `workflows-code--opencode/CHANGELOG.md` updated
  - **Evidence**:

### Standards Quality Gate

- [ ] CHK-019 [P0] All 4 new TypeScript reference files pass structural review
  - **Evidence**:
  - Style guide covers: naming, formatting, imports, sections
  - Quality standards covers: types, interfaces, enums, generics, errors
  - Quick reference has: templates, cheat sheets, patterns
  - Checklist has: P0/P1/P2 tiers with validation items

- [ ] CHK-020 [P0] No contradictions between TS standards and existing JS standards
  - **Evidence**:
  - Naming conventions compatible (camelCase functions, UPPER_SNAKE constants)
  - File header format consistent
  - Import ordering extends JS pattern (adds type-only group)

---

## Key Standards Verification

### Naming Conventions (from D5)

- [ ] CHK-021 [P0] Interface naming convention documented: PascalCase, no `I` prefix (exception: `IEmbeddingProvider`, `IVectorStore`)
  - **Evidence**:

- [ ] CHK-022 [P0] Type alias naming convention documented: PascalCase
  - **Evidence**:

- [ ] CHK-023 [P0] Enum naming convention documented: PascalCase name and members
  - **Evidence**:

- [ ] CHK-024 [P0] Function naming convention documented: camelCase (consistent with JS)
  - **Evidence**:

- [ ] CHK-025 [P0] Constant naming convention documented: UPPER_SNAKE_CASE (consistent with JS)
  - **Evidence**:

### Import Ordering

- [ ] CHK-026 [P0] Import ordering documented: built-ins → third-party → local → type-only
  - **Evidence**:

- [ ] CHK-027 [P1] Type-only imports documented as separate group
  - **Evidence**:

### File Structure

- [ ] CHK-028 [P0] TYPE DEFINITIONS section documented as new section between header and implementation
  - **Evidence**:

- [ ] CHK-029 [P1] Complete file template provided with all sections
  - **Evidence**:

### Type System

- [ ] CHK-030 [P0] `interface` vs `type` decision guide documented
  - **Evidence**:
  - Interfaces for object shapes
  - Types for unions, intersections, primitives

- [ ] CHK-031 [P0] `unknown` over `any` policy documented
  - **Evidence**:

- [ ] CHK-032 [P0] Strict mode requirement documented (from D3)
  - **Evidence**:

- [ ] CHK-033 [P1] Utility types catalog documented: `Partial`, `Required`, `Pick`, `Omit`, `Record`, `Readonly`
  - **Evidence**:

- [ ] CHK-034 [P1] Discriminated unions pattern documented
  - **Evidence**:

### TSDoc

- [ ] CHK-035 [P1] TSDoc format documented: `@param`, `@returns`, `@throws`, `@typeParam`
  - **Evidence**:

---

## Verification Summary

| Category | Total | Verified | Priority Breakdown |
|----------|------:|--------:|-------------------|
| Standards Creation | 4 | /4 | 2 P0, 2 P1 |
| Standards Integration | 5 | /5 | 2 P0, 3 P1, 1 P2 |
| Standards Quality Gate | 2 | /2 | 2 P0 |
| Key Standards | 15 | /15 | 10 P0, 5 P1 |
| **TOTAL** | **26** | **/26** | **14 P0, 10 P1, 1 P2** |

**Verification Date**: ________________

---

## Completion Signal

When all P0 items are verified, the phase is complete:

`>>> SYNC-001: Phase 0 complete — TypeScript standards established. All agents use these conventions. <<<`

---

## Cross-References

- **Phase Plan**: See `plan.md`
- **Phase Tasks**: See `tasks.md` (T001–T009)
- **Parent Checklist**: See `../checklist.md` (CHK-010–CHK-020, full migration)
- **Decision Record**: See `../decision-record.md` (D5: Interface Naming, D6: Standards Before Migration)
