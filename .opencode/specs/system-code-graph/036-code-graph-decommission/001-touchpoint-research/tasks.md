---
title: "Tasks: Phase 1: touchpoint-research"
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
    packet_pointer: "system-code-graph/036-code-graph-decommission/001-touchpoint-research"
    last_updated_at: "2026-07-27T16:33:53Z"
    last_updated_by: "claude-code"
    recent_action: "Scaffolded the decommission phase child"
    next_safe_action: "Populate requirements from the touchpoint research synthesis"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-036-001-touchpoint-research"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1: touchpoint-research

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

- [x] T001 Confirm `cli-codex` and `cli-cursor` executors wired in `runtime/lib/deep-loop/executor-config.ts`
- [x] T002 Confirm `cli-devin` executor wiring (`system-deep-loop/041`) landed for the GLM lane
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 [P] Run lane sol: cli-codex gpt-5.6-sol high, 10 iterations (`research/lineages/sol/**`)
- [x] T004 [P] Run lane glm: cli-devin glm-5-2 free, 5 iterations (`research/lineages/glm/**`)
- [x] T005 [P] Run lane grok: cli-cursor cursor-grok-4.5-high, 5 iterations (`research/lineages/grok/**`)
- [x] T006 Merge three lineages into `research/research.md` with cited touchpoint inventory and ordering graph
- [x] T007 Record refuted-claims ledger (`.pi/mcp.json` not a fourth registration; no Pi freshness hook at `.pi/extensions/`)
- [x] T008 Assign every inventory entry to exactly one downstream phase 003-014 — evidence: `scratch/closeout-facts.md`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Post-research `rg --hidden --no-ignore` sweep finds no live-surface reference absent from the inventory
- [x] T010 Confirm confirmed touchpoints carry file:line citations distinct from inferred ones — evidence: `scratch/closeout-facts.md`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (sweep + refuted-claims ledger)
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
