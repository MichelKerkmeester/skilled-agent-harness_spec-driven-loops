---
title: "Tasks: Wave 010 - md-generator Serial Pipeline Dispatches"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "wave 010 tasks"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/010-md-generator-serial-pipeline"
    last_updated_at: "2026-07-07T18:20:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "All dispatch tasks completed"
    next_safe_action: "Write checklist.md and implementation-summary.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "wave-010-md-generator-serial"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Wave 010 - md-generator Serial Pipeline Dispatches

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

**Note**: No task in Phase 2 of this wave is `[P]` — every dispatch in this wave can write real files, so all 9 ran strictly one at a time by mandate, unlike the sibling waves.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read `01--mode-routing/md-generator-mode.md`, `02--advisor-integration/positive-design-controls.md`, `06--parity-behavior/md-generator-preservation-confirmation.md` in full
- [x] T002 Read `04--md-generator-pipeline/extract-write-validate.md`, `validate-design-md.md`, `design-fidelity-check.md`, `brief-only-authoring-boundary.md` in full
- [x] T003 Read `07--fallback-and-resilience/no-card-matches-fallback.md`, `direct-fallback-without-subagents.md` in full
- [x] T004 Read `design-md-generator/SKILL.md`'s Smart Router Pseudocode, `INTENT_SIGNALS`, `RESOURCE_MAP`, and Resource Loading Levels table to author `FR-001-md-generator`'s prompt cleanly
- [x] T005 Read `../../022-benchmark-rerun-and-coverage-fill/spec.md` and `../009-fallback-and-hub-intake/` as the Level 2 structural + strict-serial-recipe template
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 `MR-005`: advisor probe, real dispatch, transcript to `/tmp/skd-MR005-response.jsonl`, mandatory `git status --porcelain` check, grade
- [x] T007 `AI-001-P5`: advisor probe, real dispatch (retried at 580s timeout after a 300s timeout), transcript to `/tmp/skd-AI001-P5-response.jsonl`, mandatory `git status --porcelain` check, grade
- [x] T008 `PB-003`: advisor probe, real dispatch, transcript to `/tmp/skd-PB003-response.jsonl`, grade
- [x] T009 `MG-001`: advisor probe, real dispatch, transcript to `/tmp/skd-MG001-response.jsonl`, grade (produces fixture pair)
- [x] T010 Coordinator checkpoint: verify `MG-001`'s real output paths, `mkdir`+`cp` into `/tmp/skd-MG002/` and `/tmp/skd-MG003/`
- [x] T011 `MG-002`: advisor probe, real dispatch, transcript to `/tmp/skd-MG002-response.jsonl`, grade
- [x] T012 `MG-003`: advisor probe, real dispatch, transcript to `/tmp/skd-MG003-response.jsonl`, grade
- [x] T013 `MG-004`: advisor probe, real dispatch (negative control), transcript to `/tmp/skd-MG004-response.jsonl`, confirm no file written under `/tmp/skd-MG004*/` or elsewhere, grade
- [x] T014 `FR-001-md-generator`: advisor probe, authored-prompt real dispatch, transcript to `/tmp/skd-FR001-md-generator-response.jsonl`, grade
- [x] T015 `FR-002-md-generator`: advisor probe, lightly-authored-prompt real dispatch, transcript to `/tmp/skd-FR002-md-generator-response.jsonl`, grade
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T016 Write `dispatch-log.md` (one row per dispatch: dispatch_id, scenario_id, exact prompt used, advisor top-1/confidence, resolved mode/packet/resources, verdict, rationale citing the criterion)
- [x] T017 Write `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`
- [x] T018 Generate `description.json` via `generate-description.js`
- [x] T019 Generate `graph-metadata.json` via `backfill-graph-metadata.js`
- [x] T020 Run `validate.sh --strict` and fix anything that fails
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] All 9 dispatches ran strictly one at a time, in the mandated order, with a captured transcript and a criteria-cited verdict
- [x] Both required `git status --porcelain` sandbox-escape checks ran and their output is recorded
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Dispatch Log**: See `dispatch-log.md`
- **Sibling waves**: `../008-parity-proof-and-fallback-start/`, `../009-fallback-and-hub-intake/`
<!-- /ANCHOR:cross-refs -->
