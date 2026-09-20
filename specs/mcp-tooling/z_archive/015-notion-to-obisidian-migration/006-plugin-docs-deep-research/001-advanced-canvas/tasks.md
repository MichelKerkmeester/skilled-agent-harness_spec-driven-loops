---
title: "Tasks: Phase 006/001-advanced-canvas — Advanced Canvas reference-docs deep research"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "006 advanced-canvas research tasks"
  - "advanced canvas deep research tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-notion-to-obisidian-migration/006-plugin-docs-deep-research/001-advanced-canvas"
    last_updated_at: "2026-08-22T09:30:00Z"
    last_updated_by: "claude"
    recent_action: "Authored retrospective task list for the completed research run"
    next_safe_action: "Hand synthesis.md to phase 009 apply pass"
    blockers: []
    key_files:
      - "spec.md"
      - "synthesis.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-006-001-advanced-canvas"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 006/001-advanced-canvas — Advanced Canvas reference-docs deep research

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

- [ ] T001 Seed the plugin repository (`developer-mike/obsidian-advanced-canvas`), the JSON-Canvas spec, and the installed `main.js` v6.5.4
- [ ] T002 [P] Enumerate the research sub-questions in `spec.md` §3 (cross-portal edge shape, persistent keys, workflows/gotchas)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Run the 4-iteration GLM-5.2 High loop via cli-devin, early convergence allowed
- [ ] T004 Resolve the cross-portal (interdimensional) edge serialization `VERIFY` flag against spec + typings + `main.js`
- [ ] T005 Confirm the extended `.canvas` JSON persistent keys (`zIndex`, `interdimensionalEdges`, `collapsedData`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 Fresh-reviewer cross-check of `research.md` against the live shipped docs (4 reference files + feature-catalog entry)
- [ ] T007 Write the prioritized P0/P1/P2 edit table in `synthesis.md`, citing every row to a research finding
- [ ] T008 `validate.sh` this phase; refresh continuity
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] Cross-portal edge `VERIFY` flag resolved with citations
- [ ] `synthesis.md` hands phase 009 a decided, prioritized edit table
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: See `research/research.md`
- **Synthesis**: See `synthesis.md`
- **Next phase**: `../002-claudian/`
<!-- /ANCHOR:cross-refs -->
