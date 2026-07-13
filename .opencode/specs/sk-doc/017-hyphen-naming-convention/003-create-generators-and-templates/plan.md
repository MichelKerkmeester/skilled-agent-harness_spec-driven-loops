---
title: "Implementation Plan: create-* generators and templates (017 phase 003)"
description: "Implementation Plan for phase 003 of the 017 kebab-case filesystem-naming program: create-* generators and templates."
trigger_phrases:
  - "create-* generators and templates implementation plan"
  - "hyphen naming phase 003 implementation plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/003-create-generators-and-templates"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/003-create-generators-and-templates"
    last_updated_at: "2026-07-13T13:10:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Plan authored from the 16-phase decomposition"
    next_safe_action: "Execute this phase on the pinned worktree when picked up"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: create-* generators and templates

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | sk-doc + repo (phase 003) |
| **Change class** | Generators / templates |
| **Execution** | Isolated worktree pinned to BASE (established in phase 000) |

### Overview
The create-feature-catalog / create-manual-testing-playbook skills, the `/create:*` generators, `package_skill.py`, and their templates currently emit underscore names (the 027 change). Detailed design is finalized when this phase is picked up for execution against the pinned baseline.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The create-* generators emit hyphenated folder and file names
- [ ] Templates and SKILL docs document the hyphenated canonical form
- [ ] The 027 generator changes are reversed
- [ ] `package_skill.py` emits and checks hyphenated names and its tests pass
- [ ] Every generator produces only canonical names when run into a temp dir

### Definition of Done
- [ ] New catalog/playbook content is born hyphenated
- [ ] Generators + templates are the reference for the convention
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- create-feature-catalog + create-manual-testing-playbook SKILL.md + templates.
- The `/create:*` generators (reverse the 027 `category_name`/`feature_name.md` emission back to `category-name`/`feature-name.md`).
- `create-skill/scripts/package_skill.py` and its regression tests.
- Any other create-* mode that emits filesystem names.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm predecessor phases landed; verify the worktree is clean, pinned to BASE, and scoped.

### Phase 2: Implementation
- create-feature-catalog + create-manual-testing-playbook SKILL.md + templates.
- The `/create:*` generators (reverse the 027 `category_name`/`feature_name.md` emission back to `category-name`/`feature-name.md`).
- `create-skill/scripts/package_skill.py` and its regression tests.
- Any other create-* mode that emits filesystem names.

### Phase 3: Verification
- A dry-run generation produces `category-name/` and `feature-name.md`
- No template or SKILL example shows an underscore filesystem name
- The generators no longer emit `category_name`/`feature_name.md`
- The package_skill regression tests are green against the hyphenated policy
- A generate-into-temp comparison finds no underscore filesystem name
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | A dry-run generation produces `category-name/` and `feature-name.md` |
| REQ-002 | No template or SKILL example shows an underscore filesystem name |
| REQ-003 | The generators no longer emit `category_name`/`feature_name.md` |
| REQ-004 | The package_skill regression tests are green against the hyphenated policy |
| REQ-005 | A generate-into-temp comparison finds no underscore filesystem name |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Inherits the 017 program dependencies: the Lane C benchmark harness (regression check), the spec-kit validator
(rebuilt in the worktree), and sk-git for the worktree lifecycle. Phase-specific dependencies are the predecessor
phases named in this phase's spec adjacency.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

All work lands on the dedicated worktree in path-scoped commits, so `git revert` of this phase's commits restores the
prior state (or a stopped, disposable satellite worktree is discarded). No data migration beyond git-reversible
filesystem renames and reference rewrites — except the SQLite handling in phase 013, which is schema-aware.
<!-- /ANCHOR:rollback -->
