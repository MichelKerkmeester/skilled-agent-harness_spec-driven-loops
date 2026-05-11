# Iteration 3 — Security Pass

**Focus:** Security (Injection, auth bypass, secrets, unsafe deserialization, DoS surfaces)
**Date:** 2026-05-11T06:15:00Z
**Run:** 2026-05-11T05:42:00Z

---

## Dimension

**Security** — second of four review dimensions.

---

## Files Reviewed

| File | Lines | Why |
|---|---|---|
| query-router.ts | 1-396 | Primary routing logic; env-flag gating; `safeGetDb`; `routeQuery` quality-gap path |
| entity-density.ts | 1-172 | SQL cache build; tokenization; cache invalidation; TTL logic |
| routing-telemetry.ts | 1-93 | Rolling-window snapshot; channel count exposure |
| memory-crud-health.ts | 1-678 | Health handler; routing telemetry surface; path redaction |
| memory-search.ts | 1068-1079 | `qualitySignal` construction for quality-gap routing |
| decision-audit.ts | 1-158 | JSONL write path; audit path resolution |
| search-decision-envelope.ts | 1-180 | `SearchDecisionEnvelope` schema; `cloneJson` serialization |
| query-plan.ts | 1-301 | `routingReasons` propagation; `buildRoutingQueryPlan` |

---

## Ruled-Out Directions

The following were investigated and found **not** to be security issues:

| Direction | Reason Ruled Out |
|---|---|
| SQL injection in `buildIndex` | `entity-density.ts:70-79` uses parameterized `?.all(MIN_OUTGOING_EDGES)` — constant bind value. No string concatenation in SQL. |
| Log injection via `routingReasons` | All routingReasons values in `query-router.ts` are hardcoded static strings (`'complexity-router-disabled'`, `'graph-preserved-by-intent'`, etc.). The `qualityFallback.reason` interpolates `avgScore.toFixed()` — a finite-number-only string. `buildRoutingQueryPlan` at `query-plan.ts:255` prefixes with `artifact:` + classification string (not raw query). |
| PII/query-text exposure via telemetry | `routing-telemetry.ts:19` stores only `ChannelName[][]` (arrays like `['vector','fts','graph']`). `getSnapshot()` returns channel-invocation counts/rates only. Zero query text, trigger phrases, or PII. |
| Secret exposure via `memory_health` | `memory-crud-health.ts:662-667` exposes only `graphChannelInvocationRate`, `channelInvocationRates`, `totalRecorded`, `windowSize` — all channel-selection aggregates. No paths, queries, or credentials. The `databasePath` field at line 651 passes through `redactPath()` before emission. |
| Env-flag race condition | `process.env.SPECKIT_GRAPH_CHANNEL_PRESERVATION` is read synchronously per `isGraphChannelPreservationEnabled()` call (`query-router.ts:160-163`). No async I/O between read and use. In a single-process MCP server, no concurrent mutation path exists for environment variables (tests use `setEnv`/`restoreEnv` but are serialized per test). |
| Env-flag per-request toggle | No MCP tool exposes an env-var setter. The flag is immutable at runtime. |
| Unbounded entity-density cache growth | Cache (`entity-density.ts:32`) is a `Set<string>` derived from DB rows. Size is bounded by the number of high-degree memory_index rows × number of unique tokens in those rows. On DB error (line 112), the cache is reset to empty. The 60s TTL limits rebuild frequency (modulo the race window). |
| `JSON.parse` on trigger_phrases | `entity-density.ts:48-57` wraps `JSON.parse` in try/catch and validates result is `Array<string>`. Trigger phrases come from `memory_index` (system-indexed spec docs), not user input. |
| Flag-OFF path still classifying intent | `query-router.ts:268-300` (disabled path) calls `classifyIntent(query)` and `resolveArtifactClass(query)` at lines 269-270. This is by design — the quality-gap fallback may still engage regardless of complexity-router state. `routeQuery` at `memory-search.ts:1072` is called unconditionally for quality-gap routing. The processing cost is minimal (intent classification is regex-based). |
| `computeAverageScore` producing NaN/Infinity | `memory-search.ts:495-501` returns 0 for empty arrays. `buildQualityGapFallbackPlan` at `query-router.ts:224-225` rejects non-finite values via `Number.isFinite`. |
| Audit path injection via `SPECKIT_SEARCH_DECISION_AUDIT_PATH` | `decision-audit.ts:39` reads this env var at startup, not per-request. Environment variable control is outside the request threat model. |
| `cloneJson` deserialization attack | `search-decision-envelope.ts:169-171` uses `JSON.parse(JSON.stringify(value))` — a deep-clone pattern that only deserializes what was just serialized. No external JSON input. |

