---
title: "Tasks: Command lane-asking for the model-benchmark lane"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "command lane-asking tasks"
  - "model-benchmark command tasks"
  - "lane-asking task list"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/022-deep-agent-improvement-benchmark-mode/008-add-model-benchmark-lane-selection-prompts"
    last_updated_at: "2026-05-29T09:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored phase 008 tasks"
    next_safe_action: "Build the lane-asking branch + Lane B YAMLs + dedicated command"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-008-docs"
      parent_session_id: null
    completion_pct: 20
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Command lane-asking for the model-benchmark lane

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

- [ ] T001 Confirm the model-benchmark runtime contract: loop-host flags, default profile, fixtures, scorers, grader (`.opencode/skills/deep-agent-improvement/scripts/loop-host.cjs`)
- [ ] T002 [P] Read the Lane A command and both Lane A YAMLs as the structural template (`.opencode/commands/deep/start-agent-improvement-loop.md`, `.opencode/commands/deep/assets/deep_start-agent-improvement-loop_{auto,confirm}.yaml`)
- [ ] T003 [P] Inspect advisor source to decide verify-vs-edit for the new command (`.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts`, `lanes/explicit.ts`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add the use-case lane question plus additive lane-resolution branch (`.opencode/commands/deep/start-agent-improvement-loop.md`)
- [ ] T005 Create the Lane B auto and confirm workflow YAMLs driving `loop-host.cjs --mode=model-benchmark` (`.opencode/commands/deep/assets/deep_start-model-benchmark-loop_{auto,confirm}.yaml`)
- [ ] T006 Create the dedicated command and gemini mirror (`.opencode/commands/deep/start-model-benchmark-loop.md`, `.gemini/commands/deep/start-model-benchmark-loop.toml`)
- [ ] T007 Register the command and both lanes in the README and confirm advisor routing (`.opencode/commands/README.txt`, advisor scorer source)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Confirm CMD-1 Lane A behavioral identity (Lane A workflow unchanged)
- [ ] T009 Run Lane B end-to-end and confirm it reaches benchmark-complete
- [ ] T010 Confirm advisor routes both lanes, README and gemini mirror present, no placeholders remain
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] checklist.md P0 items verified with evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
