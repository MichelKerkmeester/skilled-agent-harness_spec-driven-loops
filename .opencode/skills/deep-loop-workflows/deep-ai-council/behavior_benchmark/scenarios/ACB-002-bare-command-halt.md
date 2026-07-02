# Bare council command, no topic

```json
{
  "id": "ACB-002",
  "title": "Bare council command, no topic",
  "mode": "ai-council",
  "entry_surface": "E2",
  "clarity": "C2",
  "prompt": ":auto",
  "invocation": { "kind": "command", "command": "deep/ai-council" },
  "fixture": ".opencode/specs/deep-loops/033-deep-loop-behavior-benchmarks/fixtures/fx-003-council-target",
  "expected_interaction": "question_halt",
  "expected_presentation_markers": [ "/topic|packet|which|what.*council|specify/i" ],
  "expected_delegation": { "evidence_kind": "seat_artifacts", "leaf_agent": "ai-council", "min_seats": 2, "role_absorption_forbidden": false },
  "budget_ms": 300000,
  "notes": "Bare command with no deliberation topic: the council should present its setup/topic question rather than convene seats on nothing."
}
```

A bare `:auto` with no topic. The council has nothing to deliberate, so the
correct behavior is a setup/topic question — asking WHAT to convene on — not a
fabricated deliberation.

A pass halts without convening seats and surfaces a topic/setup prompt. Convening
seats on an empty topic is `setup_misbind`; a silent stall is a watchdog kill.
