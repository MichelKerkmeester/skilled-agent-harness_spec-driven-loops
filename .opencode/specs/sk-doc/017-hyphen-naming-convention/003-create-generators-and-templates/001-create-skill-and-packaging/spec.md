---
title: "Feature Specification: create-skill scaffolding and packaging (017 phase 003 child 001)"
description: "The create-skill scaffolder and package checks must keep generated skill roots, packets, resource paths, and package names in kebab-case. Python implementation filenames remain exempt; the names those scripts produce do not."
trigger_phrases:
  - "create-skill scaffolding naming"
  - "skill package kebab-case"
  - "hyphenate generated skill names"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/003-create-generators-and-templates"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/003-create-generators-and-templates/001-create-skill-and-packaging"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the Level 2 contract for create-skill and packaging output names"
    next_safe_action: "Run the standalone and parent-skill scaffolds into isolated temporary directories"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Create-skill Scaffolding and Packaging

> Parallel child under `003-create-generators-and-templates`; sibling ordering is not a runtime dependency.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/017-hyphen-naming-convention/003-create-generators-and-templates/001-create-skill-and-packaging |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-doc |
| **Origin** | Child 001 of phase 003 in the 017 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

`init_skill.py` and the create-skill templates are the forward path for new skill packages, but the parent-hub scaffold still creates underscore-named storage directories and the packaging contract still describes underscore resource filenames as acceptable. That lets a newly generated package disagree with the filesystem policy even when its frontmatter `name` already uses hyphens.

Update the scaffolder, package-name checks, templates, and regression coverage so generated skill roots, packet/resource output names, and archive names are kebab-case. Keep the Python script filenames themselves and Python import-package directories exempt, as required by the program policy.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `create-skill/scripts/init_skill.py`: standalone skill roots and parent-hub packet/storage directories produced by both scaffold modes.
- `create-skill/scripts/package_skill.py` and `validate_skill_package.py`: frontmatter-to-folder name checks, generated resource-path checks, and archive-root/package-name checks.
- `create-skill/assets/skill/` and `create-skill/assets/parent_skill/` templates and the create-skill packaging guidance that describes emitted names.
- Regression fixtures in `sk-doc/scripts/tests/` covering valid hyphenated names, rejected underscore names, tool-mandated names, and Python filename/package-directory exemptions.

### Out of Scope
- Renaming the Python implementation files (`init_skill.py`, `package_skill.py`, and related `.py` files) or Python import-package directories.
- The `/create:*` command asset emitter rules; those belong to child 004.
- Feature-catalog and manual-testing-playbook artifact layout; that belongs to child 002.
- Retroactively renaming existing skill resources or other repository files; later migration phases own those changes.
- Code identifiers, YAML/JSON keys, frontmatter field names, and other non-filesystem names.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Standalone skill scaffolding accepts only canonical skill directory names | A temporary run with `demo-skill` creates `demo-skill/SKILL.md`; `demo_skill` is rejected before any output directory is created. |
| REQ-002 | Parent-hub scaffolding emits canonical packet and storage directory names | A temporary parent scaffold contains the hyphenated packet name and `manual-testing-playbook/` plus `benchmark/`; `SKILL.md`, `README.md`, `mode-registry.json`, and other tool-mandated names remain exact. |
| REQ-003 | Templates and packaging guidance describe generated resource names in kebab-case | Generated reference/asset filename patterns and directory examples use hyphens; Python `.py` names, Python package directories, and tool-mandated filenames are explicitly exempt. |
| REQ-004 | Package name checks enforce the folder/frontmatter contract for generated packages | A matching hyphenated folder and frontmatter name pass; an underscore folder/name mismatch or noncanonical generated resource path fails with an actionable diagnostic. |
| REQ-005 | Packaging preserves the canonical generated relative paths | The archive filename and archive root use the hyphenated skill name, and a generated temporary tree contains no non-exempt underscore path segment. |
| REQ-006 | Regression coverage protects both acceptance and exemption boundaries | The create-skill and package-skill tests cover positive and negative name cases, recursive resource paths, package archives, `.py` files, Python package directories, and tool-mandated names. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Standalone and parent-hub scaffolds produce only policy-compliant filesystem names, except for declared exemptions.
- **SC-002**: Package validation accepts canonical generated packages, rejects new noncanonical names, and preserves exact tool-mandated filenames.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The main risk is making package validation fail on pre-existing repository debt before the later rename phases remove it. Keep the new hard assertions focused on generated temporary trees and the package-name contract; retain the program's staged, debt-tolerant behavior for unrelated existing content until its migration phase. The exemption matcher must also distinguish Python filenames and package directories from ordinary generated resource names.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking; the policy, exemptions, and staged migration boundary are fixed by the 017 parent and DR-001 through DR-010.
<!-- /ANCHOR:questions -->
