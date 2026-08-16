---
title: "Tasks: sk-vision 003 runtime fork"
description: "Implementation tasks for forking, rebranding, and building the sk-vision vision runtime."
trigger_phrases:
  - "sk-vision runtime tasks"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/003-runtime-fork"
    last_updated_at: "2026-08-15T17:45:00.000Z"
    last_updated_by: "cursor-grok"
    recent_action: "Locked package name and GPU load/status tasks."
    next_safe_action: "Wait for 002; then execute T001 copy."
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-003-runtime-20260815"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: sk-vision 003 runtime fork

<!-- SPECKIT_LEVEL: 3 -->
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
5. No blocking issues in `decision-record.md`.
6. Previous session context reviewed when resuming.

### Execution Rules
| Rule | Description |
|------|-------------|
| TASK-SEQ | Complete tasks in dependency order |
| TASK-SCOPE | Stay within `vision-runtime/`; no host adapter creation in this child |
| TASK-VERIFY | Grep for `SENSES_` after rebranding edits |
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

- [ ] T001 Create runtime target directory `.opencode/skills/sk-vision/vision-runtime/`
- [ ] T002 Copy shipped v0.2.0 files from `../context/` into `vision-runtime/`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Rebrand environment variables, config keys, and paths from `SENSES_*` to `SK_VISION_*`
- [ ] T004 Rebrand tool keys to the 13 `sk_vision_*` dump names and `<SENSES ...>` tags to `<SK-VISION ...>`. Do not invent `sk_vision_query`.
- [ ] T005 [P] Set `package.json` name to `sk-vision` (not `@opencode-ai/sk-vision`, not `opencode-senses`)
- [ ] T006 [P] Update `LICENSE` retaining Adarsh Gourab Mahalik 2026 copyright and adding project notice
- [ ] T007 Execute build script to compile `dist/plugin.js`
- [ ] T008 [P] Update and execute unit tests for TypeScript and Python
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Run ripgrep audit across `vision-runtime/` to confirm zero residual `SENSES_` occurrences
- [ ] T010 Optional GPU smoke: JSON-RPC `load` then `status` on NVIDIA Ampere+ or Apple Silicon, or record SKIP with hardware note. `ping` is not the smoke.
- [ ] T011 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/sk-vision/001-sk-vision-fork-of-opencode-senses/003-runtime-fork --strict`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All Phase 1-3 tasks marked completed with evidence.
- [ ] `dist/plugin.js` exists and is ready for host adapters.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md`
- Plan: `plan.md`
- Checklist: `checklist.md`
- Decision Record: `decision-record.md`
<!-- /ANCHOR:cross-refs -->
