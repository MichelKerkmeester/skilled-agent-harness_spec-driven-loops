---
title: "Implementation Plan: guard and migration tooling (019 phase 004)"
description: "Implementation Plan for phase 004 of the 019 kebab-case filesystem-naming program: guard and migration tooling."
trigger_phrases:
  - "guard and migration tooling implementation plan"
  - "hyphen naming phase 004 implementation plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/004-guard-and-migration-tooling"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/004-guard-and-migration-tooling"
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
# Implementation Plan: Guard and migration tooling

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | sk-doc + repo (phase 004) |
| **Change class** | Convention / logic / tooling |
| **Execution** | Worktree (established in phase 005) |

### Overview
Nothing prevents snake_case from re-entering in-scope names, and there is no engine to perform the repo-wide rename safely. Detailed design is finalized when this phase is picked up for execution.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The guard rejects a fresh in-scope snake_case name and accepts a hyphenated one
- [ ] The rename engine is dry-run by default and hard-aborts on any collision
- [ ] The engine rewrites references and imports in the same pass as the rename
- [ ] Every exemption class is enforced by the engine deny-list

### Definition of Done
- [ ] The guard prevents regressions
- [ ] The engine can migrate safely with a reviewable dry-run
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- A no-new-snake_case guard that fails on a new in-scope snake_case FS name and respects every exemption.
- A deterministic rename engine: path-segment `_`->`-`, collision hard-abort, reference + import sweep, exemption deny-list, dry-run default (no mutation without an explicit apply).
- A safety/collision + exemption report emitted before any write.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm predecessor phases landed; verify the worktree is clean and scoped.

### Phase 2: Implementation
- A no-new-snake_case guard that fails on a new in-scope snake_case FS name and respects every exemption.
- A deterministic rename engine: path-segment `_`->`-`, collision hard-abort, reference + import sweep, exemption deny-list, dry-run default (no mutation without an explicit apply).
- A safety/collision + exemption report emitted before any write.

### Phase 3: Verification
- A synthetic snake_case file fails the guard; a hyphenated one passes
- A synthetic colliding pair aborts before any write
- A renamed file has all its importers updated in the dry-run diff
- Vendored/`.py`/generated/tool-mandated names are never in the rename map
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | A synthetic snake_case file fails the guard; a hyphenated one passes |
| REQ-002 | A synthetic colliding pair aborts before any write |
| REQ-003 | A renamed file has all its importers updated in the dry-run diff |
| REQ-004 | Vendored/`.py`/generated/tool-mandated names are never in the rename map |
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
