---
title: "Implementation Summary"
description: "Ten deep-research iterations found that the advisor already has a held-out set and a parity gate; the gate never runs in CI and measures the harness regime, so nine ranked recommendations say how to wire and scope it."
trigger_phrases:
  - "routing evaluation implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation"
    last_updated_at: "2026-10-11T17:45:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Closed the ten-iteration routing-evaluation research"
    next_safe_action: "A later fix phase picks up R1 from research/research.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:2b581e0d6ef7a408136c4cdc510c5c4018944db7417442e99310b438a11396fd"
      session_id: "scaffold-004-routing-evaluation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-routing-evaluation |
| **Completed** | 2026-10-11 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The skill advisor already has the held-out evaluation set and the cross-path parity gate this phase was asked to design. The parity gate just never runs in CI, and when it does run it measures the test-harness regime rather than live routing. `research/research.md` holds the checked synthesis and nine ranked recommendations, each citing a path:line and naming its prevent-overengineering move.

### Phase 4: routing-evaluation

You get answers to the four research questions, all backed by lines the orchestrator reread. The held-out set is `holdout-prompts.jsonl`: 66 frozen rows from three separately written fixtures, checked for collisions with the training corpus and floored in CI. The parity gate is `local-native-divergence-ratchet.vitest.ts`: strict top-1 against a reviewed 73-entry ledger, passing 6/6 in 5.0 seconds today, named by no workflow. The top recommendation is a one-step extension of the existing `golden-prompt-gate` job that runs it as a blocking check. No recommendation touches probe P4, probe P7 or admission scenario DOC-331.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `research/` | Created | Loop config, ledger, state log, strategy, registry, dashboard, ten iteration narratives and deltas, prompts, dispatch receipts, resource map and `research.md` |
| `spec.md` | Modified | Bounded pre-init topic note and the generated findings fence under Open Questions |
| `implementation-summary.md`, `goal.md`, `tasks.md` | Modified | Outcome, evidence log and task state |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The `/deep:research` auto workflow ran ten iterations, each a fresh `@deep-research` leaf dispatched through the shared cli-pi command builder as `pi -p --offline --model llmgateway/deepseek-v4.1-flash --thinking max`. Every dispatch exited 0 and passed `verify-iteration.cjs` on the first try. There were no redispatches and no containment advisories, and no usage limit came up, so the Cline Pass fallback never ran. The orchestrator then reread every cited line, ran the divergence ratchet under vitest, probed the live daemon on the contested row, and wrote the synthesis.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Prepend the child-dispatch preamble and the inlined `@deep-research` agent definition to each rendered prompt | cli-pi requires both on every non-interactive dispatch, and the workflow's single-executor cli-pi branch sends the bare prompt pack |
| Run the real ratchet before trusting the iterations' prediction about it | Iterations 9 and 10 predicted a rule-(c) failure from a replay outside vitest; the real run passed 6/6, so the claim was recast as a regime split |
| Rank wiring the existing ratchet first | It is an in-place job extension that starts green, and its absence from CI is the one gap that leaves cross-path drift unenforced |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Iteration records in `deep-research-state.jsonl` | 10 |
| Recommendation rows, rows missing path:line, rows missing a move | 9, 0, 0 |
| `npx vitest run tests/parity/local-native-divergence-ratchet.vitest.ts` | PASS, 6/6 in 5.01 s |
| CI grep for the parity harnesses | No match (exit 1), as the synthesis states |
| Live daemon probe on `rr-iter3-168` | `system-spec-kit` 0.8251 over `system-deep-loop` 0.825, freshness live |
| Targeted validation after each spec.md write | PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Some numbers are executor-measured.** The live agreement sample, the divergence class mix and the per-call costs come from iterations 6 to 9 and were not rerun. `research/research.md` labels each one.
2. **CI minutes are not measured.** The cost of R1 and R5 is structural: one vitest file each, in a job that already pays the install.
3. **Inferred clock risk.** R3 rests on the derived lane's age discount plus floor margins of 0.0001. A ratchet run with the system time moved forward would confirm or refute it.
<!-- /ANCHOR:limitations -->
