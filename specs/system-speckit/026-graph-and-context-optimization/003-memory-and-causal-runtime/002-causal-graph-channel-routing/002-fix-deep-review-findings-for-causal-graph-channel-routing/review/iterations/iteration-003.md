# Iteration 3 — Final Verification & Synthesis

**Iteration:** 3 of 3
**Mode:** review
**Focus:** final-sweep (dedup, escalation, cross-file attack, verdict)
**Status:** complete
**Timestamp:** 2026-05-11T12:30:00Z

---

## Dimension

Final sweep covering all 4 review dimensions (correctness, security, traceability, maintainability). This pass performs three structured scans: dedup analysis of the 4 open P2 findings, severity escalation review against the cumulative picture, and one last cross-file consistency attack on the full 002 packet.

---

## Files Reviewed

| File | Lines | Purpose |
|------|-------|---------|
| `query-router.ts` | 85-92, 182-198, 257-268, 298-301, 385-438 | P2-ADV-001/003 deep read; safeGetDb + env-flag + route integration |
| `memory-crud-health.ts` | 629-643 | P2-ADV-002 deep read; try/catch zero-fallback |
| `entity-density.ts` | 1-181 (full) | P2-CONF-001 deep read; cache build/refresh/null-guard |
| `routing-telemetry.ts` | 1-109 (full) | Cross-file attack: snapshot isolation from cache |
| `memory-save.ts` | 47, 178-191, 2583 | Cross-file attack: save hook vs env-flag independence |
| `memory-bulk-delete.ts` | 8, 27-41, 149, 256 | Cross-file attack: bulk-delete hook vs env-flag independence |
| `query-router.vitest.ts` | 501-538 | P2-ADV-003 re-acquired; flag test parameterized tables |
| `entity-density-commit-hooks.vitest.ts` | 86-103 | P2-CONF-001 reconfirmed: save path not end-to-end |
| `implementation-summary.md` | full | Closure evidence cross-check |
| `review-report.md` (001) | full | Original 42 findings reference |

---

## Scan 1: Dedup Analysis

| Finding Pair | Shared Cluster? | Same Root Cause? | Verdict |
|-------------|-----------------|-----------------|---------|
| P2-ADV-001 vs P2-ADV-002 | Both observability | **No** | Distinct mechanisms: warn-once flag suppression (query-router.ts:92) vs catch-block error discard (memory-crud-health.ts:635-636) |
| P2-ADV-001 vs P2-CONF-001 | Different clusters (observability / tests) | **No** | One is an observability gap; the other is a test-coverage gap |
| P2-ADV-002 vs P2-ADV-003 | Different clusters (observability / tests) | **No** | One is error classification; the other is flag-parsing edge cases |
| P2-ADV-003 vs P2-CONF-001 | Both tests | **No** | One concerns env-flag test completeness; the other concerns integration-test wiring depth |

**Result:** All 4 findings represent genuinely distinct root causes. **No dedup required.**

---

## Scan 2: Severity Escalation Review

Each finding evaluated against P1 criteria (correctness bug, spec mismatch, must-fix gate) and P0 criteria (exploitable security, data loss):

### P2-CONF-001: Save commit hook integration test incomplete
- **Correctness impact:** None. `memory-save.ts:2583` calls `invalidateEntityDensityCacheAfterSave()` unconditionally; the code path is confirmed present at the correct line.
- **Spec compliance:** REQ-T1-001 claims verification that "cache invalidation makes committed mutations visible immediately." The current test verifies `invalidateEntityDensityCache()` alone, not the full `handleMemorySave` → cache-invalidation chain. A strict reading requires end-to-end coverage, but the chain is mechanically correct (import → function → call site are all present).
- **Regression risk:** Low. A future refactor removing the call site would pass this test but fail zero existing tests. This is the test's weakness.
- **Verdict:** **P2 confirmed.** No correctness defect; test-gap advisory.

### P2-ADV-001: safeGetDb warn-once masks distinct DB-failure causes
- **Correctness impact:** None. `safeGetDb()` returns `null` correctly on every failure; callers handle `null` correctly (`getEntityDensityScore(null)` → score 0, `getChannelSubset` paths use separate DB handles).
- **Observability impact:** Medium-low. An operator debugging a transient DB issue may only see the first failure's `console.warn`. Subsequent failures of a different class are silent.
- **Security impact:** None. No auth/authz bypass, no data exposure.
- **Verdict:** **P2 confirmed.** Observability refinement, not a bug.

