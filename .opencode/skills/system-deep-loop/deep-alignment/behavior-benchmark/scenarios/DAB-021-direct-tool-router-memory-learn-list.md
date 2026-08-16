# DAB-021 — Direct-tool router: constitutional-rule listing

```json
{
  "schema_version": 2,
  "id": "DAB-021",
  "title": "Direct-tool router: constitutional-rule listing",
  "mode": "alignment",
  "command_topology": "direct-tool/plugin router",
  "entry_surface": "E1",
  "clarity": "C3",
  "prompt": "list",
  "invocation": {
    "kind": "command",
    "command": "memory/learn"
  },
  "fixture": ".opencode/specs/system-deep-loop/035-command-surface-benchmark/007-command-scenario-rollout/behavior_benchmark/fixtures/dab-021-memory-learn-list",
  "expected_interaction": "autonomous",
  "expected_presentation_markers": [
    "STATUS=OK ACTION=",
    "listed"
  ],
  "expected_delegation": {
    "evidence_kind": "direct_dispatch",
    "leaf_agent": null,
    "min_task_events": 0,
    "route_proof_required": false,
    "role_absorption_forbidden": true,
    "min_seats": 0,
    "expected_targets": [
      "mcp__mk_spec_memory__memory_list"
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
      "substring": "MEMORY_LEARN_LIST_SENTINEL"
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
  "notes": "The command must dispatch the list request directly to the constitutional-rule listing tool, render the documented result envelope, avoid LEAF or workflow signals, and preserve the fixture sentinel."
}
```

**Rationale.** This cell distinguishes the `memory/learn` list route from workflow-owned command execution. The router should call the memory list tool directly and render the command-owned presentation contract without creating or editing a rule.

**Pass shape.** The captured stream names `mcp__mk_spec_memory__memory_list`, includes both pinned result markers, contains no forbidden dispatch or workflow target, and leaves the fixture unchanged.

**Failure modes.** Listing rules inline without the MCP target is role absorption; dispatching an agent or loading workflow YAML contradicts the topology; mutating the fixture or repository is a boundary violation.

## Marker pins

| Marker | Source path | Source SHA-256 |
| --- | --- | --- |
| `STATUS=OK ACTION=` | `.opencode/commands/memory/learn.md` | `sha256:930c9111acd7eeb2caff4e4192b6b5179402367b8afe71a11238ad6649c4c8c8` |
| `listed` | `.opencode/commands/memory/learn.md` | `sha256:930c9111acd7eeb2caff4e4192b6b5179402367b8afe71a11238ad6649c4c8c8` |
