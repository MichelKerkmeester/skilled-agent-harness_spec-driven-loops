---
title: "Checklist: Model Benchmark - Shadow Parity"
description: "Checklist for the Model Benchmark shadow-parity phase: prove event-for-event and projection parity between the typed ledger path and legacy multi-model benchmark emitter across scoring matrices, raw evidence, validity, workload, resume, and shared control services before any authority cutover."
trigger_phrases:
  - "Model Benchmark shadow parity checklist"
  - "model benchmark parity gate"
  - "scoring matrix ledger checklist"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/006-model-benchmark/006-shadow-parity"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/006-model-benchmark/006-shadow-parity"
    last_updated_at: "2026-07-15T23:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined the blocking Model Benchmark shadow-parity checklist"
    next_safe_action: "Run the model matrix fixture set and attach receipts to each parity result"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Model Benchmark - Shadow Parity

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking shadow-parity verifier contract for Model Benchmark phase 006. Every item is a check the paired
verifier runs before parity evidence can be handed to `007-rollback-and-mode-gate`; each report pins BASE, mode and common-service
versions, benchmark recipe and matrix digests, evaluator and judge versions, fixture IDs, both stream digests, projection
fingerprints, commands, exit codes, boundary counts, mismatch counts, and zero-authority-write evidence. `MISMATCH`,
`INCONCLUSIVE`, `TELEMETRY_GAP`, `INSUFFICIENT_EVIDENCE`, or zero eligible boundaries is a failed gate, not an implicit pass.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The phase-009 shared-contract digest, phase-012 mode-interface and write-set graph, phase-011 shadow-framework interface, parent compatibility bridge, and mode 004 common-service contract are pinned in the candidate report
- [ ] CHK-002 [P0] Legacy Model Benchmark boundaries are inventoried for recipe, run, model/executor expansion, cell admission, trial, score, calibration, contamination, workload, resume, and terminal behavior
- [ ] CHK-003 [P1] BASE, recipe, matrix, model/executor descriptors, task/family digests, anchors, diagnostic policy, evaluator and judge epochs, workload, contamination visibility, seeds, baseline, budget, fixture IDs, and output paths are frozen before dual execution
- [ ] CHK-004 [P1] The canonical event tuple, protected matrix and projection fields, diff taxonomy, common-service references, receipt schema, and volatility allowlist are reviewed before any difference is classified as tolerated
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-005 [P0] Changes are scoped to the Model Benchmark shadow contract; no adjacent mode implementation, common-service rewrite, authority flip, legacy-writer removal, or sibling concern is included
- [ ] CHK-006 [P0] Both paths receive one immutable run context and evaluator/judge epoch; divergence in BASE, recipe, matrix, cell identity, model, executor, task, family, workload, contamination, baseline, budget, or input digest blocks the report
- [ ] CHK-007 [P0] Event pairing is one-to-one by stable logical identity and canonical sequence; missing, extra, reordered, ambiguous, unauthorized, unsupported, duplicate, and late semantic events fail closed
- [ ] CHK-008 [P0] The mode consumes mode 004 evaluator, canary, promotion, health, receipt, budget, veto, and mismatch contracts; namespaced Model Benchmark fields cannot weaken common checks
- [ ] CHK-009 [P1] Unknown event fields, changed recipe or model build, changed evaluator epoch, missing usage, missing family samples, stale lineage, and non-allowlisted volatility fail rather than being dropped
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-010 [P0] Accepted fixtures have 100 percent event-boundary coverage with zero missing, extra, reordered, duplicate, unauthorized, unknown-version, or unexplained protected-field events
- [ ] CHK-011 [P0] Run and matrix projections match after every event boundary for recipe, cell identity, model/executor treatment, task/family, anchor and diagnostic status, and terminal disposition
- [ ] CHK-012 [P0] Raw trial evidence retains item and family output, score vector, evaluator and judge identity, fixture, seed, normalization, cost, latency, error, abstention, retry, and receipt references across score-policy replay
- [ ] CHK-013 [P0] Score projections preserve metric/rubric version, uncertainty, calibration, multiplicity, selection policy, hard floors, abstentions, invalid cells, contamination, coverage, and underpowered states without aggregate compensation hiding a regression
- [ ] CHK-014 [P0] Common-anchor and adaptive-tail fixtures preserve family quotas, selection propensities, confirmatory status, diagnostic membership, and omitted-cell reasons; adaptive omission cannot become evidence of superiority
- [ ] CHK-015 [P0] Model-by-task and model-by-executor crossing fixtures preserve the distinction between model quality and complete execution-stack behavior
- [ ] CHK-016 [P0] Judge and rubric fixtures cover order, style, protocol, candidate-specific calibration, oracle uncertainty, disagreement, abstention, evaluator-integrity, and validity failures without treating agreement as truth
- [ ] CHK-017 [P0] Contamination and exposure fixtures preserve source date, visibility, first exposure, disclosure, detector evidence, retirement, replacement, fresh-case status, and blocked or uncertain dispositions
- [ ] CHK-018 [P0] Workload fixtures compare context, concurrency, traffic shape, output length, prefix reuse, multi-turn behavior, TTFT, inter-token and tail latency, throughput, SLO, cost, error, abstention, and switching evidence; missing usage is not zero
- [ ] CHK-019 [P0] Partial, failed, unknown, invalid, abstained, inconclusive, stale, and missing cells remain explicit; an absent observation cannot become a zero score or successful matrix completion
- [ ] CHK-020 [P0] Phase-011 healthy, degeneration, recovery, stale, missing, and unsupported observations preserve one coherent cursor and watermark; data gaps never count as healthy
- [ ] CHK-021 [P0] Phase-011 pause, re-seed, quarantine, repair, and stop requests remain observations and do not stop, dispatch, cancel, spend budget, mutate a baseline, promote a selection, or change authority
- [ ] CHK-022 [P0] Complete replay, checkpoint replay, matrix-order permutation, resume, late completion, and duplicate delivery produce identical match identities, projection fingerprints, mismatch classes, and verdicts
- [ ] CHK-023 [P0] The accepted corpus has zero unexplained protected projection differences, zero blocking evidence gaps, and zero authority writes from the typed shadow path
- [ ] CHK-024 [P0] `MISMATCH`, `INCONCLUSIVE`, `TELEMETRY_GAP`, `INSUFFICIENT_EVIDENCE`, stale evaluator, unsupported adapter, missing usage, or empty eligible corpus cannot produce `PASS`
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-025 [P1] The protected-field manifest covers run, matrix, cell, model, executor, task, family, treatment, raw trial, score, uncertainty, coverage, calibration, validity, contamination, workload, cost, latency, receipt, shared control, resume, and terminal fields
- [ ] CHK-026 [P1] The lifecycle event map accounts for every run, design, sealing, admission, trial, observation, score, validity, contamination, calibration, workload, reduction, resume, and terminal boundary
- [ ] CHK-027 [P1] The parity report identifies the mode 004 common-service result and every Model Benchmark fixture result, with no variant-local fork of shared parity semantics
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-028 [P0] Shadow execution cannot mutate model recipes, evaluator or canary assets, hidden task contents, benchmark cells, stable baselines, production promotion state, or legacy-writer authority
- [ ] CHK-029 [P0] Candidate and judge information boundaries, hidden-case secrecy, contamination controls, evaluator-integrity checks, capability limits, and digest-bound evidence remain intact in shared projections
- [ ] CHK-030 [P1] Shadow reservations and duplicate external effects are bounded by typed budget and receipt rules without bypassing the shared transition-authorization gateway
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-031 [P1] The parity report schema, mismatch taxonomy, protected-field manifest, common-service reuse boundary, normalization manifest, matrix acceptance criteria, and cutover-blocking handoff are reflected in the phase docs and successor handoff
- [ ] CHK-032 [P2] Research traceability cites the 065/002 findings on task-conditioned model strength, adaptive coverage, judge calibration, contamination lineage, workload metrics, paired inference, and versioned benchmark recipes
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-033 [P1] Shadow evidence is append-only and bounded; event-match, matrix, projection, mismatch, common-service, and final-verdict records retain source cursors and content digests
- [ ] CHK-034 [P1] Any later implementation remains path-scoped and additive-dark; no authority-cutover, common-service reimplementation, model selection deployment, or legacy-writer retirement change lands in this phase
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete only when every P0 verifier check passes for the Model Benchmark corpus, every eligible boundary has event
and projection evidence, common evaluator/canary/promotion/health services remain shared and non-authoritative, raw matrix and
operational evidence remains addressable, and the final report is `PASS` with zero unexplained protected differences, zero
blocking data gaps, and zero authority writes. This evidence may be consumed by the successor mode gate; it cannot authorize
authority cutover by itself.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the verifier confirms the P0 parity contract, the report pins source and target path versions plus recipe, matrix,
evaluator, judge, corpus, and manifest hashes, replay and duplicate-delivery results are deterministic, common-service reuse is
proven, and the authority-write assertion is green for the complete verification run.
<!-- /ANCHOR:sign-off -->
