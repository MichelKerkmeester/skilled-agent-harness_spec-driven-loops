---
title: "Tasks: Phase 7: skill-advisor-decoupling"
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
    packet_pointer: "system-code-graph/036-code-graph-decommission/007-skill-advisor-decoupling"
    last_updated_at: "2026-07-28T04:51:16Z"
    last_updated_by: "claude-code"
    recent_action: "Scaffolded the decommission phase child"
    next_safe_action: "Populate requirements from the touchpoint research synthesis"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-036-007-skill-advisor-decoupling"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 7: skill-advisor-decoupling

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

- [x] T001 Confirm phase 002 disposition for structural-search prompt routing — evidence: `scratch/closeout-facts.md`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Remove node, family membership, adjacency edges, and intent-signal block from `skill-graph.json`
- [x] T003 Correct the declared skill count from 12 to 11 — evidence: `scratch/closeout-facts.md`
- [x] T004 Strip the skill reference from the lexical scorer lane (`lanes/lexical.ts`)
- [x] T005 Strip the skill reference from the explicit scorer lane (`lanes/explicit.ts`)
- [x] T006 Strip the skill reference from the fusion scorer lane (`fusion.ts`)
- [x] T007 Strip the Python scorer (py-twin) in parity with the TS lanes — evidence: `scratch/closeout-facts.md`
- [x] T008 Delete the two latency benches that imported the removed package's internals (`bench/code-graph-*.bench.ts`)
- [x] T009 Reduce the tri-daemon drill to the two surviving daemons (`tri-daemon-drill.vitest.ts`)
- [x] T010 Drop corpora rows referencing the removed skill — evidence: `scratch/closeout-facts.md`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Rebuild advisor database cleanly with the corrected 11-skill roster (commit `5a2aab0d37`)
- [x] T012 Confirm a structural-search prompt returns no recommendation for the removed skill — evidence: `scratch/closeout-facts.md`
- [x] T013 Confirm no source-level import of the removed package remains — evidence: `scratch/closeout-facts.md`
- [x] T014 Confirm inbound edges from other skills are pruned (no dangling edges) — evidence: `scratch/closeout-facts.md`
- [x] T015 Confirm the reduced drill passes without the removed leg — evidence: `scratch/closeout-facts.md`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (routing check + drill + suite)
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
