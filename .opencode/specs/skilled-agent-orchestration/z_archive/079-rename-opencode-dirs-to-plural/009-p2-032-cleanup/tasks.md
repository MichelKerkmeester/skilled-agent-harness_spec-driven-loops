---
title: "Tasks: P2-032 strategy-doc cleanup [template:level_1/tasks.md]"
description: "Two-edit task list closing the cosmetic strategy-doc drift from the plural-rename remediation cycle."
trigger_phrases:
  - "P2-032 tasks"
  - "096/009 tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/009-p2-032-cleanup"
    last_updated_at: "2026-05-08T20:50:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Tasks authored alongside scaffolded packet"
    next_safe_action: "Execute T001 → T004 sequentially"
    blockers: []
    key_files:
      - "specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/007-track-rereview/review/deep-review-strategy.md"
      - "specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/008-remediation/implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "p2-032-cleanup-2026-05-08"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: P2-032 strategy-doc cleanup

<!-- SPECKIT_LEVEL: 1 -->
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

- [x] T001 Scaffold packet directory and 6 spec docs (`009-p2-032-cleanup/`).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Strip three `aliases.ts` references and update count "6 surfaces" → "5 surfaces" in `007-track-rereview/review/deep-review-strategy.md` (lines ~30, 33, 41, 57, 100). Preserve iter-narrative mentions on lines 119, 130, 163, 164, 226–229 as audit trail.
- [x] T003 Clear `_memory.continuity.blockers` entry for P2-032 in `008-remediation/implementation-summary.md`. Update `recent_action`, Metadata "Findings resolved" row (5/6 → 6/6), `## P2-032 — Deferred` section header (→ "Closed via 096/009"), Decision table row, Limitations narrative, Summary paragraph, and Followups list.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T004 Confirm `grep -n 'aliases\.ts' 007-track-rereview/review/deep-review-strategy.md | grep -i '101 surface\|advisor alias for'` returns 0 hits.
- [ ] T005 Confirm `grep 'P2-032' 008-remediation/implementation-summary.md` shows no `blockers:` or `Deferred:` listing entries (only `Closed via 096/009` references remain).
- [ ] T006 `bash validate.sh 008-remediation --strict` exits 0.
- [ ] T007 `bash validate.sh 009-p2-032-cleanup --strict` exits 0.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- All seven tasks `[x]`.
- Both strict-validate runs exit 0.
- `_memory.continuity.completion_pct` advanced to 100 in `009-p2-032-cleanup/implementation-summary.md`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Predecessor**: `008-remediation/implementation-summary.md` (the deferral originated here).
- **Target doc**: `007-track-rereview/review/deep-review-strategy.md` (the false claim lived here).
- **Audit trail**: Iter-1 review notes at lines 119, 130, 163, 164, 226–229 of the strategy doc — preserved unchanged.
<!-- /ANCHOR:cross-refs -->
