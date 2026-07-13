---
title: "Tasks: migrate config and data (017 phase 013)"
description: "Tasks for phase 013 of the 017 kebab-case filesystem-naming program: migrate config and data."
trigger_phrases:
  - "migrate config and data tasks"
  - "hyphen naming phase 013 tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/013-migrate-config-and-data"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/013-migrate-config-and-data"
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
# Tasks: Migrate config and data

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

- [ ] T002 Hyphenate in-scope snake_case `.json`/`.yaml`/`.yml`/`.toml` data/config filenames
- [ ] T003 Fix references/loaders that point at the renamed files
- [ ] T004 Classify the tracked SQLite DB (active/regenerable/historical) and handle it schema-aware or by regeneration
- [ ] T005 Final exemption reconciliation for stragglers; symlink + magic-name preservation
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 Verify: Zero in-scope underscore data/config filenames remain (excl exempt) — `git ls-files` finds 0 in-scope underscore `.json/.yaml/.yml/.toml` names
- [ ] T007 Verify: No JSON/YAML/TOML key was altered — Before/after key sets are identical; only filenames moved
- [ ] T008 Verify: Loaders/config references resolve after the rename — Config-loading tests pass; changed path values resolve
- [ ] T009 Verify: The tracked SQLite DB is classified and handled without raw byte replacement — The DB is migrated schema-aware or regenerated; no raw byte edit
- [ ] T010 Verify: Symlinks and tool-magic name sets are preserved — All symlinks resolve; protected magic-name paths are unchanged
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
