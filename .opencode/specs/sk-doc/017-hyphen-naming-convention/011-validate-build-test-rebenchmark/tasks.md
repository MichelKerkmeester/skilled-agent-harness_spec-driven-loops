---
title: "Tasks: validate, build, test, re-benchmark (019 phase 011)"
description: "Tasks for phase 011 of the 019 kebab-case filesystem-naming program: validate, build, test, re-benchmark."
trigger_phrases:
  - "validate, build, test, re-benchmark tasks"
  - "hyphen naming phase 011 tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/011-validate-build-test-rebenchmark"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/011-validate-build-test-rebenchmark"
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
# Tasks: Validate, build, test, re-benchmark

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

- [ ] T002 Recursive `validate.sh --strict` on touched skills
- [ ] T003 Full build/test/typecheck gates
- [ ] T004 Whole-repo import + markdown-link resolution (target 0 broken)
- [ ] T005 Lane C re-baseline vs the pre-migration snapshot
- [ ] T006 Prove the no-new-snake guard fires
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Verify: Recursive strict validation is Errors 0 across touched skills — `validate.sh --recursive --strict` Errors 0
- [ ] T008 Verify: All build/test/typecheck gates pass and imports resolve — 0 broken imports; build + tests green
- [ ] T009 Verify: Lane C shows no scoring regression vs baseline — Scenario count unchanged; scores within tolerance
- [ ] T010 Verify: The no-new-snake guard fires on a synthetic violation — A planted snake_case name fails the guard
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
