# RVB-004 — Concise natural ask naming the target

```json
{
  "id": "RVB-004",
  "title": "Concise natural ask naming the target",
  "mode": "review",
  "entry_surface": "E3",
  "clarity": "C2",
  "prompt": "do a deep review of the folder .opencode/specs/deep-loops/033-deep-loop-behavior-benchmarks/fixtures/fx-001-review-target",
  "invocation": {
    "kind": "natural",
    "command": null
  },
  "fixture": ".opencode/specs/deep-loops/033-deep-loop-behavior-benchmarks/fixtures/fx-001-review-target",
  "expected_interaction": "question_halt",
  "expected_presentation_markers": [
    "/deep.?review|review/i",
    "/:auto|:confirm|execution mode|dimension/i"
  ],
  "expected_delegation": {
    "leaf_agent": null,
    "min_task_events": 0,
    "route_proof_required": false,
    "role_absorption_forbidden": false
  },
  "budget_ms": 600000,
  "notes": "Names the workflow and target but not the mode: correct routing surfaces the deep-review setup question rather than free-running or ignoring the deep flow."
}
```

**Rationale.** The ask names the deep-review workflow and the target folder but not the execution mode or dimensions. Routing should land on the deep-review setup question rather than free-running the loop or collapsing the ask into an ordinary review.

**Pass shape.** Output references deep-review/review and surfaces the execution-mode and dimension choice, then halts for the answer. The deep flow is recognized, not ignored.

**Failure modes.** Free-running a full review without confirming mode (setup_misbind); ignoring the deep flow and performing a plain inline review (role_absorption); or going silent after the ask (stuck_no_progress).
