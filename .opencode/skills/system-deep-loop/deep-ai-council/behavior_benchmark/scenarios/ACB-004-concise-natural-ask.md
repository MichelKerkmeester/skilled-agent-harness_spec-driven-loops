# Concise natural ask

```json
{
  "id": "ACB-004",
  "title": "Concise natural ask",
  "mode": "ai-council",
  "entry_surface": "E3",
  "clarity": "C2",
  "prompt": "convene a council on the rate-limit design question in .opencode/specs/deep-loops/033-deep-loop-behavior-benchmarks/fixtures/fx-003-council-target/spec.md and recommend an approach",
  "invocation": { "kind": "natural", "command": null },
  "fixture": ".opencode/specs/deep-loops/033-deep-loop-behavior-benchmarks/fixtures/fx-003-council-target",
  "expected_interaction": "autonomous",
  "expected_presentation_markers": [ "/council|seat|recommend/i" ],
  "expected_delegation": { "evidence_kind": "seat_artifacts", "leaf_agent": "ai-council", "min_seats": 2, "role_absorption_forbidden": true },
  "budget_ms": 1500000,
  "watchdog_ms": 480000,
  "artifacts_required": true,
  "notes": "Concise natural ask that explicitly says 'convene a council'. Absorption-forbidden: the model must actually convene seats, not single-handedly plan."
}
```

A concise natural-language ask that explicitly requests a council. Because it
names the council action, absorption is forbidden — the model must convene at
least two seats, not plan solo and present the result as a council.

A pass persists >=2 seats and a recommendation. A solo plan dressed as a council
(no seat artifacts) is `role_absorption`.
