# DAB-017 — Workflow router: bounded design audit

```json
{
  "schema_version": 2,
  "id": "DAB-017",
  "title": "Workflow router: bounded design audit",
  "mode": "alignment",
  "command_topology": "workflow router",
  "entry_surface": "E1",
  "clarity": "C3",
  "prompt": ".opencode/specs/system-deep-loop/066-command-surface-benchmark/007-command-scenario-rollout/behavior_benchmark/fixtures/dab-017-design-audit/src/interface.html --scope accessibility,responsive --score --register product :auto",
  "invocation": {
    "kind": "command",
    "command": "design/audit"
  },
  "fixture": ".opencode/specs/system-deep-loop/066-command-surface-benchmark/007-command-scenario-rollout/behavior_benchmark/fixtures/dab-017-design-audit",
  "expected_interaction": "autonomous",
  "expected_presentation_markers": [
    "design_audit_auto.yaml",
    "Design Quality Audit Report"
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
      ".opencode/commands/create/assets/",
      ".opencode/commands/speckit/assets/"
    ]
  },
  "artifacts_required": false,
  "postconditions": [
    {
      "kind": "file_exists",
      "path": "src/interface.html",
      "binds_setup": true
    },
    {
      "kind": "text_contains",
      "path": "src/interface.html",
      "substring": "DESIGN_AUDIT_SENTINEL"
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
  "notes": "The design router must pin audit mode, select the auto workflow, inspect the fixture-local interface, return its report inline, and preserve every fixture input."
}
```

**Rationale.** This cell samples the design family without requiring browser state or a generated artifact. A fully specified local target makes the skill-mode handoff observable while keeping the run bounded and read-only.

**Pass shape.** Both pinned markers appear, the audit addresses the supplied accessibility and responsive scope, no create or speckit workflow loads, and the interface sentinel remains unchanged.

**Failure modes.** Deferring to a sibling design mode is a route mismatch; asking for the supplied target or register is a setup misbind; editing the interface or any other fixture path is a boundary violation.

## Marker pins

| Marker | Source path | Source SHA-256 |
| --- | --- | --- |
| `design_audit_auto.yaml` | `.opencode/commands/design/audit.md` | `sha256:04d508fc931e0e075bc1567ad89cc96d0613a935c24c072f78809229aed7752c` |
| `Design Quality Audit Report` | `.opencode/commands/design/audit.md` | `sha256:04d508fc931e0e075bc1567ad89cc96d0613a935c24c072f78809229aed7752c` |
