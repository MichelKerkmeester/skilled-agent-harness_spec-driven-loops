---
title: "Tasks: Command + agent template conformance"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "command agent conformance tasks"
  - "125 sk-doc phase 020 tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/125-sk-doc-parent/020-command-agent-template-conformance"
    last_updated_at: "2026-07-07T14:31:04.000Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored phase-020 tasks"
    next_safe_action: "Verify routers, validate, commit"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 60
    open_questions: []
    answered_questions: []
---
# Tasks: Command + agent template conformance

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm numbering is a warning + only numbered `## N.` sections count (validate_document.py)
- [x] T002 Confirm all 24 agents carry a numbered `core_workflow`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Fix agent detection `/agent/`→`/agents/` (validate_document.py)
- [x] T004 Reconcile `agent.requiredSections`→`["core_workflow"]`, ideals→recommended (template_rules.json)
- [ ] T005 GPT-5.5 normalize the 10 routers to numbered PURPOSE/INSTRUCTIONS
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 24/24 agents VALID as type `agent`; validator + rules stay valid
- [ ] T007 10/10 routers VALID; fresh-agent verify body content preserved
- [ ] T008 `validate.sh --strict` exit 0; commit; push
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Agent detection + rule reconciled; 24/24 agents VALID
- [ ] 10/10 routers VALID
- [ ] `validate.sh --strict` exit 0
- [ ] No `[B]` blocked tasks remaining
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
