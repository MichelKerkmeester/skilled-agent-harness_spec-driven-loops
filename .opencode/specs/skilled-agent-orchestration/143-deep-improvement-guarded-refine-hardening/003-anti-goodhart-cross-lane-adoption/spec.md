# Phase 003: Anti-Goodhart Cross-Lane Adoption

**Parent:** 143-deep-improvement-guarded-refine-hardening | **Status:** Implemented | **Teachings:** T1 T2 T3 T4 T5 T10

## Goal

The pilot's strongest findings are not packaging-specific. Back-port them to lanes A/B/C so every deep-improvement run gets the same protection against reward-hacking and noise — without breaking the byte-identical agent-improvement default path.

## Work items

1. **Different-family grader enforcement (T1, T3).** Lane B's `--grader=llm` path (`dispatch-model.cjs` / grader harness) gains a family check: if the grader model shares a family with the model that produced the outputs, refuse (overridable only by an explicit `--allow-same-family` with a journaled warning). Family extraction = provider/model-prefix heuristics with an explicit map for known providers.
2. **N-sample averaging in Lane B (T4).** `run-benchmark.cjs` gains `--samples N` (default 1 for backward compat): materialize/dispatch each fixture N times, score each, aggregate mean per dimension + all-samples pass semantics, and record per-sample + aggregate in the report so stability is visible. Lane A's `benchmark-stability.cjs` learnings apply here.
3. **Output-contract delimiting (T5).** Benchmark profiles gain an optional `deliverable_contract` field: when set, dispatched prompts append the wrap-only-the-deliverable instruction and scorers extract the delimited region (with extraction-confidence recorded). Pattern scorer and 5dim scorer both consume the extraction, not the raw transcript.
4. **Frozen-rubric guard for Lane A (T2).** Many bounded agent files *contain their own quality rubrics/score gates*. Before scoring a candidate, detect rubric-bearing regions in the target (configurable markers; default heuristics: scoring tables, "floor", rubric headings), hash them, and **reject candidates that mutate their own evaluation criteria** unless the run is explicitly flagged rubric-editing. This is the pilot's central invariant applied to agent improvement: a candidate that softens its own gate scores better for free.
5. **Decline-when-clean (T10).** Lane A: when the baseline already meets all dimension thresholds, the loop records `noTarget`/`converged` instead of generating mutation candidates by default (opt-out flag for forced exploration). Mutation-coverage dedup already prevents re-proposals; this prevents proposal churn on healthy targets.
6. **Phantom-gap as a standing metric.** Wherever a system under test self-reports a score (Lane B prompt frameworks often do), the report records `self_score`, `independent_score`, and their gap — and a widening gap is surfaced as a warning, not silently averaged away.

## Acceptance

- Identity gate: default agent-improvement plan remains byte-identical; full vitest suite green plus new tests for each guard.
- A same-family grader invocation refuses with a clear message; `--samples 3` produces visible per-sample variance in a Lane B report; a Lane A candidate editing its own rubric region is rejected with a journaled reason.
- All new behavior is opt-in or warn-first where it could change existing run semantics.

## Status (2026-06-09)

Implemented. model-family.cjs gate (Lane B llm grading refuses same-family; --allow-same-family journaled); --samples N aggregation; deliverable_contract extraction; rubric-guard in promote-candidate (rubric-mutation reject, --allow-rubric-edit override); phantom-gap report metric; decline-when-clean in the agent contract. Battery 243/243; default paths byte-identical.
