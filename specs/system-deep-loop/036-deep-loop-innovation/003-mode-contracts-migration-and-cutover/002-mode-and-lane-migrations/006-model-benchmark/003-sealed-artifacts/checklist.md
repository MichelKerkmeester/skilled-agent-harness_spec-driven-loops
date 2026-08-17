---
title: "Checklist: Model Benchmark - Sealed Reference Artifacts"
description: "Blocking verification checklist for the model-benchmark phase-007-backed sealed benchmark recipe, multi-model matrix, raw cell evidence, scoring references, validity and contamination lineage, workload evidence, and common-service handoff."
trigger_phrases:
  - "model benchmark sealed artifacts checklist"
  - "model benchmark tamper evident scoring verification"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/006-model-benchmark/003-sealed-artifacts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/003-mode-contracts-migration-and-cutover/002-mode-and-lane-migrations/006-model-benchmark/003-sealed-artifacts"
    last_updated_at: "2026-08-17T04:04:40Z"
    last_updated_by: "codex"
    recent_action: "Verified sealed-artifact closeout with focused suite 12 of 12 at exit 0"
    next_safe_action: "Treat this leaf as complete while preserving additive-dark authority"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Checklist: Model Benchmark - Sealed Reference Artifacts

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking verifier contract for the model-benchmark sealed reference-artifacts phase. Every item is a check the paired verifier runs before the candidate implementation lands; each report pins the candidate SHA, common phase-007 sealing fingerprint, predecessor reducer fingerprint, recipe and matrix fixture digests, commands, exit codes, artifact counts, completeness states, and scoring outcomes. Any alternate sealing scheme, mutable overwrite, accepted tampered read, hidden-evidence leak, incomplete anchor set, invalid calibration, contaminated case, fabricated usage, workload mismatch, or shared-service fork fails the gate.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] `002-reducers-and-projections` artifact-index, evaluator-epoch, scoring-status, canary-status, promotion-status, and projection-fingerprint inputs are frozen [Evidence: model-benchmark-sealed-artifacts.vitest.ts 12/12 in 1.71s, exit 0; runtime tsc exit 0]
- [x] CHK-002 [P0] `004-deep-improvement-common/003-sealed-artifacts` records canonicalization, digest, dependency, seal-on-write, publication, verification, and failure semantics [Evidence: model-benchmark-sealed-artifacts.vitest.ts 12/12 in 1.71s, exit 0; runtime tsc exit 0]
- [x] CHK-003 [P1] The model-benchmark field and dependency matrix names every recipe, run, cell, raw observation, score, validity, contamination, workload, and redacted field [Evidence: model-benchmark-sealed-artifacts.vitest.ts 12/12 in 1.71s, exit 0; runtime tsc exit 0]
- [x] CHK-004 [P1] Ownership boundaries exclude deep-improvement-common evaluator/canary/promotion implementation and `004-certificates-and-receipts` materialization [Evidence: model-benchmark-sealed-artifacts.vitest.ts 12/12 in 1.71s, exit 0; runtime tsc exit 0]
- [x] CHK-005 [P1] Complete, partial, mutated, missing-usage, stale-case, contaminated, calibration-failure, hidden-visibility, workload, and mixed-version fixtures are pinned [Evidence: model-benchmark-sealed-artifacts.vitest.ts 12/12 in 1.71s, exit 0; runtime tsc exit 0]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-006 [P0] Every model-benchmark artifact uses the phase-007 sealing adapter; no second digest, signature, chain, manifest, storage, or verification scheme exists [Evidence: model-benchmark-sealed-artifacts.vitest.ts 12/12 in 1.71s, exit 0; runtime tsc exit 0]
  - Evidence: targeted Vitest seals and reads all 11 registered artifact kinds through the real filesystem-backed `SealedArtifactStore`; `MODEL_BENCHMARK_SUBSTRATE_IMPORTS_REAL` is `true`.
