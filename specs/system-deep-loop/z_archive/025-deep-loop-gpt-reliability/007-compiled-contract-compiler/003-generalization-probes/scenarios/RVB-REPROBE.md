# RVB re-probe — Delegation + route-proof (leaf-reliability check)

```json
{
  "id": "RVB-REPROBE",
  "title": "Delegation + route-proof re-probe (leaf-reliability check)",
  "mode": "review",
  "entry_surface": "E1",
  "clarity": "C3",
  "prompt": ".opencode/specs/system-deep-loop/033-deep-loop-behavior-benchmarks/fixtures/fx-001-review-target :auto --review-target-type=spec-folder --dims=all --max-iterations=1 --convergence=0.0 --stop-policy=max-iterations --spec-folder=.opencode/specs/system-deep-loop/033-deep-loop-behavior-benchmarks/fixtures/fx-001-review-target",
  "invocation": {
    "kind": "command",
    "command": "deep/review"
  },
  "fixture": ".opencode/specs/system-deep-loop/033-deep-loop-behavior-benchmarks/fixtures/fx-001-review-target",
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
  "watchdog_ms": 480000,
  "notes": "Re-probe of RVB-007, the strictest delegation cell: the state JSONL must carry route-proof identity matching deep-review. Expectations mirror RVB-007 exactly. Run under deep/review=fix at --samples 2 to test whether the fix-mode leaf-reliability check lifts the pass rate over the gpt-fast-med baseline (RVB-007 refused with zero task events)."
}
```

**Basis.** A faithful re-probe of the 033 review cell RVB-007
(`.opencode/skills/deep-loop-workflows/deep-review/behavior_benchmark/scenarios/RVB-007-delegation-route-proof.md`)
— the strictest delegation cell, fully specified, all dimensions, and
route-proof required. The `id` is renamed to `RVB-REPROBE` only so its output
files land distinctly; the prompt, fixture, `expected_delegation`, `budget_ms`,
and `watchdog_ms` are copied verbatim. No expectations were invented.

**Why re-probe.** At `gpt-fast-med` the source cell scored `refused` with zero
task events (no LEAF dispatch). This cell is run `fix`-only to check whether the
fix-mode contract's leaf-reliability check lifts the pass rate.

**Pass shape.** deep-review is dispatched with at least one task event; the
captured route-proof identity matches deep-review; review output is present; and
no role absorption occurs. The seeded fixture findings appear in the iteration
evidence.

**Failure modes.** Dispatch present but route-proof missing (route_mismatch via
D3=1); route-proof identity disagreeing with the contract's leaf
(route_mismatch); or producing findings with zero dispatch evidence
(role_absorption).
