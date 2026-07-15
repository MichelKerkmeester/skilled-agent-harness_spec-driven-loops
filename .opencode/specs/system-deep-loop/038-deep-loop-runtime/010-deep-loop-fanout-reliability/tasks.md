---
title: "Tasks: Phase 1: deep-loop-fanout-reliability [template:level_1/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "fanout reliability tasks"
  - "deep loop fanout tasks"
  - "fanout fix checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/038-deep-loop-runtime/010-deep-loop-fanout-reliability"
    last_updated_at: "2026-06-04T23:10:00Z"
    last_updated_by: "implementation-engineer"
    recent_action: "Completed all fan-out fix tasks T001-T012"
    next_safe_action: "None remaining, phase complete"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-013-001-deep-loop-fanout-reliability"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1: deep-loop-fanout-reliability

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

- [x] T001 Read verified backlog A1-A7 + re-read fanout-run/pool, executor-config, tests
- [x] T002 Confirm A5 decision: review writes iteration artifacts into lineageDir (workspace-write stays)
- [x] T003 [P] Confirm deep-research/deep-review loops consume config.maxIterations
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 A7 strip perishable labels: code-graph-tools.ts SLOT comments, core/config.ts ADR ids, fanout-pool.cjs packet-122 x2 (REQ-007)
- [x] T005 A2 import spawn + add runLineageProcess async helper preserving timeout/SIGTERM/env/maxBuffer/stdin (REQ-002, fanout-run.cjs)
- [x] T006 A4 cli-codex branch omits service_tier pair when serviceTier falsy (REQ-004, fanout-run.cjs)
- [x] T007 A5 document review sandbox-default rationale at resolve* block (REQ-005, fanout-run.cjs)
- [x] T008 A2 swap worker spawnSync for awaited runLineageProcess (REQ-002, fanout-run.cjs)
- [x] T009 A1 throw on non-zero exit / timeout after salvage sweep (REQ-001, fanout-run.cjs)
- [x] T010 A3 thread config.maxIterations + stop clause into buildLoopPrompt (REQ-003, fanout-run.cjs)
- [x] T011 A6 SKILL.md script inventory: 8 .cjs files + fan-out entry points (REQ-006, SKILL.md)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Add regression tests (non-zero exit -> exit 3, mixed -> exit 2, parallel timing, service_tier omission, iteration cap) and run vitest + tsc + grep
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (vitest 29 pass, tsc clean, grep clean)
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
