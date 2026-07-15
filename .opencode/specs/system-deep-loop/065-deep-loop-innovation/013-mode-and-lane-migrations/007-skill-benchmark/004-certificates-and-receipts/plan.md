---
title: "Implementation Plan: Skill Benchmark certificates and receipts"
description: "Implementation Plan for the Skill Benchmark certificates and receipts phase: bind paired scenario and scoring evidence to the deep-improvement-common certificate, receipt, replay, and offline-verifier services without duplicating the shared backbone."
trigger_phrases:
  - "Skill Benchmark certificates and receipts implementation plan"
  - "skill benchmark effect certificate plan"
  - "skill benchmark offline verifier plan"
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
# Implementation Plan: Skill Benchmark Certificates and Receipts

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop / deep-improvement-common / skill-benchmark mode migration |
| **Change class** | Mode-specific certificate, receipt, replay-input, and offline-verifier contract |
| **Execution** | Additive dark path after shared contracts; planning output only |

### Overview
The phase specializes one shared evaluator-first attestation contract for Skill Benchmark. The run-level certificate binds a
randomized treatment lattice, staged skill exposure, raw scoring and gold evidence, compatibility slices, and a bounded effect
verdict. Transition receipts bind each scenario and scoring step to its predecessor evidence, effect identity, replay fingerprint,
and recovery outcome. Deep-improvement-common owns the certificate fields, receipt chain, fingerprint serializer, evaluator,
canary, promotion, budget, sealing, and offline-verifier machinery; this lane supplies only scenario and scoring adapters. The
phase remains dark and cannot authorize a cutover. The later 010 fan-out waits for phase 009 to freeze shared contracts and emit
the dependency/write-set conflict graph.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The `003-sealed-artifacts` primitives and shared mode-004 certificate/receipt contract are pinned by version and digest
- [ ] Sibling typed-ledger and reducer/projection contracts name the Skill Benchmark event, projection, and raw-evidence boundaries
- [ ] The deep-improvement-common ownership matrix identifies every reused service and rejects local replacements
- [ ] The paired treatment lattice, scenario lifecycle, exposure stages, gold policy, scoring axes, and validity slices are explicit
- [ ] The shared fingerprint serializer and offline-verifier sequence are available for mode-specific inputs
- [ ] The phase-009 freeze and write-set conflict graph handoff is recorded before 010 migration integration

### Definition of Done
- [ ] The Skill Benchmark certificate and receipt adapter attests paired scenario and scoring evidence without semantic forks
- [ ] Replay fingerprints change for every declared mode-semantic mutation and remain stable for excluded storage values
- [ ] The offline verifier recomputes mode evidence without live executor or network access and preserves incomplete/unknown states
- [ ] Gold, compatibility, security, cost, negative-transfer, and expiry gates cannot be rescued by an aggregate score
- [ ] The successor resume adapter and independent mode gate have explicit receipt, certificate, validity, and recovery inputs
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Shared contract adapter**: call the deep-improvement-common `CERTIFICATE`, `RECEIPT`, replay-fingerprint, effect-recovery, evaluator, canary, promotion, sealed-artifact, budget, and offline-verifier services. Do not add a Skill Benchmark receipt chain or verifier implementation.
- **Run certificate**: specialize the common run attestation with the skill bundle, treatment design, paired cells, task/executor/environment slice, staged exposure evidence, raw observations, gold policy, constraint coverage, scoring outputs, compatibility/risk evidence, validity domain, and issue/withhold/expire rationale.
- **Transition receipts**: emit shared receipts for design, assignment, scenario lifecycle, discovery, loading, invocation, canary exposure, milestone/final checks, gold gate, scoring, certificate lifecycle, expiry, and supersession. Reference prior receipts and evidence rather than copying the run manifest.
- **Treatment and causal evidence**: keep no-skill/control, auto-route, forced activation, placebo/distractor, component-ablation, and compatibility-boundary arms independently addressable, with task and executor blocking metadata for paired contrasts.
- **Evidence layers**: preserve discovery/invocation/trajectory/constraint/outcome stages, deterministic final-state checks, dynamic reference functions, raw item scores, normalized scores, and policy decisions as separate content-addressed records.
- **Fingerprint layer**: extend the shared canonical input tuple with treatment, bundle, registry, gold, task, workload, compatibility, canary, raw-evidence order, constraint, and score-policy inputs. Exclude wall-clock and storage-local values under the common rules.
- **Verifier layer**: reuse the common offline sequence, then add mode checks for treatment coverage, gold integrity and mutation sensitivity, constraint coverage, compatibility slices, negative transfer, composition/security probes, paired effect calculations, and validity/expiry.
- **Authority boundary**: certificate and receipts are additive evidence beside the legacy path. They do not change authority, publish a skill, or permit a cutover; phase 014 owns authority and phase 010 waits for the 009 shared-contract freeze.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm the mode's `001-typed-ledger-schema`, `002-reducers-and-projections`, and `003-sealed-artifacts` contracts and the common mode-004 certificate/receipt service versions.
- Inventory current Skill Benchmark run, treatment, exposure, trajectory, gold, scoring, compatibility, and certificate inputs; map each to shared service fields or a mode-specific adapter field.
- Record the shared-versus-mode ownership matrix, the Skill Benchmark write set, the phase-009 freeze gate, and the successor `005-resume-adapter` handoff.
- Pin paired-treatment, empty/pending-gold, component-ablation, compatibility, composition, security, cost, stale-validity, and uncertain-effect fixtures.

