# Iteration 2 — Adversarial Deep Pass

**Dimension:** adversarial-deep (re-attacking all 8 specified vectors)
**Run:** iter-002
**Status:** complete
**Timestamp:** 2026-05-11T12:15:00Z

---

## Dimension

adversarial-deep — attack the 8 vectors specified by the dispatch prompt: memory-save cache wiring, memory-bulk-delete cache wiring, safeGetDb warn-once, env-flag tightening edge cases, try/catch zero-fallback, routingReasons clamp, withFeatureFlag async restore, and test-env cross-worker behavior.

---

## Files Reviewed

| File | Lines | Attack |
|------|-------|--------|
| `memory-save.ts` | 47, 178-191, 2530-2610 | #1 cache wiring after commit |
| `memory-bulk-delete.ts` | 8, 27-41, 132-156, 255-256 | #2 dual call-site reachability |
| `query-router.ts` | 85-92, 182-198, 257-268, 298-301 | #3 warn-once, #4 flag parsing, #6 clamp |
| `entity-density.ts` | 1-181 (full) | #1/#2 dependency |
| `post-insert.ts` | 233-252, 533-563 | #1 enrichment throw analysis |
| `memory-crud-health.ts` | 629-643 | #5 zero-fallback |
| `query-router.vitest.ts` | 1-37, 470-539 | #4 flag tests, #7 async helper |
| `routing-telemetry-stress.vitest.ts` | 1-60 | #7 async context |
| `test-env.ts` | 1-44 | #7 async restore, #8 cross-worker |
| `integration/entity-density-commit-hooks.vitest.ts` | 1-104 | P2-CONF-001 re-validation |
| `implementation-summary.md` | full | closure evidence cross-check |

---

## Findings by Severity

### P2-ADV-001 [P2] safeGetDb warn-once flag masks distinct DB-failure causes

- **File:** `query-router.ts:92,257-268`
- **Evidence:** The `_hasWarnedSafeGetDb` module-level flag (line 92) is set to `true` on the first `getDb()` failure and never reset. Any subsequent `getDb()` failure — even from a different root cause (e.g., DB file locked vs. schema corruption vs. connection timeout) — is silently swallowed because `!warnedSafeGetDb` is false. An operator debugging "why is graph channel not activating" after a DB reconnect would only see one stale error.
- **Finding class:** instance-only
- **Scope proof:** `_hasWarnedSafeGetDb` is only read in `safeGetDb()` at line 261. No test export resets it. Node.js module caching means the flag persists for process lifetime.
- **Affected surface hints:** ["query-router safeGetDb", "observability"]
- **Recommendation:** Either (a) include `err.message` or error class in a per-failure debug log (while keeping the warn-once for `console.warn`), or (b) export a test-only `_resetSafeGetDbWarn()` so integration tests can verify distinct failure paths. The fix should not break the existing P2-013 closure.
- **Confidence:** High (code pattern is deterministic).

### P2-ADV-002 [P2] Zero-fallback catch in memory_health swallows error classification

- **File:** `memory-crud-health.ts:635-642`
- **Evidence:** The catch block sets all channel rates to 0 and appends the generic hint `"Routing telemetry unavailable"`. The original error class (TypeError, EACCES, etc.) and message are discarded. An operator seeing "Routing telemetry unavailable" has no way to distinguish a transient telemetry read failure (retry-safe) from a structural code bug (requires deployment).
- **Finding class:** instance-only
- **Scope proof:** `getRoutingTelemetrySnapshot()` at `routing-telemetry.ts:66` is a pure in-memory computation that should never throw barring `recentDecisions` corruption. The catch is defensive, but if it ever fires, the diagnostic data is lost.
- **Affected surface hints:** ["memory-crud-health telemetry", "observability", "routing-telemetry"]
- **Recommendation:** Include the error class in the hints, e.g., `hints.push('Routing telemetry unavailable: ${err instanceof Error ? err.constructor.name : 'unknown'}')`. The P2-004 closure (try/catch existence) remains valid; this is a follow-up refinement.
- **Confidence:** High.

