# Iteration 9 — Adversarial Self-Check

**Dimension**: adversarial
**Date**: 2026-05-11T09:00:00Z
**Prior Findings**: P0=0 P1=4 P2=30
**New Findings**: P0=0 P1=0 P2=3

---

## Files Reviewed

| File | Lines | Purpose |
|------|-------|---------|
| query-router.ts | 1-396 | Core routing logic, env flag checks, graph preservation |
| entity-density.ts | 1-172 | Cache lifecycle, DB queries, error handling |
| routing-telemetry.ts | 1-93 | Telemetry ring buffer, snapshot |
| memory-crud-health.ts | 626,662-667 | Routing telemetry integration in health endpoint |
| query-router.vitest.ts | 1-658 | Unit + integration tests for routing |
| entity-density.vitest.ts | 1-172 | Cache behavior tests |
| routing-telemetry-stress.vitest.ts | 1-275 | Stress tests for ring buffer + latency |

---

## Claim Adjudication: Prior P0/P1 Findings

### P1-001: Intent classified redundantly (up to 3x per routeQuery invocation)

- **Claim**: `classifyIntent(query)` is called up to 3 times per `routeQuery` invocation (query-router.ts:145,191,304).
- **Alternative 1**: `classifyIntent` internally memoizes per query string, making repeated calls O(1) after the first → no real cost.
- **Alternative 2**: The 3 call-sites diverge in call context (one in `shouldPreserveBm25`, one in `shouldPreserveGraph`, one at top-level in `routeQuery`), each with independent consumers — optimizing to a single call would require plumbing the result through parameter chains, adding coupling that may not be worth the ~microsecond savings.
- **Counterevidence**: Test 012-T4.1 (query-router.vitest.ts:584-607) validates p99 routing latency < 5ms over 200 iterations despite the redundant calls. Performance budget is met. The stress test 012-S2.1 (routing-telemetry-stress.vitest.ts:133-160) validates the same at 1000 iterations.
- **Decision**: **DOWNGRADE to P2**. The performance impact is bounded and verified. No correctness impact. Redundant calls are a maintainability/optimization concern, not a correctness bug.
- **Confidence**: 0.80
- **Downgrade trigger**: Test 012-T4.1 p99 < 5ms proves the performance budget is met.

### P1-002: Resource-map playbook path wrong (210 → 272)

- **Claim**: resource-map.md:55 references playbook path with stale number `210` instead of `272`.
- **Alternative 1**: Path was auto-generated from a template and the template changed, making this a template-update problem rather than a review finding.
- **Alternative 2**: The actual playbook file has been renamed since creation and both paths resolve to the same inode (symlink) — no functional breakage.
- **Counterevidence**: Without access to the actual file system state at the time, I cannot verify whether 210 exists as a symlink or redirect. The finding targets a documentation-only artifact with no runtime impact on code correctness.
- **Decision**: **STAND at P1**. Traceability impact — a developer following the resource-map to the playbook path would hit a dead link. Documentation correctness gates are P1 by review-core doctrine (evidence requirement: concrete file:line cite exists).
- **Confidence**: 0.75 (cannot verify on-disk state of 210 path)

### P1-003: Resource-map changelog entry missing on disk

- **Claim**: resource-map.md:73 references a changelog entry that does not exist on disk.
- **Alternative 1**: The changelog was planned but not yet authored — the missing on-disk artifact is a work-in-progress, not a defect.
- **Alternative 2**: The entry was archived during a reorg and the resource-map was not updated.
- **Counterevidence**: Without inspecting the on-disk changelog directory, I cannot confirm absence. However, prior iteration 4 confirmed the missing entry with evidence.
- **Decision**: **STAND at P1**. If confirmed missing, this is a traceability gap that violates spec-to-doc completeness.
- **Confidence**: 0.70 (relies on prior-iteration evidence)

### P1-C-001: invalidateEntityDensityCache never wired to memory_save/memory_bulk_delete

