---
title: "Implementation Plan: Deep Improvement Common Services - Sealed Reference Artifacts"
description: "Implementation Plan for the sealed reference-artifacts phase of the deep-improvement common-services migration. The plan composes the existing sealing primitive into content-addressed evaluator, candidate, trial, canary, and promotion inputs with seal-on-write and tamper-evident reads shared by the three downstream variants."
trigger_phrases:
  - "deep improvement sealed artifacts implementation plan"
  - "deep improvement evaluator capsule plan"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/003-sealed-artifacts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/003-sealed-artifacts"
    last_updated_at: "2026-07-15T20:45:00Z"
    last_updated_by: "opencode"
    recent_action: "Mapped seal boundaries across evaluator, candidate, trial, canary, and promotion artifacts"
    next_safe_action: "Resolve canonicalization and dependency closure with the phase-006 sealing contract"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Deep Improvement Common Services - Sealed Reference Artifacts

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop / deep-improvement common services |
| **Change class** | Shared artifact identity, sealing, read verification, and service-boundary contract |
| **Execution** | Isolated implementation after `002-reducers-and-projections`; downstream consumers wait for the shared contract freeze |

### Overview

This phase makes the shared evaluator-first loop reproducible at its evidence boundaries. It does not create a local hash or storage protocol. It adapts the phase-006 sealing primitives into one artifact contract used by evaluator, canary, and promotion services: canonical bytes are dependency-closed and sealed before publication; reads verify the seal before returning data; and later reduction or policy changes create new derived references rather than mutating old evidence. The common service owns the contract for the three downstream variants, while `004-certificates-and-receipts` binds accepted service outcomes into certificates and receipts.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] `002-reducers-and-projections` publishes the artifact-reference, evaluator-epoch, canary-status, promotion-status, and projection-fingerprint inputs consumed by this phase
- [ ] The phase-006 sealing primitive publishes its canonicalization, digest, seal-on-write, publication, and verification contract
- [ ] The artifact field matrix names every immutable input/output, dependency digest, producer, consumer, visibility rule, and lifecycle state
- [ ] Ownership is separated from `004-certificates-and-receipts` and from the three downstream variant migrations
- [ ] The common evaluator, canary, and promotion service boundaries define the redacted and hidden information surfaces before implementation begins
- [ ] Mutation, crash, truncation, missing-dependency, stale-epoch, leak, replay, and mixed-version fixtures are identified

### Definition of Done