### P2-ADV-003 [P2] Env-flag tests miss numeric and whitespace edge cases

- **File:** `query-router.vitest.ts:519-537`
- **Evidence:** The `012-T2.8` / `012-T2.9` parameterized tests cover `['0', 'no', 'off', '', 'FALSE', 'No']` (disable) and `['1', 'true', 'yes', 'on', 'TRUE', 'YES']` (enable). The implementation at `query-router.ts:186` does `raw.trim().toLowerCase()`, which handles whitespace correctly and normalizes to the tested values. However, edge cases not tested include:
  - Numeric variants like `"00"`, `"01"` (which normalize to `"00"`, `"01"` — unrecognized, defaults to enabled with warning)
  - Whitespace-padded values like `" 0 "`, `" true "` (handled correctly by trim, but untested)
  - The escaped-empty-string case `""` is tested via the parameterized test
- **Finding class:** test-isolation
- **Scope proof:** `isGraphChannelPreservationEnabled` at `query-router.ts:182-198` is the only consumer of `SPECKIT_GRAPH_CHANNEL_PRESERVATION`. The function's edge cases are not exhaustively tested.
- **Affected surface hints:** ["query-router env-flag", "tests"]
- **Recommendation:** Add test cases for `" 0 "`, `" false "`, `"00"`, `"01"` to the parameterized test tables (or as separate assertions). The `"00"`/`"01"` cases should document the current behavior (unrecognized → enabled + warn) as intentional.
- **Confidence:** Medium (the current behavior for `"00"` may be intentional fail-open, but the lack of test coverage leaves the contract ambiguous).

---

## P2-CONF-001 Re-validation (Iteration 1 finding)

**Status: CONFIRMED — still open.** The integration test at `entity-density-commit-hooks.vitest.ts:86-103` (REQ-T1-001) verifies that `invalidateEntityDensityCache()` clears cached terms for a manually updated DB row. It does NOT invoke `handleMemorySave()` and therefore does not exercise the full wire: `handleMemorySave` → transaction commit → `runPostInsertEnrichmentIfEnabled` → `invalidateEntityDensityCacheAfterSave`.

The bulk-delete test (REQ-T1-002, lines 63-84) DOES exercise the full wire by calling `handleMemoryBulkDelete()`. A mirror test for the save path should call `handleMemorySave()` with a real file path and verify post-save cache state.

---

## Traceability Checks

| Check | Result | Detail |
|-------|--------|--------|
| spec_code | PASS | All findings reference exact line numbers in reviewed files |
| checklist_evidence | PASS | No checklist regression from P2-ADV-* findings |
| resource_map_coverage | PASS | No resource-map changes needed for P2 advisories |
| closure_completeness | PASS | P2-ADV-001/002/003 are NEW; no prior closure violated |
| new_issue_scan | PASS_WITH_ADVISORIES | 3 new P2, 0 P0, 0 P1 |

---

## Verdict

**PASS (hasAdvisories=true)**
- 0 new P0
- 0 new P1
- 3 new P2 (ADV-001, ADV-002, ADV-003)
- 1 existing P2 (CONF-001) confirmed still open

The adversarial deep pass confirms that the critical cache invalidation wiring (attacks #1, #2) is correct, the withFeatureFlag async helper (attack #7) correctly restores env on all code paths, the test-env helper (attack #8) is appropriate for vitest's worker model, and the routingReasons clamp (attack #6) operates on internal ASCII-only strings with no Unicode risk. The three new P2 findings are observability and test-coverage refinements that do not block merge.

---

## Next Dimension

N/A — this is the adversarial-deep pass (iteration 2 of 3). The provisional verdict across both iterations is **PASS with 4 advisories** (P2-CONF-001, P2-ADV-001, P2-ADV-002, P2-ADV-003). Iteration 3 (if needed) could focus on P2 resolution verification.

## Scope Violations

None.
