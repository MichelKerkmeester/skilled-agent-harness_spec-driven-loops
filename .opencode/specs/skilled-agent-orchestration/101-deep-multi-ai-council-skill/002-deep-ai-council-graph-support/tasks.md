---
title: "Tasks: 101/002 Deep AI Council Graph Support"
description: "Task list for future council graph support planning and optional implementation after the dedicated skill boundary validates."
trigger_phrases:
  - "101/002 tasks"
  - "deep-ai-council graph tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/101-deep-multi-ai-council-skill/002-deep-ai-council-graph-support"
    last_updated_at: "2026-05-10T06:45:00Z"
    last_updated_by: "openai-gpt-5.5-opencode"
    recent_action: "Authored graph support task list"
    next_safe_action: "Wait for Phase 001 before starting graph design"
    blockers:
      - "Depends on Phase 001 skill boundary shipping first"
    key_files:
      - .opencode/skills/deep-ai-council/
      - .opencode/skills/system-spec-kit/mcp_server/database/
      - .opencode/skills/system-spec-kit/mcp_server/lib/
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "101-002-graph-support"
      parent_session_id: null
    completion_pct: 5
    open_questions:
      - "Should Phase 002 deliver design only first or include implementation after Phase 001 lands?"
    answered_questions:
      - "Do not reuse deep-loop graph as-is for council support."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: 101/002 Deep AI Council Graph Support

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

- [x] T001 Scaffold Phase 002 spec folder (`002-deep-ai-council-graph-support/`)
- [x] T002 Record graph support as future phase, not Phase 001 scope
- [ ] T003 Confirm Phase 001 validation evidence exists
- [ ] T004 Inventory council artifact schema after Phase 001 lands
- [ ] T005 Review deep-loop graph schema and readiness behavior as reference only
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T006 Choose graph option: dedicated council graph, adapted support, or continued deferral
- [ ] T007 Define node kinds and edge relations
- [ ] T008 Define council convergence signals and blockers
- [ ] T009 Design storage, reducer, query, readiness, and recovery contracts
- [ ] T010 Implement selected graph support only if design gate passes
- [ ] T011 Update `deep-ai-council` references with graph workflow guidance
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 Test schema, migrations, and rollback
- [ ] T013 Test reducer idempotency and invalid edge rejection
- [ ] T014 Test query bounds and prompt-safe outputs
- [ ] T015 Test convergence thresholds and blockers
- [ ] T016 Test stale/missing/corrupt graph recovery behavior
- [ ] T017 Run `validate.sh --strict` on this phase folder
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Graph option decision is explicit and justified
- [ ] Council graph semantics stay separate from research/review deep-loop semantics
- [ ] Phase 002 validation passes without warnings
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Parent**: `../spec.md`
- **Predecessor**: `../001-deep-ai-council-skill-creation/spec.md`
<!-- /ANCHOR:cross-refs -->
