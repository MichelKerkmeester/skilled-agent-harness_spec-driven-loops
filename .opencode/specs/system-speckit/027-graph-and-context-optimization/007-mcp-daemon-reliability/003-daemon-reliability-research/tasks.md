---
title: "Tasks: MCP daemon reliability investigation + durable-fix roadmap"
description: "Research tasks (parallel fan-out + convergence + synthesis) and the follow-on implementation tasks for the ranked durable fixes."
trigger_phrases:
  - "mcp daemon reliability tasks"
  - "daemon durable fix tasks"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/007-mcp-daemon-reliability/003-daemon-reliability-research"
    last_updated_at: "2026-05-28T18:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Research tasks complete; follow-on fix tasks F1-F6 enumerated as pending"
    next_safe_action: "Open a follow-on packet to implement F2 then F1 then F3"
    blockers: []
    key_files:
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/003-daemon-reliability-research/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000303"
      session_id: "030-tasks"
      parent_session_id: null
    completion_pct: 60
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: MCP daemon reliability investigation + durable-fix roadmap

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

- [x] T001 Enumerate recurring failure modes from session evidence
- [x] T002 Assign five facets to parallel investigators
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 [P] Investigate memory growth / OOM (native ONNX + provider swaps)
- [x] T004 [P] Investigate launcher lease + IPC-bridge respawn
- [x] T005 [P] Investigate rebuild-while-running crash
- [x] T006 [P] Investigate health/auto-restart supervision gap
- [x] T007 [P] Investigate timer/listener/background-job leaks
- [x] T008 Converge: verify top-3 claims by direct read; synthesize `research/research.md`
- [x] T015 [P] Iteration 2 (4 Opus agents): deepen + design F2/F1/F3 + verify RC-5 (`research/iterations/iteration-002.md`)
- [x] T016 [P] Iteration 3 (4 Opus skeptics): adversarially refute each design + interactions (`research/iterations/iteration-003.md`)
- [x] T017 Synthesize corrections into `research/research.md` §6 (sidecar RC-1, hardened F1/F2/F3, RC-5 refuted)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Findings cross-consistent + file:line evidence captured
- [ ] T010 [Follow-on] Implement F2 dispose provider on invalidate (`shared/embeddings.ts`, `hf-local.ts`)
- [ ] T011 [Follow-on] Implement F1 launcher RSS watchdog + supervised respawn (`mk-spec-memory-launcher.cjs`)
- [ ] T012 [Follow-on] Implement F3 bridge liveness probe + respawn on dead socket (`launcher-ipc-bridge.cjs`)
- [ ] T013 [Follow-on] Implement F4 build to temp dir + atomic rename (mcp_server build)
- [ ] T014 [Follow-on] Implement F5 close secondaryServer on disconnect (`socket-server.ts`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Root causes documented with evidence
- [x] Ranked durable fixes specified (research/research.md §3)
- [ ] Fixes implemented (follow-on packet)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Full analysis**: See `research/research.md`
<!-- /ANCHOR:cross-refs -->
