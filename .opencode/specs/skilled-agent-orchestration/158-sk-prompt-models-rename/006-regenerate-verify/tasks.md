---
title: "Tasks: Phase 6: regenerate-verify"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "sk-prompt-models regenerate verify tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/158-sk-prompt-models-rename/006-regenerate-verify"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase complete"
    next_safe_action: "Phase complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session/006-regenerate-verify"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 6: regenerate-verify

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

- [x] T001 Regenerate advisor: `skill_advisor.py --force-refresh` + `skill_graph_compiler.py --export-json`
- [x] T002 Regenerate spec-memory (`memory_index_scan`) + the renamed packet metadata (`generate-description.js` + `backfill-graph-metadata.js`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Run card-sync guard → exit 0
- [x] T004 Run `validate.sh --strict --recursive` on the 158 packet → 0 errors
- [x] T005 [P] Run the secret-scrubber + model-benchmark vitest suites → pass
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 `rg -c "sk-prompt-small-model"` = 0 live hits (list any deliberate history-care lines)
- [x] T007 Advisor routing probe returns `sk-prompt-models`; small-model smoke resolves its profile under the new path
- [x] T008 Write implementation-summary.md; reconcile parent phase map + continuity
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Zero live old-name refs; all gates green; advisor routes the new name
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
