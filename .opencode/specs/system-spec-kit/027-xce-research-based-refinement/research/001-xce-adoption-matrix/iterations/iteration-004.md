# Iteration 004 — RQ4: Get-Context Combiner

**Started**: 2026-05-08T12:30:00Z
**Focus**: RQ4 — Should we ship a NEW `code_graph_context_omni` tool, or FOLD the omnibus first-call capability into the existing `code_graph_context` payload? Payload-size budget analysis against `budget-allocator.ts`.

---

## Actions

1. Read `external/README.md` (full 283 lines) — locate all `xce_get_context` references across steering rules and tool catalog.
2. Read `code_graph/lib/budget-allocator.ts` (full 134 lines) — token budget model: total cap, floor allocations, overflow redistribution.
3. Read `code_graph/handlers/context.ts` (full 416 lines) — existing MCP handler: readiness gate, seed normalization, queryMode dispatch, payload shape.
4. Read prior iteration findings (001, 002, 003) for context on HLD/LLD schema, trace tool design, and impact analysis schema already proposed.
5. Read `code_graph/lib/code-graph-context.ts` lines 32-55 — `ContextResult` interface: single queryMode per call, no multi-mode aggregation.

---

## Findings

### F-020: XCE `xce_get_context` is an omnibus combiner, not a standalone tool with unique behavior (external/README.md:113,130,144,158,171,180)

XCE's `xce_get_context` appears **only** in steering rules — not in the "Available Tools" section (external/README.md:190-227) which is reserved for the 4 single-purpose tools (`xce_search`, `xce_architecture_context`, `xce_trace`, `xce_impact_analysis`). Every IDE steering variant commands it as a mandatory first call:

- external/README.md:113: `"Call xce_get_context as your FIRST step when starting any task. It combines search, architecture context, and tracing into one call."` (Kiro)
- external/README.md:130: `"Call xce_get_context first on any task — it returns architecture, code locations, and relationships"` (Claude Code)
- external/README.md:144,158,171,180: `"Call xce_get_context as your first action on any task"` (Cursor, Windsurf, OpenCode, Cline)

The tool is described as combining 3 of the 4 single-purpose tools into one atomic call. It is a **task-entry orchestrator** — it front-loads context so the LLM begins work with a snapshot of architecture + code locations + dependencies. There is no documented `xce_get_context` input schema (file path? query string? task description?). This implies it likely accepts a natural-language task description and dispatches internally.

Evidence lines:
- external/README.md:113 — Kiro steering: `"Call xce_get_context as your FIRST step when starting any task. It combines search, architecture context, and tracing into one call."`
- external/README.md:130 — Claude Code steering: `"Call xce_get_context first on any task — it returns architecture, code locations, and relationships"`
- external/README.md:190-227 — Available Tools section: lists `xce_search`, `xce_architecture_context`, `xce_trace`, `xce_impact_analysis` — `xce_get_context` is absent from this section

### F-021: The existing `code_graph_context` dispatches a SINGLE queryMode per call — no multi-mode orchestration (handlers/context.ts:264-266, code-graph-context.ts:32-55)

`handleCodeGraphContext` validates `args.queryMode` against exactly ONE of `['neighborhood', 'outline', 'impact']` (context.ts:264-266). The `ContextResult` interface (code-graph-context.ts:32-55) has `queryMode` as a singular enum value — there is no `queryModes[]` plural form, no sub-results array, and no mechanism to return multiple mode outputs in one call.

The handler's per-call budget default is 1200 tokens (context.ts:343). This is sufficient for ONE mode (neighborhood/outline/impact) but would starve if split across 2-3 sub-queries without a budget increase.

Evidence lines:
- handlers/context.ts:264-266: `const queryMode = (['neighborhood', 'outline', 'impact'].includes(args.queryMode ?? '') ? args.queryMode as QueryMode : 'neighborhood');`
- handlers/context.ts:343: `budgetTokens: args.budgetTokens ?? 1200,`
- code-graph-context.ts:32-55: `ContextResult` interface: `queryMode: QueryMode` (singular), `combinedSummary: string` (one), `graphContext: Array<GraphContextSection>` (per-anchor, not per-mode)

