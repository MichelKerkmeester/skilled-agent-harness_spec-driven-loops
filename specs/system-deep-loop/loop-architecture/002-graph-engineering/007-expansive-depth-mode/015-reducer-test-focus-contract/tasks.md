---
title: "Tasks: Phase 15: reducer-test-focus-contract"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "reducer test focus contract tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 15: reducer-test-focus-contract

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`T` is `.skilled/skills/system-spec-kit/runtime/cli/tests/deep-research-reducer.vitest.ts`. Commands run from `.opencode/skills/system-spec-kit/runtime/cli`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Reproduce the failure (`T`). Verify: `npx vitest run --config ../../vitest.config.ts --project cli tests/deep-research-reducer.vitest.ts` prints `Tests  3 failed | 10 passed (13)`.
- [x] T002 Bisect to the phase 004 commit (`deep-research/scripts/reduce-state.cjs`, `continuity-thread.cjs`). Verify: the same command prints `13 passed` at the commit's parent and `3 failed` at the commit.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Expect `Question C` as Next Focus in the idempotent-output case (`T`). Verify: `rg -n "NEXT FOCUS..nQuestion C'" T` lists that case's line.
- [x] T004 Set the second-iteration `## Recommended Next Focus` to `Question B` in the answer-seeded and fallback cases (`T`). Verify: `git diff -U0 T` shows no other changed `expect(` line.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Run the reducer test file (`T`). Verify: prints `Tests  13 passed (13)`.
- [x] T006 Run the full CLI project (`--project cli`). Verify: 0 failed, same total as the baseline.
- [x] T007 Validate this packet and its parent. Verify: `validate.sh --strict` prints `RESULT: PASSED` for both.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] The full CLI project reports 0 failed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Contract source**: `../004-focus-hijack-fix/spec.md`
<!-- /ANCHOR:cross-refs -->

---
