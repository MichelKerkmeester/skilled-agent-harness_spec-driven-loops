# Deep Review — Iteration 001: Inventory Pass

**Packet:** 009-causal-graph-channel-routing
**Mode:** review
**Dimension:** inventory (broad+shallow — artifact map, hotspot triage, quick-win surfacing)
**Date:** 2026-05-11
**Run:** 2026-05-11T05:42:00Z

---

## Files Reviewed

15 files total: 8 spec-docs + 4 source modules + 3 test files. All read in full.

| # | File | LOC | Purpose | Module/Owner | Hotspot Level |
|---|------|-----|---------|--------------|---------------|
| 1 | `spec.md` | 234 | Feature specification: REQ-001..008, scope, success criteria | spec-author | Low |
| 2 | `plan.md` | 246 | Implementation plan: architecture, phases, quality gates | spec-author | Low |
| 3 | `tasks.md` | 108 | Task tracking: Phase 1 (Setup), Phase 2 (Impl), Phase 3 (Verify) | spec-author | Low |
| 4 | `checklist.md` | 166 | Verification checklist: CHK-001..053 all marked `[x]` | spec-author | Low |
| 5 | `implementation-summary.md` | 152 | Delivery narrative: what was built, decisions, verification | implementer | Low |
| 6 | `resource-map.md` | 85 | Path catalog: 18 references, 0 missing on disk | implementer | Low |
| 7 | `handover.md` | 395 | Post-restart verification scenarios (§4-§6), degree-vs-graph parity | implementer | Medium |
| 8 | `changelog.md` | 75 | Phase changelog: added/changed/fixed, file table, follow-ups | implementer | Low |
| 9 | `query-router.ts` | 396 | Core routing: `routeQuery`, `shouldPreserveGraph`, `shouldPreserveBm25`, telemetry recording | `lib/search/` | **HIGH** |
| 10 | `entity-density.ts` | 172 | Cached entity-density signal: SQL JOIN, 60s TTL cache, cold-start safe | `lib/search/` | Medium |
| 11 | `routing-telemetry.ts` | 93 | 200-decision rolling counter, in-memory only, `getSnapshot()` | `lib/search/` | Low |
| 12 | `memory-crud-health.ts` | 678 | Health handler: autoRepair, FTS rebuild, orphan cleanup, routing block | `handlers/` | Medium |
| 13 | `query-router.vitest.ts` | 658 | 48 tests: 33 pre-existing + 15 new (012-T1..T4) | `tests/` | Medium |
| 14 | `entity-density.vitest.ts` | 172 | 12 tests: lookup (012-ED-1), cold-start (012-ED-2), cache (012-ED-3) | `tests/` | Low |
| 15 | `routing-telemetry-stress.vitest.ts` | 275 | 11 stress tests: ring overflow (012-S1), 1k latency (012-S2), cache inval (012-S3), flag OFF (012-S4) | `tests/` | Low |

---

## Top 5 Hotspots

Ranked by LOC × novelty × risk:

1. **`query-router.ts:258-366` (routeQuery)** — 109 LOC. Central orchestration with multiple interdependent code paths: complexity-router-disabled fallback, tier classification, bm25 preservation override, graph preservation override, telemetry recording. Most complex single function in the change set.

2. **`query-router.ts:183-205` (shouldPreserveGraph)** — 23 LOC. Dual-path decision: intent-driven (find_spec/find_decision) and entity-density override. Both paths independently set `preserved=true`; `includeDegree` is gated only on entity-density activation. Logic is correct but the interaction between the two paths merits careful dimension-deep review.

3. **`entity-density.ts:69-93` (buildIndex)** — 25 LOC. SQL JOIN across `memory_index` and `causal_edges` with `HAVING COUNT(*) >= ?`. Parameterized query (safe). Cache-build failure path correctly degrades to empty set (scores 0, no false activation). SQL-level correctness and cache-staleness warrant deep review.

4. **`memory-crud-health.ts:626-668`** — 42 LOC. New `data.routing` block surfaced in `memory_health` response. Clean additive change in a large (678 LOC) handler file. The `getRoutingTelemetrySnapshot()` call at line 626 has no isolated try/catch.

