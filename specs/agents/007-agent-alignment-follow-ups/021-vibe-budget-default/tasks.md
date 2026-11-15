---
title: "Tasks: Phase 21: vibe-budget-default"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "vibe budget default tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 21: vibe-budget-default

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

- [x] T001 Capture the full deep-loop suite as the baseline (`$RT`). Verify: `npm test` prints a `Tests` totals line.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Prefer the Vibe sign-in key for a `cli-mistral-vibe` lineage (`$RT/lib/deep-loop/executor-audit.ts`, `$RT/tests/unit/executor-audit.vitest.ts`). Verify: `npx vitest run tests/unit/executor-audit.vitest.ts` passes and `npm run typecheck` exits 0.
- [x] T003 [P] Count a Mistral budget refusal as a quota stop (`$RT/scripts/lib/cli-guards.cjs`, `$RT/tests/unit/cli-guards-needs-input.vitest.ts`). Verify: `npx vitest run tests/unit/cli-guards-needs-input.vitest.ts` passes.
- [x] T004 Add the budget marker to `classifyExecutorUnavailable` (`$RT/lib/deep-loop/executor-audit.ts`). Verify: the marker table test passes.
- [x] T005 Update the Mistral billing and key notes (cli-mistral-vibe, cli-pi, cli-opencode, spec-kit `ENV-REFERENCE.md` and `.env.example`). Verify: `rg -n "sign-in key"` finds each note.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Rerun the full suite and typecheck (`$RT`). Verify: no test that passed at baseline fails.
- [x] T007 Run strict validation on the parent and its children (`spec.md`). Verify: `RESULT: PASSED` for every folder.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] The suite delta against baseline is only the new tests
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Origin**: phase 20 run findings V1 and V2, and the operator's "Both (Recommended)" answer of 2026-11-15
<!-- /ANCHOR:cross-refs -->
