---
title: "Implementation Plan: migrate config and data filenames (019 phase 010)"
description: "Implementation Plan for phase 010 of the 019 kebab-case filesystem-naming program: migrate config and data filenames."
trigger_phrases:
  - "migrate config and data filenames implementation plan"
  - "hyphen naming phase 010 implementation plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/010-migrate-config-and-data"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/010-migrate-config-and-data"
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
# Implementation Plan: Migrate config and data filenames

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | sk-doc + repo (phase 010) |
| **Change class** | Filesystem rename + reference sweep |
| **Execution** | Worktree (established in phase 005) |

### Overview
Remaining in-scope `.json`/`.yaml`/`.yml` DATA/CONFIG filenames (not keys) and any stragglers must be hyphenated, honoring lockfile/generated and tool-mandated exemptions.. Detailed design is finalized when this phase is picked up for execution.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Zero in-scope underscore data/config filenames remain (excl exempt)
- [ ] No JSON/YAML key was altered
- [ ] Loaders/config references resolve after the rename

### Definition of Done
- [ ] Data/config filenames are hyphenated
- [ ] Keys and exemptions untouched
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- Hyphenate in-scope snake_case `.json`/`.yaml`/`.yml` data/config filenames.
- Fix references/loaders that point at the renamed files.
- Final exemption reconciliation for stragglers.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm predecessor phases landed; verify the worktree is clean and scoped.

### Phase 2: Implementation
- Hyphenate in-scope snake_case `.json`/`.yaml`/`.yml` data/config filenames.
- Fix references/loaders that point at the renamed files.
- Final exemption reconciliation for stragglers.

### Phase 3: Verification
- `git ls-files` finds 0 in-scope underscore `.json/.yaml/.yml` names
- Key diffs show 0 changed keys; only filenames moved
- Config-loading tests pass
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | `git ls-files` finds 0 in-scope underscore `.json/.yaml/.yml` names |
| REQ-002 | Key diffs show 0 changed keys; only filenames moved |
| REQ-003 | Config-loading tests pass |
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
