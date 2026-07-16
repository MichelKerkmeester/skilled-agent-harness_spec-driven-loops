---
title: "Implementation Plan: Agent Improvement - Shadow Parity"
description: "Implementation Plan for the Agent Improvement shadow-parity phase: map proposal and scoring behavior, run the ledger adapter beside the legacy emitter, compare agent-specific events and projections, reuse Deep Improvement Common Services, and emit a blocking parity receipt without changing authority."
trigger_phrases:
  - "Agent Improvement shadow parity implementation plan"
  - "agent proposal event parity implementation"
  - "agent-improvement phase 009 implementation plan"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/005-agent-improvement/006-shadow-parity"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/005-agent-improvement/006-shadow-parity"
    last_updated_at: "2026-07-15T21:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Scoped Agent Improvement parity to proposal and scoring projections"
    next_safe_action: "Define paired adapters, protected fields, fixtures, and the parity receipt"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Agent Improvement - Shadow Parity

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop / Agent Improvement mode |
| **Change class** | Shadow verification harness and agent-specific parity contract |
| **Execution** | Planning-only child; legacy emitter remains authoritative and common services are reused |

### Overview
The phase defines the Agent Improvement shadow path over the typed event ledger. A mode adapter observes the existing agent-loop
proposal and scoring lifecycle, the ledger adapter emits the corresponding typed events, and a comparator evaluates both streams
from the same frozen run manifest and candidate corpus. The comparator checks event-for-event sequence parity plus AgentIR,
lineage, raw-trial, family, frontier, transfer, resume, canary, and promotion projections. Mode 004 Deep Improvement Common
Services supplies evaluator, canary, promotion, health, and generic comparison behavior; this phase adds only namespaced Agent
Improvement extensions. A parity receipt is the only handoff artifact; authority remains unchanged.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Shared mode contracts, event-version rules, write-set ownership, and phase-014 shadow interfaces are available as pinned inputs
- [ ] Deep Improvement Common Services exposes the evaluator, canary, promotion, health, and generic parity ports without a variant-local reimplementation
- [ ] The legacy Agent Improvement proposal, scoring, trace, resume, and promotion-preparation boundaries are inventoried
- [ ] The canonical event tuple, protected AgentIR fields, mismatch taxonomy, and volatility allowlist are reviewed before fixture results are accepted
- [ ] The fixture corpus freezes candidate and baseline definitions, evaluator capsule and epoch, traces, executors, environments, budgets, and expected failure dispositions
- [ ] The parity receipt schema records BASE, mode and common-service digests, stream digests, projection fingerprints, and diff dispositions

### Definition of Done
- [ ] Every required Agent Improvement fixture has a legacy stream, ledger stream, canonical diff, and reproducible receipt
- [ ] Event-for-event parity has zero unexplained semantic differences, including lineage, evaluator, family, resume, and promotion-preparation behavior
- [ ] Any tolerated transport difference is typed, allowlisted, non-semantic, and recorded in the receipt
- [ ] The common evaluator, canary, promotion, and health services are consumed through mode 004 contracts without duplicate variant semantics
- [ ] The non-authoritative guard is proven and no cutover, legacy-writer removal, or mode-gate decision is included
- [ ] The successor mode gate receives a parity-green handoff contract without a cutover certificate
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Frozen run input**: bind BASE, run manifest, target and baseline AgentIR/package digests, inheritance graph, evaluator capsule
  and epoch, fixture rings, executor and environment descriptors, tool receipts, budget lease, and fixture ID before either path starts.
- **Legacy observer**: observe proposal generation, candidate scoring, trace reduction, frontier decisions, resume, and promotion
  preparation without rewriting legacy state; preserve the existing output as the behavior oracle.
- **Ledger shadow adapter**: emit typed Agent Improvement events through the shared transition and event-envelope interfaces in
  dark, non-authoritative mode; preserve stable run, candidate, parent, changed-locus, clause, and trial identities.
