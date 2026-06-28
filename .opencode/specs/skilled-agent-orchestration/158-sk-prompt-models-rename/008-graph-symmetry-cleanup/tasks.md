---
title: "Tasks: Phase 8: graph-symmetry-cleanup"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "graph symmetry cleanup tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/158-sk-prompt-models-rename/008-graph-symmetry-cleanup"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase complete"
    next_safe_action: "Phase complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session/008-graph-symmetry-cleanup"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 8: graph-symmetry-cleanup

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

- [x] T001 Enumerate the 5 symmetry errors (`skill_graph_compiler.py --validate-only`) + confirm whether the enhances weight-band is enforced
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 `sk-design/graph-metadata.json`: add prerequisite_for + sibling for mcp-figma and mcp-open-design
- [x] T003 `sk-code-review/graph-metadata.json`: add sibling sk-design
- [x] T004 If the weight-band is enforced, set `sk-prompt-models` enhances weight 0.8 → 0.7
- [x] T005 `skill_graph_compiler.py --validate-only` → 0 errors; then `--export-json` → exit 0
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 `skill_advisor.py --force-refresh`; routing probe surfaces sk-prompt-models
- [x] T007 Write implementation-summary.md and refresh continuity
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Compiler exports cleanly; routing intact
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
