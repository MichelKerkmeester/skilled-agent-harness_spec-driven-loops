---
title: "Implementation Plan: migrate scripts and imports (017 phase 011)"
description: "Implementation Plan for phase 011 of the 017 kebab-case filesystem-naming program: migrate scripts and imports."
trigger_phrases:
  - "migrate scripts and imports implementation plan"
  - "hyphen naming phase 011 implementation plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/011-migrate-scripts-and-imports"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/011-migrate-scripts-and-imports"
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
# Implementation Plan: Migrate scripts and imports

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | sk-doc + repo (phase 011) |
| **Change class** | Filesystem rename + import sweep (highest risk) |
| **Execution** | Isolated worktree pinned to BASE (established in phase 000) |

### Overview
Snake_case script filenames (`.ts`/`.js`/`.cjs`/`.mjs`/`.sh`) must be renamed to hyphens AND every `import`/`require`/`source`/registry reference fixed in lockstep, in dependency-closed per-skill/package batches, with shared dispatch/runtime scripts as their own cross-cutting batch. Detailed design is finalized when this phase is picked up for execution against the pinned baseline.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Zero in-scope underscore script filenames remain (excl .py/vendored/generated)
- [ ] Every import/require/source/registry reference resolves after the rename
- [ ] Every dynamic require/source/glob site is dispositioned
- [ ] Affected builds pass and syntax checks are clean
- [ ] Test discovery counts equal the 000 baseline

### Definition of Done
- [ ] Script filenames are hyphenated
- [ ] 0 broken imports; builds green; discovery parity
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- Rename in-scope snake_case script filenames to hyphens, in dependency-closed batches.
- Fix every `import`/`require`/`source`/registry/config reference to the renamed files in the same pass.
- Shared dispatch/runtime scripts form their own cross-cutting batch.
- Rebuild affected dist and confirm resolution; disposition every dynamic site.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm predecessor phases landed; verify the worktree is clean, pinned to BASE, and scoped.

### Phase 2: Implementation
- Rename in-scope snake_case script filenames to hyphens, in dependency-closed batches.
- Fix every `import`/`require`/`source`/registry/config reference to the renamed files in the same pass.
- Shared dispatch/runtime scripts form their own cross-cutting batch.
- Rebuild affected dist and confirm resolution; disposition every dynamic site.

### Phase 3: Verification
- `git ls-files` finds 0 in-scope underscore `.ts/.js/.cjs/.mjs/.sh` names
- Whole-repo import resolution reports 0 broken references
- The disposition ledger has no un-handled dynamic site in the touched batch
- `node --check`, `bash -n`, `tsc`/build, and tests for touched packages pass
- Discovered test files + cases match the baseline after the rename
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | `git ls-files` finds 0 in-scope underscore `.ts/.js/.cjs/.mjs/.sh` names |
| REQ-002 | Whole-repo import resolution reports 0 broken references |
| REQ-003 | The disposition ledger has no un-handled dynamic site in the touched batch |
| REQ-004 | `node --check`, `bash -n`, `tsc`/build, and tests for touched packages pass |
| REQ-005 | Discovered test files + cases match the baseline after the rename |
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
