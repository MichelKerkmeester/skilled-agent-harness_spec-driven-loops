---
title: "Tasks: Phase 2: decommission-decision-record"
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
    packet_pointer: "system-code-graph/036-code-graph-decommission/002-decommission-decision-record"
    last_updated_at: "2026-07-28T04:51:16Z"
    last_updated_by: "claude-code"
    recent_action: "Scaffolded the decommission phase child"
    next_safe_action: "Populate requirements from the touchpoint research synthesis"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-036-002-decommission-decision-record"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 2: decommission-decision-record

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

- [x] T001 Confirm phase 001 synthesis (`research/research.md`) exists before drafting
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Draft ADR-001: accept permanent loss of the eight `code_graph_*` tool ids (`decision-record.md`)
- [x] T003 Draft ADR-002: replacement routing (Grep/Glob for code, `memory_search` for spec docs)
- [x] T004 Draft ADR-003: per-consumer disposition table (remove vs fallback) — evidence: `scratch/closeout-facts.md`
- [x] T005 Draft ADR-004: archival boundary (`.opencode/specs/**`, changelogs, benchmark reports)
- [x] T006 Draft ADR-005: rollback procedure with exact steps from git history — evidence: `scratch/closeout-facts.md`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Ratify all five ADRs as Accepted — evidence: `scratch/closeout-facts.md`
- [x] T008 Confirm rollback procedure is specific enough to execute without further research — evidence: `scratch/closeout-facts.md`
- [x] T009 Confirm no requirement in phases 003-014 contradicts a recorded disposition — evidence: `scratch/closeout-facts.md`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (ADR cross-reference check)
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
