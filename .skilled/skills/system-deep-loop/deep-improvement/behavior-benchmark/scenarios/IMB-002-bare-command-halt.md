# Bare improvement command, no target

```json
{
  "id": "IMB-002",
  "title": "Bare improvement command, no target",
  "mode": "improvement",
  "entry_surface": "E2",
  "clarity": "C2",
  "prompt": ":auto",
  "invocation": { "kind": "command", "command": "deep/agent-improvement" },
  "fixture": ".opencode/specs/deep-loops/033-deep-loop-behavior-benchmarks/fixtures/fx-004-improvement-target",
  "expected_interaction": "question_halt",
  "expected_presentation_markers": [ "/target|which agent|path|specify|what.*improve/i" ],
  "expected_delegation": { "evidence_kind": "candidate_evidence", "leaf_agent": "deep-improvement", "role_absorption_forbidden": false },
  "budget_ms": 300000,
  "notes": "Bare command with no target: the workflow should present its target/setup question rather than improve nothing."
}
```

A bare `:auto` with no target agent. With nothing to improve, the correct
behavior is a target/setup question — asking WHICH agent to improve — not a
fabricated candidate.

A pass halts and surfaces a target prompt. Producing a candidate against an
unspecified target is `setup_misbind`; a silent stall is a watchdog kill.
