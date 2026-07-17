---
title: "Tasks: Skill Benchmark - Sealed Reference Artifacts"
description: "Tasks for the Skill Benchmark sealed-artifact phase, covering the shared primitive adapter, treatment and bundle references, scenario and gold manifests, exposure and scoring observations, tamper-evident reads, and certificate-input boundaries."
trigger_phrases:
  - "Skill Benchmark sealed artifacts tasks"
  - "skill benchmark reference sealing tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/007-skill-benchmark/003-sealed-artifacts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/007-skill-benchmark/003-sealed-artifacts"
    last_updated_at: "2026-07-15T21:30:00Z"
    last_updated_by: "opencode"
    recent_action: "Decomposed Skill Benchmark sealing into design input and evidence tasks"
    next_safe_action: "Pin shared seal behavior and treatment gold exposure fixtures"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Skill Benchmark - Sealed Reference Artifacts

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

- [ ] T001 Confirm `002-reducers-and-projections` freezes treatment-cell, artifact-reference, gold-policy, and projection inputs
- [ ] T002 Read the shared phase-006 sealing primitive and record canonicalization, digest, dependency, seal-on-write, publication, lifecycle, and verification semantics
- [ ] T003 Read deep-improvement-common mode-004 contracts for evaluator capsules, canary epochs, replay, budgets, receipts, visibility, and common read failures
- [ ] T004 Build the artifact field and dependency matrix for design, bundle, scenario/gold, assignment, exposure, scoring, and certificate-input references
- [ ] T005 Define ownership boundaries with the reducer sibling, common services, `004-certificates-and-receipts`, and the shared transition-authorized ledger
- [ ] T006 Pin valid paired, ablation, empty/pending-gold, changed-gold, resource-canary, compatibility, composition, leak, partial-write, and mixed-version fixtures
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T007 [P] Define the single phase-006-backed Skill Benchmark sealing adapter, typed reference, dependency manifest, lifecycle, visibility, and verification result
- [ ] T008 [P] Define canonical serialization and digest coverage for treatment designs, skill bundles, resource closures, scenario/gold manifests, assignments, observations, and certificate inputs
- [ ] T009 Define seal-on-write validation, atomic publication, read-back verification, incomplete-write handling, and immutable overwrite refusal through the shared primitive
- [ ] T010 Define the randomized off/auto/forced/placebo/distractor/ablation treatment lattice with seed, replicate, blocking, propensity, and paired-cell identity
- [ ] T011 Define skill bundle, registry, resource, task, workload, dependency, compatibility, deterministic-check, dynamic-reference, negative-control, and gold-policy references
- [ ] T012 Define run-assignment references binding treatment, task, skill, executor, environment, tools, permissions, dependencies, registry, workload, seed, and evaluator epoch
- [ ] T013 Define exposure and causal-path observations for discovery, progressive loading, invocation, resource canaries, milestones, final state, cost, latency, tokens, and security probes
- [ ] T014 Define gold-integrity admission, scored/negative/structural-only/pending states, provenance, empty-gold blocking, and mutation-sensitivity evidence
- [ ] T015 Define raw scoring and effect-certificate input references for paired intervals, ablations, compatibility, negative transfer, cost/security deltas, validity, and expiry
- [ ] T016 Define tamper-evident reads and typed refusal states for missing, digest, dependency, schema, lifecycle, epoch, gold, stale, leak, incompatibility, and quarantine failures
- [ ] T017 Define redacted candidate-facing views and common service adapters without private seal, evaluator, canary, replay, budget, receipt, or promotion semantics
- [ ] T018 [P] Add reference-only integration points for `004-certificates-and-receipts`; keep certificate decision and receipt materialization out of this phase
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T019 Verify equivalent canonical inputs produce identical references and each covered design, bundle, task, gold, evaluator, executor, environment, registry, tool, permission, dependency, or workload mutation produces a new identity
- [ ] T020 Verify interrupted, retried, duplicate, and concurrent writes never publish partial content or overwrite an existing sealed reference
- [ ] T021 Verify tampered bytes, manifests, dependency references, treatment assignments, gold policy, hidden commitments, lifecycle, common epochs, and compatibility metadata fail closed with typed results
- [ ] T022 Verify valid paired treatment cells reproduce the same task, skill, executor, environment, evaluator, gold, workload, and registry inputs after replay
- [ ] T023 Verify exposure observations distinguish discovery, loading, invocation, resource-canary, trajectory, final outcome, cost, latency, token, and security stages
- [ ] T024 Verify empty, pending, structural-only, stale, changed, and mutated gold cannot produce positive score evidence and mutation sensitivity is observable
- [ ] T025 Verify raw observations remain immutable and addressable after reducer, attribution, normalization, and evaluator-policy changes while new derived references are created
- [ ] T026 Verify canary leakage, incompatible dependencies, unsafe composition, stale validity, expired evidence, and hidden-material access block scoring or certificate input
- [ ] T027 Verify candidate-facing views exclude hidden gold, exact canaries, evaluator internals, terminal evidence, and mutable service state
- [ ] T028 Verify common, agent, model, and skill adapters consume identical seal, evaluator, canary, replay, budget, receipt, read-failure, and evidence-reference semantics
- [ ] T029 Run the phase validator, replay/property suite, crash and mutation suite, gold-integrity suite, access-boundary suite, and exact-scope diff check
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
