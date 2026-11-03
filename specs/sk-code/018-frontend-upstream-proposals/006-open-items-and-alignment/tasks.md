---
title: "Tasks: Phase 6: open-items-and-alignment"
description: "Five open-item fixes, then an alignment run on the touched skills fixed until a recheck is clean."
trigger_phrases:
  - "open items and alignment tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 6: open-items-and-alignment

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`CR` is `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/009-sk-design/lib/canary-router.cjs`. `LSA` is `/local-skilled-alignment`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Merge main into the branch and re-mint the conflicted manifests (`5117366374`). Verify: all seven hubs report `compiled-serving` and `fresh`.
- [ ] T002 Write the alignment executor config with every lane and the critic on `opencode-go/deepseek-v4.1-flash` (`scratch/alignment-executors.json`). Verify: `rg -c llmgateway scratch/alignment-executors.json` prints 0.
- [ ] T003 Run `LSA` over the branch, its own commits only, against `origin/main` (`scratch/alignment-1/`). Verify: `report.md` and `findings.json` exist.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Re-pin `LIVE_CORPUS_SIZE` at the live count (`.skilled/bin/tests/compiled-route-admission.test.cjs`). Verify: the admission suite reports `fail 0`.
- [ ] T005 Define the tie comparator in `CR` and its served copy, and add a same-mode tie test (`.skilled/bin/tests/compiled-route-sk-design-tie.test.cjs`). Verify: the test passes, and fails with the fix reverted.
- [ ] T006 Print a plan-only line in the save summary when the mode is not `full-auto`, with a vitest (`core/workflow.ts`). Verify: the vitest passes, and fails with the fix reverted.
- [ ] T007 Add the system-spec-kit changelog entry and bump `SKILL.md` (`system-spec-kit/changelog/`). Verify: the entry names the trigger-index warning and the plan-only line.
- [ ] T008 Record DeepSeek V4.1 Flash on opencode-go as the build executor in the parent goal (`../goal.md`). Verify: `goal.cjs packet` prints `packet_budget=ok`.
- [ ] T009 Fix every finding `LSA` confirms on a touched skill (the files its `fix-plan.md` names). Verify: each fix is listed against its finding id in `scratch/alignment-fixes.md`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Run `LSA --recheck` on the first run (`scratch/alignment-1/recheck.md`). Verify: no finding on a touched skill is still open.
- [ ] T011 Run the compiled-route, sk-create-skill and trigger-index suites and the sync check (`scratch/final-suites.txt`). Verify: every suite reports `fail 0`.
- [ ] T012 Run reach on every hub at concurrency 2 (`scratch/reach-final.txt`). Verify: every hub prints `outranked=  0` and `wrong-hub=  0`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] The alignment recheck lists no open finding on a touched skill
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
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

A finding on a skill this packet did not touch is listed in `scratch/alignment-fixes.md` as out of scope, never fixed here.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] The opencode-go DeepSeek route answers through both `pi` and `opencode`
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `npx tsc --noEmit` passes for the system-spec-kit CLI after the workflow change
- [ ] CHK-011 [P1] No code comment carries a packet, phase, task or finding id
- [ ] CHK-012 [P1] Each open item lands as its own commit
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] The tie and plan-only tests fail with their fixes reverted
- [ ] CHK-022 [P1] More than two tied same-mode intents sort by intent name
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No credential path is read or written
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Each touched skill's changelog records its alignment fixes
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Alignment run folders live under `scratch/` and nothing writes outside the worktree
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 6 | 0/6 |
| P1 Items | 7 | 0/7 |
| P2 Items | 0 | 0/0 |

**Verification Date**: Not yet verified
<!-- /ANCHOR:summary -->

---
