# Iteration 6: Migration Sequencing + Risk Register + Adversarial Pass

## Focus
Produce the concrete migration sequence that avoids broken-build windows (Q7), the risk register with rollback strategies (Q8), and an adversarial pass challenging the recommendation (REQ-008).

## Findings

### 6.1 Migration Sequencing — Dependency Order

The proposed 4 phases have these dependencies:

```
Phase 1 (skill-advisor) ─────────────────────┐
  ↓ no deps                                  │
Phase 2 (shared types) ← needs Phase 1 done? │ NO — independent
  ↓ deps: none                               │
Phase 3 (MCP bridge + inlining)              │
  ↓ deps: Phase 2 (types must exist first)    │
Phase 4 (docs + tests)                       │
  ↓ deps: Phases 1+2+3 (all code migrated)    │
```

**Critical insight: Phase 1 and Phase 2 are INDEPENDENT.** They can be executed in parallel or either order. However, the recommended order is:

**Phase 1 first (skill-advisor, 2h)** because:
- It's the quickest win — skill-advisor has zero TS imports, the isolation is purely a tsconfig + doc cleanup
- Removing skill-advisor from tsconfig.json `include` IMMEDIATELY stops tsc from type-checking advisor files as a side effect (reduces build time)
- It establishes the pattern for Phase 2-4 and builds confidence
- It has the lowest risk (zero code changes in spec-kit source files — only tsconfig + doc moves)

**Phase 2 next (shared types, 15h)** because:
- Types are the foundation — functions and MCP calls can reference them
- Code-graph re-exports stay backward-compatible during the transition
- tsconfig.json updates are additive first (add `_shared-types/`), then subtractive (remove cross-skill include lines)

**Phase 3 next (MCP bridge + inlining, 9.5h)** because:
- Requires the shared types from Phase 2
- The inlined functions can reference the shared types
- MCP calls can reference the shared types in their schemas

**Phase 4 last (docs + tests, 4h)** because:
- All code must be migrated before moving/updating docs
- Test migrations depend on the new import paths from Phase 2-3

### 6.2 Broken-Build Window Analysis

Each phase is designed to be **self-contained** — no intermediate state breaks `tsc --noEmit`:

| Phase | Operation | Build-Breaking Risk | Mitigation |
|-------|-----------|-------------------|------------|
| 1 | Remove skill-advisor from tsconfig include | **None** — zero TS imports of skill-advisor | Verify `tsc --noEmit` before and after; can't break since nothing imports it |
| 1 | Move skill-advisor tests | Break if vitest can't find them | Move tests atomically: `git mv` ensures path references update; or split into 2 commits: (a) copy tests to skill-advisor + add to its vitest config, (b) remove from spec-kit |
| 2 | Create `_shared-types/` package | New package doesn't exist yet | Create + publish in one commit before either skill references it |
| 2 | Update code-graph to use `_shared-types/` | Break if types not exported correctly | Re-export from original paths for backward compat; run code-graph's own test suite |
| 2 | Update spec-kit to use `_shared-types/` | Break if import paths wrong | Update imports one file at a time; `tsc --noEmit` after each file |
| 2 | Remove code-graph type imports from tsconfig include | **Partial break**: value imports still need the include | Don't remove include until Phase 3 is complete — tsconfig include stays during Phase 2 transition |
| 3 | Inline 5 functions | Logic regression | Port with existing tests; run spec-kit test suite after each inlining |
| 3 | Wire MCP calls | Async conversion breaks callers | Convert one caller at a time; keep old sync path as fallback until verified |
| 3 | Remove code-graph value imports from tsconfig include | **THE critical moment** — if any import missed, tsc fails | Final `tsc --noEmit` verification; grep for any remaining `system-code-graph` imports before removing include |
| 4 | Move feature_catalog/playbook files | None (docs, not code) | Move atomically; update cross-references |
| 4 | Move tests | vitest config break | Update vitest.config.ts in both skills; run both suites |

**The only break-risk window is Phase 3's final step: removing the code-graph `include` from tsconfig.json. Mitigation: exhaustive grep for remaining imports before removal.**

### 6.3 Risk Register

| # | Risk | Likelihood | Impact | Detection Signal | Rollback |
|---|------|-----------|--------|-----------------|----------|
| R1 | `_shared-types/` introduces circular dependency between code-graph and spec-kit | Low | High (build break) | `tsc --noEmit` in both skills fails with circular import error | Remove `_shared-types/`, restore direct imports |
| R2 | Inlined `detectRuntime` diverges from code-graph version | Medium | Medium (runtime mismatch) | Cross-runtime detection test failures in spec-kit | Add shared test that both skills run; pin to same version |
| R3 | MCP call latency degrades `memory_search` or `session_resume` UX | Low | Low (15-45ms overhead is negligible) | Performance regression in integration tests | Cache MCP results per-session; fall back to cached value |
| R4 | `mergeCompactBrief` inlining introduces bugs in compaction output | Medium | High (compaction corruption) | Compact-merger test suite failures | Keep original code-graph test suite as regression tests |
| R5 | Test migration breaks CI because vitest configs reference deleted files | High | Medium (CI red) | CI pipeline failure on PR | Revert test file moves; update vitest configs atomically |
| R6 | Phase 3 incomplete — a forgotten import breaks `tsc --noEmit` | Medium | Low (caught by verification) | `tsc --noEmit` failure | Grep for remaining imports; add missing inlined function |
| R7 | `_shared-types/` version drift: code-graph updates a type, spec-kit doesn't pick it up | Medium | Medium (type mismatch at runtime) | TypeScript structural compatibility catches most; runtime errors for incompatible shapes | Pin types with version tests; CI check that both skills' tsc passes |
| R8 | Skill-advisor doc moves create broken links in spec-kit's cross-reference docs | Low | Low (broken links) | Link checker on CI | Update cross-references to point to moved files |

