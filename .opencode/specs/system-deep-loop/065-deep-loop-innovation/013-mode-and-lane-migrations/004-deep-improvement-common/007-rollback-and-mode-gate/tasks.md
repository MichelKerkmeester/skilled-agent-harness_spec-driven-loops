---
title: "Tasks: Deep Improvement Common Services - Rollback & Mode Gate"
description: "Tasks for planning and verifying the shared Deep Improvement Common Services fail-closed rollback switch, bounded rollback window, independent mode gate, common-service reuse, and phase-011 readiness certificate."
trigger_phrases:
  - "deep improvement common rollback and mode gate tasks"
  - "shared evaluator rollback switch tasks"
  - "deep improvement migration gate tasks"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/007-rollback-and-mode-gate"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/007-rollback-and-mode-gate"
    last_updated_at: "2026-07-15T21:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined rollback switch and common-service gate evidence boundary"
    next_safe_action: "Freeze gate predicates and rollback window evidence against shared contracts"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Deep Improvement Common Services - Rollback & Mode Gate

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
- [ ] T003 [P] Record the phase-012 shared mode contract, write-set conflict graph, and phase-011 handoff fingerprints
- [ ] T004 Inventory common-service sibling outputs `001` through `006`: event, reducer, seal, certificate, receipt, replay, resume, and parity boundaries
- [ ] T005 [P] Inventory shared evaluator, canary, and promotion logic and classify common ownership, variant adapters, evidence, and legacy projections
- [ ] T006 Build the gate input manifest and the common-service reuse matrix for `005-agent-improvement`, `006-model-benchmark`, and `007-skill-benchmark`
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T007 Define the default-deny switch states, request fields, external authorization decision, epoch rules, fencing token, and stale-writer rejection
- [ ] T008 Define refusal and trigger taxonomy for missing, malformed, stale, mixed-version, wrong-mode, parity, seal, certificate, replay, receipt, health, budget, canary, and effect failures
- [ ] T009 Define the rollback window record with window ID, legacy anchor, typed frontier, opening and expiry policy, trigger policy, successful-run count, and close receipt
- [ ] T010 Define the 14-calendar-day and five-successful-authoritative-execution rule, low-traffic extension, unresolved-obligation extension, and re-arming behavior
- [ ] T011 Define the non-destructive rollback runbook: freeze admission, fence writers, classify in-flight operations, recover or quarantine effects, restore legacy at a new epoch, preserve evidence, and issue a certificate
- [ ] T012 Define the independent gate predicates for shadow parity, sealed artifacts, certificates, receipts, replay, resume, lifecycle fixtures, rollback rehearsal, and zero authority writes
- [ ] T013 Define evaluator evidence rules that retain raw observations separately from normalization, calibration, aggregation, and promotion decisions
- [ ] T014 Define canary and promotion gate rules for freshness, semantic leakage, evaluator integrity, hard vetoes, uncertainty, pause, abort, restore, and insufficient evidence
- [ ] T015 Define the common-service reuse contract and reject variant-local copies or weakened evaluator, canary, promotion, receipt, certificate, fingerprint, or rollback semantics
- [ ] T016 Define the exact-SHA-bound mode-migration certificate, verifier receipt, failed-predicate list, unresolved obligations, rollback anchor, window state, and phase-011 handoff
- [ ] T017 [P] Define deterministic `gate_passed`, `gate_blocked`, `gate_incomplete`, and `rollback_required` result semantics without implicit fallback to pass
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T018 Verify absent, malformed, stale, unauthorized, mixed-version, wrong-mode, and gateway-failed switch requests preserve legacy authority and produce no semantic append or side effect
- [ ] T019 Verify the shared services cannot self-authorize rollback, unquarantine, verifier replacement, or legacy restoration
- [ ] T020 Verify the rollback window cannot close before both 14 calendar days and five successful authoritative executions and extends on low traffic or unresolved obligations
- [ ] T021 Verify rollback rehearsal freezes admission, fences stale writers, classifies in-flight work, resolves known effects safely, changes the epoch, restores legacy, preserves evidence, and emits a certificate
- [ ] T022 Verify event and projection parity across candidate generation, raw evaluation, scoring, canary, promotion, abort, restore, resume, duplicate, crash, and incomplete fixtures
- [ ] T023 Verify seals, dependency closures, evaluator epochs, canary freshness, certificate bodies, receipt chains, replay fingerprints, and artifact references offline
- [ ] T024 Verify missing observations, changed policies, unknown effects, telemetry gaps, unsupported versions, and nondeterministic replay remain non-green
- [ ] T025 Verify all three downstream variant adapters consume identical common-service decisions and cannot pass with private service or gate semantics
- [ ] T026 Verify repeated evaluation of one sealed frontier produces the same gate result and certificate body digest; mutate semantic inputs and require rejection
- [ ] T027 Verify phase 011 receives readiness evidence only and rejects any certificate claiming authority moved, the window closed, or legacy writers retired
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with evidence
- [ ] Independent common-service mode gate green and phase-011 handoff certificate emitted
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Predecessor parity contract**: `../006-shadow-parity`
- **Shared rollback policy**: `../../../../../004-architecture-coverage-and-transition-contract/003-transition-versioning-and-rollback-policy/spec.md`
- **Downstream consumers**: `../005-agent-improvement`, `../006-model-benchmark`, and `../007-skill-benchmark`
- **Phase-011 handoff**: See the staged cutover and authority handoff contract
<!-- /ANCHOR:cross-refs -->