- **Common-service boundary**: call mode 004 evaluator, canary, promotion, health, receipt, and mismatch facilities; add only
  Agent Improvement event names, projection fields, and fixture inputs. Shared control-plane records cannot satisfy a missing
  Agent Improvement behavior event.
- **Canonical comparator**: compare `(eventType, runId, candidateLineageId, changedLocus, stepKey, producerSeq, causalLinks,
  stablePayloadDigest, sharedServiceRefs, projectionFingerprint)` in order; classify missing, extra, duplicate, reorder, payload,
  evaluator, coverage, transfer, receipt, and projection differences.
- **Projection oracle**: fold both canonical streams into AgentIR, clause coverage, proposal lineage, raw trial, family stability,
  score, frontier, ablation, executor transfer, canary, promotion, rollback, resume, and terminal projections; compare each view
  against the other and against deterministic replay.
- **Volatility boundary**: allow only declared transport fields such as process-local timing or correlation values to vary; unknown
  fields, missing samples, changed evaluator epochs, and semantic AgentIR drift fail closed.
- **Fixture and receipt store**: retain frozen inputs, both event streams, canonicalized streams, diff reports, projection
  fingerprints, shared-service references, and parity receipts in isolated non-authoritative output.
- **Authority guard**: shadow execution cannot publish canonical candidate state, mutate evaluator or canary assets, dispatch a
  candidate, promote a baseline, allocate a new authority lease, or issue a cutover certificate.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm the phase-015 shared contracts, phase-014 shadow framework, parent compatibility bridge, and mode 004 common-service
  ports are pinned inputs; sibling adjacency remains navigation, not a hard runtime dependency for this planning document.
- Inventory actual legacy Agent Improvement boundaries from AgentIR/package generation, proposal and mutation records, profile and
  score generation, trace and failure reduction, frontier selection, resume, and promotion preparation.
- Freeze the fixture manifest, candidate and baseline inputs, evaluator and environment identities, expected terminal classes,
  protected field manifest, and parity receipt schema.

### Phase 2: Implementation
- Define the Agent Improvement event namespace and mapping for initialization, AgentIR compilation, proposal, mutation locus,
  lineage, trace localization, raw trial, score reduction, family result, frontier, ablation, transfer, resume, and promotion preparation.
- Define the legacy observer and ledger shadow adapter contracts with stable run, candidate, parent, changed-locus, clause,
  trial, evaluator, fixture, and receipt identities.
- Reuse the mode 004 comparator and common services; add namespaced Agent Improvement comparison rules for AgentIR, inheritance,
  clause coverage, family vectors, insufficient evidence, frontier membership, and transfer state.
- Define projection folds and deterministic replay oracles for proposals, lineage, raw observations, score versions, family
  stability, causal evidence, frontier decisions, evaluator epoch, canary state, promotion state, and resume state.
- Build the fixture matrix for clean and defective proposals, discipline and authority conflicts, semantic variants, missing
  evidence, evaluator changes, executor transfer, frontier and ablation, crash-resume, duplicate delivery, canary, and veto cases.
- Emit a BASE-bound parity receipt and a blocking failure disposition for any unexplained semantic difference, common-service gap,
  missing family sample, evaluator-integrity failure, or shadow authority write.

### Phase 3: Verification
- Run every fixture through legacy and ledger shadow paths from the same frozen input and confirm identical input digests.
- Verify canonical event count, order, event types, identities, changed loci, causal links, stable payload digests, shared-service
  references, and projection fingerprints.
- Verify AgentIR and inherited-clause coverage, proposal lineage, known-locus attribution, family and dimension outcomes,
  insufficient-evidence handling, frontier and ablation decisions, and executor-transfer behavior.
- Verify evaluator capsule and epoch, canary, promotion, health, receipt, and rollback references match the mode 004 contract
  without hiding a variant behavior mismatch.
