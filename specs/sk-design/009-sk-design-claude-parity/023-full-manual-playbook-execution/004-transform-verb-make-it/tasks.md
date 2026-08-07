---
title: "Tasks: Phase 004 - Transform Verb make it Wave"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "phase 004 tasks"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/004-transform-verb-make-it"
    last_updated_at: "2026-07-07T17:10:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "All implementation tasks completed"
    next_safe_action: "Write checklist.md and implementation-summary.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "wave-004-transform-verb-make-it"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Phase 004 - Transform Verb make it Wave

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

- [x] T001 Read `make-it-interface.md` and `should-it-be-audit.md` in full to capture exact prompts and Pass/Fail Criteria
- [x] T002 Confirm target folder `004-transform-verb-make-it` empty and ready to write into
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 [P] Advisor probe TV-001-V1 (`Make it bolder without changing the product copy.`): no match >= 0.8 (`[]`)
- [x] T004 [P] Advisor probe TV-001-V2 (`Make it quieter while keeping the same layout.`): `sk-design` 0.82, uncertainty 0.18
- [x] T005 [P] Advisor probe TV-001-V3 (`Make it distill the visual hierarchy down to fewer competing elements.`): `sk-design` 0.8368, uncertainty 0.12
- [x] T006 [P] Advisor probe TV-001-V4 (`Make it delight users with one memorable interface detail.`): no match >= 0.8 (`[]`)
- [x] T007 [P] Advisor probe TV-002-V1 (`Should it be bolder, or is the current hierarchy already strong enough?`): `sk-design` 0.82, uncertainty 0.22
- [x] T008 Real dispatch TV-001-V1; discovered unintended `README.md` edit via `apply_patch`
- [x] T009 `git diff -- README.md` confirmed the edit matched the dispatch's own tool call; `git restore -- README.md`; re-confirmed clean
- [x] T010 Real dispatch TV-001-V2; parsed resolved mode `interface` + `foundations` constraint, resource loads confirmed, no file mutation
- [x] T011 Real dispatch TV-001-V3; parsed resolved mode `foundations` primary ("a light interface pass"), no file mutation
- [x] T012 Real dispatch TV-001-V4; parsed resolved mode `interface` primary + `foundations` support, resource loads confirmed, no file mutation
- [x] T013 Real dispatch TV-002-V1; parsed resolved mode `audit`, all 5 design-audit resources cited, no file mutation
- [x] T014 Grade all 5 dispatches against their scenario file's own Pass/Fail Criteria, citing the specific line each time
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Write `dispatch-log.md` with one evidence row per dispatch
- [x] T016 Write this phase's own `implementation-summary.md`
- [x] T017 Run `generate-description.js`, `backfill-graph-metadata.js`, `validate.sh --strict` and fix anything that fails
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] All 5 assigned dispatches graded with evidence-backed verdicts, and the one real repo side-effect confirmed reverted
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Dispatch Evidence**: See `dispatch-log.md`
- **Phase Parent**: `../spec.md`
<!-- /ANCHOR:cross-refs -->
