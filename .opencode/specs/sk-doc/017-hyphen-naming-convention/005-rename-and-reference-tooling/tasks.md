---
title: "Tasks: rename and reference tooling (017 phase 005)"
description: "Tasks for phase 005 of the 017 kebab-case filesystem-naming program: rename and reference tooling."
trigger_phrases:
  - "rename and reference tooling tasks"
  - "hyphen naming phase 005 tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/005-rename-and-reference-tooling"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/005-rename-and-reference-tooling"
    last_updated_at: "2026-07-13T13:10:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Tasks authored from the 16-phase decomposition"
    next_safe_action: "Execute this phase on the pinned worktree when picked up"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Rename and reference tooling

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm predecessor phases landed and the pinned worktree is clean (per this phase's spec adjacency)
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T002 A dry-run-default rename engine: semantic source->target map (not char substitution), collision hard-abort on exact/casefold/NFC, symlink mode-120000 + exec-bit preservation, exemption deny-list
- [ ] T003 A rename-map-driven whole-repo reference checker: JS/TS module resolution, JSON/YAML/TOML path-values, shell `source`, and registry paths
- [ ] T004 A disposition ledger requiring every dynamic `require(...)`/`source`/glob site to be classified
- [ ] T005 The checker fails on zero files scanned (no silent no-op)
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 Verify: The rename engine is dry-run by default and applies only on an explicit flag — A dry-run makes zero writes in a temp git repo
- [ ] T007 Verify: The engine hard-aborts on exact/casefold/NFC collisions — A synthetic colliding pair aborts before any write
- [ ] T008 Verify: The engine uses a semantic map and preserves symlink mode and exec bits — Leading-underscore and double-underscore inputs map to safe targets; mode 120000 and +x survive
- [ ] T009 Verify: The reference checker resolves imports, path-values, and shell sourcing across the repo — Planted broken references are caught; resolution runs over JS/TS/JSON/YAML/shell
- [ ] T010 Verify: Every dynamic require/source/glob site is dispositioned in a ledger — The ledger has no un-dispositioned dynamic site
- [ ] T011 Verify: The checker fails when zero files are scanned — A misconfigured run exits non-zero rather than passing vacuously
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with evidence
- [ ] Phase gate green (validate/build/test as applicable)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
