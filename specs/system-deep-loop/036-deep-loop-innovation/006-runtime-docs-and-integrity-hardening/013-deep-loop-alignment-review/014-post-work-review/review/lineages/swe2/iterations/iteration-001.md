# Iteration 1: The confirm-variant census, audited

## Focus

Dimension: traceability (primary), correctness. Angle per spec.md §3.1: two interactive workflow files each declare a list of steps they omit, with a reason per step. Audit every reason against the interactive flow; identify omissions that are real design vs gaps wearing a reason; check whether any step declared present is present in name only. Phase record under audit: `006-confirm-variant-parity`.

## Scorecard

- Dimensions covered: traceability, correctness (partial)
- Files reviewed: 7
- New findings: P0=0 P1=0 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.20

## Findings

### P0 — Blocker
_None._

### P1 — Required
_None._

### P2 — Suggestion

1. **F001**: Auto-only gateway-site count in the phase record is wrong for the research pair — `specs/system-deep-loop/049-deep-loop-alignment-review/006-confirm-variant-parity/implementation-summary.md:97` claims "One auto-only gateway site remains in each research variant pair," but the research pair has two: `step_run_now_check` stages through `append-mode-event.cjs` at `.opencode/commands/deep/assets/deep-research-auto.yaml:576` and `step_run_now_restore_check` at `:1715`, while the confirm variant's only gateway call site is the synthesis stage at `.opencode/commands/deep/assets/deep-research-confirm.yaml:1509`. The sentence also contradicts itself ("One ... Both sit inside steps that are themselves censused"). The sites are covered transitively — both live inside steps named in `confirm_parity.omitted_steps` — so coverage holds, but the phase's own accounting of it does not survive contact with the tree.

2. **F002**: Census format asymmetry hides the transitive sites — the review-confirm census names its single auto-only gateway site explicitly under `gateway_wiring.auto_only_sites` (`.opencode/commands/deep/assets/deep-review-confirm.yaml:2120`), while the research-confirm census has no `auto_only_sites` block at all (`.opencode/commands/deep/assets/deep-research-confirm.yaml:1950` has only `note`); the parity test in `.opencode/skills/system-deep-loop/runtime/tests/unit/render-command-contract.vitest.ts:328-353` enforces `omitted_steps` integrity but not the gateway-site naming, so the asymmetry is invisible to the guard.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | see below | impl-summary claims verified; one accounting claim refuted (F001) |
| checklist_evidence | partial | hard | tasks.md:46-47 | T003/T004 marked `[x]` before the review ran — completion marks precede their evidence (tracked for the checklist pass) |

## Verified Claims (passed audit)

- Census completeness: auto-only step keys (excluding the `confirm_parity` block, which masks the diff because census entries share the `step_*:` key shape) are exactly the censused sets — 4 for review (`step_apply_lifecycle_request`, `step_init_complete`, `step_generate_state_summary`, `step_apply_divergent_pivot_result`), 10 for research (pivot, init-complete, refresh-lineage-context, rejected-pattern-cache, ideas-backlog-lifecycle, run-now ×2, telemetry-heartbeat ×3). Zero uncensused omissions in both pairs. Confirm-only keys are approval gates only (`gate_init_approval`, `gate_pre_iteration`, `gate_post_iteration`, `gate_pre_synthesis`, `gate_post_synthesis`, `gate_divergent_pivot_choice`, plus `gate_post_synthesis_spec_writeback` and `gate_preinit_spec_mutation_approval` in research) — inherent to the interactive surface, not drift.
- `step_apply_lifecycle_request` reason is real: `step_classify_session` at `deep-review-confirm.yaml:292` classifies resume/restart/cancel and archives the packet in `on_restart_choice` at `:316-317`.
- `step_init_complete` reason is real: `gate_init_approval.on_A` sets `current_iteration:1, stuck_count:0, p0-p2:0` at `deep-review-confirm.yaml:523` and `current_iteration:1, current_segment:1, stuck_count:0` at `deep-research-confirm.yaml:549`.
- `step_generate_state_summary` reason is real: inlined `generate_summary` renders inside dispatch pre_dispatch at `deep-review-confirm.yaml:1096`.
- `step_apply_divergent_pivot_result` reason is real: `gate_divergent_pivot_choice` applies the pivot inline (binds `next_dimension`, `pivot_lineage`) at `deep-review-confirm.yaml:937,961-962` and `deep-research-confirm.yaml:905`.
- `step_rejected_pattern_cache` / `step_ideas_backlog_lifecycle` reasons are real: confirm's `step_read_state` never extracts `rejectedPatternIndex`/`promotedIdeas` (zero occurrences outside the census); auto's does (`deep-research-auto.yaml:562-568`) and dispatches to the cache step at `:965`. Restoring without widening read_state would be a step that runs and does nothing — the reason given is exactly the true constraint.
- `step_run_now_*` and `step_telemetry_heartbeat_*` reasons are real: all five steps exist only in auto (`deep-research-auto.yaml:573,465,1712` + two more heartbeat sites); the interactive surface is operator-driven.
- `auto_only_sites` claim is real: `deep_review.recovery_baseline` is staged inside the cli-opencode detached-dispatch recovery branch of `step_dispatch_iteration` (`deep-review-auto.yaml:1357-1369`), a path with no interactive counterpart.
- `auto_corrections` verified: `iteration_error` uses flat `{config.sessionId}/{config.generation}/{config.lineageMode}` (`deep-review-auto.yaml:1920`); `AUTO_SESSION_ID` bound to `{ISO_8601_NOW}` at `deep-research-auto.yaml:333`; `step_stage_artifact_dir` present in all four files; `step_leave_artifacts_unstaged` absent.
- `dispatch_lineage_guard` addendum is real: `fanout-run.cjs` `buildNativeCommandInput` hands native lineages the `:auto` contract (`fanout-run.cjs:1534`); confirm surfaces never run as lineage executors.
- Mechanical post-dispatch gate is not name-only: `verify-iteration.cjs` invoked with route_proof block and `on_failure.redispatch_once` at `deep-review-confirm.yaml:1269` and `deep-research-confirm.yaml:1222`.
- Parity test enforcement is real: `render-command-contract.vitest.ts:328-353` strips the census block then asserts every auto step is present-or-censused, every censused name is an auto-defined step truly absent from confirm, and every entry states a reason.

## Assessment

- New findings ratio: 0.20 (2 new P2 × weight 1.0 / 10.0)
- Dimensions addressed: traceability (census claims vs tree), correctness (site counts, wiring)
- Novelty justification: every one of the 14 census reasons was independently verified against the interactive flow rather than read back from the phase record; the step-set diff was recomputed with the census block excluded, which the naive diff misses.

## Ruled Out

- "Census entries hide unrestored steps": ruled out — every omitted_steps name is absent as a real step key in the confirm file and the stated inlining site exists.
- "Confirm variants have steps auto lacks that indicate drift": ruled out — all confirm-only keys are `gate_*` approval machinery.

## Dead Ends

- None.

## Recommended Next Focus

Iteration 2 — Angle 2: the ledger stem census. `deep-review-ledger-types.ts` registers 61 event spellings, 56 declared reserved; `check-ledger-stem-producers.cjs` enforces the declaration. Hunt for a reserved stem with a producer, a spoken stem the census misses, or a reason that fails against the code; test the checker against drift.

Review verdict: PASS
