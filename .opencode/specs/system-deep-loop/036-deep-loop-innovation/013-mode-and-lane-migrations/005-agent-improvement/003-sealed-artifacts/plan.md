---
title: "Implementation Plan: Agent Improvement - Sealed Reference Artifacts"
description: "Implementation Plan for the agent-improvement sealed-artifacts phase: bind typed AgentIR changes, frozen improver inputs, causal proposal evidence, normalized trajectories, behavior-family trials, and promotion references to the deep-improvement-common sealing and evaluator services."
trigger_phrases:
  - "agent improvement sealed artifacts implementation plan"
  - "agent improvement AgentIR sealing plan"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/005-agent-improvement/003-sealed-artifacts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/005-agent-improvement/003-sealed-artifacts"
    last_updated_at: "2026-07-15T20:50:00Z"
    last_updated_by: "opencode"
    recent_action: "Mapped agent-specific seal boundaries across proposal and trial artifacts"
    next_safe_action: "Resolve AgentIR dependency closure with the shared sealing contract"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Agent Improvement - Sealed Reference Artifacts

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop / agent-improvement mode |
| **Change class** | Mode-specific artifact identity, sealing bindings, read verification, and evaluator-boundary contract |
| **Execution** | Isolated implementation after the reducer and common sealed-artifact contracts are frozen; no authority cutover |

### Overview
This phase makes the agent-improvement proposal loop reproducible at its immutable evidence boundaries. It does not create a
local seal or re-implement evaluator, canary, scoring, or promotion services. It adapts the deep-improvement-common contract
to the variant's typed AgentIR, change contract, improver lane, causal failure evidence, candidate package, normalized
trajectory, behavior-family, executor, and four-ring exposure artifacts. Each reference is canonicalized, dependency-closed,
sealed before publication, and verified before consumption. Raw evidence remains addressable when reducers, evaluator policy,
or canary epochs change; the successor binds the verified references into certificates and receipts.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] `002-reducers-and-projections` publishes the artifact references, evaluator epoch, canary status, promotion status, and projection fingerprints consumed by this phase
- [ ] The shared phase-006 sealing primitive and deep-improvement-common adapter publish canonicalization, digest, dependency, seal-on-write, publication, and verification semantics
- [ ] The AgentIR and change-contract field matrix names every immutable component, inherited dependency, patch operation, producer, consumer, and visibility rule
- [ ] The improver lane, causal evidence, behavior-family, executor, four-ring, and canary ownership boundaries are explicit
- [ ] Common evaluator, canary, redaction, and promotion services expose the agent-specific binding seams without private variant replacements
- [ ] Valid, mutated, partial-write, missing-dependency, stale-epoch, hidden-leak, executor-mismatch, and mixed-version fixtures are identified

### Definition of Done

