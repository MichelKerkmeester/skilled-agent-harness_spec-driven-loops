---
title: "Tasks: Owner-Lease Heartbeat-Staleness Detection"
description: "Implementation tasks for Owner-Lease Heartbeat-Staleness Detection."
trigger_phrases:
  - "owner-lease-heartbeat-staleness-detection"
  - "009 phase 013"
  - "phase 007 owner-lease gap"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/013-owner-lease-heartbeat-staleness-detection"
    last_updated_at: "2026-05-22T15:38:39Z"
    last_updated_by: "codex"
    recent_action: "completed-arc-009-phase-013-owner-lease-heartbeat-staleness"
    next_safe_action: "arc-009-complete"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0a03030303030303030303030303030303030303030303030303030303030303"
      session_id: "009-memory-leak-remediation-013"
      parent_session_id: null
    completion_pct: 100
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

- [x] T001 Extend `OwnerClassification` union with `stale-heartbeat-reclaim`. (`.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts`)
- [x] T002 Add the heartbeat-staleness rule to `classifyOwner` at precedence position 4. (`.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts`)
- [x] T003 Ensure `acquireOwnerLease` treats `stale-heartbeat-reclaim` identically to `stale-pid` for reclaim: atomic write-temp+rename, no signal to old owner. (`.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Read `mcp_server/index.ts` and verify periodic `refreshOwnerLease` exists. If not, add it with interval `ttlMs / 3` and clear timer on shutdown. (`.opencode/skills/system-code-graph/mcp_server/index.ts`)
- [x] T005 Update `mk-code-index-launcher.cjs` to treat `stale-heartbeat-reclaim` as reclaim-eligible. (`.opencode/bin/mk-code-index-launcher.cjs`)
- [x] T006 Add Vitest for `classifyOwner` stale-heartbeat scenario: lease with `lastHeartbeatIso` set to `now - ttlMs * 3`, PID alive, expect `stale-heartbeat-reclaim`. (`.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts`)
- [x] T007 Add Vitest for healthy heartbeat case: recent heartbeat, PID alive, expect `live-owner`. (`.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts`)
- [x] T008 Add Vitest for healthy refresh across multiple windows: simulate refresh every `ttlMs / 3` and assert `live-owner` after each interval. (`.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts`)
- [x] T009 Add Vitest for end-to-end reclaim: acquire lease, manually mutate file to set old heartbeat, second acquire reclaims and returns `{ acquired: true }`. (`.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run typecheck, targeted Vitest, and sibling regression; `launcher-lease.vitest.ts` must not regress. (`.opencode/skills/system-code-graph`)
- [x] T011 Update phase 007 `implementation-summary.md` Limitations anchor. (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/007-code-graph-launcher-and-db-lifecycle/implementation-summary.md`)
- [x] T012 Fill this phase's `implementation-summary.md` with evidence and commit handoff. (`implementation-summary.md`)
- [x] T013 Strict validate this phase, parent arc, and phase 007. (`validate.sh --strict`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] T001-T009 prove stale owners are reclaimable and healthy owners remain live.
- [x] T010 passes or any failure is documented with exact output and next safe action.
- [x] T011-T012 record predecessor closure, tests, reconnect evidence, limitations, and commit handoff.
- [x] T013 exits 0 for this phase, parent arc, and phase 007.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Parent arc**: `../spec.md`
- **Phase spec**: `./spec.md`
- **Source phase**: `../../009-memory-leak-remediation/007-code-graph-launcher-and-db-lifecycle/implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
