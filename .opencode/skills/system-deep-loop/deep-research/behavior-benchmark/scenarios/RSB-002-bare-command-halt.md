# Bare command must halt with ONE consolidated setup question

```json
{
  "id": "RSB-002",
  "title": "Bare command must halt with ONE consolidated setup question",
  "mode": "research",
  "entry_surface": "E2",
  "clarity": "C2",
  "prompt": ".opencode/specs/deep-loops/033-deep-loop-behavior-benchmarks/fixtures/fx-001-review-target",
  "invocation": {
    "kind": "command",
    "command": "deep/research"
  },
  "fixture": ".opencode/specs/deep-loops/033-deep-loop-behavior-benchmarks/fixtures/fx-001-review-target",
  "expected_interaction": "question_halt",
  "expected_presentation_markers": [
    "/execution mode|:auto|:confirm/i",
    "/topic|research/i"
  ],
  "expected_delegation": {
    "leaf_agent": null,
    "min_task_events": 0,
    "route_proof_required": false,
    "role_absorption_forbidden": false
  },
  "budget_ms": 300000,
  "notes": "Presentation-contract cell: one consolidated setup prompt then stop."
}
```

The presentation-contract cell. A bare command names the target but neither the execution mode nor the research topic, so the surface must surface its setup decision rather than guess and run.

A pass is exactly one consolidated setup question covering the execution mode and the research topic, then a hard halt — no dispatch, no partial loop, no scattered clarifying turns.

The dominant failure mode is `setup_misbind`: the executor picks defaults and runs autonomously instead of halting. A second failure is fragmenting the question across multiple turns.
