---
title: "Tasks: 059 cli-devin deep-loop alignment"
description: "Task tracker for 5-phase 059 work."
trigger_phrases:
  - "059 tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/001-local-embeddings-foundation/055-cli-devin-deep-loop-alignment"
    last_updated_at: "2026-05-15T19:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Created task list"
    next_safe_action: "Author retrospective"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:f7c0870becc1cfce30ab5e286d503491cd6ef947c5928f37510a7caa076c8ecd"
      session_id: "059-tasks"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: 059 cli-devin deep-loop alignment

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[B]` | Blocked |

<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Create packet skeleton (7 files)
- [ ] T002 Author `research/retrospective.md` (56+58 lessons consolidated)
- [ ] T003 Dispatch cli-codex gpt-5.5 xhigh fast scaffold review
- [ ] T004 Capture review findings; incorporate or defer
- [ ] T005 Strict-validate packet PASS
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

### Commands
- [ ] T006 Update `/spec_kit:deep-research` executor enum (lines 79, 124, 137) + YAML dispatch
- [ ] T007 Update `/spec_kit:deep-review` executor enum + YAML dispatch

### Agents
- [ ] T008 Add SWE-1.6 iter contract subsection to `@deep-research`
- [ ] T009 Add SWE-1.6 iter contract subsection to `@deep-review`

### cli-devin skill + references + assets
- [ ] T010 Add "Deep-Loop Iter Contract" section to cli-devin SKILL.md
- [ ] T011 Create `cli-devin/references/deep-loop-iter-contract.md`
- [ ] T012 Create `cli-devin/references/agent-config-recipes.md`
- [ ] T013 Create `cli-devin/assets/deep-loop-iter-template.md`
- [ ] T014 Create `cli-devin/assets/agent-config-deep-research-iter.json`
- [ ] T015 Create `cli-devin/assets/agent-config-deep-review-iter.json`
- [ ] T016 Smoke-test each agent-config JSON with light --print prompt
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [ ] T017 sk-doc validate per touched file
- [ ] T018 JSON parse validate on the 2 agent-config files
- [ ] T019 Strict-validate packet
- [ ] T020 Sonnet @markdown + @review parallel double-check
- [ ] T021 Patch any P0
- [ ] T022 Backfill implementation-summary
- [ ] T023 Final commit on main
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks `[x]` or `[B]`
- [ ] cli-devin is first-class deep-loop executor; 2 references + 3 assets shipped
- [ ] Single primary commit on main
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Resource Map**: See `resource-map.md`
<!-- /ANCHOR:cross-refs -->