### F-022: Budget-allocator per-call cap is 4000 tokens total with 1200-token codeGraph floor (budget-allocator.ts:32-38,54)

The `allocateBudget()` function (budget-allocator.ts:52-117) operates with:
- **Total budget**: 4000 tokens (budget-allocator.ts:54 default parameter)
- **codeGraph floor**: 1200 tokens (budget-allocator.ts:34, `DEFAULT_FLOORS.codeGraph = 1200`)
- **Overflow redistribution priority**: constitutional → codeGraph → cocoIndex → sessionState → triggered (budget-allocator.ts:41)
- **Redistribution mechanism**: if other sources are under-floor, their unused tokens flow to higher-priority sources (budget-allocator.ts:76-92). A code-graph source that is under-requested (empty or small) would give its unused floor to constitutional, NOT to codeGraph.
- **Trim direction**: reverse priority if total exceeds cap (budget-allocator.ts:96-108)

The 1200-token floor for codeGraph is sized for a single queryMode response. An omni call delivering 3 sub-mode results at comparable quality would need ~3000-3600 tokens, which exceeds the existing floor by 2.5-3x. However, the budget-allocator.ts is a **cross-source** allocator (constitutional + codeGraph + cocoIndex + triggered), not an **intra-source** sub-allocator. The omni call's internal budget splitting (e.g., 40% neighborhood / 30% trace / 30% impact) is a concern for `code-graph-context.ts`, not `budget-allocator.ts`.

The handler already accepts a caller-specified `budgetTokens` override (context.ts:343). An omni queryMode could default to 2400 budgetTokens — covering 3 sub-modes at 800 tokens each — without touching `budget-allocator.ts` at all. The cross-source allocator would still cap codeGraph at 1200 floor + whatever overflow it captures, but the caller (the LLM agent) would see truncated results with `partialOutput: true` signaling and could re-request with a narrower focus. This is the existing truncation contract already working (code-graph-context.ts:45-53,139-146).

Evidence lines:
- budget-allocator.ts:32-38: `DEFAULT_FLOORS = { constitutional: 700, codeGraph: 1200, cocoIndex: 900, triggered: 400, overflow: 800 }`
- budget-allocator.ts:54: `totalBudget: number = 4000`
- budget-allocator.ts:41: `const PRIORITY_ORDER = ['constitutional', 'codeGraph', 'cocoIndex', 'sessionState', 'triggered']`
- budget-allocator.ts:96-108: trim in reverse priority order when `totalUsed > totalBudget`
- handlers/context.ts:343: `budgetTokens: args.budgetTokens ?? 1200`

### F-023: Trade-off matrix: NEW tool vs FOLD-IN

| Dimension | NEW `code_graph_context_omni` | FOLD-IN (`queryMode: 'omni'`) |
|-----------|-------------------------------|-------------------------------|
| **Code duplication** | Duplicates readiness gate (context.ts:182-262, ~80 LOC), seed normalization (context.ts:268-333, ~65 LOC), fallback decisions (context.ts:96-118, ~23 LOC), CocoIndex telemetry passthrough (context.ts:275-305, ~31 LOC), deadline resolution (context.ts:120-131, ~12 LOC) | Reuses ALL existing plumbing. Adds only omni-specific multi-call orchestration. |
| **API surface** | Adds 1 new MCP tool name the LLM must learn. Bifurcates context retrieval: "when do I use context vs context_omni?" decision burden on the agent. | Reuses existing tool name. Agent just passes `queryMode: 'omni'`. Same tool, richer mode. |
| **Budget** | Could have its own budget floor (e.g., 2500 tokens) in budget-allocator.ts. Cleaner budget story. | Must rely on caller-supplied `budgetTokens` override (already supported). Default 2400 vs 1200. Internal sub-allocation lives in code-graph-context.ts. |
| **Error handling** | Independent fallback. Crash in omni doesn't block single-mode context. | Single handler: crash blocks all modes. Mitigated by try/catch isolation per sub-call. |
| **Estimated LOC** | ~380 (new handler 200 + new lib 150 + tool reg 10 + budget-allocator edit 20) | ~117 (handler edit 15 + lib 100 + optional tool desc update 2) |
| **Maintenance burden** | 2 handlers to keep in sync for readiness contract, seed normalization, fallback logic, telemetry passthrough. | 1 handler. All changes propagate automatically. |
| **XCE alignment** | Matches XCE's separate `xce_get_context` tool name. | Different approach (mode flag vs tool name), but equivalent UX — one call, combined output. |

