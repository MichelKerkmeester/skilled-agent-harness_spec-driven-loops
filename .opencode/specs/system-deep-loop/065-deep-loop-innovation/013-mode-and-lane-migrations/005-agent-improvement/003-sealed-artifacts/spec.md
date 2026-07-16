---
title: "Feature Specification: Agent Improvement - Sealed Reference Artifacts"
description: "Plan the sealed reference artifacts for the agent-improvement variant: immutable AgentIR and change inputs, frozen improver and evaluator references, content-addressed proposal and trial outputs, and a tamper-evident read path layered on the deep-improvement-common sealing and evaluator services."
trigger_phrases:
  - "agent improvement sealed reference artifacts"
  - "agent improvement sealing"
  - "sealed agent proposal artifacts"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/005-agent-improvement/003-sealed-artifacts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/005-agent-improvement/003-sealed-artifacts"
    last_updated_at: "2026-07-15T20:50:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined Agent Improvement sealed input and output boundaries"
    next_safe_action: "Freeze AgentIR, trial, canary, and proposal dependency digests"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Agent Improvement - Sealed Reference Artifacts

> Phase adjacency under `005-agent-improvement` (grouping order, not a runtime dependency): predecessor `002-reducers-and-projections`; successor `004-certificates-and-receipts`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/005-agent-improvement/003-sealed-artifacts |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop (agent-improvement mode) |
| **Origin** | Phase 006 of the agent-improvement migration under phase 013 |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The agent-improvement mode proposes and scores changes to an agent definition: prompts, tools, routing, memory, topology,
verifier policy, and inference configuration. A candidate is not reproducible from its final score. Its result depends on the
base AgentIR and inheritance graph, the changed component and operator lineage, the frozen improver version, the failure traces
that caused the proposal, the evaluator epoch, executor and environment, fixture exposure, seeds, and the raw trajectories that
preceded reduction. If any of those inputs or outputs remain mutable or are referenced only by a path, a later replay cannot
distinguish a real behavioral repair from evaluator drift, executor variance, or a changed proposal context.

The parent program requires one typed append-only spine with sealed reference artifacts, replay fingerprints, receipts and
certificates, and staged shadow/canary/ship behavior. The deep-improvement-common workstream already owns the evaluator,
canary, and promotion services and the shared sealed-artifact contract. This phase therefore plans the agent-improvement
variant's artifact bindings on top of those services: content-addressed AgentIR and change inputs, proposal and experiment
outputs, normalized trajectories, behavior-family evidence, and redacted views. It consumes the shared phase-006 sealing
primitives and does not invent a second sealing scheme. This is planning only; certificate and receipt materialization belongs
to the successor phase.

The research inputs make the mode-specific boundary concrete. The variant needs a typed AgentIR and causal slicing from the
first divergent trace event, Pareto-preserving candidate lineages, a frozen improver lane, clause-to-benchmark compilation,
act/refuse/clarify and authority-conflict families, known-locus defect injection, non-discovery executor replay, four-ring
evaluation manifests, family-level retention, and exposure-aware canaries. Those are sealed references and evidence inputs in
this phase, not new evaluator or promotion implementations.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- One agent-improvement adapter over the shared phase-006 sealing primitives and the deep-improvement-common artifact/read contract; no local digest, signature, manifest, storage, or verification protocol.
- A sealed base-agent bundle containing canonical AgentIR, inheritance graph, capability and authority declarations, executor/tool configuration, and the parent agent artifact digest.
- A sealed change-contract bundle containing changed component IDs, typed patch operations, inherited-clause obligations, intended behavior, preserved behavior, behavioral-semver impact, and the proposal's parent lineage.
- A sealed improver-lane reference containing improver model/build, prompt or policy, training and development corpus digests, frozen optimizer version, mutation operator identity, and visibility/query policy.
- Sealed failure and causal-analysis inputs containing failure-cluster digests, first-divergent trace references, known-defect locus, counterfactual intervention plan, and the bounded evidence exposed to proposal generation.
- Sealed candidate proposal outputs containing candidate AgentIR/package bytes, atomic patch lineage, operator and parent references, proposal rationale references, and the content digests required to reproduce a candidate without re-running proposal generation.
- Sealed agent trial and trajectory references containing executor/environment identity, task and behavior-family selection, seed, semantic variants, authority-conflict and negative-capability cases, raw normalized traces, side-effect observations, receipt predicates, and per-case outcome vectors before common reducers score them.
- Agent-specific bindings to the common evaluator capsule, canary epoch, redacted candidate view, promotion input, and tamper-evident read path, including four-ring exposure and canary retirement state.
- Replay, mutation, truncation, missing-dependency, stale-epoch, hidden-leak, executor-mismatch, and mixed-version fixtures proving that the agent references are reproducible and fail closed.