- [ ] Agent inputs, proposals, trials, trajectories, and promotion references are content-addressed, sealed on write, immutable after publication, and verified through the common adapter
- [ ] Candidate lineage binds AgentIR, change contract, improver, causal evidence, evaluator, executor, fixture, seed, and raw output references
- [ ] Behavior-family, semantic-variant, untouched-sentinel, and rotating-canary evidence remains reproducible without hidden-content exposure
- [ ] Agent-improvement consumes common evaluator, canary, scoring, redaction, and promotion semantics without a fork
- [ ] Strict validation and the phase verifier pass without tracked changes outside the phase implementation scope
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Single sealing adapter**: use the deep-improvement-common adapter over the phase-006 primitive for canonicalize, digest, seal, publish, inspect, and verify. The agent variant owns fields and bindings, not alternate cryptography or storage.
- **Base AgentIR bundle**: seal canonical AgentIR, inheritance graph, component IDs, authority/capability policy, tool schemas, routing and memory configuration, inference settings, executor descriptor, and parent artifact digest.
- **Change-contract bundle**: seal typed patch operations, changed and inherited clauses, intended behavior, preserved behavior, static assertions, trace policies, generated scenario references, and behavioral-semver impact before proposal generation.
- **Improver-lane reference**: bind improver model/build, optimizer version, training/dev/sealed failure corpora, mutation policy, candidate-visible evidence policy, and query budget. Freeze this reference for the experiment.
- **Causal evidence bundle**: seal failure clusters, first-divergent trace references, known-defect loci, intervention plan, prior candidate lineage, and bounded textual-gradient or diagnostic evidence used to propose a patch.
- **Candidate proposal artifact**: seal canonical candidate AgentIR/package bytes, parent and operator lineage, atomic patch set, proposal rationale references, and the input dependency closure. Multi-locus proposals remain identifiable and require later ablation.
- **Agent trial and trajectory artifacts**: bind evaluator capsule, task and behavior-family manifest, seed, executor/environment, semantic variants, authority conflicts, side effects, predicates, raw normalized traces, and per-case result vectors before reducer scoring.
- **Four-ring exposure manifest**: bind visible optimizer fixtures, sealed semantic variants, untouched-family sentinels, and rotating canaries to one exposure epoch. A proposer-visible failure retires the affected hidden reference through a new lifecycle event, never by mutation.
- **Tamper-evident read path**: verify digest, schema, dependency closure, seal state, evaluator epoch, canary freshness, exposure scope, executor compatibility, and common lifecycle before returning a usable reference. Return typed refusal rather than stale or guessed content.
- **Common service boundary**: pass verified references to the shared evaluator, canary, scoring, redaction, and promotion services. The variant adds no private service semantics and does not materialize the successor certificate.
- **Successor binding**: expose a verified promotion input containing candidate/base digests, family evidence, evaluator and environment digests, canary status, transfer coverage, and rollback parent for `004-certificates-and-receipts`.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- Confirm `002-reducers-and-projections` is frozen for artifact references, evaluator epoch, canary status, promotion status, and projection fingerprints.
- Read the shared phase-006 sealing primitive and deep-improvement-common adapter contract; record canonicalization, dependency ordering, publication, verification, lifecycle, and failure semantics. Reject duplicate sealing behavior.
- Build the AgentIR, change-contract, improver, causal-evidence, candidate, trajectory, behavior-family, executor, four-ring, canary, and successor-binding field matrix.
- Pin representative fixtures for a valid base/candidate lineage, one causal proposal, one clean and perturbed trial, one non-discovery executor, one active and one retired canary, and every declared read failure.

### Phase 2: Implementation

- Define the agent-specific adapter types over the common artifact reference, dependency manifest, lifecycle, verification result, and failure vocabulary.
- Define canonical serialization and digest coverage for AgentIR components, inheritance, capabilities, tools, routing, memory, inference, executor, and parent lineage.
- Define the change-contract and improver-lane artifacts, including typed patch operations, inherited clauses, optimizer identity, frozen corpus references, visibility, and query budget.
- Define causal failure and proposal artifacts for first divergence, known loci, intervention plans, textual-gradient evidence, patch lineage, and candidate package bytes.
- Define trial and normalized trajectory artifacts for task families, semantic variants, authorities, side effects, predicates, seeds, executor/environment, raw outputs, and integrity observations.
- Bind the common evaluator capsule and normalization version to every candidate/base comparison; require changed candidates to execute freshly even when raw evaluator replay is allowed.
- Define behavior-family and four-ring exposure manifests, including act/refuse/clarify, authority conflict, transition, side-effect, untouched-family, semantic-variant, and rotating-canary references.
- Define candidate-facing redacted views and hidden-content boundaries; exact scores, evaluator internals, hidden fixtures, and terminal evidence remain unavailable to proposal generation.
- Define typed tamper-evident reads, quarantine and stale states, executor mismatch handling, and missing-sample or insufficient-evidence semantics through the common service contract.
- Add reference-only integration points for `004-certificates-and-receipts`; keep certificate, receipt, and effect-recovery materialization out of this phase.

### Phase 3: Verification

