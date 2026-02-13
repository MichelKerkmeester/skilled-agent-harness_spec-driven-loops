# Phase 0: TypeScript Standards (workflows-code--opencode)

> **Parent Spec:** `092-javascript-to-typescript/`
> **Workstream:** W-A
> **Tasks:** T001–T009
> **Milestone:** M1 (Standards Ready)
> **SYNC Gate:** SYNC-001
> **Depends On:** None
> **Session:** 1

---

## Goal

Establish TypeScript coding standards in `workflows-code--opencode` BEFORE any code conversion begins. Without documented standards, parallel agents make inconsistent choices.

## Scope

**Target:** `.opencode/skill/workflows-code--opencode/`

### New Files (4)

| File | Content | Est. Lines |
|------|---------|--------:|
| `references/typescript/style_guide.md` | File headers, naming conventions, formatting, import ordering | ~350 |
| `references/typescript/quality_standards.md` | `interface` vs `type`, `unknown` over `any`, strict null checks, TSDoc, tsconfig baseline | ~400 |
| `references/typescript/quick_reference.md` | Complete TS file template, naming cheat sheet, annotation patterns | ~250 |
| `assets/checklists/typescript_checklist.md` | P0/P1/P2 quality gates for TypeScript code | ~150 |

### Updates (5)

| File | Changes |
|------|---------|
| `SKILL.md` | Add TypeScript to language detection, remove "not used" exclusion, add TS keyword triggers |
| `references/shared/universal_patterns.md` | Add TypeScript examples alongside JavaScript in naming section |
| `references/shared/code_organization.md` | Add TypeScript import ordering, export patterns, `.test.ts` naming |
| `assets/checklists/universal_checklist.md` | Add TypeScript to naming conventions, add `tsc --noEmit` validation |
| `CHANGELOG.md` | Version entry for TypeScript additions |

## Exit Criteria

- [ ] All 4 new reference files created and internally consistent
- [ ] All 5 existing files updated
- [ ] No contradictions between new TS standards and existing JS standards
- [ ] SYNC-001 gate passed
