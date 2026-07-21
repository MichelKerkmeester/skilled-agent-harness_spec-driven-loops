# Bare model benchmark requires setup

```json
{
  "id": "IMB-007",
  "title": "Bare model benchmark requires setup",
  "mode": "improvement",
  "entry_surface": "E2",
  "clarity": "C2",
  "prompt": ":auto",
  "invocation": { "kind": "command", "command": "deep/model-benchmark" },
  "fixture": ".opencode/specs/system-deep-loop/z_archive/027-deep-loop-behavior-benchmarks/fixtures/fx-004-improvement-target",
  "expected_interaction": "question_halt",
  "expected_presentation_markers": [ "/profile|model|run.?label|scor|grader/i" ],
  "expected_delegation": { "evidence_kind": "candidate_evidence", "leaf_agent": null, "min_task_events": 0, "route_proof_required": false, "role_absorption_forbidden": false, "min_seats": 0, "expected_targets": [], "forbidden_targets": [] },
  "budget_ms": 300000,
  "notes": "The dedicated model lane is fixed, but unresolved benchmark setup must be surfaced before dispatch."
}
```

The dedicated command fixes the model-benchmark lane but does not authorize an
unidentified run. A pass halts on the unresolved setup fields. Dispatching a
benchmark without a bound run is a setup misbind.

BASE: `fe6ca3030917073f3b478bc044e10034dcc4394b`.
