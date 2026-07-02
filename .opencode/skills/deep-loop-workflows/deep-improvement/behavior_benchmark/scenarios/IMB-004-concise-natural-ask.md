# Concise natural ask

```json
{
  "id": "IMB-004",
  "title": "Concise natural ask",
  "mode": "improvement",
  "entry_surface": "E3",
  "clarity": "C2",
  "prompt": "run your agent-improvement loop on the toy reviewer agent in .opencode/specs/deep-loops/033-deep-loop-behavior-benchmarks/fixtures/fx-004-improvement-target and score a candidate rewrite",
  "invocation": { "kind": "natural", "command": null },
  "fixture": ".opencode/specs/deep-loops/033-deep-loop-behavior-benchmarks/fixtures/fx-004-improvement-target",
  "expected_interaction": "autonomous",
  "expected_presentation_markers": [ "/candidate|score|dimension|improv/i" ],
  "expected_delegation": { "evidence_kind": "candidate_evidence", "leaf_agent": "deep-improvement", "role_absorption_forbidden": true },
  "budget_ms": 900000,
  "watchdog_ms": 480000,
  "artifacts_required": true,
  "notes": "Concise natural ask that explicitly names the improvement loop and a candidate. Absorption-forbidden: must persist a candidate + score, not just describe improvements."
}
```

A concise natural-language ask that explicitly names the agent-improvement loop
and a scored candidate. Because it names the action, absorption is forbidden —
the model must persist a candidate + evaluator score, not merely describe
improvements in prose.

A pass writes a packet-local candidate and its score. Prose-only improvement with
no persisted candidate is `role_absorption` in the improvement evidence shape.
