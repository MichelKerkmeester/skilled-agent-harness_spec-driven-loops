# Iteration 4: Strategy Evaluation — A (Shared Types) vs B (MCP Runtime)

## Focus
Evaluate Strategies A and B against the concrete coupling data from iters 1-3, including reading actual type definitions and assessing MCP tool coverage gaps.

## Findings

### 4.1 Strategy A: Shared Types Package

**Approach:** Move shared TS types to a third package (e.g., `.opencode/skills/_shared-types/`). Both system-code-graph and system-spec-kit import from it. No peer-skill imports.

**Type inventory (from code-graph, consumed by spec-kit):**

| Type | Source Module | Lines | Complexity |
|------|--------------|-------|------------|
| `CodeGraphOpsContract` | `ops-hardening.ts` | ~30-line interface | Medium (5 sub-objects) |
| `GraphFreshness` | `ops-hardening.ts` | `'fresh' \| 'stale' \| 'empty' \| 'error'` | Trivial (4-value union) |
| `GraphReadinessSnapshot` | `ensure-ready.ts` | Interface with freshness + metadata | Medium |
| `ReadyAction` | `ensure-ready.ts` | `'none' \| 'full_scan' \| 'selective_reindex'` | Trivial |
| `ReadyResult` | `ensure-ready.ts` | ~8-field interface | Medium |
| `MergeInput` | `compact-merger.ts` | Input shape for compaction | Low |
| `StartupBriefResult` | `startup-brief.ts` | Result shape for startup brief | Low |
| `RuntimeInfo` | `runtime-detection.ts` | Runtime detection result | Low |
| `IndexScopePolicy` | `index-scope-policy.ts` | Scope policy type | Low |
| `ResolveIndexScopePolicyInput` | `index-scope-policy.ts` | Input shape | Low |

**10 types across 6 modules.** Most are low-complexity (simple interfaces/type unions). Only `CodeGraphOpsContract` and `ReadyResult` are non-trivial.

**Estimated effort:**
- Create `_shared-types/` package with tsconfig, package.json: **2h**
- Extract 10 types into shared package: **4h** (1h per module, 6 modules)
- Update system-code-graph to import from `_shared-types/`: **3h** (update 6 source files, re-export for backward compat)
- Update system-spec-kit to import from `_shared-types/`: **2h** (update 8 files that use type-only imports)
- Update tsconfig.json in both skills: **1h**
- Verify `tsc --noEmit` passes in both skills: **1h**
- Update vitest configs and mock paths: **2h**
- **Total: ~15h**

**Benefits:**
- Resolves ALL type-only imports (7 files in spec-kit)
- No runtime cost (zero-latency change — same JS at runtime)
- tsconfig.json `include` can drop the code-graph cross-reference for type-only consumers
- Smallest code change surface

**Limitations:**
- Does NOT resolve value imports (14 import sites of functions/namespace imports)
- tsconfig.json must still include code-graph for `*.ts` source if value imports remain
- Only a partial solution — best paired with Strategy B for value imports

### 4.2 Strategy B: MCP Runtime Calls

**Approach:** Replace TS imports with MCP tool calls (`mcp__mk_code_index__*` / `mcp__mk_skill_advisor__*`). Decouples completely but pays serialization + RPC cost per call.

**CRITICAL FINDING — MCP tool coverage gap:**

| Value Function Imported | Has MCP Tool? | Gap |
|------------------------|---------------|-----|
| `* as graphDb` (initDb, closeDb, getStats, etc.) | `code_graph_status` returns stats only | **GAP**: spec-kit calls `initDb`, `closeDb`, `upsertFile`, `isFileStale` directly — these are DB lifecycle operations, NOT something you'd expose as MCP tools |
| `detectRuntime` | None | **GAP**: This is a JS runtime-detection function using `process.env` — must run in the caller's process, NOT via MCP |
| `getGraphFreshness` | `code_graph_status` | Covered |
| `getGraphReadinessSnapshot` | `code_graph_status` | Covered |
| `classifyQueryIntent` | None | **GAP**: Internal utility function — would need new MCP tool |
| `buildContext` | `code_graph_context` | Covered |
| `mergeCompactBrief` | None | **GAP**: Internal utility — would need new MCP tool |
| `buildStartupBrief` | None | **GAP**: Internal utility — would need new MCP tool |
| `buildCodeGraphOpsContract` | None | **GAP**: Internal utility backing `normalizeStructuralReadiness` — would need new MCP tool |
| `getStats as getGraphStats` | `code_graph_status` | Covered |
| `resolveIndexScopePolicy` | None | **GAP**: Internal utility — would need new MCP tool |

