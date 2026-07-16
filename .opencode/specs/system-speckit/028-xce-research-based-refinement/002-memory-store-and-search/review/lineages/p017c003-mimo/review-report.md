# Review Report — Generic-Query Deep Routing (p017c003-mimo)

---

## 1. Executive Summary

The generic-query deep routing implementation correctly escalates low-signal short queries from the cheap simple route to the full retrieval pipeline, and generates actionable recovery suggestions for weak results. One iteration of correctness review found zero P0/P1 findings and three P2 advisories. **Verdict: PASS.**

---

## 2. Planning Trigger

This fan-out lineage was triggered to review Phase 3 (generic-query-deep-routing) of the search-and-output-intelligence implementation track. The implementation modifies the query classifier, query expander, and recovery payload to handle generic short queries that previously returned weak results.

---

## 3. Active Finding Registry

| ID | Severity | Category | File | Line | Description |
|----|----------|----------|------|------|-------------|
| P2-001 | P2 | maintainability | recovery-payload.ts | 275-301 | SQL parameter count fragility — `.all(...seedIds, ...seedIds, ...seedIds)` must match exactly 3 placeholder groups; adding/removing a group without updating the call silently mismatches at runtime. |
| P2-002 | P2 | defensiveness | recovery-payload.ts | 87 | `classifyStatus` fallback returns `'low_confidence'` for any context that does not match earlier conditions, even if recovery is not warranted. Contract is implicit, relying on callers to gate via `shouldTriggerRecovery`. |
| P2-003 | P2 | correctness-boundary | query-classifier.ts | 257 | `features.stopWordRatio` is rounded to 3 decimals for display but `isLowSignalShortQuery` uses the unrounded value. Downstream consumers reading the rounded value could disagree with classification at the 0.5 boundary. |

---

## 4. Remediation Workstreams

All findings are P2 advisories. No blocking remediation required. Optional improvements:

- **P2-001**: Consider a helper function that builds the SQL and params together, or add a comment documenting the 1:1 correspondence between placeholder groups and `.all()` spreads.
- **P2-002**: Add a guard in `classifyStatus` that returns a neutral status (or throws) when called without prior `shouldTriggerRecovery` gating, or document the precondition.
- **P2-003**: Either use the unrounded value in the result object's features, or document that `features.stopWordRatio` is for display only and should not be used for threshold comparisons.

---

## 5. Spec Seed

No new spec work identified. The implementation matches the spec-folder intent documented in `implementation-summary.md`.

---

## 6. Plan Seed

No new planning work identified. The three P2 findings are optional quality improvements that can be addressed in a future cleanup pass.

---

## 7. Traceability Status

| Protocol | Status |
|----------|--------|
| spec-code alignment | PASS — implementation matches impl-summary decisions |
| checklist evidence | N/A — no checklist.md in this spec folder |
| test coverage | PASS — 8 focused tests + 344 downstream + 231 consumer tests green |

---

## 8. Deferred Items

- `LOW_SIGNAL_STOPWORD_RATIO = 0.5` tuning against real `memory_search` traffic (documented open question in impl-summary)
- HyDE-on-generic routing requires changes outside the allowed write set (documented limitation)

---

## 9. Audit Appendix

- **Session ID**: fanout-p017c003-mimo-1781723046064-9uo58o
- **Executor**: cli-opencode (xiaomi/mimo-v2.5-pro)
- **Iterations**: 1 (maxIterations=1)
- **Dimensions reviewed**: correctness
- **Dimensions remaining**: security, spec-alignment, completeness
- **Stop reason**: maxIterations reached
- **Release readiness**: converged (PASS, no blocking findings)

---

Review verdict: PASS
