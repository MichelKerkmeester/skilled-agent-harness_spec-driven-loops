---
title: "Implementation Summary: Convergence Design and Hardening"
description: "Summary of the sliding-window decision-record (defer) and the 4 hardening item dispositions (2 built, 2 already-existing and newly tested/documented)."
trigger_phrases:
  - "convergence design hardening implementation summary"
importance_tier: "medium"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-agent-loops-improved/009-research-backlog-remediation/009-convergence-design-and-hardening"
    last_updated_at: "2026-07-01T16:25:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Implemented by GPT-5.5 xhigh, verified by Sonnet 5"
    next_safe_action: "Phase complete; move to child 010-validate-sh-template-detection"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sonnet-009-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `deep-loops/030-agent-loops-improved/009-research-backlog-remediation/009-convergence-design-and-hardening` |
| **Completed** | 2026-07-01 |
| **Level** | 1 |
| **Implemented by** | `openai/gpt-5.5-fast` (`--variant xhigh`) via `cli-opencode` |
| **Verified by** | Claude Sonnet 5 (orchestrating session) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Wrote an evidence-cited `decision-record.md` recommending **defer** on a sliding-window convergence mode (build in a follow-up phase, not this one) — grounded in generation-2 forced-depth research's "mathematically-proven" denominator-drag finding, with citations down to the raw glm iteration files. Implemented the 2 hardening items that genuinely didn't exist yet (stall-watchdog alerting, per-lineage cost/budget cap), and confirmed + tested + explicitly dispositioned the 2 that turned out to already exist in the codebase (lag-ceiling status mapping, near-duplicate finding dedup).

### Hardening Item Dispositions

| Item | Status Before | What Happened |
|------|----------------|---------------|
| Stall-watchdog alerting | Did not exist | **Built**: `startLineageStallWatchdog()` — debounced timer, reschedules on activity, emits `stall_detected` (mapped to `warning`) when a lineage's event stream goes quiet past a configurable `stallWatchdogMs` |
| Per-lineage cost/budget cap | Did not exist | **Built**: `evaluateLineageBudgetCap()`, mirroring the `deep-ai-council`'s `cost-guards.cjs` pattern (`continue_allowed`/`stop_reasons`/`upper_bound`); enforced in the worker before spawning a lineage's CLI subprocess |
| Near-duplicate finding dedup | Already existed (opt-in, tested) | **Confirmed working, decision documented**: kept opt-in — flipping the default would silently collapse previously-distinct cross-lineage findings, a rollout decision bigger than this backlog item |
| Lag-ceiling → typed status mapping | Already existed (untested directly) | **Confirmed working** (already dispositioned resolved in child 006's finding review); added a direct regression test, including the real `abort-requeue` action spelling the live event vocabulary actually uses |

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `decision-record.md` (new) | Created | Sliding-window convergence design decision, evidence-cited, defer recommendation |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` | Modified | Stall watchdog, budget-cap evaluator + enforcement, new status mappings for both new event types |
| `.opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts` | Modified | New tests: lag-ceiling + hardening event status mapping, budget-evaluator continue-decision shape, stall-detection alert emission, over-budget lineage halt (both cost-unit and token-alias config paths) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Dispatched to `openai/gpt-5.5-fast` (`--variant xhigh`) via `cli-opencode`, pre-grounded by this orchestrating session's own investigation that 2 of the 4 named hardening items already existed in the codebase (avoiding duplicate work) and that a working, well-tested cost-guard pattern already existed for the `deep-ai-council` sibling mode to mirror for the new per-lineage cap. The dispatch independently re-confirmed all of this, read the current (not archived) generation-2 research directly for the decision-record's evidence, implemented both new hardening items with real enforcement wiring (not just helper functions), and iterated on its own test assertions when it discovered the live event vocabulary used a slightly different action spelling (`abort-requeue`) than what was assumed.

This orchestrating session independently re-verified: read the actual diffs to `fanout-run.cjs` (confirming both new hardening items are genuinely wired into real call sites — the stall watchdog timer and the budget check inside the worker function before subprocess spawn, not just unused helper exports), read `decision-record.md` in full and spot-checked every cited evidence line directly against the real source files (`research/research.md`, glm's `iteration-017.md` and `iteration-035.md`) — all citations accurate, none fabricated — then re-ran the full targeted test file and the whole `deep-loop-runtime` suite.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Defer the sliding-window convergence mode**, per the decision-record's own 5-checks evaluation and alternatives comparison — the packet's own scope explicitly banned implementing it in this phase regardless of how strong the evidence became.
- **Kept near-duplicate dedup opt-in.** A default-on flip is a real behavior change to merge semantics across the whole packet, not a backlog-item-scoped decision — documented explicitly rather than silently deciding either way.
- **Mirrored the `council/cost-guards.cjs` shape for the new budget cap** rather than inventing a new design, and used cost-unit/token-alias configuration since no real per-lineage token telemetry exists yet to measure an actual cost metric against — an honest, documented constraint rather than a fabricated metric.
- **Regression-tested the exact live event vocabulary**, not an assumed one — the dispatch caught that the pool's actual `lag_ceiling_exceeded` action value is `abort-requeue`, not the older `abort` spelling, and corrected its own test assertion before finalizing.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

1. **Decision-record evidence**, independently spot-checked: every cited line (`research/research.md:14-22,117,162`; glm's `iteration-017.md:8-14`; `iteration-035.md:8`) read directly and confirmed to say exactly what the decision-record claims — no fabrication.
2. **Real wiring, not dead code**: confirmed `startLineageStallWatchdog` is invoked with real lineage-tracking parameters and `evaluateLineageBudgetCap` is called inside the actual worker function before subprocess spawn, both throwing/emitting through the pool's existing failure/ledger paths.
3. **Full targeted test file**, independently re-run: `npx vitest run tests/unit/fanout-run.vitest.ts` → **40/40 pass**.
4. **Full suite regression check**, independently re-run: `npx vitest run` (whole `deep-loop-runtime` package) → **563/565 pass**. The 2 failures are the same pre-existing, unrelated baseline confirmed throughout this remediation phase (`dependency-seams.vitest.ts`, `executor-provenance-mismatch.vitest.ts`).
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- Sliding-window convergence mode is a documented follow-up, not shipped in this phase — matches the packet's own explicit scope boundary.
- The per-lineage budget cap measures configured cost units / estimated tokens-per-iteration, not real, measured per-lineage token consumption — the runtime doesn't currently track that telemetry. A future phase adding real per-lineage cost tracking could tighten this from an estimate to an actual measurement.
- The 2 pre-existing test failures remain open — unrelated to this packet, out of scope to fix here.
<!-- /ANCHOR:limitations -->
