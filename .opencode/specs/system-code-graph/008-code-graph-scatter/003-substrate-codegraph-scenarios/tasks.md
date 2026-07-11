---
title: "Tasks: Substrate Code-Graph scenario tool-contract fix"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "substrate code-graph tool-contract tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-code-graph/008-code-graph-scatter/003-substrate-codegraph-scenarios"
    last_updated_at: "2026-05-30T23:10:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored tasks to manifest scaffold"
    next_safe_action: "Gate then commit"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/manual_testing_playbook/local-llm-query-intelligence/403-code-intent-matching.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000003612"
      session_id: "036-002-tasks"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Tasks: Substrate Code-Graph scenario tool-contract fix

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

- [x] T001 Find + read the AUTHORITATIVE code-graph schema (system-code-graph/mcp_server/tool-schemas.ts) — confirmed code_graph_query is structural (required: operation+subject) and code_graph_context exists (required:[], input + queryMode enum neighborhood/outline/impact). Corrected two earlier false claims (wrong file / wrong handler).
- [x] T002 Map every code_graph_query call site: 403 (4 calls + 1 prose ref), 404 (3), 407 (3); confirm 1:1 with query:/num_results: lines for safe uniform-prefix replace
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Rewrite 403: 4 calls + prose ref → code_graph_context({input, queryMode: "neighborhood"})
- [x] T004 Rewrite 404: 3 calls → code_graph_context({input, queryMode: "neighborhood"})
- [x] T005 Rewrite 407: 3 calls → code_graph_context({input, queryMode: "neighborhood"})
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Count check: 403 context(4)/input(4)/queryMode(4)/0 stale; 404 context(3); 407 context(3); 0 code_graph_query/num_results across the 3 files; 410 still memory_search
- [x] T007 Run npm run stress:substrate — 403/404/407 SKIP before AND after (no regression); runner:mk-spec-memory FAIL + 410 SKIP are pre-existing SQ1, unrelated; strict-validate the packet
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Playbooks call the verified tool + params
- [x] No regression to the automated SKIP outcome
- [x] Honest deferral of live 2nd-daemon wiring recorded
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Tool schema**: `.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts` (code_graph_context)
<!-- /ANCHOR:cross-refs -->