- [ ] Every common artifact is content-addressed, sealed on write, immutable after publication, and verified on read through the phase-006 primitive
- [ ] Evaluator, canary, and promotion services consume one sealed-reference contract with explicit failure and veto states
- [ ] Raw observations and dependency references remain reproducible after reducer, normalization, and evaluator-policy changes
- [ ] All three downstream variants pass common seal/read/service fixtures without semantic forks
- [ ] Strict validation and the phase verifier pass without tracked changes outside the phase implementation scope
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Single sealing adapter**: expose one common API over the phase-006 primitive for canonicalize, digest, seal, publish, inspect, and verify. The adapter owns no alternate hash, signature, chain, or storage semantics.
- **Content identity**: derive an artifact digest from canonical artifact bytes, artifact kind, schema version, and an ordered dependency-digest closure. Operational timestamps, access traces, and storage locations are references or audit events, not silent content inputs.
- **Seal-on-write boundary**: validate the artifact schema and dependency references, canonicalize bytes, invoke the shared seal primitive, publish atomically, and emit the authorized reference only after the sealed bytes can be read back and verified. An incomplete write is never a usable artifact.
- **Evaluator capsule**: seal the evaluator implementation/schema fingerprint, rubric or policy, visible and hidden fixture commitments, calibration corpus, normalization policy, environment/capability descriptor, query visibility, and typed budget policy as one epoch. A trial cannot combine fields from separate capsules.
- **Candidate and baseline inputs**: seal candidate source/configuration, baseline or incumbent reference, mutation-operator lineage, profile scope, model/prompt/tool settings, fixture selection, deterministic seed, and prerequisite artifacts. A changed parent, operator, profile, or capability creates a new input identity.
- **Raw trial outputs**: preserve per-case outputs and digests, raw score vectors, rationales or trace references, usage/cost/latency, runtime environment, integrity observations, and normalization version before reducers derive scores or projections.
- **Canary epoch**: seal hidden, adversarial, metamorphic, and cross-domain canary manifests as a versioned epoch. Lifecycle is append-only: `sealed` -> `active` -> `burned` or `retired`; freshness, leakage, and supersession are explicit read checks rather than in-place edits.
- **Promotion input**: assemble a digest-verified evidence bundle from target repair, baseline preservation, critical dimensions, lower-bound or uncertainty-aware scoring, evaluator integrity, canary results, cost, and stable rollback target. The bundle is an input to promotion, not the final certificate owned by the successor.
- **Tamper-evident read path**: verify digest, canonical bytes, schema compatibility, dependency closure, seal lifecycle, evaluator epoch, canary freshness, access scope, and any phase-006 chain/signature requirement. Return typed `missing`, `digest_mismatch`, `dependency_mismatch`, `schema_unsupported`, `epoch_mismatch`, `stale`, `leak_detected`, or `quarantined` results rather than stale or guessed content.
- **Information boundary**: generators receive only permitted candidate-facing commitments or thresholded verdict bands. Evaluators receive sealed trial inputs and hidden material through a narrow adapter. Canary and promotion services consume references plus verified outputs and cannot rewrite source artifacts, fixtures, or prior observations.
- **Variant consumption**: common, agent, model, and skill workstreams use the same artifact kinds, lifecycle, verification failures, and promotion-input semantics. Variant-specific operators may produce new candidate payloads but may not redefine common evaluator identity, canary status, or seal verification.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- Confirm `002-reducers-and-projections` is frozen for artifact references, evaluator epoch status, canary lifecycle, promotion status, and projection fingerprints.
- Read the phase-006 sealing primitive contract and record its canonicalization, digest, dependency, publication, verification, and failure semantics; reject any design that duplicates them.
- Build the artifact field and dependency matrix for evaluator capsules, candidate/baseline inputs, raw trials, canary epochs, promotion inputs, and redacted views.
- Pin representative fixtures for one valid epoch, one candidate/baseline comparison, one raw trial, one active and one burned canary, one eligible promotion bundle, and each declared read failure.

### Phase 2: Implementation

- Define the single sealing adapter and its typed artifact reference, dependency manifest, lifecycle, verification result, and failure vocabulary.
- Define canonical serialization and digest coverage for each artifact kind, including nested references, ordered dependency closure, schema version, and producer/reducer/evaluator fingerprints.
- Define seal-on-write publication with validation, atomicity, read-back verification, incomplete-write handling, and immutable overwrite refusal.
- Define the evaluator capsule and epoch matcher, including fixture and hidden-anchor commitments, calibration, normalization, environment, visibility, and budget policy.
- Define candidate/baseline input bundles and raw trial output references that retain lineage, operator, profile, model/prompt/tool settings, seed, fixture selection, raw observations, usage, and integrity data.
- Define canary epochs, sealed/active/burned/retired lifecycle, freshness and supersession checks, literal and semantic leakage detection, and candidate isolation.
- Define promotion input assembly and admissibility checks for target repair, baseline preservation, critical dimensions, uncertainty, evaluator integrity, canary outcomes, cost, vetoes, and rollback target.
- Define candidate-facing redacted views and service adapters for common, agent, model, and skill variants without allowing private common-contract replacements.
- Add reference-only integration with the successor certificate/receipt contract; do not implement successor-owned receipt or certificate materialization here.

### Phase 3: Verification

