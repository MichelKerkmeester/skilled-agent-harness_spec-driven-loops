---
title: "Tasks: Wave 005 - Transform Verb 'should it be' Framing"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "wave 005 tasks"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/005-transform-verb-should-it-be"
    last_updated_at: "2026-07-07T17:15:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "All implementation tasks completed"
    next_safe_action: "Write checklist.md and implementation-summary.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "wave-005-should-it-be"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Wave 005 - Transform Verb "should it be" Framing

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

- [x] T001 Read `should-it-be-audit.md`, `clarify-alias-only.md`, `foundations-excluded-aliases.md` in full for exact prompts and Pass/Fail Criteria
- [x] T002 Checked sibling wave folders (`001`-`004`, `006`-`007`) for existing content — all empty, no collision
- [x] T003 Prepared `/tmp` output paths for transcripts
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Advisor probe + live dispatch for TV-002-V2 (`Should it be quieter, or would that reduce conversion clarity?`) -> saved `/tmp/skd-TV002-V2-response.jsonl`
- [x] T005 Advisor probe + live dispatch for TV-002-V3 (`Should it be distill the interface to fewer elements before launch?`) -> saved `/tmp/skd-TV002-V3-response.jsonl`
- [x] T006 Advisor probe + live dispatch for TV-002-V4 (`Should it be delight users more, or would that feel gratuitous?`) -> saved `/tmp/skd-TV002-V4-response.jsonl`
- [x] T007 Advisor probe + live dispatch for TV-003 (`Clarify this hero section's visual hierarchy without changing its content.`, with NO_TARGET_CLAUSE) -> saved `/tmp/skd-TV003-response.jsonl`
- [x] T008 Advisor probe + live dispatch for TV-004 (`Make it typeset and colorize, but do not create a full token system.`) -> saved `/tmp/skd-TV004-response.jsonl`
- [x] T009 Parsed all 5 transcripts for `skill` tool calls (resolved mode/packet) and final `text` (response nature)
- [x] T010 Graded each dispatch PASS/FAIL against its scenario file's own Pass/Fail Criteria, citing the specific line
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Authored `dispatch-log.md` with all 5 rows, summary counts, and the probe-vs-live cross-cutting finding
- [x] T012 Authored `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` mirroring `../022-benchmark-rerun-and-coverage-fill/`'s Level 2 shape
- [x] T013 Ran `generate-description.js` and `backfill-graph-metadata.js` for this folder
- [x] T014 Ran `validate.sh --strict` on this folder and confirmed Errors:0
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] All 5 assigned dispatches have a recorded advisor-probe result, saved transcript, and cited PASS/FAIL verdict
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Dispatch Evidence**: See `dispatch-log.md`
- **Parent packet**: `../` (`023-full-manual-playbook-execution`)
<!-- /ANCHOR:cross-refs -->
