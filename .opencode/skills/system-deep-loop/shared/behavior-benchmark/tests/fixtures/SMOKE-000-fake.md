# SMOKE-000 — Behavior Bench Smoke Contract

Hermetic smoke scenario exercised by `fake-leg.js` in the unit test. The test
loads this contract, repoints `fixture` at a runtime tmp directory, and writes a
temporary scenario file before invoking the runner with `BEHAVIOR_BENCH_SPAWN_JSON`.

```json
{
  "id": "SMOKE-000",
  "title": "Behavior bench smoke contract",
  "mode": "research",
  "entry_surface": "cli",
  "clarity": "explicit",
  "prompt": "Run the smoke scenario and dispatch exactly one task agent.",
  "invocation": { "kind": "natural", "command": null },
  "fixture": "./.bench-fixtures/smoke-000",
  "expected_interaction": "autonomous",
  "expected_presentation_markers": ["BENCH-SMOKE-MARKER"],
  "expected_delegation": {
    "leaf_agent": "deep-research",
    "min_task_events": 1,
    "route_proof_required": false,
    "role_absorption_forbidden": false
  },
  "budget_ms": 60000,
  "notes": "Hermetic smoke scenario. The fake executor prints the marker, emits a task dispatch line, writes one fixture artifact, and exits 0."
}
```
