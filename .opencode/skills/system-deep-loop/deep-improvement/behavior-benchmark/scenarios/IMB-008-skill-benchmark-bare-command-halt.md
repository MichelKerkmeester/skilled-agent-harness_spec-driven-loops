# Bare skill benchmark requires setup

```json
{
  "id": "IMB-008",
  "title": "Bare skill benchmark requires setup",
  "mode": "improvement",
  "entry_surface": "E2",
  "clarity": "C2",
  "prompt": ":auto",
  "invocation": { "kind": "command", "command": "deep/skill-benchmark" },
  "fixture": ".opencode/specs/system-deep-loop/z_archive/027-deep-loop-behavior-benchmarks/fixtures/fx-004-improvement-target",
  "expected_interaction": "question_halt",
  "expected_presentation_markers": [ "/skill|output|fixture|trace|advisor/i" ],
  "expected_delegation": { "evidence_kind": "candidate_evidence", "leaf_agent": null, "min_task_events": 0, "route_proof_required": false, "role_absorption_forbidden": false, "min_seats": 0, "expected_targets": [], "forbidden_targets": [] },
  "budget_ms": 300000,
  "notes": "The diagnostic lane must bind its target skill and output directory before it dispatches."
}
```

The dedicated command fixes the skill-benchmark lane. A pass asks for the
target skill and output location before dispatch. Running against an inferred
skill or writing to an inferred destination is a setup misbind.

BASE: `fe6ca3030917073f3b478bc044e10034dcc4394b`.
