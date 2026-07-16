---
title: "Feature Specification: Agent Improvement - Shadow Parity"
description: "Plan the Agent Improvement mode's shadow-parity harness over the typed event-ledger substrate. The harness runs the ledger path beside the legacy agent-loop emitter for proposal generation, candidate evaluation, scoring, frontier selection, resume, and promotion preparation; compares the agent-specific projections event-for-event; and blocks authority cutover on any unexplained semantic difference. It consumes the phase-014 shadow framework and the Deep Improvement Common Services harness rather than reimplementing them."
trigger_phrases:
  - "Agent Improvement shadow parity"
  - "agent-improvement ledger migration"
  - "agent proposal event parity"
  - "mode 005 shadow harness"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/005-agent-improvement/006-shadow-parity"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/005-agent-improvement/006-shadow-parity"
    last_updated_at: "2026-07-15T21:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Read the leaf mold, parent plan, phase tree, and agent-improvement findings"
    next_safe_action: "Freeze the agent event map and parity oracle over shared common services"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Agent Improvement - Shadow Parity

> Phase adjacency under `005-agent-improvement` (independent planning contracts, not a hard runtime dependency): predecessor `005-resume-adapter`; successor `007-rollback-and-mode-gate`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/005-agent-improvement/006-shadow-parity |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop (owns the Agent Improvement workflow, typed migration, and shadow evidence) |
| **Origin** | Phase 013 mode-and-lane migrations, mode 005; shadow-parity planning after shared contracts and common-service migration |
| **Inputs** | Parent `065-deep-loop-innovation/spec.md`; `manifest/phase-tree.json`; `findings-registry.json`; `findings-registry-modes.json`; phase-014 shadow framework; sibling `005-resume-adapter` contract |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Agent Improvement is the variant that generates agent-loop proposals and scores candidate agent definitions. Its behavior is not
the terminal score alone: a run carries an AgentIR or agent-package lineage, changed loci, inherited clauses, failure-derived
proposal context, evaluator and fixture identities, raw trial observations, per-family outcomes, frontier decisions, and the
promotion preparation state. The migration must add a typed event-ledger path without changing the behavior of packets already in
flight or allowing a new writer to become authoritative before parity is proven.

The mode findings require typed AgentIR and causal slicing, blocker-aware Pareto successive halving, a frozen improver version,
contract-to-benchmark compilation, discipline stress families, known-locus defect injection, executor transfer, and a staged
proposed-to-shadow-to-canary-to-promoted lifecycle. They also require raw trial evidence to survive score-policy changes, evaluator
epochs to be explicit, candidate-blind and order-swapped evaluation, and missing samples to remain insufficient evidence. A
terminal score comparison would miss proposal lineage, clause coverage, family regressions, evaluator-surface drift, or a different
promotion disposition.

This phase plans an Agent Improvement shadow harness that runs the legacy emitter and the new ledger adapter from the same frozen
run context, compares the agent-specific behavior projection event-for-event, and separately checks the shared evaluator, canary,
and promotion control-plane references supplied by mode 004 Deep Improvement Common Services. It consumes the phase-014 shadow
framework and shared compatibility bridge, but owns only the Agent Improvement event map, namespaced adapter, projection fields,
fixtures, comparator extensions, parity receipt, and successor handoff. No authority cutover occurs here.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- An Agent Improvement lifecycle event map covering run initialization, AgentIR or package compilation, proposal generation,
  single-locus mutation, candidate lineage, failure localization, candidate evaluation, raw trial capture, score reduction,
  family stability, Pareto or frontier selection, ablation, transfer checks, resume, and promotion preparation.
- A legacy observer and ledger shadow adapter that receive the same BASE, run manifest, target and baseline digests, inherited
  clauses, evaluator capsule and epoch, fixture rings, executor descriptors, tool receipts, environment, and budget context.
- A canonical comparison tuple for each mode event: event type, run and candidate lineage identity, changed locus, logical step,
  producer sequence, causal links, stable payload digest, shared-service references, and resulting projection fingerprint.
  Transport-only fields are excluded only through a versioned allowlist.
- Agent-specific projection checkpoints for AgentIR structure, clause and authority-conflict coverage, proposal lineage, raw trial
  evidence, per-family and per-dimension outcomes, insufficient-evidence state, failure class, frontier membership, ablation
  result, executor transfer, canary and promotion disposition, rollback target, and terminal status.
- Fixtures for clean proposals, single-locus repair, multi-candidate frontier search, known-locus defect injection, act/refuse/
  clarify behavior, authority conflict, tool or state failure, missing evidence, evaluator epoch change, semantic variants,
  executor transfer, crash and resume, duplicate delivery, and promotion veto or rollback preparation.
