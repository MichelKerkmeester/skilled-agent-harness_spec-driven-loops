---
title: "Implementation Plan: Skill Benchmark - Resume Adapter (013 mode migration, 007 child 005)"
description: "Implementation plan for the Skill Benchmark sealed-ledger resume adapter: deterministic scenario-cell and scoring reconstruction, continuity-ladder mapping, idempotent re-entry, and strict reuse of deep-improvement-common services."
trigger_phrases:
  - "Skill Benchmark resume adapter implementation plan"
  - "sealed ledger skill benchmark resume plan"
  - "skill scenario idempotent re-entry plan"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/007-skill-benchmark/005-resume-adapter"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/007-skill-benchmark/005-resume-adapter"
    last_updated_at: "2026-07-15T23:30:00Z"
    last_updated_by: "opencode"
    recent_action: "Outlined Skill Benchmark scenario and scoring replay boundaries"
    next_safe_action: "Freeze continuity ladder and scenario-cell action matrix"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Skill Benchmark - Resume Adapter

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop / deep-improvement / skill-benchmark child phase |
| **Change class** | Planning contract: sealed-ledger reconstruction and idempotent scenario re-entry |
| **Execution** | Plan against frozen ledger, reducer, common-service, and phase-012 contracts; no authority cutover or runtime implementation in this phase |

### Overview

This plan defines a Skill Benchmark-specific Resume Adapter for paired scenario runs and scoring state. The adapter accepts only
a validated sealed ledger frontier, folds it through the typed reducers, maps the result to the continuity ladder, and derives a
stable re-entry plan for each logical scenario cell. It separates reusable terminal evidence from incomplete, invalid,
contaminated, underpowered, and unknown work while retaining discovery, invocation, trajectory, outcome, gold, and scoring
provenance. It builds on deep-improvement-common services from mode 004 and adds only Skill Benchmark scenario and scoring logic;
shared evaluator, canary, promotion, receipt, budget, effect-recovery, continuity, and authority semantics are referenced, not
reimplemented.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] The sealed-ledger contract identifies the finalized frontier, event-tail hash, stream high-watermarks, and authorized resume receipt boundary
- [ ] Skill Benchmark `001-typed-ledger-schema` and `002-reducers-and-projections` expose stable event, reducer, projection, identity, and fingerprint inputs
- [ ] Deep-improvement-common mode 004 ownership is recorded for evaluator, canary, promotion, receipt, budget, lock, continuity, compatibility, and effect-recovery services
- [ ] The continuity ladder names every state from design and treatment assignment through scenario closure, scoring, shared status, and the resumable frontier
- [ ] The scenario-cell action table distinguishes reuse, reconcile, re-execute, compensate, unknown, and block without relying on labels or file presence
- [ ] Skill-specific score restoration preserves stage mediation, raw observations, gold integrity, constraint coverage, validity, and uncertainty
- [ ] The phase remains planning-only and scoped to this target folder; phase 010 migration work and the six sibling concerns remain excluded

### Definition of Done

- [ ] A sealed-ledger fold and compatibility gate are specified for complete and interrupted scenario runs
- [ ] Stable design-cell, scenario-cell, logical-operation, event, receipt, and attempt identities are documented
- [ ] Duplicate and conflicting re-entry behavior is explicit and idempotent
- [ ] Unknown effects and lost or late evidence have a safe recovery path through shared services
- [ ] Skill-specific discovery, invocation, trajectory, gold, and scoring semantics are retained without duplicating common authority
- [ ] The resume contract supplies deterministic fingerprints and receipts for `006-shadow-parity` and the later mode gate
- [ ] The phase checklist and strict spec validation are green
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Sealed source boundary**: accept only a validated ledger seal and finalized frontier. Re-entry never discovers state from
  mutable skill files, current registry contents, current executor configuration, or an incomplete ledger tail.
- **Reducer reconstruction**: use the shared canonical event ordering, schema/upcaster compatibility, duplicate handling, and
  projection fingerprint rules from the Skill Benchmark schema and reducer children. Complete replay and valid prefix replay must
  converge to identical scenario, evidence, score, status, and fingerprint outputs.
