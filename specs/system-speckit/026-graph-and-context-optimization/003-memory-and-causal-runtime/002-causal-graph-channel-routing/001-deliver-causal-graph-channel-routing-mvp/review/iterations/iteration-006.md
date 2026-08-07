# Deep Review Iteration 6 — Deep Correctness Pass

**Dimension:** correctness
**Focus:** Second-pass on highest-risk correctness areas (cache rebuild math, race conditions, boundary handling, TTL math, routeQuery override interactions)
**Date:** 2026-05-11
**Status:** complete

---

## Files Reviewed

| File | Lines | Purpose |
|------|-------|---------|
| entity-density.ts | 1-172 | Cache rebuild logic, TTL math, tokenization, error paths |
| query-router.ts | 1-396 | routeQuery flow, bm25+graph override composition, adjustedChannels aliasing |
| routing-telemetry.ts | 1-93 | recordInvocation dedup, snapshot rate math |
| query-plan.ts | 60-120 | selectedChannels copy semantics, routingReasons handling |
| entity-density.vitest.ts | 1-172 | Cache behavior tests, cold-start tests |
| query-router.vitest.ts | 1-658 | routeQuery integration, override composition, telemetry tests |

---

## Findings by Severity

### P1-C-001 [P1] `invalidateEntityDensityCache` never wired to `memory_save`/`memory_bulk_delete`

- **File:** entity-density.ts:146-154 (JSDoc + function body), no production callers
- **Evidence:** `grep 'invalidateEntityDensityCache'` across `mcp_server/lib/` returns zero hits. The function is defined, exported (line 167), and its JSDoc explicitly states "Wire into post-commit hooks (memory_save, memory_bulk_delete) when the cache becomes stale enough to mis-route." — but no production code ever invokes it. Only test files (`entity-density.vitest.ts`, `routing-telemetry-stress.vitest.ts`) call it (for test setup/teardown).
- **Impact:** After any `memory_save` or `memory_bulk_delete` that pushes a row's outgoing causal edge count to ≥3 (qualifying for entity-density), the entity-density cache remains stale for up to `CACHE_TTL_MS` (60s) until the next TTL-driven rebuild. During that window, `getEntityDensityScore()` returns 0 for terms matching the newly-qualifying row, suppressing the graph+degree channel activation that should occur per REQ-003.
- **Finding class:** cross-consumer — affects all `memory_save`/`memory_bulk_delete` callers that add high-degree causal edges.

#### Claim Adjudication (P1-C-001)

- **claim:** The entity-density cache invalidation hook is documented and exported but never wired to the post-commit callbacks it targets, causing up to 60s of incorrect channel routing after memory mutations.
- **evidenceRefs:** entity-density.ts:9, entity-density.ts:146-148, entity-density.ts:150-154, entity-density.ts:167
- **counterevidenceSought:** Searched all `.ts` files under `mcp_server/lib/` for any call to `invalidateEntityDensityCache` — zero production callers. Searched for `memory_save` callbacks/handlers that might wire the hook — none found.
- **alternativeExplanation:** The 60s TTL was deemed sufficient for production; the invalidation function was forward-looking scaffolding for a future precision upgrade that was never prioritized.
- **finalSeverity:** P1 — spec-code mismatch (JSDoc states wiring expectation), can cause incorrect channel selection (missing graph/degree) for up to 60s after qualifying DB mutations.
- **confidence:** 0.88
- **downgradeTrigger:** Evidence that `memory_save` frequency is so low in production that 60s staleness is acceptable per product requirements, OR discovery of a wrapper/hook we missed that does call it.

---

### P2-C-001 [P2] entity-density error path discards valid cached state — contradicts own comment

