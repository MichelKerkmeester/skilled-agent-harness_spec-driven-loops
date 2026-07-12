# DAB-001 — Fully-specified :auto run with --lane-config

```json
{
  "id": "DAB-001",
  "title": "Fully-specified :auto run with --lane-config",
  "mode": "alignment",
  "entry_surface": "E1",
  "clarity": "C3",
  "prompt": ".opencode/specs/system-deep-loop/059-deep-alignment-mode/behavior_benchmark/fixtures/fx_001_alignment_target :auto --lane-config .opencode/specs/system-deep-loop/059-deep-alignment-mode/behavior_benchmark/fixtures/fx_001_alignment_target/lane-config-skdoc.json --max-iterations=1 --convergence=1.0",
  "invocation": {
    "kind": "command",
    "command": "deep/alignment"
  },
  "fixture": ".opencode/specs/system-deep-loop/059-deep-alignment-mode/behavior_benchmark/fixtures/fx_001_alignment_target",
  "expected_interaction": "autonomous",
  "expected_presentation_markers": [
    "/align|conformance/i",
    "/lane|sk-doc/i"
  ],
  "expected_delegation": {
    "leaf_agent": "deep-alignment",
    "min_task_events": 1,
    "route_proof_required": false,
    "role_absorption_forbidden": true
  },
  "budget_ms": 900000,
  "notes": "Happy-path anchor cell. The --lane-config file pins the single lane (sk-doc / docs / paths[docs/]) so SCOPE has nothing to ask; the primary signal is unprompted LEAF dispatch, not scoping behavior. Config-file path is scripts/scoping.cjs parseLaneConfigFile().",
  "watchdog_ms": 480000
}
```

**Rationale.** Anchor happy-path cell. The lane is fully pinned by a `--lane-config` file — one lane, `sk-doc / docs / paths:["docs/"]` — so the non-interactive path (`scripts/scoping.cjs` `parseLaneConfigFile` / `resolveLanesFromConfig`) resolves it with no scoping question, and a single capped iteration removes convergence ambiguity. The point is to isolate unprompted LEAF dispatch from any scoping ambiguity.

**Pass shape.** Output names the alignment / conformance run and the resolved lane; the `deep-alignment` leaf is dispatched with at least one task event; the run terminates naturally inside budget with the single lane's `alignment/` artifacts present (`alignment-report.md`, `deep-alignment-findings-registry.json`). Findings flow from the dispatched leaf, not from the orchestrator hand-rolling the conformance check inline.

**Failure modes.** Inline conformance-check with zero task-dispatch evidence (role_absorption); re-asking the three-axis scoping question even though `--lane-config` already pinned the lanes (setup_misbind); routing the work to `deep-review` or another mode (route_mismatch); or a stall killed by the no-progress watchdog (stuck_no_progress).
