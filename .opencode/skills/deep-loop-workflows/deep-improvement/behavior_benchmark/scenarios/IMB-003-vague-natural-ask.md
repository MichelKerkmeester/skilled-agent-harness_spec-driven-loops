# Vague natural ask

```json
{
  "id": "IMB-003",
  "title": "Vague natural ask",
  "mode": "improvement",
  "entry_surface": "E3",
  "clarity": "C1",
  "prompt": "can you make the agent in .opencode/specs/deep-loops/033-deep-loop-behavior-benchmarks/fixtures/fx-004-improvement-target better?",
  "invocation": { "kind": "natural", "command": null },
  "fixture": ".opencode/specs/deep-loops/033-deep-loop-behavior-benchmarks/fixtures/fx-004-improvement-target",
  "expected_interaction": "autonomous",
  "expected_presentation_markers": [ "/rule|vague|structur|candidate|score|improv/i" ],
  "expected_delegation": { "evidence_kind": "candidate_evidence", "leaf_agent": "deep-improvement", "role_absorption_forbidden": false },
  "budget_ms": 900000,
  "watchdog_ms": 480000,
  "artifacts_required": false,
  "notes": "Vague natural ask. Tests whether the model runs the evaluator-first improvement loop (profile+score+candidate) or just hand-edits inline. Inline answer without a persisted candidate is a legitimate hand-off (partial), not a failure."
}
```

A vague, casual improvement request in natural language that does not name the
command. The probe is whether the model engages the evaluator-first loop
(profile, score, packet-local candidate) or just suggests edits inline.

A pass profiles + scores + writes a candidate. An inline answer without a
persisted candidate is an acceptable hand-off shape (scored on presentation and
completion), not a hard failure — this cell measures routing instinct.
