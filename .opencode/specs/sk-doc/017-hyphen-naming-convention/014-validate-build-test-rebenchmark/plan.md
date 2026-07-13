---
title: "Implementation Plan: validate, build, test, re-benchmark (017 phase 014)"
description: "Implementation Plan for phase 014 of the 017 kebab-case filesystem-naming program: validate, build, test, re-benchmark."
trigger_phrases:
  - "validate, build, test, re-benchmark implementation plan"
  - "hyphen naming phase 014 implementation plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/014-validate-build-test-rebenchmark"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/014-validate-build-test-rebenchmark"
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
# Implementation Plan: Validate, build, test, re-benchmark

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | sk-doc + repo (phase 014) |
| **Change class** | Whole-repo gate |
| **Execution** | Isolated worktree pinned to BASE (established in phase 000) |

### Overview
After the surface-by-surface migration, the whole repo must be proven green against the 000 baseline: the `--all` naming guard, all build/test/typecheck gates with discovery-count parity, whole-repo import + path + link resolution, recursive strict validation, and a fixed-seed Lane C re-baseline with no regression — all without mutating any tracked file.. Detailed design is finalized when this phase is picked up for execution against the pinned baseline.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The `--all` guard reports zero in-scope snake_case names (scope-aware)
- [ ] All build/test/typecheck gates pass with discovery-count parity
- [ ] Whole-repo import/path/link resolution shows 0 broken references
- [ ] Recursive strict validation is Errors 0 across touched skills
- [ ] Lane C shows no scoring regression vs the pinned baseline
- [ ] Verification mutates no tracked file

### Definition of Done
- [ ] Whole repo is green post-migration
- [ ] No benchmark, import, or discovery regression
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- Run the `--all` naming guard (0 in-scope snake_case remain, scope-aware).
- Every affected build/typecheck/test suite, with test-discovery-count parity vs baseline.
- Whole-repo import + path-value + markdown-link resolution (target 0 broken).
- Recursive `validate.sh --strict` across touched skills.
- A fixed-seed Lane C re-baseline (semantic + score, compared by ID) vs the 000 snapshot.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm predecessor phases landed; verify the worktree is clean, pinned to BASE, and scoped.

### Phase 2: Implementation
- Run the `--all` naming guard (0 in-scope snake_case remain, scope-aware).
- Every affected build/typecheck/test suite, with test-discovery-count parity vs baseline.
- Whole-repo import + path-value + markdown-link resolution (target 0 broken).
- Recursive `validate.sh --strict` across touched skills.
- A fixed-seed Lane C re-baseline (semantic + score, compared by ID) vs the 000 snapshot.

### Phase 3: Verification
- The whole-tree guard passes and rejects a planted violation
- Discovered test files + cases equal the 000 baseline; suites green
- The rename-map-driven checker + link resolver report 0 broken
- `validate.sh --recursive --strict` Errors 0
- Scenario IDs + semantics + scores match the 000 snapshot within tolerance
- `git diff-index --quiet HEAD --` after the gate
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | The whole-tree guard passes and rejects a planted violation |
| REQ-002 | Discovered test files + cases equal the 000 baseline; suites green |
| REQ-003 | The rename-map-driven checker + link resolver report 0 broken |
| REQ-004 | `validate.sh --recursive --strict` Errors 0 |
| REQ-005 | Scenario IDs + semantics + scores match the 000 snapshot within tolerance |
| REQ-006 | `git diff-index --quiet HEAD --` after the gate |
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