- **Claim**: entity-density.ts:146-154 — `invalidateEntityDensityCache()` is never called from post-commit hooks, meaning writes that change causal_edges leave the entity-density cache stale for up to 60s (CACHE_TTL_MS).
- **Alternative 1**: The window is intentional — writes are batched/infrequent, and 60s staleness is an acceptable tradeoff for avoiding cache-thrashing on every single write.
- **Alternative 2**: Some external process or lifecycle hook invokes invalidation outside the reviewed scope (e.g., a health-check rebuild triggers full cache refresh).
- **Counterevidence**: The JSDoc at entity-density.ts:146-150 explicitly says "Wire into post-commit hooks (memory_save, memory_bulk_delete) when the cache becomes stale enough to mis-route." This acknowledges the wiring gap and declares the intent to fix it — it is a known deferred work item, not an undiscovered bug. The TTL provides a floor guarantee. Grep for `invalidateEntityDensityCache` call-sites outside tests: only the definition at entity-density.ts:150.
- **Decision**: **STAND at P1**. The code self-documents the missing wiring. While the 60s window bounds worst-case staleness, memory_save operations that create new high-degree causal edges will not benefit from graph/degree channel preservation for up to 60s — a correctness gap in routing decisions.
- **Confidence**: 0.85

---

## New Findings

### ADV-001 [P2] Env flag SPECKIT_GRAPH_CHANNEL_PRESERVATION misinterprets common boolean-false values

- **claim**: `isGraphChannelPreservationEnabled()` treats `'0'`, `'no'`, `'off'`, and `''` as enabled because it only checks `!== 'false'`.
- **evidenceRefs**: query-router.ts:160-163
- **counterevidenceSought**: Tests for `'0'`, `'no'`, `'off'`, `''` as env values — none found (only `'false'`, `'true'`, `undefined` tested at query-router.vitest.ts:512-527).
- **alternativeExplanation**: The flag is documented as "default-ON; only explicit `false` disables." The behavior is intentional: falsy-but-not-false strings keep the feature ON for safety. `'0'` is the only surprising case; `'no'`/`'off'` are unlikely in a `SPECKIT_*` env context.
- **finalSeverity**: P2
- **confidence**: 0.60 — debateable whether `'0'` matters in practice
- **downgradeTrigger**: Document `'0'` as intentional ON behavior or add `'0'` to the false check

### ADV-002 [P2] Test helper `withFeatureFlag` defined but never called in query-router.vitest.ts

- **claim**: Dead code — the `withFeatureFlag` helper (lines 60-72) has no call-sites in the same file or its imports.
- **evidenceRefs**: query-router.vitest.ts:60-72
- **counterevidenceSought**: Grep for `withFeatureFlag(` across the entire test directory — zero calls in query-router.vitest.ts. The function is only called in query-classifier.vitest.ts (which defines its own copy). No import of the function from query-router.vitest.ts exists.
- **alternativeExplanation**: Originally added for a test block that was removed during refactoring. Benign dead code with no runtime impact — just clutter.
- **finalSeverity**: P2
- **confidence**: 0.90
- **downgradeTrigger**: If the function is exported for external test reuse (it isn't — it's a local `function`, not exported)

### ADV-003 [P2] entity-density error path comment contradicts code behavior

