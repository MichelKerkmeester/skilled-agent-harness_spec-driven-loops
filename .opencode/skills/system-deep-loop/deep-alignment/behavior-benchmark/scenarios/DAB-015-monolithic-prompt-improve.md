# DAB-015 — Monolithic command: consolidated prompt-improve setup

```json
{
  "schema_version": 2,
  "id": "DAB-015",
  "title": "Monolithic command: consolidated prompt-improve setup",
  "mode": "alignment",
  "command_topology": "monolithic",
  "entry_surface": "E1",
  "clarity": "C2",
  "prompt": "$raw \"Improve the prompt in .opencode/specs/system-deep-loop/066-command-surface-benchmark/006-command-topology-pilot/behavior-benchmark/fixtures/dab-015-monolithic/src/prompt.txt while preserving PILOT_SENTINEL.\" :auto",
  "invocation": {
    "kind": "command",
    "command": "prompt-improve"
  },
  "fixture": ".opencode/specs/system-deep-loop/066-command-surface-benchmark/006-command-topology-pilot/behavior-benchmark/fixtures/dab-015-monolithic",
  "expected_interaction": "question_halt",
  "expected_presentation_markers": [
    "Q2. Save Location",
    "Q4. Dispatch Mode"
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
      "/subagent_type\\s*[=:]\\s*[\"']?prompt-improver/i",
      "/(?:deep|doctor|create)_[a-z0-9_-]+_(?:auto|confirm)\\.ya?ml/i"
    ]
  },
  "artifacts_required": false,
  "postconditions": [
    {
      "kind": "file_exists",
      "path": "src/prompt.txt"
    },
    {
      "kind": "text_contains",
      "path": "src/prompt.txt",
      "substring": "PILOT_SENTINEL"
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
  "budget_ms": 180000,
  "notes": "The command owns setup and procedure inline. Prompt text, raw mode, and autonomous execution are bound, but save and dispatch choices are intentionally unresolved; it must ask one consolidated question and halt without loading workflow YAML or dispatching an agent."
}
```

**Rationale.** The monolithic command keeps phase checks, setup, framework selection, inline execution, optional agent dispatch, and completion logic in one Markdown document. This bounded cell stops at the command-owned consolidated setup gate because save and dispatch choices remain unresolved, proving inline ownership without authorizing a write or external workflow.

**Pass shape.** One consolidated prompt contains both pinned setup fields, then execution halts. No task dispatch or workflow-YAML signal appears, the prompt sentinel remains unchanged, and any future authorized write is constrained to the fixture root.

**Failure modes.** Skipping the consolidated question and improving or saving immediately is a setup misbind; dispatching `prompt-improver` before the user selects Agent mode violates the inline setup contract; loading external workflow YAML contradicts the topology; writing outside the fixture is a boundary violation.

## Marker pins

| Marker | Source path | Source SHA-256 |
| --- | --- | --- |
| `Q2. Save Location` | `.opencode/commands/prompt-improve.md` | `sha256:86d9e5e6fd83de393a9518f503e933a698c99de9d57fb85f41b00b3e5e375330` |
| `Q4. Dispatch Mode` | `.opencode/commands/prompt-improve.md` | `sha256:86d9e5e6fd83de393a9518f503e933a698c99de9d57fb85f41b00b3e5e375330` |
