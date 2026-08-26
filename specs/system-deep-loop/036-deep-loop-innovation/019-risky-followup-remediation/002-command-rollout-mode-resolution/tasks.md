---
title: "Tasks: Command Rollout-Mode Resolution"
description: "Task breakdown for deciding the deep/* rollout mode and clearing the stale contracts."
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/019-risky-followup-remediation/002-command-rollout-mode-resolution"
    last_updated_at: "2026-08-26T11:05:01.338Z"
    last_updated_by: "claude"
    recent_action: "Authored the rollout-mode task list"
    next_safe_action: "Execute Phase 1"
---
# Tasks: Command Rollout-Mode Resolution

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[B]` | Blocked |

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Read `resolveMode` + `COMMANDS` in `scripts/render-command-contract.cjs`
- [ ] T002 Find what selects `fix` vs `fallback` (env, manifest, constant)
- [ ] T003 Check git history / rollout config for the intended deep/* default
- [ ] T004 Confirm the stale source docs are the current intended content
- [ ] T005 Decide `fix` or `fallback` with the cited source of truth

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T006 If `fix`: correct the compiler/config so recompile keeps `fix`
- [ ] T007 If `fallback`: update the `resolveMode` expectation in the test
- [ ] T008 Recompile all deep/* contracts (`compile-command-contracts.cjs --command … --write`)
- [ ] T009 Confirm the compiled body matches the decided mode

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 `check-contract-drift.vitest.ts` passes (no `STALE_SOURCE_DIGEST`)
- [ ] T011 `render-command-contract.vitest.ts` passes; `resolveMode` = decided mode
- [ ] T012 `legacy-projections.test.ts` still passes
- [ ] T013 Whole runtime suite vs 017 baseline: no new failures
- [ ] T014 `validate.sh --strict` clean; reconcile docs

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] Intended mode decided + recorded
- [ ] Tests + config agree on the mode
- [ ] Stale contracts cleared
- [ ] No new whole-suite regression

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Parent**: `../spec.md`

<!-- /ANCHOR:cross-refs -->