- **File:** entity-density.ts:109-114
- **Evidence:** The catch block comment at lines 110-111 says "Table missing or query failed — keep prior cache state, mark not-ok so we retry on next call rather than silently serving stale data." But the code at line 112 executes `cachedTerms = new Set()`, which **discards** the prior cache state rather than keeping it. The comment-tagged intent ("keep prior cache state") and the actual behavior (discard) are contradictory.
- **Impact:** On a transient DB error during a TTL-expired rebuild, the existing valid entity-density terms are thrown away. Combined with `lastBuildOk = false` (line 114), EVERY subsequent `getEntityDensityScore()` call triggers a fresh rebuild attempt (no backoff, per P2-008). If the DB remains unavailable, entity-density returns 0 for ALL queries — the graph channel is silently suppressed. Compare: if the comment's stated intent were implemented (keep prior cache), the entity-density signal would degrade gracefully, serving slightly-stale data instead of no data.
- **Finding class:** instance-only — single error handler in `refreshIfStale`.

#### Claim Adjudication (P2-C-001)

- **claim:** The entity-density error handler destroys valid cached terms on transient DB failures instead of preserving them, contradicting its own comment and causing a hard cutover to score=0 rather than graceful degradation.
- **evidenceRefs:** entity-density.ts:110-114
- **counterevidenceSought:** Looked for scenarios where discarding stale cache is the safer choice (e.g., corrupted DB causing wrong terms to be cached). The prior successful build was validated, so the cached data is trustworthy.
- **alternativeExplanation:** The comment is a documentation error — the code intentionally clears the cache because a failed build might have partially populated stale data. The term "prior cache state" in the comment refers to the empty set from the previous failed attempt, not the actual prior valid cache.
- **finalSeverity:** P2 — the intent-driven graph preservation path (via `classifyIntent`) still activates the graph channel even when entity-density returns 0. The entity-density signal is supplementary, so discarding it is a degradation, not a correctness failure.
- **confidence:** 0.82
- **downgradeTrigger:** Confirmation that the comment is a documentation error and the discard behavior is intentional (would change to a docs-only P2 finding).

---

### P2-C-002 [P2] No test coverage for entity-density rebuild failure after successful cache population

- **File:** entity-density.vitest.ts (scenario missing)
- **Evidence:** The test suite covers cold-start failure modes: null DB (line 118-121, test 012-ED-2.1), missing tables (line 131-136, test 012-ED-2.3), and empty causal_edges (line 122-128, test 012-ED-2.2). It covers successful cache build (line 148-157, test 012-ED-3.1) and forced invalidation + rebuild (line 159-171, test 012-ED-3.2). However, NO test covers: (1) populate cache via successful build, (2) cause the next `refreshIfStale` TTL-triggered rebuild to fail (e.g., drop a table after first build), (3) verify that `getEntityDensityScore` behavior is correct (either graceful stale-data fallback or safe zero-return).
- **Impact:** If the error-handling behavior changes (e.g., someone "fixes" the comment-code contradiction in P2-C-001), there is no regression test to catch unintended side effects.
- **Finding class:** instance-only — missing test scenario.

#### Claim Adjudication (P2-C-002)

- **claim:** The entity-density test suite lacks a test for the rebuild-failure-after-successful-cache scenario, creating regression risk for error-path changes.
- **evidenceRefs:** entity-density.vitest.ts:113-171 (all cache/error tests)
- **counterevidenceSought:** Checked whether the stress test file (`routing-telemetry-stress.vitest.ts`) covers this scenario — it does not; it only uses `invalidateEntityDensityCache` for test setup without testing the failure-recovery path.
- **alternativeExplanation:** The scenario is difficult to test with an in-memory SQLite DB (dropping tables mid-test requires careful state management), and the error path is simple enough that explicit test coverage was deprioritized.
- **finalSeverity:** P2 — test gap, not a production bug.
- **confidence:** 0.78
- **downgradeTrigger:** Discovery of an existing integration test elsewhere that covers this scenario.

---

## Non-Findings (Ruled Out)

### Correctness passes confirmed

