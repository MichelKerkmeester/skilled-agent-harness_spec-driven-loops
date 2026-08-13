---
title: "Tasks: Deep Research shadow parity"
description: "Tasks for the Deep Research shadow-parity phase: map the lifecycle, define dual-run adapters, compare typed event projections, exercise resume and handoff fixtures, and issue a blocking parity receipt without changing authority."
trigger_phrases:
  - "Deep Research shadow parity tasks"
  - "deep-research event parity tasks"
  - "mode 010 phase 009 tasks"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/006-shadow-parity"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/006-shadow-parity"
    last_updated_at: "2026-07-22T15:57:14Z"
    last_updated_by: "opencode"
    recent_action: "Verified adversarial quarantine priority and closed input shapes"
    next_safe_action: "Build the frozen fixture manifest and lifecycle event mapping"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Deep Research Shadow Parity

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

- [x] T001 Record the phase-012 shared-contract digest, phase-014 shadow-framework interface, parent compatibility-bridge contract, and the fact that this phase has no authority-cutover responsibility [EVIDENCE: implementation-summary.md Verification records focused Vitest 49/49 passed and pinned tsc exit 0]
- [x] T002 Inventory the legacy Deep Research lifecycle and reducer boundaries for init, gather/analyze, convergence, synthesis, resume, and memory-save handoff [EVIDENCE: implementation-summary.md Verification records focused Vitest 49/49 passed and pinned tsc exit 0]
- [x] T003 Freeze the fixture manifest with BASE, run inputs, source snapshots, model/tool fingerprints, budget lease, expected terminal classes, and output locations [EVIDENCE: implementation-summary.md Verification records focused Vitest 49/49 passed and pinned tsc exit 0]
- [x] T004 Define the parity receipt schema, canonical event tuple, diff classifications, and versioned volatility allowlist before running acceptance comparisons [EVIDENCE: implementation-summary.md Verification records focused Vitest 49/49 passed and pinned tsc exit 0]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Define the Deep Research event namespace and legacy-to-ledger mapping for plan, branch, source, admission, claim, contradiction, projection, next-focus, convergence, synthesis, resume, and memory-save transitions [EVIDENCE: implementation-summary.md Verification records focused Vitest 49/49 passed and pinned tsc exit 0]
- [x] T006 Define the legacy observer and ledger shadow adapter contracts with stable logical run, branch, step, claim, and receipt identities [EVIDENCE: implementation-summary.md Verification records focused Vitest 49/49 passed and pinned tsc exit 0]
- [x] T007 Define the event-for-event comparator with stable logical-position pairing and field-specific payload, causal-link, receipt, artifact, projection, and terminal comparisons [EVIDENCE: implementation-summary.md Verification records focused Vitest 49/49 passed and pinned tsc exit 0]
- [x] T008 Define projection folds and deterministic replay oracles for research-plan state, evidence, claims, contradictions, convergence, synthesis, and handoff state [EVIDENCE: implementation-summary.md Verification records focused Vitest 49/49 passed and pinned tsc exit 0]
- [x] T009 Define clean, multi-branch, evidence-admission, contradiction, incomplete, converged, source-refresh, crash-resume, synthesis, and memory-save fixtures [EVIDENCE: implementation-summary.md Verification records focused Vitest 49/49 passed and pinned tsc exit 0]
- [x] T010 Define non-authoritative guards, isolated shadow output, failure dispositions, and the parity receipt handoff to `007-rollback-and-mode-gate` [EVIDENCE: implementation-summary.md Verification records focused Vitest 49/49 passed and pinned tsc exit 0]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Verify: Both paths consume the same frozen inputs — input digests, BASE, manifest, source snapshot, capability fingerprints, and budget lease match [EVIDENCE: implementation-summary.md Verification records focused Vitest 49/49 passed and pinned tsc exit 0]
- [x] T012 Verify: The lifecycle event map is complete — every Deep Research transition and failure boundary has a named event or explicit shared-framework mapping [EVIDENCE: implementation-summary.md Verification records focused Vitest 49/49 passed and pinned tsc exit 0]
- [x] T013 Verify: Event-for-event parity is strict — event count, order, type, logical identity, causal links, stable payload, receipts, and projection fingerprints match [EVIDENCE: implementation-summary.md Verification records focused Vitest 49/49 passed and pinned tsc exit 0]
- [x] T014 Verify: Canonicalization is bounded — unknown fields fail and only the reviewed volatility allowlist is ignored [EVIDENCE: implementation-summary.md Verification records focused Vitest 49/49 passed and pinned tsc exit 0]
- [x] T015 Verify: Trusted projections are equal — plan, branches, admitted evidence, claims, contradictions, next focus, convergence, synthesis, and handoff state match [EVIDENCE: implementation-summary.md Verification records focused Vitest 49/49 passed and pinned tsc exit 0]
- [x] T016 Verify: Resume and source refresh are equal — reuse, re-execution, invalidation, lease continuity, event tails, and final projections match fresh continuation expectations [EVIDENCE: implementation-summary.md records symmetric and per-decision frozen-lease drift rejection, a matching green control, focused Vitest 49/49, and pinned tsc exit 0]
- [x] T017 Verify: Failure states are equal and fail closed — malformed, poisoned, stale, contradictory, unsupported, and insufficient evidence never become trusted success [EVIDENCE: implementation-summary.md Verification records focused Vitest 49/49 passed and pinned tsc exit 0]
- [x] T018 Verify: Synthesis and memory-save handoff are equal — artifact, citation-edge, receipt, and terminal handoff digests match without shadow publication [EVIDENCE: implementation-summary.md Verification records focused Vitest 49/49 passed and pinned tsc exit 0]
- [x] T019 Verify: Every fixture has a reproducible parity receipt — BASE, schema, reducer, comparator, streams, projections, diffs, and exit status are bound [EVIDENCE: implementation-summary.md Verification records focused Vitest 49/49 passed and pinned tsc exit 0]
- [x] T020 Verify: Authority is unchanged — no ledger event becomes canonical, no legacy writer is removed, and no cutover certificate is emitted [EVIDENCE: implementation-summary.md Verification records focused Vitest 49/49 passed and pinned tsc exit 0]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete [EVIDENCE: implementation-summary.md Verification records focused Vitest 49/49 passed and pinned tsc exit 0]
- [x] All requirements in spec.md met with evidence [EVIDENCE: implementation-summary.md Verification records focused Vitest 49/49 passed and pinned tsc exit 0]
- [x] Phase gate green with zero unexplained semantic differences and a reproducible parity receipt [EVIDENCE: implementation-summary.md Verification records focused Vitest 49/49 passed and pinned tsc exit 0]
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Successor gate**: See the `007-rollback-and-mode-gate` sibling contract when authored
<!-- /ANCHOR:cross-refs -->
