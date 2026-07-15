---
title: "Checklist: Model Benchmark - Sealed Reference Artifacts"
description: "Blocking verification checklist for the model-benchmark phase-003-backed sealed benchmark recipe, multi-model matrix, raw cell evidence, scoring references, validity and contamination lineage, workload evidence, and common-service handoff."
trigger_phrases:
  - "model benchmark sealed artifacts checklist"
  - "model benchmark tamper evident scoring verification"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/006-model-benchmark/003-sealed-artifacts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/006-model-benchmark/003-sealed-artifacts"
    last_updated_at: "2026-07-15T21:10:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined model-matrix, validity, workload, and tamper-read verification gates"
    next_safe_action: "Run the matrix verifier after common sealing and reducer contracts are frozen"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Model Benchmark - Sealed Reference Artifacts

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking verifier contract for the model-benchmark sealed reference-artifacts phase. Every item is a check the paired verifier runs before the candidate implementation lands; each report pins the candidate SHA, common phase-003 sealing fingerprint, predecessor reducer fingerprint, recipe and matrix fixture digests, commands, exit codes, artifact counts, completeness states, and scoring outcomes. Any alternate sealing scheme, mutable overwrite, accepted tampered read, hidden-evidence leak, incomplete anchor set, invalid calibration, contaminated case, fabricated usage, workload mismatch, or shared-service fork fails the gate.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] `002-reducers-and-projections` artifact-index, evaluator-epoch, scoring-status, canary-status, promotion-status, and projection-fingerprint inputs are frozen
- [ ] CHK-002 [P0] `004-deep-improvement-common/003-sealed-artifacts` records canonicalization, digest, dependency, seal-on-write, publication, verification, and failure semantics
- [ ] CHK-003 [P1] The model-benchmark field and dependency matrix names every recipe, run, cell, raw observation, score, validity, contamination, workload, and redacted field
- [ ] CHK-004 [P1] Ownership boundaries exclude deep-improvement-common evaluator/canary/promotion implementation and `004-certificates-and-receipts` materialization
- [ ] CHK-005 [P1] Complete, partial, mutated, missing-usage, stale-case, contaminated, calibration-failure, hidden-visibility, workload, and mixed-version fixtures are pinned
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-006 [P0] Every model-benchmark artifact uses the phase-003 sealing adapter; no second digest, signature, chain, manifest, storage, or verification scheme exists
- [ ] CHK-007 [P0] Recipe and cell digest coverage includes canonical bytes, artifact kind, schema version, matrix ordering, model/executor identity, workload, and ordered dependency closure
- [ ] CHK-008 [P0] Sealed recipe, matrix, cell, observation, and scoring bytes are immutable, writes are atomic, incomplete cells are unreadable, and every semantic change requires a new identity
- [ ] CHK-009 [P1] Scope is limited to model-benchmark run/scoring artifacts, validity, contamination, workload evidence, fixtures, shared-service adapters, and verification; no authority cutover or adjacent cleanup is included
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-010 [P0] Equivalent canonical recipes, matrix orderings, and dependency closures produce identical references while every semantic model, executor, fixture, sample, seed, scoring, visibility, workload, or dependency mutation produces a new identity
- [ ] CHK-011 [P0] Interrupted, retried, duplicate, and concurrent writes never publish partial content or overwrite an existing sealed recipe, cell, observation, or scoring artifact
- [ ] CHK-012 [P0] Tampered bytes, manifests, model descriptors, capability fingerprints, hidden commitments, cell membership, scoring revisions, contamination state, and workload fields fail closed with typed read results
- [ ] CHK-013 [P0] Run fixtures bind mode, profile version, model/provider/build/variant, executor, framework, fixtures, samples, seeds, matrix order, visibility, scoring, reporting, and workload
- [ ] CHK-014 [P0] Model-cell fixtures retain frozen workflow/environment state, capabilities, permissions, prompt/framework and fixture references, raw responses or traces, usage, cost, latency, errors, retries, and integrity observations
- [ ] CHK-015 [P0] Scoring fixtures retain raw item and family rows beside rubric axes, correctness gates, judge observations, paired deltas, intervals, rank probabilities, multiplicity treatment, and selection status
- [ ] CHK-016 [P0] Common-anchor fixtures remain paired across compared cells and adaptive diagnostic fixtures record family quotas, selection policy, information inputs, confirmatory status, and exclusion reasons
- [ ] CHK-017 [P0] Judge and rubric validity fixtures cover candidate/task-cluster calibration, axis perturbations, oracle uncertainty, protocol robustness, and invalid-score refusal
- [ ] CHK-018 [P0] Contamination fixtures cover source date, first exposure, visibility, matched or semantic evidence, disclosure, retirement, replacement lineage, reference-model difficulty, and hidden-case isolation
- [ ] CHK-019 [P0] Missing, stale, contaminated, quarantined, unsupported, calibration-invalid, epoch-mismatched, incomplete, or workload-mismatched artifacts cannot reach winner or ship eligibility
- [ ] CHK-020 [P0] Candidate-facing reads exclude hidden fixtures, exact evaluator internals, protected judge evidence, terminal scoring evidence, and mutable service state
- [ ] CHK-021 [P0] Workload fixtures retain quality, latency tails, throughput, SLO violations, realized cost, error, abstention, and switching evidence; output-word or quality-per-dollar ratios cannot stand alone
- [ ] CHK-022 [P1] Complete and checkpointed matrix replay preserves raw sealed artifacts while new reducer, calibration, normalization, or scoring-policy revisions create new derived references
- [ ] CHK-023 [P1] Model-only claims use independent model and execution crossings, while complete-stack comparisons carry an explicit complete-stack estimand
- [ ] CHK-024 [P1] Common and model adapters pass identical evaluator, canary, promotion, veto, read-failure, and lifecycle fixtures without semantic drift
- [ ] CHK-025 [P1] Model-benchmark sealed references bind to the successor certificate/receipt input contract without moving certificate or receipt materialization into this phase
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-026 [P1] The artifact-to-service manifest enumerates every recipe, run, cell, raw observation, scoring revision, anchor, diagnostic, validity, contamination, workload, dependency digest, read verifier, lifecycle state, and required consumer
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-027 [P0] Model dispatch and scoring adapters cannot write sealed evaluator assets, hidden fixtures, protected judge material, promotion thresholds, prior evidence, or projection state
- [ ] CHK-028 [P0] Hidden-evidence leakage, contamination uncertainty, evaluator-integrity failure, calibration invalidity, dependency mismatch, and stale workload evidence produce non-overridable typed veto or block references
- [ ] CHK-029 [P1] Candidate visibility, protected fixture isolation, exact-score withholding, capability boundaries, and typed budget policy are enforced at service boundaries rather than stated only in prose
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-030 [P1] Recipe and matrix identity, cell evidence, scoring layers, anchor/adaptive rules, validity, contamination, workload, read failures, shared-service ownership, and successor expectations are reflected in the phase docs
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-031 [P1] Implementation and fixture changes land in dependency-closed, path-scoped commits after the common reducer and phase-003 sealing contracts are pinned
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 verifier check passes, the report pins the common sealing and reducer fingerprints, every model-benchmark artifact class is content-addressed and immutable, raw and derived scoring evidence remains reproducible, protected or incomplete inputs fail closed, and shared evaluator/canary/promotion semantics show no variant drift.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the verifier confirms the P0 contract, the strict spec validator passes, the matrix and access-boundary suites are green, and the exact-scope diff check shows no unexpected tracked mutation outside the implementation surface assigned to this phase.
<!-- /ANCHOR:sign-off -->
