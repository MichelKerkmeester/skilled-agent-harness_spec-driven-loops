---
title: "Checklist: create-skill scaffolding and packaging (020 phase 003 child 001)"
description: "Blocking SOL verifier contract for create-skill scaffolding, package-name checks, generated resource paths, and archive output."
trigger_phrases:
  - "create-skill scaffolding checklist"
  - "skill packaging naming checklist"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/003-create-generators-and-templates/001-create-skill-and-packaging"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/003-create-generators-and-templates/001-create-skill-and-packaging"
    last_updated_at: "2026-07-18T06:41:37.848Z"
    last_updated_by: "codex"
    recent_action: "Verified every child acceptance check with generated fixture and test evidence"
    next_safe_action: "No child work remains"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Checklist: Create-skill Scaffolding and Packaging

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for child 001. The verifier records the candidate SHA, BASE SHA,
commands, exit codes, fixture paths, generated-tree listings, and archive member listings. A pass requires nonzero
fixture coverage and no unexpected tracked mutation; the verifier reports findings and does not repair them.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-006 [P0] The candidate is scoped to child 001 on the pinned worktree, and the 020 exemption boundary is recorded in the report. Evidence: `BASE 1ec0ad2947b`, `create-skill/` scope, no phase-002 consumer edits.
- [x] CHK-007 [P2] The report records the pinned BASE SHA and rename-map hash, or explicitly records that this generator-only check has no map input. Evidence: `BASE 1ec0ad2947b`; generator-only check has no rename-map input.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-008 [P1] Changes are limited to create-skill scaffolding, packaging checks, templates, guidance, and their focused tests; no existing skill tree is renamed. Evidence: `git diff --check` and scoped changed-file inventory.
- [x] CHK-009 [P2] Python script filenames, Python import-package directories, tool-mandated filenames, YAML/JSON keys, and frontmatter fields remain unchanged. Evidence: `test_generated_path_check_preserves_python_and_tool_exemptions` and package_skill.py:481.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-001 [P0] Run standalone scaffolding with `demo-skill`; the evidence lists `demo-skill/SKILL.md`, and running with `demo_skill` exits nonzero before creating output. Evidence: `test_standalone_scaffold_emits_kebab_root_and_rejects_underscore` and test_create_skill_contract.py:78.
- [x] CHK-002 [P0] Run parent-hub scaffolding; the evidence lists the hyphenated packet and storage directories and exact `SKILL.md`, `README.md`, `mode-registry.json`, `hub-router.json`, `description.json`, and `graph-metadata.json` names. Evidence: `test_parent_scaffold_emits_kebab_storage_and_exact_tool_names`, `manual-testing-playbook/`, and test_create_skill_contract.py:90.
- [x] CHK-003 [P0] Inspect generated template path examples; every newly emitted reference/asset path is kebab-case, while `.py`, Python package directories, and tool-mandated names are covered by explicit exemption fixtures. Evidence: `test_generated_path_check_preserves_python_and_tool_exemptions`, SKILL.md:186, and validation_and_packaging.md:55.
- [x] CHK-004 [P0] Package a valid temporary `demo-skill`; matching folder/frontmatter names pass, and an underscore folder/name or generated underscore resource path fails with a naming diagnostic. Evidence: `test_packaging_rejects_noncanonical_generated_resource_path`, `test_completion_wrapper_strictly_rejects_underscore_resource_path`, and package_skill.py:501.
- [x] CHK-005 [P0] List the temporary package tree and zip members; the archive filename/root use `demo-skill`, and no non-exempt underscore segment appears. Evidence: `test_package_uses_kebab_archive_root_and_members`, `demo-skill.zip`, and test_create_skill_contract.py:199.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-010 [P1] `test_create_skill_contract.py` and `test_package_skill_regressions.py` contain and pass positive/negative cases for generated names, recursive resources, archives, and exemptions. Evidence: `39 passed` in the expanded create-skill Python suite and `leaf-resource-contract.test.cjs` passed 1/1.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-011 [P2] No executable allowlist, package boundary, or write target expands beyond the existing create-skill contract. Evidence: `validate_generated_paths` inspects the existing package root and package_skill.py:851 keeps the existing archive write boundary.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-012 [P2] The create-skill templates and packaging guidance state the canonical output rule and the Python/tool-mandated exemptions without claiming that existing repository debt has already been renamed. Evidence: SKILL.md:284 and validation_and_packaging.md:55.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-013 [P1] The implementation uses temporary fixture output for generation checks and leaves no generated archive, scratch file, or unrelated tracked change in the worktree. Evidence: `tmp_path` fixtures, scoped `git status --short`, and no package archive under `create-skill/`.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The child is accepted only when every P0 item passes, the focused tests exercise both valid and invalid names, and the
report includes the generated-tree and archive evidence needed to distinguish emitted names from exempt source names.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the P0 contract and `git diff-index --quiet HEAD --` shows no unexpected
tracked mutation after verification.
<!-- /ANCHOR:sign-off -->
