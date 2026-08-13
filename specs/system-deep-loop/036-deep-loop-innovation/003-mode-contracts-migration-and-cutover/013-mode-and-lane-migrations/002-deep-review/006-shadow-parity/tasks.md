---
title: "Tasks: Deep Review shadow parity"
description: "Tasks for the Deep Review shadow-parity phase: freeze shared contracts, map the legacy lifecycle, compare typed events and projections, and produce a fail-closed parity certificate."
trigger_phrases:
  - "Deep Review shadow parity tasks"
  - "deep-review event parity tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/002-deep-review/006-shadow-parity"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/002-deep-review/006-shadow-parity"
    last_updated_at: "2026-07-28T05:08:36Z"
    last_updated_by: "codex"
    recent_action: "Verified shadow parity gates"
    next_safe_action: "Consume parity evidence in the mode gate"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-review-shadow-parity/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/deep-review-shadow-parity.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Deep Review Shadow Parity

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

- [x] T001 Record the phase-012 shared review-loop contract, phase-014 shadow framework, event envelope, replay fingerprint, and projection fingerprints [Evidence: `.opencode/skills/system-deep-loop/runtime/lib/deep-review-shadow-parity/harness-adapter.ts`]
- [x] T002 Inventory the legacy Deep Review scope, dimension-pass, finding, convergence, and review-report emission boundaries against the pinned baseline [Evidence: `.opencode/skills/system-deep-loop/runtime/tests/unit/deep-review-shadow-parity.vitest.ts`]
- [x] T003 Define the paired-run envelope, shadow storage boundary, fixture IDs, authority assertion, and certificate input fields [Evidence: `.opencode/skills/system-deep-loop/runtime/lib/deep-review-shadow-parity/types.ts`]
- [x] T004 Define the allowlisted normalization fields and the raw-evidence retention rule; no identity or decision field may be normalized away [Evidence: `.opencode/skills/system-deep-loop/runtime/lib/deep-review-shadow-parity/harness-adapter.ts`]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Implement the Deep Review mode adapter over the shared review-loop contract without creating a mode-local lifecycle [Evidence: `.opencode/skills/system-deep-loop/runtime/lib/deep-review-shadow-parity/harness-adapter.ts`]
- [x] T006 Map scope, dimension passes, candidate findings, validation, P0/P1/P2 impact, orthogonal evidence attributes, convergence, and report projection to typed events [Evidence: `.opencode/skills/system-deep-loop/runtime/lib/deep-review-shadow-parity/harness-adapter.ts`]
- [x] T007 Implement versioned finding fingerprints and introduced/fixed/pre-existing lineage across moved, renamed, updated, and duplicate findings [Evidence: `.opencode/skills/system-deep-loop/runtime/tests/unit/deep-review-shadow-parity.vitest.ts`]
- [x] T008 Implement paired legacy observation and typed-ledger shadow execution from one frozen input envelope [Evidence: `.opencode/skills/system-deep-loop/runtime/lib/deep-review-shadow-parity/harness-adapter.ts`]
- [x] T009 Implement event-stream comparison for type, causal order, lineage, identity, payload, references, and multiplicity [Evidence: `.opencode/skills/system-deep-loop/runtime/lib/deep-review-shadow-parity/harness-adapter.ts`]
- [x] T010 Implement projection comparison for findings, dispositions, convergence, report ordering, receipts, checkpoints, and replay fingerprints [Evidence: `.opencode/skills/system-deep-loop/runtime/lib/deep-review-shadow-parity/harness-adapter.ts`]
- [x] T011 Implement discrepancy classification, raw evidence capture, and `PARITY_BLOCKED` handling for every mismatch class [Test: focused Vitest suite, 8/8 passed]
- [x] T012 Add replay, checkpoint-resume, invalid-transition, duplicate, stale-receipt, and phase-014 fault-injection fixtures [Test: focused Vitest suite, 8/8 passed]
- [x] T013 Produce the content-addressed parity certificate only when event, projection, replay/resume, and safety verdicts are green [Test: focused Vitest suite, 8/8 passed]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Verify: Paired execution uses one frozen input and contract envelope — source, scope, dimensions, budget, and fingerprints are equal before dispatch [Test: focused Vitest suite, 8/8 passed]
- [x] T015 Verify: Deep Review transitions use the shared review-loop contract — no Deep Review-specific loop fork exists [Evidence: `.opencode/skills/system-deep-loop/runtime/lib/deep-review-shadow-parity/harness-adapter.ts`]
- [x] T016 Verify: The full Deep Review lifecycle is represented — scope through review-report events retain lineage and causal order [Test: focused Vitest suite, 8/8 passed]
- [x] T017 Verify: Finding identity survives cross-pass and cross-revision comparison — semantic fingerprints preserve moved, fixed, and pre-existing lineage [Test: focused Vitest suite, 8/8 passed]
- [x] T018 Verify: Severity and evidence remain orthogonal — P0/P1/P2 impact is separate from confidence and validation evidence [Evidence: `.opencode/skills/system-deep-loop/runtime/lib/deep-review-shadow-parity/types.ts`]
- [x] T019 Verify: Shadow output matches legacy output event-for-event — zero unexplained missing, extra, reordered, duplicate, or divergent events [Test: focused Vitest suite, 8/8 passed]
- [x] T020 Verify: Materialized projections match — finding state, convergence, report order, receipts, checkpoints, and replay fingerprints are equal [Test: focused Vitest suite, 8/8 passed]
- [x] T021 Verify: Replay and resume preserve parity — each supported checkpoint reproduces the original normalized stream and projection [Test: focused Vitest suite, 8/8 passed]
- [x] T022 Verify: Shadow failures are observable and non-authoritative — mismatches are retained and shadow cannot publish or authorize [Test: focused Vitest suite, 8/8 passed]
- [x] T023 Verify: Parity is a hard pre-cutover condition — incomplete coverage or open P0/P1 discrepancies refuse certificate issuance [Test: focused Vitest suite, 8/8 passed]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete [File: tasks.md]
- [x] All requirements in spec.md met with evidence [File: implementation-summary.md]
- [x] Phase gate green with zero unexplained parity differences and a reproducible certificate [Test: focused Vitest suite, 8/8 passed]
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Next phase**: `007-rollback-and-mode-gate` consumes the parity certificate; it does not receive authority from this phase
<!-- /ANCHOR:cross-refs -->
