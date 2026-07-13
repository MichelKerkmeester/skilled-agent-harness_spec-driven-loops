---
title: "Implementation Plan: migrate config and data (017 phase 013)"
description: "Implementation Plan for phase 013 of the 017 kebab-case filesystem-naming program: migrate config and data."
trigger_phrases:
  - "migrate config and data implementation plan"
  - "hyphen naming phase 013 implementation plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/013-migrate-config-and-data"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/013-migrate-config-and-data"
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
# Implementation Plan: Migrate config and data

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | sk-doc + repo (phase 013) |
| **Change class** | Filesystem rename + data classification |
| **Execution** | Isolated worktree pinned to BASE (established in phase 000) |

### Overview
Remaining in-scope `.json`/`.yaml`/`.yml`/`.toml` DATA/CONFIG filenames (not keys) and stragglers must be hyphenated, honoring lockfile/generated and tool-mandated exemptions. Detailed design is finalized when this phase is picked up for execution against the pinned baseline.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Zero in-scope underscore data/config filenames remain (excl exempt)
- [ ] No JSON/YAML/TOML key was altered
- [ ] Loaders/config references resolve after the rename
- [ ] The tracked SQLite DB is classified and handled without raw byte replacement
- [ ] Symlinks and tool-magic name sets are preserved

### Definition of Done
- [ ] Data/config filenames are hyphenated
- [ ] Keys, DB integrity, and exemptions preserved
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- Hyphenate in-scope snake_case `.json`/`.yaml`/`.yml`/`.toml` data/config filenames.
- Fix references/loaders that point at the renamed files.
- Classify the tracked SQLite DB (active/regenerable/historical) and handle it schema-aware or by regeneration.
- Final exemption reconciliation for stragglers; symlink + magic-name preservation.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm predecessor phases landed; verify the worktree is clean, pinned to BASE, and scoped.

### Phase 2: Implementation
- Hyphenate in-scope snake_case `.json`/`.yaml`/`.yml`/`.toml` data/config filenames.
- Fix references/loaders that point at the renamed files.
- Classify the tracked SQLite DB (active/regenerable/historical) and handle it schema-aware or by regeneration.
- Final exemption reconciliation for stragglers; symlink + magic-name preservation.

### Phase 3: Verification
- `git ls-files` finds 0 in-scope underscore `.json/.yaml/.yml/.toml` names
- Before/after key sets are identical; only filenames moved
- Config-loading tests pass; changed path values resolve
- The DB is migrated schema-aware or regenerated; no raw byte edit
- All symlinks resolve; protected magic-name paths are unchanged
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | `git ls-files` finds 0 in-scope underscore `.json/.yaml/.yml/.toml` names |
| REQ-002 | Before/after key sets are identical; only filenames moved |
| REQ-003 | Config-loading tests pass; changed path values resolve |
| REQ-004 | The DB is migrated schema-aware or regenerated; no raw byte edit |
| REQ-005 | All symlinks resolve; protected magic-name paths are unchanged |
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
