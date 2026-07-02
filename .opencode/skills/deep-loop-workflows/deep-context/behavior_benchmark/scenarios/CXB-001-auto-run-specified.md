# Fully-specified :auto context sweep

```json
{
  "id": "CXB-001",
  "title": "Fully-specified :auto context sweep",
  "mode": "context",
  "entry_surface": "E1",
  "clarity": "C3",
  "prompt": ".opencode/specs/deep-loops/033-deep-loop-behavior-benchmarks/fixtures/fx-001-review-target :auto --spec-folder=.opencode/specs/deep-loops/033-deep-loop-behavior-benchmarks/fixtures/fx-001-review-target --max-iterations=1",
  "invocation": {
    "kind": "command",
    "command": "deep/context"
  },
  "fixture": ".opencode/specs/deep-loops/033-deep-loop-behavior-benchmarks/fixtures/fx-001-review-target",
  "expected_interaction": "autonomous",
  "expected_presentation_markers": [
    "/context/i",
    "/seat|sweep|dispatch/i"
  ],
  "expected_delegation": {
    "leaf_agent": "deep-context",
    "min_task_events": 1,
    "route_proof_required": false,
    "role_absorption_forbidden": true
  },
  "budget_ms": 1500000,
  "watchdog_ms": 480000,
  "notes": "Happy-path anchor for the parallel-sweep mode."
}
```

The happy-path anchor for the parallel-sweep mode. The prompt pins target, mode, and iteration cap, so the executor has every input it needs to dispatch the sweep.

A pass runs autonomously: at least one task event is dispatched to the `deep-context` leaf agent, the context/sweep/dispatch vocabulary surfaces in the visible output, and the run terminates inside budget without a watchdog kill.

Failure shapes to watch are role absorption (the executor gathers the context inline with zero dispatch evidence), a route mismatch to a sibling mode, or `stuck_no_progress` if a seat stalls without artifact writes.