- A parity receipt bound to BASE, the run manifest, AgentIR and evaluator versions, shared-service contract digests, comparator
  configuration, fixture IDs, both stream digests, projection fingerprints, and every diff disposition.
- A cutover-blocking handoff contract for successor `007-rollback-and-mode-gate`; parity evidence is not a cutover certificate.

### Out of Scope
- Reimplementing the Deep Improvement Common Services evaluator, canary, promotion, health, or generic shadow harness. Mode 005
  adds namespaced Agent Improvement inputs and projections and reuses the mode 004 services.
- Reimplementing the typed event envelope, transition-authorization gateway, reducers, sealed artifacts, receipts, resume
  classification, rollback switch, or phase-014 generic shadow framework.
- Changing Agent Improvement proposal policy, evaluator thresholds, AgentIR semantics, fixture contents, executor behavior, or
  candidate selection policy. This phase observes the pinned contracts and proves their migration parity.
- Flipping authority from the legacy emitter to the ledger, migrating live in-flight state, removing legacy writers, or defining
  the final mode gate. Authority belongs to later staged cutover work and the `007-rollback-and-mode-gate` sibling.
- Implementing `006-model-benchmark`, `007-skill-benchmark`, the six other sibling concerns, or the mode-parent integration gate.
- Hand-writing generated `description.json` or `graph-metadata.json` metadata for this folder.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Both paths consume one frozen Agent Improvement execution | The report binds BASE, candidate and baseline digests, run manifest, AgentIR/inheritance digest, evaluator capsule and epoch, fixture rings, executor descriptors, environment, tool receipts, and budget context; neither path dispatches additional work |
| REQ-002 | The Agent Improvement lifecycle has a complete typed event map | Every transition from initialization through proposal, evaluation, frontier selection, resume, and promotion preparation has a named mode event or explicit shared-service mapping; no lifecycle step is compared only through a final score |
| REQ-003 | Mode events compare event-for-event | After declared canonicalization, event type, lineage, changed locus, sequence, causal links, stable payload, shared references, and projection fingerprint match at every position; missing, extra, reordered, duplicated, and unauthorized differences fail parity |
| REQ-004 | Canonicalization cannot hide semantic drift | Volatile transport fields have a versioned allowlist and reason; AgentIR structure, inherited clauses, authority conflicts, raw trials, family outcomes, evaluator epochs, failure classes, frontier decisions, and promotion dispositions remain comparable |
| REQ-005 | Agent-specific projections have parity | AgentIR, clause coverage, proposal lineage, raw observations, score versions, family stability, insufficient-evidence state, frontier membership, ablation, transfer, canary, promotion, rollback, and terminal projections have equal canonical fingerprints |
| REQ-006 | Candidate generation and causal evidence remain traceable | The legacy and ledger projections retain the same mutation locus, parent lineage, failure-cluster inputs, change-contract obligations, known-defect intervention, ablation result, and proposal disposition; a generic candidate ID cannot replace these fields |
| REQ-007 | Shared evaluator, canary, and promotion services remain aligned without duplication | Mode 005 references the mode 004 common-service events, evaluator capsule, raw trial, canary, promotion, receipt, and health observations; common control-plane differences are surfaced and cannot mask Agent Improvement behavior drift |
| REQ-008 | Failure, resume, and transfer behavior remain fail-closed | Missing samples, stale or changed evaluator epochs, unsupported AgentIR, authority conflicts, tool/state failures, executor mismatch, insufficient evidence, crash, and resume produce the same blocked, invalid, or incomplete disposition on both paths |
| REQ-009 | Parity evidence is reproducible and bound | Each fixture records BASE, schema and reducer versions, AgentIR and evaluator digests, comparator configuration, fixture ID, stream digests, projection fingerprints, exit status, and unexplained-diff disposition |
| REQ-010 | Authority remains protected until parity is green | The harness is explicitly non-authoritative; any unexplained semantic diff, missing receipt, nondeterministic replay, evaluator-integrity failure, fixture gap, or shadow write blocks the successor gate and all cutover work |
<!-- /ANCHOR:requirements -->

### Shadow-parity acceptance contract

The mode is parity-green only when every required fixture produces a canonical legacy stream and ledger stream with equal event
count, order, event type, logical identity, changed-locus and lineage fields, causal links, protected payload, shared-service
references, and projection fingerprint. The comparator may ignore only fields named in the versioned volatility allowlist, such as
process-local timing or transport correlation values; a field is not volatile merely because it is inconvenient to compare. Every
allowlisted field must still be checked for presence, type, and non-interference with semantic identity.

