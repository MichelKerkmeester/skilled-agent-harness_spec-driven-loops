---
title: "Tasks: no-new-snake_case guard (032 phase 004)"
description: "Tasks for phase 004 of the 032 kebab-case filesystem-naming program: no-new-snake_case guard."
trigger_phrases:
  - "no-new-snake_case guard tasks"
  - "hyphen naming phase 004 tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/004-no-new-snake-guard"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/004-no-new-snake-guard"
    last_updated_at: "2026-07-13T13:10:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Tasks authored for the 032 phased tree"
    next_safe_action: "Execute this phase on the pinned worktree when picked up"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: No-new-snake_case guard

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

- [ ] T002 An exemption-aware no-new-snake_case guard honoring every exemption class
- [ ] T003 A `--changed-since $BASE` mode (fails only on newly-introduced in-scope snake_case) for use during migration
- [ ] T004 An `--all` mode (whole-tree) enabled after migration completes
- [ ] T005 Positive + negative fixtures proving both modes
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 Verify: The guard rejects a fresh in-scope snake_case name and accepts a hyphenated one — A synthetic snake_case file fails the guard; a hyphenated one passes
- [ ] T007 Verify: The guard honors every exemption class — A .py, package dir, vendored, generated, and tool-mandated name never trips the guard
- [ ] T008 Verify: The `--changed-since $BASE` mode only flags newly-introduced names — Pre-existing debt does not fail the changed-only mode
- [ ] T009 Verify: The `--all` mode flags the full in-scope debt — Running `--all` at BASE reports the census count
- [ ] T010 Verify: Positive and negative fixtures cover both modes — Fixture tests pass for changed-only and whole-tree modes
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
