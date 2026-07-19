# DAB-025 — Direct-tool router: fixture-local continuity save

```json
{
  "schema_version": 2,
  "id": "DAB-025",
  "title": "Direct-tool router: fixture-local continuity save",
  "mode": "alignment",
  "command_topology": "direct-tool/plugin router",
  "entry_surface": "E1",
  "clarity": "C3",
  "prompt": ".opencode/specs/system-deep-loop/066-command-surface-benchmark/007-command-scenario-rollout/behavior-benchmark/fixtures/dab-025-memory-save-apply/src/save-packet --apply",
  "invocation": {
    "kind": "command",
    "command": "memory/save"
  },
  "fixture": ".opencode/specs/system-deep-loop/066-command-surface-benchmark/007-command-scenario-rollout/behavior-benchmark/fixtures/dab-025-memory-save-apply",
  "expected_interaction": "autonomous",
  "expected_presentation_markers": [
    "save plan",
    "memory_index_scan"
  ],
  "expected_delegation": {
    "evidence_kind": "direct_dispatch",
    "leaf_agent": null,
    "min_task_events": 0,
    "route_proof_required": false,
    "role_absorption_forbidden": true,
    "min_seats": 0,
    "expected_targets": [
      "mcp__mk_spec_memory__memory_index_scan",
      "mcp__mk_spec_memory__memory_save"
    ],
    "forbidden_targets": [
      "/\"(?:name|tool)\"\\s*:\\s*\"(?:Agent|Task|task)\"/i",
      "/\\.opencode\\/commands\\/(?:deep|doctor|create|design|speckit)\\/assets\\/[^\\s\"']+\\.ya?ml/i"
    ]
  },
  "artifacts_required": true,
  "postconditions": [
    {
      "kind": "file_exists",
      "path": "src/save-packet/implementation-summary.md"
    },
    {
      "kind": "text_contains",
      "path": "src/save-packet/implementation-summary.md",
      "substring": "MEMORY_SAVE_SENTINEL"
    },
    {
      "kind": "changed_paths_within",
      "prefix": "."
    }
  ],
  "boundary": {
    "allow_prefixes": ["."]
  },
  "budget_ms": 300000,
  "notes": "The explicit apply route may refresh only the fixture-local packet and its index visibility. It must emit a documented direct MCP target, preserve the canonical continuity sentinel, and never load a workflow or write outside the fixture."
}
```

**Rationale.** Unlike the read-only memory cells, this command is allowed to mutate a dedicated fixture packet. The topology remains direct dispatch: the command owns save planning and metadata handoff, then reaches the memory MCP without delegating command execution to a workflow.

**Pass shape.** At least one documented memory index/save target appears, both source-pinned presentation markers are present, the continuity sentinel survives, and every changed path remains under the fixture root.

**Failure modes.** Returning only an unexecuted plan despite explicit apply is a setup misbind; omitting every direct MCP target is role absorption; loading workflow YAML or dispatching an agent is a topology failure; any repository write outside the fixture is a boundary violation.

## Marker pins

| Marker | Source path | Source SHA-256 |
| --- | --- | --- |
| `save plan` | `.opencode/commands/memory/save.md` | `sha256:18f37fb2b789c2d45e3b9c7c164b439a1cb7f8f17f3a5c8d1c14a21b021a4b38` |
| `memory_index_scan` | `.opencode/commands/memory/save.md` | `sha256:18f37fb2b789c2d45e3b9c7c164b439a1cb7f8f17f3a5c8d1c14a21b021a4b38` |
