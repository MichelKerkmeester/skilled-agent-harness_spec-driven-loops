---
title: "Tasks: Agent Improvement - Rollback & Mode Gate"
description: "Tasks for planning and verifying the Agent Improvement fail-closed rollback switch, bounded rollback window, independent mode gate, deep-improvement-common service reuse, and phase-014 readiness certificate."
trigger_phrases:
  - "agent improvement rollback and mode gate tasks"
  - "agent loop rollback switch tasks"
  - "agent improvement migration gate tasks"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/005-agent-improvement/007-rollback-and-mode-gate"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/005-agent-improvement/007-rollback-and-mode-gate"
    last_updated_at: "2026-07-15T21:20:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined Agent Improvement rollback switch and independent gate boundary"
    next_safe_action: "Freeze agent gate predicates and rollback-window evidence against shared contracts"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Agent Improvement - Rollback & Mode Gate

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

- [ ] T001 Confirm the phase remains planning-only, the legacy path remains authoritative, and the gate has no direct cutover capability
- [ ] T002 [P] Pin BASE and the shared transition/versioning/rollback policy, including the 14-day and five-successful-authoritative-execution minimum
- [ ] T003 [P] Record the phase-012 contract freeze, phase-012 shared mode contract, write-set graph, and phase-014 handoff fingerprints
- [ ] T004 Inventory Agent Improvement sibling outputs `001` through `006`: event, reducer, seal, certificate, receipt, replay, resume, and parity boundaries
- [ ] T005 [P] Inventory Agent Improvement proposal, scoring, evaluator, canary, promotion, legacy projection, and authority-sensitive effect boundaries
- [ ] T006 Build the Agent Improvement gate input manifest and the common-service reuse matrix for `005-agent-improvement`, `006-model-benchmark`, and `007-skill-benchmark`
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T007 Define the default-deny switch states, request fields, external authorization decision, monotonic epoch rules, fencing token, and stale-writer rejection
- [ ] T008 Define Agent Improvement rollback triggers for parity, AgentIR/seal, evaluator/canary, critical behavior, transfer, receipt, resume, effect, budget, health, and split-brain failures
- [ ] T009 Define the rollback-window record with window ID, legacy anchor, typed AgentIR frontier, gate evidence, opening and expiry policy, trigger policy, fencing token, valid-run count, and close receipt
- [ ] T010 Define the inherited 14-calendar-day and five-successful-authoritative-execution rule, low-traffic and unresolved-obligation extensions, and re-arming behavior
- [ ] T011 Define the non-destructive rollback runbook: freeze admission, fence writers, classify in-flight work, recover or quarantine effects, restore legacy at a new epoch, preserve evidence, and issue a certificate
- [ ] T012 Define the independent gate predicates for shadow parity, AgentIR and trajectory seals, common evaluator/canary/promotion evidence, certificates, receipts, replay, resume, coverage, transfer, rollback rehearsal, and zero authority writes
- [ ] T013 Define the Agent Improvement evidence rules that retain raw observations separately from normalization, calibration, reduction, promotion, and causal claims
- [ ] T014 Define the behavior-family gate for clauses, authority conflicts, act/refuse/clarify, side effects, perturbations, untouched families, executor portability, profile scope, and critical invariants
- [ ] T015 Define the common-service reuse contract and reject Agent Improvement-local copies or weakened evaluator, canary, promotion, receipt, certificate, fingerprint, veto, or recovery semantics
- [ ] T016 Define the exact-SHA mode certificate, verifier receipt, failed-predicate list, unresolved obligations, rollback anchor, window state, AgentIR frontier, and phase-014 handoff
- [ ] T017 [P] Define deterministic `gate_passed`, `gate_blocked`, `gate_incomplete`, and `rollback_required` semantics without implicit fallback to pass
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T018 Verify absent, malformed, stale, unauthorized, mixed-version, wrong-mode, cross-frontier, and gateway-failed switch requests preserve legacy authority and produce no semantic append or side effect
- [ ] T019 Verify Agent Improvement cannot self-authorize rollback, unquarantine, verifier replacement, or legacy restoration
- [ ] T020 Verify the rollback window cannot close before both 14 calendar days and five successful authoritative executions and extends on low traffic or unresolved obligations
- [ ] T021 Verify rollback rehearsal freezes admission, fences stale writers, classifies in-flight proposal/evaluation/canary/promotion work, recovers or quarantines effects, restores legacy, changes the epoch, preserves evidence, and emits a rollback certificate
- [ ] T022 Verify event and projection parity across AgentIR compilation, candidate lineage, proposal generation, raw evaluation, scoring, canary, promotion, abort, restore, resume, duplicate, crash, and incomplete fixtures
- [ ] T023 Verify AgentIR, change-contract, improver, failure, candidate, raw-trajectory, evaluator, canary, and promotion references offline with stable seals, dependency closures, epochs, and content digests
- [ ] T024 Verify clause, authority-conflict, act/refuse/clarify, side-effect, perturbation, untouched-family, executor, profile-transfer, and critical-invariant evidence cannot be replaced by aggregate score
- [ ] T025 Verify missing observations, changed policies, unknown effects, telemetry gaps, unsupported versions, evaluator or canary epoch mismatch, leak evidence, transfer failure, and nondeterministic replay remain non-green
- [ ] T026 Verify all three downstream variants consume identical common-service decisions and cannot pass with private evaluator, canary, promotion, receipt, certificate, fingerprint, veto, or rollback semantics
- [ ] T027 Verify repeated evaluation of one sealed Agent Improvement frontier produces the same gate disposition and certificate body digest; mutate semantic inputs and require rejection
- [ ] T028 Verify phase 014 receives readiness evidence only and rejects any certificate claiming authority moved, the rollback window closed, or legacy writers retired
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with evidence
- [ ] Independent Agent Improvement mode gate green and phase-014 readiness certificate emitted
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Predecessor parity contract**: `../006-shadow-parity`
- **Shared rollback and common-service contract**: `../../004-deep-improvement-common/007-rollback-and-mode-gate`
- **Agent Improvement inputs**: `../001-typed-ledger-schema`, `../002-reducers-and-projections`, and `../003-sealed-artifacts`
- **Phase-014 readiness handoff**: See the staged cutover and authority handoff contract
<!-- /ANCHOR:cross-refs -->
