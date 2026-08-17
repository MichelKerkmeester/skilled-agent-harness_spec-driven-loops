---
title: "Tasks: Deep Improvement Common Services - Rollback & Mode Gate"
description: "Completed tasks for the shared Deep Improvement Common Services rollback switch, bounded rollback window, independent gate, and phase-014 readiness certificate."
trigger_phrases:
  - "deep improvement common rollback and mode gate tasks"
  - "shared evaluator rollback switch tasks"
  - "deep improvement migration gate tasks"
importance_tier: "critical"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/004-deep-improvement-common/007-rollback-and-mode-gate"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/003-mode-contracts-migration-and-cutover/002-mode-and-lane-migrations/004-deep-improvement-common/007-rollback-and-mode-gate"
    last_updated_at: "2026-08-17T04:04:40Z"
    last_updated_by: "opencode"
    recent_action: "Verified the shared rollback gate"
    next_safe_action: "Reuse the shared contract in extension lanes"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-improvement-common-rollback-gate/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/deep-improvement-common-rollback-gate.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "All implementation and verification tasks are complete."
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

- [x] T001 Confirm legacy authority remains unchanged and the gate has no direct cutover capability [evidence: `implementation-summary.md`; additive-dark certificate assertions; focused Vitest 36/36]
- [x] T002 [P] Pin BASE and the shared transition/versioning/rollback policy, including the 14-day and five-successful-authoritative-execution minimum [evidence: `implementation-summary.md`; mode certificate and window tests]
- [x] T003 [P] Record the phase-012 shared mode contract, write-set graph, and phase-014 handoff fingerprints [evidence: `implementation-summary.md`; exact certificate bindings]
- [x] T004 Inventory common-service sibling outputs `001` through `006` [evidence: `implementation-summary.md`; direct runtime imports and whole-runtime tsc]
- [x] T005 [P] Inventory shared evaluator, canary, and promotion ownership [evidence: `implementation-summary.md`; six-kind artifact closure and common certificate fields]
- [x] T006 Build the gate input manifest and common-service reuse matrix [evidence: `implementation-summary.md`; public exports]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T007 Define default-deny switch and fencing behavior [evidence: `implementation-summary.md`; `DeepImprovementCommonRollbackSwitch`; focused Vitest 36/36]
- [x] T008 Define the typed refusal taxonomy [evidence: `implementation-summary.md`; closed denial and gate reason unions]
- [x] T009 Define the rollback-window record [evidence: `implementation-summary.md`; `DeepImprovementCommonRollbackWindowInput` and evaluation]
- [x] T010 Define both minimums and extension rules [evidence: `implementation-summary.md`; window threshold, dedup, and extension tests]
- [x] T011 Define non-destructive rollback evidence [evidence: `implementation-summary.md`; rollback certificate keeps deletion and mutation fields false]
- [x] T012 Define independent gate predicates [evidence: `implementation-summary.md`; five ordered dispositions over real substrates]
- [x] T013 Preserve raw evaluator evidence separately from normalized scores [evidence: `implementation-summary.md`; required raw-trial artifact and verified certificate closure]
- [x] T014 Define canary and promotion gate rules [evidence: `implementation-summary.md`; fresh canary and promotion readers plus certificate identity checks]
- [x] T015 Define the common-service reuse contract [evidence: `implementation-summary.md`; stable public index exports]
- [x] T016 Define the exact-SHA readiness certificate [evidence: `implementation-summary.md`; complete certificate core and digest]
- [x] T017 [P] Define deterministic non-green and ready result semantics [evidence: `implementation-summary.md`; typed disposition fold and adversarial tests]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T018 Verify fail-closed switch requests preserve legacy authority [evidence: `implementation-summary.md`; malformed, unknown-field, destructive, anchor, resource, and authorization tests]
- [x] T019 Verify recovery requires external authorization [evidence: `implementation-summary.md`; real gateway policy and bound authorization request]
- [x] T020 Verify rollback-window minimums and extensions [evidence: `implementation-summary.md`; distinct-identity and below-threshold tests]
- [x] T021 Verify fenced non-destructive rollback evidence [evidence: `implementation-summary.md`; real coordinator token and high-water tests]
- [x] T022 Verify complete common lifecycle evidence [evidence: `implementation-summary.md`; thirteen distinct authenticated lifecycle identities]
- [x] T023 Verify seals, certificates, receipts, and replay offline [evidence: `implementation-summary.md`; real readers, offline verifier, and six-kind replacement tests]
- [x] T024 Verify uncertainty remains non-green [evidence: `implementation-summary.md`; typed fail-closed dispositions and null certificates]
- [x] T025 Freeze one shared contract for all three adapters [evidence: `implementation-summary.md`; common public exports with no variant-local policy]
- [x] T026 Verify deterministic certificate reproduction and semantic invalidation [evidence: `implementation-summary.md`; reverified certificate and tamper tests]
- [x] T027 Verify phase-014 readiness only [evidence: `implementation-summary.md`; false mutation, window-closed, and cutover fields]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete
- [x] All requirements in spec.md met with evidence
- [x] Independent common-service mode gate green and phase-014 handoff certificate emitted
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Predecessor parity contract**: `../006-shadow-parity`
- **Shared rollback policy**: `../../../004-architecture-coverage-and-transition-contract/003-transition-versioning-and-rollback-policy/spec.md`
- **Downstream consumers**: `../../005-agent-improvement`, `../../006-model-benchmark`, and `../../007-skill-benchmark`
- **Phase-014 handoff**: See the staged cutover and authority handoff contract
<!-- /ANCHOR:cross-refs -->