| Area | Verdict | Evidence |
|------|---------|----------|
| TTL mid-call rebuild | No race | All DB operations synchronous; Node.js event loop serializes calls |
| Two-caller simultaneous rebuild | No correctness race | `buildIndex` and `refreshIfStale` are fully synchronous (better-sqlite3); P2-010 covers wasted-work concern |
| Zero-token / empty query | Correct | `getEntityDensityScore('') → 0` (line 129); `routeQuery('') → complex fallback` (test T27) |
| Single-token query | Correct by design | Threshold=2; single token cannot trigger entity-density (line 198) |
| Exact-match of stopword | Correct | `tokenize('the') → []` via STOPWORDS filter (line 43) |
| Both bm25 + graph overrides firing | Correct | Both compose additively; `enforceMinimumChannels` deduplicates; all 4-5 channels correctly emitted |
| Channel-list insertion order | Preserved | `[...new Set(channels)]` preserves insertion order per ES2015+ spec |
| adjustedChannels aliasing | Safe | `adjustedChannels` reassigned to new arrays at every mutation; `channels` only used for read-only `includes()` check; `buildRoutingQueryPlan` and `recordInvocation` both create defensive copies |
| 60s TTL math | ≤60s from last build | TTL measured from `lastBuiltAt`, not from `memory_save` event; max staleness = 60s minus time since last build; actual lag bounded by TTL unless invalidation not wired (see P1-C-001) |
| routingReasons dedup | Correct | `routingReasons` checked with `if (!routingReasons.includes(reason))` before push (line 332) |
| qualityFallback fallbackReason | Correct | `toFixed()` called on validated number; null-safe via `??` operator |

---

## Traceability Checks

| Protocol | Result | Notes |
|----------|--------|-------|
| spec_code | PASS | REQ-003 (entity-density), REQ-006 (cold-start safety) verified correct; REQ-003 invalidation wiring is missing (see P1-C-001) |
| checklist_evidence | PASS | Checklist item "Entity-density cache invalidates on memory_save" checked — but wiring is absent (P1-C-001) |

---

## Verdict

**CONDITIONAL** — hasAdvisories=true (0 P0, 1 P1, 2 P2)

The correctness dimension has ONE must-fix issue: `invalidateEntityDensityCache` is exported and documented for wiring to `memory_save`/`memory_bulk_delete` post-commit hooks but is never called in production code. This causes up to 60s of stale entity-density routing after DB mutations. The intent-driven graph preservation path provides a partial safety net, but the entity-density signal (REQ-003) is impaired.

Two P2 advisories: the error path discard-vs-comment contradiction, and missing test coverage for rebuild-after-failure.

All other correctness areas examined (TTL math, race conditions, boundary handling, override composition, aliasing) pass inspection.

---

## Next Dimension

All 4 dimensions covered (correctness ×2, security, traceability, maintainability). Recommend either:
- **stop** if P1-C-001 is the only remaining actionable correctness finding and no new dimensions remain
- **next focus: coverage gaps** — the test-gap findings (P2-C-002, plus prior TG findings from iter 2) suggest value in a dedicated coverage-gap pass

---

## Upgraded/Downgraded Prior Findings

None. All 23 prior findings (P1-001 through P2-023) retain their severity. No prior finding was confirmed as a false positive or downgraded.

---

## Graph Events

- `dimension_covered`: correctness (second pass) — deepened evidence
- `finding`: P1-C-001 (missing invalidation wiring)
- `finding`: P2-C-001 (error path discards cache — comment contradiction)
- `finding`: P2-C-002 (missing test for rebuild failure after success)
- `ruled_out`: RO-006-01 (TTL mid-call race — synchronous ops prevent it)
- `ruled_out`: RO-006-02 (adjustedChannels aliasing — defensive copies at every mutation)
- `ruled_out`: RO-006-03 (override composition conflicts — additive, deduped correctly)

---

## SCOPE VIOLATIONS

None.
