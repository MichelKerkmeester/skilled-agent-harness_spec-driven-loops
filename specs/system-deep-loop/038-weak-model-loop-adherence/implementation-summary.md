---
title: "Implementation Summary: Weak-Model Loop Adherence"
description: "Planned — hardening the deep-loop observation-only write boundary so DeepSeek Flash completes across all eight modes. No implementation yet."
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/038-weak-model-loop-adherence"
    last_updated_at: "2026-08-16T09:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the packet: spec, plan, tasks, checklist grounded in the DeepSeek breach"
    next_safe_action: "Operator approves approach, then implement Phase 1 contract text"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    completion_pct: 0
    open_questions:
      - "Adopt the hard pre-write jail here, or split into a follow-on phase?"
    answered_questions: []
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
| **Completed** | — (Planned) |
| **Level** | 2 |
| **Actual Effort** | — (estimated: ~6-9 hours) |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

**Status: In progress — Phase 1 landed and unit-verified.** Phase 2 (weak-model routing) and Phase 3 (live DeepSeek verification) remain.

Phase 1 hardened the shared fan-out lineage prompt (`buildLoopPrompt` in `fanout-run.cjs`), which every mode's fan-out lineage renders. The old boundary said only "do not touch any path outside your lineage dir"; the new text spells out the observation boundary and names the exact repo tooling a weaker model must not run — `generate-context.js`, `validate.sh` (especially `--recursive`), and any `git` write/checkout/commit — since a strong model infers this but DeepSeek Flash did not. Because `buildLoopPrompt` is loop-type-agnostic for the write boundary, this one change covers all eight modes' fan-out lineages, which is the path DeepSeek uses via cli-opencode and cli-pi. The write-containment net is untouched.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modified | Explicit weak-model write-boundary in `buildLoopPrompt`; stale comment refreshed. |
| `.opencode/skills/system-deep-loop/runtime/tests/stress/cli-adapter/fanout.vitest.ts` | Modified | Regression test asserting the prohibition names the tooling for research + review. |

Remaining (per `tasks.md`): Phase 2 — weak-model directive via `sk-prompt/sk-prompt-models` (REQ-004); Phase 3 — live DeepSeek lineage completes with zero out-of-scope reverts (REQ-002) + strong-model non-regression (REQ-004/SC-004).

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:verification -->
## Verification

Phase 1 verified: `fanout.vitest.ts` passes 19/1-skipped, including the new regression test that asserts the fan-out prompt names `generate-context.js`, `validate.sh`, and the `git` write prohibition for both research and review modes. The red is by construction — those strings exist only in the new prompt, so the assertions cannot pass against the prior text. REQ-001 and REQ-003 (explicit prohibition; all-modes coverage via the shared prompt) are met.

Still to verify: REQ-002 (a live DeepSeek review lineage completes with zero out-of-scope reverts) needs a live fan-out re-run in an isolated worktree; SC-004 (strong-model runs unaffected) — the existing green suite is initial evidence, confirmed fully by the live non-regression run. The authoritative packet gate `validate.sh --strict` is run at completion.

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:continuation -->
## Continuation Notes

Next step is operator approval of the approach, then implementation per `tasks.md` (Phase 1 contract text → Phase 2 per-mode + weak-model routing → Phase 3 verification). Open decisions are in `spec.md` §9 — chiefly whether to also adopt the hard pre-write jail (prevent-not-revert) here or split it into a follow-on phase.

<!-- /ANCHOR:continuation -->
