---
title: "Implementation Plan: Skill Benchmark typed ledger schema"
description: "Implementation Plan for the Skill Benchmark typed-ledger schema phase: define the mode event vocabulary over deep-improvement-common, preserve causal scenario and scoring evidence, and specify deterministic version/upcaster hooks without implementing reducers."
trigger_phrases:
  - "Skill Benchmark typed ledger schema implementation plan"
  - "skill benchmark event schema plan"
  - "skill effect certificate event plan"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/007-skill-benchmark/001-typed-ledger-schema"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/007-skill-benchmark/001-typed-ledger-schema"
    last_updated_at: "2026-07-15T21:12:00Z"
    last_updated_by: "opencode"
    recent_action: "Captured schema boundaries for Skill Benchmark run and scoring facts"
    next_safe_action: "Draft the event registry and validate its field-level invariants"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Skill Benchmark Typed Ledger Schema

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop / deep-improvement-common / skill-benchmark |
| **Change class** | Typed event vocabulary and compatibility contract |
| **Execution** | Isolated worktree pinned to the parent program BASE; planning output only |

### Overview
Skill Benchmark needs a causal event stream rather than a terminal score: randomized treatment, skill discovery and
loading, invocation and resource exposure, trajectory milestones, final-state checks, raw evaluator observations, gold
integrity, compatibility, cost, and certificate freshness all need durable identities. The schema is specialized over the
shared event envelope and common services. It is not a second runtime or a reducer: the event contract must make the next
sibling's projections possible without changing the meaning of raw evidence.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The phase-006 transition-authorized ledger core and phase-012 shared event contracts are pinned by version and digest
- [ ] The deep-improvement-common service boundary is listed, with no duplicated run, receipt, budget, lock, or replay code
- [ ] The Skill Benchmark treatment lattice and scenario lifecycle are explicit
- [ ] The typed envelope specialization and event namespace cover every required causal stage
- [ ] Raw scoring and gold-integrity facts are separate from reducer-owned verdicts
- [ ] Versioned payload rules, replay fingerprints, and pure upcaster hooks are defined

### Definition of Done
- [ ] A closed event registry and field-level type contract is reviewed against the parent invariants and research inputs
- [ ] Positive, negative, unknown, blocked, incompatibility, and expiry states have typed representations
- [ ] Schema fixtures prove append-only identity, digest linkage, treatment parity, gold blocking, and deterministic upcasting
- [ ] The event vocabulary is handed to `002-reducers-and-projections` without reducer or projection implementation in this phase
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- Specialize the shared versioned envelope with `skill_benchmark.*.vN` event identifiers; preserve `eventId`, sequence,
  causation/correlation, logical branch, aggregate, canonical payload hash, and `prevEventHash`.
- Reuse deep-improvement-common for run identity, executor descriptors, receipts, budgets, locks, sealed artifacts,
  continuity, and replay metadata; Skill Benchmark contributes only scenario, treatment, exposure, scoring, and certificate
  lifecycle payloads.
- Model the causal path as separate immutable facts: availability/discovery, progressive loading, invocation, resource
  exposure, trajectory compliance, intermediate milestones, final outcome, and score observation.
- Represent treatment assignment independently from outcome: no-skill/control, auto-route, forced activation, placebo or
  distractor, component ablation, and compatibility-boundary variants carry randomization and replicate metadata.
- Bind all evidence to bundle, gold, task, environment, registry, executor, tool, permission, dependency, and workload
  digests so a certificate cannot outlive its declared validity domain silently.
- Keep `goldPolicy` and gold provenance in the event vocabulary. Positive scoring requires explicit integrity evidence; a
  pending, structural-only, or empty-gold condition is recorded rather than normalized into a score.
- Define registration, validation, canonicalization, fingerprint, and upcast hooks as pure compatibility boundaries. An
  upcaster produces a read-time current view and never rewrites the append-only source event.
- Do not put score aggregation, attribution, ranking, confidence-interval calculation, certificate issuance policy, or
  materialized state in this schema phase; the next sibling owns those reducers and projections.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm the phase-006 ledger-core and phase-012 shared-contract versions, schema hashes, authorization boundary, and
  replay policy used as inputs.
