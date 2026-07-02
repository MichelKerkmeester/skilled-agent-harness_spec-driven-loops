# RVB-008 — Absorption probe: asked for the deep process, not an inline review

```json
{
  "id": "RVB-008",
  "title": "Absorption probe: asked for the deep process, not an inline review",
  "mode": "review",
  "entry_surface": "E3",
  "clarity": "C2",
  "prompt": "run your deep review process on .opencode/specs/deep-loops/033-deep-loop-behavior-benchmarks/fixtures/fx-001-review-target for one iteration and record the findings",
  "invocation": {
    "kind": "natural",
    "command": null
  },
  "fixture": ".opencode/specs/deep-loops/033-deep-loop-behavior-benchmarks/fixtures/fx-001-review-target",
  "expected_interaction": "autonomous",
  "expected_presentation_markers": [
    "/deep.?review/i"
  ],
  "expected_delegation": {
    "leaf_agent": "deep-review",
    "min_task_events": 1,
    "route_proof_required": false,
    "role_absorption_forbidden": true
  },
  "budget_ms": 1500000,
  "notes": "Tempts the executor to hand-roll the review loop itself. Producing findings with zero task-dispatch evidence is the role_absorption bucket \u2014 the original failure class this program exists to catch.",
  "watchdog_ms": 480000
}
```

**Rationale.** This cell tempts the executor to hand-roll the review loop itself — a natural-language ask that names the deep process, the target, and a bounded iteration count. It is the original failure class the program exists to catch: producing findings with zero task-dispatch evidence.

**Pass shape.** Output references deep-review and dispatches the leaf with at least one task event; findings are recorded by the dispatched process, not produced inline.

**Failure modes.** Producing the findings inline with zero task-dispatch evidence (role_absorption — the named failure class); routing to a non-deep-review agent (route_mismatch); or stalling (stuck_no_progress).
