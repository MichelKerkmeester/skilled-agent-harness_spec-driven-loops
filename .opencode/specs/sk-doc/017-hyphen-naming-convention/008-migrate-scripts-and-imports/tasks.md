---
title: "Tasks: migrate script filenames and imports (019 phase 008)"
description: "Tasks for phase 008 of the 019 kebab-case filesystem-naming program: migrate script filenames and imports."
trigger_phrases:
  - "migrate script filenames and imports tasks"
  - "hyphen naming phase 008 tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-migrate-scripts-and-imports"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-migrate-scripts-and-imports"
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
# Tasks: Migrate script filenames and imports

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

- [ ] T002 Rename in-scope snake_case script filenames to hyphens
- [ ] T003 Fix every `import`/`require`/`source`/registry/config path reference to the renamed files in the same pass
- [ ] T004 Rebuild affected dist and confirm resolution
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T005 Verify: Zero in-scope underscore script filenames remain (excl `.py`/vendored/generated) — `git ls-files` finds 0 in-scope underscore `.ts/.js/.cjs/.mjs/.sh` names
- [ ] T006 Verify: Every import/require/source/registry reference resolves after the rename — Whole-repo import resolution reports 0 broken references
- [ ] T007 Verify: Affected builds pass after the rename — `tsc`/build and test suites for touched packages pass
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
