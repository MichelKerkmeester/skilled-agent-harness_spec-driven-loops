---
title: "Tasks: migrate scripts and imports (017 phase 011)"
description: "Tasks for phase 011 of the 017 kebab-case filesystem-naming program: migrate scripts and imports."
trigger_phrases:
  - "migrate scripts and imports tasks"
  - "hyphen naming phase 011 tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/011-migrate-scripts-and-imports"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/011-migrate-scripts-and-imports"
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
# Tasks: Migrate scripts and imports

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

- [ ] T002 Rename in-scope snake_case script filenames to hyphens, in dependency-closed batches
- [ ] T003 Fix every `import`/`require`/`source`/registry/config reference to the renamed files in the same pass
- [ ] T004 Shared dispatch/runtime scripts form their own cross-cutting batch
- [ ] T005 Rebuild affected dist and confirm resolution; disposition every dynamic site
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 Verify: Zero in-scope underscore script filenames remain (excl .py/vendored/generated) — `git ls-files` finds 0 in-scope underscore `.ts/.js/.cjs/.mjs/.sh` names
- [ ] T007 Verify: Every import/require/source/registry reference resolves after the rename — Whole-repo import resolution reports 0 broken references
- [ ] T008 Verify: Every dynamic require/source/glob site is dispositioned — The disposition ledger has no un-handled dynamic site in the touched batch
- [ ] T009 Verify: Affected builds pass and syntax checks are clean — `node --check`, `bash -n`, `tsc`/build, and tests for touched packages pass
- [ ] T010 Verify: Test discovery counts equal the 000 baseline — Discovered test files + cases match the baseline after the rename
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
