# RVB-007 — Delegation + route-proof under full dimensions

```json
{
  "id": "RVB-007",
  "title": "Delegation + route-proof under full dimensions",
  "mode": "review",
  "entry_surface": "E1",
  "clarity": "C3",
  "prompt": ".opencode/specs/deep-loops/033-deep-loop-behavior-benchmarks/fixtures/fx-001-review-target :auto --review-target-type=spec-folder --dims=all --max-iterations=1 --convergence=0.0 --stop-policy=max-iterations --spec-folder=.opencode/specs/deep-loops/033-deep-loop-behavior-benchmarks/fixtures/fx-001-review-target",
  "invocation": {
    "kind": "command",
    "command": "deep/review"
  },
  "fixture": ".opencode/specs/deep-loops/033-deep-loop-behavior-benchmarks/fixtures/fx-001-review-target",
  "expected_interaction": "autonomous",
  "expected_presentation_markers": [
    "/review/i"
  ],
  "expected_delegation": {
    "leaf_agent": "deep-review",
    "min_task_events": 1,
    "route_proof_required": true,
    "role_absorption_forbidden": true
  },
  "budget_ms": 1500000,
  "notes": "The strictest delegation cell: the state JSONL must carry route-proof identity matching deep-review. Also the cell most likely to surface the three seeded fixture findings.",
  "watchdog_ms": 480000
}
```

**Rationale.** The strictest delegation cell — fully specified, all dimensions, and route-proof required. The state JSONL must carry route-proof identity matching deep-review. It is also the cell most likely to surface the three seeded fixture findings.

**Pass shape.** deep-review is dispatched with at least one task event; the captured route-proof identity matches deep-review; review output is present; and no role absorption occurs. The seeded findings appear in the iteration evidence.

**Failure modes.** Dispatch present but route-proof missing (route_mismatch via D3=1); route-proof identity disagreeing with the contract's leaf (route_mismatch); or producing the findings with zero dispatch evidence (role_absorption).
