# Phase 004: Fixture + Grader Infrastructure

**Parent:** 139-deep-improvement-guarded-refine-hardening | **Status:** Implemented | **Teachings:** T5 T6 T11 | **Depends:** 003

## Goal

Codify the testing-infrastructure lessons as shared, reusable conventions: fixtures that can actually be graded, held-out discipline, grader calibration, and dispatch pre-flight — so every future loop inherits them instead of rediscovering them live.

## Work items

1. **Gradeable-fixture lint (T6).** A validation script (shared, callable from all lanes) that classifies a fixture as deliverable-producing vs interactive/clarifying. Heuristics: dry-run dispatch (or recorded prior output) checked for the deliverable contract region; fixtures that answer with questions are flagged `interactive` and barred from held-out sets. Wire into Lane B profile validation and Lane D's loop pre-flight (a held-out list containing an interactive fixture fails fast, before any paid dispatch).
2. **Held-out / gold-set convention (T1, council).** Document and enforce the split: visible optimization fixtures vs held-out promotion gates the proposer never sees, plus an optional human-anchored gold set with locked target scores. Convention lives in deep-improvement `references/shared/`; Lane D's operator guide and Lane B profiles reference it. Adversarial seeds must not be enumerated in repo files the proposer reads (the pilot's T4 fixture published its own answers).
3. **Grader calibration protocol (T1, T3).** A repeatable `calibrate-grader` flow: same outputs graded by two different families + (optionally) a human/Claude spot-check; report inter-grader agreement, per-dimension bias, and the self-vs-independent phantom gap. Run it before trusting any new grader model, and re-run when grader models change. The pilot's manual MiMo-vs-Claude corroboration becomes this script's first recorded run.
4. **Provider auth pre-flight for batches (T11).** Before any multi-dispatch batch (Lane B llm grading, Lane D sampling), probe the resolved provider with a minimal echo dispatch; on auth failure, fail the whole batch fast with the provider login hint instead of burning the batch on `invalid api key` outputs parsed as garbage. Land it in the shared dispatch path (`dispatch-model.cjs` + Lane D adapter docs) and align with cli-opencode's documented pre-flight decision tree.
5. **Grader-output robustness.** Standardize the strict-JSON grader reply contract (single-line JSON, no fences) + tolerant extraction + explicit `grader_error` records (the pilot's `no-json` records made the auth failure diagnosable after the fact — keep that property).

## Acceptance

- An interactive fixture in a held-out list is rejected by lint before any dispatch.
- `calibrate-grader` produces an agreement report for two families over a recorded output set; documented threshold guidance (e.g. proceed when mean abs disagreement ≤ 2 of 25).
- A revoked-credential batch fails in one probe dispatch, not N grading dispatches.

## Status (2026-06-09)

Implemented. fixture-lint.cjs (deliverable/uncontracted/unrecorded, exit-1 gate); heldout_and_gold_sets.md convention; calibrate.py two-grader agreement protocol (first recorded run: MiMo vs Claude, ~1.0 mean abs disagreement); T11 auth probes + T6 held-out lint wired into the loop pre-flight.
