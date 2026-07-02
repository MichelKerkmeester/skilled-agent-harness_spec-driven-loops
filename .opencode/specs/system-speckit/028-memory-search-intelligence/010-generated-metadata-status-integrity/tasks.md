---
title: "Tasks: Phase 10: generated-metadata-status-integrity"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "generated metadata status integrity tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/010-generated-metadata-status-integrity"
    last_updated_at: "2026-07-02T00:00:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "All 14 tasks complete and evidenced"
    next_safe_action: "Decide separately on bulk-correcting the 213-folder backlog"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/validation/generated-metadata-integrity.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "028-phase-010-status-integrity-20260702"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 10: generated-metadata-status-integrity

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

- [x] T001 Run the existing test suite touching graph-metadata-parser.ts/generated-metadata-integrity.ts, capture baseline output - 9 files, 99 tests, all passing
- [x] T002 Confirm deriveStatus is the sole producer of derived.status (rg inventory) - confirmed, single producer
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add `parseCompletionPct` helper (graph-metadata-parser.ts)
- [x] T004 Add `hasOpenTaskItems` helper (graph-metadata-parser.ts)
- [x] T005 Rewrite deriveStatus's `!checklistDoc` branch to gate on completion_pct + open tasks, with explicit null-completion_pct handling (graph-metadata-parser.ts:1215-1218)
- [x] T006 Add the new report-mode-default capability flag (capability-flags.ts)
- [x] T007 Add the cross-field status/completion-evidence validator check, wired through the new flag (generated-metadata-integrity.ts and the scripts/validation CLI bridge; orchestrator.ts deliberately NOT wired, see Known Limitations)
- [x] T008 Document the new flag in ENV_REFERENCE.md's feature flags reference table
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Add unit tests: unfilled scaffold no longer derives complete, null completion_pct no longer derives complete, real complete folder still derives complete, open-tasks folder derives in_progress - 4 new tests, all passing
- [x] T010 Add unit tests for the new validator check in both report and enforced mode - 5 new tests, all passing
- [x] T011 Run the targeted 9-file suite fresh, confirm zero regressions - 108/108 passing. The broader repo-wide 815-file suite was also started as an additional confirmation; killed after ~5 hours once its root cause (an unrelated `fileParallelism: false` serial-execution config, not a hang or a regression signal) was identified and the operator explicitly accepted the targeted evidence as sufficient.
- [x] T012 Manual validate.sh --strict smoke on real folders (found via a live repo-wide scan, e.g. `.opencode/specs/ai-systems/009-prompt-improver-interface-design`), confirm report-mode (no new hard failures) by default - confirmed, resolved.status="info"
- [x] T013 Manual smoke with the new flag explicitly enforced, confirm the same folders now produce a violation - confirmed, resolved.status="error", exit 1
- [x] T014 Update this phase's spec.md Status to Complete and write implementation-summary.md - done
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Fresh test suite run pasted as evidence, not cited from a prior run
- [x] Report-mode-by-default confirmed via manual smoke (REQ-004)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Finding source**: `../../deep-loops/032-goal-opencode-plugin/009-diagnostic-review/review-report.md` (D4-P0-001, D1-P1-001)
<!-- /ANCHOR:cross-refs -->
