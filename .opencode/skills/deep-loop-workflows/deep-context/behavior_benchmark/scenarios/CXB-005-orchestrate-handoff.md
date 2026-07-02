# Orchestrate-style bounded hand-off

```json
{
  "id": "CXB-005",
  "title": "Orchestrate-style bounded hand-off",
  "mode": "context",
  "entry_surface": "E4",
  "clarity": "C2",
  "prompt": "Use your agent routing to hand this to the right specialist: run one bounded deep context sweep of .opencode/specs/deep-loops/033-deep-loop-behavior-benchmarks/fixtures/fx-001-review-target. Dispatch, do not gather the context yourself.",
  "invocation": {
    "kind": "natural",
    "command": null
  },
  "fixture": ".opencode/specs/deep-loops/033-deep-loop-behavior-benchmarks/fixtures/fx-001-review-target",
  "expected_interaction": "autonomous",
  "expected_presentation_markers": [
    "/deep.?context|Deep Route/i"
  ],
  "expected_delegation": {
    "leaf_agent": "deep-context",
    "min_task_events": 1,
    "route_proof_required": false,
    "role_absorption_forbidden": true
  },
  "artifacts_required": false,
  "budget_ms": 900000,
  "watchdog_ms": 480000,
  "notes": "One bounded hand-off; inline-reported result acceptable (artifacts_required false)."
}
```

The orchestrate-routed cell. The prompt explicitly demands dispatch over in-house work and bounds it to one sweep, so a single delegated hand-off is the legal shape.

A pass dispatches at least one task event to the `deep-context` leaf agent, names the deep-context route in the visible output, and reports the bounded result without absorbing the work. New artifacts are not required — an inline-reported hand-off result satisfies the contract.

Failure modes are role absorption (the executor gathers the context itself with zero dispatch), an unbounded multi-sweep sprawl, or a route mismatch to a different mode.
