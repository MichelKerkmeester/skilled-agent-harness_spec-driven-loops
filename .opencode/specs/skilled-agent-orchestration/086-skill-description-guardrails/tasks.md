---
title: "Tasks: Skill Description Budget Guardrails"
description: "Sequenced task list for the three-tier guardrails in packet 086."
trigger_phrases:
  - "086 tasks"
  - "skill description guardrails tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/086-skill-description-guardrails"
    last_updated_at: "2026-05-06T13:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Tasks authored"
    next_safe_action: "Execute T002 (Tier 1 frontmatter_templates)"
    blockers: []
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-2026-05-06-086"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Skill Description Budget Guardrails

<!-- SPECKIT_LEVEL: 1 -->
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

<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Scaffold spec folder (spec.md, plan.md, tasks.md)

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Tier 1 — sk-doc docs
- [x] T002 Update `sk-doc/assets/documentation/frontmatter_templates.md` (line 198 + new subsection)
- [x] T003 [P] Update `sk-doc/assets/skill/skill_md_template.md` (line 75)
- [x] T004 [P] Update `sk-doc/references/specific/skill_creation.md` (line 397 table + Pitfall 1 lines 571-581)
- [x] T005 [P] Add callouts to `sk-doc/assets/agent_template.md` and `assets/command_template.md`

### Tier 2 — create-time validation
- [x] T006 Extend `sk-doc/scripts/quick_validate.py` with description-length check + CLI flag
- [x] T007 Add 4 fixtures under `sk-doc/scripts/tests/`
- [x] T008 Wire into `command/create/sk-skill.md` + `assets/create_sk_skill_*.yaml`
- [x] T009 Wire into `command/create/agent.md` + `assets/create_agent_confirm.yaml`

### Tier 3 — drift audit
- [x] T010 Create `command/doctor/scripts/audit_descriptions.py`
- [x] T011 Create `command/doctor/skill-budget.md` entrypoint
- [x] T012 Create `command/doctor/assets/doctor_skill-budget_auto.yaml` + `_confirm.yaml`
- [x] T013 Add 4 runtime symlink mirrors

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 `validate.sh --strict` on spec folder (REQ-001..005)
- [x] T015 Run quick_validate.py against fixtures (REQ-003, REQ-007)
- [x] T016 Run `/doctor:skill-budget :auto` end-to-end (REQ-004, REQ-005)
- [x] T017 advisor_recommend probe for sk-doc keyword density (REQ-006)
- [x] T018 Write implementation-summary.md
- [x] T019 Save context via generate-context.js

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] All 5 P0 requirements verified

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Implementation Summary**: See `implementation-summary.md`

<!-- /ANCHOR:cross-refs -->
