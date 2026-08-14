---
title: "Tasks: Deep AI Council resume adapter"
description: "Tasks for the Deep AI Council resume adapter: sealed-ledger reduction, continuity-ladder projection, crash recovery, and idempotent re-entry."
trigger_phrases:
  - "Deep AI Council resume adapter tasks"
  - "council reducer replay tasks"
  - "idempotent council recovery tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/003-deep-ai-council/005-resume-adapter"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/003-deep-ai-council/005-resume-adapter"
    last_updated_at: "2026-07-27T22:02:42Z"
    last_updated_by: "codex"
    recent_action: "Completed the council resume adapter and proofs"
    next_safe_action: "Shadow parity consumes the adapter contract"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-resume-adapter/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/deep-ai-council-resume-adapter.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Deep AI Council Resume Adapter

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

- [x] T001 Confirm the shared ledger, seal, replay-compatibility, effect-recovery, and certificate contracts are frozen for this mode adapter. [evidence: implementation-summary.md records the scoped contract; real-substrate Vitest passed 6/6 and whole-runtime TypeScript passed with zero adapter-path diagnostics]
- [x] T002 Record the Deep AI Council event inventory and map deliberation, critique, convergence, artifact, and gate events to reducer ownership. [evidence: implementation-summary.md records the scoped contract; real-substrate Vitest passed 6/6 and whole-runtime TypeScript passed with zero adapter-path diagnostics]
- [x] T003 Define stable identity fields for run, logical branch, attempt, claim, message, effect, artifact, gate decision, and resume request. [evidence: implementation-summary.md records the scoped contract; real-substrate Vitest passed 6/6 and whole-runtime TypeScript passed with zero adapter-path diagnostics]
- [x] T004 Define the stage transition and recovery-disposition table, including `REUSE`, `CONTINUE`, `RECONCILE`, `WAIT`, `MIGRATE`, `PIN_OLD_RUNTIME`, and `BLOCK`. [evidence: implementation-summary.md records the scoped contract; real-substrate Vitest passed 6/6 and whole-runtime TypeScript passed with zero adapter-path diagnostics]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Implement the sealed-frontier verification contract and fail closed on an unsealed, truncated, tampered, or incompatible ledger. [evidence: implementation-summary.md records the scoped contract; real-substrate Vitest passed 6/6 and whole-runtime TypeScript passed with zero adapter-path diagnostics]
- [x] T006 Implement the run-control and logical-seat reducers; preserve completed branch results and identify only missing logical work after interruption. [evidence: implementation-summary.md records the scoped contract; real-substrate Vitest passed 6/6 and whole-runtime TypeScript passed with zero adapter-path diagnostics]
- [x] T007 Implement claim, message, dissent, critique-round, and private-estimate reducers with stable IDs and preserved information boundaries. [evidence: implementation-summary.md records the scoped contract; real-substrate Vitest passed 6/6 and whole-runtime TypeScript passed with zero adapter-path diagnostics]
- [x] T008 Implement blinded judge-observation and convergence reducers with frozen judge/configuration fingerprints and explicit unresolved minority state. [evidence: implementation-summary.md records the scoped contract; real-substrate Vitest passed 6/6 and whole-runtime TypeScript passed with zero adapter-path diagnostics]
- [x] T009 Implement artifact-seal and council-test-gate reducers from immutable artifacts, certificates, and receipts without creating new live evidence. [evidence: implementation-summary.md records the scoped contract; real-substrate Vitest passed 6/6 and whole-runtime TypeScript passed with zero adapter-path diagnostics]
- [x] T010 Implement effect-aware recovery planning for verified reuse, receipt lookup, compensation, unknown outcomes, and unsupported provider capabilities. [evidence: implementation-summary.md records the scoped contract; real-substrate Vitest passed 6/6 and whole-runtime TypeScript passed with zero adapter-path diagnostics]
- [x] T011 Implement the idempotent resume-request contract keyed by run lineage, sealed frontier, adapter fingerprint, and requested boundary. [evidence: implementation-summary.md records the scoped contract; real-substrate Vitest passed 6/6 and whole-runtime TypeScript passed with zero adapter-path diagnostics]
- [x] T012 Implement the continuity-ladder projection with reducer-derived packet pointer, recent action, next safe action, blockers, progress, open questions, and answered questions. [evidence: implementation-summary.md records the scoped contract; real-substrate Vitest passed 6/6 and whole-runtime TypeScript passed with zero adapter-path diagnostics]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Verify: Resume truth comes only from a sealed ledger frontier — valid histories replay to a state fingerprint, while an unsealed or tampered tail blocks. [evidence: implementation-summary.md records the scoped contract; real-substrate Vitest passed 6/6 and whole-runtime TypeScript passed with zero adapter-path diagnostics]
- [x] T014 Verify: The mode reducer reconstructs every council stage — partial seats, critique rounds, convergence, artifacts, and gate state produce the correct pending work. [evidence: implementation-summary.md records the scoped contract; real-substrate Vitest passed 6/6 and whole-runtime TypeScript passed with zero adapter-path diagnostics]
- [x] T015 Verify: Logical identity survives attempts and process restarts — duplicate delivery and retry fixtures preserve branch, claim, message, and effect identity. [evidence: implementation-summary.md records the scoped contract; real-substrate Vitest passed 6/6 and whole-runtime TypeScript passed with zero adapter-path diagnostics]
- [x] T016 Verify: Re-entry is idempotent — repeated matching resume requests return one decision and produce no duplicate semantic ledger event or side effect. [evidence: implementation-summary.md records the scoped contract; real-substrate Vitest passed 6/6 and whole-runtime TypeScript passed with zero adapter-path diagnostics]
- [x] T017 Verify: Recovery distinguishes safe reuse from unsafe repetition — completed receipts reuse, unknown irreversible effects reconcile or block, and no blind retry occurs. [evidence: implementation-summary.md records the scoped contract; real-substrate Vitest passed 6/6 and whole-runtime TypeScript passed with zero adapter-path diagnostics]
- [x] T018 Verify: Continuity-ladder fields are derived projections — every field points to reducer state and cannot override the sealed ledger. [evidence: implementation-summary.md records the scoped contract; real-substrate Vitest passed 6/6 and whole-runtime TypeScript passed with zero adapter-path diagnostics]
- [x] T019 Verify: Replay compatibility is explicit and version-bound — exact, compatible, migrate, pin-old-runtime, and blocked outcomes are deterministic. [evidence: implementation-summary.md records the scoped contract; real-substrate Vitest passed 6/6 and whole-runtime TypeScript passed with zero adapter-path diagnostics]
- [x] T020 Verify: Resume preserves council information boundaries — blinding, dissent, minority claims, private estimates, and order-swapped observations survive reduction. [evidence: implementation-summary.md records the scoped contract; real-substrate Vitest passed 6/6 and whole-runtime TypeScript passed with zero adapter-path diagnostics]
- [x] T021 Verify: The council gate is deterministic after interruption — immutable inputs produce the same gate decision and missing receipts produce typed non-success states. [evidence: implementation-summary.md records the scoped contract; real-substrate Vitest passed 6/6 and whole-runtime TypeScript passed with zero adapter-path diagnostics]
- [x] T022 Verify: The adapter remains non-authoritative — shadow-parity integration can consume its output without an authority cutover or legacy-writer retirement. [evidence: implementation-summary.md records the scoped contract; real-substrate Vitest passed 6/6 and whole-runtime TypeScript passed with zero adapter-path diagnostics]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete [evidence: implementation-summary.md records the scoped contract; real-substrate Vitest passed 6/6 and whole-runtime TypeScript passed with zero adapter-path diagnostics]
- [x] All requirements in spec.md met with evidence [evidence: implementation-summary.md records the scoped contract; real-substrate Vitest passed 6/6 and whole-runtime TypeScript passed with zero adapter-path diagnostics]
- [x] Phase gate green (validate/build/test as applicable) [evidence: implementation-summary.md records the scoped contract; real-substrate Vitest passed 6/6 and whole-runtime TypeScript passed with zero adapter-path diagnostics]
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