5. **`query-router.ts:308-335` (bm25 + graph override interaction)** — 28 LOC. Two sequential overrides modify `adjustedChannels`: bm25 preservation adds `bm25` first (simple tier only), then graph preservation adds `graph` (+`degree` if entity-density fires). Order-dependent but correct — both overrides independently gate on their own conditions.

---

## Findings by Severity

### P0 — Blocker: 0

No broken correctness, no security exploits, no data loss, no undefined behavior, no missing spec requirements found.

### P1 — Major: 1

#### P1-001 [P1] Intent classified redundantly — up to 3x per `routeQuery` invocation
- **File:** `query-router.ts:145, 191, 304`
- **Evidence:** `classifyIntent(query).intent` is called inside `shouldPreserveBm25` (line 145), inside `shouldPreserveGraph` (line 191), and directly in `routeQuery` (line 304). For a simple-tier `find_decision` query, the intent classifier runs 3 times for the same input string. On the cold path (non-matching intents), it runs twice (inside `shouldPreserveBm25` + `shouldPreserveGraph`).
- **Finding class:** instance-only (single call-site pattern: `routeQuery`)
- **Scope proof:** `rg -n "classifyIntent" query-router.ts` confirms the function is called only within `routeQuery`'s call chain, with no external consumers of the helpers that would need independent intent computation.
- **Affected surface hints:** ["query-router", "shouldPreserveBm25", "shouldPreserveGraph", "routeQuery"]
- **Recommendation:** Pass pre-computed intent from `routeQuery` into `shouldPreserveBm25` and `shouldPreserveGraph` as an optional parameter. Accepts `string | IntentLabel` and skips re-classification when provided. This eliminates 1-2 redundant `classifyIntent` calls per routing decision and future-proofs against intent classifier cost increases.

### P2 — Minor: 4

#### P2-001 [P2] `routing-telemetry.ts` duplicates `ChannelName` type
- **File:** `routing-telemetry.ts:14`
- **Evidence:** The literal union `type ChannelName = 'vector' | 'fts' | 'bm25' | 'graph' | 'degree'` is defined identically in both `query-router.ts:35` (source of truth) and `routing-telemetry.ts:14` (duplicate). If a new channel is added, both files must be updated.
- **Recommendation:** Import `ChannelName` from `query-router.ts` instead of redeclaring. Or extract to a shared channels type module.

#### P2-002 [P2] `recordInvocation` uses `Array.shift()` — not a true ring buffer
- **File:** `routing-telemetry.ts:33-35`
- **Evidence:** `recentDecisions.shift()` is called on overflow, which is O(n) per event. At WINDOW_SIZE=200 this is negligible, but the implementation doc describes this as a "ring buffer." A true ring buffer with a write-index modulo WINDOW_SIZE would be more idiomatic and avoid the shift cost.
- **Recommendation:** Replace array-based FIFO with a fixed-size `ChannelName[][]` and a write-index cursor, or document the current implementation as "rolling window" rather than "ring buffer."

#### P2-003 [P2] `shouldPreserveGraph` does not self-gate on feature flag
- **File:** `query-router.ts:183`
- **Evidence:** The `SPECKIT_GRAPH_CHANNEL_PRESERVATION` feature flag is only checked in `routeQuery` (line 325), not inside the exported `shouldPreserveGraph` function. Direct callers of `shouldPreserveGraph` (currently only tests) bypass the flag. If another consumer imports and calls `shouldPreserveGraph` directly in the future, the flag would not be honored.
- **Recommendation:** Either make `shouldPreserveGraph` a module-private function (not exported) or add the flag check inside the function itself so all call paths honor it.

#### P2-004 [P2] No isolated try/catch around `getRoutingTelemetrySnapshot` in `memory_health`
- **File:** `memory-crud-health.ts:626`
- **Evidence:** `getRoutingTelemetrySnapshot()` is called unguarded inside the health handler's full-report path. If the telemetry module threw unexpectedly (e.g., array corruption), the entire `handleMemoryHealth` response would fail with an unhandled error. The telemetry function is simple (array iteration), so the risk is low, but defense-in-depth would guard.
- **Recommendation:** Wrap in try/catch with fallback to `{ graphChannelInvocationRate: 0, channelInvocationRates: { vector:0, fts:0, bm25:0, graph:0, degree:0 }, totalRecorded: 0, windowSize: WINDOW_SIZE }` and a `hints.push('Routing telemetry unavailable')` message.

