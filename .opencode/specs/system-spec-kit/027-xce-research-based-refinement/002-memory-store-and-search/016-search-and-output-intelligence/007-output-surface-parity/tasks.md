---
title: "Tasks: Phase 7: output-surface-parity"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "name"
  - "template"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "027/002/017/007-output-surface-parity"
    last_updated_at: "2026-06-17T08:40:00Z"
    last_updated_by: "contract-engineer"
    recent_action: "Mandated similarity-only render + surface-parity clause; tasks superseded"
    next_safe_action: "Run live cross-model A/B render-consistency probe"
    blockers: []
    key_files:
      - ".opencode/commands/memory/search.md"
      - ".opencode/commands/memory/assets/search_presentation.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "system-speckit/027-017/007-output-surface-parity"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Which single metric governs rendered output? similarity, 0–1, two decimals, on every surface."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 7: output-surface-parity

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

- [x] T001 Identify the two render surfaces (search.md contract + search_presentation.txt asset) and the O1 layer to leave untouched
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Mandate `similarity` 0–1 / two-decimals as the sole rendered metric; ban `confidence`/percentage (both files)
- [x] T005 Name five mandatory core slots + extend the render self-check (search.md, search_presentation.txt)
- [x] T006 Add surface-parity clause + two named optional trailing fields (`requestQuality`, `citationPolicy`)
- [x] T007 Add the COSTAR register note to both files; §7 boundary entry in search.md
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Cross-file consistency grep: mandate + ban + slots + clause present in both files
- [x] T009 Edge case: a percentage-scaled value is divided by 100 before emit (79.44 -> 0.79)
- [x] T010 `implementation-summary.md` written (live A/B render-consistency probe is a documented follow-up)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
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

