---
title: "Tasks: Cross-Mode Anti-Convergence Contract ADR"
description: "Completed task ledger for the cross-mode antiConvergence contract and optimizer invariant work."
trigger_phrases:
  - "cross-mode anti-convergence"
  - "antiConvergence contract ADR"
  - "optimizer invariant groups"
  - "stopPolicy fail-closed"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-deep-loop-improved/003-deep-loop-workflows/003-cross-mode-anti-convergence-adr"
    last_updated_at: "2026-07-01T22:20:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Replaced scaffold content with spec-grounded complete info"
    next_safe_action: "Regenerate metadata and run recursive strict validation"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-workflows/deep-research/assets/deep_research_config.json"
      - ".opencode/skills/deep-loop-workflows/deep-review/assets/deep_review_config.json"
      - ".opencode/skills/deep-loop-workflows/deep-context/assets/deep_context_config.json"
      - ".opencode/skills/deep-loop-workflows/deep-loop-council/assets/deep_council_config.json"
      - ".opencode/skills/deep-loop-runtime/assets/runtime_capabilities.json"
      - ".opencode/skills/deep-loop-runtime/lib/deep-loop/runtime-capabilities.cjs"
      - ".opencode/skills/deep-loop-runtime/assets/optimizer-manifest.json"
    session_dedup:
      fingerprint: "sha256:1111111111111111111111111111111111111111111111111111111111111111"
      session_id: "scaffold-content-remediation-004"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Cross-Mode Anti-Convergence Contract ADR

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

- [x] T001 Read the completed spec and identify all four mode configs (`spec.md`).
- [x] T002 Confirm leaves 001 and 002 provide prerequisite semantics (`spec.md`).
- [x] T003 [P] Identify runtime capabilities and optimizer manifest as policy enforcement surfaces.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add `antiConvergence` to the research config (`deep_research_config.json`).
- [x] T005 Add `antiConvergence` to the review config (`deep_review_config.json`).
- [x] T006 Add `antiConvergence` to the context config (`deep_context_config.json`).
- [x] T007 Add council `antiConvergence.minRounds` (`deep_council_config.json`).
- [x] T008 Add fail-closed stop policy to runtime capabilities (`runtime_capabilities.json`).
- [x] T009 Enforce stop-policy presence during capability load (`runtime-capabilities.cjs`).
- [x] T010 Add optimizer invariant group and lock `convergenceMode` (`optimizer-manifest.json`).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Verify all four configs parse with the new contract fields.
- [x] T012 Verify missing `stopPolicy` causes runtime capability load failure.
- [x] T013 Verify invalid min/max optimizer candidates reject before scoring.
- [x] T014 Update plan and task docs to reflect the completed contract work (`plan.md`, `tasks.md`).
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
