---
title: "Implementation Plan: migrate specs and docs (017 phase 012)"
description: "Implementation Plan for phase 012 of the 017 kebab-case filesystem-naming program: migrate specs and docs."
trigger_phrases:
  - "migrate specs and docs implementation plan"
  - "hyphen naming phase 012 implementation plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/012-migrate-specs-and-docs"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/012-migrate-specs-and-docs"
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
# Implementation Plan: Migrate specs and docs

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | sk-doc + repo (phase 012) |
| **Change class** | Filesystem rename + link sweep |
| **Execution** | Isolated worktree pinned to BASE (established in phase 000) |

### Overview
Remaining in-scope snake_case names exist across spec docs and other `.md` filesystem names. Detailed design is finalized when this phase is picked up for execution against the pinned baseline.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Zero in-scope underscore doc filenames remain outside frozen surfaces
- [ ] Frozen surfaces are untouched except an approved supersession note
- [ ] Doc cross-references and markdown links resolve after the rename
- [ ] Every touched packet/skill strict-validates
- [ ] Identifier/key content is not altered by the doc rename

### Definition of Done
- [ ] Doc filesystem names are hyphenated
- [ ] Frozen history preserved; links resolve
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- Hyphenate in-scope snake_case `.md` and doc filesystem names outside frozen surfaces.
- Rewrite doc cross-references to the renamed paths.
- Resolve markdown links across all active specs/docs (not just current checker roots).
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm predecessor phases landed; verify the worktree is clean, pinned to BASE, and scoped.

### Phase 2: Implementation
- Hyphenate in-scope snake_case `.md` and doc filesystem names outside frozen surfaces.
- Rewrite doc cross-references to the renamed paths.
- Resolve markdown links across all active specs/docs (not just current checker roots).

### Phase 3: Verification
- `git ls-files` finds 0 in-scope underscore doc names (excl frozen)
- No content change under `z_archive/`, changelogs, or completed history beyond the approved note
- Markdown-link resolution across active specs/docs is clean
- `validate.sh --strict` Errors 0 on touched packets
- Only filesystem names + path references changed; prose identifiers untouched
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | `git ls-files` finds 0 in-scope underscore doc names (excl frozen) |
| REQ-002 | No content change under `z_archive/`, changelogs, or completed history beyond the approved note |
| REQ-003 | Markdown-link resolution across active specs/docs is clean |
| REQ-004 | `validate.sh --strict` Errors 0 on touched packets |
| REQ-005 | Only filesystem names + path references changed; prose identifiers untouched |
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