- **Continuity ladder**: restore run identity, design and treatment assignment, scenario environment, skill path stages,
  trajectory/outcome state, gold and scoring evidence, common status, and the next resumable frontier in order. A missing or
  incompatible higher layer blocks lower-layer action rather than guessing it.
- **Scenario-cell action planner**: derive one decision per stable scenario cell and logical operation. Complete compatible cells are
  reusable; missing stages may re-enter under shared recovery; unknown effects reconcile or block; changed treatment, bundle, gold,
  or scoring epochs migrate, fork, or reject explicitly.
- **Identity separation**: preserve `runId`, `designCellId`, `scenarioCellId`, `logicalOperationId`, `eventId`, and `receiptId`;
  allocate a new `attemptId` only for an authorized new attempt. Completion order, worker ordinal, and array position are never
  identities.
- **Evidence preservation**: retain raw skill exposure, trajectory, outcome, gold, score, usage, latency, constraint, validity,
  contamination, negative-transfer, and uncertainty evidence beside derived paired lift or attribution inputs.
- **Shared-service boundary**: consume mode-004 evaluator, canary, promotion, receipt, budget, lock, continuity, compatibility,
  effect-recovery, and common-status contracts. Skill Benchmark may add namespaced scenario and scoring fields but cannot clear a
  shared veto, write shared projections, or replace a common transition.
- **Downstream bridge**: bind the resume plan to source seal, replay fingerprint, projection hash, selected scenario-cell IDs,
  excluded reasons, stage decisions, score evidence references, and shared receipt references so `006-shadow-parity` can compare
  behavior without making this adapter authoritative.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- Reconcile the parent program sequencing invariants, the phase-tree outcome, and the required adjacency to
  `004-certificates-and-receipts` and `006-shadow-parity`.
- Pin the phase-003 ledger seal and phase-009 shared event rules, Skill Benchmark schema and reducer inputs, mode-004
  common-service ownership, and phase-012 write-set conflict graph as versioned contract inputs.
- Inventory the projection fields needed to resume a skill run: design and treatment cells, scenario lifecycle, discovery,
  loading, invocation, resources, milestones, outcomes, gold, raw observations, scores, usage, latency, validity, and common status.
- Produce the continuity-ladder table and scenario-cell action matrix for terminal, pending, failed, invalid, abstained,
  underpowered, contaminated, late, and unknown evidence states.
- Define the resume-plan key, source-frontier identity, projection fingerprints, and conflict rules for duplicate or stale events.

### Phase 2: Implementation

- Define seal validation and compatibility outcomes for ledger, schema, reducer, treatment, skill bundle, registry, executor,
  environment, gold, evaluator, and scoring-policy fingerprints, including exact, compatible, migrate, pin, and blocked results.
- Define the reducer invocation boundary that rebuilds from the sealed finalized frontier and returns projection state without
  mutable files, executor calls, network, clocks, randomness, hidden writes, or regenerated treatment assignments.
- Define the continuity-ladder projection and the minimum complete state required before the adapter may plan scenario re-entry.
- Define stable design-cell, scenario-cell, logical-operation, event, receipt, and attempt keys across treatment, skill bundle,
  registry, task, environment, executor, progressive stage, and scoring epoch.
- Define the idempotent scenario planner: reuse complete compatible evidence, reconcile shared receipts, re-execute only safe
  incomplete stages, compensate where shared policy requires it, preserve unknown effects, and block conflicts.
- Define stage-preserving scoring restoration for paired lift, availability/invocation/outcome mediation, trajectory and
  constraint coverage, dynamic gold, raw axes, validity, contamination, negative transfer, usage, latency, and uncertainty.
- Define the shared resume receipt or reference payload containing plan key, source seal, projection hash, selected and excluded
  scenario cells, stage decisions, score references, and common-service receipt references.
- Define the `006-shadow-parity` handoff and the mode-gate input without making shadow projections or score decisions authoritative.

### Phase 3: Verification

- Replay golden Skill Benchmark histories from a fresh reducer and from valid projection checkpoints; compare every projection
  family, scenario cell, score field, status field, resumable frontier, and fingerprint.
- Permute valid event completion order, duplicate terminal events, batch boundaries, paired-arm completion, resource-stage order,
  and late evidence; assert identical plans or explicit safe rejection.
