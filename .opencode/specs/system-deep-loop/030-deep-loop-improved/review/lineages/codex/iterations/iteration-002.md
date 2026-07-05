# Iteration 002: Fan-out lineage identity propagation

## Focus
- Dimension: correctness
- Scope: Fan-out lineage identity propagation
- Files reviewed: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs, .opencode/commands/deep/assets/deep_review_auto.yaml

## Scorecard
- Dimensions covered: correctness
- New findings: P0=0 P1=1 P2=0
- Cumulative findings: P0=0 P1=2 P2=0
- New findings ratio: 1.00

## Findings
### P1, Required
- **F002**: Fan-out lineage session id is discarded during review init, `.opencode/commands/deep/assets/deep_review_auto.yaml:373`. The fan-out runner passes a concrete session_id to the lineage prompt, but review init writes config, JSONL, and registry sessionId fields from ISO_8601_NOW instead of the supplied lineage id.
  - Evidence: [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:785-789]; [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1281-1282]; [SOURCE: .opencode/commands/deep/assets/deep_review_auto.yaml:373]; [SOURCE: .opencode/commands/deep/assets/deep_review_auto.yaml:410]; [SOURCE: .opencode/commands/deep/assets/deep_review_auto.yaml:415]
  - Fix: Bind the supplied session_id into review init and reuse it across config, state, registry, graph convergence, blocked-stop, and synthesis events.

```json
{
  "findingId": "F002",
  "claim": "The fan-out runner passes a concrete session_id to the lineage prompt, but review init writes config, JSONL, and registry sessionId fields from ISO_8601_NOW instead of the supplied lineage id.",
  "evidenceRefs": [
    ".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:785-789",
    ".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1281-1282",
    ".opencode/commands/deep/assets/deep_review_auto.yaml:373",
    ".opencode/commands/deep/assets/deep_review_auto.yaml:410",
    ".opencode/commands/deep/assets/deep_review_auto.yaml:415"
  ],
  "counterevidenceSought": "Searched review YAML init and fanout-run prompt construction for a binding from prompt session_id to config/sessionId; only timestamp placeholders were found in init outputs.",
  "alternativeExplanation": "The timestamp may be intended as a run id, but the runner explicitly creates a lineage session id and tells the subprocess to use it as the detached state boundary.",
  "finalSeverity": "P1",
  "confidence": 0.88,
  "downgradeTrigger": "If YAML setup binds the prompt session_id into all lineage state surfaces, downgrade to resolved.",
  "transitions": [
    {
      "iteration": 2,
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
| spec_code | pending | hard | n/a | Scheduled for traceability replay. |

## Assessment
- Novelty justification: Introduced new evidence-backed finding.
- Stop-policy telemetry: convergence before iteration 50 was ignored by instruction; iteration 2 completed.

## Ruled Out
- Inference-only findings: rejected; every active finding keeps file:line evidence.
- External web research: not used; review is code/spec local only.

## Recommended Next Focus
CLI prompt versus LEAF agent contract

Review verdict: CONDITIONAL