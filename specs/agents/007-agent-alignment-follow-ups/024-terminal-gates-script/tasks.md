---
title: "Tasks: Phase 24: terminal-gates-script"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "terminal gates script tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 24: terminal-gates-script

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
`RT` is `.skilled/skills/system-deep-loop/runtime`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Baseline the runtime suite and typecheck (`$RT`). Verify: both print totals.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Add `terminal-gates.cjs`, its unit test and the two exports (`$RT/scripts/terminal-gates.cjs`, `$RT/tests/unit/terminal-gates.vitest.ts`, `$RT/scripts/convergence.cjs`). Verify: the test passes and typecheck exits 0.
- [x] T003 Make `record_terminal_gates` run the script and recompile the contracts (`.skilled/commands/deep/assets/deep-review.yaml`). Verify: the YAML parses and `check-contract-drift.cjs` passes.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T004 Run the script on recorded review packets, then the full suite and typecheck (`$RT`). Verify: three rows per packet; no test that passed at baseline fails.
- [x] T005 Run strict validation on the parent and its children (`spec.md`). Verify: `RESULT: PASSED` for every folder.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] The terminal gates are computed, not judged
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Origin**: gap 1 of the earlier analysis, recorded as a known limitation in phase 16's implementation summary
<!-- /ANCHOR:cross-refs -->