- Verify identical canonical inputs and dependency closures produce identical sealed references, while any content, schema, producer, fixture, calibration, or dependency change produces a new identity.
- Inject interruption before publication, after publication, during read, and after dependency removal; assert no partial or overwritten artifact is accepted.
- Tamper with bytes, manifests, dependency references, lifecycle fields, hidden commitments, and evaluator epochs; assert typed fail-closed reads.
- Replay evaluator, candidate, trial, canary, and promotion fixtures after reducer and normalization changes; compare raw references and derived admissibility without mutating sealed inputs.
- Verify canary leakage, stale, burned, retired, and superseded states block unsafe use while preserving the original sealed evidence.
- Verify all three downstream variants consume common artifact and service fixtures with identical seal/read, evaluator, canary, promotion, and veto semantics.
- Run strict spec validation and the phase-specific quality gate on the exact implementation candidate.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Contract tests prove every artifact kind routes through the phase-006 sealing adapter and reject alternate seal metadata or verification paths |
| REQ-002 | Canonicalization/property tests compare equivalent input orderings and mutate each covered field and dependency to prove digest stability and change detection |
| REQ-003 | Crash and atomic-publication fixtures cover validation, seal, write, fsync or approved durability boundary, publish, read-back, and overwrite refusal |
| REQ-004 | Tamper, missing, truncation, unsupported-schema, dependency, lifecycle, epoch, and quarantine fixtures return typed refusal without usable fallback bytes |
| REQ-005 | Evaluator capsule fixtures cover profile, rubric, fixtures, hidden commitments, calibration, normalization, environment, capabilities, visibility, budget, and epoch matching |
| REQ-006 | Trial fixtures reproduce candidate and baseline outputs from sealed lineage, operator, profile, model/prompt/tool, seed, fixture, raw-output, and environment references |
| REQ-007 | Canary fixtures cover sealed/active/burned/retired lifecycle, freshness, supersession, literal/semantic leakage, hidden-suite isolation, and deterministic adversarial/metamorphic references |
| REQ-008 | Promotion fixtures require target repair, baseline preservation, critical dimensions, integrity, canary, uncertainty, cost, and rollback evidence; missing or stale evidence is ineligible |
| REQ-009 | Common-contract tests run identical artifacts and service decisions through common, agent, model, and skill adapters and compare shared fields and failure states |
| REQ-010 | Access-boundary tests prove candidate generation cannot read hidden content, exact scores, evaluator internals, or terminal evidence and that violations produce a sealed veto reference |
| REQ-011 | Re-reduction and evaluator-epoch fixtures prove raw artifacts remain immutable and addressable while new policy or derived references are created |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The primary inputs are `001-typed-ledger-schema` for canonical identities and event references, `002-reducers-and-projections` for artifact indexes and shared service status, and the phase-006 sealing primitives for all digest, publication, and verification behavior. The successor `004-certificates-and-receipts` consumes the sealed promotion inputs and binds them into final certificates and receipts. The phase also depends on the parent program's shared mode-contract and write-set freeze before downstream migration integration, the existing deep-improvement evaluator, canary, scoring, and promotion fixtures, and the spec-kit validator. The three benchmark variants are consumers, not prerequisites for defining the common sealed-artifact contract.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Implementation is additive at the artifact-reference and service-read boundaries. If sealing or verification fails parity, stop publishing or consuming the new references, preserve all already sealed bytes and append-only ledger evidence, and restore the prior reader or projection snapshot through the migration bridge. Do not delete, rewrite, re-seal, or reinterpret an old artifact to repair a bad verifier. Mark affected references quarantined or superseded through the existing transition path, rebuild derived indexes from the last known-good frontier, and use a `git revert` of path-scoped phase commits to restore prior adapters. The retained raw artifacts and fixtures make a corrected seal/read implementation reproducible after retry.
<!-- /ANCHOR:rollback -->
