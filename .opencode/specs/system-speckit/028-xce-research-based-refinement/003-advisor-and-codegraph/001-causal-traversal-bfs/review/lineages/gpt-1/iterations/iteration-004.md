# Iteration 4: Maintainability

## Focus
Maintainability pass over test reliability, release gate stability, and safe follow-on changes.

## Scorecard
- Dimensions covered: maintainability
- Files reviewed: 2
- New findings: P0=0 P1=1 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00

## Findings

### P0, Blocker
None.

### P1, Required
- **F003**: Latency benchmark is enforced as a deterministic unit-test assertion - `.opencode/skills/system-spec-kit/mcp_server/tests/causal-traversal-bfs-equivalence.vitest.ts:219` - The test measures mean elapsed time over 25 in-process iterations [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/causal-traversal-bfs-equivalence.vitest.ts:142-147], then fails if BFS is slower than CTE in that single sample [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/causal-traversal-bfs-equivalence.vitest.ts:219-233]. This couples a correctness/equivalence suite to a noisy microbenchmark and can fail under normal scheduler, cache, or CI-host variance.

### P2, Suggestion
None.

## Claim Adjudication Packets
```json
{
  "findingId": "F003",
  "claim": "The equivalence suite asserts bfsMs <= cteMs from a 25-iteration in-process mean, so ordinary scheduler or cache noise can fail the release gate even when behavior is correct.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/mcp_server/tests/causal-traversal-bfs-equivalence.vitest.ts:142-147",
    ".opencode/skills/system-spec-kit/mcp_server/tests/causal-traversal-bfs-equivalence.vitest.ts:219-233"
  ],
  "counterevidenceSought": "Checked the benchmark helper and test body for warmup, percentile sampling, tolerance, or an advisory-only recording mode; none was present.",
  "alternativeExplanation": "The local run recorded BFS faster than CTE, but a single local mean does not make the assertion stable across CI hosts and concurrent load.",
  "finalSeverity": "P1",
  "confidence": 0.86,
  "downgradeTrigger": "Downgrade to P2 after the latency comparison is moved to advisory reporting or hardened with warmup, percentile sampling, and a documented tolerance.",
  "transitions": [
    { "iteration": 4, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | `.opencode/skills/system-spec-kit/mcp_server/tests/causal-traversal-bfs-equivalence.vitest.ts:219-233` | Performance proof exists but is metric-mismatched and fragile as a hard test gate. |
| checklist_evidence | pass | hard | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/012-causal-traversal-bfs/tasks.md:50-72` | Task rows include evidence; the concern is evidence strength and gate stability. |

## Assessment
- New findings ratio: 1.00
- Dimensions addressed: maintainability
- Novelty justification: Found one release-gate stability issue around the benchmark assertion.

## Ruled Out
- No additional maintainability blocker found in the shared traversal abstraction or storage port adapter.

## Dead Ends
- A broad rewrite of BFS traversal was rejected; the active risk is limited to verification semantics and benchmark stability.

## Recommended Next Focus
Run a stabilization pass to confirm no new P0/P1 classes remain and that claim adjudication packets are complete.
Review verdict: CONDITIONAL
