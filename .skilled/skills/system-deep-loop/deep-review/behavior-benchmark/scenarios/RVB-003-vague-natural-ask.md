# RVB-003 — Vague natural ask with no target

```json
{
  "id": "RVB-003",
  "title": "Vague natural ask with no target",
  "mode": "review",
  "entry_surface": "E3",
  "clarity": "C1",
  "prompt": "can you review this?",
  "invocation": {
    "kind": "natural",
    "command": null
  },
  "fixture": ".opencode/specs/deep-loops/033-deep-loop-behavior-benchmarks/fixtures/fx-001-review-target",
  "expected_interaction": "question_halt",
  "expected_presentation_markers": [
    "/what|which|clarif|target|point me/i"
  ],
  "expected_delegation": {
    "leaf_agent": null,
    "min_task_events": 0,
    "route_proof_required": false,
    "role_absorption_forbidden": false
  },
  "budget_ms": 600000,
  "notes": "Most-realistic cell: an under-specified user ask. Correct behavior is a targeted clarifying question, not a guessed target and not a generic essay."
}
```

**Rationale.** The most realistic cell — a natural-language ask that names no command, no target, and no scope beyond "review this." With nothing resolvable, the correct behavior is a targeted clarifying question that pins down the target, never a guess.

**Pass shape.** Output asks what or which target to point at, or otherwise requests clarification, then halts. No guessed target is written and no review is started.

**Failure modes.** Picking an arbitrary nearby directory as the target and running (setup_misbind); answering with a generic essay about how review works instead of asking (refused / stuck_no_progress); or hanging with no output at all (stuck_no_progress).
