---
title: "Tasks: Guardrail Controls and Activation Gate"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "guardrail activation gate tasks"
  - "behavioral negative control tasks"
importance_tier: "important"
contextType: "implementation"
parent: "hooks"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/007-guardrail-controls-and-activation"
    last_updated_at: "2026-08-06T00:00:00Z"
    last_updated_by: "opus"
    recent_action: "Authored the task list for the guardrail negative-control and activation gate"
    next_safe_action: "Begin T001 once Phase 001 receipts land"
    blockers:
      - "001-measurement-and-receipts-foundation has not yet been built"
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp-server/lib/render.ts"
    session_dedup:
      fingerprint: "sha256:71ac205de468c56b9d58150b2a5dfb349f138780c102d9fb901cae0d0d50036c"
      session_id: "2026-08-06-hooks-002-007"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Guardrail Controls and Activation Gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

Status: Planned - nothing below has been implemented yet; this list is the forward plan for the phase.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 [B] Specify the forbidden-comment reject negative control against a real comment-hygiene guard
- [ ] T002 Specify the unsupported-completion-claim block negative control against a real guard
- [ ] T003 [P] Draft the governor scored-scenario rubric (not exact-string matching)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Design the per-runtime-per-candidate activation matrix schema (fields, evidence types, fail-open default)
- [ ] T005 Map each of the seven named central risks to a control or monitoring entry
- [ ] T006 Draft the per-block/per-runtime rollback procedure template
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Execute the three behavioral negative controls and confirm each rejects/blocks the real case
- [ ] T008 Populate the activation matrix with placeholder unknown-state cells; confirm every one defaults to emit
- [ ] T009 Work one hypothetical candidate cell through the rollback procedure end-to-end as proof
- [ ] T010 Confirm the evidence schema is consumable by 002-006 without modification
- [ ] T011 Document the risk-register mapping for all seven named central risks
- [ ] T012 Reconcile spec/plan/tasks/checklist/implementation-summary for this packet
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Three behavioral negative controls and the fail-open default both proven
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