The gate requires zero unexplained differences across proposal, single-locus repair, frontier, defect-injection, discipline,
missing-evidence, evaluator-epoch, semantic-variant, executor-transfer, resume, canary, and promotion-preparation fixtures. A
tolerated difference is not green until it has a typed disposition, owner, reason, and proof that it cannot change candidate
lineage, trusted scoring, family stability, evaluator integrity, or authority. Missing family samples produce
`INSUFFICIENT_EVIDENCE`, not stability. A missing or malformed parity receipt is a failure, not an empty result. The receipt is
evidence for the later mode gate; it is not a cutover certificate.

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The Agent Improvement event map covers proposal generation, candidate evaluation, scoring, frontier selection, resume, promotion preparation, and failure branches, including causal and discipline evidence.
- **SC-002**: Legacy and ledger shadow streams match event-for-event after only declared canonicalization, with zero unexplained semantic differences.
- **SC-003**: AgentIR, lineage, changed-locus, raw-trial, family, evaluator, frontier, transfer, canary, promotion, receipt, rollback, and terminal projections are fingerprint-equivalent on every required fixture.
- **SC-004**: Missing evidence, evaluator changes, authority conflicts, known-locus defects, semantic variants, executor changes, and crash/resume cases preserve fail-closed legacy behavior and deterministic ledger replay.
- **SC-005**: A reproducible parity receipt is accepted by `007-rollback-and-mode-gate` while explicitly leaving authority with the legacy path and reusing, rather than replacing, mode 004 common services.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **False parity from terminal-score comparison** - A matching score can conceal changed AgentIR clauses, proposal lineage,
  family regressions, insufficient evidence, evaluator epoch, or promotion state. Mitigation: compare the canonical event stream and
  intermediate agent-specific projections.
- **Over-broad canonicalization** - Dropping candidate IDs, clause fields, raw observations, or evaluator references can hide
  mutation drift. Mitigation: preserve raw values and hashes, maintain a reviewed allowlist, and fail on unknown fields.
- **Evaluator profile substitution** - The findings identify that separate candidate and baseline profiles can make the measured
  delta compare different check sets. Mitigation: bind both paths to one evaluator capsule and epoch, compare profile digests, and
  return an explicit mismatch when the legacy behavior differs from the pinned contract.
- **Self-referential or leaked promotion evidence** - A candidate may alter evaluator-visible assets or learn sealed fixtures.
  Mitigation: reuse common evaluator/canary/promotion controls, compare integrity and exposure events, and keep the shadow path
  outside the mutable AgentIR capability boundary.
- **Nondeterministic proposal and executor behavior** - Live model calls, tool results, retries, or executor changes can create
  unrelated differences. Mitigation: freeze proposals, traces, tool receipts, environment, executor descriptors, and evaluator
  inputs for deterministic fixtures; classify live divergence as non-green.
- **Missing evidence counted as stability** - An absent family or dimension sample can masquerade as repeatability. Mitigation:
  compare coverage and sample presence, require explicit `INSUFFICIENT_EVIDENCE`, and block promotion parity on gaps.
- **Shared-service drift or duplicate implementation** - A variant-local comparator could weaken common evaluator, canary, or
  promotion checks. Mitigation: consume mode 004 contracts, namespace only Agent Improvement fields, and bind shared-service digests.
- **Authority leakage** - A shadow adapter could dispatch, promote, mutate a baseline, or allocate an untracked authority lease.
  Mitigation: assert non-authoritative flags, isolated output, read-only inputs, transition authorization, and no cutover artifact.
- **Dependencies**: phase 012 shared mode contracts and write-set conflict graph; phase 014 shadow framework; parent compatibility
  bridge; mode 004 Deep Improvement Common Services; Agent Improvement siblings `001-typed-ledger-schema` through
  `005-resume-adapter`; existing agent-loop proposal, scoring, trace, and promotion fixtures; and the spec-kit validator.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which phase-014 shadow-framework event envelope and comparator extension points are mandatory for Agent Improvement, and which
  common evaluator, canary, promotion, and health events remain control-plane evidence only?
- Which legacy proposal and scoring boundaries are canonical when one proposal call creates multiple AgentIR or package records,
  and what stable logical identity preserves the original grouping?
- Which AgentIR, inherited-clause, authority-conflict, family, and evaluator fields are protected semantics versus transport
  volatility, and what digest rule proves their comparison is stable?
- What minimum fixture corpus covers single-locus repair, defect attribution, act/refuse/clarify, semantic variants, untouched
  families, executor transfer, missing evidence, evaluator epoch changes, and canary exposure without duplicating common fixtures?
- How should a ledger event represent legacy profile generation when the current path derives candidate and baseline profiles
  separately, while keeping the profile-substitution defect visible rather than blessing it as parity?
- What parity receipt fields and failure severities does `007-rollback-and-mode-gate` require before it can authorize rollback
  readiness or any later authority review?

These questions are planning boundaries, not permission to weaken parity. Until answered against the shared contracts and frozen
fixtures, the safe disposition is blocked or indeterminate and the legacy path remains authoritative.
<!-- /ANCHOR:questions -->
