---
title: "Tasks: sk-vision 004 opencode adapter"
description: "Implementation tasks for wiring sk-vision to OpenCode plugins directory and testing auto-inspect."
trigger_phrases:
  - "sk-vision opencode tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/004-opencode-adapter"
    last_updated_at: "2026-08-15T17:45:00.000Z"
    last_updated_by: "cursor-grok"
    recent_action: "Added real-file, 13-tool, and no-plugin-array tasks."
    next_safe_action: "Wait for 003 dist/plugin.js; then T001."
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-004-opencode-20260815"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: sk-vision 004 opencode adapter

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

## AI Execution Protocol

### Pre-Task Checklist
Before starting any task, verify:
1. `spec.md` scope unchanged and confirmed.
2. Current phase identified in `plan.md`.
3. Task dependencies satisfied.
4. Relevant P0/P1 checklist items identified in `checklist.md`.
5. Previous session context reviewed when resuming.

### Execution Rules
| Rule | Description |
|------|-------------|
| TASK-SEQ | Complete tasks in dependency order |
| TASK-SCOPE | Stay within OpenCode plugin adapter; no Pi adapter edits |
| TASK-VERIFY | Test plugin module export resolution |
| TASK-DOC | Update status immediately |
| TASK-SYNC | Close with `validate.sh --strict` |

### Status Reporting Format
`T### STATUS: done|blocked - evidence path`

### Blocked Task Protocol
If a task is BLOCKED, stop, record the blocker in continuity frontmatter, and do not proceed to downstream tasks.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Verify `vision-runtime/dist/plugin.js` build artifact exists
- [ ] T002 Inspect `.opencode/plugins/` directory and current plugin registrations
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Author `.opencode/plugins/sk-vision.js` as a real file (`test ! -L`), analog to `mk-communication-projection.js`
- [ ] T004 [P] Update `.opencode/plugins/README.md` with `sk-vision.js` documentation and config keys
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T005 Confirm `test -f .opencode/plugins/sk-vision.js && test ! -L .opencode/plugins/sk-vision.js`
- [ ] T006 Confirm the 13 dump `sk_vision_*` tools register; no `sk_vision_query`
- [ ] T007 Confirm auto-inspect 2s grace never awaits the full GPU run
- [ ] T008 Confirm repo-root `opencode.json` has no new `plugin` array for sk-vision
- [ ] T009 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/sk-vision/001-sk-vision-fork-of-opencode-senses/004-opencode-adapter --strict`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All Phase 1-3 tasks marked completed with evidence.
- [ ] `.opencode/plugins/sk-vision.js` loads cleanly.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md`
- Plan: `plan.md`
- Checklist: `checklist.md`
<!-- /ANCHOR:cross-refs -->
