---
title: "Tasks: validate, build, test, re-benchmark (017 phase 014)"
description: "Tasks for phase 014 of the 017 kebab-case filesystem-naming program: validate, build, test, re-benchmark."
trigger_phrases:
  - "validate, build, test, re-benchmark tasks"
  - "hyphen naming phase 014 tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/014-validate-build-test-rebenchmark"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/014-validate-build-test-rebenchmark"
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
# Tasks: Validate, build, test, re-benchmark

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

- [ ] T002 Run the `--all` naming guard (0 in-scope snake_case remain, scope-aware)
- [ ] T003 Every affected build/typecheck/test suite, with test-discovery-count parity vs baseline
- [ ] T004 Whole-repo import + path-value + markdown-link resolution (target 0 broken)
- [ ] T005 Recursive `validate.sh --strict` across touched skills
- [ ] T006 A fixed-seed Lane C re-baseline (semantic + score, compared by ID) vs the 000 snapshot
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Verify: The `--all` guard reports zero in-scope snake_case names (scope-aware) — The whole-tree guard passes and rejects a planted violation
- [ ] T008 Verify: All build/test/typecheck gates pass with discovery-count parity — Discovered test files + cases equal the 000 baseline; suites green
- [ ] T009 Verify: Whole-repo import/path/link resolution shows 0 broken references — The rename-map-driven checker + link resolver report 0 broken
- [ ] T010 Verify: Recursive strict validation is Errors 0 across touched skills — `validate.sh --recursive --strict` Errors 0
- [ ] T011 Verify: Lane C shows no scoring regression vs the pinned baseline — Scenario IDs + semantics + scores match the 000 snapshot within tolerance
- [ ] T012 Verify: Verification mutates no tracked file — `git diff-index --quiet HEAD --` after the gate
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
