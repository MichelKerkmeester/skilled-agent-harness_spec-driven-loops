---
title: "Implementation Summary: Retire the deep/* Dispatch-Context (Phase-0) Gate"
description: "Final state and verification for retiring the in-prompt Phase-0 dispatch-context self-classification gate across all deep/* commands, relying on the deterministic harness guard for the genuine dispatch-integrity case."
trigger_phrases:
  - "phase 0 gate retirement summary"
  - "deep loop dispatch-context gate removed"
  - "DIRECT INVOCATION REQUIRED false block fixed"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/023-cross-runtime-dispatch"
    last_updated_at: "2026-08-27T07:25:00.000Z"
    last_updated_by: "claude"
    recent_action: "Removed the Phase-0 gate everywhere; reverted 022; recompiled contracts; render green"
    next_safe_action: "Commit; push v4 + main; then the executor-routing fix"
    blockers: []
    key_files:
      - ".opencode/commands/deep/review.md"
      - ".opencode/skills/system-deep-loop/runtime/scripts/render-command-contract.cjs"
      - ".opencode/plugins/system-deep-loop-guard.js"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The gate is unfixable in-prompt (classifies unobservable provenance; codex/pi genuine path is byte-identical to pasted-inline), defends a zero-occurrence case, and is redundant with the deterministic harness guard."
      - "Removing it is safe: 0 executable consumers of general_agent_verified / dispatch_context_verified; the harness guard remains the model-independent protection."
---
# Implementation Summary: Retire the deep/* Dispatch-Context (Phase-0) Gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 023-cross-runtime-dispatch |
| **Completed** | 2026-08-27 |
| **Level** | 2 |
| **Status** | Complete |
| **Actual Effort** | ~2.5 hours (inventory + 13-file script + ~30 prose edits + reconcile) |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

