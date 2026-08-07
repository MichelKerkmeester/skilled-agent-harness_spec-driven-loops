---
title: "Tasks: skills index README"
description: "Task list for the skills index README rewrite via catalog-from-children and dual-draft."
trigger_phrases:
  - "skills index readme tasks"
importance_tier: "normal"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "sk-doc/014-skill-readme-standardization/024-skills-index-readme"
    last_updated_at: "2026-06-07T19:05:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Shipped skills index README; packet 135 complete 24 of 24"
    next_safe_action: "Packet 135 complete; no further phases"
    blockers: []
    key_files:
      - ".opencode/skills/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "readme-std-135-024"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: skills index README

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

- [x] T001 Collect the 22 skill one-liners and confirm the five families
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Build context-report.md catalog and the stale-fact list
- [x] T003 [P] Dual-draft the index (DeepSeek + MiMo)
- [x] T004 Merge, fix stale facts, verify every skill link; write `.opencode/skills/README.md`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 `validate_document.py --type readme` passes (0 issues)
- [x] T006 HVR prose scan clean; every skill link resolves; 22-folder catalog correct
- [x] T007 `validate.sh --strict` on the phase
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Index validated
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
