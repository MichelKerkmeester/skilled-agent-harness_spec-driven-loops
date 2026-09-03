---
title: "Tasks: Command Rollout-Mode Resolution"
description: "Task breakdown for deciding the deep/* rollout mode and clearing the stale contracts."
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/019-risky-followup-remediation/002-command-rollout-mode-resolution"
    last_updated_at: "2026-08-26T15:40:00.000Z"
    last_updated_by: "claude"
    recent_action: "Authored the rollout-mode task list"
    next_safe_action: "Execute Phase 1"
trigger_phrases: []
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

- [x] T001 Read `resolveMode` + `COMMANDS` in `scripts/render-command-contract.cjs`
- [x] T002 Find what selects `fix` vs `fallback` (env, manifest, constant)
- [x] T003 Check git history / rollout config for the intended deep/* default (`1904d343ea9`, `bce47507b6d`)
- [x] T004 Confirm the stale source docs are the current intended content (`compile-command-contracts.cjs`)
- [x] T005 Decide `fix` or `fallback` with the cited source of truth (`fallback`; `validate-rollout.cjs` governance)

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 (not taken) `fix` path would need a genuine evidence object per `validate-rollout.cjs` — out of scope
- [x] T007 `fallback` path taken: updated the stale `resolveMode('deep/review')` expectation to `fallback`
- [x] T008 Recompile all deep/* contracts (`compile-command-contracts.cjs --command … --write`)
- [x] T009 Confirm the compiled body matches the decided mode (`deep-review.contract.md`)

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 `check-contract-drift.vitest.ts` passes (no `STALE_SOURCE_DIGEST`)
- [x] T011 `render-command-contract.vitest.ts` passes; `resolveMode('deep/review')` = `fallback`
- [x] T012 `legacy-projections.test.ts` still passes
- [x] T013 `validate-rollout.test.cjs` (node:test) passes — the gate the first attempt missed (`run-node-tests.mjs`)
- [x] T014 Whole runtime suite vs 017 baseline: no new failures (`vitest run`, 2612 tests)
- [x] T015 `validate.sh --strict` clean; reconcile docs

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Intended mode decided + recorded
- [x] Tests + config agree on the mode
- [x] Stale contracts cleared
- [x] No new whole-suite regression

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Parent**: `../spec.md`

<!-- /ANCHOR:cross-refs -->
