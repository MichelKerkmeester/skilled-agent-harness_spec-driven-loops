---
title: "Implementation Plan: Skill Benchmark - Sealed Reference Artifacts"
description: "Implementation Plan for the Skill Benchmark sealed-artifact phase: adapt the shared phase-003 sealing primitive and deep-improvement-common services to immutable treatment, bundle, scenario, gold, exposure, scoring, and certificate-input references."
trigger_phrases:
  - "Skill Benchmark sealed artifacts implementation plan"
  - "skill benchmark tamper evident read plan"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/007-skill-benchmark/003-sealed-artifacts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/007-skill-benchmark/003-sealed-artifacts"
    last_updated_at: "2026-07-15T21:30:00Z"
    last_updated_by: "opencode"
    recent_action: "Mapped skill treatment gold exposure and scoring seal boundaries"
    next_safe_action: "Resolve artifact fields and dependency closure with shared contracts"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Skill Benchmark - Sealed Reference Artifacts

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop / skill-benchmark migration |
| **Change class** | Mode-specific sealed references, artifact read verification, and scoring evidence boundaries |
| **Execution** | Isolated implementation after the reducer contract; certificate consumer follows this phase |

### Overview

This phase makes Skill Benchmark scenario evidence reproducible without making the mode responsible for the shared sealing
or evaluator stack. It adapts the phase-003 primitive and mode-004 common services into one content-addressed contract for
treatment designs, skill bundles, task/gold inputs, assignments, exposure observations, raw scoring observations, and
certificate inputs. Seal-on-write publishes only verified references; tamper-evident reads reject changed, stale, incomplete,
incompatible, or unauthorized material. Reducers and the successor certificate phase consume these references but do not
receive mutable snapshots or a second identity scheme.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] `002-reducers-and-projections` publishes the Skill Benchmark artifact-reference, treatment-cell, evaluator-epoch,
  gold-policy, and projection-fingerprint inputs consumed by this phase
- [ ] The shared phase-003 sealing primitive publishes canonicalization, digest, dependency-closure, seal-on-write,
  publication, tamper-read, lifecycle, and failure semantics
- [ ] Deep-improvement-common publishes the evaluator capsule, canary epoch, replay, budget, visibility, and common read
  contracts consumed by the mode
- [ ] The artifact matrix names every immutable input/output, ordered dependency, producer, consumer, visibility rule, and
  expiry or quarantine state
- [ ] Treatment cells, paired replicates, skill resources, gold policies, exposure stages, and validity domains have stable
  field-level identities before implementation begins
- [ ] Mutation, crash, truncation, missing-dependency, changed-gold, stale-epoch, canary-leak, compatibility, composition,
  and mixed-version fixtures are identified

### Definition of Done

- [ ] Every Skill Benchmark reference is content-addressed, sealed on write, immutable after publication, and verified on read
  through the phase-003 primitive
- [ ] Paired treatment designs reproduce the same task, bundle, executor, environment, evaluator, gold, and workload inputs
- [ ] Exposure and scoring observations preserve raw causal-stage evidence and gold-integrity decisions for later reduction
- [ ] Missing, stale, tampered, incompatible, leaked, or non-scored evidence cannot enter positive scoring or certificate input
- [ ] Common service semantics are consumed without private seal, evaluator, canary, replay, budget, or receipt forks
- [ ] Strict validation and the phase verifier pass without tracked changes outside the phase implementation scope
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Single sealing adapter**: expose the phase-003-backed canonicalize, digest, seal, publish, inspect, and verify boundary;
  the adapter owns no alternate hash, signature, chain, manifest, storage, or lifecycle semantics.
- **Content identity**: derive each reference from canonical bytes, artifact kind, schema version, and ordered dependency
  closure. Bundle, task, gold, evaluator, executor, environment, tool, permission, dependency, registry, and workload
  changes create new identities or explicit expiry.
- **Seal-on-write boundary**: validate the artifact and all dependency references, canonicalize, invoke the shared primitive,
  publish atomically, read back, verify, and only then emit the authorized artifact reference. A partial write is never usable.
- **Treatment design**: seal the randomized off/auto/forced/placebo/distractor/ablation lattice with seed, replicate, blocking,
  assignment, and paired-contrast metadata before execution. Assignment is an input fact, not a score projection.
