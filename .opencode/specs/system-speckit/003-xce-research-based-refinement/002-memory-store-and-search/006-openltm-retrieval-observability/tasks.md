---
title: "Tasks: OpenLTM Retrieval Observability"
description: "Completed task ledger for additive retrieval observability surfaces."
trigger_phrases:
  - "tasks"
  - "name"
  - "template"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/003-xce-research-based-refinement/002-memory-store-and-search/006-openltm-retrieval-observability"
    last_updated_at: "2026-06-10T13:03:37Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Completed retrieval observability tasks"
    next_safe_action: "Keep trace surfaces additive in future changes"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/tests/openltm-retrieval-observability.vitest.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/observability/retrieval-observability.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/008-openltm-retrieval-observability"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: OpenLTM Retrieval Observability

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

- [x] T001 Identify memory search/context handlers and formatter
- [x] T002 Identify health, embedder-status, and maintenance handlers
- [x] T003 [P] Confirm no dependency, schema, or env-flag change needed
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add `why_ranked` from ranker intermediates
- [x] T005 Add inline returned-pair causal-edge warnings
- [x] T006 Add degraded-vector signal to trace, health, and embedder status
- [x] T007 Add maintenance last-run counters for scan/reconcile/retention
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Add focused Vitest suite with observability assertions
- [x] T009 Run memory-search and hybrid-search recall canaries
- [x] T010 Update phase documentation and metadata
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Verification passed or limitation documented
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
