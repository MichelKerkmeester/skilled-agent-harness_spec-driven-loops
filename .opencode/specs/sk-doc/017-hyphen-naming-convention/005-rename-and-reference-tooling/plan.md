---
title: "Implementation Plan: rename and reference tooling (017 phase 005)"
description: "Implementation Plan for phase 005 of the 017 kebab-case filesystem-naming program: rename and reference tooling."
trigger_phrases:
  - "rename and reference tooling implementation plan"
  - "hyphen naming phase 005 implementation plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/005-rename-and-reference-tooling"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/005-rename-and-reference-tooling"
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
# Implementation Plan: Rename and reference tooling

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | sk-doc + repo (phase 005) |
| **Change class** | Tooling |
| **Execution** | Isolated worktree pinned to BASE (established in phase 000) |

### Overview
A blind path-segment `_`->`-` substitution corrupts names (`_common.sh`->`-common.sh`, `__fixtures__`->`--fixtures--`, leading-hyphen CLI hazards) and misses dynamic references. Detailed design is finalized when this phase is picked up for execution against the pinned baseline.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The rename engine is dry-run by default and applies only on an explicit flag
- [ ] The engine hard-aborts on exact/casefold/NFC collisions
- [ ] The engine uses a semantic map and preserves symlink mode and exec bits
- [ ] The reference checker resolves imports, path-values, and shell sourcing across the repo
- [ ] Every dynamic require/source/glob site is dispositioned in a ledger
- [ ] The checker fails when zero files are scanned

### Definition of Done
- [ ] A safe, reviewable rename engine exists
- [ ] A whole-repo reference checker catches broken and dynamic references
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- A dry-run-default rename engine: semantic source->target map (not char substitution), collision hard-abort on exact/casefold/NFC, symlink mode-120000 + exec-bit preservation, exemption deny-list.
- A rename-map-driven whole-repo reference checker: JS/TS module resolution, JSON/YAML/TOML path-values, shell `source`, and registry paths.
- A disposition ledger requiring every dynamic `require(...)`/`source`/glob site to be classified.
- The checker fails on zero files scanned (no silent no-op).
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm predecessor phases landed; verify the worktree is clean, pinned to BASE, and scoped.

### Phase 2: Implementation
- A dry-run-default rename engine: semantic source->target map (not char substitution), collision hard-abort on exact/casefold/NFC, symlink mode-120000 + exec-bit preservation, exemption deny-list.
- A rename-map-driven whole-repo reference checker: JS/TS module resolution, JSON/YAML/TOML path-values, shell `source`, and registry paths.
- A disposition ledger requiring every dynamic `require(...)`/`source`/glob site to be classified.
- The checker fails on zero files scanned (no silent no-op).

### Phase 3: Verification
- A dry-run makes zero writes in a temp git repo
- A synthetic colliding pair aborts before any write
- Leading-underscore and double-underscore inputs map to safe targets; mode 120000 and +x survive
- Planted broken references are caught; resolution runs over JS/TS/JSON/YAML/shell
- The ledger has no un-dispositioned dynamic site
- A misconfigured run exits non-zero rather than passing vacuously
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | A dry-run makes zero writes in a temp git repo |
| REQ-002 | A synthetic colliding pair aborts before any write |
| REQ-003 | Leading-underscore and double-underscore inputs map to safe targets; mode 120000 and +x survive |
| REQ-004 | Planted broken references are caught; resolution runs over JS/TS/JSON/YAML/shell |
| REQ-005 | The ledger has no un-dispositioned dynamic site |
| REQ-006 | A misconfigured run exits non-zero rather than passing vacuously |
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