- [x] CHK-007 [P0] Recipe and cell digest coverage includes canonical bytes, artifact kind, schema version, matrix ordering, model/executor identity, workload, and ordered dependency closure [Evidence: model-benchmark-sealed-artifacts.vitest.ts 12/12 in 1.71s, exit 0; runtime tsc exit 0]
- [x] CHK-008 [P0] Sealed recipe, matrix, cell, observation, and scoring bytes are immutable, writes are atomic, incomplete cells are unreadable, and every semantic change requires a new identity [Evidence: model-benchmark-sealed-artifacts.vitest.ts 12/12 in 1.71s, exit 0; runtime tsc exit 0]
- [x] CHK-009 [P1] Scope is limited to model-benchmark run/scoring artifacts, validity, contamination, workload evidence, fixtures, shared-service adapters, and verification; no authority cutover or adjacent cleanup is included [Evidence: model-benchmark-sealed-artifacts.vitest.ts 12/12 in 1.71s, exit 0; runtime tsc exit 0]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-010 [P0] Equivalent canonical recipes, matrix orderings, and dependency closures produce identical references while every semantic model, executor, fixture, sample, seed, scoring, visibility, workload, or dependency mutation produces a new identity [Evidence: model-benchmark-sealed-artifacts.vitest.ts 12/12 in 1.71s, exit 0; runtime tsc exit 0]
- [x] CHK-011 [P0] Interrupted, retried, duplicate, and concurrent writes never publish partial content or overwrite an existing sealed recipe, cell, observation, or scoring artifact [Evidence: model-benchmark-sealed-artifacts.vitest.ts 12/12 in 1.71s, exit 0; runtime tsc exit 0]
- [x] CHK-012 [P0] Tampered bytes, manifests, model descriptors, capability fingerprints, hidden commitments, cell membership, scoring revisions, contamination state, and workload fields fail closed with typed read results [Evidence: model-benchmark-sealed-artifacts.vitest.ts 12/12 in 1.71s, exit 0; runtime tsc exit 0]
  - Evidence: targeted Vitest rejects tampered/truncated/unsealed references and returns typed `MATRIX_MISMATCH` with the actual nested cell matrix digest for a wrong required digest.
- [x] CHK-013 [P0] Run fixtures bind mode, profile version, model/provider/build/variant, executor, framework, fixtures, samples, seeds, matrix order, visibility, scoring, reporting, and workload [Evidence: model-benchmark-sealed-artifacts.vitest.ts 12/12 in 1.71s, exit 0; runtime tsc exit 0]
- [x] CHK-014 [P0] Model-cell fixtures retain frozen workflow/environment state, capabilities, permissions, prompt/framework and fixture references, raw responses or traces, usage, cost, latency, errors, retries, and integrity observations [Evidence: model-benchmark-sealed-artifacts.vitest.ts 12/12 in 1.71s, exit 0; runtime tsc exit 0]
- [x] CHK-015 [P0] Scoring fixtures retain raw item and family rows beside rubric axes, correctness gates, judge observations, paired deltas, intervals, rank probabilities, multiplicity treatment, and selection status [Evidence: model-benchmark-sealed-artifacts.vitest.ts 12/12 in 1.71s, exit 0; runtime tsc exit 0]
- [x] CHK-016 [P0] Common-anchor fixtures remain paired across compared cells and adaptive diagnostic fixtures record family quotas, selection policy, information inputs, confirmatory status, and exclusion reasons [Evidence: model-benchmark-sealed-artifacts.vitest.ts 12/12 in 1.71s, exit 0; runtime tsc exit 0]
- [x] CHK-017 [P0] Judge and rubric validity fixtures cover candidate/task-cluster calibration, axis perturbations, oracle uncertainty, protocol robustness, and invalid-score refusal [Evidence: model-benchmark-sealed-artifacts.vitest.ts 12/12 in 1.71s, exit 0; runtime tsc exit 0]
- [x] CHK-018 [P0] Contamination fixtures cover source date, first exposure, visibility, matched or semantic evidence, disclosure, retirement, replacement lineage, reference-model difficulty, and hidden-case isolation [Evidence: model-benchmark-sealed-artifacts.vitest.ts 12/12 in 1.71s, exit 0; runtime tsc exit 0]
- [x] CHK-019 [P0] Missing, stale, contaminated, quarantined, unsupported, calibration-invalid, epoch-mismatched, incomplete, or workload-mismatched artifacts cannot reach winner or ship eligibility [Evidence: model-benchmark-sealed-artifacts.vitest.ts 12/12 in 1.71s, exit 0; runtime tsc exit 0]
- [x] CHK-020 [P0] Candidate-facing reads exclude hidden fixtures, exact evaluator internals, protected judge evidence, terminal scoring evidence, and mutable service state [Evidence: model-benchmark-sealed-artifacts.vitest.ts 12/12 in 1.71s, exit 0; runtime tsc exit 0]
  - Evidence: real-store tests block normalized candidate/scorer roles, case and whitespace variants, and unknown roles from sealed scoring matrices, raw judge observations, and oracle validity evidence with `VISIBILITY_MISMATCH`; evaluator and downstream controls receive the full verified material.