### P2-ADV-002: memory_health zero-fallback swallows error classification
- **Correctness impact:** None. The health endpoint returns valid data with zero telemetry rates when the snapshot fails, which is the safe fallback.
- **Observability impact:** Medium-low. The `"Routing telemetry unavailable"` hint loses diagnostic specificity.
- **Spec compliance:** REQ-004 (telemetry surface) requires reporting `graphChannelInvocationRate`. The zero-fallback satisfies the letter of the contract. The spec does not require error-class attribution.
- **Verdict:** **P2 confirmed.** Observability refinement.

### P2-ADV-003: Env-flag tests miss numeric and whitespace edge cases
- **Correctness impact:** None. `query-router.ts:186` does `raw.trim().toLowerCase()`, which correctly normalizes whitespace-padded and mixed-case values to the tested set.
- **Ambiguity impact:** Low. The case `"00"` normalizes to `"00"`, which is unrecognized → enabled with warn-once. This behavior is intentional (fail-open), but the lack of test leaves the contract undocumented.
- **Verdict:** **P2 confirmed.** Test-completeness advisory.

**Result: No severity escalation warranted.** All 4 findings remain P2.

---

## Scan 3: One Last Attack — Cross-File Consistency

The dispatch prompt specifically asks: *"Did the env-flag tightening introduce a behavior the cache wiring assumes is still permissive?"*

### Attack Vector 1: Env-flag tightening vs entity-density cache

**Chain traced:**
1. `SPECKIT_GRAPH_CHANNEL_PRESERVATION` env-flag is read by `isGraphChannelPreservationEnabled()` (`query-router.ts:182-198`)
2. The flag gates `shouldPreserveGraph()` at line 233 — when OFF, returns `{ preserved: false }` immediately; entity-density is never queried
3. `invalidateEntityDensityCache()` is called from `memory-save.ts:182,2583` and `memory-bulk-delete.ts:31,149,256` — **unconditionally regardless of flag state**
4. When the flag is ON and `safeGetDb()` fails (returns `null`), `getEntityDensityScore(query, null)` → `refreshIfStale(null)` → sets empty cache → returns score 0 (`entity-density.ts:105-109, 136-142`)

**Verdict: SAFE.** The cache wiring is flag-independent. Cache invalidation always fires (fire-and-forget). The consuming path (`shouldPreserveGraph` → `getEntityDensityScore`) is flag-guarded AND null-safe. The env-flag tightening added more stringent disable-value detection (`'no'`, `'off'`, `''`) but this only makes the flag more robust, never more permissive.

### Attack Vector 2: safeGetDb returning null under flag=ON

When the flag is ON (default) and `safeGetDb()` throws:
- `safeGetDb()` at line 398 is called with `?` — the result is `null`
- `shouldPreserveGraph(query, null, intent)` calls `getEntityDensityScore(query, null)` at line 247
- `getEntityDensityScore` → `refreshIfStale(null)` → clears cache → score 0
- Entity-density override stays inactive
- Route falls through to default complexity-tier channels

**Verdict: SAFE.** Graceful degradation verified. No crash, no incorrect routing.

### Attack Vector 3: Routing telemetry + cache invalidation interaction

`routing-telemetry.ts` is a pure in-memory rolling window (`recentDecisions[]`). It records `recordInvocation()` at `query-router.ts:429`. Zero interaction with entity-density cache (`cachedTerms` in `entity-density.ts`). No cross-contamination possible.

**Verdict: SAFE. Independent subsystems.**

### Attack Vector 4: memory-bulk-delete early return + cache flush

`memory-bulk-delete.ts:149` calls `invalidateEntityDensityCacheAfterBulkDelete()` after a zero-count early return (no rows deleted). Cache is flushed unnecessarily. However, this is the safe behavior — false-positive invalidation is always correct (the next query rebuilds the cache). A false-negative (missing invalidation when rows ARE deleted) would be a bug, but that case is covered at line 256 (post-transaction).

**Verdict: SAFE (minor inefficiency, no correctness impact).**

### Attack Vector 5: New disabling values (no, off) vs legacy configs

Pre-tightening: `'no'` was unrecognized → enabled with warn-once.
Post-tightening: `'no'` is explicitly disabled.

An operator who previously set `SPECKIT_GRAPH_CHANNEL_PRESERVATION=no` and relied on the feature being ON would now find it OFF. However:
- `'no'` is a standard falsey convention — the tightening aligns with operator expectations
- The unsafe case (pre-tightening: '0' → disabled; post-tightening: '0' → disabled) is unchanged
- The tightening is documented in `query-router.ts:174-178`

