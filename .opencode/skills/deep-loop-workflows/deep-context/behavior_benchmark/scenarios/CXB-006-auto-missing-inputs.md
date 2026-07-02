# :auto with missing required inputs must fail fast

```json
{
  "id": "CXB-006",
  "title": ":auto with missing required inputs must fail fast",
  "mode": "context",
  "entry_surface": "E1",
  "clarity": "C1",
  "prompt": ":auto",
  "invocation": {
    "kind": "command",
    "command": "deep/context"
  },
  "fixture": ".opencode/specs/deep-loops/033-deep-loop-behavior-benchmarks/fixtures/fx-001-review-target",
  "expected_interaction": "fail_fast",
  "expected_presentation_markers": [
    "/missing|required|cannot|unresolved/i"
  ],
  "expected_delegation": {
    "leaf_agent": null,
    "min_task_events": 0,
    "route_proof_required": false,
    "role_absorption_forbidden": false
  },
  "budget_ms": 300000,
  "notes": "Auto mode with no target: fail fast naming the missing inputs."
}
```

Auto mode asserts that all required inputs are present. With no context target supplied, the surface cannot run and must not pretend it can.

A pass is a fast failure that names the missing inputs — the marker vocabulary must read as a missing/required/cannot/unresolved statement — and terminates with no dispatch.

Failure modes are inventing a default target and running anyway (`setup_misbind`), a clarifying-question halt where a fail-fast was required, or a long stall before erroring.