### F-024: Decision — FOLD-IN with `queryMode: 'omni'` (ADAPT)

**Verdict: ADAPT — FOLD into existing `code_graph_context` via new `queryMode: 'omni'`.**

Rationale:
1. **Code reuse wins**: The existing handler (context.ts:416 lines) already contains ~70% of what an omni tool needs. Duplicating readiness gates, seed normalization, fallback decisions, telemetry passthrough, and trustState passthrough into a new handler is ~200 LOC of copy-paste that must stay in sync across future readiness-contract and telemetry-pass-through changes.
2. **LLM cognitive simplicity**: The agent already knows `code_graph_context`. Adding `queryMode: 'omni'` is one parameter change, not a new tool to discover and route between. The skill-advisor brief can steer the agent to `queryMode: 'omni'` on task entry without teaching a new tool name.
3. **Budget is self-contained**: The caller-specified `budgetTokens` parameter (context.ts:343) already exists. Omni mode defaults to 2400 (2x the single-mode default). The cross-source budget-allocator.ts does not need changes. Internal sub-allocation (proportional split + floor guarantees per sub-mode) lives in `code-graph-context.ts`, where it belongs.
4. **Partial-output contract already handles truncation**: If the cross-source allocator caps codeGraph at 1200 floor, the omni call will produce truncated results with `partialOutput: true` (code-graph-context.ts:45-53). The LLM sees the truncation signal and can narrow scope.
5. **The FOLD-IN approach is consistent with RQ1-RQ3 findings**: RQ1 (F-005) proposed HLD/LLD schema as new lib functions; RQ2 (F-012) proposed trace as new handler + lib; RQ3 (F-019) proposed impact analysis as new handler + lib. All three produce reusable functions that the omni mode can call internally.

**Estimated LOC**: ~117
| Component | File | Change | LOC |
|-----------|------|--------|-----|
| Omni orchestration | `lib/code-graph-context.ts` (edit) | Add `buildOmniContext()` — calls `buildContext()` 2-3× with sub-mode budgets, concatenates sections with headers | +100 |
| Handler dispatch | `handlers/context.ts` (edit) | Add `'omni'` to queryMode validation array; add omni branch with integrated sub-call orchestration | +15 |
| Tool parameter description | `tools/code-graph-tools.ts` (edit) | Optional: add `'omni'` to queryMode enum description | +2 |
| **Total** | | | **~117** |

**No new dependencies. No schema migration.**

### F-025: Internal sub-allocation design for omni mode

The omni call runs 2-3 internal `buildContext()` passes with proportional budget split:

```
Omni Call (2400 tokens default):
  ├── sub-mode "architecture" (40% = 960 tokens)
  │   └── buildContext(queryMode='neighborhood', ...)
  │       → resolves anchors, returns 1-hop nodes + edges
  ├── sub-mode "trace" (30% = 720 tokens per top symbol)  
  │   └── for each top-3 anchor: buildContext(queryMode='outline', ...)
  │       → returns symbol → class → file chain
  └── sub-mode "impact" (30% = 720 tokens)
      └── buildContext(queryMode='impact', ...)
          → returns reverse callers + importers per anchor
```

Concatenated output with section headers: `## Architecture Context`, `## Trace Chain`, `## Impact Summary`. Each section includes its own `partialOutput` flag. The top-level response merges `resolvedAnchors` deduplicated by file:line, and computes a combined `nextActions` list.

