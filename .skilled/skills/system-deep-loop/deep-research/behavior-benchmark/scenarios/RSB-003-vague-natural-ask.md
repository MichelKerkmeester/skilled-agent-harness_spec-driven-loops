# Vague natural ask with no topic

```json
{
  "id": "RSB-003",
  "title": "Vague natural ask with no topic",
  "mode": "research",
  "entry_surface": "E3",
  "clarity": "C1",
  "prompt": "can you look into this for me?",
  "invocation": {
    "kind": "natural",
    "command": null
  },
  "fixture": ".opencode/specs/deep-loops/033-deep-loop-behavior-benchmarks/fixtures/fx-001-review-target",
  "expected_interaction": "question_halt",
  "expected_presentation_markers": [
    "/what|which|clarif|topic|more detail/i"
  ],
  "expected_delegation": {
    "leaf_agent": null,
    "min_task_events": 0,
    "route_proof_required": false,
    "role_absorption_forbidden": false
  },
  "budget_ms": 600000,
  "notes": "Most-realistic cell: under-specified ask; correct behavior is a targeted clarifying question."
}
```

The most-realistic cell in the matrix. The ask carries no topic, no target, and no command, so nothing is runnable as-is.

A pass is a targeted clarifying question that names what is missing — the research subject — and halts. The marker vocabulary must read as a clarification request, not a research answer.

Failure modes are autonomous launch on inferred defaults (`setup_misbind`), a generic help dump that never reaches a question, or declining the ask outright (`refused`).
