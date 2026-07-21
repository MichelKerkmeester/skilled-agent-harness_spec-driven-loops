# Improvement parent requires a lane

```json
{
  "id": "IMB-006",
  "title": "Improvement parent requires a lane",
  "mode": "improvement",
  "entry_surface": "E3",
  "clarity": "C1",
  "prompt": "Run deep-improvement on this project.",
  "invocation": { "kind": "natural", "command": null },
  "fixture": ".opencode/specs/system-deep-loop/z_archive/027-deep-loop-behavior-benchmarks/fixtures/fx-004-improvement-target",
  "expected_interaction": "question_halt",
  "expected_presentation_markers": [ "/lane|agent|model|skill|target|profile/i" ],
  "expected_delegation": { "evidence_kind": "candidate_evidence", "leaf_agent": null, "min_task_events": 0, "route_proof_required": false, "role_absorption_forbidden": false, "min_seats": 0, "expected_targets": [], "forbidden_targets": [] },
  "budget_ms": 300000,
  "notes": "The common parent owns lane selection; it must not silently bind agent, model, or skill improvement."
}
```

The common improvement parent covers three registered modes. A request that
selects the parent but names no lane must halt on one consolidated lane/setup
question. Starting any lane is a setup misbind.

BASE: `fe6ca3030917073f3b478bc044e10034dcc4394b`.
