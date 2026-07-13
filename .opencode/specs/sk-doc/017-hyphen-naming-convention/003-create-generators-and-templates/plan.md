---
title: "Implementation Plan: create-* generators and templates (019 phase 003)"
description: "Implementation Plan for phase 003 of the 019 kebab-case filesystem-naming program: create-* generators and templates."
trigger_phrases:
  - "create-* generators and templates implementation plan"
  - "hyphen naming phase 003 implementation plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/003-create-generators-and-templates"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/003-create-generators-and-templates"
    last_updated_at: "2026-07-13T11:44:19Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Plan scaffolded from the 019 decomposition"
    next_safe_action: "Plan or execute this phase on the worktree when picked up"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: create-* generators and templates

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | sk-doc + repo (phase 003) |
| **Change class** | Convention / logic / tooling |
| **Execution** | Worktree (established in phase 005) |

### Overview
The create-feature-catalog and create-manual-testing-playbook skills, the `/create:*` generators, and their templates currently emit underscore names (the 027 change, commit 7cc369f2ed). Detailed design is finalized when this phase is picked up for execution.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The create-* generators emit hyphenated folder and file names
- [ ] Templates and SKILL docs document the hyphenated canonical form
- [ ] The 027 generator changes are reversed

### Definition of Done
- [ ] New catalog/playbook content is born hyphenated
- [ ] Generators + templates are the reference for the convention
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- create-feature-catalog + create-manual-testing-playbook SKILL.md + templates.
- The `/create:*` generators (reverse the 027 `category_name`/`feature_name.md` emission back to `category-name`/`feature-name.md`).
- Any other create-* mode that emits filesystem names.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm predecessor phases landed; verify the worktree is clean and scoped.

### Phase 2: Implementation
- create-feature-catalog + create-manual-testing-playbook SKILL.md + templates.
- The `/create:*` generators (reverse the 027 `category_name`/`feature_name.md` emission back to `category-name`/`feature-name.md`).
- Any other create-* mode that emits filesystem names.

### Phase 3: Verification
- A dry-run generation produces `category-name/` and `feature-name.md`
- No template or SKILL example shows an underscore filesystem name
- The generators no longer emit `category_name`/`feature_name.md`
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | A dry-run generation produces `category-name/` and `feature-name.md` |
| REQ-002 | No template or SKILL example shows an underscore filesystem name |
| REQ-003 | The generators no longer emit `category_name`/`feature_name.md` |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Inherits the 019 program dependencies: the Lane C benchmark harness (regression check), the spec-kit validator
(rebuilt in the worktree), and sk-git for the worktree lifecycle. Phase-specific dependencies are the predecessor
phases named in this phase's spec adjacency.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

All work lands on the dedicated worktree in path-scoped commits, so `git revert` of this phase's commits restores the
prior state. No data migration is involved — filesystem renames and reference rewrites are fully git-reversible.
<!-- /ANCHOR:rollback -->
