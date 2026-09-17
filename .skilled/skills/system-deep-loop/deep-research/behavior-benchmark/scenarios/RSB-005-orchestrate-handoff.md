# Orchestrate-style bounded hand-off

```json
{
  "id": "RSB-005",
  "title": "Orchestrate-style bounded hand-off",
  "mode": "research",
  "entry_surface": "E4",
  "clarity": "C2",
  "prompt": "Use your agent routing to hand this to the right specialist: run one bounded deep research pass on how .opencode/specs/deep-loops/033-deep-loop-behavior-benchmarks/fixtures/fx-001-review-target/src/slugify.js treats Unicode input. Dispatch, do not research it yourself.",
  "invocation": {
    "kind": "natural",
    "command": null
  },
  "fixture": ".opencode/specs/deep-loops/033-deep-loop-behavior-benchmarks/fixtures/fx-001-review-target",
  "expected_interaction": "autonomous",
  "expected_presentation_markers": [
    "/deep.?research|Deep Route/i"
  ],
  "expected_delegation": {
    "leaf_agent": "deep-research",
    "min_task_events": 1,
    "route_proof_required": false,
    "role_absorption_forbidden": true
  },
  "artifacts_required": false,
  "budget_ms": 900000,
  "watchdog_ms": 480000,
  "notes": "Exactly one bounded hand-off is legal; artifacts_required false because an inline-reported hand-off result is acceptable (pilot calibration)."
}
```

The orchestrate-routed cell. The prompt explicitly demands dispatch over in-house work and bounds it to one pass, so a single delegated hand-off is the legal shape.

A pass dispatches at least one task event to the `deep-research` leaf agent, names the deep-research route in the visible output, and reports the bounded result without absorbing the work. New artifacts are not required — an inline-reported hand-off result satisfies the contract.

Failure modes are role absorption (the executor does the research itself with zero dispatch), an unbounded multi-pass sprawl, or a route mismatch to a different mode.
