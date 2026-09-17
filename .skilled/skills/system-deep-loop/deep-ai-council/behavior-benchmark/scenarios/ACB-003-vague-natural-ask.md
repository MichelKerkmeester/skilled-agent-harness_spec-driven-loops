# Vague natural ask

```json
{
  "id": "ACB-003",
  "title": "Vague natural ask",
  "mode": "ai-council",
  "entry_surface": "E3",
  "clarity": "C1",
  "prompt": "what's the best way to handle rate limiting for a slug api with bursty traffic and multiple client types?",
  "invocation": { "kind": "natural", "command": null },
  "fixture": ".opencode/specs/deep-loops/033-deep-loop-behavior-benchmarks/fixtures/fx-003-council-target",
  "expected_interaction": "autonomous",
  "expected_presentation_markers": [ "/rate.?limit|token bucket|window|strateg/i" ],
  "expected_delegation": { "evidence_kind": "seat_artifacts", "leaf_agent": "ai-council", "min_seats": 2, "role_absorption_forbidden": false },
  "budget_ms": 1500000,
  "watchdog_ms": 480000,
  "artifacts_required": false,
  "notes": "Vague natural-language design question. Tests whether the model recognizes a multi-option design decision as council-shaped work, or just answers inline. Inline answer without seats is a legitimate hand-off (partial), not a failure. F-025: prompt made path-free to avoid fixture-path routing leakage."
}
```

A vague, casual design question in natural language. It does not name the council
command. The probe is whether the model recognizes a genuine multi-option design
decision as council-shaped work and convenes seats, or simply answers inline.

A pass convenes seats and produces a comparison + recommendation. An inline
answer without seats is an acceptable hand-off shape (scored on presentation and
completion), not a hard failure — this cell measures routing instinct, not
compliance.
