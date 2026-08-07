# Deep Review — Iteration 7 (Security Pass)

**Dimension**: Security (second-pass deep analysis)
**Date**: 2026-05-11T07:00:00Z
**Session**: 2026-05-11T05:42:00Z

---

## Files Reviewed

| File | Key Sections |
|------|-------------|
| `query-router.ts` | 1-396 (full): routeQuery, shouldPreserveBm25, shouldPreserveGraph, isGraphChannelPreservationEnabled, safeGetDb, resolveArtifactClass, buildQualityGapFallbackPlan |
| `entity-density.ts` | 1-172 (full): tokenize, parseTriggerPhrases, buildIndex, refreshIfStale, getEntityDensityScore, invalidateEntityDensityCache |
| `routing-telemetry.ts` | 1-93 (full): recordInvocation, getSnapshot, resetRoutingTelemetry, recentDecisions ring buffer |
| `memory-crud-health.ts` | 223-672: handleMemoryHealth, including getRoutingTelemetrySnapshot at L626 |
| `query-plan.ts` | 232-262: buildRoutingQueryPlan routingReasons construction |
| `decision-audit.ts` | 33-59: recordSearchDecision, defaultAuditPath |
| `artifact-routing.ts` | 258-331: getStrategyForQuery, ArtifactClass type, confidence scoring |
| `search-decision-envelope.ts` | 44-59: SearchDecisionEnvelope interface with queryPlan field |
| `query-router.vitest.ts` | 1-658 (full): all test suites including 012-T1 through 012-T4, 006-T1 |
| `routing-telemetry-stress.vitest.ts` | 1-275 (full): 012-S1 through 012-S4 stress scenarios |
| `entity-density.vitest.ts` | 1-172 (full): 012-ED-1 through 012-ED-3 |

---

## Findings by Severity

### P0 — None

### P1 — None

### P2

#### S7-001 [P2] Entity-density cache has no explicit upper-bound size guard

- **File**: `entity-density.ts:32,69-92`
- **Evidence**: `cachedTerms: Set<string>` is populated by `buildIndex()` without any `MAX_CACHE_SIZE` constraint. The Set grows proportionally to `|high-degree rows| × |unique tokens per row|`. In a database with thousands of high-degree causal-edge nodes, each contributing several title/trigger tokens, `cachedTerms` could grow to tens of thousands of entries with no explicit bound.
- **Finding class**: instance-only (single cache variable)
- **Scope proof**: `rg -n "cachedTerms|MAX_|CAP_|LIMIT_" entity-density.ts` — no size guard exists in the module.
- **Recommendation**: Add a maximum cache size (e.g., `MAX_ENTITY_DENSITY_CACHE_TOKENS = 5000`) with least-recently-built eviction or a warning log when exceeded. This is defense-in-depth; the cache is bounded by DB content (internal data), so exploitability is low.
- **Severity**: P2 — defense-in-depth, bounded by internal DB data, no external attack surface.
- **Confidence**: 0.65

---

## Ruled-Out Security Directions

Each security question from the prompt was exhaustively traced. Directions ruled out as non-findings:

### 1. Log-injection in search-decisions.jsonl via routingReasons — RULED OUT

- **Claim**: `routingReasons` could contain user-controlled strings, creating a log-injection vector when persisted to `search-decisions.jsonl`.
- **Evidence refs**: `query-router.ts:279-281,346-348`, `query-plan.ts:250-262`, `artifact-routing.ts:258-331`, `search-decision-envelope.ts:44-59`, `decision-audit.ts:33-51`
- **Counterevidence sought**: Searched for any path where the raw `query` string is interpolated into `routingReasons`.
- **Analysis**: All `routingReasons` values originate from:
  - Hardcoded string literals: `'complexity-router-disabled'`, `'quality-gap-fallback-engaged'`, `'bm25-preserved-for-authority-artifact'`, `'graph-preserved-by-intent'`, `'graph-preserved-by-entity-density'`
  - `artifact:${artifactClass}` where `artifactClass` is from the `ArtifactClass` union type (9 known values: `spec`, `plan`, `tasks`, `checklist`, `decision-record`, `implementation-summary`, `memory`, `research`, `unknown`) — `artifact-routing.ts:10-19`
  - `channels:${selected.join('+')}` where `selected` are from the `ChannelName` union type (5 known values: `vector`, `fts`, `bm25`, `graph`, `degree`) — `query-router.ts:35`
  - Classifier-derived: `complexity:simple|moderate|complex`, `confidence:high|medium|low|fallback`, `terms:N`, `trigger-match`
- The raw user query string is consumed by classifiers but NEVER interpolated into routingReasons.
- **Verdict**: RULED OUT. No user-controlled string reaches routingReasons or search-decisions.jsonl.

### 2. TOCTOU in entity-density cache invalidation — RULED OUT

