# RVB-002 — Bare command must halt with ONE consolidated setup question

```json
{
  "id": "RVB-002",
  "title": "Bare command must halt with ONE consolidated setup question",
  "mode": "review",
  "entry_surface": "E2",
  "clarity": "C2",
  "prompt": ".opencode/specs/deep-loops/033-deep-loop-behavior-benchmarks/fixtures/fx-001-review-target",
  "invocation": {
    "kind": "command",
    "command": "deep/review"
  },
  "fixture": ".opencode/specs/deep-loops/033-deep-loop-behavior-benchmarks/fixtures/fx-001-review-target",
  "expected_interaction": "question_halt",
  "expected_presentation_markers": [
    "/execution mode|:auto|:confirm/i",
    "/dimension|target/i"
  ],
  "expected_delegation": {
    "leaf_agent": null,
    "min_task_events": 0,
    "route_proof_required": false,
    "role_absorption_forbidden": false
  },
  "budget_ms": 300000,
  "notes": "The presentation contract requires a single consolidated setup prompt then a stop. Running anyway is setup_misbind; silence is stuck."
}
```

**Rationale.** The bare command names the workflow and the target folder but nothing else — no execution mode, no dimensions. The presentation contract for a bare E2 surface is exactly one consolidated setup prompt covering the unresolved choices, followed by a halt.

**Pass shape.** A single consolidated question surfaces execution mode (`:auto`/`:confirm`) together with dimension/target selection, and the executor halts awaiting the answer. No dispatch occurs and no review artifacts are written.

**Failure modes.** Running the review anyway without resolving setup (setup_misbind); going silent after the command with no question (stuck_no_progress); or splitting the setup into a multi-turn interrogation when one consolidated prompt was required.