---

## Findings by Severity

### P0: None

No exploitable injection, auth bypass, secret exposure, or destructive DoS surface found.

### P1: None

No spec-mismatch security gate failure found.

### P2: Advisories Only

---

#### P2-010 [P2] Entity-density cache refresh has no concurrency guard

- **File:** entity-density.ts:95-116
- **Evidence:** `refreshIfStale` checks `lastBuildOk && now - lastBuiltAt < CACHE_TTL_MS` (line 102-103) but has no mutex or atomic flag. Two concurrent `getEntityDensityScore` calls arriving during the TTL-refresh window both pass the stale check and independently invoke `buildIndex(db)` (line 106), racing on the module-level `cachedTerms` variable.
- **Impact:** Simultaneous duplicate SQL execution (read-only, wasteful); last-writer-wins cache assignment (non-deterministic); no data corruption of the source DB.
- **Finding class:** instance-only
- **Scope proof:** `grep -n "cachedTerms\|lastBuiltAt\|lastBuildOk" entity-density.ts` — all three are module-scoped `let` variables with no synchronization primitive guarding writes.
- **Recommendation:** Add a boolean lock flag (`rebuildInProgress`) set before `buildIndex` and cleared in a `finally` block, with late arrivals skipping the build. Alternatively, use a promise-based deduplication (cache the in-flight build promise so concurrent callers await the same result).

---

#### P2-011 [P2] `invalidateEntityDensityCache` exported with no access control

- **File:** entity-density.ts:150-154
- **Evidence:** The function directly zeros `cachedTerms`, `lastBuiltAt`, and `lastBuildOk` and is exported at line 166. Any module that imports `entity-density.js` can call `invalidateEntityDensityCache()` from any code path, globally resetting the cache and forcing the next `getEntityDensityScore` call to rebuild from DB.
- **Impact:** Low — same-process trust domain in current architecture. If this module were ever exposed through an MCP tool without auth gating, it would allow unauthenticated cache invalidation, degrading routing quality by forcing repeated DB scans.
- **Finding class:** instance-only
- **Scope proof:** `grep -n "invalidateEntityDensityCache" entity-density.ts` — single definition; `grep -rn "invalidateEntityDensityCache" --include="*.ts"` across the codebase shows it is only called from post-commit hooks (memory_save, memory_bulk_delete). No abuse from current callers.
- **Recommendation:** Document the function as `@internal` and consider a runtime guard (e.g., check `process.env.NODE_ENV !== 'production'` for direct test access) if this ever gains MCP-tool exposure.

---

#### P2-012 [P2] `buildRoutingQueryPlan` accepts unbounded `routingReasons` strings for disk persistence

