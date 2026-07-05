---
title: "Tasks: Convergence Math Unification ADR"
description: "Completed task ledger for the convergence profile ADR and parity baseline."
trigger_phrases:
  - "convergence profile unification"
  - "convergence math ADR"
  - "unified convergence profile"
  - "convergence fracture deep loop"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-deep-loop-improved/003-deep-loop-workflows/002-convergence-profile-unification-adr"
    last_updated_at: "2026-07-01T22:20:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Replaced scaffold content with spec-grounded complete info"
    next_safe_action: "Regenerate metadata and run recursive strict validation"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/scripts/convergence.cjs"
      - ".opencode/skills/deep-loop-runtime/lib/council/convergence.cjs"
      - ".opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts"
      - ".opencode/skills/deep-loop-runtime/tests/integration/convergence-script.vitest.ts"
    session_dedup:
      fingerprint: "sha256:1111111111111111111111111111111111111111111111111111111111111111"
      session_id: "scaffold-content-remediation-004"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Convergence Math Unification ADR

<!-- SPECKIT_LEVEL: 1 -->

---

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

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the completed spec and identify the three convergence implementations (`spec.md`).
- [x] T002 Confirm `minIterations` is treated as a STOP-guard input from leaf 001 (`spec.md`).
- [x] T003 [P] Scope this leaf to ADR and parity baseline only, not migration (`spec.md`).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Define the shared convergence profile fields in the ADR (`threshold`, `weight`, `role`, `direction`, `normalizer`).
- [x] T005 Document per-loop metric semantics and reject one universal formula.
- [x] T006 Add contract references to research convergence (`convergence.cjs`).
- [x] T007 Add contract references to council convergence (`lib/council/convergence.cjs`).
- [x] T008 Add contract references to coverage graph signals (`coverage-graph-signals.ts`).
- [x] T009 Create the current-behavior parity test (`convergence-script.vitest.ts`).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Confirm the ADR names and types all five profile fields.
- [x] T011 Run the parity test on pre-migration convergence behavior.
- [x] T012 Confirm no runtime migration is included in this leaf.
- [x] T013 Update plan and task docs to reflect the completed ADR work (`plan.md`, `tasks.md`).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Manual verification passed according to the completed specification.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
