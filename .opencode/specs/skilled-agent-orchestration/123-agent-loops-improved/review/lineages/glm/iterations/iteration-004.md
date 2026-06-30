# Iteration 4 — undefined — Native-only fan-out test vs flat-pool implementation

**Executor**: cli-opencode model=zai-coding-plan/glm-5.2
**sessionId**: fanout-glm-1782805948784-ypcv5r
**status**: insight

## Focus
Native-only fan-out test vs flat-pool implementation

## Findings
### F004 (P1) Native-only fan-out test no longer matches the flat-pool implementation
- Status: active
- Dimension: correctness
- Category: correctness
- Class: test_contract_drift
- [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1174]
- [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1177]
- [SOURCE: .opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts:323]
- [SOURCE: .opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts:344]
- [SOURCE: .opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts:351]
- Claim: fanout-run.cjs:1177 now assigns `cliLineages = allLineages` (the pool owns every lineage kind, including native, per the comment at 1174-1177), but fanout-run.vitest.ts:323-352 still asserts that a native-only config produces zero CLI lineage work, an empty results array, and an empty_tick convergence summary. The implementation now dispatches native lineages into the pool, so the focused assertion is stale and the native-only test will fail.
- Recommendation: Update the native-only tests to the new pool-owned native contract (with a native/opencode stub) or restore a true no-CLI branch; keep the legal-convergence phrase assertion synchronized with the current wording emitted by summarizeSnapshots.

## Convergence Telemetry
- newFindingsRatio: 1.000
- findingsSummary: P0=0 P1=1 P2=0
- newFindings: P0=0 P1=1 P2=0
- note: Discovered F004; re-read vitest lines 323-352 and fanout-run.cjs:1174-1177.

## Scope Proof
All cited evidence is within the declared spec-folder / deep-loop orchestration review scope.

Review verdict: CONDITIONAL