- [x] CHK-021 [P0] Workload fixtures retain quality, latency tails, throughput, SLO violations, realized cost, error, abstention, and switching evidence; output-word or quality-per-dollar ratios cannot stand alone [Evidence: model-benchmark-sealed-artifacts.vitest.ts 12/12 in 1.71s, exit 0; runtime tsc exit 0]
- [x] CHK-022 [P1] Complete and checkpointed matrix replay preserves raw sealed artifacts while new reducer, calibration, normalization, or scoring-policy revisions create new derived references [Evidence: model-benchmark-sealed-artifacts.vitest.ts 12/12 in 1.71s, exit 0; runtime tsc exit 0]
- [x] CHK-023 [P1] Model-only claims use independent model and execution crossings, while complete-stack comparisons carry an explicit complete-stack estimand [Evidence: model-benchmark-sealed-artifacts.vitest.ts 12/12 in 1.71s, exit 0; runtime tsc exit 0]
- [x] CHK-024 [P1] Common and model adapters pass identical evaluator, canary, promotion, veto, read-failure, and lifecycle fixtures without semantic drift [Evidence: model-benchmark-sealed-artifacts.vitest.ts 12/12 in 1.71s, exit 0; runtime tsc exit 0]
- [x] CHK-025 [P1] Model-benchmark sealed references bind to the successor certificate/receipt input contract without moving certificate or receipt materialization into this phase [Evidence: model-benchmark-sealed-artifacts.vitest.ts 12/12 in 1.71s, exit 0; runtime tsc exit 0]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-026 [P1] The artifact-to-service manifest enumerates every recipe, run, cell, raw observation, scoring revision, anchor, diagnostic, validity, contamination, workload, dependency digest, read verifier, lifecycle state, and required consumer [Evidence: model-benchmark-sealed-artifacts.vitest.ts 12/12 in 1.71s, exit 0; runtime tsc exit 0]
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-027 [P0] Model dispatch and scoring adapters cannot write sealed evaluator assets, hidden fixtures, protected judge material, promotion thresholds, prior evidence, or projection state [Evidence: model-benchmark-sealed-artifacts.vitest.ts 12/12 in 1.71s, exit 0; runtime tsc exit 0]
- [x] CHK-028 [P0] Hidden-evidence leakage, contamination uncertainty, evaluator-integrity failure, calibration invalidity, dependency mismatch, and stale workload evidence produce non-overridable typed veto or block references [Evidence: model-benchmark-sealed-artifacts.vitest.ts 12/12 in 1.71s, exit 0; runtime tsc exit 0]
- [x] CHK-029 [P1] Candidate visibility, protected fixture isolation, exact-score withholding, capability boundaries, and typed budget policy are enforced at service boundaries rather than stated only in prose [Evidence: model-benchmark-sealed-artifacts.vitest.ts 12/12 in 1.71s, exit 0; runtime tsc exit 0]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-030 [P1] Recipe and matrix identity, cell evidence, scoring layers, anchor/adaptive rules, validity, contamination, workload, read failures, shared-service ownership, and successor expectations are reflected in the phase docs [Evidence: model-benchmark-sealed-artifacts.vitest.ts 12/12 in 1.71s, exit 0; runtime tsc exit 0]
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-031 [P1] Implementation and fixture changes land in dependency-closed, path-scoped commits after the common reducer and phase-007 sealing contracts are pinned [Evidence: model-benchmark-sealed-artifacts.vitest.ts 12/12 in 1.71s, exit 0; runtime tsc exit 0]
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 verifier check passes, the report pins the common sealing and reducer fingerprints, every model-benchmark artifact class is content-addressed and immutable, raw and derived scoring evidence remains reproducible, protected or incomplete inputs fail closed, and shared evaluator/canary/promotion semantics show no variant drift.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the verifier confirms the P0 contract, the strict spec validator passes, the matrix and access-boundary suites are green, and the exact-scope diff check shows no unexpected tracked mutation outside the implementation surface assigned to this phase.
<!-- /ANCHOR:sign-off -->
