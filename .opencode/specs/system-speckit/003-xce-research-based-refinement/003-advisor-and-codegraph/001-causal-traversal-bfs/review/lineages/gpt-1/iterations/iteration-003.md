# Iteration 3: Traceability

## Focus
Traceability pass comparing spec success criteria, tasks, implementation summary, and test evidence.

## Scorecard
- Dimensions covered: traceability
- Files reviewed: 4
- New findings: P0=0 P1=1 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00

## Findings

### P0, Blocker
None.

### P1, Required
- **F002**: SC-002 requires p95 latency, but verification records only mean latency - `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/012-causal-traversal-bfs/spec.md:118` - The shipped packet claims SC-002, which requires hot-path traversal p95 at or below the current CTE [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/012-causal-traversal-bfs/spec.md:118-119]. The benchmark helper computes elapsed time divided by iterations, which is a mean [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/causal-traversal-bfs-equivalence.vitest.ts:142-147], and the test/report record CTE mean vs BFS mean rather than p95 [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/causal-traversal-bfs-equivalence.vitest.ts:219-233] [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/012-causal-traversal-bfs/implementation-summary.md:119-125]. The stricter success criterion is therefore unproven.

### P2, Suggestion
None.

## Claim Adjudication Packets
```json
{
  "findingId": "F002",
  "claim": "The packet marks SC-002 shipped even though the implemented benchmark helper computes a simple mean and the summary table reports mean, not p95 latency.",
  "evidenceRefs": [
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/012-causal-traversal-bfs/spec.md:118-119",
    ".opencode/skills/system-spec-kit/mcp_server/tests/causal-traversal-bfs-equivalence.vitest.ts:142-147",
    ".opencode/skills/system-spec-kit/mcp_server/tests/causal-traversal-bfs-equivalence.vitest.ts:219-233",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/012-causal-traversal-bfs/implementation-summary.md:119-125"
  ],
  "counterevidenceSought": "Checked tasks.md T008, implementation-summary latency table, and the benchmark helper/test body for percentile computation or recorded p95 output; none was present.",
  "alternativeExplanation": "REQ-003 only asks for a recorded benchmark, but SC-002 explicitly names p95, so the stricter success criterion remains unproven.",
  "finalSeverity": "P1",
  "confidence": 0.91,
  "downgradeTrigger": "Downgrade to P2 after a p95 benchmark row is recorded or SC-002 is amended to match the mean-latency evidence.",
  "transitions": [
    { "iteration": 3, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/012-causal-traversal-bfs/spec.md:118-119`; `.opencode/skills/system-spec-kit/mcp_server/tests/causal-traversal-bfs-equivalence.vitest.ts:142-147` | SC-002 names p95 but the evidence measures mean. |
| checklist_evidence | pass | hard | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/012-causal-traversal-bfs/tasks.md:50-72` | Checked task rows carry concrete evidence. |

## Assessment
- New findings ratio: 1.00
- Dimensions addressed: traceability
- Novelty justification: Found one hard traceability gap between success criteria and recorded verification metric.

## Ruled Out
- SC-001 equivalence evidence is supported by the helper and test assertions.
- Task evidence for code cutover and CTE-removal claim resolves to implementation files and source scan statement.

## Dead Ends
- Treating REQ-003 as contradicted was rejected because REQ-003 only asks for a benchmark record; the mismatch is with SC-002's p95 wording.

## Recommended Next Focus
Maintainability pass over the benchmark gate and test reliability.
Review verdict: CONDITIONAL