**Of 11 value imports, only 4 have existing MCP tools. 7 would require NEW MCP tools to be added to system-code-graph.**

**Estimated effort for Strategy B alone:**
- Add 7 new MCP tools to system-code-graph: **14h** (2h per tool: handler + schema + registration + test)
- Rewrite 14 spec-kit call sites to use MCP runtime calls: **7h** (0.5h per site)
- Handle async conversion (TS imports are sync, MCP calls are async): **3h** (refactoring call chains)
- Handle runtime detection (can't MCP-call a process.env checker): **2h** (inline the logic in spec-kit)
- Remove tsconfig.json cross-skill `include` lines: **0.5h**
- Integration testing: **4h**
- **Total: ~30.5h**

**Runtime cost:**
- Each MCP call: ~5-20ms serialization + transport overhead
- `detectRuntime` called at server startup — no hot-path impact
- `getGraphFreshness` + `getGraphReadinessSnapshot` called on every `memory_search` + `session_resume` — **moderate hot-path impact** (currently sub-ms imports, would become ~5-15ms MCP calls)
- `mergeCompactBrief` called on every compaction event: ~2 events per session — negligible
- `buildStartupBrief` called once per session start — negligible

### 4.3 Strategy A vs B cost comparison

| Dimension | Strategy A (Shared Types) | Strategy B (MCP Runtime) |
|-----------|--------------------------|-------------------------|
| Implementation hours | ~15h | ~30.5h |
| Runtime latency impact | **None** (zero-latency) | 5-20ms per call on hot paths |
| Risk level | **Low** (type extraction, no logic change) | **Medium-High** (7 new MCP tools, async refactoring) |
| Completeness | **Partial** (types only) | **Partial** (7 value imports still gap) |
| Test burden change | +10 type-only fixtures | +7 new MCP tool tests in code-graph |
| Ergonomic impact | Minimal (same TS import ergonomics) | Significant (async, error handling, MCP timeouts) |
| tsconfig decoupling | Partial (still needs value includes) | Full (if all gaps filled) |

### 4.4 Critical realization: Neither A nor B alone is sufficient

- **Strategy A** handles 7 of 14 source files (the type-only imports) but leaves 7 files with value imports.
- **Strategy B** handles only 4 of 11 value import sites (those with MCP tools) and cannot handle 7 without significant new tool development. Even with new tools, `detectRuntime` fundamentally cannot work via MCP (it reads `process.env` on the caller's machine).
- **Strategy B cannot reach 100% isolation** because `detectRuntime` requires in-process execution. Either spec-kit must inline its own runtime detection, or code-graph must expose a library (not an MCP tool).

## Sources Consulted
- [SOURCE: file] `system-code-graph/mcp_server/lib/ops-hardening.ts:1-60` — `CodeGraphOpsContract`, `GraphFreshness`, `StructuralReadiness` type definitions
- [SOURCE: file] `system-code-graph/mcp_server/lib/ensure-ready.ts:1-50` — `ReadyResult`, `ReadyAction`, `GraphFreshness` re-exports
- [SOURCE: file] System-code-graph MCP tool schemas (from `tool-schemas.ts`)
- [SOURCE: file] Iter-1 import map (all 14 source files with their imports)

## Assessment
- **New information ratio: 0.55**
  - 2 fully new (MCP tool coverage gap analysis — 7/11 value imports have no MCP tool; `detectRuntime` fundamentally cannot work via MCP)
  - 1 refinement (accurate hour estimates for A: ~15h, B: ~30.5h)
- **Questions addressed**: Q5 (per-strategy cost) — partial (A and B evaluated)
- **Questions answered**: None fully (Q5 requires all 5 strategies)

## Reflection
- **What worked**: Reading the actual type definitions revealed that most types are trivial (4-value unions, simple interfaces). This makes Strategy A cheaper than assumed. Reading the existing MCP tool list revealed the coverage gap.
- **What did not work**: The spec.md assumed "MCP runtime calls" could replace all imports. The reality is that 7/11 value imports have no MCP tool equivalent, and 1 (`detectRuntime`) cannot work via MCP by design.
- **What I would do differently**: Next iteration should evaluate C (hybrid), D (accept coupling), and E (reverse-extract) now that the limitations of A and B are clear.

## Recommended Next Focus
Iter-5: Evaluate Strategy C (hybrid: types via A + behaviors via B where possible), Strategy D (accept coupling), and Strategy E (reverse-extract). Complete Q5.
