---
title: "Tasks: Deep Improvement Common Services - Sealed Reference Artifacts"
description: "Tasks for the sealed reference-artifacts phase of the deep-improvement common-services migration, covering the shared sealing adapter, evaluator capsule, candidate and trial references, canary epochs, promotion evidence, tamper-evident reads, and downstream consumer contract."
trigger_phrases:
  - "deep improvement sealed artifacts tasks"
  - "deep improvement common sealing tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/003-sealed-artifacts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/003-sealed-artifacts"
    last_updated_at: "2026-07-15T20:45:00Z"
    last_updated_by: "opencode"
    recent_action: "Decomposed sealing work into adapter, artifact, read-path, and consumer tasks"
    next_safe_action: "Pin seal primitive behavior and artifact dependency fixtures"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Deep Improvement Common Services - Sealed Reference Artifacts

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

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

- [ ] T001 Confirm `002-reducers-and-projections` publishes artifact-reference, evaluator-epoch, canary-status, promotion-status, and projection-fingerprint inputs
- [ ] T002 Read the phase-007 sealing primitive contract and record canonicalization, digest, dependency, seal-on-write, publication, verification, and failure semantics
- [ ] T003 Build the artifact field and dependency matrix for evaluator capsules, candidate/baseline inputs, raw trials, canary epochs, promotion inputs, and redacted views
- [ ] T004 Define ownership boundaries with `004-certificates-and-receipts`, the three downstream variants, the shared reducer, and the transition-authorized ledger
- [ ] T005 Pin valid, mutated, partial-write, missing-dependency, stale-epoch, stale-canary, leak, and mixed-version fixtures
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T006 [P] Define the single phase-007-backed sealing adapter and typed artifact reference, dependency manifest, lifecycle, verification result, and failure vocabulary
- [ ] T007 [P] Define canonical serialization and digest coverage for each artifact kind, including schema version, ordered dependency closure, and producer/reducer/evaluator fingerprints
- [ ] T008 Define seal-on-write validation, atomic publication, read-back verification, incomplete-write handling, and immutable overwrite refusal
- [ ] T009 Define the evaluator capsule and epoch matcher for fixtures, hidden commitments, rubric, calibration, normalization, environment, capability, visibility, and budget policy
- [ ] T010 Define candidate and baseline input bundles for lineage, incumbent, mutation operator, profile, model/prompt/tool settings, fixture selection, seed, and prerequisite digests
- [ ] T011 Define raw trial output references retaining per-case outputs, raw score vectors, trace/rationale references, usage, cost, latency, environment, integrity observations, and normalization version
- [ ] T012 Define canary epochs with sealed/active/burned/retired lifecycle, freshness, supersession, hidden-suite isolation, semantic leakage detection, and metamorphic references
- [ ] T013 Define promotion input bundles for target repair, baseline preservation, critical dimensions, uncertainty, evaluator integrity, canary outcomes, cost, vetoes, and rollback target
- [ ] T014 Define tamper-evident reads and typed refusal states for missing, digest, dependency, schema, lifecycle, epoch, stale, leak, and quarantine failures
- [ ] T015 Define redacted candidate-facing views and common service adapters for common, agent, model, and skill variants without private seal or promotion semantics
- [ ] T016 [P] Add reference-only integration points for `004-certificates-and-receipts`; keep receipt and certificate materialization out of this phase
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T017 Verify equivalent canonical inputs produce identical content-addressed references and each covered content, schema, producer, fixture, calibration, or dependency mutation produces a new identity
- [ ] T018 Verify interrupted and duplicate writes never publish partial artifacts or overwrite an existing sealed artifact
- [ ] T019 Verify tampered bytes, manifests, dependency references, lifecycle fields, hidden commitments, and evaluator epochs fail closed with typed read results
- [ ] T020 Verify evaluator, candidate, baseline, raw trial, canary, and promotion fixtures remain reproducible after reducer and normalization-policy changes
- [ ] T021 Verify canary leakage, stale, burned, retired, and superseded states block unsafe evaluation or promotion while preserving original evidence
- [ ] T022 Verify promotion input cannot reach ship eligibility without complete target, preservation, critical-dimension, integrity, canary, uncertainty, cost, and rollback evidence
- [ ] T023 Verify common, agent, model, and skill adapters consume identical seal, evaluator, canary, read-failure, promotion-input, and veto semantics
- [ ] T024 Verify candidate-facing views exclude hidden fixtures, exact evaluator internals, exact scores, terminal evidence, and mutable service state
- [ ] T025 Run the phase validator, replay/property suite, crash and mutation suite, access-boundary suite, and exact-scope diff check
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with evidence
- [ ] Phase gate green (validate/replay/property/failure-injection as applicable)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
