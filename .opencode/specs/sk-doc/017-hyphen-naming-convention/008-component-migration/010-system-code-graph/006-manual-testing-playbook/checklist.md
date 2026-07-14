---
title: "Checklist: system-code-graph manual testing playbook"
description: "Blocking SOL acceptance contract for the manual-testing-playbook root, category, and scenario rename, path-link closure, scenario identity preservation, and coverage parity."
trigger_phrases:
  - "system-code-graph manual testing playbook checklist"
  - "code graph manual-playbook verification"
  - "scenario link closure checklist"
importance_tier: "critical"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/010-system-code-graph/006-manual-testing-playbook"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/010-system-code-graph/006-manual-testing-playbook"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored playbook SOL contract"
    next_safe_action: "Run the checklist centrally after playbook phase"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/manual_testing_playbook"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "This authoring pass does not rename playbook paths or run playbook validation."
---

# Checklist: system-code-graph manual testing playbook

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 006. Every item is checked against the candidate SHA,
BASE SHA, and rename-map hash. The report records root/category/file counts, link and scenario-identity results,
commands, exit codes, coverage receipts, and fails on zero scenarios or unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The 29-file, root-index, and nine-category map is pinned with collision evidence
- [ ] CHK-002 [P0] Playbook, catalog, reference, top-level-doc, test, validator, and other live path consumers are enumerated
- [ ] CHK-003 [P2] BASE scenario IDs, category membership, feature references, link counts, and content fingerprints are recorded
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-004 [P1] Changes are limited to playbook filesystem names and path contexts
- [ ] CHK-005 [P0] Scenario IDs, frontmatter, titles, steps, expected results, commands, evidence rules, and content keys are preserved
- [ ] CHK-006 [P1] Python exemptions, tool-mandated names, category semantics, and sibling physical trees are not altered
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-007 [P0] manual-testing-playbook/ and all nine category directories exist in kebab-case with all 29 files accounted for
- [ ] CHK-008 [P0] Root navigation, scenario links, catalog/reference links, top-level docs, tests, and validators resolve
- [ ] CHK-009 [P0] Scenario IDs, category membership, feature references, commands, and evidence requirements match BASE
- [ ] CHK-010 [P1] No stale live manual_testing_playbook path or duplicate physical playbook root remains
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-011 [P0] Every playbook source path and live consumer is represented in the map or old-name disposition ledger
- [ ] CHK-012 [P1] Cross-links to catalog, references, sibling phases, and post-rename procedures use target maps without changing scenario semantics
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-013 [P1] Path rewrites preserve evidence boundaries, command safety, validation roots, and manual-test isolation
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-014 [P1] Playbook indexes, scenario documents, SKILL, README, INSTALL_GUIDE, ARCHITECTURE, catalog, and reference links expose live kebab-case paths
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-015 [P1] The playbook rename is dependency-closed and no stray implementation summary or scratch directory remains in this leaf
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase passes only when the one-root/29-file/nine-category playbook tree, links, scenario identity, and manual
coverage match BASE under the approved filesystem exemption boundary.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms playbook path closure, stable scenario evidence, and no semantic change
outside filesystem names.
<!-- /ANCHOR:sign-off -->

