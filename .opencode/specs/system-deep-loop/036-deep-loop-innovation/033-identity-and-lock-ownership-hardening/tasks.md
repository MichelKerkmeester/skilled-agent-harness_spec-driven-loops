---
title: "Tasks: Identity and Lock Ownership Hardening"
description: "Completed task breakdown for fail-closed identity, policy-state binding, and process-shared ownership remediation."
trigger_phrases:
  - "identity hardening tasks"
  - "deep-loop remediation tasks"
  - "lock ownership task list"
importance_tier: "critical"
contextType: "tasks"
parent: "system-deep-loop/036-deep-loop-innovation/033-identity-and-lock-ownership-hardening"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/033-identity-and-lock-ownership-hardening"
    last_updated_at: "2026-08-06T05:29:50Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Updated F001/F004 tasks with regression and three-process CAS evidence"
    next_safe_action: "Regenerate child metadata and confirm strict validation"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "checklist.md"
      - "implementation-summary.md"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "All five finding dispositions are recorded; F001 and F004 re-fixes have focused red/green evidence."
---
# Tasks: Identity and Lock Ownership Hardening

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the 024 runtime hardening, current tests, and the five finding sites (`runtime/lib/` and `runtime/tests/`).
- [x] T002 Confirm the child packet and frozen-file boundaries (`spec.md`, runtime tests, and 033 docs only).
- [x] T003 [P] Render the Level 3 Spec Kit templates and inspect their required anchors. [evidence: spec.md:25 and all child template headers]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P] Add the F001 identity-required negative/regression tests and make gateway identity resolution fail closed only when a binding, resolver, or authority mode requires it (`transition-authorization-gateway.ts`, `authorized-ledger.vitest.ts`).
- [x] T005 [P] Add the F002 closure-state negative test, require explicit policy state, and update registry consumers (`transition-policy-registry.ts`, runtime policy registrations, tests).
- [x] T006 Add the F003 two-process leaf contention test and hold the shared append lock across stage, publication, append, and cleanup (`leaf-artifact-writer.ts`).
- [x] T007 Add the F004 three-process owner-token race test and implement dead-owner reclaim, non-overwriting compare-and-swap restore, plus compare-and-delete release (`atomic-state.ts`).
- [x] T008 Inspect F005, retain the deterministic fresh-acquisition falsifier, and atomically publish complete loop-lock records (`loop-lock.ts`, `loop-lock.vitest.ts`).
- [x] T009 Preserve the existing 024 gateway-only append, hard-private mutator, idempotent replay short-circuit, and identity/fencing tests. [evidence: implementation-summary.md:80 and owned suite output]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run red-before and green-after tests for F001-F004 and record exact named tests and return codes, including the three-process F004 stress test. [evidence: implementation-summary.md:95 and red/green command output]
- [x] T011 Run the nine owned suites: authorized-ledger, locks-and-fencing, receipts-and-effect-recovery, loop-lock, loop-lock CLI, atomic-state, leaf-artifact-writer, branch-leases-waves, and replay-fingerprint. [evidence: implementation-summary.md:102 and all nine suite rows]
- [x] T012 Run the sibling TypeScript compiler, comment hygiene, description generation, graph backfill, and strict Spec Kit validation. [evidence: implementation-summary.md:121 and final gate output]
- [x] T013 Reconcile checklist evidence, F005 ADR disposition, implementation summary, and frozen-file confirmation. [evidence: checklist.md:165 and decision-record.md:35]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remain.
- [x] Named negative and race tests passed after their corresponding fixes.
- [x] Owned-suite and typecheck evidence is recorded in `implementation-summary.md`.
- [x] Metadata and strict validation evidence is recorded before handoff.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Checklist**: See `checklist.md`.
- **Decision Record**: See `decision-record.md`.
- **Implementation Summary**: See `implementation-summary.md`.
<!-- /ANCHOR:cross-refs -->
