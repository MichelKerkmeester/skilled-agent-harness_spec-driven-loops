---
title: "Implementation Plan: no-new-snake_case guard (032 phase 004)"
description: "Implementation Plan for phase 004 of the 032 kebab-case filesystem-naming program: no-new-snake_case guard."
trigger_phrases:
  - "no-new-snake_case guard implementation plan"
  - "hyphen naming phase 004 implementation plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/004-no-new-snake-guard"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/004-no-new-snake-guard"
    last_updated_at: "2026-07-13T13:10:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Plan authored for the 032 phased tree"
    next_safe_action: "Execute this phase on the pinned worktree when picked up"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: No-new-snake_case guard

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | sk-doc + repo (phase 004) |
| **Change class** | Guard |
| **Execution** | Isolated worktree pinned to BASE (established in phase 000) |

### Overview
Nothing prevents snake_case from re-entering in-scope filesystem names. Detailed design is finalized when this phase is picked up for execution against the pinned baseline.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The guard rejects a fresh in-scope snake_case name and accepts a hyphenated one
- [ ] The guard honors every exemption class
- [ ] The `--changed-since $BASE` mode only flags newly-introduced names
- [ ] The `--all` mode flags the full in-scope debt
- [ ] Positive and negative fixtures cover both modes

### Definition of Done
- [ ] The guard prevents regressions during migration
- [ ] The `--all` mode enforces the end state
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- An exemption-aware no-new-snake_case guard honoring every exemption class.
- A `--changed-since $BASE` mode (fails only on newly-introduced in-scope snake_case) for use during migration.
- An `--all` mode (whole-tree) enabled after migration completes.
- Positive + negative fixtures proving both modes.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm predecessor phases landed; verify the worktree is clean, pinned to BASE, and scoped.

### Phase 2: Implementation
- An exemption-aware no-new-snake_case guard honoring every exemption class.
- A `--changed-since $BASE` mode (fails only on newly-introduced in-scope snake_case) for use during migration.
- An `--all` mode (whole-tree) enabled after migration completes.
- Positive + negative fixtures proving both modes.

### Phase 3: Verification
- A synthetic snake_case file fails the guard; a hyphenated one passes
- A .py, package dir, vendored, generated, and tool-mandated name never trips the guard
- Pre-existing debt does not fail the changed-only mode
- Running `--all` at BASE reports the census count
- Fixture tests pass for changed-only and whole-tree modes
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | A synthetic snake_case file fails the guard; a hyphenated one passes |
| REQ-002 | A .py, package dir, vendored, generated, and tool-mandated name never trips the guard |
| REQ-003 | Pre-existing debt does not fail the changed-only mode |
| REQ-004 | Running `--all` at BASE reports the census count |
| REQ-005 | Fixture tests pass for changed-only and whole-tree modes |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Inherits the 032 program dependencies: the Lane C benchmark harness (regression check), the spec-kit validator
(rebuilt in the worktree), and sk-git for the worktree lifecycle. Phase-specific dependencies are the predecessor
phases named in this phase's spec adjacency.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

All work lands on the dedicated worktree in path-scoped commits, so `git revert` of this phase's commits restores the
prior state (or a stopped, disposable satellite worktree is discarded). No data migration beyond git-reversible
filesystem renames and reference rewrites — except the SQLite handling in phase 013, which is schema-aware.
<!-- /ANCHOR:rollback -->
