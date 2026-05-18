---
title: "Tasks: Deep Research Issues [template:level_2/tasks.md]"
description: "Completed task ledger for the 10-iteration deep research synthesis packet."
trigger_phrases:
  - "deep research tasks"
  - "iteration synthesis tasks"
  - "research backlog tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/005-code-graph/011-real-world-usefulness-test/003-deep-research-issues"
    last_updated_at: "2026-05-06T05:27:17Z"
    last_updated_by: "cli-codex"
    recent_action: "Marked all iteration, synthesis, and framing-correction tasks complete"
    next_safe_action: "Use the corrected synthesis backlog to open remediation implementation work"
    blockers: []
    key_files:
      - "research/research.md"
      - "research/resource-map.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:3333333333333333333333333333333333333333333333333333333333333333"
      session_id: "cli-codex-synthesis-003-tasks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Deep Research Issues

<!-- SPECKIT_LEVEL: 2 -->

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

- [x] T001 Read deep research charter (`research/deep-research-strategy.md`)
- [x] T002 Read deep research config (`research/deep-research-config.json`)
- [x] T003 [P] Read delta records (`research/deltas/iter-001.jsonl` through `iter-010.jsonl`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Synthesize iteration 001 default scope policy findings (`research/iterations/iteration-001.md`) — F-001 later marked **[CLOSED — DESIGN-INTENT]**
- [x] T005 Synthesize iteration 002 env/query-readiness verification (`research/iterations/iteration-002.md`)
- [x] T006 Synthesize iteration 003 drift detector trace (`research/iterations/iteration-003.md`)
- [x] T007 Synthesize iteration 004 index-wipe regression (`research/iterations/iteration-004.md`)
- [x] T008 Synthesize iteration 005 tree-sitter parser crash analysis (`research/iterations/iteration-005.md`)
- [x] T009 Synthesize iteration 006 hook payload/runtime docs analysis (`research/iterations/iteration-006.md`)
- [x] T010 Synthesize iteration 007 advisor staleness analysis (`research/iterations/iteration-007.md`)
- [x] T011 Synthesize iteration 008 CocoIndex/code graph seed contract analysis (`research/iterations/iteration-008.md`)
- [x] T012 Synthesize iteration 009 readiness auto-rescan analysis (`research/iterations/iteration-009.md`)
- [x] T013 Synthesize iteration 010 verify/test coverage analysis (`research/iterations/iteration-010.md`)
- [x] T014 Write deduplicated final research report (`research/research.md`)
- [x] T015 Write resource map (`research/resource-map.md`)
- [x] T016 Write root planning artifacts (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`)
- [x] T017 Write metadata and summary artifacts (`description.json`, `graph-metadata.json`, `implementation-summary.md`, `decision-record.md`)
- [x] T018 Update parent metadata (`../graph-metadata.json`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T019 Verify required research report sections
- [x] T020 Verify checklist gates cite evidence
- [x] T021 Run strict spec validation
- [x] T022 Collect line counts for output status
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: User Framing Correction

- [x] T023 Reclassify F-001 from P0 to **[CLOSED — DESIGN-INTENT]** (`research/research.md`)
- [x] T024 Reclassify F-004 and F-005 from P1 to **[MAINTAINER-ONLY P2]** (`research/research.md`)
- [x] T025 Add ADR-004 documenting default-scope design intent (`decision-record.md`)
- [x] T026 Replace new-user env recommendation with default/no-env and maintainer-mode snippets (`research/research.md`)
- [x] T027 Update summary, resource map, and metadata language to remove the "default scope is broken" framing
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Synthesis**: See `research/research.md`
- **Resource map**: See `research/resource-map.md`
<!-- /ANCHOR:cross-refs -->
