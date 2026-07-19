---
title: "Tasks: 027/004/002 Impact Analysis Library"
description: "Task scaffold for deterministic impact-analysis library implementation."
trigger_phrases:
  - "027 004 002 lib impl tasks"
  - "impact library tasks"
importance_tier: "important"
contextType: "task"
_memory:
  continuity:
    packet_pointer: "z_future/code-graph-and-cocoindex/003-code-graph-impact-analysis/002-lib-impl"
    last_updated_at: "2026-05-12T00:00:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Created Level 2 scaffold for 002-lib-impl"
    next_safe_action: "Implement this child phase when its dependencies are available"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-codex-2026-05-12-027-004-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: 027/004/002 Impact Analysis Library

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Read `001-contract` exported types. [15m]
- [ ] T002 Locate existing impact-mode and detect-changes helpers. [15m]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Create `mcp_server/code_graph/lib/code-graph-impact-analysis.ts`. [20m]
- [ ] T004 Implement file-node aggregation over all nodes for a file. [45m]
- [ ] T005 Implement fan-in, fan-out, hub centrality, coverage evidence, and edge confidence. [90m]
- [ ] T006 Implement deterministic normalizers and heuristic score formula. [45m]
- [ ] T007 Implement 3-hop traversal with explicit visited set. [45m]
- [ ] T008 Integrate existing impact-mode results without duplicating traversal concepts. [45m]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Run unit fixtures from `004-test`. [30m]
- [ ] T010 Run `npm run check`. [20m]
- [ ] T011 Run strict validation for this child packet. [5m]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] Analyzer returns deterministic contract-shaped output.
- [ ] All five signals are covered by tests.
- [ ] Strict validation passes.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Parent**: `../spec.md`
- **Contract**: `../001-contract/spec.md`
- **Tests**: `../004-test/spec.md`
<!-- /ANCHOR:cross-refs -->
