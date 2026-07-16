---
title: "Tasks: Phase 3: memory-write-correctness [template:level_1/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "memory write correctness tasks"
  - "entity density hook tasks"
  - "atomic save recovery tasks"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/000-release-and-program-cleanup/013-comprehensive-audit-remediation/003-memory-write-correctness"
    last_updated_at: "2026-06-04T20:45:42Z"
    last_updated_by: "cluster-c-write-correctness"
    recent_action: "Completed C1 source wiring and C1/C2 regression tests"
    next_safe_action: "Defer mcp_server typecheck and vitest to central verification"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/mutation-hooks.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-types.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/integration/entity-density-commit-hooks.vitest.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/transaction-manager-recovery.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/003-memory-write-correctness"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 3: memory-write-correctness

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

- [x] T001 Extract C1/C2 findings from verified backlog
- [x] T002 Read owned source and test files
- [x] T003 [P] Confirm `invalidateEntityDensityCache` and recovery helper exports
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add optional `entityDensityCacheCleared` field to MutationHookResult (handlers/memory-crud-types.ts) — REQ-003
- [x] T005 Import `invalidateEntityDensityCache` in the shared hook (handlers/mutation-hooks.ts) — REQ-002
- [x] T006 Call it in a guarded try/catch and record the field in the result (handlers/mutation-hooks.ts) — REQ-002
- [x] T007 Confirm fallback MutationHookResult literals still compile with the optional field (handlers/*.ts) — REQ-003
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Add memory_update trigger-phrase rewrite case, no TTL wait (tests/integration/entity-density-commit-hooks.vitest.ts) — REQ-004
- [x] T009 Add uuid-suffixed orphan-recovery case (tests/transaction-manager-recovery.vitest.ts) — REQ-005, REQ-006
- [x] T010 Update spec/plan/tasks/implementation-summary docs
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual read-back review passed; execution deferred to central verification
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
