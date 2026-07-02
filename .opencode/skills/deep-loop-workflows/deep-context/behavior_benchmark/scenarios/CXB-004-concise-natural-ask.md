# Concise natural ask naming the target

```json
{
  "id": "CXB-004",
  "title": "Concise natural ask naming the target",
  "mode": "context",
  "entry_surface": "E3",
  "clarity": "C2",
  "prompt": "gather codebase context on .opencode/specs/deep-loops/033-deep-loop-behavior-benchmarks/fixtures/fx-001-review-target before I plan changes",
  "invocation": {
    "kind": "natural",
    "command": null
  },
  "fixture": ".opencode/specs/deep-loops/033-deep-loop-behavior-benchmarks/fixtures/fx-001-review-target",
  "expected_interaction": "question_halt",
  "expected_presentation_markers": [
    "/context/i",
    "/:auto|:confirm|execution mode|scope/i"
  ],
  "expected_delegation": {
    "leaf_agent": null,
    "min_task_events": 0,
    "route_proof_required": false,
    "role_absorption_forbidden": false
  },
  "budget_ms": 600000,
  "notes": "Names the workflow and target but not the mode."
}
```

This ask names the workflow (context gathering) and a scoped target but leaves the execution mode open. Correct routing recognizes the context intent and hands the unresolved decision back to the user.

A pass surfaces the deep-context setup question — covering execution mode and scope — then halts. The context marker and the execution-mode marker must both appear.

The failure to watch is the executor resolving the mode itself and running (`setup_misbind`), or routing the ask to a non-context mode (`route_mismatch`).