- **File:** query-plan.ts:74 (interface), query-plan.ts:255-258 (build site)
- **Evidence:** `BuildRoutingQueryPlanInput.routingReasons?: readonly string[]` has no per-string length limit, no character-class constraint, and no total-count cap. These strings flow through `buildRoutingQueryPlan` → `QueryPlan.routingReasons` → `SearchDecisionEnvelope.queryPlan` → `JSON.stringify(envelope)` → `appendFileSync` to `search-decisions.jsonl` (decision-audit.ts:51). Current callers (query-router.ts) provide only hardcoded static strings, so the active surface is safe. The risk is a **future caller** accidentally injecting user-controlled text or blowout-length strings into the persisted audit log.
- **Impact:** Disk bloat if a future caller passes unbounded user input; no injection exploit because `JSON.stringify` escapes control characters. Remediation is defensive hardening.
- **Finding class:** instance-only (safe today; gap is in the API contract)
- **Scope proof:** `grep -n "routingReasons" query-plan.ts query-router.ts` — `buildRoutingQueryPlan` is exported at line 298 of query-plan.ts. Search across `memory-search.ts`, `handler-memory-search*.ts`, `hybrid-search.ts` confirms only query-router.ts calls it with hardcoded strings.
- **Recommendation:** In `buildRoutingQueryPlan`, validate each string length ≤ 256 and total array length ≤ 50. Alternatively, add a JSDoc `@throws` on `buildRoutingQueryPlan` and gate at the JSONL write side (`decision-audit.ts:51`) with a size guard.

---

#### P2-013 [P2] `safeGetDb` error swallowing loses observability

- **File:** query-router.ts:207-213
- **Evidence:** `safeGetDb()` wraps `vectorIndex.getDb()` in a try/catch that silently returns `null` on ANY error. When `getDb()` fails (corrupted DB handle, unreadable file, permission change), the caller (`shouldPreserveGraph` via `getEntityDensityScore`) receives `null`, entity-density is bypassed, and routing silently falls back to intent-only graph preservation. No log, no metric, no health signal records the failure.
- **Impact:** Silent degradation of routing accuracy without operator visibility. If the DB becomes inaccessible, graph-channel preservation relies entirely on intent classification, and entity-density override is permanently disabled with no alarm. This is a defense-in-depth concern, not an active exploit.
- **Finding class:** instance-only
- **Scope proof:** `grep -n "safeGetDb" query-router.ts` — defined at line 207, called once at line 326. The only consumer of the null return is `getEntityDensityScore` at entity-density.ts:130-131 which handles null gracefully (returns 0). No other code paths depend on the error being surfaced.
- **Recommendation:** Add `console.warn` inside the catch block with the error message (sanitized). Consider a `safeGetDb` health metric (e.g., increment a `dbAccessFailures` counter exposed in `memory_health`'s routing telemetry section) so operators can detect DB connectivity loss before routing degrades.

---

### Claim Adjudication (P2 only — not required for P2, included for completeness)

No P0/P1 findings were raised, so formal claim adjudication is not required. Confidence on all P2 findings: **0.75-0.85** (code-evidence-backed, low impact, edge-case scenarios only).

---

## Traceability Checks

| Protocol | Status | Detail |
|---|---|---|
| spec_code | NOT APPLICABLE | Security pass does not trace specific REQs — affirmatively ruled out injection/env-flag/telemetry exposure risks |
| checklist_evidence | NOT APPLICABLE | No security-specific checklist items in packet 012 |

---

## Verdict

**SECURITY: PASS (hasAdvisories=true)**

- 0 P0 — no exploitable vulnerability found.
- 0 P1 — no spec-mismatch security gate failure.
- 4 P2 — low-impact defense-in-depth advisories (race condition on cache rebuild, exported cache-invalidation, unbounded routing-reasons API contract, silent DB-error swallowing).

All 5 specific security questions answered (see Ruled-Out Directions table above):
1. Entity-density SQL uses parameterized queries — **safe**.
2. No query injection into channel selection — **safe**.
3. Cache-key derivation uses trusted (DB-sourced) input — **safe**.
4. No privilege boundary between `memory_health` caller and routing telemetry — same-process **safe**.
5. No flag-OFF telemetry leakage — `recordInvocation` always runs but records only channel arrays — **safe**.

---

## Next Dimension

**Traceability** (iteration 4) — spec.md REQ-001..REQ-008 ↔ code mapping, checklist.md ↔ evidence, resource-map.md coverage gate.
