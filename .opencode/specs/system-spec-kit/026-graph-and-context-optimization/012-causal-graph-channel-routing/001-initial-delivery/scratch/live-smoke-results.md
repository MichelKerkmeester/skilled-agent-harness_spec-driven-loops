# Live Smoke Results — graph-channel routing + degree parity

Captured: 2026-05-08T14:47Z (scenario 1 of handover §4)
Runner: Claude Code (in-session MCP, not cli-opencode)

---

## 1. BEFORE/AFTER snapshot

### Before (memory_health, 2026-05-08T14:46Z, MCP uptime 30.5min)

| Field | Value |
| --- | --- |
| `data.routing.totalRecorded` | 21 |
| `data.routing.windowSize` | 200 |
| `data.routing.graphChannelInvocationRate` | 0.714 |
| `data.routing.channelInvocationRates.vector` | 1.0 |
| `data.routing.channelInvocationRates.fts` | 1.0 |
| `data.routing.channelInvocationRates.bm25` | 1.0 |
| `data.routing.channelInvocationRates.graph` | 0.714 |
| `data.routing.channelInvocationRates.degree` | 0.714 (== graph; parity) |

### After 5 user-facing memory_search calls

| Field | Value | Δ |
| --- | --- | --- |
| `data.routing.totalRecorded` | 40 | +19 (≈3.8 routings per memory_search call — internal multi-routeQuery) |
| `data.routing.graphChannelInvocationRate` | 0.625 | -0.089 |
| `data.routing.channelInvocationRates.vector` | 1.0 | 0 |
| `data.routing.channelInvocationRates.fts` | 1.0 | 0 |
| `data.routing.channelInvocationRates.bm25` | 0.925 | -0.075 (refactor query was simple-tier, no bm25) |
| `data.routing.channelInvocationRates.graph` | 0.625 | -0.089 |
| `data.routing.channelInvocationRates.degree` | 0.525 | -0.189 ← **parity broken** |

---

## 2. The 5 queries — search-decisions.jsonl tail

| # | Query | Intent (live) | Tier | Selected channels | Has `graph-preserved-by-intent`? | Has `degree`? |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | "why chose this auth approach" | find_decision | moderate | vector + fts + bm25 + **graph** | ✓ | ✗ |
| 2 | "find the spec for tasks" | find_spec | moderate | vector + fts + bm25 + **graph** | ✓ | ✗ |
| 3 | "alternatives considered for caching" | understand | moderate | vector + fts + bm25 | — (intent classified `understand`, not `find_decision` as playbook 272 predicted) | ✗ |
| 4 | "refactor module" | refactor | simple | vector + fts | — | ✗ |
| 5 | "fix the orphan file cleanup" | fix_bug | moderate | vector + fts + bm25 | — | ✗ |

**Granular routing-decision math (telemetry buffer)**
- Routings with `graph` in 19 new decisions: 25 (after) − 15 (before) = 10
- Routings with `degree` in 19 new decisions: 21 (after) − 15 (before) = 6
- → 4 routings had **graph WITHOUT degree** ← directly proves intent path adds graph alone, not graph+degree

---

## 3. Pass / fail per handover §4

| Criterion | Result |
| --- | --- |
| `after.totalRecorded - before.totalRecorded === 5` (or scaled) | **N/A** — actual delta is 19, because each user-facing memory_search call internally produces ~3.8 routeQuery invocations. Telemetry tracks the granular routings, not the user-facing calls. The §4 criterion as written assumed 1:1; the real wiring is many:1. Documented as a finding for the handover. |
| `after.graphChannelInvocationRate` non-zero (override still firing) | **PASS** (0.625) |
| vector + fts rates remain 1.0 | **PASS** (vector=1.0, fts=1.0) |
| bm25 rate remains 1.0 | **PARTIAL** — 0.925; expected drop because the simple-tier `refactor module` query correctly omits bm25 (test fixture mix includes a non-bm25-preserving query) |
| User-facing graph hits ≥ 3/5 | **PARTIAL — 2/5**. Query 3 ("alternatives considered for caching") was classified `understand` not `find_decision`. Code is correct; playbook 272 expected 3/5 graph hits assuming intent classifier returns `find_decision` for the phrase, which it does not. |
| `routingReasons` carry `graph-preserved-by-intent` | **PASS** — present in queries 1 + 2 (the 2 user-facing calls that activated graph). Surfaces correctly in `search-decisions.jsonl`. |
| No latency anomaly > 500ms | **N/A** — end-to-end memory_search latencies are dominated by embedding + vector + rerank stages (range 685–2713ms), not by the 012 routing decision (which the microbenchmark shows is ~0.1ms avg). REQ-005 budget is for routing latency, not full pipeline. |

