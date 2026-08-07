---
title: "Checklist: system-skill-advisor scripts"
description: "Blocking SOL acceptance contract for the non-Python script filename rename, regression dataset path closure, and Python exemption verification."
trigger_phrases:
  - "advisor scripts checklist"
  - "regression fixture rename checklist"
  - "script reference verification"
importance_tier: "critical"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/009-system-skill-advisor/002-scripts"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/009-system-skill-advisor/002-scripts"
    last_updated_at: "2026-07-14T18:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the scripts SOL verifier contract"
    next_safe_action: "Run the checklist centrally after the scripts phase executes"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/scripts"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "This authoring pass does not rename the dataset or run script tests."
---

# Checklist: system-skill-advisor scripts

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 002. Every item is checked against the candidate SHA,
BASE SHA, and rename-map hash. The report records commands, exit codes, JSONL counts, regression/holdout results, and
fails on zero tests or unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The full scripts inventory and Python exemption list are pinned to the candidate/BASE/map receipts
- [ ] CHK-002 [P0] All old dataset path hits in loaders, fixtures, docs, playbooks, and metadata are enumerated
- [ ] CHK-003 [P2] BASE JSONL record count and regression/holdout outputs are recorded
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-004 [P1] Changes are limited to non-Python script filenames and their path references
- [ ] CHK-005 [P0] skill_advisor.py, skill_advisor_bench.py, skill_advisor_regression.py, skill_advisor_runtime.py, and skill_graph_compiler.py remain unchanged as Python exemptions
- [ ] CHK-006 [P0] JSONL fields, Python imports, tool IDs, code identifiers, and frontmatter fields are unchanged
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-007 [P0] skill-advisor-regression-cases.jsonl exists and the old live dataset filename is absent
- [ ] CHK-008 [P0] Advisor validation, holdout builder, routing provenance, tests, manual playbook, references, and install docs resolve the new dataset path
- [ ] CHK-009 [P0] Python regression, routing-accuracy, holdout, and TypeScript validation checks pass with BASE-equivalent counts and schema
- [ ] CHK-010 [P1] Any retained old-name hit is classified as data content, identifier, generated metadata, or non-live history
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-011 [P0] Every non-Python script filename candidate has exactly one map disposition
- [ ] CHK-012 [P1] Dataset record count, provenance, and generated holdout lineage remain coherent
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-013 [P1] Dataset loading paths do not broaden roots or bypass existing validation/trust boundaries
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-014 [P1] Operator commands, references, and manual scenarios name the new dataset path while preserving Python examples
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-015 [P1] The asset rename and reference edits are dependency-closed and no stray implementation summary or scratch directory remains in this leaf
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase passes only when the dataset path closure, Python exemption proof, record/schema parity, and regression/holdout
checks are green with pinned evidence.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms that the dataset moved without semantic drift and all Python compatibility
consumers still resolve their original filenames.
<!-- /ANCHOR:sign-off -->