- **Claim**: `invalidateEntityDensityCache()` and `getEntityDensityScore()` could race, causing inconsistent reads.
- **Evidence refs**: `entity-density.ts:95-116,128-143,150-154`
- **Counterevidence sought**: Checked for async/await, Promise, or callback-based yield points in `refreshIfStale` and `getEntityDensityScore`.
- **Analysis**: All entity-density functions are fully synchronous. Node.js's single-threaded event loop prevents interleaving. `refreshIfStale` reads cache state, calls `buildIndex(db)` (synchronous better-sqlite3), and writes new state — all in one atomic synchronous block. `invalidateEntityDensityCache` synchronously clears state. No yield point exists between any read and write.
- **Verdict**: RULED OUT. No TOCTOU possible in synchronous single-threaded code.

### 3. Env-flag re-read mid-flight inconsistency — RULED OUT

- **Claim**: `isGraphChannelPreservationEnabled()` reads `process.env` per call; mutation between reads could create inconsistent decisions across a single `routeQuery` chain.
- **Evidence refs**: `query-router.ts:160-162,268,325`
- **Counterevidence sought**: Checked for async yield points or event-loop yielding within `routeQuery`.
- **Analysis**: `routeQuery` is fully synchronous. `isComplexityRouterEnabled()` at L268 and `isGraphChannelPreservationEnabled()` at L325 execute within the same synchronous call stack. No EventEmitter emission, no async I/O, no `setTimeout`/`setImmediate` callbacks can interleave. Between-request env mutation is by-design (feature flag support).
- **Verdict**: RULED OUT. Synchronous execution prevents interleaving.

### 4. ReDoS in inferAuthorityNeed regex — RULED OUT

- **Claim**: The regex `/\b(audit|security|decision|rationale|requirement|scope|checklist|citation|source)\b/` in `query-plan.ts:146` could be vulnerable to ReDoS.
- **Evidence refs**: `query-plan.ts:145-153`
- **Analysis**: This is a simple alternation with word-boundary anchors. Zero nested quantifiers, zero overlapping alternatives, zero `(a+)+` patterns. ReDoS requires exponential backtracking from nested quantifiers on ambiguous input. This regex has none.
- **Verdict**: RULED OUT. Regex is structurally immune to catastrophic backtracking.

### 5. Stress/DoS via snapshot allocation and ring buffer overflow — RULED OUT (no new finding beyond prior)

- **Snapshot allocation**: `getSnapshot()` at `routing-telemetry.ts:50-75` allocates new objects each call. Called only from `memory_health` handler (`memory-crud-health.ts:626`), an infrequent diagnostic endpoint. Not in the hot path.
- **Ring buffer**: `recordInvocation` at `routing-telemetry.ts:29-35` bounds `recentDecisions` to WINDOW_SIZE=200. Already documented as P2-002 (Array.shift not true ring buffer).
- **buildIndex cache**: `cachedTerms` in `entity-density.ts:32` is bounded by DB content. New defensive finding S7-001 covers the lack of explicit MAX_SIZE.
- **Verdict**: No new DoS findings beyond S7-001.

---

## Traceability Checks

| Check | Status | Evidence |
|-------|--------|----------|
| `core.spec_code` | PASS | All scope files mapped and traced. Log-injection path traced from `routeQuery` → `buildRoutingQueryPlan` → `SearchDecisionEnvelope.queryPlan` → `decision-audit.ts` → `search-decisions.jsonl`. |
| `core.checklist_evidence` | PASS | Entity-density cold-start tests confirm empty-DB safety (012-ED-2). Stress tests confirm buffer capping at WINDOW_SIZE (012-S1). |
| `overlay.skill_agent` | PASS | No agent dispatch; LEAF-only review. |
| `overlay.agent_cross_runtime` | PASS | N/A for this iteration (LEAF, no sub-agents). |
| `overlay.playbook_capability` | PASS | Playbook at L57 references "search-decisions.jsonl carries routingReasons" — verified accurate. |

---

## Cross-Reference: Prior Security Findings

| Prior ID | Iter | Confirm/Upgrade/Downgrade | Notes |
|----------|------|--------------------------|-------|
| P2-010 | 3 | Confirmed | Entity-density cache refresh has no concurrency guard — confirmed correct but non-exploitable (sync code). |
| P2-011 | 3 | Confirmed | Exported with no access control — confirmed. |
| P2-012 | 3 | Confirmed | buildRoutingQueryPlan accepts unbounded routingReasons — confirmed safe (only one producer passes hardcoded values). |
| P2-013 | 3 | Confirmed | safeGetDb swallows errors — confirmed. |
| P1-C-001 | 6 | Confirmed | Not wired to save/delete — confirmed (not in security scope files).|
| P2-C-001 | 6 | Confirmed | Error path discards cached state — confirmed. |
| P2-C-002 | 6 | Confirmed | No test for rebuild failure — confirmed. |

No prior security findings upgraded or downgraded. No P0/P1 from iter 3 security pass that needs replay evidence (all were P2 findings).

---

## Verdict

**CONDITIONAL (hasAdvisories=true, P0=0, P1=0, P2=1)**

One new defensive finding (S7-001). All five prompted security directions were exhaustively ruled out. The code is secure against log-injection, TOCTOU, ReDoS, and DoS. No open P0/P1 security findings require block-merge attention.

---

## Next Dimension

Maintainability (iter 5 was initial; a non-security dimension pass can follow) or convergence evaluation. At 7/10 iterations with 4/4 dimensions covered (correctness:2, security:2, traceability:1, maintainability:1), the review is approaching convergence.
