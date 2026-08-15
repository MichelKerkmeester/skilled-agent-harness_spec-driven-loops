---
title: "Tasks: Skill Benchmark certificates and receipts"
description: "Tasks for planning and implementing the Skill Benchmark run certificate, transition receipts, replay-fingerprint inputs, paired scenario evidence, scoring gates, and offline verifier adapter over deep-improvement-common services."
trigger_phrases:
  - "Skill Benchmark certificates and receipts tasks"
  - "skill effect certificate tasks"
  - "skill benchmark receipt tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/007-skill-benchmark/004-certificates-and-receipts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/007-skill-benchmark/004-certificates-and-receipts"
    last_updated_at: "2026-08-15T15:50:59Z"
    last_updated_by: "codex"
    recent_action: "Verified HEAD certificate suite and reconciled completion metadata"
    next_safe_action: "Consume this completed additive-dark leaf in resume verification"
    blockers: []
    key_files: []
    completion_pct: 100
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

- [x] T001 [B] Pin Skill Benchmark siblings `001-typed-ledger-schema`, `002-reducers-and-projections`, and `003-sealed-artifacts`, plus the common mode-004 certificate/receipt contract [Evidence: `spec.md` and `plan.md`]
- [x] T002 [P] Inventory current Skill Benchmark run, treatment, exposure, trajectory, gold, scoring, compatibility, risk, and certificate inputs [Evidence: `spec.md` and `plan.md`]
- [x] T003 Record the shared-versus-mode ownership matrix and prove dispatch, evaluator, canary, budget, receipt, sealing, fingerprint, effect-recovery, and verifier services remain common [Evidence: `spec.md` and `implementation-summary.md`]
- [x] T004 [P] Record the phase-012 shared-contract freeze and write-set conflict-graph handoff required before the 010 fan-out [Evidence: `spec.md` and `plan.md`]
- [x] T005 Pin paired-arm, missing-gold, component-ablation, compatibility, composition, security, cost, expiry, tamper, and uncertain-effect fixtures [Evidence: `spec.md` and `checklist.md`]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Define the Skill Benchmark `skill-effect-certificate.v1` adapter over the shared run-level `CERTIFICATE`, including evidence manifests, validity domain, verdicts, and supersession/expiry references [Evidence: `skill-benchmark-certificate-types.ts` and focused Vitest 20/20]
- [x] T007 Define shared-contract `RECEIPT` bindings for treatment assignment, scenario lifecycle, discovery, progressive loading, invocation, resource canaries, milestones, final checks, scoring, and certificate lifecycle [Evidence: `skill-benchmark-certificates.ts` and focused Vitest 20/20]
- [x] T008 Define paired no-skill, auto-route, forced, placebo/distractor, component-ablation, and compatibility-boundary evidence with task/executor blocking and seed/propensity/replicate references [Evidence: `skill-benchmark-certificates.vitest.ts` passed 20/20]
- [x] T009 [P] Define the mode evidence manifest for availability, discovery, loading, invocation, trajectory, constraint coverage, final outcome, raw scores, gold integrity, cost, and risk [Evidence: `skill-benchmark-certificate-validation.ts` and focused Vitest 20/20]
- [x] T010 [P] Define the mode contribution to replay-fingerprint inputs, canonical ordering, semantic field classes, mismatch diagnostics, and excluded storage-local values [Evidence: `skill-benchmark-certificates.ts` and focused Vitest 20/20]
- [x] T011 Define adapter calls to deep-improvement-common evaluator, canary, budget, sealed-artifact, receipt, effect-recovery, promotion, and offline-verifier services without local replacements [Evidence: `skill-benchmark-certificates.ts` and `implementation-summary.md`]
- [x] T012 Define certificate issue, withhold, expire, supersede, `INCOMPLETE`, `VETOED`, and `UNSUPPORTED_VERSION` behavior for missing, stale, incompatible, or unsafe evidence [Evidence: `skill-benchmark-certificates.vitest.ts` passed 20/20]
- [x] T013 Define gold-integrity and mutation-sensitivity gates; prevent empty, pending, or structural-only gold from entering a positive numerator [Evidence: `skill-benchmark-certificates.vitest.ts` passed 20/20]
- [x] T014 Define the mode offline-verifier checks for paired coverage, raw-to-derived score lineage, constraint coverage, compatibility, negative transfer, security, cost, and validity expiry [Evidence: `skill-benchmark-certificates.ts` and focused Vitest 20/20]
- [x] T015 Define dark-write, duplicate, out-of-order, crash-window, legacy-parity, and authority-boundary behavior [Evidence: `skill-benchmark-certificates.ts` and `implementation-summary.md`]
- [x] T016 Publish the shared-service reuse matrix and handoff fields for `005-resume-adapter`, the independent mode gate, and the post-009 010 fan-out [Evidence: `implementation-summary.md` and `plan.md`]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T017 Verify complete, partial, contradictory, tampered, and superseded runs produce the correct certificate outcome and validity domain [Evidence: focused Vitest passed 20/20]
- [x] T018 Verify every scenario and scoring transition produces an idempotent receipt with predecessor links, effect identity, evidence boundary, fingerprint, outcome, and uncertainty [Evidence: focused Vitest passed 20/20]
- [x] T019 Verify paired treatment fixtures preserve task/executor blocking and distinguish realized lift, selection tax, content effect, component effect, and executor interaction [Evidence: focused Vitest passed 20/20]
- [x] T020 Verify availability, discovery, loading, invocation, canary exposure, trajectory, constraint, final-state, and outcome evidence remain separate [Evidence: focused Vitest passed 20/20]
- [x] T021 Verify empty, pending, structural-only, negative, valid, and mutated gold states block or qualify scoring as declared [Evidence: focused Vitest passed 20/20]
- [x] T022 Verify repeated offline replay reproduces fingerprints, receipt chains, raw evidence manifests, score derivations, hard gates, and validity results without live services [Evidence: focused Vitest passed 20/20]
- [x] T023 Verify every declared semantic mutation mismatches the fingerprint and excluded wall-clock, path, process, or storage mutations do not [Evidence: focused Vitest passed 20/20]
- [x] T024 Verify incompatible dependencies, registry changes, executor/tool/permission changes, stale canaries, composition/security failures, cost limits, and negative transfer withhold or expire certificates [Evidence: focused Vitest passed 20/20]
- [x] T025 Verify common-service parity, dark authority behavior, successor resume cases, phase-012 freeze gating, and exact scope [Evidence: focused Vitest passed 20/20 and tsc exited 0]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete [Evidence: T001-T025 checked with concrete artifacts and 20/20 tests]
- [x] All requirements in spec.md met with evidence [Evidence: focused Vitest passed 20/20 and tsc exited 0]
- [x] Phase gate green (validate/replay/receipt/fingerprint/offline-verifier checks as applicable) [Evidence: focused Vitest passed 20/20 and tsc exited 0]
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Predecessor contract**: See `003-sealed-artifacts` and the common mode-004 certificate/receipt services
- **Successor consumer**: See `005-resume-adapter`
<!-- /ANCHOR:cross-refs -->