- Verify equivalent AgentIR and dependency inputs produce identical references, while every covered component, clause, operator, evaluator, executor, fixture, seed, or dependency mutation produces a new identity.
- Inject interruption, duplicate writes, truncation, manifest mutation, dependency removal, stale epoch, hidden leak, and executor mismatch; assert typed fail-closed results and immutable prior bytes.
- Replay proposal, candidate, trial, trajectory, behavior-family, and four-ring fixtures after reducer, normalization, evaluator, or canary changes; compare raw references and derived eligibility without mutation.
- Verify causal evidence identifies the sealed first-divergent trace and candidate lineage without exposing hidden fixture content or exact terminal scores.
- Verify common evaluator, canary, redaction, scoring, and promotion services consume agent references with identical lifecycle and veto semantics.
- Verify the successor binding carries complete candidate/base, family, evaluator, environment, canary, transfer, and rollback references without creating a certificate here.
- Run strict spec validation and the phase-specific property, failure-injection, access-boundary, replay, and exact-scope gates on the implementation candidate.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Adapter contract tests prove every agent artifact uses the common phase-006-backed seal and reject alternate seal metadata or verification paths |
| REQ-002 | AgentIR property tests mutate inherited clauses, capabilities, tools, routing, memory, inference, executor, and parent references and prove dependency-closed identity changes |
| REQ-003 | Change-contract fixtures round-trip typed patch operations, intended/preserved behavior, clause obligations, static assertions, scenario references, and behavioral-semver impact |
| REQ-004 | Improver-lane fixtures bind model/build, optimizer, train/dev/sealed corpus, operator, visibility, and budget and reject mid-experiment mutation |
| REQ-005 | Causal fixtures preserve failure clusters, first-divergent traces, known loci, interventions, bounded diagnostic evidence, and proposal lineage before candidate creation |
| REQ-006 | Trial and trajectory fixtures reproduce candidate/base execution from evaluator, executor, environment, task, family, variant, seed, raw trace, side-effect, and predicate references |
| REQ-007 | Coverage fixtures exercise clauses, authority conflicts, transitions, side effects, negative capability, perturbations, untouched families, semantic variants, executors, and rotating canaries |
| REQ-008 | Tamper, missing, truncation, unsupported-schema, stale, leaked, quarantined, epoch, visibility, and executor-mismatch fixtures return typed refusal without usable fallback content |
| REQ-009 | Common service fixtures compare agent-improvement with the common evaluator, canary, scoring, redaction, promotion-input, and veto semantics and show no private fork |
| REQ-010 | Re-reduction, evaluator-epoch, normalization, canary-retirement, and exposure fixtures preserve raw artifacts while producing new derived references |
| REQ-011 | Successor-binding fixtures verify the certificate/receipt consumer receives verified digests and rollback references without materializing successor-owned artifacts |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The primary inputs are `002-reducers-and-projections` for artifact references and shared service status, the shared phase-006
sealing primitives for all digest, publication, and verification behavior, and
`004-deep-improvement-common/003-sealed-artifacts` for the common evaluator, canary, redaction, scoring, and promotion-input
contract. The phase also consumes the phase 012 shared mode interfaces and write-set conflict graph. The successor
`004-certificates-and-receipts` binds the verified references into the behavioral transfer certificate and receipts. The
typed-ledger, resume, shadow-parity, rollback, and mode-gate siblings consume this phase's references but do not redefine its
seal or read semantics.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Implementation is additive at the agent artifact and service-read boundaries. If sealing, dependency closure, access control,
or replay parity fails, stop publishing or consuming the new agent references, preserve all already sealed bytes and ledger
evidence, and restore the prior reader or projection snapshot through the migration bridge. Do not delete, rewrite, re-seal,
or reinterpret an old AgentIR, proposal, trajectory, or canary reference to repair a bad verifier. Quarantine affected
references through the common lifecycle, rebuild derived indexes from the last known-good frontier, and use a path-scoped
`git revert` of phase commits to restore prior adapters. The retained raw artifacts and fixtures permit a corrected read path to
be replayed without changing candidate history or moving authority.
<!-- /ANCHOR:rollback -->
