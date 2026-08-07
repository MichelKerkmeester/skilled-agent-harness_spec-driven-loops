---
title: "Checklist: system-skill-advisor references"
description: "Blocking SOL acceptance contract for the 15-file reference rename, path-only link repair, and navigation/reference parity."
trigger_phrases:
  - "advisor references checklist"
  - "reference file rename verification"
  - "reference link closure checklist"
importance_tier: "critical"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/009-system-skill-advisor/003-references"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/009-system-skill-advisor/003-references"
    last_updated_at: "2026-07-14T18:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the references SOL verifier contract"
    next_safe_action: "Run the checklist centrally after the references phase executes"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/references"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "This authoring pass does not rename reference files or run link checks."
---

# Checklist: system-skill-advisor references

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 003. Every item is checked against the candidate SHA,
BASE SHA, and rename-map hash. The report records path/link counts, commands, exit codes, and old-name dispositions,
and fails on zero scenarios or unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The 15-file source/target map and collision report are pinned
- [ ] CHK-002 [P0] Every old path hit is classified as live path, identifier/key, generated metadata, or frozen/non-path mention
- [ ] CHK-003 [P2] Catalog/playbook sibling maps and the root-consumer contract are recorded
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-004 [P1] Changes are limited to reference filenames and filesystem path contexts
- [ ] CHK-005 [P0] Reference directories, tool IDs, code identifiers, JSON/YAML/TOML keys, frontmatter fields, and frozen history are preserved
- [ ] CHK-006 [P1] Path-only replacements do not alter command semantics or documented runtime policy
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-007 [P0] All 15 reference files exist at kebab-case targets and no old live filename remains
- [ ] CHK-008 [P0] Internal links, top-level indexes, command examples, frontmatter path values, catalog/playbook links, and command assets resolve
- [ ] CHK-009 [P0] Reference validation and link/path checks pass with BASE-equivalent counts
- [ ] CHK-010 [P1] Every retained old-name occurrence is present in the disposition ledger with a non-live reason
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-011 [P0] Every reference source file and every live path consumer is represented in the map or disposition ledger
- [ ] CHK-012 [P1] Cross-phase links resolve against the frozen catalog/playbook target maps
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-013 [P1] Command examples, path roots, and reference links do not broaden access or introduce traversal targets
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-014 [P1] SKILL, README, INSTALL_GUIDE, and reference indexes expose only live kebab-case paths
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-015 [P1] The 15-file rename is dependency-closed and no stray implementation summary or scratch directory remains in this leaf
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase passes only when all 15 targets, live links, command paths, and cross-surface references resolve with
content/identifier parity and a complete old-name disposition ledger.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms zero broken live reference paths and no semantic changes outside filesystem
path contexts.
<!-- /ANCHOR:sign-off -->
