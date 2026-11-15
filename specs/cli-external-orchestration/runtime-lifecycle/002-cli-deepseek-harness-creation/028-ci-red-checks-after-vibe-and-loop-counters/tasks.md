---
title: "Tasks: Phase 28: ci-red-checks-after-vibe-and-loop-counters"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "ci red checks after vibe and loop counters tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 28: ci-red-checks-after-vibe-and-loop-counters

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read each failure in CI runs 43727070144 and 43727070084. Verify: the five causes match the Measured Behavior block.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Ignore private Vibe stubs and untrack the one (`.gitignore`). Verify: `git check-ignore -v` names the new rule for the stub.
- [x] T003 Add the six provenance lines (`plugins-and-hooks/*.md`). Verify: `playbook-provenance-paths.vitest.ts` passes.
- [x] T004 Point the `deep` contract at one workflow (`command-contract.json`). Verify: the router check prints `clean=42`.
- [x] T005 Resolve tsx in the script branch only (`convergence.cjs`). Verify: the reducer test passes with tsx moved away.
- [x] T006 Expect 118 bindings (`hook-registration-sync.vitest.ts`). Verify: the test passes.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Run the CLI vitest project. Verify: 210 files pass, 0 fail.
- [x] T008 Run the Vibe mirror checks and the deep-loop convergence suites. Verify: all pass.
- [x] T009 Validate this phase and its parent. Verify: `validate.sh --strict` prints `RESULT: PASSED` for both.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
