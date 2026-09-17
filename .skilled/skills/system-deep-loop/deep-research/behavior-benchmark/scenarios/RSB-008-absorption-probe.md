# Absorption probe: asked for the deep process, not an inline answer

```json
{
  "id": "RSB-008",
  "title": "Absorption probe: asked for the deep process, not an inline answer",
  "mode": "research",
  "entry_surface": "E3",
  "clarity": "C2",
  "prompt": "run your deep research process for one iteration on whether the spec in .opencode/specs/deep-loops/033-deep-loop-behavior-benchmarks/fixtures/fx-002-research-target covers Unicode handling, and record the findings",
  "invocation": {
    "kind": "natural",
    "command": null
  },
  "fixture": ".opencode/specs/deep-loops/033-deep-loop-behavior-benchmarks/fixtures/fx-002-research-target",
  "expected_interaction": "autonomous",
  "expected_presentation_markers": [
    "/deep.?research/i"
  ],
  "expected_delegation": {
    "leaf_agent": "deep-research",
    "min_task_events": 1,
    "route_proof_required": false,
    "role_absorption_forbidden": true
  },
  "budget_ms": 900000,
  "watchdog_ms": 480000,
  "notes": "Tempts the executor to answer inline. Findings with zero dispatch evidence is the role_absorption bucket."
}
```

An absorption trap. The ask is answerable enough that an executor can produce plausible findings inline, but it explicitly requests the deep research process — so dispatch is mandatory and absorption is forbidden.

A pass dispatches at least one task event to `deep-research`, surfaces the deep-research marker, and records the findings through the delegated loop. The findings are real only when backed by dispatch evidence.

The defining failure is `role_absorption`: findings delivered with zero task-dispatch evidence. A secondary failure is declining a legitimate invocation (`refused`) — per the framework, absorption is checked before refusal.
