---
title: "Tasks: Cross-Mode Closures"
description: "Tasks for the 002-cross-mode-closures child of the 012 shared-mode-contracts-and-fixtures parent: define, implement, adapt, and verify reusable cross-mode closures before phase 013."
trigger_phrases:
  - "cross-mode closures tasks"
  - "deep-loop shared closure tasks"
  - "phase 012 closure fixtures"
importance_tier: "critical"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/012-shared-mode-contracts-and-fixtures/002-cross-mode-closures"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-shared-mode-contracts-and-fixtures/002-cross-mode-closures"
    last_updated_at: "2026-07-21T14:11:23Z"
    last_updated_by: "codex"
    recent_action: "Completed the closure implementation and conformance suite"
    next_safe_action: "Use the closure catalog as the phase-013 migration entrypoint"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/cross-mode-closures/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/cross-mode-closures.vitest.ts"
    completion_pct: 100
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

- [x] T001 Read the parent, manifest, frozen interface, and service contracts; record shared invariants and `depends_on: []`. [evidence: `spec.md`]
- [x] T002 [P] Derive the eight adapter rows from the manifest, including common before its variants. [evidence: `.opencode/skills/system-deep-loop/runtime/lib/cross-mode-closures/catalog.ts`]
- [x] T003 [P] Inventory recurring mode and shipped-helper paths for the five responsibilities. [evidence: `.opencode/skills/system-deep-loop/runtime/lib/cross-mode-closures/parity.ts`]
- [x] T004 Build the one-owner matrix with service ports, writes, failures, parity, and overrides. [evidence: `.opencode/skills/system-deep-loop/runtime/lib/cross-mode-closures/catalog.ts`]
- [x] T005 Preserve the frozen interface and successor boundaries plus intentional divergence. [evidence: `plan.md`]
- [x] T006 [P] Map shipped helpers to parity or adapter inputs without copying them. [evidence: `.opencode/skills/system-deep-loop/runtime/lib/cross-mode-closures/parity.ts`]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T007 Define the immutable ModeContract-backed context and typed override/result contracts. [evidence: `.opencode/skills/system-deep-loop/runtime/lib/cross-mode-closures/context.ts`]
- [x] T008 Define sealed evidence normalization with raw payload retention and provenance. [evidence: `.opencode/skills/system-deep-loop/runtime/lib/cross-mode-closures/evidence.ts`]
- [x] T009 Define authorized receipt/effect sequencing through the recovery and boundary ports. [evidence: `.opencode/skills/system-deep-loop/runtime/lib/cross-mode-closures/receipts-effects.ts`]
- [x] T010 Define service-owned blinded adjudication with unreduced raw evidence. [evidence: `.opencode/skills/system-deep-loop/runtime/lib/cross-mode-closures/adjudication.ts`]
- [x] T011 Define typed budget admission, attempt charging, settlement, and denial. [evidence: `.opencode/skills/system-deep-loop/runtime/lib/cross-mode-closures/budgets.ts`]
- [x] T012 Define authorized gauge folding and fenced projection replacement. [evidence: `.opencode/skills/system-deep-loop/runtime/lib/cross-mode-closures/projections.ts`]
- [x] T013 Define data/policy overrides and reject safety bypass fields. [evidence: `.opencode/skills/system-deep-loop/runtime/lib/cross-mode-closures/internal.ts`]
- [x] T014 [P] Add catalog rows for research, review, council, and improvement common. [evidence: `.opencode/skills/system-deep-loop/runtime/lib/cross-mode-closures/catalog.ts`]
- [x] T015 [P] Add thin catalog rows for the three variants and alignment. [evidence: `.opencode/skills/system-deep-loop/runtime/lib/cross-mode-closures/catalog.ts`]
- [x] T016 Run deep-improvement common mechanics once before variant policies. [evidence: `.opencode/skills/system-deep-loop/runtime/lib/cross-mode-closures/deep-improvement-common.ts`]
- [x] T017 Add call guards, parity observation, fixtures, and handoff exports. [evidence: `.opencode/skills/system-deep-loop/runtime/lib/cross-mode-closures/index.ts`]
- [x] T028 Close projection and deep-improvement override outputs against declared exact keys and recursively reject reserved safety fields. [evidence: `.opencode/skills/system-deep-loop/runtime/lib/cross-mode-closures/internal.ts`, `projections.ts`, and `deep-improvement-common.ts`]
- [x] T029 Bind service ports privately so a public context holder cannot invoke raw phase-006/007 methods. [evidence: `.opencode/skills/system-deep-loop/runtime/lib/cross-mode-closures/context.ts`, `internal.ts`, and `types.ts`]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T018 Verify one owner for five families across eight modes. [evidence: Vitest manifest-complete one-owner fixture passed]
- [x] T019 Verify raw evidence, sealed references, provenance, and validation. [evidence: Vitest evidence-preservation fixture passed]
- [x] T020 Verify authorization precedes effect/recovery and boundary receipts. [evidence: Vitest receipt-ordering fixture passed]
- [x] T021 Verify adjudication evidence passes through without local reduction. [evidence: Vitest adjudication fixtures passed]
- [x] T022 Verify uncertain and exhausted budgets deny work. [evidence: Vitest budget-denial fixture passed]
- [x] T023 Verify replay-stable projection and gauge output under fencing. [evidence: Vitest deterministic-replay fixture passed]
- [x] T024 Verify bypass and local re-reduction attempts fail closed. [evidence: Vitest bypass fixtures passed]
- [x] T025 Verify common-before-variant order and shared implementation identity. [evidence: Vitest common-reuse fixture passed]
- [x] T026 Verify closure failure preserves the exact legacy result. [evidence: Vitest additive-dark parity fixture passed]
- [x] T027 Verify exported catalog, overrides, parity sources, fixtures, and writes. [evidence: `implementation-summary.md`]
- [x] T030 Verify both previously uncovered override sites reject nested and top-level smuggling while honest overrides still apply, and verify raw services are absent from the returned context. [evidence: targeted Vitest suite passed 15 tests]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete
- [x] All requirements in spec.md met with evidence
- [x] Phase gate green (validate/build/test as applicable)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent outcome**: See `../spec.md` and `../../manifest/phase-tree.json`
- **Interface contract**: See `../001-shared-mode-interfaces/spec.md`
- **Phase-007 service contracts**: See `../../007-shared-evidence-and-control-services/spec.md` and its child service specs
- **Successor fixture handoff**: See `../003-mixed-version-fixtures/spec.md`
<!-- /ANCHOR:cross-refs -->
