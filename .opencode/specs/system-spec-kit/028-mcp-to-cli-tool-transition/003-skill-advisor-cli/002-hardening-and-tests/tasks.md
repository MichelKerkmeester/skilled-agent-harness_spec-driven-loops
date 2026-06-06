---
title: "Tasks: Phase 2: Hardening and Tests [system-spec-kit/028-mcp-to-cli-tool-transition/003-skill-advisor-cli/002-hardening-and-tests/tasks]"
description: "Planned task breakdown for Hardening and Tests; rows expand at speckit:plan time."
trigger_phrases:
  - "skill-advisor hardening and tests tasks"
  - "003 002-hardening-and-tests tasks"
  - "skill-advisor phase 2 tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-mcp-to-cli-tool-transition/003-skill-advisor-cli/002-hardening-and-tests"
    last_updated_at: "2026-06-06T15:55:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Audit findings propagated to companions"
    next_safe_action: "Run speckit:plan on this phase to expand the plan before implementation"
    blockers: []
    key_files:
      - "tasks.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Phase 2: Hardening and Tests

<!-- SPECKIT_LEVEL: 1 -->
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

- [ ] T000 Verify predecessor handoff criteria and run speckit:plan for this phase
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T001 D2 parity fixture: the 10-prompt local-vs-native set runs in CI; identical top recommendation required — the research measured 10/10; the fixture keeps it true
- [ ] T002 D5 job semantics: measure advisor_rebuild + skill_graph_scan wall-time under mutation (the research residual); decide per-call vs progress-reporting job UX from the measurement; generation before/after reported
- [ ] T003 D6 orphan-reaping fixtures: stale lease/no socket, killed parent, removed worktree
- [ ] T004 Dual-client coverage: MCP + CLI against one daemon; FS-watcher rebuild behavior under concurrent clients
- [ ] T005 Resident-service fixtures: status trust-state split, telemetry/shadow-sink preservation, and embedder resolution under CLI scan/rebuild each get an assertion
- [ ] T006 Tri-daemon spawn drill (program gate, owned here): spec-memory + code-index + skill-advisor CLIs auto-spawn simultaneously in one runtime/worktree; all three launchers hold single-owner leases and reap cleanly
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T9xx All fixtures green incl. parity + zero orphans; job semantics documented with measurements
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] P0 requirements in spec.md verified with evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research authority**: `../000-skill-advisor-cli-research/research/research.md`
<!-- /ANCHOR:cross-refs -->
