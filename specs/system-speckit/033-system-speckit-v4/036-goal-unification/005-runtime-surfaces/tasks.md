---
title: "Tasks: Runtime surfaces"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Runtime surfaces

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

- [x] T001 Read ADR-5 and the injection contract and hook-system map
- [x] T002 Load sk-create-command and the sk-code-opencode command checklist
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 OpenCode: converge plugin keying and caps with goal-core; update goal-opencode.md (.opencode/plugins/opencode-goal.js)
- [x] T004 Pi: packet-backed goal-context.ts and goal-pi.md (.opencode/hooks/goal/pi/goal-context.ts)
- [x] T005 Cursor: packet-backed goal-inject.mjs; lift refusal in goal-cursor.md if ADR-5 allows (.opencode/hooks/goal/cursor/goal-inject.mjs)
- [x] T006 Devin: add the surface per ADR-5 (.devin/)
- [x] T007 Claude Code and Codex: hook entries and optional /goal-nesting per ADR-5
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 node --test adapter suites and plugin tests
- [x] T009 Run the manual playbook on each runtime and record results
- [x] T010 Update goal.md log
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Verification tasks passed with recorded output
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---



