---
title: "Tasks: Owner-Lease Heartbeat-Staleness Detection"
description: "Implementation tasks for Owner-Lease Heartbeat-Staleness Detection."
trigger_phrases:
  - "owner-lease-heartbeat-staleness-detection"
  - "010 follow-on 3"
  - "phase 007 owner-lease gap"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/010-memory-leak-follow-ons-arc/003-owner-lease-heartbeat-staleness-detection"
    last_updated_at: "2026-05-22T18:30:00Z"
    last_updated_by: "codex"
    recent_action: "Scaffolded follow-on phase."
    next_safe_action: "Plan and execute this phase when ready."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0a03030303030303030303030303030303030303030303030303030303030303"
      session_id: "010-memory-leak-follow-ons-arc-003"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Gap discovered during arc 009 closure when mk_code_index MCP reconnect failed with -32000 against a live orphan launcher whose heartbeat was 22 minutes stale against a 60-second TTL."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Owner-Lease Heartbeat-Staleness Detection

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

- [ ] T001 Read the child spec and arc 009 phase 007 source evidence. (`spec.md`, `../../009-memory-leak-remediation-arc/007-code-graph-launcher-and-db-lifecycle/implementation-summary.md`)
- [ ] T002 Read owner-lease, launcher, and current owner-lease tests. (`owner-lease.ts`, `mk-code-index-launcher.cjs`, `owner-lease.vitest.ts`)
- [ ] T003 Replace scaffold placeholders in `plan.md` with concrete owner-lease design. (`plan.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add `stale-heartbeat-reclaim` to owner classification. (`.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts`)
- [ ] T005 Extend classifier logic for live PID plus stale heartbeat. (`.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts`)
- [ ] T006 Wire launcher reclaim eligibility for the new classification. (`.opencode/bin/mk-code-index-launcher.cjs`)
- [ ] T007 Verify or add heartbeat refresh for healthy owners. (`.opencode/skills/system-code-graph/mcp_server/index.ts`)
- [ ] T008 Add stale-heartbeat reclaim tests. (`.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts`)
- [ ] T009 Add healthy heartbeat non-reclaim tests. (`.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Run targeted owner-lease tests. (`.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts`)
- [ ] T011 Run reconnect verification where available. (`mk_code_index` MCP reconnect path)
- [ ] T012 Fill implementation evidence and limitations. (`implementation-summary.md`)
- [ ] T013 Strict-validate this phase and the parent arc. (`validate.sh --strict`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] T004-T009 prove stale owners are reclaimable and healthy owners remain live.
- [ ] T010-T011 pass or are documented with explicit environment limits.
- [ ] T012 records tests, reconnect evidence, and limitations.
- [ ] T013 exits 0 for both phase and parent arc.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Parent arc**: `../spec.md`
- **Phase spec**: `./spec.md`
- **Source phase**: `../../009-memory-leak-remediation-arc/007-code-graph-launcher-and-db-lifecycle/implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
