---
title: "Tasks: launcher lease acquisition-time reclaim [template:level_1/tasks.md]"
description: "Open tasks for launcher acquisition-time stale lease reclaim."
trigger_phrases:
  - "launcher lease acquisition reclaim"
  - "stale lease CAS"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/013-launcher-lease-acquisition-reclaim"
    last_updated_at: "2026-05-21T10:16:26Z"
    last_updated_by: "codex"
    recent_action: "Authored open task list"
    next_safe_action: "Implement atomic acquisition reclaim and race regression"
    blockers: []
    completion_pct: 0
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: launcher lease acquisition-time reclaim

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- **Status**: `[x]` complete, `[ ]` open, `[!]` blocked
- **Priority**: P0 blocks packet completion; P1 can be deferred only with operator approval
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

| Task | P | Description | Status | Evidence |
|------|---|-------------|--------|----------|
| T001 | P0 | Read `lease.ts:226-247` to confirm existing read-path liveness behavior. | `[ ]` | Planned |
| T002 | P0 | Read `lease.ts:300-317` to confirm acquisition race window. | `[ ]` | Planned |
| T003 | P0 | Locate existing daemon lease tests and fixtures. | `[ ]` | Planned |
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

| Task | P | Description | Status | Evidence |
|------|---|-------------|--------|----------|
| T004 | P0 | Implement CAS-style stale reclaim in `acquireSkillGraphLease()`. | `[ ]` | Planned |
| T005 | P0 | Add two-contender stale-row regression. | `[ ]` | Planned |
| T006 | P0 | Preserve live-owner and EPERM paths. | `[ ]` | Planned |
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

| Task | P | Description | Status | Evidence |
|------|---|-------------|--------|----------|
| T007 | P0 | Run targeted daemon lease tests. | `[ ]` | Planned |
| T008 | P0 | Run any launcher concurrency regression suite. | `[ ]` | Planned |
| T009 | P0 | Run strict-validate on the packet. | `[ ]` | Planned |
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

All P0 rows above are `[x]`, implementation evidence is copied into `implementation-summary.md`, and strict validation exits 0 for the packet.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Predecessor `../011-sun-path-and-stale-lease-followups/spec.md`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/daemon/lease.ts:226` read-path liveness probe
- `.opencode/skills/system-skill-advisor/mcp_server/lib/daemon/lease.ts:300` acquisition transaction
<!-- /ANCHOR:cross-refs -->