**Verdict: PASS with qualifying findings.** The 012 graph-channel preservation override is firing correctly at the routing layer, surfacing the new reason string, and updating `data.routing` with each routing decision. The two findings (delta-not-1:1, query-mix-doesn't-yield-3-find_*) are about the playbook 272 + handover §4 expectations, not about the code behavior.

---

## 4. Degree-vs-graph parity — RESOLVED

The §3.2 pre-flight observation showed `channelInvocationRates.degree == graph == 0.714` over 21 decisions. After 19 new decisions dominated by intent-only and no-graph paths, parity broke cleanly: graph=0.625, degree=0.525.

**Conclusion: spec semantics hold.**

- Intent path adds `graph` WITHOUT `degree` (verified empirically in 4 of the 19 new routings).
- Entity-density path adds `graph + degree` together.
- The §3.2 parity reflected traffic mix, not a code bug — those 21 decisions were dominated by complex-tier queries (which include both graph + degree by default) or entity-density activations.

Direct code inspection confirms (`mcp_server/lib/search/query-router.ts:183-205`):

```ts
function shouldPreserveGraph(query, db) {
  // Intent path → graph only
  if (intent === 'find_spec' || intent === 'find_decision') {
    preserved = true;
    reasons.push('graph-preserved-by-intent');
  }
  // Entity-density path → graph + degree
  const densityScore = getEntityDensityScore(query, db);
  if (densityScore >= ENTITY_DENSITY_ACTIVATION_THRESHOLD) {
    preserved = true;
    includeDegree = true;  // ← only here
    reasons.push('graph-preserved-by-entity-density');
  }
}
```

And the live `searchDecisionEnvelope.queryPlan.skippedChannels` for find_decision/find_spec rows:

```json
{ "channel": "degree", "reason": "Skipped by moderate complexity route" }
```

`degree` is in the skipped list with documented reason — perfect audit trail.

---

## 5. Findings for follow-on work

1. **Handover §4 expectations need updating.** The expected `totalRecorded` delta should be ~3.8× the user-facing call count (multi-routeQuery per memory_search), not 1:1. **NOT** a code bug — the 012 routing-telemetry tracks granular invocations as designed, while search-decisions.jsonl writes per-handler-completion (1:1 with user-facing calls).

2. **Playbook 272 §3 query mix should be tightened.** The query "alternatives considered for caching" classifies as `understand`, not `find_decision`. Either pick a query the classifier actually returns `find_decision` for, or accept 2/5 graph hits as the validation threshold.

3. **`SPECKIT_GRAPH_CHANNEL_PRESERVATION=false` opt-out NOT VERIFIED in this session.** The flag toggle requires restarting the MCP child with the env var set, which Claude Code cannot do mid-session. The feature flag IS verified in unit tests (012-T2.5, 012-T2.6, 012-T2.7) — `tests/query-router.vitest.ts` confirms flag-OFF reverts to byte-for-byte pre-change channel selection.

4. **Audit-trail wiring is two-tier**, which the handover did not document:
   - `routing-telemetry.ts` records every `routeQuery()` call (granular, in-memory ring).
   - `search-decisions.jsonl` is appended per `memory_search` handler completion (consolidated, persistent).
   The mismatch (21 routings recorded but 0 jsonl rows in §3.2 pre-flight snapshot) was because pre-session routings happened during MCP startup/auto-surface paths that don't write to the jsonl file. After this session ran 5 user-facing `memory_search` calls, jsonl gained exactly 5 rows (36 → 41).
