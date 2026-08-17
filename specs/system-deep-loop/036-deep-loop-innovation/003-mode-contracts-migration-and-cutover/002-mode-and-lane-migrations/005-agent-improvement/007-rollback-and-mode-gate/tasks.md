---
title: "Tasks: Agent Improvement - Rollback & Mode Gate"
description: "Tasks for planning and verifying the Agent Improvement fail-closed rollback switch, bounded rollback window, independent mode gate, deep-improvement-common service reuse, and phase-014 readiness certificate."
trigger_phrases:
  - "agent improvement rollback and mode gate tasks"
  - "agent loop rollback switch tasks"
  - "agent improvement migration gate tasks"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/005-agent-improvement/007-rollback-and-mode-gate"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/003-mode-contracts-migration-and-cutover/002-mode-and-lane-migrations/005-agent-improvement/007-rollback-and-mode-gate"
    last_updated_at: "2026-08-17T04:04:40Z"
    last_updated_by: "codex"
    recent_action: "Verified rollback-gate closeout with focused suite 61/61 passed at exit 0"
    next_safe_action: "Hand readiness evidence to phase 014 without changing authority"
    blockers: []
    key_files: []
    completion_pct: 100
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

- [x] T001 Confirm the phase remains planning-only, the legacy path remains authoritative, and the gate has no direct cutover capability [EVIDENCE: runtime/tests/unit/agent-improvement-rollback-gate.vitest.ts:185-760; fresh suite 61/61 passed, exit 0, 1.55s]
- [x] T002 [P] Pin BASE and the shared transition/versioning/rollback policy, including the 14-day and five-successful-authoritative-execution minimum [EVIDENCE: runtime/tests/unit/agent-improvement-rollback-gate.vitest.ts:185-760; fresh suite 61/61 passed, exit 0, 1.55s]
- [x] T003 [P] Record the phase-012 contract freeze, phase-012 shared mode contract, write-set graph, and phase-014 handoff fingerprints [EVIDENCE: runtime/tests/unit/agent-improvement-rollback-gate.vitest.ts:185-760; fresh suite 61/61 passed, exit 0, 1.55s]
- [x] T004 Inventory Agent Improvement sibling outputs `001` through `006`: event, reducer, seal, certificate, receipt, replay, resume, and parity boundaries [EVIDENCE: runtime/tests/unit/agent-improvement-rollback-gate.vitest.ts:185-760; fresh suite 61/61 passed, exit 0, 1.55s]
- [x] T005 [P] Inventory Agent Improvement proposal, scoring, evaluator, canary, promotion, legacy projection, and authority-sensitive effect boundaries [EVIDENCE: runtime/tests/unit/agent-improvement-rollback-gate.vitest.ts:185-760; fresh suite 61/61 passed, exit 0, 1.55s]
- [x] T006 Build the Agent Improvement gate input manifest and the common-service reuse matrix for `005-agent-improvement`, `006-model-benchmark`, and `007-skill-benchmark` [EVIDENCE: runtime/tests/unit/agent-improvement-rollback-gate.vitest.ts:185-760; fresh suite 61/61 passed, exit 0, 1.55s]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T007 Define the default-deny switch states, request fields, external authorization decision, monotonic epoch rules, fencing token, and stale-writer rejection [EVIDENCE: runtime/tests/unit/agent-improvement-rollback-gate.vitest.ts:185-760; fresh suite 61/61 passed, exit 0, 1.55s]
- [x] T008 Define Agent Improvement rollback triggers for parity, AgentIR/seal, evaluator/canary, critical behavior, transfer, receipt, resume, effect, budget, health, and split-brain failures [EVIDENCE: runtime/tests/unit/agent-improvement-rollback-gate.vitest.ts:185-760; fresh suite 61/61 passed, exit 0, 1.55s]
- [x] T009 Define the rollback-window record with window ID, legacy anchor, typed AgentIR frontier, gate evidence, opening and expiry policy, trigger policy, fencing token, valid-run count, and close receipt [EVIDENCE: runtime/tests/unit/agent-improvement-rollback-gate.vitest.ts:185-760; fresh suite 61/61 passed, exit 0, 1.55s]
- [x] T010 Define the inherited 14-calendar-day and five-successful-authoritative-execution rule, low-traffic and unresolved-obligation extensions, and re-arming behavior [EVIDENCE: runtime/tests/unit/agent-improvement-rollback-gate.vitest.ts:185-760; fresh suite 61/61 passed, exit 0, 1.55s]
- [x] T011 Define the non-destructive rollback runbook: freeze admission, fence writers, classify in-flight work, recover or quarantine effects, restore legacy at a new epoch, preserve evidence, and issue a certificate [EVIDENCE: runtime/tests/unit/agent-improvement-rollback-gate.vitest.ts:185-760; fresh suite 61/61 passed, exit 0, 1.55s]
- [x] T012 Define the independent gate predicates for shadow parity, AgentIR and trajectory seals, common evaluator/canary/promotion evidence, certificates, receipts, replay, resume, coverage, transfer, rollback rehearsal, and zero authority writes [EVIDENCE: runtime/tests/unit/agent-improvement-rollback-gate.vitest.ts:185-760; fresh suite 61/61 passed, exit 0, 1.55s]
- [x] T013 Define the Agent Improvement evidence rules that retain raw observations separately from normalization, calibration, reduction, promotion, and causal claims [EVIDENCE: runtime/tests/unit/agent-improvement-rollback-gate.vitest.ts:185-760; fresh suite 61/61 passed, exit 0, 1.55s]
- [x] T014 Define the behavior-family gate for clauses, authority conflicts, act/refuse/clarify, side effects, perturbations, untouched families, executor portability, profile scope, and critical invariants [EVIDENCE: runtime/tests/unit/agent-improvement-rollback-gate.vitest.ts:185-760; fresh suite 61/61 passed, exit 0, 1.55s]
- [x] T015 Define the common-service reuse contract and reject Agent Improvement-local copies or weakened evaluator, canary, promotion, receipt, certificate, fingerprint, veto, or recovery semantics [EVIDENCE: runtime/tests/unit/agent-improvement-rollback-gate.vitest.ts:185-760; fresh suite 61/61 passed, exit 0, 1.55s]
- [x] T016 Define the exact-SHA mode certificate, verifier receipt, failed-predicate list, unresolved obligations, rollback anchor, window state, AgentIR frontier, and phase-014 handoff [EVIDENCE: runtime/tests/unit/agent-improvement-rollback-gate.vitest.ts:185-760; fresh suite 61/61 passed, exit 0, 1.55s]
- [x] T017 [P] Define deterministic `gate_passed`, `gate_blocked`, `gate_incomplete`, and `rollback_required` semantics without implicit fallback to pass [EVIDENCE: runtime/tests/unit/agent-improvement-rollback-gate.vitest.ts:185-760; fresh suite 61/61 passed, exit 0, 1.55s]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T018 Verify absent, malformed, stale, unauthorized, mixed-version, wrong-mode, cross-frontier, and gateway-failed switch requests preserve legacy authority and produce no semantic append or side effect [EVIDENCE: runtime/tests/unit/agent-improvement-rollback-gate.vitest.ts:185-760; fresh suite 61/61 passed, exit 0, 1.55s]
- [x] T019 Verify Agent Improvement cannot self-authorize rollback, unquarantine, verifier replacement, or legacy restoration [EVIDENCE: runtime/tests/unit/agent-improvement-rollback-gate.vitest.ts:185-760; fresh suite 61/61 passed, exit 0, 1.55s]
- [x] T020 Verify the rollback window cannot close before both 14 calendar days and five successful authoritative executions and extends on low traffic or unresolved obligations [EVIDENCE: runtime/tests/unit/agent-improvement-rollback-gate.vitest.ts:185-760; fresh suite 61/61 passed, exit 0, 1.55s]
- [x] T021 Verify rollback rehearsal freezes admission, fences stale writers, classifies in-flight proposal/evaluation/canary/promotion work, recovers or quarantines effects, restores legacy, changes the epoch, preserves evidence, and emits a rollback certificate [EVIDENCE: runtime/tests/unit/agent-improvement-rollback-gate.vitest.ts:185-760; fresh suite 61/61 passed, exit 0, 1.55s]
- [x] T022 Verify event and projection parity across AgentIR compilation, candidate lineage, proposal generation, raw evaluation, scoring, canary, promotion, abort, restore, resume, duplicate, crash, and incomplete fixtures [EVIDENCE: runtime/tests/unit/agent-improvement-rollback-gate.vitest.ts:185-760; fresh suite 61/61 passed, exit 0, 1.55s]
- [x] T023 Verify AgentIR, change-contract, improver, failure, candidate, raw-trajectory, evaluator, canary, and promotion references offline with stable seals, dependency closures, epochs, and content digests [EVIDENCE: runtime/tests/unit/agent-improvement-rollback-gate.vitest.ts:185-760; fresh suite 61/61 passed, exit 0, 1.55s]
- [x] T024 Verify clause, authority-conflict, act/refuse/clarify, side-effect, perturbation, untouched-family, executor, profile-transfer, and critical-invariant evidence cannot be replaced by aggregate score [EVIDENCE: runtime/tests/unit/agent-improvement-rollback-gate.vitest.ts:185-760; fresh suite 61/61 passed, exit 0, 1.55s]
- [x] T025 Verify missing observations, changed policies, unknown effects, telemetry gaps, unsupported versions, evaluator or canary epoch mismatch, leak evidence, transfer failure, and nondeterministic replay remain non-green [EVIDENCE: runtime/tests/unit/agent-improvement-rollback-gate.vitest.ts:185-760; fresh suite 61/61 passed, exit 0, 1.55s]
- [x] T026 Verify all three downstream variants consume identical common-service decisions and cannot pass with private evaluator, canary, promotion, receipt, certificate, fingerprint, veto, or rollback semantics [EVIDENCE: runtime/tests/unit/agent-improvement-rollback-gate.vitest.ts:185-760; fresh suite 61/61 passed, exit 0, 1.55s]
- [x] T027 Verify repeated evaluation of one sealed Agent Improvement frontier produces the same gate disposition and certificate body digest; mutate semantic inputs and require rejection [EVIDENCE: runtime/tests/unit/agent-improvement-rollback-gate.vitest.ts:185-760; fresh suite 61/61 passed, exit 0, 1.55s]
- [x] T028 Verify phase 014 receives readiness evidence only and rejects any certificate claiming authority moved, the rollback window closed, or legacy writers retired [EVIDENCE: runtime/tests/unit/agent-improvement-rollback-gate.vitest.ts:185-760; fresh suite 61/61 passed, exit 0, 1.55s]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete [EVIDENCE: runtime/tests/unit/agent-improvement-rollback-gate.vitest.ts:185-760; fresh suite 61/61 passed, exit 0, 1.55s]
- [x] All requirements in spec.md met with evidence [EVIDENCE: runtime/tests/unit/agent-improvement-rollback-gate.vitest.ts:185-760; fresh suite 61/61 passed, exit 0, 1.55s]
- [x] Independent Agent Improvement mode gate green and phase-014 readiness certificate emitted [EVIDENCE: runtime/tests/unit/agent-improvement-rollback-gate.vitest.ts:185-760; fresh suite 61/61 passed, exit 0, 1.55s]
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
