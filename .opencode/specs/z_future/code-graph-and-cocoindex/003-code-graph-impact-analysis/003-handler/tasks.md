---
title: "Tasks: 027/004/003 Impact Analysis Handler"
description: "Task scaffold for MCP handler and optional LLM enrichment adapter."
trigger_phrases:
  - "027 004 003 handler tasks"
  - "impact handler tasks"
importance_tier: "important"
contextType: "task"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-code-graph-and-cocoindex/003-code-graph-impact-analysis/003-handler"
    last_updated_at: "2026-05-12T00:00:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Created Level 2 scaffold for 003-handler"
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
# Tasks: 027/004/003 Impact Analysis Handler

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

- [ ] T001 Read `001-contract` request/response types. [10m]
- [ ] T002 Review existing code graph handler patterns. [20m]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Create `mcp_server/code_graph/handlers/impact-analysis.ts`. [45m]
- [ ] T004 Register `code_graph_impact_analysis` in the tool surface. [15m]
- [ ] T005 Add optional `code-graph-llm-risk-enrich.ts` adapter or explicit skipped behavior. [60m]
- [ ] T006 Gate enrichment by env/provider config and enforce budgets if implemented. [45m]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Add or run handler integration tests. [30m]
- [ ] T008 Run `npm run check`. [20m]
- [ ] T009 Run strict validation for this child packet. [5m]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] Tool is registered.
- [ ] Default output does not call a remote provider.
- [ ] Strict validation passes.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Parent**: `../spec.md`
- **Contract**: `../001-contract/spec.md`
- **Library**: `../002-lib-impl/spec.md`
<!-- /ANCHOR:cross-refs -->
