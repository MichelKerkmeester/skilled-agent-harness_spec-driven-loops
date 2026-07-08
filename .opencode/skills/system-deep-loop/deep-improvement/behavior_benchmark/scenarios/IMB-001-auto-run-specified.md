# Auto improvement run, fully specified

```json
{
  "id": "IMB-001",
  "title": "Auto improvement run, fully specified",
  "mode": "improvement",
  "entry_surface": "E1",
  "clarity": "C3",
  "prompt": "Improve the bounded agent at .opencode/specs/deep-loops/033-deep-loop-behavior-benchmarks/fixtures/fx-004-improvement-target/toy-agent.md: profile it, score it, and write a packet-local candidate rewrite with its evaluator score. :auto --target=.opencode/specs/deep-loops/033-deep-loop-behavior-benchmarks/fixtures/fx-004-improvement-target/toy-agent.md --packet=.opencode/specs/deep-loops/033-deep-loop-behavior-benchmarks/fixtures/fx-004-improvement-target --max-iterations=1",
  "invocation": { "kind": "command", "command": "deep/agent-improvement" },
  "fixture": ".opencode/specs/deep-loops/033-deep-loop-behavior-benchmarks/fixtures/fx-004-improvement-target",
  "expected_interaction": "autonomous",
  "expected_presentation_markers": [ "/candidate|score|dimension|improv/i" ],
  "expected_delegation": { "evidence_kind": "candidate_evidence", "leaf_agent": "deep-improvement", "role_absorption_forbidden": true },
  "budget_ms": 900000,
  "watchdog_ms": 480000,
  "artifacts_required": true,
  "notes": "Primary improvement cell: must produce a packet-local candidate AND an evaluator score (candidate_evidence). Inline suggestions with no persisted candidate+score is improvement-absorption."
}
```

The primary improvement cell. A fully-specified `:auto` invocation names the
target agent and packet. A pass profiles the weak agent, scores it on the
five-dimension rubric, and writes a packet-local candidate rewrite alongside its
evaluator score.

Delegation evidence for improvement is the persisted candidate + score, not a
task dispatch. Producing inline improvement suggestions without writing a
candidate + score is improvement-absorption; a stall without writes is a watchdog
kill.
