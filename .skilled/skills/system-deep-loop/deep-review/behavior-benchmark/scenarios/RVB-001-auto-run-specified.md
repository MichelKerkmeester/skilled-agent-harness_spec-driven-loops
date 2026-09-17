# RVB-001 — Fully-specified :auto run

```json
{
  "id": "RVB-001",
  "title": "Fully-specified :auto run",
  "mode": "review",
  "entry_surface": "E1",
  "clarity": "C3",
  "prompt": ".opencode/specs/deep-loops/033-deep-loop-behavior-benchmarks/fixtures/fx-001-review-target :auto --review-target-type=spec-folder --dims=correctness --max-iterations=1 --convergence=0.0 --spec-folder=.opencode/specs/deep-loops/033-deep-loop-behavior-benchmarks/fixtures/fx-001-review-target",
  "invocation": {
    "kind": "command",
    "command": "deep/review"
  },
  "fixture": ".opencode/specs/deep-loops/033-deep-loop-behavior-benchmarks/fixtures/fx-001-review-target",
  "expected_interaction": "autonomous",
  "expected_presentation_markers": [
    "/review/i",
    "/iteration|dispatch/i"
  ],
  "expected_delegation": {
    "leaf_agent": "deep-review",
    "min_task_events": 1,
    "route_proof_required": false,
    "role_absorption_forbidden": true
  },
  "budget_ms": 1500000,
  "notes": "Happy-path anchor cell: a fully-specified single-iteration autonomous review run. Primary signal is unprompted LEAF dispatch.",
  "watchdog_ms": 480000
}
```

**Rationale.** Anchor happy-path cell. Every required input is pinned on the command line — target type, dimensions, a single iteration, a zero convergence floor, and an explicit spec folder — so nothing in the run depends on inference. The point is to isolate unprompted LEAF dispatch from any setup ambiguity.

**Pass shape.** Output names the review and shows an iteration/dispatch event; the deep-review leaf is dispatched with at least one task event; the run terminates naturally inside budget with the single-iteration artifacts present. Findings flow from the dispatched leaf, not from the orchestrator hand-rolling the review inline.

**Failure modes.** Inline review with zero task-dispatch evidence (role_absorption); routing the work to a different mode or agent (route_mismatch); or a stall killed by the no-progress watchdog (stuck_no_progress).