- Verify fresh versus resumed continuation, duplicate delivery, evaluator changes, missing evidence, terminal classification,
  and non-authoritative output behavior.
- Pass only a parity receipt with zero unexplained semantic differences to `007-rollback-and-mode-gate`.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Run both paths from one frozen BASE, manifest, AgentIR/package inputs, evaluator capsule and epoch, fixture rings, executor descriptors, environment, tool receipts, and budget lease; compare the recorded input digest |
| REQ-002 | Review the event map against every proposal, scoring, lineage, frontier, resume, and promotion-preparation boundary; fail on an unmapped transition |
| REQ-003 | Compare canonical event streams position-by-position and fail on missing, extra, reordered, duplicate, identity, changed-locus, causal, stable-payload, or shared-reference differences |
| REQ-004 | Execute unknown-field, missing-sample, evaluator-epoch, and allowlist fixtures; prove only declared transport volatility is ignored and every semantic AgentIR and coverage field remains compared |
| REQ-005 | Fold both streams and compare AgentIR, inherited clauses, proposal lineage, raw trials, family vectors, score versions, frontier, ablation, transfer, canary, promotion, rollback, and terminal projections plus fingerprints |
| REQ-006 | Run known-locus defect, single-locus mutation, multi-clause ablation, failure-cluster, authority-conflict, and change-contract fixtures; compare causal and lineage evidence rather than only candidate IDs |
| REQ-007 | Invoke the mode 004 evaluator, canary, promotion, health, receipt, and mismatch contracts; verify common control-plane parity and prove a common event cannot replace a missing variant behavior event |
| REQ-008 | Inject unsupported AgentIR, missing evidence, stale evaluator, executor mismatch, tool/state failure, crash, and resume boundaries; require equal invalid, blocked, incomplete, or insufficient-evidence outcomes |
| REQ-009 | Validate each parity receipt against BASE, mode, common-service, schema, reducer, comparator, fixture, stream, projection, and diff metadata; replay the receipt from retained inputs |
| REQ-010 | Assert the non-authoritative flag and legacy writer ownership throughout the run; treat any canonical mutation, cutover artifact, dispatch, baseline write, or missing receipt as a gate failure |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The phase depends on the parent program's typed event and transition contracts, compatibility bridge, and shared mode contracts. It
consumes the phase-014 shadow framework and phase-012 write-set conflict graph as interface inputs. It reuses the Deep Improvement
Common Services harness and evaluator, canary, promotion, health, receipt, and mismatch contracts from mode 004. Agent Improvement
sibling concerns `001-typed-ledger-schema` through `005-resume-adapter` supply the mode event and state boundaries; the existing
agent-loop proposal, scoring, trace, executor, and promotion fixtures supply the behavioral oracle. The successor mode gate consumes
the passing report without inheriting authority from this phase.

The research evidence requires typed AgentIR and causal slicing, blocker-aware Pareto selection, frozen evaluator epochs, raw trial
retention, candidate-blind and order-swapped checks, discipline and negative-capability coverage, known-locus interventions,
executor transfer, and staged rollback evidence. These are parity fields and fixtures here; they do not authorize new runtime policy
or a production cutover.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

This child changes planning artifacts only and performs no runtime write or data migration. If the contract fails review, revert the
four phase documents and reopen the parity boundary without touching the legacy emitter, typed ledger, AgentIR, evaluator assets,
sealed canaries, common services, or downstream variants.

During later implementation, disable the shadow consumer at its explicit feature boundary while retaining immutable pair and
mismatch receipts for diagnosis. The legacy emitter remains authoritative throughout. A failed or inconclusive parity report must
be treated as a block; it cannot be converted into a pass by dropping AgentIR fields, widening normalization, accepting missing
samples, forking common-service semantics, or bypassing the authorization gateway. Production rollback and authority restoration
belong to `007-rollback-and-mode-gate` and the later staged cutover phase.
<!-- /ANCHOR:rollback -->
