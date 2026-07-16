---
title: "Implementation Plan: create-skill scaffolding and packaging (032 phase 003 child 001)"
description: "Update the create-skill scaffold and package contract at their existing naming boundaries, then prove the emitted temporary trees and archives obey kebab-case without renaming Python implementation files."
trigger_phrases:
  - "create-skill scaffolding implementation plan"
  - "skill packaging naming plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/003-create-generators-and-templates/001-create-skill-and-packaging"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/003-create-generators-and-templates/001-create-skill-and-packaging"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the implementation plan for create-skill output naming and package checks"
    next_safe_action: "Inventory current scaffold outputs and package validation branches before implementation"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Create-skill Scaffolding and Packaging

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | `sk-doc/create-skill` scaffolding, packaging, templates, and tests |
| **Change class** | Generator output contract and validation |
| **Execution** | Isolated temporary output trees on the pinned BASE worktree |

### Overview
Use the existing `init_skill.py` output branches as the source of truth for standalone and parent-hub scaffolds. Align `package_skill.py` and its wrapper with the same canonical-name predicate, update the templates and guidance that feed generated names, and test the result through temporary directories and zip members rather than touching existing skill trees.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The standalone and parent-hub output branches in `init_skill.py` are inventoried.
- [ ] The package-name, folder-match, resource-path, and archive-name checks in `package_skill.py` are identified.
- [ ] The Python, Python-package, and tool-mandated exemptions are pinned to the 032 policy.
- [ ] Existing create-skill regression fixtures are mapped to the changed checks.

### Definition of Done
- [ ] Standalone and parent-hub temporary scaffolds contain only canonical generated names plus exemptions.
- [ ] Package checks reject new noncanonical generated names and accept valid packages.
- [ ] Tests prove the generated output and exemption boundary.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- `init_skill.py` validates the user-facing skill slug, creates the skill root, renders `SKILL.md`, and builds parent-hub packet/storage directories.
- `package_skill.py` validates frontmatter and folder agreement, recursively inspects generated resource paths, and writes the zip using the skill root name.
- The skill and parent-hub assets provide naming examples and generated path patterns; their source filenames are not renamed in this phase.
- `validate_skill_package.py` remains the orchestration/reporting entry point, while regression tests exercise the lower-level checks and archive members.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm the 032 policy/exemption set and inspect both scaffold modes, package checks, templates, and existing tests.
- [ ] Create temporary standalone and parent-hub fixture inputs without changing tracked skill trees.

### Phase 2: Implementation
- [ ] Enforce kebab-case for generated skill roots, packet names, and generic parent-hub storage directories.
- [ ] Align package folder/frontmatter checks, generated resource-path checks, and archive-root naming with the emitted contract.
- [ ] Update create-skill templates and packaging guidance so generated reference/asset examples use hyphens while exempt names stay explicit.
- [ ] Add regression fixtures for invalid names, valid names, archives, Python files/package directories, and tool-mandated files.

### Phase 3: Verification
- [ ] Generate standalone and parent-hub trees in temporary directories and inspect every relative path.
- [ ] Run package checks against valid and invalid fixtures and inspect the zip member list.
- [ ] Run the focused create-skill regression suites and record exit codes and fixture counts.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Run `init_skill.py demo-skill` in a temporary directory; assert `demo-skill/SKILL.md` exists and `demo_skill` is rejected without output. |
| REQ-002 | Run the parent mode in a temporary directory; assert packet/storage paths use hyphens and exact tool-mandated names remain unchanged. |
| REQ-003 | Compare generated template path examples and guidance against the policy; verify `.py`, Python package directories, `SKILL.md`, and `README.md` remain exempt. |
| REQ-004 | Exercise package validation with matching/mismatching frontmatter and folder names plus a generated underscore resource path; capture the diagnostic and exit code. |
| REQ-005 | List temporary tree paths and zip members; assert no non-exempt underscore segment appears and the archive root/filename use the hyphenated skill name. |
| REQ-006 | Run `test_create_skill_contract.py` and `test_package_skill_regressions.py` with positive and negative fixture cases present. |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The phase inherits the 032 pinned worktree and policy from phases 000/001. It uses the existing create-skill template set and focused Python regression suites. Later rename phases own existing repository debt; this phase must not depend on a retroactive rename to prove newly generated output.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the path-scoped scaffold, package-check, template, and test changes for this child. Temporary fixture directories and archives are disposable and are not part of the tracked migration surface.
<!-- /ANCHOR:rollback -->
