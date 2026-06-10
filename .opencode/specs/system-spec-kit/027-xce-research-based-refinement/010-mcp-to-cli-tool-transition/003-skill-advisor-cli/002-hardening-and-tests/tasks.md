---
title: "Tasks: Phase 2: Hardening and Tests [system-spec-kit/028-mcp-to-cli-tool-transition/003-skill-advisor-cli/002-hardening-and-tests/tasks]"
description: "Task breakdown for Hardening and Tests; all rows complete with shipped suite and tri-daemon drill evidence."
trigger_phrases:
  - "skill-advisor hardening and tests tasks"
  - "003 002-hardening-and-tests tasks"
  - "skill-advisor phase 2 tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-mcp-to-cli-tool-transition/003-skill-advisor-cli/002-hardening-and-tests"
    last_updated_at: "2026-06-09T20:17:55Z"
    last_updated_by: "claude-fable-5"
    recent_action: "Reconciled task rows with shipped suites + passed tri-daemon drill"
    next_safe_action: "Continue dual-stack observation window"
    blockers: []
    key_files:
      - "tasks.md"
    completion_pct: 100
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

- [x] T000 Verify predecessor handoff criteria and run speckit:plan for this phase
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T001 D2 parity fixture: the 10-prompt local-vs-native set runs in CI; identical top recommendation required — the research measured 10/10; the fixture keeps it true
- [x] T002 D5 job semantics: measure advisor_rebuild + skill_graph_scan wall-time under mutation (the research residual); decide per-call vs progress-reporting job UX from the measurement; generation before/after reported
- [x] T003 D6 orphan-reaping fixtures: stale lease/no socket, killed parent, removed worktree; N-probe-gated reap under the respawn lock; killed-parent exercises ppid-reparent liveness; stale reclaim may adopt a warm daemon
- [x] T004 Dual-client coverage: MCP + CLI against one daemon; FS-watcher rebuild behavior under concurrent clients
- [x] T005 Resident-service fixtures: status trust-state split, telemetry/shadow-sink preservation, and embedder resolution under CLI scan/rebuild each get an assertion
- [x] T006 Tri-daemon spawn drill (program gate, owned here): spec-memory + code-index + skill-advisor CLIs auto-spawn simultaneously in one runtime/worktree with SPECKIT_DAEMON_REELECTION pinned (no spurious respawn); per-launcher single-owner (skill-advisor via launcher-PID + daemon lease, no owner-lease file); respawn-lock serializes the three spawns with no cross-daemon deadlock; reap diverges (spec-memory recycles on SIGTERM, code-index/skill-advisor exit); zero orphans at teardown — DRILL PASSED
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T9xx All fixtures green incl. parity + zero orphans; job semantics documented with measurements
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] P0 requirements in spec.md verified with evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research authority**: `../000-skill-advisor-cli-research/research/research.md`
<!-- /ANCHOR:cross-refs -->
