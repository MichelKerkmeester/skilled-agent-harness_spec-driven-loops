---
title: "Tasks: Agent Improvement - Sealed Reference Artifacts"
description: "Tasks for the agent-improvement sealed-artifacts phase, covering shared sealing bindings for AgentIR changes, improver lineage, causal proposals, candidate and trajectory evidence, behavior-family coverage, four-ring exposure, tamper-evident reads, and successor references."
trigger_phrases:
  - "agent improvement sealed artifacts tasks"
  - "agent improvement AgentIR sealing tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/005-agent-improvement/003-sealed-artifacts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/005-agent-improvement/003-sealed-artifacts"
    last_updated_at: "2026-07-23T21:06:42Z"
    last_updated_by: "codex"
    recent_action: "Completed and verified the sealed-artifact task set"
    next_safe_action: "Consume verified bindings in the certificate and receipt successor"
    blockers: []
    key_files: []
    completion_pct: 100
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

- [x] T001 Confirm `002-reducers-and-projections` publishes the artifact-reference, evaluator-epoch, canary-status, promotion-status, and projection-fingerprint inputs [evidence: implementation-summary.md records the scoped delivery; focused real-store Vitest passed 45/45 and runtime tsc grep-own was 0]
- [x] T002 Read the shared phase-007 sealing primitive and deep-improvement-common adapter contract; record canonicalization, dependency, seal-on-write, publication, verification, lifecycle, and failure semantics [evidence: implementation-summary.md records the scoped delivery; focused real-store Vitest passed 45/45 and runtime tsc grep-own was 0]
- [x] T003 Build the AgentIR, inheritance, change-contract, improver, causal-evidence, candidate, trajectory, behavior-family, executor, four-ring, canary, and successor-binding field matrix [evidence: implementation-summary.md records the scoped delivery; focused real-store Vitest passed 45/45 and runtime tsc grep-own was 0]
- [x] T004 Define ownership boundaries with `004-deep-improvement-common/003-sealed-artifacts`, `004-certificates-and-receipts`, the reducer sibling, and the typed-ledger, shadow, rollback, and mode-gate siblings [evidence: implementation-summary.md records the scoped delivery; focused real-store Vitest passed 45/45 and runtime tsc grep-own was 0]
- [x] T005 Pin valid, mutated, partial-write, missing-dependency, stale-epoch, hidden-view, executor-mismatch, and wrong-kind fixtures [evidence: implementation-summary.md records the scoped delivery; focused real-store Vitest passed 45/45 and runtime tsc grep-own was 0]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 [P] Define the agent-specific adapter over the shared seal contract, including artifact reference, dependency manifest, lifecycle, verification result, and typed failure vocabulary [evidence: implementation-summary.md records the scoped delivery; focused real-store Vitest passed 45/45 and runtime tsc grep-own was 0]
- [x] T007 [P] Define canonical AgentIR serialization and digest coverage for components, inheritance, capabilities, tools, routing, memory, inference, executor, and parent lineage [evidence: implementation-summary.md records the scoped delivery; focused real-store Vitest passed 45/45 and runtime tsc grep-own was 0]
- [x] T008 Define the typed change-contract artifact for patch operations, changed and inherited clauses, intended and preserved behavior, static assertions, trace policies, scenarios, and behavioral-semver impact [evidence: implementation-summary.md records the scoped delivery; focused real-store Vitest passed 45/45 and runtime tsc grep-own was 0]
- [x] T009 Define the frozen improver-lane artifact for model/build, optimizer version, train/dev/sealed corpora, mutation policy, visibility, query budget, and candidate lineage [evidence: implementation-summary.md records the scoped delivery; focused real-store Vitest passed 45/45 and runtime tsc grep-own was 0]
- [x] T010 Define causal failure and proposal artifacts for failure clusters, first-divergent traces, known-defect loci, interventions, diagnostic evidence, patch lineage, and candidate package bytes [evidence: implementation-summary.md records the scoped delivery; focused real-store Vitest passed 45/45 and runtime tsc grep-own was 0]
- [x] T011 Define candidate/base trial and normalized trajectory references for evaluator epoch, executor/environment, task, behavior family, semantic variant, seed, raw output, side effect, predicate, and integrity data [evidence: implementation-summary.md records the scoped delivery; focused real-store Vitest passed 45/45 and runtime tsc grep-own was 0]
- [x] T012 Define behavior-family and four-ring manifests for act/refuse/clarify, authority conflict, transitions, side effects, negative capability, perturbations, untouched sentinels, semantic variants, and rotating canaries [evidence: implementation-summary.md records the scoped delivery; focused real-store Vitest passed 45/45 and runtime tsc grep-own was 0]
- [x] T013 Bind the common evaluator, canary, scoring, redaction, and promotion-input services to verified agent references without private service semantics [evidence: implementation-summary.md records the scoped delivery; focused real-store Vitest passed 45/45 and runtime tsc grep-own was 0]
- [x] T014 Define tamper-evident reads, quarantine, stale, epoch, visibility, executor mismatch, and insufficient-evidence handling through the common failure contract [evidence: implementation-summary.md records the scoped delivery; focused real-store Vitest passed 45/45 and runtime tsc grep-own was 0]
- [x] T015 Define redacted candidate-facing views that withhold hidden fixtures, evaluator internals, exact terminal scores, and mutable service state [evidence: implementation-summary.md records the scoped delivery; focused real-store Vitest passed 45/45 and runtime tsc grep-own was 0]
- [x] T016 [P] Add reference-only integration points for `004-certificates-and-receipts`; keep certificates, receipts, and effect recovery out of this phase [evidence: implementation-summary.md records the scoped delivery; focused real-store Vitest passed 45/45 and runtime tsc grep-own was 0]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T017 Verify equivalent canonical inputs produce identical references and covered material mutations produce new identities [evidence: implementation-summary.md records the scoped delivery; focused real-store Vitest passed 45/45 and runtime tsc grep-own was 0]
- [x] T018 Verify interrupted and truncated writes remain unreadable while duplicate equivalent seals preserve immutable references [evidence: implementation-summary.md records the scoped delivery; focused real-store Vitest passed 45/45 and runtime tsc grep-own was 0]
- [x] T019 Verify tampered, unsealed, missing-dependency, policy-mismatched, and wrong-kind references fail closed [evidence: implementation-summary.md records the scoped delivery; focused real-store Vitest passed 45/45 and runtime tsc grep-own was 0]
- [x] T020 Verify causal proposal fixtures preserve first-divergent trace references, known loci, intervention plans, bounded evidence, and lineage before reducer scoring [evidence: implementation-summary.md records the scoped delivery; focused real-store Vitest passed 45/45 and runtime tsc grep-own was 0]
- [x] T021 Verify candidate/base trial fixtures remain reproducible across behavior families, semantic variants, untouched sentinels, rotating canaries, and executor adapters [evidence: implementation-summary.md records the scoped delivery; focused real-store Vitest passed 45/45 and runtime tsc grep-own was 0]
- [x] T022 Verify missing, stale, executor-mismatched, and wrong-kind references cannot release usable bytes [evidence: implementation-summary.md records the scoped delivery; focused real-store Vitest passed 45/45 and runtime tsc grep-own was 0]
- [x] T023 Verify common evaluator, candidate-view, canary, raw-trial, and promotion reads remain delegated to shared services [evidence: implementation-summary.md records the scoped delivery; focused real-store Vitest passed 45/45 and runtime tsc grep-own was 0]
- [x] T024 Verify candidate-facing views exclude hidden fixtures, exact evaluator internals, exact terminal scores, and mutable service state [evidence: implementation-summary.md records the scoped delivery; focused real-store Vitest passed 45/45 and runtime tsc grep-own was 0]
- [x] T025 Verify canonical replay and policy changes preserve raw references without mutation or silent reinterpretation [evidence: implementation-summary.md records the scoped delivery; focused real-store Vitest passed 45/45 and runtime tsc grep-own was 0]
- [x] T026 Verify the successor binding contains candidate/base, behavior-family, evaluator, environment, canary, transfer, and rollback references without materializing its certificate [evidence: implementation-summary.md records the scoped delivery; focused real-store Vitest passed 45/45 and runtime tsc grep-own was 0]
- [x] T027 Run the targeted real-store suite, TypeScript gate, comment-hygiene gate, strict packet validator, metadata refresh, and exact-scope status check [evidence: implementation-summary.md records the scoped delivery; focused real-store Vitest passed 45/45 and runtime tsc grep-own was 0]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete [evidence: implementation-summary.md records the scoped delivery; focused real-store Vitest passed 45/45 and runtime tsc grep-own was 0]
- [x] All requirements in spec.md met with evidence [evidence: implementation-summary.md records the scoped delivery; focused real-store Vitest passed 45/45 and runtime tsc grep-own was 0]
- [x] Phase gate green (validate/replay/property/failure-injection as applicable) [evidence: implementation-summary.md records the scoped delivery; focused real-store Vitest passed 45/45 and runtime tsc grep-own was 0]
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
