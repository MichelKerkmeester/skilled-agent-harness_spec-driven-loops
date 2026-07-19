# DAB-014 — Direct-tool router: bounded memory retrieval

```json
{
  "schema_version": 2,
  "id": "DAB-014",
  "title": "Direct-tool router: bounded memory retrieval",
  "mode": "alignment",
  "command_topology": "direct-tool/plugin router",
  "entry_surface": "E1",
  "clarity": "C3",
  "prompt": "command topology pilot --intent=find_spec",
  "invocation": {
    "kind": "command",
    "command": "memory/search"
  },
  "fixture": ".opencode/specs/system-deep-loop/066-command-surface-benchmark/006-command-topology-pilot/behavior-benchmark/fixtures/dab-014-direct-tool-router",
  "expected_interaction": "autonomous",
  "expected_presentation_markers": [
    "MEMORY:SEARCH",
    "STATUS=OK RESULTS="
  ],
  "expected_delegation": {
    "evidence_kind": "direct_dispatch",
    "leaf_agent": null,
    "min_task_events": 0,
    "route_proof_required": false,
    "role_absorption_forbidden": true,
    "min_seats": 0,
    "expected_targets": [
      "/mcp__mk_spec_memory__memory_(?:context|quick_search|search)/i"
    ],
    "forbidden_targets": [
      "/\"(?:name|tool)\"\\s*:\\s*\"(?:Agent|Task|task)\"/i",
      "/\\.opencode\\/commands\\/(?:deep|doctor|create)\\/assets\\/[^\\s\"']+\\.ya?ml/i"
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
      "substring": "command topology pilot"
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
  "notes": "The command must call a memory retrieval MCP tool directly, render the fixed result envelope, avoid every LEAF or workflow-YAML path, and leave the fixture's query sentinel unchanged."
}
```

**Rationale.** This cell measures the topology whose command owns routing but no workflow YAML. The expected target matcher accepts the command's preferred memory-context tool and its documented retrieval fallbacks, while the forbidden matchers reject structured subagent dispatch and workflow-asset loading.

**Pass shape.** At least one expected memory MCP identifier appears in the captured stream, no forbidden target appears, the output contains the fixed retrieval header and status footer, and the read-only fixture sentinel remains present with zero changed paths.

**Failure modes.** Performing retrieval inline without an expected tool target is role absorption; loading a workflow or dispatching a LEAF is a direct-dispatch failure; dropping the fixed presentation envelope lowers presentation fidelity; any fixture mutation is a boundary violation.

## Marker pins

| Marker | Source path | Source SHA-256 |
| --- | --- | --- |
| `MEMORY:SEARCH` | `.opencode/commands/memory/search.md` | `sha256:4d18a8b4d92691ecf256cad1a76763e011453e25c6f39d8640652a16462b6877` |
| `STATUS=OK RESULTS=` | `.opencode/commands/memory/search.md` | `sha256:4d18a8b4d92691ecf256cad1a76763e011453e25c6f39d8640652a16462b6877` |
