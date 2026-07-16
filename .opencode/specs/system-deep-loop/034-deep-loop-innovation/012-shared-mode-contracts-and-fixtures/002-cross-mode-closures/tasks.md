---
title: "Tasks: Cross-Mode Closures"
description: "Tasks for phase 005 of the 009 shared-mode-contracts-and-fixtures parent: define, implement, adapt, and verify reusable cross-mode closures before phase 013."
trigger_phrases:
  - "cross-mode closures tasks"
  - "deep-loop shared closure tasks"
  - "phase 012 closure fixtures"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/034-deep-loop-innovation/012-shared-mode-contracts-and-fixtures/002-cross-mode-closures"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-deep-loop-innovation/012-shared-mode-contracts-and-fixtures/002-cross-mode-closures"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Enumerated closure inventory, adapters, safety seams, and parity tasks"
    next_safe_action: "Build the recurrence matrix from the manifest and shipped runtime paths"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Cross-Mode Closures

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

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

- [ ] T001 Read the phase parent, `manifest/phase-tree.json`, `001-shared-mode-interfaces/spec.md`, and the phase-007 parent and child service contracts; record the shared invariants and `depends_on: []` posture
- [ ] T002 [P] Derive the eight phase-013 adapter rows directly from `mode_workstreams_phase_010`, including `004-deep-improvement-common` before its three variants
- [ ] T003 [P] Inventory repeated evidence, receipt/effect, adjudication, budget, and projection paths across the mode packets, shipped runtime, council helpers, shared synthesis, and deep-improvement library
- [ ] T004 Build the recurrence matrix with one shared owner, service port, inputs, outputs, write set, failure result, parity source, and allowed mode override for every repeated behavior
- [ ] T005 Record the boundary with `001-shared-mode-interfaces`, `003-mixed-version-fixtures`, and `004-write-set-conflict-graph`; preserve intentional parser and convergence-policy divergence
- [ ] T006 [P] Map legacy runtime helpers such as `evidence-contract.ts`, `executor-audit.ts`, `post-dispatch-validate.ts`, `adjudicator-verdict-scoring.cjs`, `convergence.cjs`, and `cost-guards.cjs` to closure inputs rather than copying them
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T007 Define the immutable closure context, typed strategy interfaces, common result envelope, provenance fields, and explicit unsupported/failure outcomes
- [ ] T008 Define the evidence closure for normalization, sealed-reference verification, raw evidence retention, scope, claim class, source locators, and replay inputs
- [ ] T009 Define the receipt/effect closure for intent-before-effect, observed completion, boundary receipts, idempotency, recovery classification, and legacy evidence adaptation
- [ ] T010 Define the adjudication closure for blinded requests, mirrored order, counterfactual probes, raw judgment retention, effective independence, and stable/unstable/inconclusive results
- [ ] T011 Define the budget closure for typed admission, atomic reservation, receipt-backed settlement, exhaustion taxonomy, and current council/fan-out guard adaptation
- [ ] T012 Define the projection closure for authorized event application, deterministic stream-fold gauges, replay provenance, transactional updates, continuity identities, and fencing
- [ ] T013 Define the shared-versus-mode-specific override matrix and reject any override that bypasses authorization, sealing, receipt ordering, budget admission, raw evidence, or fencing
- [ ] T014 [P] Add adapters for `001-deep-research`, `002-deep-review`, `003-deep-ai-council`, and `004-deep-improvement-common`
- [ ] T015 [P] Add thin variant adapters for `005-agent-improvement`, `006-model-benchmark`, `007-skill-benchmark`, and `008-deep-alignment`
- [ ] T016 Ensure deep-improvement common evaluator/promotion behavior is implemented once, review/alignment shared loop behavior is reused where declared, and intentional parser dialects remain separate
- [ ] T017 Add closure call-path guards, parity hooks, fixture identifiers, and successor handoff inputs without authoring the mixed-version corpus or conflict graph
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T018 Verify: The closure catalog covers every repeated behavior — one owner and one adapter row exist for five closure families and all eight manifest workstreams
- [ ] T019 Verify: Evidence handling is one typed closure — equivalent inputs preserve raw evidence, sealed references, provenance, and deterministic validation outcomes
- [ ] T020 Verify: Receipt emission is one ordered closure — crash, retry, duplicate, recovery, and ambiguous-effect fixtures preserve intent-before-effect and one receipt
- [ ] T021 Verify: Adjudication calls use one bias-controlled closure — blinding, mirrored order, probes, raw scores, independence evidence, and verdict classes are preserved
- [ ] T022 Verify: Budget checks use one typed admission closure — all dimensions reserve atomically, settlement is receipt-backed, and uncertainty or exhaustion denies work
- [ ] T023 Verify: Projection updates use one deterministic closure — full and incremental replay, fencing, mode reducer fields, and provenance agree byte-for-byte
- [ ] T024 Verify: Mode overrides preserve ownership — bypass attempts fail closed and valid strategy inputs cannot change shared safety invariants
- [ ] T025 Verify: All eight phase-013 workstreams reuse the closures — common-before-variant ordering holds and no private duplicate implementation remains
- [ ] T026 Verify: Additive-dark parity is preserved — shipped council/deep-loop outputs and legacy projections remain authoritative and differences are observable
- [ ] T027 Verify: The phase-013 handoff is complete — catalog, override matrix, call-path inventory, fixture names, and write-set inputs are deterministic and documented
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with evidence
- [ ] Phase gate green (validate/build/test as applicable)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent outcome**: See `../spec.md` and `../manifest/phase-tree.json`
- **Interface contract**: See `../001-shared-mode-interfaces/spec.md`
- **Phase-007 service contracts**: See `../../007-shared-evidence-and-control-services/spec.md` and its child service specs
- **Successor fixture handoff**: See `../003-mixed-version-fixtures/spec.md`
<!-- /ANCHOR:cross-refs -->
