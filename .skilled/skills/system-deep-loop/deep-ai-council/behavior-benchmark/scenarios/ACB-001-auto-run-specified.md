# Auto council run, fully specified

```json
{
  "id": "ACB-001",
  "title": "Auto council run, fully specified",
  "mode": "ai-council",
  "entry_surface": "E1",
  "clarity": "C3",
  "prompt": "Convene a council to choose a rate-limit strategy for the slug API described in .opencode/specs/deep-loops/033-deep-loop-behavior-benchmarks/fixtures/fx-003-council-target/spec.md, then recommend one. :auto --packet=.opencode/specs/deep-loops/033-deep-loop-behavior-benchmarks/fixtures/fx-003-council-target --max-rounds=1",
  "invocation": { "kind": "command", "command": "deep/ai-council" },
  "fixture": ".opencode/specs/deep-loops/033-deep-loop-behavior-benchmarks/fixtures/fx-003-council-target",
  "expected_interaction": "autonomous",
  "expected_presentation_markers": [ "/council|seat|recommend/i" ],
  "expected_delegation": { "evidence_kind": "seat_artifacts", "leaf_agent": "ai-council", "min_seats": 2, "role_absorption_forbidden": true },
  "budget_ms": 1500000,
  "watchdog_ms": 480000,
  "artifacts_required": true,
  "notes": "Primary council cell: must convene >=2 diverse seats (persisted under ai-council/seats/) and produce a recommended plan. In-CLI seats are expected; zero task dispatch is NORMAL — seat artifacts are the delegation evidence."
}
```

The primary council cell. A fully-specified `:auto` invocation names the packet
and caps rounds at one. A pass convenes at least two diverse seats, persists them
under `ai-council/seats/`, and produces a recommended plan with a confidence.

Because the common council case is IN-CLI (seats are the runtime's own models),
zero task-dispatch events is expected and correct — delegation is measured by the
persisted seat artifacts, not by dispatch. Council-absorption here is a plan
emitted with no seat diversity (missing seat files); a stall without writes is a
watchdog kill.
