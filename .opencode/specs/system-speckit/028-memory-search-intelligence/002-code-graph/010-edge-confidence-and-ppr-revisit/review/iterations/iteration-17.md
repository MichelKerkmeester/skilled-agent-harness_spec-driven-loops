# Dimension

Concurrency/idempotency correctness for the `code-graph-context.ts` top-level `await import()` mechanism behind active finding `P1-001`, plus related module-level mutable state under concurrent `code_graph_context` calls.

# Files Reviewed

- `.opencode/specs/system-speckit/028-memory-search-intelligence/002-code-graph/010-edge-confidence-and-ppr-revisit/review/deep-review-findings-registry.json:9` confirms `P1-001` is already active, so this iteration avoids duplicating the missing-dist dependency finding.
- `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:20` resolves the compiled Memory MCP weighted-walk module at module evaluation time.
- `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:32` performs the top-level dynamic import and stores `collectWeightedWalk` in a module-level constant.
- `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:452` gates seeded-PPR use from `process.env`, but only after the module has already evaluated.
- `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:515` computes PPR with per-call local maps and score state.
- `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:701` builds seeded-PPR impact ranking with per-call `Map` instances and closure-local caches.
- `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:842` initializes per-anchor arrays, maps, counters, and deadline state inside `expandAnchor()`.
- `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:1111` enters the seeded-PPR impact branch only when the flag is enabled.
- `.opencode/skills/system-code-graph/mcp_server/handlers/context.ts:6` statically imports `buildContext` from `code-graph-context.js`.
- `.opencode/skills/system-code-graph/mcp_server/handlers/context.ts:170` wraps runtime handler work in a `try`, but that catch is unavailable if the imported module fails during evaluation.
- `.opencode/skills/system-code-graph/mcp_server/tools/code-graph-tools.ts:5` statically imports all handlers via `handlers/index.js`.
- `.opencode/skills/system-code-graph/mcp_server/tools/code-graph-tools.ts:92` dispatches `code_graph_context` only after the static handler import graph has loaded.
- `.opencode/skills/system-code-graph/mcp_server/handlers/index.ts:4` re-exports handlers, including the context handler.
- `.opencode/skills/system-code-graph/mcp_server/tools/index.ts:5` statically imports `handleTool`.
- `.opencode/skills/system-code-graph/mcp_server/index.ts:17` statically imports the tool registry before server setup code runs.
- `.opencode/skills/system-code-graph/mcp_server/index.ts:61` registers process-level crash handlers in module body code, after static import evaluation has already succeeded.
- `.opencode/skills/system-code-graph/mcp_server/index.ts:137` catches `server.connect()` failures, not earlier static dependency evaluation failures.
- `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-context-handler.vitest.ts:35` mocks `code-graph-context.js` for handler tests, then uses `vi.importActual()` for actual `buildContext()` coverage.
- `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-context-handler.vitest.ts:572` imports actual `buildContext()` through a helper used by multiple tests without local `vi.resetModules()`.
- `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-seeded-ppr-ranking.vitest.ts:28` statically imports actual seeded-PPR exports once for that test module.

# Findings by Severity (P0/P1/P2)

## P0

None.

## P1

None new. The missing compiled-module dependency is already tracked as active `P1-001`; this iteration found no additional concurrency, repeated-import, or silent-failure mechanism that should become a separate P1.

## P2

None.

# Traceability Checks

- Import idempotency: Static runtime loading follows `index.ts -> tools/index.ts -> code-graph-tools.ts -> handlers/index.ts -> handlers/context.ts -> code-graph-context.ts`. Within one MCP server process, the module graph is loaded once; later `code_graph_context` tool calls reuse the same evaluated module. The top-level dynamic import target is also held in `memoryWeightedWalkModule` / `collectMemoryWeightedWalk`, so no per-call re-import loop was found.
- Test re-import behavior: Tests directly import `code-graph-context.js` in `code-graph-seeded-ppr-ranking.vitest.ts` and use repeated `vi.importActual()` calls in `code-graph-context-handler.vitest.ts`. The reviewed files do not reset the module registry around those actual imports, so this does not add a distinct same-process repeated side-effect path beyond the existing active missing-dist failure.
- Crash vs silent failure: The missing dist file is resolved and imported during module evaluation. Because every link in the production chain is a static import before the handler body exists, the handler-level catch at `handlers/context.ts:357` cannot swallow it. The server therefore fails during startup/module loading rather than appearing healthy and returning `code_graph_context failed` on every call. Operator experience is still bad because `index.ts` process handlers and `connect failed` logging are registered after static imports, but the failure mode is a clean module-load crash, not a silent per-tool failure.
- Concurrent mutable state: The new PPR state examined here is per-call/per-anchor local state: `teleport`, `scores`, `reached`, `adjacency`, `edgesByNode`, `nodeSummaries`, `candidatesByEdge`, `nodes`, `edges`, and `whyIncludedByFile`. The only relevant module-level values are constants and the imported `collectWeightedWalk` function. I found no shared mutable arrays or maps introduced by the PPR path that would cross-contaminate concurrent MCP calls.

# Verdict

No new findings for this dimension. The assigned crash-mode question resolves as clean startup/module-load failure rather than silent tool-call failure; idempotency and concurrency behavior do not add a separate finding beyond active `P1-001`.

# Next Dimension

Continue with a non-duplicative dimension from the remaining batch, preferably validating any findings created by iterations 18-20 against the shared registry before recording new IDs.

Review verdict: PASS
