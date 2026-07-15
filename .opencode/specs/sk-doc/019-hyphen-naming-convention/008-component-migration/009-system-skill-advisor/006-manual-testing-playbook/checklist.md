---
title: "Checklist: system-skill-advisor manual testing playbook"
description: "Blocking SOL acceptance contract for the manual-testing-playbook root, category, and scenario rename, link closure, scenario identity preservation, and discovery parity."
trigger_phrases:
  - "manual testing playbook checklist"
  - "manual-testing-playbook verification"
  - "advisor scenario rename checklist"
importance_tier: "critical"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/009-system-skill-advisor/006-manual-testing-playbook"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/009-system-skill-advisor/006-manual-testing-playbook"
    last_updated_at: "2026-07-14T18:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the manual-playbook SOL verifier contract"
    next_safe_action: "Run the checklist centrally after the playbook phase executes"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/manual_testing_playbook"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "This authoring pass does not rename scenarios or run manual-playbook tests."
---

# Checklist: system-skill-advisor manual testing playbook

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 006. Every item is checked against the candidate SHA,
BASE SHA, and rename-map hash. The report records root/category/file counts, scenario IDs, commands, exit codes,
discovery results, and fails on zero scenarios or unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The 48-file, root-index, and nine-category map is pinned with collision evidence
- [ ] CHK-002 [P0] Catalog, docs, references, tests, and operator command path consumers are enumerated
- [ ] CHK-003 [P2] BASE scenario IDs, parsed count, link count, and representative outputs are recorded
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-004 [P1] Changes are limited to playbook filesystem names and path contexts
- [ ] CHK-005 [P0] Scenario IDs, titles, frontmatter fields, steps, expected results, JSON/YAML/TOML keys, and code identifiers are preserved
- [ ] CHK-006 [P1] Python filenames, Python package directories, generated metadata, and tool-mandated names remain unchanged
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-007 [P0] manual-testing-playbook/ and all nine category directories exist in kebab-case with all 48 files accounted for
- [ ] CHK-008 [P0] Catalog links, top-level docs, references, tests, and operator commands resolve to the new scenario paths
- [ ] CHK-009 [P0] Scenario parser/test discovery and representative operator checks pass with BASE-equivalent IDs and counts
- [ ] CHK-010 [P1] No stale live manual_testing_playbook path or duplicate physical playbook root remains
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-011 [P0] Every scenario source path and live consumer is represented in the map or old-name disposition ledger
- [ ] CHK-012 [P1] Catalog-to-playbook links preserve the original scenario identity and coverage
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-013 [P1] Operator command/path rewrites preserve existing roots, validation boundaries, and fail-safe behavior
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-014 [P1] SKILL, README, INSTALL_GUIDE, catalog links, references, and playbook indexes expose live kebab-case paths
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-015 [P1] The playbook rename is dependency-closed and no stray implementation summary or scratch directory remains in this leaf
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase passes only when the one-root/48-file/nine-category playbook tree, links, scenario contracts, IDs, and
discovery outcomes match BASE under the approved exemption boundary.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms scenario path closure and no coverage or contract change outside filesystem names.
<!-- /ANCHOR:sign-off -->
