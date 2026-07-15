---
title: "Tasks: Phase 3: feedback-log-and-008-reframe"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "feedback reframe tasks 005"
  - "reserve feedback types task"
  - "forged feedback rejected test"
  - "constitutional immunity invariant task"
  - "shadow only ledger audit task"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/003-xce-research-based-refinement/002-memory-store-and-search/005-memclaw-derived-memory-hardening/003-feedback-log-and-005-reframe"
    last_updated_at: "2026-06-10T13:24:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Completed feedback safety posture task evidence"
    next_safe_action: "Proceed to next phase after handoff"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/003-feedback-log-and-005-reframe"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 3: feedback-log-and-008-reframe

<!-- SPECKIT_LEVEL: 2 -->

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

- [x] T001 Audit current feedback-ledger shadow-only guarantees: confirmed with `tests/feedback-safety-posture.vitest.ts` and `tests/feedback-ledger.vitest.ts` (`lib/feedback/feedback-ledger.ts`)
- [x] T002 [P] Audit reserved/stamped feedback event/artifact types: schema guard rejects forged public writes; ledger direct path remains system-stamped (`lib/feedback/feedback-ledger.ts`, `context-server.ts`, `schemas/tool-input-schemas.ts`)
- [x] T003 [P] Confirm batch-learning + query-flow-tracker stay shadow-gated / diagnostic-only; targeted canaries passed (`lib/feedback/batch-learning.ts`, `lib/feedback/query-flow-tracker.ts`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Reserve system feedback event/artifact types server-side; no public feedback-write tool added (`schemas/tool-input-schemas.ts`, `context-server.ts`)
- [x] T005 Reject forged feedback writes at the write boundary with `E_RESERVED_FEEDBACK_TYPE` (`schemas/tool-input-schemas.ts`)
- [x] T006 Document the symmetric-damping + rare-but-correct + constitutional-immunity invariants for any future reducer (spec.md / plan.md)
- [x] T007 Add the coordination note rescoping the `005-learning-feedback-reducers/{001-aggregator,003-causal-reducer,004-retention-reducer,005-env-tests-integration}` children to diagnostics-first / deferred — coordination only; no 005 specs edited (this folder's docs)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 vitest: forged feedback writes are rejected (reserved-type rejection); system-stamped path succeeds (`schemas/tool-input-schemas.ts`, feedback ledger tests)
- [x] T009 vitest: ledger path produces no ranking / retention / FSRS side-effects (shadow-only assertion) (`lib/feedback/feedback-ledger.ts` tests)
- [x] T010 Update documentation (spec/plan/tasks) and perform manual verification of invariants + 008 coordination note
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
