# DAB-024 — Direct-tool router: checkpoint listing

```json
{
  "schema_version": 2,
  "id": "DAB-024",
  "title": "Direct-tool router: checkpoint listing",
  "mode": "alignment",
  "command_topology": "direct-tool/plugin router",
  "entry_surface": "E1",
  "clarity": "C3",
  "prompt": "checkpoint list",
  "invocation": {
    "kind": "command",
    "command": "memory/manage"
  },
  "fixture": ".opencode/specs/system-deep-loop/066-command-surface-benchmark/007-command-scenario-rollout/behavior-benchmark/fixtures/dab-024-memory-checkpoint-list",
  "expected_interaction": "autonomous",
  "expected_presentation_markers": [
    "checkpoint_list",
    "checkpoint"
  ],
  "expected_delegation": {
    "evidence_kind": "direct_dispatch",
    "leaf_agent": null,
    "min_task_events": 0,
    "route_proof_required": false,
    "role_absorption_forbidden": true,
    "min_seats": 0,
    "expected_targets": [
      "mcp__mk_spec_memory__checkpoint_list"
    ],
    "forbidden_targets": [
      "/\"(?:name|tool)\"\\s*:\\s*\"(?:Agent|Task|task)\"/i",
      "/\\.opencode\\/commands\\/(?:deep|doctor|create|design|speckit)\\/assets\\/[^\\s\"']+\\.ya?ml/i"
    ]
  },
  "artifacts_required": false,
  "postconditions": [
    {
      "kind": "file_exists",
      "path": "src/query.txt"
    },
    {
      "kind": "text_contains",
      "path": "src/query.txt",
      "substring": "MEMORY_CHECKPOINT_LIST_SENTINEL"
    },
    {
      "kind": "changed_paths_within",
      "prefix": "."
    }
  ],
  "boundary": {
    "allow_prefixes": ["."]
  },
  "budget_ms": 180000,
  "notes": "The command must dispatch checkpoint listing directly to checkpoint_list without a confirmation gate, avoid LEAF or workflow signals, and preserve the fixture sentinel."
}
```

**Rationale.** This cell samples the nested positional grammar of `memory/manage` without turning it into a subaction-router topology. The command still dispatches directly to its MCP tool; `checkpoint list` selects which tool receives the request.

**Pass shape.** The captured stream names `mcp__mk_spec_memory__checkpoint_list`, includes the pinned checkpoint markers, excludes forbidden targets, and records no fixture mutation.

**Failure modes.** Treating `checkpoint` as an external workflow or agent route is a topology mismatch; calling a mutating checkpoint operation is a setup misbind; any write escape is a boundary violation.

## Marker pins

| Marker | Source path | Source SHA-256 |
| --- | --- | --- |
| `checkpoint_list` | `.opencode/commands/memory/manage.md` | `sha256:8b335eb82985f64eaf35b7693c93157d2dfb0cda4ff4874f197df03aaba6906e` |
| `checkpoint` | `.opencode/commands/memory/manage.md` | `sha256:8b335eb82985f64eaf35b7693c93157d2dfb0cda4ff4874f197df03aaba6906e` |
