---
title: "Tasks: Agent Alignment"
description: "Planned task outline for Agent Alignment."
trigger_phrases:
  - "agent alignment tasks"
  - "027 release cleanup tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/007-agent-alignment"
    last_updated_at: "2026-06-10T00:00:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Prepared Planned scaffold for strict validation"
    next_safe_action: "Implement child phase after scope approval"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-10-007-agent-alignment-planned"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Operator approved Planned release-cleanup scaffolds."
---
# Tasks: Agent Alignment

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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## PHASE 1: SETUP

- [ ] T001 Inventory current claims (.opencode/agents/**, .claude/agents/**, .codex/agents/**)
- [ ] T002 List claims about schema, flags, CLI, constitutional rules, memory features, and doctrine (.opencode/agents/**, .claude/agents/**, .codex/agents/**)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [ ] T003 [P] Align stale schema and flag references (.opencode/agents/**, .claude/agents/**, .codex/agents/**)
- [ ] T004 [P] Align CLI front-door and memory-feature references (.opencode/agents/**, .claude/agents/**, .codex/agents/**)
- [ ] T005 [P] Align constitutional-rule and doctrine references (.opencode/agents/**, .claude/agents/**, .codex/agents/**)
- [ ] T006 Preserve ownership boundary: Keep three-mirror parity explicit. (.opencode/agents/**, .claude/agents/**, .codex/agents/**)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [ ] T007 Run strict validation for this child phase (.opencode/skills/system-spec-kit/scripts/spec/validate.sh)
- [ ] T008 Record evidence in implementation-summary.md (implementation-summary.md)
- [ ] T009 Confirm no out-of-scope source, command, agent, skill, or YAML edits were made (git diff)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All planned tasks are complete or explicitly deferred with approval
- [ ] No blocked tasks remain
- [ ] Strict validation passes for this child phase
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
