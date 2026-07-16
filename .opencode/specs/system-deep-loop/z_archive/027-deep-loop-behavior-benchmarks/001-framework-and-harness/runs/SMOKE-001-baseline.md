# SMOKE-001 — Baseline-leg harness smoke

```json
{
  "id": "SMOKE-001",
  "title": "Baseline-leg harness smoke",
  "mode": "review",
  "entry_surface": "E3",
  "clarity": "C3",
  "prompt": "Reply with exactly the single word BENCH_OK and nothing else. Do not use any tools.",
  "invocation": { "kind": "natural", "command": null },
  "fixture": ".opencode/specs/deep-loops/033-deep-loop-behavior-benchmarks/fixtures/fx-001-review-target",
  "expected_interaction": "autonomous",
  "expected_presentation_markers": ["BENCH_OK"],
  "expected_delegation": { "leaf_agent": null, "min_task_events": 0, "route_proof_required": false, "role_absorption_forbidden": false },
  "budget_ms": 180000,
  "notes": "Phase-001 exit-gate smoke: proves spawn, checkpoint extraction, scoring, and result emission on the resolved baseline executor. No delegation expected."
}
```

Exit-gate smoke only; not part of any per-skill package.