### Out of Scope

- Defining or implementing a second digest, signature, chain, canonicalization, storage, seal-on-write, or read-verification scheme outside the shared phase-006 primitives.
- Re-implementing the deep-improvement-common evaluator, canary, scoring, promotion, redaction, or shared artifact lifecycle services; this phase supplies agent-specific bindings and fields only.
- Defining the typed event envelope, append-only ledger, reducers, projections, or replay-fingerprint policy owned by the preceding sibling phases.
- Implementing the agent typed-ledger schema, reducer fold, resume adapter, shadow-parity harness, rollback switch, or independent mode gate owned by the other agent-improvement child phases.
- Materializing the behavioral transfer certificate, promotion certificate, receipt, or effect-recovery outcome owned by `004-certificates-and-receipts`.
- Changing authority, retiring legacy writers, enabling live promotion, or making the new sealed artifacts authoritative before the parent cutover phase.
- Re-running the 065 research or changing the parent program's 178-row disposition ledger.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Agent-improvement artifacts use the shared sealing primitives | Every declared artifact kind routes through the deep-improvement-common adapter over the phase-006 primitive; no variant-owned digest or verification path exists |
| REQ-002 | Agent inputs are content-addressed and dependency-closed | Base AgentIR, inheritance graph, capability policy, executor/tool configuration, and parent lineage resolve to one digest closure; any covered change produces a new identity |
| REQ-003 | A change contract makes proposal scope reproducible | Changed component IDs, typed patch operations, inherited clauses, intended and preserved behavior, operator lineage, and behavioral-semver impact are sealed before proposal generation |
| REQ-004 | The improver lane is frozen per experiment | Improver build, optimizer version, training/dev/sealed corpus digests, mutation policy, visibility policy, and query budget are bound to every proposal lineage and cannot change in place |
| REQ-005 | Causal proposal evidence is immutable | Failure clusters, first-divergent trace references, known-defect loci, intervention plans, and bounded proposal-visible evidence are sealed before a proposal is emitted |
| REQ-006 | Candidate outputs and raw trajectories are replayable | Candidate package bytes, parent and patch lineage, executor/environment, task selection, seed, raw normalized traces, side effects, predicates, and per-case vectors remain addressable before reduction |
| REQ-007 | Agent behavior coverage and exposure are sealed | Clause, authority-conflict, transition, side-effect, negative-capability, perturbation, untouched-family, semantic-variant, executor, and rotating-canary coverage is bound to versioned manifests and exposure epochs |
| REQ-008 | Reads are tamper-evident and fail closed | Digest, schema, dependency closure, seal state, evaluator epoch, canary freshness, visibility scope, and executor compatibility are checked before an artifact is usable; mismatch never returns guessed or stale content |
| REQ-009 | Common services remain the single source of truth | Agent-improvement consumes common evaluator, canary, scoring, promotion-input, redaction, failure, and veto semantics without re-implementing or privately redefining them |
| REQ-010 | Sealed references survive policy and reducer changes | Raw candidate and trajectory references remain immutable while new evaluator, normalization, reduction, or exposure epochs produce new derived references rather than silently reinterpreting old evidence |
| REQ-011 | The successor can bind, not recreate, agent evidence | `004-certificates-and-receipts` receives verified agent artifact digests, promotion inputs, canary state, and rollback parent references without certificate or receipt materialization in this phase |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A single shared sealing adapter produces deterministic, dependency-closed identities for agent inputs, proposals, trials, trajectories, canaries, and promotion inputs.
- **SC-002**: A candidate can be reproduced from sealed AgentIR, change-contract, improver, evaluator, executor, fixture, seed, and raw-trajectory references without relying on mutable paths or an unrecorded optimizer state.
- **SC-003**: Tampered, partial, stale, leaked, executor-incompatible, missing, or mixed-epoch references fail closed through the common read path.
- **SC-004**: Agent-specific behavior families, causal interventions, four-ring exposure, and rotating canaries remain independently addressable after scoring, reducer, evaluator, or normalization changes.
- **SC-005**: Agent-improvement consumes deep-improvement-common evaluator, canary, redaction, and promotion services without semantic forks or duplicate sealing behavior.
- **SC-006**: Verified agent references provide the successor with a reproducible promotion input and rollback parent while live authority remains unchanged.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Second sealing scheme** - A variant-local hash or manifest would make agent artifacts incomparable with common evaluator and promotion evidence. Mitigation: use one named adapter and reject alternate seal metadata in contract fixtures.
- **Incomplete AgentIR closure** - Omitting inherited clauses, tool schema, capability policy, executor, or parent lineage can make identical-looking candidates behaviorally different. Mitigation: require an explicit dependency manifest and verify every digest before read acceptance.
- **Self-referential improver drift** - If the improver, its training corpus, or visibility policy changes during an experiment, proposal comparisons lose causal meaning. Mitigation: seal the improver lane and freeze it for every candidate lineage.
- **Proposal evidence leakage** - Exact hidden fixtures, evaluator internals, or terminal scores can let the proposer optimize the judge rather than the agent. Mitigation: common redacted views, hidden commitments, query budgets, semantic leak checks, and non-overridable veto references.
- **Trajectory reduction erases causality** - A scalar score can hide first-divergence, side-effect, authority, or negative-capability failures. Mitigation: seal normalized raw trajectories and behavior-family vectors before common reducers run.
- **Executor-specific wins** - An agent may improve only under the discovery executor or verifier. Mitigation: bind executor/environment digests and require non-discovery executor references in the sealed promotion input.
- **Cross-epoch comparison** - Candidate and baseline evidence may use different evaluator, canary, fixture, or normalization material. Mitigation: require one common evaluator epoch and explicit exposure/retirement state for every comparison.
- **Dependencies**: the shared phase-006 sealing primitives; `002-reducers-and-projections` for artifact references and service status; `004-deep-improvement-common/003-sealed-artifacts` for the common adapter and service contract; phase 012 shared mode contracts and write-set conflict graph; `004-certificates-and-receipts` for successor binding; and the spec-kit validator.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

Deferred to execution against the frozen predecessor and common service contracts:
- Which AgentIR fields are immutable inputs, which are typed patch outputs, and which operational fields remain outside content identity while still being audit-bound?
- Which inherited-clause, capability, executor, and environment references are mandatory for dependency closure before a candidate can be proposed or evaluated?
- Which causal-analysis details may be exposed to the improver as bounded evidence, and which remain hidden commitments or terminal-only evidence?
- How are semantic variants, untouched-family sentinels, and rotating canaries retired after proposer-visible failure without mutating their original sealed manifests?
- Which executor mismatch or verifier-isolation failures quarantine a trial immediately, and which can be represented as an ineligible derived reference for later analysis?
- What exact verified reference bundle does `004-certificates-and-receipts` require for the behavioral transfer certificate and rollback parent?
<!-- /ANCHOR:questions -->
