---
title: "Tasks: Phase 11: mandatory-interface-design-coupling [template:level_1/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "open design mandatory coupling tasks"
  - "phase 011 tasks"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/150-mcp-open-design/011-mandatory-interface-design-coupling"
    last_updated_at: "2026-06-16T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Scaffolded phase; ready to edit SKILL.md"
    next_safe_action: "Edit SKILL.md, README, changelog; validate"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-open-design/SKILL.md"
      - ".opencode/skills/mcp-open-design/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-011-mandatory-interface-design-coupling"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 11: mandatory-interface-design-coupling

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

> Harden SKILL.md into a hard precondition.

- [ ] T001 Add the top MANDATORY banner before §1, with the WIRE/inventory exemption (SKILL.md)
- [ ] T002 §2: add the phase-detection hard gate, make the resource rows mandatory, add the router precondition that blocks a design step (SKILL.md)
- [ ] T003 §3 Run direction: add the mandatory sk-interface-design pre-step before start_run + form answers (SKILL.md)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

> Rules, success criteria, and supporting docs.

- [ ] T004 §4: rewrite ALWAYS #5 as a hard precondition; add the NEVER rule forbidding UI output without sk-interface-design (SKILL.md)
- [ ] T005 §6 success criteria + §7/§8 integration: mandatory-partner wording; frontmatter version 1.3.0.0 + description note (SKILL.md)
- [ ] T006 README: mandate banner + strengthen grounding / related-skills / FAQ wording (README.md)
- [ ] T007 Create changelog/v1.3.0.0.md
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

> Validate and reconcile.

- [ ] T008 Strict-validate this phase (validate.sh --strict, exit 0)
- [ ] T009 Reconcile parent 150 phase map (phase-11 row) + children_ids (graph-metadata.json)
- [ ] T010 Consistency grep: SKILL.md + README both state the mandate; pure transport exemption present
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
