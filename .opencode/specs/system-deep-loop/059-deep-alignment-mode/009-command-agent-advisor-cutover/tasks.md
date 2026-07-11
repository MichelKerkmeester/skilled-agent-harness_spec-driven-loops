---
title: "Tasks: Phase 9: command-agent-advisor-cutover"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "phase 009"
  - "command agent cutover"
  - "advisor routing"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/059-deep-alignment-mode/009-command-agent-advisor-cutover"
    last_updated_at: "2026-07-11T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Draft phase 009 task list"
    next_safe_action: "Start T004 command authoring once phase 003 skeleton exists"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-059-009"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Phase 9: command-agent-advisor-cutover

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

- [ ] T001 [B] Confirm phase 003 mode-packet skeleton location (blocked on sibling phase 003)
- [ ] T002 Re-read `.opencode/commands/deep/review.md` and `.claude/agents/deep-review.md` for currency
- [ ] T003 [P] Re-read `.opencode/skills/system-deep-loop/mode-registry.json` discriminator/advisorRoutingContract docs for currency
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

<!-- These tasks belong to a future execution pass, gated behind phases 001-008 landing as real code. -->

- [ ] T004 [B] Author `/deep:alignment` command and `:auto`/`:confirm` asset YAMLs (blocked on T001)
- [ ] T005 [B] Author `@deep-alignment` leaf agent, per-lane translation of the deep-review contract (blocked on phases 006-008 real code)
- [ ] T006 [B] Add the `mode-registry.json` entry for the new mode
- [ ] T007 [B] Add advisor projection-map entries (`skill_advisor.py`, `aliases.ts`) and run the drift-guard test
- [ ] T008 [B] Author the behavior benchmark folder with three minimum scenarios (clean corpus, real violations, known-deviation suppression)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

<!-- These tasks belong to a future execution pass, gated behind phases 001-008 landing as real code. -->

- [ ] T009 [B] Run `node .opencode/commands/doctor/scripts/parent-skill-check.cjs` STRICT against the real `deep-alignment` skill, once phases 001-008 and 010 are real code
- [ ] T010 [B] Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-deep-loop/059-deep-alignment-mode --recursive --strict` across the full 10-phase packet
- [ ] T011 [B] Run the behavior benchmark and confirm all three scenarios behave as expected
- [ ] T012 [B] Update `checklist.md` with evidence for each verified item
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

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
