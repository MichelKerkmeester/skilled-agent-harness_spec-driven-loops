---
title: "Tasks: deep-loop-test-debt"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "deep loop test debt"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: deep-loop-test-debt

<!-- SPECKIT_LEVEL: 1 -->
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

- [ ] T001 Baseline: run the deep-loop runtime vitest suite and `tsc --noEmit`; record every failing file and error count (`.opencode/skills/system-deep-loop/runtime`)
- [x] T002 Baseline: run the four named spec-kit CLI tests under the projects config and capture the failure text (`.opencode/skills/system-spec-kit/runtime/cli/tests`) — council: `seat-003-native.md` expected while the fixture's seat 003 is `cli-opencode`, and `OUT_OF_SCOPE_WRITE` for a payload inside a not-yet-created council root; reducer: expected a throw the 016 audit had deliberately replaced with a warning; restart contract: missing invocation literals in the command doc plus assertions on runner identifiers a committed refactor removed
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Fix the council persist-artifacts containment check and fixture vantage at the producer (`.opencode/skills/system-deep-loop/deep-ai-council/scripts/lib/persist-artifacts.cjs`) — the guard now accepts a nearest existing parent that is an ancestor of a not-yet-created council root, symlink safety unchanged; the test's seat filename follows the fixture's real executor and its payload path sits inside the council root. Council's own suite 28 of 28
- [x] T004 [P] Review reducer on a missing machine-owned strategy anchor — the committed contract (016 audit remediation, `ce22b194c8`) is warn-and-keep-output, not throw; the CLI-tree test encoded the superseded contract and now asserts the warning plus the computed registry. Producer unchanged
- [x] T005 [P] Expose restart as a first-class auto setup input in the deep-review command contract (`.opencode/commands/deep/review.md`) — the invocation literals `--restart|--lineage-mode=restart` and `--stop-policy=convergence|max-iterations` are named in prose, the compiled contract regenerated with `compile-command-contracts.cjs --write`, and the test's runner assertions follow the committed identifiers; mirrors in sync (169 of 169, agents 12 of 12)
- [ ] T006 Clear the runtime typecheck errors without changing runtime behavior (`.opencode/skills/system-deep-loop/runtime`)
- [ ] T007 Fix the remaining red files from the T001 baseline at their producers
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Rerun each named test and the whole deep-loop suite; all green
- [ ] T009 Rerun `tsc --noEmit`; exit 0
- [ ] T010 Record each test, root cause, and fix in `implementation-summary.md`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
