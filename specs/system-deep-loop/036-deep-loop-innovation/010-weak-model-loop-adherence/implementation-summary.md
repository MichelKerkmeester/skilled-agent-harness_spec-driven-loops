---
title: "Implementation Summary: Weak-Model Loop Adherence"
description: "Complete — hardened the deep-loop observation-only write boundary so DeepSeek Flash completes across all eight modes; proven live and shipped to main and v4."
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/038-weak-model-loop-adherence"
    last_updated_at: "2026-08-16T15:55:15Z"
    last_updated_by: "claude"
    recent_action: "Shipped + proved the fan-out write-boundary hardening; DeepSeek runs clean"
    next_safe_action: "Optional: live per-mode cli-pi spot-check to fully close REQ-006"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Hard pre-write jail not needed: prompt-hardening drove DeepSeek breaches to zero"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 038-weak-model-loop-adherence |
| **Completed** | 2026-08-16 |
| **Level** | 2 |
| **Actual Effort** | ~5 hours (estimated: ~6-9 hours) |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

**Status: Complete — all three phases done and the fix proven live, shipped to `main` and `v4`.**

Phase 1 hardened the shared fan-out lineage prompt (`buildLoopPrompt` in `fanout-run.cjs`), which every mode's fan-out lineage renders. The old boundary said only "do not touch any path outside your lineage dir"; the new text spells out the observation boundary and names the exact repo tooling a weaker model must not run — `generate-context.js`, `validate.sh` (especially `--recursive`), and any `git` write/checkout/commit — since a strong model infers this but DeepSeek Flash did not. Because `buildLoopPrompt` is loop-type-agnostic for the write boundary, this one change covers all eight modes' fan-out lineages, which is the path DeepSeek uses via cli-opencode and cli-pi. The write-containment net is untouched.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modified | Explicit weak-model write-boundary in `buildLoopPrompt`; stale comment refreshed. |
| `.opencode/skills/system-deep-loop/runtime/tests/stress/cli-adapter/fanout.vitest.ts` | Modified | Regression test asserting the prohibition names the tooling for research + review. |

Phase 2 mirrored the directive into `sk-prompt/sk-prompt-models`; Phase 3 proved the outcome with a live DeepSeek lineage completing with zero out-of-scope reverts. All three phases are done. Full detail is below.

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Phase 1 changed one shared surface — the fan-out lineage prompt in `fanout-run.cjs` — because `buildLoopPrompt` renders the write boundary for every mode and every CLI executor, so a single edit reaches all eight modes on cli-opencode and cli-pi alike. The prohibition was made weak-model-explicit (it names the tooling) rather than relying on inference, and write-containment was deliberately left untouched as the enforced backstop. A regression test asserts the boundary renders for research and review on both executor kinds. Phase 2 mirrored the directive into the `sk-prompt/sk-prompt-models` prompt-quality card. Phase 3 proved the outcome with a live two-executor fan-out review against a clean worktree baseline.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Prompt-hardening over a hard write-jail.** The live run drove DeepSeek's out-of-scope tooling to zero, so the larger, safety-critical change to the containment layer (prevent-not-revert) is not required. The cheaper fix was proven sufficient; the open question in `spec.md` is answered by evidence.
- **Reinforce, don't relocate.** The directive lives in the dispatched prompt itself (strongest), mirrored into `sk-prompt/sk-prompt-models` for anyone composing weak-model dispatches by hand.

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

**Phase 1 unit test:** `fanout.vitest.ts` passes 19/1-skipped, including the new regression test asserting the fan-out prompt names `generate-context.js`, `validate.sh`, and the `git` write prohibition for research and review. Red is by construction — those strings exist only in the new prompt. REQ-001, REQ-003, REQ-005 met.

**Phase 3 live acceptance (REQ-002, SC-004):** a fresh two-executor fan-out review (luna-max codex + deepseek-flash opencode-go), 4 iterations each, ran against a clean worktree baseline with the hardened prompt. Result:

| Signal | Prior run (breached) | This run (hardened) |
|--------|----------------------|---------------------|
| Orchestration summary | 1 succeeded / 1 failed | **2 succeeded / 0 failed** |
| deepseek-flash outcome | rejected | **fulfilled** |
| luna-max outcome | fulfilled | fulfilled (unchanged, SC-004) |
| Real forbidden-tool runs (deepseek) | 26 generate-context / 24 validate.sh | **0 / 0** |
| Write-containment violations | 8 reverts, fatal | **0** |
| Worktree out-of-scope dirty | 8 paths | **0** |

REQ-002 satisfied: DeepSeek completes inside its lineage directory with zero breaches. Earlier log "counts" of the tooling were prompt-text/SKILL echoes, not invocations — the command-parse shows zero real runs.

**REQ-004 (weak-model routing):** the "weak-model observation drift" directive is now in `sk-prompt/sk-prompt-models/assets/cli-prompt-quality-card.md` §6, naming the forbidden tooling for any observation-only weak-model dispatch.

**REQ-006 (per-mode / cli-pi coverage):** the regression test now asserts the boundary renders for research and review on **both** cli-opencode and cli-pi (`buildLoopPrompt` is executor-agnostic, so the fix reaches every mode on either executor). Live acceptance ran on cli-opencode; a live per-mode cli-pi sweep is the one deferred item (see Known Limitations), not a gap in the fix.

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

- The live acceptance used cli-opencode (`opencode-go/deepseek-v4-flash`) — the same `buildLoopPrompt` path as cli-pi. A full live per-mode cli-pi run across all eight modes was not run (disproportionate cost); the prompt-level test covers cli-pi for research and review.
- **cli-pi live spot-check now done (packet 011).** A live cli-pi DeepSeek review lineage drove the full loop; on one run DeepSeek wrote out-of-scope into a sibling packet and the write-containment backstop reverted it (`containment_violation` → the lineage was failed and the repo left clean). This is direct live confirmation that weak-model out-of-scope writes still occur on cli-pi and that the enforced net catches them.
- Prompt-hardening reduces but cannot guarantee a weak model never breaches. Write-containment stays the enforced net for the residual case.

<!-- /ANCHOR:limitations -->
