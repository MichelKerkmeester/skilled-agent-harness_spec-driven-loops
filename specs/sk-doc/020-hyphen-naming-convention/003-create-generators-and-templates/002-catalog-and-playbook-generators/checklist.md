---
title: "Checklist: catalog and playbook generators (020 phase 003 child 002)"
description: "Blocking SOL verifier contract for hyphenated catalog/playbook output and phase 002 consumer compatibility."
trigger_phrases:
  - "catalog and playbook generator checklist"
  - "feature catalog output naming checklist"
  - "manual testing playbook output naming checklist"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/003-create-generators-and-templates/002-catalog-and-playbook-generators"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/003-create-generators-and-templates/002-catalog-and-playbook-generators"
    last_updated_at: "2026-07-18T06:46:43Z"
    last_updated_by: "codex"
    recent_action: "Completed the catalog and playbook generator acceptance contract"
    next_safe_action: "No child work remains"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/create-feature-catalog/SKILL.md"
      - ".opencode/skills/sk-doc/create-feature-catalog/assets/feature_catalog_template.md"
      - ".opencode/skills/sk-doc/create-manual-testing-playbook/SKILL.md"
      - ".opencode/skills/sk-doc/create-manual-testing-playbook/assets/manual_testing_playbook_template.md"
    completion_pct: 100
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

- [x] CHK-006 [P0] Phase 002's consumer compatibility and fail-closed fixtures are available at the candidate SHA before generator acceptance is attempted. Evidence: `test_root_name_consumer_matrix.py` passed 28 checks with 13/13 manifest rows.
- [x] CHK-007 [P2] The report records pinned BASE `1ec0ad2947b`; this generator-only child consumes no rename map.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-008 [P1] Changes are limited to the two generator packets, their output templates/guidance, and focused fixtures; no consumer implementation or existing catalog/playbook tree is renamed. Evidence: path-scoped `git diff --name-only 1ec0ad2947b` and `git diff --check` passed.
- [x] CHK-009 [P2] YAML/JSON keys, frontmatter field names, Python names, and current source-template filenames are not altered merely because they contain underscores. Evidence: `feature_catalog_template.md` and `manual_testing_playbook_template.md` remain source filenames.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-001 [P0] The catalog fixture lists `feature-catalog/feature-catalog.md`, a hyphenated category directory, and a hyphenated feature file; no underscore root/category/leaf is emitted. Evidence: `EMISSION_FIXTURE_PASS=2/2` and `create-feature-catalog/SKILL.md:174`.
- [x] CHK-002 [P0] The playbook fixture lists `manual-testing-playbook/manual-testing-playbook.md`, hyphenated category/scenario directories, and hyphenated scenario files. Evidence: `EMISSION_FIXTURE_PASS=2/2` and `create-manual-testing-playbook/SKILL.md:157`.
- [x] CHK-003 [P0] Every generated root-index link, per-artifact link, and filesystem-valued category/feature/scenario path resolves from the temporary tree; field keys are unchanged. Evidence: `LINKS_RESOLVED=2/2` and typed results `feature_catalog,playbook_feature`.
- [x] CHK-004 [P0] Run phase 002's old-only/new-only/both/missing matrix for both families; new-only output retains its typed classification, old-only remains readable, both roots fail closed, and missing roots fail loudly. Evidence: `PY_JS_MATRIX_PASS=28`, `JS_MATRIX_PASS=16` and `RootCoexistenceError`.
- [x] CHK-005 [P0] A recursive scan of generated output reports zero non-exempt underscore path segments; the scan excludes only current source-template filenames and other declared exemptions, not emitted paths. Evidence: `PATH_SCAN_UNDERSCORE_SEGMENTS=0`.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-010 [P1] The generator fixtures and phase 002 consumer evidence are captured together so the candidate cannot pass with an unreadable generated root or a silent `readme` downgrade. Evidence: `TYPED_CLASSIFICATION=feature_catalog,playbook_feature` and `test_root_name_consumer_matrix.py`.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-011 [P2] The generator keeps writes inside the requested temporary/output root and does not broaden the consumer allowlist or bypass the coexistence guard. Evidence: disposable `TemporaryDirectory` fixture and path-scoped diff.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-012 [P2] Both packet `SKILL.md` files, READMEs, and output templates state the hyphenated emitted paths and identify current source-template filenames as a separate later rename concern. Evidence: `create-feature-catalog/SKILL.md:203` and `create-manual-testing-playbook/SKILL.md:441`.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-013 [P1] All generated fixture trees are disposable and no existing catalog/playbook directory, source template filename, or unrelated tracked file is renamed by this child. Evidence: `TemporaryDirectory`, `git diff --summary` and no rename entries.
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
