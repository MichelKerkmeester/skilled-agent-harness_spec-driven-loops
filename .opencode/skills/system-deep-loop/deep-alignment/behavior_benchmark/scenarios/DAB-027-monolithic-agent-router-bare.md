# DAB-027 — Monolithic command: bare agent-router halt

```json
{
  "schema_version": 2,
  "id": "DAB-027",
  "title": "Monolithic command: bare agent-router halt",
  "mode": "alignment",
  "command_topology": "monolithic",
  "entry_surface": "E2",
  "clarity": "C1",
  "prompt": "",
  "invocation": {
    "kind": "command",
    "command": "agent_router"
  },
  "fixture": ".opencode/specs/system-deep-loop/066-command-surface-benchmark/007-command-scenario-rollout/behavior_benchmark/fixtures/dab-027-agent-router-bare",
  "expected_interaction": "question_halt",
  "expected_presentation_markers": [
    "What request would you like to route?",
    "Describe my request"
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
      "/subagent_type\\s*[=:]/i",
      "/(?:deep|doctor|create|design|speckit)_[a-z0-9_-]+_(?:auto|confirm)\\.ya?ml/i"
    ]
  },
  "artifacts_required": false,
  "postconditions": [
    {
      "kind": "file_exists",
      "path": "src/request.txt"
    },
    {
      "kind": "text_contains",
      "path": "src/request.txt",
      "substring": "AGENT_ROUTER_BARE_SENTINEL"
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
  "notes": "With no request text, the monolithic router must ask its command-owned clarification question and halt inline. It must not load workflow YAML, dispatch an agent, or mutate the fixture."
}
```

**Rationale.** `agent_router` owns request validation, scoring, selection, dispatch, and fallback inline. An empty invocation exercises its earliest command-owned gate and proves that no external workflow is needed to ask for the missing request.

**Pass shape.** One prompt contains both pinned question markers, then the command halts without dispatching a task or loading workflow YAML. The request sentinel and fixture remain unchanged.

**Failure modes.** Guessing a request or selecting an agent is a setup misbind; emitting a task dispatch before request text exists violates the halt contract; loading workflow YAML contradicts the monolithic topology; any write is a boundary violation.

## Marker pins

| Marker | Source path | Source SHA-256 |
| --- | --- | --- |
| `What request would you like to route?` | `.opencode/commands/agent_router.md` | `sha256:c117fbfa1f21b11665ae9501df5d92467d27062f3ed0dee2e90e6080bc639dc1` |
| `Describe my request` | `.opencode/commands/agent_router.md` | `sha256:c117fbfa1f21b11665ae9501df5d92467d27062f3ed0dee2e90e6080bc639dc1` |
