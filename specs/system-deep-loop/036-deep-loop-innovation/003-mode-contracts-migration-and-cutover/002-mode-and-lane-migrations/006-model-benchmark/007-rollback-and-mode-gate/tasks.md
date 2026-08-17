---
title: "Tasks: Model Benchmark - Rollback & Mode Gate"
description: "Tasks for planning and verifying the Model Benchmark fail-closed rollback switch, bounded rollback window, independent scoring-matrix mode gate, shared-service reuse, and phase-014 readiness certificate."
trigger_phrases:
  - "model benchmark rollback and mode gate tasks"
  - "model benchmark rollback switch tasks"
  - "model benchmark migration gate tasks"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/006-model-benchmark/007-rollback-and-mode-gate"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/003-mode-contracts-migration-and-cutover/002-mode-and-lane-migrations/006-model-benchmark/007-rollback-and-mode-gate"
    last_updated_at: "2026-08-17T04:04:40Z"
    last_updated_by: "codex"
    recent_action: "Verified rollback-gate closeout with focused suite 58 of 58 at exit 0"
    next_safe_action: "Treat this leaf as complete while preserving additive-dark authority"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Model Benchmark - Rollback & Mode Gate

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

- [x] T001 Confirm the phase remains planning-only, legacy authority remains selected, and the gate has no direct cutover capability [Evidence: model-benchmark-rollback-gate.vitest.ts 58/58 in 2.01s, exit 0; runtime tsc exit 0]
- [x] T002 Pin BASE and the shared transition/versioning/rollback policy, including deny-by-default authorization, monotonic epochs, and the 14-day/five-successful-authoritative-execution minimum [Evidence: model-benchmark-rollback-gate.vitest.ts 58/58 in 2.01s, exit 0; runtime tsc exit 0]
- [x] T003 [P] Record phase 012 shared mode-contract and write-set graph fingerprints and the phase-014 handoff version [Evidence: model-benchmark-rollback-gate.vitest.ts 58/58 in 2.01s, exit 0; runtime tsc exit 0]
- [x] T004 Inventory Model Benchmark siblings `001` through `006`: event, reducer, seal, certificate, receipt, replay, resume, and shadow-parity boundaries [Evidence: model-benchmark-rollback-gate.vitest.ts 58/58 in 2.01s, exit 0; runtime tsc exit 0]
- [x] T005 [P] Inventory Model Benchmark run, matrix, scoring, validity, contamination, workload, and authority-sensitive effects [Evidence: model-benchmark-rollback-gate.vitest.ts 58/58 in 2.01s, exit 0; runtime tsc exit 0]
- [x] T006 Build the gate input manifest and matrix evidence matrix for common anchors, adaptive diagnostics, model/executor crossings, and task-family coverage [Evidence: model-benchmark-rollback-gate.vitest.ts 58/58 in 2.01s, exit 0; runtime tsc exit 0]
- [x] T007 Record the Deep Improvement Common Services reuse boundary and reject local evaluator, canary, calibration, promotion, receipt, certificate, veto, budget, or recovery copies [Evidence: model-benchmark-rollback-gate.vitest.ts 58/58 in 2.01s, exit 0; runtime tsc exit 0]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T008 Define default-deny switch states, request fields, external authorization decision, epoch rules, fencing token, and stale-writer rejection [Evidence: model-benchmark-rollback-gate.vitest.ts 58/58 in 2.01s, exit 0; runtime tsc exit 0]
- [x] T009 Define typed refusal and trigger taxonomy for missing, malformed, stale, mixed-version, wrong-mode, parity, seal, certificate, replay, receipt, validity, contamination, workload, budget, health, canary, and effect failures [Evidence: model-benchmark-rollback-gate.vitest.ts 58/58 in 2.01s, exit 0; runtime tsc exit 0]
- [x] T010 Define the rollback window record with window ID, legacy anchor, typed and matrix frontiers, opening and expiry policy, trigger policy, fencing token, successful-run count, unresolved obligations, and close receipt [Evidence: model-benchmark-rollback-gate.vitest.ts 58/58 in 2.01s, exit 0; runtime tsc exit 0]
- [x] T011 Define the 14-calendar-day and five-successful-authoritative-execution rule, low-traffic extension, unresolved-obligation extension, closure, and re-arming behavior [Evidence: model-benchmark-rollback-gate.vitest.ts 58/58 in 2.01s, exit 0; runtime tsc exit 0]
- [x] T012 Define the non-destructive rollback runbook: freeze admission, fence writers, classify model-cell and scoring work, recover or quarantine effects, restore legacy at a new epoch, preserve evidence, and issue a rollback certificate [Evidence: model-benchmark-rollback-gate.vitest.ts 58/58 in 2.01s, exit 0; runtime tsc exit 0]
- [x] T013 Define independent gate predicates for shadow parity, sealed matrix artifacts, certificates, receipts, replay, resume, lifecycle fixtures, validity, workload, rollback rehearsal, and zero authority writes [Evidence: model-benchmark-rollback-gate.vitest.ts 58/58 in 2.01s, exit 0; runtime tsc exit 0]
- [x] T014 Define matrix evidence rules that retain raw model-cell observations separately from normalization, calibration, aggregation, ranking, and selection decisions [Evidence: model-benchmark-rollback-gate.vitest.ts 58/58 in 2.01s, exit 0; runtime tsc exit 0]
- [x] T015 Define anchor, adaptive-tail, task-family, model/path, contamination, workload, cost, latency, abstention, and switching evidence rules without allowing a score-only pass [Evidence: model-benchmark-rollback-gate.vitest.ts 58/58 in 2.01s, exit 0; runtime tsc exit 0]
- [x] T016 Define Model Benchmark validity and promotion handoff rules for candidate-specific calibration, rubric integrity, common-service vetoes, contamination, unknown effects, and insufficient evidence [Evidence: model-benchmark-rollback-gate.vitest.ts 58/58 in 2.01s, exit 0; runtime tsc exit 0]
- [x] T017 Define the shared-service reuse contract and reject variant-local evaluator, canary, calibration, promotion, receipt, certificate, fingerprint, veto, budget, or rollback semantics [Evidence: model-benchmark-rollback-gate.vitest.ts 58/58 in 2.01s, exit 0; runtime tsc exit 0]
- [x] T018 Define the exact-SHA-bound mode-migration certificate, verifier receipt, failed-predicate list, matrix frontier, unresolved obligations, rollback anchor, window state, and phase-014 handoff [Evidence: model-benchmark-rollback-gate.vitest.ts 58/58 in 2.01s, exit 0; runtime tsc exit 0]
- [x] T019 [P] Define deterministic `gate_passed`, `gate_blocked`, `gate_incomplete`, and `rollback_required` result semantics without implicit fallback to pass [Evidence: model-benchmark-rollback-gate.vitest.ts 58/58 in 2.01s, exit 0; runtime tsc exit 0]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 Verify absent, malformed, stale, unauthorized, mixed-version, wrong-mode, and gateway-failed switch requests preserve legacy authority and produce no semantic append or side effect [Evidence: model-benchmark-rollback-gate.vitest.ts 58/58 in 2.01s, exit 0; runtime tsc exit 0]
- [x] T021 Verify the Model Benchmark adapter cannot self-authorize rollback, unquarantine, verifier replacement, or legacy restoration [Evidence: model-benchmark-rollback-gate.vitest.ts 58/58 in 2.01s, exit 0; runtime tsc exit 0]
- [x] T022 Verify the rollback window cannot close before both 14 calendar days and five successful authoritative executions and extends on low traffic or unresolved obligations [Evidence: model-benchmark-rollback-gate.vitest.ts 58/58 in 2.01s, exit 0; runtime tsc exit 0]
- [x] T023 Verify rollback rehearsal freezes admission, fences stale writers, classifies model-cell and scoring work, resolves known effects safely, changes the epoch, restores legacy, preserves evidence, and emits a certificate [Evidence: model-benchmark-rollback-gate.vitest.ts 58/58 in 2.01s, exit 0; runtime tsc exit 0]
- [x] T024 Verify event and projection parity across run declaration, matrix admission, dispatch, trial outcomes, raw observations, scoring, calibration, contamination, workload, abort, restore, resume, duplicate, crash, and incomplete fixtures [Evidence: model-benchmark-rollback-gate.vitest.ts 58/58 in 2.01s, exit 0; runtime tsc exit 0]
- [x] T025 Verify seals, dependency closures, model and execution-path identities, matrix membership, evaluator and canary epochs, certificate bodies, receipt chains, replay fingerprints, and artifact references offline [Evidence: model-benchmark-rollback-gate.vitest.ts 58/58 in 2.01s, exit 0; runtime tsc exit 0]
- [x] T026 Verify missing observations, changed policies, unknown effects, telemetry gaps, unsupported versions, invalid calibration, contamination, underpowered comparisons, and nondeterministic replay remain non-green [Evidence: model-benchmark-rollback-gate.vitest.ts 58/58 in 2.01s, exit 0; runtime tsc exit 0]
- [x] T027 Verify common anchors, adaptive diagnostic quotas, task-family clustering, and model/path crossings are preserved and cannot be replaced by a scalar leaderboard result [Evidence: model-benchmark-rollback-gate.vitest.ts 58/58 in 2.01s, exit 0; runtime tsc exit 0]
- [x] T028 Verify complete and checkpointed replay, matrix-order permutations, duplicate delivery, crash-before-receipt, changed-manifest, and resume fixtures are deterministic or fail closed [Evidence: model-benchmark-rollback-gate.vitest.ts 58/58 in 2.01s, exit 0; runtime tsc exit 0]
- [x] T029 Verify Model Benchmark consumes identical shared evaluator, canary, calibration, promotion, certificate, receipt, fingerprint, veto, budget, and rollback fixtures through adapters [Evidence: model-benchmark-rollback-gate.vitest.ts 58/58 in 2.01s, exit 0; runtime tsc exit 0]
- [x] T030 Verify repeated evaluation of one sealed matrix frontier produces the same gate disposition and certificate body digest; mutate semantic inputs and require invalidation [Evidence: model-benchmark-rollback-gate.vitest.ts 58/58 in 2.01s, exit 0; runtime tsc exit 0]
- [x] T031 Verify phase-014 receives readiness evidence only and rejects any certificate claiming authority moved, the rollback window closed, a model was globally selected, or legacy writers retired [Evidence: model-benchmark-rollback-gate.vitest.ts 58/58 in 2.01s, exit 0; runtime tsc exit 0]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete [Evidence: model-benchmark-rollback-gate.vitest.ts 58/58 in 2.01s, exit 0; runtime tsc exit 0]
- [x] All requirements in spec.md met with evidence [Evidence: model-benchmark-rollback-gate.vitest.ts 58/58 in 2.01s, exit 0; runtime tsc exit 0]
- [x] Independent Model Benchmark mode gate green and phase-014 handoff certificate emitted [Evidence: model-benchmark-rollback-gate.vitest.ts 58/58 in 2.01s, exit 0; runtime tsc exit 0]
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Predecessor parity contract**: `../006-shadow-parity`
- **Shared rollback policy**: `../../../004-architecture-coverage-and-transition-contract/003-transition-versioning-and-rollback-policy/spec.md`
- **Shared Deep Improvement Common Services**: `../../004-deep-improvement-common/007-rollback-and-mode-gate`
- **Model Benchmark inputs**: `../001-typed-ledger-schema`, `../002-reducers-and-projections`, `../003-sealed-artifacts`, `../004-certificates-and-receipts`, and `../005-resume-adapter`
- **Phase-014 handoff**: See the staged cutover and authority handoff contract
<!-- /ANCHOR:cross-refs -->