- **Skill and scenario snapshots**: seal the skill tree, resource classes, registry, dependency compatibility, task recipe,
  dynamic reference functions, deterministic checks, negative controls, and gold policy as portable intervention references.
- **Run assignment and raw observations**: bind each run to a common evaluator epoch and preserve discovery, loading,
  invocation, canary, milestone, final-state, cost, latency, token, security, compatibility, and raw score observations before
  reducers compute lift or attribution.
- **Gold-integrity gate**: require explicit `scored`, `negative`, `structural-only`, or `pending` policy and provenance;
  block positive scoring for empty or pending required gold and retain mutation-sensitivity evidence.
- **Validity input**: assemble digest-verified evidence for paired lift, component ablations, negative transfer, compatibility
  slices, cost/security deltas, confidence intervals, and expiry. This is an input to `004-certificates-and-receipts`, not its
  final decision.
- **Tamper-evident read path**: verify bytes, digest, schema, dependency closure, common evaluator/canary epoch, lifecycle,
  gold status, visibility, and compatibility. Return typed `missing`, `digest_mismatch`, `dependency_mismatch`,
  `schema_unsupported`, `epoch_mismatch`, `gold_blocked`, `stale`, `leak_detected`, `incompatible`, or `quarantined` results.
- **Information boundary**: candidate generators receive only permitted commitments or verdict bands; hidden gold, exact
  canaries, evaluator internals, terminal evidence, and mutable service state remain inaccessible and leak attempts become
  sealed veto evidence.
- **Common-service consumption**: use mode-004 evaluator, canary, replay, budget, lock, receipt, and read contracts unchanged;
  Skill Benchmark contributes only its scenario, treatment, exposure, gold, and scoring-observation field definitions.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- Confirm `002-reducers-and-projections` is frozen for artifact references, treatment-cell identity, gold-policy status,
  projection fingerprints, and reducer ownership.
- Read the phase-003 sealing primitive and record its canonicalization, digest, dependency, publication, lifecycle, and
  verification behavior; reject any design that duplicates it.
- Read the deep-improvement-common mode-004 sealed-artifact and service contracts; map each consumer boundary without copying
  evaluator, canary, replay, budget, receipt, or read-verification logic.
- Build the field and dependency matrix for design, bundle, scenario/gold, assignment, exposure, scoring, and certificate
  input references, including candidate-visible versus hidden fields.
- Pin fixtures for valid paired cells, ablations, empty/pending gold, changed gold, resource canaries, compatibility failure,
  composition risk, valid certificate input, and every declared read failure.

### Phase 2: Implementation

- Define the single phase-003-backed Skill Benchmark artifact adapter and typed reference, dependency manifest, lifecycle,
  visibility, and verification result vocabulary.
- Define canonical serialization and digest coverage for treatment designs, skill bundles, resource closures, scenario/gold
  manifests, run assignments, exposure observations, scoring observations, and certificate inputs.
- Define seal-on-write validation, atomic publication, read-back verification, incomplete-write handling, and immutable
  overwrite refusal through the shared primitive.
- Define the randomized paired treatment lattice, assignment identity, blocking factors, seed, replicate, and executor/task
  pairing without embedding reducer or attribution decisions in the artifact.
- Define skill bundle, registry, task, workload, dependency, compatibility, deterministic-check, dynamic-reference, negative
  control, and gold-policy snapshots as sealed references.
- Define exposure and causal-path references for discovery, progressive loading, invocation, resource canaries, milestones,
  final artifacts, cost, latency, tokens, and security probes; keep final-state authority explicit.
- Define gold-integrity admission and mutation-sensitivity evidence; exclude pending and structural-only rows from positive
  numerators and emit a typed blocked state for incomplete gold.
- Define raw score and effect-certificate input references for paired intervals, ablations, compatibility slices, negative
  transfer, cost/security deltas, validity domains, and expiry triggers.
- Define tamper-evident reads, candidate redaction, hidden-material isolation, leak vetoes, stale/expiry handling, and common
  service adapters without private seal or evaluator semantics.
- Add reference-only integration with `004-certificates-and-receipts`; keep issued/withheld/expired certificate decisions and
  receipt materialization in the successor.

### Phase 3: Verification

- Verify equivalent canonical inputs produce identical references while every covered content, schema, producer, bundle,
  gold, evaluator, executor, environment, tool, permission, dependency, registry, or workload mutation produces a new identity.
