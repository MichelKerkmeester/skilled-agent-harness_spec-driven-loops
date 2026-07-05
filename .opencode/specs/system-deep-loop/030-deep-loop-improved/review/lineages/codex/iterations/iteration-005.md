# Iteration 005: Workflow comment hygiene

## Focus
- Dimension: maintainability
- Scope: Workflow comment hygiene
- Files reviewed: .opencode/commands/deep/assets/deep_review_auto.yaml

## Scorecard
- Dimensions covered: maintainability
- New findings: P0=0 P1=1 P2=0
- Cumulative findings: P0=0 P1=5 P2=0
- New findings ratio: 1.00

## Findings
### P1, Required
- **F005**: Workflow YAML carries ephemeral finding-id comments, `.opencode/commands/deep/assets/deep_review_auto.yaml:395`. The review workflow embeds an ephemeral finding id in comments, which violates the active comment-hygiene rule that forbids artifact/finding identifiers in durable code or workflow comments.
  - Evidence: [SOURCE: .opencode/commands/deep/assets/deep_review_auto.yaml:395]; [SOURCE: .opencode/commands/deep/assets/deep_review_auto.yaml:408]
  - Fix: Remove the finding-id marker and keep only the durable rationale for honoring the parsed resource-map flag.

```json
{
  "findingId": "F005",
  "claim": "The review workflow embeds an ephemeral finding id in comments, which violates the active comment-hygiene rule that forbids artifact/finding identifiers in durable code or workflow comments.",
  "evidenceRefs": [
    ".opencode/commands/deep/assets/deep_review_auto.yaml:395",
    ".opencode/commands/deep/assets/deep_review_auto.yaml:408"
  ],
  "counterevidenceSought": "Inspected adjacent comments; the durable rationale is present separately, so the finding-id marker is not needed to preserve meaning.",
  "alternativeExplanation": "The marker may have been useful during a remediation pass, but it is not durable design context and will age poorly.",
  "finalSeverity": "P1",
  "confidence": 0.86,
  "downgradeTrigger": "If the ephemeral marker comments are removed while preserving the durable why, downgrade to resolved.",
  "transitions": [
    {
      "iteration": 5,
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
- Stop-policy telemetry: convergence before iteration 50 was ignored by instruction; iteration 5 completed.

## Ruled Out
- Inference-only findings: rejected; every active finding keeps file:line evidence.
- External web research: not used; review is code/spec local only.

## Recommended Next Focus
Writable path boundary review

Review verdict: CONDITIONAL