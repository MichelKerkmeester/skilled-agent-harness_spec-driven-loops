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
    last_updated_at: "2026-08-06T18:24:04Z"
    last_updated_by: "codex"
    recent_action: "Completed all terminal gate tasks and recorded verification evidence"
    next_safe_action: "Collect candidate evidence against activation-matrix.schema.json"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp-server/lib/render.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-06-hooks-002-007"
      parent_session_id: null
    completion_pct: 100
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

Status: Complete - all terminal gate tasks are implemented and verified; candidate flags remain off.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [B] Specify the forbidden-comment reject negative control against a real comment-hygiene guard (`guardrail-negative-controls.test.mjs`)
- [x] T002 Specify the unsupported-completion-claim block negative control against a real guard (`guardrail-negative-controls.test.mjs`)
- [x] T003 [P] Draft the governor scored-scenario rubric (not exact-string matching) (`guardrail-negative-controls.test.mjs`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Design the per-runtime-per-candidate activation matrix schema (fields, evidence types, fail-open default) (`activation-matrix.json`, `activation-matrix.schema.json`)
- [x] T005 Map each of the seven named central risks to a control or monitoring entry (`risk-register.md`)
- [x] T006 Draft the per-block/per-runtime rollback procedure template (`rollback-procedure.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Execute the three behavioral negative controls and confirm each rejects/blocks the real case (`guardrail-negative-controls.test.mjs`)
- [x] T008 Populate the activation matrix with placeholder unknown-state cells; confirm every one defaults to emit (`activation-matrix.test.mjs`)
- [x] T009 Work one hypothetical candidate cell through the rollback procedure end-to-end as proof (`rollback-procedure.md`)
- [x] T010 Confirm the evidence schema is consumable by 002-006 without modification (`activation-matrix.schema.json`, `activation-matrix.test.mjs`)
- [x] T011 Document the risk-register mapping for all seven named central risks (`risk-register.md`)
- [x] T012 Reconcile spec/plan/tasks/checklist/implementation-summary for this packet (phase records) — Evidence: `checklist.md` and `implementation-summary.md`; phase validator exit 0.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Three behavioral negative controls and the fail-open default both proven
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
