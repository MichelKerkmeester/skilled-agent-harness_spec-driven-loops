---
title: "Checklist: catalog and playbook generators (032 phase 003 child 002)"
description: "Blocking SOL verifier contract for hyphenated catalog/playbook output and phase 002 consumer compatibility."
trigger_phrases:
  - "catalog and playbook generator checklist"
  - "feature catalog output naming checklist"
  - "manual testing playbook output naming checklist"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/003-create-generators-and-templates/002-catalog-and-playbook-generators"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/003-create-generators-and-templates/002-catalog-and-playbook-generators"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the SOL acceptance contract for catalog/playbook generator output"
    next_safe_action: "Run both generator fixtures through the phase 002 consumer matrix"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Catalog and Playbook Generators

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for child 002. The verifier records the candidate SHA, phase 002
consumer revision, commands, exit codes, fixture roots, generated-tree listings, path-resolution results, and conflict
diagnostics. It fails on zero generated fixtures, silent type downgrades, or unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-006 [P0] Phase 002's consumer compatibility and fail-closed fixtures are available at the candidate SHA before generator acceptance is attempted.
- [ ] CHK-007 [P2] The report records the pinned BASE SHA and rename-map hash, or explicitly records that no rename map is consumed by this generator-only child.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-008 [P1] Changes are limited to the two generator packets, their output templates/guidance, and focused fixtures; no consumer implementation or existing catalog/playbook tree is renamed.
- [ ] CHK-009 [P2] YAML/JSON keys, frontmatter field names, Python names, and current source-template filenames are not altered merely because they contain underscores.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-001 [P0] The catalog fixture lists `feature-catalog/feature-catalog.md`, a hyphenated category directory, and a hyphenated feature file; no underscore root/category/leaf is emitted.
- [ ] CHK-002 [P0] The playbook fixture lists `manual-testing-playbook/manual-testing-playbook.md`, hyphenated category/scenario directories, and hyphenated scenario files.
- [ ] CHK-003 [P0] Every generated root-index link, per-artifact link, and filesystem-valued category/feature/scenario path resolves from the temporary tree; field keys are unchanged.
- [ ] CHK-004 [P0] Run phase 002's old-only/new-only/both/missing matrix for both families; new-only output retains its typed classification, old-only remains readable, both roots fail closed, and missing roots fail loudly.
- [ ] CHK-005 [P0] A recursive scan of generated output reports zero non-exempt underscore path segments; the scan excludes only current source-template filenames and other declared exemptions, not emitted paths.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-010 [P1] The generator fixtures and phase 002 consumer evidence are captured together so the candidate cannot pass with an unreadable generated root or a silent `readme` downgrade.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-011 [P2] The generator keeps writes inside the requested temporary/output root and does not broaden the consumer allowlist or bypass the coexistence guard.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-012 [P2] Both packet `SKILL.md` files, READMEs, and output templates state the hyphenated emitted paths and identify current source-template filenames as a separate later rename concern.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-013 [P1] All generated fixture trees are disposable and no existing catalog/playbook directory, source template filename, or unrelated tracked file is renamed by this child.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The child is accepted only when every P0 item passes for both generator families and the report proves that phase 002
resolves the hyphenated output without silent downgrade or ambiguous dual-root selection.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the P0 contract and `git diff-index --quiet HEAD --` shows no unexpected
tracked mutation after verification.
<!-- /ANCHOR:sign-off -->
