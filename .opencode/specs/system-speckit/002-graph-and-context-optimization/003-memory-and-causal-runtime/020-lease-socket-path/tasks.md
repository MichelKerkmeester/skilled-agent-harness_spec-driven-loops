---
title: "Tasks: Lease Socket-Path Persistence"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "lease socket path tasks"
  - "prefer stored socket tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/020-lease-socket-path"
    last_updated_at: "2026-06-04T13:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "All tasks complete; tests green"
    next_safe_action: "Deploy"
    blockers: []
    key_files:
      - ".opencode/bin/lib/launcher-ipc-bridge.cjs"
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Tasks: Lease Socket-Path Persistence

<!-- SPECKIT_LEVEL: 2 -->
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

- [x] T001 Read all three `.cjs` files + launcher/bridge call sites (`.opencode/bin/lib/model-server-supervision.cjs`, `.opencode/bin/mk-spec-memory-launcher.cjs`, `.opencode/bin/lib/launcher-ipc-bridge.cjs`)
- [x] T002 Confirm skill-advisor + code-index leases never carry `socketPath` (grep their launchers)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add optional `socketPath` arg + additive field to shared `buildLeaseObject` (`.opencode/bin/lib/model-server-supervision.cjs`)
- [x] T004 Pass owner's resolved socket path via the mk-spec-memory `buildLeaseObject` wrapper + `writeLeaseFile` (`.opencode/bin/mk-spec-memory-launcher.cjs`)
- [x] T005 Surface `lease.socketPath` (null when absent) onto `leaseHeldFromFile`'s result (`.opencode/bin/mk-spec-memory-launcher.cjs`)
- [x] T006 Prefer usable `leaseResult.socketPath`, fall back to `getIpcSocketPath(...)`; keep tcp:// and no-bridge-socket branches (`.opencode/bin/lib/launcher-ipc-bridge.cjs`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 `node --check` on all three `.cjs` files (clean)
- [x] T008 Add 5 unit tests (emit/omit + bridge prefer/fallback/no-bridge-socket) (`.opencode/skills/system-spec-kit/mcp_server/tests/launcher-ipc-bridge-probe.vitest.ts`)
- [x] T009 Run launcher-lease, launcher-ipc-bridge, launcher-ipc-bridge-probe, launcher-recycle-lease, launcher-session-proxy suites (34 passed, 16 skipped)
- [x] T010 Update spec/plan/tasks/checklist/implementation-summary docs
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Test + syntax verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Predecessor**: packet `018-front-proxy-recycle-hardening` (deferred defect (c))
<!-- /ANCHOR:cross-refs -->
