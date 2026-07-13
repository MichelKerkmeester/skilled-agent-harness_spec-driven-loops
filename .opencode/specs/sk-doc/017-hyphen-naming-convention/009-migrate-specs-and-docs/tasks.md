---
title: "Tasks: migrate specs and docs (019 phase 009)"
description: "Tasks for phase 009 of the 019 kebab-case filesystem-naming program: migrate specs and docs."
trigger_phrases:
  - "migrate specs and docs tasks"
  - "hyphen naming phase 009 tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/009-migrate-specs-and-docs"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/009-migrate-specs-and-docs"
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
# Tasks: Migrate specs and docs

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

- [ ] T002 Hyphenate in-scope snake_case `.md` and doc filesystem names outside frozen surfaces
- [ ] T003 Rewrite doc cross-references to the renamed paths
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T004 Verify: Zero in-scope underscore doc filenames remain outside frozen surfaces — `git ls-files` finds 0 in-scope underscore doc names (excl frozen)
- [ ] T005 Verify: Frozen surfaces are untouched — No change under `z_archive/`, changelogs, or completed history
- [ ] T006 Verify: Doc cross-references resolve after the rename — Markdown-link guard is clean
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
