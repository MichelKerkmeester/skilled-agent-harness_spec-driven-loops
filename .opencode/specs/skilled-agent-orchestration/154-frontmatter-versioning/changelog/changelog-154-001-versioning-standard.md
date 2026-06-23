---
title: "Changelog: Phase 1 Versioning Standard"
description: "Phase 1 wrote the 4-part frontmatter versioning standard into sk-doc and made version a documented format-checked field across templates, generators and validators."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-23

> Spec folder: `.opencode/specs/skilled-agent-orchestration/154-frontmatter-versioning/001-versioning-standard` (Level 1)
> Parent packet: `.opencode/specs/skilled-agent-orchestration/154-frontmatter-versioning`

### Summary

Phase 1 wrote a single written contract for the 4-part `version: X.Y.Z.W` field and taught every sk-doc surface about it. Before this phase only 21 SKILL.md files carried a version and nothing documented the format. After it the standard is authored, the templates emit the field and the validators reject a malformed value. Enforcement stays format-only here so the un-versioned corpus does not go red mid-migration. The required-on-absent gate is staged for phase 5.

### Added

- `references/frontmatter_versioning.md` as the source of truth for the `X.Y.Z.W` format, the changelog-anchored derivation `anchor = max(frontmatter, changelog)`, the numstat-gated build segment, the line-wise insertion rule and the staged enforcement rollout.
- A `version: 1.0.0.0` example in nine template frontmatter blocks across skill, reference, asset, parent-hub, readme, feature-catalog, testing-playbook and snippet templates.
- A `version` field emit in generated SKILL.md output from `init_skill.py` so new docs are born versioned.

### Changed

- `assets/frontmatter_templates.md` lists `version` as a required field for SKILL.md and skill reference and asset docs, with a 4-part format in its validation rules.
- `scripts/quick_validate.py` and `scripts/package_skill.py` reject a `version` that is not 4-part `X.Y.Z.W`, while absence stays allowed until phase 5.
- `references/feature_catalog_creation.md`, `references/manual_testing_playbook_creation.md` and `references/skill_creation/validation_and_packaging.md` document the version field.
- `scripts/tests/test_quick_validate_086.py` moved its fixture to a 4-part value to match the new contract.

### Fixed

No fixes recorded.

### Verification

- `py_compile` on both validators: PASS.
- version format-check rejects a 3-part `1.0.0` with "must be 4-part X.Y.Z.W": PASS.
- version format-check accepts a 4-part `1.0.0.0`: PASS.
- `quick_validate.py` on the real sk-doc skill stays valid at version 1.5.0.0: PASS.
- `test_quick_validate_086.py`: PASS at 5 of 5 cases.
- `test_package_skill_regressions.py`: PASS, exit 0.
- `test_validator.py`: PASS at 11 of 11.
- Nine templates carry a version example with 15 keys and no leftover 3-part value in skill docs: PASS.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `references/frontmatter_versioning.md` | Created | The versioning standard for format, derivation and rollout |
| `assets/frontmatter_templates.md` | Modified | version added to field tables, templates and validation rules |
| `assets/skill/*.md`, `assets/feature_catalog/*.md`, `assets/testing_playbook/*.md` (9 files) | Modified | version example in each prescribed frontmatter block |
| `scripts/quick_validate.py`, `scripts/package_skill.py` | Modified | 4-part format-check when present |
| `scripts/init_skill.py` | Modified | Generated SKILL.md emits version |
| `references/feature_catalog_creation.md`, `references/manual_testing_playbook_creation.md`, `references/skill_creation/validation_and_packaging.md` | Modified | Document the version field |
| `scripts/tests/test_quick_validate_086.py` | Modified | Fixture moved to 4-part to match the new contract |

### Follow-Ups

- Phase 2 builds the deterministic derivation engine that computes and inserts the field.
- Phase 5 flips the required-on-absent gate once the corpus carries the field everywhere.
- The four pre-existing 3-part SKILL.md files now fail the format-check by design and get normalized in phase 3.
