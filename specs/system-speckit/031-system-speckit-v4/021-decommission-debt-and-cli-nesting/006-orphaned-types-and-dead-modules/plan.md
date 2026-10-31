---
title: "Implementation Plan: Phase 6: orphaned-types-and-dead-modules"
description: "Grep-prove and delete or re-home six named dead-code items, wire two orphaned tests into a real vitest include glob or delete them, log or reason the empty catch, and dedupe the link-checker's roots - typecheck before and after."
trigger_phrases:
  - "orphaned types cleanup plan"
  - "seven orphaned type exports"
  - "two orphaned runtime modules"
  - "test files never run"
  - "empty catch reason or log"
  - "link checker roots dedupe"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 6: orphaned-types-and-dead-modules

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, CommonJS (`check-markdown-links.cjs`) |
| **Framework** | None - a types module, two runtime modules, two test files, a validator module, a link checker |
| **Storage** | None |
| **Testing** | `tsc --noEmit` (or the workspace's typecheck script) plus Vitest for the touched/moved suites |

### Overview
Six independent, low-coupling cleanups: delete or re-home seven orphaned type exports and two orphaned runtime modules (each proven dead by `rg`), fix two test files that silently never run, add a reason or a log to one empty catch, and deduplicate one script's root list. Each item is independently revertible.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Typecheck and touched suites passing
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Grep-prove-then-delete, repeated six times independently; no shared abstraction links these items beyond "confirmed dead or dormant during the decommission review."

### Key Components
- **`shared/types.ts` orphan removal**: delete the seven symbols; if `shared/index.ts` re-exports them individually (rather than via `export *`), remove those re-export lines too.
- **`rollout-policy.ts`/`repair.ts` removal or keep-decision**: delete the module and its dedicated test file(s) together, or add a one-line comment at the module's top stating why it stays despite having no production caller.
- **Orphaned-test repair**: for each of the two files, either move it (directory and/or extension) so an existing `include` glob matches, or add its actual path to the relevant `vitest.config.ts`'s `include` array, or delete it.
- **`alignment-validator.ts` catch fix**: replace the empty `if (error instanceof Error) { /* comment */ }` with either a `console.warn`/logger call carrying `error.message`, or a comment explaining why the specific failure mode is safe to ignore silently (e.g., "alternatives are advisory only; a read failure here must not block the flow it advises on").
- **`check-markdown-links.cjs` dedup**: rewrite `ROOTS` to list `.opencode/agents` and `.opencode/commands` once each; verify the printed counts drop to the deduplicated file count.

### Data Flow
Not applicable in the traditional sense - each item is a standalone edit verified by `rg` (before) and typecheck/test run (after), not a pipeline.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|---------------|
| `shared/types.ts` (7 symbols) | Declared, unused outside the module and its barrel | delete (default) or keep-with-reason | `rg -n "<symbol>" .opencode/skills/system-spec-kit --glob '*.ts'` zero hits outside `types.ts`/`index.ts` |
| `runtime/lib/cognitive/rollout-policy.ts` | No production caller, one dedicated test | delete (default) or keep-with-reason | `rg -n "rollout-policy" .opencode/skills/system-spec-kit/runtime --glob '*.ts'` |
| `runtime/lib/description/repair.ts` | No production caller, three test consumers | delete (default) or keep-with-reason | `rg -n "description/repair" .opencode/skills/system-spec-kit/runtime --glob '*.ts'` |
| `scripts/lib/completion-state.test.mjs` | Outside every include glob (wrong dir + extension) | move or delete | Appears in a `vitest run` file list, or confirmed absent |
| `runtime/scripts/tests/resource-map-extractor.vitest.ts` | Outside every include glob (wrong dir) | move or delete | Same as above |
| `alignment-validator.ts:582-586` | Empty catch, silent | add log or reason comment | Manual code review; no behavior change expected unless the underlying read failure was masking a real bug |
| `check-markdown-links.cjs:24-26` | `ROOTS` lists two dirs twice | dedupe | Before/after run comparing `files`/`checked`/`broken` counts |

Required inventories:
- Same-class producers: `rg -n "export interface IVectorStore|export interface SearchOptions|export interface SearchResult|export interface StoreStats|export interface Database|export interface DatabaseExtended|export interface PreparedStatement" .opencode/skills/system-spec-kit/shared/types.ts` - confirms these are the only declaration sites (no duplicate elsewhere).
- Consumers of changed symbols: `rg -n "IVectorStore|SearchOptions|SearchResult|StoreStats|DatabaseExtended|PreparedStatement|rollout-policy|description/repair" . --glob '*.ts' --glob '*.md'` run over the WHOLE repository (not just `.opencode/skills/system-spec-kit`), since a spec document or another skill could reference these names even if no code does.
- Matrix axes: item (7 types + 2 modules + 2 tests + 1 catch + 1 script) × outcome (delete / keep-with-reason / move / log-added) - one row per item in `implementation-summary.md`'s Key Decisions table once this phase executes.
- Algorithm invariant: not applicable - no parser/resolver logic changes; the only invariant is that every deletion is grep-proven zero-reference first.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Whichever tests survive the `rollout-policy.ts`/`repair.ts` decision; the two previously-orphaned tests once wired in | Vitest |
| Integration | Full `shared`, `scripts`, `runtime` typecheck before and after every deletion | `tsc --noEmit` per workspace |
| Manual | `check-markdown-links.cjs` before/after run, comparing `broken` list contents (not just counts) | `node check-markdown-links.cjs` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Each workspace's typecheck script (`shared`, `scripts`, `runtime`) | Internal | Green - already part of the existing gate set | Cannot prove REQ-005 without it |
| `vitest.config.ts` at both the skill root and `runtime/` | Internal | Green - both confirmed readable and their `include` globs known | The orphaned-test fix targets exactly these two files |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A deletion breaks typecheck or a test that was previously passing, or a re-enabled orphaned test fails and blocks the gate.
- **Procedure**: Each of the six items is an independent commit; revert only the offending one and re-run the gate, rather than reverting the whole phase.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (grep-prove every item) ──► Core (delete/re-home/fix each item independently) ──► Verify (typecheck + suites before/after)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Grep proofs already drafted in `spec.md`; re-confirming them is quick |
| Core Implementation | Low | Six small, independent edits |
| Verification | Med | Full typecheck of three workspaces plus the touched/moved test suites |
| **Total** | | **Half a session** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Baseline typecheck output captured for `shared`, `scripts`, `runtime`
- [x] Baseline `check-markdown-links.cjs` output (counts and broken list) captured
- [x] Baseline `vitest run` executed-file list captured, to confirm the two orphaned tests are indeed absent from it today

### Rollback Procedure
1. Revert the specific item's commit.
2. Re-run typecheck for the affected workspace(s).
3. Re-run the touched test suite and confirm the pre-change pass count.
4. No stakeholder notification needed - internal cleanup with no external contract.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
