# RVB-006 — :auto with missing required inputs must fail fast

```json
{
  "id": "RVB-006",
  "title": ":auto with missing required inputs must fail fast",
  "mode": "review",
  "entry_surface": "E1",
  "clarity": "C1",
  "prompt": ":auto",
  "invocation": {
    "kind": "command",
    "command": "deep/review"
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
  "notes": "Auto mode with no resolvable target: the contract is a fast failure NAMING the missing inputs — not a guessed target, not a hang."
}
```

**Rationale.** `:auto` carries no target argument and no spec folder, so auto mode has nothing to resolve. The contract is a fast, explicit failure that names the missing inputs rather than guessing a target or hanging.

**Pass shape.** Output fails fast with a diagnostic naming the missing required inputs (missing / required / cannot / unresolved) and the run terminates cleanly. No guessed target is written and no review is started.

**Failure modes.** Guessing a target and running anyway (setup_misbind); hanging while trying to resolve the absence (stuck_no_progress); or a crash with no meaningful diagnostic message (crash).
