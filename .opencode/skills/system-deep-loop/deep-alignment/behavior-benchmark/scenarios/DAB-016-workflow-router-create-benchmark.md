# DAB-016 — Workflow router: fixture-local benchmark authoring

```json
{
  "schema_version": 2,
  "id": "DAB-016",
  "title": "Workflow router: fixture-local benchmark authoring",
  "mode": "alignment",
  "command_topology": "workflow router",
  "entry_surface": "E1",
  "clarity": "C3",
  "prompt": ".opencode/specs/system-deep-loop/066-command-surface-benchmark/007-command-scenario-rollout/behavior-benchmark/fixtures/dab-016-create-benchmark/src/demo-mode .opencode/specs/system-deep-loop/066-command-surface-benchmark/007-command-scenario-rollout/behavior-benchmark/fixtures/dab-016-create-benchmark create --family=conformance_benchmark --benchmark-id fixture-command-surface --path .opencode/specs/system-deep-loop/066-command-surface-benchmark/007-command-scenario-rollout/behavior-benchmark/fixtures/dab-016-create-benchmark/src/demo-mode/assets/conformance-benchmark/fixture-command-surface :auto",
  "invocation": {
    "kind": "command",
    "command": "create/benchmark"
  },
  "fixture": ".opencode/specs/system-deep-loop/066-command-surface-benchmark/007-command-scenario-rollout/behavior-benchmark/fixtures/dab-016-create-benchmark",
  "expected_interaction": "autonomous",
  "expected_presentation_markers": [
    "create-benchmark-auto.yaml",
    "conformance_benchmark"
  ],
  "expected_delegation": {
    "evidence_kind": "task_dispatch",
    "leaf_agent": null,
    "min_task_events": 0,
    "route_proof_required": false,
    "role_absorption_forbidden": false,
    "min_seats": 0,
    "expected_targets": [],
    "forbidden_targets": [
      ".opencode/commands/deep/assets/",
      ".opencode/commands/doctor/assets/"
    ]
  },
  "artifacts_required": true,
  "postconditions": [
    {
      "kind": "file_exists",
      "path": "src/demo-mode/SKILL.md",
      "binds_setup": true
    },
    {
      "kind": "file_exists",
      "path": "src/demo-mode/assets/conformance-benchmark/fixture-command-surface/conformance-benchmark.md"
    },
    {
      "kind": "changed_paths_within",
      "prefix": "."
    }
  ],
  "boundary": {
    "allow_prefixes": [
      "."
    ]
  },
  "budget_ms": 300000,
  "notes": "The fully bound create command must select the conformance-benchmark family and auto workflow, author only the fixture-local input package, validate it, and terminate before any adapter or alignment execution."
}
```

**Rationale.** This cell extends workflow-router coverage into the create family. The router binds family, operation, target, and execution mode before the owned YAML performs the substantive authoring work.

**Pass shape.** The stream exposes both pinned routing markers, no unrelated deep or doctor workflow asset appears, the nested mode remains the bound target, and the conformance contract is created without any write escaping the fixture root.

**Failure modes.** Asking for already bound setup is a setup misbind; loading an unrelated workflow is topology confusion; omitting the contract is a missing artifact; any changed path outside the fixture is a boundary violation.

## Marker pins

| Marker | Source path | Source SHA-256 |
| --- | --- | --- |
| `create-benchmark-auto.yaml` | `.opencode/commands/create/benchmark.md` | `sha256:93e50ef0b8b57706d12e4fd575f8e00e8b31755a4228655c5b1d0ed4ca9453bd` |
| `conformance-benchmark` | `.opencode/commands/create/benchmark.md` | `sha256:93e50ef0b8b57706d12e4fd575f8e00e8b31755a4228655c5b1d0ed4ca9453bd` |
