---
title: "Tasks: Phase 4 Verification Closeout"
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
    packet_pointer: "skilled-agent-orchestration/135-cli-hub-rename/004-verify-closeout"
    last_updated_at: "2026-07-13T06:08:29Z"
    last_updated_by: "markdown-agent"
    recent_action: "Recorded verification results and blockers"
    next_safe_action: "Rerun blocked gates after authorized prerequisite repair"
    blockers:
      - "Missing stale @spec-kit/shared dist"
      - "Four unrelated missing graph key paths"
      - "Stale compiled mcp-server dist; rebuild forbidden"
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "135-cli-hub-rename-doc-finalization"
      parent_session_id: null
    completion_pct: 70
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 4: verify-closeout

<!-- SPECKIT_LEVEL: 3 -->

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

- [x] T001 Inventory required closeout checks.
- [x] T002 Separate product failures from environment blockers.
- [x] T003 Define no-rebuild scope boundary.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Run prompt-quality-card sync: PASS.
- [x] T005 Run routing projection freshness check: PASS.
- [x] T006 Run local advisor smoke: PASS.
- [x] T007 Run rename-invariants plus routing-registry drift: 11 tests PASS.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 [B] Run executor-delegation suite; blocked by missing stale `@spec-kit/shared` dist.
- [ ] T009 [B] Run skill graph compiler/validate; blocked by four unrelated missing graph key paths.
- [ ] T010 [B] Run recursive strict validation; blocked by stale compiled mcp-server dist and rebuild prohibition.
- [x] T011 Update canonical packet docs with honest status.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 tasks complete.
- [ ] No blocked tasks remain.
- [x] Executed targeted checks are documented.
- [x] Full validation is not claimed.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
