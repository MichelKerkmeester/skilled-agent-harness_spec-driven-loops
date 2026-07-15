---
title: "Tasks: Kept-Off Flag Resolution"
description: "Task list for the final flip-or-delete reckoning and the documentation reconciliation to keep 5 and delete 10."
trigger_phrases:
  - "028 flag resolution tasks"
  - "028 flip or delete tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/001-speckit-memory/022-kept-off-flag-resolution"
    last_updated_at: "2026-07-04T17:51:01.130Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Created the flag-resolution tasks"
    next_safe_action: "Run strict validation on the 028 root"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-20-tasks-028-022-kept-off-flag-resolution"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Kept-Off Flag Resolution

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

- [x] T001 Enumerate every 028 default-off flag and its measured signal from the criterion-4 benchmark and the real-world simulation.
- [x] T002 Confirm the code removal of the ten deleted flags is committed, so the docs describe a reached state.
- [x] T003 Confirm the per-flag fresh-Opus decisions and the three deep-review rounds are recorded.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Reconcile `feature-flags.md` to the five kept switches with an at-the-end record of the ten deleted.
- [x] T005 [P] Replace the `keep-off-flag-roadmap.md` path-to-useful framing with the keep-or-delete resolution table, one-line deciding evidence each.
- [x] T006 [P] Record the keep 5 and delete 10 tally in `benchmark-status.md`.
- [x] T007 [P] Reconcile `before-vs-after.md` intro, gated-frontier section and current state to the final reality.
- [x] T008 Add the deleted-superseded-by-measurement note to each affected decision-record: seeded-ppr, bitemporal-window, edge-presence-currentness, procedural-reliability, agentic-recall, semantic-edge-layer, sleeptime-consolidation and the advisor outcome-weighted-ranking-followon.
- [x] T009 Update the changelog milestone leaf and root and the timeline Section G to keep 5 and delete 10.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Confirm every disposition traces to a measured number or a structural fact, with the no-harm keeps kept honest.
- [x] T011 Run an HVR scan across the reconciled surfaces for em-dashes, prose semicolons and Oxford commas.
- [x] T012 Run `validate.sh --strict` for the 028 root and this child.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Every kept and deleted flag traces to its deciding evidence.
- [x] Strict validation exits 0 for the 028 root and this child.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Parent**: See `../spec.md`
- **Final tally**: See `../benchmark-status.md`
- **Resolution table**: See `../keep-off-flag-roadmap.md`
<!-- /ANCHOR:cross-refs -->