### 6.4 Adversarial Pass (REQ-008)

Each recommended decision is challenged and addressed:

**Challenge 1: "Strategy C is over-engineered. If spec-kit and code-graph always run together, why pretend they're isolated?"**

Counter: Isolation isn't about runtime co-location — it's about **compile-time independence**. Currently, a change to `compact-merger.ts` in code-graph requires re-type-checking spec-kit (which transitively type-checks all of code-graph through tsconfig include). This means:
- Code-graph cannot be versioned independently
- Spec-kit's `tsc --noEmit` is slow because it type-checks a codebase 2x its size
- A type error in code-graph breaks spec-kit's CI
- Developers working on spec-kit must understand code-graph's type system

Strategy C addresses all of these. The ~30h investment pays back in faster CI, independent versioning, and reduced cognitive load.

**Counter-address:** While the compile-time independence argument is valid, it's worth noting that the actual developer pain may be small. If CI currently passes (it does), and developers aren't complaining about slow tsc, the 30h might be better spent on bug fixes or features. The recommendation should include a **cost-benefit decision point**: start with Phase 1 (2h, skill-advisor), measure the benefit, then decide on Phase 2-4.

**Challenge 2: "Inlining functions creates code duplication. DRY violation."**

Counter: The duplicated functions are small and stable:
- `detectRuntime`: ~50 lines, rarely changes
- `classifyQueryIntent`: ~80 lines, keyword scoring
- `buildCodeGraphOpsContract`: 8-line helper
- `resolveIndexScopePolicy`: ~30 lines, scope pattern matching
- `mergeCompactBrief`: ~300 lines, most complex

The first 4 are trivial to inline and unlikely to diverge. `mergeCompactBrief` (300 lines) is the concern. Alternative: instead of inlining it, this function could be moved TO the shared types package as a "shared library" since both skills need it. This is essentially Strategy A for behaviors — shared code, not just shared types.

**Revised recommendation:** For `mergeCompactBrief`, use a shared library approach (move to `_shared-types/` or a new `_shared-lib/` package) rather than inlining. Same approach for `buildStartupBrief`. This reduces duplication risk at the cost of a slightly larger shared package.

**Challenge 3: "Phase 1 (skill-advisor at 2h) looks too optimistic — moving 7 feature_catalog/playbook files + 2 test files + updating vitest configs in 2h is aggressive."**

Counter: The 2h estimate is for the minimal viable change (tsconfig + vitest config only). The doc and test moves can be deferred to Phase 4 or handled as a separate packet. This means Phase 1 can be:
- **2h**: Remove tsconfig include, remove vitest config includes, verify `tsc --noEmit` passes
- **+4h**: Doc moves and test moves (if done in Phase 1; otherwise deferred to Phase 4)

This adjusted estimate makes Phase 1 more realistic.

### 6.5 Adjusted Cost Estimates (incorporating adversarial feedback)

| Phase | Original Est | Adjusted Est | Key Change |
|-------|-------------|-------------|------------|
| 1: Skill-advisor isolation | 2h | **6h** | Include doc/test moves (were split to Phase 4) |
| 2: Shared types package | 15h | **17h** | Include `mergeCompactBrief` + `buildStartupBrief` as shared lib (not inlined) |
| 3: MCP bridge + inlining | 9.5h | **5h** | Less inlining (2 functions moved to Phase 2 shared lib) |
| 4: Docs + test migration | 4h | **3h** | Less remaining (Phase 1 handles skill-advisor docs) |
| **Total** | **~30.5h** | **~31h** | More robust, less duplication |

## Sources Consulted
- [SOURCE: analysis] Iter-1 through Iter-5 findings (import map, doc map, test map, strategy costs)
- [SOURCE: file] `tsconfig.json` (for include/exclude analysis)

## Assessment
- **New information ratio: 0.30**
  - 1 fully new (broken-build window analysis — only Phase 3's final include removal is risky)
  - 2 refinements (adjusted cost estimates from adversarial feedback; Phase 1 scope clarification)
  - 1 confirmation (phases are correctly sequenced; Phase 1+2 are independent)
- **Questions addressed**: Q7 (migration sequence), Q8 (risk register)
- **Questions answered**: Q7 (complete), Q8 (complete)

## Reflection
- **What worked**: The adversarial pass identified a real concern: inlining `mergeCompactBrief` (300 lines) is risky. The revised approach (move to shared lib) is more robust.
- **What did not work**: The initial Phase 1 estimate was optimistic. Adjusted from 2h to 6h to account for doc/test moves.
- **What I would do differently**: Next iteration should be synthesis — compile research.md from all iterations.

## Recommended Next Focus
Iter-7: Synthesis — compile all findings into `research/research.md` covering REQ-001 through REQ-008 plus the adversary pass. This should be the final iteration before convergence check.
