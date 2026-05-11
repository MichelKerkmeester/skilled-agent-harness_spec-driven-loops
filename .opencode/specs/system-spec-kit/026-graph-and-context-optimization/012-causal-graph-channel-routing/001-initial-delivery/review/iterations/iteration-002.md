---
title: "Deep Review Iteration 2 — Correctness Pass"
iteration: 2
dimension: correctness
mode: review
session_id: "2026-05-11T05:42:00Z"
timestamp: "2026-05-11T06:03:17Z"
verdict: CONDITIONAL
hasAdvisories: true
---

# Iteration 2: Correctness — `shouldPreserveGraph` + `routeQuery` Override

## Dimension

**Correctness** — logic errors, off-by-one, broken invariants, return types, cold-start safety, env-flag short-circuit.

## Files Reviewed

| File | Lines | Focus |
|------|-------|-------|
| `query-router.ts` | 1-396 | `shouldPreserveGraph` (183-205), `routeQuery` override (308-335), env-flag (160-163), feature-flag-disabled bypass (268-300) |
| `entity-density.ts` | 1-172 | `getEntityDensityScore` (128-143), cache rebuild `refreshIfStale` (95-116), cold-start null-path (96-99) |
| `routing-telemetry.ts` | 1-93 | `recordInvocation` (29-36), `getSnapshot` math (50-75), window-size behavior with <WINDOW_SIZE decisions |
| `memory-crud-health.ts` | 626 | `getRoutingTelemetrySnapshot` integration |
| `query-router.vitest.ts` | 412-608 | 012-T1.* (shouldPreserveGraph), 012-T2.* (integration), 012-T3.* (telemetry), 012-T4.* (latency) |
| `entity-density.vitest.ts` | 1-172 | 012-ED-1.* (lookup), 012-ED-2.* (cold-start), 012-ED-3.* (cache) |

## Correctness Questions Answered

### Q1: Does `shouldPreserveGraph` return correct results for every intent label?

**YES.** The intent gate at `query-router.ts:192` covers `find_spec` and `find_decision` exactly — both produce `preserved=true` with reason `graph-preserved-by-intent`. All other intents (`understand`, `refactor`, `fix_bug`, `add_feature`, `security_audit`) fall through to the entity-density check at `query-router.ts:197-201`. This matches the spec design: intent-gate is narrow (mirrors `shouldPreserveBm25`), entity-density gate is the broad path for any intent when term matches fire.

Edge cases verified:
- Empty query `''` → `tokenize('')` returns `[]` → `queryTokens.size === 0` → returns 0 hits. Intent classifier returns something other than `find_spec`/`find_decision` for empty string → `preserved=false`. Test 012-T1.4 confirms. **CORRECT.**
- Null DB → intent path still activates (012-T1.5), entity-density scores 0 (012-ED-2.1). **CORRECT.**

### Q2: Does the override at 308-335 mutate channel lists in a consistent order?

**YES.** The bm25 override (line 308-310) runs first, then the graph override (line 325-335) runs second. Both use `enforceMinimumChannels()` which deduplicates via `new Set`. The spread operator `...adjustedChannels` preserves existing order; `...additions` appends new channels. Resulting order is always: `[vector, fts, <bm25 if added>, graph, <degree if entity-density>]`. Deterministic. No order-dependent bugs.

### Q3: Is the bm25 + graph override interaction commutative?

**YES for channel SET** — both overrides use dedup, so the set of channels is identical regardless of order. **NO for channel ORDER** — bm25 always precedes graph (bm25 override runs first). But the order is deterministic and has no semantic effect downstream (`runChannelSubset` iterates channels independently). **NOT a correctness issue.**

### Q4: Does entity-density cache rebuild lock-step with the 60s TTL? Race conditions?

**No concurrency bug in single-threaded Node.js.** `refreshIfStale` (`entity-density.ts:95-116`) and `getEntityDensityScore` (`entity-density.ts:128-143`) are fully synchronous — no `await`, no callbacks. Between the staleness check and the `cachedTerms` reassignment, no other JS can run. The atomic reference swap (`cachedTerms = buildIndex(db)` at line 106 followed by `lastBuiltAt = now` at line 107) is safe because there is no interruption point.

**However:** the error path has a persistent-retry issue. When `buildIndex` throws, the catch block sets `lastBuildOk = false` and `lastBuiltAt = now`. The guard `lastBuildOk && now - lastBuiltAt < CACHE_TTL_MS` short-circuits to `false` (because `lastBuildOk` is false), so every subsequent `getEntityDensityScore` call retries the failing query — no backoff, no throttle. See finding **P2-008**.

### Q5: Does telemetry snapshot return correct rates when window has fewer than WINDOW_SIZE decisions?

