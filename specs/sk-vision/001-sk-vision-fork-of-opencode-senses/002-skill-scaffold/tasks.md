---
title: "Tasks: sk-vision 002 skill scaffold"
description: "Implementation tasks for scaffolding the standalone Class S sk-vision skill root and manifests."
trigger_phrases:
  - "sk-vision scaffold tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/002-skill-scaffold"
    last_updated_at: "2026-08-15T17:20:00.000Z"
    last_updated_by: "cursor-grok"
    recent_action: "Corrected Class S generator tasks."
    next_safe_action: "Execute T001 to create skill structure."
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-002-scaffold-20260815"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: sk-vision 002 skill scaffold

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
| TASK-SCOPE | Stay within `.opencode/skills/sk-vision/` scaffold; no runtime code copy |
| TASK-VERIFY | Run `ci-skill-root-metadata.cjs` after metadata edits |
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

- [ ] T001 Create skill root directory structure (`.opencode/skills/sk-vision/`, `.opencode/skills/sk-vision/references/`)
- [ ] T002 Verify absence of hub JSON metadata files in skill root
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Author `.opencode/skills/sk-vision/SKILL.md` with Class S frontmatter and vision triggers
- [ ] T004 [P] Author `.opencode/skills/sk-vision/graph-metadata.json` with standalone skill schema
- [ ] T005 [P] Author `.opencode/skills/sk-vision/leaf-manifest.config.json`
- [ ] T006 Generate `leaf-manifest.json` and `leaf-aliases.json` with `node .opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs --fix`
- [ ] T007 [P] Author `.opencode/skills/sk-vision/README.md`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Confirm hub JSON absent: `description.json`, `mode-registry.json`, `hub-router.json`, `command-metadata.json`
- [ ] T009 Run `python3 .opencode/skills/sk-doc/sk-create-skill/scripts/package_skill.py .opencode/skills/sk-vision --check`
- [ ] T010 Confirm `vision-runtime/` is absent or empty of source
- [ ] T011 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/sk-vision/001-sk-vision-fork-of-opencode-senses/002-skill-scaffold --strict`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All Phase 1-3 tasks marked completed with evidence.
- [ ] Class S metadata checks clean without warnings.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md`
- Plan: `plan.md`
- Checklist: `checklist.md`
<!-- /ANCHOR:cross-refs -->
