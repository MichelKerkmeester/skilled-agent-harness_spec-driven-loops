# Tasks: Phase 0 — TypeScript Standards in workflows-code--opencode

> **Parent Spec:** `specs/003-memory-and-spec-kit/092-javascript-to-typescript/`
> **Phase:** 0
> **Workstream:** W-A (Standards Agent)
> **Created:** 2026-02-07

---

## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format:**
```
T### [W-X] [P?] Description (file path) [effort] {deps: T###}
```

---

## Phase 0: TypeScript Standards (workflows-code--opencode)

> **Goal:** Establish TypeScript coding standards before any conversion begins.
> **Workstream:** W-A
> **Effort:** ~3,000 new lines across 9 files

### New Reference Files

- [ ] T001 [W-A] Create TypeScript style guide (`references/typescript/style_guide.md`) [2h]
  - File headers, naming (PascalCase interfaces/types/enums, camelCase functions), formatting, section organization with TYPE DEFINITIONS
  - Import ordering: Node built-ins → third-party → local modules → type-only imports
  - TypeScript-specific formatting: type annotation placement, multiline type definitions
  - `strict` mode in tsconfig as equivalent of `'use strict'`

- [ ] T002 [W-A] Create TypeScript quality standards (`references/typescript/quality_standards.md`) [2h] {deps: T001}
  - `interface` vs `type` decision guide (interfaces for object shapes, types for unions/intersections)
  - `unknown` over `any` policy, generic constraints
  - Strict null checks, discriminated unions for state management
  - Utility types: `Partial<T>`, `Required<T>`, `Pick<T,K>`, `Omit<T,K>`, `Record<K,V>`, `Readonly<T>`
  - Return type annotations: explicit for public API, inferred for private helpers
  - TSDoc format (`@param`, `@returns`, `@throws`, `@typeParam`)
  - Typed error classes, async patterns with typed Promises
  - `tsconfig.json` baseline settings for OpenCode projects

- [ ] T003 [W-A] Create TypeScript quick reference (`references/typescript/quick_reference.md`) [1h] {deps: T001, T002}
  - Complete TS file template (copy-paste ready)
  - Naming cheat sheet (extending JS table with Interface, Type, Enum, Generic rows)
  - Type annotation patterns quick lookup
  - Common utility type patterns
  - Import/export template (ES module syntax for source)
  - Error handling patterns with typed catches

- [ ] T004 [W-A] Create TypeScript checklist (`assets/checklists/typescript_checklist.md`) [1h] {deps: T001, T002}
  - P0: File header present, no `any` in public API, PascalCase types/interfaces, no commented-out code
  - P1: Explicit return types on public functions, interfaces for all data shapes, strict mode enabled, no non-null assertions without justification, TSDoc on public API
  - P2: Utility types used where appropriate, discriminated unions for complex state, type-only imports separated, generic constraints where applicable

### Existing File Updates

- [ ] T005 [W-A] Update SKILL.md language detection + resource router [1h] {deps: T001}
  - Remove "TypeScript (not currently used in OpenCode)" exclusion (line 48)
  - Add TypeScript to keyword triggers table (lines 35-38): `typescript, ts, tsx, interface, type, tsconfig, tsc, strict`
  - Add TypeScript to FILE_EXTENSIONS mapping (lines 77-89): `.ts`, `.tsx`, `.mts`, `.d.ts`
  - Add TYPESCRIPT resource router block (lines 94-148)
  - Add TypeScript use case router table (lines 150-161)
  - Update naming matrix (lines 469-476) with TypeScript column
  - Add TypeScript file header template to quick reference section

- [ ] T006 [W-A] [P] Update universal_patterns.md (`references/shared/universal_patterns.md`) [30m] {deps: T001}
  - Add TypeScript examples alongside JavaScript in naming section (lines 46-65)
  - Add TypeScript to language list in overview (line 16)

- [ ] T007 [W-A] [P] Update code_organization.md (`references/shared/code_organization.md`) [30m] {deps: T001}
  - Add TypeScript import ordering section (ES modules with `import type`)
  - Add TypeScript export patterns (`export`, `export default`, `export type`)
  - Add `.test.ts` to test naming conventions (line 401)
  - Add TypeScript file structure example

- [ ] T008 [W-A] [P] Update universal_checklist.md (`assets/checklists/universal_checklist.md`) [15m] {deps: T004}
  - Add TypeScript to naming conventions row in P1 section
  - Add `tsc --noEmit` to validation workflow

- [ ] T009 [W-A] Update CHANGELOG.md [15m] {deps: T001-T008}
  - Version entry for TypeScript standard additions

---

## Completion Criteria

- [ ] All 4 new TypeScript reference files created with complete content
- [ ] All 5 existing files updated with TypeScript additions
- [ ] No "TypeScript not used" language in SKILL.md
- [ ] TypeScript appears in all relevant skill routing tables
- [ ] All standards are self-consistent
- [ ] CHANGELOG.md entry added

**Sync Point:** `>>> SYNC-001: Phase 0 complete — TypeScript standards established. All agents use these conventions. <<<`

---

## Agent Allocation

From parent plan.md §4 "Agent Allocation — Session 1":

| Agent | Task | Est. files |
|-------|------|-----------|
| Agent 1 | T001 + T002 (style_guide.md + quality_standards.md) | 2 new |
| Agent 2 | T003 + T004 (quick_reference.md + checklist.md) | 2 new |
| Agent 3 | T005 + T006 + T007 + T008 (SKILL.md + shared refs) | 3 updates + 2 universal updates |

**Parallelization:** Agents 1 and 2 can work simultaneously on new files. Agent 3 depends on Agent 1 completing T001 (style_guide.md).

---

## Cross-References

- **Phase Plan**: See `plan.md`
- **Phase Checklist**: See `checklist.md`
- **Parent Tasks**: See `../tasks.md` (full migration tasks T001–T320)
- **Parent Decisions**: See `../decision-record.md` (D5: Interface Naming, D6: Standards Before Migration)
