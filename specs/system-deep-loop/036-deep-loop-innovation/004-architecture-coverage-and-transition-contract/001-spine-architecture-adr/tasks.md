---
title: "Tasks: Spine Architecture ADR"
description: "Tasks to ratify the six-primitive cross-mode spine and bind its downstream consumer contracts."
trigger_phrases:
  - "spine architecture ADR tasks"
  - "cross-mode spine ratification tasks"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/004-architecture-coverage-and-transition-contract/001-spine-architecture-adr"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/004-architecture-coverage-and-transition-contract/001-spine-architecture-adr"
    last_updated_at: "2026-07-15T18:00:00Z"
    last_updated_by: "codex"
    recent_action: "Completed source reconciliation and spine ratification tasks"
    next_safe_action: "Use the accepted ADR in phases 006, 007, and 008"
    blockers: []
    key_files:
      - "decision-record.md"
      - "implementation-summary.md"
      - "checklist.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Spine Architecture ADR

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

- [x] T001 Pin and review the 036 parent spec, phase-tree manifest, and run-2 research synthesis section 12 [Source: `decision-record.md`, Controlling sources]
- [x] T002 Reconcile the research's five recurring primitives with the parent's transition-authorization gateway to form the six-part spine [File: `decision-record.md`]
- [x] T003 Confirm this child has `depends_on: []` and delegates runtime mechanics to phases 006-008 [File: `spec.md`] [File: `decision-record.md`]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Ratify a single decision covering all six primitives: typed append-only versioned event ledger; fail-closed transition-authorization gateway (default-deny); sealed/frozen reference artifacts (digest-referenced); versioned replay fingerprints; receipts/certificates; blinded/counterfactual adjudication [File: `decision-record.md`]
- [x] T005 Define the concrete problem, ratified invariant, and primary consumer phase for each primitive [File: `decision-record.md`, Primitive-to-problem contract]
- [x] T006 Record why the six primitives are indivisible as an evidence and authority chain [File: `decision-record.md`, Why the primitives are indivisible]
- [x] T007 Reject ad-hoc per-mode JSONL, mutable state, unversioned events, and direct ungated writers with failure-specific rationale [File: `decision-record.md`, Alternatives Considered and Rejected]
- [x] T008 Reject mutable reference inputs, optional receipts, self-scoring, and big-bang replacement with failure-specific rationale [File: `decision-record.md`, Alternatives Considered and Rejected]
- [x] T009 Record positive consequences, implementation costs, compatibility surfaces, and migration obligations [File: `decision-record.md`, Consequences]
- [x] T010 Bind phase 006 to ledger/authorization/replay, phase 007 to seals/receipts/adjudication, and phase 008 to compatibility/shadow/rollback preservation [File: `decision-record.md`, Consumer Contract and Rollback]
- [x] T011 Preserve the additive-dark, legacy-authoritative, per-mode-cutover migration contract without authorizing runtime cutover [Source: `decision-record.md`, Decision]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Verify each primitive is traced to the parent architecture, manifest, or run-2 section 12 evidence [Source: `decision-record.md`, Source trace column]
- [x] T013 Verify transition authorization is explicit, pre-write, and default-deny for missing, malformed, unknown, or unsupported decisions [File: `decision-record.md`]
- [x] T014 Verify sealed artifacts are immutable and digest-bound and replay fingerprints bind relevant versions [File: `decision-record.md`, Primitive-to-problem contract]
- [x] T015 Verify receipts/certificates are independently checkable and adjudication is blinded/counterfactual with raw evidence retained [File: `decision-record.md`, Primitive-to-problem contract]
- [x] T016 Verify every rejected alternative maps to a documented consequence or invariant and leaves no fallback to per-mode authority, mutable truth, unversioned replay, or self-scoring [File: `decision-record.md`, Alternatives Considered and Rejected]
- [x] T017 Verify phases 006-008 collectively consume or preserve the full spine without duplicated or unowned primitives [File: `decision-record.md`, Consumer Contract and Rollback]
- [x] T018 Run strict spec-kit validation and resolve every error and warning [Test: validate.sh --strict exit 0, Errors: 0, Warnings: 0]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete [Evidence: 18/18 numbered tasks complete]
- [x] All requirements in spec.md met with evidence [File: `decision-record.md`] [File: `checklist.md`]
- [x] Every P0 and P1 item in checklist.md passes [File: `checklist.md`]
- [x] Phase gate green with Errors: 0 and Warnings: 0 [Test: validate.sh --strict exit 0]
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decision**: See `decision-record.md`
- **Completion evidence**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
