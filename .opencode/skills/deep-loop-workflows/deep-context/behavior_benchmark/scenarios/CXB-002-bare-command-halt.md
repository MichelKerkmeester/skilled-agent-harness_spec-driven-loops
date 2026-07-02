# Bare command must halt with ONE consolidated setup question

```json
{
  "id": "CXB-002",
  "title": "Bare command must halt with ONE consolidated setup question",
  "mode": "context",
  "entry_surface": "E2",
  "clarity": "C2",
  "prompt": ".opencode/specs/deep-loops/033-deep-loop-behavior-benchmarks/fixtures/fx-001-review-target",
  "invocation": {
    "kind": "command",
    "command": "deep/context"
  },
  "fixture": ".opencode/specs/deep-loops/033-deep-loop-behavior-benchmarks/fixtures/fx-001-review-target",
  "expected_interaction": "question_halt",
  "expected_presentation_markers": [
    "/execution mode|:auto|:confirm/i",
    "/context|target|scope/i"
  ],
  "expected_delegation": {
    "leaf_agent": null,
    "min_task_events": 0,
    "route_proof_required": false,
    "role_absorption_forbidden": false
  },
  "budget_ms": 300000,
  "notes": "Presentation-contract cell."
}
```

The presentation-contract cell. A bare command names the target but not the execution mode, so the surface must surface its setup decision rather than guess and run.

A pass is exactly one consolidated setup question covering the execution mode and the context target/scope, then a hard halt — no dispatch, no partial sweep, no scattered clarifying turns.

The dominant failure mode is `setup_misbind`: the executor picks a default mode and runs autonomously instead of halting. A second failure is fragmenting the question across multiple turns.
