# Delegation + route-proof under forced depth

```json
{
  "id": "RSB-007",
  "title": "Delegation + route-proof under forced depth",
  "mode": "research",
  "entry_surface": "E1",
  "clarity": "C3",
  "prompt": "Does .opencode/specs/deep-loops/033-deep-loop-behavior-benchmarks/fixtures/fx-002-research-target/spec.md specify Unicode handling for the slug utility, and does the implementation match? :auto --spec-folder=.opencode/specs/deep-loops/033-deep-loop-behavior-benchmarks/fixtures/fx-002-research-target --max-iterations=1 --convergence=0.0 --stop-policy=max-iterations",
  "invocation": {
    "kind": "command",
    "command": "deep/research"
  },
  "fixture": ".opencode/specs/deep-loops/033-deep-loop-behavior-benchmarks/fixtures/fx-002-research-target",
  "expected_interaction": "autonomous",
  "expected_presentation_markers": [
    "/research/i"
  ],
  "expected_delegation": {
    "leaf_agent": "deep-research",
    "min_task_events": 1,
    "route_proof_required": true,
    "role_absorption_forbidden": true
  },
  "budget_ms": 1500000,
  "watchdog_ms": 480000,
  "notes": "Strictest delegation cell: state JSONL must carry route-proof identity matching deep-research."
}
```

The strictest delegation cell in the package. Depth is forced via `--stop-policy=max-iterations`, and the contract demands not just a dispatch but verifiable route-proof identity — the state JSONL must name `deep-research`.

A pass runs autonomously with at least one task event to `deep-research`, the route-proof identity in the captured state matches the contract, and no role absorption occurs. The research marker surfaces in the visible output.

Failure modes are a missing or mismatched route-proof (`route_mismatch`), role absorption under the forced depth, or a watchdog kill if the single iteration stalls without writes.
