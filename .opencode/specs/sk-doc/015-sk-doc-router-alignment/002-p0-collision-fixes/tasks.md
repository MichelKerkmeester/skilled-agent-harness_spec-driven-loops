---
title: "Tasks: P0 Collision Fixes"
description: "Completed source edits and routing replay for the three quality-action collision fixes."
trigger_phrases:
  - "quality collision tasks"
  - "readme flowchart routing tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/015-sk-doc-router-alignment/002-p0-collision-fixes"
    last_updated_at: "2026-07-13T06:50:00Z"
    last_updated_by: "opencode"
    recent_action: "Completed P0 collision edits and replay"
    next_safe_action: "Reference phase 003"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/002-p0-collision-fixes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: P0 Collision Fixes

<!-- SPECKIT_LEVEL: 3 -->

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

- [x] T001 Confirm phase-001 P0 map and source lines [EVIDENCE: phase-001 plan]
- [x] T002 Read all three packet sections before editing [EVIDENCE: source audit]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Apply P0-01 to `create-readme/SKILL.md` [EVIDENCE: source diff]
- [x] T004 Apply P0-02 to `create-flowchart/SKILL.md` [EVIDENCE: source diff]
- [x] T005 Apply P0-03 to `create-quality-control/SKILL.md` [EVIDENCE: source diff]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Replay both quality queries [EVIDENCE: final replay]
- [x] T007 Replay both creator coverage queries [EVIDENCE: final replay]
- [x] T008 Run affected package checks [EVIDENCE: package checks PASS]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 tasks marked complete
- [x] No blocked P0 tasks remain
- [x] Four-query replay matches expected ownership
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
