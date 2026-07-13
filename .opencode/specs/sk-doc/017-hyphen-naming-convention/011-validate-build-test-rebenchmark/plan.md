---
title: "Implementation Plan: validate, build, test, re-benchmark (019 phase 011)"
description: "Implementation Plan for phase 011 of the 019 kebab-case filesystem-naming program: validate, build, test, re-benchmark."
trigger_phrases:
  - "validate, build, test, re-benchmark implementation plan"
  - "hyphen naming phase 011 implementation plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/011-validate-build-test-rebenchmark"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/011-validate-build-test-rebenchmark"
    last_updated_at: "2026-07-13T11:44:19Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Plan scaffolded from the 019 decomposition"
    next_safe_action: "Plan or execute this phase on the worktree when picked up"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Validate, build, test, re-benchmark

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | sk-doc + repo (phase 011) |
| **Change class** | Validation gate |
| **Execution** | Worktree (established in phase 005) |

### Overview
After the surface-by-surface migration, the whole repo must be proven green: recursive strict validation, all build/test/typecheck gates, whole-repo import + link resolution, and a Lane C benchmark re-baseline with no regression, plus proof the guard fires.. Detailed design is finalized when this phase is picked up for execution.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Recursive strict validation is Errors 0 across touched skills
- [ ] All build/test/typecheck gates pass and imports resolve
- [ ] Lane C shows no scoring regression vs baseline
- [ ] The no-new-snake guard fires on a synthetic violation

### Definition of Done
- [ ] Whole repo is green post-migration
- [ ] No benchmark or import regression
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- Recursive `validate.sh --strict` on touched skills.
- Full build/test/typecheck gates.
- Whole-repo import + markdown-link resolution (target 0 broken).
- Lane C re-baseline vs the pre-migration snapshot.
- Prove the no-new-snake guard fires.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm predecessor phases landed; verify the worktree is clean and scoped.

### Phase 2: Implementation
- Recursive `validate.sh --strict` on touched skills.
- Full build/test/typecheck gates.
- Whole-repo import + markdown-link resolution (target 0 broken).
- Lane C re-baseline vs the pre-migration snapshot.
- Prove the no-new-snake guard fires.

### Phase 3: Verification
- `validate.sh --recursive --strict` Errors 0
- 0 broken imports; build + tests green
- Scenario count unchanged; scores within tolerance
- A planted snake_case name fails the guard
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | `validate.sh --recursive --strict` Errors 0 |
| REQ-002 | 0 broken imports; build + tests green |
| REQ-003 | Scenario count unchanged; scores within tolerance |
| REQ-004 | A planted snake_case name fails the guard |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Inherits the 019 program dependencies: the Lane C benchmark harness (regression check), the spec-kit validator
(rebuilt in the worktree), and sk-git for the worktree lifecycle. Phase-specific dependencies are the predecessor
phases named in this phase's spec adjacency.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

All work lands on the dedicated worktree in path-scoped commits, so `git revert` of this phase's commits restores the
prior state. No data migration is involved — filesystem renames and reference rewrites are fully git-reversible.
<!-- /ANCHOR:rollback -->