- Inject crashes before dispatch, after executor acceptance, after result receipt, after ledger append, after projection fold, and
  before resume-plan receipt; assert no double apply and explicit unknown or recoverable state where required.
- Change treatment arm, skill bundle, registry, executor, environment, gold recipe, evaluator epoch, score policy, schema,
  reducer, and ledger frontier; verify migrate, pin, fork, or block decisions rather than silent reuse.
- Verify completed control and treatment cells remain reusable while only eligible logical cells enter a new attempt, and unknown
  effects never become automatic duplicate calls.
- Compare common evaluator, canary, promotion, receipt, budget, lock, continuity, compatibility, effect-recovery, and status
  fields with mode-004 fixtures; prove the Skill Benchmark extension cannot clear common blockers.
- Verify the shadow-parity handoff contains deterministic source and output fingerprints, then run strict validation and an
  exact-scope diff check for the four authored files.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Seal-only fixtures rebuild design, treatment, scenario, skill-path, evidence, score, and status state with filesystem, network, executor, mutable-config, and clock access denied |
| REQ-002 | A continuity-ladder manifest maps run, design, treatment, scenario, exposure, trajectory, outcome, gold, scoring, shared status, and resumable-frontier fields |
| REQ-003 | Fingerprint fixtures cover exact, compatible, migrate, pin, fork, and blocked outcomes for treatment, bundle, registry, executor, environment, gold, reducer, and score-policy changes |
| REQ-004 | Fresh and valid prefix reducer replays produce equal bytes, scenario cells, raw evidence references, score state, status, resumable frontier, and projection fingerprints |
| REQ-005 | Retry and restart fixtures preserve design-cell, scenario-cell, operation, event, and receipt IDs while changing attempt IDs only after authorized re-entry |
| REQ-006 | Duplicate resume-plan keys and same-hash event identities are no-ops; conflicting payload, hash, sequence, frontier, manifest, or fingerprint identities fail closed |
| REQ-007 | Crash and partial-frontier fixtures preserve completed paired cells, retain unknown effects, and produce no duplicate logical commit or unsafe re-execution |
| REQ-008 | Scoring fixtures preserve treatment arm, stage mediation, trajectory, constraints, gold, raw axes, usage, latency, validity, contamination, negative transfer, and uncertainty |
| REQ-009 | Contract fixtures prove common evaluator, canary, promotion, receipt, budget, lock, continuity, compatibility, effect-recovery, veto, rollback, and status semantics are consumed unchanged |
| REQ-010 / REQ-011 | The shadow-parity handoff validates plan key, source seal, selected cells, excluded reasons, projection hash, common receipt references, and no legacy authority change |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The direct contract inputs are Skill Benchmark `001-typed-ledger-schema` and `002-reducers-and-projections`, the phase-003
ledger and phase-009 event contracts, and the deep-improvement-common mode-004 services. The predecessor
`004-certificates-and-receipts` and successor `006-shadow-parity` provide adjacent planning boundaries, not a hard runtime
dependency for this child. Phase 012 supplies shared mode contracts and the write-set conflict graph before implementation
integration; phase 010 consumes the frozen shared contracts afterward.

The research evidence is `002-deep-loop-effectiveness-and-fanout/research/findings-registry.json` for receipt completion versus
workflow completion, logical versus attempt identity, branch-local success, and the versioned resume planner, plus
`findings-registry-modes.json` for paired skill lift, treatment controls, progressive disclosure, executable gold, mediation
metrics, resource canaries, content-addressed evidence, and retrieval-versus-realized efficacy. The spec-kit validator is the
documentation gate.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

This phase creates planning documents only and performs no runtime replay, ledger append, projection mutation, executor call,
score recomputation, or authority change. If later implementation fails parity or discovers a compatibility defect, disable the
new Resume Adapter, retain the sealed ledger and prior reducer projections, and keep the legacy Skill Benchmark path
authoritative. Rebuild from the last known-good sealed frontier after correcting the reducer or compatibility contract; never
delete, rewrite, or reclassify raw skill, trajectory, gold, or score evidence to make a resume plan pass. A path-scoped git revert
restores the prior adapter and shared-service references while preserving fixtures and receipts.
<!-- /ANCHOR:rollback -->
