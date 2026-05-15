# Iteration 5: Strategy Evaluation — C (Hybrid), D (Accept), E (Reverse-Extract) + Recommendation

## Focus
Complete strategy evaluation. Rate all 5 strategies on cost, runtime, risk, ergonomics. Produce recommendation.

## Findings

### 5.1 Strategy C: Hybrid (Types via A + Behaviors via B)

**Approach:** Use Strategy A for types (shared package `_shared-types/`), Strategy B for behaviors where MCP tools exist, and inline/duplicate where MCP tools don't exist.

**Assessment:**

| Value Function | Approach | Effort |
|----------------|----------|--------|
| `* as graphDb` | `code_graph_status` works for stats; `initDb`/`closeDb` are spec-kit's DB lifecycle — must be inlined or called differently. **Actually, spec-kit doesn't need to manage code-graph's DB — it should call `ensureCodeGraphReady()` via MCP instead.** | Remove DB management, call MCP readiness tool |
| `detectRuntime` | Cannot MCP-call. **Must be duplicated in spec-kit** (or extracted to a shared runtime-detection library that both skills use — which is a variant of A but for code, not types). | 2h to duplicate |
| `getGraphFreshness` | `code_graph_status` | Covered |
| `getGraphReadinessSnapshot` | `code_graph_status` | Covered |
| `classifyQueryIntent` | No MCP tool. **Option: inline the classifier logic in spec-kit.** It's a keyword-scoring function, not large. | 1h to inline |
| `buildContext` | `code_graph_context` | Covered |
| `mergeCompactBrief` | No MCP tool. **Option: inline or keep as shared lib.** The compact-merger is ~300 lines, non-trivial. | 2h to inline or create shared lib |
| `buildStartupBrief` | No MCP tool. **Option: inline or keep as shared lib.** | 1.5h to inline |
| `buildCodeGraphOpsContract` | Type-only (covered by A) + small helper function `normalizeStructuralReadiness`. The function is 8 lines. **Inline it.** | 0.5h to inline |
| `getStats` | `code_graph_status` | Covered |
| `resolveIndexScopePolicy` | No MCP tool. **Option: inline** (it's a simple scope-pattern matcher). | 0.5h to inline |

**Estimated effort:**
- Strategy A base: **15h**
- Inline 5 functions (`detectRuntime`, `classifyQueryIntent`, `mergeCompactBrief`, `buildStartupBrief`, `resolveIndexScopePolicy`): **7.5h**
- Remove DB lifecycle management from spec-kit (use MCP readiness): **2h**
- Integration testing: **4h**
- **Total: ~28.5h**

**Runtime cost:** 3 MCP calls on hot paths (code_graph_status on `memory_search` + `session_resume`, code_graph_context on `memory_context`). Estimated 15-45ms added latency total. Negligible for session-level operations.

**Risk:** Medium. Inlining functions risks divergence from code-graph implementations. Duplicated `detectRuntime` risks falling out of sync.

### 5.2 Strategy D: Accept Coupling

**Approach:** Document that spec-kit and code-graph are compile-time peers. Remove the "100% isolated skill" claim. Update SKILL.md, README.md, ARCHITECTURE.md.

**Assessment:**
- **Implementation hours: 2h** (documentation updates only — remove isolation claims, add peer-dependency language)
- **Runtime cost: None** (no code changes)
- **Risk: None** (no code changes)
- **Ergonomic impact: None** (developers keep same workflow)
- **Test burden change: None**

**Why this is surprisingly rational:**
- The two skills serve the same operator (spec-kit is the "umbrella" MCP server; code-graph and skill-advisor provide its structural data)
- They are co-installed in the same MCP environment (`opencode.json`) — they always run together
- The coupling is deep (14 source files, not 2-3) and reflects genuine architectural integration
- "100% isolation" may be a goal that doesn't match the architecture's reality: spec-kit IS the coordinator, and code-graph/advisor ARE its data providers

**Counter-argument:** The current coupling prevents independent versioning, publishing, and scope validation. If spec-kit were ever split into a standalone npm package, the imports would break.

### 5.3 Strategy E: Reverse-Extract

**Approach:** Move the spec-kit code that depends on code-graph/advisor INTO those skills. Reverses the extraction.

**Assessment:**
- This would mean moving `handlers/memory-context.ts`, `handlers/memory-search.ts`, `handlers/session-resume.ts`, etc. into system-code-graph — essentially undoing the extraction
- These handlers are core spec-kit functionality (memory context, memory search, session resume) — moving them back defeats the extraction's purpose
- **Implementation hours: 40h+** (massive refactoring, test migration, handler re-routing)
- **Risk: Very High** (architectural reversal with cascading effects)
- **NOT RECOMMENDED.** This would create more problems than it solves.

### 5.4 Complete Strategy Comparison Table

| Strategy | Hours | Runtime Cost | Risk | Ergonomic Impact | Completeness |
|----------|-------|-------------|------|-----------------|--------------|
| **A** Shared Types | 15h | None | Low | Minimal | Partial (types only) |
| **B** MCP Runtime | 30.5h | 5-20ms/call | Medium-High | Significant (async) | Partial (7 gaps) |
| **C** Hybrid (A+B+inline) | 28.5h | 15-45ms total | Medium | Moderate | **Full** (100% isolation) |
| **D** Accept Coupling | 2h | None | None | None | Full (by redefinition) |
| **E** Reverse-Extract | 40h+ | None | Very High | Disastrous | Full (by undoing work) |

### 5.5 Recommendation: Strategy C with Phase-by-Phase Sequencing

**Primary recommendation: Strategy C (Hybrid)**, executed in 4 independent phases:

**Phase 1: Skill-Advisor complete isolation (2h)**
The skill-advisor has ZERO TS import coupling. This can be fixed immediately:
- Remove `"../../system-skill-advisor/mcp_server/**/*.ts"` from tsconfig.json include (line 42)
- Remove skill-advisor from vitest.config.ts includes (lines 20-21, 23)
- Move `tests/spec-kit-skill-advisor-plugin.vitest.ts` and `stress_test/skill-advisor/` to system-skill-advisor
- Move 4 OWNERSHIP-skill-advisor feature_catalog files (26-29) and 3 OWNERSHIP playbook files (283-285) to system-skill-advisor
- Verify `tsc --noEmit` still passes

**Phase 2: Shared types package (15h)**
- Create `_shared-types/` with the 10 shared types
- Update both skills' imports
- Remove code-graph type-only imports from spec-kit

**Phase 3: Function inlining + MCP bridge (9.5h)**
- Inline 5 small functions into spec-kit (`detectRuntime`, `classifyQueryIntent`, `buildCodeGraphOpsContract`/helper, `resolveIndexScopePolicy`, `buildStartupBrief`)
- Wire `code_graph_status` for `getGraphFreshness`, `getGraphReadinessSnapshot`, `getStats`
- Wire `code_graph_context` for `buildContext`
- Handle `mergeCompactBrief` (largest inlining task — ~300 lines)
- Remove remaining cross-skill tsconfig includes
- Verify `tsc --noEmit` passes without cross-skill includes

**Phase 4: Doc + test migration (4h)**
- Move 7 OWNERSHIP-code-graph feature_catalog/playbook entries to system-code-graph
- Move 9 tests to system-code-graph, 2 tests to system-skill-advisor
- Convert 6 tests to use local mocks/types
- Update 18 CROSS-REF doc entries with updated boundary language
- Update SKILL.md, README.md, ARCHITECTURE.md

**Total: ~30.5h, 4 independent phases, each can be shipped as a separate PR/packet.**

### 5.6 Fallback recommendation: Strategy D (Accept Coupling)

If the 30.5h investment is not justified (the coupling is architectural, not accidental), Strategy D at 2h is the pragmatic choice:
- Update ARCHITECTURE.md to document the compile-time peer dependency explicitly
- Remove "fully isolated" claim from SKILL.md/README.md
- Keep all other docs as cross-references (they're already accurate)

## Sources Consulted
- [SOURCE: file] Iter-1 import map (14 source files, exact symbols)
- [SOURCE: file] Iter-2 doc classification (56 doc files classified)
- [SOURCE: file] Iter-3 test classification (19 tests classified)
- [SOURCE: file] Iter-4 MCP tool coverage analysis
- [SOURCE: file] `ops-hardening.ts:1-60` (type definitions)
- [SOURCE: file] `ensure-ready.ts:1-50` (type re-exports)

## Assessment
- **New information ratio: 0.45**
  - 1 fully new (Strategy C phase-by-phase execution plan; Strategy E NOT RECOMMENDED verdict)
  - 2 refinements (accurate hour estimates for C and D; fallback recommendation)
  - 1 confirmation (skill-advisor can be isolated in Phase 1 at 2h — a quick win)
- **Questions addressed**: Q5 (strategy costs), Q6 (recommendation)
- **Questions answered**: Q5 (complete), Q6 (Strategy C recommended, Strategy D as fallback)

## Reflection
- **What worked**: The phase-by-phase decomposition of Strategy C makes it manageable. Phase 1 (skill-advisor at 2h) is a quick win that can be shipped immediately.
- **What did not work**: Strategy E is clearly the wrong direction — it would undo the extraction work. Documenting this negative recommendation is as valuable as the positive one.
- **What I would do differently**: Next iteration should focus on the migration sequence (Q7) — specifically the order that avoids broken-build windows.

## Recommended Next Focus
Iter-6: Migration sequencing (Q7) — which order of operations avoids a broken-build window? Should Phase 1 (skill-advisor) ship first? Risk register + rollback strategies (Q8).
