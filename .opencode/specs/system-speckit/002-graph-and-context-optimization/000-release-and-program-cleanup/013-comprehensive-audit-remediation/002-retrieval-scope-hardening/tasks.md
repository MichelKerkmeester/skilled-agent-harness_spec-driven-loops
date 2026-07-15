---
title: "Tasks: Phase 2: retrieval-scope-hardening [template:level_1/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "retrieval scope tasks"
  - "causal graph tasks"
  - "session trust tasks"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/000-release-and-program-cleanup/013-comprehensive-audit-remediation/002-retrieval-scope-hardening"
    last_updated_at: "2026-06-04T20:45:41Z"
    last_updated_by: "implementation-engineer"
    recent_action: "Completed B1-B5 tasks"
    next_safe_action: "Defer mcp_server tsc and vitest to central verification"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/002-retrieval-scope-hardening"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 2: retrieval-scope-hardening

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

- [x] T001 Extract B1-B5 from verified backlog and re-read target files
- [x] T002 Confirm scope-governance and session-manager contracts
- [x] T003 [P] Confirm sessionId is excluded from the row-access boundary
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 B1 add scope columns to community SELECT + filterRowsByScope when scoped (handlers/memory-search.ts) [REQ-002]
- [x] T005 B4 validate caller sessionId via resolveTrustedSession, return E_SESSION_SCOPE on failure (handlers/memory-search.ts) [REQ-005]
- [x] T006 B2 post-filter drift-why source/related rows + causal-link endpoint scope, fail-closed (handlers/causal-graph.ts) [REQ-003]
- [x] T007 B3 FK existence check for both endpoints before insertEdge (handlers/causal-graph.ts) [REQ-004]
- [x] T008 B5 derive scope-mixed no-session anchor only when scoped (handlers/memory-context.ts) [REQ-006]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 B1 scope-filter cases (tests/community-search.vitest.ts) [REQ-007]
- [x] T010 B2/B3 scope + FK cases with real in-memory DB (tests/handler-causal-graph.vitest.ts) [REQ-007]
- [x] T011 B4 session-trust cases (tests/gate-d-regression-session-dedup.vitest.ts) [REQ-007]
- [x] T012 B5 anchor-isolation cases (tests/session-lifecycle.vitest.ts) [REQ-007]
- [x] T013 Record cross-cluster schema note for cluster D [REQ-008]
- [x] T014 Read-back compile-safety review; defer tsc/vitest to central [REQ-001]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Read-back verification passed; central runs tsc/vitest
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
