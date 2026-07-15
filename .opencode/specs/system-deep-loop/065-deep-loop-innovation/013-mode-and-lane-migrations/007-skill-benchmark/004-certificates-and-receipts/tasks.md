---
title: "Tasks: Skill Benchmark certificates and receipts"
description: "Tasks for planning and implementing the Skill Benchmark run certificate, transition receipts, replay-fingerprint inputs, paired scenario evidence, scoring gates, and offline verifier adapter over deep-improvement-common services."
trigger_phrases:
  - "Skill Benchmark certificates and receipts tasks"
  - "skill effect certificate tasks"
  - "skill benchmark receipt tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/007-skill-benchmark/004-certificates-and-receipts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/007-skill-benchmark/004-certificates-and-receipts"
    last_updated_at: "2026-07-15T21:30:00Z"
    last_updated_by: "opencode"
    recent_action: "Scoped Skill Benchmark attestations to scenario and scoring evidence"
    next_safe_action: "Freeze mode fields against shared certificate, receipt, and verifier contracts"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Skill Benchmark Certificates and Receipts

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

- [ ] T001 [B] Pin Skill Benchmark siblings `001-typed-ledger-schema`, `002-reducers-and-projections`, and `003-sealed-artifacts`, plus the common mode-004 certificate/receipt contract
- [ ] T002 [P] Inventory current Skill Benchmark run, treatment, exposure, trajectory, gold, scoring, compatibility, risk, and certificate inputs
- [ ] T003 Record the shared-versus-mode ownership matrix and prove dispatch, evaluator, canary, budget, receipt, sealing, fingerprint, effect-recovery, and verifier services remain common
- [ ] T004 [P] Record the phase-009 shared-contract freeze and write-set conflict-graph handoff required before the 010 fan-out
- [ ] T005 Pin paired-arm, missing-gold, component-ablation, compatibility, composition, security, cost, expiry, tamper, and uncertain-effect fixtures
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T006 Define the Skill Benchmark `skill-effect-certificate.v1` adapter over the shared run-level `CERTIFICATE`, including evidence manifests, validity domain, verdicts, and supersession/expiry references
- [ ] T007 Define shared-contract `RECEIPT` bindings for treatment assignment, scenario lifecycle, discovery, progressive loading, invocation, resource canaries, milestones, final checks, scoring, and certificate lifecycle
- [ ] T008 Define paired no-skill, auto-route, forced, placebo/distractor, component-ablation, and compatibility-boundary evidence with task/executor blocking and seed/propensity/replicate references
- [ ] T009 [P] Define the mode evidence manifest for availability, discovery, loading, invocation, trajectory, constraint coverage, final outcome, raw scores, gold integrity, cost, and risk
- [ ] T010 [P] Define the mode contribution to replay-fingerprint inputs, canonical ordering, semantic field classes, mismatch diagnostics, and excluded storage-local values
- [ ] T011 Define adapter calls to deep-improvement-common evaluator, canary, budget, sealed-artifact, receipt, effect-recovery, promotion, and offline-verifier services without local replacements
- [ ] T012 Define certificate issue, withhold, expire, supersede, `INCOMPLETE`, `VETOED`, and `UNSUPPORTED_VERSION` behavior for missing, stale, incompatible, or unsafe evidence
- [ ] T013 Define gold-integrity and mutation-sensitivity gates; prevent empty, pending, or structural-only gold from entering a positive numerator
- [ ] T014 Define the mode offline-verifier checks for paired coverage, raw-to-derived score lineage, constraint coverage, compatibility, negative transfer, security, cost, and validity expiry
- [ ] T015 Define dark-write, duplicate, out-of-order, crash-window, legacy-parity, and authority-boundary behavior
- [ ] T016 Publish the shared-service reuse matrix and handoff fields for `005-resume-adapter`, the independent mode gate, and the post-009 010 fan-out
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T017 Verify complete, partial, contradictory, tampered, and superseded runs produce the correct certificate outcome and validity domain
- [ ] T018 Verify every scenario and scoring transition produces an idempotent receipt with predecessor links, effect identity, evidence boundary, fingerprint, outcome, and uncertainty
- [ ] T019 Verify paired treatment fixtures preserve task/executor blocking and distinguish realized lift, selection tax, content effect, component effect, and executor interaction
- [ ] T020 Verify availability, discovery, loading, invocation, canary exposure, trajectory, constraint, final-state, and outcome evidence remain separate
- [ ] T021 Verify empty, pending, structural-only, negative, valid, and mutated gold states block or qualify scoring as declared
- [ ] T022 Verify repeated offline replay reproduces fingerprints, receipt chains, raw evidence manifests, score derivations, hard gates, and validity results without live services
- [ ] T023 Verify every declared semantic mutation mismatches the fingerprint and excluded wall-clock, path, process, or storage mutations do not
- [ ] T024 Verify incompatible dependencies, registry changes, executor/tool/permission changes, stale canaries, composition/security failures, cost limits, and negative transfer withhold or expire certificates
- [ ] T025 Verify common-service parity, dark authority behavior, successor resume cases, phase-009 freeze gating, and exact scope
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with evidence
- [ ] Phase gate green (validate/replay/receipt/fingerprint/offline-verifier checks as applicable)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Predecessor contract**: See `003-sealed-artifacts` and the common mode-004 certificate/receipt services
- **Successor consumer**: See `005-resume-adapter`
<!-- /ANCHOR:cross-refs -->
