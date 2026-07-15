---
title: "Checklist: system-code-graph references"
description: "Blocking SOL acceptance contract for the seven reference-file rename, link and path-pointer closure, asset/template classification, and content parity."
trigger_phrases:
  - "system-code-graph references checklist"
  - "code graph reference link verification"
  - "reference filename checklist"
importance_tier: "critical"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/010-system-code-graph/003-references"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/010-system-code-graph/003-references"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored references SOL contract"
    next_safe_action: "Run the checklist centrally after reference phase"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/references"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "This authoring pass does not rename reference files or run link checks."
---

# Checklist: system-code-graph references

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 003. Every item is checked against the candidate SHA,
BASE SHA, and rename-map hash. The report records the seven-file map, asset/template dispositions, link/discovery
counts, commands, exit codes, content receipts, and fails on zero scenarios or unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The seven-file reference map and collision evidence are pinned to candidate/BASE/map receipts
- [ ] CHK-002 [P0] Top-level, plugin bridge, relative, catalog, playbook, and external live consumers are enumerated
- [ ] CHK-003 [P2] Asset/template dispositions, reference discovery counts, link counts, and BASE content hashes are recorded
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-004 [P1] Changes are limited to reference filesystem names and path contexts
- [ ] CHK-005 [P0] Reference keys, path-hint identifiers, frontmatter fields, code identifiers, MCP tool IDs, data keys,
  and reference prose are unchanged
- [ ] CHK-006 [P1] The two code-graph-gold-queries.json assets remain already-compliant and unchanged
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-007 [P0] All seven kebab-case reference files exist and no stale live old reference filename remains
- [ ] CHK-008 [P0] SKILL, README, ARCHITECTURE, INSTALL_GUIDE, plugin bridge docs, relative references, catalog, and
  playbook links resolve
- [ ] CHK-009 [P0] Reference discovery and link checks pass with BASE-equivalent counts and preserved content
- [ ] CHK-010 [P1] Every retained old-name hit is classified as an identifier, key, prose, generated/frozen history, or
  non-live path
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-011 [P0] Every reference source path and live path consumer has exactly one map or old-name disposition
- [ ] CHK-012 [P1] Catalog/playbook cross-links use the sibling target maps without changing their content contracts
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-013 [P1] Path rewrites preserve resource roots, traversal boundaries, validation behavior, and operator safety
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-014 [P1] Top-level docs, plugin bridge docs, reference indexes, catalog links, and playbook links expose live
  kebab-case reference paths
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-015 [P1] The reference rename is dependency-closed and no stray implementation summary or scratch directory
  remains in this leaf
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase passes only when the seven-file reference tree, links, discovery behavior, preserved assets, and content
contracts match BASE under the approved filesystem exemption boundary.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms reference path closure and no semantic change outside filesystem names.
<!-- /ANCHOR:sign-off -->