Retired the in-prompt Phase-0 dispatch-context gate across the entire deep/* command surface. The gate asked the orchestrating model to self-classify "real invocation vs pasted-inline" and hard-block on the pasted-inline case; capable orchestrators (GPT-5.6-Luna) false-blocked genuine `/deep:review` invocations because the classification is of provenance the model cannot observe — and on codex/pi the genuine path is byte-identical to a pasted-inline paste. A fresh Opus 5 architect review concluded the gate is unfixable in-prompt, unnecessary (the pasted-inline case occurs in zero code paths), and redundant with the deterministic harness guard, and recommended retiring it. This packet supersedes 022's marker-anchor approach, which was dormant (the render-injection path it patched is not wired into live opencode dispatch).

The genuine dispatch-integrity protection is unchanged: `.opencode/plugins/system-deep-loop-guard.js` fires at `tool.execute.before`, and `.opencode/hooks/task-dispatch/lib/dispatch-guard.cjs:isCommandDrivenIteration` validates against on-disk config in the plugin host — deterministic, with no model compliance involved. With the self-classification step gone, the genuine-invocation false-block disappears structurally for every runtime and model.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `commands/deep/{review,research,ai-council,alignment,agent-improvement,model-benchmark,skill-benchmark,command-benchmark}.md` | Modified | Removed the Phase-0 block + trimmed gate-referencing prose (renumbered FIRST-ACTION lists, reworded Gate 1/Gate 2 sentences) |
| `commands/prompt/improve.md` | Modified | Removed the Phase-0 block + dropped the dispatch-context ownership clause + input-table row |
| `commands/deep/assets/legacy/deep-{review,research,ai-council,alignment}.body.md` | Modified | Removed the Phase-0 block + trimmed prose (dormant assets, kept consistent) |
| `commands/deep/assets/deep-{agent-improvement,model-benchmark,skill-benchmark}-presentation.txt`, `deep-command-benchmark-presentation.txt` | Modified | Dropped the gate's Phase-Output bullet / display references |
| `commands/prompt/assets/prompt_improve_{auto,confirm}.yaml` | Modified | Dropped the "confirm the PHASE 0 dispatch-context check" workflow step |
| `commands/deep/assets/legacy/README.md` | Modified | Dropped "Dispatch-context checks" from the legacy-bodies responsibility list |
| `runtime/scripts/render-command-contract.cjs` | Modified | Reverted the dormant 022 DISPATCH-CONTEXT authorization |
| `runtime/tests/unit/render-command-contract.vitest.ts` | Modified | Reverted the 022 authorization regression test |
| `commands/deep/assets/compiled/deep-{review,research,ai-council,alignment}.contract.md` | Regenerated | Recompiled so embedded source digests match the edited docs |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Inventory first: a repo-wide scan located every on-disk copy of the gate (8 deep commands + `prompt/improve` + 4 legacy bodies) and every consumer of its output variables (`general_agent_verified`, `dispatch_context_verified`). The consumer scan classified each reference executable-vs-doc and confirmed **zero** executable consumers — no auto/confirm YAML branches on either variable — which made wholesale removal safe.

The uniform Phase-0 block (identical `### PHASE 0: DISPATCH-CONTEXT CHECK` → `### MANDATORY INPUT GATE` region) was removed by a single deterministic script across all 13 files. The surrounding prose varied per command, so the ROUTER-CONTRACT sentences, Gate 1/Gate 2 references, and numbered FIRST-ACTION lists were hand-edited with renumbering. The gate's orphaned setup-contract residue was then cleaned: the required-input variables in YAML-START-CONDITION lists and input-table rows, the Phase-Output bullets in the presentations, and the two `prompt_improve` workflow steps that told the agent to confirm the (now-removed) check. Finally the dormant 022 render authorization and its test were reverted, and the 4 injection-command contracts recompiled so their embedded source digests matched the edited docs.

The `create/*` command family's Phase-0 (`@markdown` agent availability) and the `doctor/*`/`speckit/*` workflow "Phase 0" labels are a different concept and were deliberately left intact.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Delete the gate rather than fix it | It classifies unobservable provenance; on codex/pi the genuine path is byte-identical to pasted-inline, so no prompt wording can discriminate. 022 proved the marker-anchor approach dormant and still model-compliance-bound. |
| Retire it from all 8 deep commands + improve, not just the 4 injection commands | The gate is one cross-cutting pattern; leaving it live in the other commands would keep the identical false-block. The user directive was "all cli runtimes and all models." |
| Rely on the harness guard for the real case | `dispatch-guard.cjs:isCommandDrivenIteration` reads on-disk filesystem state a forged prompt cannot produce — deterministic protection the in-prompt gate could never match. |
| Revert the dormant 022 render layer | It referenced a now-deleted concept and was never injected; removing it keeps the retirement honest and drops dead code. |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Grep audit (gate markers under commands/deep + commands/prompt) | PASS — 0 matches |
| `render-command-contract.vitest.ts` + `check-contract-drift.vitest.ts` | PASS — 24/24 after recompiling the 4 contracts |
| Comment hygiene (`render-command-contract.cjs`) | PASS — exit 0 |
| 0 executable consumers of removed variables | PASS — `commands/deep/assets/*.yaml` = 0 refs |
| Runtime vitest whole suite | PASS — exit 0; the 5 pre-existing stress failures (incl. 1 `fanout.vitest.ts`) are identical to baseline; 0 new |
| `run-node-tests.mjs` | PASS — 767 pass / 17 fail == baseline 767/17 (same 2 pre-existing contract failures); 0 new |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The executor-kind routing gap is not addressed here.** The single-executor auto-YAML path (`phase_main_loop` `branch_on: config.executor.kind`) has hand-written branches only for native/copilot/claude_code/opencode/codex; cli-cursor/cli-devin/cli-pi have no branch and fall through to native. `fanout-run.cjs` already dispatches all kinds robustly. The fix (route single-executor through fanout-run, fail-loud, or add branches) is a distinct shipped-runtime change tracked separately.
2. **Optional guard hardening deferred.** The harness guard defaults to warn, not reject. Flipping it to reject (`SYSTEM_DEEP_LOOP_GUARD_REJECT_LOOP=1`) would make the residual protection a hard block; it is an independent decision and not required to fix the reported false-block.

<!-- /ANCHOR:limitations -->
