# DAB-012 — Workflow router: bounded deep-review dispatch

```json
{
  "schema_version": 2,
  "id": "DAB-012",
  "title": "Workflow router: bounded deep-review dispatch",
  "mode": "alignment",
  "command_topology": "workflow router",
  "entry_surface": "E1",
  "clarity": "C3",
  "prompt": ".opencode/specs/system-deep-loop/066-command-surface-benchmark/006-command-topology-pilot/behavior-benchmark/fixtures/dab-012-workflow-router :auto --review-target-type=spec-folder --dims=correctness --max-iterations=1 --convergence=0.0 --stop-policy=max-iterations --spec-folder=.opencode/specs/system-deep-loop/066-command-surface-benchmark/006-command-topology-pilot/behavior-benchmark/fixtures/dab-012-workflow-router",
  "invocation": {
    "kind": "command",
    "command": "deep/review"
  },
  "fixture": ".opencode/specs/system-deep-loop/066-command-surface-benchmark/006-command-topology-pilot/behavior-benchmark/fixtures/dab-012-workflow-router",
  "expected_interaction": "autonomous",
  "expected_presentation_markers": [
    "deep-review",
    "review-report.md"
  ],
  "expected_delegation": {
    "evidence_kind": "task_dispatch",
    "leaf_agent": "deep-review",
    "min_task_events": 1,
    "route_proof_required": true,
    "role_absorption_forbidden": true,
    "min_seats": 0,
    "expected_targets": [],
    "forbidden_targets": []
  },
  "artifacts_required": true,
  "postconditions": [
    {
      "kind": "file_exists",
      "path": "review/deep-review-state.jsonl"
    },
    {
      "kind": "file_exists",
      "path": "review/review-report.md"
    },
    {
      "kind": "changed_paths_within",
      "prefix": "review"
    }
  ],
  "boundary": {
    "allow_prefixes": [
      "review"
    ]
  },
  "budget_ms": 900000,
  "watchdog_ms": 480000,
  "notes": "A single forced iteration isolates the workflow-router handoff. The command must dispatch the deep-review leaf through the owned workflow and confine generated state to the review output directory."
}
```

**Rationale.** This cell isolates the workflow-router topology: the command binds a fully specified autonomous setup, hands substantive work to its owned workflow, and dispatches the named LEAF instead of reviewing inline. One forced iteration keeps later capture bounded while preserving route-proof and artifact evidence.

**Pass shape.** The visible stream contains both pinned markers, at least one structured task event targets `deep-review`, route proof matches that leaf, and the workflow writes its state log and final report only beneath `review/`.

**Failure modes.** Zero task events with a produced report is role absorption; a different route-proof identity is a route mismatch; missing review artifacts is a missing artifact; any changed path outside `review/` is a boundary violation.

## Marker pins

| Marker | Source path | Source SHA-256 |
| --- | --- | --- |
| `deep-review` | `.opencode/commands/deep/review.md` | `sha256:2c8049990e2208d377788addbbe0b8658dd78fa92997566c71a0e692cb76fd22` |
| `review-report.md` | `.opencode/commands/deep/review.md` | `sha256:2c8049990e2208d377788addbbe0b8658dd78fa92997566c71a0e692cb76fd22` |
