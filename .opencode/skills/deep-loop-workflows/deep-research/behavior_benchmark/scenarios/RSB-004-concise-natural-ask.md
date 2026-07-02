# Concise natural ask naming a researchable question

```json
{
  "id": "RSB-004",
  "title": "Concise natural ask naming a researchable question",
  "mode": "research",
  "entry_surface": "E3",
  "clarity": "C2",
  "prompt": "research how the slug utility in .opencode/specs/deep-loops/033-deep-loop-behavior-benchmarks/fixtures/fx-001-review-target handles edge cases",
  "invocation": {
    "kind": "natural",
    "command": null
  },
  "fixture": ".opencode/specs/deep-loops/033-deep-loop-behavior-benchmarks/fixtures/fx-001-review-target",
  "expected_interaction": "question_halt",
  "expected_presentation_markers": [
    "/research|deep/i",
    "/:auto|:confirm|execution mode|topic/i"
  ],
  "expected_delegation": {
    "leaf_agent": null,
    "min_task_events": 0,
    "route_proof_required": false,
    "role_absorption_forbidden": false
  },
  "budget_ms": 600000,
  "notes": "Names the workflow shape and target but not the mode: correct routing surfaces the deep-research setup question."
}
```

This ask names the workflow shape (research) and a scoped target but leaves the execution mode open. Correct routing recognizes the research intent and hands the unresolved decision back to the user.

A pass surfaces the deep-research setup question — covering execution mode and topic confirmation — then halts. The research/deep marker and the execution-mode marker must both appear.

The failure to watch is the executor resolving the mode itself and running (`setup_misbind`), or routing the ask to a non-research mode (`route_mismatch`).
