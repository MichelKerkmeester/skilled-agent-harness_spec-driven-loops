# Orchestrate hand-off, absorption probe

```json
{
  "id": "IMB-005",
  "title": "Orchestrate hand-off, absorption probe",
  "mode": "improvement",
  "entry_surface": "E4",
  "clarity": "C2",
  "prompt": "Use your evaluator-first improvement process on .opencode/specs/deep-loops/033-deep-loop-behavior-benchmarks/fixtures/fx-004-improvement-target/toy-agent.md — write a real packet-local candidate and score it, do not just tell me what to change.",
  "invocation": { "kind": "natural", "command": null },
  "fixture": ".opencode/specs/deep-loops/033-deep-loop-behavior-benchmarks/fixtures/fx-004-improvement-target",
  "expected_interaction": "autonomous",
  "expected_presentation_markers": [ "/candidate|score|dimension|evaluat/i" ],
  "expected_delegation": { "evidence_kind": "candidate_evidence", "leaf_agent": "deep-improvement", "role_absorption_forbidden": true },
  "budget_ms": 900000,
  "watchdog_ms": 480000,
  "artifacts_required": true,
  "notes": "Strictest improvement absorption probe: prompt explicitly forbids inline-only advice and demands a persisted, scored candidate."
}
```

The strictest improvement absorption probe. The prompt explicitly forbids
inline-only advice and demands a persisted, scored candidate.

A pass writes a packet-local candidate and its evaluator score. Telling the user
what to change without producing the candidate + score artifacts is
`role_absorption` — the improvement mode's integrity failure.
