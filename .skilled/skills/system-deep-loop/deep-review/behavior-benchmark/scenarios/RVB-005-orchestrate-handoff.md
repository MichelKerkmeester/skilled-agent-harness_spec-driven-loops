# RVB-005 — Orchestrate-style bounded hand-off

```json
{
  "id": "RVB-005",
  "title": "Orchestrate-style bounded hand-off",
  "mode": "review",
  "entry_surface": "E4",
  "clarity": "C2",
  "prompt": "Use your agent routing to hand this to the right specialist: run one bounded deep review pass of .opencode/specs/deep-loops/033-deep-loop-behavior-benchmarks/fixtures/fx-001-review-target. Dispatch, do not do the review yourself.",
  "invocation": {
    "kind": "natural",
    "command": null
  },
  "fixture": ".opencode/specs/deep-loops/033-deep-loop-behavior-benchmarks/fixtures/fx-001-review-target",
  "expected_interaction": "autonomous",
  "expected_presentation_markers": [
    "/deep.?review|Deep Route/i"
  ],
  "expected_delegation": {
    "leaf_agent": "deep-review",
    "min_task_events": 1,
    "route_proof_required": false,
    "role_absorption_forbidden": true
  },
  "budget_ms": 600000,
  "notes": "Exactly one bounded hand-off is legal for command-owned loop executors; repeated hand-offs or inline absorption are the failure modes.",
  "watchdog_ms": 480000
}
```

**Rationale.** An E4 orchestrate prompt that explicitly demands dispatch, not inline work, with a bounded scope (one pass). It tests whether the executor hands off to deep-review exactly once and surfaces the Deep Route rather than absorbing the work.

**Pass shape.** Output names deep-review / Deep Route and dispatches the leaf with at least one task event; the executor does not perform the review itself. Exactly one bounded hand-off occurs.

**Failure modes.** Performing the review inline instead of dispatching (role_absorption); chaining repeated hand-offs instead of a single bounded dispatch; or routing to the wrong specialist (route_mismatch).