**Verdict: SAFE (spec-compliant behavior change, not a regression).**

---

## 42 Original Findings: Confirmation Summary

Of the 42 findings from the 001 deep review:

| Severity | Count | Status |
|----------|-------|--------|
| P0 | 0 | N/A |
| P1 | 3 | All CLOSED (P1-C-001, P1-002, P1-003) |
| P2 | 39 | All CLOSED |

**Iteration 1** spot-checked 12 claims (including all 3 P1s) with file:line citations and confirmed them CLOSED. **Iteration 2** adversarial-deep pass re-verified the remaining 30 claims across test/doc/metadata clusters. The 8 attack vectors were exhaustively tested with 6 ruled out and 3 new P2 findings surfaced.

Full closure evidence at `implementation-summary.md:59-105`.

---

## Findings Summary

### Confirmed P2 Findings (from prior iterations, still open)

| ID | Iter | File | Summary |
|----|------|------|---------|
| P2-CONF-001 | 1 | `entity-density-commit-hooks.vitest.ts:86-103` | Save commit hook test does not exercise full `handleMemorySave` wiring |
| P2-ADV-001 | 2 | `query-router.ts:92,257-268` | safeGetDb warn-once flag masks distinct DB-failure causes |
| P2-ADV-002 | 2 | `memory-crud-health.ts:635-642` | memory_health zero-fallback swallows error classification |
| P2-ADV-003 | 2 | `query-router.vitest.ts:519-537` | Env-flag tests miss numeric/whitespace edge cases |

### New Findings (this iteration)

**None.** The final sweep found no new P0, P1, or P2 findings. All 4 prior-hit vectors (dedup scan, severity escalation, cross-file consistency, and one-last-attack) returned clean.

---

## Traceability Checks

| Check | Result | Detail |
|-------|--------|--------|
| spec_code | PASS | All findings cite exact line numbers; evidence tied to observed code |
| checklist_evidence | PASS | 42/42 claims CLOSED with file:line; no PENDING or ACCEPTED rows hidden |
| resource_map_coverage | PASS | P1-002/P1-003 resolved in iteration 1 |
| closure_completeness | PASS | No revivals; all 001 findings remain CLOSED through iter 3 |
| dedup_completeness | PASS | 4 open P2s scanned pairwise — all distinct root causes |
| escalation_review | PASS | All 4 P2s reviewed against P1/P0 criteria — no elevation warranted |
| cross_file_consistency | PASS | 5 attack vectors tested; 0 inconsistencies found |

---

## Quality Gates

| Gate | Status |
|------|--------|
| Evidence Density | PASS — all claims cite concrete file:line |
| Scope Discipline | PASS — no out-of-scope review; all attacks scoped to 002 packet files |
| P0 Resolution | PASS — 0 P0 in original review; 0 P0 across all iterations |
| Coverage | PASS — all 4 dimensions (correctness, security, traceability, maintainability) covered |
| Convergence | PASS — rolling-avg new-finding ratio 0.049 < 0.08 stop threshold |

---

## Final Verdict

**PASS (hasAdvisories=true)**

The 002 remediation packet successfully closed all 42 findings from the 001 deep review. The three P1 release-blockers (P1-C-001 cache invalidation wiring, P1-002 dead resource-map reference, P1-003 changelog completeness) are verified resolved at their cited code lines with cross-iteration confirmation.

Four P2 advisories remain open:
- **P2-CONF-001** (test coverage): The save commit hook integration test should exercise the full `handleMemorySave` → cache-invalidation chain, mirroring the existing bulk-delete pattern. The production code itself is confirmed correct.
- **P2-ADV-001** (observability): safeGetDb's warn-once flag masks distinct DB-failure causes. Include error class in debug-level logging while preserving the warn-once for stderr.
- **P2-ADV-002** (observability): memory_health's zero-fallback catch discards the error class. Append constructor name or message to the `"Routing telemetry unavailable"` hint.
- **P2-ADV-003** (tests): Env-flag parameterized tests should add `" 0 "`, `" false "`, `"00"`, `"01"` cases to document the intended contract.

**No P0 or P1 findings exist.** The 002 packet is merge-safe with all advisories being non-blocking refinements. The final sweep confirmed zero cross-file consistency issues and zero dedupable findings. Convergence achieved at iteration 2; iteration 3 confirms stability (no new findings).

---

## Next Steps

The review is complete. All 3 iterations have been executed. The packet is ready for merge with no blockers. The 4 open P2 advisories can be tracked as follow-up items in the spec's task list or addressed in a subsequent remediation packet.

---

## Scope Violations

None.
