# Iteration 004: Focused fan-out verification and native pool behavior

## Focus
- Dimension: correctness
- Scope: Focused fan-out verification and native pool behavior
- Files reviewed: .opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts, .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs

## Scorecard
- Dimensions covered: correctness
- New findings: P0=0 P1=1 P2=0
- Cumulative findings: P0=0 P1=4 P2=0
- New findings ratio: 1.00

## Findings
### P1, Required
- **F004**: Focused fan-out regression suite fails after native lineages were folded into the pool, `.opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts:341`. The checked-in fanout-run tests still expect native-only configurations to produce no CLI lineage work, while the implementation now assigns all lineages to the pool, and the focused vitest run fails 3 tests.
  - Evidence: [SOURCE: .opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts:323-341]; [SOURCE: .opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts:458]; [SOURCE: .opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts:1342-1343]; [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1174-1177]
  - Fix: Either update the native-only tests to the new pool-owned native behavior with a native/opencode stub, or restore a true no-CLI branch; keep the prompt wording assertion synchronized with the current legal-convergence phrase.

```json
{
  "findingId": "F004",
  "claim": "The checked-in fanout-run tests still expect native-only configurations to produce no CLI lineage work, while the implementation now assigns all lineages to the pool, and the focused vitest run fails 3 tests.",
  "evidenceRefs": [
    ".opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts:323-341",
    ".opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts:458",
    ".opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts:1342-1343",
    ".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1174-1177"
  ],
  "counterevidenceSought": "Ran the focused fanout-run and fanout-merge vitest files; fanout-merge passed but fanout-run failed the cited assertions.",
  "alternativeExplanation": "The implementation change may be intentional, but the verification suite is now red and no longer protects the intended behavior.",
  "finalSeverity": "P1",
  "confidence": 0.93,
  "downgradeTrigger": "If the focused fanout-run tests pass after aligning native pool expectations and prompt wording, downgrade to resolved.",
  "transitions": [
    {
      "iteration": 4,
      "from": null,
      "to": "P1",
      "reason": "Initial discovery"
    }
  ]
}
```

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | .opencode/specs/deep-loops/030-agent-loops-improved/008-loop-systems-remediation/spec.md:42 | Phase metadata and shipped state are not reconciled. |

## Assessment
- Novelty justification: Introduced new evidence-backed finding.
- Stop-policy telemetry: convergence before iteration 50 was ignored by instruction; iteration 4 completed.

## Ruled Out
- Inference-only findings: rejected; every active finding keeps file:line evidence.
- External web research: not used; review is code/spec local only.

## Recommended Next Focus
Workflow comment hygiene

Review verdict: CONDITIONAL