**YES.** `routing-telemetry.ts:59`: `const total = recentDecisions.length`. The rate calculation at line 65 uses `counts[channel] / total`. Test 012-T3.1: 5 decisions, 2 with graph → `graphRate = 2/5 = 0.4`. The `total > 0` guard at line 63 prevents division by zero on empty window. The `windowSize` field returns the constant `WINDOW_SIZE` (200), not the current fill level — this is by design (it's the window capacity, not window occupancy). **CORRECT.**

### Q6: Does `getEntityDensityScore` correctly score 0 for cold-start?

**YES.** Three cold-start paths, all tested:
- Null DB (`entity-density.ts:96-99`): `refreshIfStale(null)` → sets empty `cachedTerms` → `cachedTerms.size === 0` → return 0. Test 012-ED-2.1.
- Empty `causal_edges` table: `buildIndex` returns empty `Set` → size 0 → return 0. Test 012-ED-2.2.
- Missing tables: `buildIndex` throws → catch sets empty `cachedTerms` → size 0 → return 0. Test 012-ED-2.3.

No throw. No false activation. **CORRECT — REQ-006 satisfied.**

### Q7: Does `routeQuery` short-circuit correctly when complexity-router disabled?

**YES.** `query-router.ts:268`: `if (!isComplexityRouterEnabled())` returns ALL_CHANNELS immediately at line 293 before any preservation override code runs. The graph preservation block at line 325 is unreachable when the flag is off. Test 012-T2.5: setting `SPECKIT_GRAPH_CHANNEL_PRESERVATION=false` while complexity router is ON → graph disabled. Test T23-T26: complexity router OFF → ALL_CHANNELS returned. **CORRECT.**

### Q8: Are there off-by-one errors in any threshold comparison?

**NO.** All thresholds verified:

| Threshold | Value | Comparison | Correctness |
|-----------|-------|------------|-------------|
| `ENTITY_DENSITY_ACTIVATION_THRESHOLD` | 2 | `score >= 2` at `query-router.ts:198` | Spec says "≥2 query terms". Test 012-T1.3 (null DB, score=0) not activated. ✓ |
| `MIN_OUTGOING_EDGES` | 3 | `HAVING COUNT(*) >= 3` at `entity-density.ts:78` | Spec says "≥3 outgoing causal_edges". Test 012-ED-1.3 (2 edges) scores 0. ✓ |
| `WINDOW_SIZE` | 200 | `length > 200` at `routing-telemetry.ts:33` | Keeps most recent 200. When 201st arrives, shifts to keep 200. ✓ |
| `QUALITY_GAP_AVG_SCORE_THRESHOLD` | 0.20 | `avgScore < 0.20` at `query-router.ts:231` | Strict `<`. Test 006-T1.1: 0.20 → not engaged, 0.19 → engaged. ✓ |
| p99 index | — | `Math.floor(N * 0.99) - 1` at test 012-T4.1:584 | N=200, floor(198)-1=197 → index 197/0-based → 198th value. ✓ |

## New Findings

### P2-008 [P2] Entity-density error path lacks retry backoff

- **File:** `entity-density.ts:105-116`
- **Evidence:** In `refreshIfStale`, the catch block sets `lastBuildOk = false` and `lastBuiltAt = now` (line 112-113). The staleness guard at line 102 — `lastBuildOk && now - lastBuiltAt < CACHE_TTL_MS` — evaluates to `false` unconditionally when `lastBuildOk` is false (short-circuits on `&&`). This means every `getEntityDensityScore` call within 60s after a failed `buildIndex` will re-execute the failing DB query with no throttle or backoff. The result is correct (score=0 via `cachedTerms.size === 0` at line 131), but persistent schema errors (e.g., `causal_edges` table not yet created) cause wasteful repeated SQL queries on every routing decision.
- **Finding class:** instance-only
- **Scope proof:** `refreshIfStale` is the only cache-rebuild site. The error path is the only code that sets `lastBuildOk = false` while updating `lastBuiltAt`. No other codepaths share this pattern.
- **Affected surface hints:** ["entity-density cache rebuild", "getEntityDensityScore cold path"]
- **Recommendation:** Either (a) do NOT update `lastBuiltAt` in the catch block (so `lastBuiltAt` stays at its prior value from the last successful build, extending the retry window only to the next staleness check), or (b) introduce a separate `lastErrorAt` timestamp with an error-specific backoff (`if (lastBuildOk===false && now - lastErrorAt < ERROR_BACKOFF_MS) return`).

### P2-009 [P2] `routingReasons` mislabels intent-triggered BM25 preservation as "authority-artifact"

- **File:** `query-router.ts:144-152` (trigger), `query-router.ts:312-318` (label)
- **Evidence:** `shouldPreserveBm25` at line 146 returns `true` when intent is `find_spec` or `find_decision`, short-circuiting before the artifact-class check at line 150. However, the reason string emitted at line 317 is `'bm25-preserved-for-authority-artifact'` regardless of which branch triggered the preservation. When a query like `"find decision record"` triggers bm25 preservation via intent (not artifact class), operators reviewing `routingReasons` see a misleading label that implies artifact-class matching.
- **Finding class:** instance-only
- **Scope proof:** The reason string `'bm25-preserved-for-authority-artifact'` appears only at `query-router.ts:317`. No other code references or transforms this string. The `shouldPreserveBm25` function has exactly two return paths (intent and artifact). Only the artifact path would justify the label.
- **Affected surface hints:** ["routingReasons audit trail", "bm25-preserved-for-authority-artifact reason"]
- **Recommendation:** Split the reason string into two labels: `'bm25-preserved-by-intent'` for the intent path (line 146) and `'bm25-preserved-for-authority-artifact'` for the artifact-class path (line 150-151). Alternatively, if the current single-label behavior is intentional, document the override in the label comment.

## Confirmed / Upgraded / Downgraded Prior Findings

| ID | Prior Severity | Action | Rationale |
|----|---------------|--------|-----------|
| P1-001 | P1 | **Confirmed** — intent classified 3x per routeQuery | Traced: line 304 (1st), line 308 via shouldPreserveBm25 (2nd), line 326 via shouldPreserveGraph (3rd). The intent at line 304 is stored but not reused by the bm25/graph checks. |
| P2-001 | P2 | **Confirmed** — ChannelName duplicated | Both `query-router.ts:35` and `routing-telemetry.ts:14` declare identical types. Not a correctness issue; maintainability only. |
| P2-002 | P2 | **Confirmed** — `Array.shift()` not ring buffer | `routing-telemetry.ts:34` — O(n) shift for O(1) buffer. No correctness impact on window <200. |
| P2-003 | P2 | **Confirmed** — `shouldPreserveGraph` does not self-gate | The gate is at the call site (`query-router.ts:325`), not inside the function. The function is correct when called; the missing self-gate is a defensive-coding gap. |
| P2-004 | P2 | **Confirmed** — no try/catch at `memory-crud-health.ts:626` | `getRoutingTelemetrySnapshot` does only synchronous array ops (cannot throw barring runtime corruption). Impact is LOW. No upgrade needed. |

No prior findings were upgraded or downgraded.

## Test Gaps Identified

| Gap | Description |
|-----|-------------|
| TG-002-1 | **Entity-density integration path in `routeQuery` is untested with a real DB.** All 012-T2 integration tests use `shouldPreserveGraph(query, null)` because `safeGetDb()` throws in the test environment (no vector DB). The full integration path — `routeQuery` → `safeGetDb()` → `shouldPreserveGraph(query, realDb)` → `getEntityDensityScore(query, realDb)` → entity-density activation — has no integration test. Unit tests in `entity-density.vitest.ts` cover `getEntityDensityScore` directly but not the full chain through `routeQuery`. |
| TG-002-2 | **Persistent `buildIndex` failure retry behavior is untested.** 012-ED-2.3 verifies missing tables return score 0 without throwing, but does not verify that subsequent calls to `getEntityDensityScore` continue to retry the query (or that they should not). |
| TG-002-3 | **`shouldPreserveBm25` artifact-class-only path has no test.** All `find_decision`/`find_spec` queries trigger the intent branch first. No test specifically verifies bm25 preservation from artifact class alone (where intent is NOT `find_spec`/`find_decision` but the query matches `BM25_PRESERVING_ARTIFACTS`). |

## Traceability Checks

| Protocol | Result | Evidence |
|----------|--------|----------|
| **spec_code** (core) | PASS | REQ-001 → `shouldPreserveGraph` at `query-router.ts:183-205`; REQ-002 → `routeQuery` override at `query-router.ts:325-335`; REQ-003 → `getEntityDensityScore` at `entity-density.ts:128-143`; REQ-004 → `recordInvocation`/`getSnapshot` at `routing-telemetry.ts:29-75`; REQ-006 → cold-start paths in `entity-density.ts:96-99,129-131`; REQ-008 → `isGraphChannelPreservationEnabled` at `query-router.ts:160-163`. |
| **checklist_evidence** (core) | PASS | CHK-020 → 012-T1.1/.2; CHK-021 → 012-T2.1/.2; CHK-022 → 012-ED-1.*; CHK-023 → 012-T3.1; CHK-024 → 012-T4.1; CHK-025 → 012-ED-2.*; CHK-028 → REQ-006/REQ-007 tests exist. |
| **skill_agent** (overlay) | SKIPPED | Deferred to traceability pass (iteration 4). |
| **agent_cross_runtime** (overlay) | SKIPPED | Deferred. |
| **feature_catalog_code** (overlay) | SKIPPED | Deferred. |
| **playbook_capability** (overlay) | SKIPPED | Deferred. |

## Verdict

**CONDITIONAL** (`hasAdvisories=true`). The implementation is functionally correct — all 8 correctness questions resolve to YES or NO-ISSUE. No P0 or P1 correctness bugs found. Two P2 advisories exist: entity-density error-path retry without backoff (P2-008) and bm25 routing-reason label mismatch (P2-009). Neither affects production correctness or safety. Three test gaps are noted but do not represent spec non-compliance.

## Next Dimension

**Iteration 3 → Security:** SQL safety in entity-density cache build, env-flag enforcement, unbounded growth / DoS surfaces, log injection via reason strings, secret/PII exposure via telemetry snapshot.
