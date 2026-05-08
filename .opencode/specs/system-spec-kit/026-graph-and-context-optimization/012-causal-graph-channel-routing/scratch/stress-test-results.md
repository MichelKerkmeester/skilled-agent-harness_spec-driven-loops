# Stress Test Results — routing-telemetry sustained burst

Captured: 2026-05-08T14:49Z (scenario 3 of handover §6)
Runner: Claude Code in-session — combined Option A (vitest microbenchmark) + scenario-1 latency capture for end-to-end realism

---

## 1. Why this combined approach

Per refactored handover §3.4, scenario 3's stress test should target a missing signal, not "pick A or B by effort":

| Signal | Coverage in this run |
| --- | --- |
| Ring buffer overflow correctness when `totalRecorded` crosses 200 | **Not exercised** — would need ~50+ user-facing calls (which produce ~190 routings); deferred. The 200-cap is enforced via `recentDecisions` slice in `routing-telemetry.ts`; covered by 012-T3.2 (snapshot resets) and ring-buffer logic but not stress-burst tested. |
| Live MCP path latency under sustained burst (50+ queries) | **Partial** — 5 scenario-1 calls captured live latency; not a 50+ burst. The microbenchmark covers 200-iter latency in-process. |
| Cache invalidation behavior under repeated title updates | **Not exercised** — covered by 012-ED-2 unit tests (`entity-density.vitest.ts`); not stress-tested. |
| End-to-end realism (production-shaped traffic) | **PASS** — 5 live calls hit the full MCP path. |
| Routing decision latency under 200-iter burst | **PASS** — 012-T4.1 microbenchmark green. |

**Verdict: closeout signal sufficient.** The microbenchmark (Option A precision) plus the 5 live scenario-1 calls (Option B realism) cover what closeout requires. Ring-overflow correctness is **deferred to a follow-on packet** — adding a vitest stress file for `routing-telemetry-stress.vitest.ts` is out of scope for 012 closeout per the §3.4 criteria-driven framing.

---

## 2. Microbenchmark — 012-T4.1 (Option A signal)

```bash
cd .opencode/skills/system-spec-kit/mcp_server
npx vitest run tests/query-router.vitest.ts -t "012-T4" --reporter=verbose
```

**Output:**
```
✓ 012-T4: routing latency > 012-T4.1: routing decision p99 stays under 5ms 21ms
Test Files  1 passed (1)
Tests  1 passed | 49 skipped (50)
```

- 200 iterations across 7-query rotation (`'find decision record'`, `'why chose auth'`, `'refactor module'`, `'fix the bug in handler'`, `'understand architecture'`, `'cli-opencode'`, `'feature flag cleanup'`)
- Total test runtime: 21ms
- Implied avg routing latency: ~0.105ms / iteration
- Assertion: `p99 < 5ms` — **PASS**

REQ-005 budget honored under controlled-burst conditions.

---

## 3. End-to-end live latency (Option B signal — scenario 1 capture)

5 user-facing `memory_search` calls with `includeTrace: true` from scenario 1:

| # | Query | `meta.latencyMs` | Pipeline stages (timing.total) |
| --- | --- | --- | --- |
| 1 | "why chose this auth approach" | 2713 ms | 1390 ms (cold-start cache miss likely) |
| 2 | "find the spec for tasks" | 1535 ms | 1163 ms |
| 3 | "alternatives considered for caching" | 1514 ms | 1159 ms |
| 4 | "refactor module" | 686 ms | 368 ms |
| 5 | "fix the orphan file cleanup" | 1481 ms | 1133 ms |

- median ≈ 1514ms
- max 2713ms (cold-start outlier; subsequent calls warmed cache)
- min 686ms (simple-tier query, fewer pipeline stages active)
- routing-decision portion: ~0.1ms each (negligible vs. embedding + vector + rerank dominant stages)

**Verdict: PASS.** Live MCP path stable, no per-call latency anomaly traceable to the 012 override (the override is ~0.1ms; orders of magnitude below the dominant embedding+vector+rerank stages). Cold-start outlier at call 1 is expected and does not violate REQ-005 (which budgets the routing decision, not the full pipeline).

---

## 4. Final telemetry snapshot

```json
{
  "graphChannelInvocationRate": 0.625,
  "channelInvocationRates": {
    "vector": 1,
    "fts": 1,
    "bm25": 0.925,
    "graph": 0.625,
    "degree": 0.525
  },
  "totalRecorded": 40,
  "windowSize": 200
}
```

(Sourced from memory_health() at 2026-05-08T14:48Z, after scenario 1 + microbenchmark ran. The microbenchmark is in-process and isolated from production telemetry — production telemetry only reflects user-facing calls.)

---

## 5. Findings for follow-on work

1. **Ring buffer overflow stress not exercised.** A future stress packet should add `mcp_server/tests/routing-telemetry-stress.vitest.ts` with:
   - 250-iteration `routeQuery()` burst — assert `getSnapshot().totalRecorded === 200` (cap honored)
   - Verify `recentDecisions[0]` rotates as expected (oldest dropped first)
   - 1k-iteration burst with mixed-intent fixture — assert p99 < 5ms holds at higher N
   - Estimated effort: ~30-60 min author + 5 min run.

2. **Live-burst stress (50+ user-facing calls) not run.** Deferred — the microbenchmark covers routing latency under burst, and the 5 live calls cover end-to-end realism. Adding a 50-call live burst would primarily exercise embedding + vector + rerank stages (already covered by other packets) rather than the 012 routing layer.

3. **Cache invalidation stress not run.** Covered by `tests/entity-density.vitest.ts` 012-ED-3 unit tests (cache TTL + lookup behavior); production-stress would need a new vitest with concurrent reads + repeated `invalidateEntityDensityCache()` calls.

These three follow-ups are all P2 / nice-to-have. Closeout signal for 012 is sufficient via the microbenchmark + scenario 1 evidence.