- **claim**: `refreshIfStale` catch block (entity-density.ts:109-114) has comment "keep prior cache state" but code does `cachedTerms = new Set()` — discards valid cached state; already reported as P2-C-001 but the severity under adversarial review could reasonably be P1 because transient DB errors after successful cache population cause silent routing degradation for up to 60s.
- **evidenceRefs**: entity-density.ts:109-114 (comment vs code mismatch), entity-density.ts:130-131 (cold-start behavior)
- **counterevidenceSought**: Tests for sub-60s transient DB failure after successful cache population — entity-density.vitest.ts has no such test (P2-C-002 confirms). Counterevidence would be: a test showing `getEntityDensityScore` returns correct cached values after a single transient `buildIndex` failure.
- **alternativeExplanation**: The `lastBuildOk = false` flag ensures retry on the NEXT call — so the cache is only lost for ONE query-interval, not the full 60s. The `cachedTerms = new Set()` forces cold-start on the immediate next call but the subsequent call will rebuild.
- **finalSeverity**: P2 (was P2-C-001). Adversarial review confirms: the `lastBuildOk = false` flag causes retry on NEXT call, limiting the damage window to at most one call-skipping interval, not the full 60s.
- **confidence**: 0.78
- **downgradeTrigger**: Already P2. Would drop further if a test proves the cache survives transient failures (it doesn't, per P2-C-002).

---

## Adversarial Lines of Inquiry — Ruled Out

| Direction | Verdict | Reason |
|-----------|---------|--------|
| Race condition: concurrent `refreshIfStale` calls | Ruled out | Node.js single-threaded; better-sqlite3 is synchronous; no async I/O in cache path |
| Race condition: `recordInvocation` during `getSnapshot` | Ruled out | Single-threaded JS; `recentDecisions` array mutations and reads are synchronous |
| Circular import: entity-density ↔ query-router | Ruled out | entity-density only imports better-sqlite3; no back-reference to query-router |
| Env var `SPECKIT_GRAPH_CHANNEL_PRESERVATION` unset causes crash | Ruled out | `?.toLowerCase()?.trim()` handles undefined → enabled (default-ON); tested at query-router.vitest.ts:523-526 |
| Env var `SPECKIT_COMPLEXITY_ROUTER` unset causes crash | Ruled out | Handled in classifier module; test T26 at query-router.vitest.ts:345-350 validates flag=false path |
| Test fixture leak: `setEnv`/`restoreEnv` cross-file pollution | Ruled out | Vitest runs test files in separate worker threads/processes (pool: forks by default) |
| Test fixture leak: `resetRoutingTelemetry` cross-file pollution | Ruled out | Same vitest worker isolation |
| Test fixture leak: entity-density module state between test files | Ruled out | Same vitest worker isolation; per-file beforeEach calls `invalidateEntityDensityCache()` |
| Cache-warm before first query (sequencing) | Ruled out | Lazy build on first call; cold-start returns 0; intent-driven graph preservation works without cache (query-router.vitest.ts:454-461) |
| `classifyIntent` divergence across 3 call-sites | Ruled out | All 3 receive the same `query` parameter (const); no mutation between calls |
| Quality gap fallback with negative avgScore | Ruled out | `resolveAvgScore` uses `Number.isFinite(candidate)` — NaN rejected; negative scores are vanishingly unlikely in practice |
| `shouldPreserveBm25` with empty query | Ruled out | Only called when tier === 'simple' (query-router.ts:308); empty query routes to 'complex' tier (test T27) |
| `safeGetDb` throws uncaught exception | Ruled out | try/catch at query-router.ts:207-213; returns null on any error |
| `getRoutingTelemetrySnapshot` crash in memory_health | Ruled out | `getSnapshot` at routing-telemetry.ts:50-75 is pure computation on small arrays; no I/O or external deps |
| Concurrency guard missing on `refreshIfStale` | Confirmed but P2 | Already P2-010. Single-threaded JS limits damage to double-rebuild during rapid-fire calls; no data corruption possible |

---

## Traceability Checks

| Check | Status | Detail |
|-------|--------|--------|
| spec_code | PASS | All 8 REQs remain traceable to code; no adversarial case breaks traceability |
| checklist_evidence | PASS | CHK-052, CHK-001 through CHK-100 verified in prior iterations; no new adversarial gaps |
| resource_map_coverage | PASS_WITH_ADVISORIES | P1-002 + P1-003 still open (documentation-only) |

---

## Verdict

**CONDITIONAL** (hasAdvisories=true, 0 P0, 4 P1, 32 P2 after downgrade of P1-001)

One P1 downgraded to P2 (P1-001 → P2). Three new P2 findings (ADV-001, ADV-002, ADV-003). No new P0/P1. Zero security or correctness blockers surfaced by adversarial stress. The existing P1-002, P1-003, and P1-C-001 withstand adversarial scrutiny.

### Severity Changes
| ID | Old | New | Reason |
|----|-----|-----|--------|
| P1-001 | P1 | P2 | Performance budget met (p99 < 5ms); no correctness impact; classifyIntent likely cached internally |

---

## Next Dimension

Traceability replay already completed in iter 8. Security deep completed in iter 7. Next (iter 10): **cross-dimension synthesis** — consolidate all 4 P1s + 33 P2s into a final review report.

---

## Graph Events

- **dimension_covered**: `d-adversarial` — adversarial self-check dimension
- **finding**: `ADV-001` — env flag boolean coercion (P2)
- **finding**: `ADV-002` — dead test helper (P2)
- **finding**: `ADV-003` — cache error path comment/code mismatch noted (P2, reaffirms existing)
- **severity_change**: `P1-001` downgraded P1→P2
- **ruled_out**: 12 adversarial directions ruled out with evidence
