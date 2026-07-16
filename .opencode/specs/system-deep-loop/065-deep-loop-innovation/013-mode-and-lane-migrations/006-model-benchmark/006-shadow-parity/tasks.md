---
title: "Tasks: Model Benchmark - Shadow Parity"
description: "Tasks for the Model Benchmark shadow-parity phase: map multi-model runs and scoring-matrix behavior, define paired legacy and ledger adapters, reuse Deep Improvement Common Services, compare typed projections, exercise evidence and workload fixtures, and issue a blocking parity receipt without changing authority."
trigger_phrases:
  - "Model Benchmark shadow parity tasks"
  - "model benchmark scoring matrix parity tasks"
  - "model benchmark phase 009 tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/006-model-benchmark/006-shadow-parity"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/006-model-benchmark/006-shadow-parity"
    last_updated_at: "2026-07-15T23:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Captured Model Benchmark event, matrix, evidence, and workload parity work"
    next_safe_action: "Freeze the paired input manifest and Model Benchmark event mapping"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Model Benchmark - Shadow Parity

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Record the phase-012 shared-contract digest, phase-015 mode-interface and write-set graph, phase-014 shadow-framework interface, parent compatibility bridge, and mode 004 common-service contract
- [ ] T002 Inventory legacy Model Benchmark boundaries for recipe and run declaration, model/executor expansion, cell admission, trial dispatch, raw result capture, scoring, calibration, contamination, workload, resume, and terminal reporting
- [ ] T003 Freeze the fixture manifest with BASE, benchmark recipe, model/executor matrix, task families, common anchors, adaptive diagnostic policy, evaluator and judge epochs, workload profiles, contamination visibility, seeds, baseline, budget, and expected terminal classes
- [ ] T004 Define the parity receipt schema, canonical event tuple, protected matrix and projection fields, shared-service references, mismatch taxonomy, normalization manifest, and non-authoritative assertion
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Define the Model Benchmark event namespace and legacy-to-ledger mapping for run, design, sealing, admission, dispatch, completion, failure, unknown, observation, usage, score, validity, contamination, calibration, workload, reduction handoff, resume, and terminal events
- [ ] T006 Define the paired run context and legacy observer with stable run, matrix-cell, model, executor, task, family, treatment, trial, evaluator, judge, workload, receipt, and policy identities
- [ ] T007 Define the ledger shadow adapter through shared envelope, transition, receipt, budget, and replay seams in dark non-authoritative mode
- [ ] T008 Reuse the mode 004 comparator and common services; add namespaced comparison rules for matrix cells, anchors, diagnostic tails, family coverage, score vectors, uncertainty, validity, contamination, workload, and operational evidence
- [ ] T009 Define projection folds and deterministic replay oracles for run lifecycle, matrix progress, raw trials, score state, calibration, coverage, adaptive allocation, contamination, workload, cost/latency, resume, and terminal state
- [ ] T010 Define phase-014 health observation ingestion, coherent cursor and watermark checks, `telemetry_gap` and `not_evaluable` handling, recovery comparison, and observation-only action requests
- [ ] T011 Define the fixture matrix for healthy and partial runs, task-family reversals, anchor and adaptive cells, missing usage, judge/rubric perturbations, contamination, workload tails, score-policy changes, replay, resume, duplicate delivery, late completion, veto, and promotion preparation
- [ ] T012 Define the zero-authority-write guard, isolated shadow outputs, mismatch evidence retention, failure dispositions, and the parity receipt handoff to `007-rollback-and-mode-gate`
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T013 Verify: Both paths consume the same frozen inputs - BASE, recipe, run, matrix, model/executor, task/family, anchor, evaluator, judge, workload, contamination, seed, baseline, and budget digests match
- [ ] T014 Verify: The lifecycle event map is complete - every Model Benchmark run, trial, score, validity, contamination, calibration, workload, resume, reduction, and terminal boundary has a named event or explicit shared-service mapping
- [ ] T015 Verify: Event-for-event parity is strict - count, order, type, matrix identity, task/family keys, model/executor treatment, causal links, payload, receipts, shared references, and projection fingerprints match
- [ ] T016 Verify: Canonicalization is bounded - unknown fields, changed recipe or model identity, changed evaluator epoch, missing usage, missing cells, stale lineage, and non-allowlisted volatility fail rather than disappear
- [ ] T017 Verify: Matrix projections are equal - cell state, common anchors, adaptive diagnostics, family coverage, raw trials, score vectors, uncertainty, calibration, validity, contamination, workload, and terminal state match
- [ ] T018 Verify: Operational evidence is equal - usage, cost, TTFT, inter-token and tail latency, throughput, SLO, errors, abstentions, retries, and workload-shape references remain addressable and comparable
- [ ] T019 Verify: Paired and adaptive inference evidence is preserved - common anchors, quotas, selection propensities, confirmatory status, underpowered cells, and omitted diagnostics cannot create a false winner
- [ ] T020 Verify: Common-service parity is reused and complete - mode 004 evaluator, canary, promotion, health, receipt, budget, veto, and mismatch references satisfy shared contracts without masking mode drift
- [ ] T021 Verify: Phase-014 health parity is observation-only - healthy, degeneration, recovery, stale, missing, and unsupported observations preserve cursors and never change stop, dispatch, budget, promotion, or authority
- [ ] T022 Verify: Complete replay, checkpoint replay, matrix-order permutation, resume, late completion, and duplicate delivery produce identical match identities, projection fingerprints, mismatch classes, and verdicts
- [ ] T023 Verify: Every fixture has a reproducible parity receipt - BASE, mode and common-service versions, schema, reducer, comparator, fixture, streams, projections, diffs, and exit status are bound
- [ ] T024 Verify: Authority is unchanged - no ledger event becomes canonical, no evaluator/canary/hidden-case/baseline asset is mutated, no model is dispatched through production authority, no promotion occurs, no legacy writer is removed, and no cutover certificate is emitted
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with evidence
- [ ] Phase gate green with zero unexplained semantic differences, no blocking evidence gaps, and a reproducible Model Benchmark parity receipt
- [ ] Phase-014 shadow observations remain non-authoritative and fail closed on data gaps
- [ ] Phase gate green (validate/build/test as applicable)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Predecessor**: See `005-resume-adapter/` for replay, resume, and uncertain-effect boundaries
- **Successor**: See `007-rollback-and-mode-gate/` for cutover-blocking consumption and rollback ownership
- **Shared services**: Consume mode 004 Deep Improvement Common Services and the phase-014 health shadow framework
<!-- /ANCHOR:cross-refs -->