This is a orchestrator — it doesn't implement new graph algorithms. It reuses `buildContext()` as-is, just called 2-3 times with sub-mode settings. The only new logic is the proportional budget splitter (~15 LOC) and the section concatenator (~20 LOC).

---

## Q-Answered

- **RQ4 — Get-Context Combiner**: Fully answered. XCE's `xce_get_context` is a steering-only combiner with no dedicated I/O schema in the Available Tools section (F-020). Our existing `code_graph_context` dispatches one queryMode per call with 1200-token default budget (F-021). The budget-allocator has a 4000-token total cap with 1200-token codeGraph floor, but budgetTokens override is already supported (F-022). Trade-off matrix between NEW tool (380 LOC, duplicated plumbing) and FOLD-IN (117 LOC, reuses all existing infrastructure) favors FOLD-IN decisively (F-023). Decision: ADAPT — add `queryMode: 'omni'` to existing `code_graph_context` (F-024). Internal sub-allocation design: proportional budget split across 2-3 sub-mode `buildContext()` calls (F-025).

## Q-Remaining

- RQ5–RQ9 untouched (iterations 1–4 scoped to RQ1, RQ2, RQ3, RQ4 only).

## Next-Focus

**RQ5 — PRAT Reverse-Engineering**: Given only the public name + benchmark numbers, what is the most likely PRAT pipeline? Can we replicate it with our tree-sitter + an optional generation step? What does "persistence" mean — content-hash keyed cache or version-tagged snapshots? Map each stage to local files: `lib/structural-indexer.ts` (parse), `lib/code-graph-db.ts` (persist), new `lib/code-graph-hld-lld.ts` (summarize/layer), new `lib/code-graph-trace.ts` (transitive climb).

---

## Verdict Summary: RQ4 `code_graph_context_omni`

| Dimension | Finding | Verdict |
|-----------|---------|---------|
| **XCE xce_get_context surface** | Steering-only combiner; combines search + arch + trace in one first call. No dedicated I/O schema in Available Tools. | **Target to replicate** |
| **Existing handler capability** | Single queryMode per call. No multi-mode aggregation. 1200-token default budget. | **Gap — FOLD-IN solves it** |
| **Budget allocator** | 4000-token total cap, 1200-token codeGraph floor. Caller budgetTokens override already supported. | **No budget-allocator change needed** |
| **Code duplication risk** | NEW tool duplicates ~200 LOC of readiness gates + seed normalization. FOLD-IN reuses all. | **FOLD-IN wins — 117 vs 380 LOC** |
| **LLM cognitive overhead** | New tool = new name to learn. FOLD-IN = one parameter change on existing tool. | **FOLD-IN wins** |
| **Estimated LOC** | ~117 (lib 100 + handler 15 + tool desc 2) | **Small — 0 new deps, 0 schema migration** |
| **Overall** | FOLD-IN is the clear choice. Less code, less maintenance, simpler UX. | **ADAPT** |

### Estimated LOC: ~117

| Component | File | LOC |
|-----------|------|-----|
| Omni orchestrator | `lib/code-graph-context.ts` (edit) | +100 |
| Handler dispatch | `handlers/context.ts` (edit) | +15 |
| Tool description | `tools/code-graph-tools.ts` (edit) | +2 |
| **Total** | | **~117** |

No new dependencies. No schema migration. Reuses all existing infrastructure (readiness gate, seed normalization, fallback decisions, CocoIndex telemetry passthrough, trustState passthrough, budget truncation contract).

---

## Tool Calls

| # | Tool | Purpose |
|---|------|---------|
| 1-4 | Read (4×) | Packet spec.md, iteration-001/002/003.md — RQ4 context + prior findings |
| 5 | Read | external/README.md (full 283 lines) — xce_get_context steering references |
| 6 | Read | code_graph/lib/budget-allocator.ts (full 134 lines) — budget model |
| 7 | Read | code_graph/handlers/context.ts (full 416 lines) — handler plumbing |
| 8 | Read | deep-research-state.jsonl — current state (line 7 format) |
| 9 | Read | deltas/iter-003.jsonl — delta format reference |
| **Tool calls**: 9 (under cap of 12) |
