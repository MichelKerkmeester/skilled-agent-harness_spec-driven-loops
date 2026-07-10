---
title: "Tasks: Phase 7: routing-benchmark-and-review"
description: "Task list for the Lane-C hub benchmark and independent deep-review that resolve the deferred figma-transport routing question."
trigger_phrases:
  - "routing benchmark tasks"
  - "lane-c hub benchmark tasks"
  - "deep-review fold-in tasks"
  - "phase 007 tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/126-mcp-tooling-parent/007-routing-benchmark-and-review"
    last_updated_at: "2026-07-09T22:30:00Z"
    last_updated_by: "claude"
    recent_action: "Drafted pending benchmark and review tasks"
    next_safe_action: "Run the benchmark and review after integration lands"
    blockers: []
    key_files:
      - ".opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/007-routing-benchmark-and-review/spec.md"
      - ".opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/007-routing-benchmark-and-review/plan.md"
      - ".opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/007-routing-benchmark-and-review/tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-007-routing-benchmark-and-review"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 7: routing-benchmark-and-review

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

- [ ] T001 Confirm phase 006 complete: hub identity wired, referrers repointed, advisor rebuilt
- [ ] T002 Prepare Lane-C benchmark scenarios for the three modes, including figma-transport routing
- [ ] T003 [P] Scope the independent deep-review over the full fold-in diff
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Run the Lane-C skill-benchmark; capture the report under `mcp-tooling/benchmark/router-final/`
- [ ] T005 Run the independent deep-review pass; record P0/P1/P2 findings
- [ ] T006 Resolve the figma-transport routing carve-out: keep metadata routing, or record a routing-config amendment against phase 002's ADR-001/ADR-006
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Confirm the benchmark report covers all three modes and the transport routing
- [ ] T008 Confirm deep-review P0/P1 findings are resolved or explicitly deferred with rationale
- [ ] T009 Run phase-folder validation
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Benchmark report generated; deep-review findings resolved or deferred; routing question closed with evidence
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
