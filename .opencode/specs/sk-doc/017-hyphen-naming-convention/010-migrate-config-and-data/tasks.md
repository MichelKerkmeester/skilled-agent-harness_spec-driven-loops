---
title: "Tasks: migrate config and data filenames (019 phase 010)"
description: "Tasks for phase 010 of the 019 kebab-case filesystem-naming program: migrate config and data filenames."
trigger_phrases:
  - "migrate config and data filenames tasks"
  - "hyphen naming phase 010 tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/010-migrate-config-and-data"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/010-migrate-config-and-data"
    last_updated_at: "2026-07-13T11:44:19Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Tasks scaffolded from the 019 decomposition"
    next_safe_action: "Plan or execute this phase on the worktree when picked up"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Migrate config and data filenames

<!-- SPECKIT_LEVEL: 1 -->
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

- [ ] T001 Confirm predecessor phases landed and the execution worktree is clean (per this phase's spec adjacency)
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T002 Hyphenate in-scope snake_case `.json`/`.yaml`/`.yml` data/config filenames
- [ ] T003 Fix references/loaders that point at the renamed files
- [ ] T004 Final exemption reconciliation for stragglers
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T005 Verify: Zero in-scope underscore data/config filenames remain (excl exempt) — `git ls-files` finds 0 in-scope underscore `.json/.yaml/.yml` names
- [ ] T006 Verify: No JSON/YAML key was altered — Key diffs show 0 changed keys; only filenames moved
- [ ] T007 Verify: Loaders/config references resolve after the rename — Config-loading tests pass
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
