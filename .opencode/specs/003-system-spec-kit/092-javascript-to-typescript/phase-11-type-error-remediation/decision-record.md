# Decision Record: Phase 10 — Type Error Remediation

> **Parent Spec:** 092-javascript-to-typescript/

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record-core + level3plus-govern | v2.0 -->

---

## Decision Inheritance

Phase 10 inherits all architectural decisions from the parent spec:

**From `092-javascript-to-typescript/decision-record.md`:**
- **D1**: CommonJS output (not ESM)
- **D2**: In-place compilation (no `dist/`)
- **D3**: `strict: true` from start
- **D4**: Move files to break circular deps
- **D5**: Keep `I` prefix on existing interfaces
- **D6**: Phase 0 standards first
- **D7**: Central `shared/types.ts`

---

## New Decisions for Phase 10

### D10-1: Type Assertions Over API Refactoring

**Context:** 253 errors in `provider-chain.test.ts` stem from API surface changes during Phase 5. Two approaches: (a) refactor the test to match the new API, or (b) add type assertions to suppress errors.

**Decision:** Refactor tests to match the new API surface.

**Rationale:**
- Type assertions (`as any`) would silence errors but leave tests calling non-existent methods
- The tests would fail at runtime even if they compile
- The new API is the correct one — tests should validate the actual interface
- Runtime correctness is more important than compilation speed

**Alternative rejected:** Mass `@ts-ignore` or `as any` — would produce compiling but non-functional tests.

**Trade-off:** Higher effort (2–3 hours) but tests actually validate the real API.

---

### D10-2: Prefixed Exports for Barrel Conflicts

**Context:** Multiple modules export `init` functions, causing TS2308 (ambiguous re-export) when barrel files use `export *`.

**Decision:** Use prefixed named exports in barrel files: `export { init as historyInit } from './history'`.

**Rationale:**
- Preserves all functionality — every `init` is still accessible
- Makes import sites explicit about which `init` they want
- Follows TypeScript best practice for large barrel files
- No runtime behavior change

**Alternative considered:** Remove `init` from barrels, require direct imports.
- **Rejected:** Would break existing import patterns in handlers and entry points
- **Trade-off:** Barrel files become more verbose but less ambiguous

---

### D10-3: Minimal Production Fixes (Type Narrowing Over Interface Changes)

**Context:** 14 production type errors span multiple files. Two approaches: (a) change interfaces to match code, or (b) add type narrowing/assertions at error sites.

**Decision:** Prefer type narrowing and `as` assertions over interface changes for Phase 10.

**Rationale:**
- Interface changes risk cascading effects across 100+ consuming files
- Type assertions are localized fixes with zero blast radius
- A future "type unification" pass can clean up interfaces holistically
- Goal is 0 errors now, not perfect type architecture

**Alternative considered:** Comprehensive interface refactoring.
- **Rejected:** Scope too large for a remediation phase, belongs in a separate spec
- **Trade-off:** Some `as unknown as T` casts remain — technical debt, but contained

---

### D10-4: Fix vector-index.js Self-Require In-Place

**Context:** `vector-index.js` has a self-require that causes infinite recursion at runtime. This predates the TS migration.

**Decision:** Fix in both `.js` and `.ts` files simultaneously.

**Rationale:**
- The `.js` file is still the runtime entry point (until `tsc --build` is run in production)
- The `.ts` file should also be correct so the compiled output works
- Both files need the same structural fix

**Alternative considered:** Fix only `.ts` and rely on compilation to overwrite `.js`.
- **Rejected:** Compilation may not happen immediately; runtime needs to work now
- **Trade-off:** Dual-file edit, but ensures both runtime and compilation work

---

## Risk Register (Phase 10 Specific)

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| `provider-chain.test.ts` rewrite introduces test logic bugs | Medium | Medium | Run tests after each section update, compare with original test intent |
| Barrel prefix renames break downstream imports | Low | High | Search all import sites before renaming, update in same commit |
| `vector-index.js` fix changes query behavior | Low | High | Run `test:mcp` before and after, diff outputs |
| Type assertions hide real bugs | Medium | Low | Document each `as` assertion with inline comment explaining why |

---

## Cross-References

- **Parent Decisions:** `092-javascript-to-typescript/decision-record.md` (D1–D7)
- **Spec:** See `spec.md`
- **Plan:** See `plan.md`
- **Tasks:** See `tasks.md`
- **Checklist:** See `checklist.md`
