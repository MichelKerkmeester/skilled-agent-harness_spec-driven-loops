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
    recent_action: "Task list scaffolded; not started"
    next_safe_action: "Begin T001 (regenerate indexes)"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session/006-regenerate-verify"
      parent_session_id: null
    completion_pct: 0
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

- [ ] T001 Regenerate advisor: `skill_advisor.py --force-refresh` + `skill_graph_compiler.py --export-json`
- [ ] T002 Regenerate spec-memory (`memory_index_scan`) + the renamed packet metadata (`generate-description.js` + `backfill-graph-metadata.js`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Run card-sync guard → exit 0
- [ ] T004 Run `validate.sh --strict --recursive` on the 158 packet → 0 errors
- [ ] T005 [P] Run the secret-scrubber + model-benchmark vitest suites → pass
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 `rg -c "sk-prompt-small-model"` = 0 live hits (list any deliberate history-care lines)
- [ ] T007 Advisor routing probe returns `sk-prompt-models`; small-model smoke resolves its profile under the new path
- [ ] T008 Write implementation-summary.md; reconcile parent phase map + continuity
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Zero live old-name refs; all gates green; advisor routes the new name
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