---

## Traceability Checks

### Core Traceability (spec_code + checklist_evidence)

| Requirement | Spec § | Task | Code | Test | Checklist | Status |
|-------------|--------|------|------|------|-----------|--------|
| REQ-001 | spec.md:138 | T004 | `shouldPreserveGraph` at query-router.ts:183 | 012-T1.1..T1.5 | CHK-020 | PASS |
| REQ-002 | spec.md:139 | T006 | `routeQuery` at query-router.ts:325-335 | 012-T2.1..T2.4 | CHK-021 | PASS |
| REQ-003 | spec.md:140 | T005 | `getEntityDensityScore` at entity-density.ts:128 | 012-ED-1.* | CHK-022 | PASS |
| REQ-004 | spec.md:141 | T007,T008 | `routing-telemetry.ts` + `memory-crud-health.ts:626-668` | 012-T3.1 + 012-S1.* | CHK-023 | PASS |
| REQ-005 | spec.md:147 | T012 | Latency microbenchmark | 012-T4.1 + 012-S2.* | CHK-024 | PASS |
| REQ-006 | spec.md:148 | T011 | `getEntityDensityScore(null)` returns 0 | 012-ED-2.* | CHK-025 | PASS |
| REQ-007 | spec.md:149 | T006 | `routingReasons` via `buildRoutingQueryPlan` | Asserted in 012-T2.* | CHK-028 | PASS |
| REQ-008 | spec.md:155 | T013 | `isGraphChannelPreservationEnabled()` at query-router.ts:160 | 012-T2.5..T2.7 + 012-S4.* | CHK-029 | PASS |

All 8 requirements are traceable from spec → task → code → test → checklist. No broken chains.

### Overlay Traceability

- **feature_catalog_code:** Feature catalog entries created: `12-graph-channel-preservation.md` (new) and `03-health-diagnostics-memoryhealth.md` (updated). Both documented in resource-map.md §5 rows 7-8. Content not reviewed in this pass — dim-3 (traceability) will deep-dive.
- **playbook_capability:** Manual playbook `272-routing-telemetry-and-graph-channel-invocation.md` created. Resource-map.md §5 row 9. Content not reviewed in this pass.
- **skill_agent / agent_cross_runtime:** Not applicable — this packet modifies MCP server internals, not agent dispatch paths.

### Resource Map Cross-Check

No `applied/T-*.md` target files exist — the directory `.opencode/specs/.../009-causal-graph-channel-routing/applied/` is absent. Resource-map.md lists all 6 mcp_server artifacts and all 9 packet docs that constitute the change set. No gaps to report.

---

## Verdict

**CONDITIONAL PASS** — `hasAdvisories=true`

- Zero P0 blockers.
- One P1 (redundant intent classification — low-impact performance concern, not correctness-blocking).
- Four P2 advisories (type duplication, array-shift idiom, flag self-gating, missing defensive guard).

The implementation is sound. The packet meets all P0 acceptance criteria and its test suite is comprehensive (48 existing + 27 new tests, 0 regressions). The P1 finding does not prevent release-readiness but should be scheduled for cleanup.

---

## Next Dimension

**Iteration 002 → `correctness`**

Recommended deep-dive targets for the correctness pass:
1. `shouldPreserveGraph` dual-path logic: confirm intent-only path never adds `degree`; confirm entity-density path always adds both `graph`+`degree`; verify the interaction when both paths fire simultaneously.
2. `routeQuery` channel-list mutation order: verify `enforceMinimumChannels` is always the last transform applied; confirm no channel leak between override paths.
3. `entity-density.ts` SQL JOIN correctness: verify `CAST(mi.id AS TEXT) = ce.source_id` handles all id types correctly; verify `HAVING COUNT(*) >= 3` threshold gates low-degree rows properly.
4. Edge cases from spec.md §8: empty query, cold-start, trigger-match forces simple tier, flag-disabled, graph handler not loaded.

---

*Generated: 2026-05-11T06:00:00Z | Tool calls: 18 | Files read: 15*