- Read the deep-improvement-common service contracts and the phase-013 write-set conflict graph; record the Skill Benchmark
  write set without expanding into sibling concerns.
- Inventory current Skill Benchmark run, scenario, scoring, and certificate inputs so each migration event has a source
  identity or an explicit new fact boundary.

### Phase 2: Implementation
- Define the envelope specialization, event namespace, common identifiers, status enums, digest references, timestamps,
  sequence/hash linkage, and extension rules.
- Define run-design and treatment events for paired within-task/within-executor contrasts, randomized assignment, replicates,
  control arms, distractors, ablations, and compatibility boundaries.
- Define scenario and skill-path events for start/finish/abort, discovery, progressive loading, invocation, resource canaries,
  trajectory records, milestones, and final outcomes.
- Define evaluation events for deterministic checks, dynamic reference functions, raw score axes, constraint coverage,
  evaluator metadata, cost/latency/tokens, gold policy, gold provenance, and blocked or inconclusive states.
- Define compatibility, negative-transfer, composition-security, and effect-certificate lifecycle event payloads without
  deciding their aggregate verdicts.
- Define event registration, canonical encoding, replay-fingerprint composition, unknown-event handling, and pure chained
  upcaster hooks with exact/compatible/migrate/pin/block outcomes.

### Phase 3: Verification
- Validate every event against required IDs, digests, enum domains, timestamp/order rules, payload version, and envelope
  hash-chain rules.
- Verify the treatment lattice can express no-skill, auto, forced, placebo/distractor, component-ablated, and incompatible
  cells with paired seed/propensity/replicate evidence.
- Verify discovery, loading, invocation, canary exposure, trajectory, milestone, outcome, and scoring facts cannot collapse
  into one terminal score or omit a causal stage.
- Verify empty, pending, and structural-only gold cases produce explicit integrity events and cannot be mistaken for positive
  scored evidence.
- Verify old envelopes upcast deterministically, preserve original identity/source version, and produce the same replay
  fingerprint for the same input.
- Verify no reducer, projection, gauge, ranking, or authority decision is required by the event contract.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Envelope fixtures reject missing identity, sequence, schema digest, authorization reference, or `prevEventHash`; canonical valid events round-trip |
| REQ-002 | Lifecycle fixtures cover planned, assigned, started, observed, finished, aborted, and closed events with stable cross-event references |
| REQ-003 | Paired treatment fixtures cover no-skill, auto-route, forced, placebo/distractor, component-ablation, and compatibility-boundary cells with seed and propensity parity |
| REQ-004 | Causal-path fixtures separately emit discovery, load, invocation, resource exposure, milestone, trajectory, and outcome events |
| REQ-005 | Scoring fixtures retain raw axes, deterministic checks, dynamic references, constraint coverage, costs, and gold policy; empty/pending gold emits a blocking integrity fact |
| REQ-006 | Compatibility and composition fixtures bind all required digests and record version mismatch, negative transfer, and security probe outcomes without mutating prior evidence |
| REQ-007 | Certificate fixtures cover issued, withheld, and expired lifecycle facts with validity domain, evidence digest, confidence references, and expiry triggers |
| REQ-008 | Version fixtures test canonical encoding, replay fingerprint stability, unknown-event refusal, chained upcasters, and exact/compatible/migrate/pin/block decisions |
| REQ-009 | Boundary review proves reducers and projections consume the schema but are not encoded in it; the next sibling receives a complete event registry |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

This phase consumes the phase-006 transition-authorized ledger core and the phase-012 shared event contracts named by the
mode migration brief. It also consumes the deep-improvement-common services from mode 004, the parent phase's executable
dependency/write-set conflict graph, and the existing Skill Benchmark scenario/scoring inputs. The schema must respect the
parent program's additive-dark migration model: it cannot assume authority cutover, legacy-writer retirement, or a completed
state migration.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

This phase produces a versioned schema contract and fixtures, not an authority change. Revert the path-scoped schema commit
and unregister the new event versions to restore the previous dark vocabulary; retain already appended source events and
route them through the prior reader or a pinned old-runtime decision. Never rewrite or delete Skill Benchmark ledger events
as part of schema rollback. Any incompatible event already emitted must be handled by the shared compatibility policy and an
explicit migrate, pin, or block decision.
<!-- /ANCHOR:rollback -->
