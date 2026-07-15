---
title: "Tasks: Agent Improvement - Sealed Reference Artifacts"
description: "Tasks for the agent-improvement sealed-artifacts phase, covering shared sealing bindings for AgentIR changes, improver lineage, causal proposals, candidate and trajectory evidence, behavior-family coverage, four-ring exposure, tamper-evident reads, and successor references."
trigger_phrases:
  - "agent improvement sealed artifacts tasks"
  - "agent improvement AgentIR sealing tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/005-agent-improvement/003-sealed-artifacts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/005-agent-improvement/003-sealed-artifacts"
    last_updated_at: "2026-07-15T20:50:00Z"
    last_updated_by: "opencode"
    recent_action: "Decomposed agent sealing into lineage, trial, exposure, and read-path tasks"
    next_safe_action: "Pin AgentIR, improver, causal, and trajectory fixture manifests"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Agent Improvement - Sealed Reference Artifacts

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

- [ ] T001 Confirm `002-reducers-and-projections` publishes the artifact-reference, evaluator-epoch, canary-status, promotion-status, and projection-fingerprint inputs
- [ ] T002 Read the shared phase-003 sealing primitive and deep-improvement-common adapter contract; record canonicalization, dependency, seal-on-write, publication, verification, lifecycle, and failure semantics
- [ ] T003 Build the AgentIR, inheritance, change-contract, improver, causal-evidence, candidate, trajectory, behavior-family, executor, four-ring, canary, and successor-binding field matrix
- [ ] T004 Define ownership boundaries with `004-deep-improvement-common/003-sealed-artifacts`, `004-certificates-and-receipts`, the reducer sibling, and the typed-ledger, shadow, rollback, and mode-gate siblings
- [ ] T005 Pin valid, mutated, partial-write, missing-dependency, stale-epoch, hidden-leak, executor-mismatch, insufficient-evidence, and mixed-version fixtures
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T006 [P] Define the agent-specific adapter over the shared seal contract, including artifact reference, dependency manifest, lifecycle, verification result, and typed failure vocabulary
- [ ] T007 [P] Define canonical AgentIR serialization and digest coverage for components, inheritance, capabilities, tools, routing, memory, inference, executor, and parent lineage
- [ ] T008 Define the typed change-contract artifact for patch operations, changed and inherited clauses, intended and preserved behavior, static assertions, trace policies, scenarios, and behavioral-semver impact
- [ ] T009 Define the frozen improver-lane artifact for model/build, optimizer version, train/dev/sealed corpora, mutation policy, visibility, query budget, and candidate lineage
- [ ] T010 Define causal failure and proposal artifacts for failure clusters, first-divergent traces, known-defect loci, interventions, diagnostic evidence, patch lineage, and candidate package bytes
- [ ] T011 Define candidate/base trial and normalized trajectory references for evaluator epoch, executor/environment, task, behavior family, semantic variant, seed, raw output, side effect, predicate, and integrity data
- [ ] T012 Define behavior-family and four-ring manifests for act/refuse/clarify, authority conflict, transitions, side effects, negative capability, perturbations, untouched sentinels, semantic variants, and rotating canaries
- [ ] T013 Bind the common evaluator, canary, scoring, redaction, and promotion-input services to verified agent references without private service semantics
- [ ] T014 Define tamper-evident reads, quarantine, stale, epoch, visibility, executor mismatch, and insufficient-evidence handling through the common failure contract
- [ ] T015 Define redacted candidate-facing views that withhold hidden fixtures, evaluator internals, exact terminal scores, and mutable service state
- [ ] T016 [P] Add reference-only integration points for `004-certificates-and-receipts`; keep certificates, receipts, and effect recovery out of this phase
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T017 Verify equivalent AgentIR and dependency inputs produce identical references and every covered component, clause, operator, evaluator, executor, fixture, seed, or dependency mutation produces a new identity
- [ ] T018 Verify interrupted, retried, duplicate, concurrent, and truncated writes never publish partial content or overwrite an existing sealed reference
- [ ] T019 Verify tampered AgentIR, change contracts, proposal bytes, trajectories, manifests, dependency references, lifecycle fields, hidden commitments, and epochs fail closed
- [ ] T020 Verify causal proposal fixtures preserve first-divergent trace references, known loci, intervention plans, bounded evidence, and lineage before reducer scoring
- [ ] T021 Verify candidate/base trial fixtures remain reproducible across behavior families, semantic variants, untouched sentinels, rotating canaries, and executor adapters
- [ ] T022 Verify missing, stale, leaked, quarantined, unsupported, superseded, executor-mismatched, and insufficient-evidence references cannot reach evaluator acceptance or promotion eligibility
- [ ] T023 Verify common evaluator, canary, scoring, redaction, promotion-input, and veto fixtures have identical semantics for the agent variant and shared services
- [ ] T024 Verify candidate-facing views exclude hidden fixtures, exact evaluator internals, exact terminal scores, and mutable service state
- [ ] T025 Verify re-reduction, evaluator-epoch, normalization, and canary-retirement changes preserve raw references while creating new derived identities
- [ ] T026 Verify the successor binding contains candidate/base, behavior-family, evaluator, environment, canary, transfer, and rollback references without materializing its certificate
- [ ] T027 Run the phase validator, replay/property suite, crash and mutation suite, access-boundary suite, service-contract suite, and exact-scope diff check
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with evidence
- [ ] Phase gate green (validate/replay/property/failure-injection as applicable)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
