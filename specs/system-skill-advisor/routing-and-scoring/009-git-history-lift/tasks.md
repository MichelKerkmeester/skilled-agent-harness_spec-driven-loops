---
title: "Tasks: Let read-only git history questions route to sk-git by lifting them off the advisor's read-only floor"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "git history lift tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Let read-only git history questions route to sk-git by lifting them off the advisor's read-only floor

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

`A` is `.skilled/skills/system-skill-advisor/runtime`. Run every `npx` and `npm` command from `A`. `ADV` is `node .skilled/bin/skill-advisor.cjs advisor_recommend --format json --json`, run from the repository root.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the assertion to move is present (`A/tests/scorer/route-gates.vitest.ts`). Verify: `rg -c "list the git branches" A/tests/scorer/route-gates.vitest.ts` prints 1.
- [x] T002 Confirm the scorer tests pass before any edit (`A/tests/scorer/route-gates.vitest.ts`). Verify: `npx vitest run tests/scorer/route-gates.vitest.ts` exits 0.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add the guarded sk-git block from `plan.md` as the last check in `readOnlyRouteAllowed` (`A/lib/scorer/fusion.ts`). Verify: `rg -c "skillId === 'sk-git' && isReadOnlyExplainer" A/lib/scorer/fusion.ts` prints 1.
- [x] T004 Change the bare-suffix assertion to `readOnlyRouteAllowed('list the doc templates', skill('sk-doc'))` (`A/tests/scorer/route-gates.vitest.ts`). Verify: `rg -c "list the git branches" A/tests/scorer/route-gates.vitest.ts` prints nothing and exits 1.
- [x] T005 Add one test that expects true for the three REQ-001 prompts and one that expects false for the four REQ-002 prompts (`A/tests/scorer/route-gates.vitest.ts`). Verify: `rg -c "decision tree branches" A/tests/scorer/route-gates.vitest.ts` prints 1.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Run the scorer tests (`A/tests/scorer/route-gates.vitest.ts`). Verify: `npx vitest run tests/scorer/route-gates.vitest.ts` exits 0.
- [x] T007 Run the type check (`A/tsconfig.build.json`). Verify: `npm run typecheck` exits 0.
- [x] T008 Run the whole advisor suite (`A/package.json`). Verify: `npm test` exits 0.
- [x] T009 Run the divergence ratchet (`A/tests/parity/local-native-divergence-ratchet.vitest.ts`). Verify: `npx vitest run tests/parity/local-native-divergence-ratchet.vitest.ts` exits 0.
- [x] T010 Rebuild the advisor and probe a lifted prompt (`A/package.json`). Verify: after `npm run build`, `ADV '{"prompt":"show me what changed in the last three commits"}'` prints a recommendation whose `skillId` is `sk-git`.
- [x] T011 Probe a prompt that must stay floored (`A/lib/scorer/fusion.ts`). Verify: `ADV '{"prompt":"explain how the decision tree branches are pruned"}'` prints an empty `recommendations` list.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] `npm test` in `A` exits 0 with the lift in place
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
