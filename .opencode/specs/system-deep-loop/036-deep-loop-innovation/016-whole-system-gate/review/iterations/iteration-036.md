# Iteration 036 — maintainability

- Executor: cli-codex gpt-5.6-luna effort=xhigh service_tier=fast sandbox=read-only
- Completed: 2026-07-30T09:03:26.860Z
- New findings: 5 (of 5 reported; prior total 147)
- Coverage: {"filesExamined":48,"keyPaths":[".opencode/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-loop/leaf-artifact-writer.ts",".opencode/skills/system-deep-loop/runtime/lib/branch-leases-waves/durable-orchestrator.ts",".opencode/skills/system-deep-loop/runtime/lib/branch-leases-waves/wave-plan.ts",".opencode/skills/system-deep-loop/runtime/lib/branch-leases-waves/types.ts",".opencode/skills/system-deep-loop/runtime/lib/transactional-projections/transactional-projection-engine.ts",".opencode/skills/system-deep-loop/runtime/lib/health-degeneration-harness/health-adapters.ts",".opencode/skills/system-deep-loop/runtime/lib/event-envelope/event-type-registry.ts",".opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/append-only-ledger.ts"]}

## Summary
Reviewed runtime/lib persistence, reducer, and branch-orchestration boundaries. Strict runtime TypeScript checking passed, and the scan found no actual any declarations. The main risk is unchecked JSON and generic values being asserted into closed types after shallow validation. Four concrete P1 defects and one P2 type-contract defect were found.

## Findings
- [P1] F-036-01 Run cache erases the pool-item generic @ .opencode/skills/system-deep-loop/runtime/lib/branch-leases-waves/durable-orchestrator.ts:591
  - evidence: initializeRun<TItem> stores CompiledBranchRun<TItem> in Map<string, CompiledBranchRun<unknown>> via a cast at line 362. runAuthorizedWave<TItem> retrieves the same runId and casts it to CompiledBranchRun<TItem> at line 591, then passes poolItem to the caller's typed worker at lines 625-675. Independent calls can initialize a run with string items and invoke it with TItem=number.
  - recommendation: Bind the compiled run to an opaque typed handle returned by initialization, or remove the generic cache and require a revalidated typed manifest at execution time.
- [P1] F-036-02 Pivot events are cast after generic-only validation @ .opencode/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts:528
  - evidence: readEventStore checks only generic event fields and then casts parsed JSON directly to PivotEvent. completedResultFromEvent validates selectedCandidate but only checks isRecord(event.agreement) before casting it to PivotAgreementResult at line 742; event-specific agreement fields are never validated.
  - recommendation: Use a discriminated per-event parser that validates every required nested field before constructing the PivotEvent union.
- [P1] F-036-03 Persisted pivot config is asserted as a closed shape after shallow checks @ .opencode/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts:995
  - evidence: readPersistedConfig checks only that the JSON value is an object with the expected pivotId and an acceptedCandidates array, then returns it as PersistedPivotConfig. Later code dereferences seats at lines 1168 and 1225 and usageAtStart at line 1305 without validating those fields or their nested members.
  - recommendation: Parse the complete persisted configuration schema, including identity, limits, seats, candidates, usage counters, and saturated directions; reject malformed or incomplete resume artifacts.
- [P1] F-036-04 Leaf state records accept wrong-typed authoritative fields @ .opencode/skills/system-deep-loop/runtime/lib/deep-loop/leaf-artifact-writer.ts:149
  - evidence: validateReported casts the payload to Record<string, unknown>, checks only field presence plus status and artifactsChecked, and does not validate laneId, authority, artifactClass, findingsCount, or array element types. writeLeafArtifacts then persists the unchecked record at line 226 and also casts deltaFindings at lines 229-237.
  - recommendation: Introduce a closed runtime parser for the state record and finding entries, validating string identities, allowed artifact classes, nonnegative integer counts, and audited-path strings before persistence.
- [P2] F-036-05 Frozen wave collections are typed as mutable arrays @ .opencode/skills/system-deep-loop/runtime/lib/branch-leases-waves/wave-plan.ts:90
  - evidence: ImmutableWave declares memberBranchIds and prerequisiteWaveIds as string[], while wave-plan freezes both arrays and casts them back to mutable arrays with as unknown as string[]. The outer waves array is likewise frozen and cast to ImmutableWave[] at line 106. Tests explicitly verify that push throws at branch-leases-waves.vitest.ts:247.
  - recommendation: Declare these members as readonly string[] and the plan collection as readonly ImmutableWave[], removing the casts so compile-time mutability matches runtime behavior.

