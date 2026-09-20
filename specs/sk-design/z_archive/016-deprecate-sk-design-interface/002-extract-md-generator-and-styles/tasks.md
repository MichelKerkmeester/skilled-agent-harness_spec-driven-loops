---
title: "Tasks: Extract md-generator and styles to a standalone skill root"
description: "Task breakdown for the extraction move phase."
trigger_phrases:
  - "extract md-generator tasks"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/016-deprecate-sk-design-interface/002-extract-md-generator-and-styles"
    last_updated_at: "2026-08-19T05:04:07Z"
    last_updated_by: "spec-author"
    recent_action: "Executed the two git mv moves; 7,932 clean renames"
    next_safe_action: "Author + execute phase 003 rewire and standalone metadata"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design-md-generator/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Tasks: Extract md-generator and styles to a standalone skill root

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 `git mv sk-design/sk-design-md-generator → sk-design-md-generator` — moved (120 tracked).
- [x] T002 `git mv sk-design/styles → sk-design-md-generator/styles` — moved (7,812 tracked).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 New paths exist, old gone — `test -e` on `SKILL.md` + `styles/lib/paths.mjs` pass; `test ! -e` on both old paths pass.
- [x] T004 Rename is clean — `git status` shows 7,932 `R` entries (120 + 7,812); zero tracked files left at old paths.
- [x] T005 Ignored build/corpus dirs travelled — `backend/node_modules` (72M), `backend/dist`, `styles/database` all present at the new root.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 No out-of-scope change — `git status` diff vs baseline shows only the two-subtree renames + this packet; remaining entries are pre-existing environmental churn (other-session/skill-install), not this move.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] Standalone tree reachable at `.opencode/skills/sk-design-md-generator/**`
- [x] Rename conserved tracked count (120 + 7,812)
- [x] `validate.sh --strict` exits 0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