- Inject interruption before publication, after publication, during read, and after dependency removal; assert no partial,
  overwritten, or guessed reference is accepted.
- Tamper with bytes, manifests, dependency references, treatment assignments, gold policy, hidden commitments, lifecycle,
  common epochs, and compatibility metadata; assert typed fail-closed reads.
- Replay valid treatment cells and raw observations after reducer, normalization, or evaluator-policy changes; compare sealed
  raw evidence and derived eligibility without mutating prior references.
- Verify off/auto/forced/placebo and component-ablation contrasts retain paired identity and distinguish discovery, activation,
  guidance, execution, and outcome stages.
- Verify gold-integrity, canary leakage, stale, incompatible, composition-risk, pending, and expired states block positive
  scoring or certificate input while preserving original evidence.
- Verify candidate-facing reads exclude hidden gold, exact canaries, evaluator internals, terminal evidence, and mutable state.
- Run strict spec validation, the phase verifier, replay/property suite, crash and mutation suite, access-boundary suite, and
  exact-scope diff check on the implementation candidate.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Contract tests route every Skill Benchmark artifact through the phase-003 adapter and reject alternate seal metadata or verification paths |
| REQ-002 | Canonicalization and dependency property tests compare equivalent inputs and mutate each covered bundle, task, gold, evaluator, executor, environment, registry, tool, permission, dependency, and workload field |
| REQ-003 | Crash, retry, duplicate, concurrent, atomic-publication, read-back, and overwrite fixtures prove partial and prior sealed artifacts are never accepted or changed |
| REQ-004 | Tamper, missing, truncation, unsupported-schema, lifecycle, epoch, gold, compatibility, leak, and quarantine fixtures return typed refusal without usable fallback bytes |
| REQ-005 | Design and assignment fixtures reproduce seed, replicate, treatment, propensity, blocking, task, executor, environment, and paired-cell identity |
| REQ-006 | Bundle and scenario fixtures reproduce resource digests, progressive disclosure, task recipe, deterministic checks, dynamic references, negative controls, dependency compatibility, and workload profile |
| REQ-007 | Causal-path fixtures distinguish discovery, loading, invocation, resource-canary exposure, milestones, final outcome, cost, latency, tokens, and security observations |
| REQ-008 | Gold fixtures cover scored, negative, structural-only, pending, empty, stale, and changed-gold cases; mutation sensitivity proves gold affects the score or blocks it |
| REQ-009 | Re-reduction and evaluator-epoch fixtures preserve raw outputs, checks, score axes, constraint coverage, and usage while creating new derived references |
| REQ-010 | Certificate-input fixtures require paired intervals, ablations, compatibility, negative transfer, cost/security deltas, validity domain, and expiry triggers with all dependency digests |
| REQ-011 | Common, agent, model, and skill adapters consume identical seal, evaluator, canary, replay, budget, receipt, read-failure, and evidence-reference semantics |
| REQ-012 | Access-boundary fixtures prove candidates cannot read hidden gold, exact canaries, evaluator internals, terminal evidence, or mutable service state; violations create sealed veto evidence |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The primary inputs are `002-reducers-and-projections` for treatment, artifact, gold-policy, and projection references; the
shared phase-003 sealing primitives for every digest, publication, lifecycle, and verification behavior; and deep-improvement
common mode 004 for evaluator capsules, canary epochs, replay fingerprints, budgets, locks, receipts, visibility, and common
read failures. The successor `004-certificates-and-receipts` consumes the effect-certificate inputs and binds them into final
certificate and receipt facts. The phase also depends on phase 012 shared mode contracts and the write-set conflict graph, the
existing skill benchmark and packet-033 behavior fixtures, and the spec-kit validator. No downstream certificate decision or
common service reimplementation is a prerequisite for defining this reference contract.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Implementation is additive at Skill Benchmark artifact-reference and read boundaries. If sealing or verification loses parity,
stop publishing or consuming the new references, preserve all already sealed bytes and append-only event evidence, and route
the legacy or prior projection through the migration bridge. Do not delete, rewrite, re-seal, or reinterpret an old bundle,
gold manifest, observation, or certificate input to repair a verifier. Mark affected references quarantined or expired through
the shared transition path, rebuild derived indexes from the last known-good frontier, and use `git revert` of path-scoped
phase commits to restore the prior adapter. Retained raw observations and fixtures make a corrected read path reproducible.
<!-- /ANCHOR:rollback -->