## Leaf output (verbatim JSON)
```json
{
  "iteration": 36,
  "dimension": "maintainability",
  "summary": "Reviewed runtime/lib persistence, reducer, and branch-orchestration boundaries. Strict runtime TypeScript checking passed, and the scan found no actual any declarations. The main risk is unchecked JSON and generic values being asserted into closed types after shallow validation. Four concrete P1 defects and one P2 type-contract defect were found.",
  "findings": [
    {
      "severity": "P1",
      "dimension": "maintainability",
      "title": "Run cache erases the pool-item generic",
      "file": ".opencode/skills/system-deep-loop/runtime/lib/branch-leases-waves/durable-orchestrator.ts",
      "line": 591,
      "evidence": "initializeRun<TItem> stores CompiledBranchRun<TItem> in Map<string, CompiledBranchRun<unknown>> via a cast at line 362. runAuthorizedWave<TItem> retrieves the same runId and casts it to CompiledBranchRun<TItem> at line 591, then passes poolItem to the caller's typed worker at lines 625-675. Independent calls can initialize a run with string items and invoke it with TItem=number.",
      "recommendation": "Bind the compiled run to an opaque typed handle returned by initialization, or remove the generic cache and require a revalidated typed manifest at execution time."
    },
    {
      "severity": "P1",
      "dimension": "maintainability",
      "title": "Pivot events are cast after generic-only validation",
      "file": ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts",
      "line": 528,
      "evidence": "readEventStore checks only generic event fields and then casts parsed JSON directly to PivotEvent. completedResultFromEvent validates selectedCandidate but only checks isRecord(event.agreement) before casting it to PivotAgreementResult at line 742; event-specific agreement fields are never validated.",
      "recommendation": "Use a discriminated per-event parser that validates every required nested field before constructing the PivotEvent union."
    },
    {
      "severity": "P1",
      "dimension": "maintainability",
      "title": "Persisted pivot config is asserted as a closed shape after shallow checks",
      "file": ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts",
      "line": 995,
      "evidence": "readPersistedConfig checks only that the JSON value is an object with the expected pivotId and an acceptedCandidates array, then returns it as PersistedPivotConfig. Later code dereferences seats at lines 1168 and 1225 and usageAtStart at line 1305 without validating those fields or their nested members.",
      "recommendation": "Parse the complete persisted configuration schema, including identity, limits, seats, candidates, usage counters, and saturated directions; reject malformed or incomplete resume artifacts."
    },
    {
      "severity": "P1",
      "dimension": "maintainability",
      "title": "Leaf state records accept wrong-typed authoritative fields",
      "file": ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/leaf-artifact-writer.ts",
      "line": 149,
      "evidence": "validateReported casts the payload to Record<string, unknown>, checks only field presence plus status and artifactsChecked, and does not validate laneId, authority, artifactClass, findingsCount, or array element types. writeLeafArtifacts then persists the unchecked record at line 226 and also casts deltaFindings at lines 229-237.",
      "recommendation": "Introduce a closed runtime parser for the state record and finding entries, validating string identities, allowed artifact classes, nonnegative integer counts, and audited-path strings before persistence."
    },
    {
      "severity": "P2",
      "dimension": "maintainability",
      "title": "Frozen wave collections are typed as mutable arrays",
      "file": ".opencode/skills/system-deep-loop/runtime/lib/branch-leases-waves/wave-plan.ts",
      "line": 90,
      "evidence": "ImmutableWave declares memberBranchIds and prerequisiteWaveIds as string[], while wave-plan freezes both arrays and casts them back to mutable arrays with as unknown as string[]. The outer waves array is likewise frozen and cast to ImmutableWave[] at line 106. Tests explicitly verify that push throws at branch-leases-waves.vitest.ts:247.",
      "recommendation": "Declare these members as readonly string[] and the plan collection as readonly ImmutableWave[], removing the casts so compile-time mutability matches runtime behavior."
    }
  ],
  "refutations": [],
  "coverage": {
    "filesExamined": 48,
    "keyPaths": [
      ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/leaf-artifact-writer.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/branch-leases-waves/durable-orchestrator.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/branch-leases-waves/wave-plan.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/branch-leases-waves/types.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/transactional-projections/transactional-projection-engine.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/health-degeneration-harness/health-adapters.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/event-envelope/event-type-registry.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/append-only-ledger.ts"
    ]
  }
}
```