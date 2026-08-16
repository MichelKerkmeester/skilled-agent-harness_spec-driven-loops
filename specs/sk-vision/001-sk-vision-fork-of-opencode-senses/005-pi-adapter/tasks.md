---
title: "Tasks: sk-vision 005 pi adapter"
description: "Implementation tasks for authoring the native Pi vision extension and symlink."
trigger_phrases:
  - "sk-vision pi tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/005-pi-adapter"
    last_updated_at: "2026-08-16T07:10:00.000Z"
    last_updated_by: "cursor-grok"
    recent_action: "Bound tasks to ln -s, factory skeleton, and dry factory."
    next_safe_action: "Wait for 003 core; then execute T001."
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-005-pi-20260815"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: sk-vision 005 pi adapter

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
| TASK-SCOPE | Stay within Pi adapter surface |
| TASK-VERIFY | Verify relative symlink resolution |
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

- [ ] T001 Create `.opencode/skills/sk-vision/pi/` directory
- [ ] T002 Inspect `.pi/extensions/` and verify existing extension conventions
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Author `.opencode/skills/sk-vision/pi/sk-vision.ts` from spec.md skeleton: function default export, 13 `pi.registerTool` names, `client.close()` on shutdown. Invalid export fail-closes Pi.
- [ ] T004 From repo root: `ln -s ../../.opencode/skills/sk-vision/pi/sk-vision.ts .pi/extensions/sk-vision.ts` (analog: git-preflight-advisory.ts). No absolute path.
- [ ] T005 [P] Update `.pi/extensions/README.md` with owner path `../../.opencode/skills/sk-vision/pi/sk-vision.ts` and the 13 tool names
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 Confirm `test -L .pi/extensions/sk-vision.ts` and `readlink` equals `../../.opencode/skills/sk-vision/pi/sk-vision.ts`
- [ ] T007 Confirm `pi.registerTool` for the 13 dump `sk_vision_*` names; no `sk_vision_query`
- [ ] T008 Dry factory: `pi --offline --approve` starts without extension fail-closed
- [ ] T009 Record bounded `input.images` 2s grace, or record the unproven-paste gap
- [ ] T010 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/sk-vision/001-sk-vision-fork-of-opencode-senses/005-pi-adapter --strict`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All Phase 1-3 tasks marked completed with evidence.
- [ ] `.pi/extensions/sk-vision.ts` resolves and registers tools.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md`
- Plan: `plan.md`
- Checklist: `checklist.md`
<!-- /ANCHOR:cross-refs -->
