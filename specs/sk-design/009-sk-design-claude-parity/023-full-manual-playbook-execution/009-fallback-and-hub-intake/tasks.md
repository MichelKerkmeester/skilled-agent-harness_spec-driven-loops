---
title: "Tasks: Wave 009 - Fallback & Hub-Manager Intake Dispatches"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "wave 009 tasks"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/009-fallback-and-hub-intake"
    last_updated_at: "2026-07-07T17:30:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "All dispatch tasks completed"
    next_safe_action: "Write checklist.md and implementation-summary.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "wave-009-fallback-hub-intake"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Wave 009 - Fallback & Hub-Manager Intake Dispatches

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

- [x] T001 Read `07--fallback-and-resilience/no-card-matches-fallback.md` and `direct-fallback-without-subagents.md` in full
- [x] T002 Read `08--hub-manager-intake/context-first-intake.md`, `visible-plan-before-build.md`, `verifier-cadence-pause.md`, `design-mode-pairing-before-run.md` in full
- [x] T003 Read `../../022-benchmark-rerun-and-coverage-fill/spec.md` and `plan.md` as the Level 2 structural template
- [x] T004 Confirm wave-008 folder state (empty at time of writing, concurrent parallel execution) before authoring `FR-001-audit`'s prompt independently
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 `FR-001-audit`: advisor probe, author audit-mode narrow-advisory prompt (no exact prompt supplied by scenario file), real dispatch, transcript to `/tmp/skd-FR001-audit-response.jsonl`, grade
- [x] T006 `FR-002-motion`: advisor probe, real dispatch (exact scenario prompt), transcript to `/tmp/skd-FR002-motion-response.jsonl`, grade
- [x] T007 `HM-001`: advisor probe, real dispatch (exact scenario prompt, empty NO_TARGET_CLAUSE), transcript to `/tmp/skd-HM001-response.jsonl`, grade
- [x] T008 `HM-002`: advisor probe, real dispatch (exact scenario prompt, empty NO_TARGET_CLAUSE), transcript to `/tmp/skd-HM002-response.jsonl`, grade
- [x] T009 `HM-003`: advisor probe, real dispatch (exact scenario prompt, empty NO_TARGET_CLAUSE), transcript to `/tmp/skd-HM003-response.jsonl`, grade
- [x] T010 `HM-004`: advisor probe, real dispatch (exact scenario prompt, empty NO_TARGET_CLAUSE), transcript to `/tmp/skd-HM004-response.jsonl`, grade
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Write `dispatch-log.md` (one row per dispatch: dispatch_id, scenario_id, prompt used, advisor top-1/confidence, resolved mode/packet/resources, verdict, rationale)
- [x] T012 Write `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`
- [x] T013 Generate `description.json` via `generate-description.js`
- [x] T014 Generate `graph-metadata.json` via `backfill-graph-metadata.js`
- [x] T015 Run `validate.sh --strict` and fix anything that fails
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] All 6 dispatches have a captured transcript and a criteria-cited verdict
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Dispatch Log**: See `dispatch-log.md`
- **Sibling waves**: `../008-parity-proof-and-fallback-start/`, `../010-md-generator-serial-pipeline/`
<!-- /ANCHOR:cross-refs -->