### Phase 2: Implementation
- Define the Skill Benchmark certificate projection over the shared certificate schema, including `skill-effect-certificate.v1` fields, evidence manifests, verdict states, validity domain, and supersession/expiry references.
- Define mode transition receipt bindings for treatment assignment, scenario execution, discovery/loading/invocation, resource canaries, milestones, final checks, gold decisions, scoring, issuance, withholding, expiry, and recovery.
- Define the mode fingerprint contribution and canonical field order for treatment cells, bundle/registry/task/gold/executor/environment digests, raw observation ordering, scoring policy, compatibility, workload, budgets, and predecessor evidence.
- Define the adapter calls to common evaluator, canary, budget, receipt, effect-recovery, sealed-artifact, promotion, and offline-verifier services; add no local implementation of those services.
- Define the mode verifier checks for paired-cell parity, staged exposure, constraint coverage, gold mutation sensitivity, raw-to-derived score lineage, negative transfer, compatibility/security, cost, and validity expiry.
- Define dark-write and legacy-parity behavior for missing gold, incomplete observations, unavailable offline evidence, unknown versions, duplicate/out-of-order receipts, stale artifacts, and crash windows.
- Publish the adapter and reuse matrix for the independent mode gate and `005-resume-adapter`; block 010 integration until phase 009 publishes the frozen shared contracts and conflict graph.

### Phase 3: Verification
- Recompute certificates and receipt fingerprints from identical semantic fixtures across processes and serialization orders.
- Mutate each mode-semantic input class and assert a mismatch; mutate excluded wall-clock, path, process, and storage values and assert fingerprint stability.
- Run the verifier without live agents or network access and compare hashes, receipt continuity, gold gates, paired treatment evidence, score derivations, hard vetoes, and validity outcomes.
- Verify `PASS`, `FAIL`, `VETOED`, `INCOMPLETE`, `UNSUPPORTED_VERSION`, and `UNKNOWN` remain distinct and that incomplete or unsafe evidence cannot become a positive certificate.
- Verify all shared services are consumed through common adapters, dark evidence cannot change authority, and the successor resume contract receives explicit replay, salvage, reconcile, and block cases.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Complete, partial, contradictory, tampered, and superseded run fixtures require the shared certificate schema and validate mode evidence, digests, verdict, and validity fields |
| REQ-002 | Assignment, discovery, loading, invocation, scoring, issue, withhold, expiry, crash-window, and recovery fixtures assert idempotent receipt identity, predecessor links, and explicit uncertainty |
| REQ-003 | Paired no-skill, auto-route, forced, placebo/distractor, component-ablation, and compatibility fixtures retain task/executor blocking, seed, propensity, replicate, outcome, and cost evidence |
| REQ-004 | Exposure and trajectory fixtures keep availability, discovery, loading, invocation, canary, milestone, constraint, final-state, and outcome evidence separate |
| REQ-005 | Empty, pending, structural-only, negative, mutated, and valid gold fixtures assert blocking or exclusion rules and mutation sensitivity before positive scoring |
| REQ-006 | Raw observation, normalization, calibration, dynamic reference, constraint, cost, latency, token, and reducer-version mutations preserve raw evidence and change only derived records |
| REQ-007 | Dependency, registry, executor, tool, permission, environment, workload, composition, security, stale-canary, and negative-transfer fixtures withhold or expire out-of-domain certificates |
| REQ-008 | Cross-process canonicalization tests keep identical semantic fingerprints stable and make each treatment, evidence, policy, bundle, capability, budget, retry, or predecessor mutation mismatch |
| REQ-009 | An offline verifier with live services unavailable resolves sealed references and independently checks fingerprints, receipts, scores, gold, hard vetoes, and validity |
| REQ-010 | Shared adapter parity tests compare common, agent-improvement, model-benchmark, and Skill Benchmark certificate fields, receipt outcomes, fingerprints, verifier results, and hard-veto order |
| REQ-011 | A phase-009 freeze fixture blocks 010 migration acceptance until shared contract versions and the executable write-set conflict graph are present |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

This phase consumes the typed event and projection boundaries from Skill Benchmark siblings `001-typed-ledger-schema` and
`002-reducers-and-projections`, the `003-sealed-artifacts` primitives, and the deep-improvement-common mode-004 certificate,
receipt, evaluator, canary, promotion, budget, effect-recovery, fingerprint, and offline-verifier services. It also consumes
phase 012 shared mode interfaces and must wait for phase 009 to freeze shared contracts and emit the dependency/write-set
conflict graph before the 010 per-mode fan-out. The successor `005-resume-adapter` consumes receipt recovery and certificate
validity cases. The manifest records `depends_on: []` for this planning child; implementation still fails closed when a consumed
contract is missing or incompatible.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

This phase changes no authority and produces no destructive data migration. If the mode adapter, fingerprint contribution, or
offline verification path fails parity, stop emitting or accepting the new mode certificate while retaining append-only events,
receipts, sealed artifacts, and raw observations. Disable the candidate mode contract version, route reads through the prior
shared adapter or pinned old runtime, and preserve a typed superseded, incomplete, or unsupported result rather than deleting
evidence. A path-scoped revert restores the prior dark reader; uncertain effects remain under the common recovery policy and are
never retried or marked successful solely from process status.
<!-- /ANCHOR:rollback -->
