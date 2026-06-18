# Iteration 001 — Correctness Review

**Dimension**: correctness
**Files reviewed**: query-classifier.ts, query-expander.ts, recovery-payload.ts, generic-query-deep-routing.vitest.ts

---

## Findings

### P2-001: SQL parameter count fragility in buildGraphExpandedFallback

[SOURCE: recovery-payload.ts:275-301]

The `buildGraphExpandedFallback` function constructs a SQL query with three identical `seedPlaceholdersSql` fragments (seed IDs, seed IDs again for the JOIN, and seed IDs for the NOT IN clause). The `.all(...seedIds, ...seedIds, ...seedIds)` call at line 297 spreads the same array three times to match. This is correct today but fragile: if someone adds or removes a placeholder group without updating the `.all()` call, the parameter count silently mismatches at runtime. The better-sqlite3 library will throw, but the error message will be opaque.

**Severity**: P2 (advisory)
**Category**: maintainability

### P2-002: classifyStatus fallback path ambiguity

[SOURCE: recovery-payload.ts:87]

The `classifyStatus` function has a final `return 'low_confidence'` with a comment "should only be called when recovery is warranted." This fallback is reachable if `shouldTriggerRecovery` is bypassed and a caller passes a context with `resultCount > 0`, no `evidenceGap`, and `avgConfidence >= threshold`. The function would return `'low_confidence'` for a result set that does not actually warrant recovery. Not a bug in current call sites (only `buildRecoveryPayload` calls it, gated by `shouldTriggerRecovery` externally), but the contract is implicit.

**Severity**: P2 (advisory)
**Category**: defensiveness

### P2-003: stopWordRatio rounding could mask boundary cases

[SOURCE: query-classifier.ts:257]

`stopWordRatio` is rounded to 3 decimal places for display (`Math.round(stopWordRatio * 1000) / 1000`). The `isLowSignalShortQuery` check at line 245 uses the unrounded value (from `calculateStopWordRatio`), so classification is correct. But if downstream consumers read `features.stopWordRatio` from the result object and compare against `LOW_SIGNAL_STOPWORD_RATIO`, the rounded value could disagree with the actual classification for boundary cases (e.g., ratio 0.4999 rounds to 0.5 but the unrounded value is below threshold). Not a current bug — no consumer does this — but worth noting.

**Severity**: P2 (advisory)
**Category**: correctness-boundary

---

## Non-Findings (Verified Correct)

1. **Escalation guard**: `isLowSignalShortQuery` requires `termCount >= 2`, preventing single-token degenerate escalation. Pinned by test "keeps a trigger-anchored short query on the simple route" and the regression the impl-summary documents (single stop-word "a" was initially escalated, guard added).

2. **Confidence override**: Line 247 sets `confidence = 'low'` after escalation, which correctly overrides the `determineConfidence` result. This is the signal that activates `lowSignalQuery` in hybrid-search for budget/recovery paths.

3. **No LLM cost added**: Escalation only changes tier and confidence. HyDE and reformulation gate on deep request mode at their call sites, which this change does not touch. Verified by the impl-summary decision log.

4. **Regex safety**: `expandQuery` uses `escapeRegExp` on user input before constructing `new RegExp(...)`. No ReDoS vector.

5. **SQL parameterization**: All SQL in `buildGraphExpandedFallback` uses `?` placeholders — no injection vector.

6. **Test coverage**: 8 tests cover escalation (2), cost control (3), and recovery suggestions (3). The regression case (single-token "a") is documented as caught-and-fixed mid-implementation.

---

## Verdict Assessment

No P0 or P1 findings. Three P2 advisories. The implementation correctly escalates low-signal short queries to the full pipeline, preserves cost control for confident short queries, and generates actionable recovery suggestions. The code is defensive, well-tested, and adds no LLM cost.

Review verdict: PASS
