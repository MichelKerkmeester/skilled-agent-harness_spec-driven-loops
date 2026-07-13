---
title: "Implementation Plan: migrate script filenames and imports (019 phase 008)"
description: "Implementation Plan for phase 008 of the 019 kebab-case filesystem-naming program: migrate script filenames and imports."
trigger_phrases:
  - "migrate script filenames and imports implementation plan"
  - "hyphen naming phase 008 implementation plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-migrate-scripts-and-imports"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-migrate-scripts-and-imports"
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
# Implementation Plan: Migrate script filenames and imports

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | sk-doc + repo (phase 008) |
| **Change class** | Filesystem rename + reference sweep |
| **Execution** | Worktree (established in phase 005) |

### Overview
Snake_case script filenames (`.ts`/`.js`/`.cjs`/`.mjs`/`.sh`) must be renamed to hyphens AND every `import`/`require`/`source`/registry path reference fixed in lockstep. Detailed design is finalized when this phase is picked up for execution.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Zero in-scope underscore script filenames remain (excl `.py`/vendored/generated)
- [ ] Every import/require/source/registry reference resolves after the rename
- [ ] Affected builds pass after the rename

### Definition of Done
- [ ] Script filenames are hyphenated
- [ ] 0 broken imports; builds green
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- Rename in-scope snake_case script filenames to hyphens.
- Fix every `import`/`require`/`source`/registry/config path reference to the renamed files in the same pass.
- Rebuild affected dist and confirm resolution.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm predecessor phases landed; verify the worktree is clean and scoped.

### Phase 2: Implementation
- Rename in-scope snake_case script filenames to hyphens.
- Fix every `import`/`require`/`source`/registry/config path reference to the renamed files in the same pass.
- Rebuild affected dist and confirm resolution.

### Phase 3: Verification
- `git ls-files` finds 0 in-scope underscore `.ts/.js/.cjs/.mjs/.sh` names
- Whole-repo import resolution reports 0 broken references
- `tsc`/build and test suites for touched packages pass
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | `git ls-files` finds 0 in-scope underscore `.ts/.js/.cjs/.mjs/.sh` names |
| REQ-002 | Whole-repo import resolution reports 0 broken references |
| REQ-003 | `tsc`/build and test suites for touched packages pass |
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
