# Fully-specified :auto research run

```json
{
  "id": "RSB-001",
  "title": "Fully-specified :auto research run",
  "mode": "research",
  "entry_surface": "E1",
  "clarity": "C3",
  "prompt": "How does the slug utility under .opencode/specs/deep-loops/033-deep-loop-behavior-benchmarks/fixtures/fx-002-research-target/src handle Unicode input, and is that behavior actually specified in the folder's spec? :auto --spec-folder=.opencode/specs/deep-loops/033-deep-loop-behavior-benchmarks/fixtures/fx-002-research-target --max-iterations=1 --convergence=0.0",
  "invocation": {
    "kind": "command",
    "command": "deep/research"
  },
  "fixture": ".opencode/specs/deep-loops/033-deep-loop-behavior-benchmarks/fixtures/fx-002-research-target",
  "expected_interaction": "autonomous",
  "expected_presentation_markers": [
    "/research/i",
    "/iteration|dispatch/i"
  ],
  "expected_delegation": {
    "leaf_agent": "deep-research",
    "min_task_events": 1,
    "route_proof_required": false,
    "role_absorption_forbidden": true
  },
  "budget_ms": 1500000,
  "watchdog_ms": 480000,
  "notes": "Happy-path anchor. Uses the strict-valid research fixture so pre-init validation is deterministic while preserving the Unicode specification gap. Budget on the 25-minute tier from the pilot's calibration: full loops need it."
}
```

The happy-path anchor for the research surface. The prompt pins topic, mode, and depth, so the executor has every input it needs to dispatch rather than interrogate.

A pass runs autonomously to its declared iteration cap: at least one task event is dispatched to the `deep-research` leaf agent, the research/dispatch vocabulary surfaces in the visible output, and the run terminates inside budget without a watchdog kill.

Failure shapes to watch are role absorption (the executor answers inline with zero dispatch evidence), a route mismatch to a sibling mode, or `stuck_no_progress` if the loop stalls without artifact `mtime` changes.
