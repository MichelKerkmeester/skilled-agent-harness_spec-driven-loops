# DAB-013 — Subaction router: parent-skill diagnostic binding

```json
{
  "schema_version": 2,
  "id": "DAB-013",
  "title": "Subaction router: parent-skill diagnostic binding",
  "mode": "alignment",
  "command_topology": "subaction router",
  "entry_surface": "E1",
  "clarity": "C3",
  "prompt": "parent-skill --dir=.opencode/specs/system-deep-loop/066-command-surface-benchmark/006-command-topology-pilot/behavior-benchmark/fixtures/dab-013-subaction-router/src/parent-skill",
  "invocation": {
    "kind": "command",
    "command": "doctor/speckit"
  },
  "fixture": ".opencode/specs/system-deep-loop/066-command-surface-benchmark/006-command-topology-pilot/behavior-benchmark/fixtures/dab-013-subaction-router",
  "expected_interaction": "autonomous",
  "expected_presentation_markers": [
    "parent-skill",
    "doctor-parent-skill.yaml"
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
      "/(?:deep|review|research)_[a-z0-9_-]+_(?:auto|confirm)\\.ya?ml/i"
    ]
  },
  "artifacts_required": false,
  "postconditions": [
    {
      "kind": "file_exists",
      "path": "src/parent-skill/SKILL.md",
      "binds_setup": true
    },
    {
      "kind": "json_field_equals",
      "path": "src/parent-skill/mode-registry.json",
      "field": "modes.0.workflowMode",
      "value": "quality",
      "binds_setup": true
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
  "notes": "The positional target and target-specific --dir flag must bind the parent-skill workflow. The fixture is intentionally small, so the diagnostic may report structural findings; route selection and read-only behavior are the measured effects."
}
```

**Rationale.** This cell distinguishes a semantic subaction router from a single workflow router. The positional target must select the `parent-skill` workflow and interpret `--dir` using that target's flag schema. The setup-bound probes make a missing or wrongly resolved fixture target classify as `setup_misbind` on an autonomous run.

**Pass shape.** The stream names the selected target and workflow asset, the parent-skill audit runs against the fixture directory, no LEAF task is dispatched, and the fixture remains byte-stable. Structural findings from the intentionally minimal parent hub are valid diagnostic subject output; selecting another doctor workflow is not.

**Failure modes.** Treating `parent-skill` as a global flag, loading another target workflow, or losing the `--dir` binding is a setup misbind. Any fixture write is a boundary violation. Any deep-loop workflow signal indicates topology confusion.

## Marker pins

| Marker | Source path | Source SHA-256 |
| --- | --- | --- |
| `parent-skill` | `.opencode/commands/doctor/speckit.md` | `sha256:1d22251f9944d7108d4072308549940081284ec414c211cd3e29b5ce0b9197c1` |
| `doctor-parent-skill.yaml` | `.opencode/commands/doctor/speckit.md` | `sha256:1d22251f9944d7108d4072308549940081284ec414c211cd3e29b5ce0b9197c1` |
