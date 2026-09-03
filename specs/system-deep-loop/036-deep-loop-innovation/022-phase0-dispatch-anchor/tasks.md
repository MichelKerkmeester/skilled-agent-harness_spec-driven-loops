---
title: "Tasks: Objective Dispatch-Context Anchor for the deep/* Phase-0 Gate"
description: "Task breakdown for adding the DISPATCH-CONTEXT authorization to the injection prefix."
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/022-phase0-dispatch-anchor"
    last_updated_at: "2026-08-27T05:20:00.000Z"
    last_updated_by: "claude"
    recent_action: "Implemented + verified; tasks complete"
    next_safe_action: "Reconcile docs; commit"
trigger_phrases: []
---
# Tasks: Objective Dispatch-Context Anchor for the deep/* Phase-0 Gate

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

- [x] T001 Render `deep/review` and confirm the `ARGS_PRESENT` prefix precedes the Phase-0 gate
- [x] T002 Confirm the no-message render omits the message block (the pasted-inline shape) (`ARGS_PRESENT=false`)
- [x] T003 Confirm the injection `COMMANDS` map covers only `review`/`research`/`ai-council`/`alignment`

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add the DISPATCH-CONTEXT authorization to the `present` branch of `buildInvocationPrefix`
- [x] T005 Keep the authorization out of the no-message branch (`if (present)`)
- [x] T006 Reword the code comment to avoid the phase-id hygiene trigger (`check-comment-hygiene.sh`)
- [x] T007 Add the regression test (present-real / absent-pasted-inline, ahead of body) (`render-command-contract.vitest.ts`)
- [x] T008 Insert the OBJECTIVE OVERRIDE ahead of `CHECK:` in all 4 injected legacy bodies (`deep-review.body.md` et al.)
- [x] T009 Confirm the override renders ahead of the gate (`render-command-contract.cjs`) and legacy bodies are not contract sources

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 `render deep/review`: `DISPATCH-CONTEXT` present before `PHASE 0` (`grep -n`)
- [x] T009 `render deep/review` no-args: authorization absent (count 0)
- [x] T010 Comment hygiene clean (`check-comment-hygiene.sh` exit 0)
- [x] T011 `check-contract-drift` green (contracts not staled, no recompile)
- [x] T012 `run-node-tests.mjs`: no new failures; runtime vitest suite: no new failures
- [x] T013 `validate.sh --strict` clean; reconcile docs

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Authorization renders ahead of the gate for a real invocation
- [x] No-message render omits it; pasted-inline guard preserved
- [x] No new whole-suite regression on either gate; no contract recompile
- [x] Docs validated

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Parent**: `../spec.md`

<!-- /ANCHOR:cross-refs -->
