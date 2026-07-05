# Iteration 003: CLI prompt versus LEAF agent contract

## Focus
- Dimension: traceability
- Scope: CLI prompt versus LEAF agent contract
- Files reviewed: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs, .opencode/agents/deep-review.md, .opencode/commands/deep/review.md

## Scorecard
- Dimensions covered: traceability
- New findings: P0=0 P1=1 P2=0
- Cumulative findings: P0=0 P1=3 P2=0
- New findings ratio: 1.00

## Findings
### P1, Required
- **F003**: CLI fan-out prompt names the LEAF deep-review agent and asks it to run the full loop, `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:806`. The generated CLI lineage prompt says the subprocess is a deep-review agent and instructs it to run phase_init, phase_main_loop, and phase_synthesis, contradicting the deep-review agent contract that it executes exactly one iteration and must not run the full loop.
  - Evidence: [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:806]; [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:816]; [SOURCE: .opencode/agents/deep-review.md:34]; [SOURCE: .opencode/agents/deep-review.md:54-64]; [SOURCE: .opencode/commands/deep/review.md:117]
  - Fix: Render CLI lineage prompts as command-host/orchestrator prompts, or invoke the deep/review command surface directly, so LEAF-only agent instructions do not conflict with full-loop phase execution.

```json
{
  "findingId": "F003",
  "claim": "The generated CLI lineage prompt says the subprocess is a deep-review agent and instructs it to run phase_init, phase_main_loop, and phase_synthesis, contradicting the deep-review agent contract that it executes exactly one iteration and must not run the full loop.",
  "evidenceRefs": [
    ".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:806",
    ".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:816",
    ".opencode/agents/deep-review.md:34",
    ".opencode/agents/deep-review.md:54-64",
    ".opencode/commands/deep/review.md:117"
  ],
  "counterevidenceSought": "Checked fanout-run native command handling, deep/review command docs, and the canonical deep-review agent contract; the conflict remains in the CLI prompt text.",
  "alternativeExplanation": "The process may not literally load the @deep-review agent profile, but the prompt text self-identifies that way and is exactly the surface GPT-backed lineages consume.",
  "finalSeverity": "P1",
  "confidence": 0.84,
  "downgradeTrigger": "If the prompt stops identifying the subprocess as a LEAF deep-review agent or moves CLI lineages through the command YAML host, downgrade to resolved.",
  "transitions": [
    {
      "iteration": 3,
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
- Stop-policy telemetry: convergence before iteration 50 was ignored by instruction; iteration 3 completed.

## Ruled Out
- Inference-only findings: rejected; every active finding keeps file:line evidence.
- External web research: not used; review is code/spec local only.

## Recommended Next Focus
Focused fan-out verification and native pool behavior

Review verdict: CONDITIONAL