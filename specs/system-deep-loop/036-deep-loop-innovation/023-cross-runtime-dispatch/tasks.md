---
title: "Tasks: Retire the deep/* Dispatch-Context (Phase-0) Gate"
description: "Task breakdown for removing the in-prompt Phase-0 self-classification gate across all deep/* commands."
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/023-cross-runtime-dispatch"
    last_updated_at: "2026-08-27T07:25:00.000Z"
    last_updated_by: "claude"
    recent_action: "Implemented + reconciled contracts; tasks complete pending whole-suite gates"
    next_safe_action: "Run whole-suite gates; commit"
---
# Tasks: Retire the deep/* Dispatch-Context (Phase-0) Gate

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

- [x] T001 Enumerate every on-disk copy of `PHASE 0: DISPATCH-CONTEXT CHECK` (8 deep + improve + 4 legacy)
- [x] T002 Enumerate every consumer of `general_agent_verified` + `dispatch_context_verified`; classify executable vs doc-only
- [x] T003 Confirm no auto/confirm YAML branches on either variable in `commands/deep/assets/*.yaml` (0 executable consumers)
- [x] T004 Confirm the harness guard is wired + deterministic (`system-deep-loop-guard.js`, `dispatch-guard.cjs`)

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Script the uniform Phase-0 block removal across all 13 files (boundary: `### PHASE 0` → `### MANDATORY INPUT GATE`)
- [x] T006 Trim the ROUTER-CONTRACT dispatch-context clauses in `review.md`, `alignment.md`, `ai-council.md`, + legacy mirrors
- [x] T007 Reword the Gate 1/Gate 2 sentences to reference only the remaining setup gate in `research.md`, `ai-council.md`, `skill-benchmark.md`, + legacy mirrors
- [x] T008 Remove the "Run Phase 0" FIRST-ACTION items and renumber in `research.md`, `agent-improvement.md`, `model-benchmark.md`, `skill-benchmark.md`, + legacy research
- [x] T009 Remove `general_agent_verified` / `dispatch_context_verified` from YAML-START-CONDITION lists + input-table rows (agent-improvement, model-benchmark, skill-benchmark, command-benchmark, improve)
- [x] T010 Drop the "confirm the PHASE 0 dispatch-context check" workflow steps (`prompt_improve_auto.yaml`, `prompt_improve_confirm.yaml`)
- [x] T011 Clean the 3 presentation gate-display references in `deep-agent-improvement-presentation.txt`, `deep-model-benchmark-presentation.txt`, `deep-skill-benchmark-presentation.txt`
- [x] T012 Drop "Dispatch-context checks" from `legacy/README.md`
- [x] T013 Revert the dormant 022 DISPATCH-CONTEXT authorization in `render-command-contract.cjs` + its regression test

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Recompile the 4 injection-command contracts (`compile-command-contracts.cjs --command <c> --write`)
- [x] T015 Grep audit: 0 gate markers under `commands/deep/` + `commands/prompt/`
- [x] T016 `render-command-contract.vitest.ts` + `check-contract-drift.vitest.ts` green (24/24)
- [x] T017 Comment hygiene clean on `render-command-contract.cjs`
- [x] T018 Both whole-suite gates: no new code-caused failures vs baseline (`run-node-tests.mjs` 767 pass / 17 fail == baseline 767/17; `fanout.vitest.ts` 1 fail == baseline 1 fail)
- [x] T019 `validate.sh <packet> --strict` clean (0 errors / 0 warnings); reconcile docs

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Gate removed from every command surface + legacy bodies + presentations
- [x] Dormant 022 render layer + test reverted; contracts recompiled fresh
- [x] No new whole-suite regression on either gate
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
