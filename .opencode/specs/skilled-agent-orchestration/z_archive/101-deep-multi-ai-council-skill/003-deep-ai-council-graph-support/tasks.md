---
title: "Tasks: 101/003 Deep AI Council Graph Support"
description: "Task list for dedicated derived council graph support implementation after the dedicated skill boundary validates."
trigger_phrases:
  - "101/003 tasks"
  - "deep-ai-council graph tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/101-deep-multi-ai-council-skill/003-deep-ai-council-graph-support"
    last_updated_at: "2026-05-11T05:20:00Z"
    last_updated_by: "openai-gpt-5.5-opencode"
    recent_action: "Fixed deep-review findings and updated evidence"
    next_safe_action: "Run final verification and report outcome"
    blockers: []
    key_files:
      - .opencode/skills/deep-ai-council/
      - .opencode/skills/system-spec-kit/mcp_server/lib/council-graph/
      - .opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "101-003-graph-support"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Do not reuse deep-loop graph as-is for council support."
      - "Use a dedicated derived council graph implementation."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: 101/003 Deep AI Council Graph Support

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

- [x] T001 Scaffold Phase 003 spec folder (`003-deep-ai-council-graph-support/`)
- [x] T002 Record graph support as separate phase, not Phase 001 scope
- [x] T003 Confirm Phase 001 and 002 validation evidence exists
- [x] T004 Inventory council artifact schema after Phase 001 lands
- [x] T005 Review deep-loop graph schema and readiness behavior as reference only
- [x] T006 Add Level 3 checklist and decision record
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 Choose graph option: dedicated council graph, adapted support, or continued deferral
- [x] T011 Define node kinds and edge relations
- [x] T012 Define council convergence signals and blockers
- [x] T013 Design storage, reducer, query, readiness, and recovery contracts
- [x] T014 Implement dedicated council graph storage and query helpers
- [x] T015 Implement council graph MCP handlers and tool registration
- [x] T016 Update `deep-ai-council` references with derived graph workflow guidance
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 Test schema, migrations, and rollback
- [x] T021 Test reducer idempotency and invalid edge rejection
- [x] T022 Test query bounds and prompt-safe outputs
- [x] T023 Test convergence thresholds and blockers
- [x] T024 Test stale/missing/corrupt graph recovery behavior
- [x] T025 Run targeted MCP server tests
- [x] T026 Run `validate.sh --strict` on this phase folder
- [x] T027 Remediate deep-review findings P1-001, P1-002, P1-003, and P2-001
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Graph option decision is explicit and justified
- [x] Council graph semantics stay separate from research/review deep-loop semantics
- [x] Phase 003 validation passes without warnings
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Parent**: `../spec.md`
- **Predecessor**: `../002-deep-ai-council-reference-expansion/spec.md`
- **Decision Record**: `decision-record.md`
- **Checklist**: `checklist.md`
<!-- /ANCHOR:cross-refs -->
