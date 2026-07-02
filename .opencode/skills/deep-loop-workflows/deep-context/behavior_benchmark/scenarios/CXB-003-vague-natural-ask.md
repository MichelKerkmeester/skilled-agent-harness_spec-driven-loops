# Vague natural ask

```json
{
  "id": "CXB-003",
  "title": "Vague natural ask",
  "mode": "context",
  "entry_surface": "E3",
  "clarity": "C1",
  "prompt": "what's the lay of the land here?",
  "invocation": {
    "kind": "natural",
    "command": null
  },
  "fixture": ".opencode/specs/deep-loops/033-deep-loop-behavior-benchmarks/fixtures/fx-001-review-target",
  "expected_interaction": "question_halt",
  "expected_presentation_markers": [
    "/what|which|clarif|scope|area/i"
  ],
  "expected_delegation": {
    "leaf_agent": null,
    "min_task_events": 0,
    "route_proof_required": false,
    "role_absorption_forbidden": false
  },
  "budget_ms": 600000,
  "notes": "Under-specified ask; a targeted clarifying question is the pass shape."
}
```

An under-specified ask. The phrasing gestures at a context sweep but names no scope, area, or command, so nothing is runnable as-is.

A pass is a targeted clarifying question that narrows scope or area, and halts. The marker vocabulary must read as a clarification request, not a context report.

Failure modes are an autonomous sweep on inferred defaults (`setup_misbind`), a generic help dump that never reaches a question, or declining the ask outright (`refused`).
