# Post-change Smoke — graph_channel_invocation_rate

Captured: 2026-05-08

## Method

Live MCP smoke is **deferred** — running MCP child is on the pre-012 dist. Restart required before `memory_health.data.routing.graphChannelInvocationRate` becomes observable.

In place of live smoke, this entry records (a) the unit/integration evidence that the new routing path activates and reports rates correctly, and (b) the smoke procedure to run after the next MCP restart.

## Unit + integration evidence (from `tests/query-router.vitest.ts`)

### 012-T3.1 — telemetry rate after mixed routing

```ts
routeQuery('why chose auth approach');                     // simple find_decision → graph
routeQuery('find the spec for tasks');                     // moderate find_spec → graph
routeQuery('refactor');                                    // simple refactor → no graph
routeQuery('refactor the module quickly');                 // moderate refactor → no graph
routeQuery('refactor the database connection module now'); // moderate refactor → no graph

const snap = getRoutingSnapshot();
expect(snap.totalRecorded).toBe(5);
expect(snap.graphChannelInvocationRate).toBeCloseTo(0.4, 2);
```

Result: **0.40** — exactly matches REQ-004 acceptance criterion (after 10 queries: 4 graph-included, 6 not, rate reports 0.4 ± rounding tolerance — scaled to 5 queries here).

### 012-T2.* integration tests confirm:

- find_decision queries route graph at simple tier (012-T2.1)
- find_spec queries route graph at moderate tier (012-T2.2)
- non-find intents do NOT route graph (012-T2.3 — no regression)
- complex tier override is a no-op; reasons not duplicated (012-T2.4)
- Feature flag OFF → behavior matches pre-change (012-T2.5)

## Live-smoke procedure (run after next MCP restart)

20 representative queries spanning all intents:

```
# find_decision (5)
"why chose this auth approach"
"what was the rationale for migration"
"alternatives considered for caching layer"
"adr authentication choice"
"why supersedes previous decision"

# find_spec (5)
"find the spec for tasks"
"specification for memory-context"
"what are the requirements for resume"
"plan for graph optimization"
"checklist for level 2 packets"

# understand (5)
"explain how the routing layer works"
"architecture of memory health"
"how does intent classifier handle short queries"
"overview of vector index aliases"
"what is the purpose of bm25 preservation"

# refactor / fix_bug (5)
"refactor the database connection module"
"fix the orphan file cleanup bug"
"clean up legacy code paths"
"resolve broken trigger cache refresh"
"optimize causal edge lookup"
```

After running these:

```bash
memory_health → data.routing.graphChannelInvocationRate
```

**Expected**: ≥0.30 (per SC-001), driven primarily by the find_decision + find_spec batches plus any entity-density hits from understand-intent queries that name high-degree memory titles.
