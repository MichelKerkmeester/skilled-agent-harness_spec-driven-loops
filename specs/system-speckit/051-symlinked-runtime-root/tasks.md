---
title: "Tasks: Symlinked runtime: entry guard, project root and empty saves"
description: "The ordered work for making the entry guard hold under the symlink flag, resolving the project root from the caller's repository, and stopping an empty save from exiting 0."
trigger_phrases:
  - "symlinked runtime root tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Symlinked runtime: entry guard, project root and empty saves

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Add guard cases that spawn a child with `--preserve-symlinks-main` through a symlinked path, one executed and one imported (`runtime/tests/esm-entry-symlink.vitest.ts`)
- [ ] T002 [P] Add a save case that builds a temp git repository, links `.skilled` into it, and runs `generate-context.js` from there (`runtime/cli/tests/generate-context-linked-root.vitest.ts`)
- [ ] T003 [P] Add a save case whose input holds an empty `exchanges` array (`runtime/cli/tests/generate-context-linked-root.vitest.ts`)
- [ ] T004 Run all new cases against the current code, record that each fails, and take the suite baseline
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Canonicalize `import.meta.url` through `fileURLToPath` and `realpathSync`, falling back to the unresolved value, then compare (`runtime/cli/lib/esm-entry.ts`)
- [ ] T006 [P] Same change in the other two copies (`runtime/lib/esm-entry.ts`, `runtime/cli/lib/esm-entry.mjs`)
- [ ] T007 Inventory every reader of `CONFIG.PROJECT_ROOT` and mark each project-owned or runtime-owned
- [ ] T008 Derive `PROJECT_ROOT` from `git rev-parse --show-toplevel` in the working directory, falling back to the working directory, and leave runtime-owned paths script-relative (`runtime/cli/core/config.ts`)
- [ ] T009 Accept `--project-root` and pass it into `main` (`runtime/cli/continuity/generate-context.ts`)
- [ ] T010 Count empty-exchanges saves in recent hook logs, choose refuse or warn with non-zero exit, and implement it (`runtime/cli/core/workflow.ts`)
- [ ] T011 Rebuild the runtime and CLI workspaces so the committed `dist` output matches
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 Rerun the T004 cases and confirm each passes
- [ ] T013 Rerun the two probes from `AI Systems` with the flag and confirm output and exit match the run without it
- [ ] T014 Run both suites, both builds and both typechecks from the final state and account for the delta
- [ ] T015 Record the T010 choice and the T007 inventory in `implementation-summary.md`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Every acceptance row Met
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance**: See `acceptance-criteria.md`
- **Earlier fix**: `system-speckit/033-system-speckit-v4/039-entry-point-symlink-resolution`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks
- [ ] CHK-011 [P0] No console errors or warnings
- [ ] CHK-012 [P1] The guard never raises and the root lookup names its fallback on stderr
- [ ] CHK-013 [P1] Code follows project patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Each new case failed against the pre-change code
- [ ] CHK-022 [P1] Edge cases tested: subfolder working directory, worktree, outside any repository
- [ ] CHK-023 [P1] Error scenarios validated: missing `--project-root` directory, unresolvable module URL
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [ ] CHK-FIX-004 [P0] Path resolution has adversarial cases for symlinked, aliased, missing and outside-root paths.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] A `--project-root` outside the working directory's repository is refused
- [ ] CHK-032 [P1] No write lands outside the resolved project root
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] The guard's comment states what the code does, with no packet or phase numbers
- [ ] CHK-042 [P2] `generate-context.js --help` names `--project-root`
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 2/12 |
| P1 Items | 13 | 1/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-10-12
<!-- /ANCHOR:summary -->
