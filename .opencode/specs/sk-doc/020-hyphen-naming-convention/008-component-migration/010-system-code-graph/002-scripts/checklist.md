---
title: "Checklist: system-code-graph scripts"
description: "Blocking SOL acceptance contract for the code-graph script filename inventory, conditional non-Python rename, reference closure, exemption proof, and verified no-op result."
trigger_phrases:
  - "system-code-graph scripts checklist"
  - "code graph script filename verification"
  - "script census checklist"
importance_tier: "critical"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/010-system-code-graph/002-scripts"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/010-system-code-graph/002-scripts"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored scripts SOL contract"
    next_safe_action: "Run the checklist centrally after script phase"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/scripts"
      - ".opencode/skills/system-code-graph/mcp_server/scripts"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "This authoring pass does not rename scripts or run script checks."
---

# Checklist: system-code-graph scripts

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 002. Every item is checked against the candidate SHA,
BASE SHA, and rename-map hash. The report records the complete script inventory, path dispositions, commands, exit
codes, syntax/behavior results, and fails on zero tests or unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Every script basename under scripts/ and mcp_server/scripts/ is pinned to candidate/BASE/map receipts
- [ ] CHK-002 [P0] Direct loaders, shell sources, registries, fixtures, tests, metadata, and docs are enumerated
- [ ] CHK-003 [P2] Python, tool, identifier, data-key, generated, and already-compliant dispositions are recorded
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-004 [P1] Changes are limited to non-Python script filenames and their live path references
- [ ] CHK-005 [P0] doctor.sh and score-seeded-ppr-retrieval.mjs remain kebab-case, or any conditional target is explicitly mapped
- [ ] CHK-006 [P0] Python filenames/imports, code identifiers, tool IDs, data keys, and frontmatter fields are unchanged
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-007 [P0] The script inventory reports zero unclassified in-scope snake_case filenames
- [ ] CHK-008 [P0] Any conditional target exists under its kebab-case name and the old live filename is absent
- [ ] CHK-009 [P0] Shell/Node syntax and all affected script consumers pass with BASE-equivalent behavior
- [ ] CHK-010 [P1] A zero-candidate result includes the complete inventory and old-name scan evidence
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-011 [P0] Every non-Python script filename has exactly one rename, exempt, generated, tool-mandated, or already-compliant disposition
- [ ] CHK-012 [P1] Every conditional script path consumer is represented in the map or old-name disposition ledger
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-013 [P1] Script roots, executable bits, command arguments, validation boundaries, and trust behavior are unchanged
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-014 [P1] Operator script examples and any affected references, tests, and registries expose live kebab-case paths
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-015 [P1] Any conditional rename is path-scoped and no stray implementation summary or scratch directory remains in this leaf
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase passes only when the complete script inventory is classified, all conditional path consumers resolve, syntax
and behavior match BASE, and a proven zero-rename result is accepted when the current tree is already clean.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms that script filenames and references satisfy the exemption-aware target,
including a complete no-op receipt if no non-Python candidate exists.
<!-- /ANCHOR:sign-off -->

