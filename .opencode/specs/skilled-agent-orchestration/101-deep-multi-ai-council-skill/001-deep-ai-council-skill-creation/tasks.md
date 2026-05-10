---
title: "Tasks: 101/001 Deep AI Council Skill Creation"
description: "Task list for creating the dedicated deep-ai-council skill, renamed runtime agents, moved council assets, and advisor routing updates."
trigger_phrases:
  - "101/001 tasks"
  - "deep-ai-council skill tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/101-deep-multi-ai-council-skill/001-deep-ai-council-skill-creation"
    last_updated_at: "2026-05-10T06:45:00Z"
    last_updated_by: "openai-gpt-5.5-opencode"
    recent_action: "Authored initial task list"
    next_safe_action: "Run consumer inventory before renaming agents"
    blockers: []
    key_files:
      - .opencode/skills/deep-ai-council/
      - .opencode/agents/
      - .claude/agents/
      - .codex/agents/
      - .gemini/agents/
      - .opencode/skills/system-spec-kit/mcp_server/skill_advisor/
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "101-001-skill-creation"
      parent_session_id: null
    completion_pct: 10
    open_questions:
      - "Do active callers require the old multi-ai-council name?"
    answered_questions:
      - "Phase 001 excludes graph support."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: 101/001 Deep AI Council Skill Creation

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

- [x] T001 Scaffold parent and child phase spec folders (`101-deep-multi-ai-council-skill/`)
- [x] T002 Author Phase 001 root spec, plan, tasks, and summary stubs (`001-deep-ai-council-skill-creation/`)
- [ ] T003 Inventory all old-name producers and consumers (`multi-ai-council`)
- [ ] T004 Confirm whether compatibility shim is required by concrete consumer evidence
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Create `deep-ai-council` skill root (`.opencode/skills/deep-ai-council/`)
- [ ] T006 Add skill metadata (`SKILL.md`, `description.json`, `graph-metadata.json`)
- [ ] T007 Move/adapt council references into the new skill (`references/`)
- [ ] T008 Move/adapt council assets and testing playbook (`assets/`)
- [ ] T009 Move/adapt council scripts and script tests (`scripts/`)
- [ ] T010 Rename OpenCode, Claude, Codex, and Gemini agent mirrors to `deep-ai-council`
- [ ] T011 Update advisor metadata, aliases, generated graph, and regression fixtures
- [ ] T012 Remove old council ownership from `system-spec-kit` except necessary integration notes
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T013 Run advisor validation for council prompts
- [ ] T014 Run skill graph scan and validation
- [ ] T015 Run moved council script tests
- [ ] T016 Run OpenCode alignment verification for touched `.opencode` surfaces
- [ ] T017 Run `validate.sh --strict` on this phase folder
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Advisor routes council prompts to `deep-ai-council`
- [ ] Runtime mirror names are consistent across all four runtimes
- [ ] Phase 001 validation passes without warnings
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Parent**: `../spec.md`
- **Successor**: `../002-deep-ai-council-graph-support/spec.md`
<!-- /ANCHOR:cross-refs -->
