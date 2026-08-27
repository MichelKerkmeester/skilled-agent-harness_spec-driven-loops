---
title: "Verification Checklist: Retire the deep/* Dispatch-Context (Phase-0) Gate"
description: "Verification evidence for retiring the in-prompt Phase-0 self-classification gate across all deep/* commands."
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/023-cross-runtime-dispatch"
    last_updated_at: "2026-08-27T07:25:00.000Z"
    last_updated_by: "claude"
    recent_action: "Verified grep-clean + render/drift green; whole-suite gates pending"
    next_safe_action: "Run whole-suite gates; commit"
---
# Verification Checklist: Retire the deep/* Dispatch-Context (Phase-0) Gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Full inventory of gate copies + output-variable consumers taken
  - **Evidence**: `rg -l "PHASE 0: DISPATCH-CONTEXT CHECK"` = 8 deep + improve + 4 legacy; consumer scan classified all `general_agent_verified`/`dispatch_context_verified` refs
- [x] CHK-002 [P0] Zero executable consumers of the gate output confirmed
  - **Evidence**: `rg general_agent_verified|dispatch_context_verified commands/deep/assets/*.yaml` = 0 matches; only doc + the dormant render.cjs/test
- [x] CHK-003 [P1] Harness guard confirmed as the deterministic replacement
  - **Evidence**: `system-deep-loop-guard.js` fires `tool.execute.before`; `dispatch-guard.cjs:isCommandDrivenIteration` reads on-disk `deep-review-config.json`

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The gate is removed from every command surface
  - **Evidence**: grep audit returns 0 gate markers under `commands/deep/` + `commands/prompt/`
- [x] CHK-011 [P1] Comment hygiene clean
  - **Evidence**: `check-comment-hygiene.sh` on `render-command-contract.cjs` exit 0

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Render prefix no longer emits the authorization
  - **Evidence**: `render-command-contract.vitest.ts` passes with the 022 assertion block removed
- [x] CHK-021 [P0] Contracts fresh, no drift
  - **Evidence**: `check-contract-drift.vitest.ts` green after recompiling the 4 contracts
- [x] CHK-022 [P1] No new whole-suite regression on either gate
  - **Evidence**: `run-node-tests.mjs` 767 pass / 17 fail == baseline 767/17 (same 2 pre-existing contract failures); `fanout.vitest.ts` 1 fail == baseline 1 fail

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-024 [P0] Setup-contract residue cleaned
  - **Evidence**: `general_agent_verified`/`dispatch_context_verified` removed from YAML-START lists, input-table rows, Phase-Output lists, and the 2 `prompt_improve` workflow steps
- [x] CHK-025 [P1] Legacy bodies + presentations reconciled
  - **Evidence**: 4 legacy bodies + 3 presentations cleaned; `legacy/README.md` responsibility list updated
- [x] CHK-026 [P1] Out-of-scope Phase-0s left intact
  - **Evidence**: `create/*` @markdown Phase-0 and `doctor/*`/`speckit/*` phase labels untouched

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P1] Dispatch-integrity protection preserved
  - **Evidence**: the harness guard (`dispatch-guard.cjs`) is unchanged and remains the deterministic, model-independent enforcement

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] The WHY is durable and hygiene-clean
  - **Evidence**: `spec.md`/`plan.md` record why the gate is unfixable-in-prompt + redundant; `check-comment-hygiene.sh` exit 0 (no ephemeral ids in code comments)

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Scoped diff — command docs + legacy + presentations + 2 YAML + render.cjs/test + 4 recompiled contracts
  - **Evidence**: `git status` confined to the files named in spec §3

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 6 | 6/6 |
| P1 Items | 8 | 8/8 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-08-27
**Verified By**: claude (conductor)

<!-- /ANCHOR:summary -->
