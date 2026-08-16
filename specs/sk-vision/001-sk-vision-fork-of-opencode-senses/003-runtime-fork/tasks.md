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
    last_updated_at: "2026-08-16T07:10:00.000Z"
    last_updated_by: "cursor-grok"
    recent_action: "Bound tasks to spec.md copy, rebrand, and GPU steps."
    next_safe_action: "Wait for 002; then execute T001-T002 copy pack."
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

- [ ] T001 Create `.opencode/skills/sk-vision/vision-runtime/` only after 002 Class S gate is clean. Stop if 002 is still Planned.
- [ ] T002 Copy only the in-scope dump files using the `cp` list in spec.md Step 1. Do not copy `PLAN.md`, `.github/`, or dump `opencode.json`. Do not edit `../context/`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Rebrand env, cache, and stderr prefixes using spec.md Step 2 longest-token-first table. Skip LICENSE for bulk replace.
- [ ] T004 Rebrand the 13 tool keys to `sk_vision_*` and `<SENSES>` to `<SK-VISION>`. Do not invent `sk_vision_query`.
- [ ] T005 [P] Set `package.json` `"name"` to `sk-vision` (not `@opencode-ai/sk-vision`, not `opencode-senses`)
- [ ] T006 [P] Keep `Copyright (c) 2026 Adarsh Gourab Mahalik` and add this project's modification notice
- [ ] T007 `cd .opencode/skills/sk-vision/vision-runtime && bun install && bun run build` then `test -f dist/plugin.js` (or document a `tsc` substitute)
- [ ] T008 [P] Run copied unit tests after rebrand (`bun test`). Default model stays `moondream2`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Run `rg -n 'SENSES_|opencode-senses|~/.cache/opencode-senses|<SENSES|senses_' .opencode/skills/sk-vision/vision-runtime` (LICENSE exception only)
- [ ] T010 Optional GPU smoke: NDJSON `load` then `status` (spec.md Step 5), or SKIP with hardware note. `ping` is not the smoke.
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
