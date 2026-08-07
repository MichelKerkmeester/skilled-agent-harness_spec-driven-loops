---
title: "Tasks: Phase 4: mcp-contract-parity [template:level_1/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "mcp contract parity tasks"
  - "tool schema tasks"
  - "governance ingest tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/013-comprehensive-audit-remediation/004-mcp-contract-parity"
    last_updated_at: "2026-06-04T20:45:43Z"
    last_updated_by: "implementation-engineer"
    recent_action: "Marked all contract-parity tasks complete"
    next_safe_action: "Central typecheck and vitest run"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/tool-contract-parity.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-004-mcp-contract-parity"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 4: mcp-contract-parity

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

- [x] T001 Re-read all target files and confirm drifted line numbers
- [x] T002 Confirm D2 reconcile schema/Zod/allow-list already aligned (no redo)
- [x] T003 [P] Locate the post-insert governance step in handleMemorySave
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 D1: dual-surface coverage predicate + dimTable rename (lib/embedders/embedding-reconcile.ts)
- [x] T005 D2: activeOnly reserved-no-op + remove `[Phase 007]` token (tool-schemas.ts, embedding-reconcile.ts)
- [x] T006 D4/D5: governance + backfill public props (tool-schemas.ts)
- [x] T007 Cross-cluster B: causal tenant/user/agent fields (tool-schemas.ts, schemas/tool-input-schemas.ts)
- [x] T008 D3: thread governance through indexMemoryFile + scan + ingest + job-queue + ScanArgs (4 handlers + types.ts)
- [x] T009 D6: correct stale-graph guidance + routing gate + worker governance forwarding (context-server.ts)
- [x] T010 D7: author tool-contract-parity.vitest.ts (tests/)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Update D1 test count (2 to 3) + add apply-parity assertion (tests/vector-coverage-hygiene.vitest.ts)
- [x] T012 Add D3 governance-threading assertion (tests/handler-memory-ingest.vitest.ts) + D6 guidance assertions (tests/context-server.vitest.ts)
- [x] T013 Update documentation (spec/plan/tasks/implementation-summary)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Verification authored (central run deferred per cluster policy)
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
